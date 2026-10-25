import React, { useEffect, useRef, useState } from 'react';
import { Github, ArrowUpRight, ChevronLeft, ChevronRight, Smartphone } from 'lucide-react';
import { db, collection, getDocs, query, orderBy } from '@/lib/firebase';

interface Project {
  id: string;
  title: string;
  category: string;
  images: string[];
  tagline: string;
  github: string;
  link: string;
  playstore?: string;
  stack: string[];
  year: string;
}

const ProjectGallery = ({ images, title }: { images: string[], title: string }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return <div className="wk-img-container bg-neutral-900" />;

  return (
    <div className="wk-img-container group/gallery">
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`${title} - ${idx}`}
          className={`wk-gallery-img ${idx === currentIdx ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-110 rotate-1'}`}
        />
      ))}

      {images.length > 1 && (
        <>
          <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover/gallery:opacity-100 transition-all duration-500 z-20">
            <button onClick={prev} className="p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 hover:bg-red-600 hover:scale-110 transition-all">
              <ChevronLeft size={24} />
            </button>
            <button onClick={next} className="p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 hover:bg-red-600 hover:scale-110 transition-all">
              <ChevronRight size={24} />
            </button>
          </div>
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentIdx(idx); }}
                className={`h-1.5 transition-all duration-500 rounded-full ${idx === currentIdx ? 'w-10 bg-red-600' : 'w-2 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function WorkSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    let lastPos = window.scrollY;
    let request: number;
    const updateVelocity = () => {
      const currentPos = window.scrollY;
      const diff = currentPos - lastPos;
      setVelocity(diff * 0.15); // Adjust sensitivity
      lastPos = currentPos;
      request = requestAnimationFrame(updateVelocity);
    };
    request = requestAnimationFrame(updateVelocity);
    return () => cancelAnimationFrame(request);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedProjects = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            images: data.images || (data.image ? [data.image] : [])
          } as Project;
        });

        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (loading || projects.length === 0) return;

    let ctx: any;
    const initGSAP = async () => {
      try {
        const gsapModule = await import('gsap');
        const gsap: any = gsapModule.default || gsapModule;
        const ScrollTriggerModule = await import('gsap/ScrollTrigger');
        const ScrollTrigger: any = ScrollTriggerModule.default || ScrollTriggerModule;

        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          // Floating background text animation
          gsap.to('.wk-bg-text', {
            xPercent: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            }
          });

          const wrappers = gsap.utils.toArray('.wk-project-wrapper');
          wrappers.forEach((wrapper: any, i: number) => {
            const card = wrapper.querySelector('.wk-project-card');
            const info = wrapper.querySelector('.wk-info');
            const img = wrapper.querySelector('.wk-img-container');
            const bgText = wrapper.querySelector('.wk-item-bg-text');

            // Cinematic Reveal & Parallax
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: wrapper,
                start: 'top 90%',
                end: 'top 10%',
                scrub: 0.5,
              }
            });

            tl.fromTo(img, 
              { clipPath: 'inset(15% 15% 15% 15% round 5rem)', scale: 1.2, filter: 'brightness(0.3) blur(10px)' },
              { clipPath: 'inset(0% 0% 0% 0% round 3rem)', scale: 1, filter: 'brightness(1) blur(0px)', duration: 1.5 }
            )
            .from(info, { x: 100, opacity: 0, filter: 'blur(10px)' }, '-=1')
            .from(bgText, { y: 200, opacity: 0, scale: 0.5 }, '-=1.2');

            // Sticky Stacking Logic
            if (i < wrappers.length - 1) {
              gsap.to(card, {
                scale: 0.85,
                yPercent: -15,
                opacity: 0.3,
                filter: 'blur(15px) grayscale(1)',
                scrollTrigger: {
                  trigger: wrappers[i + 1],
                  start: 'top 90%',
                  end: 'top 20%',
                  scrub: true,
                }
              });
            }
          });
        }, containerRef);
      } catch (err) {
        console.error("GSAP load error:", err);
      }
    };

    initGSAP();

    return () => {
      if (ctx) ctx.revert();
    };
  }, [loading, projects]);

  if (loading) {
    return (
      <section id="work" className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <div className="text-red-600 font-mono tracking-[0.3em] uppercase text-xs">Loading Works</div>
        </div>
      </section>
    );
  }

  return (
    <section id="work" ref={containerRef} style={{ background: '#050505', position: 'relative', overflow: 'hidden' }}>
      <div className="wk-bg-text">WORKS WORKS WORKS WORKS WORKS</div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Mono:ital,wght@0,300;0,400;0,500&family=Inter:wght@300;400;700;800;900&display=swap');

        .wk-bg-text {
          position: absolute;
          top: 10%;
          left: 0;
          white-space: nowrap;
          font-family: 'Anton', sans-serif;
          font-size: 35vw;
          color: rgba(255,255,255,0.015);
          pointer-events: none;
          line-height: 0.8;
          z-index: 0;
          text-transform: uppercase;
          letter-spacing: -0.05em;
        }

        .wk-item-bg-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Anton', sans-serif;
          font-size: 20vw;
          color: rgba(230, 51, 51, 0.04);
          white-space: nowrap;
          pointer-events: none;
          z-index: -1;
          text-transform: uppercase;
        }

        .wk-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 5vw;
          position: relative;
          z-index: 1;
        }

        .wk-header {
          padding: 150px 0 100px;
          text-align: center;
        }

        .wk-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.5em;
          color: #e63333;
          margin-bottom: 2rem;
          display: block;
          text-transform: uppercase;
        }

        .wk-title-wrap {
          overflow: hidden;
          line-height: 0.9;
        }

        .wk-title-word {
          font-family: 'Anton', sans-serif;
          font-size: clamp(4rem, 15vw, 12rem);
          text-transform: uppercase;
          color: #fff;
        }

        .wk-projects-grid {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .wk-project-wrapper {
          position: sticky;
          top: 0;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wk-project-card {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 5vw;
          align-items: center;
          width: 100%;
          background: rgba(10,10,10,0.8);
          backdrop-blur: 40px;
          padding: 4vw;
          border-radius: 4rem;
          border: 1px solid rgba(255,255,255,0.06);
          box-shadow: 0 50px 100px rgba(0,0,0,0.5);
        }

        @media (max-width: 1024px) {
          .wk-project-card {
            grid-template-columns: 1fr;
            gap: 2.5rem;
            padding: 2.5rem;
            border-radius: 2.5rem;
            height: auto;
            max-height: 85vh;
            overflow-y: auto;
          }
          .wk-project-wrapper {
            height: auto;
            margin-bottom: 10vh;
          }
        }

        .wk-img-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 11;
          border-radius: 3rem;
          overflow: hidden;
          background: #111;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }

        .wk-gallery-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 1.2s cubic-bezier(0.2, 1, 0.3, 1);
        }

        .wk-info {
          display: flex;
          flex-direction: column;
        }

        .wk-info-tag {
          font-family: 'DM Mono', monospace;
          color: #e63333;
          font-size: 0.8rem;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .wk-info-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(3rem, 6vw, 5rem);
          line-height: 1;
          color: #fff;
          margin-bottom: 2rem;
          text-transform: uppercase;
        }

        .wk-info-desc {
          font-family: 'Inter', sans-serif;
          color: rgba(255,255,255,0.4);
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 3rem;
          max-width: 90%;
        }

        .wk-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-bottom: 3.5rem;
        }

        .wk-chip {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          padding: 0.5rem 1.2rem;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
        }

        .wk-actions {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .wk-btn-primary {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: #e63333;
          color: #fff;
          padding: 1.2rem 2.5rem;
          border-radius: 100px;
          font-family: 'DM Mono', monospace;
          font-size: 0.85rem;
          text-transform: uppercase;
          transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
          text-decoration: none;
          font-weight: 500;
        }

        .wk-btn-primary:hover {
          background: #fff;
          color: #000;
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 20px 40px rgba(230,51,51,0.3);
        }

        .wk-btn-github {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 55px;
          height: 55px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%;
          color: #fff;
          transition: all 0.4s ease;
          text-decoration: none;
        }

        .wk-btn-github:hover {
          border-color: #e63333;
          color: #e63333;
          transform: rotate(12deg) translateY(-8px);
          background: rgba(230,51,51,0.05);
        }

        .wk-btn-playstore {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
          padding: 1.2rem 2.2rem;
          border-radius: 100px;
          font-family: 'DM Mono', monospace;
          font-size: 0.85rem;
          text-transform: uppercase;
          transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
          text-decoration: none;
          font-weight: 500;
        }

        .wk-btn-playstore:hover {
          background: #00875a;
          border-color: #00875a;
          color: #fff;
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 20px 40px rgba(0, 135, 90, 0.3);
        }
      `}</style>

      <div className="wk-container">
        <div className="wk-header">
          <span className="wk-label">Creative Archive</span>
          <div className="wk-title-wrap">
            <h2 className="wk-title-word">SELECTED</h2>
          </div>
          <div className="wk-title-wrap">
            <h2 className="wk-title-word" style={{ color: '#e63333' }}>SHOWCASE</h2>
          </div>
        </div>

        <div className="wk-projects-grid">
          {projects.length > 0 ? (
            projects.map((p, i) => (
              <div key={p.id} className="wk-project-wrapper">
                <div 
                  className="wk-item-bg-text scroll-skew"
                  style={{ transform: `translate(-50%, -50%) skewY(${velocity}deg)` }}
                >
                  {p.title.split('\n')[0]}
                </div>
                <div className="wk-project-card">
                  <ProjectGallery images={p.images} title={p.title} />

                  <div className="wk-info">
                    <span className="wk-info-tag font-mono">{p.category} // {p.year}</span>
                    <h3 className="wk-info-title font-bold text-5xl md:text-7xl tracking-wider uppercase">
                      {p.title}
                    </h3>
                    <p className="wk-info-desc text-lg opacity-60 leading-relaxed font-medium">
                      {p.tagline}
                    </p>

                    <div className="wk-stack">
                      {p.stack.map(s => <span key={s} className="wk-chip font-mono">{s}</span>)}
                    </div>

                    <div className="wk-actions">
                      {p.link && p.link !== 'N/A' && (
                        <a href={p.link} target="_blank" rel="noreferrer" className="wk-btn-primary font-bold">
                          Live Demo <ArrowUpRight size={18} />
                        </a>
                      )}
                      {p.playstore && p.playstore !== 'N/A' && (
                        <a href={p.playstore} target="_blank" rel="noreferrer" className="wk-btn-playstore font-bold" title="Google Play Store">
                          <Smartphone size={18} /> Play Store
                        </a>
                      )}
                      {p.github && p.github !== 'N/A' && (
                        <a href={p.github} target="_blank" rel="noreferrer" className="wk-btn-github" title="Source Code">
                          <Github size={24} />
                        </a>
                      )}
                      {(!p.link || p.link === 'N/A') && (!p.playstore || p.playstore === 'N/A') && (!p.github || p.github === 'N/A') && (
                        <span className="wk-info-tag font-mono" style={{ opacity: 0.3 }}>Link N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-white/30 font-mono tracking-widest uppercase">No projects found in database</p>
              <a href="/admin" className="text-red-500 mt-4 inline-block hover:underline">Go to Admin to add projects</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}