-- Function to initialize leave balance for a user when they are created
CREATE OR REPLACE FUNCTION public.initialize_leave_balance()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  leave_type RECORD;
  current_year INT;
BEGIN
  current_year := EXTRACT(YEAR FROM NOW());
  
  -- Insert leave balance for each leave type
  FOR leave_type IN SELECT id, max_days_per_year FROM public.leave_types LOOP
    INSERT INTO public.leave_balance (
      student_id,
      leave_type_id,
      year,
      total_days,
      used_days,
      remaining_days
    ) VALUES (
      NEW.id,
      leave_type.id,
      current_year,
      leave_type.max_days_per_year,
      0,
      leave_type.max_days_per_year
    )
    ON CONFLICT (student_id, leave_type_id, year) DO NOTHING;
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;

-- Create the trigger
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.initialize_leave_balance();
