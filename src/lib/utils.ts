import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely copy text to clipboard with iOS Safari + insecure-context
 * fallbacks. Returns true on success.
 *
 * navigator.clipboard.writeText is undefined on iOS in non-https
 * contexts and throws on permission errors elsewhere; the textarea
 * fallback works almost everywhere when triggered by a user gesture.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch { /* fall through to legacy path */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Strategy-based LLM Provider Detection
 * Detects provider from key prefix or endpoint
 */
export function detectProvider(apiKey: string, baseUrl?: string): string {
  if (baseUrl?.includes('localhost') || baseUrl?.includes('ollama')) return 'ollama';
  if (apiKey.startsWith('sk-ant-')) return 'anthropic';
  if (apiKey.startsWith('sk-')) return 'openai';
  if (apiKey.startsWith('gsk_')) return 'groq';
  // Add more patterns as needed
  return 'unknown';
}
