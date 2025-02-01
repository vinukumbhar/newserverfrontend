import React, { useState, useEffect } from 'react'
import './overview.css'
import { Link } from 'react-router-dom'
import { IoDocumentTextOutline, IoMailOpenOutline } from "react-icons/io5";
import { PiChats, PiNotepad } from "react-icons/pi";
import { GrNotes } from "react-icons/gr";
import { CgNotes } from "react-icons/cg";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import { TbSubtask } from "react-icons/tb";
import { useNavigate, useParams, useRouteLoaderData } from "react-router-dom";
import { Typography, Card, CardContent, Divider, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';


const Overview = () => {
  // Organizer
  const ORGANIZER_TEMP_API = process.env.REACT_APP_ORGANIZER_TEMP_URL;
  const { data } = useParams();
  const [organizerTemplatesData, setOrganizerTemplatesData] = useState([]);

  const fetchOrganizerTemplates = async (accountid) => {
    try {
      const url = `${ORGANIZER_TEMP_API}/workflow/orgaccwise/organizeraccountwise/organizerbyaccount/${accountid}`;
      console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch email templates");
      }
      const data = await response.json();
      console.log(data);
      setOrganizerTemplatesData(data.organizerAccountWise);
    } catch (error) {
      console.error("Error fetching email templates:", error);
    }
  };
  useEffect(() => {
    fetchOrganizerTemplates(data);

  }, []);


  //Proposals

  useEffect(() => {
    fetchPrprosalsAllData(data);
  }, []);

  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_URL;
  const [ProposalsTemplates, setProposalsTemplates] = useState([]);

  const fetchPrprosalsAllData = async (data) => {
    try {
      const url = `${PROPOSAL_API}/proposalandels/proposalaccountwise/proposalbyaccount/${data}`;
      console.log(url)
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch Proposals templates");
      }
      const result = await response.json();
      console.log(result.proposalesandelsAccountwise)
      setProposalsTemplates(result.proposalesandelsAccountwise);

    } catch (error) {
      console.error("Error fetching Proposals  templates:", error);
    }
  };
  console.log(ProposalsTemplates)
  //Invoices 
  const INVOICES_API = process.env.REACT_APP_INVOICES_URL;
  const [accountInvoicesData, setAccountInvoicesData] = useState([]);
  useEffect(() => {
    fetchInvoices(data);
  }, []);

  const fetchInvoices = async (data) => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(`${INVOICES_API}/workflow/invoices/invoice/invoicelistby/accountid/${data}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          // setAccountInvoicesData(result.invoice);
          setAccountInvoicesData(result.invoice || []);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error("Error fetching email templates:", error);
      setAccountInvoicesData([]);
    }
  };
  console.log(accountInvoicesData)
// chats
const CHATTOCLIENT_API = process.env.REACT_APP_CHAT_API;
 const [isActiveTrue, setIsActiveTrue] = useState(true);
 const [chats, setChats] = useState([]);
  useEffect(() => {
    accountwiseChatlist(data, isActiveTrue);
  }, [data, isActiveTrue]); // Dependencies
const accountwiseChatlist = (data, isActiveTrue) => {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  const url = `${CHATTOCLIENT_API}/chats/chatsaccountwise/isactivechat/${data}/${isActiveTrue}`
  console.log(url)
  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("chats temp", result);
      if (result.chataccountwise) {
        setChats(result.chataccountwise); // Store the chat list
      }
      
    })
    .catch((error) => console.error(error));
};

 const JOBS_API = process.env.REACT_APP_ADD_JOBS_URL;
  const [jobData, setJobData] = useState([]);

  useEffect(() => {
    fetchJobList(data);
  }, [data]);

  const fetchJobList = (data) => {
    const url = `${JOBS_API}/workflow/jobs/job/joblist/list/true/${data}`;

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        setJobData(result.jobList || []);
      })
      .catch((error) => {
        console.error("Error fetching job list:", error);
      });
  };

  return (
    <div className='overview-container' style={{ display: 'flex', gap: '5%', }}>
      <div className='boxone'>
        <div className='document-card'>
          <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <h3>Chats</h3>
            <Link to={`/clients/accounts/accountsdash/communication/${data}`}>View all</Link>
          </Box>
          <div className='underline'></div>
        
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Chat Subject</strong></TableCell>
          
          </TableRow>
        </TableHead>
        <TableBody>
          {chats.length > 0 ? (
            chats.map((chat) => (
              <TableRow key={chat._id}>
                <TableCell>{chat.chatsubject}</TableCell>
                
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center">No chats available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
   
        </div>
       
        <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <Typography variant="h7" component="h3" sx={{ fontWeight: 'bold' }}>
            Organizers
          </Typography>
          <Link to={`/clients/accounts/accountsdash/organizers/${data}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
            View all
          </Link>
        </Box>
        <div className='underline'></div>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
            {organizerTemplatesData && organizerTemplatesData.length > 0 ? (
              // Show the table when there are records
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {organizerTemplatesData.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>
                       
                          {row.organizertemplateid?.organizerName || "Unnamed Template"}
                      
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              // Show the fallback UI when there are no records
              <Box>
                <PiNotepad style={{ fontSize: '4rem', color: '#9e9e9e' }} />
                <Typography variant="body1" color="textSecondary" mt={2} sx={{
                  color: "text.disabled", // Use Material-UI's disabled text color
                  mt: 2,
                }}>
                  No Organizers available
                </Typography>
              </Box>
            )}
          </Box>

        </CardContent>
       


        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h7" component="h3" sx={{ fontWeight: 'bold' }}>
            Proposals & ELs
          </Typography>
          <Link
            to={`/clients/accounts/accountsdash/proposals/${data}`}
            style={{ textDecoration: 'none', color: '#1976d2' }}
          >
            View all
          </Link>
        </Box>
        <div className='underline'></div>

        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
            {ProposalsTemplates && ProposalsTemplates.length === 0 ? (
              // Show icon when the data is empty
              // <PiNotepad style={{ fontSize: '4rem', color: '#9e9e9e' }} />
              <Box>
                <PiNotepad style={{ fontSize: '4rem', color: '#9e9e9e' }} />
                <Typography variant="body1" color="textSecondary" mt={2} sx={{
                  color: "text.disabled", // Use Material-UI's disabled text color
                  mt: 2,
                }}>
                  No Proposals
                </Typography>
              </Box>
            ) : (
              // Show table when there are records
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ProposalsTemplates.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>
                       
                          {row.proposalname}
                       
                      </TableCell>
                      <TableCell>a</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </CardContent>


      </div>
      <div className='boxtwo'>
       
        <div className='document-card'>
          <div className='heading'>
            <h3>Jobs</h3>
            <Link to={`/clients/accounts/accountsdash/workflow/${data}/activejobs`}>View all</Link>
          </div>
          <div className='underline'></div>
          <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Job Name</strong></TableCell>
            <TableCell><strong>Pipeline</strong></TableCell>
            <TableCell><strong>Stage</strong></TableCell>
            {/* <TableCell><strong>Account</strong></TableCell>
            <TableCell><strong>Start Date</strong></TableCell>
            <TableCell><strong>Due Date</strong></TableCell>
            <TableCell><strong>Priority</strong></TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {jobData.length > 0 ? (
            jobData.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.Name}</TableCell>
                <TableCell>{job.Pipeline}</TableCell>
                <TableCell>{job.Stage.join(", ")}</TableCell>
                {/* <TableCell>{job.Account.join(", ")}</TableCell> */}
                {/* <TableCell>{new Date(job.StartDate).toLocaleDateString()}</TableCell> */}
                {/* <TableCell>{new Date(job.DueDate).toLocaleDateString()}</TableCell> */}
                {/* <TableCell>{job.Priority}</TableCell> */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">No jobs available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
        </div>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h7" component="h3" sx={{ fontWeight: 'bold' }}>
            Unpaid invoices
          </Typography>
          <Link to={`/clients/accounts/accountsdash/invoices/${data}/invoice`} style={{ textDecoration: 'none', color: '#1976d2' }}>
            View all
          </Link>
        </Box>
        <div className='underline'></div>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
            {accountInvoicesData && accountInvoicesData.length > 0 ? (
              // Show the table when there are records
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accountInvoicesData.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>
                      
                          {row.invoicenumber}
                       
                      </TableCell>
                      <TableCell>a</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              // Show the fallback UI when no records
              <Box>
                <PiNotepad style={{ fontSize: '4rem', color: '#9e9e9e' }} />
                <Typography variant="body1" color="textSecondary" mt={2} sx={{
                  color: "text.disabled", // Use Material-UI's disabled text color
                  mt: 2,
                }}>
                  No unpaid invoices
                </Typography>
              </Box>
            )}

          </Box>
        </CardContent>

       
      </div>
    </div>
  )
}

export default Overview