import { useState, useEffect, useRef } from "react";
import {
  useGetAllStudents,
  useGetSubmissionsByStudent,
  useGetFeedbackForStudent,
  useVerifyInstructor,
  useGetSystemStats,
  useGetAllInstructors,
} from "@/hooks/useQueries";
import {
  Users,
  ChevronLeft,
  AlertCircle,
  FileText,
  Award,
  LogOut,
  Lock,
  Loader2,
  BarChart3,
  GraduationCap,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddStudentForm from "@/components/AddStudentForm";
import StudentTable from "@/components/StudentTable";
import SubmissionCard from "@/components/SubmissionCard";
import AddInstructorForm from "@/components/AddInstructorForm";
import InstructorTable from "@/components/InstructorTable";
import ScoreDistributionChart from "@/components/ScoreDistributionChart";
import { Student, GeneratedFeedback } from "@/backend";

// ─── Login Form ───────────────────────────────────────────────────────────────

interface LoginFormProps {
  onLogin: (instructorId: bigint) => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [idInput, setIdInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const verifyInstructor = useVerifyInstructor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedId = parseInt(idInput.trim(), 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      setErrorMsg('Please enter a valid Instructor ID (a positive number).');
      return;
    }
    if (!pinInput.trim()) {
      setErrorMsg('PIN is required.');
      return;
    }

    try {
      const ok = await verifyInstructor.mutateAsync({
        instructorId: BigInt(parsedId),
        pin: pinInput.trim(),
      });
      if (ok) {
        onLogin(BigInt(parsedId));
      } else {
        setErrorMsg('Invalid Instructor ID or PIN. Please try again.');
      }
    } catch {
      setErrorMsg('Verification failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-au-red mb-4 shadow-glow-red">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-au-navy mb-2">
            Instructor Panel
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in with your Instructor ID and PIN to access the panel.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="login-id" className="text-xs font-semibold text-au-navy">
                Instructor ID
              </Label>
              <Input
                id="login-id"
                type="number"
                placeholder="e.g. 1"
                value={idInput}
                onChange={(e) => setIdInput(e.target.value)}
                disabled={verifyInstructor.isPending}
                className="border-red-100 focus-visible:ring-au-red/30"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-pin" className="text-xs font-semibold text-au-navy">
                PIN / Password
              </Label>
              <Input
                id="login-pin"
                type="password"
                placeholder="Enter your PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                disabled={verifyInstructor.isPending}
                className="border-red-100 focus-visible:ring-au-red/30"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
                <AlertCircle size={14} className="shrink-0" />
                {errorMsg}
              </div>
            )}

            <Button
              type="submit"
              disabled={verifyInstructor.isPending}
              className="w-full bg-au-red hover:bg-au-red-dark text-white font-semibold"
            >
              {verifyInstructor.isPending ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <UserCheck size={16} className="mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-5">
            Don't have an account? Contact the system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── System Analytics ─────────────────────────────────────────────────────────

function SystemAnalytics({ allFeedbacks }: { allFeedbacks: GeneratedFeedback[] }) {
  const { data: stats, isLoading } = useGetSystemStats();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const statCards = [
    {
      icon: Users,
      label: 'Total Students',
      value: isLoading ? '…' : String(stats?.totalStudents ?? 0),
    },
    {
      icon: FileText,
      label: 'Total Submissions',
      value: isLoading ? '…' : String(stats?.totalSubmissions ?? 0),
    },
    {
      icon: TrendingUp,
      label: 'Average Score',
      value: isLoading ? '…' : `${stats?.overallAverageScore ?? 0}%`,
    },
    {
      icon: Award,
      label: 'Top Student',
      value: isLoading
        ? '…'
        : stats?.topStudent
        ? `${stats.topStudent.studentId} (${stats.topStudent.averageScore}%)`
        : 'N/A',
    },
  ];

  return (
    <div ref={ref} className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value }, i) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-red-100 p-5 shadow-sm flex items-center gap-4 transition-all duration-500"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: `${i * 80}ms`,
            }}
          >
            {isLoading ? (
              <>
                <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-au-red" />
                </div>
                <div>
                  <p className="text-lg font-bold text-au-navy leading-tight">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Score Distribution Chart */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 size={18} className="text-au-red" />
          <h3 className="text-base font-semibold text-au-navy">Score Distribution</h3>
        </div>
        <ScoreDistributionChart feedbacks={allFeedbacks} />
      </div>
    </div>
  );
}

// ─── Student Detail ───────────────────────────────────────────────────────────

function StudentDetail({ student, onBack }: { student: Student; onBack: () => void }) {
  const { data: submissions = [], isLoading: loadingSubs } =
    useGetSubmissionsByStudent(student.studentId);
  const { data: feedbacks = [], isLoading: loadingFb } =
    useGetFeedbackForStudent(student.studentId);

  const isLoading = loadingSubs || loadingFb;

  const feedbackMap = feedbacks.reduce<Record<string, GeneratedFeedback>>(
    (acc, fb) => { acc[String(fb.submissionId)] = fb; return acc; },
    {}
  );

  const avgScore =
    feedbacks.length > 0
      ? Math.round(feedbacks.reduce((s, f) => s + Number(f.score), 0) / feedbacks.length)
      : 0;

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-au-red hover:text-au-red-dark font-medium mb-6 transition-colors"
      >
        <ChevronLeft size={16} />
        Back to Students
      </button>

      <div className="bg-white rounded-2xl border border-red-100 p-5 mb-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-au-navy">{student.name}</h2>
            <p className="text-sm text-muted-foreground">
              ID: {student.studentId} · {student.course}
            </p>
          </div>
          <div className="flex gap-3 text-center">
            <div className="px-4 py-2 bg-red-50 rounded-xl">
              <p className="text-lg font-bold text-au-red">{submissions.length}</p>
              <p className="text-xs text-muted-foreground">Submissions</p>
            </div>
            <div className="px-4 py-2 bg-red-50 rounded-xl">
              <p className="text-lg font-bold text-au-red">{avgScore}%</p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl skeleton-shimmer" />
          ))}
        </div>
      )}

      {!isLoading && submissions.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText size={36} className="mx-auto mb-3 text-red-200" />
          <p className="font-medium text-au-navy">No submissions yet</p>
        </div>
      )}

      {!isLoading && submissions.length > 0 && (
        <div className="space-y-3">
          {submissions.map((sub, i) => (
            <SubmissionCard
              key={String(sub.submissionId)}
              submission={sub}
              feedback={feedbackMap[String(sub.submissionId)]}
              animationDelay={i * 60}
              showNotes={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Manage Instructors ───────────────────────────────────────────────────────

function ManageInstructors() {
  const { data: instructors = [], isLoading } = useGetAllInstructors();

  return (
    <div className="space-y-6">
      {/* Add Instructor */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap size={18} className="text-au-red" />
          <h3 className="text-base font-semibold text-au-navy">Add New Instructor</h3>
        </div>
        <AddInstructorForm />
      </div>

      {/* Instructor Table */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-au-red" />
          <h3 className="text-base font-semibold text-au-navy">
            All Instructors ({instructors.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : (
          <InstructorTable instructors={instructors} />
        )}
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

export default function InstructorPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authenticatedInstructorId, setAuthenticatedInstructorId] = useState<bigint | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const { data: students = [], isLoading, isError } = useGetAllStudents();
  const { data: allFeedbacks = [] } = useGetFeedbackForStudent('');

  // Collect all feedbacks across all students for the chart
  // We'll gather them from the students list via a separate component
  const [aggregatedFeedbacks, setAggregatedFeedbacks] = useState<GeneratedFeedback[]>([]);

  // We use a dedicated hook-based aggregator component approach
  // Instead, we pass students to the analytics and let it fetch internally

  function handleLogin(instructorId: bigint) {
    setIsAuthenticated(true);
    setAuthenticatedInstructorId(instructorId);
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setAuthenticatedInstructorId(null);
    setSelectedStudent(null);
  }

  function handleDelete(_student: Student) {
    // Delete is not supported by the backend
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (selectedStudent) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Logout button in detail view */}
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs border-red-200 text-au-red hover:bg-red-50"
            >
              <LogOut size={13} className="mr-1.5" />
              Logout
            </Button>
          </div>
          <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-au-red shadow-glow-red">
              <Users size={26} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-au-navy">
                Instructor Panel
              </h1>
              <p className="text-muted-foreground text-sm">
                Signed in as Instructor #{String(authenticatedInstructorId)}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-red-200 text-au-red hover:bg-red-50 font-medium"
          >
            <LogOut size={14} className="mr-1.5" />
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="bg-red-50 border border-red-100 p-1 rounded-xl">
            <TabsTrigger
              value="students"
              className="rounded-lg text-sm data-[state=active]:bg-au-red data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <Users size={14} className="mr-1.5" />
              Students
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="rounded-lg text-sm data-[state=active]:bg-au-red data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <BarChart3 size={14} className="mr-1.5" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="instructors"
              className="rounded-lg text-sm data-[state=active]:bg-au-red data-[state=active]:text-white data-[state=active]:shadow-sm"
            >
              <GraduationCap size={14} className="mr-1.5" />
              Manage Instructors
            </TabsTrigger>
          </TabsList>

          {/* ── Students Tab ── */}
          <TabsContent value="students" className="space-y-6">
            {/* Add student */}
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-au-navy mb-4">Add New Student</h2>
              <AddStudentForm />
            </div>

            {/* Student table */}
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-au-navy mb-4">
                Students ({students.length})
              </h2>

              {isLoading && (
                <div className="space-y-3">
                  {[0, 1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 rounded-lg skeleton-shimmer" />
                  ))}
                </div>
              )}

              {isError && !isLoading && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                  <AlertCircle size={16} />
                  <span>Failed to load students. Please refresh.</span>
                </div>
              )}

              {!isLoading && !isError && (
                <StudentTable
                  students={students}
                  onView={setSelectedStudent}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </TabsContent>

          {/* ── Analytics Tab ── */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="mb-2">
              <h2 className="text-base font-semibold text-au-navy">System Analytics</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Platform-wide statistics and score distribution.
              </p>
            </div>
            <AllFeedbacksAnalytics />
          </TabsContent>

          {/* ── Manage Instructors Tab ── */}
          <TabsContent value="instructors">
            <ManageInstructors />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ─── All Feedbacks Analytics (fetches per-student feedbacks) ──────────────────

function AllFeedbacksAnalytics() {
  const { data: students = [] } = useGetAllStudents();
  return <AllFeedbacksAggregator students={students} />;
}

function AllFeedbacksAggregator({ students }: { students: Student[] }) {
  // We render one hidden fetcher per student and aggregate
  const [feedbacksMap, setFeedbacksMap] = useState<Record<string, GeneratedFeedback[]>>({});

  const allFeedbacks = Object.values(feedbacksMap).flat();

  return (
    <>
      {students.map((s) => (
        <StudentFeedbackFetcher
          key={s.studentId}
          studentId={s.studentId}
          onData={(fbs) =>
            setFeedbacksMap((prev) => ({ ...prev, [s.studentId]: fbs }))
          }
        />
      ))}
      <SystemAnalytics allFeedbacks={allFeedbacks} />
    </>
  );
}

function StudentFeedbackFetcher({
  studentId,
  onData,
}: {
  studentId: string;
  onData: (fbs: GeneratedFeedback[]) => void;
}) {
  const { data: feedbacks = [] } = useGetFeedbackForStudent(studentId);

  useEffect(() => {
    onData(feedbacks);
  }, [feedbacks]);

  return null;
}
