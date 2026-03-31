import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Container
} from '@mui/material';

import LotAddButton from "./LotAddButton";

//Lot JSON for reference
{/** const lot = {
            lid: rowId,
            number: 'lotNumber',
            descriptor: 'lotPartition',
            owner: 'lotOwner',
            sid: 'sectionNumber',)
} */}
 


function LotSearch() {
  
  function performLotSearch(){
    alert("Lot search"); 
  }


  return (
      //headers
      <Container maxWidth="90%">
        <Typography variant="h1" sx={{ m: '50px 0', fontSize: 'xxx-large', color:'white' , fontWeight: 600}}>
          Lots
        </Typography>
        <Typography  align="center" sx={{ fontSize: '1.75rem', mb: 2 , color:'white' , fontWeight: 600}}>
          Search for a Lot
        </Typography>

        {/**Lot search inputs */}
        <Box sx={{ display: "flex", gap: 2 }}>

          {/* Section Dropdown */}
          <FormControl variant="filled">
            <InputLabel 
            sx={{ color: 'white',  // label color when not focused
              "&.Mui-focused": {color: "white", }
              }}>
              Section*
            </InputLabel>
            <Select defaultValue=""
             sx={{ 
                minWidth: 150,
                backgroundColor: "#af8c30",
                "&:hover": { backgroundColor: "#8b6f27" },
                "&.Mui-focused": { backgroundColor: "#8b6f27" }
             }}>
              <MenuItem value="">
                Will Populate
              </MenuItem>
            </Select>
          </FormControl>

          {/* Lot Input */}
          <TextField
            label="Lot"
            variant="filled"
            placeholder="Search lot"
            sx={{
              borderRadius: 1,
              backgroundColor: '#f6e884',   // background when not focused
              "&:hover": {backgroundColor: "#b5ac67"},  // background on hover
              "& .MuiInputBase-input": {color: "#8b6f27"},  // text color when not focused
              "&.Mui-focused .MuiInputBase-input": {color: "#000000"},    // text color when focused
              "& .MuiInputLabel-root": {color: "#8b6f27"},    // label color when not focused
              "& .MuiInputLabel-root.Mui-focused": {color: "#8b6f27"},    // label color when focused
            }}
          />

          {/* Search Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={performLotSearch}
            sx={{backgroundColor:'#af8c30'}}
          >
            Search
          </Button>
          <LotAddButton/>
        </Box>

         {/* Table */}
        <Table sx={{mt:'20px'}}>
          <TableHead
          sx={{backgroundColor:'#af8c30', border: "2px solid #8b6f27"}}>
            <TableRow >
              
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27"}}>Section Name</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27"}}>Lot Number</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27"}}>Lot Partition</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold'}}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody
          sx={{
            backgroundColor: "#074582",     
              "& td": { // all cells in the body
              color: "white",                  
              border: "2px solid #8b6f27",
              fontSize: '20px',
            },
          }}>
            {/** will actually be dynamically filled, just stand in for format */}
            <TableRow >
              <TableCell >ex name</TableCell>
              <TableCell >ex num</TableCell>
              <TableCell >ex part</TableCell>
              <TableCell >Action button</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Container>

      
    )
  }

export default LotSearch