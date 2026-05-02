// Small chips rendered below an assistant message showing which mode
// + framework were active for that turn. Click → tooltip with the
// "When this mode is right" sketch. Educates users about what
// capabilities exist passively.

import { Sparkles, Tag } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  capabilities: {
    mode?: string;
    framework?: string;
    routed?: boolean;
  };
  modeLabel?: string;
  frameworkLabel?: string;
  className?: string;
}

export default function CapabilityChips({ capabilities, modeLabel, frameworkLabel, className }: Props) {
  const { mode, framework, routed } = capabilities;
  if (!mode && !framework) return null;

  // Don't show chip for plain GENERAL — it's the default and the
  // chip would be noise. Show for any non-default mode + frameworks.
  const showMode = mode && mode !== 'GENERAL';
  if (!showMode && !framework) return null;

  return (
    <div className={cn('flex items-center gap-1.5 mt-2 flex-wrap', className)}>
      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
        {routed ? 'Auto-picked' : 'Used'}
      </span>
      {showMode && (
        <span
          title={`${modeLabel ?? mode} — used to shape this answer`}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[10px] font-bold text-primary"
        >
          {routed && <Sparkles size={9} className="text-primary/70" />}
          {modeLabel ?? mode}
        </span>
      )}
      {framework && (
        <span
          title={`${frameworkLabel ?? framework} framework — applied to this answer`}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded text-[10px] font-bold text-violet-300"
        >
          <Tag size={9} className="text-violet-400/70" />
          {frameworkLabel ?? framework}
        </span>
      )}
    </div>
  );
}
