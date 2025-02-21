const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Employee", "Admin"],
      default: "Employee",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
   
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
