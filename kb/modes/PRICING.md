# Mode KB — PRICING (Pricing Strategy)

## Purpose
Pricing is the highest-leverage decision a founder makes — a 1% pricing
improvement compounds to ~11% operating profit. This mode helps the
user nail four interlocking choices: **model**, **structure**, **levels**,
and **packaging**. Outputs are decision-ready, not theoretical.

## Pre-work — required before substantive work

If any of these are missing, ask one sharpening question, then proceed:

1. **What's being priced** — product / service / SKU specifics
2. **Who pays** — end-user vs admin vs procurement; B2C vs SMB vs mid-market vs enterprise
3. **What's the alternative the buyer would otherwise pay for** (anchor point)
4. **Stage** — pre-launch, charging-but-pre-PMF, or post-PMF/optimizing
5. **Delivery cost shape** — high COGS (services, ML inference) vs near-zero (pure software)

If the user has no comp set yet, name the closest 3 — they're usually one
search away.

## The four interlocking decisions

### 1. Pricing **model** — how does revenue scale?

| Model | When to use | Watch out for |
|---|---|---|
| **Subscription / per-seat** | Buyer values seats more than usage; Slack/Notion pattern | Caps revenue from heavy users |
| **Usage-based / consumption** | Value scales with usage (API calls, infra, AI tokens) | Variable revenue; harder forecast |
| **Hybrid (base + overage)** | **2026 default for most B2B SaaS** — predictable base + upside on heavy users | Most billing logic |
| **Per-transaction / take-rate** | Marketplace, payments, fintech | Race to the bottom on rate |
| **Outcome / value-based** | Solving a measurable financial pain (lead gen, savings) | Hard to attribute outcome |
| **Flat / tiered (no metering)** | Simple; consumer or low-touch SMB | Punishes light users → churn |
| **One-time / perpetual license** | Tools sold to skeptics of subscription | No expansion revenue |

**Default recommendation if uncertain:** start with **tiered subscription
+ usage overage on the metric the buyer values most**. That's how Stripe,
Linear, Notion, Sentry, and OpenAI all converged for SMB+.

### 2. Pricing **structure** — how many public tiers?

| Tiers | Pattern | Notes |
|---|---|---|
| 1 | Single self-serve plan | Right when only one ICP exists |
| **3** | Free + Pro + Team or Free + Pro + Enterprise | **2026 sweet spot** — 90% of mature SaaS |
| 4 | + a Free trial vs Free Forever distinction | OK if you have real differentiation |
| 5+ | Don't | **Pricing pages with >4 options reduce conversion ~30%** |

Always include a "Contact us / Enterprise" tier for >$$ buyers — gives
sales an entry point and signals upmarket capacity.

### 3. Pricing **levels** — what dollar amounts?

Two methods, used in combination:

**A. Van Westendorp Price Sensitivity Meter** (gold standard, since 1976)
Survey 30+ target customers with these four questions:
1. At what price would this product be **so expensive you wouldn't buy**?
2. At what price would it be **expensive but you'd still consider it**?
3. At what price would it be a **bargain**?
4. At what price would it be **so cheap you'd doubt the quality**?

Plot cumulative distributions. Acceptable price band = where "too
expensive" and "too cheap" curves intersect. **Optimal Price Point** =
where "not expensive" and "not cheap" cross.

**B. Anchoring against the alternative**
Find the closest 3 alternatives. Find the wage/hour/job the buyer is
currently spending. Price at:
- ~30% of the most expensive alternative if you're a clear improvement
- 1.5–3x the cheapest alternative if you're meaningfully better
- Default SMB SaaS anchor: ~$29/seat/month or $99/team/month (the most
  common Pro-tier price points across 2026 SaaS)

### 4. Pricing **packaging** — what's in each tier?

For a 3-tier structure:
- **Free / Starter** — single-use case, capped (5 chats/month, 1 project)
- **Pro** — full self-serve power-user feature set
- **Team / Enterprise** — multi-user, SSO, audit log, dedicated support

**The trap to avoid:** putting your *core* differentiating feature behind
the highest tier. If the thing that makes you better is invisible to
free/Pro users, you starve word-of-mouth growth.

**The lever to use:** **packaging by usage limit, not feature**. Free
users get the same agent/depth as Pro, just less of it. Pro users see
limits raised. Enterprise users get governance + SSO + SLA. This is the
**OpenAI pattern** that beat per-feature gating.

## Output structure

When the user asks "should I price X at $Y?" or "build a pricing tier
for X":

```
## Pricing recommendation — {project name}

### TL;DR (read-time 30s)
- Model: {chosen} → because {1-line reason}
- Structure: {N tiers}
- Anchor: ${X}/seat/month for Pro
- Confidence: {high/medium/low}

### Model rationale
{2-3 paragraphs comparing the top 2 viable models for this product}

### Tier breakdown
| Tier | Price | Includes | Limit | ICP |
|---|---|---|---|---|

### Anchor justification
- Comparable: {3 named comps with their prices}
- Buyer's current spend on the alternative: ${X}-${Y}/mo
- Our proposed price = {ratio} of the most expensive alt → {justification}

### What I want to validate before locking it in
1. Run a {Van Westendorp / Gabor-Granger / 5-customer interview} with the
   following script: {script}
2. Watch for {behavioral signal — e.g. how many drop off at $99 vs $79}

### Sensitivity & risks
- If churn is >5%/mo at this price, reduce {tier} by {%}
- If conversion <2% at signup, the free tier is too narrow — widen
- If usage averages <{X} of the cap, pricing is fine but the limit is
  performative — raise it to remove anxiety

### Decision-log entry suggestion
Category: pricing
Reversibility: **expensive** (not one-way — you can re-price, but it
costs trust + churn risk for existing customers)
Pre-mortem: "Wrong if {single biggest assumption}"
Revisit: 90 days from launch
```

## Producing artifacts

If the user wants tangible outputs (per their question), offer:

- **Pricing-page copy** — H1, sub-H1, 3-tier feature comparison, FAQ,
  CTA. Match the project's brand voice.
- **Van Westendorp survey** — 4 questions in a Tally / Typeform-ready
  format with logic for routing.
- **Gabor-Granger script** — incremental "would you pay $X?" with 5
  price points; for use in customer interviews.
- **Sensitivity model** — XLSX (via Skills KB §3) with assumption block
  + 3 scenarios (lean/realistic/aggressive) of revenue + gross margin
  per pricing choice.

## What this mode does NOT do

- Multi-quarter financial modeling — that's the **financial_model**
  artifact under BUSINESS_MODEL mode
- Funnel optimization or A/B test design — that's `GO_TO_MARKET`
- Tax / sales-tax routing — out of scope; flag and recommend Stripe Tax

## Handoff suggestions

After locking pricing, naturally suggest:
- "Want me to draft the pricing page copy?" → POSITIONING mode
- "Want a sensitivity model in Excel?" → Skills KB rendering
- "Want me to log this as a project decision?" → Decision form
  (recommend `reversibility: expensive`)
- "Want a 3-channel CAC math against this price?" → GO_TO_MARKET mode
