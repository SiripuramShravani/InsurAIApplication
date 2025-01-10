import React, { useState, useEffect } from "react";
import { Avatar, Card, List, ListItem, ListItemAvatar, Typography } from '@mui/material';
import MDBox from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDBox";
import MDTypography from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDTypography";
import MDButton from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDButton";
import { ChevronLeft, Paperclip, Clock, Tag } from 'lucide-react';
import axios from "axios";
import { Tooltip as ToolTip } from '@mui/material';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { addPageNumbers, addDateToPDF } from "../../../CompanyDashboardChartsCardsLayouts/TablePDFfunctions";
import CancelIcon from '@mui/icons-material/Cancel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DownloadIcon from "@mui/icons-material/Download";
import VuiBox from "../../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/VuiBox";
import DataTable from "../../../CompanyDashboardChartsCardsLayouts/Tables/DataTable";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MailIcon from '@mui/icons-material/Mail';
import ErrorIcon from '@mui/icons-material/Error';
import EditIcon from '@mui/icons-material/Edit';
import { Description as DescriptionIcon, TableChart as TableChartIcon, PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Grid,
  TextField,
  Backdrop, Tooltip,
  IconButton, Checkbox
} from "@mui/material";
import { CheckCircle as ValidateIcon, Warning as WarningIcon } from "@mui/icons-material"
import StyledButtonComponent from "../../../components/StyledButton";
import themeFunction from '../../../InsurAdminNewUIModificationsComponents/UIComponents-NewDashbaordUI/themes';
const theme = themeFunction();

// Custom Email template
function removeCidReferencesAndLinks(text) {
  text = text.replace(/\[cid:[^\]]+\]|<[^>]+cid:[^>]+>/g, ''); // Remove cid references
  text = text.replace(/<a\s+href=[^>]+>[^<]+<\/a>/gi, ''); // Remove <a> tags (links)
  text = text.replace(/mailto:[^\s]+/gi, ''); // Remove mailto links
  // Remove links starting with http, https, or www., capturing only the link part
  text = text.replace(/(https?:\/\/|www\.)[^\s]+/gi, (match) => {
    return ''; // Replace the matched link with an empty string
  });
  return text;
}

const EmailView = ({ emailDetails, handleOpenDocumentViewer }) => {
  const cleanBody = removeCidReferencesAndLinks(emailDetails.body);
  const [email, setEmail] = useState({
    subject: emailDetails.subject,
    sender: emailDetails.sender_name || 'Unknown Sender',
    senderEmail: emailDetails.email_id || 'unknown@example.com',
    time: emailDetails.email_time,
    body: cleanBody,
    attachments: emailDetails.document_name || [],
    tags: emailDetails.tags || []
  });

  return (
    <div className="email-view">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <ChevronLeft className="back-button" />
            <h1 className="subject">{email.subject}</h1>
          </div>
        </div>
      </header>

      {/* Email Content */}
      <main className="main-content">
        <div className="email-container">
          {/* Sender Info */}
          <div className="sender-info">
            <div>
              <p className="sender-email">{`<${email.senderEmail}>`}</p>
            </div>
            <div className="email-time">
              <Clock className="time-icon" />
              <p>{new Date(email.time).toLocaleString()}</p>
            </div>
          </div>
          {/* Tags */}
          <div className="tags">
            {email.tags.map((tag, index) => (
              <div key={index} className="tag">
                <Tag className="tag-icon" />
                <span className="tag-text">{tag}</span>
              </div>
            ))}
          </div>
          {/* Email Body */}
          <div className="email-body">{email.body}</div>
          {/* Attachments */}
          {email.attachments && email.attachments.length > 0 ? (
            <div className="attachments">
              <h3 className="attachments-title">Attachments:</h3>
              <div className="attachments-list">
                {email.attachments ? (
                  <div
                    className="attachment"
                    onClick={handleOpenDocumentViewer}
                    style={{ cursor: 'pointer' }}
                  >
                    <Paperclip className="attachment-icon" />
                    <span className="attachment-name">{email.attachments}</span>
                  </div>
                ) : (
                  <div className="attachment">
                    <span className="attachment-name">No document found</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <h3 className="attachments-title" style={{ marginTop: "2rem" }}>Attachments:</h3>
              <div className="attachment">
                <span className="attachment-name">No document found</span>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const initialValues = {
  policy_number: "",
  claim_reported_by: "",
  loss_date_and_time: "",
  loss_type: "",
  loss_address: "",
  loss_street: "",
  loss_city: "",
  loss_state: "",
  loss_zip: "",
  loss_country: "",
  police_fire_contacted: false,
  report_number: null,
  loss_damage_description: "",
};

function EmailtoFNOLClaimsView({ claimsData, setClickedCard, processCount, onClose }) {
  const [claimsDataState, setClaimsDataState] = useState(claimsData);
  const [view, setView] = useState("success");
  const [openDocument, setOpenDocument] = useState(false);
  const [documentContent, setDocumentContent] = useState(null);
  const [documentType, setDocumentType] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [loadingDocuments, setLoadingDocuments] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openEmailView, setOpenEmailView] = useState(false);
  const [selectedEmailData, setSelectedEmailData] = useState(null);
  const [loadingEmailView, setLoadingEmailView] = useState({});
  const [emailStatusType, setEmailStatusType] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState(null);
  const [displayValues, setDisplayValues] = useState({});
  const [queryvalues, setQueryvalues] = useState(initialValues);
  const [processSubmit, setProcessSubmit] = useState(false);
  const [enableFields, setEnableFields] = useState(false);
  const [hasEmptyOrInvalidValues, setHasEmptyOrInvalidValues] = useState(true);
  const [openPdf, setOpenPdf] = useState(false);
  // const theme = useTheme();
  // const isMobile = useMediaQuery(themes.breakpoints.down('sm'));
  const [updateDisplay, setUpdateDisplay] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [loadingEdit, setLoadingEdit] = useState({});
  const userAccessString = localStorage.getItem('userAccess');
  const userAccess = userAccessString ? JSON.parse(userAccessString) : [];
  const isUnderwriter = userAccess.includes("underwriter");
  const [propertyAddressValidation, setPropertyAddressValidation] = useState("");
  const [validatingAddress, setValidatingAddress] = useState(false);
  const [spittedAddress, setSpittedAddress] = useState(null);
  const [suggestedAddress, setSuggestedAddress] = useState(null);
  const [showAddress, setShowAddress] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [validatedAddressKey, setValidatedAddressKey] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const openDownloadMenu = Boolean(downloadAnchorEl);
  const tableRef = React.useRef(null);
  const pdfTableRef = React.useRef(null);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });

  const handleEditClaim = (email, status) => {
    setLoadingEdit((prevLoading) => ({ ...prevLoading, [email]: true }));
    setEmailStatusType(status);
    fetchEditData(email, status);
  };

  const fetchEditData = (email, status) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('status', status);
    axiosInstance.post('AI/get_document_by_email/', formData)
      .then(response => {
        if (response.data.success) {
          if (response.data.content_type === "pdf") {
            const pdfBytes = Uint8Array.from(atob(response.data.content), c => c.charCodeAt(0));
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
          }
          if (response && response.data && response.data.Errors && response.data.Errors.length > 0) {
            if (response.data.Errors.includes("Invalid Address")) {
              setPropertyAddressValidation(null);
            }
          }
          setContentType(response.data.content_type);
          setContent(response.data.content);
          setDocumentName(response.data.document_name);
          const extractedResponseData = response.data.Extracted_data;
          setQueryvalues(extractedResponseData);
          const displayExtractedData = mapResponseToDisplayFields(extractedResponseData);
          setDisplayValues(displayExtractedData);
          setSelectedEmail(email);
          setOpenPdf(true);
        } else {
          console.error("Error fetching data for editing:", response.data.error);
        }
      })
      .catch(error => {
        setSnackbarSeverity("error");
        if (error.response && error.response.data && error.response.data.error) {
          setSnackbarMessage(error.response.data.error);
        } else {
          setSnackbarMessage("An error occurred while fetching the document.");
        }
        setSnackbarOpen(true);
      })
      .finally(() => {
        setLoadingEdit((prevLoading) => ({ ...prevLoading, [email]: false }));
      });
  };

  const mapResponseToDisplayFields = (extractedResponseData) => {
    return {
      "Policy Number": extractedResponseData.policy_number,
      "Reported By": extractedResponseData.claim_reported_by,
      "Loss Date and Time": extractedResponseData.loss_date_and_time,
      "Type of Loss": extractedResponseData.loss_type,
      "Loss Location": `${extractedResponseData.street_number} ${extractedResponseData.street_name}, ${extractedResponseData.loss_city}, ${extractedResponseData.loss_state}, ${extractedResponseData.loss_zip}, ${extractedResponseData.loss_country}`,
      "Police/Fire Department Contacted?": extractedResponseData.police_fire_contacted ? 'True' : 'False',
      "Report Number": extractedResponseData.report_number,
      "Loss Damage Description": extractedResponseData.loss_damage_description,
    };
  };

  const handleExtractClaimSubmit = (displayValues, queryvalues) => {
    setProcessSubmit(true)
    const formData = new FormData();
    formData.append('policy_number', displayValues["Policy Number"] || queryvalues.policy);
    formData.append('loss_date_and_time', displayValues["Loss Date and Time"] || queryvalues.loss_date_and_time);
    formData.append('loss_type', displayValues["Type of Loss"] || queryvalues.loss_type);
    formData.append('loss_damage_description', displayValues["Loss Damage Description"] || queryvalues.loss_damage_description);
    formData.append('loss_address', queryvalues.street_number ?? displayValues["Loss Location"]);
    formData.append('loss_street', queryvalues.street_name);
    formData.append('loss_city', queryvalues.loss_city);
    formData.append('loss_state', queryvalues.loss_state);
    formData.append('loss_zip', queryvalues.loss_zip);
    formData.append('loss_country', queryvalues.loss_country);
    formData.append('police_fire_contacted', displayValues["Police/Fire Department Contacted?"] || queryvalues.police_fire_contacted);
    formData.append('report_number', displayValues["Report Number"] || queryvalues.report_number);
    formData.append('claim_reported_by', displayValues["Reported By"] || queryvalues.reported_by || queryvalues.claim_reported_by);
    formData.append('email', selectedEmail);
    submitClaimDetails(formData);
  }


  const submitClaimDetails = async (formData) => {
    const editedEmail = formData.get('email');
    const updatedFailureData = claimsDataState.failure.filter(
      claim => claim.email_id !== editedEmail
    );

    const newEditedSuccessClaim = {
      ...claimsDataState.failure.find(claim => claim.email_id === editedEmail),
      status: 'edited_success'
    };

    await axiosInstance.post('AI/email_to_fnol_edit/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        setClaimsDataState(prevData => ({
          ...prevData,
          failure: updatedFailureData,
          editedSuccess: [...prevData.editedSuccess, newEditedSuccessClaim]
        }));
        localStorage.setItem("claimIDofEditedEmail", JSON.stringify(response.data.Claim_id));
        localStorage.setItem("companyofEditedEmail", JSON.stringify(response.data.company_details));
        setQueryvalues(initialValues);
        setDisplayValues({})
        setProcessSubmit(false);
        setOpenPdf(false);
        setSuccessPopup(true);
      }).catch(error => {
        setProcessSubmit(false);
        setValidationError("An error occurred. Please try again later.");
        setOpenSnackbar(true);
      });
  };

  const handleInputChange = (field, value) => {
    setDisplayValues(prevValues => ({
      ...prevValues,
      [field]: value
    }));
    setQueryvalues(prevValues => ({
      ...prevValues,
      [field.toLowerCase().replace(/ /g, '_')]: value
    }));
  };

  const handleSave = () => {
    setEnableFields(false);
    setShowAddress(false);
  };

  useEffect(() => {
    setHasEmptyOrInvalidValues(
      Object.values(displayValues).some(value => !value) || propertyAddressValidation === null);
  }, [updateDisplay, displayValues, propertyAddressValidation]);

  useEffect(() => {
    setHasEmptyOrInvalidValues(Object.values(displayValues).some(value => !value) || propertyAddressValidation === null)
  }, [displayValues, propertyAddressValidation]);

  const handleValidateAddress = async (key, sectionName) => {
    setValidatingAddress(true);
    setPropertyAddressValidation(null);
    const addressToValidate = displayValues[key];
    try {
      const response = await axiosInstance.post('validate_address/',
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
        if (key === "Loss Location") {
          setPropertyAddressValidation(null);
        }
        setValidationError(
          "Address is not valid. Please check your address."
        );
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Address validation error:", error);
      if (key === "Loss Location") {
        setPropertyAddressValidation(null);
      }
      setValidationError(`${error.response.data.error} Please Check you Address again` ||
        "An error occurred during validation. Please try again later."
      );
      setOpenSnackbar(true);
    } finally {
      setValidatingAddress(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false)
  };

  const handleConfirmAddress = (spittedAddress, keys) => {
    if (keys === "Loss Location") {
      setQueryvalues(prevValues => ({
        ...prevValues,
        loss_address: spittedAddress.street_number || '',
        loss_street: spittedAddress.street_name || '',
        loss_city: spittedAddress.city || '',
        loss_state: spittedAddress.state || '',
        loss_zip: spittedAddress.zip_code || '',
        loss_country: spittedAddress.country || '',
      }));
      setDisplayValues(prevValues => ({
        ...prevValues,
        [keys]: suggestedAddress
      }));
      setPropertyAddressValidation("");
      setEditingAddress(false);
    }
    setShowAddress(false);
  };

  const handlePopupClose = () => {
    setSuccessPopup(false);
    setSelectedEmail('');
    setOpenPdf(false);
    localStorage.removeItem("companyofEditedEmail");
    localStorage.removeItem("claimIDofEditedEmail")
    setPropertyAddressValidation("");
    onClose();
  };

  const handleEmailDocumentClose = () => {
    setOpenPdf(false);
    setEnableFields(false);
  }

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleDocumentView = async (email) => {
    setLoadingDocuments((prevLoading) => ({ ...prevLoading, [email]: true }));
    try {
      const response = await axiosInstance.post(
        'get_email_to_fnol_documents/',
        {
          email: email,
          status: view,
        }
      );
      if (response.data.content) {
        setDocumentContent(response.data.content);
        setDocumentType(response.data.content_type);
        setDocumentName(response.data.document_name);
        setOpenDocument(true);
      } else {
        console.error("Error fetching document: No content received");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      setSnackbarSeverity("error");
      if (error.response && error.response.data && error.response.data.error) {
        setSnackbarMessage(error.response.data.error);
      } else {
        setSnackbarMessage("An error occurred while fetching the document.");
      }
      setSnackbarOpen(true);
    } finally {
      setLoadingDocuments((prevLoading) => ({ ...prevLoading, [email]: false }));
    }
  };

  const handleCloseDocument = () => {
    setOpenDocument(false);
    setDocumentContent(null);
    setDocumentType(null);
    setDocumentName("");
    setPropertyAddressValidation("");
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

  const handleEmailView = async (email, email_time, subject, body) => {
    setLoadingEmailView((prevLoading) => ({ ...prevLoading, [email]: true }));
    try {
      const response = await axiosInstance.post(
        'get_email_to_fnol_documents/',
        {
          email: email,
          status: emailStatusType,
        }
      );
      setSelectedEmailData({
        email_id: email,
        email_time: email_time,
        subject: subject,
        body: body,
        document_name: response.data.success ? response.data.document_name : null,
        content: response.data.success ? response.data.content : null,
        content_type: response.data.success ? response.data.content_type : null,
      });
      setOpenEmailView(true);
    } catch (error) {
      setSelectedEmailData({
        email_id: email,
        email_time: email_time,
        subject: subject,
        body: body,
        document_name: null,
        content: null,
        content_type: null,
      });
      setOpenEmailView(true);
    } finally {
      setLoadingEmailView((prevLoading) => ({ ...prevLoading, [email]: false }));
    }
  };

  const handleCloseEmailView = () => {
    setOpenEmailView(false);
    setSelectedEmailData(null);
  };

  const restrictedFields = [
    "Loss Location",
  ];

  const transformClaimsData = (data) => {
    const transformed = {
      claims: { columns: [], rows: [] }
    };
    transformed.claims.columns = [
      { Header: "Email ID", accessor: "emailId", align: "left" },
      { Header: "Subject", accessor: "subject", align: "left" },
      { Header: "Email Time", accessor: "emailTime", align: "left" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ];
    transformed.claims.rows = data.map((claim) => ({
      emailId: claim.email_id,
      subject: claim.subject,
      emailTime: claim.email_time,
      actions: (
        <MDBox display="flex" justifyContent="center" gap={1}>
          <Tooltip title="View Document" arrow placement="left">
            <MDButton
              variant="outlined"
              onClick={() => handleDocumentView(claim.email_id)}
              size="small"
              disabled={loadingDocuments[claim.email_id] || false}
              // startIcon={
              //   loadingDocuments[claim.email_id] ? (
              //     <CircularProgress size={16}  color="#53918e"/>
              //   ) : null // Explicitly render null when not loading
              // }
              startIcon={loadingDocuments[claim.email_id] && <CircularProgress size={16} />}
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
          {view !== "failure" ? (
            <Tooltip title="View Email" arrow placement="right">
              <MDButton
                variant="outlined"
                onClick={() => handleEmailView(claim.email_id, claim.email_time, claim.subject, claim.body)}
                size="small"
                disabled={loadingDocuments[claim.email_id] || false}
                // startIcon={
                //   loadingDocuments[claim.email_id] ? (
                //     <CircularProgress size={16}  color="#53918e"/>
                //   ) : null // Explicitly render null when not loading
                // }
                startIcon={loadingDocuments[claim.email_id] && <CircularProgress size={16} />}
                sx={{
                  borderColor: "#53918e",
                  color: "#53918e",
                  '&:hover': {
                    borderColor: "#53918e",
                    borderWidth: 2,
                  },
                }}
              >
                <MailIcon sx={{ color: "#53918e" }} />
              </MDButton>
            </Tooltip>
          ) : (
            !isUnderwriter && (
              <Tooltip title="Edit Document" arrow placement="right">
                <MDButton
                  variant="outlined"
                  onClick={() => handleEditClaim(claim.email_id, view)}
                  disabled={loadingEdit[claim.email_id] || false}
                  size="small"
                  // startIcon={
                  //   loadingDocuments[claim.email_id] ? (
                  //     <CircularProgress size={16}  color="#53918e"/>
                  //   ) : null // Explicitly render null when not loading
                  // }
                  startIcon={loadingEdit[claim.email_id] && <CircularProgress size={16} />}
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
            )
          )}
        </MDBox>
      )
    }));
    return transformed;
  };

  const handleDownload = (format) => {
    const getData = () => {
      if (view === "success") return claimsDataState.success;
      if (view === "failure") return claimsDataState.failure;
      if (view === "editedSuccess") return claimsDataState.editedSuccess;
      return [];
    };
    const data = getData().map((claim) => ({
      "Email ID": claim.email_id,
      "Subject": claim.subject,
      "Email Time": claim.email_time,
    }));

    if (format === "csv") {
      const csvHeaders = Object.keys(data[0]).join(',') + '\n';
      const csvRows = data.map(row => Object.values(row).join(',')).join('\n');
      const csvContent = csvHeaders + csvRows;
      const csvLink = document.createElement("a");
      csvLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
      csvLink.target = '_blank';
      csvLink.download = "Mail2Claim-emails-data.csv";
      csvLink.click();
    } else if (format === "pdf") {
      const doc = new jsPDF('landscape');
      const filename = "Mail2Claim-emails_report";
      const displayFilename = filename.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      doc.setFontSize(20);
      const textWidth = doc.getTextWidth(`${displayFilename}`);
      const textOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2;
      doc.text(`${displayFilename}`, textOffset, 22);
      addDateToPDF(doc, 28);
      doc.setFontSize(12);
      doc.text(`This report provides a detailed list of Mail2Claim emails data.`, 14, 40);
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
      XLSX.utils.book_append_sheet(workbook, worksheet, "Mail2Claim Emails Data");
      XLSX.writeFile(workbook, "Mail2Claim-emails-data.xlsx");
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
  const handleCancelClick = () => {
    setClickedCard("");
  };

  const getData = () => {
    if (view === "success") return claimsDataState.success;
    if (view === "failure") return claimsDataState.failure;
    if (view === "editedSuccess") return claimsDataState.editedSuccess;
    return [];
  };

  const buttonData = [
    { icon: <CheckCircleIcon />, label: "Success", view: "success", color: "success", numberOfClaims: processCount.success },
    { icon: <ErrorIcon />, label: "Failure", view: "failure", color: "error", numberOfClaims: processCount.failure },
    { icon: <EditIcon />, label: "Edited Success", view: "editedSuccess", color: "primary", numberOfClaims: processCount.editedSuccess },
  ];

  const tableData = transformClaimsData(getData());
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
                      primary={<Typography variant="h6">Mail2Claim Claims Information</Typography>}
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
                        {button.label} ({button.numberOfClaims})
                      </span>
                    </MDButton>
                  ))}
                </MDBox>
                <MDBox>
                  <IconButton
                    sx={{ cursor: "pointer", color: "#53918e" }}
                    onClick={handleCancelClick}
                  >
                    <CancelIcon sx={{ fontSize: "1.5rem" }} />
                  </IconButton>
                </MDBox>
              </MDBox>
            </MDBox>
            <MDBox pt={3} px={3} py={3}>
              <MDTypography sx={{ fontSize: "1rem" }}><InfoOutlinedIcon sx={{ mr: 1, color: "#53918e" }} fontSize="inherit" />No Claims found.</MDTypography>
            </MDBox>
          </Card>
        </VuiBox>
      </MDBox>
    )
  }

  const companyData = JSON.parse(localStorage.getItem("companyofEditedEmail"));
  const claimID = localStorage.getItem("claimIDofEditedEmail")
  let imageSrc = `data:image/${companyData && companyData.image_type};base64,${companyData && companyData.image_data}`;

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
                    primary={<Typography variant="h6">Mail2Claim Claims Information</Typography>}
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
                      {button.label} &nbsp; ({button.numberOfClaims})
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
                  onClick={handleCancelClick}
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
              table={{ columns: tableData.claims.columns, rows: tableData.claims.rows }}
              canSearch
              isSorted={true}
              entriesPerPage={true}
              pagination={{ variant: "contained", color: "light" }}
              showTotalEntries={true}
              noEndBorder
              tableRef={tableRef}
              searchKeys={["emailId", "subject", "emailTime"]}
            />
          </MDBox>
        </Card>
      </VuiBox>
      {/* Hidden Table for PDF Generation */}
      <table ref={pdfTableRef} style={{ display: 'none' }}>
        <thead>
          <tr>
            <th>Email ID</th>
            <th>Subject</th>
            <th>Email Time</th>
          </tr>
        </thead>
        <tbody>
          {getData().map((claim, index) => (
            <tr key={index}>
              <td>{claim.email_id}</td>
              <td>{claim.subject}</td>
              <td>{claim.email_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
      {/* Email View Dialog */}
      <Dialog
        open={openEmailView}
        onClose={handleCloseEmailView}
        fullWidth
        maxWidth="md"
        disableBackdropClick={true}
      >
        <DialogTitle>Email View</DialogTitle>
        <DialogContent>
          {loadingEmailView[selectedEmailData?.email_id] && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
              <CircularProgress />
            </Box>
          )}
          {/* Only show EmailView when NOT loading for the specific email */}
          {!loadingEmailView[selectedEmailData?.email_id] && selectedEmailData && (
            <EmailView
              emailDetails={selectedEmailData}
              handleOpenDocumentViewer={() => {
                setDocumentContent(selectedEmailData.content);
                setDocumentType(selectedEmailData.content_type);
                setDocumentName(selectedEmailData.document_name);
                setOpenDocument(true);
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmailView} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
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
                      marginTop: '35px'
                    }}
                  >
                    Extracted claim FNOL details.
                  </Typography>
                  {hasEmptyOrInvalidValues && (
                    <Typography style={{ color: "red", marginBottom: "10px", textAlign: 'center' }}>
                      Please provide mandatory details in the document to claim
                      the policy.
                    </Typography>
                  )}
                  <Grid className="fetch-idp-data">
                    {!updateDisplay ? (
                      <>
                        <Typography variant="h5" className="ipd-titles Nasaliza">Policy Number</Typography>
                        <Grid container spacing={2} style={{
                          marginBottom: '7px', marginLeft:
                            // isMobile ? '0' :
                            '15px'
                        }}>
                          {Object.entries(displayValues)
                            .filter(([key]) => key === "Policy Number" || key === "Property Address")
                            .map(([key, value]) => (
                              <React.Fragment key={key}>
                                <Grid item xs={5} sm={5} md={5.5} style={{ fontWeight: 550, fontSize: 13 }}>
                                  {key}
                                </Grid>
                                <Grid item xs={1} sm={1} md={1}>
                                  :
                                </Grid>
                                <Grid item xs={6} sm={6} md={5.5}>
                                  <span style={{ fontWeight: 500, fontSize: 13 }}>
                                    {value ? (
                                      value
                                    ) : (
                                      <span style={{ color: "red", fontWeight: 500, fontSize: 13 }}>
                                        {`${key} required`}
                                      </span>
                                    )}
                                  </span>
                                </Grid>
                              </React.Fragment>
                            ))}
                        </Grid>
                        <Typography variant="h5" className="ipd-titles Nasaliza">Loss Details</Typography>
                        <Grid container spacing={2} style={{
                          marginBottom: '7px', marginLeft:
                            // isMobile ? '0' : 
                            '15px'
                        }}>
                          {Object.entries(displayValues)
                            .filter(([key]) => ["Loss Date and Time", "Loss Location", "Type of Loss", "Loss Damage Description"].includes(key))
                            .map(([keys, value]) => {
                              const isRestricted = restrictedFields.includes(keys);
                              const showSuggestedAddress = showAddress && suggestedAddress && validatedAddressKey === keys;
                              return (
                                <React.Fragment key={keys}>
                                  <Grid item xs={5} sm={5} md={5.5} style={{ fontWeight: 550, fontSize: 13 }}>
                                    {keys}
                                    {isRestricted && keys === "Loss Location" && (
                                      <>
                                        {!editingAddress && propertyAddressValidation !== true && (
                                          <ToolTip title="Edit" arrow placement="bottom">
                                            <IconButton
                                              size="small"
                                              style={{ marginLeft: "0.5rem", color: "#010066" }}
                                              onClick={() => {
                                                setEditingAddress(true);
                                                setPropertyAddressValidation(null);
                                              }}
                                            >
                                              <EditIcon fontSize="small" />
                                            </IconButton>
                                          </ToolTip>
                                        )}
                                        <ToolTip
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

                                        </ToolTip>
                                        {editingAddress && propertyAddressValidation !== true && (
                                          <StyledButtonComponent
                                            buttonWidth={80}
                                            size="small"
                                            sx={{ marginLeft: 2 }}
                                            onClick={() => handleValidateAddress(keys, "Loss Location")}
                                            disabled={value === null}
                                          >
                                            Validate
                                          </StyledButtonComponent>
                                        )}
                                      </>
                                    )}
                                  </Grid>
                                  <Grid item xs={1} sm={1} md={1}>
                                    :
                                  </Grid>
                                  <Grid item xs={6} sm={6} md={5.5}>
                                    {keys === "Loss Location" ? (
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
                                          name={keys}
                                          value={displayValues[keys]}
                                          onChange={(e) => handleInputChange(keys, e.target.value)}
                                        />
                                      ) : (
                                        <span style={{ textAlign: "left", fontWeight: 500, fontSize: 13 }}>
                                          {value ? (
                                            <>
                                              {value}
                                              {keys === "Loss Location" && propertyAddressValidation === null && !editingAddress ? (
                                                <span style={{ color: "red", fontWeight: 500, fontSize: 12 }}>
                                                  <br />
                                                  Address not validated
                                                </span>
                                              ) : null}
                                            </>
                                          ) : (
                                            <span style={{ textAlign: "left", color: "red", fontWeight: 500, fontSize: 12 }}>
                                              required
                                            </span>
                                          )}
                                        </span>
                                      )
                                    ) : enableFields ? (
                                      <TextField
                                        sx={{
                                          '& .MuiOutlinedInput-root': {
                                            height: '35px',
                                            backgroundColor: "none"
                                          },
                                        }}
                                        variant="outlined"
                                        required
                                        name={keys}
                                        value={displayValues[keys]}
                                        onChange={(e) => handleInputChange(keys, e.target.value)}
                                      />
                                    ) : (
                                      <span style={{ textAlign: "left", fontWeight: 500, fontSize: 13 }}>
                                        {value ? (
                                          value
                                        ) : (
                                          <span style={{ color: "red", fontWeight: 500, fontSize: 12 }}>
                                            required
                                          </span>
                                        )}
                                      </span>
                                    )
                                    }
                                  </Grid>
                                  {showSuggestedAddress && (
                                    <Grid container sx={{
                                      mt: 1, alignItems: 'center', marginLeft:
                                        //  isMobile ? '0' :
                                        '20px'
                                    }}>
                                      <Grid item xs={6.5}></Grid>
                                      <Grid item xs={5.5} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="caption" sx={{ color: "#0B70FF", mr: 1 }}>
                                          {suggestedAddress}
                                        </Typography>
                                        <Checkbox
                                          color="primary"
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              handleConfirmAddress(spittedAddress, keys);
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
                        <Typography variant="h5" className="ipd-titles Nasaliza">Report Details</Typography>
                        <Grid container spacing={2} style={{
                          marginBottom: '7px', marginLeft:
                            // isMobile ? '0' :
                            '15px'
                        }}>
                          {Object.entries(displayValues)
                            .filter(([key]) => ["Reported By", "Report Number", "Police/Fire Department Contacted?"].includes(key))
                            .map(([key, value]) => (
                              <React.Fragment key={key}>
                                <Grid item xs={5} sm={5} md={5.5} style={{ fontWeight: 550, fontSize: 13 }}>
                                  {key}
                                </Grid>
                                <Grid item xs={1} sm={1} md={1}>
                                  :
                                </Grid>
                                <Grid item xs={6} sm={6} md={5.5}>
                                  {enableFields ? (
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
                                      value={displayValues[key]}
                                      onChange={(e) => handleInputChange(key, e.target.value)}
                                    />
                                  ) : (
                                    <span style={{ fontWeight: 500, fontSize: 13 }}>
                                      {value ? (
                                        value
                                      ) : (
                                        <span style={{ color: "red", fontWeight: 500, fontSize: 13 }}>
                                          {`${key} required`}
                                        </span>
                                      )}
                                    </span>
                                  )}
                                </Grid>
                              </React.Fragment>
                            ))}
                        </Grid>
                      </>
                    ) : (
                      <></>
                    )}
                    <Grid container justifyContent="center" alignItems="center" style={{ margin: "3rem 1px" }} spacing={1}>
                      <Grid item>
                        {enableFields ? (
                          <ToolTip title="Save" arrow placement="right">
                            <StyledButtonComponent buttonWidth={100}
                              onClick={handleSave}
                            >
                              Save
                            </StyledButtonComponent>
                          </ToolTip>
                        ) : (
                          <ToolTip title="Edit" arrow placement="right">
                            <StyledButtonComponent buttonWidth={100}
                              onClick={() => setEnableFields(true)}
                              startIcon={<EditIcon />}
                            >
                              Edit
                            </StyledButtonComponent>
                          </ToolTip>
                        )}
                      </Grid>
                      <Grid item>
                        <StyledButtonComponent buttonWidth={150} disableColor={"#B6E3FF"}
                          onClick={() => handleExtractClaimSubmit(displayValues, queryvalues)}
                          disabled={hasEmptyOrInvalidValues || enableFields || editingAddress}>
                          Submit Claim
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
      {/* start of the success popup  */}
      {successPopup &&
        <Dialog open={successPopup} onClose={handlePopupClose} fullWidth maxWidth="md" PaperProps={{ style: { maxHeight: '80vh' } }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ alignItems: 'center', mb: 10, mt: 4 }}>
              {companyData.ic_logo_path && (
                <img
                  src={imageSrc}
                  alt="Insurance Company Logo"
                  style={{ width: '35%' }}
                // style={{ width: isMobile ? '80%' : '35%' }} 
                />
              )}
            </Box>
            {/* {isMobile && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: 'green' }} />
              </Box>
            )} */}
            <Grid container justifyContent="center">
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  {/* {!isMobile && (
                    <CheckCircleIcon sx={{ fontSize: 40, mr: 2, color: 'green' }} />
                  )} */}
                  <Typography className='Nasaliza' style={{
                    fontSize:
                      //  isMobile ? '1rem' :
                      '1.5rem'
                  }}>
                    Claim Submitted Successfully!
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 2, textAlign: 'center' }} className='Nasaliza'>
                  Claim ID:{' '}
                  <span style={{ color: companyData?.ic_primary_color || '#0B70FF' }}>
                    {claimID && claimID}
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
      {/* end of the success popup */}
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
    </MDBox>
  );
}

export default EmailtoFNOLClaimsView;
