import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  IconButton,
  Input,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { HiDocumentArrowUp } from "react-icons/hi2";
import { FaRegFolderClosed } from "react-icons/fa6";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";

// Dummy components - replace these with your actual components
import UploadDrawer from "./uploadDocumentWorking";
import CreateFolder from "./CreateFolder";
import UploadFolder from "./folderUpload";
import DocumentManager from "../DocumentManager";
import UploadDoc from "../Firm Docs Shared With Client/UplodDoc";
import CreateFolderInFirm from "../Firm Docs Shared With Client/CreateFolder";
import { useParams } from "react-router-dom";
const App = () => {
  const { data } = useParams();
  console.log("account id", data);
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
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleNewFileChange = (e) => setFile(e.target.files[0]);
  const handleFileUpload = () => setIsDocumentForm(true);
  const handleOpenDrawer = () => setUplaodDocOpen(true);
  const handleCreateFolderClick = () => setIsFolderFormOpen((prev) => !prev);
  const handleNewFolderClick = () => setIsFolderCreate((prev) => !prev);
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

  const openDrawer = () => {
    setIsUploadFolderFormOpen(true);
  };

  useEffect(() => {
    if (isDrawerOpen) openDrawer();
  }, [isDrawerOpen]);
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  // const [anchorEl, setAnchorEl] = useState(null);
  const [contextItem, setContextItem] = useState(null);
  const [structFolder, setStructFolder] = useState(null);
  const [sealedStructFolder, setSealedStructFolder] = useState(null);
  const [privateStructFolder, setPrivateStructFolder] = useState(null);
  const [firmDocsFolder, setFirmDocsFolder] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [combinedFolderStructure, setCombinedFolderStructure] = useState(null);

  const templateId = "67ea43c004956fca8db1d445";

  useEffect(() => {
    if (data) {
      fetchUnSealedFolders();
      fetchSealedFolders();
      fetchPrivateFolders();
      fetchFrimDocsFolders();
    }
  }, [data]);

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
  //             style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
  //             onClick={() => handleToggle(item.id)}
  //           >
  //             <span>{item.isOpen ? "📂" : "📁"}</span>
  //             <span>{item.folder}</span>
  //             {item.sealed && <span style={{ backgroundColor: "#d50000", color: "#fff", padding: "2px 6px", borderRadius: "8px", fontSize: "12px" }}>Sealed</span>}
  //           </div>
  //           {item.isOpen && item.contents?.length > 0 && (
  //             <div>{renderTree(item.contents)}</div>
  //           )}
  //         </div>
  //       );
  //     } else {
  //       return (
  //         <div key={item.id} style={{ paddingLeft: "40px", display: "flex", alignItems: "center", gap: "8px" }}>
  //           <span>📄</span>
  //           <span>{item.file}</span>
  //           {item.sealed && <span style={{ backgroundColor: "#d50000", color: "#fff", padding: "2px 6px", borderRadius: "8px", fontSize: "12px" }}>Sealed</span>}
  //         </div>
  //       );
  //     }
  //   });
  // };

  const [loading, setLoading] = useState(false);
  // const handleAction = async (action, item) => {
  //   console.log(`Action: ${action} on`, item);
  //   setActiveMenu(null); // close menu after action

  //   if (action === 'seal' || action === 'unseal') {
  //     try {
  //       setLoading(true);

  //       // Extract the folder ID from the item's path
  //       const pathParts = item.path.split('/');
  //       const folderId = pathParts[2]; // Assuming format: uploads/FolderTemplates/{id}/...

  //       // Calculate the relative path within the sealed/unsealed directory
  //       const basePath = `uploads/FolderTemplates/${folderId}/Client Uploaded Documents`;
  //       const relativePath = item.path.replace(`${basePath}/${action === 'seal' ? 'unsealed' : 'sealed'}/`, '');

  //       // Call the API to move the item
  //       await axios.post('http://localhost:8000/admin/moveBetweenSealedUnsealed', {
  //         id: folderId,
  //         itemPath: relativePath,
  //         direction: action === 'seal' ? 'toSealed' : 'toUnsealed'
  //       });

  //       // Refresh the data
  //       await fetchBothFolders();

  //       // Show success message
  //       alert(`Item ${action === 'seal' ? 'sealed' : 'unsealed'} successfully`);
  //     } catch (error) {
  //       console.error('Error moving item:', error);
  //       alert(`Failed to ${action} item: ${error.response?.data?.error || error.message}`);
  //     } finally {
  //       setLoading(false);
  //     }
  //   } else {
  //     // Handle other actions...
  //   }
  // };

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

  // const handleAction = (action, item) => {
  //   console.log(`Action: ${action} on`, item);
  //   setActiveMenu(null); // close menu after action
  // };
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
    setActiveMenu(item.id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
    setActiveMenu(null);
  };

  const handleMenuAction = (action) => {
    if (selectedItem) {
      handleAction(action, selectedItem); // This function must be defined by you
      handleMenuClose();
    }
  };
  const handleFileOpen = (fileItem) => {
    // Assuming fileItem.filepath = "/uploads/folder1/filename.pdf"
    const baseUrl = `${DOCS_MANAGMENTS}`; // or http://localhost:8000 in dev
    const fileUrl = `${baseUrl}/${fileItem.path}`;

    // window.open(fileUrl, "_blank");
    window.location.href = fileUrl;
  };
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
                <IconButton onClick={(e) => handleMenuOpen(e, item)}>
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
              fontSize: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>📄</span>
              <span
                onClick={() => handleFileOpen(item)}
                style={{
                  cursor: "pointer",
                  // textDecoration: "underline",
                  // color: "red",
                }}
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
              <IconButton onClick={(e) => handleMenuOpen(e, item)}>
                <BsThreeDotsVertical />
              </IconButton>
            </div>
          </div>
        );
      }
    });
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
  //             {/* <BsThreeDotsVertical style={{ cursor: "pointer" }} /> */}
  //             <div style={{ position: "relative" }}>
  //           <IconButton onClick={(e) => handleMenuOpen(e, item)}>
  //             <BsThreeDotsVertical />
  //           </IconButton>
  //         </div>

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
  //           }}
  //         >
  //           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  //             <span>📄</span>
  //             <span  onClick={() => handleFileOpen(item)} style={{cursor:'pointer'}}>{item.file}</span>
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
  //           <IconButton onClick={(e) => handleMenuOpen(e, item)}>
  //             <BsThreeDotsVertical />
  //           </IconButton>
  //         </div>
  //         </div>
  //       );
  //     }
  //   });
  // };

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
  const fetchFrimDocsFolders = async () => {
    try {
      const res = await axios.get(
        `${DOCS_MANAGMENTS}/admindocs/firmDocs/${data}`
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

      setFirmDocsFolder({ ...res.data, folders: addIsOpen(folders) });
    } catch (err) {
      setError(err.message || "Error fetching sealed folders.");
    }
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
                padding: "6px 8px",
                borderRadius: "4px",
              }}
              onClick={selectFolder}
            >
              <div
                onClick={toggleFolder}
                style={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <span style={{ marginRight: "8px" }}>
                  {item.isOpen ? "📂" : "📁"}
                </span>
                <strong style={{ fontWeight: 500 }}>{item.folder}</strong>
                {/* <SealedChip sealed={item.sealed} /> */}
              </div>
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
            {/* <span style={{ fontWeight: 500 }}>{item.file}</span> */}
            <span
              onClick={() => handleFileOpen(item)}
              style={{
                cursor: "pointer",
                // textDecoration: "underline",
                // color: "red",
              }}
            >
              {item.file}
            </span>
            {/* <SealedChip sealed={item.sealed} /> */}
          </div>
        );
      }
      return null;
    });
  const renderFirmDocsFolderContents = (contents, setContents) =>
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
                padding: "6px 8px",
                borderRadius: "4px",
              }}
              onClick={selectFolder}
            >
              <div
                onClick={toggleFolder}
                style={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <span style={{ marginRight: "8px" }}>
                  {item.isOpen ? "📂" : "📁"}
                </span>
                <strong style={{ fontWeight: 500 }}>{item.folder}</strong>
                {/* <SealedChip sealed={item.sealed} /> */}
              </div>
            </div>
            {item.isOpen && item.contents?.length > 0 && (
              <div style={{ marginTop: "4px" }}>
                {renderFirmDocsFolderContents(item.contents, (newContents) => {
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
            <span style={{ fontWeight: 500 }}>{item.file}</span>
            {/* <SealedChip sealed={item.sealed} /> */}
          </div>
        );
      }
      return null;
    });

  const [firmdata, setFirmData] = useState({ folder: "", contents: [] });
  const [selectedPath, setSelectedPath] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${DOCS_MANAGMENTS}/admindocs/firmDocs/${data}`
      );
      if (response.data && response.data.folder) {
        setFirmData({
          folder: response.data.folder,
          contents: response.data.contents,
        });
      }
    };

    fetchData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!combinedFolderStructure || !privateStructFolder)
    return <div>Loading...</div>;

  return (
    <>
      <Typography variant="h2">ADMIN PORTAL</Typography>

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
        </Box>
      </Box>

      <Box>
        <div>{renderTree(combinedFolderStructure)}</div>
      </Box>
      <Box>
        {/* <Typography variant="h6">Private</Typography> */}

        {renderPrivateFolderContents(
          privateStructFolder.folders,
          (newFolders) =>
            setPrivateStructFolder({
              ...privateStructFolder,
              folders: newFolders,
            })
        )}
      </Box>
      {/* <Divider /> */}
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

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={handleNewFolderClick}
                sx={{ color: "#e87800" }}
              >
                <FaRegFolderClosed size={20} />
              </IconButton>
              <Typography variant="body1" sx={{ cursor: "pointer" }}>
                Create Folder in firm
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          {/* <Typography variant="h6">Firm Docs Shared With Client</Typography> */}

          <DocumentManager
        folderName={data.folderName}
        structure={data.structure}
        onPathSelect={(path) => setSelectedPath(path)}
        selectedPath={selectedPath}
      />
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
            <MenuItem onClick={() => handleMenuAction("new-folder")}>
              New Folder
            </MenuItem>
            <MenuItem onClick={() => handleMenuAction("edit")}>Edit</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => handleMenuAction("new-folder")}>
              New Folder
            </MenuItem>
            <MenuItem onClick={() => handleMenuAction("edit")}>Edit</MenuItem>
            <MenuItem onClick={() => handleMenuAction("delete")}>
              Delete
            </MenuItem>
            <MenuItem onClick={() => handleMenuAction("move")}>Move</MenuItem>
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

      {/* ADMIN UPLAOD DOC DRAER */}
      <UploadDrawer
        open={isDocumentForm}
        onClose={() => setIsDocumentForm(false)}
        file={file}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
        accountId={data}
      />
      {/* FIRM DOCS SHARED WITH CLIENT UPLOAD DOC DRAWER */}
      <UploadDoc
        open={uploadDocOpen}
        onClose={() => setUplaodDocOpen(false)}
        file={file}
      />
      {/* ADMIN CREATE FOLDER DRAWER */}
      <CreateFolder
        open={isFolderFormOpen}
        onClose={() => setIsFolderFormOpen(false)}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
        accountId={data}
      />
      {/* FIRM DOCS SHARED WITH CLIENT CREATE FOLDER DRAWER */}
      <CreateFolderInFirm
        open={isFolderCreate}
        onClose={() => setIsFolderCreate(false)}
      />
      {/* ADMIN UPLAOD FOLDER */}
      <UploadFolder
        open={isUploadFolderFormOpen}
        folderFiles={folderFiles}
        setFolderFiles={setFolderFiles}
        setFolderName={setFolderName}
        folderName={folderName}
        onClose={() => setIsUploadFolderFormOpen(false)}
        fetchUnSealedFolders={fetchUnSealedFolders}
        fetchAdminPrivateFolders={fetchPrivateFolders}
      />
    </>
  );
};

export default App;
