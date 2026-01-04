import { NextRequest, NextResponse } from 'next/server'
import { syncClerkUserToSupabase } from '@/lib/supabase/sync-clerk-user'

/**
 * Helper function to sync user data to Supabase
 */
async function syncUserToSupabase(userData: any) {
  // Check if service role key is set
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set in environment variables')
    console.error('💡 Fix: Add SUPABASE_SERVICE_ROLE_KEY to .env.local and restart server')
    return NextResponse.json(
      { 
        error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY not set',
        hint: 'Add SUPABASE_SERVICE_ROLE_KEY to .env.local file'
      },
      { status: 500 }
    )
  }
  
  // Check if Supabase URL is set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL not set')
    return NextResponse.json(
      { 
        error: 'Server configuration error: NEXT_PUBLIC_SUPABASE_URL not set',
        hint: 'Add NEXT_PUBLIC_SUPABASE_URL to .env.local file'
      },
      { status: 500 }
    )
  }
  
  console.log('📤 Syncing user data:', userData)
  
  // Only update Clerk's publicMetadata with role if not already set
  // This prevents overwriting an existing role on subsequent sign-ins
  if (userData.role && userData.clerkId) {
    try {
      const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY
      if (CLERK_SECRET_KEY) {
        // First check if role is already set in Clerk
        const userResponse = await fetch(`https://api.clerk.com/v1/users/${userData.clerkId}`, {
          headers: {
            'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (userResponse.ok) {
          const clerkUser = await userResponse.json()
          const existingRole = clerkUser.public_metadata?.role
          
          // Only update if role is not already set or if it's different (new sign-up)
          if (!existingRole || existingRole !== userData.role) {
            const updateResponse = await fetch(`https://api.clerk.com/v1/users/${userData.clerkId}/metadata`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                public_metadata: { role: userData.role }
              }),
            })
            
            if (updateResponse.ok) {
              console.log('✅ Updated Clerk publicMetadata with role:', userData.role)
            } else {
              console.warn('⚠️ Failed to update Clerk publicMetadata, but continuing with Supabase sync')
            }
          } else {
            console.log('ℹ️ Role already set in Clerk, skipping update:', existingRole)
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ Error updating Clerk publicMetadata:', error)
      // Continue with Supabase sync even if Clerk update fails
    }
  }
  
  const profile = await syncClerkUserToSupabase(userData)
  
  console.log('✅ Profile synced successfully:', profile)
  
  return NextResponse.json({ 
    success: true, 
    profile 
  })
}

/**
 * API Route to sync Clerk user to Supabase
 * Call this after user signs in/signs up
 * 
 * This route gets user data from the client-side Clerk session
 * and syncs it to Supabase
 */
export async function POST(request: NextRequest) {
  try {
    console.log('📥 Sync user API called')
    
    // Get user data from request body (sent from client)
    const body = await request.json().catch(() => ({}))
    const { userId, email, fullName, firstName, lastName, role, avatarUrl } = body
    
    // If no user data in body, try to get from Clerk session token
    if (!userId) {
      // Get session token from Authorization header or cookie
      const authHeader = request.headers.get('authorization')
      const sessionToken = authHeader?.replace('Bearer ', '') || 
                          request.cookies.get('__session')?.value ||
                          request.cookies.get('__clerk_db_jwt')?.value
      
      if (!sessionToken) {
        console.error('❌ No session token found')
        return NextResponse.json(
          { error: 'Unauthorized - No session token' },
          { status: 401 }
        )
      }
      
      // Verify session with Clerk API
      const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY
      if (!CLERK_SECRET_KEY) {
        console.error('❌ CLERK_SECRET_KEY not set')
        return NextResponse.json(
          { error: 'Server configuration error: CLERK_SECRET_KEY not set' },
          { status: 500 }
        )
      }
      
      // Verify token and get user ID
      try {
        const verifyResponse = await fetch('https://api.clerk.com/v1/sessions/verify', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: sessionToken }),
        })
        
        if (!verifyResponse.ok) {
          console.error('❌ Session verification failed')
          return NextResponse.json(
            { error: 'Unauthorized - Invalid session' },
            { status: 401 }
          )
        }
        
        const sessionData = await verifyResponse.json()
        const clerkUserId = sessionData.user_id
        
        if (!clerkUserId) {
          return NextResponse.json(
            { error: 'Unauthorized - No user in session' },
            { status: 401 }
          )
        }
        
        // Fetch user details from Clerk API
        const userResponse = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}`, {
          headers: {
            'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (!userResponse.ok) {
          console.error('❌ Failed to fetch user from Clerk API')
          return NextResponse.json(
            { error: 'Failed to fetch user data from Clerk' },
            { status: 500 }
          )
        }
        
        const clerkUser = await userResponse.json()
        
        // Use Clerk API response
        const userData = {
          clerkId: clerkUser.id,
          email: clerkUser.email_addresses?.[0]?.email_address || '',
          fullName: `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim() || null,
          firstName: clerkUser.first_name || null,
          lastName: clerkUser.last_name || null,
          role: (clerkUser.public_metadata?.role as string) || 'student',
          avatarUrl: clerkUser.image_url || null
        }
        
        console.log('👤 User found from Clerk API:', userData.clerkId, userData.email)
        
        // Continue with sync...
        return await syncUserToSupabase(userData)
      } catch (error: any) {
        console.error('❌ Error verifying session:', error)
        return NextResponse.json(
          { error: 'Failed to verify session', details: error.message },
          { status: 500 }
        )
      }
    }
    
    // Use data from request body
    if (!userId || !email) {
      console.error('❌ Missing required user data')
      return NextResponse.json(
        { error: 'Missing required user data (userId, email)' },
        { status: 400 }
      )
    }
    
    console.log('👤 User found from request body:', userId, email)
    console.log('🔑 Role from request:', role || 'student (default)')
    
    const userData = {
      clerkId: userId,
      email: email,
      fullName: fullName || null,
      firstName: firstName || null,
      lastName: lastName || null,
      role: role || 'student', // Ensure role is always set
      avatarUrl: avatarUrl || null
    }
    
    console.log('📤 User data to sync:', { ...userData, email: userData.email.substring(0, 10) + '...' })
    
    return await syncUserToSupabase(userData)
  } catch (error: any) {
    console.error('❌ Error syncing user:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to sync user',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
