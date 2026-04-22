// Foundation KBs and the base system prompt. Content lives in the root
// `.md` files — Vite's `?raw` loader imports them as strings at build time.
// Edit the .md files directly; this module just re-exports them.

import COCKROACH_DEFAULT_SYSTEM_PROMPT_RAW from '../../kb/base-prompt.md?raw';
import KB_01_RAW from '../../kb/foundation/KB_01_IDENTITY_AND_PERSONALITY.md?raw';
import KB_02_RAW from '../../kb/foundation/KB_02_IDEA_ANALYSIS_FRAMEWORK.md?raw';
import KB_03_RAW from '../../kb/foundation/KB_03_USA_FUNDING_AND_GRANTS.md?raw';
import KB_04_RAW from '../../kb/foundation/KB_04_OUTPUT_FORMATS_AND_STRUCTURE.md?raw';

export const COCKROACH_DEFAULT_SYSTEM_PROMPT = COCKROACH_DEFAULT_SYSTEM_PROMPT_RAW;
export const KB_01 = KB_01_RAW;
export const KB_02 = KB_02_RAW;
export const KB_03 = KB_03_RAW;
export const KB_04 = KB_04_RAW;
