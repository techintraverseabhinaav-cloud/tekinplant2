import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from '@clerk/nextjs'
import SyncUserToSupabase from '../components/SyncUserToSupabase'
import { ClerkErrorBoundary } from '../components/ClerkErrorBoundary'
import { ThemeProvider } from '../components/theme-provider'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TekinPlant - Industry Training Portal",
  description: "Connect with leading companies, master cutting-edge technologies, and accelerate your professional growth with our comprehensive training programs.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Explicitly use production keys from environment variables
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  
  if (!publishableKey) {
    console.error('⚠️ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set')
  } else if (publishableKey.startsWith('pk_live_')) {
    console.log('✅ Using Clerk Production Keys')
  } else if (publishableKey.startsWith('pk_test_')) {
    console.warn('⚠️ Using Clerk Development Keys - Switch to production keys for production mode')
  }

  // Only render ClerkProvider if we have a valid key
  if (!publishableKey) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
          <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Configuration Error</h1>
              <p className="text-gray-400">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set</p>
              <p className="text-sm text-gray-500 mt-2">Please check your .env.local file</p>
            </div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          id="theme-script"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Check local storage first, then system preference
                  var savedTheme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme;
                  
                  if (savedTheme === 'system' || !savedTheme) {
                    theme = prefersDark ? 'dark' : 'light';
                  } else {
                    theme = savedTheme; // 'dark' or 'light'
                  }
                  
                  // Apply the theme to the document element immediately
                  var html = document.documentElement;
                  html.setAttribute('data-theme', theme);
                  html.className = theme;
                  
                  // Set background colors immediately to prevent flash
                  if (theme === 'dark') {
                    html.style.setProperty('background-color', '#000000', 'important');
                  } else {
                    html.style.setProperty('background-color', '#f5f1e8', 'important');
                  }
                  
                  // Apply body class when body is available (CSS-based, no inline styles)
                  function applyBodyClass() {
                    var body = document.body;
                    if (body) {
                      // Remove both classes first to avoid conflicts
                      body.classList.remove('darkbody', 'lightbody');
                      // Add the appropriate class based on theme
                      if (theme === 'dark') {
                        body.classList.add('darkbody');
                      } else {
                        body.classList.add('lightbody');
                      }
                      html.setAttribute('data-theme-initialized', 'true');
                    }
                  }
                  
                  // Try to apply immediately if body exists
                  if (document.body) {
                    applyBodyClass();
                  } else {
                    // Use MutationObserver to catch body when it's added
                    var observer = new MutationObserver(function(mutations) {
                      if (document.body) {
                        applyBodyClass();
                        observer.disconnect();
                      }
                    });
                    observer.observe(document.documentElement, { childList: true, subtree: true });
                  }
                } catch (e) {
                  // Fallback to dark theme on error
                  var html = document.documentElement;
                  html.className = 'dark';
                  html.setAttribute('data-theme', 'dark');
                  html.style.setProperty('background-color', '#000000', 'important');
                  // Apply body class if body exists
                  if (document.body) {
                    document.body.classList.remove('lightbody');
                    document.body.classList.add('darkbody');
                  }
                }
              })();
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html { 
                background-color: #000000 !important; 
              }
              html[data-theme="light"] { 
                background-color: #f5f1e8 !important; 
              }
              /* Default body styles (dark mode) */
              body { 
                background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%) !important;
                color: #ffffff !important;
                transition: none !important;
                opacity: 1 !important;
              }
              /* Light mode via data-theme attribute */
              html[data-theme="light"] body {
                background: linear-gradient(135deg, #f5f1e8 0%, #e8ddd4 50%, #d4c4b0 100%) !important;
                color: #3a2e1f !important;
              }
              /* Light mode via body class (CSS-based, preferred) */
              body.lightbody {
                background: linear-gradient(135deg, #f5f1e8 0%, #e8ddd4 50%, #d4c4b0 100%) !important;
                color: #3a2e1f !important;
              }
              /* Dark mode via body class (CSS-based, preferred) */
              body.darkbody {
                background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%) !important;
                color: #ffffff !important;
              }
              /* Re-enable transitions after initialization */
              html[data-theme-initialized] body {
                transition: background-color 0.3s ease, color 0.3s ease, background 0.3s ease !important;
              }
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClerkErrorBoundary>
          <ClerkProvider
            publishableKey={publishableKey}
            domain={typeof window !== 'undefined' ? window.location.hostname : undefined}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
              storageKey="theme"
            >
              <SyncUserToSupabase />
              <Toaster 
                position="top-right"
                richColors
                closeButton
                toastOptions={{
                  classNames: {
                    toast: 'theme-toast',
                    title: 'theme-toast-title',
                    description: 'theme-toast-description',
                    success: 'theme-toast-success',
                    error: 'theme-toast-error',
                    info: 'theme-toast-info',
                    warning: 'theme-toast-warning',
                  },
                }}
              />
              {children}
            </ThemeProvider>
          </ClerkProvider>
        </ClerkErrorBoundary>
      </body>
    </html>
  )
}

