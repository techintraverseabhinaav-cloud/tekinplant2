/**
 * Clerk Helper Functions
 * 
 * Use these utilities to work with Clerk authentication in your components
 */

import { useEffect } from 'react'
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
  const role = (user?.publicMetadata?.role) || 'student'
  
  return {
    user,
    role: role, // Default to student if no role
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
    trainer: '/trainer-dashboard',
    admin: '/admin-dashboard',
    corporate: '/corporate-dashboard',
  }
  
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
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (requiredRole && role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        const dashboardRoute = getUserDashboardRoute(role)
        router.push(dashboardRoute)
      }
    }
  }, [user, isLoading, requiredRole, role, isAuthenticated, router])

  return { user, role, isLoading, isAuthenticated }
}

