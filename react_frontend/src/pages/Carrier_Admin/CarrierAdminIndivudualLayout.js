import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Box, Grid, Card, Paper, CardContent, Backdrop, CircularProgress, Modal, IconButton } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { Outlet, useLocation } from 'react-router-dom';
import { toast } from "react-toastify"; // Import toast for notifications
import { ToastContainer } from 'react-toastify';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillGearFill,
  BsMenuButtonWideFill,
  BsFillFileEarmarkFill, // New icon for Policies
  BsFillPersonFill, // New icon for Agents
  BsFillEyeFill, // New icon for View Profile
  BsArrowRight, // New icon for Sign Out 
  BsPencilSquare, // New icon for Update Profile
} from 'react-icons/bs';
// import { setCompany } from '../../state/authSlice.js';

const drawerWidth = 240;

const CarrierAdminIndividualLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { section } = useParams(); // Get the section from the URL
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [company, setCompany] = useState({}); // Now manage company state directly
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));




  useEffect(() => {
    const companyString = localStorage.getItem('carrier_admin_company');
    if (companyString) {
      setCompany(JSON.parse(companyString));
    }
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const currentIndex = menuItems.findIndex(item => item.url === currentPath);
    if (currentIndex !== -1) {
      setSelectedIndex(currentIndex);
    }
  }, [location.pathname]);


  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };



  const menuItems = [
    { text: 'Dashboard', icon: BsGrid1X2Fill, url: '/individual_company' }, // Default dashboard view
    { text: 'View Profile', icon: BsFillEyeFill, url: '/individual_company/view-profile' }, // View Company Profile 
    { text: 'Update Profile', icon: BsPencilSquare, url: '/individual_company/update-profile' }, // Update Company Profile 
    { text: 'Policies', icon: BsFillFileEarmarkFill, url: '/individual_company/policies' }, // Managing insurance policies (Related to customers)
    { text: 'Claims', icon: BsFillArchiveFill, url: '/individual_company/claims' }, // Managing claims (Results of policies)
    { text: 'Agents', icon: BsFillPersonFill, url: '/individual_company/agents' }, // Agent management (Related to policies/claims) 
    { text: 'Reports', icon: BsMenuButtonWideFill, url: '/individual_company/reports' }, // Generating reports (Data insights)
  ];


  const handlelogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/')
  }



  const imageSrc = company?.image_type ? `data:image/${company.image_type};base64,${company.image_data}` : null;
  const handleMenuItemClick = (index, url) => {
    setSelectedIndex(index);
    if (isMobile) {
      setDrawerOpen(false);
    }
    navigate(url);
  };

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString('default', { month: 'short' });

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: company.ic_primary_color
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2, ...(isMobile ? {} : { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

          {isMobile ? (
            <Grid container style={{ display: "flex", justifyContent: "space-between" }}>
              <Grid >
                <img src={imageSrc} style={{ width: 130 }} alt="Insurance Company Logo" />
              </Grid>
              <Grid>
                <Button color="inherit" onClick={handlelogout} sx={{ display: 'flex', alignItems: 'center', marginTop: "1.5rem" }} className='Nasaliza'>
                  <BsArrowRight style={{ fontSize: '1rem' }} />
                  <span style={{ marginLeft: '0.5rem' }}>Sign Out</span>
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container style={{ display: "flex", justifyContent: "space-between" }}>
              <Grid container alignItems="center" spacing={3} md={9}>
                <Grid item>
                  <img src={imageSrc} style={{ height: isMobile? "20px": "70px" }} alt="Insurance Company Logo" />
                </Grid>
                <Grid item>
                  <Typography variant="body2" className='Nasaliza'> {/* Smaller font size */}
                    ID: <span style={{ fontWeight: 'bold' }}>&nbsp;{company.ic_id}</span> {/* Bold value */}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" className='Nasaliza'>
                    Revenue: <span style={{ fontWeight: 'bold' }}>&nbsp;$2,345,678</span>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" className='Nasaliza'>
                    Claim Approval Rate: <span style={{ fontWeight: 'bold' }}>&nbsp;92%</span>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" className='Nasaliza'>
                    Premiums ({currentYear}/{currentMonth}): <span style={{ fontWeight: 'bold' }}>&nbsp;$50,000</span>
                  </Typography>
                </Grid>
              </Grid>
              <Grid md={1}>
                <Button color="inherit" onClick={handlelogout} sx={{ display: 'flex', alignItems: 'center', marginTop: "1rem" }} className='Nasaliza'>
                  <BsArrowRight style={{ fontSize: '1.5rem' }} />
                  <span style={{ marginLeft: '0.5rem' }}>Sign Out</span>
                </Button>
              </Grid>
            </Grid>
          )}




        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: company.ic_primary_color,  // Company primary color
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', ...(isMobile ? { mt: 2 } : { mt: 0 }) }}>
          <List sx={{ paddingTop: isMobile ? 0 : 3, paddingBottom: isMobile ? 2 : 0 }}>
            {menuItems.map((item, index) => (
              <ListItem key={item.text} disablePadding sx={{ pb: 2 }}>
                <ListItemButton
                  selected={selectedIndex === index}
                  onClick={() => handleMenuItemClick(index, item.url)}
                >
                  <ListItemIcon>
                    {<item.icon style={{ fontSize: '24px', color: 'white' }} />}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ className: 'Nasaliza', color: 'white', fontWeight: 'lighter' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', px: 0, py: 0 }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default CarrierAdminIndividualLayout;
