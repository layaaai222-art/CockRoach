// Vercel serverless function — Project pulse generator.
// Given a project_id, fetches the last 7 days of chats + decisions
// for that project and asks Azure to synthesize a weekly pulse log
// entry. Inserts into project_pulse_log and returns the new row.

import { createClient } from '@supabase/supabase-js';

const ALLOWED_ORIGINS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/cock-roach\.vercel\.app$/,
  /^https:\/\/cock-roach(-[a-z0-9-]+)?-aasaanais-projects\.vercel\.app$/,
  /^https:\/\/cock-roach-git-[a-z0-9-]+-aasaanais-projects\.vercel\.app$/,
];

const RATE_LIMIT = { windowMs: 60_000, max: 6 }; // pulse is heavier — tighter limit
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
  return false;
}

function weekStartIso() {
  // ISO week-start (Monday). Stored as DATE in DB; compose YYYY-MM-DD.
  const now = new Date();
  const day = now.getUTCDay() || 7;
  const monday = new Date(now);
  if (day !== 1) monday.setUTCDate(now.getUTCDate() - (day - 1));
  return monday.toISOString().slice(0, 10);
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
    return res.status(429).json({ error: 'Too many requests' });
  }

  const { projectId } = req.body || {};
  if (!projectId || typeof projectId !== 'string') {
    return res.status(400).json({ error: 'projectId required' });
  }

  const {
    AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_KEY, AZURE_OPENAI_DEPLOYMENT, AZURE_OPENAI_VERSION,
    SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
    VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_ANON_KEY,
  } = process.env;

  if (!AZURE_OPENAI_ENDPOINT || !AZURE_OPENAI_KEY || !AZURE_OPENAI_DEPLOYMENT || !AZURE_OPENAI_VERSION) {
    return res.status(500).json({ error: 'Azure not configured on server' });
  }

  const sbUrl = SUPABASE_URL || VITE_SUPABASE_URL;
  const sbKey = SUPABASE_SERVICE_ROLE_KEY || VITE_SUPABASE_PUBLISHABLE_KEY || VITE_SUPABASE_ANON_KEY;
  if (!sbUrl || !sbKey) {
    return res.status(500).json({ error: 'Supabase not configured on server' });
  }
  const sb = createClient(sbUrl, sbKey);

  // Fetch project + last 7 days of decisions + chats
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [projectRes, decisionsRes, chatsRes] = await Promise.all([
    sb.from('projects').select('id, name, description, stage').eq('id', projectId).single(),
    sb.from('decisions').select('category, question, decision, reversibility, decided_at').eq('project_id', projectId).gte('decided_at', sevenDaysAgo).order('decided_at', { ascending: true }),
    sb.from('chats').select('id, title, updated_at').eq('project_id', projectId).gte('updated_at', sevenDaysAgo).order('updated_at', { ascending: true }).limit(20),
  ]);

  if (projectRes.error || !projectRes.data) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const project = projectRes.data;
  const decisions = decisionsRes.data ?? [];
  const chats = chatsRes.data ?? [];

  if (decisions.length === 0 && chats.length === 0) {
    return res.status(200).json({ pulse: null, message: 'No activity in the last 7 days yet — nothing to pulse on.' });
  }

  const decisionsBlock = decisions.length
    ? decisions.map(d => `- [${d.category} · ${d.reversibility}] ${d.question} → ${d.decision}`).join('\n')
    : '(no decisions logged)';
  const chatsBlock = chats.length
    ? chats.map(c => `- "${c.title}" (${new Date(c.updated_at).toLocaleDateString()})`).join('\n')
    : '(no chats this week)';

  const userPrompt = `Project: ${project.name}
Stage: ${project.stage}
Description: ${project.description ?? '(none)'}

Decisions logged this week:
${decisionsBlock}

Chats touched this week:
${chatsBlock}

Write a 1-page weekly pulse:
- "What happened" (3-5 bullets)
- "What we learned" (1-3 bullets — non-obvious takeaways)
- "What to watch next week" (1-3 bullets — risks, deadlines, decisions due)
- "Recommended next move" (one sharp recommendation)

Markdown. No preamble. Be concise and decision-grade.`;

  const base = AZURE_OPENAI_ENDPOINT.endsWith('/') ? AZURE_OPENAI_ENDPOINT.slice(0, -1) : AZURE_OPENAI_ENDPOINT;
  const azureUrl = `${base}/openai/deployments/${AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version=${AZURE_OPENAI_VERSION}`;

  let summary;
  try {
    const azureResp = await fetch(azureUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': AZURE_OPENAI_KEY },
      body: JSON.stringify({
        model: AZURE_OPENAI_DEPLOYMENT,
        messages: [
          { role: 'system', content: 'You are CockRoach, an entrepreneurial co-pilot. Generate concise weekly project pulse summaries.' },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
        max_completion_tokens: 800,
        stream: false,
      }),
    });
    if (!azureResp.ok) {
      const txt = await azureResp.text().catch(() => '');
      return res.status(azureResp.status).json({ error: `Azure: ${txt.slice(0, 200)}` });
    }
    const data = await azureResp.json();
    summary = data?.choices?.[0]?.message?.content ?? '';
  } catch (e) {
    return res.status(502).json({ error: `Pulse generation failed: ${e.message}` });
  }

  if (!summary) {
    return res.status(502).json({ error: 'Empty pulse from Azure' });
  }

  const week = weekStartIso();
  const { data: insertData, error: insertErr } = await sb
    .from('project_pulse_log')
    .upsert({
      project_id: projectId,
      week_starting: week,
      summary_md: summary,
      metrics: { decisions_count: decisions.length, chats_count: chats.length },
    }, { onConflict: 'project_id,week_starting' })
    .select()
    .single();

  if (insertErr) {
    return res.status(500).json({ error: `Could not save pulse: ${insertErr.message}` });
  }

  // Mark project.last_pulse_at
  await sb.from('projects').update({ last_pulse_at: new Date().toISOString() }).eq('id', projectId);

  return res.status(200).json({ pulse: insertData });
}
