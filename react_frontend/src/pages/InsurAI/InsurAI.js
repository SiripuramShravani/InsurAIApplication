import React, { useEffect, useRef, useState } from 'react';
import {
  Grid, Typography, useMediaQuery,
  useTheme, 
   Card,
  CardContent,Link
 
} from "@mui/material";
import Box from "@mui/material/Box";
import ContactMailIcon from '@mui/icons-material/ContactMail';
import "../pagesstyles.css";
import "../services.css";
import Insur_AI_Agent from "../../assets/InsurAI_Agent.png";
import InsurAI_2 from "../../assets/InsurAI_2.png";
import Header from "../../components/header";
import Footer from "../../components/footer";
import InsurAI_Hand_dw from "../../assets/InsurAI_Hand_dw.png";
import StyledButtonComponent from "../../components/StyledButton";
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { css } from "@emotion/css";
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Ensure to import the carousel styles
import AssistantIcon from '@mui/icons-material/Assistant';
import MicIcon from '@mui/icons-material/Mic';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {PlayCircleFilled  } from '@mui/icons-material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import SEO from '../../SEO/SEO';





const services = [
  {
    title: "AI-Powered Assistant for Swift Policy & Claims",
    description:
      "Experience the future of insurance with IVAN. Chat with our AI for quick assistance and seamless policy & claim processing.",
    icon: <AssistantIcon style={{ fontSize: 40 }} />,
  },
  {
    title: "Experience The Seamless Voice Interaction",
    description:
      "Experience seamless voice interaction with IVAN's advanced speech recognition feature for effortless and intuitive conversations.",
    icon: <MicIcon style={{ fontSize: 40 }} />,
  },
  {
    title: "Effortless File Processing for Policy & Claims",
    description:
      "Easily upload your documents and streamline your policy & claims process with IVAN's advanced document processing feature.",
    icon: <CloudUploadIcon style={{ fontSize: 40 }} />,
  },
  {
    title: "P&C Expert Assistance for all Your Queries",
    description:
      "Just ask any question—whether it’s about your policy, a claim, or even billing—and IVAN will give you clear, accurate responses in real-time.",
    icon: <SupportAgentIcon style={{ fontSize: 40 }} />,
  },
];


const fadeInAnimation = css`
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function InsurAI() {
 
  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery('(max-width:900px)');
 

  const [visibleCards, setVisibleCards] = useState(Array(services.length).fill(false));
  const cardRefs = useRef([]);
  useEffect(() => {
    document.title = "Innovon Tech-InsurAI"
  }, [])
  useEffect(() => {

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prevVisibleCards) => [
              ...prevVisibleCards,
              entry.target,
            ]);
          }
        });
      },
      { threshold: 0.1 }
    );
// eslint-disable-next-line
    cardRefs.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    return () => {
      // eslint-disable-next-line
      cardRefs.current.forEach((card) => {
        if (card) {
          observer.unobserve(card);
        }
      });
    };
    
  }, []);

const features = [
    'Instant, accurate responses',
    'Guided claims, submissions',
    'Smart document processing',
    'Seamless integration with your workflow'
  ];

  return (
    <>
      <Header />
      <SEO location={'/insur-ai'}/>
      <h1 style={{ position: 'absolute',width: '1px',height: '1px',margin: '-1px',padding: '0',overflow: 'hidden',clip: 'rect(0, 0, 0, 0)',border: '0', }}>Introducing Ivan</h1>  
      <h2 style={{ position: 'absolute',width: '1px',height: '1px',margin: '-1px',padding: '0',overflow: 'hidden',clip: 'rect(0, 0, 0, 0)',border: '0', }}>P&C Insurance Solutions</h2>  
   
      <Box sx={{ backgroundColor: "#007bff", color: "white", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography
        sx={{
          paddingTop: '2.4rem',
          textAlign: "center",
          '&.MuiTypography-root': {
            fontSize: '2.5rem !important'
          }
        }}
        className="titleIDP Nasaliza"
      >
        <span style={{ color: '#2B0066', fontWeight: 'bold' }}>IVAN</span> - Innovon Virtual Assistant
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1200px",
          padding: { xs: "0 1rem", md: "0 2rem" },
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            textAlign: { xs: "center", md: "left" },
            marginLeft: { xs: "0", md: "2rem" },
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            className="Nasaliza"
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              marginBottom: '1rem',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            Introducing <br />
            <span style={{ color: '#010066' }}>Ivan</span>
          </Typography>
          <Typography
            className="Nasaliza"
            sx={{
              fontSize: '1.4rem',
              textAlign: 'justify',
              hyphens: 'auto',
              wordBreak: 'break-word',
              '& > span': { display: 'inline-block' }
            }}
          >
            Your 24/7 P&C Insurance AI Virtual Assistant.
          </Typography>
          <Typography sx={{ color: '#e0e0e0', marginBottom: '1rem', marginTop: '1rem', fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif" }}>
            Streamlining Submissions, Claims, and Billing with human-like intelligence.
          </Typography>

          <Box sx={{ marginBottom: '1rem' }}>
            {features.map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' ,marginLeft:"1rem"}}>
                <Check size={20} style={{ marginRight: '0.5rem', color: 'white' }} />
                <Typography>{feature}</Typography>
              </Box>
            ))}
          </Box>


          <Grid sx={{ marginTop: "2rem", textAlign: { xs: "center", md: "left" } }}>
            <Box>
              <StyledButtonComponent
                buttonWidth={250}
                onClick={() => { navigate(Authorization ? "/demo/insur-ai" : "/requestdemo") }}
              >
                {Authorization ? "Demo" : "Request for Demo"}
              </StyledButtonComponent>
              
                <Link href="https://www.youtube.com/watch?v=BKCuMFq1Vus" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                <StyledButtonComponent buttonWidth={200} sx={{marginLeft:'20px'}}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
                  Watch Video
                  </StyledButtonComponent>
                </Link>
              
              
            </Box>
            <Box sx={{textAlign:'center',marginRight:isMobile?"0rem":"6rem"}}>
              <Typography
                        className="Nasaliza"
                        sx={{
                          fontWeight: 'bold',
                          paddingTop: '10px',
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
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            mt: "2rem",
            textAlign: "center",
          }}
        >
          <img
            src={Insur_AI_Agent}
            alt="Chat Agent"
            style={{ width: "100%" }}
          />
          <Typography variant='h3' className="Nasaliza" sx={{ color: '#010066', marginTop: '1rem', fontWeight: 'bold' }}>
            Ivan
          </Typography>
          <Typography className="Nasaliza" sx={{ color: "#010066", fontSize: "0.9rem", marginLeft: '1rem', textAlign: 'right' }}>
            - The P & C Insurance Virtual AI Assistant
          </Typography>
        </Box>
      </Box>
    </Box>
      {/* //section-2 */}
      < Box sx={{ p: 4, bgcolor: "#f0f4fa" }
      }>
        <Grid container spacing={4} sx={{ width: '100%', maxWidth: 1200, margin: 'auto' }}>
          <Grid item xs={12} md={6} sx={{ margin: "auto" }}>
            <Box sx={{ textAlign: "left", margin: "auto" }}>
              <Typography variant="overline" sx={{ display: "block", mb: 1, color: 'green', fontSize: '2rem' }} className='Nasaliza'>
                IVAN
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2, color: 'blue' }} className='Nasaliza'>
                Simplifying Policy & Claims processing with AI Technology
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
               textAlign: 'justify',
               hyphens: 'auto',
               wordBreak: 'break-word',
               '& > span': { display: 'inline-block' }}} >
                <span style={{ color: '#2B0066', fontWeight: 'bold' }}>IVAN</span> leverages advanced AI to streamline and optimize the policy & claims process, ensuring faster and more accurate resolutions. By automating data analysis and decision-making,<span style={{ color: '#2B0066', fontWeight: 'bold' }}>IVAN</span> reduces processing time and enhances customer satisfaction. Experience a revolution in efficiency, reliability, and customer-centric service with <span style={{ color: '#2B0066', fontWeight: 'bold' }}>IVAN's</span> cutting-edge solution.
              </Typography>
             
            </Box>
          </Grid>
          <Grid item xs={12} md={6} >
            <Grid container spacing={2}>
              {services.map((service, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  key={index}
                  sx={{ marginBottom: "1rem" }}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className={`${fadeInAnimation} ${visibleCards.includes(cardRefs.current[index])
                    ? "visible"
                    : ""
                    }`}
                >
                  <Card
                    sx={{
                      height: "100%",

                      "&:nth-of-type(odd)": {
                        transform: "translateY(-10px)",
                      },
                      "&:nth-of-type(even)": {
                        transform: "translateY(10px)",
                      },
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                      },
                      transition: "transform 0.3s, box-shadow 0.3s",
                    }}
                  >
                    <CardContent sx={{ textAlign: "center" }}>
                      <Box sx={{ fontSize: 40, mb: 2 }}>{service.icon}</Box>
                      <Typography variant="h6" className='Nasaliza' sx={{ fontWeight: "bold", mb: 1, color: "#010066" }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, fontFamily: " 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', sans-serif" }}>
                        {service.description}
                      </Typography>

                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box >


      {/* //section-3 */}


      < Box sx={{ bgcolor: "#0056b3", color: "#fff", p: 4 }}>
        <Grid container spacing={4} alignItems="center" sx={{ width: '100%', maxWidth: 1200, margin: 'auto' }}>
          {isTab &&
            <Grid item xs={12} md={6}>
              <img
                src={InsurAI_2}
                alt="AI Illustration"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Grid>
          }
          <Grid item xs={12} md={6}>
            <Box textAlign={"left"}>
              <Typography variant="overline" sx={{ display: "block", mb: 1, fontSize: "2rem" }} className='Nasaliza'>
                Why Choose Us
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2 }} className='Nasaliza'>
                Innovating AI Solutions for P & C Insurance.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', sans-serif",
               textAlign: 'justify',
               hyphens: 'auto',
               wordBreak: 'break-word',
               '& > span': { display: 'inline-block' }}}>
                Unlock the potential of AI with our tailored solutions for Property & Casualty insurance. We specialize in automating complex processes to enhance efficiency and accuracy.
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Swift and accurate policy & claims.
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Seamless voice interaction.
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Effortless document processing.
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card sx={{ bgcolor: "#004c99", color: "white" }}>
                    <CardContent sx={{ display: "flex", alignItems: "center" }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 40, mr: 2 }} />
                      <Box>
                        <Typography variant="h5">90%</Typography>
                        <Typography variant="body2">Guaranteed Accuracy</Typography>

                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card sx={{ bgcolor: "#004c99", color: "white" }}>
                    <CardContent sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTimeFilledIcon sx={{ fontSize: 40, mr: 2 }} />
                      <Box>
                        <Typography variant="h5">95%</Typography>
                        <Typography variant="body2">Increased Time Efficiency</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {!isTab &&
            <Grid item xs={12} md={6}>
              <img
                src={InsurAI_2}
                alt="AI Illustration"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Grid>
          }

        </Grid>
      </Box >
      {/* section-4 */}


      < Box
        component="section"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: { xs: "column", sm: "row" },
          textAlign: { xs: "center", sm: "left" },
          width: '100%', maxWidth: 1200, margin: 'auto'
        }}
      >

        <Box
          component="img"
          src={InsurAI_Hand_dw}
          alt="AI Hand"
          sx={{
            width: { xs: "100%", sm: "50%" },
            position: "relative",
          }}

        />

        <Box sx={{ width: { xs: "100%", sm: "50%" } }}>

          <Typography variant="h5" className='Nasaliza' color='blue' sx={{marginTop: '7rem'}}>

            For a chat, demo, or to learn more about <br /> Ivan - The P & C Insurance AI Assistant, reach out now
          </Typography>

          {/* </Box> */}

          <Grid sx={{ marginTop: "2rem" }}>
            {Authorization ? <>
              <Box>
              <StyledButtonComponent
                buttonWidth={250}
                 onClick={() => {navigate("/demo/insur-ai")}}
              >
                Demo
              </StyledButtonComponent>
             
                            <Link href="https://www.youtube.com/watch?v=BKCuMFq1Vus" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                            <StyledButtonComponent buttonWidth={200} sx={{marginLeft:'20px'}}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
                            Watch Video
                            </StyledButtonComponent>  
                            </Link>
                         
                </Box>
            </> : <>
                <Box>
              <StyledButtonComponent
                buttonWidth={250}
                onClick={() => {
                  window.scrollTo(0, 0);
                  navigate("/requestdemo")
                }}
              >
                Request for Demo
              </StyledButtonComponent>
              
                            <Link href="https://www.youtube.com/watch?v=BKCuMFq1Vus" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                            <StyledButtonComponent buttonWidth={200} sx={{marginLeft:'20px'}}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
                            Watch Video
                            </StyledButtonComponent>
                            </Link>
                         
              </Box>

            </>}


          </Grid>

        </Box>




      </Box >



      <Footer />
    </>
  );
}
