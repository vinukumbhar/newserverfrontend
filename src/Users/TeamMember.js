import { Box, Button, InputLabel, TextField, Divider, Select, MenuItem } from "@mui/material";
import { NavLink, Outlet } from "react-router-dom";
import Switch from "react-switch";
import React, { useState, useContext, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import { useTheme, useMediaQuery, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import { SlQuestion } from "react-icons/sl";
import { ToastContainer, toast } from "react-toastify";
import { LoginContext } from "../Sidebar/Context/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { unstable_ClassNameGenerator as ClassNameGenerator } from "@mui/material/className"; //autoclassnameGenerator
ClassNameGenerator.configure((componentName) => `foo-bar-${componentName}`); //autoclassnameGenerator

const TeamMember = () => {
  const navigate = useNavigate();
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const WINDOWS_PORT = process.env.REACT_APP_SERVER_URI;
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const fetchData = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const url = `${LOGIN_API}/admin/teammember/teammemberlist/list/true`;

      const response = await fetch(url, requestOptions);
      const result = await response.json();

      setTeamMembers(result.teamMemberslist);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const handleNewDrawerClose = () => {
    setIsNewDrawerOpen(false);
  };
  //Integration
  const [isCheckedPayments, setIsCheckedPayments] = useState(false);
  const [isCheckedPipelines, setIsCheckedPipelines] = useState(false);
  const [isCheckedTimeEntries, setIsCheckedTimeEntries] = useState(false);
  const [isCheckedAccounts, setIsCheckedAccounts] = useState(false);
  const [isCheckedTags, setIsCheckedTags] = useState(false);
  const [isCheckedOrganizers, setIsCheckedOrganizers] = useState(false);
  const [isCheckedFirmBalance, setIsCheckedFirmBalance] = useState(false);
  const [isCheckedContacts, setIsCheckedContacts] = useState(false);
  const [isCheckedSite, setIsCheckedSite] = useState(false);
  const [isCheckedServices, setIsCheckedServices] = useState(false);
  const [isCheckedFilterTemplates, setIsCheckedFilterTemplates] = useState(false);
  const [isCheckedTemplates, setIsCheckedTemplates] = useState(false);
  const [isCheckedMarketplace, setIsCheckedMarketplace] = useState(false);
  const [isCheckedInvoices, setIsCheckedInvoices] = useState(false);
  const [isCheckedJobRecurrences, setIsCheckedJobRecurrences] = useState(false);
  const [isCheckedRatesTimeEntries, setIsCheckedRatesTimeEntries] = useState(false);
  const [isCheckedAllAccounts, setIsCheckedAllAccounts] = useState(false);
  const [isCheckedCustomFields, setIsCheckedCustomFields] = useState(false);
  const [isCheckedAllContacts, setIsCheckedAllContacts] = useState(false);
  const [isCheckedTeammates, setIsCheckedTeammates] = useState(false);
  const [isCheckedProposals, setIsCheckedProposals] = useState(false);
  const [isCheckedViewReporting, setIsCheckedViewReporting] = useState(false);
  const [isCheckedEmail, setIsCheckedEmail] = useState(false);
  const [isCheckedTranscripts, setIsCheckedTranscripts] = useState(false);
  const [isCheckedOrgnizerAnswers, setIsCheckedOrgnizerAnswers] = useState(false);
  const [isCheckedDocuments, setIsCheckedDocuments] = useState(false);




  const handleSwitchViewReporting = (checked) => {
    setIsCheckedViewReporting(checked);
  };
  const handleSwitchTranscripts = (checked) => {
    setIsCheckedTranscripts(checked);
  };
  const handleSwitchDocuments = (checked) => {
    setIsCheckedDocuments(checked);
  };
  const handleSwitchOrgnizerAnswers = (checked) => {
    setIsCheckedOrgnizerAnswers(checked);
  };
  const handleSwitchEmail = (checked) => {
    setIsCheckedEmail(checked);
  };
  const handleSwitchProposals = (checked) => {
    setIsCheckedProposals(checked);
  };
  const handleSwitchAllContacts = (checked) => {
    setIsCheckedAllContacts(checked);
  };
  const handleSwitchTeammates = (checked) => {
    setIsCheckedTeammates(checked);
  };
  const handleSwitchCustomFields = (checked) => {
    setIsCheckedCustomFields(checked);
  };
  const handleSwitchAllAccounts = (checked) => {
    setIsCheckedAllAccounts(checked);
  };
  const handleSwitchRatesTimeEntries = (checked) => {
    setIsCheckedRatesTimeEntries(checked);
  };
  const handleSwitchJobRecurrences = (checked) => {
    setIsCheckedJobRecurrences(checked);
  };
  const handleSwitchInvoices = (checked) => {
    setIsCheckedInvoices(checked);
  };
  const handleSwitchSite = (checked) => {
    setIsCheckedSite(checked);
  };
  const handleSwitchServices = (checked) => {
    setIsCheckedServices(checked);
  };
  const handleSwitchFilterTemplates = (checked) => {
    setIsCheckedFilterTemplates(checked);
  };
  const handleSwitchTemplates = (checked) => {
    setIsCheckedTemplates(checked);
    // updateSidebarData()
  };
  const handleSwitchMarketplace = (checked) => {
    setIsCheckedMarketplace(checked);
  };
  const handleSwitchContacts = (checked) => {
    setIsCheckedContacts(checked);
  };
  const handleSwitchFirmBalance = (checked) => {
    setIsCheckedFirmBalance(checked);
  };
  const handleSwitchOrganizers = (checked) => {
    setIsCheckedOrganizers(checked);
  };
  const handleSwitchTags = (checked) => {
    setIsCheckedTags(checked);
  };
  const handleSwitchAccounts = (checked) => {
    setIsCheckedAccounts(checked);
  };
  const handleSwitchTime = (checked) => {
    setIsCheckedTimeEntries(checked);
  };
  const handleSwitchPayments = (checked) => {
    setIsCheckedPayments(checked);

  };
  const handleSwitchPipelines = (checked) => {
    setIsCheckedPipelines(checked);
  };

  const [selectedOption, setSelectedOption] = useState("employee");
  // const [selectedRole, setSelectedRole]
  const options = [
    { value: "employee", label: "Employee" },
    { value: "admin", label: "Admin" },
  ];
  // const handleOptionChange = (selectedOption) => {
  //     setSelectedOption(selectedOption);
  // };
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEMail] = useState("");
  const handleFirstName = (event) => {
    setFirstName(event.target.value);
  };

  const handleMiddleName = (event) => {
    setMiddleName(event.target.value);
  };
  const handleLastName = (event) => {
    setLastName(event.target.value);
  };

  // Function to check if email exists
  const checkEmailExists = async (enteredEmail) => {
    const myHeaders = new Headers();
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(`${LOGIN_API}/common/user/email/getuserbyemail/${enteredEmail}`, requestOptions);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log(result)
      // Check if user array is empty
      if (result.error) {
        // No such user, email does not exist
        return false;
      } else {
        // Email exists
        return true;
      }
    } catch (error) {
      console.error(error);
      return false; // Return false if an error occurs
    }
  };
  const handleEmail = async (event) => {
    const enteredEmail = event.target.value;
    // console.log(enteredEmail);
    setEMail(enteredEmail);
    // Check if email exists
    const exists = await checkEmailExists(enteredEmail);
    setEmailValidation(exists ? "Email already exists" : "");
  };

  console.log(firstName);
  console.log(middleName);
  console.log(lastName);
  console.log(email);
  console.log(selectedOption);
  const [firstNameValidation, setFirstNameValidation] = useState("");
  const [lastNameValidation, setLastNameValidation] = useState("");
  const [emailValidation, setEmailValidation] = useState("");
  const [teamMemberIdUpdate, setTeamMemberId] = useState("");



  // const createNewSidebarData = ()=>{
  //   let data = JSON.stringify({
  //     "userrole": "admin",
  //     "userstatus": "active",
  //     "sidebardata": [
  //       {
  //         "label": "Inbox +",
  //         "path": "/inbox",
  //         "icon": "LiaMoneyBillSolid",
  //         "permissions": true
  //       },
  //       {
  //         "label": "Templates",
  //         "path": "/firmtemp/templates/tasks",
  //         "icon": "LuWorkflow",
  //         "permissions": false,
  //         "submenu": [
  //           {
  //             "label": "Firm Templates",
  //             "path": "/firmtemp/templates/tasks",
  //             "icon": "GoDotFill",
  //             "permissions": true
  //           },
  //           {
  //             "label": "Services",
  //             "path": "/firmtemp/service",
  //             "icon": "GoDotFill",
  //             "permissions": true
  //           },
  //           {
  //             "label": "Teams & Plans",
  //             "path": "/firmtemp/teammember",
  //             "icon": "LiaMoneyBillSolid",
  //             "permission": true
  //           },
  //           {
  //             "label": "Tags",
  //             "path": "/firmtemp/tags",
  //             "icon": "LiaMoneyBillSolid",
  //             "permission": true
  //           },
  //           {
  //             "label": "Pipeline Templates",
  //             "path": "/firmtemp/pipelines",
  //             "icon": "GoDotFill",
  //             "permissions": true
  //           }
  //         ]
  //       }
  //     ]
  //   });
    
  //   let config = {
  //     method: 'post',
  //     maxBodyLength: Infinity,
  //     url: 'http://127.0.0.1:7000/api/create',
  //     headers: { 
  //       'Content-Type': 'application/json'
  //     },
  //     data : data
  //   };
    
  //   axios.request(config)
  //   .then((response) => {
  //     console.log(JSON.stringify(response.data));
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
    
  // }
  //todo handle submit indivisual
  const handleSubmitTeamMember = () => {

    if (firstName === "") {
      setFirstNameValidation("First Name can't be blank");
    } else {
      setFirstNameValidation("");
    }

    // Validation for Last Name
    if (lastName === "") {
      setLastNameValidation("Last Name can't be blank");
    } else {
      setLastNameValidation("");
    }

    // Validation for Phone Number
    if (email === "") {
      setEmailValidation("Email is compalsary");
    } else {
      setEmailValidation("");
    }

    // If all validations pass, proceed to next step
    if (firstName && lastName && email) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: email,
        // role: selectedOption.value,
        role: selectedOption,
        managePayments: isCheckedPayments,
        manageInvoices: isCheckedInvoices,
        managePipelines: isCheckedPipelines,
        manageJobRecurrence: isCheckedJobRecurrences,
        manageTimeEntries: isCheckedTimeEntries,
        manageRatesinTimeEntries: isCheckedRatesTimeEntries,
        manageAccounts: isCheckedAccounts,
        viewallAccounts: isCheckedAllAccounts,
        manageTags: isCheckedTags,
        manageCustomFields: isCheckedCustomFields,
        manageOrganizers: isCheckedOrganizers,
        assignTeamMates: isCheckedTeammates,
        chargeFirmBalance: isCheckedFirmBalance,
        viewAllContacts: isCheckedAllContacts,
        manageContacts: isCheckedContacts,
        manageProposals: isCheckedProposals,
        manageSites: isCheckedSite,
        manageEmails: isCheckedEmail,
        manageServices: isCheckedServices,
        editOrganizersAnswers: isCheckedOrgnizerAnswers,
        managePublicFilterTemplates: isCheckedFilterTemplates,
        manageDocuments: isCheckedDocuments,
        manageTemplates: isCheckedTemplates,
        manageIRSTranscripts: isCheckedTranscripts,
        manageMarketPlace: isCheckedMarketplace,
        viewReporting: isCheckedViewReporting,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const url = `${LOGIN_API}/admin/teammember`;

      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            toast.error("Team member with this email already  exist.");
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
          console.log(result.teamMember._id);
          setTeamMemberId(result.teamMember._id);
          // createSidebar(result.teamMember._id)
          newUser(result.teamMember._id);
        })

        .catch((error) => console.error(error));
    }
  };
  console.log(teamMemberIdUpdate);



  // const createSidebar = (newTeamMemberUserid)=>{
  //   const myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");
    
  //   const raw = JSON.stringify({
  //     "userrole": "teammember",
  //     // "userstatus": "active",
  //     "sidebardata": [
  //       {
  //         "label": "Insights",
  //         "path": "/",
  //         "icon": "AiOutlineAppstoreAdd",
  //         "permissions": false
  //       },
  //       {
  //         "label": "Inbox +",
  //         "path": "/inbox",
  //         "icon": "LiaMoneyBillSolid",
  //         "permissions": false
  //       },
  //       {
  //         "label": "Clients",
  //         "path": "/clients/accounts",
  //         "icon": "IoPeopleOutline",
  //         "permissions": false,
  //         "submenu": [
  //           {
  //             "label": "Accounts",
  //             "path": "/clients/accounts",
  //             "icon": "GoDotFill",
  //             "permissions": false
  //           },
  //           {
  //             "label": "Contacts",
  //             "path": "/clients/contacts",
  //             "icon": "GoDotFill",
  //             "permissions": false
  //           }
  //         ]
  //       },
  //       {
  //         "label": "Workflow",
  //         "path": "/workflow/tasks",
  //         "icon": "LuWorkflow",
  //         "permissions": false,
  //         "submenu": [
            
  //           {
  //             "label": "Jobs",
  //             "path": "/workflow/jobs",
  //             "icon": "GoDotFill",
  //             "permissions": false
  //           },
            
  //           {
  //             "label": "Pipelines",
  //             "path": "/workflow/pipelines",
  //             "icon": "LiaMoneyBillSolid",
  //             "permission": false
  //           }
  //         ]
  //       },
  //       {
  //         "label": "Billing",
  //         "path": "/billing/time",
  //         "icon": "LiaMoneyBillSolid",
  //         "permissions": false,
  //         "submenu": [
  //           {
  //             "label": "Time Entries",
  //             "path": "/billing/time",
  //             "icon": "GoDotFill",
  //             "permissions": false
  //           },
  //           {
  //             "label": "Invoices",
  //             "path": "/billing/Invoices",
  //             "icon": "GoDotFill",
  //             "permissions": false
  //           },
  //           {
  //             "label": "Proposals&Els",
  //             "path": "/billing/proposalsandels",
  //             "icon": "LiaMoneyBillSolid",
  //             "permission": false
  //           }
  //         ]
  //       },
  //       {
  //         "label": "Settings",
  //         "path": "/settings/myaccount",
  //         "icon": "FiSettings",
  //         "permissions": false,
  //         "submenu": [
  //           {
  //             "label": "My Account",
  //             "path": "/settings/myaccount",
  //             "icon": "GoDotFill",
  //             "permissions": false
  //           },
            
  //         ]
  //       },
  //       {
  //         "label": "Templates",
  //         "path": "/firmtemp/templates/marketplace",
  //         "icon": "MdFormatListBulletedAdd",
  //         "permissions": false,
  //         "submenu": [
  //           {
  //             "label": "MarketPlace",
  //             "path": "/firmtemp/templates/marketplace",
  //             "icon": "GoDotFill",
  //             "permissions": false
  //           },
  //           {
  //             "label": "Firm Templates",
  //             "path": "/firmtemp/templates/tasks",
  //             "icon": "GoDotFill",
  //             "permissions": false
  //           },
  //           {
  //             "label": "Services",
  //             "path": "/firmtemp/service",
  //             "icon": "GoDotFill",
  //             "permissions": false
  //           },
            
  //           {
  //             "label": "Tags",
  //             "path": "/firmtemp/tags",
  //             "icon": "LiaMoneyBillSolid",
  //             "permission": false
  //           },
  //           {
  //             "label": "Pipeline Templates",
  //             "path": "/firmtemp/pipelines",
  //             "icon": "GoDotFill",
  //             "permissions": false
  //           }
  //         ]
  //       }
  //     ]
      
  //   });
    
  //   const requestOptions = {
  //     method: "POST",
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: "follow"
  //   };
    
  //   fetch("http://127.0.0.1:7000/api/create", requestOptions)
  //     .then((response) => response.text())
  //     .then((result) =>{ 
  //       console.log("sidebar",result)
  //       // console.log(result);
  //       console.log(result.user._id);
  //       // updateTeammemberNewUserid(result._id, newTeamMemberUserid);
  //     })
  //     .catch((error) => console.error(error));
  // }


  //************************ */

  const newUser = (teammemberuserid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    
    const raw = JSON.stringify({
      username: firstName,
      email: email,
      role: "TeamMember",
      password: firstName,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/login/signup/`;
    fetch(url, requestOptions)
      .then((response) => response.json())

      .then((result) => {
        console.log(result);
        console.log(result._id);
        updateTeammemberUserid(result._id, teammemberuserid);
        sendmail();
      })

      .catch((error) => console.error(error));
  };
  
  const updateTeammemberUserid = (UserId, teammemberuserid) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      userid: UserId,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(teammemberuserid);
    fetch(`${LOGIN_API}/admin/teammember/${teammemberuserid}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success("Team Member saved successfully!");
        fetchData();
        // navigate
      })

      .catch((error) => console.error(error));
  };
  const { logindata } = useContext(LoginContext);
  const sendmail = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    console.log(logindata.user.id);

    // const port = window.location.port;
    const raw = JSON.stringify({
      email: email,
      owneremail: logindata.user.id,
      url: `${WINDOWS_PORT}/activate/`,
    });

    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${LOGIN_API}/teammembersavedemail/`;

    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        toast.success("Team Member saved successfully!");
        // createNewSidebarData();
        handleNewDrawerClose();
        fetchData();
        navigate("/firmtemp/teammember/activemember");
        // window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred while submitting the form", error);
      });
  };

  const Item = styled("Box")(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  return (
    <Box>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              mt: 5,
              width: "100%",
              margin: "20px",
              gap: "10px",
              "& a": {
                textDecoration: "none",
                padding: "5px 10px",
                borderRadius: "15px",
                fontSize:'14px',
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
             <NavLink to="/firmtemp/teammember/activemember">Active Members</NavLink> 
             <NavLink to="/firmtemp/teammember/deactivatemember">Deactivated Members</NavLink> 
          </Box>
          <Box>
            <Button onClick={setIsNewDrawerOpen} variant="contained"  sx={{
                  backgroundColor: 'var(--color-save-btn)',  // Normal background
                 
                  '&:hover': {
                    backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                  },
  borderRadius:'15px', whiteSpace: "nowrap" 
                }}>
              Team Member
            </Button>
          </Box>
        </Box>
        {/* <Divider sx={{ my: 2, margin: "20px" }} /> */}
        <Outlet />
      </Box>

      <Drawer
        anchor="right"
        open={isNewDrawerOpen}
        onClose={handleNewDrawerClose}
        PaperProps={{
          sx: {
            borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
            width: isSmallScreen ? "100%" : "650px",
          },
        }}
      >
        <Box role="presentation" sx={{ borderRadius: isSmallScreen ? "0" : "15px" }}>
          <Box>
            <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px" }}>
              <Typography sx={{ fontWeight: "bold" }} variant="h4">
                {" "}
                Add Team Member
              </Typography>
              <CloseRoundedIcon onClick={handleNewDrawerClose} style={{ cursor: "pointer" }} />
            </Box>
            <Divider />
          </Box>
          <form style={{ margin: "15px" }}>
            <Box>
              <Box sx={{ width: "100%", mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <InputLabel sx={{ color: "black" }}>First name</InputLabel>
                      <TextField fullWidth onChange={handleFirstName} id="firstname" name="firstname" placeholder="First name" size="small" sx={{ mt: 1 }} />
                    </Box>
                    <Box style={{ color: "red", fontSize: "9px" }}>{firstNameValidation}</Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ mr: "15px" }}>
                      <InputLabel sx={{ color: "black" }}>Middle Name</InputLabel>
                      <TextField fullWidth onChange={handleMiddleName} name="middlename" id="middlename" placeholder="Middle Name" size="small" sx={{ mt: 1 }} />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Box sx={{ mr: "15px" }}>
                      <InputLabel sx={{ color: "black" }}>Last Name</InputLabel>
                      <TextField fullWidth name="lastname" id="lastname" onChange={handleLastName} placeholder="Last Name" size="small" sx={{ mt: 1 }} />
                    </Box>
                    <Box style={{ color: "red", fontSize: "9px" }}>{lastNameValidation}</Box>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mt: 3 }}>
                <InputLabel sx={{ color: "black" }}>Email</InputLabel>
                <TextField
                  // margin="normal"
                  fullWidth
                  name="email"
                  id="email"
                  onChange={handleEmail}
                  placeholder="Email"
                  size="small"
                  sx={{ mt: 2 }}
                />
              </Box>
              <Box style={{ color: "red", fontSize: "9px" }}>{emailValidation}</Box>

              <Box>
                <Select
                  size="small"
                  sx={{ width: "100%", mt: 2 }}
                  value={selectedOption}
                  // onChange={handleOptionChange}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  displayEmpty
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

             {selectedOption === "employee" && (
                <Box className="rights" style={{ marginTop: "10px" }}>
                  <Box style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <p>Access Rights</p>
                    <SlQuestion style={{ color: "blue", cursor: "pointer" }} />
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} columns={16}>
                      <Grid item xs={8}>
                        <Item>
                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchPayments} checked={isCheckedPayments} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage payments</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchPipelines} checked={isCheckedPipelines} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage pipelines</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchTime} checked={isCheckedTimeEntries} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage time entries</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchAccounts} checked={isCheckedAccounts} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage accounts</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchTags} checked={isCheckedTags} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage tags</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchOrganizers} checked={isCheckedOrganizers} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage organizers</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchFirmBalance} checked={isCheckedFirmBalance} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage firm balance</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchContacts} checked={isCheckedContacts} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage contacts</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchSite} checked={isCheckedSite} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage site</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchServices} checked={isCheckedServices} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage services</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchFilterTemplates} checked={isCheckedFilterTemplates} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage public filter templates</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchTemplates} checked={isCheckedTemplates} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage templates</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchMarketplace} checked={isCheckedMarketplace} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage marketplace</p>
                          </Box>
                        </Item>
                      </Grid>
                      <Grid item xs={8}>
                        <Item>
                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchInvoices} checked={isCheckedInvoices} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage invoices</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchJobRecurrences} checked={isCheckedJobRecurrences} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage job recurrences</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchRatesTimeEntries} checked={isCheckedRatesTimeEntries} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage rates in time entries</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchAllAccounts} checked={isCheckedAllAccounts} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>View all accounts</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchCustomFields} checked={isCheckedCustomFields} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage custome fields</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchTeammates} checked={isCheckedTeammates} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage teammates</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchAllContacts} checked={isCheckedAllContacts} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>View all contacts</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchProposals} checked={isCheckedProposals} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage proposals</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchEmail} checked={isCheckedEmail} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Mute emails</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchOrgnizerAnswers} checked={isCheckedOrgnizerAnswers} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Edit orgnizer answers</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchDocuments} checked={isCheckedDocuments} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage documents</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchTranscripts} checked={isCheckedTranscripts} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>Manage IRS Transcripts</p>
                          </Box>

                          <Box style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                            <Switch onChange={handleSwitchViewReporting} checked={isCheckedViewReporting} onColor="#3A91F5" onHandleColor="#FFF" handleDiameter={10} uncheckedIcon={false} checkedIcon={false} height={20} width={32} className="react-switch" />
                            <p style={{ color: "black" }}>View reporting</p>
                          </Box>
                        </Item>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )} 
            </Box>
          </form>

          <Box sx={{ display: "flex", alignItems: "center", gap: 5, margin: "8px", ml: 3 }}>
            <Button onClick={handleSubmitTeamMember} variant="contained" sx={{
                backgroundColor: 'var(--color-save-btn)',  // Normal background
               
                '&:hover': {
                  backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                },
                borderRadius:'15px'
              }}>
              Send Invite
            </Button>
            <Button variant="outlined" onClick={handleNewDrawerClose} sx={{
                  borderColor: 'var(--color-border-cancel-btn)',  // Normal background
                 color:'var(--color-save-btn)',
                  '&:hover': {
                    backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                    color:'#fff',
                    border:"none"
                  },
                  width:'80px',borderRadius:'15px'
                }}>
              Cancel
            </Button>
          </Box>

          <ToastContainer />
        </Box>
      </Drawer>
    </Box>
  );
};

export default TeamMember;
