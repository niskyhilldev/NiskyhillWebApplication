import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { fetchResidentById } from "../api/residentApi";
import { generateForm } from "../api/formApi";

function InternmentCard() {
  const { rid } = useParams();
  const navigate = useNavigate();

  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    disposition: "",
    Date: "",
    date: "",
    lotNumber: "",
    lotLocation: "",
    lotOwner: "",
    lotCardNotes: "",
  });

  useEffect(() => {
    const loadResident = async () => {
      try {
        setLoading(true);

        const residentData = await fetchResidentById(rid);
        setResident(residentData);

        setFormData({
          lastName: residentData.lastName || "",
          firstName: [
            residentData.firstName,
            residentData.middleName,
          ]
            .filter(Boolean)
            .join(" "),

          disposition: "",
          Date: "",
          date: residentData.burialDate || "",
          lotNumber: residentData.lot?.number || "",
          lotLocation: residentData.lot?.descriptor || "",
          lotOwner: residentData.lot?.owner || "",
          lotCardNotes: "",
        });
      } catch (err) {
        console.error("Failed to load resident:", err);
        setError(err.message || "Failed to load resident");
      } finally {
        setLoading(false);
      }
    };

    loadResident();
  }, [rid]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
  try {
    setError("");

    const pdfBlob = await generateForm(
      "interment_card",
      formData
    );

    const pdfUrl = URL.createObjectURL(pdfBlob);

    window.open(pdfUrl, "_blank");

    setTimeout(() => {
      URL.revokeObjectURL(pdfUrl);
    }, 10000);

  } catch (err) {
    console.error("Failed to generate interment card:", err);
    setError(err.message || "Failed to generate interment card");
  }
};

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading resident...</Typography>
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
        Internment Card
      </Typography>

      <Paper
        sx={{
          p: 4,
          maxWidth: 900,
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
          Internment Card Information
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
          }}
        >
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <TextField
            label="First Name, Middle Initial, and Titles"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <TextField
            label="Disposition"
            name="disposition"
            value={formData.disposition}
            onChange={handleChange}
          />

          <TextField
            label="Date"
            name="Date"
            value={formData.Date}
            onChange={handleChange}
            placeholder="e.g. 86 - 9 - 7"
          />

          <TextField
            label="Date of Internment"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <TextField
            label="Lot Number"
            name="lotNumber"
            value={formData.lotNumber}
            onChange={handleChange}
            required
          />

          <TextField
            label="Lot Location"
            name="lotLocation"
            value={formData.lotLocation}
            onChange={handleChange}
          />

          <TextField
            label="Lot Owner"
            name="lotOwner"
            value={formData.lotOwner}
            onChange={handleChange}
          />

          <TextField
            label="Lot Card Notes"
            name="lotCardNotes"
            value={formData.lotCardNotes}
            onChange={handleChange}
            multiline
            minRows={4}
            sx={{
              gridColumn: "1 / -1",
            }}
          />
        </Box>

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
            sx={{
              bgcolor: "#0D2543",
              "&:hover": { bgcolor: "#081a2f" },
            }}
          >
            Generate Internment Card
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default InternmentCard;