# Framework — Competitive Teardown (positioning + diff. moat)

## Origin
Synthesized from April Dunford (*Obviously Awesome*), Andrew Chen's
defensibility writing, and the practice of "product teardown" common
in PM circles. Used to deeply analyze 3-5 competitors before locking
positioning.

## When to use
- Pre-launch positioning ("how do we differentiate?")
- A direct competitor just launched and you need to react (or not)
- Re-positioning after a pivot
- Investor due-diligence prep ("why won't BigCo eat your lunch?")
- Pricing — competitive context shapes ceilings/floors

## When NOT to use
- True greenfield (no incumbents, no competitors, no alternatives) —
  rare; usually means the customer doesn't actually want the thing
- Commodity markets where price IS the differentiator

## The 5 layers of teardown

For each competitor, document:

1. **Positioning** — the claim they make. The headline + subheadline
   on the homepage.
2. **Job(s) they solve** — what JTBD they map to (use JOBS_TO_BE_DONE)
3. **Pricing & packaging** — tiers, prices, what's gated
4. **Product surface** — feature list (don't just list — note the
   *vibe*: opinionated vs. flexible, batteries-included vs. composable)
5. **Distribution & moat** — how they acquire, why they retain.
   Sources of compounding advantage:
   - Network effects (each user makes the product more valuable)
   - Switching costs (data, integrations, training)
   - Brand / authority (founder presence, audience)
   - Cost advantage (proprietary tech, scale)
   - Embedded distribution (default in another product's flow)

## The 2026 case-study set (worked examples)

These products launched in early 2026 and illustrate distinct
positioning archetypes. Use as analogies.

### Prism (OpenAI) — *category capture by parent*
- **Positioning**: "AI-native workspace for scientists" — narrow
  vertical, free, GPT-5.2-powered
- **Why it matters**: shows how a parent platform colonizes a
  vertical by giving away a focused tool. **Lesson:** if your moat
  is "we have GPT-5", you're in trouble — OpenAI can do this in any
  vertical they want.

### Astrio — *modernization wedge*
- **Positioning**: "Modernize your outdated websites in minutes,
  not weeks". Imports legacy site → spits out modern TS+Tailwind.
- **Why it matters**: classic *wedge* play — take an unloved migration
  job no one wants to do manually, AI it. **Lesson:** the most
  defensible AI products attack jobs that are currently boring,
  expensive, and slow — not jobs everyone wants to AI-ify.

### MascotVibe — *unbundling design fees*
- **Positioning**: animated mascots in 7 minutes, pay-per-mascot
  vs $5k traditional or $19/mo SaaS
- **Why it matters**: pricing as positioning. Pay-per-output beats
  subscription for low-frequency creative. **Lesson:** your *pricing
  model* can be the differentiator even when the underlying tech is
  commoditized.

### Perfectly — *AI-native category replacement*
- **Positioning**: "AI-native recruiting OS"; agents source, screen,
  outreach autonomously; "5-10 interview-ready candidates same day"
- **Why it matters**: doesn't try to add AI to existing ATS — replaces
  the ATS. **Lesson:** "AI-native X" beats "X with AI" when the
  workflow is being re-architected, not augmented.

### Inception (Mercury LLM) — *infra layer*
- **Positioning**: 5-10x faster than autoregressive LLMs via
  diffusion architecture
- **Why it matters**: foundational moat = research breakthrough +
  engineering moat. **Lesson:** if your only moat is "we use
  GPT-X", you're an *application*, not infrastructure. Distinguish.

### theORQL — *natural-language interface to existing infra*
- **Positioning**: text-to-SQL for any database
- **Why it matters**: thin layer over commodity LLM + DB drivers;
  defensibility is *brand + integrations*, not tech. **Lesson:**
  thin wrappers are valid V1 — but plan for a deepening layer in
  V2 (proprietary data, fine-tuned model, exclusive integrations).

## The positioning matrix

After tearing down 3-5 competitors, map onto a 2-axis:

```
            High differentiation (vibe + features)
                       │
             Premium ◯ │ ◯ Cult/category-defining
                       │
   Low cost ──────────┼────────── High cost
                       │
              Cheap ◯ │ ◯ Niche
                       │
            Low differentiation
```

Where do competitors cluster? Where's the empty space? Is the empty
space empty for a *reason* (no demand) or for an *opportunity*
(no one's done the work)?

## The "fair fight" test

For each competitor, answer:
1. **Where do we win head-to-head?** (Ideally specific & demonstrable.)
2. **Where do they win?** (Be honest. If "nowhere", you're
   underestimating them.)
3. **Where would the customer pick someone else?** What's the
   wedge use case where we lose?
4. **What's our wedge — the use case where we definitively win?**

If the answer to #4 is fuzzy, you don't have positioning yet.

## Step-by-step

1. **List 3-5 competitors** including the *non-obvious* ones (Excel,
   ChatGPT, "do nothing" — see LEAN_CANVAS existing alternatives).
2. **Tear down each across the 5 layers.** Use the worked examples
   above as analogies for your space.
3. **Plot on the positioning matrix.** Identify the empty space.
4. **Run the fair-fight test.** Brutal honesty.
5. **Articulate your wedge** — the specific use case + segment +
   trigger where you win.
6. **Write your positioning statement** in JTBD form (see
   JOBS_TO_BE_DONE).

## Output structure

```
## Competitive Teardown — {project name}

### Competitors analyzed
1. {Name} — direct
2. {Name} — adjacent
3. {Name} — alternative ("nothing" / Excel / ChatGPT)

### Per-competitor teardowns
#### {Competitor 1}
- Positioning: "{exact claim from their site}"
- Job: {JTBD it solves}
- Pricing: {tiers}
- Product vibe: {opinionated/flexible/etc.}
- Moat type: {network / switching / brand / cost / distribution}
- Strength: {what they do best}
- Weakness: {weakest seam}

### Positioning matrix
{2x2 plot — cost × differentiation, with each competitor placed and
the "empty space" identified}

### Fair-fight assessment
- We win at: {specific scenarios}
- They win at: {specific scenarios — be honest}
- Lose-case: {scenario where customer picks them — and why}
- Our wedge: {specific use case + segment + trigger}

### Recommended positioning
"For {segment}, who {struggle/job}, {Product} is the {category}
that {key benefit}, unlike {primary competitor} which {failure
mode}."

### Defensibility plan (12 months)
What compounding advantage are we building?
- Month 1-3: {moat type chosen} — first artifact
- Month 4-6: deepen
- Month 7-12: expand to second moat type

### Decision-log entry
- Category: positioning
- Reversibility: expensive (positioning shifts confuse customers)
- Pre-mortem: "Wrong if the wedge use case isn't large enough or
  competitor reacts in <90 days"
- Revisit: every 60 days, more often if competitor moves
```

## Decision-log entry suggestion
- Category: positioning
- Reversibility: expensive
- Revisit: 60-90 days
