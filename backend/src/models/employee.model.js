const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image:{
      type: String,
      default: "https://res.cloudinary.com/dehpzebdo/image/upload/v1737095729/ao37pjh73k0y7c4h1lzs.jpg"  // Default profile picture
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
