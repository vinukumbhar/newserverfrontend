import {
  IconButton,
  Drawer,
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,Input,
} from "@mui/material";
import { Collapse, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Folder, FolderOpen, InsertDriveFile } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateFolder from "./CreateFolder";
import UploadDocument from "./UploadDocument"
import { toast } from "react-toastify";
import { 
    PictureAsPdf, Description,  
  Image, TableChart 
} from "@mui/icons-material";
import { BsFiletypeXls } from "react-icons/bs";
import { BsFiletypePdf } from "react-icons/bs";
import { BsFiletypeTxt } from "react-icons/bs";
import { BsFiletypeJpg } from "react-icons/bs";
import { BsFiletypePng } from "react-icons/bs";
import { FaRegFolderClosed } from "react-icons/fa6";
const Documents = () => {
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const [folderTemplates, setFolderTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { data } = useParams();
  console.log(data);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const handleFormClose = () => {
    setIsFolderFormOpen(false);
    fetchFolders(data);
  };

  const [isDocumentForm, setIsDocumentForm] = useState(false);
  
    const [file, setFile] = useState(null);
  const handleDocumentFormClose = ()=>{
    setIsDocumentForm(false)
    fetchFolders(data);
  }
   
    const handleFileChange = async (e) => {
      setFile(e.target.files[0]);
    };
    const handleFileUpload = () => {
      setIsDocumentForm(true);
    };
  useEffect(() => {
    fetchFolderData();
  }, []);

  const fetchFolderData = async () => {
    try {
      const url = `${API_KEY}/foldertemp/folder`;
      const response = await fetch(url);
      const data = await response.json();
      setFolderTemplates(data.folderTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSelectTemplate = (selectedOptions) => {
    setSelectedTemplate(selectedOptions);
  };
  const optionFolders = folderTemplates.map((folderTemplates) => ({
    value: folderTemplates._id,
    label: folderTemplates.templatename,
  }));

  const assignfoldertemp = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountId: data,
      foldertempId: selectedTemplate.value,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);
    fetch(`${DOCS_MANAGMENTS}/clientdocs/accountfoldertemp`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        fetchFolders(data);
        setSelectedTemplate(null);
        toast.success("Folder Template Assign Successfully");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to Assign Folder Template");
      });
  };

  // Component to render folders and files recursively
 // item: {
      //   marginBottom: "0.8em",
      //   borderBottom: "1px solid #ddd", // Add a horizontal line
      //   paddingBottom: "0.5em",
      // },
  // const FolderContents = ({ contents }) => {
  //   const styles = {
  //     list: {
  //       listStyle: "none",
  //       marginLeft: "1em",
  //       paddingLeft: "0.5em",
  //     },
     
  //     folder: {
  //       fontWeight: "bold",
  //       cursor: "pointer",
  //       color: "#007BFF",
  //     },
  //     file: {
  //       color: "#333",
  //     },
  //   };

  //   return (
  //     <ul style={styles.list}>
  //       {contents.map((item, index) => (
  //         <li key={index} style={styles.item}>
  //           {item.type === "folder" ? (
  //             <CollapsibleFolder name={item.name}>
  //               <FolderContents contents={item.contents} />
  //             </CollapsibleFolder>
  //           ) : (
  //             <span style={styles.file}>📄 {item.name}</span>
  //           )}
  //         </li>
  //       ))}
  //     </ul>
  //   );
  // };

  // Function to get file icons based on file extensions
const getFileIcon = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  
  switch (extension) {
    case "pdf":
      return <BsFiletypePdf  style={{ color: "red",  fontSize:'20px' }} />;  // Red for PDFs
    case "txt":
      return <BsFiletypeTxt  style={{ color: "#1976D2",  fontSize:'20px' }} />;   // Blue for Text files
    case "jpg":
    case "jpeg":
      return <BsFiletypeJpg  style={{ color: "#388E3C",  fontSize:'20px' }} />;        // Green for Images
    case "xls":
    case "xlsx":
      return <BsFiletypeXls  style={{ color: "green",  fontSize:'20px' }} />;   // Yellow for Excel
      case "png":
         return <BsFiletypePng  style={{ color: "green",  fontSize:'20px' }}/>
    default:
      return <InsertDriveFile sx={{ color: "#666" ,  fontSize:'25px'}} />; // Default file icon
  }
};

const FolderContents = ({ contents }) => {
  return (
    <List component="nav" sx={{ paddingLeft: 2 }}>
      {contents.map((item, index) => (
        <ListItem key={index} sx={{ paddingY: 0.5 }}>
          {item.type === "folder" ? (
            <CollapsibleFolder name={item.name}>
              <FolderContents contents={item.contents} />
            </CollapsibleFolder>
          ) : (
            <>
              <ListItemIcon>{getFileIcon(item.name)}</ListItemIcon>
              <ListItemText primary={item.name} sx={{ color: "#333" }} />
            </>
          )}
        </ListItem>
      ))}
    </List>
  );
};

const CollapsibleFolder = ({ name, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <ListItem button onClick={() => setIsOpen(!isOpen)} sx={{ fontWeight: "bold", color: "#007BFF" }}>
        <ListItemIcon>
          {isOpen ? <FolderOpen sx={{ color: "#FF9D23" }} /> : <Folder sx={{ color: "#FF9D23" }} />}
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
    </div>
  );
};

  // const FolderContents = ({ contents }) => {
  //   return (
  //     <List component="nav" >
  //       {contents.map((item, index) => (
  //         <ListItem key={index} >
  //           {item.type === "folder" ? (
  //             <CollapsibleFolder name={item.name}>
  //               <FolderContents contents={item.contents} />
  //             </CollapsibleFolder>
  //           ) : (
  //             <>
  //               <ListItemIcon>
  //                 <InsertDriveFile sx={{ color: "red" }} />
  //               </ListItemIcon>
  //               <ListItemText primary={item.name} sx={{ color: "#333" }} />
  //             </>
  //           )}
  //         </ListItem>
  //       ))}
  //     </List>
  //   );
  // };
  // const CollapsibleFolder = ({ name, children }) => {
  //   const [isOpen, setIsOpen] = useState(false);

  //   const handleToggle = () => {
  //     setIsOpen((prev) => !prev);
  //   };

  //   const styles = {
  //     folder: {
  //       fontWeight: "bold",
  //       cursor: "pointer",
  //       color: "#007BFF",
  //       display: "flex",
  //       alignItems: "center",
  //       // justifyContent: "space-between",
  //     },
  //     toggleIcon: {
  //       marginRight: "0.5em",
  //       cursor: "pointer",
  //       userSelect: "none",
  //       marginTop: "0.3em",
  //     },
  //     content: {
  //       display: isOpen ? "block" : "none",
  //     },
  //     icon: {
  //       cursor: "pointer", // To make the icon clickable
  //       marginLeft: "auto",
  //     },
  //   };

  //   return (
  //     <div>
  //       <div style={styles.folder} onClick={handleToggle}>
  //         <span style={styles.toggleIcon}>{isOpen ? "📂" : "📁"}</span>
  //         {name}
  //       </div>
  //       <div style={styles.content}>{children}</div>
  //     </div>
  //   );
  // };
  // const CollapsibleFolder = ({ name, children }) => {
  //   const [isOpen, setIsOpen] = useState(false);
  
  //   return (
  //     <div>
  //       <ListItem  onClick={() => setIsOpen(!isOpen)} sx={{ fontWeight: "bold", color: "#007BFF" }}>
  //         <ListItemIcon>{isOpen ? <FolderOpen color="primary" /> : <Folder color="primary" />}</ListItemIcon>
  //         <ListItemText primary={name} />
  //       </ListItem>
  //       <Collapse in={isOpen} timeout="auto" unmountOnExit>
  //         {children}
  //       </Collapse>
  //     </div>
  //   );
  // };
  const [folderdata, setData] = useState(null); // Store the API response
  const [error, setError] = useState(null); // Store error if any
  const [loading, setLoading] = useState(true); // Track loading state

  const fetchFolders = async () => {
    try {
      const response = await fetch(
        `${DOCS_MANAGMENTS}/clientdocs/folders/${data}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setData(result); // Set the fetched data
      console.log("folders data", result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFolders(data);
  }, []);

  // Function to open the create folder drawer
  const handleOpenCreateFolder = () => {
    setIsFolderFormOpen(true);
  };
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  return (
    <Box>
      <Box sx={{display:'flex',alignItems:'center', gap:3}}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={handleOpenCreateFolder}
            sx={{ color: "#e87800" }}
          >
            <FaRegFolderClosed size={20} />
          </IconButton>
          <Typography
            variant="body1"
            onClick={handleOpenCreateFolder}
            sx={{ cursor: "pointer" }}
          >
            Create Folder
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => document.getElementById("fileInput").click()} 
            sx={{ color: "#e87800" }}
          >
            <FaRegFolderClosed size={20} />
          </IconButton>
          <Typography
            variant="body1"
           
            sx={{ cursor: "pointer" }}
            onClick={() => document.getElementById("fileInput").click()} 
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
        <Button
        variant="contained"
        color="primary"
        onClick={() => setShowAutocomplete((prev) => !prev)}
        sx={{
          backgroundColor: "var(--color-save-btn)",
          "&:hover": { backgroundColor: "var(--color-save-hover-btn)" },
          borderRadius: "15px",
        }}
      >
        Assign Folder Template
      </Button>
      </Box>
      {showAutocomplete && (
        <Box sx={{display:'flex', alignItems:'center',gap:3,mt:2}}>
      <Autocomplete
          options={optionFolders}
          getOptionLabel={(option) => option.label}
          value={selectedTemplate}
          onChange={(event, newValue) => handleSelectTemplate(newValue)}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
            >
              {option.label}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{ backgroundColor: "#fff" }}
              placeholder="Select Folder "
              variant="outlined"
              size="small"
            />
          )}
          sx={{ width: "30%", marginTop: "8px" }}
          clearOnEscape // Enable clearable functionality
        />
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={assignfoldertemp}
          disabled={!selectedTemplate}
          sx={{
            backgroundColor: "var(--color-save-btn)", // Normal background

            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)", // Hover background color
            },
            borderRadius: "15px",width:'80px'
          }}
        >
         Save
        </Button>
      </Box>
      </Box>
      )}
      <Box>
        {" "}
        {folderdata && folderdata.contents && (
          <FolderContents contents={folderdata.contents} />
        )}
      </Box>
      <CreateFolder
        isFolderFormOpen={isFolderFormOpen}
        setIsFolderFormOpen={handleFormClose}
        templateId={data}
      />
      <UploadDocument
          isDocumentForm={isDocumentForm}
          setIsDocumentForm={handleDocumentFormClose}
          templateId={data}
          
          file={file}
          
            setFile={setFile}

        /> 
    </Box>
  );
};

export default Documents;
