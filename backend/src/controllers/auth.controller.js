const Employee = require("../models/employee.model");
const {
  hashPassword,
  comparePassword,
} = require("../services/hashAndComparePassword");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../services/generateToken");
const jwt = require("jsonwebtoken");

const generateAccessAndRefreshToken = async (employee) => {
  try {
    const accessToken = await generateAccessToken(employee);
    const refreshToken = await generateRefreshToken(employee);
    employee.refreshToken = refreshToken;
    await employee.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error generating tokens", error: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, department, role } = req.body;
    if (!name || !email || !password || !department || !role) {
      return res.status(400).json({ message: "All fields required." });
    }
    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee) {
      return res.status(400).json({ message: "Employee already exists." });
    }
    const hashedPassword = await hashPassword(password);

    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
      department,
      role,
    });

    await newEmployee.save();
    res.status(201).json({ message: "Employee registered!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating employee", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: "Employee not Found." });
    }

    const isMatch = await comparePassword(password, employee.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      employee
    );

    const loggedInEmployee = await Employee.findById(employee._id).select(
      "-password -refreshToken "
    );

    // set cookies options
    const options = {
      httpOnly: false,
      secure: true,
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Logged in successfully"
      });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

exports.logout = async (req, res) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Token is not provided" });
    }
    // const decode = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    const decode = jwt.decode(token);
    await Employee.findByIdAndUpdate(
      decode._id,
      { $unset: { refreshToken: "" } },
      { new: true }
    );

    const options = {
      httpOnly: false,
      secure: true,
    };
    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error logging out", error: err.message });
  }
};

exports.refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) {
    return res.status(400).json({ message: "No refresh token provided" });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
    const employee = await Employee.findById(decodedToken._id);

    if (incomingRefreshToken !== employee?.refreshToken) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      employee
    );

    // update refreshToken in database

    const options = {
      httpOnly: false,
      secure: true,
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Access token refreshed successfully"
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
