import {
  Drawer,
  Box,
  Typography,
  Divider,
  Button,
  InputLabel,
  TextField,
  Autocomplete,
  ListItem,
  List,
  Popover,
  ListItemText,
  FormControlLabel,
  Switch,
  IconButton,
  Checkbox,
} from "@mui/material";
import { FiPlusCircle } from "react-icons/fi";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PiDotsSixVerticalBold } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import React, { useState, useEffect, useContext, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AccountMultiSelectDropdown from "../../../Templates/AccountMultiSelectDropdown";
import DeleteIcon from "@mui/icons-material/Delete";
import EditorShortcodes from "../../../Templates/Texteditor/EditorShortcodes";
import { LoginContext } from "../../../Sidebar/Context/Context";
import { toast } from "react-toastify";
const NewChatDrawer = ({ open, handleClose, accountwiseChatlist, data,isActiveTrue }) => {
  const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { logindata } = useContext(LoginContext);

  const [loginUserId, setLoginUserId] = useState();

  useEffect(() => {
    if (logindata?.user?.id) {
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);

  const [selectedaccount, setSelectedaccount] = useState();

  const [combinedaccountValues, setCombinedaccountValues] = useState();

  const handleAccountChange = (newSelectedAcc) => {
    setSelectedaccount(newSelectedAcc);

    const selectedValues = newSelectedAcc.map((option) => option.value);
    setCombinedaccountValues(selectedValues);
  };
  const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
  const [chatTemplates, setChatTemplates] = useState([]);
  const fetchChatTemplates = async () => {
    try {
      const url = `${CHAT_API}/workflow/chats/chattemplate`;
      const response = await fetch(url);
      const data = await response.json();
      setChatTemplates(data.chatTemplate);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const chatTemplateOptions = chatTemplates.map((temp) => ({
    value: temp._id,
    label: temp.templatename,
  }));
  useEffect(() => {
    fetchChatTemplates();
  }, []);
  const [selectedtemp, setselectedTemp] = useState("");
  const [templateId, setTemplateId] = useState(null);
  const [absoluteDate, setAbsoluteDates] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [inputText, setInputText] = useState("");
  const [inputTextError, setInputTextError] = useState("");
  const [description, setDescription] = useState("");
  const [noOfReminder, setNoOfReminder] = useState(1);
  const [daysuntilNextReminder, setDaysuntilNextReminder] = useState("3");
  const [from, setFrom] = useState();
  const [subtasks, setSubtasks] = useState([]);
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newSubtasks = Array.from(subtasks);
    const [reorderedItem] = newSubtasks.splice(result.source.index, 1);
    newSubtasks.splice(result.destination.index, 0, reorderedItem);
    setSubtasks(newSubtasks);
  };

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter((subtask) => subtask.id !== id));
  };

  const handleAddSubtask = () => {
    const newId = String(subtasks.length + 1);
    setSubtasks([...subtasks, { id: newId, text: "" }]);
  };

  const handleInputChange = (id, value) => {
    setSubtasks((prevSubtasks) =>
      prevSubtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, text: value } : subtask
      )
    );
  };

  const [checkedSubtasks, setCheckedSubtasks] = useState([]);

  const handleCheckboxChange = (id, description) => {
    setCheckedSubtasks((prevCheckedSubtasks) => {
      const updatedCheckedSubtasks = prevCheckedSubtasks.includes(id)
        ? prevCheckedSubtasks.filter((checkedId) => checkedId !== id)
        : [...prevCheckedSubtasks, id];
      console.log(updatedCheckedSubtasks);
      return updatedCheckedSubtasks;
    });
  };

  const handletemp = async (selectedOptions) => {
    setselectedTemp(selectedOptions);
    console.log(selectedOptions);
    if (selectedOptions && selectedOptions.value) {
      const templateId = selectedOptions.value;
      setTemplateId(templateId);
      try {
        const url = `${CHAT_API}/workflow/chats/chattemplate/chattemplateList/${templateId}`;
        const response = await fetch(url);
        const result = await response.json();
        const chatTemplate = result.chatTemplate;
        console.log("result", chatTemplate);
        setAbsoluteDates(chatTemplate.sendreminderstoclient);
        setTemplateName(chatTemplate.templatename);
        setInputText(chatTemplate.chatsubject);
        setDescription(chatTemplate.description);
        setDaysuntilNextReminder(chatTemplate.daysuntilnextreminder);
        setNoOfReminder(chatTemplate.numberofreminders);
        setFrom(chatTemplate.from.username);
        setSubtasks(
          chatTemplate.clienttasks.map((task) => ({
            id: task.id,
            text: task.text,
            checked: task.checked,
          }))
        );
        console.log("Subtasks updated:", subtasks);
      } catch (error) {
        console.error("Error fetching chat template:", error);
      }
    }
  };

  const [selectedShortcut, setSelectedShortcut] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);
  const handlechatsubject = (e) => {
    const { value, selectionStart } = e.target;
    setInputText(value);
    setCursorPosition(selectionStart);
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");

  const [anchorEl, setAnchorEl] = useState(null);
  const toggleDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdown(!showDropdown);
  };
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
    setAnchorEl(null);
  };

  const handleEditorChange = (content) => {
    setDescription(content);
  };

  const handleAbsolutesDates = (checked) => {
    setAbsoluteDates(checked);
  };

  ///for drawer save btn
  const saveChat = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const selectedAccountIds = selectedaccount.map((account) => account.value);
    const subtaskData = subtasks.map(({ id, text, checked }) => ({
      id,
      text,
      checked: checked !== undefined ? checked : false, // Ensure checked is either true or false
    }));
    const messageData = [
      {
        message: description,
        fromwhome: "Admin",
        senderid: loginUserId,
       
        isRead:false
      },
    ];

    const raw = JSON.stringify({
      accountids: selectedAccountIds,
      chattemplateid: selectedOption?.value,
      templatename: templateName,
      from: from,
      chatsubject: inputText + selectedShortcut,
     
      description: messageData,
      // chatstatus: "false",
      sendreminderstoclient: absoluteDate,
      daysuntilnextreminder: daysuntilNextReminder,
      numberofreminders: noOfReminder,
      clienttasks: subtaskData,
      // isclienttaskchecked: SubtaskSwitch,
      active: "true",
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(raw);
    fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        // console.log("chat id",result.newChats._id)
        // setChatId(result.newChats._id)
        toast.success("New Chat created successfully");
        // sendSaveChatMail(result.newChats._id)
        setIsSubmitted(true);
       accountwiseChatlist(data, isActiveTrue);
        // accountwiseChatlist(data, isActiveTrue);
        handleClose();
        ClearFileds();
      })
      .catch((error) => {
        console.error("Fetch error: ", error.message);
        toast.error("Failed to create new chat. Please try again.");
      });
  };
  const ClearFileds = () => {
    setselectedTemp("");
    setInputText("");
    setSelectedShortcut("");
    setDescription();
    setDaysuntilNextReminder("");
    setNoOfReminder("");
    setCheckedSubtasks([]);
    setAbsoluteDates(false);
    setSubtasks([]);
  };

  const handleCloseDrawer = ()=>{
    handleClose()
    ClearFileds()
  }
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: 600,
        },
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Typography variant="h6">New chat</Typography>
          <Box
            onClick={handleClose}
            sx={{ cursor: "pointer", color: "#1976d3" }}
          >
            <CloseIcon />
          </Box>
        </Box>
        <Divider />

        <Box p={3} height={"75vh"} overflow={"auto"}>
          <Typography>To</Typography>
          <Box mr={2}>
            <AccountMultiSelectDropdown
              value={selectedaccount}
              onChange={handleAccountChange}
              placeholder="To"
            />
          </Box>
          <Box mt={2}>
            <Typography mb={2}>Select templates</Typography>
            <Autocomplete
              options={chatTemplateOptions}
              getOptionLabel={(option) => option.label || ""}
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
          </Box>
          <Box mt={2}>
            <Typography>Subject</Typography>
            <TextField
              sx={{ mt: 2 }}
              fullWidth
              name="subject"
              inputRef={textFieldRef}
              onClick={(e) => setCursorPosition(e.target.selectionStart)}
              value={inputText}
              onChange={handlechatsubject}
              placeholder="Subject"
              size="small"
              error={!!inputTextError}
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
                  sx={{ width: "300px", height: "300px", cursor: "pointer" }}
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
                            fontWeight: shortcut.isBold ? "bold" : "normal",
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Popover>
          </Box>
          <Box sx={{ mt: 2 }}>
            <EditorShortcodes
              initialContent={description}
              onChange={handleEditorChange}
            />
          </Box>
          <Box mt={5}>
            <Box display={"flex"} alignItems={"center"}>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={absoluteDate}
                      onChange={(event) =>
                        handleAbsolutesDates(event.target.checked)
                      }
                      color="primary"
                    />
                  }
                />
              </Box>
              <Typography variant="h6">Send reminders to clients</Typography>
            </Box>
            {absoluteDate && (
              <Box mb={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    mt: 2,
                    m: 1,
                  }}
                >
                  <Box>
                    <InputLabel sx={{ color: "black" }}>
                      Days until next reminder
                    </InputLabel>
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
                    <InputLabel sx={{ color: "black" }}>
                      No Of reminders
                    </InputLabel>
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

          <DragDropContext onDragEnd={handleDragEnd}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                m: 2,
              }}
            >
              <Typography variant="h6">Client tasks</Typography>
              <Box
                sx={{ cursor: "pointer" }}
                onClick={handleAddSubtask}
                style={{ margin: "10px", color: "#1976d3" }}
              >
                <FiPlusCircle /> Add Subtasks
              </Box>
            </Box>

            <Droppable droppableId="subtaskList">
              {(provided) => (
                <div
                  className="subtask-input"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {(subtasks.length > 0
                    ? subtasks
                    : []
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
                            m={1}
                          >
                            <Checkbox
                              style={{ cursor: "pointer" }}
                              checked={checkedSubtasks.includes(subtask.id)}
                              onChange={() =>
                                handleCheckboxChange(
                                  subtask.id,
                                  subtask.checked
                                )
                              }
                            />
                            <TextField
                              placeholder="Things To do"
                              value={subtask.text}
                              size="small"
                              margin="normal"
                              fullWidth
                              onChange={(e) =>
                                handleInputChange(subtask.id, e.target.value)
                              }
                              variant="outlined"
                            />
                            <IconButton
                              onClick={() => handleDeleteSubtask(subtask.id)}
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
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
        <Box
          sx={{
            display: "flex",
            // justifyContent: "space-between",
            alignItems: "center",
            padding: 2,
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "var(--color-save-btn)", // Normal background

              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)", // Hover background color
              },

              borderRadius: "15px",
            }}
            // onClick={sendSaveChatMail}
            onClick={saveChat}
          >
            Create chat
          </Button>
          <Button
            onClick={handleCloseDrawer}
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
    </Drawer>
  );
};

export default NewChatDrawer;
