import { useEffect, useRef } from 'react';

/**
 * Scroll-triggered reveal animation using IntersectionObserver.
 * Uses inline styles to avoid CSS specificity issues.
 * Elements start visible — only elements below the viewport get animated.
 * Respects prefers-reduced-motion.
 */
export function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Only animate elements that start below the viewport
    const rect = el.getBoundingClientRect();
    const isBelowFold = rect.top > window.innerHeight * 0.8;

    if (!isBelowFold) return; // Already visible, no animation needed

    // Hide the element before animating
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use hardcoded easing (no CSS variable) to avoid shorthand parsing issues
          el.style.transition = 'opacity 0.6s cubic-bezier(0,0,0.2,1), transform 0.6s cubic-bezier(0,0,0.2,1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
