import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  ArrowDown, 
  Terminal, 
  Copy, 
  Check, 
  Code2, 
  Cpu, 
  Zap, 
  Github, 
  Mail,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';

interface HeroSectionProps {
  startAnim?: boolean;
}

export default function HeroSection({ startAnim = true }: HeroSectionProps) {
  const [copied, setCopied] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'profile' | 'capabilities'>('profile');

  const profileData = {
    developer: "Jitendra Yadav",
    title: "Full-Stack & Mobile Engineer",
    location: "India",
    availability: "Immediate / High-Impact Roles",
    coreStack: ["React", "Expo", "Flutter", "Python", "Node.js"],
    databases: ["Firebase", "Supabase", "PostgreSQL"],
    focus: "Crafting scalable products with visceral UI & solid systems."
  };

  const handleCopyProfile = () => {
    navigator.clipboard.writeText(JSON.stringify(profileData, null, 2));
    setCopied(true);
    toast.success("Developer profile copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen bg-[#050505] text-white flex flex-col justify-between pt-28 md:pt-36 pb-12 px-6 sm:px-10 lg:px-16 overflow-hidden selection:bg-red-600/30"
    >
      {/* ── Ambient Background Lighting ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-red-600/[0.08] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-10 -left-20 w-[450px] h-[450px] bg-rose-600/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 -right-20 w-[450px] h-[450px] bg-red-700/[0.05] rounded-full blur-[140px] pointer-events-none" />

      {/* Modern High-Tech Grid Mesh */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%)'
        }}
      />

      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none text-white/[0.012] font-black text-[22vw] whitespace-nowrap tracking-tighter uppercase font-mono z-0">
        ENGINEER
      </div>

      {/* ── Main Content Container ── */}
      <div className="max-w-7xl mx-auto w-full relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Hero Column: Pitch, Headline, Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Status Live Indicator Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md mb-8 hover:border-red-600/40 transition-colors">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-300">
                Available for New Projects & Roles
              </span>
              <span className="hidden sm:inline text-neutral-600 font-mono">|</span>
              <span className="hidden sm:inline text-xs font-mono text-red-500 uppercase tracking-widest font-semibold">
                Full-Stack
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2 mb-6">
              <span className="text-xs font-mono tracking-[0.4em] uppercase text-neutral-500 block">
                Software Architect & Builder
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-[5rem] font-black tracking-tight uppercase leading-[0.95] font-sans">
                BUILDING THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-600">
                  NEXT GENERATION
                </span> <br />
                OF DIGITAL REALITIES.
              </h1>
            </div>

            {/* Subtitle Description */}
            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed max-w-2xl font-light mb-10">
              Hi, I'm <strong className="text-white font-semibold">Jitendra Yadav</strong>. I transform complex engineering challenges into minimalist, ultra-fast web platforms, cross-platform mobile apps, and robust systems.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => scrollToSection('work')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-red-600/30 group"
              >
                <span>Explore Creations</span>
                <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 hover:border-white/20 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.03]"
              >
                <Mail size={16} />
                <span>Let's Connect</span>
              </button>

              <a
                href="https://github.com/jeetucodes"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center p-4 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-colors"
                title="GitHub Profile"
              >
                <Github size={18} />
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-6 sm:gap-10 pt-8 border-t border-white/5 w-full max-w-xl">
              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-white mb-0.5">10+</div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">Modern Techs</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-red-500 mb-0.5">Full-Stack</div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">Web & Mobile</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mb-0.5">100%</div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">Production Code</div>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Interactive Tech Terminal & System HUD */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-3xl bg-[#0c0c0c]/90 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden transition-all duration-500 hover:border-red-600/40 hover:shadow-red-950/20 group">
              
              {/* Terminal Window Header Bar */}
              <div className="flex items-center justify-between px-5 py-4 bg-white/[0.02] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                
                {/* Code Tabs */}
                <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/5">
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('profile')}
                    className={`px-3 py-1 rounded text-[11px] font-mono transition-colors ${
                      activeCodeTab === 'profile' ? 'bg-red-600 text-white font-bold' : 'text-neutral-500 hover:text-white'
                    }`}
                  >
                    profile.ts
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('capabilities')}
                    className={`px-3 py-1 rounded text-[11px] font-mono transition-colors ${
                      activeCodeTab === 'capabilities' ? 'bg-red-600 text-white font-bold' : 'text-neutral-500 hover:text-white'
                    }`}
                  >
                    system.sh
                  </button>
                </div>

                {/* Quick Copy Button */}
                <button
                  type="button"
                  onClick={handleCopyProfile}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Copy Profile JSON"
                >
                  {copied ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                </button>
              </div>

              {/* Terminal Body */}
              <div className="p-6 font-mono text-xs leading-relaxed overflow-x-auto min-h-[340px] flex flex-col justify-between">
                {activeCodeTab === 'profile' ? (
                  <div className="space-y-1.5">
                    <p className="text-neutral-600">// Core developer profile interface</p>
                    <p>
                      <span className="text-purple-400">const</span>{' '}
                      <span className="text-yellow-400">engineer</span>:{' '}
                      <span className="text-blue-400">Developer</span> = {'{'}
                    </p>
                    <p className="pl-4">
                      <span className="text-red-400">name</span>:{' '}
                      <span className="text-emerald-300">"Jitendra Yadav"</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-red-400">role</span>:{' '}
                      <span className="text-emerald-300">"Full-Stack & Mobile Developer"</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-red-400">stack</span>: [
                      <span className="text-cyan-300">"React"</span>,{' '}
                      <span className="text-cyan-300">"Expo"</span>,{' '}
                      <span className="text-cyan-300">"Flutter"</span>,{' '}
                      <span className="text-cyan-300">"Node.js"</span>,{' '}
                      <span className="text-cyan-300">"Python"</span>],
                    </p>
                    <p className="pl-4">
                      <span className="text-red-400">cloud</span>: [
                      <span className="text-amber-300">"Firebase"</span>,{' '}
                      <span className="text-amber-300">"Supabase"</span>],
                    </p>
                    <p className="pl-4">
                      <span className="text-red-400">focus</span>:{' '}
                      <span className="text-emerald-300">"Clean Code & Visceral UX"</span>,
                    </p>
                    <p className="pl-4">
                      <span className="text-red-400">availableForHire</span>:{' '}
                      <span className="text-emerald-400 font-bold">true</span>
                    </p>
                    <p>{'};'}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-neutral-600"># System Telemetry & Environment</p>
                    <p className="text-neutral-400">
                      <span className="text-emerald-400">jitendra@tit:~$</span> ./check-systems.sh
                    </p>
                    <p className="text-neutral-300">
                      [OK] Web Platform Engines: <span className="text-emerald-400">React, TypeScript, Three.js</span>
                    </p>
                    <p className="text-neutral-300">
                      [OK] Mobile Runtimes: <span className="text-emerald-400">Flutter, Expo, Native Build</span>
                    </p>
                    <p className="text-neutral-300">
                      [OK] Server Infrastructure: <span className="text-emerald-400">Node.js, Express, Python</span>
                    </p>
                    <p className="text-neutral-300">
                      [OK] Database Clusters: <span className="text-emerald-400">Firestore, Supabase, Postgres</span>
                    </p>
                    <p className="text-neutral-300">
                      [OK] Latency: <span className="text-yellow-400">18ms (Optimal)</span>
                    </p>
                    <p className="text-emerald-400 mt-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Status: Ready for production deployment
                    </p>
                  </div>
                )}

                {/* Terminal Bottom Status Bar */}
                <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500 select-none">
                  <div className="flex items-center gap-2">
                    <Terminal size={13} className="text-red-500" />
                    <span>bash 5.2</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>UTF-8</span>
                    <span className="text-emerald-400 font-bold">LIVE</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Infinite Ticker ── */}
      <div className="relative z-10 w-full overflow-hidden border-t border-white/5 pt-6 mt-12 select-none pointer-events-none">
        <div className="flex gap-12 font-mono text-xs uppercase tracking-[0.3em] text-neutral-500/60 whitespace-nowrap animate-marquee">
          {Array(4).fill(null).flatMap((_, i) => [
            <span key={`a${i}`}>FULL-STACK DEVELOPMENT</span>,
            <span key={`b${i}`} className="text-red-500">✦</span>,
            <span key={`c${i}`}>MOBILE APP ENGINEERING</span>,
            <span key={`d${i}`} className="text-red-500">✦</span>,
            <span key={`e${i}`}>CLEAN ARCHITECTURE</span>,
            <span key={`f${i}`} className="text-red-500">✦</span>,
            <span key={`g${i}`}>JITENDRA YADAV</span>,
            <span key={`h${i}`} className="text-red-500">✦</span>,
          ])}
        </div>
      </div>
    </section>
  );
}
