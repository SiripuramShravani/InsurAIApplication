import React from "react";
import {
  Box,
  Grid,
  Typography,
  Container,
  keyframes,
  useMediaQuery,
  useTheme,
  ThemeProvider,
  createTheme,Link
} from "@mui/material";
import ContactMailIcon from '@mui/icons-material/ContactMail';
import {PlayCircleFilled,} from "@mui/icons-material"; 
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import submissionintake from "../../../assets/submission_intake.png";
import submission from "../../../assets/submission.png";
import StyledButtonComponent from "../../../components/StyledButton";

const cardHoverEffect = keyframes`
  from {
    transform: scale(1);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  }
  to {
    transform: scale(1.05);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.4);
  }
`;
const themeStyle = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#0d6f79",
      paper: "#0a5a60",
    },
    text: {
      primary: "#fff",
      secondary: "#b3e5fc",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h4: {
      color: "#fff",
    },
    h6: {
      color: "#b3e5fc",
    },
    body1: {
      color: "#e0f7fa",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          backgroundColor: "#fff", // Set card background to white
          display: "flex",
          flexDirection: "column",
          height: "100%", // Ensure cards take up full height
          "&:hover": {
            animation: `${cardHoverEffect} 0.3s ease-out forwards`,
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          fontSize: "1.25rem",
          fontWeight: "bold",
        },
        body2: {
          fontSize: "0.875rem",
        },
      },
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    minHeight: "450px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    position: "relative",
    textAlign: "center",

    margin: "0 auto",
  },
  circle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "50%",
    border: "1px solid #e0e0e0",
    margin: "auto",
  },
  iconWrapper: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: "50%",
    backgroundColor: "#f0f4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  documentIcon: {
    top: 0,
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  textIcon: {
    bottom: 0,
    left: "50%",
    transform: "translate(-50%, 50%)",
  },
  imageIcon: {
    top: "50%",
    left: 0,
    transform: "translate(-50%, -50%)",
  },
  pdfIcon: {
    top: "50%",
    right: 0,
    transform: "translate(50%, -50%)",
  },
  scannerIcon: {
    bottom: 0,
    right: 0,
    transform: "translate(50%, 50%)",
  },
  centerText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
  button: {
    marginTop: theme.spacing(4),
    backgroundColor: "#3e00ff",
    "&:hover": {
      backgroundColor: "#5a33ff",
    },
  },
}));


export default function SubmissionPortal() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const Authorization =
    !!localStorage.getItem("Auth") ||
    !!sessionStorage.getItem("NonInsuredAuth");
  const classes = useStyles();

  const navigate = useNavigate();
  return (
    <>
      <Header />
      <Box sx={{ background: "linear-gradient(to right, #4b6cb7, #001660)" }}>
        <Box sx={{ width: "100%", maxWidth: 1200, margin: "auto" }}>
          <Typography
            className="Nasaliza"
            sx={{
              fontWeight: "bold",
              fontSize: 30,
              textAlign: "center",
              paddingTop: "3.3rem",
              color: "white",
            }}
          >
            Smart<span style={{color:'#0B70FF'}}>Quote</span> Portal
          </Typography>

          <Box className={classes.root}>
            <Grid
              container
              spacing={4}
              justifyContent="center"
              alignItems="center"
            >
            <Grid item xs={12} md={6} textAlign={"left"}>
                <Typography
                  variant="h4"
                  color="whitesmoke"
                  fontWeight="bold"
                   
                  className="Nasaliza"
                >
                  Experience the Future With Our Policy  Smart<span style={{color:'#0B70FF'}}>Quote</span>
                </Typography>
                <Typography variant="body1" color="whitesmoke" mt={2}
                 sx={{
                  textAlign: 'justify',
                  hyphens: 'auto',
                  wordBreak: 'break-word',
                  '& > span': { display: 'inline-block' }
                }}>
                  Our SmartQuote revolutionizes home insurance applications with an intuitive interface and real-time address validation. Submit your details effortlessly and securely, bringing you closer to comprehensive coverage in just minutes.
                </Typography>
                
                {Authorization ? (
                  <Box sx={{ marginTop: "2rem" }}>
                  <StyledButtonComponent
                    buttonWidth={250}
                    onClick={() => navigate("/Demo/SmartQuote")}
                  >
                    Demo
                  </StyledButtonComponent>
                  
                            <Link href="https://www.youtube.com/watch?v=z3N0RpxUQiw" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                            <StyledButtonComponent buttonWidth={200} sx={{marginLeft:'20px'}}><PlayCircleFilled sx={{ marginRight: '8px' }} />
                            Watch Video
                            </StyledButtonComponent>
                            </Link>
                         
                </Box>

              
                ) : (
                  <Box sx={{ marginTop: "2rem" }}>
                <StyledButtonComponent
                  buttonWidth={250}
                  onClick={() => navigate("/requestdemo")}
                >
                  Request for Demo
                </StyledButtonComponent>
                
                          <Link href="https://www.youtube.com/watch?v=z3N0RpxUQiw" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                          <StyledButtonComponent buttonWidth={200} sx={{marginLeft:'20px'}}><PlayCircleFilled sx={{ marginRight: '8px' }} />
                          Watch Video
                          </StyledButtonComponent>
                          </Link>
                        
              </Box>
                  
                )}
                 <Box sx={{textAlign:'center',marginRight:isMobile?"0rem":"7rem"}}>
              <Typography
                        className="Nasaliza"
                        sx={{
                          fontWeight: 'bold',
                          paddingTop: '5px',
                          fontSize: '1.1rem',
                         textAlign:'center',
                          color: 'white',
                        }}
                      >
                        <ContactMailIcon sx={{ marginRight: '10px', fontSize: '1.5rem', color: 'white' }} />
                        Contact us for a free POC
                        </Typography>

              </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    width: "100%",
                    height: "300px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    marginBottom: "2rem",
                  }}
                >
                  <img src={submissionintake} alt="submissionintake" />
                </Box>
              </Grid>

            </Grid>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "rgb(240 249 255)",
          margin: "0px",
          paddingTop: "2px",
          paddingBottom: "2px",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1200, margin: "auto" }}>
          <ThemeProvider theme={themeStyle}>
            <Container maxWidth="lg" sx={{ mt: 5, mb: 5, color: "#001660" }}>
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                className="Nasaliza"
              >
                Simplify Your Policy Submission with Our User-Friendly Smart<span style={{color:'#0B70FF'}}>Quote</span>
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: "black" }}>
                Experience an intuitive and streamlined process designed to simplify policy intake with precision and ease.
              </Typography>

              <Grid container spacing={4} justifyContent="flex-end">
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#fff",
                      boxShadow: 3,
                      height: "200px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      position: "relative",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.4)",
                      },
                    }}
                  >
                    <HomeIcon sx={{ fontSize: 50, color: "#dc004e" }} />
                    <Typography
                      variant="h6"
                      sx={{ mt: 2, color: "#001660" }}
                      className="Nasaliza"
                    >
                      Effortless Property Information Entry
                    </Typography>
                    <Typography variant="body2">
                      Our user-friendly interface guides you through entering your dwelling details accurately and efficiently.
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#fff",
                      boxShadow: 3,
                      height: "200px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      position: "relative",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.4)",
                      },
                    }}
                  >
                    <LocationOnIcon sx={{ fontSize: 50, color: "#4caf50" }} />
                    <Typography
                      variant="h6"
                      sx={{ mt: 2, color: "#001660" }}
                      className="Nasaliza"
                    >
                      Accurate Address Validation Using Google API
                    </Typography>
                    <Typography variant="body2">
                      Google Address Validation ensures accurate, verified addresses for reliable submissions.
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#fff",
                      boxShadow: 3,
                      height: "200px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      position: "relative",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.4)",
                      },
                    }}
                  >
                    <ListAltIcon
                      sx={{ fontSize: 50, color: "#ff9800" }}
                    />
                    <Typography
                      variant="h6"
                      sx={{ mt: 2, color: "#001660" }}
                      className="Nasaliza"
                    >
                      Streamlined, Step-by-Step Process
                    </Typography>
                    <Typography variant="body2">
                      Navigate through the application with ease using our clear, intuitive design that simplifies complex policy requirements.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </ThemeProvider>
        </Box>
      </Box>
      <Box>
        <Box
          sx={{
            padding: { xs: "20px", md: "40px" },
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Grid container spacing={4}>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: "100%",
                  height: "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "2rem",
                }}
              >
                <Typography variant="h6" sx={{ color: "gray" }}>
                  <img src={submission} alt="submissionintake" height= "100%" />
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: "center", md: "left" }, marginTop: "6rem", marginLeft: "3rem" }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    marginTop: "10px",
                    color: "#001660",
                
                  hyphens: 'auto',
                  
                  '& > span': { display: 'inline-block' }
                  }}
                  className="Nasaliza"
                >
                  Streamline Your Submission Process Today with Our Futuristic Portal
                </Typography>
                <Typography sx={{ marginTop: "20px", color: "black",
                  textAlign: 'justify',
                  hyphens: 'auto',
                  wordBreak: 'break-word',
                  '& > span': { display: 'inline-block' }}}>
                  Our intuitive portal offers a seamless experience
                  for submitting and validating your policy details,
                  with step-by-step guidance and cutting-edge address
                  validation, ensuring a smooth and error-free process.
                </Typography>
                <Box
                  sx={{
                    marginTop: "30px",
                    display: "flex",
                    justifyContent: { xs: "center", md: "left" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocationOnIcon
                        sx={{
                          fontSize: 20,
                          marginRight: 1,
                          color: "primary.main",
                        }}
                      />
                      <div>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "#001661" }}
                          className="Nasaliza"
                        >
                          Precise Address Validation with Google API
                        </Typography>
                      </div>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CheckCircleIcon
                        sx={{ fontSize: 20, marginRight: 1, color: "green" }}
                      />
                      <div>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "#001661" }}
                          className="Nasaliza"
                        >
                          Effortless Policy Submission
                        </Typography>
                      </div>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <GroupIcon
                        sx={{ fontSize: 20, marginRight: 1, color: "orange" }}
                      />
                      <div>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "#001661" }}
                          className="Nasaliza"
                        >
                          Optimized User Experience
                        </Typography>
                      </div>
                    </Box>
                    {Authorization ? (
                       <Box sx={{ marginTop: "2rem" }}>
                       <StyledButtonComponent
                         buttonWidth={250}
                         onClick={() => navigate("/Demo/SmartQuote")}
                       >
                         Demo
                       </StyledButtonComponent>
                      
                                 <Link href="https://www.youtube.com/watch?v=z3N0RpxUQiw" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                                 <StyledButtonComponent buttonWidth={200} sx={{marginLeft:'20px'}}><PlayCircleFilled sx={{ marginRight: '8px' }} />
                                 Watch Video
                                 </StyledButtonComponent>
                                 </Link>
                             
                     </Box>
                    ) : (
                      <Box sx={{ marginTop: "2rem" }}>
                      <StyledButtonComponent
                        buttonWidth={250}
                        onClick={() => navigate("/requestdemo")}
                      >
                        Request for Demo
                      </StyledButtonComponent>
                     
                                <Link href="https://www.youtube.com/watch?v=z3N0RpxUQiw" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                                <StyledButtonComponent buttonWidth={200} sx={{marginLeft:'20px'}}><PlayCircleFilled sx={{ marginRight: '8px' }} />
                                Watch Video
                                </StyledButtonComponent>
                                </Link>
                             
                    </Box>
                    )}
                  </Box>

                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Footer />
    </>
  );
}
