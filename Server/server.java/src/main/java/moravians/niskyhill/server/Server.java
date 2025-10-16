package moravians.niskyhill.server;

import java.util.Map;

import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.staticfiles.Location;
import moravians.niskyhill.server.auth.AuthHandler;
import moravians.niskyhill.server.auth.UserStore;
import moravians.niskyhill.server.database.Database;
import moravians.niskyhill.server.dtos.LoginDTO;
import moravians.niskyhill.server.dtos.NewLotDTO;
import moravians.niskyhill.server.dtos.NewResidentDTO;
import moravians.niskyhill.server.dtos.UpdateLotDTO;
import moravians.niskyhill.server.dtos.UpdateResidentDTO;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import moravians.niskyhill.server.services.LotService;
import moravians.niskyhill.server.services.ResidentService;
import moravians.niskyhill.server.services.SectionService;
import io.javalin.http.Cookie;


/**
 * Server for Nisky Hill Website
 */
public class Server {
    
    public static void main(String[] args) {

        /* Instantiate the database */
        Database database = Database.getDatabase(); 

        /* Configure the Javalin Server */
        Javalin app = Javalin.create(config -> {

            /* Terminal logger to view requests */
            config.requestLogger.http((ctx, ms) -> {
                System.out.printf("%-10s\t%-50s\t%s\n", ctx.method(), ctx.path(), ctx.status());
            });

            /* Static file configuration */
            config.staticFiles.add(staticFiles -> {
                staticFiles.hostedPath = "/";
                staticFiles.directory = "/public"; 
                staticFiles.location = Location.CLASSPATH;
            });
        });

        /* Enable CORS for all requests */
        app.before(ctx -> {
            ctx.header("Access-Control-Allow-Origin", "*"); // TODO: replace * with allowed origin address 
            ctx.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            ctx.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        });

        /* Handle preflight requests */
        app.options("/*", ctx -> {
            ctx.header("Access-Control-Allow-Origin", "*"); // TODO: replace * with allowed origin address
            ctx.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            ctx.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
            ctx.status(204);
        });

        /* Require authentication for all admin resources */
        app.before("/admin/*", ctx -> {
            AuthHandler.requirePageAuth(ctx);
        });

        /* HTTP ROUTES */

        // Login to the system (generates session token and sets it in the cookie)
        app.post("/auth/login", ctx -> {
            LoginDTO loginDTO = ctx.bodyAsClass(LoginDTO.class);

            if (UserStore.isValidUser(loginDTO.email(), loginDTO.password())) { // see if the user exists in the system
                String token = AuthHandler.generateToken(loginDTO.email()); // generate a token for that user

                Cookie cookie = new Cookie("token", token); // store the cookies with the token in the users browser 
                cookie.setMaxAge(3600);  // set token for one hour
                cookie.setHttpOnly(true);  // block access to cookie from JS files

                ctx.cookie(cookie);
                ctx.json(Map.of("message", "Login successful"));
            } else {
                ctx.status(401).result("Invalid Credentials");
            }
        });

        // Get all residents (and their lot + sections)
        app.get("/residents/all", ctx -> {
            ctx.json(ResidentService.getAllResidents(database));
        });
        
        // Search for a resident by any combination of their first, middle, and last name 
        app.get("/residents/search", ctx -> {
            ctx.json(ResidentService.searchResidents(ctx.queryParam("name"), database));
        });

        // Get a resident by their id
        app.get("/residents/find/{rid}", ctx -> {
            ctx.json(ResidentService.getResident(ctx.pathParam("rid"), database)); 
        });

        // Update a resident
        app.put("/residents/update", ctx -> {
            AuthHandler.requireRouteAuth(ctx);
            UpdateResidentDTO updateResidentDTO = ctx.bodyAsClass(UpdateResidentDTO.class);
            if (ResidentService.updateResident(updateResidentDTO, database)){
                ctx.status(200).result("Resident updated Successfully");
            }
        });

        // Add a new resident 
        app.post("/residents/add", ctx -> {
            AuthHandler.requireRouteAuth(ctx);
            NewResidentDTO newResidentDTO = ctx.bodyAsClass(NewResidentDTO.class);
            if (ResidentService.addResident(newResidentDTO, database)){
                ctx.status(200).result("New Resident Created Successfully");
            }
        });

        // Delete a resident
        app.delete("/residents/delete/{rid}", ctx -> {
            AuthHandler.requireRouteAuth(ctx);
            if (ResidentService.deleteResident(ctx.pathParam("rid"),database)) {
                ctx.status(200).result("Resident Deleted Successfully");
            }
        });

        // Get all lots
        app.get("/lots/all", ctx -> {
            ctx.json(LotService.getAllLots(database)); 
        });

        // Get a lot by its id
        app.get("/lots/find/{lid}", ctx -> {
            ctx.json(LotService.getLot(ctx.pathParam("lid"), database)); 
        });

        // Search for a lot (given lot_number and section_name) and return the lot with all its residents 
        app.get("/lots/residents/search", ctx -> {
            ctx.json(LotService.getLotResidents(ctx.queryParam("lot"), ctx.queryParam("section"), database)); 
        });

        // Add a new lot 
        app.post("/lots/add", ctx -> {
            AuthHandler.requireRouteAuth(ctx);
            NewLotDTO newLotDTO = ctx.bodyAsClass(NewLotDTO.class);
            if (LotService.addLot(newLotDTO, database)){
                ctx.status(200).result("New Lot Created Successfully");
            }
        });

        // Update a lot 
        app.put("/lots/update", ctx -> {
            AuthHandler.requireRouteAuth(ctx);
            UpdateLotDTO updateLotDTO = ctx.bodyAsClass(UpdateLotDTO.class);
            if (LotService.updateLot(updateLotDTO, database)){
                ctx.status(200).result("Lot updated Successfully");
            }
        });

        // Delete a lot
        app.delete("/lots/delete/{lid}", ctx -> {
            AuthHandler.requireRouteAuth(ctx);
            if (LotService.deleteLot(ctx.pathParam("lid"),database)) {
                ctx.status(200).result("Lot Deleted Successfully");
            }
        });

        // Get all sections 
        app.get("/sections/all", ctx -> {
            ctx.json(SectionService.getAllSections(database)); 
        });

        // Get a section by its id 
        app.get("/sections/find/{sid}", ctx -> {
            ctx.json(SectionService.getSection(ctx.pathParam("sid"), database)); 
        });


        
        /* Exception Handlers */

        // Map HttpStatusException to HTTP errors
        app.exception(HttpStatusException.class, (HttpStatusException e, Context ctx) -> {
            ctx.status(e.getHttpStatus()).json(e.getMessage());
        });

        // Get port from environment (Heroku) or default to 8080 (for local deployment)
        String port = System.getenv("PORT");
        int serverPort = (port != null) ? Integer.parseInt(port) : 8080;

        /* Start the Server */
        app.start(serverPort);
    }
}