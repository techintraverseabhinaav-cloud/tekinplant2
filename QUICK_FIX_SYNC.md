# Quick Fix: Sync Errors

## 🚨 Common Issues & Quick Fixes

### Issue 1: "SUPABASE_SERVICE_ROLE_KEY not set"

**Fix:**
1. Open `.env.local` in project root
2. Add this line:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
3. Get key from: Supabase Dashboard → Settings → API → Service Role Key
4. Restart dev server: `npm run dev`

### Issue 2: "column clerk_id does not exist"

**Fix:**
1. Go to Supabase Dashboard → SQL Editor
2. Run this:
   ```sql
   ALTER TABLE public.profiles 
   ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;
   ```

### Issue 3: Sync not working / No errors

**Fix:**
1. Check browser console (F12) for errors
2. Make sure `.env.local` has both:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Restart dev server after adding env vars

### Issue 4: Infinite sync loops

**Fixed!** The sync component now only syncs once per user session.

### Issue 5: TypeScript/Import errors

**Fixed!** Removed unused imports and cleaned up code.

---

## ✅ What's Fixed

1. ✅ Removed duplicate sync logic
2. ✅ Fixed useEffect dependencies
3. ✅ Added proper error handling
4. ✅ Sync only happens once per user
5. ✅ Cleaned up unused code

---

## 🧪 Test It

1. **Sign in** with Clerk
2. **Open browser console** (F12)
3. **Look for**: `✅ User synced to Supabase successfully`
4. **Check Supabase**: Table Editor → profiles → should see your email

---

**If still having issues, check browser console for specific error messages!**

