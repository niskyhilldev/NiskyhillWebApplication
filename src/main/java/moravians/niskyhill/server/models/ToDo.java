package moravians.niskyhill.server.models;

/**
 * Model for the to_do table in the database
 *
 * @param tid the id of the task
 * @param assignerId the id of the user who created the task
 * @param title the name of the task
 * @param description the details of the task
 * @param status the current status of the task (Open or Complete)
 * @param createdAt the date and time the task was created
 * @param completedAt the date and time the task was completed
 */
public record ToDo(
    Long tid,
    Long assignerId,
    String title,
    String description,
    String status,
    String createdAt,
    String completedAt
) { }