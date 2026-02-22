-- ============================================================================
-- freshr campus super-app — Supabase Schema (Organized & Consolidated)
-- ============================================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Enums ───────────────────────────────────────────────────────────────────
create type public.event_category   as enum ('Tech','Cultural','Sports','Academic','Music','Drama','Workshop');
create type public.difficulty_level as enum ('Easy','Medium','Hard');
create type public.order_status     as enum ('pending','confirmed','preparing','ready','delivered','cancelled');
create type public.assignment_status as enum ('pending','submitted','graded');
create type public.post_type        as enum ('image','reel');
create type public.alert_type       as enum ('info','warning','success','error');
create type public.print_status     as enum ('pending','processing','ready','collected');
create type public.vibe_tag         as enum ('Competitive','Creative','Social','Academic','Tech');

-- ============================================================================
-- PROFILES
-- ============================================================================
create table if not exists public.profiles (
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
drop policy if exists "profiles: user reads own" on public.profiles;
create policy "profiles: user reads own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles: user updates own" on public.profiles;
create policy "profiles: user updates own" on public.profiles for update using (auth.uid() = id);
drop policy if exists "profiles: user inserts own" on public.profiles;
create policy "profiles: user inserts own" on public.profiles for insert with check (auth.uid() = id);

-- ============================================================================
-- CLUBS & FOLLOWERS
-- ============================================================================
create table if not exists public.clubs (
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
drop policy if exists "clubs: public read" on public.clubs;
create policy "clubs: public read" on public.clubs for select using (true);

create table if not exists public.club_followers (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  club_id    uuid not null references public.clubs(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, club_id)
);
alter table public.club_followers enable row level security;
drop policy if exists "followers: user manages own" on public.club_followers;
create policy "followers: user manages own" on public.club_followers using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "followers: public read" on public.club_followers;
create policy "followers: public read" on public.club_followers for select using (true);
drop policy if exists "followers: anon manage" on public.club_followers;
create policy "followers: anon manage" on public.club_followers for insert with check (true);

-- ============================================================================
-- EVENTS & REGISTRATIONS
-- ============================================================================
create table if not exists public.events (
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
drop policy if exists "events: public read" on public.events;
create policy "events: public read" on public.events for select using (true);

create table if not exists public.event_registrations (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  event_id    uuid not null references public.events(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, event_id)
);
alter table public.event_registrations enable row level security;
drop policy if exists "registrations: public read" on public.event_registrations;
create policy "registrations: public read" on public.event_registrations for select using (true);
drop policy if exists "registrations: anon manage" on public.event_registrations;
create policy "registrations: anon manage" on public.event_registrations using (true) with check (true);

-- ============================================================================
-- CALENDAR EVENTS (Personal)
-- ============================================================================
create table if not exists public.user_calendar_events (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  date        date not null,
  time        text, 
  location    text,
  category    text not null default 'Personal',
  priority    text not null default 'Medium',
  notes       text,
  is_all_day  boolean not null default false,
  recurring   text,
  attachments jsonb default '[]',
  tags        text[] default '{}',
  estimated_effort integer default 1,
  progress    integer not null default 0,
  subtasks    jsonb default '[]',
  due_date    date,
  difficulty  integer default 3,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.user_calendar_events enable row level security;
drop policy if exists "calendar: public read" on public.user_calendar_events;
create policy "calendar: public read" on public.user_calendar_events for select using (true);
drop policy if exists "calendar: anon manage" on public.user_calendar_events;
create policy "calendar: anon manage" on public.user_calendar_events using (true) with check (true);

-- ============================================================================
-- PRODUCTIVITY & ANALYTICS
-- ============================================================================
create table if not exists public.user_productivity (
  user_id           uuid primary key references public.profiles(id) on delete cascade,
  weekly_score      integer default 0,
  procrastination_index integer default 0,
  completion_rate   float default 0,
  total_study_hours float default 0,
  peak_hours        jsonb default '[]',
  workload_heatmap  jsonb default '{}',
  updated_at        timestamptz not null default now()
);
alter table public.user_productivity enable row level security;
drop policy if exists "productivity: public read" on public.user_productivity;
create policy "productivity: public read" on public.user_productivity for select using (true);
drop policy if exists "productivity: anon manage" on public.user_productivity;
create policy "productivity: anon manage" on public.user_productivity using (true) with check (true);

-- ============================================================================
-- ACADEMICS
-- ============================================================================
create table if not exists public.subjects (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  code        text not null unique,
  credits     int  not null default 3,
  professor   text not null default '',
  created_at  timestamptz not null default now()
);
alter table public.subjects enable row level security;
drop policy if exists "subjects: public read" on public.subjects;
create policy "subjects: public read" on public.subjects for select using (true);

create table if not exists public.user_subjects (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  attendance int  not null default 0 check (attendance between 0 and 100),
  grade      text not null default '',
  grade_point numeric(3,1) not null default 0,
  next_class text,
  primary key (user_id, subject_id)
);
alter table public.user_subjects enable row level security;
drop policy if exists "user_subjects: user manages own" on public.user_subjects;
create policy "user_subjects: user manages own" on public.user_subjects using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.assignments (
  id          uuid primary key default uuid_generate_v4(),
  subject_id  uuid not null references public.subjects(id) on delete cascade,
  title       text not null,
  due_date    date not null,
  total_marks int  not null default 20,
  created_at  timestamptz not null default now()
);
alter table public.assignments enable row level security;
drop policy if exists "assignments: public read" on public.assignments;
create policy "assignments: public read" on public.assignments for select using (true);

create table if not exists public.user_assignments (
  user_id       uuid not null references public.profiles(id) on delete cascade,
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  status        assignment_status not null default 'pending',
  marks         int,
  primary key (user_id, assignment_id)
);
alter table public.user_assignments enable row level security;
drop policy if exists "user_assignments: user manages own" on public.user_assignments;
create policy "user_assignments: user manages own" on public.user_assignments using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS & RPCs
-- ============================================================================
create or replace function public.increment_event_registration(p_event_id uuid)
returns void as $$
begin
  update public.events set registered_count = registered_count + 1 where id = p_event_id;
end;
$$ language plpgsql security definer;

create or replace function public.decrement_event_registration(p_event_id uuid)
returns void as $$
begin
  update public.events set registered_count = greatest(0, registered_count - 1) where id = p_event_id;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- REALTIME
-- ============================================================================
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

-- Add tables to realtime (ignore error if already added)
do $$
begin
  alter publication supabase_realtime add table public.event_registrations;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.user_calendar_events;
exception when others then null;
end $$;
