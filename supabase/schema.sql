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
  project_id uuid references public.projects(id) on delete set null,
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
  project_id uuid references public.projects(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Project spine (Day 2 work) — persistent venture context that compounds
-- across chats, decisions, and artifacts.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  name text not null,
  description text,
  tags text[],
  status text default 'active' not null,
  config jsonb,
  -- Project spine extensions
  stage text default 'idea' not null,
  chosen_idea_id uuid,
  health_score jsonb default '{}'::jsonb not null,
  founder_fit_alignment jsonb default '{}'::jsonb not null,
  last_pulse_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint projects_stage_check check (stage in (
    'idea','validated','building','launched','scaling','paused','archived'
  ))
);

-- Append-only structured decision log per project.
-- Captures Bezos Type-1/Type-2 reversibility, decision dependency graph,
-- and revisit/reversal trail.
create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id text not null references public.users(id) on delete cascade on update cascade,
  category text not null,
  question text not null,
  decision text not null,
  rationale text,
  confidence text default 'medium' not null,
  reversibility text not null,
  reversibility_decay_at timestamp with time zone,
  pre_mortem text,
  depends_on_decision_id uuid references public.decisions(id) on delete set null,
  tags text[] default '{}'::text[] not null,
  decided_at timestamp with time zone default timezone('utc'::text, now()) not null,
  revisit_at timestamp with time zone,
  outcome_observed text,
  reversed_at timestamp with time zone,
  reversed_by_decision_id uuid references public.decisions(id) on delete set null,
  constraint decisions_category_check check (category in (
    'pricing','gtm','hiring','fundraise','pivot','legal','product','ops','positioning','validation','other'
  )),
  constraint decisions_reversibility_check check (reversibility in (
    'reversible','expensive','one_way'
  )),
  constraint decisions_confidence_check check (confidence in (
    'low','medium','high'
  ))
);

-- Versioned artifact catalog (decks, models, memos) per project.
-- parent_artifact_id captures version lineage: v3 -> v2 -> v1.
create table if not exists public.project_artifacts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  kind text not null,
  title text not null,
  content jsonb not null,
  version integer default 1 not null,
  parent_artifact_id uuid references public.project_artifacts(id) on delete set null,
  exported_format text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint project_artifacts_kind_check check (kind in (
    'pitch_deck','financial_model','positioning_doc','business_plan',
    'gtm_plan','investor_update','legal_doc','survey_results',
    'idea_validation','memo','one_pager','other'
  )),
  constraint project_artifacts_format_check check (
    exported_format is null or exported_format in ('pdf','docx','xlsx','pptx','csv','md','txt')
  ),
  constraint project_artifacts_version_positive check (version >= 1)
);

-- Auto-generated weekly summaries per project (founder pulse).
create table if not exists public.project_pulse_log (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  week_starting date not null,
  summary_md text not null,
  metrics jsonb default '{}'::jsonb not null,
  key_decisions uuid[] default '{}'::uuid[] not null,
  notable_artifacts uuid[] default '{}'::uuid[] not null,
  health_delta jsonb default '{}'::jsonb not null,
  auto_generated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Legacy: research_reports (older feature; verify before relying)
-- ─────────────────────────────────────────────────────────────────────────────
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

-- Partial: only active (non-revoked, non-expired) share tokens
create index if not exists idx_chats_active_share_token
  on public.chats(share_token)
  where share_token is not null and share_revoked_at is null;

-- Project spine indexes
create index if not exists idx_decisions_project_id on public.decisions(project_id);
create index if not exists idx_decisions_revisit_due
  on public.decisions(revisit_at)
  where revisit_at is not null and outcome_observed is null;
create index if not exists idx_decisions_reversibility_decay_due
  on public.decisions(reversibility_decay_at)
  where reversibility_decay_at is not null and reversed_at is null;
create index if not exists idx_decisions_depends_on
  on public.decisions(depends_on_decision_id)
  where depends_on_decision_id is not null;
create index if not exists idx_decisions_category on public.decisions(category);

create index if not exists idx_artifacts_project_id on public.project_artifacts(project_id);
create index if not exists idx_artifacts_kind on public.project_artifacts(kind);
create index if not exists idx_artifacts_lineage
  on public.project_artifacts(parent_artifact_id)
  where parent_artifact_id is not null;

create index if not exists idx_pulse_log_project_id on public.project_pulse_log(project_id);
create unique index if not exists uq_pulse_log_project_week
  on public.project_pulse_log(project_id, week_starting);

create index if not exists idx_chats_project_id
  on public.chats(project_id) where project_id is not null;
create index if not exists idx_memory_items_project_id
  on public.memory_items(project_id) where project_id is not null;

-- ─────────────────────────────────────────────────────────────────────────────
-- API usage log — for cost monitoring per user/day, populated by
-- /api/chat, /api/route-mode, /api/generate-pulse on completion.
-- Identifying fields are best-effort (no auth yet) — we log what the
-- client tells us; intended for analytical dashboards not billing.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.api_usage_log (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  chat_id uuid,
  project_id uuid,
  endpoint text not null,                  -- 'chat' | 'route_mode' | 'generate_pulse'
  model text,
  prompt_tokens int,
  completion_tokens int,
  total_tokens int,
  estimated_cost_usd numeric(10,6),
  status text default 'ok' not null,        -- 'ok' | 'error' | 'rate_limited'
  ms int,                                   -- request duration
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_api_usage_user_day
  on public.api_usage_log(user_id, created_at desc);
create index if not exists idx_api_usage_endpoint_day
  on public.api_usage_log(endpoint, created_at desc);

alter table public.api_usage_log disable row level security;
grant all on table public.api_usage_log to anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- Triggers
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at_now()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end; $$;

drop trigger if exists trg_project_artifacts_updated_at on public.project_artifacts;
create trigger trg_project_artifacts_updated_at
  before update on public.project_artifacts
  for each row execute function public.set_updated_at_now();
