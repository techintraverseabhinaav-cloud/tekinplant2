# Complete Supabase Backend Setup Guide

## 🎯 Overview

This guide will help you set up Supabase as your backend for the Training Portal. Supabase provides:
- **Authentication** (email/password, OAuth)
- **PostgreSQL Database** (with real-time subscriptions)
- **File Storage** (for certificates, images)
- **Row Level Security** (automatic security policies)

---

## 📝 Step-by-Step Setup

### Step 1: Create Supabase Account & Project

1. **Visit**: https://supabase.com
2. **Sign up** with GitHub (recommended) or email
3. **Create New Project**:
   - Click "New Project"
   - Project Name: `trainin-portal`
   - Database Password: Create a strong password (save it!)
   - Region: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for setup

### Step 2: Get Your API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### Step 3: Set Up Environment Variables

1. Create `.env.local` file in your project root:
   ```bash
   # Windows PowerShell
   New-Item .env.local
   ```

2. Add your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 4: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Open `supabase/schema.sql` from your project
4. Copy **ALL** the SQL code
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. Wait for "Success. No rows returned" message

### Step 5: Verify Installation

The Supabase packages are already installed. Verify:

```bash
npm list @supabase/supabase-js @supabase/ssr
```

### Step 6: Test the Connection

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Check browser console for any errors

---

## 🗄️ Database Schema Overview

Your database includes these tables:

### Core Tables:
- **profiles** - User profiles (extends auth.users)
- **companies** - Corporate partners
- **courses** - Training programs
- **enrollments** - Student course enrollments
- **assignments** - Course assignments
- **submissions** - Assignment submissions
- **quizzes** - Course quizzes
- **quiz_questions** - Quiz questions
- **quiz_attempts** - Student quiz attempts
- **certificates** - Generated certificates
- **notifications** - User notifications

### Security:
- **Row Level Security (RLS)** enabled on all tables
- **Policies** ensure users can only access their own data
- **Admins** have full access
- **Trainers** can manage their courses

---

## 🔧 Integration Steps

### 1. Update Authentication Context

Replace `lib/auth-context.tsx` to use Supabase:

```typescript
import { createClient } from '@/lib/supabase/client'
import { signIn, signOut, getCurrentUser, getUserProfile } from '@/lib/supabase/auth'

// Use Supabase auth instead of localStorage
```

### 2. Update Login Page

Modify `app/login/page.tsx` to use Supabase:

```typescript
import { signIn } from '@/lib/supabase/auth'

// Replace demo credentials with Supabase auth
const handleLogin = async (email: string, password: string) => {
  const { user } = await signIn(email, password)
  const profile = await getUserProfile(user.id)
  // Set user in context
}
```

### 3. Replace Static Data

Update `app/courses/page.tsx`:

```typescript
import { getCourses } from '@/lib/supabase/courses'

// Replace industryCourses with:
const courses = await getCourses({ search, type, location })
```

### 4. Add Real-time Notifications

In your Navbar component:

```typescript
import { createClient } from '@/lib/supabase/client'
import { getNotifications } from '@/lib/supabase/notifications'

// Subscribe to real-time notifications
useEffect(() => {
  const supabase = createClient()
  const channel = supabase
    .channel('notifications')
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications' },
      (payload) => {
        // Update notification count
      }
    )
    .subscribe()
  
  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```

---

## 📊 Migrating Existing Data

### Option 1: Use Supabase Dashboard

1. Go to **Table Editor** in Supabase
2. Select table (e.g., `courses`)
3. Click **"Insert"** → **"Insert row"**
4. Manually add your data

### Option 2: Use SQL Script

Create a migration script in `supabase/migrate-data.sql`:

```sql
-- Insert companies
INSERT INTO public.companies (name, industry, location, ...)
VALUES 
  ('Siemens', 'Automation', 'Mumbai, India', ...),
  ('ABB', 'Industrial', 'Delhi, India', ...);

-- Insert courses
INSERT INTO public.courses (title, company_name, ...)
VALUES 
  ('PLC Programming', 'Siemens', ...);
```

---

## 🔐 Creating Demo Users

### Method 1: Through Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click **"Add User"** → **"Create new user"**
3. Add email/password
4. In **User Metadata**, add:
   ```json
   {
     "full_name": "John Doe",
     "role": "student"
   }
   ```

### Method 2: Through Sign Up Flow

Users will automatically get a profile when they sign up (trigger handles this).

---

## 🚀 Next Steps

1. ✅ Set up Supabase project
2. ✅ Run database schema
3. ✅ Configure environment variables
4. ⬜ Update auth context to use Supabase
5. ⬜ Migrate course data to database
6. ⬜ Add real-time notifications
7. ⬜ Implement file uploads for certificates

---

## 📚 Useful Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js + Supabase**: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security
- **Real-time**: https://supabase.com/docs/guides/realtime

---

## 🆘 Troubleshooting

### "Invalid API key" error
- Check `.env.local` file exists
- Verify keys are correct (no extra spaces)
- Restart dev server after adding env vars

### "Relation does not exist" error
- Make sure you ran the schema.sql script
- Check table names match (case-sensitive)

### Authentication not working
- Check Supabase project is active
- Verify email confirmation settings
- Check browser console for errors

---

## 💡 Tips

1. **Start with authentication** - Get login working first
2. **Test with Supabase dashboard** - Use Table Editor to verify data
3. **Use real-time sparingly** - Only for notifications, not all data
4. **Monitor usage** - Free tier has limits
5. **Backup data** - Export important data regularly

---

## 📞 Need Help?

- Check `supabase/README.md` for code examples
- Review `lib/supabase/*.ts` files for API functions
- Supabase Discord: https://discord.supabase.com

