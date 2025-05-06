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
  IconButton,
  
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const ClientSelectionDialog = ({ open, onClose,handleDrawerClose}) => {
     const navigate = useNavigate();
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const [accountData, setAccountData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedAccount, setSelectedAccount] = useState(null);

  // Fetch accounts
  const fetchAccountData = async () => {
    try {
      const response = await fetch(
       `${ACCOUNT_API}/accounts/account/accountdetailslist/true`
      );
      const data = await response.json();
      console.log("client list", data);
      setAccountData(data.accountlist);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  // Map account data into options
  const accountOptions = accountData.map((account) => ({
    value: account.id,
    label: account.Name,
  }));

  // Filter accounts based on search input
  const filteredAccounts = accountOptions.filter((account) =>
    account.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle account selection
  const handleSelectAccount = (account) => {
    console.log("selected account", account)
    setSelectedAccount(account);
    onClose();
    navigate(`/clients/accounts/accountsdash/organizers/${account.value}/accountorganizer`)
    handleDrawerClose()
    // setDrawerOpen(true); // Open the right drawer
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

          <List sx={{ height: "200px", overflowY: "auto" }}>
            {filteredAccounts.map((account) => (
              <ListItem
                key={account.value}
                onClick={() => handleSelectAccount(account)}
              >
                <ListItemText
                  primary={account.label}
                  sx={{ cursor: "pointer" }}
                />
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

    </Box>
  );
};

export default ClientSelectionDialog;
