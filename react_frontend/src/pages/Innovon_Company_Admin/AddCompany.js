import React, { useState } from "react";
import { styled } from "@mui/system";
 import StyledButtonComponent from "../../components/StyledButton";
import FileUploaded from "../../components/fileupload";
import {
  Grid,
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Snackbar,
  LinearProgress,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";


import CloseIcon from '@mui/icons-material/Close';

import axios from "axios";
import { states } from "../../data/states";
const useStyles = styled((theme) => ({
  content: {
    padding: "0px 10px",
    minHeight: "calc(100vh - 70px)",
    display: "flex",
    justifyContent: "space-between",
  },
  card: {
    padding: "20px",
    border: "0",
    position: "relative",
    width: "100%",
    marginBottom: "30px",
    boxShadow: "0 1px 20px 0px rgba(0, 0, 0, 0.1)",
    borderRadius: "50px", // Adjust as needed
  },
  cardUser: {
    overflow: "hidden",
    height: "620px",
  },
  author: {
    textAlign: "center",
    textTransform: "none",
    marginTop: "25px",
  },
  name: {
    color: "#0B70FF",
    fontSize: "20px",
    marginBottom: theme.spacing(1), // Add spacing between name and description
  },
  description: {
    color: "#9a9a9a",
    fontWeight: 100,
    fontSize: "0.9rem", // Reduced font size
    textAlign: "justify", // Justified text
  },
  longDescription: { // Style for the longer description
    color: "gray",
    fontSize: "0.8rem",
    textAlign: "justify",
  },
  buttonContainer: {
    marginBottom: "6px",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  },
  btnIcon: {
    height: "2.375rem",
    minWidth: "2.375rem",
    width: "2.375rem",
    padding: "0",
    fontSize: "1.3rem",
    overflow: "hidden",
    position: "relative",
    lineHeight: "normal",
    border: "none",
    borderRadius: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    "& .MuiSvgIcon-root": {
      fontSize: "1.5rem",
      color: "#ffffff",
    },
    "&:hover": {
      opacity: 0.8,
    },
  },
  // ... styles for social icons (btn-facebook, btn-twitter, etc.) ...
  btnFacebook: {
    backgroundColor: "#3b5998", // Facebook blue
  },
  btnTwitter: {
    backgroundColor: "#1DA1F2", // Twitter blue
  },
  btnLinkedin: {
    backgroundColor: "#0077B5", // LinkedIn blue
  },
  btnInstagram: {
    background:
      "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)", // Instagram gradient
  },
  btnYoutube: {
    backgroundColor: "#FF0000", // YouTube red
  },
  customTextField: {
    "& .MuiInputLabel-root": {
      color: "#0B70FF",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#0B70FF",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "none",
        borderBottom: "0.2px solid rgba(0, 0, 0, 0.5)",
      },
      "&:hover fieldset": {
        borderBottom: "0.2px solid rgba(0, 0, 0, 0.5)",
      },
      "&.Mui-focused fieldset": {
        borderBottom: "2px solid #0B70FF",
      },
    },
  },
  // Styles for drag and drop area
  dropzone: {
    border: "2px dashed #ced4da", // Use a lighter border color
    borderRadius: "5px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    marginBottom: theme.spacing(2),
    transition: "border-color 0.3s ease", // Add a smooth transition for border color
    "&:hover": {
      borderColor: "#0B70FF", // Change border color on hover
    },
  },

  // Styles for preview image
  previewImage: {
    width: "20%", // Make the preview smaller
  },
  // Style for upload icon
  uploadIcon: {
    fontSize: "5rem", // Make the icon larger
    color: "#0B70FF", // Use a light gray color
    marginBottom: theme.spacing(2),
  },
  clickableText: {
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline", // Optional: Add underline on hover 
    },
  },
  cancelButton: {
    marginLeft: 'auto',
    cursor: 'pointer',
    color: '#ffffff', // Set initial color to white
    '&:hover': {  // Style for hover
      color: '#ddd', // Lighter shade of gray on hover 
    },
  },
}));
 

const initialValues = {
  ic_name: "",
  ic_email: "", // Update field name to match your backend
  ic_mobile: "", // Update field name to match your backend
  ic_primary_color: "", // Update field name to match your backend
  ic_secondary_color: "", // Update field name to match your backend
  ic_website_url: "",
  claim_storage_type: "", // Update field name to match your backend
  ic_address1: "", // Update field name to match your backend
  ic_address2: "", // Update field name to match your backend
  ic_street: "", // Update field name to match your backend
  ic_city: "", // Update field name to match your backend
  ic_state: "", // Update field name to match your backend
  ic_zip: "", // Update field name to match your backend
  ic_country: "", // Update field name to match your backend
}


function AddCompany({ onClose }) {
  const classes = useStyles();

  const [companyData, setCompanyData] = useState(initialValues);
  
  const [uploadProgress, ] = useState(0);
  const [isLoading, ] = useState(false); // State for loading
  const [, setState] = useState(companyData.ic_state); // State for selected state
  const [, setCountry] = useState(companyData.ic_country); // State for selected country (default to USA)
  const [errors, setErrors] = useState({});
  const [successPopupOpen, setSuccessPopupOpen] = useState(false);
  const [createdCompanyId, setCreatedCompanyId] = useState(null);
  const [, setIsSubmitDisabled] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadIn] = useState("portal");
  const [previews, setPreviews] = useState([]);
  const [filePreview, setFilePreview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });





  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'ic_state') {
      setState(value);
    } else if (name === 'ic_country') {
      setCountry(value);
    }
    setCompanyData({
      ...companyData,
      [event.target.name]: event.target.value,
    });

    validateField(name, value);
  };

  console.log("company data", companyData);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    console.log(name, value);
    switch (name) {
      case 'ic_name':
        if (value.length > 30) {
          newErrors[
            name
          ] = 'Please enter a valid name (up to 20 characters, only letters and spaces).';
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          newErrors[name] = 'Please enter a valid name.';
        } else {
          delete newErrors[name];
        }
        break;
      case 'ic_address1':
      case 'ic_address2':
        if (!/^\d+$/.test(value)) {
          newErrors[
            name
          ] = 'Please enter a valid street number (only integers).';
        } else {
          delete newErrors[name];
        }
        break;

      case 'ic_street':
        if (value === '' || value === undefined) {
          newErrors[name] = 'Please enter a valid Street Name.';
        } else if (value.length > 40) {
          newErrors[name] = 'Street Name must be 40 characters or less.';
        } else {
          delete newErrors[name];
        }
        break;
      case 'ic_city':
        if (!/^[A-Za-z\s]+$/.test(value)) {
          newErrors[
            name
          ] = 'Please enter a valid city name (only letters and spaces).';
        } else {
          delete newErrors[name];
        }
        break;

      case 'ic_zip':
        if (!/^\d{5}$/.test(value)) {
          // Must be exactly 5 digits
          newErrors[name] = 'Please enter a valid 5-digit ZIP code.';
        } else {
          delete newErrors[name];
        }
        break;

      case 'ic_mobile':
        if (!/^\d{10}$/.test(value)) {
          // Must be exactly 10 digits
          newErrors[name] = 'Please enter a valid 10-digit mobile number.';
        } else {
          delete newErrors[name];
        }
        break;

      case 'ic_email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[name] = 'Please enter a valid email address.';
        } else {
          delete newErrors[name];
        }
        break;
      case 'ic_primary_color':
      case 'ic_secondary_color':
        if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
          newErrors[name] = 'Please enter a valid hex color code (e.g., #FF0000 or #F00).';
        } else {
          delete newErrors[name];
        }
        break;

      case 'ic_website_url':
        // You can customize this URL validation regex further if needed
        // eslint-disable-next-line
        if (!/^(https?:\/\/)?([\w.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/.test(value)) {
          newErrors[name] = 'Please enter a valid website URL.';
        } else {
          delete newErrors[name];
        }
        break;

      default:
        delete newErrors[name];
    }

    setErrors(newErrors);
  };

  const isFormValid = () => {
    const requiredFields = [
      'ic_name',
      'ic_email',
      'ic_mobile',
      'ic_primary_color',
      'ic_website_url',
      'claim_storage_type',
      'ic_address1',
      'ic_street',
      'ic_city',
      'ic_state',
      'ic_zip',
      'ic_country',
    ];

    for (const field of requiredFields) {
      if (companyData[field] === '' || errors[field]) {
        return false;
      }
    }
    return true;
  };







  // Apply CustomTextField styles directly as inline styles
  const customTextFieldStyle = {
    "& .MuiInputLabel-root": {
      color: "#0B70FF",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#0B70FF",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "none",
        borderBottom: "0.2px solid rgba(0, 0, 0, 0.5)",
      },
      "&:hover fieldset": {
        borderBottom: "0.2px solid rgba(0, 0, 0, 0.5)",
      },
      "&.Mui-focused fieldset": {
        borderBottom: "2px solid #0B70FF",
      },
    },
  };

  


  const handleCompanyFormSubmit = async () => {
    console.log(companyData);
    const formData = new FormData();
    formData.append('ic_name', companyData.ic_name);
    formData.append('ic_address1', companyData.ic_address1);
    formData.append('ic_address2', companyData.ic_address2);
    formData.append('ic_street', companyData.ic_street);
    formData.append('ic_city', companyData.ic_city);
    formData.append('ic_zip', companyData.ic_zip);
    formData.append('ic_state', companyData.ic_state);
    formData.append('ic_country', companyData.ic_country);
    formData.append('ic_email', companyData.ic_email);
    formData.append('ic_mobile', companyData.ic_mobile);
    formData.append('ic_primary_color', companyData.ic_primary_color);
    formData.append('ic_secondary_color', companyData.ic_secondary_color);
    formData.append('ic_website_url', companyData.ic_website_url);
    formData.append('claim_storage_type', companyData.claim_storage_type);
  

    formData.append('documents', selectedFile);

console.log(formData,'form company');

    await axiosInstance.post('add-company/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      console.log(response);
      localStorage.setItem("IC_ID", JSON.stringify(response.data.ic_id));
      setCreatedCompanyId(response.data.ic_id); // Store the created ID
      setSuccessPopupOpen(true); // Open the success popup
      setCompanyData(initialValues); // Reset form fields
    }).catch(error => {
      console.error(error);
      const errorMessage = error.response?.data?.message || "There was an issue adding the company.";
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    })
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCloseSuccessPopup = () => {
    setSuccessPopupOpen(false);
    onClose(); // Call onClose to close the AddCompany component
  };

  const handleFilesUploadToAddCompany = (selectedFiles, previews) => {
    setSelectedFile(selectedFiles[0]);
    setPreviews(previews);
    setIsSubmitDisabled(false);

    if (selectedFiles[0]) {
      setFilePreview(URL.createObjectURL(selectedFiles[0]));
    }
  };

  const handleFileRemove = () => {
    setPreviews([]);
    setIsSubmitDisabled(true);
    setSelectedFile(null);
    setFilePreview(null);
  };

  console.log("selected file", selectedFile);

  const handleCancel = () => {
    setCompanyData(initialValues); // Reset form fields
    setErrors({}); // Clear any validation errors
    setSelectedFile(null); // Clear selected file
    setFilePreview(null); // Clear file preview  
    setPreviews([]);
    setIsSubmitDisabled(true);
    setCreatedCompanyId(null)
    onClose(); // Call onClose to close the AddCompany component
  };



  return (    
      <div className={classes.content}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>    
            <Card className={classes.card}>
             
            <Box 
              display="flex" 
              alignItems="center" 
              justifyContent="space-between" // Add justifyContent
              sx={{ padding: "1rem" }} // Add padding for better spacing
              backgroundColor="#3B8CFF"
            >
              <Typography style={{color:"white", fontWeight:"bold"}} className="Nasaliza">
                Add New Insurance Company Profile
              </Typography>         
              {/* Call onClose directly when the icon is clicked */}
              <CloseIcon 
                className={classes.cancelButton} 
                style={{ color: "white", cursor: "pointer", zIndex: 1 }} 
                onClick={handleCancel}// Call onClose directly from parent
              /> 
            </Box>
              <CardContent> <Grid container spacing={3}>
          
                <Grid container spacing={3} style={{ padding: "2rem" }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="ic_name"
                      label="Company Name"
                      fullWidth
                      variant="outlined"
                      required
                      value={companyData.ic_name}
                      onChange={handleInputChange}
                      // InputProps={{
                      //   readOnly: !isEditing,
                      // }}
                      error={!!errors.ic_name}
                      helperText={errors.ic_name}
                      sx={customTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="ic_website_url"
                      label="Company Website URL"
                      fullWidth
                      variant="outlined"
                      required
                      value={companyData.ic_website_url}
                      onChange={handleInputChange}
                      error={!!errors.ic_website_url}
                      helperText={errors.ic_website_url}

                      sx={customTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="ic_email"
                      label="Customer Care Email"
                      fullWidth
                      variant="outlined"
                      required
                      value={companyData.ic_email}
                      onChange={handleInputChange}
                      error={!!errors.ic_email}
                      helperText={errors.ic_email}

                      sx={customTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="ic_mobile"
                      label="Customer Care Number"
                      fullWidth
                      variant="outlined"
                      required
                      value={companyData.ic_mobile}
                      onChange={handleInputChange}
                      error={!!errors.ic_mobile}
                      helperText={errors.ic_mobile}

                      sx={customTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="ic_primary_color"
                      label="Primary Color Code"
                      fullWidth
                      variant="outlined"
                      required
                      value={companyData.ic_primary_color}
                      onChange={handleInputChange}
                      error={!!errors.ic_primary_color}
                      helperText={errors.ic_primary_color}

                      sx={customTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="ic_secondary_color"
                      label="Secondary Color Code"
                      fullWidth
                      variant="outlined"
                      value={companyData.ic_secondary_color}
                      onChange={handleInputChange}
                      error={!!errors.ic_secondary_color}
                      helperText={errors.ic_secondary_color}

                      sx={customTextFieldStyle}
                    />
                  </Grid>


                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="ic_address1"
                      label="Address Line 1"
                      fullWidth
                      variant="outlined"
                      required
                      value={companyData.ic_address1}
                      onChange={handleInputChange}
                      error={!!errors.ic_address1}
                      helperText={errors.ic_address1}

                      sx={customTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="ic_address2"
                      label="Address Line 2"
                      fullWidth
                      variant="outlined"
                      value={companyData.ic_address2}
                      onChange={handleInputChange}
                      error={!!errors.ic_address2}
                      helperText={errors.ic_address2}

                      sx={customTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="ic_street"
                      label="Street Name"
                      fullWidth
                      variant="outlined"
                      required
                      value={companyData.ic_street}
                      onChange={handleInputChange}
                      error={!!errors.ic_street}
                      helperText={errors.ic_street}

                      sx={customTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="ic_city"
                      label="City"
                      fullWidth
                      variant="outlined"
                      required
                      value={companyData.ic_city}
                      onChange={handleInputChange}
                      error={!!errors.ic_city}
                      helperText={errors.ic_city}

                      sx={customTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>

                    <FormControl fullWidth sx={customTextFieldStyle}>
                      <InputLabel id="state-select-label">State *</InputLabel>
                      <Select
                        labelId="state-select-label"
                        id="state-select"
                        name="ic_state"
                        value={companyData.ic_state} // Correctly bind to the state variable
                        onChange={handleInputChange}
                        label="State"
                        required

                        sx={{
                          ...customTextFieldStyle,
                          '& .MuiSelect-select': {
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: "left",
                            gap: '20px',  // Adjust the gap value as needed
                            margin: "-0.5rem 0rem 0.5rem 0rem"
                          },
                        }}
                        MenuProps={{
                          style: {
                            maxHeight: 300,
                          },
                        }}
                        error={!!errors.ic_state}
                        helperText={errors.ic_state}
                      >
                        {states.map((stateObj) => (
                          <MenuItem key={stateObj.value} value={`${stateObj.select} (${stateObj.value})`}>
                            {`${stateObj.select} (${stateObj.value})`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="ic_zip"
                      label="Zip"
                      fullWidth
                      variant="outlined"
                      required
                      value={companyData.ic_zip}
                      onChange={handleInputChange}
                      error={!!errors.ic_zip}
                      helperText={errors.ic_zip}
                      sx={customTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={customTextFieldStyle}>
                      <InputLabel id="country-select-label">Country *</InputLabel>
                      <Select
                        labelId="country-select-label"
                        id="country-select"
                        name="ic_country"
                        value={companyData.ic_country}
                        onChange={handleInputChange}
                        label="Country"
                        required
                        sx={{
                          ...customTextFieldStyle,
                          '& .MuiSelect-select': {
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: "left",
                            gap: '20px',
                            margin: "0rem 0rem 0.6rem 0rem"
                          },
                        }}
                        MenuProps={{
                          style: {
                            maxHeight: 300,
                          },
                        }}
                        error={!!errors.ic_country}
                        helperText={errors.ic_country}
                      >
                        <MenuItem value="USA">USA</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={customTextFieldStyle}>
                      <InputLabel id="country-select-label">Claim Storage Type *</InputLabel>
                      <Select
                        labelId="claim_storage_type"
                        id="claim_storage_type"
                        name="claim_storage_type"
                        value={companyData.claim_storage_type}
                        onChange={handleInputChange}
                        label="Claim Storage Type"
                        required
                        sx={{
                          ...customTextFieldStyle,
                          '& .MuiSelect-select': {
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: "left",
                            gap: '20px',
                            margin: "0rem 0rem 0.6rem 0rem"
                          },
                        }}
                        MenuProps={{
                          style: {
                            maxHeight: 300,
                          },
                        }}
                        error={!!errors.claim_storage_type}
                        helperText={errors.claim_storage_type}
                      >
                        <MenuItem value="Database">Database</MenuItem>
                        <MenuItem value="Excel">Excel</MenuItem>
                        <MenuItem value="CSV">CSV</MenuItem>
                        <MenuItem value="Flat File">Flat File</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* File Upload Section */}
                  <Grid item xs={12} sm={5}>
                    <Typography className="Nasaliza" style={{color:"#0B70FF"}}>
                      Upload Company Logo
                    </Typography>
                    <FileUploaded
                      id="portal"
                      multiple={false}
                      allowedFormats={['jpg', 'png', 'jpeg']}
                      setIsSubmitDisabled={setIsSubmitDisabled}
                      selectedFilesInParent={selectedFile ? [selectedFile] : []}
                      filePreviews={previews}
                      uploadIn={uploadIn}
                      onFilesUpload={handleFilesUploadToAddCompany}
                      onFileRemove={handleFileRemove}
                    />

                  </Grid>
                  <Grid item xs={12} sm={2}>
                    {filePreview && (
                      <div style={{ marginTop: '1rem' }}>
                        {selectedFile?.type === "application/pdf" ? (
                          <iframe src={filePreview} width="100%" height="400" title="File Preview"></iframe>
                        ) : (
                          <img src={filePreview} alt="File Preview" style={{ width: '100%', height: 'auto' }} />
                        )}
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={3}></Grid>

                  {/* Submit Button (aligned left) */}
                  <Grid item xs={12} sm={12} style={{ textAlign: "left", marginTop: "2rem" }}>

                    <StyledButtonComponent
                      buttonWidth={150}
                      variant="outlined"
                      onClick={handleCompanyFormSubmit}
                      disableColor={"#B6E3FF"}
                      disabled={!isFormValid() || isLoading}
                      startIcon={isLoading && <CircularProgress size={20} style={{ color: "white" }} />}
                    >
                      {isLoading ? "Submitting..." : "Submit"}
                    </StyledButtonComponent>

                  </Grid>


                </Grid>

           
              </Grid>



              </CardContent>
              <CardActions>



              </CardActions>
              {/* Progress bar */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <LinearProgress variant="determinate" value={uploadProgress} />
              )}
            </Card>
 
          </Grid>

        </Grid>
          {/* Success Popup */}
      <Dialog open={successPopupOpen} onClose={handleCloseSuccessPopup}>
        <DialogTitle>Company Added Successfully!</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Your company has been added with ID: <strong style={{ color: "#0B70FF" }}>{createdCompanyId}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessPopup} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
       {/* Snackbar for error messages */}
       <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </div>
     
   
 
  );
}

export default AddCompany;