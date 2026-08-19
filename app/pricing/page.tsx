'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';

const MONTHLY_PRICES = { solo: '$0', pro: '$12', team: '$29' };
const ANNUAL_PRICES = { solo: '$0', pro: '$10', team: '$24' };

const faqItems = [
  {
    question: 'Can I change plans later?',
    answer:
      'Yes — you can upgrade, downgrade, or switch billing cycles at any time from your account settings. Changes take effect at the start of your next billing period, and any unused credit is prorated automatically.',
  },
  {
    question: 'How does the 14-day free trial work?',
    answer:
      'Start the Deep Worker plan and get full access for 14 days — no credit card required. If you decide Flowstate isn\'t for you, just let the trial expire. No charges, no follow-up emails.',
  },
  {
    question: 'Is there a student or non-profit discount?',
    answer:
      'Yes. Students with a valid .edu email get 50% off the Deep Worker plan. Non-profits and open-source projects can apply for a custom arrangement. Reach out at hello@flowstate.app and we\'ll sort it out.',
  },
  {
    question: 'What happens to my data if I cancel?',
    answer:
      'Your session history, analytics, and settings are kept for 90 days after cancellation. You can export everything as a JSON or CSV file from your account dashboard before or after you cancel.',
  },
  {
    question: 'Do you offer a self-hosted or on-premise option?',
    answer:
      'Not yet publicly, but it\'s on the roadmap. Enterprise teams with strict data-residency requirements can get in touch to discuss early access to the on-premise beta.',
  },
];

const pricingStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { font-size: 16px; scroll-behavior: smooth; }
  @media (max-width: 1920px) { html { font-size: 0.833333vw; } }
  @media (max-width: 1440px) { html { font-size: 1.111111vw; } }
  @media (max-width: 1024px) { html { font-size: 1.5625vw; } }
  @media (max-width: 640px)  { html { font-size: 4.444444vw; } }

  :root {
    --bg:             #04050c;
    --text-primary:   #eef0f6;
    --text-muted:     #b9becf;
    --action-inv:     #ffffff;
    --action-inv-fg:  #2f2f33;
    --glass-fill:     rgba(255,255,255,0.06);
    --glass-fill-h:   rgba(255,255,255,0.10);
    --glass-border:   rgba(255,255,255,0.16);
    --glass-border-h: rgba(255,255,255,0.26);
    --scrim: radial-gradient(115% 95% at 50% 46%,
      rgba(4,5,12,0.72) 0%,
      rgba(4,5,12,0.68) 24%,
      rgba(4,5,12,0.46) 52%,
      rgba(4,5,12,0.12) 100%);
    --blur: blur(14px);
    --radius-pill: 999px;
    --radius-card: 1.25rem;
    --accent-glow: rgba(160,120,255,0.35);
  }

  body {
    font-family: 'Onest', sans-serif;
    background: var(--bg);
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  .fluid-canvas {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }
  .scrim {
    position: fixed;
    inset: 0;
    background: var(--scrim);
    z-index: 1;
    pointer-events: none;
  }

  .page {
    position: relative;
    z-index: 20;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 3rem;
    opacity: 0;
    transform: translateY(-12px);
    animation: fadeUp 0.6s ease forwards;
    animation-delay: 0.15s;
  }
  .nav-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.0625rem;
    font-weight: 500;
    color: var(--text-primary);
    text-decoration: none;
    letter-spacing: -0.01em;
  }
  .nav-logo svg { width: 1.375rem; height: 1.375rem; flex-shrink: 0; }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 0;
    background: var(--glass-fill);
    border: 1px solid var(--glass-border);
    backdrop-filter: var(--blur);
    -webkit-backdrop-filter: var(--blur);
    border-radius: var(--radius-pill);
    padding: 0.375rem 0.375rem;
  }
  .nav-links a {
    display: block;
    padding: 0.5rem 1.25rem;
    font-size: 0.9375rem;
    font-weight: 400;
    color: var(--text-muted);
    text-decoration: none;
    border-radius: var(--radius-pill);
    transition: color 0.2s, background 0.2s;
  }
  .nav-links a:hover { color: var(--text-primary); background: var(--glass-fill-h); }
  .nav-links a.active {
    color: var(--text-primary);
    background: rgba(255,255,255,0.10);
  }

  .nav-cta {
    display: inline-flex;
    align-items: center;
    padding: 0.625rem 1.375rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--action-inv-fg);
    background: var(--action-inv);
    border-radius: var(--radius-pill);
    text-decoration: none;
    transition: opacity 0.2s, transform 0.2s;
  }
  .nav-cta:hover { opacity: 0.88; transform: translateY(-1px); }

  @media (max-width: 640px) {
    nav { padding: 1rem 1.25rem; }
    .nav-links { display: none; }
  }

  .hero {
    padding-top: 10rem;
    padding-bottom: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100%;
    max-width: 56rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .badge-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 1rem;
    background: var(--glass-fill);
    border: 1px solid var(--glass-border);
    backdrop-filter: var(--blur);
    -webkit-backdrop-filter: var(--blur);
    border-radius: var(--radius-pill);
    font-size: 0.875rem;
    font-weight: 400;
    color: var(--text-muted);
    margin-bottom: 2rem;
    opacity: 0;
    animation: fadeUp 0.55s ease forwards;
    animation-delay: 0.32s;
  }

  .hero-title {
    font-size: clamp(2.5rem, 5.5vw, 4.25rem);
    font-weight: 500;
    letter-spacing: -0.03em;
    line-height: 1.08;
    color: var(--text-primary);
    margin-bottom: 1.25rem;
  }
  .hero-title .word {
    display: inline-block;
    opacity: 0;
    transform: translateY(18px);
    animation: wordUp 0.55s ease forwards;
    margin-right: 0.25rem;
  }

  .hero-sub {
    font-size: 1.0625rem;
    font-weight: 400;
    color: var(--text-muted);
    line-height: 1.65;
    max-width: 36rem;
    margin-bottom: 2.75rem;
  }
  .hero-sub .word {
    display: inline-block;
    opacity: 0;
    transform: translateY(14px);
    animation: wordUp 0.45s ease forwards;
    margin-right: 0.25rem;
  }

  .billing-toggle {
    display: inline-flex;
    align-items: center;
    background: var(--glass-fill);
    border: 1px solid var(--glass-border);
    backdrop-filter: var(--blur);
    -webkit-backdrop-filter: var(--blur);
    border-radius: var(--radius-pill);
    padding: 0.3rem;
    gap: 0;
    opacity: 0;
    animation: fadeUp 0.5s ease forwards;
    animation-delay: 1.1s;
  }
  .toggle-btn {
    padding: 0.5rem 1.375rem;
    font-size: 0.9375rem;
    font-weight: 400;
    color: var(--text-muted);
    border-radius: var(--radius-pill);
    cursor: pointer;
    border: none;
    background: transparent;
    transition: color 0.22s, background 0.22s;
    white-space: nowrap;
    font-family: inherit;
  }
  .toggle-btn.active {
    background: var(--action-inv);
    color: var(--action-inv-fg);
    font-weight: 500;
  }
  .section {
    width: 100%;
    max-width: 76rem;
    padding: 0 1.5rem;
    margin: 0 auto;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
    margin-top: 4rem;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards;
    animation-delay: 1.45s;
  }
  @media (max-width: 1024px) {
    .cards-grid { grid-template-columns: 1fr; max-width: 32rem; margin-left: auto; margin-right: auto; }
  }

  .card {
    position: relative;
    background: var(--glass-fill);
    border: 1px solid var(--glass-border);
    backdrop-filter: var(--blur);
    -webkit-backdrop-filter: var(--blur);
    border-radius: var(--radius-card);
    padding: 2rem 1.75rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 0;
    transition: border-color 0.25s, transform 0.25s;
  }
  .card:hover { border-color: var(--glass-border-h); transform: translateY(-3px); }

  .card.featured {
    border-color: rgba(160,120,255,0.55);
    box-shadow: 0 0 0 1px rgba(160,120,255,0.18), 0 0 48px rgba(120,80,240,0.18), inset 0 0 0 1px rgba(160,120,255,0.08);
  }
  .card.featured:hover { border-color: rgba(160,120,255,0.8); }

  .card-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.28rem 0.75rem;
    background: rgba(160,120,255,0.18);
    border: 1px solid rgba(160,120,255,0.35);
    border-radius: var(--radius-pill);
    font-size: 0.75rem;
    font-weight: 500;
    color: #c9aaff;
    margin-bottom: 1.5rem;
    width: fit-content;
  }

  .card-plan { font-size: 0.8125rem; font-weight: 500; color: var(--text-muted); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.375rem; }
  .card-name { font-size: 1.4375rem; font-weight: 500; color: var(--text-primary); letter-spacing: -0.02em; margin-bottom: 0.625rem; }
  .card-desc { font-size: 0.9375rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.75rem; }

  .card-price-wrap { display: flex; align-items: baseline; gap: 0.25rem; margin-bottom: 0.375rem; }
  .price-amount { font-size: 3rem; font-weight: 500; letter-spacing: -0.04em; color: var(--text-primary); line-height: 1; transition: opacity 0.22s; }
  .price-period { font-size: 0.9375rem; color: var(--text-muted); font-weight: 400; }
  .price-save { font-size: 0.8rem; color: #9effa0; margin-bottom: 1.75rem; min-height: 1.15rem; transition: opacity 0.22s; }

  .card-divider { width: 100%; height: 1px; background: var(--glass-border); margin-bottom: 1.5rem; }

  .card-features { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; flex: 1; }
  .card-features li { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.9375rem; color: var(--text-muted); line-height: 1.5; }
  .feat-check { flex-shrink: 0; width: 1.125rem; height: 1.125rem; margin-top: 0.125rem; color: #9effa0; }
  .card.featured .feat-check { color: #c9aaff; }

  .card-cta { display: inline-flex; align-items: center; justify-content: center; padding: 0.75rem 1.5rem; border-radius: var(--radius-pill); font-size: 0.9375rem; font-weight: 500; font-family: inherit; cursor: pointer; border: 1px solid var(--glass-border); background: var(--glass-fill); color: var(--text-primary); text-decoration: none; transition: background 0.22s, border-color 0.22s, transform 0.2s; width: 100%; }
  .card-cta:hover { background: var(--glass-fill-h); border-color: var(--glass-border-h); transform: translateY(-1px); }
  .card-cta.solid { background: var(--action-inv); border-color: var(--action-inv); color: var(--action-inv-fg); }
  .card-cta.solid:hover { opacity: 0.9; background: var(--action-inv); }

  .compare-section { margin-top: 6rem; width: 100%; max-width: 76rem; padding: 0 1.5rem; opacity: 0; animation: fadeUp 0.6s ease forwards; animation-delay: 1.55s; }
  .compare-label { font-size: 0.8125rem; font-weight: 500; color: var(--text-muted); letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 1rem; }
  .compare-title { font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 500; letter-spacing: -0.03em; margin-bottom: 2.5rem; color: var(--text-primary); }

  .compare-wrap { background: var(--glass-fill); border: 1px solid var(--glass-border); backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur); border-radius: var(--radius-card); overflow: hidden; }
  .compare-table { width: 100%; border-collapse: collapse; }
  .compare-table th, .compare-table td { padding: 1rem 1.5rem; text-align: center; border-bottom: 1px solid var(--glass-border); font-size: 0.9375rem; }
  .compare-table th:first-child, .compare-table td:first-child { text-align: left; color: var(--text-muted); font-weight: 400; }
  .compare-table thead th { font-weight: 500; color: var(--text-primary); font-size: 1rem; padding-top: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--glass-border); }
  .compare-table thead th.featured-col { color: #c9aaff; }
  .compare-table tbody tr:last-child td { border-bottom: none; }
  .compare-table tbody tr:hover td { background: rgba(255,255,255,0.03); }
  .check-yes { color: #9effa0; font-size: 1.1rem; }
  .check-feat { color: #c9aaff; font-size: 1.1rem; }
  .check-no { color: rgba(255,255,255,0.2); font-size: 1.1rem; }

  @media (max-width: 640px) { .compare-table th, .compare-table td { padding: 0.75rem 0.875rem; font-size: 0.875rem; } }

  .faq-section { margin-top: 6rem; width: 100%; max-width: 52rem; padding: 0 1.5rem; opacity: 0; animation: fadeUp 0.6s ease forwards; animation-delay: 1.65s; }
  .faq-label { font-size: 0.8125rem; font-weight: 500; color: var(--text-muted); letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 1rem; text-align: center; }
  .faq-title { font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 500; letter-spacing: -0.03em; margin-bottom: 2.5rem; text-align: center; color: var(--text-primary); }

  .faq-list { display: flex; flex-direction: column; gap: 0.75rem; }
  .faq-item { background: var(--glass-fill); border: 1px solid var(--glass-border); backdrop-filter: var(--blur); -webkit-backdrop-filter: var(--blur); border-radius: 0.875rem; overflow: hidden; transition: border-color 0.22s; }
  .faq-item.open { border-color: var(--glass-border-h); }

  .faq-q { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.5rem; background: none; border: none; font-family: inherit; font-size: 1rem; font-weight: 500; color: var(--text-primary); cursor: pointer; text-align: left; line-height: 1.45; }
  .faq-icon { flex-shrink: 0; width: 1.25rem; height: 1.25rem; color: var(--text-muted); transition: transform 0.3s, color 0.2s; }
  .faq-item.open .faq-icon { transform: rotate(45deg); color: var(--text-primary); }

  .faq-a { max-height: 0; overflow: hidden; transition: max-height 0.38s cubic-bezier(0.4,0,0.2,1); }
  .faq-a-inner { padding: 0 1.5rem 1.25rem; font-size: 0.9375rem; color: var(--text-muted); line-height: 1.7; border-top: 1px solid var(--glass-border); padding-top: 1rem; }

  footer { margin-top: 7rem; margin-bottom: 3rem; width: 100%; text-align: center; opacity: 0; animation: fadeUp 0.6s ease forwards; animation-delay: 1.65s; }
  footer p { font-size: 0.875rem; color: var(--text-muted); }

  @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
  @keyframes wordUp { to { opacity: 1; transform: translateY(0); } }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`;

export default function PricingPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const prices = useMemo(() => (isAnnual ? ANNUAL_PRICES : MONTHLY_PRICES), [isAnnual]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId: number;
    const animate = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafId);
      if (typeof lenis.destroy === 'function') {
        lenis.destroy();
      }
    };
  }, []);

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: pricingStyles }} />
      <canvas ref={canvasRef} className="fluid-canvas" id="fluidCanvas" />
      <div className="scrim" />

      <div className="page">
        <nav>
          <Link href="/" className="nav-logo">
            <svg viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2 14 C4 9, 6 7, 8 12 C10 17, 12 15, 14 10 C16 5, 18 9, 20 8" stroke="#eef0f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 18 C4.5 13, 7 11, 9 16 C11 21, 13 18, 16 13 C18 10, 20 12, 20 11" stroke="#b9becf" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
            </svg>
            Flowstate
          </Link>
          <div className="nav-links">
            <a target="_blank" href="/howItWorks">How it works?</a>
            <a target="_blank" href="/pricing" className="active">Pricing</a>
            <a target="_blank" href="/products">Products</a>
            <a target="_blank" href="/blog">Blog</a>
          </div>
          <a target='_blank' className="nav-cta" href="./auth">Get Started</a>
        </nav>

        <section className="hero">
          <div className="badge-pill">Flexible plans for deep thinkers</div>
          <h1 className="hero-title">
            {'Invest in Your Attention'.split(' ').map((word, i) => (
              <span key={word + i} className="word " style={{ animationDelay: `${480 + i * 90}ms` }}>
                {word}{' '}
              </span>
            ))}
          </h1>
          <p className="hero-sub">
            {'Choose the plan that fits your workflow. Cancel or change anytime.'.split(' ').map((word, i) => (
              <span key={word + i} className="word" style={{ animationDelay: `${1150 + i * 55}ms` }}>
                {word}{' '}
              </span>
            ))}
          </p>

          <div className="billing-toggle" id="billingToggle">
            <button className={`toggle-btn ${!isAnnual ? 'active' : ''}`} onClick={() => setIsAnnual(false)} type="button">
              Monthly
            </button>
            <button className={`toggle-btn ${isAnnual ? 'active' : ''}`} onClick={() => setIsAnnual(true)} type="button">
              Annual&nbsp;<span style={{ opacity: 0.65 }}>— Save 20%</span>
            </button>
          </div>
        </section>

        <div className="section">
          <div className="cards-grid">
            <div className="card">
              <div className="card-plan">Starter Plan</div>
              <div className="card-name">Solo</div>
              <div className="card-desc">Essential tools for individual focus and task blocking.</div>
              <div className="card-price-wrap">
                <span className="price-amount">{prices.solo}</span>
                <span className="price-period">&thinsp;/ free forever</span>
              </div>
              <div className="price-save">&nbsp;</div>
              <div className="card-divider" />
              <ul className="card-features">
                <li>
                  <svg className="feat-check" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                    <path d="M5.5 9.25 L7.75 11.5 L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Basic session tracker
                </li>
                <li>
                  <svg className="feat-check" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                    <path d="M5.5 9.25 L7.75 11.5 L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  3 daily flow blocks
                </li>
                <li>
                  <svg className="feat-check" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                    <path d="M5.5 9.25 L7.75 11.5 L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Local data storage
                </li>
                <li>
                  <svg className="feat-check" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                    <path d="M5.5 9.25 L7.75 11.5 L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Community support
                </li>
              </ul>
              <a href="#" className="card-cta">Get Started Free</a>
            </div>

            <div className="card featured">
              <div className="card-badge">Most Popular</div>
              <div className="card-plan">Pro Plan</div>
              <div className="card-name">Deep Worker</div>
              <div className="card-desc">Unlocks full distraction blocking, AI insights, and cross-device sync.</div>
              <div className="card-price-wrap">
                <span className="price-amount">{prices.pro}</span>
                <span className="price-period">&thinsp;/ mo</span>
              </div>
              <div className="price-save">{isAnnual ? 'Billed annually — save $24/yr' : ' '}</div>
              <div className="card-divider" />
              <ul className="card-features">
                <li>
                  <svg className="feat-check" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                    <path d="M5.5 9.25 L7.75 11.5 L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Unlimited flow sessions
                </li>
                <li>
                  <svg className="feat-check" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                    <path d="M5.5 9.25 L7.75 11.5 L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Advanced analytics & friction metrics
                </li>
                <li>
                  <svg className="feat-check" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                    <path d="M5.5 9.25 L7.75 11.5 L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Custom focus audio engines
                </li>
                <li>
                  <svg className="feat-check" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                    <path d="M5.5 9.25 L7.75 11.5 L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Multi-device cloud sync
                </li>
                <li>
                  <svg className="feat-check" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                    <path d="M5.5 9.25 L7.75 11.5 L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Calendar & tool integrations
                </li>
              </ul>
              <a href="#" className="card-cta solid">Start 14-Day Free Trial</a>
            </div>

            <div className="card">
              <div className="card-plan">Team Plan</div>
              <div className="card-name">Organization</div>
              <div className="card-desc">For small teams and studios looking to protect group focus time.</div>
              <div className="card-price-wrap">
                <span className="price-amount">{prices.team}</span>
                <span className="price-period">&thinsp;/ user / mo</span>
              </div>
              <div className="price-save">{isAnnual ? 'Billed annually — save $60/yr' : ' '}</div>
              <div className="card-divider" />
              <ul className="card-features">
                <li>
                  <svg className="feat-check" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                    <path d="M5.5 9.25 L7.75 11.5 L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Team focus status dashboard
                </li>
                <li>
                  <svg className="feat-check" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                    <path d="M5.5 9.25 L7.75 11.5 L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Meeting-free window scheduling
                </li>
                <li>
                  <svg className="feat-check" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                    <path d="M5.5 9.25 L7.75 11.5 L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Admin portal & centralized billing
                </li>
                <li>
                  <svg className="feat-check" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8.25" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
                    <path d="M5.5 9.25 L7.75 11.5 L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Priority support & onboarding
                </li>
              </ul>
              <a href="#" className="card-cta">Contact Sales</a>
            </div>
          </div>
        </div>

        <div className="compare-section">
          <div className="compare-label">Full comparison</div>
          <div className="compare-title">Everything, side by side</div>
          <div className="compare-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Feature</th>
                  <th>Solo</th>
                  <th className="featured-col">Deep Worker</th>
                  <th>Organization</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Session tracking</td><td><span className="check-yes">✓</span></td><td><span className="check-feat">✓</span></td><td><span className="check-yes">✓</span></td></tr>
                <tr><td>Daily flow blocks</td><td>3 blocks</td><td><span className="check-feat">Unlimited</span></td><td><span className="check-yes">Unlimited</span></td></tr>
                <tr><td>Distraction blocking</td><td><span className="check-no">—</span></td><td><span className="check-feat">✓</span></td><td><span className="check-yes">✓</span></td></tr>
                <tr><td>AI-powered insights</td><td><span className="check-no">—</span></td><td><span className="check-feat">✓</span></td><td><span className="check-yes">✓</span></td></tr>
                <tr><td>Custom focus audio</td><td><span className="check-no">—</span></td><td><span className="check-feat">✓</span></td><td><span className="check-yes">✓</span></td></tr>
                <tr><td>Cloud sync</td><td>Local only</td><td><span className="check-feat">✓</span></td><td><span className="check-yes">✓</span></td></tr>
                <tr><td>Calendar integrations</td><td><span className="check-no">—</span></td><td><span className="check-feat">✓</span></td><td><span className="check-yes">✓</span></td></tr>
                <tr><td>Team focus dashboard</td><td><span className="check-no">—</span></td><td><span className="check-no">—</span></td><td><span className="check-yes">✓</span></td></tr>
                <tr><td>Meeting-free scheduling</td><td><span className="check-no">—</span></td><td><span className="check-no">—</span></td><td><span className="check-yes">✓</span></td></tr>
                <tr><td>Admin & billing portal</td><td><span className="check-no">—</span></td><td><span className="check-no">—</span></td><td><span className="check-yes">✓</span></td></tr>
                <tr><td>Support</td><td>Community</td><td><span className="check-feat">Email & chat</span></td><td><span className="check-yes">Priority</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="faq-section">
          <div className="faq-label">Common questions</div>
          <div className="faq-title">Answers, up front</div>
          <div className="faq-list">
            {faqItems.map((item, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={item.question} className={`faq-item${isOpen ? ' open' : ''}`}>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                  >
                    {item.question}
                    <svg className="faq-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <line x1="10" y1="4" x2="10" y2="16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <line x1="4" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div className="faq-a" style={{ maxHeight: isOpen ? '240px' : '0' }}>
                    <div className="faq-a-inner">{item.answer}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <footer>
          <p>© 2026 Flowstate — engineered for deep work.</p>
        </footer>
      </div>
    </div>
  );
}
