package moravians.niskyhill.server.auth;

import io.javalin.http.Context;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;


public class AuthHandler {

    // Secret key for signing JWTs
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256); 

    // Token expiration time (1 hour)
    private static final long EXPIRATION_MS = 1000 * 60 * 60;
    


    /**
     * Creates a Token for a user of the system 
     * @param email the email of the user 
     * @return the JWT token now associated with the user
     */
    public static String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key)
                .compact();
    }

    /**
     * Validates a JWT token 
     * @param token the JWT token to be validated
     * @retrun email of ther uer the token belongs to if valid, null otherwise.
     */
    public static String validateToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Middleware to require authentication for a route.
     * Sets 401 if token is missing/invalid and stores userEmail in context if valid.
     * @param ctx the context of the server request
     */
    public static void requireAuth(Context ctx) {
        String authHeader = ctx.header("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) { // Check if the client has a token 
            ctx.redirect("/admin/login.html"); // direct the user to the login page
            return;
        }

        String token = authHeader.substring(7); // extract the client token from request
        String userEmail = validateToken(token); // get the email of the user assoiacted with the token

        if (userEmail == null) { // if there was no user found, block access
            ctx.status(401).result("Unauthorized");
            return;
        }

        ctx.attribute("userEmail", userEmail); // Store authenticated user email for route handlers
    }

    /**
     * Helper to retrieve the authenticated user's email from the context
     * @param ctx the context of the server request
     * @return the authenticated user's email
     */
    public static String getAuthenticatedUser(Context ctx) {
        return ctx.attribute("userEmail");
    }
}
