import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function TourPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Instrument Sans, Arial, sans-serif",
      }}
    >

      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: 430,
          mx: "auto",
          px: 1.25,
          pt: 1,
          pb: 2,
          boxSizing: "border-box",
          flex: 1,
        }}
      >
        {/* Resident portrait */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 1.25,
          }}
        >
          <Box
            component="img"
            src="./public/kocsis.png"
            alt="James Paul Kocsis"
            sx={{
              width: 162,
              height: 162,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #0d2543",
            }}
          />
        </Box>

        {/* Name */}
        <Typography
          component="h2"
          sx={{
            fontFamily: "Inria Serif, Georgia, serif",
            fontSize: 21,
            lineHeight: 1.12,
            fontWeight: 700,
            textAlign: "center",
            color: "#af8c30",
            mb: 0.75,
          }}
        >
          James Paul
          <br />
          Kocsis
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            fontSize: 11,
            color: "#222222",
            mb: 1,
          }}
        >
          Artist
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            fontSize: 10,
            fontWeight: 700,
            color: "#111111",
            whiteSpace: "nowrap",
            mb: 1.5,
          }}
        >
          1936, Apr 27 – 2021, Dec 28
        </Typography>

        {/* Gold/navy divider */}
        <Box
          sx={{
            height: "2px",
            width: "100%",
            backgroundColor: "#0d2543",
            mb: 0.5,
          }}
        />

        {/* Expandable information sections */}
        {[
          {
            title: "Background Information",
            content:
              "James Paul Kocsis was an independent American painter and book illustrator. Born in Buffalo, New York, Kocsis moved with his parents to Bethlehem in 1942 at age six and began painting at age 12. He attended the Philadelphia College of Art (now the University of the Arts), where he studied under painter and printmaker Jacob Landau. He graduated in 1958 and enlisted in the U.S. Army shortly thereafter. Kocsis worked as a book illustrator between 1961 and 1968, illustrating more than 20 books under the pseudonym J.C. Kocsis. Feeling constrained by drawing, Kocsis returned to painting full-time in 1968.",
          },
          {
            title: "Achievement",
            content:
              "Kocsis is best known for his vibrant, expressive artwork style, which he termed \"psychic impressionism\" in which he said the paintings sprang from his subconscious. Throughout his 30-year career, Kocsis created more than 500 paintings. While his paintings ranged from abstract to realistic, they always focused on a recognizable face, particularly eyes, to depict human emotion. As a sign of his fierce independence, he arranged his private sales and organized his own shows, arranging 42 shows in more than two dozen countries over his career.",
          },
          {
            title: "Location",
            content:
              "Kocsis is buried in Nisky Hill Cemetery next to his wife, Carol, in Section C.",
          },
        ].map((section) => (
          <Accordion
            key={section.title}
            disableGutters
            elevation={0}
            sx={{
              borderBottom: "1px solid #0d2543",
              "&::before": { display: "none" },
              backgroundColor: "#ffffff",
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ fontSize: 17, color: "#0d2543" }} />
              }
              sx={{
                minHeight: "29px",
                px: 0.5,
                "& .MuiAccordionSummary-content": {
                  my: 0.75,
                },
                "&.Mui-expanded": {
                  minHeight: "29px",
                },
                "& .MuiAccordionSummary-content.Mui-expanded": {
                  my: 0.75,
                },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Instrument Sans, Arial, sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#111111",
                }}
              >
                {section.title}
              </Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 0.75, pt: 0, pb: 1.25 }}>
              <Typography
                sx={{
                  fontSize: 11,
                  lineHeight: 1.6,
                  color: "#333333",
                }}
              >
                {section.content}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Cemetery information footer */}
      <Box
        component="footer"
        sx={{
          width: "100%",
          backgroundColor: "#af8c30",
          color: "#ffffff",
          textAlign: "center",
          px: 1,
          py: 1,
          boxSizing: "border-box",
          mt: "auto",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Inria Serif, Georgia, serif",
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          Open Dawn till Dusk
        </Typography>

        <Typography sx={{ fontSize: 8, lineHeight: 1.5, mt: 0.25 }}>
          254 E Church Street
        </Typography>

        <Typography sx={{ fontSize: 8, lineHeight: 1.5 }}>
          Bethlehem, PA 18018
        </Typography>
      </Box>
    </Box>
  );
}

export default TourPage;


    