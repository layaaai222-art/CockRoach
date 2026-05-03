// Lazy mode-KB loader. Each mode KB is a separate dynamic import so
// Vite code-splits them into per-mode chunks. The main bundle no
// longer ships ~50 KB of dead-weight markdown that the user may never
// hit. Only the always-on SKILLS KB is statically imported.
//
// Authoring source: /kb/modes/*.md and /kb/SKILLS.md.

import SKILLS_KB_TEXT from '../../kb/SKILLS.md?raw';

export const SKILLS_KB = SKILLS_KB_TEXT;

// Each loader returns a promise resolving to the markdown string.
// Vite emits a separate chunk per dynamic import target, fetched on
// first use. Module-scope memoization (below) means the chunk is
// downloaded once per session.
const MODE_LOADERS: Record<string, () => Promise<{ default: string }>> = {
  GENERAL:             () => import('../../kb/modes/GENERAL.md?raw'),
  IDEA_GENERATION:     () => import('../../kb/modes/IDEA_GENERATION.md?raw'),
  IDEA_VALIDATION:     () => import('../../kb/modes/IDEA_VALIDATION.md?raw'),
  DEEP_RESEARCH:       () => import('../../kb/modes/DEEP_RESEARCH.md?raw'),
  THINKING:            () => import('../../kb/modes/THINKING.md?raw'),
  BUSINESS_MODEL:      () => import('../../kb/modes/BUSINESS_MODEL.md?raw'),
  POSITIONING:         () => import('../../kb/modes/POSITIONING.md?raw'),
  PRICING:             () => import('../../kb/modes/PRICING.md?raw'),
  GO_TO_MARKET:        () => import('../../kb/modes/GO_TO_MARKET.md?raw'),
  CUSTOMER_DISCOVERY:  () => import('../../kb/modes/CUSTOMER_DISCOVERY.md?raw'),
  EXECUTION:           () => import('../../kb/modes/EXECUTION.md?raw'),
  FUNDRAISING:         () => import('../../kb/modes/FUNDRAISING.md?raw'),
  HIRING_AND_EQUITY:   () => import('../../kb/modes/HIRING_AND_EQUITY.md?raw'),
  LEGAL_AND_OPS:       () => import('../../kb/modes/LEGAL_AND_OPS.md?raw'),
  PIVOT_OR_PERSEVERE:  () => import('../../kb/modes/PIVOT_OR_PERSEVERE.md?raw'),
  UI_DESIGN:           () => import('../../kb/modes/UI_DESIGN.md?raw'),
  IMAGE_PROMPTING:     () => import('../../kb/modes/IMAGE_PROMPTING.md?raw'),
  PAID_ADS:            () => import('../../kb/modes/PAID_ADS.md?raw'),
  SEO_AND_CONTENT:     () => import('../../kb/modes/SEO_AND_CONTENT.md?raw'),
  GENERATE_IMAGE:      () => import('../../kb/modes/GENERATE_IMAGE.md?raw'),
  VIBE_CODING:         () => import('../../kb/modes/VIBE_CODING.md?raw'),
};

const cache = new Map<string, string>();

/**
 * Fetch a mode KB by id. Resolves to null for unknown modes (incl. AUTO).
 * Cached after first resolution so subsequent calls are synchronous-fast.
 */
export async function loadModeKB(modeId: string): Promise<string | null> {
  if (cache.has(modeId)) return cache.get(modeId) ?? null;
  const loader = MODE_LOADERS[modeId];
  if (!loader) return null;
  try {
    const mod = await loader();
    cache.set(modeId, mod.default);
    return mod.default;
  } catch {
    return null;
  }
}

/** Sync read — only returns content if already cached. Use loadModeKB for first access. */
export function getCachedModeKB(modeId: string): string | null {
  return cache.get(modeId) ?? null;
}

/** Preload a mode KB without awaiting. Fire-and-forget, useful on selection. */
export function preloadModeKB(modeId: string): void {
  void loadModeKB(modeId);
}

export const MODE_IDS = Object.keys(MODE_LOADERS);
