import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { styled } from '@mui/system';
import HomeIcon from '@mui/icons-material/Home'; // Import the Home icon
import error from '../../assets/NoInternet.png';
import logo from '../../assets/IT.png';

const NetworkError = () => {
  // Custom styles for the Home button
  const HomeButton = styled(Button)({
    backgroundColor: '#000166', // Button background color
    color: '#fff', // Button text color
    borderRadius: '50px', // Rounded corners
    padding: '10px 12px', // Decreased padding for a smaller button
    textTransform: 'none', // No uppercase transformation
    fontSize: '14px', // Decreased font size
    marginTop: '20px', // Spacing above the button  
    '&:hover': {
      backgroundColor: '#e06969', // Darker color on hover
    },
    display: 'flex', // Flexbox for icon and text alignment
    alignItems: 'center', // Center icon and text vertically
  });

  return (
    <Box
    sx={{
      height: '620px', 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000166', // Dark blue background
      overflow: 'hidden', // Prevent scrollbars
    }}
  >
    <Container
      maxWidth="sm" // Adjusted to small for a smaller container width
      sx={{
        position: 'relative', // Set position to relative for child absolute positioning
        backgroundColor: 'white', // White background for the container
        textAlign: 'center', // Center text
        padding: '20px', // Reduced padding for container to fit better
        borderRadius: '10px', // Rounded corners for container
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Soft shadow effect
        marginTop: '20px', // Margin above the container
        marginBottom: '20px', // Margin below the container
        maxHeight: '80vh', // Limit height to prevent overflow
        overflowY: 'hidden', // Disable vertical scrolling completely 
      }}
    >
      {/* Logo Image positioned absolutely within the Container */}
      <img
        src={logo} // Use your logo image source
        alt="Logo" // Accessibility description
        style={{ 
          position: 'absolute', // Positioning the logo absolutely
          top: '20px', // Adjust as needed
          left: '20px', // Adjust as needed
          width: '50px', // Adjust width as needed
        }} 
      />
        {/* Error image */}
        <img
          src={error}
          alt="404 Page Not Found" // Accessibility description
          style={{ width: '300px' }} // Adjusted width of the error image
        />
        <Typography 
          sx={{
            textAlign: 'center',
            fontSize: '24px', // Increased font size for main heading
            fontWeight: 'bold', // Bold font weight for emphasis
            fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
            marginBottom: 2, // Added bottom margin for spacing between texts
          }}
        >
          Woopsie Daisy!
        </Typography>
        <Typography 
          color="textPrimary" 
          gutterBottom 
          sx={{
            fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
            marginBottom: 2, // Added bottom margin for spacing between texts
          }}
        >
         Looks like something went completely wrong! But don't worry.
        </Typography>
        <Typography 
          color="textPrimary" 
          gutterBottom 
          sx={{
            fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
            marginBottom: 1.5, // Added bottom margin for spacing between texts
          }}
        >
        Check your internet connection and try again!
        </Typography>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        <HomeButton 
            variant="contained" 
            href="/" 
            sx={{
                fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                padding: '2px 8px', // Decreased padding for a smaller button
                fontSize: '0.875rem', // Decreased font size for a smaller button
                width: 'auto',
                maxWidth: '80px', // Adjusted maximum width
                lineHeight: 1.5, // Adjusted line height for smaller button
                textAlign: 'center',
            }}
            >
            <HomeIcon sx={{ marginRight: '4px', fontSize: '0.875rem' }} /> {/* Adjusted icon size */}
            Home
            </HomeButton>
        </div>
      </Container>
    </Box>
  );
};

export default NetworkError;