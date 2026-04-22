# Skills KB — Report, Deck, and Analysis Craft

## Purpose
Always-loaded knowledge about HOW to produce enterprise-grade outputs the
user can actually take to an investor, partner, or board meeting without
embarrassment. Covers PPT decks, Excel models, charts, and exported
documents.

This KB is not about deciding WHAT to put in a deliverable (that's the
mode KBs). It's about making the deliverable *look right, compute right,
and read right*.

---

## 1. EXPORT CAPABILITIES AVAILABLE

The app ships with these export functions (in `src/lib/file-export.ts`):

| Export | Function | When to suggest |
|---|---|---|
| Markdown | `downloadMarkdown` | Sharing in Slack / Notion / git |
| Plain text | `downloadText` | Copying into emails |
| PDF | `downloadPDF` | Investor/partner-facing, final report |
| DOCX | `downloadDOCX` | User needs to edit / hand off to legal |
| XLSX | `downloadXLSX` | Financial models, data tables |
| CSV | `downloadCSV` | Data handoff, analytics ingestion |
| PPTX | `downloadPPTX` | Pitch decks, internal reviews |

Always offer the format that matches the recipient's workflow, not the
user's. "Sending this to a VC" → PDF or PPTX. "Working with legal" → DOCX.

---

## 2. PITCH / REPORT DECK — PPTX RULES

### Structure that closes (10–12 slides)

1. **Title** — company name, tagline, date, presenter
2. **The problem** — 1 slide, visceral. Customer quote or stat works.
3. **The solution** — 1 slide. What it is in one sentence + one visual.
4. **Why now** — the tailwind (regulatory / technical / cultural shift)
5. **How it works** — simplest possible flow (3–5 steps, no jargon)
6. **Market** — TAM/SAM/SOM; bottom-up preferred over top-down
7. **Business model** — how money moves; unit economics snapshot
8. **Traction** — users, revenue, signed LOIs, waitlist, anything real
9. **Competition** — 2×2 or differentiation matrix (never a checkmark
   sheet saying we win everything — not credible)
10. **Team** — why this team wins THIS problem
11. **The ask** — amount, use of funds, milestones it unlocks
12. **Contact + thanks**

### Visual rules — enforce these

- **One idea per slide.** If a slide needs two titles, it's two slides.
- **6-word rule on titles.** Titles are the slide's point, not labels.
  Bad: "Market Overview". Good: "$47B market, 23% CAGR through 2030."
- **Large numbers, large text.** Critical numbers get 60pt+ font. If the
  number is the point, let it breathe.
- **Charts > tables** for anything with ≥ 5 rows of numbers. Tables are
  for things you need to look up, not compare.
- **No bullet soup.** Max 3 bullets per slide. If you need 5, you need
  2 slides or a diagram.
- **Consistent accent color.** One brand color used sparingly. All other
  color choices earn their use.
- **Readable from the back of the room.** Test: would this be legible
  shrunk to 30% of screen? If not, simplify.

### Using pptxgenjs (the library we ship with)

- `slide.addText()` — headers, bullets, captions
- `slide.addTable()` — use sparingly; size cells to content
- `slide.addShape()` — dividers, accent bars, background panels
- `slide.addChart()` — use chart types below
- `slide.addImage()` — logos, photos; always include `w` + `h` not just
  `x`/`y`; stretch-distortion is an instant credibility hit
- `slide.background = { color: '0C0C0C' }` — CockRoach deck standard is
  dark; accent `8B1414` (deep red); text `FFFFFF`, muted `888888`

### Chart types — when to use

| Chart | Use for | Avoid when |
|---|---|---|
| Bar (vertical) | Category comparison (revenue by product) | More than ~8 categories — use horizontal |
| Bar (horizontal) | Rankings, many categories | Time series — use line |
| Line | Time series, trends | Categorical comparison |
| Area | Stacked time series where total matters | Unstacked time series — use line |
| Pie / Donut | Parts of a whole, ≤ 5 slices | Comparing two distributions |
| Scatter | Two-variable relationships | Time series |
| Waterfall | Decomposition (revenue → margin → EBITDA) | Anything else |

**Never:** 3D effects. Rainbow gradients on unrelated data. Pie charts
with 12 slices.

---

## 3. EXCEL / XLSX — FINANCIAL MODEL CRAFT

### Rules of a model someone can actually use

1. **One assumption = one cell.** No hard-coded numbers inside formulas.
   Assumption cells in a single block, highlighted (yellow fill).
2. **Color convention**:
   - Blue text → hard-coded inputs
   - Black text → formula
   - Green text → reference from another sheet
   - Red text → warning / violated constraint
3. **Check cells.** Every model needs at least 3:
   - `=IF(sum_of_parts = total, "OK", "MISMATCH")`
   - `=IF(revenue > 0, "OK", "ZERO")`
   - Balance-sheet-style: `=assets - liabilities - equity` should round
     to 0.
4. **Units in the header.** `$K`, `$M`, `%`, `units`. No ambiguity.
5. **Separate sheets for: Inputs, Calcs, Outputs, Charts.** Don't mix.
6. **Formulas should be copy-down safe.** No `$` misuse; test by dragging
   a formula across 3 columns before shipping.

### Standard models to know how to build

- **24-month P&L:** revenue ramp, COGS, gross margin, op-ex breakdown,
  EBITDA, runway
- **SaaS cohort retention:** monthly cohorts down, periods across, %
  retained cells; net revenue retention derived
- **LTV:CAC with sensitivity:** LTV formula, CAC by channel, table
  varying churn assumption (x-axis) and ARPU (y-axis)
- **Scenario analysis:** Base / Bull / Bear columns; differences only in
  Input sheet; all three computed automatically

### Using @e965/xlsx (the library we ship with)

- `XLSX.utils.book_new()` — new workbook
- `XLSX.utils.aoa_to_sheet(rows)` — arrays of arrays (header row first)
- `XLSX.utils.book_append_sheet(wb, ws, 'Name')` — tab name ≤ 31 chars
- `XLSX.writeFile(wb, 'model.xlsx')` — triggers download

To write formulas: set cell `{ t: 'n', f: 'SUM(B2:B10)' }` via
`XLSX.utils.sheet_add_aoa` with cell objects.

For number formatting: `cell.z = '$#,##0.00'` or `'0.00%'` etc.

---

## 4. CHARTS (in-chat)

When rendering data charts inline (not export), use Mermaid or Recharts.

### Mermaid — prefer for

- Flowcharts, state machines, sequence diagrams
- Gantt charts (roadmaps)
- Simple pie/bar charts when a quick visual is enough

Quality rules:
- Keep it under 20 nodes. Anything bigger becomes unreadable.
- Name things clearly ("Customer signs up", not "Step 1").
- Use subgraphs to group related nodes.

### Recharts — prefer for

- Real data visualizations the user will interact with
- Responsive / resizable charts
- Tooltips matter (hover to see exact values)

### Financial chart style

- X-axis labels human-readable ("Q1 '25", not "2025-03-31")
- Y-axis with consistent units; `$47M` beats `47000000`
- Legend only if ≥ 2 series
- Zero line always visible for anything with both positive and negative

---

## 5. DOCX — EDITABLE REPORTS

Using `docx` library:
- Use `HeadingLevel.HEADING_1/2/3` for real heading structure (ToC-
  friendly)
- Bold / italic runs via `TextRun({ text, bold: true })`
- Tables: `new Table({ rows: [...] })` with `WidthType.PERCENTAGE`
- Always include a title paragraph, a date paragraph, and a page break
  before each H1

Users who get DOCX usually need to edit it. Keep structure explicit
(heading styles, not just big bold text), so Word / Google Docs can show
a proper outline.

---

## 6. PDF — FINAL-FORM READING

Using `jspdf` + `jspdf-autotable`:
- Page margin: 18mm all sides
- Standard A4 portrait unless data genuinely needs landscape
- Font sizes: H1 22pt, H2 17pt, H3 14pt, body 10pt, footer 8pt
- Red underline bar under H1/H2 matches the CockRoach brand
- Tables via `autoTable` with `headStyles: { fillColor: [92, 5, 5], textColor: 255 }`
- Keep rows < 50. If longer, split logically (e.g. Top 20 + "see full
  table in XLSX export").

---

## 7. WHEN SOMEONE ASKS "MAKE ME A REPORT"

Default sequence:
1. Confirm the audience: who reads this?
2. Confirm the length / depth expectation
3. Pick the format from §1 that matches the audience
4. Produce the content (per the active mode's KB)
5. Offer 2–3 export formats at the end, NOT all 7

Don't ask 4 questions before starting. Reasonable defaults:
- Audience unclear → internal team
- Length unclear → "executive summary" (1–2 pages)
- Format unclear → PDF first, offer DOCX alternative

---

## 8. ETHICAL / HONESTY RULES

- **Never fabricate numbers.** If you need a number and don't have one,
  use `[estimate]` with the reasoning.
- **Label projections clearly.** `Projected` or `Target`, never unlabeled.
- **Cite sources for external claims.** Inline `(source, year)` or a
  sources section at the end.
- **No visual deception.** Don't truncate y-axes to exaggerate trends
  without a break marker. Don't use pie charts where slices don't sum to
  the real total.

A beautiful deliverable with fake numbers is worse than an ugly one with
real numbers. Craft and honesty are not in tension — both are required.
