import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/userAPI';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper
} from '@mui/material';

export default function LoginForm({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if(!email || !password){
            setError("Email & password are required");
            return;
        }

        try {
            await login(email, password);
            onLogin(); // Call the onLogin prop to update authentication status
            navigate("/admin"); // redirect to dashboard on successful login
        } catch (err) {
            console.error("Login failed:", err);
            setError("Invalid email or password");
        }
    };

    return (
       <Box
            sx={{
                fontFamily: 'Arial, sans-serif',
                display: 'flex',
                height: "100vh",
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: "url('../public/niskyHomepage.JPG')", // Optional background image
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
            }}
        >
            {/* overlay*/}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(255, 255, 255, 0.6);', // semi-transparent overlay
                    zIndex: 0,
                }}
            />

            {/* login card */}
            <Paper
                elevation={6}
                sx={{
                    p: "2rem",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    width: "300px",
                    position: 'relative',
                    zIndex: 1,
                    backgroundColor: '#0d2543', 
                }}
            >
                <Typography 
                    sx={{
                        textAlign: "center",
                        mb: "1.5rem",
                        color: "white",
                        letterSpacing: "2.5px",
                        fontFamily: "Inria Serif",
                        fontSize: "50px",
                        fontWeight: "bold",
                    }}
                >
                    Login
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        placeholder="Email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ 
                            mb: 1,
                            backgroundColor: "white",
                            borderRadius: "5px",
                         }}
                    />

                    <TextField
                        placeholder="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ 
                            mb: 1, 
                            backgroundColor: "white", 
                            borderRadius: "5px" }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        sx={{
                            mt: 1,
                            p: "0.8rem",
                            backgroundColor: "#af8c30",
                            fontFamily: "Inria Serif",
                            letterSpacing: "1.2px",
                            color: "white",
                            borderRadius: "5px",
                            fontSize: "1rem",
                            "&:hover": { 
                                transform: "scale(1.1)",
                                transition: "transform 0.2s ease",
                                backgroundColor: "#af8c30"
                             },
                        }}
                    >
                        Login
                    </Button>
                </form>

                {error && (
                    <Typography 
                        sx={{
                            color: "red",
                            fontSize: "0.9rem",
                            textAlign: "center",
                            mt: "0.5rem",
                        }}
                    >
                        {error}
                    </Typography>
                )}

                <Box 
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        color: "white",
                        pt: "20px",
                    }}>

                    <Typography 
                        sx={{
                            fontSize: "40px",
                            fontFamily: "Inria Serif",
                            fontWeight: "500",
                        }}
                    >
                        Nisky Hill
                    </Typography>

                    <Typography 
                        sx={{
                            fontSize: "22px",
                            fontFamily: "Inria Serif",
                            letterSpacing: "3.72px",
                            fontWeight: "1000",
                            mt: "8px",
                        }}
                    >
                        Cemetery
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}
