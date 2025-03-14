import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Tasks = () => {
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
            to="/workflow/tasks/pending"
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
            to="/workflow/tasks/completed"
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
        <Box>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "var(--color-save-btn)", // Normal background

              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)", // Hover background color
              },
              borderRadius: "15px",
              mt: 2,
            }}
          >
            New Task
          </Button>
        </Box>
      </Box>

      <Box mt={2}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Tasks;
