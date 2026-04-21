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
          bgcolor: "#af8c30",
          color: "white",
          width: 60,
          height: 60,
          borderRadius: 1,
          "&:hover": { bgcolor: "#8b6f27" },
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Lot Details</DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>

          <FormControl fullWidth>
            <InputLabel>Section</InputLabel>
            <Select
                value={formData.sid || ""}
                onChange={(e) => {
                    const sid = e.target.value;
                    const section = sections.find(s => s.sid === sid);

                    setFormData(prev => ({
                    ...prev,
                    sid,
                    sectionName: section?.name || ""
                    }));
                }}
                >
                {sections.map((s) => (
                    <MenuItem key={s.sid} value={s.sid}>
                    {s.name}
                    </MenuItem>
                ))}
                </Select>
          </FormControl>

           <TextField
            label="Lot Number"
          
            InputLabelProps={{ shrink: true }}
            value={formData.number || ""}
            onChange={(e) => handleChange("number", e.target.value)}
            
          />

          
           <TextField
            label="Lot Portion"
          
            InputLabelProps={{ shrink: true }}
            value={formData.descriptor || ""}
            onChange={(e) => handleChange("descriptor", e.target.value)}
           
          />
         
          <TextField
            label="Lot Owner"
          
            InputLabelProps={{ shrink: true }}
            value={formData.owner || ""}
            onChange={(e) => handleChange("owner", e.target.value)}
         
          />


        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LotEditButton;