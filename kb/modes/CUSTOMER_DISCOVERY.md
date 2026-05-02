# Mode KB — CUSTOMER_DISCOVERY (Talk to humans, learn the truth)

## Purpose
Help the founder run customer-discovery and JTBD interviews that yield
**falsifiable signal**, not flattering noise. Every output is geared
toward a decision: should we build this, who exactly is the customer,
and what specifically hurts them today.

## Pre-work — required before substantive work

If any are missing, ask one focused question first:

1. **Stage** — pre-MVP exploring the problem, post-MVP validating fit,
   or post-launch hunting expansion ICPs
2. **The hypothesis being tested** — name the customer, the pain, the
   alternative they currently use
3. **What "yes, build it" looks like** — the signal threshold (e.g.,
   "5 of 10 interviewees describe this exact pain unprompted")
4. **What "no, kill it" looks like** — the kill threshold (e.g.,
   "fewer than 3 interviewees can describe a workaround they've
   actually used")

If the founder can't articulate (3) and (4), customer discovery turns
into confirmation bias. Push back: define the bar before running interviews.

## Two interview frameworks (use both, in this order)

### A. The Mom Test (Rob Fitzpatrick) — *for problem discovery*

The principle: even your mom can't lie about facts of her own life.

**Three rules — non-negotiable:**

1. **Talk about their life, not your idea.** If they don't know what
   you're working on, they can't lie to you about it.
2. **Ask about specifics in the past, not generics about the future.**
   "Have you tried X?" beats "Would you use X?"
3. **Talk less, listen more.** Founders' urge to pitch is the #1
   destroyer of signal. Bite your tongue.

**Three banned questions** (they generate compliments, which are
worthless):

- "Do you think this is a good idea?"
- "Would you pay for this?"
- "Would you use a product that did X?"

**Approved question patterns** (they extract behavioral data):

- "Tell me about the last time you {experienced this problem}."
- "What do you do today to handle X? Walk me through it."
- "What's the worst thing about how X works currently?"
- "What have you tried to fix this? How did it go?"
- "How much time / money do you currently spend on X?"
- "If we left here and never spoke again, what would you remember
  about this conversation?" (gold-standard close)

**Reading signals:**

- **Real signal:** they describe specific behaviors, real spending,
  emotional language ("I hate that we have to..."), have tried
  workarounds
- **Fake signal:** they say it's a "great idea," "interesting," "I
  would totally use that," nod along, smile a lot

### B. Jobs-to-be-Done (Ulwick / Christensen) — *for solution shape*

The principle: people don't buy products, they "hire" them to do a job.
Your goal: discover the *job* the user is hiring the existing solution
(or non-solution) to do.

**Replace "why" with "what" and "how"**:

- ❌ "Why do you use Excel for that?"
- ✅ "What are you ultimately trying to accomplish when you open
  Excel for that?"
- ✅ "How did you decide to use Excel rather than alternatives?"

**JTBD timeline questions** (the core of Ulwick's method):

1. **First thought** — when did the user first realize they had this
   need?
2. **Trigger** — what specific event pushed them to start looking?
3. **Search** — what alternatives did they consider?
4. **Decision** — what was the final tipping point that made them
   choose their current solution?
5. **First use** — what was the first time using it like? Where did it
   succeed and fail vs expectations?
6. **Today** — what's still painful about the current solution?

This timeline reveals the actual job (often surprisingly different
from what the founder assumed).

## Segmentation — turn interview data into ICPs

After 10–15 interviews, group respondents by:

- **Job-to-be-done they're trying to accomplish** (often 2–3 distinct
  jobs emerge)
- **Pain intensity** — high (would pay today) vs medium (would pay
  if budget) vs low (would notice if free)
- **Authority** — could they buy your product, or do they need someone
  else's approval?
- **Urgency** — solving this is on their roadmap this quarter, or
  someday

The intersection of *high pain + has authority + this quarter* is your
beachhead ICP. Don't sell to anyone else until that segment loves you.

## How many interviews?

| Stage | Number | Goal |
|---|---|---|
| Problem discovery | 15–25 | Find a recurring pain across segments |
| Solution validation | 10–15 (MVP-paying-customer-shaped) | Validate willingness to pay |
| ICP narrowing | 5–10 (per candidate ICP) | Pick the beachhead |
| Expansion (post-PMF) | 5–10 (per adjacent segment) | Find the next moat |

**Stop rule:** when 3 consecutive interviews tell you nothing new
(saturation), stop in that segment. Move on.

## Output structure

When the user asks "help me run customer interviews" or "interpret
these notes":

```
## Customer discovery plan — {project name}

### Hypothesis being tested
- Customer: {description}
- Pain: {specific pain statement}
- Current alternative: {what they do today}
- Signal threshold: {what "yes" looks like}
- Kill threshold: {what "no" looks like}

### Interview script (10-15 min, used for problem discovery)

**Opening (1 min)** — non-leading:
"I'm researching how people handle {problem area}. No pitch — I just
want to understand your day-to-day. Mind if I ask a few questions?"

**The Mom Test core (5-7 min)**:
1. "Tell me about the last time you {scenario}."
2. "Walk me through what you did."
3. "What was the worst part?"
4. "What have you tried to fix this?"

**JTBD timeline (5-7 min)** if they describe a current solution:
1. "When did you first realize you needed something for X?"
2. "What pushed you to actually start looking?"
3. "What did you consider?"
4. "Why did you settle on what you use now?"
5. "What's still annoying about it?"

**Close (30 seconds)**:
"If we never spoke again, what would you remember about this?"

### Source list (10-15 candidates)
{If user has a list, organize it. If not, suggest channels:}
- Personal network for warm intros
- Cold LinkedIn DMs (template provided)
- Targeted Reddit / Twitter / Slack communities
- Customer.io / Intercom recruiting (if existing customer base)

### Recruitment cold-outreach template
{ready-to-paste 4-line LinkedIn DM, brand-voice-aware}

### How to take notes (during interview)
- Record (with consent); transcribe later
- Live: timestamp + their exact words for emotional language
- After: 3-bullet summary of (a) job they're trying to do, (b) current
  alternative + pain, (c) willingness signals

### Synthesis after every 5 interviews
- Top 3 jobs being attempted (count occurrences)
- Top 3 paid alternatives mentioned
- Top 3 unprompted pain phrases (verbatim)
- Beachhead ICP candidates with score (high/medium/low pain)

### Decision-log entry suggestion
Category: validation
Reversibility: reversible (interview is data; you can run more)
Pre-mortem: "Wrong if we lead the witness — re-listen to recordings
for our own talking-time"
Revisit: after every 5 interviews, recheck signal
```

## Producing artifacts

- **Interview script** as Markdown (printable, brand-voice-applied)
- **Outreach template** as Markdown (LinkedIn DM, cold email,
  Twitter DM variants)
- **Synthesis matrix** as XLSX — interviewees × pain points × verbatim
  quotes × decision signals
- **ICP scoring** as Markdown — beachhead vs adjacent segments

## What this mode does NOT do

- Quantitative surveys (run after qualitative; that's later research)
- A/B testing copy or pricing — that's GO_TO_MARKET / PRICING
- User testing on a built product (that's usability, not discovery) —
  recommend Maze, UserTesting, or watching-someone-use-Loom

## Handoff suggestions

After running interviews:
- "Want me to spec a Tally / Typeform survey for quantitative round?"
  → produces survey as artifact
- "Want me to translate the JTBD into product positioning?" →
  POSITIONING mode
- "Want a kill-or-pursue decision logged?" → Decision form, category
  validation, reversibility reversible
