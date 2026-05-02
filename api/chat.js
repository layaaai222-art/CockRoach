// Vercel serverless function — Azure OpenAI chat proxy.
// Streams the SSE response from Azure back to the client so the API key
// never touches the browser. Origin allow-list + per-IP rate limit.
// On stream completion, captures token usage and logs to api_usage_log
// for cost monitoring (best-effort, fire-and-forget).

import { createClient } from '@supabase/supabase-js';

const ALLOWED_ORIGINS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/cock-roach\.vercel\.app$/,
  /^https:\/\/cock-roach(-[a-z0-9-]+)?-aasaanais-projects\.vercel\.app$/,
  /^https:\/\/cock-roach-git-[a-z0-9-]+-aasaanais-projects\.vercel\.app$/,
];

const RATE_LIMIT = { windowMs: 60_000, max: 30 };
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

const MAX_MESSAGES = 100;
const MAX_CHARS_PER_MESSAGE = 300_000;
const MAX_TOTAL_CHARS = 600_000;

// Ceiling on completion tokens. Prevents a runaway prompt from generating
// unbounded output (→ unbounded Azure bill). Chat interactions rarely need
// more than ~2K tokens; 4K is a comfortable ceiling.
const MAX_COMPLETION_TOKENS = 4000;

// Rough Azure pricing for cost estimation (gpt-5.3-class deployments,
// USD per 1K tokens). Approximate; the dashboard is for trend-watching,
// not billing accuracy.
const COST_PER_1K_INPUT = 0.0025;
const COST_PER_1K_OUTPUT = 0.01;

function estimateCostUsd(promptTokens, completionTokens) {
  const inCost = (promptTokens / 1000) * COST_PER_1K_INPUT;
  const outCost = (completionTokens / 1000) * COST_PER_1K_OUTPUT;
  return Math.round((inCost + outCost) * 1_000_000) / 1_000_000;
}

// Fire-and-forget usage logger. Failures are swallowed — cost-tracking
// must never break the chat path.
function logUsage({ userId, chatId, projectId, model, promptTokens, completionTokens, status, ms }) {
  try {
    const sbUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    if (!sbUrl || !sbKey) return;
    const sb = createClient(sbUrl, sbKey);
    const total = (promptTokens || 0) + (completionTokens || 0);
    void sb.from('api_usage_log').insert({
      user_id: userId ?? null,
      chat_id: chatId ?? null,
      project_id: projectId ?? null,
      endpoint: 'chat',
      model: model ?? null,
      prompt_tokens: promptTokens ?? null,
      completion_tokens: completionTokens ?? null,
      total_tokens: total || null,
      estimated_cost_usd: total ? estimateCostUsd(promptTokens || 0, completionTokens || 0) : null,
      status: status ?? 'ok',
      ms: ms ?? null,
    });
  } catch {
    /* swallow — logging must never break chat */
  }
}

function validateMessages(messages) {
  if (!Array.isArray(messages)) return 'messages must be an array';
  if (messages.length === 0) return 'messages must not be empty';
  if (messages.length > MAX_MESSAGES) return `too many messages (max ${MAX_MESSAGES})`;
  let total = 0;
  for (const m of messages) {
    if (!m || typeof m !== 'object') return 'each message must be an object';
    if (!['system', 'user', 'assistant'].includes(m.role)) return 'invalid role';
    if (typeof m.content !== 'string') return 'content must be a string';
    if (m.content.length > MAX_CHARS_PER_MESSAGE) return 'message too long';
    total += m.content.length;
  }
  if (total > MAX_TOTAL_CHARS) return 'total message payload too large';
  return null;
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

  const { AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY, AZURE_OPENAI_DEPLOYMENT, AZURE_OPENAI_VERSION, AZURE_OPENAI_MODEL } = process.env;
  if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_KEY || !AZURE_OPENAI_DEPLOYMENT || !AZURE_OPENAI_VERSION) {
    return res.status(500).json({ error: 'Azure OpenAI not configured on server' });
  }

  const body = req.body;
  const validationError = validateMessages(body?.messages);
  if (validationError) return res.status(400).json({ error: validationError });

  const base = AZURE_OPENAI_ENDPOINT.endsWith('/') ? AZURE_OPENAI_ENDPOINT.slice(0, -1) : AZURE_OPENAI_ENDPOINT;
  const azureUrl = `${base}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_OPENAI_VERSION}`;

  let azureResp;
  try {
    azureResp = await fetch(azureUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': AZURE_OPENAI_KEY },
      body: JSON.stringify({
        model: AZURE_OPENAI_DEPLOYMENT || AZURE_OPENAI_MODEL,
        messages: body.messages,
        temperature: typeof body.temperature === 'number' ? body.temperature : 0.7,
        max_completion_tokens: Math.min(
          typeof body.max_tokens === 'number' && body.max_tokens > 0 ? body.max_tokens : MAX_COMPLETION_TOKENS,
          MAX_COMPLETION_TOKENS,
        ),
        stream: true,
        stream_options: { include_usage: true },
      }),
    });
  } catch (e) {
    return res.status(502).json({ error: `Upstream fetch failed: ${e.message}` });
  }

  if (!azureResp.ok) {
    let upstreamMessage = azureResp.statusText;
    try {
      const errJson = await azureResp.json();
      upstreamMessage = errJson?.error?.message ?? upstreamMessage;
    } catch { /* non-json error body */ }
    return res.status(azureResp.status).json({ error: `Azure: ${upstreamMessage}` });
  }

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.status(200);

  const startMs = Date.now();
  const reader = azureResp.body.getReader();
  const decoder = new TextDecoder();
  let usage = null;
  let modelUsed = null;
  let tail = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
      // Parse SSE chunks server-side to capture the final `usage` block
      // emitted when stream_options.include_usage is true. We don't break
      // streaming — we read the same bytes we forwarded.
      const text = decoder.decode(value, { stream: true });
      tail = (tail + text).slice(-8000);
      const lines = (tail.match(/data: [^\n]+/g) || []);
      for (const line of lines) {
        const json = line.slice(6).trim();
        if (json === '[DONE]') continue;
        try {
          const parsed = JSON.parse(json);
          if (parsed?.usage) usage = parsed.usage;
          if (parsed?.model && !modelUsed) modelUsed = parsed.model;
        } catch { /* partial chunk; will be re-tried next loop */ }
      }
    }
    res.end();
    logUsage({
      userId: body.userId,
      chatId: body.chatId,
      projectId: body.projectId,
      model: modelUsed || AZURE_OPENAI_DEPLOYMENT,
      promptTokens: usage?.prompt_tokens,
      completionTokens: usage?.completion_tokens,
      status: 'ok',
      ms: Date.now() - startMs,
    });
  } catch (e) {
    try { res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`); } catch { /* client gone */ }
    res.end();
    logUsage({
      userId: body.userId,
      chatId: body.chatId,
      projectId: body.projectId,
      model: modelUsed || AZURE_OPENAI_DEPLOYMENT,
      promptTokens: usage?.prompt_tokens,
      completionTokens: usage?.completion_tokens,
      status: 'error',
      ms: Date.now() - startMs,
    });
  }
}
