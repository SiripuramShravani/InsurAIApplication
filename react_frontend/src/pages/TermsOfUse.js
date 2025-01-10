import React from 'react';
import { Typography, Box, Grid, useMediaQuery, List, ListItem, ListItemText,useTheme,} from '@mui/material';
import Header from '../components/header';
import Footer from '../components/footer';
import terms_bg from '../assets/terms_bg.avif'

const TermsOfUse = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <>
            <Header />
            <Box>

            <Grid
      
      sx={{
        // backgroundColor: "#000166",
        backgroundImage: `url(${terms_bg})`, // Using the imported image
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        p: 4,
        height:isMobile?"auto": "50%",
        justifyContent: "left",
        textAlign: 'left',
        
      }}

    >
      <Typography
        variant="body1"
        color="white"
        sx={{ textAlign: "center", paddingTop: '3rem', fontSize:isMobile?"2rem": '3rem',fontFamily:'Georgia, Times, serif' }}
      >
        Welcome to Innovon Technologies !
      </Typography>
      <Typography
        variant="h2"
        component="h1"
        sx={{ paddingTop: '2rem' ,paddingLeft: isMobile ? "0rem" : "7rem",fontWeight: "bold",fontSize:isMobile?"1.2rem": '3rem'}}
      >
        Terms of Use
      </Typography>
      <Typography
        variant="body1"
        color="white"
        sx={{paddingLeft: isMobile ? "0rem" : "8rem", marginTop: "1rem" }}
      >
        Effective Date: 08-12-2024
      </Typography>
    </Grid>
                <Grid sx={{
                    textAlign: "left",
                    width: "80%",
                    maxWidth: "1200px",
                    margin: 'auto',
                    fontSize: '1rem', fontWeight: 400, color: 'black'
                }}>

                    <Typography variant="body1" marginTop={"1.5rem"}>
                        By accessing or using our website, www.innovontek.com / insurai.innovontek.com (Site), you agree to comply with and be bound by the following terms and conditions. Please read these Terms of Use carefully before using our services. If you do not agree with these terms, you should not use our Site.
                    </Typography>
                </Grid>


                <Box sx={{
                    textAlign: "left",
                    width: "80%",
                    maxWidth: "1200px",
                    margin: 'auto',
                    fontSize: '1rem', fontWeight: 400, color: 'black'
                }}>
                  <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }} className='Nasaliza'>
                        1. Acceptance of Terms
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        By accessing and using the Site, you acknowledge that you have read, understood, and agree to be legally bound by these Terms of Use and our Privacy Policy. If you disagree with these terms, please discontinue using the Site immediately.
                    </Typography>

                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        2. Changes to Terms
                    </Typography>

                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        We may modify these Terms of Use from time to time at our sole discretion. When we make changes, we will update the "Effective Date" at the top of this page. It is your responsibility to review these Terms regularly. Your continued use of the Site after any changes indicates your acceptance of the updated Terms.
                    </Typography>
                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        3. Eligibility
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        You must be at least 18 years old to use our Site. By using the Site, you represent and warrant that you meet this age requirement and that all information you provide is accurate and truthful.
                    </Typography>

                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        4. Use of the Site
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        You agree to use the Site only for lawful purposes and in accordance with these Terms. You must not use the Site in any way that could damage, disable, overburden, or impair the Site, interfere with any other party’s use and enjoyment of the Site, or violate any applicable laws or regulations.
                    </Typography>

                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        5. Account Registration
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        If you create an account on our Site, you are responsible for maintaining the confidentiality of your account information, including your username and password, and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security. Innovon Tech will not be liable for any loss or damage arising from your failure to comply with this responsibility.
                    </Typography>

                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        6. Intellectual Property Rights
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        All content, trademarks, and other intellectual property on the Site, including but not limited to text, graphics, logos, icons, images, audio clips, video clips, and software, are owned by Innovon Tech or our licensors and are protected by international copyright and trademark laws. You are granted a limited, non-exclusive, non-transferable license to access and use the Site for personal, non-commercial purposes. Any unauthorized use of the Site's content is strictly prohibited.
                    </Typography>


                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        7. User-Generated Content
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        By submitting content to our Site, including but not limited to comments, reviews, or any other materials, you grant Innovon Tech a worldwide, perpetual, irrevocable, royalty-free, non-exclusive license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content in any media. You represent and warrant that you own or have the necessary rights to the content you submit and that your content does not infringe on the rights of any third party.
                    </Typography>


                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        8. Prohibited Activities
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        You agree not to
                    </Typography>
                    <List sx={{ listStyleType: "disc", paddingLeft: "20px" }}>
                        <ListItem sx={{ display: "list-item" }}>
                            <ListItemText primary="Engage in any activity that would constitute a violation of any applicable law or regulation." />

                        </ListItem>
                        <ListItem sx={{ display: "list-item" }}>
                            <ListItemText primary="Attempt to gain unauthorized access to any part of the Site, including the servers and networks used to provide the Site." />

                        </ListItem>
                        <ListItem sx={{ display: "list-item" }}>
                            <ListItemText primary="Upload or transmit any harmful or malicious code, including viruses or other types of malwares." />

                        </ListItem>
                        <ListItem sx={{ display: "list-item" }}>
                            <ListItemText primary="Use the Site to harass, threaten, or harm others." />

                        </ListItem>
                        <ListItem sx={{ display: "list-item" }}>
                            <ListItemText primary="Use the Site to engage in any fraudulent, deceptive, or misleading practices." />

                        </ListItem>
                        <ListItem sx={{ display: "list-item" }}>
                            <ListItemText primary=" Interfere with or disrupt the operation of the Site or the servers or networks that host the Site, including by transmitting or distributing any virus, worm, or other harmful code." />

                        </ListItem>
                    </List>
                   
                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        9. Links to Third-Party Websites
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        Our Site may contain links to third-party websites that are not owned or controlled by Innovon Tech. These links are provided for your convenience only, and Innovon Tech is not responsible for the content, privacy practices, or policies of these third-party sites. We recommend that you review the terms and privacy policies of any third-party websites you visit.
                    </Typography>


                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        10. Limitation of Liability
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        To the fullest extent permitted by law, Innovon Tech and its affiliates shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the Site, including, but not limited to, damages for loss of profits, data, or other intangible losses, even if Innovon Tech has been advised of the possibility of such damages. This limitation of liability applies regardless of the form of action, whether in contract, tort (including negligence), or otherwise.
                    </Typography>


                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        11. Disclaimer of Warranties
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        The Site is provided "as is" and "as available" without any warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not guarantee that the Site will be available, error-free, or secure at all times, or that any defects or errors in the Site will be corrected. Your use of the Site is at your sole risk.
                    </Typography>


                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        12. Indemnification
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        You agree to indemnify, defend, and hold harmless Innovon Tech, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, or expenses, including reasonable attorneys' fees and costs, arising out of or in any way connected with your You agree to indemnify, defend, and hold harmless Innovon Tech, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, or expenses, including reasonable attorneys' fees and costs, arising out of or in any way connected with your use of the Site, your violation of these Terms, or your infringement of any intellectual property or other rights of any third party.
                    </Typography>


                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        13. Termination
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        We reserve the right to terminate or suspend your access to the Site at any time, without notice, for any reason, including but not limited to your violation of these Terms. Upon termination, all provisions of these Terms which by their nature should survive termination, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability, shall continue to apply.
                    </Typography>


                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        14. Governing Law
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        These Terms of Use and your use of the Site shall be governed by and construed in accordance with the laws of India, without regard to its conflict of laws principles. You agree to submit to the exclusive jurisdiction of the courts located in Hyderabad, India for any legal matter arising out of or related to these Terms.
                    </Typography>


                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        15. Privacy Policy
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        Your use of the Site is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
                    </Typography>


                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        16. Dispute Resolution
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        In the event of any dispute arising out of or relating to these Terms or your use of the Site, you agree to first attempt to resolve the dispute informally by contacting us at info@innovontek.com or by calling us at +91 8008.673.672 (India). If the dispute is not resolved within 30 days, either party may pursue formal resolution through binding arbitration in Hyderabad, India. The arbitrator's decision will be final and binding, and judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction in Hyderabad, India.
                    </Typography>


                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        17. Severability
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        If any provision of these Terms is found to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect, and the invalid or unenforceable provision shall be deemed modified so that it is valid and enforceable to the maximum extent permitted by law.
                    </Typography>


                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        18. No Waiver
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        The failure of Innovon Tech to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. Any waiver of any provision of these Terms will be effective only if in writing and signed by an authorized representative of Innovon Tech.
                    </Typography>


                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        19. Entire Agreement
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        These Terms of Use, together with our Privacy Policy, constitute the entire agreement between you and Innovon Tech regarding your use of the Site and supersede any prior agreements between you and Innovon Tech.
                    </Typography>

                    <Typography marginTop={"1rem"} variant="h4"
                        component="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.3rem",
                            color: "#003366", // Custom color for the heading
                        }}  className='Nasaliza'>
                        20. Contact Information
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontSize: "1rem", marginTop: "0.3rem" }}>
                        If you have any questions or concerns about these Terms of Use, please contact us at info@innovontek.com. We welcome your feedback and are here to assist with any issues you may encounter while using our Site.
                    </Typography>
                    <Grid marginBottom={5}></Grid>
                </Box>
            </Box>
            <Footer />
        </>
    );
};

export default TermsOfUse;
