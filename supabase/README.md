# Supabase Integration Guide

## Quick Start

1. **Copy `.env.local.example` to `.env.local`**
2. **Add your Supabase credentials** from your project dashboard
3. **Run the schema SQL** in Supabase SQL Editor (see `schema.sql`)
4. **Start using the Supabase client** in your components

## Usage Examples

### Authentication

```typescript
import { signIn, signUp, signOut, getCurrentUser } from '@/lib/supabase/auth'

// Sign up
await signUp('user@example.com', 'password123', 'John Doe', 'student')

// Sign in
await signIn('user@example.com', 'password123')

// Sign out
await signOut()

// Get current user
const user = await getCurrentUser()
```

### Courses

```typescript
import { getCourses, getCourseById, createCourse } from '@/lib/supabase/courses'

// Get all courses
const courses = await getCourses()

// Search courses
const results = await getCourses({ 
  search: 'PLC', 
  type: 'Industrial Training',
  location: 'Mumbai'
})

// Get single course
const course = await getCourseById('course-id')

// Create course (admin/trainer only)
await createCourse({
  title: 'New Course',
  company_name: 'Siemens',
  // ... other fields
})
```

### Enrollments

```typescript
import { enrollInCourse, getStudentEnrollments } from '@/lib/supabase/enrollments'

// Enroll in course
await enrollInCourse(userId, courseId)

// Get student enrollments
const enrollments = await getStudentEnrollments(userId)
```

### Notifications

```typescript
import { getNotifications, markNotificationAsRead } from '@/lib/supabase/notifications'

// Get unread notifications
const notifications = await getNotifications(userId, true)

// Mark as read
await markNotificationAsRead(notificationId)
```

## Real-time Subscriptions

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Subscribe to course updates
const channel = supabase
  .channel('courses')
  .on('postgres_changes', 
    { event: 'UPDATE', schema: 'public', table: 'courses' },
    (payload) => {
      console.log('Course updated:', payload.new)
    }
  )
  .subscribe()

// Subscribe to notifications
const notificationsChannel = supabase
  .channel('notifications')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
    (payload) => {
      console.log('New notification:', payload.new)
    }
  )
  .subscribe()
```

## File Storage

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Upload certificate
const { data, error } = await supabase.storage
  .from('certificates')
  .upload(`${userId}/${certificateId}.pdf`, file)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('certificates')
  .getPublicUrl(`${userId}/${certificateId}.pdf`)
```

## Next Steps

1. Update `lib/auth-context.tsx` to use Supabase auth
2. Replace static data in `lib/industry-data.ts` with Supabase queries
3. Add real-time updates for notifications
4. Implement file uploads for certificates

