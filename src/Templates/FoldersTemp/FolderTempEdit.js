import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Divider,
  Input,
  Paper,Drawer,LinearProgress
} from "@mui/material";
import { FaRegFolderClosed } from "react-icons/fa6";
import { HiDocumentArrowUp } from "react-icons/hi2";
import UploadDocument from "./uploadDocumentWorking";
import CreateFolder from "./CreateFolder";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import JSZip from "jszip";

function FolderTempEdit({templateId}) {

  const [templateName, setTemplateName] = useState("");
 
  useEffect(() => {
    if (!templateId) return; // Ensure templateId exists before fetching

    const fetchTemplateName = async () => {
      try {
        const response = await fetch(`${API_KEY}/foldertemp/folder/${templateId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        setTemplateName(data.folderTemplate.templatename);
      } catch (error) {
        console.error("Error fetching template name:", error);
      }
    };

    fetchTemplateName();
  }, [templateId]);
  const [structFolder, setStructFolder] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderPath, setNewFolderPath] = useState("");
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, folderId: null });
  //function related to folder 
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const handleCreateFolderClick = () => {
    setIsFolderFormOpen(!isFolderFormOpen);
  };
  const handleFormClose = () => {
    setIsFolderFormOpen(false);
  };
  //function related to document 
  const [isDocumentForm, setIsDocumentForm] = useState(false);
  const [file, setFile] = useState(null);

  const handleUploadFormClose = () => {
    setIsDocumentForm(false);
  };
  const handleFileChange = async (e) => {
    setFile(e.target.files[0]);
  };
  const handleFileUpload = () => {
    setIsDocumentForm(!isDocumentForm);
  };
  const API_KEY = process.env.REACT_APP_FOLDER_URL;

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const url = `${API_KEY}/allFolders/${templateId}`;
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
        console.log("res",processedData)
        setStructFolder(processedData);
      } catch (err) {
        console.error("Error fetching all folders:", err);
        setError(err.message || "An error occurred");
      }
    };
  
    fetchFolders();
  }, []);
  

  const handleMenuClick = (e, folderId) => {
    e.stopPropagation(); // Prevent triggering other click events
    setContextMenu({
      visible: true,
      x: e.currentTarget.getBoundingClientRect().x - 150,
      y: e.currentTarget.getBoundingClientRect().y - 50,
      folderId,
    });
  };

  const handleCloseMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, folderId: null });
  };

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
          <div key={index} style={{ marginLeft: "20px", position: "relative" }}>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor:
                  selectedFolderId === item.id ? "#e0f7fa" : "transparent",
              }}
              onClick={selectFolder}
            >
              <div onClick={toggleFolder}>
                {item.isOpen ? "📂" : "📁"}{" "}
                <strong style={{ marginLeft: "5px" }}>{item.folder}</strong>
              </div>
              <div
                style={{ cursor: "pointer", marginLeft: "10px" }}
                onClick={(e) => handleMenuClick(e, item.id)}
              >
                ⋮
              </div>
            </div>
            {item.isOpen && item.contents && item.contents.length > 0 && (
              <div>
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
          <div key={index} style={{ marginLeft: "40px" }}>
            📄 {item.file}
          </div>
        );
      }
      return null;
    });
  };

  const createFolderAPI = (newFolderPath) => {
    return axios
      .get(`${API_KEY}/createFolder/?path=uploads/FolderTemplates/${templateId}/${newFolderPath}&foldername=${newFolderName}`)
      .then((response) => {
        console.log("API Response:", response.data);
        return response.data;
        setNewFolderName(""); // Clear input field
      })
      .catch((error) => {
        console.log("API Error:", error);
        throw error;
      });
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    const addFolderToSelected = (folders, parentPath = "") => {
      return folders.map((folder) => {
        if (folder.id === selectedFolderId) {
          const newFolder = {
            folder: newFolderName.trim(),
            isOpen: true,
            id: `${folder.id}-${folder.contents.length}`,
            contents: [],
          };

          const newPath = `${parentPath}/${folder.folder}`;
          setNewFolderPath(newPath);

          const updatedFolder = {
            ...folder,
            contents: [...folder.contents, newFolder],
          };

          return updatedFolder;
        }

        return folder.contents
          ? {
              ...folder,
              contents: addFolderToSelected(
                folder.contents,
                `${parentPath ? `${parentPath}/` : ""}${folder.folder}`
              ),
            }
          : folder;
      });
    };

    const updatedFolderStructure = addFolderToSelected(structFolder.folders);

    setStructFolder((prev) => ({
      ...prev,
      folders: updatedFolderStructure,
    }));
  };
    // Inside your component
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
const [uploadStatus, setUploadStatus] = useState('');
  const handleFolderChange = async (event) => {
    const folderFiles = event.target.files;
    if (!folderFiles.length) return;
  
    // Open the drawer immediately
    setIsDrawerOpen(true);
    setUploadStatus('Preparing files...');
    setUploadProgress(0);
  
    try {
      const firstFile = folderFiles[0];
      const folderPath = firstFile.webkitRelativePath;
      const folderName = folderPath.split("/")[0];
  
      const zip = new JSZip();
      
      // Add files to zip
      Array.from(folderFiles).forEach((file) => {
        const relativePath = file.webkitRelativePath.replace(`${folderName}/`, "");
        zip.file(relativePath, file);
      });
  
      // Update progress
      setUploadStatus('Compressing folder...');
      setUploadProgress(30);
  
      const zipBlob = await zip.generateAsync({ 
        type: "blob" 
      }, (metadata) => {
        setUploadProgress(30 + Math.round(metadata.percent * 0.6));
      });
  
      const formData = new FormData();
      formData.append("folderZip", zipBlob, `${folderName}.zip`);
      formData.append("folderName", folderName);
  
      setUploadStatus('Uploading...');
      setUploadProgress(90);
  
      await axios.post("http://127.0.0.1:8005/upload-folder", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(90 + (percentCompleted * 0.1));
        }
      });
  
      setUploadStatus('Success');
      setUploadProgress(100);
      
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus('Error uploading folder');
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    if (newFolderPath) {
      createFolderAPI(newFolderPath)
        .then((data) => {
          console.log("Folder created successfully:", data);
        })
        .catch((error) => {
          console.log("Error creating folder:", error);
        });
    }
  }, [newFolderPath]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!structFolder) {
    return <div>Loading...</div>;
  }



  // const handleFolderChange = async (event) => {
  //   const folderFiles = event.target.files;
  //   if (!folderFiles.length) return;

  //   const firstFile = folderFiles[0];
  //   const folderPath = firstFile.webkitRelativePath;
  //   const folderName = folderPath.split("/")[0]; // Extract folder name

  //   const zip = new JSZip();
  //   Array.from(folderFiles).forEach((file) => {
  //     const relativePath = file.webkitRelativePath.replace(`${folderName}/`, ""); // Maintain structure
  //     zip.file(relativePath, file);
  //   });

  //   const zipBlob = await zip.generateAsync({ type: "blob" });

  //   const formData = new FormData();
  //   formData.append("folderZip", zipBlob, `${folderName}.zip`); // Name ZIP after the folder
  //   formData.append("folderName", folderName); // Send folder name

  //   try {
  //     await axios.post("http://127.0.0.1:8005/upload-folder", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     alert("Folder uploaded successfully!");
    
  //   } catch (error) {
  //     console.error("Upload failed:", error);
  //     alert("Error uploading folder.");
  //   }
  // };
  return (
    <div >
     <Typography>Edit folder template</Typography>
     <Typography>Template Name :{templateName}</Typography> 
      <Box className="uploads-documents-links" sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            component="label"
            htmlFor="fileInput"
            sx={{ color: "#e87800" }}
          >
            <HiDocumentArrowUp size={24} />
          </IconButton>
          <Typography
            variant="body1"
            component="label"
            htmlFor="fileInput"
            sx={{ cursor: "pointer" }}
          >
            Upload Document
          </Typography>
          <Input
            type="file"
            id="fileInput"
            onChange={(e) => {
              handleFileChange(e);
              handleFileUpload(e);
            }}
            sx={{ display: "none" }}
          />
        </Box>

        <UploadDocument
          isDocumentForm={isDocumentForm}
          setIsDocumentForm={setIsDocumentForm}
          templateId={templateId}
          handleUploadFormClose={handleUploadFormClose}
          file={file}
          
            setFile={setFile}

        /> 

        {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            component="label"
            htmlFor="folderInput"
            sx={{ color: "#e87800" }}
          >
            <MdOutlineDriveFolderUpload size={24} />
          </IconButton>
          <label htmlFor="folderInput" style={{ cursor: "pointer" }}>
            <Typography variant="body1">Upload Folder</Typography>
            <input
              type="file"
              id="folderInput"
              webkitdirectory="true"
              directory="true"
              onChange={handleFolderChange}
              style={{ display: "none" }} // Hide the input element
            />
          </label>
        </Box> */}
       

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            //onClick={handleCreateFolderClick}
            sx={{ color: "#e87800" }}
          >
            <FaRegFolderClosed size={20} />
          </IconButton>
          <Typography
            variant="body1"
            onClick={handleCreateFolderClick}
            sx={{ cursor: "pointer" }}
          >
            Create Folder
          </Typography>
        </Box>
        <CreateFolder
          isFolderFormOpen={isFolderFormOpen}
          setIsFolderFormOpen={setIsFolderFormOpen}
          handleFormClose={handleFormClose}
          templateId={templateId}
          
        />
      </Box>
      
     
      {renderContents(structFolder.folders, (newFolders) =>
        setStructFolder({ ...structFolder, folders: newFolders })
      )}
      {contextMenu.visible && (
        <div
          style={{
            position: "absolute",
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
            padding: "10px",
          }}
        >
          <div style={{ padding: "5px", cursor: "pointer" }} onClick={handleCloseMenu}>
            Delete
          </div>
          <div style={{ padding: "5px", cursor: "pointer" }} onClick={handleCloseMenu}>
            Rename
          </div>
          <div style={{ padding: "5px", cursor: "pointer" }} onClick={handleCloseMenu}>
            Download
          </div>
        </div>
      )}
      {contextMenu.visible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 999,
          }}
          onClick={handleCloseMenu}
        ></div>
      )}
    </div>
  );
}

export default FolderTempEdit;
