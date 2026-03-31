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

{/** Button should handle all actions of adding new residents */}

function ResidentAddButton() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    // collect values and call route here
    handleClose();
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
          <TextField label="First Name*" variant="filled" />
          <TextField label="Middle Name" variant="filled" />
          <TextField label="Last Name*" variant="filled" />
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