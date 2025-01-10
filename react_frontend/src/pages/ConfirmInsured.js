import { Grid, Box, Button, Typography } from '@mui/material';
import React from 'react';
import {  useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';

import Yes_NO from "../../src/assets/Yes-No.png"
 
const ConfirmInsured = () => {
  const navigate = useNavigate();
  const handleYesClick = () => {
    localStorage.setItem("isInsured", "yes");
    navigate("/signin")
  };
 
  const handleNoClick = () => {
    localStorage.setItem("isInsured", "no");
    navigate("/signin")
  };
 
  return (
    <>
 
      <Header />
      <Grid marginTop="125px"></Grid>
      <Box
        sx={{
 
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '16px',
          maxWidth: '400px',
          margin: 'auto',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <img src={Yes_NO} alt='img' style={{ marginBottom: '26px', width: '100px', height: 'auto' }} />
          <Typography variant="h5" component="h2" gutterBottom className='Nasaliza' color='blue' >
          Are you a registered user ?
          </Typography>
          <Grid container marginTop='36px' justifyContent="space-around" alignItems="center">
            <Button variant="contained" color="primary" onClick={handleYesClick} sx={{ margin: '8px' }}>
              Yes
            </Button>
            <Button variant="contained" color="primary" onClick={handleNoClick} sx={{ margin: '8px' }}>
              No
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Grid marginBottom="125px"></Grid>
      <Footer />
    </>
  );
};
 
export default ConfirmInsured;