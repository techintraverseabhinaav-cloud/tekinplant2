"use client"

import { useEffect, useRef, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'

/**
 * Component that automatically syncs Clerk user to Supabase
 * Add this to pages that need user sync (login, sign-up, dashboards)
 */
export default function SyncUserToSupabase() {
  const { user, isLoaded } = useUser()
  const hasSyncedRef = useRef<string | null>(null)

  const syncUser = useCallback(async () => {
    if (!user?.id) return
    
    // Don't sync if we already synced this user
    if (hasSyncedRef.current === user.id) {
      return
    }

    try {
      console.log('🔄 Syncing user to Supabase...', user.id)
      
      // Priority: 1. Clerk metadata (already set), 2. Supabase profile (fetch if needed), 3. localStorage (only for new sign-ups)
      let roleToSend = (user.publicMetadata?.role as string) || null
      
      // If no role in Clerk metadata, try to fetch from Supabase
      if (!roleToSend) {
        try {
          const profileResponse = await fetch(`/api/get-user-role?userId=${user.id}`)
          if (profileResponse.ok) {
            const profileData = await profileResponse.json()
            roleToSend = profileData.role
            console.log('📋 Role fetched from Supabase:', roleToSend)
          }
        } catch (error) {
          console.warn('⚠️ Could not fetch role from Supabase:', error)
        }
      }
      
      // Only use localStorage if this is a new sign-up (no role in Clerk or Supabase)
      if (!roleToSend && typeof window !== 'undefined') {
        const selectedRole = localStorage.getItem('signup_role')
        if (selectedRole) {
          roleToSend = selectedRole
          console.log('📝 Using role from localStorage (new sign-up):', roleToSend)
          // Clear localStorage after using it to prevent future overwrites
          localStorage.removeItem('signup_role')
        }
      }
      
      // Default to student if still no role
      roleToSend = roleToSend || 'student'
      
      console.log('🔑 Role determination:', {
        clerkMetadata: user.publicMetadata?.role,
        finalRole: roleToSend
      })
      
      // Send user data in request body
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          fullName: user.fullName,
          firstName: user.firstName,
          lastName: user.lastName,
          role: roleToSend, // This will be saved to Supabase
          avatarUrl: user.imageUrl
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('❌ Sync failed:', errorData)
        console.error('❌ Response status:', response.status)
        console.error('❌ Full error:', JSON.stringify(errorData, null, 2))
        
        // Show helpful error message
        if (errorData.error?.includes('SUPABASE_SERVICE_ROLE_KEY')) {
          console.error('💡 Fix: Add SUPABASE_SERVICE_ROLE_KEY to .env.local')
          console.error('💡 Get it from: Supabase Dashboard → Settings → API → Service Role Key')
          console.error('💡 Then restart dev server: npm run dev')
        }
        if (errorData.error?.includes('clerk_id')) {
          console.error('💡 Fix: Run migrate-clerk-support.sql in Supabase SQL Editor')
        }
        if (errorData.error?.includes('NEXT_PUBLIC_SUPABASE_URL')) {
          console.error('💡 Fix: Add NEXT_PUBLIC_SUPABASE_URL to .env.local')
        }
        if (errorData.details) {
          console.error('💡 Error details:', errorData.details)
        }
        return
      }

      const result = await response.json()
      console.log('✅ User synced to Supabase successfully:', result)
      hasSyncedRef.current = user.id
    } catch (error: any) {
      console.error('❌ Error syncing user to Supabase:', error)
      console.error('❌ Error message:', error?.message)
      console.error('❌ Error stack:', error?.stack)
      
      // Show user-friendly error
      if (error?.message?.includes('fetch')) {
        console.error('💡 Network error - check if dev server is running')
      }
    }
  }, [user])

  useEffect(() => {
    if (isLoaded && user?.id) {
      syncUser()
    }
  }, [isLoaded, user?.id, syncUser])

  // This component doesn't render anything
  return null
}
