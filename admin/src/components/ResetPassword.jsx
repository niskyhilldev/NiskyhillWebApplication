import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../api/userAPI';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper
} from '@mui/material';

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // validation
        if(!newPassword || !confirmPassword){
            setError("Both fields are required");
            return;
        }

        if(newPassword != confirmPassword){
            setError("Passwords do not match");
            return;
        }

        try {
            await changePassword(newPassword)
            navigate("/login"); // redirect to login on successful change
        } catch (err) {
            console.error("Password reset failed:", err);
            setError("Failed to reset password");
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

            {/* card */}
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
                    Reset Password
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        placeholder="New Password"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        sx={{ 
                            mb: 1,
                            backgroundColor: "white",
                            borderRadius: "5px",
                         }}
                    />

                    <TextField
                        placeholder="Re-type New Password"
                        type="password"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                        Update Password
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