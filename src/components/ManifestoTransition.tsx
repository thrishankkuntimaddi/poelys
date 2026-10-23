import { useReveal } from '../hooks/useReveal';
import './ManifestoTransition.css';

export function ManifestoTransition() {
  const ref = useReveal(0.2);

  return (
    <section
      className="manifesto"
      ref={ref as React.RefObject<HTMLElement>}
      aria-label="Introduction"
    >
      <div className="manifesto-inner">
        <span className="manifesto-label">A WORK IN PROGRESS</span>
        <p className="manifesto-body">
          We start with questions, build things to explore them, and see where
          they lead. Some become products. Some become experiments. All of them
          are part of the journey.
        </p>
      </div>
    </section>
  );
}
