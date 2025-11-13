-- Insert default leave types
INSERT INTO public.leave_types (name, description, max_days_per_year) VALUES
  ('Annual Leave', 'Standard paid annual leave', 20),
  ('Sick Leave', 'Leave for illness or medical appointments', 10),
  ('Emergency Leave', 'Unpaid leave for emergencies', 5),
  ('Maternity/Paternity Leave', 'Leave for new parents', 60)
ON CONFLICT (name) DO NOTHING;
