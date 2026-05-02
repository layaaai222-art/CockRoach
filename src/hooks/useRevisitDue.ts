// Cross-project revisit-due aggregator. Surfaces decisions whose
// `revisit_at` is on/before today, scoped to the current user, so we
// can show a single global banner regardless of which project the
// user is in.

import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { Decision } from '../lib/types';

export interface RevisitDueItem {
  decision: Decision;
  projectId: string;
  projectName: string;
  daysOverdue: number;
}

interface Params {
  userId: string | null | undefined;
}

export function useRevisitDue({ userId }: Params) {
  const [items, setItems] = useState<RevisitDueItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) {
      setItems([]);
      setLoaded(true);
      return;
    }
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const cutoffIso = today.toISOString();

    const { data, error } = await supabase
      .from('decisions')
      .select('*, projects:project_id(id, name, stage)')
      .eq('user_id', userId)
      .is('reversed_at', null)
      .not('revisit_at', 'is', null)
      .lte('revisit_at', cutoffIso)
      .order('revisit_at', { ascending: true });

    if (error || !data) {
      setItems([]);
      setLoaded(true);
      return;
    }

    const now = Date.now();
    const dueItems: RevisitDueItem[] = data
      .filter((d): d is Decision & { projects: { id: string; name: string; stage: string } | null } =>
        d.projects != null && (d.projects as { stage?: string }).stage !== 'archived',
      )
      .map((d) => {
        const revisit = new Date(d.revisit_at as string).getTime();
        const days = Math.floor((now - revisit) / (1000 * 60 * 60 * 24));
        return {
          decision: d as Decision,
          projectId: d.projects!.id,
          projectName: d.projects!.name,
          daysOverdue: days,
        };
      });

    setItems(dueItems);
    setLoaded(true);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const count = useMemo(() => items.length, [items]);

  return { items, count, loaded, refresh };
}
