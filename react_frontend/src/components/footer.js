import React, { useEffect } from "react";
import { Grid, Typography, Box, Container } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import linkedinnew from "../assets/linkedinnew.png";
import twittericon from "../assets/twittericon.png";
import facebookicon from "../assets/facebookicon.png";
import "../components/componentstyles.css";
import "../components/Styles.css";
import { Link, NavLink } from "react-router-dom";
import YouTubeIcon from "../assets/Youtube.png";
import instagram from "../assets/instagram.png";
import StyledButtonComponent from "./StyledButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";

export default function Footer() {
  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
  const GA4_MEASUREMENT_ID = "G-L241J2GEC3";
  useEffect(() => {
    const initializeGA4 = () => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", GA4_MEASUREMENT_ID);
    };
    if (typeof window.gtag === "undefined") {
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        initializeGA4();
      };
    } else {
      initializeGA4();
    }
  }, []);

  return (
    <>
      <Box className="footermain">
        <Container maxWidth="lg">
          <Grid className="footermain" style={{ textAlign: "left" }}>
            <Grid className="footer-responsive">
              <Typography
                variant="h6"
                gutterBottom
                className="footerheading billy"
              >
                About
              </Typography>
              <Grid marginBottom={"15px"}></Grid>
              <Typography
                variant="body2"
                gutterBottom
                className="footer-heading About_text"
              >
                Innovon Technologies revolutionizes insurance management with
                cutting-edge SmartClaim & DocAI document processing,
                streamlining claims for efficient resolution and providing
                seamless experiences for insurers and insured parties{" "}
                <Link
                  to={"/aboutus"}
                  onClick={() => {
                    document.title = `About us-Innovon Technologies`;
                    window.scrollTo(0, 0);
                  }}
                  class="link_more"
                  style={{ color: "#0B70FF" }}
                >
                  ...Read more
                </Link>
              </Typography>
            </Grid>
            <Grid className="footer-responsive service">
              <div variant="h6" gutterBottom className="billy">
                Solutions
              </div>
              <Grid marginBottom="15px"></Grid>
              <Typography className="footerservices">
                <NavLink to="/insur-ai" onClick={() => window.scrollTo(0, 0)}>
                  <span>-</span>IVAN [ Innovon Virtual Assistant ]
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <NavLink
                  to="/insur-admin-platform"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <span>-</span>InsurAdmin Platform
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <NavLink
                  to="/smart-claim"
                  onClick={() => {
                    document.title = `${!Authorization ? "Confirm Insured" : "signin"
                      } -Innovon Technologies`;
                    window.scrollTo(0, 0);
                  }}
                >
                  <span>-</span>SmartClaim Portal
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <NavLink
                  to="/SmartQuote"
                  onClick={() => {
                    document.title = `${!Authorization ? "/SmartQuote" : "signin"
                      } -Innovon Technologies`;
                    window.scrollTo(0, 0);
                  }}
                >
                  <span>-</span>SmartQuote Portal
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <NavLink
                  to="/docai/claim"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <span>-</span>DocAI
                  <sup
                    style={{
                      position: "relative",
                      top: "-0.5rem",
                      right: "-0.1rem",
                      fontSize: "0.5rem",
                    }}
                  >
                    TM
                  </sup>{" "}
                  Claim
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <NavLink to="/DocAIQuote" onClick={() => window.scrollTo(0, 0)}>
                  <span>-</span>DocAI
                  <sup
                    style={{
                      position: "relative",
                      top: "-0.5rem",
                      right: "-0.1rem",
                      fontSize: "0.5rem",
                    }}
                  >
                    TM
                  </sup>{" "}
                  Quote
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <NavLink
                  to="/docaiClassify"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <span>-</span>DocAI
                  <sup
                    style={{
                      position: "relative",
                      top: "-0.5rem",
                      right: "-0.1rem",
                      fontSize: "0.5rem",
                    }}
                  >
                    TM
                  </sup>{" "}
                  Classify
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <NavLink to="/summary" onClick={() => window.scrollTo(0, 0)}>
                  <span>-</span>DocAI
                  <sup
                    style={{
                      position: "relative",
                      top: "-0.5rem",
                      right: "-0.1rem",
                      fontSize: "0.5rem",
                    }}
                  >
                    TM
                  </sup>{" "}
                  Summary
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <NavLink
                  to="/doc-ai-loss-run-report"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <span>-</span>DocAI
                  <sup
                    style={{
                      position: "relative",
                      top: "-0.5rem",
                      right: "-0.1rem",
                      fontSize: "0.5rem",
                    }}
                  >
                    TM
                  </sup>{" "}
                  Loss Run
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <NavLink
                  to="/doc-ai-med-bill"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <span>-</span>DocAI
                  <sup
                    style={{
                      position: "relative",
                      top: "-0.5rem",
                      right: "-0.1rem",
                      fontSize: "0.5rem",
                    }}
                  >
                    TM
                  </sup>{" "}
                  Med Bill
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <NavLink
                  to="/docai/idcardextraction"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <span>-</span>DocAI
                  <sup
                    style={{
                      position: "relative",
                      top: "-0.5rem",
                      right: "-0.1rem",
                      fontSize: "0.5rem",
                    }}
                  >
                    TM
                  </sup>{" "}
                  ID
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <NavLink to="/docaiSov" onClick={() => window.scrollTo(0, 0)}>
                  <span>-</span>DocAI
                  <sup
                    style={{
                      position: "relative",
                      top: "-0.5rem",
                      right: "-0.1rem",
                      fontSize: "0.5rem",
                    }}
                  >
                    TM
                  </sup>{" "}
                  SOV
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <NavLink to="/Mail2Claim" onClick={() => window.scrollTo(0, 0)}>
                  <span>-</span>Mail2Claim
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <NavLink
                  to="/mail-2-quote"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <span>-</span>Mail2Quote
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <NavLink
                  to="/App/instaClaim"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <span>-</span>InstaClaim Mobile App
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <NavLink
                  to="/App/instaQuote"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <span>-</span>InstaQuote Mobile App
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <NavLink to="/TermsofUse" onClick={() => window.scrollTo(0, 0)}>
                  <span>-</span>Terms of Use
                </NavLink>
              </Typography>
              <Typography className="footerservices">
                <a
                  href="https://innovontek.com/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>-</span>Privacy Policy
                </a>
              </Typography>
              <Grid item xs={12} sm={6} md={4} lg={2}></Grid>
            </Grid>
            <Grid className="footer-responsive" marginBottom={"50px"}>
              <Typography
                variant="h6"
                gutterBottom
                className="footerheading  billy"
              >
                Get In Touch
              </Typography>
              <Typography className="footercontact">
                <a href="mailto:sales@innovontek.com" className="linkto">
                  {" "}
                  <EmailIcon
                    className="fotter-icon"
                    href="mailto:sales@innovontek.com"
                  />{" "}
                  <span className="GT_content">sales@innovontek.com</span>
                </a>
              </Typography>
              <Grid marginBottom="8px"></Grid>
              <Typography className="footercontact">
                <a href="tel:+15134561199" className="linkto">
                  <PhoneIcon className="fotter-icon" />
                  <span className="GT_content"> +1.513.456.1199</span>{" "}
                </a>
              </Typography>
              <Grid marginBottom="8px"></Grid>
              <Typography className="footercontact">
                <a href="tel:+918008673672" className="linkto">
                  {" "}
                  <PhoneIcon className="fotter-icon" />{" "}
                  <span className="GT_content">+91.8008.673.672</span>{" "}
                </a>
              </Typography>
              <Grid marginBottom="8px"></Grid>
              <Typography className="footercontact">
                <LocationOnIcon className="fotter-icon" />
                <span className="GT_content">
                  {" "}
                  USA
                  <br />
                  <span
                    style={{
                      marginLeft: "29px",
                      fontSize: " 0.9rem",
                      color: "white",
                    }}
                  >
                    254 Chapman Rd, Ste 208 #12287{" "}
                  </span>{" "}
                </span>
                <br />
                <span
                  style={{
                    marginLeft: "29px",
                    fontSize: " 0.9rem",
                    color: "white",
                  }}
                >
                  Newark DE 19702, US
                </span>
              </Typography>
              <Grid marginBottom="8px"></Grid>
              <Typography className="footercontact">
                <Typography className="footercontact">
                  <LocationOnIcon className="fotter-icon" />{" "}
                  <span className="GT_content">
                    INDIA [Global Delivery Center]
                    <br />
                    <span
                      style={{
                        marginLeft: "29px",
                        fontSize: " 0.9rem",
                        color: "white",
                      }}
                    >
                      1008, 10th Floor, DSL Abacus IT Park,
                    </span>{" "}
                  </span>
                  <br />{" "}
                  <span
                    style={{
                      marginLeft: "29px",
                      fontSize: " 0.9rem",
                      color: "white",
                    }}
                  >
                    Uppal, Hyderabad, Telangana 500039
                  </span>
                </Typography>
              </Typography>
              <Grid marginBottom="8px"></Grid>
              <Grid marginLeft={"40px"}>
                <Box display="flex" alignItems="center">
                  <a
                    href="https://www.facebook.com/innovontech"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={facebookicon}
                      alt="facebookicon"
                      className="me-2"
                      style={{
                        width: "25px",
                        height: "auto",
                        margin: "20px 10px 0px 0px ",
                      }}
                    />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/innovontech"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={linkedinnew}
                      alt="linkedinnew"
                      className="footericon"
                      style={{
                        width: "25px",
                        height: "auto",
                        margin: "20px 10px 0px 0px ",
                      }}
                    />
                  </a>
                  <a
                    href="https://twitter.com/innovontech"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={twittericon}
                      alt="twittericon"
                      className="footericon"
                      style={{
                        width: "25px",
                        height: "auto",
                        margin: "20px 10px 0px 0px ",
                      }}
                    />
                  </a>
                  <a
                    href="https://www.instagram.com/innovontech/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={instagram}
                      alt="Instagram"
                      className="footericon"
                      style={{
                        width: "25px",
                        height: "auto",
                        margin: "20px 10px 0px 0px",
                      }}
                    />
                  </a>
                  <a
                    href="https://www.youtube.com/@InnovonTek"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={YouTubeIcon}
                      alt="YouTube"
                      className="footericon"
                      style={{
                        width: "25px",
                        height: "auto",
                        margin: "20px 10px 0px 0px",
                      }}
                    />
                  </a>
                </Box>
              </Grid>
              <Box
                style={{
                  marginTop: "3rem",
                }}
              >
                <Grid container style={{ marginLeft: "29px" }}>
                  <Grid item>
                    <StyledButtonComponent
                      buttonWidth={200}
                      href="/requestdemo"
                    >
                      Let's Connect &rarr;
                    </StyledButtonComponent>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              padding: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.8rem",
                  md: "0.8rem",
                  lg: "0.8rem",
                },
                color: "#FFFFFF",
                marginTop: "1rem",
              }}
            >
              <Link
                to="https://innovontek.com"
                style={{
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                © Copyright 2024 Innovon Technologies, All Rights Reserved.
              </Link>
            </Typography>
            <span style={{ marginTop: "0.6rem", marginLeft: "0.5rem" }}>|</span>
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                marginTop: "0.95rem",
                marginLeft: "0.5rem",
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.8rem",
                  md: "0.8rem",
                  lg: "0.8rem",
                },
                color: "#FFFFFF",
              }}
            >
              <Link
                to="https://innovontek.com"
                style={{
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                www.innovontek.com
              </Link>
            </Typography>
          </Box>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "flex-end",
              padding: "10px",
              bottom: "0",
            }}
          >
            <Tooltip title="Scroll to top" arrow>
              <IconButton
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ArrowUpwardIcon sx={{ color: "#0B70FF" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Container>
      </Box>
    </>
  );
}
