import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../config.js";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function EditEmployeeDialog({ open, onClose, employeeId, refreshEmployees }) {
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    gender: "",
    course: "",
    imagePath: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && employeeId) {
      const fetchEmployeeData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`${BASE_URL}/admin/employees/${employeeId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          setEmployeeData(response.data.employee);
        } catch (err) {
          setError("Failed to load employee data");
        } finally {
          setLoading(false);
        }
      };
      fetchEmployeeData();
    }
  }, [open, employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await axios.put(`${BASE_URL}/admin/employees/${employeeId}`, employeeData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      refreshEmployees();
      onClose();
      toast.success("Employee Details Edited successfully!", {
        position: "top-center",
        autoClose: 2000,
      });
      setTimeout(() => {
        toast.dismiss();
      }, 2000);
    } catch (err) {
      setError("Failed to update employee");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Employee</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Employee Name"
              name="name"
              value={employeeData.name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={employeeData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone"
              name="phone"
              value={employeeData.phone}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Designation"
              name="designation"
              value={employeeData.designation}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Gender"
              name="gender"
              value={employeeData.gender}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Course"
              name="course"
              value={employeeData.course}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Image URL (optional)"
              name="imagePath"
              value={employeeData.imagePath}
              onChange={handleChange}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={saving}>
          {saving ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
}

export default EditEmployeeDialog;
