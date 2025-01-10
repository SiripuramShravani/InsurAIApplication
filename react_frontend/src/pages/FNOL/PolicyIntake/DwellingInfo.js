import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  Paper,
  Typography,
  Box,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio, InputAdornment,
  Button,
  CircularProgress,
  IconButton,
  Snackbar, Tooltip,
  Alert
} from '@mui/material';
import DatePicker from "react-datepicker";
import SelectField from '../../Fields/SelectField';
import StyledButtonComponent from '../../../components/StyledButton';
import { NavigateNext as NavigateNextIcon, NavigateBefore as NavigateBeforeIcon } from "@mui/icons-material";
import { states } from "../../../data/states.js";
import "react-datepicker/dist/react-datepicker.css";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import '../PolicyIntake/Policy.css';
import axios from 'axios';
import {
  Edit as EditIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';

const DwellingInfo = ({ setStepName, setBulbStepValid, onNext, onBack, formData, showError,
  setShowError, setFormData, dwellingconfirmAddress, setDwellingConfirmAddress, dwellingeditAddress, setDwellingEditAddress, policyHolderAddress, enableReviewButton, onReviewClick, updateStepValidity, setValidateError, setCheckValidaionName, isStepAddressValid }) => {
  const [errors, setErrors] = useState({});
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [suggestedAddress, setSuggestedAddress] = useState(null);
  const [spittedAddress, setSpittedAddress] = useState(null);
  const [showAddress, setShowAddress] = useState(false);
  const [sameAsPolicyInfoAddress, setSameAsPolicyInfoAddress] = useState(formData.isAddress_SameAs_PolicyHolder_Address);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });

  useEffect(() => {
    const isValid = isFormValid();
    updateStepValidity(isValid);
    // eslint-disable-next-line
  }, [formData, errors, dwellingconfirmAddress]);

  const handleDwellingInfoChange = (event, date, fieldName) => {
    if (fieldName && date) {
      const year = date.getFullYear();
      if (year > new Date().getFullYear()) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [fieldName]: 'Year cannot be in the future.',
        }));
        return;
      }
      setFormData((prevFormData) => ({
        ...prevFormData,
        dwellingInfo: {
          ...prevFormData.dwellingInfo,
          [fieldName]: year,
        },
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: undefined,
      }));
    } else if (event) {
      const { name, value } = event.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        dwellingInfo: {
          ...prevFormData.dwellingInfo,
          [name]: value,
        },
      }));
      if (['CoverageLocation_street_number', 'CoverageLocation_street_name', 'CoverageLocation_zip'].includes(name)) {
        checkAddressValidity();
      }
      validateField(name, value);
    }
    const isValid = isFormValid();
     updateStepValidity(isValid);
  };

  // Function to check if address fields are filled
  const checkAddressValidity = () => {
    setIsAddressValid(
      formData.CoverageLocation_street_number &&
      formData.CoverageLocation_street_name &&
      formData.CoverageLocation_zip &&
      !errors.CoverageLocation_street_number &&
      !errors.CoverageLocation_street_name &&
      !errors.CoverageLocation_zip
    );
  };

  useEffect(() => {
    checkAddressValidity();
    // eslint-disable-next-line
  }, [formData]);

  // Function to handle address validation API call (update with your API logic)
  const handleValidateAddress = async () => {
    setIsValidatingAddress(true);
    try {
      const address = `${formData.CoverageLocation_street_number} ${formData.CoverageLocation_street_name}, ${formData.CoverageLocation_city}, ${formData.CoverageLocation_state} ${formData.CoverageLocation_zip} ${formData.CoverageLocation_country}`;
      const response = await axiosInstance.post('validate_address/', { address: address },);
      if (response.data && response.data.validated_address && response.data.splitted_address) {
        setSuggestedAddress(response.data.validated_address);
        setSpittedAddress(response.data.splitted_address);
        setSnackbarSeverity('info');
        setShowAddress(true);
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      dwellingInfo: {
        ...prevFormData.dwellingInfo,
        CoverageLocation_street_number: spittedAddress.street_number || '',
        CoverageLocation_street_name: spittedAddress.street_name || '',
        CoverageLocation_city: spittedAddress.city || '',
        CoverageLocation_state: spittedAddress.state || '',
        CoverageLocation_zip: spittedAddress.zip_code || '',
        CoverageLocation_country: spittedAddress.country || '',
      },
    }));
    // Clear the address field errors after confirming the address
    setErrors((prevErrors) => ({
      ...prevErrors,
      CoverageLocation_street_number: undefined,
      CoverageLocation_street_name: undefined,
      CoverageLocation_city: undefined,
      CoverageLocation_zip: undefined,
      CoverageLocation_country: undefined,
      CoverageLocation_state: undefined,
    }));
    setDwellingConfirmAddress(true);
    setDwellingEditAddress(false);
    setShowAddress(false);
  }
  const handleEditFields = () => {
    setSameAsPolicyInfoAddress(false);
    setDwellingConfirmAddress(false);
    setDwellingEditAddress(true);
  };
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      dwellingInfo: {
        ...prevFormData.dwellingInfo,
        isAddress_SameAs_PolicyHolder_Address: sameAsPolicyInfoAddress,
      },
    }));
    // eslint-disable-next-line
  }, [sameAsPolicyInfoAddress])


  const validateField = (name, value) => {
    const newErrors = { ...errors };
    let isValid = true;
    switch (name) {
      case 'residenceType':
      case 'constructionType':
      case 'heatingType':
      case 'alternateHeating':
      case 'any_business_conducted_on_premises':
      case 'trampolineRamp':
      case 'subjectToFlood':
      case 'floodInsuranceRequested':
      case 'rentedToOthers':
      case 'CoverageLocation_state':
      case 'CoverageLocation_country':
        if (value === "") {
          newErrors[name] = `${name.replace('CoverageLocation_', '').replace(/_/g, ' ')} is required.`;
          isValid = false;
        } else {
          delete newErrors[name];
        }
        break;
      case 'yearBuilt':
      case 'plumbing_installed_year':
      case 'wiring_installed_year':
      case 'heating_installed_year':
      case 'roof_installed_year':
        if (value > new Date().getFullYear()) {
          newErrors[name] = 'Year cannot be in the future.';
          isValid = false;
        } else {
          delete newErrors[name];
        }
        break;
      case 'numberOfStories':
        if (!/^\d+$/.test(value) || parseInt(value, 10) <= 0) {
          newErrors[name] = 'Please enter a valid number of stories (greater than 0).';
          isValid = false;
        } else {
          delete newErrors[name];
        }
        break;
      case 'squareFootage':
        if (!/^\d+$/.test(value) || parseInt(value, 10) <= 0) {
          newErrors[name] = 'Please enter a valid square footage (greater than 0).';
          isValid = false;
        } else {
          delete newErrors[name];
        }
        break;
      case 'fireHydrantDistance':
      case 'fireStationDistance':
        if (!/^\d+$/.test(value) || parseInt(value, 10) < 0) {
          newErrors[name] = 'Please enter a valid distance (cannot be negative).';
          isValid = false;
        } else {
          delete newErrors[name];
        }
        break;
      case 'CoverageLocation_street_number':
        if (!/^\d+$/.test(value)) {
          newErrors[name] = 'Please enter a valid street number.';
          isValid = false;
        } else {
          delete newErrors[name];
        }
        break;
      case 'CoverageLocation_street_name':
        if (value === '' || value === undefined) {
          newErrors[name] = 'Please enter a valid Street Name.';
          isValid = false;
        } else if (value.length > 40) {
          newErrors[name] = 'Street Name must be 40 characters or less.';
          isValid = false;
        } else {
          delete newErrors[name];
        }
        break;
      case 'CoverageLocation_city':
        if (!/^[A-Za-z\s]+$/.test(value)) {
          newErrors[name] = 'Please enter a valid city name (only letters and spaces).';
     
        } else {
          delete newErrors[name];
        }
        break;
      case 'CoverageLocation_zip':
        if (!/^\d{5}$/.test(value)) {
          newErrors[name] = 'Please enter a valid 5-digit ZIP code.';
          isValid = false;
        } else {
          delete newErrors[name];
        }
        break;
      case 'otherConstructionType':
        if (formData.constructionType === 'other' && value === "") {
          newErrors[name] = 'Specify Other Construction Type is required.';
          isValid = false;
        } else {
          delete newErrors[name];
        }
        break;
      case 'otherHeatingType':
        if (formData.heatingType === 'other' && value === "") {
          newErrors[name] = 'Specify Other Heating Type is required.';
          isValid = false;
        } else {
          delete newErrors[name];
        }
        break;
      default:
        delete newErrors[name];
    }
    setErrors(newErrors);
    setStepName("Property Information")
    setBulbStepValid(isValid)
    return newErrors[name];
  };
   const isFormValid = () => {
    const requiredFields = [
      'residenceType',
      'constructionType',
      'yearBuilt',
      'numberOfStories',
      'squareFootage',
      'heatingType',
      'plumbing_installed_year',
      'wiring_installed_year',
      'heating_installed_year',
      'roof_installed_year',
      'fireHydrantDistance',
      'fireStationDistance',
      'alternateHeating',
      'any_business_conducted_on_premises',
      'trampolineRamp',
      'subjectToFlood',
      'floodInsuranceRequested',
      'rentedToOthers',
      'CoverageLocation_street_number',
      'CoverageLocation_street_name',
      'CoverageLocation_city',
      'CoverageLocation_state',
      'CoverageLocation_country',
      'CoverageLocation_zip',
    ];

    for (const field of requiredFields) {
      if (
        (formData[field] === "" || errors[field]) &&
        (field !== 'otherConstructionType' || formData.constructionType === 'other') &&
        (field !== 'otherHeatingType' || formData.heatingType === 'other')
      ) {
         return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (isFormValid()) {
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Property Information'));
      onNext("dwellingInfo", formData);
      setBulbStepValid(false)
    } else {
      setValidateError(true)
      setBulbStepValid(true)
      setCheckValidaionName((prev) => [...prev, 'Property Information']);
    }
  };

  const onBackCheckValidation = () => {
    if (isFormValid()) {
      setShowError(false)
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Property Information'));
      onBack();
    } else {
      setValidateError(true)
      setShowError(true)
      setCheckValidaionName((prev) => [...prev, 'Property Information']);
      onBack();
    }
  }
  const onReviewCheckValidation = () => {
    setBulbStepValid(true)
    setStepName(" ")
    if (isFormValid() && dwellingconfirmAddress) {
      setShowError(false)
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Property Information'));
      onReviewClick();
    }
  }
  const CustomStylesForTextFileds = {
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

  // Error styles applied when there's an error
  const errorStyles = {
    '& .MuiInputBase-root': {
      borderBottom: '1px solid red',
    },
    '& .MuiInputLabel-root': {
      color: 'red',
    },
  };

  const renderYearField = (fieldName, label) => (
    <Grid item xs={12} sm={6} md={6}>
      <DatePicker
        selected={formData[fieldName] ? new Date(formData[fieldName], 0, 1) : null}
        onChange={(date) => handleDwellingInfoChange(null, date, fieldName)}
        dateFormat="yyyy"
        showYearPicker
        dropdownMode="select"
        placeholderText='yyyy'
        customInput={
          <TextField
            label={label}
            name={fieldName}
            required
            fullWidth
            value={formData[fieldName] ? formData[fieldName].toString() : ''}
            variant="standard"
            InputLabelProps={{ shrink: true }}
            error={!!errors[fieldName]}
            helperText={errors[fieldName]}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarTodayIcon />
                </InputAdornment>
              ),
            }}
            sx={formData[fieldName] === "" && showError ? errorStyles : CustomStylesForTextFileds}
          />
        }
      />
    </Grid>
  );

  const handleRadioChange = (event) => {
    setSameAsPolicyInfoAddress(event.target.value === 'yes');
    if (event.target.value === 'yes') {
      handleConfirmAddress(policyHolderAddress);
    }
  };

  return (
    <Grid
      container
      sx={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        overflowX: 'hidden',
        margin: 'auto',
      }}
    >
      <Grid item xs={12} md={8} textAlign='center'>
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
          Property Information
        </Typography>

        <Grid item xs={12}>
          <Paper elevation={2} sx={{ padding: 2, marginTop: 2 }}>
            <Grid container spacing={2}>
              {/* Row 1: Residence Type and Construction Type */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" sx={formData.residenceType === "" && showError ? errorStyles : CustomStylesForTextFileds}>
                  <SelectField
                    name="residenceType"
                    label="Residence Type"
                    required
                    options={[
                      { value: 'single_family', label: 'Single Family' },
                    ]}
                    value={formData.residenceType}
                    onChange={handleDwellingInfoChange}
                    error={!!errors.residenceType}
                    helperText={errors.residenceType ? <FormHelperText error>{errors.residenceType}</FormHelperText> : ""}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" sx={formData.constructionType === "" && showError ? errorStyles : CustomStylesForTextFileds}>
                  <SelectField
                    name="constructionType"
                    label="Construction Type"
                    required
                    options={[
                      { value: 'frame', label: 'Frame' },
                      { value: 'masonry', label: 'Masonry' },
                      { value: 'fire_resistive', label: 'Fire Resistive' },
                      { value: 'steel_frame', label: 'Steel Frame' },
                      { value: 'log_cabin', label: 'Log Cabin' },
                      { value: 'other', label: 'Other' },
                    ]}
                    value={formData.constructionType}
                    onChange={handleDwellingInfoChange}
                    error={!!errors.constructionType}
                    helperText={errors.constructionType ? <FormHelperText error>{errors.constructionType}</FormHelperText> : ""}
                  />
                </FormControl>
              </Grid>
              {formData.constructionType === 'other' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Specify Other Construction Type"
                    name="otherconstructionType"
                    value={formData.otherconstructionType}
                    onChange={handleDwellingInfoChange}
                    required
                    fullWidth
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    sx={formData.otherconstructionType === "" && showError ? errorStyles : CustomStylesForTextFileds}
                    error={!!errors.otherconstructionType}
                    helperText={errors.otherconstructionType}
                  />
                </Grid>
              )}
              {/* Row 2: Year Built, Number of Stories, Square Footage */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Number of Stories"
                  name="numberOfStories"
                  type="number"
                  value={formData.numberOfStories}
                  onChange={handleDwellingInfoChange}
                  required
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  sx={formData.numberOfStories === "" && showError ? errorStyles : CustomStylesForTextFileds}
                  error={!!errors.numberOfStories}
                  helperText={errors.numberOfStories}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Square Footage"
                  name="squareFootage"
                  type="number"
                  value={formData.squareFootage}
                  onChange={handleDwellingInfoChange}
                  required
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  sx={formData.squareFootage === "" && showError ? errorStyles : CustomStylesForTextFileds}
                  error={!!errors.squareFootage}
                  helperText={errors.squareFootage}
                />
              </Grid>
              {/* Row 3: Heating Type and Specify Other Heating Type  */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" sx={formData.heatingType === "" && showError ? errorStyles : CustomStylesForTextFileds}>
                  <SelectField
                    name="heatingType"
                    label="Heating Type"
                    required
                    options={[
                      { value: 'gas', label: 'Gas' },
                      { value: 'electric', label: 'Electric' },
                      { value: 'heat_pump', label: 'Heat Pump' },
                      { value: 'other', label: 'Other' },
                    ]}
                    value={formData.heatingType}
                    onChange={handleDwellingInfoChange}
                    error={!!errors.heatingType}
                    helperText={errors.heatingType ? <FormHelperText error>{errors.heatingType}</FormHelperText> : ""}
                  />
                </FormControl>
              </Grid>
              {formData.heatingType === 'other' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Specify Other Heating Type"
                    name="otherHeatingType"
                    value={formData.otherHeatingType}
                    onChange={handleDwellingInfoChange}
                    required
                    fullWidth
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    sx={formData.otherHeatingType === "" && showError ? errorStyles : CustomStylesForTextFileds}
                    error={!!errors.otherHeatingType}
                    helperText={errors.otherHeatingType}
                  />
                </Grid>
              )}
              {/* Row 5: plumbing_installed_year and wiring_installed_year Upgrade Dates */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Distance to Fire Hydrant (Feet)"
                  name="fireHydrantDistance"
                  type="number"
                  value={formData.fireHydrantDistance}
                  onChange={handleDwellingInfoChange}
                  required
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  sx={formData.fireHydrantDistance === "" && showError ? errorStyles : CustomStylesForTextFileds}
                  error={!!errors.fireHydrantDistance}
                  helperText={errors.fireHydrantDistance}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Distance to Fire Station (Miles)"
                  name="fireStationDistance"
                  type="number"
                  value={formData.fireStationDistance}
                  onChange={handleDwellingInfoChange}
                  required
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  sx={formData.fireStationDistance === "" && showError ? errorStyles : CustomStylesForTextFileds}
                  error={!!errors.fireStationDistance}
                  helperText={errors.fireStationDistance}
                />
              </Grid>
              {renderYearField('yearBuilt', 'Year Built *')}
            </Grid>
          </Paper>
          <Typography
            className='Nasaliza'
            variant="h6"
            sx={{
              fontWeight: 600,
              mt: 3, mb: 3,
              color: '#010066',
              textAlign: 'left',
            }}
          >
            Upgrades
          </Typography>
          <Paper elevation={2} sx={{ padding: 2, marginTop: 2 }}>
            <Grid container spacing={2}>
              {renderYearField('plumbing_installed_year', 'Year Plumbing System Installed/Last Upgraded *')}
              {renderYearField('wiring_installed_year', 'Year Wiring System Installed/Last Upgraded *')}
              {renderYearField('heating_installed_year', 'Year Heating System Installed/Last Upgraded *')}
              {renderYearField('roof_installed_year', 'Year Roof System Installed/Last Upgraded *')}
            </Grid>
          </Paper>
          <Typography
            className='Nasaliza'
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 3, mt: 3,
              color: '#010066',
              textAlign: 'left',
            }}
          >
            Additional Dwelling Questions
          </Typography>
          <Paper elevation={2} sx={{ padding: 2, marginTop: 2 }}>
            {/* Row 1: Alternate Heating */}
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={8} container textAlign={"left"}>
                <Typography variant="body2">
                  Alternate Heating? (Wood/Coal/Pellet Stoves, Space Heaters, etc.)
                  <span style={{ color: 'black' }}> *</span>
                </Typography>
              </Grid>
              <Grid item xs={4} container justifyContent="flex-end">
                <FormControl required>
                  <RadioGroup
                    row
                    name="alternateHeating"
                    value={formData.alternateHeating}
                    onChange={handleDwellingInfoChange}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">Yes</Typography>}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">No</Typography>}
                    />
                  </RadioGroup>
                  {errors.alternateHeating && (
                    <FormHelperText error>{errors.alternateHeating}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            {/* Row 2: Business Conducted on Premises */}
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={8} container textAlign={"left"}>
                <Typography variant="body2">
                  Any Business Conducted On Premises?<span style={{ color: 'black' }}> *</span>
                </Typography>
              </Grid>
              <Grid item xs={4} container justifyContent="flex-end">
                <FormControl required>
                  <RadioGroup
                    row
                    name="any_business_conducted_on_premises"
                    value={formData.any_business_conducted_on_premises}
                    onChange={handleDwellingInfoChange}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">Yes</Typography>}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">No</Typography>}
                    />                  </RadioGroup>
                  {errors.any_business_conducted_on_premises && (
                    <FormHelperText error>{errors.any_business_conducted_on_premises}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            {/* Row 3: Trampoline or Ramp */}
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={8} container textAlign={"left"}>
                <Typography variant="body2">
                  Trampoline or Skateboard/Bicycle Ramp?<span style={{ color: 'black' }}> *</span>
                </Typography>
              </Grid>
              <Grid item xs={4} container justifyContent="flex-end">
                <FormControl required>
                  <RadioGroup
                    row
                    name="trampolineRamp"
                    value={formData.trampolineRamp}
                    onChange={handleDwellingInfoChange}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">Yes</Typography>}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">No</Typography>}
                    />                  </RadioGroup>
                  {errors.trampolineRamp && (
                    <FormHelperText error>{errors.trampolineRamp}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            {/* Row 4: Subject to Flood */}
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={8} container textAlign={"left"}>
                <Typography variant="body2">
                  Subject to Flood, Wave Wash, Windstorm or Seacoast?<span style={{ color: 'black' }}> *</span>
                </Typography>
              </Grid>
              <Grid item xs={4} container justifyContent="flex-end">
                <FormControl required>
                  <RadioGroup
                    row
                    name="subjectToFlood"
                    value={formData.subjectToFlood}
                    onChange={handleDwellingInfoChange}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">Yes</Typography>}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">No</Typography>}
                    />                  </RadioGroup>
                  {errors.subjectToFlood && (
                    <FormHelperText error>{errors.subjectToFlood}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            {/* Row 5: Flood Insurance Requested */}
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={8} container textAlign={"left"}>
                <Typography variant="body2">
                  Flood Insurance Requested?<span style={{ color: 'black' }}> *</span>
                </Typography>
              </Grid>
              <Grid item xs={4} container justifyContent="flex-end">
                <FormControl required>
                  <RadioGroup
                    row
                    name="floodInsuranceRequested"
                    value={formData.floodInsuranceRequested}
                    onChange={handleDwellingInfoChange}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">Yes</Typography>}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">No</Typography>}
                    />                  </RadioGroup>
                  {errors.floodInsuranceRequested && (
                    <FormHelperText error>{errors.floodInsuranceRequested}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            {/* Row 6: Rented to Others */}
            <Grid item xs={12} container alignItems="center">
              <Grid item xs={8} container justifyContent="flex-start">
                <Typography variant="body2">
                  Rented to Others?<span style={{ color: 'black' }}> *</span>
                </Typography>
              </Grid>
              <Grid item xs={4} container justifyContent="flex-end">
                <FormControl required>
                  <RadioGroup
                    row
                    name="rentedToOthers"
                    value={formData.rentedToOthers}
                    onChange={handleDwellingInfoChange}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">Yes</Typography>}
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio size="small" />}
                      label={<Typography variant="body2">No</Typography>}
                    />
                  </RadioGroup>
                  {errors.rentedToOthers && (
                    <FormHelperText error>{errors.rentedToOthers}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
          <Grid item xs={12} md={12} textAlign="center">
            {/* Left side: Coverage Location and Same as Policy Holder Address */}
            <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
              <Typography
                className='Nasaliza'
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#010066',
                  textAlign: 'left',
                }}
              >
                Coverage Location
              </Typography>
            </Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: -1 }}>
              <Typography sx={{ fontSize: '0.7rem', mr: 2 }}>
                Same as Policy Holder Address
              </Typography>
              <FormControl required>
                <RadioGroup
                  row
                  value={sameAsPolicyInfoAddress ? 'yes' : 'no'}
                  onChange={handleRadioChange}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio size="small" />}
                    label={<Typography sx={{ fontSize: '0.7rem' }}>Yes</Typography>}
                    disabled={sameAsPolicyInfoAddress}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio size="small" />}
                    label={<Typography sx={{ fontSize: '0.7rem' }}>No</Typography>}
                    disabled={sameAsPolicyInfoAddress}
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            {/* Coverage Location Section */}
            <Paper elevation={2} sx={{ padding: 2 }}>
              <Grid container spacing={2}>
                {/* Section for the Address Confirmation */}
                <Grid item xs={12} sm={9} sx={{ mb: 2 }}>
                  {showAddress && suggestedAddress && (
                    <Typography variant="body2">
                      Below is the Validated Address, Click to use it &nbsp;&nbsp;
                      <Button
                        size="small"
                        sx={{
                          color: '#0B70FF',
                          fontWeight: 'bold',
                          border: '1px solid #0B70FF',
                          padding: '2px 8px',
                          fontSize: '0.75rem',
                          borderRadius: '4px',
                          minWidth: 'auto',
                          textTransform: 'none',
                        }}
                        onClick={() => handleConfirmAddress(spittedAddress)}
                      >
                        Yes
                      </Button>
                    </Typography>
                  )}
                  {showAddress && suggestedAddress && (
                    <Typography
                      style={{ color: '#0B70FF', fontSize: '0.85rem', marginTop: "0.5rem" }}
                    >
                      "{suggestedAddress}"
                    </Typography>
                  )}
                </Grid>
                {/* Section for the Validate Button and Edit Icon */}
                <Grid item xs={12} sm={3}>
                  {!dwellingconfirmAddress ? (
                    <StyledButtonComponent
                      buttonWidth={90}
                      onClick={handleValidateAddress}
                      disabled={!isAddressValid || isValidatingAddress || dwellingconfirmAddress}
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
                      disabled={!dwellingconfirmAddress}
                      sx={{ color: '#010066' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
              <Grid container spacing={2} >
                {/* Row 1: Street Number and Street Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Street Number"
                    name="CoverageLocation_street_number"
                    value={formData.CoverageLocation_street_number}
                    onChange={handleDwellingInfoChange}
                    required
                    fullWidth
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    sx={formData.CoverageLocation_street_number === "" && showError ? errorStyles : CustomStylesForTextFileds}
                    error={!!errors.CoverageLocation_street_number}
                    helperText={errors.CoverageLocation_street_number}
                    disabled={dwellingconfirmAddress && !dwellingeditAddress}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Street Name"
                    name="CoverageLocation_street_name"
                    value={formData.CoverageLocation_street_name}
                    onChange={handleDwellingInfoChange}
                    required
                    fullWidth
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    sx={formData.CoverageLocation_street_name === "" && showError ? errorStyles : CustomStylesForTextFileds}
                    error={!!errors.CoverageLocation_street_name}
                    helperText={errors.CoverageLocation_street_name}
                    disabled={dwellingconfirmAddress && !dwellingeditAddress}
                  />
                </Grid>
                {/* Row 2: City and State */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    name="CoverageLocation_city"
                    value={formData.CoverageLocation_city}
                    onChange={handleDwellingInfoChange}
                    required
                    fullWidth
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    sx={formData.CoverageLocation_city === "" && showError ? errorStyles : CustomStylesForTextFileds}
                    error={!!errors.CoverageLocation_city}
                    helperText={errors.CoverageLocation_city}
                    disabled={dwellingconfirmAddress && !dwellingeditAddress}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" sx={formData.CoverageLocation_state === "" && showError ? errorStyles : CustomStylesForTextFileds}>
                    <SelectField
                      name="CoverageLocation_state"
                      label="State"
                      options={states.map((state) => ({
                        value: state.value,
                        label: `${state.select} (${state.value})`,
                      }))}
                      value={formData.CoverageLocation_state}
                      onChange={handleDwellingInfoChange}
                      disabled={dwellingconfirmAddress && !dwellingeditAddress}
                      error={!!errors.CoverageLocation_state}
                      helperText={errors.CoverageLocation_state ? <FormHelperText error>{errors.CoverageLocation_state}</FormHelperText> : ""}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined" sx={formData.CoverageLocation_country === "" && showError ? errorStyles : CustomStylesForTextFileds}>
                    <SelectField
                      name="CoverageLocation_country"
                      label="Country"
                      options={[{ value: 'USA', label: 'USA' }]}
                      value={formData.CoverageLocation_country}
                      onChange={handleDwellingInfoChange}
                      disabled={dwellingconfirmAddress && !dwellingeditAddress}
                      error={!!errors.CoverageLocation_country}
                      helperText={errors.CoverageLocation_country ? <FormHelperText error>{errors.CoverageLocation_country}</FormHelperText> : ""}
                    />
                  </FormControl>
                </Grid>
                {/* Row 3: Zip Code */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ZIP Code"
                    name={"CoverageLocation_zip"}
                    value={formData.CoverageLocation_zip}
                    onChange={handleDwellingInfoChange}
                    required
                    fullWidth
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    sx={formData.CoverageLocation_zip === "" && showError ? errorStyles : CustomStylesForTextFileds}
                    error={!!errors.CoverageLocation_zip}
                    helperText={errors.CoverageLocation_zip}
                    disabled={dwellingconfirmAddress && !dwellingeditAddress}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
                  <TextField
                    label="Additional Information"
                    name="additionalInfo"
                    multiline
                    rows={4}
                    value={formData.additionalInfo}
                    onChange={handleDwellingInfoChange}
                    fullWidth
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    sx={CustomStylesForTextFileds}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          {/* "Next" and "Back" Buttons */}
          <Box mt={3} display="flex" justifyContent={'space-between'}>
            <Box >
              <StyledButtonComponent
                buttonWidth={100}
                variant="contained"
                onClick={onBackCheckValidation}
                startIcon={<NavigateBeforeIcon />}
              >
                Back
              </StyledButtonComponent>
            </Box>
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
                disabled={!isFormValid() || !dwellingconfirmAddress}
              >
                Next
              </StyledButtonComponent>
            </Box>
          </Box>
        </Grid>
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

export default DwellingInfo;