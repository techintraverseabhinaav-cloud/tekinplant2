"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { SignIn, SignUp } from "@clerk/nextjs"
import SyncUserToSupabase from "../../../components/SyncUserToSupabase"
import { Shield, Users, Target } from 'lucide-react'

export default function AdminLoginPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)

  // Set admin role in localStorage for sign-up
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('signup_role', 'admin')
    }
  }, [])

  useEffect(() => {
    // If user is already logged in, check role and redirect
    if (isLoaded && user) {
      async function checkRoleAndRedirect() {
        // Priority: 1. Clerk metadata, 2. Supabase profile
        let userRole = (user?.publicMetadata?.role as string) || null
        
        // If no role in Clerk metadata, fetch from Supabase
        if (!userRole) {
          try {
            const response = await fetch(`/api/get-user-role?userId=${user.id}`)
            if (response.ok) {
              const data = await response.json()
              userRole = data.role
            }
          } catch (error) {
            console.error('Error fetching role from Supabase:', error)
          }
        }
        
        // If still no role, wait a bit more (might be syncing)
        if (!userRole) {
          console.log('⏳ Role not found, waiting for sync...')
          setTimeout(() => {
            const finalRole = (user?.publicMetadata?.role as string) || null
            if (finalRole === 'admin') {
              router.push('/admin-dashboard')
            } else if (finalRole) {
              const dashboardRoutes: Record<string, string> = {
                student: '/student-dashboard',
                admin: '/admin-dashboard'
              }
              router.push(dashboardRoutes[finalRole] || '/student-dashboard')
            }
          }, 2000)
          return
        }
        
        // Redirect based on role
        if (userRole === 'admin') {
          console.log('✅ Admin role confirmed, redirecting to admin dashboard')
          router.push('/admin-dashboard')
        } else {
          console.log(`⚠️ User is not admin (role: ${userRole}), redirecting to their dashboard`)
          const dashboardRoutes: Record<string, string> = {
            student: '/student-dashboard',
            admin: '/admin-dashboard'
          }
          router.push(dashboardRoutes[userRole] || '/student-dashboard')
        }
      }
      
      checkRoleAndRedirect()
    }
  }, [user, isLoaded, router])

  // IntersectionObserver for animations - must be called before conditional returns
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('slide-up')) {
            entry.target.classList.add('slide-up-visible')
          }
        }
      })
    }, { threshold: 0.1 })
    
    const elements = document.querySelectorAll('.slide-up')
    elements.forEach(el => observer.observe(el))
    
    return () => observer.disconnect()
  }, [])

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

  // Show admin login page
  return (
    <div className="min-h-screen relative flex" style={{ backgroundColor: '#000000' }}>
      {/* Background Gradient */}
      <div className="absolute inset-0 backdrop-blur-[1px]" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #000000 100%)' }}></div>
      
      {/* Left Side - Branding & Illustration */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <div className="slide-up inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 backdrop-blur-sm border border-red-500/20" style={{ backgroundColor: 'rgba(239,68,68,0.08)', transitionDelay: '0.1s' }}>
              <Shield className="w-4 h-4" style={{ color: '#ef4444' }} />
              <span className="text-sm font-medium text-white/80">Admin Portal</span>
            </div>
            <h1 className="slide-up text-5xl font-normal mb-4" style={{ transitionDelay: '0.2s' }}>
              <span className="text-white" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>{isSignUp ? 'Sign Up for' : 'Sign In to'}</span> <span className="bg-gradient-to-r from-red-400 via-red-300 to-red-400 bg-clip-text text-transparent" style={{ textShadow: '0 0 30px rgba(239,68,68,0.5), 0 0 60px rgba(239,68,68,0.3)' }}>TEKINPLANT</span>
            </h1>
            <p className="slide-up text-xl text-white/70 font-light" style={{ transitionDelay: '0.3s' }}>{isSignUp ? 'Create Your Admin Account' : 'Admin Access Only'}</p>
          </div>
          
          <div className="space-y-6">
            <div className="slide-up flex items-center gap-4 rounded-xl p-4 backdrop-blur-xl border border-red-500/20 transition-all duration-300" style={{ backgroundColor: 'rgba(239,68,68,0.08)', transitionDelay: '0.4s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px rgba(239,68,68,0.4), 0 0 30px rgba(239,68,68,0.2)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm border border-red-500/20" style={{ backgroundColor: 'rgba(239,68,68,0.12)' }}>
                <Shield className="w-6 h-6" style={{ color: '#ef4444' }} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Secure Access</h3>
                <p className="text-white/70 text-sm">Admin-only authentication</p>
              </div>
            </div>
            <div className="slide-up flex items-center gap-4 rounded-xl p-4 backdrop-blur-xl border border-red-500/20 transition-all duration-300" style={{ backgroundColor: 'rgba(239,68,68,0.08)', transitionDelay: '0.5s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px rgba(239,68,68,0.4), 0 0 30px rgba(239,68,68,0.2)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm border border-red-500/20" style={{ backgroundColor: 'rgba(239,68,68,0.12)' }}>
                <Users className="w-6 h-6" style={{ color: '#ef4444' }} />
              </div>
              <div>
                <h3 className="font-semibold text-white">System Management</h3>
                <p className="text-white/70 text-sm">Full platform control</p>
              </div>
            </div>
            <div className="slide-up flex items-center gap-4 rounded-xl p-4 backdrop-blur-xl border border-red-500/20 transition-all duration-300" style={{ backgroundColor: 'rgba(239,68,68,0.08)', transitionDelay: '0.6s' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 15px rgba(239,68,68,0.4), 0 0 30px rgba(239,68,68,0.2)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm border border-red-500/20" style={{ backgroundColor: 'rgba(239,68,68,0.12)' }}>
                <Target className="w-6 h-6" style={{ color: '#ef4444' }} />
              </div>
              <div>
                <h3 className="font-semibold text-white">Protected Area</h3>
                <p className="text-white/70 text-sm">Authorized personnel only</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(220,38,38,0.1)' }}></div>
      </div>

      {/* Right Side - Clerk Sign In */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 relative z-10">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo for mobile */}
          <div className="slide-up lg:hidden mb-8 text-center" style={{ transitionDelay: '0.1s' }}>
            <h1 className="text-4xl font-normal mb-2">
              <span className="text-white" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>{isSignUp ? 'Sign Up for' : 'Sign In to'}</span> <span className="bg-gradient-to-r from-red-400 via-red-300 to-red-400 bg-clip-text text-transparent" style={{ textShadow: '0 0 30px rgba(239,68,68,0.5), 0 0 60px rgba(239,68,68,0.3)' }}>TEKINPLANT</span>
            </h1>
            <p className="text-white/70 text-sm">{isSignUp ? 'Create Your Admin Account' : 'Admin Portal'}</p>
          </div>

          {/* Auto-sync user to Supabase after sign-in/sign-up */}
          <SyncUserToSupabase />

          {/* Clerk Sign In/Sign Up Component */}
          <div className="slide-up flex flex-col items-center" style={{ transitionDelay: '0.7s' }}>
            {isSignUp ? (
              <>
                <SignUp 
                  appearance={{
                    elements: {
                      rootBox: "mx-auto w-full",
                      card: "rounded-2xl backdrop-blur-xl border shadow-2xl",
                      headerTitle: "text-2xl font-normal text-white",
                      headerSubtitle: "text-white/70",
                      socialButtonsBlockButton: "rounded-xl border transition-all duration-300",
                      formButtonPrimary: "rounded-xl transition-all duration-300 hover:opacity-90 backdrop-blur-sm border border-red-400/40",
                      footerActionLink: "transition-colors duration-200",
                      formFieldInput: "rounded-xl backdrop-blur-sm border transition-all duration-300",
                      formFieldLabel: "text-white/80 font-medium",
                      formFieldInputShowPasswordButton: "text-white/70 hover:text-white",
                      formResendCodeLink: "transition-colors duration-200",
                      identityPreviewEditButton: "text-white/70 hover:text-white",
                      formFieldSuccessText: "text-green-400",
                      formFieldErrorText: "text-red-400",
                      alertText: "text-white/70",
                      footer: "border-t",
                      dividerLine: "bg-white/10",
                      dividerText: "text-white/70",
                    },
                    variables: {
                      colorBackground: 'rgba(239,68,68,0.08)',
                      colorInputBackground: 'rgba(239,68,68,0.08)',
                      colorInputText: '#ffffff',
                      colorText: '#ffffff',
                      colorTextSecondary: 'rgba(255,255,255,0.7)',
                      colorPrimary: '#ef4444',
                      colorDanger: '#ef4444',
                      colorSuccess: '#10b981',
                      borderRadius: '0.75rem',
                      fontFamily: 'Inter, system-ui, sans-serif',
                    },
                  }}
                  routing="path"
                  path="/admin"
                  signInUrl="/admin"
                  afterSignUpUrl="/admin-dashboard"
                />
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                  >
                    Already have an account? <span className="text-red-400 hover:text-red-300 font-medium">Sign in</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <SignIn 
                  appearance={{
                    elements: {
                      rootBox: "mx-auto w-full",
                      card: "rounded-2xl backdrop-blur-xl border shadow-2xl",
                      headerTitle: "text-2xl font-normal text-white",
                      headerSubtitle: "text-white/70",
                      socialButtonsBlockButton: "rounded-xl border transition-all duration-300",
                      formButtonPrimary: "rounded-xl transition-all duration-300 hover:opacity-90 backdrop-blur-sm border border-red-400/40",
                      footerActionLink: "transition-colors duration-200",
                      formFieldInput: "rounded-xl backdrop-blur-sm border transition-all duration-300",
                      formFieldLabel: "text-white/80 font-medium",
                      formFieldInputShowPasswordButton: "text-white/70 hover:text-white",
                      formResendCodeLink: "transition-colors duration-200",
                      identityPreviewEditButton: "text-white/70 hover:text-white",
                      formFieldSuccessText: "text-green-400",
                      formFieldErrorText: "text-red-400",
                      alertText: "text-white/70",
                      footer: "border-t",
                      dividerLine: "bg-white/10",
                      dividerText: "text-white/70",
                    },
                    variables: {
                      colorBackground: 'rgba(239,68,68,0.08)',
                      colorInputBackground: 'rgba(239,68,68,0.08)',
                      colorInputText: '#ffffff',
                      colorText: '#ffffff',
                      colorTextSecondary: 'rgba(255,255,255,0.7)',
                      colorPrimary: '#ef4444',
                      colorDanger: '#ef4444',
                      colorSuccess: '#10b981',
                      borderRadius: '0.75rem',
                      fontFamily: 'Inter, system-ui, sans-serif',
                    },
                  }}
                  routing="path"
                  path="/admin"
                  signUpUrl="/admin"
                  afterSignInUrl="/admin-dashboard"
                />
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setIsSignUp(true)}
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                  >
                    Don't have an account? <span className="text-red-400 hover:text-red-300 font-medium">Sign up</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

