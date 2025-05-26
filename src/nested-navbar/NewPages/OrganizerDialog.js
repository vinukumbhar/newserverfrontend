import {
  MenuItem,
  Select,
  FormControl,
  Dialog,
  DialogContent,
  DialogTitlen,
  Typography,
  DialogTitle,
  IconButton,
  Box,
  TextField,
  CircularProgress,
  Button,
} from "@mui/material";

import { LinearProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import dayjs from "dayjs";
const OrganizerDialog = ({ open, handleClose, organizer }) => {
    const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const sections = organizer?.sections; // Assigned const here
  console.log("organizer", organizer);
  const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [selectedYesNoValues, setSelectedYesNoValues] = useState({});
  const [radioValues, setRadioValues] = useState({});
  const [checkboxValues, setCheckboxValues] = useState({});
  const [answeredElements, setAnsweredElements] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [startDate, setStartDate] = useState(dayjs());

  const handleRadioChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setRadioValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };
  const handleCheckboxChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setCheckboxValues((prevValues) => ({
      ...prevValues,
      [key]: {
        ...prevValues[key],
        [value]: !prevValues[key]?.[value],
      },
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const handleYesNoChange = (value, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setSelectedYesNoValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };

  const handleInputChange = (event, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    const { value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [key]: value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };
  const handleDropdownValueChange = (event, elementText, sectionId) => {
    const key = `${sectionId}_${elementText}`;
    setSelectedDropdownValues((prevValues) => ({
      ...prevValues,
      [key]: event.target.value,
    }));
    setAnsweredElements((prevAnswered) => ({
      ...prevAnswered,
      [key]: true,
    }));
  };
  const shouldShowSection = (section) => {
    if (!section.sectionsettings?.conditional) return true;
    const conditions = section.sectionsettings.conditions || [];

    return conditions.every((condition) => {
      if (!condition.question || !condition.answer) return false;

      // Check all possible sections for the answer
      for (const key in radioValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          radioValues[key] === condition.answer
        ) {
          return true;
        }
      }

      for (const key in checkboxValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          checkboxValues[key]?.[condition.answer]
        ) {
          return true;
        }
      }

      for (const key in selectedDropdownValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          selectedDropdownValues[key] === condition.answer
        ) {
          return true;
        }
      }
      // Check Yes/No values
      for (const key in selectedYesNoValues) {
        if (
          key.endsWith(`_${condition.question}`) &&
          selectedYesNoValues[key] === condition.answer
        ) {
          return true;
        }
      }
      return false;
    });
  };

  //   const getVisibleSections = () => sections.filter(shouldShowSection);
  const getVisibleSections = () => (sections || []).filter(shouldShowSection);

  const visibleSections = getVisibleSections();
  const totalSteps = visibleSections.length;

  const shouldShowElement = (element, sectionId) => {
    const settings = element.questionsectionsettings;
    if (!settings?.conditional) return true;
    const conditions = settings?.conditions || [];

    for (const condition of conditions) {
      const { question, answer } = condition;
      if (!question || !answer) continue;

      // Check all possible sections for the answer
      let conditionMet = false;

      // Check radio values
      for (const key in radioValues) {
        if (key.endsWith(`_${question}`) && radioValues[key] === answer) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      // Check checkbox values
      for (const key in checkboxValues) {
        if (key.endsWith(`_${question}`) && checkboxValues[key]?.[answer]) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;

      // Check dropdown values
      for (const key in selectedDropdownValues) {
        if (
          key.endsWith(`_${question}`) &&
          selectedDropdownValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;
      // Check Yes/No values
      for (const key in selectedYesNoValues) {
        if (
          key.endsWith(`_${question}`) &&
          selectedYesNoValues[key] === answer
        ) {
          conditionMet = true;
          break;
        }
      }
      if (conditionMet) continue;
      // If we get here, no condition was met
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (activeStep < totalSteps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleDropdownChange = (event) => {
    const selectedIndex = event.target.value;
    setActiveStep(selectedIndex);
  };

  const handleSubmit = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        sections:
          organizer?.sections?.map((section) => ({
            name: section?.text || "",
            id: section?.id?.toString() || "",
            text: section?.text || "",
            formElements:
              section?.formElements?.map((question) => ({
                type: question?.type || "",
                id: question?.id || "",
                sectionid: section?.id || "", // Using section.id instead of question.sectionid
                options:
                  question?.options?.map((option) => ({
                    id: option?.id || "",
                    text: option?.text || "",
                    selected: getOptionSelectedState(
                      question,
                      option,
                      section.id
                    ),
                  })) || [],
                text: question?.text || "",
                textvalue: getQuestionTextValue(question, section.id),
              })) || [],
          })) || [],
        status: "Completed",
        active: true,
      });

      const requestOptions = {
        method: "PATCH", // or "POST" as needed
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      console.log("raw", raw);
      const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/${organizer._id}`;
      const response = await fetch(url, requestOptions);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update organizer");
      }

      toast.success("Organizer updated successfully");
      handleClose();
    } catch (error) {
      console.error("Error submitting organizer:", error);
      toast.error(
        error.message || "Something went wrong while updating organizer!"
      );
    }
  };

  // Helper function to get the textvalue for a question
  const getQuestionTextValue = (question, sectionId) => {
    const key = `${sectionId}_${question.text}`;

    switch (question.type) {
      case "Free Entry":
      case "Email":
      case "Number":
        return inputValues[key] || "";
      case "Radio Buttons":
        return radioValues[key] || "";
      case "Checkboxes":
        return checkboxValues[key]
          ? Object.keys(checkboxValues[key])
              .filter((k) => checkboxValues[key][k])
              .join(", ")
          : "";
      case "Yes/No":
        return selectedYesNoValues[key] || "";
      case "Dropdown":
        return selectedDropdownValues[key] || "";
      case "Date":
        return startDate?.toISOString() || "";
      case "Text Editor":
        return question.text || "";
      default:
        return "";
    }
  };

  // Helper function to determine if an option is selected
  const getOptionSelectedState = (question, option, sectionId) => {
    const key = `${sectionId}_${question.text}`;

    switch (question.type) {
      case "Radio Buttons":
        return radioValues[key] === option.text;
      case "Checkboxes":
        return checkboxValues[key]?.[option.text] || false;
      case "Yes/No":
        return selectedYesNoValues[key] === option.text;
      case "Dropdown":
        return selectedDropdownValues[key] === option.text;
      default:
        return false;
    }
  };

  useEffect(() => {
    if (organizer?.sections) {
      const newInputValues = {};
      const newRadioValues = {};
      const newCheckboxValues = {};
      const newSelectedYesNoValues = {};
      const newSelectedDropdownValues = {};
      const newAnsweredElements = {};
      let initialDate = dayjs();

      organizer.sections.forEach((section) => {
        section.formElements.forEach((element) => {
          const key = `${section.id}_${element.text}`;

          if (element.textvalue) {
            newAnsweredElements[key] = true;

            switch (element.type) {
              case "Free Entry":
              case "Email":
              case "Number":
                newInputValues[key] = element.textvalue;
                break;
              case "Radio Buttons":
                newRadioValues[key] = element.textvalue;
                break;
              case "Checkboxes":
                // For checkboxes, textvalue is a comma-separated string
                const selectedOptions = element.textvalue
                  .split(",")
                  .map((s) => s.trim());
                newCheckboxValues[key] = {};
                element.options.forEach((option) => {
                  newCheckboxValues[key][option.text] =
                    selectedOptions.includes(option.text);
                });
                break;
              case "Yes/No":
                newSelectedYesNoValues[key] = element.textvalue;
                break;
              case "Dropdown":
                newSelectedDropdownValues[key] = element.textvalue;
                break;
              case "Date":
                initialDate = dayjs(element.textvalue);
                break;
            }
          }
        });
      });

      setInputValues(newInputValues);
      setRadioValues(newRadioValues);
      setCheckboxValues(newCheckboxValues);
      setSelectedYesNoValues(newSelectedYesNoValues);
      setSelectedDropdownValues(newSelectedDropdownValues);
      setAnsweredElements(newAnsweredElements);
      setStartDate(initialDate);
    }
  }, [organizer]);

  // const isElementActive = (element) => {
  //   return element.active === true; // Returns true if active, false otherwise
  // };
  const isElementActive = (element) => {
    // If organizer is sealed, disable all elements
    if (organizer?.issealed) return true;

    // Otherwise, follow the element's active status
    return element.active === true;
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog fullScreen open={open} onClose={handleClose}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            py: 2,
            borderBottom: "1px solid #ddd",
          }}
        >
          <Typography variant="h6" component="p">
            {organizer?.organizerName || "Organizer"}
          </Typography>
          <IconButton edge="end" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl
            fullWidth
            sx={{ marginBottom: "10px", marginTop: "10px" }}
          >
            {/* <Select
              value={activeStep}
              onChange={handleDropdownChange}
              size="small"
            >
              {visibleSections.map((section, index) => {
                // Calculate answered elements count for this specific section
                const answeredCount = section.formElements.reduce(
                  (count, element) => {
                    const key = `${section.id}_${element.text}`;
                    return count + (answeredElements[key] ? 1 : 0);
                  },
                  0
                );

                const totalElements = section.formElements.length;

                return (
                  <MenuItem key={section.id} value={index}>
                    {section.text} ({answeredCount}/{totalElements})
                  </MenuItem>
                );
              })}
            </Select> */}
            <Select
              value={activeStep}
              onChange={handleDropdownChange}
              size="small"
            >
              {visibleSections.map((section, index) => {
                // Filter form elements that are actually visible
                const visibleElements = section.formElements.filter((el) =>
                  shouldShowElement(el, section.id)
                );

                // Count answered visible elements
                const answeredCount = visibleElements.reduce(
                  (count, element) => {
                    const key = `${section.id}_${element.text}`;
                    return count + (answeredElements[key] ? 1 : 0);
                  },
                  0
                );

                const totalVisibleElements = visibleElements.length;

                return (
                  <MenuItem key={section.id} value={index}>
                    {section.text} ({answeredCount}/{totalVisibleElements})
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Box mt={2} mb={2}>
            <LinearProgress
              variant="determinate"
              value={((activeStep + 1) / totalSteps) * 100}
            />
          </Box>

          <Box sx={{ pl: 20, pr: 20 }}>
            {visibleSections.map(
              (section, sectionIndex) =>
                sectionIndex === activeStep && (
                  <Box key={section.id}>
                    {section.formElements.map(
                      (element) =>
                        shouldShowElement(element, section.id) && (
                          <Box key={`${section.id}_${element.id}`}>
                            {element.type === "Text Editor" && (
                              <Box mt={2} mb={2}>
                                <Typography>
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: element.text,
                                    }}
                                  />
                                </Typography>
                              </Box>
                            )}

                            {(element.type === "Free Entry" ||
                              element.type === "Email") && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <TextField
                                  disabled={isElementActive(element)}
                                  variant="outlined"
                                  size="small"
                                  multiline
                                  fullWidth
                                  placeholder={`${element.type} Answer`}
                                  inputProps={{
                                    type:
                                      element.type === "Free Entry"
                                        ? "text"
                                        : element.type.toLowerCase(),
                                  }}
                                  maxRows={8}
                                  style={{ display: "block" }}
                                  value={
                                    inputValues[
                                      `${section.id}_${element.text}`
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      element.text,
                                      section.id
                                    )
                                  }
                                />
                              </Box>
                            )}

                            {element.type === "Number" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <TextField
                                  disabled={isElementActive(element)}
                                  variant="outlined"
                                  size="small"
                                  multiline
                                  fullWidth
                                  placeholder={`${element.type} Answer`}
                                  inputProps={{
                                    type: "text",
                                    inputMode: "numeric",
                                    pattern: "[0-9]*",
                                  }}
                                  maxRows={8}
                                  style={{
                                    display: "block",
                                    marginTop: "15px",
                                  }}
                                  value={
                                    inputValues[
                                      `${section.id}_${element.text}`
                                    ] || ""
                                  }
                                  onChange={(e) => {
                                    const numericValue = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    handleInputChange(
                                      { target: { value: numericValue } },
                                      element.text,
                                      section.id
                                    );
                                  }}
                                />
                              </Box>
                            )}

                            {element.type === "Radio Buttons" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {element.options.map((option) => (
                                    <Button
                                      key={option.text}
                                      variant={
                                        radioValues[
                                          `${section.id}_${element.text}`
                                        ] === option.text
                                          ? "contained"
                                          : "outlined"
                                      }
                                      disabled={isElementActive(element)}
                                      onClick={() =>
                                        !isElementActive(element) &&
                                        handleRadioChange(
                                          option.text,
                                          element.text,
                                          section.id
                                        )
                                      }
                                      sx={{
                                        borderRadius: "15px",
                                        ...(radioValues[
                                          `${section.id}_${element.text}`
                                        ] === option.text),
                                      }}
                                    >
                                      {option.text}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            )}

                            {element.type === "Checkboxes" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {element.options.map((option) => (
                                    <Button
                                      key={option.text}
                                      variant={
                                        checkboxValues[
                                          `${section.id}_${element.text}`
                                        ]?.[option.text]
                                          ? "contained"
                                          : "outlined"
                                      }
                                      disabled={isElementActive(element)}
                                      onClick={() =>
                                        !isElementActive(element) &&
                                        handleCheckboxChange(
                                          option.text,
                                          element.text,
                                          section.id
                                        )
                                      }
                                      sx={{
                                        borderRadius: "15px",
                                        ...checkboxValues[
                                          `${section.id}_${element.text}`
                                        ]?.[option.text],
                                      }}
                                    >
                                      {option.text}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            )}

                            {element.type === "Yes/No" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  {element.options.map((option) => (
                                    <Button
                                      key={option.text}
                                      variant={
                                        selectedYesNoValues[
                                          `${section.id}_${element.text}`
                                        ] === option.text
                                          ? "contained"
                                          : "outlined"
                                      }
                                      disabled={isElementActive(element)}
                                      onClick={() =>
                                        !isElementActive(element) &&
                                        handleYesNoChange(
                                          option.text,
                                          element.text,
                                          section.id
                                        )
                                      }
                                      sx={{
                                        borderRadius: "15px",
                                        ...(selectedYesNoValues[
                                          `${section.id}_${element.text}`
                                        ] === option.text),
                                      }}
                                    >
                                      {option.text}
                                    </Button>
                                  ))}
                                </Box>
                              </Box>
                            )}

                            {element.type === "Dropdown" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                <FormControl fullWidth>
                                  <Select
                                    value={
                                      selectedDropdownValues[
                                        `${section.id}_${element.text}`
                                      ] || ""
                                    }
                                    disabled={isElementActive(element)}
                                    onChange={(event) =>
                                      handleDropdownValueChange(
                                        event,
                                        element.text,
                                        section.id
                                      )
                                    }
                                    size="small"
                                  >
                                    {element.options.map((option) => (
                                      <MenuItem
                                        key={option.text}
                                        value={option.text}
                                      >
                                        {option.text}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Box>
                            )}

                            {element.type === "Date" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                {/* <DatePicker
                                  format="DD/MM/YYYY"
                                  sx={{
                                    width: "100%",
                                    backgroundColor: "#fff",
                                  }}
                                  selected={startDate}
                                  onChange={handleStartDateChange}
                                  renderInput={(params) => (
                                    <TextField {...params} size="small" />
                                  )}
                                  onOpen={() =>
                                    setAnsweredElements((prevAnswered) => ({
                                      ...prevAnswered,
                                      [`${section.id}_${element.text}`]: true,
                                    }))
                                  }
                                /> */}
                                <DatePicker
                                  format="DD/MM/YYYY"
                                  sx={{
                                    width: "100%",
                                    backgroundColor: "#fff",
                                  }}
                                  value={startDate}
                                  disabled={isElementActive(element)}
                                  onChange={(newValue) => {
                                    // setStartDate(newValue);
                                    // setAnsweredElements((prevAnswered) => ({
                                    //   ...prevAnswered,
                                    //   [`${section.id}_${element.text}`]: true,
                                    // }));
                                    if (!isElementActive(element)) {
                                      setStartDate(newValue);
                                      setAnsweredElements((prev) => ({
                                        ...prev,
                                        [`${section.id}_${element.text}`]: true,
                                      }));
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField {...params} size="small" />
                                  )}
                                />
                              </Box>
                            )}

                            {element.type === "File Upload" && (
                              <Box mt={2}>
                                <Typography
                                  variant="subtitle2"
                                  component="p"
                                  gutterBottom
                                  sx={{ fontWeight: "550" }}
                                >
                                  {element.text}
                                </Typography>
                                this file upload question
                              </Box>
                            )}
                          </Box>
                        )
                    )}
                  </Box>
                )
            )}

            <Box
              mt={3}
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Box display="flex" gap={3} alignItems="center">
                {activeStep > 0 && (
                  <Button onClick={handleBack} variant="outlined">
                    <ArrowBackIcon fontSize="small" />
                  </Button>
                )}

                {activeStep < totalSteps - 1 ? (
                  <Button onClick={handleNext} variant="contained">
                    Next{" "}
                    <ArrowForwardIcon fontSize="small" sx={{ marginLeft: 2 }} />
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleSubmit}>
                    Submit
                  </Button>
                )}
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Typography>
                  Step {activeStep + 1} of {totalSteps}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
};

export default OrganizerDialog;
