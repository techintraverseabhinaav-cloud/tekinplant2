# Environment Variables Setup

Create a `.env.local` file in your project root with the following:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## How to Get Your Keys:

1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Important:
- Never commit `.env.local` to git (it's already in .gitignore)
- These are public keys, safe to use in client-side code
- For server-side operations, use service_role key (keep it secret!)

