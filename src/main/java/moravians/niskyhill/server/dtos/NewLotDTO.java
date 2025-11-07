package moravians.niskyhill.server.dtos;

public record NewLotDTO (
    String number,
    String descriptor,
    String owner,
    Long sid // id of the section it belongs to 
){ }
