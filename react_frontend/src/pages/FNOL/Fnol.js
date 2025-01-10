import React, { useState, useEffect} from "react";
import SEO from "../../SEO/SEO";
import {
  Grid, Typography, useMediaQuery, useTheme, Card,Link,
  CardContent,
} from "@mui/material";
import {  useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import StyledButtonComponent from "../../components/StyledButton";
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Ensure to import the carousel styles
import "../pagesstyles.css";
import "../services.css";
import ContactMailIcon from '@mui/icons-material/ContactMail';
import File_claims from '../../assets/File_claims.png'
import Header from "../../components/header";
import Footer from "../../components/footer";
import FNOL_Flowchart from '../../assets/FNOL_Flowchart.png'

import SmartFNOL from '../../assets/SmartFNOL.png'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { AssignmentTurnedIn, Speed, PeopleAlt, PlayCircleFilled } from "@mui/icons-material";
import { keyframes } from "@mui/material";

const slideInFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;


const features = [
  {
    title: "Streamline Claims Process Efficiently",
    description:
      "Our user-friendly FNOL service streamlines claims reporting with an intuitive interface for quick, accurate data collection and a seamless experience.",
    icon: <AssignmentTurnedIn sx={{ fontSize: 50, color: "#1976d2" }} />, // Checkmark for efficient processing
  },
  {
    title: "Accelerate Claim Settlement",
    description:
      "Accelerate claim processing with our FNOL service, which uses structured data collection and organized workflows for faster resolutions and higher customer satisfaction.",
    icon: <Speed sx={{ fontSize: 50, color: "#1976d2" }} />, // Speedometer for acceleration
  },
  {
    title: "Enhance Customer Experience",
    description:
      "Enhance customer experience with our easy-to-use FNOL platform, offering straightforward claim reporting and clear status updates for effective communication and support.",
    icon: <PeopleAlt sx={{ fontSize: 50, color: "#1976d2" }} />, // Group of people for customer focus
  },
];


export default function Fnol() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [, setHovered] = useState(false);

  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
  const [, setTypedText] = useState("");
  const text = "InnoClaimFNOL";
   useEffect(() => {
    // Function to start the typing effect
    const startTyping = () => {
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index <= text.length) {
          setTypedText(text.substring(0, index));
          index++;
        } else {
          clearInterval(typingInterval);
        }
      }, 300); // Adjust typing speed as needed
    };

    // Start typing immediately
    startTyping();

    // Set interval to repeat typing every 5 seconds
    const intervalId = setInterval(startTyping, 10000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const checked = (val) => {
  if (!Authorization) {
      localStorage.setItem("rout", val);
    } else {
      window.scrollTo(0, 0);
    }
  };


  return <>
    <Header />
<SEO location={'/smart-claim'}/>

<h1 style={{ position: 'absolute',width: '1px',height: '1px',margin: '-1px',padding: '0',overflow: 'hidden',clip: 'rect(0, 0, 0, 0)',border: '0', }}>  Streamline your claims process with FNOL</h1>  
<h2 style={{ position: 'absolute',width: '1px',height: '1px',margin: '-1px',padding: '0',overflow: 'hidden',clip: 'rect(0, 0, 0, 0)',border: '0', }}>FNOL Reporting With AI</h2>  
   
    <Box
      sx={{
        position: 'relative',
        backgroundImage: `url(${require('../../assets/fnolBG.png')})`, // replace with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: "white",

        padding: "2rem 0", // Adds padding for top and bottom
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black overlay with transparency
          zIndex: 1, width: "100%", maxWidth: 'auto', margin: 'auto'
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 2, // Ensures the content is above the overlay
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1rem',

        }}
      >
        <Typography
          sx={{
            fontSize: "2.2rem",
            color: 'white',
            paddingTop: '2rem',
            //  fontFamily:'Georgia, Times, serif',
            textAlign: 'center',
          }}
          className="Nasaliza"
        >
          Smart<span style={{color:'#0B70FF'}}>Claim</span> Portal
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            height: isMobile ? "auto" : "auto",
            width: '100%',
            margin: 'auto',
          }}
        >
       
            <Box sx={{marginBottom:"4rem"}}>
              <img
                      src={SmartFNOL}
                      alt={'SmartFNOL'}
                      
                    />
            </Box>
          <Box
            sx={{
              maxWidth: isMobile ? "100%" : "50%",
              textAlign: isMobile ? "center" : "left",
              marginLeft: isMobile ? "0" : "5rem",
              animation: `${slideInFromLeft} 1s ease-out`,
            }}
          >
            <Typography
              variant={isMobile ? "h4" : "h1"}
              component="h1"
              gutterBottom
              className="Nasaliza"
              sx={{
                animation: `${slideInFromLeft} 1s ease-out`,fontSize:isMobile?"1.8rem":'2.2rem'
              }}
            >
              Streamline your claims process with FNOL
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              sx={{
                animation: `${slideInFromLeft} 1s ease-out`,
                fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                  textAlign: 'justify',
                  hyphens: 'auto',
                  wordBreak: 'break-word',
                  '& > span': { display: 'inline-block' }
              }}
            >
              Our SmartClaim service transforms the insurance claims process, prioritizing efficiency, speed, and customer satisfaction. With advanced technology and expert support, we streamline claims processing, accelerate settlement, and enhance transparency. Policyholders report claims easily through our user-friendly platform, receiving prompt support and updates throughout their journey.
            </Typography>
            {!Authorization ?
              <Box sx={{ marginTop: "2rem",textAlign:isMobile?"center": 'left' }}>
                <StyledButtonComponent
                  buttonWidth={250}
                  onClick={() => navigate("/requestdemo")}
                >
                  Request for Demo
                </StyledButtonComponent>
               
                          <Link href="https://www.youtube.com/watch?v=iD4qB1xVp7M" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                          <StyledButtonComponent buttonWidth={200} sx={{marginLeft:'20px'}}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
                          Watch Video
                          </StyledButtonComponent>
                          </Link>
                    
              </Box>
              :
              <Box sx={{ marginTop: "2rem", textAlign:isMobile?"center": 'left' }}>
                <Link
                  style={{ color: 'black' }}
                  onClick={() => checked("/login")}
                  href={Authorization ? "/claimcapture" : "/signin"}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >

                  <StyledButtonComponent buttonWidth={200} >
                    Demo
                  </StyledButtonComponent>
                
                          <Link href="https://www.youtube.com/watch?v=iD4qB1xVp7M" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                          <StyledButtonComponent buttonWidth={200} sx={{marginLeft:isMobile?"0rem":'20px'}}>   <PlayCircleFilled sx={{ marginRight: '8px' }} />
                          Watch Video
                          </StyledButtonComponent>
                          </Link>
                        
                </Link>
              </Box>
            }
              <Box sx={{textAlign:isMobile?"center": 'left',marginRight:isMobile?'0rem':'12rem'}}>
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "4rem",
                gap: "1rem",
              }}
            >
              {/* Additional content or buttons */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>

    {/* ............................................................. */}


    < Box sx={{ padding: { xs: 2, md: 4 }, width: '100%', maxWidth: 1200, margin: 'auto' }}>
      <Grid
        container
        spacing={4}
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Left Side: Text Content */}
        <Grid item xs={12} md={5}>
          <Typography variant="h4" component="h2" gutterBottom className="Nasaliza" textAlign={"left"}>
            Streamlined Claims Management with Our User-Friendly <span className="Nasaliza" style={{ color: 'blue', fontSize: '2rem', textAlign: 'left' }}>FNOL Solution</span>
          </Typography>
          <Typography variant="subtitle1" component="p" gutterBottom sx={{fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                  textAlign: 'justify',
                  hyphens: 'auto',
                  wordBreak: 'break-word',
                  '& > span': { display: 'inline-block' }
                }}>
            Our FNOL service simplifies the insurance claims process, focusing on user-friendliness, efficiency, and exceptional customer service. With an intuitive interface and step-by-step guidance, we make claims reporting easy and accessible. Our streamlined approach helps expedite claim handling, improve data accuracy, and enhance transparency. Policyholders can effortlessly report claims through our user-centric platform, receiving clear support and timely updates throughout their journey.
          </Typography>
        </Grid>

        {/* Right Side: Cards */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={4}>
            {/* First and Second Cards */}
            {features.slice(0, 2).map((feature, index) => (
              <Grid item key={index} xs={12} sm={6}>
                <Card
                  sx={{
                    height: "auto",
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
                    <Typography variant="h6" component="h2" className="Nasaliza" color="#010066">
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
                    height: "auto",
                    textAlign: "center",
                    padding: 2,
                    borderRadius: "12px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    "&:hover": { boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)" },
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{features[2].icon}</Box>
                    <Typography variant="h6" component="h2" className="Nasaliza" color="#010066">
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
    {/*...............................................................FNOL......................... section -2 */}


    {/* ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,file claims............................................................ */}
    <Grid className="container-idp" sx={{
      width: "100%",
      maxWidth: 1200, margin: 'auto'
    }}>
      <Grid className="card-idp card-idp-img card1-margin"  >
        <img src={FNOL_Flowchart} alt="FNOL_Flowchart" className="Fnol_flowchart" />
      </Grid>
      {/* <Grid className="side-Fnol-btn "> */}

      <Grid className=" card-idp card2-margin" >
        <div className="img_box">


          <img src={File_claims} alt="File_claims" className="imghandel" />
        </div>

        <Typography variant="h4" className="card-titleIDP text_hover Nasaliza">
          File Your Claims Online Today
        </Typography>
        <Typography className="text_hover" >
          log in to  Smart<span style={{color:'#0B70FF'}}>Claim</span> and easily file your claims and upload necessary documents.
        </Typography>

        {
          Authorization ? (
            <Link
              style={{ color: 'black' }}
              onClick={() => checked("/login")}
              href={Authorization ? "/claimcapture" : "/signin"}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Box>
              <StyledButtonComponent buttonWidth={100} >
                Demo
              </StyledButtonComponent>
              
                            <Link href="https://www.youtube.com/watch?v=iD4qB1xVp7M" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                            <StyledButtonComponent buttonWidth={200} sx={{marginLeft:'20px'}}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
                            Watch Video
                            </StyledButtonComponent>
                            </Link>
                         
              </Box>
            </Link>
          ) : (
            <Link
            href="/requestdemo"
            style={{ color: 'black' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Box>
              <StyledButtonComponent buttonWidth={250}>
                Request for Demo
              </StyledButtonComponent>
          
              {/* Correctly wrapping the YouTube link in a separate anchor tag */}
              <a
                href="https://www.youtube.com/watch?v=iD4qB1xVp7M"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'white', marginLeft: '20px' }}
              >
                <StyledButtonComponent buttonWidth={200}>
                  <PlayCircleFilled sx={{ marginRight: '8px' }} />
                  Watch Video
                </StyledButtonComponent>
              </a>
            </Box>
          </Link>
          
          )
        }

      </Grid>
      {/* </Grid> */}
    </Grid>
    {/* .................................................footer...................... */}
    <Footer />
  </>
}
