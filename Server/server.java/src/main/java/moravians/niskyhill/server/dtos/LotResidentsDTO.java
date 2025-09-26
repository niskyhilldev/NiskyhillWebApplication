package moravians.niskyhill.server.dtos;

import java.util.List;

public record LotResidentsDTO (
    LotDTO lot,
    List<ResidentDTO> residents 
) {   }
