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
import DocumentManager from "../DocumentManager";
const CreateFolder = ({ open, onClose }) => {
  const [clientFiles, setClientFiles] = useState([]);
  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/files");
        if (response.data.success) {
          const basePath = "Firm Docs Shared With Client";
          const filtered = response.data.data
            .filter((file) => file.filePath.includes(basePath))
            .map((file) => {
              const pathParts = file.filePath.split(basePath);
              return {
                ...file,
                filePath: basePath + (pathParts[1] || ""),
              };
            });

          setClientFiles(filtered);
          console.log(
            "Filtered Files Under Firm Docs Shared With Client:",
            filtered
          );
        } else {
          setError("Failed to fetch files");
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchFileDetails();
  }, []);
  const templateId = "67ea43c004956fca8db1d445";

  useEffect(() => {
    console.log(templateId);
  }, [templateId]);
  const API_KEY = process.env.REACT_APP_FOLDER_URL;

  const [structFolder, setStructFolder] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderPath, setNewFolderPath] = useState("");

  useEffect(() => {
    if (templateId) {
      fetchFolders();
    }
  }, [templateId]);

  const fetchFolders = async () => {
    try {
      const url = `http://localhost:8000/allFolders/${templateId}`;
      const response = await axios.get(url);

      const addIsOpenProperty = (folders, parentId = null) =>
        folders.map((folder, index) => ({
          ...folder,
          isOpen: false, // Initially close all folders
          id: `${parentId ? `${parentId}-` : ""}${index}`,
          contents: folder.contents
            ? addIsOpenProperty(
                folder.contents,
                `${parentId ? `${parentId}-` : ""}${index}`
              )
            : [],
        }));

      const processedData = {
        ...response.data,
        folders: addIsOpenProperty(response.data.folders || []),
      };

      setStructFolder(processedData);
    } catch (err) {
      console.error("Error fetching all folders:", err);
      setError(err.message || "An error occurred");
    }
  };

  // const renderContents = (contents, setContents) => {
  //   return contents.map((item, index) => {
  //     if (item.folder) {
  //       const toggleFolder = () => {
  //         const updatedContents = contents.map((folder, i) =>
  //           i === index ? { ...folder, isOpen: !folder.isOpen } : folder
  //         );
  //         setContents(updatedContents);
  //       };

  //       const selectFolder = () => setSelectedFolderId(item.id);

  //       return (
  //         <div key={index} style={{ marginLeft: "20px" }}>
  //           <div
  //             style={{
  //               cursor: "pointer",
  //               display: "flex",
  //               alignItems: "center",
  //               backgroundColor:
  //                 selectedFolderId === item.id ? "#e0f7fa" : "transparent",
  //             }}
  //             onClick={selectFolder}
  //           >
  //             <div onClick={toggleFolder}>
  //               {item.isOpen ? "📂" : "📁"}{" "}
  //               <strong style={{ marginLeft: "5px" }}>{item.folder}</strong>
  //             </div>
  //           </div>
  //           {item.isOpen && item.contents && item.contents.length > 0 && (
  //             <div>
  //               {renderContents(item.contents, (newContents) => {
  //                 const updatedFolders = contents.map((folder, i) =>
  //                   i === index ? { ...folder, contents: newContents } : folder
  //                 );
  //                 setContents(updatedFolders);
  //               })}
  //             </div>
  //           )}
  //         </div>
  //       );
  //     } else if (item.file) {
  //       return (
  //         <div key={index} style={{ marginLeft: "40px" }}>
  //           📄 {item.file}
  //         </div>
  //       );
  //     }
  //     return null;
  //   });
  // };

  const renderContents = (contents, setContents) => {
    return contents.map((item, index) => {
      if (item.folder) {
        const toggleFolder = () => {
          const updatedContents = contents.map((folder, i) =>
            i === index ? { ...folder, isOpen: !folder.isOpen } : folder
          );
          setContents(updatedContents);
        };

        const selectFolder = () => setSelectedFolderId(item.id);

        return (
          <div key={index} style={{ marginLeft: "20px", marginBottom: "4px" }}>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "6px 8px",
                borderRadius: "4px",
                backgroundColor:
                  selectedFolderId === item.id ? "#f0f7ff" : "transparent",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
              onClick={selectFolder}
            >
              <div
                onClick={toggleFolder}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <span style={{ marginRight: "8px" }}>
                  {item.isOpen ? "📂" : "📁"}
                </span>
                <strong
                  style={{
                    fontWeight: 500,
                    color: "#333",
                    fontSize: "14px",
                  }}
                >
                  {item.folder}
                </strong>
              </div>
            </div>
            {item.isOpen && item.contents && item.contents.length > 0 && (
              <div style={{ marginTop: "4px" }}>
                {renderContents(item.contents, (newContents) => {
                  const updatedFolders = contents.map((folder, i) =>
                    i === index ? { ...folder, contents: newContents } : folder
                  );
                  setContents(updatedFolders);
                })}
              </div>
            )}
          </div>
        );
      } else if (item.file) {
        return (
          <div
            key={index}
            style={{
              marginLeft: "40px",
              padding: "4px 8px",
              fontSize: "14px",
              color: "#555",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ marginRight: "8px" }}>📄</span>
            {item.file}
          </div>
        );
      }
      return null;
    });
  };

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
  const handleCreateFolder = async () => {
    if (!newFolderName || !destinationPath) {
      alert("Please enter a folder name and select a destination.");
      return;
    }
  
    const fullPath = `uploads/FolderTemplates/${templateId}/${destinationPath}`;
    const url = `http://127.0.0.1:8006/createFolderinfirm?path=${encodeURIComponent(fullPath)}&foldername=${encodeURIComponent(newFolderName)}`;
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://127.0.0.1:8000/admin/firmDocs/67ea43c004956fca8db1d445"
      );
      if (response.data && response.data.folder) {
        setData({
          folder: response.data.folder,
          contents: response.data.contents,
        });
      }
    };

    fetchData();
  }, []);
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
          <DocumentManager
        folderName={data.folder}
        contents={data.contents}
        onPathSelect={handlePathSelect}
        selectedPath={selectedPath}
      />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CreateFolder;
