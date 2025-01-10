import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, Paper, IconButton, CircularProgress, Box, Tooltip } from '@mui/material';
import StyledButtonComponent from '../../components/StyledButton';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import { NavigateNext as NavigateNextIcon, NavigateBefore as NavigateBeforeIcon, } from "@mui/icons-material";


const userFriendlyLabels = {
  'policy_number': 'Policy Number',
  'loss_property': 'Property Address',
  // ... 1. Loss Details
  'loss_date_and_time': 'Loss Date and Time',
  'loss_type': 'Type of Loss',
  'loss_damage_description': 'Loss Description',
  // ...2. Loss Location
  'street_number': 'Loss Location',
  // ...3. Claim Reporter
  'police_fire_contacted': 'Police/Fire Department Contacted?',
  'report_number': 'Report Number',
  // ...4. Claim Documents
  'claim_witness_document_names': 'Claim Documents',
  // ... 5.Contact Details
  'claimant_first_name': "First Name",
  'claimant_middle_name': "Middle Name",
  'claimant_last_name': "Last Name",
  'claimant_relationship_with_insured': "Relationship to Insured",
  'claimant_email': "Email Id",
  'claimant_phone': "Phone Number",
  'claimant_street_number': "Address",
  'claimant_proof_of_identity': "Proof of Identity",
  'claimant_proof_of_identity_number': "Proof of Identity Number",
};

const ClaimReview = ({ onBack, formData, onGotoStep, setCheckValidaionName, setValidateError, selectedFiles, isMobile, localCompany, isInsured, user, setSelectedFiles, setFormData, initialFormData, nonInsuredEmail }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });
  const onEditStep = (stepIndex) => {
    onGotoStep(stepIndex);
  };

  const handleSubmitData = async () => {
    setIsLoading(true);
    const submissionFormData = new FormData();
    submissionFormData.append('policy_holder_id', user.policy_holder_id);
    submissionFormData.append('policy_number', user.policy_number);
    submissionFormData.append('loss_date_and_time', formData.lossDetails.loss_date_and_time);
    submissionFormData.append('loss_type', formData.lossDetails.loss_type);
    submissionFormData.append('loss_property', formData.lossDetails.loss_property);
    submissionFormData.append('loss_damage_description', formData.lossDetails.loss_damage_description);
    submissionFormData.append('street_number', formData.lossLocation.street_number);
    submissionFormData.append('street_name', formData.lossLocation.street_name);
    submissionFormData.append('loss_city', formData.lossLocation.loss_city);
    submissionFormData.append('loss_state', formData.lossLocation.loss_state);
    submissionFormData.append('loss_zip', formData.lossLocation.loss_zip);
    submissionFormData.append('loss_country', formData.lossLocation.loss_country);
    submissionFormData.append('police_fire_contacted', formData.lossReporterDetails.police_fire_contacted);
    submissionFormData.append('report_number', formData.lossReporterDetails.report_number);
    submissionFormData.append('claim_reported_by', isInsured === true ? "Insured" : "Non-Insured");
    submissionFormData.append('claim_storage_type', localCompany.claim_storage_type);
    submissionFormData.append('role', isInsured === true ? "Insured" : "Non-Insured");
    submissionFormData.append('email', isInsured === true ? user.pol_email : localStorage.getItem("NonInsuredEmail"));

    if (isInsured === false) {
      submissionFormData.append('First_Name', formData.claimantContactDetails.claimant_first_name);
      submissionFormData.append('Middle_Name', formData.claimantContactDetails.claimant_middle_name);
      submissionFormData.append('Last_Name', formData.claimantContactDetails.claimant_last_name);
      submissionFormData.append('Mobile_Number', formData.claimantContactDetails.claimant_phone);
      submissionFormData.append('relationship_with_insured', formData.claimantContactDetails.claimant_relationship_with_insured === "Other" ? formData.claimantContactDetails.claimant_other_relationship_with_insured : formData.claimantContactDetails.claimant_relationship_with_insured);
      submissionFormData.append('Claimant_street_number', formData.claimantContactDetails.claimant_street_number);
      submissionFormData.append('Claimant_street_name', formData.claimantContactDetails.claimant_street_name);
      submissionFormData.append('Claimant_city', formData.claimantContactDetails.claimant_city);
      submissionFormData.append('Claimant_zip', formData.claimantContactDetails.claimant_zip);
      submissionFormData.append('Claimant_state', formData.claimantContactDetails.claimant_state);
      submissionFormData.append('Claimant_country', formData.claimantContactDetails.claimant_country);
      submissionFormData.append('Proof_of_Identity', formData.claimantContactDetails.claimant_proof_of_identity);
      submissionFormData.append('Proof_of_Identity_Number', formData.claimantContactDetails.claimant_proof_of_identity_number);
    }

    for (let i = 0; i < selectedFiles.length; i++) {
      submissionFormData.append('documents', selectedFiles[i]);
    }
    handleStoreData(submissionFormData);
  }
  const handleStoreData = async (submissionFormData) => {
    await axiosInstance.post('add-claim/', submissionFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        setIsLoading(false);
        navigate('/claimsuccess', { state: { claimid: JSON.stringify(response.data) } });
        setSelectedFiles([]);
        setFormData(initialFormData);
      }).catch(error => {
        console.error("error", error);
        setIsLoading(false);
      })
  }

  const formatAddress1 = (data) => {
    const {
      'street_number': streetNumber,
      'street_name': streetName,
      'loss_city': city,
      'loss_state': state,
      'loss_zip': zip,
      'loss_country': country
    } = data;
    return `${streetNumber} ${streetName}, ${city}, ${state}, ${country}, ${zip}`;
  };
  const formatAddress2 = (data) => {
    const {
      'claimant_street_number': streetNumber,
      'claimant_street_name': streetName,
      'claimant_city': city,
      'claimant_state': state,
      'claimant_zip': zip,
      'claimant_country': country,
    } = data;
    const formattedAddress = `${streetNumber || ''} ${streetName || ''}, ${city || ''}, ${state || ''}, ${country || ''}, ${zip || ''}`;
    return formattedAddress.replace(/,\s*$/, "");
  };

  function renderValue(fieldName) {
    switch (fieldName) {
      case "Reported By":
        return isInsured ? "Insured" : "Non-Insured";
      case "Police/Fire Department Contacted?":
        return formData.lossReporterDetails.police_fire_contacted ? "True" : "False";
      case "Report Number":
        return formData.lossReporterDetails.report_number || "-";
      case "Claim Documents":
        return (
          <Box>
            {formData.lossReporterDetails.claim_witness_document_names &&
              formData.lossReporterDetails.claim_witness_document_names.length > 0 ? (
              formData.lossReporterDetails.claim_witness_document_names.map(
                (documentName, index) => (
                  <Typography
                    key={index}
                    style={{
                      fontSize: "0.9rem",
                      color: "gray",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        marginRight: "0.5rem",
                        lineHeight: "normal",
                      }}
                    >
                      •
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        wordBreak: "break-all",
                        overflowWrap: "break-word",
                      }}
                    >
                      {documentName || "-"}
                    </Box>
                  </Typography>
                )
              )
            ) : (
              "-"
            )}
          </Box>
        );
      case "Policy Number":
        return user?.policy_number || "-";
      case "Property Address":
        return (
          <>
            {user?.pro_address1}
            {" "}{user?.pro_street}{", "}{user?.pro_city}{", "}
            {user?.pro_state}{", "}{user?.pro_country}{", "}{user?.pro_zip}
          </>
        );
      case 'Email Id':
        return nonInsuredEmail;
      case 'Relationship to Insured':
        if (formData.claimantContactDetails.claimant_relationship_with_insured === "Other") {
          return formData.claimantContactDetails.claimant_other_relationship_with_insured;
        } else {
          return formData.claimantContactDetails.claimant_relationship_with_insured;
        }
      case 'Address':
        return formatAddress2(formData.claimantContactDetails);
      default:
        return "-";
    }
  }

  return (
    <Grid
      container
      sx={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        overflowX: "hidden",
        overflowY: "hidden"
      }}
    >
      <Grid item xs={12} justifyContent='center' alignItems='center' margin="auto">
        <Grid textAlign={'center'} marginBottom={"2rem"}>
          <Typography className="Nasaliza" variant="h5" style={{ color: localCompany && localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066" }} >
            Review Claim Details
          </Typography>
        </Grid>
        <Paper
          elevation={2}
          sx={{
            padding: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            maxHeight: "100%",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Grid container spacing={isMobile ? 2 : 1} margin={'5px auto'}>
            <Grid container spacing={isMobile ? 1 : 2} style={{ marginLeft: isMobile ? '0' : '100px' }}>
              <Grid item xs={4} sm={4} md={4} sx={{ fontWeight: 550, fontSize: 13, textAlign: 'left' }}>
                Policy Number
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
                  {renderValue("Policy Number") ? renderValue("Policy Number") : "-"}
                </Typography>
              </Grid>
              <Grid item xs={4} sm={4} md={4} sx={{ fontWeight: 550, fontSize: 13, textAlign: 'left' }}>
                Property Address
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
                  {renderValue("Property Address") ? renderValue("Property Address") : "-"}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className='Nasaliza' sx={{ textAlign: 'left', color: '#010066', fontWeight: 400, margin: "1rem" }}>
                1. Loss Details
                <Tooltip title="Edit" arrow placement="right">
                  <IconButton onClick={() => onEditStep(0)}>
                    <EditIcon style={{ color: "#010066" }} />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Grid>
            <Grid container spacing={isMobile ? 1 : 2} style={{ marginBottom: '7px', marginLeft: isMobile ? '0' : '100px' }}>
              {Object.entries(formData.lossDetails)
                .filter(([key, _]) => !['loss_property', 'datePicker_date_and_time'].includes(key))
                .map(([key, value]) => (
                  <React.Fragment key={key}>
                    <React.Fragment>
                      <Grid item xs={4} sm={4} md={4} sx={{ fontWeight: 550, fontSize: 13, textAlign: 'left' }}>
                        {userFriendlyLabels[key]}
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
                              {userFriendlyLabels[key] + ' required'}
                            </span>
                          )}
                        </Typography>
                      </Grid>
                    </React.Fragment>
                  </React.Fragment>
                ))}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className='Nasaliza' sx={{ textAlign: 'left', color: '#010066', fontWeight: 400, margin: "1rem" }}>
                2. Loss Location
                <Tooltip title="Edit" arrow placement="right">
                  <IconButton onClick={() => onEditStep(1)}>
                    <EditIcon style={{ color: "#010066" }} />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Grid>
            <Grid container spacing={isMobile ? 1 : 2} style={{ marginBottom: '7px', marginLeft: isMobile ? '0' : '100px' }}>
              <React.Fragment>
                <Grid item xs={4} sm={4} md={4} sx={{ fontWeight: 550, fontSize: 13, textAlign: 'left' }}>
                  {userFriendlyLabels['street_number']}
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
                    {formatAddress1(formData.lossLocation)}
                  </Typography>
                </Grid>
              </React.Fragment>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className='Nasaliza' sx={{ textAlign: 'left', color: '#010066', fontWeight: 400, margin: "1rem" }}>
                3. Claim Reporter
                <Tooltip title="Edit" arrow placement="right">
                  <IconButton onClick={() => onEditStep(2)}>
                    <EditIcon style={{ color: "#010066" }} />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Grid>
            <Grid container spacing={isMobile ? 1 : 2} style={{ marginBottom: '7px', marginLeft: isMobile ? '0' : '100px' }}>
              {Object.entries(formData.lossReporterDetails)
                .filter(([key, _]) => !['claim_witness_document_urls', 'claim_witness_document_name_url'].includes(key))
                .map(([key, value]) => (
                  <React.Fragment key={key}>
                    <React.Fragment>
                      <Grid item xs={4} sm={4} md={4} sx={{ fontWeight: 550, fontSize: 13, textAlign: 'left' }}>
                        {userFriendlyLabels[key]}
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
                          {renderValue(userFriendlyLabels[key]) ? renderValue(userFriendlyLabels[key]) : "-"}
                        </Typography>
                      </Grid>
                    </React.Fragment>
                  </React.Fragment>
                ))}
            </Grid>
            {isInsured === false && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" className='Nasaliza' sx={{ textAlign: 'left', color: '#010066', fontWeight: 400, margin: "1rem" }}>
                    4. Contact Details
                    <Tooltip title="Edit" arrow placement="right">
                      <IconButton onClick={() => onEditStep(3)}>
                        <EditIcon style={{ color: "#010066" }} />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                </Grid>
                <Grid container spacing={isMobile ? 1 : 2} style={{ marginBottom: '7px', marginLeft: isMobile ? '0' : '100px' }}>
                  {Object.entries(formData.claimantContactDetails)
                    .filter(([key, _]) => !['claimant_street_name', 'claimant_city', 'claimant_zip', 'claimant_state', 'claimant_country', 'claimant_other_relationship_with_insured'].includes(key))
                    .map(([key, value]) => (
                      <React.Fragment key={key}>
                        <React.Fragment>
                          <Grid item xs={4} sm={4} md={4} sx={{ fontWeight: 550, fontSize: 13, textAlign: 'left' }}>
                            {userFriendlyLabels[key]}
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
                              {key === "claimant_street_number" || key === "claimant_relationship_with_insured" ? renderValue(userFriendlyLabels[key]) :
                                (value || renderValue(userFriendlyLabels[key]) || (
                                  <span style={{ color: 'red', fontWeight: 500, fontSize: 12 }}>
                                    {userFriendlyLabels[key] + ' required'}
                                  </span>
                                ))
                              }
                            </Typography>
                          </Grid>
                        </React.Fragment>
                      </React.Fragment>
                    ))}
                </Grid>
              </>
            )}
          </Grid>
          <Box mt={3} display="flex" justifyContent="space-between" padding={2}>
            <Box>
              <StyledButtonComponent
                buttonWidth={100}
                variant="contained"
                onClick={onBack}
                startIcon={<NavigateBeforeIcon />}
                backgroundColor={localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066"}
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
                backgroundColor={localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066"}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </StyledButtonComponent>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
export default ClaimReview