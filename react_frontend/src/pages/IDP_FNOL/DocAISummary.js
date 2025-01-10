import Header from "../../components/header";
import Footer from "../../components/footer";
import { React, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Link,
  useMediaQuery,
  useTheme,
  Grid,
} from "@mui/material";
import lightning from "../../assets/Summary_risk.png";
import chip from "../../assets/Summary_claim.png";
import documentation from "../../assets/customer.png";
import StyledButtonComponent from "../../components/StyledButton";
import { useNavigate } from "react-router-dom";
import SideImage from "../../assets/SummaryTWO.png";
import MainImage from "../../assets/Summary.png";
import { PlayCircleFilled } from "@mui/icons-material";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import { useEffect } from "react";

const CardItem = ({ logo, title, content }) => (
  <Card
    sx={{
      minWidth: 280,
      maxWidth: 360,
      height: 300,
      textAlign: "center",
      overflow: "hidden",
      position: "relative",
      transition:
        "transform 0.4s ease, box-shadow 0.4s ease, background-color 0.4s ease",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      bgcolor: "#f9f9f9",
      borderRadius: "16px",
      mb: 4,
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
        background: "linear-gradient(135deg, #a7d8f0, #d6efff)",
        color: "#000",
      },
    }}
  >
    <Box
      sx={{
        display: "block",
        margin: "auto",
        width: 80,
        height: 80,
        borderRadius: "50%",
        padding: 0,
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        position: "relative",
        mt: 3,
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="Logo"
        sx={{
          width: "70%",
          height: "70%",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) scale(0.8)",
          transition: "transform 0.4s ease-in-out",
          "&:hover": {
            transform: "translate(-50%, -50%) scale(1)",
          },
        }}
      />
    </Box>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography
        className="Nasaliza"
        variant="h6"
        component="div"
        sx={{
          mt: 4,
          fontWeight: "bold",
          color: "#333",
          transition: "color 0.3s",
          "&:hover": { color: "#000" },
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          mt: 2,
          color: "#555",
          fontFamily:
            "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
          transition: "color 0.3s",
          "&:hover": { color: "#000" },
        }}
      >
        {content}
      </Typography>
    </CardContent>
  </Card>
);

const Cards = () => {
  const cardData = [
    {
      id: 1,
      title: "Accelerated Knowledge Extraction",
      content:
        "Summarize lengthy documents like police reports into concise, actionable insights instantly.",
      logo: chip,
    },
    {
      id: 2,
      title: "Intelligent Document Summaries",
      content:
        "Leverage AI to uncover key details and patterns from complex data files",
      logo: lightning,
    },
    {
      id: 3,
      title: "Precision Summarization Advantage",
      content:
        "Provide focused summaries preserving key details, enabling quicker decisions in insurance workflows.",
      logo: documentation,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        flexWrap: "wrap",
        p: 3,
      }}
    >
      {cardData.map((card) => (
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

const DocAISummaryPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const Authorization =
    !!localStorage.getItem("Auth") ||
    !!sessionStorage.getItem("NonInsuredAuth");
  const [, setHovered] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    setIsVisible(true);
  }, []);
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
      <Box
        sx={{
          height: isMobile ? "auto" : "620px",
          backgroundColor: "#000166",
          backgroundImage: `url(${require("../../assets/Summary_background.jpg")})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          color: "#fff",
          p: 4,
          justifyContent: "center",
        }}
      >
        {/* Title */}
        <Typography
          className="Nasaliza"
          variant={isMobile ? "h4" : "h3"}
          sx={{
            position: isMobile ? "relative" : "absolute",
            top: isMobile ? "auto" : "100px",
            left: isMobile ? "auto" : "50%",
            transform: isMobile ? "none" : "translateX(-50%)",
            color: "",
            fontSize: isMobile ? "1.5rem" : "2rem",
            letterSpacing: "0.01px",
            lineHeight: 1.2,
            textAlign: "center",
            marginTop: isMobile ? "0" : "-5px",
            mb: isMobile ? 2 : 0,
          }}
        >
          Doc<span style={{ color: "#0B70FF" }}>AI</span>
          <sup
            style={{
              position: "relative",
              top: "-1rem",
              right: "-0.1rem",
              fontSize: "0.5rem",
            }}
          >
            TM
          </sup>{" "}
          Summary
        </Typography>
        {/* Left Image Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "450px",
            width: "450px",
            marginLeft: isMobile ? "0" : "5rem",
            animation: isVisible ? "slideIn 1s ease-out" : "none",
          }}
        >
          <img
            src={MainImage}
            alt="Summary"
            style={{
              maxWidth: "100%",
              maxHeight: "80%",
              animation: isVisible ? "slideIn 1s ease-out" : "none",
            }}
          />
        </Box>
        {/* Right Text Section */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "left",
            textAlign: "center",
            pr: isMobile ? 0 : 2,
            marginRight: isMobile ? "0" : "7rem",
            mt: isMobile ? 2 : 2,
          }}
        >
          <Typography
            className="Nasaliza"
            variant={isMobile ? "h1" : "h1"}
            component={"h1"}
            sx={{
              color: "#ffffff",
              marginBottom: "1rem",
              fontSize: isMobile ? "2rem" : "1.7rem",
              textAlign: "left",
              marginRight: '50px'
            }}
          >
            Revolutionizing Document Summarization with
            Doc<span style={{ color: "#0B70FF" }}>AI</span>
            <sup
              style={{
                position: "relative",
                top: "-1rem",
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
            sx={{
              maxWidth: "100%",
              fontFamily:
                "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
              marginTop: "-1rem",
              fontSize: isMobile ? "1rem" : "1rem",
              color: "whitesmoke",
              textAlign: "justify",
              lineHeight: 1.8,
              marginRight: '50px'
            }}
          >
            DocAI™ Summary uses AI and LLMs to extract and summarize insights from complex documents, empowering policyholders, insurers, and adjusters to make faster, informed decisions in today’s data-driven insurance landscape.          </Typography>

          {!Authorization ? (
            <Box sx={{ mt: 2 }} textAlign={"center"}>
              <Link
                style={{ color: "black" }}
                onClick={() => checked("/login")}
                href="/requestdemo"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <StyledButtonComponent buttonWidth={200}>
                  Request for Demo
                </StyledButtonComponent>
                <Link
                  href="https://youtu.be/_eFHnDZtzjk"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <StyledButtonComponent
                    buttonWidth={200}
                    sx={{ marginLeft: "20px" }}
                  >
                    <PlayCircleFilled sx={{ marginRight: "8px" }} />
                    Watch Video
                  </StyledButtonComponent>
                </Link>
              </Link>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }} textAlign={"center"}>
              <StyledButtonComponent
                sx={{ marginLeft: '-200px' }}
                buttonWidth={200}
                onClick={() => navigate("/summaryDemo")}
              >
                Demo
              </StyledButtonComponent>
              <Link
                href="https://youtu.be/_eFHnDZtzjk"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "white" }}
              >
                <StyledButtonComponent
                  buttonWidth={200}
                  sx={{ marginLeft: isMobile ? "0rem" : "20px" }}
                >
                  <PlayCircleFilled sx={{ marginRight: "8px" }} />
                  Watch Video
                </StyledButtonComponent>
              </Link>
            </Box>
          )}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              className="Nasaliza"
              sx={{
                fontWeight: "bold",
                paddingTop: "5px",
                fontSize: "1.1rem",
                textAlign: "center",
                color: "white",
                marginLeft: '-200px',
              }}
            >
              <ContactMailIcon
                sx={{ marginRight: "10px", fontSize: "1.5rem", color: "white" }}
              />
              Contact us for a free POC
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          margin: "auto",
          p: "1rem",
        }}
      >
        <Typography
          className="Nasaliza"
          variant={isMobile ? "h5" : "h4"}
          component="div"
          sx={{
            color: "#000166",
            fontWeight: 600,
            mt: 2,
            mb: 3,
            textAlign: "center",
            fontSize: isMobile ? "1.5rem" : "2rem",
          }}
        >
          Purpose of DocAI™ Summary
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily:
              "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif",
            fontSize: isMobile ? "0.9rem" : "1rem",
            textAlign: "center",
            marginLeft: '50px',
            marginRight: '50px'
          }}
        >
          DocAI™ Summary transforms P&C insurance by summarizing unstructured data like reports and statements, enabling insurers, adjusters, and policyholders to make fast, informed decisions for better outcomes.        </Typography>
      </Box>
      {/* Cards Component */}
      <Cards />
      {/* New Section Below Cards */}
      <Grid container spacing={isMobile ? 2 : 4}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            bgcolor: "White",
            marginBottom: "2rem",
          }}
        >
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={SideImage}
                  alt="SideImage"
                  style={{
                    maxWidth: "100%",
                    height: "370px",
                    borderRadius: "8px",
                    marginLeft: isMobile ? "0px" : "60px",
                  }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ marginLeft: "-120px" }}>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                px: 4,
              }}
            >
              <Typography
                className="Nasaliza"
                variant="h4"
                sx={{
                  color: "#000166",
                  fontWeight: 600,
                  textAlign: "left",
                  mb: 2,
                }}
              >
                DocAI™ Summary: Empowering Smarter Decisions in P&C Insurance
              </Typography>
              <Typography sx={{ textAlign: "left", marginRight: '50px' }}>
                DocAI™ Summary simplifies complex insurance data by condensing lengthy reports into actionable insights, saving time and reducing complexity. It enhances decision-making by highlighting critical details, identifying trends, and minimizing the risk of oversight. This empowers insurers and policyholders to make faster, more informed, and confident decisions.              </Typography>
              {!Authorization ? (
                <Box sx={{ mt: 2 }} textAlign={"left"}>
                  <Link
                    style={{ color: "black" }}
                    onClick={() => checked("/login")}
                    href="/requestdemo"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <StyledButtonComponent buttonWidth={250}>
                      Request for Demo
                    </StyledButtonComponent>
                    <Link
                      href="https://youtu.be/_eFHnDZtzjk"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      <StyledButtonComponent
                        buttonWidth={200}
                        sx={{ marginLeft: "20px" }}
                      >
                        <PlayCircleFilled sx={{ marginRight: "8px" }} />
                        Watch Video
                      </StyledButtonComponent>
                    </Link>
                  </Link>
                </Box>
              ) : (
                <Box sx={{ mt: 2 }} textAlign={"center"}>
                  <StyledButtonComponent
                    buttonWidth={200}
                    onClick={() => navigate("/summaryDemo")}
                    style={{ marginTop: isMobile ? "16px" : "0" }}
                  >
                    Demo
                  </StyledButtonComponent>
                  <Link
                    href="https://youtu.be/_eFHnDZtzjk"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    <StyledButtonComponent
                      buttonWidth={200}
                      sx={{
                        marginLeft: "20px",
                        marginRight: "-200px",
                        marginTop: "-2px",
                      }}
                    >
                      {" "}
                      <PlayCircleFilled sx={{ marginRight: "8px" }} />
                      Watch Video
                    </StyledButtonComponent>
                  </Link>
                </Box>
              )}
            </Box>
          </Grid>
        </Box>
      </Grid>
      <Footer />
    </>
  );
};

export default DocAISummaryPage;