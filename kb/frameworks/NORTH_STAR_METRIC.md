# Framework — North Star Metric (Sean Ellis)

## Origin
Coined by Sean Ellis (the same person who coined "growth hacking"). The
single metric that best reflects the core value your product delivers
to users. When it grows, business growth follows.

## When to use
- Picking the one metric to align the team around
- After PMF — when you need to focus growth efforts
- Quarterly planning — what's the input metric tree?
- Re-evaluating after a pivot

## When NOT to use
- Pre-PMF. A North Star Metric without product-market fit will
  optimize the wrong thing. Find PMF first (CUSTOMER_DISCOVERY +
  IDEA_VALIDATION).
- For multi-product companies after a certain scale (you may need
  multiple NSMs by product line).

## The criteria for a good North Star

A good NSM passes all of these:

1. **It captures customer value, not company value.** Revenue is what
   you get; the NSM is what you give.
2. **It's a leading indicator of revenue.** Move it up, revenue
   follows in 30-90 days.
3. **It's actionable.** Teams can run experiments that move it.
4. **It's understandable.** A new hire on day 1 can grasp it.
5. **It has volume × depth × frequency.** Counts how many people get
   real value, often.

The "volume × depth × frequency" rule is the crispest test. Examples:

- Spotify: **time spent listening** (volume + depth + frequency)
- Airbnb: **nights booked** (per-stay × frequency × people)
- Slack: **paid teams sending 2,000+ messages** (volume gate ensures
  real adoption)
- WhatsApp: **messages sent** (volume × frequency)
- Dropbox: **files stored AND shared** (the AND is critical: shared =
  network value)

## The "very disappointed" survey (Sean Ellis test)

Before settling on an NSM, validate PMF with the Sean Ellis test:

> "How would you feel if you could no longer use {product}?"
> Options: Very disappointed / Somewhat disappointed / Not disappointed

**40%+ "very disappointed"** = PMF, NSM-worthy. Below 40% = focus on
PMF first; the NSM you'd pick today is wrong.

## The input metric tree

The NSM sits at the top. Below it sit 3–5 input metrics. Below those
sit 3–5 sub-input metrics each. Each layer is what teams own.

```
                      Weekly Active Teams sending 500+ messages   (NSM)
                       /            |              |
       New team        Activation        Feature        Retention
       activation      rate              adoption       rate
       /  \            / \                / \            / \
   ...    ...      ...   ...          ...   ...        ...   ...
```

Each metric in the tree should:
- Have a clear owner (a team / individual)
- Have a target value
- Be reviewed weekly

## Step-by-step application

1. **Validate PMF first** with the Sean Ellis test. If <40% very
   disappointed, stop. Go fix PMF.
2. **List 5–10 candidate NSMs** that capture user value.
3. **Score each against the 5 criteria** + volume×depth×frequency
   rule.
4. **Pick one.** Resist the urge to have two. (If you really have
   two products, you may need two NSMs — but most don't.)
5. **Build the input metric tree** — 3–5 inputs, then 3–5 sub-inputs.
6. **Assign owners + targets + cadence** for each.
7. **Re-evaluate quarterly.** The NSM should evolve as the product
   does — but slowly.

## Common NSM traps

- **Vanity NSM**: "monthly visitors" ≠ value delivered
- **Revenue-as-NSM**: too lagging; you can't run experiments against it
- **Too narrow**: only counts power users; misses activation
- **Too broad**: counts signups (worthless without retention)
- **Confused with OMTM**: "One Metric That Matters" is short-term, NSM
  is long-term. Both can coexist.

## Output structure

```
## North Star Metric — {project name}

### PMF check
- Sean Ellis test: {N}% very disappointed → {PMF / not yet}
- Recommendation: {proceed with NSM / fix PMF first}

### NSM candidates considered
| Candidate | Value-capture | Leading? | Actionable? | Understandable? | Volume×depth×freq? | Score |
|---|---|---|---|---|---|---|

### Recommended NSM
**{Metric}** — {definition with units}

**Why:** {1-paragraph rationale tied to volume × depth × frequency}

### Input metric tree
- {NSM}
  - {input 1} (owner: {team}, target: {value})
    - {sub-input 1.1}
    - {sub-input 1.2}
  - {input 2}
  - {input 3}

### Cadence
- Weekly review: {who} reviews {metric tree}
- Monthly: trend snapshot to all hands
- Quarterly: re-evaluate the tree (not the NSM itself unless major
  pivot)

### Decision-log entry
- Category: product
- Reversibility: expensive (changing NSM mid-quarter destroys
  alignment)
- Revisit: quarterly
```
