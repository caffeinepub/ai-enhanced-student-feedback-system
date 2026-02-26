import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Student, FeedbackSubmission, GeneratedFeedback, Instructor, SystemStats } from '../backend';
import { toast } from 'sonner';

// ─── Students ────────────────────────────────────────────────────────────────

export function useGetAllStudents() {
  const { actor, isFetching } = useActor();
  return useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStudent(studentId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Student>({
    queryKey: ['student', studentId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return actor.getStudent(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
    retry: false,
  });
}

export function useAddStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ studentId, name, course }: { studentId: string; name: string; course: string }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addStudent(studentId, name, course);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

// ─── Submissions ─────────────────────────────────────────────────────────────

export function useGetSubmissionsByStudent(studentId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<FeedbackSubmission[]>({
    queryKey: ['submissions', studentId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubmissionsByStudent(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useCreateSubmission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      assignmentTitle,
      submissionText,
    }: {
      studentId: string;
      assignmentTitle: string;
      submissionText: string;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.createSubmission(studentId, assignmentTitle, submissionText);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissions', variables.studentId] });
    },
  });
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

export function useGenerateFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (submissionId: bigint) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.generateFeedback(submissionId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['feedback', data.submissionId.toString()] });
    },
  });
}

export function useGetFeedbackForStudent(studentId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<GeneratedFeedback[]>({
    queryKey: ['feedbackForStudent', studentId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeedbackForStudent(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useGetStudentStats(studentId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<{ totalSubmissions: bigint; averageScore: bigint }>({
    queryKey: ['studentStats', studentId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return actor.getStudentStats(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

// ─── Instructor Auth ──────────────────────────────────────────────────────────

export function useVerifyInstructor() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ instructorId, pin }: { instructorId: bigint; pin: string }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.verifyInstructor(instructorId, pin);
    },
  });
}

// ─── System Stats ─────────────────────────────────────────────────────────────

export function useGetSystemStats() {
  const { actor, isFetching } = useActor();
  return useQuery<SystemStats>({
    queryKey: ['systemStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return actor.getSystemStats();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Submission Notes ─────────────────────────────────────────────────────────

export function useGetSubmissionNote(submissionId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<string | null>({
    queryKey: ['submissionNote', submissionId?.toString()],
    queryFn: async () => {
      if (!actor || submissionId === null) return null;
      try {
        return await actor.getSubmissionNote(submissionId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && submissionId !== null,
    retry: false,
  });
}

export function useAddInstructorNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ submissionId, note }: { submissionId: bigint; note: string }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addSubmissionNote(submissionId, note);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissionNote', variables.submissionId.toString()] });
      toast.success('Note saved successfully!');
    },
    onError: () => {
      toast.error('Failed to save note. Please try again.');
    },
  });
}

// ─── Instructor Management ────────────────────────────────────────────────────

export function useGetAllInstructors() {
  const { actor, isFetching } = useActor();
  return useQuery<Instructor[]>({
    queryKey: ['instructors'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInstructors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddInstructor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      department,
      pin,
    }: {
      name: string;
      email: string;
      department: string;
      pin: string;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.registerInstructor(name, email, department, pin);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instructor added successfully!');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to add instructor.';
      toast.error(msg);
    },
  });
}

export function useDeleteInstructor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (instructorId: bigint) => {
      if (!actor) throw new Error('Actor not ready');
      // Backend doesn't have a delete endpoint; we use updateInstructor as a no-op placeholder
      // This is a frontend-only soft delete — see backend-gaps
      throw new Error('Delete instructor is not supported by the backend.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      toast.success('Instructor removed.');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to delete instructor.';
      toast.error(msg);
    },
  });
}
