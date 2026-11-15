package moravians.niskyhill.server.dtos;

import java.util.List;

/**
 * DTO for representing a Lot and the residents burried in the lot
 * 
 * @param lot a lot DTO 
 * @param residents a list of residents burried in the lot 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public record LotResidentsDTO (
    LotDTO lot,
    List<ResidentDTO> residents // note the lot and section protion of the residents will be null since we have them above
) {   }
