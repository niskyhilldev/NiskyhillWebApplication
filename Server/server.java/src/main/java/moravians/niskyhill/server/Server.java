package moravians.niskyhill.server;

// Import Javalin and Gson
import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;
import com.google.gson.*;

/**
 * Server for Nisky Hill Website
 */
public class Server {

    public static void main(String[] args) {

        /*
         * Create the Instance of the Javalin Server
         */
        Javalin app = Javalin.create(config -> {

            /* Terminal Logger to manage requests */
            config.requestLogger.http((ctx, ms) -> {
                System.out.printf("%s\t%s\t%s\n", ctx.method(), ctx.path(), ctx.status());
            });

            /* Place to hold the Static HTML and CSS Files */
            config.staticFiles.add(staticFiles -> {
                staticFiles.hostedPath = "/";
                staticFiles.directory = "/public"; 
                staticFiles.location = Location.CLASSPATH;
            });
        });

        /*
         * HTTP Routes 
         */
        final Gson gson = new Gson();











        // Get port from environment (Heroku) or default to 8080 (for local deployment)
        String port = System.getenv("PORT");
        int serverPort = (port != null) ? Integer.parseInt(port) : 8080;

        /* Start the Server */
        app.start(serverPort);
    }
}
