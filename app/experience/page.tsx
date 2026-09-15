import type { Metadata } from 'next';
import { experience } from '../_data';
import { CourseworkTable } from './_coursework-table';

export const metadata: Metadata = {
  title: 'Experience — Joshua Lu',
  description:
    'Joshua Lu’s software engineering experience, education, and technical skills.',
};

export default function ExperiencePage() {
  return (
    <main id="main" className="page-content">
      <header className="page-intro">
        <h1>Experience</h1>
        <p>Software engineering across systems and infrastructure.</p>
      </header>
      <section
        className="content-section"
        id="experience"
        aria-labelledby="experience-title"
      >
        <div className="section-label">
          <h2 id="experience-title">Internships</h2>
        </div>
        <div className="section-body experience-list">
          {experience.map((item) => (
            <article className="experience-item" key={item.company}>
              <div className="entry-heading">
                <h3>{item.company}</h3>
                <span className="item-time">{item.dates}</span>
              </div>
              <div className="entry-subheading">
                <p>{item.role}</p>
                <span className="item-location">{item.location}</span>
              </div>
              {item.summary && (
                <p className="item-description">{item.summary}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="content-section" aria-labelledby="education-title">
        <div className="section-label">
          <h2 id="education-title">Education</h2>
        </div>
        <div className="section-body">
          <div className="entry-heading">
            <h3>University of California, Berkeley</h3>
            <span className="item-time">Expected May 2027</span>
          </div>
          <p className="item-description">
            Electrical Engineering and Computer Sciences · 4.00 GPA
          </p>
          <CourseworkTable />
        </div>
      </section>
      <section
        className="content-section skills-section"
        aria-labelledby="skills-title"
      >
        <div className="section-label">
          <h2 id="skills-title">Skills</h2>
        </div>
        <div className="section-body skill-groups">
          <div>
            <h3>Languages</h3>
            <p>
              Python, Java, C, C#, OCaml, JavaScript, TypeScript, SQL, x86
              Assembly
            </p>
          </div>
          <div>
            <h3>Technologies</h3>
            <p>
              AWS, GCP, Cloudflare, PyTorch, React, Vue, MongoDB, NumPy, Pandas,
              Scikit-learn
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
