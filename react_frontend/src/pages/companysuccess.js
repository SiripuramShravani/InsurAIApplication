import { Box, Grid, Typography, CardContent, Card } from '@mui/material'
import check from '../assets/check.gif';

import contact from '../assets/contact.png';
import Header from '../components/header';
import Footer from '../components/footer';

const Companysuccess = () => {
     const ic_id = localStorage.getItem("IC_ID")

    return (
        <Box >
            <Header/>
            <Grid container justifyContent="center" sx={{margin:"8% 0% 3% 0%"}}>
                 <Card>
                    <CardContent style={{textAlign:"center"}} >
                        <Typography style={{ fontFamily: 'Roboto, sans-serif' }}>Your Company has been Successfully Created !!</Typography> 
                        <img src={check} alt="success logo" />
                        <Typography>Your Company ID : {ic_id}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid>
                <Typography style={{textAlign:"center"}}>For any support? Please Contact Us :  &nbsp;&nbsp;<img src={contact} width="2%" alt="email-mobile logo" />&nbsp;info@innovontek.com &nbsp;&nbsp;+1 513 456 1199</Typography>
             </Grid>
              <Footer/>
         </Box >
    )
}

export default Companysuccess;