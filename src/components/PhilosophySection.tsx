import { useReveal } from '../hooks/useReveal';
import './PhilosophySection.css';

export function PhilosophySection() {
  const ref = useReveal(0.15);

  return (
    <section
      className="philosophy"
      id="about"
      ref={ref as React.RefObject<HTMLElement>}
      aria-labelledby="philosophy-heading"
    >
      <div className="philosophy-inner">
        <h2 className="philosophy-heading" id="philosophy-heading">
          Maybe that's the point.
        </h2>
        <div className="philosophy-body">
          <p>
            We don't believe every idea needs a perfect explanation before it
            becomes something real.
          </p>
          <p>
            Sometimes you build because you're curious. Sometimes because
            something should exist. Sometimes because you're trying to understand
            a problem by working through it.
          </p>
          <p>
            And sometimes, somewhere along the way, an experiment becomes useful
            to someone else.
          </p>
          <p className="philosophy-closer">
            We're still figuring things out.
            <br />
            In the meantime, we're building.
          </p>
        </div>
      </div>
    </section>
  );
}
