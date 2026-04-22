# Security

Scope and threat model for this internal CockRoach deployment.

## Trust model

This app is intentionally built as a **small internal tool for a fixed set of
trusted profiles** (currently 4). There is no Supabase Auth, no sign-in flow,
and no per-request server-side identity check. User identity is a
client-generated UUID stored as `public.users.id`.

What that means in practice:

- Anyone who has the Supabase anon key (embedded in every client bundle by
  design) and a valid `user_id` can read/write any table. RLS is off and
  `GRANT ALL` is granted to `anon` because nothing below the key can
  distinguish users.
- The deployed URL is non-secret. If you publish the URL or commit the built
  bundle anywhere public, treat that as equivalent to publishing the DB.
- Share links (`/chats?shared=…`) are effectively the only feature with a
  scoped capability: a token grants read access to one chat only.

If this ever grows beyond an internal prototype, migrate to Supabase Auth and
flip every `disable row level security` in `supabase/policies.sql` to
`enable row level security` + `auth.uid()::text = user_id` policies.

## What is protected

- **Azure OpenAI credentials** — lives only in server env (`AZURE_OPENAI_KEY`),
  read by `api/chat.js`. The browser posts `{ messages }` to `/api/chat` and
  receives a streamed response. The key never touches the client.
- **`/api/chat` and `/api/scrape`** — both reject requests from unknown
  origins (allow-list of Vercel deployment URLs + `localhost`) and rate-limit
  per client IP (best-effort, per-instance in-memory).
- **Shared chat links** — 30-day expiry (`share_expires_at`) and explicit
  revoke (`share_revoked_at`). A share link that is expired or revoked no
  longer resolves.

## Credential rotation

### Azure OpenAI key

1. Azure Portal → your OpenAI resource → **Keys and Endpoint**
2. Click **Regenerate Key 1** (keep Key 2 as the emergency fallback)
3. Copy the new key → paste into:
   - Vercel project → Settings → Environment Variables → `AZURE_OPENAI_KEY`
   - Your local `.env`
4. Redeploy (Vercel re-pulls env on next build; trigger via a commit or
   "Redeploy" in the dashboard)

### Supabase anon key

Rotating the anon key in the absence of auth does **not** meaningfully
improve security — RLS is disabled so the new key is just as over-privileged
as the old one. Still, rotate if a key has been exposed in a public location
(commit history, screenshots, chat transcripts with strangers):

1. Supabase Dashboard → Settings → API → `anon` `public` row → **Roll**
2. Update `VITE_SUPABASE_ANON_KEY` in Vercel env + local `.env`
3. Redeploy. Active browser sessions see request failures until the new
   bundle loads.

### Supabase personal access token (for MCP / CI)

If a `sbp_*` token ever ends up in a repo, script, or chat:

1. https://supabase.com/dashboard/account/tokens → find the token → **Revoke**
2. Generate a new one if you still need MCP access

## Share-link hygiene

- Default expiry is 30 days from creation (`handleShareChat` in `App.tsx`).
- To revoke immediately, click **Revoke** on the orange share banner. This
  sets `share_revoked_at = now()` and the link stops working on next load.
- `supabase/schema.sql` has a partial index on active tokens
  (`idx_chats_active_share_token`) so lookup stays fast even as revoked
  tokens accumulate.

## Reporting

There is no public bug-bounty program. For security issues in this internal
deployment, contact the repo owner directly (see git log).
