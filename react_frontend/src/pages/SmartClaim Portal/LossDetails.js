import React, { useState, useEffect } from 'react';
import { Grid, Typography, Paper, Box, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import StyledButtonComponent from '../../components/StyledButton';
import { NavigateNext as NavigateNextIcon } from "@mui/icons-material";
dayjs.extend(utc);
dayjs.extend(timezone);

const LossDetails = ({ onNext, formData, setFormData, enableReviewButton, onReviewClick, updateStepValidity, setCheckValidaionName, setValidateError, localCompany, user, ReFormatDateTime, SetReFormatDateTime }) => {
    const [errors, setErrors] = useState({});
    const selectedLocation = 'America/New_York';
    const [selectedDateTime, setSelectedDateTime] = useState(null);

    useEffect(() => {
        if (ReFormatDateTime) {
            setSelectedDateTime(ReFormatDateTime)
        }
    }, [])

    const handleLossDetailsChange = (event) => {
        if (event) {
            const { name, value } = event.target;
            setFormData((prevFormData) => ({
                ...prevFormData,
                lossDetails: {
                    ...prevFormData.lossDetails,
                    [name]: value,
                },
            }));
            validateField(name, value);
        }
        const isValid = isFormValid();
        updateStepValidity(isValid);
    }
    const handleDateTimeChange = (date) => {
        const maxDateTime = dayjs().tz(selectedLocation).startOf('minute');
        if (date) {
            const selectedDate = dayjs(date.$d).tz(selectedLocation).startOf('minute');
            if (selectedDate.isAfter(maxDateTime)) {
                setErrors((prevErrors) => ({ ...prevErrors, loss_date_and_time: 'Date must not be future' }))
                return;
            }
            setSelectedDateTime(date);
            SetReFormatDateTime(date);
            const lossDate = new Date(date.$d);
            const month = String(lossDate.getMonth() + 1).padStart(2, "0");
            const formattedDate =
                lossDate.getFullYear() +
                "/" +
                month +
                "/" +
                lossDate.getDate() +
                " " +
                lossDate.getHours() +
                ":" +
                lossDate.getMinutes() +
                ":" +
                lossDate.getSeconds();
            setFormData(prevFormData => ({
                ...prevFormData,
                lossDetails: {
                    ...prevFormData.lossDetails,
                    loss_date_and_time: formattedDate,
                    datePicker_date_and_time: date,
                },
            }));
            validateField("loss_date_and_time", formattedDate);
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                lossDetails: {
                    ...prevFormData.lossDetails,
                    loss_date_and_time: "",
                }
            }))
        }
        const isValid = isFormValid();
        updateStepValidity(isValid);
    }
    const validateField = (name, value) => {
        const newErrors = { ...errors };
        switch (name) {
            case 'loss_type':
            case 'loss_property':
                if (value === '' || value === null) {
                    newErrors[name] = `${name.replace('loss_', '')} is required.`;
                } else {
                    delete newErrors[name];
                }
                break;
            case 'loss_date_and_time':
                if (!/^\d{4}\/\d{1,2}\/\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2}$/.test(value)) {
                    newErrors[
                        name
                    ] = 'Please select the correct date';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'loss_damage_description':
                if (!/^.{10,500}$/s.test(value)) {
                    newErrors[
                        name
                    ] = 'Description is between 10-500 Characters required';
                } else {
                    delete newErrors[name];
                }
                break;
            default:
                delete newErrors[name];
        }
        setErrors(newErrors);
    };
    const onReviewCheckValidation = () => {
        if (isFormValid()) {
            setCheckValidaionName((prev) => prev.filter((name) => name !== 'Loss Details'));
            onReviewClick();
        }
    }
    const handleNext = () => {
        if (isFormValid()) {
            setCheckValidaionName((prev) => prev.filter((name) => name !== 'Loss Details'));
            onNext("lossDetails", formData);
        } else {
            console.error("Form has errors or missing required fields. Please correct them.");
            setCheckValidaionName((prev) => [...prev, 'Loss Details']);
            setValidateError(true)
        }
    };
    useEffect(() => {
        const isValid = isFormValid();
        updateStepValidity(isValid);
        // eslint-disable-next-line   
    }, [formData, errors]);

    const isFormValid = () => {
        const requiredFields = [
            'loss_date_and_time',
            'loss_type',
            'loss_property',
            'loss_damage_description',
        ];
        for (const field of requiredFields) {
            if (formData[field] === '' || errors[field]) {
                return false;
            }
        }
        return true;
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
                        Loss Details
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
                            <Grid item xs={12}>
                                <FormControl fullWidth >
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            maxDateTime={dayjs().tz(selectedLocation).startOf('minute')}
                                            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                                            label={'Loss date and time *'}
                                            openTo="year"
                                            id="loss_date_and_time"
                                            autoComplete="loss date and time"
                                            value={selectedDateTime}
                                            error={!!errors.loss_date_and_time}
                                            onChange={handleDateTimeChange}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    InputProps={{
                                                        sx: {
                                                            "& .MuiOutlinedInput-root": {
                                                                "& fieldset": {
                                                                    border: "none",
                                                                },
                                                                "&:hover fieldset": {
                                                                    border: "none",
                                                                },
                                                                "&.Mui-focused fieldset": {
                                                                    border: "none",
                                                                },
                                                                borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
                                                            },
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth margin="normal" variant="standard" error={!!errors.loss_type}>
                                            <InputLabel id="select-loss-type">Loss Type *</InputLabel>
                                            <Select
                                                labelId="select-loss-type"
                                                id="loss_type"
                                                value={formData.loss_type}
                                                required
                                                name="loss_type"
                                                autoComplete="loss type"
                                                onChange={handleLossDetailsChange}
                                                helperText={errors.loss_type ? <FormHelperText error>{errors.loss_type}</FormHelperText> : ""}
                                                sx={{
                                                    '& .MuiInput-underline:before': {
                                                        borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
                                                    },
                                                    "& .MuiInput-underline:hover:before":
                                                    {
                                                        borderBottom:
                                                            "1px solid rgba(0, 0, 0, 0.87)",
                                                    },
                                                    "& .MuiInput-underline:after": {
                                                        borderBottom:
                                                            "2px solid rgba(0, 0, 0, 0.87)",
                                                    },
                                                    '& .MuiSelect-select': { textAlign: 'left' },
                                                }}
                                                MenuProps={{
                                                    PaperProps: {
                                                        sx: {
                                                            maxHeight: 200,
                                                        },
                                                    },
                                                }}
                                            >
                                                <MenuItem value={"Flood"}>Flood</MenuItem>
                                                <MenuItem value={"Storm"}>Storm</MenuItem>
                                                <MenuItem value={"Earthquake"}>Earthquake</MenuItem>
                                                <MenuItem value={"Lightning"}>Lightning</MenuItem>
                                                <MenuItem value={"Fire"}>Fire</MenuItem>
                                                <MenuItem value={"Wind"}>Wind</MenuItem>
                                                <MenuItem value={"Theft"}>Theft</MenuItem>
                                                <MenuItem value={"Falling Objects"}>Falling Objects</MenuItem>
                                                <MenuItem value={"Explosion"}>Explosion</MenuItem>
                                                <MenuItem value={"Vandalism"}>Vandalism</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth margin="normal" variant="standard" error={!!errors.loss_property}>
                                    <InputLabel id="select-loss-property">Insured Property Address *</InputLabel>
                                    <Select
                                        labelId="select-loss-property"
                                        id="loss_property"
                                        value={formData.loss_property}
                                        required
                                        name="loss_property"
                                        onChange={handleLossDetailsChange}
                                        helperText={errors.loss_property ? <FormHelperText error>{errors.loss_property}</FormHelperText> : ""}
                                        inputProps={{
                                            sx: {
                                                "&:before": {
                                                    borderBottom:
                                                        "1px solid rgba(0, 0, 0, 0.42)",
                                                },
                                                "&:hover:not(.Mui-disabled):before": {
                                                    borderBottom:
                                                        "1px solid rgba(0, 0, 0, 0.87)",
                                                },
                                                "&.Mui-focused:after": {
                                                    borderBottom:
                                                        "2px solid rgba(0, 0, 0, 0.87)",
                                                },
                                            },
                                        }}
                                        sx={{
                                            '& .MuiSelect-select': { textAlign: 'left' },
                                        }}
                                    >
                                        <MenuItem value={user.pro_address1 + ",  " + user.pro_city + ",  " + user.pro_state + ",  " + user.pro_country + ",  " + user.pro_zip + "."}>
                                            {user.pro_address1 + ",  " + user.pro_city + ",  " + user.pro_state + ",  " + user.pro_country + ",  " + user.pro_zip + "."}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.loss_damage_description}
                                    id="loss_damage_description"
                                    variant="outlined"
                                    required
                                    name="loss_damage_description"
                                    autoComplete="loss_damage_description"
                                    value={formData.loss_damage_description}
                                    onChange={handleLossDetailsChange}
                                    label="Loss Damage Description"
                                    multiline
                                    rows={3}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            paddingLeft: 0,
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
                                        '& .MuiInputLabel-root': {
                                            textAlign: 'left',
                                            width: '100%',
                                            transform: 'translate(0, -50%) scale(1)',
                                            left: 0,
                                        },
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                        sx: {
                                            textAlign: 'left',
                                            transformOrigin: 'top left',
                                            left: 0,
                                        },
                                    }}
                                    InputProps={{
                                        sx: {
                                            paddingLeft: 0,
                                            '& textarea': {
                                                textAlign: 'left',
                                            },
                                        },
                                    }}
                                    helperText={
                                        errors.loss_damage_description
                                            ? 'Description is between 10-500 Characters required'
                                            : ''
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
                <Box sx={{ textAlign: 'right', mt: 2 }}>
                    <StyledButtonComponent
                        buttonWidth={100}
                        variant="outlined"
                        sx={{ mr: 2 }}
                        disableColor={"#CCCCCC"}
                        disabled={!enableReviewButton}
                        onClick={onReviewCheckValidation}
                        backgroundColor={enableReviewButton ? (localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066") : "#999999"}
                    >
                        Review
                    </StyledButtonComponent>
                    <StyledButtonComponent
                        buttonWidth={200}
                        variant="outlined"
                        onClick={handleNext}
                        endIcon={<NavigateNextIcon />}
                        disableColor={"#CCCCCC"}
                        disabled={!isFormValid()}
                        backgroundColor={isFormValid() ? (localCompany.ic_primary_color ? localCompany.ic_primary_color : "#010066") : "#999999"}
                    >
                        Save & Continue
                    </StyledButtonComponent>
                </Box>
            </Grid>
        </Grid>
    )
}

export default LossDetails