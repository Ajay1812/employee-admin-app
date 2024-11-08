import React, { useState } from 'react';
import { TextField, Button, Box, FormControl, Typography, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, FormGroup, Select, MenuItem, InputLabel } from '@mui/material';
import { BASE_URL } from '../config';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export const CreateEmployee = () => {
  const navigate = useNavigate('')
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [designation, setDesignation] = useState('');
  const [gender, setGender] = useState('');
  const [course, setCourse] = useState([]);
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCourseChange = (event) => {
    const value = event.target.value;
    setCourse((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile', mobile);
    formData.append('designation', designation);
    formData.append('gender', gender);
    formData.append('course', JSON.stringify(course));
    if (image) {
      formData.append('imagePath', image);
    }

    try {
      const response = await fetch(`${BASE_URL}/admin/createemployee`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        setName('');
        setEmail('');
        setMobile('');
        setDesignation('');
        setGender('');
        setCourse([]);
        setImage(null);
        toast.success(`Employee added successfully`, {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        console.error('Error creating employee:');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '450px' }}
      >
        <Typography fontWeight={"bold"} marginBottom={"2rem"} variant="h4" align="center">Create Employee</Typography>

        <TextField label="Name" variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" type="email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Mobile No" type="tel" variant="outlined" fullWidth value={mobile} onChange={(e) => setMobile(e.target.value)} />

        <FormControl fullWidth >
          <InputLabel>Designation</InputLabel>
          <Select value={designation} onChange={(e) => setDesignation(e.target.value)} >
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Sales">Sales</MenuItem>
          </Select>
        </FormControl>

        {/* Gender Section */}
        <FormControl component="fieldset" style={{ width: '100%' }}>
          <FormLabel component="legend" style={{ textAlign: 'center' }}>Gender</FormLabel>
          <RadioGroup row style={{ justifyContent: 'center' }} value={gender} onChange={(e) => setGender(e.target.value)}>
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
          </RadioGroup>
        </FormControl>

        {/* Course Section */}
        <FormControl component="fieldset" style={{ width: '100%' }}>
          <FormLabel component="legend" style={{ textAlign: 'center' }}>Course</FormLabel>
          <FormGroup row style={{ justifyContent: 'center' }}>
            <FormControlLabel
              control={<Checkbox checked={course.includes('MCA')} onChange={handleCourseChange} />}
              label="MCA"
              value="MCA"
            />
            <FormControlLabel
              control={<Checkbox checked={course.includes('BCA')} onChange={handleCourseChange} />}
              label="BCA"
              value="BCA"
            />
            <FormControlLabel
              control={<Checkbox checked={course.includes('BSC')} onChange={handleCourseChange} />}
              label="BSC"
              value="BSC"
            />
          </FormGroup>
        </FormControl>

        <Button variant="contained" component="label">
          Upload Image
          <input type="file" hidden onChange={handleImageUpload} />
        </Button>
        <Button type="submit" variant="contained" color="success">
          Submit
        </Button>
      </form>
      <ToastContainer />
    </Box>
  );
};

export default CreateEmployee;
