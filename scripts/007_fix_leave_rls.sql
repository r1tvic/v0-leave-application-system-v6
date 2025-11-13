-- Drop problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Leave applications: Users can create their own" ON public.leave_applications;
DROP POLICY IF EXISTS "Leave applications: Users can view their own" ON public.leave_applications;
DROP POLICY IF EXISTS "Leave applications: Users can update their own pending applications" ON public.leave_applications;
DROP POLICY IF EXISTS "Leave applications: Admins can view all" ON public.leave_applications;
DROP POLICY IF EXISTS "Leave applications: Admins can update any" ON public.leave_applications;

-- Create new policies that avoid recursion by checking only student_id
CREATE POLICY "Leave applications: Students can view their own"
  ON public.leave_applications FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Leave applications: Students can create their own"
  ON public.leave_applications FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Leave applications: Students can update their own pending"
  ON public.leave_applications FOR UPDATE
  USING (auth.uid() = student_id AND status = 'pending')
  WITH CHECK (auth.uid() = student_id AND status = 'pending');

-- Admins bypass RLS with service role in server actions
