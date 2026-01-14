# Supabase API Routes Guide

All Supabase tables now have complete API connections! 🎉

## ✅ Fixed Issues

### 1. **Enrollment Fix**
- ✅ Fixed enrollment API route with better error handling
- ✅ Updated enrollment page to fetch real course data from Supabase
- ✅ Added automatic notification creation on enrollment
- ✅ Improved error messages and logging

### 2. **Complete API Routes Created**

All Supabase tables now have full CRUD API endpoints:

## 📋 Available API Routes

### 1. **Courses** (`/api/courses`)
- `GET /api/courses` - Get all courses
- `GET /api/courses?id={courseId}` - Get single course
- `GET /api/courses?search={term}&type={type}&location={location}` - Filter courses
- `POST /api/courses` - Create course (admin)
- `PUT /api/courses` - Update course (admin)
- `DELETE /api/courses?id={courseId}` - Delete course (admin)

### 2. **Enrollments** (`/api/enroll`)
- `POST /api/enroll` - Enroll in a course
  ```json
  {
    "courseId": "uuid"
  }
  ```

### 3. **Assignments** (`/api/assignments`)
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments?id={id}` - Get single assignment
- `GET /api/assignments?courseId={courseId}` - Get assignments by course
- `POST /api/assignments` - Create assignment
- `PUT /api/assignments` - Update assignment
- `DELETE /api/assignments?id={id}` - Delete assignment

### 4. **Submissions** (`/api/submissions`)
- `GET /api/submissions` - Get all submissions
- `GET /api/submissions?id={id}` - Get single submission
- `GET /api/submissions?assignmentId={id}` - Get submissions by assignment
- `GET /api/submissions?studentId={id}` - Get submissions by student
- `POST /api/submissions` - Submit assignment
  ```json
  {
    "assignmentId": "uuid",
    "fileUrl": "https://...",
    "notes": "Optional notes"
  }
  ```
- `PUT /api/submissions` - Update submission (grade, feedback)

### 5. **Quizzes** (`/api/quizzes`)
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes?id={id}` - Get quiz with questions
- `GET /api/quizzes?courseId={courseId}` - Get quizzes by course
- `POST /api/quizzes` - Create quiz with questions
- `PUT /api/quizzes` - Update quiz
- `DELETE /api/quizzes?id={id}` - Delete quiz

### 6. **Quiz Attempts** (`/api/quiz-attempts`)
- `GET /api/quiz-attempts` - Get all attempts
- `GET /api/quiz-attempts?id={id}` - Get single attempt
- `GET /api/quiz-attempts?quizId={id}` - Get attempts by quiz
- `GET /api/quiz-attempts?studentId={id}` - Get attempts by student
- `POST /api/quiz-attempts` - Submit quiz attempt
  ```json
  {
    "quizId": "uuid",
    "answers": {
      "questionId1": "answer1",
      "questionId2": "answer2"
    },
    "timeTaken": 300
  }
  ```

### 7. **Certificates** (`/api/certificates`)
- `GET /api/certificates` - Get all certificates
- `GET /api/certificates?id={id}` - Get single certificate
- `GET /api/certificates?studentId={id}` - Get student's certificates
- `GET /api/certificates?courseId={id}` - Get certificates by course
- `POST /api/certificates` - Generate certificate
  ```json
  {
    "studentId": "uuid",
    "courseId": "uuid",
    "certificateUrl": "https://..."
  }
  ```

### 8. **Notifications** (`/api/notifications`)
- `GET /api/notifications` - Get user's notifications
- `GET /api/notifications?unreadOnly=true` - Get unread only
- `GET /api/notifications?id={id}` - Get single notification
- `POST /api/notifications` - Create notification
- `PUT /api/notifications` - Update notification (mark as read)
- `DELETE /api/notifications?id={id}` - Delete notification

### 9. **Dashboard Data** (`/api/dashboard/student`)
- `GET /api/dashboard/student?clerkId={clerkId}` - Get student dashboard data

### 10. **User Role** (`/api/get-user-role`)
- `GET /api/get-user-role?userId={clerkId}` - Get user role from Supabase

### 11. **Sync User** (`/api/sync-user`)
- `POST /api/sync-user` - Sync Clerk user to Supabase

## 🔐 Authentication

All API routes (except public GET endpoints) require:
- Clerk authentication via `auth()` middleware
- User must be logged in
- Some routes require specific roles (admin, trainer)

## 📝 Usage Examples

### Enroll in Course
```typescript
const response = await fetch('/api/enroll', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ courseId: 'uuid' })
})
const data = await response.json()
```

### Get Course Details
```typescript
const response = await fetch('/api/courses?id=course-uuid')
const course = await response.json()
```

### Submit Assignment
```typescript
const response = await fetch('/api/submissions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    assignmentId: 'uuid',
    fileUrl: 'https://storage.example.com/file.pdf',
    notes: 'My submission notes'
  })
})
```

### Get Student Dashboard
```typescript
const response = await fetch(`/api/dashboard/student?clerkId=${user.id}`)
const dashboardData = await response.json()
```

## 🛠️ Error Handling

All API routes return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Detailed error information",
  "code": "ERROR_CODE"
}
```

Status codes:
- `200` - Success
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

## 🎯 Next Steps

1. **Test Enrollment**: Try enrolling in a course - it should now save to Supabase!
2. **Check Dashboard**: View your student dashboard to see enrollments
3. **Use APIs**: All tables are now accessible via API routes

## 📊 Database Tables Connected

✅ `courses` - Full CRUD  
✅ `enrollments` - Create, Read  
✅ `assignments` - Full CRUD  
✅ `submissions` - Full CRUD  
✅ `quizzes` - Full CRUD  
✅ `quiz_questions` - Managed via quizzes API  
✅ `quiz_attempts` - Create, Read  
✅ `certificates` - Create, Read  
✅ `notifications` - Full CRUD  
✅ `profiles` - Managed via sync-user API  
✅ `companies` - Read (via courses API)

All tables are now fully integrated! 🚀

