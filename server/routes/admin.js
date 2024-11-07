const {Admin, Employee} = require('../db/db.js')
const { SECRET, authenticateJwt } = require("../middlewares/auth.js");
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const upload = require("../middlewares/upload.js");
const bcrypt = require("bcrypt");
require("dotenv").config();

router.get("/me", authenticateJwt, async (req, res) => {
  const username = req.admin.username;
  const admin = await Admin.findOne({ username });
  if (admin) {
    res.status(201).json({ username: admin.username });
  } else {
    res.status(403).json({ message: "Admin not found" });
  }
});

router.post("/signup", async (req, res) => {
  const { username,  password } = req.body;
  const admin = await Admin.findOne({ username });
  if (admin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username,  password: hashedPassword });
    await newAdmin.save();
    const token = jwt.sign({ username, role: "admin" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Admin created successfully", token: token });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // console.log("Username:", username);
  // console.log("Password:", password);
  try {
    const admin = await Admin.findOne({ username });
    // console.log("USERNAME: ",admin)
    if (!admin) {
      return res.status(401).json({ message: "Username not found Please Signup." });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ username, role: "admin" }, SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Logged in successfully", token: token });
  } catch (error) {
    // console.error("Login error:", error);
    res.status(403).json({ message: "Login error", error });
  }
})

router.post('/createemployee', authenticateJwt, upload.single('imagePath'), async ( req, res)=>{
  try {
    const imagePath = req.file
        ? `/assets/images/${req.file.filename}`
        : null; 
    const newEmployee = new Employee({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      designation: req.body.designation,
      gender: req.body.gender,
      course: req.body.course,
      imagePath: imagePath
    })
    const saveEmployee = await Employee(newEmployee);
    await saveEmployee.save();
    res.status(201).json({ message: "Employee added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while save employee", error });
  }
})

router.get("/employeelist", authenticateJwt, async (req, res) => {
  try {
    const employeeList = await Employee.find({});
    res.status(200).json({ employeeList });
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
});

router.delete('/delete-employee/:id', authenticateJwt, async (req, res)=>{
  const { id } = req.params
  try {
    const deleteEmployee = await Employee.findByIdAndDelete(id)
    if (!deleteEmployee){
      return res.status(404).json({message: "Employee not found."})
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error });
  }
})

router.put('/update-employee/:id', authenticateJwt, upload.single('imagePath'), async (req, res)=>{
  const {id} = req.params
  const updatedEmployeeData = req.body
  try {
    if (req.file){
      updatedEmployeeData.imagePath = `/assets/images/${req.file.filename}`
    }
    // console.log("Updated Employee Data:", updatedEmployeeData);
    const updateEmployee = await Employee.findByIdAndUpdate(id, updatedEmployeeData, {new: true})
    if (!updateEmployee){
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({message: "Employee data updated successfully.", employee: updateEmployee})
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee data', error });
  }
})

module.exports = router;
