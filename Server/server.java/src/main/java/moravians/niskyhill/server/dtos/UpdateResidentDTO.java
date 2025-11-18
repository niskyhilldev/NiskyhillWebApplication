package moravians.niskyhill.server.dtos;

/**
 * DTO for requesting the update of a Resident in the system
 * 
 * @param rid the id of the resident
 * @param firstName
 * @param middleName
 * @param lastName 
 * @param birthDate
 * @param burialDate
 * @param deathDate
 * @param capsule if there is a headstone at the lot 
 * @param foundation id there is a foundation for a headstone
 * @param publicViewable if the residents information should be publicaly availible 
 * @param lid the id of the lot where the resident is burried
 * @author Tedd Stabolepszy, Lehigh University '26
 */
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
