package moravians.niskyhill.server.auth;

import io.javalin.http.Context;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import moravians.niskyhill.server.exceptions.HttpStatus;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import java.security.Key;
import java.util.Date;

/**
 * Handles authentication and authorization for the Nisky Hill server
 */
public class AuthHandler {
    
    // Secret key for signing JWTs
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    // Token expiration time (1 hour)
    private static final long EXPIRATION_MS = 1000 * 60 * 60;

    /**
     * Creates a JWT token for a user
     * @param email the email of the user
     * @return the JWT token associated with the user
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
     * @return email of the user the token belongs to if valid, null otherwise
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
     * Requires authentication for API routes
     * Sets 401 if token is missing/invalid, stores userEmail in context if valid
     * @param ctx the context of the server request
     */
    public static void requireRouteAuth(Context ctx) throws HttpStatusException{
        String token = null;
        
        // First try Authorization header
        String authHeader = ctx.header("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else {
            // Fallback to cookie
            token = ctx.cookie("token");
        }

        String userEmail = validateToken(token);
        if (userEmail == null) {
            throw new HttpStatusException(HttpStatus.UNAUTHORIZED.value, "Unauthorized"); // throw exception and block route access 
        }
        
        ctx.attribute("userEmail", userEmail);
    }

    /**
     * Requires authentication for static page access
     * Redirects to login page if token is missing/invalid
     * @param ctx the context of the server request
     */
    public static void requirePageAuth(Context ctx) {
        String token = ctx.cookie("token");
        String userEmail = validateToken(token);
        
        if (userEmail == null) {
            ctx.redirect("/login/login.html");
            ctx.skipRemainingHandlers();
            return;
        }
        
        ctx.attribute("userEmail", userEmail);
    }

    /**
     * Retrieves the authenticated user's email from the context
     * @param ctx the context of the server request
     * @return the authenticated user's email
     */
    public static String getAuthenticatedUser(Context ctx) {
        return ctx.attribute("userEmail");
    }
}