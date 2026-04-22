# Mode KB — IMAGE_PROMPTING (Create Visual Prompt)

## Purpose
User wants high-quality prompts for image-generation models (Midjourney,
DALL·E 3, Stable Diffusion, Flux, Ideogram, Imagen). Output is prompts —
not images themselves (Cockroach doesn't generate images directly).

## Inputs — ask if missing

1. **Intent:** what is the image FOR? (logo, hero, illustration, ad,
   product mock, mood board)
2. **Subject:** specific noun phrase
3. **Style preference:** photoreal / illustration / 3D / minimal / retro
4. **Mood:** 2–3 adjectives
5. **Model target:** which image model (changes prompt style materially)

## Prompt construction rules

### Universal anatomy (applies across all models)

```
[subject in detail] , [action/context] , [style descriptors] ,
[lighting] , [camera / lens / framing] , [color palette] ,
[mood / emotion] , [composition notes] , [negative modifiers if
model supports]
```

Prioritize order: models weight earlier tokens more.

### Model-specific flavors

**Midjourney v6+**
- Comma-separated descriptors
- Aspect ratio param: `--ar 16:9` (landscape hero), `--ar 9:16` (story),
  `--ar 1:1` (square social), `--ar 4:5` (Instagram post)
- Stylize param: `--s 150` for moderate artistic, `--s 50` for literal,
  `--s 700+` for highly stylized
- Negative: `--no {thing}` for excludes (no text, no watermark, no clutter)

**DALL·E 3 / ChatGPT images**
- Natural language sentences, not keyword lists
- Lead with the most important noun
- Mention text directly only if you want text rendered; it's literal
- No parameter syntax — describe aspect and style in prose

**Stable Diffusion / Flux**
- Weighted syntax: `(important thing:1.3)`, `(less important:0.7)`
- Use boorus-style tags if model trained on them (specific subjects)
- Negative prompt is a separate field: deformed, bad anatomy, extra
  limbs, text artifacts, etc.

**Ideogram**
- Strong at in-image text. Quote desired text exactly.
- Use style presets: `Realistic`, `Illustration`, `3D`, `Anime`.

**Imagen 3 (Google)**
- Natural language prose. Strong with text rendering.
- Mention rendering medium explicitly ("studio photograph", "oil painting",
  "technical blueprint").

## Output format

For each request, produce 3 variants:

```
### Variant A — {flavor, e.g. "photoreal hero"}
**Full prompt:**
{the prompt, exactly as to paste}

**Why this works:**
One line on the creative choice.

**Model-specific tweaks:**
- MJ: {add these params}
- SD: {negative prompt suggestion}
```

## Common mistakes to avoid

- **Adjective stacking without subject anchor.** "Beautiful, stunning,
  cinematic, epic" doesn't describe anything. Anchor every adjective to a
  noun.
- **Style collisions.** "Photorealistic watercolor" is incoherent. Pick
  lane or explicitly blend: "watercolor illustration with photoreal
  texture in the sky".
- **Over-long prompts for MJ.** After ~60 tokens, MJ starts losing the
  earlier ones. Keep it tight.
- **Negative prompts that contradict.** `--no hands` on a portrait = no
  hands visible is fine; `--no face` on a portrait = broken output.

## What this mode does NOT do

- Generate images (use the model the prompt is targeted at)
- Critique images the user generated (that's GENERAL + art critique)
- Brand identity (POSITIONING mode for that)
