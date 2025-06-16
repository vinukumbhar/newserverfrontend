
// import React, { useEffect, useState } from "react";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { Typography,Box ,Dialog, DialogActions, DialogContent, DialogTitle, Button} from "@mui/material";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "./style.css"
// import { useNavigate } from "react-router-dom";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ArchiveIcon from '@mui/icons-material/Archive'; 
// import { differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";
// const ItemTypes = {
//   JOB: "job",
// };

// const Pipelines = () => {
//   const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
//   const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;

//   const [jobData, setJobData] = useState([]);
//   const [pipelineData, setPipelineData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { data } = useParams();
  
//   useEffect(() => {
//     fetchJobList(data);
//   }, [data]);

//   const fetchJobList = (data) => {
//     const url = `${JOBS_API}/workflow/jobs/job/joblist/list/true/${data}`;

//     fetch(url)
//       .then((response) => response.json())
//       .then((result) => {
//         setJobData(result.jobList || []);
//         console.log("joblist",result.jobList)
//         const pipelineIds = result.jobList.map((job) => job.PipelineId);
//         console.log("Pipeline IDs:", pipelineIds);
//         pipelineIds.forEach((id) => fetchPipelineData(id));
//       })
//       .catch((error) => {
//         console.error("Error fetching job list:", error);
//       });
//   };

//   const fetchPipelineData = async (pipelineId) => {
//     console.log("test",pipelineId)
//     setLoading(true);
//     try {
//       const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineId}`;
//       const response = await fetch(url);
//       const data = await response.json();
//       console.log("pipeline detils",data)
//       setPipelineData((prevData) => [
//         ...prevData,
//         { ...data.pipeline, stages: data.pipeline.stages || [] },
//       ]);
//     } catch (error) {
//       console.error("Error fetching pipeline data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

 
//   const handleDrop = (jobId, stageName) => {
//   const updatedJobs = jobData.map((job) => {
//     if (job.id === jobId) {
//       // Create a new stages array with just the new stage
//       const updatedStages = [{ name: stageName }];
//       return { ...job, Stages: updatedStages };
//     }
//     return job;
//   });
//   setJobData(updatedJobs);

//   setTimeout(() => {
//     fetchJobList(data);
//   }, 1000);
// };

//   const updateJobStage = async (stage, item) => {
//     const data = JSON.stringify({ stageid: stage._id });
//     const config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: `${JOBS_API}/workflow/jobs/job/jobpipeline/updatestageid/${item.id}`,
//       headers: { "Content-Type": "application/json" },
//       data: data,
//     };

//     try {
//       const response = await axios.request(config);
//       console.log("API Response:", response.data);
//     } catch (error) {
//       console.error("API Error:", error);
//     }
//   };

//   const moveJob = (jobId, targetStage, stage) => {
//     console.log("stage details", targetStage)
//     handleDrop(jobId, targetStage);
//     updateJobStage(stage, { id: jobId });
//   };
//   const uniquePipelines = Array.from(
//     new Map(pipelineData.map((pipeline) => [pipeline._id, pipeline])).values()
//   );
//   return (
//     <DndProvider backend={HTML5Backend}>
//       <Box>
//         {loading && <p>Loading pipeline data...</p>}
//         {uniquePipelines.map((pipeline, index) => (
//           <Pipeline
//             key={index}
//             pipeline={pipeline}
//             jobData={jobData}
//             moveJob={moveJob}
//             fetchJobList={fetchJobList}
//             data={data}
//           />
//         ))}
//       </Box>
//     </DndProvider>
//   );
// };



// const Pipeline = ({ pipeline, jobData, moveJob, fetchJobList, data }) => {
//   const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
//   const [checkedJobIds, setCheckedJobIds] = useState([]);
//   const handleJobCheckboxChange = (isChecked, jobId) => {
//     setCheckedJobIds((prevIds) =>
//       isChecked ? [...prevIds, jobId] : prevIds.filter((id) => id !== jobId)
//     );
//   };
//   const [openDialog, setOpenDialog] = useState(false);
//   const [dialogType, setDialogType] = useState("");
//   const handleDialogOpen = (type) => {
//     setDialogType(type);
//     setOpenDialog(true);
//   };

//   const handleDialogClose = () => {
//     setOpenDialog(false);
//   };
//   const handleDelete = () => {
//     const requestOptions = {
//       method: "DELETE",
//       redirect: "follow",
//     };

//     Promise.all(
//       checkedJobIds.map((jobId) =>
//         fetch(`${JOBS_API}/workflow/jobs/job/${jobId}`, requestOptions)
//           .then((response) => {
//             if (!response.ok) {
//               throw new Error(`Failed to delete job ID: ${jobId}`);
//             }
//             return response.json();
//           })
//       )
//     )
//       .then(() => {
//         console.log("Jobs deleted successfully:", checkedJobIds);
//         toast.success("Jobs deleted successfully");
//         fetchJobList(data); 
//       })
//       .catch((error) => {
//         console.error("Error deleting jobs:", error);
//         toast.error("Failed to delete some jobs");
//       });
//   };
//   const navigate = useNavigate();
//   const handleArchive = async () => {
//     const requestOptions = {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         active: false,
//       }),
//       redirect: "follow",
//     };
  
//     try {
//       const archivePromises = checkedJobIds.map((jobId) =>
//         fetch(
//           `${JOBS_API}/workflow/jobs/job/${jobId}`,
//           requestOptions
//         ).then((response) => {
//           if (!response.ok) {
//             throw new Error(`Failed to archive job ID: ${jobId}`);
//           }
//           return response.json();
//         })
//       );
  
//       await Promise.all(archivePromises);
//       toast.success("Jobs archived successfully");
//       fetchJobList(data);
//       navigate(`/clients/accounts/accountsdash/workflow/${data}/archivedjobs`);
//     } catch (error) {
//       console.error("Error archiving jobs:", error);
//       toast.error("Failed to archive some jobs");
//     }
//   };

//   return (
//     <Box sx={{ border: "1px solid grey", borderRadius: '10px', marginBottom: '15px' }}>
//       <h3 style={{ marginLeft: '15px' }}>{pipeline.pipelineName}</h3>
//       {checkedJobIds.length > 0 && (
//         <Box>
//           <Box sx={{display:'flex', alignItems:'center', gap:2}}>
//             <DeleteIcon
//               onClick={() => handleDialogOpen("delete")}
//               sx={{
//                 marginLeft: "15px",
//                 color: "red",
//                 cursor: "pointer",
//                 transform: "scale(1)",
//               }}
//             />
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <ArchiveIcon sx={{ marginRight: 1, cursor:'pointer' }} 
//                 onClick={() => handleDialogOpen("archive")}
//               />
//               <p>Archive</p>
//             </Box>
//           </Box>
//           <Dialog open={openDialog} onClose={handleDialogClose}>
//             <DialogTitle>
//               {dialogType === "delete" ? "Confirm Delete" : "Confirm Archive"}
//             </DialogTitle>
//             <DialogContent>
//               Are you sure you want to{" "}
//               {dialogType === "delete" ? "delete" : "archive"} these jobs?
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleDialogClose} color="secondary">
//                 Cancel
//               </Button>
//               <Button
//                 onClick={dialogType === "delete" ? handleDelete : handleArchive}
//                 color="primary"
//               >
//                 Confirm
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </Box>
//       )}
      
//       <Box
//         className="stage-container"
//         display="flex"
//         gap={2}
//         sx={{
//           padding: 2,
//           overflowX: "auto",
//           whiteSpace: "nowrap",
//         }}
//       >
//         {pipeline.stages.map((stage, stageIndex) => (
//           <Stage
//             key={stageIndex}
//             stage={stage}
//             jobs={jobData.filter(
//               (job) =>
//                 job.PipelineId === pipeline._id && 
//                 job.Stages && 
//                 job.Stages.some(s => s.name === stage.name)
//             )}
//             moveJob={(jobId, targetStage) => moveJob(jobId, targetStage, stage)}
//             onCheckboxChange={handleJobCheckboxChange}
            
//           />
//         ))}
//       </Box>
//     </Box>
//   );
// };
// const Stage = ({ stage, jobs, moveJob ,onCheckboxChange }) => {
//   const [{ isOver }, drop] = useDrop({
//     accept: ItemTypes.JOB,
//     drop: (item) => moveJob(item.id, stage.name),
//     collect: (monitor) => ({
//       isOver: monitor.isOver(),
//     }),
//   });

//   return (
//     <Box
//       ref={drop}
//       sx={{
//         minWidth: "180px",
//         height: 500,
//         padding: 2,
//         backgroundColor: isOver ? "white" : "#f2f7f7",
//         overflowY: "auto",
//         overflowX: 'hidden',
//         borderRadius: '10px',
//         flexShrink: 0,
//       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
//       }}
//       // className="stage"
//     >
//       <p>{stage.name}</p>
//       {jobs.map((job) => (
//         <Job key={job.id} job={job} onCheckboxChange ={onCheckboxChange }/>
//       ))}
//     </Box>
//   );
// };

// const Job = ({ job,onCheckboxChange  }) => {
//   const [{ isDragging }, drag] = useDrag({
//     type: ItemTypes.JOB,
//     item: { id: job.id },
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });
//   const truncateName = (name) => {
//     const maxLength = 15;
//     if (name.length > maxLength) {
//       return name.substring(0, maxLength) + "...";
//     }
//     return name;
//   };
//   const stripHtmlTags = (html) => {
//     const doc = new DOMParser().parseFromString(html, "text/html");
//     return doc.body.textContent || "";
//   };
//   const truncateDescription = (description, maxLength = 20) => {
//     if (description.length > maxLength) {
//       return description.slice(0, maxLength) + "...";
//     }
//     return description;
//   };

//   const getPriorityStyle = (priority) => {
//     switch (priority.toLowerCase()) {
//       case "urgent":
//         return { color: "white", backgroundColor: "#0E0402", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" };
//       case "high":
//         return { color: "white", backgroundColor: "#fe676e", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" }; // light red background
//       case "medium":
//         return { color: "white", backgroundColor: "#FFC300", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" }; // light orange background
//       case "low":
//         return { color: "white", backgroundColor: "#56c288", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" }; // light green background
//       default:
//         return {};
//     }
//   };
//   const formatDate = (date) => {
//     if (!date) return ""; // Handle null or undefined dates
//     const options = { month: "short", day: "2-digit", year: "numeric" };
//     return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
//   };
//   const timeAgo = (date) => {
//     if (!date) return "N/A";
//     const currentTime = new Date();
//     const jobTime = new Date(date);
//     const minutesDiff = differenceInMinutes(currentTime, jobTime);
//     const hoursDiff = differenceInHours(currentTime, jobTime);
//     const daysDiff = differenceInDays(currentTime, jobTime);
//     if (minutesDiff < 1) {
//       return "just now";
//     } else if (minutesDiff < 60) {
//       return `${minutesDiff} minute${minutesDiff === 1 ? "" : "s"} ago`;
//     } else if (hoursDiff < 24) {
//       return `${hoursDiff} hour${hoursDiff === 1 ? "" : "s"} ago`;
//     } else {
//       return `${daysDiff} day${daysDiff === 1 ? "" : "s"} ago`;
//     }
//   };
//   const [isHovered, setIsHovered] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);
//   const handleCheckboxChange = (event) => {
//     const checked = event.target.checked;
//     setIsChecked(checked);
//     onCheckboxChange(checked, job.id); // Notify the pipeline about the checkbox status.
//     if (checked) {
//       console.log("Checked Job ID:", job.id);
//     }
//   };
//   return (
//     <Box
//       ref={drag}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       sx={{
//         padding: 2,
//         border: "1px solid #ddd",
//         marginTop: 2,
//         width: "160px",
//         background: isDragging ? "#f0f0f0" : "#f9f9f9",
//         textAlign: "left",
//         opacity: isDragging ? 0.5 : 1,
//         borderRadius: '8px',
//         cursor: 'pointer',
//         position: "relative",
//         transition: "transform 0.2s ease",
//         boxShadow:"02.s ease"
//       }}
     
//     >
//       {(isHovered || isChecked) && (
//         <input
//           type="checkbox"
//           checked={isChecked}
//           onChange={handleCheckboxChange}
//           style={{
//             position: "absolute",
//             top: 10,
//             right: 10,
//             cursor: "pointer",
//             transform: "scale(1.2)",
//           }}
//         />
//       )}
//       <p>{job.Account.join(", ")}</p>
//       <p>{truncateName(job.Name)}</p>
//       {/* <p>{job.JobAssignee.join(", ")}</p>
//        */}
//          <Typography
//   variant="body2"
//   color="text.secondary"
//   sx={{ 
//     marginBottom: "8px",
//     whiteSpace: "normal",
//     wordBreak: "break-word",
//     overflowWrap: "break-word",
//     lineHeight: "1.5", // Adjust line height for better readability
//   }}
// >
//   {job.JobAssignee.join(", ")}
// </Typography>
//       <p>{truncateDescription(stripHtmlTags(job.Description))}</p>
//       <span style={getPriorityStyle(job.Priority)}>{job.Priority}</span>
//       <p>Start Date: {formatDate(job.StartDate)}</p>
//       <p>Due Date: {formatDate(job.DueDate)}</p>
//       <p>
//         {timeAgo(job.updatedAt)}
//       </p>

//     </Box>
//   );
// };
// export default Pipelines;


import React, { useEffect, useState ,useContext} from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, Drawer, Checkbox, Alert, Select, MenuItem, Chip } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./style.css"
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ArchiveIcon from '@mui/icons-material/Archive'; 
import { differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";
import { LoginContext } from "../../Sidebar/Context/Context";
const ItemTypes = {
  JOB: "job",
};

const Pipelines = () => {
  const PIPELINE_API = process.env.REACT_APP_PIPELINE_TEMP_URL;
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;

  const [jobData, setJobData] = useState([]);
  const [pipelineData, setPipelineData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data } = useParams();
  
  // Automation drawer state
  const [automationDrawerOpen, setAutomationDrawerOpen] = useState(false);
  const [automationData, setAutomationData] = useState([]);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [currentTargetStage, setCurrentTargetStage] = useState(null);
  const [accountName, setAccountName] = useState("");
  const [accountId, setAccountId] = useState("");
  
  useEffect(() => {
    fetchJobList(data);
  }, [data]);

  const fetchJobList = (data) => {
    const url = `${JOBS_API}/workflow/jobs/job/joblist/list/true/${data}`;

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setJobData(result.jobList || []);
        console.log("joblist",result.jobList)
        const pipelineIds = result.jobList.map((job) => job.PipelineId);
        console.log("Pipeline IDs:", pipelineIds);
        pipelineIds.forEach((id) => fetchPipelineData(id));
      })
      .catch((error) => {
        console.error("Error fetching job list:", error);
      });
  };

  const fetchPipelineData = async (pipelineId) => {
    console.log("test",pipelineId)
    setLoading(true);
    try {
      const url = `${PIPELINE_API}/workflow/pipeline/pipeline/${pipelineId}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log("pipeline detils",data)
      setPipelineData((prevData) => [
        ...prevData,
        { ...data.pipeline, stages: data.pipeline.stages || [] },
      ]);
    } catch (error) {
      console.error("Error fetching pipeline data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (jobId, targetStageName) => {
    const job = jobData.find((job) => job.id === jobId);
    const pipeline = pipelineData.find((p) => p._id === job.PipelineId);
    const targetStage = pipeline?.stages?.find((stage) => stage.name === targetStageName);

    if (job) {
      setAccountName(job.Account.join(", "));
      setAccountId(job.AccountId);
    }

    // If the target stage has automations, show the drawer
    if (targetStage?.automations?.length > 0) {
      setAutomationData(targetStage.automations);
      setCurrentJobId(jobId);
      setCurrentTargetStage(targetStage);
      setAutomationDrawerOpen(true);
    } else {
      // If no automations, immediately update the job's stage
      moveJob(jobId, targetStageName, targetStage);
    }
  };

  // const moveJob = (jobId, targetStage, stage) => {
  //   console.log("stage details", targetStage)
  //   updateJobStage(stage, { id: jobId });
    
  //   const updatedJobs = jobData.map((job) => {
  //     if (job.id === jobId) {
  //       // Create a new stages array with just the new stage
  //       const updatedStages = [{ name: targetStage }];
  //       return { ...job, Stages: updatedStages };
  //     }
  //     return job;
  //   });
  //   setJobData(updatedJobs);

  //   setTimeout(() => {
  //     fetchJobList(data);
  //   }, 1000);
  // };

  const moveJob = async (jobId, targetStageName, stage, automations = {}) => {
  try {
    // First, update the job's stage
    await updateJobStage(stage, { id: jobId });

    // Then handle any additional automations
    if (automations.clientStatus || automations.assignees) {
      await handleJobUpdates(jobId, automations);
    }

    // Update local state
    const updatedJobs = jobData.map((job) => {
      if (job.id === jobId) {
        const updatedStages = [{ name: targetStageName }];
        return { ...job, Stages: updatedStages };
      }
      return job;
    });
    setJobData(updatedJobs);

    setTimeout(() => {
      fetchJobList(data);
    }, 1000);
  } catch (error) {
    console.error("Error moving job:", error);
  }
};

const handleJobUpdates = async (jobId, automations) => {
  try {
    // First, get the current job data to work with the existing assignees
    const currentJobResponse = await axios.get(`${JOBS_API}/workflow/jobs/job/${jobId}`);
    const currentJob = currentJobResponse.data;
    const currentAssignees = currentJob.jobassignees || [];

    // Prepare the data object with updates
    const data = {};

    // Handle client-facing status if automation exists
    if (automations.clientStatus) {
      const { visibilityForClient, selectedClientStatus, statusDescription } = automations.clientStatus;
      Object.assign(data, {
        showinclientportal: visibilityForClient,
        clientfacingstatus: selectedClientStatus?.value,
        clientfacingDescription: statusDescription,
      });
    }

    // Handle assignee updates if automation exists
    if (automations.assignees) {
      const { addAssignees = [], removeAssignees = [] } = automations.assignees;
      
      // Create new assignees array:
      // 1. Start with current assignees
      // 2. Remove any assignees in removeAssignees
      // 3. Add any assignees in addAssignees that aren't already present
      const newAssignees = [
        ...currentAssignees.filter(
          assigneeId => !removeAssignees.some(ra => ra._id === assigneeId)
        ),
        ...addAssignees
          .map(a => a._id)
          .filter(newId => !currentAssignees.includes(newId))
      ];

      Object.assign(data, {
        jobassignees: newAssignees
      });
    }

    // Make the API call to update the job
    await axios.patch(
      `${JOBS_API}/workflow/jobs/job/${jobId}`,
      data
    );

    console.log("Job updated successfully with automation data");
  } catch (error) {
    console.error("Error updating job with automation data:", error);
    throw error;
  }
};
  const updateJobStage = async (stage, item) => {
    const data = JSON.stringify({ stageid: stage._id });
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${JOBS_API}/workflow/jobs/job/jobpipeline/updatestageid/${item.id}`,
      headers: { "Content-Type": "application/json" },
      data: data,
    };

    try {
      const response = await axios.request(config);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  

  const handleAutomationComplete = (selectedAutomationIndices) => {
  // Get the selected automations
  const selectedAutomations = selectedAutomationIndices.map(index => automationData[index]);
  
  // Find specific automations if needed
  const clientStatusAutomation = selectedAutomations.find(a => a.type === "Update client-facing job status");
  const assigneeAutomation = selectedAutomations.find(a => a.type === "Update job assignees");

  if (currentJobId && currentTargetStage) {
    // Pass the automation data to moveJob
    moveJob(currentJobId, currentTargetStage.name, currentTargetStage, {
      clientStatus: clientStatusAutomation,
      assignees: assigneeAutomation
    });
  }
  setAutomationDrawerOpen(false);
};
  const uniquePipelines = Array.from(
    new Map(pipelineData.map((pipeline) => [pipeline._id, pipeline])).values()
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Box>
        {loading && <p>Loading pipeline data...</p>}
        {uniquePipelines.map((pipeline, index) => (
          <Pipeline
            key={index}
            pipeline={pipeline}
            jobData={jobData}
            moveJob={moveJob}
            fetchJobList={fetchJobList}
            data={data}
            handleDrop={handleDrop}
          />
        ))}
      </Box>
      
      {/* Automation Drawer */}
      <AutomationDrawer
        open={automationDrawerOpen}
        automations={automationData}
        onClose={() => setAutomationDrawerOpen(false)}
        onMoveJob={handleAutomationComplete}
        jobId={currentJobId}
        targetStage={currentTargetStage?.name}
        accountName={accountName}
        accountId={accountId}
      />
    </DndProvider>
  );
};

const Pipeline = ({ pipeline, jobData, moveJob, fetchJobList, data, handleDrop }) => {
  const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const [checkedJobIds, setCheckedJobIds] = useState([]);
  const handleJobCheckboxChange = (isChecked, jobId) => {
    setCheckedJobIds((prevIds) =>
      isChecked ? [...prevIds, jobId] : prevIds.filter((id) => id !== jobId)
    );
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const handleDialogOpen = (type) => {
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const handleDelete = () => {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow",
    };

    Promise.all(
      checkedJobIds.map((jobId) =>
        fetch(`${JOBS_API}/workflow/jobs/job/${jobId}`, requestOptions)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to delete job ID: ${jobId}`);
            }
            return response.json();
          })
      )
    )
      .then(() => {
        console.log("Jobs deleted successfully:", checkedJobIds);
        toast.success("Jobs deleted successfully");
        fetchJobList(data); 
      })
      .catch((error) => {
        console.error("Error deleting jobs:", error);
        toast.error("Failed to delete some jobs");
      });
  };
  const navigate = useNavigate();
  const handleArchive = async () => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        active: false,
      }),
      redirect: "follow",
    };
  
    try {
      const archivePromises = checkedJobIds.map((jobId) =>
        fetch(
          `${JOBS_API}/workflow/jobs/job/${jobId}`,
          requestOptions
        ).then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to archive job ID: ${jobId}`);
          }
          return response.json();
        })
      );
  
      await Promise.all(archivePromises);
      toast.success("Jobs archived successfully");
      fetchJobList(data);
      navigate(`/clients/accounts/accountsdash/workflow/${data}/archivedjobs`);
    } catch (error) {
      console.error("Error archiving jobs:", error);
      toast.error("Failed to archive some jobs");
    }
  };

  return (
    <Box sx={{ border: "1px solid gray", borderRadius: '10px', marginBottom: '15px',  }}>
      <h3 style={{ marginLeft: '15px' }}>{pipeline.pipelineName}</h3>
      {checkedJobIds.length > 0 && (
        <Box>
          <Box sx={{display:'flex', alignItems:'center', gap:2}}>
            <DeleteIcon
              onClick={() => handleDialogOpen("delete")}
              sx={{
                marginLeft: "15px",
                color: "red",
                cursor: "pointer",
                transform: "scale(1)",
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ArchiveIcon sx={{ marginRight: 1, cursor:'pointer' }} 
                onClick={() => handleDialogOpen("archive")}
              />
              <p>Archive</p>
            </Box>
          </Box>
          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>
              {dialogType === "delete" ? "Confirm Delete" : "Confirm Archive"}
            </DialogTitle>
            <DialogContent>
              Are you sure you want to{" "}
              {dialogType === "delete" ? "delete" : "archive"} these jobs?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={dialogType === "delete" ? handleDelete : handleArchive}
                color="primary"
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
      
      <Box
        className="stage-container"
        display="flex"
        gap={2}
        sx={{
          padding: 2,
          width:'auto',
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {pipeline.stages.map((stage, stageIndex) => (
          <Stage
            key={stageIndex}
            stage={stage}
            jobs={jobData.filter(
              (job) =>
                job.PipelineId === pipeline._id && 
                job.Stages && 
                job.Stages.some(s => s.name === stage.name)
            )}
            moveJob={(jobId, targetStage) => moveJob(jobId, targetStage, stage)}
            onCheckboxChange={handleJobCheckboxChange}
            handleDrop={handleDrop}
          />
        ))}
      </Box>
    </Box>
  );
};

const Stage = ({ stage, jobs, moveJob, onCheckboxChange, handleDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.JOB,
    drop: (item) => handleDrop(item.id, stage.name),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // State for tracking how many jobs to show
  const [visibleJobsCount, setVisibleJobsCount] = useState(2);

  // Function to load more jobs
  const loadMoreJobs = () => {
    setVisibleJobsCount(prevCount => prevCount + 5);
  };
  return (
    <Box
      ref={drop}
      className={`stage ${isOver ? "drag-over" : ""}`}
      sx={{
        minWidth: '250px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        padding: '10px',
        marginRight: '10px',
      }}
    >
     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {stage.name}
        </Typography>
        <Typography variant="caption" sx={{ color: 'gray' }}>
          {jobs.length > 0 && <span>({jobs.length})</span>}
          
        </Typography>
      </Box>

{/*       
      {jobs.map((job) => (
        <Job key={job.id} job={job} onCheckboxChange={onCheckboxChange} />
      ))} */}
       {/* Only show the visible jobs */}
       <Box sx={{mt:2}}>
          {jobs.slice(0, visibleJobsCount).map((job) => (
        <Job key={job.id} job={job} onCheckboxChange={onCheckboxChange} />
      ))}
       </Box>
    
      
      {/* Show "Load More" button if there are more jobs to show */}
      {jobs.length > visibleJobsCount && (
        <Button 
          onClick={loadMoreJobs}
          variant="contained"
          size="small"
          sx={{
            width: '100%',
            marginTop: '8px',
            // color: 'primary.main',
            textTransform: 'none',
          }}
        >
          Load More ({jobs.length - visibleJobsCount} more)
        </Button>
      )}
    </Box>
  );
};

const Job = ({ job, onCheckboxChange }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.JOB,
    item: { id: job.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const truncateName = (name) => {
    const maxLength = 15;
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + "...";
    }
    return name;
  };
  const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };
  const truncateDescription = (description, maxLength = 20) => {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + "...";
    }
    return description;
  };

  const getPriorityStyle = (priority) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return { color: "white", backgroundColor: "#0E0402", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" };
      case "high":
        return { color: "white", backgroundColor: "#fe676e", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" };
      case "medium":
        return { color: "white", backgroundColor: "#FFC300", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" };
      case "low":
        return { color: "white", backgroundColor: "#56c288", fontSize: "12px", borderRadius: "50px", padding: "3px 7px" };
      default:
        return {};
    }
  };
  const formatDate = (date) => {
    if (!date) return "";
    const options = { month: "short", day: "2-digit", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };
  const timeAgo = (date) => {
    if (!date) return "N/A";
    const currentTime = new Date();
    const jobTime = new Date(date);
    const minutesDiff = differenceInMinutes(currentTime, jobTime);
    const hoursDiff = differenceInHours(currentTime, jobTime);
    const daysDiff = differenceInDays(currentTime, jobTime);
    if (minutesDiff < 1) {
      return "just now";
    } else if (minutesDiff < 60) {
      return `${minutesDiff} minute${minutesDiff === 1 ? "" : "s"} ago`;
    } else if (hoursDiff < 24) {
      return `${hoursDiff} hour${hoursDiff === 1 ? "" : "s"} ago`;
    } else {
      return `${daysDiff} day${daysDiff === 1 ? "" : "s"} ago`;
    }
  };
  const [isHovered, setIsHovered] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    onCheckboxChange(checked, job.id);
    if (checked) {
      console.log("Checked Job ID:", job.id);
    }
  };
  return (
    <Box
    className={`job-card ${isDragging ? "dragging" : ""}`}
      ref={drag}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        padding: 2,
        border: "1px solid #ddd",
        marginTop: 2,
        width: "auto",
        background: isDragging ? "#f0f0f0" : "#f9f9f9",
        textAlign: "left",
        opacity: isDragging ? 0.5 : 1,
        borderRadius: '8px',
        cursor: 'pointer',
        position: "relative",
        transition: "transform 0.2s ease",
        boxShadow:"02.s ease"
      }}
    >
      {(isHovered || isChecked) && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            cursor: "pointer",
            transform: "scale(1.2)",
          }}
        />
      )}
      <p>{job.Account.join(", ")}</p>
      <p>{truncateName(job.Name)}</p>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ 
          marginBottom: "8px",
          whiteSpace: "normal",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          lineHeight: "1.5",
        }}
      >
        {job.JobAssignee.join(", ")}
      </Typography>
      <p>{truncateDescription(stripHtmlTags(job.Description))}</p>
      <span style={getPriorityStyle(job.Priority)}>{job.Priority}</span>
      <p>Start Date: {formatDate(job.StartDate)}</p>
      <p>Due Date: {formatDate(job.DueDate)}</p>
      <p>
        {timeAgo(job.updatedAt)}
      </p>
    </Box>
  );
};

const AutomationDrawer = ({
  open,
  automations,
  onClose,
  onMoveJob,
  jobId,
  targetStage,
  accountName,
  accountId
}) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: "auto",
      },
    },
  };
  const [automationType, setAutomationType] = useState([]);
      const [automationTemp, setAutomationTemp] = useState("");
  const TAGS_API = process.env.REACT_APP_TAGS_TEMP_URL;
   const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
   const CHAT_API = process.env.REACT_APP_CHAT_TEMP_URL;
    const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
    const INVOICE_API = process.env.REACT_APP_INVOICE_TEMP_URL;
    const INVOICE_NEW = process.env.REACT_APP_INVOICES_URL;
    const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_TEMP_URL;
    const PROPOSAL_ACCOUNT_API = process.env.REACT_APP_PROPOSAL_URL;
    const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
    const AUTOMATION_API = process.env.REACT_APP_AUTOMATION_API;
    const ACCOUNT_API = process.env.REACT_APP_ACCOUNTS_URL;
    // REACT_APP_TASKS_API
    const ACCOUNT_TASKS_API = process.env.REACT_APP_TASKS_API;
  const [tags, setTags] = useState([]);
  const [accountTags, setAccountTags] = useState([]);
  const [selectedAutomationIndices, setSelectedAutomationIndices] = useState([]);
 const [automationAccountId, setAutomationAccountId] = useState("");
  useEffect(() => {
    fetchTags();
    if (accountId) {
      fetchAccountTags(accountId);
    }
  }, [accountId]);

  const fetchTags = async () => {
    try {
      const url = `${TAGS_API}/tags/`;
      const response = await fetch(url);
      const data = await response.json();
      setTags(data.tags);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAccountTags = async (accountId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_ACCOUNTS_URL}/accounts/accountdetails/${accountId}`);
      const data = await response.json();
      setAccountTags(data.account?.tags || []);
    } catch (error) {
      console.error("Error fetching account tags:", error);
    }
  };

  const calculateWidth = (label) => Math.min(label.length * 8, 200);

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

  const handleAutomationSelection = (index) => {
    setSelectedAutomationIndices((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };
  useEffect(() => {
        if (automations.length > 0) {
          setSelectedAutomationIndices(automations.map((_, index) => index));
        }
      }, [automations]);
      useEffect(() => {
        // Ensure automations is not empty and then set the automation type and template
        if (automations.length > 0) {
          setAutomationType(automations[0].type);
          // setAutomationTemp(automations[0].template.value || "");
          setAutomationTemp(automations[0]?.template?.value || "");
        }
  
        // If accountId is an array, extract the first value
        const accountValue = Array.isArray(accountId) ? accountId[0] : accountId;
        setAutomationAccountId(accountValue);
      }, [automations, accountId]);
 const [automationData, setAutomationData] = useState([]);
  const handleTagChange = (index, field, event) => {
    const newAutomations = [...automations];
    const selectedTagIds = event.target.value;
    
    // Find the tag objects that match the selected IDs
    const selectedTags = selectedTagIds.map(tagId => 
      tags.find(tag => tag._id === tagId)
    ).filter(tag => tag); // Filter out any undefined values
    
    newAutomations[index][field] = selectedTags;
    setAutomationData(newAutomations);
  };

     const [assignee, setAssignee] = useState([]);
    
    useEffect(() => {
      const fetchAssignees = async () => {
        try {
          const response = await axios.get(`${LOGIN_API}/common/users/roles?roles=TeamMember,Admin`);
          console.log("assigness data",response.data)
          setAssignee(response.data);
        } catch (error) {
          console.error("Error fetching assignees:", error);
        }
      };
      
      fetchAssignees();
    }, []);
    const assigneeOptions = assignee.map((ass)=>({
       value: ass._id,
        label: ass.username,
    }))
     const handleAssigneeChange = (index, type, event) => {
      const { value } = event.target; // Array of selected tag IDs
  
      setAutomationData((prev) => {
        const updatedAutomations = [...prev];
  
        // Get the correct tag options list
        const assigneeoptions = assigneeOptions;
  
        // Map selected tag IDs to tag objects with _id, tagName, and tagColour
        const selectedTags = value
          .map((assId) => {
            const ass = assigneeoptions.find((t) => t.value === assId);
            return ass
              ? { _id: ass.value, username: ass.label,  }
              : null;
          })
          .filter(Boolean); // Remove null values
  
        // Prevent duplicate selections
        const uniqueTags = selectedTags.filter(
          (ass, idx, self) => self.findIndex((t) => t._id === ass._id) === idx
        );
  
        // Ensure the tag is removed from the opposite category
        if (type === "addAssignees") {
          updatedAutomations[index].removeAssignees = updatedAutomations[
            index
          ].removeAssignees.filter(
            (ass) => !uniqueTags.some((t) => t._id === ass._id)
          );
        } else if (type === "removeAssignees") {
          updatedAutomations[index].addAssignees = updatedAutomations[
            index
          ].addAssignees.filter((tag) => !uniqueTags.some((t) => t._id === tag._id));
        }
  
        updatedAutomations[index] = {
          ...updatedAutomations[index],
          [type]: uniqueTags,
        };
  
        return updatedAutomations;
      });
    };
  const { logindata } = useContext(LoginContext);

  const [loginuserid, setLoginUserId] = useState("");
  const [username, setUsername] = useState("");
  const fetchUserData = async (id) => {
    const myHeaders = new Headers();

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `${LOGIN_API}/common/user/${id}`;
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("id", result);

        // console.log(userData)
        setUsername(result.username);
      });
  };
  useEffect(() => {
    if (logindata?.user?.id) {
      // Check if logindata and user.id exist
      setLoginUserId(logindata.user.id);
    }
  }, [logindata]);
  useEffect(() => {
    fetchUserData(loginuserid);
  }, []);


      // fetch invoive temp by id
      const fetchinvoicetempbyid = async (automationTemp) => {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };
        const url = `${INVOICE_API}/workflow/invoicetemp/invoicetemplate/${automationTemp}`;
        try {
          const response = await fetch(url, requestOptions); // Fetch the data
          const result = await response.json(); // Parse the JSON response
          console.log("Fetched invoice template:", result.invoiceTemplate);
          return result.invoiceTemplate; // Return the data
        } catch (error) {
          console.error("Error fetching invoice template:", error);
          throw error; // Let the calling function handle the error
        }
      };
      // fetch chat temp by id
      const fetchchattempbyid = async (automationTemp) => {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };
        const url = `${CHAT_API}/workflow/chats/chattemplate/chattemplateList/${automationTemp}`;
        try {
          const response = await fetch(url, requestOptions); // Fetch the data
          const result = await response.json(); // Parse the JSON response
          console.log("Fetched chat template:", result.chatTemplate);
          return result.chatTemplate; // Return the data
        } catch (error) {
          console.error("Error fetching invoice template:", error);
          throw error; // Let the calling function handle the error
        }
      };
      // fetch task temp by id
      const TASK_API = process.env.REACT_APP_TASK_TEMP_URL;
      const fetchtasktempbyid = async (automationTemp) => {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };
        const url = `${TASK_API}/workflow/tasks/tasktemplate/tasktemplatebyid/${automationTemp}`;
        try {
          const response = await fetch(url, requestOptions); // Fetch the data
          const result = await response.json(); // Parse the JSON response
          console.log("Fetched task template:", result.taskTemplate);
          return result.taskTemplate; // Return the data
        } catch (error) {
          console.error("Error fetching invoice template:", error);
          throw error; // Let the calling function handle the error
        }
      };
      // fetch proposal temp by id
      const fetchproposalbyid = async (automationTemp) => {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };
        const url = `${PROPOSAL_API}/workflow/proposalesandels/proposalesandels/${automationTemp}`;
        try {
          const response = await fetch(url, requestOptions); // Fetch the data
          const result = await response.json(); // Parse the JSON response
          console.log(
            "Fetched proposalsels template:",
            result.proposalesAndElsTemplate
          );
          return result.proposalesAndElsTemplate; // Return the data
        } catch (error) {
          console.error("Error fetching proposal template:", error);
          throw error; // Let the calling function handle the error
        }
      };
      // fetch organizer temp by id
      const fetchorganizertempbyid = async (automationTemp) => {
        const requestOptions = {
          method: "GET",
          redirect: "follow",
        };
        const url = `${ORGANIZER_TEMP_API}/workflow/organizers/organizertemplate/${automationTemp}`;
  
        try {
          const response = await fetch(url, requestOptions); // Fetch the data
          const result = await response.json(); // Parse the JSON response
          console.log("Fetched organizer template:", result.organizerTemplate);
          return result.organizerTemplate; // Return the data
        } catch (error) {
          console.error("Error fetching organizer template:", error);
          throw error; // Let the calling function handle the error
        }
      };
  
      const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
      };
      const assignInvoiceToAccount = (
        invoiceData,
        automationTemp,
        automationAccountId
      ) => {
        console.log(
          "Assigning invoice",
          invoiceData,
          automationTemp,
          automationAccountId
        );
  
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
  
        // Dynamically prepare the payload from invoiceData
        const raw = JSON.stringify({
          account: automationAccountId,
          invoicenumber: "", // Fill in if required
          invoicedate: getCurrentDate(), // Today's date
          description: invoiceData.description || "",
          invoicetemplate: automationTemp,
          paymentMethod: invoiceData.paymentMethod || "",
          teammember: loginuserid, // Fill in if required
          payInvoicewithcredits: invoiceData.payInvoicewithcredits || false,
          emailinvoicetoclient: invoiceData.sendEmailWhenInvCreated || false,
          reminders: invoiceData.sendReminderstoClients || false,
          daysuntilnextreminder: invoiceData.daysuntilnextreminder || null,
          numberOfreminder: invoiceData.numberOfreminder || null,
          scheduleinvoice: false, // Optional, adjust as needed
          scheduleinvoicedate: new Date(), // Current date and time
          scheduleinvoicetime: new Date().toLocaleTimeString("en-US", {
            hour12: false,
          }),
          lineItems: invoiceData.lineItems.map((item) => ({
            productorService: item.productorService || "",
            description: item.description || "",
            rate: item.rate || "",
            quantity: item.quantity || "",
            amount: item.amount || "",
            tax: item.tax || false,
          })),
          summary: {
            subtotal: invoiceData.summary.subtotal || "",
            taxRate: invoiceData.summary.taxRate || "",
            taxTotal: invoiceData.summary.taxTotal || "",
            total: invoiceData.summary.total || "",
          },
          paidAmount: "",
          invoiceStatus: "Pending",
          balanceDueAmount: "",
        });
  
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        fetch(`${INVOICE_NEW}/workflow/invoices/invoice`, requestOptions)
          .then((response) => response.json())
          .then((result) => console.log("Invoice assigned successfully:", result))
          .catch((error) => console.error("Error assigning invoice:", error));
      };
  
      const [chatId, setChatId] = useState();
      // sendChatToAccount
      const sendChatToAccount = (
        chatData,
        automationTemp,
        automationAccountId
      ) => {
        console.log(
          "sending chat",
          chatData,
          automationTemp,
          automationAccountId
        );
  
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const subtaskData = chatData.clienttasks.map(({ id, text, checked }) => ({
          id,
          text,
          checked: checked !== undefined ? checked : false, // Ensure checked is either true or false
        }));
        const messageData = [
          {
            message: chatData.description,
            fromwhome: "Admin",
            senderid: loginuserid,
            isRead:false
          },
        ];
        // Dynamically prepare the payload from invoiceData
        const raw = JSON.stringify({
          accountids: [automationAccountId],
          chattemplateid: automationTemp, // Fill in if required
          chatsubject: chatData.chatsubject, // Today's date
          templatename:chatData.templatename,
          from :username,
          description: messageData || "",
          sendreminderstoclient: chatData.sendreminderstoclient,
          daysuntilnextreminder: chatData.daysuntilnextreminder,
          numberofreminders: chatData.numberofreminders,
          clienttasks: subtaskData,
        });
        console.log("chats", raw);
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        fetch(`${CHATTOCLIENT_API}/chats/chatsaccountwise`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log("send chat to account successfully:", result);
            // console.log("chat id", result.newChats._id);
            // setChatId(result.newChats._id);
            toast.success("New Chat created successfully");
            // sendSaveChatMail(result.newChats._id);
          })
          .catch((error) => console.error("Error assigning invoice:", error));
      };
      // mail for drawer btn
      const sendSaveChatMail = (chatId) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
  
        const raw = JSON.stringify({
          accountid: automationAccountId,
          chattemplateid: automationTemp,
          username: username,
          chatId: chatId,
          viewchatlink: "/login",
        });
  
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        console.log(raw);
        fetch(`${CHATTOCLIENT_API}/chatsend/securechatsend`, requestOptions)
          .then((response) => response.json())
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
      };
  
      const assignTaskToAccount = (
        taskData,
        automationTemp,
        automationAccountId
      ) => {
        console.log(
          "Assigning task",
          taskData,
          automationTemp,
          automationAccountId
        );
  
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
          const raw = JSON.stringify({
          accounts: automationAccountId,
          job: jobId,
          templatename: automationTemp,
          taskname: taskData.templatename,
          status: taskData.status,
          taskassignees: taskData.taskassignees,
          priority: taskData.priority,
          description: taskData.description,
          tasktags: taskData.tasktags,
          issubtaskschecked: taskData.issubtaskschecked,
          startdate: taskData.startdate,
          enddate: taskData.enddate,
          subtasks: taskData.subtasks,
        });
        console.log(raw);
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
  
        fetch(`${ACCOUNT_TASKS_API}/accountstasks/newtask`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log("task created", result);
            // onClose()
          })
          .catch((error) => console.error(error));
      };
  
      const assignProposalToAccount = (
        proposalesandelsData,
        automationTemp,
        automationAccountId
      ) => {
        console.log(
          "Assigning proposal",
          proposalesandelsData,
          automationTemp,
          automationAccountId
        );
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountids: [automationAccountId],
            proposaltemplateid: automationTemp,
            templatename: proposalesandelsData.templatename,
            teammember: proposalesandelsData.teammember,
            proposalname: proposalesandelsData.proposalname,
            introduction: proposalesandelsData.introduction,
            terms: proposalesandelsData.terms,
            servicesandinvoices: proposalesandelsData.servicesandinvoices,
            introductiontext: proposalesandelsData.introductiontext,
            custommessageinemail: proposalesandelsData.custommessageinemail,
            custommessageinemailtext:
              proposalesandelsData.custommessageinemailtext,
            reminders: proposalesandelsData.reminders,
            daysuntilnextreminder: proposalesandelsData.daysuntilnextreminder,
            numberofreminder: proposalesandelsData.numberofreminder,
            introductiontextname: proposalesandelsData.introductiontextname,
            termsandconditionsname: proposalesandelsData.termsandconditionsname,
            termsandconditions: proposalesandelsData.termsandconditions,
            lineItems: proposalesandelsData.lineItems,
            summary: proposalesandelsData.summary,
            Addinvoiceoraskfordeposit:
              proposalesandelsData.Addinvoiceoraskfordeposit,
            Additemizedserviceswithoutcreatinginvoices:
              proposalesandelsData.Additemizedserviceswithoutcreatinginvoices,
            invoicetemplatename: proposalesandelsData.invoicetemplatename,
            invoiceteammember: proposalesandelsData.invoiceteammember,
            issueinvoice: proposalesandelsData.issueinvoice,
            specificdate: proposalesandelsData.specificdate,
            specifictime: proposalesandelsData.specifictime,
            description: proposalesandelsData.description,
            notetoclient: proposalesandelsData.notetoclient,
            paymentterms: proposalesandelsData.paymentterms,
            paymentduedate: proposalesandelsData.paymentduedate,
            paymentamount: proposalesandelsData.paymentamount,
               status:'Pending',
            active: true,
          }),
        };
        const url = `${PROPOSAL_ACCOUNT_API}/proposalandels/proposalaccountwise/`;
        console.log(url); // Log the URL for debugging
        console.log(options.body); // Log request body for debugging
        fetch(url, options)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
          })
          .then((result) => {
            console.log(result);
          })
          .catch((error) => {
            console.error("Fetch Error:", error);
            // toast.error("An error occurred while updating ProposalesAndEls.");
          });
      };
      const assignOrganizerToAccount = (
        organizerData,
        automationTemp,
        automationAccountId
      ) => {
        console.log(
          "Assigning proposal",
          organizerData,
          automationTemp,
          automationAccountId
        );
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
          accountid: automationAccountId,
          organizertemplateid: automationTemp,
             organizerName: organizerData.organizerName,
          reminders: organizerData.reminders,
          noofreminders: organizerData.noOfReminder,
          daysuntilnextreminder: organizerData.daysuntilNextReminder,
          sections: organizerData.sections,
          status: "Pending",
          active: true,
        });
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
        console.log(raw);
        const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/org`;
        fetch(url, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
          })
          .catch((error) => console.error(error));
      };
  
      const CLIENT_DOCS_API = process.env.REACT_APP_CLIENT_DOCS_MANAGE;
      const assignfoldertemp = (automationAccountId, automationTemp) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
  
        const raw = JSON.stringify({
          accountId: automationAccountId,
          foldertempId: automationTemp,
        });
  
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };
  
        console.log(raw);
        fetch(`${CLIENT_DOCS_API}/clientdocs/accountfoldertemp`, requestOptions)
          .then((response) => response.json())
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
      };

   const selectAutomationApi = async (
      automationType,
      automationTemp,
      automationAccountId,
      automation
    ) => {
      if (!automationType || !automationAccountId) {
        console.error("Missing required parameters");
        return;
      }

      switch (automationType) {
        
        case "Update account tags":
          console.log(
            `Updating account tags for Account ID: ${automationAccountId}`
          );

          try {
            // Fetch the current account data
            const response = await fetch(
              `${ACCOUNT_API}/accounts/accountdetails/${automationAccountId}`
            );
            if (!response.ok) throw new Error("Failed to fetch account data");

            const accountsData = await response.json();
            let currentTags = accountsData.account.tags || []; // Existing tag IDs

            // Extract tag IDs from automation object
            const addTagIds = automation?.addTags?.map((tag) => tag._id) || [];
            const removeTagIds =
              automation?.removeTags?.map((tag) => tag._id) || [];

            console.log("Current Tags:", currentTags);
            console.log("Tags to Add:", addTagIds);
            console.log("Tags to Remove:", removeTagIds);

            // Remove tags that match `removeTags`
            let updatedTags = currentTags.filter(
              (tagId) => !removeTagIds.includes(tagId)
            );

            // Add new tags without duplication
            updatedTags = [...new Set([...updatedTags, ...addTagIds])];

            console.log("Final Updated Tags:", updatedTags);

            // Send updated tags back to the server
            const updateResponse = await fetch(
              `${ACCOUNT_API}/accounts/accountdetails/updateaccounttags/${automationAccountId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ tags: updatedTags }),
              }
            );

            console.log("PATCH Response Status:", updateResponse.status);
            console.log("PATCH Response OK:", updateResponse.ok);

            const updateResponseData = await updateResponse.json();
            console.log("PATCH Response Data:", updateResponseData);

            if (!updateResponse.ok)
              throw new Error("Failed to update account tags");

            console.log("Account tags updated successfully");
          } catch (error) {
            console.error("Error updating account tags:", error);
          }
          break;
        // Other automation cases (unchanged)
        case "Send Invoice":
          console.log(
            `Processing 'Send Invoice' with template: ${automationTemp}, Account ID: ${automationAccountId}`
          );
          try {
            const invoiceData = await fetchinvoicetempbyid(automationTemp);
            console.log("Fetched invoice data", invoiceData);
            assignInvoiceToAccount(
              invoiceData,
              automationTemp,
              automationAccountId
            );
          } catch (error) {
            console.error("Error processing 'Send Invoice':", error);
          }
          break;
        case "Send message":
          console.log(
            `Processing 'Send message' with template: ${automationTemp}, Account ID: ${automationAccountId}`
          );
          try {
            const chatData = await fetchchattempbyid(automationTemp);
            console.log("Fetched chat data", chatData);
            sendChatToAccount(chatData, automationTemp, automationAccountId);
          } catch (error) {
            console.error("Error processing 'Send Invoice':", error);
          }
          break;
        case "Create Task":
          console.log(
            `Processing 'Create Task' with template: ${automationTemp}, Account ID: ${automationAccountId}`
          );
          try {
            const taskData = await fetchtasktempbyid(automationTemp);
            console.log("Fetched task temp data", taskData);
            assignTaskToAccount(taskData, automationTemp, automationAccountId);
          } catch (error) {
            console.error("Error processing 'Create Task':", error);
          }
          break;
        case "Apply folder template":
          console.log(
            `Applying folder template with template: ${automationTemp}, Account ID: ${automationAccountId}`
          );
          try {
            await assignfoldertemp(automationAccountId, automationTemp);
            console.log("Folder template assigned successfully");
          } catch (error) {
            console.error("Error applying folder template:", error);
          }
          break;

        case "Create Organizer":
          console.log(
            `Processing 'Create Organizer' with template: ${automationTemp}, Account ID: ${automationAccountId}`
          );
          try {
            const organizerData = await fetchorganizertempbyid(automationTemp);
            console.log("Fetched organizer data", organizerData);
            assignOrganizerToAccount(
              organizerData,
              automationTemp,
              automationAccountId
            );
          } catch (error) {
            console.error("Error processing 'Create Organizer':", error);
          }
          break;

        case "Send Proposal/Els":
          console.log(
            `Creating Proposals with template: ${automationTemp}, Account ID: ${automationAccountId}`
          );
          try {
            const proposalData = await fetchproposalbyid(automationTemp);
            console.log("Fetched Proposals data", proposalData);
            assignProposalToAccount(
              proposalData,
              automationTemp,
              automationAccountId
            );
          } catch (error) {
            console.error("Error processing 'Send Proposal/Els':", error);
          }
          break;

        case "Send Email":
          console.log(
            `Sending email with template: ${automationTemp}, Account ID: ${automationAccountId}`
          );
          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          const raw = JSON.stringify({
            automationType,
            templateId: automationTemp,
            accountId: automationAccountId,
          });

          const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
          };

          fetch(`${AUTOMATION_API}/automations/`, requestOptions)
            .then((response) => response.json())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
          break;

        default:
          console.warn(`Unhandled automation type: ${automationType}`);
          break;
      }
    };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 500, padding: 2 }}>
        <Typography variant="h6">Automations for {accountName}</Typography>

        {automations.length > 0 ? (
          automations.map((automation, index) => {
            const hasMatchingTags = automation.tags?.length
              ? automation.tags.some((automationTag) =>
                  accountTags.some(
                    (accountTag) => accountTag._id === automationTag._id
                  )
                )
              : true;
            return (
              <Box key={index} sx={{ marginBottom: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    checked={selectedAutomationIndices.includes(index)}
                    onChange={() => handleAutomationSelection(index)}
                    disabled={!hasMatchingTags}
                  />
                  {!hasMatchingTags && (
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ fontStyle: "italic" }}
                    >
                      The tags do not match the account
                    </Typography>
                  )}
                </Box>

                {automation.type === "Update account tags" ? (
                  <Box>
                    <Box sx={{ width: 500 }}>
                      <Typography variant="body2" sx={{ marginBottom: 1 }}>
                        Add tags to account
                      </Typography>
                      
                      <Select
                        multiple
                        displayEmpty
                        multiline
                        size="small"
                        value={automation.addTags?.map((tag) => tag._id) || []}
                        onChange={(event) => handleTagChange(index, "addTags", event)}
                        renderValue={(selected) =>
                          selected.length === 0 ? (
                            <Typography color="gray">
                              Select tags to add
                            </Typography>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                              }}
                            >
                              {automation.addTags?.map((tag) => (
                                <Chip
                                  key={tag._id}
                                  label={tag.tagName}
                                  sx={{
                                    backgroundColor: tag.tagColour,
                                    color: "#fff",
                                    fontWeight: "500",
                                    borderRadius: "20px",
                                  }}
                                />
                              ))}
                            </Box>
                          )
                        }
                        fullWidth
                        MenuProps={MenuProps}
                      >
                        {tagsoptions
                          .filter(
                            (option) =>
                              !automation.removeTags?.some(
                                (tag) => tag._id === option.value
                              )
                          )
                          .map((option) => {
                            const canvas = document.createElement("canvas");
                            const context = canvas.getContext("2d");
                            context.font = "14px Arial";

                            const textWidth = context.measureText(
                              option.label
                            ).width;
                            const dynamicWidth = Math.min(
                              textWidth + 20,
                              200
                            );

                            return (
                              <MenuItem
                                key={option.value}
                                value={option.value}
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
                      <Typography variant="body2" sx={{ marginBottom: 1 }}>
                        Remove tags from account
                      </Typography>
                     
                      <Select
                        multiple
                        size="small"
                        multiline
                        displayEmpty
                        value={automation.removeTags?.map((tag) => tag._id) || []}
                        onChange={(event) => handleTagChange(index, "removeTags", event)}
                        renderValue={(selected) =>
                          selected.length === 0 ? (
                            <Typography color="gray">
                              Select tags to remove
                            </Typography>
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                              }}
                            >
                              {automation.removeTags?.map((tag) => (
                                <Chip
                                  key={tag._id}
                                  label={tag.tagName}
                                  sx={{
                                    backgroundColor: tag.tagColour,
                                    color: "#fff",
                                    fontWeight: "500",
                                    borderRadius: "20px",
                                  }}
                                />
                              ))}
                            </Box>
                          )
                        }
                        fullWidth
                        MenuProps={MenuProps}
                      >
                        {tagsoptions
                          .filter(
                            (option) =>
                              !automation.addTags?.some(
                                (tag) => tag._id === option.value
                              )
                          )
                          .map((option) => {
                            const canvas = document.createElement("canvas");
                            const context = canvas.getContext("2d");
                            context.font = "14px Arial";

                            const textWidth = context.measureText(
                              option.label
                            ).width;
                            const dynamicWidth = Math.min(
                              textWidth + 20,
                              200
                            );

                            return (
                              <MenuItem
                                key={option.value}
                                value={option.value}
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
                      <Alert severity="warning" sx={{ marginBottom: 2 }}>
                        This automation can affect conditions for automations below
                      </Alert>
                    </Box>
                  </Box>
                ) : automation.type === "Update job assignees" ? (
                                            <Box>
                                              <Box sx={{ width: 500 }}>
                                                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                                                  Add assignees to job
                                                </Typography>
                                  
                                                <Select
                                                  multiple
                                                  displayEmpty
                                                  multiline
                                                  size="small"
                                                  value={automation.addAssignees.map((assignee) => assignee._id)}
                                                  onChange={(event) =>
                                                    handleAssigneeChange(index, "addAssignees", event)
                                                  }
                                                  renderValue={(selected) =>
                                                    selected.length === 0 ? (
                                                      <Typography color="gray">
                                                        Select assignees to add
                                                      </Typography>
                                                    ) : (
                                                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                                        {automation.addAssignees.map((assignee) => (
                                                          <Chip
                                                            key={assignee._id}
                                                            label={assignee.username}
                                                            sx={{
                                                              backgroundColor: '#e0e0e0',
                                                              color: "#000",
                                                              fontWeight: "500",
                                                              borderRadius: "20px",
                                                            }}
                                                          />
                                                        ))}
                                                      </Box>
                                                    )
                                                  }
                                                  fullWidth
                                                  MenuProps={MenuProps}
                                                  sx={{ width: "100%", marginBottom: 2 }}
                                                >
                                                  {assigneeOptions.map((option) => (
                                                    <MenuItem
                                                      key={option.value}
                                                      value={option.value}
                                                      sx={{
                                                        '&:hover': {
                                                          backgroundColor: '#f5f5f5',
                                                        },
                                                      }}
                                                    >
                                                      {option.label}
                                                    </MenuItem>
                                                  ))}
                                                </Select>
                                  
                                                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                                                  Remove assignees from job
                                                </Typography>
                                  
                                                <Select
                                                  multiple
                                                  size="small"
                                                  multiline
                                                  displayEmpty
                                                  value={automation.removeAssignees.map((assignee) => assignee._id)}
                                                  onChange={(event) =>
                                                    handleAssigneeChange(index, "removeAssignees", event)
                                                  }
                                                  renderValue={(selected) =>
                                                    selected.length === 0 ? (
                                                      <Typography color="gray">
                                                        Select assignees to remove
                                                      </Typography>
                                                    ) : (
                                                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                                        {automation.removeAssignees.map((assignee) => (
                                                          <Chip
                                                            key={assignee._id}
                                                           label={assignee.username}
                                                            sx={{
                                                              backgroundColor: '#e0e0e0',
                                                              color: "#000",
                                                              fontWeight: "500",
                                                              borderRadius: "20px",
                                                            }}
                                                          />
                                                        ))}
                                                      </Box>
                                                    )
                                                  }
                                                  MenuProps={MenuProps}
                                                  sx={{ width: "100%", marginBottom: 2 }}
                                                >
                                                  {assigneeOptions.map((option) => (
                                                    <MenuItem
                                                      key={option.value}
                                                      value={option.value}
                                                      sx={{
                                                        '&:hover': {
                                                          backgroundColor: '#f5f5f5',
                                                        },
                                                      }}
                                                    >
                                                      {option.label}
                                                    </MenuItem>
                                                  ))}
                                                </Select>
                                  
                                                <Alert severity="warning" sx={{ marginBottom: 2 }}>
                                                  This automation can affect job assignment notifications
                                                </Alert>
                                              </Box>
                                            </Box>
                                            
                                          ) : automation.type === "Update client-facing job status" ? (
                                                    <Box>
                                                      <Typography variant="body1">
                                                        <strong>Type:</strong> {automation.type}
                                                        {automation.visibilityForClient &&
                                                          automation.selectedClientStatus && (
                                                            <span>
                                                              {" "}
                                                              : {automation.selectedClientStatus.label}
                                                            </span>
                                                          )}
                                                        {!automation.visibilityForClient && (
                                                          <span> : Hide status</span>
                                                        )}
                                                      </Typography>
                                                    </Box>
                                                  ) :  (
                  <Box>
                    <Typography variant="body1">
                      <strong>Type:</strong> {automation.type}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Template:</strong> {automation?.template?.label}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Tags:</strong>
                    </Typography>
                    {automation.tags?.map((tag) => (
                      <Box
                        key={tag._id}
                        sx={{
                          display: "inline-block",
                          backgroundColor: tag.tagColour,
                          color: "white",
                          borderRadius: "4px",
                          padding: "2px 6px",
                          marginRight: "4px",
                        }}
                      >
                        {tag.tagName}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            );
          })
        ) : (
          <Typography>No automations available</Typography>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
       
                    <Button
  onClick={async () => {
    const selectedAutomations = selectedAutomationIndices
      .map((index) => automations[index])
      .filter((automation) => {
        // Filter based on tags if applicable
        if (!automation.tags || automation.tags.length === 0) {
          return true;
        }
        return automation.tags.some((tag) =>
          accountTags.some(
            (accountTag) => accountTag._id === tag._id
          )
        );
      });
    // Process all selected automations
    if (selectedAutomations.length > 0) {
      for (const automation of selectedAutomations) {
        const { type, template } = automation;
        const templateValue = template?.value;

        if (type && automationAccountId) {
          try {
            await selectAutomationApi(
              type,
              templateValue,
              automationAccountId,
              automation
            );
          } catch (error) {
            console.error("Error processing automation:", error);
          }
        }
      }
    }

    // Move the job with any relevant automations
    onMoveJob(selectedAutomationIndices);
  }}
  variant="contained"
  color="primary"
  sx={{
                    backgroundColor: "var(--color-save-btn)", // Normal background

                    "&:hover": {
                      backgroundColor: "var(--color-save-hover-btn)", // Hover background color
                    },
                    borderRadius: "15px",
                    mt: 2,
                  }}
>
  Move
</Button>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderColor: "var(--color-border-cancel-btn)",
              color: "var(--color-save-btn)",
              "&:hover": {
                backgroundColor: "var(--color-save-hover-btn)",
                color: "#fff",
                border: "none",
              },
              width: "80px",
              borderRadius: "15px",
              mt: 2,
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Pipelines;