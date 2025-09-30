package moravians.niskyhill.server.dtos;

import java.util.List;

public record LotResidentsDTO (
    LotDTO lot,
    List<ResidentDTO> residents // note the lot and section protion of the residents will be null since we have them above
) {   }
