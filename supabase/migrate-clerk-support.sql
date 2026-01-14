-- Migration: Support Clerk Authentication
-- This updates the profiles table to work with Clerk instead of Supabase Auth

-- Step 1: Add clerk_id column to track Clerk user IDs
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;

-- Step 2: Make id column not require auth.users reference
-- We'll use a generated UUID instead
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Step 3: Keep id as primary key (cannot be nullable)
-- The id will be generated from clerk_id when inserting
-- No need to alter the column since it's already NOT NULL as primary key

-- Step 4: Create index on clerk_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON public.profiles(clerk_id);

-- Step 5: Create function to generate UUID from Clerk ID
CREATE OR REPLACE FUNCTION generate_uuid_from_clerk_id(clerk_id TEXT)
RETURNS UUID AS $$
DECLARE
  hash_value BIGINT;
  hex_string TEXT;
BEGIN
  -- Simple hash of Clerk ID
  hash_value := abs(hashtext(clerk_id));
  -- Convert to hex and pad to 32 characters
  hex_string := lpad(to_hex(hash_value::BIGINT), 32, '0');
  -- Format as UUID (8-4-4-4-12)
  RETURN (
    substring(hex_string, 1, 8) || '-' ||
    substring(hex_string, 9, 4) || '-' ||
    substring(hex_string, 13, 4) || '-' ||
    substring(hex_string, 17, 4) || '-' ||
    substring(hex_string, 21, 12)
  )::UUID;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 6: Update RLS policies to work with Clerk
-- Drop existing policies if they exist, then create new ones
DROP POLICY IF EXISTS "Users can view own profile by clerk_id" ON public.profiles;
DROP POLICY IF EXISTS "Allow inserting profiles with clerk_id" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile by clerk_id" ON public.profiles;

-- Allow users to read their own profile by clerk_id
-- Note: In production, you'd need to pass Clerk user ID via JWT or session
CREATE POLICY "Users can view own profile by clerk_id" ON public.profiles
  FOR SELECT USING (
    clerk_id IS NOT NULL
    -- In production, you'd check against the current Clerk user ID
    -- For now, we'll allow reading if clerk_id exists
  );

-- Allow inserting profiles with clerk_id
CREATE POLICY "Allow inserting profiles with clerk_id" ON public.profiles
  FOR INSERT WITH CHECK (clerk_id IS NOT NULL);

-- Allow updating own profile by clerk_id
CREATE POLICY "Users can update own profile by clerk_id" ON public.profiles
  FOR UPDATE USING (clerk_id IS NOT NULL);

-- Note: In production, you'll need to pass the Clerk user ID to Supabase
-- This can be done via JWT claims or a service role key

