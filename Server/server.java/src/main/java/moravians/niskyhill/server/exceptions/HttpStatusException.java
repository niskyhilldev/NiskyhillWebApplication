package moravians.niskyhill.server.exceptions;

public class HttpStatusException extends Exception {
    private final int httpStatus;

    public HttpStatusException(int httpStatus, String message) {
        super(message);
        this.httpStatus = httpStatus;
    }

    public HttpStatusException(int httpStatus, String message, Throwable cause) {
        super(message, cause);
        this.httpStatus = httpStatus;
    }

    public int getHttpStatus() {
        return httpStatus;
    }
}