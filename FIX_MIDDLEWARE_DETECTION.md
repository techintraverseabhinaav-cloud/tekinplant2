# Fix: Clerk Can't Detect Middleware

## Problem
Error: `Clerk: auth() was called but Clerk can't detect usage of clerkMiddleware()`

## Solution

### Step 1: Verify Middleware File Location
✅ The `middleware.ts` file must be in the **root directory** of your project (same level as `package.json`)

Current location: `./middleware.ts` ✅

### Step 2: Clear Next.js Cache
The middleware changes require clearing the Next.js build cache:

```powershell
# Stop the dev server (Ctrl+C)

# Delete .next folder
Remove-Item -Recurse -Force .next

# Restart dev server
npm run dev
```

### Step 3: Verify Middleware Configuration

Your `middleware.ts` should look like this:

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/sign-up(.*)',
  // ... other public routes
])

export default clerkMiddleware(async (auth, request) => {
  // Process auth for all API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    await auth()
    return
  }
  
  // Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

### Step 4: Verify Clerk Package Version

Make sure you're using a recent version of `@clerk/nextjs`:

```powershell
npm list @clerk/nextjs
```

If outdated, update:
```powershell
npm install @clerk/nextjs@latest
```

### Step 5: Check Environment Variables

Ensure these are set in `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... or pk_live_...
CLERK_SECRET_KEY=sk_test_... or sk_live_...
```

### Step 6: Hard Refresh Browser

After restarting the server:
- Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear browser cache completely

## Why This Happens

1. **Next.js Cache**: Middleware changes require clearing `.next` folder
2. **Server Not Restarted**: Middleware is loaded at server startup
3. **Browser Cache**: Old JavaScript might be cached

## Verification

After following all steps, test an API route that uses `auth()`:

```typescript
// app/api/test-auth/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = await auth()
  return NextResponse.json({ userId })
}
```

Visit: `http://localhost:3000/api/test-auth`

If it works without errors, the middleware is properly detected! ✅

## Still Not Working?

1. **Check file location**: `middleware.ts` must be in root, not in `src/`
2. **Check exports**: Must use `export default clerkMiddleware(...)`
3. **Check matcher**: Must include `/(api|trpc)(.*)`
4. **Restart VS Code**: Sometimes IDE caches cause issues
5. **Check terminal**: Look for middleware-related errors in dev server output

