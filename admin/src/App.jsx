import ResidentSearch from './components/ResidentSearch.jsx'
import NavBar from './components/NavBar.jsx'
import LotSearch from './components/LotSearch.jsx'
import LoginForm from './components/LoginForm.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import {Box, Tabs, Tab} from '@mui/material'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { useState } from 'react';

//inline admin dashboard 
function AdminDashboard(){
  //set page background color
  document.body.style.backgroundColor = '#efefef';

  // tab state
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <NavBar />

      {/* Tab Headers */}
      <Box sx={{ borderBottom: "1px solid rgba(175, 140, 48, 0.4)", px: 3, position: "relative", zIndex: 100 }}>
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          TabIndicatorProps={{ style: { backgroundColor: "#af8c30" } }}
          sx={{
            "& .MuiTab-root": {
              color: "rgba(255,255,255,0.5)",
              fontFamily: "Inria Serif",
              fontSize: "1rem",
              letterSpacing: "1px",
              textTransform: "none",
            },
            "& .Mui-selected": {
              color: "#af8c30 !important",
            },
          }}
        >
          <Tab label="Lots" />
          <Tab label="Residents" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ mt: 2, position: "relative", zIndex: 0, overflow: "hidden" }}>
        {tab === 0 && (
          <Box sx={{ position: "relative", zIndex: 0 }}>
            <LotSearch />
          </Box>
        )}
        {tab === 1 && (
          <Box sx={{ position: "relative", zIndex: 0 }}>
            <ResidentSearch />
          </Box>
        )}
      </Box>
    </Box>
  );
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
        <Route path="reset-password" element={<ResetPassword />}/>
      </Routes>
    </BrowserRouter>
  )
}

  export default App