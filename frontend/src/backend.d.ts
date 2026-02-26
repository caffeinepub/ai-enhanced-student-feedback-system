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
export type Pin = string;
export interface Instructor {
    pin: Pin;
    name: string;
    email: string;
    instructorId: InstructorId;
    department: string;
}
export type Time = bigint;
export interface FeedbackSubmission {
    studentId: string;
    timestamp: Time;
    submissionText: string;
    submissionId: SubmissionId;
    assignmentTitle: AssignmentTitle;
}
export interface GeneratedFeedback {
    suggestions: Array<Suggestion>;
    feedbackText: string;
    score: bigint;
    timestamp: Time;
    submissionId: SubmissionId;
}
export type AssignmentTitle = string;
export interface Suggestion {
    text: string;
}
export interface SystemStats {
    topStudent?: {
        studentId: StudentId;
        averageScore: bigint;
    };
    totalStudents: bigint;
    totalSubmissions: bigint;
    overallAverageScore: bigint;
}
export type InstructorId = bigint;
export type StudentId = string;
export type SubmissionId = bigint;
export interface backendInterface {
    addStudent(studentId: StudentId, name: string, course: string): Promise<void>;
    addSubmissionNote(submissionId: SubmissionId, note: string): Promise<void>;
    createSubmission(studentId: StudentId, assignmentTitle: AssignmentTitle, submissionText: string): Promise<SubmissionId>;
    generateFeedback(submissionId: SubmissionId): Promise<GeneratedFeedback>;
    getAllFeedbackForStudent(studentId: StudentId): Promise<Array<GeneratedFeedback>>;
    getAllInstructors(): Promise<Array<Instructor>>;
    getAllStudents(): Promise<Array<Student>>;
    getAllSubmissionsByStudent(studentId: StudentId): Promise<Array<FeedbackSubmission>>;
    getFeedback(submissionId: SubmissionId): Promise<GeneratedFeedback>;
    getInstructor(instructorId: InstructorId): Promise<Instructor>;
    getStudent(studentId: StudentId): Promise<Student>;
    getStudentStats(studentId: StudentId): Promise<{
        totalSubmissions: bigint;
        averageScore: bigint;
    }>;
    getSubmissionById(submissionId: SubmissionId): Promise<FeedbackSubmission>;
    getSubmissionNote(submissionId: SubmissionId): Promise<string>;
    getSystemStats(): Promise<SystemStats>;
    registerInstructor(name: string, email: string, department: string, pin: Pin): Promise<InstructorId>;
    updateInstructor(instructorId: InstructorId, name: string, email: string, department: string, pin: Pin): Promise<void>;
    verifyInstructor(instructorId: InstructorId, pin: Pin): Promise<boolean>;
}
