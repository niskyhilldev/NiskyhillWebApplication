import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { fetchResidentById } from "../api/residentApi";
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

function InternmentCard() {
  const { rid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const createInternmentRecord = location.state?.createInternmentRecord || false;

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
    section: "",
    lotOwner: "",
    lotCardNotes: "",
  });

  useEffect(() => {
    const loadResident = async () => {
      try {
        setLoading(true);
        const residentData = await fetchResidentById(rid);
        setResident(residentData);
        
        // load middle initial from resident and join
        const firstName = residentData.firstName || "";
        const middleInitial = residentData.middleName
          ? residentData.middleName.charAt(0).toUpperCase()
          : "";
        const firstNameWithMiddleInitial = [
          firstName,
          middleInitial,
        ].filter(Boolean).join(", ");

        setResident(residentData);

        setFormData({
          lastName: residentData.lastName || "",
          firstName: firstNameWithMiddleInitial || "",
          disposition: "",
          Date: "",
          date: residentData.burialDate || "",
          lotNumber: residentData.lot?.number || "",
          section: residentData.lot?.section?.name || "",
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

    if (!formData.lastName.trim()) {
      setError("Last Name is required.");
      return;
    }

    if (!formData.firstName.trim()) {
      setError("First Name is required.");
      return;
    }

    if (!formData.Date.trim()) {
      setError("Date is required.");
      return;
    }

    if (!formData.date) {
      setError("Date of Internment is required.");
      return;
    }

    if (!formData.lotNumber.trim()) {
      setError("Lot Number is required.");
      return;
    }

    if (!formData.section.trim()) {
      setError("Section is required.");
      return;
    }

    if (!formData.lotOwner.trim()) {
      setError("Lot Owner is required.");
      return;
    }

    const pdfFormData = {
      ...formData,
      firstName: `${formData.firstName} ${formData.middleInitial}`.trim(),
    };

    console.log("Generating Internment Card:", pdfFormData);

    const pdfBlob = await generateForm(
      "interment_card",
      pdfFormData
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

  return (
    <Box sx={{ p: 4 }}>

        <NotificationSnackbar
        //converts search error to boolean, so if theres an error pop up, then remove it
          open={!!error}
          message={error}
          severity="error"
          onClose={() => setError(null)}
       />
       
      <Typography
        variant="h4"
        sx={{
          color: "#0D2543",
          mb: 3,
          fontWeight: "bold",
        }}
      >
        {/* Internment Card */}
      </Typography>

      <Paper
        sx={{
          p: 4,
          maxWidth: 900,
          margin: "0 auto",
          borderRadius: "12px",
          backgroundColor: "#0d2543",
          color: "white",
          border: "1px solid #E8AE31",
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
            variant="filled"
            sx ={textFieldStyle}
          />

          <TextField
            label="First Name, Middle Initial, and Titles"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            variant="filled"
            sx ={textFieldStyle}
          />

          <TextField
            label="Disposition"
            name="disposition"
            value={formData.disposition}
            onChange={handleChange}
            variant="filled"
            sx ={textFieldStyle}
          />

          <TextField
            label="Date"
            name="Date"
            value={formData.Date}
            onChange={handleChange}
            placeholder="e.g. 86 - 9 - 7"
            variant="filled"
            sx ={textFieldStyle}
          />

          <TextField
            label="Date of Internment"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
            variant="filled"
            sx ={textFieldStyle}
          />

          <TextField
            label="Lot Number"
            name="lotNumber"
            value={formData.lotNumber}
            onChange={handleChange}
            required
            variant="filled"
            sx ={textFieldStyle}
          />

          <TextField
            label="Section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            variant="filled"
            sx ={textFieldStyle}
          />

          <TextField
            label="Lot Owner"
            name="lotOwner"
            value={formData.lotOwner}
            onChange={handleChange}
            variant="filled"
            sx ={textFieldStyle}
          />

          <TextField
            label="Lot Card Notes"
            name="lotCardNotes"
            value={formData.lotCardNotes}
            onChange={handleChange}
            multiline
            minRows={4}
            variant="filled"
            sx={{...textFieldStyle ,
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
            sx={{
              backgroundColor: "#E8AE31",
              color: "white",
              //fontFamily: "Inria Serif",
              letterSpacing: "1px",
              "&:hover": {
                backgroundColor: "#E8AE31",
                transform: "scale(1.05)",
              },
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