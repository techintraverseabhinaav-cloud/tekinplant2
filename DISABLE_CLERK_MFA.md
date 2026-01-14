# How to Disable Multi-Factor Authentication (MFA) in Clerk

## 🚫 Disable MFA in Clerk Dashboard

MFA is configured in the Clerk Dashboard, not in code. Follow these steps to disable it:

### Step 1: Go to Clerk Dashboard
1. Visit https://dashboard.clerk.com
2. Sign in to your account
3. Select your application (make sure it's the **Production** instance if you're in production)

### Step 2: Navigate to Multi-Factor Settings
1. In the left sidebar, go to **User & Authentication**
2. Click on **Multi-factor** (or **MFA**)

### Step 3: Disable MFA Strategies
You'll see a list of MFA strategies. Disable each one:

1. **SMS Verification**
   - Toggle OFF "SMS verification"
   - This removes SMS-based MFA

2. **Authenticator App (TOTP)**
   - Toggle OFF "Authenticator app"
   - This removes Google Authenticator, Authy, etc.

3. **Backup Codes**
   - Toggle OFF "Backup codes"
   - This removes backup code generation

4. **Email Verification (if shown)**
   - Toggle OFF any email-based MFA options

### Step 4: Save Changes
- Click **Save** or the changes will auto-save
- Wait a few seconds for changes to propagate

### Step 5: Verify
1. Sign out and sign back in
2. You should no longer see MFA setup prompts
3. Users won't be asked to enable MFA

## 📝 Alternative: Make MFA Optional

If you want to keep MFA available but not required:

1. In Clerk Dashboard → **User & Authentication** → **Multi-factor**
2. Keep strategies enabled but set them as **Optional** (not required)
3. Users can choose to enable MFA, but it won't be forced

## ⚠️ Important Notes

- **Security Consideration**: Disabling MFA reduces account security
- **Existing Users**: Users who already have MFA enabled will need to disable it manually
- **Production vs Development**: Make sure you're editing the correct instance (Production or Development)

## 🔍 Verify MFA is Disabled

1. **Test Sign-In**
   - Sign in with a test account
   - You should NOT see any MFA prompts
   - No "Set up two-factor authentication" messages

2. **Check User Settings**
   - Go to user profile/settings
   - MFA options should not appear

## 🆘 Troubleshooting

### Issue: MFA still appears after disabling
- **Solution**: 
  - Clear browser cache
  - Wait a few minutes for changes to propagate
  - Check you're editing the correct Clerk instance (Production vs Development)

### Issue: Users still see MFA prompts
- **Solution**:
  - Users who already enabled MFA need to disable it in their account settings
  - Or you can disable it for them in Clerk Dashboard → Users → Select user → Security

---

**Need Help?** Check Clerk's documentation: https://clerk.com/docs/authentication/mfa

