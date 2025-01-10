import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Button, Card } from '@mui/material';
import { states } from '../data/states';
import FileUpload from './fileupload';
import CancelIcon from '@mui/icons-material/Cancel';
import { InputField, SelectField } from "./companyvalidations.js";
import "./componentstyles.css";


import { useTheme, useMediaQuery } from '@mui/material';




const InsuranceCompanyNewFormFill = ({ iscompanyUpdate, onCancel, initialValues, onSubmit, companyId, updateFormValues, handleGetCompanyDetails, id }) => {
    // console.log(initialValues, iscompanyUpdate);
    const [initialFormvalues, setInitialFormvalues] = useState(initialValues);
    console.log(initialFormvalues, updateFormValues, iscompanyUpdate);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
     // eslint-disable-next-line 
    const [uploadIn,setUploadIn ] = useState("company");
    const [selectedFile, setSelectedFile] = useState([]);
    const [filesUploadedInChild, setFilesUploadedInChild] = useState(false);
    const [icId, setIcId] = useState('');
   
    const [state, setState] = useState(initialFormvalues.ic_state ? initialFormvalues.ic_state : '');
    const [country, setCountry] = useState(
        initialFormvalues.ic_country ? initialFormvalues.ic_country : ''
    );
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
 

    const [storageType, setStorageType] = useState(
        initialFormvalues.claim_storage_type
            ? initialFormvalues.claim_storage_type
            : ''
    );
    useEffect(() => {
        if (iscompanyUpdate) {
            setIcId(initialFormvalues.ic_id)

            console.log(initialFormvalues.ic_id, "initialFormvalues")
            setInitialFormvalues(updateFormValues);
            setState(updateFormValues.ic_state)
            setCountry(updateFormValues.ic_country);
            setStorageType(updateFormValues.claim_storage_type);
        } else {
            setInitialFormvalues(initialValues);
        }
    }, [iscompanyUpdate, initialValues, updateFormValues,initialFormvalues.ic_id]);


    const handleOnInputChange = (name, value) => {
        console.log(name, value);
        if (name === 'ic_state') {
            setState(value);
            setInitialFormvalues({ ...initialFormvalues, [name]: value });
        } else if (name === 'ic_country') {
            setCountry(value);
            setInitialFormvalues({ ...initialFormvalues, [name]: value });
        } else if (name === 'claim_storage_type') {
            setStorageType(value);
            setInitialFormvalues({ ...initialFormvalues, [name]: value });
        } else {
            setInitialFormvalues({ ...initialFormvalues, [name]: value });
        }
    };

    const handleCancel = () => onCancel();

    const handleFilesUploadToAWSByCompany = (selectedFiles, previews) => {
        console.log(selectedFiles);
        setSelectedFile(selectedFiles);
    }

    const handleFileRemove = ()=>{
        console.log("parent selectedfile null");
        setSelectedFile(null);
    }

    const handleCompanySubmit = (e) => {
        e.preventDefault();
        onSubmit(e, initialFormvalues, selectedFile);
        setFilesUploadedInChild(true);
    };

    const handleUpdateCompany = (e) => {
        console.log("update submit");
        e.preventDefault();
        onSubmit(e, initialFormvalues, icId, selectedFile)
        setFilesUploadedInChild(true);
    }

    const imageSrc = `data:image/${initialFormvalues.image_type};base64,${initialFormvalues.image_data}`

    return (
        <Box sx={{ margin: "1% 0% 15% 0%" }}>
            <Card
                style={{

                    border:
                        id === "carrier_admin"
                            ? initialFormvalues.ic_primary_color
                                ? `2px solid ${initialFormvalues.ic_primary_color}`
                                : `2px solid ${initialFormvalues.ic_secondary_color}`
                            : "1px solid blue",
                    margin: isSmallScreen ? "0px 8px 0px 8px"
                        : "0px 55px 0px 55px",

                }}
            >
                {!id === "carrier_admin" && (
                    <Grid className='companyformcancel'>
                        <Button onClick={handleCancel} >
                            <CancelIcon />
                        </Button>
                    </Grid>
                )

                }

                <Grid className='companyformheadings'
                >
                    <Typography style={{
                        color: id === "carrier_admin"
                            ? initialFormvalues.ic_primary_color
                                ? initialFormvalues.ic_primary_color
                                : initialFormvalues.ic_secondary_color
                            : "",// Default color if not "carrier_admin"
                        fontSize: isSmallScreen ? "1rem" : "1.3rem",
                    }} className="Nasaliza" >Company Information</Typography>
                </Grid>
                <Grid container>
                    <Grid item xs={2.1} sm={2.1} md={2.5} lg={2.5} xl={2.5}></Grid>
                    <Grid item xs={8} sm={8} md={7} lg={7} xl={7}>
                        <InputField
                            label="Company Name"
                            name="ic_name"
                            value={initialFormvalues.ic_name}
                            onChange={handleOnInputChange}
                            regex={/^(?=.*[a-z A-Z])[A-Za-z0-9. ]{3,35}$/}
                            required
                            placeholder="Enter company name"
                        />
                    </Grid>
                    <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5} xl={2.5}></Grid>
                </Grid>
                <Grid className='companyformheadings'>
                    <Typography style={{
                        color: id === "carrier_admin"
                            ? initialFormvalues.ic_primary_color
                                ? initialFormvalues.ic_primary_color
                                : initialFormvalues.ic_secondary_color
                            : "",
                        fontSize: isSmallScreen ? "1rem" : "1.3rem",// Default color if not "carrier_admin"
                    }} className="Nasaliza">Company Address Information </Typography>
                </Grid>
                <Grid container>
                    <Grid item xs={2.1} sm={2.1} md={2.5} lg={2.5} xl={2.5}></Grid>
                    <Grid item xs={8} sm={8} md={3} lg={3} xl={3}>
                        <InputField
                            label="Address 1"
                            name="ic_address1"
                            value={initialFormvalues.ic_address1}
                            onChange={handleOnInputChange}
                            regex={/^(?=.*[0-9])[A-Z0-9]{1,12}$/}
                            required
                            placeholder="Enter Address 1"
                        />
                    </Grid>
                    <Grid item xs={2.1} sm={2.1} md={1} lg={1} xl={1}></Grid>
                    <Grid item xs={8} sm={8} md={3} lg={3} xl={3}>
                        <InputField
                            label="Address 2"
                            name="ic_address2"
                            value={initialFormvalues.ic_address2}
                            onChange={handleOnInputChange}
                            regex={/^(?=.*[0-9A-Za-z])[A-Z0-9a-z ]{1,40}$/}
                            placeholder="Enter Address 2"
                        />
                    </Grid>
                    <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5} xl={2.5}></Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={2.1} sm={2.1} md={2.5} lg={2.5} xl={2.5}></Grid>
                    <Grid item xs={8} sm={8} md={2} lg={2} xl={2}>
                        <InputField
                            label="Street Name "
                            name="ic_street"
                            value={initialFormvalues.ic_street}
                            onChange={handleOnInputChange}
                            regex={/^(?=.*[a-z])[A-Za-z0-9. ]{3,35}$/}
                            placeholder="Enter Street Name"
                            required
                        />
                    </Grid>
                    <Grid item xs={2.1} sm={2.1} md={0.5} lg={0.5} xl={0.5}></Grid>
                    <Grid item xs={8} sm={8} md={2} lg={2} xl={2}>
                        <InputField
                            label="City "
                            name="ic_city"
                            value={initialFormvalues.ic_city}
                            onChange={handleOnInputChange}
                            placeholder="Enter City Name"
                            regex={/^(?=.*[a-z])[A-Za-z ]{3,50}$/}
                            required
                        />
                    </Grid>
                    <Grid item xs={2.1} sm={2.1} md={0.5} lg={0.5} xl={0.5}></Grid>
                    <Grid item xs={8} sm={8} md={2} lg={2} xl={2}>
                        <InputField
                            label="ZIP Code "
                            name="ic_zip"
                            value={initialFormvalues.ic_zip}
                            onChange={handleOnInputChange}
                            regex={/^\d{5}(-\d{4})?$/}
                            placeholder="Enter zip code"
                            required
                        />
                    </Grid>
                    <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5} xl={2.5}></Grid>
                </Grid>
                <Grid container sx={{ mt: 2 }}>
                    <Grid item xs={2.1} sm={2.1} md={2.5} lg={2.5} xl={2.5}></Grid>
                    <Grid item xs={8} sm={8} md={3} lg={3} xl={3}>
                        <SelectField
                            label="State"
                            name="ic_state"
                            value={state} // Correctly bind to the state variable
                            onChange={handleOnInputChange}
                            options={states.map((state) => ({
                                label: `${state.select} (${state.value})`,
                                value: `${state.select} (${state.value})` // Option value should match the API response
                            }))}
                            required
                        />
                    </Grid>
                    <Grid xs={2.1} sm={2.1} md={1} lg={1} xl={1}></Grid>
                    <Grid item xs={8} sm={8} md={3} lg={3} xl={3}>
                        <SelectField
                            label="Country"
                            name="ic_country"
                            value={country} // Controlled with the country state
                            onChange={handleOnInputChange}
                            options={[{ label: "USA", value: "USA" }]}
                            required
                        />
                    </Grid>
                    <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5} xl={2.5}></Grid>
                </Grid>
                <Grid className='companyformheadings'>
                    <Typography style={{
                        color: id === "carrier_admin"
                            ? initialFormvalues.ic_primary_color
                                ? initialFormvalues.ic_primary_color
                                : initialFormvalues.ic_secondary_color
                            : "" // Default color if not "carrier_admin"
                    }} className="Nasaliza">Company Contact Information </Typography>
                </Grid>
                <Grid container>
                    <Grid item xs={2.1} sm={2.1} md={2.5} lg={2.5} xl={2.5}></Grid>
                    <Grid item xs={8} sm={8} md={3} lg={3} xl={3}>
                        <InputField
                            label="Customer Care Email "
                            name="ic_email"
                            value={initialFormvalues.ic_email}
                            onChange={handleOnInputChange}
                            placeholder="Enter  Customer Care Email"
                            regex={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
                            required
                        />
                    </Grid>
                    <Grid item xs={2.1} sm={2.1} md={1} lg={1} xl={1}></Grid>
                    <Grid item xs={8} sm={8} md={3} lg={3} xl={3}>
                        <InputField
                            label="Customer care Number "
                            name="ic_mobile"
                            value={initialFormvalues.ic_mobile}
                            onChange={handleOnInputChange}
                            placeholder="Enter  Customer care Number"
                            regex={/^\d{10,11}$/}
                            required
                        />
                    </Grid>
                    <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5} xl={2.5}></Grid>
                </Grid>
                <Grid className='companyformheadings'>
                    <Typography style={{
                        color: id === "carrier_admin"
                            ? initialFormvalues.ic_primary_color
                                ? initialFormvalues.ic_primary_color
                                : initialFormvalues.ic_secondary_color
                            : "",
                        fontSize: isSmallScreen ? "1rem" : "1.3rem",// Default color if not "carrier_admin"
                    }} className="Nasaliza">Company Branding Information </Typography>
                </Grid>
                <Grid container>
                    <Grid item xs={2.1} sm={2.1} md={2.5} lg={2.5} xl={2.5}></Grid>
                    <Grid item xs={8} sm={8} md={3} lg={3} xl={3}>
                        <InputField
                            label="Primary Color Code "
                            name="ic_primary_color"
                            value={initialFormvalues.ic_primary_color}
                            onChange={handleOnInputChange}
                            placeholder='Eg: #FFFFFF'
                            regex={/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/}
                            required
                        />
                    </Grid>
                    <Grid item xs={2.1} sm={2.1} md={1} lg={1} xl={1}></Grid>
                    <Grid item xs={8} sm={8} md={3} lg={3} xl={3}>
                        <InputField
                            label="Secondary Color Code "
                            name="ic_secondary_color"
                            value={initialFormvalues.ic_secondary_color}
                            onChange={handleOnInputChange}
                            regex={/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/}
                            placeholder='Eg: #FFFFFF'

                        />
                    </Grid>
                    <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5} xl={2.5}></Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={2.1} sm={2.1} md={2.5} lg={2.5} xl={2.5}></Grid>
                    <Grid item xs={8} sm={8} md={7} lg={7} xl={7}>
                        <InputField
                            label="Company Website URL "
                            name="ic_website_url"
                            value={initialFormvalues.ic_website_url}
                            onChange={handleOnInputChange}
                            placeholder='Eg: https://innovontek.com'
                            regex={/^(ftp|http|https):\/\/[^ "]+$/}
                            required
                        />
                    </Grid>
                    <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5} xl={2.5}></Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={2.1} sm={2.1} md={2.5} lg={2.5} xl={2.5}></Grid>
                    <Grid item xs={8} sm={8} md={7} lg={7} xl={7}>
                        <SelectField
                            label="Claim Storage Type"
                            name="claim_storage_type"
                            value={storageType} // Controlled with the storageType state
                            onChange={handleOnInputChange}
                            options={[
                                { label: "Database", value: "Database" },
                                { label: "Excel", value: "Excel" },
                                { label: "CSV", value: "CSV" },
                                { label: "Flat File", value: "Flat File" },
                            ]}
                            required
                        />
                    </Grid>
                    <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5} xl={2.5}></Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={2.1} sm={2.1} md={2.5} lg={2.5} xl={2.5}></Grid>
                    <Grid item xs={8} sm={8} md={7} lg={7} xl={7}>
                        <FileUpload
                            id="company"
                            multiple={false}
                            allowedFormats={['png', 'jpg']}
                            setIsSubmitDisabled={setIsSubmitDisabled}
                            uploadIn={uploadIn}
                            onFilesUpload={handleFilesUploadToAWSByCompany}
                            filesUploadedInChild={filesUploadedInChild}
                            initialCompanyValues={initialFormvalues}
                            onFileRemove={handleFileRemove}
                          
                        />
                    </Grid>
                    <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5} xl={2.5}></Grid>
                </Grid>
                {iscompanyUpdate === true && initialFormvalues && (
                    <Grid className='companyformlogostyle'>
                        <Typography><strong>Note : </strong>You are replacing with this logo</Typography>
                        <img src={imageSrc} alt="Insurance Company Logo" />
                    </Grid>
                )}
                <Grid className='companyformlogostyle'  >
                    <Button variant="contained" onClick={iscompanyUpdate ? handleUpdateCompany : handleCompanySubmit} disabled={isSubmitDisabled}
                        style={{
                            backgroundColor: id === "carrier_admin"
                                ? initialFormvalues.ic_primary_color
                                    ? initialFormvalues.ic_primary_color
                                    : initialFormvalues.ic_secondary_color
                                : "" // Default color if not "carrier_admin"
                        }} className="Nasaliza"
                    >
                        {iscompanyUpdate ? 'Update' : 'Submit'}
                    </Button>
                </Grid>
            </Card>            
        </Box >
    )
}

export default InsuranceCompanyNewFormFill