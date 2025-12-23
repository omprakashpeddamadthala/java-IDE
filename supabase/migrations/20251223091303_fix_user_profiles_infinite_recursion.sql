/*
  # Fix infinite recursion in user_profiles RLS policies

  1. Changes
    - Drop existing policies that cause infinite recursion
    - Create simple policies that allow users to read/update their own profiles
    - Create a security definer function to safely check admin status
    - Add admin policies using the security definer function

  2. Security
    - Users can read and update their own profiles
    - Admins can read and update all profiles (checked via security definer function)
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile or admins can view all" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile or admins can update all" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Create a security definer function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM user_profiles WHERE id = user_id LIMIT 1),
    false
  );
$$;

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile, admins can view all
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin(auth.uid()));

-- Allow users to update their own profile, admins can update all
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = id OR public.is_admin(auth.uid()));
