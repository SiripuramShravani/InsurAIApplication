import FileUpload from "../../components/FileUploadExtra.js";
import React, { useState, useCallback } from "react";
import { CircularProgress, Button, Typography, Grid } from "@mui/material";
import { styled } from "@mui/system";
import processclaim from "../../assets/processclaim.png";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import useNetworkStatus from "../../components/ErrorPages/UseNetworkStatus.js";
import { useNavigate } from "react-router-dom";
import PreviewError from "../../components/ErrorPages/PreviewError.js";
import WordPreviewImage from "../../assets/word_issue.png";
import { useTheme, useMediaQuery, Box } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import MarkdownDynamicRenderer from "./MarkDown.js";

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

const SummaryFun = () => {
  const theme = useTheme();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [uploadIn] = useState("portal");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [filePreview, setFilePreview] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [extractedSummary, setExtractedSummary] = useState("");
  const [accuracy, setAccuracy] = useState(0);

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const snackbarTimeoutRef = React.useRef(null);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleReset = () => {
    setExtractedSummary(null);
    setSelectedFile(null);
    setIsSubmitDisabled(true);
    setPreviews([]);
    setFilePreview(null);
    setLoading(false);
  };

  const handleFilesUploadToSummary = (selectedFiles, previews) => {
    setSelectedFile(selectedFiles[0]);
    setPreviews(previews);
    setIsSubmitDisabled(false);
  };

  const handleFileRemove = () => {
    handleReset();
  };

  const handleNetworkError = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  const { setNetworkError, SnackbarComponent } = useNetworkStatus({}, handleNetworkError);
  const processSummary = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const allowedFormats = [".pdf", ".doc", ".docx", "plain"];
      const allowedMimeTypes = [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/pdf",
        "text/plain",
      ];

      const fileExtension =
        "." + selectedFile.name.split(".").pop().toLowerCase();
      const fileType = selectedFile.type || "";
      if (
        !allowedFormats.includes(fileExtension) ||
        (!fileType && !allowedFormats.includes(fileExtension)) ||
        (!allowedMimeTypes.includes(fileType) && fileType)
      ) {
        alert(
          "Invalid file format. Please upload a PDF, DOC, DOCX, or TXT file."
        );
        setLoading(false);
        return;
      }
      snackbarTimeoutRef.current = setTimeout(() => {
        setSnackbarOpen(true);
      }, 1000);

      const response = await axiosInstance.post("AI/docai_summary/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      clearTimeout(snackbarTimeoutRef.current);
      setSnackbarOpen(false);
      console.log('accuracy==>>', response.accuracy)
      setAccuracy(response.data.accuracy);
      if (response && response.data) {
        setFilePreview(URL.createObjectURL(selectedFile));
        if (response.data.Extracted_summary) {
          setExtractedSummary(response.data.Extracted_summary);
        } else {
          alert(
            "No summary could be extracted from the provided file. Please try again."
          );
          setFilePreview(URL.createObjectURL(selectedFile));
        }
      } else {
        alert("Unexpected response from the server. Please try again later.");
      }
    } catch (error) {
      console.error("Error while processing summary:", error);
      clearTimeout(snackbarTimeoutRef.current);
      setSnackbarOpen(false);
      if (error.response) {
        const { status } = error.response;
        const errorMessage =
          error.response.data.message ||
          "A server error occurred. Please try again later.";
        const errorSource = error.response.data.api || "Unknown source";
        const userName = localStorage.getItem("userName");
        const fileName = selectedFile ? selectedFile.name : "No file uploaded";
        const fileType = selectedFile ? selectedFile.type : "Unknown type";
        setNetworkError({
          errorMessage: errorMessage,
          errorSource: errorSource,
          username: userName,
          fileName: fileName,
          fileType: fileType,
          status: status,
        });
      } else {
        alert(
          "A network or unexpected error occurred. Please check your connection and try again."
        );
      }
    } finally {
      setLoading(false);
      setSnackbarOpen(false);
    }
  };

  const downloadExtractedData = () => {
    const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    const userDetails =
      JSON.parse(localStorage.getItem("signinUserDetails")) || {};
    const userName = userDetails.user_name || "User";
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    const mainHeadingText = "DocAI™ Summary";
    doc.text(mainHeadingText, pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    const currentDate = new Date().toLocaleDateString();
    doc.text(`User_Name: ${userName}`, margin, 25);
    doc.text(
      currentDate,
      pageWidth - margin - doc.getTextWidth(currentDate),
      25
    );

    let yPosition = 35;
    const bulletGradients = [
      [1, 0, 102],
      [1, 0, 102],
      [1, 0, 102],
      [1, 0, 102],
      [1, 0, 102],
    ];

    const processContent = (markdown) => {
      markdown = markdown
        .replace(/\*\*\*(.*?)\*\*\*/g, "$1")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1");

      const lines = markdown.split("\n");
      let bulletIndex = 0;
      lines.forEach((line) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
          yPosition += 3;
          return;
        }
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = margin;
        }
        if (trimmedLine.startsWith("### ")) {
          const headerText = trimmedLine.replace("### ", "");
          const rectHeight = 12;
          doc.setFillColor(1, 0, 102);
          doc.rect(margin, yPosition - 6, contentWidth, rectHeight, "F");
          doc.setFontSize(14);
          doc.setFont(undefined, "bold");
          doc.setTextColor(255, 255, 255);
          doc.text(headerText, pageWidth / 2, yPosition + 2, {
            align: "center",
          });
          yPosition += 16;
        }
        else if (trimmedLine.match(/^\d+\.\s/)) {
          doc.setFontSize(12);
          const subheadingText = trimmedLine;
          const subheadingLines = doc.splitTextToSize(
            subheadingText,
            contentWidth - 10
          );
          const textHeight = subheadingLines.length * 6;
          const rectHeight = textHeight + 8;
          doc.setFillColor(1, 0, 102);
          doc.rect(margin, yPosition - 5, contentWidth, rectHeight, "F");
          doc.setFont(undefined, "bold");
          doc.setTextColor(255, 255, 255);
          subheadingLines.forEach((line, index) => {
            doc.text(line, margin + 5, yPosition + 2 + index * 6);
          });
          yPosition += rectHeight + 6;
        }
        else if (trimmedLine.startsWith("* ") || trimmedLine.startsWith("+ ")) {
          const bulletText = trimmedLine.substring(2);
          doc.setFontSize(11);
          doc.setFont(undefined, "normal");
          const textLines = doc.splitTextToSize(bulletText, contentWidth - 10);
          const textHeight = textLines.length * 6;
          const boxHeight = textHeight + 8;
          doc.setFillColor(255, 255, 255);
          doc.setDrawColor(230, 230, 230);
          doc.roundedRect(
            margin,
            yPosition - 4,
            contentWidth,
            boxHeight,
            2,
            2,
            "FD"
          );
          const bulletColor =
            bulletGradients[bulletIndex % bulletGradients.length];
          doc.setFillColor(bulletColor[0], bulletColor[1], bulletColor[2]);
          const bulletX = margin + 4;
          const bulletY = yPosition + 4;
          doc.circle(
            bulletX,
            bulletY - textHeight / textLines.length + 3,
            2,
            "F"
          );
          doc.setTextColor(51, 51, 51);
          const textX = bulletX + 6;
          textLines.forEach((line, index) => {
            doc.text(line, textX, yPosition + 2 + index * 6);
          });
          yPosition += boxHeight + 4;
          bulletIndex++;
        }
        else {
          doc.setFontSize(11);
          doc.setFont(undefined, "normal");
          doc.setTextColor(51, 51, 51);
          const lines = doc.splitTextToSize(trimmedLine, contentWidth);
          lines.forEach((line) => {
            doc.text(line, margin, yPosition);
            yPosition += 6;
          });
          yPosition += 2;
        }
      });
    };
    processContent(extractedSummary);
    if (accuracy) {
      yPosition += 10;
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("Confidence Factor:", margin, yPosition);
      doc.setFont(undefined, "normal");
      doc.text(
        `${accuracy}%`,
        margin + doc.getTextWidth("Confidence Factor: "),
        yPosition
      );
    }
    doc.save("DocAI-Summary.pdf");
  };
  return (
    <>
      <div>
        {SnackbarComponent()}
      </div>
      <Box sx={{ width: "100%", maxWidth: 1200, margin: "auto" }}>
        {!extractedSummary ? (
          <>
            <Typography
              className="Nasaliza"
              variant="h4"
              sx={{
                color: "#000166",
                fontWeight: 400,
                letterSpacing: "0.5px",
                lineHeight: 1.2,
                mb: 2,
                fontSize: { xs: "1.5rem", sm: "2rem", md: "1.7rem" },
                textAlign: "Center",
              }}
            >
              Upload Document
            </Typography>
            <FileUpload
              multiple={false}
              allowedFormats={[
                "pdf",
                "plain",
                "txt",
                "vnd.openxmlformats-officedocument.wordprocessingml.document",
              ]}
              setIsSubmitDisabled={setIsSubmitDisabled}
              selectedFilesInParent={selectedFile ? [selectedFile] : []}
              filePreviews={previews}
              uploadIn={uploadIn}
              onFilesUpload={handleFilesUploadToSummary}
              onFileRemove={handleFileRemove}
            />
            <Grid sx={{ marginTop: "1rem" }}>
              <StyledButton
                onClick={processSummary}
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
          </>
        ) : (
          <Grid container spacing={2} sx={{ height: "100%" }}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <Typography variant="h6">Document Preview</Typography>
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
                    />
                  ) : selectedFile?.type ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
                    <div
                      style={{
                        marginTop: isMobile ? "-50px" : "-100px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        border: "2px solid black",
                        padding: "20px",
                      }}
                    >
                      <img
                        src={WordPreviewImage}
                        alt="Word Document Preview"
                        style={{
                          width: "100%",
                          height: "auto",
                          marginTop: "80px",
                          marginBottom: "40px",
                        }}
                      />
                      <a
                        href={filePreview}
                        download={selectedFile.name}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "#007bff",
                          color: "white",
                          textDecoration: "none",
                          borderRadius: "5px",
                          fontWeight: "bold",
                          transition: "background-color 0.3s ease",
                          marginTop: "185px",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#0056b3")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#007bff")
                        }
                      >
                        Download Document
                      </a>
                    </div>
                  ) : selectedFile?.type === "text/plain" ? (
                    <div
                      style={{
                        marginTop: isMobile ? "-50px" : "-100px",
                        padding: "10px",
                        border: "2px solid black",
                        borderRadius: "5px",
                        overflowY: "auto",
                        maxHeight: isMobile ? "500px" : "700px",
                      }}
                    >
                      {extractedSummary}
                    </div>
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
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 0,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    marginBottom: "-32px",
                  }}
                >
                  Extracted Summary
                  <DownloadIcon
                    sx={{
                      cursor: "pointer",
                      color: "#3a7bd5",
                      "&:hover": { color: "#0056b3" },
                      fontSize: "1.5rem",
                      marginLeft: "550px",
                      marginTop: "-60px",
                    }}
                    onClick={downloadExtractedData}
                    titleAccess="Download Extracted Summary"
                  />
                </Typography>
              </Box>
              <Box
                className="summary-box"
                sx={{
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 3,
                  padding: 3,
                  maxHeight: "705px",
                  overflowY: "auto",
                  background:
                    "linear-gradient(145deg, #f0f4f8 0%, #e6eaf0 100%)",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  flexGrow: 1,
                }}
              >
                <div
                  id="summary-content"
                  style={{
                    userSelect: "text",
                    WebkitUserSelect: "text",
                  }}
                >
                  <MarkdownDynamicRenderer
                    extractedSummary={extractedSummary}
                  />
                  <Grid
                    container
                    spacing={2}
                    sx={{ marginTop: "1rem", alignItems: "center" }}
                  >
                    <Grid
                      item
                      xs={5}
                      sm={5}
                      md={5}
                      style={{
                        fontWeight: 550,
                        fontSize: 18,
                        textAlign: "left",
                      }}
                    >
                      Confidence Factor
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
                        textAlign: "left",
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {accuracy ? `${accuracy}%` : "0%"}
                    </Grid>
                  </Grid>
                </div>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: "botom", horizontal: "right" }}
        autoHideDuration={15000}
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
    </>
  );
};
export default SummaryFun;