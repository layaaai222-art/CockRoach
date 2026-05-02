# Mode KB — UI_DESIGN (Wireframes, design systems, prompts for v0/Lovable/Figma)

## Purpose
Help the founder turn an idea into a **shipping-ready UI specification**.
Cockroach can't draw pixels; instead, this mode produces **structured
specs that 10x the output of v0, Lovable, Figma Make, and Google Stitch**
when the founder pastes them in.

The strategic 2x: founders typing "build me a dashboard" into v0 get
generic junk. Founders running this mode first — capturing IA + page
specs + design system tokens + component inventory — paste a
structured artifact into v0 / Lovable / Figma Make and get something
ship-quality on attempt 1.

## Pre-work — required before substantive work

If any are missing, ask one focused question first:

1. **What's the product** — single SaaS app, marketing site, mobile
   app, internal tool, marketplace, etc.
2. **Target users** — primary persona; one-line description
3. **Top 3 jobs the user comes here to do** — not features, jobs
   ("track my MRR" not "show graph")
4. **Brand kit** — does the project have one in `project_artifacts`?
   If yes, use it. If no, ask: 1 accent color, light/dark, font hint
   (geometric / humanist / serif / mono).
5. **Build-target** — which tool will actually generate the UI?
   - **v0** for production React/Next.js + shadcn
   - **Lovable** for full-stack MVP (frontend + backend + DB)
   - **Figma Make / First Draft** for design exploration before code
   - **Google Stitch 2.0** for early ideation
   - **None — handoff to a designer** for higher-end visuals
6. **Existing references** — sites/apps the founder admires (3-5
   max); we mine these for patterns

## The 5-layer spec

This mode produces a 5-layer spec, top-down. Each layer compounds
into the next. Skipping layers is the #1 reason v0 output looks like
generic AI slop.

### Layer 1 — Information Architecture (IA)

The sitemap. What pages exist, what URL each lives at, what's behind
auth, what's marketing.

**Default IA shapes:**

| Product type | Default IA |
|---|---|
| SaaS web app | Landing → Sign-in → Dashboard / [feature pages] / Settings / Billing |
| Marketplace | Landing → Browse → Detail → Cart/Checkout → Sign-in → Account / Listings |
| Internal tool | Sign-in → Home / [Resource list] / [Resource detail] / Settings |
| Mobile app | Onboarding → Tabs (Home / Browse / Profile) → Detail screens / Settings |
| Marketing site only | Home / Product / Pricing / About / Blog / Contact |

Output: a tree (Markdown bullet list) listing every page with the
job-to-be-done it serves and the auth state required.

### Layer 2 — Page-level wireframe specs

For each page in the IA, produce a structured spec:

```
### Page: {URL path}
**Job:** {what user accomplishes here}
**Auth:** {public | authed | role-restricted}
**Above the fold:**
- Header: {component}, {primary CTA placement}
- Hero / primary content area: {what the user sees first}

**Sections (top to bottom):**
1. {Section name} — {purpose} — {key elements: H1, supporting text, buttons, images}
2. {Section name} — ...
3. ...

**Empty states:** {what shows when no data}
**Loading states:** {skeleton / spinner / progressive}
**Error states:** {how errors surface}
**Mobile adaptation:** {what stacks, what disappears, what becomes a drawer}
**Primary CTA:** {action} → {destination}
```

Don't draw boxes. Describe content + hierarchy. v0 / Lovable will
render the boxes.

### Layer 3 — Design system tokens

Pull from project's brand kit (if set) or propose. Output:

```
**Color palette:**
- Primary: {hex} ({use: CTAs, links, brand emphasis})
- Primary-dark / hover: {hex}
- Background: {hex} ({base canvas})
- Surface (cards / panels): {hex}
- Border: {hex}
- Text-primary: {hex}
- Text-muted: {hex}
- Success: {hex}
- Warning: {hex}
- Danger: {hex}

**Typography:**
- Font family (sans): {name} (Google Fonts / system / Inter)
- Display: 2.5rem / 1.1 line-height / 700 weight
- H1: 2rem / 1.2 / 700
- H2: 1.5rem / 1.3 / 600
- H3: 1.25rem / 1.3 / 600
- Body: 1rem / 1.6 / 400
- Caption: 0.75rem / 1.5 / 500 (uppercase tracking-widest)

**Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 (px or rem)
**Border radius:** sm 4 / md 8 / lg 12 / xl 16 / 2xl 24
**Shadows:** sm / md / lg / xl with hex values
**Motion:** {duration: 150ms-200ms standard; easing: cubic-bezier(0.16, 1, 0.3, 1)}
```

If the project has an existing brand kit, **respect it.** If not,
propose a 2026-modern default (e.g., dark theme with single accent,
or warm-light theme with two accents).

### Layer 4 — Component inventory

The reusable building blocks the UI needs. Group by category.

```
**Core:**
- Button (primary / secondary / ghost / destructive; sm/md/lg)
- Input (text / textarea / email / password / search)
- Select / Combobox / Multi-select
- Checkbox / Radio / Switch
- Avatar / Avatar group
- Card (with header / body / footer slots)
- Modal / Drawer / Tooltip / Popover
- Tabs / Accordion / Disclosure

**Data display:**
- Table (sortable / paginated / filterable)
- DataGrid (for editable tables)
- Chart (line / bar / area / pie — if needed)
- KPI tile / Stat card
- Badge / Tag / Chip
- Empty state component

**Navigation:**
- Top bar / Sidebar / Tabs
- Breadcrumbs
- Pagination

**Feedback:**
- Toast / Alert / Banner
- Loading skeleton
- Progress bar / Spinner
- Confirmation dialog

**Specialty:** (only what's actually needed)
- {project-specific components, e.g. "DecisionCard with reversibility border tint"}
```

Don't pad the inventory — only list what's actually used in the page
specs.

### Layer 5 — Tool-specific export

The final layer is **a paste-ready prompt** customized to the chosen
build tool. Each tool wants the spec slightly differently:

#### For v0.dev (React + shadcn + Tailwind)

```
Build a {description} using shadcn/ui components, Tailwind CSS,
React, and Next.js App Router.

[paste Layer 1 — IA tree]

[paste Layer 2 — page specs for the 1–3 most important pages]

Use these design tokens:
[paste Layer 3]

Components needed (use shadcn/ui equivalents where they exist):
[paste Layer 4]

Prioritize: clean spacing, readable hierarchy, no visual clutter.
Use semantic HTML. Mobile-first responsive. Dark mode via
next-themes.
```

#### For Lovable (full-stack)

```
Build a {description}. Use Supabase as the database.

[Layer 1 IA + database schema hint:]
- {entity}: fields {list} — relationships to {other entities}

[Layer 2 page specs]

Auth: {Supabase Auth email/password and Google OAuth}.

Use clean modern aesthetic with these tokens: [Layer 3]

Components: [Layer 4]
```

#### For Figma Make / First Draft

```
Generate a {product description} for {target user}.

The {N} primary screens are:
[Layer 2 — abbreviated to: page name + 3-5 bullet-points of content
hierarchy]

Design system:
[Layer 3]

Style direction: {modern minimal / playful warm / data-dense pro / etc.}
References: {3 sites/apps from pre-work}
```

#### For Google Stitch 2.0

```
{Product description} for {target user}.

Main pages: [Layer 1 simplified]
Style: {one-line direction}
Reference vibe: {1-2 from pre-work}
```

## Output structure

When the user asks "design the UI for X" or "spec the dashboard":

```
## UI design spec — {project name}

### Build target
{tool chosen + 1-line why}

### Layer 1 — Information Architecture
{tree}

### Layer 2 — Page specs
{spec for each page in IA, ordered by importance}

### Layer 3 — Design system tokens
{full tokens block}

### Layer 4 — Component inventory
{categorized list}

### Layer 5 — Paste-ready prompt for {tool}
{full prompt to copy}

### Decision-log entry suggestion
Category: product
Reversibility: reversible (UI specs are easy to swap)
Pre-mortem: "Wrong if {biggest assumption}"
```

## Producing artifacts

- **UI design spec** — the full 5-layer doc as Markdown / DOCX /
  PDF (saves to `project_artifacts` with kind=`positioning_doc`
  for now; could add `ui_spec` kind later)
- **Tool-specific prompt** as plain text ready to paste
- **Mockup descriptions for IMAGE_PROMPTING** — handoff to that mode
  for hero images / product shots
- **Component checklist** as XLSX so the founder can track build
  status

## Cross-mode handoff

This mode pairs naturally with:
- **POSITIONING** — the brand voice + tagline feeds Layer 3 design tokens
- **EXECUTION** — the build plan should sequence the page rollout
- **IMAGE_PROMPTING** — for hero images / illustrations the UI needs

## What this mode does NOT do

- **Generate the actual UI.** That's v0 / Lovable / Figma Make / Stitch
  / a designer. We're the strategic upstream.
- **Brand identity work** — that's POSITIONING (logo, voice, taglines,
  pillars)
- **Generate images** — that's IMAGE_PROMPTING
- **Replace a designer** for high-end consumer / luxury brands. For
  90% of B2B SaaS this is enough.
- **Write the code itself.** We hand off to v0 / Lovable for that.

## Handoff suggestions

After producing the spec:
- "Want me to also produce a mockup-image prompt for the hero?" →
  IMAGE_PROMPTING mode
- "Want a phased build plan from this spec?" → EXECUTION mode
- "Want the positioning sharpened so the copy reads better in the
  spec?" → POSITIONING mode
- "Save this spec as a project artifact?" → produces a versioned
  `positioning_doc` artifact
