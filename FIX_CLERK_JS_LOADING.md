# Fix "Failed to Load Clerk JS" Error

## 🔍 Common Causes

1. **Network/CORS Issues** - Clerk's JavaScript SDK can't load
2. **Invalid Publishable Key** - Key is malformed or incorrect
3. **Environment Variables Not Loaded** - Keys not available at runtime
4. **Content Security Policy** - Blocking Clerk scripts
5. **Browser Extensions** - Ad blockers or security extensions blocking scripts

## ✅ Quick Fixes

### Fix 1: Restart Dev Server
```bash
# Stop the server (Ctrl+C)
# Delete .next folder
rm -rf .next
# Restart
npm run dev
```

### Fix 2: Verify Environment Variables
```bash
# Check if keys are set
Get-Content .env.local | Select-String "CLERK"

# Should show:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
# CLERK_SECRET_KEY=sk_live_...
```

### Fix 3: Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear browser cache completely
- Try incognito/private mode

### Fix 4: Check Browser Console
1. Open browser console (F12)
2. Look for errors related to:
   - `clerk.tek-inplant.com`
   - `clerk.accounts.dev`
   - Network errors
   - CORS errors

### Fix 5: Verify Clerk Dashboard
1. Go to https://dashboard.clerk.com
2. Check your application is active
3. Verify the publishable key matches your `.env.local`

## 🔧 Advanced Fixes

### Fix 6: Update Next.js Config
The `next.config.mjs` has been updated to allow Clerk domains. If issues persist:

1. Check if your hosting platform has CSP (Content Security Policy) settings
2. Add Clerk domains to allowed list:
   - `https://clerk.tek-inplant.com`
   - `https://*.clerk.accounts.dev`
   - `https://*.clerk.com`

### Fix 7: Check Network Tab
1. Open browser DevTools → Network tab
2. Look for failed requests to Clerk domains
3. Check if requests are being blocked
4. Look for 404, 403, or CORS errors

### Fix 8: Verify Clerk Instance
1. Go to Clerk Dashboard
2. Check if your instance is active
3. Verify you're using the correct instance (Production vs Development)
4. Check if there are any service alerts

## 🚨 If Still Not Working

### Option 1: Reinstall Clerk Package
```bash
npm uninstall @clerk/nextjs
npm install @clerk/nextjs@latest
```

### Option 2: Check Package Version
```bash
npm list @clerk/nextjs
# Should show version 6.36.5 or latest
```

### Option 3: Verify Key Format
Your publishable key should:
- Start with `pk_live_` (production) or `pk_test_` (development)
- Be a long string (usually 50+ characters)
- Not have any spaces or line breaks

### Option 4: Test with New Keys
1. Go to Clerk Dashboard → API Keys
2. Generate new keys (if possible)
3. Update `.env.local` with new keys
4. Restart dev server

## 📝 Verification Checklist

- [ ] Environment variables are set correctly
- [ ] Dev server has been restarted
- [ ] Browser cache has been cleared
- [ ] No browser extensions blocking scripts
- [ ] Clerk Dashboard shows active instance
- [ ] Network tab shows no blocked requests
- [ ] Console shows no CORS errors

## 🆘 Still Having Issues?

1. **Check Clerk Status**: https://status.clerk.com
2. **Check Browser Console**: Look for specific error messages
3. **Try Different Browser**: Rule out browser-specific issues
4. **Check Network**: Ensure you can access Clerk's CDN

---

**Common Error Messages:**
- `Failed to load Clerk JS` → Usually network/CSP issue
- `Invalid publishable key` → Check your key format
- `CORS error` → Add Clerk domains to CSP
- `404 Not Found` → Check Clerk instance is active

