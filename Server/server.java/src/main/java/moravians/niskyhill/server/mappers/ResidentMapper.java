package moravians.niskyhill.server.mappers;

import java.util.List;
import moravians.niskyhill.server.dtos.ResidentDTO;
import moravians.niskyhill.server.dtos.ResidentSearchDTO;
import moravians.niskyhill.server.models.Resident;

public class ResidentMapper {

    public static ResidentDTO mapResidentDTO(Resident resident) {
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

    public static List<ResidentDTO> mapResidentDTOList(List<Resident> residents){
        return residents.stream().map(resident -> mapResidentDTO(resident)).toList();
    }

    public static ResidentSearchDTO mapResidentSearchDTO(Resident resident){
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

    public static List<ResidentSearchDTO> mapResidentSearchDTOList(List<Resident> residents){
        return residents.stream().map(resident -> mapResidentSearchDTO(resident)).toList();
    }
}
