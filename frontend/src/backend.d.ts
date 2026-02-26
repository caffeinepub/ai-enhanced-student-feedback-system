import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Student {
    studentId: StudentId;
    name: string;
    course: string;
}
export interface FeedbackSubmission {
    studentId: string;
    timestamp: Time;
    submissionText: string;
    submissionId: SubmissionId;
    assignmentTitle: AssignmentTitle;
}
export type AssignmentTitle = string;
export type Time = bigint;
export interface GeneratedFeedback {
    suggestions: Array<Suggestion>;
    feedbackText: string;
    score: bigint;
    timestamp: Time;
    submissionId: SubmissionId;
}
export interface Suggestion {
    text: string;
}
export type StudentId = string;
export type SubmissionId = bigint;
export interface backendInterface {
    addStudent(studentId: StudentId, name: string, course: string): Promise<void>;
    createSubmission(studentId: StudentId, assignmentTitle: AssignmentTitle, submissionText: string): Promise<SubmissionId>;
    generateFeedback(submissionId: SubmissionId): Promise<GeneratedFeedback>;
    getAllFeedbackForStudent(studentId: StudentId): Promise<Array<GeneratedFeedback>>;
    getAllStudents(): Promise<Array<Student>>;
    getAllSubmissionsByStudent(studentId: StudentId): Promise<Array<FeedbackSubmission>>;
    getFeedback(submissionId: SubmissionId): Promise<GeneratedFeedback>;
    getStudent(studentId: StudentId): Promise<Student>;
    getStudentStats(studentId: StudentId): Promise<{
        totalSubmissions: bigint;
        averageScore: bigint;
    }>;
    getSubmissionById(submissionId: SubmissionId): Promise<FeedbackSubmission>;
}
