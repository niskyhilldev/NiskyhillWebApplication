package moravians.niskyhill.server.dtos;

public record UserDTO (
    Long uid,
    String email,
    String firstName,
    String lastName,
    String role
){ }
