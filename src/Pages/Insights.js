// // // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // // import { Grid, Box } from "@mui/material";
// // // // // // // // // import axios from "axios";
// // // // // // // // // import {
// // // // // // // // //   Card,
// // // // // // // // //   CardContent,
// // // // // // // // //   CardMedia,
// // // // // // // // //   Typography,
// // // // // // // // //   CardActions,
// // // // // // // // //   Button,
// // // // // // // // // } from "@mui/material";
// // // // // // // // // const Insights = () => {
// // // // // // // // //   const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
// // // // // // // // //   const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
// // // // // // // // //   // jobs count
// // // // // // // // //   const [jobCount, setJobCount] = useState(null);
// // // // // // // // //   const [activeJobCount, setActiveJobCount] = useState(null);
// // // // // // // // //   const [inactiveJobCount, setInactiveJobCount] = useState(null);
// // // // // // // // //   const [invoiceCount, setInvoiceCount] = useState(null);
// // // // // // // // //   const [invoiceCounts, setInvoiceCounts] = useState({ Paid: 0, Pending: 0, Overdue: 0 });
// // // // // // // // //   const [invoiceSummary, setInvoiceSummary] = useState({
// // // // // // // // //     totalAmount: 0,
// // // // // // // // //     pendingAmount: 0,
// // // // // // // // //     paidAmount: 0,
// // // // // // // // //     overdueAmount: 0,
// // // // // // // // //   });
// // // // // // // // //   useEffect(() => {
// // // // // // // // //     // Fetch job count from API
// // // // // // // // //     axios.get(`${JOBS_API}/workflow/jobs/jobscount`)
// // // // // // // // //       .then((response) => {
// // // // // // // // //         setJobCount(response.data.count); // Assuming API returns { count: <job count> }
// // // // // // // // //       })
// // // // // // // // //       .catch((error) => {
// // // // // // // // //         console.error("Error fetching job count:", error);
// // // // // // // // //       });

// // // // // // // // //        // Fetch count of active jobs
// // // // // // // // //     axios.get(`${JOBS_API}/workflow/jobs/activejobcounts`)
// // // // // // // // //     .then((response) => {
// // // // // // // // //       setActiveJobCount(response.data.count);
// // // // // // // // //     })
// // // // // // // // //     .catch((error) => {
// // // // // // // // //       console.error("Error fetching active job count:", error);
// // // // // // // // //     });

// // // // // // // // //   // Fetch count of inactive jobs
// // // // // // // // //   axios.get(`${JOBS_API}/workflow/jobs/inactivejobcounts`)
// // // // // // // // //     .then((response) => {
// // // // // // // // //       setInactiveJobCount(response.data.count);
// // // // // // // // //     })
// // // // // // // // //     .catch((error) => {
// // // // // // // // //       console.error("Error fetching inactive job count:", error);
// // // // // // // // //     });

// // // // // // // // //       // Fetch count of total invoices
// // // // // // // // //   axios.get(`${INVOICE_NEW}/workflow/invoices/invoicecount`)
// // // // // // // // //   .then((response) => {
// // // // // // // // //     setInvoiceCount(response.data.count);
// // // // // // // // //   })
// // // // // // // // //   .catch((error) => {
// // // // // // // // //     console.error("Error fetching inactive job count:", error);
// // // // // // // // //   });
// // // // // // // // //   axios
// // // // // // // // //       .get(`${INVOICE_NEW}/workflow/invoices/invoicestatuscount`)
// // // // // // // // //       .then((response) => {
// // // // // // // // //         const data = response.data.invoiceCounts;
        
// // // // // // // // //         // Convert response to an object with statuses as keys
// // // // // // // // //         const countMap = {};
// // // // // // // // //         data.forEach(({ _id, count }) => {
// // // // // // // // //           countMap[_id] = count;
// // // // // // // // //         });

// // // // // // // // //         // Update state with counts
// // // // // // // // //         setInvoiceCounts({
// // // // // // // // //           Paid: countMap["Paid"] || 0,
// // // // // // // // //           Pending: countMap["Pending"] || 0,
// // // // // // // // //           Overdue: countMap["Overdue"] || 0,
// // // // // // // // //         });
// // // // // // // // //       })
// // // // // // // // //       .catch((error) => console.error("Error fetching invoice counts:", error));
// // // // // // // // //       axios
// // // // // // // // //       .get(`${INVOICE_NEW}/workflow/invoices/invoicesummary`)
// // // // // // // // //       .then((response) => {
// // // // // // // // //         const data = response.data.summary;
// // // // // // // // //         let totalAmount = 0, paidAmount = 0, pendingAmount = 0, overdueAmount = 0;

// // // // // // // // //         data.forEach(({ _id, totalAmount: total, paidAmount: paid, balanceDueAmount }) => {
// // // // // // // // //           totalAmount += total;
// // // // // // // // //           if (_id === "Paid") paidAmount += paid;
// // // // // // // // //           if (_id === "Pending") pendingAmount += balanceDueAmount;
// // // // // // // // //           if (_id === "Overdue") overdueAmount += balanceDueAmount;
// // // // // // // // //         });

// // // // // // // // //         setInvoiceSummary({ totalAmount, pendingAmount, paidAmount, overdueAmount });
// // // // // // // // //       })
// // // // // // // // //       .catch((error) => console.error("Error fetching invoice summary:", error));
// // // // // // // // //   }, []);
// // // // // // // // //   return (
// // // // // // // // //     <Box sx={{ padding: 2 }}>
// // // // // // // // //      <Box>
// // // // // // // // //       <Typography gutterBottom variant="h5" component="div">
// // // // // // // // //         Jobs Details
// // // // // // // // //       </Typography>
// // // // // // // // //       <Box mt={3}>
// // // // // // // // //         <Grid container spacing={2} justifyContent="center">
// // // // // // // // //           <Grid item xs={12} sm={3}>
// // // // // // // // //             <Card sx={{ width:'250px'}}>
// // // // // // // // //               <CardContent>
// // // // // // // // //                 <Typography gutterBottom variant="h6" component="div">
// // // // // // // // //                   Total Jobs
// // // // // // // // //                 </Typography>
// // // // // // // // //                 <Typography variant="body2" color="text.secondary">{jobCount}</Typography>
// // // // // // // // //               </CardContent>
// // // // // // // // //             </Card>
// // // // // // // // //           </Grid>

// // // // // // // // //           <Grid item xs={12} sm={3}>
// // // // // // // // //             <Card sx={{ width:'250px'}}>
// // // // // // // // //               <CardContent>
// // // // // // // // //                 <Typography gutterBottom variant="h6" component="div">
// // // // // // // // //                   Active Jobs
// // // // // // // // //                 </Typography>
// // // // // // // // //                 <Typography variant="body2" color="text.secondary">{activeJobCount}</Typography>
// // // // // // // // //               </CardContent>
// // // // // // // // //             </Card>
// // // // // // // // //           </Grid>

// // // // // // // // //           <Grid item xs={12} sm={3}>
// // // // // // // // //             <Card sx={{ width:'250px'}}>
// // // // // // // // //               <CardContent>
// // // // // // // // //                 <Typography gutterBottom variant="h6" component="div">
// // // // // // // // //                   Archived Jobs
// // // // // // // // //                 </Typography>
// // // // // // // // //                 <Typography variant="body2" color="text.secondary">{inactiveJobCount}</Typography>
// // // // // // // // //               </CardContent>
// // // // // // // // //             </Card>
// // // // // // // // //           </Grid>
// // // // // // // // //           <Grid item xs={12} sm={3}>
// // // // // // // // //             <Card sx={{ width:'250px'}}>
// // // // // // // // //               <CardContent>
// // // // // // // // //                 <Typography gutterBottom variant="h6" component="div">
// // // // // // // // //                   Finished Jobs
// // // // // // // // //                 </Typography>
// // // // // // // // //                 <Typography variant="body2" color="text.secondary">{0}</Typography>
// // // // // // // // //               </CardContent>
// // // // // // // // //             </Card>
// // // // // // // // //           </Grid>
// // // // // // // // //         </Grid>
// // // // // // // // //       </Box>
// // // // // // // // //       </Box>
// // // // // // // // //       <Box mt={3}>
// // // // // // // // //       <Typography gutterBottom variant="h5" component="div">
// // // // // // // // //         Invoices Details
// // // // // // // // //       </Typography>
// // // // // // // // //       <Box mt={3}>
// // // // // // // // //         <Grid container spacing={2} justifyContent="center">
// // // // // // // // //           <Grid item xs={12} sm={3}>
// // // // // // // // //             <Card sx={{ width:'250px'}}>
// // // // // // // // //               <CardContent>
// // // // // // // // //                 <Typography gutterBottom variant="h6" component="div">
// // // // // // // // //                   Total Invoices
// // // // // // // // //                 </Typography>
// // // // // // // // //                 <Typography variant="body2" color="text.secondary">{invoiceCount}</Typography>
// // // // // // // // //               </CardContent>
// // // // // // // // //             </Card>
// // // // // // // // //           </Grid>

// // // // // // // // //           <Grid item xs={12} sm={3}>
// // // // // // // // //             <Card sx={{ width:'250px'}}>
// // // // // // // // //               <CardContent>
// // // // // // // // //                 <Typography gutterBottom variant="h6" component="div">
// // // // // // // // //                   Pending Invoices
// // // // // // // // //                 </Typography>
// // // // // // // // //                 <Typography variant="body2" color="text.secondary">{invoiceCounts.Pending}</Typography>
// // // // // // // // //               </CardContent>
// // // // // // // // //             </Card>
// // // // // // // // //           </Grid>

// // // // // // // // //           <Grid item xs={12} sm={3}>
// // // // // // // // //             <Card sx={{ width:'250px'}}>
// // // // // // // // //               <CardContent>
// // // // // // // // //                 <Typography gutterBottom variant="h6" component="div">
// // // // // // // // //                   Paid Invoices
// // // // // // // // //                 </Typography>
// // // // // // // // //                 <Typography variant="body2" color="text.secondary"> {invoiceCounts.Paid}</Typography>
// // // // // // // // //               </CardContent>
// // // // // // // // //             </Card>
// // // // // // // // //           </Grid>
// // // // // // // // //           <Grid item xs={12} sm={3}>
// // // // // // // // //       <Card sx={{ width:'250px'}}>
// // // // // // // // //         <CardContent>
// // // // // // // // //           <Typography gutterBottom variant="h6" component="div">
// // // // // // // // //             Overdue Invoices
// // // // // // // // //           </Typography>
// // // // // // // // //           <Typography variant="body2" color="text.secondary">{invoiceCounts.Overdue}</Typography>
// // // // // // // // //         </CardContent>
// // // // // // // // //       </Card>
// // // // // // // // //     </Grid>
// // // // // // // // //         </Grid>
// // // // // // // // //       </Box>
      

// // // // // // // // //       </Box>
      
// // // // // // // // //       <Box mt={3}>
// // // // // // // // //       <Typography gutterBottom variant="h5">Invoices Amount</Typography>
// // // // // // // // //       <Box mt={3}>
// // // // // // // // //         <Grid container spacing={2} justifyContent="center">
// // // // // // // // //           {[
// // // // // // // // //             { title: "Total Amount", value: invoiceSummary.totalAmount },
// // // // // // // // //             { title: "Pending Amount", value: invoiceSummary.pendingAmount },
// // // // // // // // //             { title: "Paid Amount", value: invoiceSummary.paidAmount },
// // // // // // // // //             { title: "Overdue Amount", value: invoiceSummary.overdueAmount },
// // // // // // // // //           ].map(({ title, value }) => (
// // // // // // // // //             <Grid item xs={12} sm={3} key={title}>
// // // // // // // // //               <Card sx={{ width: "250px" }}>
// // // // // // // // //                 <CardContent>
// // // // // // // // //                   <Typography gutterBottom variant="h6">{title}</Typography>
// // // // // // // // //                   <Typography variant="body2" color="text.secondary">${value.toFixed(2)}</Typography>
// // // // // // // // //                 </CardContent>
// // // // // // // // //               </Card>
// // // // // // // // //             </Grid>
// // // // // // // // //           ))}
// // // // // // // // //         </Grid>
// // // // // // // // //       </Box>
// // // // // // // // //     </Box>
// // // // // // // // //     </Box>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default Insights;



// // // // // // // // import React, { useState } from "react";
// // // // // // // // import Select, { components } from "react-select";
// // // // // // // // import SearchIcon from "@mui/icons-material/Search";
// // // // // // // // import CloseIcon from "@mui/icons-material/Close";

// // // // // // // // const options = [
// // // // // // // //   { value: "janavi_patil", label: "janavi patil" },
// // // // // // // //   { value: "test_accounts", label: "test accounts" },
// // // // // // // //   { value: "john_doe", label: "John Doe" },
// // // // // // // //   { value: "jane_smith", label: "Jane Smith" },
// // // // // // // // ];

// // // // // // // // const CustomDropdown = (props) => {
// // // // // // // //   const { selectProps } = props;
// // // // // // // //   const { setSearchTerm, searchTerm } = selectProps;

// // // // // // // //   return (
// // // // // // // //     <components.Menu {...props}>
// // // // // // // //       {/* Custom Search Input Inside Dropdown */}
// // // // // // // //       <div style={{ 
// // // // // // // //           padding: "8px", 
// // // // // // // //           borderBottom: "1px solid #ccc", 
// // // // // // // //           display: "flex", 
// // // // // // // //           alignItems: "center",
// // // // // // // //           gap: "5px"
// // // // // // // //         }}>
// // // // // // // //         <SearchIcon style={{ fontSize: "18px", color: "#666" }} />
// // // // // // // //         <input
// // // // // // // //           type="text"
// // // // // // // //           placeholder="Search"
// // // // // // // //           value={searchTerm}
// // // // // // // //           onChange={(e) => setSearchTerm(e.target.value)}
// // // // // // // //           style={{
// // // // // // // //             flex: 1,
// // // // // // // //             padding: "6px",
// // // // // // // //             border: "none",
// // // // // // // //             outline: "none",
// // // // // // // //             fontSize: "14px",
// // // // // // // //           }}
// // // // // // // //         />
// // // // // // // //         {searchTerm && (
// // // // // // // //           <CloseIcon 
// // // // // // // //             style={{ fontSize: "18px", cursor: "pointer", color: "#666" }} 
// // // // // // // //             onClick={() => setSearchTerm("")} 
// // // // // // // //           />
// // // // // // // //         )}
// // // // // // // //       </div>
// // // // // // // //       {props.children}
// // // // // // // //     </components.Menu>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const MultiSelectDropdown = () => {
// // // // // // // //   const [selectedOptions, setSelectedOptions] = useState([]);
// // // // // // // //   const [searchTerm, setSearchTerm] = useState("");

// // // // // // // //   const filteredOptions = options.filter((option) =>
// // // // // // // //     option.label.toLowerCase().includes(searchTerm.toLowerCase())
// // // // // // // //   );

// // // // // // // //   return (
// // // // // // // //     <div style={{ width: "300px", margin: "20px auto" }}>
// // // // // // // //       <Select
// // // // // // // //         options={filteredOptions}
// // // // // // // //         isMulti
// // // // // // // //         isSearchable={false} // Disable default search
// // // // // // // //         value={selectedOptions}
// // // // // // // //         onChange={setSelectedOptions}
// // // // // // // //         placeholder="Start typing name or email or code"
// // // // // // // //         components={{ Menu: CustomDropdown }}
// // // // // // // //         searchTerm={searchTerm}
// // // // // // // //         setSearchTerm={setSearchTerm}
// // // // // // // //       />
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default MultiSelectDropdown;


// // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // import Select from 'react-select';

// // // // // // // const SearchableDropdownWithCheckboxes = () => {
// // // // // //   // const [userData, setUserData] = useState([]);
// // // // // //   // const [selectedOptions, setSelectedOptions] = useState([]);

// // // // // //   // const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

// // // // // //   // const fetchData = async () => {
// // // // // //   //   try {
// // // // // //   //     const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
// // // // // //   //     const response = await fetch(url);
// // // // // //   //     const data = await response.json();
// // // // // //   //     setUserData(data);
// // // // // //   //   } catch (error) {
// // // // // //   //     console.error("Error fetching data:", error);
// // // // // //   //   }
// // // // // //   // };

// // // // // //   // useEffect(() => {
// // // // // //   //   fetchData();
// // // // // //   // }, []);

// // // // // //   // const options = userData.map((user) => ({
// // // // // //   //   value: user._id,
// // // // // //   //   label: user.username,
// // // // // //   // }));

// // // // // //   // const handleChange = (selected) => {
// // // // // //   //   setSelectedOptions(selected);
// // // // // //   //   console.log(selected)
// // // // // //   // };

// // // // // // //   const customOption = ({ innerProps, label, isSelected }) => (
// // // // // // //     <div {...innerProps} style={{ padding: '8px' }}>
// // // // // // //       <input
// // // // // // //         type="checkbox"
// // // // // // //         checked={isSelected}
// // // // // // //         readOnly
// // // // // // //         style={{ marginRight: '8px' }}
// // // // // // //       />
// // // // // // //       {label}
// // // // // // //     </div>
// // // // // // //   );

// // // // // // //   return (
// // // // // // //     <div>
// // // // // // //       <Select
// // // // // // //         isMulti
// // // // // // //         options={options}
// // // // // //         // value={selectedOptions}
// // // // // //         // onChange={handleChange}
// // // // // // //         placeholder="Start typing name or email or code"
// // // // // // //         isClearable={true}
// // // // // // //         isSearchable={true}
// // // // // // //         closeMenuOnSelect={false}
// // // // // // //         components={{ Option: customOption }}
// // // // // // //       />
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default SearchableDropdownWithCheckboxes;


// // // // // // import { Box } from '@mui/material';
// // // // // // import React,{useState,useEffect} from 'react';

// // // // // // import Select from 'react-select';


// // // // // // export default function AnimatedMulti() {
// // // //   const [userData, setUserData] = useState([]);
// // // //   const [selectedOptions, setSelectedOptions] = useState([]);

// // // //   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

// // // //   const fetchData = async () => {
// // // //     try {
// // // //       const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
// // // //       const response = await fetch(url);
// // // //       const data = await response.json();
// // // //       setUserData(data);
// // // //     } catch (error) {
// // // //       console.error("Error fetching data:", error);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     fetchData();
// // // //   }, []);

// // // //   const options = userData.map((user) => ({
// // // //     value: user._id,
// // // //     label: user.username,
// // // //   }));

// // // // // //   const handleChange = (selected) => {
// // // // // //     setSelectedOptions(selected);
// // // // // //     console.log(selected)
// // // // // //   };
// // // // // //   return (
// // // // // //     <Box sx={{width:'20%'}}>

  
// // // // // //     <Select
// // // // // //       closeMenuOnSelect={false}
      
// // // // // //       options={options}
// // // // // //       value={selectedOptions}
// // // // // //       onChange={handleChange}
// // // // // //       isMulti
   
// // // // // //     />
// // // // // //       </Box>
// // // // // //   );
// // // // // // }


// // // // // import { Box } from '@mui/material';
// // // // // import React, { useState, useEffect } from 'react';
// // // // // import Select from 'react-select';

// // // // // export default function AnimatedMulti() {
// // // // //   const [userData, setUserData] = useState([]);
// // // // //   const [selectedOptions, setSelectedOptions] = useState([]);

// // // // //   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

// // // // //   const fetchData = async () => {
// // // // //     try {
// // // // //       const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
// // // // //       const response = await fetch(url);
// // // // //       const data = await response.json();
// // // // //       setUserData(data);
// // // // //     } catch (error) {
// // // // //       console.error('Error fetching data:', error);
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     fetchData();
// // // // //   }, []);

// // // // //   const options = userData.map((user) => ({
// // // // //     value: user._id,
// // // // //     label: user.username,
// // // // //   }));

// // // // //   const handleChange = (selected) => {
// // // // //     setSelectedOptions(selected);
// // // // //     console.log(selected);
// // // // //   };

// // // // //   return (
// // // // //     <Box sx={{ width: '20%' }}>
// // // // //       <Select
// // // // //         closeMenuOnSelect={false}
// // // // //         options={options}
// // // // //         value={selectedOptions}
// // // // //         onChange={handleChange}
// // // // //         isMulti
// // // // //         isSearchable={true} // Enables search input in dropdown
// // // // //       />
// // // // //     </Box>
// // // // //   );
// // // // // }


// // // // import React, { useState } from 'react';
// // // // import "./insights.css"
// // // // const AccountDropdown = () => {
// // // //   const [isOpen, setIsOpen] = useState(false);
// // // //   const [selectedValue, setSelectedValue] = useState('');
// // // //   const [searchQuery, setSearchQuery] = useState('');
// // // //   const [options, setOptions] = useState([
// // // //     'John Doe (john@example.com)',
// // // //     'Jane Smith (jane@example.com)',
// // // //     'Alice Johnson (alice@example.com)',
// // // //     'Bob Brown (bob@example.com)',
// // // //   ]);

// // // //   const toggleDropdown = () => {
// // // //     setIsOpen(!isOpen);
// // // //   };

// // // //   const handleSelect = (value) => {
// // // //     setSelectedValue(value);
// // // //     setIsOpen(false);
// // // //     setSearchQuery(''); // Clear search query after selection
// // // //   };

// // // //   const handleSearchChange = (e) => {
// // // //     setSearchQuery(e.target.value);
// // // //   };

// // // //   // Filter options based on the search query
// // // //   const filteredOptions = options.filter((option) =>
// // // //     option.toLowerCase().includes(searchQuery.toLowerCase())
// // // //   );

// // // //   return (
// // // //     <div className="_fieldContainer_15jfe_9">
// // // //       <div
// // // //         tabIndex="0"
// // // //         data-test="select-trigger"
// // // //         className="_root_1uhpt_1"
// // // //         aria-autocomplete="none"
// // // //         aria-expanded={isOpen}
// // // //         aria-haspopup="listbox"
// // // //         onClick={toggleDropdown}
// // // //       >
// // // //         <div className="_label_1uhpt_53 _body-sm-regular_16d8g_129">Accounts</div>
// // // //         <div className="_trigger_1uhpt_14 _isMedium_1uhpt_32">
// // // //           <div
// // // //             data-test="shared-element__select__input-placeholder"
// // // //             className="_placeholder_1uhpt_60 _body-md-regular_16d8g_81"
// // // //           >
// // // //             {selectedValue || 'Start typing name or email or code'}
// // // //           </div>
// // // //           <div className="_root_ejs77_1 _gap8_ejs77_17 _middleRight_ejs77_125">
// // // //             <svg
// // // //               className="icon v2-icon v2-icon-chevron-down"
// // // //               style={{ fill: 'var(--colors-core-neutral-600)' }}
// // // //             >
// // // //               <use xlinkHref="/packs/assets/icon-sprites-thKiJvur.svg#v2-icon-chevron-down"></use>
// // // //             </svg>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //       {isOpen && (
// // // //         <div className="dropdown-menu">
// // // //           {/* Search input */}
// // // //           <input
// // // //             type="text"
// // // //             placeholder="Search..."
// // // //             value={searchQuery}
// // // //             onChange={handleSearchChange}
// // // //             className="search-input"
// // // //           />
// // // //           {/* Filtered options */}
// // // //           {filteredOptions.length > 0 ? (
// // // //             filteredOptions.map((option, index) => (
// // // //               <div
// // // //                 key={index}
// // // //                 className="dropdown-item"
// // // //                 onClick={() => handleSelect(option)}
// // // //               >
// // // //                 {option}
// // // //               </div>
// // // //             ))
// // // //           ) : (
// // // //             <div className="dropdown-item no-results">No results found</div>
// // // //           )}
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default AccountDropdown;



// // // import React, { useState } from 'react';
// // // import "./insights.css"
// // // const AccountDropdown = () => {
// // //   const [isOpen, setIsOpen] = useState(false);
// // //   const [selectedValue, setSelectedValue] = useState('');
// // //   const [searchQuery, setSearchQuery] = useState('');
// // //   const [options, setOptions] = useState([
// // //     'Janavi Patil (janavi@example.com)',
// // //     'John Doe (john@example.com)',
// // //     'Jane Smith (jane@example.com)',
// // //     'Alice Johnson (alice@example.com)',
// // //     'Bob Brown (bob@example.com)',
// // //   ]);

// // //   const toggleDropdown = () => {
// // //     setIsOpen(!isOpen);
// // //   };

// // //   const handleSelect = (value) => {
// // //     setSelectedValue(value);
// // //     setIsOpen(false);
// // //     setSearchQuery('');
// // //   };

// // //   const handleSearchChange = (e) => {
// // //     setSearchQuery(e.target.value);
// // //   };

// // //   const clearSelection = () => {
// // //     setSelectedValue('');
// // //     setIsOpen(false);
// // //     setSearchQuery('');
// // //   };

// // //   const filteredOptions = options.filter((option) =>
// // //     option.toLowerCase().includes(searchQuery.toLowerCase())
// // //   );

// // //   return (
// // //     <div className="dropdown-container">
// // //        <div className="dropdown-label">Accounts</div>
// // //       <div className="dropdown-trigger" onClick={toggleDropdown}>
       
// // //         <div className="dropdown-placeholder">
// // //           {selectedValue || 'Start typing name or email or code'}
// // //         </div>
// // //         <div className="dropdown-icon">
// // //           <svg
// // //             className="icon"
// // //             style={{ fill: 'var(--colors-core-neutral-600)' }}
// // //           >
// // //             <use xlinkHref="/packs/assets/icon-sprites-thKiJvur.svg#v2-icon-chevron-down"></use>
// // //           </svg>
// // //         </div>
// // //       </div>
// // //       {isOpen && (
// // //         <div className="dropdown-menu">
// // //           <input
// // //             type="text"
// // //             placeholder="Search..."
// // //             value={searchQuery}
// // //             onChange={handleSearchChange}
// // //             className="search-input"
// // //           />
// // //           {filteredOptions.length > 0 ? (
// // //             filteredOptions.map((option, index) => (
// // //               <div
// // //                 key={index}
// // //                 className="dropdown-item"
// // //                 onClick={() => handleSelect(option)}
// // //               >
// // //                 {option}
// // //               </div>
// // //             ))
// // //           ) : (
// // //             <div className="dropdown-item no-results">No results found</div>
// // //           )}
// // //           {selectedValue && (
// // //             <div className="dropdown-item clear-selected" onClick={clearSelection}>
// // //               Clear selected
// // //             </div>
// // //           )}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default AccountDropdown;

// // // import React, { useState } from 'react';
// // // import "./insights.css"
// // // import { FaChevronDown ,FaChevronUp} from "react-icons/fa";
// // // const MultiSelectDropdown = () => {
// // //   const [isOpen, setIsOpen] = useState(false);
// // //   const [selectedValues, setSelectedValues] = useState([]);
// // //   const [searchQuery, setSearchQuery] = useState('');
// // //   const [options, setOptions] = useState([
// // //     'Janavi Patil (janavi@example.com)',
// // //     'Test Accounts (test@example.com)',
// // //     'John Doe (john@example.com)',
// // //     'Jane Smith (jane@example.com)',
// // //   ]);

// // //   const toggleDropdown = () => {
// // //     setIsOpen(!isOpen);
// // //   };

// // //   const handleSelect = (value) => {
// // //     if (selectedValues.includes(value)) {
// // //       // If already selected, remove it
// // //       setSelectedValues(selectedValues.filter((item) => item !== value));
// // //     } else {
// // //       // If not selected, add it
// // //       setSelectedValues([...selectedValues, value]);
// // //     }
// // //   };

// // //   const handleSearchChange = (e) => {
// // //     setSearchQuery(e.target.value);
// // //   };

// // //   const clearSelection = () => {
// // //     setSelectedValues([]);
// // //   };

// // //   const filteredOptions = options.filter((option) =>
// // //     option.toLowerCase().includes(searchQuery.toLowerCase())
// // //   );

// // //   return (
// // //     <div className="dropdown-container">
// // //       <div className="dropdown-trigger" onClick={toggleDropdown}>
// // //         <div className="dropdown-label">Accounts</div>
// // //         <div className="dropdown-placeholder">
// // //           {selectedValues.length > 0
// // //             ? `${selectedValues} `
// // //             : 'Start typing name or email or code'}
// // //         </div>
// // //         <div>
// // //           {/* Conditional rendering for chevron icon */}
// // //           {isOpen ? (
// // //             <FaChevronUp className="dropdown-icon" />
// // //           ) : (
// // //             <FaChevronDown className="dropdown-icon" />
// // //           )}
// // //         </div>
// // //       </div>
// // //       {isOpen && (
// // //         <div className="dropdown-menu">
// // //           <input
// // //             type="text"
// // //             placeholder="Search..."
// // //             value={searchQuery}
// // //             onChange={handleSearchChange}
// // //             className="search-input"
// // //           />
// // //           {filteredOptions.length > 0 ? (
// // //             filteredOptions.map((option, index) => (
// // //               <label key={index} className="dropdown-item">
// // //                 <input
// // //                   type="checkbox"
// // //                   checked={selectedValues.includes(option)}
// // //                   onChange={() => handleSelect(option)}
// // //                 />
// // //                 {option}
// // //               </label>
// // //             ))
// // //           ) : (
// // //             <div className="dropdown-item no-results">No results found</div>
// // //           )}
// // //           {selectedValues.length > 0 && (
// // //             <div className="dropdown-item clear-selected" onClick={clearSelection}>
// // //               <input type="checkbox" checked={false} readOnly />
// // //               Clear selected
// // //             </div>
// // //           )}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default MultiSelectDropdown;


// // import React, { useState ,useEffect} from 'react';
// // import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Import both icons
// // import "./insights.css"
// // const MultiSelectDropdown = () => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [selectedValues, setSelectedValues] = useState([]);
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [userData, setUserData] = useState([]);
// //   //  const [selectedOptions, setSelectedOptions] = useState([]);

// //    const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

// //    const fetchData = async () => {
// //      try {
// //        const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
// //        const response = await fetch(url);
// //        const data = await response.json();
// //        setUserData(data);
// //      } catch (error) {
// //        console.error("Error fetching data:", error);
// //      }
// //    };

// //    useEffect(() => {
// //      fetchData();
// //    }, []);

// //    const userOptions = userData.map((user) => ({
// //      value: user._id,
// //      label: user.username,
// //    }));
// //   // const [options, setOptions] = useState([
// //   //   'Janavi Patil (janavi@example.com)',
// //   //   'Test Accounts (test@example.com)',
// //   //   'John Doe (john@example.com)',
// //   //   'Jane Smith (jane@example.com)',
// //   // ]);

// //   const toggleDropdown = () => {
// //     setIsOpen(!isOpen);
// //   };

// //   const handleSelect = (value) => {
// //     if (selectedValues.includes(value)) {
// //       // If already selected, remove it
// //       setSelectedValues(selectedValues.filter((item) => item !== value));
// //     } else {
// //       // If not selected, add it
// //       setSelectedValues([...selectedValues, value]);
// //     }
// //   };

// //   const handleSearchChange = (e) => {
// //     setSearchQuery(e.target.value);
// //   };

// //   const clearSelection = () => {
// //     setSelectedValues([]);
// //   };

// //   const filteredOptions = userOptions.filter((option) =>
// //     option.toLowerCase().includes(searchQuery.toLowerCase())
// //   );
   
// //   return (
// //     <div className="dropdown-container">
// //       <div className="dropdown-trigger" onClick={toggleDropdown}>
// //         <div className="dropdown-label">Accounts</div>
// //         <div className="selected-values">
// //           {selectedValues.length > 0 ? (
// //             selectedValues.map((value, index) => (
// //               <div key={index} className="selected-value">
// //                 {value}
// //                 <span
// //                   className="remove-icon"
// //                   onClick={(e) => {
// //                     e.stopPropagation(); // Prevent dropdown from closing
// //                     handleSelect(value);
// //                   }}
// //                 >
// //                   ×
// //                 </span>
// //               </div>
// //             ))
// //           ) : (
// //             <div className="dropdown-placeholder">
// //               Start typing name or email or code
// //             </div>
// //           )}
// //         </div>
// //         <div>
// //           {/* Conditional rendering for chevron icon */}
// //           {isOpen ? (
// //             <FaChevronUp className="dropdown-icon" />
// //           ) : (
// //             <FaChevronDown className="dropdown-icon" />
// //           )}
// //         </div>
// //       </div>
// //       {isOpen && (
// //         <div className="dropdown-menu">
// //           <input
// //             type="text"
// //             placeholder="Search..."
// //             value={searchQuery}
// //             onChange={handleSearchChange}
// //             className="search-input"
// //           />
// //           {filteredOptions.length > 0 ? (
// //             filteredOptions.map((option, index) => (
// //               <label key={index} className="dropdown-item">
// //                 <input
// //                   type="checkbox"
// //                   checked={selectedValues.includes(option)}
// //                   onChange={() => handleSelect(option)}
// //                 />
// //                 {userOptions}
// //               </label>
// //             ))
// //           ) : (
// //             <div className="dropdown-item no-results">No results found</div>
// //           )}
// //           {selectedValues.length > 0 && (
// //             <div className="dropdown-item clear-selected" onClick={clearSelection}>
// //               <input type="checkbox" checked={false} readOnly />
// //               Clear selected
// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default MultiSelectDropdown;

// import React, { useState, useEffect } from 'react';
// import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
// import "./insights.css"
// const MultiSelectDropdown = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedValues, setSelectedValues] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [userData, setUserData] = useState([]);

//   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;

//   const fetchData = async () => {
//     try {
//       const url = `${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`;
//       const response = await fetch(url);
//       const data = await response.json();
//       setUserData(data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const userOptions = userData.map((user) => ({
//     value: user._id,
//     label: user.username,
//   }));

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleSelect = (value) => {
//     if (selectedValues.includes(value)) {
//       // If already selected, remove it
//       setSelectedValues(selectedValues.filter((item) => item !== value));
//       console.log(selectedValues)
//     } else {
//       // If not selected, add it
//       setSelectedValues([...selectedValues, value]);
//     }
//   };

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const clearSelection = () => {
//     setSelectedValues([]);
//   };

//   const filteredOptions = userOptions.filter((option) =>
//     option.label.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="dropdown-container">
//        <div className="dropdown-label">Accounts</div>
//       <div className="dropdown-trigger" onClick={toggleDropdown}>
       
//         <div className="selected-values">
//           {selectedValues.length > 0 ? (
//             selectedValues.map((value, index) => {
//               const selectedOption = userOptions.find((option) => option.value === value);
//               return (
//                 <div key={index} className="selected-value">
//                   {selectedOption?.label}
//                   <span
//                     className="remove-icon"
//                     onClick={(e) => {
//                       e.stopPropagation(); // Prevent dropdown from closing
//                       handleSelect(value);
//                     }}
//                   >
//                     ×
//                   </span>
//                 </div>
//               );
//             })
//           ) : (
//             <div className="dropdown-placeholder">
//               Start typing name or email or code
//             </div>
//           )}
//         </div>
//         <div>
//           {/* Conditional rendering for chevron icon */}
//           {isOpen ? (
//             <FaChevronUp className="dropdown-icon" />
//           ) : (
//             <FaChevronDown className="dropdown-icon" />
//           )}
//         </div>
//       </div>
//       {isOpen && (
//         <div className="dropdown-menu">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             className="search-input"
//           />
//           {filteredOptions.length > 0 ? (
//             filteredOptions.map((option, index) => (
//               <label key={index} className="dropdown-item">
//                 <input
//                   type="checkbox"
//                   checked={selectedValues.includes(option.value)}
//                   onChange={() => handleSelect(option.value)}
//                 />
//                 {option.label}
//               </label>
//             ))
//           ) : (
//             <div className="dropdown-item no-results">No results found</div>
//           )}
//           {selectedValues.length > 0 && (
//             <div className="dropdown-item clear-selected" onClick={clearSelection}>
//               <input type="checkbox" checked={false} readOnly />
//               Clear selected
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MultiSelectDropdown;



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
   
    <Box sx={{ width: "300px" }}>
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
          padding: "8px",
          cursor: "pointer",
          bgcolor: "background.paper",
          "&:hover": { borderColor: "primary.main" },
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
