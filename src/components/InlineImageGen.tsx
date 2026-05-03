// Inline image-generation control. Rendered below assistant messages
// when the message contains image prompts (`### Prompt A` headings).
// Each prompt gets a Generate button → POSTs to /api/image-gen,
// renders the resulting PNG inline. Optionally saves to project
// artifacts.

import React from 'react';
import { Image as ImageIcon, Download, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface PromptBlock {
  label: string;
  body: string;
  size?: string;
  quality?: string;
}

interface ImageResult {
  b64: string | null;
  url: string | null;
  revised_prompt: string | null;
}

interface Props {
  promptText: string; // full assistant message text
  userId?: string | null;
  chatId?: string | null;
  projectId?: string | null;
}

const SIZE_OPTIONS = ['1024x1024', '1024x1536', '1536x1024', '1024x1792', '1792x1024'] as const;
const QUALITY_OPTIONS = ['low', 'medium', 'high'] as const;

/** Parse assistant output for prompt blocks under headings like `### Prompt A`. */
export function parsePromptBlocks(text: string): PromptBlock[] {
  // Split on level-3 headings that mention "prompt"
  const parts = text.split(/^###\s+(Prompt\s+[^\n]*)$/im);
  if (parts.length < 3) return [];

  const blocks: PromptBlock[] = [];
  for (let i = 1; i < parts.length; i += 2) {
    const label = parts[i].trim();
    const body = parts[i + 1] ?? '';
    // Stop body at the next heading or section (### or ## or "How to iterate")
    const stop = body.search(/^(##|How to iterate)/m);
    const bodyClipped = stop === -1 ? body : body.slice(0, stop);

    const sizeMatch = bodyClipped.match(/\*\*Size:\*\*\s*(\S+)/i);
    const qualMatch = bodyClipped.match(/\*\*Quality:\*\*\s*(\S+)/i);

    // Strip the size/quality lines from the prompt body itself
    const cleanBody = bodyClipped
      .replace(/\*\*Size:\*\*[^\n]*\n?/gi, '')
      .replace(/\*\*Quality:\*\*[^\n]*\n?/gi, '')
      .trim();

    if (cleanBody.length > 20) {
      blocks.push({
        label,
        body: cleanBody,
        size: sizeMatch?.[1],
        quality: qualMatch?.[1],
      });
    }
  }
  return blocks;
}

interface PromptCardProps {
  block: PromptBlock;
  userId?: string | null;
  chatId?: string | null;
  projectId?: string | null;
}

function PromptCard({ block, userId, chatId, projectId }: PromptCardProps) {
  const [size, setSize] = React.useState<string>(block.size && (SIZE_OPTIONS as readonly string[]).includes(block.size) ? block.size : '1024x1024');
  const [quality, setQuality] = React.useState<string>(block.quality && (QUALITY_OPTIONS as readonly string[]).includes(block.quality) ? block.quality : 'medium');
  const [generating, setGenerating] = React.useState(false);
  const [results, setResults] = React.useState<ImageResult[]>([]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const resp = await fetch('/api/image-gen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: block.body, size, quality, n: 1, userId, chatId, projectId }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        toast.error(data?.error ?? `Image gen failed (${resp.status})`);
        return;
      }
      if (Array.isArray(data?.images) && data.images.length > 0) {
        setResults(data.images);
      } else {
        toast.error('No images returned.');
      }
    } catch (e) {
      toast.error(`Image gen failed: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (img: ImageResult, idx: number) => {
    if (!img.b64 && !img.url) return;
    const a = document.createElement('a');
    a.href = img.b64 ? `data:image/png;base64,${img.b64}` : img.url!;
    a.download = `cockroach-${block.label.toLowerCase().replace(/\s+/g, '-')}-${idx + 1}.png`;
    a.click();
  };

  const handleSaveAsArtifact = async (img: ImageResult, idx: number) => {
    if (!projectId) {
      toast.error('Open a project to save artifacts.');
      return;
    }
    if (!img.b64 && !img.url) return;
    const { error } = await supabase.from('project_artifacts').insert({
      project_id: projectId,
      kind: 'memo',
      title: `Image · ${block.label} · v${idx + 1}`,
      content: {
        prompt: block.body,
        size,
        quality,
        b64: img.b64,
        url: img.url,
        revised_prompt: img.revised_prompt,
      },
      version: 1,
      exported_format: null,
    });
    if (error) toast.error(`Save failed: ${error.message}`);
    else toast.success('Saved to project artifacts');
  };

  return (
    <div className="layaa-card bg-card/40 border-border p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">{block.label}</p>
        <div className="flex items-center gap-1.5 text-[10px]">
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="bg-surface-mid border border-border/50 rounded px-1.5 py-0.5 text-foreground"
          >
            {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="bg-surface-mid border border-border/50 rounded px-1.5 py-0.5 text-foreground"
          >
            {QUALITY_OPTIONS.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/40 hover:bg-primary/10 disabled:opacity-50 transition-all rounded"
          >
            {generating ? <Loader2 size={10} className="animate-spin" /> : <ImageIcon size={10} />}
            {generating ? 'Generating' : 'Generate'}
          </button>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{block.body}</p>

      {results.length > 0 && (
        <div className={cn('grid gap-2', results.length === 1 ? 'grid-cols-1' : 'grid-cols-2')}>
          {results.map((img, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-border/40">
              <img
                src={img.b64 ? `data:image/png;base64,${img.b64}` : img.url ?? ''}
                alt={`Generated for ${block.label}`}
                className="w-full h-auto block"
                loading="lazy"
              />
              <div className="absolute top-1.5 right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDownload(img, i)}
                  className="p-1.5 bg-black/60 backdrop-blur-sm text-white hover:bg-black rounded transition-colors"
                  title="Download"
                >
                  <Download size={11} />
                </button>
                {projectId && (
                  <button
                    onClick={() => handleSaveAsArtifact(img, i)}
                    className="p-1.5 bg-black/60 backdrop-blur-sm text-white hover:bg-black rounded transition-colors"
                    title="Save to project"
                  >
                    <Save size={11} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function InlineImageGen({ promptText, userId, chatId, projectId }: Props) {
  const blocks = React.useMemo(() => parsePromptBlocks(promptText), [promptText]);
  if (blocks.length === 0) return null;

  return (
    <div className="space-y-2 mt-3 pt-3 border-t border-border/30">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
        <ImageIcon size={10} className="text-primary" />
        Render any prompt
      </p>
      {blocks.map((block, i) => (
        <PromptCard
          key={`${block.label}-${i}`}
          block={block}
          userId={userId}
          chatId={chatId}
          projectId={projectId}
        />
      ))}
    </div>
  );
}
