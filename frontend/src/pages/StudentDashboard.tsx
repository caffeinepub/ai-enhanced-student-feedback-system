import { useState } from "react";
import { useGetSubmissionsByStudent, useGetFeedbackForStudent } from "@/hooks/useQueries";
import { BarChart3, FileText, Award, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SubmissionCard from "@/components/SubmissionCard";
import { GeneratedFeedback } from "@/backend";
import { AlertCircle } from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: typeof BarChart3;
  label: string;
  value: string | number;
  delay: number;
}) {
  return (
    <div
      className="animate-slide-up bg-white rounded-xl border border-red-100 p-5 shadow-sm flex items-center gap-4"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-au-red" />
      </div>
      <div>
        <p className="text-xl font-bold text-au-navy">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const [inputId, setInputId]     = useState("");
  const [studentId, setStudentId] = useState("");

  const {
    data: submissions = [],
    isLoading: loadingSubs,
    isError: errorSubs,
  } = useGetSubmissionsByStudent(studentId);

  const {
    data: feedbacks = [],
    isLoading: loadingFb,
  } = useGetFeedbackForStudent(studentId);

  const isLoading = loadingSubs || loadingFb;

  const feedbackMap = feedbacks.reduce<Record<string, GeneratedFeedback>>(
    (acc, fb) => { acc[String(fb.submissionId)] = fb; return acc; },
    {}
  );

  const avgScore =
    feedbacks.length > 0
      ? Math.round(feedbacks.reduce((s, f) => s + Number(f.score), 0) / feedbacks.length)
      : 0;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setStudentId(inputId.trim());
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-au-red mb-4 shadow-glow-red">
            <BarChart3 size={26} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-au-navy mb-2">
            Student Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            View your submissions and AI-generated feedback.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <Input
            placeholder="Enter your Student ID…"
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            className="border-red-100 focus:border-au-red focus:ring-au-red"
          />
          <Button
            type="submit"
            className="bg-au-red hover:bg-au-red-dark text-white rounded-xl px-5 shadow-sm"
          >
            <Search size={16} className="mr-1.5" />
            Search
          </Button>
        </form>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl skeleton-shimmer" />
              ))}
            </div>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl skeleton-shimmer" />
            ))}
          </div>
        )}

        {/* Error */}
        {errorSubs && !isLoading && (
          <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            <AlertCircle size={16} />
            <span>Could not load submissions. Please check your Student ID.</span>
          </div>
        )}

        {/* Stats */}
        {!isLoading && studentId && submissions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard icon={FileText}  label="Total Submissions" value={submissions.length} delay={0} />
            <StatCard icon={Award}     label="Feedback Received" value={feedbacks.length}   delay={80} />
            <StatCard icon={BarChart3} label="Average Score"     value={`${avgScore}%`}     delay={160} />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && studentId && submissions.length === 0 && !errorSubs && (
          <div className="text-center py-16 text-muted-foreground">
            <FileText size={40} className="mx-auto mb-3 text-red-200" />
            <p className="font-medium text-au-navy">No submissions found</p>
            <p className="text-sm mt-1">
              Submit an assignment to see your feedback here.
            </p>
          </div>
        )}

        {/* Submission cards */}
        {!isLoading && submissions.length > 0 && (
          <div className="space-y-3">
            {submissions.map((sub, i) => (
              <SubmissionCard
                key={String(sub.submissionId)}
                submission={sub}
                feedback={feedbackMap[String(sub.submissionId)]}
                animationDelay={i * 80}
              />
            ))}
          </div>
        )}

        {/* Prompt */}
        {!studentId && !isLoading && (
          <div className="text-center py-16 text-muted-foreground">
            <Search size={40} className="mx-auto mb-3 text-red-200" />
            <p className="font-medium text-au-navy">Enter your Student ID above to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
