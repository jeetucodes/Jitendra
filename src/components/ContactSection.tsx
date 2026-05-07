import React, { useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Github, Linkedin, Phone, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { db, collection, addDoc } from '@/lib/firebase';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const { toast } = useToast();
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = {
      name: (form.querySelector('input[placeholder="Your name"]') as HTMLInputElement).value,
      email: (form.querySelector('input[placeholder="your@email.com"]') as HTMLInputElement).value,
      subject: (form.querySelector('input[placeholder="What\'s this about?"]') as HTMLInputElement).value,
      message: (form.querySelector('textarea') as HTMLTextAreaElement).value,
      timestamp: new Date().toISOString(),
      status: 'unread'
    };

    try {
      await addDoc(collection(db, 'messages'), formData);
      toast({
        title: 'Message sent!',
        description: "Thank you for reaching out. I'll get back to you soon!",
      });
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: 'Error',
        description: "Failed to send message. Please try again.",
        variant: 'destructive'
      });
    }
  };

  const handleInvalidShake = () => {
    const btn = document.getElementById('ct-send-btn');
    if (!btn) return;
    gsap.to(btn, {
      keyframes: {
        "x": [-5, 5, -5, 5, -3, 3, 0]
      },
      duration: 0.5,
      ease: 'power1.inOut',
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: 'top 75%', once: true };

      // Split giant left words into spans
      ['#ct-word-lets', '#ct-word-talk'].forEach((sel) => {
        const el = document.querySelector<HTMLElement>(sel);
        if (!el) return;
        const text = el.textContent || '';
        el.innerHTML = text
          .split('')
          .map((ch) => `<span class="ct-char" style="display:inline-block;transform:translateY(-120%);opacity:0">${ch === ' ' ? '&nbsp;' : ch}</span>`)
          .join('');
      });

      // Animate chars
      ScrollTrigger.create({
        ...trigger,
        onEnter: () => {
          gsap.to('.ct-char', {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power4.out',
            stagger: 0.025,
          });

          // Contact info items
          gsap.to('.ct-info-item', {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.1,
            delay: 0.3,
          });

          // Divider line
          gsap.to('#ct-divider', {
            scaleY: 1,
            duration: 1.2,
            ease: 'power3.inOut',
            delay: 0.2,
          });

          // Form fields
          gsap.to('.ct-field-wrap', {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.1,
            delay: 0.4,
          });

          // Label + badge
          gsap.to(['#ct-top-label', '#ct-open-badge'], {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.15,
            delay: 0.2,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const contactItems = [
    { icon: <MapPin size={14} />, label: 'Bhopal, MP, India', href: undefined },
    { icon: <Mail size={14} />, label: 'jy37934@gmail.com', href: 'mailto:jy37934@gmail.com' },
    { icon: <Phone size={14} />, label: '+91 7061461954', href: 'tel:+917061461954' },
    { icon: <Github size={14} />, label: 'github.com/jeetucodes', href: 'https://github.com/jeetucodes' },
    { icon: <Linkedin size={14} />, label: 'linkedin.com/in/jitendra-yadav', href: 'https://www.linkedin.com/in/jitendra-yadav-014718195' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

        #ct-section *, #ct-section *::before, #ct-section *::after {
          box-sizing: border-box;
        }

        #ct-section {
          position: relative;
          min-height: 100vh;
          background: #080808;
          display: flex;
          flex-direction: column;
          font-family: 'DM Mono', monospace;
          overflow: hidden;
        }

        /* TOP LABEL */
        #ct-top-label {
          position: absolute;
          top: 2rem;
          left: 2rem;
          font-size: 9px;
          letter-spacing: 0.35em;
          color: #e63333;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(-10px);
          z-index: 10;
        }

        /* MAIN SPLIT */
        #ct-split {
          display: flex;
          flex: 1;
          min-height: 100vh;
        }

        /* ── LEFT HALF ── */
        #ct-left {
          position: relative;
          width: 55%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 6rem 3rem 4rem 4rem;
          overflow: hidden;
        }

        /* Red glow behind */
        #ct-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 40% 50%, rgba(230,51,51,0.07) 0%, transparent 65%);
          pointer-events: none;
        }

        /* Giant decorative words */
        #ct-giant-words {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 2rem;
          pointer-events: none;
          user-select: none;
          overflow: hidden;
        }

        #ct-word-lets {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(7rem, 15vw, 13rem);
          color: rgba(240,240,240,0.06);
          line-height: 0.9;
          letter-spacing: 0.02em;
        }

        #ct-word-talk {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(7rem, 15vw, 13rem);
          -webkit-text-stroke: 1px rgba(230,51,51,0.15);
          color: transparent;
          line-height: 0.9;
          letter-spacing: 0.02em;
        }

        /* Floating contact info */
        #ct-info-block {
          position: relative;
          z-index: 2;
        }

        #ct-info-heading {
          font-size: 10px;
          letter-spacing: 0.4em;
          color: #e63333;
          text-transform: uppercase;
          margin-bottom: 2.5rem;
          display: block;
        }

        .ct-info-item {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          margin-bottom: 1.1rem;
          text-decoration: none;
          color: rgba(240,240,240,0.6);
          font-size: 12px;
          letter-spacing: 0.05em;
          transition: color 0.3s;
          opacity: 0;
          transform: translateX(-20px);
        }

        .ct-info-item:hover { color: #f0f0f0; }
        .ct-info-item:hover .ct-info-icon { color: #ff6666; }

        .ct-info-icon {
          color: #e63333;
          flex-shrink: 0;
          transition: color 0.3s;
        }

        /* Open to work badge */
        #ct-open-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          margin-top: 2.5rem;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: rgba(240,240,240,0.35);
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(10px);
          cursor: default;
        }

        #ct-open-badge::before {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #e63333;
          animation: ctPulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        @keyframes ctPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }

        /* ── DIVIDER ── */
        #ct-divider {
          width: 1px;
          background: linear-gradient(to bottom, transparent 0%, #e63333 30%, #e63333 70%, transparent 100%);
          align-self: stretch;
          margin: 4rem 0;
          transform: scaleY(0);
          transform-origin: top;
          opacity: 0.4;
          flex-shrink: 0;
        }

        /* ── RIGHT HALF ── */
        #ct-right {
          width: 45%;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          padding: 6rem 4rem 4rem 4rem;
        }

        #ct-form-inner {
          width: 100%;
        }

        #ct-form-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          color: #f0f0f0;
          line-height: 1;
          margin-bottom: 3rem;
          letter-spacing: 0.03em;
        }

        #ct-form-title span { color: #e63333; }

        /* Form fields */
        .ct-field-wrap {
          margin-bottom: 2rem;
          position: relative;
          opacity: 0;
          transform: translateY(30px);
        }

        .ct-form-label {
          display: block;
          font-size: 9px;
          letter-spacing: 0.35em;
          color: #e63333;
          text-transform: uppercase;
          margin-bottom: 0.6rem;
        }

        .ct-form-input,
        .ct-form-textarea {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.12);
          color: #f0f0f0;
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          padding: 0.6rem 0;
          outline: none;
          transition: border-color 0.3s;
          position: relative;
        }

        .ct-form-textarea { resize: none; }

        /* Animated bottom border on focus */
        .ct-field-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 1px;
          background: #e63333;
          transition: width 0.4s cubic-bezier(0.76,0,0.24,1);
        }

        .ct-form-input:focus ~ .ct-field-line,
        .ct-form-textarea:focus ~ .ct-field-line {
          width: 100%;
        }

        /* Send button */
        #ct-send-btn {
          margin-top: 2.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
        }

        #ct-send-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          color: #f0f0f0;
          letter-spacing: 0.04em;
          line-height: 1;
          transition: color 0.3s;
          display: block;
        }

        #ct-send-btn:hover #ct-send-text { color: #e63333; }

        #ct-send-underline {
          height: 2px;
          background: #e63333;
          width: 0%;
          transition: width 0.4s cubic-bezier(0.76,0,0.24,1);
          margin-top: 0.4rem;
        }

        #ct-send-btn:hover #ct-send-underline { width: 100%; }

        /* ── FOOTER STRIP ── */
        #ct-footer-strip {
          background: #0a0a0a;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 1.2rem 4rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.1em;
          font-family: 'DM Mono', monospace;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          #ct-split { flex-direction: column; }
          #ct-left { width: 100%; padding: 5rem 2rem 2rem; }
          #ct-right { width: 100%; padding: 2rem 2rem 4rem; }
          #ct-divider { display: none; }
          #ct-giant-words { display: none; }
          #ct-footer-strip { flex-direction: column; gap: 0.5rem; text-align: center; }
        }
      `}</style>

      <section id="ct-section" ref={sectionRef}>

        {/* Top label */}
        <span id="ct-top-label">05 / Contact</span>

        <div id="ct-split">

          {/* ── LEFT ── */}
          <div id="ct-left">

            {/* Giant background words */}
            <div id="ct-giant-words">
              <span id="ct-word-lets">LET'S</span>
              <span id="ct-word-talk">TALK</span>
            </div>

            {/* Floating contact info */}
            <div id="ct-info-block">
              <span id="ct-info-heading">— Get In Touch</span>

              {contactItems.map((item, i) => {
                const Tag = item.href ? 'a' : ('div' as any);
                return (
                  <Tag
                    key={i}
                    className="ct-info-item"
                    {...(item.href ? { href: item.href } : {})}
                  >
                    <span className="ct-info-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Tag>
                );
              })}

              <div id="ct-open-badge">
                Open to Work · Available for Internships
              </div>
            </div>
          </div>

          {/* Divider */}
          <div id="ct-divider" />

          {/* ── RIGHT ── */}
          <div id="ct-right">
            <div id="ct-form-inner">
              <h2 id="ct-form-title">
                Send a<br /><span>Message.</span>
              </h2>

              <form ref={formRef} onSubmit={handleSubmit} noValidate
                onInvalid={handleInvalidShake}>

                <div className="ct-field-wrap">
                  <label className="ct-form-label">Name</label>
                  <input className="ct-form-input" type="text" required placeholder="Your name" />
                  <div className="ct-field-line" />
                </div>

                <div className="ct-field-wrap">
                  <label className="ct-form-label">Email</label>
                  <input className="ct-form-input" type="email" required placeholder="your@email.com" />
                  <div className="ct-field-line" />
                </div>

                <div className="ct-field-wrap">
                  <label className="ct-form-label">Subject</label>
                  <input className="ct-form-input" type="text" placeholder="What's this about?" />
                  <div className="ct-field-line" />
                </div>

                <div className="ct-field-wrap">
                  <label className="ct-form-label">Message</label>
                  <textarea className="ct-form-textarea" rows={4} required placeholder="Say something awesome..." />
                  <div className="ct-field-line" />
                </div>

                <button id="ct-send-btn" type="submit">
                  <span id="ct-send-text">SEND IT →</span>
                  <div id="ct-send-underline" />
                </button>

              </form>
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <div id="ct-footer-strip">
          <span>© {new Date().getFullYear()} Jitendra Yadav</span>
          <span>React + TypeScript + GSAP</span>
        </div>

      </section>
    </>
  );
}