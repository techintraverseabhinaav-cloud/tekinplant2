import { NextRequest, NextResponse } from 'next/server'
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

// GET - Fetch courses (with optional filters)
export async function GET(request: NextRequest) {
  try {
    console.log('📚 Courses API called')
    
    // Check Supabase config
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing Supabase configuration')
      return NextResponse.json(
        { error: 'Server configuration error: Supabase not configured' },
        { status: 500 }
      )
    }

    const supabase = await createServiceClient()
    
    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from('courses')
      .select('id')
      .limit(1)
    
    if (testError) {
      console.error('❌ Database connection test failed:', testError)
      console.error('Error code:', testError.code)
      console.error('Error message:', testError.message)
      console.error('Error hint:', testError.hint)
      
      // Check if it's a table doesn't exist error
      if (testError.code === '42P01' || testError.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Database table not found',
            details: 'The courses table does not exist in the database',
            hint: 'Please run the schema.sql file in Supabase SQL Editor to create the table',
            code: testError.code
          },
          { status: 500 }
        )
      }
      
      // Check if it's a permission error
      if (testError.code === '42501' || testError.message?.includes('permission denied')) {
        return NextResponse.json(
          { 
            error: 'Database permission error',
            details: 'Service role key does not have permission to access courses table',
            hint: 'Check your SUPABASE_SERVICE_ROLE_KEY in .env.local',
            code: testError.code
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Database connection error',
          details: testError.message,
          code: testError.code,
          hint: testError.hint || 'Check your Supabase configuration and ensure the table exists'
        },
        { status: 500 }
      )
    }
    
    console.log('✅ Database connection successful')
    
    const searchParams = request.nextUrl.searchParams
    const courseId = searchParams.get('id')
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const limit = searchParams.get('limit')

    // Get single course by ID
    if (courseId) {
      console.log('🔍 Fetching course:', courseId)
      console.log('🔍 Course ID type:', typeof courseId)
      console.log('🔍 Course ID length:', courseId?.length)
      
      // Validate courseId is not empty
      if (!courseId.trim()) {
        console.error('❌ Empty course ID provided')
        return NextResponse.json(
          { 
            error: 'Invalid course ID',
            details: 'Course ID cannot be empty'
          },
          { status: 400 }
        )
      }
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      const trimmedId = courseId.trim()
      
      if (!uuidRegex.test(trimmedId)) {
        console.error('❌ Invalid UUID format:', trimmedId)
        return NextResponse.json(
          { 
            error: 'Invalid course ID format',
            details: `Course ID must be a valid UUID. Received: "${trimmedId}"`,
            hint: 'Course IDs are UUIDs (e.g., 550e8400-e29b-41d4-a716-446655440000). Please select a course from the courses page.',
            receivedId: trimmedId
          },
          { status: 400 }
        )
      }
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', trimmedId)
        .maybeSingle()

      if (error) {
        console.error('❌ Error fetching course:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        console.error('Error code:', error.code)
        console.error('Error message:', error.message)
        return NextResponse.json(
          { 
            error: 'Database error while fetching course',
            details: error.message,
            code: error.code,
            hint: error.hint || 'Check if the courses table exists and has the correct schema'
          },
          { status: 500 }
        )
      }

      if (!data) {
        console.error('❌ Course not found:', courseId)
        
        // List some courses for debugging
        const { data: sampleCourses, error: listError } = await supabase
          .from('courses')
          .select('id, title')
          .limit(5)
        
        if (listError) {
          console.error('❌ Error listing courses for debugging:', listError)
        }
        
        return NextResponse.json(
          { 
            error: 'Course not found',
            details: `No course found with ID: ${courseId}`,
            courseId: courseId.trim(),
            hint: 'Make sure the course ID is correct and exists in the database',
            sampleCourseIds: sampleCourses?.map(c => ({ id: c.id, title: c.title })) || []
          },
          { status: 404 }
        )
      }

      // Use stored student_count (base from industry-data + enrollments)
      // No need to recalculate - it's already incremented on enrollment
      console.log('✅ Course fetched successfully:', data.title, 'ID:', data.id, 'Students:', data.student_count)
      return NextResponse.json(data)
    }

    // Get multiple courses with filters
    let query = supabase
      .from('courses')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,company_name.ilike.%${search}%`)
    }

    if (type && type !== 'All Categories') {
      query = query.eq('type', type)
    }

    if (location && location !== 'All Locations') {
      query = query.ilike('location', `%${location}%`)
    }

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: courses, error } = await query

    if (error) {
      console.error('❌ Error fetching courses:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { 
          error: 'Failed to fetch courses',
          details: error.message,
          code: error.code
        },
        { status: 500 }
      )
    }

    // Use stored student_count (base from industry-data + enrollments)
    // No need to recalculate - counts are already incremented on enrollment
    console.log(`✅ Fetched ${courses?.length || 0} courses`)
    return NextResponse.json(courses)
  } catch (error: any) {
    console.error('❌ Courses API error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch courses',
        details: error.toString(),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// POST - Create new course (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServiceClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('courses')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Error creating course:', error)
      return NextResponse.json(
        { error: 'Failed to create course', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, course: data })
  } catch (error: any) {
    console.error('Create course error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create course' },
      { status: 500 }
    )
  }
}

// PUT - Update course (admin only)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServiceClient()
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating course:', error)
      return NextResponse.json(
        { error: 'Failed to update course', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, course: data })
  } catch (error: any) {
    console.error('Update course error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update course' },
      { status: 500 }
    )
  }
}

// DELETE - Delete course (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServiceClient()
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting course:', error)
      return NextResponse.json(
        { error: 'Failed to delete course', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Course deleted' })
  } catch (error: any) {
    console.error('Delete course error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete course' },
      { status: 500 }
    )
  }
}

