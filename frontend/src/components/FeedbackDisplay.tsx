import type { GeneratedFeedback } from '../backend';
import { CheckCircle2, Lightbulb, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeedbackDisplayProps {
  feedback: GeneratedFeedback;
}

function ScoreBadge({ score }: { score: number }) {
  const scoreClass =
    score >= 85 ? 'score-badge-high' : score >= 70 ? 'score-badge-mid' : 'score-badge-low';

  const label =
    score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Needs Work' : 'Insufficient';

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${scoreClass} shadow-sm`}>
      <Star className="h-4 w-4 fill-white/80 text-white" />
      <span className="font-display font-bold text-lg">{score}</span>
      <span className="text-sm font-medium opacity-90">/100 · {label}</span>
    </div>
  );
}

export default function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  const score = Number(feedback.score);

  return (
    <div className="animate-fade-in space-y-4">
      {/* Score */}
      <Card className="border-0 shadow-card bg-gradient-to-br from-card to-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-xs text-muted-foreground uppercase tracking-wide font-semibold">
            AI Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScoreBadge score={score} />
        </CardContent>
      </Card>

      {/* Feedback Text */}
      <Card className="border-0 shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CheckCircle2 className="h-4 w-4 text-teal" />
            Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">{feedback.feedbackText}</p>
        </CardContent>
      </Card>

      {/* Suggestions */}
      {feedback.suggestions.length > 0 && (
        <Card className="border-0 shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Lightbulb className="h-4 w-4 text-primary" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {feedback.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground leading-relaxed">{s.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
