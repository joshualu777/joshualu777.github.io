import assert from 'node:assert/strict';
import { experience } from '../app/_data.ts';
import { technicalCourses } from '../app/experience/_coursework.ts';

const origin = process.argv[2] ?? 'http://localhost:3000';
for (const path of [
  '/',
  '/projects',
  '/experience',
  '/research-teaching',
  '/collection',
]) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.ok(
    !html.includes('Joshua-Lu-Resume.pdf'),
    `No résumé link on ${path}`,
  );
  assert.ok(!html.includes('header-resume'), `No résumé button on ${path}`);
  if (path === '/experience') {
    assert.equal(technicalCourses.length, 19, '19 technical courses');
    assert.equal(
      new Set(technicalCourses.map((course) => course.code)).size,
      19,
    );
    assert.equal((html.match(/data-course=/g) ?? []).length, 19);
    for (const course of technicalCourses) {
      assert.ok(
        html.includes(
          `data-course="${course.code}" data-grade="${course.grade}"`,
        ),
        `${course.code} grade`,
      );
      assert.ok(html.includes(course.title), `${course.code} title`);
      assert.ok(html.includes(course.term), `${course.code} term`);
    }
    assert.deepEqual(
      technicalCourses.reduce<Record<string, number>>((counts, course) => {
        counts[course.grade] = (counts[course.grade] ?? 0) + 1;
        return counts;
      }, {}),
      { A: 5, P: 2, 'A+': 12 },
      'Transcript grade distribution',
    );
    assert.ok(html.includes('P = Pass'), 'Pass grade legend');
    assert.ok(!html.includes('transcript.pdf'), 'No transcript download');
    assert.ok(
      !html.includes('experience-contributions'),
      'No résumé bullet lists',
    );
    assert.ok(
      !html.includes('Machine Learning · Feature Engineering'),
      'Internal team label removed',
    );
    assert.ok(
      !html.includes('database schema'),
      'Detailed implementation copy removed',
    );
    for (const item of experience) {
      assert.ok(html.includes(item.company), item.company);
      if (item.summary)
        assert.ok(html.includes(item.summary), `${item.company} paragraph`);
    }
    assert.ok(
      html.includes('Incoming Software Engineer Intern'),
      'Incoming status preserved',
    );
  }
  console.info(`PASS ${path}`);
}
const resume = await fetch(new URL('/Joshua-Lu-Resume.pdf', origin));
assert.equal(resume.status, 404, 'Former résumé download returns 404');
console.info('PASS résumé file is no longer publicly served');
