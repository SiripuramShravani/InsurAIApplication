import React from 'react';
import { Grid, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Header from '../../components/header';
import Footer from '../../components/footer';
import instaQuoteside from '../../assets/instaQuote_side.png';
import InstaQuoteAPP from '../../assets/InstaQuote_APP.png';
import instasideimg from '../../assets/insta_side_img.png';
import StyledButtonComponent from '../../components/StyledButton';
import ContactMailIcon from '@mui/icons-material/ContactMail';
const InstaQuote = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
 
  return (
    <>
      <Header />
      <Box
        sx={{ backgroundColor: 'blue', }}
      >
        <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto' }}>
          <Typography className="Nasaliza" sx={{
            fontWeight: 'bold',
            fontSize: 30,
            textAlign: 'center',
            paddingTop: "3rem",
            color: 'white'
          }}>
            Insta<span style={{ color: '#001660' }}>Quote</span> Mobile App
          </Typography>
 
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ textAlign: 'center' }}
          >
            {/* Image Section */}
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={InstaQuoteAPP}
                alt="InstaQuoteAPP"
                sx={{
                  maxWidth: '100%',
                }}
              />
            </Grid>
 
            {/* Text Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ color: 'white', textAlign: "left" }} className="Nasaliza">
                Insta<span style={{ color: '#001660' }}>Quote</span>: Effortless Insurance Quotes at Your Fingertips
              </Typography>
              <Typography variant="body1" sx={{
                fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif", textAlign: "justify",
                paddingBottom: "2rem",
                padding: isMobile ? '2rem' : '1rem 0rem', color: 'white'
              }}>
                InstaQuote is a robust platform designed to simplify obtaining and managing insurance quotes. Its intuitive interface allows users to easily compare various plans to find the coverage that best fits their needs. Prioritizing speed and convenience, the platform enables quick quote retrieval without the hassle of extensive paperwork or long wait times.
              </Typography>
 
              <Box sx={{ display: isMobile ? 'block' : 'flex', justifyContent: isMobile ? '' : 'center', gap: 2 }}>
 
                <StyledButtonComponent variant="contained"
                  href="/requestdemo"
                  sx={{
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    marginBottom: 2,
                    padding: '10px 20px'
                  }}>
 
                  Request for Demo
                </StyledButtonComponent>
                <StyledButtonComponent variant="contained"
                  href="https://www.youtube.com/watch?v=PzfmnzxU7CU"
                  target="_blank" rel="noopener noreferrer"
                  sx={{
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    marginBottom: 2,
                    padding: '10px 20px'
                  }}>
 
                  Watch Video
                </StyledButtonComponent>
              </Box>
              <Box sx={{ textAlign: isMobile ? "center" : 'left' }}>
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
      </Box>
      {/* New Section Above Footer */}
      <Box sx={{
        background: '#f7f9fa',
        paddingTop: '3rem',
        textAlign: 'center',
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)', paddingBottom: '2rem'
      }}>
        <Typography variant="h4" sx={{ color: '#001660', marginBottom: 1 }} className="Nasaliza">
          Why Choose InstaQuote?
        </Typography>
        <Typography variant="body1" sx={{
          fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
          maxWidth: 800,
          margin: 'auto',
          textAlign: 'justify',
        }}>
          With InstaQuote, you can effortlessly submit your insurance policy with just a few taps.
          Our intuitive mobile app guides you through every step, ensuring accurate entry of your dwelling details.
          Experience real-time address validation and a user-friendly interface that simplifies policy intake.
          Download InstaQuote today and take the first step towards a seamless insurance experience!
        </Typography>
      </Box>
 
      <Box sx={{ backgroundColor: '#f5f5f5', }}>
        {/* First Section */}
        <Box sx={{ width: "100%", maxWidth: 1200, margin: 'auto', padding: isMobile && '2rem' }}>
          <Typography variant="h4" className="Nasaliza" sx={{ fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center', color: '#001660' }}>
            InstaQuote Insurance Solutions
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={instasideimg}
                alt="Smart Home"
                sx={{
                  maxWidth: '100%',
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: "left" }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#0B70FF' }} className="Nasaliza">
                Seamless Policy Submission
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: '1rem', fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif", }}>
                InstaQuote simplifies the policy submission process with an intuitive interface that guides users in accurately and efficiently entering dwelling details.              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#0B70FF' }} className="Nasaliza">
                Instant Address Validation
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif", }}>
                InstaQuote features real-time address validation, ensuring the accuracy of your submissions for comprehensive and reliable coverage.              </Typography>
            </Grid>
          </Grid>
        </Box>
 
        {/* Second Section */}
        <Box sx={{ width: "100%", maxWidth: 1200, margin: 'auto', textAlign: 'left' }}>
          <Grid container spacing={0} alignItems="center" sx={{ marginLeft: isMobile ? "0" : "8rem", padding: isMobile && '2rem' }}>
            <Grid item xs={12} md={6} sx={{ textAlign: 'left' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#001660' }} className="Nasaliza">
                User-Friendly Interface
              </Typography>
              <Typography sx={{ marginBottom: '1rem', fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif", }}>
                Experience an intuitive and streamlined process with our user-friendly interface, designed to simplify policy intake and provide a seamless user experience.
              </Typography>
 
 
              <Box sx={{ display: isMobile ? 'block' : 'flex', justifyContent: isMobile ? '' : 'center', gap: 2 }}>
 
                <StyledButtonComponent variant="contained"
                  href="/requestdemo"
                  sx={{
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    marginBottom: 2,
                    padding: '10px 20px'
                  }}>
 
                  Request for Demo
                </StyledButtonComponent>
                <StyledButtonComponent variant="contained"
                  href="https://www.youtube.com/watch?v=PzfmnzxU7CU"
                  target="_blank" rel="noopener noreferrer"
                  sx={{
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    marginBottom: 2,
                    padding: '10px 20px'
                  }}>
 
                  Watch Video
                </StyledButtonComponent>
              </Box>
 
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={instaQuoteside}
                alt="instaQuote"
                sx={{
                  maxWidth: '100%',
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer />
    </>
  );
};
 
export default InstaQuote;