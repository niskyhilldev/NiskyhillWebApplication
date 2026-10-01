package moravians.niskyhill.server;
 
import io.javalin.Javalin;
import io.javalin.http.Context;
import moravians.niskyhill.server.auth.AuthHandler;
import moravians.niskyhill.server.dtos.FormRequestDTO;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import moravians.niskyhill.server.services.FormService;
import moravians.niskyhill.server.database.Database;

/**
 * Service layer for wiring form generation into Javalin HTTP server
 */
public class FormController {
    private static final FormService formService = new FormService();
    
    /**
     * Registers all form routes
     * 
     * @param app Javalin app instance
     */
    public static void register(Javalin app, Database database) {
        app.post("/forms/generate", ctx -> handleGenerateForm(ctx, database));
    }

    /**
     * POST /forms/generate
     * 
     * @param ctx Javalin context
     */
    private static void handleGenerateForm(Context ctx, Database database) throws HttpStatusException {
        AuthHandler.requireRouteAuth(ctx);
        FormRequestDTO request;
        try {
            request = ctx.bodyAsClass(FormRequestDTO.class);
        } catch (Exception e) {
            ctx.status(400).result("Invalid request body: " + e.getMessage());
            return;
        }

        if (request.formId() == null || request.formId().isBlank()) {
            ctx.status(400).result("'formId' is required and cannot be blank.");
            return;
        }
        if (request.fieldValues() == null || request.fieldValues().isEmpty()) {
            ctx.status(400).result("'fieldValues' is required and cannot be empty.");
            return;
        }

        byte[] pdfBytes;
        try {
            pdfBytes = formService.generateOverlay(request);
        } catch (IllegalArgumentException e) {
            // Thrown by FormService when the formId doesn't exist in the config.
            ctx.status(400).result("Unknown formId: " + e.getMessage());
            return;
        } catch (Exception e) {
            // Unexpected error during PDF generation (e.g. config file missing).
            ctx.status(500).result("Failed to generate PDF: " + e.getMessage());
            return;
        }

        ctx.contentType("application/pdf");
        ctx.header(
            "Content-Disposition",
            "attachment; filename=\"" + request.formId() + ".pdf\""
        );
        ctx.result(pdfBytes);
    }

    private static Long parseId(String s) {
        try { return s == null ? null : Long.parseLong(s); }
        catch (NumberFormatException e) { return null; }
    }

}