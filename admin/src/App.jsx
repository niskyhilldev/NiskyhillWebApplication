import ResidentSearch from './components/ResidentSearch.jsx'
import NavBar from './components/NavBar.jsx'
import LotSearch from './components/LotSearch.jsx'
import LoginForm from './components/LoginForm.jsx';
import {Box} from '@mui/material'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { useState } from 'react';

//inline admin dashboard 
function AdminDashboard(){
  //set page background color
  document.body.style.backgroundColor = '#0d2543';
  return(
    <Box>
    <NavBar />
    <LotSearch />
    <ResidentSearch />
    </Box>
  )
}

function App() { 
  // state flag to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Login first then direct to admin dashboard (default path directsto login too) */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/admin" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

  export default App