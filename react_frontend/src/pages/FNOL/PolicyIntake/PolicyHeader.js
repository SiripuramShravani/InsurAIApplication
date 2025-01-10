import { AppBar, Grid, Toolbar, Typography, Container, Avatar, Box } from "@mui/material";
import React from "react";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

export default function PolicyHeader() {

  const PolicyHolderDetailsAfterPolicyIntakeSignIn = JSON.parse(localStorage.getItem("signinUserDetails"));

  if (!PolicyHolderDetailsAfterPolicyIntakeSignIn) {
    return null; // Handle the case where the object is not found in localStorage
  }

  const { user_name, user_email, mobile_number } = PolicyHolderDetailsAfterPolicyIntakeSignIn;

  // Generate initials from the user name
  const initials = user_name.split(" ").map((name) => name[0]).join("");

  return (
    <AppBar position="static" sx={{ backgroundColor: '#000166', padding:"1.2rem 0rem 0rem 0rem" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Grid container alignItems="center" justifyContent="space-between">
            {/* Left Section: Avatar, Name, and Email */}
            <Grid item xs={6} display="flex" alignItems="center">
              <Avatar sx={{ bgcolor: '#ccc', color: '#000166', marginRight: '10px' }}>
                {initials}
              </Avatar>
              <Box>
                <Typography variant="body1" sx={{ color: '#ccc', marginRight: "1.5rem" }}>
                  {user_name}
                </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <EmailIcon sx={{ color: '#ccc', marginRight: '5px' }} />
                  <Typography variant="body2" sx={{ color: '#ccc' }}>
                    {user_email}
                  </Typography>
                </Box>
              
            </Grid>

            {/* Right Section: Mobile Number and Date of Birth */}
            <Grid item xs={6} display="flex" justifyContent="flex-end" alignItems="center">
              <Box display="flex" alignItems="center" marginRight="1.5rem">
                <PhoneIcon sx={{ color: '#ccc', marginRight: '5px' }} />
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                  {mobile_number}
                </Typography>
              </Box>

             
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
