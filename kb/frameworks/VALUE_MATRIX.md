# Framework — Value Matrix (problem-solution-segment fit grid)

## Origin
Variant of Steve Blank's "value-prop / customer-segment fit" canvas
(refined in *The Startup Owner's Manual*) and Strategyzer's Value
Proposition Canvas. The premise: a value proposition isn't a single
sentence — it's a *fit* between specific customer pains/gains and
specific product features/relievers/gain-creators. The matrix
forces that fit to be made explicit.

## When to use
- After CUSTOMER_DISCOVERY but before LEAN_CANVAS finalization
- Pricing tiers — each tier should match a different segment's
  pain/gain priority
- Multi-segment products — to see whether you're really one product
  or two
- Positioning revisit when conversion is mixed across segments

## When NOT to use
- Single-feature, single-segment product. The matrix degenerates
  to a list.

## The matrix shape

```
                      Segment A         Segment B         Segment C
               ┌──────────────────┬──────────────────┬──────────────────┐
   Pain 1     │   ●●●  (high)     │   ○    (low)     │   ●●   (med)     │
   Pain 2     │   ●     (low)     │   ●●●  (high)    │   ●●   (med)     │
   Pain 3     │   ●●   (med)      │   ●●   (med)     │   ●●●  (high)    │
   Gain 1     │   ●●●  (high)     │   ●     (low)    │   ●●   (med)     │
   Gain 2     │   ●     (low)     │   ●●●  (high)    │   ●     (low)    │
               ├──────────────────┴──────────────────┴──────────────────┤
   Feature 1  │  Reliever for: A.Pain1, B.Pain1                          │
   Feature 2  │  Gain-creator for: A.Gain1, C.Gain1                      │
   Feature 3  │  Reliever for: B.Pain2, C.Pain2                          │
               └──────────────────────────────────────────────────────────┘
```

Top half = customer side. Bottom half = product side. The "fit" is
visible: which features address which pain/gain for which segment.

## Definitions

- **Pain**: outcome the customer wants to *avoid*. Frustration,
  cost, risk, blocked goal.
- **Gain**: outcome the customer *wants*. Faster, cheaper, better,
  more delightful.
- **Reliever**: feature that reduces a pain. (Aspirin.)
- **Gain creator**: feature that produces a gain. (Vitamin / vacation.)
- **Pain intensity** (●●●/●●/●): customer-rated, ideally 1-10 with
  ≥5 customer interviews per segment.

## How to fill the matrix

### 1. Pick 2-3 candidate segments
Specific. "20-50-person legal firms in CA" not "SMBs". "First-time
founders who quit FAANG" not "founders".

### 2. Per segment, run 5+ JTBD interviews (see JOBS_TO_BE_DONE)
For each interviewee, capture top 3 pains + top 3 gains in their
*own words*.

### 3. Cluster pains/gains across interviews
- 3-5 distinct pains per segment
- 3-5 distinct gains per segment
- Score each pain/gain 1-10 by intensity × frequency

### 4. List your features (top 5-7)
Each one is a reliever, a gain-creator, or both — or it shouldn't
exist.

### 5. Map features → pains/gains
For each feature, which pains does it relieve, which gains does it
create, for which segment?

### 6. Score the fit
Per segment, sum:
- (your-feature relievers) × (pain intensity)
- (your-feature gain-creators) × (gain intensity)

Highest-fit segment = your beachhead.

## The 4 patterns the matrix reveals

1. **Tight fit** — features cluster around one segment's high-intensity
   pains/gains. Ship and double down on that segment.
2. **Diffuse fit** — features address some pain in every segment but
   high-intensity in none. You're a "kind of useful" product. Sharpen.
3. **Wrong segment** — features map to high-intensity pain/gain, but
   not in the segment you've been targeting. Pivot the segment.
4. **Wrong product** — features don't map to *any* high-intensity
   pain/gain. Rebuild around the highest-rated pain/gain regardless
   of the current build.

## Common traps

- **Founder-imagined pain**: pain came from your gut, not from
  interviews. Re-do CUSTOMER_DISCOVERY.
- **Vitamin vs aspirin**: gain-creators alone don't sell — there
  must be relievers. If 80% of your features are vitamins, you're
  selling delight, not necessity. Price accordingly.
- **One-pain-many-features**: 4 features all relieving the same
  pain = unfocused. Cut.
- **Multi-segment trap**: features matrix-fit two non-overlapping
  segments — you're really two products. Ship the strongest one
  first.

## Output structure

```
## Value Matrix — {project name}

### Segments analyzed
| Segment | Definition | Interviews done |

### Per-segment top 3 pains + 3 gains (intensity 1-10)
#### Segment A
- Pain 1: {pain} — {N}/10 — quoted in {M} interviews
- Pain 2: ...
- Gain 1: {gain} — {N}/10
...

### Feature → fit map
| Feature | Reliever for | Gain creator for | Total fit (Σ intensity) |
| F1 | A.P1 (8), B.P1 (6) | — | 14 |
| F2 | — | A.G1 (9), C.G1 (5) | 14 |
...

### Pattern observed
{Tight / Diffuse / Wrong segment / Wrong product}

### Beachhead segment + why
**Segment {X}** — fit-score {N}, with strong features for top 2
pains and 1 gain. Recommended primary positioning target.

### Cuts (low-fit features)
- {Feature} — fit-score {N}; serves no high-intensity pain/gain
  in any segment. Cut or re-scope.

### Decision-log entry
- Category: product or positioning
- Reversibility: reversible early; expensive once shipped
- Pre-mortem: "Wrong if the highest-fit segment isn't reachable
  affordably (CAC > LTV/3)"
- Revisit: after next 5 interviews per segment
```

## Decision-log entry suggestion
- Category: product / positioning
- Reversibility: reversible (until shipped to market)
- Revisit: every quarter or after major customer cohort
