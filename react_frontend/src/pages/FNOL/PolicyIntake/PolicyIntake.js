import React, { useEffect, useState } from "react";
import {
  CssBaseline,
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  Grid,
  Typography,
  Snackbar,
  Alert
} from "@mui/material";
import PopupMessage from "../../DemoPages/AccessDeniedPopMssg";
import {
  Person as PersonIcon,
  Apartment as ApartmentIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import PolicyInfo from "./PolicyInfo";
import DwellingInfo from "./DwellingInfo";
import AdditionalInfo from "./AdditionalInfo";
import Coverages from "./Coverages";
import PolicyReview from "./PolicyReview";
import PolicyHeader from "./PolicyHeader";
import lightbulbicon from '../../../assets/lightbulbicon.png';
import axios from "axios";
const sidebarItems = [
  { label: "Policy Holder Info", icon: <PersonIcon /> },
  { label: "Property Information", icon: <ApartmentIcon /> },
  { label: "Prior Policy Info", icon: <AssessmentIcon /> },
  { label: "Coverages", icon: <SecurityIcon /> },
  { label: "Policy Review", icon: <AssignmentIcon /> },
];

const initialFormData = {
  policyInfo: {
    selectedPolicy: "",
    policy_holder_FirstName: "",
    policy_holder_LastName: "",
    policy_holder_street_number: "",
    policy_holder_street_name: "",
    policy_holder_city: "",
    policy_holder_state: "",
    policy_holder_zip: "",
    policy_holder_country: "USA",
    policy_holder_mobile: "",
    policy_holder_email: "",
    policy_holder_occupation: "",
    policy_holder_ssn: "",
    policy_from_channel: "",
    policy_associated_ic_id: "",
  },
  dwellingInfo: {
    residenceType: "",
    constructionType: "",
    otherconstructionType: "",
    yearBuilt: "",
    numberOfStories: "",
    squareFootage: "",
    heatingType: "",
    otherHeatingType: "",
    plumbing_installed_year: "",
    wiring_installed_year: "",
    heating_installed_year: "",
    roof_installed_year: "",
    fireHydrantDistance: "",
    fireStationDistance: "",
    alternateHeating: "no",
    any_business_conducted_on_premises: "no",
    trampolineRamp: "no",
    subjectToFlood: "no",
    floodInsuranceRequested: "no",
    rentedToOthers: "no",
    CoverageLocation_street_number: "",
    CoverageLocation_street_name: "",
    CoverageLocation_city: "",
    CoverageLocation_state: "",
    CoverageLocation_zip: "",
    CoverageLocation_country: "USA",
    additionalInfo: "",
    isAddress_SameAs_PolicyHolder_Address: false,
  },
  additionalInfo: {
    currentInsuranceCarrier: "",
    currentPolicy: "",
    effectiveDate: "",
    current_policy_premium: "",
    anyLossLast4Years: "no",
    mortgageeName: "",
    mortgageeInstallmentAmount: "",
    mortgageeStreetNumber: "",
    mortgageeStreetName: "",
    mortgageeCity: "",
    mortgageeState: "",
    mortgageeCountry: "USA",
    mortgageeZip: "",
  },
  coverages: {
    dwellingCoverage: "",
    personalProperty: "",
    personalLiabilityCoverage: "",
    medicalPayments: "",
    deductible: "",
  },
};

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

const PolicyIntake = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [stepsCompleted, setStepsCompleted] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmAddress, setConfirmAddress] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [dwellingconfirmAddress, setDwellingConfirmAddress] = useState(false);
  const [dwellingeditAddress, setDwellingEditAddress] = useState(false);
  const [mortgageeConfirmAddress, setMortgageeConfirmAddress] = useState(false);
  const [mortgageeEditAddress, setMortgageeEditAddress] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [enableReviewButton, setEnableReviewButton] = useState(false);
  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
  const [policyHolderAddress, setPolicyHolderAddress] = useState({})
  const [validateError, setValidateError] = useState(false)
  const [checkValidationName, setCheckValidaionName] = useState([])
  const [showError, setShowError] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openPopup, setOpenPopup] = useState(false);
  const [blubStepValid, setBulbStepValid] = useState(false)
  const [stepName, setStepName] = useState('')
  const [onclickBlud, setBulbdispaly] = useState(false)
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });
  const [stepValidity, setStepValidity] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
  });
  useEffect(() => {
    const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
    const userAccess = Authorization ? JSON.parse(localStorage.getItem('userAccess')) : [];
    if (!userAccess.includes('policy_intake') || !Authorization) {
      setOpenPopup(true);
    }
  }, []);

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const userEmail = JSON.parse(localStorage.getItem("user"))?.pol_email;
        if (userEmail) {
          const response = await axiosInstance.post("Administration/fetch_draft/",
            { user_email: userEmail, portal_type: "policy" },
          );
          if (response.status === 200 && response.data) {
            const { draft_data, current_completed_step } = response.data;
            setFormData(draft_data);
            setActiveStep(current_completed_step);
            const completedSteps = Array.from({ length: current_completed_step }, (_, i) => i);
            setStepsCompleted(completedSteps);
            // Update step validity and address confirmation for each step
            for (let step = 0; step < current_completed_step; step++) {
              const section = getSectionForStep(step);
              if (section) {
                updateStepValidity(step, true);
                if (step === 0 && draft_data[section]) {
                  const policyAddressValid =
                    draft_data[section].policy_holder_street_number &&
                    draft_data[section].policy_holder_street_name &&
                    draft_data[section].policy_holder_city &&
                    draft_data[section].policy_holder_state &&
                    draft_data[section].policy_holder_zip &&
                    draft_data[section].policy_holder_country;
                  if (policyAddressValid) {
                    setConfirmAddress(true);
                    setPolicyHolderAddress({
                      street_number: draft_data[section].policy_holder_street_number,
                      street_name: draft_data[section].policy_holder_street_name,
                      city: draft_data[section].policy_holder_city,
                      state: draft_data[section].policy_holder_state,
                      zip_code: draft_data[section].policy_holder_zip,
                      country: draft_data[section].policy_holder_country,
                    });
                  }
                }
                else if (step === 1 && draft_data[section]) {
                  const dwellingAddressValid =
                    draft_data[section].CoverageLocation_street_number &&
                    draft_data[section].CoverageLocation_street_name &&
                    draft_data[section].CoverageLocation_city &&
                    draft_data[section].CoverageLocation_state &&
                    draft_data[section].CoverageLocation_zip &&
                    draft_data[section].CoverageLocation_country;
                  if (dwellingAddressValid) {
                    setDwellingConfirmAddress(true);
                  }
                }
              }
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
    // eslint-disable-next-line
  }, []);

  const getSectionForStep = (step) => {
    switch (step) {
      case 0:
        return "policyInfo";
      case 1:
        return "dwellingInfo";
      case 2:
        return "additionalInfo";
      case 3:
        return "coverages";
      default:
        return null;
    }
  };

  const handleNext = (section, data) => {
    if (section === "policyInfo") {
      setPolicyHolderAddress((prevAddress) => ({
        ...prevAddress,
        [`street_number`]: data.policy_holder_street_number,
        [`street_name`]: data.policy_holder_street_name,
        [`city`]: data.policy_holder_city,
        [`state`]: data.policy_holder_state,
        [`zip_code`]: data.policy_holder_zip,
        [`country`]: data.policy_holder_country,
      }));
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [section]: data,
    })
    );
    if (!stepsCompleted.includes(activeStep)) {
      setStepsCompleted((prevStepsCompleted) => {
        let newStepsCompleted = [...prevStepsCompleted, activeStep];
        if (activeStep === 3 && newStepsCompleted.length === 4) {
          newStepsCompleted.push(4);
        }
        return newStepsCompleted;
      });
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setIsEditing(false);
    const allStepsValid = Object.values(stepValidity).every((valid) => valid);
    setEnableReviewButton(allStepsValid);
    saveDraft();
  };

  const saveDraft = async () => {
    setBulbdispaly(false)
    setStepName(" ")
    try {
      const userEmail = JSON.parse(localStorage.getItem("user"))?.pol_email;
      if (!userEmail) {
        return;
      }
      const formDataToSend = { ...formData };
      const response = await axiosInstance.post('Administration/save_or_update_draft/',
        {
          user_email: userEmail,
          form_data: formDataToSend,
          current_completed_step: activeStep + 1,
          portal_type: "policy",
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

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setIsEditing(false);
  };

  const handleGotoStep = (step, item) => {
    (!blubStepValid) ? setBulbdispaly(true) : setBulbdispaly(false)
    if ((step < activeStep) || (step === 1 && stepValidity[activeStep] && confirmAddress)) {
      window.scrollTo(0, 0);
      setActiveStep(step);
      setIsEditing(step < activeStep)
    }
    else if (step === activeStep + 1 && stepValidity[activeStep] && (confirmAddress) && (dwellingconfirmAddress)) {
      window.scrollTo(0, 0);
      setActiveStep(step);
      setIsEditing(step < activeStep);
    }
    else if (step === sidebarItems.length - 1) {
      let allStepsValid = true;
      for (let i = 0; i < step; i++) {
        if (!stepValidity[i]) {
          allStepsValid = false;
          break;
        }
      }
      if (allStepsValid && confirmAddress && dwellingconfirmAddress) {
        window.scrollTo(0, 0);
        setActiveStep(step);
        setIsEditing(step < activeStep);
      }
    }
  };
  const updateStepValidity = (step, isValid) => {
    setStepValidity((prev) => ({
      ...prev,
      [step]: isValid,
    }));
    const allStepsValid = Object.values({ ...stepValidity, [step]: isValid }).every((valid) => valid);
    setEnableReviewButton(allStepsValid && confirmAddress && dwellingconfirmAddress);
  };

  return (
    <>
      <Header />
      {Authorization &&
        <>
          <ThemeProvider theme={theme}>
            <PolicyHeader />
            <CssBaseline />
            <Grid container spacing={2} >
              <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Paper elevation={2} sx={{ padding: 2, height: "auto" }}>
                  <Stepper
                    activeStep={activeStep}
                    orientation="vertical"
                    className='Nasaliza'
                    sx={{
                      "& .MuiStepConnector-root .MuiStepConnector-line": {
                        borderWidth: "2px",
                        height: isMobile ? 20 : 70,

                      },
                      "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
                        borderColor: "#010066",
                        height: isMobile ? 20 : 70,
                      },
                      "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
                        borderColor: "#010066",
                        height: isMobile ? 20 : 70,
                      },
                    }}
                  >
                    {sidebarItems.map((item, index) => (
                      <Step
                        key={item.label}
                        completed={index < activeStep}
                        onClick={() => handleGotoStep(index, item)}
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
                                bgcolor: "#010066",
                                color: "white",
                              }}
                              className='Nasaliza'
                            >
                              {item.icon}
                            </Box>
                          )}
                          sx={{
                            "& .MuiStepLabel-label": {
                              color: "text.secondary",
                              "&.Mui-active": {
                                color: "#000166",
                              },
                              "&.Mui-completed": {
                                color: "#000166",
                              },
                            },
                            "&:hover": {
                              boxShadow: stepsCompleted.includes(index)
                                ? "0px 4px 8px rgba(0, 0, 0, 0.2)"
                                : "none",
                            },
                          }}
                        >
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
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Paper>
              </Grid>
              {/* Main Content */}
              <Grid item xs={12} md={9}>
                <Box
                  sx={{
                    ml: { xs: 0, md: 3 },
                    height: "700px",
                    overflow: "auto",
                    mt: isSmallScreen ? 2 : 0,
                  }}
                >
                  {activeStep === 0 && (
                    <PolicyInfo
                      onNext={handleNext}
                      formData={formData.policyInfo}
                      setFormData={setFormData}
                      confirmAddress={confirmAddress}
                      setConfirmAddress={setConfirmAddress}
                      editAddress={editAddress}
                      setEditAddress={setEditAddress}
                      enableReviewButton={enableReviewButton}
                      onReviewClick={() => handleGotoStep(4)}
                      updateStepValidity={(isValid) => updateStepValidity(0, isValid)}
                      setCheckValidaionName={setCheckValidaionName}
                      setValidateError={setValidateError}
                      isStepAddressValid={!confirmAddress}
                    />
                  )}
                  {activeStep === 1 && (
                    <DwellingInfo
                      setBulbStepValid={setBulbStepValid}
                      setStepName={setStepName}
                      policyHolderAddress={policyHolderAddress}
                      onNext={handleNext}
                      onBack={handleBack}
                      showError={showError}
                      setShowError={setShowError}
                      formData={formData.dwellingInfo}
                      setFormData={setFormData}
                      dwellingconfirmAddress={dwellingconfirmAddress}
                      setDwellingConfirmAddress={setDwellingConfirmAddress}
                      dwellingeditAddress={dwellingeditAddress}
                      setDwellingEditAddress={setDwellingEditAddress}
                      enableReviewButton={enableReviewButton}
                      onReviewClick={() => handleGotoStep(4)}
                      updateStepValidity={(isValid) => updateStepValidity(1, isValid)}
                      setCheckValidaionName={setCheckValidaionName}
                      setValidateError={setValidateError}
                      isStepAddressValid={!dwellingconfirmAddress}
                    />
                  )}
                  {activeStep === 2 && (
                    <AdditionalInfo
                      setBulbStepValid={setBulbStepValid}
                      setStepName={setStepName}
                      onNext={handleNext}
                      onBack={handleBack}
                      showError={showError}
                      setShowError={setShowError}
                      formData={formData.additionalInfo}
                      setFormData={setFormData}
                      mortgageeConfirmAddress={mortgageeConfirmAddress}
                      setMortgageeConfirmAddress={setMortgageeConfirmAddress}
                      mortgageeEditAddress={mortgageeEditAddress}
                      setMortgageeEditAddress={setMortgageeEditAddress}
                      enableReviewButton={enableReviewButton}
                      onReviewClick={() => handleGotoStep(4)}
                      updateStepValidity={(isValid) => updateStepValidity(2, isValid)}
                      setCheckValidaionName={setCheckValidaionName}
                      setValidateError={setValidateError}
                    />
                  )}
                  {activeStep === 3 && (
                    <Coverages
                      setBulbStepValid={setBulbStepValid}
                      setStepName={setStepName}
                      onNext={handleNext}
                      onBack={handleBack}
                      showError={showError}
                      setShowError={setShowError}
                      formData={formData.coverages}
                      setFormData={setFormData}
                      enableReviewButton={enableReviewButton}
                      onReviewClick={() => handleGotoStep(4)}
                      updateStepValidity={(isValid) => updateStepValidity(3, isValid)}
                      setCheckValidaionName={setCheckValidaionName}
                      setValidateError={setValidateError}
                    />
                  )}
                  {activeStep === 4 && !isEditing && (
                    <PolicyReview
                      onBack={handleBack}
                      formData={formData}
                      onGotoStep={handleGotoStep}
                      setCheckValidaionName={setCheckValidaionName}
                      setValidateError={setValidateError}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </ThemeProvider>
        </>
      }
      <PopupMessage open={openPopup} onClose={() => setOpenPopup(false)} />
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

export default PolicyIntake;
