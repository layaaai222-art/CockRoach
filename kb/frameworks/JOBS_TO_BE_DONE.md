# Framework — Jobs To Be Done (Christensen / Ulwick)

## Origin
Clayton Christensen popularized the JTBD lens via *The Innovator's
Dilemma*. Tony Ulwick formalized it as **Outcome-Driven Innovation**.
The core claim: people don't buy products, they "hire" them to make
progress on a job. Get the job right and the rest follows.

## When to use
- Designing a new product (what *job* is this for?)
- Repositioning an existing product (we've been describing the wrong
  job)
- Customer segmentation (group by job, not demographics)
- Identifying expansion opportunities (what adjacent jobs do customers
  also need done?)

## When NOT to use
- Pre-customer. JTBD requires real users to interview. If you have
  zero users, run CUSTOMER_DISCOVERY first to *find* candidate users.
- Pure commodity / utility products where the job is universal and
  obvious.

## The core distinction

| Wrong question | Right question |
|---|---|
| What do you want? | When was the last time you {hired the current solution}? |
| Why do you use X? | What were you ultimately trying to accomplish? |
| Would you use a tool that…? | Walk me through what you did the last time… |

People can't predict their future preferences but **can** describe
their past behavior. Mine the past, not the future.

## Job statement format

A well-formed job has three parts:
**Verb + object + context.**

Example:
- ❌ "I want a CRM"
- ✅ "When a sales call ends, help me capture what was said and what
  needs to happen next, so I don't lose context before the next call."

Note the structure:
- **Trigger** (when…)
- **Job** (help me…)
- **Outcome** (so that…)

## The four "forces" of progress (Christensen)

When the customer hired your solution, four forces were in play:

1. **Push of the situation** — what about the *current* job felt
   broken?
2. **Pull of the new solution** — what about your product attracted
   them?
3. **Anxiety of switching** — what fears did they have about your
   product?
4. **Habits of the present** — what made the existing alternative
   sticky?

For someone to switch, **(1) + (2) > (3) + (4).** Identify which force
is lowest in your situation; that's your top growth lever.

## The JTBD timeline interview (Ulwick / "Switch interview")

For each customer who recently hired your product (or a competitor's),
walk through:

1. **First thought** — when did you first realize you had this job to
   do? What were you doing?
2. **Trigger event** — what specific moment pushed you to start
   actively looking?
3. **Search** — what did you consider? What did you Google? Who did
   you ask?
4. **Decision** — what was the deciding factor? What almost stopped
   you?
5. **First use** — what was the first time using it like? Where did
   it succeed? Where did it disappoint?
6. **Today** — what's still painful about the current solution?

## Step-by-step application

1. **Interview 5–8 customers** using the timeline. (Or 5–8 of
   *competitor's* customers — even better signal.)
2. **Cluster job statements** that emerge. You'll usually find 2–4
   distinct jobs across the same product.
3. **Pick a primary job** for your positioning. The one with highest
   pain × biggest segment × least-served-by-existing-solutions.
4. **Re-articulate your value prop** in job-statement form.
5. **Identify under-served outcomes** of that job. (Ulwick's
   Outcome-Driven Innovation: every job has 50-150 desired outcomes;
   the ones that are *important* + *unsatisfied* are your innovation
   targets.)

## Output structure

```
## JTBD analysis — {project name}

### Customers interviewed
{N customers, segments represented}

### Job statements that emerged
1. **When** {trigger} **I want to** {action} **so I can** {outcome}
2. ...
3. ...

### Force diagnosis (current product)
- Push of the situation (1-10): {score}
- Pull of new solution (1-10): {score}
- Anxiety of switching (1-10, lower better): {score}
- Habits of present (1-10, lower better): {score}
**Net = (1+2) − (3+4):** {value}. {>0 = adoption likely; <0 = not yet}

### Primary job picked + why
{Single primary job + rationale: pain × size × under-served}

### Repositioned value prop (job-statement form)
"When {trigger}, {Product} helps {customer} {accomplish job}, so they
can {outcome}, unlike {existing alternative} which {failure mode}."

### Top 3 under-served outcomes (innovation targets)
1. {outcome} — currently scored {imp/unsatisfied} = {gap}
2. ...
3. ...

### Next 3 features to ship
Each tied to one under-served outcome.
```

## Decision-log entry suggestion
- Category: validation or product
- Reversibility: reversible (positioning is reversible; product
  shape might not be once shipped)
- Revisit: after next 5 customer interviews
