package moravians.niskyhill.server.dtos;

/**
 * DTO for representing an abriviation of a Resident 
 * NOTE: used for searching to limit the amount of data transfered from the 
 * backend to the frontend application(s)
 * 
 * @param rid the id of the resident 
 * @param firstName
 * @param middleName
 * @param lastName 
 * @param burialDate
 * @param lotNumber the name of the lot where the resident is burried 
 * @param sectionName the name of the section where the lot the resident is burried in is located 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public record ResidentSearchDTO(
    Long rid,
    String firstName,
    String middleName,
    String lastName,
    String burialDate,
    String lotNumber,
    String sectionName
) {   } 
    

