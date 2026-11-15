package moravians.niskyhill.server.dtos;

/**
 * DTO for representing a Section
 * 
 * @param sid the id of the section
 * @param name the name of the section
 * @author Tedd Stabolepszy, Lehigh University '26
 */
public record SectionDTO(
    Long sid,
    String name
) {  }
