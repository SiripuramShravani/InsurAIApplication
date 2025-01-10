import React, { useState, useEffect } from 'react';
import {
  Grid, Typography, FormHelperText, Box, TextField, MenuItem, Select, FormControl,
  Accordion, AccordionSummary, AccordionDetails, InputLabel, OutlinedInput,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StyledButtonComponent from '../../components/StyledButton';
import { NavigateNext as NavigateNextIcon, NavigateBefore as NavigateBeforeIcon } from "@mui/icons-material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupIcon from "@mui/icons-material/Group";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import { states } from '../../data/states';

const NonInsuredDetails = ({ onNext, onBack, showError, setShowError, formData, setFormData, enableReviewButton, onReviewClick, updateStepValidity, setCheckValidaionName, setValidateError, localCompany, isMobile, nonInsuredEmail }) => {
  const [errors, setErrors] = useState({});
  const IdentityDetailsError = ((!!errors.claimant_proof_of_identity) || (!!errors.claimant_proof_of_identity_number) || (!!errors.claimant_social_security_number));
  const ContactDetailsError = (!!errors.claimant_phone);
  const hasRelationshipError = (!!errors.claimant_relationship_with_insured);
  const AddressDetailsError = ((errors.claimant_street_number) || (errors.claimant_street_name) || (errors.claimant_zip) || (errors.claimant_country) || (errors.claimant_state) || (errors.claimant_city));
  const PersonalDetailsError = ((errors.claimant_first_name) || (errors.claimant_last_name));

  useEffect(() => {
    const isValid = isFormValid();
    updateStepValidity(isValid);
    // eslint-disable-next-line    
  }, [formData, errors]);

  const handleNonInsuredDetailsChange = (event) => {
    if (event) {
      const { name, value } = event.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        claimantContactDetails: {
          ...prevFormData.claimantContactDetails,
          [name]: value,
        },
      }));
      validateField(name, value);
    }
    const isValid = isFormValid();
    updateStepValidity(3, isValid);
  }

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'claimant_first_name':
        if (value === '' || value === undefined || value === null) {
          newErrors[name] = 'Please enter a First Name.';
        } else if (value.length < 2 || value.length > 20) {
          newErrors[
            name
          ] = 'First name must be in between 2-20 characters';
        } else {
          delete newErrors[name];
        }
        break;
      case 'claimant_middle_name':
        if (value && (!value.length < 2 || !value.length > 20)) {
          newErrors[
            name
          ] = 'Middle name must be in between 2-20 characters';
        } else {
          delete newErrors[name];
        }
        break;
      case 'claimant_last_name':
        if (value === '' || value === undefined || value === null) {
          newErrors[name] = 'Please enter a Last Name.';
        } else if (value.length < 2 || value.length > 20) {
          newErrors[
            name
          ] = 'Last name must be in between 2-20 characters';
        } else {
          delete newErrors[name];
        }
        break;
      case 'claimant_street_number':
        if (value === '' || value === undefined || value === null) {
          newErrors[name] = 'Please enter a Street Number.';
        } else if (!/^\d+$/.test(value)) {
          newErrors[
            name
          ] = 'Please enter a valid street number (only integers).';
        } else {
          delete newErrors[name];
        }
        break;
      case 'claimant_street_name':
        if (value === '' || value === undefined || value === null) {
          newErrors[name] = 'Please enter a Street Name.';
        } else if (value.length > 40) {
          newErrors[name] = 'Street Name must be 40 characters or less.';
        } else {
          delete newErrors[name];
        }
        break;
      case 'claimant_city':
        if (value === '' || value === undefined || value === null) {
          newErrors[name] = 'Please enter a city Name.';
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          newErrors[
            name
          ] = 'Please enter a valid city name (only letters and spaces).';
        } else if (value.length < 2 || value.length > 50) {
          newErrors[
            name
          ] = 'City must be in between 2-50 characters';
        }
        else {
          delete newErrors[name];
        }
        break;
      case 'claimant_zip':
        if (value === '' || value === undefined || value === null) {
          newErrors[name] = 'Please enter a zip code.';
        } else if (!/^\d{5}$/.test(value)) {
          newErrors[name] = 'Please enter a valid 5-digit ZIP code.';
        } else {
          delete newErrors[name];
        }
        break;
      case 'claimant_country':
      case 'claimant_state':
      case 'claimant_proof_of_identity':
        if (value === '' || value === undefined || value === null) {
          newErrors[name] = 'Please select the value.';
        } else if (value === '' || value === null) {
          newErrors[name] = `${name.replace('claimant_', '')} is required.`;
        } else {
          delete newErrors[name];
        }
        break;
      case 'claimant_relationship_with_insured':
        if (value === '' || value === undefined || value === null) {
          newErrors[name] = 'Please select the value.';
        } else if (value === 'Other') {
          const otherValue = formData.claimant_other_relationship_with_insured;
          const otherIsValid = otherValue !== '';
          newErrors['claimant_other_relationship_with_insured'] = otherIsValid ? '' : 'Please specify other relationship.';
        } else {
          delete newErrors[name];
        }
        break;
      case 'claimant_phone':
        if (value === '' || value === undefined || value === null) {
          newErrors[name] = 'Please enter a phone number.';
        } else if (!value || !/^\d{10}$/.test(value)) {
          newErrors[
            name
          ] = 'Phone number must be 10 digits';
        } else {
          delete newErrors[name];
        }
        break;
      case 'claimant_other_relationship_with_insured':
      case 'claimant_proof_of_identity_number':
        if (value === '' || value === undefined || value === null) {
          newErrors[name] = 'Please enter the value.';
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
      'claimant_first_name',
      'claimant_last_name',
      'claimant_phone',
      'claimant_relationship_with_insured',
      'claimant_street_number',
      'claimant_street_name',
      'claimant_city',
      'claimant_zip',
      'claimant_state',
      'claimant_country',
      'claimant_proof_of_identity',
      'claimant_proof_of_identity_number',
    ];
    for (const field of requiredFields) {
      if (formData[field] === '' || errors[field]) {
        return false;
      }
    }
    return true;
  };

  const onBackCheckValidation = () => {
    if (isFormValid()) {
      setShowError(false)
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Contact Details'));
      onBack();
    } else {
      setValidateError(true)
      setShowError(true)
      setCheckValidaionName((prev) => [...prev, 'Contact Details']);
      onBack();
    }
  }
  const onReviewCheckValidation = () => {
    if (isFormValid()) {
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Contact Details'));
      onReviewClick();
    }
  }
  const handleNext = () => {
    if (isFormValid()) {
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Contact Details'));
      onNext("claimantContactDetails", formData);
    } else {
      console.error("Form has errors or missing required fields. Please correct them.");
      setCheckValidaionName((prev) => [...prev, 'Contact Details']);
      setValidateError(true)
    }
  };

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="center" p={isMobile ? 2 : 5} mt={2} style={{ width: '100%', maxWidth: '1200px', margin: 'auto' }}>
        <Grid container spacing={2}>
          <Grid textAlign={'left'} marginBottom={"2rem"}>
            <Typography className="Nasaliza" variant="h5" style={{ color: localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066" }} >
              Contact Details
            </Typography>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <Accordion elevation={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: PersonalDetailsError ? 'red' : (localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066") }} />} aria-controls="personal-details-content" id="personal-details-header">
                  <Typography color={localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066"} variant="h6" className="Nasaliza" fontSize="1.2rem"><AccountCircleIcon fontSize="medium" style={{ marginRight: '10px' }} />  Personal Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="First Name"
                        variant="outlined"
                        id="claimant_first_name"
                        name="claimant_first_name"
                        value={formData.claimant_first_name}
                        error={!!errors.claimant_first_name}
                        onChange={handleNonInsuredDetailsChange}
                        helperText={errors.claimant_first_name ? <FormHelperText error>{errors.claimant_first_name}</FormHelperText> : ""}
                        required
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                            '&:hover fieldset': {
                              border: 'none',
                            },
                            '&.Mui-focused fieldset': {
                              border: 'none',
                            },
                            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="Middle Name"
                        variant="outlined"
                        id="claimant_middle_name"
                        name="claimant_middle_name"
                        value={formData.claimant_middle_name}
                        onChange={handleNonInsuredDetailsChange}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                            '&:hover fieldset': {
                              border: 'none',
                            },
                            '&.Mui-focused fieldset': {
                              border: 'none',
                            },
                            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="Last Name"
                        variant="outlined"
                        id="claimant_last_name"
                        name="claimant_last_name"
                        value={formData.claimant_last_name}
                        error={!!errors.claimant_last_name}
                        onChange={handleNonInsuredDetailsChange}
                        helperText={errors.claimant_last_name ? <FormHelperText error>{errors.claimant_last_name}</FormHelperText> : ""}
                        required
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                            '&:hover fieldset': {
                              border: 'none',
                            },
                            '&.Mui-focused fieldset': {
                              border: 'none',
                            },
                            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <Accordion elevation={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: AddressDetailsError ? 'red' : (localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066") }} />} aria-controls="personal-details-content" id="personal-details-header">
                  <Typography color={localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066"} variant="h6" className="Nasaliza" fontSize="1.2rem"><LocationOnIcon fontSize="medium" style={{ marginRight: '10px' }} /> Address Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="Street Number"
                        variant="outlined"
                        id="claimant_street_number"
                        name="claimant_street_number"
                        value={formData.claimant_street_number}
                        error={!!errors.claimant_street_number}
                        onChange={handleNonInsuredDetailsChange}
                        helperText={errors.claimant_street_number ? <FormHelperText error>{errors.claimant_street_number}</FormHelperText> : ""}
                        required
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                            '&:hover fieldset': {
                              border: 'none',
                            },
                            '&.Mui-focused fieldset': {
                              border: 'none',
                            },
                            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="Street Name"
                        variant="outlined"
                        id="claimant_street_name"
                        name="claimant_street_name"
                        value={formData.claimant_street_name}
                        error={!!errors.claimant_street_name}
                        onChange={handleNonInsuredDetailsChange}
                        helperText={errors.claimant_street_name ? <FormHelperText error>{errors.claimant_street_name}</FormHelperText> : ""}
                        required
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                            '&:hover fieldset': {
                              border: 'none',
                            },
                            '&.Mui-focused fieldset': {
                              border: 'none',
                            },
                            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="City"
                        variant="outlined"
                        id="claimant_city"
                        name="claimant_city"
                        value={formData.claimant_city}
                        error={!!errors.claimant_city}
                        onChange={handleNonInsuredDetailsChange}
                        helperText={errors.claimant_city ? <FormHelperText error>{errors.claimant_city}</FormHelperText> : ""}
                        required
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                            '&:hover fieldset': {
                              border: 'none',
                            },
                            '&.Mui-focused fieldset': {
                              border: 'none',
                            },
                            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                          },
                        }}
                      />
                    </Grid>
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <FormControl required error={!!errors.claimant_state} fullWidth variant="standard">
                          <InputLabel id="state-label">State</InputLabel>
                          <Select
                            labelId="state-label"
                            id="claimant_state"
                            name="claimant_state"
                            value={formData.claimant_state}
                            onChange={handleNonInsuredDetailsChange}
                            helperText={errors.claimant_state ? <FormHelperText error>{errors.claimant_state}</FormHelperText> : ""}
                            label="State"
                            MenuProps={{
                              style: {
                                maxHeight: 280,
                              },
                            }}
                            sx={{
                              '&:before': {
                                borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                              },
                              '&:hover:not(.Mui-disabled):before': {
                                borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
                              },
                              '&.Mui-focused:after': {
                                borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
                              },
                              '& .MuiSelect-select': { textAlign: 'left' },
                            }}
                          >
                            {states.map((state) => (
                              <MenuItem key={state.select} value={state.select}>
                                {state.select}
                              </MenuItem>
                            ))}
                            <MenuItem value="null">null</MenuItem>
                          </Select>
                          {errors.claimant_state && <p style={{ color: "red", margin: 0 }}>{errors.claimant_state}</p>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="ZIP"
                          variant="outlined"
                          id="claimant_zip"
                          name="claimant_zip"
                          value={formData.claimant_zip}
                          error={!!errors.claimant_zip}
                          onChange={handleNonInsuredDetailsChange}
                          helperText={errors.claimant_zip ? <FormHelperText error>{errors.claimant_zip}</FormHelperText> : ""}
                          required
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                border: 'none',
                              },
                              '&:hover fieldset': {
                                border: 'none',
                              },
                              '&.Mui-focused fieldset': {
                                border: 'none',
                              },
                              borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <FormControl required error={!!errors.claimant_country} fullWidth variant="standard">
                          <InputLabel id="country-label">Country</InputLabel>
                          <Select
                            labelId="country-label"
                            id="claimant_country"
                            name="claimant_country"
                            value={formData.claimant_country}
                            onChange={handleNonInsuredDetailsChange}
                            helperText={errors.claimant_country ? <FormHelperText error>{errors.claimant_country}</FormHelperText> : ""}
                            label="Country"
                            sx={{
                              '&:before': {
                                borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                              },
                              '&:hover:not(.Mui-disabled):before': {
                                borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
                              },
                              '&.Mui-focused:after': {
                                borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
                              },
                              '& .MuiSelect-select': { textAlign: 'left' },
                            }}
                          >
                            <MenuItem value="USA">USA</MenuItem>
                          </Select>
                          {errors.claimant_country && (
                            <p style={{ color: "red", margin: 0 }}>{errors.claimant_country}</p>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <Accordion elevation={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: ContactDetailsError ? 'red' : (localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066") }} />} aria-controls="personal-details-content" id="personal-details-header">
                  <Typography color={localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066"} variant="h6" className="Nasaliza" fontSize="1.2rem"> <ContactPhoneIcon fontSize="medium" style={{ marginRight: '10px' }} /> Contact Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="Email Id"
                        variant="outlined"
                        id="claimant_email"
                        name="claimant_email"
                        value={nonInsuredEmail}
                        disabled
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                            '&:hover fieldset': {
                              border: 'none',
                            },
                            '&.Mui-focused fieldset': {
                              border: 'none',
                            },
                            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="Phone Number"
                        variant="outlined"
                        id="claimant_phone"
                        name="claimant_phone"
                        value={formData.claimant_phone}
                        error={!!errors.claimant_phone}
                        onChange={handleNonInsuredDetailsChange}
                        helperText={errors.claimant_phone ? <FormHelperText error>{errors.claimant_phone}</FormHelperText> : ""}
                        required
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                            '&:hover fieldset': {
                              border: 'none',
                            },
                            '&.Mui-focused fieldset': {
                              border: 'none',
                            },
                            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <Accordion elevation={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: hasRelationshipError ? 'red' : (localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066") }} />} aria-controls="personal-details-content" id="personal-details-header">
                  <Typography color={localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066"} variant="h6" className="Nasaliza" fontSize="1.2rem">
                    <GroupIcon fontSize="medium" style={{ marginRight: '10px' }} /> Relationship With Insured
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth variant="outlined" error={hasRelationshipError} required>
                        <InputLabel id="relationship-label">Relationship to Insured</InputLabel>
                        <Select
                          labelId="relationship-label"
                          id="claimant_relationship_with_insured"
                          name="claimant_relationship_with_insured"
                          value={formData.claimant_relationship_with_insured}
                          onChange={handleNonInsuredDetailsChange}
                          helperText={errors.claimant_relationship_with_insured ? <FormHelperText error>{errors.claimant_relationship_with_insured}</FormHelperText> : ""}
                          label="Relationship to Insured"
                          MenuProps={{
                            style: {
                              maxHeight: 255,
                            },
                          }}
                          input={<OutlinedInput label="Relationship to Insured" />}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                border: 'none',
                              },
                              '&:hover fieldset': {
                                border: 'none',
                              },
                              '&.Mui-focused fieldset': {
                                border: 'none',
                              },
                              borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                            },
                            '& .MuiSelect-select': {
                              textAlign: 'left',
                            },
                          }}
                        >
                          <MenuItem value="Spouse">Spouse</MenuItem>
                          <MenuItem value="Child">Child</MenuItem>
                          <MenuItem value="Parent">Parent</MenuItem>
                          <MenuItem value="Sibling">Sibling</MenuItem>
                          <MenuItem value="Friend">Friend</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                        {hasRelationshipError && (
                          <Typography variant="caption" color="error">
                            {errors.claimant_relationship_with_insured}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    {formData.claimant_relationship_with_insured === "Other" && (
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          label="Please specify"
                          variant="outlined"
                          id="claimant_other_relationship_with_insured"
                          name="claimant_other_relationship_with_insured"
                          value={formData.claimant_other_relationship_with_insured}
                          error={!!errors.claimant_other_relationship_with_insured}
                          onChange={handleNonInsuredDetailsChange}
                          helperText={errors.claimant_other_relationship_with_insured ? <FormHelperText error>{errors.claimant_other_relationship_with_insured}</FormHelperText> : ""}
                          required
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                border: 'none',
                              },
                              '&:hover fieldset': {
                                border: 'none',
                              },
                              '&.Mui-focused fieldset': {
                                border: 'none',
                              },
                              borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                            },
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <Accordion elevation={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon style={{ color: IdentityDetailsError ? 'red' : (localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066") }} />} aria-controls="personal-details-content" id="personal-details-header">
                  <Typography variant="h6" className="Nasaliza" fontSize="1.2rem"
                    color={localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066"}
                  >
                    <PersonIcon fontSize="medium" style={{ marginRight: '10px' }} /> Identity Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl required error={!!errors.claimant_proof_of_identity} fullWidth>
                        <InputLabel id="proof-of-identity-label">Proof of Identity</InputLabel>
                        <Select
                          labelId="proof-of-identity-label"
                          id="claimant_proof_of_identity"
                          name="claimant_proof_of_identity"
                          value={formData.claimant_proof_of_identity}
                          onChange={handleNonInsuredDetailsChange}
                          helperText={errors.claimant_proof_of_identity ? <FormHelperText error>{errors.claimant_proof_of_identity}</FormHelperText> : ""}
                          label="Proof of Identity"
                          input={<OutlinedInput label="Proof of Identity" />}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                border: 'none',
                              },
                              '&:hover fieldset': {
                                border: 'none',
                              },
                              '&.Mui-focused fieldset': {
                                border: 'none',
                              },
                              borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                            },
                            '& .MuiSelect-select': { textAlign: 'left' },
                          }}
                        >
                          <MenuItem value="Driver's License">Driver's License</MenuItem>
                          <MenuItem value="Passport">Passport</MenuItem>
                          <MenuItem value="Green Card">Green Card</MenuItem>
                          <MenuItem value="State Id">State Id</MenuItem>
                          <MenuItem value="Social Security Number (SSN)">Social Security Number (SSN)</MenuItem>
                        </Select>
                        {errors.claimant_proof_of_identity && (
                          <Typography variant="caption" color="error">
                            {errors.claimant_proof_of_identity}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="Proof of Identity Number"
                        variant="outlined"
                        id="claimant_proof_of_identity_number"
                        name="claimant_proof_of_identity_number"
                        value={formData.claimant_proof_of_identity_number}
                        error={!!errors.claimant_proof_of_identity_number}
                        onChange={handleNonInsuredDetailsChange}
                        helperText={errors.claimant_proof_of_identity_number ? <FormHelperText error>{errors.claimant_proof_of_identity_number}</FormHelperText> : ""}
                        required
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              border: 'none',
                            },
                            '&:hover fieldset': {
                              border: 'none',
                            },
                            '&.Mui-focused fieldset': {
                              border: 'none',
                            },
                            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box mt={3} display="flex" justifyContent={'space-between'} paddingLeft={4} paddingRight={4}>
        <Box >
          <StyledButtonComponent
            buttonWidth={100}
            variant="contained"
            onClick={onBackCheckValidation}
            startIcon={<NavigateBeforeIcon />}
            backgroundColor={localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066"}
          >
            Back
          </StyledButtonComponent>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <StyledButtonComponent
            buttonWidth={100}
            variant="outlined"
            sx={{ mr: 2 }}
            disableColor={"#CCCCCC"}
            disabled={!enableReviewButton}
            onClick={onReviewCheckValidation}
            backgroundColor={isFormValid() ? (localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066") : "#999999"}
          >
            Review
          </StyledButtonComponent>
          <StyledButtonComponent
            buttonWidth={200}
            variant="outlined"
            onClick={handleNext}
            endIcon={<NavigateNextIcon />}
            disableColor={"#CCCCCC"}
            disabled={!isFormValid()}
            backgroundColor={isFormValid() ? (localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066") : "#999999"}
          >
            Save & Continue
          </StyledButtonComponent>
        </Box>
      </Box>
    </>
  )
}

export default NonInsuredDetails