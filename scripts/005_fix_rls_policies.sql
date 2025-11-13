-- Fix infinite recursion in RLS policies by using auth.jwt() instead of subqueries

-- Drop problematic policies
DROP POLICY IF EXISTS "Profiles: Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Leave applications: Users can view their own" ON public.leave_applications;
DROP POLICY IF EXISTS "Leave applications: Users can create their own" ON public.leave_applications;
DROP POLICY IF EXISTS "Leave applications: Users can update their own pending applications" ON public.leave_applications;
DROP POLICY IF EXISTS "Leave applications: Admins can update any" ON public.leave_applications;
DROP POLICY IF EXISTS "Leave balance: Users can view their own" ON public.leave_balance;

-- Profiles: Admins can view all profiles (using JWT role claim)
CREATE POLICY "Profiles: Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- Profiles: Admins can update any profile
CREATE POLICY "Profiles: Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    auth.jwt() ->> 'user_role' = 'admin'
  );

-- Leave applications: Users can view their own or admins view all
CREATE POLICY "Leave applications: Users can view their own"
  ON public.leave_applications FOR SELECT
  USING (
    auth.uid() = student_id OR auth.jwt() ->> 'user_role' = 'admin'
  );

-- Leave applications: Only students can create their own
CREATE POLICY "Leave applications: Users can create their own"
  ON public.leave_applications FOR INSERT
  WITH CHECK (
    auth.uid() = student_id AND auth.jwt() ->> 'user_role' = 'student'
  );

-- Leave applications: Students can update their own pending, admins can update any
CREATE POLICY "Leave applications: Users can update their own pending applications"
  ON public.leave_applications FOR UPDATE
  USING (
    (auth.uid() = student_id AND status = 'pending' AND auth.jwt() ->> 'user_role' = 'student')
    OR auth.jwt() ->> 'user_role' = 'admin'
  );

-- Leave balance: Users can view their own or admins view all
CREATE POLICY "Leave balance: Users can view their own"
  ON public.leave_balance FOR SELECT
  USING (
    auth.uid() = student_id OR auth.jwt() ->> 'user_role' = 'admin'
  );
