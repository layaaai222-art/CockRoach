// Public marketing landing page for cockroach.layaa.ai (or wherever
// the final domain lands). Phase 3 will route `/` here and `/app` to
// the chat. For now this component is built but not wired into the
// router — opt in via VITE_MARKETING_AT_ROOT=true to preview.

import { ArrowRight, Sparkles, Brain, Compass, Zap, Lock, Activity } from 'lucide-react';

const FEATURES = [
  { icon: Brain,    title: 'Strategic memory',    body: 'Your founder profile, decisions, and project context follow every conversation. The agent doesn\'t forget who you are.' },
  { icon: Sparkles, title: 'Auto-routes the right skill', body: '21 specialized modes. Pricing, GTM, paid ads, fundraising, vibe coding, image generation — Cockroach picks the right tool for each question.' },
  { icon: Compass,  title: '9 frameworks built-in', body: 'Hormozi Value Equation. ACP diagnostic. Lean Canvas. Dream 100. Run any of them on your project in one click.' },
  { icon: Zap,      title: 'Build in seconds',     body: 'Sketch a landing page, prototype a tool, or generate a hero image inline. Live preview, version history, save to project.' },
  { icon: Activity, title: 'Decision log',         body: 'Bezos one-way / two-way doors built into the workflow. Pre-mortems and revisit timers keep you honest.' },
  { icon: Lock,     title: 'Yours, private',       body: 'Your project context never trains anyone\'s model. End-to-end encrypted in transit. We pay for our own egress.' },
];

export default function MarketingLanding() {
  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-100 antialiased">
      {/* Nav */}
      <nav className="border-b border-white/5 backdrop-blur sticky top-0 z-30 bg-zinc-950/70">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#8B1414] flex items-center justify-center font-bold">C</div>
            <span className="text-[14px] font-bold tracking-tight">CockRoach</span>
            <span className="text-[10px] text-zinc-500 ml-1">by Layaa AI</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/privacy" className="text-[12px] text-zinc-400 hover:text-zinc-100 px-3 py-1.5">Privacy</a>
            <a href="/terms" className="text-[12px] text-zinc-400 hover:text-zinc-100 px-3 py-1.5">Terms</a>
            <a href="/app" className="text-[12px] font-bold bg-[#8B1414] hover:bg-[#7a1212] text-white px-4 py-1.5 rounded-md transition-colors">
              Open the app →
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#cc2222] bg-[#8B1414]/10 border border-[#8B1414]/30 rounded-full px-3 py-1 mb-6">
          <Sparkles size={11} /> AI-native co-pilot for founders
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
          Not a unicorn.<br/>
          <span className="text-[#cc2222]">Better.</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
          CockRoach is a strategic intelligence platform that thinks alongside you on every part of building a company. From idea to launch to scale — one workspace, one persistent memory, every framework you need.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a href="/app" className="inline-flex items-center gap-2 bg-[#8B1414] hover:bg-[#7a1212] text-white px-6 py-3 rounded-lg font-bold transition-colors">
            Start free <ArrowRight size={14} />
          </a>
          <a href="#features" className="inline-flex items-center gap-2 border border-white/15 hover:border-white/30 text-zinc-200 px-6 py-3 rounded-lg font-bold transition-colors">
            See how it works
          </a>
        </div>
        <p className="text-[11px] text-zinc-500 mt-4">5 chats / month free · Pro $29/mo unlocks everything</p>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="border border-white/8 hover:border-white/15 rounded-xl p-5 bg-zinc-900/50 transition-colors">
                <Icon size={18} className="text-[#cc2222] mb-3" />
                <h3 className="text-base font-bold mb-1.5">{f.title}</h3>
                <p className="text-[13px] text-zinc-400 leading-relaxed">{f.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to stop tab-switching?</h2>
        <p className="text-zinc-400 max-w-xl mx-auto mb-6">
          One workspace for every part of building your company. Your strategic memory follows the work.
        </p>
        <a href="/app" className="inline-flex items-center gap-2 bg-[#8B1414] hover:bg-[#7a1212] text-white px-6 py-3 rounded-lg font-bold transition-colors">
          Try CockRoach free <ArrowRight size={14} />
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-[11px] text-zinc-500">
          <span>© {new Date().getFullYear()} Layaa AI · CockRoach</span>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-zinc-300">Privacy</a>
            <a href="/terms" className="hover:text-zinc-300">Terms</a>
            <a href="mailto:hello@layaa.ai" className="hover:text-zinc-300">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
