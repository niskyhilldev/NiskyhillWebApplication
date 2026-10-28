import { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        backgroundColor: "#0d2543",
        color: "white",
        px: 2,
        py: 1.5,
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            component="h1"
            sx={{
              fontFamily: "Inria Serif, Georgia, serif",
              fontSize: "25px",
              fontWeight: 500,
              lineHeight: 1.1,
              color: "white",
            }}
          >
            Nisky Hill
          </Typography>

          <Typography
            sx={{
              mt: 0.3,
              fontFamily: "Inria Serif, Georgia, serif",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "3px",
              color: "white",
            }}
          >
            Cemetery
          </Typography>
        </Box>

        <IconButton
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          sx={{
            color: "white",
            width: 44,
            height: 44,
            flexShrink: 0,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.12)",
            },
          }}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      {menuOpen && (
        <Box
          component="nav"
          aria-label="Tour navigation"
          sx={{
            maxWidth: 1100,
            mx: "auto",
            mt: 1.5,
            pt: 1,
            borderTop: "1px solid rgba(255,255,255,0.25)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            component="a"
            href="https://www.niskyhill.org/index.html"
            sx={{
              color: "white",
              textDecoration: "none",
              py: 1.5,
              fontFamily: "Instrument Sans, Arial, sans-serif",
              fontWeight: "bold",
            }}
          >
            HOME
          </Box>

          <Box
            component="a"
            href="https://www.niskyhill.org/history/history.html"
            sx={{
              color: "white",
              textDecoration: "none",
              py: 1.5,
              fontFamily: "Instrument Sans, Arial, sans-serif",
              fontWeight: "bold",
            }}
          >
            HISTORY
          </Box>

          <Box
            component="a"
            href="https://www.niskyhill.org/notableResidents/notableResidents.html"
            sx={{
              color: "white",
              textDecoration: "none",
              py: 1.5,
              fontFamily: "Instrument Sans, Arial, sans-serif",
              fontWeight: "bold",
            }}
          >
            NOTABLE RESIDENTS
          </Box>

          <Box
            component="a"
            href="https://www.niskyhill.org/contact/contact.html"
            sx={{
              color: "white",
              textDecoration: "none",
              py: 1.5,
              fontFamily: "Instrument Sans, Arial, sans-serif",
              fontWeight: "bold",
            }}
          >
            CONTACT
          </Box>

          <Box
            component="a"
            href="https://www.niskyhill.org/faq/faq.html"
            sx={{
              color: "white",
              textDecoration: "none",
              py: 1.5,
              fontFamily: "Instrument Sans, Arial, sans-serif",
              fontWeight: "bold",
            }}
          >
            FAQs
          </Box>

          <Box
            component="a"
            href="https://www.historicbethlehem.org/visit-us/experience/nisky-hill-cemetery-tour"
            sx={{
              color: "white",
              textDecoration: "none",
              py: 1.5,
              fontFamily: "Instrument Sans, Arial, sans-serif",
              fontWeight: "bold",
            }}
          >
            VISIT
          </Box>

          <Box
            component="a"
            href="https://www.niskyhill.org/search/search.html"
            sx={{
              color: "white",
              textDecoration: "none",
              py: 1.5,
              fontFamily: "Instrument Sans, Arial, sans-serif",
              fontWeight: "bold",
              background: "#af8c30",
              borderRadius: "19px",
            }}
          >
            FIND A GRAVE
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Header;

