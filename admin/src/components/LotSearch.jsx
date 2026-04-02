import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Container
} from '@mui/material';

import LotAddButton from "./LotAddButton";

import SectionDropdown from "./SectionDropDown";
import { fetchSections, performLotSearch } from "../api/lotApi";


//Lot JSON for reference
{/** const lot = {
            lid: rowId,
            number: 'lotNumber',
            descriptor: 'lotPartition',
            owner: 'lotOwner',
            sid: 'sectionNumber',)
} */}
 


function LotSearch() {



  //states for section dropdown
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [dropError, setDropError] = useState("");
  const [dropLoading, setDropLoading] = useState(true);

  //State for Lot Text box
  const [lotTextValue, setLotTextValue] = useState("");

  //States for search results
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null); 
  const [searchLoading, setSearchLoading] = useState(false);
 
  //populate dropdown on page load
  useEffect(() => {
    // fetch data in async function
    async function loadSections() {
      try {
        setDropError("");

        //fetch data
        const data = await fetchSections();

        if (data.length === 0) {
          setDropError("No sections available.");
        } else {
          setSections(data);//load data in drop
        }

      } catch (err) {
        console.error(err);
        setDropError("Failed to fetch sections.");
      } finally {
        setDropLoading(false);
      }
    }
    loadSections();
  }, []); // empty brackets cause effect to run on page render
    

  //on search button press
  async function activateLotSearch(){
    try {  
      setSearchError(null); //remove error from previous search
      setSearchLoading(true); 

      const result = await performLotSearch(lotTextValue, selectedSection);

      setSearchResults(result);
    } catch (error) {
      setSearchError(error.message || "Unknown error occurred");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);    
    }
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
          <SectionDropdown 
            sections={sections}
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            error={dropError}
            loading={dropLoading}
          />

          {/* Lot Input */}
          <TextField
            label="Lot"
            variant="filled"
            value={lotTextValue}
            placeholder="Search lot"
            onChange={(event) => setLotTextValue(event.target.value)}
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
            onClick={activateLotSearch}
            sx={{backgroundColor:'#af8c30'}}
          >
            Search
          </Button>
          <LotAddButton/>
        </Box>
        
        {/**If search fails display error */}
        {searchError && (
          <div style={{ color: "red", marginBottom: "16px" }}>
            Error: {searchError}
          </div>
        )}
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
              "& td": {
                color: "white",
                border: "2px solid #8b6f27",
                fontSize: "20px",
              },
            }}
          >

            {searchLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                    Loading...
                </TableCell>
              </TableRow>
            ) : searchResults.length === 0 && !searchError ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No results
                </TableCell>
              </TableRow>
            ) : (
              searchResults.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.lot.section.name}</TableCell>
                  <TableCell>{row.lot.number}</TableCell>
                  <TableCell>{row.lot.descriptor}</TableCell>
                  <TableCell>
                    {/* temp action button */}
                    <Button variant="contained" size="small">
                      Temp button
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Container>

      
    )
  }

export default LotSearch