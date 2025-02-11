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
  Checkbox,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const CSVReader = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
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
          setSelectedContacts([]);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  const CONTACT_API = process.env.REACT_APP_CONTACTS_URL;
  const [newlyCreatedContacts, setNewlyCreatedContacts] = useState([]);
  // Save Contact to Database
  const handleSaveContact = async () => {
    try {
      const response = await fetch(`${CONTACT_API}/contacts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedContacts), // Sending as an array
      });
      const result = await response.json();
      console.log("Full Response:", result); // Log response to debug
      if (response.ok) {
        if (Array.isArray(result.newContacts)) {
          result.newContacts.forEach(({ _id, contactName }) => {
            console.log(`Contact Created: ${contactName}, ID: ${_id}`);
            // Store only new contacts
            setNewlyCreatedContacts(result.newContacts);
            handleDownloadCSV(result.newContacts);
          });
        } else {
          // If result is an object, log its contactName & _id directly
          console.log(
            `Contact Created: ${result.contactName}, ID: ${result._id}`
          );
        }

        alert("Contact saved successfully!");
        // handleDownloadCSV()
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => !selectedContacts.includes(contact))
        );
        setSelectedContacts([]);
      } else {
        alert("Failed to save contact: " + result.error);
      }
    } catch (error) {
      console.error("Error saving contact:", error);
      alert("Error saving contact!");
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContacts((prev) =>
      prev.includes(contact)
        ? prev.filter((c) => c !== contact)
        : [...prev, contact]
    );
  };

  const handleSelectAll = () => {
    setSelectedContacts(
      selectedContacts.length === contacts.length ? [] : [...contacts]
    );
  };

  // const handleDownloadCSV = async () => {
  //   try {
  //     const response = await fetch(`${CONTACT_API}/contacts/`);
  //     const data = await response.json();

  //     if (response.ok) {
  //       const filteredData = data.map(({ _id, contactName }) => ({ _id, contactName }));
  //       const csv = Papa.unparse(data);
  //       const blob = new Blob([csv], { type: "text/csv" });
  //       const url = URL.createObjectURL(blob);
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = "contacts.csv";
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);
  //     } else {
  //       alert("Failed to fetch contacts for CSV export");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching contacts for CSV:", error);
  //     alert("Error downloading CSV!");
  //   }
  // };

  // const handleDownloadCSV = async () => {
  //   try {
  //     const response = await fetch(`${CONTACT_API}/contacts/contactlist/list`);
  //     const data = await response.json();
  //     console.log(response)
  //     if (response.ok) {
  //       const filteredData = data.map(({ _id, contactName }) => ({ _id, contactName }));
  //       const csv = Papa.unparse(filteredData);
  //       const blob = new Blob([csv], { type: "text/csv" });
  //       const url = URL.createObjectURL(blob);
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = "contacts.csv";
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);
  //     } else {
  //       alert("Failed to fetch contacts for CSV export");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching contacts for CSV:", error);
  //     alert("Error downloading CSV!");
  //   }
  // };

  // const handleDownloadCSV = async () => {
  //   try {
  //     const response = await fetch(`${CONTACT_API}/contacts/contactlist/list`);
  //     console.log("Response Status:", response.status); // Log status
  //     const data = await response.json();
  //     console.log("Fetched Data:", data); // Log the fetched data

  //     if (response.ok) {
  //       if (!Array.isArray(data)) {
  //         console.error("Invalid data format:", data);
  //         alert("Error: API did not return an array.");
  //         return;
  //       }

  //       const filteredData = data.map(({ _id, contactName }) => ({ _id, contactName }));
  //       console.log("Filtered Data:", filteredData);

  //       const csv = Papa.unparse(filteredData);
  //       const blob = new Blob([csv], { type: "text/csv" });
  //       const url = URL.createObjectURL(blob);
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = "contacts.csv";
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);
  //       URL.revokeObjectURL(url); // Clean up
  //     } else {
  //       alert(`Failed to fetch contacts: ${response.statusText}`);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching contacts for CSV:", error);
  //     alert("Error downloading CSV!");
  //   }
  // };

  // const handleDownloadCSV = async () => {
  //   try {
  //     const response = await fetch(`${CONTACT_API}/contacts/contactlist/list`);
  //     const data = await response.json();
  //     console.log("Full API Response:", data);

  //     if (response.ok) {
  //       if (!Array.isArray(data.contactlist)) {
  //         console.error("Invalid data format:", data);
  //         alert("Error: API did not return an array of contacts.");
  //         return;
  //       }

  //       const filteredData = data.contactlist.map(({ id, name }) => ({ id, name }));
  //       console.log("Filtered Contacts:", filteredData);

  //       const csv = Papa.unparse(filteredData);
  //       const blob = new Blob([csv], { type: "text/csv" });
  //       const url = URL.createObjectURL(blob);
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = "contacts.csv";
  //       document.body.appendChild(a);
  //       a.click();
  //       document.body.removeChild(a);
  //       URL.revokeObjectURL(url); // Clean up URL
  //     } else {
  //       alert(`Failed to fetch contacts: ${response.statusText}`);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching contacts for CSV:", error);
  //     alert("Error downloading CSV!");
  //   }
  // };
  const handleDownloadCSV = (contacts) => {
    try {
      if (!contacts || contacts.length === 0) {
        alert("No new contacts to download!");
        return;
      }

      const filteredData = contacts.map(({ _id, contactName }) => ({
        _id,
        contactName,
      }));
      console.log("New Contacts for CSV:", filteredData);

      const csv = Papa.unparse(filteredData);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "new_contacts.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up URL
    } catch (error) {
      console.error("Error generating CSV:", error);
      alert("Error downloading CSV!");
    }
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
       Import Contacts
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" ,gap:3}}>
        <Button variant="contained" component="label">
          Import Contacts
          <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
        </Button>
        {selectedContacts.length > 0 && (
          <Button
            variant="contained"
            color="primary"
          
            onClick={handleSaveContact}
          >
            Save  Contacts
          </Button>
        )}
        {/* <Button
        variant="contained"
        color="secondary"
        style={{ marginLeft: "10px" }}
        onClick={handleDownloadCSV}
      >
        Download Saved Contacts
      </Button> */}
      </Box>
      {contacts.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <Checkbox
                    checked={
                      selectedContacts.length === contacts.length &&
                      contacts.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  <strong>Contact Name</strong>
                </TableCell>
                <TableCell>
                  <strong>First Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Middle Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Last Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Phone Numbers</strong>
                </TableCell>
                {/* <TableCell><strong>Actions</strong></TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedContacts.includes(contact)}
                      onChange={() => handleSelectContact(contact)}
                    />
                  </TableCell>
                  <TableCell>{contact.contactName}</TableCell>
                  <TableCell>{contact.firstName}</TableCell>
                  <TableCell>{contact.middleName}</TableCell>
                  <TableCell>{contact.lastName}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phoneNumbers}</TableCell>

                  {/* <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSaveContact(contact)}
                    >
                      Save
                    </Button>
                  </TableCell> */}
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
