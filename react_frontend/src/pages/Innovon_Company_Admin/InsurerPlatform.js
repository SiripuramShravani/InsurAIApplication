import React from "react";
import { Box, Typography, Grid, Paper, useMediaQuery, Link } from "@mui/material";
import PolicyIcon from '@mui/icons-material/Policy'; // Icon for Policy Management
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // Icon for Claim Processing
import PersonSearchIcon from '@mui/icons-material/PersonSearch'; // Icon for Agent Monitoring
import InsightsIcon from '@mui/icons-material/Insights'; // Icon for Real-Time Analytics
import Header from "../../components/header";
import Footer from "../../components/footer";
import { PlayCircleFilled } from '@mui/icons-material';
import StyledButtonComponent from "../../components/StyledButton";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import Carrier1 from '../../assets/Carrier1.png'
import AdminPlatform2 from '../../assets/AdminPlatform2.png'
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SEO from "../../SEO/SEO";
export default function InsurerPlatform() {
  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery('(max-width:900px)');
  return (
    <>
      <Header />
      <SEO location={'/insur-admin-platform'}   />
      <h2 style={{ position: 'absolute',width: '1px',height: '1px',margin: '-1px',padding: '0',overflow: 'hidden',clip: 'rect(0, 0, 0, 0)',border: '0', }}>Integrated Carrier Admin Platform</h2>  
   
      <Box sx={{ backgroundColor: "#79BAEC", color: "white", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography
          sx={{
            color: "#001660",
            textAlign: "center",
            '&.MuiTypography-root': {
              fontSize: '2rem !important'
            }
          }}
          className="Nasaliza"
        >
          Insur<span style={{ color: '#0B70FF' }}>Admin</span> Platform
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "1200px",
            padding: { xs: "0 1rem", md: "0 2rem" },
            margin: "0 auto",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              textAlign: { xs: "center", md: "left" },
              marginLeft: { xs: "0", md: "2rem" },
            }}
          >
            <Typography sx={{ mb: 3, fontSize: '2rem', color: "#001660", }} className="Nasaliza">
              Transform Your Carrier Operations with Real-Time Data
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Our platform centralizes the management of policies, claims, and agents with actionable insights to help you make smarter decisions, faster.
            </Typography>

            <Grid sx={{ marginTop: "2rem", textAlign: { xs: "center", md: "left" } }}>
              <Box>
                <StyledButtonComponent
                  buttonWidth={250}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    navigate(Authorization ? "/innovonadmindashboard" : "/requestdemo");
                  }}
                >
                  {Authorization ? "Demo" : "Request for Demo"}
                </StyledButtonComponent>

                <Link href="https://www.youtube.com/watch?v=j33lYdWUx-o" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                  <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}> <PlayCircleFilled sx={{ marginRight: '8px' }} />
                    Watch Video
                  </StyledButtonComponent>
                </Link>


              </Box>
              <Box sx={{ textAlign: 'center', marginRight: isMobile ? "0rem" : "6rem" }}>
                <Typography
                  className="Nasaliza"
                  sx={{
                    fontWeight: 'bold',
                    paddingTop: '5px',
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    color: '#001660',
                  }}
                >
                  <ContactMailIcon sx={{ marginRight: '10px', fontSize: '1.5rem', color: '#001660' }} />
                  Contact us for a free POC
                </Typography>

              </Box>
            </Grid>
          </Box>

          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              mt: "2rem",
              textAlign: "center",
            }}
          >
            <img
              src={Carrier1}
              alt="Carrier1"
              style={{ width: "100%" }}
            />

          </Box>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ backgroundColor: "#fff", py: 6, width: '100%', maxWidth: 1200, margin: 'auto' }}>
        <h1 variant="h1"  align="center" style={{ mb: 4 ,fontSize:isMobile?"1.7rem":"2rem"}} className="Nasaliza">
          Automate, Track, and Analyze Your Insurance Operations
        </h1>
        <Grid container spacing={4} sx={{ px: 2 }}>
          {[
            {
              title: "Policy Management",
              description: "Manage policies from creation to renewal, with real-time updates and automated notifications for important deadlines.",
              icon: <PolicyIcon sx={{ fontSize: 40, color: '#007BFF' }} />,
            },
            {
              title: "Claim Processing",
              description: "Automate and streamline the entire claims process, from intake to resolution, with intelligent workflows and real-time tracking.",
              icon: <AssignmentTurnedInIcon sx={{ fontSize: 40, color: '#28A745' }} />,
            },
            {
              title: "Agent Monitoring",
              description: "Track agent performance metrics, sales productivity, and service quality through detailed dashboards.",
              icon: <PersonSearchIcon sx={{ fontSize: 40, color: '#FFC107' }} />,
            },
            {
              title: "Real-Time Analytics",
              description: "Access data-driven insights and generate customized reports that give you an edge in decision-making.",
              icon: <InsightsIcon sx={{ fontSize: 40, color: '#17A2B8' }} />,
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper sx={{ p: 3, textAlign: "center", height: 280 }}>
                {feature.icon}
                <Typography variant="h6" sx={{ mt: 2, mb: 2, color: "#001660", }} className="Nasaliza">
                  {feature.title}
                </Typography>
                <Typography variant="body1">{feature.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Analytics Section */}
      <Box sx={{ backgroundColor: "#007bff", color: "white", padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>


        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "1200px",
            padding: { xs: "0 1rem", md: "0 2rem" },
            margin: "0 auto",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              mt: "2rem",
              textAlign: "center",
            }}
          >
            <img
              src={AdminPlatform2}
              alt="AdminPlatform2"
              style={{ width: "100%" }}
            />

          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              textAlign: { xs: "center", md: "left" },
              marginLeft: { xs: "0", md: "2rem" },
            }}
          >
            <Typography sx={{ mb: 3, fontSize: '2rem', color: "#001660", }} className="Nasaliza">
              Real-Time Analytics & Insights
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Stay ahead of the competition with real-time analytics that help you track key metrics like claim status, policy trends, and agent performance.
            </Typography>

            <Grid sx={{ marginTop: "2rem", textAlign: { xs: "center", md: "left" } }}>
              <Box>
                <StyledButtonComponent
                  buttonWidth={250}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    navigate(Authorization ? "/innovonadmindashboard" : "/requestdemo");
                  }}
                >
                  {Authorization ? "Demo" : "Request for Demo"}
                </StyledButtonComponent>

                <Link href="https://www.youtube.com/watch?v=j33lYdWUx-o" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
                  <StyledButtonComponent buttonWidth={200} sx={{ marginLeft: '20px' }}><PlayCircleFilled sx={{ marginRight: '8px' }} />
                    Watch Video
                  </StyledButtonComponent>
                </Link>


              </Box>

            </Grid>
          </Box>


        </Box>
      </Box>




      <Footer />
    </>
  );
}
