// LivePreview — sandboxed iframe rendering ```preview``` blocks
// emitted by the VIBE_CODING mode. Includes:
//   - Sandboxed iframe via srcdoc (no parent-page access)
//   - Open-in-new-tab using a blob URL
//   - Download as .html
//   - Save to project artifacts (versioned)
//   - Toggle View Code / Visual

import React from 'react';
import { Download, Save, Code2, ExternalLink, Smartphone, Monitor, Tablet, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface Props {
  htmlContent: string;
  title?: string;
  projectId?: string | null;
}

type Device = 'mobile' | 'tablet' | 'desktop';
const DEVICE_WIDTHS: Record<Device, string> = {
  mobile: '375px',
  tablet: '768px',
  desktop: '100%',
};

/**
 * Extract the inside of the first ```preview ... ``` fenced block.
 * Returns null if the block isn't found.
 */
export function extractPreviewBlock(text: string): string | null {
  const match = text.match(/```preview\s*\n([\s\S]+?)\n```/);
  if (match) return match[1];
  // Fallback: if the agent uses ```html instead, accept that too.
  const fallback = text.match(/```html\s*\n([\s\S]+?)\n```/);
  return fallback ? fallback[1] : null;
}

export default function LivePreview({ htmlContent, title, projectId }: Props) {
  const [view, setView] = React.useState<'visual' | 'code'>('visual');
  const [device, setDevice] = React.useState<Device>('desktop');
  const [iframeKey, setIframeKey] = React.useState(0);

  // Use a blob URL so the iframe document gets a unique origin
  // (cleaner than srcdoc for CDN script loading; still isolated from
  // the parent app's localStorage / cookies).
  const blobUrl = React.useMemo(() => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    return URL.createObjectURL(blob);
  }, [htmlContent]);

  React.useEffect(() => {
    return () => { URL.revokeObjectURL(blobUrl); };
  }, [blobUrl]);

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title || 'cockroach-app').replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success('Downloaded');
  };

  const handleOpenInNewTab = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank', 'noopener,noreferrer');
    if (!w) toast.error('Pop-up blocked — allow pop-ups to preview in a new tab.');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const handleSaveArtifact = async () => {
    if (!projectId) {
      toast.error('Open a project to save artifacts.');
      return;
    }
    // Look up the most recent vibe-coding artifact for this project so we
    // can version-link the new save.
    const { data: existing } = await supabase
      .from('project_artifacts')
      .select('id, version, parent_artifact_id')
      .eq('project_id', projectId)
      .eq('kind', 'memo')
      .ilike('title', `%${title || 'Vibe app'}%`)
      .order('version', { ascending: false })
      .limit(1);

    const prev = existing?.[0];
    const nextVersion = (prev?.version ?? 0) + 1;
    const parentId = prev?.parent_artifact_id ?? prev?.id ?? null;

    const { error } = await supabase.from('project_artifacts').insert({
      project_id: projectId,
      kind: 'memo',
      title: `${title || 'Vibe app'} · v${nextVersion}`,
      content: { html: htmlContent, kind: 'vibe_app' },
      version: nextVersion,
      parent_artifact_id: parentId,
      exported_format: 'md',
    });
    if (error) toast.error(`Save failed: ${error.message}`);
    else toast.success(`Saved as v${nextVersion}`);
  };

  return (
    <div className="layaa-card bg-card/50 border-border overflow-hidden mt-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border/40 bg-surface-mid/30">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setView('visual')}
            className={cn(
              'flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded transition-all',
              view === 'visual' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Monitor size={11} /> Visual
          </button>
          <button
            onClick={() => setView('code')}
            className={cn(
              'flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded transition-all',
              view === 'code' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Code2 size={11} /> Code
          </button>
        </div>

        <div className="flex items-center gap-1">
          {view === 'visual' && (
            <>
              <div className="flex items-center gap-0.5 mr-1.5 border-r border-border/40 pr-1.5">
                {(['mobile', 'tablet', 'desktop'] as const).map(d => {
                  const Icon = d === 'mobile' ? Smartphone : d === 'tablet' ? Tablet : Monitor;
                  return (
                    <button
                      key={d}
                      onClick={() => setDevice(d)}
                      className={cn(
                        'p-1 rounded transition-colors',
                        device === d ? 'bg-primary/10 text-primary' : 'text-muted-foreground/60 hover:text-foreground',
                      )}
                      title={d}
                    >
                      <Icon size={11} />
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setIframeKey(k => k + 1)}
                className="p-1 text-muted-foreground/60 hover:text-foreground transition-colors rounded"
                title="Reload"
              >
                <RefreshCw size={11} />
              </button>
            </>
          )}
          <button
            onClick={handleOpenInNewTab}
            className="p-1 text-muted-foreground/60 hover:text-foreground transition-colors rounded"
            title="Open in new tab"
          >
            <ExternalLink size={11} />
          </button>
          <button
            onClick={handleDownload}
            className="p-1 text-muted-foreground/60 hover:text-foreground transition-colors rounded"
            title="Download .html"
          >
            <Download size={11} />
          </button>
          {projectId && (
            <button
              onClick={handleSaveArtifact}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/40 hover:bg-primary/10 transition-all rounded"
              title="Save as versioned artifact"
            >
              <Save size={11} /> Save
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      {view === 'visual' ? (
        <div className="bg-zinc-950 flex justify-center overflow-x-auto p-3">
          <iframe
            key={iframeKey}
            // Sandbox without allow-same-origin gives a unique origin —
            // can't read our cookies/localStorage. allow-scripts is needed
            // for React/Babel to execute. Using a blob URL (vs srcdoc)
            // because some CDN bundles (Tailwind) misbehave inside
            // srcdoc-rooted iframes.
            sandbox="allow-scripts allow-forms allow-popups allow-modals"
            src={blobUrl}
            title="Live preview"
            style={{ width: DEVICE_WIDTHS[device], height: '600px', border: 0, background: '#fff' }}
            className="rounded-md shadow-lg"
          />
        </div>
      ) : (
        <pre className="text-[11px] text-muted-foreground bg-surface-mid/20 p-4 overflow-x-auto max-h-[600px] layaa-scroll">
          <code>{htmlContent}</code>
        </pre>
      )}
    </div>
  );
}
