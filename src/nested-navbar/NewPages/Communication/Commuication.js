// import { Box, Button, Typography, Divider, Paper } from "@mui/material";
// import React, { useState, useEffect, useContext } from "react";
// import NewChatDrawer from "./NewChatDrawer";
// import { useParams } from "react-router-dom";
// import TelegramIcon from "@mui/icons-material/Telegram";
// import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
// import ChatDetails from "./ChatDetails";
// import axios from "axios";
// import { Checkbox } from "@mui/material";
// import { toast } from "react-toastify";
// import { LoginContext } from "../../../Sidebar/Context/Context";
// import { Archive, Delete } from "@mui/icons-material";
// const Commuication = () => {
//   const { logindata } = useContext(LoginContext);
//   console.log("login data", logindata);
//   const [loginUserId, setLoginUserId] = useState();

//   useEffect(() => {
//     if (logindata?.user?.id) {
//       setLoginUserId(logindata.user.id);
//     }
//   }, [logindata]);

//   console.log("Login User ID:", loginUserId);
//   const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
//   const [isActiveTrue, setIsActiveTrue] = useState(true);
//   const { data } = useParams();
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const [chatList, setChatList] = useState([]);

//   const [time, setTime] = useState();
//   const accountwiseChatlist = (accId, ActiveTrue) => {
//     console.log(accId);
//     const requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };
//     const url = `${CHATTOCLIENT_API}/chats/chatsaccountwise/isactivechat/${data}/${isActiveTrue}`;

//     fetch(url, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result);
//         setChatList(result.chataccountwise);
//         if (result.chataccountwise && result.chataccountwise.length > 0) {
//           result.chataccountwise.forEach((chat) => {
//             console.log(chat.chatsubject);
//             console.log(chat.description);

//             chat.description.forEach((message) => {
//               console.log(message._id);
//             });

//             setTime(chat.updatedAt);
//           });
//           // setIsSubmitted(true)
//         } else {
//           console.log("No chat data available");
//         }
//       })
//       .catch((error) => console.error(error));
//   };
//   useEffect(() => {
//     accountwiseChatlist(data, isActiveTrue);
//   }, []);
//   const formattedTime = new Date(time)
//     .toLocaleDateString("en-US", {
//       month: "short",
//       day: "2-digit",
//     })
//     .replace(",", "");
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [chatId, setChatId] = useState("");
//   const handleShowChat = (chatId) => {
//     const chat = chatList.find((c) => c._id === chatId);
//     setSelectedChat(chat);
//     setChatId(chatId);
//     updatechatStatus(chatId)
//       .then(() => {
//         accountwiseChatlist(data, isActiveTrue);
//       })
//       .catch((error) => {
//         console.error("Error updating chat status:", error);
//       });
//   };
//   const updatechatStatus = (chatId) => {
//     return new Promise((resolve, reject) => {
//       let data = JSON.stringify({
//         chatstatus: true,
//       });

//       let config = {
//         method: "post",
//         maxBodyLength: Infinity,
//         url: `${CHATTOCLIENT_API}/chats/accountchat/updatestatus/${chatId}`,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         data: data,
//       };

//       axios
//         .request(config)
//         .then((response) => {
//           console.log("Status updated:", JSON.stringify(response.data));
//           resolve(); // Resolve the promise if successful
//         })
//         .catch((error) => {
//           console.error("Error updating chat status:", error);
//           reject(error); // Reject the promise if there's an error
//         });
//     });
//   };

//   const getsChatDetails = async () => {
//     try {
//       const url = `${CHATTOCLIENT_API}/chats/chatsaccountwise/`;
//       const response = await fetch(url + chatId);
//       if (!response.ok) {
//         throw new Error("Failed to fetch data");
//       }
//       const data = await response.json();
//       console.log("get chat by id", data);
//       setSelectedChat(data.chat);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };
//   const [selectedChatIds, setSelectedChatIds] = useState([]);
//   const handleCheckboxChange = (chatId) => {
//     setSelectedChatIds((prevSelected) =>
//       prevSelected.includes(chatId)
//         ? prevSelected.filter((id) => id !== chatId)
//         : [...prevSelected, chatId]
//     );
//   };

//   const isChatSelected = (chatId) => selectedChatIds.includes(chatId);

//   const handleBulkDelete = async () => {
//     console.log("Deleting chats:", selectedChatIds);

//     const isConfirmed = window.confirm(
//       "Are you sure you want to delete the selected chats? This action cannot be undone."
//     );

//     if (isConfirmed) {
//       try {
//         // Make delete requests for each selected job
//         await Promise.all(
//           selectedChatIds.map((id) =>
//             fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise/` + id, {
//               method: "DELETE",
//               redirect: "follow",
//             })
//           )
//         );

//         toast.success("Chat deleted successfully!");
//         setSelectedChatIds([]); // Clear the selected jobs
//         accountwiseChatlist(); // Refresh the data after deletion
//       } catch (error) {
//         console.error("Delete API Error:", error);
//         toast.error("Failed to delete selected jobs");
//       }
//     }
//     // TODO: Add API call
//   };

//   const handleBulkArchive = () => {
//     console.log("Archiving chats:", selectedChatIds);

//     selectedChatIds.forEach((chatId) => {
//       handleArchiveJob(chatId);
//     });

//     // TODO: Add API call
//   };
//   const handleArchiveJob = (selectedChatIds) => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       active: !isActiveTrue,
//     });
//     console.log(raw);
//     const requestOptions = {
//       method: "PATCH",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow",
//     };
//     const url = `${CHATTOCLIENT_API}/chats/chatsaccountwise/${selectedChatIds}`;
//     fetch(url, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result);
//         toast.success("chats archived successfully");
//         setSelectedChatIds([]);
//         accountwiseChatlist(data, isActiveTrue);
//       })
//       .catch((error) => {
//         console.error(error); // Log the error
//         toast.error("An error occurred while submitting the form"); // Display error toast
//       });
//   };

//   return (
//     <Box mt={2}>
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             // justifyContent: "space-between",
//             gap: 3,
//           }}
//         >
//           <Typography variant="h5">Chats & tasks</Typography>
//           <Box>
//             {selectedChatIds.length > 0 && (
//               <Box sx={{ display: "flex", gap: 2, my: 2 }}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1,
//                     cursor: "pointer",
//                   }}
//                   onClick={handleBulkDelete}
//                 >
//                   <Delete />
//                   Delete
//                 </Box>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1,
//                     cursor: "pointer",
//                   }}
//                   onClick={handleBulkArchive}
//                 >
//                   <Archive />
//                   Archive
//                 </Box>
//               </Box>
//             )}
//           </Box>
//         </Box>
//         <Button
//           variant="contained"
//           sx={{
//             backgroundColor: "var(--color-save-btn)", // Normal background

//             "&:hover": {
//               backgroundColor: "var(--color-save-hover-btn)", // Hover background color
//             },
//             borderRadius: "15px",
//           }}
//           onClick={handleOpen}
//         >
//           New Chat
//         </Button>
//       </Box>
//       <Box
//         sx={{
//           width: "100%",
//           maxWidth: { sm: "100%", md: "1700px" },
//           height: "90vh",
//           display: "flex",
//           p: 1,
//           gap: 2,
//         }}
//       >
//         <Box
//           sx={{
//             width: "30%",
//             height: "100%",
//             overflowY: "auto",
//             borderRight: "1px solid #ddd",
//             pr: 1,
//           }}
//         >
//           {chatList.length > 0 &&
//             chatList.map((chat, index) => (
//               <Box key={index}>
//                 <Paper
//                   sx={{ p: 1, cursor: "pointer" }}
//                   onClick={() => handleShowChat(chat._id)}
//                 >
//                   <Box
//                     display="flex"
//                     alignItems="center"
//                     justifyContent="space-between"
//                     gap={1.5}
//                     mb={1}
//                   >
//                     <Box display="flex" alignItems="center" gap={1}>
//                       <Checkbox
//                         size="small"
//                         checked={isChatSelected(chat._id)}
//                         onChange={() => handleCheckboxChange(chat._id)}
//                         onClick={(e) => e.stopPropagation()} // Prevent opening chat when clicking checkbox
//                       />
//                       <TelegramIcon
//                         sx={{
//                           color: chat.chatstatus ? "#007bff" : "green",
//                         }}
//                         fontSize="small"
//                       />
//                       <Typography variant="caption" color="text.secondary">
//                         Chat with {chat.accountid.accountName}
//                       </Typography>
//                     </Box>
//                     {!chat.chatstatus && (
//                       <FiberManualRecordIcon
//                         fontSize="small"
//                         sx={{ color: "green" }}
//                       />
//                     )}
//                   </Box>
//                   <Typography variant="subtitle2" fontWeight={600} gutterBottom>
//                     {chat.chatsubject}
//                   </Typography>

//                   <Typography variant="caption" gutterBottom>
//                     {(() => {
//                       const messages = chat.description || [];
//                       const latestMessage = messages[messages.length - 1];

//                       if (!latestMessage) return "No messages yet";

//                       const cleanMessage =
//                         latestMessage.message?.replace(/<[^>]+>/g, "") || "";

//                       const senderName =
//                         latestMessage.fromwhome === "Admin"
//                           ? "You"
//                           : latestMessage.senderid?.username || "";

//                       return `${senderName}: ${
//                         cleanMessage.length > 35
//                           ? cleanMessage.slice(0, 35) + "..."
//                           : cleanMessage
//                       }`;
//                     })()}
//                   </Typography>

//                   <Box textAlign="right">
//                     <Typography variant="caption" color="text.secondary">
//                       {formattedTime}
//                     </Typography>
//                   </Box>
//                 </Paper>
//                 <Divider sx={{ my: 1 }} />
//               </Box>
//             ))}
//         </Box>

//         <Box sx={{ width: "70%", height: "100%", overflowY: "auto" }}>
//           {selectedChat ? (
//             <ChatDetails
//               chat={selectedChat}
//               getsChatDetails={getsChatDetails}
//               accountwiseChatlist={accountwiseChatlist}
//               onChatAction={() => setSelectedChat(null)}
//             />
//           ) : (
//             <Typography variant="body1" sx={{ mt: 2 }}>
//               Select a chat to view details
//             </Typography>
//           )}
//         </Box>
//       </Box>

//       <NewChatDrawer
//         handleClose={handleClose}
//         open={open}
//         accountwiseChatlist={accountwiseChatlist}
//       />
//     </Box>
//   );
// };

// export default Commuication;

import {
  Box,
  Button,
  Typography,
  Divider,
  Paper,
  Checkbox,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import NewChatDrawer from "./NewChatDrawer";
import { useParams } from "react-router-dom";
import TelegramIcon from "@mui/icons-material/Telegram";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ChatDetails from "./ChatDetails";
import axios from "axios";
import { toast } from "react-toastify";
import { LoginContext } from "../../../Sidebar/Context/Context";
import { Archive, Delete } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
const Commuication = () => {
  const theme = useTheme();
  const { logindata } = useContext(LoginContext);
  const [loginUserId, setLoginUserId] = useState();
  const { data } = useParams();

  const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;

  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatId, setChatId] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState([]);
  const [isActiveTrue, setIsActiveTrue] = useState(true); // Toggle state

  const [time, setTime] = useState();

  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);

  useEffect(() => {
    accountwiseChatlist(data, isActiveTrue);
  }, [isActiveTrue, data]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const accountwiseChatlist = (accId, active) => {
    const url = `${CHATTOCLIENT_API}/chats/chatsaccountwise/isactivechat/${accId}/${active}`;

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setChatList(result.chataccountwise || []);
        if (result.chataccountwise?.length > 0) {
          result.chataccountwise.forEach((chat) => {
            setTime(chat.updatedAt);
          });
        }
      })
      .catch((error) => console.error("Error fetching chat list:", error));
  };
  // Function to count unread admin messages
const countUnreadAdminMessages = (chat) => {
  if (!chat.description || !Array.isArray(chat.description)) return 0;
  
  const unreadCount = chat.description.reduce((count, message) => {
    // Check if message is unread and from Admin
    if (message.isRead === false && message.fromwhome === "client") {
      return count + 1;
    }
    return count;
  }, 0);

  console.log(`Unread count for chat ${chat._id}:`, unreadCount);
  return unreadCount;
};
  const formattedTime = new Date(time)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    })
    .replace(",", "");

  // const handleShowChat = (chatId) => {
  //   const chat = chatList.find((c) => c._id === chatId);
  //   setSelectedChat(chat);
  //   setChatId(chatId);
    
  // };

  const handleShowChat = async (chatId) => {
  try {
    // Mark as read
    await axios.patch(`${CHATTOCLIENT_API}/chats/mark-all-read/${chatId}/accounts/${data}/Admin`);
    
    // // Navigate to the chat
    // navigate(`/updatechat/${chatId}`);
    accountwiseChatlist(data, isActiveTrue);
    // Update local state
    const chat = chatList.find((c) => c._id === chatId);
    setSelectedChat(chat);
    setChatId(chatId);
    
  } catch (error) {
    console.error("Error marking message as read:", error);
  }
};


  const getsChatDetails = async () => {
    try {
      const url = `${CHATTOCLIENT_API}/chats/chatsaccountwise/${chatId}`;
      const response = await fetch(url);
      const data = await response.json();
      setSelectedChat(data.chat);
    } catch (error) {
      console.error("Error fetching chat details:", error);
    }
  };

  const handleCheckboxChange = (chatId) => {
    setSelectedChatIds((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
  };

  const isChatSelected = (chatId) => selectedChatIds.includes(chatId);

  const handleBulkDelete = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected chats?"
    );
    if (isConfirmed) {
      try {
        await Promise.all(
          selectedChatIds.map((id) =>
            fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise/${id}`, {
              method: "DELETE",
            })
          )
        );
        toast.success("Chats deleted successfully!");
        setSelectedChatIds([]);
        accountwiseChatlist(data, isActiveTrue);
      } catch (error) {
        console.error("Delete API Error:", error);
        toast.error("Failed to delete selected chats");
      }
    }
  };

  const handleBulkArchive = () => {
    selectedChatIds.forEach((id) => handleArchiveJob(id));
  };

  const handleArchiveJob = (chatId) => {
    fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise/${chatId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !isActiveTrue }),
    })
      .then((res) => res.json())
      .then((res) => {
        toast.success("Chat archived successfully");
        setSelectedChatIds([]);
        accountwiseChatlist(data, isActiveTrue);
      })
      .catch((err) => {
        console.error("Archive Error:", err);
        toast.error("Failed to archive chat");
      });
  };

  return (
    <Box mt={2}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Box display="flex" alignItems="center" gap={3}>
          <Typography variant="h5">Chats & tasks</Typography>

          <ToggleButtonGroup
            value={isActiveTrue}
            exclusive
            onChange={(e, newValue) => {
              if (newValue !== null) {
                setSelectedChat(null);
                setIsActiveTrue(newValue);
              }
            }}
            size="small"
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#EBF0F5",
              borderRadius: "12px",
              padding: "6px",
              width: "max-content",
            }}
          >
            <ToggleButton
              value={true}
              sx={{
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: isActiveTrue === true ? "bold" : "normal",
                color: isActiveTrue === true ? "var(--color-save-btn)" : "#333",
                backgroundColor: isActiveTrue === true ? "#fff" : "transparent",
                textTransform: "none",
                transition: "all 0.3s ease",
                "&.Mui-selected": {
                  backgroundColor: "#fff !important",
                  fontWeight: "bold",
                  color: "var(--color-save-btn)",
                },
              }}
            >
              Active
            </ToggleButton>

            <ToggleButton
              value={false}
              sx={{
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: isActiveTrue === false ? "bold" : "normal",
                color:
                  isActiveTrue === false ? "var(--color-save-btn)" : "#333",
                backgroundColor:
                  isActiveTrue === false ? "#fff" : "transparent",
                textTransform: "none",
                transition: "all 0.3s ease",
                "&.Mui-selected": {
                  backgroundColor: "#fff !important",
                  fontWeight: "bold",
                  color: "var(--color-save-btn)",
                },
              }}
            >
              Archived
            </ToggleButton>
          </ToggleButtonGroup>



          {selectedChatIds.length > 0 && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{ cursor: "pointer", color: "red" }}
                onClick={handleBulkDelete}
              >
                <Delete />
                Delete
              </Box>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{ cursor: "pointer" }}
                onClick={handleBulkArchive}
              >
                <Archive />
                {isActiveTrue ? "Archive" : "Unarchive"}
              </Box>
            </Box>
          )}
        </Box>

        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--color-save-btn)",
            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)",
            },
            borderRadius: "15px",
          }}
          onClick={handleOpen}
        >
          New Chat
        </Button>
      </Box>

      <Box display="flex" height="90vh" gap={2} p={1}>
        {/* Chat list */}
        <Box
          width="30%"
          height="100%"
          overflow="auto"
          pr={1}
          borderRight="1px solid #ddd"
        >
          {chatList.length > 0 ? (
            chatList.map((chat, index) => {

               const unreadCount = countUnreadAdminMessages(chat);
                return (
              <Box key={index}>
                <Paper
                  sx={{ p: 1, cursor: "pointer" }}
                  onClick={() => handleShowChat(chat._id)}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Checkbox
                        size="small"
                        checked={isChatSelected(chat._id)}
                        onChange={() => handleCheckboxChange(chat._id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <TelegramIcon
                        fontSize="small"
                        sx={{ color: chat.chatstatus ? "#007bff" : "green" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Chat with {chat.accountid?.accountName}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      {/* Show unread count badge if there are unread messages */}
                      {unreadCount > 0 && (
                        <Box
                          sx={{
                            backgroundColor: theme.palette.success.main,
                            color: "white",
                            borderRadius: "50%",
                            width: 20,
                            height: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                          }}
                        >
                          {unreadCount}
                        </Box>
                      )}
                     
                    </Box>
                  </Box>

                  <Typography variant="subtitle2" fontWeight={600}>
                    {chat.chatsubject}
                  </Typography>

                  <Typography variant="caption">
                    {(() => {
                      const messages = chat.description || [];
                      const latest = messages[messages.length - 1];
                      if (!latest) return "No messages yet";

                      const clean =
                        latest.message?.replace(/<[^>]+>/g, "") || "";
                      const sender =
                        latest.fromwhome === "Admin"
                          ? "You"
                          : latest.senderid?.username || "";

                      return `${sender}: ${
                        clean.length > 35 ? clean.slice(0, 35) + "..." : clean
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
                )
})
          ) : (
            <Typography variant="body2" color="text.secondary">
              No chats to display
            </Typography>
          )}
        </Box>

        {/* Chat details */}
        <Box width="70%" height="100%" overflow="auto">
          {selectedChat ? (
            <ChatDetails
              chat={selectedChat}
              getsChatDetails={getsChatDetails}
              accountwiseChatlist={accountwiseChatlist}
              data={data}
              isActiveTrue={isActiveTrue}
              onChatAction={() => setSelectedChat(null)}
            />
          ) : (
            <Typography variant="body1" mt={2}>
              Select a chat to view details
            </Typography>
          )}
        </Box>
      </Box>

      <NewChatDrawer
        handleClose={handleClose}
        open={open}
        accountwiseChatlist={accountwiseChatlist}
         data={data}
              isActiveTrue={isActiveTrue}
      />
    </Box>
  );
};

export default Commuication;
