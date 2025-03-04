// import React from "react";
// import Select from "react-select";

// const Status = ({onStatusChange, selectedStatus}) => {


//   const options = [
//     { value: "No status", label: "No status", color: "#C4AEAD" },
//     { value: "Planned", label: "Planned", color: "#4169E1" },
//     { value: "In review", label: "In review", color: "#F6BE00" },
//     { value: "In progress", label: "In progress", color: "#F6BE00" },
//     { value: "On hold", label: "On hold", color: "#BCC6CC" },
//     { value: "Extended", label: "Extended", color: "#82CAFF" },
//     { value: "Waiting for Client", label: "Waiting for Client", color: "#566D7E" },
//     { value: "Waiting for Signatures", label: "Waiting for Signatures", color: "#566D7E" },
//     { value: "Waiting for agency", label: "Waiting for agency", color: "#566D7E" },
//     { value: "Completed", label: "Completed", color: "#00FF00" },
//     { value: "Canceled", label: "Canceled", color: "#EB5406" },

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
//     onStatusChange(selectedOption);
//     console.log("handleChange", selectedOption);
//   };

//   return (
//     <div>
//    <label  className="priority-custom-label">Status</label>
//    <div style={{marginTop:'10px'}}>
//    <Select options={options} 
//     onChange={handleChange} 
//     styles={colorStyles} 
//     value = {options.find(option => option.value === selectedStatus)}
//     isSearchable // Enable search
//     isClearable
//     />
//    </div>
    
//     </div>
 
    
//   );
// };

// export default Status;


import React from "react";
import { MenuItem, Select, Chip, InputLabel, FormControl, Box } from "@mui/material";

const Status = ({ onStatusChange, selectedStatus }) => {
  const options = [
    { value: "No status", label: "No status", color: "#C4AEAD" },
    { value: "Planned", label: "Planned", color: "#4169E1" },
    { value: "In review", label: "In review", color: "#F6BE00" },
    { value: "In progress", label: "In progress", color: "#F6BE00" },
    { value: "On hold", label: "On hold", color: "#BCC6CC" },
    { value: "Extended", label: "Extended", color: "#82CAFF" },
    { value: "Waiting for Client", label: "Waiting for Client", color: "#566D7E" },
    { value: "Waiting for Signatures", label: "Waiting for Signatures", color: "#566D7E" },
    { value: "Waiting for agency", label: "Waiting for agency", color: "#566D7E" },
    { value: "Completed", label: "Completed", color: "#00FF00" },
    { value: "Canceled", label: "Canceled", color: "#EB5406" },
  ];

  const handleChange = (event) => {
    onStatusChange(event.target.value);
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
  }
  const calculateWidth = (label) => {
    const textWidth = label.length * 9;
    return Math.min(textWidth, 220);
  };
  return (
    <Box>
      <InputLabel sx={{color:'black',mb:2}}>Status</InputLabel>
    <FormControl fullWidth>
      
      <Select
      size="small"
        value={selectedStatus}
        onChange={handleChange}
        renderValue={(selected) => (
          <Chip
            label={selected}
            style={{
              backgroundColor: options.find((opt) => opt.value === selected)?.color ,
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
        )}
        MenuProps={MenuProps}
                            sx={{
                              borderRadius: "10px",
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                              },
                            }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Chip
              label={option.label}
              style={{
                backgroundColor: option.color,
                color: "#fff",
                fontSize: "10px",
                borderRadius: "10px",
                // margin: "5px",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                // padding: "2px",
                whiteSpace: "nowrap", 
                // width: `${calculateWidth(option.label)}px`,
                "&:hover": {
                  backgroundColor: option.color,
                  color: "#fff",
                },
              }}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    </Box>
  );
};

export default Status;
