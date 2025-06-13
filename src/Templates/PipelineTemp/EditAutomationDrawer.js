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

import React, { useEffect, useState } from "react";
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
  Select,
  OutlinedInput,
  InputLabel,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import DeleteIcon from "@mui/icons-material/Delete";
import { IoMdArrowRoundBack } from "react-icons/io";
import { AiOutlineSearch } from "react-icons/ai";

const EditAutomationDrawer = ({
  setSelectedAutomationData,
  handleAssigneeChange,
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
  assigneeOptions,
  filteredRemoveTagsOptions,
  taskTemplateOptions,
  chatTemplateOptions,
  handleTagChange,
  handleEditClientChange,
  statusOptions,
  optionstatus,
  maxDescriptionLength,
  // filteredAddTagsOptions,
  // filteredRemoveTagsOptions
}) => {
  console.log("automation list", selectedAutomationData);
  console.log("statusOptions", statusOptions);
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

  //   const [addTags, setAddTags] = useState([]); // Separate state for Add Tags
  //   const [removeTags, setRemoveTags] = useState([]); // Separate state for Remove Tags

  //   useEffect(() => {
  //     if (selectedAutomationData) {
  //         console.log(selectedAutomationData);

  //         // Extract addTags and removeTags
  //         const addTagsList = selectedAutomationData
  //             .filter(item => item.addTags && Array.isArray(item.addTags))
  //             .flatMap(item => item.addTags)
  //             .map(tag => ({
  //                 value: tag._id,
  //                 label: tag.tagName,
  //                 color: tag.tagColour,
  //                 customTagStyle: {
  //                     backgroundColor: tag.tagColour,
  //                     color: "#fff",
  //                     borderRadius: "30px",
  //                     alignItems: "center",
  //                     textAlign: "center",
  //                     marginBottom: "5px",
  //                     padding: "2px 8px",
  //                     fontSize: "10px",
  //                     margin: "7px",
  //                     cursor: "pointer",
  //                 },
  //             }));

  //         const removeTagsList = selectedAutomationData
  //             .filter(item => item.removeTags && Array.isArray(item.removeTags))
  //             .flatMap(item => item.removeTags)
  //             .map(tag => ({
  //                 value: tag._id,
  //                 label: tag.tagName,
  //                 color: tag.tagColour,
  //                 customTagStyle: {
  //                     backgroundColor: tag.tagColour,
  //                     color: "#fff",
  //                     borderRadius: "30px",
  //                     alignItems: "center",
  //                     textAlign: "center",
  //                     marginBottom: "5px",
  //                     padding: "2px 8px",
  //                     fontSize: "10px",
  //                     margin: "7px",
  //                     cursor: "pointer",
  //                 },
  //             }));

  //         setAddTags(addTagsList);
  //         setRemoveTags(removeTagsList);

  //         const addTagsValues = addTagsList.map((option) => option.value);
  //         const removeTagsValues = removeTagsList.map((option) => option.value);
  // setAddTags(addTagsValues)
  // setRemoveTags(removeTagsValues)
  //         console.log("Add Tags:", addTagsValues);
  //         console.log("Remove Tags:", removeTagsList);
  //     }
  // }, [selectedAutomationData]);
  const [automations, setAutomations] = useState(selectedAutomationData);
  useEffect(() => {
    if (selectedAutomationData.length > 0) {
      setAutomations((prev) =>
        selectedAutomationData.map((automation) => ({
          ...(prev.find((a) => a.id === automation.id) || automation),
          addTags: automation.addTags || [],
          removeTags: automation.removeTags || [],
        }))
      );
    }
  }, [selectedAutomationData]);

  // useEffect(() => {
  //   setAutomations((prev) =>
  //     prev.map((automation) => ({
  //       ...automation,
  //       addTags: automation.addTags || [],
  //       removeTags: automation.removeTags || [],
  //     }))
  //   );
  // }, [selectedAutomationData]);
  // const handleTagChange = (index, type, event) => {
  //   const { value } = event.target;
  //   setAutomations((prev) => {
  //     const updatedAutomations = [...prev];
  //     updatedAutomations[index] = {
  //       ...updatedAutomations[index],
  //       [type]: value,
  //     };
  //     console.log( "test",updatedAutomations)
  //     return updatedAutomations;

  //   });
  // };

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
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Edit Automations
            </Typography>
            <RxCross2
              onClick={() => setIsEditDrawerOpen(false)}
              style={{ fontSize: "30px", cursor: "pointer" }}
            />
          </Box>
          <Box sx={{ height: "91vh", overflowY: "auto" }}>
            <Box sx={{ padding: "15px" }}>
              {/* <Box>
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
                       
                        <Typography variant="body2">Added Tags:</Typography>

                        <Select
                          multiple
                          displayEmpty
                          multiline
                          size="small"
                          value={automation.addTags.map((tag) => tag._id)}
                          onChange={(event) =>
                            handleTagChange(index, "addTags", event)
                          }
                          renderValue={(selected) =>
                            selected.length === 0 ? (
                              <Typography color="gray">
                                Select tags to add
                              </Typography>
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                {automation.addTags.map((tag) => (
                                  <Chip
                                    key={tag._id}
                                    label={tag.tagName}
                                    sx={{
                                      backgroundColor: tag.tagColour,
                                      color: "#fff",
                                      fontWeight: "500",
                                      borderRadius: "20px",
                                    }}
                                  />
                                ))}
                              </Box>
                            )
                          }
                          fullWidth
                          MenuProps={MenuProps}
                        >
                       
                          {tagsoptions
                            .filter(
                              (option) =>
                                !automation.removeTags.some(
                                  (tag) => tag._id === option.value
                                )
                            ) // Hide selected removeTags
                            .map((option) => {
                              // Create a hidden canvas to measure text width
                              const canvas = document.createElement("canvas");
                              const context = canvas.getContext("2d");
                              context.font = "14px Arial"; // Match the MenuItem font style

                              const textWidth = context.measureText(
                                option.label
                              ).width; // Get exact width
                              const dynamicWidth = Math.min(
                                textWidth + 20,
                                200
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
                                    whiteSpace: "nowrap", // Prevent text wrapping
                                    minWidth: `${dynamicWidth}px`,
                                    maxWidth: `${dynamicWidth}px`, // Set dynamic max width
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
                        
                        <Typography variant="body2" sx={{ marginTop: 2 }}>
                          Removed Tags:
                        </Typography>

                        <Select
                          multiple
                          size="small"
                          multiline
                          displayEmpty
                          value={automation.removeTags.map((tag) => tag._id)}
                          onChange={(event) =>
                            handleTagChange(index, "removeTags", event)
                          }
                          renderValue={(selected) =>
                            selected.length === 0 ? (
                              <Typography color="gray">
                                Select tags to remove
                              </Typography>
                            ) : (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                {automation.removeTags.map((tag) => (
                                  <Chip
                                    key={tag._id}
                                    label={tag.tagName}
                                    sx={{
                                      backgroundColor: tag.tagColour,
                                      color: "#fff",
                                      fontWeight: "500",
                                      borderRadius: "20px",
                                    }}
                                  />
                                ))}
                              </Box>
                            )
                          }
                          fullWidth
                          MenuProps={MenuProps}
                        >
                          
                          {tagsoptions
                            .filter(
                              (option) =>
                                !automation.addTags.some(
                                  (tag) => tag._id === option.value
                                )
                            ) // Hide selected removeTags
                            .map((option) => {
                              // Create a hidden canvas to measure text width
                              const canvas = document.createElement("canvas");
                              const context = canvas.getContext("2d");
                              context.font = "14px Arial"; // Match the MenuItem font style

                              const textWidth = context.measureText(
                                option.label
                              ).width; // Get exact width
                              const dynamicWidth = Math.min(
                                textWidth + 20,
                                200
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
                                    whiteSpace: "nowrap", // Prevent text wrapping
                                    minWidth: `${dynamicWidth}px`,
                                    maxWidth: `${dynamicWidth}px`, // Set dynamic max width
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
                                    : automation.type ===
                                        "Apply folder template"
                                      ? optionfolder
                                      : automation.type ===
                                      "Create Task"
                                    ? taskTemplateOptions
                                    : automation.type ===
                                    "Send message"
                                  ? chatTemplateOptions
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
                      </>
                    )}

                    <Box>
                      {" "}
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
                    </Box>
                    <Button
                      variant="text"
                      sx={{ marginTop: 2 }}
                      onClick={() => handleEditConditions(index)}
                    >
                      Add Conditions
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                  No automations selected.
                </Typography>
              )}
            </Box> */}
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
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>
                          {index + 1}. {automation.type || "No Type"}
                        </Typography>
                        <IconButton
                          onClick={() => handleDeleteAutomation(index)}
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Box>

                      {automation.type === "Update account tags" ? (
                        <>
                          {/* Existing Update Tags UI */}
                          <Typography variant="body2">Added Tags:</Typography>
                          <Select
                            multiple
                            displayEmpty
                            multiline
                            size="small"
                            value={automation.addTags.map((tag) => tag._id)}
                            onChange={(event) =>
                              handleTagChange(index, "addTags", event)
                            }
                            renderValue={(selected) =>
                              selected.length === 0 ? (
                                <Typography color="gray">
                                  Select tags to add
                                </Typography>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                  }}
                                >
                                  {automation.addTags.map((tag) => (
                                    <Chip
                                      key={tag._id}
                                      label={tag.tagName}
                                      sx={{
                                        backgroundColor: tag.tagColour,
                                        color: "#fff",
                                        fontWeight: "500",
                                        borderRadius: "20px",
                                      }}
                                    />
                                  ))}
                                </Box>
                              )
                            }
                            fullWidth
                            MenuProps={MenuProps}
                          >
                            {tagsoptions
                              .filter(
                                (option) =>
                                  !automation.removeTags.some(
                                    (tag) => tag._id === option.value
                                  )
                              )
                              .map((option) => {
                                const canvas = document.createElement("canvas");
                                const context = canvas.getContext("2d");
                                context.font = "14px Arial";
                                const textWidth = context.measureText(
                                  option.label
                                ).width;
                                const dynamicWidth = Math.min(
                                  textWidth + 20,
                                  200
                                );

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
                                      whiteSpace: "nowrap",
                                      minWidth: `${dynamicWidth}px`,
                                      maxWidth: `${dynamicWidth}px`,
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

                          <Typography variant="body2" sx={{ marginTop: 2 }}>
                            Removed Tags:
                          </Typography>
                          <Select
                            multiple
                            size="small"
                            multiline
                            displayEmpty
                            value={automation.removeTags.map((tag) => tag._id)}
                            onChange={(event) =>
                              handleTagChange(index, "removeTags", event)
                            }
                            renderValue={(selected) =>
                              selected.length === 0 ? (
                                <Typography color="gray">
                                  Select tags to remove
                                </Typography>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                  }}
                                >
                                  {automation.removeTags.map((tag) => (
                                    <Chip
                                      key={tag._id}
                                      label={tag.tagName}
                                      sx={{
                                        backgroundColor: tag.tagColour,
                                        color: "#fff",
                                        fontWeight: "500",
                                        borderRadius: "20px",
                                      }}
                                    />
                                  ))}
                                </Box>
                              )
                            }
                            fullWidth
                            MenuProps={MenuProps}
                          >
                            {tagsoptions
                              .filter(
                                (option) =>
                                  !automation.addTags.some(
                                    (tag) => tag._id === option.value
                                  )
                              )
                              .map((option) => {
                                const canvas = document.createElement("canvas");
                                const context = canvas.getContext("2d");
                                context.font = "14px Arial";
                                const textWidth = context.measureText(
                                  option.label
                                ).width;
                                const dynamicWidth = Math.min(
                                  textWidth + 20,
                                  200
                                );

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
                                      whiteSpace: "nowrap",
                                      minWidth: `${dynamicWidth}px`,
                                      maxWidth: `${dynamicWidth}px`,
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
                        </>
                      ) :automation.type === "Update job assignees" ? (
                        <>
                          {/* Existing Update Tags UI */}
                          <Typography variant="body2">Added Assignees:</Typography>
                          <Select
                            multiple
                            displayEmpty
                            multiline
                            size="small"
                            value={automation.addAssignees.map((tag) => tag._id)}
                            onChange={(event) =>
                              handleAssigneeChange(index, "addAssignees", event)
                            }
                            renderValue={(selected) =>
                              selected.length === 0 ? (
                                <Typography color="gray">
                                  Select tags to add
                                </Typography>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                  }}
                                >
                                  {automation.addAssignees.map((tag) => (
                                    <Chip
                                      key={tag._id}
                                      label={tag.username}
                                      
                                    />
                                  ))}
                                </Box>
                              )
                            }
                            fullWidth
                            MenuProps={MenuProps}
                          >
                            {assigneeOptions
                              .filter(
                                (option) =>
                                  !automation.removeAssignees.some(
                                    (tag) => tag._id === option.value
                                  )
                              )
                              .map((option) => {
                                

                                return (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                    
                                  >
                                    {option.label}
                                  </MenuItem>
                                );
                              })}
                          </Select>

                          <Typography variant="body2" sx={{ marginTop: 2 }}>
                            Removed Assignees:
                          </Typography>
                          <Select
                            multiple
                            size="small"
                            multiline
                            displayEmpty
                            value={automation.removeAssignees.map((tag) => tag._id)}
                            onChange={(event) =>
                              handleAssigneeChange(index, "removeAssignees", event)
                            }
                            renderValue={(selected) =>
                              selected.length === 0 ? (
                                <Typography color="gray">
                                  Select tags to remove
                                </Typography>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                  }}
                                >
                                  {automation.removeAssignees.map((tag) => (
                                    <Chip
                                      key={tag._id}
                                      label={tag.username}
                                      
                                    />
                                  ))}
                                </Box>
                              )
                            }
                            fullWidth
                            MenuProps={MenuProps}
                          >
                            {assigneeOptions
                              .filter(
                                (option) =>
                                  !automation.addAssignees.some(
                                    (tag) => tag._id === option.value
                                  )
                              )
                              .map((option) => {
                               

                                return (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                    
                                  >
                                    {option.label}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </>
                      ) : automation.type ===
                        "Update client-facing job status" ? (
                        <>
                          {/* UI for Update client-facing job status */}
                          <InputLabel sx={{ color: "black", mb: 1 }}>
                            Visibility for client
                          </InputLabel>
                          <Autocomplete
                            options={statusOptions}
                            getOptionLabel={(option) => option.label}
                            value={
                              statusOptions.find(
                                (option) =>
                                  option.value ===
                                  automation.visibilityForClient
                              ) || null
                            }
                            onChange={(event, newValue) => {
                              const updatedAutomations = [
                                ...selectedAutomationData,
                              ];
                              updatedAutomations[index].visibilityForClient =
                                newValue?.value;
                              setSelectedAutomationData(updatedAutomations);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                variant="outlined"
                                placeholder="Select status"
                              />
                            )}
                            fullWidth
                          />
                          {automation.visibilityForClient === true && (
                            <Box>
                              <Box>
                                <InputLabel
                                  sx={{ color: "black", mb: 1, mt: 1 }}
                                >
                                  Select status
                                </InputLabel>
                                <Autocomplete
                                  options={optionstatus}
                                  size="small"
                                  sx={{ mt: 1 }}
                                  value={
                                    automation.selectedClientStatus || null
                                  }
                                  onChange={(event, newValue) =>
                                    handleEditClientChange(index, newValue)
                                  }
                                  getOptionLabel={(option) => option.label}
                                  isOptionEqualToValue={(option, value) =>
                                    option.value === value?.value
                                  }
                                  renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                      <Chip
                                        size="small"
                                        style={{
                                          backgroundColor:
                                            option.clientfacingColour,
                                          marginRight: 8,
                                          marginLeft: 8,
                                          borderRadius: "50%",
                                          height: "15px",
                                        }}
                                      />
                                      {option.label}
                                    </Box>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select status"
                                      InputProps={{
                                        ...params.InputProps,
                                        startAdornment: params.inputProps
                                          .value ? (
                                          <Chip
                                            size="small"
                                            style={{
                                              backgroundColor:
                                                optionstatus.find(
                                                  (opt) =>
                                                    opt.label ===
                                                    params.inputProps.value
                                                )?.clientfacingColour,
                                              marginRight: 8,
                                              marginLeft: 2,
                                              borderRadius: "50%",
                                              height: "15px",
                                            }}
                                          />
                                        ) : null,
                                      }}
                                    />
                                  )}
                                />
                              </Box>
                              <Box mt={1}>
                                <InputLabel sx={{ color: "black", mb: 1 }}>
                                  Status description for client
                                </InputLabel>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={4}
                                  variant="outlined"
                                  value={automation.statusDescription || ""}
                                  onChange={(event) => {
                                    const updatedAutomations = [
                                      ...selectedAutomationData,
                                    ];
                                    updatedAutomations[
                                      index
                                    ].statusDescription = event.target.value;
                                    setSelectedAutomationData(
                                      updatedAutomations
                                    );
                                  }}
                                  placeholder="Status description for client"
                                />
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  {automation.statusDescription?.length || 0}/
                                  {maxDescriptionLength}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Other Automation Types */}
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
                                      : automation.type ===
                                          "Apply folder template"
                                        ? optionfolder
                                        : automation.type === "Create Task"
                                          ? taskTemplateOptions
                                          : automation.type === "Send message"
                                            ? chatTemplateOptions
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
                        </>
                      )}

                      <Box>
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
                      </Box>
                      <Button
                        variant="text"
                        sx={{ marginTop: 2 }}
                        onClick={() => handleEditConditions(index)}
                      >
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
                    "&:hover": {
                      backgroundColor: "var(--color-save-hover-btn)",
                    },
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
                PaperProps={{
                  style: {
                    maxHeight: 200, // Adjust the height as needed
                    overflowY: "auto",
                  },
                }}
              >
                <MenuItem onClick={() => handleMenuItemSelect("Send Email")}>
                  Send Email
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemSelect("Send Invoice")}>
                  Send Invoice
                </MenuItem>
                <MenuItem
                  onClick={() => handleMenuItemSelect("Send Proposal/Els")}
                >
                  Send Proposal/Els
                </MenuItem>
                <MenuItem
                  onClick={() => handleMenuItemSelect("Create Organizer")}
                >
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
                {/* Update job assignees */}
                <MenuItem
                  onClick={() => handleMenuItemSelect("Update account tags")}
                >
                  Update job assignees
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemSelect("Create Task")}>
                  Create Task
                </MenuItem>
                {/* Send message */}
                <MenuItem onClick={() => handleMenuItemSelect("Send message")}>
                  Send message
                </MenuItem>
                {/* Update client-facing job status */}
                <MenuItem
                  onClick={() =>
                    handleMenuItemSelect("Update client-facing job status")
                  }
                >
                  Update client-facing job status
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Conditions Edit Drawer */}
      <Drawer
        anchor="right"
        open={isConditionsEditFormOpen}
        onClose={handleEditGoBack}
        BackdropProps={{ invisible: true }}
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
