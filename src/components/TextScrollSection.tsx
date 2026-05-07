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

      // Split Text Reveal
      const words = gsap.utils.toArray('.ts-word');
      gsap.fromTo(words, 
        { opacity: 0.1, y: 20, filter: 'blur(10px)' },
        { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)',
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 40%',
            end: 'bottom 60%',
            scrub: true,
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
        <div className="ts-bg-right whitespace-nowrap text-[25vw] font-black leading-none tracking-tighter text-red-600">
          FUTURE FUTURE FUTURE FUTURE FUTURE
        </div>
      </div>

      <div className="relative z-10 text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-4xl md:text-7xl font-bold tracking-tight text-white uppercase leading-none">
            {["Scaling", "Intelligence", "//", "Crafting", "the", "Future"].map((word, i) => (
              <span key={i} className="ts-word inline-block">
                {word === "//" ? <span className="text-red-600">{word}</span> : word}
              </span>
            ))}
          </h2>
          
          <div className="mt-12 h-[1px] w-24 bg-red-600 mx-auto" />
          
          <p className="mt-8 text-lg md:text-xl font-mono text-gray-500 tracking-[0.3em] uppercase">
            Jitendra Yadav — 2024
          </p>
        </div>
      </div>

      {/* Decorative scanline */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.02)_50%)] bg-[length:100%_4px] pointer-events-none" />
    </section>
  );
};

export default TextScrollSection;
