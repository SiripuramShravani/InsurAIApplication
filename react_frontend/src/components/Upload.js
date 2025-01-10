import FileUpload from "../assets/FileUpload.png";
import React, { useState, useCallback, useEffect, useRef, forwardRef} from 'react';
import {
  Box,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";
import { InsertDriveFile, Close } from "@mui/icons-material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { useDropzone } from 'react-dropzone';

const FileUploads = forwardRef(({
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
  }, ref) => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]); // Stores file data with progress, name, and icon
  const [isDragOver, setIsDragOver] = useState(false);
  const [previews, setPreviews] = useState(filePreviews);
  const [selectedFiles, setSelectedFiles] = useState(selectedFilesInParent);
  const [filesUploaded, setFilesUploaded] = useState(filesUploadedInChild);
  const [uploads, setUploads] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const fileInputRef = useRef(null);

  const maxFileNameLength = 30; // Max length for file name display

  // Handle file selection when user selects a file or drags and drops
  const handleFileUpload = (event) => {
    const selectedFiles = event.target.files || event.dataTransfer?.files;

    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles).map((file) => {
        return {
          name: trimFileName(file.name),
          icon: getFileIcon(file),
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
    if (fileName.length > maxFileNameLength) {
      return fileName.substring(0, maxFileNameLength) + "...";
    }
    return fileName;
  };

  // Determine the file type icon based on file extension
  const getFileIcon = (file) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (["pdf", "docx", "xlsx"].includes(fileExtension)) {
      return <InsertDriveFile />;
    }
    return <InsertDriveFile />;
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

  // Remove a file from the uploaded list
  const handleRemoveFile = (fileId,event, fileName) => {
    console.log('fileID:', fileId)
    const updatedFiles = files.filter((file) => file.id !== fileId);
    setFiles(updatedFiles);
    setDeleted(false);
    setSelectedFiles((prevFiles) => [
          ...prevFiles.filter((file) =>file.name !== fileName),
        ]);
    setPreviews((prevPreviews) => [
      ...prevPreviews.filter((preview) => preview.file.name !== fileName),
    ]);
    //  setIsSubmitDisabled(true);

  };
  

  // Handle the "Process" button click
  const handleProcess = () => {
    // Implement your processing logic here
    alert("Processing files...");
  };

  // Drag events to show feedback when dragging files over the upload box
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

    // Method to clear all files
  const handleClearAllFiles = () => {
    setPreviews([]);
    setSelectedFiles([]);
    setUploads([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsSubmitDisabled(true);
  };

  // Expose the clear method through ref
  React.useImperativeHandle(ref, () => ({
    handleClearAllFiles
  }));

  const isFormatAllowed = (file) => {
    const fileType = file.type.split('/')[1];
    return allowedFormats ? allowedFormats.includes(fileType) : true;
  };

  useEffect(() => {
    // Simulate upload progress for selected files
    if (selectedFiles) {
      const newUploads = selectedFiles.map((file, index) => ({
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading',
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
                  return { ...upload, progress: 100, status: 'success' };
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
        alert('Please select only one file');
        return;
      }
 
      if (
        selectedFiles?.length &&
        acceptedFiles &&
        selectedFiles.length + acceptedFiles.length > 10
      ) {
        alert('You can only upload up to 10 files.');
        return;
      }
 
      if (multiple && acceptedFiles.length > 10) {
        alert('You can only upload up to 10 files.');
        return;
      }
 
      const maxSizeAllowed = (fileType) => {
        if (
          fileType === 'image/png' ||
          fileType === 'image/jpeg' ||
          fileType === 'image/jpg'
        ) {
          return {
            maxSize: 5 * 1024 * 1024,
            fileType: 'PNG, JPG & JPEG images',
          };
        } else if (
          fileType === 'application/pdf' ||
          fileType ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          return { maxSize: 5 * 1024 * 1024, fileType: 'PDFs and DOCX files' };
        } else if (fileType.startsWith('video')) {
          return { maxSize: 100 * 1024 * 1024, fileType: 'videos' };
        } else if (fileType === 'text/plain') {
          return { maxSize: 1 * 1024 * 1024, fileType: 'Text files' };
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
          .join(', ');
        alert(
          `Invalid file formats! Allowed formats: ${allowedFormats.join(
            ', '
          )}. Invalid files: ${invalidFormats}`
        );
        return;
      }
 
      if (sizeExceedingFiles.length > 0) {
        const exceedingFiles = sizeExceedingFiles
          .map((file) => file.name)
          .join(', ');
        const exceedingFormats = sizeExceedingFiles
          .map((file) => file.type)
          .join(', ');
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

  // const handleRemoveFile = (event, fileName) => {
  //   event.stopPropagation(); // Prevent event from bubbling up to the dropzone
  //   console.log(fileName);
  //   setDeleted(false);
  //   setPreviews((prevPreviews) => [
  //     ...prevPreviews.filter((preview) => preview.file.name !== fileName),
  //   ]);
  //   setSelectedFiles((prevFiles) => [
  //     ...prevFiles.filter((file) => file.name !== fileName),
  //   ]);
  //   setFilesUploaded(false);
  //   onFileRemove(fileName);
  //   if (id === 'idp') {
  //     onFileRemove();
  //   }
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = '';
  //   }
  //   setIsSubmitDisabled(true);
  // };
 
  // console.log(selectedFiles);
 
  useEffect(() => {
    if (selectedFiles && selectedFiles.length === 0) {
      setIsSubmitDisabled(false);
    }
  }, [selectedFiles, setIsSubmitDisabled]);
 
  useEffect(() => {
    if (
      selectedFiles &&
      selectedFiles.length > 0 &&
      !filesUploaded
    ) {
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
  return (
    <Box
      sx={{
        width: "75%",
        mx: "auto",
      }}
    >
      <Box
        sx={{
          border: "2px dashed #1976d2",
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          minHeight: files.length ? "40vh" : "40vh",
          backgroundColor: "#f7f9fc",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          "&:hover": {
            backgroundColor: "#eef4fc",
          },
          borderColor: isDragOver ? "#1976d2" : "#90caf9",
        }}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={(e) => {
          if (
            e.target.closest(".remove-icon") ||
            e.target.closest(".process-button")
          )
            return;
          if (!uploading) {
            document.getElementById("file-input").click();
          }
        }}
      >
        <img
          src={FileUpload}
          alt="Example"
          style={{ width: "300px", borderRadius: "8px" }}
        />

        <>
          <Typography variant="h6" sx={{ color: "#1976d2" }}>
            Drag and drop files here or <b>browse</b>
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Max. File Size: 5 MB
          </Typography>
        </>

        {/* Hidden file input */}
        <input
          type="file"
          id="file-input"
          hidden
          multiple
          onChange={handleFileUpload}
          accept="*/*"
        />
      </Box>

      {/* Uploaded Files Box - Only appears when files are present */}
      {files.length > 0 && (
        <Box
          sx={{
            border: "2px solid #1976d2",
            borderRadius: 2,
            p: 3,
            mt: 2, // Margin top to attach below main upload box
            backgroundColor: "#f7f9fc",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {files.map((file, index) => (
            <Box
              key={file.id}
              sx={{ mb: 2, display: "flex", alignItems: "center" }}
            >
              <Box sx={{ mr: 2 }}>{file.icon}</Box>
              <Typography variant="body1" sx={{ flex: 1, textAlign: "left" }}>
                {file.name}
              </Typography>
              {/* Show Progress Bar while Uploading */}
              {uploading && file.progress < 100 && (
                <LinearProgress
                  variant="determinate"
                  value={file.progress}
                  sx={{ width: "70%" }}
                />
              )}
              {/* Bin icon to remove file */}
              {!uploading && file.progress === 100 && (
                <DeleteForeverOutlinedIcon
                  color="secondary"
                  onClick={() => handleRemoveFile(file.id)}
                  sx={{
                    ml: 2,
                    transition: "color 0.3s, transform 0.3s", // Smooth transition
                    "&:hover": {
                      color: "red", // Change to desired hover color
                      transform: "scale(1.2)", // Slightly enlarge on hover
                      cursor: "pointer", // Show pointer on hover
                    },
                  }}
                  className="remove-icon"
                >
                  <Close />
                </DeleteForeverOutlinedIcon>
              )}
            </Box>
          ))}

          {/* Process button */}
          <Box
            sx={{
              mt: 2,
              width: "20%",
              margin: "0 auto", // Centers horizontally
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column", // Ensures content is stacked vertically
            }}
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleProcess}
              className="process-button"
            >
              Process Files
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
});

export default FileUploads;
