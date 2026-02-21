-- Temporary SQL workspace
-- Final fix for UUID syntax: Using standard hex characters (0-9, a-f)

-- 1. Ensure the table exists
CREATE TABLE IF NOT EXISTS public.user_calendar_events (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       text NOT NULL,
  date        date NOT NULL,
  time        text NOT NULL,
  location    text,
  category    text NOT NULL DEFAULT 'Personal',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.user_calendar_events ENABLE ROW LEVEL SECURITY;

-- 3. Add RLS Policy
DROP POLICY IF EXISTS "calendar: user manages own" ON public.user_calendar_events;
CREATE POLICY "calendar: user manages own" ON public.user_calendar_events
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Force inject demo tasks (using valid hex UUIDs)
INSERT INTO public.user_calendar_events (id, user_id, title, date, time, location, category) VALUES
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Morning Gym Session', '2025-02-21', '07:00 AM', 'Campus Gym', 'Personal'),
  ('00000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Project Brainstorming', '2025-02-21', '04:00 PM', 'Innovation Lab', 'Study'),
  ('00000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Buy Course Textbook', '2025-02-22', '11:00 AM', 'Stationery Shop', 'Personal')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  date = EXCLUDED.date,
  time = EXCLUDED.time,
  location = EXCLUDED.location,
  category = EXCLUDED.category;
