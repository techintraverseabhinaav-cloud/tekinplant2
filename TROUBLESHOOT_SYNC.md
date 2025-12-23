# Troubleshooting: Clerk to Supabase Sync

## 🔍 Why Profiles Aren't Appearing

If users sign in but profiles don't appear in Supabase, check these:

### ✅ Checklist

1. **Service Role Key Set?**
   ```bash
   # Check .env.local has:
   SUPABASE_SERVICE_ROLE_KEY=your_key_here
   ```
   - Get it from: Supabase Dashboard → Settings → API → Service Role Key
   - ⚠️ Keep this secret!

2. **Migration Run?**
   - Did you run `supabase/migrate-clerk-support.sql` in Supabase SQL Editor?
   - Check if `clerk_id` column exists in `profiles` table

3. **Check Browser Console**
   - Open DevTools (F12) → Console
   - Look for sync messages:
     - ✅ `🔄 Syncing user to Supabase...`
     - ✅ `✅ User synced to Supabase successfully`
     - ❌ Any error messages

4. **Check Network Tab**
   - Open DevTools → Network
   - Look for `/api/sync-user` request
   - Check if it returns 200 (success) or error

5. **Check Supabase Logs**
   - Go to Supabase Dashboard → Logs
   - Look for errors when sync runs

## 🐛 Common Errors

### Error: "SUPABASE_SERVICE_ROLE_KEY not set"

**Fix:**
1. Add to `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
2. Restart dev server: `npm run dev`

### Error: "column clerk_id does not exist"

**Fix:**
1. Run `supabase/migrate-clerk-support.sql` in Supabase SQL Editor
2. Verify column exists: Check Table Editor → profiles → clerk_id column

### Error: "permission denied" or RLS error

**Fix:**
1. Make sure you're using Service Role Key (bypasses RLS)
2. Check RLS policies in `migrate-clerk-support.sql` were created

### Error: "duplicate key value violates unique constraint"

**Fix:**
- This means profile already exists
- The sync should update it, not create new
- Check if `clerk_id` or `email` already exists

## 🧪 Test the Sync

### Manual Test

1. **Sign in** with Clerk
2. **Open browser console** (F12)
3. **Look for these messages:**
   ```
   🔄 Syncing user to Supabase... user_xxxxx
   ✅ User synced to Supabase successfully
   ```
4. **Check Supabase:**
   - Go to Table Editor → profiles
   - Should see new row with your email

### Test API Directly

```bash
# In browser console after signing in:
fetch('/api/sync-user', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

Should return: `{ success: true, profile: {...} }`

## 📊 Verify Sync Worked

### Check Supabase Table Editor

1. Go to **Supabase Dashboard** → **Table Editor** → **profiles**
2. After signing in, you should see:
   - ✅ Row with your email
   - ✅ `clerk_id` column populated
   - ✅ `full_name` set
   - ✅ `role` set (default: 'student')

### Check Browser Console

After signing in, you should see:
```
🔄 Syncing user to Supabase... user_xxxxx
✅ User synced to Supabase successfully
```

## 🔧 Debug Steps

1. **Check Environment Variables**
   ```bash
   # In terminal:
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $SUPABASE_SERVICE_ROLE_KEY
   ```
   Or check `.env.local` file

2. **Check API Route**
   - Visit: http://localhost:3000/api/sync-user
   - Should return error (needs authentication)
   - But confirms route exists

3. **Check Sync Component**
   - Component is added to login/sign-up pages
   - Should trigger automatically when user loads

4. **Check Supabase Connection**
   - Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
   - Test connection in Supabase Dashboard

## 🚀 Quick Fix

If nothing works, try this:

1. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

2. **Run migration:**
   - Copy `supabase/migrate-clerk-support.sql`
   - Run in Supabase SQL Editor

3. **Restart server:**
   ```bash
   npm run dev
   ```

4. **Sign in again:**
   - Sign out
   - Sign in with Clerk
   - Check console for sync messages
   - Check Supabase Table Editor

## 📝 Still Not Working?

1. **Check browser console** for specific errors
2. **Check Supabase logs** for database errors
3. **Verify service role key** is correct
4. **Make sure migration** was run successfully

---

**The sync should happen automatically when you sign in!** Check the browser console to see what's happening.

