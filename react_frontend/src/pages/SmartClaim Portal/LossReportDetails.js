import React, { useState, useEffect } from 'react';
import { Grid, Typography, Paper, TextField, Switch, Box } from '@mui/material';
import FileUploaded from '../../components/fileupload.js';
import StyledButtonComponent from '../../components/StyledButton';
import { NavigateNext as NavigateNextIcon, NavigateBefore as NavigateBeforeIcon } from "@mui/icons-material";
 
const LossReportDetails = ({ setStepName, setBulbStepValid, onNext, onBack, showError, setShowError, formData, setFormData, enableReviewButton, onReviewClick, updateStepValidity, setCheckValidaionName, setValidateError, localCompany, checked, setChecked, isMobile, setSelectedFiles, selectedFiles, setEnableReviewButton }) => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [isReportButtonDisabled, setIsReportButtonDisabled] = useState(true);
  const previews = [];
  const filesUploadedInChild = false;
  const uploadIn = "portal";
 
  useEffect(() => {
    const isStepValid = checked ? (formData.report_number !== "") : true;
    updateStepValidity(isStepValid);
    if (checked) {
      setIsReportButtonDisabled(formData.report_number === "");
      setEnableReviewButton(formData.report_number !== "");
    } else {
      setIsReportButtonDisabled(false);
      setEnableReviewButton(true);
    }
  }, [checked, formData.report_number]);
 
  const handleChangeBoolean = (event) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);
    setFormData(prevState => ({
      ...prevState,
      lossReporterDetails: {
        ...prevState.lossReporterDetails,
        police_fire_contacted: isChecked,
        report_number: isChecked ? prevState.lossReporterDetails.report_number : ""
      }
    }));
    const isStepValid = isChecked ? (formData.report_number !== "") : true;
 
    updateStepValidity(isStepValid);
  };
 
  const handleLossReportChange = (event) => {
    if (event) {
      const { name, value } = event.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        lossReporterDetails: {
          ...prevFormData.lossReporterDetails,
          [name]: value,
        },
      }));
      const isStepValid = checked ? (value !== "") : true;
      updateStepValidity(isStepValid); 
    } 
  }
 
  const handleWitnessFilesUpload = (selectedFiles, previews) => {
    setSelectedFiles(selectedFiles);
    const claimWitnessDocumentNames = selectedFiles.map(file => file.name);
    setFormData(prevState => ({
      ...prevState,
      lossReporterDetails: {
        ...prevState.lossReporterDetails,
        claim_witness_document_names: claimWitnessDocumentNames,
      }
    }));
  }
 
  const handlewitnessFileRemove = (fileName) => {
    const updatedFiles = selectedFiles.filter(file => file.name !== fileName);
    setSelectedFiles(updatedFiles);
    const updatedDocumentNames = updatedFiles.map(file => file.name);
    setFormData(prevState => ({
      ...prevState,
      lossReporterDetails: {
        ...prevState.lossReporterDetails,
        claim_witness_document_names: updatedDocumentNames,
      }
    }));
 
  }
 
  const onBackCheckValidation = () => {
    if (isFormValid()) {
      setShowError(false)
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Claim Reporter'));
      onBack();
    } else {
      setValidateError(true)
      setShowError(true)
      setCheckValidaionName((prev) => [...prev, 'Claim Reporter']);
      onBack();
    }
  }
 
  const isFormValid = () => {
    if (formData.police_fire_contacted === true) {
      if(formData.report_number){
        setBulbStepValid(true)
      }else{
        setBulbStepValid(false)
      }
     setStepName('Claim Reporter')
      return formData.report_number !== "";
 }
    return true;
  }; 
  const onReviewCheckValidation = () => {
    setBulbStepValid(true)
    setStepName(" ")
    if (isFormValid()) {
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Claim Reporter'));
      onReviewClick();
    }
  }
 
  const handleNext = () => {
    if (isFormValid()) {
      setCheckValidaionName((prev) => prev.filter((name) => name !== 'Claim Reporter'));
      onNext("lossReporterDetails", formData);
      setBulbStepValid(false)
    } else {
      console.error("Form has errors or missing required fields. Please correct them.");
      setCheckValidaionName((prev) => [...prev, 'Claim Reporter']);
      setValidateError(true)
      setBulbStepValid(true)
    }
  };
 
  return (
    <Grid
      container
      sx={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        overflowX: "hidden",
      }}
    >
      <Grid item xs={12} justifyContent='center' alignItems='center' margin="auto">
        <Grid textAlign={'left'} marginBottom={"2rem"}>
          <Typography className="Nasaliza" variant="h5" style={{ color: localCompany && localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066" }} >
            Claim Reporter Details
          </Typography>
        </Grid>
        <Paper
          elevation={2}
          sx={{
            padding: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Grid container xs={12} sm={12} md={12} lg={12}>
            <Grid item xs={12} sm={12} md={12} lg={12} display={'flex'} paddingLeft={checked && isMobile ? '0' : '2rem'} alignItems={'center'} justifyContent={'center'}>
              <Switch
                checked={checked}
                name="police_fire_contacted"
                value={checked}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066",
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066",
                  },
                }}
                textAlign={checked && 'center'}
                onClick={handleChangeBoolean}
                inputProps={{
                  'aria-label': 'controlled',
                }}
              />
              <Typography style={{ fontSize: checked ? "0.8rem" : '1rem' }}>
                Police or Fire Department Contacted
              </Typography>
              {checked && (
                <Grid container>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TextField
                      id="outlined-basic"
                      label="Report Number"
                      variant="outlined"
                      name="report_number"
                      value={formData.report_number || ""}
                      onChange={handleLossReportChange}
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
                      required
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
            <Grid container sx={{ marginTop: "2%" }}>
              <Grid item xs={3} sm={3} md={3} lg={3} ></Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Typography className="Nasaliza" style={{ marginTop: "1.5rem", color: localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066", }} >
                  Upload claim supporting documents
                </Typography>
                <FileUploaded
                  id="portal"
                  onFilesUpload={handleWitnessFilesUpload}
                  multiple={true}
                  allowedFormats={['png', 'jpg', 'jpeg', 'plain', 'pdf', 'docx', 'mp4']}
                  setIsSubmitDisabled={setIsSubmitDisabled}
                  selectedFilesInParent={selectedFiles}
                  filePreviews={previews}
                  filesUploadedInChild={filesUploadedInChild}
                  uploadIn={uploadIn}
                  onFileRemove={handlewitnessFileRemove}
                />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        <Box mt={3} display="flex" justifyContent={'space-between'}>
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
              disabled={!enableReviewButton || (checked && isReportButtonDisabled)}
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
              disabled={(checked && isReportButtonDisabled)}
              backgroundColor={isFormValid() ? (localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066") : "#999999"}
            >
              Save & Continue
            </StyledButtonComponent>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}
 
export default LossReportDetails