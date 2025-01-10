import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { styled } from '@mui/system';
import RefreshIcon from '@mui/icons-material/Refresh';
import error from '../../assets/DatabaseError.png';
import logo from '../../assets/IT.png';

const DatabaseError = () => {
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
      }}
    >
      <Container
        maxWidth="md" // Medium container width
        sx={{
          position: 'relative', // Set position to relative for child absolute positioning
          backgroundColor: 'white', // White background for the container
          textAlign: 'center', // Center text
          padding: '40px', // Padding for container
          borderRadius: '10px', // Rounded corners for container
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Soft shadow effect
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
          alt="Database Error" // Accessibility description
          style={{ width: '400px', marginBottom: '20px' }} // Width of the error image
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
          UH-OH!
        </Typography>
        <Typography 
          sx={{
            textAlign: 'center',
            fontSize: 20, // Font size for main heading
            fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif"
          }}
        >
          Sorry, Something went wrong on our end
        </Typography>
        <Typography 
          variant="h6" 
          color="textPrimary" 
          gutterBottom 
          sx={{
            fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
          }}
        >
          Don't worry, It's not you - it's Us, sorry about that 
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <HomeButton 
            variant="contained" 
            href="/" 
            sx={{
              fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
              padding: '4px 12px', // Padding for a compact size
              fontSize: '1rem', // Smaller font size
              width: 'auto', // Button width adjusts to content size
              maxWidth: '100px', // You can set a maximum width if needed
              lineHeight: 2.5, // Compact line height
              textAlign: 'center', // Ensure the text is centered
            }}
          >
            <RefreshIcon sx={{ marginRight: '4px', fontSize: '1rem' }} /> {/* Adjust icon size */}
            Refresh
          </HomeButton>
        </div>
      </Container>
    </Box>
  );
};

export default DatabaseError;
