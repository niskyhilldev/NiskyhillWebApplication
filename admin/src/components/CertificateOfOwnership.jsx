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
import { generateForm } from "../api/formApi";

function CertificateOfOwnership() {
  const { lid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");

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

  // handle generating the forms
  const handleGenerate = async () => {
    try {
        setGenerating(true);
        setGenerateError("");

        const pdfBlob = await generateForm(
            "certificate_of_ownership",
            formData
        );

        const pdfUrl = URL.createObjectURL(pdfBlob);

        window.open(pdfUrl, "_blank");

        // Clean up the temporary URL later
        setTimeout(() => {
            URL.revokeObjectURL(pdfUrl);
        }, 10000);

    } catch (err) {
        console.error("Failed to generate certificate:", err);
        setGenerateError(
            err.message || "Failed to generate certificate"
        );
    } finally {
        setGenerating(false);
    }
};
  useEffect(() => {
    const loadLot = async () => {
      try {
        setLoading(true);

        const data = await fetchLotById(lid);

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

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>
          Loading lot...
        </Typography>
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
          Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        sx={{
          color: "#0D2543",
          mb: 3,
          fontWeight: "bold",
        }}
      >
        Certificate of Ownership
      </Typography>

      <Paper
        sx={{
          p: 4,
          maxWidth: 1000,
          margin: "0 auto",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            color: "#0D2543",
          }}
        >
          Certificate of Ownership Information
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
          }}
        >
          <TextField
            label="Lot Number"
            name="lotNo"
            value={formData.lotNo}
            onChange={handleChange}
            required
          />

          <TextField
            label="Section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            required
          />

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

          <TextField
            label="Owner Name(s)"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            required
          />

          <TextField
            label="Owner Address (City, County, State)"
            name="ownerAddress"
            value={formData.ownerAddress}
            onChange={handleChange}
            required
            sx={{ gridColumn: "1 / -1" }}
          />

          <TextField
            label="Consideration Amount Written"
            name="considerationWords"
            value={formData.considerationWords}
            onChange={handleChange}
            required
            placeholder="ex: One Thousand Four Hundred and 00/100 Dollars"
          />

          <TextField
            label="Consideration Amount ($)"
            name="considerationDollars"
            value={formData.considerationDollars}
            onChange={handleChange}
            required
            placeholder="ex: $1,400.00"
          />

          <TextField
            label="Perpetual Care Deposit Written"
            name="depositWords"
            value={formData.depositWords}
            onChange={handleChange}
            required
            placeholder="ex: Seven Hundred and 00/100 Dollars"
          />

          <TextField
            label="Perpetual Care Deposit ($)"
            name="depositDollars"
            value={formData.depositDollars}
            onChange={handleChange}
            required
            placeholder="ex: $700.00"
          />
        </Box>

        {generateError && (
            <Typography
                sx={{
                    color: "error.main",
                    mb: 2,
                    textAlign: "right",
                }}
            >
                {generateError}
            </Typography>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
          }}
        >
          <Button
            onClick={() => navigate(-1)}
            sx={{
              color: "#0D2543",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={generating}
            sx={{
                bgcolor: "#0D2543",
                "&:hover": {
                    bgcolor: "#081a2f",
                },
            }}
          >
            {generating ? "Generating..." : "Generate Certificate"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default CertificateOfOwnership;