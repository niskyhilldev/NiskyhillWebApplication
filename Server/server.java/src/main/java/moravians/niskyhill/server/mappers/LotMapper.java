package moravians.niskyhill.server.mappers;

import moravians.niskyhill.server.dtos.LotDTO;
import moravians.niskyhill.server.models.Lot;

import java.util.List;

public class LotMapper {
    
    public static LotDTO mapLotDTO(Lot lot){
        return new LotDTO(
            lot.lid(),
            lot.number(), 
            lot.descriptor(), 
            lot.owner(),
            lot.mapXCord(),
            lot.mapYCord(),
            SectionMapper.mapSectionDTO(lot.section())
        );
    }

    public static List<LotDTO> mapLotDTOList(List<Lot> lots){
        return lots.stream().map(lot -> mapLotDTO(lot)).toList();
    }
    
}

