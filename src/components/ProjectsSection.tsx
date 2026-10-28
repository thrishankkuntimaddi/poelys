import { useReveal } from '../hooks/useReveal';
import { projects } from '../data/projects';
import { ProjectEntry } from './ProjectEntry';
import './ProjectsSection.css';

// Map of project id → app icon images from user's uploads
const projectImages: Record<string, { src: string; alt: string }> = {
  parla: {
    src: '/images/parla-icon.png',
    alt: 'Parla — a stylised letter P with an embedded chat bubble in an orange-to-red gradient',
  },
  oruinwan: {
    src: '/images/oruinwan-icon.png',
    alt: 'Oruinwan — a gold and black geometric emblem representing connected collaboration',
  },
  'expense-tracker': {
    src: '/images/expense-tracker-icon.png?v=2',
    alt: 'Expense Tracker — a green wallet app icon with a rupee coin and receipt',
  },
  learnvianotes: {
    src: '/images/learnvianotes-icon.png?v=2',
    alt: 'LearnViaNotes — a notebook surrounded by computer science subject icons',
  },
  yormenu: {
    src: '/images/yormenu-icon.png',
    alt: 'YorMenu — a white serving cloche on a red rounded-square app icon',
  },
  sentinelflight: {
    src: '/images/sentinelflight-icon.jpg',
    alt: 'SentinelFlight — Earth surrounded by orbiting satellites and space debris tracking trajectories',
  },
};

export function ProjectsSection() {
  const headingRef = useReveal(0.2);

  return (
    <section
      className="projects-section"
      id="projects"
      aria-labelledby="projects-heading"
    >
      <div className="projects-header">
        <span className="projects-label">THINGS WE'VE MADE</span>
        <h2
          className="projects-heading"
          id="projects-heading"
          ref={headingRef as React.RefObject<HTMLHeadingElement>}
        >
          Ideas, made tangible.
        </h2>
      </div>

      <div className="projects-list">
        {projects.map((project, i) => {
          const imageData = projectImages[project.id];
          return (
            <ProjectEntry
              key={project.id}
              project={project}
              total={projects.length}
              imageSrc={imageData?.src}
              imageAlt={imageData?.alt}
              flip={i % 2 === 1}
            />
          );
        })}
      </div>
    </section>
  );
}
