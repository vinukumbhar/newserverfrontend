import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Box, Typography, Drawer } from "@mui/material";
import { FaTimes } from "react-icons/fa";

const UploadDocument = ({ open, onClose, file ,fetchUnSealedFolders,fetchAdminPrivateFolders,accountId,fetchBothFolders}) => {
  const templateId = "67ea43c004956fca8db1d445";
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;

  const [structFolder, setStructFolder] = useState(null);
  const [privateStructFolder, setPrivateStructFolder] = useState(null);
  const [privateFolderPath, setPrivateFolderPath] = useState("");
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderPath, setNewFolderPath] = useState("");
  const [destinationPath, setDestinationPath] = useState("");

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
  selectedFolderId === item.id && selectedType === "public" ? "#f0f7ff" : "transparent",


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
  selectedFolderId === item.id && selectedType === "private" ? "#f0f7ff" : "transparent",


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
  
  const handleSubmitfile = async (e) => {
    // Validate file type
    // const allowedTypes = [
    //   "application/pdf",
    //   "image/jpeg",
    //   "image/png",
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //   "application/vnd.ms-excel",
    //   "application/msword",
    //   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    // ];
  
    // if (!allowedTypes.includes(file.type)) {
    //   alert("This file type is not supported. Please upload PDF, JPG, PNG, Excel, or Word files.");
    //   return;
    // }
  
    let data = new FormData();
    data.append("destinationPath", destinationPath);
    data.append("file", file);
  
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${DOCS_MANAGMENTS}/uploadfiledocument`,
      data: data,
    };
  
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        alert("File uploaded successfully!");
        onClose();
        fetchUnSealedFolders();
        fetchBothFolders()
        fetchAdminPrivateFolders();
        setSelectedFolderId(null);
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to upload the file.");
      });
  };
  
  // const handleSubmitfile = async (e) => {
  //   let data = new FormData();
  //   data.append("destinationPath", destinationPath);
  //   data.append("file", file);

  //   let config = {
  //     method: "post",
  //     maxBodyLength: Infinity,
  //     url: "http://127.0.0.1:8000/uploadfile",
  //     data: data,
  //   };
  //   axios
  //     .request(config)
  //     .then((response) => {
  //       console.log(JSON.stringify(response.data));
  //       alert("File uploaded successfully!");
  //       onClose()
  //       fetchUnSealedFolders();
  //       fetchAdminPrivateFolders();
  //       setSelectedFolderId(null)
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       alert("Failed to upload the file.");
  //     });

 
  // };
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
      setDestinationPath(`uploads/AccountId/${accountId}/${newFolderPath}`);
    }
  }, [newFolderPath, selectedType]);
  
  useEffect(() => {
    if (privateFolderPath && selectedType === "private") {
      setDestinationPath(`uploads/AccountId/${accountId}/${privateFolderPath}`);
    }
  }, [privateFolderPath, selectedType]);


  if (error) {
    return <Box>Error: {error}</Box>;
  }

  if (!structFolder || !privateStructFolder) {
    return <Box></Box>;
  }

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
            // padding:'5px 0 5px 0',
            borderBottom: "1px solid grey",
          }}
        >
          <Typography variant="h6">Select Folder to upload</Typography>
          <FaTimes style={{ cursor: "pointer" }} onClick={onclose} />
        </Box>
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

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 2, mt: 3, ml: 4 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!file}
          onClick={() => {
            handleSelectFolderPath();
            handleSubmitfile();
          }}
        >
          Upload
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Drawer>
  );
};

export default UploadDocument;