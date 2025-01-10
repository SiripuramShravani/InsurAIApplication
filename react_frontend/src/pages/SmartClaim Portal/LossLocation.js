import React, { useState, useEffect } from 'react';
import { Grid, Typography, Dialog, DialogContent, DialogActions, Paper, Snackbar, Alert, Box, Tooltip, IconButton, Button, CircularProgress, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import StyledButtonComponent from '../../components/StyledButton';
import { Edit as EditIcon, CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';
import axios from 'axios';
import { states } from '../../data/states';
import { NavigateNext as NavigateNextIcon, NavigateBefore as NavigateBeforeIcon } from "@mui/icons-material";
import AddressValidation from '../../assets/AddressValidation.jpg'

const LossLocation = ({ setStepName, setBulbStepValid, onNext, onBack, showError, setShowError, formData, setFormData, confirmAddress, setConfirmAddress, editAddress, setEditAddress, enableReviewButton, onReviewClick, updateStepValidity, setCheckValidaionName, setValidateError, isStepAddressValid, localCompany }) => {
    const [errors, setErrors] = useState({});
    const [isAddressValid, setIsAddressValid] = useState(false);
    const [isValidatingAddress, setIsValidatingAddress] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [suggestedAddress, setSuggestedAddress] = useState(null);
    const [spittedAddress, setSpittedAddress] = useState(null);
    const [showAddress, setShowAddress] = useState(false);
    const [locationDataState, setLocationDataState] = useState(null);
    const [locationApiCalled, setLocationApiCalled] = useState(false);
    const [open, setOpen] = useState(false);
    const [geoAddress, setGeoAddress] = useState(false)

    const handleClose = () => {
        setOpen(false);
    };
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_URL,
        withCredentials: true
    });


    useEffect(() => {
        const isValid = isFormValid();
        updateStepValidity(isValid);
        // eslint-disable-next-line    
    }, [formData, errors, confirmAddress]);

    useEffect(() => {
        const getLocation = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const coordinates = {
                            longitude: position.coords.longitude,
                            latitude: position.coords.latitude,
                        };
                        if (!confirmAddress) {
                            await makeLocationAPIRequest(coordinates);
                        }
                        setLocationApiCalled(true);
                    },
                    () => {
                        console.error("Error getting user location, pls enable your location");
                        setLocationApiCalled(true);
                    }
                );
            } else {
                console.error("Geolocation is not supported by this browser.");
                setLocationApiCalled(true);
            }
        }
        if (!locationApiCalled) {
            getLocation();
        }
        // eslint-disable-next-line    
    }, [locationApiCalled, confirmAddress]);

    const makeLocationAPIRequest = async (locationCoordinates) => {
        if (!locationCoordinates || !locationCoordinates.latitude || !locationCoordinates.longitude) {
            return;
        }
        await axiosInstance.get('get-location/', {
            params: {
                latitude: locationCoordinates.latitude,
                longitude: locationCoordinates.longitude
            }
        }).then(response => {
            if (response.data && response.data.address) {
                const formattedAddress = formatAddress(response.data.address);
                setSuggestedAddress(formattedAddress);

                setSpittedAddress(response.data.address);
                setShowAddress(true);
                setOpen(true);
                setGeoAddress(true)
                setLocationDataState(formattedAddress);
            }
        }).catch(err => {
            console.error("No location found, pls try again", err)
        })
    };
    const formatAddress = (address) => {
        const addressComponents = [
            address.street_number,
            address.street_name,
            address.city,
            address.state,
            address.zipcode,
            address.country
        ].filter(component => component);
        return addressComponents.join(' ');
    };
    const isFormValid = () => {
        const requiredFields = [
            'street_number',
            'street_name',
            'loss_city',
            'loss_state',
            'loss_zip',
            'loss_country',
        ];
        for (const field of requiredFields) {
            if (formData[field] === '' || errors[field]) {
                return false;
            }
        }
        return true;
    };

    const handleEditFields = () => {
        setConfirmAddress(false);
        setEditAddress(true);
    };

    const handleLossLocationChange =  (event) => {
        if (event) {
            const { name, value } = event.target;
             setFormData((prevFormData) => ({
                ...prevFormData,
                lossLocation: {
                    ...prevFormData.lossLocation,
                    [name]: value,
                },
            }));
             validateField(name, value);
        }
        const isValid =  isFormValid();
         updateStepValidity(isValid);
    };
    useEffect(() => {
        checkAddressValidity();
        // eslint-disable-next-line    
    }, [formData, errors]);
    const checkAddressValidity = () => {
        const { street_number, street_name, loss_zip } = formData
        setIsAddressValid(
            street_number &&
            street_name &&
            loss_zip &&
            !errors.street_number &&
            !errors.street_name &&
            !errors.loss_zip
        );
    };
    const validateField = (name, value) => {
        const newErrors = { ...errors };
        let isValid = true;
        switch (name) {
            case 'street_number':
                if (value === '' || value === undefined || value === null) {
                    newErrors[name] = 'Please enter a Street Number.';
                    isValid = false;
                } else if (!/^\d+$/.test(value)) {
                    newErrors[name] = 'Please enter a valid street number (only integers).';
                    isValid = false;
                } else {
                    delete newErrors[name];
                }
                break;
            case 'street_name':
                if (value === '' || value === undefined || value === null) {
                    newErrors[name] = 'Please enter a Street Name.';
                    isValid = false;
                } else if (value.length > 40) {
                    newErrors[name] = 'Street Name must be 40 characters or less.';
                    isValid = false;
                } else {
                    delete newErrors[name];
                }
                break;
            case 'loss_city':
                if (value === '' || value === undefined || value === null) {
                    newErrors[name] = 'Please enter a city Name.';
                    isValid = false;
                } else if (!/^[A-Za-z\s]+$/.test(value)) {
                    newErrors[name] = 'Please enter a valid city name (only letters and spaces).';
                    isValid = false;
                } else {
                    delete newErrors[name];
                }
                break;
            case 'loss_zip':
                if (value === '' || value === undefined || value === null) {
                    newErrors[name] = 'Please enter a zip code.';
                    isValid = false;
                } else if (!/^\d{5}$/.test(value)) {
                    newErrors[name] = 'Please enter a valid 5-digit ZIP code.';
                    isValid = false;
                } else {
                    delete newErrors[name];
                }
                break;
            case 'loss_state':
            case 'loss_country':
                if (value === '' || value === undefined || value === null) {
                    newErrors[name] = 'Please select the value.';
                    isValid = false;
                } else if (value === '' || value === null) {
                    newErrors[name] = `${name.replace('loss_', '')} is required.`;
                    isValid = false;
                } else {
                    delete newErrors[name];
                }
                break;
            default:
                delete newErrors[name];
        }

        setErrors(newErrors);
        setStepName("Loss Location");
        setBulbStepValid(isValid);
        return newErrors[name];
    };

    const handleConfirmAddress = (spittedAddress) => {
        setLocationDataState("");
        setFormData((prevFormData) => ({
            ...prevFormData,
            lossLocation: {
                ...prevFormData.lossLocation,
                street_number: spittedAddress.street_number || '',
                street_name: spittedAddress.street_name || '',
                loss_city: spittedAddress.city || '',
                loss_state: spittedAddress.state || '',
                loss_zip: spittedAddress.zip_code || spittedAddress.zipcode || '',
                loss_country: spittedAddress.country || '',
            },
        }));
        const streetNumberError = validateField("street_number", spittedAddress.street_number);
        const streetNameError = validateField("street_name", spittedAddress.street_name);
        const lossCityError = validateField("loss_city", spittedAddress.city);
        const lossStateError = validateField("loss_state", spittedAddress.state);
        const lossZipError = validateField("loss_zip", spittedAddress.zip_code);
        const lossCountryError = validateField("loss_country", spittedAddress.country);
        setErrors((prevErrors) => ({
            ...prevErrors,
            street_number: streetNumberError,
            street_name: streetNameError,
            loss_city: lossCityError,
            loss_state: lossStateError,
            loss_zip: lossZipError,
            loss_country: lossCountryError,
        }));
        const hasErrors = !!(streetNumberError || streetNameError || lossCityError ||
            lossStateError || lossZipError || lossCountryError);
        if (!hasErrors) {
            setConfirmAddress(true);
            setEditAddress(false);
            setShowAddress(false);
        }
    };
    const handleValidateAddress = async () => {
        setIsValidatingAddress(true);

        try {
            const address = `${formData.street_number} ${formData.street_name}, ${formData.loss_city}, ${formData.loss_state} ${formData.loss_zip} ${formData.loss_country}`;
            const response = await axiosInstance.post('validate_address/', { address: address },);
            if (response.data && response.data.validated_address && response.data.splitted_address) {
               setSuggestedAddress(response.data.validated_address);
                setSpittedAddress(response.data.splitted_address);
                setSnackbarSeverity('info');
                setShowAddress(true);
                setOpen(true)
                setGeoAddress(false)
            }
        } catch (error) {
            console.error('Error during address validation:', error);
            setSnackbarSeverity('error');
            setSnackbarMessage(
                error.response && error.response.data && error.response.data.error
                    ? `${error.response.data.error}, Please check you address.`
                    : 'An error occurred during address validation. Please try again later.'
            );
            setSnackbarOpen(true);
        } finally {
            setIsValidatingAddress(false);
        }
    };

    const onBackCheckValidation = () => {
        if (isFormValid()) {
            setShowError(false)
            setCheckValidaionName((prev) => prev.filter((name) => name !== 'Loss Location'));
            onBack();
        } else {
            setValidateError(true)
            setShowError(true)
            setCheckValidaionName((prev) => [...prev, 'Loss Location']);
            onBack();
        }
    }
    const onReviewCheckValidation = () => {
        setBulbStepValid(true)
        setStepName(" ")
        if (isFormValid() && confirmAddress) {
            setCheckValidaionName((prev) => prev.filter((name) => name !== 'Loss Location'));
            onReviewClick();
        }
    }
    const handleNext = () => {
        if (isFormValid()) {
            setCheckValidaionName((prev) => prev.filter((name) => name !== 'Loss Location'));
            setBulbStepValid(false)
            onNext("lossLocation", formData);
        } else {
            console.error("Form has errors or missing required fields. Please correct them.");
            setCheckValidaionName((prev) => [...prev, 'Loss Location']);
            setValidateError(true)
            setBulbStepValid(true)
        }
    };

    return (
        <Grid
            container
            sx={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 2,
                overflowX: "hidden",
            }}
        >
            <Grid item xs={12} justifyContent='center' alignItems='center' margin="auto">
                <Grid textAlign={'left'} marginBottom={"2rem"}>
                    <Typography className="Nasaliza" variant="h5" style={{ color: localCompany && localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066" }} >
                        Loss Location Details
                    </Typography>
                </Grid>
                <Paper
                    elevation={2}
                    sx={{
                        padding: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",

                    }}
                >
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={8} sx={{ mb: 4 }}>
                                {showAddress && suggestedAddress && (
                                    <Dialog
                                        open={open}
                                        onClose={handleClose}
                                        PaperProps={{
                                            style: {
                                                background: 'white',
                                                boxShadow: '0 0 10px rgba(13, 0, 255, 0.5), 0 0 40px rgba(0, 217, 255, 0.3)',
                                                color: '#ffffff',
                                                border: '1px solid rgba(0, 85, 255, 0.2)',
                                            },
                                        }}
                                    >
                                        <DialogContent
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                flexWrap: 'wrap',  
                                                gap: '1rem',  
                                            }}
                                        >
                                            {/* Image Section */}
                                            <img
                                                src={AddressValidation}
                                                alt="Address Validation"
                                                style={{
                                                    maxWidth: '40%',  
                                                    height: 'auto',  
                                                    flex: '1 1 40%',  
                                                }}
                                            />

                                            {/* Address Section */}
                                            <div
                                                style={{
                                                    textAlign: "center",
                                                    flex: '1 1 55%', 
                                                }}
                                            >
                                                {showAddress && suggestedAddress && (
                                                    <Typography
                                                        style={{
                                                            color: '#0B70FF',
                                                            fontSize: '1rem',
                                                            fontStyle: 'italic',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        "{suggestedAddress}"
                                                    </Typography>
                                                )}
                                                <DialogActions style={{ justifyContent: 'center', padding: '1.5rem' }}>
                                                    <Button
                                                        size="medium"
                                                        sx={{
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            border: '2px solid rgb(0, 47, 255)',
                                                            padding: '10px 25px',
                                                            fontSize: '0.8rem',
                                                            borderRadius: '30px',
                                                            textTransform: 'none',
                                                            transition: 'all 0.3s ease',
                                                            background: '#001660',
                                                            '&:hover': {
                                                                backgroundColor: 'white',
                                                                color: '#001660',
                                                                transform: 'scale(1.1)',
                                                            },
                                                        }}
                                                        onClick={ () => {
                                                             handleConfirmAddress(spittedAddress);
                                                            handleClose();
                                                        }}
                                                    >
                                                      Confirm Address
                                                    </Button>
                                                    {geoAddress && (
                                                        <Button
                                                            onClick={handleClose}
                                                            size="medium"
                                                            sx={{
                                                                color: '#FF4D4D',
                                                                fontWeight: 'bold',
                                                                border: '1px solid #FF4D4D',
                                                                padding: '10px 25px',
                                                                fontSize: '0.8rem',
                                                                borderRadius: '30px',
                                                                textTransform: 'none',
                                                                transition: 'all 0.3s ease',
                                                                background: 'rgba(255, 77, 77, 0.1)',
                                                                '&:hover': {
                                                                    backgroundColor: '#FF4D4D',
                                                                    color: '#0A0A0A',
                                                                    transform: 'scale(1.1)',
                                                                },
                                                            }}
                                                        >
                                                            Deny
                                                        </Button>
                                                    )}
                                                </DialogActions>
                                            </div>
                                        </DialogContent>

                                    </Dialog>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                {!confirmAddress ? (
                                    <StyledButtonComponent
                                        buttonWidth={100}
                                        onClick={handleValidateAddress}
                                        disabled={!isAddressValid || isValidatingAddress || confirmAddress}
                                        disableColor={"#CCCCCC"}
                                        size="small"
                                        backgroundColor={(isAddressValid && !isValidatingAddress && !confirmAddress) ? (localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066") : "#999999"}
                                    >
                                        {isValidatingAddress ? (
                                            <CircularProgress size={24} />
                                        ) : (
                                            "Validate"
                                        )}
                                    </StyledButtonComponent>
                                ) : (
                                    <CheckCircleOutlineIcon color="success" />
                                )}
                                <Tooltip title="Edit" arrow placement="right">
                                    <IconButton
                                        onClick={handleEditFields}
                                        disabled={!confirmAddress}
                                        sx={{ color: '#010066' }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} >
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={!!errors.street_number}
                                    id="street_number"
                                    label="Street Number"
                                    variant="outlined"
                                    required
                                    name="street_number"
                                    autoComplete="street_number"
                                    value={formData.street_number}
                                    onChange={handleLossLocationChange}
                                    disabled={confirmAddress && !editAddress}
                                    helperText={errors.street_number ? <FormHelperText error>{errors.street_number}</FormHelperText> : ""}
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                border: 'none',
                                            },
                                            "&:hover fieldset": {
                                                border: "none",
                                            },
                                            "&.Mui-focused fieldset": {
                                                border: "none",
                                            },
                                            borderBottom:
                                                "1px solid rgba(0, 0, 0, 0.42)",
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={!!errors.street_name}
                                    id="street_name"
                                    label="Street Name *"
                                    variant="outlined"
                                    name="street_name"
                                    autoComplete="street_name"
                                    value={formData.street_name}
                                    onChange={handleLossLocationChange}
                                    disabled={confirmAddress && !editAddress}
                                    helperText={errors.street_name ? <FormHelperText error>{errors.street_name}</FormHelperText> : ""}
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                border: 'none',
                                            },
                                            '&:hover fieldset': {
                                                border: 'none',
                                            },
                                            '&.Mui-focused fieldset': {
                                                border: 'none',
                                            },
                                            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={!!errors.loss_city}
                                    id="loss_city"
                                    label="Loss City"
                                    variant="outlined"
                                    required
                                    name="loss_city"
                                    autoComplete="loss_city"
                                    value={formData.loss_city}
                                    onChange={handleLossLocationChange}
                                    disabled={confirmAddress && !editAddress}
                                    helperText={errors.loss_city ? <FormHelperText error>{errors.loss_city}</FormHelperText> : ""}
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                border: 'none',
                                            },
                                            '&:hover fieldset': {
                                                border: 'none',
                                            },
                                            '&.Mui-focused fieldset': {
                                                border: 'none',
                                            },
                                            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="standard" sx={{ marginTop: '0.4rem' }} error={!!errors.loss_state}>
                                    <InputLabel id="select-state-label">Loss State *</InputLabel>
                                    <Select
                                        labelId="select-state-label"
                                        id="loss_state"
                                        value={formData.loss_state}
                                        required
                                        name="loss_state"
                                        autoComplete="loss_state"
                                        onChange={handleLossLocationChange}
                                        disabled={confirmAddress && !editAddress}
                                        inputProps={{
                                            sx: {
                                                '&:before': {
                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                                                },
                                                '&:hover:not(.Mui-disabled):before': {
                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
                                                },
                                                '&.Mui-focused:after': {
                                                    borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
                                                },
                                            },
                                        }}
                                        sx={{
                                            '& .MuiSelect-select': { textAlign: 'left' },
                                        }}
                                        MenuProps={{
                                            style: {
                                                maxHeight: 400,
                                            },
                                        }}
                                    >
                                        {states.map((state) => (
                                            <MenuItem key={state.select} value={`${state.select} (${state.value})`}>
                                                {`${state.select} (${state.value})`}
                                            </MenuItem>
                                        ))}
                                        <MenuItem value={formData.loss_state || "null"}>{formData.loss_state || "null"}</MenuItem>
                                        <FormHelperText>{errors.loss_state ? 'Select at most one State' : ''}</FormHelperText>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    error={!!errors.loss_zip}
                                    id="loss_zip"
                                    label="Loss ZIP"
                                    variant="outlined"
                                    required
                                    name="loss_zip"
                                    autoComplete="loss_zip"
                                    value={formData.loss_zip}
                                    onChange={handleLossLocationChange}
                                    disabled={confirmAddress && !editAddress}
                                    helperText={errors.loss_zip ? <FormHelperText error>{errors.loss_zip}</FormHelperText> : ""}
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                border: 'none',
                                            },
                                            '&:hover fieldset': {
                                                border: 'none',
                                            },
                                            '&.Mui-focused fieldset': {
                                                border: 'none',
                                            },
                                            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="standard" sx={{ marginTop: '0.4rem' }} error={!!errors.loss_country}>
                                    <InputLabel id="select-country-label">Loss Country *</InputLabel>
                                    <Select
                                        labelId="select-country-label"
                                        id="loss_country"
                                        value={formData.loss_country}
                                        required
                                        name="loss_country"
                                        onChange={handleLossLocationChange}
                                        disabled={confirmAddress && !editAddress}
                                        inputProps={{
                                            sx: {
                                                '&:before': {
                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                                                },
                                                '&:hover:not(.Mui-disabled):before': {
                                                    borderBottom: '1px solid rgba(0, 0, 0, 0.87)',
                                                },
                                                '&.Mui-focused:after': {
                                                    borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
                                                },
                                            },
                                        }}
                                        sx={{
                                            '& .MuiSelect-select': { textAlign: 'left' },
                                        }}
                                    >
                                        <MenuItem value={"USA"}>USA</MenuItem>
                                        <MenuItem value={formData.loss_country || "null"}>{formData.loss_country || "null"}</MenuItem>
                                        <FormHelperText>{errors.loss_country ? "Select a country" : ""}</FormHelperText>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
                <Box mt={3} display="flex" justifyContent={'space-between'}>
                    <Box >
                        <StyledButtonComponent
                            buttonWidth={100}
                            variant="contained"
                            onClick={onBackCheckValidation}
                            startIcon={<NavigateBeforeIcon />}
                            backgroundColor={localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066"}
                        >
                            Back
                        </StyledButtonComponent>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <StyledButtonComponent
                            buttonWidth={100}
                            variant="outlined"
                            sx={{ mr: 2 }}
                            disableColor={"#CCCCCC"}
                            disabled={!enableReviewButton || isStepAddressValid}
                            onClick={onReviewCheckValidation}
                            backgroundColor={isFormValid() ? (localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066") : "#999999"}
                        >
                            Review
                        </StyledButtonComponent>
                        <StyledButtonComponent
                            buttonWidth={200}
                            variant="outlined"
                            onClick={handleNext}
                            endIcon={<NavigateNextIcon />}
                            disableColor={"#CCCCCC"}
                            disabled={!isFormValid() || !confirmAddress}
                            backgroundColor={isFormValid() ? (localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066") : "#999999"}
                        >
                            Save & Continue
                        </StyledButtonComponent>
                    </Box>
                </Box>
            </Grid>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={10000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Grid>
    )
}

export default LossLocation
