# Mode KB — PIVOT_OR_PERSEVERE (Hard call: change course or hold the line)

## Purpose
Run the founder through a structured framework for one of the
career-defining decisions: keep going, or change something
fundamental? Built on Eric Ries's Lean Startup primitives, with the
sunk-cost detection that Ries himself flagged as the #1 trap.

This mode is **rare-use, high-stakes**. Most weeks the founder doesn't
need this. When they do, it matters more than anything else they'll
do that quarter.

## Pre-work — required before substantive work

This mode requires **honest data, not hopes**. If the founder is
asking "should I pivot?" with vibes-only inputs, push back: collect
the data first. Specifically:

1. **Runway** — months of cash at current burn (decision-critical)
2. **Current core metric** — MRR / DAU / NPS / whatever they say is
   their North Star. Trend over last 60-90 days.
3. **Current hypothesis** — written down: "we believe {customer}
   has {pain}, and our product solves it via {mechanism}"
4. **What's been tested vs unchanged** — list what they've actually
   shipped and tested in the last 30-60 days
5. **What signal would prove the hypothesis right** — the threshold
   they set (or should set) for "yes, persevere"
6. **Brutal honesty toggle** — recommend turning it on for this mode

If runway is unknown or the hypothesis is unwritten, **stop and
rebuild those first.** Don't pivot blindly, don't persevere blindly.

## The Lean Startup framing — Build-Measure-Learn

A pivot is a **structured course correction designed to test a new
fundamental hypothesis**. It's not abandonment, it's a directed shift.

**Runway redefined (Ries):** runway isn't months of cash — it's
**number of pivots remaining**. A startup with 18 months of cash that
ships 1 thing a year has 1 pivot left. A startup with 9 months of
cash that ships every 6 weeks has 6.

This reframes the question: "do we have time to pivot?" becomes "do we
have enough learning velocity to test another hypothesis before the
money runs out?"

## The framework — 5 questions before deciding

### 1. Is the failure data real?

- Did we actually run the test long enough to draw a conclusion?
- Did we change one thing at a time, or several at once (so we can't
  isolate cause)?
- Did we measure leading indicators or trailing indicators?
- Was the test population large enough to be statistically meaningful?

**Sunk-cost flag:** "We've tried everything." If the founder says
this, run a 2-min audit. Usually 2-3 specific levers haven't been
tested at all.

### 2. Is the *core hypothesis* falsified, or just one *expression* of it?

This is the biggest analytical move. Decompose the hypothesis:
- **Customer hypothesis** — is the segment right?
- **Problem hypothesis** — is the pain real and ranked high enough?
- **Solution hypothesis** — is our solution the right shape?
- **Channel hypothesis** — can we reach this customer affordably?
- **Pricing hypothesis** — will they pay this much?
- **Engine-of-growth hypothesis** — will referral / retention / virality
  compound?

Often the founder thinks "the idea is dead" when really only one
sub-hypothesis has failed. **You don't need to start over; you need
to swap that one component.** That's a pivot, not abandonment.

### 3. What's the cheapest test that would prove me wrong?

If you persevered for 30 more days with one focused change, what
single experiment would tell you "yes, this works" vs "no, it doesn't"?

If no such experiment exists, you've stopped doing science. That's
itself a signal to pivot.

### 4. Are we deciding from data or feeling?

Three signals it's feeling-driven:

- "We've come too far to stop" → sunk cost
- "I just feel it's about to click" → hope
- "Investors say we have to grow faster" → external pressure, not
  customer signal

Three signals it's data-driven:
- "Cohort retention is 20% at week 8 vs the 40% required for unit
  economics, after 4 months and 2 retention experiments"
- "We've tried 3 acquisition channels, all CAC >$200; LTV is $80;
  math doesn't work even at scale"
- "5 of 7 power users have churned after our most-requested feature
  shipped, suggesting our targeting is wrong"

Data-driven pivots succeed at much higher rates than feeling-driven
ones. Push for the numbers.

### 5. Have we done a pre-mortem on the pivot itself?

Before committing to a pivot, run the imaginary failure: "if this
pivot also fails, what will we say in 6 months about why?"

If you can articulate a credible failure mode for the pivot ahead of
time, you can also pre-test it cheap. If the pre-mortem is
"everything would have to be wrong about the new hypothesis," you
haven't actually thought through the pivot.

## The 11 Lean Startup pivot types (Ries)

When pivoting, name the type — it sharpens the conversation:

| Pivot type | What changes | Use when |
|---|---|---|
| **Zoom-in** | A single feature becomes the whole product | Existing feature is loved; rest is noise |
| **Zoom-out** | A single product becomes a feature of a larger product | Competitors will commodify; need wider moat |
| **Customer segment** | Same product, different customer | Product solves a real problem, just for the wrong people |
| **Customer need** | Same customer, different problem | Customer trusts you but doesn't need this problem solved |
| **Platform** | Application → platform (or vice versa) | Multiple customers want to extend you |
| **Business architecture** | High-margin / low-volume ↔ low-margin / high-volume | Margin or volume math is upside down |
| **Value capture** | Pricing model change | Money is on the table you're not capturing (or vice versa) |
| **Engine of growth** | Viral ↔ sticky ↔ paid acquisition | Current growth engine doesn't compound |
| **Channel** | Direct ↔ partner ↔ marketplace | Current channel can't scale at acceptable CAC |
| **Technology** | Same problem, different tech | New tech makes a 10x cheaper / better solution possible |
| **Growth segment** | Pre-PMF segment ↔ post-PMF segment | One segment found PMF; expand into the next |

## The decision matrix

Run this with honest answers. Each row scores 1 (persevere) to 5 (pivot):

| Question | 1 — persevere | 5 — pivot |
|---|---|---|
| Core metric trend last 60-90 days | Steadily up | Flat or down despite shipping |
| Hypothesis sub-component falsified? | None | One specific (decompose; pivot just that) |
| Sub-components untested? | All tested | Multiple untested → don't pivot yet, run tests |
| Cheap experiment exists to validate? | Yes, running it now | No, we've exhausted experiments |
| Sunk-cost language present? | Talking about data | "We've come too far" / "I just feel it" |
| Runway in pivots remaining | 3+ pivots | <2 pivots — must move fast |
| Customer language | Specific behavioral data | Generic compliments / "interesting" |

Sum score: 7-15 = persevere with one focused experiment; 16-25 = pivot
candidate, identify type; 26-35 = pivot is overdue.

## Output structure

```
## Pivot-or-persevere review — {project name}

### TL;DR
- Recommendation: {persevere with X focus / pivot, type Y / inconclusive — run experiment Z first}
- Score: {N}/35
- Confidence: {high/medium/low}
- Brutal honesty: {single hardest truth in 1 sentence}

### The data behind the call
- Runway in months: {X}
- Runway in pivots remaining: {Y}
- Core metric trend (60-90d): {direction + magnitude}
- Most recent test results: {what we shipped, what we measured}

### Hypothesis decomposition
| Sub-component | Tested? | Result | Falsified? |
|---|---|---|---|
| Customer | yes/no | ... | yes/no |
| Problem | yes/no | ... | yes/no |
| Solution | yes/no | ... | yes/no |
| Channel | yes/no | ... | yes/no |
| Pricing | yes/no | ... | yes/no |
| Growth engine | yes/no | ... | yes/no |

### If pivoting — type + new hypothesis
- Pivot type: {one of the 11}
- New hypothesis: "We believe {customer} has {pain}, solved by
  {mechanism}, validated by {leading indicator hitting threshold X}"
- Cheapest first test: {30-day experiment}
- Pre-mortem of the pivot: {if it fails, why?}

### If persevering — focused next 30 days
- The single experiment that would prove or kill us:
- Threshold for "go to pivot": {metric × value × deadline}
- Threshold for "double-down": {metric × value × deadline}

### Sunk-cost honesty check
{2-3 sentences pulling out exactly which sentences from the user's
inputs sound feeling-driven vs data-driven}

### Decision-log entry suggestion
Category: pivot
Reversibility: **one_way** if abandoning the current product or segment;
              **expensive** if it's a feature/channel pivot
Pre-mortem: {explicit failure mode}
Revisit: 30 days post-decision with pre-set thresholds
```

## What this mode does NOT do

- **Decide for the founder.** This is the highest-stakes call they
  make; agent gives the framework + analysis, founder owns the call.
- Generic motivational coaching ("trust the process") — do the
  opposite: surface the brutal truth.
- Replace customer interviews. If a pivot type is "customer segment"
  or "customer need," the next mode is CUSTOMER_DISCOVERY before
  committing.

## Handoff suggestions

After the framework run:
- "Persevere with focused 30-day experiment?" → EXECUTION mode for the
  experiment plan
- "Pivot to a customer-segment change?" → CUSTOMER_DISCOVERY for the
  new segment
- "Pivot to value-capture (pricing)?" → PRICING mode
- "Log this as a decision?" → Decision form (almost always
  reversibility=one_way; this is a Bezos type-1 door)
