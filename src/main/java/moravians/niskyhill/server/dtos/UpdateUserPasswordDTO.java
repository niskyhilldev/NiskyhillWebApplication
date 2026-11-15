package moravians.niskyhill.server.dtos;

/**
 * DTO for representing a password change
 * Note: the user is determined by the token, hence why a user id is not passed here 
 * and why we have a strickly typed object
 * 
 * @param password 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public record UpdateUserPasswordDTO(
    String password
) { }
