import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateUserIdFromClerkId } from '@/lib/supabase/sync-clerk-user'

/**
 * API Route to get user role from Supabase
 * Used when Clerk metadata doesn't have the role yet
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    // Check if service role key is set
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'SUPABASE_SERVICE_ROLE_KEY not set' },
        { status: 500 }
      )
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_SUPABASE_URL not set' },
        { status: 500 }
      )
    }

    // Create Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Generate Supabase user ID from Clerk ID
    const supabaseUserId = generateUserIdFromClerkId(userId)

    // Get profile from Supabase
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', supabaseUserId)
      .single()

    if (error) {
      console.error('Error fetching user role:', error)
      return NextResponse.json(
        { error: 'Failed to fetch user role', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      role: profile?.role || 'student'
    })
  } catch (error: any) {
    console.error('Error in get-user-role API:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get user role' },
      { status: 500 }
    )
  }
}

