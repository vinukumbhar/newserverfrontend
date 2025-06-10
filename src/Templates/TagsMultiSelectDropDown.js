import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Menu,
  Chip,
  Typography,
  IconButton
} from "@mui/material";
import { FaCaretUp, FaCaretDown, FaTimes } from "react-icons/fa";

const TagsMultiSelectDropDown = ({
  value = [],
  onChange,
  options: propOptions,
  placeholder = "Select tags",
  width = "100%"
}) => {
  const containerRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuWidth, setMenuWidth] = useState(null);
  const [internalOptions, setInternalOptions] = useState([]);

  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;

  // Determine if using internal or external options
  const options = propOptions || internalOptions;

  useEffect(() => {
    // Only fetch data if no options prop provided
    if (!propOptions) {
      const fetchData = async () => {
        try {
          const url = `${TAGS_API}/tags/`;
          const response = await fetch(url);
          const data = await response.json();
          setInternalOptions(data.tags.map(tag => ({
            value: tag._id,
            label: tag.tagName,
            colour: tag.tagColour
          })));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [TAGS_API, propOptions]);

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

//   const filteredOptions = options.filter((option) =>
//     option.label.toLowerCase().includes(searchQuery.toLowerCase())
//   );
const filteredOptions = options
  .filter((option) => 
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .filter((option) => 
    !value.some(selected => selected.value === option.value)
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
          padding: "4px",
          cursor: "pointer",
          bgcolor: "background.paper",
          width: "100%"
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {value.length > 0 ? (
            value.map((item) => {
              const selectedOption = options.find(
                (option) => option.value === item.value
              );
              return (
                <Chip
                  key={item.value}
                  label={item.label}
                  onDelete={() => handleSelect(item.value)}
                  size="small"
                  sx={{
                    backgroundColor: selectedOption?.colour,
                    color: "#fff",
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
              );
            })
          ) : (
            <Typography variant="body2" color="textSecondary">
              {placeholder}
            </Typography>
          )}
        </Box>
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
      </Menu>
    </Box>
  );
};

export default TagsMultiSelectDropDown;