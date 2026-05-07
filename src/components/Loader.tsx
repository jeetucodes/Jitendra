import React, { useEffect, useState, useRef } from 'react';

/* ─── Platform data ─────────────────────────────────────────────── */
const PLATFORMS = [
  {
    id: 'android',
    name: 'Android',
    color: '#3DDC84',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="52" height="52">
        <path d="M17.523 15.341c-.551 0-.999-.449-.999-1s.448-.999.999-.999c.551 0 .999.448.999.999 0 .551-.448 1-.999 1m-11.046 0c-.551 0-.999-.449-.999-1s.448-.999.999-.999c.551 0 .999.448.999.999 0 .551-.448 1-.999 1m11.405-6.02l1.997-3.459a.416.416 0 00-.72-.412l-2.022 3.503A11.33 11.33 0 0012 7.851c-1.88 0-3.59.393-5.137 1.099L4.841 5.447a.416.416 0 00-.72.412l1.997 3.459C2.689 10.187.343 13.203 0 16.9h24c-.344-3.697-2.689-6.713-6.118-7.579" />
      </svg>
    ),
  },
  {
    id: 'web',
    name: 'Web',
    color: '#4A90E2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="52" height="52">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
  },
  {
    id: 'ios',
    name: 'iOS',
    color: '#E8E8ED',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="52" height="52">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    id: 'react',
    name: 'React Native',
    color: '#61DAFB',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="52" height="52">
        <path d="M12 9.861a2.139 2.139 0 100 4.278 2.139 2.139 0 000-4.278zm-5.992 6.394l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 001.363 3.578l.101.213-.101.213a23.307 23.307 0 00-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 011.182-3.046A24.752 24.752 0 015.317 8.95zM17 18.364c-.1 0-.201-.004-.302-.013-1.07-.09-2.1-.549-3.064-1.365a23.508 23.508 0 01-3.096-3.494l-.191-.29.191-.29a23.337 23.337 0 013.096-3.494c.964-.816 1.994-1.275 3.064-1.365.1-.01.201-.013.302-.013 1.37 0 2.643.563 3.675 1.627a23.294 23.294 0 012.23 3.528l.1.213-.1.213a23.294 23.294 0 01-2.23 3.528C19.643 17.8 18.37 18.364 17 18.364zm-2.744-5.27a22.088 22.088 0 002.688 3.045c.738.625 1.487.993 2.211 1.054.07.006.14.009.208.009.953 0 1.876-.439 2.729-1.302a22.29 22.29 0 001.882-3.006 22.29 22.29 0 00-1.882-3.006C21.149 8.932 20.226 8.493 19.363 8.493c-.068 0-.14.003-.208.009-.724.061-1.473.429-2.211 1.054A22.088 22.088 0 0014.256 13.094zM7 18.364c-1.37 0-2.643-.563-3.675-1.627A23.294 23.294 0 011.095 13.21l-.1-.213.1-.213a23.294 23.294 0 012.23-3.528C4.357 8.2 5.63 7.636 7 7.636c.1 0 .201.004.302.013 1.07.09 2.1.549 3.064 1.365a23.337 23.337 0 013.096 3.494l.191.29-.191.29a23.508 23.508 0 01-3.096 3.494c-.964.816-1.994 1.275-3.064 1.365A4.04 4.04 0 017 18.364z" />
      </svg>
    ),
  },
  {
    id: 'flutter',
    name: 'Flutter',
    color: '#54C5F8',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
        <path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.37zm.159 11.871l-7.397 7.398 7.398 7.398 3.7-3.7-3.697-3.698 3.696-3.7-3.7-3.698z" />
      </svg>
    ),
  },
];

const TOTAL_DURATION = 2600; // ms — comfortable, not rushed

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [platformIdx, setPlatformIdx] = useState(0);
  const [iconVisible, setIconVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const rafRef = useRef<number>();
  const startRef = useRef<number | null>(null);
  const switchInterval = Math.floor(TOTAL_DURATION / PLATFORMS.length); // ~520ms per icon

  useEffect(() => {
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const raw = Math.min(elapsed / TOTAL_DURATION, 1);
      const eased = easeInOutCubic(raw);

      setProgress(Math.floor(eased * 100));

      // Switch icon every switchInterval ms with a fade
      const newIdx = Math.min(
        Math.floor(elapsed / switchInterval),
        PLATFORMS.length - 1
      );
      setPlatformIdx(prev => {
        if (prev !== newIdx) {
          setIconVisible(false);
          setTimeout(() => {
            setPlatformIdx(newIdx);
            setIconVisible(true);
          }, 160);
        }
        return prev;
      });

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 550);
        }, 200);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const platform = PLATFORMS[platformIdx];

  return (
    <div className={`ldr-root${exiting ? ' ldr-exit' : ''}`}>

      {/* Subtle grid */}
      <div className="ldr-grid" />

      {/* Soft ambient glow — color shifts with platform */}
      <div
        className="ldr-ambient"
        style={{ background: `radial-gradient(ellipse 60% 50% at 50% 55%, ${platform.color}18 0%, transparent 70%)` }}
      />

      {/* ── Main card ── */}
      <div className="ldr-card">

        {/* Top — icon + name */}
        <div className="ldr-icon-area">
          {/* Thin rotating border ring */}
          <div className="ldr-ring">
            <svg width="120" height="120" viewBox="0 0 120 120" className="ldr-ring-svg">
              <circle cx="60" cy="60" r="55" fill="none"
                stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <circle cx="60" cy="60" r="55" fill="none"
                stroke={platform.color}
                strokeWidth="1.5"
                strokeDasharray={`${(progress / 100) * 345.4} 345.4`}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px', transition: 'stroke 0.4s ease' }}
              />
            </svg>
          </div>

          {/* Platform icon */}
          <div
            className={`ldr-icon${iconVisible ? ' ldr-icon-in' : ' ldr-icon-out'}`}
            style={{ color: platform.color }}
          >
            {platform.icon}
          </div>
        </div>

        {/* Platform name */}
        <div
          className={`ldr-name${iconVisible ? ' ldr-name-in' : ' ldr-name-out'}`}
          style={{ color: platform.color }}
        >
          {platform.name}
        </div>

        {/* Tagline */}
        <p className="ldr-tagline">Building cross-platform experiences</p>

        {/* Progress bar */}
        <div className="ldr-bar-track">
          <div
            className="ldr-bar-fill"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${platform.color}99, ${platform.color})`,
              boxShadow: `0 0 12px ${platform.color}55`,
            }}
          />
        </div>

        {/* Percent */}
        <div className="ldr-percent-row">
          <span className="ldr-percent-num" style={{ color: platform.color }}>
            {String(progress).padStart(3, '0')}
          </span>
          <span className="ldr-percent-sym">%</span>
        </div>
      </div>

      {/* Bottom dots — platform indicators */}
      <div className="ldr-dots">
        {PLATFORMS.map((p, i) => (
          <div
            key={p.id}
            className={`ldr-dot${i === platformIdx ? ' ldr-dot-active' : ''}`}
            style={i === platformIdx ? { background: p.color, boxShadow: `0 0 8px ${p.color}` } : {}}
          />
        ))}
      </div>
    </div>
  );
}
