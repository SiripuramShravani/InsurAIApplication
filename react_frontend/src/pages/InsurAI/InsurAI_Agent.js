import React, { useState, useRef, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/system";
import {
  Grid,
  IconButton,
  Typography,
  Box,
  Paper,
  Avatar,
  Badge,Tooltip,
  
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import HistoryIcon from "@mui/icons-material/History";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloseIcon from "@mui/icons-material/Close";
import Insur_AI_Agent from "../../assets/InsurAI_Agent.png";
import axios from "axios";
import Markdown from "react-markdown";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { keyframes } from "@emotion/react";
import EnhancedChatHistory from "./EnhancedChatHistory";

// Replace with your actual Web Speech API setup
const synth = window.speechSynthesis;

const orb = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const ProcessingAnimation = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        maxWidth: "200px",
        margin: "10px 0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "40px",
        }}
      >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              width: "9px",
              height: "9px",
              backgroundColor: "#1a237e",
              borderRadius: "100%",
              animation: `${orb} 1s ease-in-out infinite`,
              animationDelay: `${index * 0.2}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: 1200,
  height: "650px",
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  borderRadius: "20px",
  overflow: "hidden",
  backgroundColor: "#f0f4f8",
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  background: "linear-gradient(45deg, #1a237e 30%, #3f51b5 90%)",
  color: "white",
}));

const ChatBox = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,.2)",
    borderRadius: "4px",
  },
}));

const InputArea = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "white",
  borderTop: "1px solid #e0e0e0",
}));

// Updated MessageBubble with flexbox
const MessageBubble = styled(motion.div)(({ theme, sender }) => ({
  padding: theme.spacing(1),
  maxWidth: "70%",
  backgroundColor: sender === "user" ? "#e3f2fd" : "white",
  borderRadius: sender === "user" ? "20px 20px 0 20px" : "20px 20px 20px 0",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  marginBottom: theme.spacing(1),
  display: "flex",
  flexDirection: "column",
}));

// New styled component for message content
const MessageContent = styled(Box)({
  flexGrow: 1,
});

// New styled component for timestamp
const TimestampBox = styled(Box)({
  alignSelf: "flex-end",
  marginTop: "-10px",
});

const AnimatedIconButton = motion(IconButton);

const FileName = styled(Typography)(({ theme }) => ({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "100px", // Adjust the max-width as needed
}));

const EnhancedInsurAIAgent = ({ onClose }) => {
  const theme = useTheme();
   /* eslint-disable no-unused-vars */ 
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [messages, setMessages] = useState(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    return storedMessages ? JSON.parse(storedMessages) : [];
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [inputText, setInputText] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingDocument, setIsProcessingDocument] = useState(false);
  const [processingType, setProcessingType] = useState(null);
  const [isSpeakingChunks, setIsSpeakingChunks] = useState(false);
  const [isSpeechRecognitionActive, setIsSpeechRecognitionActive] =useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const speechQueue = useRef([]);

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_URL,
    withCredentials: true
  });

  const allowedFileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
  ];
  const maxFileSize = 5 * 1024 * 1024;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (allowedFileTypes.includes(file.type) && file.size <= maxFileSize) {
        setSelectedFile(file);
      } else {
        toast.error(
          "Invalid file type or size. Please select a PNG, JPG, JPEG or PDF file up to 5MB."
        );
        e.target.value = null;
      }
    }
  };

  const handleFileCancel = () => {
    setSelectedFile(null);
  };

  const AUTO_SUBMIT_DELAY = 3000;
  let autoSubmitTimeout = useRef(null);
  const transcriptRef = useRef("");

  const { transcript, listening, resetTranscript } = useSpeechRecognition({
    commands: [
      {
        command: "*",
        callback: (command) => {
          if (isSpeechRecognitionActive && micEnabled) {
            console.log("Speech recognized:", command);
            setInputText(command);
            transcriptRef.current = command;

            if (autoSubmitTimeout.current) {
              clearTimeout(autoSubmitTimeout.current);
            }

            autoSubmitTimeout.current = setTimeout(() => {
              if (micEnabled && !isSpeaking) {
                sendMessage(transcriptRef.current);
              }
            }, AUTO_SUBMIT_DELAY);
          }
        },
      },
    ],
  });

  useEffect(() => {
    if (!micEnabled) {
      stopListening();
    }
  }, [micEnabled]);

  useEffect(() => {
    return () => clearTimeout(autoSubmitTimeout.current);
  }, []);

  const welcomeMessageFetchedRef = useRef(false);

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      if (welcomeMessageFetchedRef.current) return;
      welcomeMessageFetchedRef.current = true;

      try {
        const response = await axiosInstance.post(
          'AI/Welcome_Chat_agent/',
          { query: "hii" }
        );
        const welcomeMessage = response.data.welcome_message;
        setWelcomeMessage(welcomeMessage);

        if (messages.length === 0) {
          const initialBotMessage = {
            text: welcomeMessage,
            sender: "bot",
            timestamp: getTimeString(),
            spoken: false,
          };
          setMessages([initialBotMessage]);
        }
      } catch (error) {
        console.error("Error fetching welcome message:", error);
      }
    };

    fetchWelcomeMessage();
  }, [messages]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isSpeaking, listening]);

  //Auto Scrolling
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const getTimeString = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const startListening = () => {
    try {
      SpeechRecognition.startListening({ continuous: true });
      setMicEnabled(true);
      setIsSpeechRecognitionActive(true);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setMicEnabled(false);
      setIsSpeechRecognitionActive(false);
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    SpeechRecognition.abortListening();
    setMicEnabled(false);
    setIsSpeechRecognitionActive(false);
  };

  const splitTextIntoChunks = (text, wordsPerChunk = 10) => {
    const words = text.split(" ");
    const chunks = [];

    for (let i = 0; i < words.length; i += wordsPerChunk) {
      chunks.push(words.slice(i, i + wordsPerChunk).join(" "));
    }

    return chunks;
  };

  const speakNextChunk = () => {
    if (speechQueue.current.length > 0) {
      const chunk = speechQueue.current.shift();
      const utterance = new SpeechSynthesisUtterance(chunk);
      utterance.onend = () => {
        if (speechQueue.current.length === 0) {
          setIsSpeakingChunks(false);
          setAiSpeaking(false); // Set AI speaking to false when done
          // Restart listening if micEnabled is true
          if (micEnabled) {
            startListening();
          }
        } else {
          speakNextChunk();
        }
      };
      synth.speak(utterance);
    } else {
      setIsSpeakingChunks(false);
      setAiSpeaking(false); // Set AI speaking to false
    }
  };

  const speakMessage = (text) => {
    if (synth.speaking) {
      console.error("SpeechSynthesis is already speaking.");
      return;
    }

    const chunks = splitTextIntoChunks(text, 18);
    speechQueue.current = chunks;
    setIsSpeakingChunks(true);
    setAiSpeaking(true);
    speakNextChunk();
  };

  const sendMessage = async (text = inputText) => {
    clearTimeout(autoSubmitTimeout.current);
    autoSubmitTimeout.current = null;

    if (!text.trim() && !selectedFile) return;

    // Stop listening before sending the message
    stopListening();

    const timestamp = getTimeString();
    let newMessage = { text, sender: "user", timestamp, status: "sent" };

    if (selectedFile) {
      newMessage.file = {
        name: selectedFile.name,
        type: selectedFile.type,
        url: URL.createObjectURL(selectedFile),
      };
      setIsProcessingDocument(true);
      setProcessingType("document");
    } else {
      setProcessingType("query");
    }

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");

    setIsProcessing(true);

    try {
      const User =
        localStorage.getItem("userName") ||
        localStorage.getItem("NonInsuredEmail");
      const Insured = localStorage.getItem("isInsured") || "no";
      const insured = Insured === "yes" ? "Insured" : "NonInsured";
      console.log("check for insured ?",Insured) 
      console.log('insured........?',insured) 
      const formData = new FormData();
      formData.append("query", text);
      formData.append("userEmail", User);
      formData.append("role", insured);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      setSelectedFile(null);

      const response = await axiosInstance.post(
        'AI/AI_CHAT_AGENT/',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const botReply = response.data;

      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((msg) =>
          msg.sender === "user" && msg.status === "sent"
            ? { ...msg, status: "delivered" }
            : msg
        );
        return [
          ...updatedMessages,
          { text: botReply, sender: "bot", timestamp: getTimeString() },
        ];
      });

      if (micEnabled) {
        speakMessage(botReply);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsProcessing(false);
      setIsProcessingDocument(false);
      setProcessingType(null);
      resetTranscript();
      setSelectedFile(null);
    // Focus on the input field after the response is received
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isSpeaking && !isProcessing) {
      sendMessage();
    }
  };

  const handleMicClick = () => {
    if (aiSpeaking) {
      // Stop AI speech if it's in progress
      synth.cancel();
      setIsSpeakingChunks(false);
      setAiSpeaking(false);
      speechQueue.current = [];

      // Immediately start listening
      resetTranscript();
      startListening();
    } else if (listening || micEnabled) {
      stopListening();
    } else if (!isProcessing) {
      resetTranscript();
      startListening();
    }
  };

  const handleHistoryClick = async () => {
    try {
      const User =
        localStorage.getItem("userName") ||
        localStorage.getItem("NonInsuredEmail");
      const response = await axiosInstance.post(
        'AI/get_chat_history/',
        { email: User }
      );
      setChatHistory(response.data.chat_history);
      setIsHistoryOpen(true);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const handleDrawerClose = () => {
    setIsHistoryOpen(false);
  };

  const [nonInsured, setNonInsured] = useState(false);
  const NonInsured = localStorage.getItem("NonInsuredEmail");
  useEffect(() => {
    if (NonInsured) {
      setNonInsured(true);
    }
  }, [NonInsured]);

  return (
    <StyledPaper elevation={3}>
      <ChatHeader>
        <Avatar
          src={Insur_AI_Agent}
          alt="Chat Agent"
          sx={{ width: 40, height: 40, marginRight: 2 }}
        />
        <Typography variant="h6" className="Nasaliza" sx={{ flexGrow: 1 }}>
          Ivan - Innovon P & C Virtual Assistant
        </Typography>
        {nonInsured && (
          <Badge color="error" variant="dot">
            <Typography variant="caption">Non-Insured</Typography>
          </Badge>
        )}
        <Tooltip title="Previous Chats" arrow placement="right">

        <IconButton onClick={handleHistoryClick} color="inherit">
          <HistoryIcon />
        </IconButton>
        </Tooltip>
        {/* <IconButton onClick={onClose} color="inherit">
          <CloseIcon />
        </IconButton> */}
      </ChatHeader>

      <ChatBox ref={chatBoxRef}>
        <AnimatePresence>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  message.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: theme.spacing(1),
              }}
            >
              {message.sender === "bot" && (
                <Avatar
                  src={Insur_AI_Agent}
                  alt="bot"
                  sx={{ width: 30, height: 30, marginRight: 1 }}
                />
              )}
              <MessageBubble
                key={index}
                sender={message.sender}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Message Content */}
                <MessageContent>
                  <Markdown>{message.text}</Markdown>
                  {message.file && (
                    <Box sx={{ marginTop: 1 }}>
                      {message.file.type.startsWith("image/") ? (
                        <img
                          src={message.file.url}
                          alt={message.file.name}
                          style={{ maxWidth: "100%", borderRadius: 8 }}
                        />
                      ) : (
                        <UploadFileIcon />
                      )}
                      <FileName variant="caption">
                        {message.file.name}
                      </FileName>
                    </Box>
                  )}
                </MessageContent>
                {/* Timestamp */}
                <TimestampBox>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.7rem",
                      opacity: 0.7,
                    }}
                  >
                    {message.timestamp}
                    {message.sender === "user" &&
                      (message.status === "sent" ? (
                        <CheckIcon
                          fontSize="small"
                          sx={{ marginLeft: 0.5, color: "action.active" }}
                        />
                      ) : (
                        <DoneAllIcon
                          fontSize="small"
                          sx={{ marginLeft: 0.5, color: "primary.main" }}
                        />
                      ))}
                  </Typography>
                </TimestampBox>
              </MessageBubble>
            </Box>
          ))}
        </AnimatePresence>
        {processingType && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: 2,
              marginLeft: 4,
            }}
          >
            <ProcessingAnimation type={processingType} />
          </Box>
        )}
      </ChatBox>

      <InputArea>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs>
            <Paper
              component="form"
              onSubmit={(e) => e.preventDefault()}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "2px 4px",
                borderRadius: "30px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isSpeaking || listening || isProcessing}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  padding: "12px",
                  fontSize: "14px",
                  borderRadius: "30px",
                }}
              />
              {selectedFile && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: 1,
                  }}
                >
                  <Tooltip title="Remove file" arrow placement="top">

                  <IconButton size="small" onClick={handleFileCancel}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  </Tooltip>
                  <FileName variant="caption" noWrap>
                    {selectedFile.name}
                  </FileName>
                </Box>
              )}
            </Paper>
          </Grid>
          <Grid item>
            <AnimatedIconButton
              onClick={handleMicClick}
              disabled={isProcessing}
              color={
                aiSpeaking // Change the color based on the new state
                  ? "secondary"
                  : micEnabled
                  ? "error"
                  : "default"
              }
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {aiSpeaking ? (
                <RecordVoiceOverIcon />
              ) : micEnabled ? (
                <Tooltip title="Mute" arrow placement="top">
                <MicIcon />
                </Tooltip>
              ) : (
                <Tooltip title="UnMute" arrow placement="top">
                <MicOffIcon />
                </Tooltip>
              )}
            </AnimatedIconButton>
          </Grid>
          <Grid item>
            <AnimatedIconButton
              component="label"
              htmlFor="file-upload"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <input
                type="file"
                id="file-upload"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Tooltip title="Upload" arrow placement="top">

              <UploadFileIcon />
              </Tooltip>
            </AnimatedIconButton>
          </Grid>
          <Grid item>
            <AnimatedIconButton
              onClick={() => sendMessage()}
              disabled={isSpeaking || listening || isProcessing}
              color="primary"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SendIcon />
            </AnimatedIconButton>
          </Grid>
        </Grid>
      </InputArea>

      <EnhancedChatHistory
        isOpen={isHistoryOpen}
        onClose={handleDrawerClose}
        chatHistory={chatHistory}
      />

      <ToastContainer />
    </StyledPaper>
  );
};

export default EnhancedInsurAIAgent;