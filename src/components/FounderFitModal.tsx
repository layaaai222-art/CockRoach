// Founder-Fit mini-assessment. 6 questions → results saved as
// user-scope memory_items so future IDEA_GENERATION / IDEA_VALIDATION
// runs are tailored to this founder's profile.
//
// Answers are intentionally narrative (not Likert) so the LLM gets
// rich context. Each answer becomes one memory item; we tag them
// with category='founder_fit' so they're easy to filter/clear later.

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onSaved?: () => void;
}

interface FFQuestion {
  id: string;
  prompt: string;
  hint: string;
  placeholder: string;
}

const QUESTIONS: FFQuestion[] = [
  {
    id: 'distinctive_skill',
    prompt: 'What is the one thing you are distinctively good at — better than 95% of people you know?',
    hint: 'Be specific. Not "I work hard". Not "I am creative". A skill, a domain, a perspective.',
    placeholder: 'e.g., Reading SEC filings end-to-end and finding accounting red flags…',
  },
  {
    id: 'unfair_advantage',
    prompt: 'What unfair advantages do you have? (Network, capital, insider knowledge, audience, regulatory access, prior wins.)',
    hint: '"Hard work" and "good team" don\'t count. Real advantages are hard to copy.',
    placeholder: 'e.g., 8 years inside the FedRAMP compliance world; warm intros to 30+ DoD program offices…',
  },
  {
    id: 'pain_obsession',
    prompt: 'What problem have you been thinking about (or complaining about) for years?',
    hint: 'The longer you have noticed it, the more likely you have a real edge in solving it.',
    placeholder: 'e.g., How small SaaS teams lose a week every month chasing SOC2 evidence…',
  },
  {
    id: 'time_horizon',
    prompt: 'How long are you willing to work on this before declaring success or pivoting? (Realistically — including life context.)',
    hint: 'A startup that fails because the founder taps out at month 18 is more common than one that fails for product reasons.',
    placeholder: 'e.g., 36 months minimum; my partner is supportive and we have 18 months of runway saved…',
  },
  {
    id: 'energy_drain',
    prompt: 'What kinds of work drain you? (Avoid building a business whose core motion is on this list.)',
    hint: 'Honest answer. If outbound sales drains you and your idea requires it, you need a co-founder or a different idea.',
    placeholder: 'e.g., High-volume cold outbound, executive politics, large-team management…',
  },
  {
    id: 'success_definition',
    prompt: 'What does success look like for you in 3 years? (Money, lifestyle, impact, autonomy — be honest about the mix.)',
    hint: 'Founders building a $1B venture have a very different operating cadence than ones building a $1M lifestyle business. Pick.',
    placeholder: 'e.g., $300k/yr take-home, 4-day work weeks, no investors, profitable from year 1…',
  },
];

export default function FounderFitModal({ open, onClose, userId, userName, onSaved }: Props) {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setStep(0);
      setAnswers({});
      setDone(false);
    }
  }, [open]);

  if (!open) return null;

  const total = QUESTIONS.length;
  const isFirst = step === 0;
  const isLast = step === total - 1;
  const q = QUESTIONS[step];
  const currentAnswer = answers[q.id] ?? '';

  const handleSave = async () => {
    setSaving(true);
    const records = QUESTIONS
      .map(qq => ({
        user_id: userId,
        category: 'founder_fit',
        content: `[${qq.id}] ${qq.prompt}\nA (${userName}): ${(answers[qq.id] ?? '').trim()}`,
      }))
      .filter(r => r.content.split('\n')[1]?.replace(/^A \([^)]+\): /, '').length > 0);

    if (records.length === 0) {
      toast.error('Please answer at least one question.');
      setSaving(false);
      return;
    }

    // Two-phase replace: insert FIRST so we don't lose data if the
    // network blips between operations. If the insert succeeds, then
    // clean up old founder_fit rows (matching by created_at so we
    // don't delete the rows we just wrote).
    const insertCutoff = new Date().toISOString();
    const { error } = await supabase.from('memory_items').insert(records);
    if (error) {
      setSaving(false);
      toast.error('Could not save assessment — try again.');
      return;
    }

    const { error: delErr } = await supabase
      .from('memory_items')
      .delete()
      .eq('user_id', userId)
      .eq('category', 'founder_fit')
      .lt('created_at', insertCutoff);
    if (delErr) {
      // Non-fatal — user may see duplicates briefly; old rows will be
      // cleaned up next save attempt.
      // eslint-disable-next-line no-console
      console.warn('Could not clear prior founder-fit memories:', delErr.message);
    }
    setSaving(false);

    setDone(true);
    toast.success('Founder-fit profile saved to memory');
    onSaved?.();
    setTimeout(onClose, 900);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="layaa-card bg-card border-border w-full max-w-xl p-6 space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              <h2 className="text-[13px] font-bold uppercase tracking-widest text-foreground">Founder Fit Assessment</h2>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
              <X size={14} />
            </button>
          </div>

          {done ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 size={42} className="text-emerald-500 mx-auto" />
              <p className="text-[13px] text-foreground font-medium">Saved.</p>
              <p className="text-[11px] text-muted-foreground">CockRoach will use this whenever you generate or validate ideas.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-border'}`}
                  />
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Question {step + 1} of {total}</p>
                <p className="text-[14px] font-medium text-foreground leading-relaxed">{q.prompt}</p>
                <p className="text-[11px] text-muted-foreground italic">{q.hint}</p>
              </div>

              <textarea
                key={q.id}
                value={currentAnswer}
                onChange={(e) => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                placeholder={q.placeholder}
                className="w-full bg-surface-mid border border-border rounded-md px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 min-h-[120px] resize-y"
                autoFocus
              />

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(s => s - 1)}
                  disabled={isFirst}
                  className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-all"
                >
                  <ChevronLeft size={12} /> Back
                </button>
                {isLast ? (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50 transition-all rounded-sm"
                  >
                    {saving ? 'Saving…' : 'Save Profile'}
                    <CheckCircle2 size={12} />
                  </button>
                ) : (
                  <button
                    onClick={() => setStep(s => s + 1)}
                    className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-all"
                  >
                    Next <ChevronRight size={12} />
                  </button>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
