import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/sign-up(.*)',
  '/admin(.*)',
  '/trainer(.*)',
  '/corporate(.*)',
  '/redirect-dashboard',
  '/courses(.*)',
  '/about',
  '/contact',
  '/partners(.*)',
  '/api/webhooks(.*)',
  '/api/sync-user',
  '/api/get-user-role',
  '/api/test',
  '/api/courses(.*)', // Match all courses API routes (with query params, etc.)
  '/api/enrollments', // Enrollments API (GET is public for viewing own enrollments, PUT requires auth)
  // Note: /api/enroll is NOT in public routes - it requires authentication
  '/debug-sync',
])

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname
  
  // Log middleware execution for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔵 Middleware processing: ${pathname}`)
  }
  
  // CRITICAL: For ALL API routes, we MUST call auth() to ensure Clerk middleware is detected
  // This must happen BEFORE the route handler executes
  // According to Clerk docs: https://clerk.com/err/auth-middleware
  if (pathname.startsWith('/api/')) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Processing API route: ${pathname}`)
    }
    
    // CRITICAL: Always call auth() for API routes - this is what allows auth() to work in API handlers
    // The auth() call here ensures Clerk knows middleware processed this route
    // We call it for ALL API routes (public and protected) to ensure Clerk detects the middleware
    // Call it ONCE and reuse the result
    const authResult = await auth()
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Auth processed for ${pathname}, userId: ${authResult.userId || 'none'}`)
    }
    
    // For protected API routes (not in public routes), verify authentication
    if (!isPublicRoute(request)) {
      if (!authResult.userId) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`❌ Unauthorized access to protected route: ${pathname}`)
        }
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }
    
    // IMPORTANT: Don't return early - let the request continue naturally
    // The auth() call above ensures Clerk knows middleware processed this route
    // This allows the route handler to also call auth() successfully
  } else {
    // Protect non-public page routes
    if (!isPublicRoute(request)) {
      await auth.protect()
    }
  }
})

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    // This pattern ensures middleware runs for all pages and API routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
    // Explicitly include all API routes to ensure they're processed
    '/api/:path*',
  ],
}
