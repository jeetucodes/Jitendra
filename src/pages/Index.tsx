import React, { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import TextScrollSection from '@/components/TextScrollSection';
import AboutSection from '@/components/AboutSection';
import WorkSection from '@/components/WorkSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Cursor from '@/components/Cursor';
import Loader from '@/components/Loader';
import KineticFooter from '@/components/KineticFooter';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [animReady, setAnimReady] = useState(false);

  // Fix 9: Refresh ScrollTrigger after fonts load
  useEffect(() => {
    const id = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 800);
    return () => clearTimeout(id);
  }, []);

  const handleLoaderDone = () => {
    setLoading(false);
    // Small tick so HeroSection mounts first, then anims fire
    setTimeout(() => setAnimReady(true), 80);
  };

  useEffect(() => {
    if (loading) return;

    // Use IntersectionObserver for performant scroll reveals
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Optional: stop observing once revealed
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((reveal) => observer.observe(reveal));
    
    return () => {
      observer.disconnect();
    };
  }, [loading]);
  
  return (
    <>
      {loading && <Loader onComplete={handleLoaderDone} />}
      <div className="relative overflow-x-clip" style={{ visibility: loading ? 'hidden' : 'visible' }}>
        <Cursor />
        <Navbar />
        
        <HeroSection startAnim={animReady} />
        <TextScrollSection />
        <AboutSection />
        <WorkSection />
        <ContactSection />
        <KineticFooter />
        <Footer />
      </div>
    </>
  );
};

export default Index;

