import React, { useState, useEffect } from 'react';
import {
  Box, Avatar, Typography, Table, TableBody, TableCell, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Tooltip,
  TableContainer, TableHead, InputAdornment, useMediaQuery, useTheme, TablePagination, TableRow, Paper, Container, Snackbar, Alert, Card, CardContent, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddUser from './AddUser';
import StyledButtonComponent from '../../components/StyledButton';
// import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import CancelIcon from '@mui/icons-material/Cancel';
import { Search as SearchIcon, Visibility as VisibilityIcon } from '@mui/icons-material';



const UserList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [showAddUser, setShowAddUser] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: '' });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([])
  const [refreshUsers, setRefreshUsers] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });
  
  const [companies, setCompanies] = useState([])
  const CustomStylesForTextFileds = {
    '&:before': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
    },
    '&:hover:not(.Mui-disabled):before': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
    },
    '&.Mui-focused:after': {
      borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
    },
    '& .MuiInputBase-input': {
      fontSize: isMobile ? '12px' : '13px',
    },
  };
  useEffect(() => {
    // Fetch users whenever the component mounts or `refreshUsers` changes
    axiosInstance.post('Administration/get_all_users/')
      .then(response => {
        console.log(response);

        setUsers(response.data);
        // setRoleItem(response.data.)
      })
      .catch(error => {
        console.error("There was an error fetching the users!", error);
      });
  }, [refreshUsers]);
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

      });
  }, []);
  useEffect(() => {
    axiosInstance.get('get-company-names/')
      .then(response => {

        console.log(response.data.company_names);
        setCompanies(response.data.company_names)
      })
      .catch(error => {
        console.error('Error fetching roles:', error);

      });
  }, []);
  const roleList = roles.map(item => item.role);
  const handleAddUserSuccess = () => {
    setShowAddUser(false);

    setNotification({ open: true, message: 'User added successfully!', severity: 'success' });
    setRefreshUsers(prev => !prev);
  };

  const handleEditUser = () => {
    setEditMode(true);
  };

  const onCancel = () => {
    setSelectedUser(null);
  };
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email_id: user.email_id,
      mobile_number: user.mobile_number,
      role: user.role,
      company_name: user.company_name
    });
    setErrors({});
  };

  const handleSaveUser = () => {
    // Validate form data
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.email_id) newErrors.email_id = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email_id)) newErrors.email_id = 'Email is invalid';
    if (!formData.role) newErrors.role = 'Role is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log(selectedUser.email_id);

    if (!['Adjuster', 'Underwriter', 'Reports Analyst', 'Manager', 'Agent Admin'].includes(formData.role)) {
      setFormData(prevState => ({
        ...prevState,
        company_name: ''
      }));
    }

    axiosInstance.post('Administration/update_user/', { updated_data: formData, old_email: selectedUser.email_id })
      .then(response => {
        setNotification({ open: true, message: 'User updated successfully!', severity: 'success' });
        console.log(formData);

        setEditMode(false);

        setSelectedUser(null);
        setRefreshUsers(prev => !prev);
        // setUsers(prevUsers => prevUsers.map(user => user.id === selectedUser.id ? formData : user));
      })
      .catch(error => {
        console.error("There was an error updating the user!", error);
        setNotification({ open: true, message: 'Failed to update user', severity: 'error' });
      });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  // Handle delete user
  const handleDeleteUser = () => {
    // Confirm before deletion
    if (window.confirm(`Are you sure you want to delete user ${selectedUser.first_name} ${selectedUser.last_name}?`)) {
      axiosInstance.post('Administration/delete_user/', {
        email_id: selectedUser.email_id  // Send the email or ID to delete
      })
        .then(response => {
          setNotification({ open: true, message: 'User Deleted successfully!', severity: 'success' });
          setEditMode(false);
          setSelectedUser(null);
          setRefreshUsers(prev => !prev);
          // Handle success
          // onDeleteUser(); // Callback to refresh the user list or handle post-deletion state
        })
        .catch(error => {
          // Handle error
          console.error("There was an error deleting the user!", error);
        });
    }
  }
  const CancelAddUser = () => {
    setShowAddUser(false);
    // setNotification({ open: true, message: 'User added successfully!', severity: 'success' });
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage,] = useState(5);


  const [searchQuery, setSearchQuery] = useState('');


  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    return (
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email_id?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
        <AddUser onSuccess={handleAddUserSuccess} onCanceled={CancelAddUser} />
      ) : selectedUser ? (
        <Container>
          <Card sx={{ marginTop: 2, padding: 2, textAlign: 'center', position: 'relative' }}>

            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                {/* <Avatar src={selectedUser.avatar} alt={selectedUser.first_name} sx={{ marginBottom: 2, width: 80, height: 80 }} /> */}
                {editMode ? (
                  <>
                    <Grid container spacing={3} alignItems="center">
                      {/* <Typography sx={{color:'red',textAlign:'center',margin:"auto"}}>backendErrors</Typography> */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="First Name"
                          name="first_name"
                          required
                          fullWidth
                          variant="standard"
                          value={formData.first_name}
                          onChange={handleChange}
                          error={!!errors.first_name}
                          helperText={errors.first_name}
                          sx={CustomStylesForTextFileds}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Last Name"
                          name="last_name"
                          variant="standard"
                          value={formData.last_name}
                          onChange={handleChange}
                          error={!!errors.last_name}
                          helperText={errors.last_name}
                          fullWidth
                          sx={CustomStylesForTextFileds}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Email"
                          name="email_id"
                          variant="standard"
                          value={formData.email_id}
                          onChange={handleChange}
                          error={!!errors.email_id}
                          helperText={errors.email_id}
                          fullWidth
                          sx={CustomStylesForTextFileds}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Mobile number"
                          name="mobile_number"
                          variant="standard"
                          value={formData.mobile_number}
                          onChange={handleChange}
                          error={!!errors.mobile_number}
                          helperText={errors.mobile_number}
                          fullWidth
                          sx={CustomStylesForTextFileds}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={{ marginBottom: 2, borderBottom: '1px solid gray' }}>
                          <InputLabel>Role</InputLabel>
                          <Select
                            label="Role"
                            name="role"
                            variant="standard"
                            value={formData.role}
                            onChange={handleChange}
                            error={!!errors.role}
                            style={{ textAlign: 'left' }}
                          >
                            {roleList.map((roleitem) => (
                              <MenuItem key={roleitem} value={roleitem}>
                                {roleitem}
                              </MenuItem>
                            ))}
                          </Select>

                        </FormControl>
                      </Grid>
                      {['Adjuster', 'Underwriter', 'Reports Analyst', 'Manager', 'Agent Admin'].includes(formData.role) &&


                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth sx={{ marginBottom: 2, borderBottom: '1px solid gray' }}>
                            <InputLabel>Company Name</InputLabel>
                            <Select
                              label="Company Name"
                              name="company_name"
                              variant="standard"
                              value={formData.company_name}
                              onChange={handleChange}
                              error={!!errors.role}
                              style={{ textAlign: 'left' }}
                            >
                              {companies.map((roleitem) => (
                                <MenuItem key={roleitem} value={roleitem}>
                                  {roleitem}
                                </MenuItem>
                              ))}
                            </Select>

                          </FormControl>
                        </Grid>
                      }
                      <Box display="flex" width="100%" margin={'auto'}>
                        <StyledButtonComponent buttonWidth={'150px'} variant="contained" color="primary" onClick={handleSaveUser}>
                          Save
                        </StyledButtonComponent>
                        <StyledButtonComponent buttonWidth={'150px'} variant="outlined" color="secondary" onClick={handleCancelEdit}>
                          Cancel
                        </StyledButtonComponent>
                      </Box>
                    </Grid>

                  </>
                ) : (
                  <>
                    <Avatar src={selectedUser.avatar} alt={selectedUser.first_name} sx={{ marginBottom: 2, width: 80, height: 80 }} />
                    <Box sx={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'left' }}>
                      <Box sx={{ position: 'absolute', right: 16, top: 16, display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit" arrow placement="top">
                          <IconButton onClick={handleEditUser} sx={{ color: 'blue' }}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow placement="top">
                          <IconButton onClick={handleDeleteUser} sx={{ color: 'red' }}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Close" arrow placement="top">
                          <IconButton onClick={onCancel} sx={{ color: 'red' }}>
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th
                              style={{
                                textAlign: 'left',
                                padding: '8px',
                                borderBottom: '2px solid #ddd'
                              }}
                              colSpan="2"
                            >
                              User Details
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td
                              style={{
                                padding: '8px',
                                borderBottom: '1px solid #ddd',
                                textAlign: 'left'
                              }}
                            >
                              <strong>First Name:</strong>
                            </td>
                            <td
                              style={{
                                padding: '8px',
                                borderBottom: '1px solid #ddd',
                                textAlign: 'left'
                              }}
                            >
                              {selectedUser.first_name}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: '8px',
                                borderBottom: '1px solid #ddd',
                                textAlign: 'left'
                              }}
                            >
                              <strong>Last Name:</strong>
                            </td>
                            <td
                              style={{
                                padding: '8px',
                                borderBottom: '1px solid #ddd',
                                textAlign: 'left'
                              }}
                            >
                              {selectedUser.last_name}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: '8px',
                                borderBottom: '1px solid #ddd',
                                textAlign: 'left'
                              }}
                            >
                              <strong>Mobile Number:</strong>
                            </td>
                            <td
                              style={{
                                padding: '8px',
                                borderBottom: '1px solid #ddd',
                                textAlign: 'left'
                              }}
                            >
                              {selectedUser.mobile_number}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: '8px',
                                borderBottom: '1px solid #ddd',
                                textAlign: 'left'
                              }}
                            >
                              <strong>Email ID:</strong>
                            </td>
                            <td
                              style={{
                                padding: '8px',
                                borderBottom: '1px solid #ddd',
                                textAlign: 'left'
                              }}
                            >
                              {selectedUser.email_id}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: '8px',
                                borderBottom: '1px solid #ddd',
                                textAlign: 'left'
                              }}
                            >
                              <strong>Role:</strong>
                            </td>
                            <td
                              style={{
                                padding: '8px',
                                borderBottom: '1px solid #ddd',
                                textAlign: 'left'
                              }}
                            >
                              {selectedUser.role}
                            </td>
                          </tr>
                          {['Adjuster', 'Underwriter', 'Reports Analyst', 'Manager', 'Agent Admin'].includes(formData.role) && selectedUser.company_name &&
                            <tr>
                              <td
                                style={{
                                  padding: '8px',
                                  borderBottom: '1px solid #ddd',
                                  textAlign: 'left'
                                }}
                              >
                                <strong>Company Name:</strong>
                              </td>
                              <td
                                style={{
                                  padding: '8px',
                                  borderBottom: '1px solid #ddd',
                                  textAlign: 'left'
                                }}
                              >
                                {selectedUser.company_name}
                              </td>
                            </tr>
                          }
                          <tr>
                            <td
                              style={{
                                padding: '8px',
                                borderBottom: '1px solid #ddd',
                                textAlign: 'left'
                              }}
                            >
                              <strong>Status:</strong>
                            </td>
                            <td
                              style={{
                                padding: '8px',
                                borderBottom: '1px solid #ddd',
                                textAlign: 'left',
                                color: 'green'
                              }}
                            >
                              Active
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Container>
      ) : (
        <Container>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2} sx={{ borderBottom: '2px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ color: "#001066" }} className="Nasaliza">User List</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <StyledButtonComponent buttonWidth={150} className="Nasaliza" variant="contained" color="primary" onClick={() => setShowAddUser(true)}>
                Add User
              </StyledButtonComponent>
            </Box>
          </Box>

          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="user table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }} className="Nasaliza">User Details</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} className="Nasaliza">Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} className="Nasaliza">Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} className="Nasaliza">View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Sort the users by first_name */}
                {filteredUsers
                  .sort((a, b) => a.first_name.localeCompare(b.first_name)) // Sorting by first name
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar src={user.avatar} alt={user.name} sx={{ marginRight: 2 }} />
                          <Box>
                            <Typography variant="body1">{user.first_name} {user.last_name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {user.email_id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">{user.role}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ color: 'green' }}>
                          Active
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View" arrow placement="right">
                          <VisibilityIcon onClick={() => handleViewUser(user)} sx={{ color: 'blue', cursor: 'pointer' }} />
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[]}  // Removes the dropdown for selecting rows per page
              labelRowsPerPage="" // Hides the "Rows per page:" label
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`}
            />
          </TableContainer>
        </Container>

      )}
    </>
  );
};

export default UserList;