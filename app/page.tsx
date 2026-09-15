import { ArrowRight, ArrowUpRight, BrainCircuit, Cpu, Gamepad2, Mail } from 'lucide-react';

const featuredProjects = [
  {
    name: 'Chess Green Agent',
    type: 'AI evaluation',
    icon: BrainCircuit,
    description: 'A chess benchmark for AgentBeats, with Stockfish analysis and Elo ratings.',
    anchor: 'chess-green-agent',
  },
  {
    name: 'Pintos',
    type: 'Systems',
    icon: Cpu,
    description: 'An x86 operating system project covering processes, scheduling, and file systems.',
    anchor: 'pintos',
  },
  {
    name: 'Silent Controller',
    type: 'Game development',
    icon: Gamepad2,
    description: 'Led a five-person team at CMU’s NHSGA to build a medieval 3D game in two weeks.',
    anchor: 'silent-controller',
  },
];

export default function Home() {
  return (
    <main id="main">
      <section className="hero" aria-labelledby="intro-title">
        <img className="portrait" src="/joshua-lu-tea.jpg" alt="Joshua Lu enjoying a cup of tea" width="220" height="220" fetchPriority="high" />
        <div className="hero-main">
          <h1 id="intro-title">Hi, I’m Joshua.</h1>
          <p className="hero-role">Software Engineer <span aria-hidden="true">/</span> UC Berkeley EECS</p>
          <p className="hero-summary">I study EECS at UC Berkeley and work on systems, infrastructure, and machine learning. My projects also explore chess and game development. I’m joining OpenAI as a software engineering intern in Fall 2026.</p>
          <div className="hero-links">
            <a href="mailto:joshualu968@gmail.com"><Mail aria-hidden="true" /> Email</a>
            <a href="https://www.linkedin.com/in/joshua-lu-8748a2244/" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight aria-hidden="true" /></a>
            <a href="https://github.com/joshualu777" target="_blank" rel="noreferrer">GitHub <ArrowUpRight aria-hidden="true" /></a>
          </div>
          <div className="hero-facts"><span>Berkeley, California</span></div>
        </div>
      </section>
      <section className="home-projects page-content" aria-labelledby="featured-title">
        <div className="home-section-heading">
          <h2 id="featured-title">Selected projects</h2>
          <a href="/projects">All projects <ArrowRight aria-hidden="true" /></a>
        </div>
        <div className="featured-grid">
          {featuredProjects.map(project => (
            <article className="featured-card" key={project.anchor}>
              <div className="featured-topic"><project.icon aria-hidden="true" /><p className="card-kicker">{project.type}</p></div>
              <h3>{project.name}</h3>
              <p className="featured-description">{project.description}</p>
              <a href={`/projects#${project.anchor}`} aria-label={`Read about ${project.name}`}>
                Read project <ArrowRight aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
