package moravians.niskyhill.server.dtos;

import java.util.Map;

/**
 * DTO for a form generation request.
 *
 * @param formId identifies which form template to use. Must match a key in
 * form_coordinate_config.json (e.g. "intermentCard").
 * @param fieldValues A map of fieldId (value for every field the user filled in).
 * Keys must match the fieldId strings in the coordinate config. Any field not included here will be left blank on the PDF.
 *
 * @author Brianna Burchett, Lehigh University '27
 */
public record FormRequestDTO(
    String formId,
    Map<String, String> fieldValues
) {}