import { Box, Typography } from "@mui/material";
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
const Accounts = () => {
  return (
    <>
      <Box >
        <Typography variant="h4" gutterBottom={"10px"}>Accounts</Typography>
      </Box>

      {/* <Box sx={{border:'2px solid red',p:'10px'}}>
        <NavLink
          to={`/clients/accounts/activeaccounts`}
          style={{
         
            padding: "4px 8px",
            borderRadius: "10px",
            fontSize: "14px",
            cursor: "pointer",
            width: "50%",
            textDecoration: "none",
            margin:'5px'
          }}
        >
          Active
        </NavLink>
        <NavLink
          to={`/clients/accounts/archivedaccounts`}
          style={{
           
            padding: "4px 8px",
            borderRadius: "10px",
            fontSize: "14px",
            cursor: "pointer",
            width: "50%",
            textDecoration: "none",
            margin:'5px'
          }}
        >
          Archived
        </NavLink>
      </Box> */}

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
        to="/clients/accounts/activeaccounts"
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
        to="/clients/accounts/archivedaccounts"
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
    </>
  );
};

export default Accounts;
