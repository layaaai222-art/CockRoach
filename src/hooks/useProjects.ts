import React from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import type { Project, NewProject, ProjectStage } from '../lib/types';

interface UseProjectsArgs {
  userId: string | null;
}

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  create: (input: NewProject) => Promise<Project | null>;
  update: (id: string, patch: Partial<NewProject> & { stage?: ProjectStage; description?: string | null }) => Promise<Project | null>;
  archive: (id: string) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  byId: (id: string | null) => Project | null;
}

/**
 * Project CRUD hook. Hydrates from Supabase scoped to the current user.
 * Sub-resources (decisions, artifacts, pulse_log) live in their own hooks
 * (`useDecisions`, `useArtifacts`, `usePulseLog`) — keep this one focused.
 */
export function useProjects({ userId }: UseProjectsArgs): UseProjectsReturn {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async (): Promise<void> => {
    if (!userId) {
      setProjects([]);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    if (fetchError) {
      logger.error('Project fetch failed', { error: fetchError.message });
      setError(fetchError.message);
      setLoading(false);
      return;
    }
    setProjects((data ?? []) as Project[]);
    setLoading(false);
  }, [userId]);

  // Initial + on-user-change fetch
  React.useEffect(() => { void refresh(); }, [refresh]);

  const create = React.useCallback(async (input: NewProject): Promise<Project | null> => {
    if (!userId) {
      setError('No user to create project for');
      return null;
    }
    const row = {
      user_id: userId,
      name: input.name.trim(),
      description: input.description ?? null,
      tags: input.tags ?? null,
      stage: input.stage ?? 'idea',
      chosen_idea_id: input.chosen_idea_id ?? null,
    };
    const { data, error: insertError } = await supabase
      .from('projects')
      .insert(row)
      .select('*')
      .single();
    if (insertError || !data) {
      logger.error('Project create failed', { error: insertError?.message });
      setError(insertError?.message ?? 'Project create failed');
      return null;
    }
    const project = data as Project;
    setProjects(prev => [project, ...prev]);
    return project;
  }, [userId]);

  const update = React.useCallback(async (
    id: string,
    patch: Partial<NewProject> & { stage?: ProjectStage; description?: string | null }
  ): Promise<Project | null> => {
    const { data, error: updateError } = await supabase
      .from('projects')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (updateError || !data) {
      logger.error('Project update failed', { id, error: updateError?.message });
      setError(updateError?.message ?? 'Project update failed');
      return null;
    }
    const project = data as Project;
    setProjects(prev => prev.map(p => p.id === id ? project : p));
    return project;
  }, []);

  const archive = React.useCallback(async (id: string): Promise<boolean> => {
    const result = await update(id, { stage: 'archived' });
    return !!result;
  }, [update]);

  const remove = React.useCallback(async (id: string): Promise<boolean> => {
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (deleteError) {
      logger.error('Project delete failed', { id, error: deleteError.message });
      setError(deleteError.message);
      return false;
    }
    setProjects(prev => prev.filter(p => p.id !== id));
    return true;
  }, []);

  const byId = React.useCallback((id: string | null): Project | null => {
    if (!id) return null;
    return projects.find(p => p.id === id) ?? null;
  }, [projects]);

  return { projects, loading, error, refresh, create, update, archive, remove, byId };
}
