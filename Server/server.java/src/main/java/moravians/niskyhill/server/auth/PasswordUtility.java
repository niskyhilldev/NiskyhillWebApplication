package moravians.niskyhill.server.auth;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import moravians.niskyhill.server.exceptions.HttpStatus;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import java.nio.charset.StandardCharsets;

public class PasswordUtility {
   
    private static final SecureRandom random = new SecureRandom();

    
    public static String hashPassword(String password, String salt) throws HttpStatusException{
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            String saltedPassword = password + salt;
            byte[] hashedBytes = md.digest(saltedPassword.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Error Hashing User Password");
        }
    }

    // Generate a random salt (default 16 bytes)
    public static String generateSalt() {
        byte[] saltBytes = new byte[16];
        random.nextBytes(saltBytes);
        return Base64.getEncoder().encodeToString(saltBytes);
    }
}