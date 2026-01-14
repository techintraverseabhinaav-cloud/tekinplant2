import { NextRequest, NextResponse } from 'next/server'

// Simple test endpoint to verify API routes are working
export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasSupabaseKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    const hasClerkKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    const hasClerkSecret = !!process.env.CLERK_SECRET_KEY

    return NextResponse.json({
      success: true,
      message: 'API routes are working!',
      timestamp: new Date().toISOString(),
      environment: {
        supabase: {
          url: hasSupabaseUrl ? '✅ Set' : '❌ Missing',
          serviceKey: hasSupabaseKey ? '✅ Set' : '❌ Missing'
        },
        clerk: {
          publishableKey: hasClerkKey ? '✅ Set' : '❌ Missing',
          secretKey: hasClerkSecret ? '✅ Set' : '❌ Missing'
        }
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Test endpoint failed'
      },
      { status: 500 }
    )
  }
}

