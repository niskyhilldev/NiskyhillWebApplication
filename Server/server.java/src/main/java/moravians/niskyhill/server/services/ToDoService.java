
package moravians.niskyhill.server.services;

import java.util.List;
import moravians.niskyhill.server.database.Database;
import moravians.niskyhill.server.dtos.ToDoDTO;
import moravians.niskyhill.server.exceptions.HttpStatus;
import moravians.niskyhill.server.exceptions.HttpStatusException;
import moravians.niskyhill.server.models.ToDo;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;

/**
 * Service Layer for all operations regarding To-Do tasks
 */
public class ToDoService {

    /**
     * Get all tasks in the system
     *
     * @param database a database with an established connection
     * @return a list of ToDo tasks
     * @throws HttpStatusException database error
     */
    public static List<ToDo> getAllTasks(Database database) throws HttpStatusException {
        return database.getAllTasks();
    }

    /**
     * Add a new task to the system
     *
     * @param toDoDTO new task information
     * @param assignerId the id of the user creating the task
     * @param database a database with an established connection
     * @return the id of the newly created task
     * @throws HttpStatusException missing or invalid information
     */
    public static Long addTask(ToDoDTO toDoDTO, Long assignerId, Database database) throws HttpStatusException {

        if (toDoDTO == null) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "Task Information Cannot Be Null");
        }

        if (toDoDTO.title() == null || toDoDTO.title().isBlank() ||
            toDoDTO.description() == null || toDoDTO.description().isBlank() ||
            assignerId == null) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "Task Information Missing Required Criteria");
        }

        Long tid = database.addNewTask(
            assignerId,
            toDoDTO.title(),
            toDoDTO.description()
        );

        if (tid == null) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "Failed to Create Task");
        }
        
        sendTaskEmail(toDoDTO.title(), toDoDTO.description());
        
        return tid;
    }

    /**
     * Mark a task as complete
     *
     * @param tid the id of the task
     * @param database a database with an established connection
     * @return true on success
     * @throws HttpStatusException invalid id or task not found
     */
    public static boolean completeTask(String tid, Database database) throws HttpStatusException {

        Long taskId = parseTaskId(tid);

        if (database.getTask(taskId) == null) {
            throw new HttpStatusException(HttpStatus.NOT_FOUND.value, "Task Not Found with id " + tid);
        }

        if (!(database.completeTask(taskId))) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "Failed to Complete Task");
        }

        return true;
    }

    /**
     * Delete a task from the system
     *
     * @param tid the id of the task
     * @param database a database with an established connection
     * @return true on success
     * @throws HttpStatusException invalid id or task not found
     */
    public static boolean deleteTask(String tid, Database database) throws HttpStatusException {

        Long taskId = parseTaskId(tid);

        if (database.getTask(taskId) == null) {
            throw new HttpStatusException(HttpStatus.NOT_FOUND.value, "Task Not Found with id " + tid);
        }

        if (!(database.deleteTask(taskId))) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "Failed to Delete Task");
        }

        return true;
    }

    /**
     * Validate and convert a task ID to a numeric value
     *
     * @param tid the task id as a string
     * @return the numeric task id
     * @throws HttpStatusException missing or invalid id
     */
    private static Long parseTaskId(String tid) throws HttpStatusException {

        if (tid == null || tid.isBlank()) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "Task ID Cannot Be Null");
        }

        try {
            return Long.parseLong(tid);
        } catch (NumberFormatException e) {
            throw new HttpStatusException(HttpStatus.BAD_REQUEST.value, "Task ID Must Be Numeric", e);
        }
    }

    /**
     * Send a task email through Power Automate
     *
     * @param title the task name
     * @param description the task description
     * @return true if Power Automate accepted the request
     */
    private static boolean sendTaskEmail(String title, String description) {
        try {
            String url = System.getenv("POWER_AUTOMATE_URL");

            if (url == null || url.isBlank()) {
                System.err.println("Power Automate URL is not configured.");
                return false;
            }

            String json = new ObjectMapper().writeValueAsString(Map.of(
                "taskName", title,
                "description", description
            ));

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("Power Automate Status: " + response.statusCode());

            return response.statusCode() >= 200 && response.statusCode() < 300;

        } catch (Exception e) {
            System.err.println("Power Automate Error: " + e.getMessage());
            return false;
        }
    }

    /**
     * Check for overdue tasks and send reminder emails
     *
     * @param database a database with an established connection
     */
    public static void sendDueReminders(Database database) {

        try {
            List<ToDo> tasks = database.getTasksDueForReminder();

            System.out.println("Tasks due for reminder: " + tasks.size());

            for (ToDo task : tasks) {

                // Check the current task status before sending
                ToDo currentTask = database.getTask(task.tid());

                if (currentTask == null || !"Open".equals(currentTask.status())) {
                    System.out.println("Skipping completed Task ID: " + task.tid());
                    continue;
                }

                // Send reminder through Power Automate
                boolean sent = sendTaskEmail(
                    currentTask.title(),
                    currentTask.description()
                );

                if (sent) {
                    database.updateLastRemindedAt(task.tid());

                    System.out.println(
                        "Reminder sent for Task ID: " + task.tid()
                    );
                } else {
                    System.err.println(
                        "Failed to send reminder for Task ID: " + task.tid()
                    );
                }
            }

        } catch (Exception e) {
            System.err.println("Error Processing Task Reminders: " + e.getMessage());
        }
    }
}
