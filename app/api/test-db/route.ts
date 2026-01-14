import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { 
          error: 'Missing configuration',
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseServiceKey,
          urlPrefix: supabaseUrl?.substring(0, 20) || 'missing',
          keyPrefix: supabaseServiceKey?.substring(0, 20) || 'missing'
        },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Test 1: Check if courses table exists
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title')
      .limit(1)
    
    // Test 2: Count courses
    const { count, error: countError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
    
    return NextResponse.json({
      success: true,
      tests: {
        connection: !coursesError,
        tableExists: !coursesError,
        canRead: !coursesError,
        courseCount: count,
        error: coursesError ? {
          code: coursesError.code,
          message: coursesError.message,
          hint: coursesError.hint,
          details: coursesError.details
        } : null
      },
      sampleCourse: courses?.[0] || null,
      config: {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseServiceKey,
        urlPrefix: supabaseUrl.substring(0, 30) + '...'
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

