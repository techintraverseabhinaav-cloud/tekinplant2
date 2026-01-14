"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { SignIn, SignUp } from "@clerk/nextjs"
import SyncUserToSupabase from "../../components/SyncUserToSupabase"

export default function TrainerLoginPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)

  // Set trainer role in localStorage for sign-up
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('signup_role', 'trainer')
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

  // Show trainer login page
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding & Illustration */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-green-600 via-teal-600 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-4">TekinPlant</h1>
            <p className="text-xl text-white/90 font-light">Trainer Portal</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Teach & Train</h3>
                <p className="text-white/80 text-sm">Share your expertise</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Manage Courses</h3>
                <p className="text-white/80 text-sm">Create and manage training programs</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Track Progress</h3>
                <p className="text-white/80 text-sm">Monitor student performance</p>
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Trainer Portal
            </h1>
          </div>

          {/* Info message */}
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-green-800 mb-1">Trainer Access</p>
            <p className="text-xs text-green-600">Sign up or sign in to access the trainer dashboard.</p>
          </div>

          {/* Toggle between Sign In and Sign Up */}
          <div className="mb-6 flex gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isSignUp
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isSignUp
                  ? 'bg-white text-green-600 shadow-sm'
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
                    formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white",
                    footerActionLink: "text-green-600 hover:text-green-700",
                    formFieldInput: "border-gray-300 focus:border-green-500 focus:ring-green-500",
                    formFieldLabel: "text-gray-700 font-semibold",
                  },
                }}
                routing="path"
                path="/trainer"
                signInUrl="/trainer"
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
                    formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white",
                    footerActionLink: "text-green-600 hover:text-green-700",
                    formFieldInput: "border-gray-300 focus:border-green-500 focus:ring-green-500",
                    formFieldLabel: "text-gray-700 font-semibold",
                  },
                }}
                routing="path"
                path="/trainer"
                signUpUrl="/trainer"
                afterSignInUrl="/student-dashboard"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

