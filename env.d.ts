/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    SUPABASE_SERVICE_ROLE_KEY: string
    
    // Clerk Configuration
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string
    CLERK_SECRET_KEY: string
    NEXT_PUBLIC_CLERK_DOMAIN?: string
    
    // Node Environment
    NODE_ENV: 'development' | 'production' | 'test'
  }
}

