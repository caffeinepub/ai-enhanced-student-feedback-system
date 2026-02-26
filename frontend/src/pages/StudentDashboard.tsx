import { useState } from 'react';
import { useGetSubmissionsByStudent, useGetFeedbackForStudent } from '../hooks/useQueries';
import type { FeedbackSubmission, GeneratedFeedback } from '../backend';
import SubmissionCard from '../components/SubmissionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, LayoutDashboard, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-border p-5 space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

interface DashboardContentProps {
  studentId: string;
}

function DashboardContent({ studentId }: DashboardContentProps) {
  const { data: submissions, isLoading: loadingSubs, error: subError } = useGetSubmissionsByStudent(studentId);
  const { data: feedbacks, isLoading: loadingFb } = useGetFeedbackForStudent(studentId);

  const isLoading = loadingSubs || loadingFb;

  if (isLoading) return <DashboardSkeleton />;

  if (subError) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Could not load submissions. Please check your Student ID.
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
        <h3 className="font-display font-semibold text-lg text-foreground mb-2">No submissions yet</h3>
        <p className="text-muted-foreground text-sm">
          No submissions found for Student ID <strong>{studentId}</strong>. Submit your first assignment to see feedback here.
        </p>
      </div>
    );
  }

  // Build feedback map
  const feedbackMap = new Map<string, GeneratedFeedback>();
  feedbacks?.forEach((fb) => {
    feedbackMap.set(fb.submissionId.toString(), fb);
  });

  // Sort by timestamp descending
  const sorted = [...submissions].sort((a, b) =>
    Number(b.timestamp - a.timestamp)
  );

  // Stats
  const scoredFeedbacks = feedbacks?.filter((fb) => fb.score !== undefined) ?? [];
  const avgScore =
    scoredFeedbacks.length > 0
      ? Math.round(scoredFeedbacks.reduce((sum, fb) => sum + Number(fb.score), 0) / scoredFeedbacks.length)
      : null;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-xs text-muted-foreground mb-1">Total Submissions</p>
          <p className="font-display font-bold text-2xl text-foreground">{submissions.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-xs text-muted-foreground mb-1">Feedback Received</p>
          <p className="font-display font-bold text-2xl text-foreground">{scoredFeedbacks.length}</p>
        </div>
        {avgScore !== null && (
          <div className="rounded-xl border border-border bg-card p-4 shadow-card col-span-2 sm:col-span-1">
            <p className="text-xs text-muted-foreground mb-1">Average Score</p>
            <p className="font-display font-bold text-2xl text-primary flex items-center gap-1.5">
              <TrendingUp className="h-5 w-5" />
              {avgScore}/100
            </p>
          </div>
        )}
      </div>

      {/* Submission cards */}
      <div className="space-y-4">
        {sorted.map((sub: FeedbackSubmission) => (
          <SubmissionCard
            key={sub.submissionId.toString()}
            submission={sub}
            feedback={feedbackMap.get(sub.submissionId.toString())}
          />
        ))}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const [inputId, setInputId] = useState('');
  const [activeId, setActiveId] = useState('');

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputId.trim()) setActiveId(inputId.trim());
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-light/60 border border-teal/20 text-teal-dark text-xs font-semibold mb-4">
          <LayoutDashboard className="h-3.5 w-3.5" />
          Student Dashboard
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
          My Feedback History
        </h1>
        <p className="text-muted-foreground">
          Enter your Student ID to view all your past submissions and AI-generated feedback.
        </p>
      </div>

      {/* Lookup form */}
      <form onSubmit={handleLookup} className="flex gap-3 mb-8 animate-fade-in">
        <div className="flex-1 space-y-1">
          <Label htmlFor="lookup-id" className="sr-only">Student ID</Label>
          <Input
            id="lookup-id"
            placeholder="Enter your Student ID (e.g. STU-001)"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            className="font-mono"
          />
        </div>
        <Button
          type="submit"
          className="gradient-amber-teal text-white border-0 hover:opacity-90 font-semibold shrink-0"
        >
          <Search className="h-4 w-4 mr-2" />
          Look Up
        </Button>
      </form>

      {/* Results */}
      {activeId && (
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Showing results for <strong className="text-foreground font-mono">{activeId}</strong>
          </p>
          <DashboardContent studentId={activeId} />
        </div>
      )}

      {!activeId && (
        <div className="text-center py-16 text-muted-foreground animate-fade-in">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="font-medium">Enter your Student ID above to get started.</p>
        </div>
      )}
    </main>
  );
}
