import { useState } from 'react';
import { useCreateSubmission, useGenerateFeedback } from '../hooks/useQueries';
import type { GeneratedFeedback } from '../backend';
import FeedbackDisplay from '../components/FeedbackDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Send, Sparkles, AlertCircle, Info } from 'lucide-react';

export default function StudentSubmission() {
  const [studentId, setStudentId] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [feedback, setFeedback] = useState<GeneratedFeedback | null>(null);
  const [error, setError] = useState('');

  const createSubmission = useCreateSubmission();
  const generateFeedback = useGenerateFeedback();

  const isLoading = createSubmission.isPending || generateFeedback.isPending;

  const wordCount = submissionText.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFeedback(null);

    if (!studentId.trim() || !assignmentTitle.trim() || !submissionText.trim()) {
      setError('All fields are required.');
      return;
    }

    try {
      const submissionId = await createSubmission.mutateAsync({
        studentId: studentId.trim(),
        assignmentTitle: assignmentTitle.trim(),
        submissionText: submissionText.trim(),
      });

      const result = await generateFeedback.mutateAsync(submissionId);
      setFeedback(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed.';
      if (msg.includes('Student does not exist')) {
        setError(`Student ID "${studentId}" not found. Please register with your instructor first.`);
      } else {
        setError(msg);
      }
    }
  };

  const handleReset = () => {
    setFeedback(null);
    setError('');
    setSubmissionText('');
    setAssignmentTitle('');
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-10 max-w-3xl">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          AI Feedback
        </div>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
          Submit Your Assignment
        </h1>
        <p className="text-muted-foreground">
          Enter your work below and receive instant AI-powered feedback with a score and improvement suggestions.
        </p>
      </div>

      {/* Info tip */}
      <div className="flex items-start gap-2.5 bg-teal-light/40 border border-teal/20 rounded-xl px-4 py-3 mb-6 text-sm text-foreground animate-fade-in">
        <Info className="h-4 w-4 text-teal mt-0.5 shrink-0" />
        <span>
          <strong>Tip:</strong> Longer, well-structured submissions (200+ words) receive higher scores. Make sure your Student ID is registered with your instructor.
        </span>
      </div>

      {/* Form */}
      <Card className="border border-border shadow-card animate-fade-in">
        <CardHeader>
          <CardTitle className="font-display text-xl">Assignment Details</CardTitle>
          <CardDescription>Fill in all fields to receive your AI feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="studentId" className="text-sm font-medium">
                  Student ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="studentId"
                  placeholder="e.g. STU-001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  disabled={isLoading}
                  className="font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="assignmentTitle" className="text-sm font-medium">
                  Assignment Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="assignmentTitle"
                  placeholder="e.g. Essay on Climate Change"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="submissionText" className="text-sm font-medium">
                  Submission Text <span className="text-destructive">*</span>
                </Label>
                <span className={`text-xs ${wordCount >= 200 ? 'text-teal font-medium' : 'text-muted-foreground'}`}>
                  {wordCount} words {wordCount >= 200 ? '✓' : '(aim for 200+)'}
                </span>
              </div>
              <Textarea
                id="submissionText"
                placeholder="Write or paste your assignment text here…"
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                disabled={isLoading}
                rows={10}
                className="resize-none leading-relaxed"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 gradient-amber-teal text-white border-0 hover:opacity-90 font-semibold"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {createSubmission.isPending ? 'Submitting…' : 'Generating feedback…'}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit & Get Feedback
                  </>
                )}
              </Button>
              {feedback && (
                <Button type="button" variant="outline" onClick={handleReset} size="lg">
                  New Submission
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Feedback result */}
      {feedback && (
        <div className="mt-8">
          <h2 className="font-display font-bold text-xl text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Your AI Feedback
          </h2>
          <FeedbackDisplay feedback={feedback} />
        </div>
      )}
    </main>
  );
}
