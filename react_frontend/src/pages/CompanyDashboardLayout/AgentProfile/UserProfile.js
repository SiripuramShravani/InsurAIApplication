 

import React, { useState, useEffect } from "react";
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
import { states } from "../../../data/states";

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
    borderRadius: "8px", // Using a standard Material-UI border radius
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
    marginBottom: theme.spacing(1),
  },
  description: {
    color: "#9a9a9a",
    fontWeight: 100,
    fontSize: "1.1rem",
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
    borderRadius: "0", // Remove border-radius for square buttons
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
  btnFacebook: {
    backgroundColor: "#3b5998",
  },
  btnTwitter: {
    backgroundColor: "#1DA1F2",
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
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// const initialValues = {
//   agent_email: "",
//   agent_mobile: "",
//   agent_address1: "",
//   agent_address2: "",
//   agent_city: "",
//   agent_commission_rate: "",
//   agent_country: "",
//   agent_fax: "",
//   agent_mobile: "",
//   agent_state: "",
//   agent_street: "",
//   agent_zip: "",
//   ic_id: "",   
// };

function UserProfile({ selectedAgentID, agentDetails, onUpdateSuccess }) {
  const classes = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAgentData, setEditedAgentData] = useState({ ...agentDetails });
  const [openToast, setOpenToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState('success');
  const [toastMessage, setToastMessage] = useState('');
  const [state, setState] = useState(agentDetails.agent_state || "");
  const [country, setCountry] = useState(agentDetails.agent_country || "");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });

  let {
    agent_email,
    agent_mobile,
    agent_address1,
    agent_address2,
    agent_city,
    agent_commission_rate,
    agent_country,
    agent_fax,     
    agent_state,
    agent_street,
    agent_zip,
    ic_id,   
  }=editedAgentData;


// start  update agent profile
const handleInputChange = (event) => {
  const { name, value } = event.target;
  if (name === 'agent_state') {
    setState(value);
  } else if (name === 'agent_country') {
    setCountry(value);
  }
  setEditedAgentData({
    ...editedAgentData,
    [name]: value,
  });
};
console.log("edited data ",editedAgentData);


const handleUpdateSubmit = async () => {
  try {
    // Prepare data for the backend
    // Remove _id from the data before sending
    const { _id, ...dataToSend } = { 
      agent_id: selectedAgentID,
      ...editedAgentData
    };
    const response = await axiosInstance.put(
      'update_agent_details/', // Your backend API endpoint
      {"dataToSend" : dataToSend},
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    console.log("API Response:", response); // Log the full response for debugging
    
    console.log(response.data);
    

    if (response.status === 200) {
      setEditedAgentData(editedAgentData); // Update with data returned from the backend
      setIsEditing(false);
      // onUpdateSuccess(editedAgentData); 
      setToastSeverity("success"); // Set to "success" on successful update
      setToastMessage("Agent details updated successfully!");
      setOpenToast(true);
    } else {
      // Handle error responses from the backend
      console.error("Error updating agent details:", response.status, response.data); 

      setToastSeverity("error");
      setToastMessage(response.data.message || "Error updating agent details. Please try again later.");
      setOpenToast(true);
    }
  } catch (error) {
    console.error("Error updating agent details:", error);
    setToastSeverity("error");
    setToastMessage("An error occurred. Please try again later.");
    setOpenToast(true);
  }
};

// end of update agent profile

 

  useEffect(() => {
    // Reset editing state when a new agent is selected
    setIsEditing(false);
    setEditedAgentData({ ...agentDetails });
  }, [agentDetails]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Directly reset editedAgentData to the original agentDetails
    setEditedAgentData({ ...agentDetails });
  };

   




  console.log("edited agent data", editedAgentData);

 

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
    <div className={classes.content}>
      <Grid container spacing={3}>
        {/* Left Column - Form */}
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
                    Agent Profile ({selectedAgentID})
                  </MDTypography>
                  {isEditing ? (
                    <IconButton onClick={handleCancelEdit} style={{ color: "white" }}>
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
              <CardContent>
                <Grid container spacing={3} style={{ padding: "2rem" }}>
                  {/* ... Your CustomTextField components ... */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Agent Email"
                      fullWidth
                      required
                      variant="outlined"
                      name="agent_email"
                      value={agent_email || ""}
                      onChange={handleInputChange}
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      sx={customTextFieldStyle} // Apply inline styles
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Agent Mobile"
                      fullWidth
                      required
                      variant="outlined"
                      name="agent_mobile"
                      value={agent_mobile || ""}
                      onChange={handleInputChange}
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      sx={customTextFieldStyle} // Apply inline styles
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="companyID"
                      label="Company ID"
                      fullWidth
                      variant="outlined"
                      required
                      value={ic_id || ""} // No need to use editedAgentData
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={customTextFieldStyle} // Apply inline styles
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="agentCommissionRate"
                      label="Agent Commission Rate"
                      fullWidth
                      variant="outlined"
                      required
                      value={
                        agent_commission_rate || ""
                      }
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={customTextFieldStyle} // Apply inline styles
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="agent_address1"
                      label="Agent Address 1"
                      fullWidth
                      variant="outlined"
                      required
                      value={agent_address1 || ""}
                      onChange={handleInputChange}
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      sx={customTextFieldStyle} // Apply inline styles
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="agent_address2"
                      label="Agent Address 2"
                      fullWidth
                      variant="outlined"
                      value={agent_address2 || ""}
                      onChange={handleInputChange}
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      sx={customTextFieldStyle} // Apply inline styles
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="agent_street"
                      label="Agent Street"
                      fullWidth
                      variant="outlined"
                      required
                      value={agent_street || ""}
                      onChange={handleInputChange}
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      sx={customTextFieldStyle} // Apply inline styles
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="agent_city"
                      label="Agent City"
                      fullWidth
                      variant="outlined"
                      required
                      value={agent_city || ""}
                      onChange={handleInputChange}
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      sx={customTextFieldStyle} // Apply inline styles
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={customTextFieldStyle}>
                      <InputLabel id="state-select-label">State</InputLabel>
                      <Select
                        labelId="state-select-label"
                        id="state-select"
                        name="agent_state" 
                        value={agent_state} 
                        onChange={handleInputChange}
                        label="State"
                        required
                        inputProps={{
                          readOnly: !isEditing,
                        }}
                        sx={{
                          ...customTextFieldStyle, // Apply your custom styles
                          '& .MuiSelect-select': {
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: "left",
                            gap: '20px', 
                            margin: "1rem 0rem 0.6rem 0rem",
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
                      name="agent_zip"
                      label="Agent Zip"
                      fullWidth
                      variant="outlined"
                      required
                      value={agent_zip || ""}
                      onChange={handleInputChange}
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      sx={customTextFieldStyle} // Apply inline styles
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={customTextFieldStyle}>
                      <InputLabel id="country-select-label">Country</InputLabel>
                      <Select
                        labelId="country-select-label"
                        id="country-select"
                        name="agent_country" 
                        value={agent_country} 
                        onChange={handleInputChange}
                        label="Country"
                        required
                        inputProps={{
                          readOnly: !isEditing,
                        }}
                        sx={{
                          ...customTextFieldStyle, // Apply your custom styles
                          '& .MuiSelect-select': {
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: "left",
                            gap: '20px',
                            margin: "1rem 0rem 0.6rem 0rem",
                          },
                        }}
                        MenuProps={{
                          style: {
                            maxHeight: 300, 
                          },
                        }}
                      >
                        <MenuItem value="USA">USA</MenuItem> 
                        {/* Add more countries as needed */}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="agent_fax"
                      label="Agent Fax"
                      fullWidth
                      variant="outlined"
                      required
                      value={agent_fax || ""}
                      onChange={handleInputChange}
                      InputProps={{
                        readOnly: !isEditing,
                      }}
                      sx={customTextFieldStyle} // Apply inline styles
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                {isEditing ? (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ color: "white" }}
                    onClick={handleUpdateSubmit}
                  >
                    Update
                  </Button>
                ) : null}
              </CardActions>
            </Card>
          </MDBox>
        </Grid>
        {/* Right Column - Agent Details */}
        <Grid item xs={12} md={4}>
          <Card className={`${classes.card} ${classes.cardUser}`}>
            <CardContent>
              <div className={classes.author}>
                <Avatar
                  alt="Agent Name" // Replace with the agent's name
                  src="/path/to/agent/profile/picture.jpg" // Replace with the agent's profile picture path
                  sx={{ width: 30, height: 30, bgcolor: "#0B70FF", margin: "2rem auto" }} // Center the avatar
                >
                  <PersonIcon sx={{ fontSize: 60 }} />
                </Avatar>
                <Typography variant="h5" className={classes.name}>
                  {agentDetails.agent_first_name + " " + agentDetails.agent_middle_name + " " + agentDetails.agent_last_name}
                </Typography>
                <Typography variant="body2" className={classes.description} style={{ marginBottom: "0.5rem" }}>
                  HO Agent ({selectedAgentID})
                </Typography>
                <Typography variant="body2" className={classes.description} style={{ marginBottom: "2rem" }}>
                  Joined on : ({agentDetails.agent_joining_date})
                </Typography>
              </div>
              <Typography variant="body2" className={classes.longDescription} style={{ textAlign: "justify", padding: "1rem", color: "gray", fontSize: "0.9rem" }}>
                In P&C insurance, agents sell policies, assess client needs, and
                provide support throughout the policy lifecycle. They assist with
                applications, renewals, and claims, ensuring clients receive
                appropriate coverage and service. Strong sales and communication
                skills are essential for their role.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Toast for Success/Error Messages */}
      <Snackbar open={openToast} autoHideDuration={6000} onClose={handleToastClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleToastClose} severity={toastSeverity}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default UserProfile;
