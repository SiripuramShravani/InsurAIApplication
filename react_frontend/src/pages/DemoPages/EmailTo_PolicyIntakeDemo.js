import React, { useState, useEffect } from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import DemoPolicyIntake from '../../assets/DemoPolicyIntake.png';
import PopupMessage from './AccessDeniedPopMssg';
import EmailToPolicyIntakeFun from '../Functionality/EmailToPolicyIntakeFun';
export default function EmailToPolicyIntakeDemo() {
  const [openPopup, setOpenPopup] = useState(false);
  
  useEffect(() => {
    const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
    const userAccess = Authorization ? JSON.parse(localStorage.getItem('userAccess')) : [];
    
    if (!userAccess.includes('policy_intake') || !Authorization) {
      setOpenPopup(true);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <>
      <Header />
      <Box sx={{ bgcolor: '#010066' }}>
      <Box sx={{ textAlign: 'center',    }}>
                <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold',paddingTop:"3rem", color: "white" }} className="Nasaliza">
                Mail2<span style={{color:'#0B70FF'}}>Quote</span>
                 </Typography>
                 <Typography sx={{ color: "orange", fontSize: "3rem" }} className="billy-title">Demo</Typography>
               </Box>
        <Box
          sx={{
            padding: { xs: '20px', md: '40px' },
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

          }}
        >
          <Grid container spacing={4}>
         
            <Grid item xs={12} md={6}>
               
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>

                <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: '10px', color: "white" }} className="Nasaliza" >
                  Revolutionize Submission with AI-Powered Mail Automation
                </Typography>
                <Typography sx={{ marginTop: '20px', color: '#B3C1FF',
                textAlign: 'justify',
                hyphens: 'auto',
                wordBreak: 'break-word',
                '& > span': { display: 'inline-block' }}}>
                  Our AI-powered Mail2Quote feature intelligently extracts key information
                  from emails and attachments, ensuring faster response times and improved accuracy in
                  Policy handling.
                </Typography>
                <Box sx={{ marginTop: '30px', display: 'flex', justifyContent: { xs: 'center', md: 'left' } }}>
                  <Box sx={{ marginRight: '30px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: "white" }} className="Nasaliza" >
                      Improved Accuracy with InsurAI
                    </Typography>
                    <Typography sx={{ color: '#B3C1FF',
                    textAlign: 'justify',
                    hyphens: 'auto',
                    wordBreak: 'break-word',
                    '& > span': { display: 'inline-block' }}}>
                      Leverages advanced LLMs to precisely extract and categorize claim information, minimizing human error.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: "white" }} className="Nasaliza" >
                      Enhanced Customer Satisfaction
                    </Typography>
                    <Typography sx={{ color: '#B3C1FF',
                     textAlign: 'justify',
                     hyphens: 'auto',
                     wordBreak: 'break-word',
                     '& > span': { display: 'inline-block' }}}>
                      Provides instant claim status updates via automated emails, enhancing transparency and trust.
                    </Typography>
                  </Box>
                </Box>

              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: '100%',
                  height: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '3.5rem',
                  marginBottom: "2rem"
                }}
              >
                <Typography variant="h6" sx={{ color: 'gray' }}>
                  <img src={DemoPolicyIntake} alt='DemoPolicyIntake' />
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ bgcolor: '#f0f4fa' }}>

        <Box sx={{ p: { xs: 2, sm: 4, md: 8, width: "100%", maxWidth: 1200, margin: "auto" }, }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6} sx={{ textAlign: "left" }}>

              <Typography variant="h4" component="h2" className="Nasaliza" sx={{ color: '#001066', fontSize: '2rem',
               textAlign: 'justify',
               hyphens: 'auto',
               wordBreak: 'break-word',
               '& > span': { display: 'inline-block' }}}>
                Streamline Submission with AI-Powered Mail Processing
              </Typography>
              <Typography variant="body1" paragraph sx={{marginTop:'1rem',
              textAlign: 'justify',
              hyphens: 'auto',
              wordBreak: 'break-word',
              '& > span': { display: 'inline-block' }}}>
                Streamline your policy submissions with our AI-powered Mail2Quote solution. This technology automates the extraction of crucial information from emails and their attachments, organizing and processing the data swiftly. As a result, it enhances policy management by ensuring quicker response times and greater precision in handling submissions.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 2, height: '200px' }}>
                    <CardContent>
                      <Typography variant="h3" component="div" gutterBottom>
                        95%
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="Nasaliza">
                        Accuracy in Data Extraction
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 2, height: '200px' }}>
                    <CardContent>
                      <Typography variant="h3" component="div" gutterBottom>
                        85%
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="Nasaliza">
                        Reduction in Processing Time
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 2, height: '200px' }}>
                    <CardContent>
                      <Typography variant="h3" component="div" gutterBottom>
                        24/7
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="Nasaliza">
                        Instant Policy Submission
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 2, height: '200px' }}>
                    <CardContent>
                      <Typography variant="h3" component="div" gutterBottom>
                        100%
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="Nasaliza">
                        Enhanced customer Satisfaction
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <EmailToPolicyIntakeFun />
      <Footer />
      {/* Popup component */}
   
<PopupMessage open={openPopup} onClose={() => setOpenPopup(false)} />

    </>
  );
}
