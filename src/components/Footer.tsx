import React from 'react';
import { Github, Linkedin, Mail, Twitter, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer-section" style={{ position: 'relative', background: '#050505', overflow: 'hidden' }}>
      <style>{`
        #footer-section {
          font-family: 'DM Mono', monospace;
          color: rgba(255, 255, 255, 0.6);
        }

        .ft-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 3rem;
          position: relative;
          z-index: 2;
        }

        .ft-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .ft-brand h2 {
          font-family: 'Inter', sans-serif;
          font-size: 2rem;
          font-weight: 900;
          color: #fff;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.03em;
        }

        .ft-brand h2 span {
          color: #dc2626;
        }

        .ft-brand p {
          font-size: 0.85rem;
          max-width: 300px;
          line-height: 1.6;
          margin: 0;
        }

        .ft-links-wrap {
          display: flex;
          gap: 4rem;
          flex-wrap: wrap;
        }

        .ft-col h3 {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #fff;
          margin: 0 0 1.5rem 0;
        }

        .ft-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .ft-list a {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.2s;
        }

        .ft-list a:hover {
          color: #dc2626;
        }

        .ft-social {
          display: flex;
          gap: 1rem;
        }

        .ft-social a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
        }

        .ft-social a:hover {
          background: rgba(220, 38, 38, 0.1);
          border-color: #dc2626;
          color: #fff;
          transform: translateY(-3px);
        }

        .ft-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .ft-bottom p {
          margin: 0;
          font-size: 0.8rem;
        }

        .ft-back-top {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: color 0.2s;
          padding: 0;
        }

        .ft-back-top:hover {
          color: #dc2626;
        }

        .ft-back-top-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transition: border-color 0.2s;
        }

        .ft-back-top:hover .ft-back-top-icon {
          border-color: #dc2626;
        }

        /* Background grid effect */
        .ft-bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        .ft-glow {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60vw;
          height: 200px;
          background: radial-gradient(ellipse at bottom, rgba(220, 38, 38, 0.15), transparent 70%);
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <div className="ft-bg-grid"></div>
      <div className="ft-glow"></div>

      <div className="ft-container">
        <div className="ft-top">
          <div className="ft-brand">
            <h2>JITENDRA<span>.</span></h2>
            <p>Building high-performance, cinematic digital experiences with modern web technologies.</p>
          </div>

          <div className="ft-links-wrap">
            <div className="ft-col">
              <h3>Navigation</h3>
              <ul className="ft-list">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#work">Work</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="ft-col">
              <h3>Socials</h3>
              <div className="ft-social">
                <a href="https://github.com/jeetucodes" target="_blank" rel="noopener noreferrer" title="GitHub">
                  <Github size={18} />
                </a>
                <a href="https://www.linkedin.com/in/jitendra-yadav-014718195" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" title="Twitter">
                  <Twitter size={18} />
                </a>
                <a href="mailto:jy37934@gmail.com" title="Email">
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="ft-bottom">
          <p>© {new Date().getFullYear()} Jitendra Yadav. All rights reserved.</p>
          <button onClick={scrollToTop} className="ft-back-top">
            Back to top
            <span className="ft-back-top-icon">
              <ArrowUp size={14} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
