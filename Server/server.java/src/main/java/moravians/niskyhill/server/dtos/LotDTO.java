package moravians.niskyhill.server.dtos;

/**
 * DTO for representing a Lot
 * 
 * @param lid the id of the lot
 * @param number 
 * @param descriptor the partition of the lot
 * @param mapXCord the x pixel cordinate to corispond to the digital map
 * @param mapYCord the y pixel cordinate to corispond to the digital map
 * @param section the section where the lot is located 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public record LotDTO(
    Long lid,
    String number,
    String descriptor,
    String owner,
    Long mapXCord,
    Long mapYCord,
    SectionDTO section 
) {   }
