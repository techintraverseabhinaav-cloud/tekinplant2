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
      
      // Prefer role from Clerk metadata, fallback to locally selected role (sign-up)
      const selectedRole = typeof window !== 'undefined' ? localStorage.getItem('signup_role') : null
      const roleToSend = (user.publicMetadata?.role as string) || selectedRole || 'student'
      
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
          role: roleToSend,
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
