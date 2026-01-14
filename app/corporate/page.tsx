"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { SignIn, SignUp } from "@clerk/nextjs"
import SyncUserToSupabase from "../../components/SyncUserToSupabase"

export default function CorporateLoginPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)

  // Set corporate role in localStorage for sign-up
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('signup_role', 'corporate')
    }
  }, [])

  useEffect(() => {
    // If user is already logged in, redirect to appropriate dashboard
    if (isLoaded && user) {
      const userRole = (user?.publicMetadata?.role) || 'student'
      const dashboardRoutes: Record<string, string> = {
        student: '/student-dashboard',
        admin: '/admin-dashboard'
      }
      router.push(dashboardRoutes[userRole] || '/student-dashboard')
    }
  }, [user, isLoaded, router])

  // Show loading while checking auth status
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  // If user is already logged in, the useEffect will handle redirect
  if (user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Redirecting...</div>
      </div>
    )
  }

  // Show corporate login page
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding & Illustration */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-4">TekinPlant</h1>
            <p className="text-xl text-white/90 font-light">Corporate Portal</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Enterprise Solutions</h3>
                <p className="text-white/80 text-sm">Corporate training programs</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Team Management</h3>
                <p className="text-white/80 text-sm">Manage employee training</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Analytics & Reports</h3>
                <p className="text-white/80 text-sm">Track training progress</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Clerk Sign In/Sign Up */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo for mobile */}
          <div className="lg:hidden mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Corporate Portal
            </h1>
          </div>

          {/* Info message */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-800 mb-1">Corporate Access</p>
            <p className="text-xs text-blue-600">Sign up or sign in to access the corporate dashboard.</p>
          </div>

          {/* Toggle between Sign In and Sign Up */}
          <div className="mb-6 flex gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isSignUp
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isSignUp
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Auto-sync user to Supabase after sign-in/sign-up */}
          <SyncUserToSupabase />

          {/* Clerk Sign In/Sign Up Component */}
          <div className="flex justify-center">
            {isSignUp ? (
              <SignUp 
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "shadow-xl",
                    headerTitle: "text-2xl font-bold text-gray-900",
                    headerSubtitle: "text-gray-600",
                    socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50",
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                    footerActionLink: "text-blue-600 hover:text-blue-700",
                    formFieldInput: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                    formFieldLabel: "text-gray-700 font-semibold",
                  },
                }}
                routing="path"
                path="/corporate"
                signInUrl="/corporate"
                afterSignUpUrl="/student-dashboard"
              />
            ) : (
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "mx-auto",
                    card: "shadow-xl",
                    headerTitle: "text-2xl font-bold text-gray-900",
                    headerSubtitle: "text-gray-600",
                    socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50",
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                    footerActionLink: "text-blue-600 hover:text-blue-700",
                    formFieldInput: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                    formFieldLabel: "text-gray-700 font-semibold",
                  },
                }}
                routing="path"
                path="/corporate"
                signUpUrl="/corporate"
                afterSignInUrl="/student-dashboard"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

