import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from 'react-dropzone';
import { styled } from "@mui/system";
import MDBox from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDBox";
import MDTypography from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDTypography";
import {
  Grid,
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import DashboardLayout from "../../../CompanyDashboardChartsCardsLayouts/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../CompanyDashboardChartsCardsLayouts/Navbars/DashboardNavbar";
import { states } from "../../../data/states";
import { useTheme } from '@mui/material/styles'; // Import useTheme
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

const company = JSON.parse(localStorage.getItem('carrier_admin_company'));
 console.log("company data after login",company);
 

function CompanyProfile() {
  const classes = useStyles();
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
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
    new_logo: null, // For handling new logo uploads
  });

  const [originalCompanyData, setOriginalCompanyData] = useState({});
  const [openToast, setOpenToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState('success');
  const [toastMessage, setToastMessage] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null); // Ref for the hidden file input
  const [selectedFileName, setSelectedFileName] = useState(""); // State to store selected file name
  const [showPreview, setShowPreview] = useState(false); // Control image preview visibility
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const [state, setState] = useState(companyData.ic_state); // State for selected state
  const [country, setCountry] = useState(companyData.ic_country); // State for selected country (default to USA)
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });
 
  const ic_name = localStorage.getItem('ic_name_for_dashboard')

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
         
        const response = await axiosInstance.get(`get-company-by-id/?ic_name=${ic_name}`);
        console.log("response", response, response.data);

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
      } catch (error) {
        console.error('Error fetching company details:', error);
        // Handle error appropriately (e.g., show an error message)
      }
    };

    fetchCompanyData();
   
  }, []);
 
  const handleEditClick = () => {
    setIsEditing(true);
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
  };

  // Function to handle file selection (both drag & drop and file input)
  const handleFileChange = (files) => {
    setShowPreview(true);

    if (files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        setSelectedFileName(file.name); // Update the selected file name
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
        setCompanyData({
          ...companyData,
          new_logo: file,
        });
      }
    }
  };

  // File validation
  const isValidFile = (file) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setToastSeverity("error");
      setToastMessage("Invalid file type. Please upload a PNG, JPG, or JPEG.");
      setOpenToast(true);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setToastSeverity("error");
      setToastMessage("File size too large. Please upload a file smaller than 5MB.");
      setOpenToast(true);
      return false;
    }
    return true;
  };

  // Use the useDropzone hook
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileChange,
    multiple: false, // Allow only one file
    accept: 'image/png, image/jpeg, image/jpg', // Limit to image files
  });

  const handleUpdateSubmit = async () => {
    try {
      setIsLoading(true); // Start loading when API call starts
      const formData = new FormData();

      // Append all company data to FormData
      for (const key in companyData) {
        formData.append(key, companyData[key]);
      }

      // Track upload progress
      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      };

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
        // Assuming the response contains the updated company data 
        const updatedData = response.data.company;
        // setCompanyData(updatedData);
        // setOriginalCompanyData({ ...updatedData }); // Update the original data

        // // Update image source if a new logo was uploaded
        // if (companyData.new_logo) {
        //   setImageSrc(`data:image/${updatedData.image_type};base64,${updatedData.image_data}`);
        // }
        setCompanyData(prevState => ({ ...prevState, ...updatedData }), () => {
          console.log("Company data after update:", companyData); // Check if companyData has updated values
          setOriginalCompanyData({ ...companyData }); // Update originalCompanyData
        });
        {
          selectedImageSrc &&
            setImageSrc(selectedImageSrc);
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
      setToastMessage("An error occurred. Please try again later.");
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

  

  return (
    <DashboardLayout>
    <MDTypography style={{color:"#0B70FF", textAlign:"left", fontWeight:"bold", fontSize:"1.5rem"}} >Profile - {ic_name}</MDTypography>
      <DashboardNavbar />
      <MDBox mb={2} />
      <div className={classes.content}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <MDBox mb={3}>
              <Card className={classes.card}>
                <MDBox
                  sx={{
                    height: {
                      xs: "60px",
                      sm: "60px",
                      md: "60px",
                      lg: "60px",
                    },
                  }}
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex" alignItems="center">
                    <MDTypography variant="h6" color="white" mr={1}>
                      Insurance Company Profile
                    </MDTypography>
                    {isEditing ? (
                      <IconButton
                      onClick={() => handleCancelEdit(originalCompanyData)} // Pass a function to onClick
                       style={{ color: "white" }}>
                        <CloseIcon />
                      </IconButton>
                    ) : (
                      <EditIcon
                        style={{ color: "white", cursor: "pointer" }}
                        onClick={handleEditClick}
                      />
                    )}
                  </Box>
                </MDBox>
                <CardContent> <Grid container spacing={3}>
                  <MDBox pt={3}>
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
                          sx={customTextFieldStyle}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          name="ic_secondary_color"
                          label="Secondary Color Code"
                          fullWidth
                          variant="outlined"
                          required
                          value={companyData.ic_secondary_color}
                          onChange={handleInputChange}
                          InputProps={{
                            readOnly: !isEditing,
                          }}
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
                          sx={customTextFieldStyle}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
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
                          sx={customTextFieldStyle}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
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
                          sx={customTextFieldStyle}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {/* <TextField
                          name="ic_state"
                          label="State"
                          fullWidth
                          variant="outlined"
                          required
                          value={companyData.ic_state}
                          onChange={handleInputChange}
                          InputProps={{
                            readOnly: !isEditing,
                          }}
                          sx={customTextFieldStyle}
                        /> */}
                        <FormControl fullWidth sx={customTextFieldStyle}>
                          <InputLabel id="state-select-label">State</InputLabel>
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
                                justifyContent:"left",
                                gap: '20px',  // Adjust the gap value as needed
                                margin: "1rem 0rem 0.6rem 0rem"
                              },
                            }}
                            MenuProps={{
                              style: {
                                maxHeight: 300,
                              },
                            }}
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
                          sx={customTextFieldStyle}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={customTextFieldStyle}>
                          <InputLabel id="country-select-label">Country</InputLabel>
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
                                justifyContent:"left",
                                gap: '20px',
                                margin: "1rem 0rem 0.6rem 0rem"
                              },
                             }}
                            MenuProps={{
                              style: {
                                maxHeight: 300,
                              },
                            }}
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
                          required
                          value={companyData.ic_logo_name}
                          onChange={handleInputChange}
                          InputProps={{
                            readOnly: !isEditing,
                          }}
                          sx={customTextFieldStyle}
                        />
                      </Grid>
                      {isEditing && (
                        <Grid item xs={12} sm={6}>
                          <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={(e) => handleFileChange(e.target.files)}
                          />
                          <div {...getRootProps({ className: classes.dropzone })}>
                            <input {...getInputProps()} />


                            <CloudUploadIcon className={classes.uploadIcon} style={{ color: "#0B70FF" }} />

                            {isDragActive ? (
                              <Typography variant="body1">Drop the logo here</Typography>
                            ) : (
                              <>
                                <Typography variant="body1">
                                  Drag & drop your company logo here, or
                                  {/* Add a non-breaking space for spacing */}
                                </Typography>
                                <Typography variant="body2" className={classes.clickableText} style={{ cursor: "pointer" }}>
                                  {/* Apply clickableText style */}
                                  click to select a file
                                </Typography>
                              </>
                            )}

                            {selectedFileName && (
                              <Typography variant="caption" mt={1}>
                                Selected file: {selectedFileName}
                              </Typography>
                            )}
                          </div>

                          {/* Image Preview (Conditional Rendering) */}
                          {showPreview && selectedImageSrc && (
                            <MDBox mt={2} textAlign="center">
                              <img src={selectedImageSrc} alt="Preview" style={{ width: "30%" }} />
                            </MDBox>
                          )}
                        </Grid>
                      )}
                    </Grid>

                  </MDBox>
                </Grid>

                </CardContent>
                <CardActions>
                  {isEditing && (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ color: "white", backgroundColor: "#0B70FF" }} // Set button background color to blue
                      onClick={handleUpdateSubmit}
                      disabled={isLoading}
                      startIcon={
                        isLoading && (
                          <CircularProgress size={20} style={{ color: "white" }} /> // Set loading indicator color to white
                        )
                      }
                    >
                      {isLoading ? "Updating..." : "Update"}
                    </Button>
                  )}
                </CardActions>
                {/* Progress bar */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <LinearProgress variant="determinate" value={uploadProgress} />
                )}
              </Card>
            </MDBox>
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
      </div>
      <Snackbar open={openToast} autoHideDuration={6000} onClose={handleToastClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleToastClose} severity={toastSeverity}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default CompanyProfile;