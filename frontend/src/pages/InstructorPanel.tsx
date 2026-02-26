import { useState } from 'react';
import { useGetAllStudents, useGetSubmissionsByStudent, useGetFeedbackForStudent } from '../hooks/useQueries';
import type { Student, FeedbackSubmission, GeneratedFeedback } from '../backend';
import AddStudentForm from '../components/AddStudentForm';
import StudentTable from '../components/StudentTable';
import SubmissionCard from '../components/SubmissionCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Users, BarChart3, BookOpen, ShieldCheck, AlertCircle } from 'lucide-react';

// ─── Student Detail View ──────────────────────────────────────────────────────

function StudentDetail({ student, onBack }: { student: Student; onBack: () => void }) {
  const { data: submissions, isLoading: loadingSubs } = useGetSubmissionsByStudent(student.studentId);
  const { data: feedbacks, isLoading: loadingFb } = useGetFeedbackForStudent(student.studentId);

  const isLoading = loadingSubs || loadingFb;

  const feedbackMap = new Map<string, GeneratedFeedback>();
  feedbacks?.forEach((fb) => feedbackMap.set(fb.submissionId.toString(), fb));

  const sorted = submissions
    ? [...submissions].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];

  return (
    <div className="animate-fade-in">
      <Button variant="ghost" onClick={onBack} className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to all students
      </Button>

      <div className="flex items-start gap-4 mb-6">
        <div className="h-12 w-12 rounded-xl gradient-amber-teal flex items-center justify-center text-white font-display font-bold text-lg shrink-0">
          {student.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl text-foreground">{student.name}</h2>
          <p className="text-muted-foreground text-sm">
            <span className="font-mono">{student.studentId}</span> · {student.course}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-border p-5 space-y-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No submissions found for this student.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((sub: FeedbackSubmission) => (
            <SubmissionCard
              key={sub.submissionId.toString()}
              submission={sub}
              feedback={feedbackMap.get(sub.submissionId.toString())}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export default function InstructorPanel() {
  const { data: students, isLoading, error } = useGetAllStudents();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  // Aggregate stats from student list
  const totalStudents = students?.length ?? 0;

  const handleDeleteConfirm = () => {
    // Note: Backend does not expose a deleteStudent method.
    // This is documented in backend-gaps.
    setDeleteTarget(null);
  };

  if (selectedStudent) {
    return (
      <main className="flex-1 container mx-auto px-4 py-10 max-w-4xl">
        <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />
      </main>
    );
  }

  return (
    <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-light/60 border border-teal/20 text-teal-dark text-xs font-semibold mb-4">
          <ShieldCheck className="h-3.5 w-3.5" />
          Instructor Panel
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
          Manage Students
        </h1>
        <p className="text-muted-foreground">
          Add students, view their submission history, and monitor aggregate performance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 animate-fade-in">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Users className="h-4 w-4" />
            <span className="text-xs">Total Students</span>
          </div>
          <p className="font-display font-bold text-2xl text-foreground">{totalStudents}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs">Platform</span>
          </div>
          <p className="font-display font-bold text-sm text-foreground">SmartFeedback</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">AI Engine</span>
          </div>
          <p className="font-display font-bold text-sm text-primary">Active</p>
        </div>
      </div>

      {/* Add student form */}
      <div className="mb-8 animate-fade-in">
        <AddStudentForm />
      </div>

      {/* Student table */}
      <div className="animate-fade-in">
        <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Registered Students
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Failed to load students. Please try again.
          </div>
        ) : (
          <StudentTable
            students={students ?? []}
            onView={(s) => setSelectedStudent(s)}
            onDelete={(s) => setDeleteTarget(s)}
          />
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Deleting{' '}
              <strong>{deleteTarget?.name}</strong> ({deleteTarget?.studentId}) is not yet supported
              by the backend. Please contact your system administrator.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
