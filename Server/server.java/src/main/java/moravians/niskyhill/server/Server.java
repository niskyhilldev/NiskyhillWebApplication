package moravians.niskyhill.server;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.staticfiles.Location;
import moravians.niskyhill.server.database.Database;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import moravians.niskyhill.server.mappers.LotMapper;
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

        /* Enable CORS */
        app.before(ctx -> {
            ctx.header("Access-Control-Allow-Origin", "*"); // TODO: replace * with allowed orgin address 
            ctx.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            ctx.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        });

        /*  Handle preflight requests */
        app.options("/*", ctx -> {
            ctx.header("Access-Control-Allow-Origin", "*"); // TODO: replace * with allowed orgin addres
            ctx.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            ctx.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
            ctx.status(204);
        });

        
        /* HTTP Routes */
        app.get("/residents/all", ctx -> {
            ctx.json(ResidentMapper.mapResidentDTOList(database.getAllResidents())); 
        });

        app.get("/residents/search", ctx -> {
            String name = ctx.queryParam("name");
            System.out.println(name);
            ctx.json(ResidentMapper.mapResidentSearchDTOList(database.searchResidents(name))); // name is in the param (since it could have whitespace)
        });

        app.get("/residents/find/{rid}", ctx -> {
            ctx.json(ResidentMapper.mapResidentDTO(database.getResident(ctx.pathParam("rid")))); 
        });

        app.get("/lots/all", ctx -> {
            ctx.json(LotMapper.mapLotDTOList(database.getAllLots())); 
        });

        app.get("/sections/all", ctx -> {
            ctx.json(SectionMapper.mapSectionDTOList(database.getAllSections())); 
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
