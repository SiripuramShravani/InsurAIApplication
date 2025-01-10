import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});
const memoryCache = new Map();

const useNetworkStatus = (initialState = {}, onNetworkError, navigate) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [appState, setAppState] = useState(initialState);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [failedReports, setFailedReports] = useState([]);
  const [requestQueue, setRequestQueue] = useState([]);

  const updateAppState = useCallback((newState) => {
    setAppState((prevState) => {
      const updatedState = { ...prevState, ...newState };
      memoryCache.set("appState", updatedState);
      return updatedState;
    });
  }, []);


  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processQueuedRequests();
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (navigate) {
        navigate("/notFound");
      }
    };

    const processQueuedRequests = async () => {
      const queue = [...requestQueue];
      for (const request of queue) {
        try {
          await axiosInstance.post("sendemail/", request);
          setRequestQueue((prev) => prev.filter((item) => item !== request));
        } catch (error) {
          console.error("Error processing queued request:", error);
        }
      }
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    if (!navigator.onLine && navigate) {
      navigate("/notFound");
    }
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [navigate, requestQueue]);

  const setNetworkError = useCallback(
    ({
      errorMessage,
      errorSource,
      fileName = null,
      fileType = null,
      fileNames = [],
      fileTypes = [],
      status,
      emails = [],
      documents = [],
    }) => {
      const processedFileNames = fileName ? [fileName] : fileNames;
      const processedFileTypes = fileType ? [fileType] : fileTypes;
      const error = errorMessage;
      const userName = "Anonymous";

      updateAppState({
        networkError: error,
        failedEmails: emails,
        failedDocuments: documents,
      });

      const emailReport = {
        errorMessage: error,
        errorSource,
        username: userName,
        fileNames: processedFileNames,
        fileTypes: processedFileTypes,
        failedEmails: emails,
        failedDocuments: documents,
        timestamp: new Date().toISOString(),
      };

      if (!navigator.onLine) {
        setRequestQueue((prev) => [...prev, emailReport]);
        return;
      }

      axiosInstance
        .post("sendemail/", emailReport)
        .then((response) => {
          console.log("Email sent successfully:", response.data);
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          setFailedReports((prev) => [
            ...prev,
            {
              emails,
              documents,
              error,
              timestamp: new Date().toISOString(),
            },
          ]);
        });

      if (status === 500) {
        onNetworkError("/databaseerror");
      } else if (status === 404 || status === 400) {
        setSnackbar({ open: true, message: errorMessage });
        setTimeout(() => {
          setSnackbar({ open: false, message: "" });
        }, 10000);
      } else if (status === 401) {
        setSnackbar({ open: true, message: errorMessage });
        return;
      } else {
        setSnackbar({
          open: true,
          message: "Sorry for the inconvenience, Please Try after some time",
        });
      }
    },
    [updateAppState, onNetworkError]
  );

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "" });
  };

  const SnackbarComponent = () => (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={15000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity="warning"
        icon={<WarningAmberIcon />}
        sx={{ backgroundColor: "#fdee79", color: "black" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );

  return {
    isOnline,
    setNetworkError,
    SnackbarComponent,
    appState,
    failedReports,
    requestQueue,
    updateAppState,
  };
};

export default useNetworkStatus;