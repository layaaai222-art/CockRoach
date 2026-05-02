import React from 'react';
import { logger } from '../lib/logger';

export interface SessionTokens {
  prompt: number;
  completion: number;
}

export interface ChatApiMessage {
  role: string;
  content: string;
}

interface StreamOptions {
  messages: ChatApiMessage[];
  temperature?: number;
  onChunk: (text: string) => void;
  /** Best-effort identifying fields passed to /api/chat for cost tracking. */
  userId?: string | null;
  chatId?: string | null;
  projectId?: string | null;
}

/**
 * Streams a chat completion through /api/chat and accumulates token usage.
 * The Azure credentials live server-side; this hook never sees an API key.
 *
 * Cancel behavior: call `cancel()` (or unmount the hook) to abort an
 * in-flight stream. This aborts the fetch, which closes the connection to
 * /api/chat, which closes Azure's upstream stream — stops billing
 * immediately for the completion portion.
 */
export function useAzureChat() {
  const [sessionTokens, setSessionTokens] = React.useState<SessionTokens>({ prompt: 0, completion: 0 });
  const [isStreaming, setIsStreaming] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  const cancel = React.useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const streamResponse = React.useCallback(async ({ messages, temperature = 0.7, onChunk, userId, chatId, projectId }: StreamOptions): Promise<string> => {
    // Abort any prior in-flight stream — only one generation at a time
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsStreaming(true);

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, temperature, userId, chatId, projectId }),
        signal: controller.signal,
      });

      if (!resp.ok) {
        let message = resp.statusText;
        try {
          const err = await resp.json();
          message = err?.error ?? message;
        } catch { /* non-json */ }
        throw new Error(`Chat API error: ${message}`);
      }

      if (!resp.body) throw new Error('Chat API returned no body');
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') continue;
          try {
            const parsed = JSON.parse(raw);
            const delta: string = parsed.choices?.[0]?.delta?.content ?? '';
            if (delta) {
              full += delta;
              onChunk(full);
            }
            if (parsed.usage) {
              setSessionTokens(prev => ({
                prompt: prev.prompt + (parsed.usage.prompt_tokens ?? 0),
                completion: prev.completion + (parsed.usage.completion_tokens ?? 0),
              }));
            }
          } catch (e) {
            logger.debug('Skipping malformed SSE chunk', { raw, error: (e as Error).message });
          }
        }
      }
      return full;
    } catch (e) {
      if ((e as Error).name === 'AbortError') {
        logger.debug('Chat stream aborted by user');
        return '';
      }
      throw e;
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  // Cancel any in-flight stream on unmount
  React.useEffect(() => () => abortRef.current?.abort(), []);

  return { sessionTokens, streamResponse, isStreaming, cancel };
}
