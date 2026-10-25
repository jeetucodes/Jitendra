import React, { useEffect, useRef, useState, useMemo } from 'react';
import { 
  Github, 
  ArrowUpRight, 
  ChevronLeft, 
  ChevronRight, 
  Smartphone, 
  Globe, 
  Sparkles,
  Layers,
  ExternalLink
} from 'lucide-react';
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
  createdAt?: any;
}


const getWebsiteName = (url?: string) => {
  if (!url || url === 'N/A') return 'Website';
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return hostname || 'Website';
  } catch {
    const clean = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    return clean || 'Website';
  }
};

const ProjectGallery = ({ images, title, projectLink }: { images: string[], title: string, projectLink?: string }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[16/10] rounded-3xl bg-neutral-900 border border-white/5 flex items-center justify-center">
        <span className="text-white/20 font-mono text-xs uppercase tracking-widest">No preview available</span>
      </div>
    );
  }

  // Extract clean domain for mock bar
  const displayDomain = getWebsiteName(projectLink);

  return (
    <div className="relative group/mockup rounded-3xl overflow-hidden border border-white/10 bg-[#0c0c0c] shadow-2xl transition-all duration-700 hover:border-red-600/40 hover:shadow-red-950/20">
      {/* Mockup Top Window Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-black/60 backdrop-blur-md border-b border-white/5 select-none z-20 relative">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="px-4 py-1 rounded-full bg-white/5 border border-white/5 text-[11px] font-mono text-white/50 tracking-wide truncate max-w-[200px] md:max-w-[280px]">
          {displayDomain}
        </div>
        <div className="text-[11px] font-mono text-white/30">
          {images.length > 1 ? `${currentIdx + 1} / ${images.length}` : 'HD'}
        </div>
      </div>

      {/* Main Image Display */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/40">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`${title} screenshot ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out group-hover/mockup:scale-105 ${
              idx === currentIdx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 pointer-events-none'
            }`}
          />
        ))}

        {/* Ambient bottom gradient */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

        {/* Multi-image Navigation Controls */}
        {images.length > 1 && (
          <>
            <div className="absolute inset-0 flex items-center justify-between px-4 z-20 opacity-0 group-hover/mockup:opacity-100 transition-opacity duration-300">
              <button 
                type="button"
                onClick={prev} 
                className="p-3 bg-black/70 backdrop-blur-md text-white rounded-full border border-white/10 hover:bg-red-600 hover:border-red-600 hover:scale-110 transition-all shadow-xl"
                aria-label="Previous screenshot"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                type="button"
                onClick={next} 
                className="p-3 bg-black/70 backdrop-blur-md text-white rounded-full border border-white/10 hover:bg-red-600 hover:border-red-600 hover:scale-110 transition-all shadow-xl"
                aria-label="Next screenshot"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Bottom dot indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCurrentIdx(idx); }}
                  className={`h-1.5 rounded-full transition-all duration-400 ${
                    idx === currentIdx ? 'w-8 bg-red-600 shadow-sm shadow-red-600' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to screenshot ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function WorkSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        let docsData: any[] = [];
        try {
          const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
          const querySnapshot = await getDocs(q);
          docsData = querySnapshot.docs;
        } catch {
          const querySnapshot = await getDocs(collection(db, 'projects'));
          docsData = querySnapshot.docs;
        }

        const fetchedProjects = docsData.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            images: data.images || (data.image ? [data.image] : [])
          } as Project;
        });

        // Safe client sort by date descending
        fetchedProjects.sort((a, b) => {
          const timeA = new Date(a.createdAt?.toDate ? a.createdAt.toDate() : a.createdAt || 0).getTime() || 0;
          const timeB = new Date(b.createdAt?.toDate ? b.createdAt.toDate() : b.createdAt || 0).getTime() || 0;
          return timeB - timeA;
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

  // Compute available categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => {
      if (p.category && p.category.trim()) {
        set.add(p.category.trim());
      }
    });
    return ['All', ...Array.from(set)];
  }, [projects]);

  // Filter projects based on selected category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter(p => p.category?.trim().toLowerCase() === selectedCategory.toLowerCase());
  }, [projects, selectedCategory]);

  return (
    <section 
      id="work" 
      ref={containerRef} 
      className="relative bg-[#050505] text-white py-32 px-6 md:px-12 lg:px-20 overflow-hidden font-sans selection:bg-red-600/30"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Background typographic watermark */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-black text-[18vw] leading-none text-white/[0.015] select-none pointer-events-none tracking-tighter uppercase font-mono">
        SHOWCASE
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 font-mono text-xs uppercase tracking-widest mb-6">
            <Sparkles size={14} />
            <span>Selected Projects & Engineering</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black tracking-tight uppercase leading-tight mb-6 font-mono">
            FEATURED <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">CREATIONS</span>
          </h2>

          <p className="text-neutral-400 text-base md:text-lg leading-relaxed font-sans font-light">
            A curated collection of web platforms, cross-platform mobile apps, and full-stack software built with performance, architecture, and user experience in mind.
          </p>

          {/* Interactive Category Filter Pills */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-10">
              {categories.map((cat) => {
                const count = cat === 'All' ? projects.length : projects.filter(p => p.category?.trim().toLowerCase() === cat.toLowerCase()).length;
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                      isActive 
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 scale-105' 
                        : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-neutral-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Projects Showcase Stream */}
        {loading ? (
          <div className="py-28 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">Loading Masterpieces...</span>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-24 text-center rounded-[2.5rem] bg-[#0c0c0c] border border-white/5 max-w-2xl mx-auto p-12">
            <Layers size={40} className="text-neutral-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No Projects In This Category</h3>
            <p className="text-neutral-500 text-sm mb-6">Switch category or add more projects from the admin dashboard.</p>
            <button 
              type="button"
              onClick={() => setSelectedCategory('All')} 
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase rounded-xl transition-all"
            >
              Show All Projects
            </button>
          </div>
        ) : (
          <div className="space-y-24 md:space-y-32">
            {filteredProjects.map((project, idx) => {
              const isEven = idx % 2 === 0;
              const projectNumber = String(idx + 1).padStart(2, '0');
              const hasPlayStore = project.playstore && project.playstore !== 'N/A';
              const hasLiveWeb = project.link && project.link !== 'N/A';
              const hasGithub = project.github && project.github !== 'N/A';

              return (
                <div 
                  key={project.id}
                  className="relative p-6 sm:p-10 md:p-12 lg:p-14 rounded-[2.5rem] bg-gradient-to-b from-[#111111]/90 via-[#0a0a0a]/90 to-[#070707] border border-white/10 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-red-600/30 group"
                >
                  {/* Subtle Corner Ambient Glow */}
                  <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-red-600/10 transition-all duration-700" />

                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center`}>
                    
                    {/* Media Gallery Column */}
                    <div className={`lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <ProjectGallery 
                        images={project.images} 
                        title={project.title} 
                        projectLink={hasLiveWeb ? project.link : project.playstore}
                      />
                    </div>

                    {/* Details Content Column */}
                    <div className={`lg:col-span-5 flex flex-col justify-center ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      
                      {/* Top Meta Line: Number + Category Badge + Year */}
                      <div className="flex items-center justify-between gap-4 mb-5">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-red-600/10 text-red-500 border border-red-600/20 tracking-wider uppercase">
                            {project.category || 'Engineering'}
                          </span>
                          {project.year && (
                            <span className="text-xs font-mono text-neutral-500">
                              • {project.year}
                            </span>
                          )}
                        </div>
                        <span className="text-3xl font-black font-mono text-white/20 select-none">
                          #{projectNumber}
                        </span>
                      </div>

                      {/* Project Title */}
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 uppercase group-hover:text-red-500 transition-colors duration-300">
                        {project.title}
                      </h3>

                      {/* Project Tagline / Description */}
                      <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-6 font-light">
                        {project.tagline}
                      </p>

                      {/* Tech Stack Chips */}
                      {project.stack && project.stack.length > 0 && (
                        <div className="mb-8">
                          <div className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 mb-2.5">
                            Built With
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.stack.map((tech, i) => (
                              <span 
                                key={i}
                                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono text-neutral-300 tracking-wide hover:border-red-600/40 hover:text-white transition-colors"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interactive Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        {/* Website Link */}
                        {hasLiveWeb && (
                          <a 
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] shadow-lg shadow-red-600/30 group/btn"
                            title={`Visit ${getWebsiteName(project.link)}`}
                          >
                            <Globe size={15} />
                            <span>{getWebsiteName(project.link)}</span>
                            <ArrowUpRight size={15} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </a>
                        )}

                        {/* Google Play Store */}
                        {hasPlayStore && (
                          <a 
                            href={project.playstore}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 hover:border-emerald-500 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.03] shadow-lg hover:shadow-emerald-900/30 group/play"
                          >
                            <Smartphone size={15} />
                            <span>Play Store</span>
                            <ArrowUpRight size={15} className="group-hover/play:translate-x-0.5 group-hover/play:-translate-y-0.5 transition-transform" />
                          </a>
                        )}

                        {/* GitHub Source Code */}
                        {hasGithub && (
                          <a 
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 hover:border-white/20 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-[1.03]"
                            title="View Source Code on GitHub"
                          >
                            <Github size={15} />
                            <span>Code</span>
                          </a>
                        )}

                        {/* If no external links provided */}
                        {!hasLiveWeb && !hasPlayStore && !hasGithub && (
                          <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest px-4 py-2 rounded-lg bg-white/5 border border-white/5">
                            Internal Project
                          </span>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA to View Admin or Contact */}
        <div className="mt-24 text-center border-t border-white/5 pt-12">
          <p className="text-neutral-500 text-sm font-mono tracking-wider mb-4">
            HAVE A VISION IN MIND? LET'S BUILD SOMETHING EXTRAORDINARY.
          </p>
          <a 
            href="#contact" 
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-red-500 hover:text-red-400 uppercase tracking-widest hover:underline transition-all"
          >
            <span>Start A Conversation</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

      </div>
    </section>
  );
}
