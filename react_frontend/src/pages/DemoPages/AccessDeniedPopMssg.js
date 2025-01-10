import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography,Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const PopupMessage = ({ open, onClose }) => {
  const navigate = useNavigate(); // Hook for navigation

  if (!open) return null;

  const handleOkClick = () => {
    onClose(); // Close the popup
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Background blur effect */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(5px)',
          zIndex: 1300, // Make sure it's on top of other content
        }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks on blur background from closing the popup
      />
      {/* Popup Dialog */}
      <Dialog 
        open={open} 
        onClose={(e) => e.stopPropagation()} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{ style: { zIndex: 1400 } }}
      >
        <DialogTitle className="Nasaliza" sx={{ color: '#001066' }}>Access Denied</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You don't have access to this page. If you need access, please contact the Admin at
              &nbsp;<a href="mailto:info@innovontek.com">info@innovontek.com</a>.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOkClick} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )}

  export default PopupMessage;