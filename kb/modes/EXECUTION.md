# Mode KB — EXECUTION (Build Plan)

## Purpose
Convert a validated idea or decision into a concrete build plan — what the
user does Monday morning, what they do in week 4, what they do in month 6.
Time-bounded, resource-scoped, milestone-driven.

## Inputs — required before planning

1. **What's being built / shipped** (clear from conversation or ask)
2. **Who's building** (solo founder? team of 3? agency?)
3. **Budget & runway** (self-funded 6 months? raised round?)
4. **Hard deadline, if any** (demo day, seasonal launch, grant deadline)
5. **Current state** (pre-code? prototype? MVP live? paying users?)

If any are missing, ask ONE sharpening question. Don't plan into the void.

## Plan structure — 4 layers

### Layer 1: North Star (1 paragraph)
The one-sentence outcome 90 days from now. Measurable. Example:
> "By end of day 90, we have 25 paying customers at $99/mo, $2.5K MRR,
> gross retention above 90%."

### Layer 2: Milestones (3–5)
Reverse-engineered from the North Star. Each has:
- **Milestone name** (verb-led, e.g. "First 10 paying customers")
- **Success criteria** (binary — either hit or not)
- **Target date** (absolute date, not week number)
- **Dependencies** (what must be true for this to even start)
- **Biggest risk** (one line — the thing most likely to delay this)

### Layer 3: Weekly sprints (full plan, weeks 1–12)

Table per week:

| Week | Goal | Top 3 tasks | Definition of done | Blockers watching |
|---|---|---|---|---|

**Task quality bar:**
- Each task is achievable in ≤ 3 days of solo work. If longer, break it.
- Each task has a concrete deliverable (not "research X" — say "produce
  comparison doc of 3 payment providers with fees, uptime, dev effort").
- No more than 3 tasks per week. Any more is fantasy unless team ≥ 3.

### Layer 4: Resource & spend plan

**People:** role, FTE %, cost, when needed.

| Role | FTE | When | Monthly cost | Notes |
|---|---|---|---|---|

**Tools & infrastructure** (line items, monthly $):
- Hosting: $
- APIs / LLM: $
- Analytics / logging: $
- Domain / email: $
- Design / legal / accounting: $
- **Total tooling:** $

**3-scenario budget** (12 weeks):
- Lean (just you, free tiers everywhere): $
- Realistic (some paid tools, part-time contractor): $
- Aggressive (full team, paid tooling, ads): $

## Risk register

Top 5 risks. For each: impact (1-5) × probability (1-5) = score. Sort
descending. For top 3, name one concrete mitigation the user can do THIS
week.

| # | Risk | Impact | Prob | Score | Mitigation this week |
|---|---|---|---|---|---|

## Metrics & check-ins

- **Weekly metrics** — 3 leading indicators to track every Friday
- **Monthly review** — the 5 questions to ask: what worked / what didn't /
  what's our current runway / what's the biggest decision coming up / does
  the plan still match reality?

## Honesty rules

- **Don't pad.** A real 90-day plan has slack, not filler. Every week has
  a thing that can slip without killing the plan.
- **Call out fantasy.** If the user is solo with no tech skills planning
  to ship a custom AI platform in 8 weeks, say so on page 1 before
  producing the plan.
- **Flag the riskiest week.** Usually week 6–8 is where motivation crashes.
  Name it. Tell the user to expect it.

## Output closing

```
**Make this a shareable doc?** → PDF / DOCX / PPTX (SKILLS KB)
**Want a Gantt view?** → Mermaid chart of dependencies
**Weekly digest?** → Set up memory item to re-ground each Monday
**Funding needed?** → Pivot to KB-03 (USA grants & funding)
```
