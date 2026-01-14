# Supabase Tables Guide: What to Fill & What Happens Automatically

This guide explains which Supabase tables you need to fill manually vs. which ones get populated automatically when users interact with your app.

## 📊 Table Overview

Your Supabase database has **11 tables**. Here's what each one does:

### Tables You MUST Fill Manually (Pre-populate) ✅

These tables need data **before** users can use your app:

#### 1. **`companies`** - Company/Partner Information
- **What it stores**: Company details (Siemens, ABB, etc.)
- **Why fill it**: Courses reference companies
- **How to fill**: Run `complete-migration.sql` (25 companies)
- **Status**: ⚠️ **REQUIRED** - Fill this first!

#### 2. **`courses`** - Training Courses
- **What it stores**: All course information (title, description, price, etc.)
- **Why fill it**: Users browse and enroll in courses
- **How to fill**: Run `migrate-all-courses-complete.sql` (25 courses)
- **Status**: ⚠️ **REQUIRED** - Fill this second!

---

### Tables That Fill Automatically (User Interactions) 🤖

These tables get populated **automatically** when users interact with your app:

#### 3. **`profiles`** - User Profiles
- **What it stores**: User information (name, email, role, avatar)
- **When it fills**: **Automatically** when user signs up
- **How it works**: 
  - User signs up via Clerk → Supabase trigger creates profile
  - Or manually created when user first logs in
- **You don't need to**: Fill this manually ❌

#### 4. **`enrollments`** - Course Enrollments
- **What it stores**: Which students enrolled in which courses
- **When it fills**: When a student clicks "Enroll" button
- **How it works**: 
  ```typescript
  // When user clicks "Enroll" button:
  await enrollInCourse(userId, courseId)
  // → Creates row in enrollments table
  ```
- **You don't need to**: Fill this manually ❌

#### 5. **`assignments`** - Course Assignments
- **What it stores**: Assignments for each course
- **When it fills**: When trainer/admin creates an assignment
- **How it works**: Trainer dashboard → "Create Assignment" → Inserts into table
- **You don't need to**: Fill this manually ❌

#### 6. **`submissions`** - Assignment Submissions
- **What it stores**: Student submissions for assignments
- **When it fills**: When student submits an assignment
- **How it works**: Student uploads file/answers → Creates submission record
- **You don't need to**: Fill this manually ❌

#### 7. **`quizzes`** - Course Quizzes
- **What it stores**: Quiz information for courses
- **When it fills**: When trainer/admin creates a quiz
- **How it works**: Trainer dashboard → "Create Quiz" → Inserts into table
- **You don't need to**: Fill this manually ❌

#### 8. **`quiz_questions`** - Quiz Questions
- **What it stores**: Questions for each quiz
- **When it fills**: When creating a quiz (part of quiz creation)
- **How it works**: Trainer adds questions → Inserts into table
- **You don't need to**: Fill this manually ❌

#### 9. **`quiz_attempts`** - Quiz Attempts
- **What it stores**: Student quiz attempts and scores
- **When it fills**: When student takes a quiz
- **How it works**: Student answers quiz → Creates attempt record
- **You don't need to**: Fill this manually ❌

#### 10. **`certificates`** - Course Certificates
- **What it stores**: Generated certificates for completed courses
- **When it fills**: When student completes a course
- **How it works**: 
  - Student completes course → System generates certificate
  - Creates certificate record with PDF URL
- **You don't need to**: Fill this manually ❌

#### 11. **`notifications`** - User Notifications
- **What it stores**: Notifications for users
- **When it fills**: When system needs to notify a user
- **How it works**: 
  - Enrollment approved → Creates notification
  - Assignment graded → Creates notification
  - Course completed → Creates notification
- **You don't need to**: Fill this manually ❌

---

## 🎯 What You Need to Do

### Step 1: Fill Required Tables (Do This First!)

**Only 2 tables need manual data:**

1. ✅ **Fill `companies` table**
   - Run: `supabase/complete-migration.sql` (companies section)
   - Or: Insert companies manually in Supabase Table Editor
   - **Result**: 25 companies in database

2. ✅ **Fill `courses` table**
   - Run: `supabase/migrate-all-courses-complete.sql`
   - Or: Use Node.js script: `node scripts/migrate-courses-to-supabase.js`
   - **Result**: 25 courses in database

### Step 2: Everything Else Happens Automatically! 🎉

Once you've filled companies and courses, **everything else populates automatically** when users interact with your app.

---

## 🔄 What Happens When Users Interact

### Scenario 1: User Signs Up
```
User clicks "Sign Up" 
  → Clerk creates auth user
  → Supabase trigger creates profile in `profiles` table
  → User can now log in
```

### Scenario 2: User Browses Courses
```
User visits /courses page
  → App reads from `courses` table (already filled)
  → Shows all courses
  → No database writes
```

### Scenario 3: User Enrolls in Course
```
User clicks "Enroll" button
  → App calls: enrollInCourse(userId, courseId)
  → Creates row in `enrollments` table
  → Status: 'pending' (waiting for approval)
  → Creates notification in `notifications` table
```

### Scenario 4: Trainer Creates Assignment
```
Trainer goes to dashboard
  → Clicks "Create Assignment"
  → Fills form and submits
  → Creates row in `assignments` table
  → Creates notifications for enrolled students
```

### Scenario 5: Student Submits Assignment
```
Student uploads assignment file
  → App calls: submitAssignment(assignmentId, fileUrl)
  → Creates row in `submissions` table
  → Status: 'submitted' (waiting for grading)
```

### Scenario 6: Student Takes Quiz
```
Student clicks "Take Quiz"
  → App reads questions from `quiz_questions` table
  → Student answers questions
  → App calls: submitQuizAttempt(quizId, answers)
  → Creates row in `quiz_attempts` table
  → Calculates and stores score
```

### Scenario 7: Student Completes Course
```
Student finishes all assignments and quizzes
  → App checks completion criteria
  → Updates `enrollments.status` to 'completed'
  → Generates certificate PDF
  → Creates row in `certificates` table
  → Creates notification: "Course completed!"
```

---

## 📋 Quick Checklist

### ✅ Before Launch (Fill These):
- [ ] **Companies table** - Insert 25 companies
- [ ] **Courses table** - Insert 25 courses

### ✅ After Launch (Automatic):
- [ ] **Profiles** - Auto-created on signup
- [ ] **Enrollments** - Created when users enroll
- [ ] **Assignments** - Created by trainers
- [ ] **Submissions** - Created by students
- [ ] **Quizzes** - Created by trainers
- [ ] **Quiz Questions** - Created with quizzes
- [ ] **Quiz Attempts** - Created when students take quizzes
- [ ] **Certificates** - Auto-generated on completion
- [ ] **Notifications** - Auto-created for events

---

## 🚨 Important Notes

### 1. **Don't Fill Everything!**
You only need to fill **2 tables** (companies + courses). Everything else happens automatically.

### 2. **Empty Tables Are Normal**
When you first set up, these tables will be empty:
- `enrollments` - Empty until users enroll
- `assignments` - Empty until trainers create them
- `submissions` - Empty until students submit
- `quizzes` - Empty until trainers create them
- `certificates` - Empty until courses are completed

**This is expected!** They'll fill up as users interact with your app.

### 3. **Test Data (Optional)**
If you want to test features before launch, you can manually add:
- A few test enrollments
- Sample assignments
- Test quizzes

But this is **optional** - not required for the app to work.

---

## 🎯 Summary

**What to fill manually:**
- ✅ Companies (25 records)
- ✅ Courses (25 records)

**What fills automatically:**
- ✅ Everything else (9 tables)

**When users interact:**
- ✅ Data gets created/updated automatically
- ✅ No manual intervention needed
- ✅ System handles everything

---

## 🔍 Verification

After filling companies and courses, verify:

```sql
-- Check companies
SELECT COUNT(*) FROM public.companies;
-- Expected: 25

-- Check courses
SELECT COUNT(*) FROM public.courses;
-- Expected: 25

-- Check other tables (should be empty initially)
SELECT COUNT(*) FROM public.enrollments;
-- Expected: 0 (until users enroll)

SELECT COUNT(*) FROM public.profiles;
-- Expected: 0 (until users sign up)
```

**Empty tables are fine!** They'll populate as users use your app. 🚀

