package moravians.niskyhill.server.models;

public record User (
    Long uid,
    String email,
    String hashedPassword,
    String salt,
    String firstName,
    String lastName,
    String role
){ }
