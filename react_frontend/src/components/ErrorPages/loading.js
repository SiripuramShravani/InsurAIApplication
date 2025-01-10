import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

function Loading() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        backgroundColor: '#fff',
        animation: 'fadeIn 1s ease-in-out',
        '@keyframes fadeIn': {
          from: { opacity: 0 },
          to: { opacity: 1 }
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
          animation: 'rotateSymbol 2s linear infinite',
          '@keyframes rotateSymbol': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }}
      >
        <CircularProgress
          size={40}
          thickness={5}
          sx={{
            color: '#fff',
            animation: 'scalePulse 1s infinite ease-in-out',
            '@keyframes scalePulse': {
              '0%, 100%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.2)' }
            }
          }}
        />
      </Box>
      <Typography
        variant="h6"
        sx={{
          color: '#1976d2',
          marginTop: 2,
          fontWeight: 'bold',
          letterSpacing: '0.05em'
        }}
      >
        Loading, please wait...
      </Typography>
    </Box>
  );
}

export default Loading;
