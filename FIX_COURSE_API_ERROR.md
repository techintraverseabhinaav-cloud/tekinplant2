# Fix: Course API Error

## 🔍 Debugging Steps

### Step 1: Check Server Logs
Look at your terminal where `npm run dev` is running. You should see:
- `📚 Courses API called` - API route was hit
- `🔍 Fetching course: [courseId]` - Single course fetch
- `✅ Course fetched successfully` - Success
- `❌ Error fetching course:` - Error with details

### Step 2: Check Browser Console
Open browser DevTools (F12) → Console tab. Look for:
- `📚 Fetching course: [courseId]`
- `✅ Course data received:`
- `❌ Course API error:` with status code and error details

### Step 3: Common Issues

#### Issue 1: "Course not found" (404)
**Possible causes:**
- Course ID doesn't exist in Supabase
- Course ID format is wrong (should be UUID)
- Course is inactive (`is_active = false`)

**Fix:**
1. Check Supabase → Table Editor → `courses` table
2. Verify the course ID matches
3. Ensure `is_active = true`

#### Issue 2: "Missing Supabase configuration" (500)
**Possible causes:**
- Environment variables not set
- `.env.local` file missing or incorrect

**Fix:**
1. Check `.env.local` has:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
2. Restart dev server after adding env vars

#### Issue 3: "Failed to fetch courses" (500)
**Possible causes:**
- Supabase connection issue
- Database query error
- RLS (Row Level Security) blocking access

**Fix:**
1. Check Supabase project is active
2. Verify service role key is correct
3. Check RLS policies allow service role access

#### Issue 4: Network Error
**Possible causes:**
- No internet connection
- Supabase URL is incorrect
- CORS issue

**Fix:**
1. Check internet connection
2. Verify Supabase URL in `.env.local`
3. Check browser Network tab for CORS errors

## 🧪 Test the API

### Test 1: Check API is accessible
Visit: `http://localhost:3000/api/test`

Should show environment variables status.

### Test 2: Test courses endpoint
Visit: `http://localhost:3000/api/courses`

Should return array of courses (or empty array if no courses).

### Test 3: Test single course
Visit: `http://localhost:3000/api/courses?id=[actual-course-id]`

Replace `[actual-course-id]` with a real UUID from your Supabase `courses` table.

## 📋 Check Course Data in Supabase

1. Go to Supabase Dashboard
2. Navigate to Table Editor → `courses`
3. Check:
   - ✅ Course exists
   - ✅ `is_active = true`
   - ✅ `id` is a valid UUID
   - ✅ Course has required fields (title, type, etc.)

## 🔧 Quick Fixes

### Fix 1: Verify Course ID Format
Course IDs should be UUIDs like: `550e8400-e29b-41d4-a716-446655440000`

If you're using numeric IDs (1, 2, 3), convert them to UUIDs or update the query.

### Fix 2: Check Enrollment Page
The enrollment page calls: `/api/courses?id=${courseId}`

Make sure `courseId` from URL params is a valid UUID.

### Fix 3: Restart Dev Server
Sometimes environment variables need a restart:
```bash
# Stop server (Ctrl+C)
npm run dev
```

## 📊 Error Response Format

The API returns errors in this format:
```json
{
  "error": "Error message",
  "details": "Detailed error information",
  "code": "ERROR_CODE"
}
```

## 🎯 Next Steps

1. **Check the logs** - Both browser console and server terminal
2. **Verify course exists** - Check Supabase `courses` table
3. **Test API directly** - Use browser to visit API endpoints
4. **Check environment** - Verify `.env.local` is correct

The detailed logging will show exactly what's failing! 🎯

