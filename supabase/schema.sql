-- ============================================================
-- GainFile Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists public.exercises (
  id          uuid    default gen_random_uuid() primary key,
  name        text    not null,
  muscle_group text   not null check (muscle_group in ('chest','back','shoulders','arms','legs','core','cardio','other')),
  equipment   text    not null check (equipment in ('barbell','dumbbell','machine','cable','bodyweight','other')),
  is_custom   boolean not null default false,
  created_by  uuid    references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

create table if not exists public.routines (
  id          uuid    default gen_random_uuid() primary key,
  user_id     uuid    not null references auth.users(id) on delete cascade,
  name        text    not null,
  description text,
  created_at  timestamptz not null default now()
);

create table if not exists public.routine_exercises (
  id          uuid    default gen_random_uuid() primary key,
  routine_id  uuid    not null references public.routines(id) on delete cascade,
  exercise_id uuid    not null references public.exercises(id) on delete cascade,
  order_index integer not null default 0
);

create table if not exists public.workouts (
  id          uuid    default gen_random_uuid() primary key,
  user_id     uuid    not null references auth.users(id) on delete cascade,
  routine_id  uuid    references public.routines(id) on delete set null,
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  notes       text
);

create table if not exists public.sets (
  id           uuid    default gen_random_uuid() primary key,
  workout_id   uuid    not null references public.workouts(id) on delete cascade,
  exercise_id  uuid    not null references public.exercises(id),
  set_number   integer not null,
  reps         integer check (reps > 0),
  weight_kg    numeric(6,2) check (weight_kg >= 0),
  rpe          numeric(3,1) check (rpe >= 1 and rpe <= 10),
  completed_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists exercises_muscle_group_idx on public.exercises(muscle_group);
create index if not exists exercises_is_custom_idx    on public.exercises(is_custom);
create index if not exists workouts_user_id_idx       on public.workouts(user_id);
create index if not exists workouts_started_at_idx    on public.workouts(started_at desc);
create index if not exists sets_workout_id_idx        on public.sets(workout_id);
create index if not exists sets_exercise_id_idx       on public.sets(exercise_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.exercises        enable row level security;
alter table public.routines         enable row level security;
alter table public.routine_exercises enable row level security;
alter table public.workouts         enable row level security;
alter table public.sets             enable row level security;

-- exercises: all authenticated users can read non-custom; users manage their own custom
create policy "Authenticated users can view all non-custom exercises"
  on public.exercises for select to authenticated
  using (is_custom = false or created_by = auth.uid());

create policy "Users can insert custom exercises"
  on public.exercises for insert to authenticated
  with check (is_custom = true and created_by = auth.uid());

create policy "Users can update their custom exercises"
  on public.exercises for update to authenticated
  using (created_by = auth.uid());

create policy "Users can delete their custom exercises"
  on public.exercises for delete to authenticated
  using (created_by = auth.uid());

-- routines
create policy "Users can view their own routines"
  on public.routines for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert their own routines"
  on public.routines for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own routines"
  on public.routines for update to authenticated
  using (user_id = auth.uid());

create policy "Users can delete their own routines"
  on public.routines for delete to authenticated
  using (user_id = auth.uid());

-- routine_exercises (access via routine ownership)
create policy "Users can view their routine exercises"
  on public.routine_exercises for select to authenticated
  using (exists (
    select 1 from public.routines r
    where r.id = routine_exercises.routine_id and r.user_id = auth.uid()
  ));

create policy "Users can insert their routine exercises"
  on public.routine_exercises for insert to authenticated
  with check (exists (
    select 1 from public.routines r
    where r.id = routine_exercises.routine_id and r.user_id = auth.uid()
  ));

create policy "Users can delete their routine exercises"
  on public.routine_exercises for delete to authenticated
  using (exists (
    select 1 from public.routines r
    where r.id = routine_exercises.routine_id and r.user_id = auth.uid()
  ));

-- workouts
create policy "Users can view their own workouts"
  on public.workouts for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert their own workouts"
  on public.workouts for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own workouts"
  on public.workouts for update to authenticated
  using (user_id = auth.uid());

create policy "Users can delete their own workouts"
  on public.workouts for delete to authenticated
  using (user_id = auth.uid());

-- sets (access via workout ownership)
create policy "Users can view their sets"
  on public.sets for select to authenticated
  using (exists (
    select 1 from public.workouts w
    where w.id = sets.workout_id and w.user_id = auth.uid()
  ));

create policy "Users can insert their sets"
  on public.sets for insert to authenticated
  with check (exists (
    select 1 from public.workouts w
    where w.id = sets.workout_id and w.user_id = auth.uid()
  ));

create policy "Users can update their sets"
  on public.sets for update to authenticated
  using (exists (
    select 1 from public.workouts w
    where w.id = sets.workout_id and w.user_id = auth.uid()
  ));

create policy "Users can delete their sets"
  on public.sets for delete to authenticated
  using (exists (
    select 1 from public.workouts w
    where w.id = sets.workout_id and w.user_id = auth.uid()
  ));
