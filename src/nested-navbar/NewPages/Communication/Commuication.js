import { Box, Button, Typography, Divider, Paper } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import NewChatDrawer from "./NewChatDrawer";
import { useParams } from "react-router-dom";
import TelegramIcon from "@mui/icons-material/Telegram";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ChatDetails from "./ChatDetails";
import axios from "axios";
import { LoginContext } from "../../../Sidebar/Context/Context";
const Commuication = () => {
  
  const { logindata } = useContext(LoginContext);
  console.log("login data", logindata);
  const [loginUserId, setLoginUserId] = useState();

  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);

  console.log("Login User ID:", loginUserId);
  const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
  const [isActiveTrue, setIsActiveTrue] = useState(true);
  const { data } = useParams();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [chatList, setChatList] = useState([]);

  const [time, setTime] = useState();
  const accountwiseChatlist = (accId, ActiveTrue) => {
    console.log(accId);
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${CHATTOCLIENT_API}/chats/chatsaccountwise/isactivechat/${data}/${isActiveTrue}`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setChatList(result.chataccountwise);
        if (result.chataccountwise && result.chataccountwise.length > 0) {
          result.chataccountwise.forEach((chat) => {
            console.log(chat.chatsubject);
            console.log(chat.description);

            chat.description.forEach((message) => {
              console.log(message._id);
            });

            setTime(chat.updatedAt);
          });
          // setIsSubmitted(true)
        } else {
          console.log("No chat data available");
        }
      })
      .catch((error) => console.error(error));
  };
  useEffect(() => {
    accountwiseChatlist(data, isActiveTrue);
  }, []);
  const formattedTime = new Date(time)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    })
    .replace(",", "");
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatId, setChatId] = useState("");
  const handleShowChat = (chatId) => {
    const chat = chatList.find((c) => c._id === chatId);
    setSelectedChat(chat);
    setChatId(chatId);
    updatechatStatus(chatId)
      .then(() => {
        accountwiseChatlist(data, isActiveTrue);
      })
      .catch((error) => {
        console.error("Error updating chat status:", error);
      });
  };
  const updatechatStatus = (chatId) => {
    return new Promise((resolve, reject) => {
      let data = JSON.stringify({
        chatstatus: true,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${CHATTOCLIENT_API}/chats/accountchat/updatestatus/${chatId}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log("Status updated:", JSON.stringify(response.data));
          resolve(); // Resolve the promise if successful
        })
        .catch((error) => {
          console.error("Error updating chat status:", error);
          reject(error); // Reject the promise if there's an error
        });
    });
  };

  const getsChatDetails = async () => {
    try {
      const url = `${CHATTOCLIENT_API}/chats/chatsaccountwise/`;
      const response = await fetch(url + chatId);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log("get chat by id", data);
      setSelectedChat(data.chat);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Box mt={2}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5">Chats & tasks</Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--color-save-btn)", // Normal background

            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)", // Hover background color
            },
            borderRadius: "15px",
          }}
          onClick={handleOpen}
        >
          New Chat
        </Button>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: { sm: "100%", md: "1700px" },
          height: "90vh",
          display: "flex",
          p: 1,
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: "30%",
            height: "100%",
            overflowY: "auto",
            borderRight: "1px solid #ddd",
            pr: 1,
          }}
        >
          {chatList.length > 0 &&
            chatList.map((chat, index) => (
              <Box key={index}>
                <Paper
                  sx={{ p: 1, cursor: "pointer" }}
                  onClick={() => handleShowChat(chat._id)}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={1.5}
                    mb={1}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <TelegramIcon
                        sx={{
                          color: chat.chatstatus ? "#007bff" : "green",
                        }}
                        fontSize="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        Chat with {chat.accountid.accountName}
                      </Typography>
                    </Box>
                    {!chat.chatstatus && (
                      <FiberManualRecordIcon
                        fontSize="small"
                        sx={{ color: "green" }}
                      />
                    )}
                  </Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    {chat.chatsubject}
                  </Typography>

                  {/* <Typography variant="caption" gutterBottom>
                    {(() => {
                      const messages = chat.description || [];
                      const latestMessage = messages[messages.length - 1];

                      if (!latestMessage) return "No messages yet";

                      const cleanMessage =
                        latestMessage.message?.replace(/<[^>]+>/g, "") || "";
                      const senderName =
                        latestMessage.senderid.username || "Unknown";

                      return `${senderName}: ${cleanMessage.length > 35 ? cleanMessage.slice(0, 35) + "..." : cleanMessage}`;
                    })()}
                  </Typography> */}
                  <Typography variant="caption" gutterBottom>
                    {(() => {
                      const messages = chat.description || [];
                      const latestMessage = messages[messages.length - 1];

                      if (!latestMessage) return "No messages yet";

                      const cleanMessage =
                        latestMessage.message?.replace(/<[^>]+>/g, "") || "";

                      const senderName =
                       latestMessage.fromwhome === "Admin"
                          ? "You"
                          : latestMessage.senderid?.username || "";

                      return `${senderName}: ${
                        cleanMessage.length > 35
                          ? cleanMessage.slice(0, 35) + "..."
                          : cleanMessage
                      }`;
                    })()}
                  </Typography>

                  <Box textAlign="right">
                    <Typography variant="caption" color="text.secondary">
                      {formattedTime}
                    </Typography>
                  </Box>
                </Paper>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))}
        </Box>

        <Box sx={{ width: "70%", height: "100%", overflowY: "auto" }}>
          {selectedChat ? (
            <ChatDetails
              chat={selectedChat}
              getsChatDetails={getsChatDetails}
              accountwiseChatlist={accountwiseChatlist}
            />
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Select a chat to view details
            </Typography>
          )}
        </Box>
      </Box>

      <NewChatDrawer
        handleClose={handleClose}
        open={open}
        accountwiseChatlist={accountwiseChatlist}
      />
    </Box>
  );
};

export default Commuication;
