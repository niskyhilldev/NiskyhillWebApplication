import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,

} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { fetchSections} from "../api/lotApi";  
import { updateLot } from "../api/lotApi";

function LotEditButton({lot, onSave}) {

  //state for popup
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
   
  return (
    // button itself
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          bgcolor: '#D9D9D9',
          color: '#0D2543',
          width: 60,
          height: 20,
          borderRadius: "4px",
          //boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: '#bfbfbf',
           
          },
        }}
      >
        <EditIcon />
      
      </IconButton>
       {/**dialog which opens when button is pressed */}
      <LotEditDialog
        open={open}
        onClose={handleClose}
        lot={lot}
        onSave={onSave}
      />
    </>
  );
}

// created as own function incase we want to componentize and use somewhere else
function LotEditDialog({ open, onClose, lot, onSave,}) {
  //set blank data to avoid crash on data access (rather than using null)
  const [formData, setFormData] = useState({
    sectionName: "",
    lotNumber: "",
    lotDescriptor: "",
    rid: null
  });
  const [savedFormData, setSavedFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  //for editable dropdowns
  const [sections, setSections] = useState([]);
  
  //set initial data to the rows data
  useEffect(() => {
    if (open && lot) {
        setFormData({
       ...lot,
      sectionName:lot?.section?.name || "",
      sid: lot?.section.sid || "",})
    }
    }, [open]);

useEffect(() => {
    console.log("formData updated:", formData);
    }, [formData]);


  //use effects to set each of the 3 dropdowns
  useEffect(() => {
    async function loadSections() {
      const data = await fetchSections();
       setSections(data);
    }
    loadSections();
  }, []);




  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
     
      // build DTO to send to backend function
      const updateDTO = {
        lid: formData.lid,
        number: formData.number,
        descriptor: formData.descriptor,
        owner: formData.owner,
        sid: formData.sid
      };

      // send to parent / API
      console.log(updateDTO);
      await updateLot(updateDTO);
      //await updateResident(updateDTO);

      onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update lot");
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;

  const fieldSx = {
    backgroundColor: "white",
    borderRadius: "6px",
    "& input": { color: "black" },
  };

  const selectSx = {
    backgroundColor: "white",
    borderRadius: "6px",
    "& .MuiSelect-select": { color: "black" },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          backgroundColor: "#0d2543",
          color: "white",
          p: 1,
          minWidth: 450,
          border: "1px solid rgba(175, 140, 48, 0.7)",
          boxShadow: "0 0 0 1px rgba(175, 140, 48, 0.25), 0 10px 30px rgba(0,0,0,0.4)",
        },
      }}
    >
      <DialogTitle sx={{
        textAlign: "center",
        fontFamily: "Inria Serif",
        fontSize: "1.8rem",
        letterSpacing: "1.5px",
        color: "#af8c30",
      }}>
        Edit Lot
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>

        {/* Section */}
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
          Section*
        </Typography>
        <TextField
          select fullWidth variant="outlined"
          SelectProps={{ displayEmpty: true }}
          value={formData.sid || ""}
          onChange={(e) => {
            const sid = e.target.value;
            const section = sections.find(s => s.sid === sid);
            setFormData(prev => ({ ...prev, sid, sectionName: section?.name || "" }));
          }}
          sx={selectSx}
        >
          <MenuItem value="" disabled>Section</MenuItem>
          {sections.map((s) => (
            <MenuItem key={s.sid} value={s.sid}>{s.name}</MenuItem>
          ))}
        </TextField>
        </Box>

        {/* Lot Number */}
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
          Lot #*
        </Typography>
        <TextField
          placeholder="Lot Number" fullWidth variant="outlined"
          value={formData.number || ""}
          onChange={(e) => handleChange("number", e.target.value)}
          sx={fieldSx}
        />
        </Box>

        {/* Lot Partition */}
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
          Lot Partition*
        </Typography>
        <TextField
          placeholder="Lot Partition" fullWidth variant="outlined"
          value={formData.descriptor || ""}
          onChange={(e) => handleChange("descriptor", e.target.value)}
          sx={fieldSx}
        />
        </Box>

        {/* Owner */}
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
          Owner
        </Typography>
        <TextField
          placeholder="Owner" fullWidth variant="outlined"
          value={formData.owner || ""}
          onChange={(e) => handleChange("owner", e.target.value)}
          sx={fieldSx}
        />
        </Box>

      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "white",
            fontFamily: "Inria Serif",
            border: "1px solid #af8c30",
            "&:hover": { backgroundColor: "rgba(175,140,48,0.1)" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          sx={{
            backgroundColor: "#af8c30",
            color: "white",
            fontFamily: "Inria Serif",
            letterSpacing: "1px",
            "&:hover": { backgroundColor: "#8b6f27", transform: "scale(1.05)" },
          }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LotEditButton;