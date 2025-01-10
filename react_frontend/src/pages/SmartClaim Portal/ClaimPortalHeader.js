import React from 'react';
import { AppBar, Grid, Toolbar, Typography, Container, Box, useMediaQuery, createTheme } from "@mui/material";


const ClaimPortalHeader = ({localCompany, user, activeStep}) => {
    const theme = createTheme({
        breakpoints: {
          values: {
            xs: 0,
            sm: 650,
            md: 970,
            lg: 1280,
            xl: 1920,
          },
        },
      });
      
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    if (!localCompany) {
        return null; 
    }
    const imageSrc = `data:image/${localCompany.image_type};base64,${localCompany.image_data}`;
    const LossProperty =  user.pro_address1 + ",  " + user.pro_city + ",  " + user.pro_state + ",  " + user.pro_country + ",  " + user.pro_zip + ".";

    return (
            <AppBar position="static" sx={{ backgroundColor: localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066", padding:"1.8rem 0rem 0.7rem 0rem"}}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {isMobile ?
                            <>
                                <img src={imageSrc} alt="ic-logo" style={{ width: "70px" }} />&nbsp;&nbsp;&nbsp;
                            </>
                            :
                            <>
                                <img src={imageSrc} alt="ic-logo" style={{ width: "70px" }} />&nbsp;&nbsp;&nbsp;
                            </>
                        }
                        {!isMobile &&
                            <>
                                <Typography>
                                    {user.policy_number}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    {user.pol_first_name + " " + user.pol_middle_name + " " + user.pol_last_name} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    {"Eff : " + user.pro_pol_eff_date}&nbsp;&nbsp;{" "}
                                    {"Exp : " + user.pro_pol_exp_date}
                                </Typography>
                                <Box sx={{ flexGrow: 1 }} />
                                {activeStep >= 1 && (
                                    <Typography style={{ fontSize: "0.85rem", paddingRight: 30 }}>{LossProperty}</Typography>
                                )}
                            </>
                        }
                        {isMobile && <><Grid iteam xs={12} style={{ textAlign: "right" }}> {user.policy_number} </Grid></>}
                    </Toolbar>
                </Container>
            </AppBar>
    )
}

export default ClaimPortalHeader