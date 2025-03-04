// import React from 'react'

// function TemplateName({ handleSaveTemplate, handleCancel,tempName,setTempName }) {
//     return (
//         <div>

//             <div className="folder-label">
//                 <label>Template Name</label>
//                 <input type="text" placeholder="Template Name" value={tempName} onChange={(e) => setTempName(e.target.value)} />
//             </div>
//             <div className="temp_buttons">
//                 <button className="btn1" onClick={handleSaveTemplate}>
//                     Save
//                 </button>
//                 <button className="btn2" onClick={handleCancel}>
//                     Cancel
//                 </button>
//             </div>
//         </div>
//     )
// }

// export default TemplateName

import React from "react";
import { TextField, Button, Box, Typography, InputLabel } from "@mui/material";

function TemplateName({
  handleSaveTemplate,
  handleCancel,
  tempName,
  setTempName,
}) {
  return (
    <>
      <Typography variant="h5">Create folder template</Typography>
      <Box display="flex" flexDirection="column" gap={2} mt={3}>
        <Box>
          <InputLabel sx={{ color: "black" }}>Template Name</InputLabel>
          <TextField
            placeholder="Template Name"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            fullWidth
            size="small"
            margin="normal"
          />
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveTemplate}
            sx={{
              backgroundColor: "var(--color-save-btn)", // Normal background

              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)", // Hover background color
              },
              borderRadius: "15px",
              width: "80px",
            }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{
              borderColor: "var(--color-border-cancel-btn)", // Normal background
              color: "var(--color-save-btn)",
              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                color: "#fff",
                border: "none",
              },
              width: "80px",
              borderRadius: "15px",
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default TemplateName;
