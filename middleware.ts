import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/sign-up(.*)',
  '/courses(.*)',
  '/about',
  '/contact',
  '/partners(.*)',
  '/api/webhooks(.*)',
  '/debug-sync', // Allow debug page
])

export default clerkMiddleware(async (auth, request) => {
  // Always process auth for API routes so currentUser() works
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Don't protect, but ensure auth is processed
    await auth()
  } else if (!isPublicRoute(request)) {
    // Protect non-public routes
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

