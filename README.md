# CockRoach

Internal AI-assistant web app. React + Vite + TypeScript frontend, Vercel serverless functions (`/api/*`), and Supabase for state.

## Stack

- **Frontend**: React 19 + Vite + Tailwind, served as static build from Vercel
- **API**: Two serverless functions under `api/`
  - `api/chat.js` — streaming Azure OpenAI proxy (server-side key, origin allow-list, per-IP rate limit)
  - `api/scrape.js` — SSRF-safe URL content extractor (same hardening)
- **Database**: Supabase Postgres — schema and seed in `supabase/`
- **Dev server**: `server.ts` (Express) mounts the same `api/*` handlers as routes, so dev = prod

## Run locally

**Prerequisites**: Node 18+ (24.x recommended to match Vercel runtime).

```bash
npm install
cp .env.example .env     # then fill in the values
npm run dev              # http://localhost:3000
```

### Required environment variables

`.env` is read by `server.ts`; on Vercel set the same keys in **Settings → Environment Variables**.

**Server-only** (never sent to the browser — used by `/api/chat`):
- `AZURE_OPENAI_ENDPOINT` — e.g. `https://your-resource.cognitiveservices.azure.com/`
- `AZURE_OPENAI_KEY`
- `AZURE_OPENAI_DEPLOYMENT` — deployment name
- `AZURE_OPENAI_VERSION` — e.g. `2024-12-01-preview`
- `AZURE_OPENAI_MODEL` — e.g. `gpt-5.3-chat` (used as a display label)

**Client** (exposed to the browser — must be `VITE_`-prefixed):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Database setup

Apply in this order against a fresh Supabase project:

```bash
psql "$DATABASE_URL" -f supabase/schema.sql    # tables, FKs, indexes (idempotent)
psql "$DATABASE_URL" -f supabase/policies.sql  # grants + RLS state
psql "$DATABASE_URL" -f supabase/seed.sql      # 4 default profiles
```

Or run them through the Supabase SQL editor in the same order.

## Deploy

This repo is connected to a Vercel project (`cock-roach` team `aasaanais-projects`). Pushes to `main` deploy automatically.

- Build: `vite build` → `dist/` (set by the Vercel Vite preset)
- Functions: every file under `api/` ships as a Node.js serverless function
- Env vars live in Vercel project settings — rotate there, not in the repo

## Scripts

- `npm run dev` — Express + Vite middleware on :3000
- `npm run build` — production Vite build
- `npm run preview` — serve the built `dist/`
- `npm run lint` — `tsc --noEmit` (strict)

## Security model

Small internal tool (≤5 profiles). No Supabase Auth; user identity is a
client-generated UUID. Row-level security is intentionally disabled — see
`SECURITY.md` for the full trust model and what changes if you ever add auth.

## Further reading

- **`ARCHITECTURE.md`** — complete internals reference: every module, API,
  table, mode, state field, and extension recipe.
- **`SECURITY.md`** — trust model, credential rotation playbook.
- **`kb/base-prompt.md`** — the Cockroach agent's top-level system prompt.
- **`kb/modes/*.md`** — per-mode behavior guides (one per working mode).
- **`kb/SKILLS.md`** — how the agent produces PPTX / XLSX / PDF / charts.
