'use client';

import React, { useEffect, useRef, useState, FormEvent } from 'react';

// ─── Step visual sub-components ───────────────────────────────────────────────

function DistractionCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const ids: ReturnType<typeof setTimeout>[] = [];
    const schedule = (delay: number, cb: () => void) => {
      const id = setTimeout(cb, delay);
      ids.push(id);
    };
    let total = 0;
    const bump = (next: number, delta: number) => {
      schedule(next, () => {
        total += delta;
        setCount(total);
      });
    };
    bump(600, 1); bump(1100, 1); bump(1700, 2);
    bump(2400, 1); bump(3200, 3); bump(4100, 2);
    bump(5200, 1); bump(6400, 2); bump(7800, 1);
    return () => ids.forEach(clearTimeout);
  }, []);

  const notifications = [
    { icon: '🔔', label: 'Slack — #general', time: '2s ago' },
    { icon: '📧', label: 'Newsletter digest', time: '4s ago' },
    { icon: '💬', label: 'Twitter notification', time: '7s ago' },
  ];

  return (
    <div className="step-visual distraction-visual">
      <div className="dv-header">
        <span className="dv-label">Distractions Blocked</span>
        <span className="dv-count">{count}</span>
      </div>
      <div className="dv-list">
        {notifications.map((n, i) => (
          <div className="dv-item" key={i} style={{ animationDelay: `${0.4 + i * 0.18}s` }}>
            <span className="dv-icon">{n.icon}</span>
            <span className="dv-name">{n.label}</span>
            <span className="dv-time">{n.time}</span>
            <span className="dv-blocked">Blocked</span>
          </div>
        ))}
      </div>
      <div className="dv-shield">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Attention Shield Active</span>
      </div>
    </div>
  );
}

function TimerRing() {
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<'priming' | 'focus' | 'done'>('priming');
  useEffect(() => {
    let start: number | null = null;
    const DURATION = 4200;
    let raf = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const p = Math.min(elapsed / DURATION, 1);
      setPct(Math.round(p * 100));
      if (p < 0.3) setPhase('priming');
      else if (p < 1) setPhase('focus');
      else setPhase('done');
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const R = 42;
  const C = 2 * Math.PI * R;
  const dashOffset = C * (1 - pct / 100);
  const phaseLabel = phase === 'priming' ? 'Priming…' : phase === 'focus' ? 'Deep Focus' : 'Session Complete';
  const phaseColor = phase === 'priming' ? '#7c6ef5' : phase === 'focus' ? '#5be4a2' : '#eef0f6';

  return (
    <div className="step-visual timer-visual">
      <div className="tv-ring-wrap">
        <svg viewBox="0 0 100 100" className="tv-svg" aria-hidden="true">
          <circle cx="50" cy="50" r={R} stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none"/>
          <circle cx="50" cy="50" r={R} stroke={phaseColor} strokeWidth="6" fill="none"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={dashOffset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.25s ease, stroke 0.5s ease' }}
          />
        </svg>
        <div className="tv-center">
          <span className="tv-pct">{pct}%</span>
          <span className="tv-sub">Primed</span>
        </div>
      </div>
      <div className="tv-phase" style={{ color: phaseColor }}>{phaseLabel}</div>
      <div className="tv-labels">
        {['Breath', 'Clarity', 'Flow'].map((l, i) => (
          <div key={i} className="tv-tag" style={{ opacity: pct > i * 33 ? 1 : 0.3, transition: 'opacity 0.6s ease' }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

function FluidStatusChip() {
  const [intensity, setIntensity] = useState(0.3);
  const [label, setLabel] = useState('Warming up');
  useEffect(() => {
    const phases: Array<[number, string, number]> = [
      [800,  'Warming up', 0.3],
      [2000, 'Focus building', 0.55],
      [3400, 'Deep flow', 0.8],
      [5000, 'Peak state', 1.0],
      [7000, 'Sustained', 0.9],
    ];
    const ids = phases.map(([delay, lbl, val]) =>
      setTimeout(() => { setLabel(lbl); setIntensity(val); }, delay)
    );
    return () => ids.forEach(clearTimeout);
  }, []);

  const hue = 220 + intensity * 120;
  const glow = `hsla(${hue}, 80%, 65%, ${intensity * 0.6})`;
  const fill = `hsla(${hue}, 75%, 60%, ${intensity * 0.25})`;

  return (
    <div className="step-visual fluid-visual">
      <div className="fv-orb" style={{ background: fill, boxShadow: `0 0 ${40 + intensity * 60}px ${glow}`, transition: 'all 1.4s cubic-bezier(0.33,1,0.68,1)' }}>
        <div className="fv-inner" style={{ opacity: intensity, background: `radial-gradient(circle, hsla(${hue},90%,70%,0.5) 0%, transparent 70%)`, transition: 'all 1.4s ease' }}/>
      </div>
      <div className="fv-chip" style={{ borderColor: `hsla(${hue},60%,60%,0.4)`, transition: 'border-color 1.2s ease' }}>
        <span className="fv-dot" style={{ background: `hsl(${hue}, 75%, 60%)`, boxShadow: `0 0 8px hsl(${hue}, 75%, 60%)`, transition: 'all 1.2s ease' }}/>
        <span className="fv-text">{label}</span>
        <span className="fv-bar">
          <span className="fv-fill" style={{ width: `${intensity * 100}%`, background: `linear-gradient(90deg, hsl(${hue},70%,55%), hsl(${hue + 30},80%,65%))`, transition: 'width 1.2s cubic-bezier(0.33,1,0.68,1)' }}/>
        </span>
      </div>
      <div className="fv-hint">Visual ambiance adapts in real-time</div>
    </div>
  );
}

function MetricsCard() {
  const [focusQ, setFocusQ] = useState(0);
  const [deepWork, setDeepWork] = useState(0);
  useEffect(() => {
    const DURATION = 1800;
    let start: number | null = null;
    let raf = 0;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / DURATION, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setFocusQ(Math.round(ease * 94));
      setDeepWork(Math.round(ease * 32) / 10);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const id = setTimeout(() => { raf = requestAnimationFrame(tick); }, 400);
    return () => { clearTimeout(id); cancelAnimationFrame(raf); };
  }, []);

  const bars = [0.6, 0.75, 0.55, 0.85, 0.7, 0.94, 0.88];
  return (
    <div className="step-visual metrics-visual">
      <div className="mv-row">
        <div className="mv-stat">
          <span className="mv-val">{focusQ}<span className="mv-unit">%</span></span>
          <span className="mv-label">Focus Quality</span>
        </div>
        <div className="mv-divider"/>
        <div className="mv-stat">
          <span className="mv-val">+{deepWork.toFixed(1)}<span className="mv-unit">h</span></span>
          <span className="mv-label">Deep Work / day</span>
        </div>
      </div>
      <div className="mv-chart">
        {bars.map((h, i) => (
          <div key={i} className="mv-bar-wrap">
            <div className="mv-bar"
              style={{
                height: `${h * 100}%`,
                background: i === 6 ? 'linear-gradient(180deg, #7c6ef5, #5be4a2)' : 'rgba(255,255,255,0.18)',
                transition: `height 0.6s cubic-bezier(0.33,1,0.68,1) ${i * 80}ms`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="mv-caption">Last 7 sessions · trending ↑</div>
    </div>
  );
}

// ─── FAQ Accordion ─────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: 'How does Flowstate differ from regular website blockers?',
    a: 'Traditional blockers operate on a blocklist and create friction after a distraction impulse has already fired. Flowstate intercepts at the neurological level — it primes your session environment before the impulse can form, using smart ultradian timing and ambient feedback so you never fight the urge to switch context in the first place.',
  },
  {
    q: 'Can I integrate Flowstate with my existing task managers?',
    a: 'Yes. Flowstate connects with Notion, Linear, Todoist, and any app exposing a calendar or task API. During session priming, it surfaces your single most important task for the block — nothing else — so your workspace stays noise-free and intent-locked.',
  },
  {
    q: 'Does the WebGL background affect laptop battery life?',
    a: 'Flowstate\'s fluid simulation is tuned for efficiency: it runs at a fixed 60 fps budget with adaptive resolution on battery, and fully pauses when the window is hidden or the lid is closed. On Apple Silicon in particular, the GPU workload is minimal — roughly equivalent to a YouTube video playing at low quality.',
  },
  {
    q: 'Is Flowstate suitable for team and enterprise workflows?',
    a: 'Absolutely. Team plans add a shared focus calendar, async status broadcasting (teammates see you\'re in a deep-work block without being interrupted), and org-level analytics dashboards showing collective deep-work velocity across the whole team over time.',
  },
];

function Accordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="faq-list">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className={`faq-item ${open === i ? 'is-open' : ''}`}>
          <button
            className="faq-trigger"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span>{item.q}</span>
            <span className="faq-icon" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
          <div className="faq-body">
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function HowItWorks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isIn, setIsIn] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setIsIn(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderFallback = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const gradient = ctx.createRadialGradient(width * 0.5, height * 0.35, 0, width * 0.5, height * 0.35, Math.max(width, height) * 0.8);
      gradient.addColorStop(0, 'rgba(91, 228, 162, 0.18)');
      gradient.addColorStop(1, 'rgba(4, 5, 12, 0)');

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#04050c';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    try {
      const destroy = fluidSimulation(canvas);
      return () => destroy();
    } catch (error) {
      console.warn('WebGL fluid background unavailable, using fallback renderer.', error);
      renderFallback();
      return undefined;
    }
  }, []);

  useEffect(() => {
    let lenis: any;
    const initLenis = async () => {
      try {
        const Lenis = (await import('@studio-freight/lenis')).default;
        lenis = new Lenis({ smoothWheel: true });
        const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      } catch {
        // Lenis optional
      }
    };
    initLenis();
    return () => { if (lenis) lenis.destroy(); };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  const heroHeading = 'How Flowstate Rewires Your Focus';
  const heroSubline = 'A systematic approach designed to eliminate digital fatigue, shield your attention, and put deep work on autopilot.';

  const steps = [
    {
      num: '01',
      tag: 'Attention Shielding & Noise Blocking',
      headline: 'Block Distractions Before They Trigger',
      body: 'Flowstate intercepts context switches, mutes non-essential notifications, and creates a clean digital canvas before you begin a session.',
      visual: <DistractionCounter />,
    },
    {
      num: '02',
      tag: 'Intelligent Session Priming',
      headline: 'Enter Focus Mode in Under 60 Seconds',
      body: 'Smart timer protocols synchronized with your natural ultradian rhythms gently ease your brain into hyper-focus without burnout.',
      visual: <TimerRing />,
    },
    {
      num: '03',
      tag: 'WebGL Fluid Visual Feedback',
      headline: 'Dynamic Visual Cueing for Deep Work',
      body: 'Visual atmospheric ambiance that subtly adapts as you maintain focus momentum, giving your subconscious real-time feedback.',
      visual: <FluidStatusChip />,
    },
    {
      num: '04',
      tag: 'Analytics & Deep Work Velocity',
      headline: 'Track Attention Quality, Not Just Hours',
      body: 'Gain actionable insights into your attention quality, deep work momentum, and focus streaks over time.',
      visual: <MetricsCard />,
    },
  ];

  return (
    <div className={`flowstate-container ${isIn ? 'is-in' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* ── Persistent fluid canvas (sits behind everything) ── */}
      <canvas ref={canvasRef} className="fluid-canvas" aria-hidden="true" />
      <div className="scrim" aria-hidden="true" />

      {/* ── Nav ── */}
      <header className="nav reveal reveal-down reveal-nav">
        <a className="brand" href="/">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2.5 9c2.5 0 2.5 4.2 5 4.2S10 9 12 9s2.5 4.2 5 4.2S19.5 9 21.5 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M2.5 15c2.5 0 2.5 4.2 5 4.2S10 15 12 15s2.5 4.2 5 4.2S19.5 15 21.5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity="0.5"/>
          </svg>
          Flowstate
        </a>
        <nav className="nav-links" aria-label="Main">
          <a href="/how-it-works" className="nav-active" aria-current="page">How it works?</a>
          <a href="/pricing">Pricing</a>
          <a href="/products">Products</a>
          <a href="/blog">Blog</a>
        </nav>
        <a className="pill" href="/auth">Get Started</a>
      </header>

      <main className="hiw-main">
        {/* ── A · Hero ── */}
        <section className="hiw-hero">
          <p className="badge reveal reveal-up reveal-badge">The Flowstate Methodology</p>

          <h1 className="heading">
            {heroHeading.split(/\s+/).map((word, i, arr) => (
              <React.Fragment key={i}>
                <span className="word" style={{ transitionDelay: `${480 + i * 85}ms` }}>{word}</span>
                {i < arr.length - 1 && ' '}
              </React.Fragment>
            ))}
          </h1>

          <p className="subline">
            {heroSubline.split(/\s+/).map((word, i, arr) => (
              <React.Fragment key={i}>
                <span className="word" style={{ transitionDelay: `${1150 + i * 22}ms` }}>{word}</span>
                {i < arr.length - 1 && ' '}
              </React.Fragment>
            ))}
          </p>
        </section>

        {/* ── B · 4-Step Process ── */}
        <section className="steps-section reveal reveal-up reveal-steps">
          <div className="steps-grid">
            {steps.map((step, i) => (
              <article key={i} className="step-card" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="step-meta">
                  <span className="step-num">{step.num}</span>
                  <span className="step-tag">{step.tag}</span>
                </div>
                <div className="step-body">
                  <div className="step-text">
                    <h2 className="step-headline">{step.headline}</h2>
                    <p className="step-desc">{step.body}</p>
                  </div>
                  {step.visual}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── C · FAQ ── */}
        <section className="faq-section reveal reveal-up reveal-faq">
          <div className="section-eyebrow">Common Questions</div>
          <h2 className="section-heading">Everything you need to know</h2>
          <Accordion />
        </section>

        {/* ── D · CTA ── */}
        <section className="cta-section reveal reveal-up reveal-cta">
          <div className="cta-card">
            <div className="cta-glow" aria-hidden="true"/>
            <p className="badge cta-badge">Start for free · No credit card</p>
            <h2 className="cta-heading">Ready to Reclaim Your Attention?</h2>
            <p className="cta-sub">Join thousands already building deep-work habits with Flowstate.</p>
            <form className="waitlist-form" noValidate onSubmit={handleSubmit}>
              <div className="glass-bar">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  aria-label="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <button className="pill" type="submit">Get Started</button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="footer reveal reveal-up reveal-footer">
        © {new Date().getFullYear()} Flowstate — engineered for deep work.
      </footer>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Onest:wght@400;500&display=swap');

  :root {
    --hero-base:          #04050c;
    --heading:            #eef0f6;
    --body-muted:         #b9becf;
    --on-media:           #ffffff;
    --action-inverse:     #ffffff;
    --action-inverse-fg:  #2f2f33;
    --glass-fill:         rgba(255,255,255,0.08);
    --glass-border:       rgba(255,255,255,0.16);
    --scrim:              rgba(4,5,12,0.46);
    --scrim-strong:       rgba(4,5,12,0.68);
    --scrim-soft:         rgba(4,5,12,0.12);
    --duration-fast:      150ms;
    --ease-entrance:      cubic-bezier(0.2, 0, 0, 1);
  }

  /* ── Reset & base ── */
  .flowstate-container {
    font-family: "Onest", sans-serif;
    font-weight: 400;
    background: var(--hero-base);
    color: var(--heading);
    overflow-x: hidden;
    min-height: 100vh;
    position: relative;
  }
  .flowstate-container * { margin: 0; box-sizing: border-box; }
  .flowstate-container a { color: inherit; text-decoration: none; }
  .flowstate-container button { font: inherit; border: none; background: none; cursor: pointer; }
  .flowstate-container input { font: inherit; border: none; }

  /* ── Background canvas & scrim (fixed, behind everything) ── */
  .flowstate-container .fluid-canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }
  .flowstate-container .scrim {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: radial-gradient(115% 95% at 50% 46%,
      var(--scrim-strong) 0%, var(--scrim-strong) 24%, var(--scrim) 52%, var(--scrim-soft) 100%);
  }

  /* ── Nav ── */
  .flowstate-container .nav {
    position: fixed;
    inset-inline: 0;
    top: 0;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem;
  }
  @media (min-width: 640px) { .flowstate-container .nav { padding: 1.75rem 2.5rem; } }

  .flowstate-container .brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 500;
    font-size: 1.15rem;
    color: var(--on-media);
    letter-spacing: -0.01em;
  }
  .flowstate-container .brand svg { width: 1.35rem; height: 1.35rem; stroke: currentColor; }
  @media (min-width: 640px) {
    .flowstate-container .brand { font-size: 1.375rem; }
    .flowstate-container .brand svg { width: 1.5rem; height: 1.5rem; }
  }

  .flowstate-container .nav-links {
    display: none;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 3rem;
    align-items: center;
    gap: 2.25rem;
    border-radius: 9999px;
    border: 1px solid var(--glass-border);
    background: var(--glass-fill);
    padding: 0 1.75rem;
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
  }
  @media (min-width: 640px) { .flowstate-container .nav-links { display: flex; } }
  .flowstate-container .nav-links a {
    font-size: 0.95rem;
    color: var(--body-muted);
    white-space: nowrap;
    transition: color var(--duration-fast) var(--ease-entrance);
  }
  .flowstate-container .nav-links a:hover { color: var(--heading); }
  .flowstate-container .nav-links a.nav-active { color: var(--heading); font-weight: 500; }

  .flowstate-container .pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 2.5rem;
    border-radius: 9999px;
    background: var(--action-inverse);
    padding: 0 1.125rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--action-inverse-fg);
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
    transition: background var(--duration-fast) var(--ease-entrance);
    white-space: nowrap;
  }
  @media (min-width: 640px) {
    .flowstate-container .pill { height: 2.75rem; padding: 0 1.375rem; font-size: 0.95rem; }
  }
  .flowstate-container .pill:hover { background: rgba(255,255,255,0.85); }
  .flowstate-container .pill:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(255,255,255,.7); }

  /* ── Main layout ── */
  .flowstate-container .hiw-main {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 5rem;
  }
  @media (min-width: 640px) { .flowstate-container .hiw-main { padding-top: 7rem; } }

  /* ── Hero section ── */
  .flowstate-container .hiw-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 4rem 1.25rem 3rem;
    width: 100%;
    max-width: 52rem;
  }
  @media (min-width: 640px) { .flowstate-container .hiw-hero { padding: 5rem 2.5rem 4rem; } }

  .flowstate-container .badge {
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    border: 1px solid var(--glass-border);
    background: var(--glass-fill);
    padding: 0.4rem 0.875rem;
    font-size: 0.72rem;
    color: var(--body-muted);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    letter-spacing: 0.02em;
  }
  @media (min-width: 640px) { .flowstate-container .badge { font-size: 0.8rem; } }

  .flowstate-container .heading {
    margin-top: 1.25rem;
    font-size: 2rem;
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--heading);
    text-align: center;
  }
  @media (min-width: 640px)  { .flowstate-container .heading { margin-top: 1.75rem; font-size: 3.5rem; } }
  @media (min-width: 1024px) { .flowstate-container .heading { font-size: 4.5rem; } }

  .flowstate-container .subline {
    margin-top: 1rem;
    max-width: 36rem;
    font-size: 1rem;
    line-height: 1.6;
    color: var(--body-muted);
    text-align: center;
  }
  @media (min-width: 640px)  { .flowstate-container .subline { margin-top: 1.25rem; font-size: 1.1rem; } }
  @media (min-width: 1024px) { .flowstate-container .subline { font-size: 1.2rem; } }

  /* ── Steps ── */
  .flowstate-container .steps-section {
    width: 100%;
    max-width: 72rem;
    padding: 0 1.25rem 5rem;
  }
  @media (min-width: 640px)  { .flowstate-container .steps-section { padding: 0 2.5rem 6rem; } }
  @media (min-width: 1024px) { .flowstate-container .steps-section { padding: 0 3rem 8rem; } }

  .flowstate-container .steps-grid {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  @media (min-width: 768px) { .flowstate-container .steps-grid { gap: 2rem; } }

  .flowstate-container .step-card {
    border-radius: 1.25rem;
    border: 1px solid var(--glass-border);
    background: var(--glass-fill);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    animation: cardIn 0.7s cubic-bezier(0.33,1,0.68,1) both;
  }
  @media (min-width: 640px) { .flowstate-container .step-card { padding: 2rem 2.25rem; } }
  @media (min-width: 1024px) {
    .flowstate-container .step-card { padding: 2.25rem 2.5rem; }
    .flowstate-container .step-body { gap: 3rem; }
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .flowstate-container .step-meta {
    display: flex;
    align-items: center;
    gap: 0.875rem;
  }
  .flowstate-container .step-num {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.3);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 9999px;
    padding: 0.2rem 0.6rem;
  }
  .flowstate-container .step-tag {
    font-size: 0.78rem;
    color: var(--body-muted);
    letter-spacing: 0.02em;
  }
  @media (min-width: 640px) { .flowstate-container .step-tag { font-size: 0.85rem; } }

  .flowstate-container .step-body {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  @media (min-width: 768px) {
    .flowstate-container .step-body {
      flex-direction: row;
      align-items: center;
      gap: 2rem;
    }
    .flowstate-container .step-text { flex: 1 1 0; }
    .flowstate-container .step-visual-wrap { flex: 0 0 auto; }
  }

  .flowstate-container .step-headline {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.25;
    letter-spacing: -0.015em;
    color: var(--heading);
    margin-bottom: 0.625rem;
  }
  @media (min-width: 640px) { .flowstate-container .step-headline { font-size: 1.5rem; } }
  @media (min-width: 1024px) { .flowstate-container .step-headline { font-size: 1.75rem; } }

  .flowstate-container .step-desc {
    font-size: 0.9rem;
    line-height: 1.65;
    color: var(--body-muted);
  }
  @media (min-width: 640px) { .flowstate-container .step-desc { font-size: 0.975rem; } }

  /* ── Step Visuals shared base ── */
  .flowstate-container .step-visual {
    border-radius: 0.875rem;
    border: 1px solid var(--glass-border);
    background: rgba(255,255,255,0.05);
    padding: 1.25rem;
    min-height: 9rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  @media (min-width: 768px) { .flowstate-container .step-visual { width: 17rem; min-height: 10rem; } }
  @media (min-width: 1024px) { .flowstate-container .step-visual { width: 20rem; } }

  /* ── Distraction visual ── */
  .flowstate-container .dv-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .flowstate-container .dv-label {
    font-size: 0.7rem;
    color: var(--body-muted);
    letter-spacing: 0.03em;
  }
  .flowstate-container .dv-count {
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--heading);
    min-width: 2rem;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  .flowstate-container .dv-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    flex: 1;
  }
  .flowstate-container .dv-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.6rem;
    border-radius: 0.5rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    font-size: 0.72rem;
    animation: slideItemIn 0.5s cubic-bezier(0.33,1,0.68,1) both;
  }
  @keyframes slideItemIn {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .flowstate-container .dv-icon { flex-shrink: 0; }
  .flowstate-container .dv-name { flex: 1; color: var(--body-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .flowstate-container .dv-time { color: rgba(255,255,255,0.25); flex-shrink: 0; }
  .flowstate-container .dv-blocked {
    flex-shrink: 0;
    font-size: 0.62rem;
    font-weight: 500;
    color: #5be4a2;
    background: rgba(91,228,162,0.12);
    border: 1px solid rgba(91,228,162,0.22);
    border-radius: 9999px;
    padding: 0.1rem 0.4rem;
    letter-spacing: 0.03em;
  }
  .flowstate-container .dv-shield {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.7rem;
    color: rgba(255,255,255,0.35);
  }
  .flowstate-container .dv-shield svg { width: 1rem; height: 1rem; stroke: #5be4a2; }

  /* ── Timer visual ── */
  .flowstate-container .timer-visual { align-items: center; }
  .flowstate-container .tv-ring-wrap {
    position: relative;
    width: 7rem;
    height: 7rem;
    flex-shrink: 0;
  }
  .flowstate-container .tv-svg { width: 100%; height: 100%; }
  .flowstate-container .tv-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .flowstate-container .tv-pct {
    font-size: 1.35rem;
    font-weight: 500;
    color: var(--heading);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
  .flowstate-container .tv-sub {
    font-size: 0.62rem;
    color: var(--body-muted);
    margin-top: 0.15rem;
  }
  .flowstate-container .tv-phase {
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.02em;
  }
  .flowstate-container .tv-labels {
    display: flex;
    gap: 0.5rem;
  }
  .flowstate-container .tv-tag {
    font-size: 0.65rem;
    color: var(--body-muted);
    border: 1px solid var(--glass-border);
    border-radius: 9999px;
    padding: 0.15rem 0.5rem;
    letter-spacing: 0.02em;
  }

  /* ── Fluid visual ── */
  .flowstate-container .fluid-visual { align-items: center; justify-content: center; }
  .flowstate-container .fv-orb {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-shrink: 0;
  }
  .flowstate-container .fv-inner {
    width: 60%;
    height: 60%;
    border-radius: 50%;
  }
  .flowstate-container .fv-chip {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid var(--glass-border);
    border-radius: 9999px;
    padding: 0.35rem 0.75rem;
    background: rgba(255,255,255,0.04);
    width: 100%;
    max-width: 14rem;
  }
  .flowstate-container .fv-dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .flowstate-container .fv-text {
    font-size: 0.72rem;
    color: var(--body-muted);
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .flowstate-container .fv-bar {
    width: 3.5rem;
    height: 0.25rem;
    border-radius: 9999px;
    background: rgba(255,255,255,0.1);
    overflow: hidden;
    flex-shrink: 0;
  }
  .flowstate-container .fv-fill {
    height: 100%;
    border-radius: 9999px;
  }
  .flowstate-container .fv-hint {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.25);
    text-align: center;
    letter-spacing: 0.02em;
  }

  /* ── Metrics visual ── */
  .flowstate-container .mv-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .flowstate-container .mv-stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .flowstate-container .mv-val {
    font-size: 1.75rem;
    font-weight: 500;
    color: var(--heading);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
  .flowstate-container .mv-unit {
    font-size: 1rem;
    font-weight: 400;
    color: var(--body-muted);
  }
  .flowstate-container .mv-label {
    font-size: 0.65rem;
    color: var(--body-muted);
    margin-top: 0.2rem;
    text-align: center;
    letter-spacing: 0.02em;
  }
  .flowstate-container .mv-divider {
    width: 1px;
    height: 2.5rem;
    background: var(--glass-border);
    flex-shrink: 0;
  }
  .flowstate-container .mv-chart {
    display: flex;
    align-items: flex-end;
    gap: 0.3rem;
    height: 3rem;
    flex: 1;
  }
  .flowstate-container .mv-bar-wrap {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: flex-end;
  }
  .flowstate-container .mv-bar {
    width: 100%;
    border-radius: 0.2rem 0.2rem 0 0;
    min-height: 3px;
  }
  .flowstate-container .mv-caption {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.25);
    letter-spacing: 0.02em;
    text-align: right;
  }

  /* ── Section shared labels ── */
  .flowstate-container .section-eyebrow {
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--body-muted);
    margin-bottom: 0.75rem;
  }
  .flowstate-container .section-heading {
    font-size: 1.75rem;
    font-weight: 500;
    letter-spacing: -0.018em;
    color: var(--heading);
    margin-bottom: 2.5rem;
  }
  @media (min-width: 640px) { .flowstate-container .section-heading { font-size: 2.25rem; } }

  /* ── FAQ ── */
  .flowstate-container .faq-section {
    width: 100%;
    max-width: 50rem;
    padding: 0 1.25rem 5rem;
    text-align: left;
  }
  @media (min-width: 640px)  { .flowstate-container .faq-section { padding: 0 2.5rem 6rem; } }
  @media (min-width: 1024px) { .flowstate-container .faq-section { padding: 0 3rem 8rem; } }

  .flowstate-container .faq-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--glass-border);
    border-radius: 1rem;
    overflow: hidden;
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    background: var(--glass-fill);
  }

  .flowstate-container .faq-item {
    border-bottom: 1px solid var(--glass-border);
  }
  .flowstate-container .faq-item:last-child { border-bottom: none; }

  .flowstate-container .faq-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    text-align: left;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--heading);
    background: none;
    cursor: pointer;
    transition: background var(--duration-fast) var(--ease-entrance);
  }
  @media (min-width: 640px) { .flowstate-container .faq-trigger { padding: 1.375rem 1.75rem; font-size: 1rem; } }
  .flowstate-container .faq-trigger:hover { background: rgba(255,255,255,0.04); }

  .flowstate-container .faq-icon {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    color: var(--body-muted);
    transition: transform 350ms cubic-bezier(0.33,1,0.68,1);
  }
  .flowstate-container .faq-icon svg { width: 100%; height: 100%; }
  .flowstate-container .faq-item.is-open .faq-icon { transform: rotate(180deg); }

  .flowstate-container .faq-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 420ms cubic-bezier(0.33,1,0.68,1);
  }
  .flowstate-container .faq-item.is-open .faq-body { max-height: 20rem; }
  .flowstate-container .faq-body p {
    padding: 0 1.5rem 1.375rem;
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--body-muted);
  }
  @media (min-width: 640px) { .flowstate-container .faq-body p { padding: 0 1.75rem 1.625rem; font-size: 0.95rem; } }

  /* ── CTA ── */
  .flowstate-container .cta-section {
    width: 100%;
    max-width: 50rem;
    padding: 0 1.25rem 5rem;
  }
  @media (min-width: 640px) { .flowstate-container .cta-section { padding: 0 2.5rem 6rem; } }
  @media (min-width: 1024px) { .flowstate-container .cta-section { padding: 0 3rem 8rem; } }

  .flowstate-container .cta-card {
    position: relative;
    border-radius: 1.5rem;
    border: 1px solid var(--glass-border);
    background: var(--glass-fill);
    -webkit-backdrop-filter: blur(16px);
    backdrop-filter: blur(16px);
    padding: 3rem 1.75rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    overflow: hidden;
  }
  @media (min-width: 640px) { .flowstate-container .cta-card { padding: 4rem 3rem; } }

  .flowstate-container .cta-glow {
    position: absolute;
    inset: -60px;
    background: radial-gradient(ellipse 60% 40% at 50% 80%, rgba(124,110,245,0.18) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  .flowstate-container .cta-card > * { position: relative; z-index: 1; }

  .flowstate-container .cta-badge { margin-bottom: 0.25rem; }

  .flowstate-container .cta-heading {
    font-size: 1.75rem;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: var(--heading);
    line-height: 1.15;
  }
  @media (min-width: 640px) { .flowstate-container .cta-heading { font-size: 2.5rem; } }
  @media (min-width: 1024px) { .flowstate-container .cta-heading { font-size: 3rem; } }

  .flowstate-container .cta-sub {
    font-size: 0.95rem;
    color: var(--body-muted);
    max-width: 28rem;
    line-height: 1.55;
    margin-bottom: 0.5rem;
  }

  .flowstate-container .waitlist-form { width: 37rem; max-width: 100%; }

  .flowstate-container .glass-bar {
    display: flex;
    align-items: center;
    height: 3.5rem;
    border-radius: 9999px;
    border: 1px solid var(--glass-border);
    background: rgba(255,255,255,0.06);
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    box-shadow: 0 1px 2px rgba(0,0,0,.05);
    padding-left: 1.25rem;
    padding-right: 0.35rem;
  }
  @media (min-width: 640px) { .flowstate-container .glass-bar { height: 4rem; padding-left: 1.5rem; padding-right: 0.4rem; } }
  .flowstate-container .glass-bar input {
    flex: 1;
    min-width: 0;
    height: 100%;
    background: transparent;
    color: var(--heading);
    font-size: 0.95rem;
    outline: none;
  }
  @media (min-width: 640px) { .flowstate-container .glass-bar input { font-size: 1.05rem; } }
  .flowstate-container .glass-bar input::placeholder { color: var(--body-muted); }

  /* ── Footer ── */
  .flowstate-container .footer {
    position: relative;
    z-index: 20;
    display: flex;
    justify-content: center;
    padding: 1.25rem;
    font-size: 0.72rem;
    color: var(--body-muted);
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  @media (min-width: 640px) { .flowstate-container .footer { padding: 1.5rem 2.5rem; font-size: 0.8rem; } }

  /* ── Reveal animations (matching landing page exactly) ── */
  .flowstate-container .reveal {
    opacity: 0;
    transition: opacity 700ms var(--ease-entrance), transform 700ms var(--ease-entrance);
  }
  .flowstate-container .reveal-down { transform: translateY(-0.75rem); }
  .flowstate-container .reveal-up   { transform: translateY(1.25rem); }
  .flowstate-container.is-in .reveal { opacity: 1; transform: translateY(0); }

  .flowstate-container .reveal-nav    { transition-delay: 150ms; }
  .flowstate-container .reveal-badge  { transition-delay: 320ms; }
  .flowstate-container .reveal-steps  { transition-delay: 1500ms; }
  .flowstate-container .reveal-faq    { transition-delay: 1650ms; }
  .flowstate-container .reveal-cta    { transition-delay: 1800ms; }
  .flowstate-container .reveal-footer { transition-delay: 1950ms; }

  .flowstate-container .word {
    display: inline-block;
    opacity: 0;
    transition-property: opacity, transform;
    transition-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
  }
  .flowstate-container .heading .word { transform: translateY(26px); transition-duration: 720ms; }
  .flowstate-container .subline .word { transform: translateY(14px); transition-duration: 600ms; }
  .flowstate-container.is-in .word { opacity: 1; transform: translateY(0); }

  /* ── Reduced motion ── */
  @media (prefers-reduced-motion: reduce) {
    .flowstate-container .reveal,
    .flowstate-container .word {
      transition: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
    .flowstate-container .step-card { animation: none !important; }
    .flowstate-container .dv-item { animation: none !important; }
  }
`;

// ─── WebGL Fluid Simulation ─────────────────────────────────────────────────
// Direct port from FlowstateLanding — identical config, shaders, and teardown.
function fluidSimulation(canvas: HTMLCanvasElement) {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const config = {
    SIM_RESOLUTION: 200,
    DYE_RESOLUTION: 512,
    DENSITY_DISSIPATION: 0.958,
    VELOCITY_DISSIPATION: 0.96,
    PRESSURE_DISSIPATION: 0.8,
    PRESSURE_ITERATIONS: 20,
    CURL: 42,
    SPLAT_RADIUS: 0.22,
    SHADING: true,
    COLORFUL: true,
    PAUSED: false,
    BACK_COLOR: { r: 4, g: 5, b: 12 },
    TRANSPARENT: false,
    BLOOM: false,
    BLOOM_ITERATIONS: 8,
    BLOOM_RESOLUTION: 256,
    BLOOM_INTENSITY: 0.8,
    BLOOM_THRESHOLD: 0.8,
    BLOOM_SOFT_KNEE: 0.7,
  };

  interface Color { r: number; g: number; b: number; }

  class PointerPrototype {
    id = -1; x = 0; y = 0; dx = 0; dy = 0;
    down = false; moved = false; everMoved = false;
    color: Color = { r: 30, g: 0, b: 300 };
  }

  const pointers: PointerPrototype[] = [new PointerPrototype()];
  const splatStack: number[] = [];
  const bloomFramebuffers: any[] = [];

  const { gl, ext } = getWebGLContext(canvas);
  if (isMobile()) config.SHADING = false;
  if (!ext.supportLinearFiltering) { config.SHADING = false; config.BLOOM = false; }

  function getWebGLContext(canvas: HTMLCanvasElement): any {
    const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
    let gl = canvas.getContext('webgl2', params) as any;
    const isWebGL2 = !!gl;
    if (!isWebGL2) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
    let halfFloat: any, supportLinearFiltering: any;
    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
    } else {
      halfFloat = gl.getExtension('OES_texture_half_float');
      supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;
    let formatRGBA, formatRG, formatR;
    if (isWebGL2) {
      formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
      formatRG   = getSupportedFormat(gl, gl.RG16F,   gl.RG,   halfFloatTexType);
      formatR    = getSupportedFormat(gl, gl.R16F,    gl.RED,  halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG   = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatR    = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    }
    return { gl, ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering } };
  }

  function getSupportedFormat(gl: any, internalFormat: number, format: number, type: number): any {
    if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
      switch (internalFormat) {
        case gl.R16F:  return getSupportedFormat(gl, gl.RG16F,   gl.RG,   type);
        case gl.RG16F: return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
        default: return null;
      }
    }
    return { internalFormat, format };
  }

  function supportRenderTextureFormat(gl: any, internalFormat: number, format: number, type: number) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  }

  function isMobile() { return /Mobi|Android/i.test(navigator.userAgent); }

  class GLProgram {
    program: any; uniforms: any = {};
    constructor(vs: any, fs: any) {
      this.program = gl.createProgram();
      gl.attachShader(this.program, vs);
      gl.attachShader(this.program, fs);
      gl.linkProgram(this.program);
      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) throw gl.getProgramInfoLog(this.program);
      const n = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const name = gl.getActiveUniform(this.program, i).name;
        this.uniforms[name] = gl.getUniformLocation(this.program, name);
      }
    }
    bind() { gl.useProgram(this.program); }
  }

  function compileShader(type: number, src: string) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(s);
    return s;
  }

  const baseVS = compileShader(gl.VERTEX_SHADER, `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv, vL, vR, vT, vB;
    uniform vec2 texelSize;
    void main(){vUv=aPosition*.5+.5;vL=vUv-vec2(texelSize.x,0.);vR=vUv+vec2(texelSize.x,0.);vT=vUv+vec2(0.,texelSize.y);vB=vUv-vec2(0.,texelSize.y);gl_Position=vec4(aPosition,0.,1.);}
  `);
  const clearFS      = compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;uniform float value;void main(){gl_FragColor=value*texture2D(uTexture,vUv);}`);
  const colorFS      = compileShader(gl.FRAGMENT_SHADER, `precision mediump float;uniform vec4 color;void main(){gl_FragColor=color;}`);
  const backgroundFS = compileShader(gl.FRAGMENT_SHADER, `precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTexture;uniform float aspectRatio;#define SCALE 25.0\nvoid main(){vec2 uv=floor(vUv*SCALE*vec2(aspectRatio,1.));float v=mod(uv.x+uv.y,2.)*0.1+0.8;gl_FragColor=vec4(vec3(v),1.);}`);
  const displayFS    = compileShader(gl.FRAGMENT_SHADER, `precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTexture;void main(){vec3 C=texture2D(uTexture,vUv).rgb;float a=max(C.r,max(C.g,C.b));gl_FragColor=vec4(C,a);}`);
  const displayBloomFS = compileShader(gl.FRAGMENT_SHADER, `precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTexture,uBloom,uDithering;uniform vec2 ditherScale;void main(){vec3 C=texture2D(uTexture,vUv).rgb;vec3 bloom=texture2D(uBloom,vUv).rgb;vec3 noise=texture2D(uDithering,vUv*ditherScale).rgb;noise=noise*2.-1.;bloom+=noise/800.;bloom=pow(bloom.rgb,vec3(1./2.2));C+=bloom;float a=max(C.r,max(C.g,C.b));gl_FragColor=vec4(C,a);}`);
  const displayShadingFS = compileShader(gl.FRAGMENT_SHADER, `precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uTexture;uniform vec2 texelSize;void main(){vec3 L=texture2D(uTexture,vL).rgb;vec3 R=texture2D(uTexture,vR).rgb;vec3 T=texture2D(uTexture,vT).rgb;vec3 B=texture2D(uTexture,vB).rgb;vec3 C=texture2D(uTexture,vUv).rgb;float dx=length(R)-length(L);float dy=length(T)-length(B);vec3 n=normalize(vec3(dx,dy,length(texelSize)));float d=clamp(dot(n,vec3(0.,0.,1.))+.7,.7,1.);C*=d;float a=max(C.r,max(C.g,C.b));gl_FragColor=vec4(C,a);}`);
  const displayBloomShadingFS = compileShader(gl.FRAGMENT_SHADER, `precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uTexture,uBloom,uDithering;uniform vec2 ditherScale,texelSize;void main(){vec3 L=texture2D(uTexture,vL).rgb;vec3 R=texture2D(uTexture,vR).rgb;vec3 T=texture2D(uTexture,vT).rgb;vec3 B=texture2D(uTexture,vB).rgb;vec3 C=texture2D(uTexture,vUv).rgb;float dx=length(R)-length(L);float dy=length(T)-length(B);vec3 n=normalize(vec3(dx,dy,length(texelSize)));float d=clamp(dot(n,vec3(0.,0.,1.))+.7,.7,1.);C*=d;vec3 bloom=texture2D(uBloom,vUv).rgb;vec3 noise=texture2D(uDithering,vUv*ditherScale).rgb;noise=noise*2.-1.;bloom+=noise/800.;bloom=pow(bloom.rgb,vec3(1./2.2));C+=bloom;float a=max(C.r,max(C.g,C.b));gl_FragColor=vec4(C,a);}`);
  const bloomPrefilterFS = compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying vec2 vUv;uniform sampler2D uTexture;uniform vec3 curve;uniform float threshold;void main(){vec3 c=texture2D(uTexture,vUv).rgb;float br=max(c.r,max(c.g,c.b));float rq=clamp(br-curve.x,0.,curve.y);rq=curve.z*rq*rq;c*=max(rq,br-threshold)/max(br,.0001);gl_FragColor=vec4(c,0.);}`);
  const bloomBlurFS  = compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying vec2 vL,vR,vT,vB;uniform sampler2D uTexture;void main(){vec4 s=vec4(0.);s+=texture2D(uTexture,vL);s+=texture2D(uTexture,vR);s+=texture2D(uTexture,vT);s+=texture2D(uTexture,vB);gl_FragColor=s*.25;}`);
  const bloomFinalFS = compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying vec2 vL,vR,vT,vB;uniform sampler2D uTexture;uniform float intensity;void main(){vec4 s=vec4(0.);s+=texture2D(uTexture,vL);s+=texture2D(uTexture,vR);s+=texture2D(uTexture,vT);s+=texture2D(uTexture,vB);gl_FragColor=s*.25*intensity;}`);
  const splatFS = compileShader(gl.FRAGMENT_SHADER, `precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uTarget;uniform float aspectRatio;uniform vec3 color;uniform vec2 point;uniform float radius;void main(){vec2 p=vUv-point.xy;p.x*=aspectRatio;vec3 splat=exp(-dot(p,p)/radius)*color;vec3 base=texture2D(uTarget,vUv).xyz;gl_FragColor=vec4(base+splat,1.);}`);
  const advectionManualFS = compileShader(gl.FRAGMENT_SHADER, `precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uVelocity,uSource;uniform vec2 texelSize,dyeTexelSize;uniform float dt,dissipation;vec4 bilerp(sampler2D sam,vec2 uv,vec2 tsize){vec2 st=uv/tsize-.5;vec2 iuv=floor(st);vec2 fuv=fract(st);vec4 a=texture2D(sam,(iuv+vec2(.5,.5))*tsize);vec4 b=texture2D(sam,(iuv+vec2(1.5,.5))*tsize);vec4 c=texture2D(sam,(iuv+vec2(.5,1.5))*tsize);vec4 d=texture2D(sam,(iuv+vec2(1.5,1.5))*tsize);return mix(mix(a,b,fuv.x),mix(c,d,fuv.x),fuv.y);}void main(){vec2 coord=vUv-dt*bilerp(uVelocity,vUv,texelSize).xy*texelSize;gl_FragColor=dissipation*bilerp(uSource,coord,dyeTexelSize);gl_FragColor.a=1.;}`);
  const advectionFS = compileShader(gl.FRAGMENT_SHADER, `precision highp float;precision highp sampler2D;varying vec2 vUv;uniform sampler2D uVelocity,uSource;uniform vec2 texelSize;uniform float dt,dissipation;void main(){vec2 coord=vUv-dt*texture2D(uVelocity,vUv).xy*texelSize;gl_FragColor=dissipation*texture2D(uSource,coord);gl_FragColor.a=1.;}`);
  const divergenceFS = compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).x;float R=texture2D(uVelocity,vR).x;float T=texture2D(uVelocity,vT).y;float B=texture2D(uVelocity,vB).y;vec2 C=texture2D(uVelocity,vUv).xy;if(vL.x<0.){L=-C.x;}if(vR.x>1.){R=-C.x;}if(vT.y>1.){T=-C.y;}if(vB.y<0.){B=-C.y;}gl_FragColor=vec4(.5*(R-L+T-B),0.,0.,1.);}`);
  const curlFS = compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity;void main(){float L=texture2D(uVelocity,vL).y;float R=texture2D(uVelocity,vR).y;float T=texture2D(uVelocity,vT).x;float B=texture2D(uVelocity,vB).x;gl_FragColor=vec4(.5*(R-L-T+B),0.,0.,1.);}`);
  const vorticityFS = compileShader(gl.FRAGMENT_SHADER, `precision highp float;precision highp sampler2D;varying vec2 vUv,vL,vR,vT,vB;uniform sampler2D uVelocity,uCurl;uniform float curl,dt;void main(){float L=texture2D(uCurl,vL).x;float R=texture2D(uCurl,vR).x;float T=texture2D(uCurl,vT).x;float B=texture2D(uCurl,vB).x;float C=texture2D(uCurl,vUv).x;vec2 force=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));force/=length(force)+.0001;force*=curl*C;force.y*=-1.;vec2 vel=texture2D(uVelocity,vUv).xy;gl_FragColor=vec4(vel+force*dt,0.,1.);}`);
  const pressureFS = compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uDivergence;void main(){float L=texture2D(uPressure,vL).x;float R=texture2D(uPressure,vR).x;float T=texture2D(uPressure,vT).x;float B=texture2D(uPressure,vB).x;float div=texture2D(uDivergence,vUv).x;gl_FragColor=vec4((L+R+B+T-div)*.25,0.,0.,1.);}`);
  const gradSubFS = compileShader(gl.FRAGMENT_SHADER, `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv,vL,vR,vT,vB;uniform sampler2D uPressure,uVelocity;void main(){float L=texture2D(uPressure,vL).x;float R=texture2D(uPressure,vR).x;float T=texture2D(uPressure,vT).x;float B=texture2D(uPressure,vB).x;vec2 vel=texture2D(uVelocity,vUv).xy;vel.xy-=vec2(R-L,T-B);gl_FragColor=vec4(vel,0.,1.);}`);

  const blit = (() => {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    return (dest: any) => { gl.bindFramebuffer(gl.FRAMEBUFFER, dest); gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0); };
  })();

  let simWidth: number, simHeight: number, dyeWidth: number, dyeHeight: number;
  let density: any, velocity: any, divergence: any, curl: any, pressure: any, bloom: any;

  const clearP     = new GLProgram(baseVS, clearFS);
  const colorP     = new GLProgram(baseVS, colorFS);
  const bgP        = new GLProgram(baseVS, backgroundFS);
  const displayP   = new GLProgram(baseVS, displayFS);
  const displayBP  = new GLProgram(baseVS, displayBloomFS);
  const displaySP  = new GLProgram(baseVS, displayShadingFS);
  const displayBSP = new GLProgram(baseVS, displayBloomShadingFS);
  const bpfP       = new GLProgram(baseVS, bloomPrefilterFS);
  const bbP        = new GLProgram(baseVS, bloomBlurFS);
  const bfP        = new GLProgram(baseVS, bloomFinalFS);
  const splatP     = new GLProgram(baseVS, splatFS);
  const advP       = new GLProgram(baseVS, ext.supportLinearFiltering ? advectionFS : advectionManualFS);
  const divP       = new GLProgram(baseVS, divergenceFS);
  const curlP      = new GLProgram(baseVS, curlFS);
  const vortP      = new GLProgram(baseVS, vorticityFS);
  const presP      = new GLProgram(baseVS, pressureFS);
  const gradP      = new GLProgram(baseVS, gradSubFS);

  const ditheringTexture = createNoiseTexture(256);

  function createNoiseTexture(size: number) {
    const data = new Uint8Array(size * size * 3);
    for (let i = 0; i < data.length; i++) data[i] = Math.floor(Math.random() * 256);
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, size, size, 0, gl.RGB, gl.UNSIGNED_BYTE, data);
    return { texture: t, width: size, height: size, attach(id: number) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, t); return id; } };
  }

  function initFramebuffers() {
    const simRes = getResolution(config.SIM_RESOLUTION);
    const dyeRes = getResolution(config.DYE_RESOLUTION);
    simWidth = simRes.width; simHeight = simRes.height;
    dyeWidth = dyeRes.width; dyeHeight = dyeRes.height;
    const tt = ext.halfFloatTexType, rgba = ext.formatRGBA, rg = ext.formatRG, r = ext.formatR;
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
    if (!density) density = createDoubleFBO(dyeWidth, dyeHeight, rgba.internalFormat, rgba.format, tt, filtering);
    else density = resizeDoubleFBO(density, dyeWidth, dyeHeight, rgba.internalFormat, rgba.format, tt, filtering);
    if (!velocity) velocity = createDoubleFBO(simWidth, simHeight, rg.internalFormat, rg.format, tt, filtering);
    else velocity = resizeDoubleFBO(velocity, simWidth, simHeight, rg.internalFormat, rg.format, tt, filtering);
    divergence = createFBO(simWidth, simHeight, r.internalFormat, r.format, tt, gl.NEAREST);
    curl = createFBO(simWidth, simHeight, r.internalFormat, r.format, tt, gl.NEAREST);
    pressure = createDoubleFBO(simWidth, simHeight, r.internalFormat, r.format, tt, gl.NEAREST);
    initBloomFramebuffers();
  }

  function initBloomFramebuffers() {
    const res = getResolution(config.BLOOM_RESOLUTION);
    const tt = ext.halfFloatTexType, rgba = ext.formatRGBA;
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
    bloom = createFBO(res.width, res.height, rgba.internalFormat, rgba.format, tt, filtering);
    bloomFramebuffers.length = 0;
    for (let i = 0; i < config.BLOOM_ITERATIONS; i++) {
      const w = res.width >> (i + 1), h = res.height >> (i + 1);
      if (w < 2 || h < 2) break;
      bloomFramebuffers.push(createFBO(w, h, rgba.internalFormat, rgba.format, tt, filtering));
    }
  }

  function createFBO(w: number, h: number, iF: number, f: number, type: number, param: number) {
    gl.activeTexture(gl.TEXTURE0);
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, iF, w, h, 0, f, type, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    gl.viewport(0, 0, w, h); gl.clear(gl.COLOR_BUFFER_BIT);
    return { texture: t, fbo, width: w, height: h, attach(id: number) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, t); return id; } };
  }

  function createDoubleFBO(w: number, h: number, iF: number, f: number, type: number, param: number) {
    let a = createFBO(w, h, iF, f, type, param), b = createFBO(w, h, iF, f, type, param);
    return { get read() { return a; }, set read(v) { a = v; }, get write() { return b; }, set write(v) { b = v; }, swap() { const t = a; a = b; b = t; } };
  }

  function resizeFBO(target: any, w: number, h: number, iF: number, f: number, type: number, param: number) {
    const nf = createFBO(w, h, iF, f, type, param);
    clearP.bind(); gl.uniform1i(clearP.uniforms.uTexture, target.attach(0)); gl.uniform1f(clearP.uniforms.value, 1); blit(nf.fbo);
    return nf;
  }
  function resizeDoubleFBO(target: any, w: number, h: number, iF: number, f: number, type: number, param: number) {
    target.read = resizeFBO(target.read, w, h, iF, f, type, param);
    target.write = createFBO(w, h, iF, f, type, param);
    return target;
  }

  initFramebuffers();
  multipleSplats(34);
  for (let i = 0; i < 8; i++) splatStack.push(10 + parseInt((Math.random() * 10).toString(), 10));

  let lastColorChangeTime = Date.now();
  let virtualSeeded = false, orbitAngle = 0, vPrevX = 0, vPrevY = 0;
  let virtualColor: any = null, lastVColorTime = 0;
  const engineStart = Date.now();
  const ORBIT_RADIUS = 300, ORBIT_SPEED = 0.026, ORBIT_START_DELAY = 700;
  let rafHandle = 0, destroyed = false;

  update();

  function update() {
    if (destroyed) return;
    resizeCanvas(); driveVirtualPointer(); input();
    if (!config.PAUSED) step(0.016);
    render(null);
    rafHandle = requestAnimationFrame(update);
  }

  function driveVirtualPointer() {
    if (Date.now() - engineStart < ORBIT_START_DELAY) return;
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const base = Math.min(ORBIT_RADIUS, canvas.width * 0.35, canvas.height * 0.35);
    const r = base * (0.72 + 0.28 * Math.sin(orbitAngle * 0.37));
    orbitAngle += ORBIT_SPEED;
    const x = cx + Math.cos(orbitAngle) * r, y = cy + Math.sin(orbitAngle) * r;
    if (!virtualSeeded) { virtualSeeded = true; vPrevX = x; vPrevY = y; return; }
    if (!virtualColor || Date.now() - lastVColorTime > 120) {
      virtualColor = generateColor();
      virtualColor.r *= 3.2; virtualColor.g *= 3.2; virtualColor.b *= 3.2;
      lastVColorTime = Date.now();
    }
    splat(x, y, (x - vPrevX) * 9.0, (y - vPrevY) * 9.0, virtualColor);
    vPrevX = x; vPrevY = y;
  }

  function input() {
    if (splatStack.length > 0) multipleSplats(splatStack.pop() || 0);
    for (const p of pointers) { if (p.moved) { splat(p.x, p.y, p.dx, p.dy, p.color); p.moved = false; } }
    if (!config.COLORFUL) return;
    if (lastColorChangeTime + 100 < Date.now()) {
      lastColorChangeTime = Date.now();
      for (const p of pointers) p.color = generateColor();
    }
  }

  function step(dt: number) {
    gl.disable(gl.BLEND); gl.viewport(0, 0, simWidth, simHeight);
    curlP.bind(); gl.uniform2f(curlP.uniforms.texelSize, 1/simWidth, 1/simHeight); gl.uniform1i(curlP.uniforms.uVelocity, velocity.read.attach(0)); blit(curl.fbo);
    vortP.bind(); gl.uniform2f(vortP.uniforms.texelSize, 1/simWidth, 1/simHeight); gl.uniform1i(vortP.uniforms.uVelocity, velocity.read.attach(0)); gl.uniform1i(vortP.uniforms.uCurl, curl.attach(1)); gl.uniform1f(vortP.uniforms.curl, config.CURL); gl.uniform1f(vortP.uniforms.dt, dt); blit(velocity.write.fbo); velocity.swap();
    divP.bind(); gl.uniform2f(divP.uniforms.texelSize, 1/simWidth, 1/simHeight); gl.uniform1i(divP.uniforms.uVelocity, velocity.read.attach(0)); blit(divergence.fbo);
    clearP.bind(); gl.uniform1i(clearP.uniforms.uTexture, pressure.read.attach(0)); gl.uniform1f(clearP.uniforms.value, config.PRESSURE_DISSIPATION); blit(pressure.write.fbo); pressure.swap();
    presP.bind(); gl.uniform2f(presP.uniforms.texelSize, 1/simWidth, 1/simHeight); gl.uniform1i(presP.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) { gl.uniform1i(presP.uniforms.uPressure, pressure.read.attach(1)); blit(pressure.write.fbo); pressure.swap(); }
    gradP.bind(); gl.uniform2f(gradP.uniforms.texelSize, 1/simWidth, 1/simHeight); gl.uniform1i(gradP.uniforms.uPressure, pressure.read.attach(0)); gl.uniform1i(gradP.uniforms.uVelocity, velocity.read.attach(1)); blit(velocity.write.fbo); velocity.swap();
    advP.bind(); gl.uniform2f(advP.uniforms.texelSize, 1/simWidth, 1/simHeight);
    if (!ext.supportLinearFiltering) gl.uniform2f(advP.uniforms.dyeTexelSize, 1/simWidth, 1/simHeight);
    const vid = velocity.read.attach(0); gl.uniform1i(advP.uniforms.uVelocity, vid); gl.uniform1i(advP.uniforms.uSource, vid); gl.uniform1f(advP.uniforms.dt, dt); gl.uniform1f(advP.uniforms.dissipation, config.VELOCITY_DISSIPATION); blit(velocity.write.fbo); velocity.swap();
    gl.viewport(0, 0, dyeWidth, dyeHeight);
    if (!ext.supportLinearFiltering) gl.uniform2f(advP.uniforms.dyeTexelSize, 1/dyeWidth, 1/dyeHeight);
    gl.uniform1i(advP.uniforms.uVelocity, velocity.read.attach(0)); gl.uniform1i(advP.uniforms.uSource, density.read.attach(1)); gl.uniform1f(advP.uniforms.dissipation, config.DENSITY_DISSIPATION); blit(density.write.fbo); density.swap();
  }

  function render(target: any) {
    if (config.BLOOM) applyBloom(density.read, bloom);
    if (target == null || !config.TRANSPARENT) { gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.BLEND); } else { gl.disable(gl.BLEND); }
    const w = target == null ? gl.drawingBufferWidth : dyeWidth;
    const h = target == null ? gl.drawingBufferHeight : dyeHeight;
    gl.viewport(0, 0, w, h);
    if (!config.TRANSPARENT) { colorP.bind(); const bc = config.BACK_COLOR; gl.uniform4f(colorP.uniforms.color, bc.r/255, bc.g/255, bc.b/255, 1); blit(target); }
    if (target == null && config.TRANSPARENT) { bgP.bind(); gl.uniform1f(bgP.uniforms.aspectRatio, canvas.width/canvas.height); blit(null); }
    if (config.SHADING) {
      const prog = config.BLOOM ? displayBSP : displaySP;
      prog.bind(); gl.uniform2f(prog.uniforms.texelSize, 1/w, 1/h); gl.uniform1i(prog.uniforms.uTexture, density.read.attach(0));
      if (config.BLOOM) { gl.uniform1i(prog.uniforms.uBloom, bloom.attach(1)); gl.uniform1i(prog.uniforms.uDithering, ditheringTexture.attach(2)); const sc = getTextureScale(ditheringTexture, w, h); gl.uniform2f(prog.uniforms.ditherScale, sc.x, sc.y); }
    } else {
      const prog = config.BLOOM ? displayBP : displayP;
      prog.bind(); gl.uniform1i(prog.uniforms.uTexture, density.read.attach(0));
      if (config.BLOOM) { gl.uniform1i(prog.uniforms.uBloom, bloom.attach(1)); gl.uniform1i(prog.uniforms.uDithering, ditheringTexture.attach(2)); const sc = getTextureScale(ditheringTexture, w, h); gl.uniform2f(prog.uniforms.ditherScale, sc.x, sc.y); }
    }
    blit(target);
  }

  function applyBloom(source: any, destination: any) {
    if (bloomFramebuffers.length < 2) return;
    let last = destination;
    gl.disable(gl.BLEND);
    bpfP.bind();
    const knee = config.BLOOM_THRESHOLD * config.BLOOM_SOFT_KNEE + 0.0001;
    gl.uniform3f(bpfP.uniforms.curve, config.BLOOM_THRESHOLD - knee, knee * 2, 0.25 / knee);
    gl.uniform1f(bpfP.uniforms.threshold, config.BLOOM_THRESHOLD);
    gl.uniform1i(bpfP.uniforms.uTexture, source.attach(0));
    gl.viewport(0, 0, last.width, last.height); blit(last.fbo);
    bbP.bind();
    for (let i = 0; i < bloomFramebuffers.length; i++) {
      const dest = bloomFramebuffers[i];
      gl.uniform2f(bbP.uniforms.texelSize, 1/last.width, 1/last.height); gl.uniform1i(bbP.uniforms.uTexture, last.attach(0)); gl.viewport(0, 0, dest.width, dest.height); blit(dest.fbo); last = dest;
    }
    gl.blendFunc(gl.ONE, gl.ONE); gl.enable(gl.BLEND);
    for (let i = bloomFramebuffers.length - 2; i >= 0; i--) {
      const bt = bloomFramebuffers[i];
      gl.uniform2f(bbP.uniforms.texelSize, 1/last.width, 1/last.height); gl.uniform1i(bbP.uniforms.uTexture, last.attach(0)); gl.viewport(0, 0, bt.width, bt.height); blit(bt.fbo); last = bt;
    }
    gl.disable(gl.BLEND);
    bfP.bind(); gl.uniform2f(bfP.uniforms.texelSize, 1/last.width, 1/last.height); gl.uniform1i(bfP.uniforms.uTexture, last.attach(0)); gl.uniform1f(bfP.uniforms.intensity, config.BLOOM_INTENSITY); gl.viewport(0, 0, destination.width, destination.height); blit(destination.fbo);
  }

  function splat(x: number, y: number, dx: number, dy: number, color: Color) {
    gl.viewport(0, 0, simWidth, simHeight); splatP.bind();
    gl.uniform1i(splatP.uniforms.uTarget, velocity.read.attach(0)); gl.uniform1f(splatP.uniforms.aspectRatio, canvas.width/canvas.height);
    gl.uniform2f(splatP.uniforms.point, x/canvas.width, 1-(y/canvas.height)); gl.uniform3f(splatP.uniforms.color, dx, -dy, 1); gl.uniform1f(splatP.uniforms.radius, config.SPLAT_RADIUS/100); blit(velocity.write.fbo); velocity.swap();
    gl.viewport(0, 0, dyeWidth, dyeHeight); gl.uniform1i(splatP.uniforms.uTarget, density.read.attach(0)); gl.uniform3f(splatP.uniforms.color, color.r, color.g, color.b); blit(density.write.fbo); density.swap();
  }

  function multipleSplats(amount: number) {
    for (let i = 0; i < amount; i++) {
      const c = generateColor(); c.r *= 10; c.g *= 10; c.b *= 10;
      splat(canvas.width * Math.random(), canvas.height * Math.random(), 1000 * (Math.random()-.5), 1000 * (Math.random()-.5), c);
    }
  }

  function resizeCanvas() {
    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; initFramebuffers();
    }
  }

  function pointerPos(clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect(); return { x: clientX - rect.left, y: clientY - rect.top };
  }

  const teardown: Array<() => void> = [];
  function on(target: any, type: string, handler: EventListenerOrEventListenerObject, opts?: any) {
    target.addEventListener(type, handler, opts); teardown.push(() => target.removeEventListener(type, handler, opts));
  }

  on(window, 'mousemove', (e: any) => {
    const { x, y } = pointerPos(e.clientX, e.clientY); const p = pointers[0];
    if (!p.everMoved) { p.everMoved = true; p.x = x; p.y = y; p.down = true; return; }
    p.down = true; p.moved = true; p.dx = (x - p.x) * 5; p.dy = (y - p.y) * 5; p.x = x; p.y = y; p.color = generateColor();
  });
  on(window, 'touchmove', (e: any) => {
    const ts = e.targetTouches;
    for (let i = 0; i < ts.length; i++) {
      if (i >= pointers.length) pointers.push(new PointerPrototype());
      const p = pointers[i]; const { x, y } = pointerPos(ts[i].clientX, ts[i].clientY);
      p.down = true; p.moved = p.everMoved; p.everMoved = true; p.dx = (x - p.x) * 8; p.dy = (y - p.y) * 8; p.x = x; p.y = y;
    }
  }, { passive: true });
  on(window, 'touchstart', (e: any) => {
    const ts = e.targetTouches;
    for (let i = 0; i < ts.length; i++) {
      if (i >= pointers.length) pointers.push(new PointerPrototype());
      const p = pointers[i]; const { x, y } = pointerPos(ts[i].clientX, ts[i].clientY);
      p.id = ts[i].identifier; p.down = true; p.x = x; p.y = y; p.color = generateColor();
    }
  }, { passive: true });
  on(window, 'mouseup', () => { pointers[0].down = false; });
  on(window, 'touchend', (e: any) => {
    const ts = e.changedTouches;
    for (let i = 0; i < ts.length; i++) for (const p of pointers) if (ts[i].identifier === p.id) p.down = false;
  });

  function generateColor(): Color {
    const h = 0.5 + Math.random() * 0.42; const c = HSVtoRGB(h, 0.95, 1.0);
    c.r *= 0.92; c.g *= 0.92; c.b *= 0.92; return c;
  }
  function HSVtoRGB(h: number, s: number, v: number): Color {
    let r = 0, g = 0, b = 0; const i = Math.floor(h*6), f = h*6-i, p = v*(1-s), q = v*(1-f*s), t = v*(1-(1-f)*s);
    switch (i%6) { case 0:r=v;g=t;b=p;break; case 1:r=q;g=v;b=p;break; case 2:r=p;g=v;b=t;break; case 3:r=p;g=q;b=v;break; case 4:r=t;g=p;b=v;break; case 5:r=v;g=p;b=q;break; }
    return { r, g, b };
  }
  function getResolution(res: number) {
    let ar = gl.drawingBufferWidth / gl.drawingBufferHeight; if (ar < 1) ar = 1/ar;
    const max = Math.round(res * ar), min = Math.round(res);
    return gl.drawingBufferWidth > gl.drawingBufferHeight ? { width: max, height: min } : { width: min, height: max };
  }
  function getTextureScale(texture: any, w: number, h: number) { return { x: w/texture.width, y: h/texture.height }; }

  return function destroy() {
    destroyed = true;
    if (rafHandle) cancelAnimationFrame(rafHandle);
    for (const off of teardown) off();
  };
}
