import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../_data';

export function projectAnchor(project: Project) {
  return project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function Tags({ items }: { items: string[] }) {
  return <ul className="tags" aria-label="Topics and technologies">
    {items.map(item => <li key={item}>{item}</li>)}
  </ul>;
}

export function ProjectCard({ project, engineering = false }: { project: Project; engineering?: boolean }) {
  const isSourceLink = project.href?.startsWith('https://github.com/');
  const links = [
    ...(project.href ? [{ href: project.href, label: project.hrefLabel ?? (isSourceLink ? 'View source' : 'View project') }] : []),
    ...(project.additionalLinks ?? []),
  ];
  return (
    <article className={engineering ? 'engineering-card' : 'visual-card'} id={projectAnchor(project)}>
      {project.image && (
        <div className="project-image">
          <img src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} loading="lazy" decoding="async" />
        </div>
      )}
      {project.videoId && (
        <div className="project-video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${project.videoId}`}
            title={`${project.name} gameplay video`}
            loading="lazy"
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}
      <div className="visual-meta">
        <span>{project.type}</span>
        {project.dates && <span>{project.dates}</span>}
      </div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <div className="visual-footer">
        <Tags items={project.tags} />
        {links.length > 0 && <div className="project-links">
          {links.map(link => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer"
              aria-label={`${link.label}: ${project.name} (opens in a new tab)`}>
              {link.label} <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </div>}
      </div>
    </article>
  );
}
