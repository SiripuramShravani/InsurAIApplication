import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  forwardRef,
} from "react";
import { useDropzone } from "react-dropzone";
import FileUploads from "../assets/FileUpload.png";
import {
  Grid,
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
 import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import SelectedPDF from "../assets/SelectedPDF.png";
import SelectedDOCX from "../assets/SelectedDOCX.png";
import SelectedTXT from "../assets/SelectedTXT.png";
import SelectedDOC from "../assets/SelectedDOC.png";
import SelectedJPG from "../assets/SelectedJPG.png";
import SelectedPNG from "../assets/SelectedPNG.png";
import SelectedJPEG from "../assets/SelectedJPEG.png";
 
const FileUpload = forwardRef(
  (
    {
      onFilesUpload,
      onFileRemove,
      multiple,
      allowedFormats,
      setIsSubmitDisabled,
      selectedFilesInParent,
      filePreviews,
      filesUploadedInChild,
      uploadIn,
      id,
    },
    ref
  ) => {
    const [previews, setPreviews] = useState(filePreviews);
    const [selectedFiles, setSelectedFiles] = useState(selectedFilesInParent);
    const [filesUploaded, setFilesUploaded] = useState(filesUploadedInChild);
    const [uploads, setUploads] = useState([]);
    const [deleted, setDeleted] = useState(false);
    const fileInputRef = useRef(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
 
    const handleClearAllFiles = () => {
      setPreviews([]);
      setSelectedFiles([]);
      setUploads([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsSubmitDisabled(true);
    };

    // Expose the clear method through ref
    React.useImperativeHandle(ref, () => ({
      handleClearAllFiles,
    }));

    const isFormatAllowed = (file) => {
      console.log('file',file)
      const fileType = file.type.split("/")[1];
      console.log('type',fileType)
      return allowedFormats ? allowedFormats.includes(fileType) : true;
    };

    useEffect(() => {
      // Simulate upload progress for selected files
      if (selectedFiles) {
        const newUploads = selectedFiles.map((file, index) => ({
          name: file.name,
          size: file.size,
          progress: 0,
          status: "uploading",
          id: index,
        }));
        setUploads(newUploads);

        // Simulate progress
        newUploads.forEach((file) => {
          const interval = setInterval(() => {
            setUploads((prevUploads) =>
              prevUploads.map((upload) => {
                if (upload.id === file.id) {
                  const newProgress = upload.progress + 10;
                  if (newProgress >= 100) {
                    clearInterval(interval);
                    return { ...upload, progress: 100, status: "success" };
                  }
                  return { ...upload, progress: newProgress };
                }
                return upload;
              })
            );
          }, 50);
        });
      }
    }, [selectedFiles]);

    const onDrop = useCallback(
      async (acceptedFiles) => {
        if (
          !multiple &&
          selectedFiles &&
          acceptedFiles &&
          selectedFiles.length + acceptedFiles.length > 1
        ) {
          alert("Please select only one file");
          return;
        }

        if (
          selectedFiles?.length &&
          acceptedFiles &&
          selectedFiles.length + acceptedFiles.length > 10
        ) {
          alert("You can only upload up to 10 files.");
          return;
        }

        if (multiple && acceptedFiles.length > 10) {
          alert("You can only upload up to 10 files.");
          return;
        }

        const maxSizeAllowed = (fileType) => {
          if (
            fileType === "image/png" ||
            fileType === "image/jpeg" ||
            fileType === "image/jpg"
          ) {
            return {
              maxSize: 5 * 1024 * 1024,
              fileType: "PNG, JPG & JPEG images",
            };
          } else if (
            fileType === "application/pdf" ||
            fileType ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
            return {
              maxSize: 5 * 1024 * 1024,
              fileType: "PDFs and DOCX files",
            };
          } else if (fileType.startsWith("video")) {
            return { maxSize: 100 * 1024 * 1024, fileType: "videos" };
          } else if (fileType === "text/plain") {
            return { maxSize: 1 * 1024 * 1024, fileType: "Text files" };
          } else {
            return null;
          }
        };

        const invalidFiles = acceptedFiles.filter(
          (file) => !isFormatAllowed(file)
        );
        const sizeExceedingFiles = acceptedFiles.filter((file) => {
          const maxSize = maxSizeAllowed(file.type);
          return maxSize && file.size > maxSize.maxSize;
        });

        if (invalidFiles.length > 0) {
          const invalidFormats = invalidFiles
            .map((file) => file.name)
            .join(", ");
          alert(
            `Invalid file formats! Allowed formats: ${allowedFormats.join(
              ", "
            )}. Invalid files: ${invalidFormats}`
          );
          return;
        }

        if (sizeExceedingFiles.length > 0) {
          const exceedingFiles = sizeExceedingFiles
            .map((file) => file.name)
            .join(", ");
          const exceedingFormats = sizeExceedingFiles
            .map((file) => file.type)
            .join(", ");
          alert(
            `Selected Files: ${exceedingFiles} size exceeds the maximum limit for the following formats: ${exceedingFormats}. Maximum allowed size for .png, .jpg, .jpeg, .pdf, .docx -> 5 MB, Video -> 100 MB, .txt -> 1 MB`
          );
          return;
        }

        const newFilePreviews = await Promise.all(
          acceptedFiles.map((file) => readFile(file))
        );
        setPreviews((prevPreviews) => {
          if (!Array.isArray(prevPreviews)) {
            prevPreviews = [];
          }
          return [...prevPreviews, ...newFilePreviews];
        });

        setSelectedFiles((prevFiles) => {
          if (!Array.isArray(prevFiles)) {
            prevFiles = [];
          }
          return [...prevFiles, ...acceptedFiles];
        });
        // setIsSubmitDisabled(true);
        setIsSubmitDisabled(false);
      },
      // eslint-disable-next-line
      [selectedFiles, multiple, allowedFormats, setIsSubmitDisabled]
    );

    const readFile = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ file, preview: reader.result });
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    };

    const handleRemoveFile = (event, fileName) => {
      event.stopPropagation(); // Prevent event from bubbling up to the dropzone
      console.log(fileName);
      setDeleted(false);
      setPreviews((prevPreviews) => [
        ...prevPreviews.filter((preview) => preview.file.name !== fileName),
      ]);
      setSelectedFiles((prevFiles) => [
        ...prevFiles.filter((file) => file.name !== fileName),
      ]);
      setFilesUploaded(false);
      onFileRemove(fileName);
      if (id === "idp") {
        onFileRemove();
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsSubmitDisabled(true);
    };

    // console.log(selectedFiles);

    useEffect(() => {
      if (selectedFiles && selectedFiles.length === 0) {
        setIsSubmitDisabled(false);
      }
    }, [selectedFiles, setIsSubmitDisabled]);

    useEffect(() => {
      if (selectedFiles && selectedFiles.length > 0 && !filesUploaded) {
        handleSelectedFilesUploadToParent(selectedFiles, previews);
      }
      // eslint-disable-next-line
    }, [selectedFiles, previews, filesUploaded]);

    const handleSelectedFilesUploadToParent = (selectedFiles, previews) => {
      setIsSubmitDisabled(false);
      onFilesUpload(selectedFiles, previews);
      setDeleted(true);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
    });
    const generateSupportedFormatsString = (formats) => {
      return Object.values(formats).join(", ") + " (5mb each)";
    };
    const handleDragOver = (event) => {
      event.preventDefault();
      setIsDragOver(true);
    };

    const handleDragEnter = (event) => {
      event.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = () => {
      setIsDragOver(false);
    };

    const handleDrop = (event) => {
      event.preventDefault();
      setIsDragOver(false);
      const files = event.dataTransfer?.files;
      if (files) {
        handleFileUpload({ target: { files } });
      }
    };
    const handleFileUpload = (event) => {
      const selectedFiles = event.target.files || event.dataTransfer?.files;

      if (selectedFiles) {
        const newFiles = Array.from(selectedFiles).map((file) => {
          return {
            name: trimFileName(file.name),
            //   icon: getFileIcon(file),
            progress: 0, // Initialize progress
            id: file.name + Date.now(), // Unique ID to ensure each file is distinct
          };
        });

        setFiles([...files, ...newFiles]);

        setUploading(true); // Start the upload process
        simulateUpload(newFiles);
      }
    };

    // Limit file name length
    const trimFileName = (fileName) => {
      const maxLength = 10; // Fixed to 10 characters
      const extensionIndex = fileName.lastIndexOf(".");
      const extension =
        extensionIndex !== -1 ? fileName.substring(extensionIndex) : "";

      let baseName =
        extensionIndex !== -1
          ? fileName.substring(0, extensionIndex)
          : fileName;

      if (baseName.length > maxLength) {
        baseName = baseName.substring(0, maxLength); // Limit to 10 characters
      }

      return baseName + extension;
    };
    // Simulate the file upload process with progress
    const simulateUpload = (newFiles) => {
      let counter = 0;
      let currentFileIndex = files.length; // Start from the next file

      const interval = setInterval(() => {
        if (counter >= 100) {
          setFiles((prevFiles) => {
            const updatedFiles = [...prevFiles];

            if (updatedFiles[currentFileIndex]) {
              updatedFiles[currentFileIndex].progress = 100; // Set progress to 100 for current file
            }

            return updatedFiles;
          });
          currentFileIndex++;

          if (currentFileIndex >= files.length + newFiles.length) {
            clearInterval(interval);
            setUploading(false); // Stop the loading once the upload is done
          } else {
            counter = 0; // Reset progress for next file
          }
        } else {
          counter += 20;
          setFiles((prevFiles) => {
            const updatedFiles = [...prevFiles];

            // Only update progress if the file exists
            if (updatedFiles[currentFileIndex]) {
              updatedFiles[currentFileIndex].progress = counter;
            }

            return updatedFiles;
          });
        }
      }, 200);
    };
    const getFileTypeImage = (fileName) => {
      const extension = fileName.split(".").pop().toLowerCase();

      switch (extension) {
        case "pdf":
          return SelectedPDF;
        case "docx":
          return SelectedDOCX;
        case "doc":
          return SelectedDOC;
        case "txt":
          return SelectedTXT;
        case "jpg":
          return SelectedJPG;
        case "jpeg":
          return SelectedJPEG;
        case "png":
          return SelectedPNG;
        default:
          return SelectedPDF; // Use a fallback image, e.g., PDF, for unsupported formats.
      }
    };

    return (
      <>
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed #1976d2",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            minHeight: "45vh",
            backgroundColor: "#f7f9fc",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            // display: "flex",
            // flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            "&:hover": {
              backgroundColor: "#eef4fc",
            },
            borderColor: isDragActive ? "#1976d2" : "#90caf9",
          }}
        >
          <Grid
            style={{
              textAlign: "center",
              marginTop: "15px",
              borderRadius: 2,
              padding: "10px",
              cursor: "pointer",
              overflowY: uploads.length > 2 ? "auto" : "hidden",
              maxHeight: uploads.length > 2 ? "250px" : "auto",
            }}
          >
            <input {...getInputProps()} />
            {!filesUploaded &&
              (isDragActive ? (
                <Typography>Drop the files here ...</Typography>
              ) : (
                <>
                  <label htmlFor="file-input">
                    <img
                      src={FileUploads}
                      alt="Example"
                      style={{
                        width: "300px",
                        borderRadius: "8px",
                        marginTop: "-20px",
                      }}
                    />
                    <Typography variant="h6" sx={{ color: "#1976d2" }}>
                      Drag and drop files here or <b>browse</b>
                    </Typography>
                    <Typography style={{ fontSize: "0.7rem" }}>
                      Supported Format:{" "}
                      {generateSupportedFormatsString(allowedFormats)}
                    </Typography>
                  </label>
                </>
              ))}
          </Grid>
        </Box>

        {/* Uploaded Files Box - Only appears when files are present */}
        {uploads.length > 0 && (
          <Box
            sx={{
              border: "2px solid #1976d2",
              borderRadius: 2,
              p: 3,
              mt: 2,
              backgroundColor: "#f7f9fc",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              maxHeight: "200px", // Set a max height to enable scrolling
              overflowY: "auto", // Enable vertical scrolling
            }}
          >
            {uploads.map((file, index) => (
              <Box
                key={index}
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                {/* File Type Image */}
                <Box sx={{ mr: 2 }}>
                  <img
                    src={getFileTypeImage(file.name)}
                    alt="File Type"
                    style={{ width: "40px", height: "40px" }}
                  />
                </Box>

                {/* File Name and Size */}
                <Typography variant="body1" sx={{ flex: 1, textAlign: "left" }}>
                  {file.name}
                </Typography>
                <Typography variant="body2" sx={{ ml: 2 }}>
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </Typography>

                {/* Progress Bar */}
                {file.progress < 100 && (
                  <LinearProgress
                    variant="determinate"
                    value={file.progress}
                    sx={{
                      width: "70%",
                      height: 10,
                      borderRadius: 5,
                      ml: 2,
                      bgcolor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "#3b82f6",
                      },
                    }}
                  />
                )}

                {/* Remove File Icon */}
                <Tooltip title="Remove File" arrow placement="top">
                  <IconButton
                    color="error"
                    onClick={(event) => handleRemoveFile(event, file.name)}
                    sx={{
                      ml: 2,
                      transition: "color 0.3s, transform 0.3s",
                      "&:hover": {
                        color: "red",
                        transform: "scale(1.2)",
                        cursor: "pointer",
                      },
                    }}
                  >
                    <DeleteForeverOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>
        )}
      </>
    );
  }
);

export default FileUpload;
