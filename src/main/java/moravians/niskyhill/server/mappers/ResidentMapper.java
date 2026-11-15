package moravians.niskyhill.server.mappers;

import java.util.List;
import moravians.niskyhill.server.dtos.ResidentDTO;
import moravians.niskyhill.server.dtos.ResidentSearchDTO;
import moravians.niskyhill.server.models.Resident;

/**
 * Mapper helper class to handle coverting resident models to resident type DTO's
 * 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public class ResidentMapper {

    /**
     * Maps a single Resident object to a single ResidentDTO object
     * 
     * @param resident
     * @return a residentDTO object, null if given resident was null
     */
    public static ResidentDTO mapResidentDTO(Resident resident) {
        if (resident == null){
            return null;
        }
        return new ResidentDTO(
                resident.rid(),
                resident.firstName(),
                resident.middleName(),
                resident.lastName(),
                resident.birthDate(),
                resident.burialDate(),
                resident.deathDate(),
                resident.capsule(),
                resident.marker(),
                resident.foundation(),
                resident.publicViewable(),
                LotMapper.mapLotDTO(resident.lot()));
    }

    /**
     * Maps a list of Residents to a list of ResidentDTO
     * 
     * @param residents
     * @return list of ResidentDTO, null if the given list was null
     */
    public static List<ResidentDTO> mapResidentDTOList(List<Resident> residents){
        if (residents == null){
            return null;
        }
        return residents.stream().map(resident -> mapResidentDTO(resident)).toList();
    }

    /**
     * Maps a resident to a residentSearchDTO
     * 
     * @param resident
     * @return a residentSearchDTO object, null if given resident was null
     */
    public static ResidentSearchDTO mapResidentSearchDTO(Resident resident){
        if (resident == null){
            return null;
        }
        return new ResidentSearchDTO(
            resident.rid(),
            resident.firstName(),
            resident.middleName(),
            resident.lastName(),
            resident.burialDate(),
            resident.lot().number(),
            resident.lot().section().name()
        );
    }

    /**
     * Maps a List of resident to a List of residentSearchDTO
     * 
     * @param residents
     * @returnList of residentSearchDTO objects, Null if given list of residents was null
     */
    public static List<ResidentSearchDTO> mapResidentSearchDTOList(List<Resident> residents){
        if(residents == null){
            return null;
        }
        return residents.stream().map(resident -> mapResidentSearchDTO(resident)).toList();
    }
}
