package moravians.niskyhill.server.services;

import java.util.List;
import moravians.niskyhill.server.database.Database;
import moravians.niskyhill.server.dtos.SectionDTO;
import moravians.niskyhill.server.exceptions.HttpStatus;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import moravians.niskyhill.server.mappers.SectionMapper;


/**
 * Service Layer for all things Section related
 * 
 * @author Tedd Stabolepszy, Lehigh Univeristy '26
 */
public class SectionService {

    /**
     * Get all sections in the system 
     * 
     * @param database a database with an established connection
     * @return List of type SectionDTO 
     * @throws HttpStatusException no sections exist
     */
    public static List<SectionDTO> getAllSections(Database database) throws HttpStatusException{
        List<SectionDTO> sectionList =  SectionMapper.mapSectionDTOList(database.getAllSections());

        if (sectionList.size() == 0){
            throw new HttpStatusException(HttpStatus.NOT_FOUND.value, "No Sections Found");
        }
        return sectionList;
    }

    /**
     * get a single section in the system by its ID
     * 
     * @param sid the id of a section 
     * @param database a database with an established connection
     * @return a sectionDTO
     * @throws HttpStatusException invalid sid, section does not exist
     */
    public static SectionDTO getSection(String sid, Database database) throws HttpStatusException {
        if (sid == null) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "sid cannot be null");
        }

        try{
            SectionDTO sectionDTO = SectionMapper.mapSectionDTO(database.getSection(Long.parseLong(sid)));

            if (sectionDTO == null){
                throw new HttpStatusException(HttpStatus.NOT_FOUND.value, "Could not find Section with id " + sid);
            }

            return sectionDTO;
        } catch (NumberFormatException e) {
            System.err.printf("Sid must be a numeric value: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "sid must be numeric", e);
        }
    }
    
}
