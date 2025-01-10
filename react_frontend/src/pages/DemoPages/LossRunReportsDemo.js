import React,{useState,useEffect} from "react";
import { Box, Grid, Typography,Container, useMediaQuery} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Header from "../../components/header";
import Footer from "../../components/footer";
import LossRunReportsFun from "../Functionality/LossRunReportFun";
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimerIcon from '@mui/icons-material/Timer';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion'
import pdf from "../../assets/pdf.png"
import office365 from "../../assets/office365.png"
import image from "../../assets/image-.png"
import invoice from "../../assets/invoice.png"
import PopupMessage from "./AccessDeniedPopMssg";
const useStyles = makeStyles((theme) => ({
    root: {


        minHeight: "380px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin:'2rem'
    },
    content: {
        maxWidth: "1200px",
        margin: "auto",
        alignItems: "center",
        justifyContent: "center",
    },
    leftSide: {
        textAlign: "left",
    },
    rightSide: {
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    iconGroup: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: theme.spacing(2),
    },
    iconBox: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f4ff",
        padding: theme.spacing(2),
        borderRadius: "10px",
        width: "150px",
        height: "150px",
        textAlign: "center",
    },
    icon: {
        fontSize: "50px",
        color: "#5A55FF",
    },
    textBox: {
        padding: theme.spacing(1),
        marginTop: theme.spacing(1),
        backgroundColor: "#ffffff",
        borderRadius: "5px",
    },
    buttonGroup: {
        marginTop: theme.spacing(4),
    },
    apiBox: {
        backgroundColor: "#000000",
        color: "#ffffff",
        borderRadius: "10px",
        padding: theme.spacing(2),
        textAlign: "center",
        maxWidth: "200px",
    },
    apiButton: {
        backgroundColor: "#5A55FF",
        marginTop: theme.spacing(2),
    },
    responsiveIconGroup: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
    },
}));
export default function LossRunReportsDemo() {

  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
    const classes = useStyles();
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
   
  
    const [openPopup, setOpenPopup] = useState(false);

    useEffect(() => {
      const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");
      const userAccess = Authorization ? JSON.parse(localStorage.getItem('userAccess')) : [];

      if (!userAccess.includes('loss_runs') || !Authorization) {
        setOpenPopup(true);
      }
    }, []); // Empty dependency array ensures this runs only once on mount

    return <>
    {Authorization &&
    <>

        <Header />

     <Box sx={{  background: 'linear-gradient(to right, #001660, #6a3093)',}}>
        <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto' }}>

           <Typography variant="h4" component="h1" className= "Nasaliza" sx={{
               fontWeight: 'bold',

               textAlign: 'center', paddingTop: "3rem", color: 'white'

           }}>
                Doc<span style={{ color: '#0B70FF' }}>AI</span><sup style={{position: 'relative', top: '-1rem', right: '-0.1rem', fontSize: '0.5rem'}}>TM</sup> Loss Run<Typography className="billy-title" style={{color:"orange",fontSize:'3rem'}}>Demo</Typography>
           </Typography>

           <Box className={classes.root}>
               <Grid container spacing={4} className={classes.content}>
                   <Grid item xs={12} md={6} className={classes.leftSide}>
                       <Typography variant="h4" fontWeight="bold" color={'white'} className='Nasaliza'>
                       Streamline Loss Run Analysis with Insur<span style={{ color: 'red', fontWeight: 'bold' }}>AI</span>.
                       </Typography>
                       <Typography variant="body1" color='whitesmoke' mt={2} sx={{textAlign: 'justify',
                        hyphens: 'auto',
                        wordBreak: 'break-word',
                        '& > span': { display: 'inline-block' }}}>
                       Our DocAI Loss Run page utilizes cutting-edge computer vision and LLMs to extract data from images, PDFs and Even from Excel sheets, presenting it in a clear and organized structure. With this automated data extraction process, you can easily analyze your data and make informed decisions.
                       </Typography>

                   </Grid>
                   <Grid item xs={12} md={4} className={classes.rightSide}>
                       <Box className={classes.iconGroup}>
                       <Box className={classes.iconBox}>
                               {/* <ImageIcon className={classes.icon} /> */}
                               <img src={image} alt="" height={'40px'} />
                               <Box className={classes.textBox}>
                                   <Typography variant="body2">Img</Typography>
                               </Box>
                           </Box>
                           <Box className={classes.iconBox}>
                               <img src={pdf} alt="pdf" height={'40px'} />
                               {/* <InsertDriveFileIcon className={classes.icon} /> */}
                               <Box className={classes.textBox}>
                                   <Typography variant="body2">PDF</Typography>
                               </Box>
                           </Box>
                           <Box className={classes.iconBox}>
                           <img src={office365} alt="office365" height={'40px'} />
                               {/* <ReceiptIcon className={classes.icon} /> */}
                               <Box className={classes.textBox}>
                                   <Typography variant="body2">Excel</Typography>
                               </Box>
                           </Box>
                           <Box className={classes.iconBox}>
                           <img src={invoice} alt='invoice' height={'40px'} />
                               {/* <DescriptionIcon className={classes.icon} /> */}
                               <Box className={classes.textBox}>
                                   <Typography variant="body2">Loss runs bill</Typography>
                               </Box>
                           </Box>

                       </Box>

                   </Grid>
               </Grid>
           </Box>
           </Box>
           </Box>







<Box sx={{ height: isSmallScreen ? 'auto' : '200px', backgroundColor: '#001660',paddingBottom:'2rem' ,margin:'auto',justifyContent:"center",alignItems:'center'}}>
  <Container maxWidth="lg" className="fileAnalys-container">
    <Grid container spacing={3} justifyContent="center">
      {[
        { icon: <AssessmentIcon style={{ fontSize: 50,color:"blue"}} />, title: "Loss Run Report Accuracy", number: "> 92%" },
        { icon: <TimerIcon style={{ fontSize: 50, color:"blue"}} />, title: "Enhanced Time Efficiency", number: "88%" },
        { icon: <AutoAwesomeMotionIcon style={{ fontSize: 50,color:"blue"  }} />, title: "DocAI Loss Run Automation", number: "95%" },
      ].map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Box className="fileAnalys-grid" sx={{ textAlign: 'center', }}>
            {item.icon}
            <Typography fontSize={'1rem'} component="h5" className="Nasaliza">
              {item.title}
            </Typography>
            <Typography  component="h3" className="Nasaliza">{item.number}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>


    <LossRunReportsFun/>
     <Grid marginBottom={4}></Grid>
     <PopupMessage open={openPopup} onClose={() => setOpenPopup(false)} />
 <Footer />
 </>
 }
    </>
}