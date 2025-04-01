// import React, { useState ,useEffect} from "react";
// import { Box,Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List,  IconButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// const ClientSelectionDialog = ({ open, onClose }) => {
//      const [accountdata, setaccountdata] = useState([]);
//      const fetchAccountDatas = async (data) => {
//         console.log("data", data);
//         try {
//           const response = await fetch(
//             `http://127.0.0.1/accounts/accountsdata?test=${data}`
//           );
//           const datas = await response.json();
//           console.log("accounts", datas);
//           setaccountdata(datas.accounts);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         }
    
        
//       };
//     useEffect(() => {
        
//         fetchAccountDatas("data");
//       }, []);
     
//       const accountoptions = accountdata.map((account) => ({
//         value: account._id,
//         label: account.accountName,
//       }));
    
//   return (
//    <Box>
//      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         Select client
//         <IconButton onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
      
//       <DialogContent dividers>
//         <TextField
//           fullWidth
//           variant="outlined"
//           placeholder="Start typing user name, ID or email"
//         //   value={searchTerm}
//         //   onChange={(e) => setSearchTerm(e.target.value)}
//           sx={{ mb: 2 }}
//         />
        
//         <List>
//           {/* {filteredClients.map((client) => (
//             <ListItem button key={client.id}>
//               <ListItemAvatar>
//                 <Avatar sx={{ bgcolor: client.color, color: "#fff", fontWeight: "bold" }}>
//                   {client.id}
//                 </Avatar>
//               </ListItemAvatar>
//               <ListItemText primary={client.name} />
//             </ListItem>
//           ))} */}
//         </List>
//       </DialogContent>

//       <DialogActions>
//         <Button variant="outlined" onClick={onClose}>
//           Cancel
//         </Button>
//       </DialogActions>
//     </Dialog>
//    </Box>
//   )
// }

// export default ClientSelectionDialog


import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,Typography,Drawer, Divider,Autocomplete,InputLabel
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Unstable_Grid2";
const ClientSelectionDialog = ({ open, onClose }) => {
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const [accountData, setAccountData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Fetch accounts
  const fetchAccountData = async () => {
    try {
      const response = await fetch(`${ACCOUNT_API}/accounts/nameandid/accountdetails`);
      const data = await response.json();
      console.log("client list",data)
      setAccountData(data.accounts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  // Map account data into options
  const accountOptions = accountData.map((account) => ({
    value: account._id,
    label: account.accountName,
  }));

  // Filter accounts based on search input
  const filteredAccounts = accountOptions.filter((account) =>
    account.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

   // Handle account selection
   const handleSelectAccount = (account) => {
    setSelectedAccount(account);
    onClose()
    setDrawerOpen(true);  // Open the right drawer
  };

  return (
    <Box>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Select client
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Start typing user name, ID, or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />

          <List sx={{height:'200px', overflowY:'auto'}}>
            {filteredAccounts.map((account) => (
              <ListItem  key={account.value} onClick={() => handleSelectAccount(account)}>
                <ListItemText primary={account.label}  sx={{cursor:'pointer'}}/>
              </ListItem>
            ))}
          </List>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 800, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            m: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Create invoice
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* <Box
              onClick={handleOpenpreviewDrawer}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "primary.main",
              }}
            >
              <PlagiarismIcon sx={{ marginRight: 0.5 }} fontsize="small" />
              <Typography color="primary">Preview</Typography>
            </Box> */}

            <Box onClick={() => setDrawerOpen(false)} sx={{ cursor: "pointer" }}>
              <CloseIcon />
            </Box>
          </Box>

           <Divider />
        </Box>
          {/* {selectedAccount ? (
            <>
              <Typography variant="body1">{selectedAccount.label}</Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => setDrawerOpen(false)}>
                Close
              </Button>
            </>
          ) : (
            <Typography variant="body2">No client selected</Typography>
          )} */}
             <Box
                    mt={3}
                    p={2}
                    sx={{ height: "80vh", overflowY: "auto" }}
                    className="create-invoice"
                  >
                    <Box>
                        <Grid
                                      container
                                      rowSpacing={1}
                                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                    >
                                      <Grid xs={6}>
                                        <Box>
                                          <InputLabel sx={{ color: "black" }}>
                                            Account name,ID or email
                                          </InputLabel>
                        
                                          <Autocomplete
                                            options={accountOptions}
                                            value={selectedAccount}
                                            // onChange={handleAccountChange}
                                            renderOption={(props, option) => (
                                              <Box
                                                component="li"
                                                {...props}
                                                sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                                              >
                                                {option.label}
                                              </Box>
                                            )}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                placeholder="Select Account"
                                                variant="outlined"
                                                size="small"
                                                sx={{ backgroundColor: "#fff" }}
                                              />
                                            )}
                                            sx={{ width: "100%", marginTop: "8px" }}
                                          />
                                        </Box>
                                      </Grid>
                                      
                                    </Grid>
                                    <Grid
                                      container
                                      rowSpacing={1}
                                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                    >
                                      <Grid xs={6}>
                                        <Box>
                                          <InputLabel sx={{ color: "black" }}>
                                            Account name,ID or email
                                          </InputLabel>
                        
                                          <Autocomplete
                                            options={accountOptions}
                                            value={selectedAccount}
                                            // onChange={handleAccountChange}
                                            renderOption={(props, option) => (
                                              <Box
                                                component="li"
                                                {...props}
                                                sx={{ cursor: "pointer", margin: "5px 10px" }} // Add cursor pointer style
                                              >
                                                {option.label}
                                              </Box>
                                            )}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                placeholder="Select Account"
                                                variant="outlined"
                                                size="small"
                                                sx={{ backgroundColor: "#fff" }}
                                              />
                                            )}
                                            sx={{ width: "100%", marginTop: "8px" }}
                                          />
                                        </Box>
                                      </Grid>
                                      
                                    </Grid>
                    </Box>
                  </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ClientSelectionDialog;
