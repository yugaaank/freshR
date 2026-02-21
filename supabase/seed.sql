-- =============================================================================
-- freshr seed data — expanded mock data for all tables
-- Run AFTER schema.sql
-- =============================================================================

-- 0. AUTH USERS (must exist before profiles due to FK constraint)
INSERT INTO auth.users (id, email, created_at, updated_at, email_confirmed_at, is_super_admin, role, aud, instance_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'yugan@mitm.edu',    now(), now(), now(), false, 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('22222222-2222-2222-2222-222222222222', 'aryan@mitm.edu',    now(), now(), now(), false, 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('33333333-3333-3333-3333-333333333333', 'priya@mitm.edu',    now(), now(), now(), false, 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('44444444-4444-4444-4444-444444444444', 'rohit@mitm.edu',    now(), now(), now(), false, 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('55555555-5555-5555-5555-555555555555', 'aisha@mitm.edu',    now(), now(), now(), false, 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000')
ON CONFLICT (id) DO NOTHING;

-- 1. PROFILES (demo user used throughout)
INSERT INTO profiles (id, name, phone, college, branch, year, roll_no, avatar_url, interests, created_at, updated_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Yugan Aank',    '+91-9876543210', 'MIT Manipal', 'CSE',  3, '200910027', 'https://i.pravatar.cc/150?img=11', ARRAY['tech','music','food'], now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'Aryan Mehta',   '+91-9123456780', 'MIT Manipal', 'ECE',  2, '210930045', 'https://i.pravatar.cc/150?img=12', ARRAY['coding','gaming'], now(), now()),
  ('33333333-3333-3333-3333-333333333333', 'Priya Sharma',  '+91-9988776655', 'MIT Manipal', 'Mech', 4, '190920033', 'https://i.pravatar.cc/150?img=13', ARRAY['design','events'], now(), now()),
  ('44444444-4444-4444-4444-444444444444', 'Rohit Nair',    '+91-9871234567', 'MIT Manipal', 'CSE',  1, '230910012', 'https://i.pravatar.cc/150?img=14', ARRAY['tech','sports'], now(), now()),
  ('55555555-5555-5555-5555-555555555555', 'Aisha Patel',   '+91-9765432198', 'MIT Manipal', 'IT',   3, '200915067', 'https://i.pravatar.cc/150?img=15', ARRAY['music','art'], now(), now())
ON CONFLICT (id) DO NOTHING;

-- 2. CAMPUS ALERTS
INSERT INTO campus_alerts (id, emoji, title, description, type, expires_at, is_active) VALUES
  ('a0000001-0000-0000-0000-000000000001', '🚨', 'Library Closing Early', 'Central library will close at 6 PM today due to maintenance. Plan accordingly.', 'warning', now() + INTERVAL '1 day', true),
  ('a0000001-0000-0000-0000-000000000002', '🍽️', 'New Mess Menu Live', 'Check the updated weekly menu — now with continental options on Fridays!', 'info', now() + INTERVAL '7 days', true),
  ('a0000001-0000-0000-0000-000000000003', '⚡', 'Power Cut – Block C', 'Scheduled maintenance 2–4 PM. Keep devices charged. Wi-Fi will be on UPS.', 'warning', now() + INTERVAL '12 hours', true),
  ('a0000001-0000-0000-0000-000000000004', '🎉', 'Fest Registrations Open', 'Techxcelerate 2025 registrations are live! Register before Feb 28.', 'info', now() + INTERVAL '10 days', true),
  ('a0000001-0000-0000-0000-000000000005', '🏥', 'Health Camp Tomorrow', 'Free blood pressure & sugar checkup at the medical center, 10 AM–2 PM.', 'info', now() + INTERVAL '2 days', true),
  ('a0000001-0000-0000-0000-000000000006', '📶', 'Campus Wi-Fi Upgrade', 'Faster speeds from Monday! All rooms get the new AX1800 access points.', 'success', now() + INTERVAL '5 days', true),
  ('a0000001-0000-0000-0000-000000000007', '🚌', 'Bus Route Change', 'Shuttle from North Gate suspended till Mar 5. Use South Gate instead.', 'warning', now() + INTERVAL '3 days', true)
ON CONFLICT (id) DO NOTHING;

-- 3. CLUBS
INSERT INTO clubs (id, name, logo, banner, tagline, vibe_tag, followers_count) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'CodeCraft', 'https://i.pravatar.cc/80?img=20', 'https://picsum.photos/seed/codecraft/800/400', 'Build. Ship. Repeat.', 'Tech', 2480),
  ('c0000001-0000-0000-0000-000000000002', 'ArtWave', 'https://i.pravatar.cc/80?img=21', 'https://picsum.photos/seed/artwave/800/400', 'Where every canvas speaks.', 'Creative', 1350),
  ('c0000001-0000-0000-0000-000000000003', 'Beats & Bass', 'https://i.pravatar.cc/80?img=22', 'https://picsum.photos/seed/beatsandbass/800/400', 'Music for every mood.', 'Creative', 3210),
  ('c0000001-0000-0000-0000-000000000004', 'Robo League', 'https://i.pravatar.cc/80?img=23', 'https://picsum.photos/seed/roboleague/800/400', 'Engineering the future.', 'Tech', 1870),
  ('c0000001-0000-0000-0000-000000000005', 'DebateX', 'https://i.pravatar.cc/80?img=24', 'https://picsum.photos/seed/debatex/800/400', 'Speak your mind, change the world.', 'Academic', 980),
  ('c0000001-0000-0000-0000-000000000006', 'Shuttlers', 'https://i.pravatar.cc/80?img=25', 'https://picsum.photos/seed/shuttlers/800/400', 'Smash. Rally. Win.', 'Competitive', 1420),
  ('c0000001-0000-0000-0000-000000000007', 'GreenRoot', 'https://i.pravatar.cc/80?img=26', 'https://picsum.photos/seed/greenroot/800/400', 'Campus, green and clean.', 'Social', 760),
  ('c0000001-0000-0000-0000-000000000008', 'FilmFrame', 'https://i.pravatar.cc/80?img=27', 'https://picsum.photos/seed/filmframe/800/400', 'Every frame, a story.', 'Creative', 1190),
  ('c0000001-0000-0000-0000-000000000009', 'MathSoc', 'https://i.pravatar.cc/80?img=28', 'https://picsum.photos/seed/mathsoc/800/400', 'Problem solvers only.', 'Academic', 540),
  ('c0000001-0000-0000-0000-000000000010', 'Culturati', 'https://i.pravatar.cc/80?img=29', 'https://picsum.photos/seed/culturati/800/400', 'Celebrate every culture.', 'Social', 2100)
ON CONFLICT (id) DO NOTHING;

-- 4. EVENTS
INSERT INTO events (id, club_id, host, title, description, date, time, venue, organizer, college, city, category, total_seats, registered_count, is_featured, image, color_bg, emoji, created_at) VALUES
  ('e0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'CodeCraft', 'Hackathon 2025', '36-hour coding marathon. Build something amazing and win ₹50,000 in prizes.', '2025-03-15', '09:00 AM', 'AB-4 Audi', 'CodeCraft', 'MIT Manipal', 'Manipal', 'Tech', 300, 187, true, 'https://picsum.photos/seed/hack2025/600/300', '#0A0A23', '💻', now()),
  ('e0000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'Beats & Bass', 'Battle of Bands', 'Live performances by 12 bands. Vote for your favourite and win merch.', '2025-03-08', '06:00 PM', 'Open Air Theatre', 'Culturati', 'MIT Manipal', 'Manipal', 'Music', 500, 312, false, 'https://picsum.photos/seed/bands2025/600/300', '#1A0A30', '🎸', now()),
  ('e0000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000004', 'Robo League', 'BotWars Season 3', 'Campus robotics championship. Autonomous bots compete for the golden gear.', '2025-03-22', '10:00 AM', 'Engineering Block', 'Robo League', 'MIT Manipal', 'Manipal', 'Tech', 200, 145, false, 'https://picsum.photos/seed/botwars/600/300', '#0A2010', '🤖', now()),
  ('e0000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000002', 'ArtWave', 'Art Fiesta', '72-hour live mural creation + gallery exhibition. All mediums welcome.', '2025-03-10', '11:00 AM', 'Student Activity Centre', 'ArtWave', 'MIT Manipal', 'Manipal', 'Cultural', 150, 89, false, 'https://picsum.photos/seed/artfiesta/600/300', '#1A0033', '🎨', now()),
  ('e0000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000005', 'DebateX', 'Recon 2025 — MUN', 'Model United Nations. Represent a nation, debate global policy.', '2025-03-29', '09:00 AM', 'Conference Hall', 'DebateX', 'MIT Manipal', 'Manipal', 'Academic', 120, 67, false, 'https://picsum.photos/seed/mun2025/600/300', '#001A33', '🌍', now()),
  ('e0000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000006', 'Shuttlers', 'Badminton Open', 'Inter-college badminton championship. Singles and doubles.', '2025-03-18', '08:00 AM', 'Indoor Sports Complex', 'Shuttlers', 'MIT Manipal', 'Manipal', 'Sports', 64, 48, false, 'https://picsum.photos/seed/badminton/600/300', '#002000', '🏸', now()),
  ('e0000001-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000007', 'GreenRoot', 'Campus Clean Drive', 'Join us for a morning of campus cleanup and tree planting. Free breakfast.', '2025-03-05', '07:00 AM', 'Main Gate Lawn', 'GreenRoot', 'MIT Manipal', 'Manipal', 'Cultural', 200, 54, false, 'https://picsum.photos/seed/cleandrive/600/300', '#001A00', '🌱', now()),
  ('e0000001-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000008', 'FilmFrame', 'Short Film Fest', 'Student films screened, jury feedback, and audience choice awards.', '2025-03-25', '05:00 PM', 'Mini Theatre, AB4', 'FilmFrame', 'MIT Manipal', 'Manipal', 'Cultural', 100, 72, false, 'https://picsum.photos/seed/filmfest/600/300', '#1A1A00', '🎬', now()),
  ('e0000001-0000-0000-0000-000000000009', 'c0000001-0000-0000-0000-000000000010', 'Culturati', 'Culturati Annual Night', 'Grand cultural evening with dance, drama and celebrity DJ.', '2025-04-05', '07:00 PM', 'Open Air Theatre', 'Culturati', 'MIT Manipal', 'Manipal', 'Cultural', 800, 620, true, 'https://picsum.photos/seed/culturati/600/300', '#1A0033', '🌟', now()),
  ('e0000001-0000-0000-0000-000000000010', 'c0000001-0000-0000-0000-000000000001', 'CodeCraft', 'ML Bootcamp', '2-day hands-on machine learning workshop with Kaggle experts.', '2025-03-12', '10:00 AM', 'Lab Block 3', 'CodeCraft', 'MIT Manipal', 'Manipal', 'Workshop', 60, 58, false, 'https://picsum.photos/seed/mlboot/600/300', '#0A0023', '🧠', now()),
  ('e0000001-0000-0000-0000-000000000011', 'c0000001-0000-0000-0000-000000000009', 'MathSoc', 'Euler Challenge', 'Competitive mathematics event — 3 rounds, 50 problems.', '2025-03-20', '02:00 PM', 'LH-1', 'MathSoc', 'MIT Manipal', 'Manipal', 'Academic', 80, 35, false, 'https://picsum.photos/seed/euler/600/300', '#00001A', '📐', now()),
  ('e0000001-0000-0000-0000-000000000012', 'c0000001-0000-0000-0000-000000000003', 'Beats & Bass', 'Open Mic Night', 'Monthly open mic. Sing, rap, play — all genres welcome.', '2025-03-07', '08:00 PM', 'Café 1000', 'Beats & Bass', 'MIT Manipal', 'Manipal', 'Music', 80, 61, false, 'https://picsum.photos/seed/openmic/600/300', '#1A0A30', '🎤', now())
ON CONFLICT (id) DO NOTHING;

-- 5. CLUB POSTS
INSERT INTO club_posts (id, club_id, linked_event_id, type, media_url, caption, engagement_score) VALUES
  ('bb000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000001', 'image', 'https://picsum.photos/seed/post1/600/800', '🔥 Hackathon 2025 registrations are live! 36 hours of pure building. Are you in? Link in bio.', 9800),
  ('bb000001-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000003', 'e0000001-0000-0000-0000-000000000002', 'image', 'https://picsum.photos/seed/post2/600/800', '🎸 Band names revealed! Check the lineup for Battle of Bands and vote for your favourite.', 7200),
  ('bb000001-0000-0000-0000-000000000003', 'c0000001-0000-0000-0000-000000000002', 'e0000001-0000-0000-0000-000000000004', 'image', 'https://picsum.photos/seed/post3/600/800', '🎨 72 hours. 30 artists. 1 epic mural. Join us at Art Fiesta this weekend!', 5400),
  ('bb000001-0000-0000-0000-000000000004', 'c0000001-0000-0000-0000-000000000004', 'e0000001-0000-0000-0000-000000000003', 'reel', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', '🤖 BotWars teaser is here! Watch last season''s champion bot dominate the arena. Season 3 coming March 22.', 11300),
  ('bb000001-0000-0000-0000-000000000005', 'c0000001-0000-0000-0000-000000000010', 'e0000001-0000-0000-0000-000000000009', 'image', 'https://picsum.photos/seed/post5/600/800', '🌟 Culturati Annual Night 2025 — the biggest night of the year. Get your tickets NOW before they sell out!', 14200),
  ('bb000001-0000-0000-0000-000000000006', 'c0000001-0000-0000-0000-000000000001', NULL, 'image', 'https://picsum.photos/seed/post6/600/800', '💡 Pro tip: LeetCode contest every Sunday at 8 AM. CodeCraft members get a study group session post-contest.', 4100),
  ('bb000001-0000-0000-0000-000000000007', 'c0000001-0000-0000-0000-000000000006', 'e0000001-0000-0000-0000-000000000006', 'image', 'https://picsum.photos/seed/post7/600/800', '🏸 Semi-finals announced for the Badminton Open! The bracket has been updated — check the noticeboard.', 3300),
  ('bb000001-0000-0000-0000-000000000008', 'c0000001-0000-0000-0000-000000000007', 'e0000001-0000-0000-0000-000000000007', 'image', 'https://picsum.photos/seed/post8/600/800', '🌱 We planted 200 saplings last weekend! Join us for another clean drive on March 5. Free trees to take home.', 5800),
  ('bb000001-0000-0000-0000-000000000009', 'c0000001-0000-0000-0000-000000000008', 'e0000001-0000-0000-0000-000000000008', 'reel', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', '🎬 Sneak peek at our best student short this semester! Film Fest is March 25 — save the date.', 6700),
  ('bb000001-0000-0000-0000-000000000010', 'c0000001-0000-0000-0000-000000000005', 'e0000001-0000-0000-0000-000000000005', 'image', 'https://picsum.photos/seed/post10/600/800', '🌍 MUN delegate allocations are out! 12 committees, 30 nations. Check your assignment on the portal.', 2900),
  ('bb000001-0000-0000-0000-000000000011', 'c0000001-0000-0000-0000-000000000003', 'e0000001-0000-0000-0000-000000000012', 'image', 'https://picsum.photos/seed/post11/600/800', '🎤 Open Mic Night tomorrow — last 4 spots still open! DM us to register. All genres, all vibes.', 3800),
  ('bb000001-0000-0000-0000-000000000012', 'c0000001-0000-0000-0000-000000000001', 'e0000001-0000-0000-0000-000000000010', 'image', 'https://picsum.photos/seed/post12/600/800', '🧠 ML Bootcamp is almost full (58/60)! If you haven''t registered, this is your last chance.', 5200)
ON CONFLICT (id) DO NOTHING;

-- 6. RESTAURANTS
INSERT INTO restaurants (id, name, cuisine, rating, delivery_time, delivery_fee, min_order, image, is_open, tag, color_bg, emoji) VALUES
  ('fd000001-0000-0000-0000-000000000001', 'Saffron Dhaba', 'North Indian', 4.6, '25–35 min', 15.00, 80.00, 'https://picsum.photos/seed/saffron/400/300', true, 'Popular', '#FF6B35', '🍛'),
  ('fd000001-0000-0000-0000-000000000002', 'Wok in Progress', 'Chinese', 4.3, '20–30 min', 20.00, 100.00, 'https://picsum.photos/seed/wok/400/300', true, 'Fast Delivery', '#E63946', '🥡'),
  ('fd000001-0000-0000-0000-000000000003', 'The Dough District', 'Pizza & Pasta', 4.7, '30–45 min', 0.00, 150.00, 'https://picsum.photos/seed/dough/400/300', true, 'No Delivery Fee', '#2B9348', '🍕'),
  ('fd000001-0000-0000-0000-000000000004', 'Smoothie Lab', 'Healthy & Juices', 4.4, '10–15 min', 10.00, 60.00, 'https://picsum.photos/seed/smoothie/400/300', true, 'Healthy', '#06D6A0', '🥤'),
  ('fd000001-0000-0000-0000-000000000005', 'Biryani Bros', 'Hyderabadi', 4.8, '35–50 min', 25.00, 120.00, 'https://picsum.photos/seed/biryani/400/300', true, 'Top Rated', '#FF6B35', '🍚'),
  ('fd000001-0000-0000-0000-000000000006', 'Coastal Curry', 'South Indian & Seafood', 4.5, '25–40 min', 15.00, 90.00, 'https://picsum.photos/seed/coastal/400/300', true, 'Spicy', '#E76F51', '🦐'),
  ('fd000001-0000-0000-0000-000000000007', 'Café Ambrosia', 'Café & Snacks', 4.2, '15–25 min', 0.00, 50.00, 'https://picsum.photos/seed/ambrosia/400/300', true, 'Café', '#7B2D8B', '☕')
ON CONFLICT (id) DO NOTHING;

-- 7. MENU ITEMS
INSERT INTO menu_items (id, restaurant_id, name, description, price, original_price, category, image, is_veg, is_popular, rating, prep_time, is_available) VALUES
  -- Saffron Dhaba
  ('ee000001-0000-0000-0000-000000000001', 'fd000001-0000-0000-0000-000000000001', 'Butter Chicken', 'Creamy tomato gravy with tender chicken. Best seller.', 180.00, 220.00, 'Mains', 'https://picsum.photos/seed/butterchicken/200/200', false, true, 4.7, 20, true),
  ('ee000001-0000-0000-0000-000000000002', 'fd000001-0000-0000-0000-000000000001', 'Dal Makhani', 'Slow-cooked black lentils in rich buttery gravy.', 120.00, NULL, 'Mains', 'https://picsum.photos/seed/dalmakhani/200/200', true, true, 4.5, 15, true),
  ('ee000001-0000-0000-0000-000000000003', 'fd000001-0000-0000-0000-000000000001', 'Garlic Naan', 'Oven-baked naan with roasted garlic and butter.', 40.00, NULL, 'Breads', 'https://picsum.photos/seed/naan/200/200', true, true, 4.6, 8, true),
  ('ee000001-0000-0000-0000-000000000004', 'fd000001-0000-0000-0000-000000000001', 'Paneer Tikka Masala', 'Grilled paneer in spiced masala sauce.', 160.00, 190.00, 'Mains', 'https://picsum.photos/seed/paneertikka/200/200', true, false, 4.4, 18, true),
  ('ee000001-0000-0000-0000-000000000005', 'fd000001-0000-0000-0000-000000000001', 'Mango Lassi', 'Thick Alphonso mango smoothie with curd.', 60.00, NULL, 'Drinks', 'https://picsum.photos/seed/mangolassi/200/200', true, false, 4.8, 5, true),
  ('ee000001-0000-0000-0000-000000000006', 'fd000001-0000-0000-0000-000000000001', 'Samosa (2 pc)', 'Crispy golden samosas with mint chutney.', 30.00, NULL, 'Snacks', 'https://picsum.photos/seed/samosa/200/200', true, true, 4.3, 6, true),

  -- Wok in Progress
  ('ee000002-0000-0000-0000-000000000001', 'fd000001-0000-0000-0000-000000000002', 'Kung Pao Noodles', 'Spicy wok-tossed noodles with peanuts and veggies.', 130.00, 150.00, 'Noodles', 'https://picsum.photos/seed/kungpao/200/200', true, true, 4.5, 12, true),
  ('ee000002-0000-0000-0000-000000000002', 'fd000001-0000-0000-0000-000000000002', 'Chicken Fried Rice', 'Classic Chinese fried rice with egg and chicken.', 140.00, NULL, 'Rice', 'https://picsum.photos/seed/friedrice/200/200', false, true, 4.4, 15, true),
  ('ee000002-0000-0000-0000-000000000003', 'fd000001-0000-0000-0000-000000000002', 'Spring Rolls (4 pc)', 'Crispy rolls filled with cabbage, carrot, and glass noodles.', 80.00, NULL, 'Starters', 'https://picsum.photos/seed/springrolls/200/200', true, false, 4.2, 10, true),
  ('ee000002-0000-0000-0000-000000000004', 'fd000001-0000-0000-0000-000000000002', 'Chilli Paneer', 'Indo-Chinese favourite — dry or gravy.', 150.00, 170.00, 'Mains', 'https://picsum.photos/seed/chillipaneer/200/200', true, true, 4.6, 14, true),

  -- The Dough District
  ('ee000003-0000-0000-0000-000000000001', 'fd000001-0000-0000-0000-000000000003', 'Margherita Pizza', 'Thin crust, San Marzano tomatoes, fresh mozzarella.', 220.00, 260.00, 'Pizza', 'https://picsum.photos/seed/margherita/200/200', true, true, 4.8, 25, true),
  ('ee000003-0000-0000-0000-000000000002', 'fd000001-0000-0000-0000-000000000003', 'Pepperoni Blast', 'Double pepperoni, jalapeños, and extra cheese.', 280.00, 320.00, 'Pizza', 'https://picsum.photos/seed/pepperoni/200/200', false, true, 4.9, 30, true),
  ('ee000003-0000-0000-0000-000000000003', 'fd000001-0000-0000-0000-000000000003', 'Pasta Arrabbiata', 'Penne in spicy tomato and garlic sauce.', 175.00, NULL, 'Pasta', 'https://picsum.photos/seed/arrabbiata/200/200', true, false, 4.3, 20, true),
  ('ee000003-0000-0000-0000-000000000004', 'fd000001-0000-0000-0000-000000000003', 'Garlic Bread', 'Ciabatta with herb butter and mozzarella.', 90.00, NULL, 'Sides', 'https://picsum.photos/seed/garlicbread/200/200', true, true, 4.6, 10, true),

  -- Smoothie Lab
  ('ee000004-0000-0000-0000-000000000001', 'fd000001-0000-0000-0000-000000000004', 'Acai Bowl', 'Acai base, granola, banana, chia seeds.', 180.00, 200.00, 'Bowls', 'https://picsum.photos/seed/acai/200/200', true, true, 4.7, 8, true),
  ('ee000004-0000-0000-0000-000000000002', 'fd000001-0000-0000-0000-000000000004', 'Green Detox Smoothie', 'Spinach, apple, cucumber, ginger.', 120.00, NULL, 'Smoothies', 'https://picsum.photos/seed/greensmoothie/200/200', true, true, 4.4, 5, true),
  ('ee000004-0000-0000-0000-000000000003', 'fd000001-0000-0000-0000-000000000004', 'Protein Shake (Chocolate)', 'Whey protein, banana, dark cocoa, almond milk.', 150.00, NULL, 'Smoothies', 'https://picsum.photos/seed/proteinshake/200/200', true, false, 4.5, 5, true),
  ('ee000004-0000-0000-0000-000000000004', 'fd000001-0000-0000-0000-000000000004', 'Avocado Toast', 'Sourdough, smashed avocado, poached egg, everything bagel seasoning.', 160.00, 180.00, 'Snacks', 'https://picsum.photos/seed/avocadotoast/200/200', true, true, 4.8, 10, true),

  -- Biryani Bros
  ('ee000005-0000-0000-0000-000000000001', 'fd000001-0000-0000-0000-000000000005', 'Chicken Dum Biryani', 'Slow-cooked Hyderabadi dum biryani with raita.', 200.00, 240.00, 'Biryani', 'https://picsum.photos/seed/chickenbiryani/200/200', false, true, 4.9, 40, true),
  ('ee000005-0000-0000-0000-000000000002', 'fd000001-0000-0000-0000-000000000005', 'Mutton Biryani', 'Tender mutton pieces in aromatic saffron rice.', 260.00, 300.00, 'Biryani', 'https://picsum.photos/seed/muttonbiryani/200/200', false, true, 4.8, 45, true),
  ('ee000005-0000-0000-0000-000000000003', 'fd000001-0000-0000-0000-000000000005', 'Veg Biryani', 'Fresh vegetables in fragrant long-grain basmati.', 150.00, NULL, 'Biryani', 'https://picsum.photos/seed/vegbiryani/200/200', true, false, 4.4, 35, true),
  ('ee000005-0000-0000-0000-000000000004', 'fd000001-0000-0000-0000-000000000005', 'Shami Kebab (4 pc)', 'Minced mutton patties with green chutney.', 130.00, NULL, 'Starters', 'https://picsum.photos/seed/shamikebab/200/200', false, true, 4.6, 20, true),
  ('ee000005-0000-0000-0000-000000000005', 'fd000001-0000-0000-0000-000000000005', 'Mirchi Ka Salan', 'Traditional Hyderabadi chilli curry.', 80.00, NULL, 'Sides', 'https://picsum.photos/seed/mirchibsalan/200/200', true, false, 4.3, 10, true),

  -- Coastal Curry
  ('ee000006-0000-0000-0000-000000000001', 'fd000001-0000-0000-0000-000000000006', 'Fish Curry Rice', 'Kerala-style coconut fish curry with steamed rice.', 190.00, NULL, 'Mains', 'https://picsum.photos/seed/fishcurry/200/200', false, true, 4.7, 25, true),
  ('ee000006-0000-0000-0000-000000000002', 'fd000001-0000-0000-0000-000000000006', 'Prawn Masala', 'Spicy coastal prawn curry with neer dosa.', 220.00, 260.00, 'Mains', 'https://picsum.photos/seed/prawnmasala/200/200', false, true, 4.8, 30, true),
  ('ee000006-0000-0000-0000-000000000003', 'fd000001-0000-0000-0000-000000000006', 'Dosa Platter', 'Crispy masala dosa with chutneys and sambar.', 110.00, NULL, 'South Indian', 'https://picsum.photos/seed/dosa/200/200', true, true, 4.5, 15, true),

  -- Café Ambrosia
  ('ee000007-0000-0000-0000-000000000001', 'fd000001-0000-0000-0000-000000000007', 'Cold Brew Coffee', 'Slow-drip 18-hour cold brew over ice.', 120.00, 140.00, 'Coffee', 'https://picsum.photos/seed/coldbrew/200/200', true, true, 4.9, 3, true),
  ('ee000007-0000-0000-0000-000000000002', 'fd000001-0000-0000-0000-000000000007', 'Croissant Sandwich', 'Buttery croissant with egg, cheese, and sriracha mayo.', 130.00, NULL, 'Sandwiches', 'https://picsum.photos/seed/croissant/200/200', true, false, 4.4, 8, true),
  ('ee000007-0000-0000-0000-000000000003', 'fd000001-0000-0000-0000-000000000007', 'Waffle Sundae', 'Belgian waffle with vanilla ice cream and chocolate drizzle.', 160.00, 190.00, 'Desserts', 'https://picsum.photos/seed/waffle/200/200', true, true, 4.7, 12, true),
  ('ee000007-0000-0000-0000-000000000004', 'fd000001-0000-0000-0000-000000000007', 'Chai Latte', 'Masala chai with steamed milk and cinnamon.', 80.00, NULL, 'Coffee', 'https://picsum.photos/seed/chailatte/200/200', true, true, 4.6, 5, true)
ON CONFLICT (id) DO NOTHING;

-- 8. TEACHERS
INSERT INTO teachers (id, name, subject, department, rating, review_count, office_hours, email, cabin, image, experience, weekly_classes, is_available_now) VALUES
  ('fe000001-0000-0000-0000-000000000001', 'Dr. Anand Krishnan', 'Data Structures & Algorithms', 'CSE', 4.8, 143, 'Mon–Wed, 2–4 PM', 'a.krishnan@mitm.edu', 'A-204', 'https://i.pravatar.cc/150?img=51', 12, ARRAY[3,4,3,5,3,2,4,3,4,3,5,4], true),
  ('fe000001-0000-0000-0000-000000000002', 'Prof. Meera Iyer', 'Machine Learning', 'CSE', 4.9, 211, 'Tue–Thu, 3–5 PM', 'm.iyer@mitm.edu', 'B-112', 'https://i.pravatar.cc/150?img=52', 18, ARRAY[4,4,5,4,4,5,4,5,4,4,3,4], true),
  ('fe000001-0000-0000-0000-000000000003', 'Dr. Ravi Shankar', 'Computer Networks', 'CSE', 4.4, 87, 'Mon, Wed, Fri, 11 AM–12 PM', 'r.shankar@mitm.edu', 'A-308', 'https://i.pravatar.cc/150?img=53', 9, ARRAY[2,3,3,2,3,3,2,3,3,2,3,3], false),
  ('fe000001-0000-0000-0000-000000000004', 'Prof. Lakshmi Nair', 'Engineering Mathematics', 'Maths', 4.6, 176, 'Mon–Fri, 9–10 AM', 'l.nair@mitm.edu', 'C-101', 'https://i.pravatar.cc/150?img=54', 22, ARRAY[5,5,5,5,5,5,5,5,5,5,5,5], true),
  ('fe000001-0000-0000-0000-000000000005', 'Dr. Suresh Babu', 'Operating Systems', 'CSE', 4.2, 64, 'Tue, Thu, 2–3 PM', 's.babu@mitm.edu', 'A-210', 'https://i.pravatar.cc/150?img=55', 7, ARRAY[2,2,3,2,2,3,2,2,3,2,2,3], false),
  ('fe000001-0000-0000-0000-000000000006', 'Prof. Divya Menon', 'Database Management', 'CSE', 4.7, 128, 'Wed–Fri, 4–5 PM', 'd.menon@mitm.edu', 'B-205', 'https://i.pravatar.cc/150?img=56', 11, ARRAY[3,3,4,3,3,4,3,3,4,3,3,4], true),
  ('fe000001-0000-0000-0000-000000000007', 'Dr. Kiran Prabhu', 'Software Engineering', 'CSE', 4.5, 95, 'Mon, Wed, 1–2 PM', 'k.prabhu@mitm.edu', 'A-312', 'https://i.pravatar.cc/150?img=57', 14, ARRAY[3,4,3,4,3,4,3,4,3,4,3,4], true),
  ('fe000001-0000-0000-0000-000000000008', 'Prof. Rekha Gopal', 'Digital Electronics', 'ECE', 4.3, 72, 'Tue–Thu, 11 AM–12 PM', 'r.gopal@mitm.edu', 'D-108', 'https://i.pravatar.cc/150?img=58', 8, ARRAY[3,3,3,3,3,3,3,3,3,3,3,3], false),
  ('fe000001-0000-0000-0000-000000000009', 'Dr. Arun Kumar', 'Thermodynamics', 'Mech', 4.6, 104, 'Mon, Wed, Fri, 3–4 PM', 'a.kumar@mitm.edu', 'E-203', 'https://i.pravatar.cc/150?img=59', 16, ARRAY[4,3,4,3,4,3,4,3,4,3,4,3], true),
  ('fe000001-0000-0000-0000-000000000010', 'Prof. Suma Devi', 'Technical Communication', 'Humanities', 4.1, 48, 'Tue, Thu, 10–11 AM', 's.devi@mitm.edu', 'F-104', 'https://i.pravatar.cc/150?img=60', 5, ARRAY[2,2,2,2,2,2,2,2,2,2,2,2], true)
ON CONFLICT (id) DO NOTHING;

-- 9. SUBJECTS
INSERT INTO subjects (id, name, code, credits, professor) VALUES
  ('5b000000-0000-0000-0000-000000000001', 'Data Structures & Algorithms', 'CSE301', 4, 'Dr. Anand Krishnan'),
  ('5b000000-0000-0000-0000-000000000002', 'Machine Learning', 'CSE401', 3, 'Prof. Meera Iyer'),
  ('5b000000-0000-0000-0000-000000000003', 'Computer Networks', 'CSE302', 3, 'Dr. Ravi Shankar'),
  ('5b000000-0000-0000-0000-000000000004', 'Database Management', 'CSE303', 4, 'Prof. Divya Menon'),
  ('5b000000-0000-0000-0000-000000000005', 'Software Engineering', 'CSE304', 3, 'Dr. Kiran Prabhu'),
  ('5b000000-0000-0000-0000-000000000006', 'Engineering Mathematics III', 'MA301', 4, 'Prof. Lakshmi Nair'),
  ('5b000000-0000-0000-0000-000000000007', 'Operating Systems', 'CSE305', 3, 'Dr. Suresh Babu')
ON CONFLICT (id) DO NOTHING;

-- 10. USER_SUBJECTS (for demo user)
INSERT INTO user_subjects (user_id, subject_id, attendance, grade, grade_point, next_class) VALUES
  ('11111111-1111-1111-1111-111111111111', '5b000000-0000-0000-0000-000000000001', 82, 'A+', 10, 'Mon 8:00 AM'),
  ('11111111-1111-1111-1111-111111111111', '5b000000-0000-0000-0000-000000000002', 91, 'A+', 10, 'Tue 10:00 AM'),
  ('11111111-1111-1111-1111-111111111111', '5b000000-0000-0000-0000-000000000003', 74, 'B', 7, 'Wed 2:00 PM'),
  ('11111111-1111-1111-1111-111111111111', '5b000000-0000-0000-0000-000000000004', 88, 'A', 9, 'Thu 9:00 AM'),
  ('11111111-1111-1111-1111-111111111111', '5b000000-0000-0000-0000-000000000005', 66, 'C+', 6, 'Fri 11:00 AM'),
  ('11111111-1111-1111-1111-111111111111', '5b000000-0000-0000-0000-000000000006', 79, 'A', 9, 'Mon 11:00 AM'),
  ('11111111-1111-1111-1111-111111111111', '5b000000-0000-0000-0000-000000000007', 85, 'A+', 10, 'Tue 3:00 PM')
ON CONFLICT (user_id, subject_id) DO NOTHING;

-- 11. ASSIGNMENTS
INSERT INTO assignments (id, subject_id, title, due_date, total_marks) VALUES
  ('4a000000-0000-0000-0000-000000000001', '5b000000-0000-0000-0000-000000000001', 'Implement AVL Tree', '2025-03-10', 20),
  ('4a000000-0000-0000-0000-000000000002', '5b000000-0000-0000-0000-000000000002', 'SVM Classification Lab', '2025-03-15', 30),
  ('4a000000-0000-0000-0000-000000000003', '5b000000-0000-0000-0000-000000000003', 'TCP Socket Programming', '2025-03-08', 25),
  ('4a000000-0000-0000-0000-000000000004', '5b000000-0000-0000-0000-000000000004', 'ER Diagram & Schema', '2025-03-12', 20),
  ('4a000000-0000-0000-0000-000000000005', '5b000000-0000-0000-0000-000000000005', 'SDLC Design Document', '2025-03-20', 15),
  ('4a000000-0000-0000-0000-000000000006', '5b000000-0000-0000-0000-000000000006', 'Integral Calculus Problems', '2025-03-18', 25),
  ('4a000000-0000-0000-0000-000000000007', '5b000000-0000-0000-0000-000000000001', 'Graph BFS & DFS Trace', '2025-03-25', 10)
ON CONFLICT (id) DO NOTHING;

-- 12. USER_ASSIGNMENTS
INSERT INTO user_assignments (user_id, assignment_id, status, marks) VALUES
  ('11111111-1111-1111-1111-111111111111', '4a000000-0000-0000-0000-000000000001', 'graded', 18),
  ('11111111-1111-1111-1111-111111111111', '4a000000-0000-0000-0000-000000000002', 'submitted', NULL),
  ('11111111-1111-1111-1111-111111111111', '4a000000-0000-0000-0000-000000000003', 'pending', NULL),
  ('11111111-1111-1111-1111-111111111111', '4a000000-0000-0000-0000-000000000004', 'graded', 17),
  ('11111111-1111-1111-1111-111111111111', '4a000000-0000-0000-0000-000000000005', 'pending', NULL),
  ('11111111-1111-1111-1111-111111111111', '4a000000-0000-0000-0000-000000000006', 'submitted', NULL),
  ('11111111-1111-1111-1111-111111111111', '4a000000-0000-0000-0000-000000000007', 'pending', NULL)
ON CONFLICT (user_id, assignment_id) DO NOTHING;

-- 13. USER_STREAKS (demo user)
INSERT INTO user_streaks (user_id, current_streak, longest_streak, total_solved, last_solved_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 7, 23, 94, '2025-02-20')
ON CONFLICT (user_id) DO NOTHING;

-- 14. CODING CHALLENGES (today + 14 past)
INSERT INTO coding_challenges (id, title, difficulty, tags, description, examples, constraints, acceptance_rate, total_submissions, date) VALUES
  ('c8000000-0000-0000-0000-000000000001', 'Two Sum', 'Easy',
    ARRAY['Array','Hash Map'],
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
    '[{"input":"nums = [2,7,11,15], target = 9","output":"[0,1]","explanation":"nums[0] + nums[1] = 2 + 7 = 9."},{"input":"nums = [3,2,4], target = 6","output":"[1,2]"}]'::jsonb,
    ARRAY['2 <= nums.length <= 10^4','-10^9 <= nums[i] <= 10^9','Only one valid answer exists.'],
    72.4, 4215000, '2025-02-21'),

  ('c8000000-0000-0000-0000-000000000002', 'Longest Substring Without Repeating Characters', 'Medium',
    ARRAY['String','Sliding Window','Hash Set'],
    'Given a string s, find the length of the longest substring without repeating characters.',
    '[{"input":"s = \"abcabcbb\"","output":"3","explanation":"The answer is \"abc\"."},{"input":"s = \"bbbbb\"","output":"1"}]'::jsonb,
    ARRAY['0 <= s.length <= 5 * 10^4','s consists of English letters, digits, symbols and spaces.'],
    34.1, 5870000, '2025-02-20'),

  ('c8000000-0000-0000-0000-000000000003', 'Merge Intervals', 'Medium',
    ARRAY['Array','Sorting'],
    'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals.',
    '[{"input":"intervals = [[1,3],[2,6],[8,10],[15,18]]","output":"[[1,6],[8,10],[15,18]]"},{"input":"intervals = [[1,4],[4,5]]","output":"[[1,5]]"}]'::jsonb,
    ARRAY['1 <= intervals.length <= 10^4','intervals[i].length == 2','0 <= starti <= endi <= 10^4'],
    46.8, 3290000, '2025-02-19'),

  ('c8000000-0000-0000-0000-000000000004', 'Climbing Stairs', 'Easy',
    ARRAY['Dynamic Programming','Math'],
    'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    '[{"input":"n = 2","output":"2","explanation":"1+1 or 2."},{"input":"n = 3","output":"3"}]'::jsonb,
    ARRAY['1 <= n <= 45'],
    52.1, 3900000, '2025-02-18'),

  ('c8000000-0000-0000-0000-000000000005', 'Binary Tree Level Order Traversal', 'Medium',
    ARRAY['Tree','BFS','Queue'],
    'Given the root of a binary tree, return the level order traversal of its nodes'' values (i.e., from left to right, level by level).',
    '[{"input":"root = [3,9,20,null,null,15,7]","output":"[[3],[9,20],[15,7]]"},{"input":"root = [1]","output":"[[1]]"}]'::jsonb,
    ARRAY['The number of nodes in the tree is in the range [0, 2000]','-1000 <= Node.val <= 1000'],
    65.3, 2740000, '2025-02-17'),

  ('c8000000-0000-0000-0000-000000000006', 'Word Ladder', 'Hard',
    ARRAY['BFS','Hash Set','String'],
    'A transformation sequence from word beginWord to word endWord using a dictionary wordList is valid if exactly one letter is changed at each step. Return the number of words in the shortest transformation sequence.',
    '[{"input":"beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]","output":"5"}]'::jsonb,
    ARRAY['1 <= beginWord.length <= 10','beginWord != endWord'],
    38.7, 1250000, '2025-02-16'),

  ('c8000000-0000-0000-0000-000000000007', 'Maximum Subarray', 'Easy',
    ARRAY['Array','Dynamic Programming','Divide and Conquer'],
    'Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.',
    '[{"input":"nums = [-2,1,-3,4,-1,2,1,-5,4]","output":"6","explanation":"[4,-1,2,1] has the largest sum = 6."}]'::jsonb,
    ARRAY['-10^4 <= nums[i] <= 10^4','1 <= nums.length <= 10^5'],
    50.2, 4880000, '2025-02-15'),

  ('c8000000-0000-0000-0000-000000000008', 'Rotate Image', 'Medium',
    ARRAY['Array','Matrix','Math'],
    'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place.',
    '[{"input":"matrix = [[1,2,3],[4,5,6],[7,8,9]]","output":"[[7,4,1],[8,5,2],[9,6,3]]"}]'::jsonb,
    ARRAY['n == matrix.length == matrix[i].length','1 <= n <= 20'],
    72.3, 2100000, '2025-02-14'),

  ('c8000000-0000-0000-0000-000000000009', 'Linked List Cycle', 'Easy',
    ARRAY['Linked List','Two Pointers','Floyd''s Algorithm'],
    'Given head, the head of a linked list, determine if the linked list has a cycle in it.',
    '[{"input":"head = [3,2,0,-4], pos = 1","output":"true"},{"input":"head = [1,2], pos = 0","output":"true"},{"input":"head = [1], pos = -1","output":"false"}]'::jsonb,
    ARRAY['The number of the nodes in the list is in the range [0, 10^4]'],
    46.6, 4020000, '2025-02-13'),

  ('c8000000-0000-0000-0000-000000000010', 'LRU Cache', 'Medium',
    ARRAY['Hash Map','Doubly Linked List','Design'],
    'Design a data structure that follows the Least Recently Used cache eviction policy. Implement get and put in O(1) average time.',
    '[{"input":"[\"LRUCache\",\"put\",\"put\",\"get\",\"put\",\"get\",\"put\",\"get\",\"get\",\"get\"] [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]","output":"[null,null,null,1,null,-1,null,-1,3,4]"}]'::jsonb,
    ARRAY['1 <= capacity <= 3000','0 <= key <= 10^4'],
    41.8, 2670000, '2025-02-12'),

  ('c8000000-0000-0000-0000-000000000011', 'Course Schedule', 'Medium',
    ARRAY['Graph','DFS','Topological Sort'],
    'There are numCourses courses labeled from 0 to numCourses-1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates you must take course bi first to take course ai. Return true if you can finish all courses.',
    '[{"input":"numCourses = 2, prerequisites = [[1,0]]","output":"true"},{"input":"numCourses = 2, prerequisites = [[1,0],[0,1]]","output":"false"}]'::jsonb,
    ARRAY['1 <= numCourses <= 2000','0 <= prerequisites.length <= 5000'],
    52.9, 2380000, '2025-02-11'),

  ('c8000000-0000-0000-0000-000000000012', 'Trapping Rain Water', 'Hard',
    ARRAY['Array','Two Pointers','Dynamic Programming','Stack'],
    'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    '[{"input":"height = [0,1,0,2,1,0,1,3,2,1,2,1]","output":"6"},{"input":"height = [4,2,0,3,2,5]","output":"9"}]'::jsonb,
    ARRAY['n == height.length','1 <= n <= 2 * 10^4','0 <= height[i] <= 10^5'],
    59.6, 2910000, '2025-02-10'),

  ('c8000000-0000-0000-0000-000000000013', 'Valid Parentheses', 'Easy',
    ARRAY['String','Stack'],
    'Given a string s containing just the characters ''('', '')'', ''{'' , ''}'', ''['' and '']'', determine if the input string is valid.',
    '[{"input":"s = \"()\"","output":"true"},{"input":"s = \"()[]{}\", ","output":"true"},{"input":"s = \"(]\"","output":"false"}]'::jsonb,
    ARRAY['1 <= s.length <= 10^4','s consists of parentheses only.'],
    40.7, 5600000, '2025-02-09'),

  ('c8000000-0000-0000-0000-000000000014', 'Search in Rotated Sorted Array', 'Medium',
    ARRAY['Array','Binary Search'],
    'Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.',
    '[{"input":"nums = [4,5,6,7,0,1,2], target = 0","output":"4"},{"input":"nums = [4,5,6,7,0,1,2], target = 3","output":"-1"}]'::jsonb,
    ARRAY['1 <= nums.length <= 5000','All values of nums are unique.'],
    39.2, 3440000, '2025-02-08'),

  ('c8000000-0000-0000-0000-000000000015', 'Minimum Window Substring', 'Hard',
    ARRAY['String','Sliding Window','Hash Map'],
    'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.',
    '[{"input":"s = \"ADOBECODEBANC\", t = \"ABC\"","output":"\"BANC\""},{"input":"s = \"a\", t = \"a\"","output":"\"a\""}]'::jsonb,
    ARRAY['m == s.length','n == t.length','1 <= m, n <= 10^5'],
    42.1, 1870000, '2025-02-07')
ON CONFLICT (id) DO NOTHING;
