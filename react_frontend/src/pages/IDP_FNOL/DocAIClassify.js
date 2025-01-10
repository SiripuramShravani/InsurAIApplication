import React from 'react';
import {
  Typography,
  Box,
  Grid,
  useTheme, Container,
  useMediaQuery, Link, Paper,
  Card, CardContent
} from '@mui/material';
import { PlayCircleFilled, } from "@mui/icons-material";
import Header from '../../components/header';
import Footer from '../../components/footer';
import terms_bg from '../../assets/DocAIClassify.jpg'; // Assuming the image is in the assets folder
import StyledButtonComponent from '../../components/StyledButton';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useNavigate } from 'react-router-dom';
import Classify from '../../assets/DocAIClassify.png'
import docaiClassify from '../../assets/docai_Classify.png'
import DescriptionIcon from "@mui/icons-material/Description"; // For Claims
import FolderIcon from '@mui/icons-material/Folder';
import StorageIcon from '@mui/icons-material/Storage';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import EfficiencyIcon from '@mui/icons-material/Whatshot'; // Use the correct icon name
import CardHeader from '@mui/material/CardHeader';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Example of an alternative icon
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import ClaimDoc from '../../assets/ClaimDoc.png'
import PolicyDoc from '../../assets/PolicyDoc.png'
import LossReportDOC from '../../assets/LossReportDOC.png'
import FNOLDOC from '../../assets/FNOLDOC.png'
const DocAIClassify = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <Box
        sx={{
          backgroundImage: `url(${terms_bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          p: 4,
          height: isMobile ? 'auto' : '560px'
        }}
      >
        <Box sx={{ maxWidth: 1200, margin: "auto", textAlign: 'center' }}>
          <Typography sx={{ color: 'white', textAlign: 'center', fontSize: '1.8rem', marginBottom: 4 }} className='Nasaliza'>
            Doc<span style={{ color: '#0B70FF' }}>AI</span><sup style={{ position: 'relative', top: '-1rem', right: '-0.1rem', fontSize: '0.5rem' }}>TM</sup> Classify
          </Typography>
          <Grid container spacing={4} alignItems="center">
            {/* Text Section */}

            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={docaiClassify} // Use the same image or a different one as needed
                alt="DocAI Classify"
                sx={{
                  width: '100%',
                  height: 'auto',

                }}
              />
            </Grid>

            <Grid item xs={12} md={6} textAlign={"left"} sx={{ marginTop: '5rem' }}>
              <Typography
                sx={{ color: 'white', fontSize: '2rem', marginBottom: 2 }}
                className='Nasaliza'
              >
                Transform Your Document Classification Experience
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'white',
                  fontSize: isMobile ? "1rem" : '1rem',
                  marginBottom: 4,
                  textAlign: "justify",
                  fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                }}
              >
                DocAI Classify elevates document management by automating the classification, extraction, indexing, and storage of any document type. Designed for efficiency and precision, our solution streamlines workflows for a seamless, intelligent document handling experience.                            </Typography>
              {!Authorization ?
                <Box sx={{ marginTop: "2rem", textAlign: isMobile ? "center" : 'center' }}>
                  <StyledButtonComponent
                    buttonWidth={200}
                    onClick={() => navigate("/requestdemo")}
                  >
                    Request for Demo
                  </StyledButtonComponent>

                  <Link
                    href="https://youtu.be/V5JJjCbUmOo?si=hXpKCg-aAkxVmlf4"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'white' }}>
                    <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}><PlayCircleFilled sx={{ marginRight: '8px' }} />
                      Watch Video
                    </StyledButtonComponent>
                  </Link>

                </Box>

                :

                <Box sx={{ marginTop: "2rem", textAlign: isMobile ? "center" : 'center' }}>
                  <StyledButtonComponent buttonWidth={200}
                    onClick={() => navigate("/demo/docaiClassify")}
                    style={{ marginTop: isMobile ? '16px' : '0' }}
                  >
                    Demo
                  </StyledButtonComponent>

                  <Link
                    href="https://youtu.be/V5JJjCbUmOo?si=hXpKCg-aAkxVmlf4" target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'white' }}>
                    <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px', marginTop: '-2px' }}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
                      Watch Video
                    </StyledButtonComponent>
                  </Link>

                </Box>
              }
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  className="Nasaliza"
                  sx={{
                    fontWeight: 'bold',
                    paddingTop: '5px',
                    fontSize: '1.1rem',

                    color: 'white',
                  }}
                >
                  <ContactMailIcon sx={{ marginRight: '10px', fontSize: '1.5rem', color: 'white' }} />
                  Contact us for a free POC
                </Typography>

              </Box>
            </Grid>
            {/* Image Section */}

          </Grid>
        </Box>

        {/* New Section for Cards */}

      </Box>
      {/* Section 3: Process Overview */}
      <Box my={5} sx={{ width: '100%', maxWidth: 1200, margin: "auto", padding: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom color="#001660" className='Nasaliza'>
          Doc<span style={{ color: "blue" }}>AI</span>™: Classify-Extract-Index-Store
        </Typography>
        <Grid container spacing={3}>

          {/* Column 2: Document Classification */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ padding: '20px', textAlign: 'left', height: "200px" }}>
              <FolderIcon fontSize="large" color="primary" />
              <Typography variant="h6" component="h3" sx={{ color: '#001660', marginTop: "1rem" }} className='Nasaliza'>
                DOC Classification
              </Typography>
              <Typography variant="body2">
                Documents are classified into categories such as Claims, Quotes, Medical Bills, Loss Runs, SOV, and Forms.
                Documents are classified into categories such as Claims, Quotes, Medical Bills, Loss Runs, SOV, and Forms.
              </Typography>
            </Paper>
          </Grid>

          {/* Column 3: Data Extraction */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ padding: '20px', textAlign: 'left', height: "200px" }}>
              <FindInPageIcon fontSize="large" sx={{ color: '#00796b' }} />

              <Typography variant="h6" component="h3" sx={{ color: '#001660', marginTop: "1rem" }} className='Nasaliza'>
                Data Extraction
              </Typography>
              <Typography variant="body2">
                Important data points are extracted from the classified documents using advanced algorithms.
              </Typography>
            </Paper>
          </Grid>

          {/* Column 4: Indexing and Storage */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ padding: '20px', textAlign: 'left', height: "200px" }}>
              <StorageIcon fontSize="large" color="success" />
              <Typography variant="h6" component="h3" sx={{ color: '#001660', marginTop: "1rem" }} className='Nasaliza'>
                Indexing and Storage
              </Typography>
              <Typography variant="body2">
                The extracted data is indexed for easy retrieval and stored in the DMS for secure access.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* <Box sx={{ width: "100%", maxWidth: 1200, margin: 'auto', mt: 4, mb: 5 }}>
                <Box sx={{ maxWidth: 1200, margin: "auto", textAlign: 'center', mt: 6 }}>
                    <Typography sx={{ color: '#001660', fontSize: '1.8rem', marginBottom: 2 }} className='Nasaliza'>
                        Unlock the Power of Document Classification with DocAI Classify
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#001660',
                            fontSize: isMobile ? "1.2rem" : '1.2rem',
                            marginBottom: 4,
                            fontFamily: 'Georgia, Times, serif',
                        }}
                    >
                        Experience unparalleled efficiency and accuracy in document classification. Save time and reduce costs with our advanced AI technology.
                    </Typography>
                </Box>
                <Grid container spacing={4}>
                   <Grid item xs={12} sm={6}>
                        <Card
                            sx={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                textAlign: 'center',
 
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <AccuracyIcon sx={{ fontSize: 60, color: 'cyan' }} />
                            </Box>
                            <CardHeader
                                title="Ensure Accuracy"
                                className='Nasaliza'
                                sx={{
                                    textAlign: 'center',
                                    color: '#001660',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                }}
                            />
                            <CardContent>
                                <Typography variant="body1" sx={{ color: '#001660' }}>
                                    Achieve high precision in document identification to minimize errors and improve outcomes.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
 
                    <Grid item xs={12} sm={6} >
                        <Card
                            sx={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                textAlign: 'center',
 
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <EfficiencyIcon sx={{ fontSize: 60, color: 'cyan' }} />
                            </Box>
                            <CardHeader
                                title="Boost Efficiency"
                                sx={{
                                    textAlign: 'center',
                                    color: '#001660',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                                }}
                                className='Nasaliza'
                            />
                            <CardContent>
                                <Typography variant="body1" sx={{ color: '#001660' }}>
                                    Streamline your workflow and enhance productivity with automated document processing.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box> */}
      <Box sx={{ backgroundColor: "#f4f6f9", py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ textAlign: "center", mb: 4, fontWeight: "bold" }} className='Nasaliza'>
            Classify Your Documents
          </Typography>

          <Grid container spacing={4}>
            {/* Classification Card 1 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  textAlign: "center",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                  height: "210px",
                }}
              >
                <CardContent>
                  <img src={ClaimDoc} alt='claim img' style={{ height: '80px', width: '80px' }} />
                  <Typography variant="h6" sx={{ mt: 2, color: '#001660' }}>
                    Claims DOC's
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Identify and process claims-related documents effortlessly.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Classification Card 2 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  textAlign: "center",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 },
                  height: "210px",
                }}
              >
                <CardContent>
                  <img src={PolicyDoc} alt='PolicyDoc img' style={{ height: '80px', width: '80px' }} />
                  <Typography variant="h6" sx={{ mt: 2, color: '#001660' }}>
                    Policy DOC's
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Automatically classify and manage policy documents.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Classification Card 3 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  textAlign: "center",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 }, height: "210px",
                }}
              >
                <CardContent>
                  <img src={LossReportDOC} alt='LossReportDOC' style={{ height: '80px', width: '80px' }} />
                  <Typography variant="h6" sx={{ mt: 2, color: '#001660' }}>
                    Loss Run Reports
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Seamlessly categorize and analyze loss run reports.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Classification Card 4 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  textAlign: "center",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 }, height: "210px",
                }}
              >
                <CardContent>
                  <img src={FNOLDOC} alt='FNOLDOC' style={{ height: '80px', width: '80px' }} />
                  <Typography variant="h6" sx={{ mt: 2, color: '#001660' }}>
                    FNOL DOC's
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    First Notice of Loss documents are accurately processed.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Classification Card 5 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  textAlign: "center",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 }, height: "210px",
                }}
              >
                <CardContent>
                  {/* <img src={folderDOC} alt='folderDOC' style={{ height: '80px', width: '80px' }} /> */}
                  <DescriptionIcon fontSize="large" style={{ height: '80px', width: '80px', color: '#0B70FF' }} />
                  <Typography variant="h6" sx={{ mt: 2, color: '#001660' }}>
                    Other Reports
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Handle various report types with ease and accuracy.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Classification Card 6 */}
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  textAlign: "center",
                  transition: "0.3s",
                  "&:hover": { boxShadow: 6 }, height: "210px",
                }}
              >
                <CardContent>
                  <ArchiveOutlinedIcon sx={{ fontSize: 80, color: "#607D8B" }} />
                  <Typography variant="h6" sx={{ mt: 2, color: '#001660' }}>
                    Archived DOC's
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Store and retrieve archived documents with ease.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>


      <Box sx={{ width: "100%", maxWidth: 1200, margin: 'auto', mt: 4, mb: 5 }}>


        <Box
          sx={{
            width: '100%',
            maxWidth: 1200,
            margin: 'auto',
            padding: 3,

          }}
        >
          <Grid container spacing={4}>
            {isMobile &&
              <Grid item xs={12} md={6}>

                <Box
                  component="img"
                  src={Classify}  // Replace with your image URL
                  alt="Document Classification"
                  sx={{
                    width: '100%',
                    height: 'auto',

                  }}
                />
              </Grid>
            }
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  color: '#001660',
                  textAlign: 'left', fontSize: '1.8rem'
                }}
                className='Nasaliza'
              >
                Seamless Integration for Secure Document Management and Accessibility
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  color: '#555',
                  lineHeight: 1.6, textAlign: 'justify', fontFamily: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                }}
              >
                With DocAI Classify, your documents are seamlessly processed and securely integrated into a next-generation Document Management System (DMS). This advanced solution guarantees that vital files are instantly accessible, enhancing operational efficiency and offering unparalleled peace of mind for a truly connected, future-ready workflow.                            </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6} >
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',

                      textAlign: 'center',
                      marginTop: "1.5rem"

                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <EfficiencyIcon sx={{ fontSize: 40, color: 'blue' }} />
                    </Box>
                    <CardHeader
                      title="Boost Efficiency"
                      sx={{
                        textAlign: 'center',
                        color: '#001660',
                      }}
                      className='Nasaliza'
                    />
                    <CardContent sx={{ marginTop: '0rem', padding: '0rem 1.5rem' }}>
                      <Typography variant="body2" sx={{ color: '#001660', textAlign: "justify" }}>
                        Streamline your workflow and enhance productivity with automated document processing.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      textAlign: 'left',
                      marginTop: "1.5rem"

                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <CheckCircleIcon sx={{ fontSize: 40, color: 'blue' }} />
                    </Box>
                    <CardHeader
                      title="Ensure Accuracy"
                      className='Nasaliza'
                      sx={{
                        textAlign: 'center',
                        color: '#001660',

                      }}
                    />
                    <CardContent sx={{ marginTop: '0rem', padding: '0rem 1.5rem' }}>
                      <Typography variant="body2" sx={{ color: '#001660', textAlign: "justify" }}>
                        Achieve precise document identification for fewer errors and improve outcomes.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              {!Authorization ?
                <Box sx={{ marginTop: "2rem", textAlign: isMobile ? "center" : 'center' }}>
                  <StyledButtonComponent
                    buttonWidth={200}
                    onClick={() => navigate("/requestdemo")}
                  >
                    Request for Demo
                  </StyledButtonComponent>

                  <Link
                    href="https://youtu.be/V5JJjCbUmOo?si=hXpKCg-aAkxVmlf4" target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'white' }}>
                    <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}><PlayCircleFilled sx={{ marginRight: '8px' }} />
                      Watch Video
                    </StyledButtonComponent>
                  </Link>

                </Box>

                :

                <Box sx={{ marginTop: "2rem", textAlign: isMobile ? "center" : 'center' }}>
                  <StyledButtonComponent buttonWidth={200}
                    onClick={() => navigate("/demo/docaiClassify")}
                    style={{ marginTop: isMobile ? '16px' : '0' }}
                  >
                    Demo
                  </StyledButtonComponent>

                  <Link
                    href="https://youtu.be/V5JJjCbUmOo?si=hXpKCg-aAkxVmlf4" target="_blank" rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'white' }}>
                    <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px', marginTop: '-2px' }}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
                      Watch Video
                    </StyledButtonComponent>
                  </Link>

                </Box>
              }
            </Grid>
            {!isMobile &&
              <Grid item xs={12} md={6}>
                <Box
                  component="img"
                  src={Classify}  // Replace with your image URL
                  alt="Document Classification"
                  sx={{
                    width: '100%',
                    height: 'auto',

                  }}
                />
              </Grid>
            }
          </Grid>
        </Box>
      </Box>



      <Footer />
    </>
  );
};

export default DocAIClassify;
