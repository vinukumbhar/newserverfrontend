// import React, { useState, useEffect } from "react";
// import { Grid, Box } from "@mui/material";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   CardActions,
//   Button,
// } from "@mui/material";
// const Insights = () => {
//   const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
//   const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
//   // jobs count
//   const [jobCount, setJobCount] = useState(null);
//   const [activeJobCount, setActiveJobCount] = useState(null);
//   const [inactiveJobCount, setInactiveJobCount] = useState(null);
//   const [invoiceCount, setInvoiceCount] = useState(null);
//   const [invoiceCounts, setInvoiceCounts] = useState({ Paid: 0, Pending: 0, Overdue: 0 });
//   const [invoiceSummary, setInvoiceSummary] = useState({
//     totalAmount: 0,
//     pendingAmount: 0,
//     paidAmount: 0,
//     overdueAmount: 0,
//   });
//   useEffect(() => {
//     // Fetch job count from API
//     axios.get(`${JOBS_API}/workflow/jobs/jobscount`)
//       .then((response) => {
//         setJobCount(response.data.count); // Assuming API returns { count: <job count> }
//       })
//       .catch((error) => {
//         console.error("Error fetching job count:", error);
//       });

//        // Fetch count of active jobs
//     axios.get(`${JOBS_API}/workflow/jobs/activejobcounts`)
//     .then((response) => {
//       setActiveJobCount(response.data.count);
//     })
//     .catch((error) => {
//       console.error("Error fetching active job count:", error);
//     });

//   // Fetch count of inactive jobs
//   axios.get(`${JOBS_API}/workflow/jobs/inactivejobcounts`)
//     .then((response) => {
//       setInactiveJobCount(response.data.count);
//     })
//     .catch((error) => {
//       console.error("Error fetching inactive job count:", error);
//     });

//       // Fetch count of total invoices
//   axios.get(`${INVOICE_NEW}/workflow/invoices/invoicecount`)
//   .then((response) => {
//     setInvoiceCount(response.data.count);
//   })
//   .catch((error) => {
//     console.error("Error fetching inactive job count:", error);
//   });
//   axios
//       .get(`${INVOICE_NEW}/workflow/invoices/invoicestatuscount`)
//       .then((response) => {
//         const data = response.data.invoiceCounts;
        
//         // Convert response to an object with statuses as keys
//         const countMap = {};
//         data.forEach(({ _id, count }) => {
//           countMap[_id] = count;
//         });

//         // Update state with counts
//         setInvoiceCounts({
//           Paid: countMap["Paid"] || 0,
//           Pending: countMap["Pending"] || 0,
//           Overdue: countMap["Overdue"] || 0,
//         });
//       })
//       .catch((error) => console.error("Error fetching invoice counts:", error));
//       axios
//       .get(`${INVOICE_NEW}/workflow/invoices/invoicesummary`)
//       .then((response) => {
//         const data = response.data.summary;
//         let totalAmount = 0, paidAmount = 0, pendingAmount = 0, overdueAmount = 0;

//         data.forEach(({ _id, totalAmount: total, paidAmount: paid, balanceDueAmount }) => {
//           totalAmount += total;
//           if (_id === "Paid") paidAmount += paid;
//           if (_id === "Pending") pendingAmount += balanceDueAmount;
//           if (_id === "Overdue") overdueAmount += balanceDueAmount;
//         });

//         setInvoiceSummary({ totalAmount, pendingAmount, paidAmount, overdueAmount });
//       })
//       .catch((error) => console.error("Error fetching invoice summary:", error));
//   }, []);
//   return (
//     <Box sx={{ padding: 2 }}>
//      <Box>
//       <Typography gutterBottom variant="h5" component="div">
//         Jobs Details
//       </Typography>
//       <Box mt={3}>
//         <Grid container spacing={2} justifyContent="center">
//           <Grid item xs={12} sm={3}>
//             <Card sx={{ width:'250px'}}>
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                   Total Jobs
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">{jobCount}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} sm={3}>
//             <Card sx={{ width:'250px'}}>
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                   Active Jobs
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">{activeJobCount}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} sm={3}>
//             <Card sx={{ width:'250px'}}>
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                   Archived Jobs
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">{inactiveJobCount}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//             <Card sx={{ width:'250px'}}>
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                   Finished Jobs
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">{0}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       </Box>
//       </Box>
//       <Box mt={3}>
//       <Typography gutterBottom variant="h5" component="div">
//         Invoices Details
//       </Typography>
//       <Box mt={3}>
//         <Grid container spacing={2} justifyContent="center">
//           <Grid item xs={12} sm={3}>
//             <Card sx={{ width:'250px'}}>
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                   Total Invoices
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">{invoiceCount}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} sm={3}>
//             <Card sx={{ width:'250px'}}>
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                   Pending Invoices
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">{invoiceCounts.Pending}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} sm={3}>
//             <Card sx={{ width:'250px'}}>
//               <CardContent>
//                 <Typography gutterBottom variant="h6" component="div">
//                   Paid Invoices
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary"> {invoiceCounts.Paid}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid item xs={12} sm={3}>
//       <Card sx={{ width:'250px'}}>
//         <CardContent>
//           <Typography gutterBottom variant="h6" component="div">
//             Overdue Invoices
//           </Typography>
//           <Typography variant="body2" color="text.secondary">{invoiceCounts.Overdue}</Typography>
//         </CardContent>
//       </Card>
//     </Grid>
//         </Grid>
//       </Box>
      

//       </Box>
      
//       <Box mt={3}>
//       <Typography gutterBottom variant="h5">Invoices Amount</Typography>
//       <Box mt={3}>
//         <Grid container spacing={2} justifyContent="center">
//           {[
//             { title: "Total Amount", value: invoiceSummary.totalAmount },
//             { title: "Pending Amount", value: invoiceSummary.pendingAmount },
//             { title: "Paid Amount", value: invoiceSummary.paidAmount },
//             { title: "Overdue Amount", value: invoiceSummary.overdueAmount },
//           ].map(({ title, value }) => (
//             <Grid item xs={12} sm={3} key={title}>
//               <Card sx={{ width: "250px" }}>
//                 <CardContent>
//                   <Typography gutterBottom variant="h6">{title}</Typography>
//                   <Typography variant="body2" color="text.secondary">${value.toFixed(2)}</Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Box>
//     </Box>
//   );
// };

// export default Insights;

import React, { useState, useEffect,useRef } from "react";
import {
  Box,
  Checkbox,
  TextField,
  Menu,
  MenuItem,
  Chip,
  Typography,
  IconButton,Paper
} from "@mui/material";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const MultiSelectDropdown = () => {
  const containerRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState([]);
  const [menuWidth, setMenuWidth] = useState(null);

  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
        const response = await fetch(url);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [LOGIN_API]);

  const userOptions = userData.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (containerRef.current) {
      setMenuWidth(containerRef.current.offsetWidth);
    }
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };
console.log("selcted values",selectedValues)
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSelection = () => {
    setSelectedValues([]);
  };

  const filteredOptions = userOptions.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
   
    <Box sx={{ width: "500px" }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
        Accounts
      </Typography>

      {/* Selected Items & Dropdown Toggle */}
      <Box
        ref={containerRef} // Reference the container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "4px",
          cursor: "pointer",
          bgcolor: "background.paper",
          // "&:hover": { borderColor: "primary.main" },
          width: "100%",
        }}
        onClick={handleClick}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {selectedValues.length > 0 ? (
            selectedValues.map((value) => {
              const selectedOption = userOptions.find(
                (option) => option.value === value
              );
              return selectedOption ? (
                <Chip
                  key={value}
                  label={selectedOption.label}
                  onDelete={() => handleSelect(value)}
                  // color="primary"
                  size="small"
                  sx={{
                    // backgroundColor: account?.colour || "#ccc", // Use account colour or fallback
                    // color: "#fff",
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
              ) : null;
            })
          ) : (
            <Typography variant="body2" color="textSecondary">
              Start typing name or email or code
            </Typography>
          )}
        </Box>
        <IconButton size="small">
          {anchorEl ? <FaChevronUp /> : <FaChevronDown />}
        </IconButton>
      </Box>

      {/* Dropdown Menu with Fixed Width */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box
          sx={{
            width: menuWidth || "auto", // Maintain consistent width
            maxHeight: "250px",
            overflowY: "auto",
          }}
        >
          {/* Search Field */}
          <Box sx={{ p: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
               autoComplete="off"
            />
          </Box>

          {/* List of Options */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <Box
                key={option.value}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 12px",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => handleSelect(option.value)}
              >
                <Checkbox
                  checked={selectedValues.includes(option.value)}
                  sx={{ p: 0, mr: 1 }}
                />
                <Typography>{option.label}</Typography>
              </Box>
            ))
          ) : (
            <Typography sx={{ p: 2, color: "gray" }}>No results found</Typography>
          )}

            <Box
              sx={{
                padding: "8px 12px",
                color: "red",
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover" },
              }}
              onClick={clearSelection}
            >
              X Clear selected
            </Box>
      
        </Box>
      </Menu>
    </Box>
  );
};

export default MultiSelectDropdown;
