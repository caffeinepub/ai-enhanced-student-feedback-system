import { useState } from "react";
import { Brain, Send, Loader2, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCreateSubmission, useGenerateFeedback } from "@/hooks/useQueries";
import FeedbackDisplay from "@/components/FeedbackDisplay";
import { GeneratedFeedback } from "@/backend";

export default function StudentSubmission() {
  const [studentId, setStudentId]         = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [submissionText, setSubmissionText]   = useState("");
  const [feedback, setFeedback]           = useState<GeneratedFeedback | null>(null);
  const [error, setError]                 = useState<string | null>(null);

  const createSubmission = useCreateSubmission();
  const generateFeedback = useGenerateFeedback();

  const isLoading = createSubmission.isPending || generateFeedback.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFeedback(null);

    if (!studentId.trim() || !assignmentTitle.trim() || !submissionText.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const submissionId = await createSubmission.mutateAsync({
        studentId: studentId.trim(),
        assignmentTitle: assignmentTitle.trim(),
        submissionText: submissionText.trim(),
      });
      const fb = await generateFeedback.mutateAsync(submissionId);
      setFeedback(fb);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Student does not exist")) {
        setError("Student ID not found. Please check your ID or contact your instructor.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-au-red mb-4 shadow-glow-red">
            <Brain size={26} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-au-navy mb-2">
            Submit Assignment
          </h1>
          <p className="text-muted-foreground text-sm">
            Submit your work and receive instant AI-powered feedback.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="studentId" className="text-au-navy font-medium text-sm">
                Student ID
              </Label>
              <Input
                id="studentId"
                placeholder="e.g. AU2024001"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={isLoading}
                className="border-red-100 focus:border-au-red focus:ring-au-red"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="assignmentTitle" className="text-au-navy font-medium text-sm">
                Assignment Title
              </Label>
              <Input
                id="assignmentTitle"
                placeholder="e.g. Data Structures Essay"
                value={assignmentTitle}
                onChange={(e) => setAssignmentTitle(e.target.value)}
                disabled={isLoading}
                className="border-red-100 focus:border-au-red focus:ring-au-red"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="submissionText" className="text-au-navy font-medium text-sm">
                Submission Text
              </Label>
              <Textarea
                id="submissionText"
                placeholder="Paste or type your assignment here..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                disabled={isLoading}
                rows={8}
                className="border-red-100 focus:border-au-red focus:ring-au-red resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {submissionText.trim().split(/\s+/).filter(Boolean).length} words
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* AI loading state */}
            {isLoading && (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-red-50 animate-ping-ring absolute inset-0" />
                  <div className="w-16 h-16 rounded-full bg-red-100 animate-ping-ring absolute inset-0" style={{ animationDelay: "0.5s" }} />
                  <div className="relative w-16 h-16 rounded-full bg-au-red flex items-center justify-center shadow-glow-red">
                    <Brain size={28} className="text-white animate-spin" style={{ animationDuration: "3s" }} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-au-navy">
                    {createSubmission.isPending ? "Submitting…" : "Generating AI Feedback…"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This may take a moment
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-au-red hover:bg-au-red-dark text-white font-semibold rounded-xl py-3 shadow-sm hover:shadow-glow-red transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : (
                <Send size={16} className="mr-2" />
              )}
              {isLoading ? "Processing…" : "Submit & Get Feedback"}
            </Button>
          </form>
        </div>

        {/* Feedback result */}
        {feedback && !isLoading && (
          <div className="mt-6 bg-white rounded-2xl border border-red-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-au-red flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <h2 className="text-base font-semibold text-au-navy">AI Feedback</h2>
              <CheckCircle size={16} className="text-au-red ml-auto" />
            </div>
            <FeedbackDisplay feedback={feedback} />
          </div>
        )}
      </div>
    </div>
  );
}
