-- Create a trigger to update the JWT claims when a profile is updated
CREATE OR REPLACE FUNCTION public.update_user_jwt_claims()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the auth.users metadata with the role
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{user_role}',
    to_jsonb(NEW.role)
  )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS profile_update_jwt_trigger ON public.profiles;

-- Create trigger on profiles table
CREATE TRIGGER profile_update_jwt_trigger
AFTER INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_user_jwt_claims();
