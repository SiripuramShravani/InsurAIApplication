import React, { useState } from 'react';
import axios from 'axios'; // Make sure to install axios
import { Box, Container, Grid, Paper, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Typography, FormControl } from '@mui/material';
import StyledButtonComponent from '../../components/StyledButton'; // Assuming you have this component
 
const permissionOptions = [
  { key: 'claim_intake', label: 'Claim Intake' },
  { key: 'policy_intake', label: 'Policy Intake' },
  { key: 'loss_runs', label: 'Loss Runs' },
  { key: 'med_bills', label: 'Med Bills' },
  { key: 'user_administration', label: 'User Administration' },
  { key: 'companies_administration', label: 'Companies Administration' },
  { key: 'company_admin', label: 'Company Admin' },
  { key: 'claim_manager', label: 'Manager'},
  { key: 'adjuster', label: 'Adjuster'},
  { key: 'underwriter', label: 'Underwriter'},
  { key: 'reports_analyst', label: 'Reports Analyst'},
  { key: 'agent_admin', label: 'Agent Admin'}
 ];
 
const AddRoles = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    Role: '',
    Description: '',
    Access: permissionOptions.reduce((acc, { key }) => ({ ...acc, [key]: false }), {})
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(''); // For handling API errors
  const [isEditing, setIsEditing] = useState(true); // Set to true for editing
  const roleList = JSON.parse(localStorage.getItem('roleitem')) || [];
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
 
  const handleCheckboxChange = (permission) => (e) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      Access: { ...prev.Access, [permission]: checked }
    }));
  };
 
  const validateForm = () => {
    const newErrors = {};
    if (!formData.Role) newErrors.Role = 'Role Name is required';
    if (!formData.Description) newErrors.Description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSave = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Format the data
      const formattedData = {
        role: formData.Role,
        description: formData.Description,
        access: Object.keys(formData.Access).filter(permission => formData.Access[permission])
      };
 
      try {
        const response = await axiosInstance.post('Administration/add_new_role/', formattedData);
        if (response.status === 201) {
          onSuccess(); // Handle success
        } else {
          setApiError(response.data.error || 'An unexpected error occurred.');
        }
      } catch (error) {
        if (error.response) {
          // Backend error
          setApiError(error.response.data.error || 'An unexpected error occurred.');
        } else if (error.request) {
          // Network error
          setApiError('Network error. Please try again later.');
        } else {
          // Other errors
          setApiError('An unexpected error occurred.');
        }
      }
    }
  };
 
  const handleCancel = (e) => {
    e.preventDefault();
    onCancel();
  };
 
  return (
    <Box sx={{ borderTop: 'none', width: '100%', maxWidth: 1200, margin: 'auto' }}>
      <Container maxWidth="lg">
      {apiError && (
            <Grid item xs={12}>
              <Typography color="error" sx={{ mt: 2 }}>{apiError}</Typography>
            </Grid>
          )}
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
          <Typography variant="h6" color={'#001066'} className="Nasaliza">Add Role</Typography>
        </Box>
        <Grid container spacing={3} padding={3} boxSizing="border-box">
          <Grid item xs={12} sm={6} textAlign={'left'}>
            <FormControl fullWidth variant="standard" required>
              <TextField
                label="Role Name"
                name="Role" // Use the exact key from formData
                value={formData.Role}
                onChange={handleInputChange}
                error={!!errors.Role}
                helperText={errors.Role}
                variant="standard"
                required
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Description"
              name="Description" // Use the exact key from formData
              value={formData.Description}
              onChange={handleInputChange}
              error={!!errors.Description}
              helperText={errors.Description}
              fullWidth
              variant="standard"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Solutions</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Full Access</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {permissionOptions.map(({ key, label }) => (
                    <TableRow key={key}>
                      <TableCell>{label}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={formData.Access[key]}
                          onChange={handleCheckboxChange(key)}
                          disabled={!isEditing}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
         
          <Box sx={{ marginTop: 2, display: 'flex', gap: 2, justifyContent: 'center',margin:"auto" }}>
            <StyledButtonComponent
              buttonWidth={100}
              variant="contained"
              onClick={handleSave}
            >
              Save
            </StyledButtonComponent>
            <StyledButtonComponent
              buttonWidth={100}
              variant="outlined"
              onClick={handleCancel}
            >
              Cancel
            </StyledButtonComponent>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};
 
export default AddRoles;
 