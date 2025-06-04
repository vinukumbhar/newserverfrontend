import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Editor from "../../Templates/Texteditor/Editor";
import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Card,
  CardContent,
  IconButton,
  Stack,Dialog,DialogActions,DialogContent,DialogContentText,TextField,DialogTitle
} from "@mui/material";
import { Edit, Delete, PushPin, Archive, Unarchive } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { LoginContext } from "../../Sidebar/Context/Context";
import { toast } from "react-toastify";

const NoteApp = () => {
  const ACC_NOTE = process.env.REACT_APP_ACCOUNT_NOTE_URL
  const { data } = useParams();
  const [view, setView] = useState("active");
  const [notes, setNotes] = useState([]);
  const [newNoteVisible, setNewNoteVisible] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState("");

  const { logindata } = useContext(LoginContext);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const [loginuserid, setLoginUserId] = useState("");
  const [username, setUsername] = useState("");

  const fetchUserData = async (id) => {
    const myHeaders = new Headers();
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setUsername(result.username);
      });
  };

  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
      fetchUserData(logindata.user.id);
    }
  }, [logindata]);

  const handleFetchNotesByAccId = (accountId) => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${ACC_NOTE}/account/notes/account/${accountId}`,
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        const formattedNotes = response.data.notes.map((note) => ({
          id: note._id,
          text: note.noteData,
          createdBy: note.createdBy,
          time: new Date(note.createdAt).toLocaleDateString("en-US", {
            hour: "2-digit",
                minute: "2-digit",
            hour12: true,
          }),
          editedTime: note.updatedAt
            ? new Date(note.updatedAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : null,
          archived: !note.active,
          pinned: note.pinned || false, // Add pinned status
        }));
        // Sort notes - pinned first, then by creation time
        formattedNotes.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setNotes(formattedNotes);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  };

  useEffect(() => {
    handleFetchNotesByAccId(data);
  }, []);

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) setView(nextView);
  };

  const handleEditorChange = (content) => {
    setNewNoteText(content);
  };

  const handleAddNote = async () => {
    const payload = {
      account: data,
      noteData: newNoteText,
      createdBy: username,
    };

    try {
      const response = await axios.request({
        method: "post",
        url: `${ACC_NOTE}/account/notes/`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(payload),
      });
  setNewNoteText("");
      setNewNoteVisible(false);
      toast.success("Note created successfully")
      handleFetchNotesByAccId(data);
    
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const handleTogglePin = async (noteId) => {
    try {
      // Find the note to get current pinned status
      const note = notes.find((n) => n.id === noteId);
      if (!note) return;

      const response = await axios.request({
        method: "patch",
        url: `${ACC_NOTE}/account/notes/${noteId}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          pinned: !note.pinned,
        }),
      });
      console.log("pinned responce", response);
      // Refresh the notes list
      handleFetchNotesByAccId(data);
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };

  const handleEditNote = (noteId, noteText) => {
    setEditingNoteId(noteId);
    setEditingNoteText(noteText);
  };

  const handleUpdateNote = async () => {
    if (!editingNoteId) return;

    try {
      const response = await axios.request({
        method: "patch",
        url: `${ACC_NOTE}/account/notes/${editingNoteId}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          noteData: editingNoteText,
        }),
      });

      // Refresh the notes list
      handleFetchNotesByAccId(data);
      setEditingNoteId(null);
      setEditingNoteText("");
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingNoteText("");
  };

  const filteredNotes = notes.filter(
    (note) => note.archived === (view === "archived")
  );
  const handleArchiveNote = async (noteId) => {
    try {
      await axios.request({
        method: "patch",
        url: `${ACC_NOTE}/account/notes/${noteId}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          active: false,
        }),
      });
toast.success("Note archived")
      // Refresh the notes list
      handleFetchNotesByAccId(data);
    } catch (error) {
      console.error("Failed to archive note:", error);
    }
  };

  const handleUnarchiveNote = async (noteId) => {
    try {
      await axios.request({
        method: "patch",
        url: `${ACC_NOTE}/account/notes/${noteId}`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          active: true,
        }),
      });
toast.success("Note Restored Successfully")
      // Refresh the notes list
      handleFetchNotesByAccId(data);
    } catch (error) {
      console.error("Failed to unarchive note:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.request({
        method: "delete",
        url: `${ACC_NOTE}/account/notes/${noteId}`,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Refresh the notes list
      handleFetchNotesByAccId(data);
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };
  // 1. State at the top of your component
const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
const [noteToDelete, setNoteToDelete] = useState(null);
const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);

// 2. Handler functions
const handleDeleteClick = (noteId) => {
  setNoteToDelete(noteId);
  setDeleteConfirmationText("");
  setIsDeleteEnabled(false);
  setDeleteConfirmOpen(true); // This should open the dialog
};

const handleDeleteConfirmationChange = (e) => {
  const text = e.target.value;
  setDeleteConfirmationText(text);
  setIsDeleteEnabled(text === "DELETE");
};

const handleConfirmDelete = async () => {
  if (!isDeleteEnabled || !noteToDelete) return;
  
  try {
    await axios.delete(`${ACC_NOTE}/account/notes/${noteToDelete}`);
    handleFetchNotesByAccId(data); // Refresh your notes list
    setDeleteConfirmOpen(false);
  } catch (error) {
    console.error("Failed to delete note:", error);
  }
};
  return (
    <Box sx={{ padding: 4, backgroundColor: "#f9fbfd", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          sx={{ backgroundColor: "#e8edf3", borderRadius: 2 }}
        >
          <ToggleButton
            value="active"
            sx={{
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: view === "active" ? "bold" : "normal",
              color: view === "active" ? "var(--color-save-btn)" : "#333",
              backgroundColor: view === "active" ? "#fff" : "transparent",
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
            value="archived"
            sx={{
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: view === "archived" ? "bold" : "normal",
              color: view === "archived" ? "var(--color-save-btn)" : "#333",
              backgroundColor: view === "archived" ? "#fff" : "transparent",
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

        <Button
          variant="contained"
        sx={{
            backgroundColor: "var(--color-save-btn)",
            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)",
            },
            borderRadius: "15px",
          }}
          onClick={() => setNewNoteVisible(true)}
        >
          New note
        </Button>
      </Box>

      {newNoteVisible && (
        <Box sx={{ mb: 3 }}>
          <Editor onChange={handleEditorChange} content={newNoteText} />
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button onClick={handleAddNote} variant="contained" sx={{
            backgroundColor: "var(--color-save-btn)",
            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)",
            },
            borderRadius: "15px",
          }}>
              Save
            </Button>
            <Button onClick={() => setNewNoteVisible(false)} variant="outlined" sx={{
              borderColor: "var(--color-border-cancel-btn)", // Normal background
              color: "var(--color-save-btn)",
              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                color: "#fff",
                border: "none",
              },
              
              borderRadius: "15px",
            }}>
              Cancel
            </Button>
          </Box>
        </Box>
      )}

      
      <Stack spacing={2}>
        {filteredNotes.map((note) => (
          <Card
            key={note.id}
            variant="outlined"
            sx={{
              borderRadius: 2,
              borderLeft: note.pinned ? "4px solid #ffc107" : "",
            }}
          >
            <CardContent>
              {editingNoteId === note.id ? (
                <>
                  <Editor
                    onChange={setEditingNoteText}
                    initialContent={editingNoteText}
                  />
                  <Box sx={{ display: "flex", gap: 2, mt: 5 }}>
                    <Button onClick={handleUpdateNote} variant="contained" sx={{
            backgroundColor: "var(--color-save-btn)",
            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)",
            },
            borderRadius: "15px",
          }}>
                      Update
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outlined" sx={{
              borderColor: "var(--color-border-cancel-btn)", // Normal background
              color: "var(--color-save-btn)",
              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                color: "#fff",
                border: "none",
              },
              
              borderRadius: "15px",
            }}>
                      Cancel
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                 <Typography 
  variant="body1" 
  gutterBottom
  dangerouslySetInnerHTML={{
    __html: note.text || "No content available"
  }}
  sx={{
    '& img': { maxWidth: '100%' }, // Optional: style embedded content
    '& a': { wordBreak: 'break-all' } // Optional: style links
  }}
/>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      {view === "active" ? (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleTogglePin(note.id)}
                            color={note.pinned ? "primary" : "default"}
                          >
                            <PushPin fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleArchiveNote(note.id)}
                          >
                            <Archive fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleEditNote(note.id, note.text)}
                            sx={{
                              color: "#1976d2",
                              "&:hover": {
                                backgroundColor: "rgba(25, 118, 210, 0.08)",
                              },
                            }}
                          >
                            {/* <Edit fontSize="small" /> */}
                          </IconButton>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: "0.875rem",
                              color: "#1976d2",
                              cursor: "pointer",
                            }}
                            onClick={() => handleEditNote(note.id, note.text)}
                          >
                            Edit
                          </Typography>
                        </>
                      ) : (
                        <>
                          <IconButton size="small"  onClick={() => handleUnarchiveNote(note.id)}>
                            <Unarchive fontSize="small"  sx={{
                              color: "#1976d2",
                              "&:hover": {
                                backgroundColor: "rgba(255, 61, 0, 0.08)",
                              },
                            }}/>
                            <Typography
                             component="span"
                             
                             sx={{
                              fontSize: "0.875rem",
                              color: "#1976d2",
                              cursor: "pointer",
                              ml: 1,
                            }}
                            >
                              Move to Active
                            </Typography>
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(note.id)}
                            sx={{
                              color: "#ff3d00",
                              "&:hover": {
                                backgroundColor: "rgba(255, 61, 0, 0.08)",
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: "0.875rem",
                              color: "#ff3d00",
                              cursor: "pointer",
                              ml: 1,
                            }}
                            onClick={() => handleDeleteClick(note.id)}
                          >
                            Delete
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {view === "active" ? (
                        `Created by ${note.createdBy} on ${note.time}`
                      ) : (
                        `Archived by ${note.createdBy} on ${note.time}`
                        
                      )}
                    </Typography>
                   
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
      <Dialog
      open={deleteConfirmOpen}
      onClose={() => setDeleteConfirmOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Delete the note?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this note?
        </DialogContentText>
        <DialogContentText sx={{ mt: 1 }}>
          This action is not reversible. If you proceed to delete the note, 
          you will not be able to recover it.
        </DialogContentText>
        
        <Typography variant="body2" sx={{ mt: 3, mb: 1, fontWeight: 500 }}>
          To proceed, type <strong>DELETE</strong> below.
        </Typography>
        
        <TextField
          fullWidth
          value={deleteConfirmationText}
          onChange={handleDeleteConfirmationChange}
          placeholder="Enter DELETE to confirm"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
        <Button 
          onClick={handleConfirmDelete}
          color="error"
          disabled={!isDeleteEnabled}
         variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    </Box>
  );
};

export default NoteApp;
