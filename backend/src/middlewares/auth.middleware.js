const jwt = require("jsonwebtoken");
const Employee = require("../models/employee.model");
require("dotenv").config();

// Middleware to verify JWT token
exports.verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Token is not provided" });
    }
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    
    const employee = await Employee.findById(decode?._id).select(
      "-password -refreshToken"
    );
    if (!employee) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    req.employee = employee;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
