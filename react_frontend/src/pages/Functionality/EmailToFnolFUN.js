import '../IDP_FNOL/Email_to_FNOL.css';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import parse from 'react-html-parser';
import { ChevronLeft, Paperclip, Clock, Tag } from 'lucide-react';
import { Tooltip as ToolTip } from '@mui/material';
import axios from 'axios';
import {
    Container, Grid, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography,
    Button, useTheme, useMediaQuery, CircularProgress, Card, TextField, Backdrop, IconButton, Checkbox, Snackbar,
} from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from '@material-ui/core';
import MailIcon from '@mui/icons-material/Mail';
import CheckIcon from '@mui/icons-material/Check';
import DownloadIcon from '@mui/icons-material/Download';
import { Cell, ResponsiveContainer } from 'recharts';
import { Visibility, Edit as EditIcon } from '@mui/icons-material';
import StyledButtonComponent from "../../components/StyledButton.js";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import viewDocument from "../../assets/viewDocument.png";
import '../IDP_FNOL/EmailTemplate.css';
import { CheckCircle as ValidateIcon, Warning as WarningIcon, } from "@mui/icons-material"
import MuiAlert from '@mui/material/Alert';
import ArticleIcon from '@mui/icons-material/Article';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import useNetworkStatus from '../../components/ErrorPages/UseNetworkStatus.js';
import PreviewError from "../../components/ErrorPages/PreviewError.js";
import { BarChart, Bar, XAxis, YAxis, } from "recharts";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

// CustomActiveShapePieChart Component
const CustomActiveShapePieChart = ({
    successEmails = [],
    failedEmails = [],
    editedSuccessEmails = [],
    fetchedEmails = [],
}) => {
    const totalEmails =
        successEmails.length + failedEmails.length + editedSuccessEmails.length;
    const successPercentage = totalEmails
        ? ((successEmails.length) / totalEmails) * 100
        : 0;
    const failurePercentage = totalEmails
        ? (failedEmails.length / totalEmails) * 100
        : 0;
    const editedSuccessPercentage = totalEmails
        ? (editedSuccessEmails.length / totalEmails) * 100
        : 0;
    const data =
        totalEmails > 0
            ? [
                {
                    name: "Success",
                    percentage: parseFloat(successPercentage.toFixed(2)),
                    count: successEmails.length,
                },
                {
                    name: "Edited Success",
                    percentage: parseFloat(editedSuccessPercentage.toFixed(2)),
                    count: editedSuccessEmails.length,
                },
                {
                    name: "Failure",
                    percentage: parseFloat(failurePercentage.toFixed(2)),
                    count: failedEmails.length,
                },
            ]
            : [{ name: "Total Processed", percentage: 0, count: 0 }];
    return (
        <Box>
            <Typography
                variant="h6"
                style={{
                    textAlign: "center",
                    marginBottom: 16,
                    color: "#001660",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                }}
            >
                Email Status Distribution
            </Typography>
            <Grid container justifyContent="center">
                <Grid item>
                    <Box display="flex" flexDirection="row" alignItems="flex-start" sx={{ marginTop: '2rem' }}>
                        {/* Graph Section */}
                        <ResponsiveContainer width={300} height={280}>
                            <BarChart
                                data={data}
                                margin={{ top: 10, right: 20, bottom: 30, left: 10 }}
                            >
                                <defs>
                                    <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#4CAF50" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#4CAF50" stopOpacity={0.4} />
                                    </linearGradient>
                                    <linearGradient id="editedGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2196F3" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#2196F3" stopOpacity={0.4} />
                                    </linearGradient>
                                    <linearGradient id="failureGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#F44336" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#F44336" stopOpacity={0.4} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    stroke="#001660"
                                    tick={{
                                        fontSize: 10,
                                        fill: "#001660",
                                        textAnchor: "middle",
                                    }}
                                    interval={0}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="#001660"
                                    tick={{ fontSize: 10, fill: "#001660" }}
                                    width={30}
                                    domain={[0, 100]}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Bar
                                    dataKey="percentage"
                                    radius={[4, 4, 0, 0]}
                                    barSize={16}
                                    label={{
                                        position: "insideTop",
                                        offset: -8,
                                        fill: "#001660",
                                        fontSize: 10,
                                        fontWeight: "bold",
                                        formatter: (value) => `${value.toFixed(1)}%`,
                                    }}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`url(#${index === 0
                                                ? "successGradient"
                                                : index === 1
                                                    ? "editedGradient"
                                                    : "failureGradient"
                                                })`}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        {/* Labels Section */}
                        <Box
                            justifyContent="space-between"
                            style={{
                                width: "200px",
                                height: "220px",
                                padding: "8px",
                                borderRadius: "8px",
                                marginLeft: "20px",
                            }}
                        >
                            {[
                                {
                                    label: "Fetched",
                                    value: fetchedEmails,
                                    color: "#2196F3",
                                    icon: "📤",
                                },
                                {
                                    label: "Success",
                                    value: successEmails.length,
                                    color: "#4CAF50",
                                    icon: "✅",
                                },
                                {
                                    label: "Edited Success",
                                    value: editedSuccessEmails.length,
                                    color: "#2196F3",
                                    icon: "✏️",
                                },
                                {
                                    label: "Failure",
                                    value: failedEmails.length,
                                    color: "#F44336",
                                    icon: "X",
                                },
                                {
                                    label: "Total Processed",
                                    value: totalEmails,
                                    color: "#001660",
                                    icon: "📊",
                                },
                            ].map((item, index) => (
                                <Box
                                    key={index}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    style={{
                                        padding: "6px 8px",
                                        borderRadius: "6px",
                                        backgroundColor: "#fff",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                        marginBottom: index < 4 ? "4px" : "0",
                                    }}
                                >
                                    <Box display="flex" alignItems="center">
                                        <Box
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: item.color,
                                                color: "#fff",
                                                borderRadius: "50%",
                                                marginRight: "6px",
                                                fontSize: "0.7rem",
                                            }}
                                        >
                                            {item.icon}
                                        </Box>
                                        <Typography
                                            style={{
                                                fontSize: "0.75rem",
                                                fontWeight: "bold",
                                                color: "#333",
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        style={{
                                            fontSize: "1rem",
                                            fontWeight: "bold",
                                            color: item.color,
                                        }}
                                    >
                                        {item.value}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

// custom Email template
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

const EmailView = ({ subject, receivedTime, documentName, emailDetails, emailBody, handleOpenDocumentViewer }) => {
    const cleanBody = removeCidReferencesAndLinks(emailBody);
    /* eslint-disable no-unused-vars */
    const [email, setEmail] = useState({
        subject: subject,
        sender: emailDetails.sender_name || 'Unknown Sender',
        senderEmail: emailDetails.sender_email || 'unknown@example.com',
        time: receivedTime,
        body: cleanBody,
        attachments: documentName || [],
        tags: emailDetails.tags || []
    });
    return (
        <div className="email-view">
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <div className="header-left">
                        <ChevronLeft className="back-button" />
                        <h1 className="subject">{email.subject ? email.subject : '_'}</h1>
                    </div>
                </div>
            </header>
            {/* Email Content */}
            <main className="main-content">
                <div className="email-container">
                    {/* Sender Info */}
                    <div className="sender-info">
                        <div>
                            <p className="sender-email">{`<${emailDetails.email}>`}</p>
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
                    {email.attachments && email.attachments.length > 0 && (
                        <div className="attachments">
                            <h3 className="attachments-title">Attachments:</h3>
                            <div className="attachments-list">
                                <div
                                    className="attachment"
                                    onClick={handleOpenDocumentViewer}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Paperclip className="attachment-icon" />
                                    <span className="attachment-name">{email.attachments}</span>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const ExtractedDataView = ({ ExtractedData }) => {
    const mappedData = (ExtractedData) => {
        const addressParts = [
            ExtractedData.street_number || ExtractedData.loss_address,
            ExtractedData.street_name || ExtractedData.loss_street,
            ExtractedData.loss_city,
            ExtractedData.loss_state,
            ExtractedData.loss_zip,
            ExtractedData.loss_country
        ].filter(part => part);
        const lossLocation = addressParts.length ? addressParts.join(', ') : undefined;
        return {
            "Loss Location": lossLocation,
        };
    }

    const userFriendlyNames = {
        policyDetails: {
            "Policy Number": ExtractedData.policy_number,
            "Property Address": ExtractedData.loss_property,
        },
        lossDetails: {
            "Loss Date and Time": ExtractedData.loss_date_and_time,
            "Type of Loss": ExtractedData.loss_type,
            "Loss Location": mappedData(ExtractedData)["Loss Location"],
            "Loss Damage Description": ExtractedData.loss_damage_description,
        },
        reportDetails: {
            "Reported By": ExtractedData.claim_reported_by,
            "Police/Fire Department Contacted?": ExtractedData.police_fire_contacted ? 'True' : 'False',
            "Report Number": ExtractedData.report_number,
        },
    };
    return (
        <DialogContent>
            <Grid className="fetch-idp-data" >
                <Typography
                    variant="h5"
                    className="ipd-titles Nasaliza"
                    style={{
                        color: "#010066",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        marginTop: "2rem"
                    }}
                >
                    Policy Details
                </Typography>
                <Grid container spacing={2} style={{ marginBottom: '7px', }}>
                    {userFriendlyNames.policyDetails && Object.entries(userFriendlyNames.policyDetails).map(([key, value]) => {
                        return (
                            <React.Fragment key={key}>
                                <Grid item xs={5} sm={5} md={5} sx={{ fontWeight: 550, fontSize: 13, textAlign: "left", display: 'flex', alignItems: 'center' }}>
                                    {key}
                                </Grid>
                                <Grid item xs={1} sm={1} md={1.5} style={{ textAlign: "left" }}>
                                    :
                                </Grid>
                                <Grid item xs={6} sm={6} md={5.5} style={{ fontWeight: 550, fontSize: 13, textAlign: "left" }}>
                                    {value ? value : "-"}
                                </Grid>
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
                        marginTop: "2rem"
                    }}
                >
                    Loss Details
                </Typography>
                <Grid container spacing={2} style={{ marginBottom: '7px', }}>
                    {userFriendlyNames.lossDetails && Object.entries(userFriendlyNames.lossDetails).map(([key, value]) => {
                        return (
                            <React.Fragment key={key}>
                                <Grid item xs={5} sm={5} md={5} sx={{ fontWeight: 550, fontSize: 13, textAlign: "left", display: 'flex', alignItems: 'center' }}>
                                    {key}

                                </Grid>
                                <Grid item xs={1} sm={1} md={1.5} style={{ textAlign: "left" }}>
                                    :
                                </Grid>
                                <Grid item xs={6} sm={6} md={5.5} style={{ fontWeight: 550, fontSize: 13, textAlign: "left" }}>
                                    {value ? value : "-"}
                                </Grid>
                            </React.Fragment>
                        )
                    })}
                </Grid>
                <Typography variant="h5" className="ipd-titles Nasaliza" style={{ color: "#010066", display: "flex", alignItems: "center", justifyContent: "flex-start", marginTop: "2rem" }}>
                    Report Details
                </Typography>
                <Grid container spacing={2} style={{ marginBottom: '7px', }}>
                    {userFriendlyNames.reportDetails && Object.entries(userFriendlyNames.reportDetails).map(([key, value]) => (
                        <React.Fragment key={key}>
                            <Grid item xs={5} sm={5} md={5} style={{ fontWeight: 550, fontSize: 13, textAlign: "left" }}>
                                {key}
                            </Grid>
                            <Grid item xs={1} sm={1} md={1.5} style={{ textAlign: "left" }}>
                                :
                            </Grid>
                            <Grid item xs={6} sm={6} md={5.5} style={{ fontWeight: 550, fontSize: 13, textAlign: "left" }}>
                                {value ? value : "-"}
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            </Grid>
        </DialogContent>
    )
}

const ShowClaimID = ({ ClaimID }) => {
    return (
        <Box sx={{ textAlign: 'center' }}>
            <Grid container justifyContent="center" style={{ marginTop: "3rem" }}>
                <Grid item xs={12} >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <CheckCircleIcon sx={{ fontSize: 40, mr: 2, color: 'green' }} />
                        <Typography className='Nasaliza' style={{ fontSize: "1.5rem" }}>
                            Created Claim ID Details!
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant='h6' sx={{ mb: 2, textAlign: 'center' }} className='Nasaliza'>
                        Claim ID :{' '}
                        <span style={{ color: '#0B70FF' }}>
                            {ClaimID && ClaimID}
                        </span>
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default function EmailToFnolFun() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    /* eslint-disable no-unused-vars */
    const [visibleCards, setVisibleCards] = useState([]);
    const [cardsLoaded, setCardsLoaded] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [emails, setEmails] = useState([]);
    const [message, setMessage] = useState('');
    const [startBtnDisabled, setStartBtnDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [processLoading, setProcessLoading] = useState(false);
    const [successEmails, setSuccessEmails] = useState([]);
    const [failedEmails, setFailedEmails] = useState([]);
    const [editedSuccessEmails, setEditedSuccessEmails] = useState([]);
    const [afterEmailsProcess, setAfterEmailsProcess] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState('');
    const [pdfUrl, setPdfUrl] = useState(null);
    const [missingFields, setMissingFields] = useState([]);
    const [subject, setSubject] = useState("");
    const [receivedTime, setReceivedTime] = useState("");
    const [openPdf, setOpenPdf] = useState(false);
    const [content, setContent] = useState('');
    const [contentType, setContentType] = useState(null);
    const [documentName, setDocumentName] = useState("");
    const [emailStatusType, setEmailStatusType] = useState("");
    const [ViewEmailsReport, setViewEmailsReport] = useState(true);
    const SuccessClick = useRef(null);
    const ViewDocument = useRef(null);
    const [enableFields, setEnableFields] = useState(false);
    const [hasEmptyOrInvalidValues, setHasEmptyOrInvalidValues] = useState(true);
    const [displayValues, setDisplayValues] = useState({});
    const [queryvalues, setQueryvalues] = useState(initialValues);
    const [processSubmit, setProcessSubmit] = useState(false);
    const [updateDisplay, setUpdateDisplay] = useState(false);
    const [successPopup, setSuccessPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const UploadDocument = useRef(null)
    const [tableData, setTableData] = useState([]);
    const [openRow, setOpenRow] = useState(null);
    const [showFullBody, setShowFullBody] = useState(false);
    const [emailBody, setEmailBody] = useState('');
    const [openEmailTemplate, setOpenEmailTemplate] = useState(false);
    const [currentSenderEmail, setCurrentSenderEmail] = useState("");
    const [showAddress, setShowAddress] = useState(false);
    const [suggestedAddress, setSuggestedAddress] = useState(null);
    const [validatedAddressKey, setValidatedAddressKey] = useState("");
    const [editingAddress, setEditingAddress] = useState(false);
    const [propertyAddressValidation, setPropertyAddressValidation] = useState("");
    const [validatingAddress, setValidatingAddress] = useState(false);
    const [addressValidated, setAddressValidated] = useState(false);
    const [spittedAddress, setSpittedAddress] = useState(null);
    const [validationError, setValidationError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage,] = useState('');
    const [snackbarSeverity,] = useState('success');
    const [openResultData, setOpenResultData] = useState(false);
    const [openExtractedData, setOpenExtractedData] = useState(false);
    const [extractedData, setExtractedData] = useState("");
    const [claimidfromResponse, setClaimidfromResponse] = useState("");
    const navigate = useNavigate();
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_URL,
        withCredentials: true
    });

    useEffect(() => {
        const storedEmails = JSON.parse(localStorage.getItem('EmailstoFnol'));
        if (storedEmails && storedEmails.length > 0) {
            setEmails(storedEmails);
            setCardsLoaded(true);
            setStartBtnDisabled(true);
        }
    }, []);

    useEffect(() => {
        if (cardsLoaded) {
            const timeoutIds = [];
            emails.forEach((email, index) => {
                timeoutIds.push(
                    setTimeout(() => {
                        setVisibleCards(prevVisibleCards => [...prevVisibleCards, { email: email[0], subject: email[1], id: index }]);
                    }, index * 500)
                );
            });
            return () => {
                setCardsLoaded(false);
                timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
            };
        }
    }, [cardsLoaded, emails]);

    const handleNetworkError = useCallback((path) => {
        navigate(path);
    }, [navigate]);
    const { setNetworkError, SnackbarComponent } = useNetworkStatus({}, handleNetworkError);
    const handleStartButtonClick = () => {
        setLoading(true);
        axiosInstance.post('AI/trigger_email_parsing/')
            .then(response => {
                if (response.data.status === "success" && response.data.sender_emails.length > 0) {
                    setMessage('');
                    localStorage.setItem("EmailstoFnol", JSON.stringify(response.data.sender_emails));
                    setEmails(response.data.sender_emails);
                    setCardsLoaded(true);
                    setStartBtnDisabled(true);
                    localStorage.setItem('startBtnDisabled', 'true');
                } else {
                    setMessage('No Emails To Fetch');
                }
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                if (error.response) {
                    const { status } = error.response;
                    const errorMessage = error.response.data.message || "A server error occurred. Please try again later.";
                    const errorSource = error.response.data.api || "Email Fetch";
                    const userName = localStorage.getItem('userName') || 'Unknown User';
                    console.error('Error fetching emails:', {
                        errorMessage: errorMessage,
                        errorSource: errorSource,
                        username: userName,
                        status: status
                    });
                    setMessage(errorMessage);
                    setNetworkError({
                        errorMessage: errorMessage,
                        errorSource: errorSource,
                        username: userName,
                        status: status
                    });
                } else {
                    setMessage(error.message || "An unexpected error occurred.");
                }
            });
    };

    const ViewReportClick = async () => {
        await setAfterEmailsProcess(true);
        if (SuccessClick.current) {
            SuccessClick.current.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error('Footer reference is null');
            setMessage('Could not scroll to footer. Please check the reference.');
        }
    };

    const handleProcessButtonClick = () => {
        setProcessLoading(true);
        axiosInstance.post('AI/process_emails/')
            .then(response => {
                if (response.data.message === "Email processing Successful.") {
                    setMessage("Email processed Successfully");
                    localStorage.removeItem("EmailstoFnol");
                    setProcessing(true);
                    setStartBtnDisabled(false);
                    localStorage.removeItem('startBtnDisabled');
                    setSuccessEmails(response.data.Success_mails);
                    setFailedEmails(response.data.Failure_mails);
                    setViewEmailsReport(true);
                    ViewReportClick();
                }
                setProcessLoading(false);
            })
            .catch(error => {
                setProcessLoading(false);
                if (error.response) {
                    const { status } = error.response;
                    const errorMessage = error.response.data.message || "A server error occurred. Please try again later.";
                    const errorSource = error.response.data.errorSource || "Email Processing";
                    const userName = localStorage.getItem('userName') || 'Unknown User';
                    console.error('Error processing emails:', {
                        errorMessage: errorMessage,
                        errorSource: errorSource,
                        username: userName,
                        status: status
                    });
                    setMessage(errorMessage);
                    setNetworkError({
                        errorMessage: errorMessage,
                        errorSource: errorSource,
                        username: userName,
                        status: status
                    });
                } else {
                    setMessage(error.message || "An unexpected error occurred.");
                }
            });
    };

    useEffect(() => {
        if (processing) {
            const intervalId = setInterval(() => {
                setVisibleCards(prevVisibleCards => {
                    if (prevVisibleCards.length === 1) {
                        clearInterval(intervalId);
                        setProcessing(false);
                        setEmails([]);
                        return [];
                    }
                    return prevVisibleCards.slice(1);
                });
            }, 5000);

            return () => clearInterval(intervalId);
        }
    }, [processing]);

    const handleClickOpen = (email, mailtype, index) => {
        setOpenRow(index);
        setEmailStatusType(mailtype);
        const formData = new FormData();
        formData.append('email', email);
        formData.append('status', mailtype);
        setCurrentSenderEmail(email);
        axiosInstance.post('AI/get_document_by_email/', formData)
            .then(response => {
                if (response.data.success) {
                    if (response.data.content_type === "pdf") {
                        const pdfBytes = Uint8Array.from(atob(response.data.content), c => c.charCodeAt(0));
                        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                        const url = URL.createObjectURL(blob);
                        setPdfUrl(url);
                    }
                    setContentType(response.data.content_type);
                    setContent(response.data.content);
                    setSubject(response.data.subject);
                    setReceivedTime(response.data.email_time)
                    setEmailBody(response.data.body);
                    setMissingFields(response.data.Errors);
                    setDocumentName(response.data.document_name);
                    const extractedResponseData = response.data.Extracted_data;
                    setExtractedData(extractedResponseData);
                    setQueryvalues(extractedResponseData);
                    setClaimidfromResponse(response.data.claim_id);
                    const displayExtractedData = mapResponseToDisplayFields(extractedResponseData);
                    setDisplayValues(displayExtractedData);
                } else {
                    console.error('Error fetching PDF:', response.data.error);
                }
            })
            .catch(error => {
                console.error(error);
            });
        setSelectedEmail(email);
        setOpen(true);
    };

    const mapResponseToDisplayFields = (extractedResponseData) => {
        return {
            "Policy Number": extractedResponseData.policy_number,
            "Reported By": extractedResponseData.claim_reported_by,
            "Loss Date and Time": extractedResponseData.loss_date_and_time,
            "Type of Loss": extractedResponseData.loss_type,
            "Loss Location": extractedResponseData.loss_location,
            "Police/Fire Department Contacted?": extractedResponseData.police_fire_contacted ? 'True' : 'False',
            "Report Number": extractedResponseData.report_number,
            "Loss Damage Description": extractedResponseData.loss_damage_description,
        };
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedEmail('');
        setContent('');
        setContentType(null);
        setMissingFields([]);
        setDisplayValues({});
        setQueryvalues(initialValues);
        setUpdateDisplay(false)
        setErrorMessage("");
        setHasEmptyOrInvalidValues(true);
        setOpenRow(null);
    };
    const handleExtractClaimSubmit = (displayValues, queryvalues) => {
        setEdit(true)
        setProcessSubmit(true)
        const formData = new FormData();
        formData.append('policy_number', displayValues["Policy Number"] || queryvalues.policy);
        formData.append('loss_date_and_time', displayValues["Loss Date and Time"] || queryvalues.loss_date_and_time);
        formData.append('loss_type', displayValues["Type of Loss"] || queryvalues.loss_type);
        formData.append('loss_damage_description', displayValues["Loss Damage Description"] || queryvalues.loss_damage_description);
        formData.append('loss_address', queryvalues.street_number);
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
        await axiosInstance.post('AI/email_to_fnol_edit/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                localStorage.setItem("claimID", JSON.stringify(response.data.Claim_id));
                localStorage.setItem("company", JSON.stringify(response.data.company_details));
                setQueryvalues(initialValues);
                setDisplayValues({})
                setMissingFields([])
                setProcessSubmit(false);
                setOpenPdf(false);
                setSuccessPopup(true);
                // 1. Find and remove ALL matching emails from failedEmails
                const removedEmails = failedEmails.filter(emailData => emailData.email === currentSenderEmail);
                const updatedFailedEmails = failedEmails.filter(emailData => emailData.email !== currentSenderEmail);
                // 2. Add the removed emails with full data to editedSuccessEmails
                const updatedEditedSuccessEmails = [
                    ...editedSuccessEmails,
                    ...removedEmails.map(emailData => {
                        return {
                            email: emailData.email,
                            Subject: emailData.Subject,
                            email_time: emailData.email_time,
                        };
                    })
                ];
                // 3. Update tableData with the changes
                setTableData([
                    ...successEmails.map(emailData => ({ ...emailData, status: 'success' })),
                    ...updatedEditedSuccessEmails.map(emailData => ({ ...emailData, status: 'edited-success' })),
                    ...updatedFailedEmails.map(emailData => ({ ...emailData, status: 'failure' }))
                ]);
                // 4. Update other state variables
                setFailedEmails(updatedFailedEmails);
                setEditedSuccessEmails(updatedEditedSuccessEmails);
                setSuccessPopup(true);
            }).catch(error => {
                console.error(error);
                setProcessSubmit(false);
                setErrorMessage("An error occurred. Please try again later.");
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
        setHasEmptyOrInvalidValues(Object.values(displayValues).some(value => !value));
    }, [updateDisplay, displayValues]);
    useEffect(() => {
        setHasEmptyOrInvalidValues(Object.values(displayValues).some(value => !value));
    }, [displayValues]);

    const handleEmailDocumentClose = () => {
        setOpenPdf(false);
        setEnableFields(false);
    }

    const handleOpenDocumentViewer = () => {
        if (ViewDocument.current) {
            ViewDocument.current.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error('Footer reference is null');
        }
        setOpenPdf(true);
    };
    const handleOpenMail = () => {
        setOpenEmailTemplate(true);
    }
    const displayfiledsForFailureEmails = [
        "Email",
        "Subject",
        "Received Time",
        "Document Name",
        "Error Message",
        "Missing Values",
        "Email Document"
    ];
    const displayfiledsForSuccessEmails = [
        "Email",
        "Subject",
        "Received Time",
        "Document Name",
        "Email Document"
    ];
    const fieldsToDisplay =
        emailStatusType === "success" || emailStatusType === "edited-success"
            ? displayfiledsForSuccessEmails
            : displayfiledsForFailureEmails;

    function renderValue(fieldName) {
        if (fieldName === "Email") {
            return selectedEmail;
        } else if (fieldName === "Error Message") {
            return "Claim is not processed due to the missing fileds in a Document";
        } else if (fieldName === "date") {
            return subject;
        }
        else if (fieldName === "Missing Values") {
            return (
                <ul>
                    {Array.isArray(missingFields) && missingFields.length > 0 ? (
                        missingFields.map((field, index) => {
                            if (typeof field === 'object') {
                                return Object.entries(field).map(([key, value], i) => (
                                    <li key={`${index}-${i}`}>
                                        <Typography variant="body1" style={{ color: 'black' }}>
                                            {`${key}: ${value}`}
                                        </Typography>
                                    </li>
                                ));
                            } else {
                                return (
                                    <li key={index}>
                                        <Typography variant="body1" style={{ color: 'black' }}>
                                            {field}
                                        </Typography>
                                    </li>
                                );
                            }
                        })
                    ) : (
                        <li>
                            <Typography variant="body1" style={{ color: 'black' }}>
                                No Missing Values
                            </Typography>
                        </li>
                    )}
                </ul>
            );
        } else if (fieldName === "Subject") {
            return subject;
        } else if (fieldName === "Email Body") {
            const formattedBody = emailBody.replace(/\r\n/g, '<br />');
            return (
                <Typography variant="body2">
                    {formattedBody.length > 30 ? (
                        <>
                            {parse(formattedBody.substring(0, 30))}...
                            <Button
                                onClick={() => setShowFullBody(true)}
                                sx={{ textTransform: 'none', fontSize: 'inherit' }}
                            >
                                Read More
                            </Button>
                        </>
                    ) : (
                        parse(formattedBody)
                    )}
                </Typography>
            );
        } else if (fieldName === "Received Time") {
            return receivedTime;
        }
        else if (fieldName === "Email Document") {
            return (
                <>
                    <div>
                        {SnackbarComponent()}
                    </div>
                    {(emailStatusType === "success" || emailStatusType === "edited-success") ? (
                        <Grid style={{ display: "flex", gap: '0.7rem' }}>
                            <ToolTip title="View Document" arrow placement="top">
                                <Button onClick={handleOpenDocumentViewer} disabled={!content} sx={{ textTransform: "capitalize", minWidth: 'auto', padding: 0 }}>
                                    <img src={viewDocument} alt="view document" style={{ height: "1.5rem" }} />
                                </Button>
                            </ToolTip>
                            <Button onClick={handleOpenMail} disabled={!content} sx={{ textTransform: "capitalize", minWidth: 'auto', padding: 0 }}>
                                <ToolTip title="View Mail" arrow placement="top">

                                    <MailIcon style={{ height: "1.5rem", width: "1.5rem", color: "#0B70FF" }} />
                                </ToolTip>
                            </Button>
                            <Button
                                onClick={handleOpenExtractedData}
                                disabled={!content}
                                sx={{ textTransform: "capitalize", minWidth: 'auto', padding: 0 }}
                            >
                                <ToolTip title="Claim Details" arrow placement="top">

                                    <ArticleIcon style={{ height: "1.5rem", width: "1.5rem", color: "#0B70FF" }} />
                                </ToolTip>
                            </Button>
                            <Button
                                onClick={handleOpenResultData}
                                disabled={!content}
                                sx={{ textTransform: "capitalize", minWidth: 'auto', padding: 0 }}
                            >
                                <ToolTip title="Created ClaimID" arrow placement="top">

                                    <CheckBoxIcon style={{ height: "1.5rem", width: "1.5rem", color: "#0B70FF" }} />
                                </ToolTip>
                            </Button>
                        </Grid>
                    ) : (
                        <>
                            <Button onClick={handleOpenDocumentViewer} disabled={!content} sx={{ textTransform: "capitalize" }}>
                                <ToolTip title="Edit" arrow placement="right">
                                    <EditIcon />
                                </ToolTip>
                            </Button>
                            <Button onClick={handleOpenMail} disabled={!content} sx={{ textTransform: "capitalize" }}>
                                <ToolTip title="View Mail" arrow placement="right">
                                    <MailIcon style={{ height: "2rem", color: "0B70FF" }} />
                                </ToolTip>
                            </Button>
                        </>
                    )}
                </>
            );
        } else if (fieldName === "Document Name") {
            return documentName;
        } else {
            return null;
        }
    }
    const handleOpenExtractedData = () => {
        setOpenExtractedData(true);
    }
    const handleOpenResultData = () => {
        setOpenResultData(true);
    }
    const companyData = JSON.parse(localStorage.getItem("company"));
    const claimid = JSON.parse(localStorage.getItem("claimID"))
    const claimID = localStorage.getItem("claimID")
    let imageSrc = `data:image/${companyData && companyData.image_type};base64,${companyData && companyData.image_data}`;
    const [, setEdit] = useState(false)
    const handlePopupClose = () => {
        setOpen(false);
        setSuccessPopup(false);
        setSelectedEmail('');
        handleClose();
    };
    const getIconForStatus = (status) => {
        switch (status) {
            case 'success':
                return <MailIcon sx={{ color: 'green' }} />;
            case 'failure':
                return <MailIcon sx={{ color: 'red' }} />;
            case 'edited-success':
                return (
                    <>
                        <MailIcon sx={{ color: '#0B70FF' }} />
                    </>
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        const updatedTableData = [
            ...successEmails.map(emailData => ({ ...emailData, status: 'success' })),
            ...editedSuccessEmails.map(email => ({
                email,
                email_time: email.email_time,
                Subject: email.Subject,
                status: 'edited-success'
            })),
            ...failedEmails.map(emailData => ({ ...emailData, status: 'failure' }))
        ];
        setTableData(updatedTableData);
    }, [successEmails, failedEmails, editedSuccessEmails]);

    const restrictedFields = [
        "Loss Location",
    ];
    const handleValidateAddress = async (key, sectionName) => {
        setValidatingAddress(true);
        setAddressValidated(false);
        setPropertyAddressValidation(null);
        const addressToValidate = displayValues[key];
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
            setAddressValidated(false);
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
        setSnackbarOpen(false);
        setOpenSnackbar(false)
    };

    const handleConfirmAddress = (spittedAddress, keys) => {
        if (keys === "Loss Location") {
            setQueryvalues(prevValues => ({
                ...prevValues,
                street_number: spittedAddress.street_number || '',
                street_name: spittedAddress.street_name || '',
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
        setAddressValidated(true);
        setShowAddress(false);
    };

    return <>
        <div>
            {SnackbarComponent()}
        </div>
        <Container maxWidth="lg" >
            <Grid container spacing={2} justifyContent="center" ref={UploadDocument}>
                <Grid item xs={12} sm={6} md={6} >
                    <Box boxShadow={3} padding={2} marginBottom={2} className='emailtofnolContainer'>
                        <Box boxShadow={3} padding={2} marginBottom={2} style={{ maxWidth: '800px', maxHeight: '450px', overflowY: 'auto', height: "190px" }}>
                            <Container>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Box display="flex" justifyContent="center" alignItems="center" marginBottom={0}>
                                            <MailIcon style={{ color: '#2196f3', marginRight: theme.spacing(1) }} />
                                            {emails.length === 0 ?
                                                <Typography variant="h6" className='Nasaliza' style={{ color: 'blue' }}>Fetch Emails</Typography> :
                                                <Typography variant="h6" className='Nasaliza' style={{ color: 'blue' }}>Process Emails</Typography>
                                            }
                                        </Box>
                                    </Grid>
                                    {!message ? (
                                        visibleCards.map(({ email, subject, id }) => (
                                            <Grid item xs={12} key={id}>
                                                <Box style={{ '--primary-color': theme.palette.primary.main }}>
                                                    <Typography variant="h6" className='Mail-From Email-cards' display={'block'} paddingLeft={4}>
                                                        <div className='ETF-mail'><strong>Mail Id :</strong> {email ? email : '--'}</div>
                                                        <div className='ETF-mail'> <strong>Subject :</strong> {subject ? subject : '--'}</div>                                                        {processing && id === 0 && <CheckIcon style={{ color: 'green' }} />}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))
                                    ) : (
                                        <div style={{ color: 'green', textAlign: 'center', margin: "auto" }}>{message}</div>
                                    )}
                                </Grid>
                            </Container>
                        </Box>
                        <Box boxShadow={3} padding={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <StyledButtonComponent buttonWidth={isMobile ? 290 : 250} disableColor={"#B6E3FF"}
                                style={{ marginTop: theme.spacing(1) }}
                                onClick={handleStartButtonClick}
                                disabled={startBtnDisabled || loading}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Start'}
                            </StyledButtonComponent>
                            <StyledButtonComponent buttonWidth={isMobile ? 290 : 250} disableColor={"#B6E3FF"}
                                style={{ marginTop: theme.spacing(1) }}
                                onClick={handleProcessButtonClick}
                                disabled={!startBtnDisabled || processLoading}
                            >
                                {processLoading ? <CircularProgress size={24} color="inherit" /> : 'Process'}
                            </StyledButtonComponent>
                        </Box>
                    </Box>
                </Grid>

                {ViewEmailsReport &&
                    <Grid item xs={12} sm={6} md={6}>
                        <Box boxShadow={3} padding={2} marginBottom={2} style={{ maxWidth: '800px', height: '400px' }}>
                            <CustomActiveShapePieChart
                                successEmails={successEmails}
                                failedEmails={failedEmails}
                                editedSuccessEmails={editedSuccessEmails}
                                fetchedEmails={emails.length}
                            />
                        </Box>
                    </Grid>
                }
            </Grid>
            {/* working here view of emails in a Table */}
            <Grid>
                {ViewEmailsReport && afterEmailsProcess && (
                    <Card variant="outlined" ref={SuccessClick} sx={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: theme.spacing(2),
                        padding: theme.spacing(3),
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        <TableContainer sx={{ maxHeight: '300px' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: '25%' }}>Status</TableCell>
                                        <TableCell sx={{ width: '25%' }}>Email</TableCell>
                                        <TableCell sx={{ width: '25%' }}>Received Time</TableCell>
                                        <TableCell sx={{ width: '25%' }}>Subject</TableCell>
                                        <TableCell sx={{ width: '25%' }}>View</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.map((row, index) => (
                                        <React.Fragment key={index}>
                                            <TableRow hover sx={{ cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                                                <TableCell sx={{ width: '25%' }}>{getIconForStatus(row.status)}</TableCell>
                                                <TableCell sx={{ width: '25%' }}>
                                                    {row.email ? (typeof row.email === "string" ? row.email : row.email.email) : '--'}
                                                </TableCell>
                                                <TableCell sx={{ width: '25%' }}>{row.email_time || '_'}</TableCell>
                                                <TableCell sx={{ width: '25%' }}>{row.Subject || '_'}</TableCell>
                                                <TableCell sx={{ width: '25%' }}>
                                                    <ToolTip title="View" arrow placement="right">

                                                        <Visibility
                                                            sx={{ color: "#0B70FF", cursor: 'pointer' }}
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                handleClickOpen(typeof row.email === 'string' ? row.email : row.email.email, row.status, index);
                                                            }}
                                                        />
                                                    </ToolTip>
                                                </TableCell>
                                            </TableRow>
                                            {openRow === index && (
                                                <TableRow>
                                                    <TableCell colSpan={4}>
                                                        <Card variant="outlined" sx={{
                                                            background: 'rgba(255, 255, 255, 0.8)',
                                                            borderRadius: theme.spacing(2),
                                                            padding: theme.spacing(3),
                                                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                                                            backdropFilter: 'blur(10px)',
                                                            border: '1px solid rgba(255, 255, 255, 0.18)',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'space-between',
                                                        }}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12}>
                                                                    <Table sx={{ tableLayout: 'fixed' }}>
                                                                        <TableHead>
                                                                            <TableRow>
                                                                                {fieldsToDisplay.map((field, index) => (
                                                                                    <TableCell key={index} sx={{ width: `${100 / fieldsToDisplay.length}%` }}>
                                                                                        <strong>{field}</strong>
                                                                                    </TableCell>
                                                                                ))}
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            <TableRow>
                                                                                {fieldsToDisplay.map((field, index) => (
                                                                                    <TableCell key={index}>
                                                                                        {field === "Missing Values" ? (
                                                                                            <span style={{ color: "red" }}>
                                                                                                {renderValue(field) || '_'}
                                                                                            </span>
                                                                                        ) : (
                                                                                            renderValue(field) || '_'
                                                                                        )}
                                                                                    </TableCell>
                                                                                ))}
                                                                            </TableRow>
                                                                        </TableBody>
                                                                    </Table>
                                                                </Grid>
                                                            </Grid>
                                                            <DialogActions>
                                                                <Button onClick={handleClose} color="primary">
                                                                    Close
                                                                </Button>
                                                            </DialogActions>
                                                        </Card>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                )}
            </Grid>
            {/* end of emails tables */}
            <Grid mb={5}></Grid>
            {/* PDF Viewer Dialog */}
            <Dialog open={openPdf} onClose={handleEmailDocumentClose} fullWidth maxWidth="xl">
                {(emailStatusType === "success" || emailStatusType === "edited-success") ? (
                    <>
                        <DialogTitle>{documentName}</DialogTitle>
                        <DialogContent>
                            {contentType === 'pdf' && (
                                pdfUrl ? (
                                    <embed src={pdfUrl} width="100%" height="600px" type="application/pdf" />
                                ) : (
                                    <PreviewError />
                                )
                            )}
                            {contentType === 'html' && (
                                <div dangerouslySetInnerHTML={{ __html: content }}></div>
                            )}
                            {!contentType && (
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
                    </>
                ) : (
                    <Grid container style={{ display: "flex", justifyContent: "space-between" }}>
                        <Grid item md={6}>
                            <DialogTitle>{documentName}</DialogTitle>
                            <DialogContent>
                                {contentType === 'pdf' && (
                                    pdfUrl ? (
                                        <embed src={pdfUrl} width="100%" height="600px" type="application/pdf" />
                                    ) : (
                                        <PreviewError />
                                    )
                                )}
                                {contentType === 'html' && (
                                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                                )}
                                {!contentType && (
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
                                                    <Grid container spacing={2} style={{ marginBottom: '7px', marginLeft: isMobile ? '0' : '15px' }}>
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
                                                                            {value && value !== 'None' ? (
                                                                                value
                                                                            ) : (
                                                                                <span style={{ color: "red", fontWeight: 500, fontSize: 13 }}>
                                                                                    {`required`}
                                                                                </span>
                                                                            )}
                                                                        </span>
                                                                    </Grid>
                                                                </React.Fragment>
                                                            ))}
                                                    </Grid>
                                                    <Typography variant="h5" className="ipd-titles Nasaliza">Loss Details</Typography>
                                                    <Grid container spacing={2} style={{ marginBottom: '7px', marginLeft: isMobile ? '0' : '15px' }}>
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
                                                                                    {/* Edit/Check Icon for Coverage Location Address */}
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
                                                                                    {/* Always show the validation icon beside the edit icon */}
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
                                                                                    {/* Validate Button (Only when editingAddress is true) */}
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
                                                                                    <span style={{ fontWeight: 500, fontSize: 13 }}>
                                                                                        {/* Display the address value if available */}
                                                                                        {value ? (
                                                                                            <>
                                                                                                {value}
                                                                                                {/* Conditional error message based on validation status */}
                                                                                                {keys === "Loss Location" && propertyAddressValidation === null && !editingAddress ? (
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
                                                                                <span style={{ fontWeight: 500, fontSize: 13 }}>
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
                                                                        {/* Suggested Address */}
                                                                        {showSuggestedAddress && (
                                                                            <Grid container sx={{ mt: 1, alignItems: 'center', marginLeft: isMobile ? '0' : '20px' }}>
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
                                                    <Grid container spacing={2} style={{ marginBottom: '7px', marginLeft: isMobile ? '0' : '15px' }}>
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
                                                        <StyledButtonComponent buttonWidth={100}
                                                            onClick={handleSave}
                                                        >
                                                            Save
                                                        </StyledButtonComponent>
                                                    ) : (
                                                        <StyledButtonComponent buttonWidth={100}
                                                            onClick={() => setEnableFields(true)}
                                                            endIcon={<EditIcon />}
                                                        >
                                                            Edit
                                                        </StyledButtonComponent>
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
                )}
            </Dialog>
            {successPopup &&
                <Dialog open={successPopup} onClose={handlePopupClose} fullWidth maxWidth="md" PaperProps={{ style: { maxHeight: '80vh' } }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ alignItems: 'center', mb: 10, mt: 4 }}>
                            {companyData.ic_logo_path && (
                                <img
                                    src={imageSrc}
                                    alt="Insurance Company Logo"
                                    style={{ width: isMobile ? '80%' : '35%' }}
                                />
                            )}
                        </Box>
                        {isMobile && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <CheckCircleIcon sx={{ fontSize: 60, color: 'green' }} />
                            </Box>
                        )}
                        <Grid container justifyContent="center">
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                                    {!isMobile && (
                                        <CheckCircleIcon sx={{ fontSize: 40, mr: 2, color: 'green' }} />
                                    )}
                                    <Typography className='Nasaliza' style={{ fontSize: isMobile ? '1rem' : '1.5rem' }}>
                                        Claim Submitted Successfully!
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant='h6' sx={{ mb: 2, textAlign: 'center' }} className='Nasaliza'>
                                    Claim ID:{' '}
                                    <span style={{ color: companyData?.ic_primary_color || '#0B70FF' }}>
                                        {claimid.data || claimID}
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
            {/* Dialog for displaying full Email Body */}
            <Dialog open={showFullBody} onClose={() => setShowFullBody(false)}>
                <DialogTitle>Email Body</DialogTitle>
                <DialogContent>
                    {/* Parse the formatted body for the full content */}
                    <Typography variant="body1" align="justify">
                        {parse(emailBody.replace(/\r\n/g, '<br />'))}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowFullBody(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            {/* email template */}
            <Dialog open={openEmailTemplate} maxWidth="md" fullWidth>
                <DialogTitle>Email View</DialogTitle>
                <DialogContent>
                    <EmailView
                        subject={subject}
                        receivedTime={receivedTime}
                        documentName={documentName}
                        emailBody={emailBody}
                        emailDetails={tableData[openRow] || {}}
                        openPdf={openPdf}
                        handleOpenDocumentViewer={handleOpenDocumentViewer}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEmailTemplate(false)} color="primary">
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
            {/* extracted data dialog box */}
            < Dialog open={openExtractedData} maxWidth="md" fullWidth >
                <DialogTitle className='Nasaliza' style={{ color: "#0B70FF", textAlign: "center", fontSize: "1.5rem", marginTop: "0.5rem", marginBottom: "-1rem" }}>Claim Details</DialogTitle>
                <DialogContent>
                    <ExtractedDataView
                        ExtractedData={extractedData}
                        mapResponseToDisplayFields={mapResponseToDisplayFields}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenExtractedData(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog >
            {/* quote number and quote amount dialog box for the success emails */}
            < Dialog open={openResultData} maxWidth="md" fullWidth >
                <DialogContent>
                    <ShowClaimID
                        ClaimID={claimidfromResponse}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenResultData(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog >
        </Container>
    </>
}