const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true,lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobile: { type: Number, required: true, unique: true },
  designation: {
    type: String,
    enum: ["HR", "Manager", "Sales"],
    default: "HR",
    required: true
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true
  },
  course: {
    type: [String],  // Changed to an array of strings
    enum: ["MCA", "BCA", "BSC"],
  },
  imagePath: { type: String },
  createdAt: { type: Date, default: Date.now },
});


const Admin = mongoose.model("Admin", adminSchema)
const Employee = mongoose.model("Employee", employeeSchema)

module.exports = {
  Admin,
  Employee
};
