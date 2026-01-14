# Quick Fix: Failed to Load Clerk Script Error

## 🚨 Immediate Action Required

This error means Clerk's JavaScript isn't loading. **90% of the time, it's because your domain isn't configured in Clerk Dashboard.**

## ⚡ Quick Fix (2 Minutes)

### Step 1: Add Domain to Clerk Dashboard

1. **Go to Clerk Dashboard**
   - https://dashboard.clerk.com
   - Make sure dropdown at top says **"Production"** (not Development)
   - Select your application

2. **Add Your Domain**
   - Go to **Settings** → **Frontend API**
   - Click **"Add Domain"**
   - Add: `https://yourdomain.com` (or `https://your-project.vercel.app` if testing)
   - Click **Save**
   - **Wait 1-2 minutes**

3. **Refresh Your Page**
   - Hard refresh: `Ctrl+Shift+R`
   - The error should be gone!

## 🔍 If That Doesn't Work

### Check 1: Verify You're Using Production Keys

**In Vercel:**
- Go to Settings → Environment Variables
- Check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` starts with `pk_live_` (NOT `pk_test_`)
- Check `CLERK_SECRET_KEY` starts with `sk_live_` (NOT `sk_test_`)

### Check 2: Check Browser Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for:
   - `❌ Clerk script not found`
   - `CORS policy` errors
   - `403 Forbidden` errors
   - `Failed to load resource`

### Check 3: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Filter by "clerk"
4. Look for failed requests (red)
5. Check the error:
   - **403** = Domain not whitelisted
   - **CORS** = Domain not in allowed origins
   - **Blocked** = Ad blocker

### Check 4: Disable Ad Blockers

- Temporarily disable browser extensions
- Try incognito mode
- Test if Clerk loads

## 🎯 Most Common Solutions

| Error | Solution |
|-------|----------|
| Domain not whitelisted | Add domain to Clerk Dashboard → Settings → Frontend API |
| 403 Forbidden | Domain not added to Clerk Dashboard |
| CORS error | Domain not in allowed origins |
| Script blocked | Disable ad blocker |
| Wrong keys | Use `pk_live_` not `pk_test_` |

## ✅ Verification

After adding domain, check:

1. **Browser Console** - Should see: `✅ Clerk script loaded successfully`
2. **Network Tab** - Requests to Clerk should show **200 OK**
3. **Sign-in Page** - Should load properly (not blank)

## 🆘 Still Not Working?

1. **Verify Domain Format**
   - ✅ `https://yourdomain.com` (correct)
   - ❌ `http://yourdomain.com` (wrong - must be HTTPS)
   - ❌ `yourdomain.com` (wrong - must include https://)

2. **Check Clerk Dashboard**
   - Make sure you're in **Production** instance
   - Verify domain shows as "Active" or "Valid"

3. **Redeploy Application**
   - After adding domain, redeploy on Vercel
   - This ensures environment variables are loaded

---

**Remember:** Production keys (`pk_live_`) require domain whitelisting. This is the #1 cause of this error!

