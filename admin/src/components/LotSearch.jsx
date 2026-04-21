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
  Container,
  Pagination
} from '@mui/material';

import LotAddButton from "./LotAddButton";
import SectionDropdown from "./SectionDropDown";
import { fetchSections, performLotSearch } from "../api/lotApi";
import DeleteButton from "./DeleteButton";
import LotEditButton from "./LotEditButton";
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
  
  //states for Search by Lot pages
  const [lotPage, setLotPage] = useState(0);
  const [rowsPerLotPage, setRowsPerLotPage] = useState(20);

  //determines which rows should be displayed
  const paginatedLotResults = searchResults.slice(
    lotPage * rowsPerLotPage,
    lotPage * rowsPerLotPage + rowsPerLotPage
  );

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
      //flatten down to just lot, other info isnt needed
      const cutResults = result.map((row) => (
        row = row.lot
      ))

      setSearchResults( cutResults);
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
              
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27", py: 0}}>Section Name</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27", py: 0}}>Lot Number</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27", py: 0}}>Lot Partition</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold', py: 0}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              backgroundColor: "#074582",
              "& td": {
                color: "white",
                border: "2px solid #8b6f27",
                fontSize: "15px",
                py: 0
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
              paginatedLotResults.map((row) => (
                
                <TableRow key={row.lid}>
                 <TableCell>{row.sectionName ?? row.section?.name}</TableCell>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.descriptor}</TableCell>
                  <TableCell>
                    {/* temp action button */}
                    <DeleteButton
                       id={row.lid}
                       type='lot'
                       //onDelete removes the requested resident from the rendered results
                       onDelete={(lid) => {
                        //remove resident from both search results, as to not cause a conflict
                        setSearchResults((prev) => 
                          prev.filter((r) => String(r.lid) !== String(lid))
                        );
                      }}
                    />

                    <LotEditButton
                      lot={row}
                      onSave={(updatedLot) => {
                        setSearchResults((prev) =>
                          prev.map((l) =>
                            String(l.lid) === String(updatedLot.lid)
                              ? updatedLot
                              : l
                          )
                        );

                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/**center pagination*/}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
            alignItems: 'center'
          }}
        >
          <Pagination 
            //pages are annoying and started at 1, not 0, so page must be one greater than the chosen page
            //and let lot page must be 1 less than page, as pagination starts at 1
            count={Math.ceil(searchResults.length / rowsPerLotPage)}
            page={lotPage + 1}
            onChange={(e, value) => setLotPage(value - 1)}
            sx={{
              backgroundColor: "#074582",
              color: "white",

              "& .MuiPagination-selectLabel": {
                color: "white",
              },

              "& .MuiPaginationItem-root": {
                color: "white",
              },
              "& .Mui-selected": {
                backgroundColor: "#af8c30",
                color: '#f6e884',
              },

              "& .MuiSvgIcon-root": {
                color: "#af8c30",
              },
                border: "2px solid #8b6f27"
            }}
          />
        </Box>
      </Container>

      
    )
  }

export default LotSearch