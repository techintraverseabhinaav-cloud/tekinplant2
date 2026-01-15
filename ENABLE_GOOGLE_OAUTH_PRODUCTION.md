# Enable Google Login in Clerk Production Mode

This guide will walk you through enabling Google OAuth authentication in Clerk production mode.

## 🎯 Overview

To enable Google login in production, you need to:
1. Configure Google OAuth in Clerk Dashboard (Production instance)
2. Set up OAuth credentials in Google Cloud Console
3. Add the correct redirect URIs
4. Verify the configuration

---

## 📋 Step 1: Get Your Clerk Production Callback URL

**This is the redirect URI you'll need for Google Cloud Console!**

1. **Go to Clerk Dashboard**
   - Visit https://dashboard.clerk.com
   - **CRITICAL:** Make sure the dropdown at the top says **"Production"** (not Development)
   - Select your production application

2. **Get Your Frontend API URL**
   - Go to **Settings** → **Frontend API**
   - Copy the Frontend API URL
   - It looks like: `https://your-app.clerk.accounts.dev`
   - Or: `https://clerk.yourdomain.com`

3. **Create Your Callback URL**
   - Add `/.well-known/oauth/callback` to the end of your Frontend API URL
   - Example: `https://your-app.clerk.accounts.dev/.well-known/oauth/callback`
   - **Save this URL** - you'll need it in Step 3

---

## 🔧 Step 2: Set Up Google OAuth in Google Cloud Console

### 2.1 Create or Select a Project

1. **Go to Google Cloud Console**
   - Visit https://console.cloud.google.com
   - Sign in with your Google account

2. **Create a New Project (or Select Existing)**
   - Click the project dropdown at the top
   - Click **"New Project"** (or select an existing production project)
   - Name it something like "TekInPlant Production"
   - Click **"Create"**

### 2.2 Enable Google+ API

1. **Go to APIs & Services → Library**
   - Search for "Google+ API" or "People API"
   - Click on it and click **"Enable"**

### 2.3 Create OAuth 2.0 Credentials

1. **Go to APIs & Services → Credentials**
   - Click **"+ CREATE CREDENTIALS"**
   - Select **"OAuth client ID"**

2. **Configure OAuth Consent Screen** (if prompted)
   - Choose **"External"** (unless you have a Google Workspace)
   - Click **"Create"**
   - Fill in the required information:
     - **App name:** TekInPlant (or your app name)
     - **User support email:** Your email
     - **Developer contact information:** Your email
   - Click **"Save and Continue"**
   - Add scopes (if needed):
     - `email`
     - `profile`
     - `openid`
   - Click **"Save and Continue"**
   - Add test users (optional for now)
   - Click **"Save and Continue"**
   - Review and click **"Back to Dashboard"**

3. **Create OAuth Client ID**
   - **Application type:** Web application
   - **Name:** TekInPlant Production (or your app name)

4. **Add Authorized Redirect URIs**
   - Click **"+ ADD URI"**
   - Add your Clerk callback URL from Step 1:
     ```
     https://your-app.clerk.accounts.dev/.well-known/oauth/callback
     ```
   - **Important:** Replace `your-app.clerk.accounts.dev` with your actual Clerk Frontend API URL
   - Must match exactly (including `https://` and the full path)

5. **Add Authorized JavaScript Origins**
   - Click **"+ ADD URI"**
   - Add your production domain:
     ```
     https://yourdomain.com
     https://www.yourdomain.com
     ```
   - Add your Clerk Frontend API (without the callback path):
     ```
     https://your-app.clerk.accounts.dev
     ```
   - **Important:** Replace with your actual URLs

6. **Click "Create"**
   - You'll see a popup with your **Client ID** and **Client Secret**
   - **Copy both** - you'll need them in Step 3
   - Format:
     - Client ID: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
     - Client Secret: `GOCSPX-abcdefghijklmnopqrstuvwxyz`

---

## ⚙️ Step 3: Configure Google OAuth in Clerk Dashboard

1. **Go to Clerk Dashboard**
   - Visit https://dashboard.clerk.com
   - **CRITICAL:** Make sure dropdown at top says **"Production"** (not Development)
   - Select your production application

2. **Navigate to Social Connections**
   - Go to **User & Authentication** → **Social Connections**
   - Find **Google** in the list

3. **Configure Google OAuth**
   - Click **"Configure"** or **"Edit"** next to Google
   - You'll see two fields:
     - **Client ID**
     - **Client Secret**

4. **Enter Your Google OAuth Credentials**
   - **Client ID:** Paste the Client ID from Step 2.6
   - **Client Secret:** Paste the Client Secret from Step 2.6
   - Make sure there are no extra spaces

5. **Click "Save"**
   - You should see a success message
   - Google should now show as **"Enabled"** or **"Active"**

---

## 🌐 Step 4: Configure Allowed Origins in Clerk

1. **Go to Clerk Dashboard → Settings → OAuth**
   - Scroll to **"Allowed Origins"** section

2. **Add Your Production Domain**
   - Click **"+ Add Origin"**
   - Add your production domain:
     ```
     https://yourdomain.com
     https://www.yourdomain.com
     ```
   - Replace with your actual production domain

3. **Click "Save"**

---

## ✅ Step 5: Verify Configuration

### 5.1 Check Clerk Configuration

1. **Go to Clerk Dashboard → User & Authentication → Social Connections**
   - Google should show as **"Enabled"** or **"Active"**
   - Status should be green/active

2. **Verify Frontend API**
   - Go to **Settings → Frontend API**
   - Make sure your production domain is listed

### 5.2 Check Google Cloud Console

1. **Go to Google Cloud Console → APIs & Services → Credentials**
   - Find your OAuth 2.0 Client ID
   - Click to view/edit
   - Verify:
     - ✅ Authorized Redirect URIs includes your Clerk callback URL
     - ✅ Authorized JavaScript Origins includes your domain and Clerk Frontend API

---

## 🧪 Step 6: Test Google Sign-In

1. **Clear Browser Cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or use incognito/private browsing mode

2. **Test on Your Production Site**
   - Go to your sign-in page: `https://yourdomain.com/login`
   - You should see a **"Sign in with Google"** button
   - Click it

3. **Expected Flow**
   - Should redirect to Google sign-in page
   - After signing in, should redirect back to your app
   - Should successfully create/log in the user

---

## 🔍 Troubleshooting

### Issue: "Sign in with Google" button doesn't appear

**Possible Causes:**
- Google OAuth not enabled in Clerk Dashboard
- Using development instance instead of production

**Fix:**
- Go to Clerk Dashboard → Social Connections → Google
- Make sure it's enabled and configured
- Verify you're in **Production** mode (not Development)

---

### Issue: "Redirect URI mismatch" error

**Possible Causes:**
- Redirect URI in Google Cloud Console doesn't match Clerk callback URL
- Missing or incorrect redirect URI

**Fix:**
1. Get your Clerk callback URL:
   - Clerk Dashboard → Settings → Frontend API
   - Add `/.well-known/oauth/callback` to the end
2. Update Google Cloud Console:
   - APIs & Services → Credentials → Your OAuth Client ID
   - Add the exact Clerk callback URL to Authorized Redirect URIs
   - Must match character-for-character

---

### Issue: "Invalid client_id" error

**Possible Causes:**
- Using development client ID in production
- Client ID not copied correctly

**Fix:**
- Make sure you're using production client ID from Google Cloud Console
- Copy it again and paste into Clerk Dashboard
- Check for extra spaces or characters

---

### Issue: "CORS policy" or "Origin not allowed" error

**Possible Causes:**
- Domain not in Google Cloud Console → Authorized JavaScript Origins
- Domain not in Clerk Dashboard → OAuth → Allowed Origins

**Fix:**
1. Add domain to Google Cloud Console:
   - APIs & Services → Credentials → Your OAuth Client ID
   - Add to Authorized JavaScript Origins
2. Add domain to Clerk Dashboard:
   - Settings → OAuth → Allowed Origins
   - Add your production domain

---

### Issue: OAuth works in development but not production

**Possible Causes:**
- Using development OAuth credentials in production
- Not configured in Production instance of Clerk

**Fix:**
- Make sure you're configuring the **Production** instance in Clerk Dashboard
- Check the dropdown at top - should say "Production"
- Development and Production instances have separate OAuth configurations

---

## 📝 Quick Checklist

Before testing, verify:

### Google Cloud Console:
- [ ] OAuth 2.0 Client ID created
- [ ] Clerk callback URL added to Authorized Redirect URIs
- [ ] Production domain added to Authorized JavaScript Origins
- [ ] Clerk Frontend API added to Authorized JavaScript Origins
- [ ] Client ID and Secret copied

### Clerk Dashboard (Production):
- [ ] Using Production instance (not Development)
- [ ] Google OAuth enabled in Social Connections
- [ ] Production Client ID added
- [ ] Production Client Secret added
- [ ] Production domain added to Frontend API
- [ ] Production domain added to OAuth → Allowed Origins

### Testing:
- [ ] "Sign in with Google" button appears on sign-in page
- [ ] Clicking button redirects to Google
- [ ] After Google sign-in, redirects back to app
- [ ] User is successfully created/logged in

---

## 🎯 Important Notes

1. **Development vs Production**
   - Development and Production instances in Clerk are separate
   - OAuth must be configured separately for each
   - Make sure you're always in **Production** mode when configuring

2. **Redirect URI Format**
   - Must be exactly: `https://your-app.clerk.accounts.dev/.well-known/oauth/callback`
   - Include `https://` (not `http://`)
   - Include the full path `/.well-known/oauth/callback`
   - No trailing slashes

3. **Client ID Format**
   - Google Client ID: `123456789-abc...apps.googleusercontent.com`
   - Clerk will accept this format
   - Make sure there are no extra spaces when copying

4. **Domain Whitelisting**
   - Both Google Cloud Console and Clerk Dashboard need your domain
   - Add both `https://yourdomain.com` and `https://www.yourdomain.com` if you use both

---

## 🆘 Still Having Issues?

1. **Check Browser Console**
   - Open DevTools (F12) → Console
   - Look for specific OAuth errors
   - Check for client ID or redirect URI errors

2. **Check Network Tab**
   - Open DevTools (F12) → Network
   - Filter by "oauth" or "google"
   - Look for failed requests
   - Check error messages in response

3. **Verify All URLs Match**
   - Clerk callback URL in Clerk Dashboard
   - Redirect URI in Google Cloud Console
   - Must match exactly

4. **Check Clerk Dashboard Logs**
   - Go to Clerk Dashboard → Logs
   - Look for OAuth-related errors
   - Check for authentication failures

5. **Test in Incognito Mode**
   - Sometimes browser cache causes issues
   - Test in a fresh incognito window

---

## ✅ Success Indicators

When everything is working correctly, you should see:

- ✅ "Sign in with Google" button on your sign-in page
- ✅ Clicking it redirects to Google sign-in
- ✅ After Google authentication, redirects back to your app
- ✅ User is successfully logged in
- ✅ User appears in Clerk Dashboard → Users
- ✅ No errors in browser console

---

**Need Help?** Check the other documentation files:
- `FIX_OAUTH_PRODUCTION_ERROR.md` - Common OAuth errors
- `FIX_GENERAL_OAUTH_FLOW_ERROR.md` - General OAuth flow issues
- `CLERK_PRODUCTION_SETUP.md` - General Clerk production setup

