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

// GET - Fetch submissions
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServiceClient()
    const searchParams = request.nextUrl.searchParams
    const submissionId = searchParams.get('id')
    const assignmentId = searchParams.get('assignmentId')
    const studentId = searchParams.get('studentId')

    // Get single submission by ID
    if (submissionId) {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          assignments (*),
          profiles!submissions_student_id_fkey (id, full_name, email)
        `)
        .eq('id', submissionId)
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Submission not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(data)
    }

    // Get submissions by assignment
    if (assignmentId) {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          profiles!submissions_student_id_fkey (id, full_name, email)
        `)
        .eq('assignment_id', assignmentId)
        .order('submitted_at', { ascending: false })

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch submissions' },
          { status: 500 }
        )
      }

      return NextResponse.json(data)
    }

    // Get submissions by student
    if (studentId) {
      const { data, error } = await supabase
        .from('submissions')
        .select(`
          *,
          assignments (*)
        `)
        .eq('student_id', studentId)
        .order('submitted_at', { ascending: false })

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch submissions' },
          { status: 500 }
        )
      }

      return NextResponse.json(data)
    }

    // Get all submissions (admin)
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        assignments (*),
        profiles!submissions_student_id_fkey (id, full_name, email)
      `)
      .order('submitted_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch submissions' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Submissions API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

// POST - Submit assignment
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
    const supabaseUserId = generateUserIdFromClerkId(clerkId)
    const body = await request.json()
    const { assignmentId, fileUrl, notes } = body

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      )
    }

    // Check if already submitted
    const { data: existing } = await supabase
      .from('submissions')
      .select('id')
      .eq('student_id', supabaseUserId)
      .eq('assignment_id', assignmentId)
      .single()

    if (existing) {
      // Update existing submission
      const { data, error } = await supabase
        .from('submissions')
        .update({
          file_url: fileUrl,
          notes: notes,
          submitted_at: new Date().toISOString(),
          status: 'submitted'
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Failed to update submission', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true, submission: data })
    }

    // Create new submission
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        student_id: supabaseUserId,
        assignment_id: assignmentId,
        file_url: fileUrl,
        notes: notes,
        status: 'submitted'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating submission:', error)
      return NextResponse.json(
        { error: 'Failed to submit assignment', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, submission: data })
  } catch (error: any) {
    console.error('Submit assignment error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit assignment' },
      { status: 500 }
    )
  }
}

// PUT - Update submission (grade, feedback)
export async function PUT(request: NextRequest) {
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
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('submissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update submission', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, submission: data })
  } catch (error: any) {
    console.error('Update submission error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update submission' },
      { status: 500 }
    )
  }
}

