// Reads from public.scraped_ideas with source / category / search
// filters. Manual refresh fires /api/scrape-ideas; daily cron does
// the same automatically.

import React from 'react';
import { supabase } from '../lib/supabase';

export interface ScrapedIdea {
  id: string;
  source: string;
  source_id: string | null;
  title: string;
  url: string | null;
  excerpt: string | null;
  category: string | null;
  score: number;
  comments_count: number;
  posted_at: string | null;
  fetched_at: string;
}

export interface UseScrapedIdeasArgs {
  source?: string | null;
  category?: string | null;
  query?: string;
  limit?: number;
}

export function useScrapedIdeas({ source = null, category = null, query = '', limit = 60 }: UseScrapedIdeasArgs) {
  const [ideas, setIdeas] = React.useState<ScrapedIdea[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    let q = supabase.from('scraped_ideas').select('*').order('posted_at', { ascending: false, nullsFirst: false }).limit(limit);
    if (source) q = q.eq('source', source);
    if (category) q = q.eq('category', category);
    if (query.trim().length >= 2) q = q.ilike('title', `%${query.trim()}%`);
    const { data } = await q;
    setIdeas((data ?? []) as ScrapedIdea[]);
    setLoading(false);
  }, [source, category, query, limit]);

  React.useEffect(() => { void refresh(); }, [refresh]);

  // Force a fresh server-side scrape, then refetch.
  const scrapeNow = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const r = await fetch('/api/scrape-ideas', { method: 'POST' });
      const j = await r.json();
      await refresh();
      return j;
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  return { ideas, loading, refreshing, refresh, scrapeNow };
}
