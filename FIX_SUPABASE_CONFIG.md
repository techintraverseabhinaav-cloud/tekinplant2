# Fix "Missing Supabase Configuration" Error

## 🔍 Quick Diagnosis

If you're seeing "Missing Supabase configuration" error, follow these steps:

## ✅ Step 1: Verify .env.local File

1. **Check if `.env.local` exists** in your project root (same folder as `package.json`)
2. **Verify it contains**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## ✅ Step 2: Restart Development Server

**IMPORTANT**: Environment variables are only loaded when the server starts!

1. **Stop the server** (Press `Ctrl+C` in terminal)
2. **Start it again**:
   ```bash
   npm run dev
   ```

## ✅ Step 3: Get Your Supabase Keys

If you don't have the keys yet:

1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

## ✅ Step 4: Create/Update .env.local

Create a file named `.env.local` in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clerk Configuration (if not already set)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## ✅ Step 5: Verify Configuration

Test if the configuration is working:

1. Visit: `http://localhost:3000/api/test-db`
2. It should show your Supabase configuration status

## 🚨 Common Issues

### Issue 1: Variables not loading
**Solution**: Restart the dev server after adding/updating `.env.local`

### Issue 2: Wrong variable names
**Solution**: Make sure variable names are EXACTLY:
- `NEXT_PUBLIC_SUPABASE_URL` (not `SUPABASE_URL`)
- `SUPABASE_SERVICE_ROLE_KEY` (not `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`)

### Issue 3: File in wrong location
**Solution**: `.env.local` must be in the project root (same folder as `package.json`)

### Issue 4: Extra spaces or quotes
**Solution**: Don't add quotes around values:
```env
# ❌ Wrong
NEXT_PUBLIC_SUPABASE_URL="https://..."
SUPABASE_SERVICE_ROLE_KEY='eyJ...'

# ✅ Correct
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## 📝 Quick Checklist

- [ ] `.env.local` file exists in project root
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set
- [ ] No quotes around values
- [ ] No extra spaces
- [ ] Dev server restarted after changes
- [ ] Test endpoint shows configuration is loaded

## 🔗 Need Help?

If the error persists:
1. Check browser console for detailed error messages
2. Check terminal/server logs
3. Visit `/api/test-db` to see configuration status
4. Verify keys are correct in Supabase dashboard

