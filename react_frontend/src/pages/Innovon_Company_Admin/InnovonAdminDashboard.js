import axios from 'axios'
import React, { useState, useEffect,useCallback  } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
    Box, Stepper, 
    StepLabel, ThemeProvider,
    Paper, TextField, Typography, Grid,
} from '@mui/material';
import StyledButtonComponent from '../../components/StyledButton';
import Header from '../../components/header';
import Footer from '../../components/footer';
import CssBaseline from '@mui/material/CssBaseline';
import { InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddCompany from './AddCompany';
import InnovonAdminLandingPage from './InnovonAdminLandingPage'
import CompanyProfileByEachCompany from './CompanyProfileByEachCompany';

import PopupMessage from "../DemoPages/AccessDeniedPopMssg";

const InnovonAdminDashboard = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [selectedCompanyName, setSelectedCompanyName] = useState('');
    const [selectedCompanytoPass, setSelectedCompanytoPass] = useState(null); // New state for selected company
    const [sidebarItems, setSidebarItems] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [showAddCompany, setShowAddCompany] = useState(false);
    const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_URL,
        withCredentials: true
      });
  
  const [openPopup, setOpenPopup] = useState(false);
  
  useEffect(() => {
    const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
    const userAccess = Authorization ? JSON.parse(localStorage.getItem('userAccess')) : [];
    const userCompany =JSON.parse(localStorage.getItem('signinUserDetails'))
    console.log('Authorization:', Authorization);
    
    if (
        !Authorization &&
        !userAccess.includes('user_administration') && 
        !userAccess.includes('companies_administration')
      ) {
        // Log userAccess and company_name if it exists
        console.log('userAccess:', userAccess, userCompany?.company_name, Authorization, userAccess.includes('user_administration'),  userAccess.includes('companies_administration'));
        setOpenPopup(true);
      } else if ( !Authorization && ! userCompany.company_name) {
        // Log userAccess when company_name exists
        console.log('userAccess:', userAccess, userCompany.company_name);
        setOpenPopup(true);  
      }
    }, []);
  
    // Fetch company names from the API when the component mounts
    // useEffect(() => {
        const fetchCompanyNames = useCallback(async () => {  // Use useCallback
            try {
                const response = await axiosInstance.get('get-company-names/');
                const data = response.data;

                if (data && Array.isArray(data.company_names)) {
                    // Map company names to the desired format for sidebarItems
                    const formattedItems = data.company_names.map(companyName => ({ label: companyName }));
                    setSidebarItems(formattedItems);
                } else {
                    console.error("API response does not have the expected format:", data);
                }
            } catch (error) {
                console.error("Error fetching company names:", error);
            }
        }, []); // Empty dependency array is fine here


        useEffect(() => {
            fetchCompanyNames();
        }, [fetchCompanyNames]); // Add fetchCompanyNames as a dependency

    const filteredItems = sidebarItems.filter((item) =>
        item.label.toLowerCase().includes(selectedCompanyName.toLowerCase())
    );
    const handleAddCompanyClick = () => {
        setShowAddCompany(true);
        setSelectedCompanytoPass(null); // Reset selectedCompanytoPass
    };

    // const handleCloseAddCompany = () => {
    //     setShowAddCompany(false);
    // };
    const handleCloseAddCompany = () => {
        setShowAddCompany(false);
        fetchCompanyNames(); // Refresh list after closing AddCompany
    };
    const searchFieldId = `search-field-${Math.random().toString(36).substring(2, 15)}`;

    const handleCompanyClick = (companyName, index) => { // Add index parameter
        // setSelectedCompanytoPass(companyName);          
        setShowAddCompany(false);
        setActiveStep(index); // Update activeStep with the clicked company's index
        getIC_ID_IC_name_by_companyName(companyName);
      };

      const handleCloseCompanyProfile =  () => {
        setSelectedCompanytoPass(null); // Reset selectedCompanytoPass to initial state
      };

      const getIC_ID_IC_name_by_companyName = async (companyName)=>{
        try {
        const response = await axiosInstance.get(`get-company-by-id/?ic_name=${companyName}`);
        console.log("response", response, response.data);
        const data = response.data.company;
        localStorage.removeItem('ic_id_for_dashboard');
        localStorage.removeItem('ic_name_for_dashboard');
        localStorage.setItem("ic_id_for_dashboard", data.ic_id);
        localStorage.setItem("ic_name_for_dashboard", data.ic_name);
        navigate('/dashboard/dashboard'); 
    
    } catch (error) {
        console.error('Error fetching company details:', error);
       }
    };

   
  

    return (
        <>
        {Authorization && 
        
        <>
        
        <Header />
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Grid container spacing={0}>
                <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>
                    <Paper elevation={2} sx={{ padding: 2, height: "auto", backgroundColor: '#36454F' }}>
                        <StyledButtonComponent onClick={handleAddCompanyClick}>
                            + Add Company
                        </StyledButtonComponent>
                        <TextField
                            id={searchFieldId} // Use the generated ID
                            label="Search Company"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                style: { color: 'white' },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon style={{ color: 'white' }} />
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{
                                style: { color: 'white' },
                            }}
                            value={selectedCompanyName}
                            onChange={(e) => setSelectedCompanyName(e.target.value)}
                            sx={{
                                marginTop: '10px',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'white' },
                                    '&:hover fieldset': { borderColor: 'white' },
                                    '&.Mui-focused fieldset': { borderColor: 'white' },
                                },
                                '& .MuiInputAdornment-root': { color: 'white' },
                            }}
                            autoComplete={`new-${searchFieldId}`} // Unique autocomplete value
                        />
                        <Stepper activeStep={activeStep} orientation="vertical" className="Nasaliza">
                            <Box
                                sx={{
                                    height: '515px',
                                    overflowY: 'auto',
                                    scrollbarWidth: 'thin',
                                    '&::-webkit-scrollbar': { width: '6px' },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: '#ccc',
                                        borderRadius: '10px',
                                    },
                                    '&::-webkit-scrollbar-track': { backgroundColor: '#f0f0f0' },
                                }}
                            >
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item, index) => (
                                        <StepLabel key={index} onClick={() => handleCompanyClick(item.label, index)}>
                                            <Typography
                                                className="Nasaliza"
                                                sx={{
                                                    textAlign: 'left',
                                                    
                                                    padding: '8px',
                                                    transition: 'background-color 0.3s ease',
                                                    color: 'white',
                                                    fontSize:"1rem",
                                                  
                                                    '&:hover': {
                                                        backgroundColor: '#B2BEB5',
                                                        cursor: 'pointer',
                                                    },
                                                    ...(activeStep === index && {
                                                        backgroundColor: '#0B70FF',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        boxShadow: 5,
                                                    }),
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                        </StepLabel>
                                    ))
                                ) : (
                                    <Typography sx={{ textAlign: 'center', padding: '16px' }}>
                                        No results found
                                    </Typography>
                                )}
                            </Box>
                        </Stepper>
                    </Paper>
                </Grid>
                 {
                    showAddCompany ? (
                        <>
                            <Grid item xs={12} md={0.3}></Grid>
                            <Grid item xs={12} md={8.4} style={{ marginTop: "2rem", maxHeight: '650px', overflowY: 'auto' }}>
                                <AddCompany onClose={handleCloseAddCompany} />
                            </Grid>
                            <Grid item xs={12} md={0.3}></Grid>
                        </>
                    ) : selectedCompanytoPass ? (
                        <>
                            <Grid item xs={12} md={0.3}></Grid>
                            <Grid item xs={12} md={8.4} style={{ marginTop: "2rem", maxHeight: '650px', overflowY: 'auto' }}>
                                <CompanyProfileByEachCompany 
                                companyName={selectedCompanytoPass}
                                 onCloseCompanyProfile={handleCloseCompanyProfile} 
                                />
                            </Grid>
                            <Grid item xs={12} md={0.3}></Grid>
                        </>
                    ) : (
                        <Grid item xs={12} md={9} style={{ maxHeight: '700px', overflowY: 'auto' }}>
                            <InnovonAdminLandingPage />
                        </Grid>
                    )
                }
             </Grid>
        </ThemeProvider>
        
        <PopupMessage open={openPopup} onClose={() => setOpenPopup(false)} />
        <Footer />
        </>
        }
        </>
    );
};

export default InnovonAdminDashboard;

