import React, { useEffect, useState } from 'react';
import {
  Button, Box, Table, TextField, TableBody, TableCell, InputAdornment,
  TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Grid, TableSortLabel, FormControl, MenuItem, Select, InputLabel
} from '@mui/material';
import { BiTrash } from 'react-icons/bi';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../config';
import EditEmployeeDialog from './EditEmployeeDialog';

export function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [empStatus, setEmpStatus] = useState('Active');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [EmployeeId, setSelectedEmployeeId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`${BASE_URL}/admin/employeelist`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.ok) {
          const data = await response.json();
          setEmployees(data.employeeList);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const refreshEmployees = async () => {
    const response = await axios.get(`${BASE_URL}/admin/employeelist`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setEmployees(response.data.employeeList);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  };

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    console.log(selectedStatus)
    setEmpStatus(selectedStatus);
  }

  const sortedEmployees = employees
    .filter(employee => {
      const name = `${employee.name}`.toLowerCase();
      const mobile = employee.mobile ? employee.mobile.toString() : '';
      const employeeId = employee._id.toString();
      const course = employee.course ? employee.course.map(course => course.toLowerCase()) : [];

      return ((
        name.includes(searchTerm.toLowerCase()) ||
        employee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mobile.includes(searchTerm) ||
        employeeId.includes(searchTerm) ||
        course.some(c => c.includes(searchTerm.toLowerCase()))
      )
      );
    })
    .sort(getComparator(order, orderBy));

  const filteredEmployees = sortedEmployees.filter(employee => {
    if (empStatus === 'All') {
      return true;
    } else if (empStatus === 'Inactive') {
      return employee.isActive === false;
    } else if (empStatus === 'Active') {
      return employee.isActive === true;
    }
  });


  const handleDelete = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${BASE_URL}/admin/delete-employee/${employeeId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee._id !== employeeId)
        );
        toast.success("Employee Deleted successfully!", {
          position: "top-center",
          autoClose: 2000,
        });
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleOpenDialog = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setSelectedEmployeeId(null);
    setOpenDialog(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${date.toLocaleString('en', { month: 'short' })}-${date.getFullYear().toString().slice(-2)}`;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: "5rem 0 3em 0" }}>
            <Typography marginRight="1.3rem" fontWeight={"bold"} variant="h4">Employee List</Typography>
          </div>
        </Grid>
        <br />
        <Box width="100%" display="flex" justifyContent="center">
          <Grid container item xs={12} spacing={2} style={{ maxWidth: "800px", marginBottom: "2rem" }}>
            <Grid item xs={12} sm={3}>
              <Box width="100px">
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={empStatus}
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="All">All</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                label="Search Employees"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by - Name, Id, Mobile, Date"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Grid item xs={12}>
          <TableContainer component={Paper} style={{ width: '100%', border: "1px solid black" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>
                    <TableSortLabel
                      active={orderBy === 'empId'}
                      direction={orderBy === 'empId' ? order : 'asc'}
                      onClick={() => handleRequestSort('empId')}
                    >
                      Id
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Image</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                    >
                      Employee Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>
                    <TableSortLabel
                      active={orderBy === 'email'}
                      direction={orderBy === 'email' ? order : 'asc'}
                      onClick={() => handleRequestSort('email')}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Mobile No</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>
                    <TableSortLabel
                      active={orderBy === 'designation'}
                      direction={orderBy === 'designation' ? order : 'asc'}
                      onClick={() => handleRequestSort('designation')}
                    >
                      Designation
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Gender</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Course</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>
                    <TableSortLabel
                      active={orderBy === 'createdAt'}
                      direction={orderBy === 'createdAt' ? order : 'asc'}
                      onClick={() => handleRequestSort('createdAt')}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell>{employee.empId}</TableCell>
                    <TableCell>
                      {employee.imagePath && (
                        <Box>
                          <img
                            src={`${BASE_URL}${employee.imagePath}`}
                            alt="employee"
                            style={{ width: '50px', objectFit: 'cover' }}
                          />
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.mobile}</TableCell>
                    <TableCell>{employee.designation}</TableCell>
                    <TableCell>{employee.gender}</TableCell>
                    <TableCell>{employee.course.join(", ").trim()}</TableCell>
                    <TableCell>{formatDate(employee.createdAt)}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenDialog(employee._id)}>
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(employee._id)}>
                        <BiTrash />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid >
      <ToastContainer autoClose={2000} position="top-center" />
      <EditEmployeeDialog open={openDialog} onClose={handleCloseDialog} employeeId={EmployeeId} refreshEmployees={refreshEmployees} />
    </>
  );
}
