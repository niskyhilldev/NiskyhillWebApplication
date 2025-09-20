package moravians.niskyhill.server.models;

public record Lot(
    Long lid,
    String number,
    String descriptor,
    String owner,
    Section section 
) {   }
