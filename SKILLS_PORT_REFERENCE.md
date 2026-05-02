# CockRoach — Skills & Frameworks Port Reference

> **Hand this file to another Claude account** to replicate the
> skill/framework knowledge-base layer that powers CockRoach.
>
> Each entry below names a KB file, its origin/source, and the core
> capability it gives the LLM. The other Claude can read this list,
> fetch the public sources, and author equivalent KBs for your other
> project.
>
> Authoring shape every KB follows is described at the bottom.

**Last updated:** 2026-05-02
**Project of origin:** CockRoach (entrepreneurial co-pilot SaaS by
Layaa AI)

---

## A · Mode KBs (`kb/modes/*.md`)

A "mode" = a working stance the LLM enters. The user picks a mode
in the UI; the matching KB gets injected into the system prompt.

### Core (always-relevant)

| # | File | Purpose | Source / inspiration |
|---|---|---|---|
| 1 | `GENERAL.md` | Default conversational mode | Internal |
| 2 | `THINKING.md` | Slow, structured deep thinking | Internal (chain-of-thought + scratchpad pattern) |
| 3 | `DEEP_RESEARCH.md` | Multi-source research synthesis | Internal (mirrors Anthropic's Research feature pattern) |
| 4 | `PIVOT_OR_PERSEVERE.md` | Decision rubric for pivoting | Eric Ries, *The Lean Startup* (build-measure-learn, runway-as-pivots-remaining, 11 pivot types) |

### Operator (post-idea-chosen — primary lane)

| # | File | Purpose | Source / inspiration |
|---|---|---|---|
| 5 | `CUSTOMER_DISCOVERY.md` | Mom-test interviewing, JTBD timeline, ICP scoring | Rob Fitzpatrick, *The Mom Test* (2014); Tony Ulwick switch interview |
| 6 | `BUSINESS_MODEL.md` | Business model design + economics | Alex Osterwalder, *Business Model Generation* |
| 7 | `POSITIONING.md` | Sharpening market positioning | April Dunford, *Obviously Awesome* (2019) |
| 8 | `PRICING.md` | Model/structure/levels/packaging decisions | Van Westendorp PSM; Gabor-Granger; Patrick Campbell (ProfitWell) tier-design data |
| 9 | `GO_TO_MARKET.md` | PLG vs SLG, channel selection, CAC | Gabriel Weinberg, *Traction* (Bullseye 19-channel framework); Lenny Rachitsky first-100 patterns |
| 10 | `PAID_ADS.md` ⭐ | 7-block weighted ad audit, channel-fit by ACV, hook taxonomy, RSA checklist, creative briefs | **`AgriciDaniel/claude-ads`** GitHub — https://github.com/AgriciDaniel/claude-ads |
| 11 | `SEO_AND_CONTENT.md` ⭐ | 5-pillar SEO audit, keyword cluster scoring, E-E-A-T content briefs, programmatic-SEO criteria | **`nowork-studio/toprank`** GitHub — https://github.com/nowork-studio/toprank |
| 12 | `EXECUTION.md` | Build-plan + roadmap discipline | Internal (mix of Shape Up + Linear's roadmap patterns) |
| 13 | `FUNDRAISING.md` | SAFEs vs priced rounds, dilution, deck spec, investor list, term-sheet red flags | Sequoia 12-slide deck spec; YC SAFE primer; 2026 stage benchmarks (Carta data) |
| 14 | `HIRING_AND_EQUITY.md` | First-5 sequencing, equity bands, vesting, sourcing | Jose Guardado on equity bands; FAST advisor framework (Founder/Advisor Standard Template) |
| 15 | `LEGAL_AND_OPS.md` | Entity choice, founder agreements, IP assignment, compliance flags (HIPAA/SOC2/GDPR/PCI/CCPA) | Stripe Atlas guides; Cooley GO; Clerky founder docs |

### Discovery (pre-idea — secondary lane)

| # | File | Purpose | Source / inspiration |
|---|---|---|---|
| 16 | `IDEA_GENERATION.md` | Generating idea candidates with founder-fit | Internal (Paul Graham essays + Naval frame + Greg Isenberg lazy-niche) |
| 17 | `IDEA_VALIDATION.md` | Multi-axis idea scoring + validation | Internal (Y Combinator request-for-startups patterns) |

### Creative (adjunct utilities)

| # | File | Purpose | Source / inspiration |
|---|---|---|---|
| 18 | `UI_DESIGN.md` | 5-layer spec for v0/Lovable/Figma Make/Stitch | Refractive layer to AI design tools (v0.dev, lovable.dev, Figma First Draft, Google Stitch) |
| 19 | `IMAGE_PROMPTING.md` | Structured image prompts | Internal (Midjourney + Flux + DALL-E prompt anatomy) |

⭐ = ported during the IG-posts skill-extraction session (2026-05-02)

---

## B · Framework KBs (`kb/frameworks/*.md`)

A "framework" = a structured technique invoked on-demand against a
project. Different from modes (which are working stances).

| # | File | Framework | Originator(s) | Source |
|---|---|---|---|---|
| 1 | `VALUE_EQUATION.md` | (Dream × Likelihood) ÷ (Time × Effort) | Alex Hormozi | *$100M Offers* (Acquisition.com, 2021) |
| 2 | `LEAN_CANVAS.md` | 9-block hypothesis canvas | Ash Maurya | *Running Lean* (O'Reilly, 2010); leanstack.com |
| 3 | `JOBS_TO_BE_DONE.md` | Hire/fire jobs, 4 forces of progress, switch interview | Clayton Christensen + Tony Ulwick | *Competing Against Luck* (Christensen, 2016); *Jobs to be Done: Theory to Practice* (Ulwick, 2016); strategyn.com |
| 4 | `NORTH_STAR_METRIC.md` | Single metric × volume × depth × frequency; "very disappointed" survey | Sean Ellis | growthhackers.com; Sean Ellis test (40%+ very disappointed = PMF) |
| 5 | `VALUE_LADDER.md` | Free → tripwire → core → high-ticket | Russell Brunson | *DotCom Secrets* (2015); *Traffic Secrets* (2020); ClickFunnels |
| 6 | `VALUE_MATRIX.md` | Pain×gain×segment×feature fit grid | Steve Blank + Strategyzer | *The Startup Owner's Manual* (Blank, 2012); Value Proposition Canvas (Osterwalder/Pigneur, *Value Proposition Design*, 2014) |
| 7 | `ACP.md` | Acquisition × Churn × Pricing diagnostic | Greg Isenberg | Late Checkout; lateco.io; Greg's substack/Twitter |
| 8 | `DREAM_100.md` | 100 places/people/accounts that already have your customers | Chet Holmes + Russell Brunson | *The Ultimate Sales Machine* (Holmes, 2007); *Traffic Secrets* (Brunson, 2020) |
| 9 | `COMPETITIVE_TEARDOWN.md` | 5-layer teardown → empty space → wedge | April Dunford + Andrew Chen synthesis | *Obviously Awesome* (Dunford, 2019); andrewchen.com defensibility writing |

---

## C · Foundation KBs (always-on)

These are loaded into every conversation regardless of mode.

| # | File | Purpose | Source |
|---|---|---|---|
| 1 | `kb/foundation/KB_01_IDENTITY_AND_PERSONALITY.md` | Agent identity + tone | Internal |
| 2 | `kb/foundation/KB_02_IDEA_ANALYSIS_FRAMEWORK.md` | Multi-axis idea scoring rubric | Internal |
| 3 | `kb/foundation/KB_03_USA_FUNDING_AND_GRANTS.md` | SBA, SBIR/STTR, state grants | SBA.gov + sbir.gov public data |
| 4 | `kb/foundation/KB_04_OUTPUT_FORMATS.md` | Markdown / table / code-block discipline | Internal |
| 5 | `kb/SKILLS.md` | Always-on output craft for PPT/XLSX/PDF/charts | Internal (extends Anthropic's structured-output guidance) |

---

## D · Skills NOT ported (reference only — for future work)

These were evaluated and intentionally not turned into user-facing
KBs. Listed here so a future port can reconsider them.

| Source | Why not ported now | Where it could go later |
|---|---|---|
| `mksglu/context-mode` (https://github.com/mksglu/context-mode) | Already partly addressed in `kb/SKILLS.md` (output economy section) | Extend SKILLS.md with explicit context-discipline rules |
| `cloudflare/agentic-inbox` (https://github.com/cloudflare/agentic-inbox) | Not a user-facing skill; it's reference architecture for an email agent | Build post-launch as an outbound-email feature |
| `heygen-com/hyperframes` (https://github.com/heygen-com/hyperframes) | Tooling, not a skill — HTML→video for AI agents | Use to generate launch demo videos before public launch |
| `jo-inc/camofox-browser` (https://github.com/jo-inc/camofox-browser) | Internal infra (anti-bot scraping) | Upgrade `api/scrape.js` if Cloudflare/anti-bot becomes a problem |
| `Anil-matcha/Open-Generative-AI` (https://github.com/Anil-matcha/Open-Generative-AI) | Reference for image/video model menu | Extend `IMAGE_PROMPTING.md` model selector |
| `Fincept-Corporation/FinceptTerminal` (https://github.com/Fincept-Corporation/FinceptTerminal) | Niche finance UI; not a portable skill | Light reference in `FUNDRAISING.md` for financial modeling |
| `The-Swarm-Corporation/AutoHedge` (https://github.com/The-Swarm-Corporation/AutoHedge) | Multi-agent trading architecture; not founder-facing | Architecture pattern for future multi-agent orchestration |

---

## E · 2026 worked-example AI products (used as case studies in `COMPETITIVE_TEARDOWN.md`)

Not skills themselves — but used inside the Competitive Teardown
framework as analogies for distinct positioning archetypes.

| Product | Archetype | Lesson | Link |
|---|---|---|---|
| **Prism** (OpenAI) | Category capture by parent | If your moat is "we have GPT-X", incumbents can replace you in any vertical | https://openai.com/index/introducing-prism/ |
| **Astrio** | Modernization wedge | Most defensible AI products attack jobs that are boring/expensive/slow today | https://www.astrio.app/ |
| **MascotVibe** | Unbundling design fees | Pricing model can be the differentiator even when tech is commoditized | https://www.mascotvibe.com/ |
| **Perfectly** (YC) | AI-native category replacement | "AI-native X" beats "X with AI" when workflow is re-architected, not augmented | https://www.ycombinator.com/companies/perfectly |
| **Inception Labs (Mercury LLM)** | Infra-layer breakthrough | Foundational moat = research breakthrough + engineering depth | https://www.inceptionlabs.ai/ |
| **theORQL** | Natural-language interface to commodity infra | Thin wrappers are valid V1, but plan a deepening V2 (proprietary data, fine-tune, exclusive integrations) | (no canonical site found in 2026 search) |

---

## F · Authoring shape — every KB follows this structure

### For mode KBs (`kb/modes/*.md`)

```
# Mode — {Name}

## Purpose
{1 paragraph — what the mode does + value delivered}

## When this mode is right
- {bullets}

## When this mode is wrong
- {bullets — pre-PMF traps, regulated verticals, unit-economics red flags}

## Pre-work — required before any advice
{1-5 numbered steps; concrete data the user must surface}

## {Mode-specific rubrics, frameworks, or checklists}
{Tables, scoring systems, weighted audits, taxonomies}

## Output rules
- {what the agent must always do}
- {what the agent must refuse}

## Output structure
```
{markdown template the agent fills in}
```

## Handoff
- Where this mode hands off to other modes

## What this mode does NOT do
- {explicit non-goals to prevent scope creep}
```

### For framework KBs (`kb/frameworks/*.md`)

```
# Framework — {Name} ({Originator})

## Origin
{Who created it, when, core claim}

## When to use
- {bullets}

## When NOT to use
- {bullets}

## The {framework}
{Main exposition — formula, canvas, matrix, taxonomy. ASCII art
diagrams where helpful.}

## Step-by-step application
{Numbered steps}

## Common traps
- {pitfalls}

## Output structure
```
{markdown template}
```

## Decision-log entry suggestion
- Category: {validation/product/pricing/gtm/positioning/etc.}
- Reversibility: {reversible / expensive / one-way}
- Revisit: {timeframe}
```

---

## G · Plumbing the KBs into a project (architectural notes)

If the other Claude is integrating these into a different codebase,
here's the wiring pattern that worked for CockRoach (Vite + React +
TypeScript):

1. **Author** the markdown KB files in `kb/modes/` and `kb/frameworks/`.
2. **Mode loader** (`src/lib/kb-mode-loader.ts`): use Vite's `?raw`
   import to embed each `.md` as a string at build time. Export a
   `MODE_KBS` record keyed by mode id.
3. **Framework loader** (`src/lib/kb-framework-loader.ts`): same
   pattern, plus a `FRAMEWORK_CATALOG` array with metadata
   (id, name, origin, oneLine, bestFor) for UI surfacing.
4. **System prompt builder** (`src/lib/system-prompt-builder.ts`):
   accept `activeMode` + optional `activeFrameworkId`. Inject:
   - `[MODE KB — {NAME}]\n{body}` (always when a mode is active)
   - `[FRAMEWORK KB — {Name} ({Origin})]\n{body}` (only when
     `activeFrameworkId` is set; scope to a single chat turn)
5. **App-level mode picker**: enum + icon mapping; group modes
   by archetype (core / operator / discovery / creative).
6. **Framework "Run on this project" UI**: dropdown surfacing
   `FRAMEWORK_CATALOG`; sets `activeFrameworkId` for the next turn,
   then clears.

For non-Vite stacks, replace `?raw` imports with whatever does
build-time string embedding (Webpack `raw-loader`, Next.js
`fs.readFileSync` in a server component, etc.).

---

## H · Inventory totals

- **19 mode KBs** (4 core + 11 operator + 2 discovery + 2 creative)
- **9 framework KBs**
- **5 foundation/skills KBs** (always-on)
- **= 33 KB files total**

Of these, **2 modes (PAID_ADS, SEO_AND_CONTENT) and the entire
9-framework library** were authored fresh in the 2026-05-02 session
that produced this reference.

---

*End of reference. The other Claude account can use this file to
recreate or extend an equivalent skill layer in any project.*
