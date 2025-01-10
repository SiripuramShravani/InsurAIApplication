import { useState, useRef } from 'react';
import { Grid, Card, Snackbar, Alert } from '@mui/material';
import html2canvas from 'html2canvas';
import MDTypography from '../../CompanyDashboardChartsCardsLayouts/CompanyDashboardComponents/MDTypography';
import BatchCardUITemplate from './BatchCardUITemplate';
import DocAIQuoteBatchProcessView from '../../pages/CompanyDashboardLayout/BatchPolicyDashboard/DocAIQuoteBatchProcessView';
import DocAIQuoteBatchQuotesView from '../../pages/CompanyDashboardLayout/BatchPolicyDashboard/DocAIQuoteBatchQuotesView';
import axios from 'axios';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import { addPageNumbers, addDateToPDF } from "../../CompanyDashboardChartsCardsLayouts/TablePDFfunctions";
import { styled } from '@mui/material';

const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
    '& .MuiSnackbarContent-root': {
        backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#fff',
        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
        boxShadow: theme.shadows[8],  
        borderRadius: '8px', 
        padding: theme.spacing(1.5, 3),  
        fontWeight: 'bold',  
    },
}));

const StyledAlert = styled(Alert)(({ theme, severity }) => ({
    '& .MuiAlert-icon': {
        color: severity === "success" ? '#4caf50' : '#f44336',  
    },
    color: theme.palette.mode === 'dark' ? '#fff' : '#000', 
    backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#f9f9f9', 
    padding: theme.spacing(1),
    '& .MuiAlert-message': {
        fontSize: "0.9rem",  
        fontWeight: 'bold',  
    }
}));

export default function BatchCard({ heading, steps }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [apiStatus, setApiStatus] = useState({});
    const [reportData, setReportData] = useState(null);
    const [batchDocAIQuotes, setBatchDocAIQuotes] = useState({
        success: [],
        failure: [],
        editedSuccess: []
    });
    const [batchDocAIQuotesCount, setBatchDocAIQuotesCount] = useState({
        success: 0,
        failure: 0,
        editedSuccess: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showDocAIQuoteBatchProcessView, setShowDocAIQuoteBatchProcessView] = useState(false);
    const [showDocAIQuoteBatchQuotesView, setShowDocAIQuoteBatchQuotesView] = useState(false);
    const [activeCard, setActiveCard] = useState(null);
    const [batchRunCompleted, setBatchRunCompleted] = useState(false);
    const [isBatchProcessing, setIsBatchProcessing] = useState(false);
    const processViewRef = useRef(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const axiosInstance = axios.create({
        baseURL: process.env.REACT_APP_URL,
        withCredentials: true
    });

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleReset = () => {
        if (isBatchProcessing) return;
        setCurrentStep(0);
        setIsProcessing(false);
        setApiStatus({});
        setReportData(null);
        setBatchDocAIQuotes({
            success: [],
            failure: [],
            editedSuccess: []
        });
        setBatchDocAIQuotesCount({
            success: 0,
            failure: 0,
            editedSuccess: 0,
        });
        setShowDocAIQuoteBatchProcessView(false);
        setShowDocAIQuoteBatchQuotesView(false);
        setActiveCard(null);
        setBatchRunCompleted(false);
        setIsBatchProcessing(false);
    };

    const exportAnalysis = async (format) => {
        if (!processViewRef.current || !showDocAIQuoteBatchProcessView) return;
        try {
            const canvas = await html2canvas(processViewRef.current);
            const image = canvas.toDataURL(`image/${format}`);
            const link = document.createElement('a');
            link.href = image;
            link.download = `batch-analysis.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting analysis:', error);
        }
    };

    const handleApiCall = async (endpoint, stepId, actionLabel) => {
        setApiStatus(prev => ({ ...prev, [actionLabel]: 'loading' }));
        try {
            if (stepId === 0 && actionLabel === "Run Batch") {
                if (batchRunCompleted) return;
                setIsBatchProcessing(true);
                const ic_id = localStorage.getItem("ic_id_for_dashboard");
                if (!ic_id) {
                    console.error("ic_id is missing in localStorage");
                    setApiStatus(prev => ({ ...prev, [actionLabel]: 'error' }));
                    setIsBatchProcessing(false);
                    return;
                }
                const formData = new FormData();
                formData.append("ic_id", ic_id);
                const response = await axiosInstance.post(
                    'Batch_processes/DocAI_Batch_Quote/', formData
                );
                if (response && response.data) {
                    setReportData(response.data);
                    setCurrentStep(1);
                    setActiveCard(steps[1].title);
                    setShowDocAIQuoteBatchProcessView(false);
                    setShowDocAIQuoteBatchQuotesView(false);
                    setBatchRunCompleted(true);
                    setSnackbarMessage("Batch process completed successfully.");
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                } else {
                    setApiStatus(prev => ({ ...prev, [actionLabel]: 'error' }));
                    console.error("Unexpected response structure:", response);
                }
                setIsBatchProcessing(false);
            } else if (stepId === 1) {
                if (actionLabel === "View Analysis") {
                    setActiveCard(steps[1].title);
                    setShowDocAIQuoteBatchProcessView(true);
                    setShowDocAIQuoteBatchQuotesView(false);
                    setCurrentStep(2);
                } else if (actionLabel === "Export") {
                    if (showDocAIQuoteBatchProcessView) {
                        await exportAnalysis('png');
                    }
                }
            } else if (stepId === 2) {
                if (actionLabel === "View Quotes") {
                    await handleFetchBatchDocAIQuotes();
                    setActiveCard(steps[2].title);
                    setShowDocAIQuoteBatchQuotesView(true);
                    setShowDocAIQuoteBatchProcessView(false);
                } else if (actionLabel === "Download") {
                    if (showDocAIQuoteBatchQuotesView) {
                        handleDownload("pdf")
                    }
                }
            }
            setApiStatus(prev => ({ ...prev, [actionLabel]: 'success' }));
        } catch (error) {
            console.error("API call failed", error);
            setApiStatus(prev => ({ ...prev, [actionLabel]: 'error' }));
            if (stepId === 0 && actionLabel === "Run Batch") {
                setIsBatchProcessing(false);
                setSnackbarMessage("Batch process failed.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
            else {
                setSnackbarMessage("An error occurred.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        }
    };

    const handleAction = (stepId, isPrimary, actionLabel, apiEndpoint) => {
        if (stepId > currentStep) return;
        if (actionLabel === "Reset") {
            handleReset();
            return;
        }
        if (apiEndpoint) {
            handleApiCall(apiEndpoint, stepId, actionLabel);
        }
        if (stepId === 0 && isPrimary) {
            setActiveCard(steps[0].title);
        }
    };

    const handleFetchBatchDocAIQuotes = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post('Batch_processes/fetch_docai_batch_quote/');
            if (response.status === 200) {
                setBatchDocAIQuotes({
                    success: response.data.success_quotes,
                    failure: response.data.failure_quotes,
                    editedSuccess: response.data.edited_success_quotes,
                });
                const success_count = response.data.success_quotes.length;
                const failure_count = response.data.failure_quotes.length;
                const edited_success_count = response.data.edited_success_quotes.length;
                setBatchDocAIQuotesCount({
                    success: success_count,
                    failure: failure_count,
                    editedSuccess: edited_success_count,
                });
            } else {
                console.error("Error fetching batch quotes (non-200 status):", response);
            }
        } catch (error) {
            console.error("Error fetching batch quotes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuotesClose = () => {
        setShowDocAIQuoteBatchQuotesView(false)
    }
    const handleAnalysisClose = () => {
        setShowDocAIQuoteBatchProcessView(false)
    }
    const handleFetchUpdatedBatchQuotes = async () => {
        await handleFetchBatchDocAIQuotes();
    }

    const transformBatchQuoteData = () => {
        const transformed = [];
        batchDocAIQuotes.success.forEach(quote => {
            transformed.push({
                ...quote,
                status: "Success"
            });
        });
        batchDocAIQuotes.editedSuccess.forEach(quote => {
            transformed.push({
                ...quote,
                status: "Edited Success"
            });
        });
        batchDocAIQuotes.failure.forEach(quote => {
            transformed.push({
                ...quote,
                status: "Failure"
            });
        });
        return transformed;
    };

    const handleDownload = (format) => {
        const transformedData = transformBatchQuoteData();
        if (format === "csv") {
            const csvHeaders = Object.keys(transformedData[0] || {}).join(',') + '\n';
            const csvRows = transformedData.map(row => Object.values(row).join(',')).join('\n');
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
            let startY = 50;

            // Success Quotes
            if (batchDocAIQuotes.success.length > 0) {
                doc.text("Success Quotes", 14, startY);
                startY += 10;
                const successTableData = batchDocAIQuotes.success.map(quote => ({
                    "Quote Number": quote.quote_number,
                    "Quote Amount($)": `$${quote.quote_amount}`,
                    "Policy Holder Name": quote.policy_holder_name,
                    "Policy Holder Email": quote.policy_holder_email,
                    "Selected Policy": quote.selected_policy || quote.extracted_data?.PolicyInfo?.selectedPolicy || "N/A",
                    "Document Name": quote.filename,

                }));
                if (successTableData.length > 0) {
                    doc.autoTable({
                        head: [Object.keys(successTableData[0])],
                        body: successTableData.map(obj => Object.values(obj)),
                        startY: startY,
                        styles: { halign: 'right' },
                        headStyles: { halign: 'center', fontStyle: 'bold' }
                    });
                    startY = doc.autoTable.previous.finalY + 10;
                } else {
                    doc.text("No success quotes available", 14, startY);
                    startY += 10;
                }
            }

            // Edited Success Quotes
            if (batchDocAIQuotes.editedSuccess.length > 0) {
                doc.text("Edited Success Quotes", 14, startY);
                startY += 10;
                const editedSuccessTableData = batchDocAIQuotes.editedSuccess.map(quote => ({
                    "Quote Number": quote.quote_number,
                    "Quote Amount($)": `$${quote.quote_amount}`,
                    "Policy Holder Name": quote.policy_holder_name,
                    "Policy Holder Email": quote.policy_holder_email,
                    "Selected Policy": quote.selected_policy || quote.extracted_data?.PolicyInfo?.selectedPolicy || "N/A",
                    "Document Name": quote.filename,
                }));
                if (editedSuccessTableData.length > 0) {
                    doc.autoTable({
                        head: [Object.keys(editedSuccessTableData[0])],
                        body: editedSuccessTableData.map(obj => Object.values(obj)),
                        startY: startY,
                        styles: { halign: 'right' },
                        headStyles: { halign: 'center', fontStyle: 'bold' }
                    });
                    startY = doc.autoTable.previous.finalY + 10;
                } else {
                    doc.text("No edited success quotes available", 14, startY);
                    startY += 10;
                }
            }

            // Failure Quotes
            if (batchDocAIQuotes.failure.length > 0) {
                doc.text("Failure Quotes", 14, startY);
                startY += 10;
                const failureTableData = batchDocAIQuotes.failure.map(quote => ({
                    "Policy Holder Name": quote.policy_holder_name,
                    "Policy Holder Email": quote.policy_holder_email,
                    "Policy Holder Mobile": quote.policy_holder_mobile,
                    "Document Name": quote.filename,
                }));
                if (failureTableData.length > 0) {
                    doc.autoTable({
                        head: [Object.keys(failureTableData[0])],
                        body: failureTableData.map(obj => Object.values(obj)),
                        startY: startY,
                        styles: { halign: 'right' },
                        headStyles: { halign: 'center', fontStyle: 'bold' }
                    });
                    startY = doc.autoTable.previous.finalY + 10;
                }
                else {
                    doc.text("No failure quotes available", 14, startY);
                    startY += 10;
                }
            }
            addPageNumbers(doc);
            doc.save(`${filename}.pdf`);
        } else if (format === "excel") {
            const worksheet = XLSX.utils.json_to_sheet(transformedData);
            // Cell styling based on status
            transformedData.forEach((row, rowIndex) => {
                const statusCell = XLSX.utils.encode_cell({ r: rowIndex + 1, c: Object.keys(row).indexOf("status") });
                if (row.status === "Success") {
                    worksheet[statusCell].s = { fill: { fgColor: { rgb: "00FF00" } } }; // Green
                } else if (row.status === "Failure") {
                    worksheet[statusCell].s = { fill: { fgColor: { rgb: "FF0000" } } };  // Red
                } else if (row.status === "Edited Success") {
                    worksheet[statusCell].s = { fill: { fgColor: { rgb: "0000FF" } } }; // Blue
                }
            });
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "DocAI™Quote Batch Process Data");
            XLSX.writeFile(workbook, "DocAI™Quote_Batch_Process_data.xlsx");
        }
    };

    return (
        <Card>
            <MDTypography style={{ color: "#5d5ca0", textAlign: "left", fontWeight: "bold", fontSize: "1.4rem", padding: "1.5rem" }}>{heading}</MDTypography>
            <Grid container spacing={15} style={{ padding: "1rem 3rem 2rem 3rem" }}>
                {steps.map((step, index) => (
                    <BatchCardUITemplate
                        key={index}
                        step={step}
                        index={index}
                        currentStep={currentStep}
                        isProcessing={isProcessing}
                        handleAction={handleAction}
                        steps={steps}
                        apiStatus={apiStatus}
                        activeCard={activeCard}
                        batchRunCompleted={batchRunCompleted}
                        isBatchProcessing={isBatchProcessing}
                        isLoading={isLoading}
                        showDocAIQuoteBatchProcessView={showDocAIQuoteBatchProcessView}
                        showDocAIQuoteBatchQuotesView={showDocAIQuoteBatchQuotesView}
                    >
                    </BatchCardUITemplate>
                ))}
                {showDocAIQuoteBatchProcessView && (
                    <Grid item xs={12} sx={{ marginTop: "-5rem" }}>
                        <div ref={processViewRef}>
                            <DocAIQuoteBatchProcessView
                                reportData={reportData}
                                onCancel={handleAnalysisClose}
                            />
                        </div>
                    </Grid>
                )}
                {showDocAIQuoteBatchQuotesView && (
                    <Grid item xs={12} sx={{ marginTop: "-5rem" }}>
                        <DocAIQuoteBatchQuotesView
                            quotesData={batchDocAIQuotes}
                            batchDocAIQuotesCount={batchDocAIQuotesCount}
                            onQuoteCancel={handleQuotesClose}
                            onPopUpClose={handleFetchUpdatedBatchQuotes}
                        />
                    </Grid>
                )}
            </Grid>
            <StyledSnackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <StyledAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </StyledAlert>
            </StyledSnackbar>
        </Card>
    );
}