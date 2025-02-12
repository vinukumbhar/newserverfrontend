import React, { useEffect, useState, useRef } from "react";
import { Input,IconButton, Box, Typography, Divider, Paper } from "@mui/material";
import FetchFolder from "./FetchFolder";
import CreateFolder from "./CreateFolder";
import { HiDocumentArrowUp } from "react-icons/hi2";
import UploadDocument from "./uploadDocumentWorking";
import { FaRegFolderClosed } from "react-icons/fa6";
function FolderList({ tempName, fetchAllFolders, folderData, templateId }) {
  console.log("jjj", templateId);

  const [selectedFolder, setSelectedFolder] = useState();
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  useEffect(() => {
    setTempId(templateId);
  }, [templateId]); 
const [tempId,setTempId] = useState(templateId)
 // Function to open the create folder drawer
 const handleOpenCreateFolder = () => {
  setIsFolderFormOpen(true);
};
 const [isDocumentForm, setIsDocumentForm] = useState(false);
  // const [contents, setContents] = useState([]);
  const [file, setFile] = useState(null);
  const handleFileChange = async (e) => {
    setFile(e.target.files[0]);
  };
  const handleFileUpload = () => {
    setIsDocumentForm(!isDocumentForm);
  };
 
  return (
    <Box sx={{ padding: 3 }} component={Paper}>
      <Typography variant="h6">
        Template Name: <strong>{tempName}</strong>
      </Typography>
      <Divider sx={{ marginY: 2 }} />
<Box sx={{display:'flex', alignItems:'center',gap:4}}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
        onClick={handleOpenCreateFolder}
      >
        <IconButton sx={{ color: "#e87800" }}>
          <FaRegFolderClosed size={20} />
        </IconButton>
        <Typography variant="body1">Create Folder</Typography>
      </Box>
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
        </Box>
      <FetchFolder
        folderData={folderData}
        setSelectedFolder={setSelectedFolder}
        selectedFolder={selectedFolder}
        templateId={templateId}
      />
       {/* Create Folder Drawer */}
       {/* {isFolderFormOpen && ( */}
       <CreateFolder
        isFolderFormOpen={isFolderFormOpen}
        setIsFolderFormOpen={setIsFolderFormOpen}
        templateId={tempId}
      />
       {/* )
       } */}
       <UploadDocument
          isDocumentForm={isDocumentForm}
          setIsDocumentForm={setIsDocumentForm}
          templateId={tempId}
          // handleUploadFormClose={handleUploadFormClose}
          file={file}
          
            setFile={setFile}

        /> 
    </Box>
  );
}

export default FolderList;
