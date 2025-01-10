import React, { useState, useEffect, useMemo, useCallback  } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Grid,
    Snackbar,
    Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import FileUpload from '../../components/FileUploadExtra.js';
import processclaim from "../../assets/processclaim.png";
import useNetworkStatus from '../../components/ErrorPages/UseNetworkStatus.js';

 
const GlassyCard = styled(motion.div)(({ theme }) => ({
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
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.3)',
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    justifyContent: "center",
    textAlign: "center",
    width: 200,
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    border: 0,
    borderRadius: 20,
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
    height: 40,
    padding: '0 2px',
    margin: "2rem auto",
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    fontSize: '0.875rem',
    '&:hover': {
        background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
        transform: 'scale(1.05)',
        boxShadow: '0 6px 10px 4px rgba(33, 203, 243, .4)',
    },
}));

const AnimatedTableRow = motion(TableRow);

function ExtractedDataDisplay({ displayValues }) {
    console.log("displyvalues", displayValues);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const formatValue = (key, value) => {
        console.log(key, value);

        if (["Total Properties", "Total Units", "Total Square Footage"].includes(key)) {
            return value ? value.toLocaleString('en-US') : '0'; 
        } else if (value === null) { 
            return 'Not Found';
        } else if (value === 0 || value === '0') {
            return '$0'; 
        } else if (value === null || value === '' || value === 'N/A') {
            return 'Not Found';
        } else if (Array.isArray(value)) {
            return value.map(v => (typeof v === 'number' && !isNaN(v)) ? `$${v.toLocaleString('en-US')}` : v).join(','); 
        } else if (typeof value === 'number' && !isNaN(value)) {
            return `$${value.toLocaleString('en-US')}`; 
        }
    
        return value;
    };

    const tableVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <TableContainer component={Paper} style={{ boxShadow: 'none', background: 'transparent', height: '100%', overflow: 'auto' }}>

            <Table size={isMobile ? 'small' : 'medium'}>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ fontWeight: 'bold', color: '#1976D2', borderBottom: '2px solid #1976D2' }}>Attribute</TableCell>
                        <TableCell style={{ fontWeight: 'bold', color: '#1976D2', borderBottom: '2px solid #1976D2' }}>Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody component={motion.tbody} variants={tableVariants} initial="hidden" animate="visible">
                    {Object.entries(displayValues).map(([key, value]) => (
                        <AnimatedTableRow key={key} variants={rowVariants}>
                            <TableCell>{key}</TableCell>
                            <TableCell>{formatValue(key, value)}</TableCell>
                        </AnimatedTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const SOVFun = () => {
    // const navigate = useNavigate(); 
    const [afterProcess, setAfterProcess] = useState(false);
    const [previews, setPreviews] = useState([]);
    const [uploadIn] = useState("portal");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [displayValues, setDisplayValues] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const navigate = useNavigate();
    const [snackbarOpen1, setSnackbarOpen1] = useState(false);
    const snackbarTimeoutRef = React.useRef(null); // Ref to manage the timeout
    const handleSnackbarClose = () => {
        setSnackbarOpen1(false);
    };

    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_URL,
        withCredentials: true
      });
    const BeforeProcessDisplayValues = {
        "Company Name": "-",
        "Total Properties": '0',
        "Total Real Property Value ($)": '$0',
        "Total Personal Property Value ($)": '$0',
        "Total Outdoor Property Value ($)": '$0',
        "Total Rental Income ($)": '$0',
        "Total Insured Value (TIV) ($)": '$0',
        "Total Units": '0',
        "Total Square Footage": '0',
    };

    useEffect(() => {
        setIsSubmitDisabled(!selectedFile);
    }, [selectedFile]);

    const renderPreview = (file) => {
        console.log("file in render preview", file)
        const actualFile = file[0] ? file[0].file : null;
        console.log(actualFile);
        const fileUrl = URL.createObjectURL(file);
        if (file.type === 'application/pdf') {
            return (
                <iframe
                    src={fileUrl}
                    title="Document Viewer" // Add a meaningful title here
                    style={{ width: '100%', height: '600px', objectFit: 'contain' }}
                    frameBorder="0"
                />

            );
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel') {
            return <ExcelPreview file={file} />;
        } else {
            return <Typography variant="body2">Preview not available</Typography>;
        }
    };

    const preview = useMemo(() => {
        return selectedFile ? renderPreview(selectedFile) : null;
    }, [selectedFile]);

    function ExcelPreview({ file }) {
        const [excelData, setExcelData] = useState(null);
        useEffect(() => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                setExcelData(json);
            };
            reader.readAsArrayBuffer(file);
        }, [file]);
        return (
            // Removed Tilt and motion.div
            <div style={{ width: '100%', height: '600px', overflow: 'auto' }}>
                {excelData && (
                    <Table>
                        <TableBody>
                            {excelData.map((row, index) => (
                                <TableRow key={index}>
                                    {row.map((cell, cellIndex) => (
                                        <TableCell key={cellIndex}>{cell}</TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        );
    }

    const handleReset = () => {
        setAfterProcess(false);
        setDisplayValues({});
        setSelectedFile(null);
        setPreviews([]);
        // setAiResponse('');
        // setCorrectData({});
        setIsSubmitDisabled(true);
    };

    const handleFileRemove = (fileName) => {
        setAfterProcess(false);
        setLoading(false);
        setSelectedFile(null);
        setPreviews([]);
        setIsSubmitDisabled(true);
    };

    const handleFilesUploadToSOV = (selectedFiles, previews) => {
        setSelectedFile(selectedFiles[0]);
        setPreviews(previews);
        setIsSubmitDisabled(false);
    };

    const ExtractedDocumentComponent = () => {
        const { setNetworkError, SnackbarComponent } = useNetworkStatus();
        const [loader, setLoader] = useState(false);
        const [errorMessage, setErrorMessage] = useState('');
      }
      const handleNetworkError = useCallback((path) => {
        navigate(path);
      }, [navigate]);
   
      const { setNetworkError, SnackbarComponent } = useNetworkStatus({}, handleNetworkError);
      const processImage = async () => {
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }
   
        setLoading(true);
        console.log("selected file", selectedFile);
        // Start the timeout to show the snackbar after 5 seconds
        snackbarTimeoutRef.current = setTimeout(() => {
            setSnackbarOpen1(true); // Show snackbar if request takes more than 5 seconds
        }, 1000);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const response = await axiosInstance.post('AI/docai_sov', formData);
            console.log("response", response, response.data);
            // Clear timeout if the response arrives earlier than 5 seconds
            clearTimeout(snackbarTimeoutRef.current);
            setSnackbarOpen1(false); // Ensure snackbar is closed
            if (response.status === 200 && response.data && response.data.extracted_sums) {
                const data = response.data.extracted_sums;
                setDisplayValues({
                    "Company Name": data['Company Name'],
                    "Total Properties": data['Total Properties'],
                    "Total Real Property Value ($)": data['Total Real Property Value ($)'],
                    "Total Personal Property Value ($)": data['Total Personal Property Value ($)'],
                    "Total Outdoor Property Value ($)": data['Total Outdoor Property Value ($)'],
                    "Total Rental Income ($)": data['Total Rental Income ($)'],
                    "Total Insured Value (TIV) ($)": data['Total Total Insured Value ($)'],
                    "Total Units": data['Total Units ($)'],
                    "Total Square Footage": data['Total Square Footage ($)'],
                });
   
                setAfterProcess(true);
            } else {
                setSnackbarSeverity("error");
                setSnackbarMessage(response.data.error || "An error occurred while processing the document.");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error("Error processing image:", error);
            // Clear timeout if the response has error
            clearTimeout(snackbarTimeoutRef.current);
            setSnackbarOpen1(false); // Ensure snackbar is closed
   
            if (error.response) {
                const { status } = error.response;
                const errorMessage = error.response.data.message || "A server error occurred. Please try again later.";
                const errorSource = error.response.data.api || "Unknown source";
                const userName = localStorage.getItem('userName');
                const fileName = selectedFile ? selectedFile.name : 'No file uploaded';
                const fileType = selectedFile ? selectedFile.type : 'Unknown type';
   
                console.log('filetype: ', fileType);
                console.log('filename: ', fileName);
                console.log('Error Message: ', errorMessage);
                console.log('username: ', userName);
                console.log('status_code: ', status);
                console.log('errorSource: ', errorSource);
   
                setNetworkError({
                    errorMessage: errorMessage,
                    errorSource: errorSource,
                    username: userName,
                    fileName: fileName,
                    fileType: fileType,
                    status: status,
                });
            } else {
                setSnackbarMessage(error.response.data.message || "An unexpected error occurred.");
            }
   
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

 
    return (
        <>
        <div>
        {/* Other component code */}
        {SnackbarComponent()} {/* Render the Snackbar from the hook */}
      </div>
        <Grid container spacing={4} style={{ marginTop: '2rem', marginBottom: '4rem' }}>
            <AnimatePresence>
                {afterProcess ? (
                    <>
                        <Grid container spacing={3} style={{ marginTop: "2rem" }}>
                            <Grid item xs={12} md={1}></Grid>
                            <Grid item xs={12} md={5} style={{ margin: isMobile ? "0rem 2rem" : "0rem" }}>
                                <GlassyCard
                                    initial={{ opacity: 0, x: -100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {preview}
                                    <StyledButton onClick={handleReset} startIcon={<Upload />}>
                                        Reupload
                                    </StyledButton>
                                </GlassyCard>
                            </Grid>
                            <Grid item xs={12} md={5} style={{ margin: isMobile ? "0rem 2rem" : "0rem" }}>
                                <GlassyCard
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 100 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Typography className="Nasaliza" variant="h6" style={{ color: "#010066" }}>
                                        Extracted SOV Data
                                    </Typography>
                                    <ExtractedDataDisplay
                                        displayValues={displayValues}
                                    />
                                </GlassyCard>
                            </Grid>
                        </Grid>
                    </>
                ) : (
                    <>
                        <Grid item xs={12} md={1}></Grid>
                        <Grid item xs={12} md={10}>
                            <GlassyCard
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                                style={{ boxShadow: 'none' }} // Remove shadow here
                            >
                                <Typography className='Nasaliza' variant="h6" style={{ color: "#010066" }}sx={{ marginTop: '-4rem', marginBottom:'1rem' }}>Upload SOV Document (xlsx)</Typography>
                                <FileUpload
                                    id="portal"
                                    multiple={false}
                                    allowedFormats={['vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.ms-excel']}
                                    setIsSubmitDisabled={setIsSubmitDisabled}
                                    selectedFilesInParent={selectedFile ? [selectedFile] : []}
                                    filePreviews={previews}
                                    uploadIn={uploadIn}
                                    onFilesUpload={handleFilesUploadToSOV}
                                    onFileRemove={handleFileRemove}
                                />
                                <StyledButton
                                    onClick={processImage}
                                    disabled={isSubmitDisabled || loading}
                                    startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <img src={processclaim} alt="process icon" style={{ height: 24 }} />}
                                >
                                    {loading ? 'Processing...' : 'Process SOV'}
                                </StyledButton>
                            </GlassyCard>
                        </Grid>
                    </>
                )}
            </AnimatePresence>
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
            <Snackbar
                open={snackbarOpen1}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} //  Position
                autoHideDuration={15000} // Automatically hide after 15 seconds if not closed earlier
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
                    The document is under process. Please wait.
                </Alert>
            </Snackbar>
        </Grid >
        </>
    )
}

export default SOVFun