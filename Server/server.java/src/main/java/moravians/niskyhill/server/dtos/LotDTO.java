package moravians.niskyhill.server.dtos;


public record LotDTO(
    Long lid,
    String number,
    String descriptor,
    String owner,
    SectionDTO section 
) {   }
