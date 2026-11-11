
import { useState, useEffect } from 'react';
import {
    fetchTasks,
    addTask as createTask,
    completeTask as completeTaskAPI,
    deleteTask
} from '../../api/todoApi.js';
import {
    Box,
    Typography,
    TextField,
    Button
} from '@mui/material';
import { useUser } from "../UserContext";

export default function ToDoList() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tasks, setTasks] = useState([]);

    // Load user context and determine permissions
    const user = useUser();
    const isSuperintendent = user?.role === "Superintendent";
    const canEditTask = user != null && !isSuperintendent;

    // Load existing tasks from the database
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const data = await fetchTasks();
                setTasks(data);
            } catch (error) {
                console.error("Failed to load tasks:", error);
            }
        };

        loadTasks();
    }, []);

    // Create a new task
    const addTask = async () => {
        if (title.trim() === "" || description.trim() === "") return;

        try {
            await createTask(title.trim(), description.trim());

            const updatedTasks = await fetchTasks();
            setTasks(updatedTasks);

            setTitle("");
            setDescription("");
        } catch (error) {
            console.error("Failed to add task:", error);
            alert("Failed to add task. Please try again.");
        }
    };

    // Mark a task as complete
    const completeTask = async (tid) => {
        try {
            await completeTaskAPI(tid);

            const updatedTasks = await fetchTasks();
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Failed to complete task:", error);
            alert("Failed to complete task. Please try again.");
        }
    };

    // Permanently remove a task
    const removeTask = async (tid) => {
        try {
            await deleteTask(tid);

            const updatedTasks = await fetchTasks();
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Failed to remove task:", error);
            alert("Failed to remove task. Please try again.");
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <Box sx={{ px: 3 }}>
            <Typography
                sx={{
                    textAlign: "center",
                    color: "#0d2543",
                    fontSize: "2.4rem",
                    fontWeight: "bold",
                    mb: 3
                }}
            >
                To-Do List
            </Typography>

            {/* Superintendent cannot create tasks */}
            {canEditTask && (
                <Box
                    sx={{
                        maxWidth: "800px",
                        margin: "auto",
                        mb: 3
                    }}
                >
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <TextField
                            placeholder="Task Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            size="small"
                            fullWidth
                        />

                        <Button
                            onClick={addTask}
                            variant="contained"
                            sx={{
                                backgroundColor: "#0d2543",
                                whiteSpace: "nowrap"
                            }}
                        >
                            Add Task
                        </Button>
                    </Box>

                    <TextField
                        placeholder="Task Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={2}
                        fullWidth
                    />
                </Box>
            )}

            {/* Task List */}
            <Box sx={{ maxWidth: "800px", margin: "auto" }}>
                {tasks.length === 0 ? (
                    <Typography sx={{ textAlign: "center", color: "gray" }}>
                        No tasks
                    </Typography>
                ) : (
                    tasks.map((item) => (
                        <Box
                            key={item.tid}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "white",
                                p: 2,
                                mb: 1,
                                borderRadius: "4px"
                            }}
                        >
                            {/* Task Description and Timestamp */}
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography sx={{ fontWeight: "bold" }}>
                                    {item.title}
                                </Typography>

                                <Typography sx={{ mt: 0.5 }}>
                                    {item.description}
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: "0.75rem",
                                        color: "gray",
                                        mt: 0.5
                                    }}
                                >
                                    Created: {formatDate(item.createdAt)}
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    mr: 3,
                                    fontWeight: "bold"
                                }}
                            >
                                {item.status}
                            </Typography>

                            {/* Only authorized users can modify tasks */}
                            {canEditTask && (
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    {item.status === "Open" && (
                                        <Button
                                            onClick={() => completeTask(item.tid)}
                                            sx={{ mr: 1 }}
                                        >
                                            Complete
                                        </Button>
                                    )}

                                    <Button
                                        onClick={() => removeTask(item.tid)}
                                        sx={{ color: "red" }}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
}
