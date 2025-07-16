import {
  Drawer,
  Checkbox,
  Chip,
  InputLabel,
  List,
  Box,
  InputAdornment,
  IconButton,
  Popover,
  ListItem,
  ListItemText,
  Button,
  Grid,
  Typography,
  TextField,
  label,
  Switch,
  FormControlLabel,
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
// import Priority from '../Templates/Priority/Priority';
import Priority from "../../Templates/Priority/Priority";
// import Editor from '../Templates/Texteditor/Editor';
import Editor from "../../Templates/Texteditor/Editor";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import MultiSelectDropdown from "../../Templates/MultiSelectDropdown";
import AccountMultiSelectDropdown from "../../Templates/AccountMultiSelectDropdown";
import { LoginContext } from "../../Sidebar/Context/Context";
// Initialize the plugin
dayjs.extend(customParseFormat);

const CreateBulkJob = ({ selectedAccounts, onClose, charLimit = 4000 }) => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const JOBS_TEMP_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;

  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");
 const [username, setUsername] = useState("");
  const fetchUserData = async (id) => {
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("id", result);

        // console.log(userData)
        setUsername(result.username);
      });
  };
    useEffect(() => {
      fetchUserData(loginuserid);
    }, []);
  useEffect(() => {
    if (logindata?.user?.id) {
      // Check if logindata and user.id exist
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
  // State to keep track of selected values
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [jobName, setJobName] = useState("");
  const [priority, setPriority] = useState("");
  const [absoluteDate, setAbsoluteDates] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [startsin, setstartsin] = useState(0);
  const [startsInDuration, setStartsInDuration] = useState("Days");
  const [dueinduration, setdueinduration] = useState("Days");
  const [duein, setduein] = useState(0);

  const dayOptions = [
    { label: "Days", value: "Days" },
    { label: "Months", value: "Months" },
    { label: "Years", value: "Years" },
  ];
  const handleEditorChange = (content) => {
    setDescription(content);
  };

  // Handler function to update state when dropdown value changes
  const handleStartInDateChange = (event, newValue) => {
    setStartsInDuration(newValue ? newValue.value : null);
  };
  // Handler function to update state when dropdown value changes
  const handleDueInDateChange = (event, newValue) => {
    setdueinduration(newValue ? newValue.value : null);
  };

  const handlePriorityChange = (priority) => {
    setPriority(priority);
  };

  const handleAbsolutesDates = (checked) => {
    setAbsoluteDates(checked);
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleDueDateChange = (date) => {
    setDueDate(date);
  };

  //****************Accounts */
  const [accountdata, setaccountdata] = useState([]);
  const [selectedaccount, setSelectedaccount] = useState([]);
  const [combinedaccountValues, setCombinedaccountValues] = useState();

  // const handleAccountChange = (event, newValue) => {
  //   setSelectedaccount(newValue);
  //   console.log("Selected Options:", newValue); // Log full option objects
  //   console.log(
  //     "Selected Values:",
  //     newValue.map((option) => option.value)
  //   ); // Log just the values

  //   // If you need to set combined account values separately
  //   setCombinedaccountValues(newValue.map((option) => option.value));
  // };
  const handleAccountChange = (newSelectedAcc) => {
    setSelectedaccount(newSelectedAcc);
    console.log(newSelectedAcc);
    const selectedValues = newSelectedAcc.map((option) => option.value);
    setCombinedaccountValues(selectedValues);
    console.log(selectedValues);
  };
  useEffect(() => {
    fetchAccountData();
  }, []);

  const [accountoptions, setAccountOptions] = useState([]);
  const fetchAccountData = async () => {
    try {
      const response = await fetch(`${ACCOUNT_API}/accounts/accountdetails`);
      const data = await response.json();
      setaccountdata(data.accounts);

      // Map accounts to options
      const options = data.accounts.map((account) => ({
        value: account._id,
        label: account.accountName,
      }));
      setAccountOptions(options);

      // Filter options based on selectedAccounts
      const selectedOptions = options.filter((option) =>
        selectedAccounts.includes(option.value)
      );
      console.log("Selected Options:", selectedOptions);
      setSelectedaccount(selectedOptions);
      setCombinedaccountValues(selectedOptions.map((option) => option.value));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

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

  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedAssigneesValues, setCombinedAssigneesValues] = useState();
  // const handleUserChange = (event, selectedOptions) => {
  //   setSelectedUser(selectedOptions);
  //   const selectedValues = selectedOptions.map((option) => option.value);
  //   setCombinedAssigneesValues(selectedValues);
  // };
  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    console.log(newSelectedUsers);
    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedAssigneesValues(selectedValues);
    console.log(selectedValues);
  };
  const assigneesoptions = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  //Default Jobt template get
  const [jobTemp, setJobTemp] = useState([]);
  const [selectedtemp, setselectedTemp] = useState();

  const handletemp = async (event, newValue) => {
    setselectedTemp(newValue);
    if (newValue && newValue.value) {
      const templateId = newValue.value;
      try {
        const response = await fetch(
          `${JOBS_TEMP_API}/workflow/jobtemplate/jobtemplate/jobtemplatelist/${templateId}`
        );
        const data = await response.json();
        const template = data.jobTemplate;

        // Populate the form fields with template data
        setJobName(template.jobname);

        const jobAssignees = template.jobassignees.map((assignee) => ({
          value: assignee._id,
          label: assignee.username,
        }));
        setSelectedUser(jobAssignees);
        const selectedValues = jobAssignees.map((option) => option.value);
        setCombinedAssigneesValues(selectedValues);
        // setSelecteAssigneesdUser(template.jobassignees.map(assignee => assignee._id));
        setPriority(template.priority);
        console.log(template.priority);
        setDescription(template.description);
        setAbsoluteDates(template.absolutedates);
        setStartDate(template.absolutedates ? dayjs(template.startdate) : null);
        setDueDate(template.absolutedates ? dayjs(template.enddate) : null);
        setstartsin(template.startsin); // You might need to adjust this
        setduein(template.duein); // You might need to adjust this
        setStartsInDuration(template.startsinduration);
        setdueinduration(template.dueinduration);

        setClientFacingStatus(template.showinclientportal);
        setInputText(template.jobnameforclient);
        if (template.clientfacingstatus && template.clientfacingstatus) {
          const clientStatusData = {
            value: template.clientfacingstatus._id,
            label: template.clientfacingstatus.clientfacingName,
            clientfacingColour: template.clientfacingstatus.clientfacingColour,
          };

          setSelectedJob(clientStatusData);
        }
        setClientDescription(template.clientfacingDescription);
      } catch (error) {
        console.error("Error fetching template data:", error);
      }
    }
  };

  useEffect(() => {
    fetchtemp();
  }, []);

  const fetchtemp = async () => {
    try {
      const url = `${JOBS_TEMP_API}/workflow/jobtemplate/jobtemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setJobTemp(data.JobTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const optiontemp = jobTemp.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  // pipeline data
  const [pipelineData, setPipelineData] = useState([]);
  const [selectedPipeline, setselectedPipeline] = useState();
  const [stages, setstagesData] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [stagesoptions, setStagesOptions] = useState([]);
  const [selectedPipelineDetails, setSelectedPipelineDetails] = useState(null);
  // const stagesoptions = stages.map(stage => ({ value: stage._id, label: stage.name }));

  const handleStageChange = (event, newValue) => {
    setSelectedStage(newValue);
  };

  const handlePipelineChange = async (selectedOptions) => {
    console.log(selectedOptions);
    setselectedPipeline(selectedOptions);
    if (selectedOptions) {
      try {
        const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${selectedOptions.value}`;
        const response = await fetch(url);
        const data = await response.json();
        setSelectedPipelineDetails(data);
        console.log("Pipeline details:", data);
      } catch (error) {
        console.error("Error fetching pipeline details:", error);
      }
    }
    fetchPipelineDataByID(selectedOptions.value);
  };

  useEffect(() => {
    fetchPipelineData();
  }, []);

  const fetchPipelineDataByID = async (pipelineid) => {
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineid}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.pipeline);

      // Map stages for Autocomplete
      const stageOptions = data.pipeline.stages.map((stage) => ({
        label: stage.name,
        value: stage._id,
      }));

      setStagesOptions(stageOptions);
      setSelectedStage(stageOptions[0]);

      // setPipelineData(data.pipeline);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPipelineData = async () => {
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipelines`;
      const response = await fetch(url);
      const data = await response.json();
      setPipelineData(data.pipeline);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const optionpipeline = pipelineData.map((pipelineData) => ({
    value: pipelineData._id,
    label: pipelineData.pipelineName,
  }));
  // console.log("Job Assignees Values:", selectedAssigneesUser);

  // const createjob = () => {
  //   const myHeaders = {
  //     "Content-Type": "application/json",
  //   };

  //   const data = {
  //     accounts: combinedaccountValues,
  //     pipeline: selectedPipeline.value,
  //     templatename: selectedtemp.value,
  //     jobname: jobName,
  //     jobassignees: combinedAssigneesValues,
  //     priority: priority,
  //     description: description,
  //     absolutedates: absoluteDate,
  //     startsin: startsin,
  //     startsinduration: startsInDuration,
  //     duein: duein,
  //     dueinduration: dueinduration,
  //     showinclientportal: clientFacingStatus,
  //     jobnameforclient: inputText,
  //     clientfacingstatus: selectedJob?.value,
  //     clientfacingDescription: clientDescription,
  //     startdate: startDate,
  //     enddate: dueDate,
  //   };
  //   console.log(data);
  //   const config = {
  //     method: "post",
  //     maxBodyLength: Infinity,
  //     url: `${JOBS_API}/workflow/jobs/newjob`,
  //     headers: myHeaders,
  //     data: JSON.stringify(data),
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       console.log("Job created successfully", response);
  //       toast.success("Job created successfully");
  //       navigate("/workflow/jobs");
  //       // Handle success, e.g., toast or redirect
  //     })
  //     .catch((error) => {
  //       console.error("Failed to create Job Template:", error);
  //       toast.error("Failed to create Job");
  //       // Handle errors, e.g., toast error
  //     });
  // };

  const handleJobFormClose = () => {
    if (onClose) {
      onClose(); // Ensures onClose is a valid function before calling it
    }
    setTimeout(() => {}, 1000);
  };

  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    // Simulate filtered shortcuts based on some logic (e.g., search)
    setFilteredShortcuts(
      shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(""))
    );
  }, [shortcuts]);

  useEffect(() => {
    // Set shortcuts based on selected option
    if (selectedOption === "contacts") {
      const contactShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        {
          title: "Custom field:Website",
          isBold: false,
          value: "ACCOUNT_CUSTOM_FIELD:Website",
        },
        { title: "Contact Shortcodes", isBold: true },
        { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
        { title: "First Name", isBold: false, value: "FIRST_NAME" },
        { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
        { title: "Last Name", isBold: false, value: "LAST_NAME" },
        { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
        { title: "Country", isBold: false, value: "COUNTRY" },
        { title: "Company name", isBold: false, value: "COMPANY_NAME " },
        { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
        { title: "City", isBold: false, value: "CITY" },
        { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
        { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
        {
          title: "Custom field:Email",
          isBold: false,
          value: "CONTACT_CUSTOM_FIELD:Email",
        },
        { title: "Date Shortcodes", isBold: true },
        {
          title: "Current day full date",
          isBold: false,
          value: "CURRENT_DAY_FULL_DATE",
        },
        {
          title: "Current day number",
          isBold: false,
          value: "CURRENT_DAY_NUMBER",
        },
        { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
        { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
        {
          title: "Current month number",
          isBold: false,
          value: "CURRENT_MONTH_NUMBER",
        },
        {
          title: "Current month name",
          isBold: false,
          value: "CURRENT_MONTH_NAME",
        },
        { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
        { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
        {
          title: "Last day full date",
          isBold: false,
          value: "LAST_DAY_FULL_DATE",
        },
        { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
        { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
        { title: "Last week", isBold: false, value: "LAST_WEEK" },
        {
          title: "Last month number",
          isBold: false,
          value: "LAST_MONTH_NUMBER",
        },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        {
          title: "Next day full date",
          isBold: false,
          value: "NEXT_DAY_FULL_DATE",
        },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        {
          title: "Next month number",
          isBold: false,
          value: "NEXT_MONTH_NUMBER",
        },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(contactShortcuts);
    } else if (selectedOption === "account") {
      const accountShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        {
          title: "Custom field:Website",
          isBold: false,
          value: "ACCOUNT_CUSTOM_FIELD:Website",
        },
        { title: "Date Shortcodes", isBold: true },
        {
          title: "Current day full date",
          isBold: false,
          value: "CURRENT_DAY_FULL_DATE",
        },
        {
          title: "Current day number",
          isBold: false,
          value: "CURRENT_DAY_NUMBER",
        },
        { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
        { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
        {
          title: "Current month number",
          isBold: false,
          value: "CURRENT_MONTH_NUMBER",
        },
        {
          title: "Current month name",
          isBold: false,
          value: "CURRENT_MONTH_NAME",
        },
        { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
        { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
        {
          title: "Last day full date",
          isBold: false,
          value: "LAST_DAY_FULL_DATE",
        },
        { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
        { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
        { title: "Last week", isBold: false, value: "LAST_WEEK" },
        {
          title: "Last month number",
          isBold: false,
          value: "LAST_MONTH_NUMBER",
        },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        {
          title: "Next day full date",
          isBold: false,
          value: "NEXT_DAY_FULL_DATE",
        },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        {
          title: "Next month number",
          isBold: false,
          value: "NEXT_MONTH_NUMBER",
        },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);
  const handleCloseDropdown = () => {
    setShowDropdown(false);
    setAnchorEl(null);
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
  const [selectedJob, setSelectedJob] = useState(null);
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
    setSelectedJob(newValue);

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

  const [automations, setAutomations] = useState([]);
  const createjob = () => {
    // Check if the first stage of the selected pipeline contains automations
    if (
      selectedPipelineDetails?.pipeline?.stages?.[0]?.automations?.length > 0
    ) {
      // Get automations data from the first stage
      const automationsData =
        selectedPipelineDetails?.pipeline?.stages?.[0]?.automations || [];
      console.log("janavi", automationsData);
      setAutomations(automationsData);

      // Open the drawer with the automations data
      // openDrawer(automationsData);
      setDrawerOpen(true);
      return; // Stop further execution of createjob
    }

    const myHeaders = {
      "Content-Type": "application/json",
    };

    const data = {
      accounts: combinedaccountValues,
      pipeline: selectedPipeline.value,
      templatename: selectedtemp.value,
      jobname: jobName,
      jobassignees: combinedAssigneesValues,
      priority: priority,
      description: description,
      absolutedates: absoluteDate,
      startsin: startsin,
      startsinduration: startsInDuration,
      duein: duein,
      dueinduration: dueinduration,
      showinclientportal: clientFacingStatus,
      jobnameforclient: inputText,
      clientfacingstatus: selectedJob?.value,
      clientfacingDescription: clientDescription,
      startdate: startDate,
      enddate: dueDate,
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${JOBS_API}/workflow/jobs/newjob`,
      headers: myHeaders,
      data: JSON.stringify(data),
    };

    axios
      .request(config)
      .then((response) => {
        console.log("Job created successfully");
        toast.success("Job created successfully");
        navigate("/jobs/activejob");
      })
      .catch((error) => {
        console.error("Failed to create Job Template:", error);
        toast.error("Failed to create Job");
      });
  };
  const [drawerOpen, setDrawerOpen] = useState(false);

  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      console.log("tags dtata", data.tags);
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateWidth = (label) => Math.min(label.length * 8, 200);

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

  const handleTagChange = (index, type, event) => {
    const { value } = event.target; // Array of selected tag IDs

    setAutomations((prev) => {
      const updatedAutomations = [...prev];

      // Get the correct tag options list
      const tagOptions = tagsoptions;

      // Map selected tag IDs to tag objects with _id, tagName, and tagColour
      const selectedTags = value
        .map((tagId) => {
          const tag = tagOptions.find((t) => t.value === tagId);
          return tag
            ? { _id: tag.value, tagName: tag.label, tagColour: tag.colour }
            : null;
        })
        .filter(Boolean); // Remove null values

      // Prevent duplicate selections
      const uniqueTags = selectedTags.filter(
        (tag, idx, self) => self.findIndex((t) => t._id === tag._id) === idx
      );

      // Ensure the tag is removed from the opposite category
      if (type === "addTags") {
        updatedAutomations[index].removeTags = updatedAutomations[
          index
        ].removeTags.filter(
          (tag) => !uniqueTags.some((t) => t._id === tag._id)
        );
      } else if (type === "removeTags") {
        updatedAutomations[index].addTags = updatedAutomations[
          index
        ].addTags.filter((tag) => !uniqueTags.some((t) => t._id === tag._id));
      }

      updatedAutomations[index] = {
        ...updatedAutomations[index],
        [type]: uniqueTags,
      };

      return updatedAutomations;
    });
  };
     const [assignee, setAssignee] = useState([]);
    const [selectedAssignees, setSelectedAssignees] = useState([]);
    const [assigneesToRemove, setAssigneesToRemove] = useState([]);
    useEffect(() => {
      const fetchAssignees = async () => {
        try {
          const response = await axios.get(`${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`);
          console.log("assigness data",response.data)
          setAssignee(response.data);
        } catch (error) {
          console.error("Error fetching assignees:", error);
        }
      };
      
      fetchAssignees();
    }, []);
    const assigneeOptions = assignee.map((ass)=>({
       value: ass._id,
        label: ass.username,
    }))
     const handleAssigneeChange = (index, type, event) => {
      const { value } = event.target; // Array of selected tag IDs
  
      setAutomations((prev) => {
        const updatedAutomations = [...prev];
  
        // Get the correct tag options list
        const assigneeoptions = assigneeOptions;
  
        // Map selected tag IDs to tag objects with _id, tagName, and tagColour
        const selectedTags = value
          .map((assId) => {
            const ass = assigneeoptions.find((t) => t.value === assId);
            return ass
              ? { _id: ass.value, username: ass.label,  }
              : null;
          })
          .filter(Boolean); // Remove null values
  
        // Prevent duplicate selections
        const uniqueTags = selectedTags.filter(
          (ass, idx, self) => self.findIndex((t) => t._id === ass._id) === idx
        );
  
        // Ensure the tag is removed from the opposite category
        if (type === "addAssignees") {
          updatedAutomations[index].removeAssignees = updatedAutomations[
            index
          ].removeAssignees.filter(
            (ass) => !uniqueTags.some((t) => t._id === ass._id)
          );
        } else if (type === "removeAssignees") {
          updatedAutomations[index].addAssignees = updatedAutomations[
            index
          ].addAssignees.filter((tag) => !uniqueTags.some((t) => t._id === tag._id));
        }
  
        updatedAutomations[index] = {
          ...updatedAutomations[index],
          [type]: uniqueTags,
        };
  
        return updatedAutomations;
      });
    };
  // Drawer Component
  const DrawerContent = () => {
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

    // Get the tags for the selected accounts
    const accountTags = combinedaccountValues
      .map((accountId) => {
        const account = accountdata.find(
          (account) => account._id === accountId
        );
        return account ? account.tags || [] : []; // Assuming accounts have tags
      })
      .flat(); // Flattening array to get all tags
    const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
    const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
    const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
    const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
    const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL;
    const PROPOSAL_ACCOUNT_API = process.env.REACT_APP_PROPOSAL_URL;
    const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
    const AUTOMATION_API = process.env.REACT_APP_AUTOMATION_API;
    // fetch invoive temp by id
    const fetchinvoicetempbyid = async (automationTemp) => {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${automationTemp}`;
      try {
        const response = await fetch(url, requestOptions); // Fetch the data
        const result = await response.json(); // Parse the JSON response
        console.log("Fetched invoice template:", result.invoiceTemplate);
        return result.invoiceTemplate; // Return the data
      } catch (error) {
        console.error("Error fetching invoice template:", error);
        throw error; // Let the calling function handle the error
      }
    };
    // fetch task temp by id
    const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
    const fetchtasktempbyid = async (automationTemp) => {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      const url = `${TASK_API}/workflow/tasks/tasktemplate/tasktemplatebyid/${automationTemp}`;
      try {
        const response = await fetch(url, requestOptions); // Fetch the data
        const result = await response.json(); // Parse the JSON response
        console.log("Fetched task template:", result.taskTemplate);
        return result.taskTemplate; // Return the data
      } catch (error) {
        console.error("Error fetching invoice template:", error);
        throw error; // Let the calling function handle the error
      }
    };
    // fetch chat temp by id
    const fetchchattempbyid = async (automationTemp) => {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      const url = `${CHAT_API}/workflow/chats/chattemplate/chattemplateList/${automationTemp}`;
      try {
        const response = await fetch(url, requestOptions); // Fetch the data
        const result = await response.json(); // Parse the JSON response
        console.log("Fetched chat template:", result.chatTemplate);
        return result.chatTemplate; // Return the data
      } catch (error) {
        console.error("Error fetching invoice template:", error);
        throw error; // Let the calling function handle the error
      }
    };
    // fetch proposal temp by id
    const fetchproposalbyid = async (automationTemp) => {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      const url = `${PROPOSAL_API}/workflow/proposalesandels/proposalesandels/${automationTemp}`;
      try {
        const response = await fetch(url, requestOptions); // Fetch the data
        const result = await response.json(); // Parse the JSON response
        console.log(
          "Fetched proposalsels template:",
          result.proposalesAndElsTemplate
        );
        return result.proposalesAndElsTemplate; // Return the data
      } catch (error) {
        console.error("Error fetching proposal template:", error);
        throw error; // Let the calling function handle the error
      }
    };
    // fetch organizer temp by id
    const fetchorganizertempbyid = async (automationTemp) => {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${automationTemp}`;
console.log("org temp url", url)
      try {
        const response = await fetch(url, requestOptions); // Fetch the data
        const result = await response.json(); // Parse the JSON response
        console.log("Fetched organizer template:", result.organizerTemplate);
        return result.organizerTemplate; // Return the data
      } catch (error) {
        console.error("Error fetching organizer template:", error);
        throw error; // Let the calling function handle the error
      }
    };

    const getCurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
    };

    const assignInvoiceToAccount = (invoiceData, automationTemp, accountId) => {
      // console.log(
      //   "Assigning invoice",
      //   invoiceData,
      //   automationTemp,
      //   accountId
      // );

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      // Dynamically prepare the payload from invoiceData
      const raw = JSON.stringify({
        account: accountId,
        invoicenumber: "", // Fill in if required
        invoicedate: getCurrentDate(), // Today's date
        description: invoiceData.description || "",
        invoicetemplate: automationTemp,
        paymentMethod: invoiceData.paymentMethod || "",
        teammember: loginuserid, // Fill in if required
        payInvoicewithcredits: invoiceData.payInvoicewithcredits || false,
        emailinvoicetoclient: invoiceData.sendEmailWhenInvCreated || false,
        reminders: invoiceData.sendReminderstoClients || false,
        daysuntilnextreminder: invoiceData.daysuntilnextreminder || null,
        numberOfreminder: invoiceData.numberOfreminder || null,
        scheduleinvoice: false, // Optional, adjust as needed
        scheduleinvoicedate: new Date(), // Current date and time
        scheduleinvoicetime: new Date().toLocaleTimeString("en-US", {
          hour12: false,
        }),
        lineItems: invoiceData.lineItems.map((item) => ({
          productorService: item.productorService || "",
          description: item.description || "",
          rate: item.rate || "",
          quantity: item.quantity || "",
          amount: item.amount || "",
          tax: item.tax || false,
        })),
        summary: {
          subtotal: invoiceData.summary.subtotal || "",
          taxRate: invoiceData.summary.taxRate || "",
          taxTotal: invoiceData.summary.taxTotal || "",
          total: invoiceData.summary.total || "",
        },
      });
      console.log("invoices", raw);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      fetch(`${INVOICE_NEW}/workflow/invoices/invoice`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("Invoice assigned successfully:", result);
        })
        .catch((error) => console.error("Error assigning invoice:", error));
    };

    const [chatId, setChatId] = useState();
    const [adminusername, setAdminUsername] = useState("");
    const fetchLoginUserData = async (loginuserid) => {
      const myHeaders = new Headers();

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const url = `${LOGIN_API}/common/user/${loginuserid}`;
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("jbhguhid", result);

          // console.log(userData)
          setAdminUsername(result.username);
        });
    };
    useEffect(() => {
      console.log("teammenber", loginuserid);
      fetchLoginUserData(loginuserid);
    }, []);
    // sendChatToAccount
    const sendChatToAccount = (
      chatData,
      automationTemp,
      automationAccountId
    ) => {
      console.log(
        "sending chat",
        chatData,
        automationTemp,
        automationAccountId
      );

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const subtaskData = chatData.clienttasks.map(({ id, text, checked }) => ({
        id,
        text,
        checked: checked !== undefined ? checked : false, // Ensure checked is either true or false
      }));
      const messageData = [
        {
          message: chatData.description,
          fromwhome: "Admin",
          senderid: loginuserid,
          isRead: false,
        },
      ];
      // Dynamically prepare the payload from invoiceData
      const raw = JSON.stringify({
        accountids: [automationAccountId],
        chattemplateid: automationTemp, // Fill in if required
        chatsubject: chatData.chatsubject, // Today's date
        description: messageData || "",
         templatename:chatData.templatename,
          from : username,
        sendreminderstoclient: chatData.sendreminderstoclient,
        daysuntilnextreminder: chatData.daysuntilnextreminder,
        numberofreminders: chatData.numberofreminders,
        clienttasks: subtaskData,
      });
      console.log("chats", raw);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("send chat to account successfully:", result);
          // console.log("chat id", result.newChats._id);
          // setChatId(result.newChats._id);
          // toast.success("New Chat created successfully");
          // sendSaveChatMail(result.newChats._id,automationAccountId,automationTemp,adminusername);
        })
        .catch((error) => console.error("Error assigning invoice:", error));
    };
    // mail for drawer btn
    const sendSaveChatMail = (
      chatId,
      automationAccountId,
      automationTemp,
      adminusername
    ) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        accountid: automationAccountId,
        chattemplateid: automationTemp,
        username: adminusername,
        chatId: chatId,
        viewchatlink: "/login",
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      console.log(raw);
      fetch(`${CHATTOCLIENT_API}/chatsend/securechatsend`, requestOptions)
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    };
    const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;

    const assignTaskToAccount = (
      taskData,
      automationTemp,
      automationAccountId,
      jobId
    ) => {
      console.log(
        "Assigning task",
        taskData,
        automationTemp,
        automationAccountId,
        jobId
      );

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        accounts: automationAccountId,
        job: jobId,
        templatename: automationTemp,
        taskname: taskData.templatename,
        status: taskData.status,
        taskassignees: taskData.taskassignees,
        priority: taskData.priority,
        description: taskData.description,
        tasktags: taskData.tasktags,
        issubtaskschecked: taskData.issubtaskschecked,
        startdate: taskData.startdate,
        enddate: taskData.enddate,
        subtasks: taskData.subtasks,
      });
      console.log("tasks creation", raw);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${ACCOUNT_TASKS_API}/accountstasks/newtask`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("task created", result);
          // onClose()
        })
        .catch((error) => console.error(error));
    };
    const assignProposalToAccount = (
      proposalesandelsData,
      automationTemp,
      automationAccountId
    ) => {
      console.log(
        "Assigning proposal",
        proposalesandelsData,
        automationTemp,
        automationAccountId
      );
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountids: automationAccountId,
          proposaltemplateid: automationTemp,
          templatename: proposalesandelsData.templatename,
          teammember: proposalesandelsData.teammember,
          proposalname: proposalesandelsData.proposalname,
          introduction: proposalesandelsData.introduction,
          terms: proposalesandelsData.terms,
          servicesandinvoices: proposalesandelsData.servicesandinvoices,
          introductiontext: proposalesandelsData.introductiontext,
          custommessageinemail: proposalesandelsData.custommessageinemail,
          custommessageinemailtext:
            proposalesandelsData.custommessageinemailtext,
          reminders: proposalesandelsData.reminders,
          daysuntilnextreminder: proposalesandelsData.daysuntilnextreminder,
          numberofreminder: proposalesandelsData.numberofreminder,
          introductiontextname: proposalesandelsData.introductiontextname,
          termsandconditionsname: proposalesandelsData.termsandconditionsname,
          termsandconditions: proposalesandelsData.termsandconditions,
          lineItems: proposalesandelsData.lineItems,
          summary: proposalesandelsData.summary,
          Addinvoiceoraskfordeposit:
            proposalesandelsData.Addinvoiceoraskfordeposit,
          Additemizedserviceswithoutcreatinginvoices:
            proposalesandelsData.Additemizedserviceswithoutcreatinginvoices,
          invoicetemplatename: proposalesandelsData.invoicetemplatename,
          invoiceteammember: proposalesandelsData.invoiceteammember,
          issueinvoice: proposalesandelsData.issueinvoice,
          specificdate: proposalesandelsData.specificdate,
          specifictime: proposalesandelsData.specifictime,
          description: proposalesandelsData.description,
          notetoclient: proposalesandelsData.notetoclient,
          paymentterms: proposalesandelsData.paymentterms,
          paymentduedate: proposalesandelsData.paymentduedate,
          paymentamount: proposalesandelsData.paymentamount,
          status: "Pending",
          active: true,
        }),
      };
      const url = `${PROPOSAL_ACCOUNT_API}/proposalandels/proposalaccountwise/`;
      console.log(url); // Log the URL for debugging
      console.log(options.body); // Log request body for debugging
      fetch(url, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.error("Fetch Error:", error);
          // toast.error("An error occurred while updating ProposalesAndEls.");
        });
    };
    const assignOrganizerToAccount = (
      organizerData,
      automationTemp,
      accountId
    ) => {
      console.log(
        "Assigning proposal",
        organizerData,
        automationTemp,
        accountId
      );
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        accountid: accountId,
        organizertemplateid: automationTemp,
        reminders: organizerData.reminders,
        noofreminders: organizerData.noOfReminder,
        daysuntilnextreminder: organizerData.daysuntilNextReminder,
        sections: organizerData.sections,
        status: "Pending",
        active: true,
      });
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      console.log(raw);
      const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/org`;
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
        })
        .catch((error) => console.error(error));
    };

    const CLIENT_DOCS_API = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
    const assignfoldertemp = (accountId, automationTemp) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        accountId: accountId,
        foldertempId: automationTemp,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      console.log(raw);
      fetch(`${CLIENT_DOCS_API}/clientdocs/accountfoldertemp`, requestOptions)
        .then((response) => response.json())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    };
    // const selectAutomationApi = async (
    //   automationType,
    //   automationTemp,
    //   automationAccountId
    // ) => {
    //   if (!automationType || !automationTemp || !automationAccountId) {
    //     console.error("Missing required parameters");
    //     return;
    //   }
    //   const accountIds = Array.isArray(automationAccountId)
    //     ? automationAccountId
    //     : [automationAccountId];
    //   switch (automationType) {
    //     case "Send Invoice":
    //       console.log(
    //         `Processing 'Send Invoice' with template: ${automationTemp}, Account ID: ${automationAccountId}`
    //       );
    //       try {
    //         const invoiceData = await fetchinvoicetempbyid(automationTemp); // Await the fetched data
    //         console.log("Fetched invoice data", invoiceData);
    //         // assignInvoiceToAccount(invoiceData, automationTemp, automationAccountId);
    //         // Iterate through each account ID
    //         // Iterate through each account ID
    //         for (const accountId of accountIds) {
    //           console.log(`Assigning invoice to account ID: ${accountId}`);
    //           assignInvoiceToAccount(invoiceData, automationTemp, accountId);
    //         }
    //       } catch (error) {
    //         console.error("Error processing 'Send Invoice':", error);
    //       }
    //       break;

    //     case "Apply folder template":
    //       console.log(
    //         `Apply folder template with template: ${automationTemp}, Account ID: ${automationAccountId}`
    //       );
    //       try {
    //         for (const accountId of accountIds) {
    //           console.log(`Assigning invoice to account ID: ${accountId}`);
    //           assignfoldertemp(accountId, automationTemp);
    //         }
    //         // await assignfoldertemp(automationAccountId, automationTemp);
    //         console.log("Folder template assigned successfully");
    //       } catch (error) {
    //         console.error("Error applying folder template:", error);
    //       }
    //       break;

    //     case "Create Organizer":
    //       console.log(
    //         `Processing 'Create Organizer' with template: ${automationTemp}, Account ID: ${automationAccountId}`
    //       );
    //       try {
    //         const organizerData = await fetchorganizertempbyid(automationTemp); // Await the fetched data
    //         console.log("Fetched organizer data", organizerData);
    //         // assignOrganizerToAccount(
    //         //   organizerData,
    //         //   automationTemp,
    //         //   automationAccountId
    //         // );
    //         for (const accountId of accountIds) {
    //           console.log(`Assigning invoice to account ID: ${accountId}`);
    //           assignOrganizerToAccount(
    //             organizerData,
    //             automationTemp,
    //             accountId
    //           );
    //         }
    //       } catch (error) {
    //         console.error("Error processing 'Send Invoice':", error);
    //       }
    //       break;

    //     case "Send Proposal/Els":
    //       console.log(
    //         `Creating Proposals with template: ${automationTemp}, Account ID: ${automationAccountId}`
    //       );
    //       try {
    //         const proposalesandelsData =
    //           await fetchproposalbyid(automationTemp); // Await the fetched data
    //         console.log("Fetched Proposals data", proposalesandelsData);
    //         assignProposalToAccount(
    //           proposalesandelsData,
    //           automationTemp,
    //           automationAccountId
    //         );
    //         // for (const accountId of accountIds) {
    //         //   console.log(`Assigning invoice to account ID: ${accountId}`);
    //         //   assignProposalToAccount(proposalesandelsData, automationTemp, accountId);
    //         // }
    //       } catch (error) {
    //         console.error("Error processing 'Send Invoice':", error);
    //       }
    //       break;

    //     case "Send Email":
    //       console.log(
    //         `Sending email with template: ${automationTemp}, Account ID: ${automationAccountId}`
    //       );
    //       const myHeaders = new Headers();
    //       myHeaders.append("Content-Type", "application/json");
    //       const raw = JSON.stringify({
    //         automationType,
    //         templateId: automationTemp,
    //         accountId: automationAccountId,
    //       });

    //       const requestOptions = {
    //         method: "POST",
    //         headers: myHeaders,
    //         body: raw,
    //         redirect: "follow",
    //       };

    //       fetch(`${AUTOMATION_API}/automations/`, requestOptions)
    //         .then((response) => response.json())
    //         .then((result) => console.log(result))
    //         .catch((error) => console.error(error));
    //       break;

    //     default:
    //       console.warn(`Unhandled automation type: ${automationType}`);
    //       break;
    //   }
    // };

    // Function to handle "Move" button click
    // const handleMove = async () => {
    // // Loop through selected automations
    // selectedAutomations.forEach((automationIndex) => {
    //   const automation = stageAutomations[automationIndex];

    //   // Ensure automation has the necessary fields
    //   if (!automation || !automation.type || !automation.template || !automation.template.value ) {
    //     console.error("Missing required automation data");
    //     return;
    //   }

    //   const automationType = automation.type;
    //   const automationTemp = automation.template.value; // Assuming the template has an _id field
    //   const automationAccountId = combinedaccountValues; // Use the selected account IDs

    //   // Ensure automationAccountId is not empty or invalid
    //   if (!automationAccountId || automationAccountId.length === 0) {
    //     console.error("Missing required account IDs");
    //     return;
    //   }

    //   // Call the selectAutomationApi with the necessary parameters
    //   selectAutomationApi(automationType, automationTemp, automationAccountId);
    // });
    //   // Proceed with job creation after all automations are done
    //   createJob();
    // };

    const selectAutomationApi = async (
      automationType,
      automationTemp,
      automationAccountId,
      automation,
      jobId = null
    ) => {
      console.log("bvhgv", automation);
      if (!automationType || !automationAccountId) {
        console.error("Missing required parameters");
        return;
      }

      switch (automationType) {
        case "Update account tags":
          console.log(
            `Updating account tags for Account ID: ${automationAccountId}`
          );

          try {
            // Fetch the current account data
            const response = await fetch(
              `${ACCOUNT_API}/accounts/accountdetails/${automationAccountId}`
            );
            if (!response.ok) throw new Error("Failed to fetch account data");

            const accountsData = await response.json();
            let currentTags = accountsData.account.tags || []; // Existing tag IDs

            // Extract tag IDs from automation object
            const addTagIds = automation?.addTags?.map((tag) => tag._id) || [];
            const removeTagIds =
              automation?.removeTags?.map((tag) => tag._id) || [];

            console.log("Current Tags:", currentTags);
            console.log("Tags to Add:", addTagIds);
            console.log("Tags to Remove:", removeTagIds);

            // Remove tags that match `removeTags`
            let updatedTags = currentTags.filter(
              (tagId) => !removeTagIds.includes(tagId)
            );

            // Add new tags without duplication
            updatedTags = [...new Set([...updatedTags, ...addTagIds])];

            console.log("Final Updated Tags:", updatedTags);

            // Send updated tags back to the server
            const updateResponse = await fetch(
              `${ACCOUNT_API}/accounts/accountdetails/updateaccounttags/${automationAccountId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ tags: updatedTags }),
              }
            );

            console.log("PATCH Response Status:", updateResponse.status);
            console.log("PATCH Response OK:", updateResponse.ok);

            const updateResponseData = await updateResponse.json();
            console.log("PATCH Response Data:", updateResponseData);

            if (!updateResponse.ok)
              throw new Error("Failed to update account tags");

            console.log("Account tags updated successfully");
          } catch (error) {
            console.error("Error updating account tags:", error);
          }
          break;
        case "Create Task":
          try {
            const taskData = await fetchtasktempbyid(automationTemp);

            // Add job and account references
            // const taskPayload = {

            //   jobId  // Only add job if exists
            // };

            console.log("Creating task with:", jobId);
            return await assignTaskToAccount(
              taskData,
              automationTemp,
              automationAccountId,
              jobId
            );
          } catch (error) {
            console.error("Task creation failed:", error);
            throw new Error(`Failed to create task: ${error.message}`);
          }
        // Other automation cases (unchanged)
        case "Send Invoice":
          console.log(
            `Processing 'Send Invoice' with template: ${automationTemp}, Account ID: ${automationAccountId}`
          );
          try {
            const invoiceData = await fetchinvoicetempbyid(automationTemp);
            console.log("Fetched invoice data", invoiceData);
            assignInvoiceToAccount(
              invoiceData,
              automationTemp,
              automationAccountId
            );
          } catch (error) {
            console.error("Error processing 'Send Invoice':", error);
          }
          break;
        case "Send message":
          console.log(
            `Processing 'Send message' with template: ${automationTemp}, Account ID: ${automationAccountId}`
          );
          try {
            const chatData = await fetchchattempbyid(automationTemp);
            console.log("Fetched chat data", chatData);
            sendChatToAccount(chatData, automationTemp, automationAccountId);
          } catch (error) {
            console.error("Error processing 'Send Invoice':", error);
          }
          break;
        case "Apply folder template":
          console.log(
            `Applying folder template with template: ${automationTemp}, Account ID: ${automationAccountId}`
          );
          try {
            await assignfoldertemp(automationAccountId, automationTemp);
            console.log("Folder template assigned successfully");
          } catch (error) {
            console.error("Error applying folder template:", error);
          }
          break;

        case "Create Organizer":
          console.log(
            `Processing 'Create Organizer' with template: ${automationTemp}, Account ID: ${automationAccountId}`
          );
          try {
            const organizerData = await fetchorganizertempbyid(automationTemp);
            console.log("Fetched organizer data", organizerData);
            assignOrganizerToAccount(
              organizerData,
              automationTemp,
              automationAccountId
            );
          } catch (error) {
            console.error("Error processing 'Create Organizer':", error);
          }
          break;

        case "Send Proposal/Els":
          console.log(
            `Creating Proposals with template: ${automationTemp}, Account ID: ${automationAccountId}`
          );
          try {
            const proposalData = await fetchproposalbyid(automationTemp);
            console.log("Fetched Proposals data", proposalData);
            assignProposalToAccount(
              proposalData,
              automationTemp,
              automationAccountId
            );
          } catch (error) {
            console.error("Error processing 'Send Proposal/Els':", error);
          }
          break;

        case "Send Email":
          console.log(
            `Sending email with template: ${automationTemp}, Account ID: ${automationAccountId}`
          );
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          const raw = JSON.stringify({
            automationType,
            templateId: automationTemp,
            accountId: automationAccountId,
          });

          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          fetch(`${AUTOMATION_API}/automations/`, requestOptions)
            .then((response) => response.json())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
          break;

        default:
          console.warn(`Unhandled automation type: ${automationType}`);
          break;
      }
    };

    const [selectedAutomations, setSelectedAutomations] = useState([]);

    useEffect(() => {
      const allIndices = automations.map((_, index) => index);
      setSelectedAutomations(allIndices);
    }, [automations]);

    const handleCheckboxChange = (index) => {
      setSelectedAutomations((prevSelected) =>
        prevSelected.includes(index)
          ? prevSelected.filter((i) => i !== index)
          : [...prevSelected, index]
      );
    };
    //     const handleMove = async () => {
    //       // Flag to track whether all automations are successful
    //       let allAutomationsSuccessful = true;

    //       // Loop through selected automations
    //       for (const automationIndex of selectedAutomations) {
    //         const automation = automations[automationIndex];

    //         // Ensure automation has the necessary fields
    //         if (
    //           !automation ||
    //           !automation.type ||
    //           !automation.template ||
    //           !automation.template.value ||
    //           !automation.tags
    //         ) {
    //           console.error(
    //             "Missing required automation data for automation index:",
    //             automationIndex
    //           );
    //           allAutomationsSuccessful = false; // Mark as failed
    //           break; // Exit the loop if required data is missing
    //         }

    //         const automationType = automation.type;
    //         const automationTemp = automation.template.value; // Assuming the template has a `value` field
    //         const automationAccountId = combinedaccountValues; // Use the selected account IDs

    //         // Ensure automationAccountId is not empty or invalid
    //         if (!automationAccountId || automationAccountId.length === 0) {
    //           console.error(
    //             "Missing required account IDs for automation index:",
    //             automationIndex
    //           );
    //           allAutomationsSuccessful = false; // Mark as failed
    //           break; // Exit the loop if account IDs are missing
    //         }

    //          // Check if automation has tags
    //      const hasTags = automation.tags && automation.tags.length > 0;
    //      // Process each account for the current automation
    //      for (const accountId of automationAccountId) {
    //        const account = accountdata.find((acc) => acc._id === accountId);

    //        if (!account) {
    //          console.warn(`Account with ID ${accountId} not found. Skipping.`);
    //          continue;
    //        }

    //        // const accountTags = account.tags;

    //        // // Check if automation tags match the account tags
    //        // const tagMatch = automation.tags.some((automationTag) =>
    //        //   accountTags.some(
    //        //     (accountTag) => accountTag.tagName === automationTag.tagName
    //        //   )
    //        // );

    //        // if (!tagMatch) {
    //        //   console.warn(
    //        //     `Tags do not match for automation index: ${automationIndex} and account ID: ${accountId}. Skipping this account.`
    //        //   );
    //        //   continue; // Skip this account if tags don't match
    //        // }
    //   // If automation has tags, ensure they match the account tags
    //   if (hasTags) {
    //    const accountTags = account.tags;

    //    const tagMatch = automation.tags.some((automationTag) =>
    //      accountTags.some(
    //        (accountTag) => accountTag.tagName === automationTag.tagName
    //      )
    //    );

    //    if (!tagMatch) {
    //      console.warn(
    //        `Tags do not match for automation index: ${automationIndex} and account ID: ${accountId}. Skipping this account.`
    //      );
    //      continue; // Skip this account if tags don't match
    //    }
    //  }
    //         try {
    //           // Await the result of the automation API call
    //           await selectAutomationApi(
    //             automationType,
    //             automationTemp,
    //             automationAccountId
    //           );
    //         } catch (error) {
    //           console.error("Error processing automation:", error);
    //           allAutomationsSuccessful = false; // Mark as failed
    //           break; // Exit the loop on error
    //         }
    //       }
    //     }
    //       // If all automations were successful, create the job
    //       if (allAutomationsSuccessful) {
    //         try {
    //           await createJob();
    //         } catch (error) {
    //           console.error("Failed to create job:", error);
    //           toast.error("Failed to create job");
    //         }
    //       } else {
    //         console.error("One or more automations failed, job creation aborted.");
    //         toast.error("Automations failed, job not created.");
    //       }
    //     };

    // Function to create job

    // const handleMove = async () => {
    //   let allAutomationsSuccessful = true; // Flag to track overall success

    //   for (const automationIndex of selectedAutomations) {
    //     const automation = automations[automationIndex];

    //     // Validate the required fields in automation
    //     if (
    //       !automation ||
    //       !automation.type

    //     ) {
    //       console.error(
    //         "Missing required automation data for automation index:",
    //         automationIndex
    //       );
    //       allAutomationsSuccessful = false;
    //       break;
    //     }

    //     const automationType = automation.type;
    //     const automationTemp = automation?.template?.value || null;
    //     const automationAccountIds = combinedaccountValues;

    //     if (!automationAccountIds || automationAccountIds.length === 0) {
    //       console.error(
    //         "Missing required account IDs for automation index:",
    //         automationIndex
    //       );
    //       allAutomationsSuccessful = false;
    //       break;
    //     }
    //     // Check if automation has tags
    //     const hasTags = automation.tags && automation.tags.length > 0;
    //     // Process each account for the current automation
    //     for (const accountId of automationAccountIds) {
    //       const account = accountdata.find((acc) => acc._id === accountId);

    //       if (!account) {
    //         console.warn(`Account with ID ${accountId} not found. Skipping.`);
    //         continue;
    //       }

    //       // const accountTags = account.tags;

    //       // // Check if automation tags match the account tags
    //       // const tagMatch = automation.tags.some((automationTag) =>
    //       //   accountTags.some(
    //       //     (accountTag) => accountTag.tagName === automationTag.tagName
    //       //   )
    //       // );

    //       // if (!tagMatch) {
    //       //   console.warn(
    //       //     `Tags do not match for automation index: ${automationIndex} and account ID: ${accountId}. Skipping this account.`
    //       //   );
    //       //   continue; // Skip this account if tags don't match
    //       // }
    //       // If automation has tags, ensure they match the account tags
    //       if (hasTags) {
    //         const accountTags = account.tags;

    //         const tagMatch = automation.tags.some((automationTag) =>
    //           accountTags.some(
    //             (accountTag) => accountTag.tagName === automationTag.tagName
    //           )
    //         );

    //         if (!tagMatch) {
    //           console.warn(
    //             `Tags do not match for automation index: ${automationIndex} and account ID: ${accountId}. Skipping this account.`
    //           );
    //           continue; // Skip this account if tags don't match
    //         }
    //       }
    //       try {
    //         // Execute the automation for the matched account
    //         await selectAutomationApi(automationType, automationTemp, [
    //           accountId
    //         ],automation);
    //       } catch (error) {
    //         console.error(
    //           `Error processing automation for account ID: ${accountId}:`,
    //           error
    //         );
    //         allAutomationsSuccessful = false;
    //         break;
    //       }
    //     }
    //   }

    //   // Create the job if all automations were successful
    //   if (allAutomationsSuccessful) {
    //     try {
    //       await createJob();
    //     } catch (error) {
    //       console.error("Failed to create job:", error);
    //       toast.error("Failed to create job");
    //     }
    //   } else {
    //     console.error("One or more automations failed, job creation aborted.");
    //     toast.error("Automations failed, job not created.");
    //   }
    // };

    // const createJob = () => {
    //   const myHeaders = {
    //     "Content-Type": "application/json",
    //   };

    //   const data = {
    //     accounts: combinedaccountValues,
    //     // stageid: selectedStage.value,
    //     pipeline: selectedPipeline.value,
    //     templatename: selectedtemp.value,
    //     jobname: jobName,
    //     jobassignees: combinedAssigneesValues,
    //     priority: priority,
    //     description: description,
    //     absolutedates: absoluteDate,
    //     startsin: startsin,
    //     startsinduration: startsInDuration,
    //     duein: duein,
    //     dueinduration: dueinduration,
    //     showinclientportal: clientFacingStatus,
    //     jobnameforclient: inputText,
    //     clientfacingstatus: selectedJob?.value,
    //     clientfacingDescription: clientDescription,
    //     startdate: startDate,
    //     enddate: dueDate,
    //   };

    //   const config = {
    //     method: "post",
    //     maxBodyLength: Infinity,
    //     url: `${JOBS_API}/workflow/jobs/newjob`,
    //     headers: myHeaders,
    //     data: JSON.stringify(data),
    //   };

    //   console.log(data);

    //   axios
    //     .request(config)
    //     .then((response) => {
    //       console.log("Job created successfully");
    //       // toast.success("Job created successfully");
    //       setDrawerOpen(false);
    //       toast.success("Job created successfully");
    //       navigate("/workflow/jobs/activejob");
    //     })
    //     .catch((error) => {
    //       console.error("Failed to create Job Template:", error);
    //       toast.error("Failed to create Job");
    //     });
    // };

    const handleMove = async () => {
      try {
        // 1. Create all jobs first
        const { accountJobMap } = await createJob();
        console.log("Job mapping created:", accountJobMap);

        // 2. Process automations for each account
        const automationResults = await Promise.allSettled(
          combinedaccountValues.map(async (accountId) => {
            const jobId = accountJobMap[accountId];
            if (!jobId) {
              throw new Error(`No job ID found for account ${accountId}`);
            }

            // Process each automation for this account
            await Promise.all(
              selectedAutomations.map(async (automationIndex) => {
                const automation = automations[automationIndex];
                if (!automation || !automation.type) {
                  throw new Error(
                    `Invalid automation at index ${automationIndex}`
                  );
                }

                const automationType = automation.type;
                const automationTemp = automation?.template?.value || null;

                // Check for tag matching if automation has tags
                if (automation.tags && automation.tags.length > 0) {
                  const account = accountdata.find(
                    (acc) => acc._id === accountId
                  );
                  if (!account) {
                    console.warn(
                      `Account with ID ${accountId} not found. Skipping.`
                    );
                    return;
                  }

                  const accountTags = account.tags || [];
                  const tagMatch = automation.tags.some((automationTag) =>
                    accountTags.some(
                      (accountTag) =>
                        accountTag.tagName === automationTag.tagName
                    )
                  );

                  if (!tagMatch) {
                    console.warn(
                      `Tags do not match for automation index: ${automationIndex} and account ID: ${accountId}. Skipping this account.`
                    );
                    return;
                  }
                }

                await selectAutomationApi(
                  automationType,
                  automationTemp,
                  [accountId],
                  automation,
                  automationType === "Create Task" ? jobId : null
                );
              })
            );
          })
        );

        // Check for failures
        const failedResults = automationResults.filter(
          (r) => r.status === "rejected"
        );
        if (failedResults.length > 0) {
          console.error("Some automations failed:", failedResults);
          toast.error(
            `${failedResults.length} automations failed (job was created)`
          );
        } else {
          toast.success("Job created successfully");
          navigate("/jobs/activejob");
        }
        setDrawerOpen(false);
        // handleDrawerClose();
        // fetchJobData();
      } catch (error) {
        console.error("Operation failed:", error);
        toast.error(`Operation failed: ${error.message}`);
      }
    };

    // const createJob = async () => {
    //   const myHeaders = new Headers();
    //   myHeaders.append("Content-Type", "application/json");

    //   // Create jobs for each account
    //   const jobCreationPromises = combinedaccountValues.map(async (accountId) => {
    //     const jobData = {
    //       accounts: [accountId], // Single account per job
    //       // stageid: selectedStage.value,
    //       pipeline: selectedPipeline.value,
    //       templatename: selectedtemp.value,
    //       jobname: jobName,
    //       jobassignees: combinedAssigneesValues,
    //       priority: priority,
    //       description: description,
    //       absolutedates: absoluteDate,
    //       startsin: startsin,
    //       startsinduration: startsInDuration,
    //       duein: duein,
    //       dueinduration: dueinduration,
    //       showinclientportal: clientFacingStatus,
    //       jobnameforclient: inputText,
    //       clientfacingstatus: selectedJob?.value,
    //       clientfacingDescription: clientDescription,
    //       startdate: startDate,
    //       enddate: dueDate,
    //     };

    //     const response = await fetch(`${JOBS_API}/workflow/jobs/newjob`, {
    //       method: "POST",
    //       headers: myHeaders,
    //       body: JSON.stringify(jobData),
    //     });

    //     if (!response.ok) {
    //       const error = await response.json();
    //       throw new Error(`Failed to create job for account ${accountId}: ${error.message}`);
    //     }

    //     const result = await response.json();
    //     if (!result.createdJobs || result.createdJobs.length === 0) {
    //       throw new Error(`No job created for account ${accountId}`);
    //     }

    //     // Return both account and job information
    //     return {
    //       accountId,
    //       jobId: result.createdJobs[0]._id, // Assuming one job per account
    //       jobData: result.createdJobs[0]
    //     };
    //   });

    //   try {
    //     const jobResults = await Promise.all(jobCreationPromises);

    //     // Create a mapping of accountId to jobId
    //     const accountJobMap = {};
    //     jobResults.forEach(result => {
    //       accountJobMap[result.accountId] = result.jobId;
    //     });

    //     return {
    //       success: true,
    //       accountJobMap,
    //       jobs: jobResults.map(r => r.jobData)
    //     };
    //   } catch (error) {
    //     console.error("Job creation failed:", error);
    //     throw error;
    //   }
    // };

    //         const createJob = async () => {
    //   const myHeaders = new Headers();
    //   myHeaders.append("Content-Type", "application/json");

    //   // Find the "Update client-facing job status" automation if it exists
    //   const clientStatusAutomation = automations.find(
    //     (automation) => automation.type === "Update client-facing job status"
    //   );

    //   // Create jobs for each account
    //   const jobCreationPromises = combinedaccountValues.map(
    //     async (accountId) => {
    //       const jobData = {
    //         accounts: [accountId], // Single account per job
    //         pipeline: selectedPipeline.value,
    //         templatename: selectedtemp.value,
    //         jobname: jobName,
    //         jobassignees: combinedAssigneesValues,
    //         priority: priority,
    //         description: description,
    //         absolutedates: absoluteDate,
    //         startsin: startsin,
    //         startsinduration: startsInDuration,
    //         duein: duein,
    //         dueinduration: dueinduration,
    //         // Use values from automation if it exists, otherwise use the default values
    //         showinclientportal: clientStatusAutomation
    //           ? clientStatusAutomation.visibilityForClient
    //           : clientFacingStatus,
    //         jobnameforclient: inputText,
    //         clientfacingstatus: clientStatusAutomation
    //           ? clientStatusAutomation.selectedClientStatus?.value
    //           : selectedJob?.value,
    //         clientfacingDescription: clientStatusAutomation
    //           ? clientStatusAutomation.statusDescription
    //           : clientDescription,
    //         startdate: startDate,
    //         enddate: dueDate,
    //       };

    //       const response = await fetch(`${JOBS_API}/workflow/jobs/newjob`, {
    //         method: "POST",
    //         headers: myHeaders,
    //         body: JSON.stringify(jobData),
    //       });
    //       console.log("jobs automation creation", jobData);
    //       if (!response.ok) {
    //         const error = await response.json();
    //         throw new Error(
    //           `Failed to create job for account ${accountId}: ${error.message}`
    //         );
    //       }

    //       const result = await response.json();
    //       if (!result.createdJobs || result.createdJobs.length === 0) {
    //         throw new Error(`No job created for account ${accountId}`);
    //       }

    //       // Return both account and job information
    //       return {
    //         accountId,
    //         jobId: result.createdJobs[0]._id, // Assuming one job per account
    //         jobData: result.createdJobs[0],
    //       };
    //     }
    //   );

    //   try {
    //     const jobResults = await Promise.all(jobCreationPromises);

    //     // Create a mapping of accountId to jobId
    //     const accountJobMap = {};
    //     jobResults.forEach((result) => {
    //       accountJobMap[result.accountId] = result.jobId;
    //     });

    //     return {
    //       success: true,
    //       accountJobMap,
    //       jobs: jobResults.map((r) => r.jobData),
    //     };
    //   } catch (error) {
    //     console.error("Job creation failed:", error);
    //     throw error;
    //   }
    // };
    const createJob = async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      // Find relevant automations
      const clientStatusAutomation = automations.find(
        (automation) => automation.type === "Update client-facing job status"
      );

      const assigneesAutomation = automations.find(
        (automation) => automation.type === "Update job assignees"
      );

      // Create jobs for each account
      const jobCreationPromises = combinedaccountValues.map(
        async (accountId) => {
          // Start with the base assignees from combinedValues
          let finalAssignees = [...combinedAssigneesValues];

          // Apply assignees automation if it exists
          if (assigneesAutomation) {
            // Add new assignees (avoid duplicates)
            assigneesAutomation.addAssignees.forEach((assignee) => {
              if (!finalAssignees.includes(assignee._id)) {
                finalAssignees.push(assignee._id);
              }
            });

            // Remove specified assignees
            finalAssignees = finalAssignees.filter(
              (assigneeId) =>
                !assigneesAutomation.removeAssignees.some(
                  (removeAssignee) => removeAssignee._id === assigneeId
                )
            );
          }

          const jobData = {
            accounts: [accountId],
            pipeline: selectedPipeline.value,
            templatename: selectedtemp.value,
            jobname: jobName,
            jobassignees: finalAssignees, // Use the modified assignees list
            priority: priority,
            description: description,
            absolutedates: absoluteDate,
            startsin: startsin,
            startsinduration: startsInDuration,
            duein: duein,
            dueinduration: dueinduration,
            showinclientportal: clientStatusAutomation
              ? clientStatusAutomation.visibilityForClient
              : clientFacingStatus,
            jobnameforclient: inputText,
            clientfacingstatus: clientStatusAutomation
              ? clientStatusAutomation.selectedClientStatus?.value
              : selectedJob?.value,
            clientfacingDescription: clientStatusAutomation
              ? clientStatusAutomation.statusDescription
              : clientDescription,
            startdate: startDate,
            enddate: dueDate,
          };

          const response = await fetch(`${JOBS_API}/workflow/jobs/newjob`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(jobData),
          });

          console.log("jobs automation creation", jobData);
          if (!response.ok) {
            const error = await response.json();
            throw new Error(
              `Failed to create job for account ${accountId}: ${error.message}`
            );
          }

          const result = await response.json();
          if (!result.createdJobs || result.createdJobs.length === 0) {
            throw new Error(`No job created for account ${accountId}`);
          }

          return {
            accountId,
            jobId: result.createdJobs[0]._id,
            jobData: result.createdJobs[0],
          };
        }
      );

      try {
        const jobResults = await Promise.all(jobCreationPromises);

        const accountJobMap = {};
        jobResults.forEach((result) => {
          accountJobMap[result.accountId] = result.jobId;
        });

        return {
          success: true,
          accountJobMap,
          jobs: jobResults.map((r) => r.jobData),
        };
      } catch (error) {
        console.error("Job creation failed:", error);
        throw error;
      }
    };
    return (
      <Box p={2}>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          Automations for{" "}
          <Typography variant="h6" ml={1}>
            {combinedaccountValues
              .map((accountId) => {
                const account = accountdata.find(
                  (account) => account._id === accountId
                );
                return account ? account.accountName : null;
              })
              .join(", ")}
          </Typography>
        </Typography>

        <Box>
          {automations.map((automation, index) => {
            // Check if the automation's tags match any of the selected account tags
            // const hasMatchingTags = automation.tags.some((automationTag) =>
            //   accountTags.some(
            //     (accountTag) => accountTag._id === automationTag._id
            //   )
            // );
            const hasMatchingTags = automation.tags?.length
              ? automation.tags.some((automationTag) =>
                  accountTags.some(
                    (accountTag) => accountTag._id === automationTag._id
                  )
                )
              : true;
            return (
              <Box key={index} sx={{ marginBottom: 2 }}>
                {/* <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedAutomations.includes(index)}
                    onChange={() => handleCheckboxChange(index)}
                    disabled={!hasMatchingTags} // Disable checkbox if tags don't match
                  />
                }
              /> */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedAutomations.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                        disabled={!hasMatchingTags} // Disable checkbox if tags don't match
                      />
                    }
                  />
                  {!hasMatchingTags && (
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ fontStyle: "italic" }}
                    >
                      The tags do not match the account
                    </Typography>
                  )}
                </Box>
                {automation.type === "Update account tags" ? (
                  <Box>
                    <Box sx={{ width: 500 }}>
                      <Typography variant="body2" sx={{ marginBottom: 1 }}>
                        Add tags to account
                      </Typography>
                      <Select
                        multiple
                        displayEmpty
                        multiline
                        size="small"
                        value={automation.addTags.map((tag) => tag._id)}
                        onChange={(event) =>
                          handleTagChange(index, "addTags", event)
                        }
                        renderValue={(selected) =>
                          selected.length === 0 ? (
                            <Typography color="gray">
                              Select tags to add
                            </Typography>
                          ) : (
                            <Box
                              sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                            >
                              {automation.addTags.map((tag) => (
                                <Chip
                                  key={tag._id}
                                  label={tag.tagName}
                                  sx={{
                                    backgroundColor: tag.tagColour,
                                    color: "#fff",
                                    fontWeight: "500",
                                    borderRadius: "20px",
                                  }}
                                />
                              ))}
                            </Box>
                          )
                        }
                        fullWidth
                        MenuProps={MenuProps}
                        sx={{ width: "100%", marginBottom: 2 }}
                      >
                        {tagsoptions
                          .filter(
                            (option) =>
                              !automation.removeTags.some(
                                (tag) => tag._id === option.value
                              )
                          ) // Hide selected removeTags
                          .map((option) => {
                            // Create a hidden canvas to measure text width
                            const canvas = document.createElement("canvas");
                            const context = canvas.getContext("2d");
                            context.font = "14px Arial"; // Match the MenuItem font style

                            const textWidth = context.measureText(
                              option.label
                            ).width; // Get exact width
                            const dynamicWidth = Math.min(textWidth + 20, 200); // Add padding & set max width

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
                                  display: "flex",
                                  justifyContent: "center",
                                  padding: "4px 9px",
                                  whiteSpace: "nowrap", // Prevent text wrapping
                                  minWidth: `${dynamicWidth}px`,
                                  maxWidth: `${dynamicWidth}px`, // Set dynamic max width
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

                      <Typography variant="body2" sx={{ marginBottom: 1 }}>
                        Remove tags from account
                      </Typography>
                      <Select
                        multiple
                        size="small"
                        multiline
                        displayEmpty
                        value={automation.removeTags.map((tag) => tag._id)}
                        onChange={(event) =>
                          handleTagChange(index, "removeTags", event)
                        }
                        renderValue={(selected) =>
                          selected.length === 0 ? (
                            <Typography color="gray">
                              Select tags to remove
                            </Typography>
                          ) : (
                            <Box
                              sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                            >
                              {automation.removeTags.map((tag) => (
                                <Chip
                                  key={tag._id}
                                  label={tag.tagName}
                                  sx={{
                                    backgroundColor: tag.tagColour,
                                    color: "#fff",
                                    fontWeight: "500",
                                    borderRadius: "20px",
                                  }}
                                />
                              ))}
                            </Box>
                          )
                        }
                        MenuProps={MenuProps}
                        sx={{ width: "100%", marginBottom: 2 }}
                      >
                        {tagsoptions
                          .filter(
                            (option) =>
                              !automation.addTags.some(
                                (tag) => tag._id === option.value
                              )
                          ) // Hide selected removeTags
                          .map((option) => {
                            // Create a hidden canvas to measure text width
                            const canvas = document.createElement("canvas");
                            const context = canvas.getContext("2d");
                            context.font = "14px Arial"; // Match the MenuItem font style

                            const textWidth = context.measureText(
                              option.label
                            ).width; // Get exact width
                            const dynamicWidth = Math.min(textWidth + 20, 200); // Add padding & set max width

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
                                  display: "flex",
                                  justifyContent: "center",
                                  padding: "4px 9px",
                                  whiteSpace: "nowrap", // Prevent text wrapping
                                  minWidth: `${dynamicWidth}px`,
                                  maxWidth: `${dynamicWidth}px`, // Set dynamic max width
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

                      {/* Warning Message */}
                      <Alert severity="warning" sx={{ marginBottom: 2 }}>
                        This automation can affect conditions for automations
                        below
                      </Alert>
                    </Box>
                  </Box>
                ) : automation.type === "Update job assignees" ? (
                          <Box>
                            <Box sx={{ width: 500 }}>
                              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                                Add assignees to job
                              </Typography>
                
                              <Select
                                multiple
                                displayEmpty
                                multiline
                                size="small"
                                value={automation.addAssignees.map((assignee) => assignee._id)}
                                onChange={(event) =>
                                  handleAssigneeChange(index, "addAssignees", event)
                                }
                                renderValue={(selected) =>
                                  selected.length === 0 ? (
                                    <Typography color="gray">
                                      Select assignees to add
                                    </Typography>
                                  ) : (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                      {automation.addAssignees.map((assignee) => (
                                        <Chip
                                          key={assignee._id}
                                          label={assignee.username}
                                          sx={{
                                            backgroundColor: '#e0e0e0',
                                            color: "#000",
                                            fontWeight: "500",
                                            borderRadius: "20px",
                                          }}
                                        />
                                      ))}
                                    </Box>
                                  )
                                }
                                fullWidth
                                MenuProps={MenuProps}
                                sx={{ width: "100%", marginBottom: 2 }}
                              >
                                {assigneeOptions.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                    sx={{
                                      '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                      },
                                    }}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                
                              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                                Remove assignees from job
                              </Typography>
                
                              <Select
                                multiple
                                size="small"
                                multiline
                                displayEmpty
                                value={automation.removeAssignees.map((assignee) => assignee._id)}
                                onChange={(event) =>
                                  handleAssigneeChange(index, "removeAssignees", event)
                                }
                                renderValue={(selected) =>
                                  selected.length === 0 ? (
                                    <Typography color="gray">
                                      Select assignees to remove
                                    </Typography>
                                  ) : (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                      {automation.removeAssignees.map((assignee) => (
                                        <Chip
                                          key={assignee._id}
                                         label={assignee.username}
                                          sx={{
                                            backgroundColor: '#e0e0e0',
                                            color: "#000",
                                            fontWeight: "500",
                                            borderRadius: "20px",
                                          }}
                                        />
                                      ))}
                                    </Box>
                                  )
                                }
                                MenuProps={MenuProps}
                                sx={{ width: "100%", marginBottom: 2 }}
                              >
                                {assigneeOptions.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                    sx={{
                                      '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                      },
                                    }}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                
                              <Alert severity="warning" sx={{ marginBottom: 2 }}>
                                This automation can affect job assignment notifications
                              </Alert>
                            </Box>
                          </Box>
                          
                        ) : automation.type === "Update client-facing job status" ? (
                  <Box>
                    <Typography variant="body1">
                      <strong>Type:</strong> {automation.type}
                      {automation.visibilityForClient &&
                        automation.selectedClientStatus && (
                          <span>
                            {" "}
                            : {automation.selectedClientStatus.label}
                          </span>
                        )}
                      {!automation.visibilityForClient && (
                        <span> : Hide status</span>
                      )}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body1">
                      <strong>Type:</strong> {automation.type}
                    </Typography>

                    <Typography variant="body1">
                      <strong>Template:</strong> {automation.template.label}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Tags:</strong>
                    </Typography>
                    {automation.tags.map((tag) => (
                      <Box
                        key={tag._id}
                        sx={{
                          display: "inline-block",
                          backgroundColor: tag.tagColour,
                          color: "white",
                          borderRadius: "15px",
                          padding: "3px 8px",
                          marginRight: "4px",
                        }}
                      >
                        {tag.tagName}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 5 }}>
          <Button
            variant="contained"
            onClick={handleMove}
            sx={{
              backgroundColor: "var(--color-save-btn)", // Normal background

              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)", // Hover background color
              },
              width: "80px",
              borderRadius: "15px",
            }}
          >
            Move
          </Button>
          <Button
            variant="outlined"
            onClick={() => setDrawerOpen(false)}
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
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <form>
          <Box mt={2} mb={1}>
            <hr />
          </Box>
          <Box
            className="bulk-job-form"
            sx={{ height: "88vh", overflowY: "auto" }}
          >
            <Grid spacing={2}>
              <Grid padding={1}>
                <Box>
                  <InputLabel sx={{ color: "black" }}>
                    Select Accounts
                  </InputLabel>
                  <AccountMultiSelectDropdown
                    value={selectedaccount}
                    onChange={handleAccountChange}
                    placeholder="Accounts"
                  />
                  {/* <Autocomplete
                    multiple
                    options={accountoptions}
                    value={selectedaccount}
                    onChange={handleAccountChange}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{ cursor: "pointer", margin: "5px 10px" }}
                      >
                        {option.label}
                      </Box>
                    )}
                    renderTags={(value, getTagProps) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {value.map((option, index) => (
                          <Chip
                            key={option.value}
                            label={option.label}
                            {...getTagProps({ index })}
                            sx={{ maxWidth: "100%",cursor:'pointer' }} // Ensures wrapping within the container
                          />
                        ))}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Accounts"
                        variant="outlined"
                        size="small"
                        multiline
                        sx={{ backgroundColor: "#fff",cursor:'pointer' }}
                      />
                    )}
                    sx={{ width: "100%", marginTop: "8px" }}
                  /> */}
                  {/* <FormControl sx={{ width: "100%", marginTop: "8px" }}>
                    <Select
                      multiple
                      multiline
                      size="small"
                      value={selectedaccount}
                      onChange={(event) => {
                        const newSelected = event.target.value;
                        setSelectedaccount(newSelected);
                        setCombinedaccountValues(
                          newSelected.map((option) => option.value)
                        );
                      }}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}
                        >
                          {selected.map((option) => (
                            <Chip
                              key={option.value}
                              label={option.label}
                              sx={{ maxWidth: "100%", cursor: "pointer" }}
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {accountoptions.map((option) => (
                        <MenuItem key={option.value} value={option}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl> */}
                </Box>

                <Box mt={2}>
                  <label className="job-input-label">Pipeline</label>

                  <Autocomplete
                    options={optionpipeline}
                    getOptionLabel={(option) => option.label}
                    value={selectedPipeline}
                    onChange={(event, newValue) =>
                      handlePipelineChange(newValue)
                    }
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
                    // clearOnEscape // Enable clearable functionality
                  />
                </Box>

                <Box mt={2}>
                  <label className="job-input-label">Stage</label>
                  <Autocomplete
                    disabled // Disable the Autocomplete input
                    size="small"
                    options={stagesoptions}
                    getOptionLabel={(option) => option.label}
                    value={selectedStage}
                    onChange={handleStageChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Stages"
                        variant="outlined"
                        className="add-jobs-select-dropdown"
                      />
                    )}
                    sx={{ width: "100%", marginTop: "8px" }}
                  />
                </Box>
                <Box mt={2}>
                  <label className="job-input-label">Job Template</label>
                  <Autocomplete
                    options={optiontemp}
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
                      <TextField
                        {...params}
                        sx={{ backgroundColor: "#fff" }}
                        placeholder="Job Template"
                        variant="outlined"
                        size="small"
                      />
                    )}
                    sx={{ width: "100%", marginTop: "8px" }}
                    clearOnEscape // Enable clearable functionality
                  />
                </Box>
                <Box mt={2}>
                  <label className="job-input-label">Name</label>
                  <TextField
                    fullWidth
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                    margin="normal"
                    size="small"
                    placeholder="Job Name"
                    sx={{ backgroundColor: "#fff" }}
                  />
                </Box>
                <Box mt={2}>
                  <label className="job-input-label">Job Assignees</label>
                  {/* <Autocomplete
                    multiple
                    sx={{ marginTop: "8px" }}
                    options={assigneesoptions}
                    size="small"
                    getOptionLabel={(option) => option.label}
                    value={selectedUser}
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
                        placeholder="Job Assignees"
                        sx={{ backgroundColor: "#fff" }}
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                  /> */}
                  <MultiSelectDropdown
                    value={selectedUser}
                    onChange={handleUserChange}
                    placeholder="Job Assignees"
                  />
                </Box>
                <Box mt={2}>
                  <Priority
                    onPriorityChange={handlePriorityChange}
                    selectedPriority={priority}
                  />
                </Box>
                <Box mt={3}>
                  <Editor
                    initialContent={description}
                    onChange={handleEditorChange}
                  />
                </Box>
                <Box mt={7}>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Typography variant="h6">Start and Due Date</Typography>
                    <Box className="absolutes-dates">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={absoluteDate}
                            // onChange={handleAbsolutesDates}
                            onChange={(event) =>
                              handleAbsolutesDates(event.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label={"Absolute Date"}
                      />
                    </Box>
                  </Box>
                </Box>
                {absoluteDate && (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                      <Typography>Start Date</Typography>
                      <DatePicker
                        format="DD/MM/YYYY"
                        sx={{ width: "100%", backgroundColor: "#fff" }}
                        // value={startDate}
                        // onChange={handleStartDateChange}
                        value={startDate}
                        onChange={handleStartDateChange}
                        renderInput={(params) => (
                          <TextField {...params} size="small" />
                        )}
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                      <Typography>Due Date</Typography>
                      <DatePicker
                        format="DD/MM/YYYY"
                        sx={{ width: "100%", backgroundColor: "#fff" }}
                        // value={dueDate}
                        // onChange={handleDueDateChange}
                        value={dueDate}
                        onChange={handleDueDateChange}
                        renderInput={(params) => (
                          <TextField {...params} size="small" />
                        )}
                      />
                    </Box>
                  </>
                )}
                {!absoluteDate && (
                  <>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography>Start In</Typography>
                      <TextField
                        size="small"
                        margin="normal"
                        fullWidth
                        placeholder="0"
                        sx={{ ml: 1, backgroundColor: "#fff" }}
                        value={startsin}
                        onChange={(e) => setstartsin(e.target.value)}
                      />
                      <Autocomplete
                        options={dayOptions}
                        size="small"
                        getOptionLabel={(option) => option.label}
                        value={
                          startsInDuration
                            ? dayOptions.find(
                                (option) => option.value === startsInDuration
                              )
                            : null
                        }
                        onChange={handleStartInDateChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            sx={{ backgroundColor: "#fff" }}
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            sx={{ cursor: "pointer", margin: "5px 10px" }}
                          >
                            {option.label}
                          </Box>
                        )}
                        // value={dayOptions.find((option) => option.value === startsInDuration) || null}
                        className="job-template-select-dropdown"
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography>Due In</Typography>
                      <TextField
                        size="small"
                        margin="normal"
                        fullWidth
                        sx={{ ml: 1.5, backgroundColor: "#fff" }}
                        value={duein}
                        placeholder="0"
                        onChange={(e) => setduein(e.target.value)}
                        // onChange={(e) => setduein(e.target.value)}
                      />

                      <Autocomplete
                        options={dayOptions}
                        getOptionLabel={(option) => option.label}
                        // onChange={handledueindateChange}
                        value={
                          dueinduration
                            ? dayOptions.find(
                                (option) => option.value === dueinduration
                              )
                            : null
                        }
                        onChange={handleDueInDateChange}
                        size="small"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            sx={{ backgroundColor: "#fff" }}
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            sx={{ cursor: "pointer", margin: "5px 10px" }}
                          >
                            {option.label}
                          </Box>
                        )}
                        // value={dayOptions.find((option) => option.value === dueinduration) || null}
                        className="job-template-select-dropdown"
                      />
                    </Box>
                  </>
                )}

                <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                                  value={selectedJob}
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
                                          backgroundColor:
                                            option.clientfacingColour,
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
                </Box>
              </Grid>
            </Grid>
            <Box mt={3}>
              <hr />
            </Box>

            <Box sx={{ pt: 2, display: "flex", alignItems: "center", gap: 5 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={createjob}
                sx={{
                  backgroundColor: "var(--color-save-btn)", // Normal background

                  "&:hover": {
                    backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                  },
                  width: "80px",
                  borderRadius: "15px",
                }}
              >
                Add
              </Button>
              {/* <Link to='/'><Button variant="outlined" onClick={handleJobFormClose}>Cancel</Button></Link> */}
              <Button
                onClick={handleJobFormClose}
                variant="outlined"
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
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {/* <Box sx={{ width: 400, padding: 2 }}>
                <Typography variant="h6">Automations</Typography>
                {automations.length > 0 && (
                  <Box>
                    {automations.map((automation, index) => (
                      <Box key={index}>
                        <Typography variant="body1">
                          <strong>Type:</strong> {automation.type}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Template:</strong> {automation.template.label}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Tags:</strong>
                        </Typography>
                        {automation.tags.map((tag) => (
                          <Box
                            key={tag._id}
                            sx={{
                              display: "inline-block",
                              backgroundColor: tag.tagColour,
                              color: "white",
                              borderRadius: "8px",
                              padding: "2px 6px",
                              marginRight: "4px",
                            }}
                          >
                            {tag.tagName}
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Box>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setDrawerOpen(false);
                  }}
                >
                  Proceed
                </Button>
              </Box> */}
        <Box sx={{ width: 550 }}>
          <DrawerContent selectedAccounts={combinedaccountValues} />
        </Box>
      </Drawer>
    </LocalizationProvider>
  );
};

export default CreateBulkJob;
