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
import NotificationSnackbar from "./NotificationSnackBar";

//used to style textFields with less clutter
const textFieldStyle = {
  backgroundColor: "white",
  borderRadius: "6px",
  "& input": {
    color: "black",
  },
};

function CertificateOfOwnership() {
  const { lid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

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
      setError("");

      // require all fields before generation
      if (!formData.lotNo.trim()) {
        setError("Lot Number is required.");
        return;
      }

      if (!formData.section.trim()) {
        setError("Section is required.");
        return;
      }

      if (!formData.day.trim()) {
        setError("Day is required.");
        return;
      }

      if (!formData.month.trim()) {
        setError("Month is required.");
        return;
      }

      if (!formData.year.trim()) {
        setError("Year is required.");
        return;
      }

      if (!formData.ownerName.trim()) {
        setError("Owner Name is required.");
        return;
      }

      if (!formData.ownerAddress.trim()) {
        setError("Owner Address is required.");
        return;
      }

      if (!formData.considerationWords.trim()) {
        setError("Consideration in Words is required.");
        return;
      }

      if (!formData.considerationDollars.trim()) {
        setError("Consideration in Dollars is required.");
        return;
      }

      if (!formData.depositWords.trim()) {
        setError("Deposit in Words is required.");
        return;
      }

      if (!formData.depositDollars.trim()) {
        setError("Deposit in Dollars is required.");
        return;
      }

      const pdfBlob = await generateForm(
        "certificate_of_ownership",
        formData
      );

      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 10000);

    } catch (err) {
      console.error("Failed to generate certificate:", err);
      setError(
        err.message || "Failed to generate certificate of ownership"
      );
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

  return (
    <Box sx={{ p: 4 }}>
      {/* <Typography
        variant="h4"
        sx={{
          color: "#0D2543",
          mb: 3,
          fontWeight: "bold",
        }}
      >
        Certificate of Ownership
      </Typography> */}

        <NotificationSnackbar
        //converts search error to boolean, so if theres an error pop up, then remove it
          open={!!error}
          message={error}
          severity="error"
          onClose={() => setError(null)}
       />

      <Paper
        sx={{
          p: 4,
          maxWidth: 1000,
          margin: "0 auto",
           
          borderRadius: "12px",
          backgroundColor: "#0d2543",
          color: "white",
          border: "1px solid #E8AE31",
          //shadow made things feel a bit off to me
          //boxShadow: "0 0 0 1px rgba(175, 140, 48, 0.25), 0 10px 30px rgba(0,0,0,0.4)",
          
        }}
      >
        <Typography
          variant="h6"
           sx={{
            textAlign: "center",
            fontFamily: "Inria Serif",
            fontWeight: "600",
            fontSize: "1.8rem",
            letterSpacing: "1.5px",
            color: "white",
            mb: 3
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
            variant="filled"
            value={formData.lotNo}
            onChange={handleChange}
            required
            sx={textFieldStyle}
          />

          <TextField
            label="Section"
            name="section"
            variant="filled"
            value={formData.section}
            onChange={handleChange}
            required
            sx={textFieldStyle}
          />

          <TextField
            label="Day"
            name="day"
            variant="filled"
            value={formData.day}
            onChange={handleChange}
            required
            sx={textFieldStyle}
          />

          <TextField
            label="Month"
            name="month"
            variant="filled"
            value={formData.month}
            onChange={handleChange}
            required
            sx={textFieldStyle}
          />

          <TextField
            label="Year"
            name="year"
            variant="filled"
            value={formData.year}
            onChange={handleChange}
            placeholder="ex: 26 (for year 2026)"
            required
            sx={textFieldStyle}
          />

          <TextField
            label="Owner Name(s)"
            name="ownerName"
            variant="filled"
            value={formData.ownerName}
            onChange={handleChange}
            required
            sx={textFieldStyle}
          />

          <TextField
            label="Owner Address (City, County, State)"
            name="ownerAddress"
            variant="filled"
            value={formData.ownerAddress}
            onChange={handleChange}
            required
            sx={{...textFieldStyle , gridColumn: "1 / -1" }}
          />

          <TextField
            label="Consideration Amount Written"
            name="considerationWords"
            variant="filled"
            value={formData.considerationWords}
            onChange={handleChange}
            required
            sx={textFieldStyle}
            placeholder="ex: One Thousand Four Hundred and 00/100 Dollars"
          />

          <TextField
            label="Consideration Amount ($)"
            name="considerationDollars"
            variant="filled"
            value={formData.considerationDollars}
            onChange={handleChange}
            required
            sx={textFieldStyle}
            placeholder="ex: $1,400.00"
          />

          <TextField
            label="Perpetual Care Deposit Written"
            name="depositWords"
            variant="filled"
            value={formData.depositWords}
            onChange={handleChange}
            required
            sx={textFieldStyle}
            placeholder="ex: Seven Hundred and 00/100 Dollars"
          />

          <TextField
            label="Perpetual Care Deposit ($)"
            name="depositDollars"
            variant="filled"
            value={formData.depositDollars}
            onChange={handleChange}
            required
            sx={textFieldStyle}
            placeholder="ex: $700.00"
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
              color: "white",
              //fontFamily: "Inria Serif",
              border: "1px solid #E8AE31",
              "&:hover": {
                backgroundColor: "rgba(175,140,48,0.1)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
          variant="contained"
            onClick={handleGenerate}
            disabled={generating}
            sx={{
              backgroundColor: "#E8AE31",
              color: "white",
              //fontFamily: "Inria Serif",
              letterSpacing: "1px",
              "&:hover": {
                backgroundColor: "#E8AE31",
                transform: "scale(1.05)",
              },
            }}>
            {generating ? "Generating..." : "Generate Certificate"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default CertificateOfOwnership;