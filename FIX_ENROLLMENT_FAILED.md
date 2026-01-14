# Fix: Enrollment Failed

## 🔍 How to Diagnose

When enrollment fails, check these logs:

### 1. Browser Console (F12)
Look for:
- `📝 Submitting enrollment for course: ...`
- `📡 Enrollment API response status: ...`
- `❌ Enrollment failed: ...`

### 2. Server Terminal
Look for:
- `📥 Enrollment API called`
- `🔑 Clerk ID: user_xxx`
- `✅ Found profile by ID/clerk_id`
- `✅ Course found: Course Name`
- `❌ Enrollment error: ...`

## 🚨 Common Issues & Fixes

### Issue 1: "Unauthorized" or "No Clerk ID found"
**Cause:** Middleware not detecting auth

**Fix:**
1. Stop server (Ctrl+C)
2. Delete `.next` folder: `Remove-Item -Recurse -Force .next`
3. Restart: `npm run dev`
4. Clear browser cache (Ctrl+Shift+R)

### Issue 2: "User profile not found"
**Cause:** Profile doesn't exist in Supabase

**Fix:**
1. Sign in at least once (creates profile automatically)
2. Or manually sync: Visit `/debug-sync` page
3. Check Supabase `profiles` table for your user

### Issue 3: "Course not found"
**Cause:** Course ID doesn't exist in Supabase

**Fix:**
1. Check if course exists in Supabase `courses` table
2. Verify course ID matches the one in the URL
3. Make sure courses are populated (run migration SQL)

### Issue 4: "Foreign key constraint violation"
**Cause:** `student_id` or `course_id` doesn't match existing records

**Fix:**
1. Verify profile exists: Check `profiles` table
2. Verify course exists: Check `courses` table
3. Check IDs are valid UUIDs

### Issue 5: "Already enrolled"
**Cause:** Enrollment already exists (this is OK!)

**Fix:**
- This means enrollment worked before
- Check `enrollments` table in Supabase
- You can update status if needed

## 🧪 Test Steps

1. **Check you're logged in:**
   - Visit `/profile` - should show your info
   - If not, sign in first

2. **Check course exists:**
   - Visit `/courses` - should list courses
   - Click on a course - should show details
   - Note the course ID from URL

3. **Try enrollment:**
   - Click "Enroll" button
   - Fill form and submit
   - Watch browser console and server terminal

4. **Check Supabase:**
   - Go to Supabase Dashboard → Table Editor → `enrollments`
   - Look for new row with your user ID and course ID

## 📋 Quick Checklist

- [ ] User is logged in (check `/profile`)
- [ ] Profile exists in Supabase `profiles` table
- [ ] Course exists in Supabase `courses` table
- [ ] Server is running (`npm run dev`)
- [ ] Browser console shows no errors
- [ ] Server terminal shows enrollment logs
- [ ] `.env.local` has Supabase keys

## 🔍 What the Logs Tell You

### If you see "📥 Enrollment API called":
✅ API route is being reached

### If you see "✅ Found profile by ID/clerk_id":
✅ User profile exists

### If you see "✅ Course found":
✅ Course exists

### If you see "✅ Enrollment created successfully":
✅ Enrollment worked! Check Supabase table

### If you see "❌ Enrollment error":
❌ Check the error message, code, and hint for details

## 🆘 Still Not Working?

Share these details:
1. **Browser console error** (copy full error)
2. **Server terminal logs** (copy enrollment-related logs)
3. **Supabase error** (if any, from Supabase Dashboard → Logs)

The detailed logs will show exactly where enrollment is failing! 🎯

