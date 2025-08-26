package moravians.niskyhill.server.models;

public record Owner(
    Long id,
    String firstName,
    String middleName,
    String lastName,
    String suffix,
    String organization,
    Lot lot
) {   }
