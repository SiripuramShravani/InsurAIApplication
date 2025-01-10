import React, { useState, useCallback, useRef, memo } from "react";
import DatePicker from "react-datepicker";
import {
  Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText,
  Box,
  Paper,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  DialogTitle,
  Alert,
  Snackbar,
} from "@mui/material";
import FileUpload from "../../components/FileUploadExtra.js";
import StyledButtonComponent from "../../components/StyledButton";
import processclaim from "../../assets/processclaim.png";
import { Cell, ResponsiveContainer } from "recharts";
import useNetworkStatus from "../../components/ErrorPages/UseNetworkStatus.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { BarChart, XAxis, YAxis, Bar } from "recharts";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Edit as EditIcon, InfoOutlined as InfoIcon, Close as CloseIcon, GetApp as GetAppIcon } from "@mui/icons-material";
import { FIELD_VALIDATION_MAPPING, FIELD_TYPE_MAPPING, MODEL_FIELD_MAPPING, MODEL_MAPPING, FIELD_TYPES, FIELD_OPTIONS_MAPPING } from "./Validations/DOCAI_Classify_Validations.js";

const CustomActiveShapePieChart = ({
  successDocuments,
  workQueueDocuments,
  anonymousWorkQueueDocuments,
  uploadedDocuments,
  totalProcessedDocuments,
}) => {
  const successPercentage = totalProcessedDocuments
    ? (successDocuments / totalProcessedDocuments) * 100
    : 0;
  const workQueuePercentage = totalProcessedDocuments
    ? (workQueueDocuments / totalProcessedDocuments) * 100
    : 0;
  const anonymousWorkQueuePercentage = totalProcessedDocuments
    ? (anonymousWorkQueueDocuments / totalProcessedDocuments) * 100
    : 0;
  const data =
    totalProcessedDocuments > 0
      ? [
        {
          name: "Success",
          percentage: successPercentage,
          count: successDocuments,
        },
        {
          name: "WorkQueue",
          percentage: workQueuePercentage,
          count: workQueueDocuments,
        },
        {
          name: "UnClassified WorkQueue",
          percentage: anonymousWorkQueuePercentage,
          count: anonymousWorkQueueDocuments,
        },
      ]
      : [{ name: "Not Uploaded Documents", percentage: 100, count: 0 }];
  const [hoveredBar, setHoveredBar] = useState(null);
  return (
    <Box>
      <Typography
        variant="h6"
        style={{
          textAlign: "center",
          marginBottom: 16,
          color: "#001660",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        DocAI Classify Status Distribution
      </Typography>
      <Grid container justifyContent="center">
        <Grid item>
          <Box display="flex" flexDirection="row" alignItems="flex-start">
            {/* Graph Section */}
            <ResponsiveContainer width={400} height={320}>
              <BarChart
                data={data.map((item) =>
                  item.name === "UnClassified WorkQueue"
                    ? { ...item, name: "UnClassified" }
                    : item
                )}
                margin={{ top: 20, right: 30, bottom: 50, left: 10 }}
              >
                <defs>
                  <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4CAF50" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#4CAF50" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient id="workQueueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffc107" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#ffc107" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient id="anonymousGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f44336" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#f44336" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#001660"
                  tick={{
                    fontSize: 12,
                    fill: "#001660",
                    textAnchor: "middle",
                    transform: "translate(0, 10)",
                  }}
                  interval={0}
                  angle={0}
                  tickLine={false}
                />
                <YAxis
                  stroke="#001660"
                  tick={{ fontSize: 12, fill: "#001660" }}
                  width={50}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                  formatter={(value, name, props) =>
                    [`${value.toFixed(2)}% (${props.payload.count} docs)`, name]
                  }
                />
                <Bar
                  dataKey="percentage"
                  radius={[4, 4, 0, 0]}
                  barSize={22}
                  label={{
                    position: "top",
                    fill: "#001660",
                    fontSize: 12,
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
                          ? "workQueueGradient"
                          : "anonymousGradient"
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
                width: "275px",
                height: "320px",
                padding: "12px",
                borderRadius: "12px",
                marginLeft: '50px'

              }}
            >
              {[{
                label: "Uploaded",
                value: uploadedDocuments,
                color: "#2196F3",
                icon: "📤",
              },
              { label: "Success", value: successDocuments, color: "#4CAF50", icon: "✅" },
              {
                label: "WorkQueue",
                value: workQueueDocuments,
                color: "#ffc107",
                icon: "📝",
              },
              {
                label: "UnClassified",
                value: anonymousWorkQueueDocuments,
                color: "#f44336",
                icon: "🔒",
              },
              {
                label: "Processed",
                value: totalProcessedDocuments,
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
                    padding: "8px 10px",
                    borderRadius: "6px",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    marginBottom: index < 4 ? "6px" : "0",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Box
                      style={{
                        width: "28px",
                        height: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: item.color,
                        color: "#fff",
                        borderRadius: "50%",
                        marginRight: "8px",
                        fontSize: "0.8rem",
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography
                    style={{
                      fontSize: "1.2rem",
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
      {/* Hover Effect Display */}
      {hoveredBar && (
        <Box
          style={{
            marginTop: "12px",
            fontSize: "0.95rem",
            fontWeight: "bold",
            color: "#010066",
            display: "flex",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <Typography>{`${hoveredBar.name}: ${hoveredBar.percentage.toFixed(
            2
          )}%`}</Typography>
          <Typography>{`(${hoveredBar.count} docs)`}</Typography>
        </Box>
      )}
    </Box>
  );
};

//Reusable Components:
const commonFieldStyles = {
  mb: 2,
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
    fontWeight: 400,
    transform: 'translate(0, -1.5px) scale(0.75)',
    transformOrigin: 'top left',
    color: 'rgba(0, 0, 0, 0.6)',
    '&.Mui-focused': {
      color: 'rgba(0, 0, 0, 0.6)',
    },
    '&.Mui-error': {
      color: '#d32f2f',
    }
  },
  '& .MuiInputBase-root': {
    marginTop: '16px',
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 0
  }
};

const MyTextField = ({ fieldName, indexData, handleIndexDataChange, errorStyles, classification }) => {
  const [error, setError] = useState(indexData[fieldName] === "Not Found");
  const [helperText, setHelperText] = useState("");
  const validateField = (value) => {
    const validationRules = FIELD_VALIDATION_MAPPING[classification]?.[fieldName];
    if (!validationRules) return true;
    if (validationRules.required && !value) {
      setError(true);
      setHelperText("This field is required");
      return false;
    }
    if (validationRules.pattern && !validationRules.pattern.test(value)) {
      setError(true);
      setHelperText(validationRules.errorMessage);
      return false;
    }
    if (validationRules.minLength && value.length < validationRules.minLength) {
      setError(true);
      setHelperText(validationRules.errorMessage);
      return false;
    }
    setError(false);
    setHelperText("");
    return true;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    validateField(value);
    handleIndexDataChange(fieldName, value);
  };

  const handleBlur = () => {
    validateField(indexData[fieldName] || "");
  };

  return (
    <TextField
      key={fieldName}
      label={fieldName.replace(/_/g, " ")}
      fullWidth
      variant="standard"
      required={FIELD_VALIDATION_MAPPING[classification]?.[fieldName]?.required}
      name={fieldName}
      value={indexData[fieldName] || ""}
      onChange={handleChange}
      onBlur={handleBlur}
      helperText={helperText}
      error={error}
      sx={{
        ...commonFieldStyles,
        ...errorStyles(error)
      }}
    />
  );
};

const MySelect = ({ fieldName, indexData, handleIndexDataChange, options, errorStyles, disabled, classification }) => {
  const [error, setError] = useState(indexData[fieldName] === "Not Found");
  const [helperText, setHelperText] = useState("");
  const fieldOptions = FIELD_OPTIONS_MAPPING[fieldName] || options;
  const validateField = (value) => {
    const validationRules = FIELD_VALIDATION_MAPPING[classification]?.[fieldName];
    if (!validationRules) return true;
    if (validationRules.required && !value) {
      setError(true);
      setHelperText("Please select an option");
      return false;
    }
    setError(false);
    setHelperText("");
    return true;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    validateField(value);
    handleIndexDataChange(fieldName, value);
  };

  return (
    <FormControl
      fullWidth
      variant="standard"
      error={error}
      sx={{
        ...commonFieldStyles,
        ...errorStyles(error)
      }}
    >
      <InputLabel>{fieldName.replace(/_/g, " ")}</InputLabel>
      <Select
        value={indexData[fieldName] || ""}
        onChange={handleChange}
        required={FIELD_VALIDATION_MAPPING[classification]?.[fieldName]?.required}
        name={fieldName}
        disabled={disabled}
        sx={{ mt: 2 }}
      >
        {fieldOptions.map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

const MyDateField = ({ fieldName, indexData, handleIndexDataChange, errorStyles, classification }) => {
  const [error, setError] = useState(indexData[fieldName] === "Not Found");
  const [helperText, setHelperText] = useState("");

  const validateField = (date) => {
    const validationRules = FIELD_VALIDATION_MAPPING[classification]?.[fieldName];
    if (!validationRules) return true;
    if (validationRules.required && !date) {
      setError(true);
      setHelperText("Please select a date");
      return false;
    }
    const currentDate = new Date();
    if (validationRules.maxDate && date > currentDate) {
      setError(true);
      setHelperText("Date cannot be in the future");
      return false;
    }
    setError(false);
    setHelperText("");
    return true;
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const formats = [
      'YYYY/MM/DD HH:mm:ss',
      'YYYY/MM/DD',
      'YYYY-MM-DD',
      'MM/DD/YYYY',
      'DD/MM/YYYY'
    ];
    let parsedDate = null;
    const timestamp = Date.parse(dateString);
    if (!isNaN(timestamp)) {
      parsedDate = new Date(timestamp);
    } else {
      for (const format of formats) {
        const parts = dateString.split(/[/-\s:]/);
        if (format.startsWith('YYYY')) {
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1;
          const day = parseInt(parts[2]);
          const date = new Date(year, month, day);
          if (!isNaN(date.getTime())) {
            parsedDate = date;
            break;
          }
        } else if (format.startsWith('MM')) {
          const month = parseInt(parts[0]) - 1;
          const day = parseInt(parts[1]);
          const year = parseInt(parts[2]);
          const date = new Date(year, month, day);
          if (!isNaN(date.getTime())) {
            parsedDate = date;
            break;
          }
        } else if (format.startsWith('DD')) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1;
          const year = parseInt(parts[2]);
          const date = new Date(year, month, day);
          if (!isNaN(date.getTime())) {
            parsedDate = date;
            break;
          }
        }
      }
    }
    return parsedDate;
  };

  const handleChange = (date) => {
    validateField(date);
    handleIndexDataChange(fieldName, date);
  };

  const getDisplayValue = () => {
    const value = indexData[fieldName];
    if (!value) return "";
    const date = parseDate(value);
    if (!date) return value;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  return (
    <FormControl
      fullWidth
      variant="standard"
      error={error}
      sx={{
        ...commonFieldStyles,
        ...errorStyles(error)
      }}
    >
      <DatePicker
        selected={indexData[fieldName] ? parseDate(indexData[fieldName]) : null}
        onChange={handleChange}
        dateFormat="yyyy/MM/dd"
        customInput={
          <TextField
            label={fieldName.replace(/_/g, " ")}
            required={FIELD_VALIDATION_MAPPING[classification]?.[fieldName]?.required}
            fullWidth
            variant="standard"
            error={error}
            helperText={helperText}
            value={getDisplayValue()}
            InputProps={{
              endAdornment: (
                <CalendarTodayIcon
                  sx={{
                    color: error ? '#d32f2f' : 'action.active',
                    marginRight: 1
                  }}
                />
              )
            }}
          />
        }
        placeholderText="YYYY/MM/DD"
      />
    </FormControl>
  );
};

// Create a memoized document preview component
const DocumentPreview = memo(({ record }) => {
  const sanitizeBase64 = (base64String) => {
    return base64String.replace(/^data:application\/pdf;base64,/, '')
      .replace(/\s/g, '');
  };

  const tryPreviewPDF = (base64Content) => {
    try {
      const blob = new Blob(
        [Uint8Array.from(atob(base64Content), c => c.charCodeAt(0))],
        { type: 'application/pdf' }
      );
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error creating PDF preview:', error);
      return null;
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${sanitizeBase64(record?.document_content)}`;
    link.download = record?.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {record?.content_type === "pdf" && record?.document_content && (
        <Box>
          <object
            data={tryPreviewPDF(sanitizeBase64(record?.document_content))}
            type="application/pdf"
            width="100%"
            height="500px"
            onError={(e) => {
              console.error('PDF object error:', e);
            }}
          >
            <embed
              src={`data:application/pdf;base64,${sanitizeBase64(record?.document_content)}`}
              type="application/pdf"
              width="100%"
              height="500px"
              onError={(e) => {
                console.error('PDF embed error:', e);
              }}
            />
          </object>
          <Grid sx={{ marginTop: "1.5rem" }}>
            <Button
              onClick={handleDownload}
              startIcon={<GetAppIcon />}
            >
              Download
            </Button>
          </Grid>
        </Box>
      )}
      {record?.content_type === "html" && (
        <div dangerouslySetInnerHTML={{ __html: record?.document_content }} />
      )}
    </>
  );
});

// Create a memoized form component
const EditForm = memo(({
  selectedClassification,
  editedIndexData,
  handleClassificationChange,
  handleIndexDataChange,
  editRecord,
  renderEditFields
}) => {
  return (
    <Grid sx={{ padding: { xs: 2, md: "0rem 3rem" } }}>
      <MySelect
        fieldName="Classification_Type"
        indexData={{ Classification_Type: selectedClassification }}
        handleIndexDataChange={handleClassificationChange}
        options={Object.keys(MODEL_MAPPING)}
        disabled={editRecord && editRecord.file_classification_name !== "UnClassified Document"}
        errorStyles={(error) => ({
          mb: 2,
          borderRadius: '12px',
          '& .MuiInputLabel-root': {
            fontSize: '1rem',
            fontWeight: '500',
          },
          '& .MuiInputBase-input': {
            fontSize: '0.85rem',
            padding: '0.8rem',
          },
          '& .MuiFormHelperText-root': {
            fontSize: '0.875rem',
            color: '#d32f2f',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              border: 'none',
            },
            '&:hover fieldset': {
              borderColor: error ? '#d32f2f' : '#0B70FF',
            },
            '&.Mui-focused fieldset': {
              borderColor: error ? '#d32f2f' : '#0B70FF',
            },
            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
          }
        })}
      />
      {selectedClassification && renderEditFields(selectedClassification, editedIndexData)}
    </Grid>
  );
});

const DocAIClassifyFullFun = () => {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeviarity, setSnackbarSeviarity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [processedData, setProcessedData] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedFileContent, setSelectedFileContent] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [contentType, setContentType] = useState(null);
  const fileUploadRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [editedIndexData, setEditedIndexData] = useState({});
  const [selectedClassification, setSelectedClassification] = useState("");
  const [docAIStats, setDocAIStats] = useState({
    successDocuments: 0,
    workQueueDocuments: 0,
    totalProcessedDocuments: 0,
    anonymousWorkQueueDocuments: 0,
  });
  const navigate = useNavigate();
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleFilesUpload = (selectedFiles, previews) => {
    setUploadedDocuments(selectedFiles);
    setUploadedCount(selectedFiles.length);
    setIsSubmitDisabled(false);
    setProcessedData(null);
    setDocAIStats({
      successDocuments: 0,
      workQueueDocuments: 0,
      totalProcessedDocuments: 0,
      anonymousWorkQueueDocuments: 0,
    });
  };
  const handleFileRemove = (fileToRemove) => {
    const updatedFiles = uploadedDocuments.filter(
      (file) => file !== fileToRemove
    );
    setUploadedDocuments(updatedFiles);
    setUploadedCount(updatedFiles.length);
    if (updatedFiles.length === 0) {
      setIsSubmitDisabled(true);
    }
  };
  const handleNetworkError = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );
  const { setNetworkError } = useNetworkStatus({}, handleNetworkError);
  const processDocuments = async () => {
    if (!uploadedDocuments || uploadedDocuments.length === 0) {
      alert("Please upload the documents first.");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      for (const file of uploadedDocuments) {
        formData.append("files", file);
      }
      const response = await axiosInstance.post(
        "AI/process_docaiclassify_files/",
        formData
      );
      if (response.data) {
        setProcessedData(response.data);
        setDocAIStats({
          successDocuments: response.data.success_records.length,
          workQueueDocuments: response.data.workqueue_records.length,
          anonymousWorkQueueDocuments:
            response.data.unclassified_workqueue_records.length,
          totalProcessedDocuments:
            response.data.success_records.length +
            response.data.workqueue_records.length +
            response.data.unclassified_workqueue_records.length,
        });
        setSnackbarMessage("Documents processed successfully!");
        setSnackbarSeviarity("success");
        setShowSnackbar(true);
      } else {
        setSnackbarMessage("Error while processing documents");
        setSnackbarSeviarity("error");
        setShowSnackbar(true);
      }
    } catch (error) {
      console.error("error in processing documents", error);
      if (error.response) {
        const { status } = error.response;
        const errorMessage =
          error.response.data.message ||
          "A server error occurred. Please try again later.";
        const errorSource = error.response.data.api || "Unknown source";
        const userName = localStorage.getItem("userName");
        const fileNames = selectedFiles
          ? Array.isArray(selectedFiles)
            ? selectedFiles.map(file => file.name)
            : [selectedFiles.name]
          : ["No file uploaded"];

        const fileTypes = selectedFiles
          ? Array.isArray(selectedFiles)
            ? selectedFiles.map(file => file.type)
            : [selectedFiles.type]
          : ["Unknown type"];
        setNetworkError({
          errorMessage: errorMessage,
          errorSource: errorSource,
          username: userName,
          fileNames: fileNames,
          fileTypes: fileTypes,
          status: status,
        })
        setSnackbarMessage("Error processing documents");
        setSnackbarSeviarity("error");
        setShowSnackbar(true);
      }
    } finally {
      setLoading(false);
      setIsSubmitDisabled(true);
      setUploadedDocuments([]);
      if (fileUploadRef.current) {
        fileUploadRef.current.handleClearAllFiles();
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFileContent(null);
    setDocumentName("");
    setContentType(null);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditRecord(null);
    setEditedIndexData({});
    setSelectedClassification("");
  };

  const isSubmitEnabled = useCallback(() => {
    if (!editRecord) return false;
    const classification = editRecord.file_classification_name === "UnClassified Document"
      ? selectedClassification
      : editRecord.file_classification_name;
    if (editRecord.file_classification_name === "UnClassified Document" && !selectedClassification) {
      return false;
    }
    return validateFields(classification, editedIndexData);
  }, [editRecord, selectedClassification, editedIndexData]);

  const validateFields = (classification, indexData) => {
    if (!classification) return false;
    const validationRules = FIELD_VALIDATION_MAPPING[classification];
    if (!validationRules) return true;
    return Object.entries(validationRules).every(([fieldName, rules]) => {
      const value = indexData[fieldName];
      if (rules.required && (!value || value === "" || value === "Not Found")) {
        return false;
      }
      if (!value || value === "") return true;
      if (rules.pattern && !rules.pattern.test(value)) {
        return false;
      } if (rules.minLength && value.length < rules.minLength) {
        return false;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return false;
      }
      if (rules.maxDate) {
        const maxDate = new Date(rules.maxDate);
        const fieldDate = new Date(value);
        if (fieldDate > maxDate) {
          return false;
        }
      }
      return true;
    });
  };

  const handleIndexDataChange = (key, value) => {
    const newIndexData = { ...editedIndexData, [key]: value };
    setEditedIndexData(newIndexData);
    const fieldRef = document.querySelector(`[name="${key}"]`);
    if (fieldRef) {
      fieldRef.setCustomValidity('');
    }
  };

  const renderEditFields = (classification, indexData,) => {
    const fields = MODEL_FIELD_MAPPING[classification] || [];
    const modelFieldTypes = FIELD_TYPE_MAPPING[classification] || {};
    const errorStyles = (error) => ({
      mb: 2,
      borderRadius: '12px',
      '& .MuiInputLabel-root': {
        fontSize: '1rem',
        fontWeight: '500',
      },
      '& .MuiInputBase-input': {
        fontSize: '0.85rem',
        padding: '0.8rem',
      },
      '& .MuiFormHelperText-root': {
        fontSize: '0.875rem',
        color: '#d32f2f',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          border: 'none',
        },
        '&:hover fieldset': {
          borderColor: error ? '#d32f2f' : '#0B70FF',
        },
        '&.Mui-focused fieldset': {
          borderColor: error ? '#d32f2f' : '#0B70FF',
        },
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
      }
    });

    return fields.map((fieldName) => {
      const fieldType = modelFieldTypes[fieldName];
      switch (fieldType) {
        case FIELD_TYPES.TEXT:
          return <MyTextField
            key={fieldName}
            fieldName={fieldName}
            indexData={indexData}
            handleIndexDataChange={handleIndexDataChange}
            errorStyles={errorStyles}
            classification={classification}
          />;
        case FIELD_TYPES.SELECT:
          return <MySelect
            key={fieldName}
            fieldName={fieldName}
            indexData={indexData}
            handleIndexDataChange={handleIndexDataChange}
            options={[]}
            errorStyles={errorStyles}
            classification={classification}
          />;
        case FIELD_TYPES.DATE:
          return <MyDateField
            key={fieldName}
            fieldName={fieldName}
            indexData={indexData}
            handleIndexDataChange={handleIndexDataChange}
            errorStyles={errorStyles}
            classification={classification}
          />;
        default:
          return null;
      }
    });
  };

  const handleSave = async () => {
    if (!isSubmitEnabled()) {
      const classification = editRecord.file_classification_name === "UnClassified Document"
        ? selectedClassification
        : editRecord.file_classification_name;

      if (!classification) {
        setSnackbarMessage("Please select a document classification");
      } else {
        setSnackbarMessage("Please fill all required fields correctly");
      }
      setSnackbarSeviarity("error");
      setShowSnackbar(true);
      return;
    }
    try {
      setLoading(true);
      const formattedIndexData = {};
      Object.entries(editedIndexData).forEach(([key, value]) => {
        if (value instanceof Date) {
          formattedIndexData[key] = value.toISOString().split('T')[0];
        } else {
          formattedIndexData[key] = value;
        }
      });
      const payload = {
        document_id: editRecord._id,
        index_data: formattedIndexData,
        classification_type: editRecord.file_classification_name === "UnClassified Document"
          ? selectedClassification
          : editRecord.file_classification_name
      };
      const response = await axiosInstance.post(
        'AI/edit_update_docai_classify_document/',
        payload
      );

      if (response.data) {
        const updatedData = { ...processedData };
        if (editRecord.file_classification_name === "UnClassified Document") {
          updatedData.unclassified_workqueue_records = updatedData.unclassified_workqueue_records.filter(
            record => record._id !== editRecord._id
          );
          updatedData.anonymousWorkQueueDocuments--;
        } else {
          updatedData.workqueue_records = updatedData.workqueue_records.filter(
            record => record._id !== editRecord._id
          );
          updatedData.workQueueDocuments--;
        }
        const updatedRecord = {
          ...editRecord,
          index_data: formattedIndexData,
          file_classification_name: payload.classification_type,
          process_status: 'success'
        };
        updatedData.success_records.push(updatedRecord);
        setDocAIStats(prevStats => ({
          ...prevStats,
          successDocuments: prevStats.successDocuments + 1,
          workQueueDocuments: editRecord.file_classification_name === "UnClassified Document"
            ? prevStats.workQueueDocuments
            : prevStats.workQueueDocuments - 1,
          anonymousWorkQueueDocuments: editRecord.file_classification_name === "UnClassified Document"
            ? prevStats.anonymousWorkQueueDocuments - 1
            : prevStats.anonymousWorkQueueDocuments
        }));
        setProcessedData(updatedData);
        setSnackbarMessage("Document updated successfully!");
        setSnackbarSeviarity("success");
        setShowSnackbar(true);
        handleEditDialogClose();
      }
    } catch (error) {
      console.error("Error updating document:", error);
      if (error.response) {
        const { status } = error.response;
        const errorMessage = error.response.data.message || "A server error occurred. Please try again later.";
        const errorSource = error.response.data.api || "Unknown source";
        const userName = localStorage.getItem("userName");
        setNetworkError({
          errorMessage: errorMessage,
          errorSource: errorSource,
          username: userName,
          fileNames: [editRecord.file_name],
          fileTypes: [editRecord.content_type],
          status: status,
        });
      }
      setSnackbarMessage("Error updating document. Please try again.");
      setSnackbarSeviarity("error");
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const KeyValueTable = ({ record, status }) => {
    const {
      file_name,
      file_classification_name,
      index_data,
      document_content,
      content_type,
    } = record;
    const showEditIcon = status === "WorkQueue" || status === "UnClassified WorkQueue";
    const formatValue = (key, value) => {
      if (value instanceof Date) {
        return value.toISOString().split('T')[0];
      }
      return value;
    };

    const formattedIndexData = Object.entries(index_data).map(([key, value]) => ({
      key: key.replace(/_/g, " "),
      value: formatValue(key, value),
    }));
    const statusIcon = (
      <Tooltip title={status}>
        {" "}
        {status === "Success" && (
          <CheckCircleOutlineIcon sx={{ color: "green" }} />
        )}
        {status === "WorkQueue" && (
          <WarningAmberIcon sx={{ color: "orange" }} />
        )}
        {status === "UnClassified WorkQueue" && (
          <ErrorOutlineIcon sx={{ color: "red" }} />
        )}
      </Tooltip>
    );

    const handleViewDocument = () => {
      if (!document_content) {
        setSnackbarMessage("Document content is empty");
        setSnackbarSeviarity("error");
        setShowSnackbar(true);
        return;
      }
      try {
        const cleanContent = sanitizeBase64(document_content);
        if (!cleanContent.startsWith('JVBERi')) {
          setSnackbarMessage("Invalid PDF content format");
          setSnackbarSeviarity("error");
          setShowSnackbar(true);
          return;
        }

        const testUrl = tryPreviewPDF(cleanContent);
        if (!testUrl) {
          setSnackbarMessage("Unable to create PDF preview");
          setSnackbarSeviarity("error");
          setShowSnackbar(true);
          return;
        }
        URL.revokeObjectURL(testUrl);
        setSelectedFileContent(cleanContent);
        setDocumentName(file_name);
        setContentType(content_type);
        setOpen(true);
      } catch (error) {
        console.error('Error processing document:', error);
        setSnackbarMessage("Error processing document content");
        setSnackbarSeviarity("error");
        setShowSnackbar(true);
      }
    };

    const handleEditDocument = (record, status) => {
      setEditRecord(record);
      setEditedIndexData(record.index_data);
      if (status === "UnClassified WorkQueue") {
        setSelectedClassification("");
      } else {
        setSelectedClassification(record.file_classification_name);
      }
      setEditDialogOpen(true);
    };
    return (
      <TableRow>
        <TableCell sx={{ maxWidth: "50px", verticalAlign: "middle" }}>
          {statusIcon}
        </TableCell>
        <TableCell
          sx={{
            fontSize: "0.8rem",
            wordBreak: "break-all",
            maxWidth: "150px",
            verticalAlign: "middle",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {file_name}
        </TableCell>
        <TableCell
          sx={{
            fontSize: "0.8rem",
            wordBreak: "break-all",
            maxWidth: "150px",
            verticalAlign: "middle",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {file_classification_name}
        </TableCell>
        {formattedIndexData.map(({ key, value }, index) => (
          <TableCell
            key={index}
            sx={{
              fontSize: value?.length > 15 ? "0.8rem" : "0.8rem",
              wordBreak: "break-word",
              verticalAlign: "middle",
              maxWidth: "150px",
            }}
          >
            {" "}
            <Tooltip title={key}>
              <span style={{ whiteSpace: "pre-wrap" }}>{value}</span>{" "}
            </Tooltip>
          </TableCell>
        ))}
        {[...Array(7 - formattedIndexData.length)].map((_, index) => (
          <TableCell
            key={index + formattedIndexData.length}
            sx={{ verticalAlign: "middle" }}
          >
            {" "}
            <Tooltip title="Not Applicable"> -</Tooltip>
          </TableCell>
        ))}
        <TableCell sx={{ verticalAlign: "middle" }}>
          <Tooltip title={document_content ? "View Document" : "Preview not available"}>
            <span>
              <IconButton
                onClick={handleViewDocument}
                disabled={!document_content}
              >
                <DescriptionIcon
                  sx={{
                    color: !document_content
                      ? "grey"
                      : status === "Success"
                        ? "green"
                        : status === "WorkQueue"
                          ? "orange"
                          : "red",
                  }}
                />
              </IconButton>
            </span>
          </Tooltip>
          {showEditIcon && (
            <Tooltip title="Edit Document">
              <IconButton onClick={() => handleEditDocument(record, status)}>
                <EditIcon
                  sx={{
                    color: status === "WorkQueue" ? "orange" : "red",
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
    );
  };

  const renderEditInstructions = () => {
    if (!editRecord) return null;
    let message = "";
    let iconColor = "#4189f0";
    if (editRecord.file_classification_name !== "UnClassified Document") {
      message = "Please review and fill required fields (marked in red) before submitting.";
    } else {
      message = "Please select the document type first & fill the required fields before submitting.";
    }
    return (
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <InfoIcon sx={{ color: iconColor, mr: 1 }} />
        <Typography variant="body2" color={iconColor}>
          {message}
        </Typography>
      </Box>
    );
  };
  const handleClassificationChange = (fieldName, value) => {
    setSelectedClassification(value);
    setEditedIndexData({});
  };

  const sanitizeBase64 = (base64String) => {
    return base64String.replace(/^data:application\/pdf;base64,/, '')
      .replace(/\s/g, '');
  };

  const tryPreviewPDF = (base64Content) => {
    try {
      const blob = new Blob(
        [Uint8Array.from(atob(base64Content), c => c.charCodeAt(0))],
        { type: 'application/pdf' }
      );
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error creating PDF preview:', error);
      return null;
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Box
            elevation={3}
            sx={{
              margin: "auto",
              height: isMobile ? "" : "430px",
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              mt: 9,
            }}
          >
            <Typography
              sx={{
                color: "#001660",
                fontSize: "1.3rem",
                marginBottom: "10px",
              }}
              className="Nasaliza"
            >
              Upload Documents
            </Typography>
            <FileUpload
              ref={fileUploadRef}
              id="portal"
              onFilesUpload={handleFilesUpload}
              multiple={true}
              allowedFormats={["pdf"]}
              setIsSubmitDisabled={setIsSubmitDisabled}
              onFileRemove={handleFileRemove}
            />
            <Box sx={{ textAlign: "center", marginTop: 2 }}>
              <StyledButtonComponent
                variant="contained"
                color="primary"
                onClick={processDocuments}
                buttonWidth={150}
                disabled={
                  isSubmitDisabled || uploadedDocuments.length === 0 || loading
                }
                startIcon={
                  loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <img
                      src={processclaim}
                      alt="process documents"
                      style={{ height: 24 }}
                    />
                  )
                }
              >
                {loading ? "Processing..." : "Process"}
              </StyledButtonComponent>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={12}>
          {processedData && (
            <Paper
              elevation={3}
              sx={{
                height: isMobile ? "" : "430px",
                marginTop: "-250px",
                borderRadius: 3,
                p: 3,
                backdropFilter: "blur(10px)",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                background: "transparent",
              }}
            >
              <CustomActiveShapePieChart
                successDocuments={docAIStats.successDocuments}
                workQueueDocuments={docAIStats.workQueueDocuments}
                uploadedDocuments={uploadedCount}
                totalProcessedDocuments={docAIStats.totalProcessedDocuments}
                anonymousWorkQueueDocuments={docAIStats.anonymousWorkQueueDocuments}
              />
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} md={12}>
          {processedData && (
            <Paper
              elevation={3}
              sx={{ p: 3, borderRadius: 3, boxShadow: 3, background: "white" }}
            >
              {" "}
              <Typography
                variant="h5"
                align="center"
                className="Nasaliza"
                gutterBottom
                sx={{ color: "#010066", fontWeight: "bold", mb: 3 }}
              >
                {" "}
                Processed Documents Result
              </Typography>
              <TableContainer
                component={Paper}
                sx={{
                  background: "transparent",
                  boxShadow: "none",
                  border: "none",
                  mb: 4,
                  maxWidth: "100%",
                  overflowX: "auto",
                }}
              >
                {" "}
                <Table sx={{ tableLayout: "fixed", width: "100%" }}>
                  {" "}
                  <TableHead sx={{ bgcolor: "#2196f3", color: "white" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white", width: "5%" }}>
                        Status
                      </TableCell>{" "}
                      <TableCell sx={{ color: "white", width: "10%" }}>
                        File Name
                      </TableCell>{" "}
                      <TableCell sx={{ color: "white", width: "10%" }}>
                        Classification
                      </TableCell>{" "}
                      {[...Array(7)].map((_, index) => (
                        <TableCell
                          key={index}
                          sx={{ color: "white", width: "9%" }}
                        >
                          Index {index + 1}
                        </TableCell>
                      ))}
                      <TableCell sx={{ color: "white", width: "9%" }}>
                        View
                      </TableCell>{" "}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {processedData.success_records?.length > 0 &&
                      processedData.success_records.map((record, index) => (
                        <KeyValueTable
                          key={index}
                          record={record}
                          status="Success"
                        />
                      ))}
                    {processedData.workqueue_records?.length > 0 &&
                      processedData.workqueue_records.map((record, index) => (
                        <KeyValueTable
                          key={index}
                          record={record}
                          status="WorkQueue"
                        />
                      ))}
                    {processedData.unclassified_workqueue_records?.length > 0 &&
                      processedData.unclassified_workqueue_records.map(
                        (record, index) => (
                          <KeyValueTable
                            key={index}
                            record={record}
                            status="UnClassified WorkQueue"
                          />
                        )
                      )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Grid>
      </Grid>
      {/* Document View Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography>{documentName}</Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {contentType === "pdf" && selectedFileContent && (
            <Box sx={{ width: '100%', height: '500px', position: 'relative' }}>
              {/* Fallback embedding methods */}
              <object
                data={tryPreviewPDF(sanitizeBase64(selectedFileContent))}
                type="application/pdf"
                width="100%"
                height="100%"
                onError={(e) => {
                  console.error('PDF object error:', e);
                }}
              >
                <embed
                  src={`data:application/pdf;base64,${sanitizeBase64(selectedFileContent)}`}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  onError={(e) => {
                    console.error('PDF embed error:', e);
                  }}
                />
              </object>
              {/* Download button for fallback */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<GetAppIcon />}
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = `data:application/pdf;base64,${sanitizeBase64(selectedFileContent)}`;
                    link.download = documentName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Download PDF
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Dialog for editing the WorkQueue and UnClassified Documents */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
            {editRecord?.file_name}
            <Button startIcon={<CloseIcon />} onClick={handleEditDialogClose}>
              Close
            </Button>
          </Grid>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box
            flex={{ xs: 1, md: 0.5 }}
            sx={{
              borderRight: { xs: "none", md: "1px solid lightgrey" },
              paddingRight: { xs: 0, md: 2 },
              maxWidth: { xs: "100%", md: "50%" },
            }}
          >
            <DocumentPreview record={editRecord} />
          </Box>
          <Box
            flex={{ xs: 1, md: 0.5 }}
            sx={{
              paddingLeft: { xs: 0, md: 2 },
              marginTop: { xs: 2, md: 1 },
              overflowY: 'auto'
            }}
          >
            {renderEditInstructions()}
            <EditForm
              selectedClassification={selectedClassification}
              editedIndexData={editedIndexData}
              handleClassificationChange={handleClassificationChange}
              handleIndexDataChange={handleIndexDataChange}
              editRecord={editRecord}
              renderEditFields={renderEditFields}
            />
            <Grid sx={{ textAlign: "right", marginRight: "1rem" }}>
              <StyledButtonComponent
                buttonWidth={100}
                disableColor={"#B6E3FF"}
                onClick={handleSave}
                color="primary"
                disabled={!isSubmitEnabled()}
              >
                Submit
              </StyledButtonComponent>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
      {/* Snackbar for success and failure message */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity={snackbarSeviarity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DocAIClassifyFullFun;