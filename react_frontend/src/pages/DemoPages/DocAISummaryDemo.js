import React from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Typography, Box, Grid, useMediaQuery } from "@mui/material";
import SummaryFun from "../Functionality/SummaryFun";
import MedBill_extractor from "../../assets/DemoSummary.png";
import { useTheme } from "@mui/system";
import CardFeatures from "./DocAISummaryCard";

const HeadingStyle = {
  textAlign: "center",
};
export default function DocAI_Summary_Demo() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <Header />
      <Box
        sx={{
          height: isMobile ? "auto" : "600px",
          backgroundImage: `url(${require("../../assets/SummaryDemo.jpg")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Top center heading */}
        <Box sx={HeadingStyle}>
          <Typography
            className="Nasaliza"
            variant="h1"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem" },
              color: "white",
              textAlign: "center",
              fontFamily: "Georgia, Times, serif",
              paddingTop: isMobile ? "1rem" : "0rem",
              marginTop: '-20px'
            }}
          >
            Doc<span style={{ color: "#0B70FF" }}>AI</span>
            <sup
              style={{
                position: "relative",
                top: "-2rem",
                right: "-0.1rem",
                fontSize: "0.5rem",
              }}
            >
              TM
            </sup>{" "}
            Summary
          </Typography>
          <Typography
            sx={{
              color: "orange",
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              textAlign: "center",
              marginTop: "10px",
            }}
            className="billy-title"
          >
            Demo
          </Typography>
        </Box>
        {/* Content and Image */}
        <Grid
          container
          spacing={2}
          sx={{
            width: { xs: "90%", md: "80%" },
            mx: "auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Left side: Content */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box>
              <Typography
                className="Nasaliza"
                variant="h4"
                sx={{
                  color: "#ffffff",
                  fontWeight: 400,
                  letterSpacing: "0.5px",
                  textShadow: "3px 3px 6px rgba(0, 0, 0, 0.7)",
                  lineHeight: 1.2,
                  mb: 2,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "1.7rem" },
                  textAlign: "left",
                  marginLeft: '20px'
                }}
              >
                Discover the Power of DocAI™ Summary for P&C Insurance
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#ffffff",
                  fontFamily:
                    "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                  fontWeight: 400,
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                  lineHeight: 1.6,
                  textAlign: "justify",
                  hyphens: "auto",
                  wordBreak: "break-word",
                  fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
                  "& > span": { display: "inline-block" },
                  marginLeft: '20px'
                }}
              >
                Harness the power of DocAI™ Summary to transform intricate insurance documents, such as policies, reports, and more, into actionable insights instantly. Experience advanced AI-driven summarization through an intuitive demo.
              </Typography>
            </Box>
          </Grid>
          {/* Right side: Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={MedBill_extractor}
              alt="Summary"
              sx={{
                width: { xs: "80%", sm: "60%", md: "100%" },
                height: "auto",
                display: "block",
                mx: "auto",
              }}
            />
          </Grid>
        </Grid>
      </Box>
      {/* Card Section */}
      <CardFeatures isMobile={isMobile} />
      <Box
        sx={{
          height: "4px",
          backgroundColor: "#000166",
          width: "100%",
          maxWidth: 1300,
          margin: "auto",
          borderRadius: "2px",
          marginBottom: "50px",
        }}
      />
      <SummaryFun />
      <Grid marginBottom={"4rem"}></Grid>
      <Footer />
    </>
  );
}
