import React from 'react';
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Typography, Box, Grid ,useMediaQuery} from '@mui/material';

import MedBillfun from '../Functionality/MedBillFun';
import MedBill_extractor from '../../assets/MedBill_extractor.png';
import { styled, useTheme } from '@mui/system';
 
 
 
 
// Styled components for the cards
const Card = styled(Box)(({ theme }) => ({
    backgroundColor: '#FFFFFF',
    borderRadius: '0px',
    border: '5px solid #E2F1F7',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    width: '300px',
    position: 'relative',
    overflow: 'hidden',
    margin: '10px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Added transition
    '&:hover': {
        transform: 'translateY(-10px)', // Makes the card float
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)', // Stronger shadow on hover
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
}));
 
const CardContent = styled(Box)(({ theme }) => ({
    flex: 1,
}));


 
const HeadingStyle = {
    textAlign: 'center',
};
const CardTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  textAlign: 'center',
  marginBottom: theme.spacing(1),
}));
 
const CardDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'center',
}));
 
const IconImage = styled('img')(({ theme }) => ({
  width: '50px',
  height: '50px',
  display: 'block',
  margin: '10px auto',
}));
export default function MedBillDemo() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  // For mobile screens

 
    return (
        <>
            <Header />
            <Box sx={{height:isMobile?'auto':'600px',
    backgroundImage: `url(${require('../../assets/Med_bills_5.avif')})`,
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',}}>
  {/* Top center heading */}
  <Box sx={HeadingStyle}>
    <Typography
      className="Nasaliza"
      variant="h1"
      sx={{
        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem" },
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Georgia, Times, serif',paddingTop:isMobile?'1rem':"0rem"
          // Adjust margin for different screen sizes
      }}
    >
       Doc<span style={{ color: '#0B70FF' }}>AI</span><sup style={{position: 'relative', top: '-2rem', right: '-0.1rem', fontSize: '0.5rem'}}>TM</sup> Med Bill
    </Typography>
 
    <Typography
      sx={{
        color: "orange",
        fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
        textAlign: 'center',
        marginTop: '10px',
        // textShadow: "0 0 8px rgba(255, 255, 255, 0.8)"
      }}
      className="billy-title"
    >
      Demo
    </Typography>
  </Box>
 
  {/* Content and Image */}
  <Grid container spacing={2} sx={{ width: { xs: '90%', md: '80%' }, mx: 'auto', position: 'relative', zIndex: 1 }}>
    {/* Left side: Content about MedBill extraction */}
    <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box>
        <Typography
          className="Nasaliza"
          variant="h4"
          sx={{
            color: '#ffffff',
            fontWeight: 400,
            letterSpacing: '0.5px',
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.7)',
            lineHeight: 1.2,
            mb: 2,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },  // Responsive font size
          }}
        >
        Med Bill Extraction
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#ffffff',
            fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
            fontWeight: 400,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            lineHeight: 1.6,
            textAlign: 'justify',
            hyphens: 'auto',
            wordBreak: 'break-word',
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },  // Adjust text size
            '& > span': { display: 'inline-block' },
          }}
        >
          Step into the future of data extraction, where lightning-fast precision meets revolutionary technology. Our  Med Bill extraction technology simplifies the process of managing and extracting information from medical bills. With high accuracy and efficiency, we ensure that you can focus on what matters most without the hassle of manual data entry.
        </Typography>
      </Box>
    </Grid>
 
    {/* Right side: Image */}
    <Grid item xs={12} md={6}>
      <Box
        component="img"
        src={MedBill_extractor} // Replace with your image path
        alt="MedBill Extraction"
        sx={{
          width: { xs: '80%', sm: '60%', md: '55%' },  // Responsive image sizing
          height: 'auto',
          display: 'block',
          mx: 'auto',  // Center the image
        }}
      />
    </Grid>
  </Grid>
</Box>
 
 
            {/* Card Section */}
            <Box sx={{ padding: isMobile ? '20px' : '100px', fontFamily: 'Georgia, Times, serif' }}>
      {/* Title */}
      <Typography
        className="Nasaliza"
        variant={isMobile ? 'h5' : 'h4'}
        component="div"
        sx={{
          color: "#000166",
          fontWeight: 600,
          mb: 3,
          textAlign: 'center',
        }}
      >
        What  Doc<span style={{color:'#0B70FF'}}>AI</span> Med Bill Can Do for You ?
      </Typography>
 
      {/* Cards Container */}
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap', justifyContent: 'center', py: 4 }}>
        {/* Card 1 */}
        <Card sx={{ maxWidth: isMobile ? '100%' : '300px', m: 2 }}>
          <CardContent>
            <CardTitle className="Nasaliza" variant="h6">Comprehensive Bill Analysis</CardTitle>
            <CardDescription variant="body2">Analyzes and provides insights into medical bills.</CardDescription>
          </CardContent>
          <Box>
            <IconImage src={require('../../assets/Med_bills_analysis.png')} alt="Icon 1" />
          </Box>
        </Card>
 
        {/* Card 2 */}
        <Card sx={{ maxWidth: isMobile ? '100%' : '300px', m: 2 }}>
          <CardContent>
            <CardTitle className="Nasaliza" variant="h6">Optimized Time Efficiency</CardTitle>
            <CardDescription variant="body2">Enhances operational speed by streamlining data extraction processes</CardDescription>
          </CardContent>
          <Box>
            <IconImage src={require('../../assets/wall-clock.png')} alt="Icon 2" />
          </Box>
        </Card>
 
        {/* Card 3 */}
        <Card sx={{ maxWidth: isMobile ? '100%' : '300px', m: 2 }}>
          <CardContent>
            <CardTitle className="Nasaliza" variant="h6">Medical Invoice Summarizer</CardTitle>
            <CardDescription variant="body2">Summarizes key information from medical invoices.</CardDescription>
          </CardContent>
          <Box>
            <IconImage src={require('../../assets/Med_bills_invoice.png')} alt="Icon 3" />
          </Box>
        </Card>
      </Box>
 
      {/* Additional Text */}
      <Typography
        variant="body1"
        sx={{
          fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
          fontSize: '1rem',
          lineHeight: 1.6,
          textAlign: 'center',
          mt: 4,
          mx: isMobile ? '10px' : '20px',  // Adjust margins based on screen size
        }}
      >
        Our system streamlines medical document management by offering a robust solution for analyzing and summarizing complex medical bills and efficiently extracting crucial information from medical reports. It meticulously examines and breaks down intricate bills to ensure accuracy and transparency, while summarizing them into clear, concise reports that highlight essential charges and payments.
      </Typography>
    </Box>
 
            <Box
                    sx={{
                      
                        height: '4px',
                        backgroundColor: '#000166',
                      width:'100%',maxWidth:1300,margin:'auto',
                      // Adds vertical margin to separate from content above and below
                        borderRadius: '2px',
                        marginBottom:'50px',// Optional: gives a slightly rounded edge to the line
                    }}
                />
               <MedBillfun/>
 
 <Grid marginBottom={'4rem'}></Grid>
            <Footer />
        </>
    );
}