# How to Sync Clerk Users to Supabase

## 🔍 Problem

When users sign up/login with **Clerk**, they are **not automatically** added to Supabase. Clerk and Supabase are separate systems, so you need to sync them manually.

## ✅ Solution

I've created an automatic sync system that:
1. **Automatically syncs** Clerk users to Supabase when they sign in
2. **Creates profiles** in Supabase if they don't exist
3. **Updates profiles** if they already exist

## 🚀 Setup Steps

### Step 1: Update Supabase Schema

Run this SQL in **Supabase SQL Editor**:

```sql
-- File: supabase/migrate-clerk-support.sql
-- Copy and run the entire file
```

This will:
- Add `clerk_id` column to track Clerk users
- Update the schema to work with Clerk
- Create necessary indexes

### Step 2: Get Supabase Service Role Key

1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Copy the **Service Role Key** (⚠️ Keep this secret!)
3. Add to `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important**: The service role key bypasses RLS, so keep it secret!

### Step 3: Restart Dev Server

```bash
npm run dev
```

## 🎯 How It Works

### Automatic Sync

When a user signs in with Clerk:

1. **User logs in** via Clerk
2. **`useUserWithRole()` hook** detects the user
3. **Automatically calls** `/api/sync-user` endpoint
4. **Creates/updates** profile in Supabase
5. **User data** is now in Supabase! ✅

### Manual Sync (Optional)

You can also manually sync a user:

```typescript
import { syncCurrentClerkUser } from '@/lib/supabase/sync-clerk-user'
import { useUser } from '@clerk/nextjs'

const { user } = useUser()
await syncCurrentClerkUser(user)
```

## 📊 What Gets Synced

- ✅ **Email** - From Clerk
- ✅ **Full Name** - From Clerk
- ✅ **Role** - From Clerk `publicMetadata.role`
- ✅ **Avatar URL** - From Clerk
- ✅ **Clerk ID** - Stored for reference

## 🔍 Verify It's Working

### Check Supabase Table Editor

1. Go to **Supabase Dashboard** → **Table Editor** → **profiles**
2. After a user signs in, you should see:
   - New row with user's email
   - `clerk_id` column populated
   - `role` set correctly

### Check Browser Console

When a user signs in, you should see:
- ✅ No errors
- ✅ Profile created/updated message (if logging enabled)

## 🐛 Troubleshooting

### Issue: "Error creating Supabase profile"

**Fix**: 
1. Make sure you ran `migrate-clerk-support.sql`
2. Check `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
3. Restart dev server

### Issue: "Permission denied"

**Fix**: 
1. Verify service role key is correct
2. Check RLS policies allow inserts
3. Make sure `clerk_id` column exists

### Issue: Users not appearing in Supabase

**Fix**:
1. Check browser console for errors
2. Verify API route is being called
3. Check Supabase logs for errors

## 📝 Files Created

1. **`lib/supabase/sync-clerk-user.ts`** - Sync functions
2. **`app/api/sync-user/route.ts`** - API endpoint
3. **`supabase/migrate-clerk-support.sql`** - Schema migration
4. **`lib/clerk-helpers.ts`** - Updated to auto-sync

## 🎯 Next Steps

1. ✅ Run the SQL migration
2. ✅ Add service role key to `.env.local`
3. ✅ Restart dev server
4. ✅ Test by signing in with Clerk
5. ✅ Check Supabase Table Editor for new profile

---

**After setup, every Clerk login will automatically sync to Supabase!** 🎉

