import React,{useState,useEffect} from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { Box, Typography, Grid, Container, useMediaQuery, useTheme } from '@mui/material';
import { motion } from "framer-motion";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useInView } from 'react-intersection-observer';
import BoltIcon from '@mui/icons-material/Bolt';
import EmailToFnolFun from "../Functionality/EmailToFnolFUN";
import PopupMessage from './AccessDeniedPopMssg';

const titleVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1.2, delay: 0.2 } },
};

const contentVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.4 } },
};
const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

//section-2
const features = [
    {
        icon: <BoltIcon style={{ color: "#ff416c", fontSize: 40 }} />,
        title: "Streamline Claims Processing",
        description:
            "Automates claim extraction from emails and attachments, reducing processing time from days to minutes.",
    },
    {
        icon: <CheckCircleIcon style={{ color: "#27c24c", fontSize: 40 }} />,
        title: "Boost Accuracy with InsurAI",
        description: "Leverages advanced LLMs to precisely extract and categorize claim information, minimizing human error.",
    },
    {
        icon: <ThumbUpIcon style={{ color: "#ffca28", fontSize: 40 }} />,
        title: "Elevate Customer Satisfaction",
        description:
            "Provides instant claim status updates via automated emails, enhancing transparency and trust.",
    },
];
export default function EmailTOFnolDemo() {
    const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
    const theme = useTheme();
    const isScreen = useMediaQuery('(max-width:900px)');
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 }); //section-2
    
    const [openPopup, setOpenPopup] = useState(false);
  
    useEffect(() => {
      const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
      const userAccess = Authorization ? JSON.parse(localStorage.getItem('userAccess')) : [];
      
      if (!userAccess.includes('claim_intake') || !Authorization) {
        setOpenPopup(true);
      }
    }, []);
    return (
        <>
            {Authorization &&

                <>
                    <Header />
                    <Box sx={{ backgroundColor: '#000166', color: 'white', height: isScreen ? "auto" : '600px', width: '100%', margin: 'auto', paddingTop: '1rem' }}>
                        {/* Top Title */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={titleVariants}
                        >
                            <Box sx={{ textAlign: 'center', padding: theme.spacing(2) }}>
                                <Typography variant="h4" component="h4" sx={{ fontWeight: 'bold', marginTop:"1rem", color:"white"}} className="Nasaliza">
                                Mail2<span style={{color:'#0B70FF'}}>Claim</span>
                                </Typography>
                                     <Typography sx={{color:"orange",fontSize:"3rem"}} className="billy-title">Demo</Typography>
                            </Box>
                        </motion.div>

                        {/* Main Content */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={contentVariants}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center", margin: " 1rem auto" }}>
                                <Container maxWidth="lg">
                                    <Grid container spacing={4} alignItems="center" justifyContent='center'>
                                        {/* //section-2 */}
                                        <motion.div
                                            ref={ref}
                                            initial="hidden"
                                            animate={inView ? "visible" : "hidden"}
                                            variants={cardVariants}
                                        >
                                            <Box ref={ref} sx={{ padding: "2rem 1rem", textAlign: "center", width: '100%', maxWidth: 1100, margin: 'auto', height: isScreen ? "auto" : '250px' }}>
                                                <Typography variant="h5" sx={{ mb: 4 }} className="Nasaliza">
                                                    Revolutionize Your Claims Handling with Our Advanced Mail2Claim Solution
                                                </Typography>
                                                <Grid container spacing={3} justifyContent="center">
                                                    {features.map((feature, index) => (

                                                        <Grid
                                                            key={index}
                                                            item
                                                            xs={12}
                                                            sm={6}
                                                            md={4}
                                                            component={motion.div}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={inView ? { opacity: 1, y: 0 } : {}}
                                                            transition={{ duration: 0.5, delay: index * 0.3 }}
                                                        >
                                                            <motion.div
                                                                initial="hidden"
                                                                animate={inView ? "visible" : "hidden"}
                                                                variants={cardVariants}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        padding: "2rem 2rem",
                                                                        borderRadius: "12px",
                                                                        backgroundColor: "#fff",
                                                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                                                        textAlign: 'left',
                                                                        height: 'auto'
                                                                    }}
                                                                >
                                                                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                                                                    <Typography variant="h6" sx={{ mb: 1, color:"black" }} className="Nasaliza">
                                                                        {feature.title}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        {feature.description}
                                                                    </Typography>
                                                                </Box>
                                                            </motion.div>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>
                                        </motion.div>
                                     </Grid>
                                </Container>
                            </Box>
                        </motion.div>
                    </Box>



                    <Box sx={{ width: "100%", maxWidth: 1200, margin: '2rem auto', height: isScreen && '800px' }}>

                        <EmailToFnolFun />
                    </Box>

                    <PopupMessage open={openPopup} onClose={() => setOpenPopup(false)} />
                    <Footer />
                </>
            }
        </>
    );
}
