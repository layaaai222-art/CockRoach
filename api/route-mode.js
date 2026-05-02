// Vercel serverless function — Mode router.
// Given a user's first message + project context, calls a cheap Azure
// chat completion to pick the right mode (one of the 19 mode KB ids).
// Returns JSON: { modeId, confidence, reasoning }. Falls back to
// 'GENERAL' on any failure so the chat path is never blocked.

const ALLOWED_ORIGINS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/cock-roach\.vercel\.app$/,
  /^https:\/\/cock-roach(-[a-z0-9-]+)?-aasaanais-projects\.vercel\.app$/,
  /^https:\/\/cock-roach-git-[a-z0-9-]+-aasaanais-projects\.vercel\.app$/,
];

const RATE_LIMIT = { windowMs: 60_000, max: 60 }; // routing is cheap; allow more
const hits = new Map();

function pickAllowedOrigin(origin) {
  if (!origin) return null;
  return ALLOWED_ORIGINS.some(r => r.test(origin)) ? origin : null;
}

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) return xff.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

function rateLimitExceeded(ip) {
  const now = Date.now();
  const window = hits.get(ip)?.filter(t => now - t < RATE_LIMIT.windowMs) ?? [];
  if (window.length >= RATE_LIMIT.max) {
    hits.set(ip, window);
    return true;
  }
  window.push(now);
  hits.set(ip, window);
  if (hits.size > 1000) {
    for (const [k, ts] of hits) {
      if (!ts.some(t => now - t < RATE_LIMIT.windowMs)) hits.delete(k);
    }
  }
  return false;
}

// Compact mode catalog — id + 1-line description.
// Must stay in sync with kb-mode-loader.ts MODE_KBS keys.
const MODE_CATALOG = [
  { id: 'GENERAL',             desc: 'Default conversational mode for any open-ended question.' },
  { id: 'THINKING',            desc: 'Slow, structured thinking on hard strategic questions.' },
  { id: 'DEEP_RESEARCH',       desc: 'Multi-source research synthesis on a market or topic.' },
  { id: 'PIVOT_OR_PERSEVERE',  desc: 'Decision rubric for whether to pivot, persevere, or kill an idea.' },

  { id: 'CUSTOMER_DISCOVERY',  desc: 'Mom-test interviews, JTBD timeline, ICP scoring.' },
  { id: 'BUSINESS_MODEL',      desc: 'Business model design + unit economics.' },
  { id: 'POSITIONING',         desc: 'Sharpening market positioning + brand narrative.' },
  { id: 'PRICING',             desc: 'Pricing model, tiers, packaging, sensitivity testing.' },
  { id: 'GO_TO_MARKET',        desc: 'PLG vs sales-led, channel selection, CAC math, first-100 playbook.' },
  { id: 'PAID_ADS',            desc: 'Paid acquisition audit, creative briefs, ad copy, budget plans.' },
  { id: 'SEO_AND_CONTENT',     desc: 'SEO audits, keyword research, E-E-A-T content, organic growth.' },
  { id: 'EXECUTION',           desc: 'Build plan, roadmap, ship-discipline.' },
  { id: 'FUNDRAISING',         desc: 'Raise vs bootstrap, SAFEs, decks, investor list, term sheets.' },
  { id: 'HIRING_AND_EQUITY',   desc: 'First hires, equity bands, vesting, sourcing, screening.' },
  { id: 'LEGAL_AND_OPS',       desc: 'Entity choice, founder agreements, IP, compliance flags.' },

  { id: 'IDEA_GENERATION',     desc: 'Generating fresh business ideas tailored to the founder.' },
  { id: 'IDEA_VALIDATION',     desc: 'Validating an idea against multi-axis scoring + evidence.' },

  { id: 'UI_DESIGN',           desc: 'UI/UX design specs for v0 / Lovable / Figma Make / Stitch.' },
  { id: 'IMAGE_PROMPTING',     desc: 'Crafting structured image prompts for visual generation.' },
];

const VALID_MODE_IDS = new Set(MODE_CATALOG.map(m => m.id));

function buildRouterPrompt({ projectStage, recentDecisions, founderFitSummary }) {
  const catalog = MODE_CATALOG.map(m => `- ${m.id}: ${m.desc}`).join('\n');

  let bias = '';
  if (projectStage === 'idea') {
    bias = '\nProject is at IDEA stage — favor IDEA_VALIDATION, CUSTOMER_DISCOVERY, BUSINESS_MODEL, POSITIONING.';
  } else if (projectStage === 'validated' || projectStage === 'building') {
    bias = '\nProject is BUILDING — favor EXECUTION, GO_TO_MARKET, PAID_ADS, UI_DESIGN, PRICING.';
  } else if (projectStage === 'launched' || projectStage === 'scaling') {
    bias = '\nProject is LAUNCHED — favor PIVOT_OR_PERSEVERE, PRICING, HIRING_AND_EQUITY, GO_TO_MARKET, SEO_AND_CONTENT.';
  }

  const decisionsCtx = (recentDecisions && recentDecisions.length)
    ? `\nRecent decisions logged: ${recentDecisions.slice(0, 5).join('; ')}`
    : '';
  const founderCtx = founderFitSummary ? `\nFounder profile: ${founderFitSummary.slice(0, 400)}` : '';

  return `You route entrepreneurial questions to the correct working mode for a founder co-pilot.

Pick exactly ONE mode id from this catalog. Only return modes from this list.

CATALOG:
${catalog}

ROUTING RULES:
- Match user intent to the most-specific applicable mode.
- If the question is broad/exploratory or no specific mode fits well, use GENERAL.
- If the question is about a hard strategic call requiring structured thought, use THINKING over GENERAL.
- If the question requires research on a market/competitor, use DEEP_RESEARCH.
- Confidence should be HIGH only if the match is unambiguous. Medium for plausible but not certain. Low when guessing.${bias}${decisionsCtx}${founderCtx}

Output strictly valid JSON, no prose:
{"modeId":"<one of the catalog ids>","confidence":"high|medium|low","reasoning":"<one sentence>"}`;
}

const MAX_MSG_CHARS = 4000;

export default async function handler(req, res) {
  const origin = pickAllowedOrigin(req.headers.origin);
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.headers.origin && !origin) {
    return res.status(403).json({ error: 'Origin not permitted' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getClientIp(req);
  if (rateLimitExceeded(ip)) {
    res.setHeader('Retry-After', String(Math.ceil(RATE_LIMIT.windowMs / 1000)));
    return res.status(429).json({ error: 'Too many requests' });
  }

  const { AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY, AZURE_OPENAI_DEPLOYMENT, AZURE_OPENAI_VERSION } = process.env;
  if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_KEY || !AZURE_OPENAI_DEPLOYMENT || !AZURE_OPENAI_VERSION) {
    return res.status(500).json({ error: 'Azure OpenAI not configured on server' });
  }

  const body = req.body || {};
  const message = typeof body.message === 'string' ? body.message.slice(0, MAX_MSG_CHARS) : '';
  if (!message || message.trim().length < 3) {
    // Too short to route meaningfully — return GENERAL.
    return res.status(200).json({ modeId: 'GENERAL', confidence: 'low', reasoning: 'Message too short to classify.' });
  }

  const projectStage = typeof body.projectStage === 'string' ? body.projectStage : null;
  const recentDecisions = Array.isArray(body.recentDecisions) ? body.recentDecisions.filter(s => typeof s === 'string') : [];
  const founderFitSummary = typeof body.founderFitSummary === 'string' ? body.founderFitSummary : null;

  const systemPrompt = buildRouterPrompt({ projectStage, recentDecisions, founderFitSummary });

  const base = AZURE_OPENAI_ENDPOINT.endsWith('/') ? AZURE_OPENAI_ENDPOINT.slice(0, -1) : AZURE_OPENAI_ENDPOINT;
  const azureUrl = `${base}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_OPENAI_VERSION}`;

  // Hard timeout to keep router from blocking the chat.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  let azureResp;
  try {
    azureResp = await fetch(azureUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': AZURE_OPENAI_KEY },
      body: JSON.stringify({
        model: AZURE_OPENAI_DEPLOYMENT,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.1,
        max_completion_tokens: 200,
        response_format: { type: 'json_object' },
        stream: false,
      }),
      signal: controller.signal,
    });
  } catch (e) {
    clearTimeout(timeoutId);
    return res.status(200).json({ modeId: 'GENERAL', confidence: 'low', reasoning: `Router unavailable (${e.name}); defaulting to GENERAL.` });
  }
  clearTimeout(timeoutId);

  if (!azureResp.ok) {
    return res.status(200).json({ modeId: 'GENERAL', confidence: 'low', reasoning: `Router upstream ${azureResp.status}; defaulting to GENERAL.` });
  }

  let parsed;
  try {
    const data = await azureResp.json();
    const content = data?.choices?.[0]?.message?.content ?? '';
    parsed = JSON.parse(content);
  } catch {
    return res.status(200).json({ modeId: 'GENERAL', confidence: 'low', reasoning: 'Router returned non-JSON; defaulting to GENERAL.' });
  }

  const modeId = typeof parsed?.modeId === 'string' && VALID_MODE_IDS.has(parsed.modeId) ? parsed.modeId : 'GENERAL';
  const confidence = ['high', 'medium', 'low'].includes(parsed?.confidence) ? parsed.confidence : 'low';
  const reasoning = typeof parsed?.reasoning === 'string' ? parsed.reasoning.slice(0, 240) : '';

  return res.status(200).json({ modeId, confidence, reasoning });
}
