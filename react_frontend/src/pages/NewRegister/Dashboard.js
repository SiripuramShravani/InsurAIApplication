import React, { useState } from "react";
import Header from '../../components/header';
import Footer from "../../components/footer";
import {
    Box, Stepper, Step, StepLabel, useMediaQuery, useTheme, Typography
} from '@mui/material';
import { Person, Group } from '@mui/icons-material'; 
import UserList from "./UserList";
import RolesList from "./RolesList";

export default function UserDashboard() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    const [activeStep, setActiveStep] = useState(0); // Default active step is 0

    // Define steps and their labels
    const steps = ['Users', 'Roles'];
    const stepIcons = [<Person />, <Group />]; // Icons for each step

    // Handle step change
    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    return (
        <>
            <Header />

            <Box 
                sx={{ 
                    bgcolor: '#f4f6f8', 
                    paddinTop: isMobile ? '1rem' : '2rem', 
                    display: 'flex', 
                    flexDirection: isDesktop ? 'row' : 'column' 
                }}
            >
                <Box 
                    sx={{ 
                        bgcolor: '#0B70ff',
                        color: 'white',
                        width: isDesktop ? '20%' : '100%', // Sidebar width on larger screens, full width on smaller screens
                        padding: '1rem',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start', // Align to the start for larger screens
                        gap: 2,paddingTop:'3rem'
                    }}
                >
                    <Stepper
                        activeStep={activeStep}
                        orientation={isDesktop ? 'vertical' : 'vertical'} // Vertical on desktop, horizontal on mobile
                        sx={{
                            width: '100%',
                            '& .MuiStepConnector-root .MuiStepConnector-line': {
                                borderWidth: '2px',
                                height: isDesktop ? 70 : 2,
                                borderColor: 'white'
                                
                            },
                            '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                                borderColor: 'white'
                            },
                            '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                                borderColor: 'white'
                            },
                            '& .MuiStepLabel-root': {
                                whiteSpace: 'nowrap',
                                padding: 0,
                                margin: 0,
                            },
                        }}
                    >
                        {steps.map((label, index) => (
                            <Step    key={label}
                            completed={index < activeStep}>
                                <StepLabel>
                                    <Box 
                                        sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            cursor: 'pointer',
                                            color: activeStep === index ? '#001066' : 'white',
                                            mb: 1, // Margin bottom to space out steps
                                        }}
                                        onClick={() => handleStepChange(index)}
                                    >
                                        {stepIcons[index]}
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                fontWeight: activeStep === index ? 'bold' : 'normal',
                                                color: activeStep === index ? '#001066' : 'white',
                                            }}
                                        >
                                            {label}
                                        </Typography>
                                    </Box>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                <Box sx={{ width: '100%', padding: '3rem', boxSizing: 'border-box' }}>
                    {/* Display content based on active step */}
                    {activeStep === 0 && <UserList />}
                    {activeStep === 1 && <RolesList />}
                </Box>
            </Box>

            <Footer />
        </>
    );
}
