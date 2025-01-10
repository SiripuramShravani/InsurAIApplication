import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useNetworkStatus from "../../components/ErrorPages/UseNetworkStatus.js";
import PreviewError from "../../components/ErrorPages/PreviewError.js";
import {
  Grid,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import FileUpload from "../../components/FileUploadExtra.js";
import axios from "axios";
import StyledButtonComponent from "../../components/StyledButton";
import processclaim from "../../assets/processclaim.png";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import idCard from "../../assets/id-card.png";
import { Snackbar, Alert } from "@mui/material";

export default function IDPIdCardfun() {
  /* eslint-disable no-unused-vars */
  const navigate = useNavigate();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accuracy, setAccuracy] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [displayValues, setDisplayValues] = useState({
    Persons__Info: {
      first_name: "First Name",
      last_name: "Last Name",
      date_of_birth: "Date of Birth",
      sex: "Sex",
      height: "Height",
      Eye_Color: "Eye Color",
      Weight: "Weight",
      hair_color: "Hair Color",
      address: "Address",
    },
    ID_Details: {
      real_id: "Real ID",
      document_type: "ID Type",
      document_number: "ID Number",
      issuance_date: "Issuance Date",
      expiration_date: "Expiration Date",
      class_type: "Driving Class",
      endorsements: "Endorsements",
      restrictions: "Restrictions",
    },
  });
  const [uploadedImage, setUploadedImage] = useState(null); // State to store the uploaded image

  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedFile, setSelectedFile] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [previewImage, setPrevieImage] = useState(false);
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const snackbarTimeoutRef = React.useRef(null); // Ref to manage the timeout
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings,
  });

  const handleFileRemove = (fileToRemove) => {
    setSelectedFile(null);
    // setPreviews([]);
    setLoading(false);
    setIsSubmitDisabled(true);
    // setFilePreview(null);
    const updatedFiles = selectedFiles.filter((file) => file !== fileToRemove);
    setSelectedFiles(updatedFiles);
    if (updatedFiles.length === 0) {
      setIsSubmitDisabled(true);
    }
  };

  const convertToTitleCase = (str) => {
    return str
      .replace(/([A-Z])/g, " $1") // Add space before capital letters (camelCase)
      .replace(/_/g, " ") // Replace underscores with spaces (snake_case)
      .replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
      ) // Capitalize first letter
      .trim(); // Remove leading/trailing spaces
  };
  const handleFilesUpload = (selectedFiles, previews) => {
    setSelectedFile(selectedFiles[0]);
    setPreviews(previews);
    setIsSubmitDisabled(false);
  };
  const Reupload = async () => {
    setIsSubmitDisabled(true);
    setLoading(false);
    setPrevieImage(false);
    setDisplayValues("");
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
  const processImage = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }
    setDisplayValues("");
    try {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        let imageData = e.target.result;

        setUploadedImage(imageData);

        if (imageData.startsWith("data:image/")) {
          imageData = imageData.split(",")[1];
        }

        let combinedPrompt = `Extract the following details from the original document:
 
real_id: value (carefully examine the card for the presence of a star icon located in the top right corner. This icon signifies that the ID has enhanced security features as mandated by the Real ID Act. If the star icon is present, indicate compliance by responding with "Yes", confirming that the ID card is a Real ID. Conversely, if the star icon is absent, respond with "No", indicating that the ID card does not meet Real ID standards. This assessment process is crucial for ensuring that identification documents adhere to the necessary security protocols)
First Name (FName): value (Name of the cardholder)
Last Name (LName): value (Name of the cardholder)
ID Type (DocType): value (e.g., Driver License,Operator License, Green Card, SSN, State Identity card(if the identity card was issued by the states then it is a State Identity card Type))
ID Number (DocNum): value (e.g., License number, Green Card number, SSN)
Date of Birth (DOB): value
Expiration Date (ExpDate): value (if available)
Address (Addr): value (Street number,Street Name,City,state,country,Zip(only 5 digits))
Height (Ht): value (e.g., 5'06")
Eye Color (EyeClr): value (e.g., BLK for Black)
Weight (Wt): value (if available)
Sex (Sex): value (e.g., M for Male)
Restrictions (Restrict/RES/REST/R): value (if applicable)
Issuance Date (IssueDate/issued Date): value (Date the license was issued)
Driving Class: value (e.g., Class D for passenger vehicles)
Endorsements (Endorse/END/E): value (if available)
Hair Color (HairClr): value (if available, e.g., BLK for Black)`;

        const result = await model.generateContent([
          combinedPrompt,
          {
            inlineData: {
              data: imageData,
              mimeType: selectedFile.type,
            },
          },
        ]);
        const geminiText = await result.response.text();
        setPrevieImage(true);
        setLoading(false);
        // Start the timeout to show the snackbar after 5 seconds
        snackbarTimeoutRef.current = setTimeout(() => {
          setSnackbarOpen(true); // Show snackbar if request takes more than 5 seconds
        }, 1000);
        try {
          const response = await axiosInstance.post("AI/id_card_extraction/", {
            extracted_text: geminiText,
            file_name: selectedFile.name,
            gemini_input_tokens: result.response.usageMetadata.promptTokenCount,
            gemini_output_tokens:
              result.response.usageMetadata.candidatesTokenCount,
            gemini_total_tokens: result.response.usageMetadata.totalTokenCount,
          });
          const data = response.data.extracted_json || {};
          setAccuracy(response.data.accuracy);

          // Define mappings for data keys
          const mappings = {
            Persons__Info: {
              first_name: "First Name",
              last_name: "Last Name",
              date_of_birth: "Date of Birth",

              Sex: "Sex",
              Height: "Height",
              Eye_Color: "Eye Color",
              Weight: "Weight",
              hair_color: "Hair Color",
              address: "Address",
            },

            ID_Details: {
              real_id: "Real ID",
              document_type: "ID Type",
              document_number: "ID Number",
              issuance_date: "Issuance Date",
              expiration_date: "Expiration Date",

              class_type: "Driving Class",
              endorsements: "Endorsements",
              restrictions: "Restrictions",
            },
          };

          // Helper function to map values
          const mapValues = (mapping, data) =>
            Object.fromEntries(
              Object.entries(mapping).map(([key, value]) => [
                value,
                data[key] || "",
              ])
            );

          // Map extracted data to structured values
          const displayValues = {
            Persons__Info: mapValues(mappings.Persons__Info, data),
            ID_Details: mapValues(mappings.ID_Details, data),
          };

          console.log("Formatted values:", displayValues);

          setDisplayValues(displayValues);
          // Clear timeout if the response arrives earlier than 5 seconds
          clearTimeout(snackbarTimeoutRef.current);
          setSnackbarOpen(false);
        } catch (err) {
          console.error("Error sending data to backend:", err);
          setLoading(false);
          // Clear timeout if the response arrives earlier than 5 seconds
          clearTimeout(snackbarTimeoutRef.current);
          setSnackbarOpen(false);
          // Check if the error response exists
          if (err.response) {
            const { status } = err.response; // Capture the status code
            const errorMessage =
              err.response.data.error ||
              "A server error occurred. Please try again later.";
            const errorSource = err.response.data.api || "Unknown source";
            const userName = localStorage.getItem("userName");
            const fileName = selectedFile
              ? selectedFile.name
              : "No file uploaded"; // Extract the file name
            const fileType = selectedFile ? selectedFile.type : "Unknown type"; // Extract the file type

            console.log("filetype: ", fileType);
            console.log("filename: ", fileName);
            console.log("Error Message: ", errorMessage);
            console.log("username: ", userName);
            console.log("status_code: ", status);
            console.log("errorSource: ", errorSource);

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
            setErrorMessage(err.message || "An unexpected error occurred.");
          }
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("There was an error processing the image:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        {/* Other component code */}
        {SnackbarComponent()} {/* Render the Snackbar from the hook */}
      </div>
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          {previewImage ? (
            <>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3} // Adds box shadow
                  sx={{
                    width: "100%",
                    maxWidth: 1000,
                    margin: "auto",
                    mt: 9,
                    borderRadius: 3,
                    p: 4,
                    backdropFilter: "blur(10px)",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)", // Blur effect for glass look
                    border: "1px solid rgba(255, 255, 255, 0.2)", // Custom box shadow
                    background: "transparent",
                    height: "550px",
                  }}
                >
                  {previewImage ? (
                    <>
                      <Typography
                        sx={{ color: "#001660", fontSize: "1.3rem" }}
                        className="Nasaliza"
                      >
                        Uploaded ID
                      </Typography>
                      <Box sx={{ marginTop: 4, textAlign: "center" }}>
                        <img
                          src={uploadedImage}
                          alt="Uploaded Document"
                          style={{
                            width: "350px",
                            maxWidth: "100%",
                            height: "auto",
                          }}
                        />
                      </Box>
                    </>
                  ) : (
                    <PreviewError />
                  )}
                  <Box sx={{ textAlign: "center", marginTop: 2 }}>
                    <StyledButtonComponent
                      variant="contained"
                      color="primary"
                      onClick={Reupload}
                      buttonWidth={150}
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
                      {loading ? "Uploading..." : "ReUpload"}
                    </StyledButtonComponent>
                  </Box>
                </Paper>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} md={12}>
                <Box
                  sx={{ borderTop: "3px solid #1976D2", paddingTop: "30px" }}
                  // elevation={3} // Adds box shadow
                  // sx={{
                  //     width: "100%",
                  //     maxWidth: 1000,
                  //     margin: "auto",
                  //     mt: 9,
                  //     borderRadius: 3,
                  //     p: 4,
                  //     backdropFilter: "blur(10px)", boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",// Blur effect for glass look
                  //     border: "1px solid rgba(255, 255, 255, 0.2)", // Custom box shadow
                  //     background: 'transparent',
                  // }}
                >
                  <Typography
                    sx={{
                      color: "#001660",
                      fontSize: "1.3rem",
                      marginBottom: "20px",
                    }}
                    className="Nasaliza"
                  >
                    Upload ID Document
                  </Typography>

                  <FileUpload
                    id="portal"
                    onFilesUpload={handleFilesUpload}
                    multiple={false}
                    allowedFormats={["png", "jpg", "jpeg"]}
                    setIsSubmitDisabled={setIsSubmitDisabled}
                    onFileRemove={handleFileRemove}
                  />
                  <Box sx={{ textAlign: "center", marginTop: 2 }}>
                    <StyledButtonComponent
                      variant="contained"
                      color="primary"
                      onClick={processImage}
                      buttonWidth={150}
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
                      {loading ? "Processing..." : "Process"}
                    </StyledButtonComponent>
                  </Box>
                </Box>
              </Grid>
            </>
          )}

          <Grid item xs={12} md={6}>
            {previewImage && displayValues && (
              <>
                <Paper
                  elevation={3} // Adds box shadow
                  sx={{
                    width: "100%",
                    maxWidth: 1000,
                    margin: "auto",
                    mt: 9,
                    borderRadius: 3,
                    p: 4,
                    backdropFilter: "blur(10px)",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)", // Blur effect for glass look
                    border: "1px solid rgba(255, 255, 255, 0.2)", // Custom box shadow
                    background: "transparent",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#001660",
                      fontSize: "1.5rem",
                      textTransform: "none",
                    }}
                    className="Nasaliza"
                  >
                    Extracted ID Details
                  </Typography>
                  <TableContainer
                    sx={{
                      margin: "auto",
                      border: "1px solid blue",
                      height: "450px",
                      overflowY: "auto",
                      paddingBottom: "1.3rem",
                    }}
                  >
                    <Table>
                      <TableBody>
                        {Object.entries(displayValues).map(
                          ([sectionKey, sectionData]) => (
                            <React.Fragment key={sectionKey}>
                              <TableRow
                                sx={{ borderBottom: "2px solid #1976D2" }}
                              >
                                <TableCell
                                  style={{
                                    fontWeight: "bold",
                                    color: "#001660",
                                    fontSize: "1rem",
                                    borderBottom: "2px solid #1976D2",
                                    width: "40%",
                                    marginBottom: "1rem",
                                  }}
                                  className="Nasaliza"
                                >
                                  {sectionKey === "ID_Details"
                                    ? "ID Details"
                                    : convertToTitleCase(sectionKey)}
                                </TableCell>
                              </TableRow>

                              {Object.entries(sectionData).map(
                                ([key, value]) => (
                                  <TableRow
                                    key={key}
                                    sx={{ borderBottom: "1px solid #1976D2" }}
                                  >
                                    <TableCell
                                      sx={{
                                        fontWeight: "bold",
                                        paddingBottom: "0px",
                                        paddingLeft: "1.3rem",
                                      }}
                                    >
                                      {key}
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        textAlign: "left",
                                        paddingBottom: "0px",
                                      }}
                                    >
                                      :
                                    </TableCell>
                                    <TableCell
                                      sx={{
                                        textAlign: "left",
                                        paddingBottom: "0px",
                                      }}
                                    >
                                      {value && value !== "N/A"
                                        ? value
                                        : "Not Found"}{" "}
                                      {/* Show 'None' if value is empty */}
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </React.Fragment>
                          )
                        )}
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            sx={{ padding: "5px 0" }}
                          ></TableCell>{" "}
                          {/* Spacer row */}
                        </TableRow>
                        <TableRow sx={{ borderTop: "3px solid #1976D2" }}>
                          <TableCell
                            sx={{
                              fontWeight: "bold",
                              paddingBottom: "0px",
                              paddingLeft: "1rem",
                            }}
                          >
                            Confidence Factor
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "left", paddingBottom: "0px" }}
                          >
                            :
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "left", paddingBottom: "0px" }}
                          >
                            {accuracy && accuracy !== "N/A"
                              ? `${accuracy}%`
                              : "Not Found"}{" "}
                            {/* Show 'None' if value is empty */}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </>
            )}
          </Grid>
        </Grid>
        <Snackbar
          open={snackbarOpen}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Top Center Position
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
      </Box>
    </>
  );
}
