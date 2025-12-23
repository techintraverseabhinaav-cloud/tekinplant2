import { createClient } from './client'

export interface Course {
  id: string
  title: string
  company_id: string | null
  company_name: string | null
  location: string
  type: string
  duration: string
  price: string
  image_url: string | null
  description: string
  tags: string[]
  contact: string | null
  website: string | null
  rating: number
  student_count: number
  instructor_id: string | null
  syllabus: string[]
  requirements: string[]
  outcomes: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getCourses(filters?: {
  search?: string
  type?: string
  location?: string
  limit?: number
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('courses')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`)
  }

  if (filters?.type && filters.type !== 'All Categories') {
    query = query.eq('type', filters.type)
  }

  if (filters?.location && filters.location !== 'All Locations') {
    query = query.ilike('location', `%${filters.location}%`)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Course[]
}

export async function getCourseById(id: string): Promise<Course | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching course:', error)
    return null
  }

  return data as Course
}

export async function createCourse(course: Omit<Course, 'id' | 'created_at' | 'updated_at' | 'student_count'>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('courses')
    .insert(course)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCourse(id: string, updates: Partial<Course>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('courses')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCourse(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id)

  if (error) throw error
}

