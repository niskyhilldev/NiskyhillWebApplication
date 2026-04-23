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
    const [rowsPerLotPage, setRowsPerLotPage] = useState(20); //currently state is static

    //states for Search by name pages
    const [namePage, setNamePage] = useState(0);
    const [rowsPerNamePage, setRowsPerNamePage] = useState(20); //currently state is static

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
                onChange={(event) => setNameTextValue(event.target.value)}
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
                onClick={activateNameResidentSearch}
                sx={{backgroundColor:'#af8c30'}}
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
        <Table sx={{mt:'20px'}}>
          <TableHead
          sx={{backgroundColor:'#af8c30', border: "2px solid #8b6f27"}}>
            <TableRow >
              
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27", py: 0}}>First Name</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27", py: 0}}>Middle Name</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27", py: 0}}>Last Name</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27", py: 0}}>Burial Date</TableCell>
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

            {nameSearchLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                    Loading...
                </TableCell>
              </TableRow>
            ) : nameSearchResults.length === 0 && !nameSearchError ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No results
                </TableCell>
              </TableRow>
            ) : (
              paginatedNameResults.map((row) => (
                <TableRow key={row.rid}>
                  <TableCell>{row.firstName}</TableCell>
                  <TableCell>{row.middleName}</TableCell>
                  <TableCell>{row.lastName}</TableCell>
                  <TableCell>{row.burialDate}</TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
        </Box>








        {/** Search by lot */}


        {/**Lot search inputs */}
        <Box sx={{ display: "flex", gap: 2 }}>
           
        <Typography  sx={{  display: "flex", alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', display: "flex", alignItems: 'center', justifyContent: 'center', color:'white' , fontWeight: 600}}>
            By Lot:
        </Typography>
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
            onClick={activateLotResidentSearch}
            sx={{backgroundColor:'#af8c30'}}
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
        <Table sx={{mt:'20px'}}>
          <TableHead
          sx={{backgroundColor:'#af8c30', border: "2px solid #8b6f27"}}>
            <TableRow >
              
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27", py: 0}}>First Name</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27", py: 0}}>Middle Name</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27", py: 0}}>Last Name</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27", py: 0}}>Burial Date</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27", py: 0}}>Section</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27", py: 0}}>Lot</TableCell>
              <TableCell sx={{fontSize: '20px', fontWeight: 'bold',borderRight: "2px solid #8b6f27", py: 0}}>Descriptor</TableCell>
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

            {lotSearchLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                    Loading...
                </TableCell>
              </TableRow>
            ) : lotSearchResults.length === 0 && !lotSearchError ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No results
                </TableCell>
              </TableRow>
            ) : (
              paginatedLotResults.map((row) => (
                <TableRow key={row.rid}>
                  <TableCell>{row.firstName}</TableCell>
                  <TableCell>{row.middleName}</TableCell>
                  <TableCell>{row.lastName}</TableCell>
                  <TableCell>{row.burialDate}</TableCell>
                  <TableCell>{row.sectionName}</TableCell>
                  <TableCell>{row.lotNumber}</TableCell>
                  <TableCell>{row.lotDescriptor}</TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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


export default ResidentSearch