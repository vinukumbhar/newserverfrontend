import React, { useEffect, useState, useMemo, useContext } from "react";
import {
  InputAdornment,
  FormControl,
  OutlinedInput,
  Container,
  Box,
  Typography,
  Divider,
  IconButton,
  Modal,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoginContext } from "../Sidebar/Context/Context";
import Drawer from "@mui/material/Drawer";
import { useTheme, useMediaQuery } from "@mui/material";
import Switch from "react-switch";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { SlQuestion } from "react-icons/sl";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
// import axios from "axios";
import ImageCropper from "../Settings/ImageCropper";
const UpdateTeamMember = () => {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const WINDOWS_PORT = process.env.REACT_APP_SERVER_URI;

  const { id } = useParams();
  console.log(id);
  const [open, setOpen] = useState(false);

  const [isEditable, setIsEditable] = useState(false);
  const [showSaveButtons, setShowSaveButtons] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editable, setEditable] = useState(false);
  const [logindetails, setLoginDetails] = useState(false);
  const [phonenumber, setPhoneNumber] = useState("");
  const handleLoginDetails = () => {
    setLoginDetails(!logindetails); // Set to true to show the text
  };
const handleCloseLoginDetials=()=>{
  setLoginDetails(!logindetails);
}
  // const handleOpen = () => {
  //   setOpen(true);
  //   setEditable(true); // Enable editing when modal is opened
  // };
  const handleEditClick = () => {
    setIsEditable(!isEditable);
    setShowSaveButtons(!showSaveButtons);
    // setOpen(true);
  };
  const handleCancelButtonClick = () => {
    setShowSaveButtons(false);
    setIsEditable(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [error, setError] = useState(""); // Error state

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Check if file size exceeds 1MB (1048576 bytes)
      if (file.size > 1048576) {
        setError("File size exceeds 1MB. Please upload a smaller file.");
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const width = img.width;
        const height = img.height;

        // Check if the image size exceeds 512x512 pixels
        if (width > 512 || height > 512) {
          setError(
            "Image dimensions exceed 512x512 pixels. Please resize the image."
          );
        } else {
          // File is valid, proceed with setting the file
          setError("");
          setSelectedFile(file);
          setProfilePicture(URL.createObjectURL(file)); // For displaying the preview
        }
      };
    }
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   console.log(file); // Check if the file is being logged correctly
  //   if (file) {
  //     setSelectedFile(file);
  //   }
  // };

  //right side form
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);
  const handleNewDrawerClose = () => {
    setIsNewDrawerOpen(false);
  };
  //integration
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
  const [isCheckedFilterTemplates, setIsCheckedFilterTemplates] =
    useState(false);
  const [isCheckedTemplates, setIsCheckedTemplates] = useState(false);
  const [isCheckedMarketplace, setIsCheckedMarketplace] = useState(false);
  const [isCheckedInvoices, setIsCheckedInvoices] = useState(false);
  const [isCheckedJobRecurrences, setIsCheckedJobRecurrences] = useState(false);
  const [isCheckedRatesTimeEntries, setIsCheckedRatesTimeEntries] =
    useState(false);
  const [isCheckedAllAccounts, setIsCheckedAllAccounts] = useState(false);
  const [isCheckedCustomFields, setIsCheckedCustomFields] = useState(false);
  const [isCheckedAllContacts, setIsCheckedAllContacts] = useState(false);
  const [isCheckedTeammates, setIsCheckedTeammates] = useState(false);
  const [isCheckedProposals, setIsCheckedProposals] = useState(false);
  const [isCheckedViewReporting, setIsCheckedViewReporting] = useState(false);
  const [isCheckedEmail, setIsCheckedEmail] = useState(false);
  const [isCheckedTranscripts, setIsCheckedTranscripts] = useState(false);
  const [isCheckedOrgnizerAnswers, setIsCheckedOrgnizerAnswers] =
    useState(false);
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

  const handleEdit = async (id) => {
    console.log("Edit action triggered for template id: ", id);
    // updateSidebarData(id);
  };

  const [firstNameValidation, setFirstNameValidation] = useState("");
  const [lastNameValidation, setLastNameValidation] = useState("");
  const [emailValidation, setEmailValidation] = useState("");
  // const updateSidebarData = (targetLabel, newPermission) => {
  //   // console.log("janavi", teamMemberUserId);
  //   let data = JSON.stringify({
  //     targetLabel: targetLabel,
  //     newPermission: newPermission,

  //   });

  //   let config = {
  //     method: "patch",
  //     maxBodyLength: Infinity,
  //     url: "http://127.0.0.1:7000/api/permissions/678a0f33cee4de78198a70de",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     data: data,
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       console.log("updtaed sidebar",JSON.stringify(response.data));
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const handleUpdateTeamMember = () => {
    if (firstName !== "" && firstNameValidation !== "") {
      setFirstNameValidation("First Name can't be blank");
    } else {
      setFirstNameValidation("");
    }

    // Validation for Last Name
    if (lastName !== "" && lastNameValidation !== "") {
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
        role: selectedOption,
        email: email,
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
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${LOGIN_API}/admin/teammember/${id}`, requestOptions)
        .then((response) => {
          if (!response.ok) {
            toast.error("Team member with this email already exists.");
          } else {
            return response.json();
          }
        })
        .then((result) => {
          if (result) {
            console.log(result);
            // toast.success("Team member updated successfully.");
            toast.success("Tagdata deleted successfully");
            handleNewDrawerClose();
          }
        })

        .catch((error) => console.error(error));
    }
  };
  const handleSaveButtonClick = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      phoneNumber: phonenumber,
    });

    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const url = `${LOGIN_API}/admin/teammember/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        // toast.success("Data updated successful!");
        updateProfilePicture();
        setIsEditable(false);
        setShowSaveButtons(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred!");
      });
  };

  const [teamMemeberData, setTeamMemeberData] = useState();

  useEffect(() => {
    fetchInvoiceTemp(id);
  }, []);
  const [teamMemberUserId, setTeamMemberUserId] = useState("");

  const fetchInvoiceTemp = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${LOGIN_API}/admin/teammember/`;

    fetch(url + id, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const teamMembers = result;
        console.log(teamMembers);
        console.log(teamMembers.teamMember.userid);
        setTeamMemeberData(teamMembers.teamMember);
        setTeamMemberUserId(teamMembers.teamMember.userid);
        setFirstName(teamMembers.teamMember.firstName);
        setMiddleName(teamMembers.teamMember.middleName);
        setLastName(teamMembers.teamMember.lastName);
        setEMail(teamMembers.teamMember.email);
        setSelectedOption(teamMembers.teamMember.role);
        setPhoneNumber(teamMembers.teamMember.phoneNumber);
        setIsCheckedPayments(teamMembers.teamMember.managePayments);
        setIsCheckedPipelines(teamMembers.teamMember.managePipelines);
        setIsCheckedTimeEntries(teamMembers.teamMember.manageTimeEntries);
        setIsCheckedAccounts(teamMembers.teamMember.manageAccounts);
        setIsCheckedTags(teamMembers.teamMember.manageTags);
        setIsCheckedOrganizers(teamMembers.teamMember.manageOrganizers);
        setIsCheckedFirmBalance(teamMembers.teamMember.chargeFirmBalance);

        setIsCheckedContacts(teamMembers.teamMember.manageContacts);
        setIsCheckedSite(teamMembers.teamMember.manageSites);

        setIsCheckedServices(teamMembers.teamMember.manageServices);
        setIsCheckedFilterTemplates(
          teamMembers.teamMember.managePublicFilterTemplates
        );
        setIsCheckedTemplates(teamMembers.teamMember.manageTemplates);

        setIsCheckedMarketplace(teamMembers.teamMember.manageMarketPlace);
        setIsCheckedInvoices(teamMembers.teamMember.manageInvoices);

        setIsCheckedJobRecurrences(teamMembers.teamMember.manageJobRecurrence);
        setIsCheckedRatesTimeEntries(
          teamMembers.teamMember.manageRatesinTimeEntries
        );
        setIsCheckedAllAccounts(teamMembers.teamMember.viewallAccounts);
        setIsCheckedCustomFields(teamMembers.teamMember.manageCustomFields);
        setIsCheckedAllContacts(teamMembers.teamMember.viewAllContacts);

        setIsCheckedTeammates(teamMembers.teamMember.assignTeamMates);
        setIsCheckedProposals(teamMembers.teamMember.manageProposals);
        setIsCheckedViewReporting(teamMembers.teamMember.viewReporting);
        setIsCheckedEmail(teamMembers.teamMember.manageEmails);
        setIsCheckedTranscripts(teamMembers.teamMember.manageIRSTranscripts);
        setIsCheckedOrgnizerAnswers(
          teamMembers.teamMember.editOrganizersAnswers
        );
        setIsCheckedDocuments(teamMembers.teamMember.manageDocuments);

        const profilePicFilename = teamMembers.teamMember.profilePicture
          .split("\\")
          .pop(); // Extract filename

        setProfilePicture(`${LOGIN_API}/uploads/${profilePicFilename}`); // Use the correct URL
      })
      .catch((error) => console.error(error));
  };
  const [profilePicture, setProfilePicture] = useState("");
  const updateProfilePicture = () => {
    const formdata = new FormData();

    if (selectedFile) {
      // Check directly if selectedFile is set
      formdata.append("ProfilePicture", selectedFile);
      console.log(selectedFile); // Debugging: Log the selected file

      const requestOptions = {
        method: "PATCH",
        body: formdata,
        redirect: "follow",
      };

      fetch(`${LOGIN_API}/admin/teammember/${id}`, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    } else {
      console.error("No file selected"); // This will execute if no file is selected
    }
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
      const response = await fetch(
        `${LOGIN_API}/common/user/email/getuserbyemail/${enteredEmail}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
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
    console.log(enteredEmail);
    setEMail(enteredEmail);
    // Check if email exists
    const exists = await checkEmailExists(enteredEmail);
    setEmailValidation(exists ? "Email already exists" : "");
  };

  //for password
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  //for confiem password
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickConfirmShowPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpConfirmPassword = (event) => {
    event.preventDefault();
  };

  /// Integration
  const { _id, token } = useParams();
  // console.log(_id);
  // console.log(token);

  const [values, setValues] = useState();
  const [passShow, setPassShow] = useState(false);
  const [cpassShow, setCPassShow] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState("");
  const [confirmPasswordValidation, setConfirmPasswordValidation] =
    useState("");
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleConfirmPasswordPaste = (e) => {
    const pastedText = e.clipboardData.getData("text");
    setConfirmPassword(pastedText);
  };
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    validatePassword(password, newConfirmPassword);
  };

  const validatePassword = (newPassword) => {
    // Check if newPassword is defined before performing operations
    if (typeof newPassword !== "undefined") {
      // Example validation criteria: password length >= 8 characters, contains at least one number and one letter
      const hasNumber = /\d/.test(newPassword);
      const hasLetter = /[a-zA-Z]/.test(newPassword);
      const isValid = newPassword.length >= 8 && hasNumber && hasLetter;
      setPasswordValid(isValid);
    }
  };
  // const { logindata } = useContext(LoginContext);
  console.log(teamMemberUserId);
  const updatePassword = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email,
      password: password,
      cpassword: password,
      userid: teamMemberUserId,
    });
    console.log(raw);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`${LOGIN_API}/teammemberpasswordupdate`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };
  const handleDelete = () => {
    setSelectedFile(null);
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700", // Green color for active status
      color: "#44b700",
      width: 12,
      height: 12,
      borderRadius: "50%",
      border: "2px solid white", // White border to separate it from the avatar
    },
  }));
  const [image, setImage] = useState(null); // The original image
  const [croppedImage, setCroppedImage] = useState(""); // The cropped image

  // Fetch the last uploaded image when the page loads
  useEffect(() => {
    axios
      .get("http://127.0.0.1/lastimage")
      .then((response) => {
        const imageUrl = response.data.imageUrl;
        setCroppedImage(imageUrl); // Set the last uploaded image URL as the profile picture
        console.log("viayak",imageUrl)
      })
      .catch((error) => {
        console.error("Error fetching last image:", error);
      });
  }, []);
  // const imageUrlWithCacheBuster = `${croppedImage}`;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result); // Set the base64 image data
        console.log("vinayak",reader.result)
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCroppedImage = (cropped) => {
    setCroppedImage(cropped); // Set the cropped image data
    setImage(null); // Hide the cropper
  };

  const handleSubmit = async () => {
    if (croppedImage) {
      try {
        // Convert the blob URL to a Blob object
        const response = await fetch(croppedImage);
        const blob = await response.blob();

        // Create a File object (optional: you can give it a name and MIME type)
        const file = new File([blob], "cropped_image.jpg", { type: blob.type });

        // Prepare FormData
        const formData = new FormData();
        formData.append("image", file); // Add the File object

        // Make POST request using axios
        axios
          .post("http://127.0.0.1/userprofilepic", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log("Image uploaded successfully:", response.data);
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      } catch (error) {
        console.error("Error converting blob URL to Blob:", error);
      }
    } else {
      console.error("No cropped image to send!");
    }
  };
  return (
    <Box sx={{ padding: 3 }}>
      <Box display={"flex"} alignItems={"center"} mb={1} gap={2}>
        <ArrowBackIcon sx={{ color: "#1976d3", fontSize: 50 }} />
        <Typography variant="h4">Update Team Member</Typography>
      </Box>

      <Divider />
      <Box mt={2} flexGrow={1} padding={2}>
        <Grid container spacing={2} columns={16}>
          <Grid xs={8}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography>
                <b>Personal details</b>
              </Typography>
              <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar
                    alt="User Name"
                    src={croppedImage  || "default_image_url"}
                    sx={{ width: 40, height: 40 }}
                  />
                </StyledBadge>
              <Box>
                <IconButton onClick={handleEditClick}>
                  <BorderColorIcon sx={{ color: "#1976d3" }} />
                </IconButton>
              </Box>
            </Box>
            {isEditable && (
              <Box>
                <Box sx={{ display: "flex", gap: 2 }} mt={2}>
                  <Box>
                    <Typography>First Name</Typography>
                    <TextField
                      value={firstName}
                      margin="normal"
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      fullWidth
                      size="small"
                      disabled={!isEditable}
                    />
                  </Box>
                  <Box>
                    <Typography>Middle Name</Typography>
                    <TextField
                      value={middleName}
                      margin="normal"
                      onChange={(e) => setMiddleName(e.target.value)}
                      placeholder="Middle Name"
                      fullWidth
                      size="small"
                      disabled={!isEditable}
                    />
                  </Box>
                  <Box>
                    <Typography>Last Name</Typography>
                    <TextField
                      value={lastName}
                      margin="normal"
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      fullWidth
                      size="small"
                      disabled={!isEditable}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography>Phone Number</Typography>
                  <TextField
                    margin="normal"
                    value={phonenumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number"
                    fullWidth
                    size="small"
                    disabled={!isEditable}
                  />
                </Box>


                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="100vh"
                  sx={{ bgcolor: "#f5f5f5" }}
                >
                  <Typography variant="h4" gutterBottom>
                    React Easy Crop with Avatar
                  </Typography>

                  {croppedImage ? (
                    <Avatar
                      src={croppedImage}
                      sx={{ width: 120, height: 120, mb: 2 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 120, height: 120, mb: 2 }} />
                  )}

                  {!image && (
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ mb: 2 }}
                    >
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                      />
                    </Button>
                  )}

                  {image && (
                    <ImageCropper
                      image={image}
                      onCroppedImage={handleCroppedImage}
                    />
                  )}

                  {croppedImage && (
                    <Button
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={handleSubmit}
                    >
                      Submit Image
                    </Button>
                  )}
                </Box>
                {showSaveButtons && (
                  <Box display="flex" alignItems="center" gap={2} mt={2}>
                    <Button
                      variant="contained"
                      onClick={handleSaveButtonClick}
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
                      onClick={handleCancelButtonClick}
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
                )}
              </Box>
            )}
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              mt={2}
            >
              <Typography>
                <b>Login details</b>
              </Typography>
              <IconButton onClick={handleLoginDetails}>
                <BorderColorIcon sx={{ color: "#1976d3" }} />
              </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <label className="tag-input-label">Email</label>
              <TextField
                placeholder="Email"
                disabled
                fullWidth
                margin="normal"
                size="small"
                value={email}
                onChange={handleEmail}
                sx={{ backgroundColor: "#fff" }}
              />
            </Box>
            {logindetails && (
              <>
                <Box>
                  <Box mt={2}>
                    <Typography htmlFor="password">Password</Typography>
                    <OutlinedInput
                      type={showPassword ? "text" : "password"}
                      value={password}
                      size="small"
                      placeholder="Password"
                      onChange={handlePasswordChange}
                      sx={{ width: "100%", borderRadius: "10px", mt: 1 }}
                      endAdornment={
                        <InputAdornment
                          position="end"
                          sx={{ cursor: "pointer" }}
                          onClick={handleTogglePasswordVisibility}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </InputAdornment>
                      }
                    />
                              
                  </Box>
                  <Box>
                    <Typography htmlFor="confirmPassword">
                      Confirm Password
                    </Typography>
                    <OutlinedInput
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      size="small"
                      placeholder="Confirm Password"
                      onChange={handleConfirmPasswordChange}
                      onPaste={handleConfirmPasswordPaste} // Allow pasting
                      sx={{ width: "100%", borderRadius: "10px", mt: 1 }}
                      endAdornment={
                        <InputAdornment
                          position="end"
                          sx={{ cursor: "pointer" }}
                          onClick={handleTogglePasswordVisibility}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </InputAdornment>
                      }
                    />
                  </Box>
                </Box>
                <Box mt={2} display="flex" alignItems="center" gap={3}>
                  <Button variant="contained" onClick={updatePassword} sx={{
                        backgroundColor: "var(--color-save-btn)", // Normal background

                        "&:hover": {
                          backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                        },
                        borderRadius: "15px",
                        width: "80px",
                      }}>
                    Save
                  </Button>
                  <Button
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
                    onClick={handleCloseLoginDetials}
                    // Adding right margin to separate buttons
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            )}
          </Grid>

          <Grid xs={8}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography>
                <b>Access rights</b>
              </Typography>
              <IconButton>
                <BorderColorIcon
                  onClick={() => {
                    handleEdit(id);
                    setIsNewDrawerOpen(true);
                  }}
                  sx={{ color: "#1976d3" }}
                />
              </IconButton>
            </Box>

            <Box>
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
                <Box
                  role="presentation"
                  sx={{ borderRadius: isSmallScreen ? "0" : "15px" }}
                >
                  <Box>
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px",
                      }}
                    >
                      <Typography sx={{ fontWeight: "bold" }} variant="h4">
                        {" "}
                        Edit team member
                      </Typography>
                      <CloseRoundedIcon
                        onClick={handleNewDrawerClose}
                        style={{ cursor: "pointer" }}
                      />
                    </Box>
                    <Divider />
                  </Box>
                  <form style={{ margin: "15px" }}>
                    <Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <label className="tag-input-label">First Name</label>
                          <TextField
                            placeholder="First Name"
                            onChange={handleFirstName}
                            // onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                            fullWidth
                            margin="normal"
                            size="small"
                            sx={{ backgroundColor: "#fff" }}
                          />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <label className="tag-input-label">Middle Name</label>
                          <TextField
                            placeholder="Middle Name"
                            onChange={handleMiddleName}
                            value={middleName}
                            fullWidth
                            margin="normal"
                            size="small"
                            sx={{ backgroundColor: "#fff" }}
                          />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <label className="tag-input-label">Last Name</label>
                          <TextField
                            placeholder="Last Name"
                            onChange={handleLastName}
                            value={lastName}
                            fullWidth
                            margin="normal"
                            size="small"
                            sx={{ backgroundColor: "#fff" }}
                          />
                        </Box>
                      </Box>

                      <Box>
                        <InputLabel sx={{ color: "black" }}>Email</InputLabel>
                        <TextField
                          // margin="normal"
                          fullWidth
                          name="email"
                          id="email"
                          value={email}
                          // onChange={handleEmail}
                          placeholder="Email"
                          size="small"
                          sx={{ mt: 2 }}
                        />
                      </Box>

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

                      <Box m={1.5}>
                        {selectedOption === "employee" && (
                          <Box className="rights" style={{ marginTop: "10px" }}>
                            <Box
                              style={{
                                display: "flex",
                                gap: "8px",
                                alignItems: "center",
                              }}
                            >
                              <p>Access Rights</p>
                              <SlQuestion
                                style={{ color: "blue", cursor: "pointer" }}
                              />
                            </Box>

                            <Box sx={{ p: 2 }}>
                              <Grid container spacing={2} columns={16}>
                                <Grid xs={8}>
                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchPayments}
                                      // onChange={(checked) => {
                                      //   handleSwitchPayments(checked);
                                      //   updateSidebarData(
                                      //     "Manage payments",
                                      //     checked
                                      //   );
                                      // }}
                                      checked={isCheckedPayments}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage payments
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchPipelines}
                                      // onChange={(checked) => {
                                      //   handleSwitchPipelines(checked);
                                      //   updateSidebarData(
                                      //     "Pipeline Templates",
                                      //     checked
                                      //   );
                                      // }}
                                      checked={isCheckedPipelines}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage pipelines
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchTime}
                                      checked={isCheckedTimeEntries}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage time entries
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchAccounts}
                                      checked={isCheckedAccounts}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage accounts
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchTags}
                                      // onChange={(checked) => {
                                      //   handleSwitchTags(checked);
                                      //   updateSidebarData(
                                      //     "Tags",
                                      //     checked
                                      //   );
                                      // }}
                                      checked={isCheckedTags}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage tags
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchOrganizers}
                                      checked={isCheckedOrganizers}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage organizers
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchFirmBalance}
                                      checked={isCheckedFirmBalance}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage firm balance
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchContacts}
                                      checked={isCheckedContacts}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage contacts
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchSite}
                                      checked={isCheckedSite}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage site
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchServices}
                                      // onChange={(checked) => {
                                      //   handleSwitchServices(checked);
                                      //   updateSidebarData(
                                      //     "Tags",
                                      //     checked
                                      //   );
                                      // }}
                                      checked={isCheckedServices}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage services
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchFilterTemplates}
                                      checked={isCheckedFilterTemplates}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage public filter templates
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchTemplates}
                                      // onChange={(checked) => {
                                      //   handleSwitchTemplates(checked);
                                      //   updateSidebarData("Templates", checked);
                                      // }}
                                      checked={isCheckedTemplates}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage templates
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchMarketplace}
                                      checked={isCheckedMarketplace}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage marketplace
                                    </p>
                                  </Box>
                                </Grid>
                                <Grid xs={8}>
                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchInvoices}
                                      checked={isCheckedInvoices}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage invoices
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchJobRecurrences}
                                      checked={isCheckedJobRecurrences}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage job recurrences
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchRatesTimeEntries}
                                      checked={isCheckedRatesTimeEntries}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage rates in time entries
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchAllAccounts}
                                      // onChange={(checked) => {
                                      //   handleSwitchAllAccounts(checked);
                                      //   updateSidebarData(
                                      //     "Invoices",
                                      //     checked
                                      //   );
                                      // }}
                                      checked={isCheckedAllAccounts}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      View all accounts
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchCustomFields}
                                      checked={isCheckedCustomFields}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage custome fields
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchTeammates}
                                      checked={isCheckedTeammates}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage teammates
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchAllContacts}
                                      // onChange={(checked) => {
                                      //   handleSwitchAllContacts(checked);
                                      //   updateSidebarData(
                                      //     "Contacts",
                                      //     checked
                                      //   );
                                      // }}
                                      checked={isCheckedAllContacts}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      View all contacts
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchProposals}
                                      // onChange={(checked) => {
                                      //   handleSwitchProposals(checked);
                                      //   updateSidebarData(
                                      //     "Proposal&Els",
                                      //     checked
                                      //   );
                                      // }}
                                      checked={isCheckedProposals}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage proposals
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchEmail}
                                      checked={isCheckedEmail}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Mute emails
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchOrgnizerAnswers}
                                      checked={isCheckedOrgnizerAnswers}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Edit orgnizer answers
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchDocuments}
                                      checked={isCheckedDocuments}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage documents
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchTranscripts}
                                      checked={isCheckedTranscripts}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      Manage IRS Transcripts
                                    </p>
                                  </Box>

                                  <Box
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginBottom: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Switch
                                      onChange={handleSwitchViewReporting}
                                      checked={isCheckedViewReporting}
                                      onColor="#3A91F5"
                                      onHandleColor="#FFF"
                                      handleDiameter={10}
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={32}
                                      className="react-switch"
                                    />
                                    <p style={{ color: "black" }}>
                                      View reporting
                                    </p>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </form>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      margin: "8px",
                      ml: 3,
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={handleUpdateTeamMember}
                      sx={{
                        backgroundColor: "var(--color-save-btn)", // Normal background
    
                        "&:hover": {
                          backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                        },
                        borderRadius: "15px",
                        width: "80px",
                        mt: 2,
                      }}
                    >
                      Save
                    </Button>
                    <Button variant="outlined" onClick={handleNewDrawerClose} sx={{
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
                  }}>
                      Cancel
                    </Button>
                  </Box>
                </Box>
              </Drawer>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UpdateTeamMember;
