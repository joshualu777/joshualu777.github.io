import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { technicalCourses } from './_coursework';
import './coursework.css';

export function CourseworkTable() {
  return (
    <div className="coursework" id="coursework">
      <h3 id="coursework-title">Technical coursework</h3>
      <p className="coursework-note" id="coursework-note">
        Completed at Berkeley · P = Pass
      </p>
      <Table
        className="coursework-table"
        aria-labelledby="coursework-title"
        aria-describedby="coursework-note"
      >
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="coursework-code">
              Course
            </TableHead>
            <TableHead scope="col">Name &amp; semester</TableHead>
            <TableHead scope="col" className="coursework-grade">
              Grade
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {technicalCourses.map((course) => (
            <TableRow
              key={course.code}
              data-course={course.code}
              data-grade={course.grade}
            >
              <TableCell className="coursework-code">{course.code}</TableCell>
              <TableCell>
                <span className="coursework-name">{course.title}</span>
                <span className="coursework-term">{course.term}</span>
              </TableCell>
              <TableCell className="coursework-grade">{course.grade}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
