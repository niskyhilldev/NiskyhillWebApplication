package moravians.niskyhill.server.mappers;

import moravians.niskyhill.server.dtos.OwnerDTO;
import moravians.niskyhill.server.models.Owner;
import java.util.List;

public class OwnerMapper {
    
    public static OwnerDTO mapOwner(Owner owner){
        return new OwnerDTO(
            owner.id(), 
            owner.firstName(), 
            owner.middleName(), 
            owner.lastName(), 
            owner.suffix(), 
            owner.organization(),
            LotMapper.mapLot(owner.lot())
        );
    }


    public static List<OwnerDTO> mapOwnerList(List<Owner> owners){
        return owners.stream().map(owner -> mapOwner(owner)).toList();
    }
}
