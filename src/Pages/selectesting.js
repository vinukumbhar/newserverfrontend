import React, { useState, useEffect,useRef } from "react";
import {
  Box,
  Checkbox,
  TextField,
  Menu,
  MenuItem,
  Chip,
  Typography,
  IconButton,Paper
} from "@mui/material";
import { FaChevronDown, FaChevronUp,FaTimes  } from "react-icons/fa";

const MultiSelectDropdown = () => {
  const containerRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState([]);
  const [menuWidth, setMenuWidth] = useState(null);

  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
        const response = await fetch(url);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [LOGIN_API]);

  const userOptions = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (containerRef.current) {
      setMenuWidth(containerRef.current.offsetWidth);
    }
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };
console.log("selcted values",selectedValues)
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSelection = () => {
    setSelectedValues([]);
  };

  // const filteredOptions = userOptions.filter((option) =>
  //   option.label.toLowerCase().includes(searchQuery.toLowerCase())
  // );
 // Filter options to exclude selected ones and match search query
 const filteredOptions = userOptions.filter(
  (option) =>
    !selectedValues.includes(option.value) &&
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
);
  return (
   
    <Box sx={{ width: "500px" }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
        Assignee
      </Typography>

      {/* Selected Items & Dropdown Toggle */}
      <Box
        ref={containerRef} // Reference the container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "4px",
          cursor: "pointer",
          bgcolor: "background.paper",
          // "&:hover": { borderColor: "primary.main" },
          width: "100%",
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {selectedValues.length > 0 ? (
            selectedValues.map((value) => {
              const selectedOption = userOptions.find(
                (option) => option.value === value
              );
              return selectedOption ? (
                <Chip
                  key={value}
                  label={selectedOption.label}
                  onDelete={() => handleSelect(value)}
                  // color="primary"
                  size="small"
                  sx={{
                    // backgroundColor: account?.colour || "#ccc", // Use account colour or fallback
                    // color: "#fff",
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
              ) : null;
            })
          ) : (
            <Typography variant="body2" color="textSecondary">
              Assignee
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {selectedValues.length > 0 && (
            <IconButton
              onClick={clearSelection}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <FaTimes />
            </IconButton>
          )}
          <IconButton size="small">
            {anchorEl ? <FaChevronUp /> : <FaChevronDown />}
          </IconButton>
        </Box>
      </Box>

      {/* Dropdown Menu with Fixed Width */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box
          sx={{
            width: menuWidth || "auto", // Maintain consistent width
            maxHeight: "250px",
            overflowY: "auto",
          }}
        >
          {/* Search Field */}
          <Box sx={{ p: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
               autoComplete="off"
            />
          </Box>

          {/* List of Options */}
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
                
                <Typography>{option.label}</Typography>
              </Box>
            ))
          ) : (
            <Typography sx={{ p: 2, color: "gray" }}>No results found</Typography>
          )}

            
        </Box>
      </Menu>
    </Box>
  );
};

export default MultiSelectDropdown;




// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   TextField,
//   Menu,
//   MenuItem,
//   Chip,
//   Typography,
//   IconButton
// } from "@mui/material";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";

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

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const clearSelection = () => {
//     setSelectedValues([]);
//   };

//   // Filter options to exclude selected ones and match search query
//   const filteredOptions = userOptions.filter(
//     (option) =>
//       !selectedValues.includes(option.value) &&
//       option.label.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <Box sx={{ width: "500px" }}>
//       <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
//         Assignee
//       </Typography>

//       {/* Selected Items & Dropdown Toggle */}
//       <Box
//         ref={containerRef}
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           border: "1px solid #ccc",
//           borderRadius: "8px",
//           padding: "4px",
//           cursor: "pointer",
//           bgcolor: "background.paper",
//           width: "100%",
//           minHeight: "40px",
//         }}
//         onClick={handleClick}
//       >
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, flexGrow: 1 }}>
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
//                   size="small"
//                   sx={{
//                     fontWeight: 500,
//                     fontSize: "12px",
//                     borderRadius: "16px",
//                     height: "24px",
//                     cursor: "pointer",
//                     "& .MuiChip-deleteIcon": {
//                       fontSize: "14px",
//                       marginLeft: "0px",
//                       marginRight: "2px",
//                     },
//                   }}
//                 />
//               ) : null;
//             })
//           ) : (
//             <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
//               Start typing name or email or code
//             </Typography>
//           )}
//         </Box>
//         {selectedValues.length > 0 && (
//           <Box
//             onClick={clearSelection}
//             sx={{
//               padding: "8px 12px",
//               color: "text.secondary",
//               "&:hover": { bgcolor: "action.hover" },
//               borderTop: "1px solid #eee",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Box component="span" sx={{ marginRight: "8px" }}>X</Box>
//             {/* Clear selected */}
//           </Box>
//         )}
//         <IconButton size="small">
//           {anchorEl ? <FaChevronUp /> : <FaChevronDown />}
//         </IconButton>
//       </Box>

//       {/* Dropdown Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//         transformOrigin={{ vertical: "top", horizontal: "left" }}
//         PaperProps={{
//           style: {
//             width: menuWidth || "auto",
//           },
//         }}
//       >
//         {/* Search Field */}
//         <Box sx={{ p: 1 }}>
//           <TextField
//             fullWidth
//             size="small"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             variant="outlined"
//             autoComplete="off"
//           />
//         </Box>

//         {/* List of Options */}
//         {filteredOptions.length > 0 ? (
//           filteredOptions.map((option) => (
//             <label
//               key={option.value}
//               onClick={() => handleSelect(option.value)}
//               style={{
//                 margin:"2px 5px",
//                 cursor:'pointer',
//                 "&:hover": { bgcolor: "action.hover" },
//               }}
//             >
//               <Typography>{option.label}</Typography>
//             </label>
//           ))
//         ) : (
//           <Typography sx={{ p: 2, color: "gray" }}>No results found</Typography>
//         )}

//         {/* Clear Selection Option */}
       
//       </Menu>
//     </Box>
//   );
// };

// export default MultiSelectDropdown;