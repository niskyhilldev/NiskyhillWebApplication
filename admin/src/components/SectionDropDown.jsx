import { useEffect, useState } from "react";
import { Select, MenuItem, FormControl, InputLabel} from "@mui/material";


//dropdown for selecting a section for searching
function SectionDropdown({sections, value, onChange, error, loading }) {
  return (
    <FormControl variant="filled">
          <InputLabel 
          sx={{ color: 'white',  // label color when not focused
            "&.Mui-focused": {color: "white", }
            }}>
            Section*
          </InputLabel>
          <Select value={value} onChange={onChange} 
            sx={{ 
              minWidth: 150,
              backgroundColor: "#af8c30",
              "&:hover": { backgroundColor: "#8b6f27" },
              "&.Mui-focused": { backgroundColor: "#8b6f27" }
            }}>

            <MenuItem value="">
              Select a section
            </MenuItem>
            
            {/** determins what to display based on state */}
            {loading ? (
              <MenuItem disabled>Loading sections...</MenuItem>
            ) : error ? (
              <MenuItem disabled>{error}</MenuItem>
            ) : (
              sections.map((section) => (
                <MenuItem key={section.sid} value={section.name}>
                  {section.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
  );

}

export default SectionDropdown;