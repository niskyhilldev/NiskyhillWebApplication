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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Resident Details</DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>

          <FormControl fullWidth>
            <InputLabel>Section</InputLabel>
            <Select
              value={formData.sectionName || ""}
              label="Section"
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  sectionName: e.target.value,
                  lotNumber: "",
                  lotDescriptor: ""
                }))
              }
            >
              {sections.map((s) => (
                <MenuItem key={s.id} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Lot Number</InputLabel>
            <Select
              value={formData.lotNumber || ""}
              label="Lot Number"
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  lotNumber: e.target.value,
                  lotDescriptor: ""
                }))
              }
            >
              {filteredLots.map((lot) => (
                <MenuItem key={lot.id} value={lot.number}>
                  {lot.number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Lot Portion</InputLabel>

            <Select
              value={formData.lotDescriptor || ""}
              label="Lot Portion"
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  lotDescriptor: e.target.value
                }))
              }
            >
              {partitions.map((p, index) => (
                <MenuItem key={index} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="First Name"
            value={formData.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            
          />

          <TextField
            label="Middle Name"
            value={formData.middleName || ""}
            onChange={(e) => handleChange("middleName", e.target.value)}
            
          />

          <TextField
            label="Last Name"
            value={formData.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
           
          />

          <TextField
            label="Date of Birth"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.birthDate || ""}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            
          />

          <TextField
            label="Burial Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.burialDate || ""}
            onChange={(e) => handleChange("burialDate", e.target.value)}
           
          />

          <TextField
            label="Date of Death"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.deathDate || ""}
            onChange={(e) => handleChange("dateOfDeath", e.target.value)}
            
          />

          <FormControl fullWidth>
            <InputLabel>Vessel</InputLabel>
            <Select
                value={formData.capsule || ""}
                label="Vessel"
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    capsule: e.target.value
                  }))
                }
              >
              <MenuItem key={"urn"} value={"urn"}>
                {"urn"}
              </MenuItem>
              <MenuItem key={"casket"} value={"casket"}>
                {"casket"}
              </MenuItem>
              <MenuItem key={"other"} value={"other"}>
                {"other"}
              </MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!formData.marker}
                onChange={(e) =>
                  handleChange("marker", e.target.checked)
                }
              />
            }
            label="Marker"
            
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={!!formData.foundation}
                onChange={(e) =>
                  handleChange("foundation", e.target.checked)
                }
              />
            }
            label="Foundation"
            
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={!!formData.publicViewable}
                onChange={(e) =>
                  handleChange("public", e.target.checked)
                }
              />
            }
            label="Public"
            
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

export default ResidentEditButton;