import { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteResident } from "../api/residentApi";
import { deleteLot } from "../api/lotApi";


function DeleteButton({ id, onDelete, type}) { //rid is the resident the button is for, onDelete is a passed function which will remove the row from view in the parent
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if(type === 'resident'){
            const confirmDelete = window.confirm(
            "Are you sure you want to delete this resident?"
            );
            if (!confirmDelete) return;

            try {
                setLoading(true);
                await deleteResident(id); 
                // call parent's delete function
                onDelete(id);
            } catch (error) {
                console.error("Delete failed:", error);
                alert("Failed to delete resident");
            } finally {
                setLoading(false);
            }
        }
        else if(type === 'lot'){
            const confirmDelete = window.confirm(
            "Are you sure you want to delete this lot?"
            );
            if (!confirmDelete) return;

            try {
                setLoading(true);
                await deleteLot(id); 
                // call parent's delete function
                onDelete(id);
            } catch (error) {
                console.error("Delete failed:", error);
                alert("Failed to delete lot");
            } finally {
                setLoading(false);
            }
        }

    }
        
    return(

        <IconButton
        onClick={handleDelete}
        sx={{
          bgcolor: '#D9D9D9',
          color: '#0D2543',
          width: 60,
          height: 20,
          borderRadius: 1,
          mr: "10px",
          my: "4px",
          "&:hover": { bgcolor: "#bfbfbf" },
        }}
        disabled={loading}
      >
        <DeleteIcon />
      </IconButton>
    )
}

export default DeleteButton