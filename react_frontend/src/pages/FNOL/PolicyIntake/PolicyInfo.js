import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  Paper,
  Typography,
  Box,
  FormHelperText,
  Snackbar,
  Alert,
  Button,
  InputAdornment,
  CircularProgress,
  IconButton, Tooltip, Dialog, DialogContent, DialogActions
} from '@mui/material';
import SelectField from '../../Fields/SelectField';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import StyledButtonComponent from '../../../components/StyledButton';
import { NavigateNext as NavigateNextIcon } from "@mui/icons-material";
import { states } from "../../../data/states.js";
import '../PolicyIntake/Policy.css';
import axios from 'axios';
import {
  Edit as EditIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';
import AddressValidation from '../../../assets/AddressValidation.jpg'

const PolicyInfo = ({ onNext, formData, setFormData, confirmAddress, setConfirmAddress, editAddress, setEditAddress, enableReviewButton, onReviewClick, updateStepValidity, setValidateError, setCheckValidaionName, isStepAddressValid }) => {
  const [errors, setErrors] = useState({});
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [suggestedAddress, setSuggestedAddress] = useState(null);
  const [spittedAddress, setSpittedAddress] = useState(null);
  const [showAddress, setShowAddress] = useState(false);
  const [isFirstSixFieldsFilled, setIsFirstSixFieldsFilled] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [locationApiCalled, setLocationApiCalled] = useState(false);
  const [locationDataState, setLocationDataState] = useState(null);
  const [open, setOpen] = useState(false);
  const [geoAddress, setGeoAddress] = useState(false)
   const handlePaperClick = () => {
    setShowMessage(true);
  };

  const handleMouseEnter = () => {
    setShowMessage(false);

  };

  const handleMouseLeave = () => {
    setShowMessage(false);
  };
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });

  useEffect(() => {
    const isValid = isFormValid();
    updateStepValidity(isValid);
    // eslint-disable-next-line
  }, [formData, errors, confirmAddress]);

  const handlePolicyInfoChange = (event, date, fieldName) => {
    if (fieldName) {
      const formattedDate = date ? date.toISOString().split("T")[0] : '';
      setFormData((prevFormData) => ({
        ...prevFormData,
        policyInfo: {
          ...prevFormData.policyInfo,
          [fieldName]: formattedDate,
        },
      }));
      validateField(fieldName, formattedDate);
    } else if (event) {
      const { name, value } = event.target;
      if (name === 'policy_holder_ssn') {
        const formattedSSN = formatSSN(value);
        setFormData((prevFormData) => ({
          ...prevFormData,
          policyInfo: {
            ...prevFormData.policyInfo,
            [name]: formattedSSN,
          },
        }));
        validateField(name, formattedSSN);
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          policyInfo: {
            ...prevFormData.policyInfo,
            [name]: value,
          },
        }));
        if (['policy_holder_street_number', 'policy_holder_street_name', 'policy_holder_zip'].includes(name)) {
          checkAddressValidity();
        }
        validateField(name, value);
      }
    }
    const isValid = isFormValid();
    updateStepValidity(isValid);
  };

  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const coordinates = {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            };
            if (!confirmAddress) {
              await makeLocationAPIRequest(coordinates);
            }
            setLocationApiCalled(true);
          },
          () => {
            console.error("Error getting user location, pls enable your location");
            setLocationApiCalled(true);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setLocationApiCalled(true);
      }
    }
    if (isFirstSixFieldsFilled && !locationApiCalled) {
      getLocation();
    }
    // eslint-disable-next-line    
  }, [locationApiCalled, confirmAddress, isFirstSixFieldsFilled]);

  const makeLocationAPIRequest = async (locationCoordinates) => {
    if (!locationCoordinates || !locationCoordinates.latitude || !locationCoordinates.longitude) {
      return;
    }
    await axiosInstance.get('get-location/', {
      params: {
        latitude: locationCoordinates.latitude,
        longitude: locationCoordinates.longitude
      }
    }).then(response => {
      if (response.data && response.data.address) {
        const formattedAddress = formatAddress(response.data.address);
        setSuggestedAddress(formattedAddress);

        setSpittedAddress(response.data.address);
        setShowAddress(true);
        setTimeout(() => {
          setOpen(true);
          setGeoAddress(true);
        }, 3000);
        setLocationDataState(formattedAddress);
      }
    }).catch(err => {
      console.error("No location found, pls try again", err)
    })
  };
  const formatAddress = (address) => {
    const addressComponents = [
      address.street_number,
      address.street_name,
      address.city,
      address.state,
      address.zipcode,
      address.country
    ].filter(component => component);
    return addressComponents.join(' ');
  };
  const checkAddressValidity = () => {
    setIsAddressValid(
      formData.policy_holder_street_number &&
      formData.policy_holder_street_name &&
      formData.policy_holder_zip &&
      !errors.policy_holder_street_number &&
      !errors.policy_holder_street_name &&
      !errors.policy_holder_zip
    );
  };
  const handleValidateAddress = async () => {
    setIsValidatingAddress(true);
    try {
      const address = `${formData.policy_holder_street_number} ${formData.policy_holder_street_name}, ${formData.policy_holder_city}, ${formData.policy_holder_state} ${formData.policy_holder_zip} ${formData.policy_holder_country}`;
      const response = await axiosInstance.post('validate_address/', { address: address },);
      if (response.data && response.data.validated_address && response.data.splitted_address) {
        setShowAddress(true);
        setSuggestedAddress(response.data.validated_address);
        setSpittedAddress(response.data.splitted_address);
        setSnackbarSeverity('info');
        setShowAddress(true);
        setOpen(true)
        setGeoAddress(false)
      }
    } catch (error) {
      console.error('Error during address validation:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage(
        error.response && error.response.data && error.response.data.error
          ? `${error.response.data.error}, Please check you address.`
          : 'An error occurred during address validation. Please try again later.'
      );
      setSnackbarOpen(true);
    } finally {
      setIsValidatingAddress(false);
    }
  };

  const handleConfirmAddress = (spittedAddress) => {
    setLocationDataState("");
    setOpen(false)
    setFormData((prevFormData) => ({
      ...prevFormData,
      policyInfo: {
        ...prevFormData.policyInfo,
        policy_holder_street_number: spittedAddress.street_number || '',
        policy_holder_street_name: spittedAddress.street_name || '',
        policy_holder_city: spittedAddress.city || '',
        policy_holder_state: spittedAddress.state || '',
        policy_holder_zip: spittedAddress.zip_code || '',
        policy_holder_country: spittedAddress.country || '',
      },
    }));
    const streetNumberError = validateField("policy_holder_street_number", spittedAddress.street_number);
    const streetNameError = validateField("policy_holder_street_name", spittedAddress.street_name);
    const lossCityError = validateField("policy_holder_city", spittedAddress.city);
    const lossStateError = validateField("policy_holder_state", spittedAddress.state);
    const lossZipError = validateField("policy_holder_zip", spittedAddress.zip_code);
    const lossCountryError = validateField("policy_holder_country", spittedAddress.country);
    setErrors((prevErrors) => ({
      ...prevErrors,
      policy_holder_street_number: streetNumberError,
      policy_holder_street_name: streetNameError,
      policy_holder_city: lossCityError,
      policy_holder_zip: lossStateError,
      policy_holder_country: lossZipError,
      policy_holder_state: lossCountryError,
    }));

    const hasErrors = !!(streetNumberError || streetNameError || lossCityError ||
      lossStateError || lossZipError || lossCountryError);
    if (!hasErrors) {
      setConfirmAddress(true);
      setEditAddress(false);
      setShowAddress(false);
    }
  }

  const handleEditFields = () => {
    setConfirmAddress(false);
    setEditAddress(true);
  };


  useEffect(() => {
    checkAddressValidity();
    // eslint-disable-next-line
  }, [formData]);

  const formatSSN = (value) => {
    const cleaned = ('' + value).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,2})(\d{0,4})$/);
    if (match) {
      return !match[2]
        ? match[1]
        : `${match[1] ? match[1] + '-' : ''}${match[2]
        }${match[3] ? '-' + match[3] : ''}`;
    }
    return value;
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'policy_holder_FirstName':
      case 'policy_holder_LastName':
        if (value.length > 20) {
          newErrors[
            name
          ] = 'Please enter a valid name (up to 20 characters, only letters and spaces).';
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          newErrors[name] = 'Please enter a valid name.';
        } else {
          delete newErrors[name];
        }
        break;
      case 'policy_holder_street_number':
        if (!/^\d+$/.test(value)) {
          newErrors[
            name
          ] = 'Please enter a valid street number (only integers).';
        } else {
          delete newErrors[name];
        }
        break;
      case 'policy_holder_street_name':
        if (value === '' || value === undefined) {
          newErrors[name] = 'Please enter a valid Street Name.';
        } else if (value.length > 40) {
          newErrors[name] = 'Street Name must be 40 characters or less.';
        } else {
          delete newErrors[name];
        }
        break;
      case 'policy_holder_city':
        if (!/^[A-Za-z\s]+$/.test(value)) {
          newErrors[
            name
          ] = 'Please enter a valid city name (only letters and spaces).';
        } else {
          delete newErrors[name];
        }
        break;
      case 'policy_holder_zip':
        if (!/^\d{5}$/.test(value)) {
          newErrors[name] = 'Please enter a valid 5-digit ZIP code.';
        } else {
          delete newErrors[name];
        }
        break;
      case 'policy_holder_mobile':
        if (!/^\d{10}$/.test(value)) {
          newErrors[name] = 'Please enter a valid 10-digit mobile number.';
        } else {
          delete newErrors[name];
        }
        break;
      case 'policy_holder_email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[name] = 'Please enter a valid email address.';
        } else {
          delete newErrors[name];
        }
        break;
      case 'policy_holder_occupation':
        const occupationRegex = /^[a-zA-Z\s\-.']+$/;
        if (value === '' || value === undefined) {
          newErrors[name] = 'Please enter a valid occupation.';
        } else if (!occupationRegex.test(value)) {
          newErrors[name] = 'Occupation can only contain letters, spaces, hyphens, periods, and apostrophes.';
        } else if (value.length > 40) {
          newErrors[name] = 'Occupation must be 20 characters or less.';
        } else {
          delete newErrors[name];
        }
        break;
      case 'policy_holder_ssn':
        if (!/^\d{3}-?\d{2}-?\d{4}$/.test(value)) {
          newErrors[
            name
          ] = 'Please enter a valid SSN (9 digits, e.g., 999-99-9999).';
        } else {
          delete newErrors[name];
        }
        break;
      case 'selectedPolicy':
      case 'policy_holder_state':
      case 'policy_holder_country':
        if (value === '' || value === null) {
          newErrors[name] = `${name.replace('policy_holder_', '')} is required.`;
        } else {
          delete newErrors[name];
        }
        break;
      default:
        delete newErrors[name];
    }
    setErrors(newErrors);
    return newErrors[name];
  };
  const isFormValid = () => {
    const requiredFields = [
      'selectedPolicy',
      'policy_holder_FirstName',
      'policy_holder_LastName',
      'policy_holder_mobile',
      'policy_holder_email',
      'policy_holder_occupation',
      'policy_holder_street_number',
      'policy_holder_street_name',
      'policy_holder_city',
      'policy_holder_state',
      'policy_holder_zip',
      'policy_holder_country',
    ];
    const firstSixFieldsValid = requiredFields.slice(0, 6).every((field) => {
      return formData[field] && !errors[field];
    });
    if (!isFirstSixFieldsFilled && firstSixFieldsValid) {
      setIsFirstSixFieldsFilled(true);
    }
    const allFieldsValid = requiredFields.every((field) => {
      return formData[field] && !errors[field];
    });
    return allFieldsValid;
  };
  const handleNext = () => {
    if (isFormValid()) {
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Policy Holder Info'));
      onNext("policyInfo", formData);
    } else {
      setCheckValidaionName((prev) => [...prev, 'Policy Holder Info']);
      setValidateError(true)
    }
  };
  const onReviewCheckValidation = () => {
    if (isFormValid() && confirmAddress) {
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Policy Holder Info'));
      onReviewClick();
    }
  }

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
      fontSize: '13px',
    },
  };
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <Grid
      container
      sx={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        mt: 2,
        overflowX: 'hidden',
        margin: 'auto',
      }}
    >
      <Grid item xs={12} md={8} textAlign="center">
        <Typography
          className="Nasaliza"
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2, mt: 2,
            color: '#010066',
            textAlign: 'left',
          }}
        >
          Policy Holder Info
        </Typography>
        <Paper elevation={2} sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} >
              <SelectField
                label="Select Policy Type"
                name="selectedPolicy"
                value={formData.selectedPolicy}
                onChange={handlePolicyInfoChange}
                options={[
                  { label: 'HO1 - Basic Coverage', value: 'HO1' },
                  { label: 'HO2 - Additional Perils', value: 'HO2' },
                  { label: 'HO3 - Homeowners Insurance', value: 'HO3' },
                  { label: 'HO6 - Condo Insurance', value: 'HO6' },
                ]}
                error={!!errors.selectedPolicy}
                helperText={errors.selectedPolicy ? <FormHelperText error>{errors.selectedPolicy}</FormHelperText> : ""}
              />
            </Grid>
            {/* SSN Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="SSN Number"
                name="policy_holder_ssn"
                value={formData.policy_holder_ssn}
                onChange={handlePolicyInfoChange}
                type={showPassword ? 'text' : 'password'}
                fullWidth
                variant="standard"
                InputLabelProps={{ shrink: true }}
                sx={CustomStylesForTextFileds}
                error={!!errors.policy_holder_ssn}
                helperText={errors.policy_holder_ssn}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="FirstName"
                name="policy_holder_FirstName"
                value={formData.policy_holder_FirstName}
                onChange={handlePolicyInfoChange}
                required
                fullWidth
                variant="standard"
                InputLabelProps={{ shrink: true }}
                sx={CustomStylesForTextFileds}
                error={!!errors.policy_holder_FirstName}
                helperText={errors.policy_holder_FirstName}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="LastName"
                name="policy_holder_LastName"
                value={formData.policy_holder_LastName}
                onChange={handlePolicyInfoChange}
                required
                fullWidth
                variant="standard"
                InputLabelProps={{ shrink: true }}
                sx={CustomStylesForTextFileds}
                error={!!errors.policy_holder_LastName}
                helperText={errors.policy_holder_LastName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mobile Number"
                name="policy_holder_mobile"
                value={formData.policy_holder_mobile}
                onChange={handlePolicyInfoChange}
                required
                fullWidth
                variant="standard"
                InputLabelProps={{ shrink: true }}
                sx={CustomStylesForTextFileds}
                error={!!errors.policy_holder_mobile}
                helperText={errors.policy_holder_mobile}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Address"
                name="policy_holder_email"
                value={formData.policy_holder_email}
                onChange={handlePolicyInfoChange}
                required
                fullWidth
                variant="standard"
                InputLabelProps={{ shrink: true }}
                sx={CustomStylesForTextFileds}
                error={!!errors.policy_holder_email}
                helperText={errors.policy_holder_email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Occupation"
                name="policy_holder_occupation"
                value={formData.policy_holder_occupation}
                onChange={handlePolicyInfoChange}
                required
                fullWidth
                variant="standard"
                InputLabelProps={{ shrink: true }}
                sx={CustomStylesForTextFileds}
                error={!!errors.policy_holder_occupation}
                helperText={errors.policy_holder_occupation}
              />
            </Grid>
          </Grid>
        </Paper>
        <Grid item xs={12} md={12} textAlign="center">
          <Grid item xs={12} md={12}  >
            <Typography
              className='Nasaliza'
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2, mt: 2,
                color: '#010066',
                textAlign: 'left',
              }}
            >
              Policy Holder Address
            </Typography>
          </Grid>
          <Paper elevation={2} sx={{ padding: 2 }}
            onClick={handlePaperClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave} >
            <Grid container spacing={2}>
              <Typography
                sx={{
                  textAlign: 'center',
                  color: 'red',
                  margin: 'auto',
                  justifyContent: 'center',
                  fontSize: '12px',
                }}
              >
                {showMessage && !isFirstSixFieldsFilled && (
                  <>Fill all mandatory(*) Policy Holder Info fields.</>
                )}
              </Typography>
              {/* Section for the Address Confirmation */}
              <Grid item xs={12} sm={9} sx={{ mb: 2 }}>
                {isFirstSixFieldsFilled && showAddress && suggestedAddress && (
                  <Dialog
                    open={open}
                    PaperProps={{
                      style: {
                        background: 'white',
                        boxShadow: '0 0 10px rgba(13, 0, 255, 0.5), 0 0 40px rgba(0, 217, 255, 0.3)',
                        color: '#ffffff',
                        border: '1px solid rgba(0, 85, 255, 0.2)',
                      },
                    }}
                  >
                    <DialogContent
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}
                    >
                      {/* Blue Curve with Gradient */}
                      <img
                        src={AddressValidation}
                        alt="Address Validation"
                        style={{
                          maxWidth: '40%',
                          height: 'auto',
                          flex: '1 1 40%',
                        }}
                      />
                      <div
                        style={{
                          textAlign: "center",
                          flex: '1 1 55%',
                        }}
                      >
                        {isFirstSixFieldsFilled && showAddress && suggestedAddress && (
                          <Typography
                            style={{
                              color: '#0B70FF',
                              fontSize: '1rem',
                              fontStyle: 'italic',
                              marginTop: '0.5rem',
                              fontWeight: 'bold',
                            }}
                          >
                            "{suggestedAddress}"
                          </Typography>
                        )}
                        <DialogActions style={{ justifyContent: 'center', padding: '1.5rem' }}>
                          <Button
                            size="medium"
                            sx={{
                              color: 'white',
                              fontWeight: 'bold',
                              border: '2px solid rgb(0, 47, 255)',
                              padding: '10px 25px',
                              fontSize: '0.8rem',
                              borderRadius: '30px',
                              textTransform: 'none',
                              transition: 'all 0.3s ease',
                              background: '#001660',
                              '&:hover': {
                                backgroundColor: 'white',
                                color: '#001660',
                                transform: 'scale(1.1)',
                              },
                            }}
                            onClick={() => {
                              handleConfirmAddress(spittedAddress);

                            }}
                          >
                            {geoAddress ? 'Confirm Address' : 'Confirm Address'}
                          </Button>
                          {geoAddress && (
                            <Button
                              onClick={() => setOpen(false)}
                              size="medium"
                              sx={{
                                color: '#FF4D4D',
                                fontWeight: 'bold',
                                border: '1px solid #FF4D4D',
                                padding: '10px 25px',
                                fontSize: '0.8rem',
                                borderRadius: '30px',
                                textTransform: 'none',
                                transition: 'all 0.3s ease',
                                background: 'rgba(255, 77, 77, 0.1)',
                                '&:hover': {
                                  backgroundColor: '#FF4D4D',
                                  color: '#0A0A0A',
                                  transform: 'scale(1.1)',
                                },
                              }}
                            >
                              Deny
                            </Button>
                          )}
                        </DialogActions>
                      </div>

                    </DialogContent>
                  </Dialog>
                )}
              </Grid>
              {/* Section for the Validate Button and Edit Icon */}
              <Grid item xs={12} sm={3}>
                {!confirmAddress ? (
                  <StyledButtonComponent
                    buttonWidth={100}
                    onClick={handleValidateAddress}
                    disabled={
                      !isAddressValid ||
                      isValidatingAddress ||
                      confirmAddress
                    }
                    disableColor={"#B6E3FF"}
                    size="small"
                  >
                    {isValidatingAddress ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Validate"
                    )}
                  </StyledButtonComponent>
                ) : (
                  <CheckCircleOutlineIcon color="success" />
                )}
                <Tooltip title="Edit" arrow placement="right">
                  <IconButton
                    onClick={handleEditFields}
                    disabled={!confirmAddress}
                    sx={{ color: '#010066' }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid container spacing={2} >
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Street Number"
                  name="policy_holder_street_number"
                  value={formData.policy_holder_street_number}
                  onChange={handlePolicyInfoChange}
                  required
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    ...CustomStylesForTextFileds,
                    pointerEvents: !isFirstSixFieldsFilled || (confirmAddress && !editAddress) ? 'none' : 'auto', // Disable pointer events
                  }}
                  error={!!errors.policy_holder_street_number}
                  helperText={errors.policy_holder_street_number ? <FormHelperText error>{errors.policy_holder_street_number}</FormHelperText> : ""}

                  disabled={!isFirstSixFieldsFilled || (confirmAddress && !editAddress)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Street Name"
                  name="policy_holder_street_name"
                  value={formData.policy_holder_street_name}
                  onChange={handlePolicyInfoChange}
                  required
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    ...CustomStylesForTextFileds,
                    pointerEvents: !isFirstSixFieldsFilled || (confirmAddress && !editAddress) ? 'none' : 'auto',
                  }}
                  error={!!errors.policy_holder_street_name}
                  helperText={errors.policy_holder_street_name}
                  disabled={!isFirstSixFieldsFilled || (confirmAddress && !editAddress)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  name="policy_holder_city"
                  value={formData.policy_holder_city}
                  onChange={handlePolicyInfoChange}
                  required
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    ...CustomStylesForTextFileds,
                    pointerEvents: !isFirstSixFieldsFilled || (confirmAddress && !editAddress) ? 'none' : 'auto', // Disable pointer events
                  }}
                  error={!!errors.policy_holder_city}
                  helperText={errors.policy_holder_city}
                  disabled={!isFirstSixFieldsFilled || (confirmAddress && !editAddress)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectField
                  label="State"
                  name="policy_holder_state"
                  value={formData.policy_holder_state}
                  onChange={handlePolicyInfoChange}
                  options={states.map((state) => ({
                    value: state.value,
                    label: `${state.select} (${state.value})`,
                  }))}
                  required
                  disabled={!isFirstSixFieldsFilled || (confirmAddress && !editAddress)}
                  error={!!errors.policy_holder_state}
                  helperText={
                    errors.policy_holder_state ? (
                      <FormHelperText error>
                        {errors.policy_holder_state}
                      </FormHelperText>
                    ) : (
                      ''
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectField
                  label="Country"
                  name="policy_holder_country"
                  value={formData.policy_holder_country}
                  onChange={handlePolicyInfoChange}
                  options={[{ value: 'USA', label: 'USA' }]}
                  required
                  error={!!errors.policy_holder_country}
                  disabled={!isFirstSixFieldsFilled || (confirmAddress && !editAddress)}
                  helperText={
                    errors.policy_holder_country ? (
                      <FormHelperText error>
                        {errors.policy_holder_country}
                      </FormHelperText>
                    ) : (
                      ''
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="ZIP"
                  name="policy_holder_zip"
                  value={formData.policy_holder_zip}
                  onChange={handlePolicyInfoChange}
                  required
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    ...CustomStylesForTextFileds,
                    pointerEvents: !isFirstSixFieldsFilled || (confirmAddress && !editAddress) ? 'none' : 'auto',
                  }}
                  error={!!errors.policy_holder_zip}
                  helperText={errors.policy_holder_zip}
                  disabled={!isFirstSixFieldsFilled || (confirmAddress && !editAddress)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Box sx={{ textAlign: 'right', mt: 2 }}>
          <StyledButtonComponent
            buttonWidth={100}
            variant="outlined"
            sx={{ mr: 2 }}
            disableColor={"#B6E3FF"}
            disabled={!enableReviewButton || isStepAddressValid}
            onClick={onReviewCheckValidation}
          >
            Review
          </StyledButtonComponent>
          <StyledButtonComponent
            buttonWidth={100}
            variant="outlined"
            onClick={handleNext}
            endIcon={<NavigateNextIcon />}
            disableColor={"#B6E3FF"}
            disabled={!isFormValid() || !confirmAddress}
          >
            Next
          </StyledButtonComponent>
        </Box>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={10000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default PolicyInfo;