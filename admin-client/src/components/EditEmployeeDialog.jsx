import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Checkbox
} from "@mui/material";
import axios from "axios";
import { BASE_URL } from "../config.js";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function EditEmployeeDialog({ open, onClose, employeeId, refreshEmployees }) {
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: [],
    imagePath: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(true);

  const handleImageUpload = (e) => {
    setEmployeeData(prevData => ({
      ...prevData,
      imagePath: e.target.files[0] // Save file reference for later upload
    }));
  };

  const handleCourseChange = (event) => {
    const value = event.target.value;
    setEmployeeData((prevData) => ({
      ...prevData,
      course: prevData.course.includes(value)
        ? prevData.course.filter((item) => item !== value)
        : [...prevData.course, value]
    }));
  };
  const handleStatusChange = (e) => {
    if (e.target.value === "Active") {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }

  useEffect(() => {
    if (open && employeeId) {
      const fetchEmployeeData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`${BASE_URL}/admin/employeelist/${employeeId}`, {
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
      const formData = new FormData();
      formData.append("name", employeeData.name);
      formData.append("email", employeeData.email);
      formData.append("mobile", employeeData.mobile);
      formData.append("designation", employeeData.designation);
      formData.append("gender", employeeData.gender);
      employeeData.course.forEach((course) => formData.append("course[]", course));
      formData.append("isActive", isActive);
      if (employeeData.imagePath) {
        formData.append("imagePath", employeeData.imagePath);
      }

      await axios.put(`${BASE_URL}/admin/update-employee/${employeeId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data"
        },
      });
      onClose();
      refreshEmployees(); // Refresh the employee list
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
              label="Mobile"
              name="mobile"
              value={employeeData.mobile}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ margin: "2px" }}>Designation</InputLabel>
              <Select
                name="designation"
                value={employeeData.designation}
                onChange={handleChange}
              >
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
              </Select>
            </FormControl>
            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel component="legend">Course</FormLabel>
              <FormGroup row>
                {["MCA", "BCA", "BSC"].map((courseOption) => (
                  <FormControlLabel
                    key={courseOption}
                    control={
                      <Checkbox
                        checked={employeeData.course.includes(courseOption)}
                        onChange={handleCourseChange}
                        value={courseOption}
                      />
                    }
                    label={courseOption}
                  />
                ))}
              </FormGroup>
            </FormControl>
            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                name="gender"
                value={employeeData.gender}
                onChange={handleChange}
              >
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset" fullWidth margin="normal">
              <FormLabel component="legend">Status</FormLabel>
              <RadioGroup
                row
                name="status"
                value={isActive ? "Active" : "Inactive"}
                onChange={handleStatusChange}
              >
                <FormControlLabel value="Active" control={<Radio />} label="Active" />
                <FormControlLabel value="Inactive" control={<Radio />} label="Inactive" />
              </RadioGroup>
            </FormControl>
            <Button variant="contained" component="label" style={{ marginTop: 16 }}>
              Upload Image
              <input type="file" hidden onChange={handleImageUpload} />
            </Button>
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
