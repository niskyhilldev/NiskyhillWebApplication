import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button
} from '@mui/material';

export default function ToDoList() {
    const [task, setTask] = useState("");
    const [tasks, setTasks] = useState([]);

    const addTask = () => {
        if (task.trim() === "") return;

        const newTask = {
            id: Date.now(),
            task: task,
            status: "Open",
            created_at: new Date().toISOString()
        };

        setTasks([...tasks, newTask]);
        setTask("");
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
            hour: "numeric",
            minute: "numeric"
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

            {/* Add Task */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    mb: 3
                }}
            >
                <TextField
                    placeholder="Enter a task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    size="small"
                    sx={{ width: "400px" }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            addTask();
                        }
                    }}
                />

                <Button
                    onClick={addTask}
                    variant="contained"
                    sx={{ backgroundColor: "#0d2543" }}
                >
                    Add Task
                </Button>
            </Box>

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
                                <Typography>
                                    {item.task}
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

                            {item.status === "Open" && (
                                <Button
                                    onClick={() => completeTask(item.id)}
                                    sx={{ mr: 1 }}
                                >
                                    Complete
                                </Button>
                            )}

                            <Button
                                onClick={() => removeTask(item.id)}
                                sx={{ color: "red" }}
                            >
                                Remove
                            </Button>
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
}