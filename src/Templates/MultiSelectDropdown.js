// import React, { useState, useEffect,useRef } from "react";
// import {
//   Box,
//   Checkbox,
//   TextField,
//   Menu,
//   MenuItem,
//   Chip,
//   Typography,
//   IconButton,Paper
// } from "@mui/material";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { FaCaretUp,FaCaretDown  } from "react-icons/fa";
// const MultiSelectDropdown = () => {
//   const containerRef = useRef(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedValues, setSelectedValues] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [userData, setUserData] = useState([]);
//   const [menuWidth, setMenuWidth] = useState(null);

//   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
//         const response = await fetch(url);
//         const data = await response.json();
//         setUserData(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   }, [LOGIN_API]);

//   const userOptions = userData.map((user) => ({
//     value: user._id,
//     label: user.username,
//   }));

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//     if (containerRef.current) {
//       setMenuWidth(containerRef.current.offsetWidth);
//     }
//   };


//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSelect = (value) => {
//     setSelectedValues((prev) =>
//       prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
//     );
//   };
// console.log("selcted values",selectedValues)
//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const clearSelection = () => {
//     setSelectedValues([]);
//   };

//   const filteredOptions = userOptions.filter((option) =>
//     option.label.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
   
//     <Box sx={{ width: "100p%" }}>
//       {/* <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
//         Accounts
//       </Typography> */}

//       {/* Selected Items & Dropdown Toggle */}
//       <Box
//         ref={containerRef} // Reference the container
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           border: "1px solid #ccc",
//           borderRadius: "8px",
//           padding: "8px",
//           cursor: "pointer",
//           bgcolor: "background.paper",
//           // "&:hover": { borderColor: "primary.main" },
//           width: "100%",
//           mt:2
//         }}
//         onClick={handleClick}
//       >
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//           {selectedValues.length > 0 ? (
//             selectedValues.map((value) => {
//               const selectedOption = userOptions.find(
//                 (option) => option.value === value
//               );
//               return selectedOption ? (
//                 <Chip
//                   key={value}
//                   label={selectedOption.label}
//                   onDelete={() => handleSelect(value)}
//                   // color="primary"
//                   size="small"
//                   sx={{
//                     // backgroundColor: account?.colour || "#ccc", // Use account colour or fallback
//                     // color: "#fff",
//                     fontWeight: 500,
//                     fontSize: "10px",
//                     borderRadius: "16px",
//                     height: "20px",
//                     cursor: "pointer",
//                     boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
//                     "& .MuiChip-deleteIcon": {
//                       color: "#fff",
//                       opacity: 0.7,
//                       transition: "opacity 0.2s",
//                       "&:hover": { opacity: 1 },
//                     },
//                   }}
//                 />
//               ) : null;
//             })
//           ) : (
//             <Typography variant="body2" color="textSecondary">
//              Select from list
//             </Typography>
//           )}
//         </Box>
//         <Box >
//           {anchorEl ? <FaCaretUp /> : <FaCaretDown  />}
//         </Box>
//       </Box>

//       {/* Dropdown Menu with Fixed Width */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//         transformOrigin={{ vertical: "top", horizontal: "left" }}
//       >
//         <Box
//           sx={{
//             width: menuWidth || "auto", // Maintain consistent width
//             maxHeight: "250px",
//             overflowY: "auto",
//           }}
//         >
//           {/* Search Field */}
//           <Box sx={{ p: 1 }}>
//             <TextField
//               fullWidth
//               size="small"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={handleSearchChange}
//               variant="outlined"
//                autoComplete="off"
//             />
//           </Box>

//           {/* List of Options */}
//           {filteredOptions.length > 0 ? (
//             filteredOptions.map((option) => (
//               <Box
//                 key={option.value}
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   padding: "8px 12px",
//                   cursor: "pointer",
//                   "&:hover": { bgcolor: "action.hover" },
//                 }}
//                 onClick={() => handleSelect(option.value)}
//               >
//                 <Checkbox
//                   checked={selectedValues.includes(option.value)}
//                   sx={{ p: 0, mr: 1 }}
//                 />
//                 <Typography>{option.label}</Typography>
//               </Box>
//             ))
//           ) : (
//             <Typography sx={{ p: 2, color: "gray" }}>No results found</Typography>
//           )}

//             <Box
//               sx={{
//                 padding: "8px 12px",
//                 color: "red",
//                 cursor: "pointer",
//                 "&:hover": { bgcolor: "action.hover" },
//               }}
//               onClick={clearSelection}
//             >
//               X Clear selected
//             </Box>
      
//         </Box>
//       </Menu>
//     </Box>
//   );
// };

// export default MultiSelectDropdown;


import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Checkbox,
  TextField,
  Menu,
  Chip,
  Typography,
  IconButton
} from "@mui/material";
import { FaCaretUp, FaCaretDown,FaTimes } from "react-icons/fa";

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

  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

  // Determine if using internal or external options
  const options = propOptions || internalOptions;

  useEffect(() => {
    // Only fetch data if no options prop provided
    if (!propOptions) {
      const fetchData = async () => {
        try {
          const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
          const response = await fetch(url);
          const data = await response.json();
          setInternalOptions(data.map(user => ({
            value: user._id,
            label: user.username,
          })));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [LOGIN_API, propOptions]);

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
      console.log(newValue)
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
          // mt: 2,
          minHeight: "20px", 
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
        {/* {value.length > 0 && (
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
        <IconButton size="small" sx={{ p: 0 }}>
          {anchorEl ? <FaCaretUp /> : <FaCaretDown />}
        </IconButton> */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
        {value.length > 0 && (
          <IconButton
                        onClick={clearSelection}
                        size="small"
                        sx={{ color: "text.secondary" }}
                      >
                        <FaTimes />
                      </IconButton>
        )}
                  <IconButton size="small">
                    {anchorEl ? <FaCaretUp /> : <FaCaretDown />}
                  </IconButton>
                </Box>
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

       
      </Menu>
    </Box>
  );
};

export default MultiSelectDropdown;