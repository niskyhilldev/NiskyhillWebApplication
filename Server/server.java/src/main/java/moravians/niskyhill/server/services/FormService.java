package moravians.niskyhill.server.services;
 
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import moravians.niskyhill.server.dtos.FormRequestDTO;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
 
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

/**
 * Service layer for PDF overlay generation logic
 */
public class FormService {
    private static final float CM_TO_PT = 72f / 2.54f;
    private static final float FONT_SIZE = 10f;
    private static final String CONFIG_PATH = "/form_coordinate_config.json";

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Generates PDF overlay for form, populated with the provided field values
     */
    public byte[] generateOverlay(FormRequestDTO request) throws IOException {
        JsonNode config = loadConfig();
        JsonNode formConfig = findFormConfig(config, request.formId());

        float pageWidthCm  = (float) formConfig.get("pageWidthCm").asDouble();
        float pageHeightCm = (float) formConfig.get("pageHeightCm").asDouble();
        float pageWidthPt  = pageWidthCm  * CM_TO_PT;
        float pageHeightPt = pageHeightCm * CM_TO_PT;

        try (PDDocument document = new PDDocument()) {
            PDRectangle pageSize = new PDRectangle(pageWidthPt, pageHeightPt);
            PDPage page = new PDPage(pageSize);
            document.addPage(page);
            PDType1Font font = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                content.setFont(font, FONT_SIZE);
                content.setLeading(FONT_SIZE * 1.2f);
                drawFields(content, formConfig, request.fieldValues(), pageHeightPt);
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        }
    }

    /**
     * Reads form_coordinate_config.json
     * 
     * @return root JsonNode of the config file
     * @throws IOException if file can't be found or parsed
     */
    private JsonNode loadConfig() throws IOException {
        InputStream configStream = getClass().getResourceAsStream(CONFIG_PATH);
 
        if (configStream == null) {
            throw new IOException(
                "Could not find form_coordinate_config.json in resources. " +
                "Make sure the file is at Server/src/main/resources/form_coordinate_config.json"
            );
        }
 
        return objectMapper.readTree(configStream);
    }

    /**
     * Searches the config's forms array for the entry whose formId matches the requested formId
     * 
     * @param config Root node of parsed config JSON
     * @param formId requested ID
     */
    private JsonNode findFormConfig(JsonNode config, String formId) {
        JsonNode forms = config.get("forms");
 
        if (forms == null || !forms.isArray()) {
            throw new IllegalArgumentException(
                "form_coordinate_config.json is missing a 'forms' array at the root level."
            );
        }
 
        for (JsonNode form : forms) {
            if (formId.equals(form.get("formId").asText())) {
                return form;
            }
        }
 
        throw new IllegalArgumentException(
            "No form found in config with formId: '" + formId + "'. " +
            "Check that the formId matches one of the entries in form_coordinate_config.json."
        );
    }

    /**
     * Iterates through the fields array and for each field whose fieldId has a matching value
     * in the request, draws that value as text on the page
     * 
     * @param fieldValues map of fieldId from what the user provided
     * @param pageHeightPt height of the page in points
     */
    private void drawFields(
        PDPageContentStream content,
        JsonNode formConfig,
        Map<String, String> fieldValues,
        float pageHeightPt
    ) throws IOException {
 
        JsonNode fields = formConfig.get("fields");
        if (fields == null || !fields.isArray()) return;
 
        for (JsonNode field : fields) {
            String fieldId = field.get("fieldId").asText();
 
            String value = fieldValues.get(fieldId);
            if (value == null || value.isBlank()) continue;
 
            float xCm = (float) field.get("xCm").asDouble();
            float yCm = (float) field.get("yCm").asDouble();
 
            float xPt = xCm * CM_TO_PT;
            float yPt = pageHeightPt - (yCm * CM_TO_PT) - FONT_SIZE;
 
            content.beginText();
            content.newLineAtOffset(xPt, yPt);
            content.showText(value);
            content.endText();
        }
    }
}