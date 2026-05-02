// Lazy framework-KB loader. Each framework KB is a separate dynamic
// import so Vite code-splits them into per-framework chunks. The
// metadata catalog stays statically loaded so the UI can render the
// "Run framework" dropdown without any network round-trip.
//
// Authoring source: /kb/frameworks/*.md.

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

const FRAMEWORK_LOADERS: Record<FrameworkId, () => Promise<{ default: string }>> = {
  VALUE_EQUATION:       () => import('../../kb/frameworks/VALUE_EQUATION.md?raw'),
  LEAN_CANVAS:          () => import('../../kb/frameworks/LEAN_CANVAS.md?raw'),
  JOBS_TO_BE_DONE:      () => import('../../kb/frameworks/JOBS_TO_BE_DONE.md?raw'),
  NORTH_STAR_METRIC:    () => import('../../kb/frameworks/NORTH_STAR_METRIC.md?raw'),
  VALUE_LADDER:         () => import('../../kb/frameworks/VALUE_LADDER.md?raw'),
  VALUE_MATRIX:         () => import('../../kb/frameworks/VALUE_MATRIX.md?raw'),
  ACP:                  () => import('../../kb/frameworks/ACP.md?raw'),
  DREAM_100:            () => import('../../kb/frameworks/DREAM_100.md?raw'),
  COMPETITIVE_TEARDOWN: () => import('../../kb/frameworks/COMPETITIVE_TEARDOWN.md?raw'),
};

const cache = new Map<FrameworkId, string>();

export interface FrameworkMeta {
  id: FrameworkId;
  name: string;
  origin: string;
  oneLine: string;
  bestFor: string[];
}

export const FRAMEWORK_CATALOG: FrameworkMeta[] = [
  { id: 'VALUE_EQUATION', name: 'Value Equation', origin: 'Hormozi',
    oneLine: '(Dream × Likelihood) ÷ (Time × Effort) — engineer offers that convert.',
    bestFor: ['offer-design', 'pricing', 'conversion-stuck'] },
  { id: 'LEAN_CANVAS', name: 'Lean Canvas', origin: 'Maurya',
    oneLine: '9-block hypothesis canvas — surface assumptions before building.',
    bestFor: ['pre-pmf', 'quarterly-check', 'pivot-prep'] },
  { id: 'JOBS_TO_BE_DONE', name: 'Jobs To Be Done', origin: 'Christensen / Ulwick',
    oneLine: 'People hire products to make progress on a job — find the job.',
    bestFor: ['repositioning', 'segmentation', 'feature-prioritization'] },
  { id: 'NORTH_STAR_METRIC', name: 'North Star Metric', origin: 'Sean Ellis',
    oneLine: 'The single metric that captures customer value × volume × frequency.',
    bestFor: ['post-pmf', 'team-alignment', 'quarterly-planning'] },
  { id: 'VALUE_LADDER', name: 'Value Ladder', origin: 'Brunson',
    oneLine: 'Free → tripwire → core → high-ticket; each rung qualifies the next.',
    bestFor: ['multi-tier-offers', 'low-ltv-fix', 'info-product'] },
  { id: 'VALUE_MATRIX', name: 'Value Matrix', origin: 'Blank / Strategyzer',
    oneLine: 'Pain/gain × segment × feature grid — find the tightest fit.',
    bestFor: ['multi-segment', 'feature-cuts', 'beachhead-pick'] },
  { id: 'ACP', name: 'ACP Diagnostic', origin: 'Isenberg',
    oneLine: 'Acquisition × Churn × Pricing — diagnose the binding constraint.',
    bestFor: ['growth-stalled', 'quarterly-review', 'investor-prep'] },
  { id: 'DREAM_100', name: 'Dream 100', origin: 'Holmes / Brunson',
    oneLine: '100 places/people/accounts that already have your customers.',
    bestFor: ['b2b-abm', 'creator-distribution', 'beachhead-launch'] },
  { id: 'COMPETITIVE_TEARDOWN', name: 'Competitive Teardown', origin: 'Dunford',
    oneLine: '5-layer teardown of 3-5 competitors → empty space → wedge.',
    bestFor: ['positioning', 'pre-launch', 'post-pivot'] },
];

export async function loadFrameworkKB(id: FrameworkId): Promise<string | null> {
  if (cache.has(id)) return cache.get(id) ?? null;
  const loader = FRAMEWORK_LOADERS[id];
  if (!loader) return null;
  try {
    const mod = await loader();
    cache.set(id, mod.default);
    return mod.default;
  } catch {
    return null;
  }
}

export function getCachedFrameworkKB(id: FrameworkId): string | null {
  return cache.get(id) ?? null;
}

export function getFrameworkMeta(id: FrameworkId): FrameworkMeta | null {
  return FRAMEWORK_CATALOG.find((f) => f.id === id) ?? null;
}

export function preloadFrameworkKB(id: FrameworkId): void {
  void loadFrameworkKB(id);
}
