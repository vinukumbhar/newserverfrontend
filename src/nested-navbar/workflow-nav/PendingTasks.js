import React, { useState, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Paper,
  TableRow,
  Checkbox,
  MenuItem,
  IconButton,
  Menu,
  Typography,Button
} from "@mui/material";
import { toast } from "react-toastify";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NewTaskDrawer from "../../Tasks/NewTaskDrawer";
import { useParams } from "react-router-dom";
const PendingTasks = () => {
    const { data } = useParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const onclose =()=>{
    setDrawerOpen(false)
    fetchTasksData(data)
   }
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTaskData, setSelectedTaskData] = useState(null);
  const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;
  const [taskData, setTasksData] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [selected, setSelected] = useState([]);
  const handleSelect = (id) => {
    const currentIndex = selected.indexOf(id);
    const newSelected =
      currentIndex === -1
        ? [...selected, id]
        : selected.filter((item) => item !== id);
    setSelected(newSelected);
    // Log all selected row IDs
    // console.log("Selected IDs:", newSelected); // Log all selected IDs
  };
  
  const fetchTasksData = (data) => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${ACCOUNT_TASKS_API}/accountstasks/tasks/taskslist/byaccount/${data}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const formattedTasks = result.taskList.map((task) => ({
          ...task,
          startDate: task.StartDate
            ? new Date(task.StartDate).toLocaleDateString("en-GB")
            : "",
          dueDate: task.EndDate
            ? new Date(task.EndDate).toLocaleDateString("en-GB")
            : "",
          description: task.Description.replace(/<[^>]+>/g, ""), // Remove HTML tags
        }));

        console.log(formattedTasks);
        setTasksData(formattedTasks);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchTasksData(data);
  }, [data]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(id);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  const handleDelete = () => {
    handleClose();
    handleDeleteTask(selectedTask);
    console.log("Deleted:", selectedTask);
  };
  const handleDeleteTask = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected tasks? This action cannot be undone."
    );
    if (isConfirmed) {
      try {
        // Make delete requests for each selected job
        await Promise.all(
          selected.map((id) =>
            fetch(`${ACCOUNT_TASKS_API}/accountstasks/taskdelete/` + id, {
              method: "DELETE",
              redirect: "follow",
            })
          )
        );

        // Optionally, you can remove the deleted jobs from the UI (if needed)
        // If you're using jobData in state, for example:
        // setJobData((prevJobs) => prevJobs.filter((job) => !selected.includes(job.id)));

        toast.success("task deleted successfully!");
        setSelected([]); // Clear the selected jobs
        fetchTasksData(data); // Refresh the data after deletion
      } catch (error) {
        console.error("Delete API Error:", error);
        toast.error("Failed to delete selected jobs");
      }
    }
  };

  const statusOptions = [
    { value: "No status", label: "No status", color: "#C4AEAD" },
    { value: "Planned", label: "Planned", color: "#4169E1" },
    { value: "In review", label: "In review", color: "#F6BE00" },
    { value: "In progress", label: "In progress", color: "#F6BE00" },
    { value: "On hold", label: "On hold", color: "#BCC6CC" },
    { value: "Extended", label: "Extended", color: "#82CAFF" },
    {
      value: "Waiting for Client",
      label: "Waiting for Client",
      color: "#566D7E",
    },
    {
      value: "Waiting for Signatures",
      label: "Waiting for Signatures",
      color: "#566D7E",
    },
    {
      value: "Waiting for agency",
      label: "Waiting for agency",
      color: "#566D7E",
    },
    { value: "Completed", label: "Completed", color: "#00FF00" },
    { value: "Canceled", label: "Canceled", color: "#EB5406" },
  ];

  const priorityOptions = [
    { value: "Urgent", label: "Urgent", color: "#0E0402" },
    { value: "High", label: "High", color: "#fe676e" },
    { value: "Medium", label: "Medium", color: "#FFC300" },
    { value: "Low", label: "Low", color: "#56c288" },
  ];


  // const handleClick = (id) => {
  // console.log(id)
  // };
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const handleClick = async (id) => {
    
    try {
      const response = await fetch(`${ACCOUNT_API}/accountstasks/task/listbyid/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch task data");
      }
  
      const taskToEdit = await response.json(); // Assuming response is JSON
      setSelectedTaskData(taskToEdit);
      handleClose()
      setIsEditMode(true);
      setDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };
  

  return (
    <Box>


      <Box mt={2}>
      <TableContainer component={Paper}>
        <Table style={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell
                padding="checkbox"
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                  background: "#fff",
                  fontSize: "2px", // Set a professional font size
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                <Checkbox
                  checked={selected.length === taskData.length}
                  onChange={() => {
                    if (selected.length === taskData.length) {
                      setSelected([]);
                    } else {
                      const allSelected = taskData.map((item) => item.id);
                      setSelected(allSelected);
                    }
                  }}
                />
              </TableCell>
              <TableCell
                style={{
                  cursor: "pointer",
                  position: "sticky",
                  left: 50,
                  zIndex: 1,
                  background: "#fff",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px", // Add more padding for better spacing
                }}
                width="200"
              >
                Name
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="200"
              >
                Account
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="200"
              >
                Assignee
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Status
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Priority
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Subtasks
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Start Date
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Due Date
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="250"
              >
                Job Name
              </TableCell>

              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="200"
                height="60"
              >
                Pipeline
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="150"
              >
                Stage
              </TableCell>

              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Tags
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="250"
              >
                Description
              </TableCell>
              <TableCell
                
                style={{
                  position: "sticky",
                  right: 0, // Stick to the right side
                  zIndex: 2, // Ensure it appears above other elements
                  background: "#fff",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Settings
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {taskData.map((row) => {
              const isSelected = selected.indexOf(row.id) !== -1;
              return (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => handleSelect(row.id)}
                  role="checkbox"
                  tabIndex={-1}
                  selected={isSelected}
                  style={{
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#f4f4f4", // Add hover effect
                    },
                  }}
                >
                  <TableCell
                    padding="checkbox"
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      background: "#fff",
                      fontSize: "12px",
                      textAlign: "center",
                      padding: "4px 8px",
                      lineHeight: "1",
                      // padding: "2px", // Adjust padding for better spacing
                    }}
                  >
                    <Checkbox checked={isSelected} />
                  </TableCell>
                  <TableCell
                    style={{
                      position: "sticky",
                      left: 50,
                      zIndex: 1,
                      background: "#fff",
                      fontSize: "12px",
                      fontWeight: "normal",
                      // padding: "12px 16px", // Add padding for better spacing
                    }}
                  >
                    <span
                      style={{ cursor: "pointer", color: "#3f51b5" }}
                      // onClick={() => handleClick(row.id)}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click action when clicking on name
                        handleClick(row.id);
                      }}
                    >
                      {row.Name}
                    </span>
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    {row.AccountName}
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    {row.Assignees}
                  </TableCell>
                 
                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    {row.Status && (
                      <span
                        style={{
                          display: "inline-block",
                          backgroundColor:
                            statusOptions.find(
                              (status) => status.value === row.Status
                            )?.color || "#ccc",
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: "10px",
                          fontSize: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        {row.Status}
                      </span>
                    )}
                  </TableCell>
                  {/* <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >{row.Priority}</TableCell> */}
                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    {row.Priority && (
                      <span
                        style={{
                          display: "inline-block",
                          backgroundColor:
                            priorityOptions.find(
                              (priority) => priority.value === row.Priority
                            )?.color || "#ccc",
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: "10px",
                          fontSize: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        {row.Priority}
                      </span>
                    )}
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    {row.SubtaskCount}
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    {row.startDate}
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    {row.dueDate}
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    {row.JobName}
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    {row.PipelineName}
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    {row.StageNames}
                  </TableCell>
                  {/* <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                  {row.TaskTags && row.TaskTags.length > 0 ? (
                    row.TaskTags.map((tag) => (
                      <span
                        key={tag.id}
                        style={{
                          display: "inline-block",
                          backgroundColor: tag.tagColour,
                          color: "#fff",
                          padding: "4px 8px",
                          borderRadius: "8px",
                          marginRight: "4px",
                          fontSize: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        {tag.tagName}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: "#888" }}>No Tags</span>
                  )}
                </TableCell> */}
                  {/* <TableCell
  style={{
    fontSize: "12px",
    padding: "4px 8px",
    lineHeight: "1",
  }}
>
  {row.TaskTags && row.TaskTags.length > 0 ? (
    <>
      <span
        key={row.TaskTags[0].id}
        style={{
          display: "inline-block",
          backgroundColor: row.TaskTags[0].tagColour,
          color: "#fff",
          padding: "4px 8px",
          borderRadius: "8px",
          marginRight: "4px",
          fontSize: "10px",
          fontWeight: "bold",
        }}
      >
        {row.TaskTags[0].tagName}
      </span>

      {row.TaskTags.length > 1 && (
        <Tooltip
          title={row.TaskTags
            .slice(1)
            .map((tag) => tag.tagName)
            .join(", ")}
          arrow
          placement="top"
        >
          <span
            style={{
              display: "inline-block",
              backgroundColor: "#ddd",
              color: "#333",
              padding: "4px 8px",
              borderRadius: "8px",
              fontSize: "10px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            +{row.TaskTags.length - 1}
          </span>
        </Tooltip>
      )}
    </>
  ) : (
    <span style={{ color: "#888" }}>No Tags</span>
  )}
</TableCell> */}
                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    {row.TaskTags && row.TaskTags.length > 0 ? (
                      <>
                        {/* Display First Tag */}
                        <span
                          key={row.TaskTags[0].id}
                          style={{
                            display: "inline-block",
                            backgroundColor: row.TaskTags[0].tagColour,
                            color: "#fff",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            marginRight: "4px",
                            fontSize: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          {row.TaskTags[0].tagName}
                        </span>

                        {/* Tooltip for Remaining Tags */}
                        {row.TaskTags.length > 1 && (
                          <Tooltip
                            arrow
                            placement="top"
                            title={
                              <div>
                                {row.TaskTags.slice(1).map((tag) => (
                                  <Typography
                                    key={tag.id}
                                    sx={{
                                      backgroundColor: tag.tagColour,
                                      color: "#fff",
                                      padding: "4px 8px",
                                      borderRadius: "8px",
                                      fontSize: "10px",
                                      fontWeight: "bold",
                                      display: "block",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    {tag.tagName}
                                  </Typography>
                                ))}
                              </div>
                            }
                          >
                            <span
                              style={{
                                display: "inline-block",
                                backgroundColor: "#ddd",
                                color: "#333",
                                padding: "4px 8px",
                                borderRadius: "8px",
                                fontSize: "10px",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                            >
                              +{row.TaskTags.length - 1}
                            </span>
                          </Tooltip>
                        )}
                      </>
                    ) : (
                      <span style={{ color: "#888" }}>No Tags</span>
                    )}
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    {row.description}
                  </TableCell>
                  <TableCell
                    // style={{
                    //   fontSize: "12px",
                    //   padding: "4px 8px",
                    //   lineHeight: "1",
                    // }}
                    style={{
                      position: "sticky",
                      right: 0, // Stick to the right side
                      zIndex: 1, // Keep it above the table content
                      background: "#fff",
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    <IconButton
                      onClick={(event) => handleMenuClick(event, row.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl && selectedTask === row.id)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={() => handleClick(row.id)}>Edit</MenuItem>
                      <MenuItem onClick={handleDelete}>Delete</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
      <NewTaskDrawer
  open={drawerOpen}
  onClose={onclose}
  fetchTasksData={fetchTasksData}
  isEditMode={isEditMode}
  taskData={selectedTaskData}
/>
    </Box>
  );
};

export default PendingTasks;
