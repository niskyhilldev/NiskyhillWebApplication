package moravians.niskyhill.server.dtos;

/**
 * DTO for requesting the creation of a new to-do task
 *
 * @param title the name of the task
 * @param description the details of the task
 */
public record ToDoDTO(
    String title,
    String description
) { }