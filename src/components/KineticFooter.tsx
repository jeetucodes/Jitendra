import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const KineticFooter: React.FC = () => {
  return (
    <section className="py-12 bg-[#050505] overflow-hidden border-t border-white/5 relative">
      <style>{`
        .kinetic-marquee-container {
          display: flex;
          overflow: hidden;
          user-select: none;
          gap: 4rem;
        }

        .kinetic-marquee-content {
          flex-shrink: 0;
          display: flex;
          justify-content: space-around;
          min-width: 100%;
          gap: 4rem;
          animation: footer-marquee 30s linear infinite;
        }

        @keyframes footer-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% - 4rem)); }
        }

        .kinetic-text-outline {
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.1);
          color: transparent;
        }

        .kinetic-item {
          display: flex;
          align-items: center;
          gap: 2rem;
          font-family: 'Outfit', sans-serif;
          font-weight: 900;
          font-size: clamp(4rem, 10vw, 10rem);
          text-transform: uppercase;
          white-space: nowrap;
          letter-spacing: -0.02em;
        }
      `}</style>

      <div className="kinetic-marquee-container">
        {Array(3).fill(null).map((_, i) => (
          <div key={i} className="kinetic-marquee-content">
            <div className="kinetic-item">
              <span className="kinetic-text-outline">Let's Build Something</span>
              <span className="text-red-600">Remarkable</span>
            </div>
            <div className="kinetic-item">
              <span className="kinetic-text-outline">Creative</span>
              <span className="text-white">Developer</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default KineticFooter;
