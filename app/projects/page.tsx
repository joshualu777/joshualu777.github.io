import type { Metadata } from 'next';
import { engineeringProjects, visualProjects } from '../_data';
import { ProjectCard } from '../_components/project-card';

export const metadata: Metadata = {
  title: 'Projects — Joshua Lu',
  description: 'Systems, AI evaluation, games, and interactive projects by Joshua Lu.',
};

export default function ProjectsPage() {
  return (
    <main id="main" className="page-content">
      <header className="page-intro">
        <h1>Projects</h1>
        <p>Systems, AI evaluation, and interactive work.</p>
      </header>
      <section className="content-section" aria-labelledby="engineering-title">
        <div className="section-label"><h2 id="engineering-title">Engineering</h2></div>
        <div className="section-body engineering-grid">
          {engineeringProjects.map(project => <ProjectCard key={project.name} project={project} engineering />)}
        </div>
      </section>
      <section className="content-section" id="interactive-work" aria-labelledby="interactive-title">
        <div className="section-label"><h2 id="interactive-title">Interactive work</h2><p>Games & interfaces</p></div>
        <div className="section-body visual-grid">
          {visualProjects.map(project => <ProjectCard key={project.name} project={project} />)}
        </div>
      </section>
    </main>
  );
}
