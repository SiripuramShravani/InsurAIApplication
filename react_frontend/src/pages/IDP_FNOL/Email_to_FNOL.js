import './Email_to_FNOL.css';
import React from 'react';
import { useNavigate } from "react-router-dom";

import Header from '../../components/header';
import Footer from '../../components/footer';
import {
     Grid, Box, Typography,
    useTheme, useMediaQuery, Card, Link
} from '@mui/material';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Email_to_Fnol from '../../assets/Email_to_Fnol.jpg';
import EMF_img from '../../assets/EMF_img.png';

import StyledButtonComponent from "../../components/StyledButton.js";

import './EmailTemplate.css';
import InsureAI_agent from '../../assets/InsureAI_agent.png';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import EmailIcon from '@mui/icons-material/Email';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import AssessmentIcon from '@mui/icons-material/Assessment';

import { keyframes } from '@mui/material/styles';
import { PlayCircleFilled, } from "@mui/icons-material";
const themeBox = {
    spacing: (factor) => `${factor * 8}px`,
};

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




export default function EmailToFnol() {
    const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTab = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();


    return (
        <>
            <Header />
            <ThemeProvider theme={themeStyle}>
                <Box
                    sx={{
                        marginTop: "2rem",
                        paddingTop: "2rem",
                        paddingBottom: isMobile ? "3rem" : "0rem",
                        textAlign: "center",
                        backgroundColor: "#010066",
                        height: isTab ? "auto" : '605px'
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
                          Mail2<span style={{color:'#0B70FF'}}>Claim</span>
                    </Typography>

                    <Grid
                        container
                        spacing={4}
                        sx={{ alignItems: "center", justifyContent: "center", width: '100%', maxWidth: 1200, margin: 'auto' }}
                    >
                        <Grid item xs={12} md={6}>
                            <Box>
                                <ThemeProvider theme={themeStyle}>
                                    <img
                                        src={InsureAI_agent}
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
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h4"
                                component="h1"
                                className="Nasaliza"
                                sx={{
                                    textAlign: 'left',
                                    animation: `${slideInFromTop} 1s ease-out`,
                                }}
                            >
                                Optimize Claims Workflow with <br />Mail2<span style={{color:'#0B70FF'}}>Claim</span>
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    animation: `${slideInFromTop} 1s ease-out`,
                                    fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                                    textAlign: 'justify',
                                    hyphens: 'auto',
                                    wordBreak: 'break-word',
                                    '& > span': { display: 'inline-block' }
                                }}
                            >
                                Our Mail2Claim solution automates claims processing by extracting essential information from emails and attachments. It accelerates claims handling by efficiently organizing and structuring incoming email data.
                            </Typography>
                            {!Authorization ?

                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <StyledButtonComponent
                                        buttonWidth={250}
                                        onClick={() => navigate("/requestdemo")}

                                    >
                                        Request for Demo
                                    </StyledButtonComponent>
                                    
                                        <Link href="https://youtu.be/5nE2aipvMRs" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                                        <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}>  <PlayCircleFilled sx={{ marginRight: '8px' }} />
                                            Watch Video
                                            </StyledButtonComponent>
                                        </Link>
                                

                                </Box> :

                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    <StyledButtonComponent
                                        buttonWidth={150}
                                        onClick={() => navigate("/Demo/Mail2Claim")}
                                    >
                                        Try Now
                                    </StyledButtonComponent>
                                    
                                        <Link href="https://youtu.be/5nE2aipvMRs" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                                        <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}><PlayCircleFilled sx={{ marginRight: '8px' }} />
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
                    </Grid>
                </Box>
            </ThemeProvider>




            <Box
                sx={{
                    marginTop: "2rem",
                    paddingTop: "2rem",
                    paddingBottom: isMobile ? "3rem" : "0rem",
                    textAlign: "center",

                    height: isTab ? "auto" : '405px',
                    justifyContent:"center",
                  
                }}
            >
                <Grid
                        container
                        spacing={4}
                        sx={{ alignItems: "center", justifyContent: "center", width: '100%', maxWidth: 1200, margin: 'auto' }}
                    >

                        <Grid item xs={12} md={5} textAlign={'left'}>
                            <Typography variant="h4" className="Nasaliza">
                                Streamline Claims Intake with
                                &nbsp;
                                <Box component="span" variant="h1" color="primary.main">
                                    AI-Powered Email Processing
                                </Box>
                            </Typography>
                            <Typography variant="body1" sx={{
                                fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                                textAlign: 'justify',
                                hyphens: 'auto',
                                wordBreak: 'break-word',
                                '& > span': { display: 'inline-block' }
                            }}>
                                Our Mail2Claim solution automates the claims intake process by intelligently extracting key information from emails and attachments. This solution accelerates claims management by efficiently organizing and processing email data, ensuring faster response times and improved accuracy in claim handling.
                            </Typography>



                        </Grid>


                        <Grid item xs={12} md={5} sx={{
                            backgroundColor: "white",
                            borderRadius: "15px",
                            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                       marginLeft:"2rem"
                        }}>
                            <img src={EMF_img} alt='EMF_img' style={{
                                width: '100%',
                                height: 'auto',

                            }} />

                        </Grid>


                 
                    </Grid>


            
            </Box>




            <Box sx={{ background: 'linear-gradient(45deg, #000428, #004e92)', padding:themeBox.spacing(4) }}>
                <Box sx={{ color: 'white' }}>

                    <Typography sx={{ fontSize: '2rem' }} className='Nasaliza'>Advanced Claims Processing Automation</Typography>
                    <Typography sx={{ margin: isMobile ? '0px' : '0rem 10rem', justifyContent: 'center', fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif" }}>Our solution revolutionizes claims handling with seamless email data extraction, effortless document management, and optimized data organization. Experience a streamlined process where critical information is swiftly parsed from emails and attachments, and structured for maximum efficiency and accuracy.</Typography>
                </Box>
                <Grid
                        container
                        spacing={4}
                        sx={{ justifyContent: "center", width: '100%', maxWidth: 1200, margin: 'auto' }}
                     className="idpcards-container">
                    <Grid item xs={12} md={4}>
                        <Card variant="outlined" className="idp_cards" sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: theme.spacing(2),
                            padding: theme.spacing(3),
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            color: '#fff',
                        }}>
                            <div className="img_box" style={{ textAlign: 'center' }}>
                                <EmailIcon sx={{ fontSize: 80, color: "#0B70FF" }} />
                            </div>
                            <Typography variant="h4" className="card-titleIDP Nasaliza" sx={{ textAlign: 'center' }}>
                                Automated Mail Parsing and Data Extraction
                            </Typography>
                            <Typography className="idp-para" sx={{ textAlign: 'center' }}>
                                The Mail2Claim solution reads the content of emails and extracts pertinent information required for claim handling.
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card variant="outlined" className="idp_cards" sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: theme.spacing(2),
                            padding: theme.spacing(3),
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            color: '#fff',
                        }}>
                            <div className="img_box" style={{ textAlign: 'center' }}>
                                <PictureAsPdfIcon sx={{ fontSize: 80, color: "green" }} />
                            </div>
                            <Typography variant="h4" className="card-titleIDP Nasaliza" sx={{ textAlign: 'center' }}>
                                Handle Text and PDF Attachments with Ease
                            </Typography>
                            <Typography className="idp-para" sx={{ textAlign: 'center' }}>
                                Our solution can handle text and PDF attachments, extracting data and images for further processing.
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card variant="outlined" className="idp_cards" sx={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: theme.spacing(2),
                            padding: theme.spacing(3),
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            color: '#fff',
                        }}>
                            <div className="img_box" style={{ textAlign: 'center' }}>
                                <AssessmentIcon sx={{ fontSize: 80, color: "orange" }} />
                            </div>
                            <Typography variant="h4" className="card-titleIDP Nasaliza" sx={{ textAlign: 'center' }}>
                                Efficient Organization of Extracted Information
                            </Typography>
                            <Typography className="idp-para" sx={{ textAlign: 'center', fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif" }}>
                                The extracted information is organized into a structured format for claims handlers, improving efficiency and accuracy.
                            </Typography>
                        </Card>
                    </Grid>
                </Grid>
            </Box>




            <Grid marginTop={'4rem'}></Grid>

            <Box sx={{
                flexGrow: 1, padding: 2, width: "100%",
                maxWidth:1200, margin: 'auto'
            }}>

                <Grid container spacing={2}>

                    <Grid item xs={12} md={6} style={{ marginLeft: "2rem" }} sx={{

                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: theme.spacing(2),
                        padding: theme.spacing(3),
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',

                    }}>
                        <Box>
                            <img
                                src={Email_to_Fnol}
                                alt="Flow Chart"

                                style={{ width: "100%", height: "auto" }}
                            />

                        </Box>
                    </Grid>

                    <Grid item xs={12} md={5} style={{ justifyContent: 'center' }} >
                        <Box >
                            <Typography variant="h5" className='Nasaliza' >Automate Claims Processing with Mail2<span style={{color:'#0B70FF'}}>Claim</span></Typography>
                            <Grid m={"2rem"}></Grid>
                            <Typography variant="body1" justifySelf={"center"} maxWidth={"410px"} margin={"auto"} sx={{
                                fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                                textAlign: 'justify',
                                hyphens: 'auto',
                                wordBreak: 'break-word',
                                '& > span': { display: 'inline-block' }
                            }}>
                                Our Mail2Claim solution automates claims processing by extracting essential information from emails and attachments. It accelerates claims handling by efficiently organizing data for claims handlers.
                            </Typography>
                        </Box>
                        <Grid container justifyContent={isMobile ? 'center' : 'center'} style={{ marginTop: '16px' }}>

                            {
                                Authorization ? (
                                    <Box>
                                        <StyledButtonComponent
                                            buttonWidth={150}
                                            onClick={() => navigate("/Demo/Mail2Claim")}
                                        >
                                            Try Now
                                        </StyledButtonComponent>
                                        <Link href="https://youtu.be/5nE2aipvMRs" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                                            <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}>
                                                <PlayCircleFilled sx={{ marginRight: '8px' }} />
                                                Watch Video
                                            </StyledButtonComponent>
                                        </Link>
                                    </Box>
                                ) : (
                                    <Box>
                                        <StyledButtonComponent
                                            buttonWidth={250}
                                            onClick={() => navigate("/requestdemo")}
                                        >
                                            Request for Demo
                                        </StyledButtonComponent>
                                        <Link href="https://youtu.be/5nE2aipvMRs" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                                            <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}>
                                                <PlayCircleFilled sx={{ marginRight: '8px' }} />
                                                Watch Video
                                            </StyledButtonComponent>
                                        </Link>
                                    </Box>

                                )
                            }
                        </Grid>
                    </Grid>

                </Grid>
            </Box>





            <Footer />
        </>
    );
}

