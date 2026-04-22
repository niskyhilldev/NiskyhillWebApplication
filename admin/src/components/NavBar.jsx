import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Link,
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Button
} from '@mui/material';
import {useNavigate} from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import {logout, getCurrentUser} from "../api/userAPI";


function Profile() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget); // anchor to the icon to maintain location

    // fetch user info
    try{
      const data = await getCurrentUser();
      //console.log("USER DATA:", data);
      setUser(data)
    }catch(err){
      console.error("Failed to load user", err);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async() => {
    try{
      await logout();
      //localStorage.removeItem("token");
      window.location.href = "/login";
    }catch(err){
      console.error(err);
    }
    handleClose();
  };

  return (
    <>
      {/* User Icon Button */}
      <IconButton onClick={handleClick} >
        <AccountCircle sx={{ fontSize: 70, color: "#0d2543"}}/>
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
        <MenuItem sx={{ pointerEvents: "none" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body1" sx={{color: "black"}}>
                    <strong>{user?.firstName || "Loading..."}</strong>
                    <strong>{" "}</strong>
                    <strong>{user?.lastName || "Loading..."}</strong>
                </Typography>
                <Typography variant="body2" sx={{color: "black"}}>
                    {user?.email || ""}
                </Typography>
                <Typography variant="body2">
                    {user?.role || ""}
                </Typography>
            </Box>
       
        </MenuItem>

        <Divider />

        {/* Actions */}
        <MenuItem 
          onClick={() => {
            handleClose();
            navigate("/reset-password");
          }}
        >
          Reset Password
        </MenuItem>
        <MenuItem disableRipple sx={{ backgroundColor: "white", pt: 1, pb: 1 }}>
          <Button
            fullWidth
            onClick={handleLogout}
            sx={{
              backgroundColor: "#af8c30",
              color: "white",
              borderRadius: "8px",
              fontFamily: "Inria Serif",
              fontWeight: "bold",
              letterSpacing: "1px",
              textTransform: "none",
              "&:hover": {backgroundColor: "#8b6f27"}
            }}
          > Logout
          </Button>
        </MenuItem>
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