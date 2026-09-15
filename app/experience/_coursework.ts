export type TechnicalCourse = {
  code: string;
  title: string;
  term: string;
  grade: 'A+' | 'A' | 'P';
};

// Berkeley technical coursework only, transcribed from the September 2026
// academic summary. Preserve P grades and the unspecified CS 194 topic.
// Newest semester first; transfer, teaching, and research credit are excluded.
export const technicalCourses: TechnicalCourse[] = [
  {
    code: 'CS 185',
    title: 'Deep Reinforcement Learning',
    term: 'Spring 2026',
    grade: 'A',
  },
  {
    code: 'EECS 126',
    title: 'Probability and Random Processes',
    term: 'Spring 2026',
    grade: 'A',
  },
  { code: 'CS C182', title: 'Neural Networks', term: 'Fall 2025', grade: 'P' },
  { code: 'CS 194', title: 'Special Topics', term: 'Fall 2025', grade: 'P' },
  {
    code: 'EPS 109',
    title: 'Computer Simulations with Jupyter Notebooks',
    term: 'Fall 2025',
    grade: 'A+',
  },
  {
    code: 'CS 162',
    title: 'Operating Systems and System Programming',
    term: 'Spring 2025',
    grade: 'A+',
  },
  {
    code: 'CS 189',
    title: 'Introduction to Machine Learning',
    term: 'Spring 2025',
    grade: 'A+',
  },
  {
    code: 'EECS 127',
    title: 'Optimization Models in Engineering',
    term: 'Spring 2025',
    grade: 'A+',
  },
  {
    code: 'CS 168',
    title: 'Internet Architecture and Protocols',
    term: 'Fall 2024',
    grade: 'A+',
  },
  {
    code: 'CS 170',
    title: 'Efficient Algorithms and Intractable Problems',
    term: 'Fall 2024',
    grade: 'A+',
  },
  {
    code: 'CS 186',
    title: 'Introduction to Database Systems',
    term: 'Fall 2024',
    grade: 'A+',
  },
  {
    code: 'CS 61C',
    title: 'Machine Structures',
    term: 'Summer 2024',
    grade: 'A',
  },
  {
    code: 'CS 160',
    title: 'User Interface Design and Development',
    term: 'Summer 2024',
    grade: 'A+',
  },
  {
    code: 'CS 61B',
    title: 'Data Structures',
    term: 'Spring 2024',
    grade: 'A+',
  },
  {
    code: 'CS 70',
    title: 'Discrete Mathematics and Probability Theory',
    term: 'Spring 2024',
    grade: 'A+',
  },
  {
    code: 'EECS 16B',
    title: 'Introduction to Circuits and Devices',
    term: 'Spring 2024',
    grade: 'A+',
  },
  {
    code: 'CS 61A',
    title: 'Structure and Interpretation of Computer Programs',
    term: 'Fall 2023',
    grade: 'A+',
  },
  {
    code: 'EECS 16A',
    title:
      'Foundations of Signals, Dynamical Systems, and Information Processing',
    term: 'Fall 2023',
    grade: 'A',
  },
  {
    code: 'PHYSICS 7B',
    title: 'Physics for Scientists and Engineers',
    term: 'Fall 2023',
    grade: 'A',
  },
];
