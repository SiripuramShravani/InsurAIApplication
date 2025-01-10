import { React, useState } from "react";
import Header from '../../components/header';
import Footer from "../../components/footer";
import { Box, Card, CardContent, Typography, Link, useMediaQuery, useTheme } from "@mui/material";
import lightning from '../../assets/lightning.png';
import chip from '../../assets/chip.png';
import documentation from '../../assets/documentation.png';
import StyledButtonComponent from "../../components/StyledButton";
import { useNavigate } from 'react-router-dom';
import SideImage from '../../assets/Medical_report.png';
import MainImage from '../../assets/Medical_report_main.png';
import { PlayCircleFilled,} from "@mui/icons-material"; 
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SEO from "../../SEO/SEO";
const CardItem = ({ logo, title, content }) => (
    <Card
        sx={{
            minWidth: 300,
            maxWidth: 400,
            textAlign: 'center',
            overflow: 'hidden',
            position: 'relative',
            transition: 'transform 0.3s, box-shadow 0.3s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            bgcolor: '#ffffff',
            mb: 4, // Increased bottom margin to prevent overlapping
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '2px',
                backgroundColor: '#000166',
            },
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 0 15px 5px #000166',
            },
        }}
    >
        <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
                display: 'block',
                margin: 'auto',
                width: 100,
                height: 100,
                borderRadius: 0,
                padding: 2,
                transition: 'transform 0.6s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.2) rotate(10deg)',
                },
            }}
        />
        <CardContent>
            <Typography
             className="Nasaliza"
                variant="h5"
                component="div"
                sx={{
                    mt: 2,
                    transition: 'color 0.3s',
                    '&:hover': { color: '#000166' },
                    fontFamily: 'Georgia, Times, serif',
                }}
            >
                {title}
            </Typography>
            <Typography
             className="Nasaliza"
                variant="body2"
                sx={{
                    mt: 1,
                    transition: 'color 0.3s',
                    '&:hover': { color: '#000166' },
                    fontFamily: 'Georgia, Times, serif',
                }}
            >
                {content}
            </Typography>
        </CardContent>
    </Card>
);
 
const Cards = () => {
     const cardData = [
        { id: 1, title: 'AI-Powered Extraction', content: 'Harness the power of state-of-the-art AI to extract data from any medical bill format with 95%+ accuracy.', logo: chip },
        { id: 2, title: 'Lightning-Fast Processing', content: 'Process complex medical bills in under 10 seconds, dramatically reducing turnaround times.', logo: lightning },
        { id: 3, title: 'Universal Compatibility', content: 'Seamlessly handle PDFs, images, and scanned documents with equal precision, speed and accuracy.', logo: documentation },
    ];
 
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1, // Adjusted gap between cards
                flexWrap: 'wrap',
                p: 2,
            }}
        >
            {cardData.map(card => (
                <CardItem
                    key={card.id}
                    logo={card.logo}
                    title={card.title}
                    content={card.content}
                />
            ))}
        </Box>
    );
};
 
export default function MedBill() {
    const navigate = useNavigate();
    const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
    const [, setHovered] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  // Mobile screens
 
    const checked = (val) => {
        if (!Authorization) {
            window.scrollTo(0, 0);
            localStorage.setItem("rout", val);
        } else {
            window.scrollTo(0, 0);
        }
    };
 
    return (
        <>
            <Header />
            <SEO location={'/doc-ai-med-bill'}  />
            <h2 style={{ position: 'absolute',width: '1px',height: '1px',margin: '-1px',padding: '0',overflow: 'hidden',clip: 'rect(0, 0, 0, 0)',border: '0', }}><h1 style={{ position: 'absolute',width: '1px',height: '1px',margin: '-1px',padding: '0',overflow: 'hidden',clip: 'rect(0, 0, 0, 0)',border: '0', }}>  Streamline your claims process with FNOL</h1>  
            IDP Medbill Innovon Tech</h2>  
   
            {/* Slide Section */}
            <Box
      sx={{
        height:isMobile?'auto': '620px',
        backgroundColor: '#000166',
        backgroundImage: `url(${require('../../assets/Med_bills_demo.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',  // Column layout for mobile
        alignItems: 'center',
        color: '#fff',
        p: 4,
        justifyContent: 'center',
      }}
    >
      {/* Title */}
      <Typography
        className="Nasaliza"
        variant={isMobile ? 'h4' : 'h3'}
        sx={{
          position: isMobile ? 'relative' : 'absolute',
          top: isMobile ? 'auto' : '100px',
          left: isMobile ? 'auto' : '50%',
          transform: isMobile ? 'none' : 'translateX(-50%)',
          color: '',
          fontSize: isMobile ? '1.5rem' : '2rem',
          letterSpacing: '0.01px',
          lineHeight: 1.2,
          textAlign: 'center',
          marginTop: isMobile ? '0' : '-17px',
          mb: isMobile ? 2 : 0,
        }}
      >
        Doc<span style={{ color: '#0B70FF' }}>AI</span><sup style={{position: 'relative', top: '-1rem', right: '-0.1rem', fontSize: '0.5rem'}}>TM</sup> Med Bill
      </Typography>
 
      {/* Left Image Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '450px',
          width: '450px',
          marginLeft: isMobile ? '0' : '5rem',
        }}
      >
        <img
          src={MainImage}
          alt="Medical Data"
          style={{ maxWidth: '100%', maxHeight: '80%' }}
        />
      </Box>
 
      {/* Right Text Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'left',
          textAlign: 'center',
          pr: isMobile ? 0 : 2,
          marginRight: isMobile ? '0' : '7rem',
          mt: isMobile ? 2 : 0,
        }}
      >
        <Typography
          className="Nasaliza"
          variant={isMobile ? 'h1' : 'h1'}
          component={'h1'}
          sx={{
            color: "#ffffff",
           marginBottom:"1rem",
            fontSize:isMobile?'2rem':'2.2rem'
          }}
        >
          AI-Driven Med Bill Data Extraction
        </Typography>
 
        <Typography
          variant="body1"
          sx={{
            maxWidth: '100%',
            fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
            marginTop: '-1rem',
            fontSize: isMobile ? '1rem' : '1.1rem',
            color: 'whitesmoke',
            textAlign: 'justify',
          }}
        >
          Revolutionize your healthcare data management with our state-of-the-art AI-powered medical bill extraction solution. Harness the power of cutting-edge Large Language Models (LLMs), Generative AI, and Computer Vision to transform how you process and analyze medical bills.
        </Typography>
 
        {!Authorization ? (
          <Box sx={{ mt: 2 }} textAlign={'center'}>
            <Link
              style={{ color: 'black' }}
              onClick={() => checked("/login")}
              href="/requestdemo"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <StyledButtonComponent buttonWidth={200}>
                Request for Demo
              </StyledButtonComponent>
              
                            <Link href="https://www.youtube.com/watch?v=dyKsr3tKob4" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                            <StyledButtonComponent buttonWidth={200} sx={{marginLeft:'20px'}}>
                            <PlayCircleFilled sx={{ marginRight: '8px' }} />
                            Watch Video
                            </StyledButtonComponent>
                            </Link> 
                          
            </Link>
          </Box>
        ) : (
          <Box sx={{ mt: 2}} textAlign={'center'}>
            <StyledButtonComponent buttonWidth={200} onClick={() => navigate("/Demo/doc-ai-med-bill")}>
              Demo
            </StyledButtonComponent>
           
                          <Link href="https://www.youtube.com/watch?v=dyKsr3tKob4" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                          <StyledButtonComponent buttonWidth={200} sx={{marginLeft:isMobile?"0rem":'20px'}}>
                            <PlayCircleFilled sx={{ marginRight: '8px' }} />
                          Watch Video
                          </StyledButtonComponent>
                          </Link>
                        
          </Box>
        )}
         <Box sx={{textAlign:'center'}}>
              <Typography
                        className="Nasaliza"
                        sx={{
                          fontWeight: 'bold',
                          paddingTop: '5px',
                          fontSize: '1.1rem',
                         textAlign:'center',
                          color: 'white',
                        }}
                      >
                        <ContactMailIcon sx={{ marginRight: '10px', fontSize: '1.5rem', color: 'white' }} />
                        Contact us for a free POC
                        </Typography>

              </Box>
      </Box>
    </Box>
            {/* Content and Cards Section */}
 
           
           
      <Box
        sx={{
         width:'100%',maxWidth:1200,margin:"auto",p:'1rem'
        }}
      >
        <Typography
          className="Nasaliza"
          variant={isMobile ? 'h5' : 'h4'}
          component="div"
          sx={{
            color: "#000166",
            fontWeight: 600,
            mb: 3,
            textAlign: 'center',
            fontSize: isMobile ? '1.5rem' : '2rem',  // Adjusting font size for mobile
          }}
        >
          AI-Driven Med Bill Extraction Features
        </Typography>
 
        <Typography
          variant="body1"
          sx={{
            fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
            fontSize: isMobile ? '0.9rem' : '1rem',  // Adjust font size for mobile
            textAlign: 'center',
          }}
        >
          Revolutionize your medical bill processing with our AI-powered extraction solution. Leveraging cutting-edge LLM's and computer vision technologies, we deliver unparalleled accuracy and efficiency in healthcare data management.
        </Typography>
      </Box>
 
      {/* Cards Component */}
      <Cards />
 
 
            {/* New Section Below Cards */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection:isMobile?"column": 'row',
                 
                    alignItems: 'center',
                 
                    bgcolor: 'White',marginBottom:'2rem'
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <img
                            src={SideImage}
                            alt="SideImage"
                            style={{
                                maxWidth: '100%',
                                height: '370px',
                                borderRadius: '8px',
                                marginLeft: isMobile?'0px':'100px',
                                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', // Added shadow here
                            }}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        px: 4,
                    }}
                >
                    <Typography
                     className="Nasaliza"
                        variant="h4"
                        sx={{
                            // fontFamily: 'Georgia, Times, serif',
                            color: "#000166",
                            fontWeight: 600,
                            textAlign: 'left', // Align text to the left
                            mb: 2,
                            marginRight:'50px',
 
                        }}
                    >
                        Revolutionize Medical Data Management with AI-Powered Med Bill Extraction
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            marginRight: '50px',
                            textAlign: 'justify',
                            hyphens: 'auto',
                            wordBreak: 'break-word',
                            '& > span': { display: 'inline-block' }
 
                        }}
                    >
                        Our AI-powered medical bill extraction solution processes bills in under 10 seconds with 95%+ accuracy, regardless of document type. It seamlessly integrates with your existing systems, dramatically reducing manual data entry and operational costs.
                    </Typography>
                    {!Authorization ?
                        <Box sx={{ mt: 2 }} textAlign={'left'}>
                            <Link
                                style={{ color: 'black' }}
                                onClick={() => checked("/login")}
                                href="/requestdemo"
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                            >
                                <StyledButtonComponent buttonWidth={250}>
                                    Request for Demo
                                </StyledButtonComponent>
                               
                          <Link href="https://www.youtube.com/watch?v=dyKsr3tKob4" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                          <StyledButtonComponent buttonWidth={200} sx={{marginLeft:'20px'}}><PlayCircleFilled sx={{ marginRight: '8px' }} />
                          Watch Video
                          </StyledButtonComponent>
                          </Link>
                        
                            </Link>
                        </Box>
 
                        :
 
                        <Box sx={{ mt: 2 }} textAlign={'center'}>
                            <StyledButtonComponent buttonWidth={250}
                                onClick={() => navigate("/Demo/doc-ai-med-bill")}
                                style={{ marginTop: isMobile ? '16px' : '0' }}
                            >
                                Demo
 
                            </StyledButtonComponent>
                           
                          <Link href="https://www.youtube.com/watch?v=dyKsr3tKob4" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                          <StyledButtonComponent buttonWidth={200} sx={{marginLeft:'20px', marginRight:'-200px', marginTop:'-2px'}}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
                          Watch Video
                          </StyledButtonComponent>
                          </Link>
                        
                        </Box>
                    }
                </Box>
 
            </Box>
 
            <Footer />
        </>
    );
} 