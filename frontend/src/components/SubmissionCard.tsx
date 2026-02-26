import { useState, useEffect } from "react";
import { FeedbackSubmission, GeneratedFeedback } from "@/backend";
import { ChevronDown, ChevronUp, Calendar, BookOpen, StickyNote, Save, Loader2 } from "lucide-react";
import FeedbackDisplay from "./FeedbackDisplay";
import { useGetSubmissionNote, useAddInstructorNote } from "@/hooks/useQueries";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SubmissionCardProps {
  submission: FeedbackSubmission;
  feedback?: GeneratedFeedback;
  animationDelay?: number;
  showNotes?: boolean;
}

function InstructorNotes({ submissionId }: { submissionId: bigint }) {
  const { data: existingNote, isLoading } = useGetSubmissionNote(submissionId);
  const saveNote = useAddInstructorNote();
  const [noteText, setNoteText] = useState('');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && existingNote !== undefined && existingNote !== null) {
      setNoteText(existingNote);
      setInitialized(true);
    } else if (!initialized && existingNote === null) {
      setInitialized(true);
    }
  }, [existingNote, initialized]);

  const handleSave = () => {
    saveNote.mutate({ submissionId, note: noteText });
  };

  return (
    <div className="mt-3 pt-3 border-t border-red-50">
      <div className="flex items-center gap-1.5 mb-2">
        <StickyNote size={13} className="text-au-red" />
        <span className="text-xs font-semibold text-au-navy">Instructor Notes</span>
      </div>
      {isLoading ? (
        <div className="h-16 bg-red-50/50 rounded-lg animate-pulse" />
      ) : (
        <>
          <Textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add your notes about this submission…"
            className="text-xs min-h-[72px] resize-none border-red-100 focus-visible:ring-au-red/30 bg-red-50/30"
            disabled={saveNote.isPending}
          />
          <div className="flex items-center justify-between mt-2">
            {!noteText && !existingNote && (
              <p className="text-xs text-muted-foreground italic">
                No notes yet — add your observations above.
              </p>
            )}
            {(noteText || existingNote) && <span />}
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saveNote.isPending || !noteText.trim()}
              className="h-7 px-3 text-xs bg-au-red hover:bg-au-red-dark text-white ml-auto"
            >
              {saveNote.isPending ? (
                <>
                  <Loader2 size={11} className="mr-1 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={11} className="mr-1" />
                  Save Note
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default function SubmissionCard({
  submission,
  feedback,
  animationDelay = 0,
  showNotes = false,
}: SubmissionCardProps) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(Number(submission.timestamp) / 1_000_000);
  const dateStr = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="animate-slide-up bg-white rounded-xl border border-red-100 shadow-sm hover:shadow-card-hover transition-all duration-300 overflow-hidden"
      style={{ animationDelay: `${animationDelay}ms`, opacity: 0 }}
    >
      {/* Header */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={14} className="text-au-red flex-shrink-0" />
            <h3 className="text-sm font-semibold text-au-navy truncate">
              {submission.assignmentTitle}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={11} />
            <span>{dateStr}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {feedback && (
            <span
              className={`score-badge-animate text-xs font-bold px-2.5 py-1 rounded-full bg-au-red text-white shadow-sm`}
            >
              {Number(feedback.score)}
            </span>
          )}
          <button
            onClick={() => setExpanded((e) => !e)}
            className="p-1.5 rounded-md text-au-navy hover:bg-red-50 hover:text-au-red transition-colors"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expandable feedback */}
      <div
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{
          gridTemplateRows: expanded ? "1fr" : "0fr",
          display: "grid",
        }}
      >
        <div className="min-h-0">
          {expanded && (
            <div className="px-4 pb-4 border-t border-red-50 pt-3">
              <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                {submission.submissionText}
              </p>
              {feedback ? (
                <FeedbackDisplay feedback={feedback} />
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No feedback generated yet.
                </p>
              )}
              {showNotes && (
                <InstructorNotes submissionId={submission.submissionId} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
