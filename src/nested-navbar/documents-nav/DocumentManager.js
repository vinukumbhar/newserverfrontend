// // DocumentManager.js (optional file)
// import React from "react";

// const Folder = ({ name, content, onDelete, onEdit, currentPath = "", onPathSelect, selectedPath }) => {
//   const [isOpen, setIsOpen] = React.useState(false);
//   const fullPath = currentPath ? `${currentPath}/${name}` : name;
//   const isSelected = selectedPath === fullPath;

//   return (
//     <div style={{ marginLeft: 20 }}>
//       <div
//         onClick={() => {
//           setIsOpen(!isOpen);
//           onPathSelect(fullPath); // Notify parent of selected path
//         }}
//         style={{
//           cursor: "pointer",
//           fontWeight: "bold",
//           backgroundColor: isSelected ? "#e0f7fa" : "transparent",
//           padding: "4px",
//           borderRadius: "4px",
//         }}
//       >
//         📁 {name} 
//       </div>

//       {isOpen && (
//         <div style={{ marginLeft: 20 }}>
//           {Object.entries(content).map(([subfolder, subcontent]) =>
//             subfolder !== "files" ? (
//               <Folder
//                 key={subfolder}
//                 name={subfolder}
//                 content={subcontent}
//                 currentPath={fullPath}
//                 onDelete={onDelete}
//                 onEdit={onEdit}
//                 onPathSelect={onPathSelect}
//                 selectedPath={selectedPath}
//               />
//             ) : null
//           )}
//           {content.files &&
//             content.files
//               .filter((file) => file.filename !== "#$default.txt")
//               .map((file) => (
//                 <div key={file._id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                   📄 {file.filename}
//                   {file.permissions.canDownload && (
//                     <a href={`http://127.0.0.1:8000/${file.filePath}/${file.filename}`} download>
//                       ⬇️
//                     </a>
//                   )}
//                   {file.permissions.canUpdate && <button onClick={() => onEdit(file)}>✏️</button>}
//                   {file.permissions.canDelete && <button onClick={() => onDelete(file)}>🗑️</button>}
//                 </div>
//               ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // const Folder = ({ name, content, onDelete, onEdit }) => {
// //   const [isOpen, setIsOpen] = React.useState(false);

// //   return (
// //     <div style={{ marginLeft: 20 }}>
// //       <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer", fontWeight: "bold" }}>
// //         📁 {name}
// //       </div>
// //       {isOpen && (
// //         <div style={{ marginLeft: 20 }}>
// //           {Object.entries(content).map(([subfolder, subcontent]) =>
// //             subfolder !== "files" ? (
// //               <Folder key={subfolder} name={subfolder} content={subcontent} onDelete={onDelete} onEdit={onEdit} />
// //             ) : null
// //           )}
// //           {content.files &&
// //             content.files
// //               .filter((file) => file.filename !== "#$default.txt")
// //               .map((file) => (
// //                 <div key={file._id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
// //                   📄 {file.filename}
// //                   {file.permissions.canDownload && (
// //                     <a href={`http://127.0.0.1:8000/${file.filePath}/${file.filename}`} download>
// //                       ⬇️
// //                     </a>
// //                   )}
// //                   {file.permissions.canUpdate && <button onClick={() => onEdit(file)}>✏️</button>}
// //                   {file.permissions.canDelete && <button onClick={() => onDelete(file)}>🗑️</button>}
// //                 </div>
// //               ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const DocumentManager = ({ files }) => {
// //   const folderStructure = organizeFilesIntoFolders(files);
// //   console.log("janvi",folderStructure)

// //   const handleDelete = (file) => {
// //     console.log("Deleting file:", file);
// //   };

// //   const handleEdit = (file) => {
// //     console.log("Editing file:", file);
// //   };

// //   return (
// //     <div>
// //       {Object.entries(folderStructure).map(([folder, content]) => (
// //         <Folder key={folder} name={folder} content={content} onDelete={handleDelete} onEdit={handleEdit} />
// //       ))}
// //     </div>
// //   );
// // };
// const DocumentManager = ({ files, onPathSelect, selectedPath }) => {
//   const folderStructure = organizeFilesIntoFolders(files);

//   const handleDelete = (file) => {
//     console.log("Deleting file:", file);
//   };

//   const handleEdit = (file) => {
//     console.log("Editing file:", file);
//   };

//   return (
//     <div>
//       {Object.entries(folderStructure).map(([folder, content]) => (
//         <Folder
//           key={folder}
//           name={folder}
//           content={content}
//           onDelete={handleDelete}
//           onEdit={handleEdit}
//           currentPath=""
//           onPathSelect={onPathSelect}
//           selectedPath={selectedPath}
//         />
//       ))}
//     </div>
//   );
// };

// const organizeFilesIntoFolders = (files = []) => {
//   if (!Array.isArray(files)) {
//     console.error("Files data is not an array", files);
//     return {};
//   }

//   const folderTree = {};

//   files.forEach((file) => {
//     if (!file.filePath) return;

//     const pathParts = file.filePath.split("/");
//     let currentLevel = folderTree;

//     pathParts.forEach((part, index) => {
//       if (!currentLevel[part]) {
//         currentLevel[part] = {};
//       }

//       if (index === pathParts.length - 1) {
//         if (!currentLevel[part].files) {
//           currentLevel[part].files = [];
//         }
//         currentLevel[part].files.push(file);
//       }

//       currentLevel = currentLevel[part];
//     });
//   });

//   return folderTree;
// };




// export default DocumentManager;


// import React, { useState } from "react";

// const Folder = ({
//   name,
//   content,
//   onDelete,
//   onEdit,
//   currentPath = "",
//   onPathSelect,
//   selectedPath,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const fullPath = currentPath ? `${currentPath}/${name}` : name;
//   const isSelected = selectedPath === fullPath;

//   return (
//     <div style={{ marginLeft: 20 }}>
//       <div
//         onClick={() => {
//           setIsOpen(!isOpen);
//           onPathSelect(fullPath);
//         }}
//         style={{
//           cursor: "pointer",
//           fontWeight: "bold",
//           backgroundColor: isSelected ? "#e0f7fa" : "transparent",
//           padding: "4px",
//           borderRadius: "4px",
//         }}
//       >
//         📁 {name}
//       </div>

//       {isOpen && (
//         <div style={{ marginLeft: 20 }}>
//           {Object.entries(content).map(([subfolder, subcontent]) =>
//             subfolder !== "files" ? (
//               <Folder
//                 key={subfolder}
//                 name={subfolder}
//                 content={subcontent}
//                 currentPath={fullPath}
//                 onDelete={onDelete}
//                 onEdit={onEdit}
//                 onPathSelect={onPathSelect}
//                 selectedPath={selectedPath}
//               />
//             ) : null
//           )}

//           {content.files ? (
//             content.files.filter((f) => f.filename !== "#$default.txt").length > 0 ? (
//               content.files
//                 .filter((f) => f.filename !== "#$default.txt")
//                 .map((file) => (
//                   <div
//                     key={file._id}
//                     style={{ display: "flex", alignItems: "center", gap: "10px" }}
//                   >
//                     📄 {file.filename}
//                     {file.permissions?.canDownload && (
//                       <a
//                         href={`http://127.0.0.1:8000/${file.filePath}/${file.filename}`}
//                         download
//                       >
//                         ⬇️
//                       </a>
//                     )}
//                     {file.permissions?.canUpdate && (
//                       <button onClick={() => onEdit(file)}>✏️</button>
//                     )}
//                     {file.permissions?.canDelete && (
//                       <button onClick={() => onDelete(file)}>🗑️</button>
//                     )}
//                   </div>
//                 ))
//             ) : (
//               <div style={{ fontStyle: "italic", color: "#888" }}>
               
//               </div>
//             )
//           ) : (
//             <div style={{ fontStyle: "italic", color: "#888" }}>
              
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const DocumentManager = ({ folderName, contents, onPathSelect, selectedPath }) => {
//   const folderStructure = buildFolderStructure(folderName, contents);

//   const handleDelete = (file) => {
//     console.log("Deleting file:", file);
//   };

//   const handleEdit = (file) => {
//     console.log("Editing file:", file);
//   };

//   return (
//     <div>
//       {Object.entries(folderStructure).map(([folder, content]) => (
//         <Folder
//           key={folder}
//           name={folder}
//           content={content}
//           onDelete={handleDelete}
//           onEdit={handleEdit}
//           currentPath=""
//           onPathSelect={onPathSelect}
//           selectedPath={selectedPath}
//         />
//       ))}
//     </div>
//   );
// };

// // Utility to create folder tree even if it's empty
// const buildFolderStructure = (folderName, contents = []) => {
//   const root = {};
//   const pathParts = folderName.split("/");

//   let current = root;
//   for (const part of pathParts) {
//     if (!current[part]) current[part] = {};
//     current = current[part];
//   }

//   // Attach files if any
//   current.files = contents
//     .map((item) => item.metadata)
//     .filter((file) => file && file.filename); // safety check

//   return root;
// };

// export default DocumentManager;

import React, { useState } from "react";

const Folder = ({
  name,
  content,
  onDelete,
  onEdit,
  currentPath = "",
  onPathSelect,
  selectedPath,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const fullPath = currentPath ? `${currentPath}/${name}` : name;
  const isSelected = selectedPath === fullPath;

  const toggleFolder = () => {
    setIsOpen(!isOpen);
    onPathSelect(fullPath);
  };

  return (
    <div style={{ marginLeft: 16 }}>
      <div
        onClick={toggleFolder}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          // fontWeight: isSelected ? "bold" : "normal",
          fontWeight:"bold",
          // backgroundColor: isSelected ? "#e0f7fa" : "transparent",
          padding: "6px 10px",
          borderRadius: "6px",
          transition: "background-color 0.2s ease",
        }}
      >
        <span style={{ marginRight: 6 }}>
          {isOpen ? "📂" : "📁"}
        </span>
        <span>{name}</span>
      </div>

      {isOpen && (
        <div style={{ marginLeft: 16, paddingLeft: 6, borderLeft: "1px dashed #ccc" }}>
          {/* Subfolders */}
          {Object.entries(content).map(([subfolder, subcontent]) =>
            subfolder !== "files" ? (
              <Folder
                key={subfolder}
                name={subfolder}
                content={subcontent}
                currentPath={fullPath}
                onDelete={onDelete}
                onEdit={onEdit}
                onPathSelect={onPathSelect}
                selectedPath={selectedPath}
              />
            ) : null
          )}

          {/* Files */}
          {content.files && content.files.length > 0 ? (
            content.files
              .filter((f) => f.filename !== "#$default.txt")
              .map((file) => (
                <div
                  key={file._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    margin: "2px 0",
                    backgroundColor: "#f9f9f9",
                    fontSize: "14px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    📄 {file.filename}
                  </div>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {file.permissions?.canDownload && (
                      <a
                        href={`http://127.0.0.1:8000/${file.filePath}/${file.filename}`}
                        download
                        title="Download"
                      >
                        ⬇️
                      </a>
                    )}
                    {file.permissions?.canUpdate && (
                      <button onClick={() => onEdit(file)} title="Edit">
                        ✏️
                      </button>
                    )}
                    {file.permissions?.canDelete && (
                      <button onClick={() => onDelete(file)} title="Delete">
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))
          ) : (
            <div style={{ fontStyle: "italic", color: "#aaa", marginTop: 4 }}>
              {/* No files available. */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DocumentManager = ({ folderName, contents, onPathSelect, selectedPath }) => {
  const folderStructure = buildFolderStructure(folderName, contents);

  const handleDelete = (file) => {
    console.log("Deleting file:", file);
  };

  const handleEdit = (file) => {
    console.log("Editing file:", file);
  };

  return (
    <div style={{ fontFamily: "Segoe UI, sans-serif", fontSize: "15px" }}>
      {Object.entries(folderStructure).map(([folder, content]) => (
        <Folder
          key={folder}
          name={folder}
          content={content}
          onDelete={handleDelete}
          onEdit={handleEdit}
          currentPath=""
          onPathSelect={onPathSelect}
          selectedPath={selectedPath}
        />
      ))}
    </div>
  );
};

// Utility to create folder tree even if it's empty
// const buildFolderStructure = (folderName, contents = []) => {
//   const root = {};
//   const pathParts = folderName.split("/");

//   let current = root;
//   for (const part of pathParts) {
//     if (!current[part]) current[part] = {};
//     current = current[part];
//   }

//   // Attach files
//   current.files = contents
//     .map((item) => item.metadata)
//     .filter((file) => file && file.filename);

//   return root;
// };

// const buildFolderStructure = (folderName, contents = []) => {
//   if (!folderName || typeof folderName !== "string") return {};

//   const root = {};
//   const pathParts = folderName.split("/");

//   let current = root;
//   for (const part of pathParts) {
//     if (!current[part]) current[part] = {};
//     current = current[part];
//   }

//   current.files = contents
//     .map((item) => item.metadata)
//     .filter((file) => file && file.filename);

//   return root;
// };
const buildFolderStructure = (folderName, contents = []) => {
  if (!folderName || typeof folderName !== "string") return {};

  const root = {};
  const pathParts = folderName.split("/");

  let current = root;
  for (const part of pathParts) {
    if (!current[part]) current[part] = {};
    current = current[part];
  }

  current.files = [];
  contents.forEach((item) => {
    if (item.file && item.metadata) {
      // It's a file
      current.files.push(item.metadata);
    } else if (item.folder) {
      // It's a folder
      current[item.folder] = { files: [] };
    }
  });

  return root;
};

export default DocumentManager;
