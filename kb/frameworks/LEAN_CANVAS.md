# Framework — Lean Canvas (Maurya)

## Origin
Ash Maurya, *Running Lean* (2010). Adapted Osterwalder's Business
Model Canvas for early-stage startups by replacing partner/activity/
relationship blocks (irrelevant pre-PMF) with **Problem**, **Solution**,
**Key Metrics**, and **Unfair Advantage** (the things that determine
whether the venture survives).

## When to use
- Pre-PMF: deciding what to build, who for, why now
- Quarterly check-in to see if your assumptions still hold
- Investor / advisor briefing — single-page snapshot
- Pre-pivot: which blocks are wrong, which can stay?

## When NOT to use
- Post-PMF, multi-product company → use BUSINESS_MODEL (full BMC)
- For investor pitch decks alone — Lean Canvas is *thinking*, deck is
  *selling*

## The 9 blocks (clockwise from top-left)

```
┌───────────┬───────────┬─────────────┬─────────┬───────────────┐
│ Problem   │ Solution  │ Unique      │ Unfair  │ Customer      │
│ (top 3)   │ (top 3)   │ Value Prop  │ Adv.    │ Segments      │
│           ├───────────┤             ├─────────┤               │
│           │ Key       │             │ Channels│               │
│           │ Metrics   │             │         │               │
├───────────┴───────────┴─────────────┴─────────┴───────────────┤
│ Cost Structure              │ Revenue Streams                │
└─────────────────────────────┴────────────────────────────────┘
```

## What goes in each block (cheat sheet)

1. **Problem** — top 3 problems the customer has + how they solve them
   today (existing alternatives — important; lists Excel, ChatGPT, manual,
   nothing)
2. **Customer Segments** — name the *early adopters* specifically
   (e.g., "20-50-person legal firms in CA with ≥3 paralegals" not
   "SMBs")
3. **Unique Value Proposition** — single clear, compelling sentence
   that turns a visitor into an interested visitor. Bonus: a high-
   level concept ("X for Y" e.g. "Stripe for marketplaces")
4. **Solution** — top 3 features tied to problems (each problem ↔
   feature; if a feature solves nothing on the Problem list, drop it)
5. **Channels** — paths to customers, both inbound and outbound
6. **Revenue Streams** — pricing model + LTV math
7. **Cost Structure** — fixed costs (people, tools), variable costs
   (per-customer infra, COGS), cost of acquisition
8. **Key Metrics** — what tells you it's working? Pirate metrics
   (AARRR: Acquisition, Activation, Retention, Revenue, Referral) is
   a default starting frame
9. **Unfair Advantage** — what's hard to copy? Defaults like "team
   experience" or "technology" don't count — that's table stakes.
   Real unfair advantages: insider knowledge, exclusive partnerships,
   personal authority/audience, network effects, regulatory moat.

## How to run it on an idea

1. **Time-boxed first pass: 20 min.** Force yourself to fill all 9
   blocks even with weak guesses. The point is to surface assumptions,
   not be right.
2. **Identify the riskiest block.** Usually one of:
   - Problem (does it actually hurt?)
   - Customer Segments (who's the early adopter, really?)
   - Channel (can we reach them affordably?)
   - Unfair Advantage (do we have one, or are we kidding?)
3. **Design ONE experiment** to falsify the riskiest assumption in 30
   days. CUSTOMER_DISCOVERY interviews, landing-page test, smoke test,
   ad campaign, etc.
4. **Re-fill the canvas after the experiment.** Watch what changes.
5. **Repeat.** A canvas that doesn't change quarter-over-quarter is a
   canvas that's not being tested.

## Output structure

```
## Lean Canvas — {project name}

### 1 · Problem
1. {pain}
2. {pain}
3. {pain}
**Existing alternatives:** {list — Excel, manual, ChatGPT, do-nothing}

### 2 · Customer Segments
**Early adopter:** {extremely specific definition}
**Adjacent segments (later):** {list}

### 3 · Unique Value Proposition
{Single sentence}
**High-level concept:** "{X} for {Y}"

### 4 · Solution
1. {feature} → solves problem 1
2. {feature} → solves problem 2
3. {feature} → solves problem 3

### 5 · Channels
**Inbound:** {SEO / content / community / referrals}
**Outbound:** {cold email / LinkedIn / events / partners}

### 6 · Revenue Streams
**Model:** {subscription / usage / one-time / hybrid}
**Pricing:** ${X}/mo at {tier}
**LTV (target):** ${Y} | **CAC ceiling:** ${Y/3}

### 7 · Cost Structure
**Fixed:** {team + tools = $X/mo}
**Variable:** {per-customer cost = $Y}
**CAC:** ${X} per customer

### 8 · Key Metrics
**North Star:** {single metric}
**AARRR pulse:**
- Acquisition: {metric}
- Activation: {metric}
- Retention: {metric}
- Revenue: {metric}
- Referral: {metric}

### 9 · Unfair Advantage
{What — and crucially, why this is hard to copy}
{If you wrote "great team" or "good tech," try again.}

### Riskiest assumption + 30-day experiment
**Assumption:** {one sentence}
**Experiment:** {one sentence}
**Falsification threshold:** {specific metric × value}
```

## Decision-log entry suggestion
- Category: validation
- Reversibility: reversible (canvas is hypotheses, not commitments)
- Revisit: every 4-6 weeks until PMF
