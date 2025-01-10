import React, { useState, useRef } from 'react';

import { Typography, Link, Checkbox, FormControlLabel, Grid, Card, CardContent, TextField, Box, CircularProgress, InputAdornment, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import Header from '../components/header';
import Footer from '../components/footer';
import { FlagIcon } from 'react-flag-kit';
import { Business, FileCopy, Email, SmartToy } from '@mui/icons-material';
import StyledButtonComponent from '../components/StyledButton';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import {  useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: 'rgba(1, 0, 102, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(11, 112, 255, 0.18)',
    borderRadius: '15px',
    height: '100%',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale3d(1.05, 1.05, 1)',
        boxShadow: '0 8px 32px 0 rgba(11, 112, 255, 0.37)'
    },
}));



const services = [
    {
        title: 'Portals',
        description: 'Discover Our Advanced Digital Solutions with World-Class User Interface.',
        icon: <Business sx={{ fontSize: 48, color: "#0B70FF" }} />, 
    },
    {
        title: 'DocAI',
        description: 'End-to-end automation of FNOL,Policy Intake and much more',
        icon: <FileCopy sx={{ fontSize: 48, color: "#0B70FF" }} />, // Mail icon for Email to FNOL
    },
    {
        title: 'Mail Sync',
        description: 'Automate Claims and Submissions Directly Through Emails with Ease',
        icon: <Email sx={{ fontSize: 48, color: "#0B70FF" }} />, // SmartToy icon for InsurAI
    },
    {
        title: 'Ivan',
        description: 'Your Dedicated AI Virtual Assistant for All P&C Insurance Queries and Tasks',
        icon: <SmartToy sx={{ fontSize: 48, color: "#0B70FF" }} />, // Assistant icon for InsurAI Assistant
    },
];





const DemoPage = () => {
 
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', companyName: '', companyEmail: '', mobileNumber: '', jobtitle: '', reason: '',
    });
    const [otp, setOtp] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [, setSuccessMessage] = useState('');
    const [, setMssg] = useState('')
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef(null);
    const [checked, setChecked] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const [isVerified, ] = useState(false);
    const navigate = useNavigate('')
    const handleCheckboxChange = (event) => {
        setErrorMessage('')
        setChecked(event.target.checked);
    };

    const countryCodes = [
        { code: '+1', country: 'USA', flag: "US" },
        { code: '+44', country: 'UK', flag: "GB" }, // 'GB' is the ISO code for the United Kingdom
        { code: '+91', country: 'India', flag: "IN" },
        { code: '+86', country: 'China', flag: "CN" },
        { code: '+81', country: 'Japan', flag: "JP" },
        { code: '+49', country: 'Germany', flag: "DE" },
        { code: '+33', country: 'France', flag: "FR" },
        { code: '+61', country: 'Australia', flag: "AU" },
        { code: '+7', country: 'Russia', flag: "RU" },
        { code: '+55', country: 'Brazil', flag: "BR" },
    ];
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        const error = validateField(name, value);
        setFormErrors({ ...formErrors, [name]: error });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = Object.keys(formData).reduce((acc, key) => {
            const error = validateField(key, formData[key]);
            if (error) acc[key] = error;
            return acc;
        }, {});

        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            setIsLoading(true);
            
        }

    };
    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'mobileNumber':
                if (!/^\d{10}$/.test(value)) {
                    error = "Mobile number must be 10 digits";
                }
                break;
            case 'companyEmail':
                const emailRegex = /^[a-zA-Z0-9._%+-]+@(?!gmail\.com)(?!yahoo\.com)(?!hotmail\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(value)) {
                    error = "Please enter a valid company email (gmail, yahoo, and hotmail are not allowed)";
                }
                break;
            case 'reason':
                const wordCount = value.length;
                if (wordCount < 10 || wordCount > 250) {
                    error = "Reason length must be 10-250 characters.";
                }
                break;
            default:
                break;
        }
        return error;
    };
    // eslint-disable-next-line 
    const [load, setLoad] = useState(false)

   





    const sendInitialRequest = async () => {
        setOpenDialog(true);

        console.log("formData", formData);
        try {


            const response = await fetch(`${process.env.REACT_APP_URL}send_verification_for_demo/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ companyEmail: formData.companyEmail }),
            });
            const data = await response.json();

            if (response.ok || data.message) {
                setOpenDialog(false);
                setOtpSent(true);
            } else {
                setErrorMessage("email verification failed")
                console.error('email verification failed');
                setOpenDialog(false);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);

        }
    };

    const sendOtpVerification = async (e) => {
        // setIsLoading(true);
        await handleSubmit(e)
        // setOpenDialog(false);
        try {
            if (checked && formData.reason) {
                const response = await fetch(`${process.env.REACT_APP_URL}verify_otp_and_add_demo/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...formData, otp }),
                });
                console.log("response", response);
                const data = await response.json();
                console.log("data", data);
                setErrorMessage(data.error)
                if (response.ok || data.message) {
                    setSuccessMessage('');
                    navigate('/SucessMessage')

                    setFormData({
                        firstName: '', lastName: '', companyName: '', companyEmail: '', mobileNumber: '', jobtitle: '', reason: ''
                    });
                    setIsLoading(false);
                    setErrorMessage('')
                    setOtp('');
                    // Clear the message after 15 seconds
                    const timer = setTimeout(() => {
                        setMssg('');
                    }, 15000);

                    // Cleanup function in case component unmounts before 15 seconds
                    return () => clearTimeout(timer);
                } else {
                    setErrorMessage(data.error)
                    setIsLoading(false)
                    console.error('OTP verification failed');
                }
            } else {
                setErrorMessage('All fields are mandatory');
            }

        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false)
        } finally {
            setIsLoading(false);
            setLoad(false);
        }
    };


    return (
        <>
            <Header />
            <Box sx={{ backgroundColor: "#00152d", }}>


                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#00152d",
                        padding: "2rem",
                        color: "#fff",
                        overflow: "hidden",
                        marginTop: '5rem', width: "100%", maxWidth: 1300, margin: 'auto'
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: { xs: "100%", md: "50%" },
                            textAlign: { xs: "center", md: "left" },

                        }}
                    >
                        <Typography sx={{ fontSize: { xs: '1.38rem', sm: '1.7rem', md: '1.9rem', lg: '2.9rem' }, }} className="Nasaliza" >
                            Revolutionizing P&C Insurance with Cutting-Edge AI Solutions
                        </Typography>
                        <Typography sx={{
                            marginTop: "1rem", color: "#bbb",
                            textAlign: 'justify',
                            hyphens: 'auto',
                            wordBreak: 'break-word',
                            '& > span': { display: 'inline-block' }
                        }}>
                            Unlock the Power of Our Digital and AI Solutions to Transform Your Insurance Operations. Discover how our AI-driven technologies streamline claims and policy processing, reduce errors, and boost customer satisfaction. Exciting features await in the demo—get ready!

                        </Typography>
                        <Grid container spacing={2} sx={{ mt: 2, margin: 'auto' }}>
                            {services.map((service, index) => (
                                <Grid item key={service.title} xs={12} sm={6} md={3} display="flex">
                                    <motion.div
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 * (index + 1) }}
                                        style={{ flex: 1 }}
                                    >
                                        <StyledCard>
                                            <CardContent sx={{ flexGrow: 1, textAlign: 'center', backgroundColor: "white" }}>
                                                {service.icon}
                                                {service.title === 'Ivan' ?
                                                    <Typography gutterBottom variant="h6" className="Nasaliza" component="h2" sx={{ mt: 2, color: '#010066' }}>
                                                        Insur<span style={{ color: '#010066', fontWeight: 'bold' }}>AI</span>
                                                    </Typography>
                                                    :
                                                    <Typography gutterBottom variant="h6" className="Nasaliza" component="h2" sx={{ mt: 2, color: '#010066' }}>
                                                        {service.title}
                                                    </Typography>
                                                }

                                                <Typography sx={{ color: '#000000' }}>
                                                    {service.description}
                                                </Typography>
                                            </CardContent>
                                        </StyledCard>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >

                        </motion.div>
                        <Typography className="Nasaliza" sx={{ fontWeight: 'bold', padding: '25px', fontSize: '2rem' }}>
                            <ContactMailIcon sx={{ marginRight: '10px', fontSize: '2.5rem' }} />
                            Contact us for a free POC

                        </Typography>
                    </Box>
                    <Box
                        sx={{ maxWidth: { xs: "100%", md: "40%" }, }}>
                        <Box
                            ref={formRef}
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{
                                mt: 4,
                                p: 4,
                                mb: 4,
                                background: 'white',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '15px',
                                border: '1px solid rgba(11, 112, 255, 0.3)',
                                boxShadow: '0 8px 32px 0 rgba(11, 112, 255, 0.1)',
                            }}
                        >
                            <Typography
                                variant="h5"
                                className="Nasaliza"
                                sx={{
                                    mb: 1,
                                    color: '#0B70FF',
                                    fontSize: { xs: '1rem', sm: '1rem', md: '1rem', lg: '1.5rem' },
                                    textAlign: { xs: 'center' },
                                }}
                            >
                                Request Your Personalized DEMO
                            </Typography>

                            <Typography color={errorMessage && 'red'} marginBottom={3}>{errorMessage}</Typography>
                            <Grid container spacing={3}>
                                {['firstName', 'lastName', 'companyName'].map((field) => (
                                    <Grid item xs={12} sm={6} key={field}>
                                        <TextField
                                            name={field}
                                            label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                            fullWidth
                                            variant="outlined"
                                            value={formData[field]}
                                            onChange={handleChange}
                                            required
                                            InputProps={{
                                                sx: {
                                                    color: '#000000',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: 'none',
                                                        borderBottom: '0.2px solid rgba(0, 0, 0, 0.5)',
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderBottom: '0.2px solid rgba(0, 0, 0, 0.5)'
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderBottom: '2px solid #0B70FF',
                                                    },
                                                }
                                            }}
                                            InputLabelProps={{
                                                sx: { color: 'rgba(11, 112, 255, 0.7)' },
                                            }}
                                        />
                                    </Grid>
                                ))}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="jobtitle"
                                        label="Job Title"
                                        fullWidth
                                        variant="outlined"
                                        value={formData.jobtitle}
                                        onChange={handleChange}
                                        required
                                        InputProps={{
                                            sx: {
                                                color: '#000000',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none',
                                                    borderBottom: '0.2px solid rgba(0, 0, 0, 0.5)',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderBottom: '0.2px solid rgba(0, 0, 0, 0.5)'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderBottom: '2px solid #0B70FF',
                                                },
                                            }
                                        }}
                                        InputLabelProps={{
                                            sx: { color: 'rgba(11, 112, 255, 0.7)' },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        name="mobileNumber"
                                        label="Mobile Number"
                                        fullWidth
                                        variant="outlined"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        required
                                        error={!!formErrors.mobileNumber}
                                        helperText={formErrors.mobileNumber}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Select
                                                        value={formData.countryCode}
                                                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                                        sx={{
                                                            minWidth: 50,
                                                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },

                                                        }}
                                                    >
                                                        {countryCodes.map((country) => (
                                                            <MenuItem key={country.code} value={country.code} >
                                                                <FlagIcon code={country.flag} size={24} style={{ marginRight: '8px' }} />
                                                                {country.name} ({country.code})
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </InputAdornment>
                                            ),
                                            sx: {
                                                color: '#000000',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none',
                                                    borderBottom: '0.2px solid rgba(0, 0, 0, 0.5)',
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderBottom: '0.2px solid rgba(0, 0, 0, 0.5)'
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderBottom: '2px solid #0B70FF',
                                                },
                                            }
                                        }}
                                        InputLabelProps={{
                                            sx: { color: 'rgba(11, 112, 255, 0.7)' },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                                        <TextField
                                            name="companyEmail"
                                            label="Company Email"
                                            fullWidth
                                            variant="outlined"
                                            value={formData.companyEmail}
                                            onChange={handleChange}
                                            required
                                            error={!!formErrors.companyEmail}
                                            helperText={formErrors.companyEmail}
                                            InputProps={{
                                                sx: {
                                                    color: '#000000',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: 'none',
                                                        borderBottom: '0.2px solid rgba(0, 0, 0, 0.5)',
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderBottom: '0.2px solid rgba(0, 0, 0, 0.5)'
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderBottom: '2px solid #0B70FF',
                                                    },
                                                }
                                            }}
                                            InputLabelProps={{
                                                sx: { color: 'rgba(11, 112, 255, 0.7)' },
                                            }}
                                        />
                                        {!otpSent && (
                                            <StyledButtonComponent buttonWidth={'200px'} onClick={sendInitialRequest}>
                                                {openDialog ? <CircularProgress size={24} color="inherit" /> : 'Get OTP'}
                                            </StyledButtonComponent>
                                        )}

                                        {otpSent && !isVerified && (
                                            <StyledButtonComponent buttonWidth={'200px'} onClick={sendInitialRequest}>
                                                {openDialog ? <CircularProgress size={24} color="primary" /> : 'Resend OTP'}
                                            </StyledButtonComponent>
                                        )}

                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            name="otp"
                                            label="Enter the OTP sent to your email."
                                            type="text"
                                            fullWidth
                                            variant="outlined"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                            InputProps={{
                                                sx: {
                                                    color: '#000000',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: 'none',
                                                        borderBottom: '0.2px solid rgba(0, 0, 0, 0.5)',
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderBottom: '0.2px solid rgba(0, 0, 0, 0.5)',
                                                        borderRadius: "none",
                                                    },
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderBottom: '2px solid #0B70FF',
                                                        borderRadius: "none",
                                                    },
                                                },
                                            }}
                                            InputLabelProps={{
                                                sx: { color: 'rgba(11, 112, 255, 0.7)' },
                                            }}
                                            sx={{ flexGrow: 1 }} // To ensure the TextField takes available space
                                        />


                                        {/*
                {isVerified && (
                    <CheckCircleIcon color="success" sx={{ fontSize: 30 }} />
                )} */}
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="reason"
                                        label="Reason for Contacting"
                                        fullWidth
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                        value={formData.reason}
                                        onChange={handleChange}
                                        required
                                        error={!!formErrors.reason}
                                        helperText={formErrors.reason}
                                        InputProps={{
                                            sx: {
                                                color: '#000000',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: 'none',
                                                    borderBottom: '0.2px solid rgba(0, 0, 0, 0.5)',

                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderBottom: '0.2px solid rgba(0, 0, 0, 0.5)',
                                                    borderRadius: "none"
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderBottom: '2px solid #0B70FF',
                                                    borderRadius: "none"
                                                },
                                            }
                                        }}
                                        InputLabelProps={{
                                            sx: { color: 'rgba(11, 112, 255, 0.7)' },
                                        }}
                                    />
                                </Grid>

                            </Grid>
                            <Grid item xs={12} textAlign={'left'}>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={handleCheckboxChange}

                                        />
                                    }
                                    label={
                                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                            I accept the  &nbsp;
                                            <Link href="/TermsofUse" target="_blank" >
                                                Terms of Use
                                            </Link> and <Link href="https://innovontek.com/privacy-policy/" target="_blank" >
                                                Privacy Policy</Link>
                                        </Typography>
                                    }
                                    sx={{ color: 'black' }}
                                />
                            </Grid>

                            <StyledButtonComponent onClick={sendOtpVerification} sx={{ mt: 3 }} >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit Request'}

                            </StyledButtonComponent>


                        </Box>
                    </Box>
                </Box>
            </Box>
            <Footer />
        </>
    );
};
export default DemoPage;