import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip as ToolTip } from "@mui/material";
import {
  Grid,
  useTheme,
  useMediaQuery,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Backdrop,
  IconButton,
  Checkbox,
  Snackbar,
} from "@mui/material";
import {
  CheckCircle as ValidateIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import "../pagesstyles.css";
import "../services.css";
import StyledButtonComponent from "../../components/StyledButton";
import FileUpload from "../../components/FileUploadExtra.js";
import FileUploads from "../../components/fileupload.js";
import processclaim from "../../assets/processclaim.png";
import { Edit as EditIcon } from "@mui/icons-material";
import { pdfjs } from "react-pdf";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import useNetworkStatus from "../../components/ErrorPages/UseNetworkStatus.js";
import PreviewError from "../../components/ErrorPages/PreviewError.js";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const initialValues = {
  policy_number: "",
  claim_reported_by: "",
  loss_property: "",
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
  claim_witness_document_names: [],
  claim_witness_document_url: [],
  claim_witness_document_name_url: [],
  claim_process_document_name: [],
  claim_process_document_url: [],
  claim_process_document_name_url: [],
};

export default function AutoIDPfun() {
  const navigate = useNavigate();
  const [enableFields, setEnableFields] = useState(false);
  const [updateDisplay, setUpdateDisplay] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const uploadIn = "idp";
  const [selectedWitnessFiles, setSelectedWitnessFiles] = useState([]);
  const filesUploadedInChild = false;
  const [selectedProcessFile, setSelectedProcessFile] = useState([]);
  const [queryvalues, setQueryvalues] = useState(initialValues);
  const [displayValues, setDisplayValues] = useState({});
  const [afterProcess, setAfterProcess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [processSubmit, setProcessSubmit] = useState(false);
  const previews = [];
  const [hasEmptyOrInvalidValues, setHasEmptyOrInvalidValues] = useState(true);
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const TheamMedia = useTheme();
  const isMobile = useMediaQuery(TheamMedia.breakpoints.down("sm"));
  const [showAddress, setShowAddress] = useState(false);
  const [validatingAddress, setValidatingAddress] = useState(false);
  const [propertyAddressValidation, setPropertyAddressValidation] =
    useState("");
  const [suggestedAddress, setSuggestedAddress] = useState(null);
  const [spittedAddress, setSpittedAddress] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [validatedAddressKey, setValidatedAddressKey] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity] = useState("success");
  const [snackbarMessage] = useState("");
  const [accuracy, setAccuracy] = useState(0);
  const [snackbarOpen1, setSnackbarOpen1] = useState(false);
  const snackbarTimeoutRef = React.useRef(null); // Ref to manage the timeout

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true,
  });
  const UploadSection = () => {
    return (
      <Box
        elevation={3}
        sx={
          {
            //adjust accordingly
          }
        }
      >
        <Typography
          style={{
            fontSize: "1.1rem",
            color: "#010066",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Upload claim supporting documents
        </Typography>
        <FileUpload
          id="portal"
          onFilesUpload={handleWitnessFilesUploadToAWSByIDP}
          multiple={true}
          allowedFormats={[
            "png",
            "jpg",
            "jpeg",
            "plain",
            "pdf",
            "DOCX",
            "mp4",
            "msword",
          ]}
          setIsSubmitDisabled={setIsSubmitDisabled}
          selectedFilesInParent={selectedWitnessFiles}
          filePreviews={previews}
          filesUploadedInChild={filesUploadedInChild}
          uploadIn={uploadIn}
          onFileRemove={handlewitnessFileRemove}
        />
      </Box>
    );
  };

  const displayFile = (file) => {
    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          setFileType(file.type);
          setFileName(file.name);
          setFilePreview(URL.createObjectURL(file));
          // setFilePreview(null)
        } catch (error) {
          console.error("Error loading PDF preview:", error);
          setFilePreview(null); // No preview available
          setErrorMessage(
            "Unable to load document preview, please try again later."
          );
        }
      };
      reader.onerror = function () {
        console.error("Error reading the file.");
        setFilePreview(null); // No preview available
        setErrorMessage(
          "Unable to load document preview, please try again later."
        );
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("image/")) {
      try {
        setFileType(file.type);
        setFileName(file.name);
        setFilePreview(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error loading image preview:", error);
        setFilePreview(null); // No preview available
        setErrorMessage(
          "Unable to load document preview, please try again later."
        );
      }
    }
  };

  const [numPages, setNumPages] = useState(null);
  const handleUploadProcessDocument = async () => {
    setLoader(true);
    try {
      const file = selectedProcessFile[0];
      const category = "Auto";
      const formData = new FormData();

      formData.append("file", file); // Append the file
      formData.append("category", category);
      const responseData = await getExtractedDocumentJson(formData);
      setAccuracy(responseData.accuracy);
      if (responseData) {
        const extractedResponseData = responseData.extracted_data;
        console.log(
          "responseData.Validated_Address",
          responseData.Validated_Address
        );

        if (responseData.Validated_Address === "Address Not validated") {
          console.log("inside the condition");

          setPropertyAddressValidation(null);
        }
        const insurance_company_claim_storage_point =
          responseData.insurance_company_data.claim_storage_type;
        setQueryvalues(extractedResponseData);
        setQueryvalues((prevState) => ({
          ...prevState,
          claim_storage_type: insurance_company_claim_storage_point,
        }));
        const displayExtractedData = mapResponseToDisplayFields(
          extractedResponseData
        );
        setDisplayValues(displayExtractedData);
        setAfterProcess(true);
        setLoader(false);
      } else {
        console.error("API request did not return expected data.");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      setLoader(false);
    }
  };

  console.log("propertyAddressValidation", propertyAddressValidation);

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

  const getExtractedDocumentJson = async (formData) => {
    // Start the timeout to show the snackbar after 5 seconds
    snackbarTimeoutRef.current = setTimeout(() => {
      setSnackbarOpen1(true); // Show snackbar if request takes more than 5 seconds
    }, 1000);
    try {
      setLoader(true);
      const response = await axiosInstance.post("AI/process_file/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Clear the timeout if the response arrives earlier than 5 seconds
      clearTimeout(snackbarTimeoutRef.current);
      console.log("backend response", response);
      setSnackbarOpen1(false); // Ensure snackbar is closed
      localStorage.setItem("user", JSON.stringify(response.data.policy_data));
      localStorage.setItem(
        "company",
        JSON.stringify(response.data.insurance_company_data)
      );

      setLoader(false);
      return response.data;
    } catch (error) {
      setLoader(false);

      // Clear the timeout in case of an error
      clearTimeout(snackbarTimeoutRef.current);
      setSnackbarOpen1(false); // Ensure snackbar is closed

      // Check if the error response exists
      if (error.response) {
        const { status } = error.response; // Capture the status code
        const errorMessage =
          error.response.data.message ||
          "A server error occurred. Please try again later.";
        const errorSource = error.response.data.api || "Unknown source";
        const userName = localStorage.getItem("userName");
        // Get the file object from formData
        const file = formData.get("file"); // Change 'file' to your actual field name
        const fileName = file ? file.name : "No file uploaded"; // Extract the file name
        const fileType = file ? file.type : "Unknown type"; // Extract the file type
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
      return null;
    }
  };

  const cleanLocation = (location) => {
    return location
      .split(" ")
      .filter((part) => part !== "None")
      .join(" ")
      .trim();
  };

  const mapResponseToDisplayFields = (extractedResponseData) => {
    return {
      "Policy Number": extractedResponseData.policy_number,
      "Reported By": extractedResponseData.claim_reported_by,
      //   "Property Address": cleanLocation(extractedResponseData.address),
      "Loss Date and Time": extractedResponseData.loss_date_and_time,
      "Type of Loss": extractedResponseData.loss_type,
      "Loss Location of the Incident": cleanLocation(
        extractedResponseData.loss_location
      ),
      "Police/Fire Department Contacted?":
        extractedResponseData.police_fire_contacted === "None"
          ? "Flase"
          : extractedResponseData.police_fire_contacted
            ? "True"
            : "False",
      "Police Report Number": extractedResponseData.report_number,
      "Loss Description of the Incident":
        extractedResponseData.loss_damage_description,
      "Weather or Road Conditions at the Time": extractedResponseData.weather,
      "Vehicle Damage Description": extractedResponseData.Vehicle_damage_desc,
      "Claim Document": queryvalues.claim_process_document_name,
    };
  };

  const handleProcessFileRemove = () => {
    setQueryvalues(initialValues);
    setAfterProcess(false);
    setSelectedProcessFile([]);
    setDisplayValues({});
    setHasEmptyOrInvalidValues(true);
    setErrorMessage("");
    setEnableFields(false);
    setUpdateDisplay(false);
    setFilePreview(null);
    setPropertyAddressValidation("");
  };

  const handlewitnessFileRemove = (fileName) => {
    setSelectedWitnessFiles((prevFiles) => [
      ...prevFiles.filter((file) => file.name !== fileName),
    ]);
  };

  const handleWitnessFilesUploadToAWSByIDP = (selectedFiles, previews) => {
    // Proceed with setting files and updating state
    setSelectedWitnessFiles(selectedFiles);
    const claimWitnessDocumentNames = selectedFiles.map((file) => file.name);
    setQueryvalues((prevState) => ({
      ...prevState,
      claim_witness_document_names: claimWitnessDocumentNames,
    }));
  };

  const handleExtractClaimSubmit = (displayValues, queryvalues) => {
    setProcessSubmit(true);
    const formData = new FormData();
    formData.append(
      "policy_number",
      displayValues["Policy Number"] || queryvalues.policy
    );
    formData.append(
      "loss_date_and_time",
      displayValues["Loss Date and Time"] || queryvalues.loss_date_and_time
    );
    formData.append(
      "loss_type",
      displayValues["Type of Loss"] || queryvalues.loss_type
    );
    // formData.append(
    //   "loss_property",
    //   displayValues["Property Address"] || queryvalues.address
    // );
    formData.append(
      "loss_damage_description",
      displayValues["Loss Description of the Incident"] ||
      queryvalues.loss_damage_description
    );
    formData.append(
      "Weather or Road Conditions at the Time",
      displayValues["Weather or Road Conditions at the Time"] ||
      queryvalues.weather
    );
    formData.append(
      "Vehicle Damage Description",
      displayValues["Vehicle Damage Description"] ||
      queryvalues.Vehicle_damage_desc
    );
    formData.append(
      "loss_address",
      queryvalues.loss_address
        ? queryvalues.loss_address
        : queryvalues.street_number
          ? queryvalues.street_number
          : displayValues["Loss Location of the Incident"]
    );

    formData.append(
      "loss_street",
      queryvalues.loss_street
        ? queryvalues.loss_street
        : queryvalues.street_name
    );

    formData.append("loss_city", queryvalues.loss_city);
    formData.append("loss_state", queryvalues.loss_state);
    formData.append("loss_zip", queryvalues.loss_zip);
    formData.append("loss_country", queryvalues.loss_country);
    formData.append(
      "police_fire_contacted",
      displayValues["Police/Fire Department Contacted?"] ||
      queryvalues.police_fire_contacted
    );
    formData.append(
      "report_number",
      displayValues["Police Report Number"] || queryvalues.report_number
    );
    formData.append(
      "claim_reported_by",
      displayValues["Reported By"] ||
      queryvalues.reported_by ||
      queryvalues.claim_reported_by
    );
    formData.append("claim_storage_type", queryvalues.claim_storage_type);

    for (let i = 0; i < selectedProcessFile.length; i++) {
      formData.append("process_document", selectedProcessFile[i]);
    }
    for (let i = 0; i < selectedWitnessFiles.length; i++) {
      formData.append("witness_documents", selectedWitnessFiles[i]);
    }
    submitClaimDetails(formData);
  };

  const submitClaimDetails = async (formData) => {
    await axiosInstance
      .post("AI/add-idp-claim/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setProcessSubmit(false);
        navigate("/claimsuccess", { state: { claimID: response.data } });
        setSelectedProcessFile([]);
        selectedWitnessFiles([]);
        setQueryvalues(initialValues);
        setDisplayValues({});
      })
      .catch((error) => {
        setProcessSubmit(false);
        if (error.response) {
          setErrorMessage(error.response.statusText);
        } else if (error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An error occurred. Please try again later.");
        }
      });
  };

  const handleInputChange = (field, value) => {
    setDisplayValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
    setQueryvalues((prevValues) => ({
      ...prevValues,
      [field.toLowerCase().replace(/ /g, "_")]: value,
    }));
  };

  const handleSave = () => {
    setEnableFields(false);
    setShowAddress(false);
  };

  const handleFilesUploadToAWSByIDP = (selectedFiles, previews) => {
    setSelectedProcessFile(selectedFiles);
    setQueryvalues((prevValue) => ({
      ...prevValue,
      claim_process_document_name: selectedFiles[0].name,
    }));
    displayFile(selectedFiles[0]);
  };

  useEffect(() => {
    setHasEmptyOrInvalidValues(
      Object.values(displayValues).some((value) => !value) ||
      propertyAddressValidation === null
    );
  }, [updateDisplay, displayValues, propertyAddressValidation]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    return () => {
      if (filePreview && typeof filePreview === "string") {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  useEffect(() => {
    setHasEmptyOrInvalidValues(
      Object.values(displayValues).some((value) => !value) ||
      propertyAddressValidation === null
    );
  }, [displayValues, propertyAddressValidation]);

  const UploadDocument = useRef(null);

  const restrictedFields = ["Loss Location of the Incident"];

  const handleValidateAddress = async (key, sectionName) => {
    setValidatingAddress(true);
    setPropertyAddressValidation(null);
    const addressToValidate = displayValues[key];
    try {
      const response = await axiosInstance.post("validate_address/", {
        address: addressToValidate,
      });
      if (response.data.validated_address && response.data.splitted_address) {
        setSuggestedAddress(response.data.validated_address);
        setSpittedAddress(response.data.splitted_address);
        setShowAddress(true);
        setValidationError(null);
        setValidatedAddressKey(key);
      } else {
        if (key === "Loss Location of the Incident") {
          setPropertyAddressValidation(null);
        }
        setValidationError("Address is not valid. Please check your address.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Address validation error:", error);
      if (key === "Loss Location of the Incident") {
        setPropertyAddressValidation(null);
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

  const handleConfirmAddress = (spittedAddress, keys) => {
    if (keys === "Loss Location of the Incident") {
      setQueryvalues((prevValues) => ({
        ...prevValues,
        loss_address: spittedAddress.street_number || "",
        loss_street: spittedAddress.street_name || "",
        loss_city: spittedAddress.city || "",
        loss_state: spittedAddress.state || "",
        loss_zip: spittedAddress.zip_code || "",
        loss_country: spittedAddress.country || "",
      }));
      setDisplayValues((prevValues) => ({
        ...prevValues,
        [keys]: suggestedAddress,
      }));
      setPropertyAddressValidation("");
      setEditingAddress(false);
    }
    setShowAddress(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen1(false);
    setSnackbarOpen(false);
    setOpenSnackbar(false);
  };
  console.log("queryvalues", queryvalues);

  return (
    <>
      <div>
        {/* Other component code */}
        {SnackbarComponent()} {/* Render the Snackbar from the hook */}
      </div>
      <div ref={UploadDocument}>
        <Box sx={{ width: "100%", maxWidth: 1200, margin: "auto" }}>
          <Grid container id="grid">
            <Grid
              container
              spacing={2}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <Grid container spacing={2} paddingBottom={2}>
                <Box></Box>
                {/* First functionality (md=8) */}
                <Grid item xs={12} md={8}>
                  {!afterProcess ? (
                    <>
                      <Box
                        elevation={3}
                        sx={
                          {
                            // styles for the first Box
                          }
                        }
                      >
                        <Typography
                          style={{
                            fontSize: "1.1rem",
                            color: "#010066",
                            fontWeight: "bold",
                            textAlign: "center",
                            marginBottom: "10px",
                          }}
                        >
                          Upload your document to process the Claim
                        </Typography>

                        <FileUpload
                          id="idp"
                          onFilesUpload={handleFilesUploadToAWSByIDP}
                          multiple={false}
                          onFileRemove={handleProcessFileRemove}
                          selectedFilesInParent={selectedProcessFile}
                          allowedFormats={["png", "jpg", "pdf", "txt"]}
                          filesUploadedInChild={filesUploadedInChild}
                          setIsSubmitDisabled={setIsSubmitDisabled}
                          uploadIn={uploadIn}
                        />
                      </Box>

                      <Box textAlign="center" mt={4}>
                        <StyledButtonComponent
                          buttonWidth={200}
                          disableColor="#CCCCCC"
                          sx={{ marginBottom: "25px" }}
                          onClick={handleUploadProcessDocument}
                          disabled={
                            selectedProcessFile.length === 0 ||
                            loader === true ||
                            afterProcess === true
                          }
                        >
                          {loader ? (
                            <CircularProgress
                              size={24}
                              style={{ color: "white" }}
                            />
                          ) : (
                            <>
                              <img
                                src={processclaim}
                                alt="process and claim icon"
                                style={{
                                  height: 38,
                                  paddingRight: 10,
                                }}
                              />
                              Process
                            </>
                          )}
                        </StyledButtonComponent>
                      </Box>
                    </>
                  ) : null}
                </Grid>

                {/* Second functionality (md=4) */}
                {!afterProcess && (
                  <Grid item xs={12} md={4}>
                    {UploadSection()}
                  </Grid>
                )}
                <Grid
                  container
                  spacing={2}
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "stretch",
                  }}
                >
                  {/* Uploaded Document (md=6) */}
                  {afterProcess && (
                    <Grid item xs={12} md={6}>
                      <Box
                        elevation={3}
                        sx={{
                          height: "100%",
                          width: "100%",
                          maxWidth: 1000,
                          borderRadius: 3,
                          p: 2,
                          backdropFilter: "blur(10px)",
                          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          background: "transparent",
                          margin: "auto",
                          marginLeft: "20px",
                        }}
                      >
                        <Typography
                          style={{
                            fontSize: "1.2rem",
                            color: "#010066",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Uploaded Document
                        </Typography>
                        <Grid style={{ maxWidth: 600, margin: "auto" }}>
                          <Card
                            variant="outlined"
                            sx={{ border: "1px solid blue", height: "530px" }}
                          >
                            <CardContent>
                              <Typography variant="h6" component="h2">
                                {fileName}
                              </Typography>
                              {fileType.startsWith("image/") &&
                                (filePreview ? (
                                  <img
                                    src={filePreview}
                                    alt={fileName}
                                    style={{ maxWidth: "100%", height: "auto" }}
                                  />
                                ) : (
                                  <PreviewError />
                                ))}
                              {fileType === "application/pdf" &&
                                (filePreview ? (
                                  <iframe
                                    title={fileName}
                                    src={filePreview}
                                    width="100%"
                                    height="600px"
                                  />
                                ) : (
                                  <PreviewError />
                                ))}
                            </CardContent>
                          </Card>
                        </Grid>
                        <Box mt={2} textAlign="center">
                          <StyledButtonComponent
                            buttonWidth={250}
                            onClick={() => {
                              handleProcessFileRemove();
                              setAfterProcess(false);
                              setSelectedWitnessFiles();
                            }}
                          >
                            Upload Document
                          </StyledButtonComponent>
                        </Box>
                        <Grid xs={12} ms={6}>
                          <FileUploads
                            id="portal"
                            onFilesUpload={handleWitnessFilesUploadToAWSByIDP}
                            multiple={true}
                            allowedFormats={[
                              "png",
                              "jpg",
                              "jpeg",
                              "plain",
                              "pdf",
                              "DOCX",
                              "mp4",
                              "msword",
                            ]}
                            setIsSubmitDisabled={setIsSubmitDisabled}
                            selectedFilesInParent={selectedWitnessFiles}
                            filePreviews={previews}
                            filesUploadedInChild={filesUploadedInChild}
                            uploadIn={uploadIn}
                            onFileRemove={handlewitnessFileRemove}
                          />
                        </Grid>
                      </Box>
                    </Grid>
                  )}

                  <Grid
                    item
                    md={6}
                    margin={isMobile ? "0rem 1rem " : "0rem 0rem"}
                  >
                    <Grid container>
                      <Grid className="idp-fetch-container">
                        {afterProcess === true ? (
                          <Box
                            elevation={3}
                            sx={{
                              height: "100%",
                              width: "100%",
                              maxWidth: 1000,
                              margin: "auto",
                              marginLeft: "20px",
                              // marginTop: "10px",

                              borderRadius: 3,
                              p: 2,
                              backdropFilter: "blur(10px)",
                              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                              background: "transparent",
                            }}
                          >
                            <Typography
                              style={{
                                fontSize: "1.2rem",
                                color: "#010066",
                                fontWeight: "bold",
                                textAlign: "center",
                              }}
                            >
                              {" "}
                              Extracted Auto claim FNOL details.
                            </Typography>
                            <Grid className="fetch-idp-data">
                              {hasEmptyOrInvalidValues && (
                                <Typography
                                  style={{
                                    color: "red",
                                    marginBottom: "10px",
                                    textAlign: "center",
                                  }}
                                >
                                  Please provide mandatory details in the
                                  document to claim the policy.
                                </Typography>
                              )}
                              {!updateDisplay ? (
                                <>
                                  {/* <AccuracyDisplay accuracy={accuracy} /> */}
                                  <Typography
                                    variant="h5"
                                    className="ipd-titles Nasaliza"
                                    sx={{
                                      borderBottom: "2px solid #1976D2",
                                      display: "inline-block",
                                      width: "100%",
                                      marginBottom: "20px",
                                      textAlign: "left",
                                    }}
                                  >
                                    Policy Details
                                  </Typography>
                                  <Grid
                                    container
                                    spacing={2}
                                    style={{
                                      marginBottom: "7px",
                                      marginLeft: isMobile ? "0" : "15px",
                                    }}
                                  >
                                    {Object.entries(displayValues)
                                      .filter(
                                        ([key]) =>
                                          key === "Policy Number" ||
                                          //   key === "Property Address" ||
                                          key === "Claim Document"
                                      )
                                      .map(([key, value]) => (
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
                                            <span
                                              style={{
                                                fontWeight: 500,
                                                fontSize: 13,
                                                wordWrap: "break-word",
                                                whiteSpace: "normal",
                                              }}
                                            >
                                              {value && value !== "None" ? (
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
                                          </Grid>
                                        </React.Fragment>
                                      ))}
                                  </Grid>
                                  <Typography
                                    variant="h5"
                                    className="ipd-titles Nasaliza"
                                    sx={{
                                      borderBottom: "2px solid #1976D2",
                                      display: "inline-block",
                                      width: "100%",
                                      marginBottom: "20px",
                                      textAlign: "left",
                                    }}
                                  >
                                    Loss Details
                                  </Typography>
                                  <Grid
                                    container
                                    spacing={2}
                                    style={{
                                      marginBottom: "7px",
                                      marginLeft: isMobile ? "0" : "15px",
                                    }}
                                  >
                                    {Object.entries(displayValues)
                                      .filter(([key]) =>
                                        [
                                          "Loss Date and Time",
                                          "Loss Location of the Incident",
                                          "Type of Loss",
                                          "Loss Description of the Incident",
                                          "Weather or Road Conditions at the Time",
                                          "Vehicle Damage Description",
                                        ].includes(key)
                                      )
                                      .map(([keys, value]) => {
                                        const isRestricted =
                                          restrictedFields.includes(keys);
                                        const showSuggestedAddress =
                                          showAddress &&
                                          suggestedAddress &&
                                          validatedAddressKey === keys;
                                        return (
                                          <React.Fragment key={keys}>
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
                                              {keys}
                                              {isRestricted &&
                                                keys ===
                                                "Loss Location of the Incident" && (
                                                  <>
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
                                                              marginLeft:
                                                                "0.5rem",
                                                              color: "#010066",
                                                            }}
                                                            onClick={() => {
                                                              setEditingAddress(
                                                                true
                                                              );
                                                              setPropertyAddressValidation(
                                                                null
                                                              );
                                                            }}
                                                          >
                                                            <EditIcon fontSize="small" />
                                                          </IconButton>
                                                        </ToolTip>
                                                      )}
                                                    <ToolTip
                                                      title={
                                                        validatingAddress
                                                          ? "Validating..."
                                                          : propertyAddressValidation ===
                                                            "" && value
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
                                                          "" && value ? (
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
                                                    {editingAddress &&
                                                      propertyAddressValidation !==
                                                      true && (
                                                        <StyledButtonComponent
                                                          buttonWidth={80}
                                                          size="small"
                                                          sx={{ marginLeft: 2 }}
                                                          onClick={() =>
                                                            handleValidateAddress(
                                                              keys,
                                                              "Loss Location of the Incident"
                                                            )
                                                          }
                                                          disabled={
                                                            value === null
                                                          }
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
                                              {keys ===
                                                "Loss Location of the Incident" ? (
                                                editingAddress ? (
                                                  <TextField
                                                    sx={{
                                                      "& .MuiOutlinedInput-root":
                                                      {
                                                        height: "35px",
                                                        backgroundColor:
                                                          "none",
                                                      },
                                                    }}
                                                    variant="outlined"
                                                    required
                                                    name={keys}
                                                    value={displayValues[keys]}
                                                    onChange={(e) =>
                                                      handleInputChange(
                                                        keys,
                                                        e.target.value
                                                      )
                                                    }
                                                  />
                                                ) : (
                                                  <span
                                                    style={{
                                                      textAlign: "left",
                                                      fontWeight: 500,
                                                      fontSize: 13,
                                                    }}
                                                  >
                                                    {value ? (
                                                      <>
                                                        {value}
                                                        {keys ===
                                                          "Loss Location of the Incident" &&
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
                                                            Address not
                                                            validated
                                                          </span>
                                                        ) : null}
                                                      </>
                                                    ) : (
                                                      <span
                                                        style={{
                                                          textAlign: "left",
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
                                              ) : enableFields ? (
                                                <TextField
                                                  sx={{
                                                    "& .MuiOutlinedInput-root":
                                                    {
                                                      height: "35px",
                                                      backgroundColor: "none",
                                                    },
                                                  }}
                                                  variant="outlined"
                                                  required
                                                  name={keys}
                                                  value={displayValues[keys]}
                                                  onChange={(e) =>
                                                    handleInputChange(
                                                      keys,
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              ) : (
                                                <span
                                                  style={{
                                                    textAlign: "left",
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
                                            {showSuggestedAddress && (
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
                                                <Grid item xs={6.5}></Grid>
                                                <Grid
                                                  item
                                                  xs={5.5}
                                                  sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <Typography
                                                    variant="caption"
                                                    sx={{
                                                      color: "#0B70FF",
                                                      mr: 1,
                                                    }}
                                                  >
                                                    {suggestedAddress}
                                                  </Typography>
                                                  <Checkbox
                                                    color="primary"
                                                    onChange={(e) => {
                                                      if (e.target.checked) {
                                                        handleConfirmAddress(
                                                          spittedAddress,
                                                          keys
                                                        );
                                                      }
                                                    }}
                                                  />
                                                </Grid>
                                              </Grid>
                                            )}
                                          </React.Fragment>
                                        );
                                      })}
                                  </Grid>
                                  <Typography
                                    variant="h5"
                                    className="ipd-titles Nasaliza"
                                    sx={{
                                      borderBottom: "2px solid #1976D2",
                                      display: "inline-block",
                                      width: "100%",
                                      marginBottom: "20px",
                                      textAlign: "left",
                                    }}
                                  >
                                    Report Details
                                  </Typography>
                                  <Grid
                                    container
                                    spacing={2}
                                    style={{
                                      marginBottom: "20px",
                                      marginLeft: isMobile ? "0" : "15px",
                                    }}
                                  >
                                    {Object.entries(displayValues)
                                      .filter(([key]) =>
                                        [
                                          "Reported By",
                                          "Police Report Number",
                                          "Police/Fire Department Contacted?",
                                        ].includes(key)
                                      )
                                      .map(([key, value]) => (
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
                                            style={{
                                              textAlign: "left",
                                              wordWrap: "break-word",
                                              whiteSpace: "normal",
                                            }}
                                          >
                                            {enableFields ? (
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
                                                value={displayValues[key]}
                                                onChange={(e) =>
                                                  handleInputChange(
                                                    key,
                                                    e.target.value
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
                                                  value === "None" ? (
                                                    "Not Found"
                                                  ) : (
                                                    value
                                                  )
                                                ) : (
                                                  <span
                                                    style={{
                                                      color: "red",
                                                      fontWeight: 500,
                                                      fontSize: 13,
                                                    }}
                                                  >
                                                    {`${key} required`}
                                                  </span>
                                                )}
                                              </span>
                                            )}
                                          </Grid>
                                        </React.Fragment>
                                      ))}
                                  </Grid>
                                  <Typography
                                    variant="h5"
                                    className="ipd-titles Nasaliza"
                                    sx={{
                                      borderBottom: "2px solid #1976D2",
                                      display: "inline-block",
                                      width: "100%",
                                      marginBottom: "20px",
                                      textAlign: "left",
                                    }}
                                  >
                                    Involved Parties
                                  </Typography>
                                  <Grid
                                    container
                                    spacing={2}
                                    style={{
                                      marginBottom: "20px",
                                      marginLeft: isMobile ? "0" : "15px",
                                    }}
                                  >
                                    {/* Fields for Primary Information */}
                                    {[
                                      "Name",
                                      "Contact Number",
                                      "Email",
                                      "Insurance Details",
                                    ].map((field) => (
                                      <React.Fragment key={field}>
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
                                          {field}
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
                                          {enableFields ? (
                                            <TextField
                                              sx={{
                                                "& .MuiOutlinedInput-root": {
                                                  height: "35px",
                                                  backgroundColor: "none",
                                                },
                                              }}
                                              variant="outlined"
                                              required
                                              name={field}
                                              value={displayValues[field]}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  field,
                                                  e.target.value
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
                                              {displayValues[field] ? (
                                                displayValues[field] ===
                                                  "None" ? (
                                                  "Not Found"
                                                ) : (
                                                  displayValues[field]
                                                )
                                              ) : (
                                                <span
                                                  style={{
                                                    color: "red",
                                                    fontWeight: 500,
                                                    fontSize: 13,
                                                  }}
                                                >
                                                  {`${field} required`}
                                                </span>
                                              )}
                                            </span>
                                          )}
                                        </Grid>
                                      </React.Fragment>
                                    ))}

                                    {/* Fields for Passenger Information */}
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        marginTop: "20px",
                                        fontWeight: 600,
                                        textAlign: "left",
                                        width: "100%",
                                      }}
                                    >
                                      Information of Passengers (if applicable)
                                    </Typography>
                                    {[
                                      "Names",
                                      "Contact Number",
                                      "Email",
                                      "Injuries (if any)",
                                    ].map((subField) => (
                                      <React.Fragment key={subField}>
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
                                          {subField}
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
                                          {enableFields ? (
                                            <TextField
                                              sx={{
                                                "& .MuiOutlinedInput-root": {
                                                  height: "35px",
                                                  backgroundColor: "none",
                                                },
                                              }}
                                              variant="outlined"
                                              name={subField}
                                              value={displayValues[subField]}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  subField,
                                                  e.target.value
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
                                              {displayValues[subField] ||
                                                "Not Found"}
                                            </span>
                                          )}
                                        </Grid>
                                      </React.Fragment>
                                    ))}
                                  </Grid>
                                  <Typography
                                    variant="h5"
                                    className="ipd-titles Nasaliza"
                                    sx={{
                                      borderBottom: "2px solid #1976D2",
                                      display: "inline-block",
                                      width: "100%",
                                      marginBottom: "20px",
                                      textAlign: "left",
                                    }}
                                  ></Typography>
                                  <Grid
                                    container
                                    spacing={2}
                                    style={{
                                      marginBottom: "20px",
                                      marginLeft: isMobile ? "0" : "15px",
                                    }}
                                  >
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
                                  {enableFields ? (
                                    <StyledButtonComponent
                                      buttonWidth={100}
                                      onClick={handleSave}
                                    >
                                      Save
                                    </StyledButtonComponent>
                                  ) : (
                                    <StyledButtonComponent
                                      buttonWidth={100}
                                      onClick={() => setEnableFields(true)}
                                      startIcon={<EditIcon />}
                                    >
                                      Edit
                                    </StyledButtonComponent>
                                  )}
                                </Grid>
                                <Grid item>
                                  <StyledButtonComponent
                                    buttonWidth={150}
                                    disableColor={"#B6E3FF"}
                                    onClick={() =>
                                      handleExtractClaimSubmit(
                                        displayValues,
                                        queryvalues
                                      )
                                    }
                                    disabled={
                                      hasEmptyOrInvalidValues ||
                                      enableFields ||
                                      editingAddress
                                    }
                                  >
                                    Submit Claim
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
                          </Box>
                        ) : (
                          <Grid></Grid>
                        )}
                        <Grid marginBottom={"2rem"}></Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
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
        <Snackbar
          open={snackbarOpen1}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Top Center Position
          autoHideDuration={15000} // Automatically hide after 5 seconds if not closed earlier
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
      </div>
    </>
  );
}
