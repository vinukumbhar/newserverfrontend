import React from "react";
import { Box, Typography, Divider } from "@mui/material";

const ChatDetails = ({ chat }) => {
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
      {chat.description.map((desc, idx) => (
        <Box key={idx} sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            dangerouslySetInnerHTML={{ __html: desc.message }}
          />
          <Typography variant="caption" color="text.secondary">
            {new Date(desc.timestamp).toLocaleString()}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ChatDetails;
