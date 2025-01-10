import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  Avatar,
  Paper,
  IconButton,
  useTheme,
  Divider,
  Fade,
  useMediaQuery,Tooltip
} from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import Insur_AI_Agent from "../../assets/InsurAI_Agent.png";
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  borderRadius: '12px',
  maxWidth: '85%',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  },
}));

const UserMessage = styled(StyledPaper)(({ theme }) => ({
  alignSelf: 'flex-end',
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const AIMessage = styled(StyledPaper)(({ theme }) => ({
  alignSelf: 'flex-start',
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderLeft: `4px solid ${theme.palette.secondary.main}`,
}));

const ChatHistoryList = styled(List)({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
});

const ChatHistoryItem = styled(ListItem)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  padding: '12px 0',
});

const DateDivider = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(2, 0),
  cursor: 'pointer',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const MarkdownContent = styled(ReactMarkdown)(({ theme }) => ({
  '& p': {
    margin: '0 0 8px 0',
  },
  '& ul, & ol': {
    marginLeft: theme.spacing(2),
  },
  '& code': {
    backgroundColor: theme.palette.grey[100],
    padding: '2px 4px',
    borderRadius: '4px',
  },
}));

const EnhancedChatHistory = ({ isOpen, onClose, chatHistory }) => {
  const theme = useTheme();
  const [expandedDates, setExpandedDates] = useState({});
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDate = (date) => {
    setExpandedDates(prev => ({ ...prev, [date]: !prev[date] }));
  };

  const groupedHistory = chatHistory.reduce((acc, chat) => {
    if (!acc[chat.date]) {
      acc[chat.date] = [];
    }
    acc[chat.date].push(chat);
    return acc;
  }, {});

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: isSmallScreen ? '100%' : 600,
          background: theme.palette.background.default,
        },
      }}
    >
      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Typography variant="h6" className="Nasaliza" sx={{ color: theme.palette.primary.main }}>
            Chat History
          </Typography>
          <Tooltip title="Close Chats" arrow placement="top">

          <IconButton onClick={onClose} size="large" sx={{ color: theme.palette.primary.main }}>
            <CloseIcon />
          </IconButton>
          </Tooltip>
        </Box>
        <ChatHistoryList>
          <AnimatePresence>
            {Object.entries(groupedHistory).map(([date, chats]) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DateDivider onClick={() => toggleDate(date)}>
                  <Calendar size={18} style={{ marginRight: 8 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                    {date}
                  </Typography>
                  {expandedDates[date] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </DateDivider>
                <Divider />
                <Fade in={expandedDates[date]}>
                  <div>
                    {expandedDates[date] && chats.map((chat, chatIndex) => (
                      <ChatHistoryItem key={chatIndex}>
                        <UserMessage>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>User:</Typography>
                          <MarkdownContent>{chat.user}</MarkdownContent>
                          <Typography variant="caption" sx={{ alignSelf: 'flex-end', marginTop: 1 }}>
                            {chat.time}
                          </Typography>
                        </UserMessage>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', marginTop: 1 }}>
                          <Avatar
                            src={Insur_AI_Agent}
                            alt="AI"
                            sx={{ width: 24, height: 24, marginRight: 1 }}
                          />
                          <AIMessage>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>Ivan:</Typography>
                            <MarkdownContent>{chat.ai}</MarkdownContent>
                          </AIMessage>
                        </Box>
                      </ChatHistoryItem>
                    ))}
                  </div>
                </Fade>
              </motion.div>
            ))}
          </AnimatePresence>
          {chatHistory.length === 0 && (
            <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
              No chat history available.
            </Typography>
          )}
        </ChatHistoryList>
      </Box>
    </Drawer>
  );
};

export default EnhancedChatHistory;