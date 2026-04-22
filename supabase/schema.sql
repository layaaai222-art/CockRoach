-- CockRoach schema. Idempotent. Run with: psql ... -f supabase/schema.sql
-- NOTE: this file contains only DDL. RLS/grants live in policies.sql.
-- For dev wipes, use an explicit reset script — there is no DROP TABLE here.

-- ─────────────────────────────────────────────────────────────────────────────
-- Core identity (no auth — users.id is a client-generated UUID stored as text)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.users (
  id text primary key,
  name text,
  email text,
  avatar text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.users
  add constraint users_email_unique unique (email);

-- ─────────────────────────────────────────────────────────────────────────────
-- Per-user configuration
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.azure_configs (
  user_id text primary key references public.users(id) on delete cascade on update cascade,
  api_key text,
  endpoint text,
  deployment text,
  model text,
  version text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.system_prompts (
  user_id text primary key references public.users(id) on delete cascade on update cascade,
  prompt text not null,
  kb_01_enabled boolean default true not null,
  kb_02_enabled boolean default true not null,
  kb_03_enabled boolean default true not null,
  kb_04_enabled boolean default true not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.user_personalization (
  user_id text primary key references public.users(id) on delete cascade on update cascade,
  tone text default 'Professional',
  warm text default 'Default',
  enthusiastic text default 'Default',
  headers_lists text default 'Default',
  emoji text default 'Default',
  custom_instructions text default '',
  nickname text default '',
  occupation text default '',
  location text default '',
  interests text default '',
  communication_style text default 'Direct',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Chats + messages + share-link lifecycle
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade on update cascade,
  title text,
  share_token text unique,
  share_expires_at timestamp with time zone,
  share_revoked_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references public.chats(id) on delete cascade,
  role text not null,
  content text not null,
  raw_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.memory_items (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade on update cascade,
  content text not null,
  category text default 'general' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Projects + research reports (legacy; source unclear — verify before relying)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  description text,
  tags text[],
  status text default 'active' not null,
  config jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.research_reports (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  project_id uuid,
  chat_id uuid,
  title text not null,
  idea_summary text,
  content jsonb not null,
  cockroach_score integer,
  verdict text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────────
create index if not exists idx_chats_user_id on public.chats(user_id);
create index if not exists idx_messages_chat_id on public.messages(chat_id);
create index if not exists idx_memory_items_user_id on public.memory_items(user_id);

-- Partial index: only active (non-revoked, non-expired) share tokens
create index if not exists idx_chats_active_share_token
  on public.chats(share_token)
  where share_token is not null and share_revoked_at is null;
