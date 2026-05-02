// Loads mode-specific KBs and the always-on Skills KB at build time via
// Vite's `?raw` import. Authoring source: /kb/modes/*.md and /kb/SKILLS.md.

import GENERAL_KB from '../../kb/modes/GENERAL.md?raw';
import IDEA_GENERATION_KB from '../../kb/modes/IDEA_GENERATION.md?raw';
import IDEA_VALIDATION_KB from '../../kb/modes/IDEA_VALIDATION.md?raw';
import DEEP_RESEARCH_KB from '../../kb/modes/DEEP_RESEARCH.md?raw';
import THINKING_KB from '../../kb/modes/THINKING.md?raw';
import BUSINESS_MODEL_KB from '../../kb/modes/BUSINESS_MODEL.md?raw';
import POSITIONING_KB from '../../kb/modes/POSITIONING.md?raw';
import IMAGE_PROMPTING_KB from '../../kb/modes/IMAGE_PROMPTING.md?raw';
import EXECUTION_KB from '../../kb/modes/EXECUTION.md?raw';
import PRICING_KB from '../../kb/modes/PRICING.md?raw';
import GO_TO_MARKET_KB from '../../kb/modes/GO_TO_MARKET.md?raw';
import FUNDRAISING_KB from '../../kb/modes/FUNDRAISING.md?raw';
import HIRING_AND_EQUITY_KB from '../../kb/modes/HIRING_AND_EQUITY.md?raw';
import CUSTOMER_DISCOVERY_KB from '../../kb/modes/CUSTOMER_DISCOVERY.md?raw';
import LEGAL_AND_OPS_KB from '../../kb/modes/LEGAL_AND_OPS.md?raw';
import PIVOT_OR_PERSEVERE_KB from '../../kb/modes/PIVOT_OR_PERSEVERE.md?raw';
import UI_DESIGN_KB from '../../kb/modes/UI_DESIGN.md?raw';
import PAID_ADS_KB from '../../kb/modes/PAID_ADS.md?raw';
import SEO_AND_CONTENT_KB from '../../kb/modes/SEO_AND_CONTENT.md?raw';
import SKILLS_KB_TEXT from '../../kb/SKILLS.md?raw';

export const SKILLS_KB = SKILLS_KB_TEXT;

export const MODE_KBS: Record<string, string> = {
  GENERAL: GENERAL_KB,
  IDEA_GENERATION: IDEA_GENERATION_KB,
  IDEA_VALIDATION: IDEA_VALIDATION_KB,
  DEEP_RESEARCH: DEEP_RESEARCH_KB,
  THINKING: THINKING_KB,
  BUSINESS_MODEL: BUSINESS_MODEL_KB,
  POSITIONING: POSITIONING_KB,
  PRICING: PRICING_KB,
  GO_TO_MARKET: GO_TO_MARKET_KB,
  CUSTOMER_DISCOVERY: CUSTOMER_DISCOVERY_KB,
  EXECUTION: EXECUTION_KB,
  FUNDRAISING: FUNDRAISING_KB,
  HIRING_AND_EQUITY: HIRING_AND_EQUITY_KB,
  LEGAL_AND_OPS: LEGAL_AND_OPS_KB,
  PIVOT_OR_PERSEVERE: PIVOT_OR_PERSEVERE_KB,
  UI_DESIGN: UI_DESIGN_KB,
  IMAGE_PROMPTING: IMAGE_PROMPTING_KB,
  PAID_ADS: PAID_ADS_KB,
  SEO_AND_CONTENT: SEO_AND_CONTENT_KB,
};

export function getModeKB(activeMode: string): string | null {
  return MODE_KBS[activeMode] ?? null;
}
