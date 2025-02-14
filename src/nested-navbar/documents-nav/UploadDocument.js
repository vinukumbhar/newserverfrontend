import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Box, Drawer ,LinearProgress,Typography} from "@mui/material";
import { toast } from "react-toastify";
import { BsFiletypeXls } from "react-icons/bs";
import { BsFiletypePdf } from "react-icons/bs";
import { BsFiletypeTxt } from "react-icons/bs";
import { BsFiletypeJpg } from "react-icons/bs";
import { Collapse, List, ListItem, ListItemIcon, ListItemText,IconButton } from "@mui/material";
import { 
  Folder, FolderOpen, PictureAsPdf, Description, InsertDriveFile, 
  Image, TableChart 
} from "@mui/icons-material";
import { RxCross2 } from "react-icons/rx";
import { BsFiletypePng } from "react-icons/bs";
// import { BsFiletypePng } from "react-icons/bs";
export default function UploadDocument ({
  isDocumentForm,
  setIsDocumentForm,
  templateId,
  file,
  setFile,
})  {
    const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;

  const [folderdata, setData] = useState("");
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

//   const handleSubmitfile = async (e) => {
//     let data = new FormData();
//     data.append("destinationPath", );
//     data.append("file", file);

//     let config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: `${DOCS_MANAGMENTS}/uploaddocuments/`,
//       data: data,
      
//     };
//     axios
//     .request(config)
//     .then((response) => {
//       console.log(JSON.stringify(response.data));
//       alert("File uploaded successfully!");
     
//     })
//     .catch((error) => {
//       console.error(error);
//       alert("Failed to upload the file.");
//     });

//   setIsDocumentForm(false);
//   setFile(null);
// };
 

const handleSubmitfile = async () => {
    if (!selectedFolder) {
      alert("Please select a folder before uploading.");
      return;
    }
  
    let data = new FormData();
    data.append("destinationPath", selectedFolder); // Set the folder path
    data.append("file", file);
  console.log(file)
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${DOCS_MANAGMENTS}/uploaddocuments/`,
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        // alert("File uploaded successfully!");
       
        setSelectedFolder(null)
        // setFile(null)
        
    setIsDocumentForm(false);
    setFile(null);
        toast.success("File uploaded successfully!");
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to upload the file.");
      });
  
  };
  


return (
    <Drawer
      anchor="right"
      open={isDocumentForm}
      onClose={() => setIsDocumentForm(false)}
      PaperProps={{
        sx: {
          width: 600,
          p:3
        },
      }}
    >

<Box >
<Box  sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            
          }}>
        <Typography
         
        >
         Upload Documents
          
        </Typography>
        <IconButton
            aria-label="close"
            onClick={() => setIsDocumentForm(false)}
          >
            <RxCross2  style={{ color: "#1976d3" }} />
          </IconButton>
        </Box>
{folderdata && folderdata.contents && (
          <FolderContents
            contents={folderdata.contents}
            setSelectedFolder={setSelectedFolder}
            selectedFolder={selectedFolder} 
            templateId={templateId}
          />
        )}
        </Box>
      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!file || !selectedFolder} // Disable if no file or folder is selected
  onClick={handleSubmitfile}
         
          sx={{
            backgroundColor: 'var(--color-save-btn)',  // Normal background
           
            '&:hover': {
              backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
            },
            borderRadius:'15px', width:'80px'
          }}
        >
          Upload
        </Button>
        <Button variant="outlined"  onClick={() => setIsDocumentForm(false)} sx={{
                  borderColor: 'var(--color-border-cancel-btn)',  // Normal background
                 color:'var(--color-save-btn)',
                  '&:hover': {
                    backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                    color:'#fff',
                    border:"none"
                  },
                  width:'80px',borderRadius:'15px'
                }}>
          Cancel
        </Button>
      </Box>
    </Drawer>
  );
};
// Function to get file icons based on extensions
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
const FolderContents = ({ contents, setSelectedFolder, selectedFolder, parentPath = "", templateId }) => {
  const [openFolders, setOpenFolders] = useState({});

  const toggleFolder = (folderPath) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }));
  };

  return (
    
    <List component="nav" sx={{ paddingLeft: 2 }}>
      {contents.map((item, index) => {
        const fullPath = parentPath ? `${parentPath}/${item.name}` : `uploads/${templateId}/${item.name}`;

        return (
          <Box key={index} >
            {item.type === "folder" ? (
              <>
                <ListItem
                  button
                  onClick={() => {
                    toggleFolder(fullPath);
                    setSelectedFolder(fullPath);
                    console.log("Selected Folder Path:", fullPath);
                  }}
                  sx={{
                    fontWeight: selectedFolder === fullPath ? "bold" : "normal",
                    color: "#007BFF",
                  }}
                >
                  <ListItemIcon>
                    {openFolders[fullPath] ? (
                      <FolderOpen sx={{ color: "#FF9D23" }} />
                    ) : (
                      <Folder sx={{ color: "#FF9D23" }} />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItem>

                <Collapse in={openFolders[fullPath]} timeout="auto" unmountOnExit>
                  <FolderContents
                    contents={item.contents}
                    setSelectedFolder={setSelectedFolder}
                    selectedFolder={selectedFolder}
                    parentPath={fullPath}
                    templateId={templateId}
                  />
                </Collapse>
              </>
            ) : (
              <ListItem sx={{ paddingLeft: 4 }}>
                <ListItemIcon>{getFileIcon(item.name)}</ListItemIcon>
                <ListItemText primary={item.name} sx={{ color: "#333" }} />
              </ListItem>
            )}
          </Box>
        );
      })}
    </List>
  );
  // return (
  //   <ul style={{ listStyle: "none", marginLeft: "1em", paddingLeft: "0.5em" }}>
  //     {contents.map((item, index) => {
  //       // Construct the full path dynamically
  //       const fullPath = parentPath ? `${parentPath}/${item.name}` : `uploads/${templateId}/${item.name}`;

  //       // return (
  //       //   <li key={index} style={{ marginBottom: "0.8em" }}>
  //       //     {item.type === "folder" ? (
  //       //       <div>
  //       //         <div
  //       //           onClick={() => {
  //       //             toggleFolder(fullPath);
  //       //             setSelectedFolder(fullPath);
  //       //             console.log("Selected Folder Path:", fullPath);
  //       //           }}
  //       //           style={{
  //       //             fontWeight: selectedFolder === fullPath ? "bold" : "normal",
  //       //             cursor: "pointer",
  //       //             color:  "#007BFF",
  //       //           }}
  //       //         >
  //       //           {openFolders[fullPath] ? "📂" : "📁"} {item.name}
  //       //         </div>

  //       //         {openFolders[fullPath] && item.contents.length > 0 && (
  //       //           <FolderContents
  //       //             contents={item.contents}
  //       //             setSelectedFolder={setSelectedFolder}
  //       //             selectedFolder={selectedFolder}
  //       //             parentPath={fullPath} // Pass the updated path down to maintain hierarchy
  //       //             templateId={templateId}
  //       //           />
  //       //         )}
  //       //       </div>
  //       //     ) : (
  //       //       <span style={{ color: "#333" }}>📄 {item.name}</span>
  //       //     )}
  //       //   </li>
  //       // );
      
      
       
      
  //     })}
  //   </ul>
  // );
};

