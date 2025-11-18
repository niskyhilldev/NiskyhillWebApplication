package moravians.niskyhill.server.auth;

import io.javalin.http.Context;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import moravians.niskyhill.server.exceptions.HttpStatus;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import java.security.Key;
import java.util.Date;

/**
 * Handles authentication and authorization for the Nisky Hill server.
 * Provides methods for token generation, validation, expiration checking,
 * and redirecting unauthorized users to the login page.
 * 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public class AuthHandler {

    /** Secret key used to sign JWT tokens */
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    /** Token expiration time (1 hour) */
    private static final long EXPIRATION_MS = 1000 * 60 * 60;


    /**
     * Generates a JWT token for a given user ID.
     *
     * @param userId the ID of the user
     * @return a signed JWT token string
     */
    public static String generateToken(Long userId) {
        return Jwts.builder()
                .setSubject(userId.toString())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(key)
                .compact();
    }

    /**
     * Validates a JWT token and extracts the user ID.
     *
     * @param token the JWT token
     * @return the user ID if valid, or null if invalid
     */
    public static Long validateToken(String token) {
        try {
            String userId = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            return Long.parseLong(userId);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Extracts the JWT token from the Authorization header or cookie.
     *
     * @param ctx the Javalin request context
     * @return the token string, or null if not found
     */
    private static String extractToken(Context ctx) {
        String authHeader = ctx.header("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return ctx.cookie("token");
    }

    /**
     * Redirects the user to the login page and skips remaining handlers.
     * Also removes the token cookie.
     *
     * @param ctx the Javalin request context
     */
    private static void redirectToLogin(Context ctx) {
        ctx.removeCookie("token");
        ctx.redirect("/login/login.html");
        ctx.skipRemainingHandlers();
    }

    /**
     * Parses the expiration timestamp from a JWT token.
     *
     * @param token the JWT token
     * @return expiration time in milliseconds since epoch, or -1 if invalid
     */
    private static long getExpiration(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            Date exp = claims.getExpiration();
            return exp != null ? exp.getTime() : -1;
        } catch (Exception e) {
            return -1;
        }
    }


    /**
     * Ensures an API route request has a valid token.
     * Throws 401 Unauthorized if token is missing or invalid.
     *
     * @param ctx the Javalin request context
     * @throws HttpStatusException if token is invalid
     */
    public static void requireRouteAuth(Context ctx) throws HttpStatusException {
        String token = extractToken(ctx);
        Long userId = validateToken(token);
        if (userId == null) {
            throw new HttpStatusException(HttpStatus.UNAUTHORIZED.value, "Unauthorized");
        }
    }

    /**
     * Ensures a static page request has a valid token.
     * Redirects to login page if token is missing or invalid.
     *
     * @param ctx the Javalin request context
     */
    public static void requirePageAuth(Context ctx) {
        String token = extractToken(ctx);
        Long userId = validateToken(token);
        if (userId == null) {
            redirectToLogin(ctx);
        }
    }

    /**
     * Retrieves the authenticated user's ID from the request context.
     *
     * @param ctx the Javalin request context
     * @return user ID if token is valid, otherwise null
     */
    public static Long getAuthenticatedUserId(Context ctx) {
        String token = extractToken(ctx);
        return validateToken(token);
    }


    /**
     * Validates the token, ensures it is not expired, and returns remaining time.
     * Redirects to login page if token is missing, invalid, or expired.
     *
     * @param ctx the Javalin request context
     * @return remaining time in milliseconds, or null if redirected
     */
    public static Long requireValidTokenAndGetRemaining(Context ctx) throws HttpStatusException{
        String token = extractToken(ctx);
        if (token == null || token.isEmpty()) {
            throw new HttpStatusException(HttpStatus.UNAUTHORIZED.value, "Unauthorized");
        }

        Long userId = validateToken(token);
        if (userId == null) {
            throw new HttpStatusException(HttpStatus.UNAUTHORIZED.value, "Unauthorized");
        }

        long expiration = getExpiration(token);
        long remaining = expiration - System.currentTimeMillis();
        if (remaining <= 0) {
            throw new HttpStatusException(HttpStatus.UNAUTHORIZED.value, "Unauthorized");
        }

        return remaining;
    }
}
