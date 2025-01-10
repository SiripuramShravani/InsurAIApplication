import React from 'react';
import { Paper, Box, Alert, Typography } from '@mui/material';
import errorImage from '../../assets/errorImage.png'; // Ensure the path is correct

const PreviewError = () => {
  return (
    <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center', marginTop: '30px' }}>
      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        <img 
          src={errorImage} 
          alt="Error" 
          style={{ width: '200px', height: '200px' }} // Adjust size as needed
        />
      </Box>
      <Alert severity="info" sx={{ backgroundColor: '#6F9CDE', color: 'white' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif", 
            color: 'white' 
          }}
        >
          Unable to load document preview, please reupload your document.
        </Typography>
      </Alert>
    </Paper>
  );
};

export default PreviewError;
