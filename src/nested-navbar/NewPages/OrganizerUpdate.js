import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Drawer,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormGroup,
  Autocomplete,
  Container,
  Box,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Button,
  FormLabel,
  Grid,
  Paper,
  LinearProgress,
  Tooltip,
} from "@mui/material"; // Make sure you have MUI installed
import { ExpandMore, ExpandLess } from "@mui/icons-material";

import { RxCross2 } from "react-icons/rx";
const CreateOrganizerUpdate = ({ OrganizerData, onClose }) => {
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const { data } = useParams();
  const [expandedSection, setExpandedSection] = useState(null);
  const [organizerTemp, setOrganizerTemp] = useState(null);
  const [sections, setSections] = useState([]);
  useEffect(() => {
    fetchOrganizerOfAccount(data);
  }, []);

  const fetchOrganizerOfAccount = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/organizerbyaccount/${data}`;
    console.log(url);
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const selectedOrganizer = result.organizerAccountWise.find(
          (org) => org._id === OrganizerData
        );
        console.log("fdfd", selectedOrganizer);
        setOrganizerTemp(selectedOrganizer);
        // setSelectedAccounts(selectedOrganizer.accountid.accountName)
        // setSelectedOrganizerTemplate(selectedOrganizer.organizertemplateid.organizerName)
        // setOrganizerName(selectedOrganizer.organizertemplateid.organizerName);
        setSections(selectedOrganizer.sections);
        // Loop through the sections and form elements to log text and textvalue
        selectedOrganizer.sections.forEach((section) => {
          console.log(`Section: ${section.name} - ${section.text}`);
          section.formElements.forEach((formElement) => {
            console.log(`Form Element: ${formElement.text}`);
            console.log(`Text Value: ${formElement.textvalue}`);
          });
        });
      })
      .catch((error) => console.error(error));
  };
  console.log(organizerTemp);
  const handleToggleSection = (sectionId) => {
    setExpandedSection((prevExpandedSection) =>
      prevExpandedSection === sectionId ? null : sectionId
    );
  };
  const [drawerOpen, setDrawerOpen] = useState(false); // State to manage Drawer visibility
  const [drawerContent, setDrawerContent] = useState(""); // State to store content for Drawer
  const handleOpenDrawer = (content) => {
    console.log("Opening Drawer with content:", content); // Debugging log
    setDrawerContent(content);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };
  return (
    <Box>
      {sections.length > 0 ? (
        sections.map((section) => (
          <Box key={section.id} sx={{ marginBottom: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{ flexGrow: 1 }}
                onClick={() => handleToggleSection(section.id)}
              >
                {section.name}
              </Typography>
              <IconButton onClick={() => handleToggleSection(section.id)}>
                {expandedSection === section.id ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </IconButton>
            </Box>
            {expandedSection === section.id && (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="form elements table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Questions</strong>
                      </TableCell>
                      <TableCell align="left">
                        <strong>Answer</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {section.formElements.map((formElement) => (
                      <TableRow key={formElement.id}>
                        <TableCell>
                          {formElement.type === "Text Editor"
                            ? "Text Block"
                            : formElement.text}
                        </TableCell>
                        <TableCell>
                          {/* {formElement.type === "Text Editor" ? (
                            <Box
                              sx={{ cursor: "pointer", color: "blue" }}
                              onClick={() => handleOpenDrawer(formElement.text)} // Pass content to Drawer
                            >
                              Display
                            </Box>
                          ) : (
                            formElement.textvalue || "N/A"
                          )} */}

                          {formElement.type === "Radio Buttons" ||
                          formElement.type === "Checkboxes" ||
                          formElement.type === "Dropdown"
                            ? formElement.options
                                .filter((option) => option.selected)
                                .map((option) => option.text)
                                .join(", ") || "N/A"
                            : formElement.textvalue || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        ))
      ) : (
        <Typography variant="body1">Loading sections...</Typography>
      )}
      {/* Drawer Component */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
        <Box sx={{ width: 600, padding: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography>Text Block Content</Typography>
            <RxCross2
              style={{ cursor: "pointer" }}
              onClick={handleCloseDrawer}
            />
          </Box>

          <Box sx={{ marginTop: 1 }}>
            {/* Display the content */}
            <div dangerouslySetInnerHTML={{ __html: drawerContent }} />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CreateOrganizerUpdate;
