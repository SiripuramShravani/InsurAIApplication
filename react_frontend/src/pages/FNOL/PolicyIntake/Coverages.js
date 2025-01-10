import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, FormControl, FormHelperText } from '@mui/material';
import SelectField from '../../Fields/SelectField';
import StyledButtonComponent from '../../../components/StyledButton';
import { NavigateNext as NavigateNextIcon, NavigateBefore as NavigateBeforeIcon } from "@mui/icons-material";


const Coverages = ({ setStepName, setBulbStepValid, onNext, onBack, setShowError, showError, formData, setFormData, enableReviewButton, onReviewClick, updateStepValidity, setValidateError, setCheckValidaionName }) => {
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const isValid = isFormValid();
    updateStepValidity(isValid);
    // eslint-disable-next-line
  }, [formData, errors]);

  const handleCoveragesChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      coverages: {
        ...prevFormData.coverages,
        [name]: value,
      },
    }));
    validateField(name, value);
    const isValid = isFormValid();
    setStepName("Coverages")
    setBulbStepValid(isValid)
     updateStepValidity(isValid);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    if (value === "") {
      newErrors[name] = 'This field is required';
    } else {
      delete newErrors[name];
    }
    setErrors(newErrors);
    return newErrors[name];
  };

  const isFormValid = () => {
    const requiredFields = [
      'dwellingCoverage',
      'personalLiabilityCoverage',
      'personalProperty',
      'deductible',
      'medicalPayments',
    ];
    for (const field of requiredFields) {
      if (formData[field] === "" || errors[field]) {
         return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (isFormValid()) {
      onNext("coverages", formData);
      setBulbStepValid(false)
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Coverages'));
    } else {
      setCheckValidaionName((prev) => [...prev, 'Coverages']);
      setBulbStepValid(true)
    }
  };
  const onBackCheckValidation = () => {
    if (isFormValid()) {
      onBack();
      setValidateError(false)
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Coverages'));
    } else {
      setValidateError(true)
      setCheckValidaionName((prev) => [...prev, 'Coverages']);
      onBack();
    }
  }
  const onReviewCheckValidation = () => {
    setBulbStepValid(true)
    setStepName(" ")
    if (isFormValid()) {
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Coverages'));
      onReviewClick();
    }
  }
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
          Coverage Details
        </Typography>
        <Paper elevation={2} sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <SelectField
                  name="dwellingCoverage"
                  label="Dwelling Coverage"
                  options={[
                    { value: '100000', label: '$100,000' },
                    { value: '200000', label: '$200,000' },
                    { value: '500000', label: '$500,000' },
                    { value: '1000000', label: '$1,000,000' }
                  ]}
                  value={formData.dwellingCoverage}
                  onChange={handleCoveragesChange}
                  error={!!errors.dwellingCoverage}
                  helperText={errors.dwellingCoverage ? <FormHelperText error>{errors.dwellingCoverage}</FormHelperText> : ""}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <SelectField
                  name="personalLiabilityCoverage"
                  label="Personal Liability Coverage"
                  options={[
                    { value: '5000', label: '$5,000' },
                    { value: '10000', label: '$10,000' },
                    { value: '20000', label: '$20,000' },
                    { value: '50000', label: '$50,000' }
                  ]}
                  value={formData.personalLiabilityCoverage}
                  onChange={handleCoveragesChange}
                  error={!!errors.personalLiabilityCoverage}
                  helperText={errors.personalLiabilityCoverage ? <FormHelperText error>{errors.personalLiabilityCoverage}</FormHelperText> : ""}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <SelectField
                  name="personalProperty"
                  label="Personal Property"
                  options={[
                    { value: '5000', label: '$5,000' },
                    { value: '10000', label: '$10,000' },
                    { value: '20000', label: '$20,000' },
                    { value: '50000', label: '$50,000' }
                  ]}
                  value={formData.personalProperty}
                  onChange={handleCoveragesChange}
                  error={!!errors.personalProperty}
                  helperText={errors.personalProperty ? <FormHelperText error>{errors.personalProperty}</FormHelperText> : ""}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <SelectField
                  name="deductible"
                  label="Deductible"
                  options={[
                    { value: '500', label: '$500' },
                    { value: '1000', label: '$1,000' },
                    { value: '2000', label: '$2,000' },
                    { value: '5000', label: '$5,000' }
                  ]}
                  value={formData.deductible}
                  onChange={handleCoveragesChange}
                  error={!!errors.deductible}
                  helperText={errors.deductible ? <FormHelperText error>{errors.deductible}</FormHelperText> : ""}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth variant="outlined">
                <SelectField
                  name="medicalPayments"
                  label="Medical Payments to Others Coverage"
                  options={[
                    { value: '5000', label: '$5,000' },
                    { value: '10000', label: '$10,000' },
                    { value: '20000', label: '$20,000' },
                    { value: '50000', label: '$50,000' }
                  ]}
                  value={formData.medicalPayments}
                  onChange={handleCoveragesChange}
                  error={!!errors.medicalPayments}
                  helperText={errors.medicalPayments ? <FormHelperText error>{errors.medicalPayments}</FormHelperText> : ""}
                />
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
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
    </Grid>
  );
};

export default Coverages;