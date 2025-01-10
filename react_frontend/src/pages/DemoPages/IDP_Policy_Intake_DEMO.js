import React,{useState,useEffect} from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import {
  Box, Typography, Grid, Container, useMediaQuery, useTheme} from '@mui/material';
import {  Description} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';

import IDPPolicyIntakefun from "../Functionality/IDPPolicyIntakefun";
import PopupMessage from "./AccessDeniedPopMssg";




// Define the animation variants
const titleVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.2, delay: 0.2 } },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.4 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

// Define feature cards
const features = [
  {
    icon: <Description style={{ color: "#ff416c", fontSize: 40 }} />,
    title: "Extract Structured Data from Unstructured Documents",
    description: "Our solution automates workflows by extracting structured data from any unstructured document.",
  },
  {
    icon: <LocationOnIcon style={{ color: "#27c24c", fontSize: 40 }} />,
    title: "Accurate Address Validation Using Google API",
    description: "Google Address Validation ensures accurate, verified addresses for reliable submissions.",
  },
  {
    icon: <AutoAwesomeMotionIcon style={{ color: "#ffca28", fontSize: 40 }} />,
    title: "Experience Cutting-Edge LLMs in Action",
    description: "Our solution leverages state-of-the-art LLMs to extract structured data from unstructured sources.",
  },
];

export default function IdpPolicyIntakeDemo() {
  // const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
  const [Authorization, setAuthorization] = useState(
    !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth")
  );
  
  const theme = useTheme();
  const isScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
 const [openPopup, setOpenPopup] = useState(false);

  // useEffect(() => {
  //   const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
  //   const userAccess = Authorization ? JSON.parse(localStorage.getItem('userAccess')) : [];

  //   if (!userAccess.includes('policy_intake') || !Authorization) {
  //     setOpenPopup(true);
  //   }
  // }, []); // Empty dependency array ensures this runs only once on mount

  useEffect(() => {
    const userAccess = Authorization ? JSON.parse(localStorage.getItem('userAccess')) : [];

    if (!userAccess.includes('policy_intake') || !Authorization) {
      setOpenPopup(true);
    } else {
      setOpenPopup(false); // Close the popup if authorization is granted
    }
  }, [Authorization]); // Now depends on Authorization

  

  return (
    <>
      {Authorization && <>
        <Header />
        <Box
          sx={{
            bgcolor: "#2F539B",
            color: 'white',
            minHeight: '500px',
            width: '100%',

            margin: 'auto',
            paddingTop: '1rem',
            paddingBottom: '2rem',
            textAlign: 'center',
          }}
        >
          {/* Top Title */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={titleVariants}
          >
            <Box sx={{ padding: theme.spacing(2) }}>
              <Typography
                variant="h4"
                component="h4"
                sx={{
                  fontWeight: 'bold',
                  marginTop: "1rem",
                  color: "white",
                  fontSize: isScreen ? "2.5rem" : "3rem"
                }}
                className="Nasaliza"
              >
                 Doc<span style={{ color: '#0B70FF' }}>AI</span><sup style={{position: 'relative', top: '-1.7rem', right: '-0.1rem', fontSize: '0.5rem'}}>TM</sup>&nbsp;Quote
              </Typography>
              <Typography
                sx={{
                  color: "orange",
                  fontSize: isScreen ? "1.5rem" : "3rem",
                 }}
                className="billy-title"
              >
                Demo
              </Typography>
            </Box>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: "center",
                padding: "0 1rem",
              }}
            >
              <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center" justifyContent='center'>
                  {/* Section 2 */}
                  <motion.div
                    ref={ref}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={cardVariants}
                  >
                    <Box
                      ref={ref}
                      sx={{
                        padding: "2rem 1rem",
                        textAlign: "center",
                        width: '100%',
                        maxWidth: 1100,
                        margin: 'auto',
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ color: "Ivory", fontSize: isScreen ? "2rem" : "2.5rem" }}
                        className="Nasaliza"
                      >
                        Revolutionize your Policy Submission with Our  Doc<span style={{color:'#0B70FF'}}>AI</span> Quote
                      </Typography>
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: "1rem",
                          maxWidth: "700px",
                          margin: "auto",

                        }}
                      >
                        Our DocAI Quote solution automates Policy Submission workflows, increasing efficiency and reducing manual effort.
                      </Typography>
                      <Grid container spacing={3} justifyContent="center" sx={{ marginTop: "0.5rem" }}>
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
                                  padding: "2rem",
                                  borderRadius: "12px",
                                  backgroundColor: "#262673",
                                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                                  textAlign: 'left',
                                  color: "white",
                                  height: "280px",
                                  '&:hover': {
                                    transform: "translateY(-10px)",
                                    transition: "0.3s ease-in-out"
                                  }
                                }}
                              >
                                <Box sx={{ mb: 2, fontSize: "2rem", color: "orange" }}>
                                  {feature.icon}
                                </Box>
                                <Typography
                                  variant="h6"
                                  sx={{ mb: 1, color: "white", fontWeight: 'bold' }}
                                  className="Nasaliza"
                                >
                                  {feature.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "lightgray" }}>
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

        <Box margin={isMobile ? "0rem" : '4rem'}>
          <IDPPolicyIntakefun />
        </Box>
        <PopupMessage open={openPopup} onClose={() => setOpenPopup(false)} />
        <Footer />
      </>}
    </>
  );
}