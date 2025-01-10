// import React from 'react';
// import {
//   Container,
//   Typography,
//   Button,
//   Box,
//   Snackbar,
//   Alert,
// } from '@mui/material';

// const NetworkIssue = () => {
//   const [open, setOpen] = React.useState(false);

//   const handleRetry = () => {
//     // Simulate page reload to retry network connection
//     window.location.reload(); // This will refresh the page
//   };

//   const handleClose = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }

//     setOpen(false);
//   };

//   return (
//     <Container component="main" maxWidth="xs">
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           mt: 8,
//         }}
//       >
//         <Typography variant="h5" gutterBottom>
//           Oops! Network Issue
//         </Typography>
//         <Typography variant="body1" color="textSecondary" align="center">
//           It seems there was a problem connecting to the network. Please check your internet connection and try again.
//         </Typography>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleRetry}
//           sx={{ mt: 3 }}
//         >
//           Retry
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default NetworkIssue;
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';

// Custom styles using makeStyles for more specific styling
const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#e0f7fa',
  },
  card: {
    width: '300px',
    textAlign: 'center',
    padding: '30px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    border: '5px solid #4fc3f7',
  },
  icon: {
    marginBottom: '20px',
    '& img': {
      width: '100px',
    },
  },
  button: {
    backgroundColor: '#ff8a80',
    color: '#fff',
    marginTop: '20px',
    '&:hover': {
      backgroundColor: '#ff5252',
    },
  },
  errorText: {
    color: '#ff5252',
    marginTop: '10px',
  },
});

export default function ErrorCard() {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Paper className={classes.card} elevation={3}>
        {/* Icon Section */}
        <Box className={classes.icon}>
          {/* Replace the source with the actual path to your image */}
          <img src="broken-icon.png" alt="error icon" />
        </Box>

        {/* Text Section */}
        <Typography variant="h4" gutterBottom>
          Uh oh.
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Something wierd happened.
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Keep calm and try again.
        </Typography>

        {/* Button Section */}
        <Button variant="contained" className={classes.button}>
          TRY AGAIN
        </Button>
      </Paper>
    </Box>
  );
}
