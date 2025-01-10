import React, { useState, useCallback } from "react";
import FileUpload from "../../components/FileUploadExtra.js";
import { styled } from "@mui/system";
import processclaim from "../../assets/processclaim.png";
import axios from "axios";
import { CircularProgress, Button, Typography, Grid } from "@mui/material";
import {
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  Paper,
  Box,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PreviewError from "../../components/ErrorPages/PreviewError.js";
import { useNavigate } from "react-router-dom";
import useNetworkStatus from "../../components/ErrorPages/UseNetworkStatus.js";
import { Snackbar, Alert } from "@mui/material";



// Styled components
const StyledButton = styled(Button)(({ theme, marginTop }) => ({
  justifyContent: "center",
  textAlign: "center",
  width: "100%",
  maxWidth: 200,
  background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
  border: 0,
  borderRadius: 20,
  boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
  color: "white",
  height: 40,
  padding: "0 2px",
  margin: `2rem auto ${marginTop || "0"}`,
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  fontSize: "0.875rem",
  "&:hover": {
    background: "linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)",
    transform: "scale(1.05)",
    boxShadow: "0 6px 10px 4px rgba(33, 203, 243, .4)",
  },
  [theme.breakpoints.down("sm")]: {
    width: "90%",
    fontSize: "0.75rem",
  },
}));

const GlassyCard = styled(motion.div)(
  ({
    theme,
    isFlex = true,
    flexDirection = "column",
    justifyContent = "space-between",
    bgColor = "rgba(255, 255, 255, 0.8)",
    blur = "10px",
  }) => ({
    background: bgColor,
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
    backdropFilter: `blur(${blur})`,
    border: "1px solid rgba(255, 255, 255, 0.18)",
    height: "100%",
    display: isFlex ? "flex" : "block",
    flexDirection: flexDirection,
    justifyContent: justifyContent,
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 48px 0 rgba(31, 38, 135, 0.3)",
    },
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
      borderRadius: theme.spacing(1),
    },
  })
);

const labelMapping = {
  guarantor_name: "Guarantor Full Name",
  guarantor_address: "Guarantor Address",
  guarantor_number: "Guarantor Number",
  patient_name: "Patient Full Name",
  account_number: "Patient ID",
  patient_address: "Patient Address",
  hospital_address: "Hospital Location",
  service_doctor: "Attending Physician",
  date_of_service: "Date of Treatment",
  payments_adjustments: "Insurance Payment",
  patient_balance: "Patient Balance",
  charges: "Total Billed Amount",
  insurance_payments_adjustments: "Insurance payments/adjustments",
  statement_date: "Statement Date",
  billing_support_contact: "Billing Support Contact",
};

const ExtractedDataDisplay = ({ displayValues, dataSource, accuracy }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const formatValue = (value) => {
    if (value === null || value === undefined || value === "")
      return "Not Found";
    if (value === 0 || value === "0") return "$0";
    return `${value}`;
  };
  return (
    <TableContainer
      component={Paper}
      style={{
        boxShadow: "none",
        background: "transparent",
        height: isMobile ? "60vh" : isTablet ? "65vh" : "72%",
        overflow: "auto",
        scrollbarWidth: "thin",
        overflowY: "scroll",
        marginTop: dataSource === "image" ? "40px" : "20px",
      }}
    >
      <style>
        {`
                    /* For Firefox */
                    ::-webkit-scrollbar {
                        width: 0px;
                    }
                    ::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    ::-webkit-scrollbar-thumb {
                        background-color: #1976D2;
                        border-radius: 10px;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background-color: #155A8A;
                    }
                `}
      </style>
      <Table
        size={isMobile ? "small" : "medium"}
        padding={isMobile ? "none" : "normal"}
      >
        <TableHead>
          <TableRow>
            <TableCell
              align="left"
              style={{
                fontWeight: "bold",
                color: "#1976D2",
                borderBottom: "1px solid #1976D2",
                padding: isMobile ? "4px" : "8px",
              }}
            >
              Properties
            </TableCell>
            <TableCell
              align="left"
              style={{
                fontWeight: "bold",
                color: "#1976D2",
                borderBottom: "1px solid #1976D2",
                padding: isMobile ? "4px" : "8px",
                width: isMobile ? "200px" : "300px",
              }}
            >
              Values
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Map through displayValues without including accuracy */}
          {Object.entries(displayValues).map(([originalLabel, value]) => (
            <TableRow key={originalLabel}>
              <TableCell
                align="left"
                component="th"
                scope="row"
                style={{
                  padding: isMobile ? "3px" : "5px",
                  fontSize: isMobile ? "0.8rem" : "1rem",
                }}
              >
                {labelMapping[originalLabel] || originalLabel}
              </TableCell>
              <TableCell
                align="left"
                style={{
                  padding: isMobile ? "3px" : "12px",
                  fontSize: isMobile ? "0.8rem" : "1rem",
                }}
              >
                {typeof value === "object" && value !== null ? (
                  <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                    {Object.entries(value).map(([key, val]) => (
                      <li key={key}>{`${key}: ${formatValue(val)}`}</li>
                    ))}
                  </ul>
                ) : (
                  formatValue(value)
                )}
              </TableCell>
            </TableRow>
          ))}
          {/* Display accuracy row separately at the end */}
          {accuracy && (
            <TableRow sx={{ borderTop: "3px solid #1976D2" }}>
              <TableCell
                align="left"
                component="th"
                scope="row"
                style={{
                  padding: isMobile ? "3px" : "5px",
                  fontSize: isMobile ? "0.8rem" : "1rem",
                }}
              >
                Confidence Factor
              </TableCell>
              <TableCell
                align="left"
                style={{
                  padding: isMobile ? "3px" : "12px",
                  fontSize: isMobile ? "0.8rem" : "1rem",
                }}
              >
                {`${accuracy}%`}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Default values for display
const Guarantor_BeforeProcessDisplayValues = {
  "Guarantor Name": " ",
  "Guarantor Address": " ",
  "Guarantor Number": " ",
};
const Patient_BeforeProcessDisplayValues = {
  "Patient Name": " ",
  "Patient Account Number": " ",
  "Patient Address": " ",
};
const Service_BeforeProcessDisplayValues = {
  "Hospital Address": " ",
  "Service Doctor Name": " ",
  "Date Of Service": " ",
  "Insurance Money Received": " ",
  "Patient Payment Due": " ",
  "Total Charges": " ",
  "Insurance payments/adjustments": " ",
  "Statement Issued Date": " ",
  "Customer Billing Support": " ",
};

const MedBillFun = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadIn] = useState("portal");
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [afterProcess, setAfterProcess] = useState(false);
  const [displayValues_guarantor, setDisplayValues_guarantor] = useState({});
  const [displayValues_patient, setDisplayValues_patient] = useState({});
  const [displayValues_service_info, setDisplayValues_service_info] = useState(
    {}
  );
  const [filePreview, setFilePreview] = useState(null);
  const [accuracy, setAccuracy] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const snackbarTimeoutRef = React.useRef(null); // Ref to manage the timeout
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleReset = () => {
    setAfterProcess(false);
    setDisplayValues_guarantor({});
    setDisplayValues_patient({});
    setDisplayValues_service_info({});
    setSelectedFile(null);
    setPreviews([]);
    setLoading(false);
    setIsSubmitDisabled(true);
    setFilePreview(null);
  };

  const handleFilesUploadToMedBill = (selectedFiles, previews) => {
    setSelectedFile(selectedFiles[0]);
    setPreviews(previews);
    setIsSubmitDisabled(false);
  };

  const handleFileRemove = () => {
    handleReset();
  };
  const ExtractedDocumentComponent = () => {
    const { setNetworkError, SnackbarComponent } = useNetworkStatus();
    const [loader, setLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
  };
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
  const processMedbill = async () => {
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
      formData.append("file", selectedFile);
      const allowedFormats = ["pdf", "jpg", "png", "jpeg"];
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      if (!allowedFormats.includes(fileExtension)) {
        alert(
          "Invalid file format. Please upload a PDF, JPG, PNG, or JPEG file."
        );
        setLoading(false);
        return;
      }
      const response = await axiosInstance.post(
        "AI/process_medbill/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Clear timeout if the response arrives earlier than 5 seconds
      clearTimeout(snackbarTimeoutRef.current);
      setSnackbarOpen(false); // Ensure snackbar is closed

      if (response && response.data) {
        let extractedData;
        if (response.data.Extracted_information) {
          console.log("response", response.data);

          extractedData = response.data.Extracted_information;
          setAccuracy(response.data.accuracy);
        } else if (response.data.image) {
          const imagesData = response.data.image;
          let combined_extracted_text = "";
          let gemini_all_input_token = 0;
          let gemini_all_output_tokens = 0;
          let gemini_all_total_tokens = 0;
          for (let i = 0; i < imagesData.length; i++) {
            const base64Image = imagesData[i];
            let prompt1 = `You are a data analyst working for Innovon Technologies. Extract the following details from the image:
                        - Patient Name
                        - Patient Address
                        - Account Number
                        - Guarantor Name
                        - Guarantor Address
                        - Guarantor Number
                        - Hospital Address
                        - Service Doctor
                        - Statement Date
                        - Date of Service
                        - Charges (including $ symbol)
                        - Payments and Adjustments (including $ symbol): Value ("payments_adjustments" is a general term applicable to any payment corrections)
                        - Insurance payments/adjustments (include $ symbol)
                        - Patient Balance (including $ symbol): Value
                        - Billing Support Contact Number
                        Please provide the extracted information in a simple key: value format, with each piece of information on a new line. If a piece of information is Not found, please replace it with "Not found" ,do not make things up.`;
            try {
              const result1 = await model.generateContent([
                prompt1,
                {
                  inlineData: {
                    data: base64Image,
                    mimeType: "image/png",
                  },
                },
              ]);
              const geminiText1 = await result1.response.text();
              combined_extracted_text += geminiText1;
              gemini_all_input_token +=
                result1.response.usageMetadata?.promptTokenCount || 0;
              gemini_all_output_tokens +=
                result1.response.usageMetadata?.candidatesTokenCount || 0;
              gemini_all_total_tokens +=
                result1.response.usageMetadata?.totalTokenCount || 0;
            } catch (geminiError) {
              console.error(
                `Error generating content for image ${i + 1}:`,
                geminiError
              );
            }
          }
          const combinedresponse = await axiosInstance.post(
            "AI/process_medbill/",
            {
              combined_extracted_text: combined_extracted_text,
              gemini_all_input_token: gemini_all_input_token,
              gemini_all_output_tokens: gemini_all_output_tokens,
              gemini_all_total_tokens: gemini_all_total_tokens,
              file_name: selectedFile.name,
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log('extracted text from images:',combinedresponse) 
          if (combinedresponse && combinedresponse.data) {
            extractedData = combinedresponse.data.extracted_json;
            setAccuracy(combinedresponse.data.accuracy);
          } else {
            console.error("No valid data extracted from images");
            alert(
              "Unable to extract information from the provided images. Please try again or contact support."
            );
            setLoading(false);
            return;
          }
        } else {
          console.error("Extracted information is missing or undefined.");
          alert(
            "No data could be extracted from the provided file. Please ensure you've uploaded a valid medical bill."
          );
          setLoading(false);
          return;
        }
        setDisplayValues_guarantor(
          removeEmptyValues(extractedData.guarantor_info || {})
        );
        setDisplayValues_patient(
          removeEmptyValues(extractedData.patient_info || {})
        );
        setDisplayValues_service_info(
          removeEmptyValues(extractedData.service_info || {})
        );
        setFilePreview(URL.createObjectURL(selectedFile));
        setAfterProcess(true);
      } else {
        console.error("No data returned from the server.");
        alert(
          "An error occurred while processing the file. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error in medbill processing", error);
      // Clear timeout if the response has error
      clearTimeout(snackbarTimeoutRef.current);
      setSnackbarOpen(false); // Ensure snackbar is closed

      // Check if the error response exists
      if (error.response) {
        const { status } = error.response; // Capture the status code
        const errorMessage =
          error.response.data.message ||
          "A server error occurred. Please try again later.";
        const errorSource = error.response.data.api || "Unknown source";
        const userName = localStorage.getItem("userName");
        // Get the file object from formData
        const fileName = selectedFile ? selectedFile.name : "No file uploaded"; // Extract the file name
        const fileType = selectedFile ? selectedFile.type : "Unknown type"; // Extract the file type
        console.log("filetype: ", fileType);
        console.log("filename: ", fileName);
        console.log("Error Message--: ", errorMessage);
        console.log("username :", userName);
        console.log("status_code : ", status);
        console.log("errorSource --:-- ", errorSource);
        // Send both the error message, error source, and status to your backend
        setNetworkError({
          errorMessage: errorMessage,
          errorSource: errorSource, // Specify where the error occurred
          username: userName,
          fileName: fileName, // Include the file name
          fileType: fileType, // Include the file type
          status: status, // Include the status code
        });
      } else {
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    } finally {
      setSnackbarOpen(false);
      setLoading(false);
    }
  };

  function removeEmptyValues(obj) {
    console.log("removeEmptyValues: ", obj);
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        value == null || value === "" ? "Not Found" : value,
      ])
    );
  }

  return (
    <>
      <div>
        {/* Other component code */}
        {SnackbarComponent()} {/* Render the Snackbar from the hook */}
      </div>
      <Grid
        container
        spacing={isMobile ? 2 : 4}
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "auto",
          padding: isMobile ? "1rem" : "0",
        }}
      >
        <AnimatePresence>
          {afterProcess ? (
            <Grid
              container
              spacing={isMobile ? 2 : 3}
              style={{ marginTop: isMobile ? "1rem" : "2rem", margin: "auto" }}
            >
              <Grid item xs={12} md={6} style={{ height: "auto" }}>
                <GlassyCard
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography
                    className="Nasaliza"
                    variant={isMobile ? "subtitle1" : "h6"}
                    style={{ color: "#010066" }}
                    align="left"
                  >
                    Document Preview
                  </Typography>

                  {filePreview ? (
                    <div style={{ marginTop: isMobile ? "50px" : "100px" }}>
                      {selectedFile?.type === "application/pdf" ? (
                        <iframe
                          src={filePreview}
                          width="100%"
                          height={isMobile ? "500" : "700"}
                          title="File Preview"
                          style={{
                            marginTop: isMobile ? "-50px" : "-100px",
                            border: "2px solid black",
                          }}
                        ></iframe>
                      ) : (
                        <img
                          src={filePreview}
                          alt="File Preview"
                          style={{
                            width: "100%",
                            height: "auto",
                            marginTop: isMobile ? "-45px" : "-90px",
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    <PreviewError />
                  )}
                  <StyledButton
                    onClick={handleReset}
                    marginTop={isMobile ? "150px" : "300px"}
                  >
                    Reupload
                  </StyledButton>
                </GlassyCard>
              </Grid>
              <Grid item xs={12} md={6} style={{ height: "auto" }}>
                <GlassyCard
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography
                    className="Nasaliza"
                    variant={isMobile ? "subtitle1" : "h6"}
                    style={{ color: "#010066" }}
                    align="center"
                  >
                    Extracted Medical Bill Data
                  </Typography>

                  <Box mt={isMobile ? 1 : 1.5}>
                    <Typography
                      className="Nasaliza"
                      variant={isMobile ? "subtitle1" : "h6"}
                      style={{ color: "#010066" }}
                      align="left"
                    >
                      Guarantor Data
                    </Typography>
                    <ExtractedDataDisplay
                      displayValues={displayValues_guarantor}
                      dataSource="pdf"
                      style={{ backgroundColor: "transparent", padding: 0 }} // Ensure no background or padding
                    />
                  </Box>

                  <Box mt={isMobile ? 1.5 : 2}>
                    <Typography
                      className="Nasaliza"
                      variant={isMobile ? "subtitle1" : "h6"}
                      style={{ color: "#010066" }}
                      align="left"
                    >
                      Patient Data
                    </Typography>
                    <ExtractedDataDisplay
                      displayValues={displayValues_patient}
                      dataSource="pdf"
                      style={{ backgroundColor: "transparent", padding: 0 }} // Ensure no background or padding
                    />
                  </Box>

                  <Box mt={isMobile ? 1.5 : 2}>
                    <Typography
                      className="Nasaliza"
                      variant={isMobile ? "subtitle1" : "h6"}
                      style={{ color: "#010066" }}
                      align="left"
                    >
                      Service Data
                    </Typography>
                    <ExtractedDataDisplay
                      displayValues={displayValues_service_info}
                      dataSource="pdf"
                      accuracy={accuracy} // Pass accuracy here
                      style={{ backgroundColor: "transparent", padding: 0 }}
                    />
                  </Box>

                  <Box mt={-10}>
                    {" "}
                    {/* Add some top margin to the Box */}
                    <TableContainer>
                      <Table
                        size={isMobile ? "small" : "medium"}
                        padding={isMobile ? "none" : "none"}
                      >
                        <TableHead></TableHead>
                      </Table>
                    </TableContainer>
                  </Box>
                </GlassyCard>
              </Grid>
            </Grid>
          ) : (
            <>
              <Grid item xs={12} md={12} style={{ height: "auto" }}>
                <GlassyCard
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  isFlex={false}
                  style={{ boxShadow: "none" }} // Remove shadow here
                >
                  <Typography
                    className="Nasaliza"
                    variant={isMobile ? "subtitle1" : "h6"}
                    style={{ color: "#010066" }}
                    sx={{ marginTop: "-4rem", marginBottom: "1rem" }}
                  >
                    Upload Medical Report
                  </Typography>
                  <Grid sx={{ marginTop: "0rem" }}>
                    <FileUpload
                      id="portal"
                      multiple={false}
                      allowedFormats={["pdf", "jpg", "png", "jpeg"]}
                      setIsSubmitDisabled={setIsSubmitDisabled}
                      selectedFilesInParent={selectedFile ? [selectedFile] : []}
                      filePreviews={previews}
                      uploadIn={uploadIn}
                      onFilesUpload={handleFilesUploadToMedBill}
                      onFileRemove={handleFileRemove}
                    />
                  </Grid>
                  <Grid sx={{ marginTop: "1rem" }}>
                    <StyledButton
                      onClick={processMedbill}
                      disabled={isSubmitDisabled || loading}
                      startIcon={
                        loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <img
                            src={processclaim}
                            alt="process and claim icon"
                            style={{ height: 24 }}
                          />
                        )
                      }
                    >
                      {loading ? "Processing..." : "Process file"}
                    </StyledButton>
                  </Grid>
                </GlassyCard>
              </Grid>
            </>
          )}
        </AnimatePresence>
        <Snackbar
          open={snackbarOpen}
          anchorOrigin={{ vertical: "botom", horizontal: "right" }} // Top Center Position
          autoHideDuration={15000} // Automatically hide after 6 seconds if not closed earlier
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
      </Grid>
    </>
  );
};

export default MedBillFun;
