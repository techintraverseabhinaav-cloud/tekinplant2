"use client"

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

export default function DebugSyncPage() {
  const { user, isLoaded } = useUser()
  const [testResult, setTestResult] = useState<any>(null)
  const [isTesting, setIsTesting] = useState(false)

  const testSync = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      console.log('🧪 Testing sync...')
      
      const response = await fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      
      setTestResult({
        status: response.status,
        ok: response.ok,
        data: data,
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      setTestResult({
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sync Diagnostic Tool</h1>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Status</h2>
          <div className="space-y-2">
            <p><strong>Loaded:</strong> {isLoaded ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Authenticated:</strong> {user ? '✅ Yes' : '❌ No'}</p>
            {user && (
              <>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress || 'N/A'}</p>
                <p><strong>Name:</strong> {user.fullName || 'N/A'}</p>
                <p><strong>Role:</strong> {(user.publicMetadata?.role as string) || 'student'}</p>
              </>
            )}
          </div>
        </div>

        {/* Test Button */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Sync</h2>
          <button
            onClick={testSync}
            disabled={!user || isTesting}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isTesting ? 'Testing...' : 'Test Sync Now'}
          </button>
          {!user && (
            <p className="mt-2 text-red-600">⚠️ Please sign in first to test sync</p>
          )}
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="bg-gray-100 p-4 rounded overflow-auto">
              <pre className="text-sm">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
            
            {/* Error Analysis */}
            {testResult.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                <h3 className="font-semibold text-red-800 mb-2">Error Detected:</h3>
                <p className="text-red-700">{testResult.error}</p>
                
                {testResult.error.includes('SUPABASE_SERVICE_ROLE_KEY') && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="font-semibold text-yellow-800">💡 Fix:</p>
                    <ol className="list-decimal list-inside text-yellow-700 mt-2 space-y-1">
                      <li>Open <code className="bg-yellow-100 px-1 rounded">.env.local</code> in project root</li>
                      <li>Add: <code className="bg-yellow-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY=your_key_here</code></li>
                      <li>Get key from: Supabase Dashboard → Settings → API → Service Role Key</li>
                      <li>Restart dev server: <code className="bg-yellow-100 px-1 rounded">npm run dev</code></li>
                    </ol>
                  </div>
                )}
                
                {testResult.error.includes('clerk_id') && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="font-semibold text-yellow-800">💡 Fix:</p>
                    <ol className="list-decimal list-inside text-yellow-700 mt-2 space-y-1">
                      <li>Go to Supabase Dashboard → SQL Editor</li>
                      <li>Run: <code className="bg-yellow-100 px-1 rounded">ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;</code></li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            {testResult.ok && testResult.data?.success && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                <p className="text-green-800 font-semibold">✅ Sync successful!</p>
                <p className="text-green-700 mt-2">Check Supabase Table Editor → profiles to see your data.</p>
              </div>
            )}
          </div>
        )}

        {/* Environment Check */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables Checklist</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Check your <code className="bg-gray-100 px-1 rounded">.env.local</code> file has:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><code>NEXT_PUBLIC_SUPABASE_URL</code></li>
              <li><code>SUPABASE_SERVICE_ROLE_KEY</code> (for sync)</li>
              <li><code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code></li>
              <li><code>CLERK_SECRET_KEY</code></li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              ⚠️ After adding/changing env vars, restart your dev server!
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">How to Debug</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Open browser console (F12) and check for error messages</li>
            <li>Check terminal/command prompt for server-side errors</li>
            <li>Verify <code className="bg-blue-100 px-1 rounded">.env.local</code> has all required variables</li>
            <li>Make sure dev server was restarted after adding env vars</li>
            <li>Check Supabase SQL Editor - run <code className="bg-blue-100 px-1 rounded">supabase/migrate-clerk-support.sql</code></li>
            <li>Verify <code className="bg-blue-100 px-1 rounded">profiles</code> table exists in Supabase</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

