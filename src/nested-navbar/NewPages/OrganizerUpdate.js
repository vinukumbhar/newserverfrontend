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
  Switch,
} from "@mui/material"; // Make sure you have MUI installed
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
const CreateOrganizerUpdate = ({ OrganizerData, onClose }) => {
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const { data } = useParams();
  const [expandedSection, setExpandedSection] = useState(null);
  const [organizerTemp, setOrganizerTemp] = useState(null);
  const [sections, setSections] = useState([]);
  const [organizerId, setOrganizerId] = useState("");
  const [showConditional, setShowConditional] = useState(false);
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
        setOrganizerId(selectedOrganizer._id);
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
  const handleCheckboxChange = async (sectionId, formElementId, checked) => {
    try {
      // Call API to update backend
      await axios.patch(
        `${ORGANIZER_TEMP_API}/workflow/orgaccwise/${organizerId}/sections/${sectionId}/form-elements/${formElementId}`,
        { active: checked }
      );

      // Update local state after successful backend update
      const updatedSections = sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            formElements: section.formElements.map((el) => {
              if (el.id === formElementId) {
                return { ...el, active: checked };
              }
              return el;
            }),
          };
        }
        return section;
      });

      setSections(updatedSections);
    } catch (error) {
      console.error("Failed to update active status in backend:", error);
      // Optionally show an error to the user
    }
  };
  // Filter sections based on conditional settings and toggle state
  const filteredSections = sections.filter((section) => {
    // Show section if:
    // 1. Conditional is false OR
    // 2. Conditional is true AND showConditional is true
    return !section.sectionsettings?.conditional || showConditional;
  });
  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={showConditional}
            onChange={(e) => setShowConditional(e.target.checked)}
          />
        }
        label="Show Hidden Questions"
        sx={{ mb: 2 }}
      />
      {filteredSections.length > 0 ? (
        filteredSections.map((section) => (
          <Box key={section.id} sx={{ marginBottom: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{ flexGrow: 1, cursor: "pointer" }}
                onClick={() => handleToggleSection(section.id)}
              >
                {/* {section.text} */}
                {section.text}{" "}
                {section.sectionsettings?.conditional && showConditional && (
                  <Typography
                    component="span"
                    sx={{
                      fontStyle: "italic",
                      color: "gray",
                      fontSize: "0.85rem",
                    }}
                  >
                    (Hidden Section)
                  </Typography>
                )}
              </Typography>
              <Typography
                component="span"
                sx={{
                  fontWeight: "normal",
                  fontSize: "0.9rem",
                  color: "gray",
                  ml: 1,
                }}
              >
                {/* ({section.formElements.filter((el) => el.textvalue).length} /{" "}
                {section.formElements.length}) */}
                (
                {
                  section.formElements.filter(
                    (el) =>
                      el.textvalue &&
                      (!el.questionsectionsettings?.conditional ||
                        showConditional)
                  ).length
                }{" "}
                /{" "}
                {
                  section.formElements.filter(
                    (el) =>
                      !el.questionsectionsettings?.conditional ||
                      showConditional
                  ).length
                }
                )
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
                        <strong>Question</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Answer</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Reviewed</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {/* {section.formElements.map((formElement) => (
                      <TableRow key={formElement.id}>
                        <TableCell>
                          {formElement.type === "Text Editor"
                            ? "Text Block"
                            : formElement.text}
                        </TableCell>
                        <TableCell>
                          {formElement.type === "Text Editor" ? (
                            <Box
                              sx={{ cursor: "pointer", color: "blue" }}
                              onClick={() => handleOpenDrawer(formElement.text)}
                            >
                              Display
                            </Box>
                          ) : (
                            formElement.textvalue || ""
                          )}
                        </TableCell>

                        <TableCell>
                          {formElement.type !== "Text Editor" && (
                            <Checkbox
                              checked={formElement.active || false}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  section.id,
                                  formElement.id,
                                  e.target.checked
                                )
                              }
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))} */}
                    {section.formElements
                      .filter(
                        (formElement) =>
                          !formElement.questionsectionsettings?.conditional ||
                          showConditional
                      )
                      .map((formElement) => (
                        <TableRow key={formElement.id}>
                          <TableCell>
                            {formElement.type === "Text Editor"
                              ? "Text Block"
                              : formElement.text}
                          </TableCell>
                          <TableCell>
                            {formElement.type === "Text Editor" ? (
                              <Box
                                sx={{ cursor: "pointer", color: "blue" }}
                                onClick={() =>
                                  handleOpenDrawer(formElement.text)
                                }
                              >
                                Display
                              </Box>
                            ) : (
                              formElement.textvalue || ""
                            )}
                          </TableCell>
                          <TableCell>
                            {formElement.type !== "Text Editor" && (
                              <Checkbox
                                checked={formElement.active || false}
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    section.id,
                                    formElement.id,
                                    e.target.checked
                                  )
                                }
                              />
                            )}
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

      <Button onClick={onClose}>Back</Button>
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
