import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import {
    Container, Grid, Box, Typography, useTheme, useMediaQuery, Link
} from '@mui/material';
import { motion } from "framer-motion";

import DataUsageIcon from '@mui/icons-material/DataUsage';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import { useInView } from 'react-intersection-observer';

import { ThemeProvider, createTheme } from "@mui/material/styles";
import StyledButtonComponent from "../../components/StyledButton";

import { keyframes } from '@mui/material/styles';
import IDPPOLICY from '../../assets/IDPPOLICY.png'
import PolicyIntake from '../../assets/PolicyIntake.png'

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { PictureAsPdf, Image, Description, TextSnippet, PlayCircleFilled } from '@mui/icons-material';
// import { motion } from 'framer-motion';
import ContactMailIcon from '@mui/icons-material/ContactMail';

const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const processSteps = [
    { icon: <PictureAsPdf fontSize="large" />, title: "PDFs" },
    { icon: <Image fontSize="large" />, title: "Images" },
    { icon: <Description fontSize="large" />, title: "Documents" },
    { icon: <TextSnippet fontSize="large" />, title: "Text Files" },
];

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
const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const contentVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.4 } },
};
const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

const features = [
    {
        icon: <DataUsageIcon style={{ color: "#1e88e5", fontSize: 40 }} />,
        title: "Data Extraction Made Simple",
        description: "Effortlessly extract data from various file formats.",
    },
    {
        icon: <LocationOnIcon style={{ color: "#ef5350", fontSize: 40 }} />,
        title: "Validating Addresses with Precision",
        description: "Ensure accurate address validation using cutting-edge technology.",
    },
    {
        icon: <AutoAwesomeMotionIcon style={{ color: "#ffa726", fontSize: 40 }} />,
        title: "Effortless Automation, Enhanced Efficiency",
        description: "Automate your document processing workflows for improved productivity.",
    },
];
export default function IdpPolicyIntake() {
    const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTab = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const isScreen = useMediaQuery('(max-width:900px)');
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 }); //section-2
    return <>

        <Header />
        <ThemeProvider theme={themeStyle}>
            <Box
                sx={{
                    marginTop: "1rem",
                    paddingTop: "2rem",
                    paddingBottom: isMobile ? "3rem" : "0rem",
                    textAlign: "center",
                    //   backgroundColor: "#010066",
                    bgcolor: "#f0f4fa",
                    height: isTab ? "auto" : '605px'
                }}
            >
                <Typography
                    sx={{
                        fontSize: "2rem",

                        color: 'blue',

                    }}
                    className="Nasaliza"
                >
                     Doc<span style={{ color: '#0B70FF' }}>AI</span><sup style={{position: 'relative', top: '-1rem', right: '-0.1rem', fontSize: '0.5rem'}}>TM</sup>&nbsp;Quote
                </Typography>

                <Grid
                    container
                    spacing={4}
                    sx={{ alignItems: "center", justifyContent: "center", width: '100%', maxWidth: 1200, margin: 'auto' }}
                >
                    <Grid item xs={12} md={6}>
                        <Box>

                            <img
                                src={IDPPOLICY}
                                alt='IDPPOLICY'
                                style={{

                                    maxWidth: '100%',
                                    maxHeight: '100%',
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
                                textAlign: 'left',
                                animation: `${slideInFromTop} 1s ease-out`, color: "black"
                            }}
                        >
                            Revolutionize Your Policy Submission
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'blue',
                                animation: `${slideInFromTop} 1s ease-out`,
                                fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                                textAlign: 'justify',
                                hyphens: 'auto',
                                wordBreak: 'break-word',
                                '& > span': { display: 'inline-block' }
                            }}
                        >
                            Experience the future of Policy Submission with our
                            AI-powered DocAI Quote solution. Seamlessly extract, analyze,
                            and organize critical information from complex insurance documents
                            in seconds.
                        </Typography>
                        {!Authorization ?

                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <StyledButtonComponent
                                    buttonWidth={250}
                                    onClick={() => navigate("/requestdemo")}

                                >
                                    Request for Demo
                                </StyledButtonComponent>
                               
                                    <Link href="https://www.youtube.com/watch?v=1Hs5l9rpZlU" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                                    <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
                                        Watch Video
                                        </StyledButtonComponent>
                                    </Link>
                              

                            </Box> :

                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <StyledButtonComponent
                                    buttonWidth={150}
                                    onClick={() => navigate("/Demo/DocAIQuote")}
                                >
                                    Try Now
                                </StyledButtonComponent>
                               
                                    <Link href="https://www.youtube.com/watch?v=1Hs5l9rpZlU" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
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
                                    color: '#001660',
                                }}
                            >
                                <ContactMailIcon sx={{ marginRight: '10px', fontSize: '1.5rem', color: '#001660' }} />
                                Contact us for a free POC
                            </Typography>

                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>

        <Box sx={{ backgroundColor: '#000166', color: 'white', height: isScreen ? "auto" : '450px', width: '100%', margin: 'auto', paddingTop: '1rem' }}>


            {/* Main Content */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={contentVariants}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center", margin: " 1rem auto" }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={4} alignItems="center" justifyContent='center'>
                            {/* //section-2 */}
                            <motion.div
                                ref={ref}
                                initial="hidden"
                                animate={inView ? "visible" : "hidden"}
                                variants={cardVariants}
                            >
                                <Box ref={ref} sx={{ padding: "2rem 1rem", textAlign: "center", width: '100%', maxWidth: 1100, margin: 'auto', height: isScreen ? "auto" : '250px' }}>
                                    <Typography variant="h5" sx={{ mb: 4 }} className="Nasaliza">
                                        Streamline Policy Submission with our <br />Doc<span style={{color:'#0B70FF'}}>AI</span> Quote solution
                                    </Typography>
                                    <Grid container spacing={3} justifyContent="center">
                                        {features.map((feature, index) => (

                                            <Grid
                                                key={index}
                                                item
                                                xs={12}
                                                sm={6}
                                                md={4}
                                                component={motion.div}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                                transition={{ duration: 0.5, delay: index * 0.3 }}
                                            >
                                                <motion.div
                                                    initial="hidden"
                                                    animate={inView ? "visible" : "hidden"}
                                                    variants={cardVariants}
                                                >
                                                    <Box
                                                        sx={{
                                                            padding: "2rem 2rem",
                                                            borderRadius: "12px",
                                                            backgroundColor: "#fff",
                                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                            textAlign: 'left'
                                                        }}
                                                    >
                                                        <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                                                        <Typography variant="h6" sx={{ mb: 1, color: "black" }} className="Nasaliza">
                                                            {feature.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            {feature.description}
                                                        </Typography>
                                                    </Box>
                                                </motion.div>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </motion.div>
                        </Grid>
                    </Container>
                </Box>
            </motion.div>
        </Box>




        <Container sx={{ padding: '2rem 0', textAlign: 'center' }}>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold', color: "#001660", marginBottom: "1.5rem" }}>
                    How does it work?
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: "700px", margin: "auto", marginBottom: "2rem", color: "#555" }}>
                    Our DocAI Quote system extracts data from various file formats such as PDFs, images, documents, and text files, and converts them into a structured format. We utilize generative AI and computer vision technology to automate the extraction and analysis process.
                </Typography>
            </motion.div>

            <Grid container spacing={4} justifyContent="center">
                {processSteps.map((step, index) => (
                    <Grid key={index} item xs={12} sm={6} md={3} component={motion.div} variants={itemVariants}>
                        <Box
                            sx={{
                                padding: "1.5rem",
                                borderRadius: "12px",
                                backgroundColor: "#f5f5f5",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                transition: "transform 0.3s ease-in-out",
                                '&:hover': { transform: "translateY(-10px)" },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}
                        >
                            <Box sx={{ marginBottom: "1rem", color: theme.palette.primary.main }}>
                                {step.icon}
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: "0.5rem", color: "#001660", }}>
                                {step.title}
                            </Typography>
                           
                        </Box>
                    </Grid>
                ))}
            </Grid>


        </Container>

        <ThemeProvider theme={themeStyle}>
            <Box
                sx={{

                    paddingBottom: isMobile ? "3rem" : "0rem",
                    textAlign: "center",
                    //   backgroundColor: "#010066",
                    height: isTab ? "auto" : '605px', bgcolor: "#f0f4fa"
                }}
            >

                <Grid
                    container
                    spacing={4}
                    sx={{ alignItems: "center", justifyContent: "center", width: '100%', maxWidth: 1200, margin: 'auto' }}
                >    <Grid item xs={12} md={6}>
                        <Typography
                            variant="h4"
                            component="h1"
                            className="Nasaliza"
                            sx={{
                                textAlign: 'left',
                                animation: `${slideInFromTop} 1s ease-out`, color: "#001660"
                            }}
                        >
                            Streamline Submission with Our  Doc<span style={{color:'#0B70FF'}}>AI</span> Solution
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'black',
                                animation: `${slideInFromTop} 1s ease-out`,
                                fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                                textAlign: 'justify',
                                hyphens: 'auto',
                                wordBreak: 'break-word',
                                '& > span': { display: 'inline-block' }
                            }}
                        >
                            Our DocAI Quote solution revolutionizes Policy Submission, enabling swift and accurate data extraction. With automated workflows, businesses can increase efficiency, reduce manual effort, and improve data quality.
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Box display="flex" alignItems="center" mb={1}>
                                <AutoAwesomeIcon sx={{ mr: 1, color: 'green' }} />
                                <Typography variant="body1" color={'blue'}>
                                    Automate document processing for increased efficiency.
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mb={1}>
                                <EngineeringIcon sx={{ mr: 1, color: 'green' }} />
                                <Typography variant="body1" color={'blue'}>
                                    Reduce manual effort with our streamlined DocAI solution.
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mb={1}>
                                <PrecisionManufacturingIcon sx={{ mr: 1, color: 'green' }} />
                                <Typography variant="body1" color={'blue'}>
                                    Improve data quality with accurate and structured document extraction.
                                </Typography>
                            </Box>
                        </Box>
                        {!Authorization ?

                            <Box sx={{ mt: 2, textAlign: 'left' }}>
                                <StyledButtonComponent
                                    buttonWidth={250}
                                    onClick={() => navigate("/requestdemo")}

                                >
                                    Request for Demo
                                </StyledButtonComponent>
                               
                                    <Link href="https://www.youtube.com/watch?v=1Hs5l9rpZlU" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                                    <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}>  <PlayCircleFilled sx={{ marginRight: '8px' }} />
                                        Watch Video
                                        </StyledButtonComponent>
                                    </Link>
                               </Box> :

                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <StyledButtonComponent
                                    buttonWidth={150}
                                    onClick={() => navigate("/Demo/DocAIQuote")}
                                >
                                    Try Now
                                </StyledButtonComponent>
                              
                                    <Link href="https://www.youtube.com/watch?v=1Hs5l9rpZlU" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                                    <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
                                        Watch Video
                                        </StyledButtonComponent>
                                    </Link>
                               
                            </Box>
                        }
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box>
                            <ThemeProvider theme={themeStyle}>
                                <img
                                    src={PolicyIntake}
                                    alt='IdpPolicyIntake'
                                    style={{

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
        <Footer />
    </>
}