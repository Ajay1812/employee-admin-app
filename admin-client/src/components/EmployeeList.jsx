import React, { useEffect, useState } from 'react';
import { Button, Box, Table, TextField, TableBody, TableCell, InputAdornment, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Grid } from '@mui/material';
import { BiTrash } from 'react-icons/bi';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = 'http://localhost:3000';  // Make sure this is your correct server URL

export function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredEmployees = employees.filter(employee => {
    const name = `${employee.name}`.toLowerCase();
    const mobile = employee.mobile ? employee.mobile.toString() : '';
    const employeeId = employee._id.toString()
    const course = employee.course ? employee.course.map(course => course.toLowerCase()) : [];

    return (
      name.includes(searchTerm.toLowerCase()) ||
      employee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mobile.includes(searchTerm) ||
      employeeId.includes(searchTerm) ||
      course.some(c => c.includes(searchTerm.toLowerCase()))
    );
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: "5rem 0 1rem 0" }}>
            <Typography marginRight="1.3rem" fontWeight={"bold"} variant="h4">Employee List</Typography>
          </div>
        </Grid>
        <Grid item xs={12} margin={"5px 0 5px 0"} style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: "80%" }}>
            <TextField
              label="Search Employees"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
              style={{ marginBottom: '20px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </Grid>
        <Grid item xs={12} margin={"25px 0 25px 0"}>
          <TableContainer component={Paper} style={{ width: '100%', border: "1px solid black" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Id</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Image</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Employee Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Email</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Mobile No</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Designation</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Gender</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Course</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>CreatedAt</TableCell>
                  <TableCell style={{ fontWeight: 'bold', background: "#e3e3e3" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map((employee, index) => (
                  <TableRow key={employee._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {employee.imagePath && (
                        <Box >
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
                    <TableCell>{employee.course}</TableCell>
                    <TableCell>{formatDate(employee.createdAt)}</TableCell>
                    <TableCell>
                      <IconButton color="primary">
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
      </Grid>
      <ToastContainer autoClose={2000} position="top-center" />
    </>
  );
}
