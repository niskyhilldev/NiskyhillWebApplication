package moravians.niskyhill.server.mappers;

import java.util.List;
import moravians.niskyhill.server.dtos.LotDTO;
import moravians.niskyhill.server.dtos.ResidentDTO;
import moravians.niskyhill.server.models.Resident;

public class ResidentMapper {

    public static ResidentDTO mapResident(Resident resident) {
        return new ResidentDTO(
                resident.id(),
                resident.firstName(),
                resident.middleName(),
                resident.lastName(),
                resident.suffix(),
                resident.age(),
                resident.deathDate(),
                resident.capsule(),
                resident.foundation(),
                resident.publicViewable(),
                LotMapper.mapLot(resident.lot()));
    }

    public static List<ResidentDTO> mapResidentList(List<Resident> residents){
        return residents.stream().map(resident -> mapResident(resident)).toList();
    }
}
