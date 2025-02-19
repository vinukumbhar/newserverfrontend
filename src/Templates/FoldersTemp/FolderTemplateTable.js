


import React from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Box ,Paper} from "@mui/material";

function FolderTemplateTbel({ handleCreateTemplate, folderTemplates, handleEdit }) {
  return (
    <Box>
      <Box sx={{ mb: 2,mt:2 }}>
        <Button variant="contained" color="primary" onClick={handleCreateTemplate} sx={{
              backgroundColor: 'var(--color-save-btn)',  // Normal background
             
              '&:hover': {
                backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
              },
              borderRadius:'15px', mb: 3
            }}>
          Create Template
        </Button>
      </Box>
      <Box >
        <Paper sx={{mb:5}}>
        <Table sx={{ width: '100%' }} >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Used in pipeline</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </Paper>
      </Box>
    </Box>
  );
}

export default FolderTemplateTbel;

