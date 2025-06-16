import React, { useEffect, useState, useContext } from "react";
import "./pipeline.css";
import { useDrag, DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RiDeleteBin5Line } from "react-icons/ri";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import {
  Modal,
  Divider,
  IconButton,
  FormControlLabel,
  MenuItem,
  InputLabel,
  InputAdornment,
  Checkbox,
  Box,
  Switch,
  Chip,
  Button,
  CircularProgress,
  Drawer,
  TextField,
  Autocomplete,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  OutlinedInput,
  Select,
  FormControl,
  Alert,ListItemText
} from "@mui/material";
// import Select from 'react-select';
import CloseIcon from "@mui/icons-material/Close";
import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Priority from "../Templates/Priority/Priority";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Editor from "../Templates/Texteditor/Editor";
import AddJobs from "./AddJobs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import MultiSelectDropdown from "../Templates/MultiSelectDropdown"
import { LoginContext } from "../Sidebar/Context/Context";
const Pipeline = ({ charLimit = 4000 }) => {
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
  const { logindata } = useContext(LoginContext);
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
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
    if (logindata?.user?.id) {
      // Check if logindata and user.id exist
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
  useEffect(() => {
    fetchUserData(loginuserid);
  }, []);

  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const AUTOMATION_API = process.env.REACT_APP_AUTOMATION_API;
  const [pipelineData, setPipelineData] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [selectedPipelineOption, setSelectedPipelineOption] = useState(null);
  const [stages, setStages] = useState([]);
  const [pipelineId, setPipelineId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };
  const handleEditDrawerOpen = () => {
    setIsEditDrawerOpen(true);
  };
  const handleEditDrawerClose = () => {
    setIsEditDrawerOpen(false);
  };

  useEffect(() => {
    fetchJobData();
  }, []);

  const fetchPipelineData = async () => {
    setLoading(true);
    try {
      const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
      console.log("Received stored teamMemberData:", storedData);
      const loginuserid = storedData?.teammember?.userid;
      console.log("User role is:", userRole);

      let url =
        userRole === "Admin"
          ? `${PIPELINE_API}/workflow/pipeline/pipelines`
          : `${PIPELINE_API}/workflow/pipeline/pipelines/${loginuserid}`;
      // ${JOBS_API}/workflow/jobs/joblist/pipelines/${loginuserid}/true
      // http://127.0.0.1/workflow/pipeline/pipelines/
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      // setPipelineData(data.pipeline);
      setPipelineData(data.pipeline || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    console.log("Fetched userRole from localStorage:", storedUserRole);
    setUserRole(storedUserRole);
  }, []);
  useEffect(() => {
    if (userRole) {
      fetchPipelineData();
    }
  }, [userRole]);
  // const [userRole, setUserRole] = useState("");
  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole");
    console.log("Fetched userRole from localStorage:", storedUserRole);
    setUserRole(storedUserRole);
  }, []);
  useEffect(() => {
    if (userRole) {
      fetchJobData();
    }
  }, [userRole]);
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const fetchJobData = async () => {
    // try {
    //   const url = `${JOBS_API}/workflow/jobs/job/joblist/list/true`;
    // const response = await fetch(url);
    // const data = await response.json();
    // setJobs(data.jobList);
    //   console.log("result",data.jobList)
    // } catch (error) {
    //   console.error("Error fetching job data:", error);
    // }
    try {
      const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
      console.log("Received stored teamMemberData:", storedData);
      const loginuserid = storedData?.teammember?.userid;
      const viewAllAccounts = storedData?.teammember?.viewallAccounts;
      console.log("User role is:", userRole);
      let url = "";
      // let url = userRole === "Admin"
      // ? `${JOBS_API}/workflow/jobs/job/joblist/list/true`
      // : `${JOBS_API}/workflow/jobs/joblist/list/${loginuserid}/true`;
      if (userRole === "Admin") {
        // Admin fetches all jobs
        url = `${JOBS_API}/workflow/jobs/job/joblist/list/true`;
      } else if (userRole === "TeamMember") {
        if (!viewAllAccounts) {
          // If TeamMember has no access, do not fetch data
          // alert("You do not have permission to view accounts.");
          setJobs([]); // Set empty job data
          return;
        }

        // Fetch accounts linked to the user
        const accountsResponse = await axios.get(
          `${ACCOUNT_API}/accounts/getaccounts/${loginuserid}/true`
        );
        const accountsData = accountsResponse.data.accountlist;
        console.log(accountsData);

        if (!accountsData || accountsData.length === 0) {
          console.warn("No accounts found for user.");
          setJobs([]); // Set empty job data
          return;
        }

        // Extract account IDs and form a query string
        const accountIds = accountsData.map((account) => account.id).join(",");

        // Fetch jobs based on retrieved account IDs
        url = `${JOBS_API}/workflow/jobs/job/joblist/list/true/${accountIds}`;
      }

      // If no URL is set, exit
      if (!url) return;
      const response = await fetch(url);
      const data = await response.json();
      setJobs(data.jobList);
      console.log(data.jobList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchStages = async (pipelineId) => {
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch stages");
      }
      const data = await response.json();
      return data.pipeline.stages;
    } catch (error) {
      console.error("Error fetching stages:", error);
      return [];
    }
  };

  const handleSelectChange = (event, option) => {
    setSelectedPipelineOption(option);

    if (option) {
      const pipeline = pipelineData.find(
        (p) => p.pipelineName === option.label
      );
      if (pipeline) {
        handleBoardsList(pipeline);
      }
    }
  };

  const handleBoardsList = async (pipeline) => {
    setSelectedPipeline(pipeline);
    setSelectedPipelineOption({
      value: pipeline._id,
      label: pipeline.pipelineName,
    });
    setPipelineId(pipeline._id);

    const fetchedStages = await fetchStages(pipeline._id);
    setStages(fetchedStages);
  };

  const handleBackToPipelineList = () => {
    setSelectedPipeline(null);
    setSelectedPipelineOption(null);
    setStages([]);
  };
  console.log("janavi", stages);
  // const updateJobStage = async (stage, item) => {
  //   let data = JSON.stringify({ stageid: stage._id });
  //   let config = {
  //     method: "post",
  //     maxBodyLength: Infinity,
  //     url: `${JOBS_API}/workflow/jobs/job/jobpipeline/updatestageid/${item.id}`,
  //     headers: { "Content-Type": "application/json" },
  //     data: data,
  //   };
  //   axios
  //     .request(config)
  //     .then((response) => {
  //       console.log(JSON.stringify(response.data));
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  // const AutomationDrawer = ({ open, automations, onClose }) => (
  //   <Drawer anchor="right" open={open} onClose={onClose}>
  //     <Box sx={{ width: 300, padding: 2 }}>
  //       <Typography variant="h6">Automations</Typography>
  //       {automations.length > 0 ? (
  //         automations.map((automation, index) => (
  //           <Box key={index} sx={{ marginBottom: 2 }}>
  //             <Typography variant="body1"><strong>Type:</strong> {automation.type}</Typography>
  //             <Typography variant="body1"><strong>Template:</strong> {automation.template.label}</Typography>
  //             <Typography variant="body1"><strong>Tags:</strong></Typography>
  //             {automation.tags.map((tag) => (
  //               <Box
  //                 key={tag._id}
  //                 sx={{
  //                   display: "inline-block",
  //                   backgroundColor: tag.tagColour,
  //                   color: "white",
  //                   borderRadius: "4px",
  //                   padding: "2px 6px",
  //                   marginRight: "4px",
  //                 }}
  //               >
  //                 {tag.tagName}
  //               </Box>
  //             ))}
  //           </Box>
  //         ))
  //       ) : (
  //         <Typography>No automations available</Typography>
  //       )}
  //       <Button onClick={onClose} variant="contained" sx={{ marginTop: 2 }}>
  //         Close
  //       </Button>
  //     </Box>
  //   </Drawer>
  // );

  const updateJobStage = async (jobId, targetStage) => {
    // Create the payload with the stage ID for updating the job's stage
    const data = JSON.stringify({ stageid: targetStage._id });

    // Set up the request configuration
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${JOBS_API}/workflow/jobs/job/jobpipeline/updatestageid/${jobId}`,
      headers: { "Content-Type": "application/json" },
      data: data,
    };

    try {
      // Make the request to update the job stage
      const response = await axios.request(config);
      console.log("Job moved successfully:", response.data);
      toast.success("Job moved successfully!");
      fetchJobData(); // Optionally refresh the job data after updating
    } catch (error) {
      console.error("Error moving job:", error);
      toast.error("Failed to move job");
    }
  };

  const AutomationDrawer = ({
    open,
    automations,
    onClose,
    onMoveJob,
    jobId,
    targetStage,
  }) => {
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

    console.log("automationData", automations);
    const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
    const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
    const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
    const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
    const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL;
    const PROPOSAL_ACCOUNT_API = process.env.REACT_APP_PROPOSAL_URL;
    const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
    const AUTOMATION_API = process.env.REACT_APP_AUTOMATION_API;
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
    // REACT_APP_TASKS_API
    const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;
    const API_KEY = process.env.REACT_APP_API_IP;
    const DOCS_MANAGMENTS = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
    const [automationType, setAutomationType] = useState([]);
    const [automationTemp, setAutomationTemp] = useState("");
    const [automationAccountId, setAutomationAccountId] = useState("");
    const [selectedAutomationIndices, setSelectedAutomationIndices] = useState(
      []
    );
    console.log("automatios data", automations);

    const [accountTags, setAccountTags] = useState([]);

    const AccountsTag = (accountId) => {
      console.log(accountId);
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(
        `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyid/${accountId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.accountlist && result.accountlist.Tags) {
            setAccountTags(result.accountlist.Tags);
          }
        })
        .catch((error) => console.error(error));
    };
    useEffect(() => {
      AccountsTag(accountId);
    }, []);
    const handleAutomationSelection = (index) => {
      setSelectedAutomationIndices((prevSelected) =>
        prevSelected.includes(index)
          ? prevSelected.filter((i) => i !== index)
          : [...prevSelected, index]
      );
    };
    useEffect(() => {
      if (automations.length > 0) {
        setSelectedAutomationIndices(automations.map((_, index) => index));
      }
    }, [automations]);
    useEffect(() => {
      // Ensure automations is not empty and then set the automation type and template
      if (automations.length > 0) {
        setAutomationType(automations[0].type);
        // setAutomationTemp(automations[0].template.value || "");
        setAutomationTemp(automations[0]?.template?.value || "");
      }

      // If accountId is an array, extract the first value
      const accountValue = Array.isArray(accountId) ? accountId[0] : accountId;
      setAutomationAccountId(accountValue);
    }, [automations, accountId]);

    console.log("account id automation", accountId);

    
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
    const assignInvoiceToAccount = (
      invoiceData,
      automationTemp,
      automationAccountId
    ) => {
      console.log(
        "Assigning invoice",
        invoiceData,
        automationTemp,
        automationAccountId
      );

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      // Dynamically prepare the payload from invoiceData
      const raw = JSON.stringify({
        account: automationAccountId,
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
        paidAmount: "",
        invoiceStatus: "Pending",
        balanceDueAmount: "",
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      fetch(`${INVOICE_NEW}/workflow/invoices/invoice`, requestOptions)
        .then((response) => response.json())
        .then((result) => console.log("Invoice assigned successfully:", result))
        .catch((error) => console.error("Error assigning invoice:", error));
    };

    const [chatId, setChatId] = useState();
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
          isRead:false
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
          toast.success("New Chat created successfully");
          // sendSaveChatMail(result.newChats._id);
        })
        .catch((error) => console.error("Error assigning invoice:", error));
    };
    // mail for drawer btn
    const sendSaveChatMail = (chatId) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        accountid: automationAccountId,
        chattemplateid: automationTemp,
        username: username,
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

    const assignTaskToAccount = (
      taskData,
      automationTemp,
      automationAccountId
    ) => {
      console.log(
        "Assigning task",
        taskData,
        automationTemp,
        automationAccountId
      );

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      // const subtaskData = subtasks.map(({ id, text }) => ({
      //     id,
      //     text,

      //     checked: checkedSubtasks.includes(id), // Check if ID is in the checkedSubtasks array
      //   }));

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
      console.log(raw);
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
          accountids: [automationAccountId],
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
             status:'Pending',
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
      automationAccountId
    ) => {
      console.log(
        "Assigning proposal",
        organizerData,
        automationTemp,
        automationAccountId
      );
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        accountid: automationAccountId,
        organizertemplateid: automationTemp,
           organizerName: organizerData.organizerName,
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
    const assignfoldertemp = (automationAccountId, automationTemp) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        accountId: automationAccountId,
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
   
    const selectAutomationApi = async (
      automationType,
      automationTemp,
      automationAccountId,
      automation
    ) => {
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
        case "Create Task":
          console.log(
            `Processing 'Create Task' with template: ${automationTemp}, Account ID: ${automationAccountId}`
          );
          try {
            const taskData = await fetchtasktempbyid(automationTemp);
            console.log("Fetched task temp data", taskData);
            assignTaskToAccount(taskData, automationTemp, automationAccountId);
          } catch (error) {
            console.error("Error processing 'Create Task':", error);
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

    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 500, padding: 2 }}>
          <Typography variant="h6">Automations for {accountName}</Typography>

          {automations.length > 0 ? (
            automations.map((automation, index) => {
              const hasMatchingTags = automation.tags?.length
                ? automation.tags.some((automationTag) =>
                    accountTags.some(
                      (accountTag) => accountTag._id === automationTag._id
                    )
                  )
                : true;
              return (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Checkbox
                      checked={selectedAutomationIndices.includes(index)}
                      onChange={() => handleAutomationSelection(index)}
                      disabled={!hasMatchingTags} // Disable if no matching tags
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

                  {/* Render Update Account Tags UI if automation type matches */}
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
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
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
                              const dynamicWidth = Math.min(
                                textWidth + 20,
                                200
                              ); // Add padding & set max width

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
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
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
                          fullWidth
                          MenuProps={MenuProps}
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
                              const dynamicWidth = Math.min(
                                textWidth + 20,
                                200
                              ); // Add padding & set max width

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
                        <strong>Template:</strong> {automation?.template?.label}
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
                            borderRadius: "4px",
                            padding: "2px 6px",
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
            })
          ) : (
            <Typography>No automations available</Typography>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            
            {/* <Button
              onClick={async () => {
                const selectedAutomations = selectedAutomationIndices
                  .map((index) => automations[index])
                  .filter((automation) => {
                    if (!automation.tags || automation.tags.length === 0) {
                      return true;
                    }
                    return automation.tags.some((tag) =>
                      accountTags.some(
                        (accountTag) => accountTag._id === tag._id
                      )
                    );
                  });

                   // Find the "Update client-facing job status" automation if it exists
    const clientStatusAutomation = selectedAutomations.find(
      (automation) => automation.type === "Update client-facing job status"
    );
    

                if (selectedAutomations.length > 0) {
                  for (const automation of selectedAutomations) {
                    const { type, template } = automation;
                    const templateValue = template?.value;

                    if (type && automationAccountId) {
                      try {
                        await selectAutomationApi(
                          type,
                          templateValue,
                          automationAccountId,
                          automation
                        );
                      } catch (error) {
                        console.error(
                          "Error processing automation:",
                          automation,
                          error
                        );
                      }
                    } else {
                      console.warn(
                        "Skipping automation due to missing parameters:",
                        automation
                      );
                    }
                  }
                }

                // Move the job to the target stage
                onMoveJob(jobId, targetStage,clientStatusAutomation);

                // Close the drawer
                onClose();
              }}
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: "var(--color-save-btn)",
                "&:hover": { backgroundColor: "var(--color-save-hover-btn)" },
                width: "80px",
                borderRadius: "15px",
                mt: 2,
              }}
            >
              Move
            </Button> */}
<Button
sx={{
                    backgroundColor: "var(--color-save-btn)", // Normal background

                    "&:hover": {
                      backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                    },
                    borderRadius: "15px",
                    mt: 2,
                  }}
            onClick={async () => {
              const selectedAutomations = selectedAutomationIndices
                .map((index) => automations[index])
                .filter((automation) => {
                  // Filter based on tags if applicable
                  if (!automation.tags || automation.tags.length === 0) {
                    return true;
                  }
                  return automation.tags.some((tag) =>
                    accountTags.some(
                      (accountTag) => accountTag._id === tag._id
                    )
                  );
                });

              // Find specific automations if needed
              const clientStatusAutomation = selectedAutomations.find(
                (a) => a.type === "Update client-facing job status"
              );
              const assigneeAutomation = selectedAutomations.find(
                (a) => a.type === "Update job assignees"
              );

              // Process all selected automations
              if (selectedAutomations.length > 0) {
                for (const automation of selectedAutomations) {
                  const { type, template } = automation;
                  const templateValue = template?.value;

                  if (type && automationAccountId) {
                    try {
                      await selectAutomationApi(
                        type,
                        templateValue,
                        automationAccountId,
                        automation
                      );
                    } catch (error) {
                      console.error("Error processing automation:", error);
                    }
                  }
                }
              }

              // Move the job with any relevant automations
              onMoveJob(jobId, targetStage, {
                clientStatus: clientStatusAutomation,
                assignees: assigneeAutomation
              });

              onClose();
            }}
            variant="contained"
            color="primary"
          >
            Move
          </Button>
            <Button
              onClick={onClose}
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
                mt: 2,
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Drawer>
    );
  };

  const JobCard = ({ job }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "JOB_CARD",
      item: { id: job.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });
    const [lastUpdatedTime, setLastUpdatedTime] = useState(
      new Date(job.createdAt)
    );

    useEffect(() => {
      if (job.updatedAt) {
        setLastUpdatedTime(new Date(job.updatedAt));
      }
    }, [job.updatedAt]);

    useEffect(() => {
      const intervalId = setInterval(() => {
        setLastUpdatedTime((prevTime) => new Date(prevTime));
      }, 1000);

      return () => clearInterval(intervalId);
    }, []);

    const updateLastUpdatedTime = () => {
      setLastUpdatedTime(new Date());
      console.log(new Date());
    };

    const timeAgo = () => {
      const currentTime = new Date();
      const jobTime = lastUpdatedTime;

      const minutesDiff = differenceInMinutes(currentTime, jobTime);
      const hoursDiff = differenceInHours(currentTime, jobTime);
      const daysDiff = differenceInDays(currentTime, jobTime);

      if (minutesDiff < 1) {
        return "just now";
      } else if (minutesDiff < 60) {
        return `${minutesDiff} minute${minutesDiff === 1 ? "" : "s"} ago`;
      } else if (hoursDiff < 24) {
        return `${hoursDiff} hour${hoursDiff === 1 ? "" : "s"} ago`;
      } else {
        return `${daysDiff} day${daysDiff === 1 ? "" : "s"} ago`;
      }
    };

    const stripHtmlTags = (html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return doc.body.textContent || "";
    };

    const truncateDescription = (description, maxLength = 30) => {
      if (description.length > maxLength) {
        return description.slice(0, maxLength) + "...";
      }
      return description;
    };

    const getPriorityStyle = (priority) => {
      switch (priority.toLowerCase()) {
        case "urgent":
          return {
            color: "white",
            backgroundColor: "#0E0402",
            fontSize: "12px",
            borderRadius: "50px",
            padding: "3px 7px",
          };
        case "high":
          return {
            color: "white",
            backgroundColor: "#fe676e",
            fontSize: "12px",
            borderRadius: "50px",
            padding: "3px 7px",
          }; // light red background
        case "medium":
          return {
            color: "white",
            backgroundColor: "#FFC300",
            fontSize: "12px",
            borderRadius: "50px",
            padding: "3px 7px",
          }; // light orange background
        case "low":
          return {
            color: "white",
            backgroundColor: "#56c288",
            fontSize: "12px",
            borderRadius: "50px",
            padding: "3px 7px",
          }; // light green background
        default:
          return {};
      }
    };

    const truncateName = (name) => {
      const maxLength = 15;
      if (name.length > maxLength) {
        return name.substring(0, maxLength) + "...";
      }
      return name;
    };

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const options = { month: "short", day: "2-digit", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
    };

    const startDateFormatted = formatDate(job.StartDate);
    const dueDateFormatted = formatDate(job.DueDate);

    const [isHovered, setIsHovered] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleDelete = (_id) => {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };

      fetch(`${JOBS_API}/workflow/jobs/job/` + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.json();
        })
        .then((result) => {
          // console.log(result);
          toast.success("Job deleted successfully");
          fetchJobData();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    };

    // edit

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
        console.log("pipeline data for stage", data.pipeline);

        if (data.pipeline && data.pipeline.stages) {
          const stagesdata = data.pipeline.stages.map((stage) => ({
            value: stage._id,
            label: stage.name,
          }));
          setstages(stagesdata);
          // setSelectedstage(stagesdata[0]);
          console.log(stagesdata);
        }
      } catch (error) {
        // console.error("Error fetching data:", error);
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
        console.log(data);
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
      console.log("pipeline", selectedOptions);
      fetchPipelineDataid(selectedOptions.value);
    };

    // const [selectedStage, setSelectedStage] = useState(null);
    const [stagesoptions, setStagesOptions] = useState([]);
    const [selectedstage, setSelectedstage] = useState("");
    const handleStageChange = (selectedOptions) => {
      setSelectedstage(selectedOptions);
    };

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedJobData, setSelectedJoData] = useState(null);
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

    // const handleTagChange = (event, newValue) => {
    //   setSelectedTags(newValue); // Keep the full tag objects

    //   // Send only the values to your backend
    //   const tagValues = newValue.map((option) => option.value);
    //   console.log("Selected Values:", tagValues);

    //   // Assuming setCombinedTagsValues is a function to send the values to your backend
    //   setCombinedTagsValues(tagValues);
    // };
    const handleTagChange = (event) => {
      const { value } = event.target; // Get selected tag objects
      setSelectedTags(value); // Keep full tag objects in state

      // Extract selected tag values
      const selectedTagsValues = value.map((val) => {
        const option = tagoptions.find((opt) => opt.value === val);
        return option?.value;
      });

      setCombinedTagsValues(selectedTagsValues); // Send only tag IDs to backend
    };

    useEffect(() => {
      fetchUserData();
    }, []);
    const [userData, setUserData] = useState([]);
    const [selectedUser, setSelectedUser] = useState();
    const [combinedValues, setCombinedValues] = useState();
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
    // for autocomplete
    // const handleUserChange = (event, selectedOptions) => {
    //   setSelectedUser(selectedOptions);
    //   const selectedValues = selectedOptions.map((option) => option.value);
    //   setCombinedValues(selectedValues);
    // };

    const handleUserChange = (newSelectedUsers) => {
      setSelectedUser(newSelectedUsers);
      console.log(newSelectedUsers)
      const selectedValues = newSelectedUsers.map((option) => option.value);
      setCombinedValues(selectedValues);
      console.log(selectedValues)
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
    const USER_API = process.env.REACT_APP_USER_URL;
    const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
    const CLIENT_FACING_API = process.env.REACT_APP_CLIENT_FACING_URL;
    const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
    const [jobid, setjobid] = useState();
    const [inputText, setInputText] = useState("");
    const [charCount, setCharCount] = useState(0);
    const [selectedjob, setSelectedjob] = useState(null);
    const [clientFacingJobs, setClientFacingJobs] = useState([]);
    const [clientDescription, setClientDescription] = useState("");
    const [clientFacingStatus, setClientFacingStatus] = useState(false);
    const [selectedJobShortcut, setSelectedJobShortcut] = useState("");
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
    const [selectedAccount, setSelectedAccount] = useState(null);
    const handleEditJobCard = async (jobid) => {
      console.log(jobid);
      setjobid(jobid);
      try {
        const url = `${JOBS_API}/workflow/jobs/job/joblist/listbyid/${jobid}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setSelectedJoData(data.jobList);
        console.log("account name", data);

        // for autocomplete
        // if (data.jobList && data.jobList.Account) {
        //   const accountsData = {
        //     value: data.jobList.Account._id,
        //     label: data.jobList.Account.accountName,
        //   };
        //   setSelectedAccount(accountsData)
        //   console.log("accounts",accountsData)
        // }


    

        if (data.jobList.Account && data.jobList.Account.length > 0) {
          const { _id, accountName } = data.jobList.Account[0];
          console.log("Account ID:", _id);
          console.log("Account Name:", accountName);
          setSelectedAccount(accountName);
        } 
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
        if (
          data.jobList &&
          data.jobList.Stage &&
          data.jobList.Stage.length > 0
        ) {
          const stageData = {
            value: data.jobList.Stage[0]._id, // Access first element of array
            label: data.jobList.Stage[0].name,
          };
          setSelectedstage(stageData);
          console.log("stages", stageData);
        }

        setPriority(data.jobList.Priority);
        setDescription(data.jobList.Description);
        setClientFacingStatus(data.jobList.ShowinClientPortal);
        setInputText(data.jobList.jobClientName);
        setClientDescription(data.jobList.ClientFacingDecription);
        if (
          data.jobList.ClientFacingStatus &&
          data.jobList.ClientFacingStatus
        ) {
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
          const tagsData = data.jobList.Account[0].tags
            .flatMap((tagArray) => tagArray)
            .map((tag) => ({
              value: tag._id,
              label: tag.tagName,
              colour: tag.tagColour,
            }));
          setSelectedTags(tagsData);
          const selectedValues = tagsData.map((option) => option.value);
          setCombinedTagsValues(selectedValues);
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
    const handleSaveClick = () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        pipeline: selectedPipeline.value,
        stageid: selectedstage.value,
        jobassignees: combinedValues,
         priority: priority,
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
          toast.success("Job  updated successfully");
           handleSaveTags();
          // setIsDrawerOpen(false);
          fetchJobData();
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to update Job ");
        });
    };
    const handleSaveExitClick = () => {
      updatejobdata();
    };
    // console.log(accountId);
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
          console.log("acc", result.updatedAccount); // Log the result
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

        priority: priority,
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
          handleSaveTags();
          setIsDrawerOpen(false);
          fetchJobData();
        })
        .catch((error) => {
          // Handle errors
          console.error(error);
          toast.error("Failed to update Job Template");
        });
    };
    return (
      
      <Box
        className={`job-card ${isDragging ? "dragging" : ""}`}
        ref={drag}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDrop={updateLastUpdatedTime}
        sx={{
          backgroundColor: "white",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          padding: "16px",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        {/* Top Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
            {job.Account.join(", ")}
          </Typography>
          {isHovered ? (
            <RiDeleteBin5Line
              onClick={handleOpen}
              style={{ cursor: "pointer", fontSize: "18px", color: "red" }}
            />
          ) : (
            <span className="automation-batch">1</span>
          )}
        </Box>

        {/* Job Name */}
        <Typography
          sx={{
            fontWeight: "bold",
            marginBottom: "8px",
            cursor: "pointer",
            whiteSpace: "normal", // Allows text to wrap
            wordBreak: "break-word", // Breaks long words if necessary
            overflowWrap: "break-word", // Ensures wrapping works in all cases
          }}
          color="black"
          onClick={() => handleEditJobCard(job.id)}
        >
          {job.Name}
        </Typography>

        {/* Job Assignee */}
        {/* <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: "8px" }}
        >
          {job.JobAssignee.join(", ")}
        </Typography> */}
        <Typography
  variant="body2"
  color="text.secondary"
  sx={{ 
    marginBottom: "8px",
    whiteSpace: "normal",
    wordBreak: "break-word",
    overflowWrap: "break-word",
    lineHeight: "1.5", // Adjust line height for better readability
  }}
>
  {job.JobAssignee.join(", ")}
</Typography>

        {/* Job Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: "8px" }}
        >
          {truncateDescription(stripHtmlTags(job.Description))}
        </Typography>

        {/* Priority Badge */}
        <span style={getPriorityStyle(job.Priority)}>{job.Priority}</span>

        {/* Dates */}
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Starts:</strong> {startDateFormatted}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Due:</strong> {dueDateFormatted}
          </Typography>
        </Box>

        {/* Last Updated */}
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ marginTop: "8px", display: "block" }}
        >
          {timeAgo()}
        </Typography>

        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 300,
              bgcolor: "background.paper",
              p: 4,
              boxShadow: 24,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" component="h2" mb={2}>
              Confirm Deletion
            </Typography>
            <Typography variant="body1" mb={4}>
              Are you sure you want to delete this job?
            </Typography>
            <Box display="flex" gap={3} ml={15}>
              <Button variant="text" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(job.id)}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* edit job */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            PaperProps={{
              sx: {
                borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
                width: isSmallScreen ? "100%" : 500,
                maxWidth: "100%",
                [theme.breakpoints.down("sm")]: {
                  width: "100%",
                },
                id: "tag-drawer",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                ml: 1,
              }}
            >
              <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
                Edit Job
              </Typography>
              <IconButton onClick={() => setIsDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider />
            <Box
              padding={2}
              height="83vh"
              sx={{ overflowY: "auto" }}
              className="bulk-job-form"
            >
              <Box>
                <InputLabel sx={{ color: "black" }}>Account</InputLabel>

                <TextField
                  value={selectedAccount}
                  size="small"
                  fullWidth
                  margin="normal"
                />
              </Box>
              {/* selectedAccount */}
              <Box>
                <InputLabel sx={{ color: "black" }}>Pipeline</InputLabel>

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
                <InputLabel sx={{ color: "black", mb: 1 }}>
                  Account Tags
                </InputLabel>
                {/* <Autocomplete
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
                 */}
                <FormControl sx={{ width: "100%" }}>
                  <Select
                    multiple
                    multiline
                    size="small"
                    // sx={{ marginTop: "8px", marginBottom: "8px", width: "100%" }}
                    input={<OutlinedInput />}
                    displayEmpty
                    value={combinedTagsValues} // Store selected tag objects
                    onChange={handleTagChange} // Handle selection
                    // renderValue={(selected) => (
                    //   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    //     {selected.map((option) => (
                    //       <Chip
                    //         key={option.value}
                    //         label={option.label}
                    //         sx={{
                    //           backgroundColor: option.colour,
                    //           color: "#fff",
                    //           borderRadius: "15px",
                    //           fontSize: "10px",
                    //           padding: "2px 8px",
                    //         }}
                    //       />
                    //     ))}
                    //   </Box>
                    // )}
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
                            const option = tagoptions.find(
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
                    {tagoptions.map((option) => {
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
                </FormControl>
              </Box>
              <Box mt={2} mr={2.5}>
                <InputLabel sx={{ color: "black" }}>Job Assignee</InputLabel>
                {/* <Autocomplete
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
                /> */}
                 <MultiSelectDropdown 
                   value={selectedUser}
                   onChange={handleUserChange}
                   placeholder="Job Assignees"
                 />
              </Box>
              <Box mt={2}>
                <InputLabel sx={{ color: "black" }}>Stage</InputLabel>
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
              <Box mt={2}>
                <InputLabel sx={{ color: "black" }}>Start Date</InputLabel>
                <DatePicker
                  format="DD/MM/YYYY"
                  sx={{ width: "100%", backgroundColor: "#fff", mt: 2 }}
                  // value={startDate}
                  // onChange={handleStartDateChange}
                  value={startDate}
                  onChange={handleStartDateChange}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                />
              </Box>
              <Box mt={2}>
                <InputLabel sx={{ color: "black" }}>Due Date</InputLabel>
                <DatePicker
                  format="DD/MM/YYYY"
                  sx={{ width: "100%", backgroundColor: "#fff", mt: 2 }}
                  // value={dueDate}
                  // onChange={handleDueDateChange}
                  value={dueDate}
                  onChange={handleDueDateChange}
                  renderInput={(params) => (
                    <TextField {...params} size="small" />
                  )}
                />
              </Box>
              <Box mt={2} mb={5}>
                <Editor
                  initialContent={description}
                  onChange={handleEditorChange}
                />
              </Box>

              <Box mt={3}>
                <Box style={{ display: "flex", alignItems: "center" }}>
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
                          <InputLabel sx={{ color: "black" }}>
                            Job name for client
                          </InputLabel>
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
                            <InputLabel sx={{ color: "black" }}>
                              Status
                            </InputLabel>
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
          </Drawer>
        </LocalizationProvider>
      </Box>
    );
  };

  const Stage = ({ stage, selectedPipeline, handleDrop }) => {
    const [{ isOver }, drop] = useDrop({
      accept: "JOB_CARD",
      drop: (item, monitor) => {
        handleDrop(item.id, stage.name);
        console.log(stage.automations);
        // updateJobStage(stage, item);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });

    const stageJobs = jobs.filter(
      (job) =>
        job.Pipeline === selectedPipeline.pipelineName &&
        job.Stage.includes(stage.name)
    );
    console.log("jobs for stage", stageJobs);
    const [displayCount, setDisplayCount] = useState(3);
    const displayedJobs = stageJobs.slice(0, displayCount);
    const truncatedStageName =
      stage.name.length > 30 ? `${stage.name.slice(0, 20)}...` : stage.name;
    return (
      <Box ref={drop} className={`stage ${isOver ? "drag-over" : ""}`}>
        {/* <Typography sx={{ marginBottom: "12px" }} className="stage-name">
          {truncatedStageName}
        </Typography> */}
        <Typography
          sx={{
            marginBottom: "12px",
            whiteSpace: "normal", // Allows text wrapping
            wordBreak: "break-word", // Ensures long words wrap properly
            overflowWrap: "break-word", // Additional fallback for wrapping
          }}
          className="stage-name"
        >
          {stage.name}
        </Typography>

        <Typography variant="body2" sx={{ marginBottom: "12px" }}>
          {stageJobs.length > 0 && <span>({stageJobs.length})</span>}
        </Typography>
        {displayedJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
        {stageJobs.length > displayCount && (
          <Button
            variant="outlined"
            onClick={() => setDisplayCount(displayCount + 5)}
            sx={{ marginTop: "16px", alignSelf: "center" }}
          >
            Load More
          </Button>
        )}
      </Box>
    );
  };
  const [automationdrawerOpen, setAutomationDrawerOpen] = useState(false);
  const [automationData, setAutomationData] = useState([]);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [currentTargetStage, setCurrentTargetStage] = useState(null);
  const [tempJobData, setTempJobData] = useState(null); // State for temporary job data
  const [accountName, setAccountName] = useState("");
  const [accountId, setAccountId] = useState("");

  // const handleDrop = (jobId, targetStageName) => {
  //   const sourceStage = stages.find((stage) =>
  //     jobs.find((job) => job.id === jobId)?.Stage.includes(stage.name)
  //   );

  //   const targetStage = stages.find((stage) => stage.name === targetStageName);
  //   const job = jobs.find((job) => job.id === jobId);
  //   if (job) {
  //     setAccountName(job.Account.join(", ")); // Store the account name
  //     setAccountId(job.AccountId); // Store the account ID
  //   }
  //   // If the source stage has automations, show the drawer
  //   if (sourceStage?.automations?.length > 0) {
  //     setAutomationData(sourceStage.automations); // Set automation data for drawer
  //     setCurrentJobId(jobId); // Store the current job ID
  //     setCurrentTargetStage(targetStage); // Store the target stage
  //     setAutomationDrawerOpen(true); // Open the automation drawer
  //   } else {
  //     // If no automations, immediately update the job's stage
  //     const updatedJobs = jobs.map((job) => {
  //       if (job.id === jobId) {
  //         return { ...job, Stage: [targetStageName] };
  //       }
  //       return job;
  //     });

  //     setJobs(updatedJobs); // Update the job in the local state

  //     // Optionally, refresh job data after updating
  //     setTimeout(() => {
  //       fetchJobData();
  //     }, 1000);

  //     updateJobStage(jobId, targetStage);
  //   }
  //   setTempJobData({ jobId, targetStageName });
  // };

  const handleDrop = (jobId, targetStageName) => {
    const targetStage = stages.find((stage) => stage.name === targetStageName);
    const job = jobs.find((job) => job.id === jobId);

    if (job) {
      setAccountName(job.Account.join(", ")); // Store the account name
      setAccountId(job.AccountId); // Store the account ID
    }

    // If the target stage has automations, show the drawer
    if (targetStage?.automations?.length > 0) {
      setAutomationData(targetStage.automations); // Set automation data for drawer
      setCurrentJobId(jobId); // Store the current job ID
      setCurrentTargetStage(targetStage); // Store the target stage
      setAutomationDrawerOpen(true); // Open the automation drawer
    } else {
      // If no automations, immediately update the job's stage
      const updatedJobs = jobs.map((job) => {
        if (job.id === jobId) {
          return { ...job, Stage: [targetStageName] };
        }
        return job;
      });

      setJobs(updatedJobs); // Update the job in the local state

      // Optionally, refresh job data after updating
      setTimeout(() => {
        fetchJobData();
      }, 1000);

      updateJobStage(jobId, targetStage);
    }
    setTempJobData({ jobId, targetStageName });
  };

  // const handleMoveJob = (jobId, targetStage) => {
  //   // Call the API to update the job stage in the backend
  //   const updateJobStage = async () => {
  //     let data = JSON.stringify({ stageid: targetStage._id });
  //     let config = {
  //       method: "post",
  //       maxBodyLength: Infinity,
  //       url: `${JOBS_API}/workflow/jobs/job/jobpipeline/updatestageid/${jobId}`,
  //       headers: { "Content-Type": "application/json" },
  //       data: data,
  //     };
  //     try {
  //       const response = await axios.request(config);
  //       console.log("Job moved successfully:", response.data);
  //       toast.success("Job moved successfully!");
  //       fetchJobData(); // Refresh the data
  //     } catch (error) {
  //       console.error("Error moving job:", error);
  //       toast.error("Failed to move job");
  //     }
  //   };
  //   updateJobStage();
  // };
 
//  const handleMoveJob = (jobId, targetStage, automation) => {

//   console.log("while moving job automation", automation)
//   // Call the API to update the job stage in the backend
//   const updateJobStage = async () => {
//     let data = {
//       stageid: targetStage._id,
//     };

//     // If there's an automation of type "Update client-facing job status", update those fields
//     if (automation && automation.type === "Update client-facing job status") {
//       data = {
//         ...data,
//         showinclientportal: automation.visibilityForClient,
//         clientfacingstatus: automation.selectedClientStatus?.value,
//         clientfacingDescription: automation.statusDescription,
//       };
//     }

//     let config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: `${JOBS_API}/workflow/jobs/job/jobpipeline/updatestageid/${jobId}`,
//       headers: { "Content-Type": "application/json" },
//       data: JSON.stringify(data),
//     };
//     try {
//       const response = await axios.request(config);
//       console.log("Job moved successfully:", response.data);
//       toast.success("Job moved successfully!");
//       fetchJobData(); // Refresh the data
//     } catch (error) {
//       console.error("Error moving job:", error);
//       toast.error("Failed to move job");
//     }
//   };
//   updateJobStage();
// };
 
const handleMoveJob = async (jobId, targetStage, automations = {}) => {
  try {
    // First, get the current job data to work with the existing assignees
    const currentJobResponse = await axios.get(`${JOBS_API}/workflow/jobs/job/${jobId}`);
    const currentJob = currentJobResponse.data;
    const currentAssignees = currentJob.jobassignees || [];

    // Prepare the data object with stage update
    const data = {
      stageid: targetStage._id,
    };

    // Handle client-facing status if automation exists
    if (automations.clientStatus) {
      const { visibilityForClient, selectedClientStatus, statusDescription } = automations.clientStatus;
      Object.assign(data, {
        showinclientportal: visibilityForClient,
        clientfacingstatus: selectedClientStatus?.value,
        clientfacingDescription: statusDescription,
      });
    }

    // Handle assignee updates if automation exists
    if (automations.assignees) {
      const { addAssignees = [], removeAssignees = [] } = automations.assignees;
      
      // Create new assignees array:
      // 1. Start with current assignees
      // 2. Remove any assignees in removeAssignees
      // 3. Add any assignees in addAssignees that aren't already present
      const newAssignees = [
        ...currentAssignees.filter(
          assigneeId => !removeAssignees.some(ra => ra._id === assigneeId)
        ),
        ...addAssignees
          .map(a => a._id)
          .filter(newId => !currentAssignees.includes(newId))
      ];

      Object.assign(data, {
        jobassignees: newAssignees
      });
    }

    // Make the API call to update the job
    const response = await axios.post(
      `${JOBS_API}/workflow/jobs/job/jobpipeline/updatestageid/${jobId}`,
      data
    );

    console.log("Job moved and updated successfully:", response.data);
    toast.success("Job moved and updated successfully!");
    fetchJobData(); // Refresh the job data
  } catch (error) {
    console.error("Error moving/updating job:", error);
    toast.error("Failed to move and update job");
  }
};
  console.log("pipeline", pipelineData);
  const optionpipeline = pipelineData.map((pipeline) => ({
    value: pipeline._id,
    label: pipeline.pipelineName,
  }));

  const [tags, setTags] = useState([]);
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
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

    setAutomationData((prev) => {
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
  
      setAutomationData((prev) => {
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
  return (
    <DndProvider backend={HTML5Backend}>
      <Box p={3}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <CircularProgress />
          </Box>
        ) : selectedPipeline ? (
          <>
            <Box mb={2}>
              <Autocomplete
                value={selectedPipelineOption}
                onChange={handleSelectChange}
                size="small"
                options={optionpipeline}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.value === value?.value
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
                    // label="Search pipelines..."
                    placeholder="Search pipelines..."
                    sx={{ backgroundColor: "#fff" }}
                  />
                )}
                // isClearable
                className="pipeline-select"
              />
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleBackToPipelineList}
                  sx={{
                    borderColor: "var(--color-border-cancel-btn)", // Normal background
                    color: "var(--color-save-btn)",
                    "&:hover": {
                      backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                      color: "#fff",
                      border: "none",
                    },
                    mt: 2,
                    borderRadius: "15px",
                    ml: 2,
                  }}
                >
                  Back to Pipeline List
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  // sx={{ mt: 2 }}
                  onClick={handleDrawerOpen}
                  sx={{
                    backgroundColor: "var(--color-save-btn)", // Normal background

                    "&:hover": {
                      backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                    },
                    borderRadius: "15px",
                    mt: 2,
                  }}
                >
                  Add Jobs
                </Button>
              </Box>
            </Box>
            <Box>
              <Box className="stage-container" display="flex" gap={2}>
                {stages.map((stage, index) => (
                  <Stage
                    key={index}
                    stage={stage}
                    selectedPipeline={selectedPipeline}
                    handleDrop={handleDrop}
                  />
                ))}

                <AutomationDrawer
                  open={automationdrawerOpen}
                  automations={automationData}
                  onClose={() => setAutomationDrawerOpen(false)}
                  jobId={currentJobId}
                  targetStage={currentTargetStage}
                  onMoveJob={handleMoveJob}
                />
              </Box>
            </Box>
            <Drawer
              anchor="right"
              open={isDrawerOpen}
              onClose={handleDrawerClose}
              PaperProps={{
                id: "tag-drawer",
                sx: {
                  borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
                  width: isSmallScreen ? "100%" : 500,
                  maxWidth: "100%",
                  [theme.breakpoints.down("sm")]: {
                    width: "100%",
                  },
                },
              }}
            >
              <Box
                sx={{ borderRadius: isSmallScreen ? "0" : "15px" }}
                role="presentation"
              >
                <Box>
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "15px",
                      background: "#EEEEEE",
                    }}
                  >
                    <Typography variant="h6">
                      Add Job to{" "}
                      {selectedPipeline ? selectedPipeline.pipelineName : ""}
                    </Typography>
                    <IoClose
                      onClick={handleDrawerClose}
                      style={{ cursor: "pointer" }}
                    />
                  </Box>
                  <Box>
                    <AddJobs
                      stages={stages}
                      pipelineId={pipelineId}
                      handleDrawerClose={handleDrawerClose}
                      fetchJobData={fetchJobData}
                    />
                  </Box>
                </Box>
              </Box>
            </Drawer>
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Pipeline List
            </Typography>
            <TableContainer component={Paper}>
              <Table style={{ width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "16px",
                      }}
                      width="100"
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
                      Jobs
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "16px",
                      }}
                      width="100"
                    >
                      Schedule
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
                      End Date
                    </TableCell>
                    <TableCell
                      style={{
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "16px",
                      }}
                      width="100"
                    >
                      Setting
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pipelineData.map((pipeline, index) => (
                    <TableRow key={index} hover>
                      <TableCell
                        onClick={() => handleBoardsList(pipeline)}
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                          cursor: "pointer",
                          color: "#3f51b5",
                        }}
                      >
                        {pipeline.pipelineName}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}
                      ></TableCell>
                      <TableCell
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}
                      ></TableCell>
                      <TableCell
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}
                      ></TableCell>
                      <TableCell
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}
                      ></TableCell>
                      <TableCell
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}
                      >
                        <IconButton
                        // onClick={(event) => handleMenuClick(event, row.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </DndProvider>
  );
};

export default Pipeline;

{
  /* {automations.length > 0 ? (
            automations.map((automation, index) => (
              <Box key={index} sx={{ marginBottom: 2 }}>
                <Checkbox
                  checked={selectedAutomationIndices.includes(index)}
                  onChange={() => handleAutomationSelection(index)}
                />
                <Typography variant="body1"><strong>Type:</strong> {automation.type}</Typography>
                <Typography variant="body1"><strong>Template:</strong> {automation.template.label}</Typography>
                <Typography variant="body1"><strong>Tags:</strong></Typography>
                {automation.tags.map((tag) => (
                  <Box
                    key={tag._id}
                    sx={{
                      display: "inline-block",
                      backgroundColor: tag.tagColour,
                      color: "white",
                      borderRadius: "4px",
                      padding: "2px 6px",
                      marginRight: "4px",
                    }}
                  >
                    {tag.tagName}
                  </Box>
                ))}
              </Box>
            ))
          ) : (
            <Typography>No automations available</Typography>
          )} */
}
