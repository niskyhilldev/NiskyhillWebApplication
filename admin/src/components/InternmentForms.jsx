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
import NotificationSnackbar from "./NotificationSnackBar";

const textFieldStyle = {
  backgroundColor: "white",
  borderRadius: "6px",
  "& input": {
    color: "black",
  },
};

function InternmentForms() {
  const { rid } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cardData, setCardData] = useState({
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

  const [recordData, setRecordData] = useState({
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
        setError("");

        const residentData = await fetchResidentById(rid);

        console.log("Resident data:", residentData);

        // -------------------------
        // INTERMENT CARD DATA
        // -------------------------

        const firstName = residentData.firstName || "";

        const middleInitial = residentData.middleName
          ? residentData.middleName.charAt(0).toUpperCase()
          : "";

        const firstNameWithMiddleInitial = [
          firstName,
          middleInitial,
        ]
          .filter(Boolean)
          .join(", ");

        setCardData({
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

        // -------------------------
        // INTERNMENT RECORD DATA
        // -------------------------

        setRecordData({
          name: [
            residentData.firstName,
            residentData.middleName,
            residentData.lastName,
          ]
            .filter(Boolean)
            .join(" "),

          placeOfBirth: "",
          lateResidence: "",
          dateOfBirth: residentData.birthDate || "",
          dateOfDeath: residentData.deathDate || "",
          sex: "",
          SocialSate: "",
          causeOfDeath: "",
          nearestRelative: "",
          relativeAddress: "",
          timePlaceFuneral: "",
          vaultDimensions: "",
          funeralDirector: "",
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

  // -------------------------
  // CARD HANDLER
  // -------------------------

  const handleCardChange = (event) => {
    const { name, value } = event.target;

    setCardData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // -------------------------
  // RECORD HANDLER
  // -------------------------

  const handleRecordChange = (event) => {
    const { name, value } = event.target;

    setRecordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // -------------------------
  // GENERATE CARD
  // -------------------------

  const handleGenerateCard = async () => {
    try {
      setError("");

      if (!cardData.lastName.trim()) {
        setError("Last Name is required.");
        return;
      }

      if (!cardData.firstName.trim()) {
        setError("First Name is required.");
        return;
      }

      if (!cardData.Date.trim()) {
        setError("Date is required.");
        return;
      }

      if (!cardData.date) {
        setError("Date of Internment is required.");
        return;
      }

      if (!cardData.lotNumber.trim()) {
        setError("Lot Number is required.");
        return;
      }

      if (!cardData.section.trim()) {
        setError("Section is required.");
        return;
      }

      if (!cardData.lotOwner.trim()) {
        setError("Lot Owner is required.");
        return;
      }

      const pdfFormData = {
        ...cardData,
      };

      console.log(
        "Generating Internment Card:",
        pdfFormData
      );

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
      console.error(
        "Failed to generate interment card:",
        err
      );

      setError(
        err.message || "Failed to generate interment card"
      );
    }
  };

  // -------------------------
  // GENERATE RECORD
  // -------------------------

  const handleGenerateRecord = async () => {
    try {
      setError("");

      if (!recordData.name.trim()) {
        setError("Full Name of Deceased is required.");
        return;
      }

      if (!recordData.dateOfDeath) {
        setError("Date of Death is required.");
        return;
      }

      console.log(
        "Generating Internment Record:",
        recordData
      );

      const pdfBlob = await generateForm(
        "internment_record",
        recordData
      );

      const pdfUrl = URL.createObjectURL(pdfBlob);

      window.open(pdfUrl, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 10000);
    } catch (err) {
      console.error(
        "Failed to generate internment record:",
        err
      );

      setError(
        err.message || "Failed to generate internment record"
      );
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
        Internment Forms
      </Typography>

      {/* INTERMENT CARD */}

      <Paper
        sx={{
          p: 4,
          maxWidth: 900,
          margin: "0 auto",
          mb: 4,
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
            mb: 3,
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
            value={cardData.lastName}
            onChange={handleCardChange}
            required
            variant="filled"
            sx={textFieldStyle}
          />

          <TextField
            label="First Name, Middle Initial, and Titles"
            name="firstName"
            value={cardData.firstName}
            onChange={handleCardChange}
            required
            variant="filled"
            sx={textFieldStyle}
          />

          <TextField
            label="Disposition"
            name="disposition"
            value={cardData.disposition}
            onChange={handleCardChange}
            variant="filled"
            sx={textFieldStyle}
          />

          <TextField
            label="Date"
            name="Date"
            value={cardData.Date}
            onChange={handleCardChange}
            placeholder="e.g. 86 - 9 - 7"
            required
            variant="filled"
            sx={textFieldStyle}
          />

          <TextField
            label="Date of Internment"
            name="date"
            type="date"
            value={cardData.date}
            onChange={handleCardChange}
            InputLabelProps={{
              shrink: true,
            }}
            required
            variant="filled"
            sx={textFieldStyle}
          />

          <TextField
            label="Lot Number"
            name="lotNumber"
            value={cardData.lotNumber}
            onChange={handleCardChange}
            required
            variant="filled"
            sx={textFieldStyle}
          />

          <TextField
            label="Section"
            name="section"
            value={cardData.section}
            onChange={handleCardChange}
            variant="filled"
            required
            sx={textFieldStyle}
          />

          <TextField
            label="Lot Owner"
            name="lotOwner"
            value={cardData.lotOwner}
            onChange={handleCardChange}
            variant="filled"
            required
            sx={textFieldStyle}
          />

          <TextField
            label="Lot Card Notes"
            name="lotCardNotes"
            value={cardData.lotCardNotes}
            onChange={handleCardChange}
            multiline
            minRows={4}
            variant="filled"
            sx={{
              ...textFieldStyle,
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
              border: "1px solid #E8AE31",
              "&:hover": {
                backgroundColor:
                  "rgba(175,140,48,0.1)",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleGenerateCard}
            sx={{
              backgroundColor: "#E8AE31",
              color: "white",
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

      {/* INTERNMENT RECORD */}

      <Paper
        sx={{
          p: 4,
          maxWidth: 1000,
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
            mb: 3,
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
            value={recordData.name}
            onChange={handleRecordChange}
            required
            variant="filled"
            sx={{
              ...textFieldStyle,
              gridColumn: "1 / -1",
            }}
          />

          <TextField
            label="Place of Birth"
            name="placeOfBirth"
            value={recordData.placeOfBirth}
            onChange={handleRecordChange}
            variant="filled"
            sx={{
              ...textFieldStyle,
              gridColumn: "1 / -1",
            }}
            placeholder="City, State"
          />

          <TextField
            label="Late Residence (Full Address)"
            name="lateResidence"
            value={recordData.lateResidence}
            onChange={handleRecordChange}
            variant="filled"
            sx={{
              ...textFieldStyle,
              gridColumn: "1 / -1",
            }}
          />

          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={recordData.dateOfBirth}
            onChange={handleRecordChange}
            variant="filled"
            sx={textFieldStyle}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Date of Death"
            name="dateOfDeath"
            type="date"
            value={recordData.dateOfDeath}
            onChange={handleRecordChange}
            required
            variant="filled"
            sx={textFieldStyle}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Sex"
            name="sex"
            value={recordData.sex}
            onChange={handleRecordChange}
            variant="filled"
            sx={textFieldStyle}
          />

          <TextField
            label="Social State"
            name="SocialSate"
            value={recordData.SocialSate}
            onChange={handleRecordChange}
            placeholder="e.g. Married, Divorced"
            variant="filled"
            sx={textFieldStyle}
          />

          <TextField
            label="Cause of Death"
            name="causeOfDeath"
            value={recordData.causeOfDeath}
            onChange={handleRecordChange}
            variant="filled"
            sx={{
              ...textFieldStyle,
              gridColumn: "1 / -1",
            }}
          />

          <TextField
            label="Nearest Relative or Friend"
            name="nearestRelative"
            value={recordData.nearestRelative}
            onChange={handleRecordChange}
            variant="filled"
            sx={textFieldStyle}
          />

          <TextField
            label="Address of Nearest Relative"
            name="relativeAddress"
            value={recordData.relativeAddress}
            onChange={handleRecordChange}
            variant="filled"
            sx={textFieldStyle}
          />

          <TextField
            label="Time and Place of Funeral"
            name="timePlaceFuneral"
            value={recordData.timePlaceFuneral}
            onChange={handleRecordChange}
            variant="filled"
            sx={{
              ...textFieldStyle,
              gridColumn: "1 / -1",
            }}
          />

          <TextField
            label="Inside Dimensions of Vault (L x W x H)"
            name="vaultDimensions"
            value={recordData.vaultDimensions}
            onChange={handleRecordChange}
            variant="filled"
            sx={{
              ...textFieldStyle,
              gridColumn: "1 / -1",
            }}
          />

          <TextField
            label="Funeral Director or Person in Charge"
            name="funeralDirector"
            value={recordData.funeralDirector}
            onChange={handleRecordChange}
            variant="filled"
            sx={{
              ...textFieldStyle,
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
              border: "1px solid #E8AE31",
              "&:hover": {
                backgroundColor:
                  "rgba(175,140,48,0.1)",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleGenerateRecord}
            sx={{
              backgroundColor: "#E8AE31",
              color: "white",
              letterSpacing: "1px",
              "&:hover": {
                backgroundColor: "#E8AE31",
                transform: "scale(1.05)",
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

export default InternmentForms;