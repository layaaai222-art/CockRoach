# Mode KB — LEGAL_AND_OPS (Entity, contracts, IP, compliance)

## Purpose
Surface the legal and operational decisions a founder must get right
early, with concrete recommendations and a clear "this needs a real
lawyer" line. Not legal advice — but a competent first pass that helps
the founder ask better questions when they do hire counsel.

## Pre-work — required before substantive work

1. **Stage** — pre-incorporation, just-incorporated, post-fundraise,
   scaling
2. **Geography** — US (most common), UK, EU, India, Singapore, other
3. **Plans to raise venture capital** (yes/no/maybe) — drives entity
   choice
4. **Co-founders** — solo, pair, more; equity split agreed yet?
5. **Domain risks** — healthcare (HIPAA), payments (PCI), kids' data
   (COPPA), EU users (GDPR), enterprise B2B (SOC 2)

If "I just want to launch" — fine. But surface the 3 most-bitten
founders' mistakes (see §"Founder traps") first.

## Decision 1 — Entity choice

**The 2026 calculus (US-based, planning to raise VC):**

| Entity | Use when | Why / why not |
|---|---|---|
| **Delaware C-Corp** | You'll raise VC, ever. Period. | **2026 standard.** Investor-friendly. Stock options work cleanly. Most legal templates assume this. |
| LLC | Solopreneur, lifestyle business, no plans to raise | Pass-through tax. Easier filings. **But: VCs won't invest in an LLC.** Conversion costs $5K-$25K + tax pain. |
| S-Corp | Service business, payroll-heavy, no plans to raise | Pass-through with payroll tax savings. Same VC-blocker as LLC. |
| PBC (Public Benefit Corp) | Mission-driven + raising VC | C-Corp variant with stated public benefit. Allowed by most VCs but adds friction. |
| Foreign / non-US | Specific tax / immigration reasons | Almost never the right call if you'll raise US VC; flip-up to Delaware later costs $50K+. |

**Default recommendation if uncertain:** Delaware C-Corp. Even if you
think you won't raise, optionality is cheap to keep open and
expensive to recover.

**How to actually do it (pick one path):**
- **Stripe Atlas** — $500 one-time, 1-2 weeks. Includes EIN, basic
  bylaws, founder stock issuance, IP assignment, 83(b) helper.
  Recommended for first-time founders.
- **Clerky** — $799+. Cleaner cap table tooling, more startup-
  attorney-friendly templates. Better if you've got >2 co-founders
  or any complexity.
- **Direct with a startup lawyer** — $2K-$5K flat-fee packages from
  firms like Cooley, Wilson Sonsini, Goodwin, Lowenstein Sandler.
  Best if you have specific needs (international founder, dual-class,
  PBC, prior IP issues).
- **DIY filing through Delaware Division of Corporations** — $90 fee.
  Don't. The savings vs the time spent + risk of malformed docs
  isn't worth it for a venture-track startup.

## Decision 2 — Founder agreements (the docs to sign on day 0)

**Day 0 (pre-incorporation or week-1 post):**

1. **Founder vesting agreement** — 4-year vest, 1-year cliff. Each
   founder's stock is subject to repurchase if they leave before
   vesting. Without this, a co-founder leaving at month 2 keeps
   33% of your cap table forever. Existential.
2. **IP assignment agreement** — every founder assigns all
   pre-incorporation work product to the corporation. Without this,
   the company doesn't own its own technology. **The single most
   important legal document for tech startups.**
3. **Founder shareholder agreement** (or contained in bylaws):
   - Voting on board / officer roles
   - Right of first refusal (ROFR) on share transfers
   - Drag-along / tag-along rights
   - Death / disability buy-out provisions
4. **Employment / independent-contractor agreements** (even between
   co-founders) — defines comp, role, IP-on-work, confidentiality
5. **83(b) elections** — file within 30 days of stock issuance.
   Missing the 30-day window costs founders 5-figure tax surprises
   when stock vests. **Set a calendar reminder; do not skip.**

## Decision 3 — IP and confidentiality

**For every employee / contractor / advisor / freelancer:**

- **NDA** (mutual or one-way depending on context) — they sign before
  seeing anything sensitive
- **IP Assignment + Confidentiality Agreement** ("PIIA" or
  "CIIAA") — broader than NDA, transfers ownership of all work
  product
- **Non-solicitation** (rather than non-compete; non-competes are
  unenforceable in CA, NY, MN and limited in many others as of 2024+
  FTC ruling)

**For freelancers / contractors specifically:**
- Statement of work with deliverables, payment, timeline
- Explicit "Work for Hire" + assignment language (because "work for
  hire" alone doesn't cover everything for tech IP)
- Termination / kill-fee terms

**Open-source caveat:** if your team uses GPL / AGPL code, you must
disclose its presence to investors. AGPL specifically can taint
proprietary code. Have a software bill of materials (SBOM).

## Decision 4 — Compliance flags by domain

Walk through each project's domain and flag exposure. **Do not
self-certify; recommend a specialist when triggered.**

| Domain | Exposure | First action |
|---|---|---|
| Healthcare data (PHI, identifiable health) | **HIPAA** + state privacy laws | Hire a HIPAA attorney; sign BAAs with vendors; encryption at rest + transit |
| Payments / cards | **PCI-DSS** | Use Stripe / Stripe Elements (offloads most PCI scope); never store raw card data |
| Kids under 13 | **COPPA** | Verifiable parental consent flow; no behavioral ads; DPA reviewed |
| EU residents (any) | **GDPR** | Privacy policy + data processor agreements + DPO if required + 72h breach notification |
| California residents | **CCPA / CPRA** | Privacy policy "Do Not Sell My Info" link; opt-out within 15 days |
| Enterprise B2B selling to large customers | **SOC 2 Type I → II** | Vanta or Drata at $1.5K-$3K/mo; 6-12 month timeline; required by F500 buyers |
| AI agent processing user docs | Emerging AI laws (EU AI Act 2026; CO AI Act) | Disclose AI use; allow opt-out; log decisions |
| Financial services | **MSB / state lender / FinCEN** registration | Specialist counsel — do NOT DIY |
| Crypto / tokens | **SEC + state securities + FinCEN** | Specialist counsel mandatory |

**The 80/20 of starting compliance:**
1. Privacy policy + Terms of Service (Termly $5-10/mo or template)
2. Cookie banner if EU traffic
3. Encryption at rest (Supabase / managed DB defaults this on)
4. Access logs on production
5. Backup verification (restore drill quarterly)

This covers ~80% of breach risk for a pre-Series A startup. Beyond
that = real spend.

## Founder traps (the 3 most-bitten mistakes)

1. **Skipping founder vesting** — "we trust each other." Then someone
   leaves at month 8 and your cap table is broken. Investors will
   require it during DD; do it preemptively.
2. **Fuzzy IP assignment** — work done before incorporation,
   contractor work, code from a previous job. If a single line of code
   has unclear ownership, the company can be sued or blocked from
   selling. Get explicit assignments from everyone who has touched
   the codebase.
3. **Promised equity without papers** — "I'll give you 5% to help."
   Without a written grant, vesting schedule, and 83(b), this becomes
   either nothing (recipient loses) or an ownership claim that blows
   up the cap table. Always paper everything.

## Output structure

When the user asks "what legal stuff do I need to do":

```
## Legal & ops review — {project name}

### TL;DR
- Entity: {recommendation}
- Top 3 actions in next 7 days
- Compliance flags triggered: {list}
- Confidence: {high/medium/low}

### Entity recommendation
{2-3 paragraph rationale tied to fundraising plans + co-founder count}

### Day-0 documents (sign these, in order)
1. [ ] Founder vesting (4y/1y cliff)
2. [ ] IP assignment from each founder
3. [ ] Founder shareholder agreement / bylaws
4. [ ] Employment/contractor agreements between co-founders
5. [ ] 83(b) election filed within 30 days

### Compliance flags
| Trigger | Domain | First action | Specialist needed? |
|---|---|---|---|

### Vendor / contractor template stack
- NDA template (mutual)
- PIIA / IP-assignment template (employees)
- Independent-contractor SOW template
- Customer DPA template (for B2B)

### What needs a real lawyer (not me)
{Explicit list of decisions where founder MUST get counsel}

### Decision-log entry suggestion
Category: legal
Reversibility: **one_way** (entity choice; mistakes here are
expensive to undo)
Pre-mortem: "Wrong if {biggest assumption}"
Revisit: at fundraise milestone or when a domain flag changes
```

## Producing artifacts

- **Day-0 checklist** as a Markdown file with checkboxes
- **NDA / PIIA template** in DOCX (lawyer-review required, but a
  starting point)
- **Compliance matrix** as XLSX — domains × triggers × actions
- **Privacy policy outline** that captures actual data flows in the
  current product (NOT a generic template — references the project's
  real data collection)

## What this mode does NOT do

- **Provide legal advice.** Surfaces frameworks and recommendations;
  every binding decision needs a real lawyer.
- Tax planning / accounting — recommend a CPA + Pilot/Bench bookkeeping
- Patent strategy — recommend a specialized patent attorney
- Trademark searches — recommend USPTO TESS + a trademark attorney
- M&A / exit prep — recommend specialized counsel

## Handoff suggestions

- "Walk me through Stripe Atlas vs Clerky?" → produces comparison
  sheet as artifact
- "Draft my NDA?" → DOCX template; flag lawyer-review need
- "Help me write a privacy policy?" → outline of what to cover; do not
  produce binding policy text without lawyer review
- "Log entity choice as a decision?" → Decision form, category=legal,
  reversibility=one_way
