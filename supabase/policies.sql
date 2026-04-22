-- CockRoach RLS + grants. Run AFTER schema.sql.
--
-- CURRENT TRUST MODEL (documented in SECURITY.md):
-- This app has no Supabase Auth. User identity is a client-generated UUID
-- asserted via the anon key. Traditional auth.uid()-based RLS is not
-- applicable. Tables are therefore open to the `anon` role, matching the
-- app's existing direct-from-browser query pattern.
--
-- If auth is ever added, convert every `alter table ... disable row level
-- security` below into `enable row level security` plus per-user policies
-- like `using (auth.uid()::text = user_id)`.

-- ─────────────────────────────────────────────────────────────────────────────
-- Grants — anon + authenticated have full CRUD (by design, given no-auth model)
-- ─────────────────────────────────────────────────────────────────────────────
grant all on table public.users to anon, authenticated;
grant all on table public.azure_configs to anon, authenticated;
grant all on table public.system_prompts to anon, authenticated;
grant all on table public.user_personalization to anon, authenticated;
grant all on table public.chats to anon, authenticated;
grant all on table public.messages to anon, authenticated;
grant all on table public.memory_items to anon, authenticated;
grant all on table public.projects to anon, authenticated;
grant all on table public.research_reports to anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS — disabled on user-facing tables (no auth to enforce per-user isolation)
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.users disable row level security;
alter table public.azure_configs disable row level security;
alter table public.system_prompts disable row level security;
alter table public.user_personalization disable row level security;
alter table public.chats disable row level security;
alter table public.messages disable row level security;
alter table public.memory_items disable row level security;

-- projects and research_reports were created with RLS enabled elsewhere;
-- leaving as-is. Verify their policies independently before relying on them.
