import { useEffect, useRef } from 'react';
import './HeroSection.css';

export function HeroSection() {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = innerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const items = container.querySelectorAll<HTMLElement>('.hero-animate');
    items.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      requestAnimationFrame(() => {
        setTimeout(() => {
          el.style.transition = 'opacity 0.7s cubic-bezier(0,0,0.2,1), transform 0.7s cubic-bezier(0,0,0.2,1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 80 + i * 130);
      });
    });
  }, []);

  return (
    <section className="hero" id="top" aria-labelledby="hero-headline">
      <div className="hero-inner" ref={innerRef}>
        {/* Wordmark */}
        <div className="hero-logo hero-animate">
          <img src="/Poelys.png" alt="Poelys" className="hero-logo-img" />
        </div>

        {/* Headline */}
        <h1 className="hero-headline hero-animate" id="hero-headline">
          <span className="hero-line">We don't know</span>
          <span className="hero-line">what we're building.</span>
          <span className="hero-line hero-line--accent">And we're contributing.</span>
        </h1>

        {/* Supporting copy */}
        <p className="hero-sub hero-animate">
          Somewhere between an idea and what comes next,<br className="hero-br" /> things get built.
        </p>

        {/* Scroll cue */}
        <div className="hero-cue hero-animate" aria-hidden="true">
          <a href="#projects" className="hero-cue-link">
            <span className="hero-cue-text">See what we've been building</span>
            <span className="hero-cue-arrow" aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      {/* Subtle ambient mark */}
      <div className="hero-ambient" aria-hidden="true"></div>
    </section>
  );
}
