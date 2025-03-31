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
// import TagsDropdown from "./tagsSelect"
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


// Frontend (src/App.js)
import React, { useState } from "react";
import JSZip from "jszip";
import axios from "axios";

const FolderUpload = () => {
  const handleFolderChange = async (event) => {
    const folderFiles = event.target.files;
    if (!folderFiles.length) return;

    const firstFile = folderFiles[0];
    const folderPath = firstFile.webkitRelativePath;
    const folderName = folderPath.split("/")[0]; // Extract folder name

    const zip = new JSZip();
    Array.from(folderFiles).forEach((file) => {
      const relativePath = file.webkitRelativePath.replace(`${folderName}/`, ""); // Maintain structure
      zip.file(relativePath, file);
    });

    const zipBlob = await zip.generateAsync({ type: "blob" });

    const formData = new FormData();
    formData.append("folderZip", zipBlob, `${folderName}.zip`); // Name ZIP after the folder
    formData.append("folderName", folderName); // Send folder name

    try {
      await axios.post("http://localhost:8000/upload-folder", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Folder uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error uploading folder.");
    }
  };

  return (
    <div>
      <input type="file" webkitdirectory="true" directory onChange={handleFolderChange} />
    </div>
  );
};

export default FolderUpload;



// import React, { useState } from 'react';
// import axios from 'axios';

// const FolderUpload = () => {
//   const [isUploading, setIsUploading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [uploadStatus, setUploadStatus] = useState('');
//   const [folderStructure, setFolderStructure] = useState({ folders: {}, files: [] });
//   const [uploadedFiles, setUploadedFiles] = useState([]);

//   const handleFolderUpload = async (event) => {
//     const fileList = event.target.files;
//     if (!fileList || fileList.length === 0) return;

//     setIsUploading(true);
//     setProgress(0);
//     setUploadStatus('Analyzing folder structure...');
//     setUploadedFiles([]);

//     try {
//       // Analyze folder structure and prepare files
//       const structure = { folders: {}, files: [] };
//       const filesWithPaths = Array.from(fileList).map(file => {
//         const pathParts = file.webkitRelativePath.split('/');
//         const filename = pathParts.pop();
//         const folderPath = pathParts.join('/');
        
//         // Build the folder structure tree
//         let currentLevel = structure.folders;
//         pathParts.forEach(part => {
//           if (!currentLevel[part]) {
//             currentLevel[part] = { folders: {}, files: [] };
//           }
//           currentLevel = currentLevel[part].folders;
//         });
        
//         return {
//           file,
//           relativePath: folderPath,
//           filename,
//           size: file.size,
//           type: file.type
//         };
//       });

//       structure.files = filesWithPaths;
//       setFolderStructure(structure);
//       setUploadStatus(`Found ${filesWithPaths.length} files. Ready to upload...`);

//       // Prepare FormData with proper paths
//       const formData = new FormData();
//       filesWithPaths.forEach(({ file, relativePath, filename }) => {
//         formData.append('files', file, `${relativePath}|${filename}`);
//       });

//       // Upload files
//       setUploadStatus(`Uploading ${filesWithPaths.length} files...`);
      
//       const response = await axios.post('http://localhost:5000/upload', formData, {
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setProgress(percentCompleted);
//         },
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       setUploadStatus(response.data.message || 'Upload completed successfully!');
//       setUploadedFiles(response.data.uploadedFiles || []);
//     } catch (error) {
//       console.error('Upload error:', error);
//       setUploadStatus(error.response?.data?.message || 'Upload failed. Please try again.');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   // Helper to render folder structure with files
//   const renderStructure = (structure, level = 0) => {
//     return (
//       <div>
//         {/* Render files in current directory */}
//         {structure.files.map((file, index) => (
//           <div key={`file-${index}`} style={{ 
//             marginLeft: `${level * 20}px`,
//             display: 'flex',
//             alignItems: 'center',
//             padding: '2px 0'
//           }}>
//             📄 <span style={{ marginLeft: '5px' }}>{file.filename}</span>
//             <span style={{ 
//               marginLeft: '10px', 
//               fontSize: '0.8em',
//               color: '#666'
//             }}>
//               ({Math.round(file.size / 1024)} KB)
//             </span>
//           </div>
//         ))}
        
//         {/* Render subfolders */}
//         {Object.entries(structure.folders).map(([name, contents]) => (
//           <div key={name}>
//             <div style={{ 
//               marginLeft: `${level * 20}px`,
//               display: 'flex',
//               alignItems: 'center',
//               padding: '2px 0'
//             }}>
//               📁 <span style={{ marginLeft: '5px', fontWeight: 'bold' }}>{name}</span>
//             </div>
//             <div style={{ marginLeft: '20px' }}>
//               {renderStructure(contents, level + 1)}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div style={{ 
//       padding: '20px', 
//       maxWidth: '800px', 
//       margin: '0 auto',
//       fontFamily: 'Arial, sans-serif'
//     }}>
//       <h2 style={{ color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
//         Nested Folder Upload with Files Preview
//       </h2>
      
//       {/* Upload Section */}
//       <div style={{ 
//         border: '2px dashed #aaa', 
//         padding: '25px', 
//         textAlign: 'center',
//         margin: '20px 0',
//         borderRadius: '8px',
//         backgroundColor: '#f9f9f9'
//       }}>
//         <input
//           type="file"
//           id="folderUpload"
//           webkitdirectory="true"
//           directory="true"
//           multiple
//           onChange={handleFolderUpload}
//           disabled={isUploading}
//           style={{ display: 'none' }}
//         />
//         <label htmlFor="folderUpload" style={{
//           display: 'inline-block',
//           padding: '12px 24px',
//           backgroundColor: isUploading ? '#ccc' : '#4CAF50',
//           color: 'white',
//           borderRadius: '6px',
//           cursor: isUploading ? 'not-allowed' : 'pointer',
//           fontSize: '16px',
//           fontWeight: 'bold',
//           transition: 'background-color 0.3s'
//         }}>
//           {isUploading ? 'Uploading...' : 'Select Folder with Subfolders'}
//         </label>
//         <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
//           Select a folder to upload its entire structure including all subfolders and files
//         </p>
//       </div>
      
//       {/* Upload Progress */}
//       {isUploading && (
//         <div style={{ 
//           margin: '25px 0',
//           padding: '15px',
//           backgroundColor: '#f0f8ff',
//           borderRadius: '8px',
//           border: '1px solid #d0e3ff'
//         }}>
//           <div style={{ 
//             display: 'flex', 
//             justifyContent: 'space-between',
//             marginBottom: '8px',
//             fontWeight: 'bold'
//           }}>
//             <span>Upload Progress:</span>
//             <span>{progress}%</span>
//           </div>
//           <div style={{
//             height: '20px',
//             backgroundColor: '#e0e0e0',
//             borderRadius: '10px',
//             overflow: 'hidden'
//           }}>
//             <div 
//               style={{
//                 height: '100%',
//                 width: `${progress}%`,
//                 backgroundColor: '#4CAF50',
//                 transition: 'width 0.3s'
//               }}
//             />
//           </div>
//           <p style={{ 
//             textAlign: 'center', 
//             marginTop: '10px',
//             color: '#555'
//           }}>
//             {uploadStatus}
//           </p>
//         </div>
//       )}
      
//       {/* Upload Status */}
//       {!isUploading && uploadStatus && (
//         <div style={{
//           padding: '15px',
//           backgroundColor: uploadStatus.includes('failed') ? '#ffebee' : '#e8f5e9',
//           borderRadius: '8px',
//           margin: '20px 0',
//           border: `1px solid ${uploadStatus.includes('failed') ? '#ffcdd2' : '#c8e6c9'}`,
//           color: uploadStatus.includes('failed') ? '#d32f2f' : '#2e7d32'
//         }}>
//           {uploadStatus}
//         </div>
//       )}
      
//       {/* Folder Structure Preview */}
//       {folderStructure.files.length > 0 && (
//         <div style={{ 
//           marginTop: '30px',
//           padding: '20px',
//           backgroundColor: '#fff',
//           borderRadius: '8px',
//           boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//         }}>
//           <h3 style={{ 
//             color: '#444',
//             marginTop: '0',
//             borderBottom: '1px solid #eee',
//             paddingBottom: '10px'
//           }}>
//             Folder Structure Preview
//           </h3>
//           <div style={{ 
//             maxHeight: '300px',
//             overflowY: 'auto',
//             padding: '15px',
//             backgroundColor: '#fafafa',
//             border: '1px solid #ddd',
//             borderRadius: '5px',
//             marginTop: '10px'
//           }}>
//             {renderStructure(folderStructure)}
//           </div>
//           <p style={{ 
//             marginTop: '10px',
//             fontSize: '14px',
//             color: '#666',
//             textAlign: 'right'
//           }}>
//             Total files: {folderStructure.files.length}
//           </p>
//         </div>
//       )}
      
//       {/* Uploaded Files List */}
//       {uploadedFiles.length > 0 && (
//         <div style={{ 
//           marginTop: '30px',
//           padding: '20px',
//           backgroundColor: '#fff',
//           borderRadius: '8px',
//           boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
//         }}>
//           <h3 style={{ 
//             color: '#444',
//             marginTop: '0',
//             borderBottom: '1px solid #eee',
//             paddingBottom: '10px'
//           }}>
//             Uploaded Files
//           </h3>
//           <div style={{ 
//             maxHeight: '300px',
//             overflowY: 'auto',
//             padding: '10px',
//             backgroundColor: '#fafafa',
//             border: '1px solid #ddd',
//             borderRadius: '5px',
//             marginTop: '10px'
//           }}>
//             {uploadedFiles.map((file, index) => (
//               <div key={index} style={{
//                 padding: '8px 10px',
//                 borderBottom: '1px solid #eee',
//                 display: 'flex',
//                 justifyContent: 'space-between'
//               }}>
//                 <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                   {file.originalname.split('|').pop()}
//                 </div>
//                 <div style={{ color: '#666', fontSize: '0.9em' }}>
//                   {Math.round(file.size / 1024)} KB
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FolderUpload;