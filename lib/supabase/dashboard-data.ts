import { generateUserIdFromClerkId } from './sync-clerk-user'

// Use service role for admin operations in API routes
async function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    const errorMsg = 'Missing Supabase configuration. Please check your .env.local file.'
    console.error('❌', errorMsg)
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
    console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing')
    throw new Error(errorMsg)
  }

  const { createClient } = await import('@supabase/supabase-js')
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Get user's Supabase profile ID from Clerk ID
 */
async function getSupabaseUserId(clerkId: string): Promise<string | null> {
  const supabase = await createServiceClient()
  const userId = generateUserIdFromClerkId(clerkId)
  
  // Verify profile exists
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single()
  
  return data?.id || null
}

/**
 * STUDENT DASHBOARD DATA
 */
export async function getStudentDashboardData(clerkId: string) {
  try {
    console.log('📊 getStudentDashboardData called for:', clerkId)
    
    const supabase = await createServiceClient()
    const userId = await getSupabaseUserId(clerkId)
    
    if (!userId) {
      console.log('⚠️ No Supabase user ID found for Clerk ID:', clerkId)
      return {
        enrollments: [],
        recentActivity: [],
        stats: {
          totalCourses: 0,
          completedCourses: 0,
          totalHours: 0,
          averageScore: 0
        }
      }
    }

    console.log('✅ Supabase user ID:', userId)

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
    .eq('student_id', userId)
    .order('enrolled_at', { ascending: false })

    if (enrollmentsError) {
      console.error('❌ Error fetching enrollments:', enrollmentsError)
      console.error('Error details:', JSON.stringify(enrollmentsError, null, 2))
      throw enrollmentsError
    }

    console.log(`✅ Fetched ${enrollments?.length || 0} enrollments`)
    const enrollmentsData = enrollments || []

  // Calculate stats
  const totalCourses = enrollmentsData.length
  const completedCourses = enrollmentsData.filter((e: any) => e.status === 'completed').length
  // Calculate total hours based on progress percentage (partial completion included)
  // For example: 50% of a 6-hour course = 3 hours
  const totalHours = enrollmentsData.reduce((sum: number, e: any) => {
    const duration = e.courses?.duration || '0 hours'
    const courseHours = parseInt(duration.split(' ')[0]) || 0
    const progressPercentage = e.progress_percentage || 0
    // Calculate actual hours completed based on progress
    const hoursCompleted = (courseHours * progressPercentage) / 100
    return sum + hoursCompleted
  }, 0)
  const averageScore = totalCourses > 0
    ? Math.floor(enrollmentsData.reduce((sum: number, e: any) => sum + (e.progress_percentage || 0), 0) / totalCourses)
    : 0

  // Get recent activity (from enrollments and submissions)
  const recentActivity: any[] = []
  
  // Add enrollment activities
  enrollmentsData.slice(0, 5).forEach((enrollment: any) => {
    recentActivity.push({
      type: enrollment.status === 'completed' ? 'course_completed' : 'course_enrolled',
      title: `Enrolled in ${enrollment.courses?.title || 'Course'}`,
      date: new Date(enrollment.enrolled_at).toLocaleDateString()
    })
  })

    // Get recent submissions
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select(`
        *,
        assignments (
          title,
          course_id
        )
      `)
      .eq('student_id', userId)
      .order('submitted_at', { ascending: false })
      .limit(5)

    if (submissionsError) {
      console.error('⚠️ Error fetching submissions (non-critical):', submissionsError)
    }

    if (submissions) {
      submissions.forEach((submission: any) => {
        recentActivity.push({
          type: 'assignment_submitted',
          title: `Submitted: ${submission.assignments?.title || 'Assignment'}`,
          date: new Date(submission.submitted_at).toLocaleDateString()
        })
      })
    }

    // Sort by date
    recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const result = {
      enrollments: enrollmentsData.map((e: any) => ({
        id: e.id,
        courseId: e.course_id,
        title: e.courses?.title || 'Unknown Course',
        company: e.courses?.company_name || 'Unknown',
        duration: e.courses?.duration || 'N/A',
        rating: e.courses?.rating || 0,
        image_url: e.courses?.image_url || null,
        progress: e.progress_percentage || 0,
        status: e.status,
        lastAccessed: new Date(e.enrolled_at).toLocaleDateString(),
        nextSession: 'N/A' // Could be calculated from course schedule
      })),
      recentActivity: recentActivity.slice(0, 10),
      stats: {
        totalCourses,
        completedCourses,
        totalHours,
        averageScore
      }
    }

    console.log('✅ Dashboard data prepared successfully')
    return result
  } catch (error: any) {
    console.error('❌ Error in getStudentDashboardData:', error)
    console.error('Error stack:', error.stack)
    throw error
  }
}

/**
 * TRAINER DASHBOARD DATA
 */
export async function getTrainerDashboardData(clerkId: string) {
  const supabase = await createServiceClient()
  const userId = await getSupabaseUserId(clerkId)
  
  if (!userId) {
    return {
      myCourses: [],
      recentStudents: [],
      stats: {
        totalCourses: 0,
        totalStudents: 0,
        averageRating: '0.0',
        completionRate: 0
      }
    }
  }

  // Get courses assigned to this trainer
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .eq('instructor_id', userId)
    .order('created_at', { ascending: false })

  if (coursesError) {
    console.error('Error fetching trainer courses:', coursesError)
  }

  const coursesData = courses || []

  // Get enrollments for trainer's courses
  const courseIds = coursesData.map((c: any) => c.id)
  
  let enrollments: any[] = []
  if (courseIds.length > 0) {
    const { data: enrollmentsData, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses!inner(id, instructor_id, title),
        profiles!enrollments_student_id_fkey(id, full_name, email)
      `)
      .in('course_id', courseIds)
      .order('enrolled_at', { ascending: false })
    
    if (enrollmentsError) {
      console.error('Error fetching trainer enrollments:', enrollmentsError)
    } else {
      enrollments = enrollmentsData || []
    }
  }

  // Calculate stats
  const totalCourses = coursesData.length
  const totalStudents = enrollments?.length || 0
  const averageRating = totalCourses > 0
    ? (coursesData.reduce((sum: number, c: any) => sum + parseFloat(c.rating || 0), 0) / totalCourses).toFixed(1)
    : '0.0'
  
  const completedEnrollments = enrollments?.filter((e: any) => e.status === 'completed').length || 0
  const completionRate = totalStudents > 0
    ? Math.floor((completedEnrollments / totalStudents) * 100)
    : 0

  // Get recent students (from enrollments)
  const recentStudents = (enrollments || [])
    .slice(0, 10)
    .map((e: any) => ({
      name: e.profiles?.full_name || 'Unknown Student',
      email: e.profiles?.email || '',
      course: e.courses?.title || 'Unknown Course',
      progress: e.progress_percentage || 0,
      lastActive: new Date(e.enrolled_at).toLocaleDateString()
    }))

  return {
    myCourses: coursesData.map((c: any) => ({
      id: c.id,
      title: c.title,
      company: c.company_name || 'Unknown',
      duration: c.duration || 'N/A',
      enrolledStudents: enrollments?.filter((e: any) => e.course_id === c.id).length || 0,
      averageRating: c.rating || 0,
      completionRate: enrollments?.filter((e: any) => e.course_id === c.id && e.status === 'completed').length || 0,
      nextSession: 'N/A'
    })),
    recentStudents,
    stats: {
      totalCourses,
      totalStudents,
      averageRating,
      completionRate
    }
  }
}

/**
 * ADMIN DASHBOARD DATA
 */
export async function getAdminDashboardData(clerkId: string) {
  try {
    const supabase = await createServiceClient()
    const userId = await getSupabaseUserId(clerkId)
    
    if (!userId) {
      console.log('⚠️ No Supabase user ID found for admin dashboard')
      return {
        systemStats: {
          totalUsers: 0,
          totalStudents: 0,
          activeCourses: 0,
          totalRevenue: 0,
          systemHealth: 0,
          newUsers: 0,
          courseEnrollments: 0,
          completionRate: 0,
          revenueGrowth: 0,
          userGrowth: 0
        },
        recentUsers: [],
        systemAlerts: []
      }
    }

    // Get all users
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: false })

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
    }

    // Get all students from Supabase (count directly from data)
    const { data: students, error: studentsError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'student')

    if (studentsError) {
      console.error('Error fetching students:', studentsError)
    }

    // Get all courses from database (count all courses, not just active)
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, is_active')

    if (coursesError) {
      console.error('Error fetching courses:', coursesError)
    }
    
    // Count active courses separately
    const activeCoursesCount = courses?.filter((c: any) => c.is_active === true).length || 0
    const totalCoursesCount = courses?.length || 0

    // Get all enrollments with course details for revenue calculation
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        id, 
        enrolled_at,
        status,
        courses (
          id,
          price
        )
      `)

    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError)
    }

    // Calculate stats
    const totalUsers = profiles?.length || 0
    const totalStudents = students?.length || 0 // Count from Supabase data
    const activeCourses = activeCoursesCount // Count of active courses from database
    const courseEnrollments = enrollments?.length || 0
    
    console.log('📊 Admin Dashboard Stats:', {
      totalUsers,
      totalStudents,
      activeCourses,
      totalCoursesCount,
      courseEnrollments,
      studentsDataLength: students?.length,
      coursesDataLength: courses?.length,
      activeCoursesCount,
      profilesLength: profiles?.length,
      enrollmentsLength: enrollments?.length
    })
    
    // Calculate revenue from approved/completed enrollments
    let totalRevenue = 0
    const enrollmentsData = enrollments || []
    enrollmentsData.forEach((enrollment: any) => {
      // Only count revenue for approved or completed enrollments
      if (enrollment.status === 'approved' || enrollment.status === 'completed') {
        const coursePrice = enrollment.courses?.price || '₹0'
        // Extract numeric value (handles ₹, $, commas)
        const priceStr = coursePrice.toString().replace(/[₹$,]/g, '')
        const price = parseInt(priceStr) || 0
        totalRevenue += price
        
        // Add registration fee ($50 = ₹4,150 at 1 USD = 83 INR)
        if (coursePrice.includes('₹')) {
          totalRevenue += 4150 // ₹4,150 registration fee
        } else {
          totalRevenue += 50 // $50 registration fee
        }
      }
    })
    
    // Calculate completion rate
    const completedEnrollments = enrollmentsData.filter((e: any) => e.status === 'completed').length || 0
    const completionRate = courseEnrollments > 0
      ? Math.round((completedEnrollments / courseEnrollments) * 100)
      : 0
    
    // Get new users (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const newUsers = profiles?.filter((p: any) => new Date(p.created_at) > sevenDaysAgo).length || 0
    
    // Calculate user growth (last 7 days vs previous 7 days)
    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
    const previousWeekUsers = profiles?.filter((p: any) => {
      const created = new Date(p.created_at)
      return created > fourteenDaysAgo && created <= sevenDaysAgo
    }).length || 0
    const userGrowth = previousWeekUsers > 0
      ? Math.round(((newUsers - previousWeekUsers) / previousWeekUsers) * 100)
      : (newUsers > 0 ? 100 : 0)

    // Get recent users
    const recentUsers = (profiles || [])
      .slice(0, 10)
      .map((p: any) => ({
        id: p.id,
        name: p.full_name || 'Unknown',
        email: p.email,
        role: p.role,
        status: 'active', // Could be calculated from last login
        lastActive: new Date(p.created_at).toLocaleDateString()
      }))

    // Get notifications as system alerts
    const { data: notifications } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    const systemAlerts = (notifications || []).map((n: any) => ({
      id: n.id,
      type: n.type || 'info',
      message: n.message || n.title || 'Notification',
      time: new Date(n.created_at).toLocaleString()
    }))

    return {
      systemStats: {
        totalUsers,
        totalStudents, // Number of students from Supabase
        activeCourses, // Number of courses from database
        totalRevenue,
        systemHealth: 98.5, // Would need system monitoring
        newUsers,
        courseEnrollments,
        completionRate,
        revenueGrowth: 0, // Would need historical data for accurate calculation
        userGrowth
      },
      recentUsers,
      systemAlerts
    }
  } catch (error: any) {
    console.error('❌ Error in getAdminDashboardData:', error)
    console.error('❌ Error message:', error?.message)
    if (error?.message?.includes('Missing Supabase')) {
      console.error('⚠️ Supabase configuration error - check .env.local file')
      console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    }
    // Return empty data on error instead of crashing
    return {
      systemStats: {
        totalUsers: 0,
        totalStudents: 0,
        activeCourses: 0,
        totalRevenue: 0,
        systemHealth: 0,
        newUsers: 0,
        courseEnrollments: 0,
        completionRate: 0,
        revenueGrowth: 0,
        userGrowth: 0
      },
      recentUsers: [],
      systemAlerts: []
    }
  }
}

/**
 * CORPORATE DASHBOARD DATA
 */
export async function getCorporateDashboardData(clerkId: string) {
  const supabase = await createServiceClient()
  const userId = await getSupabaseUserId(clerkId)
  
  if (!userId) {
    return {
      corporateStats: {
        totalEmployees: 0,
        activePrograms: 0,
        completionRate: 0,
        totalSpent: 0
      },
      employees: [],
      trainingPrograms: []
    }
  }

  // Get user's company
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', userId)
    .single()

  const companyId = profile?.company_id

  if (!companyId) {
    return {
      corporateStats: {
        totalEmployees: 0,
        activePrograms: 0,
        completionRate: 0,
        totalSpent: 0
      },
      employees: [],
      trainingPrograms: []
    }
  }

  // Get all employees in the same company
  const { data: employees, error: employeesError } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, created_at')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (employeesError) {
    console.error('Error fetching employees:', employeesError)
  }

  // Get enrollments for company employees
  const employeeIds = (employees || []).map((e: any) => e.id)
  
  let enrollments: any[] = []
  if (employeeIds.length > 0) {
    const { data: enrollmentsData, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (*)
      `)
      .in('student_id', employeeIds)
      .order('enrolled_at', { ascending: false })
    
    if (enrollmentsError) {
      console.error('Error fetching corporate enrollments:', enrollmentsError)
    } else {
      enrollments = enrollmentsData || []
    }
  }

  // Calculate stats
  const totalEmployees = employees?.length || 0
  const activePrograms = new Set(enrollments?.map((e: any) => e.course_id) || []).size
  const completedEnrollments = enrollments?.filter((e: any) => e.status === 'completed').length || 0
  const completionRate = enrollments?.length > 0
    ? Math.floor((completedEnrollments / enrollments.length) * 100)
    : 0

  // Get employee data with progress
  const employeesData = (employees || []).map((emp: any) => {
    const empEnrollments = enrollments?.filter((e: any) => e.student_id === emp.id) || []
    const completed = empEnrollments.filter((e: any) => e.status === 'completed').length
    const inProgress = empEnrollments.filter((e: any) => e.status === 'approved').length
    
    return {
      id: emp.id,
      name: emp.full_name || 'Unknown',
      email: emp.email,
      department: 'General', // Would need department field
      enrolledCourses: empEnrollments.length,
      completedCourses: completed,
      inProgressCourses: inProgress,
      lastActive: new Date(emp.created_at).toLocaleDateString()
    }
  })

  // Get training programs (courses with enrollments from company)
  const programIds = new Set(enrollments?.map((e: any) => e.course_id) || [])
  const { data: programs } = await supabase
    .from('courses')
    .select('*')
    .in('id', Array.from(programIds))

  const trainingPrograms = (programs || []).map((p: any) => {
    const programEnrollments = enrollments?.filter((e: any) => e.course_id === p.id) || []
    return {
      id: p.id,
      title: p.title,
      enrolledEmployees: programEnrollments.length,
      completionRate: programEnrollments.length > 0
        ? Math.floor((programEnrollments.filter((e: any) => e.status === 'completed').length / programEnrollments.length) * 100)
        : 0,
      startDate: programEnrollments.length > 0
        ? new Date(Math.min(...programEnrollments.map((e: any) => new Date(e.enrolled_at).getTime()))).toLocaleDateString()
        : 'N/A',
      endDate: 'N/A'
    }
  })

  return {
    corporateStats: {
      totalEmployees,
      activePrograms,
      completionRate,
      totalSpent: 0 // Would need payment data
    },
    employees: employeesData,
    trainingPrograms
  }
}

