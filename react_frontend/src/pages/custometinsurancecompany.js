
import axios from 'axios'
import React, { useState, useEffect } from 'react';
import {  useTheme } from '@mui/material/styles';
import {
  Box, useMediaQuery, Stepper,

  StepLabel, ThemeProvider,
  Paper,
} from '@mui/material';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import InsuranceCompanyNewFormFill from "../components/insuranceCompanyNewFormFill";
import ListOfComapnies from "../assets/listofcompanies.png";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { InputAdornment, ListItemAvatar, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PopupMessage from '../../src/pages/DemoPages/AccessDeniedPopMssg';

import Header from '../components/header';
import Footer from '../components/footer';
import StyledButtonComponent from '../components/StyledButton';



const initialValues = {
  ic_name: "",
  ic_address1: "",
  ic_address2: "",
  ic_street: "",
  ic_city: "",
  ic_zip: "",
  ic_state: "",
  ic_country: "",
  ic_mobile: null,
  ic_email: "",
  ic_primary_color: "",
  ic_secondary_color: "",
  ic_website_url: "",
}

export default function Customerpage1() {

  const theme = useTheme();
  
  const navigate = useNavigate();
  const [selectedCompanyName, setSelectedCompanyName] = useState('');
  const [newCompanyFormvisible, setNewCompanyFormvisible] = React.useState(false);
  const [companyFormValues, setComapnyFormValues] = React.useState(initialValues);
  const [isCompanyUpdate, setIsCompanyUpdate] = React.useState(false);
  const [selectedCompanyId, ] = useState(null);
  const sidebarItems = [
    { label: "company 1" },
    { label: "company 2" },
    { label: "company 3" },
    { label: "company 4" },
    { label: "company 5" },
    { label: "company 1" },
    { label: "company 2" },
    { label: "company 3" },
    { label: "company 4" },
    { label: "company 5" },
  ];
  const filteredItems = sidebarItems.filter((item) =>
    item.label.toLowerCase().includes(selectedCompanyName.toLowerCase())
  );

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });
  
  

  const [, setNewCompanyFormVisible] = useState(false);
  const [companyForm, setCompanyForm] = useState(initialValues);
  // const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [listOfCompanyNames, setListOfCompanyNames] = useState([]);

  const fetchCompanyNames = async () => {
    try {
      const response = await axiosInstance.get('get-company-names/');
      setListOfCompanyNames(response.data.company_names);
      console.log(response);
      setDropdownOpen(!dropdownOpen)
      console.log(listOfCompanyNames, "arr");
    } catch (error) {
      console.error("Error fetching company names:", error);
    }
  };

  const handleCompanySelection = (event, value) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
    setNewCompanyFormvisible(false);
    if (value) {
      axiosInstance.get('get-company-by-name/', { params: { company_name: value } })
        .then(res => {
          console.log(res);
          setCompanyForm(res.data.company);
          console.log(companyForm, "comappppp")
          setIsCompanyUpdate(true);
          setSelectedCompanyName(value);
          setNewCompanyFormVisible(false);
        })
        .catch(err => {
          console.error("Error fetching company details:", err);
        });
    }
  };

  const handleCompanyFormSubmit = async (e, initialFormValues, selectedFile) => {
    e.preventDefault();
    console.log(initialFormValues, selectedFile);
    const formData = new FormData();
    formData.append('ic_name', initialFormValues.ic_name);
    formData.append('ic_address1', initialFormValues.ic_address1);
    formData.append('ic_address2', initialFormValues.ic_address2);
    formData.append('ic_street', initialFormValues.ic_street);
    formData.append('ic_city', initialFormValues.ic_city);
    formData.append('ic_zip', initialFormValues.ic_zip);
    formData.append('ic_state', initialFormValues.ic_state);
    formData.append('ic_country', initialFormValues.ic_country);
    formData.append('ic_email', initialFormValues.ic_email);
    formData.append('ic_mobile', initialFormValues.ic_mobile);
    formData.append('ic_primary_color', initialFormValues.ic_primary_color);
    formData.append('ic_secondary_color', initialFormValues.ic_secondary_color);
    formData.append('ic_website_url', initialFormValues.ic_website_url);
    formData.append('claim_storage_type', initialFormValues.claim_storage_type);

    for (let i = 0; i < selectedFile.length; i++) {
      formData.append('documents', selectedFile[i]);
    }

    await axiosInstance.post('add-company/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      console.log(response);
      localStorage.setItem("IC_ID", JSON.stringify(response.data.ic_id));
      navigate('/companysuccess')
      setComapnyFormValues(initialValues)
    }).catch(error => {
      console.log(error);
    })
  }

  const handleOnUpdateCompany = async (e, initialFormValues, selectedCompanyId, selectedFile) => {
    e.preventDefault();
    console.log(initialFormValues, selectedCompanyId, selectedFile);
    const formData = new FormData();
    formData.append('ic_name', initialFormValues.ic_name);
    formData.append('ic_address1', initialFormValues.ic_address1);
    formData.append('ic_address2', initialFormValues.ic_address2);
    formData.append('ic_street', initialFormValues.ic_street);
    formData.append('ic_city', initialFormValues.ic_city);
    formData.append('ic_zip', initialFormValues.ic_zip);
    formData.append('ic_state', initialFormValues.ic_state);
    formData.append('ic_country', initialFormValues.ic_country);
    formData.append('ic_email', initialFormValues.ic_email);
    formData.append('ic_mobile', initialFormValues.ic_mobile);
    formData.append('ic_primary_color', initialFormValues.ic_primary_color);
    formData.append('ic_secondary_color', initialFormValues.ic_secondary_color);
    formData.append('ic_website_url', initialFormValues.ic_website_url);
    formData.append('claim_storage_type', initialFormValues.claim_storage_type);
    formData.append('ic_id', selectedCompanyId);

    for (let i = 0; i < selectedFile.length; i++) {
      formData.append('new_logo', selectedFile[i]);
    }

    try {
      const response = await axiosInstance.put('update-company/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response);
      toast.success(response.data.message);
      setDropdownOpen(!dropdownOpen)
      setIsCompanyUpdate(false);
      setComapnyFormValues(initialValues);
    } catch (error) {
      console.log(error);
      toast.error('Failed to update company');
    }
  }

  const handlevisibleNewCompanyForm = () => {
    setNewCompanyFormvisible(true);
  }

  const handleCancelNewCompanyForm = () => {
    setComapnyFormValues(initialValues);
    setNewCompanyFormvisible(false);
  }

  const handleCancelUpdateCompanyForm = () => {
    setComapnyFormValues(initialValues);
    setIsCompanyUpdate(false);
  }


  // const [options, setOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  

  // const companyNames = getAllCompanyData?.allcomapnies.map((company) => company.ic_name) || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [, setCurrentPage] = useState(1);

   const [activeStep, setActiveStep] = useState(0);

 const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
 

  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
    const userAccess = Authorization ? JSON.parse(localStorage.getItem('userAccess')) : [];

    if (!userAccess.includes('policy_intake') || !Authorization) {
      setOpenPopup(true);
    }
  }, []);



  return (
    <>
      <Header />
      {Authorization &&
        <>
          <ThemeProvider theme={theme}>

            <CssBaseline />
            <Grid container spacing={2} >

              <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', marginTop: '1rem' }}>

                <Paper elevation={2} sx={{ padding: 2, height: "auto", backgroundColor: '#36454F' }}>
                  <StyledButtonComponent onClick={handlevisibleNewCompanyForm}>+ Add Company</StyledButtonComponent>
                  <TextField
                    label="Search Company"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      style: { color: 'white' }, // Make input text white
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon style={{ color: 'white' }} /> {/* Make the search icon white */}
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      style: { color: 'white' }, // Make the label white
                    }}
                    value={selectedCompanyName}
                    onChange={(e) => setSelectedCompanyName(e.target.value)}
                    sx={{
                      marginTop: '10px',
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'white', // White border
                        },
                        '&:hover fieldset': {
                          borderColor: 'white', // White border on hover
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white', // White border when focused
                        },
                      },
                      '& .MuiInputAdornment-root': {
                        color: 'white', // White color for adornment
                      },
                    }}
                  />

                  <Stepper activeStep={activeStep} orientation="vertical" className="Nasaliza">
                    <Box
                      sx={{
                        maxHeight: '500px', // Limit the height to show only a few items (adjust as needed)
                        overflowY: 'auto', // Enable vertical scroll
                        scrollbarWidth: 'thin', // For Firefox
                        '&::-webkit-scrollbar': {
                          width: '6px', // Width of the scrollbar for Webkit browsers (Chrome, Safari)
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: '#ccc', // Scrollbar color
                          borderRadius: '10px', // Rounded scrollbar
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: '#f0f0f0', // Track color
                        },
                      }}
                    >
                      {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                          <StepLabel key={index} onClick={() => setActiveStep(index)}>
                            <Typography
                              className="Nasaliza"
                              sx={{
                                textAlign: 'center',
                                padding: '8px',
                                transition: 'background-color 0.3s ease',
                                color: 'white',
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

              {/* Main Content */}
              <Grid item xs={12} md={9}>
                <Box
                  sx={{
                    ml: { xs: 0, md: 3 },
                    height: "auto",
                    overflow: "auto",
                    mt: isSmallScreen ? 25 : 0,
                  }}
                >


                  {activeStep === 0 && (



                    <>


                      <Box sx={{ padding: isMobile ? 2 : 4, backgroundColor: '#2C2C2C', borderRadius: '8px', maxWidth: 600, margin: 'auto' }}>
                        <div button onClick={fetchCompanyNames} className='dropdownOpen'>
                          <ListItemIcon>
                            <img src={ListOfComapnies} alt="List of Companies" style={{ height: 50, backgroundColor: 'white' }} />
                          </ListItemIcon>
                          <ListItemText primary="List of Companies" style={{ marginTop: '10px' }} />
                        </div>
                        {dropdownOpen && (
                          <Box sx={{
                            display: "flex",
                            backgroundColor: "#3C3C3C",
                            borderRadius: "4px",
                            padding: 1,
                          }}>
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={listOfCompanyNames}
                              sx={{ width: 300, height: 50 }}
                              onChange={handleCompanySelection}
                              renderInput={(params) => <TextField {...params} label="List of Companies" />}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <IconButton>
                                      <SearchIcon style={{ color: 'white' }} />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              value={searchTerm}
                            />
                          </Box>
                        )}
                        {listOfCompanyNames.length > 0 && (
                          <Box
                            sx={{
                              backgroundColor: "#1E1E1E",
                              borderRadius: "8px",
                              padding: 2,
                            }}
                          >
                            <Typography variant="h6" sx={{ color: "white", marginBottom: 1 }}>
                              Search results ({listOfCompanyNames.length})
                            </Typography>
                            <List>
                              {listOfCompanyNames.map((result, index) => (
                                <ListItem
                                  key={index}
                                  sx={{
                                    padding: 1,
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box sx={{ display: "flex", alignItems: "center" }}>
                                    {/* Assuming you don't have images for each company */}
                                    <ListItemAvatar>
                                      <Avatar>{result.charAt(0)}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={
                                        <Typography sx={{ color: "white" }}>
                                          {result}
                                        </Typography>
                                      }
                                    />
                                  </Box>
                                  {/* Assuming you don't have usernames and locations for each company */}
                                  <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <LocationOnIcon sx={{ color: "#AAAAAA", marginRight: 0.5 }} />
                                    <Typography variant="body2" sx={{ color: "#AAAAAA" }}>
                                      {result.location} {/* Assuming you have a location field in each company */}
                                    </Typography>
                                  </Box>
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}

                      </Box>





                      <Grid >
                        {newCompanyFormvisible === true ?
                          <InsuranceCompanyNewFormFill iscompanyUpdate={isCompanyUpdate} onCancel={handleCancelNewCompanyForm} initialValues={companyFormValues} onSubmit={handleCompanyFormSubmit} />
                          :
                          <>
                            {isCompanyUpdate === false && newCompanyFormvisible === false ?
                              <Box sx={{}}>
                                <div className='AddCompany'>
                                  <Typography>Please Enter the Details of Insurance Company <button onClick={handlevisibleNewCompanyForm}>+ Add Company</button></Typography>
                                  <Typography>----------------(or)----------------</Typography>
                                  <Typography style={{ marginTop: "1%" }}>Edit your company details in left list of companies </Typography>
                                </div>
                              </Box>
                              :
                              <InsuranceCompanyNewFormFill iscompanyUpdate={isCompanyUpdate} onCancel={handleCancelUpdateCompanyForm} initialValues={companyForm} onSubmit={handleOnUpdateCompany} companyId={selectedCompanyId} updateFormValues={companyForm}
                              // handleGetCompanyDetails={handleGetCompanyDetails} 
                              />
                            }
                          </>
                        }
                      </Grid>
                    </>

                  )}

                </Box>
              </Grid>
            </Grid>
          </ThemeProvider>


        </>
      }
      <PopupMessage open={openPopup} onClose={() => setOpenPopup(false)} />
      <Footer />

    </>

  );



}