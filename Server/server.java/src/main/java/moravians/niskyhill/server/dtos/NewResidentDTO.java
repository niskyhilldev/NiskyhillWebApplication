package moravians.niskyhill.server.dtos;

public record NewResidentDTO (
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
    Long lid
) {    }
