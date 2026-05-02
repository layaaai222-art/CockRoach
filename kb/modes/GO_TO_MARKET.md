# Mode KB — GO_TO_MARKET (GTM Strategy)

## Purpose
Translate "this is what we're selling" into "this is how we acquire,
convert, retain, and expand customers." Outputs are channel-specific,
budgeted, and tied to the founder's actual capacity — not generic
marketing advice.

## Pre-work — required before substantive work

1. **What's being sold** + **price point** (PRICING mode dependency)
2. **ACV** — annual contract value or ARPU
3. **ICP** — ideal customer profile, named specifically (not "SMBs"; say
   "20–60 person legal firms in CA with ≥3 paralegals")
4. **Stage** — 0 customers, first 10, scaling past 100
5. **Founder's strength** — is the founder a content creator, a
   networker, a builder, a salesperson, or none of those?

If "none of those" — that's a problem; flag it. The founder's strength
heavily biases which channel works.

## The fundamental decision: motion type

Use this **ACV → motion** framework (validated on 2026 OpenView /
Reforge data):

| ACV / ARR per customer | Recommended motion | Why |
|---|---|---|
| **<$5K** (consumer, SMB tools) | **Pure PLG** — self-serve, freemium or free trial | Sales doesn't pay for itself below this |
| **$5K–$50K** | **Hybrid PLG + product-led sales** (PLS) | 2026 default; hybrid hits 2x revenue growth vs SLG-only and 67% NRR vs 58% pure-PLG |
| **>$50K** with multi-stakeholder buys | **Sales-led**, with optional PLG entry-point for SMB | Procurement + security + legal needs human |
| **>$250K (enterprise)** | **Field sales / strategic accounts** | Multi-month cycles, RFPs, MSA negotiation |

**The trap:** founders default to whatever's most fashionable. PLG
became dogma 2018–2023; pure-SLG resurged 2024+. Don't pick by trend —
pick by ACV math + founder fit.

## Channel selection — Bullseye framework (Weinberg, "Traction")

Brainstorm across 19 channels. Score each by:
- **Reach** in your ICP (1–10)
- **Cost-per-acquisition fit vs ACV** (CAC must pay back ≤ 12 months
  for SMB SaaS, ≤ 18 months for mid-market, ≤ 24 months enterprise)
- **Founder strength fit** (1–10)
- **Speed to first signal** (1–10)

Pick the **top 3** and run a 4-week test on each.

### The 19 channels (categorized)

**Content + SEO**
1. Targeting blogs / publications (guest posts on industry sites)
2. Content marketing (your own blog / SEO)
3. Search engine optimization
4. Search engine marketing (paid SEM)

**Paid**
5. Display ads
6. Social & display ads (Meta, LinkedIn, X, TikTok)
7. Offline ads (radio, podcast, TV — niche)

**Direct**
8. Cold outbound (email, LinkedIn DM, cold call)
9. Sales — assisted via SDR or AE

**Network**
10. Public relations
11. Unconventional PR (publicity stunts)
12. Speaking engagements
13. Trade shows
14. Existing platforms (App Store, ProductHunt, AppSumo, etc.)
15. Affiliate programs

**Community**
16. Community building (Discord, Slack, forum)
17. Email marketing (newsletter)

**Partnerships**
18. Business development partnerships
19. Engineering as marketing (free tools, open source)

## CAC math — non-negotiable

For each candidate channel, do this math BEFORE allocating budget:

```
CAC = Channel spend ÷ Customers acquired from channel
LTV = ARPU × Gross margin × (1 / Monthly churn)
LTV:CAC ratio = LTV ÷ CAC

Healthy: LTV:CAC ≥ 3
Payback: ≤ 12 months for SMB (PLG), ≤ 18 months mid-market,
         ≤ 24 months enterprise
```

**Red flags:**
- LTV:CAC <2 → you're losing money on every customer
- Payback >24 months at <$50K ACV → you can't fund growth without dilution
- Single-channel concentration >70% → existential channel risk

## First-100-customer playbook (Lenny's Newsletter pattern)

The first 100 customers are NEVER from a scalable channel. They're from:

1. **Founder network** (5–25 customers) — direct outreach to your
   personal network's relevant contacts
2. **Manual outbound** (10–30 customers) — handcrafted DMs / emails
   to a list of 100–500 ICP-matched people
3. **Founder-as-creator** (10–40 customers) — founder posts useful
   thinking on Twitter/LinkedIn for 6+ months; converts followers
4. **Communities you're already in** (5–20 customers) — Slack groups,
   subreddits, Discords; participate, don't promote
5. **One scalable channel emerging** (10–30 customers) — by the time
   you hit 50, one of SEO / content / ads / referrals is showing
   non-zero signal; double down

**Key rule:** do *unscalable things* until you hit ~$10K MRR. Founders
who try to "build a flywheel" before then waste 6 months on
infrastructure for traffic they don't have.

## Output structure

When the user asks "build me a GTM plan" or "which channel for our
first 100":

```
## GTM strategy — {project name}

### TL;DR
- Motion: {PLG / hybrid / SLG} based on {ACV} ACV
- Top 3 channels to test in next 4 weeks: {A}, {B}, {C}
- First 100: {expected mix from the 5 sources}
- Confidence: {high/medium/low}

### Motion rationale
{2 paragraphs: ACV math + founder strength fit}

### Channel scoring (top 5)
| Channel | Reach | CAC fit | Founder fit | Speed | Total | Test? |
|---|---|---|---|---|---|---|

### CAC math per top channel
| Channel | Test budget | Expected CAC | LTV:CAC | Payback | Healthy? |
|---|---|---|---|---|---|

### First-100 sequence
Week 1–2: {action} → expect {N} customers from {source}
Week 3–4: {action} → ...
Week 5–8: {action} → ...

### Sales script (if SLG/PLS)
{Cold-call open}
{Discovery questions — 3-4 max}
{Demo close}
{Pricing reveal pattern}

### Tracking
- Single weekly metric: {leading indicator}
- Kill criteria: if channel X delivers <{N} signups in 4 weeks, stop.
- Decision-log this as: category=gtm, reversibility=reversible,
  revisit_at=8 weeks
```

## Producing artifacts

- **Outbound email sequence** — 4-touch sequence with subject A/B variants
- **Cold call script** — 90-second opener + objection handling
- **Landing page copy** — hero + 3-section value prop + social proof
  placeholder + CTA
- **CAC sensitivity model** — XLSX with channel × CAC × LTV scenarios

## What this mode does NOT do

- Pricing — that's PRICING mode
- Brand voice / category positioning — that's POSITIONING mode
- Customer interviews / problem discovery — that's CUSTOMER_DISCOVERY
- Investor outreach (different motion entirely) — that's FUNDRAISING

## Handoff suggestions

After GTM lock-in:
- "Want me to draft the cold-outbound sequence?" → produces 4-email
  sequence as artifact
- "Want a CAC sensitivity model?" → Skills KB → XLSX
- "Want me to write the landing page?" → POSITIONING mode
- "Log this as a decision?" → Decision form, reversibility=reversible
  (channels can be unwound), revisit at 8 weeks
