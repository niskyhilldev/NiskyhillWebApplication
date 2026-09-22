import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box,
        TextField,
        Button,
        IconButton,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        MenuItem,
        Typography,
        Checkbox,
        FormControlLabel, } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import {fetchSections, addLot} from "../api/lotApi";
import NotificationSnackbar from "./NotificationSnackBar";

{/** Button should handle all actions of adding new lots */}

function LotAddButton() {
  const [open, setOpen] = useState(false);
  const[error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // form state to match dto
  const [formData, setFormData] = useState({
    sid: "",
    number: "",
    descriptor: "",
    owner: "",
  });

  const [generateCertificate, setGenerateCertificate] = useState(false);
  const [sections, setSections] = useState([]);
  const navigate = useNavigate();

  // fetch sections for dropdown
  useEffect(() => {
    // fetch data in async function
    async function loadSections() {
      try {
        //setDropError("");

        //fetch data
        const data = await fetchSections();

        if (data.length === 0) {
          //setDropError("No sections available.");
        } else {
          setSections(data);//load data in drop
        }

      } catch (err) {
        console.error(err);
        //setDropError("Failed to fetch sections.");
      } finally {
        //setDropLoading(false);
      }
    }
    loadSections();
  }, []);

  // reset form function
  const resetForm = () => {
    setFormData({
      sid: "",
      number: "",
      descriptor: "",
      owner: "",
    });

    setGenerateCertificate(false);
    setError("");
  };

  const handleOpen = () => {
    setOpen(true);
    resetForm();
  }

  const handleClose = () => {
    setOpen(false);
    resetForm();
  }

  // handle form changes
  const handleChange = (e) => {
    const{name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  // send to backend
  const handleSave = async () => {
  try {
    // Clear old messages
    setError("");
    setSuccess("");

    const payload = {
      ...formData,
      sid: Number(formData.sid),
    };

      const newLot = await addLot(payload);

      console.log("Lot added successfully:", newLot);

      handleClose();

      if (generateCertificate) {
        navigate(`/admin/lots/${newLot.lid}/certificate`);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error adding lot:", err);
    }
  };

  return (

    
    <Box>

      <NotificationSnackbar
        //converts search error to boolean, so if theres an error pop up, then remove it
          open={!!error}
          message={error}
          severity="error"
          onClose={() => setError(null)}
        />
      <NotificationSnackbar
        open={!!success}
        message={success}
        severity="success"
        onClose={() => setSuccess("")}
      />
      {/* Floating Add Button */}
      <IconButton
        onClick={handleOpen}
        sx={{
          bgcolor: '#D9D9D9',
          color: '#0D2543',
          width: 100,
          height: 40,
          borderRadius: "4px",
          //boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: '#bfbfbf',
           
          },
        }}
      >
        <AddIcon />
      </IconButton>

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            backgroundColor: "#0d2543",
            color: "white",
            p: 1,
            minWidth: 350,
          border: "1px solid #E8AE31",
          boxShadow: "0 0 0 1px rgba(175, 140, 48, 0.25), 0 10px 30px rgba(0,0,0,0.4)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontFamily: "Inria Serif",
            fontWeight: "600",
            fontSize: "1.8rem",
            letterSpacing: "1.5px",
            color: "white",
          }}
        >
          Add a New Lot
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: 1,
          }}
        >
          {/* SECTION DROPDOWN */}
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
            Section*
          </Typography>
          <TextField
            select
            name="sid"
            value={formData.sid}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            SelectProps={{displayEmpty: true}}
            sx={{
              backgroundColor: "white",
              borderRadius: "6px",
              "& .MuiSelect-select": {
                color: formData.sid ? "black" : "#777",
              },
            }}
          >
            <MenuItem value="" disabled>
              Section
            </MenuItem>

            {sections.map((section) => (
              <MenuItem key={section.sid} value={section.sid}>
                {section.name}
              </MenuItem>
            ))}
          </TextField>
          </Box>

          {/* LOT NUMBER */}
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
            Lot #*
          </Typography>
          <TextField
            placeholder="Lot Number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: "white",
              borderRadius: "6px",
              "& input": {
                color: "black",
              },
            }}
          />
          </Box>

          {/* LOT PARTITION */}
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
            Lot Partition*
          </Typography>
          <TextField
            placeholder="Lot Partition"
            name="descriptor"
            value={formData.descriptor}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: "white",
              borderRadius: "6px",
              "& input": {
                color: "black",
              },
            }}
          />
          </Box>

          {/* OWNER */}
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
            Owner
          </Typography>
          <TextField
            placeholder="Owner"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: "white",
              borderRadius: "6px",
              "& input": {
                color: "black",
              },
            }}
          />
          </Box>
          
          <FormControlLabel
            control={
              <Checkbox
                checked={generateCertificate}
                onChange={(e) => setGenerateCertificate(e.target.checked)}
                sx={{
                  color: "#D9D9D9",
                  "&.Mui-checked": {
                    color: "#E8AE31",
                  },
                }}
              />
            }
            label="Generate Certificate of Ownership"
            sx={{
              color: "white",
              mt: 1,
            }}
          />

         
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "space-between",
            px: 3,
            pb: 2,
          }}
        >
          <Button
            onClick={handleClose}
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
            onClick={handleSave}
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
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LotAddButton

