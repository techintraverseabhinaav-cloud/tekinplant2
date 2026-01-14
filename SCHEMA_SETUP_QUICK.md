# Quick Guide: Running Database Schema (Step 4)

## 🎯 What You're Doing

Running SQL code that creates all your database tables, like building the foundation of a house.

## 📝 Step-by-Step (5 minutes)

### 1️⃣ Open SQL Editor in Supabase
```
Supabase Dashboard → Left Sidebar → Click "SQL Editor"
```

### 2️⃣ Open Your Schema File
```
In your project: Open `supabase/schema.sql`
Select ALL (Ctrl+A) → Copy (Ctrl+C)
```

### 3️⃣ Paste into Supabase
```
Click in SQL Editor → Paste (Ctrl+V)
```

### 4️⃣ Run It
```
Click "Run" button (green, bottom right)
OR press Ctrl+Enter
```

### 5️⃣ Check Success
```
Look for: "Success. No rows returned" ✅
Then check: Table Editor → Should see 11 tables
```

## ✅ What Gets Created?

The schema creates **11 tables**:

1. **profiles** - User information
2. **companies** - Corporate partners  
3. **courses** - Training programs
4. **enrollments** - Student enrollments
5. **assignments** - Course assignments
6. **submissions** - Assignment submissions
7. **quizzes** - Course quizzes
8. **quiz_questions** - Quiz questions
9. **quiz_attempts** - Student quiz attempts
10. **certificates** - Generated certificates
11. **notifications** - User notifications

Plus:
- ✅ Security rules (who can access what)
- ✅ Automatic triggers (auto-create profiles, update counts)
- ✅ Relationships between tables

## 🎬 Visual Example

**Before:**
```
Table Editor: "No tables found" ❌
```

**After:**
```
Table Editor:
  ✅ profiles
  ✅ companies  
  ✅ courses
  ✅ enrollments
  ... (11 tables total)
```

## ⚠️ If You See Errors

**"Relation already exists"**
- You ran it twice - that's okay, just continue

**"Permission denied"**
- Make sure you're in the correct Supabase project

**"Syntax error"**
- Make sure you copied the ENTIRE file
- Try copying again from `supabase/schema.sql`

## 💡 Pro Tip

After running, test it:
1. Go to **Table Editor**
2. Click on **`courses`** table
3. Click **"Insert row"**
4. Add a test course to verify it works!

---

**That's it!** Your database structure is now ready. 🎉

