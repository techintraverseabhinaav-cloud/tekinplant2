# What Happens to Supabase When Users Interact with Your App

This document explains exactly what database operations happen when users interact with different parts of your application.

## 🔄 User Interaction Flow

### 1. **User Signs Up** 👤

**What user does:**
- Visits `/sign-up` page
- Fills form (email, password, name)
- Clicks "Sign Up"

**What happens in Supabase:**
```sql
-- 1. Clerk creates auth user (in auth.users table)
-- 2. Supabase trigger automatically fires:
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (user_id, 'user@example.com', 'John Doe', 'student');
-- ✅ Profile created automatically!
```

**Tables affected:**
- ✅ `profiles` - New row created
- ✅ `auth.users` - New user (managed by Clerk/Supabase Auth)

**You don't need to do anything** - This is automatic! 🎉

---

### 2. **User Browses Courses** 📚

**What user does:**
- Visits `/courses` page
- Searches/filters courses
- Views course details

**What happens in Supabase:**
```sql
-- App reads from courses table (READ ONLY)
SELECT * FROM public.courses 
WHERE is_active = true 
ORDER BY rating DESC;
-- ✅ No data is created or modified
```

**Tables affected:**
- ✅ `courses` - Only reads (no writes)

**No new data created** - Just reading existing courses

---

### 3. **User Enrolls in Course** 🎓

**What user does:**
- Clicks "Enroll" button on course page
- Confirms enrollment

**What happens in Supabase:**
```sql
-- 1. Create enrollment record
INSERT INTO public.enrollments (student_id, course_id, status)
VALUES (user_id, course_id, 'pending');
-- ✅ Enrollment created!

-- 2. Create notification for admin/trainer
INSERT INTO public.notifications (user_id, title, message, type)
VALUES (trainer_id, 'New Enrollment', 'Student enrolled in course', 'info');
-- ✅ Notification created!

-- 3. Trigger automatically updates course student_count
UPDATE public.courses 
SET student_count = (
  SELECT COUNT(*) FROM enrollments 
  WHERE course_id = course_id AND status = 'approved'
);
-- ✅ Student count updated automatically!
```

**Tables affected:**
- ✅ `enrollments` - New row created
- ✅ `notifications` - New notification created
- ✅ `courses` - `student_count` updated automatically

**This happens automatically** when user clicks "Enroll"!

---

### 4. **Trainer Creates Assignment** 📝

**What user does:**
- Trainer logs into dashboard
- Goes to "Create Assignment"
- Fills form (title, description, due date)
- Clicks "Submit"

**What happens in Supabase:**
```sql
-- 1. Create assignment
INSERT INTO public.assignments (
  course_id, title, description, due_date, created_by
)
VALUES (course_id, 'Assignment 1', 'Description...', '2024-01-15', trainer_id);
-- ✅ Assignment created!

-- 2. Create notifications for all enrolled students
INSERT INTO public.notifications (user_id, title, message, type, link)
SELECT 
  student_id,
  'New Assignment',
  'New assignment available in course',
  'info',
  '/assignment/' || assignment_id
FROM public.enrollments
WHERE course_id = course_id AND status = 'approved';
-- ✅ Notifications created for all students!
```

**Tables affected:**
- ✅ `assignments` - New assignment created
- ✅ `notifications` - Notifications for enrolled students

**This happens when trainer creates assignment** - automatic!

---

### 5. **Student Submits Assignment** 📤

**What user does:**
- Student views assignment
- Uploads file or writes answer
- Clicks "Submit Assignment"

**What happens in Supabase:**
```sql
-- 1. Upload file to Supabase Storage (if file)
-- 2. Create submission record
INSERT INTO public.submissions (
  assignment_id, student_id, content, file_url
)
VALUES (assignment_id, student_id, 'Answer text...', 'file_url');
-- ✅ Submission created!

-- 3. Create notification for trainer
INSERT INTO public.notifications (user_id, title, message, type)
VALUES (trainer_id, 'New Submission', 'Student submitted assignment', 'info');
-- ✅ Notification created!
```

**Tables affected:**
- ✅ `submissions` - New submission created
- ✅ `notifications` - Notification for trainer
- ✅ `supabase.storage` - File uploaded (if applicable)

**Automatic when student submits!**

---

### 6. **Trainer Grades Assignment** ✅

**What user does:**
- Trainer views submission
- Enters score and feedback
- Clicks "Grade Assignment"

**What happens in Supabase:**
```sql
-- 1. Update submission with grade
UPDATE public.submissions
SET score = 85, feedback = 'Great work!', graded_at = NOW()
WHERE id = submission_id;
-- ✅ Submission graded!

-- 2. Create notification for student
INSERT INTO public.notifications (user_id, title, message, type)
VALUES (student_id, 'Assignment Graded', 'Your assignment has been graded', 'success');
-- ✅ Notification created!
```

**Tables affected:**
- ✅ `submissions` - Updated with score/feedback
- ✅ `notifications` - Notification for student

**Automatic when trainer grades!**

---

### 7. **Student Takes Quiz** 🧪

**What user does:**
- Student clicks "Take Quiz"
- Answers questions
- Clicks "Submit Quiz"

**What happens in Supabase:**
```sql
-- 1. Read quiz questions
SELECT * FROM public.quiz_questions WHERE quiz_id = quiz_id;
-- ✅ Questions loaded

-- 2. Calculate score
-- (done in app code)

-- 3. Create quiz attempt
INSERT INTO public.quiz_attempts (
  quiz_id, student_id, answers, score
)
VALUES (quiz_id, student_id, '{"q1": "A", "q2": "B"}', 85);
-- ✅ Quiz attempt saved!

-- 4. Create notification
INSERT INTO public.notifications (user_id, title, message, type)
VALUES (student_id, 'Quiz Completed', 'You scored 85%', 'success');
-- ✅ Notification created!
```

**Tables affected:**
- ✅ `quiz_attempts` - New attempt created
- ✅ `notifications` - Notification created
- ✅ `quiz_questions` - Only reads (no writes)

**Automatic when student completes quiz!**

---

### 8. **Student Completes Course** 🎉

**What user does:**
- Student finishes all assignments
- Student passes all quizzes
- System detects completion

**What happens in Supabase:**
```sql
-- 1. Update enrollment status
UPDATE public.enrollments
SET status = 'completed', completed_at = NOW(), progress_percentage = 100
WHERE student_id = student_id AND course_id = course_id;
-- ✅ Enrollment marked as completed!

-- 2. Generate certificate (in app code)
-- Creates PDF with certificate number

-- 3. Create certificate record
INSERT INTO public.certificates (
  enrollment_id, certificate_url, certificate_number
)
VALUES (enrollment_id, 'https://...certificate.pdf', 'CERT-12345');
-- ✅ Certificate created!

-- 4. Create notification
INSERT INTO public.notifications (user_id, title, message, type)
VALUES (student_id, 'Course Completed!', 'Congratulations! Certificate available', 'success');
-- ✅ Notification created!
```

**Tables affected:**
- ✅ `enrollments` - Status updated to 'completed'
- ✅ `certificates` - New certificate created
- ✅ `notifications` - Notification created

**Automatic when course is completed!**

---

### 9. **User Views Notifications** 🔔

**What user does:**
- Clicks notification bell icon
- Views notification list

**What happens in Supabase:**
```sql
-- 1. Read notifications
SELECT * FROM public.notifications
WHERE user_id = user_id
ORDER BY created_at DESC;
-- ✅ Notifications loaded

-- 2. Mark as read (when user clicks notification)
UPDATE public.notifications
SET read = true
WHERE id = notification_id;
-- ✅ Notification marked as read
```

**Tables affected:**
- ✅ `notifications` - Only reads/updates (no new data)

**No new data created** - Just reading/updating

---

## 📊 Summary Table

| User Action | Tables Created/Updated | Automatic? |
|------------|----------------------|------------|
| Sign Up | `profiles` | ✅ Yes |
| Browse Courses | None (read only) | ✅ Yes |
| Enroll in Course | `enrollments`, `notifications`, `courses` (count) | ✅ Yes |
| Create Assignment | `assignments`, `notifications` | ✅ Yes |
| Submit Assignment | `submissions`, `notifications` | ✅ Yes |
| Grade Assignment | `submissions`, `notifications` | ✅ Yes |
| Take Quiz | `quiz_attempts`, `notifications` | ✅ Yes |
| Complete Course | `enrollments`, `certificates`, `notifications` | ✅ Yes |
| View Notifications | `notifications` (read/update) | ✅ Yes |

---

## 🎯 Key Takeaways

1. **Only 2 tables need manual data:**
   - `companies` - Fill with 25 companies
   - `courses` - Fill with 25 courses

2. **Everything else is automatic:**
   - When users sign up → Profile created
   - When users enroll → Enrollment created
   - When trainers create content → Assignments/quizzes created
   - When students submit → Submissions created
   - When courses complete → Certificates created

3. **You don't need to manually manage:**
   - User profiles
   - Enrollments
   - Assignments
   - Submissions
   - Quizzes
   - Certificates
   - Notifications

4. **The system handles everything:**
   - Triggers update counts automatically
   - Notifications are created automatically
   - Data relationships are maintained automatically

---

## 🚀 Bottom Line

**Fill these 2 tables:**
- ✅ Companies
- ✅ Courses

**Everything else happens automatically when users interact!** 🎉

You don't need to worry about filling other tables - they'll populate naturally as users use your app.

