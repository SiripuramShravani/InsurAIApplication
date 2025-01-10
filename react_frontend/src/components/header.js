import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { styled } from '@mui/system';
import ITlogo from "../assets/ITlogo.png";
import "./header.css";
import StyledButtonComponent from "../components/StyledButton";
import { Box, Typography, SvgIcon, useMediaQuery } from '@mui/material';
import axios from 'axios';

const StyledNavbar = styled(Navbar)(({ theme }) => ``);
const PhoneIcon = ({ isHovered }) => (
  <SvgIcon viewBox="0 0 24 24">
    <path
      d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
      fill="#2196f3"
      stroke={isHovered ? "#2196f3" : "none"}
      strokeWidth={isHovered ? "1" : "0"}
    />
  </SvgIcon>
);

const Header = () => {
  const isScreen = useMediaQuery('(max-width:996px)');
  const isDesktop = useMediaQuery('(max-width:1406px)');
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
  const policyIntakeToken = localStorage.getItem("policyIntakeToken")
  const userAccess = Authorization ? JSON.parse(localStorage.getItem('userAccess')) ?? [] : [];

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const checked = (value) => {
    localStorage.setItem("rout", value);
    if (Authorization) {
      window.scrollTo(0, 0);
    }
  };

  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const userCompany = JSON.parse(localStorage.getItem('signinUserDetails'))

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_URL}Administration/logout_view/`,
        {},
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error("error while logout", error)
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem("isInsured", "yes");
    }
  }

  return (
    <Box sx={{
      backgroundColor: 'white',
      height: isScreen ? "auto" : '70px',
      position: 'fixed',
      top: 0,
      width: '100%',
      margin: "auto",
      zIndex: 1200,
    }} >
      <StyledNavbar fixed="top" expand="lg" sx={{ width: '100%', maxWidth: 1500, margin: 'auto', height: isScreen ? "auto" : '70px', backgroundColor: "white" }} >
        <Navbar.Brand className="logo-my">
          <Link to="/">
            <img src={ITlogo} alt="ITlogo" className="ITlogo" />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            navbarScroll
            className={isDesktop ? "" : "ms-auto"}
            style={{ alignItems: "center", padding: '0rem 1rem', marginRight: isDesktop ? '0rem' : '4rem' }}
          >
            <NavDropdown
              title={
                <span
                  onClick={() => window.location.href = 'https://innovontek.com/'}
                  style={{ cursor: 'pointer', fontSize: "14px" }}
                  className="Nasaliza color-navlink"
                >
                  INNOVONTEK.COM
                </span>
              }
              className="Nasaliza color-navlink"
              id="basic-nav-dropdown"
              style={{ marginRight: '0.5rem' }}
              show={showDropdown}
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
              onToggle={() => setShowDropdown(!showDropdown)}
            >
              <NavDropdown
                title={
                  <span
                    // onClick={() => window.location.href = 'https://innovontek.com/guidewire-practice/'}
                    style={{ cursor: 'pointer', fontSize: "14px" }}
                    className="Nasaliza color-navlink"
                  >
                    Guidewire Practice
                  </span>
                }
                id="gw-dropdown"
                drop="end"
                className="Nasaliza color-navlink"
                style={{ color: '#000' }}
                onMouseEnter={(e) => e.target.click()}
                onMouseLeave={(e) => e.target.blur()}
              >
                <NavDropdown.Item as={Link} className="Nasaliza color-navlink" to="https://innovontek.com/guidewire-practice-services/" style={{ color: '#00', fontSize: "14px" }}>
                  GW Services
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} className="Nasaliza color-navlink" to="https://innovontek.com/offerings/" style={{ color: '#00', fontSize: "14px" }}>
                  GW Offerings
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} className="Nasaliza color-navlink" to="https://innovontek.com/about-guidewire-practice/" style={{ color: '#00', fontSize: "14px" }}>
                  About GW Practice
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title={
                  <span
                    // onClick={() => window.location.href = 'https://innovontek.com/mainframe-practice/'}
                    style={{ cursor: 'pointer', fontSize: "14px" }}
                    className="Nasaliza color-navlink"
                  >
                    Mainframe Practice
                  </span>
                }
                id="mf-dropdown"
                drop="end"
                className="Nasaliza color-navlink"
                style={{ color: '#000' }}
                onMouseEnter={(e) => e.target.click()}
                onMouseLeave={(e) => e.target.blur()}
              >
                <NavDropdown.Item as={Link} to="https://innovontek.com/services-mainframe-practice/" className="Nasaliza color-navlink" style={{ color: '#00', fontSize: "14px" }}>
                  MF Services
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="https://innovontek.com/offerings-mainframe-practice/" className="Nasaliza color-navlink" style={{ color: '#00', fontSize: "14px" }}>
                  MF Offerings
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="https://innovontek.com/about-mainframe-practice/" className="Nasaliza color-navlink" style={{ color: '#00', fontSize: "14px" }}>
                  About MF Practice
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title={
                  <span
                    // onClick={() => window.location.href = 'https://innovontek.com/services/'}
                    style={{ cursor: 'pointer', fontSize: "14px" }}
                    className="Nasaliza color-navlink"
                  >
                    Services
                  </span>
                }
                id="services-dropdown"
                drop="end"
                className="Nasaliza color-navlink"
                style={{ color: '#000' }}
                onMouseEnter={(e) => e.target.click()}
                onMouseLeave={(e) => e.target.blur()}
              >
                <NavDropdown.Item as={Link} to="https://innovontek.com/services/systems-integration/" className="Nasaliza color-navlink" style={{ color: '#00', fontSize: "14px" }}>
                  Systems Integration
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="https://innovontek.com/services/application-services/" className="Nasaliza color-navlink" style={{ color: '#00', fontSize: "14px" }}>
                  Application Services
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="https://innovontek.com/services/managed-it-services/" className="Nasaliza color-navlink" style={{ color: '#00', fontSize: "14px" }}>
                  Managed IT Services
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="https://innovontek.com/services/quality-assurance/" className="Nasaliza color-navlink" style={{ color: '#00', fontSize: "14px" }}>
                  Quality Assurance
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title={
                  <span
                    // onClick={() => window.location.href = 'https://innovontek.com/solutions/'}
                    style={{ cursor: 'pointer', fontSize: "14px" }}
                    className="Nasaliza color-navlink"
                  >
                    Solutions
                  </span>
                }
                id="solutions-dropdown"
                drop="end"
                className="Nasaliza color-navlink"
                style={{ color: '#000' }}
                onMouseEnter={(e) => e.target.click()}
                onMouseLeave={(e) => e.target.blur()}
              >
                <NavDropdown.Item as={Link} to="https://innovontek.com/solutions/p-c-insurance-solutions/" className="Nasaliza color-navlink" style={{ color: '#00', fontSize: "14px" }}>
                  P&C Insurance Solutions
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="https://innovontek.com/solutions/digital-transformation/" className="Nasaliza color-navlink" style={{ color: '#00', fontSize: "14px" }}>
                  Digital Transformation
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="https://innovontek.com/solutions/it-cloud-modernization/" className="Nasaliza color-navlink" style={{ color: '#00', fontSize: "14px" }}>
                  IT & Cloud Modernization
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="https://innovontek.com/solutions/intelligent-automation/" className="Nasaliza color-navlink" style={{ color: '#00', fontSize: "14px" }}>
                  Intelligent Automation
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title={
                  <span
                    // onClick={() => window.location.href = 'https://innovontek.com/about/'}
                    style={{ cursor: 'pointer', fontSize: "14px" }}
                    className="Nasaliza color-navlink"
                  >
                    About
                  </span>
                }
                id="about-dropdown"
                drop="end"
                className="Nasaliza color-navlink"
                style={{ color: '#000' }}
                onMouseEnter={(e) => e.target.click()}
                onMouseLeave={(e) => e.target.blur()}
              >
                <NavDropdown.Item as={Link} className="Nasaliza color-navlink" to="https://innovontek.com/careers/" style={{ color: '#00', fontSize: "14px" }}>
                  Careers
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} className="Nasaliza color-navlink" to="https://innovontek.com/blog/" style={{ color: '#00', fontSize: "14px" }}>
                  Blog
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} className="Nasaliza color-navlink" to="https://innovontek.com/contact/" style={{ color: '#00', fontSize: "14px" }}>
                  Contacts
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} className="Nasaliza color-navlink" to="https://innovontek.com/faqs/" style={{ color: '#00', fontSize: "14px" }}>
                  FAQS
                </NavDropdown.Item>
              </NavDropdown>
            </NavDropdown>
            <NavDropdown
              title="PORTAL"
              className="Nasaliza color-navlink"
              id="basic-nav-dropdown"
              active={activeLink === "/smart-claim" || activeLink === "/customercompany"}
              style={{ marginRight: '0.5rem', fontSize: "14px" }}
            >
              {(userAccess?.includes('claim_intake') || !Authorization) && (
                <NavDropdown.Item
                  className="Nasaliza color-navlink"
                  as={Link}
                  to="/smart-claim"
                  onClick={() => checked("/smart-claim")}
                  active={activeLink === "/smart-claim"}
                  style={{ fontSize: "14px" }}
                >
                  SmartClaim
                </NavDropdown.Item>
              )}
              {(userAccess?.includes('policy_intake') || !Authorization) && (
                <NavDropdown.Item
                  className="Nasaliza color-navlink"
                  as={Link}
                  to={"/SmartQuote"}
                  onClick={() => checked("/SmartQuote")}
                  active={activeLink === "/SmartQuote"}
                  style={{ marginRight: '0.5rem', fontSize: "14px" }}
                >
                  SmartQuote
                </NavDropdown.Item>
              )}
            </NavDropdown>
            <NavDropdown
              title="DocAI"
              className="Nasaliza color-navlink"
              id="basic-nav-dropdown"
              active={activeLink === "/docai/claim" || activeLink === "/login"}
              style={{ marginRight: '0.5rem', fontSize: "14px" }}
            >
              {(userAccess?.includes('claim_intake') || !Authorization) && (
                <NavDropdown.Item
                  className="Nasaliza color-navlink"
                  as={Link}
                  to="/docai/claim"
                  onClick={() => checked("/docai/claim")}
                  active={activeLink === "/docai/claim"}
                  style={{ marginRight: '0.5rem', fontSize: "14px" }}
                >
                  DocAI Claim
                </NavDropdown.Item>
              )}
              {(userAccess?.includes('policy_intake') || !Authorization) && (
                <NavDropdown.Item
                  as={Link}
                  to="/DocAIQuote"
                  onClick={() => checked("/DocAIQuote")}
                  active={activeLink === "/DocAIQuote"}
                  className="Nasaliza color-navlink"
                  style={{ fontSize: "14px" }}
                >
                  DocAI Quote
                </NavDropdown.Item>
              )}
              <NavDropdown.Item
                as={Link}
                to="/docaiClassify"
                onClick={() => checked("/docaiClassify")}
                active={activeLink === "/docaiClassify"}
                className="Nasaliza color-navlink"
                style={{ fontSize: "14px" }}
              >
                DocAI Classify
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/summary"
                onClick={() => checked("/summary")}
                active={activeLink === "/summary"}
                className="Nasaliza color-navlink"
                style={{ fontSize: "14px" }}
              >
                DocAI Summary
              </NavDropdown.Item>
              {(userAccess?.includes('loss_runs') || !Authorization) && (
                <NavDropdown.Item
                  as={Link}
                  to="/doc-ai-loss-run-report"
                  onClick={() => checked("/doc-ai-loss-run-report")}
                  active={activeLink === "/doc-ai-loss-run-report"}
                  className="Nasaliza color-navlink"
                  style={{ fontSize: "14px" }}
                >
                  DocAI Loss Run
                </NavDropdown.Item>
              )}
              <NavDropdown.Item
                as={Link}
                to="/doc-ai-med-bill"
                onClick={() => checked("/doc-ai-med-bill")}
                active={activeLink === "/doc-ai-med-bill"}
                className="Nasaliza color-navlink"
                style={{ fontSize: "14px" }}
              >
                DocAI Med Bill
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/docai/idcardextraction"
                onClick={() => checked("/docai/idcardextraction")}
                active={activeLink === "/docai/idcardextraction"}
                className="Nasaliza color-navlink"
                style={{ fontSize: "14px" }}
              >
                DocAI ID
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                to="/docaiSov"
                onClick={() => checked("/docaiSov")}
                active={activeLink === "/docaiSov"}
                className="Nasaliza color-navlink"
                style={{ fontSize: "14px" }}
              >
                DocAI SOV
              </NavDropdown.Item>
              {(userAccess?.includes('claim_intake') || !Authorization) && (
                <NavDropdown.Item
                  as={Link}
                  to="/Mail2Claim"
                  onClick={() => checked("/Mail2Claim")}
                  active={activeLink === "/Mail2Claim"}
                  className="Nasaliza color-navlink"
                  style={{ fontSize: "14px" }}
                >
                  Mail2Claim
                </NavDropdown.Item>
              )}
              {(userAccess?.includes('policy_intake') || !Authorization) && (
                <NavDropdown.Item
                  as={Link}
                  to="/mail-2-quote"
                  onClick={() => checked("/mail-2-quote")}
                  active={activeLink === "/mail-2-quote"}
                  className="Nasaliza color-navlink"
                  style={{ fontSize: "14px" }}
                >
                  Mail2Quote
                </NavDropdown.Item>
              )}
            </NavDropdown>
            <NavDropdown
              title="Apps"
              className="Nasaliza color-navlink"
              id="basic-nav-dropdown"
              active={activeLink === "/App/instaQuote" || activeLink === "/App/instaClaim"}
              style={{ marginRight: '0.5rem', fontSize: "14px" }}
            >
              <NavDropdown.Item
                className="Nasaliza color-navlink"
                as={Link}
                to={"/App/instaClaim"}
                onClick={() => checked("/App/instaClaim")}
                active={activeLink === "/App/instaClaim"}
                style={{ marginRight: '0.5rem', fontSize: "14px" }}
              >
                InstaClaim
              </NavDropdown.Item>
              <NavDropdown.Item
                className="Nasaliza color-navlink"
                as={Link}
                to="/App/instaQuote"
                onClick={() => checked("/App/instaQuote")}
                active={activeLink === "/App/instaQuote"}
                style={{ fontSize: "14px" }}
              >
                InstaQuote
              </NavDropdown.Item>
            </NavDropdown>
            {(userAccess?.includes('claim_intake') || !Authorization) && (
              <Nav.Link
                as={Link}
                to="/insur-ai"
                onClick={() => checked("/insur-ai")}
                active={activeLink === "/insur-ai"}
                id="basic-nav-dropdown"
                className="Nasaliza color-navlink"
                style={{ fontSize: "14px" }}

              >
                IVAN
              </Nav.Link>
            )}
            {((!userAccess && userCompany?.company_name) || (!Authorization)) && (
              <Nav.Link
                as={Link}
                to="/insur-admin-platform"
                onClick={() => checked("/insur-admin-platform")}
                active={activeLink === "/insur-admin-platform"}
                id="basic-nav-dropdown"
                className="Nasaliza color-navlink"
                style={{ marginLeft: '0.5rem', marginRight: "0.5rem", fontSize: "14px" }}

              >
                InsurAdmin
              </Nav.Link>
            )}
            {(userAccess?.includes('user_administration') || userAccess?.includes('company_Dashboard') || userAccess?.includes('companies_administration')) && (
              <NavDropdown
                title="Admin"
                className="Nasaliza color-navlink"
                id="basic-nav-dropdown"

                style={{ marginRight: '0.5rem' }}
              >
                {(userAccess?.includes('user_administration')) && (
                  <NavDropdown.Item
                    as={Link}
                    to="/UserDashboard"
                    onClick={() => checked("/UserDashboard")}
                    active={activeLink === "/UserDashboard"}
                    className="Nasaliza color-navlink"
                    style={{ fontSize: "14px" }}
                  >
                    User Admin
                  </NavDropdown.Item>

                )}
                <NavDropdown.Item
                  style={{ fontSize: "14px" }}
                  className="Nasaliza color-navlink"
                  as={Link}
                  to={
                    Authorization
                      ? userAccess?.includes('companies_administration')
                        ? "/insur-admin-platform"
                        : userAccess?.includes('company_Dashboard')
                          ? "/dashboard/*"
                          : "/requestdemo"
                      : "/requestdemo"
                  }
                  onClick={() => {
                    const path = Authorization
                      ? userAccess?.includes('companies_administration')
                        ? "/insur-admin-platform"
                        : userAccess?.includes('company_Dashboard')
                          ? "/dashboard/*"
                          : "/requestdemo"
                      : "/requestdemo";
                    checked(path);
                  }}
                  active={
                    activeLink === (
                      Authorization
                        ? userAccess?.includes('companies_administration')
                          ? "/insur-admin-platform"
                          : userAccess?.includes('company_Dashboard')
                            ? "/dashboard/*"
                            : "/requestdemo"
                        : "/requestdemo"
                    )
                  }
                >
                  {userAccess?.includes('company_Dashboard') ? "Insurance Companies Admin" : "InsurAdmin"}
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {(Authorization || policyIntakeToken) && (
              <Nav.Link
                id="basic-nav-dropdown"
                active={activeLink === "/"}
                className="Nasaliza color-navlink"
                style={{ marginRight: '0.5rem', fontSize: "14px" }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                    navigate('/');
                  }}
                  style={{
                    border: 'none',
                    background: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginRight: '0.5rem',
                    color: 'blue'
                  }}
                >
                  SIGN OUT
                </button>
              </Nav.Link>
            )}
            <Nav.Link
              as={Link}
              to="/requestdemo"
              onClick={() => checked("/requestdemo")}
              active={activeLink === "/requestdemo"}
              style={{ marginLeft: '0rem', marginRight: '0.5rem' }}
            >
              <StyledButtonComponent style={{ margin: "0rem", width: '150px' }} >
                Let’s Connect
              </StyledButtonComponent>
            </Nav.Link>
            <Box
              component="a"
              href="tel:+15134561199"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': { '& .phoneIcon': { color: 'primary.main' } }
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <PhoneIcon className="phoneIcon" sx={{ mr: 0.5, transition: 'color 0.3s' }} />
              <Box>
                <Typography variant="caption" display="block" sx={{ fontSize: "14px" }}>
                  Call Our Experts
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="primary" sx={{ fontSize: "14px" }}>
                  +1 513 456 1199
                </Typography>
              </Box>
            </Box>
          </Nav>
        </Navbar.Collapse>
      </StyledNavbar>
    </Box>
  );
}

export default Header;

