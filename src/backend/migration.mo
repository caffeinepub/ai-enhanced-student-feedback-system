import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  // All legacy types from the old persistent actor must be explicitly included here.
  // Otherwise, the system will not allow the migration to delete them.
  type OldActor = {
    students : Map.Map<Text, { studentId : Text; name : Text; course : Text }>;
    submissionsById : Map.Map<Nat, {
      submissionId : Nat;
      studentId : Text;
      assignmentTitle : Text;
      submissionText : Text;
      timestamp : Time.Time;
    }>;
    submissionsByStudent : Map.Map<Text, Set.Set<Nat>>;
    feedbacks : Map.Map<Nat, {
      submissionId : Nat;
      feedbackText : Text;
      score : Nat;
      suggestions : [{
        text : Text;
      }];
      timestamp : Time.Time;
    }>;
    submissionNotes : Map.Map<Nat, Text>;
    instructors : Map.Map<Nat, {
      instructorId : Nat;
      name : Text;
      email : Text;
      department : Text;
      pin : Text;
    }>;
    nextSubmissionId : Nat;
    nextInstructorId : Nat;
  };

  type NewActor = {
    registrants : Map.Map<Text, {
      fullName : Text;
      phoneNumber : Text;
      address : Text;
      wantsFruits : Bool;
      wantsVegetables : Bool;
      wantsRice : Bool;
    }>;
  };

  public func run(_old : OldActor) : NewActor {
    { registrants = Map.empty<Text, { fullName : Text; phoneNumber : Text; address : Text; wantsFruits : Bool; wantsVegetables : Bool; wantsRice : Bool }>() };
  };
};
