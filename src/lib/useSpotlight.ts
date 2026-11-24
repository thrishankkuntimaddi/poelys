import { useEffect, useRef } from 'react';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
