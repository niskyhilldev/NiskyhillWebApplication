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

function InternmentRecord() {
  const { rid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    placeOfBirth: "",
    lateResidence: "",
    dateOfBirth: "",
    dateOfDeath: "",
    sex: "",
    SocialSate: "",
    causeOfDeath: "",
    nearestRelative: "",
    relativeAddress: "",
    timePlaceFuneral: "",
    vaultDimensions: "",
    funeralDirector: "",
  });

  useEffect(() => {
    const loadResident = async () => {
      try {
        setLoading(true);

        const data = await fetchResidentById(rid);

        const residentData = data;

        setFormData((previous) => ({
          ...previous,

          name: [
            residentData.firstName,
            residentData.middleName,
            residentData.lastName,
          ]
            .filter(Boolean)
            .join(" "),

          dateOfBirth: residentData.birthDate || "",
          dateOfDeath: residentData.deathDate || "",
        }));
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

      console.log("Generating Internment Record:", formData);

      const pdfBlob = await generateForm(
        "internment_record",
        formData
      );

      const pdfUrl = URL.createObjectURL(pdfBlob);

      window.open(pdfUrl, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 10000);

    } catch (err) {
      console.error("Failed to generate internment record:", err);
      setError(err.message || "Failed to generate internment record");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>
          Loading resident...
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
        Internment Record
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
          Internment Record Information
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
          }}
        >
          <TextField
            label="Full Name of Deceased"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ gridColumn: "1 / -1" }}
          />

          <TextField
            label="Place of Birth"
            name="placeOfBirth"
            value={formData.placeOfBirth}
            onChange={handleChange}
          />

          <TextField
            label="Late Residence (Full Address)"
            name="lateResidence"
            value={formData.lateResidence}
            onChange={handleChange}
            sx={{ gridColumn: "1 / -1" }}
          />

          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />

          <TextField
            label="Date of Death"
            name="dateOfDeath"
            value={formData.dateOfDeath}
            onChange={handleChange}
            required
          />

          <TextField
            label="Sex"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
          />

          <TextField
            label="Social State"
            name="SocialSate"
            value={formData.SocialSate}
            onChange={handleChange}
            placeholder="e.g. Married, Divorced"
          />

          <TextField
            label="Cause of Death"
            name="causeOfDeath"
            value={formData.causeOfDeath}
            onChange={handleChange}
            sx={{ gridColumn: "1 / -1" }}
          />

          <TextField
            label="Nearest Relative or Friend"
            name="nearestRelative"
            value={formData.nearestRelative}
            onChange={handleChange}
          />

          <TextField
            label="Address of Nearest Relative"
            name="relativeAddress"
            value={formData.relativeAddress}
            onChange={handleChange}
          />

          <TextField
            label="Time and Place of Funeral"
            name="timePlaceFuneral"
            value={formData.timePlaceFuneral}
            onChange={handleChange}
            sx={{ gridColumn: "1 / -1" }}
          />

          <TextField
            label="Inside Dimensions of Vault (L x W x H)"
            name="vaultDimensions"
            value={formData.vaultDimensions}
            onChange={handleChange}
            sx={{ gridColumn: "1 / -1" }}
          />

          <TextField
            label="Funeral Director or Person in Charge"
            name="funeralDirector"
            value={formData.funeralDirector}
            onChange={handleChange}
            sx={{ gridColumn: "1 / -1" }}
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
              "&:hover": {
                bgcolor: "#081a2f",
              },
            }}
          >
            Generate Internment Record
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default InternmentRecord;