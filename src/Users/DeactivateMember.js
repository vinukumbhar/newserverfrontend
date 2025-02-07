import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import {TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,Paper,
  TablePagination, IconButton, Box, Typography } from "@mui/material";
import { CiMenuKebab } from "react-icons/ci";
import { toast, ToastContainer } from "react-toastify";
const DeactivateMember = () => {
  const LOGIN_API = process.env.REACT_APP_USER_LOGIN;
  const handleRestoreMember = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to Restore this account ?");
    if (isConfirmed) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        active: true,
      });

      const requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${LOGIN_API}/admin/teammember/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          console.log(id);

          fetchDeactivateData();
          toast.success("Team Member Activated Successfully");
        })
        .catch((error) => console.error(error));
    }
  };

  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);

  const fetchDeactivateData = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const url = `${LOGIN_API}/admin/teammember/teammemberlist/list/false`;

      const response = await fetch(url, requestOptions);
      const result = await response.json();

      setTeamMembers(result.teamMemberslist);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDeactivateData();
  }, []);
  const [tempIdget, setTempIdGet] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (_id) => {
    setOpenMenuId(openMenuId === _id ? null : _id);
    setTempIdGet(_id);
  };
const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const columns = useMemo(
    () => [
      {
        accessorKey: "FirstName",
        header: "Name",
        Cell: ({ row }) => {
          const firstName = row.original?.FirstName;
          const middleName = row.original?.MiddleName;
          const lastName = row.original?.LastName;
          const initials = `${firstName ? firstName[0] : ""}${lastName ? lastName[0] : ""}`;
          return (
            <div>
              <div className="circle">{initials}</div>
              <Link to={`/updateteammember/${row.original?.id}`}>{`${firstName ? firstName : ""}  ${middleName ? middleName : ""} ${lastName ? lastName : ""}`}</Link>{" "}
            </div>
          );
        },
      },
      { accessorKey: "Email", header: "Email" },
      { accessorKey: "Role", header: "Role" },
      {
        accessorKey: "Created",
        header: "Created",
        Cell: ({ cell }) => {
          const dateValue = cell.getValue();
          const date = new Date(dateValue);

          if (isNaN(date)) {
            return "Invalid Date";
          }

          return date
            .toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })
            .replace(",", "");
        },
      },
      { accessorKey: "has2FA", header: "2FA", Cell: ({ value }) => (value ? "Enabled" : "Disabled") },
      {
        accessorKey: "Actions",
        header: "Actions",
        Cell: ({ row }) => (
          <IconButton
            onClick={() => toggleMenu(row.original.id)}
            style={{ color: "#2c59fa", position: "relative" }} // Added position relative for proper positioning
          >
            <CiMenuKebab style={{ fontSize: "25px" }} />
            {openMenuId === row.original.id && (
              <Box
                sx={{
                  position: "absolute",
                  zIndex: 10, // Ensure it's on top of other elements
                  backgroundColor: "#fff",
                  boxShadow: 1,
                  borderRadius: 1,
                  p: 1,
                  left: "30px",
                  m: 2,
                }}
              >
                <Typography
                  onClick={() => {
                    handleRestoreMember(row.original.id);
                  }}
                  sx={{ fontSize: "12px", color: "blue", fontWeight: "bold" }}
                >
                  Restore
                </Typography>
              </Box>
            )}
          </IconButton>
        ),
      },
    ],
    [openMenuId]
  );

  const table = useMaterialReactTable({
    columns,
    data: teamMembers,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <MaterialReactTable table={table} /> */}
      <TableContainer component={Paper} sx={{ overflow: "visible" }}>
      <Table sx={{ width: "100%" }}>
        {/* Table Head */}
        <TableHead>
          <TableRow>
            <TableCell style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100">Name</TableCell>
            <TableCell style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="150">Email</TableCell>
            <TableCell style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100">Role</TableCell>
            <TableCell style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100">Created</TableCell>
            <TableCell style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100">2FA</TableCell>
            <TableCell style={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "16px",
                    }}
                    width="100">Actions</TableCell>
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {teamMembers
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((member, index) => {
              const firstName = member?.FirstName || "";
              const middleName = member?.MiddleName || "";
              const lastName = member?.LastName || "";
              const initials = `${firstName ? firstName[0] : ""}${lastName ? lastName[0] : ""}`;
              const isLoggedInUser = index === 0;

              const linkPath = isLoggedInUser
                ? `/settings/myaccount`
                : `/updateteammember/${member?.id}`;

              const formattedDate = new Date(member.Created);
              const displayDate = isNaN(formattedDate)
                ? "Invalid Date"
                : formattedDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }).replace(",", "");

              return (
                <TableRow key={member.id}>
                  {/* Name Column */}
                  <TableCell style={{
                          fontSize: "12px",
                          padding: "4px 8px",
                          lineHeight: "1",
                          cursor: "pointer",
                          color: "#3f51b5",
                        }}>
                    <div style={{ display: "flex", flexDirection:"column" }}>
                      <div className="circle">{initials}</div>
                      <br/>
                      <Link to={linkPath} style={{textDecoration:'none'}}>
                        {`${firstName} ${middleName} ${lastName}`}
                      </Link>
                    </div>
                  </TableCell>
                  
                  {/* Email */}
                  <TableCell>{member.Email}</TableCell>

                  {/* Role */}
                  <TableCell>{member.Role}</TableCell>

                  {/* Created */}
                  <TableCell>{displayDate}</TableCell>

                  {/* 2FA */}
                  <TableCell>{member.has2FA ? "Enabled" : "Disabled"}</TableCell>

                  {/* Actions */}
                  <TableCell>
                    <IconButton onClick={() => toggleMenu(member.id)} style={{ color: "#2c59fa" }}>
                      <CiMenuKebab style={{ fontSize: "25px" }} />
                    </IconButton>
                    {openMenuId === member.id && (
                      <Box
                        sx={{
                          position: "absolute",
                          zIndex: 10,
                          backgroundColor: "#fff",
                          boxShadow: 1,
                          borderRadius: 1,
                          p: 1,
                          left: "30px",
                          m: 2,
                        }}
                      >
                        
                        <Typography
                          sx={{ fontSize: "12px", color: "red", fontWeight: "bold" }}
                          onClick={() => handleRestoreMember(member.id)}
                        >
                          Restore
                        </Typography>
                        
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>

      {/* Pagination */}
      
    </TableContainer>
    <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={teamMembers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ToastContainer />
    </div>
  );
};

export default DeactivateMember;
