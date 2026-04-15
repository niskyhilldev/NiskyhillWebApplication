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
import { fetchSections, fetchLots } from "../api/lotApi";  
import {addResident} from "../api/residentApi";

{/** Button should handle all actions of adding new residents */}

function ResidentAddButton() {
  const [open, setOpen] = useState(false);

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
    setOpen(true);
  };

  const handleClose = () =>{
    setOpen(false);
  };

  // handle input changes
  const handleChange = (e) => {
    const{name, value, type, checked} = e.target;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
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

  //console.log("Selected SID:", form.sid);
  //console.log("Filtered Lots:", filteredLots);

  const handleSave = async() => {
    try{
      // define selected lot based on lot number and partition
      const selectedLot = filteredLots.find(
        (lot) => 
          String(lot.number) === String(form.lid) && 
          String(lot.descriptor || "") === String(form.descriptor || "")
      );

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
      console.error("Error adding resident:", err);
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

      {/* Dialog / Pop-up for input*/}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Resident</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField 
            label="First Name*" 
            variant="filled" 
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />

          <TextField
            label="Middle Name"
            variant="filled"
            name="middleName"
            value={form.middleName}
            onChange={handleChange}
          />

          <TextField
            label="Last Name*"
            variant="filled"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />

          <TextField
            select
            label="Section*"
            name="sid"
            value={form.sid || ""} // ensure string
            onChange={handleChange}
            SelectProps={{ native: true }}
            variant="filled"
          >
            <option value=""></option>
            {sections.map((section) => (
              <option key={section.sid} value={section.sid}>
                {section.name}
              </option>
            ))}
          </TextField>

          <TextField
            select
            label="Lot Number*"
            name="lid"
            value={form.lid || ""} 
            onChange={handleLotChange}
            variant="filled"
            disabled={!form.sid} // disable until section is selected
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            {uniqueLotNumbers.map((lot) => (
              <option key={lot.number} value={lot.number}>
                {lot.number}
              </option>
            ))}
          </TextField>

          {/* ADD PARTITION DROPDOWN HERE */}
          <TextField
            select
            label="Lot Partition"
            name="descriptor"
            value={form.descriptor || ""} 
            onChange={handleChange}
            variant="filled"
            SelectProps={{native: true}}
            disabled={!form.sid || !form.lid || partitionOptions.length === 0} // disable until lot is selected and partitions exist
          >
            <option value=""></option>
            {partitionOptions.map((p, index) => (
              <option key={index} value={p}>
                {p}
              </option>
            ))}
          </TextField>

          <TextField
            label="Date of Birth"
            type="date"
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            variant="filled"
          />

          <TextField
            label="Date of Death"
            type="date"
            name="deathDate"
            value={form.deathDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            variant="filled"
          />

          <TextField
            label="Burial Date"
            type="date"
            name="burialDate"
            value={form.burialDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            variant="filled"
          />

          <TextField
            select
            label="Vessel"
            name="capsule"
            value={form.capsule}
            onChange={handleChange}
            variant="filled"
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            <option value="Urn">Urn</option>
            <option value="Casket">Casket</option>
          </TextField>

          {/* Checkboxes for marker, foundation, publicViewable */}
          <label>
            <input
              type="checkbox"
              name="marker"
              checked={form.marker}
              onChange={handleChange}
            />
            Marker
          </label>

          <label>
            <input
              type="checkbox"
              name="foundation"
              checked={form.foundation}
              onChange={handleChange}
            />
            Foundation
          </label>

          <label>
            <input
              type="checkbox"
              name="publicViewable"
              checked={form.publicViewable}
              onChange={handleChange}
            />
            Public Viewable
          </label>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ResidentAddButton