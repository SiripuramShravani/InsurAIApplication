import React, { useState, useEffect } from 'react';
import { Grid, TextField, FormControl, Paper, Typography, Box, InputAdornment, FormHelperText, RadioGroup, FormControlLabel, Radio, FormLabel, Snackbar, Alert } from '@mui/material';
import StyledButtonComponent from '../../../components/StyledButton';
import { NavigateNext as NavigateNextIcon, NavigateBefore as NavigateBeforeIcon } from "@mui/icons-material";
import DatePicker from "react-datepicker";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { states } from "../../../data/states.js";
import SelectField from '../../Fields/SelectField';

const AdditionalInfo = ({ setStepName, setBulbStepValid, onNext, setShowError, showError, onBack, formData, setFormData, enableReviewButton, onReviewClick, mortgageeConfirmAddress, setMortgageeConfirmAddress, mortgageeEditAddress, setMortgageeEditAddress, updateStepValidity, setValidateError, setCheckValidaionName }) => {
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage,] = useState('');
  const [snackbarSeverity,] = useState('success');

  useEffect(() => {
    const isValid = isFormValid();
    updateStepValidity(isValid);
    // eslint-disable-next-line
  }, [formData, errors]);

  const handleAdditionalInfoChange = (event, date, fieldName) => {
    if (fieldName) {
      // Ensure date is not null or undefined before calling toISOString
      const formattedDate = date ? date.toISOString().split("T")[0] : ''; // Format date as YYYY-MM-DD or set as an empty string
      setFormData((prevFormData) => ({
        ...prevFormData,
        additionalInfo: {
          ...prevFormData.additionalInfo,
          [fieldName]: formattedDate,
        },
      }));
      validateField(fieldName, formattedDate);
    } else if (event) {
      const { name, value } = event.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        additionalInfo: {
          ...prevFormData.additionalInfo,
          [name]: value,
        },
      }));
      validateField(name, value);
    }
    const isValid = isFormValid();
     updateStepValidity(isValid);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'currentInsuranceCarrier':
      case 'currentPolicy':
        if (value.length > 50) {
          newErrors[name] = 'Should be up to 50 characters.';
        } else {
          delete newErrors[name];
        }
        break;
      case 'effectiveDate':
        if (value && new Date(value).getTime() > Date.now()) {
          newErrors[name] = 'Date cannot be in the future.';
        } else {
          delete newErrors[name];
        }
        break;
      case 'current_policy_premium':
      case 'mortgageeInstallmentAmount':
        if (!/^\d+(\.\d{0,2})?$/.test(value) || parseFloat(value) <= 0) {
          newErrors[name] = 'Please enter a valid premium amount.';
        } else {
          delete newErrors[name];
        }
        break;
      case 'anyLossLast4Years':
        if (value === "") {
          newErrors[name] = `${name.replace('mortgagee', '').replace(/_/g, ' ')} is required.`;
        } else {
          delete newErrors[name];
        }
        break;
      case 'mortgageeName':
      case 'mortgageeCity':
        if (!/^[a-zA-Z\s]*$/.test(value) || value.trim() === '') {
          newErrors[name] = `Enter valid ${name} (Only letters and spaces are allowed)`;
        } else {
          delete newErrors[name];
        }
        break;
      case 'mortgageeStreetNumber':
        if (!/^\d+$/.test(value)) {
          newErrors[name] = 'Please enter a valid street number (only numbers allowed).';
        } else {
          delete newErrors[name];
        }
        break;

      case 'mortgageeStreetName':
        if (value === '' || value === undefined) {
          newErrors[name] = 'Please enter a valid Street Name.';
        } else if (value.length > 40) {
          newErrors[name] = 'Street Name must be 40 characters or less.';
        } else {
          delete newErrors[name];
        }
        break;
      case 'mortgageeZip':
        if (!/^\d{5}$/.test(value)) {
          newErrors[name] = 'ZIP code must be 5 digits.';
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
      'currentInsuranceCarrier',
      'currentPolicy',
      'effectiveDate',
      'current_policy_premium',
      'anyLossLast4Years',
      'mortgageeName',
      'mortgageeInstallmentAmount',
    ];

    for (const field of requiredFields) {
      if (formData[field] === "" || errors[field]) {
        setStepName("Prior Policy Info");
        setBulbStepValid(false);
        return false;
      }
    }
    setBulbStepValid(true);
    return true;
  };

  const handleNext = () => {
    if (isFormValid()) {
      onNext("additionalInfo", formData);
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Prior Policy Info'));
      setBulbStepValid(false)
    } else {
      setValidateError(true)
      setCheckValidaionName((prev) => [...prev, 'Prior Policy Info']);
      setBulbStepValid(true)
    }
  };
  const onBackCheckValidation = () => {
    if (isFormValid()) {
      onBack();
      setShowError(false)
      setValidateError(false)
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Prior Policy Info'));
    } else {
      setValidateError(true)
      setShowError(true)
      setCheckValidaionName((prev) => [...prev, 'Prior Policy Info']);

      onBack();
    }
  }
  const onReviewCheckValidation = () => {
    setBulbStepValid(true)
    setStepName(" ")
    if (isFormValid()) {
      setShowError(false)
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Prior Policy Info'));
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
  const errorStyles = {
    '& .MuiInputBase-root': {
      borderBottom: '1px solid red',
    },
    '& .MuiInputLabel-root': {
      color: 'red',
    },
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
        margin: '3rem auto',

      }}
    >
      <Grid item xs={12} md={8}>
        <Typography
          className='Nasaliza'
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: '#010066',
            textAlign: 'left',
          }}
        >
          Prior Policy Info
        </Typography>
        {/* Underwriting Information Section */}
        <Paper elevation={2} sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            {/* Row 1: Current Insurance Carrier and Policy Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Current Insurance Carrier"
                name="currentInsuranceCarrier"
                value={formData.currentInsuranceCarrier}
                onChange={handleAdditionalInfoChange}
                required
                fullWidth
                variant="standard"
                InputLabelProps={{ shrink: true }}
                sx={formData.currentInsuranceCarrier === "" && showError ? errorStyles : CustomStylesForTextFileds}
                error={!!errors.currentInsuranceCarrier}
                helperText={errors.currentInsuranceCarrier}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Current Policy Number"
                name="currentPolicy"
                value={formData.currentPolicy}
                onChange={handleAdditionalInfoChange}
                required
                fullWidth
                variant="standard"
                InputLabelProps={{ shrink: true }}
                sx={formData.currentPolicy === "" && showError ? errorStyles : CustomStylesForTextFileds}
                error={!!errors.currentPolicy}
                helperText={errors.currentPolicy}
              />
            </Grid>
            {/* Row 2: Effective Date and Current Policy Premium */}
            <Grid item xs={12} sm={6} md={6}>
              <DatePicker
                inputFormat="YYYY-MM-DD"
                selected={formData.effectiveDate ? new Date(formData.effectiveDate) : null}
                onChange={(date) => handleAdditionalInfoChange(null, date, 'effectiveDate')}
                dateFormat="yyyy/MM/dd"
                placeholderText="YYYY/MM/DD"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                customInput={
                  <TextField
                    label="Current Policy Effective Date *"
                    name="effectiveDate"
                    required
                    fullWidth
                    value={formData.effectiveDate}
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.effectiveDate}
                    helperText={errors.effectiveDate}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarTodayIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={formData.effectiveDate === "" && showError ? errorStyles : CustomStylesForTextFileds}
                  />
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Current Policy Premium ($)"
                name="current_policy_premium"
                type="number"
                value={formData.current_policy_premium}
                onChange={handleAdditionalInfoChange}
                required
                fullWidth
                variant="standard"
                InputLabelProps={{ shrink: true }}
                sx={formData.current_policy_premium === "" && showError ? errorStyles : CustomStylesForTextFileds}
                error={!!errors.current_policy_premium}
                helperText={errors.current_policy_premium}
              />
            </Grid>
            {/* Row 3: Any Losses in the past four (4) years? */}
            <Grid item xs={12}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <FormControl component="fieldset">
                    <FormLabel>
                      <Typography variant="body2">
                        Any Losses in the past four (4) years? *
                      </Typography>
                    </FormLabel>
                  </FormControl>
                </Grid>
                <Grid item>
                  <RadioGroup
                    row
                    name="anyLossLast4Years"
                    value={formData.anyLossLast4Years}
                    onChange={handleAdditionalInfoChange}
                    required
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
                  {errors.anyLossLast4Years && (
                    <FormHelperText error>{errors.anyLossLast4Years}</FormHelperText>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        {/* Mortgagee Information Section */}
        <Grid item xs={12} md={12} textAlign="center">
          <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              Mortgagee Information
            </Typography>
            {/* <Grid item>
              {!mortgageeConfirmAddress ? (
                <StyledButtonComponent
                  buttonWidth={100}
                  onClick={handleValidateAddress}
                  disabled={!isAddressValid || isValidatingAddress || mortgageeConfirmAddress}
                  disableColor={"#B6E3FF"}
                >
                  {isValidatingAddress ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Validate"
                  )}
                </StyledButtonComponent>
              ) : (
                <CheckCircleOutlineIcon color="success" /> // Display checkmark icon
              )}

              <IconButton
                onClick={handleEditFields}
                disabled={!mortgageeConfirmAddress}
                sx={{ color: '#010066' }} // Set color for the edit icon
              >
                <EditIcon />
              </IconButton>
            </Grid> */}
          </Grid>
          <Paper elevation={2} sx={{ padding: 2, marginTop: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  name="mortgageeName"
                  value={formData.mortgageeName}
                  onChange={handleAdditionalInfoChange}
                  fullWidth
                  required
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  sx={formData.mortgageeName === "" && showError ? errorStyles : CustomStylesForTextFileds}
                  error={!!errors.mortgageeName}
                  helperText={errors.mortgageeName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Installment Amount ($)"
                  name="mortgageeInstallmentAmount"
                  type="number"
                  value={formData.mortgageeInstallmentAmount}
                  onChange={handleAdditionalInfoChange}
                  required
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  sx={formData.mortgageeInstallmentAmount === "" && showError ? errorStyles : CustomStylesForTextFileds}
                  error={!!errors.mortgageeInstallmentAmount}
                  helperText={errors.mortgageeInstallmentAmount}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Street Number"
                  name="mortgageeStreetNumber"
                  value={formData.mortgageeStreetNumber || null}
                  onChange={handleAdditionalInfoChange}
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  sx={CustomStylesForTextFileds}
                  error={!!errors.mortgageeStreetNumber}
                  helperText={errors.mortgageeStreetNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Street Name"
                  name="mortgageeStreetName"
                  value={formData.mortgageeStreetName}
                  onChange={handleAdditionalInfoChange}
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  sx={CustomStylesForTextFileds}
                  error={!!errors.mortgageeStreetName}
                  helperText={errors.mortgageeStreetName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  name="mortgageeCity"
                  value={formData.mortgageeCity}
                  onChange={handleAdditionalInfoChange}
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  sx={CustomStylesForTextFileds}
                  error={!!errors.mortgageeCity}
                  helperText={errors.mortgageeCity}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <SelectField
                    value={formData.mortgageeState}
                    onChange={handleAdditionalInfoChange}
                    label="State"
                    name="mortgageeState"
                    options={states.map((state) => ({
                      value: state.value,
                      label: `${state.select} (${state.value})`,
                    }))}
                    labelId="select-mortgagee-state-label"
                    autoComplete="state"
                    required={"notrequired"}
                  />
                </FormControl>
              </Grid>
              {/* Country Field */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <SelectField
                    value={formData.mortgageeCountry}
                    onChange={handleAdditionalInfoChange}
                    label="Country"
                    name="mortgageeCountry"
                    options={[{ value: 'USA', label: 'USA' }]}
                    labelId="select-mortgagee-country-label"
                    autoComplete="country"
                    required={"notrequired"}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="ZIP"
                  name="mortgageeZip"
                  value={formData.mortgageeZip}
                  onChange={handleAdditionalInfoChange}
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  sx={CustomStylesForTextFileds}
                  error={!!errors.mortgageeZip}
                  helperText={errors.mortgageeZip}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* "Next" and "Back" Buttons */}
        <Box mt={3} display="flex" justifyContent="space-between">
          <Box>
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
              disabled={!enableReviewButton}
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
              disabled={!isFormValid()}
            >
              Next
            </StyledButtonComponent>
          </Box>
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

export default AdditionalInfo;