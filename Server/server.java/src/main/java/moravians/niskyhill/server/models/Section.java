package moravians.niskyhill.server.models;

/**
 * Model for the the section table in the database
 * 
 * @param sid the id of the section 
 * @param name the name of the section (ex: #1, A, A-3...ect)
 * @param map a base64 encoded string respresenting a pdf mapping of the section (note: not currently in use for 2025)
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public record Section(
    Long sid,
    String name,
    String map
) {  }
