# Complete Guide: Migrate All Courses to Supabase

This guide shows you how to transfer all 25 courses from `lib/industry-data.ts` to your Supabase database.

## 🎯 Two Methods Available

### Method 1: SQL Script (Recommended for Quick Setup) ⭐

**Best for**: Quick one-time migration, when you want to see the SQL

**Steps**:
1. **Open Supabase Dashboard** → **SQL Editor**
2. **Make sure companies are inserted first**:
   - Run the companies INSERT from `supabase/complete-migration.sql`
   - Or ensure companies already exist in your database
3. **Copy the entire content** from `supabase/migrate-all-courses-complete.sql`
4. **Paste and run** in SQL Editor
5. **Done!** All 25 courses are now in your database

**Pros**:
- ✅ Fast and simple
- ✅ See exactly what's being inserted
- ✅ Easy to modify if needed
- ✅ Can run multiple times (with duplicates)

**Cons**:
- ❌ Manual copy-paste
- ❌ Need to update if courses change

---

### Method 2: Node.js Script (Automated) 🚀

**Best for**: Automated migration, when you update courses frequently

**Steps**:
1. **Install dependencies** (if not already installed):
   ```bash
   npm install dotenv @supabase/supabase-js
   ```

2. **Verify `.env.local`** has Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

3. **Run the migration script**:
   ```bash
   node scripts/migrate-courses-to-supabase.js
   ```

4. **Watch the progress** - it will show:
   - ✅ Successfully inserted courses
   - ❌ Any errors
   - 📊 Final summary

**Pros**:
- ✅ Fully automated
- ✅ Reads directly from `lib/industry-data.ts`
- ✅ Automatically links to companies
- ✅ Shows progress and errors
- ✅ Easy to re-run when courses update

**Cons**:
- ❌ Requires Node.js setup
- ❌ More complex if errors occur

---

## 📋 Prerequisites

Before migrating, make sure:

1. ✅ **Supabase schema is set up**
   - Run `supabase/schema.sql` in Supabase SQL Editor
   - Tables should exist: `companies`, `courses`

2. ✅ **Companies are inserted**
   - Run companies INSERT from `supabase/complete-migration.sql`
   - Or insert companies manually

3. ✅ **Environment variables are set**
   - `.env.local` exists with Supabase credentials
   - Restart dev server after adding env vars

---

## 🔍 Verification

After migration, verify in Supabase:

### Check Total Courses
```sql
SELECT COUNT(*) as total_courses FROM public.courses;
```
**Expected**: 25 courses

### View All Courses
```sql
SELECT id, title, company_name, location, rating, student_count 
FROM public.courses 
ORDER BY rating DESC;
```

### Check Courses by Company
```sql
SELECT company_name, COUNT(*) as course_count 
FROM public.courses 
GROUP BY company_name 
ORDER BY course_count DESC;
```

### Verify Company Links
```sql
SELECT c.title, c.company_name, comp.name as company_verified
FROM public.courses c
LEFT JOIN public.companies comp ON c.company_id = comp.id
WHERE c.company_id IS NULL;
```
**Expected**: 0 rows (all courses should be linked)

---

## 🐛 Troubleshooting

### Issue: "Company not found" warnings

**Fix**: Make sure companies are inserted first:
1. Run companies INSERT from `supabase/complete-migration.sql`
2. Or manually insert companies in Supabase Table Editor

### Issue: "Duplicate key" errors

**Fix**: Courses already exist. Options:
1. **Delete existing courses**:
   ```sql
   DELETE FROM public.courses;
   ```
2. **Or skip duplicates** (SQL script handles this)

### Issue: Script can't read industry-data.ts

**Fix**: 
1. Check file path: `lib/industry-data.ts` exists
2. Verify file format matches expected structure
3. Try using SQL script instead

### Issue: "Missing Supabase credentials"

**Fix**:
1. Check `.env.local` exists in project root
2. Verify variables are named correctly:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Restart terminal/IDE after adding env vars

---

## 📊 What Gets Migrated

Each course includes:
- ✅ Title
- ✅ Company name
- ✅ Location
- ✅ Type (Training category)
- ✅ Duration
- ✅ Price
- ✅ Image URL
- ✅ Description
- ✅ Tags (array)
- ✅ Contact info
- ✅ Website
- ✅ Rating
- ✅ Student count
- ✅ Active status

**Plus**: Automatic linking to companies via `company_id`

---

## 🎯 Next Steps

After migration:

1. ✅ **Verify courses appear** in Supabase Table Editor
2. ✅ **Test in your app**: Visit `/courses` page
3. ✅ **Update your code**: Replace `industryCourses` with Supabase queries
4. ✅ **Test search/filter**: Make sure filtering works with database

---

## 📝 Files Reference

- **SQL Script**: `supabase/migrate-all-courses-complete.sql`
- **Node.js Script**: `scripts/migrate-courses-to-supabase.js`
- **Source Data**: `lib/industry-data.ts`
- **Schema**: `supabase/schema.sql`

---

**Quick Start**: Use Method 1 (SQL Script) for fastest setup! 🚀

