import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Typography,
  Container,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  InputLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Autocomplete,
} from "@mui/material";
import EditorShortcodes from "../Texteditor/EditorShortcodes";
import Select from "react-select";
import Grid from "@mui/material/Unstable_Grid2";
import DeleteIcon from "@mui/icons-material/Delete"; // For delete icon
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"; // For file icon

const EmailTempUpdate = () => {
  const EMAIL_API = process.env.REACT_APP_EMAIL_TEMP_URL;
  const USER_API = process.env.REACT_APP_USER_URL;
  const { _id } = useParams();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [anchorEl, setAnchorEl] = useState(null);
  const [emailBody, setEmailBody] = useState("");
  const [userData, setUserData] = useState([]);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };
  const [cursorPosition, setCursorPosition] = useState(0);
  const handlesubject = (e) => {
    const { value, selectionStart } = e.target;
    setInputText(value);
    setCursorPosition(selectionStart);
  };
  const textFieldRef = useRef(null);
  const handleAddShortcut = (shortcut) => {
    setInputText((prevText) => {
      const newText =
        prevText.slice(0, cursorPosition) +
        `[${shortcut}]` +
        prevText.slice(cursorPosition);
      return newText;
    });

    setTimeout(() => {
      if (textFieldRef.current) {
        textFieldRef.current.focus();
        textFieldRef.current.setSelectionRange(
          cursorPosition + shortcut.length + 2,
          cursorPosition + shortcut.length + 2
        );
      }
    }, 0);

    setShowDropdown(false);
  };

  useEffect(() => {
    setFilteredShortcuts(
      shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes(""))
    );
  }, [shortcuts]);

  useEffect(() => {
    if (selectedOption === "contacts") {
      const contactShortcuts = [
        // Array of contact shortcuts
      ];
      setShortcuts(contactShortcuts);
    } else if (selectedOption === "account") {
      const accountShortcuts = [
        // Array of account shortcuts
      ];
      setShortcuts(accountShortcuts);
    }
  }, [selectedOption]);

  const handlechatsubject = (e) => {
    const { value } = e.target;
    setInputText(value);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setShowDropdown(false);
  };
  const [selecteduser, setSelectedUser] = useState("");
  const handleuserChange = (event, selectedOptions) => {
    setSelectedUser(selectedOptions);
  };
  useEffect(() => {
    fetchData();
    fetchEmailTemplates();
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

  const handleEditorChange = (content) => {
    setEmailBody(content);
  };

  const [emailTemplates, setEmailTemplates] = useState([]);
  const fetchEmailTemplates = async () => {
    try {
      const url = `${EMAIL_API}/workflow/emailtemplate`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch email templates");
      }
      const data = await response.json();

      setEmailTemplates(data.emailTemplate);
    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };

  const SendData = async (e) => {
    // Create a FormData object
    const formData = new FormData();

    // Append form fields to FormData
    formData.append("templatename", templateName);
    formData.append("from", selecteduser.value);
    formData.append("emailsubject", inputText);
    formData.append("emailbody", emailBody);

    // Append files to FormData
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("attachments", file); // Use "attachments" as the field name
      });
    }

    const requestOptions = {
      method: "PATCH",
      body: formData,
      redirect: "follow",
    };
    console.log("bhvfdg", formData);

    const url = `${EMAIL_API}/workflow/emailtemplate/${_id}`;

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log("Data update result:", result);
        toast.success("Template updated successfully!"); // Success message
        // navigate("/firmtemp/templates/emails");
        fetchEmailTemplates(); // Reload templates
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        toast.error("Error updating template."); // Error message
      });
  };

  const saveTemp = () => {
    const formData = new FormData();
    formData.append("templatename", templateName);
    // formData.append("from", selecteduser.value);
    formData.append("from", selecteduser ? selecteduser.value : "");
    formData.append("emailsubject", inputText);
    formData.append("emailbody", emailBody);

    // Append each selected file to formData
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    // Logging FormData contents for debugging
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: ${value.name} (size: ${value.size} bytes)`); // Logging file name and size
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    const requestOptions = {
      method: "PATCH",
      body: formData,
      redirect: "follow",
    };

    const url = `${EMAIL_API}/workflow/emailtemplate/${_id}`;
    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((result) => {
        console.log("Data update result:", result);
        toast.success("Template updated successfully!"); // Success message
        // navigate("/firmtemp/templates/emails")
        // fetchEmailTemplates();
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        toast.error("Error updating template."); // Error message
      });
  };
  useEffect(() => {
    const fetchEmailData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };
        const url = `${EMAIL_API}/workflow/emailtemplate/emailtemplateList/`;
        const response = await fetch(url + _id, requestOptions);

        const result = await response.json();
        setTempValues(result.emailTemplate);
        tempallvalue(result.emailTemplate);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmailData();
  }, []);
const [mode, setMode]= useState("")
  const tempallvalue = (data) => {
    console.log(data);
    setTemplateName(data.templatename);
    setInputText(data.emailsubject);
    setSelectedUser(
      data.from ? { value: data.from._id, label: data.from.username } : null
    );
    setEmailBody(data.emailbody);
    setSelectedOption(data.mode)
    const transformedFiles = data.attachments.map((attachment) => ({
      name: attachment.filename, // Use 'name' instead of 'filename'
      size: attachment.size, // Keep 'size' as is
      id: attachment._id, // Optionally include the ID for reference
    }));
    setFiles(transformedFiles);
  };

  // get id wise template Record
  const [tempvalues, setTempValues] = useState();
  // State to store emailTemplate data
  const [fromtempdata, setFromdataTemp] = useState();

  const handleSaveExitTemplate = () => {
    SendData();
    navigate("/firmtemp/templates/emails");
  };
  // const handleTempCancle = () => {
  //     navigate("/firmtemp/templates/emails")

  // }
  //shortcodes
  useEffect(() => {
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

  const [isFormFilled, setIsFormFilled] = useState(false);
  const handleTempCancle = () => {
    if (isFormFilled) {
      const confirmCancel = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      );
      if (confirmCancel) {
        navigate("/firmtemp/templates/emails");
      }
    } else {
      navigate("/firmtemp/templates/emails");
    }
  };

  useEffect(() => {
    // Check if form is filled
    const checkIfFormFilled = () => {
      if (templateName || inputText || emailBody || fromtempdata) {
        setIsFormFilled(true);
      } else {
        setIsFormFilled(false);
      }
    };

    checkIfFormFilled();
  }, [templateName, inputText, emailBody, fromtempdata]);

  //*********************** */

  const [selectedFiles, setSelectedFiles] = useState([]);

  // // Handle file drop
  // const onDrop = useCallback((acceptedFiles) => {
  //     setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  // }, []);

  // const { getRootProps, getInputProps } = useDropzone({
  //     onDrop,
  // });
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      handleFileChange(acceptedFiles); // Pass the array of files to handleFileChange
    },
    accept:
      "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/jpeg,image/png",
    multiple: true,
  });
  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleButtonClick = (event) => {
    event.stopPropagation(); // Prevent click event from bubbling up
    document.getElementById("file-input").click(); // Trigger click on the hidden file input
  };

  const [files, setFiles] = useState([]);

  // const handleFileChange = (acceptedFiles) => {
  //   setFiles(acceptedFiles); // Store selected files in state
  // };

  const handleFileChange = (acceptedFiles) => {
    console.log("acceptedFiles:", acceptedFiles); // Debugging: Check what is being passed
    if (!acceptedFiles || !Array.isArray(acceptedFiles)) {
      console.error("acceptedFiles is not an array:", acceptedFiles);
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };

  return (
    <Box p={2}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Edit Email Template
        </Typography>

        <Grid container spacing={2}>
          <Grid xs={12} sm={5.8}>
            <Box sx={{ mt: 2 }}>
              <form>
                <Box>
                  <InputLabel sx={{ color: "black" }}>Template Name</InputLabel>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="templateName"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Template Name"
                    size="small"
                  />
                </Box>
                <Box>
                  <InputLabel sx={{ color: "black" }}>Mode</InputLabel>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={selectedOption}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="contacts"
                        control={<Radio />}
                        label="Contact Shortcodes"
                      />
                      <FormControlLabel
                        value="account"
                        control={<Radio />}
                        label="Account Shortcodes"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
                <Box mt={2}>
                  <InputLabel sx={{ color: "black" }}>From</InputLabel>
                  {/* <Select className='job-template-select-dropdown'
                                        placeholder="from"
                                        options={options}
                                        isMulti={false}// Enable multi-select
                                        isSearchable // Enable search
                                        value={fromtempdata}
                                        isClearable
                                        onChange={handleuserChange}
                                        styles={{marginTop:'5px'}}
                                    /> */}
                  <Autocomplete
                    options={options}
                    sx={{ mt: 2, mb: 2, backgroundColor: "#fff" }}
                    size="small"
                    value={selecteduser}
                    onChange={handleuserChange}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    getOptionLabel={(option) => option.label || ""}
                    renderInput={(params) => (
                      <>
                        <TextField {...params} placeholder="Form" />
                      </>
                    )}
                    isClearable={true}
                  />
                </Box>
                <Box mt={2}>
                  <InputLabel sx={{ color: "black" }}>Subject</InputLabel>
                  <TextField
                    margin="normal"
                    fullWidth
                    name="subject"
                    onChange={handlesubject}
                    inputRef={textFieldRef}
                    value={inputText}
                    onClick={(e) => setCursorPosition(e.target.selectionStart)}
                    placeholder="Subject"
                    size="small"
                  />
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={toggleDropdown}
                    // sx={{ mt: 2 }}
                    sx={{
                      backgroundColor: "var(--color-save-btn)", // Normal background

                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                      },
                      borderRadius: "15px",
                      mt: 2,
                    }}
                  >
                    Add Shortcode
                  </Button>
                  <Popover
                    open={showDropdown}
                    anchorEl={anchorEl}
                    onClose={handleCloseDropdown}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <Box>
                      <List
                        className="dropdown-list"
                        sx={{
                          width: "300px",
                          height: "300px",
                          cursor: "pointer",
                        }}
                      >
                        {filteredShortcuts.map((shortcut, index) => (
                          <ListItem
                            key={index}
                            onClick={() => handleAddShortcut(shortcut.value)}
                          >
                            <ListItemText
                              primary={shortcut.title}
                              primaryTypographyProps={{
                                style: {
                                  fontWeight: shortcut.isBold
                                    ? "bold"
                                    : "normal",
                                },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Popover>
                </Box>
                <Box sx={{ mt: 5 }}>
                  <EditorShortcodes
                    onChange={handleEditorChange}
                    initialContent={emailBody}
                  />
                </Box>
                <Box sx={{ mt: 5, display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveExitTemplate}
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
                    onClick={saveTemp}
                    variant="contained"
                    color="primary"
                    sx={{
                      backgroundColor: "var(--color-save-btn)", // Normal background

                      "&:hover": {
                        backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                      },
                      borderRadius: "15px",
                      width: "80px",
                    }}
                  >
                    {" "}
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleTempCancle}
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
              </form>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            sm={0.4}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <Box
              className="vertical-line"
              sx={{
                // borderLeft: '1px solid black',
                height: "100%",
                ml: 1.5,
              }}
            ></Box>
          </Grid>

          <Grid xs={12} sm={5.8}>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              {/* Upload Zone */}

              <Box
                {...getRootProps()} // Spread dropzone props here
                sx={{
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                  flexDirection: "column",
                  border: "2px dashed #ccc",
                  padding: "20px",
                  width: "100%",
                  maxWidth: "500px",
                  textAlign: "center",
                  cursor: "pointer",
                  marginBottom: "16px",
                }}
              >
                <input
                  id="file-input"
                  {...getInputProps()} // Spread input props here
                  style={{ display: "none" }} // Hide the default file input
                  multiple // Enable multiple file selection
                />
                <Typography variant="h6">Drag & drop file here</Typography>
                <Typography variant="body2">or</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    backgroundColor: "var(--color-save-btn)",
                    "&:hover": {
                      backgroundColor: "var(--color-save-hover-btn)",
                    },
                    borderRadius: "15px",
                  }}
                >
                  Browse Files
                </Button>
                <Typography variant="body2" sx={{ marginTop: "8px" }}>
                  20 MB file size limit. Supported file types: PDF, DOC, DOCX,
                  XLS, XLSX, JPG, PNG.
                </Typography>
              </Box>

              {files.length > 0 && (
                <Box sx={{ width: "100%", marginTop: "16px" }}>
                  <Typography variant="h6" sx={{ marginBottom: "8px" }}>
                    Selected Files:
                  </Typography>
                  {files.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <Typography variant="body1">
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </Typography>
                      {/* <IconButton
                                            onClick={() => {
                                              const updatedFiles = files.filter((_, i) => i !== index);
                                              setFiles(updatedFiles); // Remove the file from the list
                                            }}
                                            sx={{ color: "red" }}
                                          >
                                            <DeleteIcon />
                                          </IconButton> */}
                      <IconButton
                        onClick={async () => {
                          const fileToDelete = files[index];
                          console.log("filename", fileToDelete);
                          // If the file has no `id`, it's a newly selected file (not saved yet)
                          if (!fileToDelete.id) {
                            const updatedFiles = files.filter(
                              (_, i) => i !== index
                            );
                            setFiles(updatedFiles);
                            return;
                          }

                          try {
                            const response = await fetch(
                              `${EMAIL_API}/workflow/deleteattachments/${_id}/${fileToDelete.name}`,
                              { method: "DELETE" }
                            );

                            if (!response.ok) {
                              throw new Error(
                                "Failed to delete file from server"
                              );
                            }

                            // Remove from local state after successful deletion
                            const updatedFiles = files.filter(
                              (_, i) => i !== index
                            );
                            setFiles(updatedFiles);
                          } catch (error) {
                            console.error("Error deleting file:", error);
                          }
                        }}
                        sx={{ color: "red" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EmailTempUpdate;
