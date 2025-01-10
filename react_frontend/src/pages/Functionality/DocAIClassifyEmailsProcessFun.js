import '../IDP_FNOL/Email_to_FNOL.css';
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import useNetworkStatus from '../../components/ErrorPages/UseNetworkStatus.js';
import PreviewError from "../../components/ErrorPages/PreviewError.js";
import { Tooltip as ToolTip } from '@mui/material';
import axios from 'axios';
import {
    Container, Grid, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography,
    Button, useTheme, useMediaQuery, CircularProgress, Card,
} from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from '@material-ui/core';

import MailIcon from '@mui/icons-material/Mail';
import CheckIcon from '@mui/icons-material/Check';
import DownloadIcon from '@mui/icons-material/Download';
import { PieChart, Pie, Sector, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import StyledButtonComponent from "../../components/StyledButton.js";
import viewDocument from "../../assets/viewDocument.png";
import '../IDP_FNOL/EmailTemplate.css';


// CustomActiveShapePieChart Component
const CustomActiveShapePieChart = ({ successEmails = [], failedEmails, fetchedEmails }) => {
    console.log(successEmails, successEmails.length, failedEmails, fetchedEmails);

    const [activeIndex, setActiveIndex] = useState(0);

    const totalEmails = successEmails && successEmails + (typeof failedEmails === 'number' ? failedEmails : 0);
    const successPercentage = totalEmails ? (successEmails && successEmails / totalEmails) * 100 : 0;
    const failurePercentage = totalEmails ? (failedEmails / totalEmails) * 100 : 0;

    const data = totalEmails > 0
        ? [
            { name: 'Success %', value: successPercentage, count: successEmails && successEmails.length },
            { name: 'Failure %', value: failurePercentage, count: failedEmails } // No need for .length here
        ]
        : [{ name: 'No Fetched Emails', value: 100, count: 0 }];

    const COLORS = totalEmails > 0 ? ['#4CAF50', '#F44336'] : ['#2196F3'];

    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const {
            cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
            fill, payload, value,
        } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';

        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={fill}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                {totalEmails > 0 ? (
                    <>
                        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value.toFixed(2)}%`}</text>
                        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                            {`(${payload.count} emails)`}
                        </text>
                    </>
                ) : (
                    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#999">
                        {`(${payload.count} emails)`}
                    </text>
                )}
            </g>
        );
    };

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    return (
        <Box>
            <Typography variant="h6" style={{ textAlign: 'center', marginBottom: 16 }}>
                DocAI Classify Status Distribution
            </Typography>
            <Grid container justifyContent="center" alignItems="center" spacing={2} style={{ marginBottom: 16 }}>
                <Grid item>
                    <Typography style={{ fontSize: "0.8rem" }} color="#010066" fontWeight="bold">
                        Fetched : {(fetchedEmails || totalEmails) || 0}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography style={{ fontSize: "0.8rem" }} color="#4CAF50" fontWeight="bold">
                        Success : {(successEmails && successEmails) || 0}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography style={{ fontSize: "0.8rem" }} color="#F44336" fontWeight="bold">
                        Failure : {(failedEmails && failedEmails) || 0}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography style={{ fontSize: "0.8rem" }} color="yellowgreen" fontWeight="bold">
                        Total Processed : {totalEmails || 0}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container justifyContent="center">
                <Grid item>
                    <Box>
                        <ResponsiveContainer width={400} height={280}>
                            <PieChart>
                                <Pie
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    fill="#8884d8"
                                    dataKey="value"
                                    onMouseEnter={onPieEnter}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name, props) => {
                                    if (name === 'No Fetched Emails') {
                                        return [`${props.payload.count} emails`, name];
                                    }
                                    return [`${value.toFixed(2)}% (${props.payload.count} emails)`, name];
                                }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

const DocAIClassifyEmailsProcessFun = () => {
    // const navigate = useNavigate(); 
    const UploadDocument = useRef(null)
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    const [ViewEmailsReport, setViewEmailsReport] = useState(true);
    const SuccessClick = useRef(null);
    const [afterEmailsProcess, setAfterEmailsProcess] = useState(false);
    const ViewDocument = useRef(null);
    const [openPdf, setOpenPdf] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null); // State to store PDF URL
    const [documentName, setDocumentName] = useState("");
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


    const ExtractedDocumentComponent = () => {
        const { setNetworkError, SnackbarComponent } = useNetworkStatus();
        const [loader, setLoader] = useState(false);
        const [errorMessage, setErrorMessage] = useState('');
    }
    const handleNetworkError = useCallback((path) => {
        navigate(path);
    }, [navigate]);

    const { setNetworkError, SnackbarComponent } = useNetworkStatus({}, handleNetworkError);
    const handleStartButtonClick = () => {
        setLoading(true);
        axiosInstance.post('Batch_processes/Trigger_DocAI_Classify/')
            .then(response => {
                console.log("triggering the emails in classify", response);
    
                if (response.data.status === "success" && response.data.sender_emails.length > 0) {
                    setMessage('');
                    localStorage.setItem("EmailstoFnol", JSON.stringify(response.data.sender_emails));
                    setEmails(response.data.sender_emails);
                    setCardsLoaded(true);
                    setStartBtnDisabled(true);
                    localStorage.setItem('startBtnDisabled', 'true');
                    setLoading(false);
                } else {
                    setLoading(false);
                    setMessage('No Emails To Fetch');
                }
            })
            .catch(error => {
                console.error("There was an error fetching the emails!", error);
                setLoading(false);

                if (error.response) {
                    const { status } = error.response;
                    const errorMessage = error.response.data.message || "A server error occurred. Please try again later.";
                    const errorSource = error.response.data.api || "Unknown source";
                    const userName = localStorage.getItem('userName');

                    console.log('Error Message: ', errorMessage);
                    console.log('username: ', userName);
                    console.log('status_code: ', status);
                    console.log('errorSource: ', errorSource);

                    setNetworkError({
                        errorMessage: errorMessage,
                        errorSource: errorSource,
                        username: userName,
                        status: status,
                    });
                } else {
                    setMessage(error.message || "An unexpected error occurred.");
                }
            });
    };
    
    const handleProcessButtonClick = () => {
        setProcessLoading(true);
        axiosInstance.post('Batch_processes/Process_DocAI_Classify/')
            .then(response => {
                console.log("response after process", response.data);
    
                if (response.data.message === "Email processing Successful.") {
                    setMessage("Email processed Successfully");
                    localStorage.removeItem("EmailstoFnol");
                    setProcessing(true);
                    setStartBtnDisabled(false);
                    localStorage.removeItem('startBtnDisabled');

                    const classificationArray = Object.entries(response.data.classification).map(([documentName, data]) => ({
                        documentName,
                        ...data
                    }));
    
                    const processedEmailsCount = classificationArray.length;
                    const successEmailsCount = classificationArray.length;
                    const failureEmailsCount = Math.max(processedEmailsCount - successEmailsCount, 0); // Ensure non-negative
    
                    setSuccessEmails(classificationArray);
                    setFailedEmails(failureEmailsCount);
                    console.log(successEmails, 'successEmails');
                    setFailedEmails(response.data.Failure_mails);
                    setViewEmailsReport(true);
                    ViewReportClick();
                    setProcessLoading(false);
                }
            })
            .catch(error => {
                console.error("There was an error processing the emails!", error);
                setProcessLoading(false);

                if (error.response) {
                    const { status } = error.response;
                    const errorMessage = error.response.data.message || "A server error occurred. Please try again later.";
                    const errorSource = error.response.data.errorSource || "Unknown source";
                    const userName = localStorage.getItem('userName');

                    console.log('Error Message: ', errorMessage);
                    console.log('username: ', userName);
                    console.log('status_code: ', status);
                    console.log('errorSource: ', errorSource);

                    setNetworkError({
                        errorMessage: errorMessage,
                        errorSource: errorSource,
                        username: userName,
                        status: status,
                    });
                } else {
                    setMessage(error.message || "An unexpected error occurred.");
                }
            });
    };
    
 
    const ViewReportClick = async () => {

        await setAfterEmailsProcess(true)
        if (SuccessClick.current) {
            SuccessClick.current.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error('Footer reference is null');
        }
    }

    // Update renderValue for classification, body, and index fields:
    function renderValue(fieldName, row) {
        switch (fieldName) {
            case "Email Time":
                // return row && row.email_time;
                const date = row && row.email_time && new Date(row.email_time);
                return date && `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
            case "Document Name":
                return row && row.documentName;
            case "classification":
                if (row && row.claim_document) {
                    return "FNOL";
                } else if (row && row.policy_document) {
                    return "Policy Application";
                } else if (row && row.medical_bill) {
                    return "Med Bill";
                }
                return "";// Default if none match
            case "Sender Email":
                return row && row.sender_email;

            case "Index 1":
                if (row && row.extracted_data) {
                    if (row.claim_document) {
                        return row.extracted_data.policy_number;
                    } else if (row.policy_document) {
                        return row.extracted_data.PolicyInfo && row.extracted_data.PolicyInfo.selectedPolicy;
                    } else if (row.medical_bill) {
                        return row.extracted_data.patient_info && row.extracted_data.patient_info.account_number;
                    }
                }
                return "";

            case "Index 2":
                if (row && row.extracted_data) {
                    if (row.claim_document) {
                        return row.extracted_data.claim_reported_by;
                    } else if (row.policy_document) {
                        return row.extracted_data.PolicyInfo &&
                            `${row.extracted_data.PolicyInfo.policy_holder_FirstName} ${row.extracted_data.PolicyInfo.policy_holder_LastName}`;
                    } else if (row.medical_bill) {
                        return row.extracted_data.patient_info && row.extracted_data.patient_info.patient_name;
                    }
                }
                return "";

            case "Index 3":
                if (row && row.extracted_data) {
                    if (row.claim_document) {
                        return row.extracted_data.loss_date_and_time;
                    } else if (row.policy_document) {
                        return row.extracted_data.PolicyInfo && row.extracted_data.PolicyInfo.policy_holder_mobile;
                    } else if (row.medical_bill) {
                        return row.extracted_data.service_info && row.extracted_data.service_info.statement_date;
                    }
                }
                return "";

            case "Index 4":
                if (row && row.extracted_data) {
                    if (row.claim_document) {
                        return row.extracted_data.loss_type;
                    } else if (row.policy_document) {
                        return row.extracted_data.PolicyInfo && row.extracted_data.PolicyInfo.policy_holder_DOB;
                    } else if (row.medical_bill) {
                        return row.extracted_data.service_info && row.extracted_data.service_info.charges;
                    }
                }
                return "";

            default:
                return null;
        }
    }

    const handleOpenDocumentViewer = (row) => {
        console.log("row in the document view", row, viewDocument);

        // if (ViewDocument.current) {
        // ViewDocument.current.scrollIntoView({ behavior: 'smooth' });
        if (row.encoded_content) {
            const pdfBytes = Uint8Array.from(atob(row.encoded_content), c => c.charCodeAt(0));
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            setDocumentName(row.documentName);
            setOpenPdf(true);
        } else {
            console.error('Encoded content is missing in the row object');
            // Handle the error appropriately, maybe show a message to the user
        }
        // } else {
        //     console.error('Footer reference is null');
        // }       
    };

    const handleEmailDocumentClose = () => {
        setOpenPdf(false);
    }




    return (
        <> <div>
        {/* Other component code */}
        {SnackbarComponent()} {/* Render the Snackbar from the hook */}
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
                                                        <div className='ETF-mail'><strong>Mail Id :</strong> {email}</div>
                                                        <div className='ETF-mail'> <strong>Subject :</strong> {subject}</div>
                                                        {processing && id === 0 && <CheckIcon style={{ color: 'green' }} />}
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
                                successEmails={successEmails.length}
                                failedEmails={failedEmails} // Use the calculated failedEmails
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
                        <TableContainer sx={{ maxHeight: '300px' }}> {/* Set max height for the TableContainer */}
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: '10%', fontWeight: 'bold', color: 'blue' }}>Date</TableCell>
                                        <TableCell sx={{ width: '15%', fontWeight: 'bold', color: 'blue' }}>Doc Name</TableCell>
                                        <TableCell sx={{ width: '15%', fontWeight: 'bold', color: 'blue' }}>Classification</TableCell>
                                        <TableCell sx={{ width: '18%', fontWeight: 'bold', color: 'blue' }}>Sender Email</TableCell>
                                        <TableCell sx={{ width: '10%', fontWeight: 'bold', color: 'blue' }}>Index data 1</TableCell>
                                        <TableCell sx={{ width: '10%', fontWeight: 'bold', color: 'blue' }}>Index data 2</TableCell>
                                        <TableCell sx={{ width: '10%', fontWeight: 'bold', color: 'blue' }}>Index data 3</TableCell>
                                        <TableCell sx={{ width: '12%', fontWeight: 'bold', color: 'blue' }}>Index data 4</TableCell>
                                        <TableCell sx={{ width: '5%', fontWeight: 'bold', color: 'blue' }}>View</TableCell>                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {successEmails.map((row, index) => {
                                        console.log("Row:", row);
                                        return (
                                            <React.Fragment key={index}>
                                                <TableRow hover sx={{ cursor: 'pointer', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>

                                                    <TableCell sx={{ width: '15%' }}>{renderValue("Email Time", row)}</TableCell>
                                                    <TableCell sx={{ width: '20%' }}>{renderValue("Document Name", row)}</TableCell>
                                                    <TableCell sx={{ width: '20%' }}>{renderValue("classification", row)}</TableCell>
                                                    <TableCell sx={{ width: '25%' }}>{renderValue("Sender Email", row)}</TableCell>
                                                    <TableCell sx={{ width: '10%' }}>{renderValue("Index 1", row)}</TableCell>
                                                    <TableCell sx={{ width: '10%' }}>{renderValue("Index 2", row)}</TableCell>
                                                    <TableCell sx={{ width: '10%' }}>{renderValue("Index 3", row)}</TableCell>
                                                    <TableCell sx={{ width: '10%' }}>{renderValue("Index 4", row)}</TableCell>
                                                    <TableCell sx={{ width: '25%' }}>
                                                        <ToolTip title="View Document" arrow placement="top">
                                                            <Button
                                                                onClick={() => handleOpenDocumentViewer(row)}
                                                                disabled={!row.encoded_content}
                                                                sx={{ textTransform: "capitalize", minWidth: 'auto', padding: 0 }}
                                                            >
                                                                <img src={viewDocument} alt="view document" style={{ height: "1.5rem" }} />
                                                            </Button>
                                                        </ToolTip>
                                                    </TableCell>
                                                </TableRow>

                                            </React.Fragment>
                                        )

                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                )}
            </Grid>
            {/* end of emails tables */}
            <Dialog open={openPdf} onClose={handleEmailDocumentClose} fullWidth maxWidth="xl">
                <DialogTitle>{documentName}</DialogTitle>
                <DialogContent>
                    {pdfUrl ? (
                        <embed src={pdfUrl} width="100%" height="600px" type="application/pdf" />
                    ) : (
                        <PreviewError />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEmailDocumentClose} color="primary">
                        Close
                    </Button>
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
                </DialogActions>
            </Dialog>
        </Container>
        </>
    )
}

export default DocAIClassifyEmailsProcessFun