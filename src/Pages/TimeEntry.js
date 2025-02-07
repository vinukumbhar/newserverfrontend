// import React, { useState } from "react";
// import Papa from "papaparse";

// const CSVReader = () => {
//   const [data, setData] = useState([]);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = ({ target }) => {
//       const csv = target.result;
//       Papa.parse(csv, {
//         header: true, // Set to false if no headers in CSV
//         skipEmptyLines: true,
//         complete: (result) => setData(result.data),
//       });
//     };
//     reader.readAsText(file);
//   };

//   return (
//     <div>
//       <input type="file" accept=".csv" onChange={handleFileUpload} />
//       <table border="1">
//         <thead>
//           <tr>
//             {data.length > 0 &&
//               Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, index) => (
//             <tr key={index}>
//               {Object.values(row).map((value, i) => (
//                 <td key={i}>{value}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CSVReader;


// import React, { useState } from "react";
// import Papa from "papaparse";
// import {
//   TableContainer,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Button,
// } from "@mui/material";

// const CSVReader = () => {
//   const [contacts, setContacts] = useState([]);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       Papa.parse(file, {
//         complete: (result) => {
//           const data = result.data.map((row) => ({
//             contactName: row["Contact Name"] || "",
//             firstName: row["First Name"] || "",
//             middleName: row["Middle Name"] || "",
//             lastName: row["Last Name"] || "",
//             email: row["Email"] || "",
//             phoneNumbers: row["Phone Numbers"] || "",
//           }));
//           setContacts(data);
//         },
//         header: true,
//         skipEmptyLines: true,
//       });
//     }
//   };

//   return (
//     <div >
//       <Typography variant="h5" gutterBottom>
//         CSV Contact Reader
//       </Typography>
      
//       <Button variant="contained" component="label">
//         Upload CSV
//         <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
//       </Button>

//       {contacts.length > 0 && (
//         <TableContainer component={Paper} style={{ marginTop: "20px" }}>
//           <Table>
//             <TableHead>
//               <TableRow style={{ backgroundColor: "#f5f5f5" }}>
//                 <TableCell><strong>Contact Name</strong></TableCell>
//                 <TableCell><strong>First Name</strong></TableCell>
//                 <TableCell><strong>Middle Name</strong></TableCell>
//                 <TableCell><strong>Last Name</strong></TableCell>
//                 <TableCell><strong>Email</strong></TableCell>
//                 <TableCell><strong>Phone Numbers</strong></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {contacts.map((contact, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{contact.contactName}</TableCell>
//                   <TableCell>{contact.firstName}</TableCell>
//                   <TableCell>{contact.middleName}</TableCell>
//                   <TableCell>{contact.lastName}</TableCell>
//                   <TableCell>{contact.email}</TableCell>
//                   <TableCell>{contact.phoneNumbers}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </div>
//   );
// };

// export default CSVReader;


import React, { useState } from "react";
import Papa from "papaparse";
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const CSVReader = () => {
  const [contacts, setContacts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const data = result.data.map((row) => ({
            contactName: row["Contact Name"] || "",
            firstName: row["First Name"] || "",
            middleName: row["Middle Name"] || "",
            lastName: row["Last Name"] || "",
            email: row["Email"] || "",
            phoneNumbers: row["Phone Numbers"] || "",
          }));
          setContacts(data);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  // Handle Menu Click
  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };
  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
// Save Contact to Database
const handleSaveContact = async (contact) => {
  try {
    const response = await fetch(`${CONTACT_API}/contacts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([contact]), // Sending as an array
    });
    const result = await response.json();
    console.log("Full Response:", result); // Log response to debug
    if (response.ok) {
      if (Array.isArray(result.newContacts)) {
        result.newContacts.forEach(({ _id, contactName }) => {
          console.log(`Contact Created: ${contactName}, ID: ${_id}`);
        });
      } else {
        // If result is an object, log its contactName & _id directly
        console.log(`Contact Created: ${result.contactName}, ID: ${result._id}`);
      }

      alert("Contact saved successfully!");
    } else {
      alert("Failed to save contact: " + result.error);
    }
  } catch (error) {
    console.error("Error saving contact:", error);
    alert("Error saving contact!");
  }
};
  return (
    <div >
      <Typography variant="h5" gutterBottom>
        CSV Contact Reader
      </Typography>

      <Button variant="contained" component="label">
        Upload CSV
        <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
      </Button>

      {contacts.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                <TableCell><strong>Contact Name</strong></TableCell>
                <TableCell><strong>First Name</strong></TableCell>
                <TableCell><strong>Middle Name</strong></TableCell>
                <TableCell><strong>Last Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Phone Numbers</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact, index) => (
                <TableRow key={index}>
                  <TableCell>{contact.contactName}</TableCell>
                  <TableCell>{contact.firstName}</TableCell>
                  <TableCell>{contact.middleName}</TableCell>
                  <TableCell>{contact.lastName}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phoneNumbers}</TableCell>
                  
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSaveContact(contact)}
                    >
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default CSVReader;


{/* <TableCell>
                    <IconButton onClick={(event) => handleMenuClick(event, index)}>
                      <MoreVertIcon />
                    </IconButton>
                    {selectedRow === index && (
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        
                        <MenuItem onClick={() => alert("Edit Clicked")}>Save</MenuItem>
                      
                      </Menu>
                    )}
                  </TableCell> */}