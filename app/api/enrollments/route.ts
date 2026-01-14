import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { generateUserIdFromClerkId } from '../../../lib/supabase/sync-clerk-user'
import { createClient } from '@supabase/supabase-js'

// Use service role for admin operations
async function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Fetch enrollments for the authenticated user
export async function GET(request: NextRequest) {
  try {
    console.log('📥 Get enrollments API called')
    
    const { userId: clerkId } = await auth()
    console.log('🔑 Clerk ID:', clerkId)
    
    if (!clerkId) {
      console.error('❌ No Clerk ID found')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get Supabase user ID from Clerk ID
    const supabaseUserId = generateUserIdFromClerkId(clerkId)
    console.log('🆔 Supabase User ID:', supabaseUserId)
    
    // Check Supabase configuration
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing Supabase configuration')
      return NextResponse.json(
        { error: 'Server configuration error: Supabase not configured' },
        { status: 500 }
      )
    }
    
    // Use service role client for admin operations
    const supabase = await createServiceClient()
    console.log('✅ Supabase client created')
    
    // Verify user exists in Supabase - try by clerk_id first (more reliable), then by generated ID
    console.log('🔍 Checking for profile with clerk_id:', clerkId)
    let profile = null
    
    // Try clerk_id first (more reliable since it's set during sync)
    const { data: profileByClerkId } = await supabase
      .from('profiles')
      .select('id, clerk_id')
      .eq('clerk_id', clerkId)
      .maybeSingle()

    if (profileByClerkId) {
      profile = profileByClerkId
      console.log('✅ Found profile by clerk_id:', profile.id)
    } else {
      console.log('⚠️ Profile not found by clerk_id, trying generated ID...')
      // Fallback to generated ID
      const { data: profileById } = await supabase
        .from('profiles')
        .select('id, clerk_id')
        .eq('id', supabaseUserId)
        .maybeSingle()

      if (profileById) {
        profile = profileById
        console.log('✅ Found profile by generated ID:', profile.id)
      } else {
        console.error('❌ Profile not found')
        return NextResponse.json(
          { 
            error: 'User profile not found',
            hint: 'Try signing out and signing back in to create your profile'
          },
          { status: 404 }
        )
      }
    }

    const studentId = profile.id
    console.log('👤 Using student ID:', studentId)

    // Get enrollments with course details
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (
          id,
          title,
          company_name,
          duration,
          rating,
          image_url
        )
      `)
      .eq('student_id', studentId)
      .order('enrolled_at', { ascending: false })

    if (enrollmentsError) {
      console.error('❌ Error fetching enrollments:', enrollmentsError)
      return NextResponse.json(
        { 
          error: 'Failed to fetch enrollments',
          details: enrollmentsError.message
        },
        { status: 500 }
      )
    }

    console.log(`✅ Fetched ${enrollments?.length || 0} enrollments`)
    return NextResponse.json({ enrollments: enrollments || [] })
  } catch (error: any) {
    console.error('❌ Get enrollments error:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch enrollments',
        details: error.toString()
      },
      { status: 500 }
    )
  }
}

// PUT - Update enrollment (status, progress, etc.)
export async function PUT(request: NextRequest) {
  try {
    console.log('📥 Update enrollment API called')
    
    const { userId: clerkId } = await auth()
    console.log('🔑 Clerk ID:', clerkId)
    
    if (!clerkId) {
      console.error('❌ No Clerk ID found')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('📋 Request body:', body)
    const { enrollmentId, status, progressPercentage } = body

    // Validate input
    if (!enrollmentId) {
      console.error('❌ No enrollmentId provided')
      return NextResponse.json(
        { error: 'Enrollment ID is required' },
        { status: 400 }
      )
    }

    if (!status && progressPercentage === undefined) {
      console.error('❌ No update fields provided')
      return NextResponse.json(
        { error: 'At least one field (status or progressPercentage) is required' },
        { status: 400 }
      )
    }

    // Get Supabase user ID from Clerk ID
    const supabaseUserId = generateUserIdFromClerkId(clerkId)
    console.log('🆔 Supabase User ID:', supabaseUserId)
    
    // Check Supabase configuration
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing Supabase configuration')
      return NextResponse.json(
        { error: 'Server configuration error: Supabase not configured' },
        { status: 500 }
      )
    }
    
    // Use service role client for admin operations
    const supabase = await createServiceClient()
    console.log('✅ Supabase client created')
    
    // Verify user exists in Supabase - try by clerk_id first (more reliable), then by generated ID
    console.log('🔍 Checking for profile with clerk_id:', clerkId)
    let profile = null
    
    // Try clerk_id first (more reliable since it's set during sync)
    const { data: profileByClerkId } = await supabase
      .from('profiles')
      .select('id, clerk_id')
      .eq('clerk_id', clerkId)
      .maybeSingle()

    if (profileByClerkId) {
      profile = profileByClerkId
      console.log('✅ Found profile by clerk_id:', profile.id)
    } else {
      console.log('⚠️ Profile not found by clerk_id, trying generated ID...')
      // Fallback to generated ID
      const { data: profileById } = await supabase
        .from('profiles')
        .select('id, clerk_id')
        .eq('id', supabaseUserId)
        .maybeSingle()

      if (profileById) {
        profile = profileById
        console.log('✅ Found profile by generated ID:', profile.id)
      } else {
        console.error('❌ Profile not found')
        return NextResponse.json(
          { 
            error: 'User profile not found',
            hint: 'Try signing out and signing back in to create your profile'
          },
          { status: 404 }
        )
      }
    }

    const studentId = profile.id
    console.log('👤 Using student ID:', studentId)

    // Verify enrollment exists and belongs to this user
    console.log('🔍 Verifying enrollment exists and belongs to user...')
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id, student_id, status, progress_percentage')
      .eq('id', enrollmentId)
      .eq('student_id', studentId)
      .maybeSingle()

    if (enrollmentError || !enrollment) {
      console.error('❌ Enrollment not found or does not belong to user:', enrollmentError)
      return NextResponse.json(
        { 
          error: 'Enrollment not found or access denied',
          details: enrollmentError?.message || 'Enrollment does not exist or does not belong to you'
        },
        { status: 404 }
      )
    }

    console.log('✅ Enrollment found:', enrollment.id)

    // Prepare update data
    const updateData: { status?: string; progress_percentage?: number; completed_at?: string | null } = {}

    if (status) {
      // Validate status
      const validStatuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        )
      }
      updateData.status = status
      
      // Set completed_at if status is 'completed'
      if (status === 'completed' && enrollment.status !== 'completed') {
        updateData.completed_at = new Date().toISOString()
      } else if (status !== 'completed') {
        updateData.completed_at = null
      }
    }

    if (progressPercentage !== undefined) {
      // Validate progress percentage
      if (progressPercentage < 0 || progressPercentage > 100) {
        return NextResponse.json(
          { error: 'Progress percentage must be between 0 and 100' },
          { status: 400 }
        )
      }
      updateData.progress_percentage = Math.round(progressPercentage)
      
      // Auto-complete if progress reaches 100%
      if (progressPercentage >= 100 && enrollment.status !== 'completed') {
        updateData.status = 'completed'
        updateData.completed_at = new Date().toISOString()
      }
    }

    console.log('📝 Update data:', updateData)

    // Only proceed if there's actual data to update
    if (Object.keys(updateData).length === 0) {
      console.log('ℹ️ No relevant data to update for enrollment.')
      return NextResponse.json({
        success: true,
        enrollment: enrollment,
        message: 'No changes detected for enrollment update.'
      })
    }

    // Update enrollment in Supabase
    const { data: updatedEnrollment, error: updateError } = await supabase
      .from('enrollments')
      .update(updateData)
      .eq('id', enrollmentId)
      .select(`
        *,
        courses (
          id,
          title,
          company_name,
          duration,
          rating,
          image_url
        )
      `)
      .single()

    if (updateError) {
      console.error('❌ Error updating enrollment:', updateError)
      console.error('❌ Update error code:', updateError.code)
      console.error('❌ Update error message:', updateError.message)
      console.error('❌ Update error details:', updateError.details)
      return NextResponse.json(
        { error: 'Failed to update enrollment in Supabase', details: updateError.message },
        { status: 500 }
      )
    }

    console.log('✅ Enrollment updated in Supabase:', updatedEnrollment)

    return NextResponse.json({
      success: true,
      enrollment: updatedEnrollment,
      message: 'Enrollment updated successfully in Supabase'
    })
  } catch (error: any) {
    console.error('❌ Enrollment update error (catch block):', error)
    console.error('❌ Error message:', error?.message)
    console.error('❌ Error stack:', error?.stack)
    console.error('❌ Error name:', error?.name)
    console.error('❌ Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to update enrollment',
        details: error.toString(),
        type: error?.name || 'UnknownError'
      },
      { status: 500 }
    )
  }
}

