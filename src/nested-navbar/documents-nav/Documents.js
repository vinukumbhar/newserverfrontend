
import {
  
  IconButton,
  Drawer,
  Autocomplete,
  Box,
  Button,
 
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CreateFolder from "./CreateFolder"
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
const Documents = () => {
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
  const [folderTemplates, setFolderTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { data } = useParams();
  console.log(data);
  const [isFolderFormOpen, setIsFolderFormOpen] = useState(false);
  const handleFormClose = ()=>{
    setIsFolderFormOpen(false)
    fetchFolders(data); 
  }
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

  const FolderContents = ({ contents }) => {
    const styles = {
      list: {
        listStyle: "none",
        marginLeft: "1em",
        paddingLeft: "0.5em",
      },
      item: {
        marginBottom: "0.8em",
        // borderBottom: "1px solid #ddd", // Add a horizontal line
        paddingBottom: "0.5em",
      },
      folder: {
        fontWeight: "bold",
        cursor: "pointer",
        color: "#007BFF",
      },
      file: {
        color: "#333",
      },
    };

    return (
      <ul style={styles.list}>
        {contents.map((item, index) => (
          <li key={index} style={styles.item}>
            {item.type === "folder" ? (
              <CollapsibleFolder name={item.name}>
                <FolderContents contents={item.contents} />
              </CollapsibleFolder>
            ) : (
              <span style={styles.file}>📄 {item.name}</span>
            )}
          </li>
        ))}
      </ul>
    );
  };
  const CollapsibleFolder = ({ name, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
      setIsOpen((prev) => !prev);
    };

    const styles = {
      folder: {
        fontWeight: "bold",
        cursor: "pointer",
        color: "#007BFF",
        display: "flex",
        alignItems: "center",
        // justifyContent: "space-between",
      },
      toggleIcon: {
        marginRight: "0.5em",
        cursor: "pointer",
        userSelect: "none",
        marginTop: "0.3em",
      },
      content: {
        display: isOpen ? "block" : "none",
      },
      icon: {
        cursor: "pointer", // To make the icon clickable
        marginLeft: "auto",
      },
    };

    return (
      <div>
        <div style={styles.folder} onClick={handleToggle}>
          <span style={styles.toggleIcon}>{isOpen ? "📂" : "📁"}</span>
          {name}
        </div>
        <div style={styles.content}>{children}</div>
      </div>
    );
  };
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

  // if (loading) {
  //   return <p>Loading folder structure...</p>;
  // }
  // if (error) {
  //   return <p>Error: {error}</p>;
  // }
 // Function to open the create folder drawer
 const handleOpenCreateFolder = () => {
  setIsFolderFormOpen(true);
};
  return (
    <Box>
      <Box>
        <Button
          variant="contained"
          onClick={handleOpenCreateFolder}
          sx={{
            backgroundColor: "var(--color-save-btn)", // Normal background

            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)", // Hover background color
            },
            borderRadius: "15px",
          }}
        >
          Create Folder
        </Button>
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
          sx={{ width: "100%", marginTop: "8px" }}
          clearOnEscape // Enable clearable functionality
        />
      </Box>

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
          }}
        >
          Assign Template
        </Button>
      </Box>
      <Box>
        {" "}
        {folderdata && folderdata.contents && (
          <FolderContents contents={folderdata.contents} />
        )}
      </Box>
      <CreateFolder isFolderFormOpen={isFolderFormOpen} setIsFolderFormOpen={handleFormClose } templateId={data}  />
    </Box>
  );
};

export default Documents;
