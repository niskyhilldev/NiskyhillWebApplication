import { useEffect, useState } from "react";
import { Select, MenuItem, FormControl, InputLabel} from "@mui/material";


//dropdown for selecting a section for searching
function SectionDropdown({sections, value, onChange, error, loading }) {
  return (
    <FormControl variant="standard" sx={{ minWidth: 150 }}>

      <Select
        value={value}
        onChange={onChange}
        disableUnderline
        sx={{
          height: 40,
          backgroundColor: "#D9D9D9",
          transition: "all 0.2s ease",
          color: "#0D2543",
          borderRadius:"4px",
          "&:hover": {
            bgcolor: "#bfbfbf",
          },
          "& .MuiSelect-select": {
            height: 40,
            display: "flex",
            alignItems: "center",
            padding: 0,
            px: 1,
          },
        }}
      >

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