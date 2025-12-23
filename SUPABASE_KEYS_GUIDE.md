# Supabase Keys Guide: Public vs Private

## 🔑 Two Types of Keys

Supabase provides two API keys with different security levels:

### 1. **anon/public key** (Public Key) ✅ USE THIS
- **Location**: Settings → API → `anon` `public` key
- **Security**: Protected by Row Level Security (RLS)
- **Where to use**: **Client-side code** (browser, React components)
- **Safe to expose**: Yes, it's meant to be public
- **What it can do**: 
  - Read/write data based on RLS policies
  - Authenticate users
  - Access data the user has permission for

### 2. **service_role key** (Private Key) ⚠️ KEEP SECRET
- **Location**: Settings → API → `service_role` `secret` key
- **Security**: **Bypasses all RLS policies** - full database access!
- **Where to use**: **Server-side only** (API routes, server components, edge functions)
- **Safe to expose**: **NO! Never expose this in client code**
- **What it can do**:
  - Full database access (bypasses security)
  - Admin operations
  - Bulk data operations

---

## 📝 Which Key to Use Where

### ✅ Use `anon/public` key for:

1. **Client Components** (`"use client"`)
   ```typescript
   // lib/supabase/client.ts
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Browser-side code**
   - React components
   - User authentication
   - Reading/writing user's own data
   - Public data queries

3. **Environment Variable**:
   ```env
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```
   - The `NEXT_PUBLIC_` prefix makes it available in the browser
   - This is safe because RLS protects your data

### ⚠️ Use `service_role` key for:

1. **Server-side only** (API routes, Server Components)
   ```typescript
   // Only in server-side code
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. **Admin operations**
   - Bulk data imports
   - System maintenance
   - Background jobs

3. **Environment Variable**:
   ```env
   # .env.local (NEVER commit this!)
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```
   - **NO `NEXT_PUBLIC_` prefix** - keeps it server-only
   - Never expose in client code

---

## 🎯 For Your Training Portal

### Current Setup (Recommended):

**`.env.local`**:
```env
# Public key - safe for client-side
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (anon public key)

# Optional: Private key - ONLY if you need server-side admin operations
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (service_role secret key)
```

### Why This Works:

1. **Client components** use `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Protected by Row Level Security
   - Users can only access their own data
   - Safe to expose in browser

2. **Server components** can use `SUPABASE_SERVICE_ROLE_KEY` (if needed)
   - Only for admin operations
   - Never sent to browser
   - Bypasses RLS (use carefully!)

---

## 🔒 Security Best Practices

### ✅ DO:
- Use `anon/public` key in all client-side code
- Use RLS policies to protect your data
- Keep `service_role` key server-side only
- Never commit `service_role` key to git

### ❌ DON'T:
- Never use `service_role` key in client code
- Never expose `service_role` key in browser
- Never commit `.env.local` with service_role key
- Don't disable RLS (it's your security layer)

---

## 📊 Quick Reference

| Key Type | Use In | Security | Example |
|----------|--------|----------|---------|
| **anon/public** | Client-side | Protected by RLS | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role** | Server-side only | Full access | `SUPABASE_SERVICE_ROLE_KEY` |

---

## 🎓 How RLS Protects You

Even though the `anon` key is public, your data is safe because:

1. **Row Level Security (RLS)** policies control access
2. Users can only see/modify their own data
3. Policies are enforced at the database level
4. Even if someone steals the key, they can't access other users' data

Example RLS policy:
```sql
-- Users can only see their own enrollments
CREATE POLICY "Users can view own enrollments" 
ON public.enrollments
FOR SELECT 
USING (student_id = auth.uid());
```

---

## 💡 Summary

**For your project, use the `anon/public` key** - it's safe, secure, and perfect for client-side operations. The `service_role` key is only needed for advanced server-side admin tasks.

