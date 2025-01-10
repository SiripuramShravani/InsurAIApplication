import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  useMediaQuery, useTheme
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Header from "../components/header";
import Footer from "../components/footer";
import CustomerRating from '../assets/CustomerRating.png';
import Innovatiive from '../assets/Innovative.png';
import ClaimsHandeled from '../assets/ClaimsHandeled.png';
import CustomPlans from '../assets/CustomPlans.png';
import aibrain from '../assets/ai-brain.png';
import Support247 from '../assets/Support247.png';
import AboutUs from '../assets/AboutUs.jpg';
import footerimg from '../assets/footerimg.jpg';
import CoreValues from '../assets/CoreValues.png';
import CardBackground from '../assets/CardBackground.png';
import { Phone, Mail, MapPin } from 'lucide-react';
import OurSolutions from '../assets/OurSolutions.png';
import ScrollAnimation from "./ScrollAnimation";
import { motion, AnimatePresence } from "framer-motion";
import virtualAssistant from '../assets/virtual-assistant.png'
import statiscticsDashboard from '../assets/statiscticsDashboard.png'
import ClaimsProcessing from '../assets/ClaimsProcessing.png'
import Policysubmissions from '../assets/Policysubmission.png'
import AdvancedDocument from '../assets/AdvancedDocument.png'
import emailProcessing from '../assets/emailProcessing.png'
import MobileConvenience from '../assets/MobileConvenience.png'
import dataTransformation from '../assets/dataTransformation.png'
const features = [
  { icon: virtualAssistant, number: 1, title: "Smart Virtual Assistant", description: 'IVAN – Innovon Virtual Assistant, our P&C Insurance Virtual Assistant, delivers human-like support using advanced Large Language Models (LLMs). It simplifies client interactions, providing intelligent assistance for insurance needs. ' },
  { icon: statiscticsDashboard, number: 2, title: "Centralized Insurance Admin", description: 'Our InsurAdmin Platform offers a unified dashboard for managing policies, claims, agents, and customer interactions. It provides real-time tracking, customizable reports, and automated alerts, enabling data-driven decisions and improved operational efficiency in P&C insurance. ' },
  { icon: ClaimsProcessing, number: 3, title: "AI-Driven Claims Processing", description: "With SmartClaim Portal and DocAI™ Claim, we utilize advanced LLMs and Generative AI to automate claims processing. From unstructured documents to structured data, our tools ensure faster resolutions, reduced errors, and significant cost savings in P&C insurance. " },
  { icon: Policysubmissions, number: 4, title: "Streamlined Policy Submissions", description: "Our SmartQuote Portal and DocAI™ Quote platforms automate the data extraction, validation, and integration for insurance policy submissions. This ensures enhanced accuracy, reduced manual efforts, and quicker policy issuance in P&C insurance. " },
  { icon: AdvancedDocument, number: 5, title: "Advanced Document Processing", description: "Our DocAI™ solutions are equipped with cutting-edge LLMs and computer vision technology to process IDs, Medical Bills, Loss Runs, and Statements of Values with unmatched accuracy. Simplify workflows and eliminate errors with automated data extraction in the P&C insurance domain. " },
  { icon: emailProcessing, number: 6, title: "Automated Email Processing", description: "With Mail2Claim and Mail2Quote, we automate the extraction and organization of policy and claim-related information directly from emails, ensuring faster claim initiation and policy processing with minimal manual intervention in P&C insurance. " },
  { icon: MobileConvenience, number: 7, title: "Mobile Convenience", description: "Our InstaClaim Mobile App and InstaQuote Mobile App offer intuitive platforms for managing claims and obtaining quotes. Users enjoys real-time updates, simplified processes, and instant results for hassle-free insurance interactions." },
  { icon: dataTransformation, number: 8, title: "Flexible Data Integration", description: "Our solutions enable seamless integration of structured and unstructured data into core systems, ensuring scalability and efficiency in handling high-volume workflows of P&C insurance. " },
];
const quotes = [
  {
    text: "“Since joining Seibels earlier this year, Sree has delivered results, helping lead a statewide go-live and positioning the Company to further deploy scalable solutions for our clients.”",
    author: "- Stated Seibels Chief Operations Officer",
  },
  {
    text: "“We’re glad to have him on board and for the insight he brings to the team.”",
    author: "- Nan Brunson",
  },
];
const AnimatedCard = ({ icon, title, description, number }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    style={{ width: "100%" }}
  >
    <Box display="flex" alignItems="center">
      <Typography
        variant="h4"
        component="div"
        sx={{
          fontWeight: "bold",
          color: "grey.600",
          marginRight: 2,
        }}
      >
        {number}
      </Typography>
      <Card
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: 2,
          borderRadius: "8px",
          boxShadow: 2,
          height: '180px'
        }}
      >
        <Grid sx={{ height: 'auto', width: 'auto' }}>

          <img
            src={icon}
            alt={title}
            style={{ width: "60%", height: "60%" }}
          />
        </Grid>
        <CardContent sx={{ padding: "0" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: "bold", color: "#001660", textAlign: 'left', fontSize: '16px' }}
            className='Nasaliza'
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1} sx={{ textAlign: 'left', fontFamily: "Nasaliza, sans-serif", fontSize: '0.8rem' }}>
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  </motion.div>
);
export default function Aboutus() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const getTextAlign = () => {
    if (isMobile) return 'left';
    if (isTablet) return 'justify';
    return 'justify';
  };
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <Header />
      <ScrollAnimation direction="up">
        <Box>
          <Grid
            sx={{
              backgroundColor: "#000166",
              backgroundImage: `url(${footerimg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: "white",
              p: 4,
              height: isMobile ? "auto" : "300px",
              justifyContent: "left",
              textAlign: 'left',
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              className='Nasaliza'
              sx={{ width: '100%', maxWidth: 1200, margin: 'auto', paddingTop: '4rem', paddingLeft: isMobile ? "0rem" : "4rem", fontWeight: "bold", fontSize: isMobile ? "1.5rem" : '3.2rem', color: '#ffffff' }}
            >
              About Us
            </Typography>
          </Grid>
        </Box>
      </ScrollAnimation>
      <Box sx={{ padding: { xs: '0 20px', sm: '0 40px', md: '0 60px' }, width: '100%', maxWidth: 1200, margin: 'auto' }} id="section1">
        <ScrollAnimation direction="right" delay={0.2}>
          <Grid item xs={12} md={12} >
            <Typography variant="body1" sx={{ textAlign: getTextAlign(), fontSize: { xs: '14px', sm: '16px', md: '18px' }, marginTop: '2rem' }}>
              At Innovon.AI, we are driven by a mission to modernize and elevate the insurance industry through the power of artificial intelligence. Our cutting-edge platforms transform how insurers manage claims, policies, and customer interactions by seamlessly integrating advanced AI and machine learning capabilities into every stage of the insurance lifecycle. We are dedicated to creating solutions that enhance efficiency, improve accuracy, and contribute to a greener, more sustainable world.            </Typography>
          </Grid>
        </ScrollAnimation>
        <Grid marginTop={"35px"}>
          <ScrollAnimation direction="left" delay={0.3}>
            <Typography variant="h4" className="Nasaliza" style={{ color: 'green' }}>
              Our Engineering Expertise
            </Typography>
            <Typography variant="body1" style={{ marginTop: '30px' }} sx={{ textAlign: getTextAlign(), fontSize: { xs: '14px', sm: '16px', md: '18px' }, marginTop: '2rem' }}>
              Our engineering team is the backbone of Innovon.AI, driving forward the advanced technology that powers our products. Using a combination of deep industry knowledge and AI expertise, our engineers design and implement solutions that handle complex data processing tasks and automate traditionally labor-intensive workflows. From the earliest stages of development, our engineers prioritize user-friendly design, reliability, and scalability, ensuring that our products meet the needs of our clients both today and in the future.
              <Typography sx={{ fontWeight: '400', fontSize: { xs: '14px', sm: '16px', md: '18px' } }}>

                Here’s how our team of engineers brings our products to life:
              </Typography>
            </Typography>
          </ScrollAnimation>
        </Grid>
        <ScrollAnimation direction="left" delay={0.3}>
          <Container>
            <Grid container spacing={2}>
              {/* Left Column (Text) */}
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'left', paddingTop: '2rem' }}>
                  {[
                    { title: 'State-of-the-Art AI & Machine Learning', description: ': Our engineers harness the potential of LLMs, computer vision, and generative AI to develop highly intelligent and adaptable systems that make sense of complex data.' },
                    { title: 'Data Security & Compliance:', description: 'We understand the critical importance of data security in the insurance industry. Our engineers implement strict security measures and compliance standards across all our products' },
                    { title: 'User-Centered Design:', description: 'By focusing on user experience, our engineering team designs products that are intuitive, efficient, and easy to use, allowing insurers to maximize productivity with minimal training' },
                    { title: 'Agile Development', description: 'Following agile methodologies, our engineers are able to swiftly adapt and evolve our products in response to user feedback and industry changes.' }

                  ].map((item, index) => (
                    <Box key={index} mb={3}>
                      <Typography variant="h5" gutterBottom className="Nasaliza">
                        {item.title}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {item.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
              {/* Right side image */}
              <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box
                  component="img"
                  src={CoreValues}
                  alt="Description"
                  sx={{
                    width: '100%',
                    maxHeight: '100%',
                    borderRadius: 2,
                    objectFit: 'cover',
                  }}
                />
              </Grid>
            </Grid>
          </Container>
        </ScrollAnimation>
        {/* Our Solutions */}
        <Grid marginTop={"35px"}>
          <ScrollAnimation direction="up">
            <Typography variant="h4" className="Nasaliza" style={{ color: 'green' }}>
              Our Solutions
            </Typography>
            <Grid marginTop={"35px"}></Grid>
            <Typography sx={{ fontWeight: '400', fontSize: { xs: '14px', sm: '16px', md: '18px' } }}>
              Our comprehensive suite of solutions addresses a wide range of needs within the insurance industry:
            </Typography>
          </ScrollAnimation>
          <ScrollAnimation direction="right" delay={0.3}>
            <Container>
              <Grid container spacing={2}>
                {/* Left Column (Image) */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box
                    component="img"
                    src={OurSolutions}
                    alt="Description"
                    sx={{
                      width: '100%',
                      maxHeight: '100%',
                      borderRadius: 2,
                      objectFit: 'cover',
                    }}
                  />
                </Grid>
                <Grid marginTop={"15px"}></Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ textAlign: 'left' }}> 
                    {[
                      { title: 'InsurAI™', description: 'Empowering insurers with cutting-edge AI tools to revolutionize business processes.' },
                      { title: 'DocAI™', description: 'Streamlining document workflows with AI-powered automation for claims and policy submissions.' },
                      { title: 'InsurAdmin Platform', description: 'A centralized dashboard for real-time management of policies, claims, and agents.' },
                      { title: 'IVAN - The P&C Insurance AI Virtual Assistant', description: 'A multi-functional assistant that delivers efficient, human-like support across insurance operations.' },
                      { title: 'SmartClaim & SmartQuote Portals', description: ' Simplifying claims and policy submission processes with user-friendly, AI-driven platforms.' },
                    ].map((item, index) => (
                      <Box key={index} mb={3}>
                        <Typography variant="h5" gutterBottom className="Nasaliza">
                          {item.title}
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                          {item.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </ScrollAnimation>
        </Grid>
        <ThemeProvider theme={theme}>
          <ScrollAnimation direction="left" delay={0.3}>
            <Box sx={{ textAlign: "center", p: 2 }}>
              <Typography variant="h4" className="Nasaliza" style={{ color: 'orangered' }} sx={{ padding: '2rem' }}>
                <Typography variant="h4" className="Nasaliza" style={{ color: 'orangered' }}>
                  Our Core Values
                </Typography>
              </Typography>
              <Container>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ textAlign: 'left' }}>
                      {[
                        { title: 'Innovation', description: 'We believe in continuous improvement and exploration of new technologies to create impactful solutions for the insurance industry.' },
                        { title: 'Integrity', description: 'Our commitment to transparency and ethical practices ensures that our solutions not only deliver high performance but also build trust with our clients.' },
                        { title: 'Sustainability', description: 'We’re dedicated to developing solutions that help reduce environmental impact, save resources, and contribute to a greener planet.' },
                        { title: 'Customer-Centricity', description: 'Our customers are at the heart of everything we do. We focus on creating intuitive, effective solutions that address real challenges in the insurance space.' },
                        { title: 'Collaboration', description: 'Teamwork is key to our success. By collaborating across disciplines, we bring together unique perspectives to deliver innovative solutions for the insurance industry.' },
                      ].map((item, index) => (
                        <Box key={index} mb={3}>
                          <Typography variant="h5" gutterBottom className="Nasaliza">
                            {item.title}
                          </Typography>
                          <Typography variant="body1" color="textSecondary">
                            {item.description}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box
                      component="img"
                      src={CardBackground}
                      alt="Description"
                      sx={{
                        width: '100%',
                        maxHeight: '100%',
                        borderRadius: 2,
                        objectFit: 'cover',
                      }}
                    />
                  </Grid>
                </Grid>
              </Container>
              <Grid marginTop={"35px"}>
                <Grid marginTop={'10px'}></Grid>
                <Typography variant="h4" className="Nasaliza" style={{ color: 'green' }}>
                  Core Features
                </Typography>
                <Typography variant="body1" style={{ marginTop: '30px' }} sx={{ fontWeight: '400', fontSize: { xs: '14px', sm: '16px', md: '18px' } }}>
                  Unique, intuitive, and powerful—our AI-driven features transform how insurance is managed, experienced, and enjoyed.
                  <Typography sx={{ fontWeight: '400', fontSize: { xs: '14px', sm: '16px', md: '18px' }, marginBottom: "35px" }}>
                  </Typography>
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} sm={4} style={{ display: 'flex', justifyContent: 'center' }}>
                    <ScrollAnimation direction="up" delay={0.2}>
                      <Card style={{ boxShadow: "5px 5px 2px rgba(0, 0, 0, 0.1)", border: '1px solid green', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '18px' }}>
                        <CardContent style={{ textAlign: 'center' }}>
                          <img src={CustomPlans} alt="CustomPlans" style={{ width: '70px', height: '70px' }} />
                          <Typography variant="h6" className="Nasaliza">Custom Plans</Typography>
                          <Typography variant="body2">
                            Tailored insurance strategies designed to fit your individual
                            needs, ensuring comprehensive coverage and peace of mind.
                          </Typography>
                        </CardContent>
                      </Card>
                    </ScrollAnimation>
                  </Grid>
                  <Grid item xs={12} sm={4} style={{ display: 'flex', justifyContent: 'center' }}>
                    <ScrollAnimation direction="up" delay={0.2}>
                      <Card style={{ boxShadow: "5px 5px 2px rgba(0, 0, 0, 0.1)", border: '1px solid green', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <CardContent>
                          <img src={aibrain} alt="ai-brain" style={{ width: '70px', height: '70px' }} />
                          <Typography variant="h6" className="Nasaliza">AI-Powered Insurance </Typography>
                          <Typography variant="body2">
                            Accelerate your claim process with our cutting-edge AI agents and Intelligent Document Processing (IDP), ensuring rapid and efficient handling of your insurance claims.
                          </Typography>
                        </CardContent>
                      </Card>
                    </ScrollAnimation>
                  </Grid>
                  <Grid item xs={12} sm={4} style={{ display: 'flex', justifyContent: 'center' }}>
                    <ScrollAnimation direction="up" delay={0.2}>
                      <Card style={{ boxShadow: "5px 5px 2px rgba(0, 0, 0, 0.1)", border: '1px solid green', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '18px' }}>
                        <CardContent>
                          <img src={Support247} alt="Support247" style={{ width: '70px', height: '70px' }} />
                          <Typography variant="h6" className="Nasaliza">Support 24/7</Typography>
                          <Typography variant="body2">
                            Our dedicated support team is available around the clock,
                            ready to assist you with any inquiries or claims you may have.
                          </Typography>
                        </CardContent>
                      </Card>
                    </ScrollAnimation>
                  </Grid>
                </Grid>
                <Grid marginTop={"100px"}></Grid>
                <ScrollAnimation direction="up">
                  <Typography variant="h4" className="Nasaliza" style={{ color: 'orangered' }}>
                    Success Stats
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: '30px' }} sx={{ fontWeight: '400', fontSize: { xs: '14px', sm: '16px', md: '18px' } }}>
                    InsurAI is more than insurance—we're changing the game with numbers
                    that speak volumes.
                    <Typography sx={{ fontWeight: '400', fontSize: { xs: '14px', sm: '16px', md: '18px' } }}>
                      Join the revolution and be part of our success story.
                    </Typography>
                  </Typography>
                </ScrollAnimation>
              </Grid>
              <Grid container spacing={3} justifyContent="center" sx={{ my: 4 }}>
                {[
                  {
                    image: CustomerRating,
                    alt: "Customer Rating",
                    value: "98%",
                    label: "Client Satisfaction",
                  },
                  {
                    image: Innovatiive,
                    alt: "Innovative Plans",
                    value: "35",
                    label: "Innovative Plans",
                  },
                  {
                    image: ClaimsHandeled,
                    alt: "Claims Handled",
                    value: "50,000",
                    label: "Claims Handled",
                  },
                ].map((item, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <ScrollAnimation direction="up">
                      <Card
                        sx={{
                          boxShadow: "8px 8px 15px rgba(0, 0, 0, 0.15)",
                          border: "2px solid #1E90FF",
                          borderRadius: "15px",
                          height: "220px",
                          overflow: "hidden",
                          transition: "transform 0.4s ease-in-out, box-shadow 0.4s",
                          "&:hover": {
                            transform: "scale(1.05) translateY(-10px)",
                            boxShadow: "12px 12px 25px rgba(0, 72, 155, 0.2)",
                          },
                          "@keyframes float": {
                            "0%": { transform: "translateY(0)" },
                            "50%": { transform: "translateY(-10px)" },
                            "100%": { transform: "translateY(0)" },
                          },
                        }}
                      >
                        <CardContent
                          sx={{
                            textAlign: "center",
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.alt}
                            style={{
                              width: "70px",
                              height: "70px",
                              animation: "float 2s ease-in-out infinite",
                            }}
                          />
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: "bold",
                              color: "#1E90FF",
                              fontSize: "2rem",
                              letterSpacing: "1px",
                            }}
                          >
                            {item.value}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#333",
                              fontSize: "1rem",
                              mt: 1,
                              fontFamily: "Nasaliza, sans-serif",
                            }}
                          >
                            {item.label}
                          </Typography>
                        </CardContent>
                      </Card>
                    </ScrollAnimation>
                  </Grid>
                ))}
              </Grid>
              <Grid marginTop={'100px'}></Grid>
              <div style={{ backgroundColor: '#f0f4f8', padding: '2px' }}> 
                <div style={{ backgroundColor: '#ffffff', padding: '10px', borderRadius: '8px' }}> 
                  <Box sx={{ p: 2 }}>
                    <Box
                      sx={{
                        bgcolor: "background.paper",
                        p: 4,
                        borderRadius: 2,
                        boxShadow: 3,
                        mb: 4,
                      }}
                    >
                      <Typography variant="h4" gutterBottom align="center" className='Nasaliza' color={'#001660'}>
                        Why Innovon.AI?
                      </Typography>
                      <Typography variant="body1" align="center" fontFamily="sans-serif">
                        Innovon.AI delivers intelligent, innovative solutions tailored to revolutionize the P&C insurance and document automation landscape. Our cutting-edge tools and platforms are designed to streamline processes, enhance client interactions, and provide exceptional efficiency. Here's what makes us unique:
                      </Typography>
                    </Box>
                    <Grid container spacing={4} justifyContent="center">
                      {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={6} key={index}>
                          <AnimatedCard
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    <Box
                      sx={{
                        mt: 6,
                        p: 4,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 3,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="h6" className="Nasaliza" sx={{ marginBottom: '1rem' }}>
                        Highlighting Visionary Leadership
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        Sree Putta
                      </Typography>
                      <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
                        With over three decades of experience in P&C insurance, Sree has driven
                        digital transformation, optimizing speed-to-market strategies and
                        automating data integration. His leadership continues to inspire
                        Innovon.AI.
                        We are proud to highlight the leadership of our CEO, Sree Putta, who was promoted to Assistant Vice President of Product Implementation at Seibels.

                      </Typography>
                      <Box
                        sx={{
                          maxWidth: "800px",

                          margin: "auto",
                          padding: "16px",
                          backgroundColor: "rgba(0, 0, 0, 0.05)",
                          borderRadius: "8px",
                          boxShadow: 3,
                          textAlign: "center",

                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            marginBottom: "16px",
                            fontWeight: "bold",
                            fontSize: '1rem',
                            fontFamily: "sans-serif",
                            color: '#001660'
                          }}
                          className="Nasaliza"
                        >
                          Dynamic Insights in Motion
                        </Typography>

                        <AnimatePresence>
                          <motion.div
                            key={currentQuote} >
                            <Typography
                              variant="h6"
                              fontStyle="italic"
                              sx={{ fontFamily: "Georgia, serif" }}
                            >
                              {quotes[currentQuote].text}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{ marginTop: "8px", fontWeight: "bold" }}
                            >
                              {quotes[currentQuote].author}
                            </Typography>
                          </motion.div>
                        </AnimatePresence>
                      </Box>
                    </Box>
                  </Box>
                </div>
              </div>
            </Box>
          </ScrollAnimation>
        </ThemeProvider>
      </Box><br />
      <Box sx={{
        backgroundImage: `url(${AboutUs})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: { xs: 2, md: 4 },  
        px: { xs: 2, md: 4 },  
        color: 'white',
        minHeight: 'auto',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Grid container spacing={3} sx={{  
          maxWidth: '1200px',
          margin: '0 auto',
          opacity: 0,
          animation: 'fadeIn 0.8s forwards',
          '@keyframes fadeIn': {
            to: { opacity: 1 }
          }
        }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' }, 
              fontWeight: 600,
              mb: 3,
              background: 'linear-gradient(90deg, #60A5FA, #A78BFA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Need a Quick Query?
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{
                p: 2, 
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  background: 'rgba(255, 255, 255, 0.06)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone size={18} style={{ color: '#60A5FA', marginRight: '12px' }} />
                  <Typography sx={{ fontWeight: 500, letterSpacing: 0.5 }}>
                    Contact Number
                  </Typography>
                </Box>
                <Typography sx={{ color: 'white', pl: '32px' }}>+1.513.456.1199</Typography>
              </Box>
              <Box sx={{
                p: 2, 
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  background: 'rgba(255, 255, 255, 0.06)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Mail size={18} style={{ color: '#60A5FA', marginRight: '12px' }} />
                  <Typography sx={{ fontWeight: 500, letterSpacing: 0.5 }}>
                    Our Mail
                  </Typography>
                </Box>
                <Typography sx={{ color: 'white', pl: '32px' }}>info@innovontek.com</Typography>
              </Box>
              <Box sx={{
                p: 2,
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  background: 'rgba(255, 255, 255, 0.06)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <MapPin size={18} style={{ color: '#60A5FA', marginRight: '12px' }} />
                  <Typography sx={{ fontWeight: 500, letterSpacing: 0.5 }}>
                    Our Location
                  </Typography>
                </Box>
                <Typography sx={{ color: 'white', pl: '32px', textAlign: 'left' }}>
                  USA</Typography>
                <Typography sx={{ color: 'white', pl: '32px', textAlign: 'left' }}>
                  254 Chapman Rd, Ste 208 #12287
                  Newark DE 19702, US </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ mt: 6 }}>
            <Box sx={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '16px',
              p: 3,
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              marginTop: '20px'
            }}>
              <Typography variant="h4" sx={{
                mb: 2,
                background: 'linear-gradient(90deg, #F472B6, #A78BFA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600
              }}>
                Get Involved with Innovon.AI
              </Typography>

              <Typography variant="h6" sx={{
                color: 'white',
                mb: 1,
                fontWeight: 500, textAlign: getTextAlign(), fontSize: { xs: '14px', sm: '16px', md: '18px' }, marginTop: '2rem',
              }}>
                Take Your Insurance Operations to the Next Level
              </Typography>

              <Typography sx={{
                textAlign: getTextAlign(), fontSize: { xs: '14px', sm: '16px', md: '18px' }, marginTop: '2rem', color: 'white',
                lineHeight: 1.6,
              }}>
                Experience firsthand how Innovon.AI can streamline your workflows, enhance accuracy,
                and improve customer satisfaction. We're here to support your journey toward smarter,
                more efficient insurance solutions. Contact us today to schedule a personalized demo
                and explore the possibilities.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}