// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Button, IconButton, Box, Typography, Drawer } from "@mui/material";
// import { FaTimes } from "react-icons/fa";
// import DocumentManager from "../DocumentManager";
// const UploadDocument = ({ open, onClose, file }) => {
//   const templateId = "67ea43c004956fca8db1d445";

//   useEffect(() => {
//     console.log(templateId);
//   }, [templateId]);
//   const [structFolder, setStructFolder] = useState(null);
//   const [error, setError] = useState(null);
//   const [selectedFolderId, setSelectedFolderId] = useState(null);
//   const [newFolderPath, setNewFolderPath] = useState("");
//   const [destinationPath, setDestinationPath] = useState("");

//   useEffect(() => {
//     if (selectedFolderId) {
//       console.log("The selected folder ID has been updated:", selectedFolderId);
//       handleSelectFolderPath(); // Call your function that depends on the updated state
//     }
//   }, [selectedFolderId]);


//   const handleSubmitfile = async (e) => {
//     let data = new FormData();
//     data.append("destinationPath", destinationPath);
//     data.append("file", file);

//     let config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: "http://127.0.0.1:8000/uploadfile",
//       data: data,
//     };
//     axios
//       .request(config)
//       .then((response) => {
//         console.log(JSON.stringify(response.data));
//         alert("File uploaded successfully!");
//       })
//       .catch((error) => {
//         console.error(error);
//         alert("Failed to upload the file.");
//       });
//   };

//   const handleSelectFolderPath = () => {
//     const getFolderPath = (folders, parentPath = "") => {
//       for (let folder of folders) {
//         const currentPath = `${parentPath}/${folder.folder}`;

//         if (folder.id === selectedFolderId) {
//           //(currentPath); // Set new folder path
//           return currentPath; // Immediately return the selected path
//         }

//         if (folder.contents) {
//           const nestedPath = getFolderPath(folder.contents, currentPath);
//           if (nestedPath) {
//             return nestedPath; // Return the nested path if found
//           }
//         }
//       }
//       return null; // No path found
//     };

//     if (!selectedFolderId || !structFolder?.folders) {
//       console.log("No folder selected or structure is not available.");
//       return;
//     }

//     setNewFolderPath(getFolderPath(structFolder.folders));
//     console.log("Selected path from function:", newFolderPath); // Debugging log
//   };

//   // const handleSelectFolderPath = () => {
//   //   const getFolderPath = (folders, parentPath = "") => {
//   //     for (let folder of folders) {
//   //       const currentPath = `${parentPath}/${folder.folder}`;
  
//   //       if (folder.id === selectedFolderId) {
//   //         return currentPath;
//   //       }
  
//   //       if (folder.contents) {
//   //         const nestedPath = getFolderPath(folder.contents, currentPath);
//   //         if (nestedPath) return nestedPath;
//   //       }
//   //     }
//   //     return null;
//   //   };
  
//   //   if (!selectedFolderId || !structFolder?.folders) {
//   //     console.log("No folder selected or structure is not available.");
//   //     return null;
//   //   }
  
//   //   const folderPath = getFolderPath(structFolder.folders);
//   //   if (folderPath) {
//   //     const fullPath = `uploads/FolderTemplates/${templateId}/${folderPath}`;
//   //     setNewFolderPath(folderPath);
//   //     setDestinationPath(fullPath);
//   //     return fullPath;
//   //   }
  
//   //   return null;
//   // };
  
//   useEffect(() => {
//     if (newFolderPath) {
//       console.log("The folder path has changed to:", newFolderPath);
//       setDestinationPath(
//         `uploads/FolderTemplates/${templateId}/${newFolderPath}`
//       );
//       // Perform additional actions when newFolderPath changes
//     }
//   }, [newFolderPath]);

//   const [clientFiles, setClientFiles] = useState([]);
//   useEffect(() => {
//     const fetchFileDetails = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:8000/api/files");
//         if (response.data.success) {
//           const basePath = "Firm Docs Shared With Client";
//           const filtered = response.data.data
//             .filter((file) => file.filePath.includes(basePath))
//             .map((file) => {
//               const pathParts = file.filePath.split(basePath);
//               return {
//                 ...file,
//                 filePath: basePath + (pathParts[1] || ""),
//               };
//             });

//           setClientFiles(filtered);
//           console.log(
//             "Filtered Files Under Firm Docs Shared With Client:",
//             filtered
//           );
//         } else {
//           setError("Failed to fetch files");
//         }
//       } catch (error) {
//         setError(error.message);
//       }
//     };
//     fetchFileDetails();
//   }, []);
//   if (error) {
//     return <Box>Error: {error}</Box>;
//   }



//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onclose}
//       PaperProps={{
//         sx: {
//           width: 600,
//         },
//       }}
//     >
//       <Box>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             p: 2,
//             // padding:'5px 0 5px 0',
//             borderBottom: "1px solid grey",
//           }}
//         >
//           <Typography variant="h6">
//             Upload in Firm Docs Shared With Client
//           </Typography>
//           <FaTimes style={{ cursor: "pointer" }} onClick={onclose} />
//         </Box>
//         <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
//           <DocumentManager files={clientFiles} />
//         </Box>
//       </Box>

//       {/* Buttons */}
//       <Box sx={{ display: "flex", gap: 2, mt: 3, ml: 4 }}>
//         <Button
//           variant="contained"
//           color="primary"
//           disabled={!file}
//           onClick={() => {
//             handleSelectFolderPath();
//             handleSubmitfile();
//           }}
//         >
//           Upload
//         </Button>
//         <Button variant="outlined" onClick={onclose}>
//           Cancel
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// export default UploadDocument;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Box, Typography, Drawer } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import FileExplorer from "../FileExplorer";

const UploadDocument = ({ open, onClose, file,accountId ,onUploadSuccess,fetchFirmFiles }) => {
// console.log("accc",onUploadSuccess)
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  const [destinationPath, setDestinationPath] = useState("");
  
  const handleSubmitfile = async () => {
    if (!destinationPath) {
      alert("Destination path not selected.");
      return;
    }
  
    if (!file) {
      alert("No file selected.");
      return;
    }
  
    const fullPath = `uploads/FolderTemplates/${accountId}/${destinationPath}`;
    console.log("Uploading to:", fullPath);
  
    const data = new FormData();
    data.append("destinationPath", fullPath);
    data.append("file", file);
    data.append("accountId", accountId); // Make sure accountId is available in your component
  
    // Optional: if you want to send permissions (else default will apply)
    const permissions = {
      canView: true,
      canDownload: true,
      canDelete: false,
      canUpdate: false,
    };
    data.append("permissions", JSON.stringify(permissions));
  
    try {
      const response = await axios.post(`${API_KEY}/firmClientDocs/uploadfileinfirm`, data, {
        maxBodyLength: Infinity,
      });
      console.log(response.data);
      alert("File uploaded successfully!");
      onClose()
      onUploadSuccess?.(); 
      fetchFirmFiles()
      setSelectedPath("")
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload the file.");
    }
  };
  
  const handleUploadClick = async () => {
   
    await handleSubmitfile();
  };
  
  const [selectedPath, setSelectedPath] = useState("");

 
 

const handlePathSelect = (path) => {
  console.log("Selected path:", path); // for debugging
  setSelectedPath(path);
  setDestinationPath(path); 
};
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 600,
        },
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid grey",
          }}
        >
          <Typography variant="h6">
            Upload in Firm Docs Shared With Client
          </Typography>
          <FaTimes style={{ cursor: "pointer" }} onClick={onClose} />
        </Box>

        <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
     
        <FileExplorer onPathSelect={handlePathSelect} accountId={accountId}/>

       
        </Box>

     

        <Box sx={{ display: "flex", gap: 2, mt: 3, ml: 4 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!file}
            onClick={handleUploadClick}
          >
            Upload
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default UploadDocument;
