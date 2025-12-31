"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

export default function RedirectDashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded || !user?.id) return

    async function redirectToDashboard() {
      // Priority: 1. Clerk metadata, 2. Supabase profile, 3. localStorage (only for new sign-ups)
      let role = (user?.publicMetadata?.role as string) || null
      
      console.log('🔄 Redirecting dashboard - initial role from Clerk:', role)
      
      // If no role in Clerk metadata, fetch from Supabase
      if (!role) {
        try {
          console.log('📡 Fetching role from Supabase...')
          const response = await fetch(`/api/get-user-role?userId=${user.id}`)
          if (response.ok) {
            const data = await response.json()
            role = data.role
            console.log('✅ Role from Supabase:', role)
          } else {
            console.log('⚠️ Failed to fetch role from Supabase, status:', response.status)
          }
        } catch (error) {
          console.error('❌ Error fetching role from Supabase:', error)
        }
      }
      
      // Only use localStorage as last resort (for new sign-ups)
      if (!role && typeof window !== 'undefined') {
        const storedRole = localStorage.getItem('signup_role')
        if (storedRole) {
          role = storedRole
          console.log('📝 Using role from localStorage:', role)
          // Clear it after use to prevent future issues
          localStorage.removeItem('signup_role')
        }
      }
      
      // If still no role, wait a bit for sync (especially for admin)
      if (!role) {
        console.log('⏳ Role not found, waiting for sync...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Try again after wait
        const retryRole = (user?.publicMetadata?.role as string) || null
        if (retryRole) {
          role = retryRole
          console.log('✅ Role found after wait:', role)
        } else {
          // Try Supabase one more time
          try {
            const response = await fetch(`/api/get-user-role?userId=${user.id}`)
            if (response.ok) {
              const data = await response.json()
              role = data.role
              console.log('✅ Role from Supabase (retry):', role)
            }
          } catch (error) {
            console.error('❌ Error fetching role from Supabase (retry):', error)
          }
        }
      }
      
      // Default to student only if we've exhausted all options
      role = role || 'student'
      console.log('🎯 Final role for redirect:', role)

      // Redirect to appropriate dashboard
      const dashboardRoutes: Record<string, string> = {
        student: '/student-dashboard',
        admin: '/admin-dashboard'
      }

      const dashboardRoute = dashboardRoutes[role] || '/student-dashboard'
      console.log('🚀 Redirecting to:', dashboardRoute)
      router.push(dashboardRoute)
    }

    redirectToDashboard()
  }, [user, isLoaded, router])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Redirecting to your dashboard...</div>
    </div>
  )
}

