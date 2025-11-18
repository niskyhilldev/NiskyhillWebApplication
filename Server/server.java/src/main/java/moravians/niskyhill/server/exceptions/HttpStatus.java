package moravians.niskyhill.server.exceptions;

/**
 * enum for all the possile types of status codes for HTTP requests
 */
public enum HttpStatus {
    OK(200),
    CREATED(201),
    BAD_REQUEST(400),
    UNAUTHORIZED(401),
    FORBIDDEN(403),
    NOT_FOUND(404),
    INTERNAL_SERVER_ERROR(500);

    public final int value;

    HttpStatus(int value) {
        this.value = value;
    }
}