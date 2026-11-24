import { useEffect, useRef, useState, type CSSProperties } from 'react';

/* The futuristic layer: a few small, consistent effects used across the site.
   Every one of them switches off under prefers-reduced-motion. */

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Thin red line under the nav that tracks how far down the page you are. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        ref.current?.style.setProperty('transform', `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`);
      });
    };
    on();
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);
  return <div className="scroll-progress" ref={ref} aria-hidden="true" />;
}

/** Feeds the pointer position to CSS (--mx, --my) so a light can follow it. */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || matchMedia('(hover: none)').matches) return;
    let raf = 0;
    const on = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    };
    el.addEventListener('pointermove', on);
    return () => { el.removeEventListener('pointermove', on); cancelAnimationFrame(raf); };
  }, []);
  return ref;
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·+';

/** Text that decodes from random glyphs the first time it scrolls into view. */
export function Decode({ text, className, style }: { text: string; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [out, setOut] = useState(text);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let frame = 0;
      const total = 16;
      timer = window.setInterval(() => {
        frame++;
        const done = Math.floor((frame / total) * text.length);
        setOut(text.split('').map((c, i) => (i < done || c === ' ' ? c : GLYPHS[(i * 7 + frame * 13) % GLYPHS.length])).join(''));
        if (frame >= total) { clearInterval(timer); setOut(text); }
      }, 34);
    }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
    return () => { io.disconnect(); clearInterval(timer); };
  }, [text]);
  return <span ref={ref} className={className} style={style} aria-label={text}><span aria-hidden="true">{out}</span></span>;
}

/** Live readout strip: studio time, products live, build. */
export function Hud({ live, total }: { live: number; total: number }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const ist = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false });
  return (
    <div className="hud-strip t-mono" role="status" aria-live="off">
      <span><i className="hud-strip__dot" />Signal nominal</span>
      <span>Studio time <b>{ist}</b> IST</span>
      <span><b>{live}</b>/{total} live</span>
      <span>Build <b>v{__APP_VERSION__}</b></span>
      <span className="hud-strip__end">poelys.com</span>
    </div>
  );
}
