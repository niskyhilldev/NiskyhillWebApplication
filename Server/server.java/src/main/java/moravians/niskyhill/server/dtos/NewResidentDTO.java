package moravians.niskyhill.server.dtos;

/**
 * DTO for requesting the creation of a new resident in the system
 * 
 * @param firstName 
 * @param middleName
 * @param lastName
 * @param birthDate
 * @param burialDate
 * @param deathDate
 * @param capsule the vessel in which the resident is burried (urn, casket)
 * @param marker if there is a headstone 
 * @param foundation if there is a foundation for a headstone 
 * publicViewable if the residents information should be publically viewable thoughout the application 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
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
