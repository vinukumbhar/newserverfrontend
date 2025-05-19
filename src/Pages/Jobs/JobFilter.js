import React, { useState, useEffect } from "react";
import {
  Button,
  Menu,
  MenuItem,
  TextField,
  Select,
  ListItemText,
  FormControl,
  InputLabel,
  Checkbox,
  Typography,
  IconButton,
  Box,
  Popover,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CloseIcon from "@mui/icons-material/Close";
import MultiSelectDropdown from "../../Templates/MultiSelectDropdown";
const FilterDropdown = ({ onFilterChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleOptionSelect = (option) => {
    if (!selectedFilters.includes(option)) {
      setSelectedFilters((prev) => [...prev, option]);
    }
    handleClose();
  };

  const removeFilter = (option) => {
    setSelectedFilters((prev) => prev.filter((item) => item !== option));
    setClientStatus([]);
    setAccountNameValue("");
    setPriorityValue("");
    setCombinedValues();
    setSelectedStages({});
    setActivePipeline(null);
  };

  const options = [
    "Job assignees",
    "Pipeline and stage",
    "Client-facing status",
    "Account name",
    "Priority",
  ];

  const [selectedUser, setSelectedUser] = useState([]);

  const [combinedValues, setCombinedValues] = useState();
  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    console.log(newSelectedUsers);
    const selectedValues = newSelectedUsers.map((option) => option.label);
    setCombinedValues(selectedValues);
    console.log(selectedValues);
  };
  const [clientStatus, setClientStatus] = useState([]);
  const [clientStatusOptions, setClientStatusOptions] = useState([]);
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
  useEffect(() => {
    const fetchClientFacingStatus = async () => {
      try {
        const response = await fetch(
          `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`
        );
        const data = await response.json();
        if (data?.clientFacingJobStatues) {
          setClientStatusOptions(data.clientFacingJobStatues);
        }
      } catch (error) {
        console.error("Failed to fetch client-facing statuses", error);
      }
    };

    fetchClientFacingStatus();
  }, []);

  const [pipelines, setPipelines] = useState([]);
  const [selectedStages, setSelectedStages] = useState({});
  const [stageAnchorEl, setStageAnchorEl] = useState(null);
  const [activePipeline, setActivePipeline] = useState(null);
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const response = await fetch(
          `${PIPELINE_API}/workflow/pipeline/pipelines`
        );
        const data = await response.json();
        if (data?.pipeline) setPipelines(data.pipeline);
      } catch (error) {
        console.error("Error fetching pipelines:", error);
      }
    };

    fetchPipelines();
  }, []);

  const handlePipelineClick = (event, pipeline) => {
    setActivePipeline(pipeline);
    setStageAnchorEl(event.currentTarget);
  };

  // const handlePipelineCheckboxToggle = (pipeline) => {
  //   const stageNames = pipeline.stages.map((stage) => stage.name);
  //   const currentSelected = selectedStages[pipeline.pipelineName] || [];

  //   const allSelected = stageNames.every((name) =>
  //     currentSelected.includes(name)
  //   );

  //   setSelectedStages((prev) => ({
  //     ...prev,
  //     [pipeline.pipelineName]: allSelected ? [] : stageNames,
  //   }));
  // };

  const handlePipelineCheckboxToggle = (pipeline) => {
  const stageNames = pipeline.stages.map((stage) => stage.name);
  const currentSelected = selectedStages[pipeline.pipelineName] || [];

  if (currentSelected.length === stageNames.length) {
    // If all stages are selected, remove the pipeline entirely
    const newSelectedStages = { ...selectedStages };
    delete newSelectedStages[pipeline.pipelineName];
    setSelectedStages(newSelectedStages);
  } else {
    // Otherwise select all stages
    setSelectedStages(prev => ({
      ...prev,
      [pipeline.pipelineName]: stageNames
    }));
  }
};
  // const handleStageToggle = (pipelineName, stageName) => {
  //   setSelectedStages((prev) => {
  //     const current = prev[pipelineName] || [];
  //     const updated = current.includes(stageName)
  //       ? current.filter((name) => name !== stageName)
  //       : [...current, stageName];

  //     return { ...prev, [pipelineName]: updated };
  //   });
  // };
  const handleStageToggle = (pipelineName, stageName) => {
  setSelectedStages((prev) => {
    const current = prev[pipelineName] || [];
    let updated;
    
    if (current.includes(stageName)) {
      // Remove the stage
      updated = current.filter(name => name !== stageName);
    } else {
      // Add the stage
      updated = [...current, stageName];
    }

    // If no stages left for this pipeline, remove the pipeline entirely
    if (updated.length === 0) {
      const newState = { ...prev };
      delete newState[pipelineName];
      return newState;
    }

    return { ...prev, [pipelineName]: updated };
  });
};

  const [accountNameValue, setAccountNameValue] = useState("");
  const [priorityValue, setPriorityValue] = useState("");
  // Add this useEffect to notify parent component when filters change
  useEffect(() => {
    if (onFilterChange) {
      const filters = {
        jobAssignees: combinedValues,
        clientStatus,
        pipelineStages: selectedStages,
        accountName: accountNameValue, // You'll need to add this state
        priority: priorityValue, // You'll need to add this state
      };
      onFilterChange(filters);
    }
  }, [
    combinedValues,
    clientStatus,
    selectedStages,
    accountNameValue,
    priorityValue,
  ]);

  // Add these new states

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <Button
          onClick={handleClick}
          sx={{
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 2,
            backgroundColor: "#f5f7fa",
            color: "#1a73e8",
            px: 2,
          }}
          endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          Filter
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: 250,
              maxHeight: 300,
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} onClick={() => handleOptionSelect(option)}>
              {option}
            </MenuItem>
          ))}
        </Menu>

        {/* Render selected filters */}

        {selectedFilters.length > 0 && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
             
              gap: 2,
              maxHeight: "260px",
              overflowY: "auto",
            }}
          >
            {selectedFilters.map((filter) => (
              <Box
                key={filter}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                  minWidth: 240,
                  borderRadius: 2,
                  backgroundColor: "#ffffff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  position: "relative",
                }}
              >
                {/* Filter title */}
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color="text.primary"
                  sx={{ mb: 1 }}
                >
                  {filter}
                </Typography>

                {/* Filter Inputs */}
                {filter === "Job assignees" && (
                  <MultiSelectDropdown
                    value={selectedUser}
                    onChange={handleUserChange}
                    placeholder="Select assignees"
                  />
                )}

                {filter === "Account name" && (
                  <TextField
                    size="small"
                    placeholder="Enter account name"
                    value={accountNameValue}
                    onChange={(e) => setAccountNameValue(e.target.value)}
                  />
                )}

                {filter === "Client-facing status" && (
                  <FormControl size="small" fullWidth>
                    <Select
                      multiple
                      value={clientStatus}
                      onChange={(e) => setClientStatus(e.target.value)}
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {clientStatusOptions.map((status) => (
                        <MenuItem
                          key={status._id}
                          value={status.clientfacingName}
                        >
                          <Checkbox
                            checked={clientStatus.includes(
                              status.clientfacingName
                            )}
                          />
                          <ListItemText primary={status.clientfacingName} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}


                {filter === "Pipeline and stage" && (
                  <Box sx={{ mt: 2 }}>
                    {pipelines.map((pipeline) => (
                      <Box
                        key={pipeline._id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          justifyContent: "space-between",
                          width: "220px",
                          p: 1,
                          mt: 1,
                          bgcolor: "#fff",
                        }}
                        onClick={(e) => handlePipelineClick(e, pipeline)}
                      >
                        <Checkbox
                          checked={
                            pipeline.stages?.length &&
                            selectedStages[pipeline.pipelineName]?.length ===
                              pipeline.stages.length
                          }
                          onClick={(e) => {
                            e.stopPropagation(); // prevent triggering the popover
                            handlePipelineCheckboxToggle(pipeline);
                          }}
                          size="small"
                        />

                        <Typography sx={{ fontSize: "12px" }}>
                          {pipeline.pipelineName}
                        </Typography>
                        <Typography variant="caption">
                          ({selectedStages[pipeline.pipelineName]?.length || 0}/
                          {pipeline.stages?.length || 0})
                        </Typography>
                      </Box>
                    ))}

                    <Popover
                      open={Boolean(stageAnchorEl)}
                      anchorEl={stageAnchorEl}
                      onClose={() => setStageAnchorEl(null)}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                    >
                      <Box sx={{ p: 2, minWidth: 200 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Pipeline stages
                        </Typography>
                        {activePipeline?.stages?.map((stage) => (
                          <MenuItem
                            key={stage._id}
                            onClick={() =>
                              handleStageToggle(
                                activePipeline.pipelineName,
                                stage.name
                              )
                            }
                          >
                            <Checkbox
                              checked={
                                selectedStages[
                                  activePipeline.pipelineName
                                ]?.includes(stage.name) || false
                              }
                              size="small"
                            />
                            <ListItemText
                              primary={stage.name}
                              sx={{ fontSize: "12px" }}
                            />
                          </MenuItem>
                        ))}
                      </Box>
                    </Popover>
                  </Box>
                )}
                {filter === "Priority" && (
                  <FormControl size="small" fullWidth>
                    <Select
                      value={priorityValue}
                      onChange={(e) => setPriorityValue(e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                )}

                {/* Remove Button */}
                <IconButton
                  onClick={() => removeFilter(filter)}
                  size="small"
                  sx={{ position: "absolute", top: 4, right: 4 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FilterDropdown;
