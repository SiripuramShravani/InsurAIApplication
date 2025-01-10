import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,Table, TableBody, TableCell, Container, TableContainer, TableHead, TextField,Tooltip,
  TableRow, Typography, Paper, Grid, Snackbar, Alert, Checkbox, useTheme, useMediaQuery
} from '@mui/material';
import StyledButtonComponent from '../../components/StyledButton';
import AddRoles from './AddRoles';
 import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
const initialPermissionData = [
  'claim_intake',
  'policy_intake',
  'loss_runs',
  'med_bills',
  'user_administration',
  'companies_administration',
  'company_admin',
  'claim_manager',
  'adjuster',
  'underwriter',
  'reports_analyst'
];
 
 
const RolesList = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [editedRole, setEditedRole] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: '' });
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
 
  useEffect(() => {
    // Fetch roles data from API
    axiosInstance.post('Administration/get_all_roles/')
      .then(response => {
 
        console.log(response);
        setRoles(response.data)
      }
 
 
      )
 
      .catch(error => {
        console.error('Error fetching roles:', error);
        setNotification({
          open: true,
          message: 'Error fetching roles. Please try again later.',
          severity: 'error',
        });
      });
  }, []);
 
  // localStorage.setItem('roleitem', JSON.stringify(roleList));
 
  const handleAddUserSuccess = () => {
    setShowAddUser(false);
    setNotification({ open: true, message: 'Role added successfully!', severity: 'success' });
    // Refetch roles after adding a new role
    axiosInstance.post('Administration/get_all_roles/')
      .then(response => {
        console.log(response);
 
        setRoles(response.data)
      }
      )
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
  };
 
  const handleEditClick = () => setIsEditing(true);
 
 
  const handleSaveClick = () => {
    axiosInstance.post('Administration/update_role/', { editedRole, old_role: selectedRole.role })
      .then(response => {
        setNotification({ open: true, message: 'Role updated successfully!', severity: 'success' });
 
        // Refetch roles to ensure the updated data is displayed
        axiosInstance.post('Administration/get_all_roles/')
          .then(response => {
            setRoles(response.data);
            setIsEditing(false);
        
          })
          .catch(error => {
            console.error('Error fetching roles after update:', error);
            setNotification({ open: true, message: 'Error fetching updated roles.', severity: 'error' });
          });
 
      })
      .catch(error => {
        console.error('Error saving role:', error);
        setNotification({ open: true, message: 'Error saving role. Please try again later.', severity: 'error' });
      });
  };
 
  const handleCancelClick = () => {
    setIsEditing(false);
    setSelectedRole(null);
    setEditedRole(null);
 
    // Refetch roles to reset the state to the original data
    axiosInstance.post('Administration/get_all_roles/')
      .then(response => setRoles(response.data))
      .catch(error => {
        console.error('Error fetching roles on cancel:', error);
        setNotification({ open: true, message: 'Error resetting roles data.', severity: 'error' });
      });
  };
 
 
  const handleInputChange = (e) => {
    setEditedRole({ ...editedRole, [e.target.name]: e.target.value });
  };
 
  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setEditedRole({ ...role });
    // Set permissions based on the Access array of the selected role
    const updatedPermissions = initialPermissionData.map((permission) => ({
      label: permission,
      fullAccess: role.Access.includes(permission),
    }));
    setPermissions(updatedPermissions);
    setIsEditing(false);
  };
 
  const handleCheckboxChange = (label) => (event) => {
    const updatedPermissions = permissions.map(permission =>
      permission.label === label ? { ...permission, fullAccess: event.target.checked } : permission
    );
    setPermissions(updatedPermissions);
    // Update editedRole with new permissions
    setEditedRole({ ...editedRole, Access: updatedPermissions.filter(p => p.fullAccess).map(p => p.label) });
  };
 
  const CustomStylesForTextFields = {
    '&:before': { borderBottom: '1px solid rgba(0, 0, 0, 0.42)' },
    '&:hover:not(.Mui-disabled):before': { borderBottom: '1px solid rgba(0, 0, 0, 0.87)' },
    '&.Mui-focused:after': { borderBottom: '2px solid rgba(0, 0, 0, 0.87)' },
    '& .MuiInputBase-input': { fontSize: isMobile ? '12px' : '13px' },
  };
 
  const handleDeleteClick = (roleToDelete) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the role '${roleToDelete}'?`);
 
    if (!confirmDelete) {
      return; // If the user cancels, exit the function
    }
 
    axiosInstance.post('Administration/delete_role/', { role: roleToDelete })
      .then(response => {
        setNotification({ open: true, message: 'Role deleted successfully!', severity: 'success' });
        // Remove the deleted role from the roles list
        setRoles(roles.filter(role => role.role !== roleToDelete));
        handleCancelClick();
      })
      .catch(error => {
        console.error('Error deleting role:', error);
        setNotification({ open: true, message: 'Error deleting role. Please try again later.', severity: 'error' });
      });
  };
  const labelMap = {
    claim_intake: 'Claim Intake',
    policy_intake: 'Policy Intake',
    loss_runs: 'Loss Runs',
    med_bills: 'Medical Bills',
    companies_administration: 'Companies Administration',
    company_admin: 'Company Admin',
    claim_manager:'Manager',
    adjuster: 'Adjuster',
    underwriter: 'Underwriter',
    reports_analyst: 'Reports Analyst',
    agent_admin: 'Agent Admin'
  };
 
  return (
    <>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={notification.severity}
          onClose={() => setNotification({ ...notification, open: false })}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      {showAddUser ? (
        <AddRoles onSuccess={handleAddUserSuccess} onCancel={() => setShowAddUser(false)} />
      ) : (
        <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto', height: 'auto' }}>
          <Container maxWidth="lg">
            {selectedRole ? (
              <>
                <Box sx={{ padding: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2} sx={{ borderBottom: '2px solid #e0e0e0' }}>
                    <Typography variant="h6" color={'#001066'}>Role Details</Typography>
                    <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
                      {/* <StyledButtonComponent buttonWidth={150} variant="contained" color="primary" onClick={() => setShowAddUser(true)}>Add Roles</StyledButtonComponent> */}
                      {!isEditing ? (
                           <Tooltip title="Edit" arrow placement="top">

                             <EditIcon onClick={handleEditClick} variant="outlined" sx={{ color: 'blue', cursor: 'pointer' }} />
                           </Tooltip>
                        // <StyledButtonComponent buttonWidth={150} variant="outlined" startIcon={<EditIcon />} onClick={handleEditClick}>Edit</StyledButtonComponent>
                      ) : (
                        <Tooltip title="Save" arrow placement="top">

                          <SaveIcon variant="contained" onClick={handleSaveClick} sx={{ color: '#001066', cursor: 'pointer' }} />
                        </Tooltip>
                        
                      )}
                         <Tooltip title="Cancel" arrow placement="top">

                      <CancelIcon variant="outlined" onClick={handleCancelClick} sx={{ color: 'red', cursor: 'pointer' }} />
                         </Tooltip>
                         <Tooltip title="Delete" arrow placement="top">

                      <DeleteIcon variant="outlined" onClick={() => handleDeleteClick(selectedRole.role)} sx={{ color: 'red', cursor: 'pointer' }} />
                         </Tooltip>
                      
                    </Box>
                  </Box>
                  {isEditing ? (
                    <Grid container spacing={2} sx={{ marginBottom: 4, marginTop: 4 }}>
                      <Grid item xs={12}>
                        <TextField
                          label="Role Name"
                          name="role"
                          fullWidth
                          variant="standard"
                          value={editedRole?.role || ''}
                          InputProps={{ readOnly: !isEditing }}
                          onChange={handleInputChange}
                          sx={isEditing && CustomStylesForTextFields}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Description"
                          fullWidth
                          variant="standard"
                          name="Description"
                          multiline
                          rows={2}
                          value={editedRole?.Description || ''}
                          InputProps={{ readOnly: !isEditing }}
                          onChange={handleInputChange}
                          sx={isEditing && CustomStylesForTextFields}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                        <Typography sx={{ color: 'black', fontWeight: 'bold', minWidth: 120 }}>Role Name:</Typography>
                        <Typography>{selectedRole.role}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ color: 'black', fontWeight: 'bold', minWidth: 120 }}>Description:</Typography>
                        <Typography>{selectedRole.Description}</Typography>
                      </Box>
                    </>
                  )}
 
                  <TableContainer component={Paper} sx={{ marginTop: 4 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="permissions table">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'black', fontWeight: 'bold', fontSize: '15px' }}>Permissions</TableCell>
                          <TableCell sx={{ color: 'black', fontWeight: 'bold', fontSize: '15px' }}>Full Access</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {permissions.map(permission => (
                          <TableRow key={permission.label}>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold', fontSize: '15px' }}>
                              {labelMap[permission.label] || permission.label}  {/* Map label or fallback to original */}
                            </TableCell>
                            <TableCell>
                              <Checkbox
                                checked={permission.fullAccess}
                                onChange={handleCheckboxChange(permission.label)}
                                disabled={!isEditing}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </>
            ) : (
              <>
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2} sx={{ borderBottom: '2px solid #e0e0e0' }}>
                  <Typography variant="h5" color="#001066">
                    Roles List
                  </Typography>
                  <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
                    <StyledButtonComponent
                      buttonWidth={150}
                      variant="contained"
                      color="primary"
                      onClick={() => setShowAddUser(true)}
                      className="Nasaliza"
                    >
                      Add Role
                    </StyledButtonComponent>
                  </Box>
                </Box>
                <TableContainer component={Paper} sx={{ width: '100%', maxHeight: 430, overflow: 'auto' }}>
 
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: 'black', fontWeight: 'bold', fontSize: '15px' }}>Role</TableCell>
                        <TableCell sx={{ color: 'black', fontWeight: 'bold', fontSize: '15px' }}>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {roles.map(role => (
                        <TableRow key={role.id} hover onClick={() => handleRoleClick(role)}>
                          <TableCell sx={{ color: 'blue', cursor: 'pointer' }}>{role.role}</TableCell>
                          <TableCell>{role.Description}</TableCell>
                        </TableRow>
                      ))}
 
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </Container>
        </Box>
      )}
    </>
  );
};
 
export default RolesList;
 
