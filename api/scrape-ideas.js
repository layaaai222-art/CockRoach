// Vercel serverless function — Idea library scraper.
// Pulls from HN Algolia, ProductHunt RSS, and Reddit r/SomebodyMakeThis.
// Upserts into public.scraped_ideas (unique on source + source_id so
// re-runs are safe).
//
// Two invocation paths:
//   - Daily cron via vercel.json schedule
//   - Manual refresh from the in-app Ideas Library page (POST)
//
// Free APIs only — no keys required.

import { createClient } from '@supabase/supabase-js';

const ALLOWED_ORIGINS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/cock-roach\.vercel\.app$/,
  /^https:\/\/cock-roach(-[a-z0-9-]+)?-aasaanais-projects\.vercel\.app$/,
];

function pickAllowedOrigin(origin) {
  if (!origin) return null;
  return ALLOWED_ORIGINS.some(r => r.test(origin)) ? origin : null;
}

// Naive category bucketer — heuristic on title text. Good enough for
// scan/filter UX; could be replaced with an LLM call later.
function categorize(title) {
  const t = (title || '').toLowerCase();
  if (/\bai\b|llm|gpt|machine learning|claude|gemini|vector/.test(t)) return 'ai';
  if (/saas|tool for|platform for|dashboard|api for/.test(t)) return 'saas';
  if (/dev(eloper)?[ -]tool|cli|sdk|framework|library/.test(t)) return 'devtools';
  if (/marketplace|two.sided|gigs|community for/.test(t)) return 'marketplace';
  if (/health|fitness|wellness|therap|medical|patient|nutri/.test(t)) return 'health';
  if (/finance|fintech|invest|bank|trad|payment|crypto/.test(t)) return 'fintech';
  if (/edu|learn|course|teach|tutor|student/.test(t)) return 'edtech';
  if (/iot|hardware|device|robot|drone|sensor/.test(t)) return 'hardware';
  if (/social|chat|messag|connect|network/.test(t)) return 'social';
  if (/game|play|puzzle|trivia/.test(t)) return 'games';
  return 'other';
}

async function fetchHN() {
  // Stories tagged "show_hn" + filter for new launches. Algolia free tier.
  try {
    const url = 'https://hn.algolia.com/api/v1/search?tags=show_hn&numericFilters=points>30&hitsPerPage=30';
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) return [];
    const j = await r.json();
    return (j.hits || []).map((h) => ({
      source: 'hn',
      source_id: String(h.objectID),
      title: (h.title || '').replace(/^Show HN:\s*/i, ''),
      url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      excerpt: (h.story_text || '').replace(/<[^>]+>/g, '').slice(0, 400) || null,
      category: categorize(h.title),
      score: Number(h.points) || 0,
      comments_count: Number(h.num_comments) || 0,
      posted_at: h.created_at || null,
      raw: { algolia_url: h.url, author: h.author },
    }));
  } catch { return []; }
}

async function fetchProductHunt() {
  // Public RSS — no auth.
  try {
    const r = await fetch('https://www.producthunt.com/feed', {
      headers: { 'User-Agent': 'CockRoach-IdeaScraper/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return [];
    const xml = await r.text();
    const items = [];
    const itemRegex = /<item>([\s\S]+?)<\/item>/g;
    let m;
    while ((m = itemRegex.exec(xml)) !== null) {
      const block = m[1];
      const get = (tag) => {
        const re = new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]+?)(?:\\]\\]>)?<\\/${tag}>`);
        const found = block.match(re);
        return found ? found[1].trim() : null;
      };
      const title = get('title');
      const link = get('link');
      const desc = (get('description') || '').replace(/<[^>]+>/g, '').slice(0, 400);
      const pubDate = get('pubDate');
      const slug = link ? link.split('/').pop() : null;
      if (title && link) {
        items.push({
          source: 'producthunt',
          source_id: slug,
          title,
          url: link,
          excerpt: desc || null,
          category: categorize(title),
          score: 0,
          comments_count: 0,
          posted_at: pubDate ? new Date(pubDate).toISOString() : null,
          raw: { pub_date: pubDate },
        });
      }
    }
    return items.slice(0, 30);
  } catch { return []; }
}

async function fetchReddit() {
  // r/SomebodyMakeThis — small idea-pitches by users. JSON endpoint.
  // Reddit blocks default UA strings; supply our own.
  try {
    const r = await fetch('https://www.reddit.com/r/SomebodyMakeThis/top.json?t=week&limit=30', {
      headers: { 'User-Agent': 'CockRoach-IdeaScraper/1.0 (by /u/cockroach-app)' },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return [];
    const j = await r.json();
    const children = j?.data?.children || [];
    return children.map((c) => {
      const d = c.data || {};
      return {
        source: 'reddit_smt',
        source_id: d.id,
        title: d.title || 'Untitled',
        url: d.url_overridden_by_dest || `https://reddit.com${d.permalink}`,
        excerpt: (d.selftext || '').slice(0, 400) || null,
        category: categorize(d.title),
        score: Number(d.ups) || 0,
        comments_count: Number(d.num_comments) || 0,
        posted_at: d.created_utc ? new Date(d.created_utc * 1000).toISOString() : null,
        raw: { permalink: d.permalink, author: d.author },
      };
    });
  } catch { return []; }
}

async function fetchIndieHackers() {
  // IH RSS feed for latest products.
  try {
    const r = await fetch('https://www.indiehackers.com/feed.xml', {
      headers: { 'User-Agent': 'CockRoach-IdeaScraper/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return [];
    const xml = await r.text();
    const items = [];
    const itemRegex = /<item>([\s\S]+?)<\/item>/g;
    let m;
    while ((m = itemRegex.exec(xml)) !== null && items.length < 20) {
      const block = m[1];
      const title = (block.match(/<title>(?:<!\[CDATA\[)?([\s\S]+?)(?:\]\]>)?<\/title>/) || [])[1]?.trim();
      const link = (block.match(/<link>([\s\S]+?)<\/link>/) || [])[1]?.trim();
      const pubDate = (block.match(/<pubDate>([\s\S]+?)<\/pubDate>/) || [])[1]?.trim();
      const desc = ((block.match(/<description>(?:<!\[CDATA\[)?([\s\S]+?)(?:\]\]>)?<\/description>/) || [])[1] || '').replace(/<[^>]+>/g, '').slice(0, 400);
      if (title && link) {
        items.push({
          source: 'indiehackers',
          source_id: link.split('/').pop() || link,
          title,
          url: link,
          excerpt: desc || null,
          category: categorize(title),
          score: 0,
          comments_count: 0,
          posted_at: pubDate ? new Date(pubDate).toISOString() : null,
          raw: { pub_date: pubDate },
        });
      }
    }
    return items;
  } catch { return []; }
}

export default async function handler(req, res) {
  const origin = pickAllowedOrigin(req.headers.origin);
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const sbUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!sbUrl || !sbKey) return res.status(500).json({ error: 'Supabase not configured' });
  const sb = createClient(sbUrl, sbKey);

  const [hn, ph, rd, ih] = await Promise.all([
    fetchHN(), fetchProductHunt(), fetchReddit(), fetchIndieHackers(),
  ]);
  const all = [...hn, ...ph, ...rd, ...ih].filter(x => x.title && x.source_id);

  if (all.length === 0) {
    return res.status(200).json({ inserted: 0, sources: { hn: 0, ph: 0, rd: 0, ih: 0 }, message: 'No items fetched (sources may be down)' });
  }

  // Upsert in batches to keep payload size reasonable.
  let upserted = 0;
  for (let i = 0; i < all.length; i += 50) {
    const batch = all.slice(i, i + 50);
    const { error } = await sb.from('scraped_ideas').upsert(batch, { onConflict: 'source,source_id' });
    if (!error) upserted += batch.length;
  }

  return res.status(200).json({
    inserted: upserted,
    sources: { hn: hn.length, ph: ph.length, rd: rd.length, ih: ih.length },
  });
}
