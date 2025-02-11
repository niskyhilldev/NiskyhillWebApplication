package moravians.niskyhill.server;

// create an HTTP GET route
import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;
import com.google.gson.*;

/**
 * Server For Nisky Hill Website 
 */
public class Server {

    /* Port for the Server to use */
    public static final int PORT_WEBSERVER = 8080;




    public static void main(String[] args) {


        /*
        * Create the Instance of the Javelin Server
        */
            Javalin app = Javalin.create(config -> {
                config.requestLogger.http((ctx, ms) -> {
                    System.out.printf("%s\t%s\t%s\n", ctx.method(), ctx.path(), ctx.status());
                });
                config.staticFiles.add(staticFiles -> {
                    staticFiles.hostedPath = "/";
                    staticFiles.directory = "/public"; // Place to hold HTML files for website
                    staticFiles.location = Location.CLASSPATH;
                });
            });





        /*
         * HTTP Routes 
        */
        final Gson gson = new Gson(); 




        /* Start the Server */
        app.start(PORT_WEBSERVER);
    }
}
