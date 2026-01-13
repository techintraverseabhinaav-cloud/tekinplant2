# Supabase Migration Guide: Development to Production Clerk Keys

When you switch from Clerk development keys to production keys, **user IDs will be different**. This guide explains what happens and how to handle it.

## 🔍 What Happens When You Switch

### The Problem

- **Development Clerk keys** create users with IDs like: `user_2abc123...` (from development instance)
- **Production Clerk keys** create users with IDs like: `user_2xyz789...` (from production instance)
- **These are different users** in Clerk's system, even if they have the same email

### Impact on Supabase

Your Supabase `profiles` table stores:
- `clerk_id` - The Clerk user ID
- `email` - User's email address
- Other profile data (name, role, etc.)

When switching to production:
- Existing development users will have **different Clerk IDs**
- The sync system will try to match by `clerk_id` first, then by `email`
- If no match is found, a **new profile will be created**

## ✅ Options for Handling Existing Users

### Option 1: Let Users Sign Up Again (Recommended for Most Cases)

**Best for:** New projects, small user bases, or when you want a clean start

**What happens:**
- Users sign in with production Clerk keys
- System creates new profiles in Supabase
- Old development profiles remain but won't be used
- Users start fresh

**Pros:**
- ✅ Simple - no migration needed
- ✅ Clean separation between dev and prod data
- ✅ No risk of data corruption

**Cons:**
- ❌ Users lose their previous data (enrollments, progress, etc.)
- ❌ Need to re-enroll in courses

**Steps:**
1. Switch to production Clerk keys
2. Users sign up/sign in again
3. System automatically creates new profiles
4. (Optional) Clean up old development profiles later

### Option 2: Migrate Users by Email (Recommended for Existing Users)

**Best for:** Projects with existing users you want to preserve

**What happens:**
- When a user signs in with production keys, system matches by email
- If email matches an existing profile, it updates the `clerk_id`
- User keeps their existing data

**How it works:**
The sync system already does this! It checks:
1. First: Match by `clerk_id` (won't match for dev users)
2. Then: Match by `email` (will match if same email)
3. If match found: Updates `clerk_id` to new production Clerk ID
4. If no match: Creates new profile

**Pros:**
- ✅ Users keep their data
- ✅ Automatic migration
- ✅ No manual work needed

**Cons:**
- ⚠️ Requires users to sign in again
- ⚠️ Email must match exactly

**Steps:**
1. Switch to production Clerk keys
2. Users sign in with the **same email** they used in development
3. System automatically matches by email and updates `clerk_id`
4. User data is preserved!

### Option 3: Manual Migration Script (Advanced)

**Best for:** Large user bases or when you need precise control

**What happens:**
- Create a script to migrate all development users
- Match development Clerk IDs to production Clerk IDs
- Update Supabase profiles

**Pros:**
- ✅ Complete control over migration
- ✅ Can migrate all users at once
- ✅ Can verify data integrity

**Cons:**
- ❌ Complex - requires technical knowledge
- ❌ Need to map dev IDs to prod IDs
- ❌ Risk of errors if not done carefully

**Steps:**
1. Export development users from Clerk Dashboard
2. Export production users from Clerk Dashboard
3. Match by email
4. Create migration script to update Supabase
5. Run script to update `clerk_id` in profiles table

## 🎯 Recommended Approach

### For Most Projects: **Option 2 (Automatic Email Matching)**

The sync system already handles this! Just:

1. **Switch to production Clerk keys** in Vercel
2. **Users sign in again** with their email
3. **System automatically matches** by email and updates `clerk_id`
4. **User data is preserved!**

### For New Projects: **Option 1 (Fresh Start)**

If you don't have important user data yet:
1. Switch to production keys
2. Let users sign up fresh
3. Clean up old development profiles later

## 📋 Step-by-Step Migration (Option 2 - Recommended)

### Step 1: Switch to Production Keys

1. Get production keys from Clerk Dashboard
2. Update Vercel environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_...`
   - `CLERK_SECRET_KEY` = `sk_live_...`
3. Redeploy application

### Step 2: Configure Clerk Dashboard

1. Add your production domain to Clerk Dashboard → Settings → Frontend API
2. Configure redirect URLs
3. (Optional) Migrate users from development to production instance in Clerk Dashboard

### Step 3: Users Sign In

1. Users visit your production site
2. Sign in with the **same email** they used in development
3. System automatically:
   - Creates new Clerk user (production instance)
   - Matches by email in Supabase
   - Updates `clerk_id` to new production Clerk ID
   - Preserves all existing data

### Step 4: Verify Migration

1. Check Supabase `profiles` table
2. Verify `clerk_id` has been updated to production IDs
3. Verify user data (enrollments, progress, etc.) is intact

## 🔍 How to Check if Migration Worked

### Check Supabase Profiles

1. Go to Supabase Dashboard → Table Editor → `profiles`
2. Look for:
   - `clerk_id` should start with production Clerk user IDs
   - `email` should match user's email
   - All other data should be preserved

### Check User Enrollments

1. Go to `enrollments` table
2. Verify enrollments are still linked to correct users
3. Check that `user_id` matches the updated profile IDs

### Test User Flow

1. Have a test user sign in
2. Check their dashboard
3. Verify:
   - Profile information is correct
   - Enrollments are visible
   - Progress is preserved

## 🧹 Cleanup (Optional)

After migration, you can optionally clean up:

### Remove Old Development Profiles

**⚠️ Only do this after verifying all users have migrated!**

```sql
-- Find profiles with old development Clerk IDs
-- (Development IDs typically have different prefixes)
SELECT * FROM profiles 
WHERE clerk_id NOT LIKE 'user_2%' 
   OR clerk_id IS NULL;

-- Delete old development profiles (BE CAREFUL!)
-- Only run this if you're sure all users have migrated
-- DELETE FROM profiles WHERE clerk_id NOT LIKE 'user_2%';
```

### Remove Orphaned Data

```sql
-- Find enrollments without matching profiles
SELECT e.* FROM enrollments e
LEFT JOIN profiles p ON e.user_id = p.id
WHERE p.id IS NULL;

-- Clean up orphaned enrollments (if needed)
-- DELETE FROM enrollments WHERE user_id NOT IN (SELECT id FROM profiles);
```

## ⚠️ Important Notes

### Email Matching Requirements

For automatic migration to work:
- ✅ User must sign in with the **exact same email** they used in development
- ✅ Email must match exactly (case-sensitive in some cases)
- ✅ User must sign in after switching to production keys

### Data Preservation

The sync system preserves:
- ✅ User profile data (name, role, avatar)
- ✅ Enrollments (linked by `user_id`, not `clerk_id`)
- ✅ Course progress
- ✅ Certificates
- ✅ Quiz attempts
- ✅ Assignments

### What Gets Reset

- ⚠️ Clerk session (user needs to sign in again)
- ⚠️ Clerk user ID (new ID in production instance)
- ⚠️ Any Clerk-specific data stored in Clerk Dashboard

## 🆘 Troubleshooting

### Issue: User data not preserved after migration

**Solution:**
- Check if email matches exactly
- Verify user signed in after switching to production keys
- Check Supabase logs for sync errors
- Manually update `clerk_id` if needed

### Issue: Duplicate profiles created

**Solution:**
- This happens if email doesn't match
- Merge profiles manually in Supabase
- Update `clerk_id` on the correct profile
- Delete duplicate profile

### Issue: Enrollments not showing

**Solution:**
- Check that `user_id` in enrollments matches profile `id`
- Verify profile was updated with new `clerk_id`
- Check that enrollments weren't deleted

## 📝 Summary

**For most cases:** Just switch to production keys and let users sign in again. The system will automatically match by email and preserve their data.

**No manual migration needed** - the sync system handles it automatically!

---

**Key Point:** The sync system matches by email, so as long as users sign in with the same email, their data will be preserved automatically.

