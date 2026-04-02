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
  Container,
  TablePagination
} from '@mui/material';

import ResidentAddButton from "./ResidentAddButton";
import SectionDropdown from "./SectionDropDown";
import { fetchSections, performLotSearch } from "../api/lotApi";



    function ResidentSearch() {

    //states for section dropdown
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState("");
    const [dropError, setDropError] = useState("");
    const [dropLoading, setDropLoading] = useState(true);

     //State forsearch by lot Text box
    const [lotTextValue, setLotTextValue] = useState("");

    //States for search by lot info results
    const [lotSearchResults, setLotSearchResults] = useState([]);
    const [lotSearchError, setLotSearchError] = useState(null); 
    const [lotSearchLoading, setLotSearchLoading] = useState(false);
    
    //states for Search by Lot pages
    const [lotPage, setLotPage] = useState(0);
    const [rowsPerLotPage, setRowsPerLotPage] = useState(5);

      //determines which rows should be displayed
      const paginatedResults = lotSearchResults.slice(
        lotPage * rowsPerLotPage,
        lotPage * rowsPerLotPage + rowsPerLotPage
      );




    function performNameResidentSearch(){
      alert("Name search"); 
    }


    //on search by lot button press
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
                onClick={performNameResidentSearch}
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
                <TableRow>
                <TableCell colSpan={8} align="center">
                  No results
                </TableCell>
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
              "& td": {
                color: "white",
                border: "2px solid #8b6f27",
                fontSize: "20px",
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
              paginatedResults.map((row) => (
                <TableRow key={row.rid}>
                  <TableCell>{row.firstName}</TableCell>
                  <TableCell>{row.middleName}</TableCell>
                  <TableCell>{row.lastName}</TableCell>
                  <TableCell>{row.burialDate}</TableCell>
                  <TableCell>{row.sectionName}</TableCell>
                  <TableCell>{row.lotNumber}</TableCell>
                  <TableCell>{row.lotDescriptor}</TableCell>
                  <TableCell>
                    <Button variant="contained" size="small">
                      Temp button
                    </Button>
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
          <TablePagination
            component="div"
            count={lotSearchResults.length}
            page={lotPage}
            onPageChange={(e, newPage) => setLotPage(newPage)}
            rowsPerPage={rowsPerLotPage}
            onRowsPerPageChange={(e) => {
              setRowsPerLotPage(parseInt(e.target.value, 10));
              setLotPage(0);
            }}
            sx={{
              backgroundColor: "#074582",
              color: "white",

              "& .MuiTablePagination-selectLabel": {
                color: "white",
              },

              "& .MuiTablePagination-displayedRows": {
                color: "white",
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