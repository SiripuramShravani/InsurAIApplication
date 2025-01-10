// import React, { useEffect, useState } from "react";
// import {
 
//   Box,
 
//   useMediaQuery,
//   createTheme,
 
//   Grid,
//   Typography,
// } from "@mui/material";


// import InsurerAdmin from '../assets/InsurerAdmin.png'
// import Header from '../components/header';
// import Footer from '../components/footer';
// import Customerpage1 from "./custometinsurancecompany";

// const sidebarItems = [
//   { label: "Policy Holder Info", icon: <PersonIcon /> },
//   { label: "Property Information", icon: <ApartmentIcon /> },
//   { label: "Prior Policy Info", icon: <AssessmentIcon /> },
//   { label: "Coverages", icon: <SecurityIcon /> },
//   { label: "Policy Review", icon: <AssignmentIcon /> },
// ];


// const theme = createTheme({
//   breakpoints: {
//     values: {
//       xs: 0,
//       sm: 600,
//       md: 960,
//       lg: 1280,
//       xl: 1920,
//     },
//   },
// });
// export default function CustomerSidebar(){
//     const [activeStep, setActiveStep] = useState(0);
  
//   const [stepsCompleted, setStepsCompleted] = useState([]);
  
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
//   const [policyHolderAddress, setPolicyHolderAddress] = useState({})
 
//   const [stepValidity, setStepValidity] = useState({
//     0: false,
//     1: false,
//     2: false,
//     3: false,
//   });

//   const [openPopup, setOpenPopup] = useState(false);

//   useEffect(() => {
//     const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
//     const userAccess = Authorization ? JSON.parse(localStorage.getItem('userAccess')) : [];

//     if (!userAccess.includes('policy_intake') || !Authorization) {
//       setOpenPopup(true);
//     }
//   }, []);
 
  

 

//   const handleGotoStep = (step) => {
//     console.log(step, activeStep);
    
//     // 1. Allow going back to previous steps
//     // 2. Allow going to the next step if the current step is valid
//     // 3. Allow going to the review step (last step) ONLY if ALL previous steps are valid
//     if (step < activeStep) {
//       console.log("step is less that active step", step, activeStep);
      
//       window.scrollTo(0, 0);
//       setActiveStep(step);
     
//     } else if (step === activeStep + 1 && stepValidity[activeStep]) {
//       console.log("Allow going to the next step if the current step is valid");
      
//       window.scrollTo(0, 0);
//       setActiveStep(step);
   
//     } else if (step === sidebarItems.length - 1) {
//       console.log("Allow going to the review step (last step) ONLY if ALL previous steps are valid");
      
//       // Check if all previous steps are valid before allowing navigation to review
//       let allStepsValid = true;
//       for (let i = 0; i < step; i++) { 
//         if (!stepValidity[i]) {
//           allStepsValid = false;
//           break;
//         }
//       }


//       if (allStepsValid) {
//         console.log("all steps valid");
        
//         window.scrollTo(0, 0);
//         setActiveStep(step);
       
//       } 
//     }
//   };
//   const [newCompanyFormvisible, setNewCompanyFormvisible] = React.useState(false);
//   const handlevisibleNewCompanyForm = () => {
//     setNewCompanyFormvisible(true);
//   }



//   return (
//     <>
//       <Header />
//       <Box sx={{ background: 'linear-gradient(to right, #4b6cb7, #001660)', paddingBottom: '3rem' }}>
//   {/* Main Heading */}
//   <Box sx={{ textAlign: 'center', paddingTop: { xs: '2rem', md: '3rem' } }}>
//     <Typography
//       variant="h4"
//       component="h4"
//       sx={{
//         fontWeight: 'bold',
//         color: "white",
//         fontSize: { xs: '2rem', md: '3rem' } // Responsive font size
//       }}
//       className="Nasaliza"
//     >
//       Insurer Admin
//     </Typography>
//   </Box>

//   {/* Main Content */}
//   <Box
//     sx={{
//       padding: { xs: '20px', md: '40px' },
//       maxWidth: '1200px',
//       margin: '0 auto',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//     }}
//   >
//     <Grid container spacing={4}>
//       {/* Image Section */}
//       <Grid item xs={12} md={6}>
//         <Box
//           sx={{
//             width: '100%',
//             height: { xs: '200px', md: '300px' }, // Adjusted height for responsiveness
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             marginTop: { xs: '2rem', md: '3.5rem' },
//             marginBottom: "2rem"
//           }}
//         >
//           <img 
//             src={InsurerAdmin} 
//             alt="InsurerAdmin" 
//             style={{
//               maxWidth: '100%',
//               height: '450px',
//               width: { xs: '80%', md: 'auto' } // Responsive width
//             }} 
//           />
//         </Box>
//       </Grid>

//       {/* Text Section */}
//       <Grid item xs={12} md={6} sx={{justifyContent:'center',alignItems:'center',marginTop:'4rem'}}>
//         <Box sx={{ textAlign: { xs: 'center', md: 'left' }, justifyContent:'center', alignItems:'center' }}>
//           <Typography 
//             variant="h5" 
//             sx={{
//               fontWeight: 'bold',
//               color: "white",
//               fontSize: { xs: '1.5rem', md: '2rem' } // Responsive font size
//             }} 
//             className="Nasaliza"
//           >
//             Welcome to Insurer Admin, the Future of Insurance
//           </Typography>

//           <Typography 
//             sx={{ 
//               marginTop: '20px', 
//               color: '#B3C1FF',
//               fontSize: { xs: '1rem', md: '1.2rem' } // Responsive text size
//             }}
//           >
//             Experience a new era of insurance management with our innovative platform
//           </Typography>
//         </Box>
//       </Grid>
//     </Grid>
//   </Box>

//   {/* Cards Section */}
//   <Box sx={{ padding: { xs: '20px', md: '40px' }, maxWidth: '1200px', margin: '0 auto' }}>
//     <Grid container spacing={4}>
//       {/* Card 1: Add Company */}
//       <Grid item xs={12} md={4}>
//         <Box sx={{
//           backgroundColor: '#001660', 
//           borderRadius: '10px', 
//           padding: '2rem', 
//           textAlign: 'center',
//           height: '300px', // Fixed height for consistency
//           boxShadow: '0 4px 30px rgba(0,0,0,0.2)', 
//           transition: 'transform 0.3s ease', 
//           '&:hover': { transform: 'scale(1.05)' }
//         }}>
//           <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', marginBottom: '1rem' }}>
//             <i className="fas fa-plus-circle" style={{ fontSize: '2rem', color: '#B3C1FF' }}></i> {/* Futuristic Icon */}
//             Add New Tie-Up Company
//           </Typography>
//           <Typography sx={{ color: '#B3C1FF' }}>
//             Quickly and efficiently add new companies to your portfolio. Our streamlined interface makes onboarding simple
//             and secure, with intuitive data entry and verification features.
//           </Typography>
//         </Box>
//       </Grid>

//       {/* Card 2: Search Company */}
//       <Grid item xs={12} md={4}>
//         <Box sx={{
//           backgroundColor: '#001660', 
//           borderRadius: '10px', 
//           padding: '2rem', 
//           textAlign: 'center',
//           height: '300px', // Fixed height for consistency
//           boxShadow: '0 4px 30px rgba(0,0,0,0.2)', 
//           transition: 'transform 0.3s ease', 
//           '&:hover': { transform: 'scale(1.05)' }
//         }}>
//           <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', marginBottom: '1rem' }}>
//             <i className="fas fa-search" style={{ fontSize: '2rem', color: '#B3C1FF' }}></i> {/* Futuristic Icon */}
//             Search Existing Companies
//           </Typography>
//           <Typography sx={{ color: '#B3C1FF' }}>
//             Find companies in your network easily. Use our advanced search capabilities to locate tie-up companies by
//             name, location, or status.
//           </Typography>
//         </Box>
//       </Grid>

//       {/* Card 3: Edit Company */}
//       <Grid item xs={12} md={4}>
//         <Box sx={{
//           backgroundColor: '#001660', 
//           borderRadius: '10px', 
//           padding: '2rem', 
//           textAlign: 'center',
//           height: '300px', // Fixed height for consistency
//           boxShadow: '0 4px 30px rgba(0,0,0,0.2)', 
//           transition: 'transform 0.3s ease', 
//           '&:hover': { transform: 'scale(1.05)' }
//         }}>
//           <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', marginBottom: '1rem' }}>
//             <i className="fas fa-edit" style={{ fontSize: '2rem', color: '#B3C1FF' }}></i> {/* Futuristic Icon */}
//             Edit Company Details
//           </Typography>
//           <Typography sx={{ color: '#B3C1FF' }}>
//             Update or modify existing company information with ease. Our user-friendly interface allows you to edit company
//             profiles, contact information, and more efficiently.
//           </Typography>
//         </Box>
//       </Grid>
//     </Grid>
//   </Box>
// </Box>

    
//       <Footer />

//     </>

//   );
// }
