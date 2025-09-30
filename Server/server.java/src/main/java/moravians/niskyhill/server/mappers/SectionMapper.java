package moravians.niskyhill.server.mappers;

import moravians.niskyhill.server.dtos.SectionDTO;
import moravians.niskyhill.server.models.Section;
import java.util.List;

public class SectionMapper {

    public static SectionDTO mapSectionDTO(Section section){
        if (section == null){
            return null;
        }

        return new SectionDTO(
            section.sid(),
            section.name() 
            // Note: no map() becuase we dont want to keep transfering that big file all the time
        );
    }


    public static List<SectionDTO> mapSectionDTOList(List<Section> sections){
        if (sections == null){
            return null;
        }

        return sections.stream().map(section -> mapSectionDTO(section)).toList();
    }
    
}
