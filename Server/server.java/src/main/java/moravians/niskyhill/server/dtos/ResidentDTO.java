package moravians.niskyhill.server.dtos;

public record ResidentDTO(
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
    LotDTO lot
) {   }
