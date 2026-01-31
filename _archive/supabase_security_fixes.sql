-- ==============================================================================
-- Fix Supabase Security Advisor Issues
-- Run this script in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Enable Row Level Security (RLS) on public tables
-- Note: This locks down the tables. You will need to add Policies to allow access.
ALTER TABLE public.sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aqi_calculations ENABLE ROW LEVEL SECURITY;

-- Create default policies allowing public read access (Modify as needed for your app security)
CREATE POLICY "Allow public read access on sensors" ON public.sensors FOR SELECT USING (true);
CREATE POLICY "Allow public read access on sensor_readings" ON public.sensor_readings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on aqi_calculations" ON public.aqi_calculations FOR SELECT USING (true);

-- 2. Fix Security Definer Views
-- Views created with security_definer run with the permissions of the creator (usually postgres), not the caller.
-- To fix, we should recreate them or ensure they don't leak permissions.
-- Often, removing security_definer is the safest bet if not strictly needed.
-- If you need them to be security definer, you must set the search_path.

-- Example fix for v_active_alerts (adjust definition as strictly necessary)
-- ALTER VIEW public.v_active_alerts SET (security_invoker = true); 
-- Note: PostgreSQL doesn't support changing security_invoker directly on existing views easily without recreation in some versions.
-- The Advisor usually suggests adding a search_path to the underlying functions or removing security definer.

-- 3. Fix Mutable Search Path in Functions
-- Functions running as security definer must have a fixed search_path to prevent hijacking.

ALTER FUNCTION public.get_aqi_category(int) SET search_path = public;
ALTER FUNCTION public.get_aqi_color(int) SET search_path = public;

-- End of Fixes
