
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Drawer,
  IconButton,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { MdClose } from "react-icons/md";
import axios from "axios";
import FileExplorer from "../FileExplorer";
const CreateFolder = ({ open, onClose,accountId,fetchFirmFiles }) => {


  useEffect(() => {
    console.log(accountId);
  }, [accountId]);
  const API_KEY = process.env.REACT_APP_FOLDER_URL;

  const [structFolder, setStructFolder] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderPath, setNewFolderPath] = useState("");

 
  const [destinationPath, setDestinationPath] = useState("");

  const handleCreateFolder = async () => {
    if (!newFolderName || !destinationPath) {
      alert("Please enter a folder name and select a destination.");
      return;
    }
  
    const fullPath = `uploads/FolderTemplates/${accountId}/${destinationPath}`;
    const url = `${API_KEY}/firmClientDocs/createFolderinfirm?path=${encodeURIComponent(fullPath)}&foldername=${encodeURIComponent(newFolderName)}`;
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          accountId:accountId,
          permissions: {
            canView: true,
            canDownload: true,
            canDelete: false,
            canUpdate: false
          }
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("✅ Folder created:", data);
        alert("Folder created successfully!");
        setNewFolderName(""); // clear input
        onClose()
        fetchFirmFiles()
        // Optional: refresh folder list
      } else {
        console.error("❌ Failed to create folder:", data);
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("⚠️ Error:", error);
      alert("Something went wrong!");
    }
  };
  const [data, setData] = useState({ folder: "", contents: [] });
  const [selectedPath, setSelectedPath] = useState("");

 
  // const [selectedPath, setSelectedPath] = useState("");

const handlePathSelect = (path) => {
  console.log("Selected path:", path); // for debugging
  setSelectedPath(path);
  setDestinationPath(path); 
};
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "8px",

            padding: 2,
            width: 600,
            fontFamily:
              "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Create folder</Typography>
            <IconButton onClick={onClose}>
              <MdClose />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <Button variant="contained" sx={{ mt: 2 }}  onClick={handleCreateFolder}
  disabled={!newFolderName || !destinationPath}>
            Create Folder
          </Button>

          <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
          <FileExplorer onPathSelect={handlePathSelect} accountId={accountId}/>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CreateFolder;
