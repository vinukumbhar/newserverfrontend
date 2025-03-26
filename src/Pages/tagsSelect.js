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
  const [tagsData, setTagsData] = useState([]);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${TAGS_API}/tags/`;
        const response = await fetch(url);
        const data = await response.json();
        console.log(data)
        setTagsData(data.tags);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [TAGS_API]);




  const tagsOptions = tagsData.map((tag) => ({
    value: tag._id,
    label: tag.tagName,
    colour: tag.tagColour,

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
 const filteredOptions = tagsOptions.filter(
  (option) =>
    !selectedValues.includes(option.value) &&
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
);
  return (
   
    <Box sx={{ width: "500px" }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
        Tags
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
            // selectedValues.map((value) => {
            //   const selectedOption = tagsOptions.find(
            //     (option) => option.value === value
            //   );
            //   return selectedOption ? (
            //     <Chip
            //       key={value}
            //       label={selectedOption.label}
            //       onDelete={() => handleSelect(value)}
            //       // color="primary"
            //       size="small"
            //       sx={{
                    
            //         fontWeight: 500,
            //         fontSize: "10px",
            //         borderRadius: "16px",
            //         height: "20px",
            //         cursor: "pointer",
            //         boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                    // "& .MuiChip-deleteIcon": {
                    //   color: "#fff",
                    //   opacity: 0.7,
                    //   transition: "opacity 0.2s",
                    //   "&:hover": { opacity: 1 },
                    // },
            //       }}
            //     />
            //   ) : null;
            // })
            selectedValues.map((value) => {
                const selectedOption = tagsOptions.find(
                  (option) => option.value === value
                );
                return selectedOption ? (
                  <Chip
                    key={value}
                    label={selectedOption.label}
                    onDelete={() => handleSelect(value)}
                    size="small"
                    sx={{
                      backgroundColor: selectedOption.colour, // Dynamic background color
                      color: "#fff", // Ensures text is readable
                      fontWeight: 550,
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
              Tags
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
            // filteredOptions.map((option) => (
            //   <Box
            //     key={option.value}
            //     sx={{
            //         color: "#fff",
            //         fontSize: "8px",
            //         borderRadius: "10px",
            //         margin: "5px",
                   
            //       display: "flex",
            //       backgroundColor:option.colour,
            //       alignItems: "center",
            //       padding: "4px ",
            //       cursor: "pointer",
                
            //     }}
            //     onClick={() => handleSelect(option.value)}
            //   >
                
            //     <Typography>{option.label}</Typography>
            //   </Box>
            // ))
            filteredOptions.map((option) => (
                <Box
                  key={option.value}
                  sx={{
                    color: "#fff",
                    fontSize: "10px",
                    borderRadius: "10px",
                    // ml:"10px",
                    margin: "5px 10px", // Vertical margin only (since they stack)
                    display: "flex", // Flex container (but stacks vertically due to parent)
                    width: "fit-content", // Box width adjusts to content
                    backgroundColor: option.colour,
                    alignItems: "center",
                    justifyContent: "center", // Center text horizontally
                    padding: "4px 8px", // Padding for spacing
                    cursor: "pointer",
                    whiteSpace: "nowrap", // Prevent text wrapping
                  }}
                  onClick={() => handleSelect(option.value)}
                >
                  <Typography sx={{ fontSize: "inherit" }}>{option.label}</Typography>
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