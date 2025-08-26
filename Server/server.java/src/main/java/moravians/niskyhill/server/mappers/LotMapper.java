package moravians.niskyhill.server.mappers;

import moravians.niskyhill.server.dtos.LotDTO;
import moravians.niskyhill.server.models.Lot;
import java.util.List;

public class LotMapper {
    
    public static LotDTO mapLot(Lot lot){
        return new LotDTO(
            lot.number(), 
            lot.descriptor(), 
            lot.sectionName()
        );
    }

    public static List<LotDTO> mapLotList(List<Lot> lots){
        return lots.stream().map(lot -> mapLot(lot)).toList();
    }
    
}
