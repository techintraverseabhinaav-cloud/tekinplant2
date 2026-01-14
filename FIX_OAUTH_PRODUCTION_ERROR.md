# Fix: Google & LinkedIn OAuth Authentication Error in Production

When switching to Clerk production mode, OAuth providers (Google, LinkedIn) need to be reconfigured with production client IDs and redirect URIs.

## 🚨 The Problem

**Development OAuth settings don't work in production!** You need to:
1. Configure OAuth providers in Clerk Dashboard (Production instance)
2. Update OAuth app settings in Google/LinkedIn with production redirect URIs
3. Add production client IDs to Clerk Dashboard

## ✅ Step-by-Step Fix

### Step 1: Configure OAuth in Clerk Dashboard (Production)

1. **Go to Clerk Dashboard**
   - Visit https://dashboard.clerk.com
   - **Important:** Make sure dropdown at top says **"Production"** (not Development)
   - Select your production application

2. **Configure Google OAuth**
   - Go to **User & Authentication** → **Social Connections**
   - Find **Google** and click **"Configure"** or **"Edit"**
   - You'll see:
     - **Client ID** (needs to be from Google Cloud Console - production)
     - **Client Secret** (needs to be from Google Cloud Console - production)
   - Click **"Save"**

3. **Configure LinkedIn OAuth**
   - In the same **Social Connections** section
   - Find **LinkedIn** and click **"Configure"** or **"Edit"**
   - You'll see:
     - **Client ID** (needs to be from LinkedIn Developer Portal - production)
     - **Client Secret** (needs to be from LinkedIn Developer Portal - production)
   - Click **"Save"**

### Step 2: Update Google OAuth App (Google Cloud Console)

1. **Go to Google Cloud Console**
   - Visit https://console.cloud.google.com
   - Select your project (or create a new one for production)

2. **Go to APIs & Services → Credentials**
   - Find your OAuth 2.0 Client ID
   - Click to edit it

3. **Update Authorized Redirect URIs**
   - Add your production redirect URI from Clerk:
     ```
     https://YOUR_CLERK_FRONTEND_API/.well-known/oauth/callback
     ```
   - To find your Clerk Frontend API:
     - Go to Clerk Dashboard → Settings → Frontend API
     - Copy the Frontend API URL
     - Add `/.well-known/oauth/callback` to the end
   - Example:
     ```
     https://your-app.clerk.accounts.dev/.well-known/oauth/callback
     ```

4. **Update Authorized JavaScript Origins**
   - Add your production domain:
     ```
     https://yourdomain.com
     https://www.yourdomain.com
     ```
   - Also add your Clerk Frontend API:
     ```
     https://your-app.clerk.accounts.dev
     ```

5. **Copy Production Client ID and Secret**
   - Copy the **Client ID** (starts with something like `123456789-abc...`)
   - Copy the **Client Secret**
   - Save these - you'll need them in Step 1

6. **Click Save**

### Step 3: Update LinkedIn OAuth App (LinkedIn Developer Portal)

1. **Go to LinkedIn Developer Portal**
   - Visit https://www.linkedin.com/developers/apps
   - Sign in and select your app (or create a new one for production)

2. **Go to Auth tab**
   - Find **"Authorized redirect URLs for your app"**

3. **Add Production Redirect URIs**
   - Click **"Add redirect URL"**
   - Add your production redirect URI from Clerk:
     ```
     https://YOUR_CLERK_FRONTEND_API/.well-known/oauth/callback
     ```
   - To find your Clerk Frontend API:
     - Go to Clerk Dashboard → Settings → Frontend API
     - Copy the Frontend API URL
     - Add `/.well-known/oauth/callback` to the end
   - Example:
     ```
     https://your-app.clerk.accounts.dev/.well-known/oauth/callback
     ```
   - Click **"Update"**

4. **Copy Production Client ID and Secret**
   - Go to **Auth** tab
   - Copy the **Client ID**
   - Copy the **Client Secret**
   - Save these - you'll need them in Step 1

5. **Verify App Status**
   - Make sure your app is **"Live"** (not in development mode)
   - Some LinkedIn features require app verification for production

### Step 4: Verify Clerk Configuration

1. **Go to Clerk Dashboard → Settings → OAuth**
   - Scroll to **"Allowed Origins"**
   - Make sure your production domain is listed:
     ```
     https://yourdomain.com
     https://www.yourdomain.com
     ```
   - If not, add them and click **Save**

2. **Verify Frontend API**
   - Go to **Settings → Frontend API**
   - Make sure your production domain is listed
   - This should already be done from previous setup

### Step 5: Test OAuth Sign-In

1. **Clear Browser Cache**
   - Hard refresh: `Ctrl+Shift+R`
   - Or use incognito mode

2. **Test Google Sign-In**
   - Go to your sign-in page
   - Click "Sign in with Google"
   - Should redirect to Google and work properly

3. **Test LinkedIn Sign-In**
   - Go to your sign-in page
   - Click "Sign in with LinkedIn"
   - Should redirect to LinkedIn and work properly

## 🔍 Common Errors and Fixes

### Error: "Invalid client_id"

**Cause:** Using development client ID in production

**Fix:**
- Make sure you're using production client IDs from Google/LinkedIn
- Update them in Clerk Dashboard → Social Connections

### Error: "Redirect URI mismatch"

**Cause:** Redirect URI not added to OAuth provider

**Fix:**
- Add the Clerk callback URL to Google Cloud Console → Authorized Redirect URIs
- Add the Clerk callback URL to LinkedIn Developer Portal → Authorized Redirect URLs

### Error: "OAuth app not verified" (LinkedIn)

**Cause:** LinkedIn app is in development mode

**Fix:**
- Go to LinkedIn Developer Portal
- Request app verification (if needed)
- Some features require verified apps in production

### Error: "CORS policy" or "Origin not allowed"

**Cause:** Domain not in allowed origins

**Fix:**
- Add domain to Clerk Dashboard → Settings → OAuth → Allowed Origins
- Add domain to Google Cloud Console → Authorized JavaScript Origins

## 📝 Quick Checklist

### Google OAuth:
- [ ] Production Client ID added to Clerk Dashboard
- [ ] Production Client Secret added to Clerk Dashboard
- [ ] Clerk callback URL added to Google Cloud Console → Authorized Redirect URIs
- [ ] Production domain added to Google Cloud Console → Authorized JavaScript Origins
- [ ] Clerk Frontend API added to Google Cloud Console → Authorized JavaScript Origins

### LinkedIn OAuth:
- [ ] Production Client ID added to Clerk Dashboard
- [ ] Production Client Secret added to Clerk Dashboard
- [ ] Clerk callback URL added to LinkedIn Developer Portal → Authorized Redirect URLs
- [ ] LinkedIn app is "Live" (not in development mode)

### Clerk Configuration:
- [ ] Production domain added to Clerk Dashboard → Settings → Frontend API
- [ ] Production domain added to Clerk Dashboard → Settings → OAuth → Allowed Origins
- [ ] Using Production instance in Clerk Dashboard (not Development)

## 🎯 Finding Your Clerk Callback URL

1. Go to Clerk Dashboard → Settings → Frontend API
2. Copy the Frontend API URL (e.g., `https://your-app.clerk.accounts.dev`)
3. Add `/.well-known/oauth/callback` to the end
4. Full URL: `https://your-app.clerk.accounts.dev/.well-known/oauth/callback`
5. This is what you add to Google/LinkedIn redirect URIs

## 🔄 Development vs Production

### Development (localhost):
- Uses development OAuth apps
- Redirect URI: `http://localhost:3000` (or your dev URL)
- Works automatically with development keys

### Production:
- Uses production OAuth apps
- Redirect URI: `https://your-app.clerk.accounts.dev/.well-known/oauth/callback`
- Requires production client IDs
- Requires domain whitelisting

## 🆘 Still Not Working?

1. **Check Browser Console**
   - Open DevTools (F12) → Console
   - Look for specific OAuth errors
   - Check for client ID errors

2. **Check Network Tab**
   - Open DevTools (F12) → Network
   - Filter by "oauth" or "google" or "linkedin"
   - Look for failed requests
   - Check error messages

3. **Verify Client IDs Match**
   - Clerk Dashboard → Social Connections → Google/LinkedIn
   - Compare with Google Cloud Console / LinkedIn Developer Portal
   - They must match exactly

4. **Check Redirect URIs Match Exactly**
   - Must match character-for-character
   - Include `https://` (not `http://`)
   - Include the full path `/.well-known/oauth/callback`

---

**Key Point:** OAuth providers need production client IDs and redirect URIs configured for production mode. Development settings won't work!

