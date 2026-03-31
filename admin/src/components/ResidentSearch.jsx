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

import ResidentAddButton from "./ResidentAddButton";

  function ResidentSearch() {
  
  function performResidentSearch(){
    alert("Lot search"); 
  }


  return (
      //headers
      <Container maxWidth="90%">
        <Typography  sx={{ m: '50px 0', fontSize: 'xxx-large', color:'white' , fontWeight: 600}}>
          Residents
        </Typography>
        <Typography  align="center" sx={{ fontSize: '1.75rem', mb: 2 , color:'white' , fontWeight: 600}}>
          Search for a Resident
        </Typography>

        {/** search by Last Name */}

        <Box sx={{mb: '40px' }}>
            <Box sx={{ display: "flex", gap: 2 }}>
            
            <Typography  sx={{ display: "flex", alignItems: 'center', justifyContent: 'center', color:'white' , fontWeight: 600 ,fontSize: '1.75rem',}}>
                By Name:
            </Typography>
            {/* Lot Input */}
            <TextField
                label="Name"
                variant="filled"
                placeholder="Search Last Name"
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
                onClick={performResidentSearch}
                sx={{backgroundColor:'#af8c30'}}
            >
                Search
            </Button>
            <ResidentAddButton/>
            </Box>
            <Table sx={{mt:'20px'}}>
            <TableHead
            sx={{backgroundColor:'#af8c30', border: "2px solid #8b6f27"}}>
                <TableRow >
                
                <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27"}}>First Name</TableCell>
                <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27"}}>Middle Name</TableCell>
                <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27"}}>Last Name</TableCell>
                <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27"}}>Burial Date</TableCell>
                <TableCell sx={{fontSize: '20px', fontWeight: 'bold'}}>Action</TableCell>
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
                <TableCell >ex F name</TableCell>
                <TableCell >ex M name</TableCell>
                <TableCell >ex L name</TableCell>
                <TableCell >ex date</TableCell>
                <TableCell >ex partition</TableCell>
                </TableRow>
            </TableBody>
            </Table>
        </Box>








        {/** Search by lot */}


        {/**Lot search inputs */}
        <Box sx={{ display: "flex", gap: 2 }}>
           
        <Typography  sx={{  display: "flex", alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', display: "flex", alignItems: 'center', justifyContent: 'center', color:'white' , fontWeight: 600}}>
            By Lot:
        </Typography>
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
            onClick={performResidentSearch}
            sx={{backgroundColor:'#af8c30'}}
          >
            Search
          </Button>
          <ResidentAddButton/>
        </Box>

         {/* Table */}
        <Table sx={{mt:'20px'}}>
          <TableHead
          sx={{backgroundColor:'#af8c30', border: "2px solid #8b6f27"}}>
            <TableRow >
              
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27"}}>First Name</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27"}}>Middle Name</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27"}}>Last Name</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27"}}>Burial Date</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27"}}>Section</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27"}}>Lot</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27"}}>Descriptor</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold'}}>Action</TableCell>
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
              <TableCell >ex F name</TableCell>
              <TableCell >ex M name</TableCell>
              <TableCell >ex L name</TableCell>
              <TableCell >ex date</TableCell>
              <TableCell >ex partition</TableCell>
              <TableCell >ex lot</TableCell>
              <TableCell >ex desc</TableCell>
              <TableCell >action buttons</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Container>

      
    )
  }


export default ResidentSearch