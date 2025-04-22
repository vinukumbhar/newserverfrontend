import React, { useState, useEffect } from "react";

import {
 
  Typography,
 
} from "@mui/material";

function FolderTempEdit({templateId}) {

  const [templateName, setTemplateName] = useState("");
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  useEffect(() => {
    if (!templateId) return; // Ensure templateId exists before fetching

    const fetchTemplateName = async () => {
      try {
        const response = await fetch(`${API_KEY}/foldertemp/folder/${templateId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        setTemplateName(data.folderTemplate.templatename);
      } catch (error) {
        console.error("Error fetching template name:", error);
      }
    };

    fetchTemplateName();
  }, [templateId]);
 
  





  
  return (
    <div >
     <Typography>Edit folder template</Typography>
     <Typography>Template Name :{templateName}</Typography> 
     
     
      
      
      
    </div>
  );
}

export default FolderTempEdit;
