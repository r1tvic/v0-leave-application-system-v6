-- Update the admin@vitc.ac.in user's role to 'admin'
UPDATE public.profiles 
SET role = 'admin' 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin@vitc.ac.in'
);
