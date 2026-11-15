package moravians.niskyhill.server.dtos;

/**
 * DTO for representing a User in the System
 * 
 * @param uid the id of the user 
 * @param email
 * @param firstName
 * @param lastName 
 * @param role the title the user holds in the organization 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public record UserDTO (
    Long uid, // note, maybe remove this for security reasons, does the front end ever need to know the id of a user, it can always be determined by the backend via the session token 
    String email,
    String firstName,
    String lastName,
    String role
){ }
