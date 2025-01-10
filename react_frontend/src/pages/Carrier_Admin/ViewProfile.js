import React from 'react';
import { Box, Grid, Card, Paper, CardContent, Typography } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

const ViewProfile = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    const companyString = localStorage.getItem('carrier_admin_company');
    let company;
    if (companyString) {
        company = JSON.parse(companyString);
    }

    const displayFieldNames = [
        "Company Name",
        "Company Logo",
        "Company ID",
        "Customer Care Email",
        "Customer Care Number",
        "Primary Color Code",
        "Secondary Color Code",
        "Company Website URL",
        "Claim Storage Type",
        "Address Line 1",
        "Address Line 2",
        "Street Name",
        "City",
        "State",
        "Zip",
        "Country",
        "Company Logo File Name",
    ];

    const fieldMapping = {
        "Company Name": "ic_name",
        "Company ID": "ic_id",
        "Address Line 1": "ic_address1",
        "Address Line 2": "ic_address2",
        "Street Name": "ic_street",
        "City": "ic_city",
        "State": "ic_state",
        "Zip": "ic_zip",
        "Country": "ic_country",
        "Customer Care Email": "ic_email",
        "Customer Care Number": "ic_mobile",
        "Primary Color Code": "ic_primary_color",
        "Secondary Color Code": "ic_secondary_color",
        "Company Website URL": "ic_website_url",
        "Claim Storage Type": "claim_storage_type",
        "Company Logo File Name": "ic_logo_name",
    };

    function renderValue(fieldName) {
        if (fieldName === "Company Logo") {
            return (
                <img src={imageSrc} alt="Insurance Company Logo" style={{ backgroundColor: company.ic_primary_color ? company.ic_primary_color : company.ic_secondary_color, width: "100%" }} />
            )
        } else if (
            fieldName === "Primary Color Code" ||
            fieldName === "Secondary Color Code"
        ) {
            const colorCode = company[fieldMapping[fieldName]];
            return (
                <>
                    <span
                        style={{
                            backgroundColor: colorCode,
                            display: "inline-block",
                            width: "1rem",
                            height: "1rem",
                            marginRight: "0.5rem",
                        }}
                    />
                    <span>{colorCode}</span>
                </>
            );
        }
        else {
            return company[fieldMapping[fieldName]];
        }
    }

    const imageSrc = company?.image_type ? `data:image/${company.image_type};base64,${company.image_data}` : null;

    return (
        <Box sx={{ padding: isSmallScreen ? 2 : 4 }}>
            {company && (
                <Grid container direction="column">
                    <Typography
                        sx={{
                            color: company.ic_primary_color,
                            fontWeight: '500',
                            textAlign: 'center',
                            fontSize: isSmallScreen ? "1.2rem" : "1.5rem",
                            marginTop: "-2rem"
                        }}
                        className="Nasaliza"
                    >
                        {company.ic_name} Profile
                    </Typography>
                    <Grid container justifyContent="center">
                        {/* <Grid item xs={2}></Grid> */}
                        <Card sx={{ boxShadow: 3, margin:isSmallScreen?"0.5": '1rem', width: '100%', maxWidth: 800 }}>
                            <Paper
                                elevation={2}
                                sx={{
                                    padding:isSmallScreen?0: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    // border:'2px solid blue'
                                    border: `2px solid ${company.ic_secondary_color || company.ic_primary_color || "#999999"}`,
                                }}
                            >
                                <Grid item xs={8}>
                                    <CardContent>
                                        {displayFieldNames.map((fieldName, index) => (
                                            <React.Fragment key={fieldName}>
                                                <Grid container>
                                                    <Grid item xs={1} md={3}></Grid>
                                                    <Grid item xs={4} sm={3} md={4.7} style={{ textAlign: "left", }}>
                                                        <Typography className="Nasaliza" style={{ fontSize: isSmallScreen?"0.7rem" :"0.9rem", margin: "0.7rem 0" }}>
                                                            {fieldName}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={2} sm={2} md={3} style={{ margin: "0.7rem 0", textAlign: "center" }}>:</Grid>
                                                    <Grid item xs={3} sm={3} md={1.3} >
                                                        <Typography className="Nasaliza" style={{ textAlign: "left", fontSize:isSmallScreen?"0.7rem" :"0.9rem", margin: "0.7rem 0", whiteSpace: 'nowrap', color: "gray" }}>
                                                            {renderValue(fieldName) ? renderValue(fieldName) : "-"}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </React.Fragment>
                                        ))}
                                    </CardContent>
                                </Grid>
                            </Paper>
                        </Card>
                        {/* <Grid item xs={2}></Grid> */}
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}

export default ViewProfile;


