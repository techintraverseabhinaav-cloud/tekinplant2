# Fix: Clerk Script Not Found

If you're seeing "Clerk script not found" error, this means Clerk's JavaScript isn't loading. Here's how to fix it:

## 🚨 Most Common Cause: Domain Not Configured

**Production keys require your domain to be whitelisted in Clerk Dashboard!**

## ✅ Step-by-Step Fix

### Step 1: Add Domain to Clerk Dashboard (CRITICAL)

1. **Go to Clerk Dashboard**
   - Visit https://dashboard.clerk.com
   - Make sure you're in the **Production** instance (check dropdown at top)
   - Select your application

2. **Configure Frontend API**
   - Go to **Settings** → **Frontend API**
   - Click **"Add Domain"** or **"Edit"**
   - Add your domain:
     ```
     https://yourdomain.com
     ```
   - If using Vercel, also add:
     ```
     https://your-project.vercel.app
     ```
   - Click **Save**
   - **Wait 1-2 minutes** for changes to propagate

3. **Verify Domain is Added**
   - Check that your domain appears in the list
   - Make sure it shows as "Active" or "Valid"

### Step 2: Check Browser Console

1. **Open Developer Tools**
   - Press `F12` or `Ctrl+Shift+I`
   - Go to **Console** tab

2. **Look for Errors**
   - `CORS policy: No 'Access-Control-Allow-Origin'`
   - `Failed to load resource: net::ERR_BLOCKED_BY_CLIENT`
   - `403 Forbidden` when loading Clerk script
   - `Network request failed`

3. **Check Network Tab**
   - Go to **Network** tab
   - Filter by "clerk"
   - Look for failed requests (red status)
   - Check if requests to `clerk.com` or `clerk.dev` are being blocked

### Step 3: Verify Environment Variables

1. **Check Vercel Environment Variables**
   - Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
   - Verify:
     - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_...` (NOT `pk_test_`)
     - `CLERK_SECRET_KEY` = `sk_live_...` (NOT `sk_test_`)
   - Make sure they're set for **Production** environment

2. **Redeploy After Changes**
   - After updating environment variables or Clerk settings, **redeploy**:
     - Go to **Deployments**
     - Click **"..."** on latest deployment
     - Select **"Redeploy"**

### Step 4: Check for Ad Blockers

Ad blockers can block Clerk's JavaScript:

1. **Disable Ad Blockers**
   - Temporarily disable browser extensions (uBlock Origin, AdBlock, etc.)
   - Refresh the page

2. **Test in Incognito Mode**
   - Open incognito/private window
   - Ad blockers are usually disabled in incognito
   - Test if Clerk loads

3. **Whitelist Clerk Domains**
   - If you must use ad blocker, whitelist:
     - `*.clerk.com`
     - `*.clerk.dev`
     - `*.clerk.accounts.dev`

### Step 5: Check SSL Certificate

1. **Verify SSL is Active**
   - Go to Vercel Dashboard → **Settings** → **Domains**
   - Check that SSL shows as "Valid" or "Active"
   - If not, wait a few minutes for automatic provisioning

2. **Test HTTPS**
   - Make sure you're accessing `https://` (not `http://`)
   - Clerk requires HTTPS in production

### Step 6: Clear Cache

1. **Clear Browser Cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or clear cache in browser settings

2. **Test in Different Browser**
   - Try Chrome, Firefox, or Edge
   - This helps identify browser-specific issues

## 🔧 Advanced Troubleshooting

### Check Network Requests

1. Open Developer Tools → **Network** tab
2. Filter by "clerk"
3. Look for:
   - ✅ **200 OK** = Script loaded successfully
   - ❌ **403 Forbidden** = Domain not whitelisted
   - ❌ **CORS error** = Domain not in allowed origins
   - ❌ **Blocked** = Ad blocker or firewall blocking

### Manual Script Loading Test

If Clerk script isn't loading, test manually:

1. Open browser console
2. Run this command (replace with your publishable key):
   ```javascript
   const script = document.createElement('script')
   script.src = 'https://YOUR_PUBLISHABLE_KEY.clerk.accounts.dev/npm/@clerk/clerk-js@latest/dist/clerk.browser.js'
   script.async = true
   script.onerror = () => console.error('Failed to load')
   script.onload = () => console.log('Loaded successfully')
   document.head.appendChild(script)
   ```

3. Check console for errors
   - If it fails, domain is likely not whitelisted
   - If it succeeds, there's a different issue

### Verify Domain Format

Make sure you're adding the domain correctly in Clerk Dashboard:

✅ **Correct:**
- `https://yourdomain.com`
- `https://www.yourdomain.com`
- `https://your-project.vercel.app`

❌ **Incorrect:**
- `http://yourdomain.com` (must be HTTPS)
- `yourdomain.com` (must include protocol)
- `yourdomain.com/login` (just the domain, not paths)

## 📝 Checklist

Use this checklist to ensure everything is configured:

- [ ] Domain added to Clerk Dashboard → Settings → Frontend API
- [ ] Domain uses `https://` protocol (not `http://`)
- [ ] Production keys (`pk_live_` and `sk_live_`) set in Vercel
- [ ] Environment variables set for Production environment
- [ ] Application redeployed after changes
- [ ] SSL certificate active on domain
- [ ] Ad blockers disabled or Clerk domains whitelisted
- [ ] Browser cache cleared
- [ ] Tested in different browser
- [ ] Network tab shows successful requests to Clerk
- [ ] Console shows no CORS errors

## 🆘 Still Not Working?

If Clerk script still isn't loading:

1. **Check Clerk Dashboard Logs**
   - Go to Clerk Dashboard → **Logs**
   - Look for errors related to your domain or API key

2. **Verify DNS Configuration**
   - Make sure your domain is correctly pointing to Vercel
   - Check DNS propagation at [whatsmydns.net](https://www.whatsmydns.net)

3. **Contact Clerk Support**
   - They can verify if your domain is properly whitelisted
   - They can check if there are any account-level restrictions

4. **Temporary Workaround: Use Development Keys**
   - Switch back to development keys (`pk_test_`) temporarily
   - This will work without domain configuration
   - Use this only for testing, not production

## 🎯 Quick Reference

### Most Common Solutions (in order):

1. ✅ **Add domain to Clerk Dashboard → Settings → Frontend API** (90% of cases)
2. ✅ **Disable ad blockers**
3. ✅ **Clear browser cache**
4. ✅ **Verify production keys are set correctly**
5. ✅ **Redeploy application**

---

**Remember:** Production keys (`pk_live_`) require domain whitelisting. Development keys (`pk_test_`) work with localhost automatically.

