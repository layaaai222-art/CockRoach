import React from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import type { UserProfile } from '../store';

interface Args {
  currentUser: UserProfile | null;
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  setCurrentPage: (page: 'chat' | 'settings' | 'research' | 'memory' | 'projects') => void;
  setSharedChatBanner: (msg: string | null) => void;
}

const SHARE_WINDOW_DAYS = 30;

export function useShareLink({
  currentUser,
  activeChatId,
  setActiveChatId,
  setCurrentPage,
  setSharedChatBanner,
}: Args) {
  const [shareLink, setShareLink] = React.useState<string | null>(null);

  const createOrGetLink = React.useCallback(async () => {
    if (!activeChatId) return;
    const nowIso = new Date().toISOString();
    const expiryIso = new Date(Date.now() + SHARE_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();

    const { data: existing } = await supabase
      .from('chats')
      .select('share_token, share_expires_at, share_revoked_at')
      .eq('id', activeChatId)
      .single();

    const isActive = existing?.share_token
      && !existing.share_revoked_at
      && (!existing.share_expires_at || existing.share_expires_at > nowIso);

    let token: string;
    if (isActive && existing?.share_token) {
      token = existing.share_token;
    } else {
      token = crypto.randomUUID();
      await supabase.from('chats').update({
        share_token: token,
        share_expires_at: expiryIso,
        share_revoked_at: null,
      }).eq('id', activeChatId);
    }

    const link = `${window.location.origin}${window.location.pathname}?shared=${token}`;
    setShareLink(link);
    await navigator.clipboard.writeText(link).catch(() => { /* clipboard unavailable */ });
    toast.success(`Share link copied — valid for ${SHARE_WINDOW_DAYS} days.`);
  }, [activeChatId]);

  const revokeLink = React.useCallback(async () => {
    if (!activeChatId) return;
    const { error } = await supabase
      .from('chats')
      .update({ share_revoked_at: new Date().toISOString() })
      .eq('id', activeChatId);
    if (error) {
      toast.error(`Revoke failed: ${error.message}`);
      return;
    }
    setShareLink(null);
    toast.success('Share link revoked.');
  }, [activeChatId]);

  // Handle ?shared=… param on mount: resolve the token to a chat if the link
  // is still active (non-expired, non-revoked).
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedToken = params.get('shared');
    if (!sharedToken || !currentUser) return;

    const nowIso = new Date().toISOString();
    supabase
      .from('chats')
      .select('id, title, user_id, share_expires_at, share_revoked_at')
      .eq('share_token', sharedToken)
      .is('share_revoked_at', null)
      .or(`share_expires_at.is.null,share_expires_at.gt.${nowIso}`)
      .single()
      .then(async ({ data, error }) => {
        if (error || !data) {
          toast.error('Share link expired, revoked, or invalid.');
          logger.warn('Share link lookup failed', { error: error?.message });
          return;
        }
        window.history.replaceState({}, '', window.location.pathname);
        setActiveChatId(data.id);
        setCurrentPage('chat');
        if (data.user_id !== currentUser.id) {
          const { data: owner } = await supabase.from('users').select('name').eq('id', data.user_id).single();
          setSharedChatBanner(`Shared chat from ${owner?.name ?? 'another user'} — "${data.title}"`);
        } else {
          setSharedChatBanner(`Share link active — this is your shared chat "${data.title}"`);
        }
      });
  }, [currentUser, setActiveChatId, setCurrentPage, setSharedChatBanner]);

  return { shareLink, setShareLink, createOrGetLink, revokeLink };
}
