import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./account.css";
import {
  Stack,
  Paper,
  useMediaQuery,
  Box,
  Tooltip,
  Typography,
  Divider,
  Checkbox,
  Autocomplete,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Menu,
  MenuItem,
  Chip,
  Select,
  OutlinedInput,
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  useMaterialReactTable,
  MaterialReactTable,
} from "material-react-table";
import DeleteIcon from "@mui/icons-material/Delete";
import { Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import ContactForm from "./UpdateContact";
import { MRT_TableHeadCellFilterContainer } from "material-react-table";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { format } from "date-fns";
const ContactTable = () => {
  const storedData = JSON.parse(localStorage.getItem("teamMemberData"));
  console.log("bhvh", storedData);
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
  const [contactData, setContactData] = useState([]);
  const [uniqueTags, setUniqueTags] = useState([]);
  const [filterValue, setFilterValue] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [tags, setTags] = useState([]);
  const isMobile = useMediaQuery("(max-width: 1000px)");
  const [filterText, setFilterText] = useState({});

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Handle sort action
  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const newDirection =
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc";
      return { key, direction: newDirection };
    });
  };

  // Sort the data based on the sortConfig
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return contactData;

    const sorted = [...contactData].sort((a, b) => {
      let aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
      let bValue = b[sortConfig.key]?.toString().toLowerCase() || "";

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [contactData, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "↕"; // Default icon for unsorted columns
  };
  //Tag FetchData ================
  const [selectedTags, setSelectedTags] = useState([]);
  //  for tags
  const calculateWidth = (tagName) => {
    const baseWidth = 10; // base width for each tag
    const charWidth = 8; // approximate width of each character
    const padding = 10; // padding on either side
    return baseWidth + charWidth * tagName.length + padding;
  };
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
  // const handleTagChange = (event, newValue) => {
  //   setSelectedTags(newValue.map((option) => option.label));
  //   // Send selectedValues array to your backend
  //   console.log("Selected Values:", newValue.map((option) => option.label));

  // };
  const handleTagChange = (event) => {
    const selectedValues = event.target.value;
    setSelectedTags(selectedValues);

    // Send selectedValues array to your backend
    console.log("Selected Values:", selectedValues);
  };

  const [dateFilter, setDateFilter] = useState({
    option: null, // 'today', 'yesterday', 'lastWeek', 'custom'
    startDate: null,
    endDate: null,
  });

  const [updatedDateFilter, setUpdatedDateFilter] = useState({
    option: null,
    startDate: null,
    endDate: null,
  });
  // Filter the data based on the filterText and selectedTags
  const filteredData = useMemo(() => {
    let filtered = sortedData;

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((contact) => {
        const contactTagNames =
          contact.tags?.flat().map((tag) => tag.tagName) || [];
        return selectedTags.every((selectedTagName) =>
          contactTagNames.includes(selectedTagName)
        );
      });
    }

    // Filter by text in name, email, or companyName
    // if (filterText) {
    //   filtered = filtered.filter((contact) => {
    //     const name = contact.name?.toLowerCase() || "";
    //     const email = contact.email?.toLowerCase() || "";
    //     const companyName = contact.companyName?.toLowerCase() || "";
    //     return (
    //       name.includes(filterText.toLowerCase()) ||
    //       email.includes(filterText.toLowerCase()) ||
    //       companyName.includes(filterText.toLowerCase())
    //     );
    //   });
    // }
    Object.entries(filterText).forEach(([filterKey, filterVal]) => {
      if (filterVal) {
        filtered = filtered.filter((contact) => {
          const val = filterVal.toLowerCase();
          const name = contact.name?.toLowerCase() || "";
          const email = contact.email?.toLowerCase() || "";
          const companyName = contact.companyName?.toLowerCase() || "";

          return (
            name.includes(val) ||
            email.includes(val) ||
            companyName.includes(val)
          );
        });
      }
    });

    // Filter by date
    if (dateFilter.option) {
      filtered = filtered.filter((contact) => {
        const contactDate = new Date(contact.createdAt);
        const start = dateFilter.startDate
          ? new Date(dateFilter.startDate)
          : null;
        const end = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        return (!start || contactDate >= start) && (!end || contactDate <= end);
      });
    }
    // Filter by updated date
    if (updatedDateFilter.option) {
      filtered = filtered.filter((contact) => {
        const contactDate = new Date(contact.updatedAt);
        const start = updatedDateFilter.startDate
          ? new Date(updatedDateFilter.startDate)
          : null;
        const end = updatedDateFilter.endDate
          ? new Date(updatedDateFilter.endDate)
          : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        return (!start || contactDate >= start) && (!end || contactDate <= end);
      });
    }

    return filtered;
  }, [sortedData, filterText, selectedTags, dateFilter, updatedDateFilter]);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  // Pagination: Slice the contact data based on page and rowsPerPage
  // const paginatedData = contactData.slice(
  //   page * rowsPerPage,
  //   page * rowsPerPage + rowsPerPage
  // );

  // Slice data based on pagination
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);
  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        `${CONTACT_API}/contacts/contactlist/list/`
      );
      setContactData(response.data.contactlist);
      console.log("responce", response.data.contactlist);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const fetchTagData = async () => {
    try {
      const response = await fetch(`${TAGS_API}/tags/`);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleContactUpdated = () => {
    fetchContacts(); // Refetch contacts when updated
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this contact?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`${CONTACT_API}/contacts/${id}/`);
        setContactData((prevContacts) =>
          prevContacts.filter((contact) => contact.id !== id)
        );
        // alert("Contact deleted successfully!");
        toast.success("Contact deleted successfully!");
      } catch (error) {
        console.error("Delete API Error:", error);
        alert("Failed to delete contact");
      }
    }
  };

  const handleClick = async (id) => {
    try {
      const url = `${CONTACT_API}/contacts/${id}`;
      console.log("url", url);
      const response = await fetch(url);
      const data = await response.json();
      setSelectedContact(data.contact);
      console.log("edit contact data", data.contact);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchTagData();
  }, []);

  useEffect(() => {
    if (contactData.length > 0) {
      const tagsSet = new Set();
      contactData.forEach((item) => {
        if (Array.isArray(item.Tags)) {
          item.Tags.forEach((tag) => {
            tagsSet.add(JSON.stringify(tag[0]));
          });
        }
      });
      setUniqueTags(Array.from(tagsSet).map((tag) => JSON.parse(tag)));
    }
  }, [contactData]);

  const [selectedContacts, setSelectedContacts] = useState([]);
  // Handle checkbox change for individual contact
  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      // Add ID to selectedContacts array
      setSelectedContacts((prevSelected) => {
        const newSelected = [...prevSelected, id];
        console.log("Selected Contacts IDs:", newSelected); // Log selected IDs
        return newSelected;
      });
    } else {
      // Remove ID from selectedContacts array
      setSelectedContacts((prevSelected) => {
        const newSelected = prevSelected.filter(
          (contactId) => contactId !== id
        );
        console.log("Selected Contacts IDs:", newSelected); // Log selected IDs
        return newSelected;
      });
    }
  };

  // Handle "Select All" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = contactData.map((contact) => contact.id);
      setSelectedContacts(allIds);
      console.log("Selected Contacts IDs:", allIds); // Log all selected IDs
    } else {
      setSelectedContacts([]);
      console.log("Selected Contacts IDs: []"); // Log empty array when deselected
    }
  };

  const handleDeleteSelected = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected contacts?"
    );
    if (isConfirmed) {
      try {
        await Promise.all(
          selectedContacts.map((id) =>
            axios.delete(`${CONTACT_API}/contacts/${id}/`)
          )
        );
        setContactData((prevContacts) =>
          prevContacts.filter(
            (contact) => !selectedContacts.includes(contact.id)
          )
        );
        toast.success("Selected contacts deleted successfully!");
        setSelectedContacts([]); // Clear the selected contacts
        // alert;
      } catch (error) {
        console.error("Delete API Error:", error);
        toast.error("Failed to delete selected contacts");
      }
    }
  };
  const [filterOption, setFilterOption] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  // const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  // const handleFilterOptionClick = (option) => {
  //   setFilterOption(option);
  //   setIsFilterVisible(true); // Show the TextField
  //   setMenuAnchor(null); // Close the menu after selection
  // };
  const handleFilterOptionClick = (filter) => {
    if (!selectedFilters.includes(filter)) {
      setSelectedFilters([...selectedFilters, filter]);
    }
    setMenuAnchor(null);
  };
  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleInputChange = (filter, value) => {
    setFilterValues({ ...filterValues, [filter]: value });
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // const clearFilter = (filter) => {
  //   setSelectedFilters(selectedFilters.filter((f) => f !== filter));
  //   // setFilterValues({ ...filterValues, [filter]: "" });
  //   setFilterText("");
  //   if (filter === "tags") setSelectedTags([]);
  // };

  // const handleDateOptionChange = (option) => {
  //   const today = new Date();
  //   let startDate = null;
  //   let endDate = new Date(today.setHours(23, 59, 59, 999));

  //   switch(option) {
  //     case 'today':
  //       startDate = new Date(today.setHours(0, 0, 0, 0));
  //       break;
  //     case 'yesterday':
  //       startDate = new Date(today);
  //       startDate.setDate(today.getDate() - 1);
  //       startDate.setHours(0, 0, 0, 0);
  //       endDate = new Date(startDate);
  //       endDate.setHours(23, 59, 59, 999);
  //       break;
  //     case 'lastWeek':
  //       startDate = new Date(today);
  //       startDate.setDate(today.getDate() - 7);
  //       startDate.setHours(0, 0, 0, 0);
  //       break;
  //     case 'lastMonth':
  //       startDate = new Date(today);
  //       startDate.setDate(today.getDate() - 30);
  //       startDate.setHours(0, 0, 0, 0);
  //       break;
  //     default:
  //       startDate = dateFilter.startDate;
  //       endDate = dateFilter.endDate;
  //   }

  //   setDateFilter({
  //     option,
  //     startDate,
  //     endDate
  //   });
  // };
  const handleDateOptionChange = (option) => {
    const today = new Date();
    let startDate = null;
    let endDate = new Date(today.setHours(23, 59, 59, 999));

    switch (option) {
      case "today":
        startDate = new Date(today.setHours(0, 0, 0, 0));
        break;
      case "yesterday":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "lastWeek":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "lastMonth":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "lastQuarter":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 3);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "lastYear":
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        startDate = dateFilter.startDate;
        endDate = dateFilter.endDate;
    }
    setDateFilter({
      option,
      startDate,
      endDate,
      // Add formatted dates to display
      displayText:
        option === "custom"
          ? "Custom Range"
          : `${format(startDate, "MMM-dd-yyyy")} to ${format(endDate, "MMM-dd-yyyy")}`,
    });
    // setDateFilter({
    //   option,
    //   startDate,
    //   endDate,
    // });
  };
  // Handler for updated date option change
  const handleUpdatedDateOptionChange = (option) => {
    let startDate = null;
    let endDate = null;
    // let displayText = "";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (option) {
      case "today":
        startDate = new Date();
        endDate = new Date();
        // displayText = "Today";
        break;
      case "lastWeek":
        startDate = new Date();
        startDate.setDate(today.getDate() - 7);
        endDate = new Date();
        // displayText = "Last 7 days";
        break;
      case "lastMonth":
        startDate = new Date();
        startDate.setMonth(today.getMonth() - 1);
        endDate = new Date();
        // displayText = "Last 30 days";
        break;
      case "lastQuarter":
        startDate = new Date();
        startDate.setMonth(today.getMonth() - 3);
        endDate = new Date();
        // displayText = "Last 90 days";
        break;
      case "lastYear":
        startDate = new Date();
        startDate.setFullYear(today.getFullYear() - 1);
        endDate = new Date();
        // displayText = "Last year";
        break;

      default:
        startDate = updatedDateFilter.startDate;
        endDate = updatedDateFilter.endDate;
    }

    // setUpdatedDateFilter({
    //   option,
    //   startDate,
    //   endDate,
    //   displayText,
    // });
    setUpdatedDateFilter({
      option,
      startDate,
      endDate,
      // Add formatted dates to display
      displayText:
        option === "custom"
          ? "Custom Range"
          : `${format(startDate, "MMM-dd-yyyy")} to ${format(endDate, "MMM-dd-yyyy")}`,
    });
  };

  // Handler for updated date change
  const handleUpdatedDateChange = (type, date) => {
    setUpdatedDateFilter((prev) => ({
      ...prev,
      [type]: date,
    }));
  };
  const handleDateChange = (type, value) => {
    setDateFilter((prev) => ({
      ...prev,
      [type]: value,
      option: "custom",
    }));
  };
  // Clear filter handler should be updated to handle updatedAt
  const clearFilter = (filter) => {
    if (filter === "createdAt") {
      setDateFilter({
        option: null,
        startDate: null,
        endDate: null,
      });
    } else if (filter === "updatedAt") {
      setUpdatedDateFilter({
        option: null,
        startDate: null,
        endDate: null,
      });
    } else {
      setFilterText("");
    }
    setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    if (filter === "tags") setSelectedTags([]);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          sx={{ width: 600 }}
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
            <Typography sx={{ fontWeight: "bold" }} variant="h6">
              Edit Contact
            </Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          {selectedContact && (
            <ContactForm
              selectedContact={selectedContact}
              uniqueTags={uniqueTags}
              handleClose={() => setIsDrawerOpen(false)}
              isSmallScreen={isMobile}
              onContactUpdated={handleContactUpdated}
            />
          )}
        </Drawer>

        {/* Filter Button and Dropdown */}
        {/* <Box display="flex" alignItems="center" mb={2}>
        <Button
          variant="contained"
          onClick={handleMenuOpen}
          sx={{
            backgroundColor: "var(--color-save-btn)", // Normal background

            "&:hover": {
              backgroundColor: "var(--color-save-hover-btn)", // Hover background color
            },
            borderRadius: "15px",
          }}
        >
          Filter by
        </Button>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleFilterOptionClick("name")}>
            Name
          </MenuItem>
          <MenuItem onClick={() => handleFilterOptionClick("email")}>
            Email
          </MenuItem>
          <MenuItem onClick={() => handleFilterOptionClick("companyName")}>
            Company Name
          </MenuItem>
          <MenuItem onClick={() => handleFilterOptionClick("tags")}>
            Tags
          </MenuItem>
        </Menu>
        {selectedFilters.map((filter) => (
          <Box display="flex" alignItems="center" ml={2}>
            {filter === "tags" ? (
              <FormControl sx={{ width: "100%" }}>
                <Select
                  multiple
                  displayEmpty
                  fullWidth
                  value={selectedTags}
                  onChange={handleTagChange}
                  input={<OutlinedInput placeholder="Tags" />}
                  renderValue={(selected) =>
                    selected.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((label) => {
                          const option = tagsoptions.find(
                            (tag) => tag.label === label
                          );
                          return (
                            <Chip
                              key={label}
                              label={label}
                              sx={{
                                backgroundColor: option?.colour,
                                color: "#fff",
                                fontWeight: 500,
                                fontSize: "10px",
                                borderRadius: "16px",
                                height: "20px",
                                cursor: "pointer",
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                "& .MuiChip-deleteIcon": {
                                  color: "#fff",
                                  opacity: 0.7,
                                  transition: "opacity 0.2s",
                                  "&:hover": { opacity: 1 },
                                },
                              }}
                            />
                          );
                        })}
                      </Box>
                    ) : (
                      "Tags"
                    )
                  }
                  style={{ width: "250px", marginRight: "10px" }}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200, // Set the maximum height of the dropdown
                        overflowY: "auto", // Enable scrolling
                      },
                    },
                  }}
                >
                  {tagsoptions.map((option) => {
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    context.font = "12px Arial"; // Match the font size/style of MenuItem

                    const textWidth = context.measureText(option.label).width; // Get precise width
                    const dynamicWidth = Math.min(textWidth + 16, 150); // Add padding & set max width
                    return (
                      <MenuItem
                        key={option.label}
                        value={option.label}
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
                          // alignItems: "center",
                          // paddingLeft: "10px",
                          whiteSpace: "nowrap", // Prevent line breaks
                          // textAlign: "left", // Ensure text is left-aligned
                          // paddingLeft: "10px", // Add left padding for proper alignment
                          minWidth: `${dynamicWidth}px`,
                          maxWidth: `${dynamicWidth}px`, // Dynamically set maxWidth
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
            ) : (
              <TextField
                label={`Search by ${filter}`}
                variant="outlined"
                size="small"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                // style={{ flex: 1 }}
                sx={{ width: "200px" }}
              />
            )}
            <IconButton onClick={() => clearFilter(filter)} sx={{ ml: 1 }}>
              <DeleteIcon color="error" />
            </IconButton>
          </Box>
        ))}
      </Box> */}
        <Box display="flex" alignItems="center" mb={2}>
          <Button
            variant="contained"
            onClick={handleMenuOpen}
            sx={{
              backgroundColor: "var(--color-save-btn)",
              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)",
              },
              borderRadius: "15px",
            }}
          >
            Filter by
          </Button>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleFilterOptionClick("name")}>
              Name
            </MenuItem>
            <MenuItem onClick={() => handleFilterOptionClick("email")}>
              Email
            </MenuItem>
            <MenuItem onClick={() => handleFilterOptionClick("companyName")}>
              Company Name
            </MenuItem>
            <MenuItem onClick={() => handleFilterOptionClick("tags")}>
              Tags
            </MenuItem>
            <MenuItem onClick={() => handleFilterOptionClick("createdAt")}>
              Date Created
            </MenuItem>

            <MenuItem onClick={() => handleFilterOptionClick("updatedAt")}>
              Date Updated
            </MenuItem>
          </Menu>

          {selectedFilters.map((filter) => (
            <Box display="flex" alignItems="center" ml={2} key={filter}>
              {filter === "tags" ? (
                <FormControl sx={{ width: "100%" }}>
                  {/* Your existing tags select component */}
                  <Select
                    multiple
                    displayEmpty
                    fullWidth
                    value={selectedTags}
                    onChange={handleTagChange}
                    input={<OutlinedInput placeholder="Tags" />}
                    renderValue={(selected) =>
                      selected.length > 0 ? (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((label) => {
                            const option = tagsoptions.find(
                              (tag) => tag.label === label
                            );
                            return (
                              <Chip
                                key={label}
                                label={label}
                                sx={{
                                  backgroundColor: option?.colour,
                                  color: "#fff",
                                  fontWeight: 500,
                                  fontSize: "10px",
                                  borderRadius: "16px",
                                  height: "20px",
                                  cursor: "pointer",
                                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                  "& .MuiChip-deleteIcon": {
                                    color: "#fff",
                                    opacity: 0.7,
                                    transition: "opacity 0.2s",
                                    "&:hover": { opacity: 1 },
                                  },
                                }}
                              />
                            );
                          })}
                        </Box>
                      ) : (
                        "Tags"
                      )
                    }
                    style={{ width: "250px", marginRight: "10px" }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 200,
                          overflowY: "auto",
                        },
                      },
                    }}
                  >
                    {tagsoptions.map((option) => {
                      const canvas = document.createElement("canvas");
                      const context = canvas.getContext("2d");
                      context.font = "12px Arial";
                      const textWidth = context.measureText(option.label).width;
                      const dynamicWidth = Math.min(textWidth + 16, 150);
                      return (
                        <MenuItem
                          key={option.label}
                          value={option.label}
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
                            whiteSpace: "nowrap",
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
              ) : filter === "createdAt" ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography>Date Created</Typography>
                  <FormControl sx={{ minWidth: 120, mr: 1 }}>
                    <Select
                      value={dateFilter.option || ""}
                      onChange={(e) => handleDateOptionChange(e.target.value)}
                      displayEmpty
                      size="small"
                    >
                      <MenuItem value="">Select period</MenuItem>
                      <MenuItem value="today">Today</MenuItem>
                      <MenuItem value="lastWeek">Last week</MenuItem>
                      <MenuItem value="lastMonth">Last month</MenuItem>
                      <MenuItem value="lastQuarter">Last quarter</MenuItem>
                      <MenuItem value="lastYear">Last year</MenuItem>
                    </Select>
                  </FormControl>
                  {dateFilter.option && (
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {dateFilter.displayText}
                    </Typography>
                  )}
                  {dateFilter.option === "custom" && (
                    <>
                      <DatePicker
                        label="Start date"
                        value={dateFilter.startDate}
                        onChange={(newValue) =>
                          handleDateChange("startDate", newValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            sx={{ width: 150, mr: 1 }}
                          />
                        )}
                      />
                      <DatePicker
                        label="End date"
                        value={dateFilter.endDate}
                        onChange={(newValue) =>
                          handleDateChange("endDate", newValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            sx={{ width: 150 }}
                          />
                        )}
                      />
                    </>
                  )}
                </Box>
              ) : filter === "updatedAt" ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography>Date Updated</Typography>
                  <FormControl sx={{ minWidth: 120, mr: 1 }}>
                    <Select
                      value={updatedDateFilter.option || ""}
                      onChange={(e) =>
                        handleUpdatedDateOptionChange(e.target.value)
                      }
                      displayEmpty
                      size="small"
                    >
                      <MenuItem value="">Select period</MenuItem>
                      <MenuItem value="today">Today</MenuItem>
                      <MenuItem value="lastWeek">Last week</MenuItem>
                      <MenuItem value="lastMonth">Last month</MenuItem>
                      <MenuItem value="lastQuarter">Last quarter</MenuItem>
                      <MenuItem value="lastYear">Last year</MenuItem>
                    </Select>
                  </FormControl>
                  {updatedDateFilter.option && (
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {updatedDateFilter.displayText}
                    </Typography>
                  )}
                  {updatedDateFilter.option === "custom" && (
                    <>
                      <DatePicker
                        label="Start date"
                        value={updatedDateFilter.startDate}
                        onChange={(newValue) =>
                          handleUpdatedDateChange("startDate", newValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            sx={{ width: 150, mr: 1 }}
                          />
                        )}
                      />
                      <DatePicker
                        label="End date"
                        value={updatedDateFilter.endDate}
                        onChange={(newValue) =>
                          handleUpdatedDateChange("endDate", newValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            sx={{ width: 150 }}
                          />
                        )}
                      />
                    </>
                  )}
                </Box>
              ) : (
                <TextField
                  label={`Search by ${filter}`}
                  variant="outlined"
                  size="small"
                  // value={filterText}
                  // onChange={(e) => setFilterText(e.target.value)}
                  onChange={(e) =>
                    setFilterText((prev) => ({
                      ...prev,
                      [filter]: e.target.value,
                    }))
                  }
                  value={filterText[filter] || ""}
                  sx={{ width: "200px" }}
                />
              )}
              <IconButton onClick={() => clearFilter(filter)} sx={{ ml: 1 }}>
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          ))}
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          {/* Only show delete button when contacts are selected */}
          {selectedContacts.length > 0 && (
            <IconButton
              onClick={handleDeleteSelected}
              sx={{ color: "red" }}
              disabled={storedData?.teammember?.manageContacts === false}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
        <TableContainer>
          <Table sx={{ width: "100%" }} aria-label="contact table">
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
                    checked={selectedContacts.length === contactData.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell
                  onClick={() => handleSort("name")}
                  style={{
                    cursor: "pointer",

                    left: 50,
                    // zIndex: 1,
                    background: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "16px", // Add more padding for better spacing
                  }}
                  width="200"
                >
                  Name {getSortIcon("name")}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("email")}
                  style={{
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "16px",
                  }}
                  width="150"
                >
                  Email {getSortIcon("email")}
                </TableCell>
                <TableCell
                  onClick={() => handleSort("phoneNumbers")}
                  style={{
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "16px",
                  }}
                  width="250"
                >
                  Phone Numbers {getSortIcon("phoneNumbers")}
                </TableCell>
                <TableCell
                  style={{
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "16px",
                  }}
                  width="100"
                >
                  Tags
                </TableCell>
                <TableCell
                  onClick={() => handleSort("companyName")}
                  style={{
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "16px",
                  }}
                  width="200"
                >
                  Company Name {getSortIcon("companyName")}
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "16px",
                  }}
                  width="50"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((contact) => (
                <TableRow
                  key={contact.id}
                  role="checkbox"
                  hover
                  tabIndex={-1}
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
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onChange={(e) => handleCheckboxChange(e, contact.id)}
                    />
                  </TableCell>
                  {/* <TableCell
                    style={{
                      cursor: "pointer",
                      color: "#3f51b5",
                      // position: "sticky",
                      left: 50,
                      zIndex: 1,
                      background: "#fff",
                      fontSize: "12px",
                      fontWeight: "normal",
                      // padding: "12px 16px", // Add padding for better spacing
                    }}
                    // sx={{ }}
                    onClick={() => handleClick(contact.id)}
                     disabled={!storedData?.teammember?.manageContacts}
                  >
                    {contact.name}
                  </TableCell> */}

                  {/* <TableCell
                    style={{
                      cursor: storedData?.teammember?.manageContacts
                        ? "pointer"
                        : "not-allowed",
                      color: storedData?.teammember?.manageContacts
                        ? "#3f51b5"
                        : "gray",
                      left: 50,
                      zIndex: 1,
                      background: "#fff",
                      fontSize: "12px",
                      fontWeight: "normal",
                    }}
                    onClick={() => {
                      if (storedData?.teammember?.manageContacts) {
                        handleClick(contact.id);
                      }
                    }}
                  >
                    {contact.name}
                  </TableCell> */}
                  <TableCell
                    style={{
                      cursor:
                        storedData?.teammember?.manageContacts === false
                          ? "not-allowed"
                          : "pointer",
                      color:
                        storedData?.teammember?.manageContacts === false
                          ? "gray"
                          : "#3f51b5",
                      left: 50,
                      zIndex: 1,
                      background: "#fff",
                      fontSize: "12px",
                      fontWeight: "normal",
                    }}
                    onClick={() => {
                      if (storedData?.teammember?.manageContacts !== false) {
                        handleClick(contact.id);
                      }
                    }}
                  >
                    {contact.name}
                  </TableCell>

                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    {contact.email}
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    {contact.phoneNumbers && contact.phoneNumbers.length > 0 ? (
                      <div>
                        {contact.phoneNumbers.map((phoneObj, index) => (
                          <div key={phoneObj._id || index}>
                            {/* {phoneObj.country === 'in' ? '+91 ' : phoneObj.country === 'us' ? '+1 ' : '+'} */}
                            +{phoneObj.phone}
                          </div>
                        ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    {contact.tags && contact.tags.flat().length > 0 && (
                      <Tooltip
                        title={
                          <div>
                            {contact.tags.flat().map((tag) => (
                              <span
                                key={tag._id}
                                style={{
                                  display: "block",
                                  backgroundColor: tag.tagColour,
                                  color: "#fff",
                                  padding: "2px 4px",
                                  margin: "2px 0",
                                  borderRadius: "4px",
                                }}
                              >
                                {tag.tagName}
                              </span>
                            ))}
                          </div>
                        }
                        arrow
                        placement="top"
                      >
                        <span style={{ display: "inline-block" }}>
                          {contact.tags.flat()[0] && (
                            <span
                              style={{
                                backgroundColor:
                                  contact.tags.flat()[0].tagColour,
                                color: "#fff",
                                padding: "3px 8px",
                                borderRadius: "10px",
                                marginRight: "4px",
                              }}
                            >
                              {contact.tags.flat()[0].tagName}
                            </span>
                          )}
                          {contact.tags.flat().length > 1 && (
                            <span style={{ cursor: "pointer", color: "blue" }}>
                              +{contact.tags.flat().length - 1}
                            </span>
                          )}
                        </span>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    {contact.companyName}
                  </TableCell>
                  <TableCell
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                    }}
                  >
                    <IconButton
                      onClick={() => handleDelete(contact.id)}
                      sx={{ color: "red" }}
                      disabled={
                        storedData?.teammember?.manageContacts === false
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={contactData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[30, 40, 50, 60, 100]} // Added row options
        />
      </LocalizationProvider>
    </>
  );
};

export default ContactTable;
