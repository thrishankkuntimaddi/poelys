import { useState, useEffect } from 'react';
import './Navbar.css';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} role="banner">
      <div className="navbar-inner">
        <a href="#top" className="navbar-logo" aria-label="Poelys — return to top">
          <img src="/Poelys.png" alt="Poelys" className="navbar-logo-img" />
        </a>
        <nav className="navbar-links" aria-label="Primary navigation">
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
        </nav>
      </div>
    </header>
  );
}
