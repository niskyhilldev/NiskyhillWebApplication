package moravians.niskyhill.server.dtos;

public record UpdateResidentDTO (
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
    Long lid // lid of the lot it belongs to 
) { }
