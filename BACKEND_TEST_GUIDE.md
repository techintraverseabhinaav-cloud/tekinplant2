# How to Test if Your Supabase Backend is Working

## 🧪 Quick Test Method

### Option 1: Use the Test Page (Easiest)

1. **Start your dev server** (if not running):
   ```bash
   npm run dev
   ```

2. **Open the test page**:
   - Go to: http://localhost:3000/test-supabase
   - This page automatically tests:
     - ✅ Connection to Supabase
     - ✅ Authentication system
     - ✅ Database access
     - ✅ Tables existence

3. **Check the results**:
   - ✅ Green checkmarks = Working!
   - ❌ Red X marks = Something needs fixing

### Option 2: Manual Tests

#### Test 1: Check Environment Variables

1. **Verify `.env.local` exists** in your project root
2. **Check it contains**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

#### Test 2: Test Connection in Browser Console

1. **Open browser console** (F12)
2. **Run this code**:
   ```javascript
   // Check if Supabase client can be created
   fetch('/api/test-supabase').then(r => r.json()).then(console.log)
   ```

#### Test 3: Check Supabase Dashboard

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your project**
3. **Check Table Editor**:
   - Should see 11 tables (profiles, companies, courses, etc.)
4. **Check Authentication**:
   - Go to Authentication → Users
   - Should be able to see users (even if empty)

#### Test 4: Test Database Query

1. **In Supabase Dashboard** → **SQL Editor**
2. **Run this query**:
   ```sql
   SELECT COUNT(*) FROM courses;
   ```
3. **Should return**: A number (even if 0)

## ✅ Success Indicators

Your backend is working if:

- ✅ Test page shows all green checkmarks
- ✅ Can see tables in Supabase Table Editor
- ✅ No errors in browser console
- ✅ Environment variables are set
- ✅ Can query database in SQL Editor

## ❌ Common Issues & Fixes

### Issue: "Connection failed"
**Fix**:
- Check `.env.local` file exists
- Verify keys are correct (no extra spaces)
- Restart dev server: `npm run dev`

### Issue: "No tables found"
**Fix**:
- Run `supabase/schema.sql` in Supabase SQL Editor
- Verify tables appear in Table Editor

### Issue: "Database error"
**Fix**:
- Check RLS policies are enabled
- Verify you're using the correct project
- Check Supabase project is active (not paused)

### Issue: "Auth error"
**Fix**:
- This is normal if you're not logged in
- Try signing up a test user
- Check Authentication settings in Supabase

## 🎯 Quick Checklist

- [ ] `.env.local` file exists with correct keys
- [ ] Dev server running (`npm run dev`)
- [ ] Test page accessible at `/test-supabase`
- [ ] All tests show green checkmarks
- [ ] Tables visible in Supabase Table Editor
- [ ] No errors in browser console

## 📊 What Each Test Checks

1. **Connection Test**: Can your app reach Supabase?
2. **Auth Test**: Is authentication system working?
3. **Database Test**: Can you read/write to database?
4. **Tables Test**: Are your tables created?

---

**Quick Test**: Visit http://localhost:3000/test-supabase to see everything at once! 🚀

