
const API_BASE_URL = 'https://niskyhill.org';

//Get all tasks
export const fetchTasks = async () => {
    const response = await fetch(`${API_BASE_URL}/todo/all`, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch tasks");
    }

    return await response.json();
};

//Add a new task
export const addTask = async (title, description) => {
    const response = await fetch(`${API_BASE_URL}/todo/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
        throw new Error("Failed to add task");
    }

    return await response.json();
};

//Marks task as complete
export const completeTask = async (tid) => {
    const response = await fetch(`${API_BASE_URL}/todo/complete/${tid}`, {
        method: "PUT",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to complete task");
    }
};

//Delete a task
export const deleteTask = async (tid) => {
    const response = await fetch(`${API_BASE_URL}/todo/delete/${tid}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to delete task");
    }
};
