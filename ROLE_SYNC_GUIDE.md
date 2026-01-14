# Role Sync to Supabase Guide

## How Roles Are Set in Supabase

### Flow Overview

1. **User visits role-specific page** (e.g., `/admin`, `/trainer`, `/corporate`)
   - The page sets `localStorage.setItem('signup_role', 'admin')` (or trainer/corporate)
   - For main `/sign-up`, defaults to `'student'`

2. **User signs up/signs in**
   - Clerk handles authentication
   - `SyncUserToSupabase` component runs automatically

3. **Role is determined** (in `SyncUserToSupabase.tsx`):
   - First checks Clerk's `publicMetadata.role`
   - Falls back to `localStorage.getItem('signup_role')`
   - Defaults to `'student'` if neither exists

4. **Role is sent to API** (`/api/sync-user`):
   - Role is included in the request body
   - API validates the role

5. **Role is saved to Supabase** (`sync-clerk-user.ts`):
   - Role is validated against allowed values: `'student'`, `'trainer'`, `'admin'`, `'corporate'`
   - If invalid, defaults to `'student'`
   - Role is saved in the `profiles.role` column
   - Role is also updated in Clerk's `publicMetadata` for future use

### Role-Specific Routes

- **Students**: `/sign-up` or `/login` → defaults to `'student'`
- **Trainers**: `/trainer` → sets `'trainer'` role
- **Admins**: `/admin` → sets `'admin'` role
- **Corporate**: `/corporate` → sets `'corporate'` role

### Supabase Schema

The `profiles` table has a `role` column with a CHECK constraint:
```sql
role TEXT NOT NULL CHECK (role IN ('student', 'trainer', 'admin', 'corporate'))
```

### Verification

To verify roles are set correctly in Supabase:

1. Go to Supabase Dashboard → Table Editor → `profiles`
2. Check the `role` column for each user
3. Verify it matches the route they used to sign up

### Troubleshooting

If roles are not being set:

1. **Check localStorage**: Open browser console and run `localStorage.getItem('signup_role')`
2. **Check API logs**: Look for `🔑 Role determination:` and `📤 User data to sync:` logs
3. **Check Supabase logs**: Verify the role is being saved in the database
4. **Check Clerk metadata**: Verify `publicMetadata.role` is set in Clerk dashboard

### Important Notes

- Roles are set **during sign-up** based on which route the user visits
- Roles are **always updated** in Supabase when a user signs in (from Clerk metadata or localStorage)
- If a user signs up via `/admin`, their role will be `'admin'` in Supabase
- If a user signs up via `/trainer`, their role will be `'trainer'` in Supabase
- If a user signs up via `/corporate`, their role will be `'corporate'` in Supabase
- If a user signs up via `/sign-up`, their role will be `'student'` in Supabase

