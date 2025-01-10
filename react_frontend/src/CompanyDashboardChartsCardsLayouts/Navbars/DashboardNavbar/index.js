import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom"; // Import useNavigate
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import MDBox from "../../CompanyDashboardComponents/MDBox";
import Breadcrumbs from "../../Breadcrumbs";
import NotificationItem from "../../Items/NotificationItem";
// import { useAuthContext } from "../../../components/AuthContext";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "../DashboardNavbar/styles";
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "../../context";
import Tooltip from '@mui/material/Tooltip';
import axios from "axios";
 
function DashboardNavbar({ absolute, light, isMini }) {
  // const { handleLogout } = useAuthContext();
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate(); // Initialize useNavigate
 
  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_URL}Administration/logout_view/`,
        {},
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error("error while logout", error)
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem("isInsured", "yes");
    }
  }
 
  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }
 
    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }
 
    /**
     The event listener that's calling the handleTransparentNavbar function when
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);
 
    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();
 
    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);
 
  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  // const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);
 
  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
    </Menu>
  );
 
  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;
      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }
      return colorValue;
    },
  });
  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
  const userAccess = Authorization ? localStorage.getItem('userAccess') : []
  const userAccessString = localStorage.getItem('userAccess');
  const userAccessCheck = userAccessString ? JSON.parse(userAccessString) : [];
  const showProfile = userAccessCheck.includes("company_Dashboard") || userAccessCheck.includes("companies_administration");
 
  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox color={light ? "white" : "inherit"}>
              {
                Authorization && userAccess.includes('companies_administration') && (
                  <Tooltip title="Insurer Dashboard" placement="bottom">
                    <Link to="/innovonadmindashboard">
                      <IconButton sx={navbarIconButton} size="small" disableRipple>
                        <Icon sx={iconsStyle}>dashboard</Icon>
                      </IconButton>
                    </Link>
                  </Tooltip>
                )
              }
              {showProfile && (
                <Tooltip title="Profile" placement="bottom">
                  <Link to="/dashboard/profile">
                    <IconButton sx={navbarIconButton} size="small" disableRipple>
                      <Icon sx={iconsStyle}>account_circle</Icon>
                    </IconButton>
                  </Link>
                </Tooltip>
              )}
              <Tooltip title="Menu" placement="bottom">
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarMobileMenu}
                  onClick={handleMiniSidenav}
                >
                  <Icon sx={iconsStyle} fontSize="medium">
                    {miniSidenav ? "menu_open" : "menu"}
                  </Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Settings" placement="bottom">
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarIconButton}
                  onClick={handleConfiguratorOpen}
                >
                  <Icon sx={iconsStyle}>settings</Icon>
                </IconButton>
              </Tooltip>
 
              {/* Sign Out Icon (You'll need to implement the sign-out action) */}
              <Tooltip title="Sign Out" placement="bottom">
                <IconButton
                  sx={navbarIconButton}
                  size="small"
                  disableRipple
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                    navigate('/');
                  }}
                  // onClick={handleSignOut} // Call handleSignOut on click
                >
                  <Icon sx={iconsStyle}>logout</Icon>
                </IconButton>
              </Tooltip>
              {renderMenu()}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}
 
// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};
 
// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};
 
export default DashboardNavbar;
 