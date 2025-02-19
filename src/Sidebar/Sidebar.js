import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Drawer,
  Button,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Outlet, Link } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";
import iconMapping from "./icons/index";
import Logo from "../Images/Logo.svg";
import { FaBars } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
// import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import ContactForm from "../Contact/ContactForm";
import AccountForm from "../Contact/AccountForm";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { AiOutlineLogout } from "react-icons/ai";
import { LoginContext } from "../Sidebar/Context/Context";
import { useLocation } from "react-router-dom";
import { IoMoonOutline } from "react-icons/io5";
import { MdOutlineWbSunny } from "react-icons/md";
import { VscColorMode } from "react-icons/vsc";
import user from "../Images/user.jpg";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
// import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import SearchComponent from "./Search";
// import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
function Sidebar() {
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));
  const location = useLocation();
  const navigate = useNavigate();
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const SIDEBAR_API = process.env.REACT_APP_SIDEBAR_URL;
  const NEW_SIDEBAR_API = process.env.REACT_APP_SIDEBAR_URL;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarItems, setSidebarItems] = useState([]);
  const [newSidebarItems, setNewSidebarItems] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [rightDrawerContent, setRightDrawerContent] = useState(null);
  // const [isDarkMode, setIsDarkMode] = useState(false);

  // useEffect(() => {
  //   // Apply dark mode based on the state
  //   document.documentElement.setAttribute(
  //     "data-theme",
  //     isDarkMode ? "dark" : "light"
  //   );
  // }, [isDarkMode]);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //   useEffect(() => {
  //     const fetchSidebarData = async () => {
  //       try {
  //         const response = await axios.get(`${SIDEBAR_API}/api/`);
  //         const sidebarData = response.data;
  //         setSidebarItems(sidebarData);
  // console.log("sidebar data",sidebarData)
  //       } catch (error) {
  //         console.error("Error fetching sidebar data:", error);
  //       }
  //     };
  //     fetchSidebarData();
  //   }, []);

  // useEffect(() => {
  const fetchSidebarData = async () => {
    try {
      const response = await axios.get(`${SIDEBAR_API}/api/`);
      let sidebarData = response.data;

      // Retrieve team member data from localStorage
      const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
      const userRole = localStorage.getItem("userRole");

      console.log(storedData);
      if (storedData && storedData.teammember) {
        // const { manageTags } = teamMemberData.teammember;
        const {
          manageTags,
          manageServices,
          managePipelines,
          viewAllContacts,
          manageTemplates,
          manageProposals,
          viewallAccounts,
        } = storedData.teammember;

        // Filter or modify sidebar items based on manageTags
        const updatedSidebarData = sidebarData
          .map((item) => {
            // Remove the `Teams & plans` submenu if the user role is TeamMember
            if (
              userRole === "TeamMember" &&
              item.label === "Templates" &&
              item.submenu
            ) {
              item.submenu = item.submenu.filter(
                (subItem) => subItem.label !== "Teams & plans"
              );
            }
            if (
              userRole === "TeamMember" &&
              item.label === "Settings" &&
              item.submenu
            ) {
              item.submenu = item.submenu.filter(
                (subItem) => subItem.label !== "Firm Settings"
              );
            }
            // Remove the `NewTags` submenu if manageTags is false
            if (item.submenu && item.submenu.length > 0) {
              item.submenu = item.submenu.filter(
                (subItem) =>
                  !(
                    (subItem.label === "Tags" && !manageTags) ||
                    (subItem.label === "Services" && !manageServices) ||
                    (subItem.label === "Pipeline Templates" &&
                      !managePipelines) ||
                    (subItem.label === "Firm Templates" && !manageTemplates) ||
                    (subItem.label === "Contacts" && !viewAllContacts) ||
                    (subItem.label === "Proposal&Els" && !manageProposals) ||
                    (subItem.label === "Invoices" && !viewallAccounts)
                  )
              );
            }

            // If the parent item is NewTags and manageTags is false, exclude it
            if (
              (item.label === "Tags" && !manageTags) ||
              (item.label === "Services" && !manageServices) ||
              (item.label === "Pipeline Templates" && !managePipelines) ||
              (item.label === "Firm Templates" && !manageTemplates) ||
              (item.label === "Contacts" && !viewAllContacts) ||
              (item.label === "Proposal&Els" && !manageProposals) ||
              (item.label === "Invoices" && !viewallAccounts)
            ) {
              return null;
            }

            return item;
          })
          .filter(Boolean); // Remove null entries
        setSidebarItems(updatedSidebarData);
        console.log("sidebar", updatedSidebarData);
      } else {
        setSidebarItems(sidebarData);
        console.log("side", sidebarData);
      }
    } catch (error) {
      console.error("Error fetching sidebar data:", error);
    }
  };

  // }, []);

  useEffect(() => {
    if (isDrawerOpen) {
      const fetchNewSidebarData = async () => {
        try {
          const response = await axios.get(`${NEW_SIDEBAR_API}/newsidebar/`);
          let NewSidebarData = response.data;

          // Retrieve team member data if the user is a team member
          const teamMemberData = JSON.parse(
            localStorage.getItem("teamMemberData")
          );
          if (teamMemberData) {
            // Add a flag to indicate restricted access
            // NewSidebarData = NewSidebarData.map(item =>
            //   item.label === "Account" && !teamMemberData.manageAccounts
            //     ? { ...item, restricted: true }
            //     : item
            // );

            NewSidebarData = NewSidebarData.map((item) => {
              if (item.label === "Account" && !teamMemberData.manageAccounts) {
                return { ...item, restricted: true };
              }
              if (item.label === "Contact" && !teamMemberData.manageContacts) {
                return { ...item, restricted: true };
              }
              if (item.label === "Jobs" && !teamMemberData.managePipelines) {
                return { ...item, restricted: true };
              }
              return item;
            });
          }

          setNewSidebarItems(NewSidebarData);
        } catch (error) {
          console.error("Error fetching new sidebar data:", error);
        }
      };

      fetchNewSidebarData();
    }
  }, [isDrawerOpen]);

  //   useEffect(() => {
  //     if (isDrawerOpen) {
  //       const fetchNewSidebarData = async () => {
  //         try {
  //           const response = await axios.get(`${NEW_SIDEBAR_API}/newsidebar/`);
  //           let NewSidebarData = response.data;

  //  // Retrieve team member data if the user is a team member
  //  const teamMemberData = JSON.parse(localStorage.getItem("teamMemberData"));
  //  if (teamMemberData) {
  //    // Add a flag to disable "Accounts" based on manageAccounts
  //    NewSidebarData = NewSidebarData.map(item =>
  //      item.label === "Account" && !teamMemberData.manageAccounts
  //        ? { ...item, disabled: true }
  //        : item
  //    );
  //  }
  //           setNewSidebarItems(NewSidebarData);
  //         } catch (error) {
  //           console.error("Error fetching new sidebar data:", error);
  //         }
  //       };

  //       fetchNewSidebarData();
  //     }
  //   }, [isDrawerOpen]);

  const handleToggleSidebar = () => {
    if (isSmallScreen) {
      setIsSidebarVisible(!isSidebarVisible);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };
  // const [activeSubmenu, setActiveSubmenu] = useState(null);
  // const handleToggleSubmenu = (path, label) => {
  //   setOpenMenu(openMenu === path ? null : path);
  // };
  const handleToggleSubmenu = (menuId, label) => {
    setOpenMenu((prevMenu) => (prevMenu === menuId ? null : menuId)); // Toggle submenu
  };
  // const handleSubmenuClick = (submenuPath) => {
  //   setActiveSubmenu(submenuPath);
  // };
  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleNewDrawerClose = () => {
    setIsRightDrawerOpen(false);
  };
  const handleNewItemClick = (label) => {
    if (label === "Account" || label === "Contact") {
      setRightDrawerContent(label);
      setIsRightDrawerOpen(true);
    }
    if (label === "Jobs") {
      setIsDrawerOpen(false);
    }
  };
  const [theme, setTheme] = useState("light-theme");
  const toggleTheme = () => {
    if (theme === "dark-theme") {
      setTheme("light-theme");
    } else {
      setTheme("dark-theme");
    }
  };
  useEffect(() => {
    document.body.className = theme; // Apply the theme to the body
  }, [theme]);

  //Logout
  const { logindata, setLoginData } = useContext(LoginContext);

  const history = useNavigate();

  const logoutuser = async () => {
    let token = localStorage.getItem("usersdatatoken");
    const url = `${LOGIN_API}/common/login/logout/`;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    const res = await fetch(url, requestOptions);

    const data = await res.json();

    if (data.status === 200) {
      console.log("user logout");
      localStorage.removeItem("usersdatatoken");
      localStorage.removeItem("teamMemberData");
      localStorage.removeItem("userRole");
      Cookies.remove("userToken");
      setLoginData(false);

      history("/login");
    } else {
      console.log("error");
    }
  };
  const [data, setData] = useState(false);
  const [loginsData, setloginsData] = useState("");

  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");
    // Cookies.set("userToken", res.result.token); // Set cookie with duration provided
    // console.log(token);
    const url = `${LOGIN_API}/common/login/verifytoken/`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    //console.log(token);

    const data = await res.json();
    //console.log(data);
    if (data.message === "Invalid token") {
      // console.log("error page");
      navigate("/login");
    } else {
      // console.log("user verify");
      setLoginData(data);
      setloginsData(data.user.id);

      console.log("User role:", data.user.role);

      if (data.user.role === "Admin") {
        localStorage.setItem("userRole", data.user.role);
        fetchUserData(data.user.id);
        // getadminsignup(data.user.id)
        fetchSidebarData();
        navigate("/");
      } else if (data.user.role === "Client") {
        navigate("/clientDash/home");
      } else if (data.user.role === "TeamMember") {
        localStorage.setItem("userRole", data.user.role);
        fetchUserData(data.user.id);
        fectUsersDatabyUserid(data.user.id);
        navigate("/");
      } else {
        toast.error("You are not valid user.");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    }
  };
  useEffect(() => {
    DashboardValid();
    setData(true);
  }, []);

  const [userData, setUserData] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const [userid, setUserid] = useState("");
  const fetchUserData = async (id) => {
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
        console.log("id", result);
        if (result.username) {
          setUsername(result.username);
        }
        if (result.email) {
          setUserData(truncateString(result.email, maxLength)); // Set a maximum length for userData if email exists
          setUserEmail(result.email);
        }
        // console.log(userData)
        setUserid(result._id);
      });
  };

  const fectUsersDatabyUserid = (userid) => {
    console.log("janavi", userid);
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/admin/teammemberbyuserid/${userid}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // Store result in local storage
        localStorage.setItem("teamMemberData", JSON.stringify(result));

        // Immediately retrieve the stored data
        //  const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
        //  console.log("Stored Team Member Data:", storedData);
        fetchSidebarData();
      })
      .catch((error) => console.error(error));
  };

  const truncateString = (str, maxLength) => {
    if (str && str.length > maxLength) {
      return str.substring(0, maxLength) + "..."; // Truncate string if it exceeds maxLength
    } else {
      return str;
    }
  };
  // const getadminsignup = async (id) => {
  //   console.log("tset", id)
  //   const requestOptions = {
  //     method: "GET",
  //     redirect: "follow",
  //   };

  //   const url = `${LOGIN_API}/admin/adminsignup/${id}`;
  //   console.log(id)
  //   fetch(url + loginsData, requestOptions)
  //     .then((response) => response.json())
  //     .then((result) => {
  //       console.log("id", result);
  //       const profilePicFilename = result.admin.profilePicture.split("\\").pop(); // Extract filename

  //       setProfilePicture(`${LOGIN_API}/uploads/${profilePicFilename}`);
  //       console.log(profilePicture)

  //     });
  // };

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const [croppedImage, setCroppedImage] = useState(""); // The cropped image

  // Fetch the last uploaded image when the page loads
  useEffect(() => {
    axios
      .get(`${LOGIN_API}/lastimage`)
      .then((response) => {
        const imageUrl = response.data.imageUrl;
        setCroppedImage(imageUrl); // Set the last uploaded image URL as the profile picture
        console.log("viayak", imageUrl);
      })
      .catch((error) => {
        console.error("Error fetching last image:", error);
      });
  }, []);
  const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    return nameParts
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="grid-container">
      <header className="header">
        <Box
          component="header"
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box className="bar-icon">
            <FaBars
              onClick={handleToggleSidebar}
              style={{ fontSize: "1.7rem" }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 3,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Box>
              <FaPlusCircle className="add-icon" onClick={handleDrawerOpen} />
            </Box>

            {/* <Box
              onClick={toggleTheme}
              style={{
                // display: "inline-block",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                transform: isDarkMode ? "scaleX(-1)" : "scaleX(1)",
              }}
            >
              <VscColorMode fontSize="1.5rem" />
            </Box> */}
          </Box>

          <Box>
            <SearchComponent />
          </Box>
          <Box ml={"auto"} mr={3}>
            <Link to="#" className="logout-link">
              <Box className="info">
                <Box
                  onClick={toggleDropdown}
                  style={{ display: "flex", alignItems: "center", gap: "2px" }}
                >
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar
                      alt={username}
                      src={croppedImage || ""}
                      sx={{
                        width: 40,
                        height: 40,
                        backgroundColor: "#f5f5f5",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#555",
                      }}
                    >
                      {!croppedImage && getInitials(username)}
                    </Avatar>
                  </StyledBadge>
                  <Box ml={2}>
                    <Typography
                      style={{ fontWeight: "bold", fontSize: "12px" }}
                    >
                      {username}
                    </Typography>
                    <Typography style={{ fontSize: "10px", color: "#666" }}>
                      {userData}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Link>
          </Box>
          {isDropdownOpen && (
            // <Box
            //   sx={{
            //     position: "absolute",
            //     top: "100px",
            //     right: "0",
            //     width: "230px",
            //     backgroundColor: "#fff",
            //     border: "1px solid #ddd",
            //     mr:'20px',
            //     borderRadius: "8px",
            //     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            //     zIndex: 10,
            //   }}
            // >
            //   <Box
            //     sx={{
            //       padding: "15px",
            //       display: "flex",
            //       alignItems: "center",
            //       gap: "15px",
            //     }}
            //   >
            //      <StyledBadge
            //       overlap="circular"
            //       anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            //       variant="dot"
            //     >
            //       <Avatar
            //         alt="User Name"
            //         src={croppedImage  || "default_image_url"}
            //         sx={{ width: 40, height: 40 }}
            //       />
            //     </StyledBadge>
            //     <Box>
            //     <Typography style={{ fontWeight: "bold",fontSize: "12px", }}>
            //         {username}
            //       </Typography>
            //       <Typography sx={{ fontSize: "10px", color: "#666" }}>
            //         {userEmail}
            //       </Typography>
            //     </Box>
            //   </Box>
            //   <hr sx={{ margin: "0" }} />
            //   <Box sx={{ padding: "15px" }}>
            //     <Box
            //       sx={{
            //         marginTop: "5px",
            //         color: "red",
            //         display: "flex",
            //         alignItems: "center",
            //         cursor: "pointer",
            //       }}
            //       onClick={logoutuser}
            //     >
            //       <AiOutlineLogout style={{ marginRight: "10px" }} />
            //       <Typography>Log out</Typography>
            //     </Box>
            //   </Box>
            // </Box>
            <Box
              sx={{
                position: "absolute",
                top: "100px",
                right: "20px",
                width: "250px",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "10px",
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
                zIndex: 10,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar
                    alt={username}
                    src={croppedImage || ""}
                    sx={{
                      width: 30,
                      height: 30,
                      backgroundColor: "#f5f5f5",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#555",
                    }}
                  >
                    {!croppedImage && getInitials(username)}
                  </Avatar>
                </StyledBadge>
                <Box>
                  <Typography
                    sx={{ fontWeight: "600", fontSize: "13px", color: "#333" }}
                  >
                    {username}
                  </Typography>
                  <Typography sx={{ fontSize: "11px", color: "#777" }}>
                    {userEmail}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ borderTop: "1px solid #eee" }} />

              <Box sx={{ padding: "14px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    color: "red",
                    fontWeight: "500",
                    padding: "8px",
                    borderRadius: "6px",
                    transition: "background 0.3s",
                    "&:hover": {
                      backgroundColor: "#f8d7da",
                    },
                  }}
                  onClick={logoutuser}
                >
                  <AiOutlineLogout size={18} />
                  <Typography sx={{ fontSize: "13px" }}>Log out</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </header>

      <aside
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isSidebarVisible ? "show" : ""}`}
      >
        <IconButton onClick={handleToggleSidebar} className="toggle-button">
          {isCollapsed ? (
            <ChevronRight className="toggle-icon" />
          ) : (
            <ChevronLeft className="toggle-icon" />
          )}
        </IconButton>
        <Box
          component="aside"
          style={{
            width: isCollapsed ? "50px" : "225px",
            padding: 5,
            transition: "width 0.3s",
          }}
        >
          <Box
            sx={{
              pt: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              gap: 1,
            }}
          >
            <img
              src={Logo}
              alt="logo"
              style={{ height: "40px", display: "block" }}
            />
            {!isCollapsed && (
              <Typography variant="h5" className="company-name-text">
                SNP
              </Typography>
            )}
          </Box>
          {/* <Box className='sidebar-contents' sx={{ mt: 2, height: '78vh', overflowY: 'auto' }}>
            <List sx={{ cursor: 'pointer' }}>
              {sidebarItems.map(item => (
                <Box key={item._id}>
                  <ListItem onClick={() => handleToggleSubmenu(item._id, item.label)} component={Link} to={item.path} className="menu-item" sx={{
                    mt: 1, // margin-top: 8px
                    borderRadius: '10px',
                    // color: 'black',

                    transition: 'background-color 0.3s, color 0.3s',
                    '&:hover': {
                      color: '#fff',
                      backgroundColor: '#0000ff',

                      '.menu-icon': {
                        color: '#fff',
                      },
                      '.menu-text': {
                        color: '#fff',
                      }
                    },
                  }}>
                    <ListItemIcon sx={{ fontSize: '1.5rem', }} className="menu-icon">
                      {iconMapping[item.icon] ? React.createElement(iconMapping[item.icon]) : null}
                    </ListItemIcon>
                    {!isCollapsed && <ListItemText primary={item.label} sx={{ ml: -2 }} className="menu-text" />}
                    {!isCollapsed && item.submenu.length > 0 && (
                      <ListItemIcon sx={{ justifyContent: 'end' }}>
                        {openMenu === item._id ? <ExpandLess className="menu-icon" /> : <ExpandMore className="menu-icon" />}
                      </ListItemIcon>
                    )}
                  </ListItem>
                  {item.submenu.length > 0 && (
                    <Collapse in={openMenu === item._id}>
                      <List component="div" disablePadding>
                        {item.submenu.map(subItem => (
                          <ListItem key={subItem.path} component={Link} to={subItem.path} className="menu-item" sx={{
                            mt: 1, // margin-top: 8px
                            borderRadius: '10px',
                            color: 'black',
                            pl: 4,
                            transition: 'background-color 0.3s, color 0.3s',
                            '&:hover': {
                              color: '#fff',
                              backgroundColor: '#0000ff',
                              '.menu-icon': {
                                color: '#fff',
                              },
                              '.menu-text': {
                                color: '#fff',
                              }

                            },
                          }}>
                            <ListItemIcon sx={{ fontSize: '1.2rem', }} className="menu-icon" >
                              {iconMapping[subItem.icon] ? React.createElement(iconMapping[subItem.icon]) : null}
                            </ListItemIcon>
                            {!isCollapsed && <ListItemText primary={subItem.label} sx={{ ml: -2 }} className="menu-text" />}
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </Box>
              ))}
            </List>
            <div className="bottom-content">
              <ul>
                <li>
                  <Link to="#" className="logout-link">
                    <div className="info" >
                      <div>
                      <img
                          src={ user}
                          alt="user"
                          className="user-icon"
                          style={{ height: "55px", width: "55px",borderRadius: "50%" }}
                        />
                      </div>
                      <span className="hidden-text" >
                        <b>{username}</b>
                        <h6>{userData}</h6>
                      </span>

                      <div>
                        <AiOutlineLogout
                          className="logout-icon"
                          onClick={() => {
                            logoutuser();
                          }}
                        />
                      </div>
                    </div>


                  </Link>
                </li>

              </ul>
            </div>
          </Box> */}

          <Box
            className="sidebar-contents"
            sx={{ mt: 2, height: "85vh", overflowY: "auto" }}
          >
            <List sx={{ cursor: "pointer" }}>
              {sidebarItems.map((item) => {
                const isActiveMenu =
                  (item.path !== "/" &&
                    location.pathname.startsWith(item.path)) ||
                  (item.path === "/" && location.pathname === "/") ||
                  item.submenu.some((subItem) =>
                    location.pathname.startsWith(subItem.path)
                  );

                return (
                  <Box key={item._id}>
                    <ListItem
                      onClick={() => handleToggleSubmenu(item._id, item.label)}
                      component={Link}
                      to={item.path}
                      className="menu-item"
                      sx={{
                        mt: 1,
                        borderRadius: "10px",
                        padding: "4px 6px",
                        // border:'1px solid red',
                        backgroundColor: isActiveMenu
                          ? "#E0F7FA"
                          : "transparent",
                        transition: "background-color 0.3s, color 0.3s",
                        "&:hover": {
                          color: "#fff",
                          backgroundColor: "#00ACC1",
                          ".menu-icon": { color: "#fff" },
                          ".menu-text": { color: "#fff" },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{ fontSize: "1.2rem" }}
                        className="menu-icon"
                      >
                        {iconMapping[item.icon]
                          ? React.createElement(iconMapping[item.icon])
                          : null}
                      </ListItemIcon>
                      {!isCollapsed && (
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: "0.9rem", // Adjust size for submenu text
                            fontWeight: 400, // Optional: control weight
                          }}
                          sx={{ ml: -3 }}
                          className="menu-text"
                        />
                      )}
                      {!isCollapsed && item.submenu.length > 0 && (
                        <ListItemIcon sx={{ justifyContent: "end" }}>
                          {openMenu === item._id ? (
                            <ExpandLess className="menu-icon" />
                          ) : (
                            <ExpandMore className="menu-icon" />
                          )}
                        </ListItemIcon>
                      )}
                    </ListItem>

                    {item.submenu.length > 0 && (
                      <Collapse in={openMenu === item._id}>
                        <List component="div" disablePadding>
                          {item.submenu.map((subItem) => {
                            const isActiveSubmenu =
                              location.pathname.startsWith(subItem.path);

                            return (
                              <ListItem
                                key={subItem.path}
                                component={Link}
                                to={subItem.path}
                                className="menu-item"
                                sx={{
                                  mt: 1,
                                  padding: "4px 6px",
                                  borderRadius: "10px",
                                  backgroundColor: isActiveSubmenu
                                    ? "#E0F7FA"
                                    : "transparent",
                                  color: "black",
                                  pl: 4,
                                  transition:
                                    "background-color 0.3s, color 0.3s",
                                  "&:hover": {
                                    color: "#fff",
                                    backgroundColor: "#00ACC1",
                                    ".menu-icon": { color: "#fff" },
                                    ".menu-text": { color: "#fff" },
                                  },
                                }}
                              >
                                <ListItemIcon
                                  sx={{ fontSize: "1.2rem" }}
                                  className="menu-icon"
                                >
                                  {iconMapping[subItem.icon]
                                    ? React.createElement(
                                        iconMapping[subItem.icon]
                                      )
                                    : null}
                                </ListItemIcon>
                                {!isCollapsed && (
                                  <ListItemText
                                    primary={subItem.label}
                                    primaryTypographyProps={{
                                      fontSize: "0.9rem", // Adjust size for submenu text
                                      fontWeight: 400, // Optional: control weight
                                    }}
                                    sx={{ ml: -2 }}
                                    className="menu-text"
                                  />
                                )}
                              </ListItem>
                            );
                          })}
                        </List>
                      </Collapse>
                    )}
                  </Box>
                );
              })}
            </List>

            {/* <div className="bottom-content">
              <ul>
                <li></li>
              </ul>
            </div> */}
          </Box>
        </Box>
      </aside>
      <main className="main">
        <Box
          component="main"
         
        >
          <Outlet />
        </Box>
      </main>
      <Drawer anchor="left" open={isDrawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 200, p: 2, height: "100%" }} className="newSidebar">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              fontWeight="bold"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <FaPlus /> New
            </Typography>
            <RxCross2
              onClick={handleDrawerClose}
              style={{ cursor: "pointer" }}
            />
          </Box>
          <List>
            {newSidebarItems.map((item) => (
              <ListItem
                key={item._id}
                component={Link}
                to={item.path}
                className="menu-item"
                onClick={(e) => {
                  if (item.restricted) {
                    e.preventDefault(); // Prevent navigation
                    toast.error("Access to this feature is restricted.");
                  } else {
                    handleNewItemClick(item.label);
                  }
                }}
                sx={{
                  mt: 1, // margin-top: 8px
                  borderRadius: "10px",
                  padding: "4px 6px",
                  color: "black",
                  transition: "background-color 0.3s, color 0.3s",
                  "&:hover": {
                    color: item.restricted ? "grey" : "#fff",
                    backgroundColor: item.restricted ? "" : "#00ACC1",
                    ".menu-icon": {
                      color: item.restricted ? "grey" : "#fff",
                    },
                    ".menu-text": {
                      color: item.restricted ? "grey" : "#fff",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    fontSize: "1.2rem",
                    color: item.restricted ? "grey" : "#00ACC1",
                  }}
                  className="menu-icon"
                >
                  {iconMapping[item.icon]
                    ? React.createElement(iconMapping[item.icon])
                    : null}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  className="menu-text"
                  primaryTypographyProps={{
                    fontSize: "0.9rem", // Adjust size for submenu text
                    fontWeight: 400, // Optional: control weight
                  }}
                  sx={{ color: item.restricted ? "grey" : "inherit" }}
                />
              </ListItem>
            ))}
          </List>
          {/* <List>
            {newSidebarItems.map((item) => (
              <ListItem
                key={item._id}
                component={Link}
                to={item.path}
                className="menu-item"
                onClick={(e) => {
                  if (item.restricted) {
                    e.preventDefault(); // Prevent navigation
                    toast.error("Access to this feature is restricted.");
                  } else {
                    handleNewItemClick(item.label);
                  }
                }}
                sx={{
                  mt: 1, // margin-top: 8px
                  borderRadius: "10px",
                  color: "black",
                  transition: "background-color 0.3s, color 0.3s",
                  "&:hover": {
                    color: item.restricted ? "grey" : "#fff",
                    backgroundColor: item.restricted ? "" : "#0000ff",
                    ".menu-icon": {
                      color: item.restricted ? "grey" : "#fff",
                    },
                    ".menu-text": {
                      color: item.restricted ? "grey" : "#fff",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    fontSize: "1.2rem",
                    color: item.restricted ? "grey" : "#2c85de",
                  }}
                  className="menu-icon"
                >
                  {iconMapping[item.icon]
                    ? React.createElement(iconMapping[item.icon])
                    : null}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  className="menu-text"
                  primaryTypographyProps={{
                    fontSize: "0.9rem", // Adjust size for submenu text
                    fontWeight: 400, // Optional: control weight
                  }}
                  sx={{ color: item.restricted ? "grey" : "inherit" }}
                />
              </ListItem>
            ))}
          </List> */}
        </Box>
      </Drawer>
      <Drawer
        anchor="right"
        open={isRightDrawerOpen}
        onClose={handleNewDrawerClose}
        classes={{ paper: "custom-right-drawer" }}
      >
        <Box sx={{ width: isSmallScreen ? "100vw" : 650 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          ></Box>
          {rightDrawerContent === "Account" && (
            <AccountForm
              handleNewDrawerClose={handleNewDrawerClose}
              handleDrawerClose={handleDrawerClose}
            />
          )}
          {rightDrawerContent === "Contact" && (
            <ContactForm
              handleNewDrawerClose={handleNewDrawerClose}
              handleDrawerClose={handleDrawerClose}
            />
          )}
        </Box>
      </Drawer>
    </div>
  );
}

export default Sidebar;
