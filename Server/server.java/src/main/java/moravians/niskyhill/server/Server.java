package moravians.niskyhill.server;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.staticfiles.Location;
import moravians.niskyhill.server.database.Database;
import moravians.niskyhill.server.dtos.NewLotDTO;
import moravians.niskyhill.server.dtos.NewResidentDTO;
import moravians.niskyhill.server.dtos.UpdateLotDTO;
import moravians.niskyhill.server.dtos.UpdateResidentDTO;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import moravians.niskyhill.server.services.LotService;
import moravians.niskyhill.server.services.ResidentService;
import moravians.niskyhill.server.services.SectionService;


/**
 * Server for Nisky Hill Website
 */
public class Server {
    
    public static void main(String[] args) {

        /* we only want to istanciante the database once, so we will create it here and pass it to the static service layers */
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

        
        /* HTTP ROUTES */

        // get all residents (and their lot + sections)
        app.get("/residents/all", ctx -> {
            ctx.json(ResidentService.getAllResidents(database));
        });
        
        // search for a resident by any combination of their first, middle, and last name 
        app.get("/residents/search", ctx -> {
            ctx.json(ResidentService.searchResidents(ctx.queryParam("name"), database)); // name is in the param (since it could have whitespace)
        });

        // get a resident by their id
        app.get("/residents/find/{rid}", ctx -> {
            ctx.json(ResidentService.getResident(ctx.pathParam("rid"), database)); 
        });

        // get all lots
        app.get("/lots/all", ctx -> {
            ctx.json(LotService.getAllLots(database)); 
        });

        // get a lot by its id
        app.get("/lots/find/{lid}", ctx -> {
            ctx.json(LotService.getLot(ctx.pathParam("lid"), database)); 
        });

        // get all sections 
        app.get("/sections/all", ctx -> {
            ctx.json(SectionService.getAllSections(database)); 
        });

        // get a section by its id 
        app.get("/sections/find/{sid}", ctx -> {
            ctx.json(SectionService.getSection(ctx.pathParam("sid"), database)); 
        });

        // search for a lot (given lot_number and section_name, either which could be null, but they both cant be null) and return a lot and all of the residents it contains 
        app.get("/lots/residents/search", ctx -> {
            ctx.json(LotService.getLotResidents(ctx.queryParam("lot"), ctx.queryParam("section"), database)); 
        });

        // update a resident
        app.put("/residents/update", ctx -> {
            UpdateResidentDTO updateResidentDTO = ctx.bodyAsClass(UpdateResidentDTO.class);
            if (ResidentService.updateResident(updateResidentDTO, database)){
                ctx.status(200).result("Resident updated Successfully");
            }
        }); 

        // add a new resident 
        app.post("/residents/add", ctx -> {
            NewResidentDTO newResidentDTO = ctx.bodyAsClass(NewResidentDTO.class);
            if (ResidentService.addResident(newResidentDTO, database)){
                ctx.status(200).result("New Resident Created Successfully");
            }
        });

        // delete a resident
        app.delete("/residents/delete/{rid}", ctx -> {
            if (ResidentService.deleteResident(ctx.pathParam("rid"),database)) {
                ctx.status(200).result("Resident Deleted Successfully");
            }
        });

        // add a new lot 
        app.post("/lots/add", ctx -> {
            NewLotDTO newLotDTO = ctx.bodyAsClass(NewLotDTO.class);
            if (LotService.addLot(newLotDTO, database)){
                ctx.status(200).result("New Lot Created Successfully");
            }
        });

        // update a lot 
        app.put("/lots/update", ctx -> {
            UpdateLotDTO updateLotDTO = ctx.bodyAsClass(UpdateLotDTO.class);
            if (LotService.updateLot(updateLotDTO, database)){
                ctx.status(200).result("Lot updated Successfully");
            }
        }); 

        // delete a lot
        app.delete("/lots/delete/{lid}", ctx -> {
            if (LotService.deleteLot(ctx.pathParam("lid"),database)) {
                ctx.status(200).result("Lot Deleted Successfully");
            }
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
