import { Box, Typography } from "@mui/material";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Jobs = () => {
  return (
   <Box>
     <Box >
            <Typography variant="h4" gutterBottom={"10px"}>Jobs</Typography>
          </Box>
          <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#EBF0F5", // Light grayish-blue background
                  borderRadius: "12px",
                  padding: "6px",
                width:'max-content'
                }}
              >
                <NavLink
                  to="/jobs/activejob"
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
                  Active
                </NavLink>
                <NavLink
                  to="/jobs/archivedjob"
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
                  Archived
                </NavLink>
                
              </Box>
           
          
                <Box mt={2}>
                  <Outlet />
                </Box>
   </Box>
  )
}

export default Jobs