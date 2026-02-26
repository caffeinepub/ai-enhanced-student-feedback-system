import type { FeedbackSubmission, GeneratedFeedback } from '../backend';
import { Calendar, BookOpen, Star, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useState } from 'react';

interface SubmissionCardProps {
  submission: FeedbackSubmission;
  feedback?: GeneratedFeedback;
}

function ScorePill({ score }: { score: number }) {
  const cls =
    score >= 85 ? 'score-badge-high' : score >= 70 ? 'score-badge-mid' : 'score-badge-low';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${cls}`}>
      <Star className="h-3 w-3 fill-white/80 text-white" />
      {score}/100
    </span>
  );
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SubmissionCard({ submission, feedback }: SubmissionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const score = feedback ? Number(feedback.score) : null;

  return (
    <Card className="border border-border shadow-card card-hover overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-foreground truncate">
                {submission.assignmentTitle}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(submission.timestamp)}</span>
              </div>
            </div>
          </div>
          {score !== null && <ScorePill score={score} />}
        </div>
      </CardHeader>

      {feedback && (
        <CardContent className="pt-0">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" /> Hide feedback
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" /> View feedback
              </>
            )}
          </button>

          {expanded && (
            <div className="mt-4 space-y-3 animate-fade-in">
              <p className="text-sm text-foreground leading-relaxed bg-muted/40 rounded-lg p-3">
                {feedback.feedbackText}
              </p>

              {feedback.suggestions.length > 0 && (
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
                    <Lightbulb className="h-3.5 w-3.5 text-primary" />
                    Suggestions
                  </p>
                  <ul className="space-y-1.5">
                    {feedback.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                          {i + 1}
                        </span>
                        {s.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
