import ResidentSearch from './components/ResidentSearch.jsx'
import NavBar from './components/NavBar.jsx'
import LotSearch from './components/LotSearch.jsx'
import {Box} from '@mui/material'
  function App() { 
    //set page background color
    document.body.style.backgroundColor = '#0d2543';
    return(
      <Box
      
      >
      <NavBar />
      <LotSearch />
      <ResidentSearch />
      </Box>
    )
  }

  export default App