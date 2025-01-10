import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Grid, Container } from "@mui/material";


import Insur_AI_Agent from "../../assets/InsurAI_Agent.png";
import Header from "../../components/header";
import Footer from "../../components/footer";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VoiceChatIcon from '@mui/icons-material/VoiceChat';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PopupMessage from "./AccessDeniedPopMssg";
import InsurAIAgent from '../InsurAI/InsurAI_Agent'

const messages = [
  { text: "😊 Hi there! I'm Ivan, your go-to P&C Insurance Expert from Innovon Technologies 🏢️! I'm here to help you navigate the world of property and casualty insurance, and make claiming a breeze ⚡️. What can I assist you with today? 😊" },
  { text: "Hi Ivan!", sender: 'user' },
  { text: "How can I assist you today?", sender: 'assistant' },
  { text: "I have a question about my policy.", sender: 'user' },
  // Add more messages as needed
];

const features = [
  {
    icon: <SupportAgentIcon sx={{ fontSize: 50, color: '#00bcd4' }} />,
    title: 'Efficient Policy & Claims Process',
    description: "IVAN delivers fast, accurate policy evaluations and claims processing, streamlining your insurance experience.",
  },
  {
    icon: <VoiceChatIcon sx={{ fontSize: 50, color: '#00bcd4' }} />,
    title: 'Seamless Voice Interaction',
    description: "Experience seamless voice interaction with IVAN's advanced speech recognition feature for effortless conversations.",
  },
  {
    icon: <CloudUploadIcon sx={{ fontSize: 50, color: '#00bcd4' }} />,
    title: 'Effortless File Processing',
    description: "Streamline your policy and claims process with InsurAI's intuitive file processing feature, enhancing efficiency and accuracy with ease.",
  },
];
export default function InsurAIDemo() {
  const theme = useTheme();

  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
  const [, setMessagesToShow] = useState([]);

  const [openPopup, setOpenPopup] = useState(false);
  
  useEffect(() => {
    const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
    const userAccess = Authorization ? JSON.parse(localStorage.getItem('userAccess')) : [];
    
    if (!userAccess.includes('claim_intake') || !Authorization) {
      setOpenPopup(true);
    }
  }, []);
  useEffect(() => {
    let messageIndex = 0;

    const displayMessages = () => {
      const updatedMessages = messages.map((msg, index) => ({
        ...msg,
        visible: index <= messageIndex
      }));

      setMessagesToShow(updatedMessages);

      messageIndex++;
      if (messageIndex < messages.length) {
        setTimeout(displayMessages, 2000);
      }
    };

    displayMessages();
  }, []);
 
  return (
    <>
  {Authorization && 
    <>
      <Header />
 
         
 
      <Box sx={{ backgroundColor: '#0a1c2c', py: 8 }}>
            <Typography variant="h4" component="h1" className="Nasaliza" sx={{
            fontWeight: 'bold',          
            textAlign: 'center',
            margin:"1rem orem 3rem 0rem",
            color:"white",
            marginBottom: theme.spacing(2),
          }}>
            Ivan - Innovon P & C Virtual Assistant

          </Typography>
             <Typography style={{color:"orange",fontSize:'3rem'}} className="billy-title" >Demo</Typography>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" color="white" gutterBottom>
          Transforming P & C Insurance with IVAN's advanced technology.
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="#cfd8dc"
            paragraph
            sx={{ maxWidth: '600px', mx: 'auto', mb: 8 }}
          >
            IVAN, the AI-Powered Underwriter and Claims Processor, revolutionizes the insurance industry with cutting-edge technology, offering seamless policy evaluations and claim handling.
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    px: 4,
                    py: 6,
                    backgroundColor: '#112233',
                    borderRadius: '12px',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                    },
                  }}
                >
                  {feature.icon}
                  <Typography variant="h6" color="white" sx={{ mt: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="#cfd8dc" sx={{ mt: 2 }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box
        component="section"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: { xs: "column", sm: "row" },
          textAlign: { xs: "center", sm: "left" },
          width: '100%', maxWidth: 1200, margin: 'auto', height: "auto",padding:'2rem'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>  {/* Center aligns both image and text */}
          <Box
            component="img"
            src={Insur_AI_Agent}
            alt="AI Hand"

          />
          <Typography variant="h4" className='Nasaliza' color='blue' >
            Ivan <br />
          </Typography>
          <Typography variant="h6" className='Nasaliza' color='blue'>

            - The P & C Insurance Virtual Assistant
          </Typography>


        </Box>

        <Box sx={{ width: { xs: "100%", sm: "50%" } }}>


          <Grid className="insurAI-box-con">
            <InsurAIAgent />
          </Grid>


        </Box>
      </Box>
      {/* </Box> */}
      <PopupMessage open={openPopup} onClose={() => setOpenPopup(false)} />
      <Footer />
    </>
}
    </>
  );
}
