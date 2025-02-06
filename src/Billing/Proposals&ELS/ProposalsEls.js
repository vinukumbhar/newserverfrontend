import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Box,
  TableContainer,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";
import { toast } from "react-toastify";

const ProposalsEls = () => {
  const PROPOSAL_API = process.env.REACT_APP_PROPOSAL_URL;
  const [ProposalsTemplates, setProposalsTemplates] = useState([]);
  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const navigate = useNavigate();

  const fetchPrprosalsAllData = async () => {
    try {
      const url = `${PROPOSAL_API}/proposalandels/proposalaccountwise/allproposallist/list`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch Proposals templates");
      }
      const result = await response.json();
      console.log(result.proposalesandelsAccountwise);
      setProposalsTemplates(result.proposalesandelsAccountwise);
    } catch (error) {
      console.error("Error fetching Proposals  templates:", error);
    }
  };

  useEffect(() => {
    fetchPrprosalsAllData();
  }, []);

  const handleEdit = (_id, data) => {
    console.log(_id);
    console.log(data);
    navigate(`/clients/accounts/accountsdash/proposals/${data}/update/` + _id);
    // console.log(_id);
  };

  const handleAccountDash = (_id, data) => {
    navigate(`/clients/accounts/accountsdash/overview/${data}`);
  };

  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };

  const handleDelete = (_id) => {
    // Show a confirmation prompt
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Job template?"
    );

    // Proceed with deletion if confirmed
    if (isConfirmed) {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };
      const url = `${PROPOSAL_API}/proposalandels/proposalaccountwise/`;
      fetch(url + _id, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete item");
          }
          return response.json();
        })
        .then((result) => {
          console.log(result);
          toast.success("Item deleted successfully");
          //   setShowForm(false);
          fetchPrprosalsAllData();
          // fetchServiceData();
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to delete item");
        });
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box>
        <Typography variant="h5" fontWeight="bold">
          Proposals & Els
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ overflow: "visible" }}>
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Client Name
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="200"
              >
                Proposal Name
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Status
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Payment
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Auth
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Invoicing
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Date
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Signed
              </TableCell>
              <TableCell
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "16px",
                }}
                width="100"
              >
                Settings
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ProposalsTemplates.map((row) => (
              <TableRow key={row._id}>
                <TableCell>
                  <Typography
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                      cursor: "pointer",
                      color: "#3f51b5",
                    }}
                    onClick={() =>
                      handleAccountDash(row._id, row.accountid._id)
                    }
                  >
                    {row.accountid.accountName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    style={{
                      fontSize: "12px",
                      padding: "4px 8px",
                      lineHeight: "1",
                      cursor: "pointer",
                      color: "#3f51b5",
                    }}
                    onClick={() => handleEdit(row._id, row.accountid._id)}
                  >
                    {row.proposalname}
                  </Typography>
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "12px",
                    padding: "4px 8px",
                    lineHeight: "1",
                    cursor: "pointer",
                  }}
                >
                  a
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "12px",
                    padding: "4px 8px",
                    lineHeight: "1",
                    cursor: "pointer",
                  }}
                >
                  b
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "12px",
                    padding: "4px 8px",
                    lineHeight: "1",
                    cursor: "pointer",
                  }}
                >
                  c
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "12px",
                    padding: "4px 8px",
                    lineHeight: "1",
                    cursor: "pointer",
                  }}
                >
                  d
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "12px",
                    padding: "4px 8px",
                    lineHeight: "1",
                    cursor: "pointer",
                  }}
                >
                  {/* {row.createdAt}
                   */}
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(row.createdAt))}
                </TableCell>
                <TableCell></TableCell>
                <TableCell
                  style={{
                    fontSize: "12px",
                    padding: "4px 8px",
                    lineHeight: "1",
                  }}
                >
                  <IconButton
                    onClick={() => toggleMenu(row._id)}
                    style={{ color: "#2c59fa" }}
                  >
                    <CiMenuKebab style={{ fontSize: "25px" }} />
                    {openMenuId === row._id && (
                      <Box
                        sx={{
                          position: "absolute",
                          zIndex: 1,
                          backgroundColor: "#fff",
                          boxShadow: 1,
                          borderRadius: 1,
                          p: 1,
                          left: "20px",

                          m: 2,
                          top: "10px",
                          textAlign: "start",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "12px", fontWeight: "bold" }}
                          onClick={() => handleEdit(row._id)}
                        >
                          Edit   
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "red",
                            fontWeight: "bold",
                          }}
                          onClick={() => handleDelete(row._id)}
                        >
                          Delete
                        </Typography>
                        
                      </Box>
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProposalsEls;
