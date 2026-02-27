import Map "mo:core/Map";
import Text "mo:core/Text";
import Migration "migration";
import Runtime "mo:core/Runtime";

(with migration = Migration.run)
actor {
  type Registrant = {
    fullName : Text;
    phoneNumber : Text;
    address : Text;
    wantsFruits : Bool;
    wantsVegetables : Bool;
    wantsRice : Bool;
  };

  let registrants = Map.empty<Text, Registrant>();

  public shared ({ caller }) func registerRegistrant(
    fullName : Text,
    phoneNumber : Text,
    address : Text,
    wantsFruits : Bool,
    wantsVegetables : Bool,
    wantsRice : Bool,
  ) : async () {
    if (registrants.containsKey(phoneNumber)) {
      Runtime.trap("Phone number already registered.");
    };

    let registrant : Registrant = {
      fullName;
      phoneNumber;
      address;
      wantsFruits;
      wantsVegetables;
      wantsRice;
    };

    registrants.add(phoneNumber, registrant);
  };

  public query ({ caller }) func isRegistered(phoneNumber : Text) : async Bool {
    registrants.containsKey(phoneNumber);
  };

  public query ({ caller }) func getTotalRegistrants() : async Nat {
    registrants.size();
  };

  public query ({ caller }) func getAllRegistrants() : async [Registrant] {
    registrants.values().toArray();
  };

  public query ({ caller }) func getRegistrant(phoneNumber : Text) : async Registrant {
    switch (registrants.get(phoneNumber)) {
      case (?registrant) { registrant };
      case (null) { Runtime.trap("Registrant not found") };
    };
  };
};
