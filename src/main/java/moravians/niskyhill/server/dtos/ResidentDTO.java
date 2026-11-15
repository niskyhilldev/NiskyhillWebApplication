package moravians.niskyhill.server.dtos;

/**
 * DTO for representing a Resident
 * 
 * @param rid the id of the resident 
 * @param firstName
 * @param middleName
 * @param lastName
 * @param birthDate
 * @param burialDate 
 * @param deathDate
 * @param marker if there is a headstone 
 * @param foundation if there is a foundation for a headstone
 * @param publicViewable if the residents information should be publicly availible 
 * @param lot a lot DTO respresenting the lot where the resident is burried 
 * 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public record ResidentDTO(
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
    LotDTO lot
) {   }
