import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { format, formatDistanceToNow } from "date-fns";
import {
  Menu,
  Switch,
  FormControlLabel,
  InputLabel,
  InputAdornment,
  Button,
  Box,
  Typography,
  Drawer,
  Chip,
  Divider,
  Stack,
  Select,
  MenuItem,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMediaQuery } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Autocomplete, TextField } from "@mui/material";
import { MRT_TableHeadCellFilterContainer } from "material-react-table";
import { useTheme } from "@mui/material/styles";
import Priority from "../Templates/Priority/Priority";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Editor from "../Templates/Texteditor/Editor";
import UpdateJob from "./UpdateJob";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  // Paper,
  // IconButton,
  // Menu,
  // MenuItem,
  Checkbox,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { GoDotFill } from "react-icons/go";
const Example = ({ charLimit = 4000 }) => {
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
  // const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const [jobData, setJobData] = useState([]);
  const [isActiveTrue, setIsActiveTrue] = useState(true);

  const [activeButton, setActiveButton] = useState("active");

  const handleActiveClick = () => {
    setIsActiveTrue(true);
    setActiveButton("active");
    fetchData(true);
    console.log("Active action triggered.");
  };
  const handleArchivedClick = () => {
    setIsActiveTrue(false);
    setActiveButton("archived");
    fetchData(false);
    console.log("Archive action triggered.");
  };
  useEffect(() => {
    fetchData(isActiveTrue);
  }, [isActiveTrue]);
  const fetchData = async (isActive) => {
    try {
      const jobListResponse = await axios.get(
        `${JOBS_API}/workflow/jobs/job/joblist/list/${isActive}`
      );
      const formattedData = jobListResponse.data.jobList.map((job) => ({
        ...job,
        // StartDate: format(new Date(job.StartDate), "MMMM dd, yyyy"),
        // DueDate: format(new Date(job.DueDate), "MMMM dd, yyyy"),
        StartDate: job.StartDate
          ? format(new Date(job.StartDate), "MMMM dd, yyyy")
          : "",
        DueDate: job.DueDate
          ? format(new Date(job.DueDate), "MMMM dd, yyyy")
          : "",
        updatedAt: formatDistanceToNow(new Date(job.updatedAt), {
          addSuffix: true,
        }),
        JobAssignee: Array.isArray(job.JobAssignee)
          ? job.JobAssignee.join(", ")
          : job.JobAssignee,
        // clientfacingstatus: job.ClientFacingStatus?.statusName,
        clientfacingstatus: {
          statusName: job.ClientFacingStatus?.statusName || "",
          statusColor: job.ClientFacingStatus?.statusColor || "", // default color if undefined
        },
      }));
      setJobData(formattedData);
      console.log(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Define the filter function

  // account
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const [accountData, setAccountData] = useState([]);

  useEffect(() => {
    fetchAccountData();
  }, []);

  const fetchAccountData = async () => {
    try {
      const response = await fetch(`${ACCOUNT_API}/accounts/accountdetails`);
      const data = await response.json();
      setAccountData(data.accounts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Create account options
  const accountOptions = accountData.map((account) => ({
    value: account._id,
    label: account.accountName,
  }));

  // pipeline
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const [pipelineData, setPipelineData] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [piplineid, setPipelineId] = useState();
  const [pipelineIdData, setPipelineIdData] = useState();
  const [stages, setstages] = useState();

  useEffect(() => {
    fetchPipelineDataid();
  }, []);

  const fetchPipelineDataid = async (piplineid) => {
    try {
      const response = await fetch(
        `${PIPELINE_API}/workflow/pipeline/pipeline/${piplineid}`
      );
      const data = await response.json();

      setPipelineIdData(data.pipeline);

      if (data.pipeline && data.pipeline.stages) {
        const stagesdata = data.pipeline.stages.map((stage) => ({
          value: stage._id,
          label: stage.name,
        }));
        setstages(stagesdata);
        setSelectedstage(stagesdata[0]);
        console.log(stagesdata);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchPipelineData();
  }, []);

  const fetchPipelineData = async () => {
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipelines`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch pipeline data");
      }
      const data = await response.json();
      setPipelineData(data.pipeline || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const optionpipeline = pipelineData.map((pipeline) => ({
    value: pipeline._id,
    label: pipeline.pipelineName,
  }));

  const handlePipelineChange = (selectedOptions) => {
    setSelectedPipeline(selectedOptions);
    fetchPipelineDataid(selectedOptions.value);
  };

  // const [selectedStage, setSelectedStage] = useState(null);
  const [stagesoptions, setStagesOptions] = useState([]);
  const [selectedstage, setSelectedstage] = useState("");
  const handleStageChange = (selectedOptions) => {
    setSelectedstage(selectedOptions);
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const handlePriorityChange = (priority) => {
    setPriority(priority);
  };
  const handleEditorChange = (content) => {
    setDescription(content);
  };

  //Tag FetchData ================
  const [tags, setTags] = useState([]);
  const [combinedTagsValues, setCombinedTagsValues] = useState([]);
  useEffect(() => {
    fetchTagData();
  }, []);

  const fetchTagData = async () => {
    try {
      const response = await fetch(`${TAGS_API}/tags/`);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //  for tags
  const calculateWidth = (label) => {
    const textWidth = label.length * 8;
    return Math.min(textWidth, 200);
  };
  const calculateWidthOptions = (label) =>
    `${Math.max(label.length * 8, 90)}px`;
  const tagoptions = tags.map((tag) => ({
    value: tag._id,
    label: tag.tagName,
    colour: tag.tagColour,

    customTagStyle: {
      backgroundColor: tag.tagColour,
      color: "#fff",
      borderRadius: "8px",
      alignItems: "center",
      textAlign: "center",
      marginBottom: "5px",
      padding: "2px,8px",

      fontSize: "10px",
      // width: `${calculateWidth(tag.tagName)}px`,
      margin: "7px",
    },
  }));

  const [selectedTags, setSelectedTags] = useState([]);
  const [dataAccountjob, setDataAccountjob] = useState();

  const handleTagChange = (event, newValue) => {
    setSelectedTags(newValue); // Keep the full tag objects

    // Send only the values to your backend
    const tagValues = newValue.map((option) => option.value);
    console.log("Selected Values:", tagValues);

    // Assuming setCombinedTagsValues is a function to send the values to your backend
    setCombinedTagsValues(tagValues);
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  const [userData, setUserData] = useState([]);
  const [selecteduser, setSelectedUser] = useState();
  const [combinedValues, setCombinedValues] = useState([]);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchUserData = async () => {
    try {
      const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
      const response = await fetch(url);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const useroptions = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));
  const handleUserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setCombinedValues(selectedValues);
  };
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleDueDateChange = (date) => {
    setDueDate(date);
  };
  const [accountId, setAccountId] = useState();
  const [jobid, setjobid] = useState();
  const handleClick = async (id) => {
    console.log(id);
    setjobid(id);
    try {
      const url = `${JOBS_API}/workflow/jobs/job/joblist/listbyid/${id}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setSelectedJob(data.jobList);
      console.log(data.jobList);

      if (data.jobList && data.jobList.Pipeline) {
        const pipelineData = {
          value: data.jobList.Pipeline._id,
          label: data.jobList.Pipeline.Name,
        };
        setSelectedPipeline(pipelineData);
        console.log(pipelineData);
        setPipelineId(data.jobList.Pipeline._id);
        console.log(data.jobList.Pipeline._id);
        fetchPipelineDataid(data.jobList.Pipeline._id);
      }
      setDueDate(dayjs(data.jobList.DueDate) || null);
      // (dayjs(tempvalues.startdate) || null)
      setStartDate(dayjs(data.jobList.StartDate) || null);
      // if (data.jobList && data.jobList.Stage) {
      //   const stageData = {
      //     value: data.jobList.Stage._id,
      //     label: data.jobList.Stage.name,
      //   };
      //   setSelectedstage(stageData);
      // }
      setPriority(data.jobList.Priority);
      setDescription(data.jobList.Description);
      setClientFacingStatus(data.jobList.ShowinClientPortal);
      setInputText(data.jobList.jobClientName);
      setClientDescription(data.jobList.ClientFacingDecription);
      if (data.jobList.ClientFacingStatus && data.jobList.ClientFacingStatus) {
        const clientStatusData = {
          value: data.jobList.ClientFacingStatus._id,
          label: data.jobList.ClientFacingStatus.clientfacingName,
          clientfacingColour:
            data.jobList.ClientFacingStatus.clientfacingColour,
        };

        setSelectedjob(clientStatusData);
      }

      if (data.jobList && data.jobList.Account) {
        setDataAccountjob(data.jobList.Account[0].accountName);
      }

      if (data.jobList && data.jobList.Account) {
        console.log(data.jobList.Account[0]._id);
        setAccountId(data.jobList.Account[0]._id);
        console.log(data.jobList.Account[0].tags);
        const tagOptions = data.jobList.Account[0].tags
          .flatMap((tagArray) => tagArray)
          .map((tag) => ({
            value: tag._id,
            label: tag.tagName,
            colour: tag.tagColour,
          }));
        setSelectedTags(tagOptions);
        console.log(tagOptions);
      }
      if (data.jobList && data.jobList.Account) {
        const tags = data.jobList.Account[0].tags.map((tag) => ({
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
            // width: `${calculateWidth(tag.tagName)}px`,
            margin: "7px",
          },
        }));

        // setSelectedTags(tags);
        console.log(tags);
      }
      if (data.jobList && data.jobList.JobAssignee) {
        const assigneesData = data.jobList.JobAssignee.map((assignee) => ({
          value: assignee._id,
          label: assignee.username,
        }));

        setSelectedUser(assigneesData);
        const selectedValues = assigneesData.map((option) => option.value);
        setCombinedValues(selectedValues);
      }

      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // console.log(selectedTags)
  const handleSubmit = (id) => {
    // setjobid(id);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      active: !isActiveTrue,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${JOBS_API}/workflow/jobs/job/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // console.log(result.updatedAccount); // Log the result
        // setAccountId(result.updatedAccount._id);
        toast.success("Job updated successfully"); // Display success toast
      })
      .catch((error) => {
        console.error(error); // Log the error
        toast.error("An error occurred while submitting the form"); // Display error toast
      });
  };
  const handleDelete = () => {
    handleClose();
    handleDeleteJob(selectedJob);
    console.log("Deleted:", selectedJob);
  };
  // const handleDeleteJob = (id) => {
  //   console.log(id);
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this job? This action cannot be undone."
  //   );
  //   if (!confirmDelete) return;
  //   setjobid(id);
  //   const requestOptions = {
  //     method: "DELETE",
  //     redirect: "follow",
  //   };

  //   fetch(`${JOBS_API}/workflow/jobs/job/` + id, requestOptions)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Failed to delete item");
  //       }
  //       return response.json();
  //     })
  //     .then((result) => {
  //       // console.log(result);
  //       toast.success("Job deleted successfully");
  //       fetchData();
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       toast.error("Failed to delete item");
  //     });
  // };
  // console.log(selectedTags);

  const handleDeleteJob = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected jobs? This action cannot be undone."
    );
    if (isConfirmed) {
      try {
        // Make delete requests for each selected job
        await Promise.all(
          selected.map((id) =>
            fetch(`${JOBS_API}/workflow/jobs/job/` + id, {
              method: "DELETE",
              redirect: "follow",
            })
          )
        );

        // Optionally, you can remove the deleted jobs from the UI (if needed)
        // If you're using jobData in state, for example:
        // setJobData((prevJobs) => prevJobs.filter((job) => !selected.includes(job.id)));

        toast.success("Job deleted successfully!");
        setSelected([]); // Clear the selected jobs
        fetchData(true); // Refresh the data after deletion
      } catch (error) {
        console.error("Delete API Error:", error);
        toast.error("Failed to delete selected jobs");
      }
    }
  };
  const handleEditClick = (action) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    // Set "active" to false if "Archive" is selected, or true if "Make Active" is selected
    const raw = JSON.stringify({
      active: action === "Archive" ? false : true,
    });
  
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    // Assuming you're passing the row.id or jobId to the function to update the specific job
    fetch(`${JOBS_API}/workflow/jobs/job/${selectedJob}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        setAnchorEl(null);
        // setIsActiveTrue(action === "Archive" ? false : true);
        // setActiveButton(action === "Archive" ? "archived" : "active")
        // fetchData(action === "Archive" ? false : true);
        if (action === "Archive") {
          handleArchivedClick(); // Call the handleArchivedClick function
        } else if (action === "Make Active") {
          handleActiveClick(); // Call the handleActiveClick function
        }
        setSelectedJob(null);
      })
      .catch((error) => console.error(error));
  };
  
  // const columns = useMemo(
  //   () => [
  //     {
  //       accessorKey: "Name",
  //       header: "Name",

  //       Cell: ({ row }) => (
  //         <span style={{ cursor: "pointer", color: "blue" }} onClick={() => handleClick(row.original.id)}>
  //           {row.original.Name}
  //         </span>
  //       ),
  //     },

  //     { accessorKey: "JobAssignee", header: "Job Assignee", size: 150 },
  //     {
  //       accessorKey: "Pipeline",
  //       header: "Pipeline",
  //       size: 200,
  //     },
  //     {
  //       accessorKey: "Stage",
  //       header: "Stage",
  //       size: 150,
  //     },
  //     {
  //       accessorKey: "Account",
  //       header: "Account",
  //       size: 150,
  //     },
  //     {
  //       accessorKey: "clientfacingstatus",
  //       header: "client-facing status",
  //       size: 200,
  //       Cell: ({ row }) => {
  //         const { statusName, statusColor } = row.original.clientfacingstatus || {}; // Use default destructuring to handle undefined
  //         return (
  //           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  //             {statusName && <GoDotFill style={{ color: statusColor, fontSize: "25px" }} />}
  //             <span>{statusName}</span>
  //           </Box>
  //         );
  //       },
  //     },
  //     // clientfacingstatus
  //     {
  //       accessorKey: "StartDate",
  //       header: "Start Date",
  //       size: 150,
  //       // Cell: ({ value }) => (value === "null" ? "null" : value),
  //     },
  //     {
  //       accessorKey: "DueDate",
  //       header: "Due Date",
  //       size: 150,
  //       // Cell: ({ value }) => (value === "null" ? "null" : value),
  //     },
  //     {
  //       accessorKey: "updatedAt",
  //       header: "Time in current stage",
  //       size: 150,
  //     },
  //     {
  //       accessorKey: "Settings",
  //       header: "Settings",
  //       size: 100,
  //       Cell: ({ row }) => {
  //         const [anchorEl, setAnchorEl] = useState(null);

  //         const handleMenuClick = (event) => {
  //           setAnchorEl(event.currentTarget);
  //         };

  //         const handleClose = () => {
  //           setAnchorEl(null);
  //         };

  //         const handleArchive = () => {
  //           handleClose();
  //           handleSubmit(row.original.id);
  //           console.log("Archived:", row.original.id);
  //         };

  //         const handleDelete = () => {
  //           handleClose();
  //           handleDeleteJob(row.original.id);
  //           // Add logic to delete by ID here
  //           console.log("Deleted:", row.original.id);
  //         };

  //         return (
  //           <>
  //             <IconButton onClick={handleMenuClick}>
  //               <MoreVertIcon />
  //             </IconButton>
  //             <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
  //               <MenuItem onClick={handleArchive}>{isActiveTrue ? "Archive " : "Make Active"}</MenuItem>
  //               <MenuItem onClick={handleDelete}>Delete</MenuItem>
  //             </Menu>
  //           </>
  //         );
  //       },
  //     },
  //   ],
  //   [optionpipeline, accountOptions]
  // );

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedJob(id);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedJob(null);
  };

  // const table = useMaterialReactTable({
  //   columns,
  //   data: jobData,
  //   enableBottomToolbar: true,
  //   enableStickyHeader: true,
  //   columnFilterDisplayMode: "custom",
  //   enableRowSelection: true,
  //   enablePagination: true,
  //   muiTableContainerProps: { sx: { maxHeight: "400px" } },
  //   initialState: {
  //     columnPinning: { left: ["mrt-row-select", "Name"] },
  //   },
  //   muiTableBodyCellProps: {
  //     sx: (theme) => ({
  //       backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[50],
  //     }),
  //   },
  // });

  const handleSaveClick = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      pipeline: selectedPipeline.value,
      stageid: selectedstage.value,
      jobassignees: combinedValues,
      priority: priority.value,
      description: description,
      startdate: startDate,
      enddate: dueDate,
    });

    console.log(raw);
    // /job
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(jobid);
    fetch(`${JOBS_API}/workflow/jobs/job/` + jobid, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        // Handle success
        toast.success("Job Template updated successfully");
        // setIsDrawerOpen(false);
        fetchData();
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        toast.error("Failed to update Job Template");
      });
  };
  const handleSaveExitClick = () => {
    updatejobdata();
    handleSaveTags();
  };
  console.log(accountId);
  const handleSaveTags = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      tags: combinedTagsValues,
    });
    console.log(raw);
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${ACCOUNT_API}/accounts/accountdetails/${accountId}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        console.log(result.updatedAccount); // Log the result
      })
      .catch((error) => {
        console.error(error); // Log the error
        toast.error("An error occurred while submitting the form"); // Display error toast
      });
  };
  const handleFormClose = () => {
    setIsDrawerOpen(false);
  };
  const updatejobdata = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      pipeline: selectedPipeline.value,
      stageid: selectedstage.value,
      jobassignees: combinedValues,

      priority: priority.value,
      description: description,
      startdate: startDate,
      enddate: dueDate,
      showinclientportal: clientFacingStatus,
      jobnameforclient: inputText,
      clientfacingstatus: selectedjob?.value,
      clientfacingDescription: clientDescription,
    });

    console.log(raw);
    // /job
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(jobid);
    fetch(`${JOBS_API}/workflow/jobs/job/` + jobid, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        // Handle success
        toast.success("Job Template updated successfully");
        setIsDrawerOpen(false);
        fetchData();
      })
      .catch((error) => {
        // Handle errors
        console.error(error);
        toast.error("Failed to update Job Template");
      });
  };

  const [clientFacingStatus, setClientFacingStatus] = useState(false);
  const [selectedJobShortcut, setSelectedJobShortcut] = useState("");
  const [anchorElClientJob, setAnchorElClientJob] = useState(null);
  const [anchorElDescription, setAnchorElDecription] = useState(null);
  const [inputText, setInputText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [clientDescription, setClientDescription] = useState("");
  const [showDropdownClientJob, setShowDropdownClientJob] = useState(false);
  const [showDropdownDescription, setShowDropdownDescription] = useState(false);
  const [selectedjob, setSelectedjob] = useState(null);
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
  const fetchClientFacingJobsData = async () => {
    try {
      const response = await fetch(
        `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setClientFacingJobs(data.clientFacingJobStatues); // Ensure data is set correctly
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const optionstatus = clientFacingJobs.map((status) => ({
    value: status._id,
    label: status.clientfacingName,
    clientfacingColour: status.clientfacingColour,
  }));

  // useEffect to fetch jobs when the component mounts
  useEffect(() => {
    fetchClientFacingJobsData();
  }, []);

  const handleJobChange = async (event, newValue) => {
    setSelectedjob(newValue);

    if (newValue && newValue.value) {
      const clientjobId = newValue.value;
      try {
        const response = await fetch(
          `${CLIENT_FACING_API}/workflow/clientfacingjobstatus/${clientjobId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log(data);
        setClientDescription(
          data.clientfacingjobstatuses.clientfacingdescription
        );
        console.log(data.clientfacingjobstatuses.clientfacingdescription);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleDescriptionAddShortcut = (shortcut) => {
    const updatedTextValue = clientDescription + `[${shortcut}]`;
    if (updatedTextValue.length <= charLimit) {
      setClientDescription(updatedTextValue);
      setCharCount(updatedTextValue.length);
    }
    setShowDropdownDescription(false);
  };
  const handlechatsubject = (e) => {
    const { value } = e.target;
    setInputText(value);
  };
  const handleChange = (event) => {
    const value = event.target.value;
    if (value.length <= charLimit) {
      setClientDescription(value);
      setCharCount(value.length);
    }
  };
  const handleClientFacing = (checked) => {
    setClientFacingStatus(checked);
  };

  const handleJobAddShortcut = (shortcut) => {
    setInputText((prevText) => prevText + `[${shortcut}]`);
    setShowDropdownClientJob(false);
  };

  const toggleShortcodeDropdown = (event) => {
    setAnchorElClientJob(event.currentTarget);
    setShowDropdownClientJob(!showDropdownClientJob);
  };
  const toggleDescriptionDropdown = (event) => {
    setAnchorElDecription(event.currentTarget);
    setShowDropdownDescription(!showDropdownDescription);
  };
  const [selectedRows, setSelectedRows] = useState({});

  // Handle individual checkbox changes
  const handleCheckboxChange = (id) => {
    setSelectedRows((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Handle the "select all" checkbox change
  const handleSelectAllChange = (event) => {
    const checked = event.target.checked;
    const newSelectedRows = checked
      ? jobData.reduce((acc, row) => {
          acc[row.id] = true;
          return acc;
        }, {})
      : {};

    setSelectedRows(newSelectedRows);
  };

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
  // Pagination State
 const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
  
  
     const handleChangePage = (_, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
     // Compute paginated tasks
     const paginatedChats = jobData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <>
     
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : 600,
              maxWidth: "100%",
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
              id: "tag-drawer",
            },
          }}
        >
           <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px",
              ml: 1,
            }}
          >
            <Typography sx={{ fontWeight: "bold" }} variant="h6">
              Edit Job
            </Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <Box padding={2} height="83vh" sx={{ overflowY: "auto" }}>
            <Box mt={2}>
              <label>Pipeline</label>

              <Autocomplete
                options={optionpipeline}
                getOptionLabel={(option) => option.label}
                value={selectedPipeline}
                onChange={(event, newValue) => handlePipelineChange(newValue)}
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
                    sx={{ backgroundColor: "#fff" }}
                    placeholder="Pipeline"
                    variant="outlined"
                    size="small"
                  />
                )}
                sx={{ width: "100%", marginTop: "8px" }}
                clearOnEscape // Enable clearable functionality
              />
            </Box>
            <Box mt={2}>
              <label>Account Tags</label>
              <Autocomplete
                multiple // Enable multi-select
                size="small"
                sx={{ marginTop: "8px", marginBottom: "8px" }}
                options={tagoptions} // The array of options
                value={selectedTags} // Selected tags
                onChange={handleTagChange}
                getOptionLabel={(option) => option.label} // Assuming your tags have a 'label' property
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                } // Customize equality check
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Select tags..."
                  />
                )}
                filterSelectedOptions // Prevents duplicates in selection
                renderOption={(props, option) => (
                  <MenuItem
                    {...props}
                    key={option.value}
                    style={{
                      backgroundColor: option.colour,
                      color: "#fff",
                      borderRadius: "15px",
                      margin: "2px 0",
                      width: calculateWidthOptions(option.label),
                    }}
                  >
                    {option.label}
                  </MenuItem>
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.value}
                      label={option.label}
                      style={{
                        backgroundColor: option.colour,
                        color: "#fff",
                        borderRadius: "15px",
                        fontSize: "10px",
                        margin: "7px",
                        alignItems: "center",
                        textAlign: "center",
                        marginBottom: "5px",
                        padding: "2px,8px",
                      }}
                    />
                  ))
                }
              />
            </Box>
            <Box>
              <label className="task-input-label">Task Assignee</label>
              <Autocomplete
                multiple
                sx={{ background: "#fff", mt: 1 }}
                options={useroptions}
                size="small"
                getOptionLabel={(option) => option.label}
                value={selecteduser}
                onChange={handleUserChange}
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
              />
            </Box>
            <Box>
              <label>Stage</label>
              <Autocomplete
                options={stages || []}
                getOptionLabel={(option) => option.label}
                value={selectedstage}
                onChange={(event, newValue) => handleStageChange(newValue)}
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
                    sx={{ backgroundColor: "#fff" }}
                    placeholder="Select stages"
                    variant="outlined"
                    size="small"
                  />
                )}
                clearOnEscape // Enable clearable functionality
                sx={{ width: "100%", marginTop: "8px" }}
              />
            </Box>
            <Box mt={2}>
              <Priority
                onPriorityChange={handlePriorityChange}
                selectedPriority={priority}
              />
            </Box>

            <Typography>Start Date</Typography>
            <DatePicker
              format="DD/MM/YYYY"
              sx={{ width: "100%", backgroundColor: "#fff" }}
              // value={startDate}
              // onChange={handleStartDateChange}
              value={startDate}
              onChange={handleStartDateChange}
              renderInput={(params) => <TextField {...params} size="small" />}
            />

            <Typography>Due Date</Typography>
            <DatePicker
              format="DD/MM/YYYY"
              sx={{ width: "100%", backgroundColor: "#fff" }}
              // value={dueDate}
              // onChange={handleDueDateChange}
              value={dueDate}
              onChange={handleDueDateChange}
              renderInput={(params) => <TextField {...params} size="small" />}
            />
            <Box mt={2}>
              <Editor
                initialContent={description}
                onChange={handleEditorChange}
              />
            </Box>

            <Box mt={2}>
              <Box style={{ display: "flex", alignItems: "center" }}>
                {/* <EditCalendarRoundedIcon sx={{ fontSize: '120px', color: '#c6c7c7', }} /> */}
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body">
                      <b>Client-facing status</b>
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          onChange={(event) =>
                            handleClientFacing(event.target.checked)
                          }
                          checked={clientFacingStatus}
                          color="primary"
                        />
                      }
                      label="Show in Client portal"
                    />
                  </Box>
                  <Box>
                    {clientFacingStatus && (
                      <>
                        <Typography>Job name for client</Typography>
                        <TextField
                          fullWidth
                          name="subject"
                          value={inputText + selectedJobShortcut}
                          onChange={handlechatsubject}
                          placeholder="Job name for client"
                          size="small"
                          sx={{ background: "#fff", mt: 2 }}
                        />

                        <Box mt={2}>
                          <Typography>Status</Typography>
                          <Autocomplete
                            options={optionstatus}
                            size="small"
                            sx={{ mt: 1 }}
                            value={selectedjob}
                            onChange={handleJobChange}
                            getOptionLabel={(option) => option.label}
                            isOptionEqualToValue={(option, value) =>
                              option.value === value.value
                            }
                            renderOption={(props, option) => (
                              <Box component="li" {...props}>
                                {/* Color dot */}
                                <Chip
                                  size="small"
                                  style={{
                                    backgroundColor: option.clientfacingColour,
                                    marginRight: 8,
                                    marginLeft: 8,
                                    borderRadius: "50%",
                                    height: "15px",
                                  }}
                                />
                                {option.label}
                              </Box>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Client Facing Job"
                                InputProps={{
                                  ...params.InputProps,
                                  startAdornment:
                                    params.inputProps.value &&
                                    clientFacingJobs.length > 0 ? (
                                      <Chip
                                        size="small"
                                        style={{
                                          backgroundColor:
                                            clientFacingJobs.find(
                                              (job) =>
                                                job.clientfacingName ===
                                                params.inputProps.value
                                            )?.clientfacingColour, // Set color from selection
                                          marginRight: 8,
                                          marginLeft: 2,
                                          borderRadius: "50%",
                                          height: "15px",
                                        }}
                                      />
                                    ) : null,
                                }}
                              />
                            )}
                          />
                        </Box>
                        <Box sx={{ position: "relative", mt: 2 }}>
                          <InputLabel sx={{ color: "black" }}>
                            Description
                          </InputLabel>
                          <TextField
                            fullWidth
                            size="small"
                            margin="normal"
                            type="text"
                            multiline
                            value={clientDescription}
                            onChange={handleChange}
                            placeholder="Description"
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Typography
                                    sx={{
                                      color: "gray",
                                      fontSize: "12px",
                                      position: "absolute",
                                      bottom: "15px",
                                      right: "15px",
                                    }}
                                  >
                                    {charCount}/{charLimit}
                                  </Typography>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box mt={5} display="flex" alignItems="center" gap={2}>
              <Button
                variant="contained"
                onClick={handleSaveExitClick}
                sx={{
                  backgroundColor: "var(--color-save-btn)", // Normal background

                  "&:hover": {
                    backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                  },
                  borderRadius: "15px",
                }}
              >
                Save & Exit
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveClick}
                sx={{
                  backgroundColor: "var(--color-save-btn)", // Normal background

                  "&:hover": {
                    backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                  },
                  width: "80px",
                  borderRadius: "15px",
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={handleFormClose}
                sx={{
                  borderColor: "var(--color-border-cancel-btn)", // Normal background
                  color: "var(--color-save-btn)",
                  "&:hover": {
                    backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                    color: "#fff",
                    border: "none",
                  },
                  width: "80px",
                  borderRadius: "15px",
                  ml: 2,
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
          </LocalizationProvider>
        </Drawer>
        <Box
          className="client-document-nav"
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between", // Add this line
            alignItems: "center", // Vertically align items
            // mt: 5,
            width: "100%",
            // margin: "20px",
            gap: "10px",
            "& a": {
              textDecoration: "none",
              padding: "10px 16px",
              borderRadius: "4px",
              // color: "primary.main",
              "&:hover": {
                backgroundColor: "var(--color-save-btn)",
                color: "white",
              },
              "&.active": {
                backgroundColor: "var(--color-save-btn)",
                color: "white",
              },
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              style={{
                backgroundColor:
                  activeButton === "active"
                    ? "var(--color-save-btn)"
                    : "transparent",
                color: activeButton === "active" ? "white" : "black",
                fontWeight: activeButton === "active" ? "bold" : "normal",
                padding: "4px 8px",
                borderRadius: "10px",
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={handleActiveClick}
            >
              Active Jobs
            </Typography>

            <Typography
              style={{
                backgroundColor:
                  activeButton === "archived"
                    ? "var(--color-save-btn)"
                    : "transparent",
                color: activeButton === "archived" ? "white" : "black",
                fontWeight: activeButton === "archived" ? "bold" : "normal",
                padding: "4px 8px",
                borderRadius: "10px",
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={handleArchivedClick}
            >
              Archived Jobs
            </Typography>
            <Box>
              {selected.length > 0 && (
                <IconButton
                  sx={{ color: "red" }}
                  onClick={handleDeleteJob} // Pass selected job IDs
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
        
 
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
                    checked={selected.length === jobData.length}
                    onChange={() => {
                      if (selected.length === jobData.length) {
                        setSelected([]);
                      } else {
                        const allSelected = jobData.map((item) => item.id);
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
                  width="100"
                >
                  Job Assignee
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "16px",
                  }}
                  width="100"
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
                  width="100"
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
                  Client-Facing Status
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
                  width="200"
                >
                  Time in Current Stage
                </TableCell>
                <TableCell
                  style={{
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
              {paginatedChats.map((row) => {
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
                      {row.JobAssignee}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                      }}
                    >
                      {row.Pipeline}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                      }}
                    >
                      {row.Stage}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                      }}
                    >
                      {row.Account}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                      }}
                    >
                      {row.clientfacingstatus?.statusName && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <GoDotFill
                            style={{
                              color: row.clientfacingstatus.statusColor,
                              fontSize: "20px",
                            }}
                          />
                          {row.clientfacingstatus.statusName}
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
                      {row.StartDate}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                      }}
                    >
                      {row.DueDate}
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                      }}
                    >
                      {row.updatedAt}
                    </TableCell>
                    <TableCell
                      style={{
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
                        open={Boolean(anchorEl && selectedJob === row.id)}
                        onClose={handleClose}
                      >
                        {/* <MenuItem onClick={handleEditClick}>
                          {isActiveTrue ? "Archive" : "Make Active"}
                        </MenuItem> */}
                        <MenuItem onClick={() => handleEditClick(isActiveTrue ? "Archive" : "Make Active")}>
  {isActiveTrue ? "Archive" : "Make Active"}
</MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[1,2,5, 10, 25]}
          component="div"
          count={jobData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </>
  );
};

export default Example;
// {selectedJob && <UpdateJob selectedJob={selectedJob} handleClose={() => setIsDrawerOpen(false)} />}
 {/* <Stack direction={isMobile ? "column-reverse" : "column"} gap="8px">
          <MaterialReactTable columns={columns} table={table} />
        </Stack> */}