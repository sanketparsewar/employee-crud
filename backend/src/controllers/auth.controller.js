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
    console.log(req.body);
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
    console.log(newEmployee);

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
      return res.send(404).json({ message: "Employee not Found." });
    }
    // console.log(employee);

    const isMatch = await comparePassword(password, employee.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
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
        message: "Logged in successfully",
        employee: loggedInEmployee,
        accessToken,
        refreshToken,
      });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    await Employee.findByIdAndUpdate(
      req.employee._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
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
  // access refreshToken from cookies or body
  // if not got refreshToken then send 401 status
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  console.log("old token", incomingRefreshToken);
  if (!incomingRefreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
    console.log('decodedToken',decodedToken);
    const employee = await Employee.findById(decodedToken._id);
    console.log('employee',employee);

    if (incomingRefreshToken !== employee?.refreshToken) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }
    console.log('received and database refreshtoken same');

    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(employee);

    // update refreshToken in database
    console.log("new token", refreshToken);

    employee.refreshToken = refreshToken;
    await employee.save({ validateBeforeSave: false });
    console.log('employee new refreshtoken',employee);
    const options = {
      httpOnly: false,
      secure: true,
    };

    console.log('sending new access and refresh token');
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Access token refreshed successfully",
        accessToken,
        refreshToken,
      });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
