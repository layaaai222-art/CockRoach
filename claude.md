# CockRoach — Live Project Context

> **Working file for the build team.** Updated continuously as work
> progresses. Read this first to know where the project stands.

**Last updated:** 2026-05-03 (Phase 1.5 — auto-routing + bundle split + onboarding + latent features)

---

## 1 · Project & ownership

- **Product:** CockRoach — AI-powered entrepreneurial intelligence platform
- **Tagline:** "Not a unicorn. Better."
- **Parent company:** Layaa AI (CockRoach is to Layaa AI what ChatGPT is
  to OpenAI)
- **Vision:** End-to-end co-pilot for entrepreneurs covering idea
  discovery, validation, research, execution, fundraising, hiring, and
  ongoing decisions. Primary on execution, secondary on discovery.
- **Reference docs:**
  - `documentation.md` — full product vision and feature catalog
  - `ARCHITECTURE.md` — engineering internals
  - `SECURITY.md` — trust model + key rotation playbook
  - `README.md` — setup
  - `claude.md` — this file (project context, live)

---

## 2 · Team

| Role | Person | Responsibilities |
|---|---|---|
| Founder / Product | **Abhi** | Product direction, marketing, customer outreach, final calls |
| AI Engineer | Claude (this assistant) | Code drafts, specs, migrations, research, KB authoring, doc upkeep |

> Note: Shubham (tech lead) was on this project earlier but is now busy
> on other things. The build is currently a two-person effort: Abhi +
> Claude.

---

## 3 · Constraints (hard)

- **Budget:** $0 cash. $2000 in Azure startup credits (covers testing,
  prod inference until launch + early users)
- **Timeline:** target launch ~30 days from 2026-06-29 — **flexible**.
  Compress phases when work runs ahead; avoid idle time between phases.
  Sequencing (guidance, not calendar-gated):
  - Phase 0 (Day 0): Resolve git divergence
  - Phase 1 (Days 1–7): Product capability sprint
  - Phase 2 (Days 8–14): Test + bug fix
  - Phase 3 (Days 15–21): Auth + billing + email + marketing
  - Phase 4 (Days 22–28): Soft launch + iterate
  - Phase 5 (Days 29–35): Public launch (target ~end of July 2026)
- **No paid APIs in V1:** No Crunchbase, Ahrefs, SEMrush, Apollo, etc.
  Free sources only (Reddit JSON, ProductHunt RSS, public scrapes).
- **No SOC2 audit, no HIPAA, no GDPR full audit** at launch. Defer until
  post-revenue.

---

## 4 · Launch goal

A monetizable, self-serve SaaS at `cockroach.<domain>` (or whatever the
final domain is — see Open Questions §10).

**Free tier:** 5 chats/month, 1 active project, 1 idea-validation
report/month, 3 watermarked exports/month.

**Pro tier ($29/mo):** unlimited chat, up to 5 active projects, all 13
modes, unlimited exports unwatermarked, project memory + decision log
+ artifacts, brand kit, email support.

(Max / Team / Enterprise tiers come later — not in V1.)

**Marketing surface:** single landing page at root domain explaining
the product + a "Start free" CTA into the app.

---

## 5 · Build plan — day by day

### Phase 1: Build (Days 1–7, 2026-04-26 → 2026-05-02)

**Day 1 — TODAY (2026-04-26)**
- [ ] Resolve git divergence (15 remote commits vs our local commit) — BLOCKER for everything else
- [ ] Update `documentation.md` and `ARCHITECTURE.md` to reflect Layaa AI ownership + SaaS positioning
- [ ] Create this `claude.md` ✓
- [ ] Sketch Layaa AI brand identity (text logo + accent palette, can refine later)
- [ ] Open Stripe account (founder action)
- [ ] Open Resend account or AWS SES for transactional email (founder action)
- [ ] Decide final domain (founder action — see Open Questions §10)

**Day 2 (2026-04-27)**
- [ ] Replace no-auth UUID model with Supabase Auth (email/password + Google OAuth)
- [ ] Migrate `users.id` from `text` to `uuid` linked to `auth.users(id)`
- [ ] Backfill existing 4 profiles to Auth users (or fresh-start if data is throwaway)
- [ ] Enable RLS on every table; add per-user policies via `auth.uid()`
- [ ] Replace `GRANT ALL anon` with policy-driven access
- [ ] Rotate Supabase anon key (now actually meaningful)
- [ ] First-run flow: signup → email verify → onboarding tour

**Day 3 (2026-04-28)**
- [ ] Onboarding flow: 4-step (welcome → mode tour → "have an idea or want one?" → first chat)
- [ ] Founder Fit assessment (lightweight, persists as memory)
- [ ] Update `ProfileSelector` → become a real account-selector for orgs (deferred) / for now redirect to a single-account flow
- [ ] Introduce `org_id` table + plumbing (single-user-per-org for V1, ready for Team tier later)
- [ ] Account settings page (profile, password, sign out)

**Day 4 (2026-04-29)**
- [ ] Stripe integration: products, prices, checkout, customer portal
- [ ] Webhook handler for `customer.subscription.{created,updated,deleted}`
- [ ] `subscriptions` table on Supabase; tier resolution helper
- [ ] Free vs Pro tier feature gating in code (decorator pattern via `useTier()` hook)
- [ ] Quota enforcement on `/api/chat`: per-user counters, hard cap on free, soft on Pro

**Day 5 (2026-04-30)**
- [ ] Project spine migrations (Phase 1 from documentation.md):
  - extend `projects` table (stage, chosen_idea_id)
  - new `decisions` table
  - new `project_artifacts` table
  - add `project_id` FK to `chats` and `memory_items`
- [x] `useProjects` hook
- [ ] `/projects` list page (active-default view; stage filter chips; create modal; skeleton + empty state)
- [ ] Project detail page with 4 tabs: **Chats / Decisions / Artifacts / Inbox**
- [ ] **Decisions tab defaults to Reversibility Kanban** (Reversible / Expensive / One-way columns) — Notion launched this exact pattern Feb 2026; validates the Bezos schema design
- [ ] Decision form modal (category, question, decision, reversibility, optional pre_mortem + revisit_at)
- [ ] Inbox tab — actionable items: revisit-due / decay-near / pulse-overdue
- [ ] KPI strip on project detail from `health_score` jsonb
- [ ] **Project switcher in left sidebar** (Notion-style top-of-sidebar; higher discoverability than chat-header)
- [ ] "Start project from this chat" action
- [ ] Project-aware system prompt (latest 10 decisions + project description injected when active)
- [ ] Skeleton loaders (Linear/Stripe pattern) for list + detail tabs
- [ ] Empty states with action prompts (e.g., "Start your first project from a validation chat")

**Day 6 (2026-05-01)**
- [ ] Author 4 operator-mode KBs:
  - `kb/modes/PRICING.md`
  - `kb/modes/GO_TO_MARKET.md`
  - `kb/modes/FUNDRAISING.md`
  - `kb/modes/HIRING_AND_EQUITY.md`
- [ ] Wire into `kb-mode-loader.ts` + `APP_MODES`
- [ ] Mode reorder in nav: post-idea modes promoted; discovery modes in submenu
- [ ] Brand kit MVP: per-org logo upload + 1 accent color → applied to PPTX/PDF exports
- [ ] Watermark on free-tier exports

**Day 7 (2026-05-02)**
- [ ] Marketing landing page at root (chat moves to `/app`)
- [ ] Privacy policy + ToS (template-based via Termly or hand-written from a template)
- [ ] Cookie banner for EU visitors (if relevant)
- [ ] Sentry wired to logger
- [ ] PostHog wired for product analytics
- [ ] Cost-monitoring dashboard (LLM tokens per user, cumulative spend)
- [ ] Email templates: welcome, password reset, payment receipt, weekly digest stub
- [ ] Dry-run end-to-end: signup → onboarding → first project → chat → upgrade → export → cancel

### Phase 2: Test + bug fix (Days 8–14, 2026-05-03 → 2026-05-09)

- [ ] Internal team test (Abhishek, Shubham, the 4 default profiles as Layaa AI team accounts)
- [ ] Beta cohort (5–10 friends-and-family founders) with Pro access for free
- [ ] Daily bug bash → triage → fix → redeploy
- [ ] Cost monitoring: any user above expected token spend gets reviewed
- [ ] Onboarding refinement based on observed drop-off
- [ ] Mobile (PWA) sanity check on iOS Safari + Android Chrome
- [ ] Final security review: RLS policies tested for cross-user leakage, share tokens scoped correctly
- [ ] Performance: cold-start cost on Vercel functions, bundle size reduction (currently 3 MB / 920 KB gzip)

### Phase 3: Polish + soft launch (Days 15–25, 2026-05-10 → 2026-05-20)

- [ ] Open beta — invite list goes live (signup gated by waitlist or open)
- [ ] First 50 paying users
- [ ] Feedback loops: NPS pulse + in-app feedback widget
- [ ] Iterate on highest-friction points
- [ ] Marketing assets prep: ProductHunt page, HN launch text, demo video, screenshots, landing-page copy refinement, Twitter thread
- [ ] First weekly digest email goes out
- [ ] Affiliate / referral program scaffolding (deferred to post-launch if time-tight)

### Phase 4: Public launch (Days 26–35, 2026-05-21 → 2026-05-31)

- [ ] **Launch day = 2026-05-31** (or earlier if everything's green)
- [ ] ProductHunt + HN + Twitter coordinated launch
- [ ] Founder communities: Indie Hackers, IndiePass, r/Entrepreneur, r/SaaS
- [ ] Watch the support inbox + feedback channel for first 72 hours
- [ ] Hot-fix any issues
- [ ] Post-launch retrospective

---

## 6 · Current state snapshot (live)

**Build status:** ✓ typecheck clean · ✓ lint 0 errors (43 warnings, all `any` types, non-blocking)
**Deployed prod:** `cock-roach.vercel.app` (auto-deploys from `main`)
**Local + origin/main:** aligned at `aad125e` (docs: align documentation/architecture/claude.md for Layaa AI launch)
**Canonical remote:** `origin` → `https://github.com/4asaanAI/CockRoach.git` (Vercel-deployed; auto-deploys to `cock-roach.vercel.app` on push)
**Mirror remote:** `layaaai` → `https://github.com/layaaai222-art/CockRoach.git` (Layaa AI's repo; manually kept in sync)

> Note (2026-04-30): origin was briefly layaaai222-art but Vercel is
> hooked to 4asaanAI/CockRoach. Switched origin back. Future commits
> deploy automatically; push to `layaaai` separately if mirror needed.

**Phase 0 (git divergence) → ✅ DONE.**
**Phase 1 Day 1 → ✅ DONE** (legacy deletes; documentation.md + ARCHITECTURE.md updates).
**Phase 1 Day 2 (Project spine — data layer) → ✅ DONE** 2026-04-30.
**Phase 1 Day 3 (Project spine — UI) → ✅ DONE** 2026-04-30 (same-day; we ran ahead).
**Phase 1 Day 4 (Operator modes) → ✅ DONE** 2026-04-30 (still running ahead).
**Phase 1 Day 5 (Specialist modes + UI design + decision-log polish) → ✅ DONE** 2026-04-30.

**Day 2 progress (today, 2026-04-30):**
- ✅ Supabase MCP reconfigured to hosted HTTP + OAuth (project-scope `.mcp.json`).
- ✅ Migration `project_spine_full_schema` applied — extended `projects` (stage, chosen_idea_id, description, health_score, founder_fit_alignment, last_pulse_at) + new `decisions` / `project_artifacts` / `project_pulse_log` tables + nullable `project_id` FK on `chats` and `memory_items` + 9 indexes + unique pulse-per-week constraint + `updated_at` trigger.
- ✅ RLS disabled on the 4 project-spine tables for consistency with the no-auth model; `grant all` to anon+authenticated.
- ⏳ Local file work remaining → schema.sql / policies.sql updated · types.ts created · useProjects hook created · supabase.ts supports new publishable-key var name · `.env` + `.env.example` updated · docs being updated now.

**Backup branch:** `backup-c6a8a8f` (local, pre-merge commit; safe to delete).

**Open notes:**
- 1Password SSH-signing still failing on commits; using `commit.gpgsign=false` per-commit. Re-sign later when 1Password agent is reachable.
- Azure key was rotated 2026-04-30; new key in `.env` and Vercel.
- Supabase auth now via OAuth (hosted MCP at `https://mcp.supabase.com/mcp`); no PAT in chat history.

---

## 7 · Decisions made (with rationale)

- **No-auth model is acceptable for current 4–5 user state but MUST be replaced before public launch.** Phase 1 Day 2 is the auth migration.
- **Pro tier is the only paid tier at launch.** Max + Team + Enterprise come post-launch as we learn what users will pay extra for.
- **Free tier is generous (5 chats/month) by design** — needed for word-of-mouth growth; can tighten post-launch if costs run high.
- **Brutal Honesty stays as a per-user toggle, defaults to balanced.** Some users will love the personality, some will complain — toggle defuses both reactions.
- **No live data integrations at launch.** Crunchbase / Ahrefs / SEMrush / Apollo all $$$/month; out of $2000 budget. Use scrapers + free sources only.
- **No multi-user collab at launch.** Single-user-per-org for V1; org table is set up so Team tier can drop in later without schema rewrite.
- **PWA, not native apps, for V1 mobile reach.** Already comes for free with Vite.
- **Termly or template-based Privacy/ToS at launch.** Lawyer-reviewed comes when revenue justifies it.
- **Existing default profiles (DagnA / Subi / ManU / Gill Saab) become the Layaa AI team's free Pro accounts post-auth migration.**

---

## 8 · Open questions (need founder answers)

These block specific tasks. Asterisks mark blocking-Day-1.

1. *** Domain — `cockroach.ai`? `cockroach.app`? `cockroach.layaaai.com`? Subdomain split (marketing on root, app on `app.`)?
2. *** Merge — should I integrate the 15 remote commits into our local work? (Need permission to run `git merge`.) Or do you handle the merge yourself?
3. *** Stripe account — does Layaa AI already have one, or do you create one today?
4. *** Transactional email provider — Resend (cheaper, modern) or AWS SES (already-have-AWS scenarios)?
5. Logo — is there a Layaa AI / CockRoach logo asset, or do I generate a text-mark version for V1?
6. Beta cohort — do you have a friends-and-family list of 5–10 founders ready to test?
7. Existing 4 default profiles — keep their data after auth migration, or fresh-start everyone?
8. Are the avatar PNGs in `public/profiles/` final, or replace as part of brand refresh?
9. Pricing finalization — is `Free / Pro $29` the call, or do we want a different price point?
10. Launch list — who's our distribution channel on launch day? (Founder's network, ProductHunt, IndieHackers, paid ads?)
11. Azure credit timing — is the $2000 a one-time pool that expires, or refreshing? Affects how aggressive we can be in testing.

---

## 9 · Conventions & guardrails

- **Update protocol after every change** — claude reports: WHAT changed, HOW the platform changes, WHY beneficial, POINTERS to be aware of.
- **Update `documentation.md` and `ARCHITECTURE.md`** alongside any feature change so they don't drift.
- **Update this file** with a new entry under §11 every working session.
- **Never bypass git signing** without explicit one-time approval.
- **Never force-push** without explicit "force push, I authorize destruction" instruction.
- **Brutal Honesty rule:** if a planned feature is harmful or strictly worse than an alternative, claude must flag before silently building. Timeline impossibility is OUT-OF-SCOPE for flagging — that's been acknowledged.
- **Cost-watch rule:** before any change that increases per-user LLM spend (longer prompts, more tools, multi-turn agents), claude states the projected token-impact and asks for go-ahead.
- **Question-first rule:** when claude is unsure about product direction or scope, ASK before building.

---

## 10 · Cost tracking

| Date | Azure spend (cumulative) | Trigger | Notes |
|---|---|---|---|
| 2026-04-22 | ~$0 | Session work | Internal-only usage so far |
| ... | | | |

**Budget breakdown for 35 days:**
- Azure inference budget: ~$1500 (leaves $500 buffer for unexpected)
- Daily testing burn: target <$30/day during Phase 1–2; tighten if spiking
- Public-launch buffer: $300 set aside for first 1000 free users hitting the API

**Kill-switch policy:** if cumulative Azure spend exceeds $1700 before
launch, freeze all non-essential testing and shift to mock-mode for QA.

---

## 11 · Update log

### 2026-04-26 — Plan kickoff (initial draft)
- Created `claude.md` (this file).
- Outlined 35-day plan from build → test → soft launch → public launch.
- Defined V1 scope: auth + billing + project spine + 4 operator modes
  + brand transition + marketing site.
- Identified 11 open questions blocking specific tasks.

### 2026-06-29 — Plan revision (founder corrections)
- Date corrected to today (2026-06-29).
- **Auth + billing + email moved to the END** (Phase 3) — founder
  wants product capability built first since no users exist yet.
- **Address founder as "Abhi"**, not Abhishek (saved to memory).
- **Two-person team**: Shubham off the project; build is Abhi + Claude.
- **Timeline flexible** — compress when ahead; minimize idle time.
- **Small-task discipline** — break big asks into atomic steps,
  use `/batch` on independent sub-tasks to avoid hallucination drift.
- **Update protocol** locked in: every change-set gets a 4-line report
  (What / Changes / Why beneficial / Pointers).
- Plan approved + saved at `~/.claude/plans/compressed-conjuring-wilkes.md`.
- Next action: Phase 0 git divergence resolution.

### 2026-06-29 — Phase 0 + Day 1 execution
- **Phase 0 (git divergence) ✅ resolved.** Reset local to origin/main
  (which had been silently integrated by another contributor, likely
  Shubham before stepping off). Restored `documentation.md` (only
  missing piece). Pushed as commit `2f48765`.
- **Phase 1 Day 1 progress:**
  - Deleted 4 legacy files (COCKROACH_AGENT_SYSTEM_PROMPT.md,
    COCKROACH_MASTER_PROMPT.md, metadata.json, supabase_schema.sql)
    that the other contributor restored. Authorized by Abhi. Pushed
    as `dbaf983`. -1064 lines, build still clean.
  - Updated `documentation.md` to reflect Layaa AI ownership +
    SaaS-launch positioning + 2026-06-29 date.
  - Updated `ARCHITECTURE.md` for Layaa AI parent + SaaS staging
    note.
  - This `claude.md` §6 + §11 entry being added now.
- **Verified post-merge:** typecheck ✓ / lint 0 errors / npm audit 0.
- **Backup branch `backup-c6a8a8f`** still local; safe to delete
  whenever Abhi wants.
- Next: complete Day 1 by committing the doc updates, then start
  Day 2 (Project spine — data layer migrations).

### 2026-04-30 — Phase 1 Day 2: Project spine (data layer)
- **Strategy lock-in.** Researched ChatGPT Projects, Claude Projects, and
  Bezos's Type-1/Type-2 doors framework. Both competitors offer
  sandboxed memory + file uploads; neither has structured decision logs,
  reversibility classification, or weekly pulse summaries. CockRoach's
  2x lever is the persistent venture-context layer with:
  - Decision log with reversibility (`reversible | expensive | one_way`)
    + `reversibility_decay_at` (decisions become harder to reverse over
    time; surface this).
  - Decision dependency graph via `depends_on_decision_id`.
  - Decision reversal trail via `reversed_at` + `reversed_by_decision_id`.
  - `pre_mortem` field captured at decision time.
  - Weekly auto-generated `project_pulse_log` summarising the project's
    state — Claude's 24h synthesis, but founder-focused + persisted.
  - Versioned `project_artifacts` with `parent_artifact_id` lineage
    (ChatGPT/Claude can't show diff between Pitch Deck v2 and v3; we
    will).
  - Project `health_score` + `founder_fit_alignment` JSONB fields for
    composite metrics over time.
- **Supabase MCP swap.** Moved from npx stdio (PAT-based) to hosted
  HTTP MCP at `https://mcp.supabase.com/mcp` with OAuth flow. Cleaner
  auth model — no PAT in chat history, no rotation needed for the MCP.
  `.mcp.json` at project scope so future sessions inherit the setup.
- **Migration `project_spine_full_schema` applied.** Extended `projects`
  with 6 new columns + stage check constraint; created `decisions`
  (16 cols + 5 indexes + 3 check constraints), `project_artifacts`
  (versioning + 3 indexes + 3 check constraints), `project_pulse_log`
  (1 unique index for project+week dedup); added nullable `project_id`
  FK on `chats` and `memory_items`; created `set_updated_at_now()`
  trigger function and bound it to `project_artifacts`.
- **Read flag finding.** New tables defaulted to RLS-on (Supabase
  default). Disabled RLS on the 4 spine tables to match the rest of
  the no-auth-phase schema; `grant all` to anon + authenticated.
- **Local file work shipped:**
  - `supabase/schema.sql` — full idempotent schema with all spine
    tables and indexes.
  - `supabase/policies.sql` — grants + RLS-disable for the 4 new
    tables.
  - `src/lib/types.ts` — TypeScript types for Project, Decision,
    ProjectArtifact, ProjectPulseLog plus enum metadata
    (PROJECT_STAGES, DECISION_CATEGORIES, REVERSIBILITY_LEVELS,
    ARTIFACT_KINDS).
  - `src/hooks/useProjects.ts` — fetch/create/update/archive/remove
    + memoised `byId`.
  - `src/lib/supabase.ts` — supports both `VITE_SUPABASE_PUBLISHABLE_KEY`
    (preferred) and `VITE_SUPABASE_ANON_KEY` (legacy fallback).
  - `.env` updated with the new publishable key alongside the legacy
    JWT (gitignored).
  - `.env.example` updated to show new var as preferred.
- **Verified:** `npm run typecheck` passes; build pipeline clean.
- **Next:** Day 3 (Project spine — UI).
  - `/projects` list page + project detail page (4 tabs: Chats /
    Decisions / Artifacts / Reminders).
  - "Start project from this chat" action.
  - Project switcher in chat header.
  - Project-aware system prompt (latest 10 decisions + project
    description injected when active).
  - Mode reorder + Discovery submenu.

### 2026-04-30 — Phase 1 Day 3: Project spine (UI)
- **Research lock-in.** Investigated ChatGPT Projects, Claude Projects,
  Notion's new "Decision Tracker Kanban" template (Feb 2026), Linear,
  Vercel dashboard patterns, and 2026 SaaS UI trends. Two adoption
  decisions:
  - **Reversibility Kanban** as the default decisions view — Notion
    just shipped this exact pattern, validating Bezos's framework as
    a real UX primitive (not just a mental model).
  - **Project switcher in left sidebar (top, Notion workspace-pattern)**
    rather than chat header — higher discoverability per Notion's
    workspace-switcher design.
- **Shipped (3 commits, all today):**
  - **Batch A** (`7b412b1`): hooks + project list page.
    - `useDecisions(projectId)` — fetch + log + markRevisited + reverse
      (with full reversal trail). The `reverse()` helper inserts a
      replacement decision and stamps the original with `reversed_at`
      + `reversed_by_decision_id`, so no decision history is ever lost.
    - `useArtifacts(projectId)` — fetch + save + saveNewVersion
      (auto-bumps `version` and sets `parent_artifact_id`) + remove.
    - `usePulseLog(projectId)` — read-only fetcher; pulse generation
      is server-side later.
    - `useProjectInbox({ project, decisions, pulseLogs })` — pure
      derivation surfacing actionable items: revisit_due / decay_near /
      pulse_overdue / no_recent_activity. Sorted by severity → days
      overdue.
    - `ProjectsList` component with stage-color-coded cards, filter
      chips (Active / All / per-stage), skeleton loaders (Stripe
      pattern), empty state with action prompt.
    - `CreateProjectModal` with name + description + stage selector.
  - **Batch B** (`b1d29dd`): project detail page + 4 tabs +
    decision form modal.
    - `ProjectDetail` with header (rename in place, stage selector
      dropdown, archive button), KPI strip (Linear/Vercel pattern;
      tiles for Created / Last activity / Health / Pulse), 4 tabs.
    - `ChatsTab` — chats with this project's `project_id`; click
      switches to chat view with that chat active.
    - `DecisionsTab` — defaults to **Reversibility Kanban** with 3
      columns (Reversible / Expensive / One-way). Each column gets
      its own colored border and inline help (Bezos reasoning surfaced
      to the user). Card shows: category, question (truncated), decision
      (truncated), confidence, decided-at, plus indicator badges
      (Reversed strikethrough, Revisit due clock, Decay-near alert).
      Toggle to flat List view.
    - `DecisionFormModal` — category grid (11 categories), question +
      decision required textareas, **visual reversibility selector
      with inline Bezos help text** (educates users on the framework),
      confidence pills, optional rationale, collapsible advanced
      section with `pre_mortem` ("if wrong, what's the most likely
      failure mode?") and `revisit_at` date picker.
    - `ArtifactsTab` — kind-color-coded grid; follows
      `parent_artifact_id` chain to find the latest version of each
      artifact root; shows version count and exported_format badge.
    - `InboxTab` — surfaces useProjectInbox items with severity badges
      and original-decision context where applicable.
  - **Batch C** (this commit): sidebar project switcher + project-aware
    system prompt + chat→project linking.
    - `ProjectSwitcher` in left sidebar (top, between brand and
      "New Conversation"). Notion-style: shows current active project +
      caret; dropdown reveals up to 8 active projects + "Manage all
      projects" + "Create new project". Clear button (X) when active.
    - `formatProjectContext(project, decisions)` in `lib/project-context.ts`
      — formats project + latest 10 non-reversed decisions into a
      markdown block for system-prompt injection. Includes pre-mortems.
      Tells the agent: "If the user is about to contradict a recent
      one-way-door decision, flag it before answering."
    - `system-prompt-builder.ts` extended with optional `projectContext`
      param; emits `[PROJECT CONTEXT]…[/PROJECT CONTEXT]` block before
      memory context.
    - App.tsx wires it: useProjects + useDecisions scoped to
      activeProjectId, computes projectContext via useMemo, passes to
      every `buildSystemPrompt` call.
    - New chats inherit `activeProjectId` automatically when inserted.
- **Verified:** `npm run typecheck` passes through all 3 batches;
  `npm run lint` 0 errors (42 pre-existing `any` warnings).
- **Skipped for Day 3 (deferred):** "Anchor existing chat to project"
  pill in chat header (small UX polish; existing chats can be moved
  later); decision dependency graph viz (Day 5+); pulse widget
  visualization (Day 5/6 once first pulse logs exist); cross-project
  search (Day 5).
- **Next:** Day 4 (operator modes — PRICING, GO_TO_MARKET, FUNDRAISING,
  HIRING_AND_EQUITY) + mode reorder + Discovery submenu.

### 2026-04-30 — Phase 1 Day 5: Specialist modes + UI design + decision-log polish
- **Founder ask added during Day 5:** include a UI/UX design skill so
  users can spec the website/app interface for their idea. Synthesized
  with planned specialist modes.
- **Research lock-in.** Pulled current data on each topic:
  - Customer discovery: Mom Test rules (talk life not idea, past
    specifics not future generics, ask "what/how" not "why",
    compliments are fake signal); JTBD timeline questions; segmentation
    by job + pain + authority + urgency; saturation stop rule (3
    consecutive no-news interviews).
  - Legal & ops 2026: Delaware C-corp = VC standard; LLC-to-C-corp
    conversion is $5K-$25K + tax pain so don't take an LLC if raising;
    IP assignment = "single most important legal doc for tech";
    83(b) within 30 days mandatory; FTC non-compete ruling 2024+.
  - Pivot framework (Ries): runway redefined as "pivots remaining, not
    months"; 11 pivot types named; sunk-cost language detector;
    decision matrix with 7 honest signals → score → call.
  - UI design 2026: v0 (code-first React+shadcn), Lovable (full-stack
    with backend+DB), Figma Make / First Draft, Google Stitch 2.0.
    **2x angle: be the strategic upstream — produce structured 5-layer
    specs that 10x the output of these tools** rather than try to be
    them.
- **Shipped (single commit):**
  - 4 new mode KBs in `kb/modes/`:
    - `CUSTOMER_DISCOVERY.md` — Mom Test rules, banned vs approved
      question patterns, JTBD timeline, ICP scoring, saturation stop
      rules. Produces interview script + outreach template + synthesis
      matrix as artifacts.
    - `LEGAL_AND_OPS.md` — entity decision table (Delaware C-corp vs
      LLC vs PBC), Day-0 docs checklist (founder vesting + IP
      assignment + 83(b)), compliance flag matrix by domain (HIPAA /
      PCI / COPPA / GDPR / CCPA / SOC 2 / AI laws / FinSvc / Crypto),
      founder traps section. Explicit "needs a real lawyer" line.
    - `PIVOT_OR_PERSEVERE.md` — Build-Measure-Learn framing, 5 pre-
      questions (real data? hypothesis decomposition? cheapest test?
      data vs feeling? pivot pre-mortem?), 11 Ries pivot types, 7-row
      decision matrix scoring 7-35 → recommendation. Brutal honesty
      built in.
    - `UI_DESIGN.md` — **NEW per founder ask.** 5-layer spec
      framework: IA tree → page-level wireframe specs → design system
      tokens → component inventory → tool-specific paste-ready prompt
      (v0 / Lovable / Figma Make / Stitch). Brand-kit-aware. Doesn't
      try to draw pixels — produces specs that 10x the AI design
      tools' output.
  - `kb-mode-loader.ts` — 4 new ?raw imports + entries (now 17 mode
    KBs total + Skills KB).
  - `App.tsx` APP_MODES — added 4 modes with right groupings:
    - `core`: PIVOT_OR_PERSEVERE (decision-making)
    - `operator`: CUSTOMER_DISCOVERY, LEGAL_AND_OPS
    - `creative`: UI_DESIGN (joins IMAGE_PROMPTING)
    - Icons added: Headphones, Scale, GitBranch, LayoutDashboard.
- **Decision-log polish (the second Day 5 deliverable):**
  - `DecisionFormModal` accepts new optional `defaultCategory` prop;
    pre-selects category when opened with context.
  - `App.tsx` adds `modeToDecisionCategory(mode)` mapper that translates
    the active working mode → the decision category that fits best
    (PRICING → pricing, GO_TO_MARKET → gtm, FUNDRAISING → fundraise,
    HIRING_AND_EQUITY → hiring, LEGAL_AND_OPS → legal,
    PIVOT_OR_PERSEVERE → pivot, POSITIONING → positioning,
    IDEA_VALIDATION/CUSTOMER_DISCOVERY → validation, BUSINESS_MODEL/
    EXECUTION/UI_DESIGN → product, others → other).
  - **"Log decision" button** added to chat header (desktop only,
    visible when project is active). Click → DecisionFormModal opens
    pre-filled with project + user + mode-mapped category. Founder can
    capture any strategic call mid-chat without leaving the
    conversation.
- **Verified:** typecheck ✓, lint 0 errors (42 pre-existing warnings).
- **Skipped (Day 6 territory):** "Save as artifact" prompt on every
  export inside a project; revisit-due banner on app load; project
  pulse summary auto-generation (server-side cron).
- **Next:** Day 6 (frameworks library — Value Equation, ACP, Value
  Matrix, Value Ladder + "Run framework" quick action on project
  page).

### 2026-05-03 — Phase 1.5: "Make it better" (auto-routing + bundle + onboarding + latent features)
- **Why this phase exists.** With 19 modes + 9 frameworks the
  selection UX got hairy and the bundle was shipping 268 KB of
  static markdown to every visitor. Decided on an auto-routing
  default plus targeted improvements before Phase 2 testing.
- **Phase A — Auto-routing + restructured picker.**
  - `api/route-mode.js` Vercel function — calls Azure with a tight
    JSON-mode prompt, embeds the mode catalog inline, falls back to
    GENERAL on any failure (4s hard timeout, 60 req/min).
  - `AUTO` is now the default mode. App.tsx send path resolves AUTO
    via the router; activeMode stays AUTO so the UI persists.
  - Restructured picker — search box, 5 collapsible sections (Smart
    / Core / Build / Discover / Creative), one-line description per
    mode, count badges. Mode pill shows "Auto → PRICING" when
    routed.
  - Project-stage bias in the router system prompt (idea →
    validation/discovery; building → execution/gtm; launched →
    pivot/pricing/hiring) + founder-fit memories injected as routing
    context.
  - `CapabilityChips` component on every assistant message: "Auto-
    picked: [PRICING] [Value Equation]" or "Used: …". Educates users
    about the capability surface passively.
- **Phase B — Code-split mode + framework KBs.**
  - kb-mode-loader.ts and kb-framework-loader.ts replace static
    `?raw` imports with `() => import(...?raw)` thunks. Vite emits
    a separate chunk per loader.
  - buildSystemPrompt becomes async; awaits both KBs in parallel.
  - SettingsAgentBrain inline preview converted to useEffect+state
    with cancellation token.
  - Mode picker preloads selected mode KB on click so first-message
    latency stays flat.
  - Bundle dropped 3,316 KB / 994 KB gz → 3,160 KB / 934 KB gz
    (-156 KB raw / -60 KB gz). 28 new chunks (3-9 KB gz each).
- **Phase C — Onboarding wizard.**
  - `OnboardingWizard.tsx` — 3 steps: Where-are-you (have-idea /
    need-idea / exploring) → Founder Fit (reuses FounderFitModal) →
    sample prompts (curated by chosen path; click → prefills input
    + switches mode).
  - `shouldShowOnboarding(userId, hasChats, hasProjects)` helper:
    empty-state + localStorage flag.
  - Auto-trigger 600ms after user + chats + projects load.
- **Phase D — Latent features.**
  - **D1**: DocumentViewer accepts `onExported` callback. App wires
    it: when project active, toast shows "Save to project" action;
    inserts into project_artifacts with auto-detected kind.
  - **D2**: `api/generate-pulse.js` — fetches last 7 days of
    decisions + chats, asks Azure for 1-page weekly pulse, upserts
    into project_pulse_log. New "Weekly Pulse" panel on InboxTab
    with Generate/Regenerate button + markdown render.
  - **D3 (deferred)**: brand kit needs Supabase Storage setup;
    waiting until post-auth.
  - **D4**: memory list items color-coded by category (founder_fit
    amber, general muted, others primary).
- **Verified:** typecheck ✓, lint 0 errors, build ✓ across all 4
  phases. 4 commits pushed to both remotes (4asaanAI + layaaai222-
  art).
- **Next:** Phase 2 of original launch plan — bug bash + perf check
  + cross-browser/PWA + cost monitoring, before Phase 3
  (auth/billing).
- **Research lock-in.** Pulled 2026 data on each topic to make the KBs
  decision-ready, not generic:
  - PRICING: Van Westendorp PSM still gold standard; anchor Pro tier
    near $29/seat; max 3-4 tiers (>4 cuts conversion ~30%); 1% pricing
    improvement = 11% op-profit lift; tiered base + usage overage is
    2026 default; value metrics correlate with 30% growth + 15-26%
    retention lift.
  - GTM: Hybrid PLG+SLG is default $5K-$50K ACV (2x revenue growth vs
    pure-SLG); pure PLG below $5K, pure SLG above $50K with multi-
    stakeholder buys. Bullseye framework for channel selection.
  - FUNDRAISING: SAFEs = 90% of pre-seed, 64% of seed (Q1 2025); SAFE
    stacks with conflicting MFNs cause retroactive cap-table chaos;
    inverted cap tables (investors > founders) = uninvestable; founder
    ownership red zones documented per stage.
  - HIRING: FAST framework (3 stages × 3 advisor levels); founders/
    employees 4yr/1yr-cliff non-negotiable; advisors 2yr/3mo-cliff;
    10-20% option pool; first 10 employees collectively ~10% equity.
- **Shipped (single commit):**
  - 4 new mode KBs in `kb/modes/`:
    - `PRICING.md` — model/structure/levels/packaging decisions; van
      Westendorp + Gabor-Granger scripts; 7-row model selection table;
      tiered packaging traps; produces pricing-page copy + survey +
      sensitivity model artifacts.
    - `GO_TO_MARKET.md` — ACV-based motion framework; full Bullseye
      19-channel taxonomy; CAC math non-negotiables; first-100-customer
      Lenny's Newsletter pattern; produces email sequences + cold call
      scripts + landing page copy + CAC sensitivity model.
    - `FUNDRAISING.md` — raise-or-not test; SAFE vs priced with hard
      rules ("max 2 SAFE rounds before priced"; "no MFNs"); 2026 stage
      benchmarks for raise size + dilution; Sequoia-style 12-slide
      deck spec; term-sheet red flags table with push-back language;
      produces deck + cap table + investor list + cold email artifacts.
    - `HIRING_AND_EQUITY.md` — first-5 sequencing per stage; full
      employee equity bands by hire # × stage × seniority; FAST
      advisor framework table; vesting architecture (4y/1y cliff;
      double-trigger acceleration; refresh grants; 83(b) elections);
      sourcing flow with red flags; produces JD + offer template +
      cap table impact + reference script.
  - `kb-mode-loader.ts` — added 4 imports + 4 entries (now 13 mode KBs
    + always-on Skills KB).
  - `App.tsx` — APP_MODES restructured with `group` field
    (`core | operator | discovery | creative`); 4 new modes added
    (PRICING, GO_TO_MARKET, FUNDRAISING, HIRING_AND_EQUITY); icons
    Tag, Target, PiggyBank, UserPlus added.
  - **Mode picker UI** — now renders grouped sections with subtle
    headers (Core / Build the business / Find an idea / Creative
    tools). Discovery modes (IDEA_GENERATION, IDEA_VALIDATION) moved
    out of top-of-list — they're for the secondary "no idea yet"
    entry path. Operator modes promoted to the prominent middle
    section. IMAGE_PROMPTING moved to Creative.
- **Verified:** typecheck ✓, lint 0 errors (42 pre-existing warnings).
- **Skipped (deferred to Day 5):** Brand kit MVP (per-org logo upload
  + accent color applied to exports) — simpler with auth + tier
  context; postpone to Phase 3. Watermark on free-tier exports —
  same; depends on auth/tier.
- **Next:** Day 5 (specialist modes — CUSTOMER_DISCOVERY,
  LEGAL_AND_OPS, PIVOT_OR_PERSEVERE) + decision-log UX polish in
  chat.

### 2026-05-02 — Phase 1 Day 6: Frameworks library + IG-derived skill ports
- **Founder ask mid-day.** Abhi pasted 9 GitHub repos + 6 AI products
  from two Instagram posts and asked: extract the relevant skills,
  port them into CockRoach so every mode gets stronger. WebFetch
  blocked by IG auth gate; Abhi pasted the names; I researched all
  15 in parallel via WebSearch.
- **Triage of the 15:**
  - Direct skill ports (3): `claude-ads` → new PAID_ADS mode;
    `toprank` → new SEO_AND_CONTENT mode; the AI-products list
    (Prism / Astrio / MascotVibe / Perfectly / Inception / theORQL)
    → new COMPETITIVE_TEARDOWN framework with these as 2026 case
    studies.
  - Reference / future infra (not ported now): `context-mode`
    (already partly addressed in SKILLS.md), `agentic-inbox` (post-
    launch email agent ref), `hyperframes` (future demo-video tool),
    `camofox-browser` (api/scrape upgrade path), `Open-Generative-AI`
    (model menu ref for IMAGE_PROMPTING), `FinceptTerminal` /
    `autoHedge` (light reference for FUNDRAISING).
- **Shipped (frameworks library + skill ports, single commit):**
  - 9 framework KBs in `kb/frameworks/`:
    - `VALUE_EQUATION.md` (Hormozi)
    - `LEAN_CANVAS.md` (Maurya 9-block canvas)
    - `JOBS_TO_BE_DONE.md` (Christensen four forces + Ulwick switch
      interview)
    - `NORTH_STAR_METRIC.md` (Sean Ellis criteria + 40% test +
      input metric tree)
    - `VALUE_LADDER.md` (Brunson tripwire→high-ticket sequencing)
    - `VALUE_MATRIX.md` (pain×gain×segment×feature fit grid; 4
      patterns: tight/diffuse/wrong-segment/wrong-product)
    - `ACP.md` (Isenberg Acquisition×Churn×Pricing diagnostic)
    - `DREAM_100.md` (Holmes/Brunson; B2B-ABM and B2C-creator
      variants; 4-touch 6-month rhythm)
    - `COMPETITIVE_TEARDOWN.md` (Dunford 5-layer teardown; with
      Prism/Astrio/MascotVibe/Perfectly/Inception/theORQL as
      worked 2026 examples)
  - 2 new mode KBs in `kb/modes/`:
    - `PAID_ADS.md` — 7-block audit (account/targeting/creative/LP/
      tracking/bidding/reporting), channel-fit by ACV, hook taxonomy,
      RSA checklist, creative briefs. Distilled from claude-ads.
    - `SEO_AND_CONTENT.md` — 5-pillar audit (technical/on-page/
      content/authority/UX), keyword research workflow with cluster
      scoring, E-E-A-T content brief template, programmatic-SEO
      criteria, publishing rhythm. Distilled from toprank.
  - `src/lib/kb-framework-loader.ts` — new loader (mirrors mode loader
    pattern); exports FRAMEWORK_KBS + FRAMEWORK_CATALOG metadata
    (id, name, origin, oneLine, bestFor) for UI surfacing.
  - `src/lib/kb-mode-loader.ts` — added PAID_ADS + SEO_AND_CONTENT
    imports + map entries.
  - `src/lib/system-prompt-builder.ts` — accepts optional
    `activeFrameworkId`; injects `[FRAMEWORK KB — {Name} ({Origin})]`
    block when set, with directive to follow the Output structure
    section verbatim.
  - `src/App.tsx` — added Megaphone + TrendingUp icons; PAID_ADS and
    SEO_AND_CONTENT entries in APP_MODES `operator` group;
    `modeToDecisionCategory` mapper updated (both → `gtm`).
- **Total mode count: 19** (was 17). Frameworks: 9 (new sub-system).
- **Verified:** `npm run typecheck` ✓; `npm run lint` 0 errors
  (42 pre-existing `any` warnings, non-blocking).
- **Skipped (deferred):** "Run framework" quick-action UI button on
  project detail page — wired the KB injection plumbing but UI
  surfacing comes next. The chat can still receive a framework via
  prompt scaffolding once we add the dropdown. Also deferred:
  internal `api/scrape` swap to camofox; demo-video tooling via
  hyperframes; agentic-inbox post-launch.
- **Next:** Wire the "Run framework" UI on project detail page
  (small Frameworks Quick Actions section) → push commit, then
  Day 7 (Discovery enhancements: ideas table + catalog,
  AI_FOUNDER_FIT assessment, Idea of the Day).

---

*This file is the source of truth for "where are we?" and "what's next?".
Read it before starting any session. Append to §11 after every working
session. Update §6 (state snapshot), §8 (open questions), and §10 (cost
tracking) as their status changes.*
