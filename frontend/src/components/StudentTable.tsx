import type { Student } from '../backend';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, Trash2, TrendingUp, BookOpen } from 'lucide-react';
import { useGetStudentStats } from '../hooks/useQueries';

interface StudentRowProps {
  student: Student;
  onView: (student: Student) => void;
  onDelete: (student: Student) => void;
}

function StudentRow({ student, onView, onDelete }: StudentRowProps) {
  const { data: stats } = useGetStudentStats(student.studentId);

  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell className="font-medium text-foreground">{student.name}</TableCell>
      <TableCell className="text-muted-foreground font-mono text-sm">{student.studentId}</TableCell>
      <TableCell className="text-muted-foreground">{student.course}</TableCell>
      <TableCell>
        <span className="inline-flex items-center gap-1 text-sm">
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
          {stats ? Number(stats.totalSubmissions) : '—'}
        </span>
      </TableCell>
      <TableCell>
        {stats && Number(stats.totalSubmissions) > 0 ? (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            <TrendingUp className="h-3.5 w-3.5" />
            {Number(stats.averageScore)}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(student)}
            className="h-7 px-2.5 text-xs border-teal/30 text-teal hover:bg-teal-light/50 hover:text-teal-dark"
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(student)}
            className="h-7 px-2.5 text-xs border-destructive/30 text-destructive hover:bg-destructive/5"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface StudentTableProps {
  students: Student[];
  onView: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export default function StudentTable({ students, onView, onDelete }: StudentTableProps) {
  if (students.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No students registered yet.</p>
        <p className="text-sm mt-1">Add a student using the form above.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="font-semibold text-foreground">Name</TableHead>
            <TableHead className="font-semibold text-foreground">Student ID</TableHead>
            <TableHead className="font-semibold text-foreground">Course</TableHead>
            <TableHead className="font-semibold text-foreground">Submissions</TableHead>
            <TableHead className="font-semibold text-foreground">Avg Score</TableHead>
            <TableHead className="font-semibold text-foreground">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <StudentRow
              key={student.studentId}
              student={student}
              onView={onView}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
