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
  Pagination,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';

import ResidentAddButton from "./ResidentAddButton";
import DeleteButton from "./DeleteButton";
import ResidentEditButton from "./ResidentEditButton";
import SectionDropdown from "./SectionDropDown";
import { fetchSections, performLotSearch } from "../api/lotApi";
import { performResidentSearch } from "../api/residentApi";



    function ResidentSearch() {

    //states for section dropdown
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState("");
    const [dropError, setDropError] = useState("");
    const [dropLoading, setDropLoading] = useState(true);

     //State for search by lot Text box
    const [lotTextValue, setLotTextValue] = useState("");
    const [nameTextValue, setNameTextValue] = useState("");

    //States for search by lot info results
    const [lotSearchResults, setLotSearchResults] = useState([]);
    const [lotSearchError, setLotSearchError] = useState(null); 
    const [lotSearchLoading, setLotSearchLoading] = useState(false);

    //States for search by name info results
    const [nameSearchResults, setNameSearchResults] = useState([]);
    const [nameSearchError, setNameSearchError] = useState(null); 
    const [nameSearchLoading, setNameSearchLoading] = useState(false);
    
    //states for Search by Lot pages
    const [lotPage, setLotPage] = useState(0);
    const [rowsPerLotPage, setRowsPerLotPage] = useState(10); //currently state is static

    //states for Search by name pages
    const [namePage, setNamePage] = useState(0);
    const [rowsPerNamePage, setRowsPerNamePage] = useState(10); //currently state is static

    //state for which search is rendered
    const [searchMode, setSearchMode] = useState("name");

    //determines which rows should be displayed
    const paginatedLotResults = lotSearchResults.slice(
      lotPage * rowsPerLotPage,
      lotPage * rowsPerLotPage + rowsPerLotPage
    );

    //determines which rows should be displayed
    const paginatedNameResults = nameSearchResults.slice(
      namePage * rowsPerNamePage,
      namePage * rowsPerNamePage + rowsPerNamePage
    );

   

    async function activateNameResidentSearch(){
      setNamePage(0);
      try {  
        setNameSearchError(null); //remove error from previous search
        setNameSearchLoading(true); 

        const result = await performResidentSearch(nameTextValue);

        // Flattening not nessecary, as there is not nested json
        setNameSearchResults(result);
        console.log(result);
      } catch (error) {
        setNameSearchError(error.message || "Unknown error occurred");
        setNameSearchResults([]);
      } finally {
        setNameSearchLoading(false);    
      }
    }


    //on search by lot (name) button press
    async function activateLotResidentSearch(){
      setLotPage(0);
      try {  
        setLotSearchError(null); //remove error from previous search
        setLotSearchLoading(true); 

        const result = await performLotSearch(lotTextValue, selectedSection);

        //"flatten" the resulting json data so pagination can be used
        const flattenedResult = result.flatMap((plot) =>
          plot.residents?.map((resident) => ({
            ...resident,
            sectionName: plot.lot.section.name,
            lotNumber: plot.lot.number,
            lotDescriptor: plot.lot.descriptor,
          })) || []
        );
        //
        setLotSearchResults(flattenedResult);
        console.log(result);
      } catch (error) {
        setLotSearchError(error.message || "Unknown error occurred");
        setLotSearchResults([]);
      } finally {
        setLotSearchLoading(false);    
      }
    }

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
        
      }, []);

  return (
      //headers
      <Box sx={{ width: "100vw" }}>
        {/**Removed for redundancy */}
        {/* <Typography variant="h1" sx={{ m: '50px 0', fontSize: '48px', color:'white' , fontWeight: 600, backgroundColor: '#E8AE31', padding: '15px'}}>
          RESIDENTS
        </Typography> */}

        <Typography  align="center" sx={{ fontSize: '36px', mb: 2 , color:'#0D2543' , fontWeight: 700}}>
          Search for a Resident
        </Typography>
        
        <Box sx={{ display: "flex", gap: 2 }}>
            
            
            {/* Lot Input */}

            <Typography
              sx={{
                fontSize: "28px",
                color: '#0D2543',
                fontWeight: 600,
                ml: "20px",
                mb: "30px"
              }}
            >
              Search By:
            </Typography>
            <FormControl variant="standard" sx={{ minWidth: 150 }}>


          
                    <Select
                      value={searchMode}
                      label="Search Mode"
                      onChange={(e) => setSearchMode(e.target.value)}
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

                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="lot">Lot</MenuItem>
                  
                </Select>
              </FormControl>
            </Box>
       

        {searchMode === "name" && (
          <>             


        <Box sx={{mb: '40px' }}>
          
             {/** search by Last Name */}
            
            
            
          
            <Box sx={{ display: "flex", gap: 2 }}>
            
            
            {/* Lot Input */}

            <Typography
              sx={{
                fontSize: "28px",
                color: '#0D2543',
                fontWeight: 600,
                ml: "20px"
              }}
            >
              Name:
            </Typography>
            <TextField
                //label="Name"
                variant="outlined"
                size="small"
                //placeholder="Search Last Name"
                onChange={(event) => setNameTextValue(event.target.value)}
                
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
                onClick={activateNameResidentSearch}
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
            <ResidentAddButton/>
            </Box>
            {/**If search fails display error */}
        {nameSearchError && (
          <div style={{ color: "red", marginBottom: "16px" }}>
            Error: {nameSearchError}
          </div>
        )}
        {/* Table */}
        <Box sx={{m: 0, px: "20px"}}>
          <Table sx={{mt:'20px'}}>
            <TableHead
            sx={{backgroundColor:'#0D2543', border: "1px solid #0D2543"}}>
              <TableRow >
                
                <TableCell sx={{color: '#fbfbfb',fontSize: '20px', fontWeight: 'bold', py: 0}}>First Name</TableCell>
                <TableCell sx={{color: '#fbfbfb',fontSize: '20px', fontWeight: 'bold', py: 0}}>Middle Name</TableCell>
                <TableCell sx={{color: '#fbfbfb',fontSize: '20px', fontWeight: 'bold', py: 0}}>Last Name</TableCell>
                <TableCell sx={{color: '#fbfbfb',fontSize: '20px', fontWeight: 'bold', py: 0}}>Burial Date</TableCell>
                <TableCell sx={{color: '#fbfbfb',fontSize: '20px', fontWeight: 'bold', py: 0}}>Actions</TableCell>
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

              {nameSearchLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                      Loading...
                  </TableCell>
                </TableRow>
              ) : nameSearchResults.length === 0 && !nameSearchError ? (
                <TableRow sx={{border: "1px solid #e0e0e0", borderTop: "0px"}}>
                  <TableCell colSpan={5} align="center">
                    No results
                  </TableCell>
                </TableRow>
              ) : (
                paginatedNameResults.map((row) => (
                  <TableRow key={row.rid}>
                    <TableCell sx={{ borderLeft: "1px solid #e0e0e0",}}>{row.firstName}</TableCell>
                    <TableCell>{row.middleName}</TableCell>
                    <TableCell>{row.lastName}</TableCell>
                    <TableCell>{row.burialDate}</TableCell>
                    <TableCell sx={{ borderRight: "1px solid #e0e0e0",}}>

                      <ResidentEditButton
                        resident={row}
                        isFlattened={false}
                        onSave={(updatedResident) => {
                          setLotSearchResults((prev) =>
                            prev.map((r) =>
                              String(r.rid) === String(updatedResident.rid)
                                ? updatedResident
                                : r
                            )
                          );

                          setNameSearchResults((prev) =>
                            prev.map((r) =>
                              String(r.rid) === String(updatedResident.rid)
                                ? updatedResident
                                : r
                            )
                          );
                        }}
                      />
                      <DeleteButton
                        rid={row.rid}
                        type='resident'
                        //onDelete removes the requested resident from the rendered results
                        onDelete={(rid) => {
                          //remove resident from both search results, as to not cause a conflict
                          setLotSearchResults((prev) => 
                            prev.filter((r) => String(r.rid) !== String(rid))
                          );

                          setNameSearchResults((prev) =>
                            prev.filter((r) => String(r.rid) !== String(rid))
                          );
                        }}
                      />
                      
                    </TableCell >
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
            alignItems: 'center'
          }}
        >

          <Pagination //pages are annoying and started at 1, not 0, so page must be one greater than the chosen page
          //and let lot page must be 1 less than page, as pagination starts at 1
            count={Math.ceil(nameSearchResults.length / rowsPerNamePage)}
            page={namePage + 1}
            onChange={(e, value) => setNamePage(value - 1)}
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

        </>
      )}






        {/** Search by lot */}
        {searchMode === "lot" && (
        <>

        {/**Lot search inputs */}
        
        <Box sx={{ display: "flex", gap: 2 }}>
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
            //placeholder="Search lot"
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
            onClick={activateLotResidentSearch}
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
          <ResidentAddButton/>
        </Box>
        

        {/**If search fails display error */}
        {lotSearchError && (
          <div style={{ color: "red", marginBottom: "16px" }}>
            Error: {lotSearchError}
          </div>
        )}
        {/* Table */}
         <Box sx={{m: 0, px: "20px"}}>
          <Table sx={{mt:'20px'}}>
            <TableHead
              sx={{backgroundColor:'#0D2543', border: "1px solid #0D2543"}}>
              <TableRow >
                
                <TableCell sx={{color: '#fbfbfb',fontSize: '20px', fontWeight: 'bold', py: 0}}>First Name</TableCell>
                <TableCell sx={{color: '#fbfbfb',fontSize: '20px', fontWeight: 'bold', py: 0}}>Middle Name</TableCell>
                <TableCell sx={{color: '#fbfbfb',fontSize: '20px', fontWeight: 'bold', py: 0}}>Last Name</TableCell>
                <TableCell sx={{color: '#fbfbfb',fontSize: '20px', fontWeight: 'bold', py: 0}}>Burial Date</TableCell>
                <TableCell sx={{color: '#fbfbfb',fontSize: '20px', fontWeight: 'bold', py: 0}}>Section</TableCell>
                <TableCell sx={{color: '#fbfbfb',fontSize: '20px', fontWeight: 'bold', py: 0}}>Lot</TableCell>
                <TableCell sx={{color: '#fbfbfb',fontSize: '20px', fontWeight: 'bold', py: 0}}>Descriptor</TableCell>
                <TableCell sx={{color: '#fbfbfb',fontSize: '20px', fontWeight: 'bold', py: 0}}>Actions</TableCell>
              </TableRow>
            </TableHead>



            <TableBody
              sx={{
                backgroundColor: '#fbfbfb',
                "& td": {
                  color: '#0D2543',
                  fontSize: "15px",
                  fontWeight: 600,
                  py: 0,
                 
                 
                },
              }}
            >

              {lotSearchLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                      Loading...
                  </TableCell>
                </TableRow>
              ) : lotSearchResults.length === 0 && !lotSearchError ? (
                <TableRow sx={{border: "1px solid #e0e0e0", borderTop: "0px"}}>
                  <TableCell colSpan={8} align="center">
                    No results
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLotResults.map((row) => (
                  <TableRow key={row.rid}>
                    <TableCell sx={{ borderLeft: "1px solid #e0e0e0",}}>{row.firstName}</TableCell>
                    <TableCell>{row.middleName}</TableCell>
                    <TableCell>{row.lastName}</TableCell>
                    <TableCell>{row.burialDate}</TableCell>
                    <TableCell>{row.sectionName}</TableCell>
                    <TableCell>{row.lotNumber}</TableCell>
                    <TableCell>{row.lotDescriptor}</TableCell>
                    <TableCell sx={{ borderRight: "1px solid #e0e0e0",}}>

                      <ResidentEditButton
                        resident={row}
                        isFlattened={true}
                        onSave={(updatedResident) => {
                          setLotSearchResults((prev) =>
                            prev.map((r) =>
                              String(r.rid) === String(updatedResident.rid)
                                ? updatedResident
                                : r
                            )
                          );

                          setNameSearchResults((prev) =>
                            prev.map((r) =>
                              String(r.rid) === String(updatedResident.rid)
                                ? updatedResident
                                : r
                            )
                          );
                        }}
                      />
                      <DeleteButton
                        rid={row.rid}
                        type='resident'
                        //onDelete removes the requested resident from the rendered results
                        onDelete={(rid) => {
                          //remove resident from both search results, as to not cause a conflict
                          setLotSearchResults((prev) => 
                            prev.filter((r) => String(r.rid) !== String(rid))
                          );

                          setNameSearchResults((prev) =>
                            prev.filter((r) => String(r.rid) !== String(rid))
                          );
                        }}
                      />
                      
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
            alignItems: 'center'
          }}
        >

          <Pagination //pages are annoying and started at 1, not 0, so page must be one greater than the chosen page
          //and let lot page must be 1 less than page, as pagination starts at 1
            count={Math.ceil(lotSearchResults.length / rowsPerLotPage)}
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
         </>
        )}


      </Box>

      
    )
  }


export default ResidentSearch