import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Link,
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import AccountCircle from "@mui/icons-material/AccountCircle";



function Profile() {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // anchor to the icon to maintain location
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    handleClose();
  };

  return (
    <>
      {/* User Icon Button */}
      <IconButton onClick={handleClick} >
        <AccountCircle sx={{ fontSize: 80}}/>
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        {/* Menu Info */}
        <MenuItem disabled>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body1">
                    <strong>User Name</strong>
                </Typography>
                <Typography variant="body2">
                    Email
                </Typography>
                <Typography variant="body2">
                    Account Type
                </Typography>
            </Box>
       
        </MenuItem>

        <Divider />

        {/* Actions */}
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}




 function NavBar() {
  return (
    <AppBar position="static" elevation="4"
      sx={{
        display: 'flex',
        flexDirection: 'row'
        ,justifyContent: 'space-between',
        backgroundColor:'#af8c30' ,
        margin: '0px',
        height: '150px',
        alignItems: 'center'
      }}>
        {/**Nisky Logo */}
        <Box
        sx={{
              display: 'flex', flexDirection: 'column', textAlign: 'left', marginLeft: '100px',
            }}>
              
          <Link href="/App.jsx" underline="none" >
            <Typography 
             sx={{
              fontFamily: 'Inria Serif',
              fontSize: '40px',
              fontWeight: 500,
              color: 'white',
            }}>
              Nisky Hill
            </Typography>
          </Link>

          <Link href="/App.jsx" underline="none" >
            <Typography 
            sx={{
              fontFamily: 'Inria Serif',
              fontSize: '22px',
              fontWeight: 1000,
              color: 'white',
              marginLeft: '20px',
              letterSpacing: '3.72px'
            }}> 
              Cemetery
            </Typography>
          </Link>
        </Box>

        {/**Centered Admin */}
        <Box sx={{ flexGrow: 1, textAlign: 'center', alignContent: 'center'}}>
          <Typography variant="h1"
            sx={{
              fontFamily: 'Inria Serif',
              fontSize: '70px',
              fontWeight: 500,
              color: 'white',
            }}>
            Administration
          </Typography>
        </Box>

        <Box
        sx={{
              
              justifyContent: 'center', 
              alignContent: 'center',
              marginRight: '50px',
              marginLeft: '170px'
            }}>
          <Profile/> {/**Need to come back to  */}
        </Box>
    </AppBar>
  );
}

export default NavBar