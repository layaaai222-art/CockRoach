// Vercel serverless function — Image generation proxy.
// Calls Azure OpenAI GPT-image-2 via the images/generations endpoint.
// Returns base64-encoded PNG. Origin allow-list + per-IP rate limit.

import { createClient } from '@supabase/supabase-js';

const ALLOWED_ORIGINS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/cock-roach\.vercel\.app$/,
  /^https:\/\/cock-roach(-[a-z0-9-]+)?-aasaanais-projects\.vercel\.app$/,
  /^https:\/\/cock-roach-git-[a-z0-9-]+-aasaanais-projects\.vercel\.app$/,
];

// Image gen is expensive — tighter rate limit than chat.
const RATE_LIMIT = { windowMs: 60_000, max: 10 };
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

const ALLOWED_SIZES = new Set(['1024x1024', '1024x1536', '1536x1024', '1024x1792', '1792x1024']);
const ALLOWED_QUALITY = new Set(['low', 'medium', 'high', 'auto']);
const MAX_PROMPT_CHARS = 4000;

// Rough pricing for GPT-image-2 (USD per image, 1024x1024 standard quality
// from current Azure pricing). Used for cost log estimation only.
const COST_PER_IMAGE = {
  'low':    0.011,
  'medium': 0.042,
  'high':   0.167,
  'auto':   0.042,
};

function logUsage({ userId, chatId, projectId, model, quality, status, ms }) {
  try {
    const sbUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    if (!sbUrl || !sbKey) return;
    const sb = createClient(sbUrl, sbKey);
    void sb.from('api_usage_log').insert({
      user_id: userId ?? null,
      chat_id: chatId ?? null,
      project_id: projectId ?? null,
      endpoint: 'image_gen',
      model: model ?? null,
      prompt_tokens: null,
      completion_tokens: null,
      total_tokens: null,
      estimated_cost_usd: COST_PER_IMAGE[quality] ?? 0.042,
      status: status ?? 'ok',
      ms: ms ?? null,
    });
  } catch { /* swallow */ }
}

export default async function handler(req, res) {
  const origin = pickAllowedOrigin(req.headers.origin);
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.headers.origin && !origin) return res.status(403).json({ error: 'Origin not permitted' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = getClientIp(req);
  if (rateLimitExceeded(ip)) {
    res.setHeader('Retry-After', String(Math.ceil(RATE_LIMIT.windowMs / 1000)));
    return res.status(429).json({ error: 'Too many image requests — try again in a minute.' });
  }

  const {
    AZURE_OPENAI_ENDPOINT,
    AZURE_OPENAI_KEY,
    AZURE_OPENAI_IMAGE_DEPLOYMENT,
    AZURE_OPENAI_IMAGE_VERSION,
    AZURE_OPENAI_VERSION,
  } = process.env;

  if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_KEY || !AZURE_OPENAI_IMAGE_DEPLOYMENT) {
    return res.status(500).json({
      error: 'Image generation not configured. Set AZURE_OPENAI_IMAGE_DEPLOYMENT (and optionally AZURE_OPENAI_IMAGE_VERSION) in server env.',
    });
  }

  const body = req.body || {};
  const prompt = typeof body.prompt === 'string' ? body.prompt.slice(0, MAX_PROMPT_CHARS).trim() : '';
  if (!prompt || prompt.length < 3) {
    return res.status(400).json({ error: 'Prompt is required (min 3 chars).' });
  }

  const size = ALLOWED_SIZES.has(body.size) ? body.size : '1024x1024';
  const quality = ALLOWED_QUALITY.has(body.quality) ? body.quality : 'medium';
  const n = Math.min(Math.max(parseInt(body.n, 10) || 1, 1), 4);

  const apiVersion = AZURE_OPENAI_IMAGE_VERSION || AZURE_OPENAI_VERSION || '2025-04-01-preview';
  const base = AZURE_OPENAI_ENDPOINT.endsWith('/') ? AZURE_OPENAI_ENDPOINT.slice(0, -1) : AZURE_OPENAI_ENDPOINT;
  const azureUrl = `${base}/openai/deployments/${AZURE_OPENAI_IMAGE_DEPLOYMENT}/images/generations?api-version=${apiVersion}`;

  const startMs = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90_000); // image gen can take 30-60s

  let azureResp;
  try {
    azureResp = await fetch(azureUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': AZURE_OPENAI_KEY },
      body: JSON.stringify({ prompt, size, quality, n, output_format: 'png' }),
      signal: controller.signal,
    });
  } catch (e) {
    clearTimeout(timeoutId);
    logUsage({ userId: body.userId, chatId: body.chatId, projectId: body.projectId, model: AZURE_OPENAI_IMAGE_DEPLOYMENT, quality, status: 'error', ms: Date.now() - startMs });
    return res.status(502).json({ error: `Image upstream failed: ${e.name}` });
  }
  clearTimeout(timeoutId);

  if (!azureResp.ok) {
    let upstream = azureResp.statusText;
    try {
      const err = await azureResp.json();
      upstream = err?.error?.message ?? upstream;
    } catch { /* non-json */ }
    logUsage({ userId: body.userId, chatId: body.chatId, projectId: body.projectId, model: AZURE_OPENAI_IMAGE_DEPLOYMENT, quality, status: 'error', ms: Date.now() - startMs });
    return res.status(azureResp.status).json({ error: `Image gen: ${upstream}` });
  }

  let data;
  try { data = await azureResp.json(); } catch { data = null; }
  const items = Array.isArray(data?.data) ? data.data : [];
  if (items.length === 0) {
    return res.status(502).json({ error: 'Image generator returned no data.' });
  }

  // Normalize to {b64, url} pairs. Some deployments return URLs, others b64.
  const images = items.map((it) => ({
    b64: typeof it.b64_json === 'string' ? it.b64_json : null,
    url: typeof it.url === 'string' ? it.url : null,
    revised_prompt: typeof it.revised_prompt === 'string' ? it.revised_prompt : null,
  }));

  logUsage({ userId: body.userId, chatId: body.chatId, projectId: body.projectId, model: AZURE_OPENAI_IMAGE_DEPLOYMENT, quality, status: 'ok', ms: Date.now() - startMs });
  return res.status(200).json({ images, size, quality, model: AZURE_OPENAI_IMAGE_DEPLOYMENT });
}
