package moravians.niskyhill.server.models;

/**
 * Model for the the Lot table in the database
 * 
 * @param lid the id of the lot
 * @param number the name / human idenifer for the lot
 * @param descriptor the partition of the lot (entire, western half..ect)
 * @param owner the name of the owner of the lot
 * @param mapXCord the x pixel cordinate to locate the lot on the digital map (not geographical cordinate)
 * @param mapYCord the y pixel cordinate to locate the lot on the digital map (not geographical cordinate)
 * @param section a section model that is the section containing the lot 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public record Lot(
    Long lid,
    String number,
    String descriptor,
    String owner,
    Long mapXCord,
    Long mapYCord,
    Section section 
) {   }
