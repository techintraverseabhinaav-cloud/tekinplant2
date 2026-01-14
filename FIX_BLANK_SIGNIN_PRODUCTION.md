# Fix: Blank Sign-In Page with Production Keys

If your sign-in page is showing blank after switching to Clerk production keys, follow these steps:

## 🔍 Common Causes

1. **Domain not configured in Clerk Dashboard** (Most Common)
2. **Environment variables not set correctly**
3. **CORS/Origin mismatch**
4. **Clerk component failing to load**

## ✅ Step-by-Step Fix

### Step 1: Verify Domain in Clerk Dashboard

**This is the #1 cause of blank sign-in pages with production keys!**

1. **Go to Clerk Dashboard**
   - Visit https://dashboard.clerk.com
   - Make sure you're in the **Production** instance (not Development)
   - Select your application

2. **Configure Frontend API**
   - Go to **Settings** → **Frontend API**
   - Add your domain(s):
     ```
     https://yourdomain.com
     https://www.yourdomain.com
     ```
   - If using Vercel preview URLs, also add:
     ```
     https://your-project.vercel.app
     ```
   - Click **Save**

3. **Verify Paths Configuration**
   - Go to **Settings** → **Paths**
   - Make sure these are set:
     - Sign-in URL: `https://yourdomain.com/login`
     - Sign-up URL: `https://yourdomain.com/sign-up`
     - After sign-in: `https://yourdomain.com/redirect-dashboard`
     - After sign-up: `https://yourdomain.com/redirect-dashboard`
   - Click **Save**

### Step 2: Check Browser Console

1. **Open Developer Tools**
   - Press `F12` or `Ctrl+Shift+I`
   - Go to **Console** tab

2. **Look for Errors**
   - Common errors:
     - `Clerk: Missing publishableKey`
     - `CORS policy: No 'Access-Control-Allow-Origin'`
     - `Failed to load resource: net::ERR_BLOCKED_BY_CLIENT`
     - `Invalid API key`

3. **Check Network Tab**
   - Go to **Network** tab
   - Refresh the page
   - Look for failed requests to `clerk.com` or `clerk.dev`
   - Check if requests are being blocked

### Step 3: Verify Environment Variables

1. **Check Vercel Environment Variables**
   - Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
   - Verify:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_...` (NOT `pk_test_`)
     - `CLERK_SECRET_KEY` = `sk_live_...` (NOT `sk_test_`)
   - Make sure they're set for **Production** environment

2. **Redeploy After Changes**
   - After updating environment variables, **redeploy**:
     - Go to **Deployments**
     - Click **"..."** on latest deployment
     - Select **"Redeploy"**

### Step 4: Check ClerkProvider Configuration

Verify your `app/layout.tsx` has the correct setup:

```tsx
<ClerkProvider
  publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
>
  {/* ... */}
</ClerkProvider>
```

### Step 5: Test with Development Keys (Temporary)

To verify if it's a production key issue:

1. **Temporarily switch back to development keys** in Vercel
2. **Redeploy**
3. **Test sign-in page**
4. If it works with dev keys but not production keys, it's a domain configuration issue

### Step 6: Clear Cache and Test

1. **Clear Browser Cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or use incognito/private mode

2. **Test in Different Browser**
   - Try Chrome, Firefox, or Edge
   - This helps identify browser-specific issues

## 🚨 Quick Fixes

### Fix 1: Add Domain to Clerk Dashboard

**Most Important!** Production keys require domain whitelisting:

1. Clerk Dashboard → Settings → Frontend API
2. Add: `https://yourdomain.com`
3. Save and wait 1-2 minutes
4. Refresh your sign-in page

### Fix 2: Verify API Keys

Make sure you're using **production keys** (`pk_live_` and `sk_live_`), not development keys (`pk_test_` and `sk_test_`).

### Fix 3: Check for Ad Blockers

Some ad blockers block Clerk's JavaScript. Try:
- Disabling ad blockers
- Using incognito mode
- Testing in a different browser

### Fix 4: Verify SSL Certificate

Make sure your domain has a valid SSL certificate:
- Check Vercel Dashboard → Domains
- SSL should show as "Valid" or "Active"
- If not, wait a few minutes for automatic provisioning

## 🔧 Advanced Troubleshooting

### Check Clerk Component Loading

Add this to your sign-in page temporarily to debug:

```tsx
import { useClerk } from '@clerk/nextjs'

export default function LoginPage() {
  const clerk = useClerk()
  
  useEffect(() => {
    console.log('Clerk loaded:', !!clerk)
    console.log('Publishable key:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 10))
  }, [clerk])
  
  // ... rest of component
}
```

### Verify Network Requests

1. Open Developer Tools → Network tab
2. Filter by "clerk"
3. Check if requests to `clerk.com` or `clerk.dev` are:
   - ✅ Returning 200 status
   - ❌ Being blocked (CORS errors)
   - ❌ Returning 403/401 (domain not whitelisted)

## 📝 Checklist

Use this checklist to ensure everything is configured:

- [ ] Domain added to Clerk Dashboard → Settings → Frontend API
- [ ] Paths configured in Clerk Dashboard → Settings → Paths
- [ ] Production keys (`pk_live_` and `sk_live_`) set in Vercel
- [ ] Environment variables set for Production environment in Vercel
- [ ] Application redeployed after environment variable changes
- [ ] SSL certificate active on domain
- [ ] Browser cache cleared
- [ ] No ad blockers interfering
- [ ] Console shows no errors
- [ ] Network requests to Clerk are successful

## 🆘 Still Not Working?

If the sign-in page is still blank after following all steps:

1. **Check Clerk Dashboard Logs**
   - Go to Clerk Dashboard → Logs
   - Look for errors related to your domain

2. **Contact Clerk Support**
   - They can check if your domain is properly whitelisted
   - They can verify your production keys are active

3. **Verify Domain DNS**
   - Make sure your domain is correctly pointing to Vercel
   - Check DNS propagation at [whatsmydns.net](https://www.whatsmydns.net)

4. **Test with Development Keys**
   - Temporarily switch to development keys
   - If it works, the issue is definitely domain configuration

---

**Most Common Solution:** Add your domain to Clerk Dashboard → Settings → Frontend API. This is required for production keys to work!

