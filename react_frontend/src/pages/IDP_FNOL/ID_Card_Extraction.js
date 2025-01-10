import React from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useNavigate } from "react-router-dom";
import {
    Container, Grid, Box, Typography, useTheme, useMediaQuery, keyframes, ThemeProvider, createTheme, Card, CardContent,Link
} from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'; // Futuristic icon for Fast Processing
import SecurityIcon from '@mui/icons-material/Security'; // Futuristic icon for Security


import LockIcon from '@mui/icons-material/Lock'; // Icon for Confidential Handling

import ContactMailIcon from '@mui/icons-material/ContactMail';
import StyledButtonComponent from "../../components/StyledButton";
import { Analytics as AnalyticsIcon } from '@mui/icons-material';
import IDPiDCard from '../../assets/IDPiDCard.png';
import IDCardencrypt from '../../assets/IDCardencrypt.png';
import {  PlayCircleFilled,} from "@mui/icons-material"; 
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
                    borderRadius: '16px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    backgroundColor: '#fff', // Set card background to white
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%', // Ensure cards take up full height
                    '&:hover': {
                        animation: `${cardHoverEffect} 0.3s ease-out forwards`,
                    },
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                h6: {
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                },
                body2: {
                    fontSize: '0.875rem',
                },
            },
        },
    },
});

export default function IDCardExtraction() {
    const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTab = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    

    return (
        <>
            <Header />
            <ThemeProvider theme={themeStyle} sx={{ margin: '0px' }}>
                <Box
                    sx={{
                        marginTop: "1rem",
                        paddingTop: "2rem",
                        paddingBottom: isMobile ? "3rem" : "0rem",
                        textAlign: "center",
                        bgcolor: "#010066",
                        height: isTab ? "auto" : '600px'
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "2rem",
                            color: 'white',
                            marginTop: '2rem'
                        }}
                        className="Nasaliza"
                    >
                          Doc<span style={{ color: '#0B70FF' }}>AI</span><sup style={{position: 'relative', top: '-0.9rem', right: '-0.1rem', fontSize: '0.5rem'}}>TM</sup>&nbsp;ID&nbsp;
                    </Typography>

                    <Grid
                        container
                        spacing={3}
                        sx={{ alignItems: "center", justifyContent: "center", width: '100%', maxWidth: 1200, margin: 'auto', marginTop: '-3rem'}}
                    >
                        <Grid item xs={12} md={6}>
                            <Box>
                                <img
                                    src={IDPiDCard}
                                    alt='IDPiDCard'
                                    style={{
                                        maxWidth: 'auto',
                                        maxHeight: 'auto',
                                        animation: `${slideInFromTop} 1s ease-out`,
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h4"
                                component="h1"
                                className="Nasaliza"
                                sx={{
                                    animation: `${slideInFromTop} 1s ease-out`,
                                    fontSize: "30px",
                                    color: "white",
                                    textAlign: 'justify',
                                    hyphens: 'auto',
                                    wordBreak: 'break-word',
                                    '& > span': { display: 'inline-block' }
                                }}
                            >
                                Effortless ID Data Extraction
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'white',
                                    marginTop: "1rem",
                                    animation: `${slideInFromTop} 1s ease-out`,
                                    fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                                    textAlign: 'justify',
                                    hyphens: 'auto',
                                    wordBreak: 'break-word',
                                    '& > span': { display: 'inline-block' }
                                }}
                            >
                                Experience the future of ID extraction with our state-of-the-art  DocAI ID Extraction solution. Powered by advanced LLMs and computer vision, we deliver unmatched precision, achieving over 95% accuracy in data extraction.
                            </Typography>
                            {!Authorization ?
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <StyledButtonComponent
                                        buttonWidth={250}
                                        onClick={() => navigate("/requestdemo")}
                                    >
                                        Request for Demo
                                    </StyledButtonComponent>
                                  
                          <Link href="https://www.youtube.com/watch?v=ckA_59Y2Y3I" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                          <StyledButtonComponent buttonWidth={200} sx={{marginLeft:'20px'}}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
                          Watch Video
                          </StyledButtonComponent>
                          </Link>
                        
                                </Box> :
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <StyledButtonComponent
                                        buttonWidth={150}
                                        onClick={() => navigate("/demo/idcardextraction")}
                                    >
                                        Try Now
                                    </StyledButtonComponent>
                                 
                          <Link href="https://www.youtube.com/watch?v=ckA_59Y2Y3I" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                          <StyledButtonComponent buttonWidth={200} sx={{marginLeft:'20px'}}><PlayCircleFilled sx={{ marginRight: '8px' }} />
                          Watch Video
                          </StyledButtonComponent>
                          </Link>
                        
                                </Box>
                            }
                             <Box sx={{textAlign:'center'}}>
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
                    </Grid>
                </Box>
            </ThemeProvider>

            <Box sx={{ backgroundColor: 'rgb(240 249 255)', margin: '0px', paddingTop: '2px', paddingBottom: '2px' }}>
                <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto' }}>
                    <ThemeProvider theme={themeStyle}>
                        <Container maxWidth="lg" sx={{ mt: 5, mb: 5, color: '#001660' }}>
                            <Typography variant="h3" component="h1" gutterBottom className="Nasaliza">
                                Extract Data from Your ID Cards
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 4, color: 'black' }}>
                                Our ID extraction technology simplifies the process of data extraction. By utilizing advanced computer vision and machine learning techniques, we ensure accurate and efficient extraction of information.
                            </Typography>

                            <Grid container spacing={4} justifyContent="flex-end">
                                <Grid item xs={12} md={4}>
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: '#fff', // Card background color
                                            boxShadow: 3,
                                            height: '200px', // Set a fixed height for uniformity
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center', // Center icons horizontally
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            position: 'relative',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)',
                                            },
                                        }}
                                    >
                                        <RocketLaunchIcon sx={{ fontSize: 50, color: "#1976d2" }} />
                                        <Typography variant="h6" sx={{ mt: 2, color: '#001660' }} className="Nasaliza">
                                            Fast and Efficient Data Processing
                                        </Typography>
                                        <Typography variant="body2">
                                            Our system processes ID data in seconds, enhancing workflow efficiency.
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: '#fff', // Card background color
                                            boxShadow: 3,
                                            height: '200px', // Set a fixed height for uniformity
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center', // Center icons horizontally
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            position: 'relative',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)',
                                            },
                                        }}
                                    >
                                        <SecurityIcon sx={{ fontSize: 50, color: "#dc004e" }} />
                                        <Typography variant="h6" sx={{ mt: 2, color: '#001660' }} className="Nasaliza">
                                            Robust Security for Your Data
                                        </Typography>
                                        <Typography variant="body2">
                                            We prioritize your data's security with advanced encryption and secure handling protocols.
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: '#fff', // Card background color
                                            boxShadow: 3,
                                            height: '200px', // Set a fixed height for uniformity
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center', // Center icons horizontally
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            position: 'relative',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)',
                                            },
                                        }}
                                    >
                                        <AnalyticsIcon sx={{ fontSize: 50, color: "#4caf50" }} />
                                        <Typography variant="h6" sx={{ mt: 2, color: '#001660' }} className="Nasaliza">
                                            ID Extraction Accuracy
                                        </Typography>
                                        <Typography variant="body2">
                                            Our cutting-edge technology provides accuracies exceeding 95%, delivering exceptional precision and reliability.
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Container>
                    </ThemeProvider>
                </Box>
            </Box>
            <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6} sx={{ textAlign: "left" }}>
                        <Typography variant="overline" display="block" gutterBottom>
                            Security
                        </Typography>
                        <Typography variant="h3" component="h1" className="Nasaliza">
                            Your Data Security is Our Top Priority
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4 }}>
                            We prioritize data security and ensure that all information is handled with the utmost confidentiality. Trust us to protect your sensitive data while providing seamless ID extraction.
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ display: 'flex', alignItems: 'center', textAlign: 'left', borderLeft: "1px solid blue", height: '180px' }}>

                                    <CardContent>
                                        <SecurityIcon sx={{ fontSize: 40, color: 'blue' }} />
                                        <Typography variant="h6" className="Nasaliza">Data Protection</Typography>
                                        <Typography variant="body2">
                                            Robust encryption safeguards your information at every stage of the extraction process.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card sx={{ display: 'flex', alignItems: 'center', textAlign: 'left', borderLeft: "1px solid blue", height: '180px' }}>


                                    <CardContent >
                                        <LockIcon sx={{ fontSize: 40, color: 'green' }} />
                                        <Typography variant="h6" className="Nasaliza">Confidential Handling</Typography>
                                        <Typography variant="body2">
                                            Our team follows strict protocols to maintain the privacy of your data.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 4 }}>
                        {!Authorization ?
                                <Box sx={{ mt: 2, textAlign: 'left' }}>
                                    <StyledButtonComponent
                                        buttonWidth={250}
                                        onClick={() => navigate("/requestdemo")}
                                    >
                                        Request for Demo
                                    </StyledButtonComponent>
                                  
                            <Link href="https://www.youtube.com/watch?v=ckA_59Y2Y3I" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                            <StyledButtonComponent buttonWidth={200} sx={{marginLeft:'20px'}}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
                            Watch Video
                            </StyledButtonComponent>
                            </Link>
                          
                                </Box> :
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <StyledButtonComponent
                                        buttonWidth={150}
                                        onClick={() => navigate("/demo/idcardextraction")}
                                    >
                                        Try Now
                                    </StyledButtonComponent>
                                  
                            <Link href="https://www.youtube.com/watch?v=ckA_59Y2Y3I" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                            <StyledButtonComponent buttonWidth={200} sx={{marginLeft:'20px'}}><PlayCircleFilled sx={{ marginRight: '8px' }} />
                            Watch Video
                            </StyledButtonComponent>
                            </Link>
                          
                                </Box>
                            }
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box>
                            <img
                                src={IDCardencrypt}
                                alt='IDCardencrypt'
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    animation: `${slideInFromTop} 1s ease-out`,
                                }}
                            />
                        </Box>



                    </Grid>
                </Grid>
            </Container>

            <Footer />
        </>
    );
}
