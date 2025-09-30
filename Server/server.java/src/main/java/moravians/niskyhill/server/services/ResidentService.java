package moravians.niskyhill.server.services;

import java.util.List;
import moravians.niskyhill.server.database.Database;
import moravians.niskyhill.server.dtos.ResidentDTO;
import moravians.niskyhill.server.dtos.ResidentSearchDTO;
import moravians.niskyhill.server.exceptions.HttpStatus;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import moravians.niskyhill.server.mappers.ResidentMapper;

public class ResidentService {
    
    public static List<ResidentDTO> getAllResidents(Database database) throws HttpStatusException{
        List<ResidentDTO> residentList =  ResidentMapper.mapResidentDTOList(database.getAllResidents());

        if (residentList.size() == 0){
            throw new HttpStatusException(HttpStatus.NOT_FOUND.value, "No Residents Found");
        }
        return residentList;
    }


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
}
