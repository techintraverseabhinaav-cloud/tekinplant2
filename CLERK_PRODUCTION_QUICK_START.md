# Clerk Production Mode - Quick Start

## 🚀 Quick Setup (5 Minutes)

### 1. Get Production Keys
1. Go to https://dashboard.clerk.com
2. Select your app (or create a production app)
3. Go to **API Keys**
4. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_live_`)
   - `CLERK_SECRET_KEY` (starts with `sk_live_`)

### 2. Add to Production Environment

**Vercel:**
```
Settings → Environment Variables → Add:
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_...
- CLERK_SECRET_KEY = sk_live_...
```

**Other Platforms:**
- Add the same variables in your platform's environment settings

### 3. Configure URLs in Clerk Dashboard

**Settings → Frontend API:**
- Add: `https://yourdomain.com`

**Settings → Paths:**
- Sign-in: `https://yourdomain.com/login`
- Sign-up: `https://yourdomain.com/sign-up`
- After sign-in: `https://yourdomain.com/redirect-dashboard`
- After sign-up: `https://yourdomain.com/redirect-dashboard`

### 4. Deploy & Test
- Deploy your application
- Test sign-in/sign-up
- Verify users appear in Clerk Dashboard

## ✅ Done!

Your Clerk is now in production mode.

For detailed instructions, see `CLERK_PRODUCTION_SETUP.md`

