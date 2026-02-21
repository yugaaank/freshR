-- =============================================================================
-- freshr canonical seed data
-- Optimized for Christ University (Kengeri Campus)
-- Preserves manually set images in Supabase
-- =============================================================================

-- 0. AUTH USERS
INSERT INTO auth.users (id, email, created_at, updated_at, email_confirmed_at, is_super_admin, role, aud, instance_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'yugaank@gmail.com', now(), now(), now(), false, 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000')
ON CONFLICT (id) DO NOTHING;

-- 1. PROFILES (Demo Student)
INSERT INTO profiles (id, name, phone, college, branch, year, roll_no, avatar_url, interests, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Yugank Rathore', '+91-9876543210', 'Christ University', 'CSE', 3, '200910027', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop', ARRAY['tech','music','food'], now(), now())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  college = EXCLUDED.college,
  branch = EXCLUDED.branch,
  year = EXCLUDED.year;

-- 2. CLUBS (Christ University Kengeri)
INSERT INTO clubs (id, name, logo, banner, tagline, vibe_tag, followers_count) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'ASCII', 'https://api.dicebear.com/9.x/initials/svg?seed=ASCII', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', 'Innovate. Collaborate. Grow.', 'Tech', 3200),
  ('c0000001-0000-0000-0000-000000000002', 'CAADS', 'https://api.dicebear.com/9.x/initials/svg?seed=CAADS', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800', 'Visualizing the future of design.', 'Creative', 1850),
  ('c0000001-0000-0000-0000-000000000003', 'IBMZ', 'https://api.dicebear.com/9.x/initials/svg?seed=IBMZ', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', 'Next-gen Mainframe computing.', 'Tech', 1200),
  ('c0000001-0000-0000-0000-000000000004', 'Student Council', 'https://api.dicebear.com/9.x/initials/svg?seed=SC', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800', 'By the students, for the students.', 'Social', 5400),
  ('c0000001-0000-0000-0000-000000000005', 'Jokers', 'https://api.dicebear.com/9.x/initials/svg?seed=Jokers', 'https://images.unsplash.com/photo-1514525253361-bee8718a340b?w=800', 'Breaking stereotypes through theatre.', 'Social', 2100),
  ('c0000001-0000-0000-0000-000000000006', 'SWO', 'https://api.dicebear.com/9.x/initials/svg?seed=SWO', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800', 'Nurturing talent, fostering excellence.', 'Social', 4300),
  ('c0000001-0000-0000-0000-000000000007', 'MACS', 'https://api.dicebear.com/9.x/initials/svg?seed=MACS', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800', 'Where logic meets statistics.', 'Academic', 1500)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  vibe_tag = EXCLUDED.vibe_tag,
  followers_count = EXCLUDED.followers_count;

-- 3. EVENTS
INSERT INTO events (id, club_id, host, title, description, date, time, venue, organizer, college, city, category, total_seats, registered_count, is_featured, emoji, created_at) VALUES
  ('e0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'ASCII', 'FOOBAR 2025', 'The flagship techno-cultural fest by ASCII.', '2025-03-15', '09:00 AM', 'CS Lab 1', 'ASCII', 'Christ University', 'Bangalore', 'Tech', 200, 145, true, '💻', now()),
  ('e0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000006', 'SWO', 'Magnovite 2025', 'Massive multi-departmental fest at Kengeri.', '2025-03-18', '11:00 AM', 'Campus Wide', 'SWO', 'Christ University', 'Bangalore', 'Cultural', 2000, 55, false, '🤝', now())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  venue = EXCLUDED.venue;

-- 4. PERSONAL CALENDAR TASKS
INSERT INTO user_calendar_events (id, user_id, title, date, time, location, category) VALUES
  ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Morning Gym Session', '2025-02-21', '07:00 AM', 'Campus Gym', 'Personal'),
  ('00000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Project Brainstorming', '2025-02-21', '04:00 PM', 'Innovation Lab', 'Study')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  date = EXCLUDED.date,
  time = EXCLUDED.time,
  location = EXCLUDED.location,
  category = EXCLUDED.category;

-- 5. LANDMARKS
INSERT INTO landmarks (id, name, category, floor, distance, icon, color, available, opens, lat, lng) VALUES
  ('l1', 'Central Library', 'Library', 'G-2 Floors', '250m', '📚', '#3B82F6', true, '08:00 AM', 12.9716, 77.5946),
  ('l2', 'Food Court', 'Dining', 'Ground Floor', '400m', '🍕', '#F59E0B', true, '09:00 AM', 12.9720, 77.5950),
  ('l3', 'Sports Arena', 'Sports', 'Outdoor', '600m', '🏀', '#10B981', true, '06:00 AM', 12.9710, 77.5940),
  ('l4', 'Student Hub', 'Social', 'Level 1', '150m', '🤝', '#8B5CF6', true, '09:00 AM', 12.9718, 77.5948),
  ('l5', 'Medical Center', 'Health', 'Ground Floor', '800m', '🏥', '#EF4444', true, '24 Hours', 12.9725, 77.5955),
  ('l6', 'Main Auditorium', 'Events', 'G-Floor', '300m', '🎭', '#EC4899', false, 'Closed', 12.9712, 77.5942),
  ('l7', 'CS Block', 'Academic', 'Floors 1-4', '100m', '💻', '#0F172A', true, '08:30 AM', 12.9715, 77.5945)
ON CONFLICT (id) DO NOTHING;
