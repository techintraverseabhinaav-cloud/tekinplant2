# Fix: Failed to Load Dashboard / Failed to Fetch Course

## Problem
- Dashboard fails to load
- Course fetching fails
- General "failed to fetch" errors

## ✅ What I Fixed

### 1. **Improved Error Handling**
- Added detailed logging to all API routes
- Better error messages with stack traces (in development)
- Graceful fallbacks when data is missing

### 2. **Enhanced API Routes**
- `/api/dashboard/student` - Now handles auth errors gracefully
- `/api/courses` - Better error messages and logging
- All routes now log detailed information

### 3. **Client-Side Error Handling**
- Dashboard page shows detailed errors in console
- Enrollment page handles fetch failures gracefully
- Better user feedback

## 🔍 Debugging Steps

### Step 1: Check Test Endpoint
Visit: `http://localhost:3000/api/test`

This will show:
- ✅ If API routes are accessible
- ✅ Environment variables status
- ✅ Basic connectivity

### Step 2: Check Browser Console
Open browser DevTools (F12) → Console tab

Look for:
- `📊 Dashboard API called`
- `✅ Dashboard data fetched successfully`
- `❌ Error fetching dashboard data`

### Step 3: Check Server Logs
Look at your terminal where `npm run dev` is running

You should see:
- `📊 Dashboard API called`
- `✅ Fetching dashboard data for: [userId]`
- `❌ Error fetching dashboard data` (if there's an error)

### Step 4: Check Environment Variables
Verify these are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Step 5: Verify User Profile Exists
The dashboard needs a user profile in Supabase. Check:

1. Go to Supabase Dashboard → Table Editor → `profiles`
2. Look for a row with `clerk_id` matching your Clerk user ID
3. If missing, the sync might have failed

## 🛠️ Common Issues & Fixes

### Issue 1: "Missing Supabase configuration"
**Fix**: Check `.env.local` has all required variables

### Issue 2: "No Supabase user ID found"
**Fix**: User profile doesn't exist in Supabase
- Check if user synced properly
- Visit `/debug-sync` page to test sync
- Manually sync via `/api/sync-user`

### Issue 3: "Course not found"
**Fix**: 
- Verify course ID is correct
- Check if course exists in Supabase `courses` table
- Ensure course `is_active = true`

### Issue 4: "Unauthorized"
**Fix**:
- Check if user is logged in
- Verify Clerk authentication is working
- Check middleware is processing routes

### Issue 5: Network Errors
**Fix**:
- Check internet connection
- Verify Supabase URL is correct
- Check if Supabase project is active

## 📊 New Logging Features

All API routes now log:
- ✅ Success messages with data counts
- ❌ Error messages with details
- 📊 Function entry points
- 🔍 Query details

## 🧪 Testing

1. **Test API Routes**:
   ```
   http://localhost:3000/api/test
   ```

2. **Test Dashboard**:
   - Log in
   - Go to `/student-dashboard`
   - Check browser console for logs

3. **Test Course Fetch**:
   - Go to `/enroll/[courseId]`
   - Check browser console for logs

## 📝 Next Steps

1. **Check the logs** - Both browser console and server terminal
2. **Verify environment variables** - Use `/api/test` endpoint
3. **Check Supabase** - Verify data exists in tables
4. **Test sync** - Use `/debug-sync` page if user profile is missing

The improved logging will help identify the exact issue! 🎯

