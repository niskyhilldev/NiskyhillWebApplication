package moravians.niskyhill.server;

import java.util.List;
import java.util.Map;
import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.staticfiles.Location;
import moravians.niskyhill.server.auth.AuthHandler;
import moravians.niskyhill.server.database.Database;
import moravians.niskyhill.server.dtos.LoginDTO;
import moravians.niskyhill.server.dtos.NewLotDTO;
import moravians.niskyhill.server.dtos.NewResidentDTO;
import moravians.niskyhill.server.dtos.UpdateLotDTO;
import moravians.niskyhill.server.dtos.UpdateResidentDTO;
import moravians.niskyhill.server.dtos.UpdateUserPasswordDTO;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import moravians.niskyhill.server.services.LotService;
import moravians.niskyhill.server.services.ResidentService;
import moravians.niskyhill.server.services.SectionService;
import moravians.niskyhill.server.services.UserService;
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

        // Allowed Origins for CORS
        List<String> allowedOrigins = List.of(
            "https://niskyhillcemetery-23a1ead2d9b1.herokuapp.com",
            "https://www.niskyhill.org",
            "https://www.niskyhill.com",
            "http://localhost:8080" // for local dev
        );

        /* Enable CORS */
        app.before(ctx -> {
            String origin = ctx.header("Origin");

            ctx.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            ctx.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
            ctx.header("Access-Control-Allow-Credentials", "true"); 

            if (origin != null && allowedOrigins.contains(origin)) {
                ctx.header("Access-Control-Allow-Origin", origin); 
            }
        });

        /* Enable Pre-Flight Requests */
        app.options("/*", ctx -> {
            String origin = ctx.header("Origin");

            ctx.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            ctx.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
            ctx.header("Access-Control-Allow-Credentials", "true"); 

            if (origin != null && allowedOrigins.contains(origin)) {
                ctx.header("Access-Control-Allow-Origin", origin);
            }

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
            Long userId = UserService.findUser(loginDTO.email(), loginDTO.password(), database);

            if (userId != null) { // see if the user exists in the system
                String token = AuthHandler.generateToken(userId); // generate a token for that user

                Cookie cookie = new Cookie("token", token); // store the cookies with the token in the users browser 
                cookie.setMaxAge(3600);  // set Cookie for one Hour
                cookie.setHttpOnly(true);  // block access to cookie from JS files
                cookie.setSecure(true);

                ctx.cookie(cookie);
                ctx.json(Map.of("message", "Login successful"));
            } else {
                ctx.status(401).json(Map.of("message", "Login Failed"));
            }
        });

        // Route to Logout of the system (Delete Cookie with session key fro the users brower)
        app.post("/auth/logout", ctx -> {
            // Create a cookie with the same name and set MaxAge to 0 to delete it
            Cookie cookie = new Cookie("token", "");
            cookie.setMaxAge(0);    // Deletes the cookie
            cookie.setHttpOnly(true);
            cookie.setSecure(true);

            ctx.cookie(cookie);
            ctx.json(Map.of("message", "Logged out successfully"));
        });

        // Route to get the current user of the system
        app.get("auth/user", ctx -> {
            AuthHandler.requireRouteAuth(ctx); // Check Authorization
            Long currentUserId = AuthHandler.getAuthenticatedUserId(ctx);
            ctx.json(UserService.getUser(currentUserId, database));
        });

        // Route to get the time remaining on a user's token
        app.get("/auth/user/status", ctx -> {
            Long remainingMs = AuthHandler.requireValidTokenAndGetRemaining(ctx);
    
            // Only return JSON if the token is valid
            if (remainingMs != null) {
                ctx.json(Map.of(
                    "timeRemaining", remainingMs
                ));
            }
        });

        // Route to update a user password (and remove session token)
        app.put("auth/password/update", ctx -> {
            AuthHandler.requireRouteAuth(ctx); // Check Authorization
            Long currentUserId = AuthHandler.getAuthenticatedUserId(ctx);
            UpdateUserPasswordDTO updateUserPasswordDTO = ctx.bodyAsClass(UpdateUserPasswordDTO.class);
            if (UserService.setPassword(currentUserId, updateUserPasswordDTO.password(), database)){
                Cookie cookie = new Cookie("token", "");
                cookie.setMaxAge(0);    // Deletes the cookie
                cookie.setHttpOnly(true);
                ctx.cookie(cookie);
                ctx.json(Map.of("message", "Password Updated Successfully"));
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

        // Update a resident (Requires Authorization)
        app.put("/residents/update", ctx -> {
            AuthHandler.requireRouteAuth(ctx); // // Check Authorization
            UpdateResidentDTO updateResidentDTO = ctx.bodyAsClass(UpdateResidentDTO.class);
            if (ResidentService.updateResident(updateResidentDTO, database)){
                ctx.status(200).result("Resident updated Successfully");
            }
        });

        // Add a new resident (Requires Authorization)
        app.post("/residents/add", ctx -> {
            AuthHandler.requireRouteAuth(ctx); // Check Authorization
            NewResidentDTO newResidentDTO = ctx.bodyAsClass(NewResidentDTO.class);
            if (ResidentService.addResident(newResidentDTO, database)){
                ctx.status(200).result("New Resident Created Successfully");
            }
        });

        // Delete a resident (Requires Authorization)
        app.delete("/residents/delete/{rid}", ctx -> {
            AuthHandler.requireRouteAuth(ctx); // Check Authorization
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

        // Search for a lot (given lot_number and section_name) and return the lot with all its residents )
        app.get("/lots/residents/search", ctx -> {
            ctx.json(LotService.getLotResidents(ctx.queryParam("lot"), ctx.queryParam("section"), database)); 
        });

        // Add a new lot  (Requires Authorization)
        app.post("/lots/add", ctx -> {
            AuthHandler.requireRouteAuth(ctx); // Check Authorization
            NewLotDTO newLotDTO = ctx.bodyAsClass(NewLotDTO.class);
            if (LotService.addLot(newLotDTO, database)){
                ctx.status(200).result("New Lot Created Successfully");
            }
        });

        // Update a lot (Requires Authorization)
        app.put("/lots/update", ctx -> {
            AuthHandler.requireRouteAuth(ctx); // Check Authorization
            UpdateLotDTO updateLotDTO = ctx.bodyAsClass(UpdateLotDTO.class);
            if (LotService.updateLot(updateLotDTO, database)){
                ctx.status(200).result("Lot updated Successfully");
            }
        });

        // Delete a lot (Requires Authorization)
        app.delete("/lots/delete/{lid}", ctx -> {
            AuthHandler.requireRouteAuth(ctx); // Check Authorization
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