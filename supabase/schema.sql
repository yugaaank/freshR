-- ============================================================================
-- freshr campus super-app — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Enums ───────────────────────────────────────────────────────────────────
create type event_category   as enum ('Tech','Cultural','Sports','Academic','Music','Drama','Workshop');
create type difficulty_level as enum ('Easy','Medium','Hard');
create type order_status     as enum ('pending','confirmed','preparing','ready','delivered','cancelled');
create type assignment_status as enum ('pending','submitted','graded');
create type post_type        as enum ('image','reel');
create type alert_type       as enum ('info','warning','success','error');
create type print_status     as enum ('pending','processing','ready','collected');
create type vibe_tag         as enum ('Competitive','Creative','Social','Academic','Tech');

-- ============================================================================
-- PROFILES (extends auth.users)
-- ============================================================================
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  name          text not null default '',
  phone         text,
  college       text not null default 'MIT Manipal',
  branch        text not null default 'CSE',
  year          int  not null default 1 check (year between 1 and 5),
  roll_no       text,
  avatar_url    text,
  interests     text[] default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "profiles: user reads own"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: user updates own" on public.profiles for update using (auth.uid() = id);
create policy "profiles: user inserts own" on public.profiles for insert with check (auth.uid() = id);

-- auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''), new.phone);
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Push notification tokens ─────────────────────────────────────────────────
create table public.push_notification_tokens (
  id         uuid primary key default uuid_generate_v4(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  token      text not null,
  platform   text not null check (platform in ('ios','android','web')),
  created_at timestamptz not null default now(),
  unique(user_id, token)
);
alter table public.push_notification_tokens enable row level security;
create policy "tokens: user manages own" on public.push_notification_tokens
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- CAMPUS ALERTS
-- ============================================================================
create table public.campus_alerts (
  id          uuid primary key default uuid_generate_v4(),
  emoji       text not null default '📢',
  title       text not null,
  description text not null default '',
  type        alert_type not null default 'info',
  expires_at  timestamptz,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);
alter table public.campus_alerts enable row level security;
create policy "alerts: public read" on public.campus_alerts for select using (is_active = true);
create index idx_campus_alerts_active on public.campus_alerts(is_active, created_at desc);

-- ============================================================================
-- CLUBS
-- ============================================================================
create table public.clubs (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  logo            text not null,
  banner          text not null,
  tagline         text not null default '',
  vibe_tag        vibe_tag not null default 'Social',
  followers_count int  not null default 0,
  created_at      timestamptz not null default now()
);
alter table public.clubs enable row level security;
create policy "clubs: public read" on public.clubs for select using (true);

create table public.club_followers (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  club_id    uuid not null references public.clubs(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, club_id)
);
alter table public.club_followers enable row level security;
create policy "followers: user manages own" on public.club_followers
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "followers: public read" on public.club_followers for select using (true);

-- ============================================================================
-- EVENTS
-- ============================================================================
create table public.events (
  id               uuid primary key default uuid_generate_v4(),
  club_id          uuid references public.clubs(id) on delete set null,
  host             text,
  title            text not null,
  description      text not null default '',
  date             date not null,
  time             text not null,
  venue            text not null default '',
  organizer        text,
  college          text,
  city             text,
  total_seats      int  not null default 100,
  registered_count int  not null default 0,
  category         event_category not null default 'Tech',
  color_bg         text,
  emoji            text,
  image            text,
  is_featured      boolean not null default false,
  tags             text[] default '{}',
  tickets          jsonb  default '[]',
  media_assets     text[] default '{}',
  engagement_score int  not null default 0,
  created_at       timestamptz not null default now()
);
alter table public.events enable row level security;
create policy "events: public read" on public.events for select using (true);
create index idx_events_date     on public.events(date desc);
create index idx_events_category on public.events(category);
create index idx_events_featured on public.events(is_featured, date desc);

alter table public.event_registrations enable row level security;
create policy "registrations: anon manage" on public.event_registrations
  for insert with check (true);
create policy "registrations: user manages own" on public.event_registrations
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "registrations: public count read" on public.event_registrations for select using (true);

-- ... (increment/decrement functions)

-- ============================================================================
-- CLUB FOLLOWERS
-- ============================================================================
-- (Updating existing clubs policy section for followers)
create policy "followers: anon manage" on public.club_followers
  for insert with check (true);

-- ============================================================================
-- ORDERS
-- ============================================================================
create table public.orders (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  restaurant_id  uuid not null references public.restaurants(id),
  status         order_status not null default 'pending',
  total_price    int  not null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "orders: anon insert"      on public.orders for insert with check (true);
create policy "orders: user reads own"   on public.orders for select using (true);
create policy "orders: service updates"  on public.orders for update using (true);
create index idx_orders_user on public.orders(user_id, created_at desc);

create table public.order_items (
  id            uuid primary key default uuid_generate_v4(),
  order_id      uuid not null references public.orders(id) on delete cascade,
  menu_item_id  uuid not null references public.menu_items(id),
  quantity      int  not null check (quantity > 0),
  unit_price    int  not null
);
alter table public.order_items enable row level security;
create policy "order_items: anon insert" on public.order_items for insert with check (true);
create policy "order_items: user reads own" on public.order_items for select using (true);

-- ============================================================================
-- TEACHERS & REVIEWS
-- ============================================================================
create table public.teachers (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  subject          text not null,
  department       text not null,
  rating           numeric(2,1) not null default 4.0,
  review_count     int  not null default 0,
  office_hours     text not null default '',
  email            text not null,
  cabin            text not null,
  image            text,
  experience       int  not null default 0,
  weekly_classes   int[] default '{}',
  is_available_now boolean not null default false,
  created_at       timestamptz not null default now()
);
alter table public.teachers enable row level security;
create policy "teachers: public read" on public.teachers for select using (true);

create table public.teacher_reviews (
  id          uuid primary key default uuid_generate_v4(),
  teacher_id  uuid not null references public.teachers(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  rating      int  not null check (rating between 1 and 5),
  comment     text not null default '',
  created_at  timestamptz not null default now(),
  unique(teacher_id, user_id)
);
alter table public.teacher_reviews enable row level security;
create policy "reviews: public read"       on public.teacher_reviews for select using (true);
create policy "reviews: user inserts own"  on public.teacher_reviews for insert with check (auth.uid() = user_id);
create policy "reviews: user updates own"  on public.teacher_reviews for update using (auth.uid() = user_id);

-- ============================================================================
-- ACADEMICS — SUBJECTS, GRADES, ASSIGNMENTS
-- ============================================================================
create table public.subjects (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  code        text not null unique,
  credits     int  not null default 3,
  professor   text not null default '',  -- denormalised for simplicity
  created_at  timestamptz not null default now()
);
alter table public.subjects enable row level security;
create policy "subjects: public read" on public.subjects for select using (true);

create table public.user_subjects (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  attendance int  not null default 0 check (attendance between 0 and 100),
  grade      text not null default '',
  grade_point numeric(3,1) not null default 0,
  next_class text,
  primary key (user_id, subject_id)
);
alter table public.user_subjects enable row level security;
create policy "user_subjects: user manages own" on public.user_subjects
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.assignments (
  id          uuid primary key default uuid_generate_v4(),
  subject_id  uuid not null references public.subjects(id) on delete cascade,
  title       text not null,
  due_date    date not null,
  total_marks int  not null default 20,
  created_at  timestamptz not null default now()
);
alter table public.assignments enable row level security;
create policy "assignments: public read" on public.assignments for select using (true);

create table public.user_assignments (
  user_id       uuid not null references public.profiles(id) on delete cascade,
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  status        assignment_status not null default 'pending',
  marks         int,
  primary key (user_id, assignment_id)
);
alter table public.user_assignments enable row level security;
create policy "user_assignments: user manages own" on public.user_assignments
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- CODING CHALLENGES
-- ============================================================================
create table public.coding_challenges (
  id                 uuid primary key default uuid_generate_v4(),
  title              text not null,
  difficulty         difficulty_level not null default 'Medium',
  tags               text[] default '{}',
  description        text not null,
  examples           jsonb not null default '[]',
  constraints        text[] default '{}',
  acceptance_rate    numeric(5,2) not null default 50.0,
  total_submissions  int not null default 0,
  date               date not null unique,  -- one challenge per day
  created_at         timestamptz not null default now()
);
alter table public.coding_challenges enable row level security;
create policy "challenges: public read" on public.coding_challenges for select using (true);
create index idx_challenges_date on public.coding_challenges(date desc);

create table public.user_challenge_submissions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  challenge_id uuid not null references public.coding_challenges(id) on delete cascade,
  solved_at    timestamptz not null default now(),
  language     text not null default 'javascript',
  code         text not null default '',
  unique(user_id, challenge_id)
);
alter table public.user_challenge_submissions enable row level security;
create policy "submissions: user manages own" on public.user_challenge_submissions
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.user_streaks (
  user_id        uuid primary key references public.profiles(id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  total_solved   int not null default 0,
  last_solved_at date
);
alter table public.user_streaks enable row level security;
create policy "streaks: user manages own" on public.user_streaks
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "streaks: public read" on public.user_streaks for select using (true);

-- ============================================================================
-- PRINT REQUESTS
-- ============================================================================
create table public.print_requests (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  file_url       text not null,
  file_name      text not null,
  pages          int  not null default 1,
  copies         int  not null default 1,
  color          boolean not null default false,
  scheduled_time timestamptz not null,
  status         print_status not null default 'pending',
  pickup_code    text,
  created_at     timestamptz not null default now()
);
alter table public.print_requests enable row level security;
create policy "print: user manages own" on public.print_requests
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index idx_print_user on public.print_requests(user_id, created_at desc);

-- ============================================================================
-- CALENDAR EVENTS (Personal)
-- ============================================================================
create table public.user_calendar_events (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  date        date not null,
  time        text not null,
  location    text,
  category    text not null default 'Personal',
  created_at  timestamptz not null default now()
);
alter table public.user_calendar_events enable row level security;
create policy "calendar: user manages own" on public.user_calendar_events
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- CAMPUS LANDMARKS (For Navigation)
-- ============================================================================
create table public.landmarks (
  id          text primary key,
  name        text not null,
  category    text not null,
  floor       text,
  distance    text,
  icon        text,
  color       text,
  available   boolean not null default true,
  opens       text,
  lat         numeric,
  lng         numeric,
  created_at  timestamptz not null default now()
);
alter table public.landmarks enable row level security;
create policy "landmarks: public read" on public.landmarks for select using (true);

-- ============================================================================
-- REALTIME — enable replication for live subscription tables
-- ============================================================================
alter publication supabase_realtime add table public.campus_alerts;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.event_registrations;
