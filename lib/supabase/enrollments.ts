import { createClient } from './client'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
  enrolled_at: string
  completed_at: string | null
  progress_percentage: number
}

/**
 * Create service role client for server-side operations (bypasses RLS)
 * Similar to how profiles sync works
 */
function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  }

  return createServiceClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Sync enrollment to Supabase (server-side)
 * Uses service role to bypass RLS, similar to profile sync
 */
export async function syncEnrollmentToSupabase(
  studentId: string,
  courseId: string,
  status: Enrollment['status'] = 'pending'
) {
  console.log('🔄 Syncing enrollment to Supabase...', { studentId, courseId, status })
  
  const supabase = getServiceClient()
  
  // Check if enrollment already exists
  const { data: existingEnrollment } = await supabase
    .from('enrollments')
    .select('id, status')
    .eq('student_id', studentId)
    .eq('course_id', courseId)
    .maybeSingle()

  if (existingEnrollment) {
    console.log('✅ Enrollment already exists:', existingEnrollment.id)
    // Update if status changed
    if (existingEnrollment.status !== status) {
      const { data, error } = await supabase
        .from('enrollments')
        .update({ status })
        .eq('id', existingEnrollment.id)
        .select()
        .single()

      if (error) {
        console.error('❌ Error updating enrollment:', error)
        throw error
      }
      console.log('✅ Enrollment updated:', data)
      return data
    }
    return existingEnrollment
  }

  // Create new enrollment
  console.log('➕ Creating new enrollment...')
  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      student_id: studentId,
      course_id: courseId,
      status: status,
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Error creating enrollment:', error)
    throw error
  }

  console.log('✅ Enrollment created successfully:', data)
  return data
}

/**
 * Update enrollment in Supabase (server-side)
 * Similar to profile update pattern
 */
export async function updateEnrollmentInSupabase(
  enrollmentId: string,
  updates: {
    status?: Enrollment['status']
    progressPercentage?: number
  }
) {
  console.log('🔄 Updating enrollment in Supabase...', { enrollmentId, updates })
  
  const supabase = getServiceClient()
  
  const updateData: any = {}
  
  if (updates.status) {
    updateData.status = updates.status
    // Set completed_at if status is 'completed'
    if (updates.status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }
  }
  
  if (updates.progressPercentage !== undefined) {
    updateData.progress_percentage = Math.round(updates.progressPercentage)
    // Auto-complete if progress reaches 100%
    if (updates.progressPercentage >= 100) {
      updateData.status = 'completed'
      updateData.completed_at = new Date().toISOString()
    }
  }

  const { data, error } = await supabase
    .from('enrollments')
    .update(updateData)
    .eq('id', enrollmentId)
    .select(`
      *,
      courses (*)
    `)
    .single()

  if (error) {
    console.error('❌ Error updating enrollment:', error)
    throw error
  }

  console.log('✅ Enrollment updated successfully:', data)
  return data
}

// Client-side functions (using regular client with RLS)
export async function enrollInCourse(studentId: string, courseId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      student_id: studentId,
      course_id: courseId,
      status: 'pending',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getStudentEnrollments(studentId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('enrollments')
    .select(`
      *,
      courses (*)
    `)
    .eq('student_id', studentId)
    .order('enrolled_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateEnrollmentStatus(
  enrollmentId: string,
  status: Enrollment['status']
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('enrollments')
    .update({ status })
    .eq('id', enrollmentId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateEnrollmentProgress(
  enrollmentId: string,
  progressPercentage: number
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('enrollments')
    .update({ progress_percentage: progressPercentage })
    .eq('id', enrollmentId)
    .select()
    .single()

  if (error) throw error
  return data
}
