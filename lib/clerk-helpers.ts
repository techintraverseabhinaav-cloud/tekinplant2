/**
 * Clerk Helper Functions
 * 
 * Use these utilities to work with Clerk authentication in your components
 */

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

/**
 * Get current user with role information
 * 
 * Usage:
 * ```tsx
 * const { user, role, isLoading } = useUserWithRole()
 * ```
 */
export function useUserWithRole() {
  const { user, isLoaded } = useUser()
  const [role, setRole] = useState<string | undefined>(user?.publicMetadata?.role as string | undefined)
  const [hasFetchedRole, setHasFetchedRole] = useState(false)
  
  // Update role from Clerk metadata when it changes
  useEffect(() => {
    if (user?.publicMetadata?.role) {
      setRole(user.publicMetadata.role as string)
    }
  }, [user?.publicMetadata?.role])
  
  // Fetch role from Supabase if not in Clerk metadata (only once)
  useEffect(() => {
    if (isLoaded && user && !role && !hasFetchedRole) {
      setHasFetchedRole(true)
      async function fetchRoleFromSupabase() {
        try {
          const response = await fetch(`/api/get-user-role?userId=${user.id}`)
          if (response.ok) {
            const data = await response.json()
            if (data.role) {
              setRole(data.role)
            }
          }
        } catch (error) {
          console.error('Error fetching role from Supabase:', error)
        }
      }
      fetchRoleFromSupabase()
    }
  }, [user, isLoaded, role, hasFetchedRole])
  
  return {
    user,
    role: role, // undefined if not set yet
    isLoading: !isLoaded,
    isAuthenticated: !!user,
  }
}

/**
 * Check if user has a specific role
 * 
 * Usage:
 * ```tsx
 * const isAdmin = useHasRole('admin')
 * ```
 */
export function useHasRole(requiredRole: string) {
  const { role } = useUserWithRole()
  return role === requiredRole
}

/**
 * Get user dashboard route based on role
 * 
 * Usage:
 * ```tsx
 * const dashboardRoute = getUserDashboardRoute(role)
 * router.push(dashboardRoute)
 * ```
 */
export function getUserDashboardRoute(role?: string): string {
  const routes: Record<string, string> = {
    student: '/student-dashboard',
    admin: '/admin-dashboard',
  }
  
  // Redirect trainer and corporate users to student dashboard
  return routes[role || 'student'] || '/student-dashboard'
}

/**
 * Protected route hook - redirects if not authenticated or wrong role
 * 
 * Usage:
 * ```tsx
 * export default function StudentDashboard() {
 *   const { user, isLoading } = useProtectedRoute('student')
 *   // Component only renders if user is authenticated and has 'student' role
 * }
 * ```
 */
export function useProtectedRoute(requiredRole?: string) {
  const { user, role, isLoading, isAuthenticated } = useUserWithRole()
  const router = useRouter()

  useEffect(() => {
    // Wait for user to be loaded before making any decisions
    if (!isLoading && user) {
      if (!isAuthenticated) {
        console.log('🔒 Not authenticated, redirecting to login')
        router.push('/login')
        return
      }
      
      // If role is required, check it
      if (requiredRole) {
        // If role is still undefined, wait a bit more (might be loading from Supabase)
        if (role === undefined) {
          console.log('⏳ Role not yet loaded, waiting...')
          // Give it a moment to load from Supabase if needed
          const timeout = setTimeout(() => {
            // Check again after a short delay
            const currentRole = user?.publicMetadata?.role as string | undefined
            if (currentRole && currentRole !== requiredRole) {
              console.log(`❌ Role mismatch: expected ${requiredRole}, got ${currentRole}, redirecting`)
              const dashboardRoute = getUserDashboardRoute(currentRole)
              router.push(dashboardRoute)
            } else if (!currentRole) {
              // Still no role, default to student dashboard
              console.log('⚠️ No role found, redirecting to student dashboard')
              router.push('/student-dashboard')
            }
          }, 1000)
          return () => clearTimeout(timeout)
        }
        
        // Role is loaded, check if it matches
        if (role !== requiredRole) {
          console.log(`❌ Role mismatch: expected ${requiredRole}, got ${role}, redirecting`)
          const dashboardRoute = getUserDashboardRoute(role || 'student')
          router.push(dashboardRoute)
        } else {
          console.log(`✅ Role check passed: ${role} matches ${requiredRole}`)
        }
      }
    }
  }, [user, isLoading, requiredRole, role, isAuthenticated, router])

  return { user, role, isLoading, isAuthenticated }
}

