/**
 * Sync Clerk User to Supabase Profile
 * 
 * This function creates or updates a Supabase profile when a user signs in with Clerk
 */

// This function uses the service role key for admin operations

export interface SyncUserData {
  clerkId: string
  email: string
  fullName?: string | null
  firstName?: string | null
  lastName?: string | null
  role?: string
  avatarUrl?: string | null
}

/**
 * Sync Clerk user to Supabase profile
 * Creates a profile if it doesn't exist, updates if it does
 */
export async function syncClerkUserToSupabase(userData: SyncUserData) {
  // Use service role client for admin operations
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  }
  
  console.log('🔧 Creating Supabase service client...')
  
  // Create admin client (bypasses RLS)
  const { createClient: createServiceClient } = await import('@supabase/supabase-js')
  const supabase = createServiceClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  console.log('✅ Supabase service client created')
  
  const fullName = userData.fullName || 
    (userData.firstName && userData.lastName 
      ? `${userData.firstName} ${userData.lastName}` 
      : userData.firstName || null)
  
  // Validate and set role - must be one of the allowed values
  const validRoles = ['student', 'trainer', 'admin', 'corporate'] as const
  const providedRole = userData.role?.toLowerCase().trim()
  const role = (providedRole && validRoles.includes(providedRole as any)) 
    ? (providedRole as 'student' | 'trainer' | 'admin' | 'corporate')
    : 'student'
  
  console.log('🔑 Role validation:', {
    provided: userData.role,
    validated: role,
    isValid: validRoles.includes(role)
  })
  
  // Generate UUID from Clerk ID
  const userId = generateUserIdFromClerkId(userData.clerkId)
  
  // Check if profile already exists by clerk_id or email
  console.log('🔍 Checking for existing profile...', { clerkId: userData.clerkId, email: userData.email })
  
  // Check by clerk_id first, then by email
  let existingProfile = null
  let checkError = null
  
  // Try clerk_id first
  const { data: clerkProfile, error: clerkError } = await supabase
    .from('profiles')
    .select('id, clerk_id, email')
    .eq('clerk_id', userData.clerkId)
    .maybeSingle()
  
  if (clerkProfile) {
    existingProfile = clerkProfile
  } else if (!clerkError) {
    // If no clerk_id match, try email
    const { data: emailProfile, error: emailError } = await supabase
      .from('profiles')
      .select('id, clerk_id, email')
      .eq('email', userData.email)
      .maybeSingle()
    
    if (emailProfile) {
      existingProfile = emailProfile
    }
    checkError = emailError
  } else {
    checkError = clerkError
  }
  
  if (checkError) {
    console.error('❌ Error checking for existing profile:', checkError)
    throw checkError
  }
  
  console.log('📋 Existing profile check result:', existingProfile ? 'Found' : 'Not found')
  
  if (existingProfile) {
    // Update existing profile - only update role if it's different (new sign-up) or not set
    console.log('🔄 Updating existing profile...', existingProfile.id)
    
    // Get current role from existing profile
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', existingProfile.id)
      .single()
    
    const currentRole = currentProfile?.role
    
    const updateData: any = {
      clerk_id: userData.clerkId,
      full_name: fullName,
      avatar_url: userData.avatarUrl,
      updated_at: new Date().toISOString()
    }
    
    // Only update role if:
    // 1. Current role is not set, OR
    // 2. New role is provided and different (new sign-up scenario)
    // This prevents overwriting existing roles on subsequent sign-ins
    if (role && (!currentRole || currentRole !== role)) {
      updateData.role = role
      console.log('📝 Updating role from', currentRole, 'to', role)
    } else {
      console.log('ℹ️ Keeping existing role:', currentRole)
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', existingProfile.id)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error updating Supabase profile:', error)
      console.error('❌ Update data attempted:', updateData)
      throw error
    }
    
    console.log('✅ Profile updated successfully with role:', data?.role)
    return data
  } else {
    // Create new profile
    console.log('➕ Creating new profile...', { userId, email: userData.email, role: role })
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        clerk_id: userData.clerkId,
        email: userData.email,
        full_name: fullName,
        role: role, // Ensure role is always set
        avatar_url: userData.avatarUrl
      })
      .select()
      .single()
    
    if (error) {
      console.error('❌ Error creating Supabase profile:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // Provide helpful hints based on error
      if (error.code === '23505') { // Unique constraint violation
        console.error('💡 This email or clerk_id already exists. Trying to update instead...')
        // Try to find and update instead
        const { data: foundProfile } = await supabase
          .from('profiles')
          .select('id')
          .or(`clerk_id.eq.${userData.clerkId},email.eq.${userData.email}`)
          .maybeSingle()
        
        if (foundProfile) {
          const { data: updated, error: updateError } = await supabase
            .from('profiles')
            .update({
              clerk_id: userData.clerkId,
              full_name: fullName,
              role: role,
              avatar_url: userData.avatarUrl,
              updated_at: new Date().toISOString()
            })
            .eq('id', foundProfile.id)
            .select()
            .single()
          
          if (updateError) {
            throw updateError
          }
          console.log('✅ Profile updated instead:', updated)
          return updated
        }
      }
      
      if (error.message?.includes('clerk_id')) {
        console.error('💡 Fix: Run migrate-clerk-support.sql to add clerk_id column')
      }
      
      throw error
    }
    
    console.log('✅ Profile created successfully:', data)
    return data
  }
}

/**
 * Generate a consistent UUID from Clerk ID
 * Uses a simple hash function to convert Clerk ID to UUID format
 */
export function generateUserIdFromClerkId(clerkId: string): string {
  // Simple hash function to convert Clerk ID to UUID-like string
  // In production, you might want to use a proper UUID v5 with a namespace
  let hash = 0
  for (let i = 0; i < clerkId.length; i++) {
    const char = clerkId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  // Convert to UUID format (8-4-4-4-12)
  const hex = Math.abs(hash).toString(16).padStart(32, '0')
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`
}

/**
 * Sync current Clerk user to Supabase (client-side)
 */
export async function syncCurrentClerkUser(clerkUser: any) {
  if (!clerkUser) return null
  
  const userData: SyncUserData = {
    clerkId: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    fullName: clerkUser.fullName,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    role: clerkUser.publicMetadata?.role as string || 'student',
    avatarUrl: clerkUser.imageUrl
  }
  
  return await syncClerkUserToSupabase(userData)
}

