// import React from 'react';
// import { Box, Button, FormControl, FormControlLabel, FormLabel, Grid,Paper, Radio, RadioGroup, TextField, MenuItem, Typography } from '@mui/material';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// const Qualification = () => {
//   const [expirationDate, setExpirationDate] = React.useState(null);
//   const [propertyOccupancyStatus, setPropertyOccupancyStatus] = React.useState('');

//   return (
// //     <Box sx={{ flexGrow: 1, p: 3 }}>
// //     <Grid container spacing={2}>
// //       {/* Prior Insurance Coverage Section */}
// //       <Grid item xs={12}>
// //         <Typography variant="h6" color="primary">Prior Insurance Coverage</Typography>
// //       </Grid>
// //       <Grid item xs={12} sm={6}>
// //         <FormControl component="fieldset" fullWidth>
// //           <FormLabel component="legend">Prior Insurance Coverage?</FormLabel>
// //           <RadioGroup row>
// //             <FormControlLabel value="yes" control={<Radio />} label="Yes" />
// //             <FormControlLabel value="no" control={<Radio />} label="No" />
// //           </RadioGroup>
// //         </FormControl>
// //       </Grid>
// //       <Grid item xs={12} sm={6}>
// //         <LocalizationProvider dateAdapter={AdapterDayjs}>
// //           <DatePicker
// //             label="Expiration Date"
// //             value={expirationDate}
// //             onChange={(newValue) => setExpirationDate(newValue)}
// //             renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
// //           />
// //         </LocalizationProvider>
// //       </Grid>
// //       <Grid item xs={12} sm={6}>
// //         <TextField label="Prior Liability Limit" fullWidth margin="normal" />
// //       </Grid>

// //       {/* Property Occupancy Section */}
// //       <Grid item xs={12}>
// //         <Typography variant="h6" color="primary">Property Occupancy</Typography>
// //       </Grid>
// //       <Grid item xs={12} sm={6}>
// //         <FormControl component="fieldset" fullWidth>
// //           <FormLabel component="legend">Is the home Vacant?</FormLabel>
// //           <RadioGroup row>
// //             <FormControlLabel value="yes" control={<Radio />} label="Yes" />
// //             <FormControlLabel value="no" control={<Radio />} label="No" />
// //           </RadioGroup>
// //         </FormControl>
// //       </Grid>
// //       <Grid item xs={12} sm={6}>
// //         <TextField
// //           label="Property Occupancy Status"
// //           select
// //           value={propertyOccupancyStatus}
// //           onChange={(e) => setPropertyOccupancyStatus(e.target.value)}
// //           fullWidth
// //           margin="normal"
// //         >
// //           <MenuItem value="">
// //             <em>None</em>
// //           </MenuItem>
// //           <MenuItem value="occupied">Occupied</MenuItem>
// //           <MenuItem value="vacant">Vacant</MenuItem>
// //           <MenuItem value="under_renovation">Under Renovation</MenuItem>
// //         </TextField>
// //       </Grid>

// //       {/* Buttons */}
// //       <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
// //         <Button variant="outlined">Back</Button>
// //         <Button variant="contained" color="primary">Next</Button>
// //       </Grid>
// //     </Grid>
// //   </Box>

// <Grid
// container
// sx={{
//     flex: 1,
//     justifyContent: "center",
//     alignItems: 'center',
//     padding: 2,
//     overflowX: "hidden",
//     margin: "auto"
// }}
// >
// <Grid item xs={12} md={6} textAlign='center'>
//     <Typography
//         variant="h4"
//         sx={{ fontWeight: 600, mb: 2, color: "#010066", textAlign: 'left' }}
//     >
//       Qualification
//     </Typography>
//     <Paper
//             elevation={2}
//             sx={{
//                 padding: 2,
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "flex-start", // Align items to the start of the flex container (left side)
//                 width: '100%',
//                 maxWidth: 600,
//                 textAlign: 'left' // Ensure text alignment is to the left
//             }}
//         >
//             <Box sx={{ textAlign: 'left',width: '100%' }}>
//                 <Grid container sx={{ justifyContent: 'flex-start', textAlign: 'left',  width: '100%' }}>
//                     <Typography variant="h6" color="primary">
//                         Prior Insurance Coverage
//                     </Typography>
//                 </Grid>
//                 <Box sx={{ width: '100%' }}>
//       <FormControl component="fieldset" fullWidth>
//         <Grid container alignItems="center" spacing={2}>
//           {/* Text and RadioGroup placed side by side */}
//           <Grid item xs={12} sm={12} sx={{ display: 'flex', alignItems: 'center' }}>
//             <FormLabel component="legend" sx={{ marginRight: 2 }}>
//               Prior Insurance Coverage?
//             </FormLabel>
//             <Grid container >

//             <RadioGroup row>
//                 <FormControlLabel value="yes" control={<Radio />} label="Yes" />
//                 <FormControlLabel value="no" control={<Radio />} label="No" />
//               </RadioGroup>
//             </Grid>
//           </Grid>
//         </Grid>
//       </FormControl>
//     </Box>
// {/* calendar */}
//     <Box sx={{ width: '100%' }}>
//       <FormControl component="fieldset" fullWidth>
//         <Grid container alignItems="center" spacing={2}>
//           {/* Text and RadioGroup placed side by side */}
//           <Grid item xs={12} sm={12} sx={{ display: 'flex', alignItems: 'center' }}>
//             <FormLabel component="legend" sx={{ marginRight: 2 }}>
//             Expiration Date
//             </FormLabel>
//             <Grid container >

//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <DatePicker
//             label="Expiration Date"
//             value={expirationDate}
//             onChange={(newValue) => setExpirationDate(newValue)}
//             renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
//           />
//         </LocalizationProvider>
//             </Grid>
//           </Grid>
//         </Grid>
//       </FormControl>
//     </Box>


//     {/* Prior Liability Limit */}
//     <Box sx={{ width: '100%' }}>
//       <FormControl component="fieldset" fullWidth>
//         <Grid container alignItems="center" spacing={2}>
//           {/* Text and RadioGroup placed side by side */}
//           <Grid item xs={12} sm={12} sx={{ display: 'flex', alignItems: 'center' }}>
//             <FormLabel component="legend" sx={{ marginRight: 2 }}>
//             Prior Liability Limit
//             </FormLabel>
//             <Grid container >

//             <TextField label="Prior Liability Limit" fullWidth margin="normal" />
//             </Grid>
//           </Grid>
//         </Grid>
//       </FormControl>
//     </Box>



// <Box sx={{ width: '100%' }}>
//       <FormControl component="fieldset" fullWidth>
//         <Grid container alignItems="center" spacing={2}>
//           {/* Text and RadioGroup placed side by side */}
//           <Grid item xs={12} sm={12} sx={{ display: 'flex', alignItems: 'center' }}>
//             <FormLabel component="legend" sx={{ marginRight: 2 }}>
//             Prior Liability Limit
//             </FormLabel>
//             <Grid container >

//             <TextField label="Prior Liability Limit" fullWidth margin="normal" />
//             </Grid>
//           </Grid>
//         </Grid>
//       </FormControl>
//     </Box>





//             </Box>
//         </Paper>
// </Grid>
// </Grid>
//   );
// };

// export default Qualification;
