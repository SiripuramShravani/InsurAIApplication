import React, { useState, useMemo, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Avatar, Button, CircularProgress, InputAdornment, TextField, Box, Typography, Container, useFormControl, Checkbox, FormControlLabel, Grid, Paper, } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Header from '../components/header';
import Footer from '../components/footer';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StyledButtonComponent from '../components/StyledButton.js';


const initialValue = {
  policy_number: "",
  pol_date_of_birth: "",
};
const POLICYNUMBER_REGEX = /^(?=.*[HI])(?=.*[0-9])[HI0-9]{10,10}$/;

const Signin = () => {
  document.title = 'Innovon Tech-Signin'
  const [error, setError] = useState(null);
  const [flag, setFlag] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState('');
  const [loginFormValue, setLoginFormValue] = useState(initialValue);
  const { policy_number, pol_date_of_birth } = loginFormValue;
  const [selectedDate,] = useState(null);
  const [validPolicyNumber, setValidPolicyNumber] = useState(false);
  const [validDateOfBirth, setValidDateOfBirth] = useState(false);
  const [policyNumberErrorText, setPolicyNumberErrorText] = useState(false);
  const [dateOfBirthError, setDateOfBirthError] = useState(true);
  const [, setDateFilling] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [showRecaptcha, setShowRecaptcha] = useState(false);
   const navigate = useNavigate();
  const [Loader, setLoader] = useState(false);
  const [nonInsuredOTP, setnonInsuredReOTP] = useState(false);
  const [iconUnlocked, setIconUnlocked] = useState(false);
  const [verifyLoader, setverifyLoader] = useState(false);
  const [verifyiedNonInsured, setVerifyNonInsured] = useState(false)
  const [sent, setSent] = useState(false)
  const [EmailLoading, setEmailLoading] = useState(false)
  const [ResendOTP, setResendOTPLoading] = useState(false)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isScreen = useMediaQuery('(max-width:900px)');
  const [verifyOTPLoader, setverifyOTPLoader] = useState(false);
   const [nonInsuredEmailOTPVerified, setNonInsuredEmailOTPVerified] = useState(false);
  const [getPolicy,] = useState('')

  useEffect(() => {
    localStorage.setItem("title", "Sign in -insurAI.innovation.intelligence")
    const title = localStorage.getItem("title")
    localStorage.setItem("rout", '/signin');
    document.title = title;
   }, [])

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });



  const handleVerifyEmail = async (value) => {
    setOtp('');
    if (value === 'Resend') {
      setResendOTPLoading(true);
    } else {
      setEmailLoading(true);
    }
    try {
       const response = await axiosInstance.post('Administration/single_sign_in/', { email_id: email });
 
      if (response.status === 200 && response.data && response.data.token === true) {
        if (value === 'Resend') {
          setResendOTPLoading(false);
        } else {
          setEmailLoading(false);
          setRecaptchaToken(null);
        }
        localStorage.setItem('userName', email);
        localStorage.setItem('privilege', response.data.role || '');
         setFlag(true);
        setShowRecaptcha(true);
        setError(null);
        setToken(response.data.token);
      } else if (response.data.email_error) {
        setEmailLoading(false);
        setResendOTPLoading(false);
        setError(response.data.email_error);
      }
    } catch (error) {
      setEmailLoading(false);
      setResendOTPLoading(false);
      if (error.response && error.response.data && error.response.data.email_error) {
        setError(error.response.data.email_error);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };


  const VerifyNonInsuredEmail = async (value) => {
    setOtp('')
    setverifyLoader(true)
    if (value === 'Resend') {
      setnonInsuredReOTP(true)
    }
    await axiosInstance.post('verify_noninsured_email/', { email })
      .then(response => {
         if (response.data && response.data.role && response.data.token) {
           setSent(true)
          setErrorMessage(null);
          localStorage.setItem('NonInsuredEmail', email)
          setnonInsuredReOTP(false)
          localStorage.setItem('privilege', response.data.role)
           setToken(response.data.token);
        }
        if (response.data.email_error) {
          setverifyLoader(false)
           setnonInsuredReOTP(false)
          setErrorMessage(response.data.email_error);
        }
      }).catch((error) => {

         setnonInsuredReOTP(false)
        setverifyLoader(false)
        if (error) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      })
  }



  const HandleNonInsuredOTP = () => {
    const email = localStorage.getItem('NonInsuredEmail');
 
    const privilege = 'user'
    const role = 'nonInsured'
    try {
      axiosInstance.post('verify-otp/', { email, otp, role, privilege }).then(response => {
 
        // Handle user role
        if (response.data.privilege === "user") {
          if (email) {
            setError(null);
            setverifyOTPLoader(true);
            setNonInsuredEmailOTPVerified(true);
             
            localStorage.setItem("Auth", token);
          } else {
             setVerifyNonInsured(true);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("company", JSON.stringify(response.data.company));
            localStorage.setItem("Auth", token);
            // Navigate based on route
            const route = localStorage.getItem("rout");
            navigate(route || '/');
          }
        }

        else {
          setError("Invalid OTP or email verification failed.");
        }
      })
    } catch (error) {

    }
  }

  const getCompanyDataForSigningUser = async (email_id) => {
    try {
      const companyResponse = await axiosInstance.post('get_ic_id_for_company_Admin/',{ email: email_id });
       if (companyResponse.data && companyResponse.data.ic_id) {
        localStorage.setItem("ic_id_for_dashboard", companyResponse.data.ic_id);
        localStorage.setItem("ic_name_for_dashboard", companyResponse.data.ic_name);
        return true; // Indicate success
      } else {
        // Handle cases where the API doesn't return ic_id as expected
        console.error("Company API didn't return ic_id:", companyResponse);
        return false; // Indicate failure
      }
    } catch (companyError) {
      // Handle errors from the company API call
      console.error("Error fetching company data:", companyError);
      return false; // Indicate failure
    }
  };

  const getCompanyEmailbyCompanyNameforSigninUser = async (companyName) => {
    try {
      const response = await axiosInstance.post('get_ic_email_by_ic_name/', { companyName: companyName });
 
      if (response.data && response.data.ic_email) {
        return response.data.ic_email; // Return the email from the response
      } else {
        console.error("API didn't return email:", response);
        return null; // Or handle the error appropriately
      }
    } catch (error) {
      console.error("Error fetching company email:", error);
      return null; // Or handle the error appropriately
    }
  };

  const handleVerifyOTP = async () => {
    setIconUnlocked(true);
    const email_id = email;
    try {
      // const response = await axios.post(`${process.env.REACT_APP_URL}/Administration/verify_email_otp/`, { email_id, otp });
      const response = await axiosInstance.post('Administration/verify_email_otp/', { email_id, otp });
       if (response.data && response.data.user_data) {
        const accessArray = response.data.user_data.Access;
        const accessString = JSON.stringify(accessArray);
        localStorage.setItem('userAccess', accessString);

        const signinUserDetails = JSON.stringify(response.data.user_data);
        localStorage.setItem('signinUserDetails', signinUserDetails)
        setSent(true)
        setErrorMessage(null);
        localStorage.setItem("Auth", token);
        setnonInsuredReOTP(false)
        localStorage.setItem('privilege', response.data.role)
 
 
         if (accessString === '["company_Dashboard"]') {
          // User has only company dashboard access
          if (await getCompanyDataForSigningUser(email_id)) {
            // Successfully fetched company data
            navigate('/dashboard/dashboard');
          } else {
            // Handle the case where fetching company data failed
            // You might want to display an error message to the user here
            console.error("Failed to fetch company data for admin.");
          }
        }
        else if (accessString === '["claim_manager"]' || accessString === '["reports_analyst"]' || accessString === '["adjuster"]' || accessString === '["underwriter"]' || accessString === '["agent_admin"]') {
          // User has only claim dashboard access
          const signinUserDetailsObject = JSON.parse(signinUserDetails);
          const companyEmail = await getCompanyEmailbyCompanyNameforSigninUser(signinUserDetailsObject.company_name);
          if (companyEmail) {
            if (await getCompanyDataForSigningUser(companyEmail)) { // Pass the fetched email here
              navigate('/dashboard/dashboard');
            } else {
              console.error("Failed to fetch company data for admin.");
            }
          } else {
            console.error("Failed to get the company email by company name");
          }

        }
        else {
          // User has other access, proceed with get-policy API call
          if (accessString.includes("claim_intake")) {
             await axiosInstance.post('get-policy/', { email: email_id })
              .then(res => {
                 if (res.data) {
                  localStorage.setItem("user", JSON.stringify(res.data.user));
                  localStorage.setItem("company", JSON.stringify(res.data.company));

                  navigate('/');
                }
              }).catch((error) => {
                 localStorage.removeItem('Auth')
              });
          }
          navigate('/');
        }
        // setIsAuthenticated(true);
        localStorage.setItem("authStatus", JSON.stringify(true));

      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // setIsAuthenticated(false);
      localStorage.removeItem("authStatus");
       setEmailLoading(false);
      setIconUnlocked(false);

      // Handle different types of errors
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };




  useEffect(() => {
    const title = localStorage.getItem("title")
    document.title = title;
  }, [])
  const handleContinueNonInsured = () => {
    localStorage.setItem("isInsured", "no")
    navigate("/signin")
  }

  const handleContinueInsured = () => {
    localStorage.setItem("isInsured", "yes")
    navigate("/signin")
  }


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

      setLoginFormValue({ ...loginFormValue, pol_date_of_birth: formattedDateOfBirth });
    }
  };

  function PolicyNumberHelperText() {
    const { focused, } = useFormControl() || {};
    const helperText = useMemo(() => {
      if (focused) {
        return validPolicyNumber ? "" : "Enter a Valid Policy Number";
      }
      return "";
    }, [focused]);
    return helperText;
  }

  const handleOnPolicyNumberFocus = (e) => {
    if (validPolicyNumber) setPolicyNumberErrorText(false);
    else setPolicyNumberErrorText(true);
  };

  const handleOnPolicyNumberBlur = () => {
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
  }, [validPolicyNumber, policy_number.length]);

  const onInputChange = (e) => {
    let { name, value } = e.target;
    setLoginFormValue({ ...loginFormValue, [name]: value });
  };
  const generateRandomToken = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000);
  };


  const handleNonInsuredLogin = async (event) => {
    event.preventDefault();
    setLoader(true)

    await axiosInstance
      .post('verify-policy/', { loginFormValue })
      .then((response) => {
         if (response.data && response.data.company && response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("company", JSON.stringify(response.data.company));
          const newToken = generateRandomToken();
          sessionStorage.setItem('NonInsuredAuth', newToken.toString());
          const array = ['claim_intake']
          const accessString = JSON.stringify(array)
          localStorage.setItem('userAccess', accessString);

          const rout = localStorage.getItem("rout");

           if (rout === "/signin") {
            return navigate("/")
          } else if (rout === '/customercompany') {
            return navigate('/');
          }
          else {
            return navigate(rout);
          }

        }
      })
      .catch((error) => {
        setLoader(false)
        if (error.response && error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        }

      });
  };



  const onChangeRecap = (value) => {
    setRecaptchaToken(value);
  };

  const canSave = [validPolicyNumber, validDateOfBirth].every(Boolean);
  const handleOTPChange = (e) => {
    setOtp(e.target.value);
  };
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const isEmailValid = (email) => {
    // Basic email format validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
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
        <Box >

          <Grid container >
            <Grid item xs={12} sm={12} md={6}>
              <Box sx={{ position: "relative", width: isScreen ? "auto" : "50vw", height: "830px", background: 'linear-gradient(to bottom, #001660, blue)' }}>

                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",

                    padding: 4,

                  }}
                >
                  <Typography variant="h3" component="h1" gutterBottom className='Nasaliza'>
                    Sign in to explore
                  </Typography>
                  <Typography variant="h2" component="h2" className='Nasaliza'>
                    Innovon Tech AI Solutions
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
                  height: '830px',
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",

                }}
              >
                <Container component="main" maxWidth="xs">
                  <Paper elevation={6} sx={{ padding: 2, borderRadius: 2 }}>
                    <Box >
                      <Grid sx={{
                        backgroundColor: "rgb(49, 114, 246)",
                        width: "100%",
                        height: '40%',
                        position: 'relative',
                        bottom: "2rem",
                        color: 'white',
                        borderRadius: "20px",
                        padding: '0.5rem 0rem'

                      }}>

                        <Typography component="h1" variant="h5" sx={{ marginBottom: 2 }} className='Nasaliza'>
                          Sign in
                        </Typography>
                        <Box
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                            <LockOutlinedIcon />
                          </Avatar>
                        </Box>
                      </Grid>
                      <Box component="form" sx={{ width: "100%", mt: 1 }}>
                        {/* <h1 className='PageTitle Nasaliza-FnolSol Nasaliza'>{PageTitle}</h1> */}

                        {localStorage.getItem("isInsured") === "yes" ? (
                          <Grid >
                            <Grid className={flag ? 'sign_otp_container' : 'sign_container'}>
                              <Container component="main" maxWidth="xs" >
                                <Typography variant="body1" sx={{ mt: 1, color: 'red' }}>{error || getPolicy}</Typography>

                                <Box component="form" className='input' noValidate >
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
                                      sx: { color: 'rgba(11, 112, 255, 0.7)' },
                                    }}
                                    className={`signinInput`}
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                  />
                                  {!flag && (
                                    <div className="recaptcha-container">


                                      <ReCAPTCHA sitekey={`${process.env.REACT_APP_RECAPTCHA}`} onChange={onChangeRecap} />

                                    </div>
                                  )}

                                  {flag &&
                                    <>

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
                                          sx: { color: 'rgba(11, 112, 255, 0.7)' },
                                        }}
                                        className='signinInput'
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="otp"
                                        label="Enter 6 digits OTP"
                                        name="otp"
                                        autoComplete="otp"
                                        autoFocus
                                        value={otp}
                                        onChange={handleOTPChange}
                                      />
                                      <Grid sx={{ textAlign: 'left' }}>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              name='terms&conditions'
                                              checked={checked}
                                              onChange={handleCheckboxChange}
                                              color="primary"
                                              size='20px'
                                            />
                                          }
                                          label={
                                            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                              I accept the  &nbsp;
                                              <Link to="/TermsofUse" target="_blank" >
                                                Terms of Use
                                              </Link> and <Link to="https://innovontek.com/privacy-policy/" target="_blank" >
                                                Privacy Policy</Link>
                                            </Typography>
                                          } />
                                      </Grid>
                                    </>
                                  }

                                  {!flag ?
                                    <StyledButtonComponent buttonWidth={200} disableColor={"#B6E3FF"}
                                      fullWidth
                                      disabled={EmailLoading || !email || (!flag && !recaptchaToken) || (flag && (!otp || !recaptchaToken))}
                                      onClick={handleVerifyEmail}
                                    >
                                      {EmailLoading ? <CircularProgress size={24} color="inherit" /> : 'GET OTP'}

                                    </StyledButtonComponent>
                                    :
                                    <StyledButtonComponent buttonWidth={200} disableColor={"#B6E3FF"}
                                      fullWidth
                                      onClick={handleVerifyOTP}
                                      disabled={EmailLoading || (flag && (!otp || !email)) || !checked} // Disable the button if email is empty, or (if OTP is not entered and ReCAPTCHA is not verified), or (if OTP is entered but ReCAPTCHA is not verified) // Disable the button if email field is empty or if OTP is empty when flag is true
                                      startIcon={
                                        iconUnlocked ? (
                                          <LockOpenIcon className="open" />
                                        ) : (
                                          <LockIcon className={EmailLoading ? "loading" : ""} />
                                        )
                                      }

                                    >
                                      {EmailLoading ? "Signing In..." : "Sign In"}
                                    </StyledButtonComponent>}
                                  <Grid container spacing={0} justifyContent="center" marginTop={showRecaptcha ? '70px' : "0px"} sx={{ display: 'block' }}>


                                    <Grid item>
                                      <Typography variant="body1" style={{ color: "rgb(161, 147, 147)" }}>Want to continue as?<Button onClick={handleContinueNonInsured}>Non-Insured</Button></Typography>

                                    </Grid>
                                  </Grid>
                                  {flag && (
                                    <StyledButtonComponent buttonWidth={200}
                                      onClick={() => { handleVerifyEmail('Resend') }}
                                    >
                                      {ResendOTP ? <CircularProgress size={24} color="inherit" /> : 'Resend OTP'}
                                    </StyledButtonComponent>
                                  )}
                                </Box>


                              </Container>

                            </Grid>
                          </Grid>


                        ) : (
                          <>
                            <Box sx={{
                              padding: theme.spacing(1), margin: 'auto', maxWidth: '400px', height: "auto",
                            }}>
                              <Grid item xs={12} md={12} container justifyContent="center" spacing={isMobile ? 1 : 2}>
                                <Grid item xs={12}>
                                  {errorMessage && (
                                    <Typography style={{ color: "red" }}>Error : {errorMessage}</Typography>
                                  )}
                                  {error && (
                                    <Typography style={{ color: "red" }}> {error || getPolicy}</Typography>
                                  )}
                                </Grid>
                                {!verifyiedNonInsured &&
                                  <>

                                    <Grid item xs={12} md={12} justifyContent="center">

                                      {/* <Box component="form"  noValidate > */}
                                      <TextField
                                        fullWidth
                                        margin="normal"
                                        required
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        autoFocus
                                        value={email}
                                        onChange={handleChangeEmail} // Handle change event separately
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              {
                                                sent ? <CheckCircleOutlineIcon style={{ color: 'green' }} />
                                                  :
                                                  <StyledButtonComponent
                                                    buttonWidth={90}
                                                    disableColor={"#B6E3FF"}
                                                    onClick={VerifyNonInsuredEmail}
                                                    style={{ margin: 0, padding: 0 }}
                                                    disabled={!isEmailValid(email) || verifyLoader} // Disable button if email is empty or verification is in progress
                                                  >
                                                    {verifyLoader ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
                                                  </StyledButtonComponent>
                                              }

                                            </InputAdornment>
                                          ),
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
                                      />

                                      {/* </Box> */}
                                    </Grid>
                                    {sent &&
                                      <>

                                        <Grid item xs={isMobile ? 12 : 12} >
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
                                              sx: { color: 'rgba(11, 112, 255, 0.7)' },
                                            }}
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
                                            helperText={validPolicyNumber ? "" : <PolicyNumberHelperText />}
                                            variant="outlined"
                                            fullWidth
                                          />
                                        </Grid>
                                        <Grid item xs={12} md={12} container justifyContent="center">
                                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={["DatePicker"]}>
                                              <DatePicker
                                                className='calen'
                                                error={dateOfBirthError}
                                                label="Date of Birth *"
                                                views={["year", "month", "day"]}
                                                value={selectedDate}
                                                name="pol_date_of_birth"
                                                variant="outlined"
                                                onChange={onDateChange}
                                                onBlur={() => setDateFilling(false)}
                                                portalId="root"
                                                openTo="year"
                                                fullWidth
                                                renderInput={(params) => (
                                                  <TextField
                                                    InputProps={{
                                                      sx: {
                                                        color: '#000000',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                          border: 'none',
                                                          borderBottom: '0.2px solid rgba(0, 0, 0, 0.5)', // Light black color
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                          borderBottom: '0.2px solid rgba(0, 0, 0, 0.7)', // Slightly darker on hover
                                                        },
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                          borderBottom: '2px solid #0B70FF', // Blue color on focus
                                                        },
                                                      }
                                                    }}
                                                    {...params}
                                                    fullWidth

                                                    InputLabelProps={{
                                                      sx: { color: 'rgba(11, 112, 255, 0.7)' },
                                                    }}
                                                  />
                                                )}
                                              />
                                            </DemoContainer>
                                          </LocalizationProvider>
                                          <Grid style={{ marginBottom: "0.6rem" }}></Grid>
                                          <Grid item xs={12} md={12} container justifyContent="center">
                                            <TextField
                                              className='signinInput'
                                              margin="normal"
                                              required
                                              fullWidth
                                              id="otp"
                                              label="Enter 6 digits OTP"
                                              name="otp"
                                              autoComplete="otp"
                                              autoFocus
                                              value={otp}
                                              onChange={handleOTPChange}
                                              InputProps={{
                                                endAdornment: (
                                                  <InputAdornment position="end">
                                                    {
                                                      verifyOTPLoader ? <CheckCircleOutlineIcon style={{ color: 'green' }} /> :
                                                        <StyledButtonComponent
                                                          buttonWidth={90}
                                                          disableColor={"#B6E3FF"}
                                                          onClick={HandleNonInsuredOTP}
                                                          disabled={!email || !otp}
                                                        >
                                                          {verifyOTPLoader ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
                                                        </StyledButtonComponent>
                                                    }
                                                  </InputAdornment>
                                                ),
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
                                            />
                                          </Grid>

                                          <div className="recaptcha-container">
                                            <ReCAPTCHA sitekey={`${process.env.REACT_APP_RECAPTCHA}`} onChange={onChangeRecap} />
                                          </div>
                                          <Grid item xs={12} md={12} container sx={{ textAlign: 'left' }}>
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  name='terms&conditions'
                                                  checked={checked}
                                                  onChange={handleCheckboxChange}
                                                  color="primary"
                                                  size='20px'
                                                />
                                              }
                                              label={
                                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                  I accept the
                                                  <Link to="/TermsofUse" target="_blank" >
                                                    Terms of Use
                                                  </Link> and  <Link to="https://innovontek.com/privacy-policy/" target="_blank" >
                                                    Privacy Policy    </Link>
                                                </Typography>
                                              } />
                                          </Grid>
                                        </Grid>
                                        <Grid item xs={6}>
                                          <StyledButtonComponent
                                            buttonWidth={150}
                                            disableColor={"#B6E3FF"}
                                            onClick={handleNonInsuredLogin}
                                            disabled={!checked || !canSave || !otp || !email || !recaptchaToken || !policy_number || !pol_date_of_birth || Loader || !nonInsuredEmailOTPVerified}
                                          >
                                            {Loader ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                                          </StyledButtonComponent>
                                        </Grid>
                                        <Grid item xs={6}>
                                          <StyledButtonComponent
                                            buttonWidth={150}
                                            disableColor={"#B6E3FF"}
                                            onClick={() => { VerifyNonInsuredEmail('Resend') }}
                                            disabled={verifyOTPLoader}
                                          >
                                            {nonInsuredOTP ? <CircularProgress size={24} color="inherit" /> : 'Resend OTP'}
                                          </StyledButtonComponent>
                                        </Grid>
                                      </>
                                    }
                                    <Grid item xs={12}>
                                      <Typography align="center" style={{ color: "rgb(161, 147, 147)" }} >Wants to continue as ? <Button onClick={handleContinueInsured}>Insured</Button></Typography>
                                    </Grid>
                                  </>
                                }
                              </Grid>
                            </Box>
                          </>
                        )}
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

export default Signin



