import { useReveal } from '../hooks/useReveal';
import type { Project } from '../data/projects';
import './ProjectEntry.css';

interface Props {
  project: Project;
  total: number;
  imageSrc?: string;
  imageAlt?: string;
  flip?: boolean;
}

export function ProjectEntry({ project, total, imageSrc, imageAlt, flip = false }: Props) {
  const ref = useReveal(0.1);

  return (
    <article
      className={`project-entry ${flip ? 'project-entry--flip' : ''}`}
      ref={ref as React.RefObject<HTMLElement>}
      id={`project-${project.id}`}
      aria-labelledby={`project-title-${project.id}`}
    >
      <div className="project-entry-inner">
        {/* Text block */}
        <div className="project-text">
          <div className="project-meta">
            <span className="project-number">{project.number} / {String(total).padStart(2, '0')}</span>
            <span className="project-category">{project.category}</span>
          </div>
          <h3 className="project-name" id={`project-title-${project.id}`}>
            {project.name}
          </h3>
          <p className="project-tagline">{project.tagline}</p>
          <p className="project-description">{project.description}</p>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="project-link"
            aria-label={`${project.cta} — opens in new tab`}
          >
            <span>{project.cta}</span>
            <span className="project-link-arrow" aria-hidden="true">↗</span>
          </a>
        </div>

        {/* Visual block */}
        <div className="project-visual">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={imageAlt || project.name}
              className="project-image"
              loading="lazy"
              width="480"
              height="320"
            />
          ) : (
            <div className="project-icon-block" aria-hidden="true">
              <span className="project-icon">{project.icon}</span>
              <span className="project-name-watermark">{project.name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="project-divider" aria-hidden="true"></div>
    </article>
  );
}
