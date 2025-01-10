import React, { useState, useEffect, useCallback } from 'react';
import MDBox from '../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDBox';
import MDTypography from '../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDTypography';
import MDButton from '../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from "axios";
import {
    Card, IconButton,
    Tooltip, Checkbox,
} from "@mui/material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    Typography,
    Box,
    Grid,
    TextField,
    Backdrop,
    useTheme, useMediaQuery,
} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import StyledButtonComponent from "../../../components/StyledButton";
import {
    Edit as EditIcon,
    CheckCircle as ValidateIcon,
    Warning as WarningIcon,
    Save as SaveIcon,
} from "@mui/icons-material";
import { Radio, FormControlLabel, RadioGroup } from "@mui/material";
import VuiBox from '../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/VuiBox';
import { Avatar, List, ListItem, ListItemAvatar } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import DataTable from '../../../CompanyDashboardChartsCardsLayouts/Tables/DataTable';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorIcon from '@mui/icons-material/Error';
import { Description as DescriptionIcon, TableChart as TableChartIcon, PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import { addPageNumbers, addDateToPDF } from "../../../CompanyDashboardChartsCardsLayouts/TablePDFfunctions";

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
        policy_from_channel: "",
        policy_associated_ic_id: "",
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

const checkForEmptyOrInvalidFields = (displayValues, queryvalues) => {
    const displayValuesWithoutAdditionalInfo = {
        ...displayValues,
        PropertyInfo: Object.fromEntries(
            Object.entries(displayValues.PropertyInfo || {}).filter(
                ([key]) => key !== "Additional Information"
            )
        )
    };
    if (!displayValues.AdditionalInfo?.["Mortgagee Address"]) {
        delete displayValuesWithoutAdditionalInfo.AdditionalInfo?.["Mortgagee Address"];
    }
    const hasEmptyDisplayValues = Object.values(displayValuesWithoutAdditionalInfo).some(
        (section) => Object.values(section).some((value) => !value)
    );
    const queryvaluesWithoutAdditionalInfo = {
        ...queryvalues,
        PropertyInfo: Object.fromEntries(
            Object.entries(queryvalues.PropertyInfo).filter(
                ([key]) => key !== "additionalInfo"
            )
        )
    };
    const policyHolderAddressInvalid =
        !queryvaluesWithoutAdditionalInfo.PolicyInfo?.validated_address ||
        queryvaluesWithoutAdditionalInfo.PolicyInfo?.validated_address === "Address Not validated";
    const coverageLocationAddressInvalid =
        !queryvaluesWithoutAdditionalInfo.PropertyInfo?.validated_address ||
        queryvaluesWithoutAdditionalInfo.PropertyInfo?.validated_address === "Address Not validated";
    return (
        hasEmptyDisplayValues ||
        policyHolderAddressInvalid ||
        coverageLocationAddressInvalid
    );
};

function DocAIQuoteBatchQuotesView({ quotesData, onQuoteCancel, batchDocAIQuotesCount, onPopUpClose }) {
    const [view, setView] = useState("success");
    const [loadingDocuments, setLoadingDocuments] = useState({});
    const [loadingEdit, setLoadingEdit] = useState({});
    const [openDocument, setOpenDocument] = useState(false);
    const [documentContent, setDocumentContent] = useState(null);
    const [documentType, setDocumentType] = useState(null);
    const [documentName, setDocumentName] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [pdfUrl, setPdfUrl] = useState(null);
    const [content, setContent] = useState('');
    const [contentType, setContentType] = useState(null);
    const [associatedIcId, setAssociatedIcId] = useState("");
    const [displayValues, setDisplayValues] = useState({});
    const [queryvalues, setQueryvalues] = useState(initialValues);
    const [policyHolderAddressValidation, setPolicyHolderAddressValidation] = useState("");
    const [propertyAddressValidation, setPropertyAddressValidation] = useState("");
    const [initialCoverageLocationAddress, setInitialCoverageLocationAddress] = useState("");
    const [openPdf, setOpenPdf] = useState(false);
    const [afterProcess, setAfterProcess] = useState(false);
    const [showRequiredMessage, setShowRequiredMessage] = useState(false);
    const [suggestedAddress, setSuggestedAddress] = useState(null);
    const [showAddress, setShowAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState(false);
    const [editingPolicyholderAddress, setEditingPolicyholderAddress] = useState(false);
    const [validatingAddress, setValidatingAddress] = useState(false);
    const [spittedAddress, setSpittedAddress] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [validatedAddressKey, setValidatedAddressKey] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [sameAsPolicyHolderAddress, setSameAsPolicyHolderAddress] = useState(false);
    const [processSubmit, setProcessSubmit] = useState(false);
    const [quoteDetails, setQuoteDetails] = useState("");
    const [successPopup, setSuccessPopup] = useState(false);
    const [selectedRowFailureDocumnetName, setSelectedRowFailureDocumnetName] = useState("");
    const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
    const openDownloadMenu = Boolean(downloadAnchorEl);
    const tableRef = React.useRef(null);
    const pdfTableRef = React.useRef(null);
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_URL,
        withCredentials: true
    });

    const handleViewChange = (newView) => {
        setView(newView);
    };

    const getData = () => {
        if (view === "success") return quotesData.success;
        if (view === "failure") return quotesData.failure;
        if (view === "editedSuccess") return quotesData.editedSuccess;
        return [];
    };

    const handleDocumentView = async (filename) => {
        const ic_id = localStorage.getItem("ic_id_for_dashboard");
        const formData = new FormData();
        formData.append("file_name", filename);
        formData.append("policy_status", view === "editedSuccess" ? "success" : view);
        formData.append("ic_id", ic_id);
        setLoadingDocuments((prevLoading) => ({ ...prevLoading, [filename]: true }));
        try {
            const response = await axiosInstance.post('Batch_processes/get_batch_quote_document/', formData);
            if (response.status === 200 && response.data.file_content) {
                setDocumentContent(response.data.file_content);
                const fileType = response.data.file_name.split('.').pop();
                setDocumentType(fileType);
                setDocumentName(response.data.file_name);
                setOpenDocument(true);
            } else {
                setSnackbarSeverity("error");
                setSnackbarMessage(response.data.error || "An error occurred while fetching the document.");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("error fetching the document", error);
            setSnackbarSeverity("error");
            if (error.response && error.response.data && error.response.data.error) {
                setSnackbarMessage(error.response.data.error);
            } else {
                setSnackbarMessage("An error occurred while fetching the document.");
            }
            setSnackbarOpen(true);
        } finally {
            setLoadingDocuments((prevLoading) => ({ ...prevLoading, [filename]: false }));
        }
    }

    const handleEditQuote = async (filename, extracted_data, ic_id) => {
        setLoadingEdit((prevLoading) => ({ ...prevLoading, [filename]: true }));
        setSelectedRowFailureDocumnetName(filename);
        const formData = new FormData();
        formData.append("file_name", filename);
        formData.append("policy_status", view === "editedSuccess" ? "success" : view);
        formData.append("ic_id", ic_id);
        try {
            const response = await axiosInstance.post('Batch_processes/get_batch_quote_document/', formData);
            if (response.status === 200 && response.data.file_content) {
                const fileType = response.data.file_name.split('.').pop();
                if (fileType === "pdf") {
                    const pdfBytes = Uint8Array.from(atob(response.data.file_content), c => c.charCodeAt(0));
                    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    setPdfUrl(url);
                }
                setContentType(fileType);
                setContent(response.data.file_content);
                setAssociatedIcId(ic_id)
                setDocumentName(response.data.file_name);
                const extractedResponseData = extracted_data;
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
                const displayExtractedData = mapResponseToDisplayFields(extractedResponseData);
                setDisplayValues(displayExtractedData);
                if (extractedResponseData.PolicyInfo.validated_address && extractedResponseData.PolicyInfo.validated_address === "Address Not validated") {
                    setPolicyHolderAddressValidation(null)
                }
                if (extractedResponseData.PropertyInfo.validated_address && extractedResponseData.PropertyInfo.validated_address === "Address Not validated") {
                    setPropertyAddressValidation(null)
                }
                setInitialCoverageLocationAddress(displayExtractedData.PropertyInfo["Coverage Location Address"])
                setOpenPdf(true);
                setAfterProcess(true);
            } else {
                setSnackbarSeverity("error");
                setSnackbarMessage(response.data.error || "An error occurred while fetching the document extracted content.");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Error fetching data for editing:", error);
            setSnackbarSeverity("error");
            if (error.response && error.response.data && error.response.data.error) {
                setSnackbarMessage(error.response.data.error);
            } else {
                setSnackbarMessage("An error occurred while fetching the document extracted data.");
            }
            setSnackbarOpen(true);
        } finally {
            setLoadingEdit((prevLoading) => ({ ...prevLoading, [filename]: false }));
        }
    }

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
                "Dwelling Coverage": extractedResponseData.Coverages.dwellingCoverage,
                "Personal Property Coverage": extractedResponseData.Coverages.personalProperty,
                "Personal Liability Coverage": extractedResponseData.Coverages.personalLiabilityCoverage,
                "Medical Payments Coverage": extractedResponseData.Coverages.medicalPayments,
                "Deductible": extractedResponseData.Coverages.deductible
            },
        };
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

    const memoizedCheckForEmptyOrInvalidFields = useCallback(
        () => checkForEmptyOrInvalidFields(displayValues, queryvalues),
        [displayValues, queryvalues]
    );

    useEffect(() => {
        if (afterProcess) {
            const hasErrors = memoizedCheckForEmptyOrInvalidFields();
            setShowRequiredMessage(hasErrors);
        }
    }, [memoizedCheckForEmptyOrInvalidFields, afterProcess]);

    const handleEmailDocumentClose = () => {
        setOpenPdf(false);
    }

    const [editingSection, setEditingSection] = useState({
        PolicyInfo: false,
        PropertyInfo: false,
        AdditionalInfo: false,
        Coverages: false
    });

    const handleSave = (sectionName) => {
        setShowAddress(false);
        handleEditSection(sectionName);
    };

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

    const restrictedFields = [
        "Policy Holder Address",
        "Coverage Location Address",
    ];

    const handleValidateAddress = async (key, sectionName) => {
        setValidatingAddress(true);
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
                setValidationError(null);
                setValidatedAddressKey(key);
            } else {
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
        setShowAddress(false);
    };

    const handleInputChange = (field, value, section) => {
        if ((section === "PropertyInfo" && field === "Coverage Location Address") || (section === "PolicyInfo" && field === "Policy Holder Address")) {
            setSuggestedAddress(null);
        }
        setDisplayValues((prevValues) => {
            const updatedSection = { ...prevValues[section] };
            updatedSection[field] = value;
            return {
                ...prevValues,
                [section]: updatedSection,
            };
        });
        const queryKey = getQueryvaluesKey(section, field);
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
                "Dwelling Coverage": "dwellingCoverage",
                "Personal Property Coverage": "personalProperty",
                "Personal Liability Coverage": "personalLiabilityCoverage",
                "Medical Payments Coverage": "medicalPayments",
                "Deductible": "deductible"
            }
        };
        return mapping[section]?.[field];
    };

    const handleExtractQuoteSubmit = async (displayValues, queryvalues) => {
        setProcessSubmit(true)
        const ic_id = localStorage.getItem("ic_id_for_dashboard");
        if (queryvalues.AdditionalInfo.mortgageeStreetNumber === "") {
            queryvalues.AdditionalInfo.mortgageeStreetNumber = null;
        }
        const policyData = {
            PolicyInfo: {
                ...queryvalues.PolicyInfo,
                policy_from_channel: "BatchDocAIQuote",
                policy_associated_ic_id: associatedIcId,
            },
            PropertyInfo: queryvalues.PropertyInfo,
            AdditionalInfo: queryvalues.AdditionalInfo,
            Coverages: queryvalues.Coverages,
        };
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('policy_data', JSON.stringify(policyData));
            formDataToSend.append('file_name', selectedRowFailureDocumnetName)
            formDataToSend.append('ic_id', associatedIcId || ic_id)
            const response = await axiosInstance.post(
                'Batch_processes/edit_docai_batch_quote_failure/',
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if (response.status === 201) {
                setQuoteDetails(response.data)
                setProcessSubmit(false);
                setQueryvalues(initialValues);
                setDisplayValues({})
                setOpenPdf(false);
                setSuccessPopup(true);
            }
            else {
                console.error('Error submitting data:', response.status);
                handleAPIError('Error creating policy. Please try again.'); // Handle API error
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
        setSnackbarOpen(false);
    };

    const handleCloseDocument = () => {
        setOpenDocument(false);
        setDocumentContent(null);
        setDocumentType(null);
        setDocumentName("");
    };

    const handlePopupClose = () => {
        setSuccessPopup(false);
        setOpenPdf(false);
        onPopUpClose();
    };

    const getDocumentUrl = () => {
        if (documentType === 'pdf') {
            const pdfBytes = Uint8Array.from(atob(documentContent), c => c.charCodeAt(0));
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            return URL.createObjectURL(blob);
        } else if (documentType === 'html') {
            return `data:text/html;base64,${btoa(documentContent)}`;
        } else {
            return null;
        }
    };

    const transformBatchQuoteData = (data, view) => {
        const transformed = {
            quotes: { columns: [], rows: [] }
        };
        if (view === "success" || view === "editedSuccess") {
            transformed.quotes.columns = [
                { Header: "Quote Number", accessor: "quoteNumber", align: "left" },
                { Header: "Quote Amount($)", accessor: "quoteAmount", align: "left" },
                { Header: "Policy Holder Name", accessor: "policyHolderName", align: "left" },
                { Header: "Policy Holder Email", accessor: "policyHolderEmail", align: "left" },
                { Header: "Selected Policy", accessor: "selectedPolicy", align: "left" },
                { Header: "Document Name", accessor: "documentName", align: "left" },
                { Header: "Actions", accessor: "actions", align: "center" },
            ];
        } else if (view === "failure") {
            transformed.quotes.columns = [
                { Header: "Policy Holder Name", accessor: "policyHolderName", align: "left" },
                { Header: "Policy Holder Email", accessor: "policyHolderEmail", align: "left" },
                { Header: "Policy Holder Mobile", accessor: "policyHolderMobile", align: "left" },
                { Header: "Document Name", accessor: "documentName", align: "left" },
                { Header: "Actions", accessor: "actions", align: "center" },
            ];
        }
        transformed.quotes.rows = data.map((quote) => {
            let rowData;
            if (view === "success" || view === "editedSuccess") {
                rowData = {
                    quoteNumber: quote.quote_number,
                    quoteAmount: `$${quote.quote_amount}`,
                    policyHolderName: quote.policy_holder_name,
                    policyHolderEmail: quote.policy_holder_email,
                    selectedPolicy: quote.selected_policy || quote.extracted_data.PolicyInfo.selectedPolicy,
                    documentName: quote.filename,
                };
            } else if (view === "failure") {
                rowData = {
                    policyHolderName: quote.policy_holder_name,
                    policyHolderEmail: quote.policy_holder_email,
                    policyHolderMobile: quote.policy_holder_mobile,
                    documentName: quote.filename,
                };
            }
            return {
                ...rowData,
                actions: (
                    <MDBox display="flex" justifyContent="center" gap={1}>
                        <Tooltip title="View Document" arrow placement="left">
                            <MDButton
                                variant="outlined"
                                onClick={() => handleDocumentView(quote.filename)}
                                size="small"
                                disabled={loadingDocuments[quote.filename] || false}
                                startIcon={loadingDocuments[quote.filename] && <CircularProgress size={16} />}
                                sx={{
                                    borderColor: "#53918e",
                                    color: "#53918e",
                                    '&:hover': {
                                        borderColor: "#53918e",
                                        borderWidth: 2,
                                    },
                                }}
                            >
                                <DescriptionIcon sx={{ color: "#53918e" }} />
                            </MDButton>
                        </Tooltip>
                        {view === "failure" && (
                            <Tooltip title="Edit Document" arrow placement="right">
                                <MDButton
                                    variant="outlined"
                                    onClick={() => handleEditQuote(quote.filename, quote.extracted_data, quote.ic_id)}
                                    disabled={loadingEdit[quote.filename] || false}
                                    size="small"
                                    startIcon={loadingEdit[quote.filename] && <CircularProgress size={16} />}
                                    sx={{
                                        borderColor: "red",
                                        color: "red",
                                        '&:hover': {
                                            borderColor: "red",
                                            borderWidth: 2,
                                        },
                                    }}
                                >
                                    <EditIcon sx={{ color: "red" }} />
                                </MDButton>
                            </Tooltip>
                        )}
                    </MDBox>
                )
            };
        });
        return transformed;
    };

    const handleDownload = (format) => {
        const getData = () => {
            if (view === "success") return quotesData.success;
            if (view === "failure") return quotesData.failure;
            if (view === "editedSuccess") return quotesData.editedSuccess;
            return [];
        };
        const data = getData().map((quote) => {
            if (view === "success" || view === "editedSuccess") {
                return {
                    "Quote Number": quote.quote_number,
                    "Quote Amount($)": `$${quote.quote_amount}`,
                    "Policy Holder Name": quote.policy_holder_name,
                    "Policy Holder Email": quote.policy_holder_email,
                    "Selected Policy": quote.selected_policy || quote.extracted_data?.PolicyInfo?.selectedPolicy,
                    "Document Name": quote.filename,
                };
            } else if (view === "failure") {
                return {
                    "Policy Holder Name": quote.policy_holder_name,
                    "Policy Holder Email": quote.policy_holder_email,
                    "Policy Holder Mobile": quote.policy_holder_mobile,
                    "Document Name": quote.filename,
                };
            }
            return {};
        });
        if (format === "csv") {
            const csvHeaders = Object.keys(data[0]).join(',') + '\n';
            const csvRows = data.map(row => Object.values(row).join(',')).join('\n');
            const csvContent = csvHeaders + csvRows;
            const csvLink = document.createElement("a");
            csvLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
            csvLink.target = '_blank';
            csvLink.download = "DocAI™Quote_Batch_Process_data.csv";
            csvLink.click();
        } else if (format === "pdf") {
            const doc = new jsPDF('landscape');
            const filename = "DocAI™Quote_Batch_Process_data_report";
            const displayFilename = filename.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            doc.setFontSize(20);
            const textWidth = doc.getTextWidth(`${displayFilename}`);
            const textOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2;
            doc.text(`${displayFilename}`, textOffset, 22);
            addDateToPDF(doc, 28);
            doc.setFontSize(12);
            doc.text(`This report provides a detailed list of DocAI™ Quote Batch Process data.`, 14, 40);
            doc.autoTable({
                html: pdfTableRef.current,
                startY: 50,
                styles: { halign: 'right' },
                headStyles: { halign: 'center', fontStyle: 'bold' }
            });
            addPageNumbers(doc);
            doc.save(`${filename}.pdf`);
        } else if (format === "excel") {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "DocAI™Quote Batch Process Data");
            XLSX.writeFile(workbook, "DocAI™Quote_Batch_Process_data.xlsx");
        }
    };

    const handleDownloadClick = (event) => {
        setDownloadAnchorEl(event.currentTarget);
    };

    const handleDownloadClose = () => {
        setDownloadAnchorEl(null);
    };

    const handleDownloadOption = (format) => {
        handleDownloadClose();
        handleDownload(format);
    };

    const buttonData = [
        { icon: <CheckCircleIcon />, label: "Success", view: "success", color: "success", numberOfquotes: batchDocAIQuotesCount.success },
        { icon: <ErrorIcon />, label: "Failure", view: "failure", color: "error", numberOfquotes: batchDocAIQuotesCount.failure },
        { icon: <EditIcon />, label: "Edited Success", view: "editedSuccess", color: "primary", numberOfquotes: batchDocAIQuotesCount.editedSuccess },
    ];

    const tableData = transformBatchQuoteData(getData(), view);
    if (!Array.isArray(getData()) || getData().length === 0) {
        return (
            <MDBox pt={3} pb={3}>
                <VuiBox py={3}>
                    <Card>
                        <MDBox
                            sx={{
                                height: {
                                    xs: "60px",
                                    sm: "60px",
                                    md: "60px",
                                    lg: "60px",
                                },
                            }}
                            mx={2}
                            mt={-4}
                            py={3}
                            px={2}
                            variant="contained"
                            bgColor="#ebfaf9"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderRadius="lg"
                        >
                            <MDTypography variant="h6" color="Black">
                                <List sx={{ py: 0 }}>
                                    <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                        <ListItemAvatar>
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    ...theme.typography.commonAvatar,
                                                    ...theme.typography.largeAvatar,
                                                    backgroundColor: '#ffffff',
                                                    color: '#53918e',
                                                    cursor: 'default'
                                                }}
                                            >
                                                <MailIcon fontSize="inherit" />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            sx={{
                                                py: 0,
                                                mt: 0.45,
                                                mb: 0.45
                                            }}
                                            primary={<Typography variant="h6">DocAI™ Quote Batch Process Information</Typography>}
                                        />
                                    </ListItem>
                                </List>
                            </MDTypography>
                            <MDBox
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                p={2}
                            >
                                <MDBox>
                                    {buttonData.map((button) => (
                                        <MDButton
                                            key={button.view}
                                            variant="outlined"
                                            onClick={() => handleViewChange(button.view)}
                                            sx={{
                                                minWidth: 0,
                                                maxWidth: 200,
                                                padding: '4px 10px',
                                                marginRight: 1,
                                                borderColor: view === button.view ? theme.palette[button.color].main : "#D3D3D3",
                                                color: view === button.view ? theme.palette[button.color].main : "gray",
                                                fontWeight: view === button.view ? 'bold' : 'normal',
                                                transition: 'all 0.2s ease-in-out',
                                                '&:hover': {
                                                    borderColor: theme.palette[button.color].main,
                                                    backgroundColor: 'transparent',
                                                    '& .MuiAvatar-root, & .MuiIcon-root': {
                                                        color: view === button.view ? "white" : theme.palette[button.color].main,
                                                        transform: 'scale(1.1)'
                                                    },
                                                    '& .buttonLabel': {
                                                        color: theme.palette[button.color].main,
                                                        fontWeight: 'bold'
                                                    },
                                                },
                                            }}
                                        >
                                            <Avatar
                                                variant="rounded"
                                                sx={{
                                                    marginRight: 0.5,
                                                    backgroundColor: view === button.view ? theme.palette[button.color].main : "#ECECEC",
                                                    color: view === button.view ? "white" : 'inherit',
                                                    transition: 'all 0.2s ease-in-out',
                                                    height: 30,
                                                    width: 30,
                                                }}
                                            >
                                                {button.icon}
                                            </Avatar>
                                            <span className="buttonLabel">
                                                {button.label} ({button.numberOfquotes})
                                            </span>
                                        </MDButton>
                                    ))}
                                </MDBox>
                                <MDBox>
                                    <IconButton
                                        sx={{ cursor: "pointer", color: "#53918e" }}
                                        onClick={onQuoteCancel}
                                    >
                                        <CancelIcon sx={{ fontSize: "1.5rem" }} />
                                    </IconButton>
                                </MDBox>
                            </MDBox>
                        </MDBox>
                        <MDBox pt={3} px={3} py={3}>
                            <MDTypography sx={{ fontSize: "1rem" }}><InfoOutlinedIcon sx={{ mr: 1, color: "#53918e" }} fontSize="inherit" />No Quotes found.</MDTypography>
                        </MDBox>
                    </Card>
                </VuiBox>
            </MDBox>
        )
    }

    return (
        <MDBox pt={3} pb={3}>
            <VuiBox py={3}>
                <Card>
                    <MDBox
                        sx={{
                            height: {
                                xs: "60px",
                                sm: "60px",
                                md: "60px",
                                lg: "60px",
                            },
                        }}
                        mx={2}
                        mt={-4}
                        py={3}
                        px={2}
                        variant="contained"
                        bgColor="#ebfaf9"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderRadius="lg"
                    >
                        <MDTypography variant="h6" color="Black">
                            <List sx={{ py: 0 }}>
                                <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                    <ListItemAvatar>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: '#ffffff',
                                                color: '#53918e',
                                                cursor: 'default'
                                            }}
                                        >
                                            <MailIcon fontSize="inherit" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        sx={{
                                            py: 0,
                                            mt: 0.45,
                                            mb: 0.45
                                        }}
                                        primary={<Typography variant="h6">DocAI™ Quote Batch Process Information</Typography>}
                                    />
                                </ListItem>
                            </List>
                        </MDTypography>
                        <MDBox
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            p={2}
                        >
                            <MDBox>
                                {buttonData.map((button) => (
                                    <MDButton
                                        key={button.view}
                                        variant="outlined"
                                        onClick={() => handleViewChange(button.view)}
                                        sx={{
                                            minWidth: 0,
                                            maxWidth: 200,
                                            padding: '4px 10px',
                                            marginRight: 1,
                                            borderColor: view === button.view ? theme.palette[button.color].main : "#D3D3D3",
                                            color: view === button.view ? theme.palette[button.color].main : "gray",
                                            fontWeight: view === button.view ? 'bold' : 'normal',
                                            transition: 'all 0.2s ease-in-out',
                                            '&:hover': {
                                                borderColor: theme.palette[button.color].main,
                                                backgroundColor: 'transparent',
                                                '& .MuiAvatar-root, & .MuiIcon-root': {
                                                    color: view === button.view ? "white" : theme.palette[button.color].main,
                                                    transform: 'scale(1.1)'
                                                },
                                                '& .buttonLabel': {
                                                    color: theme.palette[button.color].main,
                                                    fontWeight: 'bold'
                                                },
                                            },
                                        }}
                                    >
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                marginRight: 0.5,
                                                backgroundColor: view === button.view ? theme.palette[button.color].main : "#ECECEC",
                                                color: view === button.view ? "white" : 'inherit',
                                                transition: 'all 0.2s ease-in-out',
                                                height: 30,
                                                width: 30,
                                            }}
                                        >
                                            {button.icon}
                                        </Avatar>
                                        <span className="buttonLabel">
                                            {button.label} &nbsp; ({button.numberOfquotes})
                                        </span>
                                    </MDButton>
                                ))}
                            </MDBox>
                            <MDBox>
                                <IconButton
                                    onClick={handleDownloadClick}
                                    sx={{ cursor: "pointer", color: "#53918e" }}
                                >
                                    <DownloadIcon sx={{ fontSize: "1.5rem" }} />
                                </IconButton>
                                <IconButton
                                    sx={{ cursor: "pointer", color: "#53918e" }}
                                    onClick={onQuoteCancel}
                                >
                                    <CancelIcon sx={{ fontSize: "1.5rem" }} />
                                </IconButton>
                                <Menu
                                    anchorEl={downloadAnchorEl}
                                    open={openDownloadMenu}
                                    onClose={handleDownloadClose}
                                >
                                    <MenuItem onClick={() => handleDownloadOption("csv")}>
                                        <ListItemIcon>
                                            <DescriptionIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Download as CSV" />
                                    </MenuItem>
                                    <MenuItem onClick={() => handleDownloadOption("excel")}>
                                        <ListItemIcon>
                                            <TableChartIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Download as Excel" />
                                    </MenuItem>
                                    <MenuItem onClick={() => handleDownloadOption("pdf")}>
                                        <ListItemIcon>
                                            <PictureAsPdfIcon />
                                        </ListItemIcon>
                                        <ListItemText primary="Download as PDF" />
                                    </MenuItem>
                                </Menu>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                    <MDBox pt={3}>
                        <DataTable
                            table={{ columns: tableData.quotes.columns, rows: tableData.quotes.rows }}
                            canSearch
                            isSorted={true}
                            entriesPerPage={true}
                            pagination={{ variant: "contained", color: "light" }}
                            showTotalEntries={true}
                            noEndBorder
                            tableRef={tableRef}
                            searchKeys={["quoteNumber", "quoteAmount", "policyHolderName", "policyHolderEmail", "selectedPolicy", "documentName", "policyHolderMobile"]}
                        />
                    </MDBox>
                </Card>
            </VuiBox>
            {/* Hidden Table for PDF Generation */}
            <table ref={pdfTableRef} style={{ display: 'none' }}>
                <thead>
                    <tr>
                        {view === "success" || view === "editedSuccess" ? (
                            <>
                                <th>Quote Number</th>
                                <th>Quote Amount($)</th>
                                <th>Policy Holder Name</th>
                                <th>Policy Holder Email</th>
                                <th>Selected Policy</th>
                                <th>Document Name</th>
                            </>
                        ) : (
                            <>
                                <th>Policy Holder Name</th>
                                <th>Policy Holder Email</th>
                                <th>Policy Holder Mobile</th>
                                <th>Document Name</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {getData().map((quote, index) => (
                        <tr key={index}>
                            {view === "success" || view === "editedSuccess" ? (
                                <>
                                    <td>{quote.quote_number}</td>
                                    <td>${quote.quote_amount}</td>
                                    <td>{quote.policy_holder_name}</td>
                                    <td>{quote.policy_holder_email}</td>
                                    <td>{quote.selected_policy || quote.extracted_data?.PolicyInfo?.selectedPolicy || "N/A"}</td>
                                    <td>{quote.filename}</td>
                                </>
                            ) : (
                                <>
                                    <td>{quote.policy_holder_name}</td>
                                    <td>{quote.policy_holder_email}</td>
                                    <td>{quote.policy_holder_mobile}</td>
                                    <td>{quote.filename}</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* start edit email dialog */}
            {/* PDF Viewer Dialog */}
            <Dialog open={openPdf} onClose={handleEmailDocumentClose} fullWidth maxWidth="xl">
                <Grid container style={{ display: "flex", justifyContent: "space-between" }}>
                    <Grid item md={6}>
                        <DialogTitle>{documentName}</DialogTitle>
                        <DialogContent>
                            {contentType === 'pdf' && (
                                <embed src={pdfUrl} width="100%" height="600px" type="application/pdf" />
                            )}
                            {contentType === 'html' && (
                                <div dangerouslySetInnerHTML={{ __html: content }}></div>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEmailDocumentClose} color="primary">
                                Close
                            </Button>
                            {contentType === 'pdf' && pdfUrl && (
                                <Button
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = pdfUrl;
                                        link.download = documentName || 'document.pdf';
                                        link.click();
                                    }}
                                    color="primary"
                                >
                                    <DownloadIcon /> Download PDF
                                </Button>
                            )}
                        </DialogActions>
                    </Grid>
                    <Grid item md={6}>
                        <DialogContent>
                            <Grid container>
                                <Grid className="idp-fetch-container">
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
                                            {displayValues.PolicyInfo && Object.entries(displayValues.PolicyInfo).map(([key, value]) => {
                                                const isRestricted = restrictedFields.includes(key);
                                                const showSuggestedAddress = showAddress && suggestedAddress && validatedAddressKey === key;
                                                return (
                                                    <React.Fragment key={key}>
                                                        <Grid item xs={5} sm={5} md={5} sx={{ fontWeight: 550, fontSize: 13, textAlign: "left", display: 'flex', alignItems: 'center' }}>
                                                            {key}
                                                            {isRestricted && key === "Policy Holder Address" && (
                                                                <>
                                                                    {/* Edit/Check Icon for Coverage Location Address */}
                                                                    {!editingPolicyholderAddress && policyHolderAddressValidation !== true && (
                                                                        <Tooltip title="Edit" arrow placement="bottom">
                                                                            <IconButton
                                                                                size="small"
                                                                                style={{ marginLeft: "0.5rem", color: "#010066" }}
                                                                                onClick={() => {
                                                                                    setPolicyHolderAddressValidation(null)
                                                                                    setEditingPolicyholderAddress(true)
                                                                                }}
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
                                                                                : policyHolderAddressValidation === "" && value
                                                                                    ? "Validated"
                                                                                    : "Not Validated"
                                                                        }
                                                                        arrow
                                                                        placement="bottom"
                                                                    >
                                                                        <IconButton size="small" style={{ marginLeft: "0.5rem", color: "#010066" }} >
                                                                            {validatingAddress ? (
                                                                                <CircularProgress size={20} color="inherit" />
                                                                            ) : policyHolderAddressValidation === "" && value ? (
                                                                                <ValidateIcon fontSize="small" color="success" />
                                                                            ) : (
                                                                                <WarningIcon fontSize="small" color="warning" />
                                                                            )}
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    {/* Validate Button (Only when editingAddress is true) */}
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
                                                            {/* TextField for Coverage Location Address */}
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
                                                                        {/* Display the address value if available */}
                                                                        {value ? (
                                                                            <>
                                                                                {value}
                                                                                {/* Conditional error message based on validation status */}
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
                                            {displayValues.PropertyInfo && Object.entries(displayValues.PropertyInfo).map(([key, value]) => {
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
                                                                        {!editingAddress && propertyAddressValidation !== true && ( // Show Edit icon if not editing and not validated

                                                                            <Tooltip title="Edit" arrow placement="bottom">
                                                                                <IconButton
                                                                                    size="small"
                                                                                    style={{ marginLeft: "0.5rem", color: "#010066" }}
                                                                                    onClick={() => {
                                                                                        setEditingAddress(true)
                                                                                        setPropertyAddressValidation(null)
                                                                                    }}
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
                                                                                    : propertyAddressValidation === "" && value
                                                                                        ? "Validated"
                                                                                        : "Not Validated"
                                                                            }
                                                                            arrow
                                                                            placement="bottom"
                                                                        >
                                                                            <IconButton size="small" style={{ marginLeft: "0.5rem", color: "#010066" }} >
                                                                                {validatingAddress ? (
                                                                                    <CircularProgress size={20} color="inherit" />
                                                                                ) : propertyAddressValidation === "" && value ? (
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
                                                                {/* Conditional rendering for "Same as Policy Holder Address" */}
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
                                                                                                PropertyInfo: updatedSection,
                                                                                            };
                                                                                        });
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
                                                                                        handleConfirmAddress(matchingSpittedAddress, "Coverage Location Address");
                                                                                        setPropertyAddressValidation("");
                                                                                    } else {
                                                                                        handleInputChange("Coverage Location Address", initialCoverageLocationAddress, "PropertyInfo");
                                                                                        setQueryvalues((prevValues) => {
                                                                                            const updatedSection = { ...prevValues["PropertyInfo"] };
                                                                                            updatedSection["validated_address"] = "Address Not validated";
                                                                                            return {
                                                                                                ...prevValues,
                                                                                                PropertyInfo: updatedSection,
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
                                            {displayValues.AdditionalInfo && Object.entries(displayValues.AdditionalInfo).map(([key, value]) => (
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
                                            marginBottom: '10px'
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
                                            {displayValues.Coverages && Object.entries(displayValues.Coverages).map(([key, value]) => (
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
                                        <Grid container justifyContent="center" alignItems="center" style={{ margin: "3rem 1px" }} spacing={1}>
                                            <Grid item>
                                                <StyledButtonComponent
                                                    buttonWidth={150}
                                                    disableColor={"#B6E3FF"}
                                                    onClick={() => handleExtractQuoteSubmit(displayValues, queryvalues)}
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
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </Grid>
                </Grid>
            </Dialog>
            {/* end of the edit email dialog */}
            {/* // Add Snackbar component */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            {/* email document view dialog */}
            <Dialog
                open={openDocument}
                onClose={handleCloseDocument}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>{documentName}</DialogTitle>
                <DialogContent>
                    {documentType === "pdf" && (
                        <embed
                            src={getDocumentUrl()}
                            width="100%"
                            height="600px"
                            type="application/pdf"
                        />
                    )}
                    {documentType === "html" && (
                        <div dangerouslySetInnerHTML={{ __html: documentContent }} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDocument} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
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
            {/* start of the success popup  */}
            {successPopup &&
                <Dialog open={successPopup} onClose={handlePopupClose} fullWidth maxWidth="md" PaperProps={{ style: { maxHeight: '80vh' } }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Grid container justifyContent="center" style={{ marginTop: "3rem" }}>
                            <Grid item xs={12} >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                    {!isMobile && (
                                        <CheckCircleIcon sx={{ fontSize: 50, mr: 2, color: 'green' }} />
                                    )}
                                    <Typography className='Nasaliza' style={{ fontSize: isMobile ? '1rem' : '1.5rem' }}>
                                        Quote Created Successfully!
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='h6' sx={{ mb: 2, textAlign: 'center' }} className='Nasaliza'>
                                    Quote Number:{' '}
                                    <span style={{ color: '#0B70FF' }}>
                                        {quoteDetails && quoteDetails.quote_number}
                                    </span>
                                </Typography>
                                <Typography variant='h6' sx={{ mb: 2, textAlign: 'center' }} className='Nasaliza'>
                                    Quote Amount:{' '}
                                    <span style={{ color: '#0B70FF' }}>
                                        {`$${quoteDetails && quoteDetails.quote_amount}`}
                                    </span>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <DialogActions>
                        <Button onClick={handlePopupClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            }
        </MDBox>
    );
}

export default DocAIQuoteBatchQuotesView;