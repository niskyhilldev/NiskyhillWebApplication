package moravians.niskyhill.server.mappers;

import moravians.niskyhill.server.dtos.LotDTO;
import moravians.niskyhill.server.models.Lot;
import java.util.List;


/**
 * Mapper helper class to handle coverting lot models to lot DTO's
 * 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public class LotMapper {

    /**
     * Maps a single lot model to a lot dto object
     * 
     * @param lot 
     * @return a LotDTO, null if lot was null
     */
    public static LotDTO mapLotDTO(Lot lot){
        if (lot == null){
            return null;
        }

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

    /**
     * Maps a list of lots to a list of lot dto's
     * 
     * @param lots a list of lots
     * @return a list of lotDTO, null if the list of lots was null
     */
    public static List<LotDTO> mapLotDTOList(List<Lot> lots){
        if (lots == null){
            return null;
        }

        return lots.stream().map(lot -> mapLotDTO(lot)).toList();
    }
    
}

