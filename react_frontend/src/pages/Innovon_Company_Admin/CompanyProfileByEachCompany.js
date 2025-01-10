import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { styled } from "@mui/system";
import StyledButtonComponent from "../../components/StyledButton";
import {
  Grid,
  TextField,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Snackbar,
  LinearProgress,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import axios from "axios";
import { states } from "../../data/states";
import FileUploaded from "../../components/fileupload";
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
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const initialValues = {
  ic_id: "",
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
  ic_logo_name: "", // Update field name to match your backend
}


function CompanyProfileByEachCompany({ companyName, onCloseCompanyProfile }) {
  const classes = useStyles();
 
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState(initialValues);
  const [originalCompanyData, setOriginalCompanyData] = useState({});
  const [openToast, setOpenToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState('success');
  const [toastMessage, setToastMessage] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [, setSelectedImageSrc] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
 
  const [, setSelectedFileName] = useState(""); // State to store selected file name
  const [, setShowPreview] = useState(false); // Control image preview visibility
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [, setState] = useState(companyData.ic_state); // State for selected state
  const [, setCountry] = useState(companyData.ic_country); // State for selected country (default to USA)
  const [isapiLoading, setapiIsLoading] = useState(true); // Start with loading true
  const [apiError, setApiError] = useState(null); // State to track API errors
  const [, setIsSubmitDisabled] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadIn] = useState("portal");
  const [previews, setPreviews] = useState([]);
  const [filePreview, setFilePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });


  useEffect(() => {
    const fetchCompanyData = async () => {
      setapiIsLoading(true); // Show loading indicator
      setApiError(null); // Reset error message
      try {
        const response = await axiosInstance.get(`get-company-by-id/?ic_name=${companyName}`);
        

        const data = response.data.company;

        setCompanyData({
          ic_id: data.ic_id,
          ic_name: data.ic_name,
          ic_email: data.ic_email,
          ic_mobile: data.ic_mobile,
          ic_primary_color: data.ic_primary_color,
          ic_secondary_color: data.ic_secondary_color,
          ic_website_url: data.ic_website_url,
          claim_storage_type: data.claim_storage_type,
          ic_address1: data.ic_address1,
          ic_address2: data.ic_address2,
          ic_street: data.ic_street,
          ic_city: data.ic_city,
          ic_state: data.ic_state,
          ic_zip: data.ic_zip,
          ic_country: data.ic_country,
          ic_logo_name: data.ic_logo_name,
        });

        setOriginalCompanyData({ ...companyData });

        setImageSrc(`data:image/${data.image_type};base64,${data.image_data}`);
        setapiIsLoading(false);
      } catch (error) {
     
        setApiError(`Failed to get the ${companyName} details.`); // Set error message
        setapiIsLoading(false); // Set loading to false on error as well
      }
    };

    fetchCompanyData();
    // eslint-disable-next-line
  }, [companyName]);

  const handleEditClick = () => {
    setIsEditing(true);
    setOriginalCompanyData({ ...companyData });
  };

  const handleCancelEdit = (originalCompanyData) => {
    console.log(originalCompanyData);

    setIsEditing(false);
    setCompanyData({ ...originalCompanyData });
    setSelectedImageSrc(null); // Clear the preview if editing is canceled
    setUploadProgress(0);
    setShowPreview(false);
    setSelectedFileName("");
  };


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
        if (!/^(https?:\/\/)?([\w.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/.test(value)) {
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


  const handleFilesUploadToUpdateCompany = (selectedFiles, previews) => {
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




  const handleUpdateSubmit = async () => {
    try {
      setIsLoading(true); // Start loading when API call starts
      const formData = new FormData();

      // Append all company data to FormData
      for (const key in companyData) {
        formData.append(key, companyData[key]);
      }

      formData.append('new_logo', selectedFile);




      const response = await axiosInstance.put(
        'update-company/', // Correct URL without ic_id
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );


      if (response.status === 200) {
        const updatedData = response.data.company;
         // Update both companyData and originalCompanyData on success
        setCompanyData(prevState => ({ ...prevState, ...updatedData }));
        setOriginalCompanyData(prevState => ({ ...prevState, ...updatedData })); 
          if (filePreview) {
            setImageSrc(filePreview);
          }
          
        


        setToastSeverity("success");
        setToastMessage("Company details updated successfully!");
        setOpenToast(true);
        setIsEditing(false);
      } else {
        setToastSeverity("error");
        setToastMessage(
          "Error updating company details. Please try again later."
        );
        setOpenToast(true);
      }
    } catch (error) {
      console.error("Error updating company details:", error);
      setToastSeverity("error");
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again later.";
      setToastMessage(errorMessage);
      setOpenToast(true);
    } finally {
      setIsLoading(false); // Stop loading whether success or failure
    }
  };

  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenToast(false);
  };

  const handleGotoSpecificCompanyDashboard = () => {
    localStorage.setItem("ic_id_for_dashboard", companyData.ic_id);
    localStorage.setItem("ic_name_for_dashboard", companyData.ic_name);
    navigate('/dashboard/dashboard'); // Navigate to the dashboard route
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



  const handleCloseClick = () => {
    setCompanyData(initialValues); // Reset form fields
    setErrors({}); // Clear any validation errors
    setSelectedFile(null); // Clear selected file
    setFilePreview(null); // Clear file preview  
    setPreviews([]);
    setIsSubmitDisabled(true);
    setIsEditing(false);
    setSelectedImageSrc(null); // Clear the preview if editing is canceled
    setUploadProgress(0);
    setShowPreview(false);
    setSelectedFileName("");
    onCloseCompanyProfile(); // Call the prop to close the profile
  };

  return (
    isapiLoading ? ( // Show loading indicator if isLoading is true
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress /> Fetching {companyName} data
      </Box>
    ) : apiError ? ( // Show error message if apiError is not null
      <Typography variant="body1" color="error" align="center" mt={4}>
        {apiError}
      </Typography>
    ) : (

      <div className={classes.content}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>

            <Card className={classes.card}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between" // Add justifyContent
                sx={{ padding: "1rem" }} // Add padding for better spacing
                backgroundColor="#3B8CFF"
              >
                <Typography style={{ color: "white", fontWeight: "bold" }} className="Nasaliza">
                  Insurance Company Profile
                  {isEditing ? (
                    <IconButton
                      onClick={() => handleCancelEdit(originalCompanyData)} // Pass a function to onClick
                      style={{ color: "white", marginLeft: "1rem" }}>
                      <CloseIcon />
                    </IconButton>
                  ) : (
                    <EditIcon
                      style={{ color: "white", cursor: "pointer", marginLeft: "1rem" }}
                      onClick={handleEditClick}
                    />
                  )}
                </Typography>
                <Typography

                  style={{ color: "white", cursor: "pointer", zIndex: 1 }}
                  onClick={handleCloseClick}
                >
                  Close
                </Typography>

              </Box>

              <Box display="flex" alignItems="center">




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
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      error={!!errors.ic_name}
                      helperText={errors.ic_name}
                      sx={customTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="ic_id"
                      label="Company ID"
                      fullWidth
                      variant="outlined"
                      required
                      value={companyData.ic_id}
                      InputProps={{
                        readOnly: true,
                      }}
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
                      InputProps={{
                        readOnly: !isEditing,
                      }}
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
                      InputProps={{
                        readOnly: !isEditing,
                      }}
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
                      InputProps={{
                        readOnly: !isEditing,
                      }}
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
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      error={!!errors.ic_secondary_color}
                      helperText={errors.ic_secondary_color}
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
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      error={!!errors.ic_website_url}
                      helperText={errors.ic_website_url}
                      sx={customTextFieldStyle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="claim_storage_type"
                      label="Claim Storage Type"
                      fullWidth
                      variant="outlined"
                      required
                      value={companyData.claim_storage_type}
                      onChange={handleInputChange}
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      error={!!errors.claim_storage_type}
                      helperText={errors.claim_storage_type}
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
                      InputProps={{
                        readOnly: !isEditing,
                      }}
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
                      InputProps={{
                        readOnly: !isEditing,
                      }}
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
                      InputProps={{
                        readOnly: !isEditing,
                      }}
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
                      InputProps={{
                        readOnly: !isEditing,
                      }}
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
                        inputProps={{
                          readOnly: !isEditing,
                        }}
                        sx={{
                          ...customTextFieldStyle,
                          '& .MuiSelect-select': {
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: "left",
                            gap: '20px',
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
                      InputProps={{
                        readOnly: !isEditing,
                      }}
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
                        inputProps={{
                          readOnly: !isEditing,
                        }}
                        sx={{
                          ...customTextFieldStyle,
                          '& .MuiSelect-select': {
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: "left",
                            gap: '20px',
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
                    <TextField
                      name="ic_logo_name"
                      label="Company Logo File Name"
                      fullWidth
                      variant="outlined"
                      value={companyData.ic_logo_name}
                      onChange={handleInputChange}
                      InputProps={{
                        readOnly: true
                      }}
                      sx={customTextFieldStyle}
                    />
                  </Grid>
                 

                  {/* File Upload Section */}
                  {
                    isEditing && (
                      <>
                        <Grid item xs={12} sm={7}>
                          <Typography className="Nasaliza" style={{ color: "#0B70FF" }}>
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
                            onFilesUpload={handleFilesUploadToUpdateCompany}
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
                            onClick={handleUpdateSubmit}
                            disableColor={"#B6E3FF"}
                            disabled={!isFormValid() || isLoading}
                            startIcon={isLoading && <CircularProgress size={20} style={{ color: "white" }} />}
                          >
                            {isLoading ? "Updating..." : "Update"}
                          </StyledButtonComponent>

                        </Grid>
                      </>
                    )
                  }

                </Grid>


              </Grid>

              </CardContent>
              {/* Progress bar */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <LinearProgress variant="determinate" value={uploadProgress} />
              )}
            </Card>

          </Grid>
          <Grid item xs={12} md={4}>
            <Card className={`${classes.card} ${classes.cardUser}`}>
              <CardContent>
                <div className={classes.author}>
                  <Avatar
                    alt="company logo"
                    src={imageSrc} // Use imageSrc directly here
                    sx={{
                      width: imageSrc ? 100 : 30,
                      height: imageSrc ? 100 : 30,
                      bgcolor: imageSrc ? "" : "#0B70FF",
                      margin: "2rem auto",
                    }}
                  >
                    {!imageSrc && <PersonIcon sx={{ fontSize: 60 }} />} {/* Show default icon if no imageSrc */}
                  </Avatar>
                  <Typography variant="h5" className={classes.name}>
                    {companyData && companyData.ic_name}
                  </Typography>
                  <Typography variant="body2" className={classes.description} style={{ marginBottom: "2rem" }}>
                    Home Owners Insurance Company
                  </Typography>
                </div>

                <div>
                  <StyledButtonComponent
                    buttonWidth={150}
                    variant="outlined"
                    onClick={handleGotoSpecificCompanyDashboard}
                  >
                    Dashboard →
                  </StyledButtonComponent>
                </div>
                <Typography variant="body2" className={classes.longDescription} style={{ textAlign: "justify", padding: "1rem", color: "gray", fontSize: "0.9rem" }}>
                  In P&C insurance, Home Owners Claims involve assessing and
                  managing claims related to property damage, liability, and
                  personal losses. Agents handle policy inquiries, guide clients
                  through the claims process, and ensure timely resolution. They
                  play a crucial role in providing support and ensuring adequate
                  coverage during challenging times.
                </Typography>
              </CardContent>
              {/* ... (Social media buttons code remains the same) ... */}
            </Card>
          </Grid>
        </Grid>
        <Snackbar open={openToast} autoHideDuration={6000} onClose={handleToastClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert onClose={handleToastClose} severity={toastSeverity}>
            {toastMessage}
          </Alert>
        </Snackbar>
      </div>

    )
  );
}

export default CompanyProfileByEachCompany;