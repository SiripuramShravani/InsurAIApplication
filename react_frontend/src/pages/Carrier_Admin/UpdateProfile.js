import React, { useState,useEffect } from 'react';
import { Box, Grid, Card, Paper, CardContent, Backdrop, CircularProgress, Modal, Typography } from '@mui/material';
import InsuranceCompanyNewFormFill from "../../components/insuranceCompanyNewFormFill.js";
import axios from 'axios'; // Import axios for API calls
import { toast } from "react-toastify"; // Import toast for notifications
import { ToastContainer } from 'react-toastify';




const UpdateProfile = () => {
    const [isCompanyUpdate, setIsCompanyUpdate] = React.useState(true);
    const [processSubmit, setProcessSubmit] = useState(false);
    const [companyFormValues, setCompanyFormValues] = React.useState({});
    const [selectedFile, setSelectedFile] = useState([]);

    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_URL,
        withCredentials: true
      });



    useEffect(() => {
        const companyString = localStorage.getItem('carrier_admin_company');
        if (companyString) {           
            const company = JSON.parse(companyString);            
            setCompanyFormValues(company);
        }
    }, []);

console.log(companyFormValues);
    const handleOnUpdateCompany = async (e, initialFormValues, icId, selectedFile) => {
        setProcessSubmit(true);
        e.preventDefault();
        console.log(initialFormValues, icId, selectedFile);
        const formData = new FormData();
        formData.append('ic_name', initialFormValues.ic_name);
        formData.append('ic_address1', initialFormValues.ic_address1);
        formData.append('ic_address2', initialFormValues.ic_address2);
        formData.append('ic_street', initialFormValues.ic_street);
        formData.append('ic_city', initialFormValues.ic_city);
        formData.append('ic_zip', initialFormValues.ic_zip);
        formData.append('ic_state', initialFormValues.ic_state);
        formData.append('ic_country', initialFormValues.ic_country);
        formData.append('ic_email', initialFormValues.ic_email);
        formData.append('ic_mobile', initialFormValues.ic_mobile);
        formData.append('ic_primary_color', initialFormValues.ic_primary_color);
        formData.append('ic_secondary_color', initialFormValues.ic_secondary_color);
        formData.append('ic_website_url', initialFormValues.ic_website_url);
        formData.append('claim_storage_type', initialFormValues.claim_storage_type);
        formData.append('ic_id', companyFormValues.ic_id); // Add the ic_id from local storage

        if (selectedFile && selectedFile.length > 0) {
            formData.append('new_logo', selectedFile[0]);
        }

        try {
            const response = await axiosInstance.put('update-company/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response);
            toast.success(response.data.message);
            setIsCompanyUpdate(false);
            setProcessSubmit(false);
            setSelectedFile([]);
            await handleGetFreshCompanyDetails();
        } catch (error) {
            console.log(error);
            toast.error('Failed to update company');
            setProcessSubmit(false);
        }
    }

    const handleGetFreshCompanyDetails = async () => {
        try {
            const id = companyFormValues.ic_id;
            const response = await axiosInstance.get('get-company-by-id/', { params: { ic_id: id } });
            console.log(response);
            localStorage.setItem('carrier_admin_company', JSON.stringify(response.data.company));
            setCompanyFormValues(response.data.company); // Update state with new data
        } catch (error) {
            console.error("Error fetching company data:", error);
        }
    }

    return (
        <Box>
            {companyFormValues && (
                <Grid container justifyContent={"center"}>
                 <Grid item xs={12} sm={12} md={10}>
                        <Typography
                            sx={{
                                color: companyFormValues.ic_primary_color,
                                fontWeight: '500',
                                textAlign: 'center',
                                fontSize: "1.5rem",
                                marginTop: "-1.5rem"
                        }}
                        className="Nasaliza"
                    >
                        Update Profile
                    </Typography>
                    <InsuranceCompanyNewFormFill
                        iscompanyUpdate={isCompanyUpdate}
                        initialValues={companyFormValues}
                        onSubmit={handleOnUpdateCompany}
                        companyId={companyFormValues.ic_id}
                        updateFormValues={companyFormValues}
                        id="carrier_admin"
                        selectedFile={selectedFile}
                    />
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={processSubmit}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </Grid>
                </Grid>
            )}
        </Box>
    );
}

export default UpdateProfile
 

