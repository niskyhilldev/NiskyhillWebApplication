import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import {fetchSections, addLot} from "../api/lotApi";

{/** Button should handle all actions of adding new lots */}

function LotAddButton() {
  const [open, setOpen] = useState(false);
  const[error, setError] = useState("");

  // form state to match dto
  const [formData, setFormData] = useState({
    sid: "",
    number: "",
    descriptor: "",
    owner: "",
  });

  const [sections, setSections] = useState([]);
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
  const resetForm = () =>{
    setFormData({
      sid: "",
      number: "",
      descriptor: "",
      owner: "",
    });
    setError("");
  }

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
    // collect values and save to DB here
    try{
      // clear old errors
      setError("");

      const payload = {
        ...formData,
        sid: Number(formData.sid),
      };

      await addLot(payload);
      console.log("Lot added successfully");
      handleClose();
    } catch(err){
      setError(err.message);
      console.error("Error adding lot:", err);
    }
  };

  return (
    <Box>
      {/* Floating Add Button */}
      <IconButton
        onClick={handleOpen}
        sx={{
          bgcolor: "#af8c30",
          color: "white",
          width: 60,
          height: 60,
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "#8b6f27",
            transform: "scale(1.1)",
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
          border: "1px solid rgba(175, 140, 48, 0.7)",
          boxShadow: "0 0 0 1px rgba(175, 140, 48, 0.25), 0 10px 30px rgba(0,0,0,0.4)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontFamily: "Inria Serif",
            fontSize: "1.8rem",
            letterSpacing: "1.5px",
            color: "#af8c30",
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
              Section*
            </MenuItem>

            {sections.map((section) => (
              <MenuItem key={section.sid} value={section.sid}>
                {section.name}
              </MenuItem>
            ))}
          </TextField>

          {/* LOT NUMBER */}
          <TextField
            placeholder="Lot Number*"
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

          {/* LOT PARTITION */}
          <TextField
            placeholder="Lot Partition*"
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

          {/* OWNER */}
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

          {/* ERROR */}
          {error && (
            <Box
              sx={{
                color: "#ff6b6b",
                fontSize: "0.9rem",
                textAlign: "center",
                mt: 1,
              }}
            >
              {error}
            </Box>
          )}
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
              fontFamily: "Inria Serif",
              border: "1px solid #af8c30",
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
              backgroundColor: "#af8c30",
              color: "white",
              fontFamily: "Inria Serif",
              letterSpacing: "1px",
              "&:hover": {
                backgroundColor: "#8b6f27",
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

