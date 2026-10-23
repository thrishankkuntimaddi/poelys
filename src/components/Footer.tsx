import { projects } from '../data/projects';
import './Footer.css';

export function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-top">
          <a href="#top" className="footer-logo" aria-label="Poelys — back to top">
            <img src="/Poelys.png" alt="Poelys" className="footer-logo-img" />
          </a>
          <span className="footer-tagline">Still building.</span>
        </div>

        <div className="footer-mid">
          <nav className="footer-projects" aria-label="Projects">
            {projects.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-project-link"
              >
                {p.name}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© {year} Poelys. All rights reserved.</span>
          <button
            className="footer-top-btn"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            ↑ Top
          </button>
        </div>
      </div>
    </footer>
  );
}
