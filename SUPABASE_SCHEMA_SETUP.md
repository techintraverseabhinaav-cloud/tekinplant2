# Step 4: Running Database Schema - Detailed Guide

## 🎯 What is a Database Schema?

A **schema** is the structure of your database - it defines:
- **Tables** (like spreadsheets) - courses, users, enrollments, etc.
- **Columns** (fields) - title, email, status, etc.
- **Relationships** - how tables connect (e.g., enrollments link to courses and users)
- **Security Rules** - who can access what data
- **Functions** - automated actions (like updating counts)

## 📋 Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. **Log into Supabase**: https://app.supabase.com
2. **Select your project** (the one you created)
3. **In the left sidebar**, click **"SQL Editor"** (icon looks like `</>` or a database)
4. You'll see a blank SQL editor window

### Step 2: Open the Schema File

1. **In your project folder**, open the file: `supabase/schema.sql`
2. **Select ALL the content** (Ctrl+A or Cmd+A)
3. **Copy it** (Ctrl+C or Cmd+C)

The file contains SQL commands that will:
- Create 11 tables (profiles, courses, enrollments, etc.)
- Set up relationships between tables
- Add security policies (Row Level Security)
- Create triggers and functions

### Step 3: Paste into Supabase SQL Editor

1. **Click in the SQL Editor** in Supabase dashboard
2. **Paste the SQL** (Ctrl+V or Cmd+V)
3. You should see a long SQL script with:
   - `CREATE TABLE` statements
   - `CREATE POLICY` statements
   - `CREATE FUNCTION` statements
   - `CREATE TRIGGER` statements

### Step 4: Run the Schema

**Option A: Using the Button**
1. Click the **"Run"** button (usually green, bottom right)
2. Or press **Ctrl+Enter** (Windows) or **Cmd+Enter** (Mac)

**Option B: Using Keyboard**
- Press **Ctrl+Enter** (Windows/Linux)
- Press **Cmd+Enter** (Mac)

### Step 5: Verify Success

You should see:
- ✅ **"Success. No rows returned"** message (green)
- Or **"Success"** with a checkmark

**If you see errors:**
- Read the error message carefully
- Common issues:
  - Missing extensions (should auto-install)
  - Syntax errors (check for typos)
  - Already exists (if you ran it twice)

### Step 6: Verify Tables Were Created

1. **In Supabase dashboard**, click **"Table Editor"** (left sidebar)
2. You should see these tables:
   - ✅ `profiles`
   - ✅ `companies`
   - ✅ `courses`
   - ✅ `enrollments`
   - ✅ `assignments`
   - ✅ `submissions`
   - ✅ `quizzes`
   - ✅ `quiz_questions`
   - ✅ `quiz_attempts`
   - ✅ `certificates`
   - ✅ `notifications`

## 🎬 Visual Guide

```
Supabase Dashboard
├── Left Sidebar
│   ├── Table Editor ← Check tables here after running
│   ├── SQL Editor ← Click here to run schema
│   └── Authentication
│
└── SQL Editor Window
    ├── [Paste your schema.sql content here]
    └── [Click "Run" button or press Ctrl+Enter]
```

## 📊 What Gets Created?

### Tables Created:

1. **profiles** - User profiles (extends Supabase auth)
2. **companies** - Corporate partners
3. **courses** - Training programs
4. **enrollments** - Student course enrollments
5. **assignments** - Course assignments
6. **submissions** - Assignment submissions
7. **quizzes** - Course quizzes
8. **quiz_questions** - Quiz questions
9. **quiz_attempts** - Student quiz attempts
10. **certificates** - Generated certificates
11. **notifications** - User notifications

### Security Features:

- **Row Level Security (RLS)** - Enabled on all tables
- **Policies** - Users can only access their own data
- **Triggers** - Auto-create profiles on signup
- **Functions** - Auto-update student counts

## ⚠️ Common Issues & Solutions

### Issue 1: "Extension already exists"
**Solution**: This is fine! Just continue.

### Issue 2: "Relation already exists"
**Solution**: You ran the schema twice. Either:
- Drop existing tables (if empty)
- Or ignore and continue (if you want to keep existing data)

### Issue 3: "Permission denied"
**Solution**: Make sure you're logged into the correct Supabase project.

### Issue 4: Syntax Error
**Solution**: 
- Check you copied the entire file
- Make sure there are no extra characters
- Try copying again from `supabase/schema.sql`

## ✅ Verification Checklist

After running the schema, verify:

- [ ] No error messages in SQL Editor
- [ ] All 11 tables visible in Table Editor
- [ ] Can see table columns when clicking on a table
- [ ] RLS policies are enabled (shown in table settings)

## 🎯 Next Steps

After successfully running the schema:

1. ✅ Database structure is ready
2. ⬜ Add your course data (manually or via migration)
3. ⬜ Test authentication
4. ⬜ Start using Supabase in your app

## 💡 Pro Tips

1. **Save the query**: Click "Save" in SQL Editor to save the schema for future reference
2. **Test queries**: Try `SELECT * FROM courses LIMIT 5;` to test
3. **Check RLS**: Go to Table Editor → Select table → Settings → See RLS policies
4. **Backup**: Export your schema after setup (SQL Editor → Save)

## 📝 Example: What You'll See

**Before running:**
- Table Editor shows: "No tables found"

**After running:**
- Table Editor shows: 11 tables listed
- Clicking on `courses` shows columns: id, title, company_name, etc.
- Each table has RLS enabled (lock icon)

---

**Need help?** Check the error message in Supabase SQL Editor - it usually tells you exactly what went wrong!

