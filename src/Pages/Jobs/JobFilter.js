
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
      const response = await fetch( `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`);
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

    const allSelected = stageNames.every((name) =>
      currentSelected.includes(name)
    );

    setSelectedStages((prev) => ({
      ...prev,
      [pipeline.pipelineName]: allSelected ? [] : stageNames,
    }));
  };

  const handleStageToggle = (pipelineName, stageName) => {
    setSelectedStages((prev) => {
      const current = prev[pipelineName] || [];
      const updated = current.includes(stageName)
        ? current.filter((name) => name !== stageName)
        : [...current, stageName];

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
    <Box >
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
          + Filter
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
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
            {selectedFilters.map((filter) => (
              <Box
                key={filter}
                sx={{
                  display: "flex",

                  alignItems: "center",
                  gap: 2,
                  // border: "1px solid #ddd",
                  // borderRadius: 2,
                  // padding: 1.5,
                  backgroundColor: "#f9f9f9",
                  height: "150px",
                  overflowY: "auto",
                }}
              >
                <Typography variant="subtitle2" sx={{ minWidth: 130 }}>
                  {filter}
                </Typography>

                <Box>
                  {filter === "Job assignees" && (
                    <Box width="180px">
                      <MultiSelectDropdown
                        value={selectedUser}
                        onChange={handleUserChange}
                        placeholder="Job Assignees"
                      />
                    </Box>
                  )}

                  {filter === "Account name" && (
                    <TextField
                      size="small"
                      placeholder="Enter account name"
                      sx={{ width: "180px" }}
                      value={accountNameValue}
                      onChange={(e) => setAccountNameValue(e.target.value)}
                    />
                  )}

                  {/* {filter === "Client-facing status" && (
                    <FormControl sx={{ width: 220 }} size="small">
                      <Select
                        multiple
                        value={clientStatus}
                        onChange={(e) => setClientStatus(e.target.value)}
                        renderValue={(selected) => selected.join(", ")}
                      >
                        {["Planned", "On hold", "In progress", "Done"].map(
                          (status) => (
                            <MenuItem key={status} value={status}>
                              <Checkbox
                                checked={clientStatus.indexOf(status) > -1}
                              />
                              <ListItemText primary={status} />
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  )} */}

{filter === "Client-facing status" && (
  <FormControl sx={{ width: 220 }} size="small">
    <Select
      multiple
      value={clientStatus}
      onChange={(e) => setClientStatus(e.target.value)}
      renderValue={(selected) => selected.join(", ")}
    >
      {clientStatusOptions.map((status) => (
        <MenuItem key={status._id} value={status.clientfacingName}>
          <Checkbox checked={clientStatus.indexOf(status.clientfacingName) > -1} />
          <ListItemText primary={status.clientfacingName} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)}

                  {filter === "Pipeline and stage" && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">
                        Pipeline and stage
                      </Typography>
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
                            border: "1px solid #ccc",
                            borderRadius: 1,
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
                          />

                          <Typography>{pipeline.pipelineName}</Typography>
                          <Typography variant="caption">
                            (
                            {selectedStages[pipeline.pipelineName]?.length || 0}
                            /{pipeline.stages?.length || 0})
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
                              />
                              <ListItemText primary={stage.name} />
                            </MenuItem>
                          ))}
                        </Box>
                      </Popover>
                    </Box>
                  )}

                  {filter === "Priority" && (
                    <Select
                      fullWidth
                      size="small"
                      value={priorityValue}
                      onChange={(e) => setPriorityValue(e.target.value)}
                      sx={{ width: "180px" }}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  )}
                </Box>

                <IconButton onClick={() => removeFilter(filter)} size="small">
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
