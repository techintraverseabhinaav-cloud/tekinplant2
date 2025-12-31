import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { generateUserIdFromClerkId } from '../../../lib/supabase/sync-clerk-user'

async function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// GET - Fetch certificates
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServiceClient()
    const searchParams = request.nextUrl.searchParams
    const certificateId = searchParams.get('id')
    const studentId = searchParams.get('studentId')
    const courseId = searchParams.get('courseId')

    // Get single certificate by ID
    if (certificateId) {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses (*),
          profiles!certificates_student_id_fkey (id, full_name, email)
        `)
        .eq('id', certificateId)
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Certificate not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(data)
    }

    // Get certificates by student
    if (studentId) {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses (*)
        `)
        .eq('student_id', studentId)
        .order('issued_at', { ascending: false })

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch certificates' },
          { status: 500 }
        )
      }

      return NextResponse.json(data)
    }

    // Get certificates by course
    if (courseId) {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          profiles!certificates_student_id_fkey (id, full_name, email)
        `)
        .eq('course_id', courseId)
        .order('issued_at', { ascending: false })

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch certificates' },
          { status: 500 }
        )
      }

      return NextResponse.json(data)
    }

    // Get all certificates (admin)
    const { data, error } = await supabase
      .from('certificates')
      .select(`
        *,
        courses (*),
        profiles!certificates_student_id_fkey (id, full_name, email)
      `)
      .order('issued_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch certificates' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Certificates API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}

// POST - Generate certificate
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createServiceClient()
    const body = await request.json()
    const { studentId, courseId, certificateUrl } = body

    if (!studentId || !courseId) {
      return NextResponse.json(
        { error: 'Student ID and Course ID are required' },
        { status: 400 }
      )
    }

    // Check if certificate already exists
    const { data: existing } = await supabase
      .from('certificates')
      .select('id')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Certificate already exists for this course' },
        { status: 400 }
      )
    }

    // Create certificate
    const { data, error } = await supabase
      .from('certificates')
      .insert({
        student_id: studentId,
        course_id: courseId,
        certificate_url: certificateUrl || null,
        issued_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating certificate:', error)
      return NextResponse.json(
        { error: 'Failed to generate certificate', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, certificate: data })
  } catch (error: any) {
    console.error('Generate certificate error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate certificate' },
      { status: 500 }
    )
  }
}

