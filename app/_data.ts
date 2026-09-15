export type Project = {
  name: string;
  type: string;
  dates?: string;
  description: string;
  tags: string[];
  href?: string;
  hrefLabel?: string;
  additionalLinks?: { label: string; href: string }[];
  image?: { src: string; alt: string; width: number; height: number };
  videoId?: string;
};

type Experience = {
  dates: string;
  role: string;
  company: string;
  location: string;
  summary: string;
};

export const experience: Experience[] = [
  { dates: 'Sep – Dec 2026', role: 'Incoming Software Engineer Intern', company: 'OpenAI', location: 'San Francisco, CA', summary: '' },
  {
    dates: 'May – Aug 2026', role: 'Software Engineer Intern', company: 'Jane Street', location: 'New York, NY',
    summary: 'Built diagnostic tooling to help researchers investigate issues in data-processing workflows. Worked on the supporting storage layer and production rollout, incorporating user feedback and maintaining access to existing data during the transition.',
  },
  {
    dates: 'Aug – Dec 2025', role: 'Software Engineer Intern', company: 'TikTok', location: 'San Jose, CA',
    summary: 'Worked on advertising tools across performance analytics, experimentation, and product catalog management. Improved page-load reporting and A/B testing support, and helped modernize the infrastructure behind these workflows.',
  },
  {
    dates: 'May – Aug 2025', role: 'Software Development Engineer Intern', company: 'Amazon Web Services', location: 'East Palo Alto, CA',
    summary: 'Developed workflow orchestration tooling and backend APIs for AWS Glue, working with Apache Airflow and AWS services. Also released an open-source Python-to-YAML utility to simplify workflow configuration.',
  },
];

export const engineeringProjects: Project[] = [
  { name: 'Chess Green Agent', type: 'AI agent evaluation', dates: 'Sep – Nov 2025', description: 'Built a chess evaluation agent for AgentBeats that coordinates games between two AI agents. Uses Stockfish to measure move quality through centipawn loss, updates Elo ratings from game results, and saves game records and evaluation logs to Google Cloud Storage.', tags: ['Python', 'AgentBeats', 'Stockfish', 'Google Cloud'], href: 'https://github.com/joshualu777/chess-green-agent' },
  { name: 'Pintos', type: 'x86 Operating System', description: 'Implemented process control and file-operation system calls, strict priority scheduling, multithreading, synchronization, a fast file system, and buffer cache.', tags: ['C', 'x86', 'Operating Systems'] },
  { name: 'RookieDB', type: 'Relational Database', description: 'Implemented B+ tree indexing, System R query optimization, two-phase locking, and ARIES recovery with write-ahead logging and checkpoints.', tags: ['Java', 'Databases', 'Concurrency'] },
  { name: 'JSONG', type: 'Voice-controlled car', dates: 'Jan – May 2024', description: 'Physical computing project using motor control, system identification, closed-loop feedback, and PCA-based voice-command classification.', tags: ['NumPy', 'Controls', 'PCA'] },
];

export const visualProjects: Project[] = [
  { name: 'StarTales', type: 'Mobile web app', dates: 'Jun – Aug 2024', description: 'Stargazing companion combining the OpenAI API with astronomy and device APIs, informed by contextual inquiry at a local stargazing event.', tags: ['React', 'Figma', 'OpenAI API'] },
  { name: 'AR Chess Trainer', type: 'Augmented reality', dates: 'Oct 2022 – May 2023', description: 'Immersive chess training system with PGN processing, a custom 3D board, and Meta Quest Pro interaction.', tags: ['Unity', 'Oculus SDK', 'AR'], href: 'https://github.com/joshualu777/AR-Chess', image: { src: '/projects/ar-chess.jpg', alt: 'AR Chess Trainer showing a 3D chessboard, move annotations, and virtual controls.', width: 1400, height: 961 } },
  { name: 'Mission Absurd', type: 'Experimental game', dates: 'Feb – Mar 2023', description: 'Absurdist game inspired by Catch-22 with a progressively difficult reaction-speed mechanic.', tags: ['Unity', 'Game Design'], href: 'https://jlu777.itch.io/mission-absurd', hrefLabel: 'Play game', additionalLinks: [{ label: 'View source', href: 'https://github.com/joshualu777/Mission-Absurd' }], image: { src: '/projects/mission-absurd.jpg', alt: 'Mission Absurd gameplay with an aircraft, letter targets, and a level timer.', width: 1400, height: 872 } },
  { name: 'The Lonely Labyrinth', type: 'Cognitive training game', dates: 'Dec 2021 – Apr 2022', description: 'Maze game featuring original art, movement telemetry, and a research analysis in serious games.', tags: ['Unity', 'Research'], href: 'https://jlu777.itch.io/maze-game', hrefLabel: 'Play game', image: { src: '/projects/lonely-labyrinth.jpg', alt: 'The Lonely Labyrinth gameplay showing a character illuminating a dark stone maze.', width: 1400, height: 876 } },
  { name: 'Silent Controller', type: 'Collaborative 3D game', dates: 'Jul – Aug 2021', description: 'Led a five-person team at CMU’s NHSGA to deliver a medieval 3D game in a two-week sprint.', tags: ['Unity', 'Leadership'], href: 'https://shrimpshrimp2.itch.io/silent-controller', hrefLabel: 'Download game', additionalLinks: [{ label: 'Watch demo', href: 'https://youtu.be/sRResbtyKUM' }], videoId: 'sRResbtyKUM' },
  { name: 'POUST', type: 'Arcade game remix', dates: 'Jul 2021', description: 'Collaborated with a programmer and two artists on a space-pig-themed remix of Joust. Built progressively harder enemy AI and tuned the spaceship’s movement, jump, and bounce through iteration.', tags: ['Game AI', 'Team Project', 'Game Design'], href: 'https://www.youtube.com/watch?v=Vso2lJon1JY', videoId: 'Vso2lJon1JY' },
];

export const research = [
  { dates: 'Jul 2024 – Jun 2025', role: 'LLM Researcher', organization: 'Berkeley Artificial Intelligence Research', detail: 'Xuandong Zhao · Prof. Dawn Song', description: 'Investigated token-alignment techniques for speculative decoding across language models with different architectures. Developed a benchmark for direct and indirect prompt-injection attacks.', tags: ['Language Models', 'Speculative Decoding', 'AI Security'] },
  { dates: 'Sep 2023 – Jun 2024', role: 'Machine Learning & Virtual Reality Research Assistant', organization: 'UC Berkeley School of Optometry', detail: 'Berkeley, CA', description: 'Analyzed eye-movement segmentation models using synthetic and real gaze data. Built a procedurally generated, persistent VR maze study and designed its participant survey.', tags: ['Machine Learning', 'Eye Tracking', 'Virtual Reality', 'Study Design'] },
];

export const teaching = [
  { dates: 'Fall 2026', role: 'Senior Mentor Advisor', organization: 'Computer Science Mentors · CS 61A', description: 'Advising the mentor team and supporting senior and junior mentors.' },
  { dates: 'Spring 2026', role: 'Teaching Assistant', organization: 'UC Berkeley · CS 186', description: 'Taught a discussion section for Database Systems and owned course infrastructure work, including project setup, testing, and releases.' },
  { dates: 'Spring 2026', role: 'Senior Mentor', organization: 'Computer Science Mentors · CS 61A', description: 'Mentored two junior mentors while supporting small-group instruction.' },
  { dates: 'Fall 2025', role: 'Junior Mentor', organization: 'Computer Science Mentors · CS 61A', description: 'Taught introductory computer science concepts to a small group through discussion-based sessions.' },
  { dates: 'Fall 2024 – Spring 2025', role: 'Tutor & Course Software Support', organization: 'UC Berkeley · EECS 16A', description: 'Tutored students while maintaining the course website and supporting software setup.' },
  { dates: 'Aug 2021 – Apr 2023', role: 'Co-founder', organization: 'Art of Computer Algorithms · BASIS Independent Silicon Valley', description: 'Designed curriculum for 40+ competitive-programming students and organized contests and workshops serving 50+ students.' },
];
