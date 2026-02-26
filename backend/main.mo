import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";

import Migration "migration";

// Use migration for persistent state changes
(with migration = Migration.run)
actor {
  // Existing Types
  type StudentId = Text;
  type SubmissionId = Nat;
  type AssignmentTitle = Text;

  type Student = {
    studentId : StudentId;
    name : Text;
    course : Text;
  };

  type FeedbackSubmission = {
    submissionId : SubmissionId;
    studentId : Text;
    assignmentTitle : AssignmentTitle;
    submissionText : Text;
    timestamp : Time.Time;
  };

  type Suggestion = {
    text : Text;
  };

  type GeneratedFeedback = {
    submissionId : SubmissionId;
    feedbackText : Text;
    score : Nat;
    suggestions : [Suggestion];
    timestamp : Time.Time;
  };

  // New Types for Instructor Support
  type InstructorId = Nat;
  type Pin = Text;

  type Instructor = {
    instructorId : InstructorId;
    name : Text;
    email : Text;
    department : Text;
    pin : Pin;
  };

  type SystemStats = {
    totalStudents : Nat;
    totalSubmissions : Nat;
    overallAverageScore : Int;
    topStudent : ?{
      studentId : StudentId;
      averageScore : Int;
    };
  };

  // Persistence
  let students = Map.empty<StudentId, Student>();
  let nextSubmissionId = Set.empty<Nat>();

  let submissionsById = Map.empty<SubmissionId, FeedbackSubmission>();
  let submissionsByStudent = Map.empty<StudentId, Set.Set<SubmissionId>>();

  let feedbacks = Map.empty<SubmissionId, GeneratedFeedback>();

  let instructors = Map.empty<InstructorId, Instructor>();
  var nextInstructorId : InstructorId = 1;

  let submissionNotes = Map.empty<SubmissionId, Text>();

  module Student {
    public func compare(s1 : Student, s2 : Student) : Order.Order {
      Text.compare(s1.studentId, s2.studentId);
    };
  };

  // Student Management
  public shared ({ caller }) func addStudent(studentId : StudentId, name : Text, course : Text) : async () {
    if (students.containsKey(studentId)) {
      Runtime.trap("Student with ID " # studentId # " already exists.");
    };
    let student : Student = { studentId; name; course };
    students.add(studentId, student);
  };

  public query ({ caller }) func getStudent(studentId : StudentId) : async Student {
    switch (students.get(studentId)) {
      case (null) { Runtime.trap("Student does not exist") };
      case (?student) { student };
    };
  };

  public query ({ caller }) func getAllStudents() : async [Student] {
    students.values().toArray();
  };

  // Submission Management
  public shared ({ caller }) func createSubmission(
    studentId : StudentId,
    assignmentTitle : AssignmentTitle,
    submissionText : Text,
  ) : async SubmissionId {
    if (not students.containsKey(studentId)) {
      Runtime.trap("Student does not exist");
    };

    let submissionId = submissionsById.size() + 1;

    let submission : FeedbackSubmission = {
      submissionId;
      studentId;
      assignmentTitle;
      submissionText;
      timestamp = Time.now();
    };

    submissionsById.add(submissionId, submission);

    switch (submissionsByStudent.get(studentId)) {
      case (null) {
        let newSet = Set.singleton<Nat>(submissionId);
        submissionsByStudent.add(studentId, newSet);
      };
      case (?currentSet) {
        currentSet.add(submissionId);
      };
    };

    submissionId;
  };

  public query ({ caller }) func getSubmissionById(submissionId : SubmissionId) : async FeedbackSubmission {
    switch (submissionsById.get(submissionId)) {
      case (null) { Runtime.trap("Submission not found") };
      case (?submission) { submission };
    };
  };

  public query ({ caller }) func getAllSubmissionsByStudent(studentId : StudentId) : async [FeedbackSubmission] {
    switch (submissionsByStudent.get(studentId)) {
      case (null) { [] };
      case (?submissionIds) {
        let iter = submissionIds.values();
        let submissionList = List.empty<FeedbackSubmission>();

        iter.forEach(
          func(submissionId) {
            switch (submissionsById.get(submissionId)) {
              case (null) {};
              case (?submission) { submissionList.add(submission) };
            };
          }
        );
        submissionList.reverse().toArray();
      };
    };
  };

  // Feedback Generation (AI-like)
  func generateScore(submissionText : Text) : Nat {
    let wordCount = submissionText.split(#char ' ').foldLeft(0, func(acc, _) { acc + 1 });

    if (wordCount < 100) { 50 } else if (wordCount < 200) { 70 } else if (wordCount < 500) { 85 } else {
      95;
    };
  };

  func generateFeedbackText(score : Nat) : Text {
    if (score >= 85) {
      "Excellent work! Your submission is comprehensive, well-structured, and demonstrates a strong understanding of the material.";
    } else if (score >= 70) {
      "Good job! Your work shows solid effort, but there's room for improvement in depth and clarity.";
    } else if (score >= 50) {
      "The submission needs more detail and structure. Focus on expanding your points and organizing your thoughts more clearly.";
    } else {
      "Significant improvement is needed in content, organization, and presentation.";
    };
  };

  func generateSuggestions(score : Nat) : [Suggestion] {
    let suggestionsList = List.empty<Text>();

    if (score < 85) {
      suggestionsList.add("Review course materials to strengthen your authorative content.");
      if (score < 70) {
        suggestionsList.add("Provide references and supporting evidence for your assertions.");
        suggestionsList.add("Expand on main ideas and elaborate more on key points.");
      };
      if (score < 60) {
        suggestionsList.add("Reorganize your work to follow a clear introduction, body, and conclusion format.");
      };
    };

    suggestionsList.toArray().map(func(s) { { text = s } });
  };

  // Generate Feedback for a Submission
  public shared ({ caller }) func generateFeedback(submissionId : SubmissionId) : async GeneratedFeedback {
    switch (submissionsById.get(submissionId)) {
      case (null) { Runtime.trap("Submission not found") };
      case (?submission) {
        let score = generateScore(submission.submissionText);
        let feedbackText = generateFeedbackText(score);
        let suggestions = generateSuggestions(score);

        let feedback : GeneratedFeedback = {
          submissionId;
          feedbackText;
          score;
          suggestions;
          timestamp = Time.now();
        };

        feedbacks.add(submissionId, feedback);

        feedback;
      };
    };
  };

  public query ({ caller }) func getFeedback(submissionId : SubmissionId) : async GeneratedFeedback {
    switch (feedbacks.get(submissionId)) {
      case (null) { Runtime.trap("Feedback not found") };
      case (?feedback) { feedback };
    };
  };

  public query ({ caller }) func getAllFeedbackForStudent(studentId : StudentId) : async [GeneratedFeedback] {
    switch (submissionsByStudent.get(studentId)) {
      case (null) { [] };
      case (?submissionIds) {
        let iter = submissionIds.values();
        let feedbackList = List.empty<GeneratedFeedback>();

        iter.forEach(
          func(submissionId) {
            switch (feedbacks.get(submissionId)) {
              case (null) {};
              case (?feedback) { feedbackList.add(feedback) };
            };
          }
        );
        feedbackList.reverse().toArray();
      };
    };
  };

  // Instructor Aggregated Stats
  public query ({ caller }) func getStudentStats(studentId : StudentId) : async {
    totalSubmissions : Nat;
    averageScore : Int;
  } {
    var totalSubmissions = 0;
    var totalScore = 0;
    var count = 0;

    switch (submissionsByStudent.get(studentId)) {
      case (null) {
        { totalSubmissions = 0; averageScore = 0 };
      };
      case (?submissionIds) {
        totalSubmissions := submissionIds.size();
        let iter = submissionIds.values();
        iter.forEach(
          func(submissionId) {
            switch (feedbacks.get(submissionId)) {
              case (null) {};
              case (?feedback) {
                totalScore += feedback.score;
                count += 1;
              };
            };
          }
        );

        let averageScore = if (count > 0) {
          totalScore / count;
        } else { 0 };

        { totalSubmissions; averageScore };
      };
    };
  };

  // === Instructor Management ===

  public shared ({ caller }) func registerInstructor(name : Text, email : Text, department : Text, pin : Pin) : async InstructorId {
    let instructorId = nextInstructorId;
    nextInstructorId += 1;

    let instructor : Instructor = {
      instructorId;
      name;
      email;
      department;
      pin;
    };

    instructors.add(instructorId, instructor);
    instructorId;
  };

  public query ({ caller }) func verifyInstructor(instructorId : InstructorId, pin : Pin) : async Bool {
    switch (instructors.get(instructorId)) {
      case (null) { false };
      case (?instructor) { instructor.pin == pin };
    };
  };

  public query ({ caller }) func getInstructor(instructorId : InstructorId) : async Instructor {
    switch (instructors.get(instructorId)) {
      case (null) { Runtime.trap("Instructor not found") };
      case (?instructor) { instructor };
    };
  };

  public shared ({ caller }) func updateInstructor(
    instructorId : InstructorId,
    name : Text,
    email : Text,
    department : Text,
    pin : Pin,
  ) : async () {
    switch (instructors.get(instructorId)) {
      case (null) { Runtime.trap("Instructor not found") };
      case (?_) {
        let updatedInstructor : Instructor = {
          instructorId;
          name;
          email;
          department;
          pin;
        };
        instructors.add(instructorId, updatedInstructor);
      };
    };
  };

  public query ({ caller }) func getAllInstructors() : async [Instructor] {
    instructors.values().toArray();
  };

  // Submission Notes
  public shared ({ caller }) func addSubmissionNote(submissionId : SubmissionId, note : Text) : async () {
    if (not submissionsById.containsKey(submissionId)) {
      Runtime.trap("Submission does not exist");
    };
    submissionNotes.add(submissionId, note);
  };

  public query ({ caller }) func getSubmissionNote(submissionId : SubmissionId) : async Text {
    switch (submissionNotes.get(submissionId)) {
      case (null) { Runtime.trap("No note found for this submission") };
      case (?note) { note };
    };
  };

  // System Stats
  public query ({ caller }) func getSystemStats() : async SystemStats {
    let totalStudents = students.size();
    let totalSubmissions = submissionsById.size();

    var totalScore = 0;
    var count = 0;

    let studentScores = Map.empty<StudentId, Int>();

    let feedbacksIter = feedbacks.values();
    feedbacksIter.forEach(
      func(feedback) {
        totalScore += feedback.score;
        count += 1;

        switch (studentScores.get(feedback.submissionId.toText())) {
          case (null) {
            studentScores.add(feedback.submissionId.toText(), feedback.score);
          };
          case (?curr) {
            studentScores.add(feedback.submissionId.toText(), curr + feedback.score);
          };
        };
      }
    );

    let overallAverageScore = if (count > 0) {
      totalScore / count;
    } else { 0 };

    var topStudent : ?{
      studentId : StudentId;
      averageScore : Int;
    } = null;

    let studentEntriesIter = studentScores.entries();
    studentEntriesIter.forEach(
      func((studentId, score)) {
        switch (topStudent) {
          case (null) {
            topStudent := ?{ studentId; averageScore = score };
          };
          case (?currentTop) {
            if (score > currentTop.averageScore) {
              topStudent := ?{ studentId; averageScore = score };
            };
          };
        };
      }
    );

    {
      totalStudents;
      totalSubmissions;
      overallAverageScore;
      topStudent;
    };
  };
};
