import { GeneratedFeedback } from "@/backend";
import { CheckCircle, AlertCircle, Lightbulb, Star } from "lucide-react";

interface FeedbackDisplayProps {
  feedback: GeneratedFeedback;
}

function getScoreColor(score: number): string {
  if (score >= 85) return "bg-au-red text-white";
  if (score >= 70) return "bg-orange-500 text-white";
  return "bg-red-800 text-white";
}

function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Work";
  return "Poor";
}

export default function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  const score = Number(feedback.score);

  return (
    <div className="space-y-4">
      {/* Score card */}
      <div
        className="feedback-slide flex items-center gap-4 p-5 rounded-xl border border-red-100 bg-white shadow-sm"
        style={{ animationDelay: "0ms" }}
      >
        <div
          className={`score-badge-animate flex-shrink-0 w-16 h-16 rounded-full flex flex-col items-center justify-center font-bold shadow-md ${getScoreColor(score)}`}
        >
          <span className="text-xl leading-none">{score}</span>
          <span className="text-[9px] uppercase tracking-wide opacity-80">pts</span>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star size={14} className="text-au-red fill-au-red" />
            <span className="text-sm font-semibold text-au-navy">
              Score: {getScoreLabel(score)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feedback.feedbackText}
          </p>
        </div>
      </div>

      {/* Suggestions */}
      {feedback.suggestions.length > 0 && (
        <div
          className="feedback-slide p-5 rounded-xl border border-red-100 bg-red-50/50"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-au-red" />
            <h4 className="text-sm font-semibold text-au-navy">
              Suggestions for Improvement
            </h4>
          </div>
          <ul className="space-y-2">
            {feedback.suggestions.map((s, i) => (
              <li
                key={i}
                className="feedback-slide flex items-start gap-2 text-sm text-foreground"
                style={{ animationDelay: `${(i + 2) * 80}ms` }}
              >
                <CheckCircle
                  size={14}
                  className="text-au-red mt-0.5 flex-shrink-0"
                />
                <span>{s.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.suggestions.length === 0 && (
        <div
          className="feedback-slide flex items-center gap-3 p-4 rounded-xl border border-red-100 bg-red-50/30"
          style={{ animationDelay: "120ms" }}
        >
          <AlertCircle size={16} className="text-au-red" />
          <p className="text-sm text-au-navy font-medium">
            Outstanding work — no additional suggestions needed!
          </p>
        </div>
      )}
    </div>
  );
}
