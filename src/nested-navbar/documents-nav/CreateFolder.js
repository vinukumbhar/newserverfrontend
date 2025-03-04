import { RxCross2 } from "react-icons/rx";
import { Drawer, IconButton, TextField, Button, Typography,Box } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Collapse, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { 
  Folder, FolderOpen, PictureAsPdf, Description, InsertDriveFile, 
  Image, TableChart 
} from "@mui/icons-material";
import { BsFiletypeXls } from "react-icons/bs";
import { BsFiletypePdf } from "react-icons/bs";
import { BsFiletypeTxt } from "react-icons/bs";
import { BsFiletypeJpg } from "react-icons/bs";
import { BsFiletypePng } from "react-icons/bs";
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
      setIsFolderFormOpen(false);
      setSelectedFolder(null)
      toast.success("Folder Created Successfully")
      
    } catch (error) {
      console.log("API Error:", error);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isFolderFormOpen}
      onClose={() => setIsFolderFormOpen(false)}
      PaperProps={{ sx: { width: 600 } }}
    >
      <Box style={{ padding: 10 }}>
        <Box  sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            
          }}>
        <Typography
         
        >
          Create Folder
          
        </Typography>
        <IconButton
            aria-label="close"
            onClick={() => setIsFolderFormOpen(false)}
          >
            <RxCross2  style={{ color: "#1976d3" }} />
          </IconButton>
        </Box>
       

        <TextField
          placeholder="Create Folder "
          // variant="outlined"
          fullWidth
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          // style={{ marginBottom: 16 }}
          size="small"
          margin="normal"
        />
<Box >
{folderdata && folderdata.contents && (
          <FolderContents
            contents={folderdata.contents}
            setSelectedFolder={setSelectedFolder}
            selectedFolder={selectedFolder} 
            templateId={templateId}
          />
        )}
</Box>
       <Box mt={2}>
       <Button variant="contained" sx={{
            backgroundColor: "var(--color-save-btn)", // Normal background

            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)", // Hover background color
            },
            borderRadius: "15px",
          }} onClick={createFolderAPI}  disabled={!selectedFolder}>
         Create & Exit
        </Button>
       </Box>
       
      </Box>
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

};





  // return (
  //   <ul style={{ listStyle: "none", marginLeft: "1em", paddingLeft: "0.5em" }}>
  //     {contents.map((item, index) => {
  //       // Construct the full path dynamically
  //       const fullPath = parentPath ? `${parentPath}/${item.name}` : `uploads/${templateId}/${item.name}`;

  //       return (
  //         <li key={index} style={{ marginBottom: "0.8em" }}>
  //           {item.type === "folder" ? (
  //             <div>
  //               <div
  //                 onClick={() => {
  //                   toggleFolder(fullPath);
  //                   setSelectedFolder(fullPath);
  //                   console.log("Selected Folder Path:", fullPath);
  //                 }}
  //                 style={{
  //                   fontWeight: selectedFolder === fullPath ? "bold" : "normal",
  //                   cursor: "pointer",
  //                   color:  "#007BFF",
  //                 }}
  //               >
  //                 {openFolders[fullPath] ? "📂" : "📁"} {item.name}
  //               </div>

  //               {openFolders[fullPath] && item.contents.length > 0 && (
  //                 <FolderContents
  //                   contents={item.contents}
  //                   setSelectedFolder={setSelectedFolder}
  //                   selectedFolder={selectedFolder}
  //                   parentPath={fullPath} // Pass the updated path down to maintain hierarchy
  //                   templateId={templateId}
  //                 />
  //               )}
  //             </div>
  //           ) : (
  //             <span style={{ color: "#333" }}>📄 {item.name}</span>
  //           )}
  //         </li>
  //       );
  //     })}
  //   </ul>
  // );