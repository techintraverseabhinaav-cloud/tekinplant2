# Clerk Production Mode Setup Guide

This guide will help you convert your Clerk authentication from development mode to production mode.

## 📋 Prerequisites

- Clerk account (sign up at https://clerk.com if you don't have one)
- Your application deployed or ready to deploy
- Access to your deployment environment variables

## 🔑 Step 1: Get Production Keys from Clerk

1. **Log in to Clerk Dashboard**
   - Go to https://dashboard.clerk.com
   - Sign in to your account

2. **Select Your Application**
   - Choose your application from the dashboard
   - If you don't have a production application yet, create one:
     - Click "Create Application"
     - Choose "Production" environment
     - Name it (e.g., "TekinPlant Production")

3. **Get Your API Keys**
   - Navigate to **API Keys** in the left sidebar
   - You'll see two keys:
     - **Publishable Key** (starts with `pk_`)
     - **Secret Key** (starts with `sk_`)

4. **Copy Both Keys**
   - Click the copy icon next to each key
   - Save them securely (you'll need them in Step 2)

## 🔧 Step 2: Update Environment Variables

### For Local Development (`.env.local`)

Update your `.env.local` file with production keys:

```env
# Clerk Production Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx

# Your existing Supabase keys (keep these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### For Production Deployment

Add the same environment variables to your hosting platform:

#### **Vercel**
1. Go to your project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_...`
   - `CLERK_SECRET_KEY` = `sk_live_...`
4. Make sure to select **Production** environment
5. Click **Save**

#### **Netlify**
1. Go to **Site settings** → **Environment variables**
2. Add each variable
3. Set scope to **Production**
4. Click **Save**

#### **Other Platforms**
- Add the environment variables in your platform's settings
- Ensure they're set for the **Production** environment

## 🌐 Step 3: Configure Allowed URLs in Clerk

1. **Go to Clerk Dashboard** → Your Application → **Settings**

2. **Configure Frontend API**
   - Scroll to **Frontend API** section
   - Add your production domain:
     - Example: `https://yourdomain.com`
     - Example: `https://www.yourdomain.com`
   - Add any subdomains if needed

3. **Configure Redirect URLs**
   - Go to **Paths** section
   - Add your production URLs:
     - Sign-in: `https://yourdomain.com/login`
     - Sign-up: `https://yourdomain.com/sign-up`
     - After sign-in: `https://yourdomain.com/redirect-dashboard`
     - After sign-up: `https://yourdomain.com/redirect-dashboard`

4. **Configure Allowed Origins** (if using OAuth)
   - Go to **OAuth** section
   - Add your production domain to **Allowed Origins**

## 🔒 Step 4: Update ClerkProvider (Optional)

Your current `app/layout.tsx` should work as-is, but you can add production-specific settings:

```tsx
<ClerkProvider
  publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
  // Optional: Add production-specific settings
  appearance={{
    // Customize Clerk UI for production
  }}
>
  {/* ... */}
</ClerkProvider>
```

## ✅ Step 5: Verify Production Setup

1. **Test Sign-In**
   - Visit your production URL
   - Try signing in with a test account
   - Verify redirect works correctly

2. **Test Sign-Up**
   - Try creating a new account
   - Verify user is created in Clerk dashboard
   - Verify user syncs to Supabase

3. **Check Clerk Dashboard**
   - Go to **Users** section
   - Verify new users appear
   - Check user metadata is correct

## 🚨 Important Notes

### Development vs Production

- **Development Keys** (starts with `pk_test_` and `sk_test_`):
  - Use for local development
  - Limited features
  - Test environment

- **Production Keys** (starts with `pk_live_` and `sk_live_`):
  - Use for production deployment
  - Full features
  - Real user data

### Security Best Practices

1. **Never commit keys to Git**
   - Keep `.env.local` in `.gitignore`
   - Use environment variables in production

2. **Rotate keys if compromised**
   - Go to Clerk Dashboard → API Keys
   - Click "Rotate" if needed

3. **Use different keys for dev/prod**
   - Keep development and production keys separate
   - Don't mix them

## 🔄 Step 6: Update Middleware (Already Configured)

Your `middleware.ts` is already set up correctly for production. No changes needed.

## 📝 Checklist

- [ ] Created production application in Clerk Dashboard
- [ ] Copied production API keys (Publishable and Secret)
- [ ] Updated `.env.local` with production keys (for testing)
- [ ] Added environment variables to production hosting platform
- [ ] Configured allowed URLs in Clerk Dashboard
- [ ] Configured redirect URLs in Clerk Dashboard
- [ ] Tested sign-in on production
- [ ] Tested sign-up on production
- [ ] Verified users appear in Clerk Dashboard
- [ ] Verified users sync to Supabase

## 🆘 Troubleshooting

### Issue: "Invalid API key"
- **Solution**: Double-check you're using production keys (`pk_live_` and `sk_live_`)
- Make sure keys are correctly set in environment variables

### Issue: "Redirect URL not allowed"
- **Solution**: Add your production domain to Clerk Dashboard → Settings → Frontend API

### Issue: Users not syncing to Supabase
- **Solution**: Check that `SUPABASE_SERVICE_ROLE_KEY` is set in production environment
- Verify Supabase RLS policies allow the sync

### Issue: Can't sign in on production
- **Solution**: 
  - Check environment variables are set correctly
  - Verify Clerk middleware is working
  - Check browser console for errors

## 📚 Additional Resources

- [Clerk Production Deployment Guide](https://clerk.com/docs/deployments/overview)
- [Clerk Environment Variables](https://clerk.com/docs/quickstarts/nextjs#add-your-api-keys)
- [Clerk Dashboard](https://dashboard.clerk.com)

---

**Need Help?** Check Clerk's documentation or contact their support team.

