import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FolderStructure = ({ folder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Accordion expanded={isOpen} onChange={() => setIsOpen(!isOpen)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-${folder.name}-content`} id={`panel-${folder.name}-header`}>
        <Typography>{folder.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ paddingLeft: '20px' }}>
          {/* Render files in the current folder */}
          {folder.files.length > 0 && (
            <div>
              <Typography variant="h6">Files:</Typography>
              <List>
                {folder.files.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={file} />
                  </ListItem>
                ))}
              </List>
            </div>
          )}

          {/* Render subfolders recursively */}
          {folder.subfolders.length > 0 && (
            <div>
              <Typography variant="h6">Subfolders:</Typography>
              {folder.subfolders.map((subfolder, index) => (
                <FolderStructure key={index} folder={subfolder} />
              ))}
            </div>
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

const FolderTree = () => {
  const [folderData, setFolderData] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch("http://127.0.0.1:8006/firmDocs/files/67fd062847d30cdaf4ab6594", requestOptions)
      .then((response) => response.json())  // Parse as JSON
      .then((result) => {
        console.log(result);  // Log the result for debugging
        setFolderData(result.structure);  // Set the folder data in state
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);  // Empty dependency array ensures this runs once on mount

  return (
    <div style={{ margin: '20px' }}>
      <Typography variant="h4">Folder Structure</Typography>
      <FolderTreeStructure structure={folderData} />
    </div>
  );
};

const FolderTreeStructure = ({ structure }) => {
  return (
    <div>
      {structure.map((rootFolder, index) => (
        <FolderStructure key={index} folder={rootFolder} />
      ))}
    </div>
  );
};

export default FolderTree;
