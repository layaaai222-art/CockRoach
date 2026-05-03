import {StrictMode, lazy, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Phase 3 routing prep — at launch the marketing site lives at `/`,
// chat at `/app`, privacy/terms at `/privacy` / `/terms`.
// Gate is opt-in via VITE_MARKETING_ROUTING=true so the dev workflow
// stays chat-only until launch flip.
const MarketingLanding = lazy(() => import('./components/MarketingLanding.tsx'));
const StaticDoc = lazy(() => import('./components/StaticDoc.tsx'));

function Root() {
  const useMarketing = import.meta.env.VITE_MARKETING_ROUTING === 'true';
  if (!useMarketing) return <App />;

  const path = window.location.pathname;
  if (path === '/' || path === '/index.html') {
    return (
      <Suspense fallback={<div className="min-h-[100dvh] bg-zinc-950" />}>
        <MarketingLanding />
      </Suspense>
    );
  }
  if (path === '/privacy') {
    return (
      <Suspense fallback={<div className="min-h-[100dvh] bg-zinc-950" />}>
        <StaticDoc slug="privacy" />
      </Suspense>
    );
  }
  if (path === '/terms') {
    return (
      <Suspense fallback={<div className="min-h-[100dvh] bg-zinc-950" />}>
        <StaticDoc slug="terms" />
      </Suspense>
    );
  }
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </StrictMode>,
);
