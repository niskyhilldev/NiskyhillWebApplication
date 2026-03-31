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

{/** Button should handle all actions of adding new lots */}



function LotAddButton() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    // collect values and save to DB here
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

      {/** Dialog / Pop-up  for input*/}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Lot</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField label="Section*" variant="filled" />
          <TextField label="Lot Number*" variant="filled" />
          <TextField label="Lot Partition*" variant="filled" />
          <TextField label="Owner" variant="filled" />
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

