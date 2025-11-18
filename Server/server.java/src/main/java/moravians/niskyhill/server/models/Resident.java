package moravians.niskyhill.server.models;

/**
 * Model for the the resident table in the database
 * 
 * @param rid the id of the resident 
 * @param firstName
 * @param middleName
 * @param lastName 
 * @param birthDate
 * @param burialDate
 * @param deathDate
 * @param capsule the container the resident is burried in (urn or casket)
 * @param marker if there is a headstone at the lot 
 * @param foundation if there is a foundation for a headstone at the lot 
 * @param publicViewable if the residents information can be made publicaly availible 
 * @param lot a model of the lot where the resident is burried at 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
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
