import React, { useState, useEffect, useMemo ,useContext} from 'react';
import './tag.css'
import {  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,TablePagination,Box, Button, Typography, Drawer, Select, MenuItem, IconButton, TextField,Alert } from '@mui/material';
import { FiSettings } from "react-icons/fi";
import { CiMenuKebab } from "react-icons/ci";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IoClose } from "react-icons/io5";
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { CircularProgress } from "@mui/material";
import { toast } from 'react-toastify';
import { LoginContext } from "../../Sidebar/Context/Context";
const Tags = () => {

 const { logindata } = useContext(LoginContext);
 console.log("janavi",logindata)
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;

  const [tags, setTags] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUpdateDrawerOpen, setIsUpdateDrawerOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);
  const [tagidget, setTagidGet] = useState("");
  const [getId, setGetId] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [tagid, settagidData] = useState();

  // const colors = ["#EE4B2B", "#FFAC1C", "#32CD32", "#008000", "#0000FF", "#BF40BF", "#F72798"];
  const colors = ["#fd3241", "#f9b5ac", "#ac6400", "#ff7e39", "#ffea00", "#94ecbe", "#2e8b57", "#76ac1e", "#3cbb50", "#9ed8db", "#0299bb", "#0af4b8", "#466efb", "#0496ff", "#b9c1ff",
    "#e1b1ff", "#9d33d0", "#d834f5", "#ff54b6", "#1d3354", "#767b91", "#8f8f8f", "#c7c7c7", "#9a657e", "#616468", "#511dff", "#85c7db", "#8cd1ff", "#0aefff", "#d4ff00", "#a1ff0a", "#00f43d", "#ffc100",
    "#cdc6a5", "#fed6b1", "#e5dfdf", "#ffeaa7"
  ];
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true); // Loader state
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true); // Start loader

    const loaderDelay = new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      const response = await fetch(`${TAGS_API}/tags/accountcountoftag/account`);
      const data = await response.json();
      setTags(data.tagCounts);
      

    } catch (error) {
      console.error("Error fetching data:", error);
    }
    finally {
      // Wait for the fetch and the 3-second timer to complete
      await loaderDelay;
      setLoading(false); // Stop loader
    }
  };

  const generateOptions = (inputValue) => {
    return colors.map((tagColour, index) => ({
      value: `${inputValue.toLowerCase()}-${index}`,
      tagName: inputValue,
      tagColour: tagColour,
    }));
  };



  const handleChange = (event) => {
    const value = event.target.value;
    const selectedOption = options.find(option => option.tagColour === value);
    setSelectedOption(selectedOption);
  };

  // const handleChange = (event, newValue) => {
  //   setSelectedOption(newValue);
  // };

  const handleUpdateDrawerOpen = () => {
    setIsUpdateDrawerOpen(true);
  };

  const handleUpdateDrawerClose = () => {
    setIsUpdateDrawerOpen(false);
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
    // if (!isManageTagsAllowed) {
    //   alert('You are a restricted user and cannot perform this action.');
    // } else {
    //   setIsDrawerOpen(true);
    // }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const selectWidth = inputValue ? `${inputValue.length * 5 + 40}px` : '';

  const handleEdit = async (_id) => {
    setGetId(_id);
    setOpenMenuId(false);
    const response = await fetch(`${TAGS_API}/tags/` + _id);
    if (!response.ok) {
      throw new Error('Failed to fetch tag data');
    }
    const data = await response.json();
    const tag = data.tag;
    settagidData(tag);
    setInputValue(tag.tagName);
    const newOptions = generateOptions(tag.tagName);
    setOptions(newOptions);

    // Set the selected option based on the fetched tag
    const selectedTag = newOptions.find(option => option.tagColour === tag.tagColour);
    setSelectedOption(selectedTag || null);
  };


  const handleInputChange = (inputValue) => {
    setInputValue(inputValue);
    console.log(inputValue)
    const newOptions = generateOptions(inputValue);
    setOptions(newOptions);

    // If editing an existing tag, update the selectedOption to reflect the input change
    if (isUpdateDrawerOpen && selectedOption) {
      const updatedOption = newOptions.find(option => option.tagName === selectedOption.tagName);
      if (updatedOption) {
        setSelectedOption(updatedOption);
      }
    }
  };

  const [tagNameError, setTagNameError] = useState('');
  const validateForm = () => {
    let isValid = true;
    if (!inputValue) {
      setTagNameError("Tag Name can't be blank");
      // toast.error("Name can't be blank");
      isValid = false;
    } else {
      setTagNameError('');
    }
    return isValid;
  }
  console.log(tagidget);
  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm("Are you sure you want to delete this tag?");

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      setGetId(_id);
      setOpenMenuId(false);
      const requestOptions = {
        method: "DELETE",
        redirect: "follow"
      };
      fetch(`${TAGS_API}/tags/` + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete tagdata');
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
          toast.success('Tagdata deleted successfully');
          fetchData();
          setOpenMenuId(false);
        })
        .catch((error) => {
          console.error(error);
          toast.error('Failed to delete tagdata');
        });
    }
  };

  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTagidGet(_id);
  };

  const handleClear = () => {
    setInputValue("");
    setSelectedOption(null);
    setOptions([]);
    handleDrawerClose();
  };


  const handleSubmit = () => {
    // Prevent form submission if validation fails
    if (!validateForm()) {
        return; 
    } 
    setLoading(true); // Start loader
    // Proceed only if an option is selected
    if (selectedOption) {
        const { tagName, tagColour } = selectedOption;
        sendApiData(tagName, tagColour);
    }

    // Clear the form regardless of selection
    handleClear();
};


  const sendApiData = (tagName, tagColour) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      tagName: tagName,
      tagColour: tagColour,
    });
    console.log(raw)
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(`${TAGS_API}/tags/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        if (result && result.message === "Tag with this TagName already exists") {
          toast.success('Tag with this TagName already exists');
          // fetchData();
        } else {
          toast.success("Tag data sent successfully!");
          fetchData();

          setTags([...tags, { tagName, tagColour }]);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      })
      .finally(() => setLoading(false)); // Stop loader
  };

  const handleUpdatesumbit = () => {
    

    if (selectedOption) {
      const { tagColour } = selectedOption;
      UpdatedTag(inputValue, tagColour);
    }
  };

  const UpdatedTag = (tagName, tagColour) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      tagName: tagName,
      tagColour: tagColour
    });
    const requestOptions = {
      method: "PATCH",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    fetch(`${TAGS_API}/tags/` + getId, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result);
        toast.success('Tag Updated successfully');
        fetchData();
        handleClear();
        setOpenMenuId(false);
        handleUpdateDrawerClose();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleFormClose = () => {
    handleUpdateDrawerClose();
  };


  const columns = useMemo(() => [
    {
      accessorKey: 'tagName',
      header: 'Tag',
      Cell: ({ cell }) => (
        <span
          style={{
            backgroundColor: cell.row.original.tagColour,
            color: "#fff",
            borderRadius: "60px",
            padding: "0.1rem 0.8rem",
            fontSize: "10px",
          }}
        >
          {cell.getValue()}
        </span>
      ),
    },
    { accessorKey: 'count', header: 'Accounts',

     },
    { accessorKey: 'archivedAccounts', header: 'Archived accounts' },
    { accessorKey: 'pendingTasks', header: 'Pending tasks' },
    { accessorKey: 'completedTasks', header: 'Completed tasks' },
    { accessorKey: 'pipelines', header: 'Pipelines' },
    {
      accessorKey: 'settings',
      header: <FiSettings />,

      Cell: ({ row }) => (
        <IconButton onClick={() => toggleMenu(row.original._id)} style={{ color: "#2c59fa" }}>
          <CiMenuKebab style={{ fontSize: "20px" }} />
          {openMenuId === row.original._id && (
            <Box sx={{ position: 'absolute', zIndex: 1, backgroundColor: '#fff', boxShadow: 1, borderRadius: 1, p: 1, left: '30px', m: 2, }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }} onClick={() => {
                handleEdit(row.original._id);
                handleUpdateDrawerOpen();
              }}>Edit</Typography>
              <Typography sx={{ fontSize: '12px', color: 'red', fontWeight: 'bold' }} onClick={() => handleDelete(row.original._id)}>Delete</Typography>
            </Box>
          )}
        </IconButton>
      ),
    },
  ], [openMenuId, tags]);

  const table = useMaterialReactTable({
    columns,
    data: tags,
    enableBottomToolbar: true,
    enableStickyHeader: true,
    columnFilterDisplayMode: "custom", // Render own filtering UI
    enableRowSelection: true, // Enable row selection
    enablePagination: true,
    muiTableContainerProps: { sx: { maxHeight: "400px" } },
    initialState: {
      columnPinning: { left: ["mrt-row-select", "tagName"], right: ['settings'], },
    },
    muiTableBodyCellProps: {
      sx: (theme) => ({
        backgroundColor: theme.palette.mode === "dark-theme" ? theme.palette.grey[900] : theme.palette.grey[50],
      }),
    },
    
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const [searchTerm, setSearchTerm] = useState(""); // New state for search

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset pagination on search
  };
   // Filter tags based on search term
   const filteredTags = tags.filter((tag) =>
    tag.tagName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Slice data for pagination after filtering
  const paginatedTags = filteredTags.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
 // Slice data for pagination
//  const paginatedTags = tags.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  return (
    <div className="tag-container">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h6">Tags</Typography>
        <Box sx={{display:'flex', alignItems:'center', gap:3}}>
          {/* Search Input */}
   <TextField
        placeholder="Search Tag "
        variant="outlined"
        size="small"
        // fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />
       <Button variant="contained" onClick={handleDrawerOpen}  sx={{
                  backgroundColor: 'var(--color-save-btn)',  // Normal background
                 
                  '&:hover': {
                    backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                  },
  borderRadius:'15px', 
                }} >Add Tag</Button>
        </Box>
       
      </Box>

<Box >
{loading ? (
  <Box sx={{display:'flex',alignItems:'center', justifyContent:'center'}}> <CircularProgress style={{fontSize:'300px', color:'blue'}}/></Box>
  ):( 
  // <MaterialReactTable columns={columns} table={table} />
<Box>
   
  <TableContainer component={Paper} sx={{  overflowY: "auto" }}>
      <Table sx={{ width: "100%" }} stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell  style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100">Tag</TableCell>
            <TableCell  style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100">Accounts</TableCell>
            <TableCell  style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100">Archived Accounts</TableCell>
            <TableCell  style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100">Pending Tasks</TableCell>
            <TableCell  style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100">Completed Tasks</TableCell>
            <TableCell  style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100">Pipelines</TableCell>
            <TableCell  style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                     
                    }}
                    width="100">
              <FiSettings />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedTags.map((row) => (
            <TableRow key={row._id}>
              {/* Tag Name with Color */}
              <TableCell>
                <span
                  style={{
                    backgroundColor: row.tagColour,
                    color: "#fff",
                    borderRadius: "60px",
                    padding: "0.1rem 0.8rem",
                    fontSize: "10px",
                  }}
                >
                  {row.tagName}
                </span>
              </TableCell>
              <TableCell style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                        cursor: "pointer",
                        
                      }}>{row.count}</TableCell>
              <TableCell style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                        cursor: "pointer",
                      }}>{row.archivedAccounts}</TableCell>
              <TableCell style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                        cursor: "pointer",
                      }}>{row.pendingTasks}</TableCell>
              <TableCell style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                        cursor: "pointer",
                      }}>{row.completedTasks}</TableCell>
              <TableCell style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                        cursor: "pointer",
                        
                      }}>{row.pipelines}</TableCell>

              {/* Settings (Menu) */}
              <TableCell style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        lineHeight: "1",
                        cursor: "pointer",
                      }}>
                <IconButton onClick={() => toggleMenu(row._id)} style={{ color: "#2c59fa" }}>
                  <CiMenuKebab  />
                </IconButton>
                {openMenuId === row._id && (
                  <Box
                    sx={{
                      position: "absolute",
                      zIndex: 1,
                      backgroundColor: "#fff",
                      boxShadow: 1,
                      borderRadius: 1,
                      p: 1,
                      // left: "30px",
                      m: 2,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: "12px", fontWeight: "bold",cursor:'pointer' }}
                      onClick={() => {
                        handleEdit(row._id);
                        handleUpdateDrawerOpen();
                      }}
                    >
                      Edit
                    </Typography>
                    <Typography
                      sx={{ fontSize: "12px", color: "red", fontWeight: "bold",cursor:'pointer' }}
                      onClick={() => handleDelete(row._id)}
                    >
                      Delete
                    </Typography>
                  </Box>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      
    </TableContainer>
    {/* Pagination */}
    <TablePagination
    component="div"
    count={tags.length}
    page={page}
    onPageChange={handleChangePage}
    rowsPerPage={rowsPerPage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    rowsPerPageOptions={[5, 10, 25]}
  />
  </Box>
  )
}
      </Box>
      <Drawer
        anchor='right'
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          id: 'tag-drawer',
          sx: {
            borderRadius: isSmallScreen ? '0' : '10px 0 0 10px',
            width: isSmallScreen ? '100%' : 500,
            maxWidth: '100%',
            [theme.breakpoints.down('sm')]: {
              width: '100%',
            },

          }
        }}
      >
        <Box sx={{ borderRadius: isSmallScreen ? '0' : '15px' }} role="presentation">
          <Box>
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: "#EEEEEE" }}>
              <Typography variant="h6" >
                Create Tag
              </Typography>
              <IoClose onClick={handleDrawerClose} style={{ cursor: 'pointer' }} />
            </Box>
            <Box sx={{ pr: 2, pl: 2, pt: 2 }}>
              <Box>
                <label className='tag-input-label'>Name</label>

                <TextField
                  placeholder="Tag Name"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  fullWidth
                  // margin="normal"
                  size="small"
                  sx={{ backgroundColor: '#fff', mt:1 }}

                error={!!tagNameError}
                />
                {(!!tagNameError) && <Alert sx={{
                  width: '96%',
                  p: '0', // Adjust padding to control the size
                  pl: '4%', height: '23px',
                  borderRadius: '10px',
                  borderTopLeftRadius: '0',
                  borderTopRightRadius: '0',
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center', // Center content vertically
                  '& .MuiAlert-icon': {
                    fontSize: '16px', // Adjust the size of the icon
                    mr: '8px', // Add margin to the right of the icon
                  },
                }} variant="filled" severity="error" >
                  Tag Name can't be blank
                </Alert>}

              </Box>
              <Box sx={{ mt: 3 }}>
                <label className='tag-input-label'>Color</label>
                <Select
                  value={selectedOption ? selectedOption.tagColour : ''}
                  onChange={handleChange}
                  labelId="color-select-label"
                  id="color-select"
                  size="small"
                  sx={{ width: '100%', marginTop: '10px', backgroundColor: '#fff' }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200,  // Adjust the dropdown height as per your requirement
                        overflowY: 'auto',  // Enable scrolling if the content exceeds the height
                      },
                    },
                  }}
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.tagColour}>
                      <Box sx={{
                        backgroundColor: option.tagColour,
                        color: "#fff",
                        borderRadius: "10px",
                        width: selectWidth,
                        textAlign: "center",
                        padding: "0.1rem 0.6rem",
                      }}>
                        {option.tagName}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>

              </Box>
              {/* <Box sx={{ pt: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
                <Button onClick={handleClear} variant="outlined">Clear</Button>
              </Box> */}
               <Box sx={{ pt: 5, display: "flex", alignItems: "center", gap: 5 }}>
              <Button onClick={handleSubmit} variant="contained"  disabled={loading}  sx={{
                  backgroundColor: 'var(--color-save-btn)',  // Normal background
                 
                  '&:hover': {
                    backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                  },
  borderRadius:'15px', width:'80px'
                }} >
                {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Submit"}
              </Button>
              <Button onClick={handleClear} variant="outlined" disabled={loading} sx={{
                  borderColor: 'var(--color-border-cancel-btn)',  // Normal background
                 color:'var(--color-save-btn)',
                  '&:hover': {
                    backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                    color:'#fff',
                    border:"none"
                  },
                  width:'80px',borderRadius:'15px'
                }}>
                Clear
              </Button>
            </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>
      <Drawer
        anchor='right'
        open={isUpdateDrawerOpen}
        onClose={handleUpdateDrawerClose}
        PaperProps={{
          sx: {

            borderRadius: isSmallScreen ? '0' : '10px 0 0 10px',
            width: isSmallScreen ? '100%' : 500,
            maxWidth: '100%',
            [theme.breakpoints.down('sm')]: {
              width: '100%',
            },
            id: 'tag-drawer',
          }
        }}
      >
        <Box sx={{ borderRadius: isSmallScreen ? '0' : '15px' }} role="presentation">
          <Box>
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: "#EEEEEE" }}>
              <Typography variant="h6" >
                Edit Tag
              </Typography>
              <IoClose onClick={handleUpdateDrawerClose} style={{ cursor: 'pointer' }} />
            </Box>
            <Box sx={{ pr: 2, pl: 2, pt: 2 }}>
              <Box>

                <label className='tag-input-label'>Name</label>

                <TextField

                  placeholder="Tag Name"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  fullWidth
                  margin="normal"
                  size="small"
                  sx={{ width: '100%' }}
               
                />
              </Box>
              <Box sx={{ mt: 3 }}>
                <label className='tag-input-label'>Color</label>

                <Select
                  value={selectedOption ? selectedOption.tagColour : ''}
                  onChange={handleChange}
                  labelId="color-select-label"
                  id="color-select"
                  size="small"
                  sx={{ width: '100%', marginTop: '10px' }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200,  // Adjust the dropdown height as per your requirement
                        overflowY: 'auto',  // Enable scrolling if the content exceeds the height
                      },
                    },
                  }}
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.tagColour}>
                      <Box sx={{
                        backgroundColor: option.tagColour,
                        color: "#fff",
                        borderRadius: "10px",
                        width: selectWidth,
                        textAlign: "center",
                        padding: "0.1rem 0.6rem",
                      }}>
                        {option.tagName}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>


              </Box>
              <Box sx={{ pt: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                <Button onClick={handleUpdatesumbit} variant="contained" sx={{
                backgroundColor: 'var(--color-save-btn)',  // Normal background
               
                '&:hover': {
                  backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                },
                borderRadius:'15px', width:'80px'
              }}>Save</Button>
                <Button onClick={handleFormClose} variant="outlined" sx={{
                  borderColor: 'var(--color-border-cancel-btn)',  // Normal background
                 color:'var(--color-save-btn)',
                  '&:hover': {
                    backgroundColor: 'var(--color-save-hover-btn)',  // Hover background color
                    color:'#fff',
                    border:"none"
                  },
                  width:'80px',borderRadius:'15px'
                }}>Cancel</Button>
              </Box>
            </Box>

          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default Tags;

