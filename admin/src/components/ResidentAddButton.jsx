import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { fetchSections, fetchLots } from "../api/lotApi";  
import {addResident} from "../api/residentApi";

{/** Button should handle all actions of adding new residents */}

function ResidentAddButton() {
  const [open, setOpen] = useState(false);
  const[error, setError] = useState("");
  const [sections, setSections] = useState([]);
  const [lots, setLots] = useState([]);

  const initialFormState = {
    sid: "",
    lid: "", // lot number NOT unique lot id, to simplify selection and unsure unique dropdown values with multiple partitions
    descriptor: "",
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    deathDate: "",
    burialDate: "",
    capsule: "",
    marker: false,
    foundation: false,
    publicViewable: false,
  };

  const [form, setForm] = useState(initialFormState);

  // fetch data
  useEffect(() => {
    async function loadDropdownData(){
      try{
        // using promise to fetch both sections and lots in parallel
        const [sectionsData, lotsData] = await Promise.all([
          fetchSections(),
          fetchLots(),
        ]);

        setSections(sectionsData);
        setLots(lotsData);
      } catch(err){
        console.error("Error fetching data:", err);
      }
    }

    loadDropdownData();
  }, []);

  // open / close
  const handleOpen = () => {
    setForm(initialFormState); // reset form when opening
    setError("");
    setOpen(true);
  };

  const handleClose = () =>{
    setOpen(false);
    setError("");
  };

  // handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // handle lot change to update partitions
  const handleLotChange = (e) => {
    const number = e.target.value;
    //const selectedLot = lots.find((l) => String(l.lid) === String(lid));

    setForm((prev) => ({
      ...prev,
      lid: number,
      descriptor: "" // reset partition when lot changes
    }));
  };

  // filter lots by section
  const filteredLots = lots.filter(
    (lot) => String(lot.section?.sid) === String(form.sid)
  );

  // console log lot count for checking that lot number is different for each section
  //console.log("Filtered lots count:", filteredLots.length);

  // get unique lot numbers by removing duplicates
  const  uniqueLotNumbers =[
    ...new Map(filteredLots.map((lot) => [lot.number, lot])).values()
  ];

  // partition options for selected lot
  const partitionOptions = [
    ...new Set(
      filteredLots
        .filter((lot) => String(lot.number) === String(form.lid)) // filter to selected lot
        .map((lot) => lot.descriptor)
        .filter(Boolean) // filter out null/undefined/empty
    ).values(),
  ];

  const handleSave = async () => {
    try {
      setError("");

      const selectedLot = filteredLots.find(
        (lot) =>
          String(lot.number) === String(form.lid) &&
          String(lot.descriptor || "") === String(form.descriptor || "")
      );

      // if no lot found
      if(!selectedLot){
        setError("Please select a valid lot and partition");
        return;
      }

      const payload = {
        firstName: form.firstName,
        middleName: form.middleName || null, 
        lastName: form.lastName,
        birthDate: form.birthDate || null, 
        deathDate: form.deathDate || null, 
        burialDate: form.burialDate || null, 
        capsule: form.capsule, 
        marker: form.marker,
        foundation: form.foundation,
        publicViewable: form.publicViewable,
        lid: selectedLot.lid,
        //partition: form.descriptor,
      }

      await addResident(payload);
      console.log("Resident added successfully");
      handleClose();
    } catch (err) {
      setError(err.message);
      console.error("Error adding resident:", err);
    }
  };

  // Shared white field style
  const fieldSx = {
    backgroundColor: "white",
    borderRadius: "6px",
    "& input": { color: "black" },
  };

  return (
    <Box>
      {/* Add Button */}
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
            minWidth: 620,
            border: "1px solid rgba(175, 140, 48, 0.7)",
            boxShadow:
              "0 0 0 1px rgba(175, 140, 48, 0.25), 0 10px 30px rgba(0,0,0,0.4)",
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
          Add New Resident
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: 1,
          }}
        >
          {/* Name row */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
              First Name*
            </Typography>
            <TextField
              placeholder="First Name*"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={fieldSx}
            />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
              Middle Name
            </Typography>
            <TextField
              placeholder="Middle Name"
              name="middleName"
              value={form.middleName}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={fieldSx}
            />
            </Box>

          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
            Last Name*
          </Typography>
            <TextField
              placeholder="Last Name*"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              sx={fieldSx}
            />
            </Box>
          </Box>

          {/* Section */}
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
            Section*
          </Typography>
          <TextField
            select
            name="sid"
            value={form.sid}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            SelectProps={{ displayEmpty: true }}
            sx={{
              backgroundColor: "white",
              borderRadius: "6px",
              "& .MuiSelect-select": {
                color: form.sid ? "black" : "#777",
              },
            }}
          >  
            <MenuItem value="" disabled>Section*</MenuItem>
            {sections.map((section) => (
              <MenuItem key={section.sid} value={section.sid}>
                {section.name}
              </MenuItem>
            ))}
          </TextField>
          </Box>

          {/* Lot + Partition row */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
              Lot #*
            </Typography>
            <TextField
              select
              name="lid"
              value={form.lid}
              onChange={handleLotChange}
              fullWidth
              variant="outlined"
              disabled={!form.sid}
              SelectProps={{ displayEmpty: true }}
              sx={{
                backgroundColor: "white",
                borderRadius: "6px",
                "& .MuiSelect-select": {
                  color: form.lid ? "black" : "#777",
                },
              }}
            >
              <MenuItem value="" disabled>Lot Number*</MenuItem>
              {uniqueLotNumbers.map((lot) => (
                <MenuItem key={lot.number} value={lot.number}>
                  {lot.number}
                </MenuItem>
              ))}
            </TextField>
            </Box>

          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
            Lot Partition*
          </Typography>
            <TextField
              select
              name="descriptor"
              value={form.descriptor}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              disabled={!form.lid || partitionOptions.length === 0}
              SelectProps={{ displayEmpty: true }}
              sx={{
                backgroundColor: "white",
                borderRadius: "6px",
                "& .MuiSelect-select": {
                  color: form.descriptor ? "black" : "#777",
                },
              }}
            >
              <MenuItem value="" disabled>Lot Partition*</MenuItem>
              {partitionOptions.map((p, i) => (
                <MenuItem key={i} value={p}>{p}</MenuItem>
              ))}
            </TextField>
            </Box>
          </Box>

          {/* Dates row */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
                Date of Birth
              </Typography>
              <TextField
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                sx={fieldSx}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
                Date of Death
              </Typography>
              <TextField
                type="date"
                name="deathDate"
                value={form.deathDate}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                sx={fieldSx}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
                Burial Date
              </Typography>
              <TextField
                type="date"
                name="burialDate"
                value={form.burialDate}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                sx={fieldSx}
              />
            </Box>
          </Box>

          {/* Vessel */}
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
            Vessel
          </Typography>
          <TextField
            select
            name="capsule"
            value={form.capsule}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            SelectProps={{ displayEmpty: true }}
            sx={{
              backgroundColor: "white",
              borderRadius: "6px",
              "& .MuiSelect-select": {
                color: form.capsule ? "black" : "#777",
              },
            }}
          >
            <MenuItem value="" disabled>Vessel</MenuItem>
            <MenuItem value="Urn">Urn</MenuItem>
            <MenuItem value="Casket">Casket</MenuItem>
          </TextField>
          </Box>

          {/* Checkboxes */}
          <Box sx={{ display: "flex", gap: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="marker"
                  checked={form.marker}
                  onChange={handleChange}
                  sx={{ color: "#af8c30", "&.Mui-checked": { color: "#af8c30" } }}
                />
              }
              label="Marker"
              sx={{ color: "white" }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="foundation"
                  checked={form.foundation}
                  onChange={handleChange}
                  sx={{ color: "#af8c30", "&.Mui-checked": { color: "#af8c30" } }}
                />
              }
              label="Foundation"
              sx={{ color: "white" }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="publicViewable"
                  checked={form.publicViewable}
                  onChange={handleChange}
                  sx={{ color: "#af8c30", "&.Mui-checked": { color: "#af8c30" } }}
                />
              }
              label="Public Viewable"
              sx={{ color: "white" }}
            />
          </Box>

          {/* Error */}
          {error && (
            <Box sx={{ color: "#ff6b6b", fontSize: "0.9rem", textAlign: "center", mt: 1 }}>
              {error}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button
            onClick={handleClose}
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

export default ResidentAddButton;