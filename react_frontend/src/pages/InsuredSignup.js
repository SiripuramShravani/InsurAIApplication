import { Box, Avatar, Typography, Grid, TextField, useFormControl, Button,FormControlLabel,Link,Checkbox, Paper, Backdrop, Container, CircularProgress, } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Footer from '../components/footer';
import Header from '../components/header';
import ReCAPTCHA from 'react-google-recaptcha';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import StyledButtonComponent from '../components/StyledButton';
const initialValue = {
    email: "",
    policy_number: "",
    pol_date_of_birth: "", // Store date in DD/MM/YYYY format
};

const POLICYNUMBER_REGEX = /^(?=.*[HI])(?=.*[0-9])[HI0-9]{10,10}$/;

const InsuredSignup = () => {
    const [signupFormValue, setSignupFormValue] = useState(initialValue);
    const { email, policy_number, pol_date_of_birth } = signupFormValue;
    const [selectedDate, ] = useState(null);
    const [validPolicyNumber, setValidPolicyNumber] = useState(false);
    const [, setValidDateOfBirth] = useState(false);
    const [, setDateFilling] = useState(false);
    const [policyNumberErrorText, setPolicyNumberErrorText] = useState(false);
    const [dateOfBirthError, setDateOfBirthError] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate()
    const theme = useTheme();
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isScreen = useMediaQuery('(max-width:900px)');
    useEffect(() => {
        const title = localStorage.getItem("title")
        document.title = title
    }, [])

    const handleContinueInsured = () => {
        localStorage.setItem("isInsured", "yes")
        navigate("/signin")
    }
    const handleContinueNonInsured = () => {
        localStorage.setItem("isInsured", "no")
        navigate("/signin")
    }

    const onInputChange = (e) => {
        let { name, value } = e.target;
        console.log("name, value : ", name, value);
        setSignupFormValue({ ...signupFormValue, [name]: value });
    };

    const onDateChange = (date) => {
        if (date && date.length !== 0) {
            setValidDateOfBirth(true);
            setDateOfBirthError(false);
            // Format date to DD/MM/YYYY
            const day = date.$D;
            const month = date.$M + 1; // $M is 0-indexed
            const year = date.$y;
            const formattedDateOfBirth = `${day.toString().padStart(2, "0")}/${month
                .toString()
                .padStart(2, "0")}/${year}`;
            setSignupFormValue({ ...signupFormValue, pol_date_of_birth: formattedDateOfBirth });
        }
    };

    function PolicyNumberHelperText() {
        const { focused,  } = useFormControl() || {};
        const helperText = useMemo(() => {
            if (focused) {
                return validPolicyNumber ? "" : "Enter a Valid Policy Number";
            }
            return "";
        }, [focused]);
        return helperText;
    }
    const onChangeRecap = (value) => {
        setRecaptchaToken(value);
    };
    const handleOnPolicyNumberFocus = (e) => {
        if (validPolicyNumber) setPolicyNumberErrorText(false);
        else setPolicyNumberErrorText(true);
    };

    const handleOnPolicyNumberBlur = () => {
        console.log("clicked policy number outside");
        if (validPolicyNumber || policy_number.length === 0)
            setPolicyNumberErrorText(false);
        else if (policy_number.length !== 0) setPolicyNumberErrorText(true);
    };

    useEffect(() => {
        setValidPolicyNumber(POLICYNUMBER_REGEX.test(policy_number));
    }, [policy_number]);

    useEffect(() => {
        if (validPolicyNumber) setPolicyNumberErrorText(false)
        else if (policy_number.length !== 0)
            setPolicyNumberErrorText(true)
    }, [validPolicyNumber,policy_number.length]);

    const handleInsuredsignup = async () => {
        setLoader(true);
        console.log(signupFormValue);
        await axios.post(`${process.env.REACT_APP_URL}sign_up/`, { signupFormValue })
            .then((response) => {
                console.log(response);
                if (response.status === 201) {
                    setLoader(false)
                    // localStorage.setItem("rout", "/signin")
                    localStorage.setItem("title", "Sign In -Innovon Technologies")
                    navigate("/signin")
                }
            })
            .catch((error) => {
                console.log(error);
                setLoader(false)
                if (error.response && error.response.data && error.response.data.message) {
                    setErrorMessage(error.response.data.message)
                }
                if (error.response && error.response.data && error.response.data.error) {
                    setErrorMessage(error.response.data.error)
                }
            })
    }
    const [checked, setChecked] = useState(false);
   
  
    const handleCheckboxChange = (event) => {
      setChecked(event.target.checked);
    };

    return (

        <>


            <Box sx={{
                display: 'flex',


            }} >
                 <Header />
                <Box>
                    <Grid container >
                        <Grid item xs={12} sm={12} md={6}>
                            <Box sx={{ position: "relative", width: isScreen ? "100vw" : "50vw",   height: "800px",background: 'linear-gradient(to bottom, #001660, blue)' }}>
                               
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 250,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        color: "white",
                                        textAlign: "center",
                                        padding: 4,

                                    }}
                                >
                                    <Typography variant="h3" component="h1" gutterBottom className='Nasaliza'>
                                        Sign Up to explore
                                    </Typography>
                                    <Typography variant="h2" component="h2" className='Nasaliza'>
                                        Innovon Tech Solutions
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Box
                                sx={{
                                    bgcolor: "background.paper",
                                    borderRadius: 2,
                                    width: isScreen ? "100vw" : "50vw",
                                    height: "800px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",

                                }}
                            >
                                <Container component="main" maxWidth="xs" >
                                    <Paper elevation={6} sx={{ padding: 2, borderRadius: 2, }}>
                                        <Box >
                                            <Grid sx={{
                                                backgroundColor: "rgb(49, 114, 246)",
                                                width: "100%",
                                                height: '100%',
                                                position: 'relative',
                                                bottom: "2rem",
                                                color: 'white',
                                                borderRadius: "20px",
                                                padding: '0rem 0rem'

                                            }}>


                                                <Typography component="h1" variant="h5" sx={{ marginBottom: 1 }} className='Nasaliza'>
                                                    Sign Up
                                                </Typography>
                                                <Box
                                                    sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}
                                                >
                                                    <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                                                        <LockOutlinedIcon />
                                                    </Avatar>
                                                </Box>
                                            </Grid>

                                            {/* <Grid marginTop="130px"></Grid> */}

                                            <Box component="form" sx={{ width: "100%", }}>
                                                <Grid item xs={12} md={12} container justifyContent="center" spacing={isMobile ? 1 : 2}>
                                                    {/* <Avatar sx={{ bgcolor: 'blue' }}>
                                            <LockOutlinedIcon />
                                        </Avatar> */}
                                                    <Grid item xs={12}>
                                                        {errorMessage && (
                                                            <Typography style={{ color: "red" }}>Error : {errorMessage}</Typography>
                                                        )}
                                                    </Grid>
                                                    <Grid item xs={isMobile ? 9 : 9}>
                                                        <TextField
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
                                                                sx: { color: 'rgba(11, 112, 255, 0.7)' },
                                                            }}
                                                            // error={policyNumberErrorText}
                                                            label="Email ID"
                                                            required
                                                            id="email"
                                                            name="email"
                                                            autoComplete="email"
                                                            value={email}
                                                            onChange={onInputChange}

                                                            sx={{ width: 245 }}

                                                        />
                                                        <Grid margin='25px'></Grid>
                                                        <TextField
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
                                                                sx: { color: 'rgba(11, 112, 255, 0.7)' },
                                                            }}
                                                            className="textfield"
                                                            error={policyNumberErrorText}
                                                            label="Policy Number"
                                                            required
                                                            id="policy_number"
                                                            name="policy_number"
                                                            autoComplete="policy_number"
                                                            value={policy_number}
                                                            onChange={onInputChange}
                                                            onBlur={handleOnPolicyNumberBlur}
                                                            onFocus={handleOnPolicyNumberFocus}
                                                            sx={{ width: 245 }}
                                                            helperText={
                                                                validPolicyNumber ? "" : <PolicyNumberHelperText />
                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12} container justifyContent="center" style={{ marginBottom: '2rem' }}>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DemoContainer components={["DatePicker"]} style={{ maxWidth: '500px' }}>
                                                                <DatePicker
                                                                    error={dateOfBirthError}
                                                                    label="Date of Birth *"
                                                                    views={["year", "month", "day"]}
                                                                    value={selectedDate}
                                                                    name="pol_date_of_birth"
                                                                    variant="outlined"
                                                                    onChange={onDateChange}
                                                                    onBlur={() => setDateFilling(false)}
                                                                    portalId="root"
                                                                    renderInput={(params) => (
                                                                        <TextField
                                                                            {...params}
                                                                            fullWidth
                                                                            InputProps={{
                                                                                sx: {
                                                                                    color: '#000000',
                                                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                                                        border: 'none',
                                                                                        borderBottom: '0.2px solid rgba(0, 0, 0, 0.5)',
                                                                                    },
                                                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                                                        borderBottom: '0.2px solid rgba(0, 0, 0, 0.5)',
                                                                                        borderRadius: 'none',
                                                                                    },
                                                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                                                        borderBottom: '2px solid #0B70FF',
                                                                                        borderRadius: 'none',
                                                                                    },
                                                                                },
                                                                            }}
                                                                            InputLabelProps={{
                                                                                sx: { color: 'rgba(11, 112, 255, 0.7)' },
                                                                            }}
                                                                        />
                                                                    )}
                                                                    openTo="year"
                                                                />
                                                            </DemoContainer>
                                                        </LocalizationProvider>
                                                        
                                                    </Grid>
                                               
                                                    <div className="recaptcha-container">
                                                        <ReCAPTCHA sitekey={`${process.env.REACT_APP_RECAPTCHA}`} onChange={onChangeRecap} />
                                                    </div>
                                                    <Grid sx={{ textAlign: 'left' }}>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              name='terms&conditions'
                                              checked={checked}
                                              onChange={handleCheckboxChange}
                                              color="primary"
                                              size='25px'
                                            />
                                          }
                                          label={
                                            <Typography variant="body2" >
 
                                              I accept the <Link href="/TermsofUse" target="_blank" > Terms of Use</Link>
 
                                            </Typography>
                                          } />
                                      </Grid>
                                                    <StyledButtonComponent
                                                        buttonWidth={300}
                                                        disableColor={"#B6E3FF"}
                                                        onClick={handleInsuredsignup}
                                                        disabled={!recaptchaToken ||!checked|| !email || !policy_number || !pol_date_of_birth || loader}
                                                    >
                                                        {loader ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                                                    </StyledButtonComponent>
                                                    <Backdrop
                                                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                                        open={loader}
                                                    >
                                                        <CircularProgress color="inherit" />
                                                    </Backdrop>

                                                    <Grid item xs={12}>
                                                        <Typography variant="body1" align="center" style={{ color: "rgb(161, 147, 147)" }}>Have an account ? <Button onClick={handleContinueInsured}>Sign-In</Button></Typography>
                                                        <Typography variant="body1" align="center" style={{ color: "rgb(161, 147, 147)" }}>Wants to continue as? <Button onClick={handleContinueNonInsured} >Non-Insured</Button></Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                    </Grid>

                                                </Grid>
                                            </Box>



                                        </Box>
                                    </Paper>
                                </Container>
                            </Box>


                        </Grid>
                    </Grid>
                </Box>
            </Box>


            <Footer />




        </>

    )
}

export default InsuredSignup
