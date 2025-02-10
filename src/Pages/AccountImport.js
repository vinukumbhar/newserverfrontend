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
  Checkbox,
  Box,
} from "@mui/material";

const AccountImport = () => {
  const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
  const [accounts, setAccounts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          console.log(result);
          const data = result.data.map((row) => ({
            accountName: row["Account Name"] || "",
            accountType: row["Account Type"] || "",
            tags: row["Tags"] || "",
            teammember1: row["Team Member #1"] || "",
            teammember2: row["Team Member #2"] || "",
            teammembe3: row["Team Member #3"] || "",
            teammember4: row["Team Member #4"] || "",
            linkedContact1: row["Linked Contact #1"] || "",
            linkedContact2: row["Linked Contact #2"] || "",
            linkedContact3: row["Linked Contact #3"] || "",
            linkedContact4: row["Linked Contact #4"] || "",
            // phoneNumbers: row["Phone Numbers"] || "",
          }));
          setAccounts(data);
          setSelectedAccounts([]);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };
  const handleTagsFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          console.log(result);
          const data = result.data.map((row) => ({
            tagName: row["Tags"] || "",
          }));
          setTags(data);
          setSelectedTags([]);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };
  const handleSelectAccount = (contact) => {
    setSelectedAccounts((prev) =>
      prev.includes(contact)
        ? prev.filter((c) => c !== contact)
        : [...prev, contact]
    );
  };

  const handleSelectAll = () => {
    setSelectedAccounts(
      selectedTags.length === tags.length ? [] : [...tags]
    );
  };

  const handleSelectTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSelectAllTags = () => {
    setSelectedTags(selectedTags.length === tags.length ? [] : [...tags]);
  };


  //   const handleSaveAccounts = async () => {
  //     if (selectedAccounts.length === 0) return;

  //     try {
  //       const response = await fetch(`${ACCOUNT_API}/accounts/accountdetails`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(selectedAccounts), // Send selected accounts as JSON

  //     });

  //       if (!response.ok) {
  //         throw new Error("Failed to save accounts");
  //       }

  //       const data = await response.json();
  //       console.log("Accounts saved successfully:", data);
  //       alert("Accounts saved successfully!");

  //       // Optionally clear selected accounts after saving
  //       setSelectedAccounts([]);
  //     } catch (error) {
  //       console.error("Error saving accounts:", error);
  //       alert("Error saving accounts!");
  //     }
  //   };

  const handleSaveAccounts = async () => {
    if (selectedAccounts.length === 0) return;

    for (const account of selectedAccounts) {
      const formattedAccount = {
        accountName: account.accountName,
        clientType: account.accountType, // or "Company" if needed
        // tags: account.tags ? account.tags.split(",") : [],
        // teamMember: [
        //   account.teammember1,
        //   account.teammember2,
        //   account.teammember3,
        //   account.teammember4,
        // ].filter(Boolean), // Remove empty values
        contacts: [
          account.linkedContact1,
          account.linkedContact2,
          account.linkedContact3,
          account.linkedContact4,
        ].filter(Boolean),
      };
      console.log(formattedAccount);
      try {
        const response = await fetch(`${ACCOUNT_API}/accounts/accountdetails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedAccount), // Send individual account
        });

        if (!response.ok) {
          throw new Error(`Failed to save ${account.accountName}`);
        }

        console.log(`Account ${account.accountName} saved successfully`);
      } catch (error) {
        console.error("Error saving account:", error);
      }
    }

    alert("Accounts saved successfully!");
    setSelectedAccounts([]); // Clear selection after saving
  };

  const tagColours = [
    "#fd3241", "#f9b5ac", "#ac6400", "#ff7e39", "#ffea00", "#94ecbe", "#2e8b57", 
    "#76ac1e", "#3cbb50", "#9ed8db", "#0299bb", "#0af4b8", "#466efb", "#0496ff", 
    "#b9c1ff", "#e1b1ff", "#9d33d0", "#d834f5", "#ff54b6", "#1d3354", "#767b91", 
    "#8f8f8f", "#c7c7c7", "#9a657e", "#616468", "#511dff", "#85c7db", "#8cd1ff", 
    "#0aefff", "#d4ff00", "#a1ff0a", "#00f43d", "#ffc100", "#cdc6a5", "#fed6b1", 
    "#e5dfdf", "#ffeaa7"
  ];
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
//   const handleSaveSelectedTags = async () => {
//     try {
    //   const tagsToSave = selectedTags.map((tag, index) => ({
    //     tagName: tag.tagName,
    //     tagColour: tagColours[index % tagColours.length], // Assign colors in a loop
    //     // active: true,
    //   }));
//   console.log(tagsToSave)
//       const response = await fetch(`${TAGS_API}/tags/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ tagsToSave }),
//       });
  
//       const data = await response.json();
//       console.log("Response from backend:", data);
//     } catch (error) {
//       console.error("Error saving tags:", error);
//     }
//   };
  

// const handleSaveSelectedTags = async () => {
//     // try {
//     //   // Assign a random color to each tag
//     //   const tags = selectedTags.map((tag, index) => ({
//     //     tagName: tag.tagName,
//     //     tagColour: tagColours[index % tagColours.length], // Assign colors in a loop
//     //     active: true,
//     //   }));
  
//     //   console.log("Tags to Save:", tags);
  
//     //   const response = await fetch(`${TAGS_API}/tags/`, {
//     //     method: "POST",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //     },
//     //     body: JSON.stringify({ tags }),
//     //   });
  
//     //   const result = await response.json();
//     //   console.log("Full Response:", result); // Log response to debug
  
//     //   if (response.ok) {
//     //     if (Array.isArray(result.tags)) {
//     //       result.tags.forEach(({ _id, tagName, tagColour }) => {
//     //         console.log(`Tag Created: ${tagName}, ID: ${_id}, Colour: ${tagColour}`);
//     //       });
//     //     } else {
//     //       console.log(`Tag Created: ${result.tagName}, ID: ${result._id}, Colour: ${result.tagColour}`);
//     //     }
  
//     //     alert("Tags saved successfully!");
//     //     setSelectedTags([]); // Clear selected tags after saving
//     //   } else {
//     //     alert("Failed to save tags: " + result.error);
//     //   }
//     // } catch (error) {
//     //   console.error("Error saving tags:", error);
//     //   alert("Error saving tags!");
//     // }
//     try {
//         const tagsToSave = selectedTags.map(tag => ({
//           tagName: tag.tagName,
//           tagColour: tagColours[Math.floor(Math.random() * tagColours.length)],
//           active: true,
//         }));
    
//         console.log("Tags to Save:", tagsToSave);
    
//         const response = await fetch(`${TAGS_API}/tags/`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(tagsToSave), // Send an array
//         });
    
//         const result = await response.json();
//         console.log("Response:", result);
    
//         if (response.ok) {
//           alert("Tags saved successfully!");
//           setSelectedTags([]);
//         } else {
//           alert("Failed to save tags: " + result.error);
//         }
//       } catch (error) {
//         console.error("Error saving tags:", error);
//         alert("Error saving tags!");
//       }
//   };
  
const handleSaveSelectedTags = async () => {
    try {
        const savedTags = []; // Store created tags for CSV
      for (const tag of selectedTags) {
        const tagToSave = {
          tagName: tag.tagName,
          tagColour: tagColours[Math.floor(Math.random() * tagColours.length)],
          active: true,
        };
  
        console.log("Saving Tag:", tagToSave);
  
        const response = await fetch(`${TAGS_API}/tags/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tagToSave), // Send a single tag as an object
        });
  
        const result = await response.json();
        console.log("Response:", result.tags);
  
        if (!response.ok) {
          alert("Failed to save tag: " + result.error);
        }
        else {
            console.log("Created Tag - ID:", result.tags._id, "Tag Name:", result.tags.tagName);
            savedTags.push({ _id: result.tags._id, tagName: result.tags.tagName });
        }
      }
  // Generate CSV file
  if (savedTags.length > 0) {
    generateCSV(savedTags);
}
      alert("Tags saved successfully!");
      setSelectedTags([]); // Clear selected tags after saving
    } catch (error) {
      console.error("Error saving tags:", error);
      alert("Error saving tags!");
    }
  };
  const generateCSV = (tags) => {
    const csvHeader = "ID,Tag Name\n";
    const csvRows = tags.map(tag => `${tag._id},${tag.tagName}`).join("\n");
    const csvContent = csvHeader + csvRows;

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "created_tags.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        CSV Account Reader
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Button variant="contained" component="label">
          Upload CSV
          <input type="file" accept=".csv" hidden onChange={handleFileUpload} />
        </Button>
        {selectedAccounts.length > 0 && (
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
            onClick={handleSaveAccounts}
          >
            Save
          </Button>
        )}
      </Box>

      <Box mt={3}>
        <Button variant="contained" component="label">
          Tags import
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={handleTagsFileUpload}
          />
        </Button>
        {selectedTags.length > 0 && (
            <Button variant="contained"
            color="primary"
            style={{ marginTop: "10px" }} onClick={handleSaveSelectedTags}>
                create tags
            </Button>
        )}
      </Box>
      {accounts.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <Checkbox
                    checked={
                      selectedAccounts.length === accounts.length &&
                      accounts.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  <strong>Account Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Account Type</strong>
                </TableCell>
                <TableCell>
                  <strong>Tags</strong>
                </TableCell>
                <TableCell>
                  <strong>Team Member #1</strong>
                </TableCell>
                <TableCell>
                  <strong>Team Member #2</strong>
                </TableCell>
                <TableCell>
                  <strong>Team Member #3</strong>
                </TableCell>
                <TableCell>
                  <strong>Team Member #4</strong>
                </TableCell>
                <TableCell>
                  <strong>Linked Contact #1</strong>
                </TableCell>
                <TableCell>
                  <strong>Linked Contact #2</strong>
                </TableCell>
                <TableCell>
                  <strong>Linked Contact #3</strong>
                </TableCell>
                <TableCell>
                  <strong>Linked Contact #4</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedAccounts.includes(account)}
                      onChange={() => handleSelectAccount(account)}
                    />
                  </TableCell>
                  <TableCell>{account.accountName}</TableCell>
                  <TableCell>{account.accountType}</TableCell>
                  <TableCell>{account.tags}</TableCell>

                  <TableCell>{account.teammember1}</TableCell>
                  <TableCell>{account.teammember2}</TableCell>
                  <TableCell>{account.teammember3}</TableCell>
                  <TableCell>{account.teammember4}</TableCell>

                  <TableCell>{account.linkedContact1}</TableCell>
                  <TableCell>{account.linkedContact2}</TableCell>
                  <TableCell>{account.linkedContact3}</TableCell>
                  <TableCell>{account.linkedContact4}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
<Box>
      {tags.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <Checkbox
                    checked={
                      selectedTags.length === tags.length && tags.length > 0
                    }
                    onChange={handleSelectAllTags}
                  />
                </TableCell>
                <TableCell>
                  <strong>Tags</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tags.map((tag, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleSelectTag(tag)}
                    />
                  </TableCell>
                  <TableCell>{tag.tagName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      </Box>
    </div>
  );
};

export default AccountImport;
