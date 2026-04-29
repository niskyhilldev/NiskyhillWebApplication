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
  Checkbox, 
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,

} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { fetchSections, fetchLots, getLotInfo } from "../api/lotApi";  
import { updateResident } from "../api/residentApi";

function ResidentEditButton({ resident, onSave, isFlattened }) {

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
      <ResidentEditDialog
        open={open}
        onClose={handleClose}
        resident={resident}
        onSave={onSave}
        isFlattened = {isFlattened}
      />
    </>
  );
}

// created as own function incase we want to componentize and use somewhere else
function ResidentEditDialog({ open, onClose, resident, onSave, isFlattened }) {
  //set blank data to avoid crash on data access (rather than using null)
  const [formData, setFormData] = useState({
    sectionName: "",
    lotNumber: "",
    lotDescriptor: "",
    rid: null
  });
  const [loading, setLoading] = useState(false);

  //for editable dropdowns
  const [sections, setSections] = useState([]);
  const [lots, setLots] = useState([]);
  //portions doesnt need a state as its only needed after the other two are selected
  

  useEffect(() => {
    if (resident) {
      setFormData(resident);
    }

    //if the data is not flattened, form data must be changed to accomodate
    if(!isFlattened){
      setFormData({
       ...resident,
      sectionName: resident.lot?.section?.name || "",
      lotNumber: resident.lot?.number || "",
      lotDescriptor: resident.lot?.descriptor || "",})
    }
  }, [resident]);


  //use effects to set each of the 3 dropdowns
  useEffect(() => {
    async function loadSections() {
      const data = await fetchSections();
      setSections(data);
    }
    loadSections();
  }, []);

 useEffect(() => {
    async function loadAllLots() {
      const data = await fetchLots();
      setLots(data);
    }

    loadAllLots();
  }, []);


  const filteredLots = Array.from(
  new Map(
    lots
      .filter(lot => lot.section?.name === formData.sectionName)
      .map(lot => [lot.number, lot])
  ).values()
);

  //get the selected lot to obtain available partiitons
  const selectedLot = filteredLots.filter(
    (lot) => String(lot.number) === String(formData.lotNumber)
  );

  const partitions = Array.from(
  new Set([
    formData.lotDescriptor,
    ...(selectedLot ?? [])
      .map(lot => lot.descriptor)
      .filter(Boolean)
  ])
);


  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      let lid = null;

      console.log(formData);
      // only fetch lid if all fields exist to prevent error
      if (
        formData.sectionName &&
        formData.lotNumber &&
        formData.lotDescriptor
      ) {
        const lotInfo = await getLotInfo(
          formData.sectionName,
          formData.lotNumber,
          formData.lotDescriptor
        );
        lid = lotInfo?.lid;
      }
      
      // build DTO to send to backend function
      const updateDTO = {
        rid: formData.rid,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        deathDate: formData.deathDate,
        burialDate: formData.burialDate,
        marker: formData.marker,
        foundation: formData.foundation,
        publicViewable: formData.publicViewable,
        capsule: formData.capsule,
        lid: lid
      };

      // send to parent / API
      console.log(updateDTO);
      await updateResident(updateDTO);

      onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update resident");
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;

  // field styling
  const fieldSx = {
    backgroundColor: "white",
    borderRadius: "6px",
    "& input": { color: "black" },   
  };

  // dropdown styling
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
          minWidth: 620,
          border: "1px solid #E8AE31",
          boxShadow: "0 0 0 1px rgba(175, 140, 48, 0.25), 0 10px 30px rgba(0,0,0,0.4)",
        },
      }}
    >
      <DialogTitle sx={{
        textAlign: "center",
        fontFamily: "Inria Serif",
        fontWeight: "600",
        fontSize: "1.8rem",
        letterSpacing: "1.5px",
        color: "white",
      }}>
        Edit Resident
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>

        {/* Section / Lot / Partition row */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
              Section*
            </Typography>
          <TextField
            select fullWidth variant="outlined"
            SelectProps={{ displayEmpty: true }}
            value={formData.sectionName || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, sectionName: e.target.value, lotNumber: "", lotDescriptor: "" }))}
            sx={selectSx}
          >
            <MenuItem value="" disabled>Section</MenuItem>
            {sections.map((s) => (
              <MenuItem key={s.id} value={s.name}>{s.name}</MenuItem>
            ))}
          </TextField>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
            Lot #*
          </Typography>
          <TextField
            select fullWidth variant="outlined"
            SelectProps={{ displayEmpty: true }}
            value={formData.lotNumber || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, lotNumber: e.target.value, lotDescriptor: "" }))}
            sx={selectSx}
          >
            <MenuItem value="" disabled>Lot Number</MenuItem>
            {filteredLots.map((lot) => (
              <MenuItem key={lot.id} value={lot.number}>{lot.number}</MenuItem>
            ))}
          </TextField>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
             Lot Partition*
          </Typography>
          <TextField
            select fullWidth variant="outlined"
            SelectProps={{ displayEmpty: true }}
            value={formData.lotDescriptor || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, lotDescriptor: e.target.value }))}
            sx={selectSx}
          >
            <MenuItem value="" disabled>Lot Partition</MenuItem>
            {partitions.map((p, i) => (
              <MenuItem key={i} value={p}>{p}</MenuItem>
            ))}
          </TextField>
          </Box>
        </Box>

        {/* Name row */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
            First Name*
          </Typography>
          <TextField placeholder="First Name" fullWidth variant="outlined"
            value={formData.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            sx={fieldSx}
          />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
            Middle Name
          </Typography>
          <TextField placeholder="Middle Name" fullWidth variant="outlined"
            value={formData.middleName || ""}
            onChange={(e) => handleChange("middleName", e.target.value)}
            sx={fieldSx}
          />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
            Last Name*
          </Typography>
          <TextField placeholder="Last Name" fullWidth variant="outlined"
            value={formData.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            sx={fieldSx}
          />
          </Box>
      </Box>

        {/* Dates row */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
              Date of Birth
            </Typography>
            <TextField type="date" fullWidth variant="outlined"
              value={formData.birthDate || ""}
              onChange={(e) => handleChange("birthDate", e.target.value)}
              sx={fieldSx}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
              Date of Death
            </Typography>
            <TextField type="date" fullWidth variant="outlined"
              value={formData.deathDate || ""}
              onChange={(e) => handleChange("deathDate", e.target.value)}
              sx={fieldSx}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography sx={{ color: "#white", fontSize: "0.85rem", mb: 0.5, ml: 0.5 }}>
              Burial Date
            </Typography>
            <TextField type="date" fullWidth variant="outlined"
              value={formData.burialDate || ""}
              onChange={(e) => handleChange("burialDate", e.target.value)}
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
          select fullWidth variant="outlined"
          SelectProps={{ displayEmpty: true }}
          value={formData.capsule || ""}
          onChange={(e) => setFormData(prev => ({ ...prev, capsule: e.target.value }))}
          sx={selectSx}
        >
          <MenuItem value="" disabled>Vessel</MenuItem>
          <MenuItem value="urn">Urn</MenuItem>
          <MenuItem value="casket">Casket</MenuItem>
        </TextField>
        </Box>

        {/* Checkboxes */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {[
            { field: "marker", label: "Marker" },
            { field: "foundation", label: "Foundation" },
            { field: "publicViewable", label: "Public Viewable" },
          ].map(({ field, label }) => (
            <FormControlLabel
              key={field}
              control={
                <Checkbox
                  checked={!!formData[field]}
                  onChange={(e) => handleChange(field, e.target.checked)}
                  sx={{ color: "#E8AE31", "&.Mui-checked": { color: "#E8AE31" } }}
                />
              }
              label={label}
              sx={{ color: "white" }}
            />
          ))}
        </Box>

      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "white",
            //fontFamily: "Inria Serif",
            border: "1px solid #E8AE31",
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
            backgroundColor: "#E8AE31",
            color: "white",
            //fontFamily: "Inria Serif",
            letterSpacing: "1px",
            "&:hover": { backgroundColor: "#E8AE31", transform: "scale(1.05)" },
          }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ResidentEditButton;