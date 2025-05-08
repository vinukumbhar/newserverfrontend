// components/EditNameDrawer.jsx
import React, { useState, useEffect } from "react";
import { Drawer, TextField, Button, Box, Typography } from "@mui/material";

const EditNameDrawer = ({ open, onClose, item, onRename }) => {
  const [newName, setNewName] = useState("");
  const [ itemPath, setItemPath]= useState("")
console.log("edit item",item?.path)
console.log("filename",item?.file)
useEffect(() => {
    if (item?.file) {
      setNewName(item.file); // Set initial file name from the item prop
    }
    if(item?.folder){
        setNewName(item?.folder)
    }
    if (item?.path){
        setItemPath(item.path)
    }
  }, [item]);

  const handleRename = () => {
    if (!newName.trim()) return;
    onRename(item, newName,itemPath);
    setNewName("");
    setItemPath("")
    onClose();
  
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Rename {item?.type === "folder" ? "Folder" : "File"}
        </Typography>
        <TextField
          fullWidth
          label="New Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleRename}
        >
          Save
        </Button>
      </Box>
    </Drawer>
  );
};

export default EditNameDrawer;
