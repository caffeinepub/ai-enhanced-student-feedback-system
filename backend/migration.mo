import Map "mo:core/Map";
import Set "mo:core/Set";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  // Old Types (from original actor)
  type OldStudentId = Text;
  type OldSubmissionId = Nat;
  type OldAssignmentTitle = Text;

  type OldStudent = {
    studentId : OldStudentId;
    name : Text;
    course : Text;
  };

  type OldFeedbackSubmission = {
    submissionId : OldSubmissionId;
    studentId : Text;
    assignmentTitle : OldAssignmentTitle;
    submissionText : Text;
    timestamp : Time.Time;
  };

  type OldSuggestion = {
    text : Text;
  };

  type OldGeneratedFeedback = {
    submissionId : OldSubmissionId;
    feedbackText : Text;
    score : Nat;
    suggestions : [OldSuggestion];
    timestamp : Time.Time;
  };

  // Old Actor Type
  type OldActor = {
    students : Map.Map<OldStudentId, OldStudent>;
    nextSubmissionId : Set.Set<OldSubmissionId>;
    submissionsById : Map.Map<OldSubmissionId, OldFeedbackSubmission>;
    submissionsByStudent : Map.Map<OldStudentId, Set.Set<OldSubmissionId>>;
    feedbacks : Map.Map<OldSubmissionId, OldGeneratedFeedback>;
  };

  // New Types (from updated actor)
  type NewStudentId = Text;
  type NewSubmissionId = Nat;
  type NewAssignmentTitle = Text;

  type NewStudent = {
    studentId : NewStudentId;
    name : Text;
    course : Text;
  };

  type NewFeedbackSubmission = {
    submissionId : NewSubmissionId;
    studentId : Text;
    assignmentTitle : NewAssignmentTitle;
    submissionText : Text;
    timestamp : Time.Time;
  };

  type NewSuggestion = {
    text : Text;
  };

  type NewGeneratedFeedback = {
    submissionId : NewSubmissionId;
    feedbackText : Text;
    score : Nat;
    suggestions : [NewSuggestion];
    timestamp : Time.Time;
  };

  type InstructorId = Nat;
  type Pin = Text;

  type Instructor = {
    instructorId : InstructorId;
    name : Text;
    email : Text;
    department : Text;
    pin : Pin;
  };

  type NewActor = {
    students : Map.Map<NewStudentId, NewStudent>;
    nextSubmissionId : Set.Set<NewSubmissionId>;
    submissionsById : Map.Map<NewSubmissionId, NewFeedbackSubmission>;
    submissionsByStudent : Map.Map<NewStudentId, Set.Set<NewSubmissionId>>;
    feedbacks : Map.Map<NewSubmissionId, NewGeneratedFeedback>;
    instructors : Map.Map<InstructorId, Instructor>;
    nextInstructorId : InstructorId;
    submissionNotes : Map.Map<NewSubmissionId, Text>;
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    {
      students = old.students;
      nextSubmissionId = old.nextSubmissionId;
      submissionsById = old.submissionsById;
      submissionsByStudent = old.submissionsByStudent;
      feedbacks = old.feedbacks;
      instructors = Map.empty<InstructorId, Instructor>();
      nextInstructorId = 1;
      submissionNotes = Map.empty<NewSubmissionId, Text>();
    };
  };
};
