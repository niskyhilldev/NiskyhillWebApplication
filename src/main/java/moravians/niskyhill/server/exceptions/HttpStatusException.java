package moravians.niskyhill.server.exceptions;

/**
 * Exception class for an HTTP Error response
 * 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public class HttpStatusException extends Exception {
    private final int httpStatus;

    /**
     * Constructor to create an HttpStatusException
     * 
     * @param httpStatus the integer status code 
     * @param message what cuased the error 
     */
    public HttpStatusException(int httpStatus, String message) {
        super(message);
        this.httpStatus = httpStatus;
    }

    /**
     * Constructor to create an HttpStatusException
     * 
     * @param httpStatus he integer status code 
     * @param message what cuased the error 
     * @param cause another excpetion for chaining (stack)
    */
    public HttpStatusException(int httpStatus, String message, Throwable cause) {
        super(message, cause);
        this.httpStatus = httpStatus;
    }

    /**
     * get the status code assoicted with an exception 
     * 
     * @return the integer status code
     */
    public int getHttpStatus() {
        return httpStatus;
    }
}