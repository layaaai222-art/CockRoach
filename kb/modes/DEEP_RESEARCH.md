# Mode KB — DEEP_RESEARCH (Research Market)

## Purpose
User wants deep, sourced research on a market, trend, competitor, industry,
regulation, or technology — NOT a full idea validation. This is pure
information-gathering and synthesis.

## Distinction from IDEA_VALIDATION

| IDEA_VALIDATION | DEEP_RESEARCH |
|---|---|
| Targets a specific idea | Targets a market / space / question |
| Produces scoring + verdict | Produces synthesis + sources |
| 10-section structured report | Flexible structure matching the question |
| Ends with a go/no-go recommendation | Ends with a summary of findings + open questions |

## Research rules

- **Plan first.** At the start, output a 3–6 bullet research plan:
  *"I'll pull: (1) market size from [sources], (2) top 5 competitors with
  funding, (3) 3 recent regulatory shifts, (4) 2 counter-narratives."*
  Confirm with user before running — saves expensive re-runs.
- **Use the scraper.** Fetch real pages. Cite actual URLs. Do not trust
  pre-training knowledge for anything with numbers or dates.
- **Triangulate.** Every non-trivial claim should have 2+ independent
  sources OR be labeled `[single-source]`. Do not aggregate contradictory
  numbers silently — show the range.
- **Date-stamp everything.** `(source, Q3 2025)`. Flag anything > 18
  months old as "may be stale".
- **Show the gaps.** End every research output with "What I couldn't find"
  — the user needs to know what's unknown, not just what's known.

## Output format

Markdown. Sections driven by the question, not a fixed template. Typical
skeleton for a market research ask:

```
## {Market name} — snapshot as of {month year}

### Executive summary
3–5 bullets of the most important findings. Read-time 30 seconds.

### Market shape
TAM/SAM if relevant. Growth rate. Top segments with sizes.

### Landscape
| Player | Model | Funding | Traction | Differentiation |
|---|---|---|---|---|

### Signals I'm watching
- {trend} — {why it matters} — ({source})
- {counter-trend — something that could kill the whole space}

### Sources (by claim)
- **{Claim}** — {url} ({date accessed})
...

### What I couldn't find
- {unknown 1}
- {unknown 2}
```

## Cross-mode handoff

After DEEP_RESEARCH finishes, offer:
- "Want me to stress-test a specific idea against this research?"
  → IDEA_VALIDATION
- "Want a slide deck of this for a meeting?" → offer PPTX export (see
  SKILLS KB)

## Rate-limit awareness

`/api/scrape` is rate-limited to 20 req/min per IP. For large research
runs, batch the URLs, don't fire 50 fetches in parallel. If you hit a 429,
wait and retry — don't silently drop data.
