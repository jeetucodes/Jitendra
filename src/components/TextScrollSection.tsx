import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TextScrollSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.to('.ts-bg-left', {
        xPercent: -20,
        scrollTrigger: {
          trigger: sectionRef.current,
          scrub: 1,
        }
      });
      gsap.to('.ts-bg-right', {
        xPercent: 20,
        scrollTrigger: {
          trigger: sectionRef.current,
          scrub: 1,
        }
      });

      // Split Text Reveal - GPU accelerated (no blur scrub jank)
      const words = gsap.utils.toArray('.ts-word');
      gsap.fromTo(words, 
        { opacity: 0.15, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 45%',
            end: 'bottom 65%',
            scrub: 1,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative h-screen bg-[#050505] overflow-hidden flex items-center justify-center select-none"
    >
      {/* Cinematic Background */}
      <div className="absolute inset-0 flex flex-col justify-center opacity-[0.02] pointer-events-none">
        <div className="ts-bg-left whitespace-nowrap text-[25vw] font-black leading-none tracking-tighter">
          INTELLIGENCE INTELLIGENCE INTELLIGENCE
        </div>
        <div className="ts-bg-right whitespace-nowrap text-[25vw] font-black leading-none tracking-tighter self-end">
          ARCHITECTURE ARCHITECTURE ARCHITECTURE
        </div>
      </div>

      <div ref={containerRef} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <span className="text-[10px] uppercase font-mono tracking-[0.5em] text-red-600 mb-8 block">
          Core Philosophy
        </span>
        <h2 
          ref={textRef} 
          className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight text-white/90"
        >
          {`I transform complex systemic challenges into minimalist, high-performance digital realities—bridging the frontier of artificial intelligence with visceral, human-first interaction design.`.split(' ').map((word, i) => (
            <span key={i} className="ts-word inline-block mr-[0.25em] will-change-transform">
              {word}
            </span>
          ))}
        </h2>
      </div>

      {/* Decorative lines */}
      <div className="absolute left-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent hidden md:block" />
      <div className="absolute right-10 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent hidden md:block" />
    </section>
  );
};

export default TextScrollSection;
