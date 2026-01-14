# Fix "Failed to Load Clerk" Error

## 🚨 Immediate Fix (Most Common)

### Step 1: Restart Dev Server
```powershell
# Stop server (Ctrl+C)
# Delete .next folder
Remove-Item -Recurse -Force .next
# Restart
npm run dev
```

### Step 2: Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R`
- Or use incognito mode: `Ctrl+Shift+N`

### Step 3: Check Clerk Dashboard Domain Settings

**IMPORTANT:** Since you're using **production keys** (`pk_live_...`), you need to configure allowed domains in Clerk Dashboard:

1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to **Settings** → **Frontend API**
4. Add these domains:
   - `http://localhost:3000` (for development)
   - `http://localhost:3001` (if using different port)
   - Your production domain (e.g., `https://yourdomain.com`)

5. Go to **Settings** → **Paths**
   - Verify these are set:
     - Sign-in: `/login`
     - Sign-up: `/sign-up`
     - After sign-in: `/redirect-dashboard`
     - After sign-up: `/redirect-dashboard`

## 🔍 Diagnostic Steps

### Check Browser Console
1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for errors like:
   - `Failed to load Clerk JS`
   - `CORS error`
   - `404 Not Found`
   - Network errors

### Check Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Look for failed requests to:
   - `clerk.tek-inplant.com`
   - `*.clerk.accounts.dev`
   - `*.clerk.com`
5. Check the status code:
   - **404** = Domain not configured
   - **403** = CORS issue
   - **CORS error** = Domain not in allowed list

## ✅ Solution Checklist

- [ ] Dev server restarted (after deleting `.next` folder)
- [ ] Browser cache cleared (hard refresh)
- [ ] `localhost:3000` added to Clerk Dashboard → Settings → Frontend API
- [ ] Environment variables verified (run `node scripts/check-clerk-config.js`)
- [ ] Browser console checked for specific errors
- [ ] Network tab checked for failed requests

## 🔧 Alternative: Use Development Keys for Local Development

If production keys are causing issues, you can use development keys for local development:

1. Go to Clerk Dashboard
2. Create a **Development** instance (or use existing)
3. Get development keys (start with `pk_test_...`)
4. Update `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
5. Restart dev server

**Note:** Development keys work automatically with `localhost` without domain configuration.

## 🆘 Still Not Working?

### Check These:

1. **Internet Connection**
   - Ensure you can access https://clerk.com
   - Check if firewall is blocking Clerk domains

2. **Browser Extensions**
   - Disable ad blockers temporarily
   - Disable privacy extensions
   - Try different browser

3. **Clerk Status**
   - Check https://status.clerk.com
   - Verify no service outages

4. **Package Version**
   ```bash
   npm list @clerk/nextjs
   # Should show: @clerk/nextjs@6.36.5
   ```

5. **Reinstall Clerk**
   ```bash
   npm uninstall @clerk/nextjs
   npm install @clerk/nextjs@latest
   npm run dev
   ```

## 📝 Common Error Messages

| Error | Solution |
|-------|----------|
| `Failed to load Clerk JS` | Add domain to Clerk Dashboard → Frontend API |
| `CORS error` | Add domain to allowed origins |
| `404 Not Found` | Domain not configured in Clerk Dashboard |
| `Invalid publishable key` | Verify key in `.env.local` matches Clerk Dashboard |
| `Network error` | Check internet connection, firewall, or Clerk status |

---

**Most Common Fix:** Add `http://localhost:3000` to Clerk Dashboard → Settings → Frontend API

