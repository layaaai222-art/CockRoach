// CockRoach domain types. Mirrors the Supabase schema in
// supabase/schema.sql. Re-export from here, not from store.ts, so the
// store stays focused on session/UI state.

// ─────────────────────────────────────────────────────────────────────────────
// Project spine
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectStage =
  | 'idea'
  | 'validated'
  | 'building'
  | 'launched'
  | 'scaling'
  | 'paused'
  | 'archived';

export type DecisionCategory =
  | 'pricing'
  | 'gtm'
  | 'hiring'
  | 'fundraise'
  | 'pivot'
  | 'legal'
  | 'product'
  | 'ops'
  | 'positioning'
  | 'validation'
  | 'other';

export type Reversibility = 'reversible' | 'expensive' | 'one_way';
export type Confidence = 'low' | 'medium' | 'high';

export type ArtifactKind =
  | 'pitch_deck'
  | 'financial_model'
  | 'positioning_doc'
  | 'business_plan'
  | 'gtm_plan'
  | 'investor_update'
  | 'legal_doc'
  | 'survey_results'
  | 'idea_validation'
  | 'memo'
  | 'one_pager'
  | 'other';

export type ExportedFormat = 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'csv' | 'md' | 'txt';

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  tags: string[] | null;
  status: string;
  config: Record<string, unknown> | null;
  stage: ProjectStage;
  chosen_idea_id: string | null;
  health_score: Record<string, number>;
  founder_fit_alignment: Record<string, number>;
  last_pulse_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewProject {
  name: string;
  description?: string;
  tags?: string[];
  stage?: ProjectStage;
  chosen_idea_id?: string;
}

export interface Decision {
  id: string;
  project_id: string;
  user_id: string;
  category: DecisionCategory;
  question: string;
  decision: string;
  rationale: string | null;
  confidence: Confidence;
  reversibility: Reversibility;
  reversibility_decay_at: string | null;
  pre_mortem: string | null;
  depends_on_decision_id: string | null;
  tags: string[];
  decided_at: string;
  revisit_at: string | null;
  outcome_observed: string | null;
  reversed_at: string | null;
  reversed_by_decision_id: string | null;
}

export interface NewDecision {
  project_id: string;
  category: DecisionCategory;
  question: string;
  decision: string;
  reversibility: Reversibility;
  rationale?: string;
  confidence?: Confidence;
  reversibility_decay_at?: string;
  pre_mortem?: string;
  depends_on_decision_id?: string;
  tags?: string[];
  revisit_at?: string;
}

export interface ProjectArtifact {
  id: string;
  project_id: string;
  kind: ArtifactKind;
  title: string;
  content: Record<string, unknown>;
  version: number;
  parent_artifact_id: string | null;
  exported_format: ExportedFormat | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewProjectArtifact {
  project_id: string;
  kind: ArtifactKind;
  title: string;
  content: Record<string, unknown>;
  version?: number;
  parent_artifact_id?: string;
  exported_format?: ExportedFormat;
  notes?: string;
}

export interface ProjectPulseLog {
  id: string;
  project_id: string;
  week_starting: string;
  summary_md: string;
  metrics: Record<string, number>;
  key_decisions: string[];
  notable_artifacts: string[];
  health_delta: Record<string, number>;
  auto_generated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — UI-friendly metadata
// ─────────────────────────────────────────────────────────────────────────────

export const PROJECT_STAGES: { id: ProjectStage; label: string; description: string }[] = [
  { id: 'idea',       label: 'Idea',       description: 'Pre-validation; brainstorming, deciding what to build.' },
  { id: 'validated',  label: 'Validated',  description: 'Idea passed scoring; haven’t started building yet.' },
  { id: 'building',   label: 'Building',   description: 'MVP in progress; pre-launch.' },
  { id: 'launched',   label: 'Launched',   description: 'Live with users; iterating on PMF.' },
  { id: 'scaling',    label: 'Scaling',    description: 'PMF clear; growing revenue/team.' },
  { id: 'paused',     label: 'Paused',     description: 'Active work suspended; not abandoned.' },
  { id: 'archived',   label: 'Archived',   description: 'Done, killed, or pivoted away from.' },
];

export const DECISION_CATEGORIES: { id: DecisionCategory; label: string }[] = [
  { id: 'pricing',     label: 'Pricing' },
  { id: 'gtm',         label: 'Go-to-market' },
  { id: 'hiring',      label: 'Hiring' },
  { id: 'fundraise',   label: 'Fundraising' },
  { id: 'pivot',       label: 'Pivot' },
  { id: 'legal',       label: 'Legal / Ops' },
  { id: 'product',     label: 'Product' },
  { id: 'ops',         label: 'Operations' },
  { id: 'positioning', label: 'Positioning' },
  { id: 'validation',  label: 'Validation' },
  { id: 'other',       label: 'Other' },
];

export const REVERSIBILITY_LEVELS: { id: Reversibility; label: string; tone: 'good' | 'warn' | 'bad' }[] = [
  { id: 'reversible', label: 'Reversible',   tone: 'good' },
  { id: 'expensive',  label: 'Expensive',    tone: 'warn' },
  { id: 'one_way',    label: 'One-way door', tone: 'bad' },
];

export const ARTIFACT_KINDS: { id: ArtifactKind; label: string }[] = [
  { id: 'pitch_deck',       label: 'Pitch deck' },
  { id: 'financial_model',  label: 'Financial model' },
  { id: 'positioning_doc',  label: 'Positioning doc' },
  { id: 'business_plan',    label: 'Business plan' },
  { id: 'gtm_plan',         label: 'GTM plan' },
  { id: 'investor_update',  label: 'Investor update' },
  { id: 'legal_doc',        label: 'Legal document' },
  { id: 'survey_results',   label: 'Survey results' },
  { id: 'idea_validation',  label: 'Idea validation report' },
  { id: 'memo',             label: 'Memo' },
  { id: 'one_pager',        label: 'One-pager' },
  { id: 'other',             label: 'Other' },
];
