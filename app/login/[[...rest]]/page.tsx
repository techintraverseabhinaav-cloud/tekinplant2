"use client"

import { SignIn } from '@clerk/nextjs'
import SyncUserToSupabase from '../../../components/SyncUserToSupabase'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding & Illustration */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <h1 className="text-4xl font-bold mb-4">TekinPlant</h1>
            <p className="text-xl text-white/90 font-light">Empowering Your Learning Journey</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Industry-Leading Courses</h3>
                <p className="text-white/80 text-sm">Learn from top companies</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Expert Trainers</h3>
                <p className="text-white/80 text-sm">Learn from industry professionals</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Certified Programs</h3>
                <p className="text-white/80 text-sm">Get recognized certificates</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Clerk Sign In */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo for mobile */}
          <div className="lg:hidden mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TRAININ
            </h1>
          </div>

          {/* Auto-sync user to Supabase after sign-in */}
          <SyncUserToSupabase />

          {/* Clerk Sign In Component */}
          <div className="flex justify-center">
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-xl",
                  headerTitle: "text-2xl font-bold text-gray-900",
                  headerSubtitle: "text-gray-600",
                  socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50",
                  formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white",
                  footerActionLink: "text-indigo-600 hover:text-indigo-700",
                  formFieldInput: "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
                  formFieldLabel: "text-gray-700 font-semibold",
                },
              }}
              routing="path"
              path="/login"
              signUpUrl="/sign-up"
              afterSignInUrl="/student-dashboard"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
