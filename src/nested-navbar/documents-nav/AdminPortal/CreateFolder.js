
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

const CreateFolder = ({
  open,
  onClose,
  fetchUnSealedFolders,
  fetchAdminPrivateFolders,
  accountId,  fetchBothFolders
}) => {
  const templateId = "67ea43c004956fca8db1d445";

  useEffect(() => {
    console.log("account id selected",accountId);
  }, [accountId]);

  const [newFolderName, setNewFolderName] = useState("");

  const [structFolder, setStructFolder] = useState(null);
  const [privateStructFolder, setPrivateStructFolder] = useState(null);
  const [privateFolderPath, setPrivateFolderPath] = useState("");
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderPath, setNewFolderPath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const fetchFolders = async () => {
    try {
      const url = `${DOCS_MANAGMENTS}/admindocs/clientDocs/${accountId}`;
      const response = await axios.get(url);
      const addIsOpenProperty = (folders, parentId = null) =>
        folders.map((folder, index) => ({
          ...folder,
          isOpen: false, // Set to false to close all folders initially
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
  const fetchPrivateFolders = async () => {
    try {
      const res = await axios.get(
        `${DOCS_MANAGMENTS}/admindocs/privateDocs/${accountId}`
      );
      const folders = res.data.folders || [];

      const addIsOpen = (items, parentId = "") =>
        items.map((folder, index) => ({
          ...folder,
          isOpen: false,
          id: `${parentId}${index}`,
          sealed: false,
          contents: folder.contents
            ? addIsOpen(folder.contents, `${parentId}${index}-`)
            : [],
        }));

      setPrivateStructFolder({ ...res.data, folders: addIsOpen(folders) });
    } catch (err) {
      setError(err.message || "Error fetching sealed folders.");
    }
  };
  useEffect(() => {
    if (open) {
      fetchFolders();
      fetchPrivateFolders();
      // fetchBothFolders()
    }
  }, [open]);

  useEffect(() => {
    if (selectedFolderId) {
      console.log("The selected folder ID has been updated:", selectedFolderId);
      handleSelectFolderPath(); // Call your function that depends on the updated state
    }
  }, [selectedFolderId]);

  const [selectedType, setSelectedType] = useState(null); // "public" or "private"

  const renderContents = (contents, setContents) => {
    return contents.map((item, index) => {
      if (item.folder) {
        const toggleFolder = () => {
          const updatedContents = contents.map((folder, i) =>
            i === index ? { ...folder, isOpen: !folder.isOpen } : folder
          );
          setContents(updatedContents);
        };

        // const selectFolder = () => setSelectedFolderId(item.id);
        const selectFolder = () => {
          setSelectedFolderId(item.id);
          setSelectedType("public");
        };

        return (
          <div key={index} style={{ marginLeft: "20px", marginBottom: "4px" }}>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "6px 8px",
                borderRadius: "4px",
                // backgroundColor:
                //   selectedFolderId === item.id ? "#f0f7ff" : "transparent",
                backgroundColor:
                  selectedFolderId === item.id && selectedType === "public"
                    ? "#f0f7ff"
                    : "transparent",

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

  const renderPrivateContents = (contents, setContents) => {
    return contents.map((item, index) => {
      if (item.folder) {
        const toggleFolder = () => {
          const updatedContents = contents.map((folder, i) =>
            i === index ? { ...folder, isOpen: !folder.isOpen } : folder
          );
          setContents(updatedContents);
        };

        // const selectFolder = () => setSelectedFolderId(item.id);
        const selectFolder = () => {
          setSelectedFolderId(item.id);
          setSelectedType("private");
        };

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
                  selectedFolderId === item.id && selectedType === "private"
                    ? "#f0f7ff"
                    : "transparent",

                // backgroundColor:
                //   selectedFolderId === item.id ? "#f0f7ff" : "transparent",
                transition: "background-color 0.2s ease",
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
                {renderPrivateContents(item.contents, (newContents) => {
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
  // const createFolderAPI = (newFolderPath) => {
  //   return axios
  //     .get(
  //       `http://localhost:8000/createFolder/?path=uploads/FolderTemplates/${templateId}/${newFolderPath}&foldername=${newFolderName}`
  //     )
  //     .then((response) => {
  //       console.log("API Response:", response.data);
  //       //fetchFolders();
  //       //renderContents();
  //       return response.data;
  //       //setNewFolderName(""); // Clear input field
  //     })
  //     .catch((error) => {
  //       console.log("API Error:", error);
  //       throw error;
  //     });
  // };
  // const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const createFolderAPI = () => {
    if (!destinationPath || !newFolderName) {
      console.log("Missing path or folder name.");
      return;
    }
  
    return axios
      .get(
        `${DOCS_MANAGMENTS}/createnewFolder/?path=${destinationPath}&foldername=${newFolderName}`
      )
      .then((response) => {
        console.log("API Response:", response.data);
        setNewFolderName(""); // Clear input
        fetchBothFolders()
        onClose()
        fetchUnSealedFolders()
        fetchAdminPrivateFolders()

        return response.data;
      })
      .catch((error) => {
        console.log("API Error:", error);
        throw error;
      });
  };
  

  const handleSelectFolderPath = () => {
    const getFolderPath = (folders, parentPath = "") => {
      for (let folder of folders) {
        const currentPath = `${parentPath}/${folder.folder}`;

        if (folder.id === selectedFolderId) {
          return currentPath;
        }

        if (folder.contents) {
          const nestedPath = getFolderPath(folder.contents, currentPath);
          if (nestedPath) {
            return nestedPath;
          }
        }
      }
      return null;
    };

    if (!selectedFolderId || !selectedType) {
      console.log("No folder selected or type not defined.");
      return;
    }

    // if (selectedType === "public" && structFolder?.folders) {
    //   const selectedPath = getFolderPath(structFolder.folders);
    //   setNewFolderPath(selectedPath);
    //   console.log("Selected public path:", selectedPath);
    // }

    if (selectedType === "public" && structFolder?.folders) {
      let selectedPath = getFolderPath(structFolder.folders);

      // Append /unsealed if the selected folder is "Client Uploaded Documents"
      // if (selectedPath === "/Client Uploaded Documents") {
      //   selectedPath += "/unsealed";
      // }
      // Inject "unsealed" if path starts with "/Client Uploaded Documents"
      if (selectedPath?.startsWith("/Client Uploaded Documents")) {
        selectedPath = selectedPath.replace(
          "/Client Uploaded Documents",
          "/Client Uploaded Documents/unsealed"
        );
      }

      setNewFolderPath(selectedPath);
      console.log("Selected public path:", selectedPath);
    }

    if (selectedType === "private" && privateStructFolder?.folders) {
      const selectedPath = getFolderPath(privateStructFolder.folders);
      setPrivateFolderPath(selectedPath);
      console.log("Selected private path:", selectedPath);
    }
  };

  useEffect(() => {
    if (newFolderPath && selectedType === "public") {
      setDestinationPath(
        `uploads/AccountId/${accountId}/${newFolderPath}`
      );
    }
  }, [newFolderPath, selectedType]);

  useEffect(() => {
    if (privateFolderPath && selectedType === "private") {
      setDestinationPath(
        `uploads/AccountId/${accountId}/${privateFolderPath}`
      );
    }
  }, [privateFolderPath, selectedType]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!structFolder || !privateStructFolder) {
    return <div></div>;
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
            <Typography variant="h6">Create folder new </Typography>
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
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={createFolderAPI}
          >
            Create Folder
          </Button>

          <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
            {renderContents(structFolder.folders, (newFolders) =>
              setStructFolder({ ...structFolder, folders: newFolders })
            )}

            {renderPrivateContents(privateStructFolder.folders, (newFolders) =>
              setPrivateStructFolder({
                ...privateStructFolder,
                folders: newFolders,
              })
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CreateFolder;


// import { Typography,Box,Drawer,Button } from '@mui/material'
// import React from 'react'

// const CreateFolder = ({
//   open,
//   onClose,
//   fetchUnSealedFolders,
//   fetchAdminPrivateFolders,
//   accountId
// }) => {
//   return (
//     <Box>
//     <Drawer anchor="right" open={open} onClose={onClose}>
      
//       <Box
//         sx={{
//           backgroundColor: "#fff",
//           borderRadius: "8px",

//           padding: 2,
//           width: 600,
//           fontFamily:
//             "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <Typography variant="h6">Create folder new </Typography>
//           <IconButton onClick={onClose}>
//             <MdClose />
//           </IconButton>
//         </Box>
//         <TextField
//           fullWidth
//           size="small"
//           variant="outlined"
//           placeholder="Folder Name"
//           // value={newFolderName}
//           // onChange={(e) => setNewFolderName(e.target.value)}
//         />
//         <Button
//           variant="contained"
//           sx={{ mt: 2 }}
//           // onClick={createFolderAPI}
//         >
//           Create Folder
//         </Button>

//         <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
//           {/* {renderContents(structFolder.folders, (newFolders) =>
//             setStructFolder({ ...structFolder, folders: newFolders })
//           )}

//           {renderPrivateContents(privateStructFolder.folders, (newFolders) =>
//             setPrivateStructFolder({
//               ...privateStructFolder,
//               folders: newFolders,
//             })
//           )} */}
//         </Box>
//       </Box>
//     </Drawer>
//   </Box>
//   )
// }

// export default CreateFolder
