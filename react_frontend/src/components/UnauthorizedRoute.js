import React from "react";
import { Helmet } from 'react-helmet';
import { Box, Button, Typography, Container } from "@mui/material";
import { styled } from '@mui/system';
import error from '../assets/Access.png';
import logo from '../assets/IT.png';
import LoginIcon from '@mui/icons-material/Login'; 
import { useNavigate, useLocation } from 'react-router-dom';

// Custom styles for the button 
const LoginButton = styled(Button)({
  backgroundColor: '#000166',
  color: '#fff',
  borderRadius: '50px',
  padding: '10px 12px',
  textTransform: 'none',
  fontSize: '14px',
  marginTop: '20px',
  '&:hover': {
    backgroundColor: '#e06969', 
  },
  display: 'flex', 
  alignItems: 'center', 
});


const UnauthorizedRoute = ({ isAuthError = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    if (isAuthError) {
      navigate('/signin', { 
        state: { from: location.state?.attemptedPath || '/dashboard' },
        replace: true 
      });
    } else {
      navigate('/');
    }
  };

  return (
    <Box
      sx={{
        height: '620px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000166', 
        overflow: 'hidden',
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          position: 'relative', 
          backgroundColor: 'white', 
          textAlign: 'center', 
          padding: '20px', 
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          overflowY: 'hidden', 
        }}
      >
        <Helmet>
          <title>{isAuthError ? 'Unauthorized Access' : '404 - Page Not Found'}</title>
          <meta 
            name="description" 
            content={isAuthError ? 
              "Please sign in to access this page" : 
              "Sorry, the page you're looking for doesn't exist."
            } 
          />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <img
          src={logo} 
          alt="Logo" 
          style={{
            position: 'absolute', 
            top: '20px', 
            left: '20px', 
            width: '50px', 
          }}
        />
       
        <img
          src={error}
          alt="Access Denied"
          style={{ width: '300px', marginBottom: '20px' }} 
        />
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: '24px', 
            fontWeight: 'bold', 
            fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif"
          }}
        >
          {isAuthError ? 'Access Restricted' : 'Oops! 404 - Page Not Found'}
        </Typography>
        <Typography
          
          color="textPrimary"
          gutterBottom
          sx={{
            
            marginBottom: 2,
            fontSize:"1rem"
          }}
        >
          {isAuthError 
            ? 'Please sign in to access this page. If you believe this is an error, contact support.'
            : "It looks like the page you're trying to reach doesn't exist or has been moved."
          }
        </Typography>
       
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoginButton 
            variant="contained"
            onClick={handleGoBack} 
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
            <LoginIcon sx={{ marginRight: '8px', fontSize: '1rem' }} /> 
            Sign In 
          </LoginButton>
        </div>
      </Container>
    </Box>
  );
};

export default UnauthorizedRoute;