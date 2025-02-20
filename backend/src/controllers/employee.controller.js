const Employee = require("../models/employee.model");

exports.getLoggedEmployee = async (req, res) => {
  try {
    const employee = req.employee;
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findById(id).select(
      "-password -refreshToken -__v"
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    // if (req.employee.role !== "Admin") {
    //   return res.status(403).json({ message: "Unauthorized access" });
    // }

    let { search, role, limit, page } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);
    const skip = (page - 1) * limit;

    let filter = { _id: { $ne: req.employee._id } }; // Exclude logged-in user
    // Search filter (by name or department)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } }, // Case-insensitive search by name
        { department: { $regex: search, $options: "i" } }, // Case-insensitive search by department
      ];
    }

    // Role filter
    if (role) {
      filter.role = role;
    }

    // Fetch employees with filtering, pagination, and field exclusion
    const employees = await Employee.find(filter)
      .select("-password -refreshToken -__v")
      .limit(limit)
      .skip(skip);

    const totalEmployees = await Employee.countDocuments(filter); // Get total count for pagination

    res.status(200).json({
      employees,
      totalEmployees,
      totalPages: Math.ceil(totalEmployees / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const id = req.employee._id;
    const { name, email, department } = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        $set: {
          name: name || this.updateEmployee.name,
          email: email || this.updateEmployee.email,
          department: department || this.updateEmployee.department,
        },
      },
      { new: true }
    ).select("-password -refreshToken -__v");
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await updatedEmployee.save();
    res
      .status(200)
      .json({ updatedEmployee, message: "Employee udpdated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
