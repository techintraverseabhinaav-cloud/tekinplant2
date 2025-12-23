# Clerk OAuth Setup Guide

This guide will help you set up Clerk authentication for your Training Portal.

## 📋 Prerequisites

1. A Clerk account (sign up at https://clerk.com)
2. Node.js and npm installed
3. Your Next.js project running

## 🚀 Step-by-Step Setup

### Step 1: Create a Clerk Account

1. Go to https://clerk.com
2. Click "Sign Up" or "Get Started"
3. Create a new application
4. Choose "Next.js" as your framework

### Step 2: Get Your API Keys

1. In your Clerk Dashboard, go to **API Keys**
2. Copy the following:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)

### Step 3: Add Environment Variables

1. Create or update `.env.local` in your project root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional: Customize sign-in/sign-up URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/student-dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/student-dashboard
```

### Step 4: Configure OAuth Providers (Optional)

1. In Clerk Dashboard, go to **User & Authentication** → **Social Connections**
2. Enable providers you want:
   - ✅ Google
   - ✅ GitHub
   - ✅ Microsoft
   - ✅ Apple
   - ✅ etc.

3. Follow the setup instructions for each provider (you'll need OAuth credentials)

### Step 5: Configure User Roles

1. In Clerk Dashboard, go to **User & Authentication** → **Roles**
2. Add custom roles:
   - `student`
   - `trainer`
   - `admin`
   - `corporate`

3. Assign roles to users in the **Users** section

### Step 6: Restart Your Dev Server

```bash
npm run dev
```

## ✅ Verification

1. Visit http://localhost:3000/login
2. You should see Clerk's sign-in interface
3. Try signing in with:
   - Email/password
   - OAuth providers (if configured)

## 🔧 Customization

### Custom Sign-In Page

The login page at `app/login/page.tsx` now uses Clerk's `<SignIn />` component. You can customize it by:

1. **Styling**: Clerk components use CSS variables - customize in `globals.css`
2. **Layout**: Modify the page structure in `app/login/page.tsx`
3. **Branding**: Add your logo and colors in Clerk Dashboard → **Appearance**

### User Roles & Metadata

Access user roles in your components:

```typescript
import { useUser } from '@clerk/nextjs'

export default function MyComponent() {
  const { user } = useUser()
  const role = user?.publicMetadata?.role as string
  
  // Use role to determine access
}
```

## 📚 Clerk Documentation

- **Next.js Integration**: https://clerk.com/docs/quickstarts/nextjs
- **Authentication**: https://clerk.com/docs/authentication
- **User Management**: https://clerk.com/docs/users
- **Customization**: https://clerk.com/docs/customization

## 🐛 Troubleshooting

### Issue: "Clerk: Missing publishableKey"

**Fix**: Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in `.env.local` and restart the dev server.

### Issue: OAuth not working

**Fix**: 
1. Check OAuth credentials in Clerk Dashboard
2. Verify redirect URLs are correct
3. Make sure OAuth provider is enabled

### Issue: User roles not working

**Fix**:
1. Assign roles in Clerk Dashboard → Users
2. Check `user.publicMetadata.role` in your code
3. Verify middleware is protecting routes correctly

## 🎯 Next Steps

1. ✅ Set up environment variables
2. ✅ Configure OAuth providers
3. ✅ Test sign-in/sign-up flow
4. ✅ Assign user roles
5. ✅ Update protected routes
6. ✅ Customize appearance

---

**Need Help?** Check Clerk's documentation or their Discord community!

