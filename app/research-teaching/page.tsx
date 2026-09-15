import type { Metadata } from 'next';
import { research, teaching } from '../_data';
import { Tags } from '../_components/project-card';

export const metadata: Metadata = {
  title: 'Research & Teaching — Joshua Lu',
  description: 'Joshua Lu’s research in language models and virtual reality, course instruction, and mentorship.',
};

export default function ResearchTeachingPage() {
  const mentoring = teaching.filter(item => item.organization.startsWith('Computer Science Mentors'));
  const courseTeaching = teaching.filter(item => !item.organization.startsWith('Computer Science Mentors'));
  return (
    <main id="main" className="page-content">
      <header className="page-intro"><h1>Research & Teaching</h1><p>Research, course instruction, and mentorship at Berkeley and beyond.</p></header>
      <section className="content-section" id="research" aria-labelledby="research-title">
        <div className="section-label"><h2 id="research-title">Research</h2></div>
        <div className="section-body research-list">
          {research.map(item => <article className="research-card" key={item.role}>
            <div className="entry-heading"><h3>{item.organization}</h3><span className="item-time">{item.dates}</span></div>
            <p className="research-role">{item.role}</p><p className="research-detail">{item.detail}</p><p className="item-description">{item.description}</p><Tags items={item.tags} />
          </article>)}
        </div>
      </section>

      <section className="content-section" id="teaching" aria-labelledby="teaching-title">
        <div className="section-label"><h2 id="teaching-title">Teaching</h2></div>
        <div className="section-body teaching-list">
          <article className="teaching-item">
            <div className="entry-heading"><h3>Computer Science Mentors</h3><span className="item-time">Fall 2025 – Fall 2026</span></div>
            <p className="teaching-organization">UC Berkeley · CS 61A</p>
            <ol className="mentor-progression">{mentoring.map(item => <li key={item.role}>
              <div className="mentor-heading"><h4>{item.role}</h4><span className="item-time">{item.dates}</span></div>
              <p className="item-description">{item.description}</p>
            </li>)}</ol>
          </article>
          {courseTeaching.map(item => <article className="teaching-item" key={`${item.dates}-${item.role}`}>
            <div className="entry-heading"><h3>{item.role}</h3><span className="item-time">{item.dates}</span></div>
            <p className="teaching-organization">{item.organization}</p><p className="item-description">{item.description}</p>
          </article>)}
        </div>
      </section>


    </main>
  );
}
