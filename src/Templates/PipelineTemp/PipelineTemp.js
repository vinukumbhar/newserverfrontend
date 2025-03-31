import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Autocomplete,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  Alert,
  Drawer,
  Checkbox,
  Chip,
  Menu,
  MenuItem,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  FormControl,
  Select,
  OutlinedInput,
  InputLabel,
} from "@mui/material";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import Grid from "@mui/material/Unstable_Grid2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuPlusCircle, LuPenLine } from "react-icons/lu";
import { RxDragHandleDots2 } from "react-icons/rx";
import { toast } from "react-toastify";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import AddAutomationDrawer from "./AddAutomationDrawer";
import EditAutomationDrawer from "./EditAutomationDrawer";
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import DeleteIcon from "@mui/icons-material/Delete";
import TagAutomationComponent from "../TagAutomationComponent"
const PipelineTemp = () => {
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
  const USER_API = process.env.REACT_APP_USER_URL;
  const SORTJOBS_API = process.env.REACT_APP_SORTJOBS_URL;
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL;
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
  const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [showForm, setShowForm] = useState(false);
  const [pipelineName, setPipelineName] = useState("");
  const [isFormDirty, setIsFormDirty] = useState(false);
  const handleCreatePipeline = () => {
    setShowForm(true); // Show the form when button is clicked
  };

  // sort jobs
  const [sortbyjobs, setSortbyJobs] = useState([]);
  const [selectedSortByJob, setSelectedSortByJob] = useState("");

  const handleSortingByJobs = (selectedOptions) => {
    setSelectedSortByJob(selectedOptions);
    console.log(selectedOptions);
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

  // const handleAddStage = () => {
  // const newStage = {
  //   name: "",
  //   conditions: [],
  //   automations: [],
  //   autoMove: false,
  //   showDropdown: false,
  //   activeAction: null,
  // };
  //   setStages([...stages, newStage]);
  // };
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

  //Automation code
  const [anchorEl, setAnchorEl] = useState(null);

  // const handleClick = (event, index) => {
  //   setAnchorEl(event.currentTarget);
  //   SetStageSelected(index);  // Save the selected stage index
  //   console.log(index)
  // };
  const [ehitAnchorEl, setEditAnchorEl] = useState(null);
  const [isConditionsEditFormOpen, setIsConditionsEditFormOpen] =
    useState(false);
  const [addNewAutomation, setAddNewAutomation] = useState(null);
  const handleAddAutomationClick = (event) => {
    setAddNewAutomation(event.currentTarget);
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

  // const handleTagSelectionChange = (index, type, selectedValues) => {
  //   setSelectedAutomationData((prevData) =>
  //     prevData.map((automation, i) => {
  //       if (i !== index) return automation; // Keep other automations unchanged

  //       // Determine the correct options source
  //       const options = type === "addTags" ? tagsoptions : tagsoptions;

  //       // Convert selected values into full tag objects
  //       const selectedTags = options.filter((tag) => selectedValues.includes(tag.value));

  //       // Ensure previously selected tags remain while adding new ones
  //       const updatedTags = [...automation[type], ...selectedTags].reduce((acc, tag) => {
  //         if (!acc.find((t) => t._id === tag._id)) {
  //           acc.push(tag); // Avoid duplicates
  //         }
  //         return acc;
  //       }, []);

  //       return { ...automation, [type]: updatedTags };
  //     })
  //   );
  // };

  const handleTagSelectionChange = (index, field, selectedValues) => {
    setSelectedAutomationData((prevData) =>
      prevData.map((automation, i) =>
        i === index
          ? {
              ...automation,
              [field]: tagsoptions.filter((tag) =>
                selectedValues.includes(tag.value)
              ),
            }
          : automation
      )
    );
  };
  //  const handleTagChange = (index, type, event) => {
  //     const { value } = event.target; // Array of selected tag IDs

  //     setSelectedAutomationData((prev) => {
  //       const updatedAutomations = [...prev];

  //       // Get the correct tag options list
  //       const tagOptions = type === "addTags" ? filteredAddTagsOptions : filteredRemoveTagsOptions;

  //       // Map selected tag IDs to tag objects with _id, tagName, and tagColour
  //       const updatedTags = value.map((tagId) => {
  //         const tag = tagOptions.find((t) => t.value === tagId);
  //         return tag
  //           ? { _id: tag.value, tagName: tag.label, tagColour: tag.colour }
  //           : tagId; // Preserve unknown tag IDs
  //       });

  //       updatedAutomations[index] = {
  //         ...updatedAutomations[index],
  //         [type]: updatedTags,
  //       };

  //       console.log("Updated Automations:", updatedAutomations);
  //       return updatedAutomations;
  //     });
  //   };
  const handleTagChange = (index, type, event) => {
    const { value } = event.target; // Array of selected tag IDs

    setSelectedAutomationData((prev) => {
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
  const handleAddNewClose = () => {
    setAddNewAutomation(null);
  };

  const handleAutomationOptionClick = (actionType) => {
    SetAutomationSelect(actionType); // Perform the action based on the selected option
    handleAddNewClose(); // Close the dropdown
  };
  const handleEditTemplateChange = (index, newValue) => {
    const updatedData = [...selectedAutomationData];
    updatedData[index].template = newValue;
    setSelectedAutomationData(updatedData);
  };

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedAutomationData, setSelectedAutomationData] = useState([]);
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
  const handleClose = () => {
    setAnchorEl(null);
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

  // handleUpdateDrawer

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

  const [updateDrawer, setupdateDrawer] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [automationSelect, SetAutomationSelect] = useState();
  const [stageSelected, SetStageSelected] = useState();
  const handleDrawerOpen = (option, index) => {
    setIsDrawerOpen(true);
    SetAutomationSelect(option);
    SetStageSelected(index);
    console.log(index);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  const handleUpdateDrawer = () => {
    setupdateDrawer(true);
  };
  const handleUpdateDrawerClose = () => {
    setupdateDrawer(false);
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
  const [addChatTemplates, setAddChatTemplates] = useState([]);
  useEffect(() => {
    fetchEmailTemplates();
    fectInvoiceTemplates();
    fectProposalandElsTemp();
    fetchOrganizerTemplates();
    fetchTaskTemplates();
    fetchChatTemplates();
  }, []);
  const fetchChatTemplates = async () => {
    try {
      const url = `${CHAT_API}/Workflow/chats/chattemplate`;
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
  const handletemp = (selectedOptions,automationSelect) => {
    setselectedTemp(selectedOptions);
    console.log(selectedOptions)
    if (automationSelect === "Send message") {
      fetchTaskTempbyid(selectedOptions.value);
  }

  };
    
   
  
      //get id wise template Record
      const fetchTaskTempbyid = async (_id) => {
          try {
              const url = `${CHAT_API}/Workflow/chats/chattemplate/chattemplateList/${_id}`;
              const response = await fetch(url);
              if (!response.ok) {
                  throw new Error("Failed to fetch data");
              }
              const data = await response.json();
              console.log("chattemp", data)
             
  
              // setTempValues(data.taskTemplate);
              setReminderChecked(data.chatTemplate.sendreminderstoclient || false);
              setNoOfReminder(data.chatTemplate.numberofreminders || "1")
             setDaysuntilNextReminder(data.chatTemplate.daysuntilnextreminder || "3")
  
          } catch (error) {
              console.error("Error fetching data:", error);
          }
      };

  // condition tags
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [isConditionsFormOpen, setIsConditionsFormOpen] = useState(false);
  const [isAnyCheckboxChecked, setIsAnyCheckboxChecked] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedTags, setTempSelectedTags] = useState([]);

  const [stageAutomationTags, setStageAutomationTags] = useState([]);
  const handleAddConditions = () => {
    setIsConditionsFormOpen(!isConditionsFormOpen);
  };

  const handleGoBack = () => {
    setIsConditionsFormOpen(false);
  };

  // const handleCheckboxChange = (tag) => {
  //   const updatedSelectedTags = tempSelectedTags.includes(tag) ? tempSelectedTags.filter((t) => t._id !== tag._id) : [...tempSelectedTags, tag];
  //   setTempSelectedTags(updatedSelectedTags);
  //   setIsAnyCheckboxChecked(updatedSelectedTags.length > 0);
  // };

  const handleCheckboxChange = (tag) => {
    const updatedSelectedTags = tempSelectedTags.includes(tag)
      ? tempSelectedTags.filter((t) => t._id !== tag._id)
      : [...tempSelectedTags, tag];
    setTempSelectedTags(updatedSelectedTags);
    setIsAnyCheckboxChecked(updatedSelectedTags.length > 0);
  };
  // const handleAddTags = () => {
  //   setSelectedTags([...selectedTags, ...tempSelectedTags.filter((tag) => !selectedTags.some((t) => t._id === tag._id))]);
  //   setIsConditionsFormOpen(false);
  //   setTempSelectedTags([]);
  // };

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
      console.log("tags dtata", data.tags);
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

  const handleAddTagChange = (event) => {
    const selectedValues = event.target.value;
    setAddTags(selectedValues);

    // Send selectedValues array to your backend
    console.log("Selected Values:", selectedValues);
  };

  // handleEditAddTagsChange
  const handleEditAddTagsChange = (index, event) => {
    const selectedIds = event.target.value || [];

    setSelectedAutomationData((prevData) =>
      prevData.map((automation, i) =>
        i === index
          ? {
              ...automation,
              addTags: tagsoptions.filter((tag) =>
                selectedIds.includes(tag.value)
              ), // Store full objects
            }
          : automation
      )
    );

    console.log("Updated Add Tags:", selectedIds);
  };
  // handleEditRemoveTagsChange
  const handleEditRemoveTagsChange = (index, event) => {
    const selectedIds = event.target.value || [];

    setSelectedAutomationData((prevData) =>
      prevData.map((automation, i) =>
        i === index
          ? {
              ...automation,
              removeTags: tagsoptions.filter((tag) =>
                selectedIds.includes(tag.value)
              ), // Store full objects
            }
          : automation
      )
    );

    console.log("Updated Remove Tags:", selectedIds);
  };

  const handleRemoveTagChange = (event) => {
    const selectedValues = event.target.value;
    setRemoveTags(selectedValues);

    // Send selectedValues array to your backend
    console.log("Selected Values:", selectedValues);
  };
  // const handleRemoveTagChange = (event, newValue) => {
  //   setRemoveTags(newValue.map((option) => option.value));
  //   console.log(
  //     "Selected Remove Tags:",
  //     newValue.map((option) => option.value)
  //   );
  // };

  const filteredAddTagsOptions = tagsoptions.filter(
    (tag) => !removeTags.includes(tag.value)
  );

  const filteredRemoveTagsOptions = tagsoptions.filter(
    (tag) => !addTags.includes(tag.value)
  );
  const [selectedAddTags, setSelectedAddTags] = useState([]);
  const [reminderChecked, setReminderChecked] = useState(false);
    const [daysuntilNextReminder, setDaysuntilNextReminder] = useState('3');
    const [noOfReminder, setNoOfReminder] = useState(1);
    const handleReminderChange = (checked) => {
      setReminderChecked(checked);
    };
  const renderActionContent = (automationSelect, index) => {
    switch (automationSelect) {
      // Create Task
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
                 onChange={(event, newValue) => handletemp(newValue, automationSelect)}
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
                 onChange={(event, newValue) => handletemp(newValue, automationSelect)}
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
                  <Box display={"flex"} alignItems={"center"}>
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={reminderChecked}
                            onChange={(event) =>
                              handleReminderChange(event.target.checked)
                            }
                            // checked={sendreminderstoclient}
                            // onChange={(event)=>handleDateSwitchChange(event.target.checked)}
                            color="primary"
                          />
                        }
                      />
                    </Box>
                    <Typography variant="h6">Reminders </Typography>
                  </Box>
                </Box>

                 {reminderChecked && (
                                          <Box mb={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 2 }}>
                
                                              <Box>
                                                <InputLabel sx={{ color: 'black' }}>Days until next reminder</InputLabel>
                                                <TextField
                                                  // margin="normal"
                                                  fullWidth
                                                  name="Daysuntilnextreminder"
                                                  value={daysuntilNextReminder}
                                                  onChange={(e) => setDaysuntilNextReminder(e.target.value)}
                                                  placeholder="Days until next reminder"
                                                  size="small"
                                                  sx={{ mt: 2 }}
                                                />
                                              </Box>
                
                                              <Box>
                                                <InputLabel sx={{ color: 'black' }}>No Of reminders</InputLabel>
                                                <TextField
                
                                                  fullWidth
                                                  name="No Of reminders"
                                                  value={noOfReminder}
                                                  onChange={(e) => setNoOfReminder(e.target.value)}
                
                                                  placeholder="NoOfreminders"
                                                  size="small"
                                                  sx={{ mt: 2 }}
                                                />
                                              </Box>
                
                                            </Box>
                                          </Box>
                                        )}
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
                 onChange={(event, newValue) => handletemp(newValue, automationSelect)}
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
                 onChange={(event, newValue) => handletemp(newValue, automationSelect)}
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
                 onChange={(event, newValue) => handletemp(newValue, automationSelect)}
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
                 onChange={(event, newValue) => handletemp(newValue, automationSelect)}
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
      //  Update account tags
      case "Update account tags":
        return (
          <>
            {/* <Grid item>
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

                <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
                
                  <Box mt={2} width={"50%"}>
                    <Typography gutterBottom variant="body2">
                      Add Tags
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

                  <Box mt={2} width={"50%"}>
                    <Typography gutterBottom variant="body2">
                      Remove Tags
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
            </Grid> */}

<TagAutomationComponent
        automationSelect="Priority Tagging"
        // onSaveAutomation={handleSaveAutomation}
        tagsoptions={tagsoptions}
        initialAddTags={addTags}
        initialRemoveTags={removeTags}
        initialSelectedTags={selectedTags}
      />
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
                 onChange={(event, newValue) => handletemp(newValue, automationSelect)}
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
  //     const selectedAutomation = {
  //       type: automationSelect, // The type of automation (e.g., "Send Email")
  //       template: selectedtemp
  //         ? { label: selectedtemp.label, value: selectedtemp.value }
  //         : null, // Store label and value of selected template
  //       tags: selectedTags.map((tag) => ({
  //         // Map selectedTags to include necessary tag data
  //         _id: tag._id,
  //         tagName: tag.tagName,
  //         tagColour: tag.tagColour,
  //       })),
  //     };
  //     updatedStages[index].automations.push(selectedAutomation);
  //     setStages(updatedStages);
  //     console.log("Automation saved for stage:", index, selectedAutomation);
  //     setselectedTemp(null); // Clear the selected template after saving
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
  //     // if (!updatedStages[stageSelected].automations) {
  //     //   updatedStages[stageSelected].automations = [];
  //     // }

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
      // setselectedTemp(null);
      setSelectedTags([]);
      setAddTags([]);
      setRemoveTags([]);
      setIsAnyCheckboxChecked(false);
      handleDrawerClose();
    };
  };
  const [selectedAutomationIndex, setSelectedAutomationIndex] = useState(null);

  //   const handleEditAddTags = () => {
  //     console.log("automation index", selectedAutomationIndex);
  //     const updatedTags = [
  //       ...selectedAutomationData[selectedAutomationIndex].tags, // Only update tags for the selected automation
  //       ...tempSelectedTags.filter(
  //         (newTag) =>
  //           !selectedAutomationData[selectedAutomationIndex].tags.some(
  //             (existingTag) => existingTag._id === newTag._id
  //           )
  //       ),
  //     ];
  // console.log("new selcted atgs",tempSelectedTags)
  //     console.log("Updated Tags for Selected Automation:", updatedTags);

  //     // Update the tags for the selected automation only
  //     setSelectedAutomationData((prevData) =>
  //       prevData.map((automation, idx) => {
  //         if (idx === selectedAutomationIndex) {
  //           return {
  //             ...automation,
  //             tags: updatedTags, // Add updated tags to the selected automation
  //           };
  //         }
  //         return automation;
  //       })
  //     );

  //     setTempSelectedTags([]); // Clear the temporary selected tags
  //     setIsConditionsEditFormOpen(false); // Close the drawer
  //   };

  //handle automation save edit

  // const handleEditSaveAutomation = (defaultValueInvoice, index) => {
  //   console.log("edit working ", defaultValueInvoice);
  //   return () => {
  //     const updatedStages = [...stages];
  //     const selectedAutomation = {
  //       type: automationSelect, // The type of automation (e.g., "Send Email")
  //       template: defaultValueInvoice
  //         ? {
  //             label: defaultValueInvoice.label,
  //             value: defaultValueInvoice.value,
  //           }
  //         : null, // Store label and value of selected template
  //       tags: selectedTags.map((tag) => ({
  //         // Map selectedTags to include necessary tag data
  //         _id: tag._id,
  //         tagName: tag.tagName,
  //         tagColour: tag.tagColour,
  //       })),
  //     };
  //     updatedStages[index].automations.push(selectedAutomation);
  //     setStages(updatedStages);
  //     console.log(
  //       "Automation edit saved for stage:",
  //       index,
  //       selectedAutomation
  //     );
  //     setselectedTemp(null); // Clear the selected template after saving
  //     setSelectedTags([]);
  //     setIsAnyCheckboxChecked(false);
  //     handleDrawerClose();
  //   };
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

  //   const handleEditSaveAutomation = () => {
  //     if (editingStageIndex === null) return; // Ensure the stage index is valid

  //     console.log("Save automation for stage:", editingStageIndex);

  //     // Update the automations for the selected stage
  //     const updatedStages = [...stages];
  //     updatedStages[editingStageIndex].automations = selectedAutomationData;
  // console.log("automationdata",selectedAutomationData)
  //     // Update the stages state
  //     setStages(updatedStages);
  // console.log(updatedStages)
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
          addTags: automation.addTags
            .map((tag) => {
              if (typeof tag === "string") {
                const foundTag = tags.find((t) => t._id === tag);
                return foundTag
                  ? {
                      _id: foundTag._id,
                      tagName: foundTag.tagName,
                      tagColour: foundTag.tagColour,
                    }
                  : null;
              }
              return tag; // Keep existing tag objects
            })
            .filter(Boolean), // Remove any null values

          removeTags: automation.removeTags
            .map((tag) => {
              if (typeof tag === "string") {
                const foundTag = tags.find((t) => t._id === tag);
                return foundTag
                  ? {
                      _id: foundTag._id,
                      tagName: foundTag.tagName,
                      tagColour: foundTag.tagColour,
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

  const handleStageNameChange = (e, index) => {
    const newStages = [...stages]; // Create a copy of the stages array
    newStages[index].name = e.target.value; // Update the name of the specific stage
    setStages(newStages); // Update the state with the modified stages array

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
  const [selectedJobtemp, setselectedJobTemp] = useState();
  const handleJobtemp = (selectedOptions) => {
    setselectedJobTemp(selectedOptions);
    console.log(selectedOptions);
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

  const createPipe = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    console.log(stages);

    const data = {
      pipelineName: pipelineName,
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
      startdate: startDate,
      stages: stages,
    };
    console.log(data);
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${PIPELINE_API}/workflow/pipeline/createpipeline`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        // Display success toast
        fetchPipelineData();
        toast.success("Pipeline created successfully");
        setShowForm(false);
        clearForm();
        // Additional success handling here
      })
      .catch((error) => {
        console.log(error);
        // Display error toast
        toast.error("Failed to create pipeline");
        // Additional error handling here
      });
  };
  const createSavePipe = () => {
    if (!validateForm()) {
      return; // Prevent form submission if validation fails
    }
    const data = {
      pipelineName: pipelineName,
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
      startdate: startDate,
      stages: stages,
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${PIPELINE_API}/workflow/pipeline/createpipeline`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        // Display success toast
        fetchPipelineData();
        toast.success("Pipeline created successfully");

        // Additional success handling here
      })
      .catch((error) => {
        console.log(error);
        // Display error toast
        toast.error("Failed to create pipeline");
        // Additional error handling here
      });
  };
  const clearForm = () => {
    setPipelineName("");
    setSelectedUser([]);
    setCombinedValues([]);
    setSelectedSortByJob("");
    setselectedJobTemp(null);

    setAccount_id(false);
    setDays_on_stage(false);
    setAccount_tags(false);
    setStartDate(false);
    setName(false);
    setDue_date(false);
    setPriority(false);
    setDescription(false);
    setAssignees(false);

    setStages([]);
  };

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
  const handleEdit = (_id) => {
    // Implement logic for editing here
    // console.log("Edit action triggered for template id: ", templateId);
    // navigate("PipelineTemplateUpdate/" + _id);
    navigate("/PipelineTemplateUpdate/" + _id);
  };

  //delete template
  const handleDelete = async (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this pipeline?"
    );

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${PIPELINE_API}/workflow/pipeline/pipeline/${_id}`,
        headers: {},
      };

      try {
        const response = await axios.request(config);
        console.log("Delete response:", response.data);
        toast.success("Pipeline deleted successfully");
        fetchPipelineData();
        // Optionally, you can refresh the data or update the state to reflect the deletion
      } catch (error) {
        console.error("Error deleting pipeline:", error);
      }
    }
  };

  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };
  // console.log(tempIdget)
  const columns = useMemo(
    () => [
      {
        accessorKey: "pipelineName",
        header: "Name",
        Cell: ({ row }) => (
          <Typography
            sx={{ color: "#2c59fa", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => handleEdit(row.original._id)}
          >
            {row.original.pipelineName}
          </Typography>
        ),
      },
      {
        accessorKey: "Setting",
        header: "Setting",
        Cell: ({ row }) => (
          <IconButton
            onClick={() => toggleMenu(row.original._id)}
            style={{ color: "#2c59fa" }}
          >
            <CiMenuKebab style={{ fontSize: "25px" }} />
            {openMenuId === row.original._id && (
              <Box
                sx={{
                  position: "absolute",
                  zIndex: 1,
                  backgroundColor: "#fff",
                  boxShadow: 1,
                  borderRadius: 1,
                  p: 1,
                  left: "30px",
                  m: 2,
                }}
              >
                <Typography
                  sx={{ fontSize: "12px", fontWeight: "bold" }}
                  onClick={() => {
                    handleEdit(row.original._id);
                  }}
                >
                  Edit
                </Typography>
                <Typography
                  sx={{ fontSize: "12px", color: "red", fontWeight: "bold" }}
                  onClick={() => handleDelete(row.original._id)}
                >
                  Delete
                </Typography>
              </Box>
            )}
          </IconButton>
        ),
      },
    ],
    [openMenuId]
  );

  const table = useMaterialReactTable({
    columns,
    data: pipelineData,
    enableBottomToolbar: true,
    enableStickyHeader: true,
    columnFilterDisplayMode: "custom", // Render own filtering UI
    enableRowSelection: true, // Enable row selection
    enablePagination: true,
    muiTableContainerProps: { sx: { maxHeight: "400px" } },
    initialState: {
      columnPinning: {
        left: ["mrt-row-select", "tagName"],
        right: ["settings"],
      },
    },
    muiTableBodyCellProps: {
      sx: (theme) => ({
        backgroundColor:
          theme.palette.mode === "dark-theme"
            ? theme.palette.grey[900]
            : theme.palette.grey[50],
      }),
    },
  });
  const handleClosePipelineTemp = () => {
    if (isFormDirty) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (!confirmClose) {
        return;
      }
    }
    setShowForm(false);
  };

  // Detect form changes
  useEffect(() => {
    if (pipelineName || Assignees || selectedJobtemp || selectedSortByJob) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [pipelineName, Assignees, selectedJobtemp, selectedSortByJob]);

  const [pipelineNameError, setPipelineNameError] = useState("");
  const [sortByJobError, setSortByJobError] = useState("");
  const [templateError, setTemplateError] = useState("");
  const [userError, setUserError] = useState("");
  const [stageNameErrors, setStageNameErrors] = useState([]);

  const validateForm = () => {
    let isValid = true;
    if (!pipelineName) {
      setPipelineNameError("Pipeline name is required");

      isValid = false;
    } else {
      setPipelineNameError("");
    }
    if (!selectedSortByJob) {
      setSortByJobError("Sort By Job is required.");
      isValid = false;
    } else {
      setSortByJobError("");
    }

    if (!selectedJobtemp) {
      setTemplateError("Job Template is required.");
      isValid = false;
    } else {
      setTemplateError("");
    }

    if (selectedUser.length === 0) {
      setUserError("At least one user must be selected.");
      isValid = false;
    } else {
      setUserError("");
    }
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
  const [searchQuery, setSearchQuery] = useState("");
  // Filter pipelineData based on searchQuery
  const filteredPipelines = pipelineData.filter((row) =>
    row.pipelineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30); // Default rows per page

  // Pagination: Slice the filtered data
  const paginatedPipelines = filteredPipelines.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <Box>
      {!showForm ? (
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreatePipeline}
              sx={{
                backgroundColor: "var(--color-save-btn)", // Normal background

                "&:hover": {
                  backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                },
                borderRadius: "15px",
                mb: 3,
              }}
            >
              Create Pipeline
            </Button>
            <TextField
              placeholder="Search Pipeline"
              // variant="outlined"
              size="small"
              // fullWidth
              sx={{ marginBottom: 2, width: "300px" }}
              value={searchQuery}
              onChange={handleSearch}
            />
          </Box>
          {/* <MaterialReactTable columns={columns} table={table} /> */}

          <TableContainer component={Paper} sx={{ overflow: "visible" }}>
            <Table sx={{ width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="250"
                  >
                    Pipeline Name
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
                {paginatedPipelines.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <Typography
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                          cursor: "pointer",
                          color: "#3f51b5",
                        }}
                        onClick={() => handleEdit(row._id)}
                      >
                        {row.pipelineName}
                      </Typography>
                    </TableCell>

                    <TableCell
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                        cursor: "pointer",
                      }}
                    >
                      <IconButton
                        onClick={() => toggleMenu(row._id)}
                        style={{ color: "#2c59fa" }}
                      >
                        <CiMenuKebab />
                        {openMenuId === row._id && (
                          <Box
                            sx={{
                              position: "absolute",
                              zIndex: 1,
                              backgroundColor: "#fff",
                              boxShadow: 1,
                              borderRadius: 1,
                              p: 1,
                              left: "20px",

                              m: 2,
                              top: "10px",
                              textAlign: "start",
                            }}
                          >
                            {/* <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>Publice to Marketplace</Typography> */}

                            <Typography
                              sx={{ fontSize: "12px", fontWeight: "bold" }}
                              onClick={() => handleEdit(row._id)}
                            >
                              Edit 
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "12px",
                                color: "red",
                                fontWeight: "bold",
                              }}
                              onClick={() => handleDelete(row._id)}
                            >
                              Delete
                            </Typography>
                          </Box>
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredPipelines.length} // Total count after filtering
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[30, 40, 50, 60, 100]} // Rows per page options
          />
        </Box>
      ) : (
        <Box
          sx={{
            mt: 2,
          }}
        >
          <Box>
            <form>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {" "}
                  Create Pipelines
                </Typography>
                <Box mt={2} mb={2}>
                  <hr />
                </Box>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={5.8}>
                    <Box>
                      {/* <InputLabel className="pipeline-lable">Pipeline Name</InputLabel> */}
                      <label className="pipeline-lable">Pipeline Name</label>
                      <TextField
                        fullWidth
                        value={pipelineName}
                        onChange={(e) => setPipelineName(e.target.value)}
                        error={!!pipelineNameError}
                        // helperText={pipelineNameError}
                        sx={{ mt: 1.5, backgroundColor: "#fff" }}
                        size="small"
                        placeholder="Pipeline Name"
                      />
                      {!!pipelineNameError && (
                        <Alert
                          sx={{
                            width: "96%",
                            p: "0", // Adjust padding to control the size
                            pl: "4%",
                            height: "23px",
                            borderRadius: "10px",
                            borderTopLeftRadius: "0",
                            borderTopRightRadius: "0",
                            fontSize: "15px",
                            display: "flex",
                            alignItems: "center", // Center content vertically
                            "& .MuiAlert-icon": {
                              fontSize: "16px", // Adjust the size of the icon
                              mr: "8px", // Add margin to the right of the icon
                            },
                          }}
                          variant="filled"
                          severity="error"
                        >
                          {pipelineNameError}
                        </Alert>
                      )}
                    </Box>
                    <Box mt={1}>
                      <label className="pipeline-lable">Available To</label>
                      <Autocomplete
                        multiple
                        sx={{ marginTop: "8px", backgroundColor: "#fff" }}
                        options={options}
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
                          <>
                            <TextField
                              {...params}
                              variant="outlined"
                              error={!!userError}
                              placeholder="Available To"
                            />
                            {!!userError && (
                              <Alert
                                sx={{
                                  width: "96%",
                                  p: "0", // Adjust padding to control the size
                                  pl: "4%",
                                  height: "23px",
                                  borderRadius: "10px",
                                  borderTopLeftRadius: "0",
                                  borderTopRightRadius: "0",
                                  fontSize: "15px",
                                  display: "flex",
                                  alignItems: "center", // Center content vertically
                                  "& .MuiAlert-icon": {
                                    fontSize: "16px", // Adjust the size of the icon
                                    mr: "8px", // Add margin to the right of the icon
                                  },
                                }}
                                variant="filled"
                                severity="error"
                              >
                                {userError}
                              </Alert>
                            )}
                          </>
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                      />
                    </Box>
                    <Box mt={2}>
                      {/* <InputLabel sx={{ color: 'black' }}>Sort jobs by</InputLabel> */}
                      <label className="pipeline-lable">Sort jobs by</label>
                      <Autocomplete
                        className="select-dropdown"
                        options={optionsort} // The array of options
                        value={selectedSortByJob} // The currently selected value
                        onChange={(event, newValue) =>
                          handleSortingByJobs(newValue)
                        } // Handle selection change
                        getOptionLabel={(option) => option.label || ""} // Display label for each option
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
                              placeholder="Sort By Job"
                              size="small"
                              error={!!sortByJobError}
                              // helperText={sortByJobError}
                              sx={{
                                width: "100%",
                                marginTop: "8px",
                                backgroundColor: "#fff",
                              }}
                              variant="outlined"
                              InputLabelProps={{ shrink: true }}
                            />
                            {!!sortByJobError && (
                              <Alert
                                sx={{
                                  width: "96%",
                                  p: "0", // Adjust padding to control the size
                                  pl: "4%",
                                  height: "23px",
                                  borderRadius: "10px",
                                  borderTopLeftRadius: "0",
                                  borderTopRightRadius: "0",
                                  fontSize: "15px",
                                  display: "flex",
                                  alignItems: "center", // Center content vertically
                                  "& .MuiAlert-icon": {
                                    fontSize: "16px", // Adjust the size of the icon
                                    mr: "8px", // Add margin to the right of the icon
                                  },
                                }}
                                variant="filled"
                                severity="error"
                              >
                                {sortByJobError}
                              </Alert>
                            )}
                          </>
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        } // To handle equality
                        disableClearable={false} // Enable clearing selection
                        clearOnEscape // Clear selection when escape is pressed
                      />
                    </Box>
                    <Box mt={2}>
                      {/* <InputLabel sx={{ color: 'black' }}>Default job template</InputLabel> */}
                      <label className="pipeline-lable">
                        Default job template
                      </label>
                      <Autocomplete
                        options={optiontemp}
                        getOptionLabel={(option) => option.label}
                        value={selectedJobtemp}
                        onChange={(event, newValue) => handleJobtemp(newValue)}
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
                              error={!!templateError}
                              // helperText={templateError}
                              sx={{ backgroundColor: "#fff" }}
                              placeholder="Default job template"
                              variant="outlined"
                              size="small"
                            />
                            {!!templateError && (
                              <Alert
                                sx={{
                                  width: "96%",
                                  p: "0", // Adjust padding to control the size
                                  pl: "4%",
                                  height: "23px",
                                  borderRadius: "10px",
                                  borderTopLeftRadius: "0",
                                  borderTopRightRadius: "0",
                                  fontSize: "15px",
                                  display: "flex",
                                  alignItems: "center", // Center content vertically
                                  "& .MuiAlert-icon": {
                                    fontSize: "16px", // Adjust the size of the icon
                                    mr: "8px", // Add margin to the right of the icon
                                  },
                                }}
                                variant="filled"
                                severity="error"
                              >
                                {templateError}
                              </Alert>
                            )}
                          </>
                        )}
                        sx={{ width: "100%", marginTop: "8px" }}
                        clearOnEscape // Enable clearable functionality
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
                              label={"Days on stage"}
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
                        whiteSpace: "nowrap",
                        paddingBottom: "8px",
                        maxWidth: "100%",
                        alignItems: "flex-start",
                        minHeight: "300px",
                        maxHeight: "500px",
                      }}
                      className="stage-scroll"
                    >
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
                                  setSelectedAddTags={setSelectedAddTags}
                                  selectedAddTags={selectedAddTags}
                                  isEditDrawerOpen={isEditDrawerOpen}
                                  setIsEditDrawerOpen={setIsEditDrawerOpen}
                                  selectedAutomationData={
                                    selectedAutomationData
                                  }
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
                                  taskTemplateOptions={taskTemplateOptions}
                                  chatTemplateOptions={chatTemplateOptions}
                                  handleTagChange={handleTagChange}
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

                                              {/* Remove Tags Section */}
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

                <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Button
                    variant="contained"
                    onClick={createPipe}
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
                    variant="contained"
                    color="primary"
                    onClick={createSavePipe}
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
                    onClick={handleClosePipelineTemp}
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
      )}
    </Box>
  );
};

export default PipelineTemp;
