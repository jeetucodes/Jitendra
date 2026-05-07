import React, { useEffect, useRef, useState } from 'react';
import p1 from '@/img/p1.png';
import p3 from '@/img/p3.png';
import { Code2, Smartphone, Apple, Globe, Cpu } from 'lucide-react';

interface HeroSectionProps {
  startAnim?: boolean;
}

export default function HeroSection({ startAnim = false }: HeroSectionProps) {
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const p1Ref = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);
  const tiltWrapRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const revealRef = useRef(0);
  const animId = useRef<number>();
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);
  const waveTimeRef = useRef(0);

  // Film grain
  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let id: number;
    const draw = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const img = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 18;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 14;
      }
      ctx.putImageData(img, 0, 0);
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  }, []);

  // Main loop
  useEffect(() => {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = window.innerWidth / 2;
    let curY = window.innerHeight / 2;
    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    let isHov = false;

    let cachedRect = { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    const updateRect = () => {
      if (imageWrapperRef.current) {
        cachedRect = imageWrapperRef.current.getBoundingClientRect();
      }
    };
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);
    // Initial call
    setTimeout(updateRect, 100);

    const loop = () => {
      curX += (targetX - curX) * 0.2;
      curY += (targetY - curY) * 0.2;
      ringX += (targetX - ringX) * 0.08;
      ringY += (targetY - ringY) * 0.08;

      const targetR = isHov ? 240 : 0;
      revealRef.current += (targetR - revealRef.current) * 0.07;
      const r = revealRef.current;

      if (cursorDotRef.current)
        cursorDotRef.current.style.transform = `translate3d(${curX}px,${curY}px,0) translate(-50%,-50%)`;
      if (cursorRingRef.current)
        cursorRingRef.current.style.transform = `translate3d(${ringX}px,${ringY}px,0) translate(-50%,-50%)`;

      // 3D tilt
      if (tiltWrapRef.current) {
        const nx = (curX - window.innerWidth / 2) / (window.innerWidth / 2);
        const ny = (curY - window.innerHeight / 2) / (window.innerHeight / 2);
        tiltWrapRef.current.style.transform = `perspective(900px) rotateX(${-ny * 7}deg) rotateY(${nx * 10}deg) scale3d(1.02,1.02,1.02)`;
      }

      if (imageWrapperRef.current && p1Ref.current && glowRef.current) {
        const rect = cachedRect;
        const relX = curX - rect.left;
        const relY = curY - rect.top;

        const mask = `radial-gradient(circle ${r}px at ${relX}px ${relY}px, black 0%, black 50%, transparent 85%)`;
        p1Ref.current.style.webkitMaskImage = mask;
        p1Ref.current.style.maskImage = mask;

        const gO = Math.min(r / 240, 1);
        glowRef.current.style.background = r > 4
          ? `radial-gradient(circle ${r * 0.8}px at ${relX}px ${relY}px, rgba(220,38,38,${gO * 0.4}) 0%, rgba(220,38,38,${gO * 0.1}) 60%, transparent 100%)`
          : 'none';

        // 3D side-wave rings
        const wc = waveCanvasRef.current;
        if (wc) {
          const w = Math.round(rect.width);
          const h = Math.round(rect.height);
          if (wc.width !== w || wc.height !== h) {
            wc.width = w;
            wc.height = h;
          }
          const ctx = wc.getContext('2d')!;
          ctx.clearRect(0, 0, wc.width, wc.height);
          waveTimeRef.current += 0.04;
          const t = waveTimeRef.current;
          if (r > 8) {
            for (let i = 0; i < 5; i++) {
              const phase = (t - i * 0.55) % (Math.PI * 2);
              const expand = (Math.sin(phase) + 1) / 2;
              const ringR = r + expand * 55 + i * 14;
              const alpha = (1 - expand) * 0.55 * gO * (1 - i / 5);
              if (alpha < 0.01) continue;
              ctx.save();
              ctx.translate(relX, relY);
              ctx.beginPath();
              const steps = 120;
              for (let s = 0; s <= steps; s++) {
                const angle = (s / steps) * Math.PI * 2;
                const wave = Math.sin(angle * (3 + i) + t * 2 + i) * (8 + i * 3);
                const rx = (ringR + wave) * Math.cos(angle);
                const ry = (ringR + wave * 0.4) * Math.sin(angle);
                s === 0 ? ctx.moveTo(rx, ry) : ctx.lineTo(rx, ry);
              }
              ctx.closePath();
              ctx.strokeStyle = `hsla(${i * 12},100%,60%,${alpha})`;
              ctx.lineWidth = i === 0 ? 2.5 : 1.2;
              ctx.shadowColor = `hsla(${i * 12},100%,60%,0.6)`;
              ctx.shadowBlur = i === 0 ? 12 : 6;
              ctx.stroke();
              ctx.shadowBlur = 0;
              ctx.restore();
            }
          }
        }
      }

      animId.current = requestAnimationFrame(loop);
    };
    loop();

    const onMove = (e: MouseEvent) => { targetX = e.clientX; targetY = e.clientY; };
    const onEnter = () => { isHov = true; setIsHovered(true); };
    const onLeave = () => { isHov = false; setIsHovered(false); };
    const onWinLeave = () => {
      if (tiltWrapRef.current)
        tiltWrapRef.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onWinLeave);
    const el = imageWrapperRef.current;
    el?.addEventListener('mouseenter', onEnter);
    el?.addEventListener('mouseleave', onLeave);

    const initGSAP = async () => {
      try {
        const gsapModule = await import('gsap');
        const gsap: any = gsapModule.default || gsapModule;
        
        if (startAnim) {
          gsap.fromTo('.hero-name-char', 
            { opacity: 0, y: 100, rotateX: -90, filter: 'blur(20px)' },
            { 
              opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
              duration: 1.2, 
              stagger: 0.08, 
              ease: 'power4.out',
            }
          );
          
          gsap.fromTo('.hero-subtitle',
            { opacity: 0, scaleX: 0 },
            { opacity: 1, scaleX: 1, duration: 1.5, ease: 'expo.out', delay: 1 }
          );
        }
      } catch (e) {
        console.error(e);
      }
    };
    initGSAP();

    return () => {
      cancelAnimationFrame(animId.current!);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onWinLeave);
      el?.removeEventListener('mouseenter', onEnter);
      el?.removeEventListener('mouseleave', onLeave);
    };
  }, [startAnim]);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] cursor-none select-none"
    >
      <style>{`
        @keyframes ambientPulse {
          0%,100% { opacity:0.15; transform:scale(1); }
          50% { opacity:0.3; transform:scale(1.06); }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(20px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity:0; transform:translateX(-20px); }
          to { opacity:1; transform:translateX(0); }
        }
        @keyframes scaleYPulse {
          0%,100% { transform:scaleY(0.3); opacity:0.3; }
          50% { transform:scaleY(1); opacity:1; }
        }
        @keyframes ghostFloat {
          0%,100% { opacity:0.25; transform:translate(-50%,-50%) scale(1); }
          50% { opacity:0.45; transform:translate(-50%,-52%) scale(1.03); }
        }
        @keyframes borderGlow {
          0%,100% { box-shadow:0 0 12px rgba(220,38,38,0.08); }
          50% { box-shadow:0 0 28px rgba(220,38,38,0.22); }
        }
        @keyframes tickerScroll {
          from { transform:translateX(0); }
          to { transform:translateX(-50%); }
        }
        .anim-1 { animation:fadeSlideUp 0.5s cubic-bezier(0.2,0.8,0.2,1) 0.05s both; }
        .anim-2 { animation:fadeSlideUp 0.5s cubic-bezier(0.2,0.8,0.2,1) 0.1s both; }
        .anim-4 { animation:fadeSlideUp 0.5s cubic-bezier(0.2,0.8,0.2,1) 0.35s both; }
        .anim-l { animation:fadeSlideLeft 0.5s cubic-bezier(0.2,0.8,0.2,1) 0.1s both; }
        .pulse-ln { animation:scaleYPulse 2.4s ease-in-out infinite; }
        .crt { background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.05) 2px,rgba(0,0,0,0.05) 4px); }
        .ticker { animation:tickerScroll 22s linear infinite; }
        /* Gate: animations only play after loader */
        .hero-hidden { opacity: 0 !important; }
        .letter-glow-active span {
          display: inline-block;
          opacity: 0;
          animation: letterGlow 0.42s cubic-bezier(0.2,0.8,0.2,1) forwards;
        }
        .letter-glow-inactive span {
          display: inline-block;
          opacity: 0;
        }
        .vignette { background:radial-gradient(ellipse at center,transparent 38%,rgba(0,0,0,0.72) 100%); }
        .frame { animation:borderGlow 4s ease-in-out infinite; }
        @keyframes fogDrift1 {
          0%   { transform:translateX(-8%) translateY(0px) scale(1); opacity:0.18; }
          50%  { transform:translateX(6%)  translateY(-12px) scale(1.06); opacity:0.28; }
          100% { transform:translateX(-8%) translateY(0px) scale(1); opacity:0.18; }
        }
        @keyframes fogDrift2 {
          0%   { transform:translateX(6%)  translateY(8px) scale(1.04); opacity:0.12; }
          50%  { transform:translateX(-5%) translateY(-6px) scale(1); opacity:0.22; }
          100% { transform:translateX(6%)  translateY(8px) scale(1.04); opacity:0.12; }
        }
        @keyframes fogDrift3 {
          0%   { transform:translateX(0%)  translateY(-5px) scale(1.02); opacity:0.1; }
          50%  { transform:translateX(4%)  translateY(10px) scale(1); opacity:0.2; }
          100% { transform:translateX(0%)  translateY(-5px) scale(1.02); opacity:0.1; }
        }
        .fog1 { animation:fogDrift1 14s ease-in-out infinite; }
        .fog2 { animation:fogDrift2 18s ease-in-out infinite; }
        .fog3 { animation:fogDrift3 22s ease-in-out infinite; }
        /* BG floating elements */
        @keyframes orbFloat1 {
          0%,100% { transform:translate(0px, 0px) scale(1); }
          33%  { transform:translate(30px,-40px) scale(1.08); }
          66%  { transform:translate(-20px,20px) scale(0.94); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform:translate(0px, 0px) scale(1); }
          40%  { transform:translate(-35px,25px) scale(1.1); }
          70%  { transform:translate(20px,-30px) scale(0.92); }
        }
        @keyframes orbFloat3 {
          0%,100% { transform:translate(0px, 0px) scale(1); }
          50% { transform:translate(25px,35px) scale(1.06); }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-30px) rotate(15deg); opacity: 0.7; }
        }
        @keyframes ringRotate {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        @keyframes ringRotateRev {
          from { transform:rotate(0deg); }
          to   { transform:rotate(-360deg); }
        }
        @keyframes starTwinkle {
          0%,100% { opacity:0.15; transform:scale(1); }
          50%  { opacity:0.9;  transform:scale(1.6); }
        }
        @keyframes lineDash {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -200; }
        }
        .orb1 { animation:orbFloat1 12s ease-in-out infinite; }
        .orb2 { animation:orbFloat2 17s ease-in-out infinite; }
        .orb3 { animation:orbFloat3 21s ease-in-out infinite; }
        .ring-spin  { animation:ringRotate 20s linear infinite; }
        .ring-spin-rev { animation:ringRotateRev 28s linear infinite; }
        /* Letter sequential glow */
        @keyframes letterGlow {
          0%   { color: rgba(255,255,255,0); text-shadow: none; opacity:0; transform: translateY(8px); }
          40%  { color: #fff; text-shadow: 0 0 10px #fff, 0 0 22px rgba(239,68,68,0.9); opacity:1; transform: translateY(0); }
          100% { color: #fff; text-shadow: none; opacity:1; transform: translateY(0); }
        }
        .letter-glow span {
          display: inline-block;
          opacity: 0;
          animation: letterGlow 0.7s ease-out forwards;
        }
        /* Remove old .letter-glow defaults — class-based above handles it */
      `}</style>

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ animation: 'ambientPulse 6s ease-in-out infinite' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(185,28,28,0.2),transparent)]" />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 vignette pointer-events-none z-[5]" />

      {/* Fog layers — light white mist */}
      <div className="fog1 absolute inset-0 pointer-events-none z-[6]" style={{ background: 'radial-gradient(ellipse 80% 45% at 30% 55%, rgba(255,255,255,0.13) 0%, transparent 70%)' }} />
      <div className="fog2 absolute inset-0 pointer-events-none z-[6]" style={{ background: 'radial-gradient(ellipse 65% 40% at 70% 45%, rgba(255,255,255,0.09) 0%, transparent 65%)' }} />
      <div className="fog3 absolute inset-0 pointer-events-none z-[6]" style={{ background: 'radial-gradient(ellipse 90% 35% at 50% 70%, rgba(255,255,255,0.07) 0%, transparent 60%)' }} />

      {/* ── Animated BG Elements ── */}
      {/* Large floating colour orbs */}
      <div className="orb1 absolute top-[8%] left-[5%] w-[420px] h-[420px] rounded-full pointer-events-none z-[2]" style={{ background: 'radial-gradient(circle, rgba(185,28,28,0.22) 0%, transparent 68%)', filter: 'blur(55px)' }} />
      <div className="orb2 absolute bottom-[10%] right-[4%] w-[360px] h-[360px] rounded-full pointer-events-none z-[2]" style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.16) 0%, transparent 65%)', filter: 'blur(65px)' }} />
      <div className="orb3 absolute top-[45%] right-[20%] w-[260px] h-[260px] rounded-full pointer-events-none z-[2]" style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.10) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      {/* Rotating geometric rings - top right */}
      <div className="absolute top-[6%] right-[8%] pointer-events-none z-[3]" style={{ width: 180, height: 180 }}>
        <div className="ring-spin w-full h-full rounded-full" style={{ border: '1px solid rgba(220,38,38,0.18)', boxShadow: '0 0 18px rgba(220,38,38,0.08)' }} />
        <div className="ring-spin-rev absolute inset-4 rounded-full" style={{ border: '1px dashed rgba(255,255,255,0.08)' }} />
        <div className="ring-spin absolute inset-8 rounded-full" style={{ border: '1px solid rgba(220,38,38,0.12)' }} />
      </div>

      {/* Rotating geometric rings - bottom left */}
      <div className="absolute bottom-[12%] left-[6%] pointer-events-none z-[3]" style={{ width: 130, height: 130 }}>
        <div className="ring-spin-rev w-full h-full rounded-full" style={{ border: '1px solid rgba(220,38,38,0.14)', animationDuration: '35s' }} />
        <div className="ring-spin absolute inset-5 rounded-full" style={{ border: '1px dashed rgba(255,255,255,0.06)', animationDuration: '25s' }} />
      </div>

      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none z-[1]" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
      }} />

      {/* Twinkling star dots */}
      {[
        { top: '12%', left: '18%', delay: '0s', dur: '2.8s' },
        { top: '25%', left: '82%', delay: '0.7s', dur: '3.4s' },
        { top: '62%', left: '12%', delay: '1.2s', dur: '2.2s' },
        { top: '75%', left: '75%', delay: '0.3s', dur: '3.8s' },
        { top: '40%', left: '92%', delay: '1.8s', dur: '2.6s' },
        { top: '88%', left: '42%', delay: '0.9s', dur: '3.1s' },
        { top: '18%', left: '55%', delay: '2.2s', dur: '2.4s' },
      ].map((s, i) => (
        <div key={i} className="absolute pointer-events-none z-[3] w-1 h-1 rounded-full bg-red-400" style={{
          top: s.top, left: s.left,
          animation: `starTwinkle ${s.dur} ease-in-out ${s.delay} infinite`,
          boxShadow: '0 0 6px rgba(239,68,68,0.8)',
        }} />
      ))}

      {/* Floating Tech Icons */}
      {[
        { Icon: Code2, top: '15%', left: '12%', delay: '0s', size: 32 },
        { Icon: Smartphone, top: '25%', right: '15%', delay: '1s', size: 28 },
        { Icon: Apple, top: '65%', left: '18%', delay: '2s', size: 30 },
        { Icon: Globe, bottom: '20%', right: '12%', delay: '1.5s', size: 26 },
        { Icon: Cpu, top: '45%', left: '8%', delay: '3s', size: 24 },
      ].map((item, i) => (
        <div key={i} className="absolute pointer-events-none z-[7]" style={{
          top: item.top, left: item.left, right: item.right, bottom: item.bottom,
          animation: `iconFloat 6s ease-in-out ${item.delay} infinite`,
        }}>
          <item.Icon size={item.size} color="rgba(255, 100, 100, 0.8)" strokeWidth={1.5} />
        </div>
      ))}

      {/* CRT */}
      <div className="absolute inset-0 crt pointer-events-none z-40 opacity-35" />

      {/* Grain */}
      <canvas ref={grainRef} className="absolute inset-0 pointer-events-none z-40 opacity-60 mix-blend-overlay" />

      {/* Cursor dot */}
      <div ref={cursorDotRef} className="fixed top-0 left-0 z-[60] pointer-events-none will-change-transform">
        <div className={`w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)] transition-transform duration-100 ${isHovered ? 'scale-0' : 'scale-100'}`} />
      </div>

      {/* Cursor ring */}
      <div ref={cursorRingRef} className="fixed top-0 left-0 z-[59] pointer-events-none will-change-transform">
        <svg width="44" height="44" className="animate-spin" style={{ animationDuration: '4s' }}>
          <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(239,68,68,0.65)" strokeWidth="1.5" strokeDasharray="6 6" />
        </svg>
      </div>

      {/* Image Wrapper */}
      <div
        ref={imageWrapperRef}
        className={`relative z-10 w-[420px] h-[530px] md:w-[500px] md:h-[640px] mt-8 ${startAnim ? 'anim-2' : 'hero-hidden'}`}
        style={{ perspective: '900px' }}
      >
        <div
          ref={tiltWrapRef}
          className="relative w-full h-full will-change-transform"
          style={{ transformStyle: 'preserve-3d', transition: 'transform 0.1s ease-out' }}
        >
          {/* Corner brackets */}
          <div className="absolute inset-0 z-30 pointer-events-none">
            <div className={`absolute top-0 left-0 border-t-2 border-l-2 border-red-500/70 transition-all duration-500 ${isHovered ? 'w-10 h-10' : 'w-4 h-4'}`} />
            <div className={`absolute top-0 right-0 border-t-2 border-r-2 border-red-500/70 transition-all duration-500 ${isHovered ? 'w-10 h-10' : 'w-4 h-4'}`} />
            <div className={`absolute bottom-0 left-0 border-b-2 border-l-2 border-red-500/70 transition-all duration-500 ${isHovered ? 'w-10 h-10' : 'w-4 h-4'}`} />
            <div className={`absolute bottom-0 right-0 border-b-2 border-r-2 border-red-500/70 transition-all duration-500 ${isHovered ? 'w-10 h-10' : 'w-4 h-4'}`} />
          </div>

          {/* Ghost name */}
          <div className="absolute z-0 w-full left-1/2 top-1/2 flex justify-center pointer-events-none select-none mix-blend-screen" style={{ animation: 'ghostFloat 6s ease-in-out infinite', transform: 'translate(-50%,-50%)' }}>
            <span className="text-[13vw] font-black text-transparent tracking-tighter whitespace-nowrap" 
              style={{ 
                WebkitTextStroke: '1.5px rgba(255,255,255,0.6)',
                textShadow: '0 0 25px rgba(220,38,38,0.5), 0 0 50px rgba(220,38,38,0.2)'
              }}>
              JITENDRA
            </span>
          </div>

          {/* Glow layer */}
          <div ref={glowRef} className="absolute inset-0 z-[25] pointer-events-none" style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.5s' }} />

          {/* Image frame */}
          <div className={`relative w-full h-full overflow-hidden rounded-sm frame ${isHovered ? 'border border-red-500/25' : 'border border-white/5'} transition-colors duration-700`}>
            {/* Base p3 */}
            <img
              src={p3}
              alt="Base"
              className="absolute inset-0 w-full h-full object-cover object-top z-10 pointer-events-none"
              style={{ filter: 'brightness(0.65) contrast(1.2) grayscale(0.4)' }}
            />
            {/* Depth overlay */}
            <div className="absolute inset-0 z-[11] pointer-events-none bg-gradient-to-t from-black/55 via-transparent to-black/15" />
            {/* Revealed p1 */}
            <img
              ref={p1Ref}
              src={p1}
              alt="Reveal"
              className={`absolute inset-0 w-full h-full object-cover object-top z-20 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
              style={{
                filter: 'brightness(1.15) contrast(1.1) saturate(1.3)',
                WebkitMaskImage: 'radial-gradient(circle 0px at center, black 0%, transparent 100%)',
                maskImage: 'radial-gradient(circle 0px at center, black 0%, transparent 100%)',
              }}
            />
            {/* 3D wave rings canvas */}
            <canvas ref={waveCanvasRef} className="absolute inset-0 z-30 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Hero Center Name ── */}
      <div className="absolute bottom-14 left-0 right-0 flex flex-col items-center z-30 pointer-events-none">
        <h2
          className="flex tracking-[0.25em] uppercase font-black select-none"
          style={{ fontSize: 'clamp(2.2rem,6vw,5rem)', lineHeight: 1, perspective: '1000px' }}
        >
          {'JITENDRA'.split('').map((ch, i) => (
            <span key={i} className="hero-name-char inline-block" style={{ color: '#fff' }}>{ch}</span>
          ))}
        </h2>
        <div className={`hero-subtitle mt-3 flex items-center gap-3 ${startAnim ? '' : 'hero-hidden'}`} style={{ transformOrigin: 'center' }}>
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-red-600" />
          <span className="text-[9px] font-mono tracking-[0.5em] text-red-500/80 uppercase">
            Full Stack Developer
          </span>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-red-600" />
        </div>
      </div>


      {/* Top-left logo */}
      <div className={`absolute top-10 left-10 z-30 flex flex-col pointer-events-none ${startAnim ? 'anim-1' : 'hero-hidden'}`}>
        <h1 className={`text-3xl font-black tracking-widest uppercase leading-none ${startAnim ? 'letter-glow-active' : 'letter-glow-inactive'}`}>
          {'JITENDRA'.split('').map((ch, i) => (
            <span key={i} style={{ animationDelay: startAnim ? `${0.04 + i * 0.06}s` : '0s', color: '#fff' }}>{ch}</span>
          ))}
          <br />
          <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #991b1b', opacity: startAnim ? 1 : 0, animation: 'none', transition: 'opacity 0.4s 0.65s' }}>YADAV</span>
        </h1>
        <div className="mt-2 h-[1px] w-14 bg-gradient-to-r from-red-600 to-transparent" />
        <span className="mt-1.5 text-[8px] font-mono tracking-[0.4em] text-red-700/80 uppercase">Full Stack Developer</span>
      </div>

      {/* Bottom ticker */}
      <div className={`absolute bottom-0 left-0 right-0 z-30 border-t border-white/5 bg-black/60 backdrop-blur-sm overflow-hidden h-7 flex items-center ${startAnim ? 'anim-4' : 'hero-hidden'}`}>
        <div className="ticker flex gap-16 text-[8px] font-mono tracking-[0.4em] text-white/25 whitespace-nowrap">
          {Array(4).fill(null).flatMap((_, i) => [
            <span key={`a${i}`}>FULL STACK DEVELOPER</span>,
            <span key={`b${i}`} className="text-red-700">✦</span>,
            <span key={`c${i}`}>DESIGN × CODE</span>,
            <span key={`d${i}`} className="text-red-700">✦</span>,
            <span key={`e${i}`}>JITENDRA YADAV</span>,
            <span key={`f${i}`} className="text-red-700">✦</span>,
          ])}
        </div>
      </div>
    </section>
  );
}
