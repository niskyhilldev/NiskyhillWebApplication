package moravians.niskyhill.server.models;

public record Resident(
    Long rid, 
    String firstName,
    String middleName,
    String lastName,
    String birthDate,
    String burialDate,
    String deathDate,
    String capsule,
    Boolean marker,
    Boolean foundation,
    Boolean publicViewable,
    Lot lot
) {   }
