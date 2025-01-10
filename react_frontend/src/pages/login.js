import React, { useState, useMemo, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SendIcon from '@mui/icons-material/Send';
import { Typography, useFormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button, Box, Grid, TextField } from '@mui/material';
import Header from "../components/header.js";
import Footer from '../components/footer.js';
import "./pagesstyles.css";
import axios from 'axios';
 
const initialValue = {
  policy_number: "",
  pol_date_of_birth: "", // Store date in DD/MM/YYYY format
};
 
const POLICYNUMBER_REGEX = /^(?=.*[HI])(?=.*[0-9])[HI0-9]{10,10}$/;
 
export default function Login() {
  const [loginFormValue, setLoginFormValue] = useState(initialValue);
  const { policy_number,  } = loginFormValue;
  const [selectedDate, ] = useState(null);
  const [validPolicyNumber, setValidPolicyNumber] = useState(false);
  const [validDateOfBirth, setValidDateOfBirth] = useState(false);
  const [, setDateFilling] = useState(false);
  const [policyNumberErrorText, setPolicyNumberErrorText] = useState(false);
  const [dateOfBirthError, setDateOfBirthError] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
 
  useEffect(() => {
    setValidPolicyNumber(POLICYNUMBER_REGEX.test(policy_number));
  }, [policy_number]);
 
  useEffect(() => {
    if (validPolicyNumber) setPolicyNumberErrorText(false)
    else if (policy_number.length !== 0)
      setPolicyNumberErrorText(true)
  }, [validPolicyNumber,policy_number.length]);
 
  const onInputChange = (e) => {
    let { name, value } = e.target;
    setLoginFormValue({ ...loginFormValue, [name]: value });
  };
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    // const Authorization = localStorage.getItem("Auth");
    const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
    !Authorization ? navigate("/signin") : handlePortalLogin();
  };
 
  const handlePortalLogin = async () => {
    await axios
      .post(`${process.env.REACT_APP_URL}verify-policy/`, { loginFormValue })
      .then((response) => {
        console.log("login res", response);
        if (response.data && response.data.company && response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("company", JSON.stringify(response.data.company));
          navigate("/claimcapture");
        }
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
      });
  };
 
  const canSave = [validPolicyNumber, validDateOfBirth].every(Boolean);
 
  const customTheme = (outerTheme) =>
    createTheme({
      palette: {
        mode: outerTheme.palette.mode,
      },
      components: {
        MuiTextField: {
          styleOverrides: {
            root: {
              "--TextField-brandBorderColor": "rgba(122,127,128,0.5)",
              "--TextField-brandBorderHoverColor": "black",
              "--TextField-brandBorderFocusedColor": "#0b70ff",
              "& label.Mui-focused": {
                color: "var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            notchedOutline: {
              borderColor: "var(--TextField-brandBorderColor)",
            },
            root: {
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderHoverColor)",
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: "var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
        MuiFilledInput: {
          styleOverrides: {
            root: {
              "&:before, &:after": {
                borderBottom: "2px solid var(--TextField-brandBorderColor)",
              },
              "&:hover:not(.Mui-disabled, .Mui-error):before": {
                borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
              },
              "&.Mui-focused:after": {
                borderBottom: "2px solid var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
        MuiInput: {
          styleOverrides: {
            root: {
              "&:before": {
                borderBottom: "2px solid var(--TextField-brandBorderColor)",
              },
              "&:hover:not(.Mui-disabled, .Mui-error):before": {
                borderBottom: "2px solid var(--TextField-brandBorderHoverColor)",
              },
              "&.Mui-focused:after": {
                borderBottom: "2px solid var(--TextField-brandBorderFocusedColor)",
              },
            },
          },
        },
      },
    });
 
  const outerTheme = useTheme();
 
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
    console.log("clicked policy number outside");
    if (validPolicyNumber || policy_number.length === 0)
      setPolicyNumberErrorText(false);
    else if (policy_number.length !== 0) setPolicyNumberErrorText(true);
  };
 
  const [showSideScrollCard, setShowSideScrollCard] = useState(false);
 
  // Show the side scroll card when the component mounts
  useEffect(() => {
    setShowSideScrollCard(true);
  }, []);
 
  const [items, ] = useState([
    "Streamlined SmartClaim",
    "Efficient claim submission process",
    "User-friendly and intuitive interface",
  ]);
 
  const [currentIndex, setCurrentIndex] = useState(0);
 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 1000); // Delay of 1 second between each item
 
    return () => clearInterval(interval);
  }, [items]);
 
  return (
    <>
      <Header />
<h1 style={{display:"block", marginTop:"110px",textAlign:'center'} }className='Nasaliza fnolportal' >SmartClaim</h1>
      <Box className="loginmainbox" >
        <Grid className="login-left-container">
          <Grid className="login-left-box">
            <Grid>
              <Typography className="login-left-title Nasaliza">
                Experience a Seamless Claim Filing Process with Our SmartClaim
              </Typography>
              <Typography className="login-left-para">
                Experience the convenience of reporting a new claim through our
                First Notice of Loss (FNOL) portal. Our user-friendly login system
                ensures a seamless process, allowing you to quickly and
                effortlessly submit your claim details.
              </Typography>
            </Grid>
            <Grid className="list-login">
              <ul>
                {items.map((item, index) => (
                  <li
                    key={index}
                    className={index === currentIndex ? "fade-in" : "hidden"}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Grid>
          </Grid>
        </Grid>
        <div className="app">
          <div className={`side-scroll-card ${showSideScrollCard ? "open" : ""}`}>
            <Grid container className="policynumberfiledstyle">
              <Grid item xs={12} sm={12} md={12} lg={12}>
                {errorMessage && (
                  <Typography>Error : {errorMessage}</Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <ThemeProvider theme={customTheme(outerTheme)}>
                  <TextField
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
                </ThemeProvider>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "1.5% 0%",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
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
                        <TextField {...params} fullWidth />
                      )}
                      openTo="year"
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  size="medium"
                  onClick={handleSubmit}
                  disabled={!canSave}
                  style={{ margin: "4% 0%" }}
                >
                  Verify
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      </Box>
      <Footer />
    </>
  );
}