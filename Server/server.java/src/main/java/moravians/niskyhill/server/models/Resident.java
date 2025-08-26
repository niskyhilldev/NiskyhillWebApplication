package moravians.niskyhill.server.models;

public record Resident(
    Long id, 
    String firstName,
    String middleName,
    String lastName,
    String suffix,
    String age,
    String deathDate,
    String capsule,
    Boolean foundation,
    Boolean publicViewable,
    Lot lot
    
) {   }
