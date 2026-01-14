"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function TestSupabasePage() {
  const [tests, setTests] = useState({
    connection: { status: "pending", message: "Testing..." },
    auth: { status: "pending", message: "Testing..." },
    database: { status: "pending", message: "Testing..." },
    tables: { status: "pending", message: "Testing..." }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    runTests()
  }, [])

  const runTests = async () => {
    setIsLoading(true)
    const supabase = createClient()

    // Test 1: Connection
    try {
      const { data, error } = await supabase.from("profiles").select("count").limit(1)
      if (error && error.code !== "PGRST116") {
        // PGRST116 means table doesn't exist, which is okay for connection test
        throw error
      }
      setTests(prev => ({
        ...prev,
        connection: { status: "success", message: "Connected to Supabase!" }
      }))
    } catch (error: any) {
      setTests(prev => ({
        ...prev,
        connection: { 
          status: "error", 
          message: `Connection failed: ${error.message || "Check your .env.local file"}` 
        }
      }))
      setIsLoading(false)
      return
    }

    // Test 2: Authentication
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setTests(prev => ({
        ...prev,
        auth: { 
          status: "success", 
          message: user ? `Logged in as: ${user.email}` : "Auth system ready (not logged in)" 
        }
      }))
    } catch (error: any) {
      setTests(prev => ({
        ...prev,
        auth: { status: "error", message: `Auth error: ${error.message}` }
      }))
    }

    // Test 3: Database Access
    try {
      const { data, error } = await supabase.from("courses").select("id").limit(1)
      if (error) throw error
      setTests(prev => ({
        ...prev,
        database: { status: "success", message: "Database access working!" }
      }))
    } catch (error: any) {
      setTests(prev => ({
        ...prev,
        database: { 
          status: "error", 
          message: `Database error: ${error.message}. Make sure you ran the schema.sql` 
        }
      }))
    }

    // Test 4: Check Tables
    try {
      const tables = ["profiles", "companies", "courses", "enrollments"]
      const existingTables: string[] = []
      
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select("id").limit(1)
          if (!error) {
            existingTables.push(table)
          }
        } catch {
          // Table doesn't exist or not accessible
        }
      }

      if (existingTables.length > 0) {
        setTests(prev => ({
          ...prev,
          tables: { 
            status: "success", 
            message: `Found ${existingTables.length} tables: ${existingTables.join(", ")}` 
          }
        }))
      } else {
        setTests(prev => ({
          ...prev,
          tables: { 
            status: "error", 
            message: "No tables found. Run schema.sql in Supabase SQL Editor" 
          }
        }))
      }
    } catch (error: any) {
      setTests(prev => ({
        ...prev,
        tables: { status: "error", message: `Error checking tables: ${error.message}` }
      }))
    }

    setIsLoading(false)
  }

  const getStatusIcon = (status: string) => {
    if (status === "success") return <CheckCircle className="w-5 h-5 text-green-400" />
    if (status === "error") return <XCircle className="w-5 h-5 text-red-400" />
    return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
  }

  const getStatusColor = (status: string) => {
    if (status === "success") return "border-green-500/50 bg-green-500/10"
    if (status === "error") return "border-red-500/50 bg-red-500/10"
    return "border-gray-500/50 bg-gray-500/10"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-2xl p-8 border border-white/10">
          <h1 className="text-3xl font-bold text-white mb-2">Supabase Backend Test</h1>
          <p className="text-gray-400 mb-8">Verify your Supabase connection and setup</p>

          <div className="space-y-4">
            {/* Connection Test */}
            <div className={`glass-card rounded-xl p-6 border ${getStatusColor(tests.connection.status)}`}>
              <div className="flex items-start gap-4">
                {getStatusIcon(tests.connection.status)}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">1. Connection Test</h3>
                  <p className="text-gray-300">{tests.connection.message}</p>
                  {tests.connection.status === "error" && (
                    <div className="mt-2 text-sm text-red-300">
                      <p>• Check if NEXT_PUBLIC_SUPABASE_URL is set in .env.local</p>
                      <p>• Check if NEXT_PUBLIC_SUPABASE_ANON_KEY is set in .env.local</p>
                      <p>• Restart dev server after adding env variables</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Auth Test */}
            <div className={`glass-card rounded-xl p-6 border ${getStatusColor(tests.auth.status)}`}>
              <div className="flex items-start gap-4">
                {getStatusIcon(tests.auth.status)}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">2. Authentication Test</h3>
                  <p className="text-gray-300">{tests.auth.message}</p>
                </div>
              </div>
            </div>

            {/* Database Test */}
            <div className={`glass-card rounded-xl p-6 border ${getStatusColor(tests.database.status)}`}>
              <div className="flex items-start gap-4">
                {getStatusIcon(tests.database.status)}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">3. Database Access Test</h3>
                  <p className="text-gray-300">{tests.database.message}</p>
                  {tests.database.status === "error" && (
                    <div className="mt-2 text-sm text-red-300">
                      <p>• Make sure you ran schema.sql in Supabase SQL Editor</p>
                      <p>• Check if tables exist in Supabase Table Editor</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tables Test */}
            <div className={`glass-card rounded-xl p-6 border ${getStatusColor(tests.tables.status)}`}>
              <div className="flex items-start gap-4">
                {getStatusIcon(tests.tables.status)}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">4. Tables Check</h3>
                  <p className="text-gray-300">{tests.tables.message}</p>
                  {tests.tables.status === "error" && (
                    <div className="mt-2 text-sm text-red-300">
                      <p>• Go to Supabase SQL Editor</p>
                      <p>• Copy and run schema.sql</p>
                      <p>• Verify tables in Table Editor</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <button
              onClick={runTests}
              disabled={isLoading}
              className="btn-primary px-6 py-3 rounded-xl disabled:opacity-50"
            >
              {isLoading ? "Testing..." : "Run Tests Again"}
            </button>
          </div>

          {/* Environment Check */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Environment Variables Check</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-gray-300">
                  NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-gray-300">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

