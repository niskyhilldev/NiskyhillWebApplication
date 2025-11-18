package moravians.niskyhill.server.services;

import java.util.List;
import moravians.niskyhill.server.database.Database;
import moravians.niskyhill.server.dtos.NewResidentDTO;
import moravians.niskyhill.server.dtos.ResidentDTO;
import moravians.niskyhill.server.dtos.ResidentSearchDTO;
import moravians.niskyhill.server.dtos.UpdateResidentDTO;
import moravians.niskyhill.server.exceptions.HttpStatus;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import moravians.niskyhill.server.mappers.ResidentMapper;

/**
 * Service Layer for all things Resident related
 * 
 * @author Tedd Stabolepszy, Lehigh Univeristy '26
 */
public class ResidentService {
    
    /**
     * Get all Residents 
     * 
     * @param database a database with an established connection
     * @return a list of type Resident DTO
     * @throws HttpStatusException no residents exist
     */
    public static List<ResidentDTO> getAllResidents(Database database) throws HttpStatusException{
        List<ResidentDTO> residentList =  ResidentMapper.mapResidentDTOList(database.getAllResidents());

        if (residentList.size() == 0){
            throw new HttpStatusException(HttpStatus.NOT_FOUND.value, "No Residents Found");
        }
        return residentList;
    }

    /**
     * Search for residents with any combination of first, middle, and last name 
     * 
     * @param name any combination of first, middle, and last name 
     * @param database a database with an established connection
     * @return a list of type ResidentSearchDTO
     * @throws HttpStatusException missing parameters, no residents found
     */
    public static List<ResidentSearchDTO> searchResidents(String name, Database database) throws HttpStatusException{
        if (name == null){
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "Name Cannot Be Null");
        }
        
        List<ResidentSearchDTO> residentList = ResidentMapper.mapResidentSearchDTOList(database.searchResidents(name));
        if (residentList.size() == 0){
            throw new HttpStatusException(HttpStatus.NOT_FOUND.value, "No Residents Found");
        }
        return residentList;
    }

    /**
     * Get a resident by ID
     * 
     * @param rid the id of the resident 
     * @param database  any combination of first, middle, and last name 
     * @return a residentDTO object
     * @throws HttpStatusException missing params, invalid id, resident does not exist 
     */
    public static ResidentDTO getResident(String rid, Database database) throws HttpStatusException{
        if (rid == null){
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "rid cannot be null");
        }

        try {
            ResidentDTO residentDTO =  ResidentMapper.mapResidentDTO(database.getResident(Long.parseLong(rid)));

            if (residentDTO == null){
                throw new HttpStatusException(HttpStatus.NOT_FOUND.value, "Could not find Resident with id " + rid);
            }

            return residentDTO;
        } catch (NumberFormatException e) {
            System.err.printf("Rid must be a numeric value: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "rid must be numeric", e);
        } 
    }

    /**
     * update a residents information 
     * 
     * @param updateResidentDTO new information 
     * @param database any combination of first, middle, and last name 
     * @return true on success 
     * @throws HttpStatusException missing/invalid params, invalid id for lot or resident
     */
    public static boolean updateResident(UpdateResidentDTO updateResidentDTO, Database database) throws HttpStatusException{
        if (updateResidentDTO == null){
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "Request Must Contain all resident information");
        }

        if(updateResidentDTO.rid() == null || updateResidentDTO.firstName() == null || updateResidentDTO.firstName().isBlank() || updateResidentDTO.lastName() == null || updateResidentDTO.lastName().isBlank() ||updateResidentDTO.lid() == null){
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "Resident Update Request Missing Required Criteria");
        }

        if (database.getResident(updateResidentDTO.rid())== null){
            throw new HttpStatusException(HttpStatus.NOT_FOUND.value, "Resident Not Found with id " + updateResidentDTO.rid());
        }

        if (database.getLot(updateResidentDTO.lid()) == null){
            throw new HttpStatusException(HttpStatus.NOT_FOUND.value, "Lot not found with id " + updateResidentDTO.lid()); 
        }

        boolean result = database.updateResident(
            updateResidentDTO.rid(), 
            updateResidentDTO.firstName(),
            updateResidentDTO.middleName(),
            updateResidentDTO.lastName(),
            updateResidentDTO.birthDate(),
            updateResidentDTO.burialDate(),
            updateResidentDTO.deathDate(),
            updateResidentDTO.capsule(),
            updateResidentDTO.marker(),
            updateResidentDTO.foundation(),
            updateResidentDTO.publicViewable(),
            updateResidentDTO.lid()
        );

        if (result == false){
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "Bad Criteria for Update Resident");
        }

        return true;
    }

    /**
     * Add a new resident to the system 
     * 
     * @param newResidentDTO new resident information 
     * @param database  any combination of first, middle, and last name 
     * @return true on success (exception otherwise)
     * @throws HttpStatusException missing params, invalid lot 
     */
    public static boolean addResident(NewResidentDTO newResidentDTO, Database database) throws HttpStatusException{
        if (newResidentDTO == null){
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "Request Must Contain all resident information");
        }

        if(newResidentDTO.firstName() == null || newResidentDTO.firstName().isBlank() || newResidentDTO.lastName() == null || newResidentDTO.lastName().isBlank() ||newResidentDTO.lid() == null){
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "New Resident Request Missing Required Criteria");
        }

        if (database.getLot(newResidentDTO.lid()) == null){
            throw new HttpStatusException(HttpStatus.NOT_FOUND.value, "Lot not found with id " + newResidentDTO.lid()); 
        }

        boolean result =  database.addNewResident(
            newResidentDTO.firstName(),
            newResidentDTO.middleName(),
            newResidentDTO.lastName(),
            newResidentDTO.birthDate(),
            newResidentDTO.burialDate(),
            newResidentDTO.deathDate(),
            newResidentDTO.capsule(),
            newResidentDTO.marker(),
            newResidentDTO.foundation(),
            newResidentDTO.publicViewable(),
            newResidentDTO.lid()
        );

        if (result == false){
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "Bad Criteria for New Resident");
        }

        return true;
    }

    /**
     * remove a resident from the system 
     * 
     * @param rid the id of the resident 
     * @param database
     * @return true on success (exception otherwise)
     * @throws HttpStatusException missing params, resident does not exist, invalid rid
     */
    public static boolean deleteResident(String rid, Database database) throws HttpStatusException{
        if (rid == null || rid.isBlank()){
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "rid cannot be null");
        }
        
        try {

            if (database.getResident(Long.parseLong(rid)) == null){
                throw new HttpStatusException(HttpStatus.NOT_FOUND.value, "Resident not Found with rid " + rid);
            }  
             
            if (!(database.deleteResident(Long.parseLong(rid)))) {
                throw new HttpStatusException(HttpStatus.INTERNAL_SERVER_ERROR.value, "Failed to Delete Resident with rid " + rid);
            }
            return true;

        } catch (NumberFormatException e){
            System.err.printf("Rid must be a numeric value: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "rid must be numeric", e);
        }
    }
}
