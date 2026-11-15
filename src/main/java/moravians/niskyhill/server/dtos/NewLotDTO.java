package moravians.niskyhill.server.dtos;

/**
 * DTO for requesting the creation of a new lot
 * 
 * @param number 
 * @param descriptor
 * @param owner the name of the owenr of the lot
 * @param sid the id of the section where the lot is located
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public record NewLotDTO (
    String number,
    String descriptor,
    String owner,
    Long sid // id of the section it belongs to 
){ }
