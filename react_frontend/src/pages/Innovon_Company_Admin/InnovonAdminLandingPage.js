import React from "react";
import {
   Box,
   Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"; 
import insureradminpic from "../../assets/insureradminpic.png";
 
const InnovonAdminLandingPage = () => {
  const TheamMedia = useTheme();
  const isMobile = useMediaQuery(TheamMedia.breakpoints.down('sm'));

  return (  
     <Box sx={{ background: 'linear-gradient(to right, #B5D4FF,#0964E5)', paddingBottom: '3rem' }}>
    {/* Main Heading */}
    <Box sx={{ textAlign: 'center', paddingTop: { xs: '2rem', md: '3rem' } }}>
      <Typography
        variant="h4"
        component="h4"
        sx={{
          fontWeight: 'bold',
          color: "white",
          fontSize: { xs: '2rem', md: '3rem' } // Responsive font size
        }}
        className="Nasaliza"
      >
        Insur<span style={{color:'#0B70FF'}}>Admin</span> Platform
      </Typography>
    </Box>
   
    {/* Main Content */}
    <Box
      sx={{
        padding: { xs: '20px', md: '40px' },
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Grid container spacing={4}>
        {/* Image Section */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: '100%',
              height: { xs: '200px', md: '300px' }, // Adjusted height for responsiveness
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: { xs: '2rem', md: '3.5rem' },
              marginBottom: "2rem"
            }}
          >
            <img
              src={insureradminpic}
              alt="InsurerAdmin"
              style={{
                maxWidth: '100%',
                height: isMobile? '250px':'450px',
                width: { xs: '80%', md: 'auto' } // Responsive width
              }}
            />
          </Box>
        </Grid>
   
        {/* Text Section */}
        <Grid item xs={12} md={6} sx={{justifyContent:'center',alignItems:'center',marginTop:'4rem'}}>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, justifyContent:'center', alignItems:'center' }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: "#010066",
                fontSize: { xs: '1.5rem', md: '2rem' } // Responsive font size
              }}
              className="Nasaliza"
            >
              Welcome to  Insur<span style={{color:'#0B70FF'}}>Admin</span> Platform, the Future of Insurance
            </Typography>
   
            <Typography
              sx={{
                marginTop: '20px',
                color: 'whitesmoke',
                fontSize: { xs: '1rem', md: '1.2rem' } // Responsive text size
              }}
            >
              Experience a new era of insurance management with our innovative platform
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
   
    {/* Cards Section */}
    <Box sx={{ padding: { xs: '20px', md: '40px' }, maxWidth: '1200px', margin: '0 auto' }}>
      <Grid container spacing={4}>
        {/* Card 1: Add Company */}
        <Grid item xs={12} md={4}>
          <Box sx={{
            backgroundColor: '#001660',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            height: '300px', // Fixed height for consistency
            boxShadow: '0 4px 30px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.05)' }
          }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', marginBottom: '1rem' }}>
              <i className="fas fa-plus-circle" style={{ fontSize: '2rem', color: '#B3C1FF' }}></i> {/* Futuristic Icon */}
              Add New Tie-Up Company
            </Typography>
            <Typography sx={{ color: '#B3C1FF' }}>
              Quickly and efficiently add new companies to your portfolio. Our streamlined interface makes onboarding simple
              and secure, with intuitive data entry and verification features.
            </Typography>
          </Box>
        </Grid>
   
        {/* Card 2: Search Company */}
        <Grid item xs={12} md={4}>
          <Box sx={{
            backgroundColor: '#001660',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            height: '300px', // Fixed height for consistency
            boxShadow: '0 4px 30px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.05)' }
          }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', marginBottom: '1rem' }}>
              <i className="fas fa-search" style={{ fontSize: '2rem', color: '#B3C1FF' }}></i> {/* Futuristic Icon */}
              Search Existing Companies
            </Typography>
            <Typography sx={{ color: '#B3C1FF' }}>
              Find companies in your network easily. Use our advanced search capabilities to locate tie-up companies by
              name, location, or status.
            </Typography>
          </Box>
        </Grid>
   
        {/* Card 3: Edit Company */}
        <Grid item xs={12} md={4}>
          <Box sx={{
            backgroundColor: '#001660',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            height: '300px', // Fixed height for consistency
            boxShadow: '0 4px 30px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.05)' }
          }}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', marginBottom: '1rem' }}>
              <i className="fas fa-edit" style={{ fontSize: '2rem', color: '#B3C1FF' }}></i> {/* Futuristic Icon */}
              Edit Company Details
            </Typography>
            <Typography sx={{ color: '#B3C1FF' }}>
              Update or modify existing company information with ease. Our user-friendly interface allows you to edit company
              profiles, contact information, and more efficiently.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  </Box>
  
   



  )
}

export default InnovonAdminLandingPage