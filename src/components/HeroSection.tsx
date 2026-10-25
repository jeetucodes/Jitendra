import React, { useEffect, useRef, useState } from 'react';
import { 
  ArrowDown, 
  ArrowUpRight, 
  Sparkles, 
  Smartphone, 
  Globe, 
  Cpu, 
  Zap, 
  Github, 
  Mail, 
  Code2,
  Terminal,
  Layers
} from 'lucide-react';
import heroBg from '@/img/kigo-hero-bg.jpg';

interface HeroSectionProps {
  startAnim?: boolean;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotSpeed: number;
  swing: number;
  swingSpeed: number;
  swingAngle: number;
  opacity: number;
  layer: 'bg' | 'fg';
}

export default function HeroSection({ startAnim = true }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Kinetic rotating word index (Kigo Studio style headline)
  const phrases = [
    { prefix: "Make your", highlight: "web fluid.", color: "from-rose-400 via-red-400 to-amber-300" },
    { prefix: "Make your", highlight: "mobile app iconic.", color: "from-emerald-300 via-teal-400 to-cyan-400" },
    { prefix: "Make your", highlight: "architecture scalable.", color: "from-blue-400 via-indigo-400 to-violet-400" },
    { prefix: "Make your", highlight: "workflows automated.", color: "from-amber-300 via-orange-400 to-rose-400" }
  ];
  const [activePhraseIdx, setActivePhraseIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhraseIdx((prev) => (prev + 1) % phrases.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [phrases.length]);

  // Sakura Petals Floating Canvas with Wind Physics
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const numPetals = 42;
    const petals: Petal[] = [];

    for (let i = 0; i < numPetals; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 9 + 8,
        speedY: Math.random() * 0.9 + 0.6,
        speedX: Math.random() * 0.7 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.025,
        swing: Math.random() * 1.5 + 0.5,
        swingSpeed: Math.random() * 0.02 + 0.01,
        swingAngle: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.55 + 0.35,
        layer: Math.random() > 0.4 ? 'fg' : 'bg'
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const normY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      setMousePos({ x: normX, y: normY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Draw single organic sakura petal
    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // Realistic Sakura Petal Path (with slight curve and notch)
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.6, p.size * 0.7, p.size * 0.7, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.7, -p.size * 0.8, -p.size * 0.6, 0, -p.size);
      ctx.closePath();

      // Soft watercolor gradient fill
      const grad = ctx.createRadialGradient(0, -p.size * 0.3, 0, 0, 0, p.size);
      grad.addColorStop(0, `rgba(255, 220, 225, ${p.opacity * 0.95})`);
      grad.addColorStop(0.6, `rgba(244, 114, 182, ${p.opacity * 0.75})`);
      grad.addColorStop(1, `rgba(225, 29, 72, ${p.opacity * 0.4})`);

      ctx.fillStyle = grad;
      ctx.fill();

      // Subtle edge glow
      ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.25})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      if (window.scrollY > window.innerHeight * 1.1) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Mouse influence on horizontal wind drift
      const mouseWind = mousePos.x * 0.7;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        p.swingAngle += p.swingSpeed;
        p.x += p.speedX + Math.sin(p.swingAngle) * p.swing + mouseWind;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        // Wrap around borders
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }

        drawPetal(p);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mousePos.x]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activePhrase = phrases[activePhraseIdx];

  return (
    <section 
      id="home"
      className="relative min-h-screen w-full bg-[#08080c] text-white flex flex-col justify-between overflow-hidden select-none"
    >
      {/* ── ATMOSPHERIC MISTY LANDSCAPE BACKGROUND ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src={heroBg} 
          alt="Misty Japanese Landscape" 
          className="w-full h-full object-cover object-center filter brightness-[0.40] contrast-[1.12] transition-transform duration-700 ease-out"
          style={{
            transform: `translate3d(${mousePos.x * -12}px, ${mousePos.y * -8}px, 0) scale(1.05)`
          }}
        />

        {/* Ambient Dark Atmospheric Vignette & Fog Layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-[#08080c]/50 to-[#08080c]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080c]/70 via-transparent to-[#08080c]/70" />
        
        {/* Soft Sakura & Peach Dawn Glow */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-rose-500/10 rounded-full blur-[140px]"
          style={{
            transform: `translate(calc(-50% + ${mousePos.x * 25}px), calc(-50% + ${mousePos.y * 20}px))`
          }}
        />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[350px] bg-red-600/10 rounded-full blur-[120px]" />
      </div>

      {/* ── INTERACTIVE SAKURA PETALS CANVAS ── */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-10 pointer-events-none" 
      />

      {/* ── TOP HUD BAR (Coordinates & Live Status) ── */}
      <div className="relative z-20 w-full pt-28 px-6 sm:px-12 flex justify-between items-center text-[10px] font-mono tracking-[0.25em] text-white/50">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_#34d399]" />
          <span className="text-white/90 font-medium">STATUS // AVAILABLE FOR WEB & MOBILE PROJECTS</span>
        </div>
        
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline text-white/40">NEW DELHI, INDIA • 28.61° N</span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="px-2 py-0.5 rounded border border-rose-500/30 bg-rose-950/20 text-rose-300/90 text-[9px] font-bold">
            季語 • CRAFT
          </span>
        </div>
      </div>

      {/* ── CENTER STAGE: KINETIC KIGO HEADLINE & MONUMENTAL NAME ── */}
      <div className="relative z-20 container mx-auto px-4 flex-1 flex flex-col items-center justify-center py-6 text-center">
        
        {/* Traditional Japanese Artisan Seal Watermark (Kigo Studio touch) */}
        <div className="hidden lg:flex absolute left-8 xl:left-14 top-1/2 -translate-y-1/2 flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity pointer-events-none">
          <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-rose-500/50 to-rose-500" />
          <span className="text-[12px] font-mono tracking-[0.4em] [writing-mode:vertical-rl] text-rose-300 uppercase">
            職人開発 • ARCHITECT
          </span>
          <div className="w-6 h-6 rounded border border-rose-500/50 flex items-center justify-center text-[10px] text-rose-400 font-bold bg-rose-950/40 shadow-sm">
            印
          </div>
          <div className="w-[1px] h-14 bg-gradient-to-t from-transparent via-rose-500/50 to-rose-500" />
        </div>

        {/* Right HUD Coordinate Column */}
        <div className="hidden lg:flex absolute right-8 xl:right-14 top-1/2 -translate-y-1/2 flex-col items-center gap-3 opacity-40 pointer-events-none text-[9px] font-mono text-white/40 tracking-[0.3em] [writing-mode:vertical-rl]">
          <span>REACT × FLUTTER × NODE.JS</span>
          <span className="text-rose-500">✦</span>
          <span>FULL-STACK CRAFTSMANSHIP</span>
        </div>

        {/* Top Kicker Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-4 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span className="text-[11px] font-mono tracking-[0.25em] text-white/80 uppercase">
            Full-Stack Web & Cross-Platform Mobile Engineer
          </span>
        </div>

        {/* ── KIGO STUDIO KINETIC ANIMATED HEADLINE ── */}
        <div className="h-14 sm:h-16 md:h-20 flex items-center justify-center overflow-hidden mb-2">
          <div 
            key={activePhraseIdx} 
            className="animate-in fade-in slide-in-from-bottom-3 duration-500 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
          >
            <span className="text-white/70 font-light">{activePhrase.prefix}</span>
            <span className={`bg-gradient-to-r ${activePhrase.color} bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(244,63,94,0.35)]`}>
              {activePhrase.highlight}
            </span>
          </div>
        </div>

        {/* ── MONUMENTAL BRAND NAME ── */}
        <div className="relative my-1 select-none">
          <h1 className="font-anton uppercase tracking-tight leading-[0.85] text-[15vw] sm:text-[13vw] md:text-[8.5rem] lg:text-[10.5rem] flex flex-col items-center">
            {/* JITENDRA - Solid Luminous White */}
            <span 
              className="bg-gradient-to-b from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
              style={{
                transform: `perspective(1000px) rotateX(${mousePos.y * -2.5}deg) rotateY(${mousePos.x * 3.5}deg)`
              }}
            >
              JITENDRA
            </span>
            
            {/* YADAV - Hollow Glowing Sakura Rose Outline */}
            <span 
              className="text-transparent"
              style={{
                WebkitTextStroke: '2px rgba(244, 63, 94, 0.9)',
                textShadow: '0 0 45px rgba(244, 63, 94, 0.4), 0 0 90px rgba(244, 63, 94, 0.15)',
                transform: `perspective(1000px) rotateX(${mousePos.y * -2.5}deg) rotateY(${mousePos.x * 3.5}deg)`
              }}
            >
              YADAV
            </span>
          </h1>
        </div>

        {/* Description / Mission */}
        <p className="max-w-2xl text-sm sm:text-base md:text-lg text-white/70 font-light mt-3 mb-8 leading-relaxed tracking-wide px-4">
          Architecting high-concurrency web applications, cross-platform mobile apps, and scalable backends. Built with precision, performance, and aesthetic artistry.
        </p>

        {/* ── 3D INTERACTIVE CARDS: WEB & MOBILE (Kigo Poster Inspired) ── */}
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
          
          {/* Card 1: Web Ecosystem */}
          <div 
            onClick={() => scrollToSection('work')}
            className="group relative p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-rose-500/40 backdrop-blur-xl transition-all duration-300 cursor-pointer shadow-xl overflow-hidden"
            style={{
              transform: `perspective(800px) rotateY(${mousePos.x * 4}deg) rotateX(${-mousePos.y * 3}deg)`
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-white tracking-wide">Web Applications</span>
              </div>
              <span className="text-[10px] font-mono text-rose-400/80 group-hover:translate-x-1 transition-transform">
                Explore ↗
              </span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed mb-3">
              Production-ready web apps with React, TypeScript, Three.js & responsive fluid design.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['React', 'TypeScript', 'Three.js', 'Vite'].map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[9px] font-mono text-white/70">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Card 2: Mobile Ecosystem */}
          <div 
            onClick={() => scrollToSection('work')}
            className="group relative p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-500/40 backdrop-blur-xl transition-all duration-300 cursor-pointer shadow-xl overflow-hidden"
            style={{
              transform: `perspective(800px) rotateY(${mousePos.x * 4}deg) rotateX(${-mousePos.y * 3}deg)`
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-white tracking-wide">Mobile Apps</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400/80 group-hover:translate-x-1 transition-transform">
                Explore ↗
              </span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed mb-3">
              Cross-platform iOS & Android mobile apps published on Google Play Store with Flutter & Expo.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['Flutter', 'Expo', 'Play Store', 'Firebase'].map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[9px] font-mono text-white/70">
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* ── DUAL ACTION CTAS & SOCIAL LINKS ── */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 z-20">
          {/* Primary CTA */}
          <button
            onClick={() => scrollToSection('work')}
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold text-xs sm:text-sm tracking-wider uppercase overflow-hidden shadow-[0_0_35px_rgba(244,63,94,0.35)] hover:shadow-[0_0_55px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Projects
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Secondary CTA */}
          <button
            onClick={() => scrollToSection('contact')}
            className="group px-8 py-4 rounded-full bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-white/30 text-white/90 font-medium text-xs sm:text-sm tracking-wider uppercase backdrop-blur-xl transition-all duration-300 flex items-center gap-2.5 active:scale-95"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </button>

          {/* Social Links */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <a 
              href="https://github.com/jeetucodes" 
              target="_blank" 
              rel="noreferrer"
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="mailto:jy37934@gmail.com" 
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="Email Jitendra"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

      {/* ── CINEMATIC INFINITE TICKER STRIP ── */}
      <div className="relative z-20 w-full border-t border-white/[0.08] bg-black/60 backdrop-blur-md overflow-hidden py-3">
        <div className="flex whitespace-nowrap animate-marquee text-[10px] font-mono tracking-[0.35em] text-white/40 select-none">
          {Array(4).fill(null).map((_, i) => (
            <span key={i} className="flex items-center gap-8 mx-4">
              <span>JITENDRA YADAV</span>
              <span className="text-rose-500">✦</span>
              <span>FULL-STACK ARCHITECT</span>
              <span className="text-rose-500">✦</span>
              <span>WEB & MOBILE SPECIALIST</span>
              <span className="text-rose-500">✦</span>
              <span>REACT • FLUTTER • THREE.JS</span>
              <span className="text-rose-500">✦</span>
              <span>NODE.JS • PYTHON • FIREBASE</span>
              <span className="text-rose-500">✦</span>
              <span>KIGO-INSPIRED CRAFTSMANSHIP</span>
              <span className="text-rose-500">✦</span>
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
