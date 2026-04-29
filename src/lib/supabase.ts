import { createClient } from '@supabase/supabase-js';

// Env shape (browser): VITE_SUPABASE_URL is required; the publishable key
// has two acceptable names — the new Supabase format `VITE_SUPABASE_PUBLISHABLE_KEY`
// (sb_publishable_…) and the legacy `VITE_SUPABASE_ANON_KEY` (JWT). Either
// works at the SDK level; we read whichever is set.
interface ViteEnv {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  VITE_SUPABASE_ANON_KEY?: string;
}

const env = (import.meta as unknown as { env: ViteEnv }).env;

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase URL or key is missing. Set VITE_SUPABASE_URL and ' +
    'VITE_SUPABASE_PUBLISHABLE_KEY (preferred) or VITE_SUPABASE_ANON_KEY ' +
    '(legacy) in your environment.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder',
);
