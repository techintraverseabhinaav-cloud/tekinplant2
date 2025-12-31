import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getStudentDashboardData } from '../../../../lib/supabase/dashboard-data'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Dashboard API called')
    
    // Try to get auth, but don't fail if it's not available (for client-side calls)
    let clerkId: string | null = null
    try {
      const authResult = await auth()
      clerkId = authResult.userId
    } catch (authError) {
      console.log('⚠️ Auth not available, using query param')
    }

    // Get clerkId from query params (for client-side calls)
    const searchParams = request.nextUrl.searchParams
    const requestedClerkId = searchParams.get('clerkId')

    // Use requested clerkId if provided, otherwise use authenticated user
    const targetClerkId = requestedClerkId || clerkId

    if (!targetClerkId) {
      console.error('❌ No clerkId available')
      return NextResponse.json(
        { error: 'Unauthorized - No user ID provided' },
        { status: 401 }
      )
    }

    console.log('✅ Fetching dashboard data for:', targetClerkId)
    const dashboardData = await getStudentDashboardData(targetClerkId)
    console.log('✅ Dashboard data fetched successfully')

    return NextResponse.json(dashboardData)
  } catch (error: any) {
    console.error('❌ Error fetching student dashboard data:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch dashboard data',
        details: error.toString(),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

