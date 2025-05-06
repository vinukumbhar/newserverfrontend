

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



const FileExplorer = ({ onPathSelect,accountId, }) => {
  const [files, setFiles] = useState([]);
  const folderName = "Firm Docs Shared With Client";

  const API_KEY = process.env.REACT_APP_FOLDER_URL;

  const fetchFiles = async () => {
    try {
      const res = await fetch(
       `${API_KEY}/firmClientDocs/files/${accountId}`
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
