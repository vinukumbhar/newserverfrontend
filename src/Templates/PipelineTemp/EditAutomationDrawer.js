// import React from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   IconButton,
//   Button,
//   Menu,
//   MenuItem,
//   Chip,
//   Autocomplete,
//   TextField,
// } from "@mui/material";
// import { RxCross2 } from "react-icons/rx";
// import DeleteIcon from "@mui/icons-material/Delete";

// const EditAutomationDrawer = ({
//   isEditDrawerOpen,
//   setIsEditDrawerOpen,
//   selectedAutomationData,
//   handleDeleteAutomation,
//   handleEditTemplateChange,
//   emailTemplateOptions,
//   invoiceTemplateOptions,
//   organizerOptions,
//   proposalElsOptions,
//   optionfolder,
//   setSelectedAutomationIndex,
//   handleEditConditions,
//   handleEditClick,
//   handleEditSaveAutomation,
//   ehitAnchorEl,
//   handleEditClose,
//   handleMenuItemSelect,
// }) => {
//   return (
//     <Drawer
//       anchor="right"
//       open={isEditDrawerOpen}
//       onClose={() => setIsEditDrawerOpen(false)}
//       PaperProps={{
//         id: "edit-automation-drawer",
//         sx: {
//           borderRadius: "10px 0 0 10px",
//           width: 500,
//           maxWidth: "100%",
//         },
//       }}
//     >
//       <Box sx={{ padding: "20px" }}>
//         <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
//           <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
//             Edit Automations
//           </Typography>
//           <RxCross2 onClick={() => setIsEditDrawerOpen(false)} style={{ fontSize: "30px", cursor: "pointer" }} />
//         </Box>

//         <Box>
//           {selectedAutomationData.length > 0 ? (
//             selectedAutomationData.map((automation, index) => (
//               <Box key={index} sx={{ border: "2px solid #ddd", borderRadius: "8px", padding: 2, marginBottom: 2 }}>
//                 <Box sx={{ display: "flex", justifyContent: "space-between" }}>
//                   <Typography>
//                     {index + 1}. {automation.type || "No Type"}
//                   </Typography>
//                   <IconButton onClick={() => handleDeleteAutomation(index)}>
//                     <DeleteIcon color="error" />
//                   </IconButton>
//                 </Box>

//                 <Typography gutterBottom variant="body2">
//                   Select Template
//                 </Typography>
//                 <Autocomplete
//                   options={
//                     automation.type === "Send Email"
//                       ? emailTemplateOptions
//                       : automation.type === "Send Invoice"
//                       ? invoiceTemplateOptions
//                       : automation.type === "Create Organizer"
//                       ? organizerOptions
//                       : automation.type === "Send Proposal/Els"
//                       ? proposalElsOptions
//                       : automation.type === "Apply folder template"
//                       ? optionfolder
//                       : []
//                   }
//                   getOptionLabel={(option) => option.label}
//                   value={automation.template || null}
//                   onChange={(event, newValue) => handleEditTemplateChange(index, newValue)}
//                   renderInput={(params) => <TextField {...params} variant="outlined" size="small" placeholder="Select Template" />}
//                 />

//                 {automation.tags && automation.tags.length > 0 && (
//                   <Box sx={{ marginTop: "10px" }}>
//                     <Typography variant="body2">Only For:</Typography>
//                     <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//                       {automation.tags.map((tag) => (
//                         <Chip key={tag._id} label={tag.tagName} sx={{ backgroundColor: tag.tagColour, color: "#fff", fontWeight: "500", borderRadius: "20px", marginRight: 1 }} />
//                       ))}
//                     </Box>
//                   </Box>
//                 )}

//                 <Button variant="text" sx={{ marginTop: 2 }} onClick={() => handleEditConditions(index)}>
//                   Add Conditions
//                 </Button>
//               </Box>
//             ))
//           ) : (
//             <Typography variant="body2" sx={{ marginTop: 2 }}>
//               No automations selected.
//             </Typography>
//           )}
//         </Box>

    //     <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
    //       <Button variant="text" sx={{ marginTop: 2 }} onClick={(e) => handleEditClick(e)}>
    //         Add Automations
    //       </Button>
    //       <Button
    //         variant="contained"
    //         onClick={() => handleEditSaveAutomation()}
    //         sx={{
    //           backgroundColor: "var(--color-save-btn)",
    //           "&:hover": { backgroundColor: "var(--color-save-hover-btn)" },
    //           borderRadius: "15px",
    //           marginTop: 2,
    //         }}
    //       >
    //         Save Automation
    //       </Button>
    //     </Box>

    //     <Menu anchorEl={ehitAnchorEl} open={Boolean(ehitAnchorEl)} onClose={handleEditClose}>
    //       <MenuItem onClick={() => handleMenuItemSelect("Send Email")}>Send Email</MenuItem>
    //       <MenuItem onClick={() => handleMenuItemSelect("Send Invoice")}>Send Invoice</MenuItem>
    //       <MenuItem onClick={() => handleMenuItemSelect("Send Proposal/Els")}>Send Proposal/Els</MenuItem>
    //       <MenuItem onClick={() => handleMenuItemSelect("Create Organizer")}>Create Organizer</MenuItem>
    //       <MenuItem onClick={() => handleMenuItemSelect("Apply folder template")}>Apply folder template</MenuItem>
    //     </Menu>
    //   </Box>
//     </Drawer>
//   );
// };

// export default EditAutomationDrawer;



import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Chip,
  Autocomplete,
  TextField,
  Checkbox,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import DeleteIcon from "@mui/icons-material/Delete";
import { IoMdArrowRoundBack } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai";

const EditAutomationDrawer = ({
  isEditDrawerOpen,
  setIsEditDrawerOpen,
  selectedAutomationData,
  handleDeleteAutomation,
  handleEditTemplateChange,
  emailTemplateOptions,
  invoiceTemplateOptions,
  organizerOptions,
  proposalElsOptions,
  optionfolder,
  handleEditConditions,
  handleEditClick,
  handleEditSaveAutomation,
  ehitAnchorEl,
  handleEditClose,
  handleMenuItemSelect,
  isConditionsEditFormOpen,
  handleEditGoBack,
  selectedAutomationIndex,
  searchTerm,
  handleSearchChange,
  filteredTags,
  stageAutomationTags,
  handleEditCheckboxChange,
  handleEditAddTags,
}) => {
  return (
    <>
      {/* Main Edit Automation Drawer */}
      <Drawer
        anchor="right"
        open={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "10px 0 0 10px",
            width: 500,
            maxWidth: "100%",
          },
        }}
      >
        <Box sx={{ padding: "20px" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Edit Automations
            </Typography>
            <RxCross2 onClick={() => setIsEditDrawerOpen(false)} style={{ fontSize: "30px", cursor: "pointer" }} />
          </Box>

          <Box>
            {selectedAutomationData.length > 0 ? (
              selectedAutomationData.map((automation, index) => (
                <Box key={index} sx={{ border: "2px solid #ddd", borderRadius: "8px", padding: 2, marginBottom: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>
                      {index + 1}. {automation.type || "No Type"}
                    </Typography>
                    <IconButton onClick={() => handleDeleteAutomation(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>

                  <Typography gutterBottom variant="body2">
                    Select Template
                  </Typography>
                  <Autocomplete
                    options={
                      automation.type === "Send Email"
                        ? emailTemplateOptions
                        : automation.type === "Send Invoice"
                        ? invoiceTemplateOptions
                        : automation.type === "Create Organizer"
                        ? organizerOptions
                        : automation.type === "Send Proposal/Els"
                        ? proposalElsOptions
                        : automation.type === "Apply folder template"
                        ? optionfolder
                        : []
                    }
                    getOptionLabel={(option) => option.label}
                    value={automation.template || null}
                    onChange={(event, newValue) => handleEditTemplateChange(index, newValue)}
                    renderInput={(params) => <TextField {...params} variant="outlined" size="small" placeholder="Select Template" />}
                  />

                  {automation.tags && automation.tags.length > 0 && (
                    <Box sx={{ marginTop: "10px" }}>
                      <Typography variant="body2">Only For:</Typography>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {automation.tags.map((tag) => (
                          <Chip key={tag._id} label={tag.tagName} sx={{ backgroundColor: tag.tagColour, color: "#fff", fontWeight: "500", borderRadius: "20px", marginRight: 1 }} />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Button variant="text" sx={{ marginTop: 2 }} onClick={() => handleEditConditions(index)}>
                    Add Conditions
                  </Button>
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ marginTop: 2 }}>
                No automations selected.
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Button variant="text" sx={{ marginTop: 2 }} onClick={(e) => handleEditClick(e)}>
            Add Automations
          </Button>
          <Button
            variant="contained"
            onClick={() => handleEditSaveAutomation()}
            sx={{
              backgroundColor: "var(--color-save-btn)",
              "&:hover": { backgroundColor: "var(--color-save-hover-btn)" },
              borderRadius: "15px",
              marginTop: 2,
            }}
          >
            Save Automation
          </Button>
        </Box>

        <Menu anchorEl={ehitAnchorEl} open={Boolean(ehitAnchorEl)} onClose={handleEditClose}>
          <MenuItem onClick={() => handleMenuItemSelect("Send Email")}>Send Email</MenuItem>
          <MenuItem onClick={() => handleMenuItemSelect("Send Invoice")}>Send Invoice</MenuItem>
          <MenuItem onClick={() => handleMenuItemSelect("Send Proposal/Els")}>Send Proposal/Els</MenuItem>
          <MenuItem onClick={() => handleMenuItemSelect("Create Organizer")}>Create Organizer</MenuItem>
          <MenuItem onClick={() => handleMenuItemSelect("Apply folder template")}>Apply folder template</MenuItem>
        </Menu>
      </Box>
        
      </Drawer>

      {/* Conditions Edit Drawer */}
      <Drawer
        anchor="right"
        open={isConditionsEditFormOpen}
        onClose={handleEditGoBack}
        PaperProps={{ sx: { width: "550px", padding: 2 } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={handleEditGoBack}>
            <IoMdArrowRoundBack fontSize="large" color="blue" />
          </IconButton>
          <Typography variant="h6">Add conditions</Typography>
          Automation index: {selectedAutomationIndex}
        </Box>

        <Box sx={{ padding: 2 }}>
          <Typography variant="body1">Apply automation only for accounts with these tags</Typography>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{ startAdornment: <AiOutlineSearch style={{ marginRight: 8 }} /> }}
            sx={{ marginTop: 2 }}
          />

          <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
            {filteredTags.map((tag) => (
              <Box key={tag._id} sx={{ display: "flex", alignItems: "center", gap: 3, borderBottom: "1px solid grey", paddingBottom: 1 }}>
                <Checkbox checked={stageAutomationTags.some((existingTag) => existingTag._id === tag._id)} onChange={() => handleEditCheckboxChange(tag)} />
                <Chip label={tag.tagName} sx={{ backgroundColor: tag.tagColour, color: "#fff", fontWeight: "500", borderRadius: "20px", marginRight: 1 }} />
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
            <Button variant="contained" sx={{
                      backgroundColor: "var(--color-save-btn)", // Normal background

                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                      },
                      borderRadius: "15px",
                      width: "80px",
                    }} onClick={handleEditAddTags} >
              Add
            </Button>
            <Button variant="outlined" sx={{
                      borderColor: "var(--color-border-cancel-btn)", // Normal background
                      color: "var(--color-save-btn)",
                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                        color: "#fff",
                        border: "none",
                      },
                      width: "80px",
                      borderRadius: "15px",
                    }} onClick={handleEditGoBack} >
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default EditAutomationDrawer;
