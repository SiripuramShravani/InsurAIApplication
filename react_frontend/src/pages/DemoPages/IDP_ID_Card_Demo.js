import React from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";

import { motion } from "framer-motion";
import { Grid, Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icon for accuracy
import ThumbUpIcon from '@mui/icons-material/ThumbUp'; // Icon for satisfaction
import IDCardDemo from '../../assets/IDCardDemo.png'
import ID from '../../assets/ID.png'

import IDPIdCardfun from "../Functionality/IDP_IDCard_fun";



const titleVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.2, delay: 0.2 } },
};


export default function IDCardExtractionDemo() {
  

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return <>
    <Header />
    <Box sx={{ backgroundColor: "#a6c1ee", padding: theme.spacing(isMobile ? 2 : 1) }}>
      <Box sx={{ width: "100%", maxWidth: 1200, margin: "auto", height: "auto", padding: theme.spacing(isMobile ? 2 : 4) }}>
        <motion.div initial="hidden" animate="visible" variants={titleVariants}>
           <Box sx={{ textAlign: "center", padding: theme.spacing(1) }}>
            <Typography
              variant="h4"
              component="h4"
              sx={{ fontWeight: "bold", color: "white" }}
              className="Nasaliza"
            >
               Doc<span style={{ color: '#0B70FF' }}>AI</span><sup style={{position: 'relative', top: '-1rem', right: '-0.1rem', fontSize: '0.5rem'}}>TM</sup> ID
            </Typography>
            <Typography sx={{ color: "orange", fontSize: isMobile ? "2rem" : "3rem" }} className="billy-title">
              Demo
            </Typography>            
          </Box>
        </motion.div>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{marginBottom: "6rem"}}>
              <img
                src={IDCardDemo}
                alt="IDCardDemo"
                style={{
                  width: "100%",
                  height: "100%",
                  animation: `slideInFromTop 1s ease-out`,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: "left" }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#000" }}
              className="Nasaliza"
            >
              Experience the Future of ID Extraction with our Cutting-Edge-Technology.
            </Typography>
            <Typography variant="body1" paragraph
            sx={{
            textAlign: 'justify',
            hyphens: 'auto',
            wordBreak: 'break-word',
            '& > span': { display: 'inline-block' }
            }}>
              Our advanced extraction technology ensures accurate and efficient data processing from ID cards.
              Experience a significant reduction in processing time and improved reliability.
            </Typography>
            <Grid container spacing={2} mt={2}>
              <Grid item xs={6} sm={6} md={6}>
                <Box display="flex" alignItems="center">
                  <CheckCircleIcon sx={{ fontSize: 40, color: "#4caf50", mr: 2 }} />
                  <Box>
                    <Typography variant="h4" color="textPrimary" sx={{ fontWeight: "bold" }}>
                      95%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Accuracy rate of our extraction technology.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <Box display="flex" alignItems="center">
                  <ThumbUpIcon sx={{ fontSize: 40, color: "#4caf50", mr: 2 }} />
                  <Box>
                    <Typography variant="h4" color="textPrimary" sx={{ fontWeight: "bold" }}>
                      98%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Reduction in Time Consumption.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>

    <Box sx={{ width: "100%", maxWidth: 1200, margin: "auto", padding: theme.spacing(isMobile ? 2 : 4) }}>
      <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} md={6}>
          <Box>
            <img
              src={ID}
              alt="ID"
              style={{
                width: "100%",
                height: "auto",
                animation: `slideInFromTop 1s ease-out`,
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ textAlign: "left" }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#000" }}
            className="Nasaliza"
          >
            Streamline Your ID Processing Today
          </Typography>
          <Typography variant="body1" paragraph
          sx={{
                  textAlign: 'justify',
                  hyphens: 'auto',
                  wordBreak: 'break-word',
                  '& > span': { display: 'inline-block' }
                }}

          >
            Our automated system processes ID cards swiftly, minimizing manual effort and accelerating data handling. Experience seamless integration with backend/core systems and enhanced productivity with our advanced technology.
          </Typography>
        </Grid>
      </Grid>
      <IDPIdCardfun />
    </Box>

    <Footer />



  </>
}