package moravians.niskyhill.server.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import moravians.niskyhill.server.dtos.FormRequestDTO;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.apache.pdfbox.pdmodel.interactive.form.PDField;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

/**
 * Service layer for AcroForm-based PDF generation logic
 */
public class FormService {
    private static final String CONFIG_PATH = "/form_coordinate_config.json";

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Generates a filled PDF for the requested form, populated with the provided field values
     */
    public byte[] generateOverlay(FormRequestDTO request) throws IOException {
        JsonNode config = loadConfig();
        JsonNode formConfig = findFormConfig(config, request.formId());

        String templateFile = formConfig.get("templateFile").asText();
        InputStream templateStream = getClass().getResourceAsStream("/" + templateFile);

        if (templateStream == null) {
            throw new IOException(
                "Could not find template file '" + templateFile + "' in resources. " +
                "Make sure it is placed at Server/src/main/resources/" + templateFile
            );
        }

        try (PDDocument document = Loader.loadPDF(new RandomAccessReadBuffer(templateStream))) {
            PDAcroForm acroForm = document.getDocumentCatalog().getAcroForm();

            if (acroForm == null) {
                throw new IOException(
                    "Template '" + templateFile + "' has no AcroForm fields to fill."
                );
            }

            fillFields(acroForm, formConfig, request.fieldValues());

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        }
    }

    /**
     * Reads form_coordinate_config.json
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
     * Iterates through the fields array and, for each field whose fieldId has a matching
     * value in the request, sets that value on the corresponding AcroForm field
     */
    private void fillFields(
        PDAcroForm acroForm,
        JsonNode formConfig,
        Map<String, String> fieldValues
    ) throws IOException {

        JsonNode fields = formConfig.get("fields");
        if (fields == null || !fields.isArray()) return;

        for (JsonNode fieldConfig : fields) {
            String fieldId = fieldConfig.get("fieldId").asText();

            String value = fieldValues.get(fieldId);
            if (value == null || value.isBlank()) continue;

            JsonNode pdfFieldNameNode = fieldConfig.get("pdfFieldName");
            if (pdfFieldNameNode == null) continue;

            String pdfFieldName = pdfFieldNameNode.asText();
            PDField field = acroForm.getField(pdfFieldName);

            if (field == null) {
                throw new IOException(
                    "PDF field '" + pdfFieldName + "' (mapped from fieldId '" + fieldId +
                    "') was not found in the template's AcroForm."
                );
            }

            field.setValue(value);
        }
    }
}