import { Box, Button, Typography } from "@mui/material";
import React ,{useState}from "react";
import { NavLink, Outlet } from "react-router-dom";
import NewTaskDrawer from "./NewTaskDrawer";
const Tasks = () => {
 const [drawerOpen, setDrawerOpen] = useState(false);
 const onclose =()=>{
  setDrawerOpen(false)
 }
  return (
    <Box>
      <Box>
        <Typography variant="h4" gutterBottom={"10px"}>
          Tasks
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#EBF0F5", // Light grayish-blue background
            borderRadius: "12px",
            padding: "6px",
            width: "max-content",
          }}
        >
          <NavLink
            to="/tasks/pending"
            style={({ isActive }) => ({
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "15px",
              cursor: "pointer",
              textDecoration: "none",
              fontWeight: isActive ? "bold" : "normal",
              color: isActive ? "var(--color-save-btn)" : "#333",
              backgroundColor: isActive ? "#fff" : "transparent",
              transition: "all 0.3s ease",
            })}
          >
            Pending
          </NavLink>
          <NavLink
            to="/tasks/completed"
            style={({ isActive }) => ({
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "15px",
              cursor: "pointer",
              textDecoration: "none",
              fontWeight: isActive ? "bold" : "normal",
              color: isActive ? "var(--color-save-btn)" : "#333",
              backgroundColor: isActive ? "#fff" : "transparent",
              transition: "all 0.3s ease",
            })}
          >
            Completed
          </NavLink>
        </Box>
       
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
  <Button
    variant="contained"
    sx={{
      backgroundColor: "var(--color-save-btn)", // Normal background
      "&:hover": {
        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
      },
      borderRadius: "15px",
    }}
    onClick={() => setDrawerOpen(true)}
  >
    New Task
  </Button>
</Box>
      <Box mt={2}>
        <Outlet />
      </Box>

      <NewTaskDrawer  open={drawerOpen}
             onClose={onclose}
              />
    </Box>
  );
};

export default Tasks;
