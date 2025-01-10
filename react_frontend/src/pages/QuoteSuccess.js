import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import contact from '../assets/contact.png';
import Header from '../components/header.js';
import Footer from '../components/footer.js';
import { useLocation } from 'react-router-dom';

const QuoteSuccess = () => {
    const location = useLocation();
    console.log("state in quote", location.state, JSON.parse(location.state?.PolicyIntakeAfterSubmitDetails));

    const PolicyIntakeAfterSubmitDetails = JSON.parse(location.state?.PolicyIntakeAfterSubmitDetails)
     
    // const PolicyIntakeAfterSubmitDetails = JSON.parse(localStorage.getItem('PolicyIntakeAfterSubmitDetails'));
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box>
            <Header />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Card
                    sx={{
                        width: { xs: '90%', md: '60%', lg: '50%' },
                        margin: '5rem 0rem',
                    }}
                >
                    <CardContent>
                        <Grid container justifyContent='center' >
                            <Grid item xs={12} md={10} lg={6}>
                                <Box sx={{ p: 1, textAlign: 'left' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <CheckCircleIcon
                                            sx={{ fontSize: isMobile ? 30 : 40, mr: 2, color: 'green', marginLeft: isMobile ? '0rem' : '-3rem' }}
                                        />
                                        <Typography
                                            className='Nasaliza'
                                            style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', whiteSpace: isMobile ? 'wrap' : 'nowrap', }}
                                        >
                                            Quote created successfully
                                        </Typography>
                                    </Box>
                                    <Typography variant='h6' sx={{ mb: 2 }} className='Nasaliza'>
                                        Quote ID :
                                        <span
                                            style={{
                                                color: '#0B70FF',
                                            }}
                                        >
                                            {PolicyIntakeAfterSubmitDetails.quote_number}
                                        </span>
                                    </Typography>
                                    <Typography variant='h6' sx={{ mb: 2 }} className='Nasaliza'>
                                        Quote Amount :
                                        <span style={{ color: '#0B70FF' }}>
                                            ${PolicyIntakeAfterSubmitDetails.quote_amount}
                                        </span>
                                    </Typography>
                                    <Typography
                                        variant='h6'
                                        sx={{ fontWeight: 'bold', mb: 1 }}
                                        className='Nasaliza'
                                    >
                                        Next Steps:
                                    </Typography>
                                    <ul style={{ listStyleType: 'none', padding: 0, paddingLeft: "1rem" }}>
                                        {[
                                            <span style={{ display: 'flex', alignItems: 'center', color: 'black', fontSize: "1.5rem", marginRight: "1rem" }}>
                                                ➞  {/* Right arrow */}
                                                <Typography
                                                    className='Nasaliza'
                                                    style={{
                                                        fontWeight: 'lighter',
                                                        fontSize: '0.8rem',
                                                        marginLeft: '0.5rem', // Add some space between arrow and text
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    Check your email for confirmation{' '}
                                                </Typography>
                                            </span>,
                                            <span style={{ display: 'flex', alignItems: 'center', color: 'black', fontSize: "1.5rem", marginRight: "1rem" }}>
                                                ➞  {/* Right arrow */}
                                                <Typography
                                                    className='Nasaliza'
                                                    style={{
                                                        fontWeight: 'lighter',
                                                        fontSize: '0.8rem',
                                                        marginLeft: '0.5rem', // Add some space between arrow and text
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    Our team will review your Policy
                                                </Typography>
                                            </span>,
                                            <span style={{ display: 'flex', alignItems: 'center', color: 'black', fontSize: "1.5rem", marginRight: "1rem" }}>
                                                ➞  {/* Right arrow */}
                                                <Typography
                                                    className='Nasaliza'
                                                    style={{
                                                        fontWeight: 'lighter',
                                                        fontSize: '0.8rem',
                                                        marginLeft: '0.5rem', // Add some space between arrow and text
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    We'll contact you if additional information is needed
                                                </Typography>
                                            </span>,
                                        ].map((step, index) => (
                                            <li
                                                key={index}
                                                style={{
                                                    marginBottom: '0.5rem',
                                                }}
                                            >
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                    <Box sx={{ mt: 4 }}>
                                        <Typography
                                            variant='h6'
                                            sx={{ fontWeight: 'bold', mb: 1 }}
                                            className='Nasaliza'
                                        >
                                            For support, contact us at:
                                        </Typography>
                                        <Typography
                                            className='Nasaliza'
                                            style={{ fontSize: '0.9rem', paddingLeft: "2rem", whiteSpace: isMobile ? 'wrap' : 'nowrap', }}
                                        >
                                            <img
                                                src={contact}
                                                width='4%'
                                                alt='email-mobile logo'
                                            />{' '}
                                            info@innovontek.com,  +5124561199
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
            <Footer />
        </Box>
    );
};

export default QuoteSuccess;
