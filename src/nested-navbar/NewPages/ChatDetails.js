import { Box, Typography, Divider } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import {
  // Box,
  Grid,
  Checkbox,
  // Container,
  IconButton,
  // Typography,
  Paper,
  Button,
  // Divider,
  Stack,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import Editor from "../../Templates/Texteditor/Editor"
const ChatDetails = ({ chat,updateChatDescription }) => {
  console.log("chat details", chat);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${day} ${month} ${formattedHours}:${formattedMinutes} ${period}`;
  };
  const messageRefs = useRef({});
  const [highlightedId, setHighlightedId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.description]);

  const handleMenuClick = (event, message) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };
  const [editorContent, setEditorContent] = useState("");
    const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  if (!chat) return null;
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {chat.chatsubject}
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        With: {chat.accountid.accountName}
      </Typography>
      <Divider sx={{ my: 1 }} />
      {/* {chat.description.map((desc, idx) => (
        <Box key={idx} sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            dangerouslySetInnerHTML={{ __html: desc.message }}
          />
          <Typography variant="caption" color="text.secondary">
            {new Date(desc.timestamp).toLocaleString()}
          </Typography>
        </Box>
      ))} */}
      <Box height={"42vh"} sx={{ overflowY: "auto", mt: 1, mb: 1 }}>
        {Array.isArray(chat.description) &&
          chat.description.length > 0 &&
          chat.description.map((desc, index) => {
            const isClient = desc.fromwhome?.toLowerCase() === "client";
            const isAdmin = desc.fromwhome?.toLowerCase() === "admin";
            const messageTime = desc.time ? formatDate(desc.time) : "Just now";

            let senderDisplayName = "";
            if (isClient && desc.senderid?.username) {
              senderDisplayName = desc.senderid.username;
            } else if (isAdmin && desc.senderid?.username) {
              senderDisplayName = "You";
            }

            return (
              <Box
                key={desc._id || index}
                ref={(el) => {
                  if (desc._id) {
                    messageRefs.current[desc._id] = el;
                  }
                }}
                sx={{
                  display: "flex",
                  justifyContent: isClient ? "flex-start" : "flex-end",
                  mb: 2,
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    maxWidth: "75%",

                    backgroundColor:
                      desc._id === highlightedId
                        ? "#fff2b3" // highlight color
                        : isAdmin
                          ? "#ffe6e6"
                          : "#e6f0ff",

                    p: 2,
                    borderRadius: 2,
                    borderTopLeftRadius: isClient ? 16 : 4,
                    borderTopRightRadius: isClient ? 4 : 16,
                    boxShadow: 1,
                    position: "relative",
                  }}
                >
                  {/* Show Reply Preview */}

                  {desc.replyTo &&
                    (() => {
                      const repliedMsg = chat.description.find(
                        (msg) => msg._id === desc.replyTo
                      );
                      if (!repliedMsg) return null;

                      return (
                        <Box
                          sx={{
                            backgroundColor: "#f5f5f5",
                            borderLeft: "3px solid #1976d2",
                            px: 1,
                            py: 0.5,
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="caption"
                            fontWeight="bold"
                            sx={{ cursor: "pointer", color: "#1976d2" }}
                            onClick={() => {
                              const el = messageRefs.current[desc.replyTo];
                              if (el) {
                                el.scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                });
                                setHighlightedId(desc.replyTo);
                                setTimeout(() => setHighlightedId(null), 2000); // remove highlight after 2s
                              }
                            }}
                          >
                            {/* {repliedMsg.fromwhome === "client"
                              ? "You"
                              : repliedMsg.senderid?.username || "Admin"} */}
                              {repliedMsg.fromwhome === "client"
  ? repliedMsg.senderid?.username
  : "You"}

                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ fontStyle: "italic", color: "#555" }}
                            dangerouslySetInnerHTML={{
                              __html:
                                repliedMsg.message?.length > 100
                                  ? repliedMsg.message.slice(0, 100) + "..."
                                  : repliedMsg.message,
                            }}
                          />
                        </Box>
                      );
                    })()}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#333",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      component="p"
                      gutterBottom
                      sx={{ fontWeight: "600" }}
                    >
                      {senderDisplayName}
                    </Typography>

                    <MoreVertIcon
                      fontSize="small"
                      sx={{ cursor: "pointer" }}
                      onClick={(e) => handleMenuClick(e, desc)} // 👈 Connect to your reply menu
                    />
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                    >
                      <MenuItem
                        onClick={() => {
                          setReplyTo(selectedMessage);
                          console.log(selectedMessage)
                          setAnchorEl(null);
                        }}
                      >
                        Reply
                      </MenuItem>
                    </Menu>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap", color: "#333" }}
                    dangerouslySetInnerHTML={{
                      __html:
                        typeof desc.message === "string"
                          ? desc.message
                          : "No message available",
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: "right",
                      color: "gray",
                      mt: 1,
                    }}
                  >
                    {messageTime}
                  </Typography>
                </Box>
              </Box>
            );
          })}



      </Box>
      <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 2,
              alignItems: "start",
            }}
          >
             {replyTo && (
              <Box
                sx={{
                  gridColumn: "1 / -1", // span full width of the grid
                  mb: 1,
                  p: 1.5,
                  backgroundColor: "#f4f6f8",
                  borderLeft: "4px solid #1976d2",
                  borderRadius: 1,
                  position: "relative",
                }}
              >
                <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                  Replying to:{" "}
                  {replyTo.fromwhome === "client"
                    ? replyTo.senderid?.username 
                    : "You" || "Admin"}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontStyle: "italic", whiteSpace: "pre-wrap", pr: 4 }}
                  dangerouslySetInnerHTML={{
                    __html:
                      replyTo.message?.length > 100
                        ? `${replyTo.message.slice(0, 100)}...`
                        : replyTo.message,
                  }}
                />

                <IconButton
                  size="small"
                  onClick={() => setReplyTo(null)}
                  sx={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    color: "#777",
                    "&:hover": { color: "#000" },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
             <Editor onChange={handleEditorChange} value={editorContent} />
             <Button
              onClick={() => updateChatDescription(editorContent, replyTo)}
 

             
              variant="contained"
              sx={{ height: "fit-content", alignSelf: "end" }}
            >
              Send
            </Button>
          </Box>
     
    </Box>
  );
};

export default ChatDetails;
