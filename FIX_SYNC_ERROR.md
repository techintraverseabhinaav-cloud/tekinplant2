# Fix: Sync Failed Error

## 🔍 Quick Diagnosis

When you see "sync failed", check the browser console (F12) for the specific error message.

## 🚨 Common Causes & Fixes

### Error 1: "SUPABASE_SERVICE_ROLE_KEY not set"

**What it means:** The service role key is missing from environment variables.

**Fix:**
1. Open `.env.local` in your project root
2. Add this line:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
3. Get the key from: **Supabase Dashboard** → **Settings** → **API** → **Service Role Key**
4. **Restart your dev server**: `npm run dev`

### Error 2: "column clerk_id does not exist"

**What it means:** The database migration wasn't run.

**Fix:**
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and run this:
   ```sql
   ALTER TABLE public.profiles 
   ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;
   
   CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON public.profiles(clerk_id);
   ```
3. Or run the full migration: `supabase/migrate-clerk-support.sql`

### Error 3: "duplicate key value violates unique constraint"

**What it means:** Profile already exists (this is actually OK - it should update).

**Fix:** This is now handled automatically - the sync will update existing profiles.

### Error 4: "permission denied" or RLS error

**What it means:** Row Level Security is blocking the insert.

**Fix:** Make sure you're using the **Service Role Key** (not the anon key). It bypasses RLS.

### Error 5: "relation profiles does not exist"

**What it means:** The profiles table doesn't exist.

**Fix:** Run `supabase/schema.sql` in Supabase SQL Editor first.

## 🧪 Test Steps

1. **Open browser console** (F12)
2. **Sign in** with Clerk
3. **Look for error message** in console
4. **Check the error code/message** and use the fix above

## 📋 Checklist

- [ ] `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `.env.local` has `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Migration SQL was run (`migrate-clerk-support.sql`)
- [ ] `clerk_id` column exists in `profiles` table
- [ ] Dev server was restarted after adding env vars

## 🔧 Manual Test

After fixing, test in browser console:

```javascript
fetch('/api/sync-user', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

Should return: `{ success: true, profile: {...} }`

---

**Check the browser console for the exact error message to get the right fix!**

