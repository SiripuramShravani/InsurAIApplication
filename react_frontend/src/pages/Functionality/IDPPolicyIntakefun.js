import {
    Grid, useTheme,
    useMediaQuery, Typography, Box, Card, CardContent, CircularProgress, IconButton,
    Tooltip, TextField, Backdrop, Snackbar, Checkbox,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef, useCallback } from "react";
import FileUpload from '../../components/FileUploadExtra.js';
import StyledButtonComponent from '../../components/StyledButton';
import processclaim from "../../assets/processclaim.png";
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    Edit as EditIcon,
    CheckCircle as ValidateIcon,
    Warning as WarningIcon,
    Save as SaveIcon,
} from "@mui/icons-material";
import MuiAlert from '@mui/material/Alert';
import { Radio, FormControlLabel, RadioGroup } from "@mui/material";
import useNetworkStatus from '../../components/ErrorPages/UseNetworkStatus.js';
import PreviewError from "../../components/ErrorPages/PreviewError.js";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initialValues = {
    PolicyInfo: {
        selectedPolicy: "",
        policy_holder_FirstName: "",
        policy_holder_LastName: "",
        policy_holder_street_number: null,
        policy_holder_street_name: "",
        policy_holder_city: "",
        policy_holder_state: "",
        policy_holder_country: "USA",
        policy_holder_zip: null,
        policy_holder_mobile: null,
        policy_holder_email: "",
        policy_holder_occupation: "",
        policy_holder_ssn: "",
        validated_address: ""
    },
    PropertyInfo: {
        residenceType: "",
        constructionType: "",
        yearBuilt: null,
        numberOfStories: null,
        squareFootage: null,
        heatingType: "",
        plumbing_installed_year: null,
        wiring_installed_year: null,
        heating_installed_year: null,
        roof_installed_year: null,
        fireHydrantDistance: null,
        fireStationDistance: null,
        alternateHeating: "",
        any_business_conducted_on_premises: "",
        trampolineRamp: "",
        subjectToFlood: "",
        floodInsuranceRequested: "",
        rentedToOthers: "",
        CoverageLocation_street_number: null,
        CoverageLocation_street_name: "",
        CoverageLocation_city: "",
        CoverageLocation_state: "",
        CoverageLocation_zip: null,
        CoverageLocation_country: "USA",
        additionalInfo: "",
        validated_address: ""
    },
    AdditionalInfo: {
        currentInsuranceCarrier: "",
        currentPolicy: "",
        effectiveDate: "",
        current_policy_premium: null,
        anyLossLast4Years: "",
        mortgageeName: "",
        mortgageeStreetNumber: null,
        mortgageeStreetName: "",
        mortgageeCity: "",
        mortgageeState: "",
        mortgageeCountry: "USA",
        mortgageeZip: null,
        mortgageeInstallmentAmount: null
    },
    Coverages: {
        dwellingCoverage: null,
        personalProperty: null,
        personalLiabilityCoverage: null,
        medicalPayments: null,
        deductible: null
    }
};

const IDPPolicyIntakefun = () => {
    const UploadDocument = useRef(null)
    /* eslint-disable no-unused-vars */
    const [selectedPolicyProcessFile, setSelectedPolicyProcessFile] = useState([]);
    const [queryvalues, setQueryvalues] = useState(initialValues);
    const [fileContent, setFileContent] = useState("");
    const [fileType, setFileType] = useState("");
    const [fileName, setFileName] = useState("");
    const [fileObjectURL, setFileObjectURL] = useState("");
    const [filePreview, setFilePreview] = useState(null);
    const [openFileView, setOpenFileView] = useState(false);
    const [afterProcess, setAfterProcess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [displayValues, setDisplayValues] = useState({});
    const [enableFields, setEnableFields] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [updateDisplay, setUpdateDisplay] = useState(false);
    const [filesUploadedInChild, setFilesUploadedInChild] = useState(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const [uploadIn, setUploadIn] = useState("portal");
    const [loader, setLoader] = useState(false);
    const TheamMedia = useTheme();
    const isMobile = useMediaQuery(TheamMedia.breakpoints.down("sm"));
    const [processSubmit, setProcessSubmit] = useState(false);
    const navigate = useNavigate();
    const [validatingAddress, setValidatingAddress] = useState(false);
    const [addressValidated, setAddressValidated] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [suggestedAddress, setSuggestedAddress] = useState(null);
    const [spittedAddress, setSpittedAddress] = useState(null);
    const [showAddress, setShowAddress] = useState(false);
    const [validatedAddressKey, setValidatedAddressKey] = useState("");
    const [policyHolderAddressValidation, setPolicyHolderAddressValidation] = useState("");
    const [propertyAddressValidation, setPropertyAddressValidation] = useState("");
    const [editingAddress, setEditingAddress] = useState(false);
    const [editingPolicyholderAddress, setEditingPolicyholderAddress] = useState(false);
    const [showRequiredMessage, setShowRequiredMessage] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [initialCoverageLocationAddress, setInitialCoverageLocationAddress] = useState("");
    const [sameAsPolicyHolderAddress, setSameAsPolicyHolderAddress] = useState(false);
    const [accuracy, setAccuracy] = useState(0);
    const [snackbarOpen1, setSnackbarOpen1] = useState(false);
    const snackbarTimeoutRef = React.useRef(null);
    const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_URL,
        withCredentials: true
    });

    const displayFile = (file) => {
        if (file.type === "application/pdf") {
            const reader = new FileReader();
            reader.onload = function (e) {
                setFileContent(e.target.result);
                setFileType(file.type);
                setFileName(file.name);
                setFileObjectURL(null);
                setFilePreview(URL.createObjectURL(file));
                setOpenFileView(true);
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith("image/")) {
            setFileContent(null);
            setFileType(file.type);
            setFileName(file.name);

            setFilePreview(URL.createObjectURL(file));
            setOpenFileView(true);
        }
    };

    const handleFilesUploadByIDPPolicyIntake = (selectedFiles, previews) => {
        setSelectedPolicyProcessFile(selectedFiles);
        setQueryvalues((prevValue) => ({ ...prevValue, claim_process_document_name: selectedFiles[0].name }));
        displayFile(selectedFiles[0]);
    }
    const handlePolicyProcessFileRemove = () => {
        setQueryvalues(initialValues);
        setAfterProcess(false);
        setSelectedPolicyProcessFile([]);
        setDisplayValues({});
        setErrorMessage("");
        setEnableFields(false)
        setIsSaved(false)
        setUpdateDisplay(false)
        setFilePreview(null);
        setSuggestedAddress(null);
        setSpittedAddress(null);
        setShowAddress(false);
        setAddressValidated(false);
        setValidationError(null);
        setShowRequiredMessage(false);
    };

    const handleUploadProcessDocument = async () => {
        setLoader(true);
        setErrorMessage("");
        try {
            const file = selectedPolicyProcessFile[0];
            const formData = new FormData();
            formData.append('file', file);
            const responseData = await getExtractedDocumentJson(formData);
            if (responseData && responseData.accuracy) {
                setAccuracy(responseData.accuracy);
            }
            if (responseData) {
                const extractedResponseData = responseData.extracted_text;
                setQueryvalues({
                    ...initialValues,
                    ...extractedResponseData,
                    PolicyInfo: {
                        ...initialValues.PolicyInfo,
                        ...extractedResponseData.PolicyInfo
                    },
                    PropertyInfo: {
                        ...initialValues.PropertyInfo,
                        ...extractedResponseData.PropertyInfo
                    },
                    AdditionalInfo: {
                        ...initialValues.AdditionalInfo,
                        ...extractedResponseData.AdditionalInfo
                    },
                    Coverages: {
                        ...initialValues.Coverages,
                        ...extractedResponseData.Coverages
                    }
                });
                if (extractedResponseData.PolicyInfo.validated_address === "Address Not validated") {
                    setPolicyHolderAddressValidation(null)
                }
                if (extractedResponseData.PropertyInfo.validated_address === "Address Not validated") {
                    setPropertyAddressValidation(null)
                }
                const displayExtractedData = mapResponseToDisplayFields(extractedResponseData);
                setDisplayValues(displayExtractedData);
                setInitialCoverageLocationAddress(displayExtractedData.PropertyInfo["Coverage Location Address"])
                setAfterProcess(true);
                setLoader(false);
            } else {
                console.error("API request did not return expected data.");
                setLoader(false);
            }
        } catch (error) {
            console.error("Error during file upload:", error);
            setLoader(false);
        }
    };

    const handleNetworkError = useCallback((path) => {
        navigate(path);
    }, [navigate]);

    const { setNetworkError, SnackbarComponent } = useNetworkStatus({}, handleNetworkError);
    const getExtractedDocumentJson = async (formData) => {
        snackbarTimeoutRef.current = setTimeout(() => {
            setSnackbarOpen1(true);
        }, 1000);
        try {
            setLoader(true);
            const response = await axiosInstance.post(
                "Policy/idp_policy_intake/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            clearTimeout(snackbarTimeoutRef.current);
            setSnackbarOpen1(false);
            setAccuracy(response.data.accuracy);
            if (response.data.image) {
                const imagesData = response.data.image;
                let combined_extracted_text = "";
                let gemini_all_input_token = 0;
                let gemini_all_output_tokens = 0;
                let gemini_all_total_tokens = 0;

                for (let i = 0; i < imagesData.length; i++) {
                    const base64Image = imagesData[i];
                    const prompt = `
                        Extract the following details from the insurance quote image:                      
                        Selected Policy: The type or ID of the selected insurance policy.
                        Policyholder First Name: The first name of the policyholder.
                        Policyholder Last Name: The last name of the policyholder.
                        Policyholder Street Number: The street number of the policyholder’s address.
                        Policyholder Street Name: The street name of the policyholder’s address.
                        Policyholder City: The city of the policyholder’s address.
                        Policyholder State: The state of the policyholder’s address.
                        Policyholder Country: The country of the policyholder’s address.
                        Policyholder Zip Code: The zip code of the policyholder’s address.
                        Policyholder Mobile Number: The mobile phone number of the policyholder.
                        Policyholder Email Address: The email address of the policyholder.
                        Policyholder Occupation: The occupation of the policyholder.
                        Policyholder Social Security Number: The Social Security Number (SSN) of the policyholder.
                        Residence Type: The type of residence, such as single-family home, apartment, etc.
                        Construction Type: The construction style or material used for the property (e.g., wood, brick).
                        Year Built: The year the property was constructed.
                        Number of Stories: The number of stories or floors in the property.
                        Square Footage: The total area of the property, typically measured in square feet.
                        Heating Type: The type of heating system used in the property (e.g., central heating, electric).
                        Plumbing Installed Year: The year the plumbing system was installed or last updated.
                        Wiring Installed Year: The year the electrical wiring was installed or last updated.
                        Heating Installed Year: The year the heating system was installed or last updated.
                        Roof Installed Year: The year the roof was installed or last updated.
                        Fire Hydrant Distance: The distance from the property to the nearest fire hydrant.
                        Fire Station Distance: The distance from the property to the nearest fire station.
                        Alternate Heating: Any secondary or backup heating system installed in the property.
                        Business Conducted on Premises: Indicates whether any business activities are conducted at the property.
                        Trampoline Ramp: Whether a trampoline ramp is present on the property.
                        Subject to Flood: Indicates whether the property is in a flood-prone area.
                        Flood Insurance Requested: Whether the property owner has requested flood insurance.
                        Rented to Others: Indicates whether the property is rented to others.
                        Coverage Location Street Number: The street number of the property being insured.
                        Coverage Location Street Name: The street name of the property being insured.
                        Coverage Location City: The city of the property being insured.
                        Coverage Location State: The state of the property being insured.
                        Coverage Location Zip Code: The zip code of the property being insured.
                        Coverage Location Country: The country of the property being insured.
                        Additional Information: Any other relevant information related to the property.
                        Current Insurance Carrier: The name of the insurance company currently providing coverage.
                        Current Policy: The policy number of the current insurance coverage.
                        Effective Date: The date when the current insurance policy became effective.
                        Current Policy Premium: The premium amount for the current insurance policy.
                        Any Loss in the Last 4 Years: A record of any claims or losses filed in the past four years.
                        Mortgagee Name: The name of the entity or person holding the mortgage on the property.
                        Mortgagee Street Number: The street number of the mortgagee’s address.
                        Mortgagee Street Name: The street name of the mortgagee’s address.
                        Mortgagee City: The city of the mortgagee’s address.
                        Mortgagee State: The state of the mortgagee’s address.
                        Mortgagee Country: The country of the mortgagee’s address.
                        Mortgagee Zip Code: The zip code of the mortgagee’s address.
                        Mortgagee Installment Amount: The amount of each installment payment due on the mortgage.
                        Dwelling Coverage: The amount of insurance coverage for the dwelling or structure of the property.
                        Personal Property Coverage: The amount of insurance coverage for personal belongings in the property.
                        Personal Liability Coverage: The amount of insurance coverage for personal liability in the event of an accident or lawsuit.
                        Medical Payments: The amount of insurance coverage for medical expenses in case of injury on the property.
                        Deductible: The amount that the policyholder must pay out-of-pocket before insurance coverage kicks in.

                        Please provide each piece of information in a key: value format. If any detail is missing, replace with "Not found."
                    `;

                    try {
                        const result = await model.generateContent([
                            prompt,
                            {
                                inlineData: {
                                    data: base64Image,
                                    mimeType: "image/png",
                                },
                            },
                        ]);

                        const geminiText = await result.response.text();
                        combined_extracted_text += geminiText;

                        gemini_all_input_token += result.response.usageMetadata?.promptTokenCount || 0;
                        gemini_all_output_tokens += result.response.usageMetadata?.candidatesTokenCount || 0;
                        gemini_all_total_tokens += result.response.usageMetadata?.totalTokenCount || 0;
                    } catch (geminiError) {
                        console.error(`Error processing image ${i + 1}:`, geminiError);
                    }
                }
                const formDataPayload = new FormData();
                formDataPayload.append(
                    "combined_extracted_text",
                    combined_extracted_text
                );
                formDataPayload.append(
                    "gemini_all_input_token",
                    gemini_all_input_token
                );
                formDataPayload.append(
                    "gemini_all_output_tokens",
                    gemini_all_output_tokens
                );
                formDataPayload.append(
                    "gemini_all_total_tokens",
                    gemini_all_total_tokens
                );
                formDataPayload.append("file_name", formData.get("file").name);

                const combinedResponse = await axiosInstance.post(
                    "Policy/idp_policy_intake/",
                    formDataPayload,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                clearTimeout(snackbarTimeoutRef.current);
                setSnackbarOpen1(false);
                if (combinedResponse && combinedResponse.data) {
                    const extractedResponseData = combinedResponse.data.extracted_text;
                    if (extractedResponseData.PolicyInfo.validated_address === "Address Not validated") {
                        setPolicyHolderAddressValidation(null);
                    }
                    if (extractedResponseData.PropertyInfo.validated_address === "Address Not validated") {
                        setPropertyAddressValidation(null);
                    }
                    return combinedResponse.data;
                } else {
                    console.error("No valid data extracted from images");
                    alert(
                        "Unable to extract information from the provided images. Please try again or contact support."
                    );
                }
            } else {
                console.error("No image data in the response");
                return response.data;
            }
            setLoader(false);
        } catch (error) {
            setLoader(false);
            console.error("error in policy", error);
            clearTimeout(snackbarTimeoutRef.current);
            setSnackbarOpen1(false);
            if (error.response) {
                const { status } = error.response;
                const errorMessage =
                    error.response.data.message ||
                    "A server error occurred. Please try again later.";
                const errorSource = error.response.data.api || "Unknown source";
                const userName = localStorage.getItem("userName");
                const file = formData.get("file");
                const fileName = file ? file.name : "No file uploaded";
                const fileType = file ? file.type : "Unknown type";
                setNetworkError({
                    errorMessage: errorMessage,
                    errorSource: errorSource,
                    username: userName,
                    fileName: fileName,
                    fileType: fileType,
                    status: status,
                });
            } else {
                setErrorMessage(error.message || "An unexpected error occurred.");
            }
            return null;
        }
    };

    const ConvertAddressIntoOneString = (StreetNumber, StreetName, City, State, Zip, Country) => {
        let address = "";
        if (StreetNumber) address += StreetNumber + " ";
        if (StreetName) address += StreetName + " ";
        if (City) address += City + " ";
        if (State) address += State + " ";
        if (Country) address += Country + " ";
        if (Zip) address += Zip;
        return address.trim();
    };

    const mapResponseToDisplayFields = (extractedResponseData) => {
        return {
            PolicyInfo: {
                "Selected Policy Type": extractedResponseData.PolicyInfo.selectedPolicy,
                "Social Security Number": extractedResponseData.PolicyInfo.policy_holder_ssn,
                "First Name": extractedResponseData.PolicyInfo.policy_holder_FirstName,
                "Last Name": extractedResponseData.PolicyInfo.policy_holder_LastName,
                "Mobile Number": extractedResponseData.PolicyInfo.policy_holder_mobile,
                "Email Address": extractedResponseData.PolicyInfo.policy_holder_email,
                "Occupation": extractedResponseData.PolicyInfo.policy_holder_occupation,
                "Policy Holder Address": ConvertAddressIntoOneString(
                    extractedResponseData.PolicyInfo.policy_holder_street_number,
                    extractedResponseData.PolicyInfo.policy_holder_street_name, extractedResponseData.PolicyInfo.policy_holder_city,
                    extractedResponseData.PolicyInfo.policy_holder_state, extractedResponseData.PolicyInfo.policy_holder_zip,
                    extractedResponseData.PolicyInfo.policy_holder_country
                ),
            },
            PropertyInfo: {
                "Residence Type": extractedResponseData.PropertyInfo.residenceType,
                "Construction Type": extractedResponseData.PropertyInfo.constructionType,
                "Year Built": extractedResponseData.PropertyInfo.yearBuilt,
                "Number of Stories": extractedResponseData.PropertyInfo.numberOfStories,
                "Square Footage": extractedResponseData.PropertyInfo.squareFootage,
                "Heating Type": extractedResponseData.PropertyInfo.heatingType,
                "Year Plumbing System Installed/Last Upgraded": extractedResponseData.PropertyInfo.plumbing_installed_year,
                "Year Wiring System Installed/Last Upgraded": extractedResponseData.PropertyInfo.wiring_installed_year,
                "Year Heating System Installed/Last Upgraded": extractedResponseData.PropertyInfo.heating_installed_year,
                "Year Roof System Installed/Last Upgraded": extractedResponseData.PropertyInfo.roof_installed_year,
                "Fire Hydrant Distance (in feets)": extractedResponseData.PropertyInfo.fireHydrantDistance,
                "Fire Station Distance (in miles)": extractedResponseData.PropertyInfo.fireStationDistance,
                "Alternate Heating?": extractedResponseData.PropertyInfo.alternateHeating,
                "Any Business Conducted On Premises?": extractedResponseData.PropertyInfo.any_business_conducted_on_premises,
                "Trampoline or Skateboard/Bicycle Ramp?": extractedResponseData.PropertyInfo.trampolineRamp,
                "Subject to Flood, Wave Wash, Windstorm or Seacoast?": extractedResponseData.PropertyInfo.subjectToFlood,
                "Flood Insurance Requested?": extractedResponseData.PropertyInfo.floodInsuranceRequested,
                "Rented to Others?": extractedResponseData.PropertyInfo.rentedToOthers,
                "Additional Information": extractedResponseData.PropertyInfo.additionalInfo,
                "Coverage Location Address": ConvertAddressIntoOneString(
                    extractedResponseData.PropertyInfo.CoverageLocation_street_number,
                    extractedResponseData.PropertyInfo.CoverageLocation_street_name,
                    extractedResponseData.PropertyInfo.CoverageLocation_city,
                    extractedResponseData.PropertyInfo.CoverageLocation_state,
                    extractedResponseData.PropertyInfo.CoverageLocation_zip,
                    extractedResponseData.PropertyInfo.CoverageLocation_country,
                )
            },
            AdditionalInfo: {
                "Current Insurance Carrier": extractedResponseData.AdditionalInfo.currentInsuranceCarrier,
                "Current Policy Number": extractedResponseData.AdditionalInfo.currentPolicy,
                "Current Policy Effective Date": extractedResponseData.AdditionalInfo.effectiveDate,
                "Current Policy Premium ($)": extractedResponseData.AdditionalInfo.current_policy_premium,
                "Loss in Last 4 Years": extractedResponseData.AdditionalInfo.anyLossLast4Years,
                "Mortgagee Name": extractedResponseData.AdditionalInfo.mortgageeName,
                "Installment Amount ($)": extractedResponseData.AdditionalInfo.mortgageeInstallmentAmount,
                "Mortgagee Address": ConvertAddressIntoOneString(
                    extractedResponseData.AdditionalInfo.mortgageeStreetNumber,
                    extractedResponseData.AdditionalInfo.mortgageeStreetName,
                    extractedResponseData.AdditionalInfo.mortgageeCity,
                    extractedResponseData.AdditionalInfo.mortgageeState,
                    extractedResponseData.AdditionalInfo.mortgageeCountry,
                    extractedResponseData.AdditionalInfo.mortgageeZip,
                )
            },
            Coverages: {
                "Dwelling Coverage ($)": extractedResponseData.Coverages.dwellingCoverage,
                "Personal Property Coverage ($)": extractedResponseData.Coverages.personalProperty,
                "Personal Liability Coverage ($)": extractedResponseData.Coverages.personalLiabilityCoverage,
                "Medical Payments Coverage ($)": extractedResponseData.Coverages.medicalPayments,
                "Deductible ($)": extractedResponseData.Coverages.deductible
            },
        };
    };

    const handleInputChange = (field, value, section) => {
        if ((section === "PropertyInfo" && field === "Coverage Location Address") || (section === "PolicyInfo" && field === "Policy Holder Address")) {
            setSuggestedAddress(null);
        }
        // 1. Update displayValues
        setDisplayValues((prevValues) => {
            const updatedSection = { ...prevValues[section] };
            updatedSection[field] = value;
            return {
                ...prevValues,
                [section]: updatedSection,
            };
        });
        // 2. Get the correct queryvalues key using the helper function
        const queryKey = getQueryvaluesKey(section, field);
        // 3. Update queryvalues (similarly to displayValues)
        setQueryvalues((prevValues) => {
            const updatedSection = { ...prevValues[section] };
            updatedSection[queryKey] = value;
            return {
                ...prevValues,
                [section]: updatedSection,
            };
        });
    };

    const getQueryvaluesKey = (section, field) => {
        const mapping = {
            PolicyInfo: {
                "Selected Policy Type": "selectedPolicy",
                "Social Security Number": "policy_holder_ssn",
                "First Name": "policy_holder_FirstName",
                "Last Name": "policy_holder_LastName",
                "Mobile Number": "policy_holder_mobile",
                "Email Address": "policy_holder_email",
                "Occupation": "policy_holder_occupation",
                "Street Number": "policy_holder_street_number",
                "Street Name": "policy_holder_street_name",
                "City": "policy_holder_city",
                "State": "policy_holder_state",
                "Zip Code": "policy_holder_zip",
                "Country": "policy_holder_country",
                "Validated Address": "validated_address"
            },
            PropertyInfo: {
                "Residence Type": "residenceType",
                "Construction Type": "constructionType",
                "Year Built": "yearBuilt",
                "Number of Stories": "numberOfStories",
                "Square Footage": "squareFootage",
                "Heating Type": "heatingType",
                "Year Plumbing System Installed/Last Upgraded": "plumbing_installed_year",
                "Year Wiring System Installed/Last Upgraded": "wiring_installed_year",
                "Year Heating System Installed/Last Upgraded": "heating_installed_year",
                "Year Roof System Installed/Last Upgraded": "roof_installed_year",
                "Fire Hydrant Distance (in feets)": "fireHydrantDistance",
                "Fire Station Distance (in miles)": "fireStationDistance",
                "Alternate Heating?": "alternateHeating",
                "Any Business Conducted On Premises?": "any_business_conducted_on_premises",
                "Trampoline or Skateboard/Bicycle Ramp?": "trampolineRamp",
                "Subject to Flood, Wave Wash, Windstorm or Seacoast?": "subjectToFlood",
                "Flood Insurance Requested?": "floodInsuranceRequested",
                "Rented to Others?": "rentedToOthers",
                "Additional Information": "additionalInfo",
                "Coverage Location Street Number": "CoverageLocation_street_number",
                "Coverage Location Street Name": "CoverageLocation_street_name",
                "Coverage Location City": "CoverageLocation_city",
                "Coverage Location State": "CoverageLocation_state",
                "Coverage Location Zip": "CoverageLocation_zip",
                "Coverage Location Country": "CoverageLocation_country",
                "Validated Property Address": "validated_address"
            },
            AdditionalInfo: {
                "Current Insurance Carrier": "currentInsuranceCarrier",
                "Current Policy Number": "currentPolicy",
                "Current Policy Effective Date": "effectiveDate",
                "Current Policy Premium ($)": "current_policy_premium",
                "Loss in Last 4 Years": "anyLossLast4Years",
                "Mortgagee Name": "mortgageeName",
                "Installment Amount ($)": "mortgageeInstallmentAmount",
                "Mortgagee Street Number": "mortgageeStreetNumber",
                "Mortgagee Street Name": "mortgageeStreetName",
                "Mortgagee City": "mortgageeCity",
                "Mortgagee State": "mortgageeState",
                "Mortgagee Country": "mortgageeCountry",
                "Mortgagee Zip": "mortgageeZip"
            },
            Coverages: {
                "Dwelling Coverage ($)": "dwellingCoverage",
                "Personal Property Coverage ($)": "personalProperty",
                "Personal Liability Coverage ($)": "personalLiabilityCoverage",
                "Medical Payments Coverage ($)": "medicalPayments",
                "Deductible ($)": "deductible"
            }
        };
        return mapping[section]?.[field];
    };

    const handleSave = (sectionName) => {
        setEnableFields(false);
        setShowAddress(false);
        handleEditSection(sectionName);
    };

    const handleExtractClaimSubmit = async (displayValues, queryvalues) => {
        setProcessSubmit(true)
        if (queryvalues.AdditionalInfo.mortgageeStreetNumber === "") {
            queryvalues.AdditionalInfo.mortgageeStreetNumber = null;
        }
        // IC ID list
        const icIdList = ["IC001001", "IC001002", "IC001003", "IC001004", "IC001005", "IC001006"];
        const randomIndex = Math.floor(Math.random() * icIdList.length);
        const randomIcId = icIdList[randomIndex];

        const policyData = {
            PolicyInfo: {
                ...queryvalues.PolicyInfo,
                policy_from_channel: "DocAI Quote",
                policy_associated_ic_id: randomIcId,
            },
            PropertyInfo: queryvalues.PropertyInfo,
            AdditionalInfo: queryvalues.AdditionalInfo,
            Coverages: queryvalues.Coverages,
        };
        const userEmail = localStorage.getItem("userName");
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('policy_data', JSON.stringify(policyData));
            formDataToSend.append('email', userEmail || '');
            formDataToSend.append('file', selectedPolicyProcessFile[0]);

            const response = await axiosInstance.post('Policy/policy_creation/',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if (response.status === 201) {
                setProcessSubmit(false);
                navigate('/quotesuccess', { state: { PolicyIntakeAfterSubmitDetails: JSON.stringify(response.data) } });
                setSelectedPolicyProcessFile([]);
                setQueryvalues(initialValues);
                setDisplayValues({})
                localStorage.setItem('PolicyIntakeAfterSubmitDetails', JSON.stringify(response.data));
                setSnackbarMessage('Quote created successfully!');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                setTimeout(() => {
                    navigate('/quotesuccess', { state: { PolicyIntakeAfterSubmitDetails: JSON.stringify(response.data) } });
                }, 1500);
            } else {
                console.error('Error submitting data:', response.status);
                handleAPIError('Error creating policy. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            handleAPIError('An error occurred. Please try again later.');
        } finally {
            setProcessSubmit(false);
        }
    };

    const handleAPIError = (message) => {
        setSnackbarMessage(message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false)
        setOpenSnackbar(false)
        setSnackbarOpen1(false)
    };



    const handleValidateAddress = async (key, sectionName) => {
        setValidatingAddress(true);
        setAddressValidated(false);
        const addressToValidate = displayValues[sectionName][key];
        try {
            const response = await axiosInstance.post(
                'validate_address/',
                {
                    address: addressToValidate,
                }
            );
            if (response.data.validated_address && response.data.splitted_address) {
                setSuggestedAddress(response.data.validated_address);
                setSpittedAddress(response.data.splitted_address);
                setShowAddress(true);
                setAddressValidated(true);
                setValidationError(null);
                setValidatedAddressKey(key);
            } else {
                setAddressValidated(false);
                if (key === "Coverage Location Address") {
                    setPropertyAddressValidation(null);
                }
                if (key === "Policy Holder Address") {
                    setPolicyHolderAddressValidation(null);
                }
                setValidationError(
                    "Address is not valid. Please check your address."
                );
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error("Address validation error:", error);
            setAddressValidated(false);
            if (key === "Coverage Location Address") {
                setPropertyAddressValidation(null);
            }
            if (key === "Policy Holder Address") {
                setPolicyHolderAddressValidation(null);
            }
            setValidationError(`${error.response.data.error} Please Check you Address again` ||
                "An error occurred during validation. Please try again later."
            );
            setOpenSnackbar(true);
        } finally {
            setValidatingAddress(false);
        }
    };

    const handleConfirmAddress = (spittedAddress, key) => {
        if (key === "Policy Holder Address") {
            setQueryvalues((prevQueryvalues) => ({
                ...prevQueryvalues,
                PolicyInfo: {
                    ...prevQueryvalues.PolicyInfo,
                    policy_holder_street_number: spittedAddress.street_number || '',
                    policy_holder_street_name: spittedAddress.street_name || '',
                    policy_holder_city: spittedAddress.city || '',
                    policy_holder_state: spittedAddress.state || '',
                    policy_holder_zip: spittedAddress.zip_code || '',
                    policy_holder_country: spittedAddress.country || '',
                    validated_address: suggestedAddress
                }
            }));
            setDisplayValues((prevDisplayValues) => ({
                ...prevDisplayValues,
                PolicyInfo: {
                    ...prevDisplayValues.PolicyInfo,
                    "Policy Holder Address": suggestedAddress,
                }
            }));
            setPolicyHolderAddressValidation("");
            setEditingPolicyholderAddress(false)
        } else if (key === "Coverage Location Address") {
            setQueryvalues((prevQueryvalues) => ({
                ...prevQueryvalues,
                PropertyInfo: {
                    ...prevQueryvalues.PropertyInfo,
                    CoverageLocation_street_number: spittedAddress.street_number || '',
                    CoverageLocation_street_name: spittedAddress.street_name || '',
                    CoverageLocation_city: spittedAddress.city || '',
                    CoverageLocation_state: spittedAddress.state || '',
                    CoverageLocation_zip: spittedAddress.zip_code || '',
                    CoverageLocation_country: spittedAddress.country || '',
                    validated_address: suggestedAddress || queryvalues.PolicyInfo.validated_address
                }
            }));
            setDisplayValues((prevDisplayValues) => ({
                ...prevDisplayValues,
                PropertyInfo: {
                    ...prevDisplayValues.PropertyInfo,
                    "Coverage Location Address": suggestedAddress || displayValues.PolicyInfo["Policy Holder Address"],
                }
            }));
            setPropertyAddressValidation("");
            setEditingAddress(false);
        }
        setAddressValidated(true);
        setShowAddress(false);
    };
    const restrictedFields = [
        "Policy Holder Address",
        "Coverage Location Address",
    ];

    const [editingSection, setEditingSection] = useState({
        PolicyInfo: false,
        PropertyInfo: false,
        AdditionalInfo: false,
        Coverages: false
    });

    const handleEditSection = (sectionName) => {
        setEditingSection((prevEditingSection) => ({
            ...prevEditingSection,
            [sectionName]: !prevEditingSection[sectionName]
        }));
        if (sectionName === "PropertyInfo") {
            setEditingAddress(false);
            setSuggestedAddress(null);
        }
        if (sectionName === "PolicyInfo") {
            setEditingPolicyholderAddress(false);
            setSuggestedAddress(null);
        }
    };

    const checkForEmptyOrInvalidFields = () => {
        // 1. Filter out "Additional Information" from PropertyInfo in displayValues
        const displayValuesWithoutAdditionalInfo = {
            ...displayValues,
            PropertyInfo: Object.fromEntries(
                Object.entries(displayValues.PropertyInfo).filter(
                    ([key, _]) => key !== "Additional Information"
                )
            )
        };
        // 2. Remove Mortgagee Address if it has no value
        if (!displayValues.AdditionalInfo["Mortgagee Address"]) {
            delete displayValuesWithoutAdditionalInfo.AdditionalInfo["Mortgagee Address"];
        }
        // 2. Check for empty or invalid values in all sections
        const hasEmptyDisplayValues = Object.values(displayValuesWithoutAdditionalInfo).some(
            (section) => Object.values(section).some((value) => !value)
        );
        // 3. Filter out "additionalInfo" from PropertyInfo in queryvalues
        const queryvaluesWithoutAdditionalInfo = {
            ...queryvalues,
            PropertyInfo: Object.fromEntries(
                Object.entries(queryvalues.PropertyInfo).filter(
                    ([key, _]) => key !== "additionalInfo"
                )
            )
        };
        // 4. Check for empty or invalid address values in queryvalues
        const policyHolderAddressInvalid =
            !queryvaluesWithoutAdditionalInfo.PolicyInfo.validated_address ||
            queryvaluesWithoutAdditionalInfo.PolicyInfo.validated_address === "Address Not validated";

        const coverageLocationAddressInvalid =
            !queryvaluesWithoutAdditionalInfo.PropertyInfo.validated_address ||
            queryvaluesWithoutAdditionalInfo.PropertyInfo.validated_address === "Address Not validated";
        // 5. Combine the results
        return (
            hasEmptyDisplayValues ||
            policyHolderAddressInvalid ||
            coverageLocationAddressInvalid
        );
    };

    useEffect(() => {
        if (afterProcess) {
            const hasErrors = checkForEmptyOrInvalidFields();
            setShowRequiredMessage(hasErrors);
        }
        // eslint-disable-next-line 
    }, [displayValues, queryvalues, afterProcess]);

    return (
        <>
            <div>
                {SnackbarComponent()}
            </div>
            <div ref={UploadDocument} >
                <Box sx={{ width: '100%', maxWidth: 1200, margin: "auto" }}>
                    <Grid container id="grid"  >
                        <Grid container style={{ display: "flex", justifyContent: "space-between" }}>
                            {!afterProcess ? (
                                <>
                                    <Grid item md={12}>
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontSize: '1.3rem',
                                                    color: '#010066',
                                                    fontWeight: 'bold',
                                                    textAlign: 'center',
                                                    mt: 1,
                                                }}
                                            >
                                                Upload your document for Submission
                                            </Typography>

                                            <Box style={{ margin: "3rem 0rem" }}>
                                                <FileUpload
                                                    id="portal"
                                                    multiple={false}
                                                    allowedFormats={['png', 'jpg', 'jpeg', 'plain', 'pdf', 'docx']}
                                                    onFilesUpload={handleFilesUploadByIDPPolicyIntake}
                                                    setIsSubmitDisabled={setIsSubmitDisabled}
                                                    selectedFilesInParent={selectedPolicyProcessFile}
                                                    filesUploadedInChild={filesUploadedInChild}
                                                    uploadIn={uploadIn}
                                                    onFileRemove={handlePolicyProcessFileRemove}
                                                />
                                            </Box>
                                            <Grid style={{ textAlign: "center" }}>
                                                <StyledButtonComponent
                                                    buttonWidth={200}
                                                    disableColor="#CCCCCC"
                                                    sx={{ marginBottom: '25px' }}
                                                    onClick={handleUploadProcessDocument}
                                                    disabled={
                                                        selectedPolicyProcessFile.length === 0 ||
                                                        loader === true ||
                                                        afterProcess === true
                                                    }
                                                >
                                                    {/* Conditionally render CircularProgress or Process text */}
                                                    {loader ? (
                                                        <CircularProgress size={24} color="inherit" />
                                                    ) : (
                                                        <>
                                                            <img
                                                                src={processclaim}
                                                                alt="process and claim icon"
                                                                style={{
                                                                    height: 38,
                                                                    paddingRight: 10,
                                                                }}
                                                            />
                                                            Process
                                                        </>
                                                    )}
                                                </StyledButtonComponent>
                                            </Grid>
                                        </Box>
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid item md={6}>
                                        <Typography
                                            style={{
                                                fontSize: "1.2rem",
                                                color: "#010066",
                                                fontWeight: "bold",
                                                textAlign: 'center'
                                            }}
                                        >
                                            Uploaded Document.
                                        </Typography>
                                        <Grid style={{ maxWidth: 600, margin: "auto", marginTop: "20px", padding: "10px" }}>
                                            <Card variant="outlined" sx={{ border: "1px solid blue", height: 'auto' }} >
                                                <CardContent>
                                                    <Typography variant="h6" component="h2">
                                                        {fileName}
                                                    </Typography>
                                                    {fileType.startsWith("image/") && (
                                                        filePreview ? (
                                                            <img
                                                                src={filePreview}
                                                                alt={fileName}
                                                                style={{ maxWidth: "100%", height: "auto" }}
                                                            />
                                                        ) : (
                                                            <PreviewError />
                                                        )
                                                    )}

                                                    {fileType === "application/pdf" && (
                                                        filePreview ? (
                                                            <iframe
                                                                title={fileName}
                                                                src={filePreview}
                                                                width="100%"
                                                                height="600px"
                                                            />
                                                        ) : (
                                                            <PreviewError />
                                                        )
                                                    )}
                                                    <Box mt={2}>
                                                        <StyledButtonComponent buttonWidth={250}
                                                            onClick={() => {
                                                                handlePolicyProcessFileRemove()
                                                                setAfterProcess(false)
                                                            }}>
                                                            Upload Document
                                                        </StyledButtonComponent>
                                                    </Box>
                                                </CardContent>
                                            </Card>

                                        </Grid>
                                    </Grid>
                                </>
                            )}
                            <Grid
                                item
                                md={6}
                                margin={isMobile ? "0rem 1rem" : "0rem 0rem"}
                            >
                                <Grid container>
                                    <Grid item md={2.5}></Grid>
                                    <Grid className="idp-fetch-container">
                                        {afterProcess === true ? (
                                            <>
                                                <Typography
                                                    style={{
                                                        fontSize: "1.2rem",
                                                        color: "#010066",
                                                        fontWeight: "bold",
                                                        textAlign: 'center',
                                                        margin: "0.9rem 0rem"
                                                    }}

                                                >
                                                    Extracted Submission details will be displayed.
                                                </Typography>
                                                <Grid className="fetch-idp-data" style={{ maxHeight: '770px', overflowY: 'auto' }} >
                                                    {showRequiredMessage && (
                                                        <Typography style={{ color: "red", marginBottom: "10px", textAlign: 'center' }}>
                                                            Please provide mandatory details in the document to get the Quote.
                                                        </Typography>
                                                    )}
                                                    {!updateDisplay ? (
                                                        <>

                                                            <Typography
                                                                variant="h5"
                                                                className="ipd-titles Nasaliza"
                                                                style={{
                                                                    color: "#010066",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "flex-start",
                                                                    marginTop: "2rem",
                                                                    borderBottom: '2px solid #1976D2',
                                                                    marginBottom: '10px'
                                                                }}
                                                            >
                                                                Policy Holder Info
                                                                {!editingSection.PolicyInfo && (
                                                                    <Tooltip title="Edit" arrow placement="right">
                                                                        <IconButton
                                                                            size="small"
                                                                            style={{ marginLeft: "0.5rem", color: "#010066" }}
                                                                            onClick={() => handleEditSection("PolicyInfo")}
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                                {editingSection.PolicyInfo && (
                                                                    <Tooltip title="Save" arrow placement="right">
                                                                        <IconButton
                                                                            size="small"
                                                                            style={{ marginLeft: "0.5rem", color: "#0B70FF" }}
                                                                            onClick={() => handleSave("PolicyInfo")}
                                                                        >
                                                                            <SaveIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </Typography>
                                                            <Grid container spacing={2} style={{ marginBottom: '7px', marginLeft: isMobile ? '0' : '20px' }}>
                                                                {Object.entries(displayValues.PolicyInfo).map(([key, value]) => {
                                                                    const isRestricted = restrictedFields.includes(key);
                                                                    const showSuggestedAddress = showAddress && suggestedAddress && validatedAddressKey === key;
                                                                    return (
                                                                        <React.Fragment key={key}>
                                                                            <Grid item xs={5} sm={5} md={5} sx={{ fontWeight: 550, fontSize: 13, textAlign: "left", display: 'flex', alignItems: 'center' }}>
                                                                                {key}
                                                                                {isRestricted && key === "Policy Holder Address" && (
                                                                                    <>
                                                                                        {/* Edit/Check Icon for Coverage Location Address */}
                                                                                        {!editingPolicyholderAddress && policyHolderAddressValidation !== true && ( // Show Edit icon if not editing and not validated
                                                                                            <Tooltip title="Edit" arrow placement="bottom">
                                                                                                <IconButton
                                                                                                    size="small"
                                                                                                    style={{ marginLeft: "0.5rem", color: "#010066" }}
                                                                                                    onClick={() => setEditingPolicyholderAddress(true)}
                                                                                                >
                                                                                                    <EditIcon fontSize="small" />
                                                                                                </IconButton>
                                                                                            </Tooltip>
                                                                                        )}
                                                                                        <Tooltip
                                                                                            title={
                                                                                                validatingAddress
                                                                                                    ? "Validating..."
                                                                                                    : policyHolderAddressValidation === ""
                                                                                                        ? "Validated"
                                                                                                        : "Not Validated"
                                                                                            }
                                                                                            arrow
                                                                                            placement="bottom"
                                                                                        >
                                                                                            <IconButton size="small" style={{ marginLeft: "0.5rem", color: "#010066" }} >
                                                                                                {validatingAddress ? (
                                                                                                    <CircularProgress size={20} color="inherit" />
                                                                                                ) : policyHolderAddressValidation === "" ? (
                                                                                                    <ValidateIcon fontSize="small" color="success" />
                                                                                                ) : (
                                                                                                    <WarningIcon fontSize="small" color="warning" />
                                                                                                )}
                                                                                            </IconButton>
                                                                                        </Tooltip>
                                                                                        {editingPolicyholderAddress && policyHolderAddressValidation !== true && (
                                                                                            <StyledButtonComponent
                                                                                                buttonWidth={80}
                                                                                                size="small"
                                                                                                sx={{ marginLeft: 2 }}
                                                                                                onClick={() => handleValidateAddress(key, "PolicyInfo")}
                                                                                                disabled={value === null}
                                                                                            >
                                                                                                Validate
                                                                                            </StyledButtonComponent>
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                            </Grid>
                                                                            <Grid item xs={1} sm={1} md={1.5} style={{ textAlign: "left" }}>
                                                                                :
                                                                            </Grid>
                                                                            <Grid item xs={6} sm={6} md={5.5} style={{ textAlign: "left" }}>
                                                                                {key === "Policy Holder Address" ? (
                                                                                    editingPolicyholderAddress ? (
                                                                                        <TextField
                                                                                            sx={{
                                                                                                '& .MuiOutlinedInput-root': {
                                                                                                    height: '35px',
                                                                                                    backgroundColor: "none"
                                                                                                },
                                                                                            }}
                                                                                            variant="outlined"
                                                                                            required
                                                                                            name={key}
                                                                                            value={value}
                                                                                            onChange={(e) => handleInputChange(key, e.target.value, "PolicyInfo")}
                                                                                        />
                                                                                    ) : (
                                                                                        <span style={{ fontWeight: 500, fontSize: 13 }}>
                                                                                            {value ? (
                                                                                                <>
                                                                                                    {value}
                                                                                                    {key === "Policy Holder Address" && policyHolderAddressValidation === null && !editingPolicyholderAddress ? (
                                                                                                        <span style={{ color: "red", fontWeight: 500, fontSize: 12 }}>
                                                                                                            <br />
                                                                                                            Address not validated
                                                                                                        </span>
                                                                                                    ) : null}
                                                                                                </>
                                                                                            ) : (
                                                                                                <span style={{ color: "red", fontWeight: 500, fontSize: 12 }}>
                                                                                                    required
                                                                                                </span>
                                                                                            )}
                                                                                        </span>
                                                                                    )
                                                                                ) : editingSection.PolicyInfo ? (
                                                                                    <TextField
                                                                                        sx={{
                                                                                            '& .MuiOutlinedInput-root': {
                                                                                                height: '35px',
                                                                                                backgroundColor: "none"
                                                                                            },
                                                                                        }}
                                                                                        variant="outlined"
                                                                                        required
                                                                                        name={key}
                                                                                        value={value}
                                                                                        onChange={(e) => handleInputChange(key, e.target.value, "PolicyInfo")}
                                                                                    />
                                                                                ) : (
                                                                                    <span style={{ fontWeight: 500, fontSize: 13 }}>
                                                                                        {value ? (
                                                                                            value
                                                                                        ) : (
                                                                                            <span style={{ color: "red", fontWeight: 500, fontSize: 12 }}>
                                                                                                required
                                                                                            </span>
                                                                                        )}
                                                                                    </span>
                                                                                )}
                                                                            </Grid>
                                                                            {/* Suggested Address */}
                                                                            {showSuggestedAddress && (
                                                                                <Grid container sx={{ mt: 1, alignItems: 'center', marginLeft: isMobile ? '0' : '20px' }}>
                                                                                    <Grid item xs={6.5}></Grid>
                                                                                    <Grid item xs={5.5} sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <Typography variant="caption" sx={{ color: "#0B70FF", mr: 1 }}>
                                                                                            {suggestedAddress}
                                                                                        </Typography>
                                                                                        <Checkbox
                                                                                            color="primary"
                                                                                            onChange={(e) => {
                                                                                                if (e.target.checked) {
                                                                                                    handleConfirmAddress(spittedAddress, key);
                                                                                                }
                                                                                            }}
                                                                                        />
                                                                                    </Grid>
                                                                                </Grid>
                                                                            )}
                                                                        </React.Fragment>
                                                                    )
                                                                })}
                                                            </Grid>
                                                            <Typography
                                                                variant="h5"
                                                                className="ipd-titles Nasaliza"
                                                                style={{
                                                                    color: "#010066",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "flex-start",
                                                                    marginTop: "2rem",
                                                                    borderBottom: '2px solid #1976D2',
                                                                    marginBottom: '10px'
                                                                }}
                                                            >
                                                                Property Information
                                                                {!editingSection.PropertyInfo && (
                                                                    <Tooltip title="Edit" arrow placement="right">
                                                                        <IconButton
                                                                            size="small"
                                                                            style={{ marginLeft: "0.5rem", color: "#010066" }}
                                                                            onClick={() => handleEditSection("PropertyInfo")}
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                                {editingSection.PropertyInfo && (
                                                                    <Tooltip title="Save" arrow placement="right">
                                                                        <IconButton
                                                                            size="small"
                                                                            style={{ marginLeft: "0.5rem", color: "#0B70FF" }}
                                                                            onClick={() => handleSave("PropertyInfo")}
                                                                        >
                                                                            <SaveIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </Typography>
                                                            <Grid container spacing={2} style={{ marginBottom: '7px', marginLeft: isMobile ? '0' : '20px' }}>
                                                                {Object.entries(displayValues.PropertyInfo).map(([key, value]) => {
                                                                    const isRestricted = restrictedFields.includes(key);
                                                                    const showSuggestedAddress = showAddress && suggestedAddress && validatedAddressKey === key;
                                                                    return (
                                                                        (key !== 'Additional Information' || (key === 'Additional Information' && queryvalues.PropertyInfo.additionalInfo)) && (
                                                                            <React.Fragment key={key}>
                                                                                <Grid item xs={5} sm={5} md={5} sx={{ fontWeight: 550, fontSize: 13, textAlign: "left", display: 'flex', alignItems: 'center' }}>
                                                                                    {key}
                                                                                    {isRestricted && key === "Coverage Location Address" && (
                                                                                        <>
                                                                                            {/* Edit/Check Icon for Coverage Location Address */}
                                                                                            {!editingAddress && propertyAddressValidation !== true && (

                                                                                                <Tooltip title="Edit" arrow placement="bottom">
                                                                                                    <IconButton
                                                                                                        size="small"
                                                                                                        style={{ marginLeft: "0.5rem", color: "#010066" }}
                                                                                                        onClick={() => setEditingAddress(true)}
                                                                                                    >
                                                                                                        <EditIcon fontSize="small" />
                                                                                                    </IconButton>
                                                                                                </Tooltip>
                                                                                            )}
                                                                                            {/* Always show the validation icon beside the edit icon */}
                                                                                            <Tooltip
                                                                                                title={
                                                                                                    validatingAddress
                                                                                                        ? "Validating..."
                                                                                                        : propertyAddressValidation === ""
                                                                                                            ? "Validated"
                                                                                                            : "Not Validated"
                                                                                                }
                                                                                                arrow
                                                                                                placement="bottom"
                                                                                            >
                                                                                                <IconButton size="small" style={{ marginLeft: "0.5rem", color: "#010066" }} >
                                                                                                    {validatingAddress ? (
                                                                                                        <CircularProgress size={20} color="inherit" />
                                                                                                    ) : propertyAddressValidation === "" ? (
                                                                                                        <ValidateIcon fontSize="small" color="success" />
                                                                                                    ) : (
                                                                                                        <WarningIcon fontSize="small" color="warning" />
                                                                                                    )}
                                                                                                </IconButton>
                                                                                            </Tooltip>
                                                                                            {/* Validate Button (Only when editingAddress is true) */}
                                                                                            {editingAddress && propertyAddressValidation !== true && (
                                                                                                <StyledButtonComponent
                                                                                                    buttonWidth={80}
                                                                                                    size="small"
                                                                                                    sx={{ marginLeft: 2 }}
                                                                                                    onClick={() => handleValidateAddress(key, "PropertyInfo")}
                                                                                                    disabled={value === null}
                                                                                                >
                                                                                                    Validate
                                                                                                </StyledButtonComponent>
                                                                                            )}
                                                                                        </>
                                                                                    )}
                                                                                </Grid>
                                                                                <Grid item xs={1} sm={1} md={1.5} style={{ textAlign: "left" }}>
                                                                                    :
                                                                                </Grid>
                                                                                <Grid item xs={6} sm={6} md={5.5} style={{ textAlign: "left" }}>
                                                                                    {/* TextField for Coverage Location Address */}
                                                                                    {key === "Coverage Location Address" ? (
                                                                                        editingAddress ? (
                                                                                            <TextField
                                                                                                sx={{
                                                                                                    '& .MuiOutlinedInput-root': {
                                                                                                        height: '35px',
                                                                                                        backgroundColor: "none"
                                                                                                    },
                                                                                                }}
                                                                                                variant="outlined"
                                                                                                required
                                                                                                name={key}
                                                                                                value={value}
                                                                                                onChange={(e) => handleInputChange(key, e.target.value, "PropertyInfo")}
                                                                                            />
                                                                                        ) : (
                                                                                            <span style={{ fontWeight: 500, fontSize: 13 }}>
                                                                                                {/* Display the address value if available */}
                                                                                                {value ? (
                                                                                                    <>
                                                                                                        {value}
                                                                                                        {/* Conditional error message based on validation status */}
                                                                                                        {key === "Coverage Location Address" && propertyAddressValidation === null && !editingAddress ? (
                                                                                                            <span style={{ color: "red", fontWeight: 500, fontSize: 12 }}>
                                                                                                                <br />
                                                                                                                Address not validated
                                                                                                            </span>
                                                                                                        ) : null}
                                                                                                    </>
                                                                                                ) : (
                                                                                                    <span style={{ color: "red", fontWeight: 500, fontSize: 12 }}>
                                                                                                        required
                                                                                                    </span>
                                                                                                )}
                                                                                            </span>
                                                                                        )
                                                                                    ) : editingSection.PropertyInfo ? (
                                                                                        <TextField
                                                                                            sx={{
                                                                                                '& .MuiOutlinedInput-root': {
                                                                                                    height: '35px',
                                                                                                    backgroundColor: "none"
                                                                                                },
                                                                                            }}
                                                                                            variant="outlined"
                                                                                            required
                                                                                            name={key}
                                                                                            value={value}
                                                                                            onChange={(e) => handleInputChange(key, e.target.value, "PropertyInfo")}
                                                                                        />
                                                                                    ) : (
                                                                                        <span style={{ fontWeight: 500, fontSize: 13 }}>
                                                                                            {value ? (
                                                                                                value
                                                                                            ) : (
                                                                                                <span style={{ color: "red", fontWeight: 500, fontSize: 12 }}>
                                                                                                    required
                                                                                                </span>
                                                                                            )}
                                                                                        </span>
                                                                                    )}
                                                                                </Grid>
                                                                                {key === "Coverage Location Address" &&
                                                                                    queryvalues.PolicyInfo.validated_address &&
                                                                                    queryvalues.PolicyInfo.validated_address !== "Address Not validated" && (
                                                                                        <Grid container sx={{ mt: 1, alignItems: 'center', marginLeft: isMobile ? '0' : '20px' }}> {/* Align items center */}
                                                                                            <Grid item xs={6}></Grid>
                                                                                            <Grid item xs={6} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                                                                <Typography style={{ fontWeight: 500, fontSize: 12, marginRight: '10px' }}>
                                                                                                    Same as Policy Holder Address?
                                                                                                </Typography>
                                                                                                <RadioGroup
                                                                                                    row
                                                                                                    value={sameAsPolicyHolderAddress ? 'true' : 'false'}
                                                                                                    onChange={(e) => {
                                                                                                        setSameAsPolicyHolderAddress(e.target.value === 'true');
                                                                                                        if (e.target.value === 'true') {
                                                                                                            const policyHolderAddress = displayValues.PolicyInfo["Policy Holder Address"];
                                                                                                            setDisplayValues((prevValues) => {
                                                                                                                const updatedSection = { ...prevValues["PropertyInfo"] };
                                                                                                                updatedSection["Coverage Location Address"] = policyHolderAddress;
                                                                                                                return {
                                                                                                                    ...prevValues,
                                                                                                                    // eslint-disable-next-line 
                                                                                                                    ["PropertyInfo"]: updatedSection,
                                                                                                                };
                                                                                                            });
                                                                                                            // 2. Update spittedAddress to match Policy Holder's address
                                                                                                            const matchingSpittedAddress = Object.entries(
                                                                                                                queryvalues.PolicyInfo
                                                                                                            ).reduce((acc, [key, value]) => {
                                                                                                                if (
                                                                                                                    [
                                                                                                                        'policy_holder_street_number',
                                                                                                                        'policy_holder_street_name',
                                                                                                                        'policy_holder_city',
                                                                                                                        'policy_holder_state',
                                                                                                                        'policy_holder_country',
                                                                                                                    ].includes(key)
                                                                                                                ) {
                                                                                                                    acc[key.replace('policy_holder_', '')] = value;
                                                                                                                } else if (key === 'policy_holder_zip') {
                                                                                                                    acc['zip_code'] = value;
                                                                                                                }
                                                                                                                return acc;
                                                                                                            }, {});
                                                                                                            // 3. Pass the correct suggestedAddress and spittedAddress
                                                                                                            handleConfirmAddress(matchingSpittedAddress, "Coverage Location Address");
                                                                                                            setPropertyAddressValidation("");
                                                                                                        } else {
                                                                                                            handleInputChange("Coverage Location Address", initialCoverageLocationAddress, "PropertyInfo");
                                                                                                            setQueryvalues((prevValues) => {
                                                                                                                const updatedSection = { ...prevValues["PropertyInfo"] };
                                                                                                                updatedSection["validated_address"] = "Address Not validated";
                                                                                                                return {
                                                                                                                    ...prevValues,
                                                                                                                    // eslint-disable-next-line 
                                                                                                                    ["PropertyInfo"]: updatedSection,
                                                                                                                };
                                                                                                            });
                                                                                                            setPropertyAddressValidation(null);
                                                                                                        }
                                                                                                    }}
                                                                                                >
                                                                                                    <FormControlLabel
                                                                                                        value="true"
                                                                                                        control={<Radio sx={{ transform: "scale(0.8)" }} />}
                                                                                                        label={<Typography sx={{ fontSize: 12, }}>Yes</Typography>}
                                                                                                    />
                                                                                                    <FormControlLabel
                                                                                                        value="false"
                                                                                                        control={<Radio sx={{ transform: "scale(0.8)" }} />}
                                                                                                        label={<Typography sx={{ fontSize: 12 }}>No</Typography>}
                                                                                                    />
                                                                                                </RadioGroup>
                                                                                            </Grid>
                                                                                        </Grid>
                                                                                    )}
                                                                                {/* Suggested Address */}
                                                                                {showSuggestedAddress && (
                                                                                    <Grid container sx={{ mt: 1, alignItems: 'center', marginLeft: isMobile ? '0' : '20px' }}>
                                                                                        <Grid item xs={6.5}></Grid>
                                                                                        <Grid item xs={5.5} sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                            <Typography variant="caption" sx={{ color: "#0B70FF", mr: 1 }}>
                                                                                                {suggestedAddress}
                                                                                            </Typography>
                                                                                            <Checkbox
                                                                                                color="primary"
                                                                                                onChange={(e) => {
                                                                                                    if (e.target.checked) {
                                                                                                        handleConfirmAddress(spittedAddress, key);
                                                                                                    }
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                )}
                                                                            </React.Fragment>
                                                                        )
                                                                    );
                                                                })}
                                                            </Grid>
                                                            <Typography variant="h5" className="ipd-titles Nasaliza" style={{
                                                                color: "#010066", display: "flex", alignItems: "center", justifyContent: "flex-start", marginTop: "2rem", borderBottom: '2px solid #1976D2',
                                                                marginBottom: '10px'
                                                            }}>
                                                                Prior Policy Info
                                                                {!editingSection.AdditionalInfo && (
                                                                    <Tooltip title="Edit" arrow placement="right">
                                                                        <IconButton
                                                                            size="small"
                                                                            style={{ marginLeft: "0.5rem", color: "#010066" }}
                                                                            onClick={() => handleEditSection("AdditionalInfo")}
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                                {editingSection.AdditionalInfo && (
                                                                    <Tooltip title="Save" arrow placement="right">
                                                                        <IconButton
                                                                            size="small"
                                                                            style={{ marginLeft: "0.5rem", color: "#0B70FF" }}
                                                                            onClick={() => handleSave("AdditionalInfo")}
                                                                        >
                                                                            <SaveIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </Typography>
                                                            <Grid container spacing={2} style={{ marginBottom: '7px', marginLeft: isMobile ? '0' : '20px' }}>
                                                                {Object.entries(displayValues.AdditionalInfo).map(([key, value]) => (
                                                                    (key !== "Mortgagee Address" || (key === "Mortgagee Address" && value)) && (
                                                                        <React.Fragment key={key}>
                                                                            <Grid item xs={5} sm={5} md={5} style={{ fontWeight: 550, fontSize: 13, textAlign: "left" }}>
                                                                                {key}
                                                                            </Grid>
                                                                            <Grid item xs={1} sm={1} md={1.5} style={{ textAlign: "left" }}>
                                                                                :
                                                                            </Grid>
                                                                            <Grid item xs={6} sm={6} md={5.5} style={{ textAlign: "left" }}>
                                                                                {editingSection.AdditionalInfo ? (
                                                                                    <TextField
                                                                                        sx={{
                                                                                            '& .MuiOutlinedInput-root': {
                                                                                                height: '35px',
                                                                                                backgroundColor: "none"
                                                                                            },
                                                                                        }}
                                                                                        variant="outlined"
                                                                                        required
                                                                                        name={key}
                                                                                        value={value}
                                                                                        onChange={(e) => handleInputChange(key, e.target.value, "AdditionalInfo")}
                                                                                    />
                                                                                ) : (
                                                                                    <span style={{ fontWeight: 500, fontSize: 13 }}>
                                                                                        {value ? (
                                                                                            value
                                                                                        ) : (
                                                                                            <span style={{ color: "red", fontWeight: 500, fontSize: 13 }}>
                                                                                                {`required`}
                                                                                            </span>
                                                                                        )}
                                                                                    </span>
                                                                                )}
                                                                            </Grid>
                                                                        </React.Fragment>
                                                                    )
                                                                ))}
                                                            </Grid>
                                                            <Typography variant="h5" className="ipd-titles Nasaliza" style={{
                                                                color: "#010066", display: "flex", alignItems: "center", justifyContent: "flex-start", marginTop: "2rem", borderBottom: '2px solid #1976D2',
                                                                marginBottom: '1rem'
                                                            }}>
                                                                Coverages
                                                                {!editingSection.Coverages && (
                                                                    <Tooltip title="Edit" arrow placement="right">
                                                                        <IconButton
                                                                            size="small"
                                                                            style={{ marginLeft: "0.5rem", color: "#010066" }}
                                                                            onClick={() => handleEditSection("Coverages")}
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                                {editingSection.Coverages && (
                                                                    <Tooltip title="Save" arrow placement="right">
                                                                        <IconButton
                                                                            size="small"
                                                                            style={{ marginLeft: "0.5rem", color: "#0B70FF" }}
                                                                            onClick={() => handleSave("Coverages")}
                                                                        >
                                                                            <SaveIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                )}
                                                            </Typography>
                                                            <Grid container spacing={2} style={{ marginBottom: '7px', marginLeft: isMobile ? '0' : '20px' }}>
                                                                {Object.entries(displayValues.Coverages).map(([key, value]) => (
                                                                    <React.Fragment key={key}>
                                                                        <Grid item xs={5} sm={5} md={5} style={{ fontWeight: 550, fontSize: 13, textAlign: "left" }}>
                                                                            {key}
                                                                        </Grid>
                                                                        <Grid item xs={1} sm={1} md={1.5} style={{ textAlign: "left" }}>
                                                                            :
                                                                        </Grid>
                                                                        <Grid item xs={6} sm={6} md={5.5} style={{ textAlign: "left" }}>
                                                                            {editingSection.Coverages ? (
                                                                                <TextField
                                                                                    sx={{
                                                                                        '& .MuiOutlinedInput-root': {
                                                                                            height: '35px',
                                                                                            backgroundColor: "none"
                                                                                        },
                                                                                    }}
                                                                                    variant="outlined"
                                                                                    required
                                                                                    name={key}
                                                                                    value={value}
                                                                                    onChange={(e) => handleInputChange(key, e.target.value, "Coverages")}
                                                                                />
                                                                            ) : (
                                                                                <span style={{ fontWeight: 500, fontSize: 13 }}>
                                                                                    {value ? (
                                                                                        value
                                                                                    ) : (
                                                                                        <span style={{ color: "red", fontWeight: 500, fontSize: 13 }}>
                                                                                            {`required`}
                                                                                        </span>
                                                                                    )}
                                                                                </span>
                                                                            )}
                                                                        </Grid>
                                                                    </React.Fragment>
                                                                ))}
                                                            </Grid>
                                                            <Typography variant="h5" className="ipd-titles Nasaliza" sx={{ borderBottom: '2px solid #1976D2', display: 'inline-block', width: '100%', marginBottom: '20px', textAlign: "left" }}></Typography>
                                                            <Grid container spacing={2} style={{ marginBottom: '7px', marginLeft: isMobile ? '0' : '15px', }}>
                                                                <Grid item xs={5} sm={5} md={5} style={{ fontWeight: 550, fontSize: 13, textAlign: "left" }}>
                                                                    Confidence Factor
                                                                </Grid>
                                                                <Grid item xs={1} sm={1} md={1.5} style={{ textAlign: "left" }}>
                                                                    :
                                                                </Grid>
                                                                <Grid item xs={6} sm={6} md={5.5} style={{ textAlign: "left", wordWrap: "break-word", whiteSpace: "normal" }}>
                                                                    {accuracy ? `${accuracy}%` : "0%"}
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    <Grid container justifyContent="center" alignItems="center" style={{ margin: "3rem 1px" }} spacing={1}>
                                                        <Grid item>
                                                            <StyledButtonComponent
                                                                buttonWidth={150}
                                                                disableColor={"#B6E3FF"}
                                                                onClick={() => handleExtractClaimSubmit(displayValues, queryvalues)}
                                                                disabled={showRequiredMessage}
                                                            >
                                                                Submit Policy
                                                            </StyledButtonComponent>
                                                        </Grid>
                                                        <Backdrop
                                                            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                                            open={processSubmit}
                                                        >
                                                            <CircularProgress color="inherit" />
                                                        </Backdrop>
                                                    </Grid>
                                                </Grid>
                                            </>

                                        ) : (
                                            <Card style={{
                                                background: 'rgba(255, 255, 255, 0.8)',
                                                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255, 255, 255, 0.18)',
                                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.3)',
                                                },
                                                borderRadius: "1rem",
                                                marginLeft: "1rem"
                                            }}>
                                            </Card>
                                        )}
                                        <Grid marginBottom={"2rem"}></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                        {validationError}
                    </Alert>
                </Snackbar>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
                <Snackbar
                    open={snackbarOpen1}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    autoHideDuration={15000}
                    onClose={handleSnackbarClose}
                >
                    <Alert
                        onClose={handleSnackbarClose}
                        severity="info"
                        sx={{ width: "100%" }}
                    >
                        The document is under process. Please wait.
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
};

export default IDPPolicyIntakefun;