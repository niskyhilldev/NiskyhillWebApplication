package moravians.niskyhill.server;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.staticfiles.Location;
import moravians.niskyhill.server.database.Database;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import moravians.niskyhill.server.mappers.LotMapper;
import moravians.niskyhill.server.mappers.OwnerMapper;
import moravians.niskyhill.server.mappers.ResidentMapper;
import moravians.niskyhill.server.mappers.SectionMapper;




/**
 * Server for Nisky Hill Website
 */
public class Server {
    
    public static void main(String[] args) {

        Database database = Database.getDatabase(); 

        /*
         * Configure the Instance of the Javalin Server
         */
        Javalin app = Javalin.create(config -> {

            /* Create A Terminal Logger to View requests */
            config.requestLogger.http((ctx, ms) -> {
                System.out.printf("%-10s\t%-50s\t%s\n", ctx.method(), ctx.path(), ctx.status());
            });

            /* Create a Place to hold the Static HTML and CSS Files */
            config.staticFiles.add(staticFiles -> {
                staticFiles.hostedPath = "/";
                staticFiles.directory = "/public"; 
                staticFiles.location = Location.CLASSPATH;
            });


        });

 
        app.get("/residents/all", ctx -> {
            ctx.json(ResidentMapper.mapResidentList(database.getAllResidents())); 
        });

        app.get("/lots/all", ctx -> {
            ctx.json(LotMapper.mapLotList(database.getAllLots())); 
        });

        app.get("/owners/all", ctx -> {
            ctx.json(OwnerMapper.mapOwnerList(database.getAllOwners())); 
        });

        app.get("/sections/all", ctx -> {
            ctx.json(SectionMapper.mapSectionList(database.getAllSections())); 
        });






        /**
         * Map the HttpStatusException Class to HTTP Errors
         */
        app.exception(HttpStatusException.class, (HttpStatusException e, Context ctx) -> {
            ctx.status(e.getHttpStatus()).json(e.getMessage()); // (status, reason)
        });


        /**
         * Get port from environment (Heroku) or default to 8080 (for local deployment)
         */
        String port = System.getenv("PORT");
        int serverPort = (port != null) ? Integer.parseInt(port) : 8080;


        /* Start the Server */
        app.start(serverPort);
    }
}
