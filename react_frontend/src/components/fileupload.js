import React, { useState, useCallback, useEffect, useRef, forwardRef} from 'react';
import { useDropzone } from 'react-dropzone';

import {
  Grid,
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';


import DeleteIcon from '@mui/icons-material/Delete';
import SelectedPDF from '../assets/SelectedPDF.png';
import SelectedDOCX from '../assets/SelectedDOCX.png';
import SelectedTXT from '../assets/SelectedTXT.png';
import SelectedDOC from '../assets/SelectedDOC.png';
import SelectedJPG from '../assets/SelectedJPG.png';
import SelectedPNG from '../assets/SelectedPNG.png';
import SelectedJPEG from '../assets/SelectedJPEG.png';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUploaded = forwardRef(({
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
  const [previews, setPreviews] = useState(filePreviews);
  const [selectedFiles, setSelectedFiles] = useState(selectedFilesInParent);
  const [filesUploaded, setFilesUploaded] = useState(filesUploadedInChild);
  const [uploads, setUploads] = useState([]);
  const [deleted, setDeleted] = useState(false);
  const fileInputRef = useRef(null);

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
    if (id === 'idp') {
      onFileRemove();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
    <>
      <Box>
        <Grid
          {...getRootProps()}
          style={{
            textAlign: 'center',
            marginTop: '15px',
            borderRadius: 2,
            padding: '10px', // Add some padding
            cursor: 'pointer', // Change cursor to pointer on hover
             // *** Correct placement of styles ***
          overflowY: uploads.length > 2 ? 'auto' : 'hidden',
          maxHeight: uploads.length > 2 ? '250px' : 'auto', 
          // You can add other styles here as needed, e.g., border
          }}
        >
          <input
            {...getInputProps()}
          // Attach the ref to the input element
          />
          {!filesUploaded &&
            (isDragActive ? (
              <Typography>Drop the files here ...</Typography>
            ) : (
              <>
                <label htmlFor="file-input">
 
                  <Box
                    sx={{
                      border: '2px solid #ccc',
                      borderRadius: 2,
                      boxShadow: 5,

                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                    style={{ padding: '10px 50px' }}
                  >

                    <Typography style={{ fontSize: "0.8rem" }}>
                      Click here to upload file or drag and drop.
                    </Typography>
                    <Typography style={{ fontSize: "0.7rem" }}>
                      {/* Supported Format: PNG, JPG, JPEG, PDF, DOCX, TXT (5mb each) */}
                      Supported Format:{generateSupportedFormatsString(allowedFormats)}
                    </Typography>
                    <CloudUploadIcon
                      sx={{ fontSize: 36, color: '#87CEFA' }}
                    />

                    <Box ref={fileInputRef}>
                      {previews && previews.length > 0 && uploadIn === 'company' ? (
                        <Box className="dropzonemain dropzonepreview Boxmargin" >
                          {previews.map((preview, index) => (
                            <Grid
                              container
                              key={index}
                              style={{
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Grid item>
                                {preview.file && (
                                  <Grid item>
                                    {isFormatAllowed(preview.file) ? (
                                      <img
                                        src={preview.preview}
                                        alt={preview.file.name}
                                        style={{ width: '70%' }}
                                      />
                                    ) : (
                                      <Typography
                                        variant="body2"
                                        color="error"
                                      >
                                        {preview.file.name} - Invalid format
                                      </Typography>
                                    )}
                                  </Grid>
                                )}
                              </Grid>
                              <Grid item>
                              <Tooltip title="Remove File" arrow placement="top">
                                <IconButton
                                  color="error"
                                  onClick={(event) =>
                                    handleRemoveFile(event, preview.file.name)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          ))}
                        </Box>
                      ) : (
                        <>
                          {uploads.map((file, index) => (
                            <>
                              <Grid marginTop="15px"></Grid>

                              <Box
                                key={index}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  p: 1,
                                  borderRadius: 2,
                                  boxShadow: 3,
                                  maxWidth: 400,
                                  margin: '0 auto',
                                  width: '100%',
                                 
                                  border: '1px solid blue',
                                }}
                              >
                                {{
                                  'jpg': <img src={SelectedJPG} alt='SelectedJPG' height={'35px'} />,
                                  'jpeg': <img src={SelectedJPEG} alt='SelectedJPEG' height={'35px'} />,
                                  'png': <img src={SelectedPNG} alt='SelectedPNG' height={'35px'} />,
                                  'pdf': <img src={SelectedPDF} alt='SelectedPDF' height={'35px'} />,
                                  'doc': <img src={SelectedDOC} alt='SelectedDOC' height={'35px'} />,
                                  'docx': <img src={SelectedDOCX} alt='SelectedDOCX' height={'35px'} />,
                                  'application/msword': <img src={SelectedDOC} alt="DOC Icon" height="35px" />,
                                  'txt': <img src={SelectedTXT} alt="TXT Icon" height="35px" />,
                                  // ... other file types
                                }[file.name.split('.').pop().toLowerCase()] || null}
                                <Box sx={{ flexGrow: 1, mr: 2 }}>
                                  <Typography
                                    sx={{
                                      fontSize: 12,
                                      fontWeight: 'bold',
                                      wordBreak: 'break-all',
                                    }}
                                  >
                                    {file.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontSize: 12, color: '#666' }}
                                  >
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                  </Typography>
                                  {file.status === 'uploading' && (
                                    <>
                                      <LinearProgress
                                        variant="determinate"
                                        value={file.progress}
                                        sx={{
                                          height: 10,
                                          borderRadius: 5,
                                          mt: 1,
                                          bgcolor: '#e0e0e0',
                                          '& .MuiLinearProgress-bar': {
                                            bgcolor: '#3b82f6',
                                          },
                                        }}
                                      />
                                      <Typography
                                        variant="body2"
                                        sx={{ mt: 1 }}
                                      >
                                        Progress: {file.progress}%
                                      </Typography>
                                    </>
                                  )}
                                  {file.status === 'failed' && (
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontSize: 12,
                                        mt: 1,
                                        color: 'red',
                                      }}
                                    >
                                      Upload failed! Please try again.
                                    </Typography>
                                  )}
                                </Box>
                                <Tooltip title="Remove File" arrow placement="top">
                                <IconButton
                                  color="error"
                                  onClick={(event) =>
                                    handleRemoveFile(event, file.name)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                                </Tooltip>
                              </Box>
                            </>
                          ))}
                        </>
                      )}
                    </Box>
                  </Box>
                </label>
              </>
            ))}
        </Grid>
      </Box>
    </>
  );
});
 
export default FileUploaded;
 