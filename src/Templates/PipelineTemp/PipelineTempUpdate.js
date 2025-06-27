import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Drawer,
  Checkbox,
  Chip,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Autocomplete,
  TextField,
  InputLabel,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  InputAdornment,FormControl,Select,OutlinedInput
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuPlusCircle, LuPenLine } from "react-icons/lu";
import { RxDragHandleDots2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import AddAutomationDrawer from "./AddAutomationDrawer";
import { GoDotFill } from "react-icons/go";
import axios from "axios";
import EditAutomationDrawer from "./EditAutomationDrawer";
const PipelineTempUpdate = () => {
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
  const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const JOBS_API = process.env.REACT_APP_JOBS_TEMP_URL;
  const SORTJOBS_API = process.env.REACT_APP_SORTJOBS_URL;
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL;
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
  const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
  
  const { id } = useParams();
  const navigate = useNavigate();

  // sort jobs
  const [sortbyjobs, setSortbyJobs] = useState([]);
  const [selectedSortByJob, setSelectedSortByJob] = useState("");
  const handleSortingByJobs = (selectedOptions) => {
    setSelectedSortByJob(selectedOptions);
  };
  useEffect(() => {
    fetchSortByJob();
  }, []);

  const fetchSortByJob = async () => {
    try {
      const url = `${SORTJOBS_API}/sortjobs/sortjobby`;
      const response = await fetch(url);
      const data = await response.json();
      setSortbyJobs(data.sortJobsBy);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const optionsort = sortbyjobs.map((sort) => ({
    value: sort._id,
    label: sort.description,
  }));

  const [Account_id, setAccount_id] = useState(false);
  const handleAccount_idChange = (event) => {
    setAccount_id(event.target.checked);
  };
  const [Days_on_stage, setDays_on_stage] = useState(false);
  const handleDays_on_stageChange = (event) => {
    setDays_on_stage(event.target.checked);
  };
  const [Account_tags, setAccount_tags] = useState(false);
  const handleAccount_tagsChange = (event) => {
    setAccount_tags(event.target.checked);
  };
   const [clientFacing_status, setClientFacing_status]= useState(false);
    const handleClientFacing_status = (event) => {
      setClientFacing_status(event.target.checked);
    };
  const [startDate, setStartDate] = useState(false);
  const handleStartDateChange = (event) => {
    setStartDate(event.target.checked);
  };
  const [Name, setName] = useState(false);
  const handleNameSwitchChange = (event) => {
    setName(event.target.checked);
  };
  const [Due_date, setDue_date] = useState(false);
  const handleDue_dateChange = (event) => {
    setDue_date(event.target.checked);
  };
  const [Priority, setPriority] = useState(false);
  const [Description, setDescription] = useState(false);
  const [Assignees, setAssignees] = useState(false);
  const handlePriorityChange = (event) => {
    setPriority(event.target.checked);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.checked);
  };
  const handleAssigneesChange = (event) => {
    setAssignees(event.target.checked);
  };
  const [stages, setStages] = useState([]);
  const handleAddStage = (index) => {
    const newStage = {
      name: "",
      conditions: [],
      automations: [],
      autoMove: false,
      showDropdown: false,
      activeAction: null,
    };

    // Insert new stage at the specified index
    const updatedStages = [...stages];
    updatedStages.splice(index, 0, newStage);

    setStages(updatedStages);
  };
  // const handleAddStage = () => {
  //   const newStage = {
  //     name: "",
  //     conditions: [],
  //     automations: [],
  //     autoMove: false,
  //     showDropdown: false,
  //     activeAction: null,
  //   };
  //   setStages([...stages, newStage]);
  // };
  const handleStageNameChange = (e, index) => {
    const newStages = [...stages];
    newStages[index].name = e.target.value;
    setStages(newStages);

    // Clear error when user types
    const newStageErrors = [...stageNameErrors];
    newStageErrors[index] = e.target.value ? "" : "Stage name is required";
    setStageNameErrors(newStageErrors);
  };

  const handleDeleteStage = (index) => {
    const updatedStages = [...stages];
    updatedStages.splice(index, 1);
    setStages(updatedStages);
  };

  const handleAutoMoveChange = (index) => {
    const updatedStages = stages.map((stage, idx) =>
      idx === index ? { ...stage, autoMove: !stage.autoMove } : stage
    );
    setStages(updatedStages);
  };

  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);
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

  const handleUserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
    const selectedValues = selectedOptions.map((option) => option.value);
    setCombinedValues(selectedValues);
  };
  const options = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  //Default Jobt template get
  const [Defaulttemp, setDefaultTemp] = useState([]);
  const [selectedJobtemp, setselectedJobTemp] = useState(() => {
    return localStorage.getItem("selectedtemp") || null;
  });
  const handleJobtemp = async (event, selectedtemp) => {
    setselectedJobTemp(selectedtemp);
  };
  useEffect(() => {
    fetchtemp();
  }, []);

  const fetchtemp = async () => {
    try {
      const url = `${JOBS_API}/workflow/jobtemplate/jobtemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setDefaultTemp(data.JobTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const optiontemp = Defaulttemp.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  const [pipelineData, setPipelineData] = useState([]);

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
      setPipelineData(data.pipeline);
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
    }
  };

  const [piplineName, setPipeLineName] = useState("");

  //data send
  const updatePipe = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      pipelineName: piplineName,
      availableto: combinedValues,
      sortjobsby: selectedSortByJob.value,
      defaultjobtemplate: selectedJobtemp.value,
      accountId: Account_id,
      description: Description,
      duedate: Due_date,
      accounttags: Account_tags,
      priority: Priority,
      days_on_Stage: Days_on_stage,
      assignees: Assignees,
      name: Name,
      clientFacing_status:clientFacing_status,
      startdate: startDate,
      stages: stages,
    });
console.log("raw",raw)
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${id}`;
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        toast.success("Pipeline Updated successfully");
        navigate("/firmtemp/pipelines");
      })
      .catch((error) => {
        toast.error("Failed to Updated pipeline");
      });
  };
  const [stageNameErrors, setStageNameErrors] = useState([]);
  const validateForm = () => {
    let isValid = true;

    // Validate stage names
    const newStageErrors = stages.map((stage) =>
      stage.name ? "" : "Stage name is required"
    );
    setStageNameErrors(newStageErrors);

    if (newStageErrors.some((error) => error !== "")) {
      isValid = false;
    }

    return isValid;
  };

  const updateSavePipe = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      pipelineName: piplineName,
      availableto: combinedValues,
      sortjobsby: selectedSortByJob.value,
      defaultjobtemplate: selectedJobtemp.value,
      accountId: Account_id,
      description: Description,
      duedate: Due_date,
      accounttags: Account_tags,
      priority: Priority,
      days_on_Stage: Days_on_stage,
      assignees: Assignees,
      name: Name,
       clientFacing_status:clientFacing_status,
      startdate: startDate,
      stages: stages,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${id}`;
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        toast.success("Pipeline Updated successfully");
        // setTimeout(() => navigate("/createpipeline"), 1000);
      })
      .catch((error) => {
        toast.error("Failed to Updated pipeline");
      });
  };

  //get all templateName Record

  useEffect(() => {
    const fetchPipelineData = async () => {
      try {
        const url = `${PIPELINE_API}/workflow/pipeline/pipeline/pipelinelist/${id}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch pipeline data");
        }
        const data = await response.json();
        console.log(data.pipelineTemplate);
        setPipelineData(data.pipelineTemplate);

        setStages(data.pipelineTemplate.stages);
        console.log("janavi", data.pipelineTemplate.stages);

        if (data.pipelineTemplate && data.pipelineTemplate.availableto) {
          const assigneesData = data.pipelineTemplate.availableto.map(
            (assignee) => ({
              value: assignee._id,
              label: assignee.username,
            })
          );
          setSelectedUser(assigneesData);

          const selectedValues = assigneesData.map((option) => option.value);
          setCombinedValues(selectedValues);
        }

        if (data.pipelineTemplate && data.pipelineTemplate.sortjobsby) {
          const sortjobsbyData = {
            value: data.pipelineTemplate.sortjobsby._id,
            label: data.pipelineTemplate.sortjobsby.description,
          };

          setSelectedSortByJob(sortjobsbyData);
        }

        if (data.pipelineTemplate && data.pipelineTemplate.defaultjobtemplate) {
          const defaultjobtemplateData = {
            value: data.pipelineTemplate.defaultjobtemplate._id,
            label: data.pipelineTemplate.defaultjobtemplate.templatename,
          };

          setselectedJobTemp(defaultjobtemplateData);
        }
        setPipeLineName(data.pipelineTemplate.pipelineName);
        setAccount_id(data.pipelineTemplate.accountId);
        setPriority(data.pipelineTemplate.priority);
        setDays_on_stage(data.pipelineTemplate.days_on_Stage);
        setAccount_tags(data.pipelineTemplate.accounttags);
        setName(data.pipelineTemplate.name);
        setDue_date(data.pipelineTemplate.duedate);
        setDescription(data.pipelineTemplate.description);
        setAssignees(data.pipelineTemplate.assignees);
        setStartDate(data.pipelineTemplate.startdate);
        setClientFacing_status(data.pipelineTemplate.clientFacing_status)
      } catch (error) {
        console.error("Error fetching pipeline data:", error);
      }
    };

    fetchPipelineData();
  }, []);

  const handleButtonClick = () => {
    updatePipe();
    navigate("/firmtemp/pipelines");
  };
  // const hanleCloseupdate = ()=>{
  //   navigate("/firmtemp/templates/pipelines")
  // }
  const [isFormFilled, setIsFormFilled] = useState(false);
  const hanleCloseupdate = () => {
    if (isFormFilled) {
      const confirmCancel = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (confirmCancel) {
        navigate("/firmtemp/pipelines");
      }
    } else {
      navigate("/firmtemp/pipelines");
    }
  };
  useEffect(() => {
    // Check if form is filled
    const checkIfFormFilled = () => {
      if (
        piplineName ||
        selectedUser ||
        selectedSortByJob ||
        selectedJobtemp ||
        Account_id ||
        Days_on_stage ||
        Account_tags ||
        startDate ||
        Name ||
        Due_date ||
        Description ||
        Assignees ||
        Priority ||
        stages
      ) {
        setIsFormFilled(true);
      } else {
        setIsFormFilled(false);
      }
    };

    checkIfFormFilled();
  }, [
    piplineName,
    selectedUser,
    selectedSortByJob,
    selectedJobtemp,
    Account_id,
    Days_on_stage,
    Account_tags,
    startDate,
    Name,
    Due_date,
    Description,
    Assignees,
    Priority,
    stages,
  ]);

  //Automation code
  const [anchorEl, setAnchorEl] = useState(null);
  const [ehitAnchorEl, setEditAnchorEl] = useState(null);
  const [stageAutomationTags, setStageAutomationTags] = useState([]);
  const [isConditionsEditFormOpen, setIsConditionsEditFormOpen] =
    useState(false);
  // const handleClick = (event, index) => {
  //   setAnchorEl(event.currentTarget);
  //   SetStageSelected(index);  // Save the selected stage index
  //   console.log(index)
  // };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditClick = (event, index) => {
    setEditAnchorEl(event.currentTarget);
    SetStageSelected(index); // Save the selected stage index
    console.log(index);
  };
  const handleEditConditions = (index) => {
    const currentAutomation = selectedAutomationData[index];
    console.log("stageindex", currentAutomation);
    setSelectedAutomationIndex(index);
    setStageAutomationTags(currentAutomation?.tags || []); // Use existing tags or default to an empty array
    console.log(currentAutomation.tags);
    setIsConditionsEditFormOpen(true); // Open the drawer
  };
  const handleDeleteAutomation = (index) => {
    const updatedAutomations = selectedAutomationData.filter(
      (_, i) => i !== index
    );
    setSelectedAutomationData(updatedAutomations);
  };
  const handleEditGoBack = () => {
    setIsConditionsEditFormOpen(false);
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
  const handleTagChange = (index, type, event) => {
    const { value } = event.target; // Array of selected tag IDs
  
    setSelectedAutomationData((prev) => {
      const updatedAutomations = [...prev];
  
      // Get the correct tag options list
      const tagOptions = tagsoptions;
  
      // Map selected tag IDs to tag objects with _id, tagName, and tagColour
      const selectedTags = value.map((tagId) => {
        const tag = tagOptions.find((t) => t.value === tagId);
        return tag ? { _id: tag.value, tagName: tag.label, tagColour: tag.colour } : null;
      }).filter(Boolean); // Remove null values
  
      // Prevent duplicate selections
      const uniqueTags = selectedTags.filter(
        (tag, idx, self) => self.findIndex((t) => t._id === tag._id) === idx
      );
  
      // Ensure the tag is removed from the opposite category
      if (type === "addTags") {
        updatedAutomations[index].removeTags = updatedAutomations[index].removeTags.filter(
          (tag) => !uniqueTags.some((t) => t._id === tag._id)
        );
      } else if (type === "removeTags") {
        updatedAutomations[index].addTags = updatedAutomations[index].addTags.filter(
          (tag) => !uniqueTags.some((t) => t._id === tag._id)
        );
      }
  
      updatedAutomations[index] = {
        ...updatedAutomations[index],
        [type]: uniqueTags,
      };
  
      return updatedAutomations;
    });

  };

    const handleAssigneeChange = (index, type, event) => {
    const { value } = event.target; // Array of selected tag IDs

    setSelectedAutomationData((prev) => {
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
  const handleMenuItemSelect = (type) => {
    let newAutomation = {};

    switch (type) {
      case "Create Task":
        newAutomation = { type: "Create Task", template: null, tags: [] };
        break;
        case "Send message":
          newAutomation = { type: "Send message", template: null, tags: [] };
          break;
      case "Send Email":
        newAutomation = { type: "Send Email", template: null, tags: [] };
        break;
      case "Send Invoice":
        newAutomation = { type: "Send Invoice", template: null, tags: [] };
        break;
      case "Send Proposal/Els":
        newAutomation = { type: "Send Proposal/Els", template: null, tags: [] };
        break;
      case "Create Organizer":
        newAutomation = { type: "Create Organizer", template: null, tags: [] };
        break;
      case "Apply folder template":
        newAutomation = {
          type: "Apply folder template",
          template: null,
          tags: [],
        };
        break;
          // Update account tags
      case "Update account tags":
        // Initialize addTags and removeTags as separate empty arrays
        newAutomation = {
          type: "Update account tags",
          addTags: [], // Independent array for addTags
          removeTags: [], // Independent array for removeTags
          tags: [],
        };
        break;
         case "Update job assignees":
        // Initialize addTags and removeTags as separate empty arrays
        newAutomation = {
          type: "Update job assignees",
          addAssignees: [], // Independent array for addTags
          removeAssignees: [], // Independent array for removeTags
          tags: [],
        };
        break;
          case "Update client-facing job status":
        // Initialize addTags and removeTags as separate empty arrays
        newAutomation = {
          type: "Update client-facing job status",
          visibiltyforClient: true, // Independent array for addTags
          selecteStatus: null, // Independent array for removeTags
          statusDescription: "",
        };
        break;
      default:
        break;
    }

    setSelectedAutomationData([...selectedAutomationData, newAutomation]);
    setEditAnchorEl(null); // Close the menu
    setIsEditDrawerOpen(true); // Open the edit drawer
  };
  const handleEditClose = () => {
    setEditAnchorEl(null);
  };
  

  const handleEditTemplateChange = (index, newValue) => {
    const updatedData = [...selectedAutomationData];
    updatedData[index].template = newValue;
    setSelectedAutomationData(updatedData);
  }; 
   const[ editClientDescription, setEditClientDescripation]=useState("")
   const handleEditClientChange = async (index, newValue) => {
  const updatedData = [...selectedAutomationData];
  
  // Update the selected status immediately
  updatedData[index].selectedClientStatus = newValue;
  
  // Clear the existing description while we fetch the new one
  updatedData[index].statusDescription = "";
  
  // Update the state immediately (optional, but provides better UX)
  setSelectedAutomationData(updatedData);

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

      // Create a new copy of the data to update
      const updatedDataWithDescription = [...selectedAutomationData];
      
      // Update both the status and description
      updatedDataWithDescription[index].selectedClientStatus = newValue;
      updatedDataWithDescription[index].statusDescription = 
        data.clientfacingjobstatuses.clientfacingdescription || "";
      
      // Update the state
      setSelectedAutomationData(updatedDataWithDescription);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally set an error state or default description
      const updatedDataWithError = [...selectedAutomationData];
      updatedDataWithError[index].statusDescription = "Error loading description";
      setSelectedAutomationData(updatedDataWithError);
    }
  }
};
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedAutomationData, setSelectedAutomationData] = useState([]);
  const [automationSelect, SetAutomationSelect] = useState();
  const [stageSelected, SetStageSelected] = useState();
  const [editingStageIndex, setEditingStageIndex] = useState(null);
  const handleClick = (event, index, actionType) => {
    setAnchorEl(event.currentTarget); // Opens the menu
    SetStageSelected(index); // Stores the selected stage index

    // if (actionType === "edit") {
    //     // Ensure automation data exists before accessing
    //     const automations = stages[index]?.automations || [];
    //     setSelectedAutomationData(automations); // Populate drawer with automations
    //     setIsEditDrawerOpen(true); // Open the edit automation drawer
    // }
    if (actionType === "edit") {
      const automations = stages[index]?.automations || [];
      if (automations.length > 0) {
        // Only proceed if automations exist
        setSelectedAutomationData(automations); // Populate drawer with automations
        setIsEditDrawerOpen(true); // Open the edit automation drawer
        setAnchorEl(null);
        setEditingStageIndex(index);
      } else {
        console.log("No automations available to edit for this stage.");
      }
    }
    console.log("Stage Index:", index);
  };
  // const handleEditCheckboxChange = (tag, index) => {
  //   // Find the selected automation by index
  //   const updatedAutomation = [...selectedAutomationData];
  //   const automation = updatedAutomation[index];

  //   // Check if the tag is already selected
  //   const isTagSelected = automation.tags.some(
  //     (existingTag) => existingTag._id === tag._id
  //   );

  //   if (isTagSelected) {
  //     // Remove the tag if already selected
  //     automation.tags = automation.tags.filter(
  //       (existingTag) => existingTag._id !== tag._id
  //     );
  //   } else {
  //     // Add the tag if not selected
  //     automation.tags.push(tag);
  //   }

  //   // Update the state with the modified automation
  //   setSelectedAutomationData(updatedAutomation);
  // };

  const handleEditCheckboxChange = (tag) => {
    setStageAutomationTags((prevTags) => {
      const isTagSelected = prevTags.some(
        (existingTag) => existingTag._id === tag._id
      );

      if (isTagSelected) {
        return prevTags.filter((existingTag) => existingTag._id !== tag._id);
      } else {
        return [...prevTags, tag];
      }
    });
  };
  const handleSaveTagsAutomation = (index) => {
    return () => {
      const updatedStages = [...stages];
      console.log("Updated Stages before update:", updatedStages);

      const selectedAutomation = {
        type: automationSelect,
        addTags: addTags
          .map((tagId) => {
            const tag = tags.find((t) => t._id === tagId);
            return tag
              ? {
                  _id: tag._id,
                  tagName: tag.tagName,
                  tagColour: tag.tagColour,
                }
              : null;
          })
          .filter(Boolean), // Filter out any null values
        removeTags: removeTags
          .map((tagId) => {
            const tag = tags.find((t) => t._id === tagId);
            return tag
              ? {
                  _id: tag._id,
                  tagName: tag.tagName,
                  tagColour: tag.tagColour,
                }
              : null;
          })
          .filter(Boolean), // Filter out any null values

        // template: selectedtemp ? { label: selectedtemp.label, value: selectedtemp.value } : null,
        tags: selectedTags.map((tag) => ({
          _id: tag._id,
          tagName: tag.tagName,
          tagColour: tag.tagColour,
        })),
      };

      // Make sure the right stage is getting updated
      updatedStages[index] = {
        // ...updatedStages[index], // Ensure we keep the other properties of the stage intact
        automations: [...updatedStages[index].automations, selectedAutomation], // Add the new automation to automations
      };

      setStages(updatedStages);
      console.log("Automation saved for stage:", index, selectedAutomation);

      // Reset form fields
      setselectedTemp(null);
      setSelectedTags([]);
      // setAddTags([])
      // setRemoveTags([])
      setIsAnyCheckboxChecked(false);
      handleDrawerClose();
    };
  };
  const [selectedAutomationIndex, setSelectedAutomationIndex] = useState(null);

  // const handleEditAddTags = () => {
  //   const updatedTags = [
  //     ...selectedAutomationData[selectedAutomationIndex].tags, // Only update tags for the selected automation
  //     ...tempSelectedTags.filter(
  //       (newTag) =>
  //         !selectedAutomationData[selectedAutomationIndex].tags.some(
  //           (existingTag) => existingTag._id === newTag._id
  //         )
  //     ),
  //   ];

  //   console.log("Updated Tags for Selected Automation:", updatedTags);

  //   // Update the tags for the selected automation only
  //   setSelectedAutomationData((prevData) =>
  //     prevData.map((automation, idx) => {
  //       if (idx === selectedAutomationIndex) {
  //         return {
  //           ...automation,
  //           tags: updatedTags, // Add updated tags to the selected automation
  //         };
  //       }
  //       return automation;
  //     })
  //   );

  //   setTempSelectedTags([]); // Clear the temporary selected tags
  //   setIsConditionsEditFormOpen(false); // Close the drawer
  // };

  // const handleEditSaveAutomation = (index) => {
  //   // Ensure the automation data has been updated
  //   const updatedStages = [...stages];  // Create a copy of stages array
  //   updatedStages[index].automations = selectedAutomationData; // Update the automations for the specific stage

  //   // Set the new stages array
  //   setStages(updatedStages);

  //   // Close the drawer after saving the automation
  //   setIsEditDrawerOpen(false);
  //   toast.success("automation edited successfully")
  // };

  const handleEditAddTags = () => {
    if (selectedAutomationIndex !== null) {
      setSelectedAutomationData((prevData) => {
        const updatedData = [...prevData];
        updatedData[selectedAutomationIndex] = {
          ...updatedData[selectedAutomationIndex],
          tags: stageAutomationTags, // Save selected tags
        };
        return updatedData;
      });
    }
    setIsConditionsEditFormOpen(false);
  };
  // const handleEditSaveAutomation = () => {
  //   if (editingStageIndex === null) return; // Ensure the stage index is valid

  //   console.log("Save automation for stage:", editingStageIndex);

  //   // Update the automations for the selected stage
  //   const updatedStages = [...stages];
  //   updatedStages[editingStageIndex].automations = selectedAutomationData;

  //   // Update the stages state
  //   setStages(updatedStages);

  //   // Close the drawer and show success message
  //   setIsEditDrawerOpen(false);
  //   toast.success("Automation edited successfully");
  // };
  
  
  //  const handleEditSaveAutomation = () => {
  //     if (editingStageIndex === null) return; // Ensure the stage index is valid
  
  //     console.log("Save automation for stage:", editingStageIndex);
  
  //     // Process automation data to ensure "Update account tags" includes addTags and removeTags
  //     const updatedAutomationData = selectedAutomationData.map((automation) => {
  //       if (automation.type === "Update account tags") {
  //         return {
  //           ...automation,
  //           addTags: addTags
  //             .map((tagId) => {
  //               const tag = tags.find((t) => t._id === tagId);
  //               return tag
  //                 ? {
  //                     _id: tag._id,
  //                     tagName: tag.tagName,
  //                     tagColour: tag.tagColour,
  //                   }
  //                 : null;
  //             })
  //             .filter(Boolean), // Filter out any null values
  //           removeTags: removeTags
  //             .map((tagId) => {
  //               const tag = tags.find((t) => t._id === tagId);
  //               return tag
  //                 ? {
  //                     _id: tag._id,
  //                     tagName: tag.tagName,
  //                     tagColour: tag.tagColour,
  //                   }
  //                 : null;
  //             })
  //             .filter(Boolean),
  //         };
  //       }
  //       return automation;
  //     });
  
  //     console.log("Processed automation data:", updatedAutomationData);
  
  //     // Update the automations for the selected stage
  //     const updatedStages = [...stages];
  //     updatedStages[editingStageIndex].automations = updatedAutomationData;
  
  //     console.log("Updated Stages:", updatedStages);
  
  //     // Update the stages state
  //     setStages(updatedStages);
  
  //     // Close the drawer and show success message
  //     setIsEditDrawerOpen(false);
  //     toast.success("Automation edited successfully");
  //   };
  const handleEditSaveAutomation = () => {
      if (editingStageIndex === null) return; // Ensure the stage index is valid
  
      console.log("Save automation for stage:", editingStageIndex);
  
     // Process automation data to ensure "Update account tags" includes correct addTags and removeTags
     const updatedAutomationData = selectedAutomationData.map((automation) => {
      if (automation.type === "Update account tags") {
        return {
          ...automation,
          addTags: automation.addTags.map((tag) => {
            if (typeof tag === "string") {
              const foundTag = tags.find((t) => t._id === tag);
              return foundTag ? { _id: foundTag._id, tagName: foundTag.tagName, tagColour: foundTag.tagColour } : null;
            }
            return tag; // Keep existing tag objects
          }).filter(Boolean), // Remove any null values
  
          removeTags: automation.removeTags.map((tag) => {
            if (typeof tag === "string") {
              const foundTag = tags.find((t) => t._id === tag);
              return foundTag ? { _id: foundTag._id, tagName: foundTag.tagName, tagColour: foundTag.tagColour } : null;
            }
            return tag; // Keep existing tag objects
          }).filter(Boolean),
        };
      }
      else if (automation.type === "Update job assignees") {
        return {
          ...automation,
          addAssignees: automation.addAssignees
            .map((tag) => {
              if (typeof tag === "string") {
                const foundTag = assignee.find((t) => t._id === tag);
                return foundTag
                  ? {
                      _id: foundTag._id,
                      label: foundTag.username,
                     
                    }
                  : null;
              }
              return tag; // Keep existing tag objects
            })
            .filter(Boolean), // Remove any null values

          removeAssignees: automation.removeAssignees
            .map((tag) => {
              if (typeof tag === "string") {
                const foundTag = assignee.find((t) => t._id === tag);
                return foundTag
                  ? {
                      _id: foundTag._id,
                      label: foundTag.username,
                      
                    }
                  : null;
              }
              return tag; // Keep existing tag objects
            })
            .filter(Boolean),
        };
      }
      return automation;
    });
  
      console.log("Processed automation data:", updatedAutomationData);
  
      // Update the automations for the selected stage
      const updatedStages = [...stages];
      updatedStages[editingStageIndex].automations = updatedAutomationData;
  
      console.log("Updated Stages:", updatedStages);
  
      // Update the stages state
      setStages(updatedStages);
  
      // Close the drawer and show success message
      setIsEditDrawerOpen(false);
      toast.success("Automation edited successfully");
    };
  
  const handleDrawerOpen = (option, index) => {
    setIsDrawerOpen(true);
    SetAutomationSelect(option);
    SetStageSelected(index);
    console.log(index);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  const handleAddAutomation = (stageSelected, option) => {
    // Handle option action here
    console.log("Adding automation to stage index:", stageSelected);
    console.log("automation  clicked!");
    // const newStages = [...stages]; // Create a copy of the stages array
    // newStages[stageSelected].automations.push(option); // Append the new option
    // setStages(newStages); // Update the state with the modified stages array
    // console.log(newStages)
    console.log("Added automation to stage", stageSelected, option);
    handleDrawerOpen(option, stageSelected);
    handleClose();
  };

  const [addEmailTemplates, setAddEmailTemplates] = useState([]);
  const [addInvoiceTemplates, setAddInvoiceTemplates] = useState([]);
  const [addProposalsandElsTeplates, setAddProposalsandElsTeplates] = useState(
    []
  );
  const [addOrganizerTemplates, setAddOrganizerTemplates] = useState([]);
   const [addTaskTemplates, setAddTaskTemplates] = useState([]);
    const [addChatTemplates,setAddChatTemplates]=useState([])
  useEffect(() => {
    fetchEmailTemplates();
    fectInvoiceTemplates();
    fectProposalandElsTemp();
    fetchOrganizerTemplates();
    fetchTaskTemplates();
    fetchChatTemplates()
  }, []);
  const fetchChatTemplates = async () => {
    try {
      const url = `${CHAT_API}/workflow/chats/chattemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setAddChatTemplates(data.chatTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const chatTemplateOptions = addChatTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));
  const fetchTaskTemplates = async () => {
    try {
      const url = `${TASK_API}/workflow/tasks/tasktemplate/`;
      const response = await fetch(url);
      const data = await response.json();
      setAddTaskTemplates(data.TaskTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const taskTemplateOptions = addTaskTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));
  const fetchEmailTemplates = async () => {
    try {
      const url = `${EMAIL_API}/workflow/emailtemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setAddEmailTemplates(data.emailTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const emailTemplateOptions = addEmailTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));
  const fectInvoiceTemplates = async () => {
    try {
      const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setAddInvoiceTemplates(data.invoiceTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const invoiceTemplateOptions = addInvoiceTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));
  const fectProposalandElsTemp = async () => {
    try {
      const url = `${PROPOSAL_API}/workflow/proposalesandels/proposalesandels`;
      const response = await fetch(url);
      const data = await response.json();
      setAddProposalsandElsTeplates(data.proposalesAndElsTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const proposalElsOptions = addProposalsandElsTeplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  const fetchOrganizerTemplates = async () => {
    try {
      const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setAddOrganizerTemplates(data.OrganizerTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const organizerOptions = addOrganizerTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));

  // folder templates
  const API_KEY = process.env.REACT_APP_FOLDER_URL;
  const [folderTemplates, setFolderTemplates] = useState([]);

  useEffect(() => {
    fetchFolderData();
  }, []);

  const fetchFolderData = async () => {
    try {
      const url = `${API_KEY}/foldertemp/folder`;
      const response = await fetch(url);
      const data = await response.json();
      setFolderTemplates(data.folderTemplates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const optionfolder = folderTemplates.map((folderTemplates) => ({
    value: folderTemplates._id,
    label: folderTemplates.templatename,
  }));

  const [selectedtemp, setselectedTemp] = useState();
  const handletemp = (selectedOptions) => {
    setselectedTemp(selectedOptions);
  };

  // condition tags
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [isConditionsFormOpen, setIsConditionsFormOpen] = useState(false);
  const [isAnyCheckboxChecked, setIsAnyCheckboxChecked] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedTags, setTempSelectedTags] = useState([]);
  const handleAddConditions = () => {
    setIsConditionsFormOpen(!isConditionsFormOpen);
  };

  const handleGoBack = () => {
    setIsConditionsFormOpen(false);
  };

  const handleCheckboxChange = (tag) => {
    const updatedSelectedTags = tempSelectedTags.includes(tag)
      ? tempSelectedTags.filter((t) => t._id !== tag._id)
      : [...tempSelectedTags, tag];
    setTempSelectedTags(updatedSelectedTags);
    setIsAnyCheckboxChecked(updatedSelectedTags.length > 0);
  };

  const handleAddTags = () => {
    setSelectedTags([
      ...selectedTags,
      ...tempSelectedTags.filter(
        (tag) => !selectedTags.some((t) => t._id === tag._id)
      ),
    ]);
    setIsConditionsFormOpen(false);
    setTempSelectedTags([]);
  };
  const [tags, setTags] = useState([]);
  console.log(selectedTags);
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateWidth = (label) => Math.min(label.length * 8, 200);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const filteredTags = tags.filter((tag) =>
    tag.tagName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selectedTagElements = selectedTags.map((tag) => (
    <Box
      key={tag._id}
      sx={{
        backgroundColor: tag.tagColour,
        borderRadius: "20px",
        color: "#fff",
        fontSize: "12px",
        fontWeight: "600",
        textAlign: "center",
        padding: "3px",
        marginBottom: "5px",
        marginRight: "5px",
        display: "inline-block",
        width: `${calculateWidth(tag.tagName)}px`,
      }}
    >
      {tag.tagName}
    </Box>
  ));

  const [addTags, setAddTags] = useState([]); // Separate state for Add Tags
  const [removeTags, setRemoveTags] = useState([]); // Separate state for Remove Tags

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

  // const handleAddTagChange = (event, newValue) => {
  //   setAddTags(newValue.map((option) => option.value));
  //   console.log(
  //     "Selected Add Tags:",
  //     newValue.map((option) => option.value)
  //   );
  // };

  // const handleRemoveTagChange = (event, newValue) => {
  //   setRemoveTags(newValue.map((option) => option.value));
  //   console.log(
  //     "Selected Remove Tags:",
  //     newValue.map((option) => option.value)
  //   );
  // };
  const handleAddTagChange = (event) => {
    const selectedValues = event.target.value;
    setAddTags(selectedValues);

    // Send selectedValues array to your backend
    console.log("Selected Values:", selectedValues);
  };
  const handleRemoveTagChange = (event) => {
    const selectedValues = event.target.value;
    setRemoveTags(selectedValues);

    // Send selectedValues array to your backend
    console.log("Selected Values:", selectedValues);
  };
  const handleEditAddTagsChange = (index,event) => {
    const {value} = event.target;
    
    // Update the selected tags state
    // 
// console.log(selectedValues)
    // Clone the existing selectedAutomationData array
    // const updatedData = [...selectedAutomationData];

    

    // Extract selected tag values
    const selectedTagsValues = value.map((val) => {
      const option = filteredAddTagsOptions.find((opt) => opt.value === val);
      return option?.value;
    });

    // Update addTags in the automation data
    // updatedData[index].addTags = selectedTagsValues;

    // Update the state with the new data
    // setSelectedAutomationData(updatedData);

    // Debugging output
    console.log("Selected Tags:", selectedTagsValues);
    setAddTags(selectedTagsValues);
};
  const handleSave = () => {
    console.log("Saved Data:");
    console.log("Add Tags:", addTags);
    console.log("Remove Tags:", removeTags);
  };

  const filteredAddTagsOptions = tagsoptions.filter(
    (option) => !removeTags.includes(option.value)
  );

  const filteredRemoveTagsOptions = tagsoptions.filter(
    (option) => !addTags.includes(option.value)
  );

  const statusOptions = [
      { value: true, label: "Show status" },
      { value: false, label: "Hide status" },
    ];
    const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
    const [status, setStatus] = useState(
      statusOptions.find((option) => option.value === true)
    );
    const handleStatusChange = (event, newValue) => {
    setStatus(newValue);
  };
    const [clientDescription, setClientDescription] = useState("");
    const maxDescriptionLength = 150;
    const [selectedClientStatus, setSelectedClientStatus] = useState(null);
    console.log("upadte clientfacing status", status.value);
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
    const handleClientStatusChange = async (event, newValue) => {
      setSelectedClientStatus(newValue);
  
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
  
    const handleClientDescriptionChange = (e) => {
      if (e.target.value.length <= maxDescriptionLength) {
        setClientDescription(e.target.value);
      }
    };
  // Function to render content based on action
  // const renderActionContent = (automationSelect, index) => {
  //   switch (automationSelect) {
  //     case "Send Invoice":
  //       return (
  //         <>
  //           <Grid item ml={2}>
  //             <Typography mb={1}>Select template</Typography>
  //             <Autocomplete
  //               options={invoiceTemplateOptions}
  //               getOptionLabel={(option) => option.label}
  //               value={selectedtemp}
  //               onChange={(event, newValue) => handletemp(newValue)}
  //               isOptionEqualToValue={(option, value) =>
  //                 option.value === value.value
  //               }
  //               renderOption={(props, option) => (
  //                 <Box
  //                   component="li"
  //                   {...props}
  //                   sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
  //                 >
  //                   {option.label}
  //                 </Box>
  //               )}
  //               renderInput={(params) => (
  //                 <>
  //                   <TextField
  //                     {...params}
  //                     // helperText={templateError}
  //                     sx={{ backgroundColor: "#fff" }}
  //                     placeholder="Select Template"
  //                     variant="outlined"
  //                     size="small"
  //                   />
  //                 </>
  //               )}
  //               sx={{ width: "100%", marginTop: "8px" }}
  //               clearOnEscape // Enable clearable functionality
  //             />
  //             {selectedTags.length > 0 && (
  //               <Grid container alignItems="center" gap={1}>
  //                 <Typography>Only for:</Typography>
  //                 <Grid item>{selectedTagElements}</Grid>
  //               </Grid>
  //             )}
  //             <Button variant="text" onClick={handleAddConditions}>
  //               Add Conditions
  //             </Button>

  //             <Button variant="contained" onClick={handleSaveAutomation(index)} sx={{
  //               backgroundColor: 'var(--color-save-btn)',  // Normal background

  //               '&:hover': {
  //                 backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //               },
  //               borderRadius:'15px',
  //             }}>
  //               Save Automation
  //             </Button>
  //           </Grid>
  //           <Drawer
  //             anchor="right"
  //             open={isConditionsFormOpen}
  //             onClose={handleGoBack}
  //             PaperProps={{ sx: { width: "550px", padding: 2 } }}
  //           >
  //             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  //               <IconButton onClick={handleGoBack}>
  //                 <IoMdArrowRoundBack fontSize="large" color="blue" />
  //               </IconButton>
  //               <Typography variant="h6">Add conditions</Typography>
  //             </Box>

  //             <Box sx={{ padding: 2 }}>
  //               <Typography variant="body1">
  //                 Apply automation only for accounts with these tags
  //               </Typography>
  //               <TextField
  //                 fullWidth
  //                 size="small"
  //                 variant="outlined"
  //                 placeholder="Search..."
  //                 value={searchTerm}
  //                 onChange={handleSearchChange}
  //                 InputProps={{
  //                   startAdornment: (
  //                     <AiOutlineSearch style={{ marginRight: 8 }} />
  //                   ),
  //                 }}
  //                 sx={{ marginTop: 2 }}
  //               />

  //               <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
  //                 {filteredTags.map((tag) => (
  //                   <Box
  //                     key={tag._id}
  //                     sx={{
  //                       display: "flex",
  //                       alignItems: "center",
  //                       gap: 3,
  //                       borderBottom: "1px solid grey",
  //                       paddingBottom: 1,
  //                     }}
  //                   >
  //                     <Checkbox
  //                       checked={tempSelectedTags.includes(tag)}
  //                       onChange={() => handleCheckboxChange(tag)}
  //                     />
  //                     <Chip
  //                       label={tag.tagName}
  //                       sx={{
  //                         backgroundColor: tag.tagColour,
  //                         color: "#fff",
  //                         fontWeight: "500",
  //                         borderRadius: "20px",
  //                         marginRight: 1,
  //                       }}
  //                     />
  //                   </Box>
  //                 ))}
  //               </Box>

  //               <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
  //                 <Button
  //                   variant="contained"
  //                   color="primary"
  //                   disabled={!isAnyCheckboxChecked}
  //                   onClick={handleAddTags}
  //                   sx={{
  //                     backgroundColor: 'var(--color-save-btn)',  // Normal background

  //                     '&:hover': {
  //                       backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //                     },
  //                     borderRadius:'15px', width:'80px'
  //                   }}
  //                 >
  //                   Add
  //                 </Button>
  //                 <Button
  //                   variant="outlined"
  //                   color="primary"
  //                   onClick={handleGoBack}
  //                   sx={{
  //                     borderColor: 'var(--color-border-cancel-btn)',  // Normal background
  //                    color:'var(--color-save-btn)',
  //                     '&:hover': {
  //                       backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //                       color:'#fff',
  //                       border:"none"
  //                     },
  //                     width:'80px',borderRadius:'15px'
  //                   }}
  //                 >
  //                   Cancel
  //                 </Button>
  //               </Box>
  //             </Box>
  //           </Drawer>
  //         </>
  //       );
  //     case "Send Proposal/Els":
  //       return (
  //         <Box p={2}>
  //           <Grid item>
  //             <Typography mb={1}>Select template</Typography>
  //             <Autocomplete
  //               options={proposalElsOptions}
  //               getOptionLabel={(option) => option.label}
  //               value={selectedtemp}
  //               onChange={(event, newValue) => handletemp(newValue)}
  //               isOptionEqualToValue={(option, value) =>
  //                 option.value === value.value
  //               }
  //               renderOption={(props, option) => (
  //                 <Box
  //                   component="li"
  //                   {...props}
  //                   sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
  //                 >
  //                   {option.label}
  //                 </Box>
  //               )}
  //               renderInput={(params) => (
  //                 <>
  //                   <TextField
  //                     {...params}
  //                     // helperText={templateError}
  //                     sx={{ backgroundColor: "#fff" }}
  //                     placeholder="Select Template"
  //                     variant="outlined"
  //                     size="small"
  //                   />
  //                 </>
  //               )}
  //               sx={{ width: "100%", marginTop: "8px" }}
  //               clearOnEscape // Enable clearable functionality
  //             />

  //             {selectedTags.length > 0 && (
  //               <Grid container alignItems="center" gap={1}>
  //                 <Typography>Only for:</Typography>
  //                 <Grid item>{selectedTagElements}</Grid>
  //               </Grid>
  //             )}
  //             <Button variant="text" onClick={handleAddConditions}>
  //               Add Conditions
  //             </Button>
  //           </Grid>
  //           <Button variant="contained" onClick={handleSaveAutomation(index)} sx={{
  //               backgroundColor: 'var(--color-save-btn)',  // Normal background

  //               '&:hover': {
  //                 backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //               },
  //               borderRadius:'15px',
  //             }}>
  //             Save Automation
  //           </Button>

  //           <Drawer
  //             anchor="right"
  //             open={isConditionsFormOpen}
  //             onClose={handleGoBack}
  //             PaperProps={{ sx: { width: "550px", padding: 2 } }}
  //           >
  //             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  //               <IconButton onClick={handleGoBack}>
  //                 <IoMdArrowRoundBack fontSize="large" color="blue" />
  //               </IconButton>
  //               <Typography variant="h6">Add conditions</Typography>
  //             </Box>

  //             <Box sx={{ padding: 2 }}>
  //               <Typography variant="body1">
  //                 Apply automation only for accounts with these tags
  //               </Typography>
  //               <TextField
  //                 fullWidth
  //                 size="small"
  //                 variant="outlined"
  //                 placeholder="Search..."
  //                 value={searchTerm}
  //                 onChange={handleSearchChange}
  //                 InputProps={{
  //                   startAdornment: (
  //                     <AiOutlineSearch style={{ marginRight: 8 }} />
  //                   ),
  //                 }}
  //                 sx={{ marginTop: 2 }}
  //               />

  //               <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
  //                 {filteredTags.map((tag) => (
  //                   <Box
  //                     key={tag._id}
  //                     sx={{
  //                       display: "flex",
  //                       alignItems: "center",
  //                       gap: 3,
  //                       borderBottom: "1px solid grey",
  //                       paddingBottom: 1,
  //                     }}
  //                   >
  //                     <Checkbox
  //                       checked={tempSelectedTags.includes(tag)}
  //                       onChange={() => handleCheckboxChange(tag)}
  //                     />
  //                     <Chip
  //                       label={tag.tagName}
  //                       sx={{
  //                         backgroundColor: tag.tagColour,
  //                         color: "#fff",
  //                         fontWeight: "500",
  //                         borderRadius: "20px",
  //                         marginRight: 1,
  //                       }}
  //                     />
  //                   </Box>
  //                 ))}
  //               </Box>

  //               <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
  //                 <Button
  //                   variant="contained"
  //                   color="primary"
  //                   disabled={!isAnyCheckboxChecked}
  //                   onClick={handleAddTags}
  //                   sx={{
  //                     backgroundColor: 'var(--color-save-btn)',  // Normal background

  //                     '&:hover': {
  //                       backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //                     },
  //                     borderRadius:'15px', width:'80px'
  //                   }}
  //                 >
  //                   Add
  //                 </Button>
  //                 <Button
  //                   variant="outlined"
  //                   color="primary"
  //                   onClick={handleGoBack}
  //                   sx={{
  //                     borderColor: 'var(--color-border-cancel-btn)',  // Normal background
  //                    color:'var(--color-save-btn)',
  //                     '&:hover': {
  //                       backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //                       color:'#fff',
  //                       border:"none"
  //                     },
  //                     width:'80px',borderRadius:'15px'
  //                   }}
  //                 >
  //                   Cancel
  //                 </Button>
  //               </Box>
  //             </Box>
  //           </Drawer>
  //         </Box>
  //       );
  //     case "Send Email":
  //       return (
  //         <>
  //           <Box p={2}>
  //             <Grid item>
  //               <Typography mb={1}>Select template</Typography>
  //               <Autocomplete
  //                 options={emailTemplateOptions}
  //                 getOptionLabel={(option) => option.label}
  //                 value={selectedtemp}
  //                 onChange={(event, newValue) => handletemp(newValue)}
  //                 isOptionEqualToValue={(option, value) =>
  //                   option.value === value.value
  //                 }
  //                 renderOption={(props, option) => (
  //                   <Box
  //                     component="li"
  //                     {...props}
  //                     sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
  //                   >
  //                     {option.label}
  //                   </Box>
  //                 )}
  //                 renderInput={(params) => (
  //                   <>
  //                     <TextField
  //                       {...params}
  //                       // helperText={templateError}
  //                       sx={{ backgroundColor: "#fff" }}
  //                       placeholder="Select Template"
  //                       variant="outlined"
  //                       size="small"
  //                     />
  //                   </>
  //                 )}
  //                 sx={{ width: "100%", marginTop: "8px" }}
  //                 clearOnEscape // Enable clearable functionality
  //               />
  //               {selectedTags.length > 0 && (
  //                 <Grid container alignItems="center" gap={1}>
  //                   <Typography>Only for:</Typography>
  //                   <Grid item>{selectedTagElements}</Grid>
  //                 </Grid>
  //               )}
  //               <Button variant="text" onClick={handleAddConditions}>
  //                 Add Conditions
  //               </Button>
  //             </Grid>
  //             <Button
  //               variant="contained"
  //               onClick={handleSaveAutomation(stageSelected)}
  //               sx={{
  //                 backgroundColor: 'var(--color-save-btn)',  // Normal background

  //                 '&:hover': {
  //                   backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //                 },
  //                 borderRadius:'15px',
  //               }}
  //             >
  //               Save Automation
  //             </Button>
  //           </Box>
  //           {/* Condition tags for automation */}
  //           <Drawer
  //             anchor="right"
  //             open={isConditionsFormOpen}
  //             onClose={handleGoBack}
  //             PaperProps={{ sx: { width: "550px", padding: 2 } }}
  //           >
  //             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  //               <IconButton onClick={handleGoBack}>
  //                 <IoMdArrowRoundBack fontSize="large" color="blue" />
  //               </IconButton>
  //               <Typography variant="h6">Add conditions</Typography>
  //             </Box>

  //             <Box sx={{ padding: 2 }}>
  //               <Typography variant="body1">
  //                 Apply automation only for accounts with these tags
  //               </Typography>
  //               <TextField
  //                 fullWidth
  //                 size="small"
  //                 variant="outlined"
  //                 placeholder="Search..."
  //                 value={searchTerm}
  //                 onChange={handleSearchChange}
  //                 InputProps={{
  //                   startAdornment: (
  //                     <AiOutlineSearch style={{ marginRight: 8 }} />
  //                   ),
  //                 }}
  //                 sx={{ marginTop: 2 }}
  //               />

  //               <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
  //                 {filteredTags.map((tag) => (
  //                   <Box
  //                     key={tag._id}
  //                     sx={{
  //                       display: "flex",
  //                       alignItems: "center",
  //                       gap: 3,
  //                       borderBottom: "1px solid grey",
  //                       paddingBottom: 1,
  //                     }}
  //                   >
  //                     <Checkbox
  //                       checked={tempSelectedTags.includes(tag)}
  //                       onChange={() => handleCheckboxChange(tag)}
  //                     />
  //                     <Chip
  //                       label={tag.tagName}
  //                       sx={{
  //                         backgroundColor: tag.tagColour,
  //                         color: "#fff",
  //                         fontWeight: "500",
  //                         borderRadius: "20px",
  //                         marginRight: 1,
  //                       }}
  //                     />
  //                   </Box>
  //                 ))}
  //               </Box>

  //               <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
  //                 <Button
  //                   variant="contained"
  //                   color="primary"
  //                   disabled={!isAnyCheckboxChecked}
  //                   onClick={handleAddTags}
  //                   sx={{
  //                     backgroundColor: 'var(--color-save-btn)',  // Normal background

  //                     '&:hover': {
  //                       backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //                     },
  //                     borderRadius:'15px', width:'80px'
  //                   }}
  //                 >
  //                   Add
  //                 </Button>
  //                 <Button
  //                   variant="outlined"
  //                   color="primary"
  //                   onClick={handleGoBack}
  //                   sx={{
  //                     borderColor: 'var(--color-border-cancel-btn)',  // Normal background
  //                    color:'var(--color-save-btn)',
  //                     '&:hover': {
  //                       backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //                       color:'#fff',
  //                       border:"none"
  //                     },
  //                     width:'80px',borderRadius:'15px'
  //                   }}
  //                 >
  //                   Cancel
  //                 </Button>
  //               </Box>
  //             </Box>
  //           </Drawer>
  //         </>
  //       );
  //     case "Apply folder template":
  //       return (
  //         <>
  //           <Box p={2}>
  //             <Grid item>
  //               {automationSelect}
  //               <Typography mb={1}>Select template</Typography>
  //               <Autocomplete
  //                 options={optionfolder}
  //                 getOptionLabel={(option) => option.label}
  //                 value={selectedtemp}
  //                 onChange={(event, newValue) => handletemp(newValue)}
  //                 isOptionEqualToValue={(option, value) =>
  //                   option.value === value.value
  //                 }
  //                 renderOption={(props, option) => (
  //                   <Box
  //                     component="li"
  //                     {...props}
  //                     sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
  //                   >
  //                     {option.label}
  //                   </Box>
  //                 )}
  //                 renderInput={(params) => (
  //                   <>
  //                     <TextField
  //                       {...params}
  //                       // helperText={templateError}
  //                       sx={{ backgroundColor: "#fff" }}
  //                       placeholder="Select Template"
  //                       variant="outlined"
  //                       size="small"
  //                     />
  //                   </>
  //                 )}
  //                 sx={{ width: "100%", marginTop: "8px" }}
  //                 clearOnEscape // Enable clearable functionality
  //               />
  //               {selectedTags.length > 0 && (
  //                 <Grid container alignItems="center" gap={1}>
  //                   <Typography>Only for:</Typography>
  //                   <Grid item>{selectedTagElements}</Grid>
  //                 </Grid>
  //               )}
  //               <Button variant="text" onClick={handleAddConditions}>
  //                 Add Conditions
  //               </Button>
  //             </Grid>
  //             <Button
  //               variant="contained"
  //               onClick={handleSaveAutomation(stageSelected)}
  //               sx={{
  //                 backgroundColor: 'var(--color-save-btn)',  // Normal background

  //                 '&:hover': {
  //                   backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //                 },
  //                 borderRadius:'15px',
  //               }}
  //             >
  //               Save Automation
  //             </Button>
  //           </Box>
  //           {/* Condition tags for automation */}
  //           <Drawer
  //             anchor="right"
  //             open={isConditionsFormOpen}
  //             onClose={handleGoBack}
  //             PaperProps={{ sx: { width: "550px", padding: 2 } }}
  //           >
  //             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  //               <IconButton onClick={handleGoBack}>
  //                 <IoMdArrowRoundBack fontSize="large" color="blue" />
  //               </IconButton>
  //               <Typography variant="h6">Add conditions</Typography>
  //             </Box>

  //             <Box sx={{ padding: 2 }}>
  //               <Typography variant="body1">
  //                 Apply automation only for accounts with these tags
  //               </Typography>
  //               <TextField
  //                 fullWidth
  //                 size="small"
  //                 variant="outlined"
  //                 placeholder="Search..."
  //                 value={searchTerm}
  //                 onChange={handleSearchChange}
  //                 InputProps={{
  //                   startAdornment: (
  //                     <AiOutlineSearch style={{ marginRight: 8 }} />
  //                   ),
  //                 }}
  //                 sx={{ marginTop: 2 }}
  //               />

  //               <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
  //                 {filteredTags.map((tag) => (
  //                   <Box
  //                     key={tag._id}
  //                     sx={{
  //                       display: "flex",
  //                       alignItems: "center",
  //                       gap: 3,
  //                       borderBottom: "1px solid grey",
  //                       paddingBottom: 1,
  //                     }}
  //                   >
  //                     <Checkbox
  //                       checked={tempSelectedTags.includes(tag)}
  //                       onChange={() => handleCheckboxChange(tag)}
  //                     />
  //                     <Chip
  //                       label={tag.tagName}
  //                       sx={{
  //                         backgroundColor: tag.tagColour,
  //                         color: "#fff",
  //                         fontWeight: "500",
  //                         borderRadius: "20px",
  //                         marginRight: 1,
  //                       }}
  //                     />
  //                   </Box>
  //                 ))}
  //               </Box>

  //               <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
  //                 <Button
  //                   variant="contained"
  //                   color="primary"
  //                   disabled={!isAnyCheckboxChecked}
  //                   onClick={handleAddTags}
  //                   sx={{
  //                     backgroundColor: 'var(--color-save-btn)',  // Normal background

  //                     '&:hover': {
  //                       backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //                     },
  //                     borderRadius:'15px', width:'80px'
  //                   }}
  //                 >
  //                   Add
  //                 </Button>
  //                 <Button
  //                   variant="outlined"
  //                   color="primary"
  //                   onClick={handleGoBack}
  //                   sx={{
  //                     borderColor: 'var(--color-border-cancel-btn)',  // Normal background
  //                    color:'var(--color-save-btn)',
  //                     '&:hover': {
  //                       backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //                       color:'#fff',
  //                       border:"none"
  //                     },
  //                     width:'80px',borderRadius:'15px'
  //                   }}
  //                 >
  //                   Cancel
  //                 </Button>
  //               </Box>
  //             </Box>
  //           </Drawer>
  //         </>
  //       );

  //       case "Update account tags":
  //         return (
  //           <>
  //             <Box p={2}>
  //               {automationSelect}
  //               <Grid item>
  //                 <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
  //                   <Box mt={2}>
  //                     <label className="task-input-label">Add Tags</label>
  //                     <Autocomplete
  //                       multiple
  //                       size="small"
  //                       id="tags-add-outlined"
  //                       options={filteredAddTagsOptions}
  //                       getOptionLabel={(option) => option.label}
  //                       value={tagsoptions.filter((option) =>
  //                         addTags.includes(option.value)
  //                       )}
  //                       onChange={handleAddTagChange}
  //                       renderTags={(selected, getTagProps) =>
  //                         selected.map((option, index) => (
  //                           <Chip
  //                             key={option.value}
  //                             label={option.label}
  //                             style={option.customTagStyle}
  //                             {...getTagProps({ index })}
  //                           />
  //                         ))
  //                       }
  //                       renderInput={(params) => (
  //                         <TextField
  //                           {...params}
  //                           variant="outlined"
  //                           placeholder="Tags"
  //                           sx={{
  //                             width: "100%",
  //                             marginTop: "8px",
  //                             backgroundColor: "#fff",
  //                           }}
  //                         />
  //                       )}
  //                       renderOption={(props, option) => (
  //                         <Box
  //                           component="li"
  //                           {...props}
  //                           style={option.customStyle}
  //                         >
  //                           {option.label}
  //                         </Box>
  //                       )}
  //                     />
  //                   </Box>

  //                   <Box mt={2}>
  //                     <label className="task-input-label">Remove Tags</label>
  //                     <Autocomplete
  //                       multiple
  //                       size="small"
  //                       id="tags-remove-outlined"
  //                       options={filteredRemoveTagsOptions}
  //                       getOptionLabel={(option) => option.label}
  //                       value={tagsoptions.filter((option) =>
  //                         removeTags.includes(option.value)
  //                       )}
  //                       onChange={handleRemoveTagChange}
  //                       renderTags={(selected, getTagProps) =>
  //                         selected.map((option, index) => (
  //                           <Chip
  //                             key={option.value}
  //                             label={option.label}
  //                             style={option.customTagStyle}
  //                             {...getTagProps({ index })}
  //                           />
  //                         ))
  //                       }
  //                       renderInput={(params) => (
  //                         <TextField
  //                           {...params}
  //                           variant="outlined"
  //                           placeholder="Tags"
  //                           sx={{
  //                             width: "100%",
  //                             marginTop: "8px",
  //                             backgroundColor: "#fff",
  //                           }}
  //                         />
  //                       )}
  //                       renderOption={(props, option) => (
  //                         <Box
  //                           component="li"
  //                           {...props}
  //                           style={option.customStyle}
  //                         >
  //                           {option.label}
  //                         </Box>
  //                       )}
  //                     />
  //                   </Box>
  //                 </Box>

  //                 {selectedTags.length > 0 && (
  //                   <Grid container alignItems="center" gap={1}>
  //                     <Typography>Only for:</Typography>
  //                     <Grid item>{selectedTagElements}</Grid>
  //                   </Grid>
  //                 )}
  //                 <Button variant="text" onClick={handleAddConditions}>
  //                   Add Conditions
  //                 </Button>
  //               </Grid>
  //               <Button
  //                 variant="contained"
  //                 onClick={handleSaveTagsAutomation(stageSelected)}
  //                 sx={{
  //                   backgroundColor: 'var(--color-save-btn)',  // Normal background

  //                   '&:hover': {
  //                     backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //                   },
  //                   borderRadius:'15px',
  //                 }}>
  //                 Save Automation
  //               </Button>
  //             </Box>
  //             {/* Condition tags for automation */}
  //             <Drawer
  //               anchor="right"
  //               open={isConditionsFormOpen}
  //               onClose={handleGoBack}
  //               PaperProps={{ sx: { width: "550px", padding: 2 } }}
  //             >
  //               <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  //                 <IconButton onClick={handleGoBack}>
  //                   <IoMdArrowRoundBack fontSize="large" color="blue" />
  //                 </IconButton>
  //                 <Typography variant="h6">Add conditions</Typography>
  //               </Box>

  //               <Box sx={{ padding: 2 }}>
  //                 <Typography variant="body1">
  //                   Apply automation only for accounts with these tags
  //                 </Typography>
  //                 <TextField
  //                   fullWidth
  //                   size="small"
  //                   variant="outlined"
  //                   placeholder="Search..."
  //                   value={searchTerm}
  //                   onChange={handleSearchChange}
  //                   InputProps={{
  //                     startAdornment: (
  //                       <AiOutlineSearch style={{ marginRight: 8 }} />
  //                     ),
  //                   }}
  //                   sx={{ marginTop: 2 }}
  //                 />

  //                 <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
  //                   {filteredTags.map((tag) => (
  //                     <Box
  //                       key={tag._id}
  //                       sx={{
  //                         display: "flex",
  //                         alignItems: "center",
  //                         gap: 3,
  //                         borderBottom: "1px solid grey",
  //                         paddingBottom: 1,
  //                       }}
  //                     >
  //                       <Checkbox
  //                         checked={tempSelectedTags.includes(tag)}
  //                         onChange={() => handleCheckboxChange(tag)}
  //                       />
  //                       <Chip
  //                         label={tag.tagName}
  //                         sx={{
  //                           backgroundColor: tag.tagColour,
  //                           color: "#fff",
  //                           fontWeight: "500",
  //                           borderRadius: "20px",
  //                           marginRight: 1,
  //                         }}
  //                       />
  //                     </Box>
  //                   ))}
  //                 </Box>

  //                 <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
  //                   <Button
  //                     variant="contained"
  //                     color="primary"
  //                     disabled={!isAnyCheckboxChecked}
  //                     onClick={handleAddTags}
  //                     sx={{
  //                       backgroundColor: 'var(--color-save-btn)',  // Normal background

  //                       '&:hover': {
  //                         backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //                       },
  //                       borderRadius:'15px', width:'80px'
  //                     }}
  //                   >
  //                     Add
  //                   </Button>
  //                   <Button
  //                     variant="outlined"
  //                     color="primary"
  //                     onClick={handleGoBack}
  //                     sx={{
  //                       borderColor: 'var(--color-border-cancel-btn)',  // Normal background
  //                      color:'var(--color-save-btn)',
  //                       '&:hover': {
  //                         backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //                         color:'#fff',
  //                         border:"none"
  //                       },
  //                       width:'80px',borderRadius:'15px'
  //                     }}
  //                   >
  //                     Cancel
  //                   </Button>
  //                 </Box>
  //               </Box>
  //             </Drawer>
  //           </>
  //         );

  //       case "Create Organizer":
  //       return (
  //         <>
  //           <Box p={2}>
  //             <Grid item>
  //               <Typography mb={1}>Select template</Typography>
  //               <Autocomplete
  //                 options={organizerOptions}
  //                 getOptionLabel={(option) => option.label}
  //                 value={selectedtemp}
  //                 onChange={(event, newValue) => handletemp(newValue)}
  //                 isOptionEqualToValue={(option, value) =>
  //                   option.value === value.value
  //                 }
  //                 renderOption={(props, option) => (
  //                   <Box
  //                     component="li"
  //                     {...props}
  //                     sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
  //                   >
  //                     {option.label}
  //                   </Box>
  //                 )}
  //                 renderInput={(params) => (
  //                   <>
  //                     <TextField
  //                       {...params}
  //                       // helperText={templateError}
  //                       sx={{ backgroundColor: "#fff" }}
  //                       placeholder="Select Template"
  //                       variant="outlined"
  //                       size="small"
  //                     />
  //                   </>
  //                 )}
  //                 sx={{ width: "100%", marginTop: "8px" }}
  //                 clearOnEscape // Enable clearable functionality
  //               />
  //               {selectedTags.length > 0 && (
  //                 <Grid container alignItems="center" gap={1}>
  //                   <Typography>Only for:</Typography>
  //                   <Grid item>{selectedTagElements}</Grid>
  //                 </Grid>
  //               )}
  //               <Button variant="text" onClick={handleAddConditions}>
  //                 Add Conditions
  //               </Button>
  //             </Grid>
  //             <Button
  //               variant="contained"
  //               onClick={handleSaveAutomation(stageSelected)}
  //               sx={{
  //                 backgroundColor: 'var(--color-save-btn)',  // Normal background

  //                 '&:hover': {
  //                   backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //                 },
  //                 borderRadius:'15px',
  //               }}
  //             >
  //               Save Automation
  //             </Button>
  //           </Box>
  //           {/* Condition tags for automation */}
  //           <Drawer
  //             anchor="right"
  //             open={isConditionsFormOpen}
  //             onClose={handleGoBack}
  //             PaperProps={{ sx: { width: "550px", padding: 2 } }}
  //           >
  //             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
  //               <IconButton onClick={handleGoBack}>
  //                 <IoMdArrowRoundBack fontSize="large" color="blue" />
  //               </IconButton>
  //               <Typography variant="h6">Add conditions</Typography>
  //             </Box>

  //             <Box sx={{ padding: 2 }}>
  //               <Typography variant="body1">
  //                 Apply automation only for accounts with these tags
  //               </Typography>
  //               <TextField
  //                 fullWidth
  //                 size="small"
  //                 variant="outlined"
  //                 placeholder="Search..."
  //                 value={searchTerm}
  //                 onChange={handleSearchChange}
  //                 InputProps={{
  //                   startAdornment: (
  //                     <AiOutlineSearch style={{ marginRight: 8 }} />
  //                   ),
  //                 }}
  //                 sx={{ marginTop: 2 }}
  //               />

  //               <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
  //                 {filteredTags.map((tag) => (
  //                   <Box
  //                     key={tag._id}
  //                     sx={{
  //                       display: "flex",
  //                       alignItems: "center",
  //                       gap: 3,
  //                       borderBottom: "1px solid grey",
  //                       paddingBottom: 1,
  //                     }}
  //                   >
  //                     <Checkbox
  //                       checked={tempSelectedTags.includes(tag)}
  //                       onChange={() => handleCheckboxChange(tag)}
  //                     />
  //                     <Chip
  //                       label={tag.tagName}
  //                       sx={{
  //                         backgroundColor: tag.tagColour,
  //                         color: "#fff",
  //                         fontWeight: "500",
  //                         borderRadius: "20px",
  //                         marginRight: 1,
  //                       }}
  //                     />
  //                   </Box>
  //                 ))}
  //               </Box>

  //               <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
  //                 <Button
  //                   variant="contained"
  //                   color="primary"
  //                   disabled={!isAnyCheckboxChecked}
  //                   onClick={handleAddTags}
  //                   sx={{
  //                     backgroundColor: 'var(--color-save-btn)',  // Normal background

  //                     '&:hover': {
  //                       backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //                     },
  //                     borderRadius:'15px', width:'80px'
  //                   }}
  //                 >
  //                   Add
  //                 </Button>
  //                 <Button
  //                   variant="outlined"
  //                   color="primary"
  //                   onClick={handleGoBack}
  //                   sx={{
  //                     borderColor: 'var(--color-border-cancel-btn)',  // Normal background
  //                    color:'var(--color-save-btn)',
  //                     '&:hover': {
  //                       backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
  //                       color:'#fff',
  //                       border:"none"
  //                     },
  //                     width:'80px',borderRadius:'15px'
  //                   }}
  //                 >
  //                   Cancel
  //                 </Button>
  //               </Box>
  //             </Box>
  //           </Drawer>
  //         </>
  //       );
  //     // Add cases for other actions here
  //     default:
  //       return null;
  //   }
  // };

  const renderActionContent = (automationSelect, index) => {
    switch (automationSelect) {

      case "Create Task":
        return (
          <>
            <Grid item>
              {/* {automationSelect} */}
              <Box
                sx={{
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  padding: 2,
                  // marginBottom: 2,
                }}
              >
                <Typography gutterBottom>
                  1. {automationSelect || "No Type"}
                </Typography>

                <Typography mb={1}>Select templates</Typography>
                <Autocomplete
                  options={taskTemplateOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue)}
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
                <Box mt={2}>
                  {" "}
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>

                <Button variant="text" onClick={handleAddConditions}>
                  Add Conditions
                </Button>
              </Box>
              <Box mt={2}>
                <Button
                  variant="contained"
                  onClick={handleSaveAutomation(stageSelected)}
                  sx={{
                    backgroundColor: "var(--color-save-btn)", // Normal background

                    "&:hover": {
                      backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                    },
                    borderRadius: "15px",
                  }}
                >
                  Save Automation
                </Button>
              </Box>
            </Grid>
            <Drawer
              anchor="right"
              open={isConditionsFormOpen}
              onClose={handleGoBack}
              PaperProps={{ sx: { width: "550px", padding: 2 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">
                  Apply automation only for accounts with these tags
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <AiOutlineSearch style={{ marginRight: 8 }} />
                    ),
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
                  {filteredTags.map((tag) => (
                    <Box
                      key={tag._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        borderBottom: "1px solid grey",
                        paddingBottom: 1,
                      }}
                    >
                      <Checkbox
                        checked={tempSelectedTags.includes(tag)}
                        onChange={() => handleCheckboxChange(tag)}
                      />
                      <Chip
                        label={tag.tagName}
                        sx={{
                          backgroundColor: tag.tagColour,
                          color: "#fff",
                          fontWeight: "500",
                          borderRadius: "20px",
                          marginRight: 1,
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isAnyCheckboxChecked}
                    onClick={handleAddTags}
                    sx={{
                      backgroundColor: "var(--color-save-btn)", // Normal background

                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                      },
                      borderRadius: "15px",
                      width: "80px",
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleGoBack}
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
            </Drawer>
          </>
        );
      // Send message
      case "Send message":
        return (
          <>
            <Grid item>
              {/* {automationSelect} */}
              <Box
                sx={{
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  padding: 2,
                  // marginBottom: 2,
                }}
              >
                <Typography gutterBottom>
                  1. {automationSelect || "No Type"}
                </Typography>

                <Typography mb={1}>Select templates</Typography>
                <Autocomplete
                  options={chatTemplateOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue)}
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
                <Box mt={2}>
                  {" "}
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>

                <Button variant="text" onClick={handleAddConditions}>
                  Add Conditions
                </Button>
              </Box>
              <Box mt={2}>
                <Button
                  variant="contained"
                  onClick={handleSaveAutomation(stageSelected)}
                  sx={{
                    backgroundColor: "var(--color-save-btn)", // Normal background

                    "&:hover": {
                      backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                    },
                    borderRadius: "15px",
                  }}
                >
                  Save Automation
                </Button>
              </Box>
            </Grid>
            <Drawer
              anchor="right"
              open={isConditionsFormOpen}
              onClose={handleGoBack}
              PaperProps={{ sx: { width: "550px", padding: 2 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">
                  Apply automation only for accounts with these tags
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <AiOutlineSearch style={{ marginRight: 8 }} />
                    ),
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
                  {filteredTags.map((tag) => (
                    <Box
                      key={tag._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        borderBottom: "1px solid grey",
                        paddingBottom: 1,
                      }}
                    >
                      <Checkbox
                        checked={tempSelectedTags.includes(tag)}
                        onChange={() => handleCheckboxChange(tag)}
                      />
                      <Chip
                        label={tag.tagName}
                        sx={{
                          backgroundColor: tag.tagColour,
                          color: "#fff",
                          fontWeight: "500",
                          borderRadius: "20px",
                          marginRight: 1,
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isAnyCheckboxChecked}
                    onClick={handleAddTags}
                    sx={{
                      backgroundColor: "var(--color-save-btn)", // Normal background

                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                      },
                      borderRadius: "15px",
                      width: "80px",
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleGoBack}
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
            </Drawer>
          </>
        );
      case "Send Invoice":
        return (
          <>
            <Grid item>
              {/* {automationSelect} */}
              <Box
                sx={{
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  padding: 2,
                  // marginBottom: 2,
                }}
              >
                <Typography gutterBottom>
                  1. {automationSelect || "No Type"}
                </Typography>

                <Typography mb={1}>Select templates</Typography>
                <Autocomplete
                  options={invoiceTemplateOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue)}
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
                <Box mt={2}>
                  {" "}
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>

                <Button variant="text" onClick={handleAddConditions}>
                  Add Conditions
                </Button>
              </Box>
              <Box mt={2}>
                <Button
                  variant="contained"
                  onClick={handleSaveAutomation(index)}
                  sx={{
                    backgroundColor: "var(--color-save-btn)", // Normal background

                    "&:hover": {
                      backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                    },
                    borderRadius: "15px",
                  }}
                >
                  Save Automation
                </Button>
              </Box>
            </Grid>
            <Drawer
              anchor="right"
              open={isConditionsFormOpen}
              onClose={handleGoBack}
              PaperProps={{ sx: { width: "550px", padding: 2 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">
                  Apply automation only for accounts with these tags
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <AiOutlineSearch style={{ marginRight: 8 }} />
                    ),
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
                  {filteredTags.map((tag) => (
                    <Box
                      key={tag._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        borderBottom: "1px solid grey",
                        paddingBottom: 1,
                      }}
                    >
                      <Checkbox
                        checked={tempSelectedTags.includes(tag)}
                        onChange={() => handleCheckboxChange(tag)}
                      />
                      <Chip
                        label={tag.tagName}
                        sx={{
                          backgroundColor: tag.tagColour,
                          color: "#fff",
                          fontWeight: "500",
                          borderRadius: "20px",
                          marginRight: 1,
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isAnyCheckboxChecked}
                    onClick={handleAddTags}
                    sx={{
                      backgroundColor: "var(--color-save-btn)", // Normal background

                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                      },
                      borderRadius: "15px",
                      width: "80px",
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleGoBack}
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
            </Drawer>
          </>
        );
      case "Send Proposal/Els":
        return (
          <>
            <Grid item>
              <Box
                sx={{
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  padding: 2,
                  // marginBottom: 2,
                }}
              >
                <Typography gutterBottom>
                  1. {automationSelect || "No Type"}
                </Typography>
                <Typography mb={1}>Select template</Typography>
                <Autocomplete
                  options={proposalElsOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue)}
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
                <Box mt={2}>
                  {" "}
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>
                <Button variant="text" onClick={handleAddConditions}>
                  Add Conditions
                </Button>
              </Box>
              <Box mt={2}>
                <Button
                  variant="contained"
                  onClick={handleSaveAutomation(index)}
                  sx={{
                    backgroundColor: "var(--color-save-btn)", // Normal background

                    "&:hover": {
                      backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                    },
                    borderRadius: "15px",
                  }}
                >
                  Save Automation
                </Button>
              </Box>
            </Grid>

            <Drawer
              anchor="right"
              open={isConditionsFormOpen}
              onClose={handleGoBack}
              PaperProps={{ sx: { width: "550px", padding: 2 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">
                  Apply automation only for accounts with these tags
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <AiOutlineSearch style={{ marginRight: 8 }} />
                    ),
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
                  {filteredTags.map((tag) => (
                    <Box
                      key={tag._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        borderBottom: "1px solid grey",
                        paddingBottom: 1,
                      }}
                    >
                      <Checkbox
                        checked={tempSelectedTags.includes(tag)}
                        onChange={() => handleCheckboxChange(tag)}
                      />
                      <Chip
                        label={tag.tagName}
                        sx={{
                          backgroundColor: tag.tagColour,
                          color: "#fff",
                          fontWeight: "500",
                          borderRadius: "20px",
                          marginRight: 1,
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isAnyCheckboxChecked}
                    onClick={handleAddTags}
                    sx={{
                      backgroundColor: "var(--color-save-btn)", // Normal background

                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                      },
                      borderRadius: "15px",
                      width: "80px",
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleGoBack}
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
            </Drawer>
          </>
        );
      case "Send Email":
        return (
          <>
            <Grid item>
              <Box
                sx={{
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  padding: 2,
                  // marginBottom: 2,
                }}
              >
                <Typography gutterBottom>
                  1. {automationSelect || "No Type"}
                </Typography>
                <Autocomplete
                  options={emailTemplateOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue)}
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
                <Box mt={2}>
                  {" "}
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>
                <Button variant="text" onClick={handleAddConditions}>
                  Add Conditions
                </Button>
              </Box>
              <Box mt={2}>
                <Button
                  variant="contained"
                  onClick={handleSaveAutomation(stageSelected)}
                  sx={{
                    backgroundColor: "var(--color-save-btn)", // Normal background

                    "&:hover": {
                      backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                    },
                    borderRadius: "15px",
                  }}
                >
                  Save Automation
                </Button>
              </Box>
            </Grid>

            {/* Condition tags for automation */}
            <Drawer
              anchor="right"
              open={isConditionsFormOpen}
              onClose={handleGoBack}
              PaperProps={{ sx: { width: "550px", padding: 2 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">
                  Apply automation only for accounts with these tags
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <AiOutlineSearch style={{ marginRight: 8 }} />
                    ),
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
                  {filteredTags.map((tag) => (
                    <Box
                      key={tag._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        borderBottom: "1px solid grey",
                        paddingBottom: 1,
                      }}
                    >
                      <Checkbox
                        checked={tempSelectedTags.includes(tag)}
                        onChange={() => handleCheckboxChange(tag)}
                      />
                      <Chip
                        label={tag.tagName}
                        sx={{
                          backgroundColor: tag.tagColour,
                          color: "#fff",
                          fontWeight: "500",
                          borderRadius: "20px",
                          marginRight: 1,
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isAnyCheckboxChecked}
                    onClick={handleAddTags}
                    sx={{
                      backgroundColor: "var(--color-save-btn)", // Normal background

                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                      },
                      borderRadius: "15px",
                      width: "80px",
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleGoBack}
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
            </Drawer>
          </>
        );
      case "Apply folder template":
        return (
          <>
            <Grid item>
              <Box
                sx={{
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  padding: 2,
                  // marginBottom: 2,
                }}
              >
                <Typography gutterBottom>
                  1. {automationSelect || "No Type"}
                </Typography>

                <Typography mb={1}>Select template</Typography>
                <Autocomplete
                  options={optionfolder}
                  getOptionLabel={(option) => option.label}
                  value={selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue)}
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
                <Box mt={2}>
                  {" "}
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>
                <Button variant="text" onClick={handleAddConditions}>
                  Add Conditions
                </Button>
              </Box>
            </Grid>
            <Box mt={2}>
              <Button
                variant="contained"
                onClick={handleSaveAutomation(stageSelected)}
                sx={{
                  backgroundColor: "var(--color-save-btn)", // Normal background

                  "&:hover": {
                    backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                  },
                  borderRadius: "15px",
                }}
              >
                Save Automation
              </Button>
            </Box>

            {/* Condition tags for automation */}
            <Drawer
              anchor="right"
              open={isConditionsFormOpen}
              onClose={handleGoBack}
              PaperProps={{ sx: { width: "550px", padding: 2 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">
                  Apply automation only for accounts with these tags
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <AiOutlineSearch style={{ marginRight: 8 }} />
                    ),
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
                  {filteredTags.map((tag) => (
                    <Box
                      key={tag._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        borderBottom: "1px solid grey",
                        paddingBottom: 1,
                      }}
                    >
                      <Checkbox
                        checked={tempSelectedTags.includes(tag)}
                        onChange={() => handleCheckboxChange(tag)}
                      />
                      <Chip
                        label={tag.tagName}
                        sx={{
                          backgroundColor: tag.tagColour,
                          color: "#fff",
                          fontWeight: "500",
                          borderRadius: "20px",
                          marginRight: 1,
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isAnyCheckboxChecked}
                    onClick={handleAddTags}
                    sx={{
                      backgroundColor: "var(--color-save-btn)", // Normal background

                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                      },
                      borderRadius: "15px",
                      width: "80px",
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleGoBack}
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
            </Drawer>
          </>
        );
        case "Update account tags":
          return (
            <>
              <Box p={2} sx={{
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  padding: 2,
                  // marginBottom: 2,
                }}>
               1. {automationSelect}
  
                <Grid item >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
                    {/* Add Tags Section */}
                    <Box mt={2}>
                      <Typography gutterBottom variant="body2">Add Tags</Typography>
                      <FormControl
                        sx={{
                          width: "100%",
                          marginTop: "8px",
                          backgroundColor: "#fff",
                        }}
                        size="small"
                      >
                        <Select
                          multiple
                          size="small"
                          fullWidth
                          multiline
                          value={addTags}
                          onChange={handleAddTagChange}
                          input={<OutlinedInput />}
                          displayEmpty // Enables placeholder when no value is selected
                          renderValue={(selected) => {
                            if (selected.length === 0) {
                              return (
                                <span style={{ color: "#aaa" }}>
                                  Select tags...
                                </span>
                              ); // Placeholder
                            }
                            return (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "6px",
                                  padding: "6px",
                                  borderRadius: "10px",
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
                                        boxShadow:
                                          "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                        "& .MuiChip-deleteIcon": {
                                          color: "#fff",
                                          opacity: 0.7,
                                          transition: "opacity 0.2s",
                                          "&:hover": { opacity: 1 },
                                        },
                                      }}
                                    />
                                  );
                                })}
                              </Box>
                            );
                          }}
                          MenuProps={MenuProps}
                          sx={{
                            borderRadius: "10px",
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                            },
                          }}
                        >
                          {filteredAddTagsOptions.map((option) => {
                            // const dynamicWidth = Math.min(option.label.length * 10, 150); // Adjust width dynamically
                            // Create a canvas element to measure the actual text width
                            const canvas = document.createElement("canvas");
                            const context = canvas.getContext("2d");
                            context.font = "12px Arial"; // Match the font size/style of MenuItem
  
                            const textWidth = context.measureText(
                              option.label
                            ).width; // Get precise width
                            const dynamicWidth = Math.min(textWidth + 16, 150); // Add padding & set max width
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
                                  // alignItems: "center",
                                  // paddingLeft: "10px",
                                  whiteSpace: "nowrap", // Prevent line breaks
                                  // textAlign: "left", // Ensure text is left-aligned
                                  // paddingLeft: "10px", // Add left padding for proper alignment
                                  minWidth: `${dynamicWidth}px`,
                                  maxWidth: `${dynamicWidth}px`, // Dynamically set maxWidth
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
                      </FormControl>
                    </Box>
  
                    {/* Remove Tags Section */}
                    <Box mt={2}>
                    <Typography gutterBottom variant="body2">Remove Tags</Typography>
                      <FormControl
                        sx={{
                          width: "100%",
                          marginTop: "8px",
                          backgroundColor: "#fff",
                        }}
                        size="small"
                      >
                        <Select
                          multiple
                          size="small"
                          fullWidth
                          multiline
                          value={removeTags}
                          onChange={handleRemoveTagChange}
                          input={<OutlinedInput />}
                          displayEmpty // Enables placeholder when no value is selected
                          renderValue={(selected) => {
                            if (selected.length === 0) {
                              return (
                                <span style={{ color: "#aaa" }}>
                                  Select tags...
                                </span>
                              ); // Placeholder
                            }
                            return (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "6px",
                                  padding: "6px",
                                  borderRadius: "10px",
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
                                        boxShadow:
                                          "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                        "& .MuiChip-deleteIcon": {
                                          color: "#fff",
                                          opacity: 0.7,
                                          transition: "opacity 0.2s",
                                          "&:hover": { opacity: 1 },
                                        },
                                      }}
                                    />
                                  );
                                })}
                              </Box>
                            );
                          }}
                          MenuProps={MenuProps}
                          sx={{
                            borderRadius: "10px",
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "10px",
                            },
                          }}
                        >
                          {filteredRemoveTagsOptions.map((option) => {
                            // const dynamicWidth = Math.min(option.label.length * 10, 150); // Adjust width dynamically
                            // Create a canvas element to measure the actual text width
                            const canvas = document.createElement("canvas");
                            const context = canvas.getContext("2d");
                            context.font = "12px Arial"; // Match the font size/style of MenuItem
  
                            const textWidth = context.measureText(
                              option.label
                            ).width; // Get precise width
                            const dynamicWidth = Math.min(textWidth + 16, 150); // Add padding & set max width
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
                                  // alignItems: "center",
                                  // paddingLeft: "10px",
                                  whiteSpace: "nowrap", // Prevent line breaks
                                  // textAlign: "left", // Ensure text is left-aligned
                                  // paddingLeft: "10px", // Add left padding for proper alignment
                                  minWidth: `${dynamicWidth}px`,
                                  maxWidth: `${dynamicWidth}px`, // Dynamically set maxWidth
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
                      </FormControl>
                    </Box>
                  </Box>
  
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
  
                  <Button variant="text" onClick={handleAddConditions}>
                    Add Conditions
                  </Button>
                </Grid>
  
                <Button
                  variant="contained"
                  onClick={handleSaveAutomation(stageSelected)}
                  sx={{
                    backgroundColor: "var(--color-save-btn)", // Normal background
  
                    "&:hover": {
                      backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                    },
                    borderRadius: "15px",
                  }}
                >
                  Save Automation
                </Button>
              </Box>
              {/* Condition tags for automation */}
              <Drawer
                anchor="right"
                open={isConditionsFormOpen}
                onClose={handleGoBack}
                PaperProps={{ sx: { width: "550px", padding: 2 } }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton onClick={handleGoBack}>
                    <IoMdArrowRoundBack fontSize="large" color="blue" />
                  </IconButton>
                  <Typography variant="h6">Add conditions</Typography>
                </Box>
  
                <Box sx={{ padding: 2 }}>
                  <Typography variant="body1">
                    Apply automation only for accounts with these tags
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <AiOutlineSearch style={{ marginRight: 8 }} />
                      ),
                    }}
                    sx={{ marginTop: 2 }}
                  />
  
                  <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
                    {filteredTags.map((tag) => (
                      <Box
                        key={tag._id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          borderBottom: "1px solid grey",
                          paddingBottom: 1,
                        }}
                      >
                        <Checkbox
                          checked={tempSelectedTags.includes(tag)}
                          onChange={() => handleCheckboxChange(tag)}
                        />
                        <Chip
                          label={tag.tagName}
                          sx={{
                            backgroundColor: tag.tagColour,
                            color: "#fff",
                            fontWeight: "500",
                            borderRadius: "20px",
                            marginRight: 1,
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
  
                  <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={!isAnyCheckboxChecked}
                      onClick={handleAddTags}
                      sx={{
                        backgroundColor: "var(--color-save-btn)", // Normal background
  
                        "&:hover": {
                          backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                        },
                        borderRadius: "15px",
                        width: "80px",
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleGoBack}
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
              </Drawer>
            </>
          );
      case "Update job assignees":
  return (
    <>
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
            <Box mt={2} width={"50%"}>
              <Typography gutterBottom variant="body2">
                Add Assignees
              </Typography>
              <FormControl
                sx={{
                  width: "100%",
                  marginTop: "8px",
                  backgroundColor: "#fff",
                }}
                size="small"
              >
                <Select
                  multiple
                  size="small"
                  fullWidth
                  multiline
                  value={selectedAssignees}
                  onChange={(e) => setSelectedAssignees(e.target.value)}
                  input={<OutlinedInput />}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return (
                        <span style={{ color: "#aaa" }}>
                          Select assignees...
                        </span>
                      );
                    }
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                          padding: "6px",
                          borderRadius: "10px",
                        }}
                      >
                        {selected.map((value) => {
                          const option = assigneeOptions.find(
                            (opt) => opt.value === value
                          );
                          return (
                            <Chip
                              key={value}
                              label={option?.label}
                             
                            />
                          );
                        })}
                      </Box>
                    );
                  }}
                  MenuProps={MenuProps}
                  sx={{
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                >
                  {assigneeOptions.filter(opt => !assigneesToRemove.includes(opt.value)).map((option) => {
                 
                    return (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        
                      >
                        {option.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>

            <Box mt={2} width={"50%"}>
              <Typography gutterBottom variant="body2">
                Remove Assignees
              </Typography>
              <FormControl
                sx={{
                  width: "100%",
                  marginTop: "8px",
                  backgroundColor: "#fff",
                }}
                size="small"
              >
                <Select
                  multiple
                  size="small"
                  fullWidth
                  multiline
                  value={assigneesToRemove}
                  onChange={(e) => setAssigneesToRemove(e.target.value)}
                  input={<OutlinedInput />}
                  displayEmpty
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return (
                        <span style={{ color: "#aaa" }}>
                          Select assignees...
                        </span>
                      );
                    }
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                          padding: "6px",
                          borderRadius: "10px",
                        }}
                      >
                        {selected.map((value) => {
                          const option = assigneeOptions.find(
                            (opt) => opt.value === value
                          );
                          return (
                            <Chip
                              key={value}
                              label={option?.label}
                             
                            />
                          );
                        })}
                      </Box>
                    );
                  }}
                  MenuProps={MenuProps}
                  sx={{
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                >
                  {assigneeOptions.filter(opt => !selectedAssignees.includes(opt.value)).map((option) => {
                    // const canvas = document.createElement("canvas");
                    // const context = canvas.getContext("2d");
                    // context.font = "12px Arial";
                    // const textWidth = context.measureText(option.label).width;
                    // const dynamicWidth = Math.min(textWidth + 16, 150);
                    return (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        // sx={{
                        //   backgroundColor: "#f44336", // Red color for remove
                        //   color: "#fff",
                        //   fontSize: "10px",
                        //   borderRadius: "10px",
                        //   margin: "5px",
                        //   textAlign: "center",
                        //   display: "flex",
                        //   justifyContent: "center",
                        //   padding: "4px 9px",
                        //   whiteSpace: "nowrap",
                        //   minWidth: `${dynamicWidth}px`,
                        //   maxWidth: `${dynamicWidth}px`,
                        //   "&:hover": {
                        //     backgroundColor: "#d32f2f", // Darker red on hover
                        //     color: "#fff",
                        //   },
                        // }}
                      >
                        {option.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {selectedTags.length > 0 && (
            <Grid container alignItems="center" gap={1}>
              <Typography>Only for:</Typography>
              <Grid item>{selectedTagElements}</Grid>
            </Grid>
          )}

          <Button variant="text" onClick={handleAddConditions}>
            Add Conditions
          </Button>
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            onClick={handleSaveAutomation(stageSelected)}
            sx={{
              backgroundColor: "var(--color-save-btn)",
              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)",
              },
              borderRadius: "15px",
            }}
          >
            Save Automation
          </Button>
        </Box>
      </Grid>

      {/* Condition tags for automation */}
      <Drawer
        anchor="right"
        open={isConditionsFormOpen}
        onClose={handleGoBack}
        BackdropProps={{ invisible: true }}
        PaperProps={{ sx: { width: "550px", padding: 2 } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={handleGoBack}>
            <IoMdArrowRoundBack fontSize="large" color="blue" />
          </IconButton>
          <Typography variant="h6">Add conditions</Typography>
        </Box>

        <Box sx={{ padding: 2 }}>
          <Typography variant="body1">
            Apply automation only for accounts with these tags
          </Typography>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <AiOutlineSearch style={{ marginRight: 8 }} />
              ),
            }}
            sx={{ marginTop: 2 }}
          />

          <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
            {filteredTags.map((tag) => (
              <Box
                key={tag._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  borderBottom: "1px solid grey",
                  paddingBottom: 1,
                }}
              >
                <Checkbox
                  checked={tempSelectedTags.includes(tag)}
                  onChange={() => handleCheckboxChange(tag)}
                />
                <Chip
                  label={tag.tagName}
                  sx={{
                    backgroundColor: tag.tagColour,
                    color: "#fff",
                    fontWeight: "500",
                    borderRadius: "20px",
                    marginRight: 1,
                  }}
                />
              </Box>
            ))}
          </Box>

          <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={!isAnyCheckboxChecked}
              onClick={handleAddTags}
              sx={{
                backgroundColor: "var(--color-save-btn)",
                "&:hover": {
                  backgroundColor: "var(--color-save-hover-btn)",
                },
                borderRadius: "15px",
                width: "80px",
              }}
            >
              Add
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleGoBack}
              sx={{
                borderColor: "var(--color-border-cancel-btn)",
                color: "var(--color-save-btn)",
                "&:hover": {
                  backgroundColor: "var(--color-save-hover-btn)",
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
      </Drawer>
    </>
  );
      
      
        case "Create Organizer":
        return (
          <>
            <Grid item>
              <Box
                sx={{
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  padding: 2,
                  // marginBottom: 2,
                }}
              >
                <Typography gutterBottom>
                  1. {automationSelect || "No Type"}
                </Typography>
                <Autocomplete
                  options={organizerOptions}
                  getOptionLabel={(option) => option.label}
                  value={selectedtemp}
                  onChange={(event, newValue) => handletemp(newValue)}
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
                <Box mt={2}>
                  {" "}
                  {selectedTags.length > 0 && (
                    <Grid container alignItems="center" gap={1}>
                      <Typography>Only for:</Typography>
                      <Grid item>{selectedTagElements}</Grid>
                    </Grid>
                  )}
                </Box>
                <Button variant="text" onClick={handleAddConditions}>
                  Add Conditions
                </Button>
              </Box>
            </Grid>
            <Box mt={2}>
              <Button
                variant="contained"
                onClick={handleSaveAutomation(stageSelected)}
                sx={{
                  backgroundColor: "var(--color-save-btn)", // Normal background

                  "&:hover": {
                    backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                  },
                  borderRadius: "15px",
                }}
              >
                Save Automation
              </Button>
            </Box>

            {/* Condition tags for automation */}
            <Drawer
              anchor="right"
              open={isConditionsFormOpen}
              onClose={handleGoBack}
              PaperProps={{ sx: { width: "550px", padding: 2 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton onClick={handleGoBack}>
                  <IoMdArrowRoundBack fontSize="large" color="blue" />
                </IconButton>
                <Typography variant="h6">Add conditions</Typography>
              </Box>

              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">
                  Apply automation only for accounts with these tags
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <AiOutlineSearch style={{ marginRight: 8 }} />
                    ),
                  }}
                  sx={{ marginTop: 2 }}
                />

                <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
                  {filteredTags.map((tag) => (
                    <Box
                      key={tag._id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        borderBottom: "1px solid grey",
                        paddingBottom: 1,
                      }}
                    >
                      <Checkbox
                        checked={tempSelectedTags.includes(tag)}
                        onChange={() => handleCheckboxChange(tag)}
                      />
                      <Chip
                        label={tag.tagName}
                        sx={{
                          backgroundColor: tag.tagColour,
                          color: "#fff",
                          fontWeight: "500",
                          borderRadius: "20px",
                          marginRight: 1,
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!isAnyCheckboxChecked}
                    onClick={handleAddTags}
                    sx={{
                      backgroundColor: "var(--color-save-btn)", // Normal background

                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                      },
                      borderRadius: "15px",
                      width: "80px",
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleGoBack}
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
            </Drawer>
          </>
        );
        case "Update client-facing job status":
                return (
                  <>
                    <Grid item>
                      {/* {automationSelect} */}
                      <Box
                        sx={{
                          border: "2px solid #ddd",
                          borderRadius: "8px",
                          padding: 2,
                          // marginBottom: 2,
                        }}
                      >
                        <Typography gutterBottom>
                          1. {automationSelect || "No Type"}
                        </Typography>
                        <Typography gutterBottom fontSize={"12px"}>
                          The client-facing status will update automatically as soon as
                          the job enters the stage. Your clients will see it in their
                          client portal.
                        </Typography>
        
                        <Grid container spacing={2} mt={2}>
                          <Grid item xs={12}>
                            <InputLabel sx={{ color: "black", mb: 1 }}>
                              Visibility for client
                            </InputLabel>
                            <Autocomplete
                              options={statusOptions}
                              getOptionLabel={(option) => option.label}
                              value={status}
                            onChange={handleStatusChange}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  variant="outlined"
                                  placeholder="Select status"
                                />
                              )}
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                        {status?.value === true && (
                          <Box>
                            <Box>
                              <InputLabel sx={{ color: "black", mb: 1, mt: 1 }}>
                                Select status
                              </InputLabel>
                              <Autocomplete
                                options={optionstatus}
                                size="small"
                                sx={{ mt: 1 }}
                                value={selectedClientStatus}
                                onChange={handleClientStatusChange}
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
                                    placeholder="Select status"
                                    InputProps={{
                                      ...params.InputProps,
                                      startAdornment:
                                        params.inputProps.value &&
                                        clientFacingJobs.length > 0 ? (
                                          <Chip
                                            size="small"
                                            style={{
                                              backgroundColor: clientFacingJobs.find(
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
                            <Box mt={1}>
                              <InputLabel sx={{ color: "black", mb: 1 }}>
                                Status description for client
                              </InputLabel>
                              <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                value={clientDescription}
                                onChange={handleClientDescriptionChange}
                                placeholder="Status description for client"
                              />
                              <Typography variant="caption" color="textSecondary">
                                {clientDescription.length}/{maxDescriptionLength}
                              </Typography>
                            </Box>
                          </Box>
                        )}
        
                        <Box mt={2}>
                          {" "}
                          {selectedTags.length > 0 && (
                            <Grid container alignItems="center" gap={1}>
                              <Typography>Only for:</Typography>
                              <Grid item>{selectedTagElements}</Grid>
                            </Grid>
                          )}
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button variant="text" onClick={handleAddConditions}>
                            Add Conditions
                          </Button>
                        </Box>
                      </Box>
                      <Box mt={2}>
                        <Button
                          variant="contained"
                          onClick={handleSaveAutomation(stageSelected)}
                          sx={{
                            backgroundColor: "var(--color-save-btn)", // Normal background
        
                            "&:hover": {
                              backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                            },
                            borderRadius: "15px",
                          }}
                        >
                          Save Automation
                        </Button>
                      </Box>
                    </Grid>
                    <Drawer
                      anchor="right"
                      open={isConditionsFormOpen}
                      onClose={handleGoBack}
                      BackdropProps={{ invisible: true }}
                      PaperProps={{ sx: { width: "550px", padding: 2 } }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton onClick={handleGoBack}>
                          <IoMdArrowRoundBack fontSize="large" color="blue" />
                        </IconButton>
                        <Typography variant="h6">Add conditions</Typography>
                      </Box>
        
                      <Box sx={{ padding: 2 }}>
                        <Typography variant="body1">
                          Apply automation only for accounts with these tags
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          InputProps={{
                            startAdornment: (
                              <AiOutlineSearch style={{ marginRight: 8 }} />
                            ),
                          }}
                          sx={{ marginTop: 2 }}
                        />
        
                        <Box sx={{ marginTop: 2, height: "68vh", overflowY: "auto" }}>
                          {filteredTags.map((tag) => (
                            <Box
                              key={tag._id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 3,
                                borderBottom: "1px solid grey",
                                paddingBottom: 1,
                              }}
                            >
                              <Checkbox
                                checked={tempSelectedTags.includes(tag)}
                                onChange={() => handleCheckboxChange(tag)}
                              />
                              <Chip
                                label={tag.tagName}
                                sx={{
                                  backgroundColor: tag.tagColour,
                                  color: "#fff",
                                  fontWeight: "500",
                                  borderRadius: "20px",
                                  marginRight: 1,
                                }}
                              />
                            </Box>
                          ))}
                        </Box>
        
                        <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            disabled={!isAnyCheckboxChecked}
                            onClick={handleAddTags}
                            sx={{
                              backgroundColor: "var(--color-save-btn)", // Normal background
        
                              "&:hover": {
                                backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                              },
                              borderRadius: "15px",
                              width: "80px",
                            }}
                          >
                            Add
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleGoBack}
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
                    </Drawer>
                  </>
                );
      // Add cases for other actions here
      default:
        return null;
    }
  };

  // const handleSaveAutomation = (index) => {
  //   return () => {
  //     const updatedStages = [...stages];
  //     console.log("Updated Stages before update:", updatedStages);

  //     const selectedAutomation = {
  //       type: automationSelect,
  //       template: selectedtemp
  //         ? { label: selectedtemp.label, value: selectedtemp.value }
  //         : null,
  //       tags: selectedTags.map((tag) => ({
  //         _id: tag._id,
  //         tagName: tag.tagName,
  //         tagColour: tag.tagColour,
  //       })),
  //     };

  //     // Make sure the right stage is getting updated
  // updatedStages[index] = {
  //   // ...updatedStages[index], // Ensure we keep the other properties of the stage intact
  //   automations: [...updatedStages[index].automations, selectedAutomation], // Add the new automation to automations
  // };

  //     setStages(updatedStages);
  //     console.log("Automation saved for stage:", index, selectedAutomation);

  //     // Reset form fields
  //     setselectedTemp(null);
  //     setSelectedTags([]);
  //     setIsAnyCheckboxChecked(false);
  //     handleDrawerClose();
  //   };
  // };

  // const handleSaveAutomation = () => {
  //   return () => {
  //     if (stageSelected === null || stageSelected === undefined) {
  //       console.error("No stage selected for automation.");
  //       return;
  //     }
  //     console.log("stage index for automations:", stageSelected);
  //     const updatedStages = [...stages];

  //     const selectedAutomation = {
  //       type: automationSelect, // The type of automation (e.g., "Send Email")
  //       template: selectedtemp
  //         ? { label: selectedtemp.label, value: selectedtemp.value }
  //         : null, // Store label and value of selected template
  //       tags: selectedTags.map((tag) => ({
  //         _id: tag._id,
  //         tagName: tag.tagName,
  //         tagColour: tag.tagColour,
  //       })),
  //     };

  //     // Ensure selected stage exists before pushing automation
  //     if (!updatedStages[stageSelected].automations) {
  //       updatedStages[stageSelected].automations = [];
  //     }

  //     // updatedStages[stageSelected].automations.push(selectedAutomation);
  //     updatedStages[stageSelected] = {
  //       ...updatedStages[stageSelected], // Ensure we keep the other properties of the stage intact
  //       automations: [
  //         ...updatedStages[stageSelected].automations,
  //         selectedAutomation,
  //       ], // Add the new automation to automations
  //     };
  //     setStages(updatedStages);
  //     console.log("updatedstages", updatedStages);
  //     console.log(
  //       "Automation saved for stage:",
  //       stageSelected,
  //       selectedAutomation
  //     );

  //     // Reset states after saving
  //     setselectedTemp(null);
  //     setSelectedTags([]);
  //     setIsAnyCheckboxChecked(false);
  //     handleDrawerClose();
  //   };
  // };


  const handleSaveAutomation = () => {
    return () => {
      if (stageSelected === null || stageSelected === undefined) {
        console.error("No stage selected for automation.");
        return;
      }
      console.log("stage index for automations:", stageSelected);
      const updatedStages = [...stages];

      // Define automation object based on type
      const selectedAutomation = {
        type: automationSelect, // The type of automation (e.g., "Send Email", "Update account tags")
        template: selectedtemp
          ? { label: selectedtemp.label, value: selectedtemp.value }
          : null, // Store label and value of selected template
        tags: selectedTags.map((tag) => ({
          _id: tag._id,
          tagName: tag.tagName,
          tagColour: tag.tagColour,
        })),
      };

      // If automation type is "Update account tags", include addTags and removeTags fields
      if (automationSelect === "Update account tags") {
        selectedAutomation.addTags = addTags.map((tagId) => {
          const tag = tags.find((t) => t._id === tagId);
          return tag
            ? {
                _id: tag._id,
                tagName: tag.tagName,
                tagColour: tag.tagColour,
              }
            : null;
        });

        selectedAutomation.removeTags = removeTags.map((tagId) => {
          const tag = tags.find((t) => t._id === tagId);
          return tag
            ? {
                _id: tag._id,
                tagName: tag.tagName,
                tagColour: tag.tagColour,
              }
            : null;
        });
      }else if (automationSelect === "Update job assignees") {
      selectedAutomation.addAssignees = selectedAssignees.map((userId) => {
        const user = assignee.find((u) => u._id === userId);
        return user ? { _id: user._id, username: user.username } : null;
      });
      
      selectedAutomation.removeAssignees = assigneesToRemove.map((userId) => {
        const user = assignee.find((u) => u._id === userId);
        return user ? { _id: user._id, username: user.username } : null;
      });} else if (automationSelect === "Update client-facing job status") {
        selectedAutomation.visibilityForClient = status.value; // true/false
        selectedAutomation.selectedClientStatus = selectedClientStatus
          ? {
              label: selectedClientStatus.label,
              value: selectedClientStatus.value,
              clientfacingColour: selectedClientStatus.clientfacingColour,
            }
          : null;
        selectedAutomation.statusDescription = clientDescription || null;
      }

      // Ensure selected stage exists before adding automation
      updatedStages[stageSelected] = {
        ...updatedStages[stageSelected], // Keep other stage properties
        automations: [
          ...updatedStages[stageSelected].automations,
          selectedAutomation,
        ], // Add the new automation
      };

      setStages(updatedStages);
      console.log("updatedstages", updatedStages);
      console.log(
        "Automation saved for stage:",
        stageSelected,
        selectedAutomation
      );

      // Reset states after saving
      setselectedTemp(null);
      setSelectedTags([]);
      setIsAnyCheckboxChecked(false);
      setAddTags([]); // Reset addTags
      setRemoveTags([]); // Reset removeTags
      handleDrawerClose();
    };
  };
  return (
    <Box >
      <Box>
        <form>
          <Box>
            <Typography variant="h5" gutterBottom>
              {" "}
              Edit Pipelines
            </Typography>
            <Box mt={2} mb={2}>
              <hr />
            </Box>
            <Grid container spacing={2}>
              <Grid xs={12} sm={5.8}>
                <Box>
                  <InputLabel sx={{ color: "black" }}>Pipeline Name</InputLabel>

                  <TextField
                    size="small"
                    margin="normal"
                    placeholder="Pipeline Name"
                    fullWidth
                    value={piplineName}
                    onChange={(e) => setPipeLineName(e.target.value)}
                  />
                </Box>
                <Box mt={1}>
                  <InputLabel sx={{ color: "black" }}>Available To</InputLabel>
                  <Autocomplete
                    multiple
                    sx={{ marginTop: "8px" }}
                    options={options}
                    size="small"
                    getOptionLabel={(option) => option.label}
                    value={selectedUser}
                    onChange={handleUserChange}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{ cursor: "pointer", margin: "5px 10px" }}
                      >
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Available To"
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                  />
                </Box>
                <Box mt={2}>
                  <InputLabel sx={{ color: "black" }}>Sort jobs by</InputLabel>

                  <Autocomplete
                    className="select-dropdown"
                    options={optionsort}
                    value={selectedSortByJob}
                    onChange={(event, newValue) =>
                      handleSortingByJobs(newValue)
                    }
                    getOptionLabel={(option) => option.label || ""}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{ cursor: "pointer", margin: "5px 10px" }}
                      >
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Sort By Job"
                        size="small"
                        sx={{ width: "100%", marginTop: "8px" }}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    disableClearable={false}
                    clearOnEscape
                  />
                </Box>

                <Box mt={2}>
                  <InputLabel sx={{ color: "black" }}>
                    Default job template
                  </InputLabel>

                  <Autocomplete
                    className="select-dropdown"
                    options={optiontemp}
                    value={selectedJobtemp}
                    onChange={handleJobtemp}
                    getOptionLabel={(option) => option.label || ""}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        {...props}
                        sx={{ cursor: "pointer", margin: "5px 10px" }}
                      >
                        {option.label}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Default job template"
                        size="small"
                        sx={{ width: "100%", marginTop: "8px" }}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    disableClearable={false}
                    clearOnEscape
                  />
                </Box>

                <Box mt={3}>
                  <Typography variant="h6">Job card fields</Typography>
                  <Grid container spacing={5} mt={2}>
                    <Grid item xs={4}>
                      <Box mt={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={Account_id}
                              onChange={handleAccount_idChange}
                              color="primary"
                            />
                          }
                          label={"Account ID"}
                        />
                      </Box>
                      <Box mt={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={Days_on_stage}
                              onChange={handleDays_on_stageChange}
                              color="primary"
                            />
                          }
                          label={"Days in stage"}
                        />
                      </Box>
                      <Box mt={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={Account_tags}
                              onChange={handleAccount_tagsChange}
                              color="primary"
                            />
                          }
                          label={"Account tags"}
                        />
                      </Box>
                      <Box mt={2}>
                                                                        <FormControlLabel
                                                                          control={
                                                                            <Switch
                                                                               checked={clientFacing_status}
                                                        onChange={handleClientFacing_status}
                                                                              color="primary"
                                                                            />
                                                                          }
                                                                          label={"Client-facing Status"}
                                                                        />
                                                                      </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Box mt={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={startDate}
                              onChange={handleStartDateChange}
                              color="primary"
                            />
                          }
                          label={"Start date"}
                        />
                      </Box>
                      <Box mt={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={Name}
                              onChange={handleNameSwitchChange}
                              color="primary"
                            />
                          }
                          label={"Name"}
                        />
                      </Box>
                      <Box mt={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={Due_date}
                              onChange={handleDue_dateChange}
                              color="primary"
                            />
                          }
                          label={"Due date"}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Box mt={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={Description}
                              onChange={handleDescriptionChange}
                              color="primary"
                            />
                          }
                          label={"Description"}
                        />
                      </Box>
                      <Box mt={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={Assignees}
                              onChange={handleAssigneesChange}
                              color="primary"
                            />
                          }
                          label={"Assignees"}
                        />
                      </Box>
                      <Box mt={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={Priority}
                              onChange={handlePriorityChange}
                              color="primary"
                            />
                          }
                          label={"Priority"}
                        />
                      </Box>

                      
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={0.4}
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                <Box
                  sx={{
                    borderLeft: "1px solid black",
                    height: "100%",
                    ml: 1.5,
                  }}
                ></Box>
              </Grid>
              <Grid xs={12} sm={5.8}>
                <Typography>Default recurrence setting</Typography>
              </Grid>
            </Grid>
            <Box
              mt={5}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="h6">Stages</Typography>
              <Button
                variant="contained"
                startIcon={<LuPlusCircle />}
                onClick={() => handleAddStage(stages.length)}
                sx={{
                  backgroundColor: "var(--color-save-btn)", // Normal background

                  "&:hover": {
                    backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                  },
                  borderRadius: "15px",
                }}
              >
                Add stage
              </Button>
            </Box>
            <Box mt={2}>
              <hr />
            </Box>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  gap: "25px",
                  alignContent: "center",
                  marginBottom: "10px",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    overflowX: "auto",
                    overflowY: "auto",
                    whiteSpace: "nowrap",
                    paddingBottom: "8px",
                    maxWidth: "100%",
                    alignItems: "flex-start",
                    minHeight: "300px", // Set a minimum height
                    maxHeight: "500px", // Set a maximum height to trigger vertical scrolling
                  }}
                  className="stage-scroll"
                >
                  {/* {stages.map((stage, index) => (
                    <React.Fragment key={index}>
                      <Box
                        sx={{
                          minWidth: "250px",
                          maxWidth: "270px",
                          padding: "20px",
                          borderRadius: "12px",
                          backgroundColor: "#F5F5F7",
                          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                          flexShrink: 0,
                        }}
                      >
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <RxDragHandleDots2 />
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                flexGrow: 1,
                                gap: "5px",
                              }}
                            >
                              <TextField
                                variant="standard"
                                placeholder="Stage Name"
                                fullWidth
                                size="small"
                                value={stage.name}
                                onChange={(e) =>
                                  handleStageNameChange(e, index)
                                }
                                multiline // Allow multiple lines
                                sx={{
                                  fontSize: "16px", // Adjust the font size
                                  fontWeight: "500", // Adjust the font weight
                                }}
                                error={!!stageNameErrors[index]}
                                helperText={stageNameErrors[index]}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <LuPenLine style={{ fontSize: "10px" }} />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Box>
                            <IconButton
                              onClick={() => handleDeleteStage(index)}
                              sx={{ fontSize: "15px", color: "red" }}
                            >
                              <RiDeleteBin6Line sx={{ cursor: "pointer" }} />
                            </IconButton>
                          </Box>
                          <Divider />
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              Stage conditions
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {index === 0
                                ? "First stage can't have conditions"
                                : index === stages.length - 1
                                  ? "Last stage can't have conditions"
                                  : "Job enters this stage if conditions are met"}
                            </Typography>

                            <Typography
                              variant="subtitle2"
                              fontWeight="bold"
                              sx={{ mt: 2 }}
                            >
                              Automations
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Triggered when job enters stage
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                cursor: "pointer",
                                color: "blue",
                                fontWeight: "bold",
                                mt: 1,
                              }}
                              onClick={(e) => handleClick(e, index, "edit")}
                            >
                              {stage.automations.length > 0
                                ? "Edit automation"
                                : "Add automation"}
                            </Typography>
                            <Menu
                              anchorEl={anchorEl}
                              open={Boolean(anchorEl)}
                              onClose={handleClose}
                            >
                              <MenuItem
                                onClick={() =>
                                  handleAddAutomation(
                                    stageSelected,
                                    "Send Email"
                                  )
                                }
                              >
                                Send Email
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleAddAutomation(
                                    stageSelected,
                                    "Send Invoice"
                                  )
                                }
                              >
                                Send Invoice
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleAddAutomation(
                                    stageSelected,
                                    "Send Proposal/Els"
                                  )
                                }
                              >
                                Send Proposal/Els
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleAddAutomation(
                                    stageSelected,
                                    "Create Organizer"
                                  )
                                }
                              >
                                Create Organizer
                              </MenuItem>
                              <MenuItem
                                onClick={() =>
                                  handleAddAutomation(
                                    stageSelected,
                                    "Apply folder template"
                                  )
                                }
                              >
                                Apply folder template
                              </MenuItem>
                            </Menu>
                            <AddAutomationDrawer
                              isDrawerOpen={isDrawerOpen}
                              handleDrawerClose={handleDrawerClose}
                              renderActionContent={renderActionContent}
                              automationSelect={automationSelect}
                              index={index}
                              handleEditClick={handleEditClick}
                              handleEditSaveAutomation={
                                handleEditSaveAutomation
                              }
                              ehitAnchorEl={ehitAnchorEl}
                              handleEditClose={handleEditClose}
                              handleMenuItemSelect={handleMenuItemSelect}
                             
                              
                            />
                            <EditAutomationDrawer
                              isEditDrawerOpen={isEditDrawerOpen}
                              setIsEditDrawerOpen={setIsEditDrawerOpen}
                              selectedAutomationData={selectedAutomationData}
                              handleDeleteAutomation={handleDeleteAutomation}
                              handleEditTemplateChange={
                                handleEditTemplateChange
                              }
                              emailTemplateOptions={emailTemplateOptions}
                              invoiceTemplateOptions={invoiceTemplateOptions}
                              organizerOptions={organizerOptions}
                              proposalElsOptions={proposalElsOptions}
                              optionfolder={optionfolder}
                              setSelectedAutomationIndex={
                                setSelectedAutomationIndex
                              }
                              handleEditConditions={handleEditConditions}
                              handleEditClick={handleEditClick}
                              handleEditSaveAutomation={
                                handleEditSaveAutomation
                              }
                              ehitAnchorEl={ehitAnchorEl}
                              handleEditClose={handleEditClose}
                              handleMenuItemSelect={handleMenuItemSelect}
                              isConditionsEditFormOpen={
                                isConditionsEditFormOpen
                              }
                              setIsConditionsEditFormOpen={
                                setIsConditionsEditFormOpen
                              }
                              selectedAutomationIndex={selectedAutomationIndex}
                              handleEditGoBack={handleEditGoBack}
                              handleEditCheckboxChange={
                                handleEditCheckboxChange
                              }
                              handleEditAddTags={handleEditAddTags}
                              searchTerm={searchTerm}
                              handleSearchChange={handleSearchChange}
                              filteredTags={filteredTags}
                              stageAutomationTags={stageAutomationTags}
                              setTempSelectedTags={setTempSelectedTags}
                            />

                            <Box>
                              {stage.automations.length > 0 && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                    mt: 2,
                                  }}
                                >
                                  {stage.automations.map((automation, idx) => (
                                    <Card
                                      key={idx}
                                      sx={{
                                        width: "100%",
                                        boxShadow:
                                          "0px 1px 5px rgba(0,0,0,0.1)",
                                      }}
                                    >
                                      <CardContent>
                                        <Typography
                                          variant="body2"
                                          fontWeight="bold"
                                        >
                                          {idx + 1}. {automation.type}
                                        </Typography>
                                        {automation.template && (
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                          >
                                            {automation.template.label.length >
                                            25
                                              ? `${automation.template.label.slice(0, 25)}...`
                                              : automation.template.label}
                                          </Typography>
                                        )}
                                        {automation.tags &&
                                          automation.tags.length > 0 && (
                                            <Box
                                              sx={{
                                                display: "flex",
                                                gap: 1,
                                                flexWrap: "wrap",
                                                marginTop: 2,
                                              }}
                                            >
                                              <Typography variant="body2">
                                                Conditions:
                                              </Typography>
                                              {automation.tags.map((tag) => (
                                                <Box
                                                  key={tag._id}
                                                  sx={{
                                                    backgroundColor:
                                                      tag.tagColour,
                                                    color: "#fff",
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    textAlign: "center",
                                                    padding: "3px 8px",
                                                    borderRadius: "12px",
                                                    marginBottom: "4px",
                                                  }}
                                                >
                                                  {tag.tagName}
                                                </Box>
                                              ))}
                                            </Box>
                                          )}
                                      </CardContent>
                                    </Card>
                                  ))}
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                      {index < stages.length - 1 && (
                        <IconButton onClick={() => handleAddStage(index + 1)}>
                          <LuPlusCircle
                            style={{
                              color: "var(--color-save-btn",
                              width: "25px",
                              height: "25px",
                            }}
                          />
                        </IconButton>
                      )}
                    </React.Fragment>
                  ))} */}
                     {stages.map((stage, index) => (
                        <React.Fragment key={index}>
                          <Box
                            sx={{
                              minWidth: "250px",
                              maxWidth: "270px",
                              padding: "20px",
                              borderRadius: "12px",
                              backgroundColor: "#F5F5F7",
                              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                              flexShrink: 0,
                            }}
                          >
                            <Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  marginBottom: "10px",
                                }}
                              >
                                <RxDragHandleDots2 />
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexGrow: 1,
                                    gap: "5px",
                                  }}
                                >
                                  <TextField
                                    variant="standard"
                                    placeholder="Stage Name"
                                    fullWidth
                                    size="small"
                                    value={stage.name}
                                    onChange={(e) =>
                                      handleStageNameChange(e, index)
                                    }
                                    multiline // Allow multiple lines
                                    sx={{
                                      fontSize: "16px", // Adjust the font size
                                      fontWeight: "500", // Adjust the font weight
                                    }}
                                    error={!!stageNameErrors[index]}
                                    helperText={stageNameErrors[index]}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <LuPenLine
                                            style={{ fontSize: "10px" }}
                                          />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                </Box>
                                <IconButton
                                  onClick={() => handleDeleteStage(index)}
                                  sx={{ fontSize: "15px", color: "red" }}
                                >
                                  <RiDeleteBin6Line
                                    sx={{ cursor: "pointer" }}
                                  />
                                </IconButton>
                              </Box>
                              <Divider />
                              <Box sx={{ mt: 2 }}>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight="bold"
                                >
                                  Stage conditions
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {index === 0
                                    ? "First stage can't have conditions"
                                    : index === stages.length - 1
                                      ? "Last stage can't have conditions"
                                      : "Job enters this stage if conditions are met"}
                                </Typography>

                                <Typography
                                  variant="subtitle2"
                                  fontWeight="bold"
                                  sx={{ mt: 2 }}
                                >
                                  Automations
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Triggered when job enters stage
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    cursor: "pointer",
                                    color: "blue",
                                    fontWeight: "bold",
                                    mt: 1,
                                  }}
                                  onClick={(e) => handleClick(e, index, "edit")}
                                >
                                  {stage.automations.length > 0
                                    ? "Edit automation"
                                    : "Add automation"}
                                </Typography>
                                <Menu
                                  anchorEl={anchorEl}
                                  open={Boolean(anchorEl)}
                                  onClose={handleClose}
                                  PaperProps={{
                                    style: {
                                      maxHeight: 200, // Adjust the height as needed
                                      overflowY: "auto",
                                    },
                                  }}
                                >
                                  <MenuItem
                                    onClick={() =>
                                      handleAddAutomation(
                                        stageSelected,
                                        "Send Email"
                                      )
                                    }
                                  >
                                    Send Email
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      handleAddAutomation(
                                        stageSelected,
                                        "Send Invoice"
                                      )
                                    }
                                  >
                                    Send Invoice
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      handleAddAutomation(
                                        stageSelected,
                                        "Send Proposal/Els"
                                      )
                                    }
                                  >
                                    Send Proposal/Els
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      handleAddAutomation(
                                        stageSelected,
                                        "Create Organizer"
                                      )
                                    }
                                  >
                                    Create Organizer
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      handleAddAutomation(
                                        stageSelected,
                                        "Apply folder template"
                                      )
                                    }
                                  >
                                    Apply folder template
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      handleAddAutomation(
                                        stageSelected,
                                        "Update account tags"
                                      )
                                    }
                                  >
                                    Update account tags
                                  </MenuItem>
                                  {/* Update job assignees */}
                                  <MenuItem
                                    onClick={() =>
                                      handleAddAutomation(
                                        stageSelected,
                                        "Update job assignees"
                                      )
                                    }
                                  >
                                    Update job assignees
                                  </MenuItem>
                                   <MenuItem
                                                                      onClick={() =>
                                                                        handleAddAutomation(
                                                                          stageSelected,
                                                                          "Create Task"
                                                                        )
                                                                      }
                                                                    >
                                                                      Create Task
                                                                    </MenuItem>
                                                                    {/* Send message */}
                                                                    <MenuItem
                                                                      onClick={() =>
                                                                        handleAddAutomation(
                                                                          stageSelected,
                                                                          "Send message"
                                                                        )
                                                                      }
                                                                    >
                                                                     Send message
                                                                    </MenuItem>
                                <MenuItem
                                                                    onClick={() =>
                                                                      handleAddAutomation(
                                                                        stageSelected,
                                                                        "Update client-facing job status"
                                                                      )
                                                                    }
                                                                  >
                                                                    Update client-facing job status
                                                                  </MenuItem>
                                </Menu>
                                <AddAutomationDrawer
                                  isDrawerOpen={isDrawerOpen}
                                  handleDrawerClose={handleDrawerClose}
                                  renderActionContent={renderActionContent}
                                  automationSelect={automationSelect}
                                  index={index}
                                  handleEditClick={handleEditClick}
                                  handleEditSaveAutomation={
                                    handleEditSaveAutomation
                                  }
                                  ehitAnchorEl={ehitAnchorEl}
                                  handleEditClose={handleEditClose}
                                  handleMenuItemSelect={handleMenuItemSelect}
                                />
                                <EditAutomationDrawer
                                  isEditDrawerOpen={isEditDrawerOpen}
                                  setIsEditDrawerOpen={setIsEditDrawerOpen}
                                  selectedAutomationData={
                                    selectedAutomationData
                                  }
                                    setSelectedAutomationData={setSelectedAutomationData}
                                  handleDeleteAutomation={
                                    handleDeleteAutomation
                                  }
                                  handleEditTemplateChange={
                                    handleEditTemplateChange
                                  }
                                  emailTemplateOptions={emailTemplateOptions}
                                  invoiceTemplateOptions={
                                    invoiceTemplateOptions
                                  }
                                  organizerOptions={organizerOptions}
                                  proposalElsOptions={proposalElsOptions}
                                  optionfolder={optionfolder}
                                  setSelectedAutomationIndex={
                                    setSelectedAutomationIndex
                                  }
                                  handleEditConditions={handleEditConditions}
                                  handleEditClick={handleEditClick}
                                  handleEditSaveAutomation={
                                    handleEditSaveAutomation
                                  }
                                  ehitAnchorEl={ehitAnchorEl}
                                  handleEditClose={handleEditClose}
                                  handleMenuItemSelect={handleMenuItemSelect}
                                  isConditionsEditFormOpen={
                                    isConditionsEditFormOpen
                                  }
                                  setIsConditionsEditFormOpen={
                                    setIsConditionsEditFormOpen
                                  }
                                  selectedAutomationIndex={
                                    selectedAutomationIndex
                                  }
                                  handleEditGoBack={handleEditGoBack}
                                  handleEditCheckboxChange={
                                    handleEditCheckboxChange
                                  }
                                  handleEditAddTags={handleEditAddTags}
                                  searchTerm={searchTerm}
                                  handleSearchChange={handleSearchChange}
                                  filteredTags={filteredTags}
                                  stageAutomationTags={stageAutomationTags}
                                  setTempSelectedTags={setTempSelectedTags}
                                  filteredAddTagsOptions={
                                    filteredAddTagsOptions
                                  }
                                  tagsoptions={tagsoptions}
                                    assigneeOptions={assigneeOptions}
                                  taskTemplateOptions={taskTemplateOptions}
                                  chatTemplateOptions={chatTemplateOptions}

                                  handleTagChange={handleTagChange}
statusOptions={statusOptions}
                                  // status={status}
                                  handleStatusChange={handleStatusChange}
                                  setStatus={setStatus}
                                    handleAssigneeChange={handleAssigneeChange}
                                  optionstatus={optionstatus}
                                  setClientDescription={setClientDescription}
                                setEditClientDescripation={setEditClientDescripation}
                                  setSelectedClientStatus={setSelectedClientStatus}
                                  maxDescriptionLength={maxDescriptionLength}
                                  handleClientDescriptionChange={handleClientDescriptionChange}
                                  clientFacingJobs={clientFacingJobs}
                                  setClientFacingJobs={setClientFacingJobs}
                                  handleClientStatusChange={handleClientStatusChange}
                                handleEditClientChange={handleEditClientChange}
                                />

                                <Box>
                                  {stage.automations.length > 0 && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                        mt: 2,
                                      }}
                                    >
                                      {stage.automations.map(
                                        (automation, idx) => (
                                          <Card
                                            key={idx}
                                            sx={{
                                              width: "100%",
                                              boxShadow:
                                                "0px 1px 5px rgba(0,0,0,0.1)",
                                            }}
                                          >
                                            <CardContent>
                                              <Typography
                                                variant="body2"
                                                fontWeight="bold"
                                              >
                                                {idx + 1}. {automation.type}
                                              </Typography>
                                              {automation.template && (
                                                <Typography
                                                  variant="body2"
                                                  color="text.secondary"
                                                >
                                                  {automation.template.label
                                                    .length > 25
                                                    ? `${automation.template.label.slice(0, 25)}...`
                                                    : automation.template.label}
                                                </Typography>
                                              )}
                                              {automation.addTags &&
                                                automation.addTags.length >
                                                  0 && (
                                                  <Box sx={{ marginTop: 2 }}>
                                                    <Typography
                                                      variant="body2"
                                                      color="text.secondary"
                                                    >
                                                      Add Tags:
                                                    </Typography>
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        gap: 1,
                                                        flexWrap: "wrap",
                                                        marginTop: 1,
                                                      }}
                                                    >
                                                      {automation.addTags.map(
                                                        (tag) => (
                                                          <Box
                                                            key={tag._id}
                                                            sx={{
                                                              backgroundColor:
                                                                tag.tagColour,
                                                              color: "#fff",
                                                              fontSize: "12px",
                                                              fontWeight: "600",
                                                              textAlign:
                                                                "center",
                                                              padding:
                                                                "3px 8px",
                                                              borderRadius:
                                                                "12px",
                                                              marginBottom:
                                                                "4px",
                                                            }}
                                                          >
                                                            {tag.tagName}
                                                          </Box>
                                                        )
                                                      )}
                                                    </Box>
                                                  </Box>
                                                )}

                                              
                                              {automation.removeTags &&
                                                automation.removeTags.length >
                                                  0 && (
                                                  <Box sx={{ marginTop: 2 }}>
                                                    <Typography
                                                      variant="body2"
                                                      color="text.secondary"
                                                    >
                                                      Remove Tags:
                                                    </Typography>
                                                    <Box
                                                      sx={{
                                                        display: "flex",
                                                        gap: 1,
                                                        flexWrap: "wrap",
                                                        marginTop: 1,
                                                      }}
                                                    >
                                                      {automation.removeTags.map(
                                                        (tag) => (
                                                          <Box
                                                            key={tag._id}
                                                            sx={{
                                                              backgroundColor:
                                                                tag.tagColour,
                                                              color: "#fff",
                                                              fontSize: "12px",
                                                              fontWeight: "600",
                                                              textAlign:
                                                                "center",
                                                              padding:
                                                                "3px 8px",
                                                              borderRadius:
                                                                "12px",
                                                              marginBottom:
                                                                "4px",
                                                            }}
                                                          >
                                                            {tag.tagName}
                                                          </Box>
                                                        )
                                                      )}
                                                    </Box>
                                                  </Box>
                                                )}
  {automation.addAssignees &&
                                                 automation.addAssignees.length >
                                                   0 && (
                                                   <Box sx={{ marginTop: 2 }}>
                                                     <Typography
                                                       variant="body2"
                                                       color="text.secondary"
                                                     >
                                                       Add Assignees:
                                                     </Typography>
                                                     <Box
                                                       sx={{
                                                         display: "flex",
                                                         gap: 1,
                                                         flexWrap: "wrap",
                                                         marginTop: 1,
                                                       }}
                                                     >
                                                       {automation.addAssignees.map(
                                                         (tag) => (
                                                           <Box
                                                             key={tag._id}
                                                             
                                                           >
                                                             {tag.username}
                                                           </Box>
                                                         )
                                                       )}
                                                     </Box>
                                                   </Box>
                                                 )}
 
 
                                               {/* Remove Tags Section */}
                                               {automation.removeAssignees &&
                                                 automation.removeAssignees.length >
                                                   0 && (
                                                   <Box sx={{ marginTop: 2 }}>
                                                     <Typography
                                                       variant="body2"
                                                       color="text.secondary"
                                                     >
                                                       Remove Assignees:
                                                     </Typography>
                                                     <Box
                                                       sx={{
                                                         display: "flex",
                                                         gap: 1,
                                                         flexWrap: "wrap",
                                                         marginTop: 1,
                                                       }}
                                                     >
                                                       {automation.removeAssignees.map(
                                                         (tag) => (
                                                           <Box
                                                             key={tag._id}
                                                             
                                                           >
                                                             {tag.username}
                                                           </Box>
                                                         )
                                                       )}
                                                     </Box>
                                                   </Box>
                                                 )}
                                              {automation.type === "Update client-facing job status" && (
              <Box>
                {automation.visibilityForClient === false ? (
                  <Typography>Don't show status</Typography>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <GoDotFill
                        style={{
                          color: automation.selectedClientStatus?.clientfacingColour,
                          fontSize: "20px",
                          marginTop: "5px",
                        }}
                      />
                      {automation.selectedClientStatus.label}
                    </Box>
                  </>
                )}
              </Box>
            )}
                                              {automation.tags &&
                                                automation.tags.length > 0 && (
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      gap: 1,
                                                      flexWrap: "wrap",
                                                      marginTop: 2,
                                                    }}
                                                  >
                                                    <Typography variant="body2">
                                                      Conditions:
                                                    </Typography>
                                                    {automation.tags.map(
                                                      (tag) => (
                                                        <Box
                                                          key={tag._id}
                                                          sx={{
                                                            backgroundColor:
                                                              tag.tagColour,
                                                            color: "#fff",
                                                            fontSize: "12px",
                                                            fontWeight: "600",
                                                            textAlign: "center",
                                                            padding: "3px 8px",
                                                            borderRadius:
                                                              "12px",
                                                            marginBottom: "4px",
                                                          }}
                                                        >
                                                          {tag.tagName}
                                                        </Box>
                                                      )
                                                    )}
                                                  </Box>
                                                )}
                                            </CardContent>
                                          </Card>
                                        )
                                      )}
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </Box>

                          {/* Plus Icon Between Stages */}
                          {index < stages.length - 1 && (
                            <IconButton
                              onClick={() => handleAddStage(index + 1)}
                            >
                              <LuPlusCircle
                                style={{
                                  color: "var(--color-save-btn",
                                  width: "25px",
                                  height: "25px",
                                }}
                              />
                            </IconButton>
                          )}
                        </React.Fragment>
                      ))}
                </Box>
                <Box mt={3} sx={{ flexShrink: 0 }}>
                  <Button
                    variant="contained"
                    startIcon={<LuPlusCircle />}
                    onClick={() => handleAddStage(stages.length)}
                    sx={{
                      backgroundColor: "var(--color-save-btn)", // Normal background

                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                      },
                      borderRadius: "15px",
                    }}
                  >
                    Add stage
                  </Button>
                </Box>
              </Box>
            </Box>

            <Box sx={{ pt: 2, display: "flex", alignItems: "center", gap: 5 }}>
              <Button
                onClick={updatePipe}
                variant="contained"
                sx={{
                  backgroundColor: "var(--color-save-btn)", // Normal background

                  "&:hover": {
                    backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                  },
                  borderRadius: "15px",
                }}
              >
                Save & exit
              </Button>
              <Button
                onClick={updateSavePipe}
                variant="contained"
                sx={{
                  backgroundColor: "var(--color-save-btn)", // Normal background

                  "&:hover": {
                    backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                  },
                  borderRadius: "15px",
                  width: "80px",
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={hanleCloseupdate}
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
    </Box>
  );
};

export default PipelineTempUpdate;
