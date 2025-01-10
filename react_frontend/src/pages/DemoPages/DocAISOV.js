import React from "react";
import { Box, Grid, Typography, Container, useMediaQuery, useTheme } from "@mui/material";
import Header from "../../components/header";
import Footer from "../../components/footer";
import SOVdemo from './../../assets/SOVdemo.png';
import SOVFun from "../Functionality/SOVFun";

export default function DocAISOVDemo() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");

    return (
        <>
            {Authorization && (
                <>
                    {/* SEO Meta Tags */}
                    <head>
                        <title>DocAI SOV Demo | Property Value Management Tool</title>
                        <meta
                            name="description"
                            content="Discover the power of DocAI's SOV Management tool. Effortlessly manage and analyze property values with Excel uploads, automated data validation, and real-time insights."
                        />
                        <meta
                            name="keywords"
                            content="DocAI, SOV Management, Property Value Management, Excel Upload, Data Validation, Real-Time Insights, Automated Property Analysis, Insurance Property Management"
                        />
                        <meta name="robots" content="index,follow" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <link rel="canonical" href="https://yourwebsite.com/docaisovdemo" />
                    </head>

                    <Header />

                    <main>
                        <Box sx={{ background: "linear-gradient(to right, #4b6cb7, #001660)" }}>
                            <Container sx={{ width: "100%", maxWidth: 1200, margin: "auto", py: 5 }}>
                                <Typography
                                    component="h1"
                                    sx={{
                                        fontWeight: "bold",
                                        fontSize: isMobile ? 24 : 26,
                                        textAlign: "center",
                                        color: "white",
                                    }}
                                    className="Nasaliza"
                                >
                                    Doc<span style={{ color: "#0B70FF", }}>AI</span>
                                    <sup style={{ position: "relative", top: "-1rem", right: "-0.1rem", fontSize: "0.5rem", marginRight: '0.5rem' }}>TM</sup>
                                    SOV <br /><span style={{ fontSize: '1rem' }}>(Statement of Values)</span>
                                </Typography>

                                <Typography
                                    component="h2"
                                    className="billy-title"
                                    sx={{ fontSize: isMobile ? "2rem" : "3rem", color: "orange", textAlign: "center", mb: 4 }}
                                >
                                    Demo
                                </Typography>

                                {/* Introduction */}
                                <Box sx={{ textAlign: 'center', mb: 5 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                component="p"
                                                sx={{ fontSize: isMobile ? '1rem' : '1.5rem', color: 'white', fontWeight: 800, textAlign: "left" }} className="Nasaliza"
                                            >
                                                Elevate Your Property Value Management Experience
                                            </Typography>
                                            <Typography
                                                component="p"
                                                sx={{ fontSize: isMobile ? '1rem' : '1rem', color: 'whitesmoke', textAlign: "justify", mt: 3 }}
                                            >
                                                Unlock the full potential of your property value management with DocAI's cutting-edge SOV Management tool. Effortlessly manage and analyze property values with unparalleled precision. Enjoy seamless Excel uploads, automated data validation, and real-time insights that empower you to make strategic, data-driven decisions for the future.
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <img
                                                    src={SOVdemo}
                                                    alt="DocAI SOV Management Demo"
                                                    style={{ maxWidth: '100%', height: 'auto' }}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Container>
                        </Box>
                    </main>

                    <SOVFun />

                    <Footer />
                </>
            )}
        </>
    );
}