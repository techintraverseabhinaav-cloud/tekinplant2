# Using Development Keys (No Domain Required)

Since you don't have a domain yet, you should use **Development Keys** for local development. These work automatically with `localhost` without any domain configuration.

## 🔄 Switch to Development Keys

### Step 1: Get Development Keys from Clerk Dashboard

1. Go to https://dashboard.clerk.com
2. **Important**: Make sure you're viewing the **Development** instance
   - Look at the dropdown at the top of the page
   - It should say "Development" (not "Production")
   - If it says "Production", click it and select "Development"

3. Go to **API Keys** section
4. Copy these keys:
   - **Publishable Key** (starts with `pk_test_...`)
   - **Secret Key** (starts with `sk_test_...`)

### Step 2: Update .env.local

Replace your current production keys with development keys:

```env
# Development Keys (for localhost - no domain needed)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Step 3: Restart Dev Server

```powershell
# Stop server (Ctrl+C)
# Delete .next folder
Remove-Item -Recurse -Force .next
# Restart
npm run dev
```

### Step 4: Clear Browser Cache

- Hard refresh: `Ctrl+Shift+R`
- Or use incognito mode

## ✅ Benefits of Development Keys

- ✅ Work automatically with `localhost:3000`
- ✅ No domain configuration needed
- ✅ Perfect for local development
- ✅ Development mode indicators (which you can ignore)

## 🚀 When You Get a Domain

Once you have a domain (e.g., `yourdomain.com`):

1. **Get Production Keys** from Clerk Dashboard (switch to Production instance)
2. **Configure Domain** in Clerk Dashboard:
   - Settings → Frontend API → Add your domain
   - Settings → Paths → Configure redirect URLs
3. **Update .env.local** with production keys
4. **Deploy** your application

## 📝 Current Setup

For now, use development keys (`pk_test_...` and `sk_test_...`) and everything will work with `localhost`!

