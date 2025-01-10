import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Typography, Box } from "@mui/material";
 
const MarkdownDynamicRenderer = ({ extractedSummary }) => {
  const boxWidth = "100%";
 
  return (
    <Box sx={{ padding: 1 }}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          h3: ({ node, ...props }) => (
            <Box
              sx={{
                marginTop: 4,
                marginBottom: 2,
                background: "white",
                padding: 2,
                borderRadius: 2,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                boxSizing: "border-box",
                width: boxWidth,
                textAlign: "left",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "black",
                  fontWeight: 600,
                  textAlign: "left",
                  width: "100%",
                }}
                {...props}
              />
            </Box>
          ),
          p: ({ node, ...props }) => (
            <Box
              sx={{
                marginBottom: 2,
                background: "white",
                padding: 2,
                borderRadius: 2,
                boxSizing: "border-box",
                width: boxWidth,
                textAlign: "left",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#333",
                  fontWeight: 500,
                  lineHeight: 1.6,
                  textAlign: "left",
                  width: "100%",
                }}
                {...props}
              />
            </Box>
          ),
          ol: ({ node, ...props }) => (
            <Box
              component="ol"
              sx={{
                marginBottom: 2,
                paddingLeft: 4,
                background: "white",
                padding: 2,
                borderRadius: 2,
                boxSizing: "border-box",
                width: boxWidth,
                listStyle: "decimal",
              }}
            >
              {props.children}
            </Box>
          ),
          ul: ({ node, ...props }) => (
            <Box
              component="ul"
              sx={{
                marginBottom: 2,
                paddingLeft: 2,
                background: "white",
                padding: 2,
                borderRadius: 2,
                boxSizing: "border-box",
                width: boxWidth,
              }}
            >
              {props.children}
            </Box>
          ),
          li: ({ node, ordered, ...props }) => (
            <Box
              component="li"
              sx={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: 1,
                background: "white",
                borderRadius: 2,
                padding: 1,
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                boxSizing: "border-box",
                width: boxWidth,
                textAlign: "left",
                ...(ordered && {
                  listStylePosition: "inside",
                  pl: 0,
                  display: "list-item",
                }),
              }}
            >
              {!ordered && (
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
                    marginRight: 2,
                    marginTop: "7px",
                    flexShrink: 0,
                    boxShadow: "0 3px 6px rgba(0,0,0,0.16)",
                  }}
                />
              )}
              <Typography
                variant="body1"
                sx={{
                  flex: 1,
                  color: "#333",
                  fontWeight: 500,
                  lineHeight: 1.6,
                  textAlign: "left",
                }}
                {...props}
              />
            </Box>
          ),
          blockquote: ({ node, ...props }) => (
            <Box
              sx={{
                margin: 2,
                padding: 2,
                background: "white",
                borderLeft: "5px solid #6a11cb",
                borderRadius: 2,
                fontStyle: "italic",
                boxSizing: "border-box",
                width: boxWidth,
                textAlign: "left",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#333",
                  fontWeight: 500,
                  lineHeight: 1.6,
                  textAlign: "left",
                }}
                {...props}
              />
            </Box>
          ),
        }}
      >
        {extractedSummary}
      </ReactMarkdown>
    </Box>
  );
};
 
export default MarkdownDynamicRenderer;