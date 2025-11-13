-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'student', -- 'student' or 'admin'
  employee_id TEXT,
  department TEXT,
  manager_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create leave_types table
CREATE TABLE IF NOT EXISTS public.leave_types (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  max_days_per_year INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create leave_applications table
CREATE TABLE IF NOT EXISTS public.leave_applications (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES public.leave_types(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'cancelled'
  admin_comments TEXT,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Create leave_balance table to track leave usage
CREATE TABLE IF NOT EXISTS public.leave_balance (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES public.leave_types(id),
  year INT NOT NULL,
  total_days INT NOT NULL,
  used_days INT NOT NULL DEFAULT 0,
  remaining_days INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  UNIQUE(student_id, leave_type_id, year)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balance ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Profiles: Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Leave types: Anyone can view" ON public.leave_types;
DROP POLICY IF EXISTS "Leave applications: Users can view their own" ON public.leave_applications;
DROP POLICY IF EXISTS "Leave applications: Users can create their own" ON public.leave_applications;
DROP POLICY IF EXISTS "Leave applications: Admins can view all" ON public.leave_applications;
DROP POLICY IF EXISTS "Leave applications: Admins can update" ON public.leave_applications;
DROP POLICY IF EXISTS "Leave balance: Users can view their own" ON public.leave_balance;
DROP POLICY IF EXISTS "Leave balance: Admins can view all" ON public.leave_balance;

-- Profiles RLS Policies
CREATE POLICY "Profiles: Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Profiles: Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Profiles: Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Profiles: Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- Leave types RLS Policies (public read)
CREATE POLICY "Leave types: Anyone can view"
  ON public.leave_types FOR SELECT
  USING (true);

-- Leave applications RLS Policies
CREATE POLICY "Leave applications: Users can view their own"
  ON public.leave_applications FOR SELECT
  USING (auth.uid() = student_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Leave applications: Users can create their own"
  ON public.leave_applications FOR INSERT
  WITH CHECK (auth.uid() = student_id AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'student');

CREATE POLICY "Leave applications: Users can update their own pending applications"
  ON public.leave_applications FOR UPDATE
  USING (
    (auth.uid() = student_id AND status = 'pending' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'student')
    OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Leave applications: Admins can update any"
  ON public.leave_applications FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Leave balance RLS Policies
CREATE POLICY "Leave balance: Users can view their own"
  ON public.leave_balance FOR SELECT
  USING (auth.uid() = student_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Leave balance: Only system can insert/update"
  ON public.leave_balance FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Leave balance: Only system can update"
  ON public.leave_balance FOR UPDATE
  USING (false);
