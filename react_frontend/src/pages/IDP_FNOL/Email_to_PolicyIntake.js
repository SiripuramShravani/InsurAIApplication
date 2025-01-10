import './Email_to_FNOL.css';
import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../../components/header';
import Footer from '../../components/footer';
import { Container, Grid, Box, Typography, Link, useTheme, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, Card, CardContent, Paper, } from '@mui/material';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import StyledButtonComponent from "../../components/StyledButton.js";
import './EmailTemplate.css';
import EmailtoPolicyIntake from '../../assets/EmailtoPolicyIntake.png';
import PolicyHandel from '../../assets/PolicyHandel.png';
import AutoPolicy from '../../assets/AutoPolicy.png';
import { keyframes } from '@mui/material/styles';
import TextPdfIcon from '../../assets/TextPdfIcon.png'
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import EmailIcon from '@mui/icons-material/Email';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SpeedIcon from '@mui/icons-material/Speed';
import { PlayCircleFilled, } from "@mui/icons-material";
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SEO from '../../SEO/SEO.js';
const slideInFromTop = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
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
});

export default function EmailToPolicyIntake() {
  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTab = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  return <>

    <Header />
    <SEO location={'/mail-2-quote'}/>
    <h2 style={{ position: 'absolute',width: '1px',height: '1px',margin: '-1px',padding: '0',overflow: 'hidden',clip: 'rect(0, 0, 0, 0)',border: '0', }}>Email to Submission Solution</h2>  
   
    <ThemeProvider theme={themeStyle}>
      <Box
        sx={{
          marginTop: "2rem",
          paddingTop: "2rem",
          paddingBottom: isMobile ? "3rem" : "0rem",
          textAlign: "center",
          backgroundColor: "#010066",
          height: isTab ? "auto" : '635px'
        }}
      >
        <Typography
          sx={{
            fontSize: "2rem",
            paddingTop: '2.2rem',
            color: 'White',

          }}
          className="Nasaliza"
        >
          Mail2<span style={{ color: '#0B70FF' }}>Quote</span>
        </Typography>

        <Grid
          container
          spacing={4}
          sx={{ alignItems: "center", justifyContent: "center", width: '100%', maxWidth: 1200, margin: 'auto', marginTop: '-2rem' }}
        >
          <Grid item xs={12} md={6}>
            <h1
              variant="h1"
              component="h1"
              className="Nasaliza"
              style={{
                animation: `${slideInFromTop} 1s ease-out`,
                textAlign: 'justify',
                hyphens: 'auto',
                wordBreak: 'break-word',
                '& > span': { display: 'inline-block' },
                fontSize: '2.0rem'
                ,color:'white'

              }}
            >
              Enhance Submission Workflow with AI-Driven Mail Processing
            </h1>
            <Typography
              variant="body1"
              sx={{
                animation: `${slideInFromTop} 1s ease-out`,
                fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                marginTop: '1rem',
                textAlign: 'justify',
                hyphens: 'auto',
                wordBreak: 'break-word',
                '& > span': { display: 'inline-block' }

              }}
            >
              Our Mail2Quote solution automates the submission intake process by intelligently extracting key information from emails and attachments. This solution accelerates submission management by efficiently organizing and processing email data, ensuring faster response times and improved accuracy in policy handling.
            </Typography>
            {!Authorization ?

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <StyledButtonComponent
                  buttonWidth={250}
                  onClick={() => navigate("/requestdemo")}

                >
                  Request for Demo
                </StyledButtonComponent>

                <Link href="https://www.youtube.com/watch?v=35AhAC1McDA" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                  <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
                    Watch Video
                  </StyledButtonComponent>
                </Link>

              </Box> :

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <StyledButtonComponent
                  buttonWidth={150}
                  onClick={() => navigate("/Demo/mail-2-quote")}
                >
                  Try Now
                </StyledButtonComponent>

                <Link href="https://www.youtube.com/watch?v=35AhAC1McDA" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                  <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}>  <PlayCircleFilled sx={{ marginRight: '8px' }} />
                    Watch Video
                  </StyledButtonComponent>
                </Link>

              </Box>
            }
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                className="Nasaliza"
                sx={{
                  fontWeight: 'bold',
                  paddingTop: '5px',
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  color: 'white',
                }}
              >
                <ContactMailIcon sx={{ marginRight: '10px', fontSize: '1.5rem', color: 'white' }} />
                Contact us for a free POC
              </Typography>

            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <ThemeProvider theme={themeStyle}>
                <img
                  src={EmailtoPolicyIntake}
                  alt='InsureAI_agent'
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    animation: `${slideInFromTop} 1s ease-out`,
                  }}
                />
              </ThemeProvider>
            </Box>
          </Grid>

        </Grid>
      </Box>
    </ThemeProvider>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ fontWeight: 'bold', color: '#3f51b5', mb: 3 }} className="Nasaliza"
      >
        Streamline Submission Process with Automated Mail Parsing
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 2,
              boxShadow: 3,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <img src={TextPdfIcon} alt='TextPdfIcon' height={50} />

              </Box>
              <Typography
                variant="h6"
                gutterBottom
                align="left"
                sx={{ fontWeight: 'bold', mb: 1 }} className="Nasaliza"
              >
                Effortlessly Handle Text and PDF Attachments
              </Typography>
              <Typography variant="body1" sx={{
                color: '#555',
                textAlign: 'justify',
                hyphens: 'auto',
                wordBreak: 'break-word',
                '& > span': { display: 'inline-block' }
              }}>
                Our AI-driven Mail2Quote solution automatically processes various document formats, including PDF, Word, and TXT files. It seamlessly extracts and organizes essential information for policy submissions, ensuring a streamlined workflow.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 2,
              boxShadow: 3,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <img src={PolicyHandel} alt='PolicyHandel' height={50} />
              </Box>
              <Typography
                variant="h6"
                gutterBottom
                align="left"
                sx={{ fontWeight: 'bold', mb: 1 }} className="Nasaliza"
              >
                Efficiently Organize Extracted Information for Improved Efficiency
              </Typography>
              <Typography variant="body1" sx={{
                color: '#555',
                textAlign: 'justify',
                hyphens: 'auto',
                wordBreak: 'break-word',
                '& > span': { display: 'inline-block' }
              }}>
                Our  Mail2Quote solution scans emails and attachments, pulls out key information for submissions, and organizes it clearly for easy future access.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 2,
              boxShadow: 3,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <img src={AutoPolicy} alt='AutoPolicy' height={50} />
              </Box>
              <Typography
                variant="h6"
                gutterBottom
                align="left"
                sx={{ fontWeight: 'bold', mb: 1 }} className="Nasaliza"
              >
                Optimize Submission Workflow with Advanced Automation
              </Typography>
              <Typography variant="body1" sx={{
                color: '#555',
                textAlign: 'justify',
                hyphens: 'auto',
                wordBreak: 'break-word',
                '& > span': { display: 'inline-block' }
              }}>
                Enhance your submission workflow with our cutting-edge solution. Effortlessly process text and PDF attachments, extracting essential data to optimize efficiency and accelerate review times.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>





    <Box
      sx={{

        height: isMobile ? "100%" : "450px",
        width: '100%', maxWidth: 1200, margin: 'auto'
      }}
    >
      <Paper sx={{
        marginTop: '2rem', backgroundColor: "white",
        borderRadius: "15px", padding: "3rem",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
      }}>

        <Container maxWidth="lg">
          <Grid container spacing={4} >
            <Grid item xs={12} md={6} textAlign={'left'}>
              <Typography variant="h4" className="Nasaliza"
                sx={{
                  textAlign: 'justify',
                  hyphens: 'auto',
                  wordBreak: 'break-word',
                  '& > span': { display: 'inline-block' }
                }}>
                Streamline Policy Handling with Mail2<span style={{ color: '#0B70FF' }}>Quote</span>

              </Typography>
              <Typography variant="body1" sx={{
                fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif", marginTop: "2rem",
                textAlign: 'justify',
                hyphens: 'auto',
                wordBreak: 'break-word',
                '& > span': { display: 'inline-block' }
              }}>
                Our  Mail2Quote solution streamlines policy management by automatically extracting crucial information from emails and attachments. It speeds up policy processing by effectively organizing and structuring the incoming data for improved efficiency.
              </Typography>
              {!Authorization ?

                <Box sx={{ mt: 2, textAlign: 'left' }}>
                  <StyledButtonComponent
                    buttonWidth={250}
                    onClick={() => navigate("/requestdemo")}

                  >
                    Request for Demo
                  </StyledButtonComponent>

                  <Link href="https://www.youtube.com/watch?v=35AhAC1McDA" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                    <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}><PlayCircleFilled sx={{ marginRight: '8px' }} />
                      Watch Video
                    </StyledButtonComponent>
                  </Link>
                </Box> :

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <StyledButtonComponent
                    buttonWidth={150}
                    onClick={() => navigate("/Demo/mail-2-quote")}
                  >
                    Try Now
                  </StyledButtonComponent>

                  <Link href="https://www.youtube.com/watch?v=35AhAC1McDA" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                    <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
                      Watch Video
                    </StyledButtonComponent>
                  </Link>

                </Box>
              }


            </Grid>
            <Grid item xs={12} md={6} textAlign={'left'}>

              <List>
                <ListItem>
                  <ListItemIcon>
                  </ListItemIcon>
                  <EmailIcon sx={{ color: '#3f51b5', marginRight: "0.6rem" }} />
                  <ListItemText primary="Automates extraction of key information from emails." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                  </ListItemIcon>
                  <PictureAsPdfIcon sx={{ color: '#3f51b5', marginRight: "0.6rem" }} />
                  <ListItemText primary="Handles all document attachments with ease." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                  </ListItemIcon>
                  <FolderOpenIcon sx={{ color: '#3f51b5', marginRight: "0.6rem" }} />
                  <ListItemText primary="Organizes and structures incoming data efficiently." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                  </ListItemIcon>
                  <SpeedIcon sx={{ color: '#3f51b5', marginRight: "0.6rem" }} />
                  <ListItemText primary="Improves overall policy processing speed." />
                </ListItem>
              </List>
            </Grid >



          </Grid>


        </Container>
      </Paper>

    </Box>
    <Grid marginTop={'5rem'}></Grid>
    <Footer />
  </>

}