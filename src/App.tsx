import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ManifestoTransition } from './components/ManifestoTransition';
import { ProjectsSection } from './components/ProjectsSection';
import { PhilosophySection } from './components/PhilosophySection';
import { ClosingSection } from './components/ClosingSection';
import { Footer } from './components/Footer';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ManifestoTransition />
        <ProjectsSection />
        <PhilosophySection />
        <ClosingSection />
      </main>
      <Footer />
    </>
  );
}

export default App;
