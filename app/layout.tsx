import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from '@clerk/nextjs'
import SyncUserToSupabase from '../components/SyncUserToSupabase'
import { ClerkErrorBoundary } from '../components/ClerkErrorBoundary'
import { ThemeProvider } from '../components/theme-provider'

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.backgroundColor = '#000000';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.backgroundColor = '#fef3e2';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ClerkErrorBoundary>
          <ClerkProvider
            publishableKey={publishableKey}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <SyncUserToSupabase />
              {children}
            </ThemeProvider>
          </ClerkProvider>
        </ClerkErrorBoundary>
      </body>
    </html>
  )
}

