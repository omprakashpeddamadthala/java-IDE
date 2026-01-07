/*
  # Add admin policies for java_problems table

  1. Changes
    - Add INSERT policy for admins
    - Add UPDATE policy for admins
    - Add DELETE policy for admins

  2. Security
    - Only users with is_admin = true can insert, update, or delete problems
    - Public users can still read problems
*/

-- Create a helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT is_admin
    FROM public.user_profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add INSERT policy for admins
CREATE POLICY "Admins can insert problems"
  ON java_problems
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin() = true);

-- Add UPDATE policy for admins
CREATE POLICY "Admins can update problems"
  ON java_problems
  FOR UPDATE
  TO authenticated
  USING (public.is_admin() = true)
  WITH CHECK (public.is_admin() = true);

-- Add DELETE policy for admins
CREATE POLICY "Admins can delete problems"
  ON java_problems
  FOR DELETE
  TO authenticated
  USING (public.is_admin() = true);