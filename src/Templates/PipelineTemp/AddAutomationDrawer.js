import React from "react";
import { Drawer, Box, Typography, Button, Menu, MenuItem } from "@mui/material";
import { RxCross2 } from "react-icons/rx";

const AddAutomationDrawer = ({
  isDrawerOpen,
  handleDrawerClose,
  renderActionContent,
  automationSelect,
  index,
  ehitAnchorEl,
  handleEditClose,
  handleMenuItemSelect,

}) => {
  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={handleDrawerClose}
      BackdropProps={{ invisible: true }}
      PaperProps={{
        sx: {
          borderRadius: "10px 0 0 10px",
          width: 500,
          maxWidth: "100%",
        },
      }}
    >
      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Add Automations
        </Typography>
        <RxCross2 onClick={handleDrawerClose} style={{ fontSize: "30px", cursor: "pointer" }} />
      </Box>

      {/* Content Section */}
      <Box sx={{ p: 2 }}>{renderActionContent(automationSelect, index)}</Box>

      

      {/* Menu Section */}
      <Menu anchorEl={ehitAnchorEl} open={Boolean(ehitAnchorEl)} onClose={handleEditClose}>
        <MenuItem onClick={() => handleMenuItemSelect("Send Email")}>Send Email</MenuItem>
        <MenuItem onClick={() => handleMenuItemSelect("Send Invoice")}>Send Invoice</MenuItem>
        <MenuItem onClick={() => handleMenuItemSelect("Send Proposal/Els")}>Send Proposal/Els</MenuItem>
        <MenuItem onClick={() => handleMenuItemSelect("Create Organizer")}>Create Organizer</MenuItem>
        <MenuItem onClick={() => handleMenuItemSelect("Apply folder template")}>Apply folder template</MenuItem>
        <MenuItem onClick={() => handleMenuItemSelect("Update account tags ")}>Update account tags</MenuItem>
              <MenuItem onClick={() => handleMenuItemSelect("Update job assignees")}>Update job assignees</MenuItem>
      </Menu>
    </Drawer>
  );
};

export default AddAutomationDrawer;
