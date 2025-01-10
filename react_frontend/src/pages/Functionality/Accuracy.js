import React from 'react';
import { Box, Card, Typography, LinearProgress } from '@mui/material';

const AccuracyDisplay = ({ accuracy }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', // Cover the entire width
        height: 'auto', // Allow height to adjust based on content
        padding: 2 // Optional: Add padding for better spacing
      }}
    >
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%', // Cover the entire width
          maxWidth: 1100, // Optional: Set a max width for larger screens
          height: 50, // Set a fixed height for the card
          borderRadius: 2,
          boxShadow: 0,
          bgcolor: 'white',
          borderBottom: '1px solid #1976D2' //
        }}
      >
        <Box>
          <Typography color="text.primary"sx={{ marginLeft: 2 }}>
          Confidence Factor
          </Typography>
        </Box>
        <Box width="50%" mr={2}>
          <LinearProgress
            variant="determinate"
            value={accuracy}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: '#d1e3f6',
              '& .MuiLinearProgress-bar': {
                bgcolor: accuracy > 80 ? '#4caf50' : '#ff9800',
              },
            }}
          />
        </Box>
        <Typography variant="h6" color="text.primary" sx={{ marginRight: 2 }}>
  {`${Math.round(accuracy)}%`}
</Typography>
      </Card>
    </Box>
  );
};

export default AccuracyDisplay;
