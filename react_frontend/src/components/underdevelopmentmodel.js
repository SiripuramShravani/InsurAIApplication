import { Box,Typography, Modal } from '@mui/material'
import React,{useState, useEffect} from 'react'

 
    const [openUnderDevelopmentModal, setOpenUnderDevelopmentModal] = useState(false); // State for the modal
    // console.log(company); // Check the console to see the company object
    const handleCloseUnderDevelopmentModal = () => {
        setOpenUnderDevelopmentModal(false);
      };
      useEffect(() => {
        setOpenUnderDevelopmentModal(true); // Open the modal on mount
      }, []);
      
      return (
        <Modal
          open={openUnderDevelopmentModal}
          onClose={handleCloseUnderDevelopmentModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // Add a gray backdrop
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent gray
          }}
        >
          <Box sx={{
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            maxWidth: 400,
            textAlign: 'center',
          }}>
            <Typography variant="h5" className="Nasaliza" color="primary">
              This section is under development!!
            </Typography>
          </Box>
        </Modal>
      );
  