package moravians.niskyhill.server.services;

import java.util.ArrayList;
import java.util.List;
import moravians.niskyhill.server.database.Database;
import moravians.niskyhill.server.dtos.LotDTO;
import moravians.niskyhill.server.dtos.LotResidentsDTO;
import moravians.niskyhill.server.dtos.ResidentDTO;
import moravians.niskyhill.server.exceptions.HttpStatus;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import moravians.niskyhill.server.mappers.LotMapper;
import moravians.niskyhill.server.mappers.ResidentMapper;
import moravians.niskyhill.server.models.Lot;

public class LotService {

    public static List<LotDTO> getAllLots(Database database) throws HttpStatusException {
        List<LotDTO> lotList = LotMapper.mapLotDTOList(database.getAllLots());

        if (lotList.size() == 0){
            throw new HttpStatusException(HttpStatus.NOT_FOUND.value, "No Lots Found");
        }

        return lotList;
    }


    public static LotDTO getLot(String lid, Database database) throws HttpStatusException {
        if (lid == null){
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "lid cannot be null");
        }

        try{
            LotDTO lotDTO =  LotMapper.mapLotDTO(database.getLot(Long.parseLong(lid)));

            if (lotDTO == null){
                throw new HttpStatusException(HttpStatus.NOT_FOUND.value, "Could not find Lot with id " + lid);
            }
            return lotDTO;

        } catch (NumberFormatException e) {
            System.err.printf("Lid must be a numeric value: %s\n", e.getMessage());
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "lid must be numeric", e);
        }
    }


    public static List<LotResidentsDTO> getLotResidents(String lotNumber, String sectionName, Database database) throws HttpStatusException{
        if (lotNumber == null && sectionName == null){
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "lot number and section name cannot both be null");
        }
        List<Lot> lotList = database.getLotDetails(lotNumber, sectionName);

        List<LotResidentsDTO> lotResidentsList = new ArrayList<>();
        for (Lot lot: lotList){
            List<ResidentDTO> residentDTOList = ResidentMapper.mapResidentDTOList(database.getLotResidents(lot.lid()));
            LotDTO lotDTO = LotMapper.mapLotDTO(lot);
            lotResidentsList.add(new LotResidentsDTO(lotDTO, residentDTOList));
        }

        if (lotResidentsList.size() == 0){
            throw new HttpStatusException(HttpStatus.NOT_FOUND.value, "Not Lots Found");
        }

        return lotResidentsList;
    }
}
