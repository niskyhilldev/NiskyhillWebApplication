package moravians.niskyhill.server.dtos;

/**
 * DTO for requesting to log in to the system
 * 
 * @param email email of the user
 * @param password plain text password (note this is encrypted by https and is decrypted by the frame work when deployed)
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public record LoginDTO (
    String email,
    String password
) {  }
