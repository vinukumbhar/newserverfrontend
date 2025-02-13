// // import { FaTimes } from "react-icons/fa";
// // import {
// //   Drawer,
// //   IconButton,
// // } from "@mui/material";
// // import { useEffect, useState } from "react";
// // export default function CreateFolder({
// //   setIsFolderFormOpen,
// //   isFolderFormOpen,
// //   templateId,
// // }) {
// //   const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
// //   useEffect(() => {
// //     console.log(templateId);
// //   }, [templateId]);

// //   const handleFormClose = () => {
// //     setIsFolderFormOpen(false);
// //   };
// //   useEffect(() => {
// //     if (templateId) {
// //       fetchFolders();
// //     }
// //   }, [templateId]);
// //   const [folderdata, setData] = useState(""); // Store the API response
// //   const fetchFolders = async () => {
// //     try {
// //       const response = await fetch(
// //         `${DOCS_MANAGMENTS}/clientdocs/folders/${templateId}`
// //       );

// //       if (!response.ok) {
// //         throw new Error(`HTTP error! Status: ${response.status}`);
// //       }

// //       const result = await response.json();
// //       setData(result); // Set the fetched data
// //       console.log("folders data", result);
// //     } catch (error) {
// //       console.log(error.message);
// //     }
// //   };
// //   const FolderContents = ({ contents }) => {
// //     const styles = {
// //       list: {
// //         listStyle: "none",
// //         marginLeft: "1em",
// //         paddingLeft: "0.5em",
// //       },
// //       item: {
// //         marginBottom: "0.8em",
// //         // borderBottom: "1px solid #ddd", // Add a horizontal line
// //         paddingBottom: "0.5em",
// //       },
// //       folder: {
// //         fontWeight: "bold",
// //         cursor: "pointer",
// //         color: "#007BFF",
// //       },
// //       file: {
// //         color: "#333",
// //       },
// //     };

// //     return (
// //       <ul style={styles.list}>
// //         {contents.map((item, index) => (
// //           <li key={index} style={styles.item}>
// //             {item.type === "folder" ? (
// //               <CollapsibleFolder name={item.name}>
// //                 <FolderContents contents={item.contents} />
// //               </CollapsibleFolder>
// //             ) : (
// //               <span style={styles.file}>📄 {item.name}</span>
// //             )}
// //           </li>
// //         ))}
// //       </ul>
// //     );
// //   };
// //   const CollapsibleFolder = ({ name, children }) => {
// //     const [isOpen, setIsOpen] = useState(false);

// //     const handleToggle = () => {
// //       setIsOpen((prev) => !prev);
// //     };

// //     const styles = {
// //       folder: {
// //         fontWeight: "bold",
// //         cursor: "pointer",
// //         color: "#007BFF",
// //         display: "flex",
// //         alignItems: "center",
// //         // justifyContent: "space-between",
// //       },
// //       toggleIcon: {
// //         marginRight: "0.5em",
// //         cursor: "pointer",
// //         userSelect: "none",
// //         marginTop: "0.3em",
// //       },
// //       content: {
// //         display: isOpen ? "block" : "none",
// //       },
// //       icon: {
// //         cursor: "pointer", // To make the icon clickable
// //         marginLeft: "auto",
// //       },
// //     };

// //     return (
// //       <div>
// //         <div style={styles.folder} onClick={handleToggle}>
// //           <span style={styles.toggleIcon}>{isOpen ? "📂" : "📁"}</span>
// //           {name}
// //         </div>
// //         <div style={styles.content}>{children}</div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <Drawer
// //       anchor="right"
// //       open={isFolderFormOpen}
// //       onClose={handleFormClose}
// //       PaperProps={{ sx: { width: 800 } }} // Set width of the Drawer
// //     >
// //       <div style={{ padding: 16 }}>
// //         <div>
// //           <h1
// //             style={{
// //               display: "flex",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //             }}
// //           >
// //             Create Folder
// //             <IconButton aria-label="close" onClick={handleFormClose}>
// //               <FaTimes style={{ color: "#1976d3" }} />
// //             </IconButton>
// //           </h1>
// //         </div>

// //         {folderdata && folderdata.contents && (
// //           <FolderContents contents={folderdata.contents} />
// //         )}
// //       </div>
// //     </Drawer>
// //   );
// // }

// import { FaTimes } from "react-icons/fa";
// import { Drawer, IconButton, TextField, Button } from "@mui/material";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function CreateFolder({
//   setIsFolderFormOpen,
//   isFolderFormOpen,
//   templateId,
// }) {
//   const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;

//   const [folderdata, setData] = useState("");
//   const [newFolderName, setNewFolderName] = useState("");
//   const [selectedFolder, setSelectedFolder] = useState(null);

//   useEffect(() => {
//     if (templateId) {
//       fetchFolders();
//     }
//   }, [templateId]);

//   const fetchFolders = async () => {
//     try {
//       const response = await fetch(
//         `${DOCS_MANAGMENTS}/clientdocs/folders/${templateId}`
//       );
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const result = await response.json();
//       setData(result);
//       console.log("folders",result)
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const createFolderAPI = async () => {
//     if (!newFolderName.trim()) return;
//     const newFolderPath = selectedFolder ? selectedFolder : "uploads";
//     console.log(newFolderPath);
//     try {
//       const response = await axios.get(
//         `${DOCS_MANAGMENTS}/createnewFolder/?path=${newFolderPath}/${templateId}&foldername=${newFolderName}`
//       );
//       console.log("API Response:", response.data);
//       setNewFolderName("");
//       fetchFolders();
//     } catch (error) {
//       console.log("API Error:", error);
//     }
//   };

//   return (
//     <Drawer
//       anchor="right"
//       open={isFolderFormOpen}
//       onClose={() => setIsFolderFormOpen(false)}
//       PaperProps={{ sx: { width: 800 } }}
//     >
//       <div style={{ padding: 16 }}>
//         <h1
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           Create Folder
//           <IconButton
//             aria-label="close"
//             onClick={() => setIsFolderFormOpen(false)}
//           >
//             <FaTimes style={{ color: "#1976d3" }} />
//           </IconButton>
//         </h1>

//         <TextField
//           label="Folder Name"
//           variant="outlined"
//           fullWidth
//           value={newFolderName}
//           onChange={(e) => setNewFolderName(e.target.value)}
//           style={{ marginBottom: 16 }}
//         />

//         <Button variant="contained" color="primary" onClick={createFolderAPI}>
//           Save
//         </Button>

//         {folderdata && folderdata.contents && (
//           <FolderContents
//             contents={folderdata.contents}
//             setSelectedFolder={setSelectedFolder}
//           />
//         )}
//       </div>
//     </Drawer>
//   );
// }

// // const FolderContents = ({ contents, setSelectedFolder }) => {
// //   return (
// //     <ul style={{ listStyle: "none", marginLeft: "1em", paddingLeft: "0.5em" }}>
// //       {contents.map((item, index) => (
// //         <li key={index} style={{ marginBottom: "0.8em" }}>
// //           {item.type === "folder" ? (
// //             <div
// //               onClick={() => setSelectedFolder(item.path)}
// //               style={{
// //                 fontWeight: "bold",
// //                 cursor: "pointer",
// //                 color: "#007BFF",
// //               }}
// //             >
// //               📁 {item.name}
// //             </div>
// //           ) : (
// //             <span style={{ color: "#333" }}>📄 {item.name}</span>
// //           )}
// //         </li>
// //       ))}
// //     </ul>
// //   );
// // };


// const FolderContents = ({ contents, setSelectedFolder }) => {
//   return (
//     <ul style={{ listStyle: "none", marginLeft: "1em", paddingLeft: "0.5em" }}>
//       {contents.map((item, index) => (
//         <li key={index} style={{ marginBottom: "0.8em" }}>
//           {item.type === "folder" ? (
//             <div
//               onClick={() => setSelectedFolder(`uploads/${item.name}`)}
//               style={{
//                 fontWeight: "bold",
//                 cursor: "pointer",
//                 color: selectedFolder === `uploads/${item.name}` ? "#FF5733" : "#007BFF",
//               }}
//             >
//               📁 {item.name}
//             </div>
//           ) : (
//             <span style={{ color: "#333" }}>📄 {item.name}</span>
//           )}
//         </li>
//       ))}
//     </ul>
//   );
// };


import { FaTimes } from "react-icons/fa";
import { Drawer, IconButton, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CreateFolder({
  setIsFolderFormOpen,
  isFolderFormOpen,
  templateId,
}) {
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;

  const [folderdata, setData] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    if (templateId) {
      fetchFolders();
    }
  }, [templateId]);

  const fetchFolders = async () => {
    try {
      const response = await fetch(
        `${DOCS_MANAGMENTS}/clientdocs/folders/${templateId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      console.log("folders", result);
    } catch (error) {
      console.log(error.message);
    }
  };

  const createFolderAPI = async () => {
    if (!newFolderName.trim()) return;
    const newFolderPath = selectedFolder ? selectedFolder : `uploads/${templateId}`;
    console.log("Creating folder in:", newFolderPath);
    try {
      const response = await axios.get(
       `${DOCS_MANAGMENTS}/createnewFolder/?path=${newFolderPath}&foldername=${newFolderName}`
      );
      console.log("API Response:", response.data);
      setNewFolderName("");
      fetchFolders();
      setIsFolderFormOpen(false)
      
    } catch (error) {
      console.log("API Error:", error);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isFolderFormOpen}
      onClose={() => setIsFolderFormOpen(false)}
      PaperProps={{ sx: { width: 800 } }}
    >
      <div style={{ padding: 16 }}>
        <h1
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Create Folder
          <IconButton
            aria-label="close"
            onClick={() => setIsFolderFormOpen(false)}
          >
            <FaTimes style={{ color: "#1976d3" }} />
          </IconButton>
        </h1>

        <TextField
          label="Folder Name"
          variant="outlined"
          fullWidth
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <Button variant="contained" color="primary" onClick={createFolderAPI}>
          Save
        </Button>

        {folderdata && folderdata.contents && (
          <FolderContents
            contents={folderdata.contents}
            setSelectedFolder={setSelectedFolder}
            selectedFolder={selectedFolder} 
            templateId={templateId}
          />
        )}
      </div>
    </Drawer>
  );
}

// const FolderContents = ({ contents, setSelectedFolder, selectedFolder,templateId}) => {
//   const [openFolders, setOpenFolders] = useState({});
//   const toggleFolder = (folderPath) => {
//     setOpenFolders((prev) => ({
//       ...prev,
//       [folderPath]: !prev[folderPath],
//     }));
//   };

//   return (
//     <ul style={{ listStyle: "none", marginLeft: "1em", paddingLeft: "0.5em" }}>
//       {contents.map((item, index) => (
//         <li key={index} style={{ marginBottom: "0.8em" }}>
//           {item.type === "folder" ? (
//              <div>
//             <div
//               // onClick={() => setSelectedFolder(`uploads/${item.name}`)}
//               // onClick={() => {
//               //   const selectedPath = `uploads/${templateId}/${item.name}`;
//               //   console.log("Selected Folder Path:", selectedPath);
//               //   setSelectedFolder(selectedPath);
//               // }}
//               onClick={() => {
//                 toggleFolder(`uploads/${templateId}/${item.name}`);
//                 setSelectedFolder(`uploads/${templateId}/${item.name}`);
//                 console.log("Selected Folder Path:", `uploads/${templateId}/${item.name}`);
//               }}
//               style={{
//                 fontWeight: "bold",
//                 cursor: "pointer",
//                 color: selectedFolder === `uploads/${templateId}/${item.name}` ? "#FF5733" : "#007BFF",
//               }}
//             >
//               {openFolders[`uploads/${templateId}/${item.name}`] ? "📂" : "📁"} {item.name}
//             </div>
//              {openFolders[`uploads/${templateId}/${item.name}`] && item.contents.length > 0 && (
//               <FolderContents
//                 contents={item.contents}
//                 setSelectedFolder={setSelectedFolder}
//                 selectedFolder={selectedFolder}
//                 templateId={templateId}
//               />
//             )}
//             </div>
//           ) : (
//             <span style={{ color: "#333" }}>📄 {item.name}</span>
//           )}
//         </li>
//       ))}
//     </ul>
//   );
// };


const FolderContents = ({ contents, setSelectedFolder, selectedFolder, parentPath = "", templateId }) => {
  const [openFolders, setOpenFolders] = useState({});

  const toggleFolder = (folderPath) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  return (
    <ul style={{ listStyle: "none", marginLeft: "1em", paddingLeft: "0.5em" }}>
      {contents.map((item, index) => {
        // Construct the full path dynamically
        const fullPath = parentPath ? `${parentPath}/${item.name}` : `uploads/${templateId}/${item.name}`;

        return (
          <li key={index} style={{ marginBottom: "0.8em" }}>
            {item.type === "folder" ? (
              <div>
                <div
                  onClick={() => {
                    toggleFolder(fullPath);
                    setSelectedFolder(fullPath);
                    console.log("Selected Folder Path:", fullPath);
                  }}
                  style={{
                    fontWeight: "bold",
                    cursor: "pointer",
                    color: selectedFolder === fullPath ? "#FF5733" : "#007BFF",
                  }}
                >
                  {openFolders[fullPath] ? "📂" : "📁"} {item.name}
                </div>

                {openFolders[fullPath] && item.contents.length > 0 && (
                  <FolderContents
                    contents={item.contents}
                    setSelectedFolder={setSelectedFolder}
                    selectedFolder={selectedFolder}
                    parentPath={fullPath} // Pass the updated path down to maintain hierarchy
                    templateId={templateId}
                  />
                )}
              </div>
            ) : (
              <span style={{ color: "#333" }}>📄 {item.name}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
};
