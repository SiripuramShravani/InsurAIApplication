import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import LS_1 from '../assets/LS_1.png';
import LS_2 from '../assets/LS_2.png';
import DocAILossRun from '../assets/DocAILossRun.png';
import StyledButtonComponent from '../components/StyledButton';
import Loss_Run from '../assets/Loss_Run.png';
import Loss_result from '../assets/Loss_result.png';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Container,
  CardContent,
  Link,
  useTheme,
  useMediaQuery,
  Grid, Card
} from '@mui/material';
import SEO from '../SEO/SEO';
import Header from '../components/header';
import Footer from '../components/footer';

import { css } from "@emotion/css";
import DataObject from "@mui/icons-material/DataObject";
import SpeedIcon from "@mui/icons-material/Speed";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { keyframes } from '@emotion/react';
import { PlayCircleFilled, } from "@mui/icons-material";
import ContactMailIcon from '@mui/icons-material/ContactMail';
const features = [
  {
    title: "Accurate Data Extraction",
    description:
      "Our advanced computer vision technology ensures accurate data extraction, eliminating errors and improving data quality.",
    icon: <DataObject sx={{ fontSize: 50, color: "#1976d2" }} />,
  },
  {
    title: "Enhanced Time Efficiency",
    description:
      "Optimize your operations with our automated data extraction technology. This solution significantly reduces manual processing time, and enhances time efficiency.",
    icon: <SpeedIcon sx={{ fontSize: 50, color: "#1976d2" }} />,
  },
  {
    title: "User-Friendly Interface",
    description:
      "Our intuitive interface makes it easy for anyone to use our data extraction solution, no technical expertise required.",
    icon: <TouchAppIcon sx={{ fontSize: 50, color: "#1976d2" }} />,
  },
];
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(20px);
  }
  to {
    transform: translateY(0);
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



const styles = {
  container: css`
    padding: 2rem;
    text-align: center;
    height: 70vh;
   
  `,
  fadeIn: css`
    animation: fadeIn 2s ease-in-out;
  `,
  uploading: css`
    margin-top: 2rem;
    animation: fadeIn 2s ease-in-out;
  `,
  scanningContainer: css`
    margin-top: 2rem;
    position: relative;
    width: 300px;
    height: 400px;
    background-color: #e0e0e0;
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
  `,
  scanningEffect: css`
    position: relative;
    width: 100%;
    height: 100%;
  `,
  scanLine: css`
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: green;
    animation: scanAnimation 2s linear infinite;
  `,
  jsonData: css`
    margin-top: 2rem;
    padding: 1rem;
    background-color: #e0f7fa;
    text-align: left;
  `,
};

const images = [LS_1, LS_2];





const LossRunReports = () => {
  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [hover, setHovered] = useState(false);
  useEffect(() => {
    const startCycle = () => {
      setUploading(true);
      setJsonData(null);

      setTimeout(() => {
        setUploading(false);
        setScanning(true);

        setTimeout(() => {
          setScanning(false);
          const data = {
            "Policy Number": "HI23001001",
            "Property Address": "123 Main Street Springfield 62701 Illinois USA",
            "Loss Date and Time": "2022-01-15",
            "Loss Location": "9573, Northwest Street, Houston, Texas,77030, USA",
            "Type of Loss": "Fire",
            "Loss Description": "Shoot circuit in my house",
            "Reported By": "John Street Singh",
            "Report Number": "FIRE3727",
            "Police/Fire Department Contacted?": "True",
            "Claim Document": "Claim Note 4 (1).pdf",
          };
          setJsonData(data);
        }, 4000); // Time for scanning effect
      }, 2000); // Time for uploading effect
    };

    startCycle(); // Start the initial cycle

    const interval = setInterval(() => {
      startCycle(); // Restart the cycle every 10 seconds
    }, 10000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  const checked = (val) => {
    if (!Authorization) {
      window.scrollTo(0, 0);
      localStorage.setItem("rout", val);
    } else {
      window.scrollTo(0, 0);
    }
  };

  const [randomImage, setRandomImage] = useState(null);
  useEffect(() => {
    if (scanning) {
      // Function to get a random image
      const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
      };

      // Set the random image
      setRandomImage(getRandomImage());
    }
  }, [scanning]);





  return (
    <>
      <Header />

      <h2 style={{ position: 'absolute',width: '1px',height: '1px',margin: '-1px',padding: '0',overflow: 'hidden',clip: 'rect(0, 0, 0, 0)',border: '0', }}>IDP Loss Run</h2>  
   
      <SEO location={'/doc-ai-loss-run-report'}/>

      <ThemeProvider theme={themeStyle}>
        <Box
          sx={{

            marginTop: "2rem",
            paddingTop: "1rem",
            paddingBottom: "2rem",
            textAlign: "center",
            backgroundColor: "#010066",
            height: "auto",

          }}

        >
          <Typography sx={{ fontSize: "2.3rem", display: "block", paddingTop: '2.4rem', color: 'white' }} className="Nasaliza"  >
            Doc<span style={{ color: '#0B70FF' }}>AI</span><sup style={{ position: 'relative', top: '-1.2rem', right: '-0.1rem', fontSize: '0.5rem' }}>TM</sup> Loss Run
          </Typography>
          <Grid
            container
            spacing={4}
            sx={{ alignItems: "center", justifyContent: "center", width: '100%', maxWidth: 1200, margin: 'auto' }}
          >
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", justifyContent: "center", animation: `${slideIn} 1s ease-in-out` }}>
                <ThemeProvider theme={theme}>
                  <style>{keyframes}</style>

                  <img src={DocAILossRun} alt='DocAILossRun' />
                  {/* </Box> */}
                </ThemeProvider>
              </Box>
            </Grid>
            <Grid item xs={12} md={5} >
              <Typography variant="h1" component="h1" textAlign={'left'} className="Nasaliza" sx={{ animation: `${slideIn} 1s ease-in-out`,fontSize:isMobile?"1.8rem":"2.2rem",color:'white' }}>
                DocAI Loss Run Extraction using Insur<span style={{ color: 'red', fontWeight: 'bold' }}>AI</span>.
              </Typography>

              <Box sx={{ animation: `${slideIn} 1.4s ease-in-out` }}>
                <Typography variant="body1" gutterBottom textAlign={'left'}>
                  <Box component="ul" sx={{ paddingLeft: 2 }} >
                    <Typography component="li" sx={{
                      marginBottom: 1, fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                      textAlign: 'justify',
                      hyphens: 'auto',
                      wordBreak: 'break-word',
                      '& > span': { display: 'inline-block' }
                    }}>
                      Leverage advanced computer vision and LLMs to effortlessly transform PDFs, Excel files, and images into actionable insights.
                    </Typography>
                    <Typography component="li" sx={{
                      marginBottom: 1, fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                      textAlign: 'justify',
                      hyphens: 'auto',
                      wordBreak: 'break-word',
                      '& > span': { display: 'inline-block' }
                    }}>
                      Extract and format critical data with ease or integrate seamlessly via our robust API for smooth system compatibility.
                    </Typography>
                    <Typography component="li" sx={{
                      textAlign: 'left', fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",

                      hyphens: 'auto',
                      wordBreak: 'break-word',
                      '& > span': { display: 'inline-block' }
                    }}>
                      Save up to 90% of your time with our automated, highly accurate solution, ensuring precision and efficiency.
                    </Typography>
                  </Box>
                </Typography>
              </Box>

              {!Authorization ?
                <Box sx={{ mt: 2 }} textAlign={'left'}>
                  <Link
                    style={{ color: 'black' }}
                    onClick={() => checked("/login")}
                    href="/requestdemo"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <StyledButtonComponent buttonWidth={200} >
                      Request for Demo
                    </StyledButtonComponent>
                  </Link>

                  <Link href="https://www.youtube.com/watch?v=nOPripLzoLc" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                    <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: isMobile ? "0rem" : "10px" }}><PlayCircleFilled sx={{ marginRight: '8px' }} />
                      Watch Video
                    </StyledButtonComponent>
                  </Link>


                </Box>
                :
                <Box sx={{ mt: 2 }} textAlign={'center'}>
                  <StyledButtonComponent buttonWidth={200}
                    onClick={() => navigate("/Demo/doc-ai-loss-run-report")}
                    style={{}}
                  >
                    Demo
                  </StyledButtonComponent>

                  <Link href="https://www.youtube.com/watch?v=nOPripLzoLc" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                    <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: isMobile ? "0rem" : "10px" }}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
                      Watch Video
                    </StyledButtonComponent>
                  </Link>


                </Box>
              }
              <Box sx={{ textAlign: 'center', marginRight: isMobile ? '0rem' : "2rem" }}>
                <Typography
                  className="Nasaliza"
                  sx={{
                    fontWeight: 'bold',

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


      <Container
        sx={{
          height: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: isMobile ? '5rem' : '2rem',
          marginBottom: '2rem'
        }}
      >

        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Box
            sx={{
              padding: isMobile ? '20px' : '40px',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }} className='Nasaliza'>
              Automated Data Extraction for Efficient Information Processing
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Leverage our cutting-edge technology to streamline information management, reduce manual effort, and minimize errors.
            </Typography>

            <Grid container justifyContent="center" alignItems="center" spacing={2}>
              <Grid item xs={12} md={5}>
                <Box
                  component="img"
                  src={Loss_Run}
                  alt="Receipt"
                  sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: theme.shadows[3],
                  }}
                />
              </Grid>

              <Grid item xs={12} md={1}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    fontSize: '3rem',
                  }}
                >
                  ➡️
                </Box>
              </Grid>

              <Grid item xs={12} md={5}>
                <Box
                  sx={{

                    padding: '16px',
                    borderRadius: '8px',

                    overflowX: 'auto',
                    maxWidth: '100%',
                  }}
                >
                  <Box
                    component="img"
                    src={Loss_result}
                    alt="Receipt"
                    sx={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      boxShadow: theme.shadows[3],
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid></Container>


      <Box sx={{ padding: { xs: 2, md: 4 }, backgroundColor: "#f0f2f5" }}>
        <Grid
          container
          spacing={4}
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: '100%', maxWidth: 1200, margin: 'auto' }}
        >
          {/* Left Side: Text Content */}
          <Grid item xs={12} md={5}>
            <Typography variant="h4" component="h2" gutterBottom className='Nasaliza' color='blue' textAlign={'left'}>
              Streamline Loss Run Data Extraction Process with Ease
            </Typography>
            <Typography variant="subtitle1" component="p" sx={{
              fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
              textAlign: 'justify',
              hyphens: 'auto',
              wordBreak: 'break-word',
              '& > span': { display: 'inline-block' }
            }}>
              Our automated data extraction solution saves you time and effort by
              efficiently extracting key points from images or PDFs and presenting
              them in a clear and organized structured format.

            </Typography>
            <Box sx={{ textAlign: 'left', marginTop: '3rem' }}>
              {
                Authorization ? (
                  <Box>
                    <StyledButtonComponent buttonWidth={250}
                      onClick={() => navigate("/Demo/doc-ai-loss-run-report")}
                      style={{ marginTop: isMobile ? '16px' : '0' }}
                    >
                      Demo
                    </StyledButtonComponent>

                    <Link href="https://www.youtube.com/watch?v=nOPripLzoLc" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                      <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '280px', marginTop: '-85px' }}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
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

                    <Link href="https://www.youtube.com/watch?v=nOPripLzoLc" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                      <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '280px', marginTop: '-85px' }}><PlayCircleFilled sx={{ marginRight: '8px' }} />
                        Watch Video
                      </StyledButtonComponent>
                    </Link>

                  </Box>
                )
              }

            </Box>


          </Grid>

          {/* Right Side: Cards */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={4}>
              {/* First and Second Cards */}
              {features.slice(0, 2).map((feature, index) => (
                <Grid item key={index} xs={12} sm={6}>
                  <Card
                    sx={{
                      maxWidth: 345,
                      height: '300px',
                      margin: "0 auto",
                      textAlign: "center",
                      padding: 2,
                      borderRadius: "12px",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                      "&:hover": { boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)" },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                      <Typography variant="h6" component="h2" className='Nasaliza' color='#010066' >
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif" }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {/* Third Card */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                  <Card
                    sx={{
                      maxWidth: 345,
                      textAlign: "center",
                      padding: 2,
                      borderRadius: "12px",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                      "&:hover": { boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)" },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 2 }}>{features[2].icon}</Box>
                      <Typography variant="h6" component="h2" className='Nasaliza' color='#010066'>
                        {features[2].title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif" }}>
                        {features[2].description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </>
  );
};



export default LossRunReports;