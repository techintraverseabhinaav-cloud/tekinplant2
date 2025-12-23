# Supabase Backend Setup Guide

This guide will help you set up Supabase as the backend for your Training Portal.

## 📋 Prerequisites

1. A GitHub account (for Supabase signup)
2. Node.js installed (already done)
3. Your project running locally

## 🚀 Step 1: Create Supabase Account & Project

1. **Go to Supabase**: https://supabase.com
2. **Sign up** with your GitHub account
3. **Create a new project**:
   - Click "New Project"
   - Choose your organization
   - Project name: `trainin-portal` (or your preferred name)
   - Database password: Create a strong password (save it!)
   - Region: Choose closest to you
   - Click "Create new project"
   - Wait 2-3 minutes for project setup

## 🔑 Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`) ← **Use this for client-side code**
   - **service_role key** (optional, server-side only - keep secret!)

**Important**: Use the **anon/public key** for your client-side code. It's safe to expose because Row Level Security (RLS) protects your data. The service_role key should only be used server-side for admin operations.

## 📦 Step 3: Install Supabase Client

Run this command in your project directory:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 🗄️ Step 4: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the SQL from `supabase/schema.sql` (we'll create this)
4. Click "Run" to execute

## 🔐 Step 5: Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## ✅ Step 6: Test the Connection

Run your dev server and test authentication:

```bash
npm run dev
```

## 📚 What Supabase Provides

- **Authentication**: Email/password, OAuth, magic links
- **Database**: PostgreSQL with real-time subscriptions
- **Storage**: File uploads (for certificates, course images)
- **Edge Functions**: Serverless functions (optional)
- **Realtime**: Live updates (for notifications, chat)

## 🎯 Next Steps

After setup, you'll have:
- User authentication with Supabase Auth
- Database tables for courses, enrollments, users
- Real-time updates
- File storage for certificates

See `supabase/README.md` for detailed API usage examples.

