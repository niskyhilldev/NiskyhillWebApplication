package moravians.niskyhill.server.mappers;

import moravians.niskyhill.server.dtos.SectionDTO;
import moravians.niskyhill.server.models.Section;
import java.util.List;

/**
 * Mapper helper class to handle coverting section models to section type DTO's
 * 
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public class SectionMapper {

    /**
     * maps a single section to single sectionDTO
     * 
     * @param section
     * @return a sectionDTO, Null if given section was null
     */
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

    /**
     * Map a list of sections to a list of sectionDTO
     * 
     * @param sections
     * @return list of sectionDTO, Null if given list was null
     */ 
    public static List<SectionDTO> mapSectionDTOList(List<Section> sections){
        if (sections == null){
            return null;
        }

        return sections.stream().map(section -> mapSectionDTO(section)).toList();
    }
}
