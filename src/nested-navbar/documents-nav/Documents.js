// import {
//   IconButton,
//   Drawer,
//   Autocomplete,
//   Box,
//   Button,
//   TextField,
//   Typography,Input,
// } from "@mui/material";
// import { Collapse, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
// import { Folder, FolderOpen, InsertDriveFile } from "@mui/icons-material";
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import CreateFolder from "./CreateFolder";
// import UploadDocument from "./UploadDocument"
// import { toast } from "react-toastify";
// import {
//     PictureAsPdf, Description,
//   Image, TableChart
// } from "@mui/icons-material";
// import { BsFiletypeXls } from "react-icons/bs";
// import { BsFiletypePdf } from "react-icons/bs";
// import { BsFiletypeTxt } from "react-icons/bs";
// import { BsFiletypeJpg } from "react-icons/bs";
// import { BsFiletypePng } from "react-icons/bs";
// import { FaRegFolderClosed } from "react-icons/fa6";
// const Documents = () => {
// const API_KEY = process.env.REACT_APP_FOLDER_URL;
// const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
// const [folderTemplates, setFolderTemplates] = useState([]);
// const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const { data } = useParams();
//   console.log(data);
//   const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
//   const handleFormClose = () => {
//     setIsFolderFormOpen(false);
//     fetchFolders(data);
//   };

//   const [isDocumentForm, setIsDocumentForm] = useState(false);

//     const [file, setFile] = useState(null);
//   const handleDocumentFormClose = ()=>{
//     setIsDocumentForm(false)
//     fetchFolders(data);
//   }

//     const handleFileChange = async (e) => {
//       setFile(e.target.files[0]);
//     };
//     const handleFileUpload = () => {
//       setIsDocumentForm(true);
//     };
// useEffect(() => {
//   fetchFolderData();
// }, []);

// const fetchFolderData = async () => {
//   try {
//     const url = `${API_KEY}/foldertemp/folder`;
//     const response = await fetch(url);
//     const data = await response.json();
//     setFolderTemplates(data.folderTemplates);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };
// const handleSelectTemplate = (selectedOptions) => {
//   setSelectedTemplate(selectedOptions);
// };
// const optionFolders = folderTemplates.map((folderTemplates) => ({
//   value: folderTemplates._id,
//   label: folderTemplates.templatename,
// }));

// const assignfoldertemp = () => {
//   const myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/json");

//   const raw = JSON.stringify({
//     accountId: data,
//     foldertempId: selectedTemplate.value,
//   });

//   const requestOptions = {
//     method: "POST",
//     headers: myHeaders,
//     body: raw,
//     redirect: "follow",
//   };
//   console.log(raw);
//   fetch(`${DOCS_MANAGMENTS}/clientdocs/accountfoldertemp`, requestOptions)
//     .then((response) => response.json())
//     .then((result) => {
//       console.log(result);
//       fetchFolders(data);
//       setSelectedTemplate(null);
//       toast.success("Folder Template Assign Successfully");
//     })
//     .catch((error) => {
//       console.error(error);
//       toast.error("Failed to Assign Folder Template");
//     });
// };

//   // Component to render folders and files recursively
//  // item: {
//       //   marginBottom: "0.8em",
//       //   borderBottom: "1px solid #ddd", // Add a horizontal line
//       //   paddingBottom: "0.5em",
//       // },
//   // const FolderContents = ({ contents }) => {
//   //   const styles = {
//   //     list: {
//   //       listStyle: "none",
//   //       marginLeft: "1em",
//   //       paddingLeft: "0.5em",
//   //     },

//   //     folder: {
//   //       fontWeight: "bold",
//   //       cursor: "pointer",
//   //       color: "#007BFF",
//   //     },
//   //     file: {
//   //       color: "#333",
//   //     },
//   //   };

//   //   return (
//   //     <ul style={styles.list}>
//   //       {contents.map((item, index) => (
//   //         <li key={index} style={styles.item}>
//   //           {item.type === "folder" ? (
//   //             <CollapsibleFolder name={item.name}>
//   //               <FolderContents contents={item.contents} />
//   //             </CollapsibleFolder>
//   //           ) : (
//   //             <span style={styles.file}>📄 {item.name}</span>
//   //           )}
//   //         </li>
//   //       ))}
//   //     </ul>
//   //   );
//   // };

//   // Function to get file icons based on file extensions
// const getFileIcon = (fileName) => {
//   const extension = fileName.split(".").pop().toLowerCase();

//   switch (extension) {
//     case "pdf":
//       return <BsFiletypePdf  style={{ color: "red",  fontSize:'20px' }} />;  // Red for PDFs
//     case "txt":
//       return <BsFiletypeTxt  style={{ color: "#1976D2",  fontSize:'20px' }} />;   // Blue for Text files
//     case "jpg":
//     case "jpeg":
//       return <BsFiletypeJpg  style={{ color: "#388E3C",  fontSize:'20px' }} />;        // Green for Images
//     case "xls":
//     case "xlsx":
//       return <BsFiletypeXls  style={{ color: "green",  fontSize:'20px' }} />;   // Yellow for Excel
//       case "png":
//          return <BsFiletypePng  style={{ color: "green",  fontSize:'20px' }}/>
//     default:
//       return <InsertDriveFile sx={{ color: "#666" ,  fontSize:'25px'}} />; // Default file icon
//   }
// };

// const FolderContents = ({ contents }) => {
//   return (
//     <List component="nav" sx={{ paddingLeft: 2 }}>
//       {contents.map((item, index) => (
//         <ListItem key={index} sx={{ paddingY: 0.5 }}>
//           {item.type === "folder" ? (
//             <CollapsibleFolder name={item.name}>
//               <FolderContents contents={item.contents} />
//             </CollapsibleFolder>
//           ) : (
//             <>
//               <ListItemIcon>{getFileIcon(item.name)}</ListItemIcon>
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

//   return (
//     <div>
//       <ListItem button onClick={() => setIsOpen(!isOpen)} sx={{ fontWeight: "bold", color: "#007BFF" }}>
//         <ListItemIcon>
//           {isOpen ? <FolderOpen sx={{ color: "#FF9D23" }} /> : <Folder sx={{ color: "#FF9D23" }} />}
//         </ListItemIcon>
//         <ListItemText primary={name} />
//       </ListItem>
//       <Collapse in={isOpen} timeout="auto" unmountOnExit>
//         {children}
//       </Collapse>
//     </div>
//   );
// };

//   // const FolderContents = ({ contents }) => {
//   //   return (
//   //     <List component="nav" >
//   //       {contents.map((item, index) => (
//   //         <ListItem key={index} >
//   //           {item.type === "folder" ? (
//   //             <CollapsibleFolder name={item.name}>
//   //               <FolderContents contents={item.contents} />
//   //             </CollapsibleFolder>
//   //           ) : (
//   //             <>
//   //               <ListItemIcon>
//   //                 <InsertDriveFile sx={{ color: "red" }} />
//   //               </ListItemIcon>
//   //               <ListItemText primary={item.name} sx={{ color: "#333" }} />
//   //             </>
//   //           )}
//   //         </ListItem>
//   //       ))}
//   //     </List>
//   //   );
//   // };
//   // const CollapsibleFolder = ({ name, children }) => {
//   //   const [isOpen, setIsOpen] = useState(false);

//   //   const handleToggle = () => {
//   //     setIsOpen((prev) => !prev);
//   //   };

//   //   const styles = {
//   //     folder: {
//   //       fontWeight: "bold",
//   //       cursor: "pointer",
//   //       color: "#007BFF",
//   //       display: "flex",
//   //       alignItems: "center",
//   //       // justifyContent: "space-between",
//   //     },
//   //     toggleIcon: {
//   //       marginRight: "0.5em",
//   //       cursor: "pointer",
//   //       userSelect: "none",
//   //       marginTop: "0.3em",
//   //     },
//   //     content: {
//   //       display: isOpen ? "block" : "none",
//   //     },
//   //     icon: {
//   //       cursor: "pointer", // To make the icon clickable
//   //       marginLeft: "auto",
//   //     },
//   //   };

//   //   return (
//   //     <div>
//   //       <div style={styles.folder} onClick={handleToggle}>
//   //         <span style={styles.toggleIcon}>{isOpen ? "📂" : "📁"}</span>
//   //         {name}
//   //       </div>
//   //       <div style={styles.content}>{children}</div>
//   //     </div>
//   //   );
//   // };
//   // const CollapsibleFolder = ({ name, children }) => {
//   //   const [isOpen, setIsOpen] = useState(false);

//   //   return (
//   //     <div>
//   //       <ListItem  onClick={() => setIsOpen(!isOpen)} sx={{ fontWeight: "bold", color: "#007BFF" }}>
//   //         <ListItemIcon>{isOpen ? <FolderOpen color="primary" /> : <Folder color="primary" />}</ListItemIcon>
//   //         <ListItemText primary={name} />
//   //       </ListItem>
//   //       <Collapse in={isOpen} timeout="auto" unmountOnExit>
//   //         {children}
//   //       </Collapse>
//   //     </div>
//   //   );
//   // };
//   const [folderdata, setData] = useState(null); // Store the API response
//   const [error, setError] = useState(null); // Store error if any
//   const [loading, setLoading] = useState(true); // Track loading state

//   const fetchFolders = async () => {
//     try {
//       const response = await fetch(
//         `${DOCS_MANAGMENTS}/clientdocs/folders/${data}`
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const result = await response.json();
//       setData(result); // Set the fetched data
//       console.log("folders data", result);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchFolders(data);
//   }, []);

//   // Function to open the create folder drawer
//   const handleOpenCreateFolder = () => {
//     setIsFolderFormOpen(true);
//   };
//   const [showAutocomplete, setShowAutocomplete] = useState(false);
//   return (
//     <Box>
//       <Box sx={{display:'flex',alignItems:'center', gap:3}}>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//           <IconButton
//             onClick={handleOpenCreateFolder}
//             sx={{ color: "#e87800" }}
//           >
//             <FaRegFolderClosed size={20} />
//           </IconButton>
//           <Typography
//             variant="body1"
//             onClick={handleOpenCreateFolder}
//             sx={{ cursor: "pointer" }}
//           >
//             Create Folder
//           </Typography>
//         </Box>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//           <IconButton
//             onClick={() => document.getElementById("fileInput").click()}
//             sx={{ color: "#e87800" }}
//           >
//             <FaRegFolderClosed size={20} />
//           </IconButton>
//           <Typography
//             variant="body1"

//             sx={{ cursor: "pointer" }}
//             onClick={() => document.getElementById("fileInput").click()}
//           >
//            Upload Document
//           </Typography>

//           <Input
//             type="file"
//             id="fileInput"
//             onChange={(e) => {
//               handleFileChange(e);
//               handleFileUpload(e);
//             }}
//             sx={{ display: "none" }}
//           />
//         </Box>
//   <Button
//   variant="contained"
//   color="primary"
//   onClick={() => setShowAutocomplete((prev) => !prev)}
//   sx={{
//     backgroundColor: "var(--color-save-btn)",
//     "&:hover": { backgroundColor: "var(--color-save-hover-btn)" },
//     borderRadius: "15px",
//   }}
// >
//   Assign Folder Template
// </Button>
// </Box>
// {showAutocomplete && (
//   <Box sx={{display:'flex', alignItems:'center',gap:3,mt:2}}>
// <Autocomplete
//     options={optionFolders}
//     getOptionLabel={(option) => option.label}
//     value={selectedTemplate}
//     onChange={(event, newValue) => handleSelectTemplate(newValue)}
//     isOptionEqualToValue={(option, value) => option.value === value.value}
//     renderOption={(props, option) => (
//       <Box
//         component="li"
//         {...props}
//         sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
//       >
//         {option.label}
//       </Box>
//     )}
//     renderInput={(params) => (
//       <TextField
//         {...params}
//         sx={{ backgroundColor: "#fff" }}
//         placeholder="Select Folder "
//         variant="outlined"
//         size="small"
//       />
//     )}
//     sx={{ width: "30%", marginTop: "8px" }}
//     clearOnEscape // Enable clearable functionality
//   />
// <Box mt={2}>
//   <Button
//     variant="contained"
//     color="primary"
//     onClick={assignfoldertemp}
//     disabled={!selectedTemplate}
//     sx={{
//       backgroundColor: "var(--color-save-btn)", // Normal background

//       "&:hover": {
//         backgroundColor: "var(--color-save-hover-btn)", // Hover background color
//       },
//       borderRadius: "15px",width:'80px'
//     }}
//   >
//    Save
//   </Button>
// </Box>
// </Box>
// )}
//       <Box>
//         {" "}
//         {folderdata && folderdata.contents && (
//           <FolderContents contents={folderdata.contents} />
//         )}
//       </Box>
//       <CreateFolder
//         isFolderFormOpen={isFolderFormOpen}
//         setIsFolderFormOpen={handleFormClose}
//         templateId={data}
//       />
//       <UploadDocument
//           isDocumentForm={isDocumentForm}
//           setIsDocumentForm={handleDocumentFormClose}
//           templateId={data}

//           file={file}

//             setFile={setFile}

//         />
//     </Box>
//   );
// };

// export default Documents;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  IconButton,
  Input,
  Menu,
  MenuItem,
  Collapse,
  Divider,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import { HiDocumentArrowUp } from "react-icons/hi2";
import { FaRegFolderClosed } from "react-icons/fa6";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import CreateFolder from "./AdminPortal/CreateFolder";
import UploadDrawer from "./AdminPortal/uploadDocumentWorking";
import UploadFolder from "./AdminPortal/folderUpload";
// import DocumentManager from "./DocumentManager"
import UploadDoc from "./Firm Docs Shared With Client/UplodDoc";
import CreateFolderInFirm from "./Firm Docs Shared With Client/CreateFolder";
import { Folder, FolderOpen, InsertDriveFile } from "@mui/icons-material";
import FileExplorer from "./FileExplorer";
import EditNameDrawer from "./EditNameDrawer";
const Documents = () => {
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const { data } = useParams();
  const [isDocumentForm, setIsDocumentForm] = useState(false);
  const [file, setFile] = useState(null);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const [isFolderCreate, setIsFolderCreate] = useState(false);
  const [isUploadFolderFormOpen, setIsUploadFolderFormOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [folderFiles, setFolderFiles] = useState([]);
  const [folderName, setFolderName] = useState("");
  const folderInputRef = useRef(null);
  const [uploadDocOpen, setUplaodDocOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  console.log(refreshKey);
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleNewFileChange = (e) => setFile(e.target.files[0]);
  const handleFileUpload = () => setIsDocumentForm(true);
  const handleOpenDrawer = () => setUplaodDocOpen(true);
  const handleCreateFolderClick = () => setIsFolderFormOpen((prev) => !prev);
  const handleNewFolderClick = () => setIsFolderCreate((prev) => !prev);
  const [combinedFolderStructure, setCombinedFolderStructure] = useState(null);

  // const [contextItem, setContextItem] = useState(null);
  const [structFolder, setStructFolder] = useState(null);
  const [sealedStructFolder, setSealedStructFolder] = useState(null);
  const [privateStructFolder, setPrivateStructFolder] = useState(null);
  // const [firmDocsStruture,setFirmDocsStruture]= useState(null);
  // const [firmDocsFolder, setFirmDocsFolder] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const openDrawer = () => {
    setIsUploadFolderFormOpen(true);
  };

  useEffect(() => {
    if (isDrawerOpen) openDrawer();
  }, [isDrawerOpen]);
  useEffect(() => {
    if (data) {
      fetchUnSealedFolders();
      fetchSealedFolders();
      fetchPrivateFolders();
      // fetchFrimDocsFolders();
    }
  }, [data]);
  const fetchPrivateFolders = async () => {
    try {
      const res = await axios.get(
        `${DOCS_MANAGMENTS}/admindocs/privateDocs/${data}`
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
  const fetchUnSealedFolders = async () => {
    try {
      const res = await axios.get(
        `${DOCS_MANAGMENTS}/admindocs/unsealed/${data}`
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

      setStructFolder({ ...res.data, folders: addIsOpen(folders) });
    } catch (err) {
      setError(err.message || "Error fetching unsealed folders.");
    }
  };

  const fetchSealedFolders = async () => {
    try {
      const res = await axios.get(
        `${DOCS_MANAGMENTS}/admindocs/sealedFolders/${data}`
      );
      const folders = res.data.folders || [];

      const addIsOpen = (items, parentId = "") =>
        items.map((folder, index) => ({
          ...folder,
          isOpen: false,
          id: `${parentId}${index}`,
          sealed: true,
          contents: folder.contents
            ? addIsOpen(folder.contents, `${parentId}${index}-`)
            : [],
        }));

      setSealedStructFolder({ ...res.data, folders: addIsOpen(folders) });
    } catch (err) {
      setError(err.message || "Error fetching sealed folders.");
    }
  };

  useEffect(() => {
    fetchBothFolders();
  }, [data]);

  const fetchBothFolders = async () => {
    try {
      const [sealedRes, unsealedRes] = await Promise.all([
        axios.get(`${DOCS_MANAGMENTS}/admindocs/sealedFolders/${data}`),
        axios.get(`${DOCS_MANAGMENTS}/admindocs/unsealed/${data}`),
      ]);

      const addIsOpen = (items, parentId = "", sealed = false) =>
        items.map((folder, index) => ({
          ...folder,
          isOpen: false,
          id: `${parentId}${index}`,
          sealed,
          contents: folder.contents
            ? addIsOpen(folder.contents, `${parentId}${index}-`, sealed)
            : [],
        }));

      const sealedFolders = addIsOpen(sealedRes.data.folders || [], "", true);
      const unsealedFolders = addIsOpen(
        unsealedRes.data.folders || [],
        "",
        false
      );

      // Combine into a single parent folder
      const combinedFolders = [
        {
          folder: "Client Uploaded Documents",
          isOpen: false,
          id: "client-root",
          contents: [...sealedFolders, ...unsealedFolders],
        },
      ];

      // Set to a single state
      setCombinedFolderStructure(combinedFolders); // <- new unified state
      console.log("jaanvi patil", combinedFolders);
    } catch (err) {
      setError(err.message || "Error fetching folders.");
    }
  };
  const toggleFolder = (folderId, folders) => {
    return folders.map((item) => {
      if (item.id === folderId) {
        return { ...item, isOpen: !item.isOpen };
      } else if (item.contents?.length) {
        return { ...item, contents: toggleFolder(folderId, item.contents) };
      }
      return item;
    });
  };
  const handleToggle = (id) => {
    setCombinedFolderStructure((prev) => toggleFolder(id, prev));
  };
  // const renderTree = (items) => {
  //   return items.map((item) => {
  //     if (item.folder) {
  //       return (
  //         <div key={item.id} style={{ paddingLeft: "20px" }}>
  //           <div
  //             style={{
  //               cursor: "pointer",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "space-between",
  //               paddingRight: "8px",
  //             }}
  //           >
  //             <div
  //               style={{ display: "flex", alignItems: "center", gap: "8px" }}
  //               onClick={() => handleToggle(item.id)}
  //             >
  //               <span>{item.isOpen ? "📂" : "📁"}</span>
  //               <span>{item.folder}</span>
  //               {item.sealed && (
  //                 <span
  //                   style={{
  //                     backgroundColor: "#d50000",
  //                     color: "#fff",
  //                     padding: "2px 6px",
  //                     borderRadius: "8px",
  //                     fontSize: "12px",
  //                   }}
  //                 >
  //                   Sealed
  //                 </span>
  //               )}
  //             </div>
  //             <div style={{ position: "relative" }}>
  //               <IconButton onClick={(e) => handleMenuOpen(e, item)}>
  //                 <BsThreeDotsVertical />
  //               </IconButton>
  //             </div>
  //           </div>
  //           {item.isOpen && item.contents?.length > 0 && (
  //             <div>{renderTree(item.contents)}</div>
  //           )}
  //         </div>
  //       );
  //     } else {
  //       return (
  //         <div
  //           key={item.id}
  //           style={{
  //             paddingLeft: "40px",
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "space-between",
  //             paddingRight: "8px",
  //             fontSize: "14px",
  //           }}
  //         >
  //           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  //             <span>📄</span>
  //             <span
  //               onClick={() => handleFileOpen(item)}
  //               style={{
  //                 cursor: "pointer",
  //                 // textDecoration: "underline",
  //                 // color: "red",
  //               }}
  //             >
  //               {item.file}
  //             </span>

  //             {item.sealed && (
  //               <span
  //                 style={{
  //                   backgroundColor: "#d50000",
  //                   color: "#fff",
  //                   padding: "2px 6px",
  //                   borderRadius: "8px",
  //                   fontSize: "12px",
  //                 }}
  //               >
  //                 Sealed
  //               </span>
  //             )}
  //           </div>
  //           <div style={{ position: "relative" }}>
  //             <IconButton onClick={(e) => handleMenuOpen(e, item)}>
  //               <BsThreeDotsVertical />
  //             </IconButton>
  //           </div>
  //         </div>
  //       );
  //     }
  //   });
  // };

  const renderTree = (items) => {
    return items.map((item) => {
      if (item.folder) {
        return (
          <div key={item.id} style={{ paddingLeft: "20px" }}>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: "8px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
                onClick={() => handleToggle(item.id)}
              >
                <span>{item.isOpen ? "📂" : "📁"}</span>
                <span>{item.folder}</span>
                {item.sealed && (
                  <span
                    style={{
                      backgroundColor: "#d50000",
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  >
                    Sealed
                  </span>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <IconButton
                  onClick={(e) => handleMenuOpen(e, item)}
                  size="small"
                >
                  <BsThreeDotsVertical />
                </IconButton>
              </div>
            </div>
            {item.isOpen && item.contents?.length > 0 && (
              <div>{renderTree(item.contents)}</div>
            )}
          </div>
        );
      } else {
        return (
          <div
            key={item.id}
            style={{
              paddingLeft: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingRight: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>📄</span>
              <span
                onClick={() => handleFileOpen(item)}
                style={{ cursor: "pointer" }}
              >
                {item.file}
              </span>
              {item.sealed && (
                <span
                  style={{
                    backgroundColor: "#d50000",
                    color: "#fff",
                    padding: "2px 6px",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                >
                  Sealed
                </span>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <IconButton onClick={(e) => handleMenuOpen(e, item)} size="small">
                <BsThreeDotsVertical />
              </IconButton>
            </div>
          </div>
        );
      }
    });
  };

  const renderPrivateFolderContents = (contents, setContents) =>
    contents.map((item, index) => {
      if (item.folder) {
        const toggleFolder = () => {
          const updated = contents.map((f, i) =>
            i === index ? { ...f, isOpen: !f.isOpen } : f
          );
          setContents(updated);
        };

        const selectFolder = () => setSelectedFolderId(item.id);

        return (
          <div key={index} style={{ marginLeft: "20px", marginBottom: "4px" }}>
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                paddingRight: "8px",
                borderRadius: "4px",
              }}
              onClick={selectFolder}
            >
              <div
                onClick={toggleFolder}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span>{item.isOpen ? "📂" : "📁"}</span>
                <span>{item.folder}</span>
              </div>
              <IconButton
                onClick={(e) => handlePrivateMenuOpen(e, item)}
                size="small"
                style={{ marginLeft: "auto" }}
              >
                <BsThreeDotsVertical />
              </IconButton>
            </div>
            {item.isOpen && item.contents?.length > 0 && (
              <div style={{ marginTop: "4px" }}>
                {renderPrivateFolderContents(item.contents, (newContents) => {
                  const updated = contents.map((f, i) =>
                    i === index ? { ...f, contents: newContents } : f
                  );
                  setContents(updated);
                })}
              </div>
            )}
          </div>
        );
      } else if (item.file) {
        // return (
        //   <div
        //     key={index}
        //     style={{
        //       marginLeft: "40px",
        //       padding: "4px 8px",
        //       fontSize: "15px",

        //       display: "flex",
        //       alignItems: "center",
        //     }}
        //   >
        //     <span style={{ marginRight: "8px" }}>📄</span>

        //     <span
        //       onClick={() => handleFileOpen(item)}
        //       style={{
        //         cursor: "pointer",

        //       }}
        //     >
        //       {item.file}
        //     </span>

        //   </div>
        // );

        return (
          <div
            key={index}
            style={{
              marginLeft: "40px",
              padding: "4px 8px",
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
              onClick={() => handleFileOpen(item)}
            >
              <span>📄</span>
              <span style={{ cursor: "pointer" }}>{item.file}</span>
            </div>
            <IconButton
              onClick={(e) => handlePrivateMenuOpen(e, item)}
              size="small"
            >
              <BsThreeDotsVertical />
            </IconButton>
          </div>
        );
      }
      return null;
    });

  const fetchData = async () => {
    try {
      const response = await fetch(`${DOCS_MANAGMENTS}/firmDocs/files/${data}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setFolderData(result);

      // Initialize open state for all folders
      const initialState = {};
      const initFolderState = (folder) => {
        initialState[folder.folderName] = true; // Open root by default
        folder.structure?.forEach((item) => {
          item.subfolders?.forEach((subfolder) => {
            initialState[subfolder.name] = false; // Closed by default
          });
        });
      };
      initFolderState(result);
      setOpenFolders(initialState);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [data]);

  const toggleFirmFolder = (folderName) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };
  const [folderData, setFolderData] = useState(null);
  const [openFolders, setOpenFolders] = useState({});
  const renderFolder = (folder) => {
    return (
      <Box key={folder.folderName} sx={{ ml: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            my: 1,
          }}
          onClick={() => toggleFirmFolder(folder.folderName)}
        >
          {openFolders[folder.folderName] ? (
            <FolderOpen color="primary" />
          ) : (
            <Folder color="primary" />
          )}
          <Typography variant="body1" sx={{ ml: 1 }}>
            {folder.folderName}
          </Typography>
        </Box>

        <Collapse in={openFolders[folder.folderName]}>
          <Box sx={{ ml: 3 }}>
            {folder.structure?.map((item, index) => (
              <React.Fragment key={index}>
                {item.subfolders?.map((subfolder) => (
                  <Box key={subfolder.name} sx={{ ml: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        my: 1,
                      }}
                      onClick={() => toggleFirmFolder(subfolder.name)}
                    >
                      {openFolders[subfolder.name] ? (
                        <FolderOpen color="primary" />
                      ) : (
                        <Folder color="primary" />
                      )}
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        {subfolder.name}
                      </Typography>
                    </Box>

                    <Collapse in={openFolders[subfolder.name]}>
                      <Box sx={{ ml: 3 }}>
                        {subfolder.files.map((file, fileIndex) => (
                          <Box
                            key={fileIndex}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              my: 1,
                            }}
                          >
                            <InsertDriveFile color="action" />
                            <Typography
                              variant="body2"
                              sx={{ ml: 1, color: "text.secondary" }}
                            >
                              {file}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Collapse>
                  </Box>
                ))}
              </React.Fragment>
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  };

  const handleFolderSelection = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const folderNameFromPath = files[0].webkitRelativePath.split("/")[0];
      setFolderName(folderNameFromPath);
      setFolderFiles(files);
      setIsDrawerOpen(true);
    }
    e.target.value = "";
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [privateAnchorEl, setPrivateAnchorEl] = useState(null);

  const handlePrivateMenuOpen = (event, item) => {
    setPrivateAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };
  const handlePrivateCloseMenu = () => {
    setPrivateAnchorEl(null);
    setTimeout(() => setSelectedItem(null), 100);
  };
  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
    setActiveMenu(item.id);
  };
 const [drawerOpen, setDrawerOpen] = useState(false);
  const handleEdit = (item) => {
    console.log("Edit", item);
    setSelectedItem(item);
    setDrawerOpen(true);
  };
  const handleRename = async (item, newName, itemPath) => {
    console.log("path", item);
    try {
      const response = await fetch(
        `${DOCS_MANAGMENTS}/admindocs/rename-item`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPath: itemPath,
            newName,
            // id: item.id,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Renamed:", data);
        fetchBothFolders();
        fetchPrivateFolders();
        // Refresh your data list here
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Rename failed", error);
    }
  };

   const handleDelete = (item) => {
      console.log("Delete", item);
  
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
  
      const raw = JSON.stringify({
        path: item.path, // dynamically from item
        id: item.id, // dynamically from item
      });
  
      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
  
      fetch(`${DOCS_MANAGMENTS}/admindocs/delete-item`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log("Delete Result:", result);
          toast.success("Deleted successfully");
          fetchBothFolders();
          fetchPrivateFolders();
        })
        .catch((error) => console.error("Delete Error:", error));
    };
  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedItem(null);
    setTimeout(() => setSelectedItem(null), 100);
    setActiveMenu(null);
  };
  const [loading, setLoading] = useState(false);
  const handleAction = async (action, item) => {
    console.log(`Action: ${action} on`, item);
    setActiveMenu(null); // Close the action menu

    if (action === "seal" || action === "unseal") {
      try {
        setLoading(true);

        // Extract folder ID from item.path
        const pathParts = item.path.split("/");
        const folderId = pathParts[2]; // uploads/AccountId/{id}/...

        // Compute base path
        const basePath = `uploads/AccountId/${folderId}/Client Uploaded Documents`;

        // Get relative path inside unsealed/sealed
        const currentDir = action === "seal" ? "unsealed" : "sealed";
        const relativePath = item.path.replace(
          `${basePath}/${currentDir}/`,
          ""
        );

        // Call backend to move the item
        await axios.post(
          `${DOCS_MANAGMENTS}/admindocs/moveBetweenSealedUnsealed`,
          {
            id: folderId,
            itemPath: relativePath,
            direction: action === "seal" ? "toSealed" : "toUnsealed",
          }
        );

        // Refresh folders
        await fetchBothFolders();

        // Notify success
        alert(`Item ${action === "seal" ? "sealed" : "unsealed"} successfully`);
      } catch (error) {
        console.error("Error moving item:", error);
        alert(
          `Failed to ${action} item: ${error.response?.data?.error || error.message}`
        );
      } finally {
        setLoading(false);
      }
    } else {
      // Other actions if needed
    }
  };
  const handleMenuAction = (action) => {
    if (selectedItem) {
      handleAction(action, selectedItem); // This function must be defined by you
      handleMenuClose();
    }
  };
  const handleFileOpen = (fileItem) => {
   
    const baseUrl = `${DOCS_MANAGMENTS}`; // or http://localhost:8000 in dev
    const fileUrl = `${baseUrl}/${fileItem.path}`;

    // window.open(fileUrl, "_blank");
    window.location.href = fileUrl;
  };
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  useEffect(() => {
    fetchFolderData();
  }, []);
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  // const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const [folderTemplates, setFolderTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
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
        // fetchFolders(data);
        setSelectedTemplate(null);
        fetchBothFolders();
        fetchData();
        toast.success("Folder Template Assign Successfully");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to Assign Folder Template");
      });
  };

  if (error) return <div>Error: {error}</div>;
  if (!combinedFolderStructure || !privateStructFolder) return <div></div>;
  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "16px",
          maxWidth: "800px",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
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
                handleFileUpload();
              }}
              sx={{ display: "none" }}
            />
          </Box>

          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
            onClick={handleCreateFolderClick}
          >
            <IconButton sx={{ color: "#e87800" }}>
              <FaRegFolderClosed size={20} />
            </IconButton>
            <Typography variant="body1" sx={{ cursor: "pointer" }}>
              Create Folder
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
            onClick={() => folderInputRef.current.click()}
          >
            <IconButton sx={{ color: "#e87800" }}>
              <MdOutlineDriveFolderUpload size={24} />
            </IconButton>
            <Typography variant="body1">Upload Folder</Typography>
            <input
              type="file"
              ref={folderInputRef}
              style={{ display: "none" }}
              webkitdirectory="true"
              directory="true"
              onChange={handleFolderSelection}
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
            <Autocomplete
              options={optionFolders}
              getOptionLabel={(option) => option.label}
              value={selectedTemplate}
              onChange={(event, newValue) => handleSelectTemplate(newValue)}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
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
                  borderRadius: "15px",
                  width: "80px",
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      <Box>
        <div>{renderTree(combinedFolderStructure)}</div>
      </Box>

      <Box>
        {renderPrivateFolderContents(
          privateStructFolder.folders,
          (newFolders) =>
            setPrivateStructFolder({
              ...privateStructFolder,
              folders: newFolders,
            })
        )}
      </Box>

      <Box sx={{ mt: 2, borderBottom: "2px solid grey" }}></Box>

      <Box>
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "16px",
            maxWidth: "800px",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                component="label"
                htmlFor="firmDocFileInput"
                sx={{ color: "#e87800" }}
              >
                <HiDocumentArrowUp size={24} />
              </IconButton>
              <Typography
                variant="body1"
                component="label"
                htmlFor="firmDocFileInput"
                sx={{ cursor: "pointer" }}
              >
                Upload Document in firm
              </Typography>
              <Input
                type="file"
                id="firmDocFileInput"
                onChange={(e) => {
                  handleNewFileChange(e);
                  handleOpenDrawer();
                }}
                sx={{ display: "none" }}
              />
            </Box>

            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
              onClick={handleNewFolderClick}
            >
              <IconButton sx={{ color: "#e87800" }}>
                <FaRegFolderClosed size={20} />
              </IconButton>
              <Typography variant="body1" sx={{ cursor: "pointer" }}>
                Create Folder in firm
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          {/* <FileExplorer accountId={data}/> */}
          <FileExplorer accountId={data} refreshTrigger={refreshKey} />
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {selectedItem?.folder === "Client Uploaded Documents" ? (
          <>
            <MenuItem onClick={() => handleMenuAction("new-folder")} disabled>
              New Folder
            </MenuItem>
            <MenuItem disabled onClick={() => handleMenuAction("edit")}>
              Edit
            </MenuItem>
          </>
        ) : (
          <>
            {/* <MenuItem onClick={() => handleMenuAction("new-folder")}>
              New Folder
            </MenuItem> */}
            <MenuItem onClick={() => {
           
              handleEdit(selectedItem);
              handleMenuClose();
           
          }}>Edit</MenuItem>
            <MenuItem onClick={() =>{ handleDelete(selectedItem); handleMenuClose();}}>
              Delete
            </MenuItem>

            <MenuItem
              onClick={() =>
                handleMenuAction(selectedItem?.sealed ? "unseal" : "seal")
              }
            >
              {selectedItem?.sealed ? "Unseal" : "Seal"}
            </MenuItem>
          </>
        )}
      </Menu>

      <Menu
        anchorEl={privateAnchorEl}
        open={Boolean(privateAnchorEl)}
        onClose={handlePrivateCloseMenu}
      >
        <MenuItem
          onClick={() => {
            if (selectedItem?.folder !== "Private") {
              handleEdit(selectedItem);
              handlePrivateCloseMenu();
            }
          }}
          disabled={selectedItem?.folder === "Private"}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedItem?.folder !== "Private") {
              handleDelete(selectedItem);
              handlePrivateCloseMenu();
            }
          }}
          disabled={selectedItem?.folder === "Private"}
        >
          Delete
        </MenuItem>
      </Menu>

      <EditNameDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        item={selectedItem}
        onRename={handleRename}
      />
      <CreateFolder
        open={isFolderFormOpen}
        onClose={() => setIsFolderFormOpen(false)}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
        fetchBothFolders={fetchBothFolders}
        accountId={data}
      />

      <UploadDrawer
        open={isDocumentForm}
        onClose={() => setIsDocumentForm(false)}
        file={file}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
        accountId={data}
        fetchBothFolders={fetchBothFolders}
      />

      <UploadFolder
        open={isUploadFolderFormOpen}
        folderFiles={folderFiles}
        setFolderFiles={setFolderFiles}
        setFolderName={setFolderName}
        folderName={folderName}
        onClose={() => setIsUploadFolderFormOpen(false)}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
        fetchBothFolders={fetchBothFolders}
        accountId={data}
      />

      {/* FIRM DOCS SHARED WITH CLIENT UPLOAD DOC DRAWER */}
      <UploadDoc
        open={uploadDocOpen}
        onClose={() => setUplaodDocOpen(false)}
        file={file}
        accountId={data}
        onUploadSuccess={() => setRefreshKey((prev) => prev + 1)}
      />
      {/* FIRM DOCS SHARED WITH CLIENT CREATE FOLDER DRAWER */}
      <CreateFolderInFirm
        open={isFolderCreate}
        onClose={() => setIsFolderCreate(false)}
        accountId={data}
      />
    </Box>
  );
};

export default Documents;
