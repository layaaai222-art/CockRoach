// Top-of-app banner showing decisions whose revisit_at has passed.
// Click → opens the project's Decisions tab focused on that decision.
// Dismissable per-session via in-memory state.

import React from 'react';
import { AlertCircle, X, ArrowRight } from 'lucide-react';
import { useRevisitDue } from '../hooks/useRevisitDue';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  userId: string | null | undefined;
  onOpenProject: (projectId: string) => void;
}

export default function RevisitDueBanner({ userId, onOpenProject }: Props) {
  const { items, count } = useRevisitDue({ userId });
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed || count === 0) return null;

  const top = items.slice(0, 3);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="px-4 sm:px-6 pt-3"
      >
        <div className="layaa-card bg-amber-950/30 border border-amber-500/30 px-3 py-2 flex items-start gap-2.5">
          <AlertCircle size={14} className="text-amber-400 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
                {count} decision{count === 1 ? '' : 's'} due for revisit
              </p>
              <button
                onClick={() => setDismissed(true)}
                className="text-amber-400/60 hover:text-amber-300 transition-colors shrink-0"
                aria-label="Dismiss"
              >
                <X size={11} />
              </button>
            </div>
            <ul className="space-y-1">
              {top.map((item) => (
                <li key={item.decision.id} className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenProject(item.projectId)}
                    className="flex-1 text-left text-[12px] text-foreground hover:text-amber-200 transition-colors flex items-center gap-1.5 min-w-0"
                  >
                    <span className="truncate">
                      <span className="text-amber-300/70">{item.projectName}</span>
                      <span className="mx-1.5 text-amber-500/40">·</span>
                      <span className="truncate">{item.decision.question}</span>
                    </span>
                    <ArrowRight size={10} className="shrink-0 text-amber-400/60" />
                  </button>
                  <span className="text-[10px] text-amber-400/60 shrink-0">
                    {item.daysOverdue === 0 ? 'today' : `${item.daysOverdue}d`}
                  </span>
                </li>
              ))}
            </ul>
            {count > 3 && (
              <p className="text-[10px] text-amber-400/50 mt-1">+{count - 3} more</p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
