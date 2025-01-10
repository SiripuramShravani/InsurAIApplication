import { React } from "react";
import { Box, Grid, Typography, Container, useMediaQuery, useTheme, Card, CardContent } from "@mui/material";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Category, Description, CloudQueue } from '@mui/icons-material'; // Importing new icons
import ClassifyDemo from './../../assets/ClassifyDemo.png'
import DocAIClassifyFullFun from "../Functionality/DocAIClassifyFullFun";

export default function DocAIClassifyDemo() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isScreen = useMediaQuery('(max-width:900px)');

  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");

  return (
    <>
      <head>
        <title>DocAI Classify Demo | Document Automation AI</title>
        <meta
          name="description"
          content="Experience the power of DocAI Classify, an intelligent document classification system that automates document sorting, handling multiple formats like PDFs and images with high precision."
        />
        <meta
          name="keywords"
          content="DocAI Classify, document classification, AI document sorting, document automation, document processing, AI technology, PDF classification, cloud-based document management"
        />
        <meta name="robots" content="index, follow" />
      </head>

      {Authorization && (
        <>
          <Header />

          <main>
            <Box sx={{ background: "linear-gradient(to right, #4b6cb7, #001660)" }}>
              <Container sx={{ width: "100%", maxWidth: 1200, margin: "auto", py: 5 }}>
                <Typography
                  component="h1" // Main H1 heading
                  sx={{
                    fontWeight: "bold",
                    fontSize: isMobile ? 24 : 36,
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Doc<span style={{ color: "#0B70FF" }}>AI</span>
                  <sup style={{ position: "relative", top: "-1rem", right: "-0.1rem", fontSize: "0.5rem" }}>TM</sup>{" "}
                  Classify
                </Typography>

                <Typography
                  component="h2" // Secondary heading
                  className="billy-title"
                  sx={{ fontSize: isMobile ? "2rem" : "3rem", color: "orange", textAlign: "center", mb: 4 }}
                >
                  Demo
                </Typography>

                {/* Introduction */}
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Typography
                        component="p"
                        sx={{ fontSize: isMobile ? '1rem' : '1.4rem', color: 'white', maxWidth: 800, margin: 'auto', textAlign: "justify", fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif'" }}

                      >
                        Welcome to the DocAI Classify Demo, where document automation meets innovation. Harnessing advanced machine learning, DocAI swiftly classifies and organizes your documents with unparalleled accuracy and efficiency.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ textAlign: 'right' }}>
                        <img
                          src={ClassifyDemo}
                          alt="DocAI Illustration"
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>


              </Container>
            </Box>

            <Box component="section" sx={{ width: "100%", maxWidth: 1200, margin: "auto", py: 5 }}>
              <Typography
                component="h2"
                sx={{ fontSize: isMobile ? "1.2rem" : "1.5rem", textAlign: "center", color: "#001660", mb: 3 }} className='Nasaliza'
              >
                Key Features of  Doc<span style={{ color: "#0B70FF" }}>AI</span><sup style={{ position: "relative", top: "-1rem", right: "-0.1rem", fontSize: "0.5rem" }}>TM</sup>{" "} Classify
              </Typography>

              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      textAlign: "center",

                      color: "black",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <Category sx={{ fontSize: 50, color: "#001660" }} /> {/* Updated Icon */}
                      <Typography component="h3" sx={{ color: "#f9a825", fontWeight: "bold", mt: 2 }} className='Nasaliza'>
                        Automatic Document Sorting
                      </Typography>
                      <Typography component="p" sx={{ color: "blue", mt: 1, textAlign: "justify", padding: "0rem 1.5rem" }}>
                        Automatically sorts incoming documents into relevant categories, saving hours of manual work.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      textAlign: "center",

                      color: "white",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <Description sx={{ fontSize: 50, color: "#001660" }} /> {/* Updated Icon */}
                      <Typography component="h3" sx={{ color: "#f9a825", fontWeight: "bold", mt: 2 }} className='Nasaliza'>
                        Supports Multiple Formats
                      </Typography>
                      <Typography component="p" sx={{ color: "blue", mt: 1, textAlign: "justify", padding: "0rem 1.5rem" }}>
                        From PDFs to images, DocAI Classify can handle a wide range of document types.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card
                    sx={{
                      textAlign: "center",

                      color: "white",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                      height: "100%",
                    }}
                  >
                    <CardContent>
                      <CloudQueue sx={{ fontSize: 50, color: "#001660" }} /> {/* Updated Icon */}
                      <Typography component="h3" sx={{ color: "#f9a825", fontWeight: "bold", mt: 2 }} className='Nasaliza'>
                        Cloud-Based Access
                      </Typography>
                      <Typography component="p" sx={{ color: "blue", mt: 1, textAlign: "justify", padding: "0rem 1.5rem" }}>
                        Access your document classification system anytime, anywhere, with our secure cloud infrastructure.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ width: "100%", maxWidth: 1200, margin: '2rem auto', height: isScreen && '800px' }}>

              {/* <DocAIClassifyEmailsProcessFun /> */}
              <DocAIClassifyFullFun />
            </Box>

          </main>

          <Footer />
        </>
      )}
    </>
  );
}