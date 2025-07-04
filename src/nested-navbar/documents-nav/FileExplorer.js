// import React, { useEffect, useState } from "react";

// // Component to display folders and files

// // const Folder = ({ name, content, onSelectPath, currentPath = "" }) => {
// //   console.log("firm client docs",content)
// //   const [isOpen, setIsOpen] = useState(false);
// //   const isFile = content.filename;
// //   const fullPath = currentPath ? `${currentPath}/${name}` : name;

// //   if (isFile) {
// //     return (
// //       <div style={{ paddingLeft: 20 }}>
// //         📄 <span>{content.filename}</span>
// //       </div>
// //     );
// //   }

// //   const handleClick = () => {
// //     setIsOpen(!isOpen);
// //     if (onSelectPath) {
// //       onSelectPath(fullPath);
// //     }
// //   };

// //   return (
// //     <div style={{ paddingLeft: 20 }}>
// //       <div onClick={handleClick} style={{ cursor: "pointer" }}>
// //         {isOpen ? "📂" : "📁"} <span>{name}</span>
// //       </div>
// //       {isOpen &&
// //         Object.entries(content).map(([childName, childContent]) => (
// //           <Folder
// //             key={childName}
// //             name={childName}
// //             content={childContent}
// //             onSelectPath={onSelectPath}
// //             currentPath={fullPath}
// //           />
// //         ))}
// //     </div>
// //   );
// // };

// // const Folder = ({ name, content, onSelectPath, currentPath = "" }) => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const isFile = content.filename;
// //   const fullPath = currentPath ? `${currentPath}/${name}` : name;

// //   if (isFile) {
// //     const { permissions = {} } = content;

// //     return (
// //       <div style={{ paddingLeft: 20, marginBottom: 10 }}>
// //         📄 <span>{content.filename}</span>
// //         <div style={{ display: "flex", gap: "10px", marginTop: 5 }}>
// //           <label>
// //             <input type="checkbox" checked={permissions.canView}  />
// //             View
// //           </label>
// //           <label>
// //             <input type="checkbox" checked={permissions.canDownload}  />
// //             Download
// //           </label>
// //           <label>
// //             <input type="checkbox" checked={permissions.canUpdate}  />
// //             Update
// //           </label>
// //           <label>
// //             <input type="checkbox" checked={permissions.canDelete}  />
// //             Delete
// //           </label>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const handleClick = () => {
// //     setIsOpen(!isOpen);
// //     if (onSelectPath) {
// //       onSelectPath(fullPath);
// //     }
// //   };

// //   return (
// //     <div style={{ paddingLeft: 20 }}>
// //       <div onClick={handleClick} style={{ cursor: "pointer" }}>
// //         {isOpen ? "📂" : "📁"} <span>{name}</span>
// //       </div>
// //       {isOpen &&
// //         Object.entries(content).map(([childName, childContent]) => (
// //           <Folder
// //             key={childName}
// //             name={childName}
// //             content={childContent}
// //             onSelectPath={onSelectPath}
// //             currentPath={fullPath}
// //           />
// //         ))}
// //     </div>
// //   );
// // };

// const Folder = ({ name, content, onSelectPath, currentPath = "" }) => {
//   console.log("nbhds", content);
//   const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
//   const [isOpen, setIsOpen] = useState(false);
//   const isFile = content.filename;
//   const fullPath = currentPath ? `${currentPath}/${name}` : name;

//   const handlePermissionChange = async (permKey, value) => {
//     const updatedPermissions = {
//       ...content.permissions,
//       [permKey]: value,
//     };

//     try {
//       const response = await fetch(
//         `${DOCS_MANAGMENTS}/firmDocs/permissions/${content._id}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ permissions: updatedPermissions }),
//         }
//       );
//       console.log("data update", updatedPermissions);
//       if (!response.ok) {
//         throw new Error("Failed to update permissions");
//       }

//       // Optional: Show toast or success message
//     } catch (err) {
//       console.error("Permission update error:", err);
//       // Optional: Show error message
//     }
//   };

//   if (isFile) {
//     const { permissions = {} } = content;

//     return (
//       <div style={{ paddingLeft: 20, marginBottom: 10 }}>
//         📄 <span>{content.filename}</span>
//         <div style={{ display: "flex", gap: "10px", marginTop: 5 }}>
//           {["canView", "canDownload", "canUpdate", "canDelete"].map((perm) => (
//             <label key={perm}>
//               <input
//                 type="checkbox"
//                 checked={permissions[perm]}
//                 onChange={(e) => handlePermissionChange(perm, e.target.checked)}
//               />
//               {perm.replace("can", "")}
//             </label>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   const handleClick = () => {
//     setIsOpen(!isOpen);
//     if (onSelectPath) {
//       onSelectPath(fullPath);
//     }
//   };

//   return (
//     <div style={{ paddingLeft: 20 }}>
//       <div onClick={handleClick} style={{ cursor: "pointer" }}>
//         {isOpen ? "📂" : "📁"} <span>{name}</span>
//       </div>
//       {isOpen &&
//         Object.entries(content).map(([childName, childContent]) => (
//           <Folder
//             key={childName}
//             name={childName}
//             content={childContent}
//             onSelectPath={onSelectPath}
//             currentPath={fullPath}
//           />
//         ))}
//     </div>
//   );
// };

// const buildFileTree = (files, folderStart) => {
//   const root = {};

//   // Ensure the base folder exists
//   const parts = folderStart.split("/");
//   let current = root;
//   parts.forEach((part) => {
//     if (!current[part]) {
//       current[part] = {};
//     }
//     current = current[part];
//   });

//   files.forEach((file) => {
//     let path = file.filePath.replace(/\\/g, "/"); // Normalize slashes
//     const index = path.toLowerCase().indexOf(folderStart.toLowerCase());

//     if (index === -1) return;
//     path = path.slice(index); // Trim before folderStart

//     const fileParts = path.split("/");

//     let current = root;

//     // Build path
//     fileParts.forEach((part) => {
//       if (!current[part]) {
//         current[part] = {};
//       }
//       current = current[part];
//     });

//     // Skip default.txt
//     if (file.filename !== "#$default.txt") {
//       current[file.filename] = file;
//     }
//   });

//   return root;
// };

// const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;

// const FileExplorer = ({ onPathSelect, accountId }) => {
//   const [files, setFiles] = useState([]);
//   const folderName = "Firm Docs Shared With Client";

//   const fetchFiles = async () => {
//     try {
//       const res = await fetch(`${DOCS_MANAGMENTS}/firmDocs/files/${accountId}`);
//       const data = await res.json();
//       setFiles(data.files || []);
//     } catch (err) {
//       console.error("Failed to fetch files", err);
//     }
//   };

//   useEffect(() => {
//     if (accountId) {
//       fetchFiles(); // Only fetch when drawer is opened
//     }
//   }, [accountId]);
//   const fileTree = buildFileTree(files, folderName);

//   return (
//     <div>
//       {Object.entries(fileTree).map(([name, content]) => (
//         <Folder
//           key={name}
//           name={name}
//           content={content}
//           onSelectPath={onPathSelect}
//         />
//       ))}
//     </div>
//   );
// };

// export default FileExplorer;

import React, { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem } from "@mui/material";
import { DocusealBuilder } from "@docuseal/react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import customCss from "./docuseal-dark-theme.css"
const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
const SIGNATURE_API =process.env.REACT_APP_ESIGNATURE_API
const Folder = ({
  name,
  content,
  onSelectPath,
  currentPath = "",
  onPermissionUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFile = content.filename;
  const fullPath = currentPath ? `${currentPath}/${name}` : name;
  const [token, setToken] = useState("");
  const [showBuilderFor, setShowBuilderFor] = useState(null);
  const [polling, setPolling] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // dialog state
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePermissionChange = async (permKey, value) => {
    const updatedPermissions = {
      ...content.permissions,
      [permKey]: value,
    };

    try {
      const response = await fetch(
        `${DOCS_MANAGMENTS}/firmDocs/permissions/${content._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ permissions: updatedPermissions }),
        }
      );

      if (!response.ok) throw new Error("Failed to update permissions");

      // Update local file state
      if (onPermissionUpdate) {
        onPermissionUpdate(content._id, updatedPermissions);
      }
    } catch (err) {
      console.error("Permission update error:", err);
    }
  };

const handleDeleteFile = async () => {
  handleMenuClose();

  if (!content.permissions?.canDelete) {
    alert("You don't have permission to delete this file.");
    return;
  }

  const confirmDelete = window.confirm(`Are you sure you want to delete "${content.filename}"?`);
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${DOCS_MANAGMENTS}/firmDocs/delete/${content.accountId}/${content.filename}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete the file.");
    }

    alert("File deleted successfully!");

    // Optionally trigger re-fetch or update file list in parent
    // e.g., call a prop method like onFileDeleted(content._id)
    // window.location.reload(); // or refetch files if you prefer
  } catch (err) {
    console.error("File deletion failed:", err);
    alert("Failed to delete the file.");
  }
};

  const handleRequestSignature = async () => {
    handleMenuClose();
    try {
      const fileUrl = `https://snptaxes.com/${content.filePath}/${content.filename}`;
      const fileName = content.filename;
      const res = await fetch(
        `${SIGNATURE_API}/api/generate-token?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}`
      );
      const data = await res.json();
      setToken(data.token);
      setShowBuilderFor(content._id);
      setOpenDialog(true);
      setPolling(true);
    } catch (err) {
      console.error("Failed to request signature:", err);
    }
  };
  const [submissions, setSubmissions] = useState([]);
  // Poll submissions
  useEffect(() => {
    if (!polling) return;

    const interval = setInterval(async () => {
      const res = await fetch(`${SIGNATURE_API}/api/submissions`);
      const data = await res.json();

      if (data.submissions && data.submissions.length > 0) {
        const latest = data.submissions[0];

        // Check by external_id or created_at if needed
        if (!submissions.find((s) => s.id === latest.id)) {
          console.log("✅ New Submission Detected:", latest);
          console.log(latest.submitters[0].slug);
          setSubmissions((prev) => [latest, ...prev]);
          setPolling(false); // Stop polling after getting one
        }
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [polling, submissions]);
  if (isFile) {
    const { permissions = {} } = content;

    // return (
    //   <div style={{ paddingLeft: 20, marginBottom: 10 }}>
    //     📄 <span>{content.filename}</span>
    //     <div style={{ display: "flex", gap: "10px", marginTop: 5 }}>
    //       {["canView", "canDownload", "canUpdate", "canDelete"].map((perm) => (
    //         <label key={perm} style={{cursor:'pointer'}}>
    //           <input
    //             type="checkbox"
    //             checked={permissions[perm]}
    //             onChange={(e) => handlePermissionChange(perm, e.target.checked)}

    //           />
    //           {perm.replace("can", "")}
    //         </label>
    //       ))}
    //     </div>
    //   </div>
    // );

    return (

      <div
  style={{
    paddingLeft: 20,
    marginBottom: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  }}
>
  {/* Left side: filename + permissions */}
  <div style={{ display: "flex", flexDirection: "column" }}>
    <div>📄 <span>{content.filename}</span></div>
    <div style={{ display: "flex", gap: "10px", marginTop: 5 }}>
      {["canView", "canDownload", "canUpdate", "canDelete"].map((perm) => (
        <label key={perm} style={{ cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={permissions[perm]}
            onChange={(e) => handlePermissionChange(perm, e.target.checked)}
          />
          {perm.replace("can", "")}
        </label>
      ))}
    </div>
  </div>

  {/* Right side: three-dot icon */}
  <div>
    <IconButton onClick={handleMenuOpen}>
      <MoreVertIcon />
    </IconButton>
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
      {content.filename.toLowerCase().endsWith(".pdf") && (
        <MenuItem onClick={handleRequestSignature}>Request Signature</MenuItem>
      )}
      <MenuItem onClick={handleMenuClose}>Rename</MenuItem>
      <MenuItem onClick={handleMenuClose}>Download</MenuItem>
  {permissions.canDelete && (
  <MenuItem onClick={handleDeleteFile}>Delete</MenuItem>
)}

    </Menu>
  </div>

  {/* Dialog remains unchanged */}
  <Dialog
    open={openDialog && showBuilderFor === content._id}
    onClose={() => setOpenDialog(false)}
    fullWidth
    maxWidth="lg"
  >
    <DialogTitle>
      {content.filename}
      <IconButton
        aria-label="close"
        onClick={() => setOpenDialog(false)}
        style={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
      {token && <div className="app">
      <DocusealBuilder token={token} customCss={customCss}  />
    </div>}
    </DialogContent>
  </Dialog>
</div>

    );
  }

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (onSelectPath) onSelectPath(fullPath);
  };

  return (
    <div style={{ paddingLeft: 20 }}>
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
        {isOpen ? "📂" : "📁"} <span>{name}</span>
      </div>
      {isOpen &&
        Object.entries(content).map(([childName, childContent]) => (
          <Folder
            key={childName}
            name={childName}
            content={childContent}
            onSelectPath={onSelectPath}
            currentPath={fullPath}
            onPermissionUpdate={onPermissionUpdate}
          />
        ))}
    </div>
  );
};

const buildFileTree = (files, folderStart) => {
  const root = {};

  // Ensure the base folder exists
  const parts = folderStart.split("/");
  let current = root;
  parts.forEach((part) => {
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  });

  files.forEach((file) => {
    let path = file.filePath.replace(/\\/g, "/");
    const index = path.toLowerCase().indexOf(folderStart.toLowerCase());
    if (index === -1) return;

    path = path.slice(index);
    const fileParts = path.split("/");
    current = root;

    fileParts.forEach((part) => {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    });

    if (file.filename !== "#$default.txt") {
      current[file.filename] = file;
    }
  });

  return root;
};

const FileExplorer = ({ onPathSelect, accountId }) => {
  const [files, setFiles] = useState([]);
  const folderName = "Firm Docs Shared With Client";

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${DOCS_MANAGMENTS}/firmDocs/files/${accountId}`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  const updateFilePermissionsLocally = (fileId, updatedPermissions) => {
    setFiles((prev) =>
      prev.map((file) =>
        file._id === fileId
          ? { ...file, permissions: updatedPermissions }
          : file
      )
    );
  };

  useEffect(() => {
    if (accountId) {
      fetchFiles();
    }
  }, [accountId]);

  const fileTree = buildFileTree(files, folderName);

  return (
    <div>
      {Object.entries(fileTree).map(([name, content]) => (
        <Folder
          key={name}
          name={name}
          content={content}
          onSelectPath={onPathSelect}
          currentPath=""
          onPermissionUpdate={updateFilePermissionsLocally}
        />
      ))}
    </div>
  );
};

export default FileExplorer;
