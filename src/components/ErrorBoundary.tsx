import React from 'react';
import { logger } from '../lib/logger';

interface Props {
  children: React.ReactNode;
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    logger.error('React render error', { message: error.message, stack: error.stack, componentStack: info.componentStack });
  }

  reset = (): void => this.setState({ error: null });

  render(): React.ReactNode {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.reset);
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0c0c0c] text-foreground p-8">
          <div className="max-w-md w-full bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-destructive">Something broke</h2>
            <p className="text-sm text-muted-foreground font-mono break-words">{this.state.error.message}</p>
            <button
              onClick={this.reset}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:brightness-110"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
