import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import { fetchLotById } from "../api/lotApi";

function CertificateOfOwnership() {
    const { lid } = useParams();
    const navigate = useNavigate();

    const [lot, setLot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        lotNo: "",
        section: "",
        day: "",
        month: "",
        year: "",
        ownerName: "",
        ownerAddress: "",
        considerationWords: "",
        considerationDollars: "",
        depositWords: "",
        depositDollars: "",
    });

    useEffect(() => {
        const loadLot = async () => {
            try {
                setLoading(true);

                const data = await fetchLotById(lid);

                setLot(data);

                setFormData({
                    lotNo: data.number || "",
                    section: data.section?.name || "",
                    day: "",
                    month: "",
                    year: "",
                    ownerName: data.owner || "",
                    ownerAddress: "",
                    considerationWords: "",
                    considerationDollars: "",
                    depositWords: "",
                    depositDollars: "",
                });
            } catch (err) {
                console.error("Failed to load lot:", err);
                setError(err.message || "Failed to load lot");
            } finally {
                setLoading(false);
            }
        };

        loadLot();
    }, [lid]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleGenerate = async () => {
        try {
            // Send the certificate information to the backend
            const response = await fetch("http://localhost:8080/forms/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    formId: "certificate_of_ownership",
                    fieldValues: formData,
                }),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Failed to generate certificate");
            }

            // Convert the response into a PDF file
            const pdfBlob = await response.blob();

            // Create a temporary URL for the PDF
            const pdfUrl = URL.createObjectURL(pdfBlob);

            // Open the generated certificate in a new tab
            window.open(pdfUrl, "_blank");
        } catch (err) {
            console.error("Failed to generate certificate:", err);
            setError(err.message || "Failed to generate certificate");
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography>Loading lot information...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography color="error">
                    {error}
                </Typography>

                <Button
                    onClick={() => navigate(-1)}
                    sx={{ mt: 2 }}
                >
                    Go Back
                </Button>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#efefef",
                p: 4,
            }}
        >
            <Paper
                sx={{
                    maxWidth: 900,
                    mx: "auto",
                    p: 4,
                    border: "1px solid #0d2543",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        color: "#0d2543",
                        fontFamily: "Inria Serif",
                        mb: 4,
                    }}
                >
                    Certificate of Ownership
                </Typography>

                {/* Lot Information */}
                <Typography
                    variant="h6"
                    sx={{
                        color: "#0d2543",
                        mb: 2,
                    }}
                >
                    Lot Information
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 2,
                        mb: 4,
                    }}
                >
                    <TextField
                        label="Lot Number"
                        value={formData.lotNo}
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                        }}
                    />

                    <TextField
                        label="Section"
                        value={formData.section}
                        slotProps={{
                            input: {
                                readOnly: true,
                            },
                        }}
                    />

                    <TextField
                        label="Owner Name(s)"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        required
                        fullWidth
                    />
                </Box>

                {/* Certificate Information */}
                <Typography
                    variant="h6"
                    sx={{
                        color: "#0d2543",
                        mb: 2,
                    }}
                >
                    Certificate Information
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Day"
                        name="day"
                        value={formData.day}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        label="Month"
                        name="month"
                        value={formData.month}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        label="Year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                    />
                </Box>

                <TextField
                    label="Owner Address (City, County, State)"
                    name="ownerAddress"
                    value={formData.ownerAddress}
                    onChange={handleChange}
                    required
                    fullWidth
                    sx={{ mt: 2 }}
                />

                {/* Consideration */}
                <Typography
                    variant="h6"
                    sx={{
                        color: "#0d2543",
                        mt: 4,
                        mb: 2,
                    }}
                >
                    Consideration
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr",
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Amount in Words"
                        name="considerationWords"
                        value={formData.considerationWords}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        label="Amount ($)"
                        name="considerationDollars"
                        value={formData.considerationDollars}
                        onChange={handleChange}
                        required
                    />
                </Box>

                {/* Perpetual Care Deposit */}
                <Typography
                    variant="h6"
                    sx={{
                        color: "#0d2543",
                        mt: 4,
                        mb: 2,
                    }}
                >
                    Perpetual Care Deposit
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr",
                        gap: 2,
                    }}
                >
                    <TextField
                        label="Amount in Words"
                        name="depositWords"
                        value={formData.depositWords}
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        label="Amount ($)"
                        name="depositDollars"
                        value={formData.depositDollars}
                        onChange={handleChange}
                        required
                    />
                </Box>

                {/* Buttons */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                        mt: 4,
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleGenerate}
                        sx={{
                            backgroundColor: "#af8c30",
                            "&:hover": {
                                backgroundColor: "#8b6f27",
                            },
                        }}
                    >
                        Generate Certificate
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default CertificateOfOwnership;