import React, { useState,useEffect } from "react";
import "./login.css";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import {Menu, Alert, Box, Typography, FormControl, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, InputLabel, Select, MenuItem, OutlinedInput, TextField } from "@mui/material";
import { Grid } from "@mui/material";
import Cookies from "js-cookie";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { NavLink } from "react-router-dom";
import logo from "../Images/logoAdmin.png";
import { useNavigate } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import android from "../Images/android.png";
import apple from "../Images/apple.png";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const Login = () => {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const history = useNavigate();
  const [agreeToTerms, setAgreeToTerms] = useState(false);
 const [logoutTimer, setLogoutTimer] = useState(null);
  const [inpval, setInpval] = useState({
    email: "",
    password: "",
    expiryTime: "",
  });
const [userList, setUserList] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
   const [anchorEl, setAnchorEl] = React.useState(null);
  const setVal = (e) => {
    const { name, value } = e.target;

    setInpval(() => {
      return {
        ...inpval,
        [name]: value,
      };
    });
  };

  const loginuser = async (e) => {
    console.log(inpval);
    e.preventDefault();
    const { email, password, expiryTime } = inpval;

    if (!email) {
      toast.error("Email is required!");
      return;
    } else if (!email.includes("@")) {
      toast.error("Invalid email format!");
      return;
    }

    if (!password) {
      toast.error("Password is required!");
      return;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    if (!expiryTime) {
      toast.error("Please select the expiration time!");
      return;
    }
    if (!agreeToTerms) {
  toast.error("You must agree to the conditions!");
  return;
}


//     try {
//       const url = `${LOGIN_API}/common/login/generatetoken`;
//       const data = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           password,
//           expiryTime,
//           // username
//         }),
//       });

//       const res = await data.json();
//       // console.log("test token",res.result.token);
// // Decode the token
// const user = jwtDecode(res.result.token);

// // Access the payload
// console.log("test decode",user);

// // Function to handle different roles
// function handleUserRole(role) {
//   switch (role) {
//     case "Admin":
//       console.log("User is an Admin.");
//       // Add logic specific to Admin here
//       break;
//     case "TeamMember":
      

      
//       console.log("User is a Team Member.");
//       // Add logic specific to TeamMember here
//       break;
//     case "Client":
//       console.log("User is a Client.");
//       // Add logic specific to Client here
//       break;
//     default:
//       console.log("Unknown role.");
//       // Handle unknown or undefined role
//       break;
//   }
// }

// // Testing the function
// handleUserRole(user.role);
//       if (res.status === 200) {
//         localStorage.setItem("usersdatatoken", res.result.token);
        
//         Cookies.set("userToken", res.result.token);
//          startLogoutTimer(expiryTime);
//         history("/");
//         setInpval({ ...inpval, email: "", password: "" });

//         Cookies.set("userToken", res.result.token);
//       } else if (res.status === 400) {
//         toast.error("Invalid email or password!");
//       } else {
//         toast.error("An error occurred. Please try again.");
//       }
//     } catch (error) {
//       // console.error("Error:", error);
//       toast.error("An error occurred. Please try again.");
//     }

try {
  const loginUrl = `${LOGIN_API}/common/login/generatetoken`;

  const loginPayload = {
    email,
    password,
    expiryTime,
     username:selectedUser.username
    // Optionally add username if needed: username: selectedUser?.username
  };

  // Enhanced console logging
  console.group("Login Payload Details");
  console.log("Stringified payload:", JSON.stringify(loginPayload));
  console.log("Email:", email);
  console.log("Password length:", password?.length);
  console.log("Expiry time (seconds):", expiryTime);
  console.groupEnd();

  console.log("Sending request to:", loginUrl);

  const loginResponse = await fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginPayload),
  });

  console.log("Response status:", loginResponse.status);

  const loginResult = await loginResponse.json();
  console.log("Full response:", loginResult);

  if (loginResult.status === 200) {
    console.log("Login successful, token received");

    const token = loginResult.result.token;
    const user = jwtDecode(token);
    console.log("Decoded user from token:", user);

    // Handle user role
    function handleUserRole(role) {
      switch (role) {
        case "Admin":
          console.log("User is an Admin.");
          break;
        case "TeamMember":
          console.log("User is a Team Member.");
          break;
        case "Client":
          console.log("User is a Client.");
          break;
        default:
          console.log("Unknown role.");
          break;
      }
    }

    handleUserRole(user.role);

    // Store token
    localStorage.setItem("usersdatatoken", token);
    Cookies.set("userToken", token);

    // Start token expiry timer
    startLogoutTimer(expiryTime);

    // Navigate to home
    history("/");

    // Clear form
    setInpval({ ...inpval, email: "", password: "" });
  } else if (loginResult.status === 400) {
    console.error("Login failed: Invalid email or password.");
    toast.error("Invalid email or password!");
  } else {
    console.error("Login failed with message:", loginResult.message);
    toast.error("An error occurred. Please try again.");
  }
} catch (error) {
  console.error("Unexpected error during login:", error);
  toast.error("An error occurred. Please try again.");
}

  };
const startLogoutTimer = (expiryTime) => {
  let timeout;
  switch(expiryTime) {
    case '1min': timeout = 60 * 1000; break;
    case '5min': timeout = 5 * 60 * 1000; break;
    case '30min': timeout = 30 * 60 * 1000; break;
    case '4hours': timeout = 4 * 60 * 60 * 1000; break;
    case '8hours': timeout = 8 * 60 * 60 * 1000; break;
    default: timeout = 30 * 60 * 1000; // default to 30 minutes
  }

  const timer = setTimeout(() => {
    // Perform logout actions
    localStorage.removeItem("usersdatatoken");
    localStorage.removeItem("teamMemberData");
    localStorage.removeItem("userRole");
    Cookies.remove("userToken");
    history("/login");
    toast.info("Your session has expired. Please login again.");
  }, timeout);

  setLogoutTimer(timer);
};

// Add this useEffect to clear timer on component unmount
useEffect(() => {
  return () => {
    if (logoutTimer) clearTimeout(logoutTimer);
  };
}, [logoutTimer]);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

    const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
 const handleUserSelect = (user) => {
    setSelectedUser(user);
    handleUserMenuClose();
    // You could automatically submit the form here if you want
    // Or just let the user enter the password and then submit
  };
   const checkEmailForUsers = async (email) => {
    if (!email || !email.includes("@")) return;

    try {
      const checkUserUrl = `${LOGIN_API}/common/user/email/getuserbyemail/${email}`;
      const checkUserResponse = await fetch(checkUserUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const userData = await checkUserResponse.json();
      
      if (userData.user && userData.user.length > 1) {
        setUserList(userData.user);
        return true; // multiple users
      } else if (userData.user && userData.user.length === 1) {
        setSelectedUser(userData.user[0]);
        return false; // single user
      } else {
        toast.error("User not found");
        return false;
      }
    } catch (error) {
      console.error("Error checking users:", error);
      return false;
    }
  };

  const handleEmailBlur = async () => {
    if (!inpval.email || !inpval.email.includes("@")) return;
    
    const hasMultipleUsers = await checkEmailForUsers(inpval.email);
    if (hasMultipleUsers) {
      // We'll show the dropdown when the user focuses on the password field
    }
  };

  
  return (
    <Grid
      container
      sx={{
        height: "100vh",
      }}
    >
      <Grid item xs={12} md={6} sx={{ width: "50%" }}>
        <Box className="logininfo">
          <Box mt={2} className="login-logo">
            <img src={logo} alt="" style={{ height: "95px" }} />
          </Box>

          <h1 className="wbtext">Welcome Back</h1>
          <Box sx={{ margin: "10%", textAlign: "center" }}>
            <Typography variant="p" sx={{ color: "white", mx: 8, textAlign: "center", fontSize: "20px", fontWeight: "400" }}>
              "Welcome to 'SNP Tax & Financials', where tax management meets simplicity. Our advanced software streamlines tax processes for individuals, businesses, and professionals, ensuring accuracy and efficiency. Experience a new era of financial ease with SNP Tax & Financials."
            </Typography>
          </Box>

          <Typography variant="p" className="fontchange">
            Please Login to access your account
          </Typography>
          <Box sx={{ position: "fixed", bottom: "10px" }}>
            <Grid container justifyContent="center" spacing={2}>
              {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, index) => (
                <Grid item key={index}>
                  <IconButton color="primary">
                    <Icon sx={{ fontSize: 40, color: "#fff", ml: 3 }} />
                  </IconButton>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={6} sx={{ width: "50%" }}>
        <Box className="logininput">
          <Box className="loginalign">
            <Typography
              variant="h1"
              sx={{
                color: "black",
                fontSize: "35px",
                fontWeight: "700",
                mb: "20px",
                textAlign: "center",
                fontFamily: "sans-serif",
              }}
            >
              Login Account
            </Typography>
            <Typography mb={1}>Email</Typography>

            <TextField fullWidth name="email" placeholder="Enter Your Email" size="small" value={inpval.email} onChange={setVal} id="email" sx={{ mb: 1 }}  onBlur={handleEmailBlur} />




            {selectedUser && (
              <Typography variant="body2" color="text.secondary">
                Logging in as: {selectedUser.username} 
              </Typography>
            )}

            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
              MenuListProps={{
                'aria-labelledby': 'user-menu-button',
              }}
            >
              {userList.map((user) => (
                <MenuItem 
                  key={user._id} 
                  onClick={() => handleUserSelect(user)}
                  selected={selectedUser && selectedUser._id === user._id}
                >
                  {user.username}  ({user.role})
                </MenuItem>
              ))}
            </Menu>
            <Box>
              <Typography mb={1}>Password</Typography>

              <TextField
                fullWidth
                size="small"
                variant="outlined"
                value={inpval.password}
                onChange={setVal}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} onMouseUp={handleMouseUpPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ textAlign: "left", mb: "3%", fontSize: "12px", mt: 1 }}>
                <Link component={NavLink} to="/forgotpass" sx={{ color: "cornflowerblue", textDecoration: "none" }}>
                  Forgot Password?
                </Link>
              </Box>
            </Box>

            <Box>
              <FormControl fullWidth>
                <Typography sx={{ color: "black" }}>Stay signed in for</Typography>
                <Select
                  size="small"
                  margin="normal"
                  value={inpval.expiryTime}
                  onChange={setVal}
                  name="expiryTime"
                  sx={{
                    border: "2px solid rgb(100, 149, 237)",
                    borderRadius: "10px",
                  }}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  <MenuItem value="1min">1 minute</MenuItem>
                  <MenuItem value="5min">5 minute</MenuItem>
                  <MenuItem value="30min">30 minutes</MenuItem>
                  <MenuItem value="4hours">4 hours</MenuItem>
                  <MenuItem value="8hours">8 hours</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box display="flex" alignItems={"center"}>
              {/* <Checkbox id="terms" /> */}
              <Checkbox
  id="terms"
  checked={agreeToTerms}
  onChange={(e) => setAgreeToTerms(e.target.checked)}
/>


              <Typography fontSize="14px" color="#696969" component="label" htmlFor="terms">
                Agree to{" "}
                <Link href="https://policies.google.com/terms?hl=en-US" color="rgb(58, 145, 245)" underline="none">
                  Conditions
                </Link>
              </Typography>
            </Box>

            <Box mt={2}>
              <Button
                onClick={loginuser}
                variant="contained"
                fullWidth
                sx={{
                  borderColor: "primary.main",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  fontSize: "15px",
                  fontWeight: "600",
                  borderRadius: "100px",
                  mt: "10px",
                  ":hover": {
                    backgroundColor: "transparent",
                    borderColor: "primary.main",
                    color: "primary.main",
                    boxShadow: "none",
                    borderWidth: "2px",
                    borderStyle: "solid",
                  },
                }}
              >
                Login
              </Button>
            </Box>

            <p className="donthaveacc">
              Don't have an account?
              <Link to="/signup" className="route-links">
                Sign Up
              </Link>
            </p>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
