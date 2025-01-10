import { React, useEffect, useState, useRef } from "react";
import { Box, Grid, Typography, Container, useMediaQuery, useTheme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import TextSnippetIcon from "@mui/icons-material/TextSnippet"; 
import Header from "../../components/header";
import Footer from "../../components/footer";
import IDPfun from "../Functionality/IDPfun";
import Claims from '../../assets/claim.png'
import doc_process from '../../assets/doc_process.png'
import down_time from '../../assets/down-time.png'
import PopupMessage from "./AccessDeniedPopMssg";
 
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
function AnimatedNumber({ number, start }) {
  const [displayNumber, setDisplayNumber] = useState(number.slice(0, -1) + '%');
  const staticPart = number.slice(0, -1);
  const targetDigit = parseInt(number.slice(-1), 10);
 // Empty dependency array ensures this runs only once on mount
 
 
  useEffect(() => {
    if (!start) return;
    let currentDigit = 0;
    let incrementCount = 0;
    const interval = setInterval(() => {
      if (currentDigit === 9) {
        clearInterval(interval);
        setDisplayNumber(staticPart + "9+");
      } else if (incrementCount >= 3) {
        clearInterval(interval);
        if (parseInt(staticPart + targetDigit) >= 991) {
          setDisplayNumber("1000");
        } else {
          setDisplayNumber(staticPart + targetDigit + "+");
        }
      } else {
        currentDigit = (currentDigit + 1) % 10;
        setDisplayNumber(staticPart + currentDigit + "+");
        if (currentDigit === targetDigit) {
          incrementCount++;
        }
      }
    }, 200);
    return () => clearInterval(interval);
  }, [number, start, staticPart, targetDigit]);
 
  return (
    <Typography variant="h4" component="div" className="fileAnalys-animate-number">
      {displayNumber}
    </Typography>
  );
}
 
export default function IdpDemo() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
   const classes = useStyles();
  const [isVisible,] = useState([false, false, false]);
  const gridRefs = [useRef(), useRef(), useRef()];
  const [selectedOption, setSelectedOption] = useState("Home");
 
  const [openPopup, setOpenPopup] = useState(false);
  // const { isAuthenticated, isLoading } = useAuthContext();
  
  useEffect(() => {
    const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
    console.log( "authorization", Authorization );

     const userAccess = Authorization ? JSON.parse(localStorage.getItem('userAccess')) : [];
    
    if (!userAccess.includes('claim_intake') || !Authorization) {
      setOpenPopup(true);
    }
  }, []);

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      {Authorization && (
      // {/* {isLoading ? ( 
      //   <div>Loading...</div>
      // ) : ( */}
        <>
          <Header />
        <Box sx={{ background: 'linear-gradient(to right, #4b6cb7, #001660)' }}>
 
            <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto' }}>
              <Typography  className="Nasaliza" sx={{
                fontWeight: 'bold',
                fontSize: 30,  
                textAlign: 'center', paddingTop: "3rem", color: 'white'
 
              }}>
                 Doc<span style={{ color: '#0B70FF' }}>AI</span><sup style={{position: 'relative', top: '-1rem', right: '-0.1rem', fontSize: '0.5rem'}}>TM</sup> Claim
              </Typography>
              <Typography className="billy-title" sx={{fontSize:'3rem',color:"orange"}}>Demo</Typography>
 
              <Box className={classes.root}>
 
                <Grid container spacing={4} justifyContent="center" alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Box className={classes.container} sx={{ width: isMobile ? 250 : 380, height: isMobile ? 250 : 380, }}>
                      <Box className={classes.circle}>
 
                        <Box className={`${classes.iconWrapper} ${classes.documentIcon}`}>
                          <InsertDriveFileIcon color="primary" fontSize="large" />
                        </Box>
                        <Box className={`${classes.iconWrapper} ${classes.textIcon}`}>
                          <TextSnippetIcon color="primary" fontSize="large" />
                        </Box>
                        <Box className={`${classes.iconWrapper} ${classes.imageIcon}`}>
                          <ImageIcon color="primary" fontSize="large" />
                        </Box>
 
                        <Box className={`${classes.iconWrapper} ${classes.pdfIcon}`}>
                          <PictureAsPdfIcon color="primary" fontSize="large" />
                        </Box>
                      </Box>
                      <Box className={classes.centerText}>
 
                        <Typography variant="body1" color={'white'} className='Nasaliza'>
                        Upload handwritten notes, files, and forms for Claim data extraction and processing.
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                 <Grid item xs={12} md={6} textAlign={'left'}>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }} className='Nasaliza'>
                    Comprehensive Claim Data Extraction from All Document Formats
                    </Typography>
                    <Typography variant="body1" color="whitesmoke" mt={2}
                     sx={{
                  textAlign: 'justify',
                  hyphens: 'auto',
                  wordBreak: 'break-word',
                  '& > span': { display: 'inline-block' }
                }}>
                    Submit your insurance claims quickly and easily with our streamlined end-to-end automated process. Experience faster processing times and complete your Claim process in no time.
                    </Typography>
 
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Box>
          <Box sx={{ height:isMobile?'auto':'300px', marginTop: "4rem" }}>
            <Container maxWidth="lg" className="fileAnalys-container">
 
              <Grid container spacing={3} justifyContent="center">
                {[
                 { img: Claims, title: "Document Processing Accuracy", number: "> 95%" },
                 { img: down_time, title: "Increased Time Efficiency", number: "90%" },
                 { img: doc_process, title: "FNOL Automation", number: "98%" },
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index} ref={gridRefs[index]}>
                    <Box className="fileAnalys-grid" >
                      <img src={item.img} alt={item.title} />
                      <Typography fontSize={'1rem'} component="h5" className="Nasaliza">
                        {item.title}
                      </Typography>
                   
                   <AnimatedNumber number={item.number} start={isVisible[index]} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Container>
 
          </Box>
          <Box>
            <IDPfun />
          </Box>
          <PopupMessage open={openPopup} onClose={() => setOpenPopup(false)} />
          <Footer />
        </>
      )}
    </>
  );
}
 