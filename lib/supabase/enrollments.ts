import { createClient } from './client'

export interface Enrollment {
  id: string
  student_id: string
  course_id: string
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
  enrolled_at: string
  completed_at: string | null
  progress_percentage: number
}

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

