package moravians.niskyhill.server.dtos;

public record ResidentSearchDTO(
    Long rid,
    String firstName,
    String middleName,
    String lastName,
    String burialDate,
    String lotNumber,
    String sectionName
) {   } 
    

