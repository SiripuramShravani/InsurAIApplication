import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Icon from "@mui/material/Icon";
import MDBox from "../CompanyDashboardComponents/MDBox";
import {
  collapseItem,
  collapseIconBox,
  collapseText,
} from "./styles/sidenavCollapse";
import { useMaterialUIController } from "../../CompanyDashboardChartsCardsLayouts/context";

function SidenavCollapse({ icon, name, route, ...rest }) {
  const [controller] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
 
   const isActive = () => {
    const currentPath = location.pathname;
    
     if (route === '/dashboard') {
      return currentPath === '/dashboard' || 
             currentPath === '/dashboard/dashboard' || 
             currentPath === '/';
    }

     const normalizedCurrentPath = currentPath.replace('/dashboard/', '/');
    const normalizedRoute = route.replace('/dashboard/', '/');

    return normalizedCurrentPath.startsWith(normalizedRoute);
  };

  const active = isActive();

  return (
    <ListItem component="li">
      <MDBox
        {...rest}
        sx={(theme) => ({
          ...collapseItem(theme, {
            active,
            transparentSidenav,
            whiteSidenav,
            darkMode,
            sidenavColor
          }),
           ...(active && {
            backgroundImage: `linear-gradient(195deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
            color: `${whiteSidenav ? theme.palette.info.main : '#fff'} !important`,
            opacity: 1,
            borderRadius: '0.375rem',
            boxShadow: `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)`,
            '&:hover': {
              backgroundColor: `${theme.palette.info.main} !important`,
              opacity: 1
            }
          })
        })}
      >
        <ListItemIcon
          sx={(theme) => ({
            ...collapseIconBox(theme, {
              transparentSidenav,
              whiteSidenav,
              darkMode,
              active
            }),
            ...(active && {
              color: `${whiteSidenav ? theme.palette.info.main : '#fff'} !important`,
              '& .MuiIcon-root': {
                color: `${whiteSidenav ? theme.palette.info.main : '#fff'} !important`
              }
            })
          })}
        >
          {typeof icon === "string" ? (
            <Icon>{icon}</Icon>
          ) : (
            icon
          )}
        </ListItemIcon>

        <ListItemText
          primary={name}
          sx={(theme) => ({
            ...collapseText(theme, {
              miniSidenav,
              transparentSidenav,
              whiteSidenav,
              active
            }),
            ...(active && {
              '& .MuiTypography-root': {
                color: `${whiteSidenav ? theme.palette.info.main : '#fff'} !important`,
                fontWeight: '600 !important'
              }
            })
          })}
        />
      </MDBox>
    </ListItem>
  );
}

SidenavCollapse.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
};

export default SidenavCollapse;