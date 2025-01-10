import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { styled } from '@mui/system';
import HomeIcon from '@mui/icons-material/Home'; // Import the Home icon
import error from '../../assets/error.png';
import logo from '../../assets/IT.png';

const NotFoundPage = () => {
  // Custom styles for the Home button
  const HomeButton = styled(Button)(() => ({
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
  }));

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
          style={{ width: '300px', marginBottom: '20px' }} // Adjusted width of the error image to fit better
        />
        <Typography 
          sx={{
            textAlign: 'center',
            fontSize: '24px', // Increased font size for main heading
            fontWeight: 'bold', // Bold font weight for emphasis
            fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif"
          }}
        >
          Page Not Found!
        </Typography>
        <Typography 
          variant="h6" 
          color="textPrimary" 
          gutterBottom 
          sx={{
            fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
            marginBottom: 2, // Added bottom margin for spacing between texts
          }}
        >
          Oops! The page you’re looking for isn’t available.
        </Typography>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <HomeButton 
            variant="contained" 
            href="/" 
            sx={{
              fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
              padding: '4px 12px',
              fontSize: '1rem',
              width: 'auto',
              maxWidth: '100px',
              lineHeight: 2.5,
              textAlign: 'center',
            }}
          >
            <HomeIcon sx={{ marginRight: '4px', fontSize: '1rem' }} /> {/* Adjust icon size */}
            Home
          </HomeButton>
        </div>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
