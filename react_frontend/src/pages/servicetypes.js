import React, { useState, useEffect } from "react";
import SEO from "../SEO/SEO.js";
import {
  Box,
  Link,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  Container,
  Grid,
  Card,
  CardContent,
  CssBaseline,
  Paper,
} from "@mui/material";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Email, Dashboard } from "@mui/icons-material";
import {
  PlayCircleFilled,
  SmartToy,
  DocumentScanner,
  Web,
  AutoAwesome,
  SupportAgent,
  Assessment,
  ChatBubble,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Header from "../components/header.js";
import Footer from "../components/footer.js";
import IDP_IMG from "../assets/IDP_IMG.png";
import Email_To_Fnol_IMG from "../assets/Email_To_Fnol_IMG.png";
import InsurAI_IMG from "../assets/InsurAI_IMG.png";
import StyledButtonComponent from "../components/StyledButton.js";
import { motion } from "framer-motion";
import Generative_AI_img1 from "../assets/Generative_AI_img1.png";
import LLMS_IMG2 from "../assets/LLMS_IMG2.png";
import Computer_Vision_img3 from "../assets/Computer_Vision_img3.png";
import Home_1 from "../assets/Home_1.png";
import { useNavigate } from "react-router-dom";
import Insur_AI_Agent from "../assets/InsurAI_Agent.png";
import Google_AI from "../assets/Google_AI.png";
import Secure_AI from "../assets/Secure_AI.png";
import AWS_AI from "../assets/AWS_AI.png";
import Email_policyIntake from "../assets/Home_mail2Quote.png";
import idp_intakePolicy from "../assets/idp_intakePolicy.png";
import IDPFNOL from "../assets/IDPFNOL.png";
import policyIDP from "../assets/policyIDP.png";
import IDPID1 from "../assets/IDP_ID_1.png";
import Loss_Runs from "../assets/Loss_Runs.png";
import MedBill from "../assets/MedBill.png";
import AdminPlatform from "../assets/AdminPlatform.png";
import CLASSIFY from "../assets/CLASSIFY.png";
import SUMMARY from "../assets/Summary_1.png";
import SVO from "../assets/Home_SOV.png";
import { useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

import {
  AssignmentTurnedIn,
  CreditCard,
  ReceiptLong,
  BarChart,
  Folder,
  TableChart,
} from "@mui/icons-material";
import SummarizeIcon from "@mui/icons-material/Summarize";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import NaturePeopleIcon from "@mui/icons-material/NaturePeople";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import TimerIcon from "@mui/icons-material/Timer";
import OpacityIcon from "@mui/icons-material/Opacity";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import PublicIcon from "@mui/icons-material/Public";
import InstaQuote from "../assets/InstaQuote.png";
import InstaClaimHome from "../assets/InstaClaimHome.png";

const claims = [
  "Intelligent Document Processing",
  "Email To FNOL",
  "InsurAI",
  "IDP Loss Run",
];
const slides = [
  {
    title: "Unlock the Future of P&C Insurance with InsurAI solutions.",
    description: "Experience the Next Generation of Insurance Innovation!",
    description2:
      "Our advanced AI solutions are designed to transform your operations and elevate your customer experience.",
    img: Home_1,
    url: "https://www.youtube.com/watch?v=xXl7-O4Qe0s",
  },
  {
    intro: "Introducing",
    intro2: "IVAN",
    title: "The P & C Insurance AI Virtual Assistant",
    description:
      "Your 24/7 AI-powered virtual assistant for seamless FNOL, Policy Intake, Claim Management, and Billing Support. Experience insurance reimagined.",
    img: Insur_AI_Agent,
    url: "https://www.youtube.com/watch?v=BKCuMFq1Vus",
  },
];

const features = [
  {
    title: "InsurAI",
    description:
      "Revolutionize your business with our cutting-edge insurance AI solutions.",
    icon: <SmartToy sx={{ fontSize: 48, color: "#0B70FF" }} />,
  },
  {
    title: "DocAI",
    description:
      "Streamline and automate your document workflows from Claim FNOL to Submission and beyond.",
    icon: <DocumentScanner sx={{ fontSize: 48, color: "#0B70FF" }} />,
  },
  {
    title: "AI-Powered Digital Portals",
    description:
      "Enhance client interactions with seamless, intelligent digital experiences.",
    icon: <Web sx={{ fontSize: 48, color: "#0B70FF" }} />,
  },
  {
    title: "InsurAdmin Platform",
    description:
      "InsurAdmin Platform centralizes policy, claim, and agent management with real-time insights and analytics.",
    icon: <Assessment sx={{ fontSize: 48, color: "#0B70FF" }} />,
  },
  {
    title: "IVAN",
    title2: "The P&C Insurance AI Virtual Assistant",
    description:
      "Leverage the expertise of our AI virtual assistant to provide exceptional service and human-like support.",
    icon: <SupportAgent sx={{ fontSize: 48, color: "#0B70FF" }} />,
  },
  {
    title: "Advanced Language Models (LLMs)",
    description:
      "Utilize sophisticated AI language models to understand and respond to customer needs effectively.",
    icon: <ChatBubble sx={{ fontSize: 48, color: "#0B70FF" }} />,
  },
];

const AnimatedSection = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 },
      }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedImage = ({ src, alt }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.img
      ref={ref}
      src={src}
      alt={alt}
      style={{ width: "100%", maxWidth: "800px" }}
      animate={controls}
      initial="hidden"
      variants={{
        visible: { opacity: 1, scale: 1 },
        hidden: { opacity: 0, scale: 0.8 },
      }}
      transition={{ duration: 0.5 }}
    />
  );
};

const FuturisticButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #010066 30%, #0B70FF 90%)",
  borderRadius: "25px",
  boxShadow: "0 3px 5px 2px rgba(11, 112, 255, .3)",
  color: "white",
  height: 50,
  padding: "10px 30px",
  textTransform: "none",
  "&:hover": {
    background: "linear-gradient(45deg, #0B70FF 30%, #010066 90%)",
  },
}));

const solutions = [
  {
    id: "/insur-ai",
    name: "IVAN",
    description: "AI assistant enhances insurance operations",
    icon: AutoAwesome,
  },
  {
    id: "/insur-admin-platform",
    name: "InsurAdmin Platform",
    description:
      "Integrated platform for carrier administration and operations.",
    icon: Dashboard,
  },
  {
    id: "/docaiClassify",
    docAI: "DocAI",
    name: "Classify",
    description:
      "Automatically categorizes and organizes documents based on their content",
    icon: Folder,
  },

  {
    id: "/summary",
    docAI: "DocAI",
    name: "Summary",
    description:
      "transforming complex documents into concise, actionable insights.",
    icon: SummarizeIcon,
  },
  {
    id: "/docai/claim",
    docAI: "DocAI",
    name: "claim",
    description: "Intelligent Document Processing for FNOL",
    icon: DocumentScanner,
  },
  {
    id: "/DocAIQuote",
    docAI: "DocAI",
    name: "Quote",
    description: "Streamlined policy submission processing",
    icon: AssignmentTurnedIn,
  },
  {
    id: "/doc-ai-loss-run-report",
    docAI: "DocAI",
    name: "Loss Run",
    description: "Streamlined DocAI loss run extraction",
    icon: BarChart,
  },
  {
    id: "/doc-ai-med-bill",
    docAI: "DocAI",
    name: "Med Bill",
    description: "Automated medical bill processing",
    icon: ReceiptLong,
  },
  {
    id: "/docai/idcardextraction",
    docAI: "DocAI",
    name: "ID",
    description: "Intelligent processing of ID cards",
    icon: CreditCard,
  },
  {
    id: "/docaiSov",
    docAI: "DocAI",
    name: "SOV",
    description:
      "extracts, splits, and organizes specific data from documents for streamlined processing.",
    icon: TableChart,
  },
  {
    id: "/Mail2Claim",
    name: "Mail2",
    name2: "Claim",
    description:
      "Automated email analysis streamlines and accelerates claims processing",
    icon: Email,
  },
  {
    id: "/mail-2-quote",
    name: "Mail2",
    name2: "Quote",
    description: "Automated email processing for policy submissions",
    icon: Email,
  },
  {
    id: "/App/instaClaim",
    name: "Insta",
    name2: "Claim",
    description:
      "Manage insurance claims with real-time tracking for a hassle-free experience.",
    icon: MonetizationOnIcon,
  },
  {
    id: "/App/instaQuote",
    name: "Insta",
    name2: "Quote",
    description:
      "Quickly compare and manage insurance quotes to find the best coverage effortlessly.",
    icon: ChatBubbleOutlineIcon,
  },

];
const MainPageSlides = ({
  isScreen,
  isMobile,
  imageSrc,
  imageAlt,
  title,
  description,
  videoLink,
  readMoreLink,
  handleNavigation,
}) => {
  return (
    <AnimatedSection>
      <Box display="flex" justifyContent="center" margin="auto" maxWidth="1200px">
        <Grid container alignItems="center">
          {isScreen && (
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="center">
                <AnimatedImage src={imageSrc} alt={imageAlt} />
              </Box>
            </Grid>
          )}
          <Grid item xs={false} md={0.6} />
          <Grid item xs={12} md={5.4}>
            <Box p={2} textAlign={isScreen ? "center" : "left"}>
              <Typography
                className="Nasaliza"
                sx={{ fontSize: "1.8rem", color: "#001660" }}
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{
                  textAlign: "justify",
                  hyphens: "auto",
                  wordBreak: "break-word",
                  "& > span": { display: "inline-block" },
                }}
              >
                {description}
              </Typography>
              <Box mt={3} sx={{ textAlign: "center" }}>
                <Link
                  href={videoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "-75px" }}
                  >
                    <PlayCircleFilled sx={{ marginRight: "8px" }} />
                    Watch Video
                  </StyledButtonComponent>
                </Link>
                <StyledButtonComponent
                  buttonWidth={200}
                  sx={{ marginLeft: isMobile ? "0px" : "15px" }}
                  onClick={() => handleNavigation(readMoreLink)}
                >
                  Read more
                </StyledButtonComponent>
              </Box>
            </Box>
          </Grid>
          {!isScreen && (
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="center">
                <AnimatedImage src={imageSrc} alt={imageAlt} />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </AnimatedSection>
  );
};

const Servicetypes = () => {
  const [claimText, setClaimText] = useState(claims[0]);
  const [animation, setAnimation] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isScreen = useMediaQuery("(max-width:880px)");
  localStorage.setItem("rout", "/");
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setAnimation(true);
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % claims.length;
        setClaimText(claims[currentIndex]);
        setAnimation(false);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, [claimText, animation]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <ArrowForwardIcon />,
    prevArrow: <ArrowBackIcon />,
  };

  const HoverCard = ({ children }) => (
    <motion.div
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {children}
    </motion.div>
  );

  const navigate = useNavigate();
  const handleNavigation = (route) => {
    navigate(route);
  };
  const StyledCard = styled(Card)(({ theme }) => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
    },
  }));

  const IconWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  }));

  const ReadMoreLink = styled("span")(({ theme }) => ({
    color: theme.palette.primary.main,
    cursor: "pointer",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      width: "0",
      height: "2px",
      bottom: "-2px",
      left: "0",
      backgroundColor: theme.palette.primary.main,
      transition: "width 0.3s ease-in-out",
    },
    "&:hover::after": {
      width: "100%",
    },
  }));
  const [activeDotIndex, setActiveDotIndex] = useState(0);
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    beforeChange: (oldIndex, newIndex) =>
      setActiveDotIndex(Math.floor(newIndex / 3)),
    customPaging: (i) => (
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: i === activeDotIndex ? "#0B70FF" : "#ccc",
          margin: "0 8px",
          boxShadow:
            i === activeDotIndex
              ? "0px 0px 10px rgba(11, 112, 255, 0.5)"
              : "none",
          transition: "background-color 0.3s, transform 0.3s",
          transform: i === activeDotIndex ? "scale(1.2)" : "scale(1)",
        }}
      />
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <Header />
      <SEO location={"/"} />
      <h1
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          margin: "-1px",
          padding: "0",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          border: "0",
        }}
      >
        {" "}
        Next Generation of Insurance Solution
      </h1>
      <Box
        sx={{
          backgroundColor: "#010066",
          color: "white",
          minHeight: isScreen ? "auto" : "700px",
        }}
      >
        <Container>
          <Grid paddingTop={9}></Grid>
          <Slider {...settings}>
            {slides.map((slide, index) => (
              <div key={index}>
                <Grid container alignItems="center" spacing={3}>
                  <Grid item xs={12} md={5}>
                    <Typography
                      className="Nasaliza"
                      sx={{
                        maxWidth: "100%",
                        fontSize: "1.2rem",
                        marginBottom: "2rem",
                      }}
                    >
                      insur
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        AI
                      </span>
                      . innovation. intelligence.
                    </Typography>
                    <Box
                      component="img"
                      src={slide.img}
                      alt={slide.title}
                      sx={{ width: "100%", maxWidth: "100%" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5.5}>
                    {slide.intro && (
                      <>
                        <Typography
                          variant="h1"
                          className="Nasaliza"
                          gutterBottom
                          sx={{
                            fontSize: { xs: "2rem", md: "2rem" },
                            fontWeight: "bold",
                          }}
                        >
                          {slide.intro}
                        </Typography>
                        <Typography
                          variant="h1"
                          className="Nasaliza"
                          gutterBottom
                          sx={{
                            fontSize: { xs: "2rem", md: "3rem" },
                            fontWeight: "bold",
                            color: "blueviolet",
                          }}
                        >
                          {slide.intro2}
                        </Typography>
                      </>
                    )}
                    <Typography
                      variant="h1"
                      className="Nasaliza"
                      gutterBottom
                      sx={{
                        fontSize: { xs: "2rem", md: "2rem" },
                        fontWeight: "bold",
                      }}
                    >
                      {slide.title}
                    </Typography>
                    <Typography
                      variant="h1"
                      gutterBottom
                      sx={{
                        fontSize: { xs: "1rem", md: "1.25rem" },
                        color: "rgba(255, 255, 255, 0.8)",
                        fontFamily:
                          "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
                      }}
                    >
                      {slide.description}
                    </Typography>
                    <Typography
                      variant="body1"
                      gutterBottom
                      sx={{
                        fontSize: { xs: "1rem", md: "1.25rem" },
                        color: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      {slide.description2}
                    </Typography>
                    {slide.description2 ? (
                      <Box textAlign="center" mt={6}>
                        <a
                          href="/requestdemo"
                          style={{ textDecoration: "none" }}
                        >
                          <FuturisticButton>
                            Discover How InsurAI Can Revolutionize Your P&C
                            Insurance Experience
                          </FuturisticButton>
                        </a>
                      </Box>
                    ) : (
                      <Box textAlign="center" mt={6}>
                        <a
                          href="/requestdemo"
                          style={{ textDecoration: "none" }}
                        >
                          <FuturisticButton>
                            Transform Your Insurance Operations with Ivan's
                            AI-Powered Expertise
                          </FuturisticButton>
                        </a>
                      </Box>
                    )}
                    <Box mt={3} sx={{ textAlign: "center" }}>
                      <Link
                        href={slide.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", color: "white" }}
                      >
                        <StyledButtonComponent buttonWidth={200}>
                          <PlayCircleFilled sx={{ marginRight: "8px" }} />
                          Watch Video
                        </StyledButtonComponent>
                      </Link>

                      <StyledButtonComponent
                        buttonWidth={200}
                        sx={{ marginLeft: isMobile ? "0rem" : "2rem" }}
                      >
                        <Link
                          href="/aboutus"
                          sx={{ color: "white", textDecoration: "none" }}
                        >
                          Learn More
                        </Link>
                      </StyledButtonComponent>
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        className="Nasaliza"
                        sx={{
                          fontWeight: "bold",

                          fontSize: isMobile ? "1rem" : "1rem",

                          color: "white",
                        }}
                      >
                        <Link
                          href="/requestdemo"
                          sx={{
                            marginLeft: isMobile ? "0rem" : "5px",
                            color: "whitesmoke",
                            fontWeight: "bold",
                            textDecoration: "none",
                            "&:hover": { textDecoration: "none" },
                          }}
                        >
                          <ContactMailIcon
                            sx={{
                              marginRight: "10px",
                              fontSize: isMobile ? "1.2rem" : "1.5rem",
                              color: "white",
                            }}
                          />
                          Contact us for a free POC / Demo
                        </Link>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </div>
            ))}
          </Slider>
        </Container>
      </Box>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "0rem 2rem",
          position: "relative",
          top: isScreen ? "0" : "-55px",
          width: "100%",
          maxWidth: 1300,
          margin: "auto",
        }}
      >
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={4} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "white",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#0B70FF",
                      color: "white",
                      boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
                      "& .iconBox": {
                        backgroundColor: "white",
                        color: "#0B70FF",
                      },
                    },
                    "& .iconBox": {
                      color: "white",
                    },
                    borderRadius: "8px",
                    boxShadow: 3,
                    overflow: "hidden",
                    height: "200px",
                  }}
                >
                  <Box
                    className="iconBox"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "1rem",
                      backgroundColor: "#0B70FF",
                      transition: "background-color 0.3s, color 0.3s",
                      width: "100px",
                      height: "100%",
                    }}
                  >
                    {React.cloneElement(feature.icon, {
                      sx: {
                        fontSize: 48,

                        transition: "color 0.3s",
                      },
                    })}
                  </Box>
                  <CardContent
                    sx={{
                      textAlign: "left",

                      transition: "background-color 0.3s, color 0.3s",
                      "&:hover": {
                        backgroundColor: "#0B70FF",
                        color: "white",
                      },
                    }}
                  >
                    <Typography variant="h6" className="Nasaliza">
                      {feature.title === "InsurAI" ? (
                        <>
                          Insur
                          <span
                            style={{ color: "red", fontWeight: "bold" }}
                            className="hover-text"
                          >
                            AI
                          </span>
                          <sup
                            style={{
                              position: "relative",
                              top: "-0.5rem",
                              right: "-0.1rem",
                              fontSize: "0.7rem",
                              color: "#001660",
                            }}
                          >
                            TM
                          </sup>
                        </>
                      ) : feature.title === "DocAI" ? (
                        <>
                          DocAI
                          <sup
                            style={{
                              position: "relative",
                              top: "-0.5rem",
                              right: "-0.1rem",
                              fontSize: "0.7rem",
                              color: "#001660",
                            }}
                          >
                            TM
                          </sup>
                        </>
                      ) : feature.title === "InsurAdmin Platform" ? (
                        <>InsurAdmin Platform</>
                      ) : (
                        <>{feature.title}</>
                      )}
                    </Typography>
                    {feature.title2 && (
                      <Typography variant="h6" gutterBottom>
                        {feature.title2}
                      </Typography>
                    )}
                    <Typography variant="body2">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ py: 8, backgroundColor: "#f5f5f5" }}>
        <Box sx={{ width: "100%", maxWidth: 1280, margin: "auto" }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: "center",
              mb: 6,
              color: "#001661",
              fontWeight: "bold",
            }}
            className="Nasaliza"
          >
            Insur<span style={{ color: "red" }}>AI</span>
            <sup
              style={{
                position: "relative",
                top: "-1.8rem",
                right: "-0.1rem",
                fontSize: "0.7rem",
                color: "#001660",
              }}
            >
              TM
            </sup>{" "}
            Solutions Suite
          </Typography>
          {/* Slider Component */}
          <Slider {...sliderSettings}>
            {solutions.map((solution, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={solution.id}
                padding={2}
                marginBottom={1}
              >
                <StyledCard
                  sx={{
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
                    },
                    background: "linear-gradient(145deg, #ffffff, #e6e6e6)",
                    borderRadius: "15px",
                    overflow: "hidden",
                    height: "230px",
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      padding: "1.5rem",
                    }}
                  >
                    <IconWrapper
                      sx={{
                        backgroundColor: "#0B70FF",
                        padding: "1rem",
                        borderRadius: "50%",
                        marginBottom: "1rem",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <solution.icon sx={{ fontSize: 32, color: "white" }} />
                    </IconWrapper>
                    <Typography
                      variant="h5"
                      component="h3"
                      sx={{ color: "#001661", fontWeight: "bold" }}
                    >
                      {solution.name === "InsurAdmin Platform" ? (
                        <>
                          Insur<span style={{ color: "#0B70FF" }}>Admin</span>{" "}
                          Platform
                        </>
                      ) : (
                        <>
                          {solution.docAI && (
                            <>
                              Doc<span style={{ color: "#0B70FF" }}>AI</span>
                            </>
                          )}{" "}
                          {solution.name}
                          {solution.name2 && (
                            <>
                              <span style={{ color: "#0B70FF" }}>
                                {solution.name2}
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, color: "#333" }}>
                      {solution.description}
                    </Typography>
                    <ReadMoreLink
                      sx={{
                        color: "#0B70FF",
                        fontWeight: "bold",
                        textDecoration: "none",
                        cursor: "pointer",
                        transition: "color 0.3s",
                        "&:hover": {
                          color: "#0040FF",
                        },
                      }}
                      onClick={() => handleNavigation(`${solution.id}`)}
                    >
                      Read more
                    </ReadMoreLink>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Slider>
        </Box>
      </Box>
      <MainPageSlides
        isScreen={isScreen}
        isMobile={isMobile}
        imageSrc={AdminPlatform}
        imageAlt="Document Reader"
        title={
          <> Insur<span style={{ color: "#0B70FF" }}>Admin</span> Platform</>
        }
        description={
          <>The Insur<span style={{ color: "#0B70FF" }}>Admin</span>{" "}
            Platform offers insurance carriers a centralized dashboard to
            manage policies, claims, agents, and customer interactions. It
            enables real-time tracking of operations, agent performance,
            and policy status, with customizable reports, automated
            alerts, and analytics for data-driven decisions and improved
            efficiency.</>
        }
        videoLink="https://www.youtube.com/watch?v=j33lYdWUx-o"
        readMoreLink="/insur-admin-platform"
        handleNavigation={handleNavigation}
      />
      <AnimatedSection>
        <Box
          display="flex"
          justifyContent="center"
          padding={2}
          margin="auto"
          maxWidth="1200px"
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="center">
                <AnimatedImage src={InsurAI_IMG} alt="Document Reader" />
              </Box>
            </Grid>
            <Grid item xs={false} md={0.6} />{" "}
            <Grid item xs={12} md={5.4}>
              <Box textAlign={isScreen ? "center" : "left"}>
                <Typography
                  className="Nasaliza"
                  sx={{ fontSize: "1.8rem", color: "#001660" }}
                >
                  IVAN -
                  <span style={{ color: "#0B70FF" }}>
                    Innovon Virtual Assistant
                  </span>
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "justify",
                    hyphens: "auto",
                    wordBreak: "break-word",
                    "& > span": { display: "inline-block" },
                  }}
                >
                  Experience the future of insurance interaction with{" "}
                  <span className="Nasaliza">IVAN</span>, our cutting-edge
                  multi-agent virtual assistant for Property & Casualty
                  insurance. Powered by advanced Large Language Models (LLMs)
                  and Generative AI, <span className="Nasaliza">IVAN</span>{" "}
                  revolutionizes how you manage your insurance needs.
                </Typography>
                <Box mt={3} sx={{ textAlign: "center" }}>
                  <Link
                    href="https://www.youtube.com/watch?v=BKCuMFq1Vus"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <StyledButtonComponent
                      buttonWidth={200}
                      sx={{ marginLeft: isMobile ? "0px" : "-100px" }}
                    >
                      {" "}
                      <PlayCircleFilled sx={{ marginRight: "8px" }} />
                      Watch Video
                    </StyledButtonComponent>
                  </Link>

                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "15px" }}
                    onClick={() => handleNavigation("/insur-ai")}
                  >
                    Read more
                  </StyledButtonComponent>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </AnimatedSection>
      <AnimatedSection>
        <Box
          display="flex"
          justifyContent="center"
          padding={2}
          margin="auto"
          maxWidth="1200px"
          paddingTop={10}
        >
          <Grid container spacing={2} alignItems="center">
            {isScreen && (
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="center">
                  <AnimatedImage src={CLASSIFY} alt="Document Reader" />
                </Box>
              </Grid>
            )}

            <Grid item xs={false} md={0.6} />{" "}
            <Grid item xs={12} md={5.4}>
              <Box p={2} textAlign={isScreen ? "center" : "left"}>
                <Typography
                  className="Nasaliza"
                  sx={{ fontSize: "1.8rem", color: "#001660" }}
                >
                  Doc<span style={{ color: "#0B70FF" }}>AI</span>
                  <sup
                    style={{
                      position: "relative",
                      top: "-0.9rem",
                      right: "-0.1rem",
                      fontSize: "0.5rem",
                    }}
                  >
                    TM
                  </sup>{" "}
                  Classify
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "justify",
                    hyphens: "auto",
                    wordBreak: "break-word",
                    "& > span": { display: "inline-block" },
                  }}
                >
                  Doc<span style={{ color: "#0B70FF" }}>AI</span> Classify is a
                  tool designed to help users automatically classify, extract,
                  and manage documents using advanced AI techniques. It focuses
                  on document processing for tasks such as insurance,
                  healthcare, and other industries where large volumes of data
                  need to be extracted from structured or unstructured
                  documents.
                </Typography>
                <Box mt={3} sx={{ textAlign: "center" }}>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "-70px" }}
                    onClick={() =>
                      window.open(
                        "https://youtu.be/V5JJjCbUmOo?si=hXpKCg-aAkxVmlf4",
                        "_blank"
                      )
                    }
                  >
                    <PlayCircleFilled sx={{ marginRight: "8px" }} />
                    Watch Video
                  </StyledButtonComponent>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "15px" }}
                    onClick={() => handleNavigation("/docaiClassify")}
                  >
                    Read more
                  </StyledButtonComponent>
                </Box>
              </Box>
            </Grid>
            {!isScreen && (
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="center">
                  <AnimatedImage src={CLASSIFY} alt="Document Reader" />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </AnimatedSection>
      <AnimatedSection>
        <Box
          display="flex"
          justifyContent="center"
          margin="auto"
          maxWidth="1200px"
          paddingTop={5}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="center">
                <AnimatedImage src={SUMMARY} alt="Document Reader" />
              </Box>
            </Grid>
            <Grid item xs={false} md={0.6} />{" "}
            <Grid item xs={12} md={5.4}>
              <Box textAlign={isScreen ? "center" : "left"}>
                <Typography
                  className="Nasaliza"
                  sx={{ fontSize: "1.8rem", color: "#001660" }}
                >
                  Doc<span style={{ color: "#0B70FF" }}>AI</span>
                  <sup
                    style={{
                      position: "relative",
                      top: "-0.9rem",
                      right: "-0.1rem",
                      fontSize: "0.5rem",
                    }}
                  >
                    TM
                  </sup>{" "}
                  Summary
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "justify",
                    hyphens: "auto",
                    wordBreak: "break-word",
                    "& > span": { display: "inline-block" },
                  }}
                >
                  DocAI™ Summary is your AI-driven solution for transforming
                  complex documents into concise, actionable insights. By
                  leveraging advanced AI and language models, it extracts
                  critical data from extensive reports, legal documents, and
                  unstructured datasets, empowering informed decision-making
                  while enhancing operational efficiency.
                </Typography>
                <Box mt={3} sx={{ textAlign: "center" }}>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "-100px" }}
                    onClick={() =>
                      window.open("https://youtu.be/_eFHnDZtzjk", "_blank")
                    }
                  >
                    <PlayCircleFilled sx={{ marginRight: "8px" }} />
                    Watch Video
                  </StyledButtonComponent>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "15px" }}
                    onClick={() => handleNavigation("/summary")}
                  >
                    Read more
                  </StyledButtonComponent>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </AnimatedSection>
      <AnimatedSection>
        <Box
          display="flex"
          justifyContent="center"
          margin="auto"
          maxWidth="1200px"
        >
          <Grid container alignItems="center">
            {isScreen && (
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="center">
                  <AnimatedImage src={IDPFNOL} alt="Document Reader" />
                </Box>
              </Grid>
            )}
            <Grid item xs={false} md={0.6} />{" "}
            <Grid item xs={12} md={5.4}>
              <Box p={2} textAlign={isScreen ? "center" : "left"}>
                <Typography
                  className="Nasaliza"
                  sx={{ fontSize: "1.8rem", color: "#001660" }}
                >
                  Doc<span style={{ color: "#0B70FF" }}>AI</span>
                  <sup
                    style={{
                      position: "relative",
                      top: "-0.9rem",
                      right: "-0.1rem",
                      fontSize: "0.5rem",
                    }}
                  >
                    TM
                  </sup>{" "}
                  Claim
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "justify",
                    hyphens: "auto",
                    wordBreak: "break-word",
                    "& > span": { display: "inline-block" },
                  }}
                >
                  DocAI Claim utilizes advanced LLMs and Generative AI to
                  instantly process unstructured documents into structured data,
                  automating claims for faster resolutions, reduced errors, and
                  cost savings for insurers and policyholders.
                </Typography>
                <Box mt={3} sx={{ textAlign: "center" }}>
                  <Link
                    href="https://www.youtube.com/watch?v=Nq_YQzBukN0"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <StyledButtonComponent
                      buttonWidth={200}
                      sx={{ marginLeft: isMobile ? "0px" : "-75px" }}
                    >
                      <PlayCircleFilled sx={{ marginRight: "8px" }} />
                      Watch Video
                    </StyledButtonComponent>
                  </Link>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "15px" }}
                    onClick={() => handleNavigation("/docai/claim")}
                  >
                    Read more
                  </StyledButtonComponent>
                </Box>
              </Box>
            </Grid>
            {!isScreen && (
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="center">
                  <AnimatedImage src={IDPFNOL} alt="Document Reader" />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </AnimatedSection>
      <AnimatedSection>
        <Box
          display="flex"
          justifyContent="center"
          margin="auto"
          maxWidth="1200px"
        >
          <Grid container alignItems="center">
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="center">
                <AnimatedImage src={policyIDP} alt="Document Reader" />
              </Box>
            </Grid>
            <Grid item xs={false} md={0.6} />{" "}
            <Grid item xs={12} md={5.4}>
              <Box textAlign={isScreen ? "center" : "left"}>
                <Typography
                  className="Nasaliza"
                  sx={{ fontSize: "1.8rem", color: "#001660" }}
                >
                  Doc<span style={{ color: "#0B70FF" }}>AI</span>
                  <sup
                    style={{
                      position: "relative",
                      top: "-0.9rem",
                      right: "-0.1rem",
                      fontSize: "0.5rem",
                    }}
                  >
                    TM
                  </sup>{" "}
                  Quote
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "justify",
                    hyphens: "auto",
                    wordBreak: "break-word",
                    "& > span": { display: "inline-block" },
                  }}
                >
                  Harness cutting-edge LLMs and Generative AI to revolutionize
                  insurance policy submissions. Our platform automates data
                  extraction, validates information, and integrates with
                  backend/core systems, speeding up policy issuance while
                  enhancing accuracy and efficiency.
                </Typography>
                <Box mt={3} sx={{ textAlign: "center" }}>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "-100px" }}
                    onClick={() =>
                      window.open(
                        "https://www.youtube.com/watch?v=1Hs5l9rpZlU",
                        "_blank"
                      )
                    }
                  >
                    <PlayCircleFilled sx={{ marginRight: "8px" }} />
                    Watch Video
                  </StyledButtonComponent>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "15px" }}
                    onClick={() => handleNavigation("/DocAIQuote")}
                  >
                    Read more
                  </StyledButtonComponent>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </AnimatedSection>
      <AnimatedSection>
        <Box
          display="flex"
          justifyContent="center"
          margin="auto"
          maxWidth="1200px"
        >
          <Grid container spacing={2} alignItems="center">
            {isScreen && (
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="center">
                  <AnimatedImage src={Loss_Runs} alt="Document Reader" />
                </Box>
              </Grid>
            )}
            <Grid item xs={false} md={0.6} />{" "}
            <Grid item xs={12} md={5.4}>
              <Box textAlign={isScreen ? "center" : "left"}>
                <Typography
                  className="Nasaliza"
                  sx={{ fontSize: "1.8rem", color: "#001660" }}
                >
                  Doc<span style={{ color: "#0B70FF" }}>AI</span>
                  <sup
                    style={{
                      position: "relative",
                      top: "-0.9rem",
                      right: "-0.1rem",
                      fontSize: "0.5rem",
                    }}
                  >
                    TM
                  </sup>{" "}
                  Loss Run
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "justify",
                    hyphens: "auto",
                    wordBreak: "break-word",
                    "& > span": { display: "inline-block" },
                  }}
                >
                  Simplify DocAI Loss Run Data Extraction Our automated solution
                  streamlines the process, effortlessly extracting key
                  information from images or PDFs and organizing it into a
                  clear, easy-to-read table. Save time and reduce effort with
                  our efficient data extraction tool.
                </Typography>
                <Box mt={3} sx={{ textAlign: "center" }}>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "-100px" }}
                    onClick={() =>
                      window.open("https://youtu.be/nOPripLzoLc", "_blank")
                    }
                  >
                    <PlayCircleFilled sx={{ marginRight: "8px" }} />
                    Watch Video
                  </StyledButtonComponent>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "15px" }}
                    onClick={() => handleNavigation("/doc-ai-loss-run-report")}
                  >
                    Read more
                  </StyledButtonComponent>
                </Box>
              </Box>
            </Grid>
            {!isScreen && (
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="center">
                  <AnimatedImage src={Loss_Runs} alt="Document Reader" />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </AnimatedSection>
      <AnimatedSection>
        <Box
          display="flex"
          justifyContent="center"
          padding={2}
          margin="auto"
          maxWidth="1200px"
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="center">
                <AnimatedImage src={MedBill} alt="Document Reader" />
              </Box>
            </Grid>
            <Grid item xs={false} md={0.6} />{" "}
            <Grid item xs={12} md={5.4}>
              <Box p={2} textAlign={isScreen ? "center" : "left"}>
                <Typography
                  className="Nasaliza"
                  sx={{ fontSize: "1.8rem", color: "#001660" }}
                >
                  Doc<span style={{ color: "#0B70FF" }}>AI</span>
                  <sup
                    style={{
                      position: "relative",
                      top: "-0.9rem",
                      right: "-0.1rem",
                      fontSize: "0.5rem",
                    }}
                  >
                    TM
                  </sup>{" "}
                  Med Bill
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "justify",
                    hyphens: "auto",
                    wordBreak: "break-word",
                    "& > span": { display: "inline-block" },
                  }}
                >
                  Our advanced solution leverages state of the art LLM's to
                  automatically extract data from any type of medical bill
                  document. Process PDFs, images, and scanned files
                  effortlessly, capturing critical information to streamline
                  billing workflows and improve accuracy.
                </Typography>
                <Box mt={3} sx={{ textAlign: "center" }}>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "-70px" }}
                    onClick={() =>
                      window.open(
                        "https://www.youtube.com/watch?v=dyKsr3tKob4",
                        "_blank"
                      )
                    }
                  >
                    <PlayCircleFilled sx={{ marginRight: "8px" }} />
                    Watch Video
                  </StyledButtonComponent>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "15px" }}
                    onClick={() => handleNavigation("/doc-ai-med-bill")}
                  >
                    Read more
                  </StyledButtonComponent>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </AnimatedSection>
      <AnimatedSection>
        <Box
          display="flex"
          justifyContent="center"
          padding={2}
          margin="auto"
          maxWidth="1200px"
        >
          <Grid container spacing={2} alignItems="center">
            {isScreen && (
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="center">
                  <AnimatedImage src={IDPID1} alt="Document Reader" />
                </Box>
              </Grid>
            )}
            <Grid item xs={false} md={0.6} />{" "}
            <Grid item xs={12} md={5.4}>
              <Box p={2} textAlign={isScreen ? "center" : "left"}>
                <Typography
                  className="Nasaliza"
                  sx={{ fontSize: "1.8rem", color: "#001660" }}
                >
                  Doc<span style={{ color: "#0B70FF" }}>AI</span>
                  <sup
                    style={{
                      position: "relative",
                      top: "-0.9rem",
                      right: "-0.1rem",
                      fontSize: "0.5rem",
                    }}
                  >
                    TM
                  </sup>{" "}
                  ID
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "justify",
                    hyphens: "auto",
                    wordBreak: "break-word",
                    "& > span": { display: "inline-block" },
                  }}
                >
                  Our advanced solution uses cutting-edge LLMs and computer
                  vision to automatically extract data from any type of ID.
                  Eliminate manual entry, reduce errors, and instantly digitize
                  information from driver's licenses, passports, and various
                  government-issued IDs.
                </Typography>
                <Box mt={3} sx={{ textAlign: "center" }}>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "-75px" }}
                    onClick={() =>
                      window.open(
                        "https://www.youtube.com/watch?v=ckA_59Y2Y3I",
                        "_blank"
                      )
                    }
                  >
                    <PlayCircleFilled sx={{ marginRight: "8px" }} />
                    Watch Video
                  </StyledButtonComponent>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "15px" }}
                    onClick={() => handleNavigation("/docai/idcardextraction")}
                  >
                    Read more
                  </StyledButtonComponent>
                </Box>
              </Box>
            </Grid>
            {!isScreen && (
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="center">
                  <AnimatedImage src={IDPID1} alt="Document Reader" />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </AnimatedSection>
      <AnimatedSection>
        <Box
          display="flex"
          justifyContent="center"
          padding={2}
          margin="auto"
          maxWidth="1200px"
          sx={{ padding: "4rem 0rem" }}
        >
          <Grid container spacing={2} alignItems="center">
            {isScreen && (
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="center">
                  <AnimatedImage src={SVO} alt="Document Reader" />
                </Box>
              </Grid>
            )}
            <Grid item xs={false} md={0.6} />{" "}
            <Grid item xs={12} md={5.4}>
              <Box display="flex" justifyContent="center">
                <AnimatedImage src={SVO} alt="Document Reader" />
              </Box>
            </Grid>
            {!isScreen && (
              <Grid item xs={12} md={6}>
                <Box textAlign={isScreen ? "center" : "left"}>
                  <Typography
                    className="Nasaliza"
                    sx={{ fontSize: "1.8rem", color: "#001660" }}
                  >
                    Doc<span style={{ color: "#0B70FF" }}>AI</span>
                    <sup
                      style={{
                        position: "relative",
                        top: "-0.9rem",
                        right: "-0.1rem",
                        fontSize: "0.5rem",
                      }}
                    >
                      TM
                    </sup>{" "}
                    SOV (Statement of Values)
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      textAlign: "justify",
                      hyphens: "auto",
                      wordBreak: "break-word",
                      "& > span": { display: "inline-block" },
                      marginRight: "70px",
                    }}
                  >
                    DocAI SOV automates the extraction of key data from
                    Statement of Values documents, such as property names,
                    locations, and insured values. It reduces manual work,
                    minimizes errors, and streamlines data processing for better
                    accuracy in asset valuation and insurance workflows.
                  </Typography>
                  <Box mt={3} sx={{ textAlign: "center" }}>
                    <StyledButtonComponent
                      buttonWidth={200}
                      sx={{ marginLeft: isMobile ? "0px" : "-100px" }}
                      onClick={() =>
                        window.open(
                          "https://www.youtube.com/watch?v=iAols-FvN-Y",
                          "_blank"
                        )
                      }
                    >
                      <PlayCircleFilled sx={{ marginRight: "8px" }} />
                      Watch Video
                    </StyledButtonComponent>
                    <StyledButtonComponent
                      buttonWidth={200}
                      sx={{ marginLeft: isMobile ? "0px" : "15px" }}
                      onClick={() => handleNavigation("/docaiSov")}
                    >
                      Read more
                    </StyledButtonComponent>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </AnimatedSection>
      <AnimatedSection>
        <Box
          display="flex"
          justifyContent="center"
          padding={2}
          margin="auto"
          maxWidth="1200px"
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                textAlign={isScreen ? "center" : "left"}
                sx={{ marginLeft: "40px" }}
              >
                <Typography
                  className="Nasaliza"
                  sx={{ fontSize: "1.8rem", color: "#001660" }}
                >
                  Mail2<span style={{ color: "#0B70FF" }}>Claim</span>
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "justify",
                    hyphens: "auto",
                    wordBreak: "break-word",
                    "& > span": { display: "inline-block" },
                  }}
                >
                  Our Mail2Claim solution automates claims processing by
                  extracting and organizing critical information from emails and
                  attachments. This speeds up claim initiation, reduces errors,
                  and minimizes manual work, leading to faster, more accurate
                  claims and improved customer satisfaction.
                </Typography>
                <Box mt={3} sx={{ textAlign: "center" }}>
                  <Link
                    href="https://youtu.be/5nE2aipvMRs"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <StyledButtonComponent
                      buttonWidth={200}
                      sx={{ marginLeft: isMobile ? "0px" : "-100px" }}
                    >
                      <PlayCircleFilled sx={{ marginRight: "8px" }} />
                      Watch Video
                    </StyledButtonComponent>
                  </Link>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "15px" }}
                    onClick={() => handleNavigation("/Mail2Claim")}
                  >
                    Read more
                  </StyledButtonComponent>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={false} md={0.6} />{" "}
            <Grid item xs={12} md={5.4}>
              <Box display="flex" justifyContent="center" p={0}>
                <AnimatedImage src={Email_To_Fnol_IMG} alt="Document Reader" />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </AnimatedSection>
      <AnimatedSection>
        <Box
          display="flex"
          justifyContent="center"
          padding={2}
          margin="auto"
          maxWidth="1200px"
        >
          <Grid container spacing={2} alignItems="center">
            {isScreen && (
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="center">
                  <AnimatedImage
                    src={Email_policyIntake}
                    alt="Document Reader"
                  />
                </Box>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="center">
                <AnimatedImage src={Email_policyIntake} alt="Document Reader" />
              </Box>
            </Grid>
            {!isScreen && (
              <Grid item xs={12} md={6}>
                <Box p={2} textAlign={isScreen ? "center" : "left"}>
                  <Typography
                    className="Nasaliza"
                    sx={{ fontSize: "1.8rem", color: "#001660" }}
                  >
                    Mail2<span style={{ color: "#0B70FF" }}>Quote</span>
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      textAlign: "justify",
                      hyphens: "auto",
                      wordBreak: "break-word",
                      "& > span": { display: "inline-block" },
                    }}
                  >
                    Mail2Quote is a system that automates the extraction and
                    processing of policy-related information directly from
                    emails, streamlining the intake process by converting email
                    data into actionable policy entries, reducing manual effort,
                    and improving accuracy.
                  </Typography>
                  <Box mt={3} sx={{ textAlign: "center" }}>
                    <StyledButtonComponent
                      buttonWidth={200}
                      sx={{ marginLeft: isMobile ? "0px" : "-130px" }}
                      onClick={() =>
                        window.open(
                          "https://www.youtube.com/watch?v=35AhAC1McDA",
                          "_blank"
                        )
                      }
                    >
                      <PlayCircleFilled sx={{ marginRight: "8px" }} />
                      Watch Video
                    </StyledButtonComponent>
                    <StyledButtonComponent
                      buttonWidth={200}
                      sx={{ marginLeft: isMobile ? "0px" : "15px" }}
                      onClick={() => handleNavigation("/mail-2-quote")}
                    >
                      Read more
                    </StyledButtonComponent>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </AnimatedSection>
      <AnimatedSection>
        <Box
          display="flex"
          justifyContent="center"
          padding={2}
          margin="auto"
          maxWidth="1200px"
        >
          <Grid container spacing={2} alignItems="center">
            {isScreen && (
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="center">
                  <AnimatedImage src={IDP_IMG} alt="Document Reader" />
                </Box>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <Box p={2} textAlign={isScreen ? "center" : "left"}>
                <Typography
                  className="Nasaliza"
                  sx={{ fontSize: "1.8rem", color: "#001660" }}
                >
                  Smart<span style={{ color: "#0B70FF" }}>Claim</span> Portal
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "justify",
                    hyphens: "auto",
                    wordBreak: "break-word",
                    "& > span": { display: "inline-block" },
                  }}
                >
                  The SmartClaim portal is a highly accessible platform designed
                  for efficiently reporting and tracking insurance claims. It
                  offers a straightforward process for submitting incidents,
                  delivers real-time updates on claim status, and facilitates
                  hassle-free document uploads, ensuring a smooth experience for
                  users.{" "}
                </Typography>
                <Box mt={3} sx={{ textAlign: "center" }}>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "-130px" }}
                    onClick={() =>
                      window.open(
                        "https://www.youtube.com/watch?v=iD4qB1xVp7M",
                        "_blank"
                      )
                    }
                  >
                    <PlayCircleFilled sx={{ marginRight: "8px" }} />
                    Watch Video
                  </StyledButtonComponent>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "15px" }}
                    onClick={() => handleNavigation("/smart-claim")}
                  >
                    Read more
                  </StyledButtonComponent>
                </Box>
              </Box>
            </Grid>
            {!isScreen && (
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="center">
                  <AnimatedImage src={IDP_IMG} alt="Document Reader" />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </AnimatedSection>
      <AnimatedSection>
        <Box
          display="flex"
          justifyContent="center"
          padding={2}
          margin="auto"
          maxWidth="1200px"
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="center" p={2}>
                <AnimatedImage src={idp_intakePolicy} alt="Document Reader" />
              </Box>
            </Grid>
            <Grid item xs={false} md={0.6} />{" "}
            <Grid item xs={12} md={5.4}>
              <Box textAlign={isScreen ? "center" : "left"}>
                <Typography
                  className="Nasaliza"
                  sx={{ fontSize: "1.8rem", color: "#001660" }}
                >
                  Smart<span style={{ color: "#0B70FF" }}>Quote</span> Portal
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "justify",
                    hyphens: "auto",
                    wordBreak: "break-word",
                    "& > span": { display: "inline-block" },
                  }}
                >
                  The SmartQuote portal is a streamlined platform that
                  simplifies the submission and management of insurance
                  policies. It enables efficient data entry and provides
                  real-time tracking of policy status, enhancing the overall
                  user experience.{" "}
                </Typography>
                <Box mt={3} sx={{ textAlign: "center" }}>
                  <Link
                    href="https://www.youtube.com/watch?v=z3N0RpxUQiw"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <StyledButtonComponent
                      buttonWidth={200}
                      sx={{ marginLeft: isMobile ? "0px" : "-100px" }}
                    >
                      <PlayCircleFilled sx={{ marginRight: "8px" }} />
                      Watch Video
                    </StyledButtonComponent>
                  </Link>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "15px" }}
                    onClick={() => handleNavigation("/SmartQuote")}
                  >
                    Read more
                  </StyledButtonComponent>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </AnimatedSection>
      <AnimatedSection>
        <Box
          display="flex"
          justifyContent="center"
          padding={2}
          margin="auto"
          maxWidth="1200px"
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                textAlign={isScreen ? "center" : "left"}
                sx={{ marginLeft: "40px" }}
              >
                <Typography
                  className="Nasaliza"
                  sx={{ fontSize: "1.8rem", color: "#001660" }}
                >
                  Insta<span style={{ color: "#0B70FF" }}>Claim</span> Mobile
                  App
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    textAlign: "justify",
                    hyphens: "auto",
                    wordBreak: "break-word",
                    "& > span": { display: "inline-block" },
                  }}
                >
                  InstaClaim Mobile App makes managing insurance claims
                  effortless by allowing you to file and track your claims with
                  just a few taps. Our user-friendly app offers real-time
                  updates, keeping you informed at every stage of the process
                  and ensuring a seamless, hassle-free experience from start to
                  finish.{" "}
                </Typography>
                <Box mt={3} sx={{ textAlign: "center" }}>
                  <Link
                    href="https://www.youtube.com/watch?v=V5md9oyb1bs"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <StyledButtonComponent
                      buttonWidth={200}
                      sx={{ marginLeft: isMobile ? "0px" : "-100px" }}
                    >
                      <PlayCircleFilled sx={{ marginRight: "8px" }} />
                      Watch Video
                    </StyledButtonComponent>
                  </Link>
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: isMobile ? "0px" : "15px" }}
                    onClick={() => handleNavigation("/App/instaClaim")}
                  >
                    Read more
                  </StyledButtonComponent>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={false} md={0.6} />{" "}
            <Grid item xs={12} md={5.4}>
              <Box display="flex" justifyContent="center" p={0}>
                <AnimatedImage src={InstaClaimHome} alt="InstaClaim" />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </AnimatedSection>
      <AnimatedSection>
        <Box
          display="flex"
          justifyContent="center"
          padding={2}
          margin="auto"
          maxWidth="1200px"
        >
          <Grid container spacing={2} alignItems="center">
            {isScreen && (
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent="center">
                  <AnimatedImage
                    src={InstaQuote}
                    alt="InstaQuote"
                    height={"250px"}
                  />
                </Box>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <Box display="flex" justifyContent="center">
                <AnimatedImage src={InstaQuote} alt="InstaQuote" />
              </Box>
            </Grid>
            {!isScreen && (
              <Grid item xs={12} md={6}>
                <Box p={2} textAlign={isScreen ? "center" : "left"}>
                  <Typography
                    className="Nasaliza"
                    sx={{ fontSize: "1.8rem", color: "#001660" }}
                  >
                    Insta<span style={{ color: "#0B70FF" }}>Quote</span> Mobile
                    App
                  </Typography>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      textAlign: "justify",
                      hyphens: "auto",
                      wordBreak: "break-word",
                      "& > span": { display: "inline-block" },
                    }}
                  >
                    InstaQuote Mobile App is a powerful platform that simplifies
                    getting and managing insurance quotes. With its easy-to-use
                    interface, users can quickly compare different options to
                    find the right coverage for their needs. Built for speed and
                    convenience, InstaQuote App provides fast quotes, cutting
                    out the hassle of lengthy paperwork and long waiting times.{" "}
                  </Typography>
                  <Box mt={3} sx={{ textAlign: "center" }}>
                    <StyledButtonComponent
                      buttonWidth={200}
                      sx={{ marginLeft: isMobile ? "0px" : "-130px" }}
                      onClick={() =>
                        window.open(
                          "https://www.youtube.com/watch?v=PzfmnzxU7CU",
                          "_blank"
                        )
                      }
                    >
                      <PlayCircleFilled sx={{ marginRight: "8px" }} />
                      Watch Video
                    </StyledButtonComponent>
                    <StyledButtonComponent
                      buttonWidth={200}
                      sx={{ marginLeft: isMobile ? "0px" : "15px" }}
                      onClick={() => handleNavigation("/App/instaQuote")}
                    >
                      Read more
                    </StyledButtonComponent>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </AnimatedSection>
      <Box sx={{ backgroundColor: "#001660", color: "#fff" }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
            margin: "auto",
            p: 4,
            minHeight: "400px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 1200,
              margin: "auto",
              p: 4,
              minHeight: "400px",
              backgroundColor: "#f0f4f7",
            }}
          >
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: "bold", mb: 3, color: "#00509E" }}
              className="Nasaliza"
            >
              Innovon.AI's insur
              <span style={{ color: "red", fontWeight: "bold" }}>AI</span> -
              Shaping a Greener Future 🌍
            </Typography>

            <Typography
              align="left"
              sx={{
                mt: 4,
                fontSize: "1rem",
                fontWeight: "medium",
                color: "#333",
                maxWidth: 900,
                margin: "auto",
              }}
            >
              <Box display="flex" alignItems="center">
                <AutoAwesomeIcon
                  sx={{ mr: 1, color: "#00bcd4", fontSize: 28 }}
                />
                By integrating Innovon.AI's insurAI solutions, insurers are not
                only gaining efficiency but also making a greener impact on the
                world. Together, we can build a sustainable future for the
                insurance industry.
              </Box>
            </Typography>
            <Typography
              align="left"
              sx={{
                fontSize: "1rem",
                fontWeight: "medium",
                color: "#333",
                maxWidth: 900,
                margin: "auto",
                mt: 2,
              }}
            >
              <Box display="flex" alignItems="center">
                <span
                  role="img"
                  aria-label="light bulb"
                  style={{ fontSize: 28, color: "#ffeb3b", marginRight: 8 }}
                >
                  💡
                </span>
                Innovon.AI isn't just revolutionizing insurance processes, we're
                helping the industry reduce its environmental impact. For a
                typical P&C insurance company, our InsurAI solutions can save up
                to...
              </Box>
            </Typography>
            <Grid
              container
              spacing={4}
              justifyContent="center"
              sx={{ marginTop: "1rem" }}
            >
              {[
                {
                  icon: (
                    <NaturePeopleIcon sx={{ fontSize: 40, color: "#76FF03" }} />
                  ),
                  title: "200+ tons CO2 Emissions Reduced",
                  description:
                    "Through digital workflows, minimizing reliance on physical infrastructure and transportation.",
                },
                {
                  icon: (
                    <InsertDriveFileIcon
                      sx={{ fontSize: 40, color: "#FFEA00" }}
                    />
                  ),
                  title: "1,000,000+ Sheets of Paper Saved",
                  description:
                    "By digitizing FNOL, claims, and submission processes, reducing waste.",
                },
                {
                  icon: <TimerIcon sx={{ fontSize: 40, color: "#FF5722" }} />,
                  title: "20,000+ Work Hours Saved",
                  description:
                    "Automating submissions and claims reduces both time and energy consumption.",
                },
                {
                  icon: <OpacityIcon sx={{ fontSize: 40, color: "#29B6F6" }} />,
                  title: "10,000+ Gallons of Water Saved",
                  description:
                    "Reducing the need for printed materials conserves significant amounts of water.",
                },
                {
                  icon: <FlashOnIcon sx={{ fontSize: 40, color: "#FFC400" }} />,
                  title: "50,000+ kWh Electricity Conserved",
                  description:
                    "Optimized data management reduces server loads and conserves power.",
                },
                {
                  icon: <PublicIcon sx={{ fontSize: 40, color: "#00E676" }} />,
                  title: "Building a Greener Future with InsurAI",
                  description:
                    "By integrating Innovon.AI's solutions, insurers gain efficiency while making a positive environmental impact.",
                },
              ].map((item, index) => (
                <Grid item xs={12} sm={6} lg={4} key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 4,
                      backgroundColor: "#00509E",
                      textAlign: "center",
                      color: "#fff",
                      height: "100%",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.5)",
                        backgroundColor: "#1D4E89",
                      },
                    }}
                  >
                    {item.icon}
                    <Typography
                      variant="h6"
                      sx={{ mt: 2 }}
                      className="Nasaliza"
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {item.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 3, color: "white" }}
          >
            Together, we can build a sustainable future for the insurance
            industry. 🌍💡
          </Typography>
        </Box>
      </Box>
      <Grid marginTop={10}></Grid>
      <Container>
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{ color: "#6C4AE3", fontWeight: "bold" }}
            className="Nasaliza"
          >
            Unlocking the Potential of Cutting-Edge Technologies
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, mb: 4 }}>
            Our company utilizes state-of-the-art technologies to deliver
            groundbreaking solutions that revolutionize industries.
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ textAlign: "left" }}>
            <HoverCard>
              <CardContent>
                <Box>
                  <img
                    src={Generative_AI_img1}
                    alt="Increase Capacity"
                    style={{
                      width: "50px",
                      height: "50px",
                      transition: "background-color 0.3s ease-in-out",
                    }}
                  />
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mt: 2, fontWeight: "bold" }}
                    className="Nasaliza"
                  >
                    Generative AI
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Unleash innovation with AI-powered solutions that create,
                    adapt, and optimize insurance processes.
                  </Typography>
                </Box>
              </CardContent>
            </HoverCard>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: "left" }}>
            <HoverCard>
              <CardContent>
                <Box>
                  <img
                    src={LLMS_IMG2}
                    alt="Reduce Cost"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mt: 2, fontWeight: "bold" }}
                    className="Nasaliza"
                  >
                    Large Language Models
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Elevate communication and analysis with advanced AI that
                    understands and processes complex insurance language.
                  </Typography>
                </Box>
              </CardContent>
            </HoverCard>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: "left" }}>
            <HoverCard>
              <CardContent>
                <Box>
                  <img
                    src={Computer_Vision_img3}
                    alt="Rapid ROI"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mt: 2, fontWeight: "bold" }}
                    className="Nasaliza"
                  >
                    Computer Vision for DocAI
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    We leverage Computer Vision for DocAI to automate swift and
                    accurate data extraction and analysis from diverse
                    documents.
                  </Typography>
                </Box>
              </CardContent>
            </HoverCard>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ textAlign: "left", marginTop: "1rem" }}
          >
            <HoverCard>
              <CardContent>
                <Box>
                  <img
                    src={Google_AI}
                    alt="Increase Capacity"
                    style={{
                      width: "50px",
                      height: "50px",
                      transition: "background-color 0.3s ease-in-out",
                    }}
                  />
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mt: 2, fontWeight: "bold" }}
                    className="Nasaliza"
                  >
                    Google AI Integration
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Seamlessly integrate with Google AI for enhanced
                    functionality.
                  </Typography>
                </Box>
              </CardContent>
            </HoverCard>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ textAlign: "left", marginTop: "1rem" }}
          >
            <HoverCard>
              <CardContent>
                <Box>
                  <img
                    src={AWS_AI}
                    alt="Reduce Cost"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mt: 2, fontWeight: "bold" }}
                    className="Nasaliza"
                  >
                    AWS AI Integration
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Leverage the power of AWS AI for secure and scalable
                    solutions.
                  </Typography>
                </Box>
              </CardContent>
            </HoverCard>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{ textAlign: "left", marginTop: "1rem" }}
          >
            <HoverCard>
              <CardContent>
                <Box>
                  <img
                    src={Secure_AI}
                    alt="Rapid ROI"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mt: 2, fontWeight: "bold" }}
                    className="Nasaliza"
                  >
                    Secure Data Management
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Protect your data with our robust and secure management
                    system.
                  </Typography>
                </Box>
              </CardContent>
            </HoverCard>
          </Grid>
        </Grid>
      </Container>
      <Grid marginTop={10}></Grid>
      <Footer />
    </>
  );
};

export default Servicetypes;
