// // src/components/UploadDrawer.js
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Drawer,
//   IconButton,
//   CircularProgress,
//   TextField,Button
// } from "@mui/material";
// import { MdClose } from "react-icons/md";
// import axios from "axios";
// const UploadDrawer = ({ open, onClose }) => {
//   const [folderStructure, setFolderStructure] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedFolder, setSelectedFolder] = useState(null);
//   const [newFolderName, setNewFolderName] = useState("");
//   useEffect(() => {
//     if (open) {
//       fetchFoldersWithContents("67ea43c004956fca8db1d445");
//     }
//   }, [open]);

//   const fetchFoldersWithContents = async (id) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:8000/allFolders/${id}`
//       );
//       setFolderStructure(response.data.folders);
//     } catch (error) {
//       console.error("Error fetching folder structure:", error);
//     }
//     setLoading(false);
//   };

//   // Recursive function to update folder open state while keeping all data
//   const toggleFolderOpenState = (folders, folderId) => {
//     return folders.map((folder) => {
//       if (folder.id === folderId) {
//         return { ...folder, isOpen: !folder.isOpen };
//       } else if (folder.contents) {
//         return {
//           ...folder,
//           contents: toggleFolderOpenState(folder.contents, folderId),
//         };
//       }
//       return folder;
//     });
//   };
//   const renderContents = (contents, parentPath = "") => {
//     return contents.map((item) => {
//       const currentPath = `${parentPath}/${item.folder || ""}`.replace(
//         "//",
//         "/"
//       );

//       if (item.folder) {
//         return (
//           <Box key={item.id} style={{ marginLeft: "20px" }}>
//             <Box
//               style={{
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 backgroundColor:
//                   selectedFolder === currentPath ? "#e0e0e0" : "transparent",
//                 padding: "4px",
//                 borderRadius: "4px",
//               }}
//               onClick={() => handleFolderClick(item.id, currentPath)}
//             >
//               {item.isOpen ? "📂" : "📁"}{" "}
//               <strong style={{ marginLeft: "5px" }}>{item.folder}</strong>
//             </Box>
//             {item.isOpen && item.contents.length > 0 && (
//               <Box>{renderContents(item.contents, currentPath)}</Box>
//             )}
//           </Box>
//         );
//       } else if (item.file) {
//         return (
//           <Box key={item.id} style={{ marginLeft: "40px" }}>
//             📄 {item.file}
//           </Box>
//         );
//       }
//       return null;
//     });
//   };
//   const [newFolderPath, setNewFolderPath] = useState("");
//   const handleFolderClick = (folderId, folderPath) => {
//     setNewFolderPath(folderPath);
//     console.log(folderPath);
//     setFolderStructure(toggleFolderOpenState(folderStructure, folderId));
//   };

//   const [destinationPath, setDestinationPath] = useState("");

//   useEffect(() => {
//     if (newFolderPath) {
//       console.log("The folder path has changed to:", newFolderPath);
//       setDestinationPath(`uploads/${newFolderPath}`);
//       // Perform additional actions when newFolderPath changes
//     }
//   }, [newFolderPath]);
//   const handleCreateFolder = async () => {
//     if (!newFolderName.trim()) {
//       alert("Please enter a folder name.");
//       return;
//     }

//     const folderPath = newFolderPath ? `${newFolderPath}/${newFolderName}` : newFolderName;
//     console.log("Creating folder at:", folderPath);

//     try {
//       const response = await axios.post("http://localhost:8000/createFolder", {
//         folderName: newFolderName,
//         path: newFolderPath || "uploads",
//       });

//       alert(response.data.message);
//       setNewFolderName("");
//       fetchFoldersWithContents(); // Refresh folder list
//     } catch (error) {
//       console.error("Error creating folder:", error.response?.data || error.message);
//       alert("Failed to create folder!");
//     }
//   };

//   return (
// <Drawer anchor="right" open={open} onClose={onClose}>
//   <Box sx={{ width: 600, padding: 2 }}>
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//       }}
//     >
//       <Typography variant="h6">Create folder</Typography>
//       <IconButton onClick={onClose}>
//         <MdClose />
//       </IconButton>
//     </Box>
//     <TextField
//       fullWidth
//       size="small"
//       variant="outlined"
//       placeholder="Folder Name"
//       value={newFolderName}
//       onChange={(e) => setNewFolderName(e.target.value)}
//     />
//     <Button
//       variant="contained"
//       sx={{ mt: 2 }}
//       onClick={handleCreateFolder}
//     >
//       Create Folder
//     </Button>
//     {loading ? (
//       <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
//     ) : folderStructure.length > 0 ? (
//       <Box>{renderContents(folderStructure)}</Box>
//     ) : (
//       <Typography variant="body2" sx={{ mt: 2, color: "gray" }}>
//         No folders found
//       </Typography>
//     )}

//   </Box>
// </Drawer>
//   );
// };

// export default UploadDrawer;

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
const CreateFolder = ({ open, onClose,accountId }) => {


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
  // const handleCreateFolder = async () => {
  //   try {
  //     const response = await fetch(`http://127.0.0.1:8000/createFolderinfirm?path=uploads/FolderTemplates/${templateId}/${newFolderPath}&foldername=${newFolderName}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         permissions: {
  //           canView: true,
  //           canDownload: true,
  //           canDelete: false,
  //           canUpdate: false
  //         }
  //       })
  //     });
  
  //     const data = await response.json();
  
  //     if (response.ok) {
  //       console.log("Folder created:", data);
  //       alert("Folder created successfully!");
  //     } else {
  //       console.error("Failed to create folder:", data);
  //       alert("Error: " + data.error);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     alert("Something went wrong!");
  //   }
  // };
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const handleCreateFolder = async () => {
    if (!newFolderName || !destinationPath) {
      alert("Please enter a folder name and select a destination.");
      return;
    }
  
    const fullPath = `uploads/AccountId/${accountId}/${destinationPath}`;
    const url = `${DOCS_MANAGMENTS}/firmDocs/createFolderinfirm?path=${encodeURIComponent(fullPath)}&foldername=${encodeURIComponent(newFolderName)}`;
  
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
