// UpgradeModal — surfaces the value of Pro and links to Stripe checkout.
// Pre-auth this is informational; the upgrade button shows a "coming
// soon" toast. After Phase 3 launch, clicking starts a Stripe checkout
// session via api/create-checkout (TODO when keys land).

import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Sparkles, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { TIER_CAPABILITIES } from '../hooks/useTier';

interface Props {
  open: boolean;
  onClose: () => void;
  reason?: string;
}

const FEATURE_ROWS: { label: string; key: keyof typeof TIER_CAPABILITIES.free }[] = [
  { label: 'Chats / month',          key: 'monthlyChatCap' },
  { label: 'Active projects',        key: 'activeProjectsCap' },
  { label: 'Exports / month',        key: 'monthlyExportsCap' },
  { label: 'Watermark on exports',   key: 'exportWatermark' },
  { label: 'Frameworks library',     key: 'frameworks' },
  { label: 'Project spine + decisions log', key: 'projectSpine' },
  { label: 'Image generation (GPT-image-2)',    key: 'imageGen' },
  { label: 'Vibe coding (live preview)',         key: 'vibeCoding' },
  { label: 'Brand kit on exports',   key: 'brandKit' },
  { label: 'Priority support',       key: 'prioritySupport' },
];

function fmt(value: number | null | boolean) {
  if (typeof value === 'boolean') {
    return value ? <Check size={14} className="text-emerald-400" /> : <X size={14} className="text-zinc-600" />;
  }
  return value === null ? <span className="text-emerald-400 font-bold">∞</span> : <span>{value}</span>;
}

export default function UpgradeModal({ open, onClose, reason }: Props) {
  if (!open) return null;

  const startCheckout = async () => {
    // Stripe checkout endpoint to be wired in Phase 3 launch
    // (api/create-checkout). For now, route to the marketing/contact path.
    toast('Pro launches soon — drop your email at hello@layaa.ai for early-bird pricing.');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="layaa-card bg-card border-border w-full max-w-2xl p-7 space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              <h2 className="text-[13px] font-bold uppercase tracking-widest text-foreground">Upgrade to Pro</h2>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
              <X size={14} />
            </button>
          </div>

          {reason && (
            <div className="flex items-start gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-md">
              <Lock size={12} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-[12px] text-amber-200">{reason}</p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-[15px] text-foreground font-medium">Everything you need to build a real company.</p>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Free is generous so you can try CockRoach. Pro unlocks unlimited chat, full image generation, vibe coding, brand-aware exports, and project depth.
            </p>
          </div>

          <div className="bg-surface-mid/40 border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 px-4 py-2 border-b border-border/40 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <div>Feature</div>
              <div className="text-center">Free</div>
              <div className="text-center text-primary">Pro · $29/mo</div>
            </div>
            {FEATURE_ROWS.map(row => (
              <div key={row.key} className="grid grid-cols-3 px-4 py-2 border-b border-border/30 last:border-b-0 text-[12px]">
                <div className="text-foreground">{row.label}</div>
                <div className="text-center text-muted-foreground flex justify-center">{fmt(TIER_CAPABILITIES.free[row.key] as never)}</div>
                <div className="text-center text-primary flex justify-center">{fmt(TIER_CAPABILITIES.pro[row.key] as never)}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-[10px] text-muted-foreground/60">$29/mo · cancel anytime · 7-day money-back</p>
            <button
              onClick={startCheckout}
              className="flex items-center gap-1.5 px-5 py-2 text-[12px] font-bold uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/90 transition-all rounded-sm"
            >
              <Sparkles size={12} /> Upgrade to Pro
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
