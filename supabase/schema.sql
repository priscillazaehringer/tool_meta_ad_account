-- Meta Setup Flow schema
-- Run this in the Supabase SQL editor after creating the project.

create table if not exists meta_setup (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  last_name text not null,
  first_name text not null,
  current_step int not null default 1,
  q1_answer text,
  q2_answer text,
  q3_answer text,
  q4_answer text,
  q5_completed_at timestamptz,
  q6_completed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Lookup by email + last_name (their existing "credential" pattern)
create index if not exists meta_setup_email_lastname_idx
  on meta_setup (lower(email), lower(last_name));

-- Auto-update updated_at
create or replace function meta_setup_touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists meta_setup_touch on meta_setup;
create trigger meta_setup_touch
  before update on meta_setup
  for each row execute function meta_setup_touch_updated_at();

-- Row Level Security: locked down. Server uses service role key.
alter table meta_setup enable row level security;
-- No policies added; only service role can read/write.
