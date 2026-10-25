import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Code, Cpu, Smartphone, Globe, Wrench, AppWindow, Sparkles } from 'lucide-react';

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const sections = ['ab-hero', 'ab-about', 'ab-skills', 'ab-terminal', 'ab-cta'];
  const [activeSection, setActiveSection] = useState('ab-hero');
  const [isInView, setIsInView] = useState(false);
  const [skillFilter, setSkillFilter] = useState<'All' | 'Frontend' | 'Mobile' | 'Backend' | 'Cloud'>('All');

  // Intersection observer to only show fixed elements (cursor, nav, progress) when in this section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // GSAP Animations
  useEffect(() => {
    let ctx: any;

    (async () => {
      try {
        const gsapModule = await import('gsap');
        const gsap: any = gsapModule.default || gsapModule;
        const ScrollTriggerModule = await import('gsap/ScrollTrigger');
        const ScrollTrigger: any = ScrollTriggerModule.default || ScrollTriggerModule;

        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          // Progress bar
          gsap.to(progressBarRef.current, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.1
            }
          });

          // Hero Animation
          gsap.fromTo('.ab-hero-word',
            { y: 150, opacity: 0, rotationX: 45 },
            {
              y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.1, ease: 'power4.out',
              scrollTrigger: { trigger: '#ab-hero', start: 'top 80%' }
            }
          );

          // Marquee Animation
          gsap.to('.ab-marquee-inner', {
            xPercent: -50,
            ease: 'none',
            duration: 20,
            repeat: -1,
          });

          // About Strip
          gsap.fromTo('.ab-fade-up',
            { opacity: 0, y: 50 },
            {
              opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out',
              scrollTrigger: { trigger: '#ab-about', start: 'top 70%' }
            }
          );

          // Full-Screen Pinned Skills Stack
          const skillsSection = document.querySelector('#ab-skills');
          const skillCards = gsap.utils.toArray('.ab-skill-cell');
          
          gsap.fromTo(skillCards,
            { 
              y: 50, 
              rotateX: -15, 
              opacity: 0,
              scale: 0.9,
              filter: 'blur(10px)'
            },
            {
              y: 0,
              rotateX: 0,
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              stagger: 0.05,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: skillsSection,
                start: 'top 80%',
                once: true,
              }
            }
          );

          // Terminal lines animation
          const tl = gsap.timeline({
            scrollTrigger: { trigger: '#ab-terminal', start: 'top 60%' }
          });

          const lines = gsap.utils.toArray('.ab-term-line');
          lines.forEach((line: any) => {
            tl.fromTo(line,
              { opacity: 0, width: 0 },
              { opacity: 1, width: '100%', duration: 0.4, ease: 'steps(30)' },
              `+=0.15`
            );
          });

          // CTA
          gsap.fromTo('.ab-cta-text',
            { opacity: 0, scale: 0.8 },
            {
              opacity: 1, scale: 1, duration: 1, ease: 'power4.out',
              scrollTrigger: { trigger: '#ab-cta', start: 'top 80%' }
            }
          );

          // Section tracking for dots
          sections.forEach((sec) => {
            ScrollTrigger.create({
              trigger: `#${sec}`,
              start: 'top center',
              end: 'bottom center',
              onEnter: () => setActiveSection(sec),
              onEnterBack: () => setActiveSection(sec),
            });
          });

        }, containerRef);
      } catch (err) {
        console.error("GSAP load error:", err);
      }
    })();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  // Custom Cursor and Magnetic Button Logic
  useEffect(() => {
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let dotX = targetX;
    let dotY = targetY;
    let ringX = targetX;
    let ringY = targetY;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener('mousemove', onMove);

    let rafId: number;
    const render = () => {
      dotX += (targetX - dotX) * 0.2;
      dotY += (targetY - dotY) * 0.2;
      ringX += (targetX - ringX) * 0.1;
      ringY += (targetY - ringY) * 0.1;

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

      rafId = requestAnimationFrame(render);
    };
    render();

    // Magnetic elements
    const magnets = document.querySelectorAll('.ab-magnetic');
    const onMagMove = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const mx = (e as MouseEvent).clientX - rect.left - rect.width / 2;
      const my = (e as MouseEvent).clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${mx * 0.3}px, ${my * 0.3}px)`;

      ring.style.width = '60px';
      ring.style.height = '60px';
      ring.style.borderColor = '#ffffff';
      ring.style.backgroundColor = 'rgba(255,255,255,0.1)';
    };
    const onMagLeave = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = 'translate(0px, 0px)';

      ring.style.width = '40px';
      ring.style.height = '40px';
      ring.style.borderColor = '#e63333';
      ring.style.backgroundColor = 'transparent';
    };

    magnets.forEach(mag => {
      mag.addEventListener('mousemove', onMagMove);
      mag.addEventListener('mouseleave', onMagLeave);
    });

    // Interactive mouse glow for skill cells
    const cells = document.querySelectorAll('.ab-skill-cell');
    const onCellMove = (e: any) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mouse-x', `${x}%`);
      el.style.setProperty('--mouse-y', `${y}%`);
    };
    cells.forEach(c => c.addEventListener('mousemove', onCellMove));

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      magnets.forEach(mag => {
        mag.removeEventListener('mousemove', onMagMove);
        mag.removeEventListener('mouseleave', onMagLeave);
      });
      cells.forEach(c => c.removeEventListener('mousemove', onCellMove));
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const interests = [
    "WEB DEVELOPMENT", "ANDROID APP DEV", "IOS APP DEV", "AI/ML",
    "WEB DEVELOPMENT", "ANDROID APP DEV", "IOS APP DEV", "AI/ML"
  ];

  const skills = [
    { 
      title: 'React', 
      category: 'Frontend', 
      badge: 'UI & Web', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', 
      details: 'Component architecture, Next.js, Hooks & State management',
      tags: ['Frontend', 'SPA', 'UI/UX']
    },
    { 
      title: 'Expo', 
      category: 'Mobile', 
      badge: 'Mobile App', 
      logo: 'https://cdn.simpleicons.org/expo/white', 
      details: 'Universal apps, EAS Build, and cross-platform native runtime',
      tags: ['Cross-Platform', 'EAS', 'React']
    },
    { 
      title: 'Flutter', 
      category: 'Mobile', 
      badge: 'Mobile App', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', 
      details: 'High-performance native apps for iOS & Android with Dart',
      tags: ['Dart', 'Mobile', 'UI Toolkit']
    },
    { 
      title: 'Python', 
      category: 'Backend', 
      badge: 'AI & Backend', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', 
      details: 'AI / ML integration, backend scripting & data automation',
      tags: ['AI/ML', 'Automation', 'APIs']
    },
    { 
      title: 'JavaScript', 
      category: 'Frontend', 
      badge: 'Core Engine', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', 
      details: 'Modern ES6+, asynchronous programming & Web APIs',
      tags: ['ES6+', 'Async', 'Web APIs']
    },
    { 
      title: 'TypeScript', 
      category: 'Frontend', 
      badge: 'Type Safety', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', 
      details: 'Strict typing, robust design patterns & scalable codebase',
      tags: ['Strong Types', 'Interfaces', 'Scalable']
    },
    { 
      title: 'Three.js', 
      category: 'Frontend', 
      badge: '3D Graphics', 
      logo: 'https://cdn.simpleicons.org/threedotjs/white', 
      details: 'Interactive 3D web graphics, WebGL canvases & shaders',
      tags: ['3D Web', 'WebGL', 'Animations']
    },
    { 
      title: 'Node.js', 
      category: 'Backend', 
      badge: 'Server Runtime', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', 
      details: 'High-throughput APIs, microservices & backend servers',
      tags: ['REST APIs', 'Express', 'Backend']
    },
    { 
      title: 'Firebase', 
      category: 'Cloud', 
      badge: 'Cloud Platform', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg', 
      details: 'Authentication, Cloud Firestore, Cloud Functions & Storage',
      tags: ['Auth', 'Firestore', 'Serverless']
    },
    { 
      title: 'Supabase', 
      category: 'Cloud', 
      badge: 'BaaS & Postgres', 
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg', 
      details: 'PostgreSQL database, Row-Level Security & Realtime subscriptions',
      tags: ['PostgreSQL', 'RLS', 'Realtime']
    },
  ];

  const filteredSkills = useMemo(() => {
    if (skillFilter === 'All') return skills;
    return skills.filter(s => s.category === skillFilter);
  }, [skillFilter]);

  return (
    <div id="ab-container" ref={containerRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap');

        #ab-container * {
          box-sizing: border-box;
        }

        #ab-container {
          background-color: #080808;
          color: #ffffff;
          font-family: 'DM Mono', monospace;
          position: relative;
          overflow: hidden;
          cursor: none;
        }

        #ab-container .ab-bebas {
          font-family: 'Bebas Neue', sans-serif;
          text-transform: uppercase;
          margin: 0;
        }

        #ab-container .ab-text-red { color: #e63333; }

        #ab-container .ab-cursor-dot {
          position: fixed;
          top: 0; left: 0;
          width: 8px; height: 8px;
          background: #e63333;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          transition: opacity 0.3s;
        }

        #ab-container .ab-cursor-ring {
          position: fixed;
          top: 0; left: 0;
          width: 40px; height: 40px;
          border: 2px solid #e63333;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transition: width 0.3s, height 0.3s, border-color 0.3s, background-color 0.3s, opacity 0.3s;
        }

        #ab-container .ab-progress {
          position: fixed;
          top: 0; left: 0;
          height: 4px;
          background: #e63333;
          width: 100%;
          transform-origin: 0 50%;
          transform: scaleX(0);
          z-index: 9998;
          transition: opacity 0.3s;
        }

        #ab-container .ab-nav-dots {
          position: fixed;
          right: 30px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 15px;
          z-index: 9000;
          transition: opacity 0.3s;
        }

        #ab-container .ab-dot {
          width: 12px; height: 12px;
          border: 2px solid #555;
          border-radius: 50%;
          cursor: none;
          transition: all 0.3s;
          background: transparent;
          padding: 0;
        }

        #ab-container .ab-dot.ab-active {
          background: #e63333;
          border-color: #e63333;
          transform: scale(1.3);
        }

        #ab-container .ab-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 6rem 5vw;
          position: relative;
        }

        #ab-container #ab-hero {
          padding-top: 10rem;
        }

        #ab-container .ab-hero-wrap {
          overflow: hidden;
        }

        #ab-container .ab-hero-text {
          font-size: clamp(4rem, 12vw, 12rem);
          line-height: 0.85;
          display: flex;
          flex-wrap: wrap;
          gap: 1.5vw;
        }

        #ab-container .ab-hero-word {
          display: inline-block;
          transform-origin: center bottom;
        }

        #ab-container .ab-marquee-container {
          width: 110vw;
          margin-left: -5vw;
          overflow: hidden;
          background: #e63333;
          color: #080808;
          padding: 1.5rem 0;
          transform: rotate(-3deg) scale(1.1);
          margin-top: 6rem;
          margin-bottom: 6rem;
          border-top: 4px solid #fff;
          border-bottom: 4px solid #fff;
        }

        #ab-container .ab-marquee-inner {
          display: flex;
          gap: 4rem;
          width: max-content;
        }

        #ab-container .ab-marquee-item {
          font-size: 3rem;
          display: flex;
          align-items: center;
          gap: 4rem;
        }

        #ab-container .ab-about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        @media (max-width: 900px) {
          #ab-container .ab-about-content {
            grid-template-columns: 1fr;
          }
        }

        #ab-container .ab-about-quote {
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1.1;
          margin-bottom: 2rem;
        }

        #ab-container .ab-about-story {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #aaa;
        }

        #ab-container .ab-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
          border-top: 1px solid #222;
          padding-top: 3rem;
        }

        #ab-container .ab-stat-num {
          font-size: 4rem;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        #ab-container .ab-stat-label {
          font-size: 1rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        #ab-container .ab-skills-section {
          min-height: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8rem 0;
          position: relative;
        }

        #ab-container .ab-skills-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-top: 2rem;
          width: 90%;
          max-width: 1350px;
        }

        @media (max-width: 1200px) {
          #ab-container .ab-skills-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 850px) {
          #ab-container .ab-skills-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 550px) {
          #ab-container .ab-skills-grid {
            grid-template-columns: 1fr;
          }
        }

        #ab-container .ab-skill-cell {
          background: rgba(14, 14, 14, 0.75);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
          min-height: 220px;
          cursor: none;
        }

        #ab-container .ab-skill-cell:hover {
          background: rgba(20, 20, 20, 0.95);
          border-color: rgba(230, 51, 51, 0.45);
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(230, 51, 51, 0.12);
        }

        #ab-container .ab-skill-cell::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, rgba(230, 51, 51, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        #ab-container .ab-skill-cell:hover::before {
          opacity: 1;
        }

        #ab-container .ab-skill-cell::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(280px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(230, 51, 51, 0.08), transparent 80%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        #ab-container .ab-skill-cell:hover::after {
          opacity: 1;
        }

        #ab-container .ab-skill-logo-wrap {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          transition: all 0.4s ease;
        }

        #ab-container .ab-skill-cell:hover .ab-skill-logo-wrap {
          transform: scale(1.1);
          border-color: rgba(230, 51, 51, 0.4);
          background: rgba(230, 51, 51, 0.08);
        }

        #ab-container .ab-skill-logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.4s ease;
        }

        #ab-container .ab-skill-title {
          font-family: 'DM Mono', monospace;
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
          letter-spacing: -0.02em;
          transition: color 0.3s ease;
        }

        #ab-container .ab-skill-cell:hover .ab-skill-title {
          color: #e63333;
        }

        #ab-container .ab-skill-details {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 6px;
          line-height: 1.5;
        }

        /* Perspective Grid Background */
        .ab-grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(230, 51, 51, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(230, 51, 51, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          transform: perspective(500px) rotateX(60deg) translateY(-100px);
          mask-image: linear-gradient(to bottom, black, transparent);
          pointer-events: none;
          z-index: 0;
          opacity: 0.5;
        }

        @media (max-width: 1024px) {
          #ab-container .ab-skills-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 600px) {
          #ab-container .ab-skills-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .ab-arsenal-heading {
          font-family: 'Anton', sans-serif;
          font-size: clamp(3.5rem, 8vw, 5.5rem);
          text-align: center;
          text-transform: uppercase;
          color: #fff;
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        #ab-container .ab-terminal-box {
          background: rgba(10, 10, 10, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
          width: 100%;
          max-width: 1000px;
          margin: 0 auto;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6), inset 0 0 40px rgba(230, 51, 51, 0.05);
          position: relative;
        }

        #ab-container .ab-terminal-box::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(230, 51, 51, 0.05) 0%, transparent 40%);
          pointer-events: none;
        }

        #ab-container .ab-term-header {
          background: rgba(255, 255, 255, 0.03);
          padding: 18px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        #ab-container .ab-term-controls {
          display: flex;
          gap: 10px;
        }

        #ab-container .ab-term-dot {
          width: 12px; height: 12px;
          border-radius: 50%;
        }
        #ab-container .ab-term-dot.ab-r { background: #ff5f56; box-shadow: 0 0 10px rgba(255, 95, 86, 0.4); }
        #ab-container .ab-term-dot.ab-y { background: #ffbd2e; }
        #ab-container .ab-term-dot.ab-g { background: #27c93f; }

        #ab-container .ab-term-title {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.3);
          font-family: 'DM Mono', monospace;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        #ab-container .ab-term-body {
          padding: 4rem;
          font-size: 1.1rem;
          line-height: 2;
          color: #e5e7eb;
          min-height: 450px;
          position: relative;
          z-index: 1;
        }

        #ab-container .ab-term-line {
          white-space: nowrap;
          overflow: hidden;
          display: block;
          width: 0;
          margin-bottom: 0.8rem;
          letter-spacing: 0.02em;
        }

        #ab-container .ab-term-prompt {
          color: #e63333;
          font-weight: 600;
          margin-right: 14px;
          text-shadow: 0 0 15px rgba(230, 51, 51, 0.3);
        }

        #ab-container .ab-term-output {
          color: #9ca3af;
        }

        @keyframes ab-blink {
          50% { opacity: 0; }
        }

        #ab-container .ab-term-cursor {
          display: inline-block;
          width: 8px;
          height: 1.2em;
          background: #e63333;
          vertical-align: middle;
          margin-left: 4px;
          box-shadow: 0 0 10px rgba(230, 51, 51, 0.6);
          animation: ab-blink 1s step-end infinite;
        }

        #ab-container #ab-cta {
          align-items: center;
          text-align: center;
          justify-content: center;
        }

        #ab-container .ab-cta-title {
          font-size: clamp(3rem, 8vw, 7rem);
          line-height: 1.1;
          margin-bottom: 3rem;
        }

        #ab-container .ab-magnetic-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem 3.5rem;
          font-size: 1.5rem;
          background: transparent;
          color: #fff;
          border: 2px solid #e63333;
          border-radius: 50px;
          text-transform: uppercase;
          letter-spacing: 3px;
          transition: background 0.3s;
          cursor: none;
          text-decoration: none;
        }

        #ab-container .ab-magnetic-btn:hover {
          background: #e63333;
        }

        #ab-container button, #ab-container a {
          position: relative;
          z-index: 10;
        }
      `}</style>

      {/* Fixed Elements */}
      <div
        className="ab-cursor-dot"
        ref={cursorDotRef}
        style={{ opacity: isInView ? 1 : 0 }}
      />
      <div
        className="ab-cursor-ring"
        ref={cursorRingRef}
        style={{ opacity: isInView ? 1 : 0 }}
      />
      <div
        className="ab-progress"
        ref={progressBarRef}
        style={{ opacity: isInView ? 1 : 0 }}
      />
      <div className="ab-nav-dots" style={{ opacity: isInView ? 1 : 0 }}>
        {sections.map((sec) => (
          <button
            key={sec}
            className={`ab-dot ${activeSection === sec ? 'ab-active' : ''}`}
            onClick={() => scrollTo(sec)}
            aria-label={`Scroll to ${sec}`}
          />
        ))}
      </div>

      {/* 1. Hero Section */}
      <section id="ab-hero" className="ab-section">
        <div className="ab-hero-wrap">
          <h1 className="ab-bebas ab-hero-text">
            <span className="ab-hero-word">JITENDRA</span>
            <span className="ab-hero-word ab-text-red">YADAV</span>
          </h1>
        </div>
        <div className="ab-hero-wrap">
          <h1 className="ab-bebas ab-hero-text">
            <span className="ab-hero-word">BUILDING</span>
            <span className="ab-hero-word">THE</span>
            <span className="ab-hero-word ab-text-red">FUTURE</span>
          </h1>
        </div>

        {/* Marquee Strip */}
        <div className="ab-marquee-container">
          <div className="ab-marquee-inner ab-bebas">
            {interests.map((interest, idx) => (
              <span key={idx} className="ab-marquee-item">
                {interest} <span>✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. About Strip */}
      <section id="ab-about" className="ab-section">
        <div className="ab-about-content">
          <div className="ab-fade-up">
            <h2 className="ab-bebas ab-about-quote">
              "Driven by <span className="ab-text-red">curiosity</span>, fueled by caffeine, and focused on creating impactful solutions."
            </h2>
          </div>
          <div className="ab-fade-up">
            <p className="ab-about-story">
              I am a driven freshman stepping into the world of technology with an insatiable curiosity. Through caffeine-fueled hackathons and continuous learning, I build solutions that bridge the gap between imagination and reality. My journey is just beginning, but my ambition is boundless.
            </p>
            <div className="ab-stats">
              <div className="ab-stat-box">
                <div className="ab-bebas ab-stat-num">01</div>
                <div className="ab-stat-label">Fresher Year</div>
              </div>
              <div className="ab-stat-box">
                <div className="ab-bebas ab-stat-num">03+</div>
                <div className="ab-stat-label">Hackathons</div>
              </div>
              <div className="ab-stat-box">
                <div className="ab-bebas ab-stat-num">∞</div>
                <div className="ab-stat-label">Curiosity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Skills Grid */}
      <section id="ab-skills" className="ab-skills-section">
        <div className="ab-grid-bg" />

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-6 z-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 font-mono text-xs uppercase tracking-widest mb-4">
            <Sparkles size={14} />
            <span>Core Competencies & Stack</span>
          </div>
          <h2 className="ab-arsenal-heading ab-fade-up font-bold tracking-widest leading-tight text-center">
            TECHNICAL <span className="ab-text-red">ARSENAL</span>
          </h2>
          <p className="ab-fade-up text-sm md:text-base text-white/50 font-sans tracking-wide max-w-xl mx-auto mt-2">
            A battle-tested stack of modern frameworks, cloud architectures, and languages I use to craft high-impact digital experiences.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 z-10 relative">
          {(['All', 'Frontend', 'Mobile', 'Backend', 'Cloud'] as const).map(tab => {
            const count = tab === 'All' ? skills.length : skills.filter(s => s.category === tab).length;
            const isActive = skillFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSkillFilter(tab)}
                className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>{tab === 'All' ? 'All Tech' : tab}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-neutral-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Enhanced Skills Bento Grid */}
        <div className="ab-skills-grid z-10 relative">
          {filteredSkills.map((skill, i) => (
            <div key={i} className="ab-skill-cell group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="ab-skill-logo-wrap">
                    <img src={skill.logo} alt={skill.title} className="ab-skill-logo" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-red-600/10 text-red-500 border border-red-600/20 font-bold tracking-wider">
                    {skill.badge}
                  </span>
                </div>
                <h3 className="ab-skill-title">{skill.title}</h3>
                <p className="ab-skill-details">{skill.details}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-white/5">
                {skill.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white/[0.03] text-neutral-400 border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Terminal Section */}
      <section id="ab-terminal" className="ab-section">
        <div className="ab-terminal-box">
          <div className="ab-term-header">
            <div className="ab-term-controls">
              <div className="ab-term-dot ab-r"></div>
              <div className="ab-term-dot ab-y"></div>
              <div className="ab-term-dot ab-g"></div>
            </div>
            <div className="ab-term-title">system_profile.sh — bash — 100x40</div>
            <div className="w-[50px]"></div> {/* spacer */}
          </div>
          <div className="ab-term-body">
            <div className="ab-term-line">
              <span className="ab-term-prompt">jitendra@tit:~$</span> whoami
            </div>
            <div className="ab-term-line ab-term-output">Name: Jitendra Yadav</div>
            <div className="ab-term-line">
              <span className="ab-term-prompt">jitendra@tit:~$</span> cat education.txt
            </div>
            <div className="ab-term-line ab-term-output">College: Technocrats Institute of Technology, Bhopal</div>
            <div className="ab-term-line ab-term-output">Degree: B.Tech CSE (AIML)</div>
            <div className="ab-term-line ab-term-output">Duration: 2023 - 2027</div>
            <div className="ab-term-line">
              <span className="ab-term-prompt">jitendra@tit:~$</span> ./status.sh
            </div>
            <div className="ab-term-line ab-term-output">Experience: Fresher</div>
            <div className="ab-term-line ab-term-output">Achievements: Participated in a few hackathons</div>
            <div className="ab-term-line ab-term-output">Status: Driven by curiosity and ready to build</div>
            <div className="ab-term-line" style={{ width: '100%', opacity: 1 }}>
              <span className="ab-term-prompt">jitendra@tit:~$</span><span className="ab-term-cursor"></span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section id="ab-cta" className="ab-section">
        <div className="ab-cta-text">
          <h2 className="ab-bebas ab-cta-title">Let's Build Something <span className="ab-text-red">Remarkable</span></h2>
          <button className="ab-bebas ab-magnetic-btn ab-magnetic">
            Get In Touch
          </button>
        </div>
      </section>
    </div>
  );
}