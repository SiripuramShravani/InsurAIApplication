import {
  Box,
  Grid,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Checkbox,
  Snackbar,
  Backdrop,
} from "@mui/material";
import { Tooltip as ToolTip } from "@mui/material";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useNetworkStatus from "../../components/ErrorPages/UseNetworkStatus.js";
import StyledButtonComponent from "../../components/StyledButton";
import MailIcon from "@mui/icons-material/Mail";
import CheckIcon from "@mui/icons-material/Check";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Cell,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { Visibility } from "@mui/icons-material";
import parse from "react-html-parser";
import viewDocument from "../../assets/viewDocument.png";
import { ChevronLeft, Paperclip, Clock, Tag } from "lucide-react";
import {
  Edit as EditIcon,
  CheckCircle as ValidateIcon,
  Warning as WarningIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Radio, FormControlLabel, RadioGroup } from "@mui/material";
import PreviewError from "../../components/ErrorPages/PreviewError.js";
import { BarChart, Bar, XAxis, YAxis, } from "recharts";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

const EmailView = ({
  subject,
  receivedTime,
  documentName,
  emailDetails,
  emailBody,
  handleOpenDocumentViewer,
}) => {
  const cleanBody = removeCidReferencesAndLinks(emailBody);
  // eslint-disable-next-line
  const [email, setEmail] = useState({
    subject: subject,
    sender: emailDetails.sender_name || "Unknown Sender",
    senderEmail: emailDetails.sender_email || "unknown@example.com",
    time: receivedTime,
    body: cleanBody,
    attachments: documentName || [],
    tags: emailDetails.tags || [],
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
                  style={{ cursor: "pointer" }}
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

// custom Email template
function removeCidReferencesAndLinks(text) {
  text = text.replace(/\[cid:[^\]]+\]|<[^>]+cid:[^>]+>/g, ""); // Remove cid references
  text = text.replace(/<a\s+href=[^>]+>[^<]+<\/a>/gi, ""); // Remove <a> tags (links)
  text = text.replace(/mailto:[^\s]+/gi, ""); // Remove mailto links
  // Remove links starting with http, https, or www., capturing only the link part
  text = text.replace(/(https?:\/\/|www\.)[^\s]+/gi, (match) => {
    return "";
  });
  return text;
}

const ExtractedDataView = ({ ExtractedData, mapResponseToDisplayFields }) => {
  const userFriendlyNames = mapResponseToDisplayFields(ExtractedData);
  const policyInfoKey = userFriendlyNames.PolicyInfo
    ? "PolicyInfo"
    : "policy_holder_info";
  const propertyInfoKey = userFriendlyNames.PropertyInfo
    ? "PropertyInfo"
    : "property_info";
  const additionalInfoKey = userFriendlyNames.AdditionalInfo
    ? "AdditionalInfo"
    : "additional_info";
  const coveragesKey = userFriendlyNames.Coverages ? "Coverages" : "coverages";
  return (
    <DialogContent>
      <Grid className="fetch-idp-data">
        <Typography
          variant="h5"
          className="ipd-titles Nasaliza"
          style={{
            color: "#010066",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            marginTop: "2rem",
          }}
        >
          Policy Holder Info
        </Typography>
        <Grid container spacing={2} style={{ marginBottom: "7px" }}>
          {userFriendlyNames[policyInfoKey] &&
            Object.entries(userFriendlyNames[policyInfoKey]).map(
              ([key, value]) => {
                return (
                  <React.Fragment key={key}>
                    <Grid
                      item
                      xs={5}
                      sm={5}
                      md={5}
                      sx={{
                        fontWeight: 550,
                        fontSize: 13,
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {key}
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={1}
                      md={1.5}
                      style={{ textAlign: "left" }}
                    >
                      :
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sm={6}
                      md={5.5}
                      style={{
                        fontWeight: 550,
                        fontSize: 13,
                        textAlign: "left",
                      }}
                    >
                      {value ? value : "-"}
                    </Grid>
                  </React.Fragment>
                );
              }
            )}
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
          }}
        >
          Property Information
        </Typography>
        <Grid container spacing={2} style={{ marginBottom: "7px" }}>
          {userFriendlyNames[propertyInfoKey] &&
            Object.entries(userFriendlyNames[propertyInfoKey]).map(
              ([key, value]) => {
                return (
                  <React.Fragment key={key}>
                    <Grid
                      item
                      xs={5}
                      sm={5}
                      md={5}
                      sx={{
                        fontWeight: 550,
                        fontSize: 13,
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {key}
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={1}
                      md={1.5}
                      style={{ textAlign: "left" }}
                    >
                      :
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sm={6}
                      md={5.5}
                      style={{
                        fontWeight: 550,
                        fontSize: 13,
                        textAlign: "left",
                      }}
                    >
                      {value ? value : "-"}
                    </Grid>
                  </React.Fragment>
                );
              }
            )}
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
          }}
        >
          Prior Policy Info
        </Typography>
        <Grid container spacing={2} style={{ marginBottom: "7px" }}>
          {userFriendlyNames[additionalInfoKey] &&
            Object.entries(userFriendlyNames[additionalInfoKey]).map(
              ([key, value]) => (
                <React.Fragment key={key}>
                  <Grid
                    item
                    xs={5}
                    sm={5}
                    md={5}
                    style={{ fontWeight: 550, fontSize: 13, textAlign: "left" }}
                  >
                    {key}
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    sm={1}
                    md={1.5}
                    style={{ textAlign: "left" }}
                  >
                    :
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={5.5}
                    style={{ fontWeight: 550, fontSize: 13, textAlign: "left" }}
                  >
                    {value ? value : "-"}
                  </Grid>
                </React.Fragment>
              )
            )}
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
          }}
        >
          Coverages
        </Typography>
        <Grid container spacing={2} style={{ marginBottom: "15px" }}>
          {userFriendlyNames[coveragesKey] &&
            Object.entries(userFriendlyNames[coveragesKey]).map(
              ([key, value]) => (
                <React.Fragment key={key}>
                  <Grid
                    item
                    xs={5}
                    sm={5}
                    md={5}
                    style={{ fontWeight: 550, fontSize: 13, textAlign: "left" }}
                  >
                    {key}
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    sm={1}
                    md={1.5}
                    style={{ textAlign: "left" }}
                  >
                    :
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={5.5}
                    style={{ fontWeight: 550, fontSize: 13, textAlign: "left" }}
                  >
                    {value ? value : "-"}
                  </Grid>
                </React.Fragment>
              )
            )}
        </Grid>
      </Grid>
    </DialogContent>
  );
};

const ShowQuoteNumberAmount = ({ QuoteNumber, QuoteAmount }) => {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Grid container justifyContent="center" style={{ marginTop: "3rem" }}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 40, mr: 2, color: "green" }} />
            <Typography className="Nasaliza" style={{ fontSize: "1.5rem" }}>
              Created Quote Details!
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            sx={{ mb: 2, textAlign: "center" }}
            className="Nasaliza"
          >
            Quote Number :
            <span style={{ color: "#0B70FF" }}>
              {QuoteNumber && QuoteNumber}
            </span>
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 2, textAlign: "center" }}
            className="Nasaliza"
          >
            Quote Amount :
            <span style={{ color: "#0B70FF" }}>
              {QuoteAmount && QuoteAmount}
            </span>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

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
    validated_address: "",
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
    validated_address: "",
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
    mortgageeInstallmentAmount: null,
  },
  Coverages: {
    dwellingCoverage: null,
    personalProperty: null,
    personalLiabilityCoverage: null,
    medicalPayments: null,
    deductible: null,
  },
};

const EmailToPolicyIntakeFun = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const UploadDocument = useRef(null);
  /* eslint-disable no-unused-vars */
  const [visibleCards, setVisibleCards] = useState([]);
  const [cardsLoaded, setCardsLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [emails, setEmails] = useState([]);
  const [message, setMessage] = useState("");
  const [startBtnDisabled, setStartBtnDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);
  const [successEmails, setSuccessEmails] = useState([]);
  const [failedEmails, setFailedEmails] = useState([]);
  const [editedSuccessEmails, setEditedSuccessEmails] = useState([]);
  const [ViewEmailsReport, setViewEmailsReport] = useState(true);
  const [afterEmailsProcess, setAfterEmailsProcess] = useState(false);
  const SuccessClick = useRef(null);
  const ViewDocument = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [emailStatusType, setEmailStatusType] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [receivedTime, setReceivedTime] = useState("");
  const [missingFields, setMissingFields] = useState([]);
  const [showFullBody, setShowFullBody] = useState(false);
  const [emailBody, setEmailBody] = useState("");
  const [openEmailTemplate, setOpenEmailTemplate] = useState(false);
  const [content, setContent] = useState("");
  const [openPdf, setOpenPdf] = useState(false);
  const [contentType, setContentType] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [hasEmptyOrInvalidValues, setHasEmptyOrInvalidValues] = useState(true);
  const [open, setOpen] = useState(false);
  const [displayValues, setDisplayValues] = useState({});
  const [queryvalues, setQueryvalues] = useState(initialValues);
  const [updateDisplay, setUpdateDisplay] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [enableFields, setEnableFields] = useState(false);
  const [policyHolderAddressValidation, setPolicyHolderAddressValidation] = useState("");
  const [propertyAddressValidation, setPropertyAddressValidation] = useState("");
  const [showRequiredMessage, setShowRequiredMessage] = useState(false);
  const [afterProcess, setAfterProcess] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [editingPolicyholderAddress, setEditingPolicyholderAddress] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [suggestedAddress, setSuggestedAddress] = useState(null);
  const [spittedAddress, setSpittedAddress] = useState(null);
  const [showAddress, setShowAddress] = useState(false);
  const [validatedAddressKey, setValidatedAddressKey] = useState("");
  const [validatingAddress, setValidatingAddress] = useState(false);
  const [addressValidated, setAddressValidated] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [processSubmit, setProcessSubmit] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [currentSenderEmail, setCurrentSenderEmail] = useState("");
  const [quoteNumber, setQuoteNumber] = useState("");
  const [quoteAmount, setQuoteAmount] = useState("");
  const [openExtractedData, setOpenExtractedData] = useState(false);
  const [openResultData, setOpenResultData] = useState(false);
  const [extractedData, setExtractedData] = useState("");
  const [successQuoteNumber, setSuccessQuoteNumber] = useState("");
  const [successQuoteAmount, setSuccessQuoteAmount] = useState("");
  const [initialCoverageLocationAddress, setInitialCoverageLocationAddress] = useState("");
  const [sameAsPolicyHolderAddress, setSameAsPolicyHolderAddress] = useState(false);
  const navigate = useNavigate();
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true,
  });
  const handleNetworkError = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );
  const { setNetworkError, SnackbarComponent } = useNetworkStatus(
    {},
    handleNetworkError
  );

  const handleStartButtonClick = () => {
    setLoading(true);
    const storedDocuments = JSON.parse(
      localStorage.getItem("attachedDocuments") || "[]"
    );
    axiosInstance
      .post("Policy/trigger_email_parsing/")
      .then((response) => {
        if (
          response.data.status === "success" &&
          response.data.sender_emails.length > 0
        ) {
          setMessage("");
          localStorage.setItem(
            "EmailtoPolicyIntake",
            JSON.stringify(response.data.sender_emails)
          );
          const failedEmails = response.data.sender_emails || [];
          setEmails(response.data.sender_emails);
          setCardsLoaded(true);
          setStartBtnDisabled(true);
          localStorage.setItem("startBtnDisabled", "true");
        } else {
          setMessage("No Emails To Fetch");
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          const { status } = error.response;
          const errorMessage =
            error.response.data.message ||
            "An error occurred while triggering email parsing.";
          const userName = localStorage.getItem("userName");
          const storedEmails = JSON.parse(
            localStorage.getItem("EmailtoPolicyIntake") || "[]"
          );
          setNetworkError({
            errorMessage: errorMessage,
            username: userName,
            status: status,
            documents: storedDocuments,
            timestamp: new Date().toISOString(),
          });
          setMessage(`Error ${status}: ${errorMessage}`);
        } else {
          setMessage("An unexpected error occurred while fetching emails.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const storedEmails = JSON.parse(localStorage.getItem("EmailstoFnol"));
    if (storedEmails && storedEmails.length > 0) {
      setEmails(storedEmails);
      setCardsLoaded(true);
      setStartBtnDisabled(true);
    }
  }, []);

  const handleProcessButtonClick = () => {
    setProcessLoading(true);
    axiosInstance
      .post("Policy/process_emails/")
      .then((response) => {
        if (response.data.message === "Email processing Successful.") {
          setMessage("Email processed Successfully");
          localStorage.removeItem("EmailtoPolicyIntake");
          setProcessing(true);
          setStartBtnDisabled(false);
          localStorage.removeItem("startBtnDisabled");
          setSuccessEmails(response.data.Success_mails);
          setFailedEmails(response.data.Failure_mails);
          setViewEmailsReport(true);
          ViewReportClick();
          setProcessLoading(false);
        } else {
          setProcessLoading(false);
          setMessage("An error occurred during processing.");
        }
      })
      .catch((error) => {
        setProcessLoading(false);
        if (error.response) {
          const { status } = error.response;
          const errorMessage =
            error.response.data.message ||
            "An error occurred while processing the emails.";
          const errorSource = error.response.data.api || "Unknown source";
          const userName = localStorage.getItem("userName");
          const failedEmails = error.response.data.Failure_mails || [];
          setNetworkError({
            errorMessage: errorMessage,
            errorSource: errorSource,
            username: userName,
            status: status,
            failedEmails: failedEmails,
          });
        } else {
          setMessage(
            "An unexpected error occurred while processing the emails."
          );
        }
      });
  };

  useEffect(() => {
    const updatedTableData = [
      ...successEmails.map((emailData) => ({
        ...emailData,
        status: "success",
      })),
      ...editedSuccessEmails.map((email) => ({
        email,
        email_time: email.email_time,
        Subject: email.Subject,
        status: "edited-success",
      })),
      ...failedEmails.map((emailData) => ({ ...emailData, status: "failure" })),
    ];
    setTableData(updatedTableData);
  }, [successEmails, failedEmails, editedSuccessEmails]);

  const handleClickOpen = (email, mailtype, index) => {
    setOpenRow(index);
    setEmailStatusType(mailtype);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("status", mailtype);
    setCurrentSenderEmail(email);
    axiosInstance
      .post("Policy/get_document_by_email/", formData)
      .then((response) => {
        if (response.data.success) {
          if (response.data.content_type === "pdf") {
            const pdfBytes = Uint8Array.from(atob(response.data.content), (c) =>
              c.charCodeAt(0)
            );
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
          }
          setContentType(response.data.content_type);
          setContent(response.data.content);
          setSubject(response.data.subject);
          setReceivedTime(response.data.email_time);
          setEmailBody(response.data.body);
          setMissingFields(response.data.Errors);
          setDocumentName(response.data.document_name);
          setSuccessQuoteNumber(
            response.data.quote_number && response.data.quote_number
          );
          setSuccessQuoteAmount(
            response.data.quote_amount && response.data.quote_amount
          );
          const extractedResponseData = response.data.Extracted_data;
          setExtractedData(extractedResponseData);
          setQueryvalues({
            ...initialValues,
            ...extractedResponseData,
            PolicyInfo: {
              ...initialValues.PolicyInfo,
              ...extractedResponseData.PolicyInfo,
            },
            PropertyInfo: {
              ...initialValues.PropertyInfo,
              ...extractedResponseData.PropertyInfo,
            },
            AdditionalInfo: {
              ...initialValues.AdditionalInfo,
              ...extractedResponseData.AdditionalInfo,
            },
            Coverages: {
              ...initialValues.Coverages,
              ...extractedResponseData.Coverages,
            },
          });
          if (
            extractedResponseData.PolicyInfo.validated_address ===
            "Address Not validated"
          ) {
            setPolicyHolderAddressValidation(null);
          }
          if (
            extractedResponseData.PropertyInfo.validated_address ===
            "Address Not validated"
          ) {
            setPropertyAddressValidation(null);
          }
          const displayExtractedData = mapResponseToDisplayFields(
            extractedResponseData
          );
          setDisplayValues(displayExtractedData);
          setInitialCoverageLocationAddress(
            displayExtractedData.PropertyInfo["Coverage Location Address"]
          );
          setAfterProcess(true);
        } else {
          console.error("Error fetching PDF:", response.data.error);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setSelectedEmail(email);
    setOpen(true);
  };

  const ViewReportClick = async () => {
    await setAfterEmailsProcess(true);
    if (SuccessClick.current) {
      SuccessClick.current.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error("Footer reference is null");
    }
  };

  useEffect(() => {
    if (cardsLoaded) {
      const timeoutIds = [];
      emails.forEach((email, index) => {
        timeoutIds.push(
          setTimeout(() => {
            setVisibleCards((prevVisibleCards) => [
              ...prevVisibleCards,
              { email: email[0], subject: email[1], id: index },
            ]);
          }, index * 500)
        );
      });
      return () => {
        setCardsLoaded(false);
        timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
      };
    }
  }, [cardsLoaded, emails]);

  const getIconForStatus = (status) => {
    switch (status) {
      case "success":
        return <MailIcon sx={{ color: "green" }} />;
      case "failure":
        return <MailIcon sx={{ color: "red" }} />;
      case "edited-success":
        return (
          <>
            <MailIcon sx={{ color: "#0B70FF" }} />
          </>
        );
      default:
        return null;
    }
  };
  const displayfiledsForFailureEmails = [
    "Email",
    "Subject",
    "Received Time",
    "Document Name",
    "Error Message",
    "Missing Values",
    "Email Document",
  ];
  const displayfiledsForSuccessEmails = [
    "Email",
    "Subject",
    "Received Time",
    "Document Name",
    "Email Document",
  ];

  const fieldsToDisplay =
    emailStatusType === "success" || emailStatusType === "edited-success"
      ? displayfiledsForSuccessEmails
      : displayfiledsForFailureEmails;
  function renderValue(fieldName) {
    if (fieldName === "Email") {
      return selectedEmail;
    } else if (fieldName === "Error Message") {
      return "Submission is not processed due to the missing fileds in a Document";
    } else if (fieldName === "date") {
      return subject;
    } else if (fieldName === "Missing Values") {
      return (
        <ul>
          {Array.isArray(missingFields) && missingFields.length > 0 ? (
            missingFields.map((field, index) => {
              if (typeof field === "object") {
                return Object.entries(field).map(([key, value], i) => (
                  <li key={`${index}-${i}`}>
                    <Typography variant="body1" style={{ color: "black" }}>
                      {`${key}: ${value}`}
                    </Typography>
                  </li>
                ));
              } else {
                return (
                  <li key={index}>
                    <Typography variant="body1" style={{ color: "black" }}>
                      {field}
                    </Typography>
                  </li>
                );
              }
            })
          ) : (
            <li>
              <Typography variant="body1" style={{ color: "black" }}>
                No Missing Values
              </Typography>
            </li>
          )}
        </ul>
      );
    } else if (fieldName === "Subject") {
      return subject;
    } else if (fieldName === "Email Body") {
      const formattedBody = emailBody.replace(/\r\n/g, "<br />");
      return (
        <Typography variant="body2">
          {formattedBody.length > 30 ? (
            <>
              {parse(formattedBody.substring(0, 30))}...{" "}
              <Button
                onClick={() => setShowFullBody(true)}
                sx={{ textTransform: "none", fontSize: "inherit" }}
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
    } else if (fieldName === "Email Document") {
      return (
        <>
          {emailStatusType === "success" ||
            emailStatusType === "edited-success" ? (
            <Grid style={{ display: "flex", gap: "0.7rem" }}>
              {" "}
              <ToolTip title="View Document" arrow placement="top">
                <Button
                  onClick={handleOpenDocumentViewer}
                  disabled={!content}
                  sx={{
                    textTransform: "capitalize",
                    minWidth: "auto",
                    padding: 0,
                  }}
                >
                  <img
                    src={viewDocument}
                    alt="view document"
                    style={{ height: "1.5rem" }}
                  />
                </Button>
              </ToolTip>
              <Button
                onClick={handleOpenMail}
                disabled={!content}
                sx={{
                  textTransform: "capitalize",
                  minWidth: "auto",
                  padding: 0,
                }}
              >
                <ToolTip title="View Mail" arrow placement="top">
                  <MailIcon
                    style={{
                      height: "1.5rem",
                      width: "1.5rem",
                      color: "#0B70FF",
                    }}
                  />
                </ToolTip>
              </Button>
              <Button
                onClick={handleOpenExtractedData}
                disabled={!content}
                sx={{
                  textTransform: "capitalize",
                  minWidth: "auto",
                  padding: 0,
                }}
              >
                <ToolTip title="Submission Details" arrow placement="top">
                  <ArticleIcon
                    style={{
                      height: "1.5rem",
                      width: "1.5rem",
                      color: "#0B70FF",
                    }}
                  />
                </ToolTip>
              </Button>
              <Button
                onClick={handleOpenResultData}
                disabled={!content}
                sx={{
                  textTransform: "capitalize",
                  minWidth: "auto",
                  padding: 0,
                }}
              >
                <ToolTip title="Created Quote Details" arrow placement="top">
                  <CheckBoxIcon
                    style={{
                      height: "1.5rem",
                      width: "1.5rem",
                      color: "#0B70FF",
                    }}
                  />
                </ToolTip>
              </Button>
            </Grid>
          ) : (
            <>
              <Button
                onClick={handleOpenDocumentViewer}
                disabled={!content}
                sx={{ textTransform: "capitalize" }}
              >
                <ToolTip title="Edit" arrow placement="right">
                  <EditIcon />
                </ToolTip>
              </Button>
              <Button
                onClick={handleOpenMail}
                disabled={!content}
                sx={{ textTransform: "capitalize" }}
              >
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

  const handleOpenDocumentViewer = () => {
    if (ViewDocument.current) {
      ViewDocument.current.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error("Footer reference is null");
    }
    setOpenPdf(true);
  };
  const handleOpenMail = () => {
    setOpenEmailTemplate(true);
  };
  const handleOpenExtractedData = () => {
    setOpenExtractedData(true);
  };
  const handleOpenResultData = () => {
    setOpenResultData(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmail("");
    setContent("");
    setContentType(null);
    setMissingFields([]);
    setDisplayValues({});
    setQueryvalues(initialValues);
    setUpdateDisplay(false);
    setErrorMessage("");
    setHasEmptyOrInvalidValues(true);
    setOpenRow(null);
  };

  const handleEmailDocumentClose = () => {
    setOpenPdf(false);
    setEnableFields(false);
  };

  const restrictedFields = [
    "Policy Holder Address",
    "Coverage Location Address",
  ];
  useEffect(() => {
    if (afterProcess) {
      const hasErrors = checkForEmptyOrInvalidFields();
      setShowRequiredMessage(hasErrors);
    }
    // eslint-disable-next-line
  }, [displayValues, queryvalues, afterProcess]);

  const ConvertAddressIntoOneString = (
    StreetNumber,
    StreetName,
    City,
    State,
    Zip,
    Country
  ) => {
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
    const policyInfoKey = extractedResponseData.PolicyInfo
      ? "PolicyInfo"
      : "policy_holder_info";
    const PropertyInfoKey = extractedResponseData.PropertyInfo
      ? "PropertyInfo"
      : "property_info";
    const AdditionalInfoKey = extractedResponseData.AdditionalInfo
      ? "AdditionalInfo"
      : "additional_info";
    const CoveragesKey = extractedResponseData.Coverages
      ? "Coverages"
      : "coverages";
    return {
      [policyInfoKey]: {
        "Selected Policy Type":
          extractedResponseData[policyInfoKey].selectedPolicy,
        "Social Security Number":
          extractedResponseData[policyInfoKey].policy_holder_ssn,
        "First Name":
          extractedResponseData[policyInfoKey].policy_holder_FirstName,
        "Last Name":
          extractedResponseData[policyInfoKey].policy_holder_LastName,
        "Mobile Number":
          extractedResponseData[policyInfoKey].policy_holder_mobile,
        "Email Address":
          extractedResponseData[policyInfoKey].policy_holder_email,
        Occupation:
          extractedResponseData[policyInfoKey].policy_holder_occupation,
        "Policy Holder Address": ConvertAddressIntoOneString(
          extractedResponseData[policyInfoKey].policy_holder_street_number,
          extractedResponseData[policyInfoKey].policy_holder_street_name,
          extractedResponseData[policyInfoKey].policy_holder_city,
          extractedResponseData[policyInfoKey].policy_holder_state,
          extractedResponseData[policyInfoKey].policy_holder_zip,
          extractedResponseData[policyInfoKey].policy_holder_country
        ),
      },
      [PropertyInfoKey]: {
        "Residence Type": extractedResponseData[PropertyInfoKey].residenceType,
        "Construction Type":
          extractedResponseData[PropertyInfoKey].constructionType,
        "Year Built": extractedResponseData[PropertyInfoKey].yearBuilt,
        "Number of Stories":
          extractedResponseData[PropertyInfoKey].numberOfStories,
        "Square Footage": extractedResponseData[PropertyInfoKey].squareFootage,
        "Heating Type": extractedResponseData[PropertyInfoKey].heatingType,
        "Year Plumbing System Installed/Last Upgraded":
          extractedResponseData[PropertyInfoKey].plumbing_installed_year,
        "Year Wiring System Installed/Last Upgraded":
          extractedResponseData[PropertyInfoKey].wiring_installed_year,
        "Year Heating System Installed/Last Upgraded":
          extractedResponseData[PropertyInfoKey].heating_installed_year,
        "Year Roof System Installed/Last Upgraded":
          extractedResponseData[PropertyInfoKey].roof_installed_year,
        "Fire Hydrant Distance":
          extractedResponseData[PropertyInfoKey].fireHydrantDistance,
        "Fire Station Distance":
          extractedResponseData[PropertyInfoKey].fireStationDistance,
        "Alternate Heating?":
          extractedResponseData[PropertyInfoKey].alternateHeating,
        "Any Business Conducted On Premises?":
          extractedResponseData[PropertyInfoKey]
            .any_business_conducted_on_premises,
        "Trampoline or Skateboard/Bicycle Ramp?":
          extractedResponseData[PropertyInfoKey].trampolineRamp,
        "Subject to Flood, Wave Wash, Windstorm or Seacoast?":
          extractedResponseData[PropertyInfoKey].subjectToFlood,
        "Flood Insurance Requested?":
          extractedResponseData[PropertyInfoKey].floodInsuranceRequested,
        "Rented to Others?":
          extractedResponseData[PropertyInfoKey].rentedToOthers,
        "Additional Information":
          extractedResponseData[PropertyInfoKey].additionalInfo,
        "Coverage Location Address": ConvertAddressIntoOneString(
          extractedResponseData[PropertyInfoKey].CoverageLocation_street_number,
          extractedResponseData[PropertyInfoKey].CoverageLocation_street_name,
          extractedResponseData[PropertyInfoKey].CoverageLocation_city,
          extractedResponseData[PropertyInfoKey].CoverageLocation_state,
          extractedResponseData[PropertyInfoKey].CoverageLocation_zip,
          extractedResponseData[PropertyInfoKey].CoverageLocation_country
        ),
      },
      [AdditionalInfoKey]: {
        "Current Insurance Carrier":
          extractedResponseData[AdditionalInfoKey].currentInsuranceCarrier,
        "Current Policy Number":
          extractedResponseData[AdditionalInfoKey].currentPolicy,
        "Current Policy Effective Date":
          extractedResponseData[AdditionalInfoKey].effectiveDate,
        "Current Policy Premium ($)":
          extractedResponseData[AdditionalInfoKey].current_policy_premium,
        "Loss in Last 4 Years":
          extractedResponseData[AdditionalInfoKey].anyLossLast4Years,
        "Mortgagee Name":
          extractedResponseData[AdditionalInfoKey].mortgageeName,
        "Installment Amount ($)":
          extractedResponseData[AdditionalInfoKey].mortgageeInstallmentAmount,
        "Mortgagee Address": ConvertAddressIntoOneString(
          extractedResponseData[AdditionalInfoKey].mortgageeStreetNumber,
          extractedResponseData[AdditionalInfoKey].mortgageeStreetName,
          extractedResponseData[AdditionalInfoKey].mortgageeCity,
          extractedResponseData[AdditionalInfoKey].mortgageeState,
          extractedResponseData[AdditionalInfoKey].mortgageeCountry,
          extractedResponseData[AdditionalInfoKey].mortgageeZip
        ),
      },
      [CoveragesKey]: {
        "Dwelling Coverage($)":
          extractedResponseData[CoveragesKey].dwellingCoverage,
        "Personal Property Coverage($)":
          extractedResponseData[CoveragesKey].personalProperty,
        "Personal Liability Coverage($)":
          extractedResponseData[CoveragesKey].personalLiabilityCoverage,
        "Medical Payments Coverage($)":
          extractedResponseData[CoveragesKey].medicalPayments,
        "Deductible($)": extractedResponseData[CoveragesKey].deductible,
      },
    };
  };

  const checkForEmptyOrInvalidFields = () => {
    const displayValuesWithoutAdditionalInfo =
      displayValues && displayValues.PropertyInfo
        ? {
          ...displayValues,
          PropertyInfo: Object.fromEntries(
            Object.entries(displayValues.PropertyInfo).filter(
              ([key, _]) => key !== "Additional Information"
            )
          ),
        }
        : {};
    if (
      displayValues.AdditionalInfo &&
      !displayValues.AdditionalInfo["Mortgagee Address"]
    ) {
      delete displayValuesWithoutAdditionalInfo.AdditionalInfo[
        "Mortgagee Address"
      ];
    }

    const hasEmptyDisplayValues =
      displayValues && displayValues.PropertyInfo
        ? Object.values(displayValuesWithoutAdditionalInfo).some((section) =>
          Object.values(section).some((value) => !value)
        )
        : false;
    // 3. Filter out "additionalInfo" from PropertyInfo in queryvalues
    const queryvaluesWithoutAdditionalInfo = {
      ...queryvalues,
      PropertyInfo: Object.fromEntries(
        Object.entries(queryvalues.PropertyInfo).filter(
          ([key, _]) => key !== "additionalInfo"
        )
      ),
    };
    // 4. Check for empty or invalid address values in queryvalues
    const policyHolderAddressInvalid =
      queryvalues && queryvalues.PolicyInfo
        ? !queryvalues.PolicyInfo.validated_address ||
        queryvalues.PolicyInfo.validated_address === "Address Not validated"
        : false;
    const coverageLocationAddressInvalid =
      queryvalues && queryvalues.PropertyInfo
        ? !queryvalues.PropertyInfo.validated_address ||
        queryvalues.PropertyInfo.validated_address === "Address Not validated"
        : false;
    // 5. Combine the results
    return (
      hasEmptyDisplayValues ||
      policyHolderAddressInvalid ||
      coverageLocationAddressInvalid
    );
  };

  const [editingSection, setEditingSection] = useState({
    PolicyInfo: false,
    PropertyInfo: false,
    AdditionalInfo: false,
    Coverages: false,
  });

  const handleEditSection = (sectionName) => {
    setEditingSection((prevEditingSection) => ({
      ...prevEditingSection,
      [sectionName]: !prevEditingSection[sectionName],
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

  const handleSave = (sectionName) => {
    setEnableFields(false);
    setShowAddress(false);
    handleEditSection(sectionName);
  };

  const handleValidateAddress = async (key, sectionName) => {
    setValidatingAddress(true);
    setAddressValidated(false);
    const addressToValidate = displayValues[sectionName][key];
    try {
      const response = await axiosInstance.post(
        "validate_address/",
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
        setValidationError("Address is not valid. Please check your address.");
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
      setValidationError(
        `${error.response.data.error} Please Check you Address again` ||
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
          policy_holder_street_number: spittedAddress.street_number || "",
          policy_holder_street_name: spittedAddress.street_name || "",
          policy_holder_city: spittedAddress.city || "",
          policy_holder_state: spittedAddress.state || "",
          policy_holder_zip: spittedAddress.zip_code || "",
          policy_holder_country: spittedAddress.country || "",
          validated_address: suggestedAddress,
        },
      }));
      setDisplayValues((prevDisplayValues) => ({
        ...prevDisplayValues,
        PolicyInfo: {
          ...prevDisplayValues.PolicyInfo,
          "Policy Holder Address": suggestedAddress,
        },
      }));
      setPolicyHolderAddressValidation("");
      setEditingPolicyholderAddress(false);
    } else if (key === "Coverage Location Address") {
      setQueryvalues((prevQueryvalues) => ({
        ...prevQueryvalues,
        PropertyInfo: {
          ...prevQueryvalues.PropertyInfo,
          CoverageLocation_street_number: spittedAddress.street_number || "",
          CoverageLocation_street_name: spittedAddress.street_name || "",
          CoverageLocation_city: spittedAddress.city || "",
          CoverageLocation_state: spittedAddress.state || "",
          CoverageLocation_zip: spittedAddress.zip_code || "",
          CoverageLocation_country: spittedAddress.country || "",
          validated_address:
            suggestedAddress || queryvalues.PolicyInfo.validated_address,
        },
      }));
      setDisplayValues((prevDisplayValues) => ({
        ...prevDisplayValues,
        PropertyInfo: {
          ...prevDisplayValues.PropertyInfo,
          "Coverage Location Address":
            suggestedAddress ||
            displayValues.PolicyInfo["Policy Holder Address"],
        },
      }));
      setPropertyAddressValidation("");
      setEditingAddress(false);
    }
    setAddressValidated(true);
    setShowAddress(false);
  };
  const handleInputChange = (field, value, section) => {
    if (
      (section === "PropertyInfo" && field === "Coverage Location Address") ||
      (section === "PolicyInfo" && field === "Policy Holder Address")
    ) {
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
        Occupation: "policy_holder_occupation",
        "Street Number": "policy_holder_street_number",
        "Street Name": "policy_holder_street_name",
        City: "policy_holder_city",
        State: "policy_holder_state",
        "Zip Code": "policy_holder_zip",
        Country: "policy_holder_country",
        "Validated Address": "validated_address",
      },
      PropertyInfo: {
        "Residence Type": "residenceType",
        "Construction Type": "constructionType",
        "Year Built": "yearBuilt",
        "Number of Stories": "numberOfStories",
        "Square Footage": "squareFootage",
        "Heating Type": "heatingType",
        "Year Plumbing System Installed/Last Upgraded":
          "plumbing_installed_year",
        "Year Wiring System Installed/Last Upgraded": "wiring_installed_year",
        "Year Heating System Installed/Last Upgraded": "heating_installed_year",
        "Year Roof System Installed/Last Upgraded": "roof_installed_year",
        "Fire Hydrant Distance": "fireHydrantDistance",
        "Fire Station Distance": "fireStationDistance",
        "Alternate Heating?": "alternateHeating",
        "Any Business Conducted On Premises?":
          "any_business_conducted_on_premises",
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
        "Validated Property Address": "validated_address",
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
        "Mortgagee Zip": "mortgageeZip",
      },
      Coverages: {
        "Dwelling Coverage ($)": "dwellingCoverage",
        "Personal Property Coverage ($)": "personalProperty",
        "Personal Liability Coverage ($)": "personalLiabilityCoverage",
        "Medical Payments Coverage ($)": "medicalPayments",
        "Deductible ($)": "deductible",
      },
    };
    return mapping[section]?.[field];
  };

  const handleExtractClaimSubmit = async (displayValues, queryvalues) => {
    setProcessSubmit(true);
    if (queryvalues.AdditionalInfo.mortgageeStreetNumber === "") {
      queryvalues.AdditionalInfo.mortgageeStreetNumber = null;
    }
    const policyHolderMobileString =
      queryvalues.PolicyInfo.policy_holder_mobile.toString();
    const policyData = {
      PolicyInfo: {
        ...queryvalues.PolicyInfo,
        policy_holder_mobile: policyHolderMobileString,
      },
      PropertyInfo: queryvalues.PropertyInfo,
      AdditionalInfo: queryvalues.AdditionalInfo,
      Coverages: queryvalues.Coverages,
    };
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("policy_data", JSON.stringify(policyData));
      formDataToSend.append("email", currentSenderEmail || "");
      const response = await axiosInstance.post(
        "Policy/email_to_policy_edit/",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response && response.data.message === "Policy created successfully") {
        setQuoteAmount(response.data.quote_amount);
        setQuoteNumber(response.data.quote_number);
        setQueryvalues(initialValues);
        setDisplayValues({});
        setMissingFields([]);
        setProcessSubmit(false);
        setOpenPdf(false);
        // 1. Find and remove ALL matching emails from failedEmails
        const removedEmails = failedEmails.filter(
          (emailData) => emailData.email === currentSenderEmail
        );
        const updatedFailedEmails = failedEmails.filter(
          (emailData) => emailData.email !== currentSenderEmail
        );
        // 2. Add the removed emails with full data to editedSuccessEmails
        const updatedEditedSuccessEmails = [
          ...editedSuccessEmails,
          ...removedEmails.map((emailData) => {
            return {
              email: emailData.email,
              Subject: emailData.Subject,
              email_time: emailData.email_time,
            };
          }),
        ];
        // 3. Update tableData with the changes
        setTableData([
          ...successEmails.map((emailData) => ({
            ...emailData,
            status: "success",
          })),
          ...updatedEditedSuccessEmails.map((emailData) => ({
            ...emailData,
            status: "edited-success",
          })),
          ...updatedFailedEmails.map((emailData) => ({
            ...emailData,
            status: "failure",
          })),
        ]);
        // 4. Update other state variables
        setFailedEmails(updatedFailedEmails);
        setEditedSuccessEmails(updatedEditedSuccessEmails);
        setSuccessPopup(true);
      }
    } catch (error) {
      setProcessSubmit(false);
      setErrorMessage("An error occurred. Please try again later.");
    } finally {
      setProcessSubmit(false);
      setAfterProcess(false);
    }
  };

  const handlePopupClose = () => {
    setOpen(false);
    setSuccessPopup(false);
    setSelectedEmail("");
    setCurrentSenderEmail("");
    setQuoteAmount("");
    setQuoteNumber("");
    handleClose();
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
    setOpenSnackbar(false);
  };

  return (
    <>
      {" "}
      <div>
        {SnackbarComponent()}
      </div>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={2}
          justifyContent="center"
          ref={UploadDocument}
          style={{ margin: "2rem 0rem" }}
        >
          <Grid item xs={12} sm={6} md={6}>
            <Box
              boxShadow={3}
              padding={2}
              marginBottom={2}
              className="emailtofnolContainer"
            >
              <Box
                boxShadow={3}
                padding={2}
                marginBottom={2}
                style={{
                  maxWidth: "800px",
                  maxHeight: "450px",
                  overflowY: "auto",
                  height: "190px",
                }}
              >
                <Container>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        marginBottom={0}
                      >
                        <MailIcon
                          style={{
                            color: "#2196f3",
                            marginRight: theme.spacing(1),
                          }}
                        />
                        {emails.length === 0 ? (
                          <Typography
                            variant="h6"
                            className="Nasaliza"
                            style={{ color: "blue" }}
                          >
                            Fetch Emails
                          </Typography>
                        ) : (
                          <Typography
                            variant="h6"
                            className="Nasaliza"
                            style={{ color: "blue" }}
                          >
                            Process Emails
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    {!message ? (
                      visibleCards.map(({ email, subject, id }) => (
                        <Grid item xs={12} key={id}>
                          <Box
                            style={{
                              "--primary-color": theme.palette.primary.main,
                            }}
                          >
                            <Typography
                              variant="h6"
                              className="Mail-From Email-cards"
                              display={"block"}
                              paddingLeft={4}
                            >
                              <div className="ETF-mail">
                                <strong>Mail Id :</strong> {email}
                              </div>
                              <div className="ETF-mail">
                                {" "}
                                <strong>Subject :</strong> {subject ? subject : '--'}
                              </div>
                              {processing && id === 0 && (
                                <CheckIcon style={{ color: "green" }} />
                              )}
                            </Typography>
                          </Box>
                        </Grid>
                      ))
                    ) : (
                      <div
                        style={{
                          color: "green",
                          textAlign: "center",
                          margin: "auto",
                        }}
                      >
                        {message}
                      </div>
                    )}
                  </Grid>
                </Container>
              </Box>
              <Box
                boxShadow={3}
                padding={2}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <StyledButtonComponent
                  buttonWidth={isMobile ? 290 : 250}
                  disableColor={"#B6E3FF"}
                  style={{ marginTop: theme.spacing(1) }}
                  onClick={handleStartButtonClick}
                  disabled={startBtnDisabled || loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Start"
                  )}
                </StyledButtonComponent>
                <StyledButtonComponent
                  buttonWidth={isMobile ? 290 : 250}
                  disableColor={"#B6E3FF"}
                  style={{ marginTop: theme.spacing(1) }}
                  onClick={handleProcessButtonClick}
                  disabled={!startBtnDisabled || processLoading}
                >
                  {processLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Process"
                  )}
                </StyledButtonComponent>
              </Box>
            </Box>
          </Grid>
          {ViewEmailsReport && (
            <Grid item xs={12} sm={6} md={6}>
              <Box
                boxShadow={3}
                padding={2}
                marginBottom={2}
                style={{ maxWidth: "800px", height: "400px" }}
              >
                <CustomActiveShapePieChart
                  successEmails={successEmails}
                  failedEmails={failedEmails}
                  editedSuccessEmails={editedSuccessEmails}
                  fetchedEmails={emails.length}
                />
              </Box>
            </Grid>
          )}
        </Grid>
        {/* working here view of emails in a Table */}
        <Grid>
          {ViewEmailsReport && afterEmailsProcess && (
            <Card
              variant="outlined"
              ref={SuccessClick}
              sx={{
                background: "rgba(255, 255, 255, 0.8)",
                borderRadius: theme.spacing(2),
                padding: theme.spacing(3),
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <TableContainer sx={{ maxHeight: "300px" }}>
                {" "}
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "25%" }}>Status</TableCell>{" "}
                      <TableCell sx={{ width: "25%" }}>Email</TableCell>
                      <TableCell sx={{ width: "25%" }}>Received Time</TableCell>
                      <TableCell sx={{ width: "25%" }}>Subject</TableCell>
                      <TableCell sx={{ width: "25%" }}>View</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((row, index) => (
                      <React.Fragment key={index}>
                        <TableRow
                          hover
                          sx={{
                            cursor: "pointer",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <TableCell sx={{ width: "25%" }}>
                            {getIconForStatus(row.status)}
                          </TableCell>
                          <TableCell sx={{ width: "25%" }}>
                            {row.email ? (typeof row.email === "string" ? row.email : row.email.email) : '--'}
                          </TableCell>
                          <TableCell sx={{ width: "25%" }}>
                            {row.email_time || '_'}
                          </TableCell>
                          <TableCell sx={{ width: "25%" }}>
                            {row.Subject || '_'}
                          </TableCell>
                          <TableCell sx={{ width: "25%" }}>
                            <ToolTip title="View" arrow placement="right">
                              <Visibility
                                sx={{ color: "#0B70FF", cursor: "pointer" }}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleClickOpen(
                                    typeof row.email === "string"
                                      ? row.email
                                      : row.email.email,
                                    row.status,
                                    index
                                  );
                                }}
                              />
                            </ToolTip>
                          </TableCell>
                        </TableRow>
                        {openRow === index && (
                          <TableRow>
                            <TableCell colSpan={4}>
                              <Card
                                variant="outlined"
                                sx={{
                                  background: "rgba(255, 255, 255, 0.8)",
                                  borderRadius: theme.spacing(2),
                                  padding: theme.spacing(3),
                                  boxShadow:
                                    "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                                  backdropFilter: "blur(10px)",
                                  border: "1px solid rgba(255, 255, 255, 0.18)",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                    <Table sx={{ tableLayout: "fixed" }}>
                                     
                                      <TableHead>
                                        <TableRow>
                                          {fieldsToDisplay.map(
                                            (field, index) => (
                                              <TableCell
                                                key={index}
                                                sx={{
                                                  width: `${100 / fieldsToDisplay.length
                                                    }%`,
                                                }}
                                              >
                                                <strong>{field}</strong>
                                              </TableCell>
                                            )
                                          )}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        <TableRow>
                                          {fieldsToDisplay.map(
                                            (field, index) => (
                                              <TableCell key={index}>
                                                {field === "Missing Values" ? (
                                                  <span
                                                    style={{ color: "red" }}
                                                  >
                                                    {renderValue(field)|| '_'}
                                                  </span>
                                                ) : (
                                                  renderValue(field) || '_'
                                                )}
                                              </TableCell>
                                            )
                                          )}
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
        <Dialog
          open={openPdf}
          onClose={handleEmailDocumentClose}
          fullWidth
          maxWidth="xl"
        >
          {emailStatusType === "success" ||
            emailStatusType === "edited-success" ? (
            <>
              <DialogTitle>{documentName}</DialogTitle>
              <DialogContent>
                {contentType === "pdf" &&
                  (pdfUrl ? (
                    <embed
                      src={pdfUrl}
                      width="100%"
                      height="600px"
                      type="application/pdf"
                    />
                  ) : (
                    <PreviewError />
                  ))}
                {contentType === "html" && (
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
                {contentType === "pdf" && pdfUrl && (
                  <Button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = pdfUrl;
                      link.download = documentName || "document.pdf";
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
            <Grid
              container
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Grid item md={6}>
                <DialogTitle>{documentName}</DialogTitle>
                <DialogContent>
                  {contentType === "pdf" &&
                    (pdfUrl ? (
                      <embed
                        src={pdfUrl}
                        width="100%"
                        height="600px"
                        type="application/pdf"
                      />
                    ) : (
                      <PreviewError />
                    ))}
                  {contentType === "html" && (
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
                  {contentType === "pdf" && pdfUrl && (
                    <Button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = pdfUrl;
                        link.download = documentName || "document.pdf";
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
                  <Grid
                    className="fetch-idp-data"
                    style={{ maxHeight: "770px", overflowY: "auto" }}
                  >
                    {showRequiredMessage && (
                      <Typography
                        style={{
                          color: "red",
                          marginBottom: "10px",
                          textAlign: "center",
                        }}
                      >
                        Please provide mandatory details in the document to
                        complete the Submission.
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
                          }}
                        >
                          Policy Holder Info
                          {!editingSection.PolicyInfo && (
                            <>
                              <ToolTip title="Edit" arrow placement="right">
                                <IconButton
                                  size="small"
                                  style={{
                                    marginLeft: "0.5rem",
                                    color: "#010066",
                                  }}
                                  onClick={() =>
                                    handleEditSection("PolicyInfo")
                                  }
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </ToolTip>
                            </>
                          )}
                          {editingSection.PolicyInfo && (
                            <ToolTip title="Save" arrow placement="right">
                              <IconButton
                                size="small"
                                style={{
                                  marginLeft: "0.5rem",
                                  color: "#0B70FF",
                                }}
                                onClick={() => handleSave("PolicyInfo")}
                              >
                                <SaveIcon fontSize="small" />
                              </IconButton>
                            </ToolTip>
                          )}
                        </Typography>
                        <Grid
                          container
                          spacing={2}
                          style={{
                            marginBottom: "7px",
                            marginLeft: isMobile ? "0" : "20px",
                          }}
                        >
                          {displayValues.PolicyInfo &&
                            Object.entries(displayValues.PolicyInfo).map(
                              ([key, value]) => {
                                const isRestricted =
                                  restrictedFields.includes(key);
                                const showSuggestedAddress =
                                  showAddress &&
                                  suggestedAddress &&
                                  validatedAddressKey === key;
                                return (
                                  <React.Fragment key={key}>
                                    <Grid
                                      item
                                      xs={5}
                                      sm={5}
                                      md={5}
                                      sx={{
                                        fontWeight: 550,
                                        fontSize: 13,
                                        textAlign: "left",
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {key}
                                      {isRestricted &&
                                        key === "Policy Holder Address" && (
                                          <>
                                            {!editingPolicyholderAddress &&
                                              policyHolderAddressValidation !==
                                              true && (
                                                <ToolTip
                                                  title="Edit"
                                                  arrow
                                                  placement="right"
                                                >
                                                  <IconButton
                                                    size="small"
                                                    style={{
                                                      marginLeft: "0.5rem",
                                                      color: "#010066",
                                                    }}
                                                    onClick={() =>
                                                      setEditingPolicyholderAddress(
                                                        true
                                                      )
                                                    }
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
                                                  : policyHolderAddressValidation ===
                                                    ""
                                                    ? "Validated"
                                                    : "Not Validated"
                                              }
                                              arrow
                                              placement="bottom"
                                            >
                                              <IconButton
                                                size="small"
                                                style={{
                                                  marginLeft: "0.5rem",
                                                  color: "#010066",
                                                }}
                                              >
                                                {validatingAddress ? (
                                                  <CircularProgress
                                                    size={20}
                                                    color="inherit"
                                                  />
                                                ) : policyHolderAddressValidation ===
                                                  "" ? (
                                                  <ValidateIcon
                                                    fontSize="small"
                                                    color="success"
                                                  />
                                                ) : (
                                                  <WarningIcon
                                                    fontSize="small"
                                                    color="warning"
                                                  />
                                                )}
                                              </IconButton>
                                            </ToolTip>
                                            {/* Validate Button (Only when editingAddress is true) */}
                                            {editingPolicyholderAddress &&
                                              policyHolderAddressValidation !==
                                              true && (
                                                <StyledButtonComponent
                                                  buttonWidth={80}
                                                  size="small"
                                                  sx={{ marginLeft: 2 }}
                                                  onClick={() =>
                                                    handleValidateAddress(
                                                      key,
                                                      "PolicyInfo"
                                                    )
                                                  }
                                                  disabled={value === null}
                                                >
                                                  Validate
                                                </StyledButtonComponent>
                                              )}
                                          </>
                                        )}
                                    </Grid>
                                    <Grid
                                      item
                                      xs={1}
                                      sm={1}
                                      md={1.5}
                                      style={{ textAlign: "left" }}
                                    >
                                      :
                                    </Grid>
                                    <Grid
                                      item
                                      xs={6}
                                      sm={6}
                                      md={5.5}
                                      style={{ textAlign: "left" }}
                                    >
                                      {key === "Policy Holder Address" ? (
                                        editingPolicyholderAddress ? (
                                          <TextField
                                            sx={{
                                              "& .MuiOutlinedInput-root": {
                                                height: "35px",
                                                backgroundColor: "none",
                                              },
                                            }}
                                            variant="outlined"
                                            required
                                            name={key}
                                            value={value}
                                            onChange={(e) =>
                                              handleInputChange(
                                                key,
                                                e.target.value,
                                                "PolicyInfo"
                                              )
                                            }
                                          />
                                        ) : (
                                          <span
                                            style={{
                                              fontWeight: 500,
                                              fontSize: 13,
                                            }}
                                          >
                                            {/* Display the address value if available */}
                                            {value ? (
                                              <>
                                                {value}
                                                {key ===
                                                  "Policy Holder Address" &&
                                                  policyHolderAddressValidation ===
                                                  null &&
                                                  !editingPolicyholderAddress ? (
                                                  <span
                                                    style={{
                                                      color: "red",
                                                      fontWeight: 500,
                                                      fontSize: 12,
                                                    }}
                                                  >
                                                    <br />
                                                    Address not validated
                                                  </span>
                                                ) : null}
                                              </>
                                            ) : (
                                              <span
                                                style={{
                                                  color: "red",
                                                  fontWeight: 500,
                                                  fontSize: 12,
                                                }}
                                              >
                                                required
                                              </span>
                                            )}
                                          </span>
                                        )
                                      ) : editingSection.PolicyInfo ? (
                                        <TextField
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              height: "35px",
                                              backgroundColor: "none",
                                            },
                                          }}
                                          variant="outlined"
                                          required
                                          name={key}
                                          value={value}
                                          onChange={(e) =>
                                            handleInputChange(
                                              key,
                                              e.target.value,
                                              "PolicyInfo"
                                            )
                                          }
                                        />
                                      ) : (
                                        <span
                                          style={{
                                            fontWeight: 500,
                                            fontSize: 13,
                                          }}
                                        >
                                          {value ? (
                                            value
                                          ) : (
                                            <span
                                              style={{
                                                color: "red",
                                                fontWeight: 500,
                                                fontSize: 12,
                                              }}
                                            >
                                              required
                                            </span>
                                          )}
                                        </span>
                                      )}
                                    </Grid>
                                    {/* Suggested Address */}
                                    {showSuggestedAddress && (
                                      <Grid
                                        container
                                        sx={{
                                          mt: 1,
                                          alignItems: "center",
                                          marginLeft: isMobile ? "0" : "20px",
                                        }}
                                      >
                                        {" "}
                                        <Grid item xs={6.5}></Grid>
                                        <Grid
                                          item
                                          xs={5.5}
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          {" "}
                                          <Typography
                                            variant="caption"
                                            sx={{ color: "#0B70FF", mr: 1 }}
                                          >
                                            {" "}
                                            {suggestedAddress}
                                          </Typography>
                                          <Checkbox
                                            color="primary"
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                handleConfirmAddress(
                                                  spittedAddress,
                                                  key
                                                );
                                              }
                                            }}
                                          />
                                        </Grid>
                                      </Grid>
                                    )}
                                  </React.Fragment>
                                );
                              }
                            )}
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
                          }}
                        >
                          Property Information
                          {!editingSection.PropertyInfo && (
                            <ToolTip title="Edit" arrow placement="right">
                              <IconButton
                                size="small"
                                style={{
                                  marginLeft: "0.5rem",
                                  color: "#010066",
                                }}
                                onClick={() =>
                                  handleEditSection("PropertyInfo")
                                }
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </ToolTip>
                          )}
                          {editingSection.PropertyInfo && (
                            <ToolTip title="Save" arrow placement="right">
                              <IconButton
                                size="small"
                                style={{
                                  marginLeft: "0.5rem",
                                  color: "#0B70FF",
                                }}
                                onClick={() => handleSave("PropertyInfo")}
                              >
                                <SaveIcon fontSize="small" />
                              </IconButton>
                            </ToolTip>
                          )}
                        </Typography>
                        <Grid
                          container
                          spacing={2}
                          style={{
                            marginBottom: "7px",
                            marginLeft: isMobile ? "0" : "20px",
                          }}
                        >
                          {displayValues.PropertyInfo &&
                            Object.entries(displayValues.PropertyInfo).map(
                              ([key, value]) => {
                                const isRestricted =
                                  restrictedFields.includes(key);
                                const showSuggestedAddress =
                                  showAddress &&
                                  suggestedAddress &&
                                  validatedAddressKey === key;
                                return (
                                  (key !== "Additional Information" ||
                                    (key === "Additional Information" &&
                                      queryvalues.PropertyInfo
                                        .additionalInfo)) && (
                                    <React.Fragment key={key}>
                                      <Grid
                                        item
                                        xs={5}
                                        sm={5}
                                        md={5}
                                        sx={{
                                          fontWeight: 550,
                                          fontSize: 13,
                                          textAlign: "left",
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {key}
                                        {isRestricted &&
                                          key ===
                                          "Coverage Location Address" && (
                                            <>
                                              {/* Edit/Check Icon for Coverage Location Address */}
                                              {!editingAddress &&
                                                propertyAddressValidation !==
                                                true && (
                                                  <ToolTip
                                                    title="Edit"
                                                    arrow
                                                    placement="bottom"
                                                  >
                                                    <IconButton
                                                      size="small"
                                                      style={{
                                                        marginLeft: "0.5rem",
                                                        color: "#010066",
                                                      }}
                                                      onClick={() =>
                                                        setEditingAddress(true)
                                                      }
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
                                                    : propertyAddressValidation ===
                                                      ""
                                                      ? "Validated"
                                                      : "Not Validated"
                                                }
                                                arrow
                                                placement="bottom"
                                              >
                                                <IconButton
                                                  size="small"
                                                  style={{
                                                    marginLeft: "0.5rem",
                                                    color: "#010066",
                                                  }}
                                                >
                                                  {validatingAddress ? (
                                                    <CircularProgress
                                                      size={20}
                                                      color="inherit"
                                                    />
                                                  ) : propertyAddressValidation ===
                                                    "" ? (
                                                    <ValidateIcon
                                                      fontSize="small"
                                                      color="success"
                                                    />
                                                  ) : (
                                                    <WarningIcon
                                                      fontSize="small"
                                                      color="warning"
                                                    />
                                                  )}
                                                </IconButton>
                                              </ToolTip>
                                              {/* Validate Button (Only when editingAddress is true) */}
                                              {editingAddress &&
                                                propertyAddressValidation !==
                                                true && (
                                                  <StyledButtonComponent
                                                    buttonWidth={80}
                                                    size="small"
                                                    sx={{ marginLeft: 2 }}
                                                    onClick={() =>
                                                      handleValidateAddress(
                                                        key,
                                                        "PropertyInfo"
                                                      )
                                                    }
                                                    disabled={value === null}
                                                  >
                                                    Validate
                                                  </StyledButtonComponent>
                                                )}
                                            </>
                                          )}
                                      </Grid>
                                      <Grid
                                        item
                                        xs={1}
                                        sm={1}
                                        md={1.5}
                                        style={{ textAlign: "left" }}
                                      >
                                        :
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        sm={6}
                                        md={5.5}
                                        style={{ textAlign: "left" }}
                                      >
                                        {/* TextField for Coverage Location Address */}
                                        {key === "Coverage Location Address" ? (
                                          editingAddress ? (
                                            <TextField
                                              sx={{
                                                "& .MuiOutlinedInput-root": {
                                                  height: "35px",
                                                  backgroundColor: "none",
                                                },
                                              }}
                                              variant="outlined"
                                              required
                                              name={key}
                                              value={value}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  key,
                                                  e.target.value,
                                                  "PropertyInfo"
                                                )
                                              }
                                            />
                                          ) : (
                                            <span
                                              style={{
                                                fontWeight: 500,
                                                fontSize: 13,
                                              }}
                                            >
                                              {/* Display the address value if available */}
                                              {value ? (
                                                <>
                                                  {value}
                                                  {key ===
                                                    "Coverage Location Address" &&
                                                    propertyAddressValidation ===
                                                    null &&
                                                    !editingAddress ? (
                                                    <span
                                                      style={{
                                                        color: "red",
                                                        fontWeight: 500,
                                                        fontSize: 12,
                                                      }}
                                                    >
                                                      <br />
                                                      Address not validated
                                                    </span>
                                                  ) : null}
                                                </>
                                              ) : (
                                                <span
                                                  style={{
                                                    color: "red",
                                                    fontWeight: 500,
                                                    fontSize: 12,
                                                  }}
                                                >
                                                  required
                                                </span>
                                              )}
                                            </span>
                                          )
                                        ) : editingSection.PropertyInfo ? (
                                          <TextField
                                            sx={{
                                              "& .MuiOutlinedInput-root": {
                                                height: "35px",
                                                backgroundColor: "none",
                                              },
                                            }}
                                            variant="outlined"
                                            required
                                            name={key}
                                            value={value}
                                            onChange={(e) =>
                                              handleInputChange(
                                                key,
                                                e.target.value,
                                                "PropertyInfo"
                                              )
                                            }
                                          />
                                        ) : (
                                          <span
                                            style={{
                                              fontWeight: 500,
                                              fontSize: 13,
                                            }}
                                          >
                                            {value ? (
                                              value
                                            ) : (
                                              <span
                                                style={{
                                                  color: "red",
                                                  fontWeight: 500,
                                                  fontSize: 12,
                                                }}
                                              >
                                                required
                                              </span>
                                            )}
                                          </span>
                                        )}
                                      </Grid>
                                      {key === "Coverage Location Address" &&
                                        queryvalues.PolicyInfo
                                          .validated_address &&
                                        queryvalues.PolicyInfo
                                          .validated_address !==
                                        "Address Not validated" && (
                                          <Grid
                                            container
                                            sx={{
                                              mt: 1,
                                              alignItems: "center",
                                              marginLeft: isMobile
                                                ? "0"
                                                : "20px",
                                            }}
                                          >
                                            {" "}
                                            <Grid item xs={6}></Grid>
                                            <Grid
                                              item
                                              xs={6}
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Typography
                                                style={{
                                                  fontWeight: 500,
                                                  fontSize: 12,
                                                  marginRight: "10px",
                                                }}
                                              >
                                                Same as Policy Holder Address?
                                              </Typography>
                                              <RadioGroup
                                                row
                                                value={
                                                  sameAsPolicyHolderAddress
                                                    ? "true"
                                                    : "false"
                                                }
                                                onChange={(e) => {
                                                  setSameAsPolicyHolderAddress(
                                                    e.target.value === "true"
                                                  );

                                                  if (
                                                    e.target.value === "true"
                                                  ) {
                                                    const policyHolderAddress =
                                                      displayValues.PolicyInfo[
                                                      "Policy Holder Address"
                                                      ];
                                                    setDisplayValues(
                                                      (prevValues) => {
                                                        const updatedSection = {
                                                          ...prevValues[
                                                          "PropertyInfo"
                                                          ],
                                                        };
                                                        updatedSection[
                                                          "Coverage Location Address"
                                                        ] = policyHolderAddress;
                                                        return {
                                                          ...prevValues,
                                                          // eslint-disable-next-line
                                                          ["PropertyInfo"]:
                                                            updatedSection,
                                                        };
                                                      }
                                                    );
                                                    // 2. Update spittedAddress to match Policy Holder's address
                                                    const matchingSpittedAddress =
                                                      Object.entries(
                                                        queryvalues.PolicyInfo
                                                      ).reduce(
                                                        (acc, [key, value]) => {
                                                          if (
                                                            [
                                                              "policy_holder_street_number",
                                                              "policy_holder_street_name",
                                                              "policy_holder_city",
                                                              "policy_holder_state",
                                                              "policy_holder_country",
                                                            ].includes(key)
                                                          ) {
                                                            acc[
                                                              key.replace(
                                                                "policy_holder_",
                                                                ""
                                                              )
                                                            ] = value;
                                                          } else if (
                                                            key ===
                                                            "policy_holder_zip"
                                                          ) {
                                                            acc["zip_code"] =
                                                              value;
                                                          }
                                                          return acc;
                                                        },
                                                        {}
                                                      );
                                                    // 3. Pass the correct suggestedAddress and spittedAddress
                                                    handleConfirmAddress(
                                                      matchingSpittedAddress,
                                                      "Coverage Location Address"
                                                    );
                                                    setPropertyAddressValidation(
                                                      ""
                                                    );
                                                  } else {
                                                    handleInputChange(
                                                      "Coverage Location Address",
                                                      initialCoverageLocationAddress,
                                                      "PropertyInfo"
                                                    );
                                                    setQueryvalues(
                                                      (prevValues) => {
                                                        const updatedSection = {
                                                          ...prevValues[
                                                          "PropertyInfo"
                                                          ],
                                                        };
                                                        updatedSection[
                                                          "validated_address"
                                                        ] =
                                                          "Address Not validated";
                                                        return {
                                                          ...prevValues,
                                                          // eslint-disable-next-line
                                                          ["PropertyInfo"]:
                                                            updatedSection,
                                                        };
                                                      }
                                                    );
                                                    setPropertyAddressValidation(
                                                      null
                                                    );
                                                  }
                                                }}
                                              >
                                                <FormControlLabel
                                                  value="true"
                                                  control={
                                                    <Radio
                                                      sx={{
                                                        transform: "scale(0.8)",
                                                      }}
                                                    />
                                                  }
                                                  label={
                                                    <Typography
                                                      sx={{ fontSize: 12 }}
                                                    >
                                                      Yes
                                                    </Typography>
                                                  }
                                                />
                                                <FormControlLabel
                                                  value="false"
                                                  control={
                                                    <Radio
                                                      sx={{
                                                        transform: "scale(0.8)",
                                                      }}
                                                    />
                                                  }
                                                  label={
                                                    <Typography
                                                      sx={{ fontSize: 12 }}
                                                    >
                                                      No
                                                    </Typography>
                                                  }
                                                />
                                              </RadioGroup>
                                            </Grid>
                                          </Grid>
                                        )}
                                      {/* Suggested Address */}
                                      {showSuggestedAddress && (
                                        <Grid
                                          container
                                          sx={{
                                            mt: 1,
                                            alignItems: "center",
                                            marginLeft: isMobile ? "0" : "20px",
                                          }}
                                        >
                                          {" "}
                                          <Grid item xs={6.5}></Grid>
                                          <Grid
                                            item
                                            xs={5.5}
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            {" "}
                                            <Typography
                                              variant="caption"
                                              sx={{ color: "#0B70FF", mr: 1 }}
                                            >
                                              {" "}
                                              {suggestedAddress}
                                            </Typography>
                                            <Checkbox
                                              color="primary"
                                              onChange={(e) => {
                                                if (e.target.checked) {
                                                  handleConfirmAddress(
                                                    spittedAddress,
                                                    key
                                                  );
                                                }
                                              }}
                                            />
                                          </Grid>
                                        </Grid>
                                      )}
                                    </React.Fragment>
                                  )
                                );
                              }
                            )}
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
                          }}
                        >
                          Prior Policy Info
                          {!editingSection.AdditionalInfo && (
                            <ToolTip title="Edit" arrow placement="right">
                              <IconButton
                                size="small"
                                style={{
                                  marginLeft: "0.5rem",
                                  color: "#010066",
                                }}
                                onClick={() =>
                                  handleEditSection("AdditionalInfo")
                                }
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </ToolTip>
                          )}
                          {editingSection.AdditionalInfo && (
                            <ToolTip title="Save" arrow placement="right">
                              <IconButton
                                size="small"
                                style={{
                                  marginLeft: "0.5rem",
                                  color: "#0B70FF",
                                }}
                                onClick={() => handleSave("AdditionalInfo")}
                              >
                                <SaveIcon fontSize="small" />
                              </IconButton>
                            </ToolTip>
                          )}
                        </Typography>
                        <Grid
                          container
                          spacing={2}
                          style={{
                            marginBottom: "7px",
                            marginLeft: isMobile ? "0" : "20px",
                          }}
                        >
                          {displayValues.AdditionalInfo &&
                            Object.entries(displayValues.AdditionalInfo).map(
                              ([key, value]) =>
                                (key !== "Mortgagee Address" ||
                                  (key === "Mortgagee Address" && value)) && (
                                  <React.Fragment key={key}>
                                    <Grid
                                      item
                                      xs={5}
                                      sm={5}
                                      md={5}
                                      style={{
                                        fontWeight: 550,
                                        fontSize: 13,
                                        textAlign: "left",
                                      }}
                                    >
                                      {key}
                                    </Grid>
                                    <Grid
                                      item
                                      xs={1}
                                      sm={1}
                                      md={1.5}
                                      style={{ textAlign: "left" }}
                                    >
                                      :
                                    </Grid>
                                    <Grid
                                      item
                                      xs={6}
                                      sm={6}
                                      md={5.5}
                                      style={{ textAlign: "left" }}
                                    >
                                      {editingSection.AdditionalInfo ? (
                                        <TextField
                                          sx={{
                                            "& .MuiOutlinedInput-root": {
                                              height: "35px",
                                              backgroundColor: "none",
                                            },
                                          }}
                                          variant="outlined"
                                          required
                                          name={key}
                                          value={value}
                                          onChange={(e) =>
                                            handleInputChange(
                                              key,
                                              e.target.value,
                                              "AdditionalInfo"
                                            )
                                          }
                                        />
                                      ) : (
                                        <span
                                          style={{
                                            fontWeight: 500,
                                            fontSize: 13,
                                          }}
                                        >
                                          {value ? (
                                            value
                                          ) : (
                                            <span
                                              style={{
                                                color: "red",
                                                fontWeight: 500,
                                                fontSize: 13,
                                              }}
                                            >
                                              {`required`}
                                            </span>
                                          )}
                                        </span>
                                      )}
                                    </Grid>
                                  </React.Fragment>
                                )
                            )}
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
                          }}
                        >
                          Coverages
                          {!editingSection.Coverages && (
                            <ToolTip title="Edit" arrow placement="right">
                              <IconButton
                                size="small"
                                style={{
                                  marginLeft: "0.5rem",
                                  color: "#010066",
                                }}
                                onClick={() => handleEditSection("Coverages")}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </ToolTip>
                          )}
                          {editingSection.Coverages && (
                            <ToolTip title="Save" arrow placement="right">
                              <IconButton
                                size="small"
                                style={{
                                  marginLeft: "0.5rem",
                                  color: "#0B70FF",
                                }}
                                onClick={() => handleSave("Coverages")}
                              >
                                <SaveIcon fontSize="small" />
                              </IconButton>
                            </ToolTip>
                          )}
                        </Typography>
                        <Grid
                          container
                          spacing={2}
                          style={{
                            marginBottom: "7px",
                            marginLeft: isMobile ? "0" : "20px",
                          }}
                        >
                          {displayValues.Coverages &&
                            Object.entries(displayValues.Coverages).map(
                              ([key, value]) => (
                                <React.Fragment key={key}>
                                  <Grid
                                    item
                                    xs={5}
                                    sm={5}
                                    md={5}
                                    style={{
                                      fontWeight: 550,
                                      fontSize: 13,
                                      textAlign: "left",
                                    }}
                                  >
                                    {key}
                                  </Grid>
                                  <Grid
                                    item
                                    xs={1}
                                    sm={1}
                                    md={1.5}
                                    style={{ textAlign: "left" }}
                                  >
                                    :
                                  </Grid>
                                  <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={5.5}
                                    style={{ textAlign: "left" }}
                                  >
                                    {editingSection.Coverages ? (
                                      <TextField
                                        sx={{
                                          "& .MuiOutlinedInput-root": {
                                            height: "35px",
                                            backgroundColor: "none",
                                          },
                                        }}
                                        variant="outlined"
                                        required
                                        name={key}
                                        value={value}
                                        onChange={(e) =>
                                          handleInputChange(
                                            key,
                                            e.target.value,
                                            "Coverages"
                                          )
                                        }
                                      />
                                    ) : (
                                      <span
                                        style={{
                                          fontWeight: 500,
                                          fontSize: 13,
                                        }}
                                      >
                                        {value ? (
                                          value
                                        ) : (
                                          <span
                                            style={{
                                              color: "red",
                                              fontWeight: 500,
                                              fontSize: 13,
                                            }}
                                          >
                                            {`required`}
                                          </span>
                                        )}
                                      </span>
                                    )}
                                  </Grid>
                                </React.Fragment>
                              )
                            )}
                        </Grid>
                      </>
                    ) : (
                      <></>
                    )}
                    <Grid
                      container
                      justifyContent="center"
                      alignItems="center"
                      style={{ margin: "3rem 1px" }}
                      spacing={1}
                    >
                      <Grid item>
                        <StyledButtonComponent
                          buttonWidth={150}
                          disableColor={"#B6E3FF"}
                          onClick={() =>
                            handleExtractClaimSubmit(displayValues, queryvalues)
                          }
                          disabled={showRequiredMessage}
                        >
                          Submit Policy
                        </StyledButtonComponent>
                      </Grid>

                      <Backdrop
                        sx={{
                          color: "#fff",
                          zIndex: (theme) => theme.zIndex.drawer + 1,
                        }}
                        open={processSubmit}
                      >
                        <CircularProgress color="inherit" />
                      </Backdrop>
                    </Grid>
                  </Grid>
                </DialogContent>
              </Grid>
            </Grid>
          )}
        </Dialog>
        {/* Dialog for displaying full Email Body */}
        <Dialog open={showFullBody} onClose={() => setShowFullBody(false)}>
          <DialogTitle>Email Body</DialogTitle>
          <DialogContent>
            <Typography variant="body1" align="justify">
              {parse(emailBody.replace(/\r\n/g, "<br />"))}
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
        {/* extracted data dialog box */}
        <Dialog open={openExtractedData} maxWidth="md" fullWidth>
          <DialogTitle
            className="Nasaliza"
            style={{
              color: "#0B70FF",
              textAlign: "center",
              fontSize: "1.5rem",
              marginTop: "0.5rem",
              marginBottom: "-1rem",
            }}
          >
            Submission Details
          </DialogTitle>
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
        </Dialog>
        {/* quote number and quote amount dialog box for the success emails */}
        <Dialog open={openResultData} maxWidth="md" fullWidth>
          <DialogContent>
            <ShowQuoteNumberAmount
              QuoteNumber={successQuoteNumber}
              QuoteAmount={successQuoteAmount}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenResultData(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* edited submission success popup */}
        {successPopup && (
          <Dialog
            open={successPopup}
            onClose={handlePopupClose}
            fullWidth
            maxWidth="md"
            PaperProps={{ style: { maxHeight: "80vh" } }}
          >
            <Box sx={{ textAlign: "center" }}>
              {isMobile && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <CheckCircleIcon sx={{ fontSize: 60, color: "green" }} />
                </Box>
              )}
              <Grid
                container
                justifyContent="center"
                style={{ marginTop: "3rem" }}
              >
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    {!isMobile && (
                      <CheckCircleIcon
                        sx={{ fontSize: 40, mr: 2, color: "green" }}
                      />
                    )}
                    <Typography
                      className="Nasaliza"
                      style={{ fontSize: isMobile ? "1rem" : "1.5rem" }}
                    >
                      Quote Created Successfully!
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, textAlign: "center" }}
                    className="Nasaliza"
                  >
                    Quote Number:
                    <span style={{ color: "#0B70FF" }}>
                      {quoteNumber && quoteNumber}
                    </span>
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, textAlign: "center" }}
                    className="Nasaliza"
                  >
                    Quote Amount:
                    <span style={{ color: "#0B70FF" }}>
                      {`$${quoteAmount && quoteAmount}`}
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
        )}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {validationError}
          </Alert>
        </Snackbar>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default EmailToPolicyIntakeFun;
