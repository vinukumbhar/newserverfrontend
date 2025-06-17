

import {
  Box,
  Typography,
  Divider,
  Grid,
  Checkbox,
  IconButton,
  Button,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import React, { useEffect, useState, useRef, useContext } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import Editor from "./Texteditor";
import { LoginContext } from "../../../Sidebar/Context/Context";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";


const ChatDetails = ({ chat, getsChatDetails, accountwiseChatlist,onChatAction ,data, isActiveTrue }) => {
  const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
  const [showTasks, setShowTasks] = useState(false);
  const [chatId, setChatId] = useState(chat._id);
  const [chatTemplate, setChatTemplate]=useState(chat.chattemplateid)
  const { logindata } = useContext(LoginContext);
  const [loginUserId, setLoginUserId] = useState();
  const messageRefs = useRef({});
  const [highlightedId, setHighlightedId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [tasks, setTasks] = useState([]);
  const [chatanchorEl, setChatAnchorEl] = useState(null);
  const handleChatMenuClose = () => {
    setChatAnchorEl(null);
  };
  useEffect(() => {
    if (logindata?.user?.id) {
      const id = logindata.user.id;
      setLoginUserId(id);
      // setLoginUserId(logindata.user.id);
      fetchUserData(id)
    }
    if (chat.clienttasks) {
      setTasks(chat.clienttasks.flat());
    }
  }, [logindata, chat.clienttasks]);
   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
   const [senderEmail,setSenderEmail]= useState("")
   const [senderName,setSenderName]=useState("")
 const fetchUserData = async (id) => {
  
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url , requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("id", result);
        setSenderEmail(result.email)
setSenderName(result.username)
      });
  };
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

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const toggleTasks = () => {
    setShowTasks(!showTasks);
  };

  const updateChatDescription = (message = "") => {
    const contentToSend = message.trim() || editorContent.trim();
    if (!contentToSend) return;

    const newDescription = {
      message: contentToSend,
      fromwhome: "Admin",
      senderid: loginUserId,
    };

    if (replyTo) {
      newDescription.replyTo = replyTo._id;
    }

    setEditorContent("");
    setReplyTo(null);
    const raw = JSON.stringify({
      newDescriptions: [newDescription],
    });

    fetch(
      `${CHATTOCLIENT_API}/chats/chatsaccountwise/chatupdatemessage/${chatId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: raw,
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update");
        return response.json();
      })
      .then(() => {
        toast.success("Message sent");
         securemessagechatsend(chatId);
        updatechatStatus(chatId);
      accountwiseChatlist(data, isActiveTrue);
        getsChatDetails();
      })
      .catch(() => {
        toast.error("Send failed");
      });
  };

   const securemessagechatsend = (chatId) => {
    console.log("bvhg", chatId)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountid: data,
      chattemplateid: chatTemplate,
      username: senderName,
      viewchatlink: "/login",
      chatId: chatId,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${CHATTOCLIENT_API}/chatmsg/securemessagechatsend`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };
  const updatechatStatus = (chatId) => {
    return new Promise((resolve, reject) => {
      let data = JSON.stringify({
        chatstatus: false,
      });

      let config = {
        method: "PATCH",
        maxBodyLength: Infinity,
        url: `${CHATTOCLIENT_API}/chats/chatsaccountwise/${chatId}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log("Status updated:", JSON.stringify(response.data));
          // resolve();
        })
        .catch((error) => {
          console.error("Error updating chat status:", error);
          reject(error);
        });
    });
  };

  const handleTaskToggle = (id) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, checked: !task.checked } : task
    );
    setTasks(updated);
  };

  const handleAddTask = () => {
    const maxId =
      tasks.length > 0 ? Math.max(...tasks.map((task) => Number(task.id))) : 0;

    const newTaskItem = {
      id: maxId + 1,
      text: "",
      checked: false,
    };

    setTasks([...tasks, newTaskItem]);
  };

  const handleDeleteTask = (id) => {
    const updated = tasks.filter((task) => task.id !== id);
    setTasks(updated);
  };

  const handleTaskTextChange = (id, newText) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, text: newText } : task
    );
    setTasks(updated);
  };

  const resendClientTask = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      chatId: chatId,
      newTask: tasks,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${CHATTOCLIENT_API}/chats/chatsaccountwise/addclienttask`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const taskMessages = tasks
          .filter((task) => !task.checked)
          .map((task) => `• ${task.text}`)
          .join("\n");

        const description = `${taskMessages}`;
        updateAdminChatDescription(description);
      })
      .catch((error) => console.error(error));
  };

  const updateAdminChatDescription = (description) => {
    if (!description.trim()) return;
    const newDescription = {
      message: description,
      fromwhome: "Admin",
      senderid: loginUserId,
    };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      newDescriptions: [newDescription],
    });
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `${CHATTOCLIENT_API}/chats/chatsaccountwise/chatupdatemessage/${chatId}`,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        toast.success("Chat description updated successfully");
        getsChatDetails();
        updatechatStatus(chatId);
   accountwiseChatlist(data, isActiveTrue);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to update chat description. Please try again.");
      });
  };

  const handleDeleteMessage = async (messageToDelete) => {
    try {
      const raw = JSON.stringify({
        chatId: chatId,
        messageId: messageToDelete._id,
      });

      const response = await fetch(
        `${CHATTOCLIENT_API}/chats/chatsaccountwise/chatmessage/bymessageid/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: raw,
        }
      );

      if (!response.ok) throw new Error("Failed to delete message");

      toast.success("Message deleted successfully");
      getsChatDetails();
  accountwiseChatlist(data, isActiveTrue);
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleArchiveThread = (chatId) => {
    // Archive logic (e.g., update chat status or move to archive)
  const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  
      const raw = JSON.stringify({
      active: !chat.active,
      });
      console.log(raw);
      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${CHATTOCLIENT_API}/chats/chatsaccountwise/${chatId}`;
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          toast.success("chats archived successfully");
            accountwiseChatlist(data, isActiveTrue);
          onChatAction();
     

        })
        .catch((error) => {
          console.error(error); // Log the error
          toast.error("An error occurred while submitting the form"); // Display error toast
        });
    handleChatMenuClose();
    //   toast.success("Thread archived",chatId);
  };

  const handleDeleteThread = async () => {
    try {
      const response = await fetch(
        `${CHATTOCLIENT_API}/chats/chatsaccountwise/${chatId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete thread");
onChatAction();
      toast.success("Thread deleted successfully");
 accountwiseChatlist(data, isActiveTrue); // refresh list
    } catch (error) {
      console.error("Error deleting thread:", error);
      toast.error("Failed to delete thread");
    }
  };

  if (!chat) return null;

  return (
    <Box sx={{ display: "flex" }}>
      {/* Main Chat Area */}
      <Box sx={{ flex: 1, overflow: "hidden", pr: showTasks ? 2 : 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              {chat.accountid.accountName}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              {chat.chatsubject}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* {tasks.length > 0 && (
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{
                  cursor: "pointer",
                }}
                onClick={toggleTasks}
              >
                Client Tasks:{" "}
                {`${tasks.filter((task) => task.checked).length}/${tasks.length}`}
              </Typography>
            )} */}
            {tasks.length > 0 ? (
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ cursor: "pointer" }}
                onClick={toggleTasks}
              >
                Client Tasks:{" "}
                {`${tasks.filter((task) => task.checked).length}/${tasks.length}`}
              </Typography>
            ) : (
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ cursor: "pointer", color: "primary.main" }}
                onClick={toggleTasks}
              >
                + Add Client Task
              </Typography>
            )}

            <IconButton
              sx={{ cursor: "pointer" }}
              onClick={(e) => setChatAnchorEl(e.currentTarget)}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={chatanchorEl}
              open={Boolean(chatanchorEl)}
              onClose={handleChatMenuClose}
            >
              <MenuItem
                onClick={() => {
                  handleArchiveThread(chatId);
                }}
              >
                {/* Archive Thread */}
                 {chat.active ? "Archive Thread" : "Activate Thread"}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleDeleteThread();
                  handleChatMenuClose();
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box height={"40vh"} sx={{ overflowY: "auto", mt: 1, mb: 1 }}>
          {Array.isArray(chat.description) &&
            chat.description.length > 0 &&
            chat.description.map((desc, index) => (
              <MessageItem
                key={desc._id || index}
                desc={desc}
                chat={chat}
                messageRefs={messageRefs}
                highlightedId={highlightedId}
                setHighlightedId={setHighlightedId}
                handleMenuClick={handleMenuClick}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                selectedMessage={selectedMessage}
                setReplyTo={setReplyTo}
                formatDate={formatDate}
                loginUserId={loginUserId}
                handleDeleteMessage={handleDeleteMessage}
              />
            ))}
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
            <ReplyPreview replyTo={replyTo} setReplyTo={setReplyTo} />
          )}
          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            {" "}
            <Editor onChange={handleEditorChange} value={editorContent} />
            <Button
              onClick={() => updateChatDescription()}
              variant="contained"
              sx={{ height: "fit-content", alignSelf: "end" }}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Tasks Panel */}
      {showTasks && (
        <Box
          sx={{
            width: 300,
            borderLeft: "1px solid #e0e0e0",
            pl: 2,
            pr: 1,

            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pt: 2,
              pb: 1,
            }}
          >
            <Typography variant="h6">Client Tasks</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={handleAddTask} color="primary">
                <AddIcon />
              </IconButton>
              <IconButton onClick={toggleTasks} color="primary">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <List>
            {tasks.map((task) => (
              <ListItem
                key={task.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 0,
                }}
              >
                <Checkbox
                  checked={task.checked}
                  onChange={() => handleTaskToggle(task.id)}
                />
                <TextField
                  value={task.text}
                  onChange={(e) =>
                    handleTaskTextChange(task.id, e.target.value)
                  }
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    mr: 1,
                    textDecoration: task.checked ? "line-through" : "none",
                    input: {
                      color: task.checked ? "#777" : "inherit",
                    },
                  }}
                />
                <IconButton
                  onClick={() => handleDeleteTask(task.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={resendClientTask}>
            Resend Client Task
          </Button>
        </Box>
      )}
    </Box>
  );
};

const MessageItem = ({
  desc,
  chat,
  messageRefs,
  highlightedId,
  setHighlightedId,
  handleMenuClick,
  anchorEl,
  setAnchorEl,
  selectedMessage,
  setReplyTo,
  formatDate,
  loginUserId,
  handleDeleteMessage,
}) => {
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
              ? "#fff2b3"
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
        {desc.replyTo && (
          <ReplyPreviewItem
            desc={desc}
            chat={chat}
            messageRefs={messageRefs}
            setHighlightedId={setHighlightedId}
          />
        )}

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
            onClick={(e) => handleMenuClick(e, desc)}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              elevation: 1,
              sx: {
                boxShadow: "none",
                borderRadius: "8px",
                border: "1px solid #ccc",
              },
            }}
          >
            <MenuItem
              onClick={() => {
                setReplyTo(selectedMessage);
                setAnchorEl(null);
              }}
            >
              Reply
            </MenuItem>
            {selectedMessage?.fromwhome?.toLowerCase() === "admin" && (
              <MenuItem
                onClick={() => {
                  handleDeleteMessage(selectedMessage);
                  setAnchorEl(null);
                }}
              >
                Delete
              </MenuItem>
            )}
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
};

const ReplyPreviewItem = ({ desc, chat, messageRefs, setHighlightedId }) => {
  const repliedMsg = chat.description.find((msg) => msg._id === desc.replyTo);
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
            setTimeout(() => setHighlightedId(null), 2000);
          }
        }}
      >
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
};

const ReplyPreview = ({ replyTo, setReplyTo }) => (
  <Box
    sx={{
      gridColumn: "1 / -1",
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
);

export default ChatDetails;

















// import { Box, Typography, Divider } from "@mui/material";
// import { toast } from "react-toastify";
// import React, { useEffect, useState, useRef, useContext } from "react";
// import {
//   // Box,
//   Grid,
//   Checkbox,
//   // Container,
//   IconButton,
//   // Typography,
//   Paper,
//   Button,
//   // Divider,
//   Stack,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import CloseIcon from "@mui/icons-material/Close";
// import Editor from "./Texteditor";
// import { LoginContext } from "../../Sidebar/Context/Context";
// import axios from "axios";
// const ChatDetails = ({ chat, getsChatDetails, accountwiseChatlist }) => {
//   console.log("chat details", chat);
//   const [chatId, setChatId] = useState(chat._id);
//   const { logindata } = useContext(LoginContext);
//   console.log("login data", logindata);
//   const [loginUserId, setLoginUserId] = useState();

//   useEffect(() => {
//     if (logindata?.user?.id) {
//       setLoginUserId(logindata.user.id);
//     }
//   }, [logindata]);

//   console.log("Login User ID:", loginUserId);

//   const formatDate = (timestamp) => {
//     const date = new Date(timestamp);
//     const day = date.getDate();
//     const month = date.toLocaleString("default", { month: "short" });
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const period = hours >= 12 ? "PM" : "AM";
//     const formattedHours = hours % 12 || 12;
//     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//     return `${day} ${month} ${formattedHours}:${formattedMinutes} ${period}`;
//   };
//   const messageRefs = useRef({});
//   const [highlightedId, setHighlightedId] = useState(null);
//   const [replyTo, setReplyTo] = useState(null);
//   const messagesEndRef = useRef(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedMessage, setSelectedMessage] = useState(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [chat.description]);

//   const handleMenuClick = (event, message) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedMessage(message);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedMessage(null);
//   };
//   const [editorContent, setEditorContent] = useState("");
//   const handleEditorChange = (content) => {
//     setEditorContent(content);
//   };
//   const updateChatDescription = (message = "") => {
//     const contentToSend = message.trim() || editorContent.trim();
//     if (!contentToSend) return;

//     const newDescription = {
//       message: contentToSend,
//       fromwhome: "Admin",
//       senderid: loginUserId,
//     };

//     if (replyTo) {
//       newDescription.replyTo = replyTo._id;
//     }

//     setEditorContent("");
//     setReplyTo(null);
//     const raw = JSON.stringify({
//       newDescriptions: [newDescription],
//     });

//     fetch(
//       `http://127.0.0.1/chats/chatsaccountwise/chatupdatemessage/${chatId}`,
//       {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: raw,
//       }
//     )
//       .then((response) => {
//         if (!response.ok) throw new Error("Failed to update");
//         return response.json();
//       })
//       .then(() => {
//         // Clear the editor and reply state

//         toast.success("Message sent");
//         updatechatStatus(chatId);
//         accountwiseChatlist();
//         getsChatDetails();
//       })
//       .catch(() => {
//         toast.error("Send failed");
//       });
//   };
//   // const updateChatDescription = (message = "") => {
//   //   const contentToSend = message.trim() || editorContent.trim();
//   //   if (!contentToSend) return;

//   //   const newDescription = {
//   //     message: contentToSend,
//   //     fromwhome: "Admin",
//   //     senderid: loginUserId,
//   //   };

//   //   if (replyTo) {
//   //     newDescription.replyTo = replyTo._id; // ✅ Use the message ID, not custom object
//   //   }

//   //   setEditorContent("");
//   //   setReplyTo(null);

//   //   const raw = JSON.stringify({
//   //     newDescriptions: [newDescription],
//   //   });

//   //   fetch(
//   //     `http://127.0.0.1/chats/chatsaccountwise/chatupdatemessage/${chatId}`,
//   //     {
//   //       method: "PATCH",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: raw,
//   //     }
//   //   )
//   //     .then((response) => {
//   //       if (!response.ok) throw new Error("Failed to update");
//   //       return response.json();
//   //     })
//   //     .then(() => {
//   //       toast.success("Message sent");
//   //       updatechatStatus(chatId);
//   //       accountwiseChatlist();
//   //       getsChatDetails();
//   //     })
//   //     .catch(() => toast.error("Send failed"));
//   // };
//   const updatechatStatus = (chatId) => {
//     return new Promise((resolve, reject) => {
//       let data = JSON.stringify({
//         chatstatus: false,
//       });

//       let config = {
//         method: "PATCH",
//         maxBodyLength: Infinity,
//         url: `http://127.0.0.1/chats/chatsaccountwise/${chatId}`,
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
//   if (!chat) return null;
//   return (
//     <Box>
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <Box>
//           <Typography variant="h6" gutterBottom>
//             {chat.accountid.accountName}
//           </Typography>
//           <Typography variant="subtitle2" gutterBottom>
//             {chat.chatsubject}
//           </Typography>
//         </Box>
//       {chat.clienttasks && chat.clienttasks.length > 0 && (
//         <Typography variant="subtitle2" sx={{cursor:'pointer'}}>
//           Client Tasks:{" "}
//           {(() => {
//             const flatTasks = chat.clienttasks.flat();
//             const totalTasks = flatTasks.length;
//             const checkedTasks = flatTasks.filter(task => task.checked).length;
//             return `${checkedTasks}/${totalTasks}`;
//           })()}
//         </Typography>
//       )}
//       </Box>

//       <Divider sx={{ my: 1 }} />
// <Box>
//    <Box height={"42vh"} sx={{ overflowY: "auto", mt: 1, mb: 1 }}>
//         {Array.isArray(chat.description) &&
//           chat.description.length > 0 &&
//           chat.description.map((desc, index) => {
//             const isClient = desc.fromwhome?.toLowerCase() === "client";
//             const isAdmin = desc.fromwhome?.toLowerCase() === "admin";
//             const messageTime = desc.time ? formatDate(desc.time) : "Just now";

//             let senderDisplayName = "";
//             if (isClient && desc.senderid?.username) {
//               senderDisplayName = desc.senderid.username;
//             } else if (isAdmin && desc.senderid?.username) {
//               senderDisplayName = "You";
//             }

//             return (
//               <Box
//                 key={desc._id || index}
//                 ref={(el) => {
//                   if (desc._id) {
//                     messageRefs.current[desc._id] = el;
//                   }
//                 }}
//                 sx={{
//                   display: "flex",
//                   justifyContent: isClient ? "flex-start" : "flex-end",
//                   mb: 2,
//                   position: "relative",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     maxWidth: "75%",

//                     backgroundColor:
//                       desc._id === highlightedId
//                         ? "#fff2b3" // highlight color
//                         : isAdmin
//                           ? "#ffe6e6"
//                           : "#e6f0ff",

//                     p: 2,
//                     borderRadius: 2,
//                     borderTopLeftRadius: isClient ? 16 : 4,
//                     borderTopRightRadius: isClient ? 4 : 16,
//                     boxShadow: 1,
//                     position: "relative",
//                   }}
//                 >
//                   {/* Show Reply Preview */}

//                   {desc.replyTo &&
//                     (() => {
//                       const repliedMsg = chat.description.find(
//                         (msg) => msg._id === desc.replyTo
//                       );
//                       if (!repliedMsg) return null;

//                       return (
//                         <Box
//                           sx={{
//                             backgroundColor: "#f5f5f5",
//                             borderLeft: "3px solid #1976d2",
//                             px: 1,
//                             py: 0.5,
//                             mb: 1,
//                           }}
//                         >
//                           <Typography
//                             variant="caption"
//                             fontWeight="bold"
//                             sx={{ cursor: "pointer", color: "#1976d2" }}
//                             onClick={() => {
//                               const el = messageRefs.current[desc.replyTo];
//                               if (el) {
//                                 el.scrollIntoView({
//                                   behavior: "smooth",
//                                   block: "center",
//                                 });
//                                 setHighlightedId(desc.replyTo);
//                                 setTimeout(() => setHighlightedId(null), 2000); // remove highlight after 2s
//                               }
//                             }}
//                           >
//                             {/* {repliedMsg.fromwhome === "client"
//                               ? "You"
//                               : repliedMsg.senderid?.username || "Admin"} */}
//                             {repliedMsg.fromwhome === "client"
//                               ? repliedMsg.senderid?.username
//                               : "You"}
//                           </Typography>

//                           <Typography
//                             variant="body2"
//                             sx={{ fontStyle: "italic", color: "#555" }}
//                             dangerouslySetInnerHTML={{
//                               __html:
//                                 repliedMsg.message?.length > 100
//                                   ? repliedMsg.message.slice(0, 100) + "..."
//                                   : repliedMsg.message,
//                             }}
//                           />
//                         </Box>
//                       );
//                     })()}

//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       color: "#333",
//                     }}
//                   >
//                     <Typography
//                       variant="subtitle2"
//                       component="p"
//                       gutterBottom
//                       sx={{ fontWeight: "600" }}
//                     >
//                       {senderDisplayName}
//                     </Typography>

//                     <MoreVertIcon
//                       fontSize="small"
//                       sx={{ cursor: "pointer" }}
//                       onClick={(e) => handleMenuClick(e, desc)} // 👈 Connect to your reply menu
//                     />
//                     <Menu
//                       anchorEl={anchorEl}
//                       open={Boolean(anchorEl)}
//                       onClose={() => setAnchorEl(null)}
//                       PaperProps={{
//                         elevation: 1, // Reduce elevation (0 to 24)
//                         sx: {
//                           boxShadow: "none", // Soft custom shadow
//                           borderRadius: "8px", // Optional: nicer corners
//                           border: "1px solid #ccc",
//                         },
//                       }}
//                     >
//                       <MenuItem
//                         onClick={() => {
//                           setReplyTo(selectedMessage);
//                           console.log(selectedMessage);
//                           setAnchorEl(null);
//                         }}
//                       >
//                         Reply
//                       </MenuItem>
//                     </Menu>
//                   </Box>

//                   <Typography
//                     variant="body2"
//                     sx={{ whiteSpace: "pre-wrap", color: "#333" }}
//                     dangerouslySetInnerHTML={{
//                       __html:
//                         typeof desc.message === "string"
//                           ? desc.message
//                           : "No message available",
//                     }}
//                   />
//                   <Typography
//                     variant="caption"
//                     sx={{
//                       display: "block",
//                       textAlign: "right",
//                       color: "gray",
//                       mt: 1,
//                     }}
//                   >
//                     {messageTime}
//                   </Typography>
//                 </Box>
//               </Box>
//             );
//           })}
//       </Box>
//       <Box
//         sx={{
//           display: "grid",
//           gridTemplateColumns: "1fr auto",
//           gap: 2,
//           alignItems: "start",
//         }}
//       >
//         {replyTo && (
//           <Box
//             sx={{
//               gridColumn: "1 / -1", // span full width of the grid
//               mb: 1,
//               p: 1.5,
//               backgroundColor: "#f4f6f8",
//               borderLeft: "4px solid #1976d2",
//               borderRadius: 1,
//               position: "relative",
//             }}
//           >
//             <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
//               Replying to:{" "}
//               {replyTo.fromwhome === "client"
//                 ? replyTo.senderid?.username
//                 : "You" || "Admin"}
//             </Typography>

//             <Typography
//               variant="body2"
//               sx={{ fontStyle: "italic", whiteSpace: "pre-wrap", pr: 4 }}
//               dangerouslySetInnerHTML={{
//                 __html:
//                   replyTo.message?.length > 100
//                     ? `${replyTo.message.slice(0, 100)}...`
//                     : replyTo.message,
//               }}
//             />

//             <IconButton
//               size="small"
//               onClick={() => setReplyTo(null)}
//               sx={{
//                 position: "absolute",
//                 top: 6,
//                 right: 6,
//                 color: "#777",
//                 "&:hover": { color: "#000" },
//               }}
//             >
//               <CloseIcon fontSize="small" />
//             </IconButton>
//           </Box>
//         )}
//         <Editor onChange={handleEditorChange} value={editorContent} />
//         <Button
//           onClick={() => updateChatDescription()}
//           variant="contained"
//           sx={{ height: "fit-content", alignSelf: "end" }}
//         >
//           Send
//         </Button>
//       </Box>
// </Box>

//     </Box>
//   );
// };

// export default ChatDetails;


// const ChatDetails = ({ chat, getsChatDetails, accountwiseChatlist }) => {
//     const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
//   const [showTasks, setShowTasks] = useState(false);
//   const [chatId, setChatId] = useState(chat._id);
//   const { logindata } = useContext(LoginContext);
//   const [loginUserId, setLoginUserId] = useState();
//   const messageRefs = useRef({});
//   const [highlightedId, setHighlightedId] = useState(null);
//   const [replyTo, setReplyTo] = useState(null);
//   const messagesEndRef = useRef(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [editorContent, setEditorContent] = useState("");
//   const [tasks, setTasks] = useState([]);

//   useEffect(() => {
//     if (logindata?.user?.id) {
//       setLoginUserId(logindata.user.id);
//     }
//     if (chat.clienttasks) {
//       setTasks(chat.clienttasks.flat());
//     }
//   }, [logindata, chat.clienttasks]);

//   const formatDate = (timestamp) => {
//     const date = new Date(timestamp);
//     const day = date.getDate();
//     const month = date.toLocaleString("default", { month: "short" });
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const period = hours >= 12 ? "PM" : "AM";
//     const formattedHours = hours % 12 || 12;
//     const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//     return `${day} ${month} ${formattedHours}:${formattedMinutes} ${period}`;
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [chat.description]);

//   const handleMenuClick = (event, message) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedMessage(message);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedMessage(null);
//   };

//   const handleEditorChange = (content) => {
//     setEditorContent(content);
//   };

//   const toggleTasks = () => {
//     setShowTasks(!showTasks);
//   };

//   const updateChatDescription = (message = "") => {
//     const contentToSend = message.trim() || editorContent.trim();
//     if (!contentToSend) return;

//     const newDescription = {
//       message: contentToSend,
//       fromwhome: "Admin",
//       senderid: loginUserId,
//     };

//     if (replyTo) {
//       newDescription.replyTo = replyTo._id;
//     }

//     setEditorContent("");
//     setReplyTo(null);
//     const raw = JSON.stringify({
//       newDescriptions: [newDescription],
//     });

//     fetch(
//       `http://127.0.0.1/chats/chatsaccountwise/chatupdatemessage/${chatId}`,
//       {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: raw,
//       }
//     )
//       .then((response) => {
//         if (!response.ok) throw new Error("Failed to update");
//         return response.json();
//       })
//       .then(() => {
//         toast.success("Message sent");
//         updatechatStatus(chatId);
//         accountwiseChatlist();
//         getsChatDetails();
//       })
//       .catch(() => {
//         toast.error("Send failed");
//       });
//   };

//   const updatechatStatus = (chatId) => {
//     return new Promise((resolve, reject) => {
//       let data = JSON.stringify({
//         chatstatus: false,
//       });

//       let config = {
//         method: "PATCH",
//         maxBodyLength: Infinity,
//         url: `http://127.0.0.1/chats/chatsaccountwise/${chatId}`,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         data: data,
//       };

//       axios
//         .request(config)
//         .then((response) => {
//           console.log("Status updated:", JSON.stringify(response.data));
//           resolve();
//         })
//         .catch((error) => {
//           console.error("Error updating chat status:", error);
//           reject(error);
//         });
//     });
//   };

//   const handleTaskToggle = (id) => {
//     const updated = tasks.map((task) =>
//       task.id === id ? { ...task, checked: !task.checked } : task
//     );
//     setTasks(updated);
//   };

//   // const handleAddTask = () => {
//   //   const newTaskItem = {
//   //     id: Date.now(),
//   //     text: "",
//   //     checked: false,
//   //   };
//   //   setTasks([...tasks, newTaskItem]);
//   // };
//   const handleAddTask = () => {
//   const maxId = tasks.length > 0
//     ? Math.max(...tasks.map((task) => Number(task.id)))
//     : 0;

//   const newTaskItem = {
//     id: maxId + 1,
//     text: "",
//     checked: false,
//   };

//   setTasks([...tasks, newTaskItem]);
// };

//   const handleDeleteTask = (id) => {
//     const updated = tasks.filter((task) => task.id !== id);
//     setTasks(updated);
//   };
//   const handleTaskTextChange = (id, newText) => {
//     const updated = tasks.map((task) =>
//       task.id === id ? { ...task, text: newText } : task
//     );
//     setTasks(updated);
//   };

//    const resendClientTask = () => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
//     const raw = JSON.stringify({
//       chatId: chatId,
//       newTask: tasks
//     });
//     console.log(raw);

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow"
//     };

//     fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise/addclienttask`, requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log(result);
//         // const taskMessages = adminChatClientsTask
//         // .flat()
//         // .map(task => `• ${task.text}`)
//         // .join("\n"); // newline-separated bullets

//         // // const taskMessages = adminChatClientsTask.flat().map(task => task.text).join(", ");
//         // const description = `${taskMessages}`;
//         const taskMessages = tasks
//   .filter(task => !task.checked) // Only include unchecked tasks
//   .map(task => `• ${task.text}`)
//   .join("\n");

// const description = `${taskMessages}`;

//         console.log("task descriptions",description)

//         updateAdminChatDescription(description)

//       })
//       .catch((error) => console.error(error));
//   };

//     const updateAdminChatDescription = (description) => {
//       if (!description.trim()) return; // Do not send if description is empty
//       const newDescription = {
//         message: description,
//         fromwhome: "Admin",
//          senderid: loginUserId,
//       };

//       // setDescription("");
//       const myHeaders = new Headers();
//       myHeaders.append("Content-Type", "application/json");
//       const raw = JSON.stringify({
//         newDescriptions: [newDescription],
//       });
//       const requestOptions = {
//         method: "PATCH",
//         headers: myHeaders,
//         body: raw,
//         redirect: "follow",
//       };
//       console.log("Payload:", raw);
//       fetch(
//         `${CHATTOCLIENT_API}/chats/chatsaccountwise/chatupdatemessage/${chatId}`,
//         requestOptions
//       )
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }
//           return response.json();
//         })
//         .then((result) => {
//           console.log("Response:", result);
//           // securemessagechatsend()
//           // setAdminChatSubject(result.updatedChats.chatsubject);
//           // setAdminChatDiscription(result.updatedChats.description);
//           // setExpanded(true);
//           // setChatId(result.updatedChats._id);
//           toast.success("Chat description updated successfully");
//           getsChatDetails()
//        updatechatStatus(chatId);
//           accountwiseChatlist();
//         })
//         .catch((error) => {
//           console.error("Error:", error);
//           toast.error("Failed to update chat description. Please try again.");
//         });
//     };

//   if (!chat) return null;

//   return (
//     <Box sx={{ display: "flex", height: "100%" }}>
//       {/* Main Chat Area */}
//       <Box sx={{ flex: 1, overflow: "hidden", pr: showTasks ? 2 : 0 }}>
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <Box>
//             <Typography variant="h6" gutterBottom>
//               {chat.accountid.accountName}
//             </Typography>
//             <Typography variant="subtitle2" gutterBottom>
//               {chat.chatsubject}
//             </Typography>
//           </Box>
//           {tasks.length > 0 && (
//             <Typography
//               variant="subtitle2"
//               sx={{
//                 cursor: "pointer",

//               }}
//               onClick={toggleTasks}
//             >
//               Client Tasks:{" "}
//               {`${tasks.filter((task) => task.checked).length}/${tasks.length}`}
//             </Typography>
//           )}
//         </Box>

//         <Divider sx={{ my: 1 }} />

//         <Box height={"42vh"} sx={{ overflowY: "auto", mt: 1, mb: 1 }}>
//           {Array.isArray(chat.description) &&
//             chat.description.length > 0 &&
//             chat.description.map((desc, index) => (
//               <MessageItem
//                 key={desc._id || index}
//                 desc={desc}
//                 chat={chat}
//                 messageRefs={messageRefs}
//                 highlightedId={highlightedId}
//                 setHighlightedId={setHighlightedId}
//                 handleMenuClick={handleMenuClick}
//                 anchorEl={anchorEl}
//                 setAnchorEl={setAnchorEl}
//                 selectedMessage={selectedMessage}
//                 setReplyTo={setReplyTo}
//                 formatDate={formatDate}
//                 loginUserId={loginUserId}
//               />
//             ))}
//         </Box>

//         <Box
//           sx={{
//             display: "grid",
//             gridTemplateColumns: "1fr auto",
//             gap: 2,
//             alignItems: "start",
//           }}
//         >
//           {replyTo && (
//             <ReplyPreview replyTo={replyTo} setReplyTo={setReplyTo} />
//           )}
//           <Editor onChange={handleEditorChange} value={editorContent} />
//           <Button
//             onClick={() => updateChatDescription()}
//             variant="contained"
//             sx={{ height: "fit-content", alignSelf: "end" }}
//           >
//             Send
//           </Button>
//         </Box>
//       </Box>

//       {/* Tasks Panel */}
//       {
//         // showTasks && (
//         //   <Box
//         //     sx={{
//         //       width: 300,
//         //       borderLeft: "1px solid #e0e0e0",
//         //       pl: 2,
//         //       height: "100%",
//         //       overflowY: "auto",
//         //       backgroundColor: "#f9f9f9",
//         //     }}
//         //   >
//         //     <Box
//         //       sx={{
//         //         display: "flex",
//         //         alignItems: "center",
//         //         justifyContent: "space-between",
//         //       }}
//         //     >
//         //       {" "}
//         //       <Typography variant="h6" sx={{ mb: 2, pt: 2 }}>
//         //         Client Tasks
//         //       </Typography>

//         //        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//         //       <Typography
//         //         sx={{ cursor: "pointer", color: "#1976d2" }}
//         //         onClick={handleAddTask}
//         //       >
//         //         <AddIcon />
//         //       </Typography>
//         //       <Box onClick={toggleTasks} sx={{ cursor: "pointer", color: "#1976d3" }}>
//         //         <CloseIcon />
//         //       </Box>
//         //     </Box>
//         //     </Box>
//         //      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
//         //     <TextField
//         //       value={newTask}
//         //       onChange={(e) => setNewTask(e.target.value)}
//         //       placeholder="Enter task"
//         //       size="small"
//         //       fullWidth
//         //     />
//         //     <Button variant="contained" onClick={handleAddTask}>
//         //       Add
//         //     </Button>
//         //   </Box>
//         //     <Divider />
//         //     <List>
//         //       {tasks.map((task, index) => (
//         //         <ListItem
//         //           key={task.id || index}
//         //           sx={{
//         //             px: 0,

//         //             "&:hover": { backgroundColor: "#f5f5f5" },
//         //           }}
//         //         >
//         //           <Checkbox
//         //             checked={!!task.checked}
//         //             onChange={() => handleTaskToggle(task.id)}
//         //           />
//         //           <ListItemText
//         //             primary={task.text || `Task ${index + 1}`}
//         //             sx={{
//         //               textDecoration: task.checked ? "line-through" : "none",
//         //               color: task.checked ? "#777" : "inherit",
//         //             }}
//         //           />
//         //         </ListItem>
//         //       ))}
//         //     </List>
//         //   </Box>
//         // )
//         showTasks && (
//           <Box
//             sx={{
//               width: 300,
//               borderLeft: "1px solid #e0e0e0",
//               pl: 2,
//               pr: 1,
//               height: "100%",
//               overflowY: "auto",
//               backgroundColor: "#f9f9f9",
//             }}
//           >
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 pt: 2,
//                 pb: 1,
//               }}
//             >
//               <Typography variant="h6">Client Tasks</Typography>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                 <IconButton onClick={handleAddTask} color="primary">
//                   <AddIcon />
//                 </IconButton>
//                 <IconButton onClick={toggleTasks} color="primary">
//                   <CloseIcon />
//                 </IconButton>
//               </Box>
//             </Box>

//             <List>
//               {tasks.map((task) => (
//                 <ListItem
//                   key={task.id}
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     px: 0,
//                   }}
//                 >
//                   <Checkbox
//                     checked={task.checked}
//                     onChange={() => handleTaskToggle(task.id)}
//                   />
//                   <TextField
//                     value={task.text}
//                     onChange={(e) =>
//                       handleTaskTextChange(task.id, e.target.value)
//                     }
//                     variant="outlined"
//                     size="small"
//                     fullWidth
//                     sx={{
//                       mr: 1,
//                       textDecoration: task.checked ? "line-through" : "none",
//                       input: {
//                         color: task.checked ? "#777" : "inherit",
//                       },
//                     }}
//                   />
//                   <IconButton
//                     onClick={() => handleDeleteTask(task.id)}
//                     color="error"
//                   >
//                     <DeleteIcon />
//                   </IconButton>
//                 </ListItem>
//               ))}
//             </List>
//             <Button variant="outlined" sx={{ mt: 2 }}  onClick={resendClientTask}>
//               Resend Client Task
//             </Button>
//           </Box>
//         )
//       }
//     </Box>
//   );
// };

// // Extracted MessageItem component for better readability
// const MessageItem = ({
//   desc,
//   chat,
//   messageRefs,
//   highlightedId,
//   setHighlightedId,
//   handleMenuClick,
//   anchorEl,
//   setAnchorEl,
//   selectedMessage,
//   setReplyTo,
//   formatDate,
//   loginUserId,
// }) => {
//   const isClient = desc.fromwhome?.toLowerCase() === "client";
//   const isAdmin = desc.fromwhome?.toLowerCase() === "admin";
//   const messageTime = desc.time ? formatDate(desc.time) : "Just now";

//   let senderDisplayName = "";
//   if (isClient && desc.senderid?.username) {
//     senderDisplayName = desc.senderid.username;
//   } else if (isAdmin && desc.senderid?.username) {
//     senderDisplayName = "You";
//   }

//   return (
//     <Box
//       ref={(el) => {
//         if (desc._id) {
//           messageRefs.current[desc._id] = el;
//         }
//       }}
//       sx={{
//         display: "flex",
//         justifyContent: isClient ? "flex-start" : "flex-end",
//         mb: 2,
//         position: "relative",
//       }}
//     >
//       <Box
//         sx={{
//           maxWidth: "75%",
//           backgroundColor:
//             desc._id === highlightedId
//               ? "#fff2b3"
//               : isAdmin
//                 ? "#ffe6e6"
//                 : "#e6f0ff",
//           p: 2,
//           borderRadius: 2,
//           borderTopLeftRadius: isClient ? 16 : 4,
//           borderTopRightRadius: isClient ? 4 : 16,
//           boxShadow: 1,
//           position: "relative",
//         }}
//       >
//         {desc.replyTo && (
//           <ReplyPreviewItem
//             desc={desc}
//             chat={chat}
//             messageRefs={messageRefs}
//             setHighlightedId={setHighlightedId}
//           />
//         )}

//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             color: "#333",
//           }}
//         >
//           <Typography
//             variant="subtitle2"
//             component="p"
//             gutterBottom
//             sx={{ fontWeight: "600" }}
//           >
//             {senderDisplayName}
//           </Typography>

//           <MoreVertIcon
//             fontSize="small"
//             sx={{ cursor: "pointer" }}
//             onClick={(e) => handleMenuClick(e, desc)}
//           />
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={() => setAnchorEl(null)}
//             PaperProps={{
//               elevation: 1,
//               sx: {
//                 boxShadow: "none",
//                 borderRadius: "8px",
//                 border: "1px solid #ccc",
//               },
//             }}
//           >
//             <MenuItem
//               onClick={() => {
//                 setReplyTo(selectedMessage);
//                 setAnchorEl(null);
//               }}
//             >
//               Reply
//             </MenuItem>
//           {selectedMessage?.fromwhome?.toLowerCase() === "admin" && (
//   <MenuItem
//     // onClick={() => {
//     //   setDeleteMsg(selectedMessage);
//     //   setAnchorEl(null);
//     // }}
//   >
//     Delete
//   </MenuItem>
// )}
//           </Menu>
//         </Box>

//         <Typography
//           variant="body2"
//           sx={{ whiteSpace: "pre-wrap", color: "#333" }}
//           dangerouslySetInnerHTML={{
//             __html:
//               typeof desc.message === "string"
//                 ? desc.message
//                 : "No message available",
//           }}
//         />
//         <Typography
//           variant="caption"
//           sx={{
//             display: "block",
//             textAlign: "right",
//             color: "gray",
//             mt: 1,
//           }}
//         >
//           {messageTime}
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// // Extracted ReplyPreviewItem component
// const ReplyPreviewItem = ({ desc, chat, messageRefs, setHighlightedId }) => {
//   const repliedMsg = chat.description.find((msg) => msg._id === desc.replyTo);
//   if (!repliedMsg) return null;

//   return (
//     <Box
//       sx={{
//         backgroundColor: "#f5f5f5",
//         borderLeft: "3px solid #1976d2",
//         px: 1,
//         py: 0.5,
//         mb: 1,
//       }}
//     >
//       <Typography
//         variant="caption"
//         fontWeight="bold"
//         sx={{ cursor: "pointer", color: "#1976d2" }}
//         onClick={() => {
//           const el = messageRefs.current[desc.replyTo];
//           if (el) {
//             el.scrollIntoView({
//               behavior: "smooth",
//               block: "center",
//             });
//             setHighlightedId(desc.replyTo);
//             setTimeout(() => setHighlightedId(null), 2000);
//           }
//         }}
//       >
//         {repliedMsg.fromwhome === "client"
//           ? repliedMsg.senderid?.username
//           : "You"}
//       </Typography>

//       <Typography
//         variant="body2"
//         sx={{ fontStyle: "italic", color: "#555" }}
//         dangerouslySetInnerHTML={{
//           __html:
//             repliedMsg.message?.length > 100
//               ? repliedMsg.message.slice(0, 100) + "..."
//               : repliedMsg.message,
//         }}
//       />
//     </Box>
//   );
// };

// // Extracted ReplyPreview component
// const ReplyPreview = ({ replyTo, setReplyTo }) => (
//   <Box
//     sx={{
//       gridColumn: "1 / -1",
//       mb: 1,
//       p: 1.5,
//       backgroundColor: "#f4f6f8",
//       borderLeft: "4px solid #1976d2",
//       borderRadius: 1,
//       position: "relative",
//     }}
//   >
//     <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
//       Replying to:{" "}
//       {replyTo.fromwhome === "client"
//         ? replyTo.senderid?.username
//         : "You" || "Admin"}
//     </Typography>

//     <Typography
//       variant="body2"
//       sx={{ fontStyle: "italic", whiteSpace: "pre-wrap", pr: 4 }}
//       dangerouslySetInnerHTML={{
//         __html:
//           replyTo.message?.length > 100
//             ? `${replyTo.message.slice(0, 100)}...`
//             : replyTo.message,
//       }}
//     />

//     <IconButton
//       size="small"
//       onClick={() => setReplyTo(null)}
//       sx={{
//         position: "absolute",
//         top: 6,
//         right: 6,
//         color: "#777",
//         "&:hover": { color: "#000" },
//       }}
//     >
//       <CloseIcon fontSize="small" />
//     </IconButton>
//   </Box>
// );

// export default ChatDetails;