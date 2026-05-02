// Loads framework KBs at build time via Vite's `?raw` import.
// Authoring source: /kb/frameworks/*.md.
//
// Frameworks are different from modes: a mode is a *working stance*
// (e.g., FUNDRAISING). A framework is a *structured technique* the
// agent can run on a project's idea regardless of mode (e.g., run
// the Value Equation on the offer; run the ACP diagnostic on growth).
//
// Frameworks are injected on-demand via the "Run framework" quick
// action on the project page, scoped to a single chat turn.

import VALUE_EQUATION_KB from '../../kb/frameworks/VALUE_EQUATION.md?raw';
import LEAN_CANVAS_KB from '../../kb/frameworks/LEAN_CANVAS.md?raw';
import JOBS_TO_BE_DONE_KB from '../../kb/frameworks/JOBS_TO_BE_DONE.md?raw';
import NORTH_STAR_METRIC_KB from '../../kb/frameworks/NORTH_STAR_METRIC.md?raw';
import VALUE_LADDER_KB from '../../kb/frameworks/VALUE_LADDER.md?raw';
import VALUE_MATRIX_KB from '../../kb/frameworks/VALUE_MATRIX.md?raw';
import ACP_KB from '../../kb/frameworks/ACP.md?raw';
import DREAM_100_KB from '../../kb/frameworks/DREAM_100.md?raw';
import COMPETITIVE_TEARDOWN_KB from '../../kb/frameworks/COMPETITIVE_TEARDOWN.md?raw';

export type FrameworkId =
  | 'VALUE_EQUATION'
  | 'LEAN_CANVAS'
  | 'JOBS_TO_BE_DONE'
  | 'NORTH_STAR_METRIC'
  | 'VALUE_LADDER'
  | 'VALUE_MATRIX'
  | 'ACP'
  | 'DREAM_100'
  | 'COMPETITIVE_TEARDOWN';

export const FRAMEWORK_KBS: Record<FrameworkId, string> = {
  VALUE_EQUATION: VALUE_EQUATION_KB,
  LEAN_CANVAS: LEAN_CANVAS_KB,
  JOBS_TO_BE_DONE: JOBS_TO_BE_DONE_KB,
  NORTH_STAR_METRIC: NORTH_STAR_METRIC_KB,
  VALUE_LADDER: VALUE_LADDER_KB,
  VALUE_MATRIX: VALUE_MATRIX_KB,
  ACP: ACP_KB,
  DREAM_100: DREAM_100_KB,
  COMPETITIVE_TEARDOWN: COMPETITIVE_TEARDOWN_KB,
};

export interface FrameworkMeta {
  id: FrameworkId;
  name: string;
  origin: string;
  oneLine: string;
  bestFor: string[];
}

export const FRAMEWORK_CATALOG: FrameworkMeta[] = [
  {
    id: 'VALUE_EQUATION',
    name: 'Value Equation',
    origin: 'Hormozi',
    oneLine: '(Dream × Likelihood) ÷ (Time × Effort) — engineer offers that convert.',
    bestFor: ['offer-design', 'pricing', 'conversion-stuck'],
  },
  {
    id: 'LEAN_CANVAS',
    name: 'Lean Canvas',
    origin: 'Maurya',
    oneLine: '9-block hypothesis canvas — surface assumptions before building.',
    bestFor: ['pre-pmf', 'quarterly-check', 'pivot-prep'],
  },
  {
    id: 'JOBS_TO_BE_DONE',
    name: 'Jobs To Be Done',
    origin: 'Christensen / Ulwick',
    oneLine: 'People hire products to make progress on a job — find the job.',
    bestFor: ['repositioning', 'segmentation', 'feature-prioritization'],
  },
  {
    id: 'NORTH_STAR_METRIC',
    name: 'North Star Metric',
    origin: 'Sean Ellis',
    oneLine: 'The single metric that captures customer value × volume × frequency.',
    bestFor: ['post-pmf', 'team-alignment', 'quarterly-planning'],
  },
  {
    id: 'VALUE_LADDER',
    name: 'Value Ladder',
    origin: 'Brunson',
    oneLine: 'Free → tripwire → core → high-ticket; each rung qualifies the next.',
    bestFor: ['multi-tier-offers', 'low-ltv-fix', 'info-product'],
  },
  {
    id: 'VALUE_MATRIX',
    name: 'Value Matrix',
    origin: 'Blank / Strategyzer',
    oneLine: 'Pain/gain × segment × feature grid — find the tightest fit.',
    bestFor: ['multi-segment', 'feature-cuts', 'beachhead-pick'],
  },
  {
    id: 'ACP',
    name: 'ACP Diagnostic',
    origin: 'Isenberg',
    oneLine: 'Acquisition × Churn × Pricing — diagnose the binding constraint.',
    bestFor: ['growth-stalled', 'quarterly-review', 'investor-prep'],
  },
  {
    id: 'DREAM_100',
    name: 'Dream 100',
    origin: 'Holmes / Brunson',
    oneLine: '100 places/people/accounts that already have your customers.',
    bestFor: ['b2b-abm', 'creator-distribution', 'beachhead-launch'],
  },
  {
    id: 'COMPETITIVE_TEARDOWN',
    name: 'Competitive Teardown',
    origin: 'Dunford',
    oneLine: '5-layer teardown of 3-5 competitors → empty space → wedge.',
    bestFor: ['positioning', 'pre-launch', 'post-pivot'],
  },
];

export function getFrameworkKB(id: FrameworkId): string | null {
  return FRAMEWORK_KBS[id] ?? null;
}

export function getFrameworkMeta(id: FrameworkId): FrameworkMeta | null {
  return FRAMEWORK_CATALOG.find((f) => f.id === id) ?? null;
}
