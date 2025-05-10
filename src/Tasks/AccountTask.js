import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  InputLabel,
  IconButton,
  Autocomplete,
  TextField,
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Checkbox,
  FormControlLabel,
  Switch,
  Button,
} from "@mui/material";
import TagsMultiSelectDropDown from "../Templates/TagsMultiSelectDropDown";
import MultiSelectDropdown from "../Templates/MultiSelectDropdown";
import { IoChevronBackOutline } from "react-icons/io5";
import CloseIcon from "@mui/icons-material/Close";
import Editor from "../Templates/Texteditor/Editor";
import Grid from "@mui/material/Unstable_Grid2";
import Priority from "../Templates/Priority/Priority";
import Status from "../Templates/Status/Status";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PiDotsSixVerticalBold } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiPlusCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const AccountTask = ({ handleNewDrawerClose, handleDrawerClose }) => {
  const handleClose = () => {
    handleNewDrawerClose();
    // handleDrawerClose();
  };

  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;
  //****************Accounts */
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const [accountdata, setaccountdata] = useState([]);
  const [selectedaccount, setSelectedaccount] = useState(null);
  const [errorTooltip, setErrorTooltip] = useState("");
  const handleAccountChange = (selectedOptions) => {
    setSelectedaccount(selectedOptions);
    console.log("aacounts", selectedOptions);

    fetchJobList(selectedOptions.value); // Fetch jobs based on selected account ID
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  // const fetchAccountData = async () => {
  //   try {
  //     const response = await fetch(
  //       `${ACCOUNT_API}/accounts/account/accountdetailslist/true`
  //     );
  //     const data = await response.json();
  //     setaccountdata(data.accountlist);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // const fetchAccountData = async () => {
  //   try {
  //     const response = await fetch(
  //       `${ACCOUNT_API}/accounts/account/accountdetailslist/true`
  //     );
  //     const data = await response.json();

  //     const accountList = data.accountlist || [];
  //     setaccountdata(accountList);

  //     // Get accountId from cookie
  //     const accountIdFromCookie = Cookies.get("accountId");
  //     console.log("hhh", accountIdFromCookie);
  //     if (accountIdFromCookie) {
  //       const matchedAccount = accountoptions.find(
  //         (acc) => acc.value === accountIdFromCookie
  //       );
  //       console.log("macc", matchedAccount);
  //       if (matchedAccount) {
  //         setSelectedaccount(matchedAccount); // NOT [matchedAccount], just the object
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };


const fetchAccountData = async () => {
  try {
    const response = await fetch(
      `${ACCOUNT_API}/accounts/account/accountdetailslist/true`
    );
    const data = await response.json();

    const accountList = (data.accountlist || []).map(account => ({
      value: account.id,
      label: account.Name
    }));

    setaccountdata(accountList); // update the state with correct format

    // Get accountId from cookie
    const accountIdFromCookie = Cookies.get("accountId");
console.log("accountList", accountList.map(a => a.value));
console.log("accountIdFromCookie", accountIdFromCookie);


    if (accountIdFromCookie) {
      const matchedAccount = accountList.find(
        (acc) => acc.value === accountIdFromCookie
      );
    

      if (matchedAccount) {
        setSelectedaccount(matchedAccount);
      }
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


  
  const accountoptions = accountdata.map((account) => ({
    value: account.id,
    label: account.Name,
  }));

  //   *********joblist*******
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const [joblist, setJoblist] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleJobChange = async (selectedOptions) => {
    setSelectedJob(selectedOptions);
    console.log(selectedOptions.value);
  };

  const fetchJobList = async (accountId) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `${JOBS_API}/Workflow/jobs/accountjoblist/${accountId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setJoblist(result.jobList);
      })
      .catch((error) => console.error(error));
  };
  const jobsoptions = joblist.map((job) => ({
    value: job.id,
    label: job.Name,
    group: job.Pipeline,
  }));

  //   ******TASK TEMP ******
  const [taskTemplates, setTaskTemplates] = useState([]);
  const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
  const fetchTaskTemplates = async () => {
    try {
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      const response = await fetch(url);
      const data = await response.json();
      setTaskTemplates(data.TaskTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const taskTemplateOptions = taskTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));
  useEffect(() => {
    fetchTaskTemplates();
  }, []);
  const [selectedtemp, setselectedTemp] = useState(null);
  const [tempNameNew, setTempNameNew] = useState("");
  const [tagsNew, setTagsNew] = useState([]);
  const [AssigneesNew, setAssigneesNew] = useState([]);

  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("No status");
  const [StartsDateNew, setStartsDateNew] = useState(null);
  const [DueDateNew, setDueDateNew] = useState(null);

  const [subtasks, setSubtasks] = useState([]);
  const [checkedSubtasks, setCheckedSubtasks] = useState([]);
  // const [checkedSubtasks, setCheckedSubtasks] = useState(
  //   subtasks.filter((subtask) => subtask.checked).map((subtask) => subtask.id)
  // );

  // const handleCheckboxChange = (subtaskId) => {
  //   // Update only the checked state of the specific subtask being changed
  //   setSubtasks((prevSubtasks) =>
  //     prevSubtasks.map(
  //       (subtask) =>
  //         subtask.id === subtaskId
  //           ? { ...subtask, checked: !subtask.checked } // Toggle checked state for the clicked subtask
  //           : subtask // Keep other subtasks the same
  //     )
  //   );

  //   // Update checkedSubtasks to only reflect the clicked subtask's change
  //   setCheckedSubtasks((prevCheckedSubtasks) => {

  //     // If it is not checked, we add it to the checked list
  //     return [...prevCheckedSubtasks, subtaskId]; // Add if not checked
  //   });
  // };

  const handleCheckboxChange = (subtaskId) => {
    setSubtasks((prevSubtasks) =>
      prevSubtasks.map((subtask) =>
        subtask.id === subtaskId
          ? { ...subtask, checked: true } // Always set checked to true
          : subtask
      )
    );

    setCheckedSubtasks(
      (prevCheckedSubtasks) =>
        prevCheckedSubtasks.includes(subtaskId)
          ? prevCheckedSubtasks // Keep already checked items
          : [...prevCheckedSubtasks, subtaskId] // Add new checked item
    );
  };

  // // Optional: Use useEffect to log after state updates
  // useEffect(() => {
  //   console.log("Updated checkedSubtasks:", checkedSubtasks);
  //   console.log("Updated subtasks:", subtasks);
  // }, [checkedSubtasks, subtasks]);

  const handleAddSubtask = () => {
    const newId = String(subtasks.length + 1);
    setSubtasks([...subtasks, { id: newId, text: "" }]);
  };

  const handleDragEnd = (result) => {
    // Ensure a valid drop location
    if (!result.destination) return;

    // Reorder subtasks based on the drag-and-drop result
    const newSubtasks = Array.from(subtasks);
    const [reorderedItem] = newSubtasks.splice(result.source.index, 1);
    newSubtasks.splice(result.destination.index, 0, reorderedItem);

    // Update the state with the new order of subtasks
    setSubtasks(newSubtasks);
  };

  const handleInputChange = (id, value) => {
    setSubtasks(
      subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, text: value } : subtask
      )
    );
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

  const [SubtaskSwitch, setSubtaskSwitch] = useState(false);
  const handleSubtaskSwitch = (checked) => {
    setSubtaskSwitch(checked);
  };

  const handleStartDateChange = (date) => {
    setStartsDateNew(date);
  };
  const handleDueDateChange = (date) => {
    setDueDateNew(date);
  };

  const handlePriorityChange = (priority) => {
    setPriority(priority);
  };
  const handleStatusChange = (status) => {
    setStatus(status);
    console.log(status);
  };
  // const [description, setDescription] = useState('');
  const handleEditorChange = (content) => {
    setTaskDescription(content);
  };
  const [taskDiscription, setTaskDescription] = useState();
  const [combinedValues, setCombinedValues] = useState();
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
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
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));
  // const handleuserChange = (event, newValue) => {
  //   setAssigneesNew(newValue);
  //   // Map selected options to their values and send as an array
  //   const selectedValues = newValue.map((option) => option.value);
  //   // console.log(selectedValues);
  //   setCombinedValues(selectedValues);
  // };
  const [selectedUser, setSelectedUser] = useState([]);
  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    console.log(newSelectedUsers);
    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedValues(selectedValues);
    console.log(selectedValues);
  };
  //Tag FetchData ================
  const [tags, setTags] = useState([]);
  const [combinedTagsValues, setCombinedTagsValues] = useState();
  useEffect(() => {
    fetchTagData();
  }, []);

  const fetchTagData = async () => {
    try {
      const url = ` ${TAGS_API}/tags/`;

      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);
      //   console.log(data.tags)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //  for tags
  const calculateWidth = (tagName) => {
    const baseWidth = 10; // base width for each tag
    const charWidth = 8; // approximate width of each character
    const padding = 10; // padding on either side
    return baseWidth + charWidth * tagName.length + padding;
  };
  const tagsoptions = tags.map((tag) => ({
    value: tag._id,
    label: tag.tagName,
    colour: tag.tagColour,

    customStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      borderRadius: "8px",
      alignItems: "center",
      textAlign: "center",
      marginBottom: "5px",
      padding: "2px,8px",
      fontSize: "10px",
      width: `${calculateWidth(tag.tagName)}px`,
      margin: "7px",
      cursor: "pointer",
    },
    customTagStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      alignItems: "center",
      textAlign: "center",
      padding: "2px,8px",
      fontSize: "10px",
      cursor: "pointer",
    },
  }));

  const handleTagChange = (newSelectedTags) => {
    setTagsNew(newSelectedTags);
    console.log(newSelectedTags);
    const selectedValues = newSelectedTags.map((option) => option.value);
    setCombinedTagsValues(selectedValues);
    console.log(selectedValues);
  };

  const [tempvalues, setTempValues] = useState();

  const handletemp = async (event, newValue) => {
    setselectedTemp(newValue);
    if (newValue && newValue.value) {
      const templateId = newValue.value;
      try {
        const response = await fetch(
          `${TASK_API}/workflow/tasks/tasktemplate/tasktemplatebyid/${templateId}`
        );
        const data = await response.json();

        console.log("tasktemp", data);

        if (
          data.taskTemplate &&
          Array.isArray(data.taskTemplate.taskassignees)
        ) {
          // Flatten the array in case of unnecessary nesting
          const flatAssignees = data.taskTemplate.taskassignees.flat();

          if (flatAssignees.length > 0) {
            const assigneesData = flatAssignees.map((assignee) => ({
              value: assignee._id,
              label: assignee.username,
            }));

            setSelectedUser(assigneesData);

            const selectedValues = assigneesData.map((option) => option.value);
            setCombinedValues(selectedValues);
          } else {
            console.log("taskassignees contains an unexpected structure.");
          }
        }
        // Process tasktags
        if (
          data.taskTemplate.tasktags &&
          Array.isArray(data.taskTemplate.tasktags)
        ) {
          const tagsData = data.taskTemplate.tasktags.map((tag) => ({
            value: tag._id,
            label: tag.tagName,
            color: tag.tagColour, // Include color if needed
            customTagStyle: {
              backgroundColor: tag.tagColour,
              color: "#fff",
              borderRadius: "30px",
              alignItems: "center",
              textAlign: "center",
              marginBottom: "5px",
              padding: "2px,8px",
              fontSize: "10px",
              // width: ${calculateWidth(tag.tagName)}px,
              margin: "7px",
              cursor: "pointer",
            },
          }));
          // console.log("Tags Data:", tagsData); // Log the processed tagsData

          setTagsNew(tagsData); // Assuming you have a setTags function to update your state
          const selectedTagsValues = tagsData.map((option) => option.value);
          setCombinedTagsValues(selectedTagsValues);
          console.log("Tags Data:", selectedTagsValues);
        } else {
          console.log("tasktags is not defined or not an array.");
        }

        setTempValues(data.taskTemplate);
        tempallvalue();

        // Extract and process subtasks
        if (
          data.taskTemplate.subtasks &&
          Array.isArray(data.taskTemplate.subtasks)
        ) {
          const subtasksText = data.taskTemplate.subtasks.map(
            (subtask) => subtask.text
          );
          console.log("Subtasks Text:", subtasksText); // Log the extracted subtasks text

          setSubtasks(subtasksText); // Assuming you have a state setter for this
        } else {
          console.log("subtasks is not defined or not an array.");
        }
      } catch (error) {
        console.error("Error fetching template data:", error);
      }
    }
  };
  useEffect(() => {
    if (tempvalues) {
      tempallvalue();
    }
  }, [tempvalues]);
  const tempallvalue = () => {
    if (tempvalues) {
      console.log(tempvalues);
      setTempNameNew(tempvalues.templatename || "");
      setStatus(tempvalues.status || "");
      setTaskDescription(tempvalues.description || "");
      setPriority(tempvalues.priority || "");

      setStartsDateNew(dayjs(tempvalues.startdate) || null);
      setDueDateNew(dayjs(tempvalues.enddate) || null);

      setSubtaskSwitch(tempvalues.issubtaskschecked || false);
      // console.log(tempvalues.isclienttaskchecked)
      setSubtasks(tempvalues.subtasks);
    }
  };

  const navigate = useNavigate();

  const createTask = async () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const subtaskData = subtasks.map(({ id, text }) => ({
      id,
      text,
      checked: checkedSubtasks.includes(id),
    }));
    console.log(subtaskData);
    const raw = JSON.stringify({
      accounts: selectedaccount?.value,
      job: selectedJob?.value,
      templatename: selectedtemp?.value,
      taskname: tempNameNew,
      status: status,
      taskassignees: combinedValues,
      priority: priority,
      description: taskDiscription,
      tasktags: combinedTagsValues,
      issubtaskschecked: SubtaskSwitch,
      startdate: StartsDateNew,
      enddate: DueDateNew,
      subtasks: subtaskData,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${ACCOUNT_TASKS_API}/accountstasks/newtask`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("Task Created successfully");
        handleClose();
        handleDrawerClose();
        navigate("/tasks/pending");
      })
      .catch((error) => console.error(error));
  };
  return (
    <>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding={1.5}
        >
          <Typography variant="h6">Create Task</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ padding: "0 10px", height: "83vh", overflowY: "auto" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box mt={2}>
              <Box>
                <InputLabel sx={{ color: "black" }}>Accounts</InputLabel>

                <Autocomplete
                  options={accountoptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedaccount}
                  // onChange={handleAccountChange}
                  onChange={(event, newValue) => handleAccountChange(newValue)}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      {...props}
                      sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                    >
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Account"
                      variant="outlined"
                      size="small"
                      sx={{ backgroundColor: "#fff" }}
                    />
                  )}
                  sx={{ width: "100%", marginTop: "8px" }}
                />
              </Box>
              <Box mt={2}>
                <InputLabel sx={{ color: "black" }}>Job</InputLabel>
                <Autocomplete
                  options={jobsoptions}
                  groupBy={(option) => option.group} // Group by pipeline name
                  value={selectedJob}
                  disabled={!selectedaccount}
                  onChange={(event, newValue) => handleJobChange(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Job"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  getOptionLabel={(option) => option.label}
                  sx={{ width: "100%", mt: 1 }}
                />
              </Box>
              <Box mt={2}>
                <InputLabel sx={{ color: "black" }}>Template</InputLabel>
                <Autocomplete
                  options={taskTemplateOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedtemp}
                  onChange={handletemp}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      {...props}
                      sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                    >
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <>
                      <TextField
                        {...params}
                        // helperText={templateError}
                        sx={{ backgroundColor: "#fff" }}
                        placeholder="Select Template"
                        variant="outlined"
                        size="small"
                      />
                    </>
                  )}
                  sx={{ width: "100%", marginTop: "8px" }}
                  clearOnEscape // Enable clearable functionality
                />
              </Box>

              <Box sx={{ width: "100%", mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} pr={3}>
                    <Box>
                      <InputLabel sx={{ color: "black" }}>
                        Task Assignee
                      </InputLabel>
                      {/* <Autocomplete
                        multiple
                        sx={{ mt: 2 }}
                        options={options}
                        size="small"
                        getOptionLabel={(option) => option.label}
                        value={AssigneesNew}
                        onChange={handleuserChange}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                          >
                            {option.label}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Assignees"
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                      /> */}
                      <MultiSelectDropdown
                        value={selectedUser}
                        onChange={handleUserChange}
                        placeholder="Assignees"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Status
                        onStatusChange={handleStatusChange}
                        selectedStatus={status}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ width: "100%", mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <label className="task-input-label">Template Name</label>
                      <TextField
                        fullWidth
                        name="TemplateName"
                        placeholder="Template Name"
                        size="small"
                        margin="normal"
                        sx={{ background: "#fff" }}
                        onChange={(e) => setTempNameNew(e.target.value)}
                        value={tempNameNew}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Priority
                        onPriorityChange={handlePriorityChange}
                        selectedPriority={priority}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ mt: 2, mb: 7 }}>
                <InputLabel sx={{ color: "black", mb: 2 }}>
                  Description
                </InputLabel>
                <Editor
                  initialContent={taskDiscription}
                  onChange={handleEditorChange}
                />
              </Box>
              <Box mt={2} mr={1}>
                <InputLabel sx={{ color: "black", mb: 1 }}>Tags</InputLabel>
                {/* <FormControl sx={{ width: "100%" }}>
                  <Select
                    multiple
                    size="small"
                    id="tags-outlined"
                    value={combinedTagsValues}
                    onChange={handleTagChange}
                    input={<OutlinedInput />}
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <span style={{ color: "#aaa" }}>Select tags...</span>
                        );
                      }
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "6px",
                            padding: "6px",
                          }}
                        >
                          {selected.map((value) => {
                            const option = tagsoptions.find(
                              (opt) => opt.value === value
                            );
                            return (
                              <Chip
                                key={value}
                                label={option?.label}
                                sx={{
                                  backgroundColor: option?.colour,
                                  color: "#fff",
                                  fontWeight: 500,
                                  fontSize: "10px",
                                  borderRadius: "16px",
                                  height: "20px",
                                  cursor: "pointer",
                                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                }}
                              />
                            );
                          })}
                        </Box>
                      );
                    }}
                    MenuProps={{
                      PaperProps: {
                        style: { maxHeight: 250 },
                      },
                    }}
                    sx={{
                      borderRadius: "10px",
                      "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                    }}
                  >
                    {tagsoptions.map((option) => {
                      const dynamicWidth = Math.min(
                        option.label.length * 8 + 16,
                        150
                      );
                      return (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          sx={{
                            backgroundColor: option.colour,
                            color: "#fff",
                            fontSize: "10px",
                            borderRadius: "10px",
                            margin: "5px",
                            textAlign: "center",
                            padding: "4px 9px",
                            minWidth: `${dynamicWidth}px`,
                            maxWidth: `${dynamicWidth}px`,
                            "&:hover": {
                              backgroundColor: option.colour,
                              color: "#fff",
                            },
                          }}
                        >
                          {option.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl> */}
                <TagsMultiSelectDropDown
                  value={tagsNew}
                  onChange={handleTagChange}
                  placeholder="Tags"
                />
              </Box>
              <Box mt={2}>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <Typography className="task-input-label">
                    Start Date
                  </Typography>
                  <DatePicker
                    format="DD/MM/YYYY"
                    sx={{ width: "100%", backgroundColor: "#fff" }}
                    value={StartsDateNew}
                    onChange={handleStartDateChange}
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <Typography className="task-input-label">Due Date</Typography>
                  <DatePicker
                    format="DD/MM/YYYY"
                    sx={{ width: "100%", backgroundColor: "#fff" }}
                    value={DueDateNew}
                    onChange={handleDueDateChange}
                    renderInput={(params) => (
                      <TextField {...params} size="small" />
                    )}
                  />
                </Box>
              </Box>
              <Box mt={2}>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6">Subtasks</Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          onChange={(event) =>
                            handleSubtaskSwitch(event.target.checked)
                          }
                          checked={SubtaskSwitch}
                          color="primary"
                        />
                      }
                    />
                  </Box>

                  {SubtaskSwitch && (
                    <Droppable droppableId="subtaskList">
                      {(provided) => (
                        <div
                          className="subtask-input"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {(subtasks.length > 0
                            ? subtasks
                            : [{ id: "default", text: "" }]
                          ).map((subtask, index) => (
                            <Draggable
                              key={subtask.id}
                              draggableId={subtask.id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Box
                                    display="flex"
                                    gap="30px"
                                    alignItems="center"
                                  >
                                    <Checkbox
                                      style={{ cursor: "pointer" }}
                                      // checked={checkedSubtasks.includes(subtask.id)}
                                      checked={subtask.checked}
                                      onChange={() =>
                                        handleCheckboxChange(subtask.id)
                                      }
                                    />
                                    <TextField
                                      placeholder="Things To do"
                                      value={subtask.text}
                                      size="small"
                                      margin="normal"
                                      fullWidth
                                      onChange={(e) =>
                                        handleInputChange(
                                          subtask.id,
                                          e.target.value
                                        )
                                      }
                                      variant="outlined"
                                    />
                                    <IconButton
                                      onClick={() =>
                                        handleDeleteSubtask(subtask.id)
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      <RiDeleteBin6Line />
                                    </IconButton>
                                    <IconButton style={{ cursor: "move" }}>
                                      <PiDotsSixVerticalBold />
                                    </IconButton>
                                  </Box>
                                </div>
                              )}
                            </Draggable>
                          ))}

                          {provided.placeholder}
                          <Box
                            sx={{ cursor: "pointer" }}
                            onClick={handleAddSubtask}
                            style={{ margin: "10px", color: "#1976d3" }}
                          >
                            <FiPlusCircle /> Add Subtasks
                          </Box>
                        </div>
                      )}
                    </Droppable>
                  )}
                </DragDropContext>
              </Box>
            </Box>
          </LocalizationProvider>
        </Box>
        <Box mt={2} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button onClick={handleClose}>
            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {" "}
              <IoChevronBackOutline />
              Back
            </Typography>
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "var(--color-save-btn)", // Normal background

              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)", // Hover background color
              },
              borderRadius: "15px",
            }}
            onClick={createTask}
          >
            Create Task
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default AccountTask;
