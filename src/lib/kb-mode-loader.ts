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
  IMAGE_PROMPTING: IMAGE_PROMPTING_KB,
  EXECUTION: EXECUTION_KB,
};

export function getModeKB(activeMode: string): string | null {
  return MODE_KBS[activeMode] ?? null;
}
