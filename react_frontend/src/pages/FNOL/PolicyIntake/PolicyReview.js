import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Grid, Paper, Box, Snackbar, CircularProgress, IconButton, Tooltip } from '@mui/material';
import StyledButtonComponent from '../../../components/StyledButton';
import { NavigateNext as NavigateNextIcon, NavigateBefore as NavigateBeforeIcon } from "@mui/icons-material";
import { useMediaQuery, useTheme } from '@material-ui/core';
import axios from 'axios';
import MuiAlert from '@mui/material/Alert'; // For styled alerts
import EditIcon from '@mui/icons-material/Edit';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const userFriendlyLabels = {
  'selectedPolicy': 'Selected Policy Type',
  'policy_holder_ssn': 'Social Security Number',
  'policy_holder_FirstName': 'First Name',
  'policy_holder_LastName': 'Last Name',
  'policy_holder_mobile': 'Mobile Number',
  'policy_holder_email': 'Email Address',
  'policy_holder_occupation': 'Occupation',
  'policy_holder_street_number': 'Policy Holder Address',
  // ... dwellingInfo labels
  'residenceType': 'Residence Type',
  'constructionType': 'Construction Type',
  'otherconstructionType': 'Other Construction Type',
  'yearBuilt': 'Year Built',
  'numberOfStories': 'Number of Stories',
  'squareFootage': 'Square Footage',
  'heatingType': 'Heating Type',
  'otherHeatingType': 'Other Heating Type',
  'oilTankLocation': 'Oil Tank Location',
  'plumbing_installed_year': 'Year Plumbing System Installed/Last Upgraded',
  'wiring_installed_year': 'Year Wiring System Installed/Last Upgraded',
  'heating_installed_year': 'Year Heating System Installed/Last Upgraded',
  'roof_installed_year': 'Year Roof System Installed/Last Upgraded',
  'fireHydrantDistance': 'Fire Hydrant Distance',
  'fireStationDistance': 'Fire Station Distance',
  'alternateHeating': 'Alternate Heating?',
  'any_business_conducted_on_premises': 'Any Business Conducted On Premises?',
  'trampolineRamp': ' Trampoline or Skateboard/Bicycle Ramp?',
  'subjectToFlood': ' Subject to Flood, Wave Wash, Windstorm or Seacoast?',
  'floodInsuranceRequested': ' Flood Insurance Requested?',
  'rentedToOthers': 'Rented to Others?',
  'CoverageLocation_street_number': 'Property Address',
  'additionalInfo': 'Additional Information',
  // ... additionalInfo labels
  'currentInsuranceCarrier': 'Current Insurance Carrier',
  'currentPolicy': 'Current Policy Number',
  'effectiveDate': 'Current Policy Effective Date',
  'current_policy_premium': 'Current Policy Premium ($)',
  'anyLossLast4Years': 'Loss in Last 4 Years',
  'mortgageeName': 'Mortgagee Name',
  'mortgageeInstallmentAmount': 'Installment Amount ($)',
  'mortgageeStreetNumber': 'Mortgagee Address',
  // ... coverages labels
  'dwellingCoverage': 'Dwelling Coverage',
  'personalProperty': 'Personal Property Coverage',
  'personalLiabilityCoverage': 'Personal Liability Coverage',
  'medicalPayments': 'Medical Payments Coverage',
  'deductible': 'Deductible',
};


export default function PolicyReview({ formData, onBack, onSubmit, onGotoStep }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });
  const formatAddress1 = (data) => {
    const {
      'policy_holder_street_number': streetNumber,
      'policy_holder_street_name': streetName,
      'policy_holder_city': city,
      'policy_holder_state': state,
      'policy_holder_country': country,
      'policy_holder_zip': zip
    } = data;
    return `${streetNumber} ${streetName}, ${city}, ${state}, ${country}, ${zip}`;
  };

  const formatAddress2 = (data) => {
    const {
      'CoverageLocation_street_number': streetNumber,
      'CoverageLocation_street_name': streetName,
      'CoverageLocation_city': city,
      'CoverageLocation_state': state,
      'CoverageLocation_country': country,
      'CoverageLocation_zip': zip
    } = data;
    return `${streetNumber} ${streetName}, ${city}, ${state}, ${country}, ${zip}`;
  };

  const formatAddress3 = (data) => {
    const {
      'mortgageeStreetNumber': streetNumber,
      'mortgageeStreetName': streetName,
      'mortgageeCity': city,
      'mortgageeState': state,
      'mortgageeCountry': country,
      'mortgageeZip': zip,
    } = data;
    return `${streetNumber} ${streetName} ${city} ${state} ${country} ${zip}`;
  };

  const handleSubmitData = async () => {
    setIsLoading(true);
    if (formData.additionalInfo.mortgageeStreetNumber === "") {
      formData.additionalInfo.mortgageeStreetNumber = null;
    }
    // Adjust property_info based on otherConstructionType
    if (formData.dwellingInfo.otherconstructionType) {
      formData.dwellingInfo.constructionType =
        formData.dwellingInfo.otherconstructionType;
    }
    // Adjust property_info based on otherHeatingType
    if (formData.dwellingInfo.otherHeatingType) {
      formData.dwellingInfo.heatingType =
        formData.dwellingInfo.otherHeatingType;
    }
    const policyData = {
      PolicyInfo: formData.policyInfo,
      PropertyInfo: formData.dwellingInfo,
      AdditionalInfo: formData.additionalInfo,
      Coverages: formData.coverages,
    };
    const userEmail = localStorage.getItem("userName");
    const icIdList = ["IC001001", "IC001002", "IC001003", "IC001004", "IC001005"];
    const randomIndex = Math.floor(Math.random() * icIdList.length);
    const randomIcId = icIdList[randomIndex];
    policyData.PolicyInfo.policy_from_channel = "SmartQuote Portal";
    policyData.PolicyInfo.policy_associated_ic_id = randomIcId;
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('policy_data', JSON.stringify(policyData));
      formDataToSend.append('email', userEmail || '');
      const response = await axiosInstance.post('Policy/policy_creation/', formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.status === 201) {
        localStorage.setItem('PolicyIntakeAfterSubmitDetails', JSON.stringify(response.data));
        setSnackbarMessage('Quote created successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate('/quotesuccess', { state: { PolicyIntakeAfterSubmitDetails: JSON.stringify(response.data) } });
        }, 1500);
      } else {
        console.error('Error submitting data:', response.status);
        handleAPIError('Error creating policy. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      handleAPIError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAPIError = (message) => {
    setSnackbarMessage(message);
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
    setIsLoading(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const onEditStep = (stepIndex) => {
    onGotoStep(stepIndex);
  };

  return (
    <Grid
      container
      sx={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: isMobile ? 1 : 2,
        overflowX: 'hidden',
        margin: 'auto',
        height: '700px'
      }}
    >
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Grid item xs={12} md={8}>
        <Typography
          className='Nasaliza'
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: '#010066',
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          Policy Review
        </Typography>
        <Paper elevation={2} sx={{ padding: isMobile ? 1.5 : 1 }}>
          <Grid container spacing={isMobile ? 2 : 1} margin={'0px auto'}>
            {/* Policy Info */}
            <Grid item xs={12}>
              <Typography variant="h6" className='Nasaliza' sx={{ textAlign: 'left', color: '#010066', fontWeight: 400, margin: "1rem" }}>
                Policy Holder Info
                <Tooltip title="Edit" arrow placement="right">
                  <IconButton onClick={() => onEditStep(0)}>
                    <EditIcon style={{ color: "#010066" }} />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Grid>
            <Grid container spacing={isMobile ? 1 : 2} style={{ marginBottom: '7px', marginLeft: isMobile ? '0' : '100px' }}>
              {Object.entries(formData.policyInfo)
                .filter(([key, _]) => !['policy_holder_street_number', 'policy_holder_street_name', 'policy_holder_city', 'policy_holder_state', 'policy_holder_zip', 'policy_holder_country', 'policy_from_channel', 'policy_associated_ic_id'].includes(key))
                .map(([key, value]) => (
                  <React.Fragment key={key}>
                    {(key !== 'policy_holder_ssn') && (
                      <React.Fragment>
                        <Grid item xs={4} sm={4} md={4} sx={{ fontWeight: 550, fontSize: 13, textAlign: 'left' }}>
                          {userFriendlyLabels[key] || key.replace('policy_holder_', '').replace(/_/g, ' ')}
                        </Grid>
                        <Grid item xs={1} sm={1} md={1} sx={{ textAlign: "left", paddingRight: isMobile ? '0rem' : '5rem' }}>
                          :
                        </Grid>
                        <Grid item xs={5} sm={5} md={5} sx={{ textAlign: 'left' }}>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: 12,
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'normal',
                              flexWrap: 'wrap'
                            }}>
                            {value || (
                              <span style={{ color: 'red', fontWeight: 500, fontSize: 12 }}>
                                {(userFriendlyLabels[key] || key.replace('policy_holder_', '').replace(/_/g, ' ')) + ' required'}
                              </span>
                            )}
                          </Typography>
                        </Grid>
                      </React.Fragment>
                    )}
                    {/* Conditional Fields */}
                    {((key === 'policy_holder_ssn' && formData.policyInfo.policy_holder_ssn)) && (
                      <React.Fragment>
                        <Grid item xs={4} sm={4} md={4} sx={{ fontWeight: 550, fontSize: 13, textAlign: 'left' }}>
                          {userFriendlyLabels[key] || key.replace('policy_holder_', '').replace(/_/g, ' ')}
                        </Grid>
                        <Grid item xs={1} sm={1} md={1} sx={{ textAlign: "left", paddingRight: isMobile ? '0rem' : '5rem' }}>
                          :
                        </Grid>
                        <Grid item xs={5} sm={5} md={5} sx={{ textAlign: 'left' }}>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: 12,
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'normal',
                              flexWrap: 'wrap'
                            }}>
                            {value || (
                              <span style={{ color: 'red', fontWeight: 500, fontSize: 12 }}>
                                {(userFriendlyLabels[key] || key.replace('policy_holder_', '').replace(/_/g, ' ')) + ' required'}
                              </span>
                            )}
                          </Typography>
                        </Grid>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ))}
              <Grid item xs={4} sm={4} md={4} sx={{ fontWeight: 550, fontSize: 13, textAlign: 'left' }}>
                {userFriendlyLabels['policy_holder_street_number']}
              </Grid>
              <Grid item xs={1} sm={1} md={1} sx={{ textAlign: "left", paddingRight: isMobile ? '0rem' : '5rem' }}>
                :
              </Grid>
              <Grid item xs={5} sm={5} md={5} sx={{ textAlign: 'left' }}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: 12,
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                    flexWrap: 'wrap'
                  }}>
                  {formatAddress1(formData.policyInfo)}
                </Typography>
              </Grid>
            </Grid>
            {/* Dwelling Info */}
            <Grid item xs={12}>
              <Typography variant="h6" className='Nasaliza' sx={{ textAlign: 'left', color: '#010066', fontWeight: 400, margin: '1rem' }}>
                Property Information
                <Tooltip title="Edit" arrow placement="right">
                  <IconButton onClick={() => onEditStep(1)}>
                    <EditIcon style={{ color: "#010066" }} />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Grid>
            <Grid container spacing={isMobile ? 1 : 2} style={{ marginBottom: '7px', marginLeft: isMobile ? '0' : '100px' }}>
              {Object.entries(formData.dwellingInfo)
                .filter(([key]) =>
                  !['CoverageLocation_street_number', 'CoverageLocation_street_name', 'CoverageLocation_city', 'CoverageLocation_state', 'CoverageLocation_zip', 'CoverageLocation_country', 'isAddress_SameAs_PolicyHolder_Address'].includes(key)
                )
                .map(([key, value]) => (
                  <React.Fragment key={key}>
                    {/* Regular Fields */}
                    {(key !== 'otherconstructionType' && key !== 'otherHeatingType' && key !== 'additionalInfo' && key !== 'isAddress_SameAs_PolicyHolder_Address') && (
                      <React.Fragment>
                        <Grid item xs={4} sm={4} md={4} sx={{ fontWeight: 550, fontSize: 13, textAlign: 'left' }}>
                          {userFriendlyLabels[key] || key.replace('CoverageLocation_', '').replace(/_/g, ' ')}
                        </Grid>
                        <Grid item xs={1} sm={1} md={1} sx={{ textAlign: "left", paddingRight: isMobile ? '0rem' : '5rem' }}>
                          :
                        </Grid>
                        <Grid item xs={5} sm={5} md={5} sx={{ textAlign: 'left' }}>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: 12,
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'normal',
                              flexWrap: 'wrap'
                            }}>
                            {value || (
                              <span style={{ color: 'red', fontWeight: 500, fontSize: 12 }}>
                                {(userFriendlyLabels[key] || key.replace('CoverageLocation_', '').replace(/_/g, ' ')) + ' required'}
                              </span>
                            )}
                          </Typography>
                        </Grid>
                      </React.Fragment>
                    )}
                    {/* Conditional Fields */}
                    {((key === 'otherconstructionType' && formData.dwellingInfo.constructionType === 'other') ||
                      (key === 'otherHeatingType' && formData.dwellingInfo.heatingType === 'other') ||
                      (key === 'additionalInfo' && formData.dwellingInfo.additionalInfo)) && (
                        <React.Fragment>
                          <Grid item xs={4} sm={4} md={4} sx={{ fontWeight: 550, fontSize: 13, textAlign: 'left' }}>
                            {userFriendlyLabels[key] || key.replace('CoverageLocation_', '').replace(/_/g, ' ')}
                          </Grid>
                          <Grid item xs={1} sm={1} md={1} sx={{ textAlign: "left", paddingRight: isMobile ? '0rem' : '5rem' }}>
                            :
                          </Grid>
                          <Grid item xs={5} sm={5} md={5} sx={{ textAlign: 'left' }}>
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: 12,
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                whiteSpace: 'normal',
                                flexWrap: 'wrap'
                              }}>
                              {value || (
                                <span style={{ color: 'red', fontWeight: 500, fontSize: 12 }}>
                                  {(userFriendlyLabels[key] || key.replace('CoverageLocation_', '').replace(/_/g, ' ')) + ' required'}
                                </span>
                              )}
                            </Typography>
                          </Grid>
                        </React.Fragment>
                      )}
                  </React.Fragment>
                ))}
              <Grid item xs={4} sm={4} md={4} sx={{ fontWeight: 550, fontSize: 13, textAlign: 'left' }}>
                {userFriendlyLabels['CoverageLocation_street_number']}
              </Grid>
              <Grid item xs={1} sm={1} md={1} sx={{ textAlign: "left", paddingRight: isMobile ? '0rem' : '5rem' }}>
                :
              </Grid>
              <Grid item xs={5} sm={5} md={5} sx={{ textAlign: 'left' }}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: 12,
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                    flexWrap: 'wrap'
                  }}>
                  {formatAddress2(formData.dwellingInfo, 'CoverageLocation')}
                </Typography>
              </Grid>
            </Grid>
            {/* Additional Info */}
            <Grid item xs={12}>
              <Typography variant="h6" className='Nasaliza' sx={{ textAlign: 'left', color: '#010066', fontWeight: 400, margin: '1rem' }}>
                Prior Policy Info
                <Tooltip title="Edit" arrow placement="right">
                  <IconButton onClick={() => onEditStep(2)}>
                    <EditIcon style={{ color: "#010066" }} />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Grid>
            <Grid container spacing={isMobile ? 1 : 2} style={{ marginBottom: '7px', marginLeft: isMobile ? '0' : '100px' }}>
              {Object.entries(formData.additionalInfo)
                .filter(([key, _]) =>
                  !['mortgageeStreetNumber', 'mortgageeStreetName', 'mortgageeCity', 'mortgageeState', 'mortgageeZip', 'mortgageeCountry'].includes(key)
                )
                .map(([key, value]) => {
                  if (value !== "") {
                    return (
                      <React.Fragment key={key}>
                        <Grid item xs={4} sm={4} md={4} sx={{ fontWeight: 550, fontSize: 13, textAlign: isMobile ? 'center' : 'left' }}>
                          {userFriendlyLabels[key] || key.replace('mortgagee_', '').replace(/_/g, ' ')}
                        </Grid>
                        <Grid item xs={1} sm={1} md={1} sx={{ textAlign: "left", paddingRight: isMobile ? '0rem' : '5rem' }}>
                          :
                        </Grid>
                        <Grid item xs={5} sm={5} md={5} sx={{ textAlign: 'left' }}>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: 12,
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'normal',
                              flexWrap: 'wrap'
                            }}>
                            {value}
                          </Typography>
                        </Grid>
                      </React.Fragment>
                    );
                  } else {
                    return null;
                  }
                })}
              <Grid item xs={4} sm={4} md={4} sx={{ fontWeight: 550, fontSize: 13, textAlign: 'left' }}>
                {userFriendlyLabels['mortgageeStreetNumber']}
              </Grid>
              <Grid item xs={1} sm={1} md={1} sx={{ textAlign: "left", paddingRight: isMobile ? '0rem' : '5rem' }}>
                :
              </Grid>
              <Grid item xs={5} sm={5} md={5} sx={{ textAlign: 'left' }}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: 12,
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                    flexWrap: 'wrap'
                  }}>
                  {formatAddress3(formData.additionalInfo, 'Mortgagee Address')}
                </Typography>
              </Grid>
            </Grid>
            {/* Coverages */}
            <Grid item xs={12}>
              <Typography variant="h6" className='Nasaliza' sx={{ textAlign: 'left', color: '#010066', fontWeight: 400, margin: '1rem' }}>
                Coverages
                <Tooltip title="Edit" arrow placement="right">
                  <IconButton onClick={() => onEditStep(3)}>
                    <EditIcon style={{ color: "#010066" }} />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Grid>
            <Grid container spacing={isMobile ? 1 : 2} style={{ marginBottom: '7px', marginLeft: isMobile ? '0' : '100px' }}>
              {Object.entries(formData.coverages).map(([key, value]) => (
                <React.Fragment key={key}>
                  <Grid item xs={4} sm={4} md={4} sx={{ fontWeight: 550, fontSize: 13, textAlign: isMobile ? 'center' : 'left' }}>
                    {userFriendlyLabels[key] || key.replace(/_/g, ' ')}
                  </Grid>
                  <Grid item xs={1} sm={1} md={1} sx={{ textAlign: "left", paddingRight: isMobile ? '0rem' : '5rem' }}>
                    :
                  </Grid>
                  <Grid item xs={5} sm={5} md={5} sx={{ textAlign: 'left' }}>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: 12,
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        whiteSpace: 'normal',
                        flexWrap: 'wrap'
                      }}>
                      {value || (
                        <span style={{ color: 'red', fontWeight: 500, fontSize: 13 }}>
                          {(userFriendlyLabels[key] || key.replace(/_/g, ' ')) + ' required'}
                        </span>
                      )}
                    </Typography>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </Grid>
        </Paper>
        {/* "Back" and "Submit" Buttons */}
        <Box mt={3} display="flex" justifyContent="space-between">
          <Box>
            <StyledButtonComponent
              buttonWidth={100}
              variant="contained"
              onClick={onBack}
              startIcon={<NavigateBeforeIcon />}
            >
              Back
            </StyledButtonComponent>
          </Box>
          <Box>
            <StyledButtonComponent
              buttonWidth={isLoading ? 150 : 100}
              variant="contained"
              onClick={handleSubmitData}
              endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <NavigateNextIcon />}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </StyledButtonComponent>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
