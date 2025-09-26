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

        // get all residents (and their lot + sections)
        app.get("/residents/all", ctx -> {
            ctx.json(ResidentMapper.mapResidentDTOList(database.getAllResidents())); 
        });
        
        // search for a resident by any combination of their first, middle, or last name 
        app.get("/residents/search", ctx -> {
            String name = ctx.queryParam("name");
            System.out.println(name);
            ctx.json(ResidentMapper.mapResidentSearchDTOList(database.searchResidents(name))); // name is in the param (since it could have whitespace)
        });

        // get a resident by their id
        app.get("/residents/find/{rid}", ctx -> {
            ctx.json(ResidentMapper.mapResidentDTO(database.getResident(ctx.pathParam("rid")))); 
        });

        // get all lots
        app.get("/lots/all", ctx -> {
            ctx.json(LotMapper.mapLotDTOList(database.getAllLots())); 
        });

        // get a lot by its id
        app.get("/lots/find/{lid}", ctx -> {
            ctx.json(LotMapper.mapLotDTO(database.getLot(ctx.pathParam("lid")))); 
        });

        // get all sections 
        app.get("/sections/all", ctx -> {
            ctx.json(SectionMapper.mapSectionDTOList(database.getAllSections())); 
        });

        // get a section by its id 
        app.get("/sections/find/{sid}", ctx -> {
            ctx.json(SectionMapper.mapSectionDTO(database.getSection(ctx.pathParam("sid")))); 
        });

        // search for a lot (given any combination of lot_number, lot_descriptor, and section_name) and return a lot and all of the residents it contains 

        // add a new resident 

        // update a resident 

        // add a new lot 

        // update a lot 


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
