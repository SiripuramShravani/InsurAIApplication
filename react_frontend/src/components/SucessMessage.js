// SuccessPage.js
import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import Header from './header';
import Footer from './footer';

const SuccessPage = () => {
  

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: 8 ,height:"600px",marginTop:"2rem"}}>
        <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" className="Nasaliza" gutterBottom>
            Demo Request Submitted Successfully!
          </Typography>
          <Typography variant="body1" paragraph>
            Thank you for your request. We have received your demo request, and our team will contact you shortly.
          </Typography>
          
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default SuccessPage;
