import React, { useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Paper,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function FolderTemplateTbel({
  handleCreateTemplate,
  folderTemplates,
  handleEdit,
  handleDelete,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedTemplateId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTemplateId(null);
  };

  const handleDeleteClick = () => {
    if (selectedTemplateId && handleDelete) {
      handleDelete(selectedTemplateId);
    }
    handleMenuClose();
  };

  return (
    <Box>
      <Box sx={{ mb: 2, mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateTemplate}
          sx={{
            backgroundColor: "var(--color-save-btn)", // Normal background

            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)", // Hover background color
            },
            borderRadius: "15px",
            mb: 3,
          }}
        >
          Create Template
        </Button>
      </Box>
      <Box>
        <Paper sx={{ mb: 5 }}>
          <Table sx={{ width: "100%" }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Used in pipeline</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {folderTemplates.map((template) => (
                <TableRow key={template._id}>
                  <TableCell
                    onClick={() => handleEdit(template._id)}
                    sx={{ cursor: "pointer", color: "blue" }}
                  >
                    {template.templatename}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, template._id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
      {/* <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu> */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (selectedTemplateId && handleEdit) {
              handleEdit(selectedTemplateId);
            }
            handleMenuClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
      </Menu>
    </Box>
  );
}

export default FolderTemplateTbel;
