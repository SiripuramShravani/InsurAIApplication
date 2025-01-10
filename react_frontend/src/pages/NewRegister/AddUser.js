import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
    Box, Typography, Grid, Paper, TextField, Select, FormControl, InputLabel, MenuItem, useMediaQuery, useTheme, Container, FormHelperText
} from '@mui/material';
import StyledButtonComponent from "../../components/StyledButton";


export default function AddUser({ onSuccess, onCanceled }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [roles, setRoles] = useState([])
    const [backendErrors, setBackendErrors] = useState('')
    const [companies, setCompanies] = useState([])
    const CompaniesArray = ['Adjuster', 'Underwriter', 'Reports Analyst', 'Claim Manager']
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_URL,
        withCredentials: true
      });
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        mobile_number: '',
        email_id: '',
        role: '',
        company_name: ''
    });
    useEffect(() => {
        // Fetch roles data from API
        axiosInstance.post('Administration/get_all_roles/')
            .then(response => {

                console.log(response);
                setRoles(response.data)
            })
            .catch(error => {
                console.error('Error fetching roles:', error);

            });
    }, []);


    const roleList = roles.map(item => item.role);

    useEffect(() => {
        // Fetch roles data from API
        axiosInstance.get('get-company-names/')
            .then(response => {

                console.log(response.data.company_names);
                setCompanies(response.data.company_names)
            })
            .catch(error => {
                console.error('Error fetching roles:', error);

            });
    }, []);

    const handleInputChange = (e) => {

        const { name, value } = e.target;
        console.log(name, value);
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        let tempErrors = {};
        console.log(formData.company_name);

        const namePattern = /^[A-Za-z]+$/;

        if (!formData.first_name) {
            tempErrors.first_name = "First Name is required.";
        } else if (!namePattern.test(formData.first_name)) {
            tempErrors.first_name = "First Name can only contain alphabetic characters.";
        } else if (formData.first_name.length > 20) {
            tempErrors.first_name = "First Name cannot exceed 20 characters.";
        }

        if (!formData.last_name) {
            tempErrors.last_name = "Last Name is required.";
        } else if (!namePattern.test(formData.last_name)) {
            tempErrors.last_name = "Last Name can only contain alphabetic characters.";
        } else if (formData.last_name.length > 20) {
            tempErrors.last_name = "Last Name cannot exceed 20 characters.";
        }

        if (!formData.email_id) {
            tempErrors.email_id = "Email ID is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email_id)) {
            tempErrors.email_id = "Email ID is invalid.";
        }

        if (!formData.mobile_number) {
            tempErrors.mobile_number = "Phone Number is required.";
        } else if (!/^\d{10}$/.test(formData.mobile_number)) {
            tempErrors.mobile_number = "Phone Number is invalid. It should be 10 digits.";
        }

        if (!formData.role || !roleList.includes(formData.role)) {
            tempErrors.role = "Role is required and must be a valid option.";
        }

        if (CompaniesArray.includes(formData.role) && (!formData.company_name || !companies.includes(formData.company_name))) {
            if(CompaniesArray.includes(formData.role) ){
          tempErrors.company_name = "Company Name is required and must be a valid option.";
                
            }
            
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        console.log('getting');

        if (validate()) {
            console.log('validate');
            setIsSubmitting(true);
            try {
                const response = await axiosInstance.post('Administration/add_new_user/', { ...formData }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log(response);

                if (response.status === 201) { // Status 201 indicates a successful creation
                    onSuccess(); // Handle success (e.g., show a success message, redirect, etc.)
                } else {
                    
                    console.error("Unexpected response:", response);
                    setBackendErrors('Unexpected error occurred. Please try again later.');
                }
            } catch (error) {
                if (error.response) {
                   console.error("Error response:", error.response);
                    if (error.response.status === 400) {
                        // Handle client errors (e.g., validation issues)
                        setBackendErrors(error.response.data.error || 'Invalid input. Please check your data and try again.');
                    } else if (error.response.status === 500) {
                        // Handle server errors
                        setBackendErrors('Internal server error. Please try again later.');
                    } else {
                        // Handle other errors
                        setBackendErrors('An error occurred. Please try again.');
                    }
                } else if (error.request) {
                    // The request was made, but no response was received
                    console.error("No response received:", error.request);
                    setBackendErrors('No response from the server. Please check your connection and try again.');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error("Error setting up request:", error.message);
                    setBackendErrors('An error occurred while setting up the request. Please try again.');
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };



    const handleCancel = (e) => {
        e.preventDefault();
        onCanceled();
    };

    const CustomStylesForTextFileds = {
        '&:before': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
        },
        '&:hover:not(.Mui-disabled):before': {
            borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
        },
        '&.Mui-focused:after': {
            borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
        },
        '& .MuiInputBase-input': {
            fontSize: isMobile ? '12px' : '13px',
        },
    };

    return (
        <Box sx={{ borderTop: 'none', width: '100%', maxWidth: 1200, margin: 'auto' }}>
            <Container maxWidth="lg">
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: isMobile ? 'center' : 'space-between',
                }}>
                    <Grid sx={{
                        width: '100%',
                        padding: isMobile ? '1rem' : '3rem',
                        boxSizing: 'border-box'
                    }}>
                        <Paper sx={{ padding: '2rem', margin: 'auto' }}>
                            <Grid container spacing={3} alignItems="center">
                                <Typography sx={{ color: 'red', textAlign: 'center', margin: "auto" }}>{backendErrors}</Typography>
                                <Grid item xs={12}>
                                    <Typography
                                        className="Nasaliza"
                                        variant={isMobile ? "h6" : "h5"}
                                        sx={{
                                            fontWeight: 600,
                                            mb: 2,
                                            color: '#010066',
                                            textAlign: 'left',
                                        }}
                                    >
                                        Add User
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="First Name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        sx={CustomStylesForTextFileds}
                                        required
                                        fullWidth
                                        variant="standard"
                                        error={!!errors.first_name}
                                        helperText={errors.first_name}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Last Name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        sx={CustomStylesForTextFileds}
                                        required
                                        fullWidth
                                        variant="standard"
                                        error={!!errors.last_name}
                                        helperText={errors.last_name}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Email Id"
                                        name="email_id"
                                        value={formData.email_id}
                                        onChange={handleInputChange}
                                        sx={CustomStylesForTextFileds}
                                        required
                                        fullWidth
                                        variant="standard"
                                        error={!!errors.email_id}
                                        helperText={errors.email_id}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Phone num"
                                        name="mobile_number"
                                        value={formData.mobile_number}
                                        onChange={handleInputChange}
                                        sx={CustomStylesForTextFileds}
                                        required
                                        fullWidth
                                        variant="standard"
                                        error={!!errors.mobile_number}
                                        helperText={errors.mobile_number}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>

                                    <FormControl fullWidth error={!!errors.role}>
                                        <InputLabel>Role *</InputLabel>
                                        <Select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            label="Role"
                                            variant="standard"
                                            sx={{
                                                '&:before': {
                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                                                },
                                                '&:hover:not(.Mui-disabled):before': {
                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
                                                },
                                                '&.Mui-focused:after': {
                                                    borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
                                                },
                                                '& .MuiSelect-select': { // Target the displayed value element
                                                    textAlign: 'left',
                                                    padding: '0rem 0rem 0.3rem 0rem',
                                                    //   fontSize: fontSize || '13px', // Apply fontSize here
                                                },
                                            }}
                                        >
                                            {roleList.map((roleitem) => (
                                                <MenuItem key={roleitem} value={roleitem}>
                                                    {roleitem}
                                                </MenuItem>
                                            ))}

                                        </Select>
                                        {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
                                    </FormControl>
                                </Grid>

                                {CompaniesArray.includes(formData.role) &&
                                
                                 <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!errors.role}>
                                        <InputLabel>Company Name *</InputLabel>
                                        <Select
                                            name="company_name"
                                            value={formData.company_name}
                                            onChange={handleInputChange}
                                            label="Company Name"
                                            variant="standard"
                                            sx={{
                                                '&:before': {
                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                                                },
                                                '&:hover:not(.Mui-disabled):before': {
                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
                                                },
                                                '&.Mui-focused:after': {
                                                    borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
                                                },
                                                '& .MuiSelect-select': { // Target the displayed value element
                                                    textAlign: 'left',
                                                    padding: '0rem 0rem 0.3rem 0rem',
                                                    //   fontSize: fontSize || '13px', // Apply fontSize here
                                                },
                                            }}
                                        >
                                            {companies.map((roleitem) => (
                                                <MenuItem key={roleitem} value={roleitem}>
                                                    {roleitem}
                                                </MenuItem>
                                            ))}
 
                                        </Select>
                                        {errors.company_name && <FormHelperText sx={{color:'red'}}>{errors.company_name}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                }
                            </Grid>

                            <Box sx={{ mt: 3 }}>
                                <StyledButtonComponent
                                    buttonWidth={100}
                                    variant="outlined"
                                    sx={{ mr: 2 }}
                                    onClick={handleSave}
                                    disabled={isSubmitting}
                                >
                                    Save
                                </StyledButtonComponent>

                                <StyledButtonComponent onClick={handleCancel} buttonWidth={100} variant="outlined">
                                    Cancel
                                </StyledButtonComponent>
                            </Box>
                        </Paper>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}