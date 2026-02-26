import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Student, FeedbackSubmission, GeneratedFeedback } from '../backend';

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
