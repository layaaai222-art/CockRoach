// useTier — resolves the current user's billing tier from the
// subscriptions table. Pre-auth (today) every user defaults to
// 'free' since we have no way to attribute Stripe rows to users
// without auth UUIDs. After Phase 3 launch the subscriptions row
// is populated by the Stripe webhook keyed on user_id.
//
// Pro feature gates check tier === 'pro' and either show an
// upgrade modal or silently disable, depending on the surface.

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type Tier = 'free' | 'pro';

export interface TierState {
  tier: Tier;
  loaded: boolean;
  // Source-of-truth field-by-field so UI can decide messaging.
  status: string | null;          // 'active' | 'trialing' | 'past_due' | etc.
  current_period_end: string | null;
}

interface UseTierArgs {
  userId: string | null | undefined;
}

const FREE_DEFAULT: TierState = {
  tier: 'free',
  loaded: false,
  status: null,
  current_period_end: null,
};

export function useTier({ userId }: UseTierArgs): TierState & { refresh: () => Promise<void> } {
  const [state, setState] = useState<TierState>(FREE_DEFAULT);

  const refresh = useCallback(async () => {
    if (!userId) {
      setState({ ...FREE_DEFAULT, loaded: true });
      return;
    }
    try {
      // user_id in subscriptions is a uuid (matches Supabase Auth shape).
      // Pre-auth, our user IDs are text, so this query returns nothing
      // until Phase 3 — which is the desired behavior (everyone is free).
      const { data } = await supabase
        .from('subscriptions')
        .select('tier, status, current_period_end')
        .eq('user_id', userId)
        .maybeSingle();

      if (!data) {
        setState({ ...FREE_DEFAULT, loaded: true });
        return;
      }

      const tier: Tier = data.tier === 'pro' && (data.status === 'active' || data.status === 'trialing')
        ? 'pro'
        : 'free';
      setState({
        tier,
        loaded: true,
        status: data.status ?? null,
        current_period_end: data.current_period_end ?? null,
      });
    } catch {
      setState({ ...FREE_DEFAULT, loaded: true });
    }
  }, [userId]);

  useEffect(() => { void refresh(); }, [refresh]);

  return { ...state, refresh };
}

// Capability matrix — single source of truth for what each tier gets.
// Used by gating UI. Free tier is generous to bootstrap word-of-mouth;
// Pro unlocks the strategic depth (memory persistence beyond a small
// cap, frameworks, projects spine, brand-aware exports).
export interface TierCapabilities {
  monthlyChatCap: number | null;       // null = unlimited
  activeProjectsCap: number | null;
  monthlyExportsCap: number | null;
  exportWatermark: boolean;
  frameworks: boolean;
  projectSpine: boolean;
  imageGen: boolean;
  vibeCoding: boolean;
  brandKit: boolean;
  prioritySupport: boolean;
}

export const TIER_CAPABILITIES: Record<Tier, TierCapabilities> = {
  free: {
    monthlyChatCap: 5,
    activeProjectsCap: 1,
    monthlyExportsCap: 3,
    exportWatermark: true,
    frameworks: true,         // accessible — discovery is good for free users
    projectSpine: true,       // 1 project keeps the value visible
    imageGen: false,          // Pro-only — pure cost
    vibeCoding: false,        // Pro-only — pure cost
    brandKit: false,
    prioritySupport: false,
  },
  pro: {
    monthlyChatCap: null,
    activeProjectsCap: 5,
    monthlyExportsCap: null,
    exportWatermark: false,
    frameworks: true,
    projectSpine: true,
    imageGen: true,
    vibeCoding: true,
    brandKit: true,
    prioritySupport: true,
  },
};

export function capabilitiesFor(tier: Tier): TierCapabilities {
  return TIER_CAPABILITIES[tier];
}
