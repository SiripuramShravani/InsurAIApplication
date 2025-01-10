import React, { useState, useEffect } from 'react';
import ClaimPortalHeader from './ClaimPortalHeader';
import Footer from '../../components/footer';
import { Grid, Snackbar, Alert, ThemeProvider, createTheme, CssBaseline, useMediaQuery, Box, Paper, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { Event, LocationOn, Person, Assignment } from "@mui/icons-material";
import axios from 'axios';
import Header from '../../components/header';
import ContactMailIcon from "@mui/icons-material/ContactMail";
import lightbulbicon from '../../assets/lightbulbicon.png';
import LossDetails from './LossDetails';
import LossLocation from './LossLocation';
import LossReportDetails from './LossReportDetails';
import NonInsuredDetails from './NonInsuredDetails';
import ClaimReview from './ClaimReview';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const sidebarItemsInsured = [
  { stepNumber: 1, label: "Loss Details", icon: <Event /> },
  { stepNumber: 2, label: "Loss Location", icon: <LocationOn /> },
  { stepNumber: 3, label: "Claim Reporter", icon: <Person /> },
  { stepNumber: 4, label: "Review Details", icon: <Assignment /> },
];

const sidebarItemsNonInsured = [
  { stepNumber: 1, label: "Loss Details", icon: <Event /> },
  { stepNumber: 2, label: "Loss Location", icon: <LocationOn /> },
  { stepNumber: 3, label: "Claim Reporter", icon: <Person /> },
  { stepNumber: 4, label: "Contact Details", icon: <ContactMailIcon /> },
  { stepNumber: 5, label: "Review Details", icon: <Assignment /> },
];

const initialFormData = {
  lossDetails: {
    loss_date_and_time: "",
    loss_type: "",
    loss_property: "",
    loss_damage_description: "",
    datePicker_date_and_time: ""
  },
  lossLocation: {
    street_number: "",
    street_name: "",
    loss_city: "",
    loss_state: "",
    loss_zip: "",
    loss_country: "",
  },
  lossReporterDetails: {
    police_fire_contacted: false,
    report_number: "",
    claim_witness_document_names: [],
    claim_witness_document_urls: [],
    claim_witness_document_name_url: [],
  },
  claimantContactDetails: {
    claimant_first_name: "",
    claimant_middle_name: "",
    claimant_last_name: "",
    claimant_email: "",
    claimant_phone: "",
    claimant_relationship_with_insured: "",
    claimant_other_relationship_with_insured: "",
    claimant_street_number: "",
    claimant_street_name: "",
    claimant_city: "",
    claimant_zip: "",
    claimant_state: "",
    claimant_country: "",
    claimant_proof_of_identity: "",
    claimant_proof_of_identity_number: "",
  },
};

const ClaimPortal = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [stepsCompleted, setStepsCompleted] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmAddress, setConfirmAddress] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [enableReviewButton, setEnableReviewButton] = useState(false);
  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
  const [showError, setShowError] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isInsured, setIsInsured] = useState("");
  const [user, setUser] = useState(null);
  const [localCompany, setLocalCompany] = useState(null);
  const [reFormatDateTime, setReFormatDateTime] = useState("");
  const [checked, setChecked] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [blubStepValid, setBulbStepValid] = useState(false)
  const [stepName, setStepName] = useState('')
  const [onclickBlud, setBulbdispaly] = useState(false)
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [checkValidationName, setCheckValidaionName] = useState([])
  const [validateError, setValidateError] = useState(false)
  const [stepValidity, setStepValidity] = useState({
    0: false,
    1: false,
    2: false,
    3: localStorage.getItem("isInsured") === "yes" ? true : false,
    4: false,
  });

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const userFromStorage = JSON.parse(localStorage.getItem("user"));
        setUser(userFromStorage)
        setLocalCompany(JSON.parse(localStorage.getItem("company")))
        const isInsuredFromStorage = localStorage.getItem("isInsured");
        const isInsuredBool = isInsuredFromStorage === "yes";
        setIsInsured(isInsuredBool);
        const userEmail = isInsuredBool === false ? localStorage.getItem("NonInsuredEmail") : JSON.parse(localStorage.getItem("user"))?.pol_email;
        if (userEmail) {
          const response = await axiosInstance.post('Administration/fetch_draft/', {
            user_email: userEmail,
            portal_type: "claim"
          });
          if (response.status === 200 && response.data) {
            const { draft_data, current_completed_step } = response.data;
            setFormData(draft_data);
            setActiveStep(current_completed_step);
            const completedSteps = Array.from({ length: current_completed_step }, (_, i) => i);
            setStepsCompleted(completedSteps);
            const dayjsDate = draft_data.lossDetails.datePicker_date_and_time ? dayjs(draft_data.lossDetails.datePicker_date_and_time) : null;
            setReFormatDateTime(dayjsDate);
            if (current_completed_step > 1) {
              setConfirmAddress(true);
            }
            if (current_completed_step > 2) {
              setChecked(draft_data.lossReporterDetails.police_fire_contacted)
            }
            if (isInsuredBool && current_completed_step >= 3) {
              setEnableReviewButton(true);
              const updatedStepValidity = {
                0: true,
                1: true,
                2: true,
                3: true
              };
              setStepValidity(updatedStepValidity);
              setEnableReviewButton(true)
            } else if (!isInsuredBool && current_completed_step >= 4) {
              setEnableReviewButton(true);
              const updatedStepValidity = {
                0: true,
                1: true,
                2: true,
                3: true,
                4: true
              };
              setStepValidity(updatedStepValidity);
              setEnableReviewButton(true)
            }
            showSnackbar('Your progress has been restored.', 'info');
          } else if (response.status === 204) {
            console.log("No draft found. Starting a fresh policy.");
          } else {
            console.error("Error loading draft:", response.data);
            showSnackbar("Error loading draft", "error");
          }
        }
      } catch (error) {
        console.error("Error during draft fetching:", error);
        showSnackbar("Error loading draft", "error");
      }
    };

    loadDraft();
  }, []);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleNext = (section, data) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [section]: data,
    }));
    if (!stepsCompleted.includes(activeStep)) {
      setStepsCompleted((prevStepsCompleted) => {
        let newStepsCompleted = [...prevStepsCompleted, activeStep];
        if (isInsured && activeStep === 2 && newStepsCompleted.length === 3) {
          newStepsCompleted.push(3);
        }
        else if (!isInsured && activeStep === 3 && newStepsCompleted.length === 4) {
          newStepsCompleted.push(4);
        }
        return newStepsCompleted;
      });
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setIsEditing(false);
    const updatedStepValidity = { ...stepValidity };
    const allStepsValid = isInsured
      ? (updatedStepValidity[0] &&
        updatedStepValidity[1] &&
        updatedStepValidity[2] &&
        confirmAddress)
      : (updatedStepValidity[0] &&
        updatedStepValidity[1] &&
        updatedStepValidity[2] &&
        updatedStepValidity[3] &&
        confirmAddress);
    setStepValidity(updatedStepValidity);
    setEnableReviewButton(allStepsValid);
    saveDraft();
  };

  const saveDraft = async () => {
    try {
      setBulbdispaly(false)
      setStepName(" ")
      const isInsuredFromStorage = localStorage.getItem("isInsured");
      const isInsuredBool = isInsuredFromStorage === "yes";
      const userEmail = isInsuredBool === false ? localStorage.getItem("NonInsuredEmail") : JSON.parse(localStorage.getItem("user"))?.pol_email;
      if (!userEmail) {
        return;
      }
      const formDataToSend = { ...formData };
      const response = await axiosInstance.post('Administration/save_or_update_draft/',
        {
          user_email: userEmail,
          form_data: formDataToSend,
          current_completed_step: activeStep + 1,
          portal_type: "claim",
        },
      );
      if (response.status === 201 || response.status === 200) {
        showSnackbar('Data saved successfully', 'success');
      } else if (response.status === 304) {
        showSnackbar('No changes to save', 'info');
      } else {
        console.error("Error saving draft:", response.data.error || response.data);
        showSnackbar('Error saving draft', 'error');
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      showSnackbar("Error saving draft", "error");
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setIsEditing(false);
  };

  const handleGotoStep = (step) => {
    (!blubStepValid) ? setBulbdispaly(true) : setBulbdispaly(false)
    if (step === (isInsured ? sidebarItemsInsured.length : sidebarItemsNonInsured.length) - 1) {
      let allStepsValid = true;
      for (let i = 0; i < step; i++) {
        if (!stepValidity[i]) {
          allStepsValid = false;
          break;
        }
      }
      if (allStepsValid && confirmAddress) {
        window.scrollTo(0, 0);
        setActiveStep(step);
        setIsEditing(step < activeStep);
      }
    }
    else if ((step < activeStep) || (step === 1 && stepValidity[activeStep])) {
      window.scrollTo(0, 0);
      setActiveStep(step);
      setIsEditing(step < activeStep);
    }
    else if ((step === activeStep + 1 && stepValidity[activeStep]) && confirmAddress) {
      window.scrollTo(0, 0);
      setActiveStep(step);
      setIsEditing(step < activeStep);
    }
  };
  const updateStepValidity = (step, isValid) => {
    setStepValidity(prevState => ({
      ...prevState,
      [step]: isValid,
    }));
  };

  useEffect(() => {
    const allStepsValid = !isInsured
      ? stepValidity[0] &&
      stepValidity[1] &&
      stepValidity[2] &&
      stepValidity[3] &&
      confirmAddress
      : stepValidity[0] &&
      stepValidity[1] &&
      stepValidity[2] &&
      confirmAddress;
    setEnableReviewButton(allStepsValid);
  }, [stepValidity, confirmAddress, isInsured]);

  return (
    <>
      <Header />
      {Authorization &&
        <>
          <ThemeProvider theme={theme}>
            <ClaimPortalHeader localCompany={localCompany} user={user} activeStep={activeStep} />
            <CssBaseline />
            <Grid container spacing={2} >
              <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Paper elevation={2} sx={{ padding: 5, width: isMobile ? "100%" : "350px", height: isMobile ? "auto" : "100" }}>
                  <Stepper
                    activeStep={activeStep}
                    orientation="vertical"
                    sx={{
                      "& .MuiStepConnector-root .MuiStepConnector-line": {
                        borderWidth: "2px",
                        height: isMobile ? 50 : 90,
                      },
                      "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
                        borderColor: localCompany?.ic_primary_color || "#010066",
                        height: isMobile ? 50 : 90,
                      },
                      "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
                        borderColor: localCompany?.ic_primary_color || "#010066",
                        height: isMobile ? 50 : 90,
                      },
                    }}
                  >
                    {(isInsured ? sidebarItemsInsured : sidebarItemsNonInsured).map((item, index) => (
                      <Step
                        key={item.label}
                        completed={index < activeStep}
                        onClick={() => handleGotoStep(index)}
                      >
                        <StepLabel
                          StepIconComponent={() => (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 35,
                                height: 35,
                                borderRadius: "50%",
                                bgcolor: stepsCompleted.includes(index) || index === activeStep ? (localCompany?.ic_primary_color || "#010066") : "#A9A9A9",
                                color: "white",
                              }}
                            >
                              {item.stepNumber}
                            </Box>
                          )}
                          sx={{
                            cursor: stepsCompleted.includes(index) ? 'pointer' : 'default',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span >{item.icon}</span>
                            <Typography
                              sx={{
                                cursor: stepsCompleted.includes(index) ? 'pointer' : 'default',
                              }}
                              className='Nasaliza'
                            >
                              {item.label}
                              {((onclickBlud && item.label === stepName && !blubStepValid) ||
                                (!onclickBlud && checkValidationName.includes(item.label))) && (
                                  <img
                                    src={lightbulbicon}
                                    alt="lightbulb"
                                    style={{ width: 25, height: 25, marginBottom: "0.8rem", marginLeft: "0.5rem" }}
                                  />
                                )}
                            </Typography>
                          </div>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Paper>
              </Grid>
              <Grid item xs={12} md={isInsured || activeStep !== 3 ? 1 : 0.5}></Grid>
              <Grid item xs={12} md={isInsured || activeStep !== 3 ? 5 : 8} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                <Box
                  sx={{
                    ml: { xs: 0, md: 3 },
                    mt: isSmallScreen ? 2 : 0,
                  }}
                >
                  {activeStep === 0 && (
                    <LossDetails
                      onNext={handleNext}
                      formData={formData.lossDetails}
                      setFormData={setFormData}
                      enableReviewButton={enableReviewButton}
                      onReviewClick={() => handleGotoStep(isInsured === true ? 3 : 4)}
                      updateStepValidity={(isValid) => updateStepValidity(0, isValid)}
                      setCheckValidaionName={setCheckValidaionName}
                      setValidateError={setValidateError}
                      localCompany={JSON.parse(localStorage.getItem("company"))}
                      user={JSON.parse(localStorage.getItem("user"))}
                      ReFormatDateTime={reFormatDateTime}
                      SetReFormatDateTime={setReFormatDateTime}
                    />
                  )}
                  {activeStep === 1 && (
                    <LossLocation
                      onNext={handleNext}
                      onBack={handleBack}
                      setBulbStepValid={setBulbStepValid}
                      setStepName={setStepName}
                      showError={showError}
                      setShowError={setShowError}
                      formData={formData.lossLocation}
                      setFormData={setFormData}
                      confirmAddress={confirmAddress}
                      setConfirmAddress={setConfirmAddress}
                      editAddress={editAddress}
                      setEditAddress={setEditAddress}
                      enableReviewButton={enableReviewButton}
                      onReviewClick={() => handleGotoStep(isInsured === true ? 3 : 4)}
                      updateStepValidity={(isValid) => updateStepValidity(1, isValid)}
                      setCheckValidaionName={setCheckValidaionName}
                      setValidateError={setValidateError}
                      isStepAddressValid={!confirmAddress}
                      localCompany={JSON.parse(localStorage.getItem("company"))}
                    />
                  )}
                  {activeStep === 2 && (
                    <LossReportDetails
                      onNext={handleNext}
                      onBack={handleBack}
                      setBulbStepValid={setBulbStepValid}
                      setStepName={setStepName}
                      showError={showError}
                      setShowError={setShowError}
                      formData={formData.lossReporterDetails}
                      setFormData={setFormData}
                      enableReviewButton={enableReviewButton}
                      onReviewClick={() => handleGotoStep(isInsured === true ? 3 : 4)}
                      updateStepValidity={(isValid) => updateStepValidity(2, isValid)}
                      setCheckValidaionName={setCheckValidaionName}
                      setValidateError={setValidateError}
                      localCompany={JSON.parse(localStorage.getItem("company"))}
                      checked={checked}
                      isMobile={isMobile}
                      setChecked={setChecked}
                      setSelectedFiles={setSelectedFiles}
                      selectedFiles={selectedFiles}
                      setEnableReviewButton={setEnableReviewButton}
                    />
                  )}
                  {activeStep === 3 && !isInsured && (
                    <NonInsuredDetails
                      onNext={handleNext}
                      onBack={handleBack}
                      showError={showError}
                      setShowError={setShowError}
                      formData={formData.claimantContactDetails}
                      setFormData={setFormData}
                      enableReviewButton={enableReviewButton}
                      onReviewClick={() => handleGotoStep(isInsured === true ? 3 : 4)}
                      updateStepValidity={(isValid) => updateStepValidity(3, isValid)}
                      setCheckValidaionName={setCheckValidaionName}
                      setValidateError={setValidateError}
                      localCompany={JSON.parse(localStorage.getItem("company"))}
                      isMobile={isMobile}
                      nonInsuredEmail={localStorage.getItem("NonInsuredEmail")}
                    />
                  )}
                  {activeStep === (isInsured ? 3 : 4) && !isEditing && (
                    <ClaimReview
                      onBack={handleBack}
                      formData={formData}
                      onGotoStep={handleGotoStep}
                      setCheckValidaionName={setCheckValidaionName}
                      setValidateError={setValidateError}
                      selectedFiles={selectedFiles}
                      setSelectedFiles={setSelectedFiles}
                      isMobile={isMobile}
                      localCompany={JSON.parse(localStorage.getItem("company"))}
                      isInsured={isInsured}
                      user={JSON.parse(localStorage.getItem("user"))}
                      setFormData={setFormData}
                      initialFormData={initialFormData}
                      nonInsuredEmail={localStorage.getItem("NonInsuredEmail")}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </ThemeProvider>
        </>
      }
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Footer />
    </>
  );
};

export default ClaimPortal
