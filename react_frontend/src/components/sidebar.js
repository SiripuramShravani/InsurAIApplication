import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from '@mui/material';

import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
} from 'react-icons/bs';

const drawerWidth = 240; // Set your desired sidebar width

function Sidebar() {
  const [openSidebar, setOpenSidebar] = useState(false); // State for sidebar visibility

  const handleDrawerOpen = () => {
    setOpenSidebar(true);
  };

  const handleDrawerClose = () => {
    setOpenSidebar(false);
  };

  const menuItems = [
    { text: 'Dashboard', icon: BsGrid1X2Fill, href: '/' }, // Add actual URLs here
    { text: 'Products', icon: BsFillArchiveFill, href: '/products' },
    { text: 'Categories', icon: BsFillGrid3X3GapFill, href: '/categories' },
    { text: 'Customers', icon: BsPeopleFill, href: '/customers' },
    { text: 'Inventory', icon: BsListCheck, href: '/inventory' },
    { text: 'Reports', icon: BsMenuButtonWideFill, href: '/reports' },
    { text: 'Settings', icon: BsFillGearFill, href: '/settings' },
  ];

  return (
    <div>
      <BsCart3 className="icon_header" onClick={handleDrawerOpen} /> {/* Open sidebar button */}

      <Drawer
        variant="temporary" // You can change this to 'permanent' if you want a always-visible sidebar
        open={openSidebar}
        onClose={handleDrawerClose}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton component="a" href={item.href}>
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
}

export default Sidebar;