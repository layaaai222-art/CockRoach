// Browsable library of scraped startup ideas. Pulled from HN,
// ProductHunt, Reddit, and IndieHackers. Refreshes daily by cron;
// manual refresh button fires the scraper on demand.

import React from 'react';
import { ExternalLink, RefreshCw, Search, MessageCircle, ArrowUp, Library, ArrowRight, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { useScrapedIdeas, type ScrapedIdea } from '../hooks/useScrapedIdeas';
import { cn } from '../lib/utils';
import IdeaCharts from './IdeaCharts';

const SOURCE_LABEL: Record<string, string> = {
  hn: 'Hacker News · Show HN',
  producthunt: 'Product Hunt',
  reddit_smt: 'r/SomebodyMakeThis',
  indiehackers: 'Indie Hackers',
};

const SOURCE_ACCENT: Record<string, string> = {
  hn: 'text-orange-300 border-orange-500/30 bg-orange-500/10',
  producthunt: 'text-rose-300 border-rose-500/30 bg-rose-500/10',
  reddit_smt: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
  indiehackers: 'text-violet-300 border-violet-500/30 bg-violet-500/10',
};

const CATEGORY_OPTIONS = ['ai', 'saas', 'devtools', 'marketplace', 'health', 'fintech', 'edtech', 'hardware', 'social', 'games', 'other'];

interface Props {
  onValidateIdea?: (idea: ScrapedIdea) => void;
}

function timeAgo(iso: string | null): string {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function IdeasLibrary({ onValidateIdea }: Props) {
  const [source, setSource] = React.useState<string | null>(null);
  const [category, setCategory] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');
  const [showCharts, setShowCharts] = React.useState(false);
  const { ideas, loading, refreshing, scrapeNow } = useScrapedIdeas({ source, category, query, limit: 80 });

  const sourceCounts = React.useMemo(() => {
    const m: Record<string, number> = {};
    ideas.forEach(i => { m[i.source] = (m[i.source] || 0) + 1; });
    return m;
  }, [ideas]);

  return (
    <div className="max-w-6xl mx-auto p-6 sm:p-8 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Library size={16} className="text-primary" />
            <h1 className="text-xl font-bold text-foreground">Ideas Library</h1>
          </div>
          <p className="text-[12px] text-muted-foreground max-w-xl">
            Live feed scraped daily from Hacker News (Show HN), Product Hunt, r/SomebodyMakeThis, and Indie Hackers. Browse, filter, and "Validate this" on anything that catches your eye.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCharts(v => !v)}
            className={cn('flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest border rounded-md transition-all', showCharts ? 'text-primary border-primary/40 bg-primary/10' : 'text-muted-foreground border-border hover:text-foreground')}
          >
            <BarChart3 size={11} /> Charts
          </button>
          <button
            onClick={scrapeNow}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary border border-primary/40 hover:bg-primary/10 disabled:opacity-50 transition-all rounded-md"
          >
            <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Scraping…' : 'Refresh now'}
          </button>
        </div>
      </div>

      {showCharts && <IdeaCharts ideas={ideas} />}

      <div className="space-y-3">
        {/* Search + filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ideas…"
              className="w-full pl-8 pr-3 py-2 bg-card border border-border rounded-md text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSource(null)}
            className={cn('px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border rounded transition-colors', source === null ? 'bg-primary/10 border-primary/40 text-primary' : 'border-border text-muted-foreground hover:text-foreground')}
          >
            All sources ({Object.values(sourceCounts).reduce((a, b) => a + b, 0)})
          </button>
          {Object.entries(SOURCE_LABEL).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setSource(s => s === k ? null : k)}
              className={cn('px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border rounded transition-colors', source === k ? SOURCE_ACCENT[k] : 'border-border text-muted-foreground hover:text-foreground')}
            >
              {v} {sourceCounts[k] ? `(${sourceCounts[k]})` : ''}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setCategory(null)}
            className={cn('px-2 py-0.5 text-[10px] uppercase tracking-widest rounded border transition-colors', category === null ? 'bg-primary/10 border-primary/40 text-primary font-bold' : 'border-border/60 text-muted-foreground/70 hover:text-foreground')}
          >
            All
          </button>
          {CATEGORY_OPTIONS.map(c => (
            <button
              key={c}
              onClick={() => setCategory(s => s === c ? null : c)}
              className={cn('px-2 py-0.5 text-[10px] uppercase tracking-widest rounded border transition-colors', category === c ? 'bg-primary/10 border-primary/40 text-primary font-bold' : 'border-border/60 text-muted-foreground/70 hover:text-foreground')}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading && ideas.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[0, 1, 2, 3].map(i => <div key={i} className="h-28 rounded-xl bg-surface-mid/40 animate-pulse" />)}
        </div>
      ) : ideas.length === 0 ? (
        <div className="layaa-card bg-card/30 border-border p-10 text-center space-y-3">
          <Library size={28} className="text-muted-foreground/40 mx-auto" />
          <p className="text-[13px] text-foreground font-medium">Nothing in the library yet</p>
          <p className="text-[11px] text-muted-foreground max-w-md mx-auto">
            Click "Refresh now" to fetch the latest from all sources. The daily cron also runs at 06:00 UTC.
          </p>
          <button
            onClick={scrapeNow}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary border border-primary/40 hover:bg-primary/10 disabled:opacity-50 transition-all rounded-md"
          >
            <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} />
            Fetch now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ideas.map((idea, i) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.01 }}
              className="layaa-card bg-card/40 border-border p-4 space-y-2 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[14px] font-bold text-foreground line-clamp-2 leading-tight">{idea.title}</h3>
                {idea.url && (
                  <a href={idea.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground/50 hover:text-foreground shrink-0 mt-0.5">
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
              {idea.excerpt && (
                <p className="text-[11px] text-muted-foreground/80 line-clamp-2 leading-relaxed">{idea.excerpt}</p>
              )}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={cn('text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 border rounded', SOURCE_ACCENT[idea.source] ?? 'border-border text-muted-foreground')}>
                    {SOURCE_LABEL[idea.source]?.split(' · ')[0] ?? idea.source}
                  </span>
                  {idea.category && (
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60 border border-border/60 rounded px-1.5 py-0.5">{idea.category}</span>
                  )}
                  {idea.score > 0 && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><ArrowUp size={9} /> {idea.score}</span>
                  )}
                  {idea.comments_count > 0 && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><MessageCircle size={9} /> {idea.comments_count}</span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground/50 shrink-0">{timeAgo(idea.posted_at)}</span>
              </div>
              {onValidateIdea && (
                <button
                  onClick={() => onValidateIdea(idea)}
                  className="w-full mt-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/30 hover:bg-primary/10 transition-all rounded opacity-0 group-hover:opacity-100"
                >
                  Validate this idea <ArrowRight size={10} />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
