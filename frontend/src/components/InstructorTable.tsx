import type { Instructor } from '../backend';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, GraduationCap, Mail, Building2 } from 'lucide-react';
import { useDeleteInstructor } from '../hooks/useQueries';

interface InstructorRowProps {
  instructor: Instructor;
}

function InstructorRow({ instructor }: InstructorRowProps) {
  const deleteInstructor = useDeleteInstructor();

  const handleDelete = () => {
    deleteInstructor.mutate(instructor.instructorId);
  };

  return (
    <TableRow className="hover:bg-red-50/40 transition-colors">
      <TableCell className="font-medium text-au-navy">{instructor.name}</TableCell>
      <TableCell className="text-muted-foreground font-mono text-sm">
        #{String(instructor.instructorId)}
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          {instructor.email}
        </span>
      </TableCell>
      <TableCell>
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Building2 className="h-3.5 w-3.5" />
          {instructor.department}
        </span>
      </TableCell>
      <TableCell>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDelete}
          disabled={deleteInstructor.isPending}
          className="h-7 px-2.5 text-xs border-destructive/30 text-destructive hover:bg-destructive/5"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}

interface InstructorTableProps {
  instructors: Instructor[];
}

export default function InstructorTable({ instructors }: InstructorTableProps) {
  if (instructors.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium text-au-navy">No instructors registered yet.</p>
        <p className="text-sm mt-1">Add an instructor using the form above.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-red-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-red-50/60 hover:bg-red-50/60">
            <TableHead className="font-semibold text-au-navy">Name</TableHead>
            <TableHead className="font-semibold text-au-navy">ID</TableHead>
            <TableHead className="font-semibold text-au-navy">Email</TableHead>
            <TableHead className="font-semibold text-au-navy">Department</TableHead>
            <TableHead className="font-semibold text-au-navy">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {instructors.map((instructor) => (
            <InstructorRow
              key={String(instructor.instructorId)}
              instructor={instructor}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
