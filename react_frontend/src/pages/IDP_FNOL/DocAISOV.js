import React from 'react';
import {
    Typography,
    Box,
    Grid,
    useTheme,
    Container,
    useMediaQuery,
    Link,
    List,
    ListItem,
    Card,
    CardContent,
    IconButton
} from '@mui/material';
import { PlayCircleFilled, } from "@mui/icons-material";
import { ContactMail, Storage, BarChart, Insights, TrendingUp, Update } from '@mui/icons-material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Header from '../../components/header';
import Footer from '../../components/footer';
import StyledButtonComponent from '../../components/StyledButton';
import { useNavigate } from 'react-router-dom';
import DocAIsOV from '../../assets/DocAIsOV.png';
import SOV from '../../assets/SOV.png';
  
// Reusable Styles
const styles = {
    mainContainer: {
        backgroundColor: '#1b2ea6 ',
        color: "white",

        p: 4,
    },
    sectionHeading: {
        color: 'white',
        fontSize: '2rem',
        marginBottom: 2,
    },
    sectionDescription: (isMobile) => ({
        color: 'white',
        fontSize: isMobile ? "1.1rem" : '1.2rem',
        marginBottom: 4,
        fontSize: '17px',
        fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
    }),
    cardStyle: {
        backgroundColor: '#2c387e',
        color: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'transform 0.3s ease-in-out',
        textAlign: 'center',
        '&:hover': { transform: 'scale(1.05)' },
    },
    cardIconStyle: {
        fontSize: 60,
        color: '#f9a825',
     },
    cardTitle: {
        color: '#f9a825',
        fontWeight: 'bold',
        mt: 2,
    },
    listItemText: {
        color: '#444',
        textAlign: 'left',
    },
    listItemIcon: (color) => ({
        mr: 1,
        color,
    }),
};

// Reusable Card Component
const FeatureCard = ({ icon, title, description }) => (
    <Grid item xs={12} sm={6} md={4}>
        <Card sx={styles.cardStyle}>
            <CardContent>
                <IconButton>
                    {icon}
                </IconButton>
                <Typography component="h3" sx={styles.cardTitle}>
                    {title}
                </Typography>
                <Typography component="p" sx={{ mt: 2, textAlign: "justify", padding:"0rem 0.7rem", fontSize:"0.9rem"}}>
                    {description}
                </Typography>
            </CardContent>
        </Card>
    </Grid>
);

const DocAISOV = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
    const navigate = useNavigate();

    return (
        <>
            <head>
                <title>Statement of Values (SOV) Management | Excel Upload & Data Analysis</title>
                <meta name="description" content="Effortlessly manage and analyze property values with our advanced SOV management tool. Upload Excel files, validate data, and gain key insights." />
                <meta name="keywords" content="SOV, Statement of Values, Insurance, Excel Upload, Data Validation, Property Values, Risk Management" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <Header />

            <Box sx={[styles.mainContainer, { height: isMobile ? 'auto' : '600px' }]} >
                <Box sx={{ maxWidth: 1200, margin: "auto", textAlign: 'center' }}>
                    <Typography sx={{ color: 'white', fontSize: '1.8rem', marginBottom: 4 }} className='Nasaliza'>
                        Doc<span style={{ color: '#0B70FF' }}>AI</span><sup style={{ position: 'relative', top: '-1rem', right: '-0.1rem', fontSize: '0.5rem' }}>TM</sup> SOV <br /><span style={{fontSize:'1.3rem'}}>(Statement of Values)</span>
                    </Typography>
                    <Grid container spacing={4} alignItems="center" >
                        <Grid item xs={12} md={6}>
                            <Box component="img" src={DocAIsOV} alt="DocAI Classify" sx={{ width: '100%', height: 'auto' }} />
                        </Grid>

                        <Grid item xs={12} md={6} textAlign={"left"} sx={{ marginTop: isMobile ? '1rem' : '5rem' }}>
                            <Typography sx={styles.sectionHeading} className='Nasaliza'>
                                Statement of Values (SOV) Management
                            </Typography>
                            <Typography variant="body1" sx={styles.sectionDescription(isMobile)} style={{textAlign:"justify"}}>
                            Efficiently manage and analyze property values using our robust SOV management tool. Upload Excel files, validate data, and gain real-time insights to enhance your insurance operations.                            </Typography>

                            <Box sx={{ marginTop: "2rem", textAlign: isMobile ? "center" : 'center' }}>
                                <StyledButtonComponent buttonWidth={200} onClick={() => navigate(Authorization ? "/demo/docaiSov" : "/requestdemo")}>
                                    {Authorization ? "Demo" : "Request for Demo"}
                                </StyledButtonComponent>
                                <Link
                                    href="https://www.youtube.com/watch?v=iAols-FvN-Y"
                                    target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                                    <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}>
                                        <PlayCircleFilled sx={{ marginRight: '8px' }} /> Watch Video
                                    </StyledButtonComponent>
                                </Link>
                            </Box>

                            <Box sx={{ textAlign: "right", width: isMobile ? 'auto' : '400px' }}>
                                <Typography className="Nasaliza" sx={{ fontWeight: 'bold', paddingTop: '5px', fontSize: '1.1rem', color: 'white' }}>
                                    <ContactMail sx={{ marginRight: '10px', fontSize: '1.5rem' }} /> Contact us for a free POC
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            {/* Essential Aspects Section */}
            <Box sx={{ py: 6, backgroundColor: '#eef0f8' }}>
                <Container sx={{ maxWidth: 1200 }}>
                    <Typography component="h2" sx={{ fontSize: isMobile ? '1.2rem' : '1.5rem', color: '#f9a825', mb: 4, textAlign: 'center' }} className='Nasaliza'>
                        Essential Aspects of SOV Management
                    </Typography>
 
                    <Grid container spacing={4} justifyContent="center" >
                        <FeatureCard icon={<UploadFileIcon sx={styles.cardIconStyle} />} title="Excel File Upload" description="Seamlessly upload Excel files with property data, ready for analysis and validation." />
                        <FeatureCard icon={<Storage sx={styles.cardIconStyle} />} title="Data Validation" description="Automatically validate uploaded data for accuracy and completeness." />
                        <FeatureCard icon={<BarChart sx={styles.cardIconStyle} />} title="Real-Time Insights" description="Gain valuable insights and analytics on your insured property values." />
                    </Grid>
                </Container>
            </Box>

            {/* Real-Time Analytics Section */}
            <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto', padding: 3 }}>
                <Grid container spacing={4}>
                    {isMobile && (
                        <Grid item xs={12} md={6}>
                            <Box component="img" src={SOV} alt="Document Classification" sx={{ width: '100%', height: 'auto' }} />
                        </Grid>
                    )}

                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#001660', textAlign: 'left', mt:2}} className='Nasaliza'>
                        Harness the Potential of Real-Time Analytics for Enhanced Property Management                        </Typography>
                        <Typography variant="body1" sx={{ color: '#555', lineHeight: 1.6, textAlign: 'justify',mt:2 }}>
                        Our advanced tool provides immediate insights into property values, enabling you to make data-driven decisions with confidence. With real-time analytics at your fingertips, you can swiftly identify trends and adapt your strategies to optimize operational efficiency and effectiveness.                        </Typography>
 
                        <List>
                            <ListItem>
                                <Insights color="success" sx={styles.listItemIcon('#28a745')} />
                                <Typography variant="body1" sx={styles.listItemText}>Instant access to property value trends.</Typography>
                            </ListItem>
                            <ListItem>
                                <TrendingUp color="primary" sx={styles.listItemIcon('#007bff')} />
                                <Typography variant="body1" sx={styles.listItemText}>Data-driven decisions made easy.</Typography>
                            </ListItem>
                            <ListItem>
                                <Update color="secondary" sx={styles.listItemIcon('#ff4081')} />
                                <Typography variant="body1" sx={styles.listItemText}>Up-to-date information, always at your fingertips.</Typography>
                            </ListItem>
                        </List>
                        <Box sx={{ marginTop: "2rem", textAlign: isMobile ? "center" : 'left' }}>
                            <StyledButtonComponent buttonWidth={200} onClick={() => navigate(Authorization ? "/demo/docaiSov" : "/requestdemo")}>
                                {Authorization ? "Demo" : "Request for Demo"}
                            </StyledButtonComponent>
                            <Link
                                href="https://www.youtube.com/watch?v=iAols-FvN-Y"
                                target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                                <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}>
                                    <PlayCircleFilled sx={{ marginRight: '8px' }} /> Watch Video
                                </StyledButtonComponent>
                            </Link>
                        </Box>
                    </Grid>

                    {!isMobile && (
                        <Grid item xs={12} md={6}>
                            <Box component="img" src={SOV} alt="Document Classification" sx={{ width: '600px', height: '500px' }} />
                        </Grid>
                    )}
                </Grid>
            </Box>

            <Footer />
        </>
    );
};

export default DocAISOV;