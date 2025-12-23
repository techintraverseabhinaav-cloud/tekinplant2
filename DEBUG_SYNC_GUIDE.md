# Debug Sync Issues - Step by Step Guide

## 🔍 Step 1: Check Browser Console

1. **Open your app** in the browser
2. **Press F12** to open Developer Tools
3. **Go to Console tab**
4. **Sign in** with Clerk
5. **Look for these messages:**
   - ✅ `🔄 Syncing user to Supabase...` - Sync started
   - ✅ `✅ User synced to Supabase successfully` - Success!
   - ❌ `❌ Sync failed:` - Error occurred

**Copy the exact error message** you see.

---

## 🔍 Step 2: Check Terminal/Server Logs

1. **Look at your terminal** where `npm run dev` is running
2. **Check for these messages:**
   - `📥 Sync user API called` - API was called
   - `👤 User found:` - User detected
   - `❌ SUPABASE_SERVICE_ROLE_KEY not set` - Missing env var
   - `❌ Error syncing user:` - Database error

**Copy any error messages** you see.

---

## 🔍 Step 3: Use Diagnostic Page

1. **Sign in** to your app
2. **Navigate to:** `http://localhost:3000/debug-sync`
3. **Click "Test Sync Now"** button
4. **Check the results** - it will show you exactly what's wrong

---

## 🚨 Common Errors & Fixes

### Error 1: "SUPABASE_SERVICE_ROLE_KEY not set"

**What it means:** The service role key is missing from `.env.local`

**Fix:**
1. Open `.env.local` in your project root (create it if it doesn't exist)
2. Add this line:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
3. **Get the key:**
   - Go to **Supabase Dashboard**
   - Click **Settings** → **API**
   - Find **Service Role Key** (starts with `eyJ...`)
   - Copy it (⚠️ Keep it secret!)
4. **Restart dev server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

---

### Error 2: "NEXT_PUBLIC_SUPABASE_URL not set"

**What it means:** Supabase URL is missing

**Fix:**
1. Open `.env.local`
2. Add:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   ```
3. Get it from: **Supabase Dashboard** → **Settings** → **API** → **Project URL**
4. **Restart dev server**

---

### Error 3: "column clerk_id does not exist"

**What it means:** Database migration wasn't run

**Fix:**
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste this:
   ```sql
   ALTER TABLE public.profiles 
   ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;
   
   CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON public.profiles(clerk_id);
   ```
3. Click **Run**
4. Try syncing again

**Or run the full migration:**
- Copy contents of `supabase/migrate-clerk-support.sql`
- Paste in SQL Editor
- Run it

---

### Error 4: "relation profiles does not exist"

**What it means:** The profiles table doesn't exist

**Fix:**
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy contents of `supabase/schema.sql`
3. Paste and run it
4. This creates all necessary tables

---

### Error 5: "permission denied" or RLS error

**What it means:** Row Level Security is blocking the insert

**Fix:**
- Make sure you're using **Service Role Key** (not anon key)
- Service Role Key bypasses RLS
- Check `.env.local` has `SUPABASE_SERVICE_ROLE_KEY` (not `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

---

### Error 6: "Unauthorized" (401)

**What it means:** User is not authenticated in Clerk

**Fix:**
- Make sure you're signed in
- Check Clerk dashboard to see if user exists
- Try signing out and signing in again

---

## 📋 Complete Checklist

Before reporting issues, verify:

- [ ] `.env.local` file exists in project root
- [ ] `.env.local` has `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `.env.local` has `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `.env.local` has `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `.env.local` has `CLERK_SECRET_KEY`
- [ ] Dev server was restarted after adding env vars
- [ ] `profiles` table exists in Supabase
- [ ] `clerk_id` column exists in `profiles` table
- [ ] User is signed in to Clerk
- [ ] Browser console shows no JavaScript errors

---

## 🧪 Manual Test

Test the sync API directly:

1. **Sign in** to your app
2. **Open browser console** (F12)
3. **Run this:**
   ```javascript
   fetch('/api/sync-user', { method: 'POST' })
     .then(r => r.json())
     .then(console.log)
     .catch(console.error)
   ```
4. **Check the response:**
   - ✅ `{ success: true, profile: {...} }` = Working!
   - ❌ `{ error: "..." }` = Check the error message

---

## 🔧 Still Not Working?

1. **Check diagnostic page:** `http://localhost:3000/debug-sync`
2. **Share the exact error message** from:
   - Browser console
   - Terminal/server logs
   - Diagnostic page results

3. **Verify environment variables:**
   ```bash
   # In terminal, check if env vars are loaded (server-side only)
   # You can't check them in browser console (they're server-only)
   ```

4. **Check Supabase logs:**
   - Go to **Supabase Dashboard** → **Logs** → **API Logs**
   - Look for errors when sync runs

---

## 📝 Example .env.local File

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (anon public key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (service_role secret key)

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional: Custom URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/student-dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/student-dashboard
```

---

## 🎯 Quick Fix Summary

**Most common issue:** Missing `SUPABASE_SERVICE_ROLE_KEY`

1. Add it to `.env.local`
2. Restart dev server
3. Try again

**Second most common:** Database migration not run

1. Run `supabase/migrate-clerk-support.sql` in Supabase SQL Editor
2. Try again

---

**Use the diagnostic page at `/debug-sync` to get detailed error information!**

