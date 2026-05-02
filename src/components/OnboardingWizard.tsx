// First-run onboarding wizard. 3 steps:
//   1. "Where are you?" — have an idea / need an idea / just exploring
//   2. Founder Fit (reuses FounderFitModal as an embedded panel)
//   3. First-message guidance with sample prompts
//
// Completion is persisted in localStorage (per-user-id) so the wizard
// doesn't re-appear after dismissal. Once auth lands (Phase 3), this
// can move to users.onboarding_completed_at on the server.

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Lightbulb, Target, ArrowRight, X, ChevronRight, ChevronLeft, Compass, Rocket } from 'lucide-react';
import FounderFitModal from './FounderFitModal';
import { cn } from '../lib/utils';

type Path = 'have_idea' | 'need_idea' | 'exploring';

interface Props {
  open: boolean;
  userId: string;
  userName: string;
  onClose: () => void;
  onPickPath: (path: Path) => void;
  onPickPrompt: (prompt: string, mode?: string) => void;
}

const PATH_OPTIONS: { id: Path; icon: typeof Lightbulb; label: string; description: string }[] = [
  { id: 'have_idea', icon: Rocket,   label: 'I have an idea',  description: 'Start a project. Cockroach helps you validate, build, launch.' },
  { id: 'need_idea', icon: Lightbulb, label: 'I need an idea',  description: 'Generate ideas tailored to your skills, market, and constraints.' },
  { id: 'exploring', icon: Compass,   label: 'Just exploring', description: 'Skip the wizard. Browse modes and start whenever.' },
];

const SAMPLE_PROMPTS: Record<Path, { mode?: string; label: string; prompt: string }[]> = {
  have_idea: [
    { mode: 'IDEA_VALIDATION',   label: 'Validate the idea',     prompt: 'I want to validate my idea: {brief description}. Run the 10-section intelligence report.' },
    { mode: 'CUSTOMER_DISCOVERY', label: 'Plan customer interviews', prompt: 'I want to do customer discovery for {idea}. Generate a Mom-Test interview script targeted at {ICP}.' },
    { mode: 'BUSINESS_MODEL',    label: 'Sketch the business model', prompt: 'Help me design the business model for {idea}: revenue, costs, key resources, channels.' },
    { mode: 'POSITIONING',       label: 'Sharpen positioning',   prompt: 'Position {idea} against the 3 closest alternatives. What\'s our wedge?' },
  ],
  need_idea: [
    { mode: 'IDEA_GENERATION',   label: 'Generate 5 ideas',      prompt: 'Generate 5 startup ideas in {domain} that match my skills and constraints. Score each.' },
    { mode: 'DEEP_RESEARCH',     label: 'Map an opportunity',    prompt: 'Do a market deep-dive on {space}: TAM, players, gaps, regulatory issues, recent funding rounds.' },
    { mode: 'THINKING',          label: 'Think through trade-offs', prompt: 'I\'m torn between {idea A} and {idea B}. Walk me through the strategic tradeoffs.' },
  ],
  exploring: [
    { label: 'Just chat', prompt: 'What can you help me with?' },
  ],
};

export default function OnboardingWizard({ open, userId, userName, onClose, onPickPath, onPickPrompt }: Props) {
  const [step, setStep] = React.useState(0);
  const [path, setPath] = React.useState<Path | null>(null);
  const [showFounderFit, setShowFounderFit] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setStep(0);
      setPath(null);
      setShowFounderFit(false);
    }
  }, [open]);

  const dismiss = () => {
    try { localStorage.setItem(`cockroach.onboarded.${userId}`, '1'); } catch { /* private mode */ }
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <FounderFitModal
        open={showFounderFit}
        userId={userId}
        userName={userName}
        onClose={() => { setShowFounderFit(false); setStep(2); }}
        onSaved={() => { /* memories refresh handled by parent via App-level launcher */ }}
      />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="layaa-card bg-card border-border w-full max-w-2xl p-7 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-primary" />
                <h2 className="text-[13px] font-bold uppercase tracking-widest text-foreground">
                  Welcome to CockRoach{userName ? `, ${userName.split(' ')[0]}` : ''}
                </h2>
              </div>
              <button
                onClick={dismiss}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Skip onboarding"
                title="Skip"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-border'}`}
                />
              ))}
            </div>

            {/* Step 0 — Path */}
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <p className="text-[15px] font-medium text-foreground leading-relaxed">Where are you in your founder journey?</p>
                  <p className="text-[12px] text-muted-foreground mt-1">Pick one — we'll route you to the right place.</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {PATH_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    const selected = path === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setPath(opt.id)}
                        className={cn(
                          'flex items-start gap-3 p-3.5 border rounded-lg text-left transition-all',
                          selected
                            ? 'bg-primary/10 border-primary/40'
                            : 'bg-surface-mid/40 border-border hover:border-primary/20',
                        )}
                      >
                        <Icon size={18} className={cn('mt-0.5 shrink-0', selected ? 'text-primary' : 'text-muted-foreground')} />
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-[13px] font-bold', selected ? 'text-primary' : 'text-foreground')}>{opt.label}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{opt.description}</p>
                        </div>
                        {selected && <ArrowRight size={14} className="text-primary mt-1" />}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-muted-foreground/60">You can change this any time.</span>
                  <button
                    onClick={() => {
                      if (!path) return;
                      onPickPath(path);
                      if (path === 'exploring') { dismiss(); return; }
                      setStep(1);
                    }}
                    disabled={!path}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-30 transition-all rounded-sm"
                  >
                    Next <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 1 — Founder Fit */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <p className="text-[15px] font-medium text-foreground leading-relaxed">Quick founder profile</p>
                  <p className="text-[12px] text-muted-foreground mt-1">
                    6 short questions. Your answers stay in your memory bank and tailor every future answer Cockroach gives you. Takes ~2 minutes — or skip and do it later from the right sidebar.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep(0)}
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
                  >
                    <ChevronLeft size={12} /> Back
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStep(2)}
                      className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => setShowFounderFit(true)}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/90 transition-all rounded-sm"
                    >
                      Run profile <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Sample prompts */}
            {step === 2 && path && (
              <div className="space-y-4">
                <div>
                  <p className="text-[15px] font-medium text-foreground leading-relaxed">Try one of these to get started</p>
                  <p className="text-[12px] text-muted-foreground mt-1">
                    Click → Cockroach prefills it. Replace placeholders in <span className="font-mono">{'{ }'}</span> with your specifics.
                  </p>
                </div>
                <div className="space-y-2">
                  {(SAMPLE_PROMPTS[path] ?? []).map((sp, i) => (
                    <button
                      key={i}
                      onClick={() => { onPickPrompt(sp.prompt, sp.mode); dismiss(); }}
                      className="w-full flex items-start gap-3 p-3 bg-surface-mid/40 border border-border hover:border-primary/30 hover:bg-primary/5 rounded-lg text-left transition-all group"
                    >
                      <Target size={14} className="text-primary mt-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-foreground">{sp.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{sp.prompt}</p>
                        {sp.mode && <p className="text-[9px] uppercase tracking-widest text-primary/60 mt-1">→ {sp.mode}</p>}
                      </div>
                      <ArrowRight size={12} className="text-muted-foreground group-hover:text-primary mt-1 shrink-0" />
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
                  >
                    <ChevronLeft size={12} /> Back
                  </button>
                  <button
                    onClick={dismiss}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/90 transition-all rounded-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

/** Determine whether the wizard should appear for this user. */
export function shouldShowOnboarding(userId: string, hasChats: boolean, hasProjects: boolean): boolean {
  if (hasChats || hasProjects) return false;
  try {
    return localStorage.getItem(`cockroach.onboarded.${userId}`) !== '1';
  } catch {
    return true;
  }
}
