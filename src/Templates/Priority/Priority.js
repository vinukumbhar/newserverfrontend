// import React from "react";
// import Select from "react-select";
// import { Box } from '@mui/material';

// const Priority = ({ onPriorityChange, selectedPriority }) => {

//   const options = [
//     { value: "Urgent", label: "Urgent", color: "#0E0402" },
//     { value: "High", label: "High", color: "#fe676e" },
//     { value: "Medium", label: "Medium", color: "#FFC300" },
//     { value: "Low", label: "Low", color: "#56c288" },
//   ];

//   const calculateWidth = (label) => {
//     const textWidth = label.length * 9;
//     return Math.min(textWidth, 220);
//   };

//   const colorStyles = {
//     control: (styles) => ({ ...styles, backgroundColor: "white" }),

//     option: (styles, { data }) => ({
//       ...styles,
//       backgroundColor: data.color,
//       color: "#fff",
//       borderRadius: "15px",
//       textAlign: "center",
//       padding: "2px,8px",
//       margin: "7px",
//       fontSize: "10px",
//       fontWeight: "bold",
//       width: `${calculateWidth(data.label)}px`, // Fix here
//     }),

//     singleValue: (styles, { data }) => ({
//       ...styles,
//       backgroundColor: data.color,
//       color: "#fff",
//       borderRadius: "15px",
//       width: `${calculateWidth(data.label) + 20}px`, // Fix here
//       overflow: "hidden",
//       textOverflow: "ellipsis",
//       textAlign: "center",

//     }),

//     singleValueLabel: (styles, { data }) => ({
//       ...styles,
//       backgroundColor: data.color,
//       color: "#fff",
//       borderRadius: "15px",
//       textAlign: "center",
//       fontSize: "12px",
//     }),
//   };

//   const handleChange = (selectedOption) => {
//     onPriorityChange(selectedOption);
//     console.log("handleChange", selectedOption);
//   };

//   return (
//     <Box>
//       <label  className="priority-custom-label" >Priority</label>
//       <Box mt={1}>
//       <Select options={options}
//         onChange={handleChange}
//         styles={colorStyles}
//         sx={{ width: '100%', marginTop: '20px' }}

//         size="small"

//         value={options.find(option => option.value === selectedPriority)}
//         isSearchable // Enable search
//         isClearable
//       />
//       </Box>

//     </Box>

//   );
// };

// export default Priority;

import React from "react";
import {
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";

const Priority = ({ onPriorityChange, selectedPriority }) => {
  const options = [
    { value: "Urgent", label: "Urgent", color: "#0E0402" },
    { value: "High", label: "High", color: "#fe676e" },
    { value: "Medium", label: "Medium", color: "#FFC300" },
    { value: "Low", label: "Low", color: "#56c288" },
  ];

  const handleChange = (event) => {
    onPriorityChange(event.target.value);
    console.log("handleChange", event.target.value);
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: "auto",
      },
    },
  };
  const calculateWidth = (label) => {
    const textWidth = label.length * 9;
    return Math.min(textWidth, 220);
  };
  return (
    <Box>
      <InputLabel sx={{ color: "black", mb: 2 }}>Priority</InputLabel>
      <FormControl fullWidth>
        <Select
          size="small"
          value={selectedPriority || ""}
          onChange={handleChange}
          displayEmpty
          renderValue={(selected) => {
            const selectedOption = options.find(
              (option) => option.value === selected
            );
            return selectedOption ? (
              <Chip
                label={selectedOption.label}
                sx={{
                  backgroundColor: selectedOption.color,
                  color: "#fff",
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
          }}
          MenuProps={MenuProps}
          sx={{
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                backgroundColor: option.color,
                color: "#fff",
                fontSize: "10px",
                borderRadius: "10px",
                margin: "5px",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                padding: "4px 9px",
                whiteSpace: "nowrap",
                width: `${calculateWidth(option.label)}px`,
                "&:hover": {
                  backgroundColor: option.color,
                  color: "#fff",
                },
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Priority;
