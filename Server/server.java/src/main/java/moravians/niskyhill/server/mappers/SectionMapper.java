package moravians.niskyhill.server.mappers;

import moravians.niskyhill.server.dtos.SectionDTO;
import moravians.niskyhill.server.models.Section;
import java.util.List;

public class SectionMapper {

    public static SectionDTO mapSection(Section section){
        return new SectionDTO(
            section.name(),
            section.map()
        );
    }

    public static List<SectionDTO> mapSectionList(List<Section> sections){
        return sections.stream().map(section -> mapSection(section)).toList();
    }
    
}
