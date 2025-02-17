const Employee = require("../models/employee");
const {
  hashPassword,
  comparePassword,
} = require("../services/hashAndComparePassword");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../services/generateToken");

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
    console.log(employee);

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
      httpOnly: true,
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
      httpOnly: true,
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
