// Lightweight SVG charts for the Ideas Library — bundled trend
// (ideas-by-source-by-week) and a category breakdown bar chart.
// Implemented as plain SVG to avoid pulling in a charting lib.

import React from 'react';
import { TrendingUp, PieChart } from 'lucide-react';
import type { ScrapedIdea } from '../hooks/useScrapedIdeas';
import { cn } from '../lib/utils';

const SOURCE_COLOR: Record<string, string> = {
  hn: '#fb923c',
  producthunt: '#fb7185',
  reddit_smt: '#fbbf24',
  indiehackers: '#a78bfa',
};

const CATEGORY_COLOR: Record<string, string> = {
  ai: '#cc2222', saas: '#8B1414', devtools: '#10b981', marketplace: '#0ea5e9',
  health: '#ec4899', fintech: '#22c55e', edtech: '#a855f7', hardware: '#f59e0b',
  social: '#3b82f6', games: '#f97316', other: '#6b7280',
};

interface Props {
  ideas: ScrapedIdea[];
}

function bucketByWeek(ideas: ScrapedIdea[]): { week: string; counts: Record<string, number> }[] {
  const m: Record<string, Record<string, number>> = {};
  ideas.forEach(i => {
    const ts = i.posted_at || i.fetched_at;
    if (!ts) return;
    const d = new Date(ts);
    // Monday-anchored ISO week start
    const day = d.getUTCDay() || 7;
    const monday = new Date(d);
    monday.setUTCDate(d.getUTCDate() - (day - 1));
    const wk = monday.toISOString().slice(0, 10);
    if (!m[wk]) m[wk] = {};
    m[wk][i.source] = (m[wk][i.source] || 0) + 1;
  });
  return Object.keys(m).sort().slice(-8).map(week => ({ week, counts: m[week] }));
}

function bucketByCategory(ideas: ScrapedIdea[]): { category: string; count: number }[] {
  const m: Record<string, number> = {};
  ideas.forEach(i => {
    const c = i.category || 'other';
    m[c] = (m[c] || 0) + 1;
  });
  return Object.entries(m).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count);
}

function StackedBarChart({ data }: { data: { week: string; counts: Record<string, number> }[] }) {
  if (data.length === 0) {
    return <p className="text-[11px] text-muted-foreground/60 italic text-center py-8">Not enough data yet — refresh the library to populate.</p>;
  }

  const max = Math.max(1, ...data.map(d => Object.values(d.counts).reduce((a, b) => a + b, 0)));
  const W = 600;
  const H = 200;
  const padding = { top: 16, right: 16, bottom: 28, left: 36 };
  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;
  const barW = chartW / data.length * 0.8;
  const barGap = chartW / data.length * 0.2;

  const sources = ['hn', 'producthunt', 'reddit_smt', 'indiehackers'];

  return (
    <div className="w-full overflow-x-auto layaa-scroll">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[500px]" preserveAspectRatio="xMidYMid meet">
        {/* Y-axis ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const v = Math.round(max * t);
          const y = padding.top + chartH - chartH * t;
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={W - padding.right} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={padding.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.4)">{v}</text>
            </g>
          );
        })}
        {/* Bars */}
        {data.map((d, di) => {
          const x = padding.left + di * (barW + barGap) + barGap / 2;
          let yBase = padding.top + chartH;
          return (
            <g key={d.week}>
              {sources.map(s => {
                const c = d.counts[s] || 0;
                if (c === 0) return null;
                const h = (chartH * c) / max;
                yBase -= h;
                return <rect key={s} x={x} y={yBase} width={barW} height={h} fill={SOURCE_COLOR[s]} opacity={0.85} />;
              })}
              <text x={x + barW / 2} y={H - 8} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)">
                {new Date(d.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function CategoryBarChart({ data }: { data: { category: string; count: number }[] }) {
  if (data.length === 0) {
    return <p className="text-[11px] text-muted-foreground/60 italic text-center py-8">No ideas yet.</p>;
  }
  const max = Math.max(1, ...data.map(d => d.count));
  return (
    <div className="space-y-1.5">
      {data.map(d => (
        <div key={d.category} className="grid grid-cols-[80px_1fr_36px] items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground text-right">{d.category}</span>
          <div className="h-4 bg-surface-mid/40 rounded-sm overflow-hidden">
            <div
              className="h-full transition-all"
              style={{ width: `${(d.count / max) * 100}%`, background: CATEGORY_COLOR[d.category] || '#6b7280' }}
            />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

export default function IdeaCharts({ ideas }: Props) {
  const weekly = React.useMemo(() => bucketByWeek(ideas), [ideas]);
  const byCategory = React.useMemo(() => bucketByCategory(ideas), [ideas]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="layaa-card bg-card/40 border-border p-4 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={12} className="text-primary" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-foreground">Volume by source · last 8 weeks</p>
        </div>
        <StackedBarChart data={weekly} />
        <div className="flex items-center gap-3 flex-wrap text-[10px] text-muted-foreground">
          {Object.entries(SOURCE_COLOR).map(([k, c]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm" style={{ background: c }} />
              {k.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>
      <div className="layaa-card bg-card/40 border-border p-4 space-y-3">
        <div className="flex items-center gap-2">
          <PieChart size={12} className="text-primary" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-foreground">Category breakdown</p>
        </div>
        <CategoryBarChart data={byCategory} />
        <p className={cn('text-[10px] text-muted-foreground/60 italic')}>
          Categories are heuristic; refine via the LLM-categorize endpoint later for sharper buckets.
        </p>
      </div>
    </div>
  );
}
