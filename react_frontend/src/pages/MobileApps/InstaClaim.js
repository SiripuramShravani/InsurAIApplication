import React from 'react';
import { Grid, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Header from '../../components/header';
import Footer from '../../components/footer';
import InstaCliam_Reporting from '../../assets/InstaCliam_Reporting.png';
import instaClaimimg from '../../assets/instaClaim_img.png';
import insta_Status from '../../assets/insta_Status.png';
import Insta_Rightside from '../../assets/Insta_Rightside.png';
import insta_download from '../../assets/insta_download.png';
import StyledButtonComponent from '../../components/StyledButton';
 
import ContactMailIcon from '@mui/icons-material/ContactMail';
 
const InstaClaim = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
 
  return (
    <>
      <Header />
      <Box
        // sx={{ background: 'linear-gradient(180deg,#9c27b0 0%,#1a73e8 100%)', }}
        sx={{backgroundColor:'darkblue'}}
      >
        <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto' }}>
          <Typography className="Nasaliza" sx={{
            fontWeight: 'bold',
            fontSize: 30,
            textAlign: 'center',
            paddingTop: "3rem",
            color: 'white'
          }}>
            Insta<span style={{ color: '#0B70FF' }}>Claim</span> Mobile App
          </Typography>
          {isMobile &&
 
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={instaClaimimg} // Placeholder image URL
                alt="InstaClaimImg"
                sx={{ maxWidth: '100%' }}
              />
            </Grid>
          }
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ textAlign: 'center' }}
          >
            {/* Text Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ textAlign: isMobile ? 'center' : 'left',  color: 'white' }} className="Nasaliza">
                Insta<span style={{ color: '#0B70FF' }}>Claim</span>: Your Comprehensive Insurance Claims Solution
              </Typography>
              <Typography variant="body1" sx={{
                fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                textAlign: 'justify',
                padding: isMobile ? '1.5rem' : '1rem 0rem', color: 'white'
              }}>
               InstaClaim revolutionizes the insurance claims process, offering a seamless platform for instant filing and management of claims. Our intuitive Mobile app empowers users to effortlessly track the status of their claims in real-time, providing a streamlined experience that enhances efficiency and transparency from initiation to resolution.
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
                  href="https://www.youtube.com/watch?v=V5md9oyb1bs"
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
              <Box sx={{textAlign:isMobile?"center": 'center'}}>
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
 
            {/* Image Section */}
            {!isMobile &&
 
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src={instaClaimimg} // Placeholder image URL
                  alt="InstaClaimImg"
                  sx={{ maxWidth: '100%' }}
                />
              </Grid>
            }
 
          </Grid>
        </Box>
      </Box>
      {/* <Box sx={{
        background: '#f7f9fa',
        padding: '2rem 0',
        textAlign: 'center',
        boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
      }}>
        <Typography variant="h5" sx={{ color: '#001660', marginBottom: 1 }}>
          Why Choose InstaClaim?
        </Typography>
        <Typography variant="body1" sx={{
          fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
          maxWidth: 800,
          margin: 'auto',
          padding: '0 2rem',
          textAlign: 'justify',
        }}>
          With InstaClaim, you can effortlessly manage your insurance claims with just a few taps.
          Our intuitive app guides you through every step, allowing you to easily upload documents and
          communicate with adjusters. Experience real-time updates and a user-friendly interface that
          simplifies the claims process. Download InstaClaim today and take the first step towards
          a hassle-free insurance claims experience!
        </Typography>
      </Box> */}
      <Box sx={{
        background: '#f7f9fa',
 
      }}>
        <Box sx={{ width: "100%", maxWidth: 1200, margin: 'auto', padding: isMobile && '2rem', marginTop: "2.2rem" }}>
 
          <Typography variant="h4" sx={{ color: '#001660', marginBottom: 2 }} className="Nasaliza">
            Streamlined Claims Management
          </Typography>
 
          {/* First Section: Text on left, Image on right */}
          <Grid container spacing={2} alignItems="center">
            <Grid container spacing={0} alignItems="center" sx={{ marginLeft: isMobile ? "0" : "8rem", padding: isMobile && '2rem' }}>
              <Grid item xs={12} md={6} sx={{ textAlign: "left" }}>
                <Typography variant="h5" sx={{ color: '#001660', marginBottom: 1, textAlign: 'left' }} className="Nasaliza">
                Accelerated Claims Reporting
                </Typography>
                <Typography variant="body1" sx={{ textAlign: 'justify', fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif", }}>
                Our user-friendly interface and guided, step-by-step process simplify claims reporting, enhancing accessibility for policyholders and accelerating the overall reporting experience.                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src={InstaCliam_Reporting}
                  alt="InstaCliam_Reporting"
                  sx={{
                    maxWidth: '100%',
                  }}
                />
              </Grid>
            </Grid>
 
          </Grid>
 
          {/* Second Section: Image on left, Text on right */}
          <Grid container spacing={4} sx={{ maxWidth: 1200, margin: 'auto', alignItems: 'center', marginBottom: 4, paddingRight: !isMobile && '12rem' }}>
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <Box component="img" src={Insta_Rightside} alt="Accelerate Settlement" sx={{ maxWidth: '100%' }} />
            </Grid>
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <Typography variant="h5" sx={{ color: '#001660', marginBottom: 1, textAlign: 'left' }} className="Nasaliza">
              Expedited Settlements
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'justify', fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif", }}>
              InstaClaim harnesses cutting-edge technology and expert support to expedite the settlement process, ensuring policyholders receive prompt assistance and timely updates every step of the way.
 
</Typography>
            </Grid>
          </Grid>
 
          {/* Third Section: Text on left, Image on right */}
          <Grid container spacing={2} alignItems="center">
            <Grid container spacing={0} alignItems="center" sx={{ marginLeft: isMobile ? "0" : "10rem", padding: isMobile && '2rem' }}>
              <Grid item xs={12} md={6} sx={{ textAlign: "left" }}>
                <Typography variant="h5" sx={{ color: '#001660', marginBottom: 1, textAlign: 'left' }} className="Nasaliza">
                  Enhance Transparency
                </Typography>
                <Typography variant="body1" sx={{ textAlign: 'justify', fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif", }}>
                  Our streamlined approach enhances transparency in the claims process, providing policyholders with clear and accessible information throughout their journey.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src={insta_Status}
                  alt="insta_Status"
                  sx={{
                    maxWidth: '100%',
                  }}
                />
              </Grid>
            </Grid>
 
          </Grid>
 
        </Box>
      </Box>
      <Box sx={{ background: '#ffffff', padding: '4rem 0' }}>
 
        <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto' }} >
          <Grid container spacing={4} alignItems="center">
            {/* Image Section */}
            <Grid item xs={12} md={6}>
              <Box component="img"
                src={insta_download} // Replace this with the path to your image
                alt="InstaClaim Mobile App"
                sx={{ maxWidth: '100%', borderRadius: '8px' }}
              />
            </Grid>
            {/* Text Section */}
            <Grid item xs={12} md={6} sx={{ textAlign: 'left' }}>
              <Typography
                variant="h4"
                sx={{ color: '#001660', marginBottom: 2, fontWeight: 'bold', textAlign: 'left' }} className="Nasaliza"
              >
                Download InstaClaim Mobile App – Simplify Your Insurance Claims
              </Typography>
 
              <Typography
                variant="body1"
                sx={{
                  color: '#555',
                  marginBottom: 4,
                  textAlign: 'justify',
                  lineHeight: 1.6,
                  maxWidth: '80%',
                }}
              >
                InstaClaim is here to revolutionize your insurance claims process. With our mobile app, you can easily report claims, submit required documents, and receive real-time updates – all in one place. Get the support you need, fast and efficiently. Download now to experience a hassle-free claims process.
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
                       href="https://www.youtube.com/watch?v=V5md9oyb1bs"
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
 
 
          </Grid>
        </Box>
      </Box>
      <Footer />
    </>
  );
};
 
export default InstaClaim;