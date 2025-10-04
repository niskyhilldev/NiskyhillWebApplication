package moravians.niskyhill.server.dtos;

public record UpdateLotDTO (
    Long lid,
    String number,
    String descriptor,
    String owner,
    Long mapXCord,
    Long mapYCord,
    Long sid 
){ }
