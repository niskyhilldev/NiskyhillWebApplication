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
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import fetchSections from "../api/lotApi";

{/** Button should handle all actions of adding new lots */}

function LotAddButton() {
  const [open, setOpen] = useState(false);
  
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // handle form changes
  const handleChange = (e) => {
    const{name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  // send to backend
  const handleSave = async () => {
    // collect values and save to DB here
    try{
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        sid: Number(formData.sid),
      };

      await axios.post(
        `${API_BASE_URL}/lots/add`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Lot added successfully");
      handleClose();
    } catch(err){
      console.error("Error adding lot:", err);
    }
  };

  return (
    <Box>
      {/* Actual button */}
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
        <AddIcon />
      </IconButton>

      {/** Dialog / Pop-up  for input*/}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Lot</DialogTitle>
        <DialogContent sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pt: 1,
          minWidth: 300,}}>

          <TextField 
            select
            label="Section*"
            name="sid"
            value={formData.sid}
            onChange={handleChange}
            SelectProps={{ native: true }}
            variant="filled"
          >
            <option value=""></option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </TextField>

          <TextField
            label="Lot Number*" 
            name="number"
            value={formData.number}
            onChange={handleChange}
            variant="filled"
          />

          <TextField
            label="Lot Partition*"
            name="descriptor"
            value={formData.descriptor}
            onChange={handleChange}
            variant="filled"
          />

          <TextField
            label="Owner"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            variant="filled"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LotAddButton

