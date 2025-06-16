// // AutomationDrawer.js
import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  Checkbox,
  Select,
  MenuItem,
  Chip,
  Alert,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";

// const AutomationDrawer = ({
//   open,
//   automations,
//   onClose,
//   onMoveJob,
//   jobId,
//   targetStage,
//   accountId,
//   accountName,
//   loginuserid,
//   username,
// }) => {
//   const ITEM_HEIGHT = 48;
//   const ITEM_PADDING_TOP = 8;
//   const MenuProps = {
//     PaperProps: {
//       style: {
//         maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//         width: "auto",
//       },
//     },
//   };

//   const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
//   const [tags, setTags] = useState([]);
//   const [accountTags, setAccountTags] = useState([]);
//   const [selectedAutomationIndices, setSelectedAutomationIndices] = useState([]);

//   // API endpoints
//   const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
//   const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
//   const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
//   const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
//   const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL;
//   const PROPOSAL_ACCOUNT_API = process.env.REACT_APP_PROPOSAL_URL;
//   const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
//   const AUTOMATION_API = process.env.REACT_APP_AUTOMATION_API;
//   const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
//   const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;
//   const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
//   const CLIENT_DOCS_API = process.env.REACT_APP_CLIENT_DOCS_MANAGE;

//     // fetch invoive temp by id
//     const fetchinvoicetempbyid = async (automationTemp) => {
//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };
//       const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${automationTemp}`;
//       try {
//         const response = await fetch(url, requestOptions); // Fetch the data
//         const result = await response.json(); // Parse the JSON response
//         console.log("Fetched invoice template:", result.invoiceTemplate);
//         return result.invoiceTemplate; // Return the data
//       } catch (error) {
//         console.error("Error fetching invoice template:", error);
//         throw error; // Let the calling function handle the error
//       }
//     };
//     // fetch chat temp by id
//     const fetchchattempbyid = async (automationTemp) => {
//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };
//       const url = `${CHAT_API}/workflow/chats/chattemplate/chattemplateList/${automationTemp}`;
//       try {
//         const response = await fetch(url, requestOptions); // Fetch the data
//         const result = await response.json(); // Parse the JSON response
//         console.log("Fetched chat template:", result.chatTemplate);
//         return result.chatTemplate; // Return the data
//       } catch (error) {
//         console.error("Error fetching invoice template:", error);
//         throw error; // Let the calling function handle the error
//       }
//     };
//     // fetch task temp by id
 
//     const fetchtasktempbyid = async (automationTemp) => {
//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };
//       const url = `${TASK_API}/workflow/tasks/tasktemplate/tasktemplatebyid/${automationTemp}`;
//       try {
//         const response = await fetch(url, requestOptions); // Fetch the data
//         const result = await response.json(); // Parse the JSON response
//         console.log("Fetched task template:", result.taskTemplate);
//         return result.taskTemplate; // Return the data
//       } catch (error) {
//         console.error("Error fetching invoice template:", error);
//         throw error; // Let the calling function handle the error
//       }
//     };
//     // fetch proposal temp by id
//     const fetchproposalbyid = async (automationTemp) => {
//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };
//       const url = `${PROPOSAL_API}/workflow/proposalesandels/proposalesandels/${automationTemp}`;
//       try {
//         const response = await fetch(url, requestOptions); // Fetch the data
//         const result = await response.json(); // Parse the JSON response
//         console.log(
//           "Fetched proposalsels template:",
//           result.proposalesAndElsTemplate
//         );
//         return result.proposalesAndElsTemplate; // Return the data
//       } catch (error) {
//         console.error("Error fetching proposal template:", error);
//         throw error; // Let the calling function handle the error
//       }
//     };
//     // fetch organizer temp by id
//     const fetchorganizertempbyid = async (automationTemp) => {
//       const requestOptions = {
//         method: "GET",
//         redirect: "follow",
//       };
//       const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${automationTemp}`;

//       try {
//         const response = await fetch(url, requestOptions); // Fetch the data
//         const result = await response.json(); // Parse the JSON response
//         console.log("Fetched organizer template:", result.organizerTemplate);
//         return result.organizerTemplate; // Return the data
//       } catch (error) {
//         console.error("Error fetching organizer template:", error);
//         throw error; // Let the calling function handle the error
//       }
//     };
//     const selectAutomationApi = async (
//       automationType,
//       automationTemp,
//       automationAccountId,
//       automation
//     ) => {
//       if (!automationType || !automationAccountId) {
//         console.error("Missing required parameters");
//         return;
//       }

//       switch (automationType) {
        
//         case "Update account tags":
//           console.log(
//             `Updating account tags for Account ID: ${automationAccountId}`
//           );

//           try {
//             // Fetch the current account data
//             const response = await fetch(
//               `${ACCOUNT_API}/accounts/accountdetails/${automationAccountId}`
//             );
//             if (!response.ok) throw new Error("Failed to fetch account data");

//             const accountsData = await response.json();
//             let currentTags = accountsData.account.tags || []; // Existing tag IDs

//             // Extract tag IDs from automation object
//             const addTagIds = automation?.addTags?.map((tag) => tag._id) || [];
//             const removeTagIds =
//               automation?.removeTags?.map((tag) => tag._id) || [];

//             console.log("Current Tags:", currentTags);
//             console.log("Tags to Add:", addTagIds);
//             console.log("Tags to Remove:", removeTagIds);

//             // Remove tags that match `removeTags`
//             let updatedTags = currentTags.filter(
//               (tagId) => !removeTagIds.includes(tagId)
//             );

//             // Add new tags without duplication
//             updatedTags = [...new Set([...updatedTags, ...addTagIds])];

//             console.log("Final Updated Tags:", updatedTags);

//             // Send updated tags back to the server
//             const updateResponse = await fetch(
//               `${ACCOUNT_API}/accounts/accountdetails/updateaccounttags/${automationAccountId}`,
//               {
//                 method: "PATCH",
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ tags: updatedTags }),
//               }
//             );

//             console.log("PATCH Response Status:", updateResponse.status);
//             console.log("PATCH Response OK:", updateResponse.ok);

//             const updateResponseData = await updateResponse.json();
//             console.log("PATCH Response Data:", updateResponseData);

//             if (!updateResponse.ok)
//               throw new Error("Failed to update account tags");

//             console.log("Account tags updated successfully");
//           } catch (error) {
//             console.error("Error updating account tags:", error);
//           }
//           break;
//         // Other automation cases (unchanged)
//         case "Send Invoice":
//           console.log(
//             `Processing 'Send Invoice' with template: ${automationTemp}, Account ID: ${automationAccountId}`
//           );
//           try {
//             const invoiceData = await fetchinvoicetempbyid(automationTemp);
//             console.log("Fetched invoice data", invoiceData);
//             assignInvoiceToAccount(
//               invoiceData,
//               automationTemp,
//               automationAccountId
//             );
//           } catch (error) {
//             console.error("Error processing 'Send Invoice':", error);
//           }
//           break;
//         case "Send message":
//           console.log(
//             `Processing 'Send message' with template: ${automationTemp}, Account ID: ${automationAccountId}`
//           );
//           try {
//             const chatData = await fetchchattempbyid(automationTemp);
//             console.log("Fetched chat data", chatData);
//             sendChatToAccount(chatData, automationTemp, automationAccountId);
//           } catch (error) {
//             console.error("Error processing 'Send Invoice':", error);
//           }
//           break;
//         case "Create Task":
//           console.log(
//             `Processing 'Create Task' with template: ${automationTemp}, Account ID: ${automationAccountId}`
//           );
//           try {
//             const taskData = await fetchtasktempbyid(automationTemp);
//             console.log("Fetched task temp data", taskData);
//             assignTaskToAccount(taskData, automationTemp, automationAccountId);
//           } catch (error) {
//             console.error("Error processing 'Create Task':", error);
//           }
//           break;
//         case "Apply folder template":
//           console.log(
//             `Applying folder template with template: ${automationTemp}, Account ID: ${automationAccountId}`
//           );
//           try {
//             await assignfoldertemp(automationAccountId, automationTemp);
//             console.log("Folder template assigned successfully");
//           } catch (error) {
//             console.error("Error applying folder template:", error);
//           }
//           break;

//         case "Create Organizer":
//           console.log(
//             `Processing 'Create Organizer' with template: ${automationTemp}, Account ID: ${automationAccountId}`
//           );
//           try {
//             const organizerData = await fetchorganizertempbyid(automationTemp);
//             console.log("Fetched organizer data", organizerData);
//             assignOrganizerToAccount(
//               organizerData,
//               automationTemp,
//               automationAccountId
//             );
//           } catch (error) {
//             console.error("Error processing 'Create Organizer':", error);
//           }
//           break;

//         case "Send Proposal/Els":
//           console.log(
//             `Creating Proposals with template: ${automationTemp}, Account ID: ${automationAccountId}`
//           );
//           try {
//             const proposalData = await fetchproposalbyid(automationTemp);
//             console.log("Fetched Proposals data", proposalData);
//             assignProposalToAccount(
//               proposalData,
//               automationTemp,
//               automationAccountId
//             );
//           } catch (error) {
//             console.error("Error processing 'Send Proposal/Els':", error);
//           }
//           break;

//         case "Send Email":
//           console.log(
//             `Sending email with template: ${automationTemp}, Account ID: ${automationAccountId}`
//           );
//           const myHeaders = new Headers();
//           myHeaders.append("Content-Type", "application/json");

//           const raw = JSON.stringify({
//             automationType,
//             templateId: automationTemp,
//             accountId: automationAccountId,
//           });

//           const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: raw,
//             redirect: "follow",
//           };

//           fetch(`${AUTOMATION_API}/automations/`, requestOptions)
//             .then((response) => response.json())
//             .then((result) => console.log(result))
//             .catch((error) => console.error(error));
//           break;

//         default:
//           console.warn(`Unhandled automation type: ${automationType}`);
//           break;
//       }
//     };

//         const assignInvoiceToAccount = (
//           invoiceData,
//           automationTemp,
//           automationAccountId
//         ) => {
//           console.log(
//             "Assigning invoice",
//             invoiceData,
//             automationTemp,
//             automationAccountId
//           );
    
//           const myHeaders = new Headers();
//           myHeaders.append("Content-Type", "application/json");
    
//           // Dynamically prepare the payload from invoiceData
//           const raw = JSON.stringify({
//             account: automationAccountId,
//             invoicenumber: "", // Fill in if required
//             invoicedate: getCurrentDate(), // Today's date
//             description: invoiceData.description || "",
//             invoicetemplate: automationTemp,
//             paymentMethod: invoiceData.paymentMethod || "",
//             teammember: loginuserid, // Fill in if required
//             payInvoicewithcredits: invoiceData.payInvoicewithcredits || false,
//             emailinvoicetoclient: invoiceData.sendEmailWhenInvCreated || false,
//             reminders: invoiceData.sendReminderstoClients || false,
//             daysuntilnextreminder: invoiceData.daysuntilnextreminder || null,
//             numberOfreminder: invoiceData.numberOfreminder || null,
//             scheduleinvoice: false, // Optional, adjust as needed
//             scheduleinvoicedate: new Date(), // Current date and time
//             scheduleinvoicetime: new Date().toLocaleTimeString("en-US", {
//               hour12: false,
//             }),
//             lineItems: invoiceData.lineItems.map((item) => ({
//               productorService: item.productorService || "",
//               description: item.description || "",
//               rate: item.rate || "",
//               quantity: item.quantity || "",
//               amount: item.amount || "",
//               tax: item.tax || false,
//             })),
//             summary: {
//               subtotal: invoiceData.summary.subtotal || "",
//               taxRate: invoiceData.summary.taxRate || "",
//               taxTotal: invoiceData.summary.taxTotal || "",
//               total: invoiceData.summary.total || "",
//             },
//             paidAmount: "",
//             invoiceStatus: "Pending",
//             balanceDueAmount: "",
//           });
    
//           const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: raw,
//             redirect: "follow",
//           };
//           fetch(`${INVOICE_NEW}/workflow/invoices/invoice`, requestOptions)
//             .then((response) => response.json())
//             .then((result) => console.log("Invoice assigned successfully:", result))
//             .catch((error) => console.error("Error assigning invoice:", error));
//         };
    
//         const [chatId, setChatId] = useState();
//         // sendChatToAccount
//         const sendChatToAccount = (
//           chatData,
//           automationTemp,
//           automationAccountId
//         ) => {
//           console.log(
//             "sending chat",
//             chatData,
//             automationTemp,
//             automationAccountId
//           );
    
//           const myHeaders = new Headers();
//           myHeaders.append("Content-Type", "application/json");
//           const subtaskData = chatData.clienttasks.map(({ id, text, checked }) => ({
//             id,
//             text,
//             checked: checked !== undefined ? checked : false, // Ensure checked is either true or false
//           }));
//           const messageData = [
//             {
//               message: chatData.description,
//               fromwhome: "Admin",
//                 senderid: loginuserid,
//               isRead:false
//             },
//           ];
//           // Dynamically prepare the payload from invoiceData
//           const raw = JSON.stringify({
//             accountids: [automationAccountId],
//             chattemplateid: automationTemp, // Fill in if required
//             chatsubject: chatData.chatsubject, // Today's date
//             description: messageData || "",
//             sendreminderstoclient: chatData.sendreminderstoclient,
//             daysuntilnextreminder: chatData.daysuntilnextreminder,
//             numberofreminders: chatData.numberofreminders,
//             clienttasks: subtaskData,
//           });
//           console.log("chats", raw);
//           const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: raw,
//             redirect: "follow",
//           };
//           fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise`, requestOptions)
//             .then((response) => response.json())
//             .then((result) => {
//               console.log("send chat to account successfully:", result);
//               // console.log("chat id", result.newChats._id);
//               // setChatId(result.newChats._id);
//               toast.success("New Chat created successfully");
//               // sendSaveChatMail(result.newChats._id);
//             })
//             .catch((error) => console.error("Error assigning invoice:", error));
//         };
//         // mail for drawer btn
//         const sendSaveChatMail = (chatId) => {
//           const myHeaders = new Headers();
//           myHeaders.append("Content-Type", "application/json");
    
//           const raw = JSON.stringify({
//             accountid: automationAccountId,
//             chattemplateid: automationTemp,
//             username: username,
//             chatId: chatId,
//             viewchatlink: "/login",
//           });
    
//           const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: raw,
//             redirect: "follow",
//           };
//           console.log(raw);
//           fetch(`${CHATTOCLIENT_API}/chatsend/securechatsend`, requestOptions)
//             .then((response) => response.json())
//             .then((result) => console.log(result))
//             .catch((error) => console.error(error));
//         };
    
//         const assignTaskToAccount = (
//           taskData,
//           automationTemp,
//           automationAccountId
//         ) => {
//           console.log(
//             "Assigning task",
//             taskData,
//             automationTemp,
//             automationAccountId
//           );
    
//           const myHeaders = new Headers();
//           myHeaders.append("Content-Type", "application/json");
    
//           // const subtaskData = subtasks.map(({ id, text }) => ({
//           //     id,
//           //     text,
    
//           //     checked: checkedSubtasks.includes(id), // Check if ID is in the checkedSubtasks array
//           //   }));
    
//           const raw = JSON.stringify({
//             accounts: automationAccountId,
//             job: jobId,
//             templatename: automationTemp,
//             taskname: taskData.templatename,
//             status: taskData.status,
//             taskassignees: taskData.taskassignees,
//             priority: taskData.priority,
//             description: taskData.description,
//             tasktags: taskData.tasktags,
//             issubtaskschecked: taskData.issubtaskschecked,
//             startdate: taskData.startdate,
//             enddate: taskData.enddate,
//             subtasks: taskData.subtasks,
//           });
//           console.log(raw);
//           const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: raw,
//             redirect: "follow",
//           };
    
//           fetch(`${ACCOUNT_TASKS_API}/accountstasks/newtask`, requestOptions)
//             .then((response) => response.json())
//             .then((result) => {
//               console.log("task created", result);
//               // onClose()
//             })
//             .catch((error) => console.error(error));
//         };
    
//         const assignProposalToAccount = (
//           proposalesandelsData,
//           automationTemp,
//           automationAccountId
//         ) => {
//           console.log(
//             "Assigning proposal",
//             proposalesandelsData,
//             automationTemp,
//             automationAccountId
//           );
//           const options = {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               accountids: [automationAccountId],
//               proposaltemplateid: automationTemp,
//               templatename: proposalesandelsData.templatename,
//               teammember: proposalesandelsData.teammember,
//               proposalname: proposalesandelsData.proposalname,
//               introduction: proposalesandelsData.introduction,
//               terms: proposalesandelsData.terms,
//               servicesandinvoices: proposalesandelsData.servicesandinvoices,
//               introductiontext: proposalesandelsData.introductiontext,
//               custommessageinemail: proposalesandelsData.custommessageinemail,
//               custommessageinemailtext:
//                 proposalesandelsData.custommessageinemailtext,
//               reminders: proposalesandelsData.reminders,
//               daysuntilnextreminder: proposalesandelsData.daysuntilnextreminder,
//               numberofreminder: proposalesandelsData.numberofreminder,
//               introductiontextname: proposalesandelsData.introductiontextname,
//               termsandconditionsname: proposalesandelsData.termsandconditionsname,
//               termsandconditions: proposalesandelsData.termsandconditions,
//               lineItems: proposalesandelsData.lineItems,
//               summary: proposalesandelsData.summary,
//               Addinvoiceoraskfordeposit:
//                 proposalesandelsData.Addinvoiceoraskfordeposit,
//               Additemizedserviceswithoutcreatinginvoices:
//                 proposalesandelsData.Additemizedserviceswithoutcreatinginvoices,
//               invoicetemplatename: proposalesandelsData.invoicetemplatename,
//               invoiceteammember: proposalesandelsData.invoiceteammember,
//               issueinvoice: proposalesandelsData.issueinvoice,
//               specificdate: proposalesandelsData.specificdate,
//               specifictime: proposalesandelsData.specifictime,
//               description: proposalesandelsData.description,
//               notetoclient: proposalesandelsData.notetoclient,
//               paymentterms: proposalesandelsData.paymentterms,
//               paymentduedate: proposalesandelsData.paymentduedate,
//               paymentamount: proposalesandelsData.paymentamount,
//                  status:'Pending',
//               active: true,
//             }),
//           };
//           const url = `${PROPOSAL_ACCOUNT_API}/proposalandels/proposalaccountwise/`;
//           console.log(url); // Log the URL for debugging
//           console.log(options.body); // Log request body for debugging
//           fetch(url, options)
//             .then((response) => {
//               if (!response.ok) {
//                 throw new Error(`Request failed with status ${response.status}`);
//               }
//               return response.json();
//             })
//             .then((result) => {
//               console.log(result);
//             })
//             .catch((error) => {
//               console.error("Fetch Error:", error);
//               // toast.error("An error occurred while updating ProposalesAndEls.");
//             });
//         };
//         const assignOrganizerToAccount = (
//           organizerData,
//           automationTemp,
//           automationAccountId
//         ) => {
//           console.log(
//             "Assigning proposal",
//             organizerData,
//             automationTemp,
//             automationAccountId
//           );
//           const myHeaders = new Headers();
//           myHeaders.append("Content-Type", "application/json");
//           const raw = JSON.stringify({
//             accountid: automationAccountId,
//             organizertemplateid: automationTemp,
//                organizerName: organizerData.organizerName,
//             reminders: organizerData.reminders,
//             noofreminders: organizerData.noOfReminder,
//             daysuntilnextreminder: organizerData.daysuntilNextReminder,
//             sections: organizerData.sections,
//             status: "Pending",
//             active: true,
//           });
//           const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: raw,
//             redirect: "follow",
//           };
//           console.log(raw);
//           const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/org`;
//           fetch(url, requestOptions)
//             .then((response) => response.json())
//             .then((result) => {
//               console.log(result);
//             })
//             .catch((error) => console.error(error));
//         };
    
        
//         const assignfoldertemp = (automationAccountId, automationTemp) => {
//           const myHeaders = new Headers();
//           myHeaders.append("Content-Type", "application/json");
    
//           const raw = JSON.stringify({
//             accountId: automationAccountId,
//             foldertempId: automationTemp,
//           });
    
//           const requestOptions = {
//             method: "POST",
//             headers: myHeaders,
//             body: raw,
//             redirect: "follow",
//           };
    
//           console.log(raw);
//           fetch(`${CLIENT_DOCS_API}/clientdocs/accountfoldertemp`, requestOptions)
//             .then((response) => response.json())
//             .then((result) => console.log(result))
//             .catch((error) => console.error(error));
//         };
//   // Fetch tags and account tags on mount
//   useEffect(() => {
//     fetchTags();
//     AccountsTag(accountId);
//   }, [accountId]);

//   // Select all automations by default
//   useEffect(() => {
//     if (automations.length > 0) {
//       setSelectedAutomationIndices(automations.map((_, index) => index));
//     }
//   }, [automations]);

//   const fetchTags = async () => {
//     try {
//       const url = `${TAGS_API}/tags/`;
//       const response = await fetch(url);
//       const data = await response.json();
//       setTags(data.tags);
//     } catch (error) {
//       console.error("Error fetching tags:", error);
//     }
//   };

//   const AccountsTag = async (accountId) => {
//     try {
//       const response = await fetch(
//         `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyid/${accountId}`
//       );
//       const result = await response.json();
//       if (result.accountlist?.Tags) {
//         setAccountTags(result.accountlist.Tags);
//       }
//     } catch (error) {
//       console.error("Error fetching account tags:", error);
//     }
//   };

//   const handleAutomationSelection = (index) => {
//     setSelectedAutomationIndices((prevSelected) =>
//       prevSelected.includes(index)
//         ? prevSelected.filter((i) => i !== index)
//         : [...prevSelected, index]
//     );
//   };

//    const getCurrentDate = () => {
//       const today = new Date();
//       const year = today.getFullYear();
//       const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
//       const day = String(today.getDate()).padStart(2, "0");
//       return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
//     };
  

//   const handleMoveWithAutomations = async () => {
//     const selectedAutomations = selectedAutomationIndices
//       .map((index) => automations[index])
//       .filter((automation) => {
//         if (!automation.tags || automation.tags.length === 0) return true;
//         return automation.tags.some((tag) =>
//           accountTags.some((accountTag) => accountTag._id === tag._id)
//         );
//       });

//     const clientStatusAutomation = selectedAutomations.find(
//       (a) => a.type === "Update client-facing job status"
//     );
//     const assigneeAutomation = selectedAutomations.find(
//       (a) => a.type === "Update job assignees"
//     );

//     // Process all selected automations
//     for (const automation of selectedAutomations) {
//       try {
//         await selectAutomationApi(
//           automation.type,
//           automation.template?.value,
//           accountId,
//           automation
//         );
//       } catch (error) {
//         console.error("Error processing automation:", error);
//       }
//     }

//     onMoveJob(jobId, targetStage, {
//       clientStatus: clientStatusAutomation,
//       assignees: assigneeAutomation
//     });
//     onClose();
//   };

//   return (
//     <Drawer anchor="right" open={open} onClose={onClose}>
//       <Box sx={{ width: 500, padding: 2 }}>
//         <Typography variant="h6">Automations for {accountName}</Typography>

//         {automations.length > 0 ? (
//           automations.map((automation, index) => {
//             const hasMatchingTags = automation.tags?.length
//               ? automation.tags.some((automationTag) =>
//                   accountTags.some(
//                     (accountTag) => accountTag._id === automationTag._id
//                   )
//                 )
//               : true;
              
//             return (
//               <Box key={index} sx={{ marginBottom: 2 }}>
                
//               </Box>
//             );
//           })
//         ) : (
//           <Typography>No automations available</Typography>
//         )}

//         <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
//           <Button
//             onClick={handleMoveWithAutomations}
//             variant="contained"
//             color="primary"
//           >
//             Move
//           </Button>
//           <Button
//             onClick={onClose}
//             variant="outlined"
//           >
//             Close
//           </Button>
//         </Box>
//       </Box>
//     </Drawer>
//   );
// };

// export default AutomationDrawer;

const AutomationDrawer = ({
  open,
  automations,
  onClose,
  onMoveJob,
  jobId,
  targetStage,
  accountId,
  accountName,
  loginuserid,
  username,
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
  const [accountTags, setAccountTags] = useState([]);
  const [selectedAutomationIndices, setSelectedAutomationIndices] = useState([]);

  // API endpoints
  const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
  const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
  const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
  const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL;
  const PROPOSAL_ACCOUNT_API = process.env.REACT_APP_PROPOSAL_URL;
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const AUTOMATION_API = process.env.REACT_APP_AUTOMATION_API;
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;
  const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
  const CLIENT_DOCS_API = process.env.REACT_APP_CLIENT_DOCS_MANAGE;

  // Fetch tags and account tags on mount
  useEffect(() => {
    fetchTags();
    AccountsTag(accountId);
  }, [accountId]);

  // Select all automations by default
  useEffect(() => {
    if (automations.length > 0) {
      setSelectedAutomationIndices(automations.map((_, index) => index));
    }
  }, [automations]);

  const fetchTags = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const AccountsTag = async (accountId) => {
    try {
      const response = await fetch(
        `${ACCOUNT_API}/accounts/accountdetails/accountdetailslist/listbyid/${accountId}`
      );
      const result = await response.json();
      if (result.accountlist?.Tags) {
        setAccountTags(result.accountlist.Tags);
      }
    } catch (error) {
      console.error("Error fetching account tags:", error);
    }
  };

  const handleAutomationSelection = (index) => {
    setSelectedAutomationIndices((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Fetch functions (unchanged from your original code)
  const fetchinvoicetempbyid = async (templateId) => {
    const response = await fetch(`${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${templateId}`);
    const result = await response.json();
    return result.invoiceTemplate;
  };

  const fetchchattempbyid = async (templateId) => {
    const response = await fetch(`${CHAT_API}/workflow/chats/chattemplate/chattemplateList/${templateId}`);
    const result = await response.json();
    return result.chatTemplate;
  };

  const fetchtasktempbyid = async (templateId) => {
    const response = await fetch(`${TASK_API}/workflow/tasks/tasktemplate/tasktemplatebyid/${templateId}`);
    const result = await response.json();
    return result.taskTemplate;
  };

  const fetchproposalbyid = async (templateId) => {
    const response = await fetch(`${PROPOSAL_API}/workflow/proposalesandels/proposalesandels/${templateId}`);
    const result = await response.json();
    return result.proposalesAndElsTemplate;
  };

  const fetchorganizertempbyid = async (templateId) => {
    const response = await fetch(`${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${templateId}`);
    const result = await response.json();
    return result.organizerTemplate;
  };

  // Action functions - updated to use parameters instead of undefined variables
  const assignInvoiceToAccount = (invoiceData, templateId, accountId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      account: accountId,
      invoicenumber: "",
      invoicedate: getCurrentDate(),
      description: invoiceData.description || "",
      invoicetemplate: templateId,
      paymentMethod: invoiceData.paymentMethod || "",
      teammember: loginuserid,
      payInvoicewithcredits: invoiceData.payInvoicewithcredits || false,
      emailinvoicetoclient: invoiceData.sendEmailWhenInvCreated || false,
      reminders: invoiceData.sendReminderstoClients || false,
      daysuntilnextreminder: invoiceData.daysuntilnextreminder || null,
      numberOfreminder: invoiceData.numberOfreminder || null,
      scheduleinvoice: false,
      scheduleinvoicedate: new Date(),
      scheduleinvoicetime: new Date().toLocaleTimeString("en-US", { hour12: false }),
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

  const sendChatToAccount = (chatData, templateId, accountId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const subtaskData = chatData.clienttasks.map(({ id, text, checked }) => ({
      id,
      text,
      checked: checked !== undefined ? checked : false,
    }));
    
    const messageData = [
      {
        message: chatData.description,
        fromwhome: "Admin",
        senderid: loginuserid,
        isRead: false
      },
    ];

    const raw = JSON.stringify({
      accountids: [accountId],
      chattemplateid: templateId,
      chatsubject: chatData.chatsubject,
      description: messageData || "",
      sendreminderstoclient: chatData.sendreminderstoclient,
      daysuntilnextreminder: chatData.daysuntilnextreminder,
      numberofreminders: chatData.numberofreminders,
      clienttasks: subtaskData,
    });

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
        toast.success("New Chat created successfully");
      })
      .catch((error) => console.error("Error assigning invoice:", error));
  };

 

  const assignTaskToAccount = (taskData, templateId, accountId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accounts: accountId,
      job: jobId,
      templatename: templateId,
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

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_TASKS_API}/accountstasks/newtask`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log("task created", result))
      .catch((error) => console.error(error));
  };

  const assignProposalToAccount = (proposalesandelsData, templateId, accountId) => {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountids: [accountId],
        proposaltemplateid: templateId,
        templatename: proposalesandelsData.templatename,
        teammember: proposalesandelsData.teammember,
        proposalname: proposalesandelsData.proposalname,
        introduction: proposalesandelsData.introduction,
        terms: proposalesandelsData.terms,
        servicesandinvoices: proposalesandelsData.servicesandinvoices,
        introductiontext: proposalesandelsData.introductiontext,
        custommessageinemail: proposalesandelsData.custommessageinemail,
        custommessageinemailtext: proposalesandelsData.custommessageinemailtext,
        reminders: proposalesandelsData.reminders,
        daysuntilnextreminder: proposalesandelsData.daysuntilnextreminder,
        numberofreminder: proposalesandelsData.numberofreminder,
        introductiontextname: proposalesandelsData.introductiontextname,
        termsandconditionsname: proposalesandelsData.termsandconditionsname,
        termsandconditions: proposalesandelsData.termsandconditions,
        lineItems: proposalesandelsData.lineItems,
        summary: proposalesandelsData.summary,
        Addinvoiceoraskfordeposit: proposalesandelsData.Addinvoiceoraskfordeposit,
        Additemizedserviceswithoutcreatinginvoices: proposalesandelsData.Additemizedserviceswithoutcreatinginvoices,
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
        status: 'Pending',
        active: true,
      }),
    };

    fetch(`${PROPOSAL_ACCOUNT_API}/proposalandels/proposalaccountwise/`, options)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        return response.json();
      })
      .then((result) => console.log(result))
      .catch((error) => console.error("Fetch Error:", error));
  };

  const assignOrganizerToAccount = (organizerData, templateId, accountId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    const raw = JSON.stringify({
      accountid: accountId,
      organizertemplateid: templateId,
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

    fetch(`${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/org`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  const assignfoldertemp = (accountId, templateId) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      accountId: accountId,
      foldertempId: templateId,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${CLIENT_DOCS_API}/clientdocs/accountfoldertemp`, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  const selectAutomationApi = async (automationType, templateId, accountId, automation) => {
    if (!automationType || !accountId) {
      console.error("Missing required parameters");
      return;
    }

    switch (automationType) {
      case "Update account tags":
        try {
          const response = await fetch(`${ACCOUNT_API}/accounts/accountdetails/${accountId}`);
          if (!response.ok) throw new Error("Failed to fetch account data");

          const accountsData = await response.json();
          let currentTags = accountsData.account.tags || [];

          const addTagIds = automation?.addTags?.map((tag) => tag._id) || [];
          const removeTagIds = automation?.removeTags?.map((tag) => tag._id) || [];

          let updatedTags = currentTags.filter((tagId) => !removeTagIds.includes(tagId));
          updatedTags = [...new Set([...updatedTags, ...addTagIds])];

          const updateResponse = await fetch(
            `${ACCOUNT_API}/accounts/accountdetails/updateaccounttags/${accountId}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ tags: updatedTags }),
            }
          );

          if (!updateResponse.ok) throw new Error("Failed to update account tags");
          console.log("Account tags updated successfully");
        } catch (error) {
          console.error("Error updating account tags:", error);
        }
        break;

      case "Send Invoice":
        try {
          const invoiceData = await fetchinvoicetempbyid(templateId);
          assignInvoiceToAccount(invoiceData, templateId, accountId);
        } catch (error) {
          console.error("Error processing 'Send Invoice':", error);
        }
        break;

      case "Send message":
        try {
          const chatData = await fetchchattempbyid(templateId);
          sendChatToAccount(chatData, templateId, accountId);
        } catch (error) {
          console.error("Error processing 'Send message':", error);
        }
        break;

      case "Create Task":
        try {
          const taskData = await fetchtasktempbyid(templateId);
          assignTaskToAccount(taskData, templateId, accountId);
        } catch (error) {
          console.error("Error processing 'Create Task':", error);
        }
        break;

      case "Apply folder template":
        try {
          await assignfoldertemp(accountId, templateId);
          console.log("Folder template assigned successfully");
        } catch (error) {
          console.error("Error applying folder template:", error);
        }
        break;

      case "Create Organizer":
        try {
          const organizerData = await fetchorganizertempbyid(templateId);
          assignOrganizerToAccount(organizerData, templateId, accountId);
        } catch (error) {
          console.error("Error processing 'Create Organizer':", error);
        }
        break;

      case "Send Proposal/Els":
        try {
          const proposalData = await fetchproposalbyid(templateId);
          assignProposalToAccount(proposalData, templateId, accountId);
        } catch (error) {
          console.error("Error processing 'Send Proposal/Els':", error);
        }
        break;

      case "Send Email":
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          automationType,
          templateId: templateId,
          accountId: accountId,
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

  const handleMoveWithAutomations = async () => {
    const selectedAutomations = selectedAutomationIndices
      .map((index) => automations[index])
      .filter((automation) => {
        if (!automation.tags || automation.tags.length === 0) return true;
        return automation.tags.some((tag) =>
          accountTags.some((accountTag) => accountTag._id === tag._id)
        );
      });

    const clientStatusAutomation = selectedAutomations.find(
      (a) => a.type === "Update client-facing job status"
    );
    const assigneeAutomation = selectedAutomations.find(
      (a) => a.type === "Update job assignees"
    );

    for (const automation of selectedAutomations) {
      try {
        await selectAutomationApi(
          automation.type,
          automation.template?.value,
          accountId,
          automation
        );
      } catch (error) {
        console.error("Error processing automation:", error);
      }
    }

    onMoveJob(jobId, targetStage, {
      clientStatus: clientStatusAutomation,
      assignees: assigneeAutomation
    });
    onClose();
  };


  

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 500, padding: 2 }}>
        <Typography variant="h6">Automations for {accountName}</Typography>

        {automations.length > 0 ? (
          automations.map((automation, index) => {
            const hasMatchingTags = automation.tags?.length
              ? automation.tags.some((automationTag) =>
                  accountTags.some((accountTag) => accountTag._id === automationTag._id)
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
                                   {/* <Box sx={{ width: 500 }}>
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
                                    
                                     <Alert severity="warning" sx={{ marginBottom: 2 }}>
                                       This automation can affect conditions for automations
                                       below
                                     </Alert>
                                   </Box> */}
                                 </Box>
                               ) : automation.type === "Update job assignees" ? (
                                         <Box>
                                           {/* <Box sx={{ width: 500 }}>
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
                                           </Box> */}
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
          <Button
            onClick={handleMoveWithAutomations}
            variant="contained"
            color="primary"
          >
            Move
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
          >
            Close
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AutomationDrawer;