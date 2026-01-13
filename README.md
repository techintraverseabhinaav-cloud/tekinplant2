# Industry Training Portal

A modern, responsive training portal website built with Next.js that connects students with industry training programs and corporate partners.

## 🚀 Features

### Core Functionality
- **Industry Data Integration**: Comprehensive database of training programs and corporate partners
- **Advanced Search & Filtering**: Find courses by category, location, company, and keywords
- **Dynamic Company Pages**: Detailed company profiles with their training programs
- **Role-Based Authentication**: Student, Trainer, Admin, and Corporate user dashboards
- **Responsive Design**: Beautiful, elegant UI that works on all devices

### User Roles & Dashboards
- **Student Dashboard**: Track enrolled courses, progress, and learning statistics
- **Trainer Dashboard**: Manage courses, monitor student progress, and view analytics
- **Admin Dashboard**: System-wide statistics, user management, and course oversight
- **Corporate Dashboard**: Employee training management and ROI analytics

### Technical Features
- **Next.js 15**: Modern React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with custom animations
- **Authentication**: Context-based auth with localStorage persistence
- **Dynamic Routing**: SEO-friendly URLs for courses and companies
- **Glass Morphism**: Modern UI design with elegant visual effects

## 📊 Data Structure

The portal integrates data from multiple Excel files containing:
- **25 Industry Training Programs** with detailed course information
- **25 Corporate Partners** with company profiles and contact details
- **Industry Statistics** and insights for analytics
- **Dynamic Course Enrollment** system

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd trainin-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication

This portal uses **Clerk** for authentication with role-based access control. The application supports multiple user roles: Student, Trainer, Admin, and Corporate.

### Development Mode (Current)

Currently, the application is using Clerk development keys. You'll see warnings in the console:
```
⚠️ Using Clerk Development Keys - Switch to production keys for production mode
```

### Production Mode Setup

See the [Clerk Production Setup Guide](#-clerk-production-mode-setup) section below for detailed instructions on switching to production mode.

## 📁 Project Structure

```
trainin-portal/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── courses/           # Training programs
│   ├── partners/          # Corporate partners
│   ├── login/             # Authentication
│   ├── student-dashboard/ # Student dashboard
│   ├── trainer-dashboard/ # Trainer dashboard
│   ├── admin-dashboard/   # Admin dashboard
│   └── corporate-dashboard/ # Corporate dashboard
├── components/            # Reusable UI components
├── lib/                   # Utilities and data
│   ├── industry-data.ts   # Centralized data store
│   └── auth-context.tsx   # Authentication context
├── public/               # Static assets
└── styles/               # Global styles
```

## 🎨 Design System

The portal features a modern dark theme with:
- **Gradient Backgrounds**: Purple to blue color schemes
- **Glass Morphism**: Translucent card effects
- **Smooth Animations**: Hover effects and transitions
- **Responsive Layout**: Mobile-first design approach
- **Custom Icons**: Lucide React icon library

## 🚀 Deployment

The project is optimized for deployment on Vercel:

1. **Build the project**
   ```bash
   npm run build
   # or
   pnpm run build
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js and deploy
   - Your site will be live at `https://your-project.vercel.app`

3. **Configure Environment Variables**
   - Add all required environment variables in Vercel Dashboard
   - See [Environment Variables](#-environment-variables) section below

## 🔧 Customization

### Adding New Data
- Update `lib/industry-data.ts` to add new courses or partners
- Follow the existing TypeScript interfaces
- Images can be added to `public/` directory

### Styling Changes
- Modify `app/globals.css` for global styles
- Update Tailwind classes in components
- Custom animations are defined in CSS

### Authentication
- Authentication is handled by Clerk
- User roles are managed in Clerk Dashboard
- See [Clerk Production Setup](#-clerk-production-mode-setup) for configuration

---

## 🔑 Clerk Production Mode Setup

This guide will help you switch from Clerk development mode to production mode for your deployed application.

### 📋 Prerequisites

- ✅ Clerk account (sign up at [clerk.com](https://clerk.com) if needed)
- ✅ Your application deployed on Vercel (or another hosting platform)
- ✅ Access to your deployment platform's environment variables

### Step 1: Get Production Keys from Clerk Dashboard

1. **Log in to Clerk Dashboard**
   - Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
   - Sign in to your account

2. **Select or Create Production Application**
   - If you already have a production application, select it
   - If not, create a new one:
     - Click **"Create Application"**
     - Choose **"Production"** environment
     - Name it (e.g., "TekinPlant Production")

3. **Get Your API Keys**
   - Navigate to **API Keys** in the left sidebar
   - You'll see two keys:
     - **Publishable Key** (starts with `pk_live_`)
     - **Secret Key** (starts with `sk_live_`)
   - Click the copy icon next to each key
   - **Save them securely** - you'll need them in the next step

### Step 2: Configure Environment Variables

#### For Vercel Deployment

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Click **Settings** → **Environment Variables**

2. **Add Production Keys**
   - Click **"Add New"**
   - Add the following variables:

   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_...` | Production, Preview, Development |
   | `CLERK_SECRET_KEY` | `sk_live_...` | Production, Preview, Development |

3. **Important Notes**
   - ✅ Select **Production**, **Preview**, and **Development** environments
   - ✅ Make sure keys start with `pk_live_` and `sk_live_` (not `pk_test_` or `sk_test_`)
   - ✅ Click **Save** after adding each variable

4. **Redeploy Your Application**
   - Go to **Deployments** tab
   - Click the **"..."** menu on the latest deployment
   - Select **"Redeploy"**
   - Or push a new commit to trigger automatic deployment

#### For Local Development (Optional)

If you want to test production keys locally, update your `.env.local`:

```env
# Clerk Production Keys (for testing)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx

# Your Supabase keys (keep these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Note:** For local development, you can keep using development keys (`pk_test_` and `sk_test_`). Production keys are only required for your deployed application.

### Step 3: Configure Allowed URLs in Clerk Dashboard

1. **Go to Clerk Dashboard** → Your Production Application → **Settings**

2. **Configure Frontend API**
   - Scroll to **"Frontend API"** section
   - Add your production domain(s):
     ```
     https://yourdomain.com
     https://www.yourdomain.com
     ```
   - Add your Vercel preview URLs if needed:
     ```
     https://your-project.vercel.app
     https://*.vercel.app
     ```

3. **Configure Redirect URLs**
   - Go to **"Paths"** section
   - Add your production URLs:
     - **Sign-in URL**: `https://yourdomain.com/login`
     - **Sign-up URL**: `https://yourdomain.com/sign-up`
     - **After sign-in URL**: `https://yourdomain.com/redirect-dashboard`
     - **After sign-up URL**: `https://yourdomain.com/redirect-dashboard`

4. **Configure Allowed Origins** (if using OAuth)
   - Go to **"OAuth"** section
   - Add your production domain to **"Allowed Origins"**
   - Example: `https://yourdomain.com`

### Step 4: Verify Production Setup

1. **Test Sign-In**
   - Visit your production URL
   - Navigate to `/login`
   - Try signing in with a test account
   - Verify redirect to dashboard works correctly

2. **Test Sign-Up**
   - Try creating a new account
   - Verify user is created successfully
   - Check that user appears in Clerk Dashboard → **Users**

3. **Check Console Logs**
   - Open browser developer tools
   - Look for: `✅ Using Clerk Production Keys` (instead of the warning)
   - No errors should appear

4. **Verify User Sync**
   - Check that new users sync to Supabase
   - Verify user roles are set correctly

### Step 5: Verify in Clerk Dashboard

1. **Check Users**
   - Go to Clerk Dashboard → **Users**
   - Verify new users appear
   - Check user metadata is correct

2. **Check Sessions**
   - Go to **Sessions** section
   - Verify active sessions are being tracked

### 🔒 Security Best Practices

1. **Never Commit Keys to Git**
   - ✅ Keep `.env.local` in `.gitignore` (already configured)
   - ✅ Use environment variables in production
   - ❌ Never commit keys to version control

2. **Use Different Keys for Dev/Prod**
   - ✅ Keep development keys (`pk_test_`, `sk_test_`) for local development
   - ✅ Use production keys (`pk_live_`, `sk_live_`) only in production
   - ❌ Don't mix development and production keys

3. **Rotate Keys if Compromised**
   - Go to Clerk Dashboard → **API Keys**
   - Click **"Rotate"** if you suspect keys are compromised
   - Update environment variables immediately after rotation

### 🆘 Troubleshooting

#### Issue: "Invalid API key" or "Failed to load Clerk"

**Solutions:**
- ✅ Double-check you're using production keys (`pk_live_` and `sk_live_`)
- ✅ Verify keys are correctly set in Vercel environment variables
- ✅ Make sure you selected the correct environment (Production) in Vercel
- ✅ Redeploy your application after adding environment variables

#### Issue: "Redirect URL not allowed"

**Solutions:**
- ✅ Add your production domain to Clerk Dashboard → Settings → Frontend API
- ✅ Verify all URLs use `https://` (not `http://`)
- ✅ Make sure paths match exactly (case-sensitive)

#### Issue: Users not syncing to Supabase

**Solutions:**
- ✅ Check that `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel environment variables
- ✅ Verify Supabase RLS policies allow the sync
- ✅ Check server logs in Vercel for errors

#### Issue: Still seeing "Using Clerk Development Keys" warning

**Solutions:**
- ✅ Verify environment variables are set in Vercel (not just locally)
- ✅ Make sure keys start with `pk_live_` (not `pk_test_`)
- ✅ Redeploy your application after updating environment variables
- ✅ Clear browser cache and hard refresh

#### Issue: Can't sign in on production

**Solutions:**
- ✅ Check environment variables are set correctly in Vercel
- ✅ Verify Clerk middleware is working (check Vercel logs)
- ✅ Check browser console for specific errors
- ✅ Verify your domain is added to Clerk Dashboard → Settings → Frontend API

### 📝 Production Setup Checklist

Use this checklist to ensure everything is configured correctly:

- [ ] Created production application in Clerk Dashboard
- [ ] Copied production API keys (Publishable and Secret)
- [ ] Added `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to Vercel (Production environment)
- [ ] Added `CLERK_SECRET_KEY` to Vercel (Production environment)
- [ ] Configured Frontend API in Clerk Dashboard with production domain
- [ ] Configured redirect URLs in Clerk Dashboard
- [ ] Configured allowed origins (if using OAuth)
- [ ] Redeployed application on Vercel
- [ ] Tested sign-in on production URL
- [ ] Tested sign-up on production URL
- [ ] Verified users appear in Clerk Dashboard
- [ ] Verified users sync to Supabase
- [ ] Checked console for production key confirmation (no warnings)

### 🌐 Connecting GoDaddy Domain to Vercel

This guide will walk you through connecting your GoDaddy domain to your Vercel application.

### Step 1: Get Your Domain Ready

1. **Log in to GoDaddy**
   - Go to [https://www.godaddy.com](https://www.godaddy.com)
   - Sign in to your account
   - Go to **My Products** → **Domains**

2. **Select Your Domain**
   - Find the domain you want to connect
   - Click on it to open domain settings

### Step 2: Add Domain to Vercel

1. **Go to Vercel Dashboard**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your project

2. **Add Domain**
   - Go to **Settings** → **Domains**
   - Click **"Add Domain"**
   - Enter your domain (e.g., `yourdomain.com`)
   - Click **"Add"**

3. **Vercel Will Show DNS Configuration**
   - Vercel will display the DNS records you need to add
   - You'll see something like:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

### Step 3: Configure DNS in GoDaddy

1. **Go to DNS Management in GoDaddy**
   - In your domain settings, find **"DNS"** or **"Manage DNS"**
   - Click to open DNS management

2. **Add A Record (for root domain)**
   - Click **"Add"** to create a new record
   - **Type**: Select **A**
   - **Name**: Enter **@** (or leave blank, depending on GoDaddy's interface)
   - **Value**: Enter the IP address from Vercel (e.g., `76.76.21.21`)
   - **TTL**: Leave default (usually 600 seconds)
   - Click **"Save"**

3. **Add CNAME Record (for www subdomain)**
   - Click **"Add"** again
   - **Type**: Select **CNAME**
   - **Name**: Enter **www**
   - **Value**: Enter the CNAME from Vercel (e.g., `cname.vercel-dns.com`)
   - **TTL**: Leave default
   - Click **"Save"**

4. **Remove Conflicting Records (if any)**
   - If you see any existing A or CNAME records pointing elsewhere, delete them
   - Only keep the records you just added for Vercel

### Step 4: Wait for DNS Propagation

1. **DNS Propagation Time**
   - DNS changes can take **15 minutes to 48 hours** to propagate
   - Usually takes **1-2 hours** for most changes
   - You can check propagation status using [whatsmydns.net](https://www.whatsmydns.net)

2. **Verify DNS Records**
   - Use a DNS lookup tool to verify:
     - Visit [https://mxtoolbox.com/DNSLookup.aspx](https://mxtoolbox.com/DNSLookup.aspx)
     - Enter your domain
     - Check that A record points to Vercel's IP
     - Check that www CNAME points to Vercel

### Step 5: SSL Certificate (Automatic)

1. **Vercel Automatically Provisions SSL**
   - Once DNS propagates, Vercel automatically creates an SSL certificate
   - This usually takes **1-2 minutes** after DNS is correct
   - You'll see a green checkmark in Vercel Dashboard → Domains

2. **Verify SSL**
   - Visit `https://yourdomain.com`
   - You should see a padlock icon in your browser
   - The site should load with HTTPS

### Step 6: Update Clerk Configuration

**IMPORTANT:** After your domain is connected, update Clerk settings:

1. **Go to Clerk Dashboard** → Your Production Application → **Settings**

2. **Update Frontend API**
   - Go to **"Frontend API"** section
   - Add your domain:
     ```
     https://yourdomain.com
     https://www.yourdomain.com
     ```
   - Click **Save**

3. **Update Redirect URLs**
   - Go to **"Paths"** section
   - Update all URLs to use your domain:
     - Sign-in: `https://yourdomain.com/login`
     - Sign-up: `https://yourdomain.com/sign-up`
     - After sign-in: `https://yourdomain.com/redirect-dashboard`
     - After sign-up: `https://yourdomain.com/redirect-dashboard`
   - Click **Save**

4. **Update OAuth (if using social logins)**
   - Go to **"OAuth"** section
   - Add to **Allowed Origins**:
     ```
     https://yourdomain.com
     https://www.yourdomain.com
     ```
   - Click **Save**

### Step 7: Update Vercel Environment Variables

Make sure your Vercel project has production Clerk keys:

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. **Verify Production Keys**
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` should be `pk_live_...`
   - `CLERK_SECRET_KEY` should be `sk_live_...`

3. **Redeploy if Needed**
   - If you just updated environment variables, redeploy:
     - Go to **Deployments**
     - Click **"..."** on latest deployment
     - Select **"Redeploy"**

### 🆘 Troubleshooting GoDaddy Domain Connection

#### Issue: Domain not resolving after 24 hours

**Solutions:**
- ✅ Double-check DNS records in GoDaddy match Vercel's instructions exactly
- ✅ Verify there are no conflicting DNS records
- ✅ Check DNS propagation status at [whatsmydns.net](https://www.whatsmydns.net)
- ✅ Make sure you're using the correct IP address from Vercel

#### Issue: www subdomain not working

**Solutions:**
- ✅ Verify CNAME record for `www` is correctly set
- ✅ Make sure CNAME value matches Vercel's instructions exactly
- ✅ Wait for DNS propagation (can take up to 48 hours)

#### Issue: SSL certificate not provisioning

**Solutions:**
- ✅ Verify DNS records are correct and propagated
- ✅ Check Vercel Dashboard → Domains for any error messages
- ✅ Wait a few more minutes (SSL provisioning can take 5-10 minutes)
- ✅ Try removing and re-adding the domain in Vercel

#### Issue: Site loads but shows "Not Secure"

**Solutions:**
- ✅ Wait for SSL certificate to fully provision (can take 5-10 minutes)
- ✅ Clear browser cache and hard refresh (`Ctrl+Shift+R`)
- ✅ Check Vercel Dashboard → Domains to see SSL status
- ✅ Make sure you're accessing `https://` (not `http://`)

#### Issue: Clerk authentication not working on domain

**Solutions:**
- ✅ Verify domain is added in Clerk Dashboard → Settings → Frontend API
- ✅ Check all redirect URLs use `https://yourdomain.com` (not `http://`)
- ✅ Verify production keys are set in Vercel environment variables
- ✅ Clear browser cache and try again

### 📝 Quick Checklist for GoDaddy + Vercel Setup

- [ ] Domain added to Vercel Dashboard → Settings → Domains
- [ ] A record added in GoDaddy DNS pointing to Vercel IP
- [ ] CNAME record added in GoDaddy DNS for www subdomain
- [ ] Waited for DNS propagation (check with whatsmydns.net)
- [ ] SSL certificate provisioned (check Vercel Dashboard)
- [ ] Domain added to Clerk Dashboard → Settings → Frontend API
- [ ] Redirect URLs updated in Clerk Dashboard → Settings → Paths
- [ ] Production Clerk keys set in Vercel environment variables
- [ ] Site loads at `https://yourdomain.com`
- [ ] Authentication works correctly

### 🔗 Additional Resources

- [Vercel Domain Configuration Guide](https://vercel.com/docs/concepts/projects/domains)
- [GoDaddy DNS Management Help](https://www.godaddy.com/help/manage-dns-records-680)
- [DNS Propagation Checker](https://www.whatsmydns.net)
- [Clerk Production Deployment Guide](https://clerk.com/docs/deployments/overview)

---

## 📚 Additional Resources

- [Clerk Production Deployment Guide](https://clerk.com/docs/deployments/overview)
- [Clerk Environment Variables Documentation](https://clerk.com/docs/quickstarts/nextjs#add-your-api-keys)
- [Clerk Dashboard](https://dashboard.clerk.com)
- [Vercel Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel Domain Configuration](https://vercel.com/docs/concepts/projects/domains)

---

## 📦 Environment Variables

### Required Environment Variables

Your application requires the following environment variables:

#### Clerk Authentication
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...  # Production: pk_live_ | Development: pk_test_
CLERK_SECRET_KEY=sk_live_...                   # Production: sk_live_ | Development: sk_test_
```

#### Supabase Database
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Setting Up Environment Variables

1. **For Local Development**
   - Create a `.env.local` file in the project root
   - Add all required variables
   - The file is already in `.gitignore` (won't be committed)

2. **For Vercel Deployment**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add each variable
   - Select appropriate environments (Production, Preview, Development)
   - Redeploy after adding variables

## 📱 Responsive Design

The portal is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebars
- **Tablet**: Adaptive layouts with touch-friendly interactions
- **Mobile**: Streamlined navigation with mobile-first design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** for the amazing React framework
- **Tailwind CSS** for the utility-first styling
- **Lucide React** for the beautiful icons
- **Radix UI** for accessible components

---

**Built with ❤️ for the training industry**
