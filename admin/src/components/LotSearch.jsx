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
      <Box sx={{ width: "100vw" }}>
        <Typography variant="h1" sx={{ m: '50px 0', fontSize: '48px', color:'white' , fontWeight: 600, backgroundColor: '#E8AE31', padding: '15px'}}>
          LOTS
        </Typography>
        <Typography  align="center" sx={{ fontSize: '36px', mb: 2 , color:'#0D2543' , fontWeight: 700}}>
          Search for a Lot
        </Typography>

        {/**Lot search inputs */}
        <Box sx={{ display: "flex", gap: 2, height: '40px' }}>
          <Box
            sx={{display: "flex",alignItems: "center",ml: "20px",height: "100%"}}
          >
            <Typography
              sx={{
                fontSize: "28px",
                color: '#0D2543',
                fontWeight: 600,
              }}
            >
              Section:
            </Typography>
          </Box>
          {/* Section Dropdown */}
          <SectionDropdown 
            sections={sections}
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            error={dropError}
            loading={dropLoading}
          />
          <Typography
              sx={{
                fontSize: "28px",
                color: '#0D2543',
                fontWeight: 600,
              }}
            >
              Lot:
            </Typography>
          {/* Lot Input */}
          <TextField
            //label="Lot"
            variant="outlined"
            size="small"
            value={lotTextValue}
            onChange={(event) => setLotTextValue(event.target.value)}
            sx={{
              
              "& .MuiOutlinedInput-root": {
                height: 40,
                backgroundColor: "#D9D9D9",

                "&:hover": {
                  backgroundColor: "#bfbfbf",
                },

                "&.Mui-focused": {
                  backgroundColor: "#bfbfbf",
                },

                
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  borderColor: "#0D2543",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0D2543",
                },
              },

       
              "& .MuiOutlinedInput-input": {
                color: "#0D2543",
                padding: "10px 14px",
              },

      
              "& .MuiInputLabel-root": {
                color: "#0D2543",
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#0D2543",
              },
            }}
          />

          {/* Search Button */}
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={activateLotSearch}
            sx={{
              bgcolor: '#D9D9D9',
              color: '#0D2543',
              width: 100,
              height: 40,
              fontWeight:600,
              borderRadius: "4px",
              //boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: '#bfbfbf',
              },
            }}
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
          sx={{backgroundColor:'#0D2543', border: "2px solid #0D2543"}}>
            <TableRow >
              
              <TableCell sx={{color: '#fbfbfb', fontSize: '20px', fontWeight: 'bold', py: 0}}>Section Name</TableCell>
              <TableCell sx={{color: '#fbfbfb', fontSize: '20px', fontWeight: 'bold', py: 0}}>Lot Number</TableCell>
              <TableCell sx={{color: '#fbfbfb', fontSize: '20px', fontWeight: 'bold', py: 0}}>Lot Partition</TableCell>
              <TableCell sx={{color: '#fbfbfb', fontSize: '20px', fontWeight: 'bold', py: 0}}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              backgroundColor: '#fbfbfb',
              "& td": {
                color: '#0D2543',
                fontSize: "15px",
                fontWeight: 600,
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
              <TableRow sx={{border: "3px solid #bfbfbf",}}>
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
              backgroundColor: '#0D2543',
              color: "white",

              "& .MuiPagination-selectLabel": {
                color: "white",
              },

              "& .MuiPaginationItem-root": {
                color: "white",
              },
              "& .Mui-selected": {
                backgroundColor: '#ececec',
                color: '#E8AE31',
              },

              "& .MuiSvgIcon-root": {
                color: '#fbfbfb',
              },
                border: "2px solid #0D2543",
                borderRadius: 2

            }}
          />
        </Box>
      </Box>

      
    )
  }

export default LotSearch