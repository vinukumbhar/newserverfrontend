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

import React,{useEffect,useState} from "react";
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
  FormControl,
  Select,OutlinedInput,InputLabel
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
  tagsoptions,
  handleAddTagChange,
  handleRemoveTagChange,  
  addTags, 
  removeTags,
  handleEditAddTagsChange,
  setAddTags, 
  setRemoveTags,
  filteredAddTagsOptions,filteredRemoveTagsOptions

}) => {

console.log("automation list",selectedAutomationData)
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "auto",
    },
  },
};

  // const [addTags, setAddTags] = useState([]); // Separate state for Add Tags
  // const [removeTags, setRemoveTags] = useState([]); // Separate state for Remove Tags
 
  useEffect(() => {
    if (selectedAutomationData) {
        console.log(selectedAutomationData);

        // Extract addTags and removeTags
        const addTagsList = selectedAutomationData
            .filter(item => item.addTags && Array.isArray(item.addTags))
            .flatMap(item => item.addTags)
            .map(tag => ({
                value: tag._id,
                label: tag.tagName,
                color: tag.tagColour,
                customTagStyle: {
                    backgroundColor: tag.tagColour,
                    color: "#fff",
                    borderRadius: "30px",
                    alignItems: "center",
                    textAlign: "center",
                    marginBottom: "5px",
                    padding: "2px 8px",
                    fontSize: "10px",
                    margin: "7px",
                    cursor: "pointer",
                },
            }));

        const removeTagsList = selectedAutomationData
            .filter(item => item.removeTags && Array.isArray(item.removeTags))
            .flatMap(item => item.removeTags)
            .map(tag => ({
                value: tag._id,
                label: tag.tagName,
                color: tag.tagColour,
                customTagStyle: {
                    backgroundColor: tag.tagColour,
                    color: "#fff",
                    borderRadius: "30px",
                    alignItems: "center",
                    textAlign: "center",
                    marginBottom: "5px",
                    padding: "2px 8px",
                    fontSize: "10px",
                    margin: "7px",
                    cursor: "pointer",
                },
            }));

        setAddTags(addTagsList);
        setRemoveTags(removeTagsList);

        const addTagsValues = addTagsList.map((option) => option.value);
        const removeTagsValues = removeTagsList.map((option) => option.value);
setAddTags(addTagsValues)
setRemoveTags(removeTagsValues)
        console.log("Add Tags:", addTagsValues);
        console.log("Remove Tags:", removeTagsList);
    }
}, [selectedAutomationData]);

// useEffect(() => {
//   if (selectedAutomationData && selectedAutomationIndex !== undefined) {
//       console.log(selectedAutomationData);

//       const selectedAutomation = selectedAutomationData[selectedAutomationIndex]; // Get specific automation
//       console.log(selectedAutomationIndex)
//       if (!selectedAutomation) return;

//       // Extract addTags and removeTags for the selected automation only
//       const addTagsList = (selectedAutomation.addTags || []).map(tag => ({
//           value: tag._id,
//           label: tag.tagName,
//           color: tag.tagColour,
//           customTagStyle: {
//               backgroundColor: tag.tagColour,
//               color: "#fff",
//               borderRadius: "30px",
//               alignItems: "center",
//               textAlign: "center",
//               marginBottom: "5px",
//               padding: "2px 8px",
//               fontSize: "10px",
//               margin: "7px",
//               cursor: "pointer",
//           },
//       }));

//       const removeTagsList = (selectedAutomation.removeTags || []).map(tag => ({
//           value: tag._id,
//           label: tag.tagName,
//           color: tag.tagColour,
//           customTagStyle: {
//               backgroundColor: tag.tagColour,
//               color: "#fff",
//               borderRadius: "30px",
//               alignItems: "center",
//               textAlign: "center",
//               marginBottom: "5px",
//               padding: "2px 8px",
//               fontSize: "10px",
//               margin: "7px",
//               cursor: "pointer",
//           },
//       }));

//       // setAddTags(addTagsList);
//       // setRemoveTags(removeTagsList);

//       console.log("Add Tags:", addTagsList);
//       console.log("Remove Tags:", removeTagsList);
//       const addTagsValues = addTagsList.map((option) => option.value);
//       const removeTagsValues = removeTagsList.map((option) => option.value);
// setAddTags(addTagsValues)
// setRemoveTags(removeTagsValues)
//   }
// }, [selectedAutomationData, selectedAutomationIndex]);

  return (
    <>
      {/* Main Edit Automation Drawer */}
      <Drawer
        anchor="right"
        open={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        BackdropProps={{ invisible: true }}
        PaperProps={{
          sx: {
            borderRadius: "10px 0 0 10px",
            width: 500,
            maxWidth: "100%",
          },
        }}
      >
        <Box sx={{ padding: "20px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Edit Automations
            </Typography>
            <RxCross2
              onClick={() => setIsEditDrawerOpen(false)}
              style={{ fontSize: "30px", cursor: "pointer" }}
            />
          </Box>

          <Box>
            {selectedAutomationData.length > 0 ? (
              selectedAutomationData.map((automation, index) => (
                <Box
                  key={index}
                  sx={{
                    border: "2px solid #ddd",
                    borderRadius: "8px",
                    padding: 2,
                    marginBottom: 2,
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>
                      {index + 1}. {automation.type || "No Type"}
                    </Typography>
                    <IconButton onClick={() => handleDeleteAutomation(index)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                  {automation.type === "Update account tags" ? (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap:1,
                          // border:'2px solid red'
                        }}
                      >
                        <Box width={"50%"}>
                        <Typography gutterBottom variant="body2">Add Tags</Typography>
                         
                           <Select
                                                               multiple
                                                               size="small"
                                                               fullWidth
                                                               multiline
                                                               value={addTags}
                                                              
                                                               onChange={handleAddTagChange} 
                                                               input={<OutlinedInput />}
                                                               displayEmpty // Enables placeholder when no value is selected
                                                               renderValue={(selected) => {
                                                                 if (selected.length === 0) {
                                                                   return (
                                                                     <span style={{ color: "#aaa" }}>
                                                                       Select tags...
                                                                     </span>
                                                                   ); // Placeholder
                                                                 }
                                                                 return (
                                                                   <Box
                                                                     sx={{
                                                                       display: "flex",
                                                                       flexWrap: "wrap",
                                                                       gap: "6px",
                                                                       padding: "6px",
                                                                       borderRadius: "10px",
                                                                     }}
                                                                   >
                                                                     {selected.map((value) => {
                                                                       const option = filteredAddTagsOptions.find(
                                                                         (opt) => opt.value === value
                                                                       );
                                                                       return (
                                                                         <Chip
                                                                           key={value}
                                                                           label={option?.label}
                                                                           sx={{
                                                                             backgroundColor: option?.colour,
                                                                             color: "#fff",
                                                                             fontWeight: 500,
                                                                             fontSize: "10px",
                                                                             borderRadius: "16px",
                                                                             height: "20px",
                                                                             cursor: "pointer",
                                                                             boxShadow:
                                                                               "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                                                             "& .MuiChip-deleteIcon": {
                                                                               color: "#fff",
                                                                               opacity: 0.7,
                                                                               transition: "opacity 0.2s",
                                                                               "&:hover": { opacity: 1 },
                                                                             },
                                                                           }}
                                                                         />
                                                                       );
                                                                     })}
                                                                   </Box>
                                                                 );
                                                               }}
                                                               MenuProps={MenuProps}
                                                               sx={{
                                                                 borderRadius: "10px",
                                                                 "& .MuiOutlinedInput-root": {
                                                                   borderRadius: "10px",
                                                                 },
                                                               }}
                                                             >
                                                               {filteredAddTagsOptions.map((option) => {
                                                                 // const dynamicWidth = Math.min(option.label.length * 10, 150); // Adjust width dynamically
                                                                 // Create a canvas element to measure the actual text width
                                                                 const canvas = document.createElement("canvas");
                                                                 const context = canvas.getContext("2d");
                                                                 context.font = "12px Arial"; // Match the font size/style of MenuItem
                                   
                                                                 const textWidth = context.measureText(
                                                                   option.label
                                                                 ).width; // Get precise width
                                                                 const dynamicWidth = Math.min(
                                                                   textWidth + 16,
                                                                   150
                                                                 ); // Add padding & set max width
                                                                 return (
                                                                   <MenuItem
                                                                     key={option.value}
                                                                     value={option.value}
                                                                     sx={{
                                                                       backgroundColor: option.colour,
                                                                       color: "#fff",
                                                                       fontSize: "10px",
                                                                       borderRadius: "10px",
                                                                       margin: "5px",
                                                                       textAlign: "center",
                                                                       display: "flex",
                                                                       justifyContent: "center",
                                                                       padding: "4px 9px",
                                                                       // alignItems: "center",
                                                                       // paddingLeft: "10px",
                                                                       whiteSpace: "nowrap", // Prevent line breaks
                                                                       // textAlign: "left", // Ensure text is left-aligned
                                                                       // paddingLeft: "10px", // Add left padding for proper alignment
                                                                       minWidth: `${dynamicWidth}px`,
                                                                       maxWidth: `${dynamicWidth}px`, // Dynamically set maxWidth
                                                                       "&:hover": {
                                                                         backgroundColor: option.colour,
                                                                         color: "#fff",
                                                                       },
                                                                     }}
                                                                   >
                                                                     {option.label}
                                                                   </MenuItem>
                                                                 );
                                                               })}
                                                             </Select>
                         
                        </Box>
                        <Box width={"50%"}>
                        <Typography gutterBottom variant="body2">Remove Tags</Typography>
                          
                            <Select
                                                               multiple
                                                               size="small"
                                                               fullWidth
                                                               multiline
                                                               value={removeTags}
                                                               onChange={handleRemoveTagChange}
                                                               input={<OutlinedInput />}
                                                               displayEmpty // Enables placeholder when no value is selected
                                                               renderValue={(selected) => {
                                                                 if (selected.length === 0) {
                                                                   return (
                                                                     <span style={{ color: "#aaa" }}>
                                                                       Select tags...
                                                                     </span>
                                                                   ); // Placeholder
                                                                 }
                                                                 return (
                                                                   <Box
                                                                     sx={{
                                                                       display: "flex",
                                                                       flexWrap: "wrap",
                                                                       gap: "6px",
                                                                       padding: "6px",
                                                                       borderRadius: "10px",
                                                                     }}
                                                                   >
                                                                     {selected.map((value) => {
                                                                       const option = filteredRemoveTagsOptions.find(
                                                                         (opt) => opt.value === value
                                                                       );
                                                                       return (
                                                                         <Chip
                                                                           key={value}
                                                                           label={option?.label}
                                                                           sx={{
                                                                             backgroundColor: option?.colour,
                                                                             color: "#fff",
                                                                             fontWeight: 500,
                                                                             fontSize: "10px",
                                                                             borderRadius: "16px",
                                                                             height: "20px",
                                                                             cursor: "pointer",
                                                                             boxShadow:
                                                                               "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                                                             "& .MuiChip-deleteIcon": {
                                                                               color: "#fff",
                                                                               opacity: 0.7,
                                                                               transition: "opacity 0.2s",
                                                                               "&:hover": { opacity: 1 },
                                                                             },
                                                                           }}
                                                                         />
                                                                       );
                                                                     })}
                                                                   </Box>
                                                                 );
                                                               }}
                                                               MenuProps={MenuProps}
                                                               sx={{
                                                                 borderRadius: "10px",
                                                                 "& .MuiOutlinedInput-root": {
                                                                   borderRadius: "10px",
                                                                 },
                                                               }}
                                                             >
                                                               {filteredRemoveTagsOptions.map((option) => {
                                                                 // const dynamicWidth = Math.min(option.label.length * 10, 150); // Adjust width dynamically
                                                                 // Create a canvas element to measure the actual text width
                                                                 const canvas = document.createElement("canvas");
                                                                 const context = canvas.getContext("2d");
                                                                 context.font = "12px Arial"; // Match the font size/style of MenuItem
                                   
                                                                 const textWidth = context.measureText(
                                                                   option.label
                                                                 ).width; // Get precise width
                                                                 const dynamicWidth = Math.min(
                                                                   textWidth + 16,
                                                                   150
                                                                 ); // Add padding & set max width
                                                                 return (
                                                                   <MenuItem
                                                                     key={option.value}
                                                                     value={option.value}
                                                                     sx={{
                                                                       backgroundColor: option.colour,
                                                                       color: "#fff",
                                                                       fontSize: "10px",
                                                                       borderRadius: "10px",
                                                                       margin: "5px",
                                                                       textAlign: "center",
                                                                       display: "flex",
                                                                       justifyContent: "center",
                                                                       padding: "4px 9px",
                                                                       // alignItems: "center",
                                                                       // paddingLeft: "10px",
                                                                       whiteSpace: "nowrap", // Prevent line breaks
                                                                       // textAlign: "left", // Ensure text is left-aligned
                                                                       // paddingLeft: "10px", // Add left padding for proper alignment
                                                                       minWidth: `${dynamicWidth}px`,
                                                                       maxWidth: `${dynamicWidth}px`, // Dynamically set maxWidth
                                                                       "&:hover": {
                                                                         backgroundColor: option.colour,
                                                                         color: "#fff",
                                                                       },
                                                                     }}
                                                                   >
                                                                     {option.label}
                                                                   </MenuItem>
                                                                 );
                                                               })}
                                                             </Select>
                          
                        </Box>
                      </Box>
                      {automation.tags && automation.tags.length > 0 && (
                        <Box
                          sx={{
                            marginTop: "10px",
                          }}
                        >
                          <Typography variant="body2">Only For:</Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            {automation.tags.map((tag) => (
                              <Chip
                                key={tag._id}
                                label={tag.tagName}
                                sx={{
                                  backgroundColor: tag.tagColour,
                                  color: "#fff",
                                  fontWeight: "500",
                                  borderRadius: "20px",
                                  marginRight: 1,
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      <Button
                        variant="text"
                        sx={{ marginTop: 2 }}
                        // onClick={() => handleEditConditions(index)}
                        onClick={() => handleEditConditions(index)}
                      >
                        Add Conditions
                      </Button>
                    </>
                  ) : (
                    <>
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
                        onChange={(event, newValue) =>
                          handleEditTemplateChange(index, newValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            size="small"
                            placeholder="Select Template"
                          />
                        )}
                      />

                      {automation.tags && automation.tags.length > 0 && (
                        <Box sx={{ marginTop: "10px" }}>
                          <Typography variant="body2">Only For:</Typography>
                          <Box
                            sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                          >
                            {automation.tags.map((tag) => (
                              <Chip
                                key={tag._id}
                                label={tag.tagName}
                                sx={{
                                  backgroundColor: tag.tagColour,
                                  color: "#fff",
                                  fontWeight: "500",
                                  borderRadius: "20px",
                                  marginRight: 1,
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}

                      <Button
                        variant="text"
                        sx={{ marginTop: 2 }}
                        onClick={() => handleEditConditions(index)}
                      >
                        Add Conditions
                      </Button>
                    </>
                  )}
                </Box>
              ))
            ) : (
              <Typography variant="body2" sx={{ marginTop: 2 }}>
                No automations selected.
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Button
              variant="text"
              sx={{ marginTop: 2 }}
              onClick={(e) => handleEditClick(e)}
            >
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

          <Menu
            anchorEl={ehitAnchorEl}
            open={Boolean(ehitAnchorEl)}
            onClose={handleEditClose}
          >
            <MenuItem onClick={() => handleMenuItemSelect("Send Email")}>
              Send Email
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemSelect("Send Invoice")}>
              Send Invoice
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemSelect("Send Proposal/Els")}>
              Send Proposal/Els
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemSelect("Create Organizer")}>
              Create Organizer
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuItemSelect("Apply folder template")}
            >
              Apply folder template
            </MenuItem>
            <MenuItem
              onClick={() => handleMenuItemSelect("Update account tags")}
            >
              Update account tags
            </MenuItem>
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
          <Typography variant="body1">
            Apply automation only for accounts with these tags
          </Typography>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <AiOutlineSearch style={{ marginRight: 8 }} />,
            }}
            sx={{ marginTop: 2 }}
          />

          <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
            {filteredTags.map((tag) => (
              <Box
                key={tag._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  borderBottom: "1px solid grey",
                  paddingBottom: 1,
                }}
              >
                <Checkbox
                  checked={stageAutomationTags.some(
                    (existingTag) => existingTag._id === tag._id
                  )}
                  onChange={() => handleEditCheckboxChange(tag)}
                />
                <Chip
                  label={tag.tagName}
                  sx={{
                    backgroundColor: tag.tagColour,
                    color: "#fff",
                    fontWeight: "500",
                    borderRadius: "20px",
                    marginRight: 1,
                  }}
                />
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "var(--color-save-btn)", // Normal background

                "&:hover": {
                  backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                },
                borderRadius: "15px",
                width: "80px",
              }}
              onClick={handleEditAddTags}
            >
              Add
            </Button>
            <Button
              variant="outlined"
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
              onClick={handleEditGoBack}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default EditAutomationDrawer;
