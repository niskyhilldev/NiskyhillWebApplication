import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Tooltip
} from '@mui/material';
import { useUser } from "../UserContext";

export default function ToDoList() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tasks, setTasks] = useState([]);

    // load user context
    const user = useUser();
    const isSuperintendent = user?.role === "Superintendent";
    const canEditTask = user != null && !isSuperintendent;

    const addTask = () => {
        if (title.trim() === "") return;

        const newTask = {
            id: Date.now(),
            title: title,
            description: description,
            status: "Open",
            created_at: new Date().toISOString()
        };

        setTasks([...tasks, newTask]);
        setTitle("");
        setDescription("");
    };

    const completeTask = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id
                    ? { ...task, status: "Complete" }
                    : task
            )
        );
    };

    const removeTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
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

            {/* superintendent cannot create tasks */}
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
                            key={item.id}
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
                                    Created: {formatDate(item.created_at)}
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
                            {canEditTask && (
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button
                                        onClick={() => completeTask(item.id)}
                                        sx={{ mr: 1 }}
                                    >
                                        Complete
                                    </Button>

                                    <Button
                                    onClick={() => removeTask(item.id)}
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