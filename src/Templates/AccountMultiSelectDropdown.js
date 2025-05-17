import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import {
  Box,
  Checkbox,
  TextField,
  Menu,
  Chip,
  Typography,
  IconButton
} from "@mui/material";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

// const MultiSelectDropdown = ({
//   value = [],
//   onChange,
//   options: propOptions,
//   placeholder = "Select from list",
//   width = "100%"
// }) => {
//   const containerRef = useRef(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [menuWidth, setMenuWidth] = useState(null);
//   const [internalOptions, setInternalOptions] = useState([]);

//   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
//   const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
//   // Determine if using internal or external options
//   const options = propOptions || internalOptions;

//   // useEffect(() => {
//   //   // Only fetch data if no options prop provided
//   //   if (!propOptions) {
//   //     const fetchData = async () => {
//   //       try {
//   //         const url = `${ACCOUNT_API}/accounts/account/accountdetailslist/true`;
//   //         const response = await fetch(url);
//   //         const data = await response.json();
//   //         console.log("accounts",data.accountlist)
//   //         setInternalOptions(data.accountlist.map(account => ({
//   //           value: account.id,
//   //           label: account.Name,
//   //         })));
//   //       } catch (error) {
//   //         console.error("Error fetching data:", error);
//   //       }
//   //     };
//   //     fetchData();
//   //   }
//   // }, [ACCOUNT_API, propOptions]);


//   useEffect(() => {
//   if (!propOptions) {
//     const fetchData = async () => {
//       try {
//         const url = `${ACCOUNT_API}/accounts/account/accountdetailslist/true`;
//         const response = await fetch(url);
//         const data = await response.json();

//         const options = data.accountlist.map(account => ({
//           value: account.id,
//           label: account.Name,
//         }));

//         setInternalOptions(options);

//         // Automatically select the account from cookie
//         const accountIdFromCookie = Cookies.get('accountId');
//         if (accountIdFromCookie) {
//           const matchedAccount = options.find(
//             (acc) => acc.value === accountIdFromCookie
//           );
//           if (matchedAccount && onChange) {
//             onChange([matchedAccount]); // Set initial selected value
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }
// }, [ACCOUNT_API, propOptions, onChange]);
//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//     if (containerRef.current) {
//       setMenuWidth(containerRef.current.offsetWidth);
//     }
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSelect = (selectedValue) => {
//     const newValue = value.some(item => item.value === selectedValue)
//       ? value.filter(item => item.value !== selectedValue)
//       : [...value, options.find(option => option.value === selectedValue)];
    
//     if (onChange) {
//       onChange(newValue);
//       console.log(newValue)
//     }
//   };

const MultiSelectDropdown = ({
  value = [],
  onChange,
  options: propOptions,
  placeholder = "Select from list",
  width = "100%"
}) => {
  const containerRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuWidth, setMenuWidth] = useState(null);
  const [internalOptions, setInternalOptions] = useState([]);
  const [initialized, setInitialized] = useState(false); // Track initialization

  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;

  const options = propOptions || internalOptions;

  useEffect(() => {
    if (!propOptions && !initialized) {
      const fetchData = async () => {
        try {
          const url = `${ACCOUNT_API}/accounts/account/accountdetailslist/true`;
          const response = await fetch(url);
          const data = await response.json();

          const options = data.accountlist.map(account => ({
            value: account.id,
            label: account.Name,
          }));

          setInternalOptions(options);

          // Only set cookie value if no existing value is provided
          if (value.length === 0) {
            const accountIdFromCookie = Cookies.get('accountId');
            if (accountIdFromCookie) {
              const matchedAccount = options.find(
                (acc) => acc.value === accountIdFromCookie
              );
              if (matchedAccount && onChange) {
                onChange([matchedAccount]);
              }
            }
          }
          
          setInitialized(true);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [ACCOUNT_API, propOptions, onChange, value, initialized]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (containerRef.current) {
      setMenuWidth(containerRef.current.offsetWidth);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (selectedValue) => {
    const newValue = value.some(item => item.value === selectedValue)
      ? value.filter(item => item.value !== selectedValue)
      : [...value, options.find(option => option.value === selectedValue)];
    
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSelection = () => {
    if (onChange) {
      onChange([]);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ width }}>
      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "8px",
          cursor: "pointer",
          bgcolor: "background.paper",
          width: "100%",
          mt: 2,
          minHeight: "20px"
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, flexGrow: 1 }}>
          {value.length > 0 ? (
            value.map((item) => (
              <Chip
                key={item.value}
                label={item.label}
                onDelete={() => handleSelect(item.value)}
                size="small"
                sx={{
                  fontWeight: 500,
                  fontSize: "10px",
                  borderRadius: "16px",
                  height: "20px",
                  cursor: "pointer",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                  "& .MuiChip-deleteIcon": {
                    color: "#fff",
                    opacity: 0.7,
                    transition: "opacity 0.2s",
                    "&:hover": { opacity: 1 },
                  },
                }}
              />
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              {placeholder}
            </Typography>
          )}
        </Box>
        <IconButton size="small" sx={{ p: 0 }}>
          {anchorEl ? <FaCaretUp /> : <FaCaretDown />}
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          style: {
            width: menuWidth || "auto",
            maxHeight: "250px",
          }
        }}
      >
        <Box sx={{ p: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            autoComplete="off"
            autoFocus
          />
        </Box>

        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <Box
              key={option.value}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "8px 12px",
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={() => handleSelect(option.value)}
            >
              <Checkbox
                checked={value.some(item => item.value === option.value)}
                sx={{ p: 0, mr: 1 }}
              />
              <Typography>{option.label}</Typography>
            </Box>
          ))
        ) : (
          <Typography sx={{ p: 2, color: "gray" }}>No results found</Typography>
        )}

        {value.length > 0 && (
          <Box
            sx={{
              padding: "8px 12px",
              color: "red",
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
            }}
            onClick={clearSelection}
          >
            X Clear selected
          </Box>
        )}
      </Menu>
    </Box>
  );
};

export default MultiSelectDropdown;