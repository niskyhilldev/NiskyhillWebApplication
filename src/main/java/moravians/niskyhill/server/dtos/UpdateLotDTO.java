package moravians.niskyhill.server.dtos;

/**
 * DTO for requesting the update of a lot
 * 
 * @param lid the id of the lot
 * @param number the number/name of the lot
 * @param descriptor the partition of the lot (entire, western half...ect)
 * @param owner the name of the owner of the lot 
 * @param sid the id of the section in which the lot is located in 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public record UpdateLotDTO (
    Long lid,
    String number,
    String descriptor,
    String owner,
    Long sid 
) {  }
