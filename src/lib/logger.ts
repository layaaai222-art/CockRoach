// Tiny centralized logger. Wraps console so we can later pipe to a remote
// service (Sentry, Logflare, etc.) without touching call sites.

type Level = 'debug' | 'info' | 'warn' | 'error';

interface LogRecord {
  level: Level;
  message: string;
  context?: Record<string, unknown>;
  at: string;
}

const isDev = typeof import.meta !== 'undefined' && (import.meta as { env?: { DEV?: boolean } }).env?.DEV;

function emit(record: LogRecord): void {
  const method = record.level === 'debug' ? 'log' : record.level;
  // eslint-disable-next-line no-console
  console[method](`[${record.level}] ${record.message}`, record.context ?? '');
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>): void {
    if (!isDev) return;
    emit({ level: 'debug', message, context, at: new Date().toISOString() });
  },
  info(message: string, context?: Record<string, unknown>): void {
    emit({ level: 'info', message, context, at: new Date().toISOString() });
  },
  warn(message: string, context?: Record<string, unknown>): void {
    emit({ level: 'warn', message, context, at: new Date().toISOString() });
  },
  error(message: string, context?: Record<string, unknown>): void {
    emit({ level: 'error', message, context, at: new Date().toISOString() });
  },
};
