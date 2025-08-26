package moravians.niskyhill.server.dtos;

public record OwnerDTO(
    Long id,
    String firstName,
    String middleName,
    String lastName,
    String suffix,
    String organization,
    LotDTO lot
) {   }
