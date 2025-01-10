import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useNetworkStatus from '../../components/ErrorPages/UseNetworkStatus.js';
import PreviewError from "../../components/ErrorPages/PreviewError.js";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';
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
  Grid
} from '@mui/material';
import { styled } from '@mui/system';
import FileUpload from '../../components/FileUploadExtra.js';
import processclaim from "../../assets/processclaim.png";


function ExtractedDataDisplay({ displayValues, subTotalsPolicyData, subTotalsData }) {
  console.log("displyvalues", displayValues, subTotalsPolicyData);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatValue = (key, value) => {

    if (key === "Total Claims") return value;
    if (value === null) return 'Not Found';
    if (value === 0 || value === '0') return '$0';
    if (value === null || value === '' || value === 'N/A') {
      return 'Not Found';
    }
    if (Array.isArray(value)) {
      return value.map(v => (typeof v === 'number' && !isNaN(v)) ? `$${v}` : v).join(',');
    }
    if (typeof value === 'number' && !isNaN(value)) {
      return `$${value}`;
    }

    return value;
    ;
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
    <>
    
    <TableContainer component={Paper} style={{ boxShadow: 'none', background: 'transparent', height: '100%', overflow: 'auto' }}>
      {subTotalsPolicyData && Object.keys(subTotalsPolicyData).length > 0 && (
        <div style={{ marginTop: '2rem', textAlign: "left" }}>
          {Object.entries(subTotalsPolicyData).map(([key, value]) => (
            value !== null && value !== "" && (!Array.isArray(value) || value.length > 0) && (
              <Typography key={key} variant="body2" >
                <strong>{key} : </strong> {Array.isArray(value) ? value.join(', ') : value}<br />
              </Typography>
            )
          ))}
        </div>
      )}
      <Table size={isMobile ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold', color: '#1976D2', borderBottom: '2px solid #1976D2' }}>Attribute</TableCell>
            <TableCell style={{ fontWeight: 'bold', color: '#1976D2', borderBottom: '2px solid #1976D2' }}>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody component={motion.tbody} variants={tableVariants} initial="hidden" animate="visible">
        {Object.entries(displayValues).map(([key, value]) => (
        <AnimatedTableRow key={key} variants={rowVariants} style={key === "Confidence Factor" ? { borderTop: '2px solid #1976D2' } : {}}>
          <TableCell>{key}</TableCell>
          <TableCell>
      {key === "Confidence Factor"
        ? `${parseFloat(String(value).replace('$', '')).toFixed(2)}%`
        : formatValue(key, value)}
    </TableCell>
        </AnimatedTableRow>
      ))}
 
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}

function ExtractedDataDisplay1({ subTotalsData }) {
  console.log("displyvalues", subTotalsData);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const formatValue = (key, value) => {
    console.log(key, value);
    if (key === "Total Claims") return value;
    if (value === null) return 'Not Found';
    if (value === 0 || value === '0') return '$0';
    if (value === null || value === '' || value === 'N/A') {
      return 'Not Found';
    }
    if (Array.isArray(value)) {
      return value.map(v => (typeof v === 'number' && !isNaN(v)) ? `$${v}` : v).join(',');
    }
    if (typeof value === 'number' && !isNaN(value)) {
      return `$${value}`;
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
            <TableCell style={{ fontWeight: 'bold', color: '#1976D2' }}>Type of LOB</TableCell>
            <TableCell style={{ fontWeight: 'bold', color: '#1976D2' }}>Total Claims</TableCell>
            <TableCell style={{ fontWeight: 'bold', color: '#1976D2' }}>Total Loss</TableCell>
            <TableCell style={{ fontWeight: 'bold', color: '#1976D2' }}>Total Reserved Amounts</TableCell>
          </TableRow>
        </TableHead>
        <TableBody component={motion.tbody} variants={tableVariants} initial="hidden" animate="visible">
          {Object.entries(subTotalsData).map(([lob, data]) => (

            typeof data === 'object' && (
              <AnimatedTableRow key={lob} variants={rowVariants}>
                <TableCell>{lob}</TableCell>
                <TableCell>{data['No.of.Claims'] || 0}</TableCell>
                <TableCell>{formatValue(null, data['Total_Loss'])}</TableCell>
                <TableCell>{formatValue(null, data['Total_Reserved_Amounts'])}</TableCell>
              </AnimatedTableRow>
            )
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
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


export default function LossRunReportsFun() {
  /* eslint-disable no-unused-vars */
  // const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate(); 
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [correctData, setCorrectData] = useState({});
  const [displayValues, setDisplayValues] = useState({});
  const [subTotalsPolicyData, setSubTotalsPolicyData] = useState({});
  const [subTotalsData, setSubTotalsData] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [afterProcess, setAfterProcess] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [uploadIn] = useState("portal");
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const [selectedFile, setSelectedFile] = useState(null);

  const Authorization = !!localStorage.getItem("Auth") || !!sessionStorage.getItem("NonInsuredAuth");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [errorMessage, setErrorMessage] = useState("");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const snackbarTimeoutRef = React.useRef(null); // Ref to manage the timeout
  const handleSnackbarClose = () => {
      setSnackbarOpen(false);
  };

  const BeforeProcessDisplayValues = {
    "Policy holder Name": " ",
    "List of Unique Policy Numbers": ' ',
    "Policy Number": ' ',
    "Total Claims": 0,
    "Total Incurred Claim Amount": "0",
    "Total Incurred Medical Losses": "0",
    "Total Incurred Expenses": "0",
    "Total Loss Amount": "0",
    "Average Loss Per Claim": "0",
    "Total Reserved Amount": "0",
  };
  useEffect(() => {
    setIsSubmitDisabled(!selectedFile);
  }, [selectedFile]);

  const handleFilesUploadToLossRunReport = (selectedFiles, previews) => {
    setSelectedFile(selectedFiles[0]);
    setPreviews(previews);
    setIsSubmitDisabled(false);
  };

  const handleFileRemove = (fileName) => {
    setAfterProcess(false);
    setLoading(false);
    setSelectedFile(null);
    setPreviews([]);
    setIsSubmitDisabled(true);
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
      // Start the timeout to show the snackbar after 5 seconds
      snackbarTimeoutRef.current = setTimeout(() => {
        setSnackbarOpen(true); // Show snackbar if request takes more than 5 seconds
    }, 1000);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const uploadResponse = await axiosInstance.post('AI/process_files/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Clear timeout if the response arrives earlier than 5 seconds
      clearTimeout(snackbarTimeoutRef.current);
      setSnackbarOpen(false);
     
      console.log("uplaodResponse", uploadResponse)
      console.log('Accuracy factor: ', uploadResponse.accuracy)
 
      if (uploadResponse.status !== 200) {
        throw new Error(`HTTP error! status: ${uploadResponse.status}`);
      }
 
      // const uploadData = await uploadResponse.json();
      const uploadData = uploadResponse.data;
      const base64Image = uploadData.image;
      const extractedFileData = uploadData.extracted_text;
      let prompt, requestData, mimeType, geminiText, geminiText1, geminiText2, prompt1, prompt2;
      let gemini_all_input_token = 0;
      let gemini_all_output_tokens = 0;
      let gemini_all_total_tokens = 0;
      console.log(formData, uploadData, 'format');
      if (base64Image) {
 
        prompt = `Extract Total No.of Claims(integer), list of Claim Amounts (Dont Include Total), and list of Reserved amounts (Dont Include Total),list of Medical Losses (Dont Include Total),list of Additional Expenses not claim Amounts (Dont Include Total),  if there or else just respond as 0`;
        requestData = base64Image;
        mimeType = selectedFile.type;
        const geminiResult = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: requestData,
              mimeType: mimeType,
            }
          }
        ]);
        gemini_all_input_token+=geminiResult.response.usageMetadata.promptTokenCount;
        gemini_all_output_tokens+=geminiResult.response.usageMetadata.candidatesTokenCount;
        gemini_all_total_tokens+=geminiResult.response.usageMetadata.totalTokenCount;
 
        const geminiResponse = await geminiResult.response;
        geminiText = geminiResponse.text();
 
        prompt2 = `Please extract the following from the given extracted text:
            1. Policy holder Name: (If available)
            2. List of Unique Policy Numbers: [x1,x2,x3...] (if available)
            3. Policy_Number: (If available)
            Only provide the output if the values are explicitly provided please dont assume things by yourself and provide wrong results, read the whole extracted atleast 5 times before providing answers, accuracy is important here!
 
            Extracted text:${extractedFileData}`;
        requestData = base64Image;
        mimeType = selectedFile.type;
        const geminiResult2 = await model.generateContent([
          prompt2,
          {
            inlineData: {
              data: requestData,
              mimeType: mimeType,
            }
          }
        ]);
        gemini_all_input_token+=geminiResult2.response.usageMetadata.promptTokenCount;
        gemini_all_output_tokens+=geminiResult2.response.usageMetadata.candidatesTokenCount;
        gemini_all_total_tokens+=geminiResult2.response.usageMetadata.totalTokenCount;
 
 
        const geminiResponse2 = await geminiResult2.response;
        geminiText2 = geminiResponse2.text();
 
        const structureFormData = new FormData();
        structureFormData.append("Grand_totals", geminiText);
        structureFormData.append("Sub_totals", geminiText2);
        structureFormData.append("gemini_all_input_token", gemini_all_input_token);
        structureFormData.append("gemini_all_output_tokens", gemini_all_output_tokens);
        structureFormData.append("gemini_all_total_tokens", gemini_all_total_tokens);
        structureFormData.append("file_name", selectedFile.name);
        const structureResponse = await axiosInstance.post('AI/parse_text/', structureFormData);
        console.log(structureResponse, structureResponse.data);
        console.log("confidence factor: ", structureResponse.data.accuracy)
 
        setCorrectData(structureResponse.data.output);
 
        setDisplayValues({
          "Policy holder Name": structureResponse.data.policy_holder_name,
          'Policy Number': structureResponse.data.saiNumber,
          'Policy Numbers List': structureResponse.data.policyNumbers,
          "Total Claims": structureResponse.data.grand_totals_json['No.of.claims'],
          "Total Incurred Claim Amount": structureResponse.data.grand_totals_json.Total_Incurred_Claim_Amount,
          "Total Incurred Medical Losses": structureResponse.data.grand_totals_json.Total_Incurred_Medical_Losses,
          "Total Incurred Expenses": structureResponse.data.grand_totals_json.Total_Incurred_Expenses,
          "Total Loss Amount": structureResponse.data.grand_totals_json.Total_Loss_Amount,
          "Average Loss Per Claim": structureResponse.data.grand_totals_json.Average_Loss_per_claim,
          "Total Reserved Amount": structureResponse.data.grand_totals_json.Total_Reserved_Amounts,
          "Confidence Factor":structureResponse.data.accuracy,
         
        });
 
        // Extract relevant data for sub-totals display
        const policyHolderName = structureResponse.data.policy_holder_name;
        const saiNumber = structureResponse.data.sai_number;
        const policyNumbers = structureResponse.data.policy_numbers_list;
 
        setSubTotalsPolicyData({
          'Policy Holder Name': policyHolderName,
          'Policy Number': saiNumber,
          'Policy Numbers List': policyNumbers,
        });
 
        setSubTotalsData(structureResponse.data.sub_totals_json);
        setLoading(false);
        setAfterProcess(true);
        setLoading(false);
        setAfterProcess(true);
      }
      else if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selectedFile.type === 'application/vnd.ms-excel') {
 
        const reader = new FileReader();
        reader.onload = async (e) => {
          prompt1 = `Analyze the following extracted text and provide a structured response with these specific details:
 
        1. Number of Claims
        2. Total Incurred Loss Amount (Total Loss Amount)
        3. Total Incurred Claim Amount
        4. Total Incurred Medical Losses
        5. Total Incurred Expenses
        6. Total Reserved Amounts
        7.Policy Holder Name
        8.List of Unique Policy Numbers
        9.Policy_Number
 
        Instructions:
        - Check for Grand Totals in the extracted Text and extract in this format:
          1. Number of Claims: [value]
          2. Total (INCURRED/INC): [value (comma separated)]
          3. Total Claim (INCURRED/INC):  [value (comma separated)]
          4. Total Medical (INCURRED/INC):  [value (comma separated)]
          5. Total Expenses (INCURRED/INC):  [value (comma separated)]
          6. Total Reserved Amounts (O/S):  [value (comma separated)]
           7.Policy Holder Name: [value]
        8.List of Unique Policy Numbers: [value]
        9.Policy_Number: [value]
        - Ensure that all amount values are separated with commas for thousands (e.g., 1000 should be formatted as 1,000).
        - Only Provide the values under Grand Totals, Please dont provide any values above grand totals and if you dont
        find any value Just provide "0" inplace of it.
        - If you got all these eight details (Policy Holder Name, Unique Policy Numbers, Policy_Number,Number of Claims,Total Incurred Claim Amount,Total Incurred Medical Losses,Total Incurred Expenses, Total Reserved Amounts) dont provide anything else!
        We just need these details! please dont provide anything else.
 
        Extracted_data:
        ${extractedFileData}`;
 
          const result1 = await model.generateContent(prompt1);
          const response1 = result1.response;
          geminiText1 = response1.text();
          gemini_all_input_token+=result1.response.usageMetadata.promptTokenCount;
          gemini_all_output_tokens+=result1.response.usageMetadata.candidatesTokenCount;
          gemini_all_total_tokens+=result1.response.usageMetadata.totalTokenCount;
 
 
          console.log("text 1", geminiText1, response1);
 
          prompt2 = `Please extract the following details from the provided text. Only include values that are explicitly mentioned. Ensure that no assumptions are made, and review the text thoroughly for accuracy before providing the output. Be sure to identify keys even if they appear in uppercase, lowercase, or have gaps between characters. Accuracy is critical.
 
1. Policy Holder Name: value (if available)
2. List of Unique Policy Numbers: value in the format [x1, x2, x3, ...] (if available)
3. Policy Number: value (if available)
 
Ensure that you can recognize and match keys even if they are written in different formats, such as:
- Uppercase or lowercase (e.g., POLICY HOLDER NAME or policy holder name,Policyholder Name)
- With gaps or extra spaces (e.g., P O L I C Y H O L D E R N A M E)
 
Make sure to read the entire document at least 5 times before extracting the details.
 
Extracted Text: ${extractedFileData}`;
 
          const result2 = await model.generateContent(prompt2);
          const response2 = result2.response;
          geminiText2 = response2.text();
          gemini_all_input_token+=result2.response.usageMetadata.promptTokenCount;
          gemini_all_output_tokens+=result2.response.usageMetadata.candidatesTokenCount;
          gemini_all_total_tokens+=result2.response.usageMetadata.totalTokenCount;
 
          console.log("text 2", geminiText2);
 
          const structureFormData = new FormData();
          structureFormData.append("Grand_totals", geminiText1);
          structureFormData.append("Sub_totals", geminiText2);
          structureFormData.append("gemini_all_input_token", gemini_all_input_token);
          structureFormData.append("gemini_all_output_tokens", gemini_all_output_tokens);
          structureFormData.append("gemini_all_total_tokens", gemini_all_total_tokens);
          structureFormData.append("file_name", selectedFile.name);  
          const structureResponse = await axiosInstance.post('AI/parse_text/', structureFormData);
          console.log("structureResponse", structureResponse.data);
          console.log("confidence factor: ", structureResponse.data.accuracy) ;
          setCorrectData(structureResponse.data.grand_totals_json);
 
          setDisplayValues({
            "Policy holder Name": structureResponse.data.policy_holder_name,
            "Policy Number": structureResponse.data.sai_number,
            "List of Unique Policy Numbers": structureResponse.data.policy_numbers_list,
            "Policy holder Name": structureResponse.data.policy_holder_name,
            "Total Claims": structureResponse.data.grand_totals_json['No.of.claims'],
            "Total Incurred Claim Amount": structureResponse.data.grand_totals_json.Total_Incurred_Claim_Amount,
            "Total Incurred Medical Losses": structureResponse.data.grand_totals_json.Total_Incurred_Medical_Losses,
            "Total Incurred Expenses": structureResponse.data.grand_totals_json.Total_Incurred_Expenses,
            "Total Loss Amount": structureResponse.data.grand_totals_json.Total_Loss_Amount,
            "Average Loss Per Claim": structureResponse.data.grand_totals_json.Average_Loss_per_claim,
            "Total Reserved Amount": structureResponse.data.grand_totals_json.Total_Reserved_Amounts,
            "Confidence Factor":structureResponse.data.accuracy,
           
          });
 
          // Extract relevant data for sub-totals display
          const policyHolderName = structureResponse.data.policy_holder_name;
          const saiNumber = structureResponse.data.sai_number;
          const policyNumbers = structureResponse.data.policy_numbers_list;
 
          setSubTotalsPolicyData({
            'Policy Holder Name': policyHolderName,
            'Policy Number': saiNumber,
            'Policy Numbers List': policyNumbers,
          });
 
          setSubTotalsData(structureResponse.data.sub_totals_json);
          setLoading(false);
          setAfterProcess(true);
 
        }
 
        reader.readAsArrayBuffer(selectedFile);
 
      }
      else {
        prompt1 = `Analyze the following extracted text and provide a structured response with these specific details:
 
        1. Number of Claims
        2. Total Incurred Loss Amount (Total Loss)
        3. Total Incurred Claim Amount
        4. Total Incurred Medical Losses
        5. Total Incurred Expenses
        6. Total Reserved Amounts
         7.Policy Holder Name
        8.List of Unique Policy Numbers
        9.Policy_Number
 
        Instructions:
        - Check for Grand Totals in the extracted Text and extract in this format:
          1. Number of Claims: [value]
          2. Total (INCURRED/INC):  [value (comma separated)]
          3. Total Claim (INCURRED/INC):  [value (comma separated)]
          4. Total Medical (INCURRED/INC):  [value (comma separated)]
          5. Total Expenses (INCURRED/INC):  [value (comma separated)]
          6. Total Reserved Amounts (O/S):  [value (comma separated)]
           7.Policy Holder Name: [value]
        8.List of Unique Policy Numbers: [value]
        9.Policy_Number: [value]
        - Ensure that all amount values are separated with commas for thousands (e.g., 1000 should be formatted as 1,000).
        - Only Provide the values under Grand Totals, Please dont provide any values above grand totals and if you dont
        find any value Just provide "0" inplace of it.
        - If you got all these eight details (Policy Holder Name, Unique Policy Numbers, Policy_Number,Number of Claims,Total Incurred Claim Amount,Total Incurred Medical Losses,Total Incurred Expenses, Total Reserved Amounts) dont provide anything else!
        We just need these details! please dont provide anything else.
 
        Extracted_data:
        ${extractedFileData}`;
 
        const result1 = await model.generateContent(prompt1);
        console.log("response 1", result1);
 
        const response1 = result1.response;
        geminiText1 = response1.text();
 
        console.log("text 1", geminiText1);
        gemini_all_input_token+=result1.response.usageMetadata.promptTokenCount;
        gemini_all_output_tokens+=result1.response.usageMetadata.candidatesTokenCount;
        gemini_all_total_tokens+=result1.response.usageMetadata.totalTokenCount;
        prompt2 = `From the provided extracted text, please extract the following information:
 
    - Policy_holder Name (Don't Repeat just in the starting)
    - List of all the unique policy numbers (Don't repeat just in the starting) (Only If available and explicitly mentioned) (Please don't provide wrong policy numbers, only provide if they are mentioned explicitly or else just respond with [])
    - Policy Number (Only If available and explicitly mentioned)
 
For each year where subtotal data is explicitly present:
    - List the subtotals for each line of insurance, including:
        a. Number of claims
        b. Total Amount (INCURRED/INC) (Aggregation of all losses, Total INC. Not just the claim amount, but the total including all expenses, format values with commas for thousands, e.g., 1000 becomes 1,000)
    c. Total Reserved Amount (O/S) (Format values with commas for thousands, e.g., 1000 becomes 1,000)
 
Critical instructions:
    - Only include years and data that are explicitly stated in the extracted text.
    - Do not generate, infer, calculate, or estimate any values not directly provided in the text.
    - If subtotal data is missing for any year or line of insurance, do not include it.
    - Do not provide data for any years beyond what is explicitly mentioned in the text.
    - If a piece of information (number of claims, total amount, or reserved amount) is missing for a subtotal, omit that item entirely.
    - If no years with complete subtotal information are found, clearly state that no qualifying data is available in the extracted text.
 
Presentation format:
    - Organize the information by year.
    - Use a list format, not a table format.
    - Only provide subtotals based on the line of insurance within each year, not year-wise totals.
    - Start each year's data with a clear heading (e.g., "Year: 2015").
   
Example format (use only if data is present):
    - Policy_holder Name: [John Doe] (Don't Repeat just in the starting)
    - Policy Number: [12345] (Only If available and explicitly mentioned)
    - List of all the unique policy numbers: [x1, x2, ...] (Don't repeat just in the starting) (Only If available and explicitly mentioned) (Please don't provide wrong policy numbers, only provide it they are mentioned explicitly or else just respond with [])
 
Then:
    Year: [YYYY]
    [Line of Insurance]:
   - Number of claims: [X] (if available)
   - Total Amount (INCURRED/INC): [Y] (Aggregation of all losses, Total INC. Not just the claim amount, format with commas)
   - Total Reserved Amount (O/S): [Z] (if available, format with commas)
 
Remember: Your response should only contain information explicitly stated in the extracted text. Do not make any assumptions or provide any data that isn't clearly present in the given text.
 
extracted_text: ${extractedFileData}`;
 
        const result2 = await model.generateContent(prompt2);
 
        console.log("response 2", result2);
        const response2 = result2.response;
        geminiText2 = response2.text();
        console.log("text 2", geminiText2);
        gemini_all_input_token+=result2.response.usageMetadata.promptTokenCount;
        gemini_all_output_tokens+=result2.response.usageMetadata.candidatesTokenCount;
        gemini_all_total_tokens+=result2.response.usageMetadata.totalTokenCount;
 
        const structureFormData = new FormData();
        structureFormData.append("Grand_totals", geminiText1);
        structureFormData.append("Sub_totals", geminiText2);
        structureFormData.append("gemini_all_input_token", gemini_all_input_token);
        structureFormData.append("gemini_all_output_tokens", gemini_all_output_tokens);
        structureFormData.append("gemini_all_total_tokens", gemini_all_total_tokens);
        structureFormData.append("file_name", selectedFile.name);
        const structureResponse = await axiosInstance.post('AI/parse_text/', structureFormData);
        console.log("structureResponse", structureResponse.data, structureResponse.data.policy_holder_name);
        console.log("confidence factor: ", structureResponse.data.accuracy);
        setCorrectData(structureResponse.data.grand_totals_json);
 
        setDisplayValues({
          "Policy holder Name": structureResponse.data.policy_holder_name,
          "Policy Number": structureResponse.data.sai_number,
          "List of Unique Policy Numbers": structureResponse.data.policy_numbers_list,
          "Total Claims": structureResponse.data.grand_totals_json['No.of.claims'],
          "Total Incurred Claim Amount": structureResponse.data.grand_totals_json.Total_Incurred_Claim_Amount,
          "Total Incurred Medical Losses": structureResponse.data.grand_totals_json.Total_Incurred_Medical_Losses,
          "Total Incurred Expenses": structureResponse.data.grand_totals_json.Total_Incurred_Expenses,
          "Total Loss Amount": structureResponse.data.grand_totals_json.Total_Loss_Amount,
          "Average Loss Per Claim": structureResponse.data.grand_totals_json.Average_Loss_per_claim,
          "Total Reserved Amount": structureResponse.data.grand_totals_json.Total_Reserved_Amounts,
          "Confidence Factor":structureResponse.data.accuracy,
         
        });
 
        // Extract relevant data for sub-totals display
        const policyHolderName = structureResponse.data.policy_holder_name;
        const saiNumber = structureResponse.data.sai_number;
        const policyNumbers = structureResponse.data.policy_numbers_list;
 
        setSubTotalsPolicyData({
          'Policy Holder Name': policyHolderName,
          'Policy Number': saiNumber,
          'Policy Numbers List': policyNumbers,
        });
 
        setSubTotalsData(structureResponse.data.sub_totals_json);
        setLoading(false);
        setAfterProcess(true);
 
      }
 
 
 
    } catch (error) {
      console.error("Error processing image:", error);
      setAiResponse("An error occurred while processing the image.");
      // Clear timeout if the response arrives earlier than 5 seconds
      clearTimeout(snackbarTimeoutRef.current);
      setSnackbarOpen(false);
    // Check if the error response exists
    if (error.response) {
      const { status } = error.response; // Capture the status code
      const errorMessage = error.response.data.message || "A server error occurred. Please try again later.";
      const errorSource = error.response.data.api || "Unknown source";
      const userName = localStorage.getItem('userName');
      const fileName = selectedFile ? selectedFile.name : 'No file uploaded'; // Extract the file name
      const fileType = selectedFile ? selectedFile.type : 'Unknown type'; // Extract the file type
     
      console.log('filetype: ', fileType);
      console.log('filename: ', fileName);
      console.log('Error Message: ', errorMessage);
      console.log('username: ', userName);
      console.log('status_code: ', status);
      console.log('errorSource: ', errorSource);
 
      // Send both the error message, error source, and status to your backend
      setNetworkError({
          errorMessage: errorMessage,
          errorSource: errorSource,  // Specify where the error occurred
          username: userName,
          fileName: fileName,        // Include the file name
          fileType: fileType,        // Include the file type
          status: status              // Include the status code
      });
  } else {
      setErrorMessage(error.message || "An unexpected error occurred.");
      setAiResponse("An error occurred while processing the image.");
  }
}
};
  const handleReset = () => {
    setAfterProcess(false);
    setDisplayValues({});
    setSelectedFile(null);
    setPreviews([]);
    setAiResponse('');
    setCorrectData({});
    setIsSubmitDisabled(true);
  };

  const renderPreview = (file) => {
    console.log("file in render preview", file)
    const actualFile = file[0] ? file[0].file : null;
    console.log(actualFile);
    const fileUrl = URL.createObjectURL(file);
    if (!fileUrl) {
      // If fileUrl is null, undefined, or empty, show PreviewError
      return <PreviewError />;
    }
    else if (file.type.includes('image')) {
      return (
        <img
          src={fileUrl}
          alt="Preview"
          style={{ width: '100%', height: '600px', objectFit: 'contain' }}
        />
      );
    } else if (file.type === 'application/pdf') {
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

  return <>
<div>
      {/* Other component code */}
      {SnackbarComponent()} {/* Render the Snackbar from the hook */}
    </div>
    <Grid container spacing={4} style={{ marginTop: '2rem' }}>
      <AnimatePresence>
        {
          Authorization ? (
            afterProcess ? (
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
                        Extracted Loss run Data
                      </Typography>
                      <ExtractedDataDisplay
                        displayValues={displayValues}
                        // subTotalsPolicyData={subTotalsPolicyData}
                        subTotalsData={subTotalsData}
                      />
                    </GlassyCard>
                  </Grid>
                  <Grid item xs={12} md={1}></Grid>

                  <Grid item xs={12} md={1}></Grid>
                  {Object.keys(subTotalsData).length > 0 && (
                    <Grid item xs={12} md={10}>
                      <GlassyCard
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.5 }}
                      >

                        <ExtractedDataDisplay1 subTotalsData={subTotalsData} />

                      </GlassyCard>
                    </Grid>
                  )
                  }
                  <Grid item xs={12} md={1}></Grid>
                </Grid>
              </>
            ) : (

              <>
                {/* <Grid item xs={12} md={1}></Grid> */}
                <Grid item xs={12} md={9}  sx={{ marginLeft: '180px' }}>
                  <GlassyCard
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    style={{ boxShadow: 'none' }} 
                  >
                    <Typography className='Nasaliza' variant="h6" style={{ color: "#010066" }} sx={{marginBottom:'20px'}}>Upload Loss run Report</Typography>
                    <FileUpload
                      id="portal"
                      multiple={false}
                      allowedFormats={['png', 'jpg', 'jpeg', 'plain', 'pdf', 'vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'vnd.ms-excel']}
                      setIsSubmitDisabled={setIsSubmitDisabled}
                      selectedFilesInParent={selectedFile ? [selectedFile] : []}
                      filePreviews={previews}
                      uploadIn={uploadIn}
                      onFilesUpload={handleFilesUploadToLossRunReport}
                      onFileRemove={handleFileRemove}
                    />
                    <StyledButton
                      onClick={processImage}
                      disabled={isSubmitDisabled || loading}
                      startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <img src={processclaim} alt="process and claim icon" style={{ height: 24 }} />}
                    >
                      {loading ? 'Processing...' : 'Process file'}
                    </StyledButton>
                  </GlassyCard>
              
                </Grid>
              </>
            )) :
            (
              <Grid container justifyContent="center" >

              </Grid>

            )
        }
      </AnimatePresence>
      <Snackbar
                open={snackbarOpen}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Top Center Position
                autoHideDuration={15000} // Automatically hide after 6 seconds if not closed earlier
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
                    The document is under process. Please wait.
                </Alert>
            </Snackbar>
    </Grid >
  </>
}