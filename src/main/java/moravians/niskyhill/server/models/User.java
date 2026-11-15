package moravians.niskyhill.server.models;

/**
 * Model for the the users table in the database
 * 
 * @param uid the id of the user in the system 
 * @param email
 * @param hashedPassword
 * @param salt
 * @param firstName
 * @param lastName
 * @param role the title that the user holds in the organization
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public record User (
    Long uid,
    String email,
    String hashedPassword,
    String salt,
    String firstName,
    String lastName,
    String role
){ }
