import { useReveal } from '../hooks/useReveal';
import './ClosingSection.css';

export function ClosingSection() {
  const ref = useReveal(0.15);

  return (
    <section
      className="closing"
      ref={ref as React.RefObject<HTMLElement>}
      aria-labelledby="closing-heading"
    >
      <div className="closing-inner">
        <h2 className="closing-heading" id="closing-heading">
          There's more to come.
        </h2>
        <p className="closing-sub">
          We'll keep following the questions, building the things,
          <br className="closing-br" />
          and figuring out what comes next.
        </p>
        <div className="closing-links">
          <a href="#projects" className="closing-anchor">
            Back to projects ↑
          </a>
        </div>
      </div>
    </section>
  );
}
