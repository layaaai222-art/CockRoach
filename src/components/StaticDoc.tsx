// Renders a public legal document (privacy / terms) from
// /public/legal/{slug}.md. Lightweight markdown rendering with a
// minimal styled wrapper.

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  slug: 'privacy' | 'terms';
}

export default function StaticDoc({ slug }: Props) {
  const [body, setBody] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch(`/legal/${slug}.md`).then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    }).then(text => {
      if (!cancelled) setBody(text);
    }).catch(e => {
      if (!cancelled) setError(e instanceof Error ? e.message : String(e));
    });
    return () => { cancelled = true; };
  }, [slug]);

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-100">
      <nav className="border-b border-white/5 sticky top-0 z-30 bg-zinc-950/70 backdrop-blur">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors">
            <ArrowLeft size={14} />
            <span className="text-[12px]">Back to home</span>
          </a>
          <a href="/app" className="text-[12px] font-bold bg-[#8B1414] hover:bg-[#7a1212] text-white px-3 py-1.5 rounded-md transition-colors">
            Open the app →
          </a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {error ? (
          <div className="text-zinc-400">
            <p className="text-lg font-bold mb-2">Couldn't load document</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <article className="prose prose-invert prose-zinc max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-xl prose-h2:mt-8 prose-p:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-zinc-100 prose-code:text-[#cc2222] prose-a:text-[#cc2222] prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
          </article>
        )}
      </main>
    </div>
  );
}
