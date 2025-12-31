# Debug Profile Update to Supabase

## 🔍 What I Added

1. **Comprehensive logging** in both the profile page and API route
2. **Better error messages** that show exactly what's failing
3. **Fallback lookup** by `clerk_id` if lookup by ID fails
4. **User feedback** - alerts will show if Supabase sync fails

## 🧪 How to Debug

### Step 1: Update Your Profile
1. Go to `/profile` page
2. Click "Edit Profile"
3. Change your first name or last name
4. Click "Save"

### Step 2: Check Browser Console
Open browser DevTools (F12) and look for:
- `🔄 Syncing profile to Supabase...` - API call started
- `📡 API Response status: 200` - API call succeeded
- `✅ Profile synced to Supabase:` - Success message
- `❌ Failed to sync to Supabase:` - Error message

### Step 3: Check Server Terminal
Look for logs like:
- `📥 Update profile API called`
- `🔑 Clerk ID: user_xxx`
- `🆔 Supabase User ID: xxx`
- `✅ Found existing profile:`
- `✅ Profile updated in Supabase:`

## 🔧 Common Issues

### Issue 1: Profile Not Found
**Error:** `User profile not found`

**Possible causes:**
- User profile doesn't exist in Supabase
- Profile ID doesn't match Clerk ID

**Fix:**
- Ensure user has signed in at least once (to create profile)
- Check Supabase `profiles` table for the user

### Issue 2: Missing Supabase Configuration
**Error:** `Server configuration error: Supabase not configured`

**Fix:**
- Check `.env.local` has:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Restart dev server after adding env vars

### Issue 3: Unauthorized
**Error:** `Unauthorized`

**Possible causes:**
- Middleware not processing auth correctly
- User not logged in

**Fix:**
- Check middleware logs
- Ensure user is logged in

### Issue 4: Network Error
**Error:** `Network error` or fetch fails

**Possible causes:**
- API route not accessible
- Server not running

**Fix:**
- Check server is running
- Verify API route exists at `/api/update-profile`

## 📊 What Gets Updated

- `full_name` - Constructed from `firstName` + `lastName`
- `updated_at` - Timestamp automatically updated

## 🔍 Verify Update Worked

1. **Check Supabase Dashboard:**
   - Go to Supabase Dashboard → Table Editor → `profiles`
   - Find your user by email or `clerk_id`
   - Check if `full_name` and `updated_at` changed

2. **Check Console Logs:**
   - Look for `✅ Profile updated in Supabase:` with the updated data

## 🚨 If Still Not Working

1. **Share the console logs** from both browser and server
2. **Check Supabase logs** in Dashboard → Logs
3. **Verify profile exists** in Supabase `profiles` table
4. **Check environment variables** are set correctly

The detailed logs will show exactly where the process is failing! 🎯

