package moravians.niskyhill.server.services;
 
import moravians.niskyhill.server.dtos.FormRequestDTO;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
 
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
 
import static org.junit.jupiter.api.Assertions.*;

class FormServiceTest {
    private FormService formService;
     @BeforeEach
    void setUp() {
        formService = new FormService();
    }

    /**
     * Test 1: Internment Card generates a non-empty PDF
     */
    @Test
    void generateOverlay_intermentCard_returnsPdfBytes() throws IOException {
        
        Map<String, String> fields = new HashMap<>();
        fields.put("firstName", "John");
        fields.put("lastName", "Smith");
        fields.put("burialDate", "04/17/2026");
 
        FormRequestDTO request = new FormRequestDTO("intermentCard", fields);
 
        
        byte[] result = formService.generateOverlay(request);
 
        
        assertNotNull(result, "Result should not be null");
        assertTrue(result.length > 0, "Result should not be empty");
 
        
        String header = new String(result, 0, 4);
        assertEquals("%PDF", header, "Output should be a valid PDF (must start with %PDF)");
    }

    /**
     * Test 2: Internment Record generates a valid PDF
     */
    @Test
    void generateOverlay_intermentRecord_returnsPdfBytes() throws IOException {
        Map<String, String> fields = new HashMap<>();
        fields.put("firstName", "Jane");
        fields.put("lastName", "Doe");
        fields.put("causeOfDeath", "Natural causes");
 
        FormRequestDTO request = new FormRequestDTO("intermentRecord", fields);
 
        byte[] result = formService.generateOverlay(request);
 
        assertNotNull(result);
        assertTrue(result.length > 0);
        assertEquals("%PDF", new String(result, 0, 4));
    }

    /**
     * Test 3: Certificate of Ownership generates a valid PDF
     */
    @Test
    void generateOverlay_certificateOfOwnership_returnsPdfBytes() throws IOException {
        Map<String, String> fields = new HashMap<>();
        fields.put("ownerName", "Robert Johnson");
        fields.put("lotNo", "B-7");
        fields.put("section", "Section A");
 
        FormRequestDTO request = new FormRequestDTO("certificateOfOwnership", fields);
 
        byte[] result = formService.generateOverlay(request);
 
        assertNotNull(result);
        assertTrue(result.length > 0);
        assertEquals("%PDF", new String(result, 0, 4));
    }

    /**
     * Test 4: Field values appear in the generated PDF text
     */
    @Test
    void generateOverlay_fieldValuesAppearInPdfText() throws IOException {
        
        Map<String, String> fields = new HashMap<>();
        fields.put("firstName", "TestNameUniqueXYZ"); 
 
        FormRequestDTO request = new FormRequestDTO("intermentCard", fields);
 
        
        byte[] pdfBytes = formService.generateOverlay(request);
 
        
        try (PDDocument doc = PDDocument.load(pdfBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String extractedText = stripper.getText(doc);
 
            
            assertTrue(
                extractedText.contains("TestNameUniqueXYZ"),
                "The field value 'TestNameUniqueXYZ' should appear in the PDF text. " +
                "Extracted text was: " + extractedText
            );
        }
    }

    /**
     * Test 5: Unknown formId throws IllegalArgumentExcpetion
     */
    @Test
    void generateOverlay_unknownFormId_throwsIllegalArgumentException() {
        Map<String, String> fields = new HashMap<>();
        fields.put("firstName", "John");
 
        FormRequestDTO request = new FormRequestDTO("nonExistentForm", fields);
 
        IllegalArgumentException ex = assertThrows(
            IllegalArgumentException.class,
            () -> formService.generateOverlay(request),
            "Should throw IllegalArgumentException for an unknown formId"
        );
 
        
        assertTrue(
            ex.getMessage().contains("nonExistentForm"),
            "Exception message should mention the unknown formId. Got: " + ex.getMessage()
        );
    }

    /**
     * Test 6: Blank field values are skipped (no crash)
     */
    @Test
    void generateOverlay_blankFieldValues_areSkippedAndPdfStillGenerates() throws IOException {
        Map<String, String> fields = new HashMap<>();
        fields.put("firstName", "John");
        fields.put("lastName", "");       
        fields.put("burialDate", "   ");  
 
        FormRequestDTO request = new FormRequestDTO("intermentCard", fields);
 
        byte[] result = assertDoesNotThrow(
            () -> formService.generateOverlay(request),
            "Blank field values should be skipped, not cause an exception"
        );
 
        assertNotNull(result);
        assertTrue(result.length > 0);
    }

    /**
     * Test 7: Generated PDF has exactly one page
     */
    
    @Test
    void generateOverlay_resultHasExactlyOnePage() throws IOException {
        Map<String, String> fields = new HashMap<>();
        fields.put("firstName", "John");
        fields.put("lastName", "Smith");
 
        FormRequestDTO request = new FormRequestDTO("intermentCard", fields);
        byte[] pdfBytes = formService.generateOverlay(request);
 
        
        try (PDDocument doc = PDDocument.load(pdfBytes)) {
            assertEquals(
                1,
                doc.getNumberOfPages(),
                "Overlay PDF should have exactly 1 page — one page per physical form"
            );
        }
    }
}