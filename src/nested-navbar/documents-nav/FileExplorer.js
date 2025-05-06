// import React, { useEffect, useState } from "react";

// // Recursive Folder/File component
// const Folder = ({ name, content }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const isFile = content.filename;

//   if (isFile) {
//     return <div style={{ paddingLeft: 20 }}>📄 {content.filename}</div>;
//   }

//   return (
//     <div style={{ paddingLeft: 20 }}>
//       <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: "pointer", fontWeight: "bold" }}>
//         {isOpen ? "📂" : "📁"} {name}
//       </div>
//       {isOpen &&
//         Object.entries(content).map(([childName, childContent]) => (
//           <Folder key={childName} name={childName} content={childContent} />
//         ))}
//     </div>
//   );
// };

// // Converts flat file list into a folder structure tree
// const buildFileTree = (files, folderStart) => {
//   const root = {};

//   files.forEach((file) => {
//     const folderIndex = file.filePath.indexOf(folderStart);
//     if (folderIndex === -1) return;

//     const relativePath = file.filePath.slice(folderIndex);
//     const parts = relativePath.split("/");

//     let current = root;
//     parts.forEach((part, index) => {
//       if (!current[part]) {
//         current[part] = index === parts.length - 1 ? file : {};
//       }
//       current = current[part];
//     });
//   });

//   return root;
// };

// // Main component
// const FileExplorer = () => {
//   const [files, setFiles] = useState([]);
//   const folderName = "Firm Docs Shared With Client";

//   useEffect(() => {
//     const fetchFiles = async () => {
//       try {
//         const res = await fetch("http://127.0.0.1:8006/firmDocs/files/67fd062847d30cdaf4ab6594");
//         const data = await res.json();
//         setFiles(data.files || []);
//       } catch (err) {
//         console.error("Failed to fetch files", err);
//       }
//     };

//     fetchFiles();
//   }, []);

//   const fileTree = buildFileTree(files, folderName);

//   return (
//     <div>
//       {/* <h2>{folderName}</h2> */}
//       {Object.entries(fileTree).map(([name, content]) => (
//         <Folder key={name} name={name} content={content} />
//       ))}
//     </div>
//   );
// };

// export default FileExplorer;

import React, { useEffect, useState } from "react";

// Component to display folders and files

const Folder = ({ name, content, onSelectPath, currentPath = "" }) => {
  console.log(content)
  const [isOpen, setIsOpen] = useState(false);
  const isFile = content.filename;
  const fullPath = currentPath ? `${currentPath}/${name}` : name;

  if (isFile) {
    return (
      <div style={{ paddingLeft: 20 }}>
        📄 <span>{content.filename}</span>
      </div>
    );
  }

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (onSelectPath) {
      onSelectPath(fullPath);
    }
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
          />
        ))}
    </div>
  );
};


// Builds a nested tree from file paths


// const buildFileTree = (files, folderStart) => {
//   const root = {};

//   files.forEach((file) => {
//     let path = file.filePath.replace(/\\/g, "/"); // Normalize all slashes
//     const index = path.toLowerCase().indexOf(folderStart.toLowerCase());

//     if (index === -1) return;
//     path = path.slice(index); // Remove everything before the folder start

//     const parts = path.split("/");

//     let current = root;

//     // Create folder structure
//     parts.forEach((part) => {
//       if (!current[part]) {
//         current[part] = {};
//       }
//       current = current[part];
//     });

//     // Add the file if it's not #$default.txt
//     if (file.filename !== "#$default.txt") {
//       current[file.filename] = file;
//     }
//   });

//   return root;
// };

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
    let path = file.filePath.replace(/\\/g, "/"); // Normalize slashes
    const index = path.toLowerCase().indexOf(folderStart.toLowerCase());

    if (index === -1) return;
    path = path.slice(index); // Trim before folderStart

    const fileParts = path.split("/");

    let current = root;

    // Build path
    fileParts.forEach((part) => {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    });

    // Skip default.txt
    if (file.filename !== "#$default.txt") {
      current[file.filename] = file;
    }
  });

  return root;
};

 const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;

const FileExplorer = ({ onPathSelect,accountId }) => {
  const [files, setFiles] = useState([]);
  const folderName = "Firm Docs Shared With Client";

  

  const fetchFiles = async () => {
    try {
      const res = await fetch(
       `${DOCS_MANAGMENTS}/firmDocs/files/${accountId}`
      );
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error("Failed to fetch files", err);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchFiles(); // Only fetch when drawer is opened
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
        />
      ))}
    </div>
  );
};

export default FileExplorer;
