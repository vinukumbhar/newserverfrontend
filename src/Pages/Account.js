import React, { useEffect, useState, useContext } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  TablePagination,
  Chip,
  Tooltip,
  Autocomplete,
  Box,
  Divider,
  Typography,
  OutlinedInput,
  MenuItem as MuiMenuItem,
  FormControl,
  InputLabel,
  Menu,
  Button,
  IconButton,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { RxCross2 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Outlet } from "react-router-dom";
import ListIcon from "@mui/icons-material/List";
import EmailIcon from "@mui/icons-material/Email";
import TagIcon from "@mui/icons-material/Tag";
import PersonIcon from "@mui/icons-material/Person";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendAccountEmail from "./BulkActions/SendAccountEmail";
import AddJobs from "./BulkActions/AddJobs";
import AddBulkOrganizer from "./BulkActions/AddBulkOrganizer";
import ManageTags from "./BulkActions/ManageTags";
import ManageTeams from "./BulkActions/ManageTeams";
import { useTheme } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CircularProgress } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import "./account.css";
import { LoginContext } from "../Sidebar/Context/Context.js";
const FixedColumnTable = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [accountData, setAccountData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "Name",
    direction: "asc",
  });

 
  const [filters, setFilters] = useState({
    accountName: "",
    type: "",
    teamMember: "",
    tags: [],
  });
  const [showFilters, setShowFilters] = useState({
    accountName: false,
    type: false,
    teamMember: false,
    tags: false,
  });

  const [isActiveTrue, setIsActiveTrue] = useState(true);
  const [anchorE2, setAnchorE2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${ACCOUNT_API}/accounts/account/accountdetailslist/${isActiveTrue}`
      );
      let accountsListData = response.data.accountlist;
      console.log("accounts", accountsListData);
      // Retrieve team member data from localStorage
      const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
      console.log("recived data", storedData);
      const userRole = localStorage.getItem("userRole");
      console.log("role is", userRole);
      setUserRole(userRole);
      // Check if the user is a TeamMember and if they have permission to view accounts (viewallAccounts = true)
      //  const canViewAccounts = userRole === "TeamMember" && storedData.teammember?.viewallAccounts;
      const canViewAccounts =
        userRole === "Admin" || // Admins can always view accounts
        (userRole === "TeamMember" && storedData.teammember?.viewallAccounts);

      if (canViewAccounts) {
        setAccountData(accountsListData);
      } else {
        setAccountData([]); // Clear account data if not permitted
        // setAccountData(accountsListData);
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  useEffect(() => {
    fetchData();
  }, [ACCOUNT_API, isActiveTrue]);

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

  // console.log(selected);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value })); // Update filter without clearing others
    setPage(0);
  };
  const [sortBy, setSortBy] = useState(null); // Current column to sort by
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

  // Sorting logic
  const sortedData = [...accountData].sort((a, b) => {
    if (!sortBy) return 0; // No sorting if no column is selected

    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue === bValue) return 0;

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  const filteredData = sortedData.filter((row) => {
    const accountNameMatch = row.Name.toLowerCase().includes(
      filters.accountName.toLowerCase()
    );
    const typeMatch = filters.type
      ? row.Type.toLowerCase() === filters.type.toLowerCase()
      : true;
    const teamMemberMatch = filters.teamMember
      ? row.Team.some((member) => member.username === filters.teamMember)
      : true;
    // const tagMatch = filters.tags.length ? filters.tags.every((tag) => row.Tags.some((rowTag) => rowTag.tagName === tag)) : true;
    // const tagMatch = filters.tags.length ? filters.tags.some((tag) => row.Tags.some((rowTag) => rowTag.tagName === tag.tagName && rowTag.tagColour === tag.tagColour)) : true;
    const tagMatch = filters.tags.length
      ? row.Tags &&
        Array.isArray(row.Tags) &&
        filters.tags.some((tag) =>
          row.Tags.some(
            (rowTag) =>
              rowTag.tagName === tag.tagName &&
              rowTag.tagColour === tag.tagColour
          )
        )
      : true;
    return accountNameMatch && typeMatch && teamMemberMatch && tagMatch;
  });
  const handleFilterButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorE2(null);
  };

  const clearFilter = (filterField) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterField]: "" })); // Clear the specific filter
    setShowFilters((prev) => ({
      ...prev,
      [filterField]: false, // Hide the filter input
    }));
  };

  const toggleFilter = (filterType) => {
    setShowFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };
  const handleMultiSelectChange = (name, values) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: values }));
  };
  const teamMemberOptions = Array.from(
    new Set(
      accountData.flatMap((row) => row.Team.map((member) => member.username))
    )
  );
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchTagData();
  }, []);

  const fetchTagData = async () => {
    try {
      const response = await fetch(`${TAGS_API}/tags/`);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const uniqueTags =
    tags.length > 0
      ? Array.from(
          new Set(tags.map((tag) => `${tag.tagName}-${tag.tagColour}`))
        ).map((tagKey) => {
          const [tagName, tagColour] = tagKey.split("-");
          return { tagName, tagColour };
        })
      : [];
  const calculateWidth = (tagName) => {
    const baseWidth = 10; // base width for each tag
    const charWidth = 8; // approximate width of each character
    const padding = 10; // padding on either side
    return baseWidth + charWidth * tagName.length + padding;
  };
  // const handleSort = (key) => {
  //   setSortConfig((prevSortConfig) => {
  //     if (prevSortConfig.key === key) {
  //       return {
  //         key,
  //         direction: prevSortConfig.direction === "asc" ? "desc" : "asc",
  //       };
  //     }
  //     return { key, direction: "asc" };
  //   });
  // };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedData = [...paginatedData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    // setPaginatedData(sortedData);
  };
  // const sortedData = React.useMemo(() => {
  //   const dataToSort = filteredData; // Use filteredData for sorting
  //   const sorted = [...dataToSort]; // Create a copy of filteredData

  //   if (sortConfig.key) {
  //     sorted.sort((a, b) => {
  //       if (a[sortConfig.key] < b[sortConfig.key])
  //         return sortConfig.direction === "asc" ? -1 : 1;
  //       if (a[sortConfig.key] > b[sortConfig.key])
  //         return sortConfig.direction === "asc" ? 1 : -1;
  //       return 0;
  //     });
  //   }
  //   return sorted;
  // }, [filteredData, sortConfig]);

  const [isSendEmailOpen, setIsSendEmailOpen] = useState(false);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isCreateOrganizerOpen, setIsCreateOrganizerOpen] = useState(false);
  const [isManageTagsOpen, setIsManageTagsOpen] = useState(false);
  const [isManageTeamOpen, setIsManageTeamOpen] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setIsSendEmailOpen(false);
    setIsCreateOrganizerOpen(false);
    setIsCreateJobOpen(false);
    setIsManageTagsOpen(false);
    setIsManageTeamOpen(false);
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // 5 rows per page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleAssignOrganizer = () => {
    setIsCreateOrganizerOpen(!isCreateOrganizerOpen);
    handleDrawerOpen();
    console.log("Assign Organizer action triggered.");
  };

  const handleAddJob = () => {
    setIsCreateJobOpen(!isCreateJobOpen);
    handleDrawerOpen();
    console.log("Add Job action triggered.");
  };

  const handleManageTeam = () => {
    setIsManageTeamOpen(!isManageTeamOpen);
    handleDrawerOpen();
    console.log("Manage Team action triggered.");
  };

  const handleSendEmail = () => {
    setIsSendEmailOpen(!isSendEmailOpen);
    handleDrawerOpen();
    console.log("Send Email action triggered.");
  };

  const handleManageTags = () => {
    setIsManageTagsOpen(!isManageTagsOpen);
    handleDrawerOpen();
    console.log("Manage Tags action triggered.");
  };

  const handleFormClose = () => {
    setIsDrawerOpen(false);
    setIsSendEmailOpen(false);
    setIsCreateOrganizerOpen(false);
    setIsCreateJobOpen(false);
    setIsManageTagsOpen(false);
    setIsManageTeamOpen(false);
  };

  const [activeButton, setActiveButton] = useState("active");

  const handleActiveClick = () => {
    setIsActiveTrue(true);
    setActiveButton("active");
    fetchData();
    console.log("Active action triggered.");
  };

  const handleArchivedClick = () => {
    setIsActiveTrue(false);
    setActiveButton("archived");
    fetchData();
    console.log("Archive action triggered.");
  };

  const handleMoreActionsClick = (event) => {
    setAnchorE2(event.currentTarget);
  };
  // Define additional action handlers
  const handleArchiveAccount = () => {
    console.log("Additional Action 1 triggered");

    selected.forEach((accountId) => {
      handleSubmit(accountId);
    });
    toast.success("account updated successfully");
    setIsActiveTrue(false);
    handleClose();
  };

  const handleEditLoginNotifyEmailSync = () => {
    console.log("EditLoginNotifyEmailSync triggered");
    // handleupdatecontacts(selected)
    setSidebarOpen(true);
    handleClose();
  };

  // create account
  const handleSubmit = (selected) => {
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
    const url = `${ACCOUNT_API}/accounts/accountdetails/${selected}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        console.log(result.updatedAccount); // Log the result
        // setAccountId(result.updatedAccount._id);
        // toast.success("Form submitted successfully"); // Display success toast
      })
      .catch((error) => {
        console.error(error); // Log the error
        toast.error("An error occurred while submitting the form"); // Display error toast
      });
  };

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const [settings, setSettings] = useState({
    login: undefined, // undefined means no action selected
    notify: undefined,
    emailSync: undefined,
  });

  // Handle the change in the select dropdown
  const handleSettingChange = (setting, value) => {
    console.log(value);
    console.log(setting);

    // if (setting === 'notify') {
    //   setNotifySetting(setting, value)
    // }
    // if (setting === 'login') {
    //   setLoginSetting(setting, value)
    // }
    // if (setting === 'emailSync') {
    //   setEmailSyncSetting(setting, value)
    // }

    // Map the dropdown values to boolean or undefined
    const mappedValue =
      value === "Assign to all"
        ? true
        : value === "Remove from all"
          ? false
          : undefined;
    console.log(mappedValue);
    setSettings((prevState) => ({
      ...prevState,
      [setting]: mappedValue,
    }));
  };
  // const handleSettingChange = (setting, value) => {
  //   console.log(`Setting: ${setting}, Value: ${value}`);

  //   // Map dropdown values to a boolean or undefined
  //   const mappedValue = value === "Assign to all"
  //     ? true
  //     : value === "Remove from all"
  //     ? false
  //     : undefined;

  //   console.log(`Mapped Value: ${mappedValue}`);

  //   // Update the state with the new setting value
  //   setSettings((prevState) => ({
  //     ...prevState,
  //     [setting]: mappedValue,
  //   }));
  //    // Handle specific settings based on the `setting` type
  //    switch (setting) {
  //     case 'notify':
  //       setNotifySetting(setting, value);
  //       break;
  //     case 'login':
  //       setLoginSetting(setting, value);
  //       break;
  //     case 'emailSync':
  //       setEmailSyncSetting(setting, value);
  //       break;
  //     default:
  //       console.warn(`Unknown setting: ${setting}`);
  //   }
  // };

  const [loginSetting, setLoginSetting] = useState({
    settingName: "",
    value: "",
  });
  const [notifySetting, setNotifySetting] = useState({
    settingName: "",
    value: "",
  });
  const [emailSyncSetting, setEmailSyncSetting] = useState({
    settingName: "",
    value: "",
  });

  const handleupdatecontacts = () => {
    submitupdatecontacts(selected);
  };
  // const { logindata, setLoginData } = useContext(LoginContext);
  const { logindata } = useContext(LoginContext);
  const [loginuserid, setLoginUserId] = useState("");

  useEffect(() => {
    if (logindata?.user?.id) {
      // Check if logindata and user.id exist
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);

  const [loginsData, setloginsData] = useState("");

  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState("");
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const fetchUserLoginData = async (id) => {
    const maxLength = 15;
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url + loginsData, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setUserData(result.email); // Set a maximum length for userData if email exists

        setUsername(result.username);
      });
  };
  useEffect(() => {
    fetchUserLoginData(loginuserid);
  }, []);

  const editMailNotifyLoginSendmail = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      // useremail:"dipika@microtechsolutions.co.in",
      useremail: userData,
      operations: {
        login: loginSetting.value,
        notify: notifySetting.value,
        emailSync: emailSyncSetting.value,
      },
      accountsSummary: {
        total: "1",
        successful: "1",
        failed: "0",
      },
      timestamp: "10.21",
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/editnotifyloginemailsync`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };
  const submitupdatecontacts = (selected) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // // Safely extract only the necessary fields from settings
    // const { login, notify, emailSync } = settings;

    // // Ensure login, notify, and emailSync are booleans or null (not components or DOM elements)
    // const payload = {
    //   accountIds: selected,
    //   login: login === undefined ? null : login, // Nullify if undefined
    //   notify: notify === undefined ? null : notify,
    //   emailSync: emailSync === undefined ? null : emailSync,
    // };

    const filteredSettings = Object.entries(settings)
      .filter(([_, value]) => value !== undefined) // Only include true or false
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    // Create the payload with selected account IDs and filtered settings
    const payload = {
      accountIds: selected,
      ...filteredSettings, // Spread only defined settings into the payload
    };

    // Debugging: log the payload to check its structure
    console.log("Payload being sent:", payload);

    // Prepare the raw data for the API call
    const raw = JSON.stringify(payload);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${ACCOUNT_API}/accounts/accounts/update-contacts`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        toast.success(
          "Bulk edit in progress, you will receive an email and Inbox+ notification when complete."
        );
        // editMailNotifyLoginSendmail()
        handleCloseSidebar();
      })
      .catch((error) => console.error(error));
  };
  // const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  // const handleDeleteSelected = async () => {
  //   const isConfirmed = window.confirm(
  //     "Are you sure you want to delete the selected accounts?"
  //   );

  //   if (isConfirmed) {
  //     try {
  //       // Delete selected accounts and extract their data
  //       const deletedAccounts = await Promise.all(
  //         selected.map(async (id) => {
  //           const response = await axios.delete(
  //             `${ACCOUNT_API}/accounts/accountdetails/${id}`
  //           );
  //           return response.data.deletedAccount; // Extract deleted account data
  //         })
  //       );

  //       // Extract user IDs from deleted accounts
  //       const userIds = deletedAccounts.map((acc) => acc.userid);

  //       // Get user data and client data before deletion
  //       const usersData = await Promise.all(
  //         userIds.map(async (userid) => {
  //           const response = await axios.get(
  //             `${LOGIN_API}/common/user/${userid}`
  //           );
  //           return response.data; // Get user data
  //         })
  //       );

  //       const clientsData = await Promise.all(
  //         userIds.map(async (userid) => {
  //           console.log("clientid", userid);
  //           const response = await axios.get(
  //             `${LOGIN_API}/admin/client/${userid}`
  //           );
  //           return response.data; // Get client data
  //         })
  //       );

  //       // Extract client IDs from retrieved client data
  //       // const clientIds = clientsData.map(client => client._id);
  //       const clientIds = clientsData
  //         .map((clientObj) => clientObj.client?._id)
  //         .filter((id) => id);

  //       console.log("clients", clientsData);
  //       // Delete users
  //       await Promise.all(
  //         userIds.map((userid) =>
  //           axios.delete(`${LOGIN_API}/common/user/${userid}`)
  //         )
  //       );

  //       // Delete clients
  //       await Promise.all(
  //         clientIds.map((clientId) =>
  //           axios.delete(`${LOGIN_API}/admin/clientsignup/${clientId}`)
  //         )
  //       );

  //       // Update UI to remove deleted accounts
  //       setAccountData((prevContacts) =>
  //         prevContacts.filter((account) => !selected.includes(account.id))
  //       );

  //       toast.success(
  //         "Selected account deleted successfully!"
  //       );
  //       setSelected([]); // Clear selected contacts
  //     } catch (error) {
  //       console.error("Delete API Error:", error);
  //       toast.error("Failed to delete selected accounts, users, or clients.");
  //     }
  //   }
  // };
  const handleDeleteSelected = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected accounts?"
    );
  
    if (isConfirmed) {
      try {
        // Delete selected accounts and extract their data
        const deletedAccounts = await Promise.all(
          selected.map(async (id) => {
            try {
              const response = await axios.delete(
                `${ACCOUNT_API}/accounts/accountdetails/${id}`
              );
              console.log("Deleted Account Response:", response.data);
              return response.data.deletedAccount || null; // Ensure deletedAccount exists
            } catch (error) {
              console.error(`Failed to delete account with ID ${id}:`, error);
              return null; // Skip failed deletions
            }
          })
        );
  
        // Filter out null responses and extract user IDs
        const userIds = deletedAccounts
          .filter((acc) => acc && acc.userid) // Skip if userid is missing
          .map((acc) => acc.userid);
  
        if (userIds.length === 0) {
          console.warn("No user IDs found in deleted accounts. Skipping user deletion.");
        } else {
          // Get user data and client data before deletion
          const usersData = await Promise.all(
            userIds.map(async (userid) => {
              const response = await axios.get(`${LOGIN_API}/common/user/${userid}`);
              return response.data;
            })
          );
  
          const clientsData = await Promise.all(
            userIds.map(async (userid) => {
              console.log("clientid", userid);
              const response = await axios.get(`${LOGIN_API}/admin/client/${userid}`);
              return response.data;
            })
          );
  
          // Extract client IDs from retrieved client data
          const clientIds = clientsData
            .map((clientObj) => clientObj.client?._id)
            .filter((id) => id);
  
          console.log("clients", clientsData);
  
          // Delete users if userIds exist
          await Promise.all(
            userIds.map((userid) =>
              axios.delete(`${LOGIN_API}/common/user/${userid}`)
            )
          );
  
          // Delete clients if clientIds exist
          if (clientIds.length > 0) {
            await Promise.all(
              clientIds.map((clientId) =>
                axios.delete(`${LOGIN_API}/admin/clientsignup/${clientId}`)
              )
            );
          }
        }
  
        // Update UI to remove deleted accounts
        setAccountData((prevContacts) =>
          prevContacts.filter((account) => !selected.includes(account.id))
        );
  
        toast.success("Selected account(s) deleted successfully!");
        setSelected([]); // Clear selected contacts
      } catch (error) {
        console.error("Delete API Error:", error);
        toast.error("Failed to delete selected accounts, users, or clients.");
      }
    }
  };
  
 
  return (
    <>
      <div style={{ display: "flex" }}>
        <Box>
          <Box
            // className="client-document-nav"
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
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
                Active
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
                Archived
              </Typography>
            </Box>
          </Box>

          <Outlet />
        </Box>
        {/* <Button variant="text" onClick={handleFilterButtonClick} style={{ marginRight: "10px" }}>
          Filter Options
        </Button> */}

        {/* Render action panel when items are selected */}
        {selected.length > 0 && (
          <div
            data-test="clients-bulk-actions-panel"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px",
              // marginBottom: "20px",
              // borderBottom: "1px solid #ddd",
              // backgroundColor: "#f5f5f5",
            }}
          >
            <Button
              variant="text"
              startIcon={<ListIcon />}
              onClick={handleAssignOrganizer}
            >
              Send Organizer
            </Button>
            <Button
              variant="text"
              startIcon={<ListIcon />}
              onClick={handleAddJob}
            >
              Add Job
            </Button>
            <Button
              variant="text"
              startIcon={<PersonIcon />}
              onClick={handleManageTeam}
            >
              Manage Team
            </Button>
            <Button
              variant="text"
              startIcon={<EmailIcon />}
              disabled={selected.length === 0}
              onClick={handleSendEmail}
            >
              Send Email
            </Button>
            <Button
              variant="text"
              startIcon={<TagIcon />}
              onClick={handleManageTags}
            >
              Manage Tags
            </Button>
            <Button
              variant="text"
              startIcon={<MoreVertIcon />}
              onClick={handleMoreActionsClick}
            >
              More Actions
            </Button>

            {/* Dropdown menu for additional actions */}
            <Menu
              anchorEl={anchorE2}
              open={Boolean(anchorE2)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={handleArchiveAccount}>
                {" "}
                {isActiveTrue ? "Archive Account" : "Activate Account"}
              </MenuItem>
              <MenuItem onClick={handleEditLoginNotifyEmailSync}>
                Edit login notify emailSync
              </MenuItem>
              {/* <MenuItem onClick={handleAction3}>Additional Action 3</MenuItem>  */}
            </Menu>
          </div>
        )}
        <Drawer
          anchor="right"
          open={isSidebarOpen}
          onClose={handleCloseSidebar}
          PaperProps={{
            id: "tag-drawer",
            sx: {
              borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
              width: isSmallScreen ? "100%" : 700,
              maxWidth: "100%",
              [theme.breakpoints.down("sm")]: {
                width: "100%",
              },
            },
          }}
        >
          <div style={{ padding: 16, position: "relative" }}>
            <DialogTitle>
              Bulk-edit login, notify, email sync
              <Typography variant="subtitle1">
                For a selected account
              </Typography>
              <IconButton
                onClick={handleCloseSidebar}
                style={{ position: "absolute", right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Bulk edit updates all email addresses linked to the selected
                accounts. You can adjust settings per contact within each
                account's Info section.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Your clients will be able to access their portal through their
                email address and receive notifications. Additionally, you can
                automatically see all email history if you enable email sync.
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Settings</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      {
                        label: "Login",
                        setting: "login",
                        icon: <PersonIcon />,
                      },
                      {
                        label: "Notify",
                        setting: "notify",
                        icon: <NotificationsIcon />,
                      },
                      {
                        label: "Email sync",
                        setting: "emailSync",
                        icon: <EmailIcon />,
                      },
                    ].map((setting, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {setting.icon}
                            <Typography
                              variant="body2"
                              style={{ marginLeft: 8 }}
                            >
                              {setting.label}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={settings[setting.setting]} // Controlled value based on state
                            onChange={(e) =>
                              handleSettingChange(
                                setting.setting,
                                e.target.value
                              )
                            } // Handle change
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            sx={{ width: "150px" }}
                          >
                            <MenuItem value="Assign to all">
                              Assign to all
                            </MenuItem>
                            <MenuItem value="Remove from all">
                              Remove from all
                            </MenuItem>
                            <MenuItem value="Do nothing">Do nothing</MenuItem>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>

            <DialogActions>
              <Button
                variant="contained"
                onClick={handleupdatecontacts}
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
                onClick={handleCloseSidebar}
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
            </DialogActions>
          </div>
        </Drawer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => {
              toggleFilter("accountName");
              handleClose();
            }}
          >
            Account Name
          </MenuItem>
          <MenuItem
            onClick={() => {
              toggleFilter("type");
              handleClose();
            }}
          >
            Type
          </MenuItem>
          <MenuItem
            onClick={() => {
              toggleFilter("teamMember");
              handleClose();
            }}
          >
            Team Member
          </MenuItem>
          <MenuItem
            onClick={() => {
              toggleFilter("tags");
              handleClose();
            }}
          >
            Tags
          </MenuItem>
        </Menu>
      </div>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {" "}
          <CircularProgress style={{ fontSize: "300px", color: "blue" }} />
        </Box>
      ) : userRole === "Admin" || accountData.length > 0 ? (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mt: 1 }}>
            <Box
              sx={{
                width: "50px",
                padding: "4px 8px",
                cursor: "pointer",
                color: "#3f51b5",
              }}
              onClick={handleFilterButtonClick}
            >
              {/* <Button variant="text" > */}
              {/* Filter Options */}
              Filters
              {/* </Button> */}
            </Box>

            <Box>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "var(--color-save-btn)", // Normal background

                  "&:hover": {
                    backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                  },
                  // width: "80px",
                  borderRadius: "15px",
                }}
              >
                Imports
              </Button>
            </Box>
            <Box>
              {selected.length > 0 && (
                <IconButton
                  onClick={handleDeleteSelected}
                  sx={{ color: "red" }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
            {/* Account Name Filter */}
            {showFilters.accountName && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  // marginBottom: "10px",
                }}
              >
                <TextField
                  name="accountName"
                  value={filters.accountName}
                  onChange={handleFilterChange}
                  placeholder="Filter by Account Name"
                  variant="outlined"
                  size="small"
                  style={{ marginRight: "10px" }}
                />
                <DeleteIcon
                  onClick={() => clearFilter("accountName")}
                  style={{ cursor: "pointer", color: "red" }}
                />
              </div>
            )}

            {/* Type Filter */}
            {showFilters.type && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  // marginBottom: "10px",
                }}
              >
                <FormControl
                  variant="outlined"
                  size="small"
                  style={{ marginRight: "10px", width: "150px" }}
                >
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    label="Type"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Individual">Individual</MenuItem>
                    <MenuItem value="Company">Company</MenuItem>
                  </Select>
                </FormControl>
                <DeleteIcon
                  onClick={() => clearFilter("type")}
                  style={{ cursor: "pointer", color: "red" }}
                />
              </div>
            )}
            {/* Team Member Filter */}
            {showFilters.teamMember && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  // marginBottom: "10px",
                }}
              >
                <FormControl
                  variant="outlined"
                  size="small"
                  style={{ marginRight: "10px", width: "150px" }}
                >
                  <InputLabel>Team Member</InputLabel>
                  <Select
                    name="teamMember"
                    value={filters.teamMember}
                    onChange={handleFilterChange}
                    label="Team Member"
                  >
                    <MenuItem value="">All</MenuItem>
                    {teamMemberOptions.map((member) => (
                      <MenuItem key={member} value={member}>
                        {member}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <DeleteIcon
                  onClick={() => clearFilter("teamMember")}
                  style={{ cursor: "pointer", color: "red" }}
                />
              </div>
            )}
            {/* Tags Filter */}
            {showFilters.tags && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  // marginBottom: "10px",
                }}
              >
                <Autocomplete
                  multiple
                  options={uniqueTags}
                  value={filters.tags || []}
                  onChange={(e, newValue) =>
                    handleMultiSelectChange("tags", newValue)
                  }
                  getOptionLabel={(option) => option.tagName}
                  filterSelectedOptions
                  renderOption={(props, option) => (
                    <li
                      {...props}
                      style={{
                        backgroundColor: option.tagColour,
                        color: "#fff",
                        padding: "2px 8px",
                        borderRadius: "8px",
                        textAlign: "center",
                        marginBottom: "5px",
                        fontSize: "10px",
                        width: `${calculateWidth(option.tagName)}px`,
                        marginLeft: "5px",
                        cursor: "pointer",
                      }}
                    >
                      {option.tagName}
                    </li>
                  )}
                  renderTags={(selected, getTagProps) =>
                    selected.map((option, index) => (
                      <Chip
                        key={option.value}
                        label={option.tagName}
                        style={{
                          backgroundColor: option.tagColour,
                          color: "#fff",
                          cursor: "pointer",
                          // borderRadius: "8px",
                          fontSize: "12px",
                          margin: "2px",
                        }}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Filter by Tags"
                      size="small"
                      style={{ width: "250px" }}
                    />
                  )}
                  style={{ marginRight: "10px", width: "250px" }}
                />
                <DeleteIcon
                  onClick={() => clearFilter("tags")}
                  style={{ cursor: "pointer", color: "red" }}
                />
              </div>
            )}
          </Box>

          <TableContainer  sx={{ mt: 2 }}>
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
                      checked={selected.length === accountData.length}
                      onChange={() => {
                        if (selected.length === accountData.length) {
                          setSelected([]);
                        } else {
                          const allSelected = accountData.map(
                            (item) => item.id
                          );
                          setSelected(allSelected);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      if (sortBy === "Name") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("Name");
                        setSortOrder("asc");
                      }
                    }}
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
                    Account Name{" "}
                    {sortBy === "Name" && (sortOrder === "asc" ? "▲" : "▼")}
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100"
                  >
                    Type
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="250"
                  >
                    Email
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
                    Team Members
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="200"
                  >
                    Tags
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100"
                  >
                    Invoices
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100"
                  >
                    Proposals
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100"
                  >
                    Chats
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100"
                  >
                    Pending Organizers
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => {
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
                        <Link
                          to={`/clients/accounts/accountsdash/overview/${row.id}`}
                          style={{ textDecoration: "none", color: "#3f51b5" }}
                        >
                          {row.Name}
                        </Link>
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}
                      >
                        {row.Type}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}
                      >
                        {row.Follow
                          ? (() => {
                              const emails = row.Follow.split(",").map(
                                (email) => email.trim()
                              );
                              return (
                                <Tooltip
                                  title={emails.join("\n")}
                                  arrow
                                  placement="top"
                                >
                                  <Typography
                                    sx={{ cursor: "pointer", fontSize: "12px" }}
                                  >
                                    {emails[0]}{" "}
                                    {emails.length > 1
                                      ? `+${emails.length - 1}`
                                      : ""}
                                  </Typography>
                                </Tooltip>
                              );
                            })()
                          : ""}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AvatarGroup max={2}>
                            {row.Team.map((member) => {
                              const size = 25;
                              const initials = member.username
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase();
                              return (
                                <Tooltip
                                  key={member._id}
                                  title={member.username}
                                  placement="top"
                                >
                                  {member.avatar ? (
                                    <Avatar
                                      alt={member.username}
                                      src={member.avatar}
                                      sx={{ width: size, height: size }}
                                    />
                                  ) : (
                                    <Avatar
                                      sx={{
                                        width: size,
                                        height: size,
                                        backgroundColor: "#3f51b5",
                                        color: "#fff",
                                        fontSize: `${size * 0.4}px`,
                                      }}
                                    >
                                      {initials}
                                    </Avatar>
                                  )}
                                </Tooltip>
                              );
                            })}
                          </AvatarGroup>
                        </Box>
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}
                      >
                        {Array.isArray(row.Tags) && row.Tags.length > 0 ? (
                          row.Tags.length > 1 ? (
                            <Tooltip
                              title={
                                <div>
                                  {row.Tags.map((tag) => (
                                    <div
                                      key={tag._id}
                                      style={{
                                        background: tag.tagColour,
                                        color: "#fff",
                                        borderRadius: "8px",
                                        padding: "2px 8px",
                                        marginBottom: "2px",
                                        fontSize: "10px",
                                      }}
                                    >
                                      {tag.tagName}
                                    </div>
                                  ))}
                                </div>
                              }
                              placement="top"
                            >
                              <span
                                style={{
                                  background: row.Tags[0].tagColour,
                                  color: "#fff",
                                  borderRadius: "8px",
                                  padding: "2px 8px",
                                  fontSize: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                {row.Tags[0].tagName}
                              </span>
                            </Tooltip>
                          ) : (
                            row.Tags.map((tag) => (
                              <span
                                key={tag._id}
                                style={{
                                  background: tag.tagColour,
                                  color: "#fff",
                                  borderRadius: "8px",
                                  padding: "2px 8px",
                                  fontSize: "10px",
                                  marginLeft: "3px",
                                }}
                              >
                                {tag.tagName}
                              </span>
                            ))
                          )
                        ) : null}
                        {Array.isArray(row.Tags) && row.Tags.length > 1 && (
                          <span
                            style={{
                              marginLeft: "5px",
                              fontSize: "10px",
                              color: "#555",
                            }}
                          >
                            +{row.Tags.length - 1}
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
                        {row.Invoices}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}
                      >
                        {row.Proposals}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}
                      >
                        {row.Unreadchats}
                      </TableCell>
                      <TableCell
                        style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                        }}
                      >
                        {row.Pendingorganizers}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[1,2,5, 10, 15]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      ) : (
        <Typography
          variant="h6"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          You do not have permission to view accounts.
        </Typography>
      )}

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          id: "tag-drawer",
          sx: {
            borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
            width: isSmallScreen ? "100%" : 700,
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
          {isSendEmailOpen && (
            <Box p={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">New Email</Typography>
                <IconButton onClick={handleFormClose} sx={{ color: "blue" }}>
                  <RxCross2 fontSize="large" />
                </IconButton>
              </Box>

              <Divider sx={{ my: 2 }} />

              <SendAccountEmail
                selectedAccounts={selected}
                onClose={handleFormClose}
              />
            </Box>
          )}

          {isCreateJobOpen && (
            <Box
              p={2}
              sx={{ border: "2px solid red" }}
              className="right-drawers"
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Create job</Typography>
                <IconButton onClick={handleFormClose} sx={{ color: "blue" }}>
                  <RxCross2 fontSize="large" />
                </IconButton>
              </Box>

              <AddJobs selectedAccounts={selected} onClose={handleFormClose} />
            </Box>
          )}

          {isCreateOrganizerOpen && (
            <Box p={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Create Organizer</Typography>
                <IconButton onClick={handleFormClose} sx={{ color: "blue" }}>
                  <RxCross2 fontSize="large" />
                </IconButton>
              </Box>

              <AddBulkOrganizer
                selectedAccounts={selected}
                onClose={handleFormClose}
              />
            </Box>
          )}

          {isManageTagsOpen && (
            <Box p={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Assign Tags for </Typography>

                <Typography variant="body1" sx={{ marginRight: 2 }}>
                  {selected
                    .map((id) => {
                      const account = accountData.find(
                        (account) => account.id === id
                      );
                      return account ? account.Name : id; // Fallback to ID if name is not found
                    })
                    .join(", ")}{" "}
                  {/* Joining account names with commas */}
                </Typography>

                <IconButton onClick={handleFormClose} sx={{ color: "blue" }}>
                  <RxCross2 fontSize="large" />
                </IconButton>
              </Box>

              <Divider sx={{ my: 2 }} />

              <ManageTags
                selectedAccounts={selected}
                onClose={handleFormClose}
              />
            </Box>
          )}

          {isManageTeamOpen && (
            <Box p={2}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">Assign Team for</Typography>

                <Typography variant="body1" sx={{ marginRight: 2 }}>
                  {selected
                    .map((id) => {
                      const account = accountData.find(
                        (account) => account.id === id
                      );
                      return account ? account.Name : id; // Fallback to ID if name is not found
                    })
                    .join(", ")}{" "}
                  {/* Joining account names with commas */}
                </Typography>
                <IconButton onClick={handleFormClose} sx={{ color: "blue" }}>
                  <RxCross2 fontSize="large" />
                </IconButton>
              </Box>

              <Divider sx={{ my: 2 }} />

              <ManageTeams
                selectedAccounts={selected}
                onClose={handleFormClose}
              />
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default FixedColumnTable;

{
  /* <TableCell
                      style={{ display: "flex", alignItems: "center" }}
                      height="40"
                    >
                      {row.Team.map((member) => {
                        // Generate initials from the username
                        const initials = member.username
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase();

                        return (
                          <Tooltip
                            key={member._id}
                            title={member.username}
                            placement="top"
                          >
                            <span
                              style={{
                                display: "inline-block",
                                backgroundColor: "#3f51b5", // Customize badge color as needed
                                color: "#fff",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: "bold",
                                marginRight: "5px",
                                cursor: "pointer",
                              }}
                            >
                              {initials}
                            </span>
                          </Tooltip>
                        );
                      })}
                    </TableCell> */
}
{
  /* <TableCell>
<AvatarGroup max={2}>
      <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
      <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
      <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
      <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
      <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
    </AvatarGroup>
</TableCell> */
}
{
  /* {sortConfig.key === "Name" && (sortConfig.direction === "asc" ? "↑" : "↓")} */
}
{
  /* {sortConfig.key === "Name"
                    ? sortConfig.direction === "asc"
                      ? "↑"
                      : "↓"
                    : null} */
}
{
  /* <TableCell width="100">Pending Signatures</TableCell> */
}
{
  /* <TableCell width="100">Credits</TableCell> */
}
{
  /* <TableCell width="100">Tasks</TableCell> */
}
{
  /* <TableCell width="100">Last Login</TableCell> */
}
{
  /* <TableCell>{row.Credits}</TableCell> */
}
{
  /* <TableCell>{row.Tasks}</TableCell> */
}
{
  /* <TableCell>{row.Pendingsignatures}</TableCell> */
}
{
  /* <TableCell>{row.Lastlogin}</TableCell> */
}

{
  /* <TableContainer
            component={Paper}
            style={{ width: "100%", overflowX: "auto" }}
          >
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
                    }}
                  >
                    <Checkbox
                      checked={selected.length === accountData.length}
                      onChange={() => {
                        if (selected.length === accountData.length) {
                          setSelected([]);
                        } else {
                          const allSelected = accountData.map(
                            (item) => item.id
                          );
                          setSelected(allSelected);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell
                    // onClick={() => handleSort("Name")}
                    onClick={() => {
                      if (sortBy === "Name") {
                        // Toggle sorting order if the same column is clicked
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        // Set a new column to sort by
                        setSortBy("Name");
                        setSortOrder("asc");
                      }
                    }}
                    style={{
                      cursor: "pointer",
                      position: "sticky",
                      left: 50,
                      zIndex: 1,
                      background: "#fff",
                    }}
                    width="200"
                  >
                    AccountName{" "}
                    {sortBy === "Name" && (sortOrder === "asc" ? "▲" : "▼")}
                  </TableCell>
                  <TableCell width="100">Type</TableCell>
                  <TableCell width="250">Email</TableCell>
                  <TableCell width="100" height="60">
                    Team Members
                  </TableCell>
                  <TableCell width="100">Tags</TableCell>
                  <TableCell width="100">Invoices</TableCell>
                  <TableCell width="100">Proposals</TableCell>
                  <TableCell width="100">Chats</TableCell>
                  <TableCell width="100">Pending Organizers</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => {
                  const isSelected = selected.indexOf(row.id) !== -1;
                  return (
                    <TableRow
                      key={row.id}
                      hover
                      onClick={() => handleSelect(row.id)}
                      role="checkbox"
                      tabIndex={-1}
                      selected={isSelected}
                    >
                      <TableCell
                        padding="checkbox"
                        style={{
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          background: "#fff",
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
                        }}
                      >
                        <Link
                          to={`/clients/accounts/accountsdash/overview/${row.id}`}
                        >
                          {row.Name}
                        </Link>
                      </TableCell>
                      <TableCell>{row.Type}</TableCell>
                      <TableCell>
                        {row.Follow
                          ? (() => {
                              const emails = row.Follow.split(",").map(
                                (email) => email.trim()
                              );
                              return (
                                <Tooltip
                                  title={emails.join("\n")}
                                  arrow
                                  placement="top"
                                >
                                  <Typography
                                    sx={{ cursor: "pointer", fontSize: "15px" }}
                                  >
                                    {emails[0]}{" "}
                                    {emails.length > 1
                                      ? `+${emails.length - 1}`
                                      : ""}
                                  </Typography>
                                </Tooltip>
                              );
                            })()
                          : ""}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AvatarGroup max={2}>
                            {row.Team.map((member) => {
                              const size = 25;
                              // Generate initials from the username
                              const initials = member.username
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase();

                              return (
                                <Tooltip
                                  key={member._id}
                                  title={member.username}
                                  placement="top"
                                >
                                  {member.avatar ? (
                                    <Avatar
                                      alt={member.username}
                                      src={member.avatar}
                                      sx={{ width: size, height: size }}
                                    />
                                  ) : (
                                    <Avatar
                                      sx={{
                                        width: size,
                                        height: size,
                                        backgroundColor: "#3f51b5",
                                        color: "#fff",
                                        fontSize: `${size * 0.4}px`,
                                      }}
                                    >
                                      {initials}
                                    </Avatar>
                                  )}
                                </Tooltip>
                              );
                            })}
                          </AvatarGroup>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {Array.isArray(row.Tags) && row.Tags.length > 0 ? (
                          row.Tags.length > 1 ? (
                            <Tooltip
                              title={
                                <div>
                                  {row.Tags.map((tag) => (
                                    <div
                                      key={tag._id}
                                      style={{
                                        background: tag.tagColour,
                                        color: "#fff",
                                        borderRadius: "8px",
                                        padding: "2px 8px",
                                        marginBottom: "2px",
                                        fontSize: "10px",
                                      }}
                                    >
                                      {tag.tagName}
                                    </div>
                                  ))}
                                </div>
                              }
                              placement="top"
                            >
                              <span
                                style={{
                                  background: row.Tags[0].tagColour, // Show color of the first tag
                                  color: "#fff",
                                  borderRadius: "8px",
                                  padding: "2px 8px",
                                  fontSize: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                {row.Tags[0].tagName}
                              </span>
                            </Tooltip>
                          ) : (
                            row.Tags.map((tag) => (
                              <span
                                key={tag._id}
                                style={{
                                  background: tag.tagColour,
                                  color: "#fff",
                                  borderRadius: "8px",
                                  padding: "2px 8px",
                                  fontSize: "10px",
                                  marginLeft: "3px",
                                }}
                              >
                                {tag.tagName}
                              </span>
                            ))
                          )
                        ) : null}
                        {Array.isArray(row.Tags) && row.Tags.length > 1 && (
                          <span
                            style={{
                              marginLeft: "5px",
                              fontSize: "10px",
                              color: "#555",
                            }}
                          >
                            +{row.Tags.length - 1}
                          </span>
                        )}
                      </TableCell>

                      <TableCell>{row.Invoices}</TableCell>

                      <TableCell>{row.Proposals}</TableCell>
                      <TableCell>{row.Unreadchats}</TableCell>
                      <TableCell>{row.Pendingorganizers}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer> */
}
