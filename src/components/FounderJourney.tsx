// Founder Journey Navigator — a phased playbook showing what to do
// at each stage of building a company, which mode to use, which
// framework runs at that step, and a starter prompt the user can
// fire off in one click.
//
// Adapts to the user's active project stage: the matching phase is
// auto-expanded; phases ahead/behind collapse but stay accessible.

import React from 'react';
import { motion } from 'motion/react';
import {
  Lightbulb, ShieldCheck, CheckSquare, Target, PiggyBank, TrendingUp,
  ArrowRight, MapPin, Sparkles, Zap, ChevronDown, ChevronUp,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Phase {
  id: string;
  label: string;
  stageKey: string; // matches projects.stage
  icon: typeof Lightbulb;
  goal: string;
  successCriteria: string;
  pitfalls: string[];
  modes: { id: string; label: string; reason: string }[];
  frameworks: { id: string; label: string }[];
  starterPrompts: { mode: string; text: string }[];
  duration: string;
}

const PHASES: Phase[] = [
  {
    id: 'idea',
    label: 'Phase 1 — Idea',
    stageKey: 'idea',
    icon: Lightbulb,
    goal: 'Find a real problem worth solving and verify the founder fits the work.',
    successCriteria: 'A 1-sentence "we help X do Y so that Z" written in a stranger\'s words from a real conversation, not your imagination.',
    pitfalls: [
      'Falling in love with the solution before talking to anyone',
      'Picking an idea that requires permission you don\'t have (regulated, capital-heavy, network-effect-only)',
      'Skipping founder-fit — building something that requires sales when you hate sales',
    ],
    modes: [
      { id: 'IDEA_GENERATION', label: 'Generate Ideas', reason: 'Casts the net wide tailored to your skills + constraints.' },
      { id: 'IDEA_VALIDATION', label: 'Validate Idea', reason: '10-section intelligence report on a candidate idea.' },
    ],
    frameworks: [
      { id: 'JOBS_TO_BE_DONE', label: 'Jobs To Be Done' },
      { id: 'LEAN_CANVAS', label: 'Lean Canvas' },
    ],
    starterPrompts: [
      { mode: 'IDEA_GENERATION', text: 'Generate 5 startup ideas in {your domain} that match my skills and constraints. Score each on demand × access × moat × founder-fit.' },
      { mode: 'IDEA_VALIDATION', text: 'I want to validate this idea: {1-2 sentence description}. Run the 10-section intelligence report.' },
    ],
    duration: '1-2 weeks',
  },
  {
    id: 'validate',
    label: 'Phase 2 — Validate',
    stageKey: 'validated',
    icon: ShieldCheck,
    goal: 'Talk to 10+ people in your target segment until you can predict what they\'ll say.',
    successCriteria: 'A specific ICP, a specific pain, a specific willingness-to-pay statement. Not "founders" — "30-50-person SaaS teams hiring their first PM."',
    pitfalls: [
      'Leading questions ("would you pay $X for Y?")',
      'Validating with friends and family',
      'Settling for "interesting" responses instead of "tell me about the last time you had this problem"',
    ],
    modes: [
      { id: 'CUSTOMER_DISCOVERY', label: 'Customer Discovery', reason: 'Mom-test interviews, JTBD timeline, ICP scoring.' },
      { id: 'POSITIONING', label: 'Brand & Positioning', reason: 'Sharpen messaging once you understand the buyer.' },
    ],
    frameworks: [
      { id: 'JOBS_TO_BE_DONE', label: 'JTBD switch interview' },
      { id: 'VALUE_MATRIX', label: 'Value Matrix' },
    ],
    starterPrompts: [
      { mode: 'CUSTOMER_DISCOVERY', text: 'Generate a Mom-Test interview script for {ICP} around {pain}. 8 questions, no leading.' },
    ],
    duration: '2-4 weeks',
  },
  {
    id: 'build',
    label: 'Phase 3 — Build',
    stageKey: 'building',
    icon: CheckSquare,
    goal: 'Ship the smallest thing that delivers the validated value to a real user.',
    successCriteria: 'A live thing one paying or actively-engaged user is using. "Demo" doesn\'t count.',
    pitfalls: [
      'Building too much before launching',
      'Optimizing the stack instead of the product',
      'Not pricing while building (pricing is a discovery tool, not a finishing touch)',
    ],
    modes: [
      { id: 'EXECUTION', label: 'Build Plan', reason: 'Roadmap + scope discipline.' },
      { id: 'UI_DESIGN', label: 'UI Design Spec', reason: '5-layer specs for v0 / Lovable / Figma Make.' },
      { id: 'VIBE_CODING', label: 'Vibe Coding', reason: 'One-shot landing pages, prototypes, internal tools.' },
      { id: 'BUSINESS_MODEL', label: 'Business Model', reason: 'Unit economics + revenue model.' },
      { id: 'PRICING', label: 'Pricing Strategy', reason: 'Tiers, packaging, sensitivity.' },
    ],
    frameworks: [
      { id: 'VALUE_EQUATION', label: 'Hormozi Value Equation' },
      { id: 'LEAN_CANVAS', label: 'Lean Canvas (revisit)' },
    ],
    starterPrompts: [
      { mode: 'EXECUTION', text: 'Sketch a 4-week MVP plan for {idea}. List the 3 must-have features and 7 things to defer.' },
      { mode: 'PRICING', text: 'Help me design pricing for {product}: 3 tiers, recommended price points, value metric.' },
    ],
    duration: '4-12 weeks',
  },
  {
    id: 'gtm',
    label: 'Phase 4 — Go-to-Market',
    stageKey: 'launched',
    icon: Target,
    goal: 'Find the channel that compounds and double down. Get to 100 customers.',
    successCriteria: 'You can name your single best channel by gross-margin CAC and predict next month\'s growth ±20%.',
    pitfalls: [
      'Spreading thin across 5 channels instead of dominating 1',
      'Paid ads before product-market fit (false positives)',
      'Ignoring SEO compounding because it\'s slow',
    ],
    modes: [
      { id: 'GO_TO_MARKET', label: 'Go-to-Market', reason: 'PLG vs sales-led, channel selection, CAC math.' },
      { id: 'PAID_ADS', label: 'Paid Ads', reason: '7-block audit, creative briefs, RSA copy.' },
      { id: 'SEO_AND_CONTENT', label: 'SEO & Content', reason: '5-pillar audit, keyword clusters, E-E-A-T briefs.' },
      { id: 'POSITIONING', label: 'Brand & Positioning', reason: 'Sharpen the wedge.' },
    ],
    frameworks: [
      { id: 'DREAM_100', label: 'Dream 100' },
      { id: 'COMPETITIVE_TEARDOWN', label: 'Competitive Teardown' },
      { id: 'NORTH_STAR_METRIC', label: 'North Star Metric' },
    ],
    starterPrompts: [
      { mode: 'GO_TO_MARKET', text: 'Run the Bullseye framework on {product} with ACV {$X}. Pick the top 3 channels and explain the math.' },
    ],
    duration: '8-26 weeks',
  },
  {
    id: 'fundraise',
    label: 'Phase 5 — Fundraise (optional)',
    stageKey: 'launched',
    icon: PiggyBank,
    goal: 'If raising — close the round; if not — confirm the bootstrap path.',
    successCriteria: 'Term sheet signed OR runway clear path to default-alive without dilution.',
    pitfalls: [
      'Raising for the wrong reason (vanity / FOMO instead of capital-bound bottleneck)',
      'Stacking SAFEs with conflicting MFNs',
      'Founder ownership red zones — under 20% combined post-Series A',
    ],
    modes: [
      { id: 'FUNDRAISING', label: 'Fundraising', reason: 'SAFEs, decks, investor list, term-sheet red flags.' },
      { id: 'HIRING_AND_EQUITY', label: 'Hiring & Equity', reason: 'Equity bands, vesting, first-5 hires.' },
      { id: 'LEGAL_AND_OPS', label: 'Legal & Ops', reason: 'Entity, IP, founder agreements.' },
    ],
    frameworks: [
      { id: 'ACP', label: 'ACP Diagnostic (investor-prep)' },
      { id: 'NORTH_STAR_METRIC', label: 'North Star Metric' },
    ],
    starterPrompts: [
      { mode: 'FUNDRAISING', text: 'Build a 12-slide Sequoia-style pitch deck for {company}. Stage: {pre-seed/seed/A}. Raising {$X}.' },
    ],
    duration: '6-12 weeks (if raising)',
  },
  {
    id: 'scale',
    label: 'Phase 6 — Scale',
    stageKey: 'scaling',
    icon: TrendingUp,
    goal: 'Move from founder-led growth to repeatable systems. Pivot or persevere on each major call.',
    successCriteria: 'Growth rate sustained without founder being the bottleneck on any single function.',
    pitfalls: [
      'Hiring expensive seniors before you know what they\'ll own',
      'Adding features instead of fixing churn',
      'Refusing to kill projects that aren\'t working (sunk-cost)',
    ],
    modes: [
      { id: 'PRICING', label: 'Pricing (revisit)', reason: '1% pricing improvement = 11% op-profit lift.' },
      { id: 'HIRING_AND_EQUITY', label: 'Hiring & Equity', reason: 'First 10-50 hires + leadership bench.' },
      { id: 'LEGAL_AND_OPS', label: 'Legal & Ops', reason: 'SOC 2 / GDPR / employment compliance.' },
    ],
    frameworks: [
      { id: 'ACP', label: 'ACP Diagnostic' },
      { id: 'NORTH_STAR_METRIC', label: 'North Star Metric' },
    ],
    starterPrompts: [
      { mode: 'GENERAL', text: 'Run the ACP diagnostic on {company}. Score Acquisition / Churn / Pricing 1-10. Lowest = where I focus next 30 days.' },
    ],
    duration: '∞',
  },
];

interface Props {
  /** Current project stage, used to auto-expand the matching phase. */
  currentStage?: string | null;
  onSelectMode: (modeId: string, prompt?: string) => void;
  onSelectFramework: (frameworkId: string) => void;
}

export default function FounderJourney({ currentStage, onSelectMode, onSelectFramework }: Props) {
  const matchingIdx = React.useMemo(() => {
    const idx = PHASES.findIndex(p => p.stageKey === currentStage);
    return idx >= 0 ? idx : 0;
  }, [currentStage]);

  const [expanded, setExpanded] = React.useState<Set<string>>(new Set([PHASES[matchingIdx].id]));
  const toggle = (id: string) => setExpanded(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-primary" />
          <h1 className="text-xl font-bold text-foreground">Founder Journey</h1>
        </div>
        <p className="text-[12px] text-muted-foreground max-w-2xl">
          Six phases from blank page to scale. Each phase tells you the goal, the success criteria, the pitfalls to dodge, and which Cockroach skills to call. Click any sample prompt to start a chat in the right mode.
        </p>
      </div>

      <div className="space-y-3">
        {PHASES.map((phase, i) => {
          const Icon = phase.icon;
          const isOpen = expanded.has(phase.id);
          const isCurrent = i === matchingIdx;
          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                'layaa-card border bg-card/40 overflow-hidden transition-colors',
                isCurrent ? 'border-primary/40' : 'border-border',
              )}
            >
              <button
                onClick={() => toggle(phase.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-mid/30 transition-colors"
              >
                <div className={cn('p-2 rounded-lg shrink-0', isCurrent ? 'bg-primary/15 text-primary' : 'bg-surface-mid/60 text-muted-foreground')}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[14px] font-bold text-foreground">{phase.label}</h2>
                    {isCurrent && (
                      <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-primary/15 text-primary border border-primary/30 rounded">You are here</span>
                    )}
                    <span className="text-[10px] text-muted-foreground/60 ml-auto shrink-0">{phase.duration}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{phase.goal}</p>
                </div>
                {isOpen ? <ChevronUp size={13} className="text-muted-foreground/60" /> : <ChevronDown size={13} className="text-muted-foreground/60" />}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-4 border-t border-border/40 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Success looks like</p>
                      <p className="text-foreground leading-relaxed">{phase.successCriteria}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Common pitfalls</p>
                      <ul className="space-y-1 text-muted-foreground">
                        {phase.pitfalls.map((p, idx) => (
                          <li key={idx} className="flex gap-1.5"><span className="text-destructive/70 shrink-0">·</span>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 flex items-center gap-1.5">
                      <Sparkles size={10} className="text-primary" /> Recommended skills
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {phase.modes.map(m => (
                        <button
                          key={m.id}
                          onClick={() => onSelectMode(m.id)}
                          className="flex items-start gap-2 px-3 py-2 bg-surface-mid/40 hover:bg-primary/10 border border-border/50 hover:border-primary/30 rounded text-left transition-all group"
                        >
                          <ArrowRight size={11} className="text-muted-foreground group-hover:text-primary mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-bold text-foreground group-hover:text-primary">{m.label}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{m.reason}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {phase.frameworks.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Frameworks to run</p>
                      <div className="flex flex-wrap gap-1.5">
                        {phase.frameworks.map(f => (
                          <button
                            key={f.id}
                            onClick={() => onSelectFramework(f.id)}
                            className="px-2.5 py-1 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 rounded text-[11px] font-medium text-violet-300 hover:text-violet-200 transition-colors"
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {phase.starterPrompts.length > 0 && (
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 flex items-center gap-1.5">
                        <Zap size={10} className="text-primary" /> Try one
                      </p>
                      <div className="space-y-1.5">
                        {phase.starterPrompts.map((sp, idx) => (
                          <button
                            key={idx}
                            onClick={() => onSelectMode(sp.mode, sp.text)}
                            className="w-full text-left px-3 py-2 bg-surface-mid/30 hover:bg-primary/5 border border-border/40 hover:border-primary/20 rounded transition-colors"
                          >
                            <p className="text-[10px] uppercase tracking-widest text-primary/80 font-bold mb-0.5">{sp.mode}</p>
                            <p className="text-[11px] text-foreground leading-snug">{sp.text}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
