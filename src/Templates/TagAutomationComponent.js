import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip
} from "@mui/material";
import MultiSelectDropdown from "./MultiSelectDropdown";

const TagAutomationComponent = ({
  automationSelect = "No Type",
 
  tagsoptions = [],
  initialAddTags = [],
  initialRemoveTags = [],
  initialSelectedTags = []
}) => {
  const [addTags, setAddTags] = useState(initialAddTags);
  const [removeTags, setRemoveTags] = useState(initialRemoveTags);
  const [selectedTags, setSelectedTags] = useState(initialSelectedTags);

  const handleAddTagChange = (newTags) => {
    setAddTags(newTags);
  };

  const handleRemoveTagChange = (newTags) => {
    setRemoveTags(newTags);
  };

  const handleAddConditions = () => {
    // Your conditions logic here
  };

  const selectedTagElements = selectedTags.map((tag) => {
    const option = tagsoptions.find(opt => opt.value === tag.value);
    return (
      <Chip
        key={tag.value}
        label={tag.label}
        sx={{
          backgroundColor: option?.colour,
          color: "#fff",
          fontWeight: 500,
          fontSize: "10px",
          borderRadius: "16px",
          height: "20px",
        }}
      />
    );
  });

  return (
    <Grid item>
      <Box
        sx={{
          border: "2px solid #ddd",
          borderRadius: "8px",
          padding: 2,
        }}
      >
        <Typography gutterBottom>
          1. {automationSelect || "No Type"}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
          {/* Add Tags Section */}
          <Box mt={2} width={"50%"}>
            <MultiSelectDropdown
              value={addTags}
              onChange={handleAddTagChange}
              options={tagsoptions}
              placeholder="Select tags..."
              label="Add Tags"
            />
          </Box>

          {/* Remove Tags Section */}
          <Box mt={2} width={"50%"}>
            <MultiSelectDropdown
              value={removeTags}
              onChange={handleRemoveTagChange}
              options={tagsoptions}
              placeholder="Select tags..."
              label="Remove Tags"
            />
          </Box>
        </Box>

        
      </Box>
     
    </Grid>
  );
};

export default TagAutomationComponent;