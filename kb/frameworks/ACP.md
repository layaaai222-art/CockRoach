# Framework — ACP: Acquisition × Churn × Pricing (Greg Isenberg)

## Origin
Greg Isenberg (Late Checkout) popularized the "ACP" growth-diagnostic
shorthand: every growth problem reduces to one of **Acquisition**
(can't get them in), **Churn** (can't keep them), or **Pricing**
(can't capture enough value per user). Founders waste cycles
optimizing the wrong one. ACP forces the diagnosis first.

## When to use
- Growth has stalled and you need to know *which lever* to pull
- Quarterly review — which of A/C/P is the binding constraint?
- Pre-fundraise — investors want to see you understand which is
  weakest
- Post-launch when "engagement is good but revenue isn't"

## When NOT to use
- Pre-PMF. ACP assumes a working funnel. If you don't have one,
  use CUSTOMER_DISCOVERY + LEAN_CANVAS.

## The diagnostic

### Step 1 — Score each lever 1-10

For each, score honestly using the rubric:

| Lever | 10 = perfect | 5 = okay | 1 = broken |
|---|---|---|---|
| **Acquisition** | CAC < LTV/3, organic-channel >40% of new users, payback < 6mo | CAC < LTV/2, mixed channels, payback < 12mo | CAC > LTV, no working channel, payback > 18mo |
| **Churn (retention)** | < 3% monthly logo, > 100% NRR | < 5% monthly, > 90% NRR | > 8% monthly, < 80% NRR |
| **Pricing** | Tier mix matches usage, willingness-to-pay tested, price increases land | Some price experiments, ad-hoc tiering | Single price, never tested, anchored to competitor |

### Step 2 — Identify the binding constraint

Lowest score = binding constraint. **All work that doesn't move that
score is a distraction.**

If two are tied: prioritize Churn > Pricing > Acquisition.
- Churn is the most expensive to fix and bleeds out everything else.
- Pricing changes the unit economics of all future Acquisition.
- Acquisition is the most visible but least leveraged of the three.

### Step 3 — Run the matched playbook

#### If Acquisition is broken
- **Channel diagnosis**: which 1 channel is doing the work, which 4
  are vanity? (Bullseye framework, see GO_TO_MARKET.)
- **CAC math**: is the math wrong because *cost is too high* or
  *conversion is too low*? Different fixes.
- **Cold message-market fit**: is the issue creative (PAID_ADS) or
  positioning (POSITIONING / COMPETITIVE_TEARDOWN)?
- **Free-tier loop**: is your top-of-funnel doing the right job
  (qualification + activation), or is it just charity?

#### If Churn is broken
- **Aha moment**: when does the user feel *real* value? If they
  churn before that moment, fix activation first.
- **Cohort decay shape**: is it logarithmic (steady churn) or
  exponential (everyone leaves at month 2)? Different root causes.
- **Reason mining**: tag every cancel with a reason — "didn't
  understand", "no ROI", "switched to X", "billing surprise".
- **Save flows**: discount, downgrade, pause — but only after
  fixing root cause, not as a band-aid.

#### If Pricing is broken
- **Test willingness-to-pay**: van Westendorp PSM with 30+ users
  per segment.
- **Tier mix**: ≤4 tiers; entry tier solves a real job; price
  anchors high → middle tier "looks reasonable".
- **Value metric alignment**: pricing should scale with the
  value-delivered axis (seats / messages / API calls / GMV) not
  with feature gates only.
- **Annual vs monthly**: 15-20% annual discount lifts cash flow
  + reduces voluntary churn.
- **Price increase test**: 10-20% on new customers; track
  conversion delta. If conversion holds, the prior price was
  leaving money on the table.

## The cross-effect insight

Each lever influences the next:

> **Pricing changes Acquisition CAC ceiling.**
> **Acquisition channel mix changes Churn rate** (some channels
> attract worse-fit users).
> **Churn changes Acquisition LTV ceiling**, which collapses what
> CAC you can pay.

Don't optimize one in isolation if you've already maxed it. Move
to the next.

## Step-by-step application

1. **Pull the data** — 90 days of cohort retention, channel CAC,
   pricing-tier mix.
2. **Score each lever 1-10** with the rubric.
3. **Pick binding constraint** = lowest score.
4. **Build a 30/60/90 plan** focused only on that lever.
5. **Re-score every 30 days.** When the binding constraint moves up
   to a 7+, re-diagnose — usually a new lever is now lowest.

## Output structure

```
## ACP Diagnostic — {project name}

### Snapshot
- 90d new users + CAC
- 90d cohort retention curve
- Current pricing mix (% on each tier)
- Last price test: {date / N/A}

### Scores
| Lever | Score (1-10) | Why |
| Acquisition | {N} | {1-line evidence} |
| Churn | {N} | {1-line evidence} |
| Pricing | {N} | {1-line evidence} |

### Binding constraint
**{Acquisition / Churn / Pricing}** — score {N}/10. All effort for
the next 30 days routes through this lever.

### 30/60/90 plan
- 30d: {single experiment to move the lever +2 points}
- 60d: {follow-on or pivot based on 30d result}
- 90d: {re-diagnose; expect a new binding constraint}

### What we are NOT doing
- {Distractions to actively decline this quarter — usually
  features or marketing tied to the non-binding levers}

### Decision-log entry
- Category: product / pricing / gtm (depending on binding lever)
- Reversibility: reversible (most ACP fixes are)
- Pre-mortem: "Wrong if the lever I scored low is actually a
  symptom of a deeper lever (e.g., 'churn' is really 'wrong-segment
  acquisition')"
- Revisit: 30 days
```

## Decision-log entry suggestion
- Category: depends on binding lever
- Reversibility: reversible
- Revisit: 30 days (high-cadence)
