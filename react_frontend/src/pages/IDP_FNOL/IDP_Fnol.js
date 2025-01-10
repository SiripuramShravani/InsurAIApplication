import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
 
import {
  Grid, useTheme,
  useMediaQuery, Typography, Container, Box, Card, Paper, CardContent,Link
 
} from "@mui/material";
 
import Footer from "../../components/footer";
import Header from "../../components/header";
 
import "../pagesstyles.css";
import "../services.css";
import StyledButtonComponent from "../../components/StyledButton";
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import textfile from '../../assets/textfile.jpg';
import Word from '../../assets/Word.png';
import ACORD from '../../assets/ACORD.jpg';
import DocAIFNOL from '../../assets/DocAIFNOL.png';
import { TaskAlt, Autorenew, Insights, PlayCircleFilled, } from "@mui/icons-material";
 
 
import { Edit as EditIcon, FileCopy as FileCopyIcon, Description as DescriptionIcon, DataObject as DataObjectIcon } from '@mui/icons-material';
import {
 
  CloudUpload,
 
  People,
 
} from "@mui/icons-material";
 
import { pdfjs } from "react-pdf";
 
import IDPFNOL_Img from '../../assets/IDPFNOL_Img.png'
 
 
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
 
const FeatureItem = ({ icon, text }) => (
  <Box display="flex" alignItems="center" mb={2}>
    {icon}
    <Typography variant="body1" ml={2} className="Nasaliza">
      {text}
    </Typography>
  </Box>
);
 
const theme = createTheme({
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
const services = [
  {
    title: "Hand Written",
    icon: <EditIcon sx={{ fontSize: 50, color: '#2196F3' }} />, // Updated icon and color
    description: (
    <Typography sx={{ fontFamily: "'Trebuchet MS', Arial, sans-serif" }}>
      Upload handwritten documents or notes for streamlined processing.
    </Typography> ),
  },
  {
    title: "File",
    icon: <FileCopyIcon sx={{ fontSize: 50, color: '#4CAF50' }} />, // Updated icon and color
    description: (
      <Typography sx={{ fontFamily: "'Trebuchet MS', Arial, sans-serif" }}>
        Upload various types of files including PDFs, Word documents, and more.</Typography> ),
 
  },
  {
    title: "Unstructured Files",
    icon: <DescriptionIcon sx={{ fontSize: 50, color: '#FFC107' }} />, // Updated icon and color
    description: (
      <Typography sx={{ fontFamily: "'Trebuchet MS', Arial, sans-serif" }}>Upload any unstructured files for seamless processing.</Typography> ),
  },
  {
    title: "Extracted Claim Details",
    icon: <DataObjectIcon sx={{ fontSize: 50, color: '#F44336' }} />, // Updated icon and color
    description: (
      <Typography sx={{ fontFamily: "'Trebuchet MS', Arial, sans-serif" }}>Uploaded document is extracted in a structured format for claims analysis.</Typography> ),
  },
];
  
const keyframes = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
 
  @keyframes scanAnimation {
    0% {
      top: 0;
    }
    100% {
      top: 100%;
    }
  }
`;
 
 
const images = [textfile, Word, ACORD];
 
export default function IDP_Fnol() {
  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
  const navigate = useNavigate();
 
 
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const TheamMedia = useTheme();
  const isMobile = useMediaQuery(TheamMedia.breakpoints.down("sm"));
  const isScreen = useMediaQuery('(max-width:900px)');
  const [, setStartAnimation] = useState(false);
  const [, setVideoWidth] = useState(560); // Initial video width
  const [, setVideoHeight] = useState(315); // Initial video height
 
 
  useEffect(() => {
    // Trigger animation when component mounts
    setStartAnimation(true);
    // Update video dimensions on window resize
    function handleResize() {
      setVideoWidth(window.innerWidth > 768 ? 560 : 320); // Adjust width based on screen size
      setVideoHeight(window.innerWidth > 768 ? 315 : 180); // Adjust height based on screen size
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  //render upload
 
  useEffect(() => {
    // Trigger animation when component mounts
    setStartAnimation(true);
    // Update video dimensions on window resize
    function handleResize() {
      setVideoWidth(window.innerWidth > 768 ? 560 : 320); // Adjust width based on screen size
      setVideoHeight(window.innerWidth > 768 ? 315 : 180); // Adjust height based on screen size
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 
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
 
 
      <ThemeProvider theme={theme}>
        <Box
          sx={{
 
 
            textAlign: "left",
            backgroundColor: "#010066",
            height: { xs: 'auto', md: '600px' },  // Adjust height based on device size
            display: 'flex',
            flexDirection: 'column',
            justifyContent: "center",
 
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 1200, margin: 'auto' }}>
 
            <Typography className="Nasaliza" sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, paddingTop: isMobile ? '1rem' : '3rem', color: 'white', textAlign: 'center', }} >
            Doc<span style={{ color: '#0B70FF' }}>AI</span><sup style={{position: 'relative', top: '-1rem', right: '-0.1rem', fontSize: '0.5rem'}}>TM</sup> Claim
            </Typography>
 
            <Grid
              container
              spacing={2}
              sx={{
                alignItems: "center",
                justifyContent: "center",
                width: '100%',
                maxWidth: 1200,
                margin: '0px auto',
              }}
            >
              <Grid item xs={12} md={6}>
                <Typography className="Nasaliza" variant="h4" component="h4" textAlign={"left"} sx={{ fontSize: { xs: "1.25rem", md: "2rem" } }}>
                  Automating Claims Intake with  Doc<span style={{color:'#0B70FF'}}>AI</span> Claim
                </Typography>
                <Typography variant="body1" sx={{
                  fontFamily: "'Trebuchet MS', Arial, sans-serif",
                  marginTop: '1rem',
                  textAlign: 'justify',
                  hyphens: 'auto',
                  wordBreak: 'break-word',
                  '& > span': { display: 'inline-block' }
                }}>
                  DocAI Claim is a state-of-the-art service that transforms how insurance claims are processed. Utilizing advanced technology and intelligent automation, we accelerate the claims process, ensuring greater accuracy and efficiency. Say goodbye to paperwork and hello to a seamless claims experience.
                </Typography>
                {!Authorization ?
                  <Box sx={{ mt: 2, textAlign: { xs: 'center', md: 'center' } }}>
                    <StyledButtonComponent
                      buttonWidth={250}
                      onClick={() => navigate("/requestdemo")}
                    >
                      Request for Demo
                    </StyledButtonComponent>
                 
                      <Link href="https://www.youtube.com/watch?v=Nq_YQzBukN0" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                      <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}><PlayCircleFilled sx={{ marginRight: '8px' }} />
                        Watch Video
                        </StyledButtonComponent>
                      </Link>
                   
                  </Box>
 
                  :
 
                  <Box sx={{ mt: 2, textAlign: { xs: 'center', md: 'center' } }}>
                    <StyledButtonComponent buttonWidth={250}
                      onClick={() => navigate("/demo/DocAI")}
                      style={{ marginTop: isMobile ? '16px' : '0' }}
                    >
                      Demo
                    </StyledButtonComponent>
                   
                      <Link href="https://www.youtube.com/watch?v=Nq_YQzBukN0" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                      <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px', marginTop: '-2px' }}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
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
 
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ThemeProvider theme={theme}>
                    <style>{keyframes}</style>                     
                    <img src={DocAIFNOL} alt="DocAIFNOL"/>
                  </ThemeProvider>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </ThemeProvider>
      <Box sx={{ width: "100%", maxWidth: 1300, margin: 'auto' }}>
 
        <Grid container spacing={3} sx={{ justifyContent: 'center', position: 'relative', top: isScreen ? '0px' : '-50px', width: '100%', maxWidth: 1400, margin: 'auto' }}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
 
                  textAlign: 'center',
                  boxShadow: 1,
                  backgroundColor: 'white',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 10px 20px rgba(0,0,0,0.2)',
                  },
                  '@media (max-width: 600px)': {
                    p: 2,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'inline-block',
                      transition: 'color 0.3s, transform 0.3s',
                      '&:hover': {
                        color: 'secondary.main',
                        transform: 'rotate(20deg) scale(1.2)',
                      },
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mt: 2, color: '#010066' }}
                    className="Nasaliza"
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: 'black' }}
                  >
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
 
 
 
 
 
      <Box sx={{ height: 'auto', py: 4 }}>
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'auto',width:"auto",
                  }}
                >
                 
                  <img src={IDPFNOL_Img} alt="IDPFNOL_Img"  width={isMobile ? '100%' : '100%'}
                    height={isMobile ? 'auto' : 'auto'}
                    controls
                    style={{ maxWidth: '100%', borderRadius: 8 }}/>
                </Box>
              </Grid>
 
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left' }}>
                <Typography sx={{marginTop:"40px"}} variant="h4" className="Nasaliza">
                  Revolutionize Claims Processing with
                  <Box component="span" variant="h1" color="primary.main" className="Nasaliza" sx={{marginLeft:"0.5rem"}}>
                  Doc<span style={{color:'#0B70FF'}}>AI</span> Claim
                  </Box>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: 'left',
                    fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                    mt: 2,
                  }}
                >
                </Typography>
                <Box mt={2}>
                  <FeatureItem
                    icon={<TaskAlt sx={{ fontSize: 25, color: "#0B70FF" }} />}
                    text="Efficient and Accurate Claims Handling"
                  />
                  <FeatureItem
                    icon={<CloudUpload sx={{ fontSize: 25, color: "#0B70FF" }} />}
                    text="Streamlined Claims Submission"
                  />
                  <FeatureItem
                    icon={<Autorenew sx={{ fontSize: 25, color: "#0B70FF" }} />}
                    text="Automated Claims Processing"
                  />
                  <FeatureItem
                    icon={<Insights sx={{ fontSize: 25, color: "#0B70FF" }} />}
                    text="Advanced Analytics and Reporting"
                  />
                  <FeatureItem
                    icon={<People sx={{ fontSize: 25, color: "#0B70FF" }} />}
                    text="Enhanced Customer Experience"
                  />
                </Box>
                <Box mt={3}>
                  {Authorization ? (
                    <Box>
                      <StyledButtonComponent
                        buttonWidth={250}
                        onClick={() => navigate('/demo/DocAI')}
                        style={{ marginTop: isMobile ? '16px' : '0' }}
                      >
                        Demo
                      </StyledButtonComponent>
                     
                        <Link href="https://www.youtube.com/watch?v=Nq_YQzBukN0" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                        <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px', marginTop: '-2px' }}>  <PlayCircleFilled sx={{ marginRight: '8px' }} />
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
                     
                        <Link href="https://www.youtube.com/watch?v=Nq_YQzBukN0" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                        <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}>  <PlayCircleFilled sx={{ marginRight: '8px' }} />
                          Watch Video
                          </StyledButtonComponent>
                        </Link>
                     
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
 
      <Footer />
    </>
  );
}